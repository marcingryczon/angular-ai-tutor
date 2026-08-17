import { inject } from '@angular/core';
import { type ResolveFn, Router } from '@angular/router';
import { BoardService } from './board.service';

/**
 * Preloads board data before the board page renders (resolver). If the board
 * does not exist, redirect back to the board list instead of rendering a 404.
 */
export const boardResolver: ResolveFn<unknown> = (route) => {
  const boardService = inject(BoardService);
  const router = inject(Router);

  const boardId = route.params['boardId'];
  const result = boardService.getBoard(boardId);
  if (result.ok) {
    return result.value;
  }
  return router.createUrlTree(['/']);
};