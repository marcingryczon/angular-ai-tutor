# Phase 2: Component Communication
*Focus: How components talk to each other.*

## Git Branch: `lesson-2.<n>-*`
## Training dir: `src/app/phase-2-communication/2.<n>-<slug>/` · Lesson notes: `lessons/phase-2-communication/2.<n>-<slug>.md`

> Still no `signal()` / `computed()` / `effect()` for state (Phase 4). `input()`, `output()`, and `model()` are the standard component APIs and are used here.

---

### Lesson 2.1: `input()` — Modern Inputs
- *Objective:* Typed inputs with default values, required inputs, and transforms.
- *Branch Name:* `lesson-2.1-inputs`
- *Reference:* `agent-skills/angular-skills/references/inputs.md`
- *Topics:*
  - `input<T>()` vs `input.required<T>()` — typed inputs replacing `@Input()`
  - Input defaults: `input<T>(defaultValue)`
  - Aliased inputs: `input(value, { alias })`
  - Input transforms: `input(value, { transform })` (e.g. `booleanAttribute`, `numberAttribute`)
  - Reading an input: it is a `Signal<T>` — call it (`title()`) in the template and in code
- *Training Exercise:* Create a child component that receives a name input and greets it
- *Project Application:* Pass data down the tree: `Board` → `Column` (`column`, `tasks`) → `TaskCard` (`task`). Remove the hardcoded arrays from `Column` and `TaskCard`.

---

### Lesson 2.2: `output()` — Modern Outputs
- *Objective:* Replace `@Output()` + `EventEmitter` with the `output()` API.
- *Branch Name:* `lesson-2.2-outputs`
- *Reference:* `agent-skills/angular-skills/references/outputs.md`
- *Topics:*
  - `output<T>()` — typed outputs; `.emit(value)`
  - Binding to outputs in the parent: `(deleted)="onDeleted($event)"`
  - Typed event payloads; `output<void>()` for signal-only events
  - Bubbling an event through an intermediate component (Column re-emits TaskCard events)
- *Training Exercise:* Create a button component that emits a click event with metadata
- *Project Application:* `TaskCard` emits `edit` / `delete` events; `Column` emits `quickAdd(title)` from its quick-add row on Enter; `Board` handles all of them by mutating its `tasks` array

---

### Lesson 2.3: `model()` — Two-Way Binding
- *Objective:* Component-level two-way binding with `model()`.
- *Branch Name:* `lesson-2.3-model`
- *Reference:* `agent-skills/angular-skills/references/inputs.md`
- *Topics:*
  - `model<T>()` — a writable input that also emits; banana-in-a-box `[(value)]`
  - When to use `model()` vs `input()` + `output()`
  - Synchronized parent-child state
- *Training Exercise:* Build a toggle component synced with parent via `model()`
- *Project Application:* Extract the topbar role `<select>` into `shared/role-switch.ts` exposing `role = model<Role>('member')`; `App` binds `[(role)]="role"` (a plain property until Phase 3 introduces `SessionService`)
- *Note for Phase 3:* `[(x)]` desugars to `[x]` + `(xChange)`, so the target must be assignable. A plain property on a service is not — when the role moves into `SessionService` in lesson 3.2 you either expose a getter/setter pair on `App` or split the binding into `[role]` + `(roleChange)`. From Phase 4 on the property is a signal and `[(role)]="session.role"` works directly.

---

### Lesson 2.4: Content Projection
- *Objective:* `<ng-content>`, multi-slot projection, `ngProjectAs`.
- *Branch Name:* `lesson-2.4-content-projection`
- *Topics:*
  - Single-slot projection: `<ng-content>`
  - Multi-slot projection: `<ng-content select="[slot]">`
  - `ngProjectAs` — projecting with a virtual selector
  - Default content inside `<ng-content>…</ng-content>`
- *Training Exercise:* Create a card wrapper that projects custom content
- *Project Application:* Build `shared/modal.ts` per spec §5.6: backdrop + panel + header (`title` input, `closed` output) with the body projected via `<ng-content>`. Parent controls visibility with `@if`. Keyboard/focus behaviors come in Phase 12.

---

### Lesson 2.5: Native Drag & Drop Across Components
- *Objective:* Combine DOM events, `output()`, and parent state to move tasks between columns.
- *Branch Name:* `lesson-2.5-drag-and-drop`
- *Reference:* `agent-skills/angular-skills/references/host-elements.md`
- *Topics:*
  - HTML5 DnD events: `dragstart`, `dragover` (+ `preventDefault()`), `dragleave`, `drop`
  - `DataTransfer` — carrying the task id
  - `[attr.draggable]` / `draggable="true"` on the card
  - Who owns the move: the child reports (`taskMoved` output), the parent decides (mutates the list)
  - Visual feedback: `.column--drop` class while a card hovers a column
  - Why by hand and not `@angular/cdk/drag-drop`: the point of this lesson is who owns state across a component boundary, not the drop animation. TaskFlow deliberately ships no UI library — see "Out of Scope" in `agent-skills/course.md`.
- *Training Exercise:* Two lists; drag items between them and log the transfer
- *Project Application:* `TaskCard` sets the task id on `dragstart`; `Column` handles `dragover`/`drop`, toggles `column--drop`, and emits `taskMoved({ taskId, columnId })`; `Board` moves the task
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

- Pass data down with `input()` / `input.required()` and events up with `output()`
- Implement two-way binding with `model()` and explain when it beats `input()` + `output()`
- Project content into reusable wrappers with single- and multi-slot `<ng-content>`
- Wire native drag & drop across a component tree, keeping state ownership in the parent
- Choose the right communication pattern for a given component relationship
