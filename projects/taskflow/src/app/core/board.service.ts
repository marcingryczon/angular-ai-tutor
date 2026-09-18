import { inject, Injectable } from '@angular/core';
import { TaskFlowDb } from './db';
import { findById } from './helpers';
import { Board, Column, User } from './models';

/** Data access for boards, columns and users. */
@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly db = inject(TaskFlowDb);
  private data = this.db.load();

  get boards(): readonly Board[] {
    return this.data.boards;
  }

  get users(): readonly User[] {
    return this.data.users;
  }

  columnsOf(boardId: string): readonly Column[] {
    return this.data.columns
      .filter((column) => column.boardId === boardId)
      .sort((a, b) => a.order - b.order);
  }

  boardById(boardId: string): Board | undefined {
    return findById(this.data.boards, boardId);
  }

  /** Re-seeds the demo dataset (admin action). */
  reset(): void {
    this.data = this.db.seed();
    this.db.save(this.data);
  }

  /** Shared snapshot so `TaskService` writes into the same object graph. */
  snapshot() {
    return this.data;
  }

  replace(data: ReturnType<TaskFlowDb['load']>): void {
    this.data = data;
    this.db.save(data);
  }
}
