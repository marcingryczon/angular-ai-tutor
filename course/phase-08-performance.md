# Phase 8: Change Detection & Performance
*Focus: Rendering efficiency and optimization.*

## Git Branch: `lesson-8*-*`

---

### Lesson 8.1: Change Detection Internals
- *Objective:* How CD works, dirty checking, unidirectional flow.
- *Branch Name:* `lesson-81-cd-internals`
- *Topics:*
  - Change detection cycle: how Angular checks for updates
  - Zone.js: how Angular knows when to run CD
  - Unidirectional flow: parent → child only
- *Training Exercise:* Trace CD cycles using `ChangeDetectorRef`
- *Project Application:* Understand CD behavior in TaskFlow component tree

---

### Lesson 8.2: `OnPush` Strategy
- *Objective:* Triggering updates, the OnPush mental model.
- *Branch Name:* `lesson-82-onpush`
- *Topics:*
  - `changeDetection: ChangeDetectionStrategy.OnPush`
  - When OnPush components update: input change, event, async pipe, signal
  - Migrating from Default to OnPush
- *Training Exercise:* Convert a component to OnPush, verify updates still work
- *Project Application:* Migrate TaskFlow components to OnPush

---

### Lesson 8.3: Zoneless Preparation
- *Objective:* Removing NgZone dependencies, zone-free APIs.
- *Branch Name:* `lesson-83-zoneless-prep`
- *Topics:*
  - What is Zone.js and why remove it
  - Identifying NgZone-dependent APIs
  - Zoneless-compatible alternatives
- *Training Exercise:* Audit a component for NgZone dependencies
- *Project Application:* Audit TaskFlow for zoneless compatibility

---

### Lesson 8.4: Performance Profiling
- *Objective:* Angular DevTools, change detection timing.
- *Branch Name:* `lesson-84-profiling`
- *Topics:*
  - Angular DevTools extension
  - Measuring change detection performance
  - Identifying bottlenecks and excessive renders
- *Training Exercise:* Profile a component and identify CD bottlenecks
- *Project Application:* Profile TaskFlow with large boards and optimize

---

### Lesson 8.5: Rendering Optimization
- *Objective:* `@for` track, pure pipes, avoiding unnecessary renders.
- *Branch Name:* `lesson-85-rendering-opts`
- *Topics:*
  - `@for` track expression — why it matters for performance
  - Pure pipes as memoization
  - Avoiding object/function creation in templates
- *Training Exercise:* Optimize a list with proper track expression
- *Project Application:* Optimize TaskFlow task list rendering with proper tracking