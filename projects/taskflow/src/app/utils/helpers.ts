interface HasId {
  readonly id: string;
}

export function findById<T extends HasId>(
  items: T[],
  id: string
): T | undefined {
  return items.find(item => item.id === id);
}