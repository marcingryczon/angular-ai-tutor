// 1. Generic interface
interface Result<T> {
  success: boolean;
  data: T | undefined;
  error: string | undefined;
}

// 2. Generic functions
function createSuccess<T>(data: T): Result<T> {
  return { success: true, data, error: undefined };
}
function createError<T>(message: string): Result<T> {
    return { success: false, data:undefined, error: message };
}
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

// 3. Constrained generic
interface HasId {
  readonly id: string;
}
function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}
