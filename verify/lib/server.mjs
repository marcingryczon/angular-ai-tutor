/** Starts `ng serve taskflow` on a free port, waits for it, and stops it again. */
import { spawn } from 'node:child_process';

export async function startDevServer({ port = 4399, timeoutMs = 90_000 } = {}) {
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
