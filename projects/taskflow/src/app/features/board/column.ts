import { Component, ElementRef, computed, input, linkedSignal, output, viewChild } from '@angular/core';
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
  readonly selectedTaskId = input<string | undefined>(undefined);

  readonly quickAdd = output<string>();
  readonly selectTask = output<Task>();
  readonly editTask = output<Task>();
  readonly removeTask = output<Task>();
  readonly taskMoved = output<TaskMove>();

  /** Quick-add draft; resets when this component is bound to another column. */
  protected readonly draft = linkedSignal<ColumnModel, string>({
    source: this.column,
    computation: () => '',
  });

  protected readonly isDropTarget = computed(() => this.dropDepth() > 0);

  private readonly dropDepth = linkedSignal<ColumnModel, number>({
    source: this.column,
    computation: () => 0,
  });

  private readonly quickAddInput = viewChild<ElementRef<HTMLInputElement>>('quickAdd');

  focusQuickAdd(): void {
    this.quickAddInput()?.nativeElement.focus();
  }

  protected assigneeOf(task: Task): User | undefined {
    return this.users().find((user) => user.id === task.assigneeId);
  }

  protected onQuickAdd(): void {
    const title = this.draft().trim();
    if (!title) {
      return;
    }
    this.quickAdd.emit(title);
    this.draft.set('');
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dropDepth.set(1);
  }

  protected onDragLeave(): void {
    this.dropDepth.set(0);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dropDepth.set(0);
    const taskId = event.dataTransfer?.getData('text/plain');
    if (taskId) {
      this.taskMoved.emit({ taskId, columnId: this.column().id });
    }
  }
}
