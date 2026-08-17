import { Routes } from '@angular/router';
import { boardResolver } from './core/board.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/board-list/board-list').then((m) => m.BoardList)
  },
  {
    path: 'boards',
    loadComponent: () =>
      import('./features/board-list/board-list').then((m) => m.BoardList)
  },
  {
    path: 'boards/:boardId',
    loadComponent: () => import('./features/board/board').then((m) => m.Board),
    resolve: { board: boardResolver }
  },
  { path: '**', redirectTo: '' }
];