/** Generates a short, URL-safe unique id. */
export function newId(prefix = 'id'): string {
  const random = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36);
  return `${prefix}_${time}${random}`;
}

/** Finds an item by id in a readonly list; `undefined` when missing. */
export function findById<T extends { readonly id: string }>(
  items: readonly T[],
  id: string,
): T | undefined {
  return items.find((item) => item.id === id);
}
