# Phase 10: Server-Side Rendering & Hydration
*Focus: Production-grade deployment.*

## Git Branch: `lesson-10*-*`

---

### Lesson 10.1: SSR Setup
- *Objective:* `provideServerRendering`, server entry, hydration basics.
- *Branch Name:* `lesson-101-ssr-setup`
- *Topics:*
  - `provideServerRendering()` — enable SSR
  - Server entry point and server target
  - Basic hydration concept
- *Training Exercise:* Enable SSR in a minimal app, verify server rendering
- *Project Application:* Enable SSR for TaskFlow

---

### Lesson 10.2: Hydration Strategies
- *Objective:* Document hydration, state transfer.
- *Branch Name:* `lesson-102-hydration`
- *Topics:*
  - How hydration works: server HTML → client interactivity
  - Debugging hydration mismatches
  - State persistence across server/client boundary
- *Training Exercise:* Identify and fix a hydration mismatch
- *Project Application:* Ensure TaskFlow hydrates correctly

---

### Lesson 10.3: Environment Configuration
- *Objective:* Platform detection, environment-specific logic.
- *Branch Name:* `lesson-103-environments`
- *Topics:*
  - `isPlatformBrowser()` / `isPlatformServer()` — platform detection
  - Environment files and configuration
  - Browser-only vs server-only APIs
- *Training Exercise:* Conditionally run browser-only code
- *Project Application:* Handle platform-specific logic in TaskFlow
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

- Production-grade deployment.
- How this phase builds on earlier phases and prepares the ground for the next ones in the Angular learning path
- The Angular 22 best practices for this topic: standalone components, signals, strict TypeScript, and production-ready patterns
