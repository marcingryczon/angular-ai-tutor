import { atLeast, equals, fileContains, truthy } from '../lib/checks.mjs';

const APP = 'projects/taskflow/src/app';

export default {
  phase: 1,
  title: 'Standalone Components & Templates',
  milestone:
    'Design tokens in styles.scss, static topbar, one hardcoded board rendered through board → column → task-card. (spec §10)',
  checks: [
    {
      name: 'styles.scss carries the §1.2 design tokens',
      run: () => {
        const source = fileContains('projects/taskflow/src/styles.scss', '--primary: #3b6fe0');
        for (const token of [
          '--bg: #f3f5f9',
          '--radius: 12px',
          '--priority-urgent: #e0455a',
          '--shadow-sm',
        ]) {
          truthy(source.includes(token), `styles.scss is missing the token ${token}`);
        }
      },
    },
    {
      name: 'index.html loads Material Symbols Rounded',
      run: () => fileContains('projects/taskflow/src/index.html', 'Material+Symbols+Rounded'),
    },
    {
      name: 'components keep template and styles in their own files',
      run: () => {
        for (const file of [
          'features/board/board',
          'features/board/column',
          'features/board/task-card',
        ]) {
          fileContains(`${APP}/${file}.ts`, 'templateUrl', 'no inline templates (CLAUDE.md)');
          fileContains(`${APP}/${file}.ts`, 'styleUrl', 'no inline styles (CLAUDE.md)');
        }
      },
    },
    {
      name: 'the board renders four columns with cards',
      needsApp: true,
      run: async ({ visitBoard }) => {
        const page = await visitBoard();
        const found = await page.evaluate(`
          return {
            columns: document.querySelectorAll('.column').length,
            cards: document.querySelectorAll('.task-card').length,
          };
        `);
        equals(found.columns, 4, 'number of .column elements');
        atLeast(found.cards, 1, 'number of .task-card elements');
      },
    },
    {
      name: 'the topbar is sticky, 57px tall, and the page is centred at 1440px',
      needsApp: true,
      run: async ({ page }) => {
        const found = await page.evaluate(`
          const bar = document.querySelector('.topbar');
          const page = document.querySelector('.page');
          if (!bar || !page) return null;
          const bs = getComputedStyle(bar);
          return { height: bs.height, position: bs.position, maxWidth: getComputedStyle(page).maxWidth };
        `);
        truthy(found, 'no .topbar / .page in the DOM (spec §2)');
        equals(found.height, '57px', 'topbar height');
        equals(found.position, 'sticky', 'topbar position');
        equals(found.maxWidth, '1440px', '.page max-width');
      },
    },
    {
      name: 'the four columns fit without a horizontal scrollbar (spec §5.3)',
      needsApp: true,
      run: async ({ page }) => {
        const scrolls = await page.evaluate(
          'return document.documentElement.scrollWidth > document.documentElement.clientWidth;',
        );
        truthy(!scrolls, 'the board scrolls horizontally — the columns must shrink to fit');
      },
    },
  ],
};
