# Phase 0: Project Setup & Angular Fundamentals
*Focus: Understanding the workspace, TypeScript, and the Angular mental model.*

## Git Branch: `lesson-00-*`

---

### Lesson 0.1: Workspace Anatomy ✅ COMPLETED
- *Objective:* Navigate `angular.json`, `package.json`, project structure, and CLI commands.
- *Branch Name:* `lesson-01-workspace-anatomy`
- *Topics:*
  - Project tree: `angular.json`, `package.json`, `tsconfig.json`, `src/`, `projects/`
  - Build targets: `ng serve`, `ng build`, `ng test`
  - Workspace vs project configuration in `angular.json`
- *Training Exercise:* Identify files in workspace, explain purpose of each config file
- *Project Application:* Explore TaskFlow project structure in `projects/taskflow/`

---

### Lesson 0.2.1: TypeScript Strict Mode — Why Strict?
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

---

### Lesson 0.2.2: TypeScript Strict Mode — Types & Interfaces
- *Objective:* Master `type` unions, `interface` definitions, optional vs required fields, `readonly`.
- *Branch Name:* `lesson-022-ts-types-interfaces`
- *Topics:*
  - Union types with string literals
  - Interface vs type alias
  - Optional fields (`?`) vs explicit `| undefined`
  - `readonly` modifier
- *Training Exercise:* Define `Role`, `Visibility`, `User`, `Profile` types in `src/app/types/`
- *Project Application:* Define TaskFlow domain types: `Priority`, `TaskStatus`, `Task`, `Column`, `Board` in `projects/taskflow/`

---

### Lesson 0.2.3: TypeScript Strict Mode — Generics
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

---

### Lesson 0.3: Angular Mental Model
- *Objective:* Understand the framework lifecycle, bootstrap process, and the component tree.
- *Branch Name:* `lesson-03-angular-mental-model`
- *Topics:*
  - Entry point: `main.ts` → `bootstrapApplication()`
  - Component tree and the rendering lifecycle
  - Dependency Injection tree
  - Zone.js and change detection trigger events
- *Training Exercise:* Trace the bootstrap flow step by step in a minimal app
- *Project Application:* Understand TaskFlow bootstrap entry point