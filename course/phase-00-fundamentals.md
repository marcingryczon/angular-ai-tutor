# Phase 0: Project Setup & Angular Fundamentals
*Focus: Understanding the workspace, TypeScript, and the Angular mental model.*

## Git Branch: `lesson-0.<n>-*`
## Training dir: `src/app/phase-0-fundamentals/0.<n>-<slug>/` · Lesson notes: `lessons/phase-0-fundamentals/0.<n>-<slug>.md`

---

### Lesson 0.1: Workspace Anatomy
- *Objective:* Navigate `angular.json`, `package.json`, project structure, and CLI commands.
- *Branch Name:* `lesson-0.1-workspace-anatomy`
- *Reference:* `agent-skills/angular-skills/references/cli.md` · `agent-skills/angular-skills/references/mcp.md`
- *Topics:*
  - Project tree: `angular.json`, `package.json`, `tsconfig.json`, `src/`, `projects/`
  - Build targets: `ng serve`, `ng build`, `ng test` (Vitest via `@angular/build:unit-test`)
  - Workspace vs project configuration in `angular.json`; the `schematics` block (`style: scss`, `skipTests: true` until Phase 11)
  - Every project needs its own `architect` targets — both `angular-ai-tutor` and `taskflow` have `build`, `serve`, and `test`; a missing target is why a CLI command "does not exist" for one project only
  - What is **not** in `package.json`: no `zone.js` — Angular 22 apps are zoneless by default (explained in 0.3)
  - **Exact versions, not ranges:** the `@angular/*` packages are pinned (`22.1.4`, tooling `22.1.6`) instead of `^22.0.0`. Ranges plus a lockfile that drifted are what make a later `ng add @angular/ssr` (Phase 10) fail with `ERESOLVE` peer conflicts. The fix is to align the versions and regenerate `package-lock.json`, never `--force`.
  - Tooling: Prettier (`npx prettier --check .`); ESLint is optional (`ng add angular-eslint`) — ask before adding
- *Training Exercise:* Identify files in workspace, explain purpose of each config file
- *Project Application:* Explore TaskFlow project structure in `projects/taskflow/` and read `course/taskflow-spec.md` §8 (target layout: `core/`, `features/`, `shared/`)

---

### Lesson 0.2.1: TypeScript Strict Mode — Why Strict?
- *Objective:* Understand why `strict: true` is non-negotiable in Angular. Explore `strictNullChecks`, `noImplicitOverride`, `noImplicitReturns`.
- *Branch Name:* `lesson-0.2.1-ts-strict-why`
- *Topics:*
  - What `strict: true` enables under the hood
  - `strictNullChecks`: null/undefined safety
  - `noImplicitOverride`: safe class inheritance
  - `noImplicitReturns`: catch missing return paths
  - `noFallthroughCasesInSwitch`: prevent switch bugs
  - `noPropertyAccessFromIndexSignature`: why `obj['key']` vs `obj.key` matters
  - `target: ES2022` decides which standard-library methods exist: `Array.prototype.toSorted()` / `with()` are ES2023, so `columns.toSorted(...)` fails to compile — use `[...columns].sort(...)`
- *Training Exercise:* Write code that fails without strict mode and compiles safely with it
- *Project Application:* Verify TaskFlow tsconfig uses strict mode — `strict: true` is already set in the workspace `tsconfig.json`; read each flag it turns on and try removing one to see what stops being reported

---

### Lesson 0.2.2: TypeScript Strict Mode — Types & Interfaces
- *Objective:* Master `type` unions, `interface` definitions, optional vs required fields, `readonly`.
- *Branch Name:* `lesson-0.2.2-ts-types-interfaces`
- *Topics:*
  - Union types with string literals
  - Interface vs type alias
  - Optional fields (`?`) vs explicit `| undefined`
  - `readonly` modifier and `readonly T[]`
- *Training Exercise:* Define `Role`, `Visibility`, `User`, `Profile` types in the training dir
- *Project Application:* Define the TaskFlow domain model in `projects/taskflow/src/app/core/models.ts` exactly as in `taskflow-spec.md` §7.1: `Priority`, `TaskStatus`, `Visibility`, `Role`, `User`, `Board`, `Column`, `Task`

---

### Lesson 0.2.3: TypeScript Strict Mode — Generics
- *Objective:* Understand generic functions, generic interfaces, `T extends`, and why generics preserve type safety.
- *Branch Name:* `lesson-0.2.3-ts-generics`
- *Topics:*
  - Why generics: type preservation without `any`
  - Generic functions and generic interfaces
  - Constrained generics with `T extends`
  - Default generic values
- *Training Exercise:* Define `Result<T>`, `createSuccess<T>()`, `createError<T>()`, `firstItem<T>()`
- *Project Application:* Create `core/helpers.ts` with `newId()` and `findById<T extends { id: string }>()`

---

### Lesson 0.3: Angular Mental Model (Zoneless)
- *Objective:* Understand the bootstrap process, the component tree, and how a zoneless Angular app knows when to re-render.
- *Branch Name:* `lesson-0.3-angular-mental-model`
- *Reference:* `agent-skills/angular-skills/references/components.md` · `agent-skills/angular-skills/references/signals-overview.md`
- *Topics:*
  - Entry point: `main.ts` → `bootstrapApplication(App, appConfig)`
  - `ApplicationConfig` providers: `provideRouter()`, `provideBrowserGlobalErrorListeners()`
  - Component tree and the rendering lifecycle (compile → create → update)
  - Dependency Injection tree (preview of Phase 3)
  - **Zoneless by default:** there is no `zone.js` in this project. Angular schedules change detection when it is *told* something changed: a signal write, a template event listener firing, `markForCheck()`, or the `async` pipe. Zone.js (patching browser APIs) is legacy — covered as context in Phase 8.
- *Training Exercise:* Trace the bootstrap flow step by step in a minimal app; add a `console.log` in the component constructor and template to observe when rendering happens
- *Project Application:* Understand TaskFlow bootstrap entry point and `app.config.ts`
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

- Navigate and explain the purpose of every config file in an Angular workspace (`angular.json`, `tsconfig.json`, `package.json`)
- Explain why `strict: true` is non-negotiable and what each strict sub-flag prevents
- Define domain types with unions, interfaces, and generics that survive refactoring
- Trace the Angular bootstrap flow from `main.ts` through `bootstrapApplication()` to first render
- Explain, at a high level, how a zoneless app decides when to run change detection
