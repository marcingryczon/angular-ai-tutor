# Phase 14: Global State Management with NgRx
*Focus: Predictable state with `@ngrx/store` — actions, reducers, selectors, DevTools, testing — and a real migration of TaskFlow from the signal service store.*

## Git Branch: `lesson-14.<n>-*`
## Training dir: `src/app/phase-14-ngrx/14.<n>-<slug>/` · Lesson notes: `lessons/phase-14-ngrx/14.<n>-<slug>.md`

**Prerequisite:** Lesson 5.7 (Service-Based State Store) and Phase 11 (Testing). Before learning NgRx, you must have felt the problems it solves: scattered mutations, no audit trail, hard-to-trace bugs.

> **Scope decision.** This phase teaches the **`@ngrx/store`** package (actions → reducers → selectors, consumed as signals via `store.selectSignal()`), plus DevTools and testing — exactly what the reference implementation uses. `@ngrx/effects`, `@ngrx/entity`, and `@ngrx/signals` are covered as *awareness* in 14.9 so the learner can choose them later, but are not installed in TaskFlow.
>
> **This is a migration, not an add-on.** By the end of the phase `core/task.store.ts` / `core/board.store.ts` (signal services) are replaced by `core/ngrx/task.store.ts` / `core/ngrx/board.store.ts` (feature slices), components read state only through selectors, and the old stores are deleted. `TaskFlowDb` and the thin `TaskService` / `BoardService` remain as infrastructure.
>
> Installing `@ngrx/store` and `@ngrx/store-devtools` requires `npm install` — ask the learner to run it (`ng add @ngrx/store`).

---

### Lesson 14.1: Why Global State Management?
- *Objective:* Understand the problems with service stores and the Redux pattern.
- *Branch Name:* `lesson-14.1-why-ngrx`
- *Topics:*
  - Pain points of the 5.7 service store: any method can mutate anything, no history, no single place to reason about a change
  - Redux pattern: single source of truth, state is read-only, changes are described by actions and applied by pure reducers
  - NgRx packages overview: `store`, `store-devtools`, `effects`, `entity`, `signals` — and what TaskFlow will actually use
  - Decision matrix: signals in a service vs `signalStore` vs `@ngrx/store`
  - Cost: bundle size, boilerplate, learning curve — when it is *not* worth it
- *Training Exercise:* Analyze the training `CounterStore` / `TodoStore` from 5.7 — where are mutations hidden? Can you trace a state change from a click?
- *Project Application:* Document TaskFlow's state touchpoints (every component that reads or writes a store) — this is the migration checklist for 14.8

---

### Lesson 14.2: Actions
- *Objective:* Describe *what happened* with typed actions.
- *Branch Name:* `lesson-14.2-actions`
- *Topics:*
  - `createActionGroup({ source, events })` — the modern way to define a family of actions
  - `props<{ ... }>()` for payloads; `emptyProps()`
  - Naming: `[Source] Event` — events, not commands (`Task Moved`, not `Move Task`)
  - Actions as the only way to change state
- *Training Exercise:* Define action groups for a counter (`increment`, `decrement`, `reset`) and a todo list (`added`, `toggled`, `removed`)
- *Project Application:* Define `TaskActions` (`loaded`, `added`, `updated`, `removed`, `moved`, `searchChanged`, `priorityFilterChanged`, `assigneeFilterChanged`) and `BoardActions` (`loaded`, `created`, `removed`, `reset`) in `core/ngrx/`

---

### Lesson 14.3: Reducers & State Shape
- *Objective:* Pure functions that transform state immutably.
- *Branch Name:* `lesson-14.3-reducers`
- *Topics:*
  - `createReducer(initialState, on(Action, (state, props) => newState))`
  - Purity: same input → same output; no side effects; no mutation (spread, `map`, `filter`)
  - Designing the state shape: `TaskState { tasks, loaded, search, priorityFilter, assigneeFilter }`
  - Handling several actions with one handler; unknown actions return the same state
- *Training Exercise:* Write the counter and todo reducers; prove purity by calling them twice with the same input
- *Project Application:* Write `taskReducer` and `boardReducer` covering every action from 14.2

---

### Lesson 14.4: Selectors & Reading State as Signals
- *Objective:* Derive data from the store with memoized selectors and consume it with signals.
- *Branch Name:* `lesson-14.4-selectors`
- *Topics:*
  - `createFeatureSelector<TaskState>('tasks')` and `createSelector()` composition
  - Memoization: recompute only when inputs change — `createSelector` vs `computed()`
  - `store.selectSignal(selector)` — the bridge to templates and `computed()`; `store.select()` when an Observable is needed
  - Parameterised selectors via factory functions
- *Training Exercise:* Selectors for `selectAllTodos`, `selectCompleted`, `selectCount`, `selectById(id)`; read them with `selectSignal`
- *Project Application:* `selectFilteredTasks`, `selectTasksByColumn(columnId)`, `selectTaskCount`, `selectCurrentBoard(boardId)`; components consume them via `selectSignal`

---

