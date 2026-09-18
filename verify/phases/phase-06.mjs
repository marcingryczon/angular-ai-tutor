import { equals, fileContains, truthy } from '../lib/checks.mjs';

const APP = 'projects/taskflow/src/app';

export default {
  phase: 6,
  title: 'Forms',
  milestone:
    'The task form (Signal Forms) opens in the modal for create and edit; the title is required and duplicates are rejected; the view modal shows the detail. (spec §10)',
  checks: [
    {
      name: 'the task form is a Signal Form',
      run: () => {
        fileContains(`${APP}/features/board/task-form.ts`, '@angular/forms/signals', 'lesson 6.2');
        fileContains(`${APP}/features/board/task-form.ts`, /form\(/, 'lesson 6.2');
        fileContains(`${APP}/features/board/task-form.html`, 'formField', 'bind with [formField]');
      },
    },
    {
      name: 'the form is not a legacy reactive form',
      run: async () => {
        const { fileExists } = await import('../lib/checks.mjs');
        const source = fileExists(`${APP}/features/board/task-form.ts`);
        truthy(
          !/FormGroup|FormBuilder|FormControl\b/.test(source),
          'Signal Forms replace FormGroup / FormControl entirely (lesson 6.3)',
        );
      },
    },
    {
      name: '"New task" opens a modal whose submit starts disabled',
      needsApp: true,
      run: async ({ visit, page }) => {
        await visit('/');
        const found = await page.evaluate(`
          const button = [...document.querySelectorAll('button')].find(b => b.textContent.includes('New task'));
          if (!button) return null;
          button.click();
          await new Promise(r => setTimeout(r, 600));
          const submit = document.querySelector('.task-form .btn--primary');
          return {
            hasForm: !!document.querySelector('.task-form'),
            hasTitle: !!document.querySelector('#task-title'),
            disabled: submit ? submit.disabled : null,
          };
        `);
        truthy(found, 'no "New task" button on the board (spec §5.1)');
        truthy(found.hasForm && found.hasTitle, 'the modal does not contain the task form');
        equals(found.disabled, true, 'the submit button with an empty title');
      },
    },
    {
      name: 'a filled form creates a task and closes the modal',
      needsApp: true,
      run: async ({ page }) => {
        const found = await page.evaluate(`
          const title = document.querySelector('#task-title');
          if (!title) return null;
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
          setter.call(title, 'Verification task');
          title.dispatchEvent(new Event('input', { bubbles: true }));
          await new Promise(r => setTimeout(r, 300));
          document.querySelector('.task-form .btn--primary').click();
          await new Promise(r => setTimeout(r, 600));
          return {
            closed: !document.querySelector('.modal__panel'),
            created: document.body.innerText.includes('Verification task'),
          };
        `);
        truthy(found, 'the form was not open');
        truthy(found.created, 'the new task is not on the board');
        truthy(found.closed, 'the modal stayed open after a successful submit');
      },
    },
  ],
};
