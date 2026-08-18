# Phase 14: Global State Management with NgRx
*Focus: Centralized state management with predictable data flow, from NgRx Store fundamentals to @ngrx/signals (signalStore), Entity, DevTools, debugging, and comprehensive testing.*

**Prerequisite:** Lesson 5.6 (Service-Based State Store). Before learning NgRx, you must understand the problems it solves: scattered state, prop drilling, unpredictable mutations, and the need for a single source of truth.

## Git Branch: `lesson-14*-*`

---

#### 14.1: NgRx Fundamentals — Why & What

##### Lesson 14.1.1: Why Global State Management?
- *Objective:* Understand the problems with service-based stores and why NgRx exists.
- *Branch Name:* `lesson-1411-why-ngrx`
- *Topics:*
  - Problems with service stores: scattered state, implicit mutations, no history, hard-to-trace bugs
  - Redux pattern: unidirectional data flow, single source of truth, immutable state
  - NgRx ecosystem overview: Store, Effects, Entity, Runtime Config, Component Store, Signals
  - When to use NgRx vs service store vs signals: decision matrix
  - Bundle size impact: NgRx adds ~30-50KB gzipped — is it worth it?
  - TaskFlow case study: why our service store from Lesson 5.6 needs evolution
- *Training Exercise:* Analyze the `TaskStore` from Lesson 5.6 — identify: where are mutations hidden? Can you trace a state change? What happens when 3 components update the same task?
- *Project Application:* Document the state management problems in current TaskFlow. Create a "state flow diagram" showing how data moves between components via the service store.

---

#### 14.2: NgRx Store — Actions, Reducers, State

##### Lesson 14.2.1: Actions — The What Happened
- *Objective:* Create typed actions with `createAction()` and `props()`.
- *Branch Name:* `lesson-1421-actions`
- *Topics:*
  - What is an action: `{ type, payload }` — the "event" that describes what happened
  - `createAction('TYPE')` — actions without payload
  - `createAction('TYPE', props<{ T }>())` — actions with typed payload
  - Action groups: organizing related actions
  - Action creators: functions that return actions
  - Why actions are the only way to trigger state changes in NgRx
  - Comparison: RxJS Subject from Lesson 5.6 vs NgRx actions
- *Training Exercise:* Define actions for a counter: `increment()`, `decrement()`, `reset()`. Define actions for a todo: `addTodo({ text })`, `toggleTodo({ id })`, `deleteTodo({ id })`.
- *Project Application:* Define TaskFlow actions: `TaskAdded`, `TaskUpdated`, `TaskDeleted`, `TaskMoved`, `BoardLoaded`, `BoardSelected`

##### Lesson 14.2.2: Reducers — The How State Changes
- *Objective:* Pure functions that transform state immutably.
- *Branch Name:* `lesson-1422-reducers`
- *Topics:*
  - What is a reducer: `(state, action) => newState` — pure, deterministic, no side effects
  - `on()` helper: matching actions to reducer logic
  - `createReducer()` — functional reducer creation
  - Immutable updates: spread operator, immutable.js patterns
  - Why reducers must be pure: predictability, time-travel debugging, testing
  - Default state: the initial state of the store slice
  - Handling multiple actions in a single reducer
- *Training Exercise:* Create a counter reducer with `increment`, `decrement`, `reset`. Create a todo reducer with `add`, `toggle`, `delete`. Verify purity: same input → same output.
- *Project Application:* Create `taskReducer` and `boardReducer` for TaskFlow. Handle all CRUD operations immutably.

##### Lesson 14.2.3: State & Store Configuration
- *Objective:* Define the global state shape and provide the store.
- *Branch Name:* `lesson-1423-state`
- *Topics:*
  - `State` interface: the global shape of the application state
  - Feature states: splitting state into domains (tasks, boards, ui)
  - `provideStore()` — registering the store with reducer functions
  - `Store` interface: `select()`, `dispatch()`, `setState()`
  - How the store wires actions → reducers → new state
  - Store as an Observable: subscribing to state slices
- *Training Exercise:* Define a `AppState` interface with `counter` and `todos` slices. Provide the store with both reducers.
- *Project Application:* Define `TaskFlowState` with `tasks`, `boards`, `ui` slices. Provide the store in `app.config.ts`.

