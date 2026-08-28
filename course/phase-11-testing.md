# Phase 11: Testing
*Focus: Confidence through automated tests.*

## Git Branch: `lesson-11*-*`

> **⚠️ Testing Policy — effective from this phase onward:**
>
> 1. **Backfill:** After completing this phase, ALL existing components, services, directives, and pipes in TaskFlow that lack tests MUST receive unit tests before the phase is marked complete.
> 2. **Ongoing:** From this point forward, every new or modified component/service/directive/pipe MUST include corresponding tests before the lesson is marked complete. No exceptions.
> 3. **Coverage threshold:** ≥ 80% line coverage project-wide, ≥ 90% for business logic (`projects/taskflow/src/`).

---

### Lesson 11.1: Vitest Setup
- *Objective:* Test configuration, test runners.
- *Branch Name:* `lesson-111-vitest-setup`
- *Topics:*
  - Vitest as Angular's test runner
  - Test configuration in `angular.json`
  - Test file structure and naming conventions
- *Training Exercise:* Configure Vitest, run a passing test
- *Project Application:* Set up testing for TaskFlow

---

### Lesson 11.2: Component Testing
- *Objective:* Render components, test behavior.
- *Branch Name:* `lesson-112-component-tests`
- *Topics:*
  - `render()` from @angular-eslint/testing
  - Testing component output and user interactions
  - Testing with fake events and inputs
- *Training Exercise:* Test a counter component: verify display and button clicks
- *Project Application:* Test TaskFlow task card interactions

---

### Lesson 11.3: Service Testing
- *Objective:* Unit test services, mock dependencies.
- *Branch Name:* `lesson-113-service-tests`
- *Topics:*
  - Testing services in isolation
  - Mocking injected dependencies
  - Testing async service methods
- *Training Exercise:* Test a service that filters and transforms data
- *Project Application:* Test TaskFlow BoardService and TaskService logic

---

### Lesson 11.4: Pipe & Directive Testing
- *Objective:* Test utility components.
- *Branch Name:* `lesson-114-pipe-tests`
- *Topics:*
  - Testing pipe transforms with various inputs
  - Testing directive behavior and DOM changes
- *Training Exercise:* Test a custom pipe with edge cases
- *Project Application:* Test TaskFlow custom pipes and directives

---

### Lesson 11.5: Testing Best Practices
- *Objective:* What to test, test structure, behavior over implementation.
- *Branch Name:* `lesson-115-testing-practices`
- *Topics:*
  - Arrange-Act-Assert pattern
  - Testing behavior, not implementation details
  - What to test and what not to test
- *Training Exercise:* Refactor a test from implementation-focused to behavior-focused
- *Project Application:* Review and improve TaskFlow test suite
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

- Write unit tests for components, services, directives, and pipes with Vitest + TestBed
- Mock dependencies with `vi.fn()`, `vi.spyOn()`, and `TestBed.overrideProvider`
- Test signals, async flows (RxJS), and template interactions
- Achieve meaningful coverage (not just line %) — test behavior, not implementation
- Write integration tests for feature slices (component + service + store)
- Configure coverage thresholds and enforce them in CI
