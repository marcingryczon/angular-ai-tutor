export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type Visibility = 'private' | 'team' | 'public';
export type Role = 'admin' | 'member';

export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: Role;
}

export interface Board {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly visibility: Visibility;
  readonly ownerId: string;
  readonly columnIds: readonly string[];
  readonly createdAt: string;
}

export interface Column {
  readonly id: string;
  readonly boardId: string;
  readonly title: string;
  readonly status: TaskStatus;
  readonly order: number;
  readonly wipLimit?: number;
}

export interface Task {
  readonly id: string;
  readonly boardId: string;
  readonly columnId: string;
  readonly title: string;
  readonly description: string;
  readonly priority: Priority;
  /** ISO date (yyyy-mm-dd) or '' when unset */
  readonly dueDate: string;
  readonly assigneeId?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
