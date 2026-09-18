import { inject, Injectable } from '@angular/core';
import { BoardService } from './board.service';
import { newId } from './helpers';
import { Priority, Task } from './models';

/** Data access for tasks; every mutation goes through here. */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly boards = inject(BoardService);

  tasksOfBoard(boardId: string): readonly Task[] {
    return this.boards.snapshot().tasks.filter((task) => task.boardId === boardId);
  }

  add(boardId: string, columnId: string, title: string, priority: Priority = 'medium'): Task {
    const stamp = new Date().toISOString().slice(0, 10);
    const task: Task = {
      id: newId('task'),
      boardId,
      columnId,
      title,
      description: '',
      priority,
      dueDate: '',
      createdAt: stamp,
      updatedAt: stamp,
    };
    this.write([...this.boards.snapshot().tasks, task]);
    return task;
  }

  update(task: Task): void {
    this.write(
      this.boards
        .snapshot()
        .tasks.map((item) => (item.id === task.id ? { ...task, updatedAt: this.stamp() } : item)),
    );
  }

  remove(taskId: string): void {
    this.write(this.boards.snapshot().tasks.filter((task) => task.id !== taskId));
  }

  move(taskId: string, columnId: string): void {
    this.write(
      this.boards
        .snapshot()
        .tasks.map((task) =>
          task.id === taskId ? { ...task, columnId, updatedAt: this.stamp() } : task,
        ),
    );
  }

  private write(tasks: readonly Task[]): void {
    this.boards.replace({ ...this.boards.snapshot(), tasks });
  }

  private stamp(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
