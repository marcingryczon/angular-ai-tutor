import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SeedFile } from '../../core/db';
import { BoardList } from './board-list';

const SEED: SeedFile = {
  users: [],
  boards: [
    { id: 'b_1', title: 'Marketing Sprint', description: 'Launch', visibility: 'team', ownerId: 'u_1' },
  ],
  taskTemplates: [{ title: 'A', description: '', status: 'todo', priority: 'low' }],
};

describe('BoardList', () => {
  let fixture: ComponentFixture<BoardList>;
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(BoardList);
    http = TestBed.inject(HttpTestingController);
    // Only run change detection here: awaiting whenStable() would block on the
    // still-pending seed.json request.
    await TestBed.tick();
  });

  afterEach(() => http.verify());

  async function seed(file: SeedFile = SEED): Promise<void> {
    http.expectOne('seed.json').flush(file);
    await new Promise((resolve) => setTimeout(resolve));
    await fixture.whenStable();
  }

  it('shows the empty state when the seed has no boards', async () => {
    await seed({ ...SEED, boards: [] });

    expect(fixture.nativeElement.querySelector('.board-card--empty')?.textContent).toContain(
      'No boards yet',
    );
  });

  it('renders one card per board with its task count', async () => {
    await seed();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelectorAll('.board-card__link')).toHaveLength(1);
    expect(element.querySelector('.board-card__title')?.textContent).toContain('Marketing Sprint');
    expect(element.querySelector('.board-card__meta')?.textContent).toContain('1 task(s)');
    expect(element.querySelector('.board-list__subtitle')?.textContent).toContain('1 board(s)');
    expect(element.querySelector('.board-card__link')?.getAttribute('href')).toBe('/boards/b_1');
  });

  it('keeps "Create board" disabled until a title is typed', async () => {
    await seed();
    const button = fixture.nativeElement.querySelector('.new-board .btn--primary') as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    const title = fixture.nativeElement.querySelector('#board-title') as HTMLInputElement;
    title.value = 'Design System';
    title.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(button.disabled).toBe(false);
  });

  it('creates a board and clears the form', async () => {
    await seed();
    const title = fixture.nativeElement.querySelector('#board-title') as HTMLInputElement;
    const description = fixture.nativeElement.querySelector('#board-description') as HTMLInputElement;
    title.value = 'Design System';
    title.dispatchEvent(new Event('input'));
    description.value = 'Tokens';
    description.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    (fixture.nativeElement.querySelector('.new-board') as HTMLFormElement).dispatchEvent(
      new Event('submit'),
    );
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('.board-card__link')).toHaveLength(2);
    expect(fixture.nativeElement.textContent).toContain('Design System');
    expect((fixture.nativeElement.querySelector('#board-title') as HTMLInputElement).value).toBe('');
  });
});
