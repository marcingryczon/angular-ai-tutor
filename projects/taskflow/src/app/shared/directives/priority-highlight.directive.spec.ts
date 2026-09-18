import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Priority } from '../../core/models';
import { PriorityHighlightDirective } from './priority-highlight.directive';

@Component({
  imports: [PriorityHighlightDirective],
  template: `<div class="card" [priorityHighlight]="priority()"></div>`,
})
class Host {
  readonly priority = signal<Priority>('low');
}

describe('PriorityHighlightDirective', () => {
  it('paints the accent in the priority color and follows changes', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    const card = fixture.nativeElement.querySelector('.card') as HTMLElement;
    expect(card.style.borderLeftColor).toBe('var(--priority-low)');
    expect(card.style.borderLeftWidth).toBe('3px');
    expect(card.style.borderLeftStyle).toBe('solid');

    fixture.componentInstance.priority.set('urgent');
    await fixture.whenStable();

    expect(card.style.borderLeftColor).toBe('var(--priority-urgent)');
  });
});
