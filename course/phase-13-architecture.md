# Phase 13: Architecture & Production
*Focus: Real-world application structure.*

## Git Branch: `lesson-13*-*`

---

### Lesson 13.1: Feature-First Architecture
- *Objective:* Organize by feature, folder structure conventions.
- *Branch Name:* `lesson-131-feature-architecture`
- *Topics:*
  - Feature-based folder organization
  - Shared vs core vs feature modules
  - Naming conventions and file structure
- *Training Exercise:* Refactor a flat structure into feature folders
- *Project Application:* Refactor TaskFlow into feature-first architecture (boards, tasks, shared)

---

### Lesson 13.2: Clean Architecture in Angular
- *Objective:* Separation of concerns, layers.
- *Branch Name:* `lesson-132-clean-architecture`
- *Topics:*
  - Domain layer: business logic and models
  - Presentation layer: components and templates
  - Adaptation layer: services, APIs, external integrations
- *Training Exercise:* Separate a monolithic component into clean layers
- *Project Application:* Apply clean architecture to TaskFlow services and components

---

### Lesson 13.3: Bundle Analysis & Optimization
- *Objective:* Tree-shaking, bundle budgets.
- *Branch Name:* `lesson-133-bundle-analysis`
- *Topics:*
  - Bundle budget configuration in `angular.json`
  - Tree-shaking and sideEffects
  - Bundle analysis tools and interpretation
- *Training Exercise:* Analyze bundle size, identify large dependencies
- *Project Application:* Optimize TaskFlow production bundle

---

### Lesson 13.4: Production Build & Deployment
- *Objective:* Build configurations, CI/CD awareness.
- *Branch Name:* `lesson-134-production-deploy`
- *Topics:*
  - Production build flags and optimizations
  - Environment-specific builds
  - Deployment checklist and CI/CD integration
- *Training Exercise:* Build for production, verify output
- *Project Application:* Configure production build for TaskFlow deployment
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

- Structure a feature-based architecture: `features/`, `core/`, `shared/`, `layouts/`
- Apply the bucket brigade pattern for cross-feature communication
- Configure environment-specific builds (`environment.ts`, `config`)
- Set up CI/CD pipeline: lint → test → build → deploy
- Implement error handling strategy: global error handler, route-level, component-level
- Document architectural decisions with ADRs (Architecture Decision Records)
