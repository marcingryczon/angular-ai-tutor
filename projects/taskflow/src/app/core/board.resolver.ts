import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BoardStore } from './board.store';
import { Board } from './models';

/**
 * Resolves the board before the page renders.
 * Waits for the store to hydrate (the seed may still be in flight) and
 * redirects to the board list when the id does not exist.
 */
export const boardResolver: ResolveFn<Board | RedirectCommand> = async (route) => {
  const store = inject(BoardStore);
  const router = inject(Router);

  await firstValueFrom(store.ready$);

  const boardId = route.paramMap.get('boardId') ?? '';
  return store.boardById(boardId) ?? new RedirectCommand(router.parseUrl('/'));
};
