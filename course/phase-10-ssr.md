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