### Lesson 14.5: `createFeature` & Store Setup
- *Objective:* Declarative feature slices and providing the store.
- *Branch Name:* `lesson-14.5-create-feature`
- *Topics:*
  - `createFeature({ name, reducer, extraSelectors })` — auto-generated selectors (`selectTasks`, `selectSearch`, …)
  - `provideStore({ tasks: tasksFeature.reducer, boards: … })` in `app.config.ts`; `provideState()` for lazy routes
  - Dispatching from components: `store.dispatch(TaskActions.moved({ … }))`
  - Persistence without Effects: a small `effect()` in a root service that watches `selectSignal(selectTasks)` and calls `TaskFlowDb.save()`
- *Training Exercise:* Convert the counter/todo reducers to `createFeature()`; compare the code
- *Project Application:* Provide `tasksFeature` and `boardsFeature`; wire the persistence effect; dispatch instead of calling store methods

---

### Lesson 14.6: DevTools & Debugging
- *Objective:* Time-travel debugging, action inspection, state diffing.
- *Branch Name:* `lesson-14.6-devtools`
- *Topics:*
  - `provideStoreDevtools({ maxAge, logOnly: !isDevMode() })` + the Redux DevTools browser extension
  - Action log, state tree, diff, time travel, dispatching from DevTools
  - Common bugs: mutating state in a reducer (runtime checks `strictStateImmutability`, `strictActionImmutability`), forgetting to dispatch, selectors that always recompute
  - Meta-reducers (e.g. a logger) — awareness
- *Training Exercise:* Introduce a state mutation on purpose; watch runtime checks catch it; fix it
- *Project Application:* Enable DevTools for TaskFlow; trace add → move → delete → filter; verify each action and state diff

---

### Lesson 14.7: Testing NgRx
- *Objective:* Test reducers, selectors, and connected components.
- *Branch Name:* `lesson-14.7-testing-ngrx`
- *Topics:*
  - Reducers: `expect(reducer(state, action)).toEqual(expected)` — the easiest tests you will write
  - Selectors: `selector.projector(...)` for pure projection tests; memoization checks
  - Components: `provideMockStore({ initialState })`, `MockStore.overrideSelector()`, spying on `dispatch`
- *Training Exercise:* Test the counter reducer, the todo selectors, and a component that dispatches on click
- *Project Application:* Test `taskReducer`, `boardReducer`, all selectors, and `Board` / `Column` with `provideMockStore` — coverage policy still applies

---

### Lesson 14.8: Migration — Replace the Service Stores
- *Objective:* Execute the migration and delete the legacy stores.
- *Branch Name:* `lesson-14.8-migration`
- *Topics:*
  - Strangler approach: one feature at a time (tasks first, then boards), app keeps working between steps
  - Mapping: `taskStore.moveTask()` → `dispatch(TaskActions.moved())`, `taskStore.filteredTasks()` → `selectSignal(selectFilteredTasks)`
  - Finding dead code after the switch; deleting `core/task.store.ts` / `core/board.store.ts`
  - Post-migration verification with DevTools and the test suite
- *Training Exercise:* Migrate the training todo app from its service store to NgRx using the same steps
- *Project Application:* Complete the TaskFlow migration; remove the old stores; all tests green; spec §9 checklist still passes

---

### Lesson 14.9: Beyond `@ngrx/store` — Effects, Entity, signalStore (Awareness)
- *Objective:* Know the rest of the ecosystem well enough to choose it.
- *Branch Name:* `lesson-14.9-ngrx-ecosystem`
- *Topics:*
  - `@ngrx/effects`: `createEffect()`, `Actions` + `ofType()`, flattening operators — where TaskFlow *would* use it if it had an HTTP backend
  - `@ngrx/entity`: `createEntityAdapter()`, `{ ids, entities }` shape, generated CRUD and selectors
  - `@ngrx/signals`: `signalStore()`, `withState()`, `withComputed()`, `withMethods()`, `withHooks()`, `rxMethod()`, `withEntities()` — the signal-native alternative; comparison with 5.7 and with `@ngrx/store`
  - Decision guide for the learner's next project
- *Training Exercise:* Rebuild the training todo store as a `signalStore()` in the training app and compare line count and readability with the `@ngrx/store` version
- *Project Application:* N/A (awareness lesson) — optionally write an ADR in `course/` recording why TaskFlow uses `@ngrx/store`
---

## Phase Completion Criteria

Before marking this phase as complete:

- [ ] All lessons implemented and merged to `main`
- [ ] All training exercises completed
- [ ] All project applications integrated into TaskFlow
- [ ] Legacy service stores removed; `taskflow-spec.md` §9 checklist still passes
- [ ] Tests pass and coverage thresholds are met

---

## Key Takeaways

After completing this phase, the learner should be able to:

- Explain the Redux pattern and why unidirectional data flow reduces bugs
- Build a store with `createActionGroup`, `createReducer`, `createSelector`, and `createFeature`
- Consume store state as signals with `selectSignal()` and dispatch actions from components
- Debug with Redux DevTools and runtime immutability checks
- Test reducers, selectors, and connected components with `provideMockStore`
- Migrate a service-based store to NgRx incrementally and remove the legacy code
- Choose between `@ngrx/store`, `signalStore`, and a plain signal service for a given project
