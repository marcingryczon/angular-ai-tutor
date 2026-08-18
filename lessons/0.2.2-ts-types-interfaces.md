# Lesson 0.2.2: TypeScript Strict Mode — Typy i Interfejsy

## Cel lekcji
Opanowanie `type` aliasów, `interface` definicji, union types, opcjonalnych pól i `readonly` modifier. Zastosowanie w definicji typów domenowych TaskFlow.

---

## `type` vs `interface` — Co Wybrać?

### `type` — Alias Typu
```typescript
type Priority = 'low' | 'medium' | 'high';
type TaskStatus = 'todo' | 'in-progress' | 'done';
```

**Co potrafi `type`, czego `interface` nie potrafi?**
- Union types (`'a' | 'b'`)
- Intersection types (`A & B`)
- Tuple types (`[string, number]`)
- Mapped types (`{ [K in keyof T]: T[K] }`)

### `interface` — Kontrakt Obiektu
```typescript
interface User {
  id: number;
  name: string;
  email: string;
}
```

**Co potrafi `interface`, czego `type` nie potrafi?**
- **Declaration merging** — możesz rozszerzać interface wielokrotnie

### 🎯 Zasada Praktyczna
| Kiedy użyj | Co wybierz |
|---|---|
| Definiujesz kształt obiektu | `interface` |
| Definiujesz union/intersection | `type` |
| Definiujesz typ do dziedziczenia | `interface` |
| Definiujesz prosty alias | `type` |

---

## Union Types ze String Literalami

```typescript
type Priority = 'low' | 'medium' | 'high';

function setPriority(p: Priority) { /* ... */ }

setPriority('medium');  // ✅ OK
setPriority('urgent');  // ❌ Błąd kompilacji!
```

Zamiast dopuszczać dowolny string (i ryzykować literówki), TypeScript zmusza cię do używania tylko dozwolonych wartości.

---

## Opcjonalne Pola: `?` vs `| undefined`

```typescript
interface User1 {
  nickname?: string;        // pole może nie istnieć
}

interface User2 {
  nickname: string | undefined;  // pole istnieje, wartość może być undefined
}
```

**Obie podejścia są poprawne** — wybór zależy od preferencji zespołu. `| undefined` jest bardziej jawne.

---

## `readonly` Modifier

```typescript
interface Config {
  readonly apiUrl: string;  // nie można zmienić po utworzeniu
  timeout: number;          // można zmienić
}
```

**Dlaczego `readonly id`?** ID to unikalny identyfikator — zmiana mogłaby spowodować utratę powiązań z danymi.

---

## Podsumowanie

- **`type`** — do union types i prostych aliasów
- **`interface`** — do kształtów obiektów
- **Union types** — zmuszają do używania tylko dozwolonych wartości
- **`readonly`** — dla identyfikatorów i niezmienialnych pól
- **`| undefined`** — jawne oznaczenie opcjonalnych wartości

---

## Pliki Tworzone w Lekcji

- `src/app/0.2.2-typescript-strict-mode-types-and-interfaces/types.ts` — trening
- `projects/taskflow/src/app/types/taskflow.ts` — typy domenowe TaskFlow
