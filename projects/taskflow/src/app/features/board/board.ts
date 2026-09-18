import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { BoardService } from '../../core/board.service';
import { BOARD_CONFIG } from '../../core/config';
import { Column as ColumnModel, Priority, Task } from '../../core/models';
import { SessionService } from '../../core/session.service';
import { TaskService } from '../../core/task.service';
import { Modal } from '../../shared/modal';
import { Column, TaskMove } from './column';

@Component({
  selector: 'app-board',
  imports: [Column, Modal],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  private readonly boardService = inject(BoardService);
  private readonly taskService = inject(TaskService);
  protected readonly session = inject(SessionService);
  protected readonly config = inject(BOARD_CONFIG);

  /** One hardcoded board until routing arrives in Phase 7. */
  protected readonly boardId = signal('b_marketing');

  protected readonly board = computed(() => this.boardService.boardById(this.boardId()));
  protected readonly columns = computed(() => this.boardService.columnsOf(this.boardId()));
  protected readonly users = this.boardService.users;

  // --- filter bar state (spec §5.2) ---
  protected readonly search = signal('');
  protected readonly priorityFilter = signal<Priority | ''>('');
  protected readonly assigneeFilter = signal<string>('');

  protected readonly tasks = computed(() => this.taskService.tasksOfBoard(this.boardId()));

  protected readonly filteredTasks = computed(() => {
    const term = this.search().trim().toLowerCase();
    const priority = this.priorityFilter();
    const assignee = this.assigneeFilter();

    return this.tasks().filter((task) => {
      const matchesText =
        !term ||
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term);
      const matchesPriority = !priority || task.priority === priority;
      const matchesAssignee =
        !assignee ||
        (assignee === 'none' ? !task.assigneeId : task.assigneeId === assignee);

      return matchesText && matchesPriority && matchesAssignee;
    });
  });

  /** Resets itself whenever the selected task disappears from the filtered list. */
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

  protected tasksOf(column: ColumnModel): readonly Task[] {
    return this.filteredTasks().filter((task) => task.columnId === column.id);
  }

  protected onSearch(value: string): void {
    this.search.set(value);
  }

  protected onPriorityFilter(value: string): void {
    this.priorityFilter.set(value as Priority | '');
  }

  protected onAssigneeFilter(value: string): void {
    this.assigneeFilter.set(value);
  }

  protected onQuickAdd(column: ColumnModel, title: string): void {
    this.taskService.add(this.boardId(), column.id, title);
  }

  protected onRemove(task: Task): void {
    this.taskService.remove(task.id);
  }

  protected onEdit(task: Task): void {
    this.editedTask.set(task);
  }

  protected onSelect(task: Task): void {
    this.selectedTaskId.set(task.id);
  }

  protected onMove({ taskId, columnId }: TaskMove): void {
    this.taskService.move(taskId, columnId);
  }

  protected resetDemoData(): void {
    this.boardService.reset();
  }

  protected closeModal(): void {
    this.editedTask.set(undefined);
    this.isCreating.set(false);
    this.selectedTaskId.set(undefined);
  }
}
