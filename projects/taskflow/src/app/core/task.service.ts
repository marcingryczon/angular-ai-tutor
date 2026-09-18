import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TaskFlowData, today } from './db';
import { newId } from './helpers';
import { Task } from './models';

export interface TaskEvent {
  readonly type: 'created' | 'moved' | 'deleted';
  readonly task: Task;
}

export type NewTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

/** Thin data-access layer for tasks + an event bus consumed by the UI. */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly events$$ = new Subject<TaskEvent>();

  /** Multicast stream of what happened to tasks (create / move / delete). */
  readonly events$ = this.events$$.asObservable();

  create(data: TaskFlowData, input: NewTask): TaskFlowData {
    const stamp = today();
    const task: Task = { ...input, id: newId('task'), createdAt: stamp, updatedAt: stamp };
    this.events$$.next({ type: 'created', task });
    return { ...data, tasks: [...data.tasks, task] };
  }

  update(data: TaskFlowData, task: Task): TaskFlowData {
    return {
      ...data,
      tasks: data.tasks.map((item) =>
        item.id === task.id ? { ...task, updatedAt: today() } : item,
      ),
    };
  }

  remove(data: TaskFlowData, taskId: string): TaskFlowData {
    const task = data.tasks.find((item) => item.id === taskId);
    if (task) {
      this.events$$.next({ type: 'deleted', task });
    }
    return { ...data, tasks: data.tasks.filter((item) => item.id !== taskId) };
  }

  move(data: TaskFlowData, taskId: string, columnId: string): TaskFlowData {
    const tasks = data.tasks.map((task) =>
      task.id === taskId ? { ...task, columnId, updatedAt: today() } : task,
    );
    const moved = tasks.find((task) => task.id === taskId);
    if (moved) {
      this.events$$.next({ type: 'moved', task: moved });
    }
    return { ...data, tasks };
  }
}
