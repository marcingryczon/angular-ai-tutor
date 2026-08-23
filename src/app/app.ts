import { Component, signal } from '@angular/core';
import { Greetings } from './1.1-standalone-basics/greetings';
import { Counter } from "./1.2-template-bindings/counter/counter";

@Component({
  selector: 'app-root',
  imports: [Greetings, Counter],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-ai-tutor');
}