##### Lesson 14.2.4: Selectors — Reading State
- *Objective:* Derive data from the store with memoized selectors.
- *Branch Name:* `lesson-1424-selectors`
- *Topics:*
  - `createSelector()` — memoized selectors (like `computed()` for the store)
  - `createSelectorFactory()` — creating a namespace of selectors
  - Selector composition: building complex selectors from simple ones
  - Memoization: why selectors only recompute when inputs change
  - Selectors vs computed signals: comparison of derived state patterns
  - Default values and handling undefined state
- *Training Exercise:* Create selectors: `selectAllTodos`, `selectCompletedTodos`, `selectTodoCount`, `selectTodoById`. Compose: `selectUrgentTodoCount` from `selectTodosByPriority`.
- *Project Application:* Create `TaskSelectors`: `selectAllTasks`, `selectTasksByColumn`, `selectTaskById`, `selectTaskCountByPriority`. Create `BoardSelectors`: `selectCurrentBoard`, `selectBoardTasks`.

---

#### 14.3: createFeature API — Modern NgRx

##### Lesson 14.3.1: createFeature — Declarative Store Slices
- *Objective:* Replace manual `provideStore()` + `State` interface with `createFeature()`.
- *Branch Name:* `lesson-1431-create-feature`
- *Topics:*
  - What is `createFeature()`: declarative, self-documenting feature slices
  - `createFeature({ name, reducer, extraReducers })` — the modern API
  - Auto-generated selectors: `selectAll`, `selectName` — no manual `createSelector()` needed
  - Auto-generated action adapters: seamless integration
  - `name` collision: why the `name` field matters (it becomes the state key)
  - `createFeature` vs manual approach: code comparison
  - Initial state as part of the feature definition
- *Training Exercise:* Convert the manual counter/todo store from Lesson 14.2 to `createFeature()`. Compare the code reduction.
- *Project Application:* Convert `tasks` and `boards` reducers to `createFeature()`. Use auto-generated selectors.

##### Lesson 14.3.2: Multiple Features & Feature Composition
- *Objective:* Manage multiple feature slices and compose them.
- *Branch Name:* `lesson-1432-feature-composition`
- *Topics:*
  - Registering multiple features with `provideStore()`
  - Feature initialization order and dependencies
  - Selecting across features: `getSelectors()` from another feature
  - Feature state as a tree: how features map to the global state shape
  - `initialState` per feature
  - Lazy-loaded features: features loaded on demand
- *Training Exercise:* Create 3 features: `counter`, `todos`, `ui`. Select data across features (e.g., show todo count in UI header).
- *Project Application:* Compose `tasks`, `boards`, `ui` features. Select board name in task header. Select UI filter in task list.

##### Lesson 14.3.3: extraReducers & Cross-Feature Actions
- *Objective:* Handle actions from other features using `extraReducers`.
- *Branch Name:* `lesson-1433-extra-reducers`
- *Topics:*
  - `extraReducers`: handling actions that originate from other features
  - Why cross-feature actions need `extraReducers` (not the main reducer)
  - Example: `UI_RESET` action affecting both `tasks` and `boards` features
  - Action routing: which feature handles which action
  - Preventing feature coupling: when cross-feature actions are a code smell
- *Training Exercise:* Create a `RESET_ALL` action that clears both `counter` and `todos` features using `extraReducers`.
- *Project Application:* Handle `BoardSelected` action in `tasks` feature (clear tasks when board changes). Handle `TaskMoved` in `ui` feature (update column highlight).

---

#### 14.4: NgRx Effects — Side Effects

##### Lesson 14.4.1: Effects Fundamentals
- *Objective:* Handle side effects (API calls, navigation, logging) with `createEffect()`.
- *Branch Name:* `lesson-1441-effects-basics`
- *Topics:*
  - What are Effects: observers of actions, not reducers
  - `createEffect()` — creating an effect from an action stream
  - `Actions` service: injecting and listening to actions
  - Effect lifecycle: dispatch → effect → API → dispatch result actions
  - Why side effects belong in Effects, not reducers or components
  - `dispatch: true` (default) vs `dispatch: false` (fire-and-forget effects)
  - Comparison: Effects vs service methods from Lesson 5.6
- *Training Exercise:* Create an effect that logs every action to console (`dispatch: false`). Create an effect that dispatches a `RESET` action after 5 seconds of `INCREMENT`.
- *Project Application:* Create `LoadTasksEffect` that listens for `TasksLoadRequested` and dispatches `TasksLoaded` or `TasksLoadFailed`.

