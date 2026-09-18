import { Pipe, PipeTransform } from '@angular/core';
import { Priority } from '../../core/models';

/** `'urgent'` → `'Urgent'`. */
@Pipe({ name: 'priorityLabel' })
export class PriorityLabelPipe implements PipeTransform {
  transform(value: Priority | ''): string {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : 'All';
  }
}
