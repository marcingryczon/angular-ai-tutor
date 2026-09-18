import { ErrorHandler, inject, Injectable, isDevMode } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SessionService } from './session.service';

/**
 * Last line of defence: everything that escapes a component, a guard or an
 * effect lands here with enough context to be actionable in a bug report.
 */
@Injectable()
export class TaskFlowErrorHandler implements ErrorHandler {
  private readonly session = inject(SessionService);

  handleError(error: unknown): void {
    const context = {
      role: this.session.role(),
      url: typeof location === 'undefined' ? 'server' : location.pathname,
      at: new Date().toISOString(),
    };

    if (error instanceof HttpErrorResponse) {
      console.error(`[taskflow] HTTP ${error.status} on ${error.url}`, context);
      return;
    }

    console.error('[taskflow] Unhandled error', error, context);

    if (isDevMode() && error instanceof Error) {
      console.error(error.stack);
    }
  }
}
