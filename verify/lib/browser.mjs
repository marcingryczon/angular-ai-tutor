/**
 * Minimal Chrome DevTools Protocol driver.
 * Node 24 ships a global WebSocket, so the whole thing needs no dependencies —
 * which matters for a course: one less package to explain.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CANDIDATES = [
  process.env['CHROME_PATH'],
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

export async function openBrowser({ width = 1440, height = 900 } = {}) {
  const { existsSync } = await import('node:fs');
  const binary = CANDIDATES.find((candidate) => existsSync(candidate));
  if (!binary) {
    throw new Error(
      'Chrome not found. Set CHROME_PATH to your Chrome or Chromium binary and run again.',
    );
  }

  const port = 9500 + Math.floor(Math.random() * 400);
  const profile = mkdtempSync(join(tmpdir(), 'taskflow-verify-'));
  const proc = spawn(
    binary,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--hide-scrollbars',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      `--window-size=${width},${height}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  let target;
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      target = (await response.json()).find((entry) => entry.type === 'page');
      if (target) break;
    } catch {
      /* not up yet */
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  if (!target) {
    proc.kill();
    throw new Error('Chrome did not start in time.');
  }

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let messageId = 0;
  const pending = new Map();
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    const entry = pending.get(message.id);
    if (!entry) return;
    pending.delete(message.id);
    message.error
      ? entry.reject(new Error(JSON.stringify(message.error)))
      : entry.resolve(message.result);
  });

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++messageId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });

  await send('Page.enable');
  await send('Runtime.enable');

  return {
    async goto(url, { settleMs = 1500 } = {}) {
      await send('Page.navigate', { url });
      await new Promise((resolve) => setTimeout(resolve, settleMs));
    },
    /** Runs `body` inside the page and returns its value. `body` may await. */
    async evaluate(body) {
      const { result, exceptionDetails } = await send('Runtime.evaluate', {
        expression: `(async () => { ${body} })()`,
        awaitPromise: true,
        returnByValue: true,
      });
      if (exceptionDetails) {
        throw new Error(exceptionDetails.exception?.description ?? 'page threw');
      }
      return result.value;
    },
    async close() {
      try {
        socket.close();
      } catch {
        /* ignore */
      }
      proc.kill();
      try {
        rmSync(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
      } catch {
        // Chrome may still be flushing its profile; a temp dir left behind is harmless.
      }
    },
  };
}
