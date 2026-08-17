import { inject } from '@angular/core';
import { type ResolveFn } from '@angular/router';
import { BoardService } from './board.service';
import type { Board } from './models';

/**
 * Preloads board data before the board page renders (resolver). Returns
 * `null` when the board does not exist so the Board component can render a
 * friendly not-found state.
 */
export const boardResolver: ResolveFn<Board | null> = (route) => {
  const boardService = inject(BoardService);
  const boardId = route.params['boardId'];

  const result = boardService.getBoard(boardId);
  return result.ok ? result.value : null;
};