import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BoardStore } from '../../core/board.store';
import { TaskService } from '../../core/task.service';
import type { Visibility } from '../../core/models';
import { SessionService } from '../../core/session.service';

@Component({
  selector: 'app-board-list',
  imports: [RouterLink, FormsModule],
  template: `
    <section class="board-list">
      <header class="board-list__header">
        <div>
          <h1 class="board-list__title">Your boards</h1>
          <p class="board-list__subtitle">
            {{ boardStore.boardCount() }} board{{ boardStore.boardCount() === 1 ? '' : 's' }} · pick one to open
          </p>
        </div>
      </header>

      <ul class="board-cards" aria-label="Boards">
        @for (item of items(); track item.board.id) {
          <li class="board-card">
            <a class="board-card__link" [routerLink]="['/boards', item.board.id]">
              <div class="board-card__top">
                <h2 class="board-card__title">{{ item.board.title }}</h2>
                <span class="board-card__badge visibility-{{ item.board.visibility }}">
                  {{ item.board.visibility }}
                </span>
              </div>
              <p class="board-card__desc">{{ item.board.description }}</p>
              <p class="board-card__meta">
                {{ item.taskCount }} task{{ item.taskCount === 1 ? '' : 's' }}
              </p>
            </a>
          </li>
        }
        @empty {
          <li class="board-card board-card--empty">
            <p>No boards yet. Create your first one below.</p>
          </li>
        }
      </ul>

      <form class="new-board" (ngSubmit)="createBoard()" aria-label="Create a new board">
        <h2 class="new-board__title">Create a board</h2>
        <div class="new-board__row">
          <label class="field">
            <span class="field__label">Title</span>
            <input class="field__input" name="title" [(ngModel)]="title" placeholder="e.g. Website Redesign" required />
          </label>
          <label class="field field--narrow">
            <span class="field__label">Visibility</span>
            <select class="field__input" name="visibility" [(ngModel)]="visibility">
              <option value="private">Private</option>
              <option value="team">Team</option>
              <option value="public">Public</option>
            </select>
          </label>
        </div>
        <label class="field">
          <span class="field__label">Description</span>
          <input class="field__input" name="description" [(ngModel)]="description" placeholder="What is this board for?" />
        </label>
        <button type="submit" class="btn btn--primary" [disabled]="!title.trim()">
          Create board
        </button>
      </form>
    </section>
  `
})
export class BoardList {
  protected readonly boardStore = inject(BoardStore);
  private readonly taskService = inject(TaskService);
  protected readonly session = inject(SessionService);

  protected title = '';
  protected description = '';
  protected visibility: Visibility = 'team';

  /** Boards + their task counts, derived reactively from the store. */
  protected readonly items = computed(() =>
    this.boardStore.boards().map((board) => {
      const result = this.taskService.listTasks(board.id);
      const count = result.ok ? result.value.length : 0;
      return { board, taskCount: count };
    })
  );

  protected createBoard(): void {
    const board = this.boardStore.createBoard({
      title: this.title,
      description: this.description,
      visibility: this.visibility,
      ownerId: this.session.currentUser.id
    });
    if (board) {
      this.title = '';
      this.description = '';
      this.visibility = 'team';
    }
  }
}