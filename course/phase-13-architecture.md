# Phase 13: Architecture & Production
*Focus: Real-world application structure and shipping.*

## Git Branch: `lesson-13.<n>-*`
## Training dir: `src/app/phase-13-architecture/13.<n>-<slug>/` · Lesson notes: `lessons/phase-13-architecture/13.<n>-<slug>.md`

---

### Lesson 13.1: Feature-First Architecture — Review & Boundaries
- *Objective:* Understand *why* TaskFlow is laid out as `core/` / `features/` / `shared/` and enforce the boundaries.
- *Branch Name:* `lesson-13.1-feature-architecture`
- *Topics:*
  - `core/` (domain + state, no UI) vs `features/` (screens) vs `shared/` (reusable UI primitives)
  - Dependency direction: features → core/shared; never core → features
  - Barrel files (`index.ts`) — pros, cons, tree-shaking pitfalls
  - Route-level providers as feature boundaries
  - Optional: enforcing boundaries with ESLint import rules
- *Training Exercise:* Refactor a flat structure into feature folders and draw the dependency graph
- *Project Application:* Audit TaskFlow against spec §8; fix any boundary violation; add `index.ts` barrels where they help

---

### Lesson 13.2: Clean Architecture in Angular
- *Objective:* Separation of concerns, layers.
- *Branch Name:* `lesson-13.2-clean-architecture`
- *Topics:*
  - Domain (models, pure functions) / application (stores) / infrastructure (`TaskFlowDb`, HTTP) / presentation (components)
  - Smart vs presentational components
  - Where business rules live (not in templates, not in components)
- *Training Exercise:* Separate a monolithic component into clean layers
- *Project Application:* Extract pure domain functions (filtering, moving) from `TaskStore` into `core/domain/*.ts` with unit tests

---

### Lesson 13.3: Bundle Analysis & Optimization
- *Objective:* Tree-shaking, bundle budgets.
- *Branch Name:* `lesson-13.3-bundle-analysis`
- *Topics:*
  - Bundle budgets in `angular.json`
  - `ng build --stats-json` + a bundle analyzer
  - Tree-shaking, `sideEffects`, lazy chunks
- *Training Exercise:* Analyze bundle size, identify large dependencies
- *Project Application:* Optimize the TaskFlow production bundle; tighten the budgets

---

### Lesson 13.4: Error Handling, Production Build & CI
- *Objective:* Ship with confidence.
- *Branch Name:* `lesson-13.4-production`
- *Topics:*
  - Error handling layers: `provideBrowserGlobalErrorListeners()`, custom `ErrorHandler`, `withNavigationErrorHandler()`, HTTP interceptor
  - Environment-specific builds (`fileReplacements`, environment files)
  - `ng build` production flags; verifying the output
  - CI outline: lint → test (with coverage thresholds) → build; a GitHub Actions workflow
  - Deploying static output (SSR server vs static host) — awareness
- *Training Exercise:* Add a global `ErrorHandler` that reports to the console with context; build for production
- *Project Application:* Add error handling to TaskFlow; add a GitHub Actions workflow running tests and build
---

## Phase Completion Criteria

Before marking this phase as complete:

- [ ] All lessons implemented and merged to `main`
- [ ] All training exercises completed
- [ ] All project applications integrated into TaskFlow
- [ ] Code reviewed and follows best practices
- [ ] Tests pass and coverage thresholds are met

---

## Key Takeaways

After completing this phase, the learner should be able to:

- Explain and enforce the `core/` / `features/` / `shared/` boundaries and dependency direction
- Separate domain logic from stores and components
- Analyze and reduce bundle size with budgets and lazy chunks
- Implement layered error handling and set up a CI pipeline (lint → test → build)
