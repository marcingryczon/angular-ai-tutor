# Phase 2: Component Communication
*Focus: How components talk to each other.*

## Git Branch: `lesson-2*-*`

---

### Lesson 2.1: `input()` - Modern Inputs
- *Objective:* Typed inputs with default values and transforms.
- *Branch Name:* `lesson-21-inputs`
- *Topics:*
  - `input<T>()` function: typed inputs replacing `@Input()`
  - Input defaults: `input<T>(defaultValue)`
  - Aliased inputs: `input('alias')`
  - Input transforms: `input({ transform })`
- *Training Exercise:* Create a child component that receives a name input and greets it
- *Project Application:* Pass task data from Board to Column to TaskCard via inputs

---

### Lesson 2.2: `output()` - Modern Outputs
- *Objective:* Replace `EventEmitter` with the `output()` API.
- *Branch Name:* `lesson-22-outputs`
- *Topics:*
  - `output<T>()` function: typed outputs replacing `@Output()` + `EventEmitter`
  - Connecting outputs to parent handlers
  - Typed event payloads
- *Training Exercise:* Create a button component that emits a click event with metadata
- *Project Application:* TaskCard emits delete/edit events to parent Column

---

### Lesson 2.3: `model()` - Two-Way Binding
- *Objective:* Component-level v-model pattern with `model()`.
- *Branch Name:* `lesson-23-model`
- *Topics:*
  - `model<T>()` — two-way signal binding
  - Banana-in-a-box syntax: `[()]`
  - Synchronized parent-child state
- *Training Exercise:* Build a toggle component synced with parent via model
- *Project Application:* Sync selected task between Board and TaskCard via model

---

### Lesson 2.4: Content Projection
- *Objective:* `<ng-content>`, multi-slot projection, `ngProjectAs`.
- *Branch Name:* `lesson-24-content-projection`
- *Topics:*
  - Single-slot projection: `<ng-content>`
  - Multi-slot projection: `<ng-content select="...">`
  - `ngProjectAs` — projecting with a virtual selector
- *Training Exercise:* Create a card wrapper that projects custom content
- *Project Application:* Wrap Column component with projected header/footer
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

- Pass data down with `input()` and events up with `output()` using typed signals
- Implement two-way binding with `model()` signal for controlled components
- Share state between siblings via a service or lifted state (prop drilling vs. service)
- Use `linkedSignal()` for parent-child signal synchronization
- Choose the right communication pattern for a given component relationship
