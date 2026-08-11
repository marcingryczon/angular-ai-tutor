# Lesson 0.1: Workspace Anatomy

## Cel lekcji
Zrozumienie struktury workspace Angular, kluczowych plików konfiguracyjnych i przepływu budowania aplikacji.

---

## Co to jest Angular Workspace?

Workspace to "fabryka" projektu Angular. To nie jest po prostu folder z plikami — to spójne środowisko budowania, kompilacji i uruchamiania aplikacji.

---

## Kluczowe Pliki Konfiguracyjne

### 1. `angular.json` — Mózg projektu
- **`projects`** — definicje projektów (angular-ai-tutor, taskflow)
- **`architect`** — cele budowania: `build`, `serve`, `test`
- **`builder`** — narzędzia (`@angular/build:application`, `@angular/build:dev-server`)
- **`options`** — ścieżki do plików wejściowych, assetów, stylów
- **`configurations`** — profile `production` i `development`

### 2. `package.json` — Zależności
- **Angular v22** — bardzo nowa wersja
- `dependencies`: `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/router`, `rxjs`
- `devDependencies`: `@angular/cli`, `typescript`, `vitest`, `jsdom`

### 3. `tsconfig.json` — TypeScript Strict Mode
- `noImplicitOverride`, `noFallthroughCasesInSwitch`, `isolatedModules`
- `angularCompilerOptions`: strict injection parameters, strict input modifiers
- `references`: podprojekty TypeScript

### 4. `src/main.ts` — Punkt Wejściowy
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig);
```
Funkcjonalny bootstrap (bez NgModules) — Angular 17+.

### 5. `src/index.html` — Szablon HTML
- `<app-root>` — selector root komponentu
- `<base href="/">` — baza dla routera

---

## Pełny Przepływ `ng serve`

### Faza 1: CLI (Angular Command Line Interface)
1. `ng serve` odczytuje `angular.json` — znajduje projekt domyślny
2. Z `architect.serve` wybiera konfigurację `development`
3. Odczytuje `builder: @angular/build:dev-server`
4. Z `buildTarget` zna który build użyć

### Faza 2: Build (kompilacja)
5. Odczytuje `browser: "src/main.ts"` — punkt wejściowy
6. TypeScript kompiluje `main.ts` i wszystkie importy do JavaScript
7. SCSS kompiluje się do CSS
8. Wszystkie pliki są bundle'owane

### Faza 3: Dev Server
9. Dev server uruchamia się na `http://localhost:4200`
10. Serwuie `index.html`

### Faza 4: Framework (runtime w przeglądarce)
11. Przeglądarka wykonuje skrypt → `bootstrapApplication(App, appConfig)`
12. Angular znajduje `<app-root>` i zastępuje go treścią komponentu
13. Renderuje `app.html` z danymi

---

## Kluczowe Pojęcie

**CLI ≠ Framework**

- **CLI** to narzędzie budujące (jak młot) — działa w terminalu
- **Framework** to kod który działa w przeglądarce (wieża)

To są dwa różne światy. CLI nie jest potrzebny w runtime.

---

## Drzewo Projektu

```
angular-ai-tutor/
├── angular.json          # Konfiguracja workspace
├── package.json          # Zależności
├── tsconfig.json         # TypeScript (główny)
├── tsconfig.app.json     # TypeScript (aplikacja)
├── tsconfig.spec.json    # TypeScript (testy)
├── src/                  # Główna aplikacja
│   ├── main.ts           # Punkt wejściowy
│   ├── index.html        # Szablon HTML
│   ├── styles.scss       # Globalne style
│   └── app/              # Root komponent
│       ├── app.ts        # Root komponent
│       ├── app.config.ts # Konfiguracja aplikacji
│       ├── app.routes.ts # Definicje routów
│       ├── app.html      # Szablon
│       └── app.scss      # Style komponentu
├── projects/taskflow/    # Drugi projekt
└── public/               # Statyczne assety
```

---

## Dwa Projekty w Jednym Workspace

1. **`angular-ai-tutor`** — główny projekt edukacyjny
2. **`taskflow`** — aplikacja TaskFlow (Kanban board)

Jeden workspace może zawierać wiele projektów (aplikacje, biblioteki).

---

## Ćwiczenia

### Ćwiczenie 1: Ślad konfiguracji

**Pytanie:** Które pole w `angular.json` wskazuje na `src/main.ts` jako punkt wejściowy?

**Odpowiedź:** Pełna ścieżka to `projects.angular-ai-tutor.architect.build.options.browser → "src/main.ts"`.

**Łańcuch wywołania:**
1. `ng serve` → `architect.serve` → `buildTarget: "angular-ai-tutor:build:development"`
2. `buildTarget` rozkłada się na: projekt `angular-ai-tutor` → target `build` → config `development`
3. `architect.build.options.browser` → `"src/main.ts"`

---

### Ćwiczenie 2: Projekt taskflow

**Pytanie:** Jaka jest ścieżka do punktu wejściowego projektu `taskflow`? Dlaczego jest inna?

**Odpowiedź:** `projects/taskflow/src/main.ts`. Jest inna bo `taskflow` ma własny `root: "projects/taskflow"` i `sourceRoot: "projects/taskflow/src"`. Każdy projekt w workspace ma swój własny układ plików.

---

### Ćwiczenie 3: CLI commands

| Komenda | Efekt |
|---|---|
| `ng build` | Buduje domyślny projekt (`angular-ai-tutor`) w konfiguracji `production` |
| `ng build --configuration development` | Buduje bez optymalizacji, ze source map |
| `ng serve taskflow` | Uruchamia projekt taskflow na porcie 4200 |
| `ng serve taskflow --port 4300` | Uruchamia taskflow na porcie 4300 |

---

### Ćwiczenie 4: TypeScript references

**Pytanie:** Ile referencji jest zdefiniowanych w `tsconfig.json`?

**Odpowiedź:** 3 referencje:
1. `./tsconfig.app.json` — build aplikacji `angular-ai-tutor`
2. `./tsconfig.spec.json` — testy aplikacji `angular-ai-tutor`
3. `./projects/taskflow/tsconfig.app.json` — build aplikacji `taskflow`

Nowy plik w `src/app/` jest pokryty przez `tsconfig.app.json`, bo ten plik wskazuje na `src/main.ts` jako entry point i rekurencyjnie obejmuje wszystkie importy.

---

## Podsumowanie

- **Workspace** to środowisko budowania, nie tylko folder z plikami
- **`angular.json`** to serce konfiguracji — definiuje projekty, cele, konfiguracje
- **CLI ≠ Framework** — CLI to narzędzie budujące, Framework to kod w przeglądarce
- **`ng serve`** przechodzi przez 4 fazy: CLI → Build → Dev Server → Framework
- **`ng build`** generuje statyczne pliki w `dist/` z optymalizacjami produkcyjnymi
- Jeden workspace może zawierać **wiele projektów** z osobnymi konfiguracjami
