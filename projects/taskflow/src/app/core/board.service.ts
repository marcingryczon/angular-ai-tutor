import { Injectable, inject } from '@angular/core';
import { BOARD_CONFIG } from './config';
import { defaultColumns, TaskFlowDb, type BoardDb } from './db';
import { createError, createSuccess, newId, type Result } from './helpers';
import type { Board, User, Visibility } from './models';

export interface NewBoardInput {
  title: string;
  description: string;
  visibility: Visibility;
  ownerId: string;
}

/**
 * Domain service for boards. Owns persistence and the business rules around
 * creating/deleting boards. Stores (BoardStore/TaskStore) build reactive state
 * on top of these operations.
 */
@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly db = inject(TaskFlowDb);
  private readonly boardConfig = inject(BOARD_CONFIG);

  /** List all board summaries (no tasks/columns) in creation order. */
  listBoards(): Board[] {
    const data = this.db.load();
    return Object.values(data)
      .map((board) => board.board)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  getBoard(boardId: string): Result<Board> {
    const data = this.db.load();
    const board = data[boardId]?.board;
    return board ? createSuccess(board) : createError(new Error(`board "${boardId}" not found`));
  }

  /** Create a board using the configured default columns. */
  createBoard(input: NewBoardInput): Result<Board> {
    const data = this.db.load();
    const boardId = newId('b');

    // Reuse a shared user directory if one already exists.
    const existingUsers = Object.values(data).find((d) => d.users.length)?.users;
    const users: User[] = existingUsers ?? this.fallbackUsers(input.ownerId);

    const board: Board = {
      id: boardId,
      title: input.title.trim(),
      description: input.description.trim(),
      visibility: input.visibility,
      ownerId: input.ownerId,
      columnIds: [],
      createdAt: new Date().toISOString()
    };

    const columns = defaultColumns(boardId, this.boardConfig.columns);
    board.columnIds = columns.map((c) => c.id);

    data[boardId] = { board, columns, tasks: [], users } satisfies BoardDb;
    this.db.save(data);
    return createSuccess(board);
  }

  deleteBoard(boardId: string): Result<null> {
    const data = this.db.load();
    if (!data[boardId]) {
      return createError(new Error(`board "${boardId}" not found`));
    }
    delete data[boardId];
    this.db.save(data);
    return createSuccess(null);
  }

  /** Reset the database to the seeded demo state. */
  reset(): Board[] {
    this.db.reset();
    return this.listBoards();
  }

  private fallbackUsers(ownerId: string): User[] {
    return [{ id: ownerId || 'u_owner', name: 'Owner', email: 'owner@example.com', role: 'admin' }];
  }
}