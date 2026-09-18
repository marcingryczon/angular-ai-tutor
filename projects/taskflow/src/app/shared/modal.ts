import { Component, input, output } from '@angular/core';

/**
 * Reusable dialog shell: backdrop + panel + header.
 * The parent controls visibility with `@if` — there is no internal open state.
 * Focus management and Escape handling are added in Phase 12.
 */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  readonly title = input.required<string>();
  readonly closed = output<void>();

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
