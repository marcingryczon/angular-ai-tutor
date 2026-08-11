# Angular Mastery Curriculum: Progressive Learning Path

This document serves as a master roadmap for the progressive development of the **Angular AI Tutor Project**. Each lesson is represented by a unique Git branch, ensuring that the codebase evolves incrementally from foundational concepts to highly advanced architecture.

## Project Overview
The project is a living laboratory. As we advance through the curriculum, the application's complexity, features, and architectural patterns will increase significantly.

---

## Git Branch Strategy

The repository uses a structured branching model to keep the codebase clean and traceable.

### Branches

| Branch | Purpose | Modifiable? |
|---|---|---|
| `start` | **Clean baseline** — the original project setup. Represents the starting point of the curriculum. | ❌ No (only to update project assumptions) |
| `main` | **Working branch** — mirror of `start`. All lesson branches are merged here. | ✅ Yes (merge target for lesson branches) |
| `lesson-XX-*` | **Lesson branches** — each lesson gets its own branch created from `main`. After completion, merged back to `main`. | ✅ Yes (active development) |

### Rules

1. **`start` branch is the source of truth** for the clean project state. Do not modify it directly unless updating foundational project setup.
2. **`main` tracks progress** — every completed lesson branch merges into `main`.
3. **Each lesson branches from `main`** — ensures lessons build on top of all previous work.
4. **Lesson branches follow naming convention** — `lesson-XX-topic-name` (e.g., `lesson-01-workspace-anatomy`).

### Flow

```
start (clean baseline, read-only)
  └── main (merge target)
        ├── lesson-01-workspace-anatomy ──┐
        ├── lesson-02-typescript-strict ──┤── merged after completion
        ├── lesson-11-standalone-basics ──┘
        └── ...
```

---

## IMPORTANT
1. Do not create new or edit any existing files by yourself without ask. THIS IS VERY IMPORTANT!
2. Use angular-cli MCP server as much as you can.
3. I'm beginne in Angular
4. run `npm start` and visually check also (use chrome devtools mcp)

---

# Mentoring Mode

Assume the user is learning Angular.

Whenever possible:

- ask guiding questions instead of immediately giving answers
- explain Angular internals
- compare multiple approaches
- explain trade-offs
- recommend best practices
- encourage independent problem solving

Do not behave like an autocomplete.

Behave like a senior engineer mentoring a junior developer.

---

## Application Project: TaskFlow — Project Management Kanban Board

Throughout the curriculum, you will incrementally build **TaskFlow**, a full-featured project management application with Kanban-style boards. Each phase adds real functionality to the same codebase, so by the end you will have a production-ready application that demonstrates every major Angular concept.

### What is TaskFlow?

TaskFlow is a multi-board task management application where users can:
- Create multiple project boards (e.g., "Marketing Sprint", "Bug Tracker")
- Organize tasks into columns (To Do, In Progress, Review, Done)
- Create, edit, and delete tasks with metadata (title, description, priority, due date, assignee)
- Filter and search tasks across boards
- Track task status with visual indicators
- Navigate between boards with a routed layout
- Work with role-based access (admin vs member views)

---

## Curriculum Structure

### Phase 0: Project Setup & Angular Fundamentals
*Focus: Understanding the workspace, TypeScript, and the Angular mental model.*

- **[X] Lesson 0.1: Workspace Anatomy**
  - *Objective:* Navigate `angular.json`, `package.json`, project structure, and CLI commands.
  - *Branch Name:* `lesson-01-workspace-anatomy`
  - *Topics:*
    - Project tree: `angular.json`, `package.json`, `tsconfig.json`, `src/`, `projects/`
    - Build targets: `ng serve`, `ng build`, `ng test`
    - Workspace vs project configuration in `angular.json`
  - *Training Exercise:* Identify files in workspace, explain purpose of each config file
  - *Project Application:* Explore TaskFlow project structure in `projects/taskflow/`

- **[ ] Lesson 0.2.1: TypeScript Strict Mode — Why Strict?**
  - *Objective:* Understand why `strict: true` is non-negotiable in Angular. Explore `strictNullChecks`, `noImplicitOverride`, `noImplicitReturns`.
  - *Branch Name:* `lesson-021-ts-strict-why`
  - *Topics:*
    - What `strict: true` enables under the hood
    - `strictNullChecks`: null/undefined safety
    - `noImplicitOverride`: safe class inheritance
    - `noImplicitReturns`: catch missing return paths
    - `noFallthroughCasesInSwitch`: prevent switch bugs
  - *Training Exercise:* Write code that fails without strict mode and compiles safely with it
  - *Project Application:* Verify TaskFlow tsconfig uses strict mode

- **[ ] Lesson 0.2.2: TypeScript Strict Mode — Types & Interfaces**
  - *Objective:* Master `type` unions, `interface` definitions, optional vs required fields, `readonly`.
  - *Branch Name:* `lesson-022-ts-types-interfaces`
  - *Topics:*
    - Union types with string literals
    - Interface vs type alias
    - Optional fields (`?`) vs explicit `| undefined`
    - `readonly` modifier
  - *Training Exercise:* Define `Role`, `Visibility`, `User`, `Profile` types in `src/app/types/`
  - *Project Application:* Define TaskFlow domain types: `Priority`, `TaskStatus`, `Task`, `Column`, `Board` in `projects/taskflow/`