##### Lesson 14.4.2: Effects & HTTP Requests
- *Objective:* Chain HTTP calls with effects using RxJS operators.
- *Branch Name:* `lesson-1442-effects-http`
- *Topics:*
  - `concatMap` vs `switchMap` vs `mergeMap` in effects — which to choose and why
  - Error handling in effects: `catchError`, retry logic
  - Multiple action dispatching from a single effect
  - Loading states: `Requested` → `Loading` → `Loaded`/`Failed` pattern
  - Optimistic vs pessimistic updates
  - Effect composition: splitting complex effects into smaller ones
- *Training Exercise:* Create an effect that fetches todos from a mock API. Handle loading, success, and error states with separate actions.
- *Project Application:* Create effects for: `LoadBoardEffect`, `AddTaskEffect` (POST), `UpdateTaskEffect` (PUT), `DeleteTaskEffect` (DELETE). Implement loading/error UI states.

##### Lesson 14.4.3: Effects — Advanced Patterns
- *Objective:* Handle complex effect scenarios.
- *Branch Name:* `lesson-1443-effects-advanced`
- *Topics:*
  - `ofType()` vs `filter()` — matching actions in effects
  - Chaining effects: one effect triggers another
  - `initialState` and effects: loading data on app boot with `INIT` action
  - WebSockets in effects: bidirectional communication
  - Throttling and debouncing effects
  - Effect cancellation with `takeUntilDestroyed()`
  - Testing side effects: mocking HTTP in effects (preview)
- *Training Exercise:* Create an effect that loads data on app initialization. Create a debounced search effect.
- *Project Application:* Create `InitBoardEffect` that loads the default board on app start. Create a debounced task search effect.

---

#### 14.5: @ngrx/entity — Collections

##### Lesson 14.5.1: Entity Adapter
- *Objective:* Manage collections of typed entities with generated CRUD operations.
- *Branch Name:* `lesson-1451-entity-adapter`
- *Topics:*
  - What is an entity: a typed object with a unique `id`
  - `EntityAdapter<T>`: generated collection operations
  - `createAdapter<T>()` — defining an entity adapter with `selectId`
  - Entity state: `{ entities: Dictionary<T>, ids: string[] }` — why this shape (O(1) lookup)
  - Generated adapter methods: `addOne`, `addMany`, `addAll`, `updateOne`, `updateMany`, `removeOne`, `removeAll`, `setAll`, `upsertOne`, `upsertMany`
  - Why Entity: eliminates boilerplate, prevents bugs, consistent collection operations
- *Training Exercise:* Create an adapter for `Todo` entities. Practice: add, update, remove, upsert. Verify the internal state shape.
- *Project Application:* Create `taskAdapter` for `Task` entities. Create `boardAdapter` for `Board` entities. Replace manual array operations in reducers.

##### Lesson 14.5.2: Entity Selectors
- *Objective:* Use generated entity selectors for efficient data access.
- *Branch Name:* `lesson-1452-entity-selectors`
- *Topics:*
  - `adapter.getSelectors()`: auto-generated selectors (`selectAll`, `selectIds`, `selectTotal`)
  - `selectId`: custom ID selectors
  - Entity selector composition: filtering and sorting with custom selectors
  - `getSelectors` vs manual `createSelector`: performance comparison
  - Selecting a single entity by ID: `selectEntity` pattern
- *Training Exercise:* Use entity selectors to select all todos, count, and a specific todo by ID. Create a filtered selector for completed todos.
- *Project Application:* Use `taskAdapter.getSelectors()` to select all tasks, task count, task by ID. Create `selectTasksByColumn` and `selectTasksByPriority` custom selectors.

##### Lesson 14.5.3: Entity in Reducers with createFeature
- *Objective:* Integrate Entity adapter with `createFeature()` reducers.
- *Branch Name:* `lesson-1453-entity-feature`
- *Topics:*
  - Entity reducer helpers: `adapter.reduce()` — the functional entity reducer pattern
  - Combining `createFeature()` with entity state shape
  - Handling entity CRUD actions with adapter methods in reducers
  - Initial entity state: empty collection vs preloaded data
  - Migration: converting a manual array reducer to entity-based reducer
- *Training Exercise:* Convert the todo reducer from Lesson 14.2 to use entity adapter. Compare code before/after.
- *Project Application:* Convert `tasks` feature to use entity adapter. All CRUD operations should use `adapter.addOne()`, `adapter.updateOne()`, `adapter.removeOne()`.

