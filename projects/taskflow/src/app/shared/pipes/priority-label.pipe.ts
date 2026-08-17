import { Pipe, PipeTransform } from '@angular/core';
import type { Priority } from '../../core/models';

const LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent'
};

/**
 * Human-friendly label for a priority value.
 * Usage: `{{ task.priority | priorityLabel }}`
 */
@Pipe({ name: 'priorityLabel' })
export class PriorityLabelPipe implements PipeTransform {
  transform(value: Priority | string | null | undefined): string {
    if (!value) {
      return '—';
    }
    return LABELS[value as Priority] ?? String(value);
  }
}