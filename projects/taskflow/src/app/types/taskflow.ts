// Union types — domena TaskFlow
export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

// Interfejsy — domena TaskFlow
export interface Task {
  readonly id: string;
  title: string;
  description: string | undefined;
  priority: Priority;
  status: TaskStatus;
  dueDate: string | undefined;
}

export interface Column {
  readonly id: string;
  title: string;
  status: TaskStatus;
}

export interface Board {
  readonly id: string;
  title: string;
  columns: Column[];
}