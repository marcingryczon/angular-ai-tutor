# Phase 8: Change Detection & Performance
*Focus: Rendering efficiency and optimization in a zoneless app.*

## Git Branch: `lesson-8.<n>-*`
## Training dir: `src/app/phase-8-performance/8.<n>-<slug>/` · Lesson notes: `lessons/phase-8-performance/8.<n>-<slug>.md`

---

### Lesson 8.1: Change Detection Internals (Zoneless)
- *Objective:* How Angular decides *what* to re-check and *when*, without Zone.js.
- *Branch Name:* `lesson-8.1-cd-internals`
- *Topics:*
  - The change detection pass: top-down, unidirectional, template bindings compared
  - What schedules a pass in a zoneless app: signal writes read by a template, template event listeners, `markForCheck()`, `async` pipe, `ComponentRef.setInput()`
  - What does **not** schedule a pass: a `setTimeout` mutating a plain property — the classic zoneless bug
  - `ChangeDetectorRef`: `markForCheck()`, `detectChanges()`, `detach()` — and why you rarely need them with signals
  - `ExpressionChangedAfterItHasBeenCheckedError` explained
  - **One pass only sees the net change:** a property binding writes to the DOM when the bound value differs from what Angular wrote last time. If the user types into `<input [value]="draft()">` and submits in the *same* cycle, `draft` goes `'' → 'text' → ''` before any check runs, Angular sees no net change, and the field keeps the typed text. Either let the two events land in different cycles or reset the element directly through `viewChild()` — which is what TaskFlow's quick-add does.
- *Training Exercise:* Mutate a plain property from `setTimeout` (no update) vs a signal (update); add `console.log` in a template getter to count checks; then reproduce the `[value]` case above and fix it
- *Project Application:* Audit TaskFlow for any state that is not a signal and could silently go stale

---

### Lesson 8.2: `OnPush` Strategy
- *Objective:* Skip untouched subtrees.
- *Branch Name:* `lesson-8.2-onpush`
- *Topics:*
  - `changeDetection: ChangeDetectionStrategy.OnPush`
  - When an OnPush view is checked: input reference change, event in the view, signal read in the template changed, `markForCheck()`
  - Why OnPush + signals is the default recommendation in Angular 20+ (and the CLI schematic option)
  - Immutability as the contract that makes OnPush safe
- *Training Exercise:* Convert a component to OnPush, break it with a mutated input, fix it with a new reference
- *Project Application:* Set `OnPush` on every TaskFlow component; set `changeDetection: OnPush` as the schematic default in `angular.json`

---

### Lesson 8.3: Zone.js — Legacy & Interop
- *Objective:* Understand what Zone.js did, how to recognise zone-era code, and how to interoperate.
- *Branch Name:* `lesson-8.3-zone-legacy`
- *Topics:*
  - What Zone.js is: monkey-patching async browser APIs to trigger CD after *every* task
  - `provideZoneChangeDetection()` — opting back in for legacy libraries; the cost
  - `NgZone.run()` / `runOutsideAngular()` — reading old code
  - Migrating a zone app to zoneless: the checklist (`ng generate @angular/core:...` migrations, finding non-signal state)
- *Training Exercise:* Toggle `provideZoneChangeDetection()` on the training app and observe the `setTimeout` case from 8.1 start working — then explain why that is *worse*
- *Project Application:* Confirm TaskFlow has no `NgZone` usage; document the zoneless guarantee in the project README

---

### Lesson 8.4: Performance Profiling
- *Objective:* Angular DevTools, measuring change detection.
- *Branch Name:* `lesson-8.4-profiling`
- *Topics:*
  - Angular DevTools: component tree, signal graph, profiler
  - Measuring CD passes and their duration
  - Identifying excessive renders and expensive template expressions
- *Training Exercise:* Profile a component and identify CD bottlenecks
- *Project Application:* Seed 500 tasks temporarily, profile the board, and record the findings

---

### Lesson 8.5: Rendering Optimization & `@defer`
- *Objective:* `@for` track, pure pipes, deferred blocks.
- *Branch Name:* `lesson-8.5-rendering-opts`
- *Topics:*
  - `@for` `track` — identity vs index and what a wrong track costs (DOM churn)
  - Avoiding object/function creation in templates; pure pipes as memoization
  - `@defer` — block-level lazy loading; triggers `on viewport`, `on idle`, `on interaction`, `on timer`; `@placeholder`, `@loading`, `@error`
  - `NgOptimizedImage` for images (awareness)
- *Training Exercise:* Optimize a list with a proper track expression; defer-load a heavy component on viewport entry
- *Project Application:* Verify every `@for` in TaskFlow tracks by `id`; wrap the task modal contents in `@defer (on interaction)` where it makes sense
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

After completing this phase, the learner should be able to:

- Explain what schedules change detection in a zoneless app and diagnose "my view didn't update"
- Apply `OnPush` everywhere and explain the immutability contract behind it
- Describe what Zone.js did, read `NgZone` code, and explain why zoneless is the default now
- Profile rendering with Angular DevTools and find hot templates
- Optimize lists with `track`, avoid template allocations, and defer heavy UI with `@defer`
