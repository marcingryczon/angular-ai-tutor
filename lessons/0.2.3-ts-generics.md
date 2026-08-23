# Lesson 0.2.3: TypeScript Strict Mode — Generyki

## Cel lekcji
Zrozumienie generycznych funkcji, interfejsów, `T extends`, i dlaczego generyki zachowują bezpieczeństwo typów bez ucieczki do `any`.

---

## Dlaczego Generyki?

```typescript
// ❌ Bez generyk — tracimy informację o typie!
function firstItem(items: any[]): any {
  return items[0];
}

const firstNumber = firstItem([1, 2, 3]);
// firstNumber: any — nie wiemy, czy to number, string, czy co innego!
```

```typescript
// ✅ Z generykami — typ jest zachowany!
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNumber = firstItem([1, 2, 3]);
// firstNumber: number | undefined — TypeScript wie, że to number!
```

---

## 1. Generic Functions

```typescript
function createSuccess<T>(data: T): Result<T> {
  return { success: true, data, error: undefined };
}

const result = createSuccess({ id: 1, name: 'Task' });
// result: Result<{ id: number; name: string }>
```

---

## 2. Generic Interfaces

```typescript
interface Result<T> {
  success: boolean;
  data: T | undefined;
  error: string | undefined;
}
```

**Dlaczego `Result<T>` w Angularze?** To kontrakt dla odpowiedzi z API — sukces z danymi lub błąd z komunikatem.

---

## 3. Constrained Generics (`T extends`)

```typescript
interface HasId {
  readonly id: string;
}

function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}
```

**Dlaczego `T extends HasId`?** Gwarantuje, że każdy typ `T` ma pole `id`. Bez tego, `item.id` spowodowałoby błąd kompilacji.

---

## Podsumowanie

- **Generyki** zachowują typy bez ucieczki do `any`
- **`Result<T>`** — kontrakt dla odpowiedzi z API
- **`T extends`** — ogranicza generyk do konkretnego kontraktu
- **`findById<T>()`** — działa dla Task, Column, Board — wszystko co ma `id`

---

## Pliki Tworzone w Lekcji

- `src/app/0.2.3-typescript-strict-mode-generics/generics.ts` — trening
- `projects/taskflow/src/app/utils/helpers.ts` — helper `findById<T>()`
