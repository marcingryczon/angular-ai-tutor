import { atLeast, fileContains, json, truthy } from '../lib/checks.mjs';

const APP = 'projects/taskflow/src/app';

export default {
  phase: 5,
  title: 'RxJS, HTTP & Async Patterns',
  milestone:
    'The seed comes from public/seed.json through httpResource(); the search is debounced; core/task.store.ts and core/board.store.ts own the state. (spec §10)',
  checks: [
    {
      name: 'public/seed.json holds the demo data with dueInDays offsets',
      run: () => {
        const seed = json('projects/taskflow/public/seed.json');
        atLeast(seed.users?.length ?? 0, 2, 'seeded users');
        atLeast(seed.boards?.length ?? 0, 2, 'seeded boards');
        atLeast(seed.taskTemplates?.length ?? 0, 5, 'seeded task templates');
        truthy(
          seed.taskTemplates.some((task) => typeof task.dueInDays === 'number'),
          'due dates must be dueInDays offsets so the demo always looks current (spec §7.3)',
        );
      },
    },
    {
      name: 'HttpClient is provided with fetch and an interceptor',
      run: () => {
        fileContains(`${APP}/app.config.ts`, 'provideHttpClient', 'lesson 5.3');
        fileContains(`${APP}/app.config.ts`, 'withFetch', 'lesson 5.3');
      },
    },
    {
      name: 'the seed is loaded declaratively with httpResource()',
      run: async () => {
        const { walk, fileExists } = await import('../lib/checks.mjs');
        const uses = walk(`${APP}/core`, (file) => file.endsWith('.ts')).filter((file) =>
          fileExists(file).includes('httpResource'),
        );
        truthy(uses.length > 0, 'no httpResource() anywhere in core/ (lesson 5.6)');
      },
    },
    {
      name: 'the stores own the state and the services stayed thin',
      // After Phase 13 the store is the NgRx slice, so either shape counts — what must
      // hold is that state lives in a store and not in the data-access services.
      run: async () => {
        const { walk, fileExists, atLeast, truthy } = await import('../lib/checks.mjs');
        const stores = walk(
          `${APP}/core`,
          (file) => /store\.ts$/.test(file) && !file.endsWith('.spec.ts'),
        );
        atLeast(
          stores.length,
          2,
          'store files in core/ — one for tasks, one for boards (lesson 5.7)',
        );

        const stateful = ['task.service.ts', 'board.service.ts']
          .map((name) => `${APP}/core/${name}`)
          .filter((file) => {
            try {
              return /\bsignal</.test(fileExists(file));
            } catch {
              return false;
            }
          });
        truthy(
          stateful.length === 0,
          `state moved to the stores in 5.7, but it is still held in: ${stateful.join(', ')}`,
        );
      },
    },
    {
      name: 'the search is debounced (typing does not filter instantly)',
      needsApp: true,
      run: async ({ visitBoard, page }) => {
        await visitBoard();
        const found = await page.evaluate(`
          const input = document.querySelector('#board-search');
          if (!input) return null;
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
          const before = document.querySelectorAll('.task-card').length;
          setter.call(input, 'zzz-no-such-task');
          input.dispatchEvent(new Event('input', { bubbles: true }));
          await new Promise(r => setTimeout(r, 80));
          const immediate = document.querySelectorAll('.task-card').length;
          await new Promise(r => setTimeout(r, 600));
          return { before, immediate, settled: document.querySelectorAll('.task-card').length };
        `);
        truthy(found, 'no #board-search input');
        truthy(
          found.immediate === found.before,
          'the board filtered within 80ms — the search is not debounced (lesson 5.2/5.4)',
        );
        truthy(
          found.settled === 0,
          'after the debounce the impossible search should leave no cards',
        );
      },
    },
  ],
};
