import { Injectable, inject } from '@angular/core';
import { BOARD_CONFIG, type BoardColumnConfig } from './config';
import { newId } from './helpers';
import type { Board, Column, Task, TaskStatus, User, Visibility } from './models';

/**
 * Board-scoped persistence. In a real backend each board would be a separate
 * resource; here we scope the `tasks` array by `boardId` to keep the "per-board
 * state" story explicit.
 */
export interface BoardDb {
  board: Board;
  columns: Column[];
  tasks: Task[];
  users: User[];
}

const STORAGE_KEY = 'taskflow.db.v1';

function nowIso(): string {
  return new Date().toISOString();
}

/** Builds the default set of columns for a board from configuration. */
export function defaultColumns(boardId: string, config: BoardColumnConfig[]): Column[] {
  return config.map((col, index) => ({
    id: newId('col'),
    boardId,
    title: col.title,
    status: col.status,
    order: index
  }));
}

@Injectable({ providedIn: 'root' })
export class TaskFlowDb {
  private readonly boardConfig = inject(BOARD_CONFIG);

  /** Read the whole database, seeding it on first access. */
  load(): Record<string, BoardDb> {
    if (typeof localStorage === 'undefined') {
      return this.seed();
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return this.seed();
    }
    try {
      return JSON.parse(raw) as Record<string, BoardDb>;
    } catch {
      return this.seed();
    }
  }

  /** Persist the whole database. No-op outside the browser (SSR safe). */
  save(db: Record<string, BoardDb>): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  /** Create a fresh database with two demo boards. */
  private seed(): Record<string, BoardDb> {
    const users: User[] = [
      { id: 'u_marci', name: 'Marcin', email: 'marcin@example.com', role: 'admin' },
      { id: 'u_anna', name: 'Anna', email: 'anna@example.com', role: 'member' }
    ];

    const db: Record<string, BoardDb> = {
      b_marketing: this.buildBoard('b_marketing', 'Marketing Sprint', 'team', 'u_marci', users),
      b_bugs: this.buildBoard('b_bugs', 'Bug Tracker', 'public', 'u_marci', users)
    };

    this.save(db);
    return db;
  }

  private buildBoard(
    id: string,
    title: string,
    visibility: Visibility,
    ownerId: string,
    users: User[]
  ): BoardDb {
    const columns = defaultColumns(id, this.boardConfig.columns);
    const board: Board = {
      id,
      title,
      description: `The "${title}" board`,
      visibility,
      ownerId,
      columnIds: columns.map((c) => c.id),
      createdAt: nowIso()
    };

    const tasks = this.seedTasks(id, columns, users);
    return { board, columns, tasks, users };
  }

  private seedTasks(boardId: string, columns: Column[], users: User[]): Task[] {
    const byStatus = (status: TaskStatus) => columns.find((c) => c.status === status)!;
    const tasks: Array<{
      title: string;
      description: string;
      status: TaskStatus;
      priority: Task['priority'];
      assigneeId?: string;
      dueDaysFromNow?: number;
    }> = [
      {
        title: 'Draft launch campaign',
        description: 'Write the announcement copy and gather assets.',
        status: 'todo',
        priority: 'medium',
        assigneeId: 'u_anna'
      },
      {
        title: 'Design hero banner',
        description: 'Create responsive banner for the landing page.',
        status: 'todo',
        priority: 'low',
        dueDaysFromNow: 5
      },
      {
        title: 'Ship onboarding email',
        description: 'Compose the 3-step welcome email sequence.',
        status: 'in-progress',
        priority: 'high',
        assigneeId: 'u_marci',
        dueDaysFromNow: 2
      },
      {
        title: 'Review Q3 metrics',
        description: 'Summarise funnel conversion for the exec review.',
        status: 'review',
        priority: 'urgent',
        assigneeId: 'u_anna'
      },
      {
        title: 'Update pricing page',
        description: 'Reflect the new tiered pricing.',
        status: 'done',
        priority: 'medium'
      }
    ];

    const due = (days?: number): string => {
      if (days === undefined) {
        return '';
      }
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    };

    return tasks.map((t) => ({
      id: newId('task'),
      boardId,
      columnId: byStatus(t.status).id,
      title: t.title,
      description: t.description,
      priority: t.priority,
      dueDate: due(t.dueDaysFromNow),
      assigneeId: t.assigneeId,
      createdAt: nowIso(),
      updatedAt: nowIso()
    }));
  }

  /** Reset to a fresh seeded database. */
  reset(): Record<string, BoardDb> {
    const db = this.seed();
    return db;
  }
}