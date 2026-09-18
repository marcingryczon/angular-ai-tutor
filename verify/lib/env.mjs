/**
 * Guards against the one thing that makes a verification run untrustworthy: another Angular CLI
 * process working on the same workspace. `ng serve`, `ng test` and `ng build` all read and write
 * `.angular/cache`, so a second run — an IDE test watcher, a leftover dev server, a second
 * terminal — can make specs fail for reasons that have nothing to do with the code being checked.
 * A red check has to mean "your code is wrong", never "two builders fought over a cache".
 */
import { execFileSync } from 'node:child_process';

/** `ng serve|test|build …`, however it was launched (npm exec, npx, a direct binary). */
const ANGULAR_RUN = /(^|[/\s])(ng|npm exec ng)\s+(serve|test|build)\b|@angular\/build\/src\/builders/;

/** Angular CLI processes we did not start. Call before spawning any of our own. */
export function foreignAngularRuns() {
  try {
    const output = execFileSync('ps', ['-A', '-o', 'pid=,command='], { encoding: 'utf8' });
    return output
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [pid, ...rest] = line.split(/\s+/);
        return { pid: Number(pid), command: rest.join(' ') };
      })
      .filter((entry) => Number.isFinite(entry.pid) && entry.pid !== process.pid)
      // A shell whose command line merely *mentions* `ng serve` is the terminal that launched it,
      // not a second builder. Reporting it would point the reader at the wrong process.
      .filter((entry) => !/^\/(bin|usr\/bin)\/(z|ba|da)?sh\s+-c\b/.test(entry.command))
      .filter((entry) => ANGULAR_RUN.test(entry.command))
      .map((entry) => ({ pid: entry.pid, command: entry.command.slice(0, 90) }));
  } catch {
    return []; // No `ps` (Windows): the guard is a courtesy, not a requirement.
  }
}
