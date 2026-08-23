# Phase 1: Standalone Components & Templates
*Focus: Building the foundation with modern component architecture.*

## Git Branch: `lesson-1.*`

---

### Lesson 1.1: Standalone Component Basics
- *Objective:* Master `@Component`, metadata, bootstrap, and the standalone vs NgModule paradigm.
- *Branch Name:* `lesson-1.1-standalone-basics`
- *Topics:*
  - `@Component()` decorator: selector, templateUrl, styleUrls, standalone flag
  - Component file structure: keep behavior in `.ts`, template in `.html`, and styles in `.scss` files
  - Prefer `templateUrl` and `styleUrl` over inline templates and styles for application components
  - Standalone vs NgModule: why standalone is the default in modern Angular
  - Bootstrap process: `bootstrapApplication()` vs `NgModule.bootstrap`
- *Training Exercise:* Create a minimal standalone component in `src/app/`, bootstrap it manually
- *Project Application:* Create the first TaskFlow component: a static board shell in `projects/taskflow/`

---

### Lesson 1.2: Template Expressions & Property Binding
- *Objective:* Interpolation, property binding, event binding, and two-way binding syntax.
- *Branch Name:* `lesson-1.2-template-bindings`
- *Topics:*
  - Interpolation: `{{ value }}`
  - Property binding: `[prop]="value"`
  - Event binding: `(event)="handler()"`
  - Two-way binding: `[(ngModel)]="value"`
- *Training Exercise:* Build a counter component with increment/decrement buttons and display
- *Project Application:* Add dynamic task count display to TaskFlow board header

---

### Lesson 1.3: Modern Control Flow
- *Objective:* Replace `*ngIf`/`*ngFor` with `@if`, `@else`, `@for`, `@switch`.
- *Branch Name:* `lesson-1.3-modern-control-flow`
- *Topics:*
  - `@if` / `@else` / `@else if` — built-in, no `NgIf` import needed
  - `@for` — built-in loop with `track` expression for performance
  - `@switch` / `@case` — switch statements in templates
  - Why modern control flow is better: smaller bundles, better i18n, better DX
- *Training Exercise:* Render a list of items with conditional styling using `@for` and `@if`
- *Project Application:* Render hardcoded task cards in TaskFlow columns using `@for`

---

### Lesson 1.4: Component Composition
- *Objective:* Build component trees, understand parent-child relationships.
- *Branch Name:* `lesson-1.4-component-composition`
- *Topics:*
  - Component hierarchy: parent → child nesting
  - How components discover each other via selector matching
  - The "greeting system" pattern: compose small components into larger ones
- *Training Exercise:* Build a greeting system: `App` → `GreetingList` → `GreetingCard`
- *Project Application:* Build TaskFlow component tree: `Board` → `Column` → `TaskCard`

---

### Lesson 1.5: Component Styling
- *Objective:* SCSS workflows, view encapsulation, style isolation.
- *Branch Name:* `lesson-1.5-component-styling`
- *Topics:*
  - ViewEncapsulation: Emulated (default), Native, None
  - Component-scoped styles vs global styles in `styles.scss`
  - Keep component-specific styles in the component's own `.scss` file; use global styles only for tokens, resets, and shared primitives
  - `::ng-deep` / `:host` / `:host-context` — when and why to avoid
  - SCSS nesting and variables in component styles
- *Training Exercise:* Style the training components with SCSS, experiment with view encapsulation
- *Project Application:* Style TaskFlow board, columns, and cards with SCSS

**Component structure rule:** Every UI component must keep its TypeScript class,
HTML template, and SCSS styles in separate files. Do not put component templates
or styles inline in the decorator. Component-specific appearance belongs in the
component's `.scss` file; the application-level `styles.scss` is reserved for
global design tokens, resets, and styles intentionally shared across components.
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

- Building the foundation with modern component architecture.
- How this phase builds on earlier phases and prepares the ground for the next ones in the Angular learning path
- The Angular 22 best practices for this topic: standalone components, signals, strict TypeScript, and production-ready patterns
