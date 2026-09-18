import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngrx/store';
import { SeedFile } from '../db';
import { TaskEvent, TaskService } from '../task.service';
import { boardsFeature, selectBoards, selectColumns } from './board.store';
import { selectTasks, tasksFeature } from './task.store';
import { TaskFlowState } from './taskflow-state.service';

const SEED: SeedFile = {
  users: [{ id: 'u_1', name: 'Ada', email: 'ada@taskflow.dev', role: 'admin' }],
  boards: [{ id: 'b_1', title: 'One', description: '', visibility: 'team', ownerId: 'u_1' }],
  taskTemplates: [{ title: 'Write copy', description: '', status: 'todo', priority: 'low' }],
};

describe('TaskFlowState', () => {
  let state: TaskFlowState;
  let store: Store;
  let http: HttpTestingController;
  let events: TaskEvent[];

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore({
          [boardsFeature.name]: boardsFeature.reducer,
          [tasksFeature.name]: tasksFeature.reducer,
        }),
      ],
    });
    state = TestBed.inject(TaskFlowState);
    store = TestBed.inject(Store);
    http = TestBed.inject(HttpTestingController);
    events = [];
    TestBed.inject(TaskService).events$.subscribe((event) => events.push(event));

    await TestBed.tick();
    http.expectOne('seed.json').flush(SEED);
    await new Promise((resolve) => setTimeout(resolve));
    await TestBed.tick();
  });

  afterEach(() => http.verify());

  it('seeds both slices from seed.json', () => {
    expect(store.selectSignal(selectBoards)()).toHaveLength(1);
    expect(store.selectSignal(selectColumns)()).toHaveLength(4);
    expect(store.selectSignal(selectTasks)()).toHaveLength(1);
    expect(state.isLoading()).toBe(false);
  });

  it('creates a board with its default columns', () => {
    state.createBoard({ title: 'Second', description: 'more', visibility: 'public' });

    const boards = store.selectSignal(selectBoards)();
    expect(boards).toHaveLength(2);
    expect(boards[1].title).toBe('Second');
    expect(store.selectSignal(selectColumns)()).toHaveLength(8);
  });

  it('removes a board together with its tasks', () => {
    state.removeBoard('b_1');

    expect(store.selectSignal(selectBoards)()).toHaveLength(0);
    expect(store.selectSignal(selectTasks)()).toHaveLength(0);
  });

  it('creates, moves and removes tasks and announces each one', () => {
    state.createTask({
      boardId: 'b_1',
      columnId: 'b_1_todo',
      title: 'Second task',
      description: '',
      priority: 'medium',
      dueDate: '',
    });
    const created = store.selectSignal(selectTasks)()[1];

    state.moveTask(created.id, 'b_1_done');
    expect(store.selectSignal(selectTasks)()[1].columnId).toBe('b_1_done');

    state.removeTask(created.id);
    expect(store.selectSignal(selectTasks)()).toHaveLength(1);

    expect(events.map((event) => event.type)).toEqual(['created', 'moved', 'deleted']);
  });

  it('re-seeds on reset', () => {
    state.removeBoard('b_1');

    state.reset();

    expect(store.selectSignal(selectBoards)()).toHaveLength(1);
    expect(store.selectSignal(selectTasks)()).toHaveLength(1);
  });
});
