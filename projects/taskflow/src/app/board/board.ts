import { Component } from '@angular/core';
import { Column, Task, TaskStatus } from '../types/taskflow';

@Component({
  selector: 'app-board',
  imports: [],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  readonly columns: Column[] = [
    { id: 'c_1', title: 'To Do', status: 'todo' },
    { id: 'c_2', title: 'In Progress', status: 'in-progress' },
    { id: 'c_3', title: 'Review', status: 'review' },
    { id: 'c_4', title: 'Done', status: 'done' },
  ] as const;

  readonly tasks: Task[] = [
    { id: 't_1', title: 'Draft launch campaign', description: 'Write the announcement copy and gather assets.', status: 'todo', priority: 'medium', dueDate: undefined   },
    { id: 't_2', title: 'Design hero banner', description: 'Create responsive banner for the landing page.', status: 'todo', priority: 'low', dueDate: undefined   },
    { id: 't_3', title: 'Ship onboarding email', description: 'Compose the 3-step welcome email sequence.', status: 'in-progress', priority: 'high', dueDate: undefined   },
    { id: 't_4', title: 'Review Q3 metrics', description: 'Summarise funnel conversion for the exec review.', status: 'review', priority: 'urgent', dueDate: undefined   },
    { id: 't_5', title: 'Update pricing page', description: 'Reflect the new tiered pricing.', status: 'done', priority: 'medium', dueDate: undefined   },
  ] as const;

  protected countFor(status: TaskStatus): number {
    return this.tasks.filter((task) => task.status === status).length;
  }

  protected taskFor(status: TaskStatus): readonly Task[] {
    return this.tasks.filter(task => task.status === status)
  }
}
