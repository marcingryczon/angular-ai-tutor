import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BoardStore } from '../../core/board.store';
import { BOARD_CONFIG } from '../../core/config';
import { Column as ColumnModel, Priority, Task } from '../../core/models';
import { SessionService } from '../../core/session.service';
import { TaskService } from '../../core/task.service';
import { TaskStore } from '../../core/task.store';
import { Modal } from '../../shared/modal';
import { Column, TaskMove } from './column';
import { TaskForm, TaskFormValue } from './task-form';

@Component({
  selector: 'app-board',
  imports: [Column, Modal, TaskForm],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  protected readonly boardStore = inject(BoardStore);
  protected readonly taskStore = inject(TaskStore);
  protected readonly session = inject(SessionService);
  protected readonly config = inject(BOARD_CONFIG);
  private readonly taskService = inject(TaskService);

  /** One hardcoded board until routing arrives in Phase 7. */
  protected readonly boardId = signal('b_marketing');

  protected readonly board = computed(() => this.boardStore.boardById(this.boardId()));
  protected readonly columns = computed(() => this.boardStore.columnsOf(this.boardId()));
  protected readonly users = this.boardStore.users;

  /** Short-lived toast driven by the task event bus. */
  protected readonly notice = signal('');

  protected readonly selectedTaskId = linkedSignal<readonly Task[], string | undefined>({
    source: this.taskStore.filteredTasks,
    computation: (tasks, previous) =>
      previous && tasks.some((task) => task.id === previous.value) ? previous.value : undefined,
  });

  protected readonly selectedTask = computed(() =>
    this.taskStore.filteredTasks().find((task) => task.id === this.selectedTaskId()),
  );

  protected readonly editedTask = signal<Task | undefined>(undefined);
  protected readonly isCreating = signal(false);

  /** Titles already on this board, minus the task being edited. */
  protected readonly existingTitles = computed(() =>
    this.taskStore
      .tasks()
      .filter((task) => task.id !== this.editedTask()?.id)
      .map((task) => task.title),
  );

  constructor() {
    this.taskStore.selectBoard(this.boardId());

    this.taskService.events$.pipe(takeUntilDestroyed()).subscribe((event) => {
      this.notice.set(`Task ${event.type}`);
      setTimeout(() => this.notice.set(''), 2000);
    });
  }

  protected tasksOf(column: ColumnModel): readonly Task[] {
    return this.taskStore.tasksOfColumn(column.id);
  }

  protected onSearch(value: string): void {
    this.taskStore.searchInput.set(value);
  }

  protected onPriorityFilter(value: string): void {
    this.taskStore.priorityFilter.set(value as Priority | '');
  }

  protected onAssigneeFilter(value: string): void {
    this.taskStore.assigneeFilter.set(value);
  }

  protected onQuickAdd(column: ColumnModel, title: string): void {
    this.taskStore.quickAdd(column.id, title);
  }

  protected onRemove(task: Task): void {
    this.taskStore.remove(task.id);
  }

  protected onEdit(task: Task): void {
    this.editedTask.set(task);
  }

  protected onSelect(task: Task): void {
    this.selectedTaskId.set(task.id);
  }

  protected onMove({ taskId, columnId }: TaskMove): void {
    this.taskStore.move(taskId, columnId);
  }

  protected resetDemoData(): void {
    this.boardStore.reset();
  }

  protected onSave(value: TaskFormValue): void {
    const edited = this.editedTask();
    if (edited) {
      this.taskStore.update({
        ...edited,
        title: value.title.trim(),
        description: value.description.trim(),
        priority: value.priority,
        dueDate: value.dueDate,
        assigneeId: value.assigneeId || undefined,
      });
    } else {
      this.taskStore.create({
        boardId: this.boardId(),
        columnId: this.columns()[0]?.id ?? '',
        title: value.title.trim(),
        description: value.description.trim(),
        priority: value.priority,
        dueDate: value.dueDate,
        assigneeId: value.assigneeId || undefined,
      });
    }
    this.closeModal();
  }

  protected editSelected(): void {
    const task = this.selectedTask();
    if (task) {
      this.selectedTaskId.set(undefined);
      this.editedTask.set(task);
    }
  }

  protected removeSelected(): void {
    const task = this.selectedTask();
    if (task) {
      this.taskStore.remove(task.id);
      this.selectedTaskId.set(undefined);
    }
  }

  protected assigneeName(task: Task): string {
    return this.boardStore.userById(task.assigneeId)?.name ?? 'Unassigned';
  }

  protected closeModal(): void {
    this.editedTask.set(undefined);
    this.isCreating.set(false);
    this.selectedTaskId.set(undefined);
  }
}
