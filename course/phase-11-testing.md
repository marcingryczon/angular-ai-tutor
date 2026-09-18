# Phase 11: Testing
*Focus: Depth. You have been testing services since Lesson 3.6 — this phase adds everything that needs a rendered component, and turns the habit into a policy.*

## Git Branch: `phase-11-testing` — one branch per phase, one commit per lesson
## Training dir: `src/app/phase-11-testing/11.<n>-<slug>/` · Lesson notes: `lessons/phase-11-testing/11.<n>-<slug>.md`

> **⚠️ Testing Policy — the full policy takes effect here:**
>
> Since Lesson 3.6 every service, pipe, directive and pure function has shipped with a spec. This phase adds the units that need change detection — components, guards, resolvers — and sets the thresholds.
>
> 1. **Backfill:** After completing this phase, the remaining untested units (mostly components written in Phases 1–10) MUST receive tests before the phase is marked complete.
> 2. **Ongoing:** From this point forward, every new or modified component/service/directive/pipe MUST include corresponding tests before the lesson is marked complete. No exceptions.
> 3. **Coverage threshold:** ≥ 80% line coverage project-wide, ≥ 90% for business logic (`projects/taskflow/src/`).
>
> Installing `@testing-library/angular` is optional — ask before adding it. TestBed is the baseline.

---

### Lesson 11.1: Vitest Configuration & Coverage
- *Objective:* Go past "it runs": coverage, thresholds, and what the builder can configure.
- *Commit:* `lesson-11.1-vitest-setup`
- *Reference:* `agent-skills/angular-skills/references/testing-fundamentals.md`
- *Topics:*
  - `@angular/build:unit-test` builder with Vitest (`ng test`, `--watch`, `--coverage`)
  - `tsconfig.spec.json` and `jsdom`
  - (`skipTests: true` was already removed in Lesson 3.6 — new files get a spec)
  - Coverage needs a provider that is **not** installed by default: `ng test --coverage` stops with *"Code coverage requires either @vitest/coverage-v8 or @vitest/coverage-istanbul"*. Ask the learner to run `npm install -D @vitest/coverage-v8` before lesson 11.5.
  - Coverage options live on the builder, not in a Vitest config file: `coverage`, `coverageInclude`, `coverageExclude`, `coverageThresholds` (a `coverage: { … }` object fails schema validation)
  - `describe` / `it` / `expect`, `vi.fn()`, `vi.spyOn()`
- *Training Exercise:* Run the existing suite with `--coverage`, read the report, and find the least-covered file
- *Project Application:* Turn on coverage for the TaskFlow target and record today's number — it is the baseline the rest of the phase moves

---

### Lesson 11.2: Component Testing
- *Objective:* Render components, test behavior through the DOM.
- *Commit:* `lesson-11.2-component-tests`
- *Reference:* `agent-skills/angular-skills/references/testing-fundamentals.md` · `agent-skills/angular-skills/references/component-harnesses.md`
- *Topics:*
  - `TestBed.configureTestingModule({ imports: [Cmp] })`, `createComponent()`, and why zoneless tests use `await fixture.whenStable()` instead of `fixture.detectChanges()`
  - Setting signal inputs: `fixture.componentRef.setInput()` — beware that a render helper with a default parameter (`assignee = USER`) also applies that default when you pass `undefined` explicitly, so the "unassigned" case silently tests the wrong thing
  - Querying the DOM (`nativeElement`, `By.css`), dispatching events
  - Testing outputs with `vi.fn()` subscribers
  - Optional: `render()` / `screen` from `@testing-library/angular` for user-centric tests
- *Training Exercise:* Test a counter component: verify display and button clicks
- *Project Application:* Test `TaskCard` (renders title/badge/avatar; emits `edit` / `delete`) and `Column` (quick-add emits on Enter)

---

