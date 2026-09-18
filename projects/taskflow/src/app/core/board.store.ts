import { afterNextRender, computed, effect, inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { httpResource } from '@angular/common/http';
import { filter, map, take } from 'rxjs';
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

  /**
   * Starts empty on both platforms so the server render and the first client
   * render agree. Persisted data is swapped in after the first render.
   */
  private readonly state = signal<TaskFlowData>(EMPTY);
  private readonly hydrated = signal(false);

  /** `true` once localStorage has been consulted (browser only). */
  private readonly restored = signal(false);

  /** Demo data, fetched declaratively and replayed from the transfer cache. */
  private readonly seed = httpResource<SeedFile>(() => 'seed.json');

  readonly isLoading = computed(() => !this.hydrated() && this.seed.isLoading());

  /** Emits once the dataset is available — used by the route resolver. */
  readonly ready$ = toObservable(this.hydrated).pipe(
    filter(Boolean),
    take(1),
    map(() => true),
  );
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

    // Browser only, and only after hydration has finished: swap the server's
    // seed render for whatever the user actually has in localStorage.
    afterNextRender(() => {
      const persisted = this.boardService.loadPersisted();
      if (persisted) {
        this.state.set(persisted);
        this.hydrated.set(true);
      }
      this.restored.set(true);
    });

    // Persistence is a side effect of state, never a step inside an action.
    effect(() => {
      if (this.hydrated() && this.restored()) {
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
