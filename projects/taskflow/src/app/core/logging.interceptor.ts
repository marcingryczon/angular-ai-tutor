import { HttpInterceptorFn } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { tap } from 'rxjs';

/** Dev-only request log — the smallest useful interceptor. */
export const loggingInterceptor: HttpInterceptorFn = (request, next) => {
  if (!isDevMode()) {
    return next(request);
  }

  const started = performance.now();
  return next(request).pipe(
    tap({
      complete: () =>
        console.debug(
          `[http] ${request.method} ${request.url} — ${Math.round(performance.now() - started)}ms`,
        ),
      error: (error) => console.warn(`[http] ${request.method} ${request.url} failed`, error),
    }),
  );
};
