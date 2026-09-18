import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Task, User } from '../../core/models';
import { PriorityHighlightDirective } from '../../shared/directives/priority-highlight.directive';
import { DueDatePipe } from '../../shared/pipes/due-date.pipe';
import { PriorityLabelPipe } from '../../shared/pipes/priority-label.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-task-card',
  imports: [PriorityHighlightDirective, DueDatePipe, PriorityLabelPipe],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
  host: {
    '[attr.draggable]': 'true',
    '(dragstart)': 'onDragStart($event)',
  },
})
export class TaskCard {
  readonly task = input.required<Task>();
  readonly assignee = input<User | undefined>(undefined);
  readonly selected = input(false);

  readonly select = output<Task>();
  readonly edit = output<Task>();
  readonly remove = output<Task>();

  protected onDragStart(event: DragEvent): void {
    event.dataTransfer?.setData('text/plain', this.task().id);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }
}
