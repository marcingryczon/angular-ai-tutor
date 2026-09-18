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

**Phase dependencies and the recommended order** live in `course/prerequisites.md`. **What TaskFlow must look like after each phase** is defined in `course/taskflow-spec.md` §10 (Build Milestones) — check the milestone before starting a phase and verify it before closing one.

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
| **13** | ⬜ | Architecture & Production | `course/phase-13-architecture.md` |
| **14** | ⬜ | Global State Management with NgRx | `course/phase-14-ngrx.md` |

---

## Git Branch Strategy

The repository uses a structured branching model to keep the codebase clean and traceable.

### Branches

| Branch | Purpose | Modifiable? |
|---|---|---|
| `start` | **Clean baseline** — the original project setup and the curriculum documents. | ❌ Only to update project assumptions or curriculum docs |
| `main` | **Working branch** — receives every completed lesson branch. | ✅ Yes (merge target) |
| `lesson-<phase>.<lesson>-<slug>` | **Lesson branches** — one per lesson. | ✅ Yes (active development) |
| `taskflow-finished`, `taskflow-preview` | **Reference implementation** of the finished TaskFlow. The tutor may consult it to verify the learner's result against the spec, but must never copy from it or show it to the learner before the corresponding lesson. | ❌ Read-only |

### Rules

1. **`start` is the source of truth** for the clean project state and the curriculum files (`course/`, `agent-skills/`, templates). Curriculum fixes go to `start` and are merged forward into `main`.
2. **Naming is dotted**: `lesson-<phase>.<lesson>-<slug>`, e.g. `lesson-0.2.1-ts-strict-why`, `lesson-1.5-component-styling`, `lesson-14.2-actions`. The dot prevents collisions (`1.1` vs `11`). The slug must match the *Branch Name* in the phase file. Never use the undotted form (`lesson-11-…`).
3. **Each lesson branches from the previous lesson branch** (or from `main` at the start of a phase), so lessons build on top of all previous work.
4. **Merge into `main` at least at the end of every phase** (merging after every lesson is fine too). A phase is not "completed" in the Phase Index until its last lesson is on `main`.
5. **Directory convention** (must match the branch):
   - Training exercises: `src/app/phase-<N>-<topic>/<N>.<M>-<slug>/`
   - Lesson notes (Polish): `lessons/phase-<N>-<topic>/<N>.<M>-<slug>.md`
   - Phase topic slugs: `0-fundamentals`, `1-components`, `2-communication`, `3-di`, `4-signals`, `5-rxjs`, `6-forms`, `7-routing`, `8-performance`, `9-directives-pipes`, `10-ssr`, `11-testing`, `12-accessibility`, `13-architecture`, `14-ngrx`
   - Lessons created before this convention (flat `src/app/0.2.1-…/`, `lessons/0.1-….md`) are moved into the phase folders when their branch is next touched or merged.

### Flow

```
start (clean baseline + curriculum docs)
  └── main (merge target)
        ├── lesson-0.1-workspace-anatomy ──┐
        ├── lesson-0.2.1-ts-strict-why ────┤── merged after completion
        ├── lesson-1.1-standalone-basics ──┘
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
8. Skip unit tests entirely until the Testing Phase (Phase 11) — do not write, update, or run tests in earlier lessons. `angular.json` sets `skipTests: true` for schematics so `ng generate` does not create `.spec.ts` files; lesson 11.1 removes it.
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
| `test` | Run the project's test suite and report results — **only from Phase 11 on**; before that, reply that tests are introduced in Phase 11. This is the learner's explicit permission to run `npm test`. |
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

After completing the **Testing Phase (Phase 11)** the following policy takes effect:

1. **Backfill** — All existing components, services, directives, and pipes in TaskFlow must receive unit tests.
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

---

## Philosophy

This curriculum focuses on **understanding how Angular works and why we make specific architectural decisions**, rather than simply learning the next feature. Each phase builds mental models that help you reason about Angular applications.
