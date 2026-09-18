import { Task } from '../models';
import { filterTasks, matchesFilters, tasksOfBoard, tasksOfColumn } from './task-filters';

const BASE: Task = {
  id: 't1',
  boardId: 'b1',
  columnId: 'c1',
  title: 'Design hero banner',
  description: 'Landing page work',
  priority: 'low',
  dueDate: '',
  assigneeId: 'u_1',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

const NO_FILTERS = { search: '', priority: '' as const, assignee: '' };

describe('task filters', () => {
  it('keeps everything when no filter is set', () => {
    expect(matchesFilters(BASE, NO_FILTERS)).toBe(true);
  });

  it('matches the search term against title and description', () => {
    expect(matchesFilters(BASE, { ...NO_FILTERS, search: '  BANNER ' })).toBe(true);
    expect(matchesFilters(BASE, { ...NO_FILTERS, search: 'landing' })).toBe(true);
    expect(matchesFilters(BASE, { ...NO_FILTERS, search: 'invoice' })).toBe(false);
  });

  it('matches the priority', () => {
    expect(matchesFilters(BASE, { ...NO_FILTERS, priority: 'low' })).toBe(true);
    expect(matchesFilters(BASE, { ...NO_FILTERS, priority: 'urgent' })).toBe(false);
  });

  it('matches an assignee and the "unassigned" bucket', () => {
    expect(matchesFilters(BASE, { ...NO_FILTERS, assignee: 'u_1' })).toBe(true);
    expect(matchesFilters(BASE, { ...NO_FILTERS, assignee: 'u_2' })).toBe(false);
    expect(matchesFilters(BASE, { ...NO_FILTERS, assignee: 'none' })).toBe(false);
    expect(
      matchesFilters({ ...BASE, assigneeId: undefined }, { ...NO_FILTERS, assignee: 'none' }),
    ).toBe(true);
  });

  it('combines the filters with AND', () => {
    const tasks = [BASE, { ...BASE, id: 't2', priority: 'urgent' as const, title: 'Banner audit' }];

    expect(filterTasks(tasks, { search: 'banner', priority: 'urgent', assignee: 'u_1' })).toEqual([
      tasks[1],
    ]);
  });

  it('selects by board and by column', () => {
    const tasks = [BASE, { ...BASE, id: 't2', boardId: 'b2', columnId: 'c2' }];

    expect(tasksOfBoard(tasks, 'b1')).toEqual([BASE]);
    expect(tasksOfColumn(tasks, 'c2')).toEqual([tasks[1]]);
  });
});
