# TaskFlow — przebieg budowy kursu (gałąź `taskflow-finished-claude`)

Ten dokument opisuje **jednorazowy przebieg całego kursu** (fazy 0–14) wykonany dokładnie
tak, jak będzie go wykonywał uczestnik: każda faza to jeden commit, wszystkie decyzje
wynikają z `course/` i `course/taskflow-spec.md`, a żadna faza nie wyprzedza swojego
miejsca w programie (np. sygnały dopiero od fazy 4, testy dopiero od fazy 11).

## Jak uruchomić

```bash
npm install
npm run start:taskflow            # http://localhost:4300
npm run test:taskflow -- --no-watch   # 110 testów + progi pokrycia
npm run build:taskflow            # build produkcyjny + SSR + prerender
npm run serve:ssr:taskflow        # serwer SSR na :4000
```

## Co powstało w kolejnych fazach

| Faza | Commit                    | Efekt w aplikacji                                                                              |
| ---- | ------------------------- | ---------------------------------------------------------------------------------------------- |
| 0    | `feat(taskflow): phase 0` | `core/models.ts`, `core/helpers.ts`, włączony `strict`                                         |
| 1    | `phase 1`                 | tokeny `styles.scss`, topbar, statyczna tablica `board → column → task-card`                   |
| 2    | `phase 2`                 | `input()`/`output()`, `model()` w przełączniku roli, modal z `<ng-content>`, drag & drop       |
| 3    | `phase 3`                 | `SessionService`, `BoardService`, `TaskService`, `BOARD_CONFIG`, `TaskFlowDb` + `localStorage` |
| 4    | `phase 4`                 | pełne sygnały, pasek filtrów, `linkedSignal`, zapis przez `effect()`                           |
| 5    | `phase 5`                 | `seed.json` przez `httpResource()`, debounce wyszukiwania, event bus, store sygnałowy          |
| 6    | `phase 6`                 | Signal Forms: formularz zadania (create/edit) + walidator duplikatu tytułu                     |
| 7    | `phase 7`                 | routing, lista tablic, `boardResolver`, `adminGuard`, lazy loading                             |
| 8–9  | `phases 8-9`              | `OnPush` wszędzie, `@defer` w modalu, `*adminOnly`, `[priorityHighlight]`, pipe'y              |
| 10   | `phase 10`                | SSR: prerender `/`, server render `/boards/:id`, czysta hydratacja, transfer cache             |
| 11   | `phase 11`                | Vitest + 110 testów, pokrycie ~98% linii w `projects/taskflow/src`                             |
| 12   | `phase 12`                | ARIA, pułapka fokusu w modalu, klawiaturowe „move to", `animate.enter/leave`                   |
| 13   | `phase 13`                | `core/domain/` (czyste reguły filtrowania), globalny `ErrorHandler`, budżety, CI               |
| 14   | `phase 14`                | migracja stanu na `@ngrx/store`, usunięte store'y sygnałowe, DevTools, testy reducerów         |

Lista kontrolna ze specyfikacji (§9) została zweryfikowana w przeglądarce: tokeny, topbar 57 px,
siatka 4 kolumn bez poziomego scrolla, karty z odznakami priorytetu i awatarem, modal 560 px / radius 18,
drag & drop, `localStorage` pod kluczem `taskflow.db.v1` z 2 użytkownikami, 2 tablicami i 5 zadaniami na tablicę.

## Poprawki, których wymagał sam kurs

Te rzeczy **blokowały** przejście kursu i zostały naprawione w trakcie:

1. **Brak `"strict": true`** w bazowym `tsconfig.json`, mimo że CLAUDE.md nazywa go nienegocjowalnym —
   lekcja 0.2.1 („zweryfikuj, że TaskFlow używa strict mode") kończyłaby się porażką.
2. **Projekt `taskflow` nie miał targetu `test`** w `angular.json` — lekcja 11.1 („uruchom target testowy
   TaskFlow") była niewykonalna. Doszedł też `@vitest/coverage-v8`, bez którego progi pokrycia nie działają.
3. **Niespójny `package-lock.json`** (zakresy `^22.0.0`, lock mieszający 22.0.5 i 22.1.4) —
   `ng add @angular/ssr` w fazie 10 wywracał się na konfliktach peer. Wersje `@angular/*` zostały
   przypięte do zainstalowanego drzewa, a lock wygenerowany od nowa.
4. **`ng add @angular/ssr` dodaje `security.allowedHosts: []`** — uruchomiony lokalnie serwer SSR
   odpowiada `400 Bad Request` na `localhost`. Lekcja 10.1 powinna o tym wspominać.
5. **Flaga `--server-routing` już nie istnieje** w schematyce `@angular/ssr` w v22 (odrzucana przez walidację schematu).
6. **`target: ES2022`** w `tsconfig.json` wyklucza `Array.prototype.toSorted` — warto to powiedzieć,
   zanim uczestnik napisze `columns.toSorted(...)`.

## Rzeczy, które warto dopisać do materiałów

- **Kolejność faz 3 → 10 wymusza refaktor**, o którym plan nie mówi wprost: store czytający
  `localStorage` synchronicznie w konstruktorze (faza 3–5) powoduje rozjazd hydratacji w fazie 10.
  Rozwiązanie: start z pustym stanem na obu platformach i podmiana danych w `afterNextRender()`.
- **Faza 14 przekracza budżet z fazy 13** — `@ngrx/store` + DevTools dokładają ~36 kB do initial bundle
  (334 kB → 370 kB). Budżet trzeba świadomie podnieść; to dobry moment na rozmowę o koszcie NgRx.
- **`provideStoreDevtools` w aplikacji zoneless** wymaga `connectInZone: false`.
- **Zoneless + testy**: `fixture.whenStable()` zawiesza się, dopóki `httpResource` ma żądanie w locie —
  w testach trzeba użyć `TestBed.tick()`, odpowiedzieć na żądanie i dopiero potem czekać na stabilność.
  To najczęstsza pułapka w fazie 11 i warto ją opisać w lekcji 11.3.
- **Pułapka jednej pętli detekcji zmian**: jeśli wpisanie tekstu i zatwierdzenie trafią w ten sam cykl,
  binding `[value]` nie ma netto zmiany i pole nie czyści się samo (widoczne w quick-add).
  Świetny materiał na lekcję 8.1.
- **Zdarzenia domenowe po migracji na NgRx**: `TaskService` przestaje być warstwą danych i zostaje mu
  tylko to, czego reducer nie może robić (generowanie id/dat i event bus). Lekcja 14.8 mogłaby to nazwać wprost.

## Stan techniczny na koniec

- Build produkcyjny: 370 kB initial (102 kB transfer), lazy chunki na trasy.
- SSR: prerender 2 tras, hydratacja bez ostrzeżeń, `seed.json` pobierany raz (transfer cache).
- Testy: 110 testów, pokrycie 98,1% instrukcji / 98,1% linii / 90,9% gałęzi w `projects/taskflow/src`.
