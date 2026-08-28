import { Component } from '@angular/core';

@Component({
  selector: 'app-status-list',
  imports: [],
  templateUrl: './status-list.html',
  styleUrl: './status-list.scss',
})
export class StatusList {
  readonly items = [
    { id: 'p_1', name: 'Zapłata za marzec', paid: true },
    { id: 'p_2', name: 'Zaliczka 20%', paid: false },
    { id: 'p_3', name: 'Czynsz kwiecień', paid: false },
    { id: 'p_4', name: 'Abonament SaaS', paid: true },
  ] as const;
}
