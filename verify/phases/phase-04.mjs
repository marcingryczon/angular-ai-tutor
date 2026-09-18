import { atLeast, equals, fileContains, truthy } from '../lib/checks.mjs';

const APP = 'projects/taskflow/src/app';

export default {
  phase: 4,
  title: 'Signals & Reactive State',
  milestone:
    'All state is signals; the filter bar works (search, priority, assignee, filtered count); persistence runs through an effect(). (spec §10)',
  checks: [
    {
      name: 'service state is held in signals',
      run: () => {
        fileContains(`${APP}/core/session.service.ts`, /signal</, 'lesson 4.1');
        fileContains(`${APP}/core/board.service.ts`, /signal</, 'lesson 4.1');
      },
    },
    {
      name: 'persistence happens in an effect(), not inside the mutations',
      run: () => fileContains(`${APP}/core/board.service.ts`, /effect\(/, 'lesson 4.3'),
    },
    {
      name: 'the filter bar filters, and the count follows',
      needsApp: true,
      run: async ({ visit, page }) => {
        await visit('/');
        const before = await page.evaluate("return document.querySelectorAll('.task-card').length;");
        atLeast(before, 2, 'cards before filtering');

        const after = await page.evaluate(`
          const input = document.querySelector('#board-search');
          if (!input) return null;
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
          setter.call(input, 'zzz-no-such-task');
          input.dispatchEvent(new Event('input', { bubbles: true }));
          await new Promise(r => setTimeout(r, 600));
          return {
            cards: document.querySelectorAll('.task-card').length,
            count: document.querySelector('.board__count')?.textContent.trim() ?? '',
          };
        `);
        truthy(after, 'no #board-search input — the filter bar is missing (spec §5.2)');
        equals(after.cards, 0, 'cards left after an impossible search');
        truthy(after.count.startsWith('0'), `the header count should read "0 task(s)", found "${after.count}"`);
      },
    },
    {
      name: 'the priority filter narrows the board',
      needsApp: true,
      run: async ({ visit, page }) => {
        await visit('/');
        const found = await page.evaluate(`
          const select = document.querySelector('#board-priority');
          if (!select) return null;
          const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set;
          setter.call(select, 'urgent');
          select.dispatchEvent(new Event('change', { bubbles: true }));
          await new Promise(r => setTimeout(r, 400));
          return document.querySelectorAll('.task-card').length;
        `);
        truthy(found !== null, 'no #board-priority select (spec §5.2)');
        equals(found, 1, 'urgent tasks on the seeded board');
      },
    },
  ],
};
