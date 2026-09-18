import { PriorityLabelPipe } from './priority-label.pipe';

describe('PriorityLabelPipe', () => {
  const pipe = new PriorityLabelPipe();

  it('capitalises a priority', () => {
    expect(pipe.transform('urgent')).toBe('Urgent');
    expect(pipe.transform('low')).toBe('Low');
  });

  it('labels the empty filter value as "All"', () => {
    expect(pipe.transform('')).toBe('All');
  });
});
