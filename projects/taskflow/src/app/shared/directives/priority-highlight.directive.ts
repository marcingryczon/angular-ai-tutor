import { Directive, inject, input, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';

/**
 * Marks the host element with a `priority-<level>` class so the board styles
 * can color a card by priority (e.g. a colored left border).
 *
 * Usage: `<div [priorityHighlight]="task.priority">…</div>`
 */
@Directive({ selector: '[priorityHighlight]' })
export class PriorityHighlightDirective implements OnInit {
  private readonly element = inject(ElementRef);

  /** The priority value; must match the selector so bindings resolve. */
  readonly priorityHighlight = input<string>('');

  ngOnInit(): void {
    const priority = this.priorityHighlight().trim().toLowerCase();
    if (priority) {
      this.element.nativeElement.classList.add(`priority-${priority}`);
    }
  }
}