import { Component, output, input, computed } from '@angular/core';
import { DueDatePipe } from '../../shared/pipes/due-date.pipe';
import { PriorityLabelPipe } from '../../shared/pipes/priority-label.pipe';
import { PriorityHighlightDirective } from '../../shared/directives/priority-highlight.directive';
import type { Task, User } from '../../core/models';

/**
 * A single Kanban card. It receives the task via a signal input and emits
 * select/edit/delete events to the parent (Column). Assignee lookup is done
 * from the user list passed down.
 */
@Component({
  selector: 'app-task-card',
  imports: [PriorityLabelPipe, DueDatePipe, PriorityHighlightDirective],
  template: `
    <article
      class="task-card"
      [priorityHighlight]="task().priority"
      [class.task-card--selected]="selected()"
      [draggable]="draggable()"
      (dragstart)="dragstart.emit($event)"
      (click)="select.emit()"
      tabindex="0"
      (keydown.enter)="select.emit()"
      [attr.aria-label]="'Task: ' + task().title"
    >
      <header class="task-card__header">
        <span class="badge badge--priority badge--{{ task().priority }}">
          {{ task().priority | priorityLabel }}
        </span>
        <div class="task-card__actions">
          <button type="button" class="icon-btn" aria-label="Edit task" (click)="$event.stopPropagation(); edit.emit()">
            <span class="material-symbols-rounded material-symbols-rounded--sm">edit</span>
          </button>
          <button type="button" class="icon-btn icon-btn--danger" aria-label="Delete task" (click)="$event.stopPropagation(); remove.emit()">
            <span class="material-symbols-rounded material-symbols-rounded--sm">delete</span>
          </button>
        </div>
      </header>

      <h3 class="task-card__title">{{ task().title }}</h3>
      @if (task().description) {
        <p class="task-card__desc">{{ task().description }}</p>
      }

      <footer class="task-card__footer">
        <span class="task-card__meta">
          <span class="dot" aria-hidden="true"></span>
          @if (task().dueDate) {
            {{ task().dueDate | dueDate }}
          } @else {
            no due date
          }
        </span>
        @if (assignee()) {
          <span class="avatar" [title]="assignee()!.name" aria-label="Assignee: {{ assignee()!.name }}">
            {{ assignee()!.name.charAt(0) }}
          </span>
        }
      </footer>
    </article>
  `
})
export class TaskCard {
  readonly task = input.required<Task>();
  readonly users = input<User[]>([]);
  readonly selected = input<boolean>(false);
  /** Whether this card can be dragged to another column. */
  readonly draggable = input<boolean>(false);

  readonly select = output<void>();
  readonly edit = output<void>();
  readonly remove = output<void>();
  /** Fired when the user begins dragging this card. */
  readonly dragstart = output<DragEvent>();

  /** The assignee (resolved by id from the users list), if any. */
  protected readonly assignee = computed(() => {
    const id = this.task().assigneeId;
    if (!id) {
      return null;
    }
    return this.users().find((u) => u.id === id) ?? null;
  });
}