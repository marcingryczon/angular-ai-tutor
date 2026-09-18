import { Component } from '@angular/core';
import { newId } from '../../core/helpers';
import { Column as ColumnModel, Task, User } from '../../core/models';
import { Modal } from '../../shared/modal';
import { Column, TaskMove } from './column';

const TODAY = new Date().toISOString().slice(0, 10);

function inDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

@Component({
  selector: 'app-board',
  imports: [Column, Modal],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  protected readonly boardTitle = 'Marketing Sprint';
  protected readonly description = 'Q3 launch tasks for the marketing team.';

  protected readonly users: readonly User[] = [
    { id: 'u_marci', name: 'Marcin', email: 'marcin@taskflow.dev', role: 'admin' },
    { id: 'u_anna', name: 'Anna', email: 'anna@taskflow.dev', role: 'member' },
  ];

  protected readonly columns: readonly ColumnModel[] = [
    { id: 'c_todo', boardId: 'b1', title: 'To Do', status: 'todo', order: 0 },
    { id: 'c_progress', boardId: 'b1', title: 'In Progress', status: 'in-progress', order: 1 },
    { id: 'c_review', boardId: 'b1', title: 'Review', status: 'review', order: 2 },
    { id: 'c_done', boardId: 'b1', title: 'Done', status: 'done', order: 3 },
  ];

  protected tasks: Task[] = [
    this.task('Draft launch campaign', 'Write the announcement copy and gather assets.', 'c_todo', 'medium', 'u_anna', ''),
    this.task('Design hero banner', 'Create responsive banner for the landing page.', 'c_todo', 'low', undefined, inDays(5)),
    this.task('Ship onboarding email', 'Compose the 3-step welcome email sequence.', 'c_progress', 'high', 'u_marci', inDays(2)),
    this.task('Review Q3 metrics', 'Summarise funnel conversion for the exec review.', 'c_review', 'urgent', 'u_anna', ''),
    this.task('Update pricing page', 'Reflect the new tiered pricing.', 'c_done', 'medium', undefined, ''),
  ];

  /** `undefined` = the modal is closed; the parent owns modal visibility. */
  protected editedTask: Task | undefined = undefined;
  protected isCreating = false;

  protected tasksOf(column: ColumnModel): Task[] {
    return this.tasks.filter((task) => task.columnId === column.id);
  }

  protected onQuickAdd(column: ColumnModel, title: string): void {
    this.tasks = [...this.tasks, this.task(title, '', column.id, 'medium', undefined, '')];
  }

  protected onRemove(task: Task): void {
    this.tasks = this.tasks.filter((item) => item.id !== task.id);
  }

  protected onEdit(task: Task): void {
    this.editedTask = task;
  }

  protected onMove({ taskId, columnId }: TaskMove): void {
    this.tasks = this.tasks.map((task) =>
      task.id === taskId ? { ...task, columnId, updatedAt: TODAY } : task,
    );
  }

  protected closeModal(): void {
    this.editedTask = undefined;
    this.isCreating = false;
  }

  private task(
    title: string,
    description: string,
    columnId: string,
    priority: Task['priority'],
    assigneeId: string | undefined,
    dueDate: string,
  ): Task {
    return {
      id: newId('task'),
      boardId: 'b1',
      columnId,
      title,
      description,
      priority,
      dueDate,
      assigneeId,
      createdAt: TODAY,
      updatedAt: TODAY,
    };
  }
}
