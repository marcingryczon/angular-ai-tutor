# Phase 4: Signals & Reactive State
*Focus: Modern reactive programming with Signals.*

## Git Branch: `lesson-4*-*`

---

### Lesson 4.1: `signal()` - Writable Signals
- *Objective:* Create and manage reactive state with `signal()`.
- *Branch Name:* `lesson-41-writable-signals`
- *Topics:*
  - `signal<T>(initialValue)` — creating writable signals
  - `.set()` vs `.update()` — replacing vs transforming signal state
  - Why signals: fine-grained reactivity without Zone.js
- *Training Exercise:* Build a reactive counter with `signal()`, `set()`, `update()`
- *Project Application:* Convert TaskFlow task list to a writable signal

---

### Lesson 4.2: `computed()` - Derived State
- *Objective:* Automatic dependency tracking with computed signals.
- *Branch Name:* `lesson-42-computed-signals`
- *Topics:*
  - `computed()` — derived signals that auto-track dependencies
  - Chaining computed signals
  - Performance: computed signals are lazy and memoized
- *Training Exercise:* Compute a filtered list and aggregated count from a signal
- *Project Application:* Compute task counts per column, filtered task views in TaskFlow

---

### Lesson 4.3: `effect()` - Side Effects
- *Objective:* React to signal changes, manage cleanup.
- *Branch Name:* `lesson-43-effects`
- *Topics:*
  - `effect()` — running side effects when signals change
  - Cleanup functions in effects
  - When to use effects vs computed vs template unwrapping
- *Training Exercise:* Log signal changes to console, clean up interval in effect
- *Project Application:* Log task state changes, track board modifications in TaskFlow

---

### Lesson 4.4: Linked Signals
- *Objective:* `linkedSignal()` pattern for parent-child signal synchronization.
- *Branch Name:* `lesson-44-linked-signals`
- *Topics:*
  - `linkedSignal()` — controlled vs uncontrolled component pattern
  - Syncing child signal with parent signal
  - When to use linked signals vs model()
- *Training Exercise:* Build a controlled input component with linkedSignal
- *Project Application:* Sync selected/edited task between Board and TaskCard

---

### Lesson 4.5: Signals in Templates
- *Objective:* Auto-unwrapping behavior, template reactivity.
- *Branch Name:* `lesson-45-signals-templates`
- *Topics:*
  - Automatic unwrapping: signals don't need `.()` in templates
  - Template reactivity: how Angular triggers re-render on signal change
  - Signal unwrapping in property bindings, interpolations, and directives
- *Training Exercise:* Display signal values in template, observe auto-updates
- *Project Application:* Display reactive task data in TaskFlow templates