import { Component } from '@angular/core';
import { TaskStatus } from '../types/taskflow';

@Component({
  selector: 'app-board',
  imports: [],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  readonly tasks = [
    { title: 'Draft launch campaign', status: 'todo' },
    { title: 'Design hero banner', status: 'todo' },
    { title: 'Ship onboarding email', status: 'in-progress' },
    { title: 'Review Q3 metrics', status: 'review' },
    { title: 'Update pricing page', status: 'done' },
  ] as const;

  protected countFor(status: TaskStatus): number {
    return this.tasks.filter(task => task.status === status).length;
  }
}
