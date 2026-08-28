# Phase 7: Routing & Navigation
*Focus: Multi-page applications and advanced routing.*

## Git Branch: `lesson-7*-*`

---

### Lesson 7.1: Route Configuration
- *Objective:* `provideRoutes`, route definitions, basic navigation.
- *Branch Name:* `lesson-71-route-config`
- *Topics:*
  - `provideRoutes()` — configure routes declaratively
  - Route definitions: path, component, children
  - Route matching strategies
- *Training Exercise:* Define routes for 2-3 pages, navigate between them
- *Project Application:* Configure routes for TaskFlow board pages

---

### Lesson 7.2: Router Outlet & Links
- *Objective:* `<router-outlet>`, `routerLink`, active link states.
- *Branch Name:* `lesson-72-router-outlet`
- *Topics:*
  - `<router-outlet>` — where routed components render
  - `routerLink` — declarative navigation
  - `routerLinkActive` — styling active links
- *Training Exercise:* Build a navigation bar with active link highlighting
- *Project Application:* Add board navigation bar to TaskFlow

---

### Lesson 7.3: Route Parameters & Query Params
- *Objective:* Dynamic segments, reading params.
- *Branch Name:* `lesson-73-route-params`
- *Topics:*
  - Dynamic route segments: `:id`
  - `paramsFromRoute()`, `queryParamsFromRoute()`
  - Reading params in components
- *Training Exercise:* Build a detail page that reads an ID from the URL
- *Project Application:* Navigate to specific boards by ID in TaskFlow

---

### Lesson 7.4: Route Guards
- *Objective:* `canActivate`, `canMatch`, protected routes.
- *Branch Name:* `lesson-74-route-guards`
- *Topics:*
  - `canActivate` — guard route activation
  - `canMatch` — guard route matching (hide from URL tree)
  - Redirect logic in guards
- *Training Exercise:* Create a guard that checks a simulated auth state
- *Project Application:* Protect TaskFlow admin routes with role-based guards

---

### Lesson 7.5: Resolvers & Data Fetching
- *Objective:* `resolve`, pre-fetching route data.
- *Branch Name:* `lesson-75-resolvers`
- *Topics:*
  - `resolve()` — pre-fetch data before route activation
  - Resolved data access in components
  - Resolver vs lazy data loading trade-offs
- *Training Exercise:* Create a resolver that loads data before rendering
- *Project Application:* Preload board data when navigating to a board in TaskFlow

---

### Lesson 7.6: Lazy Loading
- *Objective:* `loadComponent`, route-level code splitting.
- *Branch Name:* `lesson-76-lazy-loading`
- *Topics:*
  - `loadComponent` — lazy-load route components
  - Route-level code splitting and bundle impact
  - Eager vs lazy loading strategies
- *Training Exercise:* Lazy-load a feature module in a route
- *Project Application:* Lazy-load TaskFlow board detail pages

---

### Lesson 7.7: Deferred Loading (`@defer`)
- *Objective:* Block-level lazy loading, triggers, placeholders.
- *Branch Name:* `lesson-77-defer-blocks`
- *Topics:*
  - `@defer` — block-level lazy loading
  - Triggers: `on viewport`, `on timer`, `on interaction`
  - Placeholder and minimum/maximum delays
- *Training Exercise:* Defer-load a heavy component on viewport entry
- *Project Application:* Defer-load heavy board views in TaskFlow
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

- Configure lazy-loaded routes with `loadComponent` and `loadChildren`
- Use route resolvers to preload data before component activation
- Implement route guards (`CanActivate`, `CanDeactivate`) and child guards
- Pass and read route parameters, query params, and data
- Use `deferBlock` for deferred content loading within a route
- Handle 404, redirect, and wildcard routes correctly
