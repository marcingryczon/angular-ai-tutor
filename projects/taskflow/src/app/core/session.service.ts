import { computed, Injectable, signal } from '@angular/core';
import { Role, User } from './models';

/** Owns "who is using the app" — drives every role-based UI decision. */
@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly role = signal<Role>('member');

  readonly currentUser = signal<User>({
    id: 'u_marci',
    name: 'Marcin',
    email: 'marcin@taskflow.dev',
    role: 'admin',
  });

  readonly isAdmin = computed(() => this.role() === 'admin');
}
