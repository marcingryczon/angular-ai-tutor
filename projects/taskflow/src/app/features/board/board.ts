import { Component } from '@angular/core';
import { Task } from '../../core/models';
import { Column } from './column';

const TODAY = new Date().toISOString().slice(0, 10);

@Component({
  selector: 'app-board',
  imports: [Column],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  protected readonly title = 'Marketing Sprint';
  protected readonly description = 'Q3 launch tasks for the marketing team.';

  protected readonly tasks: Task[] = [
    {
      id: 't1',
      boardId: 'b1',
      columnId: 'todo',
      title: 'Draft launch campaign',
      description: 'Write the announcement copy and gather assets.',
      priority: 'medium',
      dueDate: '',
      assigneeId: 'u_anna',
      createdAt: TODAY,
      updatedAt: TODAY,
    },
    {
      id: 't2',
      boardId: 'b1',
      columnId: 'todo',
      title: 'Design hero banner',
      description: 'Create responsive banner for the landing page.',
      priority: 'low',
      dueDate: TODAY,
      createdAt: TODAY,
      updatedAt: TODAY,
    },
    {
      id: 't3',
      boardId: 'b1',
      columnId: 'in-progress',
      title: 'Ship onboarding email',
      description: 'Compose the 3-step welcome email sequence.',
      priority: 'high',
      dueDate: TODAY,
      assigneeId: 'u_marci',
      createdAt: TODAY,
      updatedAt: TODAY,
    },
    {
      id: 't4',
      boardId: 'b1',
      columnId: 'review',
      title: 'Review Q3 metrics',
      description: 'Summarise funnel conversion for the exec review.',
      priority: 'urgent',
      dueDate: '',
      assigneeId: 'u_anna',
      createdAt: TODAY,
      updatedAt: TODAY,
    },
    {
      id: 't5',
      boardId: 'b1',
      columnId: 'done',
      title: 'Update pricing page',
      description: 'Reflect the new tiered pricing.',
      priority: 'medium',
      dueDate: '',
      createdAt: TODAY,
      updatedAt: TODAY,
    },
  ];
}
