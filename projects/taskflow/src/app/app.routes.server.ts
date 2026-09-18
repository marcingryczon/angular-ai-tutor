import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // The board gallery is static enough to ship as prerendered HTML.
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'boards', renderMode: RenderMode.Prerender },
  // Board ids are only known at request time.
  { path: 'boards/:boardId', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];
