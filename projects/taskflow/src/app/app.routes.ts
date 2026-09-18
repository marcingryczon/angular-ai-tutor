import { Routes } from '@angular/router';
import { boardResolver } from './core/board.resolver';
import { adminGuard } from './core/role.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'TaskFlow — boards',
    loadComponent: () => import('./features/board-list/board-list').then((m) => m.BoardList),
  },
  {
    path: 'boards',
    title: 'TaskFlow — boards',
    loadComponent: () => import('./features/board-list/board-list').then((m) => m.BoardList),
  },
  {
    path: 'boards/:boardId',
    title: 'TaskFlow — board',
    resolve: { board: boardResolver },
    loadComponent: () => import('./features/board/board').then((m) => m.Board),
  },
  {
    path: 'boards/:boardId/settings',
    title: 'TaskFlow — board settings',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/board/board-settings').then((m) => m.BoardSettings),
  },
  { path: '**', redirectTo: '' },
];
