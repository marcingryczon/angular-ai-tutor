import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.html',
  styleUrl: './counter.scss',
})
export class Counter {
  protected count = signal(0);

  protected increment(): void {
    this.count.update((counter) => counter + 1)
  }
  
  protected decrement(): void {
    this.count.update((counter) => counter - 1)
  }
  
  protected reset(): void {
    this.count.set(0);
  }
}
