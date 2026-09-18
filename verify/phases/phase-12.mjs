import { atLeast, fileExists, truthy, walk } from '../lib/checks.mjs';

const APP = 'projects/taskflow/src/app';

export default {
  phase: 12,
  title: 'Accessibility & Polish',
  milestone:
    'ARIA structure on board/columns/cards, a modal with focus trap, Escape, focus restore and scroll lock, a keyboard alternative to dragging, enter/leave animations with a reduced-motion fallback. (spec §10)',
  checks: [
    {
      name: 'the modal traps focus, restores it and closes on Escape',
      run: () => {
        const source = fileExists(`${APP}/shared/modal.ts`);
        truthy(/escape/i.test(source), 'the modal does not handle Escape (spec §5.6)');
        truthy(source.includes('afterNextRender'), 'focus must move into the dialog after it renders');
        truthy(/overflow/.test(source), 'body scroll is not locked while the dialog is open');
      },
    },
    {
      name: 'enter/leave animations use the modern API and respect reduced motion',
      run: () => {
        const templates = walk(APP, (file) => file.endsWith('.html'));
        truthy(
          templates.some((file) => /animate\.(enter|leave)/.test(fileExists(file))),
          'no animate.enter / animate.leave anywhere (lesson 12.3)',
        );
        const styles = walk(APP, (file) => file.endsWith('.scss'));
        truthy(
          styles.some((file) => fileExists(file).includes('prefers-reduced-motion')),
          'animations must be disabled under prefers-reduced-motion (lesson 12.3)',
        );
      },
    },
    {
      name: 'the legacy animations package is not used',
      run: () => {
        const offenders = walk(APP, (file) => file.endsWith('.ts')).filter((file) =>
          fileExists(file).includes('@angular/animations'),
        );
        truthy(offenders.length === 0, `@angular/animations is deprecated: ${offenders.join(', ')}`);
      },
    },
    {
      name: 'the board exposes a list structure and labelled icon buttons',
      needsApp: true,
      run: async ({ visit, page }) => {
        await visit('/');
        await page.evaluate(`
          const link = document.querySelector('.board-card__link');
          if (link) { link.click(); await new Promise(r => setTimeout(r, 900)); }
          return true;
        `);
        const found = await page.evaluate(`
          const iconButtons = [...document.querySelectorAll('.task-card .icon-btn')];
          return {
            lists: document.querySelectorAll('[role="list"]').length,
            items: document.querySelectorAll('[role="listitem"]').length,
            unlabelled: iconButtons.filter(b => !b.getAttribute('aria-label') && !b.getAttribute('aria-labelledby')).length,
            live: document.querySelectorAll('[aria-live]').length,
          };
        `);
        atLeast(found.lists, 1, 'elements with role="list"');
        atLeast(found.items, 1, 'elements with role="listitem"');
        truthy(found.unlabelled === 0, `${found.unlabelled} icon buttons have no accessible name`);
        atLeast(found.live, 1, 'live regions (the task count should announce itself)');
      },
    },
    {
      name: 'a task can be moved without a mouse',
      needsApp: true,
      run: async ({ page }) => {
        const found = await page.evaluate(`
          const card = document.querySelector('.task-card');
          if (!card) return null;
          const buttons = [...card.querySelectorAll('button')];
          const move = buttons.find(b => /move/i.test(b.getAttribute('aria-label') || ''));
          if (!move) return { menu: false };
          move.click();
          await new Promise(r => setTimeout(r, 300));
          return { menu: !!card.querySelector('[role="menu"], .task-card__menu') };
        `);
        truthy(found, 'no task cards on the board');
        truthy(found.menu, 'no keyboard alternative to drag & drop on the card (lesson 12.2)');
      },
    },
    {
      name: 'focus moves into the dialog and comes back when it closes',
      needsApp: true,
      run: async ({ page }) => {
        const found = await page.evaluate(`
          const opener = [...document.querySelectorAll('button')].find(b => b.textContent.includes('New task'));
          if (!opener) return null;
          opener.focus();
          opener.click();
          await new Promise(r => setTimeout(r, 700));
          const panel = document.querySelector('.modal__panel');
          const inside = panel ? panel.contains(document.activeElement) : false;
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
          await new Promise(r => setTimeout(r, 700));
          return {
            inside,
            closed: !document.querySelector('.modal__panel'),
            restored: document.activeElement === opener,
          };
        `);
        truthy(found, 'no "New task" button');
        truthy(found.inside, 'focus stayed outside the dialog when it opened');
        truthy(found.closed, 'Escape did not close the dialog');
        truthy(found.restored, 'focus was not restored to the element that opened the dialog');
      },
    },
  ],
};
