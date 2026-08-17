import { InjectionToken } from '@angular/core';
import type { Priority, TaskStatus } from './models';

/** Board configuration: the default columns (titles + statuses) seeded for every new board. */
export interface BoardColumnConfig {
  title: string;
  status: TaskStatus;
}

export interface BoardConfig {
  columns: BoardColumnConfig[];
  priorities: Priority[];
}

export const BOARD_CONFIG = new InjectionToken<BoardConfig>('BOARD_CONFIG', {
  factory: () => ({
    columns: [
      { title: 'To Do', status: 'todo' },
      { title: 'In Progress', status: 'in-progress' },
      { title: 'Review', status: 'review' },
      { title: 'Done', status: 'done' }
    ],
    priorities: ['low', 'medium', 'high', 'urgent']
  })
});