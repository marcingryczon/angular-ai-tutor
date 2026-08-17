import { Component, input, output, viewChild, inject, DestroyRef, ElementRef, OnInit, OnDestroy } from '@angular/core';

/**
 * A lightweight, accessible modal dialog. It renders its projected content in a
 * centered panel over a dimmed backdrop and handles the common concerns:
 *
 * - closes on Escape or a click outside the panel (backdrop),
 * - moves focus into the dialog when opened and restores it when closed,
 * - locks body scroll while open.
 *
 * The parent decides visibility by conditionally rendering this component with
 * `@if`, so no extra "open" state is needed here.
 */
@Component({
  selector: 'app-modal',
  template: `
    <div class="modal__backdrop" (click)="onBackdropClick($event)">
      <div
        #panel
        class="modal__panel"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="label()"
        (keydown.escape)="close.emit()"
      >
        @if (title(); as t) {
          <header class="modal__header">
            <h2 class="modal__title">{{ t }}</h2>
            <button type="button" class="icon-btn modal__close" aria-label="Close dialog" (click)="close.emit()">
              <span class="material-symbols-rounded material-symbols-rounded--sm">close</span>
            </button>
          </header>
        }
        <div class="modal__body">
          <ng-content />
        </div>
      </div>
    </div>
  `
})
export class Modal implements OnInit, OnDestroy {
  /** Accessible label for the dialog (used when no visible title is given). */
  readonly label = input('Dialog');
  /** Optional heading rendered in the modal header. */
  readonly title = input<string | null>(null);

  /** Emitted when the user requests to close (Escape, backdrop click, ✕). */
  readonly close = output<void>();

  private readonly panelRef = viewChild<ElementRef<HTMLDivElement>>('panel');
  private readonly destroyRef = inject(DestroyRef);
  private previouslyFocused: HTMLElement | null = null;

  ngOnInit(): void {
    // Move focus into the dialog and lock background scroll.
    this.previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = this.panelRef()?.nativeElement;
    (panel?.querySelector<HTMLElement>('button, [href], input, select, textarea') ?? panel)?.focus();

    // Lock body scroll while the modal is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    this.destroyRef.onDestroy(() => {
      document.body.style.overflow = prevOverflow;
      this.previouslyFocused?.focus?.();
    });
  }

  ngOnDestroy(): void {
    // Safety net in case the destroy-ref cleanup above has not run yet.
    document.body.style.overflow = '';
  }

  protected onBackdropClick(event: MouseEvent): void {
    const panel = this.panelRef()?.nativeElement;
    if (panel && !panel.contains(event.target as Node)) {
      this.close.emit();
    }
  }
}