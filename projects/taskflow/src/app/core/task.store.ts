import { Injectable, computed, inject, signal } from '@angular/core';
import { TaskFlowDb } from './db';
import { TaskService } from './task.service';
import type { Column, NewTaskInput, Priority, Task, TaskPatch, User } from './models';

export type PriorityFilter = Priority | 'all';

/**
 * Assignee filter: `'all'` (no filtering), `'unassigned'` (tasks with no
 * assignee), or a specific user id.
 */
export type AssigneeFilter = string;

/**
 * Reactive, board-scoped store for the Kanban board view.
 *
 * A single store instance serves the whole board page: it holds the columns,
 * tasks, users, the active filters and the selected task, and exposes them as
 * signals plus `computed` selectors. Components dispatch mutations through the
 * action methods, which commit via the TaskService and refresh local state.
 *
 * This is the "before NgRx" baseline: all imperative component state is moved
 * into a centralized store that components read from and dispatch to.
 */
@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly db = inject(TaskFlowDb);
  private readonly taskService = inject(TaskService);

  // --- state -----------------------------------------------------------------
  readonly boardId = signal<string | null>(null);
  readonly columns = signal<Column[]>([]);
  readonly tasks = signal<Task[]>([]);
  readonly users = signal<User[]>([]);

  readonly filterText = signal('');
  readonly priorityFilter = signal<PriorityFilter>('all');
  readonly assigneeFilter = signal<AssigneeFilter>('all');
  readonly selectedTaskId = signal<string | null>(null);

  // --- selectors -------------------------------------------------------------
  readonly taskCount = computed(() => this.tasks().length);

  readonly filteredTasks = computed(() => {
    const text = this.filterText().trim().toLowerCase();
    const priority = this.priorityFilter();
    const assignee = this.assigneeFilter();
    return this.tasks().filter((task) => {
      const matchesText =
        text.length === 0 ||
        task.title.toLowerCase().includes(text) ||
        task.description.toLowerCase().includes(text);
      const matchesPriority = priority === 'all' || task.priority === priority;
      const matchesAssignee =
        assignee === 'all' ||
        (assignee === 'unassigned' ? !task.assigneeId : task.assigneeId === assignee);
      return matchesText && matchesPriority && matchesAssignee;
    });
  });

  readonly selectedTask = computed(() => {
    const id = this.selectedTaskId();
    if (!id) {
      return null;
    }
    return this.tasks().find((t) => t.id === id) ?? null;
  });

  readonly orderedColumns = computed(() =>
    [...this.columns()].sort((a, b) => a.order - b.order)
  );

  // --- actions ---------------------------------------------------------------
  /** Load a board (columns + tasks + users) into the store. */
  selectBoard(boardId: string): boolean {
    const boardDb = this.db.load()[boardId];
    if (!boardDb) {
      return false;
    }
    this.boardId.set(boardId);
    this.columns.set(boardDb.columns);
    this.tasks.set(boardDb.tasks);
    this.users.set(boardDb.users);
    this.filterText.set('');
    this.priorityFilter.set('all');
    this.assigneeFilter.set('all');
    this.selectedTaskId.set(null);
    return true;
  }

  setFilterText(text: string): void {
    this.filterText.set(text);
  }

  setPriorityFilter(priority: PriorityFilter): void {
    this.priorityFilter.set(priority);
  }

  setAssigneeFilter(assignee: AssigneeFilter): void {
    this.assigneeFilter.set(assignee);
  }

  selectTask(taskId: string): void {
    this.selectedTaskId.set(taskId);
  }

  clearSelected(): void {
    this.selectedTaskId.set(null);
  }

  addTask(input: NewTaskInput): Task | null {
    const result = this.taskService.createTask(input);
    if (result.ok) {
      this.reloadTasks();
      this.selectedTaskId.set(result.value.id);
      return result.value;
    }
    return null;
  }

  updateTask(taskId: string, patch: TaskPatch): boolean {
    const boardId = this.boardId();
    if (!boardId) {
      return false;
    }
    const result = this.taskService.updateTask(boardId, taskId, patch);
    if (result.ok) {
      this.reloadTasks();
      return true;
    }
    return false;
  }

  moveTask(taskId: string, toColumnId: string): boolean {
    const boardId = this.boardId();
    if (!boardId) {
      return false;
    }
    const result = this.taskService.moveTask(boardId, taskId, toColumnId);
    if (result.ok) {
      this.reloadTasks();
      return true;
    }
    return false;
  }

  deleteTask(taskId: string): boolean {
    const boardId = this.boardId();
    if (!boardId) {
      return false;
    }
    const result = this.taskService.deleteTask(boardId, taskId);
    if (result.ok) {
      if (this.selectedTaskId() === taskId) {
        this.selectedTaskId.set(null);
      }
      this.reloadTasks();
      return true;
    }
    return false;
  }

  /** Re-read tasks from persistence (columns/users are static per board). */
  private reloadTasks(): void {
    const boardId = this.boardId();
    if (!boardId) {
      return;
    }
    const result = this.taskService.listTasks(boardId);
    if (result.ok) {
      this.tasks.set(result.value);
    }
  }
}