# Phase 13: Global State Management with NgRx
*Focus: Predictable state with `@ngrx/store` — actions, reducers, selectors, DevTools, testing — a real migration of TaskFlow from the signal service store, and an honest verdict on whether it was worth it.*

## Git Branch: `phase-13-ngrx`
## Training dir: `src/app/phase-13-ngrx/13.<n>-<slug>/` · Lesson notes: `lessons/phase-13-ngrx/13.<n>-<slug>.md`

**Prerequisite:** Lesson 5.7 (Service-Based State Store) and Phase 11 (Testing). Before learning NgRx, you must have felt the problems it solves: scattered mutations, no audit trail, hard-to-trace bugs.

> **Scope decision.** This phase teaches the **`@ngrx/store`** package (actions → reducers → selectors, consumed as signals via `store.selectSignal()`), plus DevTools and testing — exactly what the reference implementation uses. `@ngrx/effects`, `@ngrx/entity`, and `@ngrx/signals` are covered as *awareness* in 13.9 so the learner can choose them later, but are not installed in TaskFlow.
>
> **This is a migration, not an add-on.** By the end of the phase `core/task.store.ts` / `core/board.store.ts` (signal services) are replaced by `core/ngrx/task.store.ts` / `core/ngrx/board.store.ts` (feature slices), components read state only through selectors, and the old stores are deleted. `TaskFlowDb` and the thin `TaskService` / `BoardService` remain as infrastructure.
>
> Installing `@ngrx/store` and `@ngrx/store-devtools` requires `npm install` — ask the learner to run it (`ng add @ngrx/store`).
>
> **No local reference file covers NgRx** — `agent-skills/angular-skills/references/` documents Angular itself. For this phase the authority is the official NgRx documentation for the installed major version; verify the API there before teaching it, exactly as rule 11 asks for Angular APIs.

---

### Lesson 13.1: Why Global State Management?
- *Objective:* Understand the problems with service stores and the Redux pattern.
- *Branch Name:* `lesson-13.1-why-ngrx`
- *Topics:*
  - Pain points of the 5.7 service store: any method can mutate anything, no history, no single place to reason about a change
  - Redux pattern: single source of truth, state is read-only, changes are described by actions and applied by pure reducers
  - NgRx packages overview: `store`, `store-devtools`, `effects`, `entity`, `signals` — and what TaskFlow will actually use
  - Decision matrix: signals in a service vs `signalStore` vs `@ngrx/store`
  - Cost: bundle size, boilerplate, learning curve — when it is *not* worth it
- *Training Exercise:* Analyze the training `CounterStore` / `TodoStore` from 5.7 — where are mutations hidden? Can you trace a state change from a click?
- *Project Application:* Document TaskFlow's state touchpoints (every component that reads or writes a store) — this is the migration checklist for 13.8

---

### Lesson 13.2: Actions
- *Objective:* Describe *what happened* with typed actions.
- *Branch Name:* `lesson-13.2-actions`
- *Topics:*
  - `createActionGroup({ source, events })` — the modern way to define a family of actions
  - `props<{ ... }>()` for payloads; `emptyProps()`
  - Naming: `[Source] Event` — events, not commands (`Task Moved`, not `Move Task`)
  - Actions as the only way to change state
- *Training Exercise:* Define action groups for a counter (`increment`, `decrement`, `reset`) and a todo list (`added`, `toggled`, `removed`)
- *Project Application:* Define `TaskActions` (`loaded`, `added`, `updated`, `removed`, `moved`, `searchChanged`, `priorityFilterChanged`, `assigneeFilterChanged`) and `BoardActions` (`loaded`, `created`, `removed`, `reset`) in `core/ngrx/`

---

### Lesson 13.3: Reducers & State Shape
- *Objective:* Pure functions that transform state immutably.
- *Branch Name:* `lesson-13.3-reducers`
- *Topics:*
  - `createReducer(initialState, on(Action, (state, props) => newState))`
  - Purity: same input → same output; no side effects; no mutation (spread, `map`, `filter`)
  - Designing the state shape: `TaskState { tasks, loaded, search, priorityFilter, assigneeFilter }`
  - Handling several actions with one handler; unknown actions return the same state
- *Training Exercise:* Write the counter and todo reducers; prove purity by calling them twice with the same input
- *Project Application:* Write `taskReducer` and `boardReducer` covering every action from 13.2

---

### Lesson 13.4: Selectors & Reading State as Signals
- *Objective:* Derive data from the store with memoized selectors and consume it with signals.
- *Branch Name:* `lesson-13.4-selectors`
- *Topics:*
  - `createFeatureSelector<TaskState>('tasks')` and `createSelector()` composition
  - Memoization: recompute only when inputs change — `createSelector` vs `computed()`
  - `store.selectSignal(selector)` — the bridge to templates and `computed()`; `store.select()` when an Observable is needed
  - Parameterised selectors via factory functions
- *Training Exercise:* Selectors for `selectAllTodos`, `selectCompleted`, `selectCount`, `selectById(id)`; read them with `selectSignal`
- *Project Application:* `selectFilteredTasks`, `selectTasksByColumn(columnId)`, `selectTaskCount`, `selectCurrentBoard(boardId)`; components consume them via `selectSignal`

---

### Lesson 13.5: `createFeature` & Store Setup
- *Objective:* Declarative feature slices and providing the store.
- *Branch Name:* `lesson-13.5-create-feature`
- *Topics:*
  - `createFeature({ name, reducer, extraSelectors })` — auto-generated selectors (`selectTasks`, `selectSearch`, …)
  - `provideStore({ tasks: tasksFeature.reducer, boards: … })` in `app.config.ts`; `provideState()` for lazy routes
  - **Reducers must stay pure**, so everything impure happens *before* the dispatch: ids and timestamps are produced by a service and travel inside the action payload (`TaskActions.added({ task })`, `BoardActions.created({ board, columns })`), never inside the reducer
  - Dispatching from components: `store.dispatch(TaskActions.moved({ … }))`
  - Persistence without Effects: a small `effect()` in a root service that watches `selectSignal(selectTasks)` and calls `TaskFlowDb.save()`
