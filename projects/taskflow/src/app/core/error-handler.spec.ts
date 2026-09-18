import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TaskFlowErrorHandler } from './error-handler';

describe('TaskFlowErrorHandler', () => {
  let handler: ErrorHandler;
  let error: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ErrorHandler, useClass: TaskFlowErrorHandler }],
    });
    handler = TestBed.inject(ErrorHandler);
    error = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('reports HTTP failures with their status', () => {
    handler.handleError(new HttpErrorResponse({ status: 503, url: '/seed.json' }));

    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('HTTP 503 on /seed.json'),
      expect.objectContaining({ role: 'member' }),
    );
  });

  it('reports any other error with context', () => {
    handler.handleError(new Error('boom'));

    expect(error).toHaveBeenCalledWith(
      '[taskflow] Unhandled error',
      expect.any(Error),
      expect.objectContaining({ role: 'member' }),
    );
  });
});
