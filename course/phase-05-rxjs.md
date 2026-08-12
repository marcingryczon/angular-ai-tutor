# Phase 5: RxJS & Async Patterns
*Focus: Streaming data and the RxJS + Signals synergy.*

## Git Branch: `lesson-5*-*`

---

### Lesson 5.1: RxJS Fundamentals
- *Objective:* Observables, Subjects, subscriptions, unsubscription.
- *Branch Name:* `lesson-51-rxjs-basics`
- *Topics:*
  - Observable vs Promise: lazy, async streams
  - Subject: multicasting, manual emission
  - Subscription lifecycle and memory leaks
- *Training Exercise:* Create an Observable, subscribe to it, emit values via Subject
- *Project Application:* Simulate API responses with Observables in TaskFlow services

---

### Lesson 5.2: Essential Operators
- *Objective:* `map`, `filter`, `switchMap`, `takeUntil`, `catchError`.
- *Branch Name:* `lesson-52-rxjs-operators`
- *Topics:*
  - `map` — transform emitted values
  - `filter` — conditionally pass values
  - `switchMap` — flatten nested observables with cancellation
  - `catchError` — handle errors in the stream
- *Training Exercise:* Chain operators to transform and handle an HTTP-like stream
- *Project Application:* Transform and handle task API responses in TaskFlow

---

### Lesson 5.3: `toSignal()` - Bridges
- *Objective:* Convert Observables to Signals for synchronous access.
- *Branch Name:* `lesson-53-to-signal`
- *Topics:*
  - `toSignal(obs, { requireSync, initialValue })` — bridge Observable to Signal
  - Why bridge: synchronous access to async data in templates and effects
  - Alias signals: `aliasSignal()` for computed aliases
- *Training Exercise:* Convert an Observable to a Signal and use it in a component
- *Project Application:* Bridge TaskFlow service Observables to Signals for template use

---

### Lesson 5.4: `takeUntilDestroyed()`
- *Objective:* Automatic subscription cleanup, prevent memory leaks.
- *Branch Name:* `lesson-54-takeuntil-destroyed`
- *Topics:*
  - `takeUntilDestroyed()` — auto-unsubscribe on component destroy
  - `DestroyRef` — manual cleanup registration
  - Why manual unsubscribe is no longer needed
- *Training Exercise:* Subscribe to an Observable with `takeUntilDestroyed()`
- *Project Application:* Safe subscriptions in TaskFlow components

---

### Lesson 5.5: Resource API
- *Objective:* `resource()` for data fetching, the modern async pattern.
- *Branch Name:* `lesson-55-resource-api`
- *Topics:*
  - `resource()` — declarative data fetching API
  - `ResourceRef` states: loading, resolved, expired, errored
  - Dependencies between resources
- *Training Exercise:* Fetch data using `resource()`, handle loading/error states
- *Project Application:* Load board and task data declaratively in TaskFlow

---

### Lesson 5.6: Service-Based State Store Pattern
- *Objective:* Build a centralized state store using `injectable()` services, Signals, and RxJS — the foundation for understanding why NgRx exists.
- *Branch Name:* `lesson-56-service-store`
- *Topics:*
  - Why centralized state: the problem of "prop drilling" and scattered state
  - Service Store pattern: singleton service as a state container
  - State interface: defining the shape of application state
  - Writable signals as state backend in services
  - Selectors as computed signals derived from state
  - Actions as service methods that mutate state (addTask, updateTask, deleteTask)
  - RxJS Subject as a command bus (prelude to NgRx actions)
  - Loading/error states in the store
  - When service store is enough vs when you need NgRx
- *Training Exercise:* Build a minimal `CounterStore` service with state, selectors, and action methods. Connect two unrelated components to it.
- *Project Application:* Create `TaskStore` and `BoardStore` services for TaskFlow. Move all imperative component state into centralized stores. Components read from store selectors and dispatch via store action methods. This is the "before NgRx" baseline.