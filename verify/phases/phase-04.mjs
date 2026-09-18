import { atLeast, equals, fileExists, truthy, walk } from '../lib/checks.mjs';

const APP = 'projects/taskflow/src/app';

export default {
  phase: 4,
  title: 'Signals & Reactive State',
  milestone:
    'All state is signals; the filter bar works (search, priority, assignee, filtered count); persistence runs through an effect(). (spec §10)',
  checks: [
    {
      name: 'state is held in signals',
      // Checked across core/ rather than in one file: later phases move the state
      // from the services into a store, and a milestone once reached must stay reached.
      run: () => {
        const holders = walk(
          `${APP}/core`,
          (file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'),
        ).filter((file) => /\bsignal</.test(fileExists(file)));
        atLeast(holders.length, 1, 'files in core/ holding state in signals (lesson 4.1)');
      },
    },
    {
      name: 'persistence happens in an effect(), not inside the mutations',
      run: () => {
        const effects = walk(
          `${APP}/core`,
          (file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'),
        ).filter((file) => {
          const source = fileExists(file);
          return /\beffect\(/.test(source) && /persist|save\(/.test(source);
        });
        atLeast(effects.length, 1, 'a persistence effect() in core/ (lesson 4.3)');
      },
    },
    {
      name: 'the filter bar filters, and the count follows',
      needsApp: true,
      run: async ({ visitBoard, page }) => {
        await visitBoard();
        const before = await page.evaluate(
          "return document.querySelectorAll('.task-card').length;",
        );
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
        truthy(
          after.count.startsWith('0'),
          `the header count should read "0 task(s)", found "${after.count}"`,
        );
      },
    },
    {
      name: 'the priority filter narrows the board',
      needsApp: true,
      run: async ({ visitBoard, page }) => {
        await visitBoard();
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
