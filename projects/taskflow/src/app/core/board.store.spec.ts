import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BoardStore } from './board.store';
import { SeedFile } from './db';

const SEED: SeedFile = {
  users: [{ id: 'u_1', name: 'Ada', email: 'ada@taskflow.dev', role: 'admin' }],
  boards: [
    { id: 'b_1', title: 'One', description: '', visibility: 'team', ownerId: 'u_1' },
    { id: 'b_2', title: 'Two', description: '', visibility: 'public', ownerId: 'u_1' },
  ],
  taskTemplates: [{ title: 'A', description: '', status: 'todo', priority: 'low' }],
};

describe('BoardStore', () => {
  let store: BoardStore;
  let http: HttpTestingController;

  /** Runs pending effects so the resource fires, then answers it. */
  async function flushSeed(): Promise<void> {
    await TestBed.tick();
    http.expectOne('seed.json').flush(SEED);
    // The resource resolves in a microtask; the seeding effect runs on the next tick.
    await new Promise((resolve) => setTimeout(resolve));
    await TestBed.tick();
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(BoardStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('starts empty and reports loading', async () => {
    expect(store.boards()).toEqual([]);

    await TestBed.tick();

    expect(store.isLoading()).toBe(true);
    http.expectOne('seed.json').flush(SEED);
  });

  it('hydrates from seed.json', async () => {
    await flushSeed();

    expect(store.boards()).toHaveLength(2);
    expect(store.users()).toHaveLength(1);
    expect(store.columns()).toHaveLength(8);
    expect(store.isLoading()).toBe(false);
  });

  it('selects boards, users and columns by id', async () => {
    await flushSeed();

    expect(store.boardById('b_2')?.title).toBe('Two');
    expect(store.boardById('nope')).toBeUndefined();
    expect(store.userById('u_1')?.name).toBe('Ada');
    expect(store.userById(undefined)).toBeUndefined();
    expect(store.columnsOf('b_1').map((column) => column.order)).toEqual([0, 1, 2, 3]);
    expect(store.taskCountOf('b_1')).toBe(1);
  });

  it('creates a board through the service', async () => {
    await flushSeed();

    store.createBoard({ title: 'Third', description: 'new', visibility: 'private' });

    expect(store.boards()).toHaveLength(3);
    expect(store.boards()[2].title).toBe('Third');
  });

  it('removes a board with its columns', async () => {
    await flushSeed();

    store.removeBoard('b_1');

    expect(store.boards().map((board) => board.id)).toEqual(['b_2']);
    expect(store.columns().every((column) => column.boardId === 'b_2')).toBe(true);
  });

  it('re-seeds on reset', async () => {
    await flushSeed();
    store.removeBoard('b_1');

    store.reset();

    expect(store.boards()).toHaveLength(2);
  });

  it('updates the dataset through update()', async () => {
    await flushSeed();

    store.update((data) => ({ ...data, tasks: [] }));

    expect(store.data().tasks).toEqual([]);
  });
});