---

#### 14.6: @ngrx/signals — signalStore

##### Lesson 14.6.1: signalStore Fundamentals
- *Objective:* Build reactive stores with `signalStore()` — the modern NgRx + Signals fusion.
- *Branch Name:* `lesson-1461-signal-store`
- *Topics:*
  - What is `signalStore()`: a signal-based store API from @ngrx/signals
  - Why signalStore: combines NgRx patterns with Angular Signals reactivity
  - `signalStore()` vs `Store`: comparison of APIs
  - `getState()` and `setState()` — reading/writing signal state
  - `computed()` signals in signalStore — derived state
  - `method()` — imperative methods in the store (like store actions)
  - Providers: `type`, `providers`, `extraProviders`
  - signalStore vs service store from Lesson 5.6: direct comparison
- *Training Exercise:* Create a `signalStore()` for a counter: state, computed double, methods for increment/decrement.
- *Project Application:* Create a `UiSignalStore` for TaskFlow: selected board, filter state, modal visibility. Use `getState()`, `computed()`, `method()`.

##### Lesson 14.6.2: signalStore with RxJS & Effects
- *Objective:* Integrate RxJS streams and side effects in signalStore.
- *Branch Name:* `lesson-1462-signal-store-rxjs`
- *Topics:*
  - `rxMethod()` — creating RxJS-based methods in signalStore
  - `rxMethod()` return type: `Signal<Operation>` with status, value, error
  - Operation states: `idle`, `loading`, `success`, `error`
  - `rxMethod()` vs NgRx Effects: when to use which
  - Source signals: `source()` for reactive data sources
  - `computed()` with `rxMethod()`: deriving state from async operations
- *Training Exercise:* Create a signalStore with `rxMethod()` that fetches data from an API. Handle loading, success, error states.
- *Project Application:* Create `TaskSignalStore` with `rxMethod('loadTasks')`, `rxMethod('addTask')`, `rxMethod('deleteTask')`. Connect to TaskFlow components.

##### Lesson 14.6.3: signalStore with Entity (withMethods, withSource)
- *Objective:* Use `@ngrx/signals` entity adapters and advanced signalStore patterns.
- *Branch Name:* `lesson-1463-signal-store-entity`
- *Topics:*
  - `withEntity()` — entity support in signalStore (if available in version)
  - `withMethods()` — adding methods to the store
  - `withComputed()` — adding computed signals
  - `withHooks()` — `onPush`, `onInit` lifecycle hooks in signalStore
  - `signalStore` feature composition: combining multiple stores
  - `signalStore` with `NgRx Store`: hybrid patterns (using both)
  - Migration path: from `signalStore` to full NgRx Store (or vice versa)
- *Training Exercise:* Build a complete signalStore for a todo app: state, entity-like collection, computed filters, rxMethods for CRUD, hooks for auto-loading.
- *Project Application:* Refactor TaskFlow to use `signalStore` for the UI layer (filters, selection) while keeping NgRx Store for the domain layer (tasks, boards).

---

#### 14.7: NgRx Runtime Configuration

##### Lesson 14.7.1: Runtime Config & Middleware
- *Objective:* Configure the store at runtime with middleware and meta-reducers.
- *Branch Name:* `lesson-1471-runtime-config`
- *Topics:*
  - `runtimeConfig` — runtime store configuration
  - Middleware: `logger()` — logging actions and state changes
  - Meta-reducers: transforming reducers at runtime
  - `maxActions`: limiting the action buffer size
  - Feature composition in runtime config
  - Environment-specific config: dev (logger on) vs prod (logger off)
- *Training Exercise:* Enable logger middleware. Observe action flow in the console. Disable for production.
- *Project Application:* Configure NgRx runtime config for TaskFlow: logger in dev, disabled in prod. Set `maxActions: 500`.

---

#### 14.8: NgRx DevTools & Debugging

##### Lesson 14.8.1: NgRx DevTools Extension
- *Objective:* Time-travel debugging, action inspection, state diffing.
- *Branch Name:* `lesson-1481-devtools`
- *Topics:*
  - Installing NgRx DevTools browser extension (Chrome/Firefox)
  - `StoreDevtoolsModule.instrument()` — configuring DevTools
  - Action log: inspecting every action dispatched
  - State tree: browsing the current state
  - Time-travel: reverting to previous states
  - Action dispatching from DevTools: testing actions manually
  - State diffing: seeing what changed between actions
  - Configuration options: `maxAge`, `logOnly`, `autoPause`, `trace`
