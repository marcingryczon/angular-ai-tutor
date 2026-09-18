/** Starts `ng serve taskflow` on a free port, waits for it, and stops it again. */
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';

/** Finds a port nobody is listening on, so a stray dev server cannot block a run. */
async function freePort(start = 4399) {
  for (let port = start; port < start + 40; port++) {
    const free = await new Promise((resolve) => {
      const probe = createServer();
      probe.once('error', () => resolve(false));
      probe.once('listening', () => probe.close(() => resolve(true)));
      probe.listen(port, '127.0.0.1');
    });
    if (free) return port;
  }
  throw new Error('No free port in the 4399–4438 range.');
}

export async function startDevServer({ port, timeoutMs = 120_000 } = {}) {
  port = port ?? (await freePort());
  const proc = spawn(
    'npx',
    ['ng', 'serve', 'taskflow', '--port', String(port), '--configuration', 'development'],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );

  let log = '';
  proc.stdout.on('data', (chunk) => (log += chunk));
  proc.stderr.on('data', (chunk) => (log += chunk));

  const url = `http://localhost:${port}/`;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (proc.exitCode !== null) {
      throw new Error(`ng serve exited with ${proc.exitCode}:\n${log.slice(-1500)}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) {
        return { url, stop: () => proc.kill('SIGTERM'), log: () => log };
      }
    } catch {
      /* not listening yet */
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  proc.kill('SIGTERM');
  throw new Error(`ng serve did not answer on ${url} in time:\n${log.slice(-1500)}`);
}
