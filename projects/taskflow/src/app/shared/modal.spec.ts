import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Modal } from './modal';

@Component({
  imports: [Modal],
  template: `
    @if (open()) {
      <app-modal title="New task" (closed)="open.set(false)">
        <p class="projected">Body</p>
      </app-modal>
    }
  `,
})
class Host {
  readonly open = signal(true);
}

describe('Modal', () => {
  it('renders the title and the projected body', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.modal__title').textContent).toContain('New task');
    expect(fixture.nativeElement.querySelector('.projected')).not.toBeNull();
  });

  it('closes on the close button', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    fixture.nativeElement.querySelector('.modal__header .icon-btn').click();
    await fixture.whenStable();

    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('closes on a click outside the panel but not inside it', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    fixture.nativeElement.querySelector('.modal__panel').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(true);

    fixture.nativeElement.querySelector('.modal__backdrop').click();
    await fixture.whenStable();
    expect(fixture.componentInstance.open()).toBe(false);
  });
});
