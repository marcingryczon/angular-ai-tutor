import { TestBed } from '@angular/core/testing';
import { RoleSwitch } from './role-switch';

describe('RoleSwitch', () => {
  it('shows the current role and emits the picked one', async () => {
    const fixture = TestBed.createComponent(RoleSwitch);
    fixture.componentRef.setInput('role', 'admin');
    await fixture.whenStable();

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    expect(select.value).toBe('admin');

    select.value = 'member';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();

    expect(fixture.componentInstance.role()).toBe('member');
  });
});
