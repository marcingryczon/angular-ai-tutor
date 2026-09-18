import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BOARD_CONFIG } from './config';
import { newId } from './helpers';
import { Board, Column, Task, User } from './models';

export interface TaskFlowData {
  readonly users: readonly User[];
  readonly boards: readonly Board[];
  readonly columns: readonly Column[];
  readonly tasks: readonly Task[];
}

const STORAGE_KEY = 'taskflow.db.v1';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function inDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * The only place that touches browser storage.
 * Outside the browser (SSR) every operation is a no-op, which keeps the
 * rest of the app platform-agnostic.
 */
@Injectable({ providedIn: 'root' })
export class TaskFlowDb {
  private readonly config = inject(BOARD_CONFIG);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Reads persisted data; falls back to freshly seeded data. */
  load(): TaskFlowData {
    if (!this.isBrowser) {
      return this.seed();
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const seeded = this.seed();
        this.save(seeded);
        return seeded;
      }
      return JSON.parse(raw) as TaskFlowData;
    } catch {
      // Corrupted or unavailable storage must never break the app.
      return this.seed();
    }
  }

  save(data: TaskFlowData): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Quota or private-mode errors are ignored on purpose.
    }
  }

  clear(): void {
    if (!this.isBrowser) {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
  }

  /** Builds the demo dataset from spec §7.3. */
  seed(): TaskFlowData {
    const users: User[] = [
      { id: 'u_marci', name: 'Marcin', email: 'marcin@taskflow.dev', role: 'admin' },
      { id: 'u_anna', name: 'Anna', email: 'anna@taskflow.dev', role: 'member' },
    ];

    const boards: Board[] = [];
    const columns: Column[] = [];
    const tasks: Task[] = [];

    const definitions = [
      {
        id: 'b_marketing',
        title: 'Marketing Sprint',
        description: 'Q3 launch tasks for the marketing team.',
        visibility: 'team' as const,
      },
      {
        id: 'b_bugs',
        title: 'Bug Tracker',
        description: 'Incoming defects and regressions.',
        visibility: 'public' as const,
      },
    ];

    for (const definition of definitions) {
      const boardColumns = this.config.columns.map((column, index) => ({
        id: `${definition.id}_${column.status}`,
        boardId: definition.id,
        title: column.title,
        status: column.status,
        order: index,
      }));
      columns.push(...boardColumns);

      boards.push({
        id: definition.id,
        title: definition.title,
        description: definition.description,
        visibility: definition.visibility,
        ownerId: 'u_marci',
        columnIds: boardColumns.map((column) => column.id),
        createdAt: today(),
      });

      tasks.push(
        ...this.seedTasks(definition.id).map((task) => ({
          ...task,
          columnId: `${definition.id}_${task.columnId}`,
        })),
      );
    }

    return { users, boards, columns, tasks };
  }

  private seedTasks(boardId: string): Task[] {
    const stamp = today();
    const base = { boardId, createdAt: stamp, updatedAt: stamp };

    return [
      {
        ...base,
        id: newId('task'),
        columnId: 'todo',
        title: 'Draft launch campaign',
        description: 'Write the announcement copy and gather assets.',
        priority: 'medium',
        dueDate: '',
        assigneeId: 'u_anna',
      },
      {
        ...base,
        id: newId('task'),
        columnId: 'todo',
        title: 'Design hero banner',
        description: 'Create responsive banner for the landing page.',
        priority: 'low',
        dueDate: inDays(5),
      },
      {
        ...base,
        id: newId('task'),
        columnId: 'in-progress',
        title: 'Ship onboarding email',
        description: 'Compose the 3-step welcome email sequence.',
        priority: 'high',
        dueDate: inDays(2),
        assigneeId: 'u_marci',
      },
      {
        ...base,
        id: newId('task'),
        columnId: 'review',
        title: 'Review Q3 metrics',
        description: 'Summarise funnel conversion for the exec review.',
        priority: 'urgent',
        dueDate: '',
        assigneeId: 'u_anna',
      },
      {
        ...base,
        id: newId('task'),
        columnId: 'done',
        title: 'Update pricing page',
        description: 'Reflect the new tiered pricing.',
        priority: 'medium',
        dueDate: '',
      },
    ];
  }
}
