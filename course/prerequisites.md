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
                          │     └── Phase 13 (NgRx)  ← also needs Phase 11
                          ├── Phase 8 (Performance)
                          └── Phase 9 (Directives & Pipes)
Phase 11 (Testing) ← Phase 5, 7, 9 (needs real units to test)
  ├── Phase 12 (Accessibility)
  └── Phase 14 (Architecture & Production — the finale)
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
| 13 — NgRx | Phase 5 (Lesson 5.7), Phase 11 | Migration must be covered by tests |
| 14 — Architecture & Production | Phase 11, Phase 13 | CI runs the suite; the bundle lesson prices the NgRx decision |

## Recommended Order (Sequential)

```
0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 11 → 10 → 12 → 13 → 14
```

> **Milestones are numbered by phase, not by this order.** `taskflow-spec.md` §10 lists "after phase 10", "after phase 11" and so on by phase number, so following the recommended order you reach the *phase 11* milestone before the *phase 10* one. Check the milestone of the phase you just finished, not the one above it in the table.

Rationale:
- Testing (11) before SSR (10) — test simple units first, then tackle SSR complexity
- NgRx (13) before the finale — it is a migration of a working, tested app, and Phase 14 then prices what it cost (bundle budgets) and ships the result
- Production (14) last — the course ends with a release, not with a refactor
- Forms (6) directly after Phase 5 so the task modal exists before routing splits the app into pages

## Prerequisite Self-Checks

Two stretches of this course teach something that is not Angular. If you can answer the questions
below, treat those lessons as a skim: do their *Project Application* (it creates files TaskFlow
needs) and skip the training exercise.

### TypeScript (Lessons 0.2.1–0.2.3)

1. What does `strict: true` actually turn on, and which of those flags would have caught
   `user.profile.name` when `profile` is optional?
2. `type Role = 'admin' | 'member'` vs `enum Role` — why does this course use the union?
3. When does `interface` beat `type`, and when is it the other way round?
4. Write the signature of a function that takes a list of anything with an `id` and returns one
   element or `undefined`, without using `any`.
5. What is the difference between `readonly T[]` and `ReadonlyArray<T>`, and what does either
   actually prevent?

### RxJS (Lessons 5.1–5.2)

1. Name two things an Observable does that a Promise cannot.
2. `switchMap` vs `mergeMap` vs `concatMap` vs `exhaustMap` — for a search box, which one, and what
   breaks with each of the other three?
3. What does `debounceTime(300)` do to a stream of keystrokes, and why is
   `distinctUntilChanged()` usually right behind it?
4. Where does a subscription leak, and what does `takeUntilDestroyed()` actually subscribe to?
5. When is a signal the better tool than an Observable, and why is "state vs events over time" the
   dividing line?

If a question needs more than a sentence, the lesson is worth doing in full.

---

## Cross-Phase References

| Concept | Introduced In | Referenced In |
|---------|--------------|---------------|
| Feature-first layout (`core/`, `features/`, `shared/`) | Phase 1 (Lesson 1.1) | Phase 14 (boundaries) |
| `Modal` shell | Phase 2 (Lesson 2.4) | Phase 6 (task form), Phase 12 (focus/keyboard) |
| Drag & drop | Phase 2 (Lesson 2.5) | Phase 12 (keyboard alternative) |
| `TaskFlowDb` / `localStorage` | Phase 3 (Lesson 3.5) | Phase 4 (persistence effect), Phase 10 (SSR-safe) |
| `signal()` / `computed()` | Phase 4 | Phase 5, 8, 13 |
| `HttpClient` / `httpResource()` | Phase 5 (5.3, 5.6) | Phase 10 (transfer cache), Phase 11 (HttpTestingController) |
| Service Store pattern | Phase 5 (Lesson 5.7) | Phase 13 (migration source) |
| Signal Forms | Phase 6 (Lesson 6.2) | Phase 7 (create-board form) |
| `OnPush` strategy | Phase 8 (Lesson 8.2) | Phase 11 (testing OnPush components) |
| `@defer` | Phase 8 (Lesson 8.5) | Phase 10 (incremental hydration triggers) |
| Route guards / resolvers | Phase 7 | Phase 11 (testing), Phase 14 (error handling) |
| TestBed / Vitest | Phase 11 | All later phases (test policy) |
