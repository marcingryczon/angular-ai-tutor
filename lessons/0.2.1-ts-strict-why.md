# Lesson 0.2.1: TypeScript Strict Mode — Dlaczego `strict: true`?

## Cel lekcji
Zrozumienie dlaczego `strict: true` jest **niezawodne** w Angularze. Poznanie każdej opcji strict mode i nauka rozpoznawania ukrytych błędów, które strict mode łapie w czasie kompilacji.

---

## Co to jest Strict Mode?

`"strict": true` w `tsconfig.json` to **skrót** włączający naraz **7 opcji** sprawdzania typów. To nie jest "opcja" — to **standard** w każdym profesjonalnym projekcie TypeScript.

### Co `strict: true` włącza pod maską?

| Opcja | Co robi | Dlaczego to ważne? |
|---|---|---|
| `strictNullChecks` | Blokuje przypisanie `null`/`undefined` bez jawnego dopuszczenia | **Najczęstsza przyczyna błędów w JS** — `Cannot read property of undefined` |
| `noImplicitAny` | Zakazuje ukrytego typu `any` w parametrach i zmiennych | Zapobiega "leniwemu" kodowi bez typów |
| `strictFunctionTypes` | Striktne sprawdzanie typów funkcji (kowariancja/kontrawariancja) | Zapobiega błędnym callbackom |
| `strictBindCallApply` | Striktne typy dla `.bind()`, `.call()`, `.apply()` | Rzadkie, ale ważne dla poprawności |
| `strictPropertyInitialization` | Wymaga inicjalizacji pól klasy w konstruktorze | Zapobiega niezainicjowanym polom |
| `noImplicitThis` | Blokuje niejasne `this` w funkcjach | Chroni przed utraconym kontekstem |
| `useUnknownInCatchVariables` | Zmienia `any` na `unknown` w `catch (e)` | Wymusza sprawdzenie typu błędu |

---

## Dlaczego Strict Mode w Angularze?

Angular to **framework oparty na typach**:
- Komponenty, dyrektywy, pipe'y — wszystko definiuje się przez typy
- Dependency Injection używa tokenów typów
- Szablony Angular są **statycznie analizowane** — błędy typów = błędy w szablonach

**Bez strict mode:**
- Błędy pojawiają się **w runtime**, nie w czasie kompilacji
- Trudniej debugować aplikację
- Refaktoring staje się ryzykowny

**Z strict mode:**
- Kompilator łapie błędy **zanim uruchomisz aplikację**
- IDE podpowiada poprawne typy
- Refaktoring jest bezpieczny

---

## Najważniejsza Opcja: `strictNullChecks`

To **najpotężniejsza** opcja w strict mode.

### Bez `strictNullChecks`:
```typescript
// ❌ Kompiluje się bez błędów!
const userName: string = null; // null jest "podtypem" stringa
const length = userName.length; // 💥 RUNTIME ERROR: TypeError!
```

### Z `strictNullChecks`:
```typescript
// ✅ TypeScript łapie błąd w czasie kompilacji!
const userName: string = null; // ❌ Compile error: Type 'null' is not assignable to type 'string'
```

### Jak naprawić?
```typescript
// Opcja 1: dopuść null jawnie
const userName: string | null = null;

// Opcja 2: sprawdź przed użyciem
if (userName !== null) {
  console.log(userName.length);
}

// Opcja 3: non-null assertion (używaj ostrożnie!)
console.log(userName!.length); // "obiecuje" że to nie null
```

---

## Dodatkowe Opcje Angularowe

Oprócz `strict: true`, Angular CLI zaleca **2 dodatkowe opcje**:

### `noImplicitOverride`
Blokuje przypadkowe nadpisywanie metod w klasach:
```typescript
class Parent {
  ngOnInit() { /* ... */ }
}

class Child extends Parent {
  // ❌ Bez noImplicitOverride — kompiluje się cicho!
  // ✅ Z noImplicitOverride — wymaga jawnego 'override'
  override ngOnInit() { /* ... */ }
}
```

**Dlaczego ważne w Angularze?** Angular używa lifecycle hooks (`ngOnInit`, `ngOnDestroy`). Bez tej opcji, literówka w nazwie metody nie zostanie złapana.

### `noPropertyAccessFromIndexSignature`
Wymaga notacji `[]` dla pól indeksowalnych:
```typescript
interface Config {
  [key: string]: string;
}

const config: Config = {};

// ❌ Bez tej opcji — kompiluje się
// ✅ Z tą opcją — wymaga config['key']
console.log(config.key);
```

---

## Twoja Konfiguracja

Twój `tsconfig.json` po lekcji:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

---

## Ćwiczenia

### Ćwiczenie 1: Znajdź błąd

**Kod:**
```typescript
function greet(name: string) {
  return `Hello, ${name.toUpperCase()}`;
}

greet(null); // co się stanie?
```

**Pytanie:** Czy ten kod skompiluje się z `strictNullChecks: true`?

**Odpowiedź:** Nie! TypeScript zgłosi błąd: `Argument of type 'null' is not assignable to parameter of type 'string'`. Bez strict mode — kod skompiluje się, ale w runtime dostaniesz `TypeError: Cannot read properties of null`.

---

### Ćwiczenie 2: Niezainicjowane pole

**Kod:**
```typescript
class UserService {
  userName: string;
  
  constructor() {
    // userName nie jest ustawione!
  }
}
```

**Pytanie:** Czy ten kod skompiluje się z `strictPropertyInitialization: true`?

**Odpowiedź:** Nie! TypeScript zgłosi: `Property 'userName' has no initializer and is not definitely assigned in the constructor`. Naprawki:
1. Ustaw wartość domyślną: `userName: string = '';`
2. Ustaw w konstruktorze: `constructor() { this.userName = ''; }`
3. Użyj definite assignment assertion: `userName!: string;` (ostrożnie!)

---

### Ćwiczenie 3: Ukryte `any`

**Kod:**
```typescript
function add(a, b) {
  return a + b;
}
```

**Pytanie:** Jakie są typy `a` i `b`?

**Odpowiedź:** Bez `noImplicitAny: true`, typy są `any` — czyli **brak sprawdzania typów**. Z tą opcją, TypeScript wymaga jawnego podania typów:
```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

---

### Ćwiczenie 4: Brakujący return

**Kod:**
```typescript
function divide(a: number, b: number): number {
  if (b === 0) {
    return 0;
  }
  // co jeśli b !== 0?
}
```

**Pytanie:** Czy ten kod skompiluje się z `noImplicitReturns: true`?

**Odpowiedź:** Nie! TypeScript zgłosi: `Not all code paths return a value`. Funkcja deklaruje `: number` jako typ zwracany, ale nie ma `return` dla przypadku gdy `b !== 0`.

---

## Podsumowanie

- **`strict: true`** to skrót dla 7 opcji bezpieczeństwa typów
- **Angular v22** włącza większość opcji strict domyślnie
- **`noImplicitOverride`** i **`noPropertyAccessFromIndexSignature`** to dodatki zalecane przez Angular CLI
- Strict mode łapie błędy **w czasie kompilacji**, nie w runtime
- **Nigdy nie wyłączaj strict mode** w produkcyjnym projekcie Angular

---

## Pliki Tworzone w Lekcji

- `src/app/training-strict-examples.ts` — plik treningowy z 4 przykładami "niebezpiecznego" kodu, który strict mode łapie

