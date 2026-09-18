import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Column as ColumnModel, Task, User } from '../../core/models';
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
  /** Columns offered by the keyboard "move to" menu. */
  readonly columns = input<readonly ColumnModel[]>([]);

  readonly select = output<Task>();
  readonly edit = output<Task>();
  readonly remove = output<Task>();
  readonly moveTo = output<string>();

  /** The move menu is the keyboard alternative to dragging the card. */
  protected readonly isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected onMove(columnId: string): void {
    this.moveTo.emit(columnId);
    this.closeMenu();
  }

  protected onDragStart(event: DragEvent): void {
    event.dataTransfer?.setData('text/plain', this.task().id);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }
}
