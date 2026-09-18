import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { BoardStore } from '../../core/board.store';
import { Visibility } from '../../core/models';

interface NewBoardValue {
  title: string;
  description: string;
  visibility: Visibility;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-board-list',
  imports: [RouterLink, FormField],
  templateUrl: './board-list.html',
  styleUrl: './board-list.scss',
})
export class BoardList {
  protected readonly store = inject(BoardStore);

  protected readonly boards = this.store.boards;
  protected readonly count = computed(() => this.boards().length);

  private readonly model = signal<NewBoardValue>({
    title: '',
    description: '',
    visibility: 'private',
  });

  protected readonly boardForm = form(this.model, (path) => {
    required(path.title, { message: 'Title is required.' });
  });

  protected taskCount(boardId: string): number {
    return this.store.taskCountOf(boardId);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.boardForm, async () => {
      this.store.createBoard(this.model());
      this.model.set({ title: '', description: '', visibility: 'private' });
    });
  }
}
