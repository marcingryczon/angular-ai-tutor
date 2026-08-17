import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskCard } from './task-card';
import type { Column as ColumnModel, Task, User } from '../../core/models';

/**
 * A single Kanban column. It renders its (filtered) tasks, acts as a
 * drag-and-drop drop target for moving cards, and offers a quick-add.
 * All mutations are emitted to the parent Board which dispatches to the store.
 */
@Component({
  selector: 'app-column',
  imports: [TaskCard, FormsModule],
  template: `
    <section
      class="column"
      [class.column--drop]="isOver()"
      (dragover)="onDragOver($event)"
      (dragleave)="isOver.set(false)"
      (drop)="onDrop($event)"
      [attr.aria-label]="'Column: ' + column().title"
    >
      <header class="column__header">
        <h2 class="column__title">{{ column().title }}</h2>
        <span class="column__count" [attr.aria-label]="tasks().length + ' tasks'">
          {{ tasks().length }}
        </span>
      </header>

      <div class="column__cards">
        @for (task of tasks(); track task.id) {
          <app-task-card
            [task]="task"
            [users]="users()"
            [selected]="selectedTaskId() === task.id"
            [draggable]="true"
            (select)="select.emit(task.id)"
            (edit)="onEdit(task.id)"
            (remove)="onRemove(task.id)"
            (dragstart)="onDragStart($event, task)"
          />
        }
        @empty {
          <p class="column__empty">No tasks</p>
        }
      </div>

      <div class="column__quick-add">
        <div class="quick-add">
          <span class="material-symbols-rounded material-symbols-rounded--sm quick-add__icon" aria-hidden="true">add</span>
          <input
            class="field__input"
            placeholder="Quick add"
            aria-label="Quick add a task to {{ column().title }}"
            [ngModel]="quickTitle"
            (ngModelChange)="quickTitle = $event"
            (keydown.enter)="quickAddTask()"
          />
        </div>
      </div>
    </section>
  `
})
export class Column {
  readonly column = input.required<ColumnModel>();
  readonly tasks = input<Task[]>([]);
  readonly users = input<User[]>([]);
  readonly selectedTaskId = input<string | null>(null);

  readonly quickAdd = output<string>();
  readonly select = output<string>();
  readonly edit = output<string>();
  readonly remove = output<string>();
  readonly move = output<{ taskId: string; toColumnId: string }>();

  /** Title captured by the quick-add input. */
  protected quickTitle = '';
  /** Whether a drag is currently over this column (for highlight). */
  protected readonly isOver = signal(false);

  private draggedTaskId: string | null = null;

  protected onEdit(taskId: string): void {
    this.edit.emit(taskId);
  }

  protected onRemove(taskId: string): void {
    this.remove.emit(taskId);
  }

  protected onDragStart(event: DragEvent, task: Task): void {
    this.draggedTaskId = task.id;
    event.dataTransfer?.setData('text/plain', task.id);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.isOver.set(true);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isOver.set(false);
    const taskId = event.dataTransfer?.getData('text/plain') || this.draggedTaskId;
    this.draggedTaskId = null;
    if (taskId) {
      this.move.emit({ taskId, toColumnId: this.column().id });
    }
  }

  protected quickAddTask(): void {
    const title = this.quickTitle.trim();
    if (title) {
      this.quickTitle = '';
      this.quickAdd.emit(title);
    }
  }
}