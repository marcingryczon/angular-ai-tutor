import { Component, signal } from '@angular/core';
import { Greetings } from './1.1-standalone-basics/greetings';

@Component({
  selector: 'app-root',
  imports: [Greetings],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-ai-tutor');
}
