# Phase 5: RxJS, HTTP & Async Patterns
*Focus: Streams, HTTP, and the RxJS + Signals synergy.*

## Git Branch: `phase-5-rxjs` — one branch per phase, one commit per lesson
## Training dir: `src/app/phase-5-rxjs/5.<n>-<slug>/` · Lesson notes: `lessons/phase-5-rxjs/5.<n>-<slug>.md`

> TaskFlow has no backend. HTTP lessons use static JSON files served from `projects/taskflow/public/` (see `taskflow-spec.md` §7.3) so every learner sees the same data.

---

> **Lessons 5.1–5.2 are the prerequisite track.** They teach RxJS, not Angular. Take the self-check
> in `course/prerequisites.md`: if you can answer it, do only the *Project Application* of each (the
> event bus and the debounced search stay in TaskFlow) and jump to 5.3.

### Lesson 5.1: RxJS Fundamentals
- *Objective:* Observables, Subjects, subscriptions, unsubscription.
- *Commit:* `lesson-5.1-rxjs-basics`
- *Topics:*
  - Observable vs Promise: lazy, cancellable, multi-value
  - `Subject` / `BehaviorSubject`: multicasting, manual emission, current value
  - Subscription lifecycle and memory leaks
  - Signals vs Observables: state vs events over time — when each is the right tool
- *Training Exercise:* Create an Observable, subscribe to it, emit values via Subject
- *Project Application:* Add a `Subject<TaskEvent>` "event bus" to `TaskService` that emits `created` / `moved` / `deleted` events (consumed by the toast in 5.5)

---

### Lesson 5.2: Essential Operators
- *Objective:* `map`, `filter`, `switchMap`, `debounceTime`, `distinctUntilChanged`, `catchError`.
- *Commit:* `lesson-5.2-rxjs-operators`
- *Topics:*
  - Transformation: `map`, `filter`, `tap`
  - Flattening: `switchMap` vs `mergeMap` vs `concatMap` vs `exhaustMap` — cancellation semantics
  - Timing: `debounceTime`, `distinctUntilChanged`
  - Combining: `combineLatest`, `forkJoin`
  - Errors: `catchError`, `retry`
- *Training Exercise:* Chain operators to transform and handle an HTTP-like stream
- *Project Application:* Debounce the filter-bar search input (300 ms, distinct) before it reaches the `search` signal

---

### Lesson 5.3: `HttpClient`
- *Objective:* Fetch typed data over HTTP the Angular way.
- *Commit:* `lesson-5.3-http-client`
- *Topics:*
  - `provideHttpClient()` in `app.config.ts`; `withFetch()`
  - `HttpClient.get<T>()` returns a cold Observable — nothing happens until subscribed
  - Typed responses and DTO → domain mapping with `map`
  - Interceptors: `withInterceptors([fn])` — logging, headers, error mapping
  - Error handling: `HttpErrorResponse`, `catchError`
- *Training Exercise:* Load `public/mock/users.json`, map it to a typed model, add a logging interceptor
- *Project Application:* Move the seed data to `projects/taskflow/public/seed.json` and load it with `HttpClient` (due dates stored as `dueInDays` offsets, resolved at seed time). **This is a deliberate intermediate step:** the fetch lives next to `TaskFlowDb` for now, and lesson 5.6 moves it into the store as an `httpResource()`. `TaskFlowDb` keeps only the pure `seed(file)` expansion and the storage access.

---

### Lesson 5.4: `toSignal()` / `toObservable()` — Bridges
- *Objective:* Convert between Observables and Signals.
- *Commit:* `lesson-5.4-to-signal`
- *Topics:*
  - `toSignal(obs$, { initialValue })` / `{ requireSync: true }` — subscribe once, read synchronously
  - `toObservable(signal)` — when an operator pipeline needs a signal as input
  - Where the subscription lives (injection context, `DestroyRef`)
- *Training Exercise:* Convert an Observable to a Signal and use it in a component
- *Project Application:* Implement the debounced search from 5.2 as `toObservable(searchInput)` → `debounceTime` → `toSignal()`

---

