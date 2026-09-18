import { Priority, Task } from '../models';

export interface TaskFilters {
  readonly search: string;
  readonly priority: Priority | '';
  /** A user id, `'none'` for unassigned, or `''` for "all". */
  readonly assignee: string;
}

/** Pure business rule: does a task survive the filter bar? */
export function matchesFilters(task: Task, filters: TaskFilters): boolean {
  const term = filters.search.trim().toLowerCase();

  const matchesText =
    !term ||
    task.title.toLowerCase().includes(term) ||
    task.description.toLowerCase().includes(term);

  const matchesPriority = !filters.priority || task.priority === filters.priority;

  const matchesAssignee =
    !filters.assignee ||
    (filters.assignee === 'none' ? !task.assigneeId : task.assigneeId === filters.assignee);

  return matchesText && matchesPriority && matchesAssignee;
}

export function filterTasks(tasks: readonly Task[], filters: TaskFilters): readonly Task[] {
  return tasks.filter((task) => matchesFilters(task, filters));
}

export function tasksOfBoard(tasks: readonly Task[], boardId: string): readonly Task[] {
  return tasks.filter((task) => task.boardId === boardId);
}

export function tasksOfColumn(tasks: readonly Task[], columnId: string): readonly Task[] {
  return tasks.filter((task) => task.columnId === columnId);
}
