import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BoardStore } from '../../core/board.store';
import { TaskStore, type AssigneeFilter, type PriorityFilter } from '../../core/task.store';
import { AdminOnlyDirective } from '../../shared/directives/admin-only.directive';
import { Modal } from '../../shared/modal';
import { PriorityLabelPipe } from '../../shared/pipes/priority-label.pipe';
import { DueDatePipe } from '../../shared/pipes/due-date.pipe';
import type { Board as BoardModel, Task } from '../../core/models';
import { Column } from './column';
import { TaskForm, type TaskFormValue } from './task-form';

/**
 * The Kanban board page. It is the orchestrator: it selects the board in the
 * TaskStore, renders the filter bar and the four columns (which always fit the
 * viewport width), and handles all task mutations by dispatching to the store.
 *
 * Creating, editing and viewing a task happen in modal dialogs rather than a
 * permanent side panel, so the full board width is available for the columns.
 */
@Component({
  selector: 'app-board',
  imports: [
    RouterLink,
    FormsModule,
    Column,
    TaskForm,
    Modal,
    AdminOnlyDirective,
    PriorityLabelPipe,
    DueDatePipe
  ],
  template: `
    @if (board; as b) {
      <div class="board">
        <header class="board__header">
          <div class="board__heading">
            <a class="board__back" [routerLink]="['/']"><span class="material-symbols-rounded material-symbols-rounded--sm">arrow_back</span>All boards</a>
            <h1 class="board__title">
              {{ b.title }}
              <span class="board-card__badge visibility-{{ b.visibility }}">{{ b.visibility }}</span>
            </h1>
            <p class="board__desc">{{ b.description }}</p>
          </div>
          <div class="board__actions">
            <button type="button" class="btn btn--primary" (click)="openCreate()">
              <span class="material-symbols-rounded material-symbols-rounded--sm">add</span>New task
            </button>
            <ng-container *adminOnly>
              <button type="button" class="btn btn--ghost" (click)="resetData()">
                Reset demo data
              </button>
              <button type="button" class="btn btn--danger" (click)="deleteBoard()">
                Delete board
              </button>
            </ng-container>
          </div>
        </header>

        <div class="board__filter" role="search" aria-label="Filter tasks">
          <input
            class="field__input board__search"
            type="search"
            placeholder="Filter by text…"
            aria-label="Filter tasks by text"
            [ngModel]="searchText"
            (ngModelChange)="onSearch($event)"
          />
          <label class="field field--narrow">
            <span class="field__label">Priority</span>
            <select class="field__input" [ngModel]="priority" (ngModelChange)="onPriority($event)" aria-label="Filter by priority">
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>
          <label class="field field--narrow">
            <span class="field__label">Assignee</span>
            <select class="field__input" [ngModel]="assignee" (ngModelChange)="onAssignee($event)" aria-label="Filter by assignee">
              <option value="all">All</option>
              @for (user of taskStore.users(); track user.id) {
                <option [value]="user.id">{{ user.name }}</option>
              }
              <option value="unassigned">Unassigned</option>
            </select>
          </label>
          <span class="board__count">
            {{ taskStore.taskCount() }} task{{ taskStore.taskCount() === 1 ? '' : 's' }}
          </span>
        </div>

        <div class="board__columns" role="list" aria-label="Board columns">
          @for (col of taskStore.orderedColumns(); track col.id) {
            <app-column
              [column]="col"
              [tasks]="tasksIn(col.id)"
              [users]="taskStore.users()"
              [selectedTaskId]="taskStore.selectedTaskId()"
              (quickAdd)="onQuickAdd(col.id, $event)"
              (select)="openView($event)"
              (edit)="openEdit($event)"
              (remove)="onDeleteTask($event)"
              (move)="onMove($event)"
            />
          }
        </div>

        <!-- Create task modal -->
        @if (createOpen()) {
          <app-modal title="New task" label="Create a new task" (close)="createOpen.set(false)">
            <app-task-form
              [users]="taskStore.users()"
              [existing]="null"
              (create)="onCreate($event)"
              (cancel)="createOpen.set(false)"
            />
          </app-modal>
        }

        <!-- Edit task modal -->
        @if (editOpen() && taskStore.selectedTask(); as t) {
          <app-modal title="Edit task" label="Edit task" (close)="editOpen.set(false)">
            <app-task-form
              [users]="taskStore.users()"
              [existing]="t"
              (update)="onUpdate($event)"
              (cancel)="editOpen.set(false)"
            />
          </app-modal>
        }

        <!-- View task modal -->
        @if (viewOpen() && taskStore.selectedTask(); as t) {
          <app-modal title="Task details" label="Task details" (close)="viewOpen.set(false)">
            <div class="detail">
              <h3 class="detail__title">{{ t.title }}</h3>
              <span class="badge badge--priority badge--{{ t.priority }}">
                {{ t.priority | priorityLabel }}
              </span>
              @if (t.description) {
                <p class="detail__desc">{{ t.description }}</p>
              }
              <dl class="detail__meta">
                <div>
                  <dt>Due</dt>
                  <dd>@if (t.dueDate) { {{ t.dueDate | dueDate }} } @else { none }</dd>
                </div>
                <div>
                  <dt>Assignee</dt>
                  <dd>{{ assigneeName(t.assigneeId) }}</dd>
                </div>
              </dl>
            </div>
            <div class="board__panel-actions">
              <button type="button" class="btn btn--primary" (click)="openEditFromView()">Edit</button>
              <button type="button" class="btn btn--danger" (click)="onDeleteTask(t.id)">Delete</button>
            </div>
          </app-modal>
        }
      </div>
    } @else {
      <section class="not-found">
        <h1>Board not found</h1>
        <p>The board you are looking for does not exist.</p>
        <a class="btn btn--primary" [routerLink]="['/']"><span class="material-symbols-rounded material-symbols-rounded--sm">arrow_back</span>Back to boards</a>
      </section>
    }
  `
})
export class Board {
  private readonly boardStore = inject(BoardStore);
  protected readonly taskStore = inject(TaskStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** The board resolved for this route (null when the id is unknown). */
  protected readonly board: BoardModel | null = this.route.snapshot.data['board'] ?? null;

  // --- modal state -----------------------------------------------------------
  protected readonly createOpen = signal(false);
  protected readonly editOpen = signal(false);
  protected readonly viewOpen = signal(false);

  /** Local mirror of the store's filters (bound via ngModel). */
  protected searchText = this.taskStore.filterText();
  protected priority: PriorityFilter = this.taskStore.priorityFilter();
  protected assignee: AssigneeFilter = this.taskStore.assigneeFilter();

  constructor() {
    if (this.board) {
      this.taskStore.selectBoard(this.board.id);
    }
  }

  // --- filters ---------------------------------------------------------------
  protected onSearch(value: string): void {
    this.searchText = value;
    this.taskStore.setFilterText(value);
  }

  protected onPriority(value: PriorityFilter): void {
    this.priority = value;
    this.taskStore.setPriorityFilter(value);
  }

  protected onAssignee(value: AssigneeFilter): void {
    this.assignee = value;
    this.taskStore.setAssigneeFilter(value);
  }

  // --- selectors -------------------------------------------------------------
  protected tasksIn(columnId: string): Task[] {
    return this.taskStore.filteredTasks().filter((t) => t.columnId === columnId);
  }

  protected assigneeName(id: string | undefined): string {
    if (!id) {
      return 'Unassigned';
    }
    return this.taskStore.users().find((u) => u.id === id)?.name ?? 'Unassigned';
  }

  // --- modal openers ---------------------------------------------------------
  protected openCreate(): void {
    this.closeModals();
    this.createOpen.set(true);
  }

  protected openView(taskId: string): void {
    this.taskStore.selectTask(taskId);
    this.closeModals();
    this.viewOpen.set(true);
  }

  protected openEdit(taskId: string): void {
    this.taskStore.selectTask(taskId);
    this.closeModals();
    this.editOpen.set(true);
  }

  /** Switch from the view modal straight into edit mode for the same task. */
  protected openEditFromView(): void {
    const id = this.taskStore.selectedTaskId();
    if (id) {
      this.openEdit(id);
    }
  }

  private closeModals(): void {
    this.createOpen.set(false);
    this.editOpen.set(false);
    this.viewOpen.set(false);
  }

  // --- mutations (dispatch to the store) -------------------------------------
  protected onDeleteTask(taskId: string): void {
    this.taskStore.deleteTask(taskId);
    this.closeModals();
  }

  protected onMove({ taskId, toColumnId }: { taskId: string; toColumnId: string }): void {
    this.taskStore.moveTask(taskId, toColumnId);
  }

  protected onQuickAdd(columnId: string, title: string): void {
    if (!this.board) {
      return;
    }
    this.taskStore.addTask({
      boardId: this.board.id,
      columnId,
      title,
      description: '',
      priority: 'medium',
      dueDate: '',
      assigneeId: undefined
    });
  }

  protected onCreate(value: TaskFormValue): void {
    const column = this.taskStore.orderedColumns()[0];
    if (!this.board || !column) {
      return;
    }
    this.taskStore.addTask({
      boardId: this.board.id,
      columnId: column.id,
      title: value.title,
      description: value.description,
      priority: value.priority,
      dueDate: value.dueDate,
      assigneeId: value.assigneeId
    });
    this.createOpen.set(false);
  }

  protected onUpdate(value: TaskFormValue): void {
    const task = this.taskStore.selectedTask();
    if (!task) {
      return;
    }
    this.taskStore.updateTask(task.id, {
      title: value.title,
      description: value.description,
      priority: value.priority,
      dueDate: value.dueDate,
      assigneeId: value.assigneeId
    });
    this.editOpen.set(false);
  }

  // --- admin actions ---------------------------------------------------------
  protected resetData(): void {
    this.boardStore.resetDemoData();
    if (this.board) {
      this.taskStore.selectBoard(this.board.id);
    }
    this.closeModals();
  }

  protected deleteBoard(): void {
    if (this.board) {
      this.boardStore.deleteBoard(this.board.id);
    }
    this.router.navigate(['/']);
  }
}