- *Training Exercise:* Convert the counter/todo reducers to `createFeature()`; compare the code
- *Project Application:* Provide `tasksFeature` and `boardsFeature`; wire the persistence effect; dispatch instead of calling store methods

---

### Lesson 13.6: DevTools & Debugging
- *Objective:* Time-travel debugging, action inspection, state diffing.
- *Branch Name:* `lesson-13.6-devtools`
- *Topics:*
  - `provideStoreDevtools({ maxAge, logOnly: !isDevMode(), connectInZone: false })` + the Redux DevTools browser extension — `connectInZone: false` is required in this zoneless workspace
  - Action log, state tree, diff, time travel, dispatching from DevTools
  - Common bugs: mutating state in a reducer (runtime checks `strictStateImmutability`, `strictActionImmutability`), forgetting to dispatch, selectors that always recompute
  - Meta-reducers (e.g. a logger) — awareness
- *Training Exercise:* Introduce a state mutation on purpose; watch runtime checks catch it; fix it
- *Project Application:* Enable DevTools for TaskFlow; trace add → move → delete → filter; verify each action and state diff

---

### Lesson 13.7: Testing NgRx
- *Objective:* Test reducers, selectors, and connected components.
- *Branch Name:* `lesson-13.7-testing-ngrx`
- *Topics:*
  - Reducers: `expect(reducer(state, action)).toEqual(expected)` — the easiest tests you will write
  - Selectors: `selector.projector(...)` for pure projection tests; memoization checks
  - Components: `provideMockStore({ initialState })`, `MockStore.overrideSelector()`, spying on `dispatch`
  - A mock store still needs `initialState` for every slice a *non-overridden* selector reads, and the component may still request `seed.json` — add `provideHttpClientTesting()` and drive change detection with `TestBed.tick()` instead of `whenStable()` (see 11.3)
- *Training Exercise:* Test the counter reducer, the todo selectors, and a component that dispatches on click
- *Project Application:* Test `taskReducer`, `boardReducer`, all selectors, and `Board` / `Column` with `provideMockStore` — coverage policy still applies

---

### Lesson 13.8: Migration — Replace the Service Stores
- *Objective:* Execute the migration and delete the legacy stores.
- *Branch Name:* `lesson-13.8-migration`
- *Topics:*
  - Strangler approach: one feature at a time (tasks first, then boards), app keeps working between steps
  - Mapping: `taskStore.moveTask()` → `dispatch(TaskActions.moved())`, `taskStore.filteredTasks()` → `selectSignal(selectFilteredTasks)`
  - Finding dead code after the switch; deleting `core/task.store.ts` / `core/board.store.ts`
  - **What is left of the services:** the reducers take over every data transformation, so `TaskService` shrinks to what a reducer must not do — building a task with a fresh id and timestamps, plus the event bus the UI subscribes to. Keeping its old `create/update/move/remove` methods would mean two implementations of the same rule.
  - Seeding, hydration and persistence still need an owner. Without `@ngrx/effects` that is a small root service holding the `httpResource`, the `afterNextRender()` hydration and one `effect()` over `store.selectSignal(...)` that writes to `TaskFlowDb`.
  - Post-migration verification with DevTools and the test suite
- *Training Exercise:* Migrate the training todo app from its service store to NgRx using the same steps
- *Project Application:* Complete the TaskFlow migration; remove the old stores; all tests green; spec §9 checklist still passes

---

### Lesson 13.9: Beyond `@ngrx/store` — Effects, Entity, signalStore (Awareness)
- *Objective:* Know the rest of the ecosystem well enough to choose it.
- *Branch Name:* `lesson-13.9-ngrx-ecosystem`
- *Topics:*
  - `@ngrx/effects`: `createEffect()`, `Actions` + `ofType()`, flattening operators — where TaskFlow *would* use it if it had an HTTP backend
  - `@ngrx/entity`: `createEntityAdapter()`, `{ ids, entities }` shape, generated CRUD and selectors
  - `@ngrx/signals`: `signalStore()`, `withState()`, `withComputed()`, `withMethods()`, `withHooks()`, `rxMethod()`, `withEntities()` — the signal-native alternative; comparison with 5.7 and with `@ngrx/store`
  - Decision guide for the learner's next project
- *Training Exercise:* Rebuild the training todo store as a `signalStore()` in the training app and compare line count and readability with the `@ngrx/store` version
- *Project Application:* Write the ADR — `course/adr/001-state-management.md`: what the signal store cost, what NgRx bought, what it cost in bundle size and boilerplate, and which of the three you would pick for your next project. **This is the deliverable of the phase**, not an optional extra: the point of the migration is to be able to answer the question, not to end up on NgRx.
- *Reality check:* the app behaves exactly as it did before and the bundle grew by ~35 kB. If your ADR concludes "a signal store was enough for TaskFlow", that is the correct answer and you now have the experience to defend it.
---

## Phase Completion Criteria

Before marking this phase as complete:

- [ ] All lessons implemented and merged to `main`
- [ ] All training exercises completed
- [ ] All project applications integrated into TaskFlow
- [ ] Legacy service stores removed; `taskflow-spec.md` §9 checklist still passes
- [ ] The ADR is written and says, in one sentence, whether you would do this again
- [ ] `npm run verify 13` passes — the milestone in `taskflow-spec.md` §10 is reached
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
