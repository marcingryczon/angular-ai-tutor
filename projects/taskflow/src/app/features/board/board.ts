import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { BOARD_CONFIG } from '../../core/config';
import { Column as ColumnModel, Priority, Task } from '../../core/models';
import {
  selectBoardById,
  selectColumnsOfBoard,
  selectUserById,
  selectUsers,
} from '../../core/ngrx/board.store';
import {
  selectAssigneeFilter,
  selectBoardTasks,
  selectFilteredTasks,
  selectPriorityFilter,
  selectSearch,
  selectTaskCount,
  TaskActions,
} from '../../core/ngrx/task.store';
import { TaskFlowState } from '../../core/ngrx/taskflow-state.service';
import { SessionService } from '../../core/session.service';
import { TaskService } from '../../core/task.service';
import { AdminOnlyDirective } from '../../shared/directives/admin-only.directive';
import { Modal } from '../../shared/modal';
import { DueDatePipe } from '../../shared/pipes/due-date.pipe';
import { PriorityLabelPipe } from '../../shared/pipes/priority-label.pipe';
import { Column, TaskMove } from './column';
import { TaskForm, TaskFormValue } from './task-form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-board',
  imports: [
    Column,
    Modal,
    TaskForm,
    RouterLink,
    AdminOnlyDirective,
    DueDatePipe,
    PriorityLabelPipe,
  ],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly taskService = inject(TaskService);
  protected readonly state = inject(TaskFlowState);
  protected readonly session = inject(SessionService);
  protected readonly config = inject(BOARD_CONFIG);

  /** Bound from the route via `withComponentInputBinding()`. */
  readonly boardId = input.required<string>();

  protected readonly board = computed(() =>
    this.store.selectSignal(selectBoardById(this.boardId()))(),
  );
  protected readonly columns = computed(() =>
    this.store.selectSignal(selectColumnsOfBoard(this.boardId()))(),
  );
  protected readonly users = this.store.selectSignal(selectUsers);

  protected readonly filteredTasks = this.store.selectSignal(selectFilteredTasks);
  protected readonly taskCount = this.store.selectSignal(selectTaskCount);
  protected readonly boardTasks = this.store.selectSignal(selectBoardTasks);
  protected readonly search = this.store.selectSignal(selectSearch);
  protected readonly priorityFilter = this.store.selectSignal(selectPriorityFilter);
  protected readonly assigneeFilter = this.store.selectSignal(selectAssigneeFilter);

  /** Raw keystrokes; the store only sees the debounced value. */
  protected readonly searchInput = signal('');
  private readonly debouncedSearch = toSignal(
    toObservable(this.searchInput).pipe(
      debounceTime(300),
      map((term) => term.trim().toLowerCase()),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  /** Short-lived toast driven by the task event bus. */
  protected readonly notice = signal('');

  protected readonly selectedTaskId = linkedSignal<readonly Task[], string | undefined>({
    source: this.filteredTasks,
    computation: (tasks, previous) =>
      previous && tasks.some((task) => task.id === previous.value) ? previous.value : undefined,
  });

  protected readonly selectedTask = computed(() =>
    this.filteredTasks().find((task) => task.id === this.selectedTaskId()),
  );

  protected readonly editedTask = signal<Task | undefined>(undefined);
  protected readonly isCreating = signal(false);

  /** Titles already on this board, minus the task being edited. */
  protected readonly existingTitles = computed(() =>
    this.boardTasks()
      .filter((task) => task.id !== this.editedTask()?.id)
      .map((task) => task.title),
  );

  constructor() {
    effect(() => this.store.dispatch(TaskActions.boardSelected({ boardId: this.boardId() })));

    effect(() => {
      const search = this.debouncedSearch();
      this.store.dispatch(TaskActions.searchChanged({ search }));
    });

    this.taskService.events$.pipe(takeUntilDestroyed()).subscribe((event) => {
      this.notice.set(`Task ${event.type}`);
      setTimeout(() => this.notice.set(''), 2000);
    });
  }

  protected tasksOf(column: ColumnModel): readonly Task[] {
    return this.filteredTasks().filter((task) => task.columnId === column.id);
  }

  protected onSearch(value: string): void {
    this.searchInput.set(value);
  }

  protected onPriorityFilter(value: string): void {
    this.store.dispatch(TaskActions.priorityFilterChanged({ priority: value as Priority | '' }));
  }

  protected onAssigneeFilter(value: string): void {
    this.store.dispatch(TaskActions.assigneeFilterChanged({ assignee: value }));
  }

  protected onQuickAdd(column: ColumnModel, title: string): void {
    this.state.createTask({
      boardId: this.boardId(),
      columnId: column.id,
      title,
      description: '',
      priority: 'medium',
      dueDate: '',
    });
  }

  protected onRemove(task: Task): void {
    this.state.removeTask(task.id);
  }

  protected onEdit(task: Task): void {
    this.editedTask.set(task);
  }

  protected onSelect(task: Task): void {
    this.selectedTaskId.set(task.id);
  }

  protected onMove({ taskId, columnId }: TaskMove): void {
    this.state.moveTask(taskId, columnId);
  }

  protected onSave(value: TaskFormValue): void {
    const edited = this.editedTask();
    const fields = {
      title: value.title.trim(),
      description: value.description.trim(),
      priority: value.priority,
      dueDate: value.dueDate,
      assigneeId: value.assigneeId || undefined,
    };

    if (edited) {
      this.store.dispatch(TaskActions.updated({ task: { ...edited, ...fields } }));
    } else {
      this.state.createTask({
        boardId: this.boardId(),
        columnId: this.columns()[0]?.id ?? '',
        ...fields,
      });
    }
    this.closeModal();
  }

  protected editSelected(): void {
    const task = this.selectedTask();
    if (task) {
      this.selectedTaskId.set(undefined);
      this.editedTask.set(task);
    }
  }

  protected removeSelected(): void {
    const task = this.selectedTask();
    if (task) {
      this.state.removeTask(task.id);
      this.selectedTaskId.set(undefined);
    }
  }

  protected assigneeName(task: Task): string {
    return this.store.selectSignal(selectUserById(task.assigneeId))()?.name ?? 'Unassigned';
  }

  protected resetDemoData(): void {
    this.state.reset();
  }

  protected deleteBoard(): void {
    this.state.removeBoard(this.boardId());
    void this.router.navigate(['/']);
  }

  protected closeModal(): void {
    this.editedTask.set(undefined);
    this.isCreating.set(false);
    this.selectedTaskId.set(undefined);
  }
}
