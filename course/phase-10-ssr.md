# Phase 10: Server-Side Rendering & Hydration
*Focus: Production-grade rendering.*

## Git Branch: `lesson-10.<n>-*`
## Training dir: `src/app/phase-10-ssr/10.<n>-<slug>/` · Lesson notes: `lessons/phase-10-ssr/10.<n>-<slug>.md`

> **Honest framing:** TaskFlow persists to `localStorage`, so the server can only render the shell and seed/empty states. That is exactly what makes it a good hydration exercise — the mismatch cases are real. `ng add @angular/ssr` installs packages: ask the learner to run it.

---

### Lesson 10.1: SSR Setup
- *Objective:* `@angular/ssr`, server entry, render modes.
- *Branch Name:* `lesson-10.1-ssr-setup`
- *Topics:*
  - `ng add @angular/ssr` — what it generates (`server.ts`, `app.config.server.ts`, `app.routes.server.ts`)
  - `provideServerRendering()` and `provideClientHydration()`
  - Render modes per route: `RenderMode.Server` / `Client` / `Prerender`
  - How the dev server and `ng build` change with SSR
- *Training Exercise:* Enable SSR in the training app, view the page source, confirm server-rendered HTML
- *Project Application:* Enable SSR for TaskFlow; prerender `/`, server-render `/boards/:boardId`

---

### Lesson 10.2: Hydration
- *Objective:* Non-destructive hydration, incremental hydration, mismatches.
- *Branch Name:* `lesson-10.2-hydration`
- *Topics:*
  - How hydration works: reuse server DOM, attach listeners, no re-render
  - `withIncrementalHydration()` + `@defer (hydrate on …)` triggers
  - Diagnosing mismatch errors (NG0500) — what causes them (browser-only data, `Date.now()`, `Math.random()`)
  - `ngSkipHydration` as an escape hatch
- *Training Exercise:* Introduce a hydration mismatch on purpose, read the error, fix it
- *Project Application:* Make TaskFlow hydrate cleanly: the board renders seed data on the server and swaps to `localStorage` data after `afterNextRender()`

---

### Lesson 10.3: Platform Detection & State Transfer
- *Objective:* Browser-only code, `TransferState`.
- *Branch Name:* `lesson-10.3-platform`
- *Topics:*
  - `PLATFORM_ID` + `isPlatformBrowser()` / `isPlatformServer()`
  - `afterNextRender()` as the preferred browser-only hook
  - `TransferState` and `withHttpTransferCacheOptions()` — avoiding double fetches of `seed.json`
  - `DOCUMENT` instead of `document`
- *Training Exercise:* Conditionally run browser-only code; transfer a fetched value to the client
- *Project Application:* Make `TaskFlowDb` fully SSR-safe (no-op outside the browser — spec §6) and verify no duplicate `seed.json` request after hydration
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

- Configure `@angular/ssr` with per-route render modes and explain the rendering pipeline
- Explain non-destructive and incremental hydration and fix mismatch errors
- Isolate browser-only code with `isPlatformBrowser()` / `afterNextRender()`
- Use `TransferState` / HTTP transfer cache to avoid duplicate requests
