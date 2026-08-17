import { Injectable, computed, inject, signal } from '@angular/core';
import { BoardService, type NewBoardInput } from './board.service';
import type { Board } from './models';

/**
 * Reactive store for the board list. Components read `boards()` and call the
 * action methods. This is the "before NgRx" baseline: centralized state that
 * lives outside any single component.
 */
@Injectable({ providedIn: 'root' })
export class BoardStore {
  private readonly boardService = inject(BoardService);

  readonly boards = signal<Board[]>(this.boardService.listBoards());

  readonly boardCount = computed(() => this.boards().length);

  /** Refresh the board list from the persistence layer. */
  reload(): void {
    this.boards.set(this.boardService.listBoards());
  }

  /** Create a board; returns the new board on success. */
  createBoard(input: NewBoardInput): Board | null {
    const result = this.boardService.createBoard(input);
    if (result.ok) {
      this.reload();
      return result.value;
    }
    return null;
  }

  deleteBoard(boardId: string): boolean {
    const result = this.boardService.deleteBoard(boardId);
    if (result.ok) {
      this.reload();
      return true;
    }
    return false;
  }

  resetDemoData(): void {
    this.boardService.reset();
    this.reload();
  }
}