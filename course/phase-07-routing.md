# Phase 7: Routing & Navigation
*Focus: Multi-page applications and advanced routing.*

## Git Branch: `phase-7-routing` — one branch per phase, one commit per lesson
## Training dir: `src/app/phase-7-routing/7.<n>-<slug>/` · Lesson notes: `lessons/phase-7-routing/7.<n>-<slug>.md`

---

### Lesson 7.1: Route Configuration
- *Objective:* `provideRouter`, route definitions, basic navigation.
- *Commit:* `lesson-7.1-route-config`
- *Reference:* `agent-skills/angular-skills/references/define-routes.md`
- *Topics:*
  - `provideRouter(routes, ...features)` in `app.config.ts`
  - `Routes`: `path`, `component`, `children`, `redirectTo`, `pathMatch`
  - Wildcard `**` and redirects
  - Route `title`
- *Training Exercise:* Define routes for 2–3 pages, navigate between them
- *Project Application:* Configure `app.routes.ts` per spec §3: `''` and `boards` → `BoardList` (placeholder), `boards/:boardId` → `Board`, `**` → redirect

---

### Lesson 7.2: Router Outlet & Links
- *Objective:* `<router-outlet>`, `routerLink`, active link states.
- *Commit:* `lesson-7.2-router-outlet`
- *Reference:* `agent-skills/angular-skills/references/show-routes-with-outlets.md` · `agent-skills/angular-skills/references/navigate-to-routes.md`
- *Topics:*
  - `<router-outlet />` — where routed components render
  - `routerLink` (string vs array form) and `routerLinkActive`
  - `Router.navigate()` / `navigateByUrl()` for programmatic navigation
- *Training Exercise:* Build a navigation bar with active link highlighting
- *Project Application:* Build `features/board-list/board-list.ts` per spec §4 (board cards linking to `/boards/:id`, create-board signal form); topbar brand links to `/`; board page gets the "← All boards" back link

---

### Lesson 7.3: Route Parameters & Query Params
- *Objective:* Dynamic segments, reading params as inputs.
- *Commit:* `lesson-7.3-route-params`
- *Reference:* `agent-skills/angular-skills/references/define-routes.md` · `agent-skills/angular-skills/references/router-lifecycle.md`
- *Topics:*
  - Dynamic segments: `:boardId`
  - `withComponentInputBinding()` — route params, query params, and `data` become `input()`s
  - `ActivatedRoute` — when you still need it (observables of params, parent routes)
  - Query params for shareable state
- *Training Exercise:* Build a detail page that reads an ID from the URL via `input()`
- *Project Application:* `Board` gets `boardId = input.required<string>()`; the store selects the current board from it

---

### Lesson 7.4: Route Guards
- *Objective:* Functional guards: `canActivate`, `canMatch`, `canDeactivate`.
- *Commit:* `lesson-7.4-route-guards`
- *Reference:* `agent-skills/angular-skills/references/route-guards.md`
- *Topics:*
  - `CanActivateFn` — with `inject()` and `Router.createUrlTree()` for redirects
  - `CanMatchFn` — hide a route entirely
  - `CanDeactivateFn` — "unsaved changes" prompts
- *Training Exercise:* Create a guard that checks a simulated auth state
- *Project Application:* Create `core/role.guard.ts` and use it to protect an admin-only route (e.g. `boards/:boardId/settings` placeholder)

---

### Lesson 7.5: Resolvers & Data Fetching
- *Objective:* Pre-fetching route data.
- *Commit:* `lesson-7.5-resolvers`
- *Reference:* `agent-skills/angular-skills/references/data-resolvers.md`
- *Topics:*
  - `ResolveFn<T>` and the `resolve` route property; a resolver may return a value, a `Promise`, an `Observable` — or a `RedirectCommand(router.parseUrl('/'))` to send the navigation somewhere else
  - Reading resolved data via `input()` (with `withComponentInputBinding()`)
  - Resolver vs loading inside the component (`resource()`): trade-offs, `withNavigationErrorHandler`
- *Training Exercise:* Create a resolver that loads data before rendering
- *Project Application:* Create `core/board.resolver.ts` that resolves the board and returns `new RedirectCommand(router.parseUrl('/'))` when the id is unknown — spec §3. Note that the seed may still be in flight on a cold load, so the resolver first awaits the store's "data is ready" signal; otherwise every deep link redirects to the list.

---

### Lesson 7.6: Lazy Loading & Preloading
- *Objective:* `loadComponent`, route-level code splitting.
- *Commit:* `lesson-7.6-lazy-loading`
- *Reference:* `agent-skills/angular-skills/references/loading-strategies.md`
- *Topics:*
  - `loadComponent` / `loadChildren` with dynamic `import()`
  - Bundle impact: inspect the chunks in `ng build` output
  - Preloading: `withPreloading(PreloadAllModules)` and custom strategies
- *Training Exercise:* Lazy-load a feature route and verify a separate chunk is produced
- *Project Application:* Make both TaskFlow routes lazy (`loadComponent`) and enable `PreloadAllModules`
---

## Phase Completion Criteria

Before marking this phase as complete:

- [ ] All lessons implemented and merged to `main`
- [ ] All training exercises completed
- [ ] All project applications integrated into TaskFlow
- [ ] Code reviewed and follows best practices
- [ ] `npm run verify 7` passes — the milestone in `taskflow-spec.md` §10 is reached
- [ ] Tests pass (if Testing Phase already completed)

---

## Key Takeaways

After completing this phase, the learner should be able to:

- Configure routes with `provideRouter()`, redirects, wildcard, and route titles
- Navigate declaratively (`routerLink`) and programmatically (`Router`)
- Read params, query params, and resolved data as component `input()`s
- Implement functional `canActivate`, `canMatch`, and `canDeactivate` guards
- Choose between resolvers and in-component loading
- Lazy-load routes with `loadComponent` and configure preloading
