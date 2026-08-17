// Domain model for TaskFlow.
// These types are the single source of truth for the board/task Kanban domain.

/** Work priority, ordered from least to most critical. */
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

/** Semantic lifecycle status a column represents in a Kanban board. */
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

/** Who can see a board. */
export type Visibility = 'private' | 'team' | 'public';

/** Coarse role used for permission checks (Phase: role-based access). */
export type Role = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Profile {
  userId: string;
  displayName: string;
  avatarUrl?: string;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  visibility: Visibility;
  ownerId: string;
  /** Ordered list of column ids belonging to this board. */
  columnIds: string[];
  createdAt: string;
}

export interface Column {
  id: string;
  boardId: string;
  title: string;
  status: TaskStatus;
  order: number;
  /** Optional work-in-progress limit for the column. */
  wipLimit?: number;
}

export interface Task {
  id: string;
  boardId: string;
  columnId: string;
  title: string;
  description: string;
  priority: Priority;
  /** Due date in `yyyy-mm-dd` format (empty when unset). */
  dueDate: string;
  /** Optional assignee user id. */
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
}

/** Payload used to create a new task. */
export interface NewTaskInput {
  boardId: string;
  columnId: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  assigneeId?: string;
}

/** Payload used to update an existing task (identity fields are immutable). */
export type TaskPatch = Partial<Omit<Task, 'id' | 'boardId' | 'createdAt'>>;