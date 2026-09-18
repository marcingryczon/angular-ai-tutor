import { DueDatePipe } from './due-date.pipe';

describe('DueDatePipe', () => {
  const pipe = new DueDatePipe();

  it('formats an ISO date', () => {
    expect(pipe.transform('2026-08-22')).toBe('Aug 22, 2026');
  });

  it('returns an empty string when unset', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('returns an empty string for garbage input', () => {
    expect(pipe.transform('not-a-date')).toBe('');
  });
});
