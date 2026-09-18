/**
 * Runs the project's own unit suite. A check that only counts spec files says nothing about
 * whether they pass, and the coverage milestone is a measurement, not a setting — so the
 * checks that claim "the suite is green" have to actually run it.
 */
import { spawn } from 'node:child_process';

let cached = new Map();

function run(args) {
  return new Promise((resolve) => {
    const child = spawn('npx', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));
    child.on('close', (code) => resolve({ ok: code === 0, output }));
  });
}

/**
 * `coverage: true` re-runs with coverage on, which makes the builder enforce the thresholds in
 * angular.json — so the run failing *is* the assertion that coverage is high enough.
 * Results are cached per argument set: two phases asking for the same run only pay for it once.
 */
export async function runSuite({ project = 'taskflow', coverage = false } = {}) {
  const args = ['ng', 'test', project, '--no-watch'];
  if (coverage) args.push('--coverage');
  const key = args.join(' ');
  if (!cached.has(key)) cached.set(key, run(args));
  return cached.get(key);
}

/** The last few meaningful lines, so a failure message points at the failing spec. */
export function tail(output, lines = 12) {
  return output
    .replace(/\x1b\[[0-9;]*m/g, '')
    .split('\n')
    .filter((line) => line.trim())
    .slice(-lines)
    .join('\n');
}
