import { findById, newId } from './helpers';

describe('helpers', () => {
  describe('newId', () => {
    it('prefixes the id', () => {
      expect(newId('task')).toMatch(/^task_/);
    });

    it('defaults to the "id" prefix', () => {
      expect(newId()).toMatch(/^id_/);
    });

    it('does not repeat itself', () => {
      const ids = new Set(Array.from({ length: 200 }, () => newId('task')));
      expect(ids.size).toBe(200);
    });
  });

  describe('findById', () => {
    const items = [{ id: 'a' }, { id: 'b' }];

    it('finds an existing item', () => {
      expect(findById(items, 'b')).toEqual({ id: 'b' });
    });

    it('returns undefined when nothing matches', () => {
      expect(findById(items, 'zzz')).toBeUndefined();
    });
  });
});
