import { Directive, input } from '@angular/core';
import { Priority } from '../../core/models';

/** Paints a left accent bar on a card in the task's priority color. */
@Directive({
  selector: '[priorityHighlight]',
  host: {
    '[style.border-left-color]': 'accent()',
    '[style.border-left-width.px]': '3',
    '[style.border-left-style]': '"solid"',
  },
})
export class PriorityHighlightDirective {
  readonly priorityHighlight = input.required<Priority>();

  protected accent(): string {
    return `var(--priority-${this.priorityHighlight()})`;
  }
}
