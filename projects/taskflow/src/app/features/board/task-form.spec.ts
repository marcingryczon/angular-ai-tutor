import { TestBed } from '@angular/core/testing';
import { Task, User } from '../../core/models';
import { TaskForm, TaskFormValue } from './task-form';

const USERS: User[] = [{ id: 'u_1', name: 'Ada', email: 'ada@taskflow.dev', role: 'member' }];

const TASK: Task = {
  id: 't1',
  boardId: 'b1',
  columnId: 'c1',
  title: 'Existing task',
  description: 'desc',
  priority: 'high',
  dueDate: '2026-08-22',
  assigneeId: 'u_1',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

async function render(options: { task?: Task; existingTitles?: string[] } = {}) {
  const fixture = TestBed.createComponent(TaskForm);
  fixture.componentRef.setInput('task', options.task);
  fixture.componentRef.setInput('users', USERS);
  fixture.componentRef.setInput('existingTitles', options.existingTitles ?? []);
  await fixture.whenStable();
  return fixture;
}

function type(fixture: Awaited<ReturnType<typeof render>>, selector: string, value: string) {
  const input = fixture.nativeElement.querySelector(selector) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event('input'));
  input.dispatchEvent(new Event('blur'));
  return input;
}

describe('TaskForm', () => {
  it('starts empty for a new task and disables the submit button', async () => {
    const fixture = await render();
    const element: HTMLElement = fixture.nativeElement;

    expect((element.querySelector('#task-title') as HTMLInputElement).value).toBe('');
    const submit = element.querySelector('.btn--primary') as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
    expect(submit.textContent).toContain('Add task');
  });

  it('prefills the fields when editing', async () => {
    const fixture = await render({ task: TASK });
    const element: HTMLElement = fixture.nativeElement;

    expect((element.querySelector('#task-title') as HTMLInputElement).value).toBe('Existing task');
    expect((element.querySelector('#task-priority') as HTMLSelectElement).value).toBe('high');
    expect((element.querySelector('#task-due') as HTMLInputElement).value).toBe('2026-08-22');
    expect((element.querySelector('#task-assignee') as HTMLSelectElement).value).toBe('u_1');
    expect(element.querySelector('.btn--primary')?.textContent).toContain('Save changes');
  });

  it('shows the required error once the field is touched', async () => {
    const fixture = await render();

    type(fixture, '#task-title', 'x');
    type(fixture, '#task-title', '');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.field__error')?.textContent).toContain(
      'Title is required.',
    );
  });

  it('rejects a title that already exists on the board', async () => {
    const fixture = await render({ existingTitles: ['Taken title'] });

    type(fixture, '#task-title', '  taken TITLE ');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.field__error')?.textContent).toContain(
      'already exists',
    );
    expect((fixture.nativeElement.querySelector('.btn--primary') as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it('emits the form value on submit', async () => {
    const fixture = await render();
    const saved: TaskFormValue[] = [];
    fixture.componentInstance.save.subscribe((value) => saved.push(value));

    type(fixture, '#task-title', 'Fresh task');
    type(fixture, '#task-description', 'Some details');
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit'),
    );
    await fixture.whenStable();

    expect(saved).toEqual([
      {
        title: 'Fresh task',
        description: 'Some details',
        priority: 'medium',
        dueDate: '',
        assigneeId: '',
      },
    ]);
  });

  it('emits cancel', async () => {
    const fixture = await render();
    const cancel = vi.fn();
    fixture.componentInstance.cancel.subscribe(cancel);

    (fixture.nativeElement.querySelector('.btn--ghost') as HTMLButtonElement).click();

    expect(cancel).toHaveBeenCalled();
  });
});
