import { Injectable } from '@angular/core';
import { Role, User } from './models';

/** Owns "who is using the app" — drives every role-based UI decision. */
@Injectable({ providedIn: 'root' })
export class SessionService {
  /** Plain property until Phase 4 turns it into a signal. */
  role: Role = 'member';

  currentUser: User = {
    id: 'u_marci',
    name: 'Marcin',
    email: 'marcin@taskflow.dev',
    role: 'admin',
  };

  get isAdmin(): boolean {
    return this.role === 'admin';
  }
}
