import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { SeedFile } from '../../core/db';
import { provideStore, Store } from '@ngrx/store';
import { boardsFeature } from '../../core/ngrx/board.store';
import { tasksFeature } from '../../core/ngrx/task.store';
import { SessionService } from '../../core/session.service';
import { selectBoardTasks, TaskActions } from '../../core/ngrx/task.store';
import { TaskFlowState } from '../../core/ngrx/taskflow-state.service';
import { Board } from './board';

const SEED: SeedFile = {
  users: [{ id: 'u_1', name: 'Ada', email: 'ada@taskflow.dev', role: 'member' }],
  boards: [
    {
      id: 'b_1',
      title: 'Marketing Sprint',
      description: 'Launch work',
      visibility: 'team',
      ownerId: 'u_1',
    },
  ],
  taskTemplates: [
    { title: 'Write copy', description: 'launch text', status: 'todo', priority: 'low' },
    {
      title: 'Fix banner',
      description: '',
      status: 'review',
      priority: 'urgent',
      assigneeId: 'u_1',
    },
  ],
};

describe('Board', () => {
  let fixture: ComponentFixture<Board>;
  let http: HttpTestingController;
  let element: HTMLElement;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore({
          [boardsFeature.name]: boardsFeature.reducer,
          [tasksFeature.name]: tasksFeature.reducer,
        }),
      ],
    });
    fixture = TestBed.createComponent(Board);
    fixture.componentRef.setInput('boardId', 'b_1');
    http = TestBed.inject(HttpTestingController);
    element = fixture.nativeElement;

    await TestBed.tick();
    http.expectOne('seed.json').flush(SEED);
    await new Promise((resolve) => setTimeout(resolve));
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it('renders the board header, four columns and the task count', () => {
    expect(element.querySelector('.board__title')?.textContent).toContain('Marketing Sprint');
    expect(element.querySelector('.visibility-team')).not.toBeNull();
    expect(element.querySelectorAll('app-column')).toHaveLength(4);
    expect(element.querySelectorAll('app-task-card')).toHaveLength(2);
    expect(element.querySelector('.board__count')?.textContent).toContain('2 task(s)');
  });

  it('hides the admin actions from members and shows them to admins', async () => {
    expect(element.textContent).not.toContain('Delete board');

    TestBed.inject(SessionService).role.set('admin');
    await fixture.whenStable();

    expect(element.textContent).toContain('Reset demo data');
    expect(element.textContent).toContain('Delete board');
  });

  it('filters the columns through the store', async () => {
    TestBed.inject(Store).dispatch(TaskActions.priorityFilterChanged({ priority: 'urgent' }));
    await fixture.whenStable();

    expect(element.querySelectorAll('app-task-card')).toHaveLength(1);
    expect(element.querySelector('.board__count')?.textContent).toContain('1 task(s)');
  });

  it('drives the store from the filter bar inputs', async () => {
    const store = TestBed.inject(Store);
    const dispatch = vi.spyOn(store, 'dispatch');

    const search = element.querySelector('#board-search') as HTMLInputElement;
    search.value = 'banner';
    search.dispatchEvent(new Event('input'));

    const priority = element.querySelector('#board-priority') as HTMLSelectElement;
    priority.value = 'urgent';
    priority.dispatchEvent(new Event('change'));

    const assignee = element.querySelector('#board-assignee') as HTMLSelectElement;
    assignee.value = 'u_1';
    assignee.dispatchEvent(new Event('change'));
    await fixture.whenStable();

    expect(dispatch).toHaveBeenCalledWith(
      TaskActions.priorityFilterChanged({ priority: 'urgent' }),
    );
    expect(dispatch).toHaveBeenCalledWith(TaskActions.assigneeFilterChanged({ assignee: 'u_1' }));

    // Past the 300 ms debounce the search reaches the store too.
    await new Promise((resolve) => setTimeout(resolve, 350));
    await fixture.whenStable();
    expect(dispatch).toHaveBeenCalledWith(TaskActions.searchChanged({ search: 'banner' }));
    expect(element.querySelectorAll('app-task-card')).toHaveLength(1);
  });

  it('quick-adds a task into a column', async () => {
    const input = element.querySelector('.column__quick-add-input') as HTMLInputElement;
    input.value = 'From the column';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await fixture.whenStable();

    expect(element.textContent).toContain('From the column');
    expect(element.querySelector('.board__notice')?.textContent).toContain('Task created');
  });

  it('opens the create modal, saves the form and closes it', async () => {
    const newTask = [...element.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('New task'),
    ) as HTMLButtonElement;
    newTask.click();
    await fixture.whenStable();

    const title = element.querySelector('#task-title') as HTMLInputElement;
    title.value = 'Created in the modal';
    title.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    (element.querySelector('.task-form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    expect(element.querySelector('.modal__panel')).toBeNull();
    expect(element.textContent).toContain('Created in the modal');
  });

  it('opens the detail modal on a card click and deletes from it', async () => {
    (element.querySelector('.task-card') as HTMLElement).click();
    await fixture.whenStable();

    expect(element.querySelector('.task-detail__title')?.textContent).toContain('Write copy');

    const remove = [...element.querySelectorAll('.task-detail__actions button')].find((button) =>
      button.textContent?.includes('Delete'),
    ) as HTMLButtonElement;
    remove.click();
    await fixture.whenStable();

    expect(element.querySelectorAll('app-task-card')).toHaveLength(1);
    expect(element.querySelector('.modal__panel')).toBeNull();
  });

  it('switches from the detail modal to the edit form', async () => {
    (element.querySelector('.task-card') as HTMLElement).click();
    await fixture.whenStable();

    const edit = [...element.querySelectorAll('.task-detail__actions button')].find((button) =>
      button.textContent?.includes('Edit'),
    ) as HTMLButtonElement;
    edit.click();
    await fixture.whenStable();

    expect((element.querySelector('#task-title') as HTMLInputElement).value).toBe('Write copy');

    const title = element.querySelector('#task-title') as HTMLInputElement;
    title.value = 'Write launch copy';
    title.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    (element.querySelector('.task-form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    expect(element.textContent).toContain('Write launch copy');
  });

  it('deletes a task from the card action', async () => {
    (element.querySelector('.icon-btn--danger') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(element.querySelectorAll('app-task-card')).toHaveLength(1);
  });

  it('moves a task between columns on drop', async () => {
    const columns = element.querySelectorAll('.column');
    const store = TestBed.inject(Store);
    const taskId = store.selectSignal(selectBoardTasks)()[0].id;
    const doneColumn = columns[3];

    doneColumn.dispatchEvent(
      Object.assign(new Event('drop'), { dataTransfer: { getData: () => taskId } }),
    );
    await fixture.whenStable();

    expect(store.selectSignal(selectBoardTasks)()[0].columnId).toBe('b_1_done');
    expect(element.querySelector('.board__notice')?.textContent).toContain('Task moved');
  });

  it('resets the demo data', async () => {
    TestBed.inject(SessionService).role.set('admin');
    await fixture.whenStable();
    (element.querySelector('.column__quick-add-input') as HTMLInputElement).value = 'temp';

    TestBed.inject(TaskFlowState).createTask({
      boardId: 'b_1',
      columnId: 'b_1_todo',
      title: 'Temporary',
      description: '',
      priority: 'medium',
      dueDate: '',
    });
    await fixture.whenStable();
    expect(element.textContent).toContain('Temporary');

    const reset = [...element.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Reset demo data'),
    ) as HTMLButtonElement;
    reset.click();
    await fixture.whenStable();

    expect(element.textContent).not.toContain('Temporary');
  });

  it('deletes the board and navigates back to the list', async () => {
    TestBed.inject(SessionService).role.set('admin');
    await fixture.whenStable();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    const remove = [...element.querySelectorAll('button')].find((button) =>
      button.textContent?.includes('Delete board'),
    ) as HTMLButtonElement;
    remove.click();
    await fixture.whenStable();

    expect(navigate).toHaveBeenCalledWith(['/']);
  });
});