- *Training Exercise:* Install DevTools. Dispatch counter actions. Inspect the action log. Revert to a previous state.
- *Project Application:* Enable NgRx DevTools for TaskFlow. Visually trace: add task → update task → delete task. Verify each action and state change. Debug a state inconsistency.

##### Lesson 14.8.2: Debugging NgRx Applications
- *Objective:* Systematic debugging strategies for NgRx apps.
- *Branch Name:* `lesson-1482-debugging`
- *Topics:*
  - Common NgRx bugs: mutating state in reducers, forgetting to dispatch, selector memoization issues
  - Debugging technique 1: console.log in reducers (temporary)
  - Debugging technique 2: DevTools action replay
  - Debugging technique 3: selector debugging — verifying memoization
  - Debugging technique 4: effect debugging — verifying action streams
  - Immutable state violations: how to detect and fix
  - Performance debugging: excessive selector recomputation
- *Training Exercise:* Intentionally introduce a state mutation bug. Use DevTools to detect it. Fix it.
- *Project Application:* Debug a scenario in TaskFlow where a task update doesn't reflect in the UI. Trace through: action → reducer → selector → component.

---

#### 14.9: Testing NgRx

##### Lesson 14.9.1: Testing Reducers
- *Objective:* Unit test reducer purity and state transitions.
- *Branch Name:* `lesson-1491-testing-reducers`
- *Topics:*
  - Why reducer testing is simple: pure functions = easy to test
  - Test structure: given initialState + action → expect nextState
  - Testing all action handlers in a reducer
  - Testing default state (unknown action)
  - Testing entity adapter operations in reducers
  - Testing with `createReducer` and `on()`
- *Training Exercise:* Test the counter reducer: increment from 0 → 1, decrement from 5 → 4, reset from 10 → 0.
- *Project Application:* Test `taskReducer`: add task, update task, delete task, load tasks. Test `boardReducer`: select board, load boards.

##### Lesson 14.9.2: Testing Selectors
- *Objective:* Verify selector memoization and derived state.
- *Branch Name:* `lesson-1492-testing-selectors`
- *Topics:*
  - Testing selector output for given state
  - Testing selector memoization: same input → same reference
  - Testing composed selectors
  - Testing entity selectors
  - Edge cases: empty state, partial state, undefined inputs
- *Training Exercise:* Test todo selectors: selectAll, selectCompleted, selectById. Verify memoization.
- *Project Application:* Test `TaskSelectors`: selectTasksByColumn with various filters. Test `selectTaskCountByPriority`.

##### Lesson 14.9.3: Testing Effects
- *Objective:* Test effect logic with mocked actions and services.
- *Branch Name:* `lesson-1493-testing-effects`
- *Topics:*
  - `runEffects()` — testing effect execution
  - Mocking actions: `hot()`, `cold()` from `@ngrx/effects/testing`
  - Mocking HTTP services with `TestingModule` / Vitest mocks
  - Testing effect dispatch: verifying output actions
  - Testing error paths in effects
  - Testing `dispatch: false` effects
  - Testing effect cleanup
- *Training Exercise:* Test an effect that fetches data: verify it dispatches success on 200, error on 500.
- *Project Application:* Test `LoadTasksEffect`: mock HTTP response, verify `TasksLoaded` dispatched. Test error path: verify `TasksLoadFailed`.

##### Lesson 14.9.4: Testing signalStore
- *Objective:* Test signalStore state, methods, and rxMethods.
- *Branch Name:* `lesson-1494-testing-signal-store`
- *Topics:*
  - Testing signalStore state signals
  - Testing computed signals in signalStore
  - Testing methods: invoking and verifying state changes
  - Testing rxMethods: mocking HTTP, verifying operation states
  - Testing signalStore hooks
  - `signalStore` testing utilities from `@ngrx/signals/testing`
- *Training Exercise:* Test a signalStore with counter state, computed double, and increment method.
- *Project Application:* Test `UiSignalStore`: verify filter changes, board selection. Test `TaskSignalStore`: verify rxMethod loading/success/error states.

##### Lesson 14.9.5: Integration Testing with NgRx
- *Objective:* Test components connected to the NgRx store.
- *Branch Name:* `lesson-1495-testing-integration`
- *Topics:*
  - Providing a mock store with `provideMockStore()`
  - Mocking selectors with `selector`: { getter, value }
  - Mocking dispatch: verifying actions dispatched
  - Testing component → store → component data flow
  - Testing with `render()` and NgRx store
  - Overriding store providers in tests
