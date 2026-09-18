# Angular Mastery Curriculum: Progressive Learning Path

This document serves as a master roadmap for the progressive development of the **Angular AI Tutor Project**. Each lesson is represented by a unique Git branch, ensuring that the codebase evolves incrementally from foundational concepts to highly advanced architecture.

## Project Overview
The project is a living laboratory. As we advance through the curriculum, the application's complexity, features, and architectural patterns will increase significantly.

---

## Phase Index

Detailed lesson plans are split across phase files to reduce context window usage. Read the relevant phase file when working on that section.

The phases below were derived from the concepts most unique to **Angular** — standalone components, dependency injection, signals, RxJS, routing, and global state management — and progress from fundamentals to production-ready architecture.

**Status legend:** ⬜ not started ◐ in progress ✅ completed

> **Keep this table current.** When a lesson branch is merged, update the status here (and mirror it in `README.md`). Progress is also visible from `git branch --list 'lesson-*'`.

**Phase dependencies and the recommended order** live in `course/prerequisites.md`. **What TaskFlow must look like after each phase** is defined in `course/taskflow-spec.md` §10 (Build Milestones) — check the milestone before starting a phase, and close a phase with `npm run verify <n>`, which asserts that milestone against the learner's own code (`verify/README.md`).

| Phase | Status | Topic | File |
|---|---|---|---|
| **0** | ✅ | Project Setup & Angular Fundamentals | `course/phase-00-fundamentals.md` |
| **1** | ◐ | Standalone Components & Templates | `course/phase-01-components.md` |
| **2** | ⬜ | Component Communication | `course/phase-02-communication.md` |
| **3** | ⬜ | Dependency Injection | `course/phase-03-di.md` |
| **4** | ⬜ | Signals & Reactive State | `course/phase-04-signals.md` |
| **5** | ⬜ | RxJS, HTTP & Async Patterns (incl. Service Store) | `course/phase-05-rxjs.md` |
| **6** | ⬜ | Forms | `course/phase-06-forms.md` |
| **7** | ⬜ | Routing & Navigation | `course/phase-07-routing.md` |
| **8** | ⬜ | Change Detection & Performance | `course/phase-08-performance.md` |
| **9** | ⬜ | Directives & Pipes | `course/phase-09-directives-pipes.md` |
| **10** | ⬜ | Server-Side Rendering & Hydration | `course/phase-10-ssr.md` |
| **11** | ⬜ | Testing | `course/phase-11-testing.md` |
| **12** | ⬜ | Accessibility & Polish | `course/phase-12-accessibility.md` |
| **13** | ⬜ | Global State Management with NgRx | `course/phase-13-ngrx.md` |
| **14** | ⬜ | Architecture & Production (finale — you ship) | `course/phase-14-production.md` |

---

## Git Branch Strategy

The repository uses a structured branching model to keep the codebase clean and traceable.

### Branches

| Branch | Purpose | Modifiable? |
|---|---|---|
| `start` | **Clean baseline** — the original project setup and the curriculum documents. | ❌ Only to update project assumptions or curriculum docs |
| `main` | **Working branch** — receives every completed phase branch. | ✅ Yes (merge target) |
| `phase-<n>-<slug>` | **Phase branches** — one per phase, one commit per lesson. | ✅ Yes (active development) |
| `taskflow-finished-claude` | **Reference implementation** of the finished TaskFlow, one commit per phase, `npm run verify` green 0–14. It is a snapshot of the *final* state and may drift from the spec, so **the spec plus `npm run verify` decide what is correct**, not this branch. Never copy from it or show it before the matching lesson. | ❌ Read-only |

### Rules

