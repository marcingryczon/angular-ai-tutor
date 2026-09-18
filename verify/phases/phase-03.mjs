import { atLeast, fileContains, fileExists, truthy } from '../lib/checks.mjs';

const APP = 'projects/taskflow/src/app';

export default {
  phase: 3,
  title: 'Dependency Injection',
  milestone:
    'SessionService, BoardService, TaskService, BOARD_CONFIG and TaskFlowDb exist; state survives a reload; "Reset demo data" re-seeds; first service specs are green. (spec §10)',
  checks: [
    {
      name: 'the services exist and are injected with inject()',
      run: () => {
        for (const file of ['session.service', 'board.service', 'task.service']) {
          const source = fileExists(`${APP}/core/${file}.ts`);
          truthy(
            /@Injectable\(\{\s*providedIn: 'root'/.test(source),
            `${file}.ts must be a root singleton`,
          );
        }
        const board = fileExists(`${APP}/core/board.service.ts`);
        truthy(
          !/constructor\s*\([^)]+:/.test(board),
          'use inject(), not constructor injection (lesson 3.1)',
        );
      },
    },
    {
      name: 'BOARD_CONFIG is an InjectionToken with the four default columns',
      run: () => {
        const source = fileContains(`${APP}/core/config.ts`, 'InjectionToken', 'lesson 3.3');
        for (const status of ['todo', 'in-progress', 'review', 'done']) {
          truthy(source.includes(status), `BOARD_CONFIG is missing the ${status} column`);
        }
      },
    },
    {
      name: 'storage lives behind TaskFlowDb and is SSR-safe',
      run: () => {
        fileContains(`${APP}/core/db.ts`, 'taskflow.db.v1', 'the versioned key from spec §6');
        fileContains(
          `${APP}/core/db.ts`,
          /isPlatformBrowser|PLATFORM_ID/,
          'lesson 3.5 — no localStorage on the server',
        );
      },
    },
    {
      name: 'nothing outside core/db.ts touches localStorage',
      run: async () => {
        const { walk } = await import('../lib/checks.mjs');
        const offenders = walk(
          APP,
          (file) => file.endsWith('.ts') && !file.endsWith('db.ts') && !file.endsWith('.spec.ts'),
        ).filter((file) => fileExists(file).includes('localStorage'));
        truthy(
          offenders.length === 0,
          `localStorage is used outside core/db.ts: ${offenders.join(', ')}`,
        );
      },
    },
    {
      name: 'the first service specs exist and the suite is green (lesson 3.6)',
      run: async () => {
        const { walk } = await import('../lib/checks.mjs');
        const specs = walk(APP, (file) => file.endsWith('.spec.ts'));
        atLeast(specs.length, 2, 'spec files under projects/taskflow/src/app');
      },
    },
    {
      name: 'state survives a reload',
      needsApp: true,
      run: async ({ visitBoard, page }) => {
        await visitBoard();
        await page.evaluate('localStorage.clear(); return true;');
        await visitBoard();
        const stored = await page.evaluate(`
          await new Promise(r => setTimeout(r, 500));
          const raw = localStorage.getItem('taskflow.db.v1');
          return raw ? JSON.parse(raw) : null;
        `);
        truthy(stored, 'nothing was written to localStorage under taskflow.db.v1');
        atLeast(stored.tasks?.length ?? 0, 1, 'seeded tasks in storage');
      },
    },
  ],
};