- **[ ] Lesson 0.2.3: TypeScript Strict Mode — Generics**
  - *Objective:* Understand generic functions, generic interfaces, `T extends`, and why generics preserve type safety.
  - *Branch Name:* `lesson-023-ts-generics`
  - *Topics:*
    - Why generics: type preservation without `any`
    - Generic functions
    - Generic interfaces
    - Constrained generics with `T extends`
    - Default generic values
  - *Training Exercise:* Define `Result<T>`, `createSuccess<T>()`, `createError<T>()`, `firstItem<T>()` in `src/app/`
  - *Project Application:* Define `findById<T>()` helper in `projects/taskflow/`

- **[ ] Lesson 0.3: Angular Mental Model**
  - *Objective:* Understand the framework lifecycle, bootstrap process, and the component tree.
  - *Branch Name:* `lesson-03-angular-mental-model`
  - *Topics:*
    - Entry point: `main.ts` → `bootstrapApplication()`
    - Component tree and the rendering lifecycle
    - Dependency Injection tree
    - Zone.js and change detection trigger events
  - *Training Exercise:* Trace the bootstrap flow step by step in a minimal app
  - *Project Application:* Understand TaskFlow bootstrap entry point

### Phase 1: Standalone Components & Templates
*Focus: Building the foundation with modern component architecture.*

- **[ ] Lesson 1.1: Standalone Component Basics**
  - *Objective:* Master `@Component`, metadata, bootstrap, and the standalone vs NgModule paradigm.
  - *Branch Name:* `lesson-11-standalone-basics`
  - *Topics:*
    - `@Component()` decorator: selector, templateUrl, styleUrls, standalone flag
    - Standalone vs NgModule: why standalone is the default in modern Angular
    - Bootstrap process: `bootstrapApplication()` vs `NgModule.bootstrap`
  - *Training Exercise:* Create a minimal standalone component in `src/app/`, bootstrap it manually
  - *Project Application:* Create the first TaskFlow component: a static board shell in `projects/taskflow/`

- **[ ] Lesson 1.2: Template Expressions & Property Binding**
  - *Objective:* Interpolation, property binding, event binding, and two-way binding syntax.
  - *Branch Name:* `lesson-12-template-bindings`
  - *Topics:*
    - Interpolation: `{{ value }}`
    - Property binding: `[prop]="value"`
    - Event binding: `(event)="handler()"`
    - Two-way binding: `[(ngModel)]="value"`
  - *Training Exercise:* Build a counter component with increment/decrement buttons and display
  - *Project Application:* Add dynamic task count display to TaskFlow board header

- **[ ] Lesson 1.3: Modern Control Flow**
  - *Objective:* Replace `*ngIf`/`*ngFor` with `@if`, `@else`, `@for`, `@switch`.
  - *Branch Name:* `lesson-13-modern-control-flow`
  - *Topics:*
    - `@if` / `@else` / `@else if` — built-in, no `NgIf` import needed
    - `@for` — built-in loop with `track` expression for performance
    - `@switch` / `@case` — switch statements in templates
    - Why modern control flow is better: smaller bundles, better i18n, better DX
  - *Training Exercise:* Render a list of items with conditional styling using `@for` and `@if`
  - *Project Application:* Render hardcoded task cards in TaskFlow columns using `@for`

- **[ ] Lesson 1.4: Component Composition**
  - *Objective:* Build component trees, understand parent-child relationships.
  - *Branch Name:* `lesson-14-component-composition`
  - *Topics:*
    - Component hierarchy: parent → child nesting
    - How components discover each other via selector matching
    - The "greeting system" pattern: compose small components into larger ones
  - *Training Exercise:* Build a greeting system: `App` → `GreetingList` → `GreetingCard`
  - *Project Application:* Build TaskFlow component tree: `Board` → `Column` → `TaskCard`

- **[ ] Lesson 1.5: Component Styling**
  - *Objective:* SCSS workflows, view encapsulation, style isolation.
  - *Branch Name:* `lesson-15-component-styling`
  - *Topics:*
    - ViewEncapsulation: Emulated (default), Native, None
    - Component-scoped styles vs global styles in `styles.scss`
    - `::ng-deep` / `:host` / `:host-context` — when and why to avoid
    - SCSS nesting and variables in component styles
  - *Training Exercise:* Style the training components with SCSS, experiment with view encapsulation
  - *Project Application:* Style TaskFlow board, columns, and cards with SCSS

---

### Phase 2: Component Communication
*Focus: How components talk to each other.*

- **[ ] Lesson 2.1: `input()` - Modern Inputs**
  - *Objective:* Typed inputs with default values and transforms.
  - *Branch Name:* `lesson-21-inputs`
  - *Topics:*
    - `input<T>()` function: typed inputs replacing `@Input()`
    - Input defaults: `input<T>(defaultValue)`
    - Aliased inputs: `input('alias')`
    - Input transforms: `input({ transform })`
  - *Training Exercise:* Create a child component that receives a name input and greets it
  - *Project Application:* Pass task data from Board to Column to TaskCard via inputs

