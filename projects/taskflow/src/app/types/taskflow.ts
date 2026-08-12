// Union types — domena TaskFlow
type Priority = 'low' | 'medium' | 'high';
type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

// Interfejsy — domena TaskFlow
interface Task {
  readonly id: string;
  title: string;
  description: string | undefined;
  priority: Priority;
  status: TaskStatus;
  dueDate: string | undefined;
}

interface Column {
  readonly id: string;
  title: string;
  status: TaskStatus;
}

interface Board {
  readonly id: string;
  title: string;
  columns: Column[];
}