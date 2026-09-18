import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Admin-only placeholder used to demonstrate `adminGuard`. */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-board-settings',
  imports: [RouterLink],
  templateUrl: './board-settings.html',
  styleUrl: './board-settings.scss',
})
export class BoardSettings {
  readonly boardId = input.required<string>();
}