- **[ ] Lesson 2.2: `output()` - Modern Outputs**
  - *Objective:* Replace `EventEmitter` with the `output()` API.
  - *Branch Name:* `lesson-22-outputs`
  - *Topics:*
    - `output<T>()` function: typed outputs replacing `@Output()` + `EventEmitter`
    - Connecting outputs to parent handlers
    - Typed event payloads
  - *Training Exercise:* Create a button component that emits a click event with metadata
  - *Project Application:* TaskCard emits delete/edit events to parent Column

- **[ ] Lesson 2.3: `model()` - Two-Way Binding**
  - *Objective:* Component-level v-model pattern with `model()`.
  - *Branch Name:* `lesson-23-model`
  - *Topics:*
    - `model<T>()` — two-way signal binding
    - Banana-in-a-box syntax: `[()]`
    - Synchronized parent-child state
  - *Training Exercise:* Build a toggle component synced with parent via model
  - *Project Application:* Sync selected task between Board and TaskCard via model

- **[ ] Lesson 2.4: Content Projection**
  - *Objective:* `<ng-content>`, multi-slot projection, `ngProjectAs`.
  - *Branch Name:* `lesson-24-content-projection`
  - *Topics:*
    - Single-slot projection: `<ng-content>`
    - Multi-slot projection: `<ng-content select="...">`
    - `ngProjectAs` — projecting with a virtual selector
  - *Training Exercise:* Create a card wrapper that projects custom content
  - *Project Application:* Wrap Column component with projected header/footer

---

### Phase 3: Dependency Injection
*Focus: The power of Angular's DI system.*

- **[ ] Lesson 3.1: `inject()` API**
  - *Objective:* Functional injection replacing constructor DI.
  - *Branch Name:* `lesson-31-inject-api`
  - *Topics:*
    - `inject<T>()` function: functional DI replacing `constructor` pattern
    - Injection context and injector hierarchy basics
    - Why `inject()` is preferred over constructor DI in modern Angular
  - *Training Exercise:* Create a service and inject it using `inject()` instead of constructor
  - *Project Application:* Refactor TaskFlow components to use `inject()` for services

- **[ ] Lesson 3.2: Creating Services**
  - *Objective:* Injectable services, environment providers, singleton pattern.
  - *Branch Name:* `lesson-32-services`
  - *Topics:*
    - `injectable()` decorator and `providedIn: 'root'`
    - Singleton services vs scoped services
    - Providing services via `providers` array
  - *Training Exercise:* Create a counter service shared between two components
  - *Project Application:* Create `BoardService` and `TaskService` for TaskFlow

- **[ ] Lesson 3.3: DI Fundamentals**
  - *Objective:* Provider tokens, `useValue`, `useFactory`, `useClass`.
  - *Branch Name:* `lesson-33-di-fundamentals`
  - *Topics:*
    - InjectionToken<T>: abstract tokens for non-class dependencies
    - `useValue`: provide a static value
    - `useFactory`: provide a value computed by a factory function
    - `useClass`: provide an implementation for an abstract token
  - *Training Exercise:* Provide configuration via `useValue`, swap implementations via `useClass`
  - *Project Application:* Provide board configuration (column names, priorities) via provider tokens

- **[ ] Lesson 3.4: Hierarchical Injectors**
  - *Objective:* Component injectors, `EnvironmentInjector`, injector trees.
  - *Branch Name:* `lesson-34-hierarchical-injectors`
  - *Topics:*
    - Root injector vs element injector
    - `providers` in `@Component()` — scoped providers
    - How child components discover parents via injector hierarchy
  - *Training Exercise:* Create a scoped provider that differs between parent and child
  - *Project Application:* Scope TaskFlow board-specific providers per board instance

---

### Phase 4: Signals & Reactive State
*Focus: Modern reactive programming with Signals.*

- **[ ] Lesson 4.1: `signal()` - Writable Signals**
  - *Objective:* Create and manage reactive state with `signal()`.
  - *Branch Name:* `lesson-41-writable-signals`
  - *Topics:*
    - `signal<T>(initialValue)` — creating writable signals
    - `.set()` vs `.update()` — replacing vs transforming signal state
    - Why signals: fine-grained reactivity without Zone.js
  - *Training Exercise:* Build a reactive counter with `signal()`, `set()`, `update()`
  - *Project Application:* Convert TaskFlow task list to a writable signal

- **[ ] Lesson 4.2: `computed()` - Derived State**
  - *Objective:* Automatic dependency tracking with computed signals.
  - *Branch Name:* `lesson-42-computed-signals`
  - *Topics:*
    - `computed()` — derived signals that auto-track dependencies
    - Chaining computed signals
    - Performance: computed signals are lazy and memoized
  - *Training Exercise:* Compute a filtered list and aggregated count from a signal
  - *Project Application:* Compute task counts per column, filtered task views in TaskFlow

