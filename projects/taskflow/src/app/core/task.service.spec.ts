import { TestBed } from '@angular/core/testing';
import { TaskFlowData } from './db';
import { Task } from './models';
import { TaskEvent, TaskService } from './task.service';

const TASK: Task = {
  id: 't1',
  boardId: 'b1',
  columnId: 'c1',
  title: 'Existing',
  description: 'desc',
  priority: 'low',
  dueDate: '',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

const DATA: TaskFlowData = { users: [], boards: [], columns: [], tasks: [TASK] };

describe('TaskService', () => {
  let service: TaskService;
  let events: TaskEvent[];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
    events = [];
    service.events$.subscribe((event) => events.push(event));
  });

  it('creates a task and announces it', () => {
    const data = service.create(DATA, {
      boardId: 'b1',
      columnId: 'c1',
      title: 'New',
      description: '',
      priority: 'medium',
      dueDate: '',
    });

    expect(data.tasks).toHaveLength(2);
    expect(data.tasks[1].id).toMatch(/^task_/);
    expect(events).toEqual([{ type: 'created', task: data.tasks[1] }]);
  });

  it('updates a task without touching the others', () => {
    const data = service.update(
      { ...DATA, tasks: [TASK, { ...TASK, id: 't2' }] },
      { ...TASK, title: 'Renamed' },
    );

    expect(data.tasks[0].title).toBe('Renamed');
    expect(data.tasks[1].title).toBe('Existing');
    expect(events).toHaveLength(0);
  });

  it('removes a task and announces it', () => {
    const data = service.remove(DATA, 't1');

    expect(data.tasks).toHaveLength(0);
    expect(events[0].type).toBe('deleted');
  });

  it('ignores a delete for an unknown id', () => {
    const data = service.remove(DATA, 'nope');

    expect(data.tasks).toHaveLength(1);
    expect(events).toHaveLength(0);
  });

  it('moves a task to another column and announces it', () => {
    const data = service.move(DATA, 't1', 'c2');

    expect(data.tasks[0].columnId).toBe('c2');
    expect(events[0]).toMatchObject({ type: 'moved', task: { columnId: 'c2' } });
  });

  it('ignores a move for an unknown id', () => {
    const data = service.move(DATA, 'nope', 'c2');

    expect(data.tasks[0].columnId).toBe('c1');
    expect(events).toHaveLength(0);
  });
});
