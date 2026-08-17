// Small, pure functional helpers used across TaskFlow.

/** Result type: an explicit success or failure carrier. */
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function createSuccess<T>(value: T): { ok: true; value: T } {
  return { ok: true, value };
}

export function createError<T = never>(error: Error): { ok: false; error: Error } {
  return { ok: false, error };
}

/** Returns the first element of a non-empty array as a Result. */
export function firstItem<T>(items: readonly T[]): Result<T, Error> {
  const first = items[0];
  return first === undefined
    ? createError(new Error('firstItem: expected a non-empty list'))
    : createSuccess(first);
}

/** Type-safe lookup by id over an array of objects with an `id` field. */
export function findById<T extends { id: string }>(items: readonly T[], id: string): Result<T, Error> {
  const found = items.find((item) => item.id === id);
  return found
    ? createSuccess(found)
    : createError(new Error(`findById: no item with id "${id}"`));
}

/** Deterministic-enough id generator (avoids a dependency on crypto.randomUUID for older environments). */
export function newId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}