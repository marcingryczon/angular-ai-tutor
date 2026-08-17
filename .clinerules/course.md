# Angular Mastery Curriculum: Progressive Learning Path

This document serves as a master roadmap for the progressive development of the **Angular AI Tutor Project**. Each lesson is represented by a unique Git branch, ensuring that the codebase evolves incrementally from foundational concepts to highly advanced architecture.

## Project Overview
The project is a living laboratory. As we advance through the curriculum, the application's complexity, features, and architectural patterns will increase significantly.

---

## Phase Index

Detailed lesson plans are split across phase files to reduce context window usage. Read the relevant phase file when working on that section.

The phases below were derived from the concepts most unique to **Angular** — standalone components, dependency injection, signals, RxJS, routing, and global state management — and progress from fundamentals to production-ready architecture.

**Status legend:** ⬜ not started ◐ in progress ✅ completed

| Phase | Status | Topic | File |
|---|---|---|---|
| **0** | ⬜ | Project Setup & Angular Fundamentals | `course/phase-00-fundamentals.md` |
| **1** | ⬜ | Standalone Components & Templates | `course/phase-01-components.md` |
| **2** | ⬜ | Component Communication | `course/phase-02-communication.md` |
| **3** | ⬜ | Dependency Injection | `course/phase-03-di.md` |
| **4** | ⬜ | Signals & Reactive State | `course/phase-04-signals.md` |
| **5** | ⬜ | RxJS & Async Patterns (incl. Service Store) | `course/phase-05-rxjs.md` |
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
| `start` | **Clean baseline** — the original project setup. Represents the starting point of the curriculum. | ❌ No (only to update project assumptions) |
| `main` | **Working branch** — mirror of `start`. All lesson branches are merged here. | ✅ Yes (merge target for lesson branches) |
| `lesson-XX-*` | **Lesson branches** — each lesson gets its own branch created from `main`. After completion, merged back to `main`. | ✅ Yes (active development) |

### Rules

1. **`start` branch is the source of truth** for the clean project state. Do not modify it directly unless updating foundational project setup.
2. **`main` tracks progress** — every completed lesson branch merges into `main`.
3. **Each lesson branches from `main`** — ensures lessons build on top of all previous work.
4. **Lesson branches follow naming convention** — `lesson-XX-topic-name` (e.g., `lesson-01-workspace-anatomy`).

### Flow

```
start (clean baseline, read-only)
  └── main (merge target)
        ├── lesson-01-workspace-anatomy ──┐
        ├── lesson-02-typescript-strict ──┤── merged after completion
        ├── lesson-11-standalone-basics ──┘
        └── ...
```

---

## IMPORTANT
1. Do not create new or edit any existing files by yourself without ask. THIS IS VERY IMPORTANT!
2. I'm a beginner in Angular
3. Run the development server and visually check the application
4. Use official Angular tools, linters, and formatters where available
5. Keep the course language consistent — all curriculum files (phases, lessons, skills) use ONE language (EN)
6. Use the angular-cli MCP server as much as you can.
7. Do not run npm commands by yourself without ask. THIS IS VERY IMPORTANT!

---

## Learner Environment

> Filled in during instantiation.
> ALL terminal commands MUST be adapted to this environment (shell syntax, path style, quoting).

- **OS:** Windows 11
- **Shell:** PowerShell 7 (pwsh)
- **Path style:** Windows (`C:\...`)
- **Command chaining:** `;` (PowerShell 5) or `&&` (PowerShell 7)
- **Notes:** Case-insensitive file system; CRLF line endings; GUI tools available.

---

## Tutor Meta-Commands

The learner can invoke these at any point during a session:

| Command | Action |
|---|---|
| `toc` / `spis treści` | Show phase/lesson progress from the Phase Index |
| `skip` / `pomiń` | Skip the current exercise and move to the next step |
| `repeat` / `powtórz` | Re-explain the current concept from a different angle |
| `test` | Run the project's test suite and report results |
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
