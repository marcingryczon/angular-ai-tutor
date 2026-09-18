import { Component } from '@angular/core';
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
  /** Plain property until Phase 3 moves it into `SessionService`. */
  protected role: Role = 'member';
}
