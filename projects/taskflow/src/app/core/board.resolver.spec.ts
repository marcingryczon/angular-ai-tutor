import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  convertToParamMap,
  provideRouter,
  RedirectCommand,
  RouterStateSnapshot,
} from '@angular/router';
import { provideStore } from '@ngrx/store';
import { boardResolver } from './board.resolver';
import { boardsFeature } from './ngrx/board.store';
import { tasksFeature } from './ngrx/task.store';
import { SeedFile } from './db';
import { Board } from './models';

const SEED: SeedFile = {
  users: [],
  boards: [{ id: 'b_1', title: 'One', description: '', visibility: 'team', ownerId: 'u_1' }],
  taskTemplates: [],
};

describe('boardResolver', () => {
  let http: HttpTestingController;

  function resolve(boardId: string) {
    const route = { paramMap: convertToParamMap({ boardId }) } as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(
      () => boardResolver(route, {} as RouterStateSnapshot) as Promise<Board | RedirectCommand>,
    );
  }

  beforeEach(() => {
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
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('resolves an existing board once the store is hydrated', async () => {
    const pending = resolve('b_1');

    await TestBed.tick();
    http.expectOne('seed.json').flush(SEED);

    expect(await pending).toMatchObject({ id: 'b_1', title: 'One' });
  });

  it('redirects to the board list for an unknown id', async () => {
    const pending = resolve('nope');

    await TestBed.tick();
    http.expectOne('seed.json').flush(SEED);

    expect(await pending).toBeInstanceOf(RedirectCommand);
  });
});
