import { Injectable, computed, signal } from '@angular/core';
import type { Role, User } from './models';

const ROLE_KEY = 'taskflow.role';

/**
 * Simulated authentication/session. Holds the signed-in user and their role so
 * the route guard and the admin-only directive have a single source of truth.
 * The role is persisted so the choice survives a page reload.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly role = signal<Role>(this.readRole());
  readonly isAdmin = computed(() => this.role() === 'admin');

  readonly currentUser: User = {
    id: 'u_marci',
    name: 'Marcin',
    email: 'marcin@example.com',
    role: this.role()
  };

  setRole(role: Role): void {
    this.role.set(role);
    this.persist(role);
  }

  private readRole(): Role {
    if (typeof localStorage === 'undefined') {
      return 'admin';
    }
    const stored = localStorage.getItem(ROLE_KEY);
    return stored === 'member' ? 'member' : 'admin';
  }

  private persist(role: Role): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(ROLE_KEY, role);
    }
  }
}