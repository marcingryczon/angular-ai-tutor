import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { Column as ColumnModel, Task, User } from '../../core/models';
import { TaskCard } from './task-card';

export interface TaskMove {
  readonly taskId: string;
  readonly columnId: string;
}

@Component({
  selector: 'app-column',
  imports: [TaskCard],
  templateUrl: './column.html',
  styleUrl: './column.scss',
})
export class Column {
  readonly column = input.required<ColumnModel>();
  readonly tasks = input.required<readonly Task[]>();
  readonly users = input<readonly User[]>([]);

  readonly quickAdd = output<string>();
  readonly editTask = output<Task>();
  readonly removeTask = output<Task>();
  readonly taskMoved = output<TaskMove>();

  /** `true` while a card is dragged over this column — drives `.column--drop`. */
  protected isDropTarget = false;

  private readonly quickAddInput = viewChild<ElementRef<HTMLInputElement>>('quickAdd');

  focusQuickAdd(): void {
    this.quickAddInput()?.nativeElement.focus();
  }

  protected assigneeOf(task: Task): User | undefined {
    return this.users().find((user) => user.id === task.assigneeId);
  }

  protected onQuickAdd(input: HTMLInputElement): void {
    const title = input.value.trim();
    if (!title) {
      return;
    }
    this.quickAdd.emit(title);
    input.value = '';
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.isDropTarget = true;
  }

  protected onDragLeave(): void {
    this.isDropTarget = false;
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDropTarget = false;
    const taskId = event.dataTransfer?.getData('text/plain');
    if (taskId) {
      this.taskMoved.emit({ taskId, columnId: this.column().id });
    }
  }
}