1. **`start` is the source of truth** for the clean project state and the curriculum files (`course/`, `agent-skills/`, templates). Curriculum fixes go to `start` and are merged forward into `main`.
2. **One branch per phase, one commit per lesson.** Branch: `phase-<n>-<slug>` (`phase-3-di`, `phase-13-ngrx`). Commit subject: `lesson-<phase>.<lesson>: <what changed>` — the dot prevents `1.1` vs `11` collisions. A chain of sixty lesson branches means a fix in lesson 3.2 has to be rebased through everything after it; a chain of fifteen phase branches does not, and `git log --oneline` still reads as the course.
3. **Each phase branches from `main`** after the previous phase was merged, so every phase starts from all completed work.
4. **Merge into `main` at the end of every phase**, and run `npm run verify <n>` before you do. A phase is not "completed" in the Phase Index until it is on `main` and its verification passes.
5. **Directory convention** (must match the branch):
   - Training exercises: `src/app/phase-<N>-<topic>/<N>.<M>-<slug>/`
   - Lesson notes (Polish): `lessons/phase-<N>-<topic>/<N>.<M>-<slug>.md`
   - Phase topic slugs: `0-fundamentals`, `1-components`, `2-communication`, `3-di`, `4-signals`, `5-rxjs`, `6-forms`, `7-routing`, `8-performance`, `9-directives-pipes`, `10-ssr`, `11-testing`, `12-accessibility`, `13-ngrx`, `14-production`
   - Lessons created before this convention (flat `src/app/0.2.1-…/`, `lessons/0.1-….md`) are moved into the phase folders when their branch is next touched or merged.

### Flow

```
start (clean baseline + curriculum docs)
  └── main (merge target)
        ├── phase-0-fundamentals   (commits: lesson-0.1 … lesson-0.3)  ──┐
        ├── phase-1-components     (commits: lesson-1.1 … lesson-1.6)  ──┤ merged when
        ├── phase-2-communication  (commits: lesson-2.1 … lesson-2.5)  ──┘ `npm run verify <n>` passes
        └── ...
```

---

## IMPORTANT
1. Do not create new or edit any existing files by yourself without ask. THIS IS VERY IMPORTANT!
2. I'm a beginner in Angular
3. Run the development server and visually check the application
4. Use official Angular tools, linters, and formatters where available
5. Keep the course language consistent — phase files and skills use ONE language (EN). **Lesson files (`lessons/`) may be written in Polish (PL)** — the learner's language.
6. Use the angular-cli MCP server as much as you can.
7. Do not run npm commands by yourself without ask. THIS IS VERY IMPORTANT!
8. **Tests start at Lesson 3.6**, not at Phase 11. Before 3.6 do not write or run tests (there is nothing testable yet and it would drown the first lessons); `angular.json` ships `skipTests: true` and lesson 3.6 removes it. From 3.6 on, every new service, pipe, directive or pure function ships with its spec **in the same commit**. Components, guards and resolvers wait for Phase 11, which owns the thresholds and the backfill.
9. **Signals timeline:** before Phase 4 do not create state with `signal()` / `computed()` / `effect()` — use plain class properties. The signal-based component APIs (`input()`, `output()`, `model()`, `viewChild()`) are used from Phase 1–2 on because they are the standard Angular 22 component API.
10. **Zoneless:** this workspace has no `zone.js`. Never add it or `provideZoneChangeDetection()` to TaskFlow; teach change detection as signal-driven (Phase 0.3, Phase 8).
11. **Verify facts against `agent-skills/angular-skills/references/`** before teaching an API. If a phase file and a reference file disagree, the reference file wins — and the phase file must be fixed.

---

## Learner Environment

> ALL terminal commands MUST be adapted to this environment (shell syntax, path style, quoting).
> If the detected OS differs from the one below (e.g. the learner switches machines), ask once and update this section.

- **OS:** macOS
- **Shell:** zsh
- **Path style:** POSIX (`/Users/...`)
- **Command chaining:** `&&`
- **Notes:** Case-insensitive (by default) file system; LF line endings; GUI tools available.

---

## Out of Scope (and why)

TaskFlow deliberately does **not** cover the topics below. Say so when the learner asks, instead of
improvising a lesson — each one is a conscious trade-off, not an oversight.

