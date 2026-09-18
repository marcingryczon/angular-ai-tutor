import { Component, inject } from '@angular/core';
import { BoardService } from '../../core/board.service';
import { Column as ColumnModel, Task } from '../../core/models';
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
  private readonly boards = inject(BoardService);
  private readonly taskService = inject(TaskService);
  protected readonly session = inject(SessionService);

  /** One hardcoded board until routing arrives in Phase 7. */
  protected readonly boardId = 'b_marketing';

  protected editedTask: Task | undefined = undefined;
  protected isCreating = false;

  protected get board() {
    return this.boards.boardById(this.boardId);
  }

  protected get columns(): readonly ColumnModel[] {
    return this.boards.columnsOf(this.boardId);
  }

  protected get users() {
    return this.boards.users;
  }

  protected get tasks(): readonly Task[] {
    return this.taskService.tasksOfBoard(this.boardId);
  }

  protected tasksOf(column: ColumnModel): readonly Task[] {
    return this.tasks.filter((task) => task.columnId === column.id);
  }

  protected onQuickAdd(column: ColumnModel, title: string): void {
    this.taskService.add(this.boardId, column.id, title);
  }

  protected onRemove(task: Task): void {
    this.taskService.remove(task.id);
  }

  protected onEdit(task: Task): void {
    this.editedTask = task;
  }

  protected onMove({ taskId, columnId }: TaskMove): void {
    this.taskService.move(taskId, columnId);
  }

  protected resetDemoData(): void {
    this.boards.reset();
  }

  protected closeModal(): void {
    this.editedTask = undefined;
    this.isCreating = false;
  }
}
