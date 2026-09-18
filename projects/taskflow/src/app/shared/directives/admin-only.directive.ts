import { Directive, effect, inject, TemplateRef, ViewContainerRef } from '@angular/core';
import { SessionService } from '../../core/session.service';

/**
 * Structural directive: renders its template only for the admin role.
 * `*adminOnly` desugars to `<ng-template adminOnly>`, so the content is
 * never created for members — unlike `[hidden]`, which only hides it.
 */
@Directive({ selector: '[adminOnly]' })
export class AdminOnlyDirective {
  private readonly template = inject(TemplateRef<unknown>);
  private readonly container = inject(ViewContainerRef);
  private readonly session = inject(SessionService);

  private isRendered = false;

  constructor() {
    effect(() => {
      const isAdmin = this.session.isAdmin();
      if (isAdmin && !this.isRendered) {
        this.container.createEmbeddedView(this.template);
        this.isRendered = true;
      } else if (!isAdmin && this.isRendered) {
        this.container.clear();
        this.isRendered = false;
      }
    });
  }
}
