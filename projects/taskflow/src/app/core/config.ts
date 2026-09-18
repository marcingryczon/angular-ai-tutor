import { InjectionToken } from '@angular/core';
import { Priority, TaskStatus } from './models';

export interface ColumnConfig {
  readonly title: string;
  readonly status: TaskStatus;
}

export interface BoardConfig {
  readonly columns: readonly ColumnConfig[];
  readonly priorities: readonly Priority[];
}

export const DEFAULT_BOARD_CONFIG: BoardConfig = {
  columns: [
    { title: 'To Do', status: 'todo' },
    { title: 'In Progress', status: 'in-progress' },
    { title: 'Review', status: 'review' },
    { title: 'Done', status: 'done' },
  ],
  priorities: ['low', 'medium', 'high', 'urgent'],
};

/** Shape of every new board: its columns and the available priorities. */
export const BOARD_CONFIG = new InjectionToken<BoardConfig>('BOARD_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_BOARD_CONFIG,
});
