# Lesson 0.3: Angular Mental Model

## Cel lekcji
Zrozumienie framework lifecycle, bootstrap process, component tree, i Zone.js.

---

## 4 Światy Angulara

```
┌─────────────────────────────────────────────────────────┐
│  1. TypeScript (Twój kod)                                │
│     ↓ kompilacja                                         │
│  2. JavaScript (wygenerowany kod)                        │
│     ↓ wykonanie w przeglądarce                           │
│  3. Zone.js (nasłuchuje zdarzeń asynchronicznych)        │
│     ↓ trigger change detection                           │
│  4. Rendering (DOM update)                               │
└─────────────────────────────────────────────────────────┘
```

---

## Bootstrap Flow

```
1. Przeglądarka ładuje index.html
   ├── Znajduje <app-root></app-root> w <body>
   └── Ładuje zbundle'owany JavaScript (z main.ts)

2. main.ts zaczyna się wykonywać
   ├── import bootstrapApplication
   ├── import appConfig
   └── import App (root komponent)

3. bootstrapApplication(App, appConfig)
   ├── Tworzy Dependency Injection Tree
   ├── Znajduje <app-root> w DOM
   └── Zastępuje go treścią komponentu

4. Angular renderuje app.html
   └── Strona jest gotowa!
```

---

## Zone.js — "Magia" Angulara

Zone.js "monkey-patches" wszystkie asynchroniczne operacje:
- `setTimeout`, `setInterval`
- `Promise.then`
- `fetch`, `XMLHttpRequest`
- Kliknięcia, klawiatura, scroll

Bez Zone.js, Angular musiałby ciągle sprawdzać czy dane się zmieniły.

---

## Podsumowanie

- **`bootstrapApplication()`** — funkcjonalny bootstrap (Angular 17+)
- **Zone.js** — wykrywa zmiany w asynchronicznych operacjach
- **Component Tree** — renderowany od góry do dołu
- **`.catch()`** — obsługa błędów bootstrapu

---

## Pliki

- `src/main.ts` — punkt wejściowy
- `src/index.html` — szablon HTML z `<app-root>`
- `src/app/app.ts` — root komponent
- `src/app/app.config.ts` — konfiguracja aplikacji
