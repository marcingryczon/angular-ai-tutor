import { Component, input, output, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import type { Priority, Task, User } from '../../core/models';

export interface TaskFormValue {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  assigneeId?: string;
}

/**
 * Create / edit form for a task. When an `existing` task is provided the form
 * is pre-filled and `save` emits an `update`; otherwise it emits `create`.
 */
@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="task-form" [attr.aria-label]="existing() ? 'Edit task' : 'New task'">
      <div class="task-form__field">
        <label class="field">
          <span class="field__label">Title</span>
          <input class="field__input" formControlName="title" placeholder="What needs doing?" required />
        </label>
        @if (form.get('title')?.hasError('required') && form.get('title')?.touched) {
          <span class="form-error">Title is required.</span>
        }
      </div>

      <label class="field">
        <span class="field__label">Description</span>
        <textarea class="field__input field__textarea" formControlName="description" rows="3" placeholder="Optional details"></textarea>
      </label>

      <div class="task-form__row">
        <label class="field">
          <span class="field__label">Priority</span>
          <select class="field__input" formControlName="priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>

        <label class="field">
          <span class="field__label">Due date</span>
          <input class="field__input" type="date" formControlName="dueDate" />
        </label>

        <label class="field">
          <span class="field__label">Assignee</span>
          <select class="field__input" formControlName="assigneeId">
            <option value="">Unassigned</option>
            @for (user of users(); track user.id) {
              <option [value]="user.id">{{ user.name }}</option>
            }
          </select>
        </label>
      </div>

      <div class="task-form__actions">
        <button type="submit" class="btn btn--primary" [disabled]="form.invalid">
          {{ existing() ? 'Save changes' : 'Add task' }}
        </button>
        <button type="button" class="btn" (click)="cancel.emit()">Cancel</button>
      </div>
    </form>
  `
})
export class TaskForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);

  /** Task to edit; `null` when creating a new task. */
  readonly existing = input<Task | null>(null);
  readonly users = input<User[]>([]);
  readonly columnId = input<string>('');

  readonly create = output<TaskFormValue>();
  readonly update = output<TaskFormValue>();
  readonly cancel = output<void>();

  protected readonly form = this.fb.group({
    title: [''],
    description: [''],
    priority: ['medium' as Priority],
    dueDate: [''],
    assigneeId: ['']
  });

  ngOnInit(): void {
    // Signal inputs are not populated in the constructor; by ngOnInit they are.
    const existing = this.existing();
    if (existing) {
      this.form.patchValue({
        title: existing.title,
        description: existing.description,
        priority: existing.priority,
        dueDate: existing.dueDate,
        assigneeId: existing.assigneeId ?? ''
      });
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      return;
    }
    const title = this.form.controls.title.value?.trim() ?? '';
    const description = this.form.controls.description.value?.trim() ?? '';
    const priority = (this.form.controls.priority.value ?? 'medium') as Priority;
    const dueDate = this.form.controls.dueDate.value ?? '';
    const assigneeId = this.form.controls.assigneeId.value || undefined;

    const value: TaskFormValue = { title, description, priority, dueDate, assigneeId };
    if (this.existing()) {
      this.update.emit(value);
    } else {
      this.create.emit(value);
    }
  }
}