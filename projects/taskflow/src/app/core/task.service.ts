import { computed, inject, Injectable } from '@angular/core';
import { BoardService } from './board.service';
import { newId } from './helpers';
import { Priority, Task } from './models';

/** Data access for tasks; every mutation goes through here. */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly boards = inject(BoardService);

  readonly tasks = computed(() => this.boards.snapshot().tasks);

  tasksOfBoard(boardId: string): readonly Task[] {
    return this.tasks().filter((task) => task.boardId === boardId);
  }

  add(boardId: string, columnId: string, title: string, priority: Priority = 'medium'): Task {
    const stamp = this.stamp();
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
    this.boards.update((data) => ({ ...data, tasks: [...data.tasks, task] }));
    return task;
  }

  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const stamp = this.stamp();
    const created: Task = { ...task, id: newId('task'), createdAt: stamp, updatedAt: stamp };
    this.boards.update((data) => ({ ...data, tasks: [...data.tasks, created] }));
    return created;
  }

  update(task: Task): void {
    this.boards.update((data) => ({
      ...data,
      tasks: data.tasks.map((item) =>
        item.id === task.id ? { ...task, updatedAt: this.stamp() } : item,
      ),
    }));
  }

  remove(taskId: string): void {
    this.boards.update((data) => ({
      ...data,
      tasks: data.tasks.filter((task) => task.id !== taskId),
    }));
  }

  move(taskId: string, columnId: string): void {
    this.boards.update((data) => ({
      ...data,
      tasks: data.tasks.map((task) =>
        task.id === taskId ? { ...task, columnId, updatedAt: this.stamp() } : task,
      ),
    }));
  }

  private stamp(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