- **[ ] Lesson 4.3: `effect()` - Side Effects**
  - *Objective:* React to signal changes, manage cleanup.
  - *Branch Name:* `lesson-43-effects`
  - *Topics:*
    - `effect()` — running side effects when signals change
    - Cleanup functions in effects
    - When to use effects vs computed vs template unwrapping
  - *Training Exercise:* Log signal changes to console, clean up interval in effect
  - *Project Application:* Log task state changes, track board modifications in TaskFlow

- **[ ] Lesson 4.4: Linked Signals**
  - *Objective:* `linkedSignal()` pattern for parent-child signal synchronization.
  - *Branch Name:* `lesson-44-linked-signals`
  - *Topics:*
    - `linkedSignal()` — controlled vs uncontrolled component pattern
    - Syncing child signal with parent signal
    - When to use linked signals vs model()
  - *Training Exercise:* Build a controlled input component with linkedSignal
  - *Project Application:* Sync selected/edited task between Board and TaskCard

- **[ ] Lesson 4.5: Signals in Templates**
  - *Objective:* Auto-unwrapping behavior, template reactivity.
  - *Branch Name:* `lesson-45-signals-templates`
  - *Topics:*
    - Automatic unwrapping: signals don't need `.()` in templates
    - Template reactivity: how Angular triggers re-render on signal change
    - Signal unwrapping in property bindings, interpolations, and directives
  - *Training Exercise:* Display signal values in template, observe auto-updates
  - *Project Application:* Display reactive task data in TaskFlow templates

---

### Phase 5: RxJS & Async Patterns
*Focus: Streaming data and the RxJS + Signals synergy.*

- **[ ] Lesson 5.1: RxJS Fundamentals**
  - *Objective:* Observables, Subjects, subscriptions, unsubscription.
  - *Branch Name:* `lesson-51-rxjs-basics`
  - *Topics:*
    - Observable vs Promise: lazy, async streams
    - Subject: multicasting, manual emission
    - Subscription lifecycle and memory leaks
  - *Training Exercise:* Create an Observable, subscribe to it, emit values via Subject
  - *Project Application:* Simulate API responses with Observables in TaskFlow services

- **[ ] Lesson 5.2: Essential Operators**
  - *Objective:* `map`, `filter`, `switchMap`, `takeUntil`, `catchError`.
  - *Branch Name:* `lesson-52-rxjs-operators`
  - *Topics:*
    - `map` — transform emitted values
    - `filter` — conditionally pass values
    - `switchMap` — flatten nested observables with cancellation
    - `catchError` — handle errors in the stream
  - *Training Exercise:* Chain operators to transform and handle an HTTP-like stream
  - *Project Application:* Transform and handle task API responses in TaskFlow

- **[ ] Lesson 5.3: `toSignal()` - Bridges**
  - *Objective:* Convert Observables to Signals for synchronous access.
  - *Branch Name:* `lesson-53-to-signal`
  - *Topics:*
    - `toSignal(obs, { requireSync, initialValue })` — bridge Observable to Signal
    - Why bridge: synchronous access to async data in templates and effects
    - Alias signals: `aliasSignal()` for computed aliases
  - *Training Exercise:* Convert an Observable to a Signal and use it in a component
  - *Project Application:* Bridge TaskFlow service Observables to Signals for template use

- **[ ] Lesson 5.4: `takeUntilDestroyed()`**
  - *Objective:* Automatic subscription cleanup, prevent memory leaks.
  - *Branch Name:* `lesson-54-takeuntil-destroyed`
  - *Topics:*
    - `takeUntilDestroyed()` — auto-unsubscribe on component destroy
    - `DestroyRef` — manual cleanup registration
    - Why manual unsubscribe is no longer needed
  - *Training Exercise:* Subscribe to an Observable with `takeUntilDestroyed()`
  - *Project Application:* Safe subscriptions in TaskFlow components

- **[ ] Lesson 5.5: Resource API**
  - *Objective:* `resource()` for data fetching, the modern async pattern.
  - *Branch Name:* `lesson-55-resource-api`
  - *Topics:*
    - `resource()` — declarative data fetching API
    - `ResourceRef` states: loading, resolved, expired, errored
    - Dependencies between resources
  - *Training Exercise:* Fetch data using `resource()`, handle loading/error states
  - *Project Application:* Load board and task data declaratively in TaskFlow

---

### Phase 6: Forms
*Focus: User input with modern form patterns.*

- **[ ] Lesson 6.1: Template-Driven Forms**
  - *Objective:* `ngModel`, simple validation, quick forms.
  - *Branch Name:* `lesson-61-template-forms`
  - *Topics:*
    - `FormsModule` and `ngModel`
    - Form control names, validation states
    - Error messages based on validation errors
  - *Training Exercise:* Build a simple contact form with validation
  - *Project Application:* Add task creation form in TaskFlow

