import { inject, Injectable } from '@angular/core';
import { TaskFlowDb, TaskFlowData, today } from './db';
import { newId } from './helpers';
import { Board, Visibility } from './models';

export interface NewBoard {
  readonly title: string;
  readonly description: string;
  readonly visibility: Visibility;
}

/** Thin data-access layer for boards; all state lives in `BoardStore`. */
@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly db = inject(TaskFlowDb);

  loadPersisted(): TaskFlowData | undefined {
    return this.db.load();
  }

  persist(data: TaskFlowData): void {
    this.db.save(data);
  }

  /** Adds a board with the default columns from `BOARD_CONFIG`. */
  create(data: TaskFlowData, input: NewBoard, ownerId: string): TaskFlowData {
    const id = newId('board');
    const columns = this.db.columnsFor(id);
    const board: Board = {
      id,
      title: input.title.trim(),
      description: input.description.trim(),
      visibility: input.visibility,
      ownerId,
      columnIds: columns.map((column) => column.id),
      createdAt: today(),
    };

    return {
      ...data,
      boards: [...data.boards, board],
      columns: [...data.columns, ...columns],
    };
  }

  remove(data: TaskFlowData, boardId: string): TaskFlowData {
    return {
      ...data,
      boards: data.boards.filter((board) => board.id !== boardId),
      columns: data.columns.filter((column) => column.boardId !== boardId),
      tasks: data.tasks.filter((task) => task.boardId !== boardId),
    };
  }
}