### Lesson 11.3: Service & Store Testing
- *Objective:* Unit test services and signal stores, mock dependencies.
- *Commit:* `lesson-11.3-service-tests`
- *Reference:* `agent-skills/angular-skills/references/testing-fundamentals.md`
- *Topics:*
  - `TestBed.inject()` vs plain `new` for services without dependencies
  - Overriding providers: `{ provide: X, useValue: mock }`
  - Testing signals and `computed()` selectors
  - `provideHttpClientTesting()` + `HttpTestingController` for `HttpClient`
  - **`httpResource()` in tests:** `await fixture.whenStable()` *waits for the pending request*, so calling it before answering that request hangs until the hook times out. The working order is `await TestBed.tick()` (lets the effect start the request) → `http.expectOne(url).flush(data)` → `await new Promise((r) => setTimeout(r))` (the resource resolves in a microtask) → `await TestBed.tick()` / `whenStable()`.
  - Testing `localStorage` behavior with a fake storage; `localStorage.clear()` in `beforeEach` keeps specs independent
- *Training Exercise:* Test a service that filters and transforms data; test an HTTP call with `HttpTestingController`
- *Project Application:* Test `TaskStore` (filters, `filteredTasks`, move/add/delete), `BoardStore`, `TaskFlowDb` (seed / load / save), and `SessionService`

---

### Lesson 11.4: Pipe, Directive, Guard & Resolver Testing
- *Objective:* Test the small units.
- *Commit:* `lesson-11.4-pipe-directive-tests`
- *Reference:* `agent-skills/angular-skills/references/router-testing.md`
- *Topics:*
  - Pipes: call `transform()` directly
  - Directives: a host test component + `TestBed`
  - Guards/resolvers: `TestBed.runInInjectionContext(() => guard(route, state))`
  - `RouterTestingHarness` for routed components
- *Training Exercise:* Test a custom pipe with edge cases; test a guard's redirect
- *Project Application:* Test `DueDatePipe`, `PriorityLabelPipe`, `AdminOnlyDirective`, `roleGuard`, `boardResolver`

---

### Lesson 11.5: Testing Best Practices & Coverage
- *Objective:* What to test, test structure, behavior over implementation, enforcing thresholds.
- *Commit:* `lesson-11.5-testing-practices`
- *Reference:* `agent-skills/angular-skills/references/testing-fundamentals.md` · `agent-skills/angular-skills/references/e2e-testing.md`
- *Topics:*
  - Arrange-Act-Assert; one behavior per test
  - Testing behavior, not implementation details (no private-method tests)
  - Coverage: `ng test --coverage`, thresholds in the Vitest config, what to exclude
  - Backfill plan for TaskFlow
  - *Awareness, not installed here:* component harnesses (`agent-skills/angular-skills/references/component-harnesses.md`) make component tests survive markup changes, and end-to-end tests (`e2e-testing.md`) cover what unit tests structurally cannot — the drag & drop and the SSR round trip. Know when you would reach for them.
- *Training Exercise:* Refactor a test from implementation-focused to behavior-focused
- *Project Application:* Backfill every remaining TaskFlow unit; reach ≥ 90% on `projects/taskflow/src/`; configure thresholds so the test run fails below them
---

## Phase Completion Criteria

Before marking this phase as complete:

- [ ] All lessons implemented and merged to `main`
- [ ] All training exercises completed
- [ ] All project applications integrated into TaskFlow
- [ ] Code reviewed and follows best practices
- [ ] `npm run verify 11` passes — the milestone in `taskflow-spec.md` §10 is reached
- [ ] Tests pass and coverage thresholds are met

---

## Key Takeaways

After completing this phase, the learner should be able to:

- Run and configure Vitest through the Angular CLI
- Test components through the DOM with TestBed (and optionally Testing Library), including signal inputs and outputs
- Test services, signal stores, and HTTP calls with mocked providers
- Test pipes, directives, guards, and resolvers in isolation
- Enforce coverage thresholds and explain why behavior-focused tests survive refactors
