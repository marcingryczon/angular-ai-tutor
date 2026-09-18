import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SessionService } from './core/session.service';
import { RoleSwitch } from './shared/role-switch';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RoleSwitch],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly session = inject(SessionService);
}
