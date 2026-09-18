import { Component } from '@angular/core';
import { Task } from '../../core/models';

const TODAY = new Date().toISOString().slice(0, 10);

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
})
export class TaskCard {
  // Hardcoded until Phase 2 wires the data through input()
  protected readonly task: Task = {
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
  };

  protected readonly assigneeName = 'Anna';
}
