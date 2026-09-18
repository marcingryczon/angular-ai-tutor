import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Modal } from './modal';

@Component({
  imports: [Modal],
  template: `
    <button class="opener" type="button">Open</button>
    @if (open()) {
      <app-modal title="New task" (closed)="open.set(false)">
        <p class="projected">Body</p>
        <button class="first" type="button">First</button>
        <button class="last" type="button">Last</button>
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

  it('moves focus into the dialog and locks body scroll', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('.modal__header .icon-btn'));
  });

  it('restores focus and scrolling when it closes', async () => {
    const fixture = TestBed.createComponent(Host);
    document.body.appendChild(fixture.nativeElement);
    const opener = fixture.nativeElement.querySelector('.opener') as HTMLButtonElement;
    opener.focus();
    fixture.componentInstance.open.set(false);
    await fixture.whenStable();
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();

    fixture.componentInstance.open.set(false);
    await fixture.whenStable();

    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(opener);
    fixture.nativeElement.remove();
  });

  it('closes on Escape', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();

    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('keeps Tab inside the dialog', async () => {
    const fixture = TestBed.createComponent(Host);
    document.body.appendChild(fixture.nativeElement);
    await fixture.whenStable();

    const close = fixture.nativeElement.querySelector('.modal__header .icon-btn') as HTMLElement;
    const last = fixture.nativeElement.querySelector('.last') as HTMLElement;

    last.focus();
    const forward = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    last.dispatchEvent(forward);
    expect(document.activeElement).toBe(close);

    const backward = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
    close.dispatchEvent(backward);
    expect(document.activeElement).toBe(last);

    fixture.nativeElement.remove();
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
