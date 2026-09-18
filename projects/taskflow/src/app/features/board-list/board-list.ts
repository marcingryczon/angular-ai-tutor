import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { Store } from '@ngrx/store';
import { Visibility } from '../../core/models';
import { selectBoards } from '../../core/ngrx/board.store';
import { selectTaskCountOfBoard } from '../../core/ngrx/task.store';
import { TaskFlowState } from '../../core/ngrx/taskflow-state.service';

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
  private readonly store = inject(Store);
  protected readonly state = inject(TaskFlowState);

  protected readonly boards = this.store.selectSignal(selectBoards);
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
    return this.store.selectSignal(selectTaskCountOfBoard(boardId))();
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.boardForm, async () => {
      this.state.createBoard(this.model());
      this.model.set({ title: '', description: '', visibility: 'private' });
    });
  }
}
