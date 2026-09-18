import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Reusable dialog shell: backdrop + panel + header.
 * The parent controls visibility with `@if` — there is no internal open state.
 *
 * Accessibility: closes on Escape or an outside click, traps Tab inside the
 * panel, moves focus in on open, restores it on close and locks body scroll.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  host: {
    '(document:keydown.escape)': 'closed.emit()',
  },
})
export class Modal {
  readonly title = input.required<string>();
  readonly closed = output<void>();

  private readonly document = inject(DOCUMENT);
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');

  constructor() {
    const previouslyFocused = this.document.activeElement as HTMLElement | null;
    const body = this.document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    afterNextRender(() => this.focusFirst());

    inject(DestroyRef).onDestroy(() => {
      body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    });
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }

  /** Keeps Tab and Shift+Tab inside the dialog. */
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }

    const focusable = this.focusableElements();
    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = this.document.activeElement;

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    }
  }

  private focusFirst(): void {
    const [first] = this.focusableElements();
    (first ?? this.panel().nativeElement).focus();
  }

  private focusableElements(): HTMLElement[] {
    return Array.from(
      this.panel().nativeElement.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hasAttribute('hidden') && element.ariaHidden !== 'true');
  }
}
