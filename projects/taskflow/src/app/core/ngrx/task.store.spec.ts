import { Task } from '../models';
import { initialTaskState, TaskActions, taskReducer, tasksFeature } from './task.store';

const TASK: Task = {
  id: 't1',
  boardId: 'b_1',
  columnId: 'c1',
  title: 'Write copy',
  description: 'launch text',
  priority: 'low',
  dueDate: '',
  assigneeId: 'u_1',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

const OTHER: Task = {
  ...TASK,
  id: 't2',
  columnId: 'c2',
  title: 'Fix banner',
  description: '',
  priority: 'urgent',
  assigneeId: undefined,
};

const LOADED = taskReducer(
  initialTaskState,
  TaskActions.loaded({ tasks: [TASK, OTHER, { ...TASK, id: 't3', boardId: 'b_2' }] }),
);

describe('taskReducer', () => {
  it('ignores unknown actions', () => {
    expect(taskReducer(initialTaskState, { type: 'nothing' })).toBe(initialTaskState);
  });

  it('loads tasks and marks the slice loaded', () => {
    expect(LOADED.tasks).toHaveLength(3);
    expect(LOADED.loaded).toBe(true);
  });

  it('resets the filters when another board is selected', () => {
    const filtered = taskReducer(LOADED, TaskActions.searchChanged({ search: 'banner' }));

    const state = taskReducer(filtered, TaskActions.boardSelected({ boardId: 'b_2' }));

    expect(state.boardId).toBe('b_2');
    expect(state.search).toBe('');
  });

  it('adds, updates, moves and removes tasks immutably', () => {
    const added = taskReducer(LOADED, TaskActions.added({ task: { ...TASK, id: 't9' } }));
    expect(added.tasks).toHaveLength(4);
    expect(LOADED.tasks).toHaveLength(3);

    const updated = taskReducer(
      added,
      TaskActions.updated({ task: { ...TASK, title: 'Renamed' } }),
    );
    expect(updated.tasks[0].title).toBe('Renamed');

    const moved = taskReducer(updated, TaskActions.moved({ taskId: 't1', columnId: 'c3' }));
    expect(moved.tasks[0].columnId).toBe('c3');

    const removed = taskReducer(moved, TaskActions.removed({ taskId: 't1' }));
    expect(removed.tasks.map((task) => task.id)).toEqual(['t2', 't3', 't9']);
  });

  it('stores each filter', () => {
    let state = taskReducer(LOADED, TaskActions.searchChanged({ search: 'copy' }));
    state = taskReducer(state, TaskActions.priorityFilterChanged({ priority: 'urgent' }));
    state = taskReducer(state, TaskActions.assigneeFilterChanged({ assignee: 'none' }));

    expect(state).toMatchObject({
      search: 'copy',
      priorityFilter: 'urgent',
      assigneeFilter: 'none',
    });

    const reset = taskReducer(state, TaskActions.filtersReset());
    expect(reset).toMatchObject({ search: '', priorityFilter: '', assigneeFilter: '' });
  });
});

describe('task selectors', () => {
  const state = taskReducer(LOADED, TaskActions.boardSelected({ boardId: 'b_1' }));

  it('limits the tasks to the selected board', () => {
    expect(tasksFeature.selectBoardTasks.projector(state.tasks, state.boardId)).toEqual([
      TASK,
      OTHER,
    ]);
  });

  it('applies the filters', () => {
    const tasks = [TASK, OTHER];

    expect(
      tasksFeature.selectFilteredTasks.projector(tasks, {
        search: 'banner',
        priority: '',
        assignee: '',
      }),
    ).toEqual([OTHER]);

    expect(
      tasksFeature.selectFilteredTasks.projector(tasks, {
        search: '',
        priority: '',
        assignee: 'none',
      }),
    ).toEqual([OTHER]);
  });

  it('counts the filtered tasks and groups them per column', () => {
    expect(tasksFeature.selectTaskCount.projector([TASK, OTHER])).toBe(2);
    expect(tasksFeature.selectTasksByColumn('c2').projector([TASK, OTHER])).toEqual([OTHER]);
    expect(tasksFeature.selectTaskCountOfBoard('b_2').projector(state.tasks)).toBe(1);
  });

  it('memoises: the same inputs are not recomputed', () => {
    const selector = tasksFeature.selectFilteredTasks;
    selector.release();
    const filters = { search: '', priority: '' as const, assignee: '' };

    const first = selector.projector([TASK], filters);
    const second = selector.projector([TASK], filters);

    expect(first).toEqual(second);
  });
});
