import { Injectable, inject } from '@angular/core';
import { TaskFlowDb, type BoardDb } from './db';
import { createError, createSuccess, newId, type Result } from './helpers';
import type { NewTaskInput, Task, TaskPatch, User } from './models';

function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Domain service for tasks. All mutations go through this service so that
 * persistence, timestamping and validation live in one place.
 *
 * IMPORTANT: `TaskFlowDb.load()` returns a freshly parsed object on every call,
 * so a mutation is only persisted if we mutate the SAME object we then pass to
 * `save()`. Each method therefore loads once, mutates that object, and saves it.
 */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly db = inject(TaskFlowDb);

  private board(boardId: string): BoardDb | undefined {
    return this.db.load()[boardId];
  }

  listTasks(boardId: string): Result<Task[]> {
    const boardDb = this.board(boardId);
    return boardDb ? createSuccess(boardDb.tasks) : createError(new Error(`board "${boardId}" not found`));
  }

  getTask(boardId: string, taskId: string): Result<Task> {
    const task = this.board(boardId)?.tasks.find((t) => t.id === taskId);
    return task ? createSuccess(task) : createError(new Error(`task "${taskId}" not found`));
  }

  listUsers(boardId: string): User[] {
    return this.board(boardId)?.users ?? [];
  }

  /** Create a new task inside a given board/column. */
  createTask(input: NewTaskInput): Result<Task> {
    const data = this.db.load();
    const boardDb = data[input.boardId];
    if (!boardDb) {
      return createError(new Error(`board "${input.boardId}" not found`));
    }
    if (!boardDb.columns.some((c) => c.id === input.columnId)) {
      return createError(new Error(`column "${input.columnId}" not on board "${input.boardId}"`));
    }
    const now = nowIso();
    const task: Task = {
      id: newId('task'),
      boardId: input.boardId,
      columnId: input.columnId,
      title: input.title.trim(),
      description: input.description.trim(),
      priority: input.priority,
      dueDate: input.dueDate,
      assigneeId: input.assigneeId,
      createdAt: now,
      updatedAt: now
    };
    boardDb.tasks = [task, ...boardDb.tasks];
    this.db.save(data);
    return createSuccess(task);
  }

  /** Update an existing task by merging a patch. */
  updateTask(boardId: string, taskId: string, patch: TaskPatch): Result<Task> {
    const data = this.db.load();
    const boardDb = data[boardId];
    const index = boardDb?.tasks.findIndex((t) => t.id === taskId) ?? -1;
    if (!boardDb || index === -1) {
      return createError(new Error(`task "${taskId}" not found`));
    }
    const current = boardDb.tasks[index];
    const updated: Task = {
      ...current,
      ...patch,
      id: current.id,
      boardId: current.boardId,
      updatedAt: nowIso()
    };
    boardDb.tasks = boardDb.tasks.map((t, i) => (i === index ? updated : t));
    this.db.save(data);
    return createSuccess(updated);
  }

  /** Move a task to a different column. */
  moveTask(boardId: string, taskId: string, toColumnId: string): Result<Task> {
    return this.updateTask(boardId, taskId, { columnId: toColumnId });
  }

  deleteTask(boardId: string, taskId: string): Result<null> {
    const data = this.db.load();
    const boardDb = data[boardId];
    if (!boardDb?.tasks.some((t) => t.id === taskId)) {
      return createError(new Error(`task "${taskId}" not found`));
    }
    boardDb.tasks = boardDb.tasks.filter((t) => t.id !== taskId);
    this.db.save(data);
    return createSuccess(null);
  }
}