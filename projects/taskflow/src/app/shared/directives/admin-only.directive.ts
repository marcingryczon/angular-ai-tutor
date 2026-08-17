import { Directive, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { SessionService } from '../../core/session.service';

/**
 * Structural directive that only renders its template when the current user is
 * an admin. Usage: `<ng-container *adminOnly="…">…</ng-container>`
 *
 * It reacts to role changes at runtime via an `effect()`, so switching between
 * Admin and Member live shows/hides the wrapped content without a reload. The
 * effect is cleaned up automatically when the directive's injector is destroyed.
 */
@Directive({ selector: '[adminOnly]' })
export class AdminOnlyDirective {
  private readonly session = inject(SessionService);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef);

  constructor() {
    effect(() => {
      if (this.session.isAdmin()) {
        if (!this.viewContainer.length) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      } else {
        this.viewContainer.clear();
      }
    });
  }
}