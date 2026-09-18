import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { BoardService, NewBoard } from './board.service';
import { SeedFile, TaskFlowData, TaskFlowDb } from './db';
import { findById } from './helpers';
import { SessionService } from './session.service';

const EMPTY: TaskFlowData = { users: [], boards: [], columns: [], tasks: [] };

/**
 * Single owner of the persisted dataset.
 * Components never mutate it directly — they call the action methods here
 * (or on `TaskStore`, which writes through `update()`).
 */
@Injectable({ providedIn: 'root' })
export class BoardStore {
  private readonly boardService = inject(BoardService);
  private readonly db = inject(TaskFlowDb);
  private readonly session = inject(SessionService);

  private readonly state = signal<TaskFlowData>(this.boardService.loadPersisted() ?? EMPTY);
  private readonly hydrated = signal(this.boardService.loadPersisted() !== undefined);

  /** Demo data, fetched declaratively; only used until the store is hydrated. */
  private readonly seed = httpResource<SeedFile>(() => (this.hydrated() ? undefined : 'seed.json'));

  readonly isLoading = computed(() => !this.hydrated() && this.seed.isLoading());
  readonly error = computed(() => this.seed.error());

  readonly data = this.state.asReadonly();
  readonly boards = computed(() => this.state().boards);
  readonly users = computed(() => this.state().users);
  readonly columns = computed(() => this.state().columns);

  constructor() {
    // Seed on first run: the resource resolves → the store takes over.
    effect(() => {
      const file = this.seed.value();
      if (file && !this.hydrated()) {
        this.state.set(this.db.seed(file));
        this.hydrated.set(true);
      }
    });

    // Persistence is a side effect of state, never a step inside an action.
    effect(() => {
      if (this.hydrated()) {
        this.boardService.persist(this.state());
      }
    });
  }

  columnsOf(boardId: string) {
    return this.columns()
      .filter((column) => column.boardId === boardId)
      .sort((a, b) => a.order - b.order);
  }

  boardById(boardId: string) {
    return findById(this.boards(), boardId);
  }

  userById(userId: string | undefined) {
    return userId ? findById(this.users(), userId) : undefined;
  }

  taskCountOf(boardId: string): number {
    return this.state().tasks.filter((task) => task.boardId === boardId).length;
  }

  // --- actions ---

  createBoard(input: NewBoard): void {
    this.state.update((data) =>
      this.boardService.create(data, input, this.session.currentUser().id),
    );
  }

  removeBoard(boardId: string): void {
    this.state.update((data) => this.boardService.remove(data, boardId));
  }

  /** Re-seeds the demo dataset (admin action). */
  reset(): void {
    const file = this.seed.value();
    if (file) {
      this.state.set(this.db.seed(file));
      return;
    }
    // The seed request was never made (already hydrated on boot) — refetch it.
    this.hydrated.set(false);
    this.seed.reload();
  }

  /** Used by `TaskStore` — the only write path into the dataset. */
  update(mutate: (data: TaskFlowData) => TaskFlowData): void {
    this.state.update(mutate);
  }
}
