import { TestBed } from '@angular/core/testing';
import { Task, User } from '../../core/models';
import { TaskCard } from './task-card';

const TASK: Task = {
  id: 't1',
  boardId: 'b1',
  columnId: 'c1',
  title: 'Design hero banner',
  description: 'Create responsive banner.',
  priority: 'urgent',
  dueDate: '2026-08-22',
  assigneeId: 'u_1',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

const USER: User = { id: 'u_1', name: 'Ada', email: 'ada@taskflow.dev', role: 'member' };

async function render(task: Task = TASK, assignee?: User) {
  const fixture = TestBed.createComponent(TaskCard);
  fixture.componentRef.setInput('task', task);
  fixture.componentRef.setInput('assignee', assignee ?? undefined);
  await fixture.whenStable();
  return fixture;
}

describe('TaskCard', () => {
  it('renders title, badge, formatted due date and the assignee initial', async () => {
    const fixture = await render(TASK, USER);
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.task-card__title')?.textContent).toContain('Design hero banner');
    expect(element.querySelector('.badge')?.textContent?.trim()).toBe('Urgent');
    expect(element.querySelector('.task-card__due')?.textContent).toContain('Aug 22, 2026');
    expect(element.querySelector('.task-card__avatar')?.textContent?.trim()).toBe('A');
  });

  it('falls back to "no due date" and hides the avatar when unassigned', async () => {
    const fixture = await render({ ...TASK, dueDate: '', assigneeId: undefined, description: '' });
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.task-card__due')?.textContent).toContain('no due date');
    expect(element.querySelector('.task-card__avatar')).toBeNull();
    expect(element.querySelector('.task-card__desc')).toBeNull();
  });

  it('emits edit, remove and select', async () => {
    const fixture = await render(TASK, USER);
    const edit = vi.fn();
    const remove = vi.fn();
    const select = vi.fn();
    fixture.componentInstance.edit.subscribe(edit);
    fixture.componentInstance.remove.subscribe(remove);
    fixture.componentInstance.select.subscribe(select);

    const element: HTMLElement = fixture.nativeElement;
    (element.querySelector('.icon-btn') as HTMLButtonElement).click();
    (element.querySelector('.icon-btn--danger') as HTMLButtonElement).click();
    (element.querySelector('.task-card') as HTMLElement).click();
    await fixture.whenStable();

    expect(edit).toHaveBeenCalledWith(TASK);
    expect(remove).toHaveBeenCalledWith(TASK);
    // The action buttons stop propagation, so only the card click selects.
    expect(select).toHaveBeenCalledTimes(1);
  });

  it('marks itself selected and puts the task id on the drag payload', async () => {
    const fixture = await render(TASK, USER);
    fixture.componentRef.setInput('selected', true);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.task-card--selected')).not.toBeNull();

    const dataTransfer = { setData: vi.fn(), effectAllowed: '' };
    fixture.nativeElement.dispatchEvent(
      Object.assign(new Event('dragstart'), { dataTransfer }),
    );

    expect(dataTransfer.setData).toHaveBeenCalledWith('text/plain', 't1');
    expect(dataTransfer.effectAllowed).toBe('move');
  });
});
