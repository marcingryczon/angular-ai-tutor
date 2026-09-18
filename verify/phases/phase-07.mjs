import { atLeast, fileContains, truthy } from '../lib/checks.mjs';

const APP = 'projects/taskflow/src/app';

export default {
  phase: 7,
  title: 'Routing & Navigation',
  milestone:
    'Routes per spec §3, board list with the create-board form, boardId as an input, boardResolver redirecting unknown ids, lazy routes with PreloadAllModules, role guard. (spec §10)',
  checks: [
    {
      name: 'every route is lazy and the wildcard redirects',
      run: () => {
        const source = fileContains(`${APP}/app.routes.ts`, 'loadComponent', 'lesson 7.6');
        truthy(source.includes("path: '**'"), 'no wildcard route (spec §3)');
        truthy(source.includes('boards/:boardId'), 'no board route (spec §3)');
      },
    },
    {
      name: 'route params arrive as component inputs and preloading is on',
      run: () => {
        fileContains(`${APP}/app.config.ts`, 'withComponentInputBinding', 'lesson 7.3');
        fileContains(`${APP}/app.config.ts`, 'PreloadAllModules', 'lesson 7.6');
      },
    },
    {
      name: 'the resolver redirects instead of rendering an empty board',
      run: () => fileContains(`${APP}/core/board.resolver.ts`, 'RedirectCommand', 'lesson 7.5'),
    },
    {
      name: 'the board list shows a card per board',
      needsApp: true,
      run: async ({ visit, page }) => {
        await visit('/');
        const found = await page.evaluate(`
          return {
            cards: document.querySelectorAll('.board-card__link').length,
            form: !!document.querySelector('.new-board'),
          };
        `);
        atLeast(found.cards, 2, 'board cards on / (spec §4)');
        truthy(found.form, 'no create-board form on / (spec §4)');
      },
    },
    {
      name: 'clicking a board opens its Kanban page',
      needsApp: true,
      run: async ({ page }) => {
        const found = await page.evaluate(`
          document.querySelector('.board-card__link').click();
          await new Promise(r => setTimeout(r, 900));
          return { path: location.pathname, columns: document.querySelectorAll('.column').length };
        `);
        truthy(found.path.startsWith('/boards/'), `expected /boards/:id, landed on ${found.path}`);
        truthy(found.columns === 4, 'the routed board does not show its four columns');
      },
    },
    {
      name: 'an unknown board id falls back to the list',
      needsApp: true,
      run: async ({ visit, page }) => {
        await visit('/boards/does-not-exist');
        const path = await page.evaluate('await new Promise(r => setTimeout(r, 700)); return location.pathname;');
        truthy(path === '/', `expected a redirect to /, landed on ${path}`);
      },
    },
  ],
};
