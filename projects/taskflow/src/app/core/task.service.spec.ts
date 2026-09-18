import { TestBed } from '@angular/core/testing';
import { TaskEvent, TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let events: TaskEvent[];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
    events = [];
    service.events$.subscribe((event) => events.push(event));
  });

  it('builds a task with an id and timestamps', () => {
    const task = service.build({
      boardId: 'b1',
      columnId: 'c1',
      title: 'New',
      description: '',
      priority: 'medium',
      dueDate: '',
    });

    expect(task.id).toMatch(/^task_/);
    expect(task.createdAt).toBe(task.updatedAt);
    expect(task.title).toBe('New');
  });

  it('multicasts announced events', () => {
    const task = service.build({
      boardId: 'b1',
      columnId: 'c1',
      title: 'New',
      description: '',
      priority: 'low',
      dueDate: '',
    });

    service.announce({ type: 'created', task });
    service.announce({ type: 'moved', task });

    expect(events.map((event) => event.type)).toEqual(['created', 'moved']);
  });
});
