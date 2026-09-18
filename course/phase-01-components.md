# Phase 1: Standalone Components & Templates
*Focus: Building the foundation with modern component architecture.*

## Git Branch: `lesson-1.<n>-*`
## Training dir: `src/app/phase-1-components/1.<n>-<slug>/` · Lesson notes: `lessons/phase-1-components/1.<n>-<slug>.md`

> **Signals note.** Before Phase 4 we do **not** create component state with `signal()`, `computed()`, or `effect()` — plain class properties only. Angular's component APIs that happen to be signal-based (`input()`, `output()`, `model()`, `viewChild()`) are still used, because they are the standard way to write components in Angular 22.

---

### Lesson 1.1: Standalone Component Basics
- *Objective:* Master `@Component`, metadata, bootstrap, and the standalone vs NgModule paradigm.
- *Branch Name:* `lesson-1.1-standalone-basics`
- *Reference:* `agent-skills/angular-skills/references/components.md`
- *Topics:*
  - `@Component()` decorator: `selector`, `templateUrl`, `styleUrl`, `imports`
  - Component file structure: behavior in `.ts`, template in `.html`, styles in `.scss` — never inline
  - Standalone is the default: why NgModules are legacy and what `imports: []` on a component means
  - Bootstrap process: `bootstrapApplication()` vs `NgModule.bootstrap`
  - Component naming in Angular 20+ style guide: class `Board`, files `board.ts` / `board.html` / `board.scss` (no `.component` suffix)
  - `protected` for template-only members
- *Training Exercise:* Create a minimal standalone component, bootstrap it manually
- *Project Application:* Create the TaskFlow folder layout from `taskflow-spec.md` §8 (`core/`, `features/`, `shared/`) and the first component: a static `features/board/board.ts` shell rendered by `App`. Replace the CLI placeholder in `app.html` with the topbar markup from spec §2 (static for now).

---

### Lesson 1.2: Template Expressions & Property Binding
- *Objective:* Interpolation, property binding, event binding, and `@let` aliasing.
- *Branch Name:* `lesson-1.2-template-bindings`
- *Topics:*
  - Interpolation: `{{ value }}`
  - Property binding: `[prop]="value"`, attribute/class/style bindings `[class.x]`, `[style.width.px]`, `[attr.aria-label]`
  - Event binding: `(event)="handler($event)"`, key modifiers like `(keydown.enter)`
  - Two-way binding is deferred: `[(ngModel)]` needs `FormsModule` (Phase 6); `model()` is Phase 2.3
  - `@let` — template variable aliasing to reduce repetition
- *Training Exercise:* Build a counter component with increment/decrement buttons and display
- *Project Application:* Add a dynamic task count to the TaskFlow board header from a hardcoded `tasks: Task[]` array

---

### Lesson 1.3: Modern Control Flow
- *Objective:* Use `@if`, `@else`, `@for`, `@switch`, `@empty`.
- *Branch Name:* `lesson-1.3-modern-control-flow`
- *Reference:* `agent-skills/angular-skills/references/components.md`
- *Topics:*
  - `@if` / `@else if` / `@else` — built-in, no `NgIf` import needed
  - `@for (item of items; track item.id)` — why `track` is mandatory and what a bad track expression costs
  - `@empty` block for empty collections
  - `@switch` / `@case` / `@default`
  - Why built-in control flow replaced `*ngIf` / `*ngFor`: smaller bundles, type narrowing, better DX
- *Training Exercise:* Render a list of items with conditional styling using `@for` and `@if`
- *Project Application:* Render hardcoded task cards inside the four TaskFlow columns using `@for`; show the "No tasks" empty state with `@empty`

---

### Lesson 1.4: Component Composition
- *Objective:* Build component trees, understand parent-child relationships.
- *Branch Name:* `lesson-1.4-component-composition`
- *Topics:*
  - Component hierarchy: parent → child nesting via the `imports` array
  - How components discover each other via selector matching
  - Splitting a large template into small components — where to draw the line
- *Training Exercise:* Build a greeting system: `App` → `GreetingList` → `GreetingCard`
- *Project Application:* Split the board into `features/board/board.ts` → `column.ts` → `task-card.ts` (data still hardcoded inside each component; wiring comes in Phase 2)

---

### Lesson 1.5: Component Styling
- *Objective:* SCSS workflows, view encapsulation, style isolation, design tokens.
- *Branch Name:* `lesson-1.5-component-styling`
- *Reference:* `agent-skills/angular-skills/references/component-styling.md`
- *Topics:*
  - `ViewEncapsulation`: `Emulated` (default), `ShadowDom`, `None`
  - Component-scoped styles vs global `styles.scss`: tokens, resets, and shared primitives are global; component appearance lives in the component's own `.scss`
  - `:host`, `:host-context()`, and why `::ng-deep` is a last resort
  - CSS custom properties as design tokens; SCSS nesting and variables
  - The alternative TaskFlow does not take: a utility-first framework (`agent-skills/angular-skills/references/tailwind-css.md`). The spec's tokens + BEM-ish class names are what keep two learners' builds visually identical — know the trade-off, then follow the spec.
- *Training Exercise:* Style the training components with SCSS, experiment with view encapsulation
- *Project Application:* Copy the design tokens from `taskflow-spec.md` §1.2 into `projects/taskflow/src/styles.scss`; style the topbar, board, columns, and cards to match spec §2, §5.3–5.5 pixel-for-pixel

---

### Lesson 1.6: Lifecycle Hooks & View Queries
- *Objective:* Know when component code runs and how to reach the DOM safely.
- *Branch Name:* `lesson-1.6-lifecycle-view-queries`
- *Topics:*
  - Lifecycle in order: constructor → `ngOnInit` → `ngAfterViewInit` → `ngOnDestroy`, and why the constructor should stay light
  - `afterNextRender()` / `afterEveryRender()` — the modern, SSR-safe way to touch the DOM
  - `DestroyRef.onDestroy()` as the functional alternative to `ngOnDestroy`
  - View queries: `viewChild()` / `viewChildren()` (signal-based) instead of `@ViewChild`
  - `ElementRef` — read-only access; avoid direct DOM mutation
- *Training Exercise:* Log every lifecycle hook of a parent and child; use `viewChild()` to focus an input after render
- *Project Application:* Add a `viewChild()` to the column's quick-add input so it can be focused programmatically (used later by keyboard navigation in Phase 12)
---

## Phase Completion Criteria

Before marking this phase as complete:

- [ ] All lessons implemented and merged to `main`
- [ ] All training exercises completed
- [ ] All project applications integrated into TaskFlow
- [ ] Code reviewed and follows best practices
- [ ] `npm run verify 1` passes — the milestone in `taskflow-spec.md` §10 is reached
- [ ] Tests pass (if Testing Phase already completed)

---

## Key Takeaways

After completing this phase, the learner should be able to:

- Create standalone components with separate `.ts` / `.html` / `.scss` files and explain why standalone is the default
- Bind data with interpolation, property, attribute, class, style, and event bindings
- Use `@if`, `@for` (with `track`), `@empty`, `@switch`, and `@let` instead of legacy structural directives
- Compose a component tree and decide where to split components
- Choose between component-scoped and global styles and explain view encapsulation
- Order the lifecycle hooks correctly and use `afterNextRender()` and `viewChild()` for DOM access
