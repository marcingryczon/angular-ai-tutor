import { afterNextRender, computed, effect, inject, Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, filter, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { BoardService, NewBoard } from '../board.service';
import { SeedFile, TaskFlowData, TaskFlowDb } from '../db';
import { SessionService } from '../session.service';
import { NewTask, TaskService } from '../task.service';
import {
  BoardActions,
  selectBoards,
  selectColumns,
  selectLoaded,
  selectUsers,
} from './board.store';
import { TaskActions, selectTasks } from './task.store';

/**
 * Infrastructure around the NgRx slices: seeding, hydration and persistence.
 * `@ngrx/effects` would be the natural home for this in a bigger app — here a
 * root service with one `effect()` keeps the dependency list smaller.
 */
@Injectable({ providedIn: 'root' })
export class TaskFlowState {
  private readonly store = inject(Store);
  private readonly boardService = inject(BoardService);
  private readonly taskService = inject(TaskService);
  private readonly session = inject(SessionService);
  private readonly db = inject(TaskFlowDb);

  private readonly seed = httpResource<SeedFile>(() => 'seed.json');

  private readonly users = this.store.selectSignal(selectUsers);
  private readonly boards = this.store.selectSignal(selectBoards);
  private readonly columns = this.store.selectSignal(selectColumns);
  private readonly tasks = this.store.selectSignal(selectTasks);
  private readonly loaded = this.store.selectSignal(selectLoaded);

  /** Everything the db persists, assembled from both slices. */
  private readonly snapshot = computed<TaskFlowData>(() => ({
    users: this.users(),
    boards: this.boards(),
    columns: this.columns(),
    tasks: this.tasks(),
  }));

  readonly isLoading = computed(() => !this.loaded() && this.seed.isLoading());

  /** Emits once the state holds data — used by the route resolver. */
  readonly ready$ = toObservable(this.loaded).pipe(
    filter(Boolean),
    take(1),
    map(() => true),
  );

  private restored = false;

  constructor() {
    effect(() => {
      const file = this.seed.value();
      if (file && !this.loaded()) {
        this.load(this.db.seed(file));
      }
    });

    afterNextRender(() => {
      const persisted = this.boardService.loadPersisted();
      if (persisted) {
        this.load(persisted);
      }
      this.restored = true;
    });

    effect(() => {
      const data = this.snapshot();
      if (this.loaded() && this.restored) {
        this.boardService.persist(data);
      }
    });
  }

  // --- command helpers: they build pure payloads, the reducers stay pure ---

  createBoard(input: NewBoard): void {
    const data = this.boardService.create(this.snapshot(), input, this.session.currentUser().id);
    const board = data.boards[data.boards.length - 1];
    const columns = data.columns.filter((column) => column.boardId === board.id);
    this.store.dispatch(BoardActions.created({ board, columns }));
  }

  removeBoard(boardId: string): void {
    const tasks = this.tasks().filter((item) => item.boardId === boardId);
    this.store.dispatch(BoardActions.removed({ boardId }));
    for (const task of tasks) {
      this.store.dispatch(TaskActions.removed({ taskId: task.id }));
    }
  }

  createTask(input: NewTask): void {
    const task = this.taskService.build(input);
    this.store.dispatch(TaskActions.added({ task }));
    this.taskService.announce({ type: 'created', task });
  }

  moveTask(taskId: string, columnId: string): void {
    this.store.dispatch(TaskActions.moved({ taskId, columnId }));
    const task = this.tasks().find((item) => item.id === taskId);
    if (task) {
      this.taskService.announce({ type: 'moved', task });
    }
  }

  removeTask(taskId: string): void {
    const task = this.tasks().find((item) => item.id === taskId);
    this.store.dispatch(TaskActions.removed({ taskId }));
    if (task) {
      this.taskService.announce({ type: 'deleted', task });
    }
  }

  reset(): void {
    const file = this.seed.value();
    if (file) {
      this.load(this.db.seed(file));
      return;
    }
    this.seed.reload();
  }

  private load(data: TaskFlowData): void {
    this.store.dispatch(BoardActions.loaded({ data }));
    this.store.dispatch(TaskActions.loaded({ tasks: data.tasks }));
  }
}
