import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats an ISO date string (`YYYY-MM-DD`) for display, e.g. "Jan 5, 2026".
 * Returns an empty string for falsy input.
 *
 * Usage: `{{ task.dueDate | dueDate }}`
 */
@Pipe({ name: 'dueDate' })
export class DueDatePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    // Pin to en-US so the app renders identically on every learner's machine
    // regardless of their browser locale (course rule: single language = EN).
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}