### Lesson 5.5: `takeUntilDestroyed()` & `DestroyRef`
- *Objective:* Automatic subscription cleanup, prevent memory leaks.
- *Commit:* `lesson-5.5-takeuntil-destroyed`
- *Topics:*
  - `takeUntilDestroyed()` — auto-unsubscribe on destroy (needs injection context or an explicit `DestroyRef`)
  - `DestroyRef.onDestroy()` — manual cleanup registration
  - When you still need manual unsubscribe (services, long-lived subscriptions)
- *Training Exercise:* Subscribe to an Observable with `takeUntilDestroyed()`; prove the leak without it
- *Project Application:* `Board` subscribes to the `TaskService` event bus with `takeUntilDestroyed()` to show a short "Task moved" notice

---

### Lesson 5.6: `resource()` & `httpResource()`
- *Objective:* Declarative async data with built-in loading / error states.
- *Commit:* `lesson-5.6-resource-api`
- *Reference:* `agent-skills/angular-skills/references/resource.md`
- *Topics:*
  - `resource({ params, loader })` — signal-driven async data
  - `httpResource(() => url)` — the HTTP-specialised resource
  - `ResourceRef` states: `value()`, `status()`, `error()`, `isLoading()`, `reload()`
  - Resource vs `HttpClient` + `toSignal()`: when each fits
- *Training Exercise:* Fetch data using `httpResource()`, render loading and error states
- *Project Application:* Replace the manual `HttpClient` seed load with `httpResource()`; show a loading state on first run
- *Where the resource lives:* put the `httpResource()` in the **store**, not inside `TaskFlowDb`. The db stays a synchronous, SSR-safe wrapper around storage (`load()` returns `undefined` when nothing is persisted or when there is no browser) and only knows how to *expand* a `SeedFile` into the dataset. Phase 10 depends on this split: the server has no `localStorage`, so the seed resource is the one thing both platforms share.

---

### Lesson 5.7: Service-Based State Store Pattern
- *Objective:* Build a centralized signal store — the foundation for understanding why NgRx exists.
- *Commit:* `lesson-5.7-service-store`
- *Topics:*
  - Why centralized state: prop drilling and scattered state
  - Store = `@Injectable` service with private `signal()` state, public `computed()` selectors, and action methods
  - State interface: the shape of application state
  - Loading / error state in the store
  - Persistence effect in the store (moved from 4.3)
  - When a service store is enough vs when you need NgRx (Phase 14)
- *Training Exercise:* Build a minimal `CounterStore` with state, selectors, and action methods; connect two unrelated components
- *Project Application:* Create `core/task.store.ts` and `core/board.store.ts` per spec §8. Components read only store selectors and call store actions. `TaskService` / `BoardService` become thin data-access layers over `TaskFlowDb`.
- *Heads-up for Phase 10:* it is tempting to seed the store from `localStorage` **synchronously in the constructor**. It works now and breaks in Phase 10 — the server renders the seed while the browser would render stored data, which is a hydration mismatch. Lesson 10.2 refactors it: start from the same empty state on both platforms and swap in the persisted data inside `afterNextRender()`.
---

## Phase Completion Criteria

Before marking this phase as complete:

- [ ] All lessons implemented and merged to `main`
- [ ] All training exercises completed
- [ ] All project applications integrated into TaskFlow
- [ ] Code reviewed and follows best practices
- [ ] `npm run verify 5` passes — the milestone in `taskflow-spec.md` §10 is reached
- [ ] Tests pass (if Testing Phase already completed)

---

## Key Takeaways

After completing this phase, the learner should be able to:

- Explain Observable vs Promise vs Signal and pick the right tool
- Compose streams with `map`, `switchMap`, `debounceTime`, `combineLatest` and explain `switchMap` vs `mergeMap` vs `concatMap` vs `exhaustMap`
- Fetch typed data with `HttpClient`, add an interceptor, and handle errors
- Bridge both ways with `toSignal()` / `toObservable()` and clean up with `takeUntilDestroyed()`
- Use `resource()` / `httpResource()` for declarative async data with loading and error states
- Implement a signal-based service store with selectors and action methods