- **[ ] Lesson 6.2: Signal Forms**
  - *Objective:* `control()`, `formGroup()` modern reactive forms.
  - *Branch Name:* `lesson-62-signal-forms`
  - *Topics:*
    - `formGroup()` and `control()` — signal-based reactive forms
    - Form validation with signals
    - Why Signal Forms replace legacy Reactive Forms
  - *Training Exercise:* Build a form with `formGroup()` and `control()`, validate inputs
  - *Project Application:* Replace template forms with Signal Forms in TaskFlow

- **[ ] Lesson 6.3: Reactive Forms (Legacy)**
  - *Objective:* `FormControl`, `FormGroup` legacy pattern awareness.
  - *Branch Name:* `lesson-63-reactive-forms`
  - *Topics:*
    - `FormControl`, `FormGroup`, `FormArray` — legacy reactive forms API
    - How Signal Forms relate to legacy Reactive Forms
    - Migration awareness: when and how to migrate
  - *Training Exercise:* Recognize legacy patterns in existing code
  - *Project Application:* N/A (awareness lesson)

- **[ ] Lesson 6.4: Custom Validators & Async Validators**
  - *Objective:* Build reusable validation logic.
  - *Branch Name:* `lesson-64-validators`
  - *Topics:*
    - Sync custom validators: `validator()` function
    - Async custom validators: debounced API checks
    - Cross-field validation patterns
  - *Training Exercise:* Create a "no whitespace" validator and a "password match" validator
  - *Project Application:* Add duplicate task name validator per board in TaskFlow

---

### Phase 7: Routing & Navigation
*Focus: Multi-page applications and advanced routing.*

- **[ ] Lesson 7.1: Route Configuration**
  - *Objective:* `provideRoutes`, route definitions, basic navigation.
  - *Branch Name:* `lesson-71-route-config`
  - *Topics:*
    - `provideRoutes()` — configure routes declaratively
    - Route definitions: path, component, children
    - Route matching strategies
  - *Training Exercise:* Define routes for 2-3 pages, navigate between them
  - *Project Application:* Configure routes for TaskFlow board pages

- **[ ] Lesson 7.2: Router Outlet & Links**
  - *Objective:* `<router-outlet>`, `routerLink`, active link states.
  - *Branch Name:* `lesson-72-router-outlet`
  - *Topics:*
    - `<router-outlet>` — where routed components render
    - `routerLink` — declarative navigation
    - `routerLinkActive` — styling active links
  - *Training Exercise:* Build a navigation bar with active link highlighting
  - *Project Application:* Add board navigation bar to TaskFlow

- **[ ] Lesson 7.3: Route Parameters & Query Params**
  - *Objective:* Dynamic segments, reading params.
  - *Branch Name:* `lesson-73-route-params`
  - *Topics:*
    - Dynamic route segments: `:id`
    - `paramsFromRoute()`, `queryParamsFromRoute()`
    - Reading params in components
  - *Training Exercise:* Build a detail page that reads an ID from the URL
  - *Project Application:* Navigate to specific boards by ID in TaskFlow

- **[ ] Lesson 7.4: Route Guards**
  - *Objective:* `canActivate`, `canMatch`, protected routes.
  - *Branch Name:* `lesson-74-route-guards`
  - *Topics:*
    - `canActivate` — guard route activation
    - `canMatch` — guard route matching (hide from URL tree)
    - Redirect logic in guards
  - *Training Exercise:* Create a guard that checks a simulated auth state
  - *Project Application:* Protect TaskFlow admin routes with role-based guards

- **[ ] Lesson 7.5: Resolvers & Data Fetching**
  - *Objective:* `resolve`, pre-fetching route data.
  - *Branch Name:* `lesson-75-resolvers`
  - *Topics:*
    - `resolve()` — pre-fetch data before route activation
    - Resolved data access in components
    - Resolver vs lazy data loading trade-offs
  - *Training Exercise:* Create a resolver that loads data before rendering
  - *Project Application:* Preload board data when navigating to a board in TaskFlow

- **[ ] Lesson 7.6: Lazy Loading**
  - *Objective:* `loadComponent`, route-level code splitting.
  - *Branch Name:* `lesson-76-lazy-loading`
  - *Topics:*
    - `loadComponent` — lazy-load route components
    - Route-level code splitting and bundle impact
    - Eager vs lazy loading strategies
  - *Training Exercise:* Lazy-load a feature module in a route
  - *Project Application:* Lazy-load TaskFlow board detail pages

- **[ ] Lesson 7.7: Deferred Loading (`@defer`)**
  - *Objective:* Block-level lazy loading, triggers, placeholders.
  - *Branch Name:* `lesson-77-defer-blocks`
  - *Topics:*
    - `@defer` — block-level lazy loading
    - Triggers: `on viewport`, `on timer`, `on interaction`
    - Placeholder and minimum/maximum delays
  - *Training Exercise:* Defer-load a heavy component on viewport entry
  - *Project Application:* Defer-load heavy board views in TaskFlow

---

### Phase 8: Change Detection & Performance
*Focus: Rendering efficiency and optimization.*

