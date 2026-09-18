import { Component, inject } from '@angular/core';
import { SessionService } from './core/session.service';
import { RoleSwitch } from './shared/role-switch';
import { Board } from './features/board/board';

@Component({
  selector: 'app-root',
  imports: [Board, RoleSwitch],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly session = inject(SessionService);
}