- *Training Exercise:* Test a component that displays counter value from the store. Verify increment button dispatches the correct action.
- *Project Application:* Test TaskFlow board component: verify it dispatches `TasksLoadRequested` on init. Verify task list updates when store state changes.

---

#### 14.10: Refactoring TaskFlow to NgRx

##### Lesson 14.10.1: Migration Strategy — Service Store to NgRx
- *Objective:* Plan and execute the migration from service-based store to NgRx.
- *Branch Name:* `lesson-14101-migration-strategy`
- *Topics:*
  - Migration audit: identifying all state management touchpoints
  - Phase 1: Define actions and reducers (no component changes yet)
  - Phase 2: Replace service selectors with store selectors
  - Phase 3: Replace service action methods with dispatch()
  - Phase 4: Add effects for async operations
  - Phase 5: Add entity adapters for collections
  - Strangler pattern: migrating one feature at a time
  - Rollback strategy: keeping the service store as a fallback
- *Training Exercise:* Create a migration checklist for the training counter/todo app.
- *Project Application:* Audit TaskFlow: list all components that read/write store state. Create a migration plan.

##### Lesson 14.10.2: Full Migration — Tasks Feature
- *Objective:* Migrate the tasks feature from service store to NgRx Store + Entity.
- *Branch Name:* `lesson-14102-migrate-tasks`
- *Topics:*
  - Define `TasksFeature` with `createFeature()` + entity adapter
  - Define task actions: `AddTask`, `UpdateTask`, `DeleteTask`, `LoadTasks`, etc.
  - Create task effects: `LoadTasksEffect`, `AddTaskEffect`, etc.
  - Replace `taskStore.selectXxx` with `store.select(selectXxx)`
  - Replace `taskStore.addAction()` with `store.dispatch(TasksAction.added())`
  - Verify all task components work after migration
- *Training Exercise:* Migrate the todo feature from service store to NgRx.
- *Project Application:* Migrate all task-related state in TaskFlow to NgRx. Verify: add, edit, delete, move tasks. Visually check with Chrome DevTools.

##### Lesson 14.10.3: Full Migration — Boards & UI Features
- *Objective:* Complete the migration of boards and UI state to NgRx.
- *Branch Name:* `lesson-14103-migrate-boards-ui`
- *Topics:*
  - Define `BoardsFeature` with `createFeature()` + entity adapter
  - Define `UiFeature` for UI state (filters, selection, modals)
  - Migrate board components to use the store
  - Migrate UI components to use signalStore for local UI state
  - Final verification: full TaskFlow app with NgRx
  - DevTools verification: trace a complete user flow
- *Training Exercise:* Migrate the UI feature (filter, sort) to signalStore.
- *Project Application:* Complete NgRx migration for TaskFlow. Open NgRx DevTools. Trace: load board → add task → move task → delete task → filter tasks. Verify every action and state change.

---

### Phase 14 Summary

After completing Phase 14, the student will:
1. **Understand** why global state management is needed (from Lesson 5.6 problems)
2. **Build** NgRx Store with `createFeature()`, actions, reducers, selectors
3. **Handle** side effects with Effects and HTTP integration
4. **Manage** collections with @ngrx/entity
5. **Use** @ngrx/signals `signalStore()` for reactive, signal-based stores
6. **Configure** the store with runtime config and middleware
7. **Debug** with NgRx DevTools: time-travel, action inspection, state diffing
8. **Test** every layer: reducers, selectors, effects, signalStore, integration
9. **Migrate** a real application from service store to NgRx (TaskFlow)
---

## Phase Completion Criteria

Before marking this phase as complete:

- [ ] All lessons implemented and merged to `main`
- [ ] All training exercises completed
- [ ] All project applications integrated into TaskFlow
- [ ] Code reviewed and follows best practices
- [ ] Tests pass (if Testing Phase already completed)

---

## Key Takeaways

After completing this phase, the learner should understand:

- Centralized state management with predictable data flow, from NgRx Store fundamentals to @ngrx/signals (signalStore), Entity, DevTools, debugging, and comprehensive testing.
- How this phase builds on earlier phases and prepares the ground for the next ones in the Angular learning path
- The Angular 22 best practices for this topic: standalone components, signals, strict TypeScript, and production-ready patterns
