import { Pipe, PipeTransform } from '@angular/core';

const FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

/** `'2026-08-22'` → `'Aug 22, 2026'`; empty input stays empty. */
@Pipe({ name: 'dueDate' })
export class DueDatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) {
      return '';
    }
    return FORMATTER.format(new Date(year, month - 1, day));
  }
}
