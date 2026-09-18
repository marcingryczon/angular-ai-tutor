import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let session: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    session = TestBed.inject(SessionService);
  });

  it('starts as a member', () => {
    expect(session.role()).toBe('member');
    expect(session.isAdmin()).toBe(false);
  });

  it('derives isAdmin from the role', () => {
    session.role.set('admin');

    expect(session.isAdmin()).toBe(true);
  });

  it('exposes the current user', () => {
    expect(session.currentUser().id).toBe('u_marci');
  });
});
