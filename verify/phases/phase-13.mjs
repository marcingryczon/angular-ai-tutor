import { atLeast, fileContains, fileExists, fileMissing, json, truthy, walk } from '../lib/checks.mjs';

const APP = 'projects/taskflow/src/app';

export default {
  phase: 13,
  title: 'Global State Management with NgRx',
  milestone:
    'State managed by @ngrx/store (core/ngrx/); the signal stores are deleted; DevTools on in dev; the ADR records the verdict. No visual change. (spec §10)',
  checks: [
    {
      name: '@ngrx/store is installed',
      run: () => {
        const pkg = json('package.json');
        truthy(pkg.dependencies?.['@ngrx/store'], 'run: ng add @ngrx/store');
      },
    },
    {
      name: 'the feature slices exist with actions, a reducer and selectors',
      run: () => {
        for (const slice of ['task', 'board']) {
          const source = fileExists(`${APP}/core/ngrx/${slice}.store.ts`);
          truthy(source.includes('createActionGroup'), `${slice}.store.ts has no action group (lesson 13.2)`);
          truthy(source.includes('createReducer'), `${slice}.store.ts has no reducer (lesson 13.3)`);
          truthy(source.includes('createSelector'), `${slice}.store.ts has no composed selector (lesson 13.4)`);
          truthy(source.includes('createFeature'), `${slice}.store.ts should use createFeature (lesson 13.5)`);
        }
      },
    },
    {
      name: 'the reducers are pure (no id or timestamp generation inside)',
      run: () => {
        for (const slice of ['task', 'board']) {
          const source = fileExists(`${APP}/core/ngrx/${slice}.store.ts`);
          const reducer = source.slice(source.indexOf('createReducer'));
          truthy(
            !/newId\(|Math\.random|Date\.now\(/.test(reducer),
            `${slice}.store.ts generates ids or timestamps inside the reducer — build them before the dispatch (lesson 13.5)`,
          );
        }
      },
    },
    {
      name: 'the old signal stores are gone',
      run: () => {
        fileMissing(`${APP}/core/task.store.ts`, 'replaced by core/ngrx/task.store.ts (lesson 13.8)');
        fileMissing(`${APP}/core/board.store.ts`, 'replaced by core/ngrx/board.store.ts (lesson 13.8)');
      },
    },
    {
      name: 'components read through selectors and dispatch actions',
      run: () => {
        const board = fileExists(`${APP}/features/board/board.ts`);
        truthy(board.includes('selectSignal'), 'Board should read state with store.selectSignal() (lesson 13.4)');
        truthy(board.includes('dispatch('), 'Board should change state by dispatching (lesson 13.5)');
      },
    },
    {
      name: 'DevTools are wired for a zoneless app',
      run: () => {
        const config = fileContains(`${APP}/app.config.ts`, 'provideStoreDevtools', 'lesson 13.6');
        truthy(config.includes('connectInZone: false'), 'zoneless apps need connectInZone: false (lesson 13.6)');
      },
    },
    {
      name: 'reducers and selectors are covered by tests',
      run: () => {
        const specs = walk(`${APP}/core/ngrx`, (file) => file.endsWith('.spec.ts'));
        atLeast(specs.length, 2, 'spec files under core/ngrx (lesson 13.7)');
      },
    },
    {
      name: 'the ADR records whether NgRx was worth it',
      run: () => {
        const adr = fileExists('course/adr/001-state-management.md');
        atLeast(adr.length, 400, 'characters in the ADR — it is the deliverable of the phase (lesson 13.9)');
      },
    },
    {
      name: 'the app still behaves exactly as before',
      needsApp: true,
      run: async ({ visit, page }) => {
        await visit('/');
        const found = await page.evaluate(`
          const link = document.querySelector('.board-card__link');
          if (!link) return null;
          link.click();
          await new Promise(r => setTimeout(r, 900));
          const before = document.querySelectorAll('.task-card').length;
          const select = document.querySelector('#board-priority');
          const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set;
          setter.call(select, 'urgent');
          select.dispatchEvent(new Event('change', { bubbles: true }));
          await new Promise(r => setTimeout(r, 400));
          return { before, filtered: document.querySelectorAll('.task-card').length };
        `);
        truthy(found, 'the board list did not render');
        atLeast(found.before, 2, 'cards on the board after the migration');
        truthy(found.filtered < found.before, 'filtering stopped working after the migration');
      },
    },
  ],
};
