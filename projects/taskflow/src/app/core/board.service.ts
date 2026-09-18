import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { TaskFlowDb, TaskFlowData } from './db';
import { findById } from './helpers';
import { Board, Column, User } from './models';

/**
 * Owns the persisted dataset as a signal. Every other service derives from it,
 * so there is exactly one writable source of truth in the app.
 */
@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly db = inject(TaskFlowDb);

  private readonly data = signal<TaskFlowData>(this.db.load());

  readonly boards = computed(() => this.data().boards);
  readonly users = computed(() => this.data().users);
  readonly columns = computed(() => this.data().columns);

  constructor() {
    // Side effect: persistence. Deriving state here would be a smell.
    effect(() => this.db.save(this.data()));
  }

  snapshot(): TaskFlowData {
    return this.data();
  }

  update(mutate: (data: TaskFlowData) => TaskFlowData): void {
    this.data.update(mutate);
  }

  columnsOf(boardId: string): readonly Column[] {
    return this.columns()
      .filter((column) => column.boardId === boardId)
      .sort((a, b) => a.order - b.order);
  }

  boardById(boardId: string): Board | undefined {
    return findById(this.boards(), boardId);
  }

  userById(userId: string | undefined): User | undefined {
    return userId ? findById(this.users(), userId) : undefined;
  }

  /** Re-seeds the demo dataset (admin action). */
  reset(): void {
    this.data.set(this.db.seed());
  }
}
