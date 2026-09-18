import { fileContains, fileExists, truthy } from '../lib/checks.mjs';

const APP = 'projects/taskflow/src/app';

export default {
  phase: 9,
  title: 'Directives & Pipes',
  milestone:
    '*adminOnly hides the admin actions, [priorityHighlight] accents the cards, DueDatePipe and PriorityLabelPipe are used in templates. (spec §10)',
  checks: [
    {
      name: 'the structural directive renders through a TemplateRef',
      run: () => {
        const source = fileContains(
          `${APP}/shared/directives/admin-only.directive.ts`,
          'TemplateRef',
          'lesson 9.1',
        );
        truthy(
          source.includes('ViewContainerRef'),
          'a structural directive needs a ViewContainerRef',
        );
      },
    },
    {
      name: 'the attribute directive binds through host metadata',
      run: () => {
        const source = fileExists(`${APP}/shared/directives/priority-highlight.directive.ts`);
        truthy(source.includes('host:'), 'use host metadata, not @HostBinding (lesson 9.2)');
        truthy(
          !/@HostBinding|@HostListener/.test(source),
          '@HostBinding / @HostListener are legacy',
        );
      },
    },
    {
      name: 'both pipes exist and are pure',
      run: () => {
        for (const pipe of ['due-date', 'priority-label']) {
          const source = fileExists(`${APP}/shared/pipes/${pipe}.pipe.ts`);
          truthy(!/pure:\s*false/.test(source), `${pipe}.pipe.ts should stay pure (lesson 9.3)`);
        }
      },
    },
    {
      name: 'the inline role check is gone from the board template',
      run: () => {
        const template = fileExists(`${APP}/features/board/board.html`);
        truthy(template.includes('adminOnly'), 'the board should use *adminOnly (lesson 9.1)');
        truthy(
          !/@if\s*\(\s*session\.isAdmin\(\)\s*\)/.test(template),
          'the inline isAdmin() check should have been replaced by *adminOnly',
        );
      },
    },
    {
      name: 'members do not see the admin actions, admins do',
      needsApp: true,
      run: async ({ visitBoard, page }) => {
        await visitBoard();
        const found = await page.evaluate(`
          const select = document.querySelector('.role-switch__select, .topbar__role-select');
          if (!select) return null;
          const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set;
          setter.call(select, 'member');
          select.dispatchEvent(new Event('change', { bubbles: true }));
          await new Promise(r => setTimeout(r, 400));
          const asMember = document.body.innerText.includes('Delete board');
          setter.call(select, 'admin');
          select.dispatchEvent(new Event('change', { bubbles: true }));
          await new Promise(r => setTimeout(r, 400));
          return { asMember, asAdmin: document.body.innerText.includes('Delete board') };
        `);
        truthy(found, 'no role switch in the topbar (spec §2)');
        truthy(!found.asMember, 'members can see "Delete board" — *adminOnly is not applied');
        truthy(found.asAdmin, 'admins cannot see "Delete board"');
      },
    },
    {
      name: 'due dates are rendered through the pipe',
      needsApp: true,
      run: async ({ page }) => {
        const text = await page.evaluate(`
          return [...document.querySelectorAll('.task-card__due')].map(e => e.textContent.trim()).join(' | ');
        `);
        truthy(
          /[A-Z][a-z]{2} \d{1,2}, \d{4}/.test(text) || /no due date/.test(text),
          `expected "Aug 22, 2026" formatting, found: ${text}`,
        );
      },
    },
  ],
};
