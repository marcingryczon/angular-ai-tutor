# ADR 001: NgRx replaces the signal service store

- **Date:** 2026-09-18
- **Status:** accepted (for the curriculum) — see *Consequences* for the verdict on the app itself

## Context

Until Phase 13, TaskFlow kept its state in two signal stores, `core/task.store.ts` (126 lines) and
`core/board.store.ts` (88 lines). Components injected them and read `computed()` selectors; mutations
were methods that wrote to a `signal<Task[]>`. Nothing about that arrangement was failing: the board
rendered correctly, persistence ran through one `effect()`, and the specs were fast because a store
is a plain class.

What the arrangement did *not* offer was an audit trail. When a card ended up in the wrong column
during the drag-and-drop work, the only way to find out why was a breakpoint — there is no record of
which mutation ran, in what order, with what payload. A second, smaller pressure: `TaskStore.move()`
both computed the new order *and* wrote it, so the ordering rule could only be tested through the
store.

## Options considered

| Option | What it buys | What it costs |
|---|---|---|
| Keep the signal stores | Zero migration, smallest possible surface, specs stay trivial | No time-travel, no action log; the ordering rule stays welded to the writer |
| Extract pure functions, keep the stores | Testable rules, ~40 lines of change, no new dependency | Still no action log; discipline is the only thing keeping the store thin |
| `@ngrx/store` with feature slices | Devtools time-travel, an explicit action per intent, reducers that are pure by construction | +2 dependencies, +~200 lines of boilerplate, a second vocabulary next to signals |

## Decision

Migrate both stores to `@ngrx/store` feature slices under `core/ngrx/`, expose them to components as
signals via `store.selectSignal()`, and delete the old stores.

## Consequences

Easier: every state change is now a named action visible in Redux DevTools, which is how the
"card lands in the wrong column" class of bug gets diagnosed in seconds instead of minutes. The
reducers are pure — `newId()` and `Date.now()` moved to the action creators — so the ordering rule is
now testable without touching a store, and it is: `task.store.spec.ts` covers it directly.

Harder, and measured: `core/ngrx/` is **366 lines of implementation** against the **214 lines** the two
signal stores took — a 71% increase for state that behaves identically. The specs grew from one file
to three (328 lines). Two runtime dependencies were added. A component now needs three concepts
(action, selector, store) where it previously needed one (inject the store, call the method). The UI
did not change at all; the phase-13 milestone check asserts exactly that.

**The honest verdict for an app this size: the signal stores were enough.** TaskFlow has two entities,
one user, and no server. The 152 extra lines buy a devtools panel that a `console.log` in one `effect()`
would have approximated. The migration earns its place here because the curriculum needs the learner to
have written NgRx before they are asked to judge it — and because the next phase prices the decision
against the bundle budget rather than taking it on faith.

**What would reverse this:** if the action log goes a full phase without being the thing that finds a
bug, or if the NgRx chunk pushes the initial bundle past the budget set in lesson 14.3, revert to the
signal stores and keep only the extracted pure functions. That is a real option, not a rhetorical one:
the migration was a commit, and so is its inverse.
