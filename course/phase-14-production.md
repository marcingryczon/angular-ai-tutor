# Phase 14: Architecture & Production
*Focus: Real-world application structure and shipping — the last thing you do is release.*

## Git Branch: `phase-14-production` — one branch per phase, one commit per lesson
## Training dir: `src/app/phase-14-production/14.<n>-<slug>/` · Lesson notes: `lessons/phase-14-production/14.<n>-<slug>.md`

---

### Lesson 14.1: Feature-First Architecture — Review & Boundaries
- *Objective:* Understand *why* TaskFlow is laid out as `core/` / `features/` / `shared/` and enforce the boundaries.
- *Commit:* `lesson-14.1-feature-architecture`
- *Topics:*
  - `core/` (domain + state, no UI) vs `features/` (screens) vs `shared/` (reusable UI primitives)
  - Dependency direction: features → core/shared; never core → features
  - Barrel files (`index.ts`) — pros, cons, tree-shaking pitfalls
  - Route-level providers as feature boundaries
  - Optional: enforcing boundaries with ESLint import rules
- *Training Exercise:* Refactor a flat structure into feature folders and draw the dependency graph
- *Project Application:* Audit TaskFlow against spec §8; fix any boundary violation; add `index.ts` barrels where they help

---

### Lesson 14.2: Clean Architecture in Angular
- *Objective:* Separation of concerns, layers.
- *Commit:* `lesson-14.2-clean-architecture`
- *Topics:*
  - Domain (models, pure functions) / application (stores) / infrastructure (`TaskFlowDb`, HTTP) / presentation (components)
  - Smart vs presentational components
  - Where business rules live (not in templates, not in components)
- *Training Exercise:* Separate a monolithic component into clean layers
- *Project Application:* Extract pure domain functions (filtering, moving) from `TaskStore` into `core/domain/*.ts` with unit tests

---

### Lesson 14.3: Bundle Analysis & Optimization
- *Objective:* Tree-shaking, bundle budgets.
- *Commit:* `lesson-14.3-bundle-analysis`
- *Topics:*
  - Bundle budgets in `angular.json`
  - `ng build --stats-json` + a bundle analyzer
  - Tree-shaking, `sideEffects`, lazy chunks
- *Training Exercise:* Analyze bundle size, identify large dependencies
- *Project Application:* Measure what Phase 13 cost you (`@ngrx/store` + DevTools is roughly 35 kB on the initial bundle), decide whether you keep it, then set the budgets flush against the size you decided to live with. This is the lesson where a number from the previous phase becomes a decision.

---

### Lesson 14.4: Error Handling, Production Build & CI
- *Objective:* Ship with confidence.
- *Commit:* `lesson-14.4-production`
- *Reference:* `agent-skills/angular-skills/references/environment-configuration.md`
- *Topics:*
  - Error handling layers: `provideBrowserGlobalErrorListeners()`, custom `ErrorHandler`, `withNavigationErrorHandler()`, HTTP interceptor
  - Environment-specific builds (`fileReplacements`, environment files)
  - `ng build` production flags; verifying the output
  - CI outline: lint → test (with coverage thresholds) → build; a GitHub Actions workflow
  - Scope the format check to the code (`projects/**`, `src/**`, `verify/**`, `angular.json`): running `prettier --check .` over the course's hand-written markdown turns every CI run red
  - CI should end with `npm run verify` — the milestones are executable, so let the pipeline say whether the app still matches the spec
  - Deploying static output (SSR server vs static host): a prerendered `/` on a CDN plus the Node server for `/boards/:id` — and what `allowedHosts` must contain once the host is not `localhost`
- *Training Exercise:* Add a global `ErrorHandler` that reports to the console with context; build for production
- *Project Application:* Add error handling to TaskFlow, add the GitHub Actions workflow (format → tests with thresholds → build), and **deploy it**: `npm run build:taskflow` and serve the SSR output, or publish the prerendered `/` to any static host. The course ends with your application running somewhere other than your laptop.
---

## Phase Completion Criteria

Before marking this phase as complete:

- [ ] All lessons implemented and merged to `main`
- [ ] All training exercises completed
- [ ] All project applications integrated into TaskFlow
- [ ] Code reviewed and follows best practices
- [ ] `npm run verify 14` passes — the milestone in `taskflow-spec.md` §10 is reached
- [ ] The app runs somewhere that is not your laptop
- [ ] Tests pass and coverage thresholds are met

---

## Phase 14 is the finale

The course deliberately ends with shipping, not with a refactor: the last thing you do to TaskFlow
is make it releasable and release it. Everything before this point was learning how Angular works;
this phase is about what you owe a user.

---

## Key Takeaways

After completing this phase, the learner should be able to:

- Explain and enforce the `core/` / `features/` / `shared/` boundaries and dependency direction
- Separate domain logic from stores and components
- Analyze and reduce bundle size with budgets and lazy chunks
- Implement layered error handling and set up a CI pipeline (lint → test → build)
