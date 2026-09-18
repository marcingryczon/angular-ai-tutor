import { TestBed } from '@angular/core/testing';
import { SeedFile, TaskFlowDb, inDays, today } from './db';

const SEED: SeedFile = {
  users: [{ id: 'u_1', name: 'Ada', email: 'ada@taskflow.dev', role: 'admin' }],
  boards: [
    {
      id: 'b_1',
      title: 'Board one',
      description: 'First board',
      visibility: 'team',
      ownerId: 'u_1',
    },
  ],
  taskTemplates: [
    { title: 'A', description: 'a', status: 'todo', priority: 'low', dueInDays: 3 },
    { title: 'B', description: 'b', status: 'done', priority: 'high', assigneeId: 'u_1' },
    { title: 'Ghost', description: '', status: 'todo', priority: 'low' },
  ],
};

describe('TaskFlowDb', () => {
  let db: TaskFlowDb;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    db = TestBed.inject(TaskFlowDb);
  });

  it('returns undefined when nothing is persisted', () => {
    expect(db.load()).toBeUndefined();
  });

  it('saves and reads back the dataset', () => {
    const data = db.seed(SEED);
    db.save(data);

    expect(db.load()).toEqual(data);
  });

  it('survives corrupted storage', () => {
    localStorage.setItem('taskflow.db.v1', '{ not json');

    expect(db.load()).toBeUndefined();
  });

  it('clears the persisted dataset', () => {
    db.save(db.seed(SEED));
    db.clear();

    expect(db.load()).toBeUndefined();
  });

  it('builds the default columns for a board', () => {
    const columns = db.columnsFor('b_x');

    expect(columns.map((column) => column.status)).toEqual([
      'todo',
      'in-progress',
      'review',
      'done',
    ]);
    expect(columns[0].id).toBe('b_x_todo');
    expect(columns[3].order).toBe(3);
  });

  describe('seed()', () => {
    it('expands every board with columns and tasks', () => {
      const data = db.seed(SEED);

      expect(data.users).toEqual(SEED.users);
      expect(data.boards).toHaveLength(1);
      expect(data.columns).toHaveLength(4);
      expect(data.tasks).toHaveLength(3);
      expect(data.boards[0].columnIds).toHaveLength(4);
      expect(data.boards[0].createdAt).toBe(today());
    });

    it('turns dueInDays into a date and leaves the rest empty', () => {
      const [first, second] = db.seed(SEED).tasks;

      expect(first.dueDate).toBe(inDays(3));
      expect(second.dueDate).toBe('');
      expect(second.assigneeId).toBe('u_1');
    });

    it('skips templates whose status has no column', () => {
      const broken: SeedFile = {
        ...SEED,
        taskTemplates: [
          { title: 'Nowhere', description: '', status: 'archived' as never, priority: 'low' },
        ],
      };

      expect(db.seed(broken).tasks).toHaveLength(0);
    });
  });
});
