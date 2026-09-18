import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BoardStore } from './board.store';
import { SeedFile } from './db';
import { TaskStore } from './task.store';

const SEED: SeedFile = {
  users: [
    { id: 'u_1', name: 'Ada', email: 'ada@taskflow.dev', role: 'admin' },
    { id: 'u_2', name: 'Bo', email: 'bo@taskflow.dev', role: 'member' },
  ],
  boards: [{ id: 'b_1', title: 'One', description: '', visibility: 'team', ownerId: 'u_1' }],
  taskTemplates: [
    {
      title: 'Write copy',
      description: 'launch text',
      status: 'todo',
      priority: 'low',
      assigneeId: 'u_1',
    },
    { title: 'Fix banner', description: 'image bug', status: 'todo', priority: 'urgent' },
    {
      title: 'Ship email',
      description: 'welcome flow',
      status: 'done',
      priority: 'high',
      assigneeId: 'u_2',
    },
  ],
};

describe('TaskStore', () => {
  let store: TaskStore;
  let boards: BoardStore;
  let http: HttpTestingController;

  /** Waits past the 300 ms search debounce. */
  const settleSearch = () => new Promise((resolve) => setTimeout(resolve, 350));

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    boards = TestBed.inject(BoardStore);
    store = TestBed.inject(TaskStore);
    http = TestBed.inject(HttpTestingController);

    await TestBed.tick();
    http.expectOne('seed.json').flush(SEED);
    await new Promise((resolve) => setTimeout(resolve));
    await TestBed.tick();

    store.selectBoard('b_1');
  });

  afterEach(() => http.verify());

  it('exposes the tasks of the selected board only', () => {
    expect(store.tasks()).toHaveLength(3);

    store.selectBoard('other');

    expect(store.tasks()).toHaveLength(0);
  });

  it('filters by priority', () => {
    store.priorityFilter.set('urgent');

    expect(store.filteredTasks().map((task) => task.title)).toEqual(['Fix banner']);
    expect(store.taskCount()).toBe(1);
  });

  it('filters by assignee and by "unassigned"', () => {
    store.assigneeFilter.set('u_2');
    expect(store.filteredTasks().map((task) => task.title)).toEqual(['Ship email']);

    store.assigneeFilter.set('none');
    expect(store.filteredTasks().map((task) => task.title)).toEqual(['Fix banner']);
  });

  it('debounces the search and matches title or description', async () => {
    store.searchInput.set('banner');
    expect(store.filteredTasks()).toHaveLength(3);

    await settleSearch();
    expect(store.filteredTasks().map((task) => task.title)).toEqual(['Fix banner']);

    store.searchInput.set('welcome');
    await settleSearch();
    expect(store.filteredTasks().map((task) => task.title)).toEqual(['Ship email']);
  });

  it('combines every filter', async () => {
    store.searchInput.set('i');
    store.priorityFilter.set('high');
    store.assigneeFilter.set('u_2');
    await settleSearch();

    expect(store.filteredTasks().map((task) => task.title)).toEqual(['Ship email']);
  });

  it('resets the filters', async () => {
    store.searchInput.set('banner');
    store.priorityFilter.set('urgent');
    store.assigneeFilter.set('none');
    await settleSearch();

    store.resetFilters();
    await settleSearch();

    expect(store.filteredTasks()).toHaveLength(3);
  });

  it('groups the filtered tasks per column', () => {
    const todo = boards.columnsOf('b_1')[0];

    expect(store.tasksOfColumn(todo.id)).toHaveLength(2);
  });

  it('quick-adds a medium task to a column', () => {
    const todo = boards.columnsOf('b_1')[0];

    store.quickAdd(todo.id, 'Quick one');

    const created = store.tasks().find((task) => task.title === 'Quick one');
    expect(created).toMatchObject({ priority: 'medium', columnId: todo.id, description: '' });
  });

  it('creates, updates, moves and removes tasks', () => {
    const [first] = store.tasks();

    store.update({ ...first, title: 'Renamed' });
    expect(store.tasks()[0].title).toBe('Renamed');

    store.move(first.id, 'b_1_review');
    expect(store.tasks()[0].columnId).toBe('b_1_review');

    store.remove(first.id);
    expect(store.tasks()).toHaveLength(2);
  });
});
