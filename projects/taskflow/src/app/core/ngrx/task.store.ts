import {
  createActionGroup,
  createFeature,
  createReducer,
  createSelector,
  emptyProps,
  on,
  props,
} from '@ngrx/store';
import { TaskFilters, filterTasks, tasksOfBoard, tasksOfColumn } from '../domain/task-filters';
import { Priority, Task } from '../models';

export interface TaskState {
  readonly tasks: readonly Task[];
  readonly boardId: string;
  readonly search: string;
  readonly priorityFilter: Priority | '';
  readonly assigneeFilter: string;
  readonly loaded: boolean;
}

export const initialTaskState: TaskState = {
  tasks: [],
  boardId: '',
  search: '',
  priorityFilter: '',
  assigneeFilter: '',
  loaded: false,
};

export const TaskActions = createActionGroup({
  source: 'Tasks',
  events: {
    Loaded: props<{ tasks: readonly Task[] }>(),
    'Board Selected': props<{ boardId: string }>(),
    Added: props<{ task: Task }>(),
    Updated: props<{ task: Task }>(),
    Removed: props<{ taskId: string }>(),
    Moved: props<{ taskId: string; columnId: string }>(),
    'Search Changed': props<{ search: string }>(),
    'Priority Filter Changed': props<{ priority: Priority | '' }>(),
    'Assignee Filter Changed': props<{ assignee: string }>(),
    'Filters Reset': emptyProps(),
  },
});

const stamp = () => new Date().toISOString().slice(0, 10);

export const taskReducer = createReducer(
  initialTaskState,
  on(TaskActions.loaded, (state, { tasks }) => ({ ...state, tasks, loaded: true })),
  on(TaskActions.boardSelected, (state, { boardId }) => ({
    ...state,
    boardId,
    search: '',
    priorityFilter: '' as const,
    assigneeFilter: '',
  })),
  on(TaskActions.added, (state, { task }) => ({ ...state, tasks: [...state.tasks, task] })),
  on(TaskActions.updated, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map((item) =>
      item.id === task.id ? { ...task, updatedAt: stamp() } : item,
    ),
  })),
  on(TaskActions.removed, (state, { taskId }) => ({
    ...state,
    tasks: state.tasks.filter((task) => task.id !== taskId),
  })),
  on(TaskActions.moved, (state, { taskId, columnId }) => ({
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === taskId ? { ...task, columnId, updatedAt: stamp() } : task,
    ),
  })),
  on(TaskActions.searchChanged, (state, { search }) => ({ ...state, search })),
  on(TaskActions.priorityFilterChanged, (state, { priority }) => ({
    ...state,
    priorityFilter: priority,
  })),
  on(TaskActions.assigneeFilterChanged, (state, { assignee }) => ({
    ...state,
    assigneeFilter: assignee,
  })),
  on(TaskActions.filtersReset, (state) => ({
    ...state,
    search: '',
    priorityFilter: '' as const,
    assigneeFilter: '',
  })),
);

export const tasksFeature = createFeature({
  name: 'tasks',
  reducer: taskReducer,
  extraSelectors: ({
    selectTasks,
    selectBoardId,
    selectSearch,
    selectPriorityFilter,
    selectAssigneeFilter,
  }) => {
    const selectFilters = createSelector(
      selectSearch,
      selectPriorityFilter,
      selectAssigneeFilter,
      (search, priority, assignee): TaskFilters => ({ search, priority, assignee }),
    );

    const selectBoardTasks = createSelector(selectTasks, selectBoardId, (tasks, boardId) =>
      tasksOfBoard(tasks, boardId),
    );

    const selectFilteredTasks = createSelector(selectBoardTasks, selectFilters, (tasks, filters) =>
      filterTasks(tasks, filters),
    );

    return {
      selectFilters,
      selectBoardTasks,
      selectFilteredTasks,
      selectTaskCount: createSelector(selectFilteredTasks, (tasks) => tasks.length),
      selectTasksByColumn: (columnId: string) =>
        createSelector(selectFilteredTasks, (tasks) => tasksOfColumn(tasks, columnId)),
      selectTaskCountOfBoard: (boardId: string) =>
        createSelector(selectTasks, (tasks) => tasksOfBoard(tasks, boardId).length),
    };
  },
});

export const {
  selectTasksState,
  selectTasks,
  selectBoardId,
  selectSearch,
  selectPriorityFilter,
  selectAssigneeFilter,
  selectLoaded: selectTasksLoaded,
  selectFilteredTasks,
  selectBoardTasks,
  selectTaskCount,
  selectTasksByColumn,
  selectTaskCountOfBoard,
} = tasksFeature;
