import { TestBed } from '@angular/core/testing';
import { Column as ColumnModel, Task } from '../../core/models';
import { Column } from './column';

const COLUMN: ColumnModel = {
  id: 'c_todo',
  boardId: 'b1',
  title: 'To Do',
  status: 'todo',
  order: 0,
};

const TASK: Task = {
  id: 't1',
  boardId: 'b1',
  columnId: 'c_todo',
  title: 'Write copy',
  description: '',
  priority: 'low',
  dueDate: '',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

async function render(tasks: Task[] = [TASK]) {
  const fixture = TestBed.createComponent(Column);
  fixture.componentRef.setInput('column', COLUMN);
  fixture.componentRef.setInput('tasks', tasks);
  fixture.componentRef.setInput('users', [
    { id: 'u_1', name: 'Ada', email: 'ada@taskflow.dev', role: 'member' },
  ]);
  await fixture.whenStable();
  return fixture;
}

describe('Column', () => {
  it('renders the title, the count and one card per task', async () => {
    const fixture = await render();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.column__title')?.textContent).toContain('To Do');
    expect(element.querySelector('.column__count')?.textContent?.trim()).toBe('1');
    expect(element.querySelectorAll('app-task-card')).toHaveLength(1);
    expect(element.querySelector('.column__empty')).toBeNull();
  });

  it('shows the empty state without tasks', async () => {
    const fixture = await render([]);

    expect(fixture.nativeElement.querySelector('.column__empty')?.textContent).toContain(
      'No tasks',
    );
  });

  it('emits quickAdd on Enter and clears the draft', async () => {
    const fixture = await render();
    const quickAdd = vi.fn();
    fixture.componentInstance.quickAdd.subscribe(quickAdd);

    const input = fixture.nativeElement.querySelector(
      '.column__quick-add-input',
    ) as HTMLInputElement;
    input.value = '  New task  ';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await fixture.whenStable();

    expect(quickAdd).toHaveBeenCalledWith('New task');
    expect(input.value).toBe('');
  });

  it('ignores an empty quick-add', async () => {
    const fixture = await render();
    const quickAdd = vi.fn();
    fixture.componentInstance.quickAdd.subscribe(quickAdd);

    const input = fixture.nativeElement.querySelector(
      '.column__quick-add-input',
    ) as HTMLInputElement;
    input.value = '   ';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await fixture.whenStable();

    expect(quickAdd).not.toHaveBeenCalled();
  });

  it('highlights while dragging over and emits the move on drop', async () => {
    const fixture = await render();
    const moved = vi.fn();
    fixture.componentInstance.taskMoved.subscribe(moved);
    const section = fixture.nativeElement.querySelector('.column') as HTMLElement;

    const dataTransfer = { dropEffect: '', getData: () => 't1' };
    section.dispatchEvent(Object.assign(new Event('dragover'), { dataTransfer }));
    await fixture.whenStable();
    expect(section.classList.contains('column--drop')).toBe(true);

    section.dispatchEvent(new Event('dragleave'));
    await fixture.whenStable();
    expect(section.classList.contains('column--drop')).toBe(false);

    section.dispatchEvent(Object.assign(new Event('drop'), { dataTransfer }));
    await fixture.whenStable();
    expect(moved).toHaveBeenCalledWith({ taskId: 't1', columnId: 'c_todo' });
  });

  it('ignores a drop without a payload', async () => {
    const fixture = await render();
    const moved = vi.fn();
    fixture.componentInstance.taskMoved.subscribe(moved);

    fixture.nativeElement
      .querySelector('.column')
      .dispatchEvent(Object.assign(new Event('drop'), { dataTransfer: { getData: () => '' } }));
    await fixture.whenStable();

    expect(moved).not.toHaveBeenCalled();
  });

  it('focuses the quick-add input on demand', async () => {
    const fixture = await render();

    fixture.componentInstance.focusQuickAdd();

    expect(document.activeElement).toBe(
      fixture.nativeElement.querySelector('.column__quick-add-input'),
    );
  });
});
