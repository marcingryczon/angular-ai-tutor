import { TestBed } from '@angular/core/testing';
import { BoardService } from './board.service';
import { TaskFlowData } from './db';

const EMPTY: TaskFlowData = { users: [], boards: [], columns: [], tasks: [] };

describe('BoardService', () => {
  let service: BoardService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardService);
  });

  it('persists and reloads through the db', () => {
    service.persist({
      ...EMPTY,
      users: [{ id: 'u', name: 'U', email: 'u@t.dev', role: 'member' }],
    });

    expect(service.loadPersisted()?.users).toHaveLength(1);
  });

  it('creates a board with trimmed text and default columns', () => {
    const data = service.create(
      EMPTY,
      { title: '  Ideas  ', description: '  Later  ', visibility: 'private' },
      'u_1',
    );

    expect(data.boards).toHaveLength(1);
    expect(data.boards[0].title).toBe('Ideas');
    expect(data.boards[0].description).toBe('Later');
    expect(data.boards[0].ownerId).toBe('u_1');
    expect(data.columns).toHaveLength(4);
    expect(data.boards[0].columnIds).toEqual(data.columns.map((column) => column.id));
  });

  it('removes a board with its columns and tasks', () => {
    const created = service.create(
      EMPTY,
      { title: 'Ideas', description: '', visibility: 'team' },
      'u_1',
    );
    const boardId = created.boards[0].id;
    const withTasks: TaskFlowData = {
      ...created,
      tasks: [
        {
          id: 't1',
          boardId,
          columnId: created.columns[0].id,
          title: 'Task',
          description: '',
          priority: 'low',
          dueDate: '',
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ],
    };

    const data = service.remove(withTasks, boardId);

    expect(data.boards).toHaveLength(0);
    expect(data.columns).toHaveLength(0);
    expect(data.tasks).toHaveLength(0);
  });
});
