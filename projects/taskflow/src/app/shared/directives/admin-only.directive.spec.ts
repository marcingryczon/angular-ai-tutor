import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SessionService } from '../../core/session.service';
import { AdminOnlyDirective } from './admin-only.directive';

@Component({
  imports: [AdminOnlyDirective],
  template: `<span *adminOnly class="danger-zone">Delete board</span>`,
})
class Host {}

describe('AdminOnlyDirective', () => {
  it('renders nothing for members and the content for admins', async () => {
    const fixture = TestBed.createComponent(Host);
    const session = TestBed.inject(SessionService);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.danger-zone')).toBeNull();

    session.role.set('admin');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.danger-zone')).not.toBeNull();

    session.role.set('member');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.danger-zone')).toBeNull();
  });
});