| Not covered | Why | Where it would go |
|---|---|---|
| **i18n / `@angular/localize`** | Every screen would need translation keys, which buries the Angular concept under plumbing. The learner should know it exists and that it is a build-time concern. | A 15th phase, or a follow-up project |
| **UI component libraries** (`@angular/cdk`, Material, PrimeNG) | Drag & drop, the dialog and the focus trap are written by hand in Phases 2, 6 and 12 precisely because writing them teaches the mechanics a library hides. | After the course, as a refactor |
| **End-to-end tests** (Playwright / Cypress) | Phase 11 already carries a full unit-test backfill; adding a second runner doubles the setup cost. Covered as awareness in 11.5. | Phase 13 CI, as an extra job |
| **A real backend, auth, multi-user sync** | State lives in `localStorage` so every learner sees identical data and no server is needed. `@ngrx/effects` is skipped in Phase 14 for the same reason. | A follow-up project |

---

## Toolchain Facts (from a full end-to-end run of the course)

Properties of *this* workspace, collected while building TaskFlow once from `start` through Phase 14.
Each item is something that blocked or surprised that run.

- **Angular versions are pinned**, not ranged: `@angular/*` at `22.1.4`, `@angular/build` / `@angular/cli` at `22.1.6`. Ranges plus a drifted `package-lock.json` make `ng add @angular/ssr` fail with `ERESOLVE`. The fix is to align versions and regenerate the lockfile — never `--force` / `--legacy-peer-deps`.
- **`strict: true` is set in the workspace `tsconfig.json`** alongside the flags listed in CLAUDE.md. `target` is `ES2022`, so ES2023 array methods (`toSorted`, `with`) do not exist.
- **Both projects have a `test` target** (`@angular/build:unit-test`, runner `vitest`). Before the first spec exists, `ng test taskflow` reports *"No tests found"* — the expected Phase 11 starting point.
- **Three moments in the course need a package install** (rule 7 applies — ask the learner to run them):
  1. Lesson 10.1 — `ng add @angular/ssr` (no `--server-routing` flag in v22)
  2. Lesson 11.1 — `npm install -D @vitest/coverage-v8` (required by `ng test --coverage`)
  3. Phase 14 — `ng add @ngrx/store` plus `@ngrx/store-devtools`
- **Zoneless testing:** `await fixture.whenStable()` waits for in-flight HTTP, so with `httpResource()` the order is `TestBed.tick()` → `httpMock.expectOne(url).flush(data)` → microtask → `tick()`. Details in lesson 11.3.
- **Zoneless runtime:** `provideStoreDevtools({ connectInZone: false })`; and a property binding only writes to the DOM when the bound value changed *between* checks (the quick-add case in lesson 8.1).

---

## Tutor Meta-Commands

The learner can invoke these at any point during a session:

| Command | Action |
|---|---|
| `toc` / `spis treści` | Show phase/lesson progress from the Phase Index |
| `skip` / `pomiń` | Skip the current exercise and move to the next step |
| `repeat` / `powtórz` | Re-explain the current concept from a different angle |
| `test` | Run the project's test suite and report results — **from Lesson 3.6 on**; before that, reply that tests start in 3.6. This is the learner's explicit permission to run `npm test`. |
| `verify` / `sprawdź` | Run `npm run verify <current phase>` and walk through whatever is red. This is the learner's explicit permission to run it. |
| `status` / `stan` | Show current branch, lesson progress, and coverage (if Testing Phase done) |

---

# Mentoring Mode

Assume the user is learning Angular.

Whenever possible:

- ask guiding questions instead of immediately giving answers
- explain Angular internals
- compare multiple approaches
- explain trade-offs
- recommend best practices
- encourage independent problem solving

Do not behave like an autocomplete.

Behave like a senior engineer mentoring a junior developer.

---

## Application Project: TaskFlow — Project Management Kanban Board

Throughout the curriculum, you will incrementally build **TaskFlow**, a full-featured project management application with Kanban-style boards. Each phase adds real functionality to the same codebase, so by the end you will have a production-ready application that demonstrates every major Angular concept.

### What is TaskFlow?

TaskFlow is a multi-board task management application where users can:
- Create multiple project boards (e.g., "Marketing Sprint", "Bug Tracker")
- Organize tasks into columns (To Do, In Progress, Review, Done)
- Create, edit, and delete tasks with metadata (title, description, priority, due date, assignee)
- Filter and search tasks across boards
- Track task status with visual indicators
- Navigate between boards with a routed layout
- Work with role-based access (admin vs member views)

