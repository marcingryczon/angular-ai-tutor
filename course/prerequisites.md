# Phase Dependencies & Prerequisites

This file maps the dependency graph between phases. A phase can only begin once all its prerequisites are completed.

## Dependency Graph

```
Phase 0 (Fundamentals)
  └── Phase 1 (Components)
        └── Phase 2 (Communication)
              └── Phase 3 (DI)
                    └── Phase 4 (Signals)
                          ├── Phase 5 (RxJS, HTTP & Async)
                          │     ├── Phase 6 (Forms)
                          │     ├── Phase 7 (Routing)
                          │     │     └── Phase 10 (SSR)
                          │     └── Phase 14 (NgRx)  ← also needs Phase 11
                          ├── Phase 8 (Performance)
                          └── Phase 9 (Directives & Pipes)
Phase 11 (Testing) ← Phase 5, 7, 9 (needs real units to test)
  ├── Phase 12 (Accessibility)
  └── Phase 13 (Architecture)
```

## Phase Prerequisites

| Phase | Prerequisites | Notes |
|-------|--------------|-------|
| 0 — Fundamentals | — | Entry point |
| 1 — Components | Phase 0 | |
| 2 — Communication | Phase 1 | Builds the Board → Column → TaskCard tree, Modal shell, DnD |
| 3 — DI | Phase 2 | Services replace the plain properties from Phase 2 |
| 4 — Signals | Phase 3 | State lives in services first, then becomes signals |
| 5 — RxJS, HTTP & Async | Phase 4 | Needs signals for `toSignal`, `resource`, service store |
| 6 — Forms | Phase 4, Phase 2 (Modal) | Task form opens in the Modal |
| 7 — Routing | Phase 5 (store) | Board list and board page read from stores |
| 8 — Performance | Phase 4 | Zoneless CD explained through signals |
| 9 — Directives & Pipes | Phase 3 (SessionService) | `*adminOnly` reads the session |
| 10 — SSR | Phase 7, Phase 5 | Needs routing and the `seed.json` HTTP load |
| 11 — Testing | Phase 5, 7, 9 | Backfill needs stores, guards, resolvers, pipes to exist |
| 12 — Accessibility | Phase 11, Phase 6 | Modal keyboard behavior is finished here |
| 13 — Architecture | Phase 11 | CI runs the test suite |
| 14 — NgRx | Phase 5 (Lesson 5.7), Phase 11 | Migration must be covered by tests |

## Recommended Order (Sequential)

```
0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 11 → 10 → 12 → 13 → 14
```

Rationale:
- Testing (11) before SSR (10) — test simple units first, then tackle SSR complexity
- NgRx (14) last — it is a migration of a working, tested app and is the capstone
- Forms (6) directly after Phase 5 so the task modal exists before routing splits the app into pages

## Cross-Phase References

| Concept | Introduced In | Referenced In |
|---------|--------------|---------------|
| Feature-first layout (`core/`, `features/`, `shared/`) | Phase 1 (Lesson 1.1) | Phase 13 (boundaries) |
| `Modal` shell | Phase 2 (Lesson 2.4) | Phase 6 (task form), Phase 12 (focus/keyboard) |
| Drag & drop | Phase 2 (Lesson 2.5) | Phase 12 (keyboard alternative) |
| `TaskFlowDb` / `localStorage` | Phase 3 (Lesson 3.5) | Phase 4 (persistence effect), Phase 10 (SSR-safe) |
| `signal()` / `computed()` | Phase 4 | Phase 5, 8, 14 |
| `HttpClient` / `httpResource()` | Phase 5 (5.3, 5.6) | Phase 10 (transfer cache), Phase 11 (HttpTestingController) |
| Service Store pattern | Phase 5 (Lesson 5.7) | Phase 14 (migration source) |
| Signal Forms | Phase 6 (Lesson 6.2) | Phase 7 (create-board form) |
| `OnPush` strategy | Phase 8 (Lesson 8.2) | Phase 11 (testing OnPush components) |
| `@defer` | Phase 8 (Lesson 8.5) | Phase 10 (incremental hydration triggers) |
| Route guards / resolvers | Phase 7 | Phase 11 (testing), Phase 13 (error handling) |
| TestBed / Vitest | Phase 11 | All later phases (test policy) |
