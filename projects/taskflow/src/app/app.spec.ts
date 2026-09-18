import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { boardsFeature } from './core/ngrx/board.store';
import { tasksFeature } from './core/ngrx/task.store';
import { App } from './app';
import { SessionService } from './core/session.service';

describe('App', () => {
  beforeEach(() => {
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
  });

  it('renders the topbar and the routed outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.topbar__name')?.textContent).toContain('TaskFlow');
    expect(fixture.nativeElement.querySelector('router-outlet')).not.toBeNull();
  });

  it('writes the picked role into the session', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const select = fixture.nativeElement.querySelector('.role-switch__select') as HTMLSelectElement;
    select.value = 'admin';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();

    expect(TestBed.inject(SessionService).role()).toBe('admin');
  });
});
