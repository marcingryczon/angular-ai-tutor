#!/usr/bin/env node
/**
 * Milestone verification for TaskFlow.
 *
 *   npm run verify 7      → checks the "after phase 7" milestone from taskflow-spec.md §10
 *   npm run verify        → checks every phase whose files are already there
 *
 * A check either passes or explains exactly what it expected. Failures before you
 * have done that phase are normal — that is what the list is for.
 */
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { openBrowser } from './lib/browser.mjs';
import { startDevServer } from './lib/server.mjs';
import { foreignAngularRuns } from './lib/env.mjs';
import { runSuite } from './lib/tests.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const phasesDir = join(here, 'phases');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const OFF = '\x1b[0m';

async function loadPhase(number) {
  const file = readdirSync(phasesDir).find(
    (name) => name === `phase-${String(number).padStart(2, '0')}.mjs`,
  );
  if (!file) {
    throw new Error(`No verification for phase ${number}. Available: 0–14.`);
  }
  return (await import(join(phasesDir, file))).default;
}

async function runPhase(phase, context) {
  console.log(`\n${BOLD}Phase ${phase.phase} — ${phase.title}${OFF}`);
  console.log(`${DIM}${phase.milestone}${OFF}\n`);

  let passed = 0;
  const failures = [];
  for (const check of phase.checks) {
    try {
      await check.run(context);
      console.log(`  ${GREEN}✓${OFF} ${check.name}`);
      passed++;
    } catch (error) {
      console.log(`  ${RED}✗${OFF} ${check.name}`);
      // Every line, indented: a check that quotes a failing spec or a build log is useless if
      // only its first line survives.
      for (const line of error.message.split('\n')) {
        console.log(`      ${RED}${line}${OFF}`);
      }
      failures.push(check.name);
    }
  }

  console.log(
    `\n  ${passed}/${phase.checks.length} checks passed` +
      (failures.length
        ? ` ${DIM}(first failure: ${failures[0]})${OFF}`
        : ` ${GREEN}— milestone reached${OFF}`),
  );
  return failures.length === 0;
}

const requested = process.argv.slice(2).filter((arg) => /^\d+$/.test(arg));
const numbers = requested.length
  ? requested.map(Number)
  : readdirSync(phasesDir)
      .map((name) => Number(name.match(/\d+/)[0]))
      .sort((a, b) => a - b);

const phases = [];
for (const number of numbers) phases.push(await loadPhase(number));

const checksOf = (predicate) =>
  phases.some((phase) => phase.checks.some((check) => predicate(check)));

const needsApp = checksOf((check) => check.needsApp);
const suiteKinds = new Set(
  phases
    .flatMap((phase) => phase.checks)
    .filter((check) => check.needsSuite)
    .map((check) => check.needsSuite),
);

// Somebody else's `ng` is the one failure mode that looks like a broken app but is not one.
const foreign = foreignAngularRuns();
if (foreign.length) {
  console.log(`${RED}Another Angular CLI process is already running:${OFF}`);
  for (const { pid, command } of foreign) console.log(`  ${DIM}${pid}  ${command}${OFF}`);
  console.log(
    `${RED}It shares .angular/cache with this run, so specs can fail for reasons that have\n` +
      `nothing to do with your code. Stop it (or close the IDE test watcher) and run again.${OFF}\n`,
  );
}

// The unit suite runs first and alone — before the dev server exists — so two Angular builders
// are never working on this workspace at the same time.
if (suiteKinds.size) {
  console.log(`${DIM}Running the unit suite…${OFF}`);
  for (const kind of [...suiteKinds].sort()) {
    await runSuite({ coverage: kind === 'coverage' });
  }
}

let server;
let browser;

if (needsApp) {
  console.log(`${DIM}Starting the dev server (this takes a few seconds)…${OFF}`);
  server = await startDevServer();
  browser = await openBrowser();
}

const context = {
  url: server?.url,
  page: browser,
  /** Navigates to a route and lets the app settle. */
  async visit(path = '/') {
    await browser.goto(server.url + path.replace(/^\//, ''));
    return browser;
  },
  /**
   * Opens a Kanban board, wherever it lives: before Phase 7 the board *is* the
   * home page; afterwards the home page is the board list and we click through.
   */
  async visitBoard() {
    await browser.goto(server.url);
    await browser.evaluate(`
      const link = document.querySelector('.board-card__link');
      if (link) {
        link.click();
        await new Promise(r => setTimeout(r, 900));
      }
      return true;
    `);
    return browser;
  },
  async reset() {
    await browser.evaluate('localStorage.clear(); return true;');
  },
};

let allGreen = true;
try {
  for (const phase of phases) {
    const green = await runPhase(phase, context);
    allGreen = allGreen && green;
  }
} finally {
  // Always tear the tooling down, including when a check throws something unexpected —
  // a leaked dev server would block the next run.
  await browser?.close();
  server?.stop();
}

process.exit(allGreen ? 0 : 1);
