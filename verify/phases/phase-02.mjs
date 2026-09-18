import { atLeast, fileContains, truthy } from '../lib/checks.mjs';

const APP = 'projects/taskflow/src/app';

export default {
  phase: 2,
  title: 'Component Communication',
  milestone:
    'Data flows through input(); cards emit edit/delete; quick-add emits on Enter; role switch uses model(); modal shell exists; drag & drop moves cards. (spec §10)',
  checks: [
    {
      name: 'the tree is wired with input() and output()',
      run: () => {
        fileContains(
          `${APP}/features/board/task-card.ts`,
          /task = input(\.required)?</,
          'lesson 2.1',
        );
        fileContains(`${APP}/features/board/task-card.ts`, /output</, 'lesson 2.2');
        fileContains(
          `${APP}/features/board/column.ts`,
          /tasks = input(\.required)?</,
          'lesson 2.1',
        );
      },
    },
    {
      name: 'the role switch is its own component using model()',
      run: () => fileContains(`${APP}/shared/role-switch.ts`, /model</, 'lesson 2.3'),
    },
    {
      name: 'the modal projects its body and is controlled from outside',
      run: () => {
        fileContains(`${APP}/shared/modal.ts`, /input(\.required)?</, 'the title is an input');
        fileContains(`${APP}/shared/modal.html`, '<ng-content', 'lesson 2.4');
      },
    },
    {
      name: 'cards are draggable and columns accept a drop',
      run: () => {
        fileContains(`${APP}/features/board/task-card.ts`, /dragstart/, 'lesson 2.5');
        fileContains(`${APP}/features/board/column.ts`, /drop|dataTransfer/, 'lesson 2.5');
      },
    },
    {
      name: 'the board still renders and the quick-add row is there',
      needsApp: true,
      run: async ({ visitBoard }) => {
        const page = await visitBoard();
        const found = await page.evaluate(`
          return {
            cards: document.querySelectorAll('.task-card').length,
            quickAdd: document.querySelectorAll('.column__quick-add-input').length,
            draggable: document.querySelectorAll('[draggable="true"]').length,
          };
        `);
        atLeast(found.cards, 1, 'cards on the board');
        atLeast(found.quickAdd, 4, 'quick-add inputs (one per column)');
        atLeast(found.draggable, 1, 'draggable cards');
      },
    },
  ],
};
