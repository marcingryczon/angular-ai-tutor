# Phase 4: Signals & Reactive State
*Focus: Modern reactive programming with Signals.*

## Git Branch: `phase-4-signals` — one branch per phase, one commit per lesson
## Training dir: `src/app/phase-4-signals/4.<n>-<slug>/` · Lesson notes: `lessons/phase-4-signals/4.<n>-<slug>.md`

> From this phase on, component and service state is held in signals.

---

### Lesson 4.1: `signal()` — Writable Signals
- *Objective:* Create and manage reactive state with `signal()`.
- *Commit:* `lesson-4.1-writable-signals`
- *Reference:* `agent-skills/angular-skills/references/signals-overview.md`
- *Topics:*
  - `signal<T>(initialValue)` — creating writable signals; `WritableSignal` vs `Signal`
  - `.set()` vs `.update()` — replacing vs transforming state; immutability of arrays/objects
  - Why signals in a zoneless app: a signal write is what schedules change detection
  - `signal.asReadonly()` — exposing read-only state from a service
- *Training Exercise:* Build a reactive counter with `signal()`, `set()`, `update()`
- *Project Application:* Convert `TaskService` / `BoardService` / `SessionService` state to signals with read-only public views; components read `tasks()` instead of arrays

---

### Lesson 4.2: `computed()` — Derived State
- *Objective:* Automatic dependency tracking with computed signals.
- *Commit:* `lesson-4.2-computed-signals`
- *Reference:* `agent-skills/angular-skills/references/signals-overview.md`
- *Topics:*
  - `computed()` — derived signals that auto-track dependencies
  - Chaining computed signals; `equal` option
  - Performance: computed signals are lazy and memoized
  - Anti-pattern: doing filtering in the template instead of a `computed()`
- *Training Exercise:* Compute a filtered list and aggregated count from a signal
- *Project Application:* Implement the filter bar (spec §5.2): `search`, `priorityFilter`, `assigneeFilter` signals → `filteredTasks` computed → per-column task lists and the `{{ n }} task(s)` count

---

### Lesson 4.3: `effect()` — Side Effects
- *Objective:* React to signal changes, manage cleanup, know when *not* to use effects.
- *Commit:* `lesson-4.3-effects`
- *Reference:* `agent-skills/angular-skills/references/effects.md`
- *Topics:*
  - `effect()` — runs when tracked signals change; runs in an injection context
  - `onCleanup` callback; `untracked()` to read without tracking
  - Effects vs `computed()` vs template unwrapping — effects are for the outside world (storage, logging, DOM), never for deriving state
  - Writing to signals inside effects: allowed, but usually a smell
- *Training Exercise:* Log signal changes to console; clean up an interval in an effect
- *Project Application:* Persist state with an effect: whenever `tasks()` / `boards()` change, `TaskFlowDb.save()` is called (replaces manual `save()` calls in services)

---

### Lesson 4.4: Linked Signals
- *Objective:* `linkedSignal()` — writable state that resets when its source changes.
- *Commit:* `lesson-4.4-linked-signals`
- *Reference:* `agent-skills/angular-skills/references/linked-signal.md`
- *Topics:*
  - `linkedSignal(() => source())` — a writable signal with a computed default. It only resets when the computation **reads a signal**: `linkedSignal(() => '')` has no dependency and therefore never resets.
  - `linkedSignal({ source, computation })` with access to the previous value — the form to use when the default is a constant but the reset must follow an input
  - When to use `linkedSignal()` vs `model()` vs `computed()`
- *Training Exercise:* Build a "selected option" that resets when the option list changes
- *Project Application:* `Column` gets a quick-add `draft` that clears whenever the component is bound to another column — `linkedSignal({ source: this.column, computation: () => '' })`; `Board` keeps `selectedTaskId` as a `linkedSignal({ source: filteredTasks, computation })` that keeps the previous id while it is still in the list and resets to `undefined` when it is filtered out

---

### Lesson 4.5: Signals in Templates
- *Objective:* Template reactivity and the reading rules.
- *Commit:* `lesson-4.5-signals-templates`
- *Reference:* `agent-skills/angular-skills/references/signals-overview.md`
- *Topics:*
  - Calling signals in templates: `{{ count() }}`, `[prop]="value()"`, `@if (item())`
  - `@let` to read a signal once per template
  - How a signal read in a template registers the view as a consumer — and why that is what makes zoneless work
  - Signal inputs, `model()`, and `viewChild()` are all signals — read them the same way
- *Training Exercise:* Display signal values in template, observe fine-grained updates
- *Project Application:* Audit all TaskFlow templates: no array/object copies, all derived data via `computed()`, `@let` where a signal is read more than twice
---

## Phase Completion Criteria

Before marking this phase as complete:

- [ ] All lessons implemented and merged to `main`
- [ ] All training exercises completed
- [ ] All project applications integrated into TaskFlow
- [ ] Code reviewed and follows best practices
- [ ] `npm run verify 4` passes — the milestone in `taskflow-spec.md` §10 is reached
- [ ] Tests pass (if Testing Phase already completed)

---

## Key Takeaways

After completing this phase, the learner should be able to:

- Create writable signals with `signal()` and update them immutably with `.set()` / `.update()`
- Derive state with `computed()` and explain lazy memoization
- Run side effects with `effect()`, use `onCleanup` / `untracked()`, and explain why effects must not derive state
- Reset dependent state with `linkedSignal()` and choose it over `model()` or `computed()` correctly
- Explain how signal reads in templates drive change detection in a zoneless app