- **[ ] Lesson 8.1: Change Detection Internals**
  - *Objective:* How CD works, dirty checking, unidirectional flow.
  - *Branch Name:* `lesson-81-cd-internals`
  - *Topics:*
    - Change detection cycle: how Angular checks for updates
    - Zone.js: how Angular knows when to run CD
    - Unidirectional flow: parent → child only
  - *Training Exercise:* Trace CD cycles using `ChangeDetectorRef`
  - *Project Application:* Understand CD behavior in TaskFlow component tree

- **[ ] Lesson 8.2: `OnPush` Strategy**
  - *Objective:* Triggering updates, the OnPush mental model.
  - *Branch Name:* `lesson-82-onpush`
  - *Topics:*
    - `changeDetection: ChangeDetectionStrategy.OnPush`
    - When OnPush components update: input change, event, async pipe, signal
    - Migrating from Default to OnPush
  - *Training Exercise:* Convert a component to OnPush, verify updates still work
  - *Project Application:* Migrate TaskFlow components to OnPush

- **[ ] Lesson 8.3: Zoneless Preparation**
  - *Objective:* Removing NgZone dependencies, zone-free APIs.
  - *Branch Name:* `lesson-83-zoneless-prep`
  - *Topics:*
    - What is Zone.js and why remove it
    - Identifying NgZone-dependent APIs
    - Zoneless-compatible alternatives
  - *Training Exercise:* Audit a component for NgZone dependencies
  - *Project Application:* Audit TaskFlow for zoneless compatibility

- **[ ] Lesson 8.4: Performance Profiling**
  - *Objective:* Angular DevTools, change detection timing.
  - *Branch Name:* `lesson-84-profiling`
  - *Topics:*
    - Angular DevTools extension
    - Measuring change detection performance
    - Identifying bottlenecks and excessive renders
  - *Training Exercise:* Profile a component and identify CD bottlenecks
  - *Project Application:* Profile TaskFlow with large boards and optimize

- **[ ] Lesson 8.5: Rendering Optimization**
  - *Objective:* `@for` track, pure pipes, avoiding unnecessary renders.
  - *Branch Name:* `lesson-85-rendering-opts`
  - *Topics:*
    - `@for` track expression — why it matters for performance
    - Pure pipes as memoization
    - Avoiding object/function creation in templates
  - *Training Exercise:* Optimize a list with proper track expression
  - *Project Application:* Optimize TaskFlow task list rendering with proper tracking

---

### Phase 9: Directives & Pipes
*Focus: Reusable template logic.*

- **[ ] Lesson 9.1: Structural Directives**
  - *Objective:* Create custom structural directives.
  - *Branch Name:* `lesson-91-structural-directives`
  - *Topics:*
    - Structural directives: modifying DOM structure
    - `TemplateRef` and `ViewContainerRef`
    - Creating custom structural directives
  - *Training Exercise:* Create a `@myIf` structural directive
  - *Project Application:* Create permission-based structural directive for TaskFlow (admin-only columns)

- **[ ] Lesson 9.2: Attribute Directives**
  - *Objective:* DOM manipulation, class/style directives.
  - *Branch Name:* `lesson-92-attribute-directives`
  - *Topics:*
    - Attribute directives: modifying element appearance/behavior
    - `ElementRef` and DOM manipulation
    - Dynamic classes and styles
  - *Training Exercise:* Create a highlight directive that changes background color
  - *Project Application:* Create priority highlight directive for TaskFlow task cards

- **[ ] Lesson 9.3: Custom Pipes**
  - *Objective:* Pure pipes, pipe transforms, chaining pipes.
  - *Branch Name:* `lesson-93-custom-pipes`
  - *Topics:*
    - `@Pipe()` decorator and `transform()` method
    - Pure vs impure pipes
    - Pipe chaining and composition
  - *Training Exercise:* Create a currency format pipe and a filter pipe
  - *Project Application:* Create date format and priority label pipes for TaskFlow

---

### Phase 10: Server-Side Rendering & Hydration
*Focus: Production-grade deployment.*

- **[ ] Lesson 10.1: SSR Setup**
  - *Objective:* `provideServerRendering`, server entry, hydration basics.
  - *Branch Name:* `lesson-101-ssr-setup`
  - *Topics:*
    - `provideServerRendering()` — enable SSR
    - Server entry point and server target
    - Basic hydration concept
  - *Training Exercise:* Enable SSR in a minimal app, verify server rendering
  - *Project Application:* Enable SSR for TaskFlow

- **[ ] Lesson 10.2: Hydration Strategies**
  - *Objective:* Document hydration, state transfer.
  - *Branch Name:* `lesson-102-hydration`
  - *Topics:*
    - How hydration works: server HTML → client interactivity
    - Debugging hydration mismatches
    - State persistence across server/client boundary
  - *Training Exercise:* Identify and fix a hydration mismatch
  - *Project Application:* Ensure TaskFlow hydrates correctly

- **[ ] Lesson 10.3: Environment Configuration**
  - *Objective:* Platform detection, environment-specific logic.
  - *Branch Name:* `lesson-103-environments`
  - *Topics:*
    - `isPlatformBrowser()` / `isPlatformServer()` — platform detection
    - Environment files and configuration
    - Browser-only vs server-only APIs
  - *Training Exercise:* Conditionally run browser-only code
  - *Project Application:* Handle platform-specific logic in TaskFlow

