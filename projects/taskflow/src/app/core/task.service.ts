import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { today } from './db';
import { newId } from './helpers';
import { Task } from './models';

export interface TaskEvent {
  readonly type: 'created' | 'moved' | 'deleted';
  readonly task: Task;
}

export type NewTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Task infrastructure that does not belong in a reducer: id/timestamp creation
 * (impure) and the event bus the UI listens to.
 * Since Phase 14 the state changes themselves are made by `taskReducer`.
 */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly events$$ = new Subject<TaskEvent>();

  /** Multicast stream of what happened to tasks (create / move / delete). */
  readonly events$ = this.events$$.asObservable();

  /** Builds the task an action will carry — reducers must stay pure. */
  build(input: NewTask): Task {
    const stamp = today();
    return { ...input, id: newId('task'), createdAt: stamp, updatedAt: stamp };
  }

  announce(event: TaskEvent): void {
    this.events$$.next(event);
  }
}
