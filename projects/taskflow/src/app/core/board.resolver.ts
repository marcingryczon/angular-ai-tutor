import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { Board } from './models';
import { selectBoardById } from './ngrx/board.store';
import { TaskFlowState } from './ngrx/taskflow-state.service';

/**
 * Resolves the board before the page renders.
 * Waits for the state to hold data (the seed may still be in flight) and
 * redirects to the board list when the id does not exist.
 */
export const boardResolver: ResolveFn<Board | RedirectCommand> = async (route) => {
  const state = inject(TaskFlowState);
  const store = inject(Store);
  const router = inject(Router);

  await firstValueFrom(state.ready$);

  const boardId = route.paramMap.get('boardId') ?? '';
  const board = store.selectSignal(selectBoardById(boardId))();

  return board ?? new RedirectCommand(router.parseUrl('/'));
};