---

### Phase 11: Testing
*Focus: Confidence through automated tests.*

- **[ ] Lesson 11.1: Vitest Setup**
  - *Objective:* Test configuration, test runners.
  - *Branch Name:* `lesson-111-vitest-setup`
  - *Topics:*
    - Vitest as Angular's test runner
    - Test configuration in `angular.json`
    - Test file structure and naming conventions
  - *Training Exercise:* Configure Vitest, run a passing test
  - *Project Application:* Set up testing for TaskFlow

- **[ ] Lesson 11.2: Component Testing**
  - *Objective:* Render components, test behavior.
  - *Branch Name:* `lesson-112-component-tests`
  - *Topics:*
    - `render()` from @angular-eslint/testing
    - Testing component output and user interactions
    - Testing with fake events and inputs
  - *Training Exercise:* Test a counter component: verify display and button clicks
  - *Project Application:* Test TaskFlow task card interactions

- **[ ] Lesson 11.3: Service Testing**
  - *Objective:* Unit test services, mock dependencies.
  - *Branch Name:* `lesson-113-service-tests`
  - *Topics:*
    - Testing services in isolation
    - Mocking injected dependencies
    - Testing async service methods
  - *Training Exercise:* Test a service that filters and transforms data
  - *Project Application:* Test TaskFlow BoardService and TaskService logic

- **[ ] Lesson 11.4: Pipe & Directive Testing**
  - *Objective:* Test utility components.
  - *Branch Name:* `lesson-114-pipe-tests`
  - *Topics:*
    - Testing pipe transforms with various inputs
    - Testing directive behavior and DOM changes
  - *Training Exercise:* Test a custom pipe with edge cases
  - *Project Application:* Test TaskFlow custom pipes and directives

- **[ ] Lesson 11.5: Testing Best Practices**
  - *Objective:* What to test, test structure, behavior over implementation.
  - *Branch Name:* `lesson-115-testing-practices`
  - *Topics:*
    - Arrange-Act-Assert pattern
    - Testing behavior, not implementation details
    - What to test and what not to test
  - *Training Exercise:* Refactor a test from implementation-focused to behavior-focused
  - *Project Application:* Review and improve TaskFlow test suite

---

### Phase 12: Accessibility & Polish
*Focus: Production-ready quality.*

- **[ ] Lesson 12.1: ARIA Fundamentals**
  - *Objective:* Roles, states, properties.
  - *Branch Name:* `lesson-121-aria`
  - *Topics:*
    - ARIA roles, states, and properties
    - Semantic HTML vs ARIA attributes
    - Common accessibility pitfalls in Angular
  - *Training Exercise:* Add ARIA attributes to a custom component
  - *Project Application:* Add ARIA roles to TaskFlow board/column/card structure

- **[ ] Lesson 12.2: Keyboard Navigation**
  - *Objective:* Focus management, keyboard events.
  - *Branch Name:* `lesson-122-keyboard`
  - *Topics:*
    - Keyboard event handling in Angular
    - Focus management and focus traps
    - Accessible form controls and buttons
  - *Training Exercise:* Make a custom dropdown keyboard-accessible
  - *Project Application:* Add keyboard navigation to TaskFlow task actions

- **[ ] Lesson 12.3: Animations**
  - *Objective:* `@animations`, transition states, motion design.
  - *Branch Name:* `lesson-123-animations`
  - *Topics:*
    - `@angular/animations` module
    - State transitions and trigger definitions
    - Enter/leave/transition animations
  - *Training Exercise:* Animate a component entering and leaving the DOM
  - *Project Application:* Animate task card state transitions in TaskFlow

---

### Phase 13: Architecture & Production
*Focus: Real-world application structure.*

- **[ ] Lesson 13.1: Feature-First Architecture**
  - *Objective:* Organize by feature, folder structure conventions.
  - *Branch Name:* `lesson-131-feature-architecture`
  - *Topics:*
    - Feature-based folder organization
    - Shared vs core vs feature modules
    - Naming conventions and file structure
  - *Training Exercise:* Refactor a flat structure into feature folders
  - *Project Application:* Refactor TaskFlow into feature-first architecture (boards, tasks, shared)

- **[ ] Lesson 13.2: Clean Architecture in Angular**
  - *Objective:* Separation of concerns, layers.
  - *Branch Name:* `lesson-132-clean-architecture`
  - *Topics:*
    - Domain layer: business logic and models
    - Presentation layer: components and templates
    - Adaptation layer: services, APIs, external integrations
  - *Training Exercise:* Separate a monolithic component into clean layers
  - *Project Application:* Apply clean architecture to TaskFlow services and components

- **[ ] Lesson 13.3: Bundle Analysis & Optimization**
  - *Objective:* Tree-shaking, bundle budgets.
  - *Branch Name:* `lesson-133-bundle-analysis`
  - *Topics:*
    - Bundle budget configuration in `angular.json`
    - Tree-shaking and sideEffects
    - Bundle analysis tools and interpretation
  - *Training Exercise:* Analyze bundle size, identify large dependencies
  - *Project Application:* Optimize TaskFlow production bundle

