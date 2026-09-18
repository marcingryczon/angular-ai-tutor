import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { form, FormField, required, submit, validate } from '@angular/forms/signals';
import { Priority, Task, User } from '../../core/models';

export interface TaskFormValue {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  assigneeId: string;
}

function emptyValue(): TaskFormValue {
  return { title: '', description: '', priority: 'medium', dueDate: '', assigneeId: '' };
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-task-form',
  imports: [FormField],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {
  /** When set the form edits that task; otherwise it creates a new one. */
  readonly task = input<Task | undefined>(undefined);
  readonly users = input<readonly User[]>([]);
  readonly priorities = input<readonly Priority[]>(['low', 'medium', 'high', 'urgent']);
  /** Titles already used on this board — drives the duplicate-title rule. */
  readonly existingTitles = input<readonly string[]>([]);

  readonly save = output<TaskFormValue>();
  readonly cancel = output<void>();

  protected readonly isEdit = computed(() => this.task() !== undefined);

  /** Resets whenever a different task is edited. */
  protected readonly model = linkedSignal<Task | undefined, TaskFormValue>({
    source: this.task,
    computation: (task) =>
      task
        ? {
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate,
            assigneeId: task.assigneeId ?? '',
          }
        : emptyValue(),
  });

  protected readonly taskForm = form(this.model, (path) => {
    required(path.title, { message: 'Title is required.' });

    validate(path.title, ({ value }) => {
      const title = value().trim().toLowerCase();
      if (!title) {
        return undefined;
      }
      const taken = this.existingTitles().some(
        (existing) => existing.trim().toLowerCase() === title,
      );
      return taken
        ? { kind: 'duplicateTitle', message: 'A task with this title already exists.' }
        : undefined;
    });
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.taskForm, async () => {
      this.save.emit(this.model());
    });
  }
}
