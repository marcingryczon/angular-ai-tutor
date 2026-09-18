import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BOARD_CONFIG } from './config';
import { newId } from './helpers';
import { Board, Column, Priority, Task, TaskStatus, User, Visibility } from './models';

export interface TaskFlowData {
  readonly users: readonly User[];
  readonly boards: readonly Board[];
  readonly columns: readonly Column[];
  readonly tasks: readonly Task[];
}

/** Shape of `public/seed.json`. Due dates are offsets so the demo always looks current. */
export interface SeedFile {
  readonly users: readonly User[];
  readonly boards: readonly {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly visibility: Visibility;
    readonly ownerId: string;
  }[];
  readonly taskTemplates: readonly {
    readonly title: string;
    readonly description: string;
    readonly status: TaskStatus;
    readonly priority: Priority;
    readonly assigneeId?: string;
    readonly dueInDays?: number;
  }[];
}

const STORAGE_KEY = 'taskflow.db.v1';

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function inDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * The only place that touches browser storage.
 * Outside the browser (SSR) reads return `undefined` and writes are no-ops,
 * which keeps the rest of the app platform-agnostic.
 */
@Injectable({ providedIn: 'root' })
export class TaskFlowDb {
  private readonly config = inject(BOARD_CONFIG);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Persisted dataset, or `undefined` on first run / outside the browser. */
  load(): TaskFlowData | undefined {
    if (!this.isBrowser) {
      return undefined;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as TaskFlowData) : undefined;
    } catch {
      return undefined;
    }
  }

  save(data: TaskFlowData): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Quota or private-mode errors must never break the app.
    }
  }

  clear(): void {
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  /** Expands `seed.json` into the full dataset (spec §7.3). */
  seed(file: SeedFile): TaskFlowData {
    const boards: Board[] = [];
    const columns: Column[] = [];
    const tasks: Task[] = [];
    const stamp = today();

    for (const definition of file.boards) {
      const boardColumns = this.columnsFor(definition.id);
      columns.push(...boardColumns);

      boards.push({
        ...definition,
        columnIds: boardColumns.map((column) => column.id),
        createdAt: stamp,
      });

      for (const template of file.taskTemplates) {
        const column = boardColumns.find((item) => item.status === template.status);
        if (!column) {
          continue;
        }
        tasks.push({
          id: newId('task'),
          boardId: definition.id,
          columnId: column.id,
          title: template.title,
          description: template.description,
          priority: template.priority,
          dueDate: template.dueInDays === undefined ? '' : inDays(template.dueInDays),
          assigneeId: template.assigneeId,
          createdAt: stamp,
          updatedAt: stamp,
        });
      }
    }

    return { users: file.users, boards, columns, tasks };
  }

  /** Default columns for a board, taken from `BOARD_CONFIG`. */
  columnsFor(boardId: string): Column[] {
    return this.config.columns.map((column, index) => ({
      id: `${boardId}_${column.status}`,
      boardId,
      title: column.title,
      status: column.status,
      order: index,
    }));
  }
}
