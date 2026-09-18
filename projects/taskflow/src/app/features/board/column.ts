import { Component, ElementRef, viewChild } from '@angular/core';
import { Task } from '../../core/models';
import { TaskCard } from './task-card';

const TODAY = new Date().toISOString().slice(0, 10);

@Component({
  selector: 'app-column',
  imports: [TaskCard],
  templateUrl: './column.html',
  styleUrl: './column.scss',
})
export class Column {
  protected readonly title = 'To Do';

  // Hardcoded until Phase 2 wires the data through input()
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
  ];

  private readonly quickAddInput = viewChild<ElementRef<HTMLInputElement>>('quickAdd');

  /** Focuses the quick-add input (used by keyboard navigation later on). */
  focusQuickAdd(): void {
    this.quickAddInput()?.nativeElement.focus();
  }
}
