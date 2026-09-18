import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { Role } from '../core/models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-role-switch',
  templateUrl: './role-switch.html',
  styleUrl: './role-switch.scss',
})
export class RoleSwitch {
  /** Two-way bound by the parent: `[(role)]="role"`. */
  readonly role = model<Role>('member');

  protected onChange(event: Event): void {
    this.role.set((event.target as HTMLSelectElement).value as Role);
  }
}
