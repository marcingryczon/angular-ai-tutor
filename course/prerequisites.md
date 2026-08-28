# Phase Dependencies & Prerequisites

This file maps the dependency graph between phases. A phase can only begin once all its prerequisites are completed.

## Dependency Graph

```
Phase 0 (Fundamentals)
  └── Phase 1 (Components)
        ├── Phase 2 (Communication)
        │     └── Phase 4 (Signals)
        │           └── Phase 5 (RxJS & Async)
        │                 └── Phase 14 (NgRx)
        ├── Phase 3 (DI)
        │     └── Phase 5 (RxJS & Async)
        ├── Phase 6 (Forms)
        ├── Phase 7 (Routing)
        │     └── Phase 10 (SSR)
        ├── Phase 8 (Performance)
        ├── Phase 9 (Directives & Pipes)
        └── Phase 11 (Testing)
              └── Phase 12 (Accessibility)
              └── Phase 13 (Architecture)
```

## Phase Prerequisites

| Phase | Prerequisites | Notes |
|-------|--------------|-------|
| 0 — Fundamentals | — | Entry point |
| 1 — Components | Phase 0 | |
| 2 — Communication | Phase 1 | |
| 3 — DI | Phase 1 | Can run parallel with Phase 2 |
| 4 — Signals | Phase 2 | Needs input/output understanding |
| 5 — RxJS & Async | Phase 3, Phase 4 | Needs DI (services) + Signals (toSignal) |
| 6 — Forms | Phase 1 | Can run parallel with Phase 3–5 |
| 7 — Routing | Phase 1 | Can run parallel with Phase 3–6 |
| 8 — Performance | Phase 1, Phase 4 | Benefits from signals knowledge |
| 9 — Directives & Pipes | Phase 1 | Can run parallel with Phase 3–8 |
| 10 — SSR | Phase 7 | Needs routing for multi-page SSR |
| 11 — Testing | Phase 1 | Can start early; deepens with each phase |
| 12 — Accessibility | Phase 11 | Test a11y with automated tools |
| 13 — Architecture | Phase 7, Phase 11 | Needs routing + testing for CI/CD |
| 14 — NgRx | Phase 5 (Lesson 5.6) | Service store is the "before" baseline |

## Recommended Order (Sequential)

For a strictly linear path (one phase at a time):

```
0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14
```

## Recommended Order (Optimized)

For a more efficient path that groups related concepts:

```
0 → 1 → 2 → 3 → 4 → 5 → 14 → 6 → 7 → 8 → 9 → 11 → 10 → 12 → 13
```

Rationale:
- NgRx (14) right after RxJS (5) while the state management context is fresh
- Forms (6) and Routing (7) are independent — can be done in any order
- Testing (11) before SSR (10) — test simple components first, then tackle SSR complexity
- Architecture (13) last — it's a synthesis of all prior knowledge

## Cross-Phase References

| Concept | Introduced In | Referenced In |
|---------|--------------|---------------|
| `signal()` / `computed()` | Phase 4 | Phase 5, 14 |
| `toSignal()` | Phase 5 | Phase 14 |
| Service Store pattern | Phase 5 (Lesson 5.6) | Phase 14 (migration target) |
| `resource()` | Phase 5 (Lesson 5.5) | Phase 10 (SSR data loading) |
| `OnPush` strategy | Phase 1 (Lesson 1.5) | Phase 8 (performance) |
| Route guards | Phase 7 | Phase 13 (auth architecture) |
| TestBed / Vitest | Phase 11 | All phases (test policy) |