import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BoardSettings } from './board-settings';

describe('BoardSettings', () => {
  it('links back to the board it belongs to', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(BoardSettings);
    fixture.componentRef.setInput('boardId', 'b_1');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.board__back')?.getAttribute('href')).toBe(
      '/boards/b_1',
    );
    expect(fixture.nativeElement.textContent).toContain('Board settings');
  });
});
