import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { BoardStore } from './board.store';
import { filterTasks, tasksOfBoard, tasksOfColumn } from './domain/task-filters';
import { Priority, Task } from './models';
import { NewTask, TaskService } from './task.service';

/** Owns task state: the current board, the filters and every task mutation. */
@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly boards = inject(BoardStore);
  private readonly taskService = inject(TaskService);

  readonly boardId = signal('');

  /** Raw keystrokes from the filter bar. */
  readonly searchInput = signal('');

  /** Debounced view of `searchInput` — what the filtering actually uses. */
  readonly search = toSignal(
    toObservable(this.searchInput).pipe(
      debounceTime(300),
      map((term) => term.trim().toLowerCase()),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  readonly priorityFilter = signal<Priority | ''>('');
  readonly assigneeFilter = signal<string>('');

  readonly tasks = computed(() => tasksOfBoard(this.boards.data().tasks, this.boardId()));

  /** The filtering rule itself lives in `core/domain` — this only wires signals to it. */
  readonly filteredTasks = computed(() =>
    filterTasks(this.tasks(), {
      search: this.search(),
      priority: this.priorityFilter(),
      assignee: this.assigneeFilter(),
    }),
  );

  readonly taskCount = computed(() => this.filteredTasks().length);

  tasksOfColumn(columnId: string): readonly Task[] {
    return tasksOfColumn(this.filteredTasks(), columnId);
  }

  // --- actions ---

  selectBoard(boardId: string): void {
    this.boardId.set(boardId);
  }

  resetFilters(): void {
    this.searchInput.set('');
    this.priorityFilter.set('');
    this.assigneeFilter.set('');
  }

  quickAdd(columnId: string, title: string): void {
    this.create({
      boardId: this.boardId(),
      columnId,
      title,
      description: '',
      priority: 'medium',
      dueDate: '',
    });
  }

  create(task: NewTask): void {
    this.boards.update((data) => this.taskService.create(data, task));
  }

  update(task: Task): void {
    this.boards.update((data) => this.taskService.update(data, task));
  }

  remove(taskId: string): void {
    this.boards.update((data) => this.taskService.remove(data, taskId));
  }

  move(taskId: string, columnId: string): void {
    this.boards.update((data) => this.taskService.move(data, taskId, columnId));
  }
}
