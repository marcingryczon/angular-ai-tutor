# Phase 10: Server-Side Rendering & Hydration
*Focus: Production-grade rendering.*

## Git Branch: `phase-10-ssr` — one branch per phase, one commit per lesson
## Training dir: `src/app/phase-10-ssr/10.<n>-<slug>/` · Lesson notes: `lessons/phase-10-ssr/10.<n>-<slug>.md`

> **Honest framing:** TaskFlow persists to `localStorage`, so the server can only render the shell and seed/empty states. That is exactly what makes it a good hydration exercise — the mismatch cases are real. `ng add @angular/ssr` installs packages: ask the learner to run it.

---

### Lesson 10.1: SSR Setup
- *Objective:* `@angular/ssr`, server entry, render modes.
- *Commit:* `lesson-10.1-ssr-setup`
- *Reference:* `agent-skills/angular-skills/references/rendering-strategies.md`
- *Topics:*
  - `ng add @angular/ssr` — what it generates (`server.ts`, `main.server.ts`, `app.config.server.ts`, `app.routes.server.ts`), plus the `server` / `outputMode` / `ssr` keys it adds to the build target
  - **Two things bite here:** (1) there is no `--server-routing` flag in v22 — the schematic rejects it; (2) the schematic writes `"security": { "allowedHosts": [] }`, and the built server then answers `400 Bad Request — Header "host" … is not allowed` for `localhost`. Add `"allowedHosts": ["localhost"]` before running `npm run serve:ssr:taskflow`.
  - `provideServerRendering()` and `provideClientHydration()`
  - Render modes per route: `RenderMode.Server` / `Client` / `Prerender`
  - How the dev server and `ng build` change with SSR
- *Training Exercise:* Enable SSR in the training app, view the page source, confirm server-rendered HTML
- *Project Application:* Enable SSR for TaskFlow; prerender `/` and `/boards`, server-render `/boards/:boardId` (board ids are only known per request), leave `**` on `RenderMode.Server`. Verify with `curl` that the HTML already contains the board title and the cards.

---

### Lesson 10.2: Hydration
- *Objective:* Non-destructive hydration, incremental hydration, mismatches.
- *Commit:* `lesson-10.2-hydration`
- *Reference:* `agent-skills/angular-skills/references/rendering-strategies.md`
- *Topics:*
  - How hydration works: reuse server DOM, attach listeners, no re-render
  - `withIncrementalHydration()` + `@defer (hydrate on …)` triggers
  - Diagnosing mismatch errors (NG0500) — what causes them (browser-only data, `Date.now()`, `Math.random()`)
  - `ngSkipHydration` as an escape hatch
- *Training Exercise:* Introduce a hydration mismatch on purpose, read the error, fix it
- *Project Application:* Make TaskFlow hydrate cleanly: the board renders seed data on the server and swaps to `localStorage` data after `afterNextRender()`
- *The refactor this forces:* the store built in Phases 3–5 reads `localStorage` in its constructor. Change it to start from the same empty state on both platforms, seed from the resource, and only then — inside `afterNextRender()` — replace the state with what was persisted. Guard the persistence `effect()` with a "storage already consulted" flag, otherwise the first write overwrites the user's data with the seed.

---

### Lesson 10.3: Platform Detection & State Transfer
- *Objective:* Browser-only code, `TransferState`.
- *Commit:* `lesson-10.3-platform`
- *Reference:* `agent-skills/angular-skills/references/rendering-strategies.md`
- *Topics:*
  - `PLATFORM_ID` + `isPlatformBrowser()` / `isPlatformServer()`
  - `afterNextRender()` as the preferred browser-only hook
  - `TransferState` and `withHttpTransferCacheOptions()` — avoiding double fetches of `seed.json`
  - `DOCUMENT` instead of `document`
- *Training Exercise:* Conditionally run browser-only code; transfer a fetched value to the client
- *Project Application:* Make `TaskFlowDb` fully SSR-safe (no-op outside the browser — spec §6) and verify no duplicate `seed.json` request after hydration
- *How to verify:* with the app served from the SSR build, `performance.getEntriesByType('resource')` must contain **no** `seed.json` entry — `provideClientHydration(withHttpTransferCacheOptions(...))` replays the server's response. A mismatch would surface as an `NG0500` console error, so a clean console is part of the acceptance.
---

## Phase Completion Criteria

Before marking this phase as complete:

- [ ] All lessons implemented and merged to `main`
- [ ] All training exercises completed
- [ ] All project applications integrated into TaskFlow
- [ ] Code reviewed and follows best practices
- [ ] `npm run verify 10` passes — the milestone in `taskflow-spec.md` §10 is reached
- [ ] Tests pass (if Testing Phase already completed)

---

## Key Takeaways

After completing this phase, the learner should be able to:

- Configure `@angular/ssr` with per-route render modes and explain the rendering pipeline
- Explain non-destructive and incremental hydration and fix mismatch errors
- Isolate browser-only code with `isPlatformBrowser()` / `afterNextRender()`
- Use `TransferState` / HTTP transfer cache to avoid duplicate requests