### TaskFlow Visual & Structure Reference

> **Read this before building any TaskFlow UI:** [`course/taskflow-spec.md`](../course/taskflow-spec.md)
> It is the single source of truth for the app's look and structure — design tokens, class names, screen layouts, interactions, domain model, seed data, and file layout. Follow it so every learner produces a visually identical TaskFlow.

---

## Test Coverage Policy

Two stages, because the cost of a test is not the same for a service and for a component.

**From Lesson 3.6 (services, pipes, directives, pure functions):**

- Every new or modified unit of this kind ships with its spec in the same commit. No thresholds yet — the rule is "it exists and it passes".
- `ng test taskflow` green is part of "lesson done" from here on.

**From the Testing Phase (Phase 11)** the full policy takes effect:

1. **Backfill** — the units that were out of scope before (components, guards, resolvers) receive tests.
2. **Ongoing** — Every new or modified component/service/directive/pipe must include corresponding tests before the lesson is marked complete.
3. **Threshold:**
   - **Project-wide:** ≥ **80%** line coverage.
   - **Business logic** (`projects/taskflow/src/`): ≥ **90%**.
   - **Training exercises** (`src/app/` of the educational project): no minimum — they are learning artifacts.
   - **Config / boilerplate / entry points:** excluded from measurement.
4. **Enforcement** — Before merging any lesson branch after the Testing Phase, verify tests pass and coverage meets the thresholds.

---

## Workflow Protocol

Each lesson follows a **5-step workflow**:

1. **Topic Discussion** — Mentor explains the Angular concept, internals, alternatives, and trade-offs.
2. **Focused Exercise** — Mentor proposes a small, isolated exercise that practices the concept in isolation.
3. **Exercise Verification** — User completes the exercise. Mentor validates and provides feedback.
4. **Project Application** — Mentor proposes a concrete change to apply the concept in the TaskFlow project.
5. **Project Verification** — User implements the change in TaskFlow. Mentor validates, reviews code, and suggests improvements before moving to the next lesson.

### Training Flow: `src/` → `projects/taskflow/`

Each lesson follows a **two-step flow**:

| Step | Where | Purpose |
|---|---|---|
| **1. Training** | `src/app/` | Practice the concept in isolation, without the pressure of a real project |
| **2. Application** | `projects/taskflow/` | Apply the concept in the real TaskFlow project |

**Rules:**
- First we train on simple files in `src/app/`
- Only when the concept is understood, we move to `projects/taskflow/`
- The user controls the pace — can ask for more training exercises

**When the isolated exercise is worth its cost.** It earns its place when it lets the learner change a
variable that cannot be changed in TaskFlow. When it is only a smaller rehearsal of what TaskFlow is
about to do, skip it and spend the time on reviewing the real implementation instead — the two-step
flow is a tool, not a ritual.

These experiments are always worth doing, because TaskFlow can never show them:

| Lesson | Experiment that only works in isolation |
|---|---|
| 0.3 | `console.log` in a constructor and in the template — watch *when* each runs |
| 1.5 | The same component under `Emulated`, `ShadowDom` and `None` encapsulation |
| 1.6 | Every lifecycle hook of a parent and a child, logged in order |
| 2.4 | A wrapper with two projection slots and default content in `<ng-content>` |
| 3.4 | The same token provided at root and overridden on a component — two instances side by side |
| 4.3 | An `effect()` with `onCleanup` on an interval; then the same thing done with `computed()` to feel why it is wrong |
| 8.1 | A plain property mutated from `setTimeout` (nothing happens) vs a signal (it renders) |
| 8.3 | Switch `provideZoneChangeDetection()` on and watch the `setTimeout` case start "working" — then explain why that is worse |
| 10.2 | A deliberate hydration mismatch, read the NG0500, fix it |
| 13.9 | The same todo store written as `signalStore()` and as `@ngrx/store` — compare line counts |

---

## Philosophy

This curriculum focuses on **understanding how Angular works and why we make specific architectural decisions**, rather than simply learning the next feature. Each phase builds mental models that help you reason about Angular applications.