- **[ ] Lesson 13.4: Production Build & Deployment**
  - *Objective:* Build configurations, CI/CD awareness.
  - *Branch Name:* `lesson-134-production-deploy`
  - *Topics:*
    - Production build flags and optimizations
    - Environment-specific builds
    - Deployment checklist and CI/CD integration
  - *Training Exercise:* Build for production, verify output
  - *Project Application:* Configure production build for TaskFlow deployment

---

## Application Project: TaskFlow — Project Management Kanban Board

Throughout the curriculum, you will incrementally build **TaskFlow**, a full-featured project management application with Kanban-style boards. Each phase adds real functionality to the same codebase, so by the end you will have a production-ready application that demonstrates every major Angular concept.

### What is TaskFlow?

TaskFlow is a multi-board task management application where users can:
- Create multiple project boards (e.g., "Marketing Sprint", "Bug Tracker")
- Organize tasks into columns (To Do, In Progress, Review, Done)
- Create, edit, and delete tasks with metadata (title, description, priority, due date, assignee)
- Filter and search tasks across boards
- Track task status with visual indicators
- Navigate between boards with a routed layout
- Work with role-based access (admin vs member views)

### How TaskFlow evolves per Phase

| Phase | What gets added to TaskFlow |
|---|---|
| **0 — Fundamentals** | Bootstrap the workspace, trace the entry point, understand the project structure |
| **1 — Components & Templates** | Build a static Kanban board: board component → column components → task card components with hardcoded data |
| **2 — Component Communication** | Make cards dynamic: pass task data via `input()`, emit card actions (delete, edit) via `output()`, sync selected task via `model()`, wrap columns with content projection |
| **3 — Dependency Injection** | Extract board and task data into `BoardService` and `TaskService`, use `inject()`, introduce provider tokens for board configuration (column names, priorities) |
| **4 — Signals** | Convert all imperative state to `signal()`/`computed()`/`effect()`: reactive task lists, computed column counts, derived filtered views, linked signals for the selected/edited task |
| **5 — RxJS & Async** | Simulate API calls with Observables, bridge to Signals with `toSignal()`, safe subscriptions with `takeUntilDestroyed()`, introduce `resource()` for declarative task loading |
| **6 — Forms** | Add task creation and edit forms with Signal Forms, validation (required fields, max length, date ranges), custom validators (duplicate task names per board) |
| **7 — Routing** | Multiple boards with lazy-loaded routes, route guards for "authenticated" views, resolvers for board data preloading, `@defer` for heavy board views |
| **8 — Performance** | Migrate all components to `OnPush`, profile change detection with boards containing many cards, optimize `@for` tracking, prepare for zoneless |
| **9 — Directives & Pipes** | Custom structural directive for permission-based visibility (admin-only columns), attribute directive for card priority highlighting, custom pipes for date formatting and priority labels |
| **10 — SSR** | Enable SSR and hydration so board URLs are shareable and render server-side |
| **11 — Testing** | Write Vitest tests: service logic (filtering, CRUD), component behavior (card interactions), pipe transforms, directive conditions |
| **12 — Accessibility** | ARIA roles for board/column/card structure, keyboard navigation for task actions, animations for card state transitions |
| **13 — Architecture** | Refactor into feature-first architecture (boards feature, tasks feature, shared utilities), bundle analysis, production build configuration |

---

## Workflow Protocol

Each lesson follows a **5-step workflow**:

1. **Topic Discussion** — Mentor explains the Angular concept, internals, alternatives, and trade-offs.
2. **Focused Exercise** — Mentor proposes a small, isolated exercise that practices the concept in isolation.
3. **Exercise Verification** — User completes the exercise. Mentor validates and provides feedback.
4. **Project Application** — Mentor proposes a concrete change to apply the concept in the TaskFlow project.
5. **Project Verification** — User implements the change in TaskFlow. Mentor validates, reviews code, and suggests improvements before moving to the next lesson.

### Training Flow: `src/` → `projects/taskflow/`

Each lesson follows a **two-step flow**:

| Step | Where | Purpose |
|---|---|---|
| **1. Training** | `src/app/` | Practice the concept in isolation, without the pressure of a real project |
| **2. Application** | `projects/taskflow/` | Apply the concept in the real TaskFlow project |

**Rules:**
- First we train on simple files in `src/app/`
- Only when the concept is understood, we move to `projects/taskflow/`
- The user controls the pace — can ask for more training exercises

### Example Workflow (Lesson 4.1: Writable Signals)

1. *Topic*: What are Signals? How do they differ from Observables? Why does Angular need them?
2. *Exercise*: Build a standalone counter component with `signal()`, `set()`, and `update()`.
3. *Verify*: Check that the counter increments, state is reactive, and no manual change detection is triggered.
4. *Project*: Convert the hardcoded task count in TaskFlow's board header to a writable signal.
5. *Verify*: Confirm the header updates reactively when tasks are added or removed.
