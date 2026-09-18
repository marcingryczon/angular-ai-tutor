import { Component, inject } from '@angular/core';
import { SessionService } from './core/session.service';
import { Role } from './core/models';
import { RoleSwitch } from './shared/role-switch';
import { Board } from './features/board/board';

@Component({
  selector: 'app-root',
  imports: [Board, RoleSwitch],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly session = inject(SessionService);

  protected get role(): Role {
    return this.session.role;
  }

  protected set role(value: Role) {
    this.session.role = value;
  }
}
