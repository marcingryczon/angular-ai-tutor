import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Board } from '../../core/models';
import { selectBoards } from '../../core/ngrx/board.store';
import { initialTaskState, tasksFeature } from '../../core/ngrx/task.store';
import { BoardList } from './board-list';

const BOARD: Board = {
  id: 'b_1',
  title: 'Marketing Sprint',
  description: 'Launch work',
  visibility: 'team',
  ownerId: 'u_1',
  columnIds: [],
  createdAt: '2026-01-01',
};

/**
 * The same screen, tested without any real state: `provideMockStore` feeds the
 * selectors directly, so the test says nothing about reducers or HTTP.
 */
describe('BoardList (with a mock store)', () => {
  it('renders whatever the selector returns', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        // The screen still injects TaskFlowState, which requests the seed —
        // the testing backend simply leaves that request pending.
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore({
          // The board-count selector still reads the tasks slice.
          initialState: { [tasksFeature.name]: initialTaskState },
          selectors: [{ selector: selectBoards, value: [BOARD] }],
        }),
      ],
    });
    const fixture = TestBed.createComponent(BoardList);
    // whenStable() would wait for the pending seed request, so only run CD.
    await TestBed.tick();

    expect(fixture.nativeElement.querySelectorAll('.board-card__link')).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Marketing Sprint');

    const store = TestBed.inject(MockStore);
    store.overrideSelector(selectBoards, []);
    store.refreshState();
    await TestBed.tick();

    expect(fixture.nativeElement.querySelector('.board-card--empty')).not.toBeNull();
  });
});
