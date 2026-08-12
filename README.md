# Angular AI Tutor — Angular Mastery Curriculum

> Progressive learning path for mastering modern Angular, built around incrementally developing a real-world application.

## Project Overview

This repository is a **living laboratory** for learning Angular from fundamentals to advanced architecture. Each lesson is represented by a unique Git branch, ensuring the codebase evolves incrementally from foundational concepts to production-ready patterns.

The curriculum focuses on **understanding how Angular works and why we make specific architectural decisions**, rather than simply learning the next directive or service pattern. Each phase builds mental models that help you reason about Angular applications.

---

## 🎯 Flagship Project: TaskFlow

Throughout the curriculum, you will incrementally build **TaskFlow** — a full-featured project management application with Kanban-style boards.

### What is TaskFlow?

A multi-board task management application where users can:
- Create multiple project boards (e.g., "Marketing Sprint", "Bug Tracker")
- Organize tasks into columns (To Do, In Progress, Review, Done)
- Create, edit, and delete tasks with metadata (title, description, priority, due date, assignee)
- Filter and search tasks across boards
- Track task status with visual indicators
- Navigate between boards with a routed layout
- Work with role-based access (admin vs member views)

By the end of the curriculum, TaskFlow will be a **production-ready application** demonstrating every major Angular concept.

---

## 📚 Curriculum Phases

Detailed lesson plans are split across phase files. Each phase builds on all previous work.

**Status legend:** ⬜ not started ◐ in progress ✅ completed

| Phase | Status | Topic | File |
|---|---|---|---|
| **0** | ⬜ | Project Setup & Angular Fundamentals | [`course/phase-00-fundamentals.md`](course/phase-00-fundamentals.md) |
| **1** | ⬜ | Standalone Components & Templates | [`course/phase-01-components.md`](course/phase-01-components.md) |
| **2** | ⬜ | Component Communication | [`course/phase-02-communication.md`](course/phase-02-communication.md) |
| **3** | ⬜ | Dependency Injection | [`course/phase-03-di.md`](course/phase-03-di.md) |
| **4** | ⬜ | Signals & Reactive State | [`course/phase-04-signals.md`](course/phase-04-signals.md) |
| **5** | ⬜ | RxJS & Async Patterns (incl. Service Store) | [`course/phase-05-rxjs.md`](course/phase-05-rxjs.md) |
| **6** | ⬜ | Forms | [`course/phase-06-forms.md`](course/phase-06-forms.md) |
| **7** | ⬜ | Routing & Navigation | [`course/phase-07-routing.md`](course/phase-07-routing.md) |
| **8** | ⬜ | Change Detection & Performance | [`course/phase-08-performance.md`](course/phase-08-performance.md) |
| **9** | ⬜ | Directives & Pipes | [`course/phase-09-directives-pipes.md`](course/phase-09-directives-pipes.md) |
| **10** | ⬜ | Server-Side Rendering & Hydration | [`course/phase-10-ssr.md`](course/phase-10-ssr.md) |
| **11** | ⬜ | Testing | [`course/phase-11-testing.md`](course/phase-11-testing.md) |
| **12** | ⬜ | Accessibility & Polish | [`course/phase-12-accessibility.md`](course/phase-12-accessibility.md) |
| **13** | ⬜ | Architecture & Production | [`course/phase-13-architecture.md`](course/phase-13-architecture.md) |
| **14** | ⬜ | Global State Management with NgRx | [`course/phase-14-ngrx.md`](course/phase-14-ngrx.md) |

---

## 🔄 Lesson Workflow

Each lesson follows a **5-step workflow**:

1. **Topic Discussion** — Mentor explains the Angular concept, internals, alternatives, and trade-offs
2. **Focused Exercise** — A small, isolated exercise that practices the concept in isolation
3. **Exercise Verification** — You complete the exercise, receive validation and feedback
4. **Project Application** — A concrete change to apply the concept in the TaskFlow project
5. **Project Verification** — You implement the change in TaskFlow, receive code review and suggestions

### Training Flow: `src/app/` → `projects/taskflow/`

Each lesson follows a **two-step flow**:

| Step | Where | Purpose |
|---|---|---|
| **1. Training** | `src/app/` | Practice the concept in isolation, without the pressure of a real project |
| **2. Application** | `projects/taskflow/` | Apply the concept in the real TaskFlow project |

**Rules:**
- First we train on simple files in `src/app/`
- Only when the concept is understood, we move to `projects/taskflow/`
- The user controls the pace — ask for more training exercises if needed

---

## 🌿 Git Branch Strategy

The repository uses a structured branching model to keep the codebase clean and traceable.

### Branches

| Branch | Purpose | Modifiable? |
|---|---|---|
| `start` | **Clean baseline** — the original project setup. Represents the starting point of the curriculum. | ❌ No |
| `main` | **Working branch** — mirror of `start`. All lesson branches are merged here. | ✅ Yes |
| `lesson-XX-*` | **Lesson branches** — each lesson gets its own branch created from `main`. After completion, merged back to `main`. | ✅ Yes |

### Flow

```
start (clean baseline, read-only)
  └── main (merge target)
        ├── lesson-01-workspace-anatomy ──┐
        ├── lesson-02-typescript-strict ──┤── merged after completion
        ├── lesson-11-standalone-basics ──┘
        └── ...
```

### Rules

1. **`start` branch** is the source of truth for the clean project state
2. **`main` tracks progress** — every completed lesson branch merges into `main`
3. **Each lesson branches from `main`** — ensures lessons build on top of all previous work
4. **Lesson branches follow naming convention** — `lesson-XX-topic-name` (e.g., `lesson-01-workspace-anatomy`)

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| **Angular** | 22.0 | Framework |
| **TypeScript** | 6.0 | Type-safe development |
| **RxJS** | 7.8 | Reactive programming |
| **Vitest** | 4.0 | Unit testing |
| **Angular CLI** | 22.0 | Build tool & scaffolding |
| **SCSS** | — | Styling |

---

## 📐 Workspace Projects

This Angular workspace contains two independent applications:

### `angular-ai-tutor` (Educational App)

The main project used for course exercises and learning Angular concepts in isolation.

```bash
npm run start:edu
# Runs on http://localhost:4200/
```

### `taskflow` (Sub-Project)

The flagship Kanban application built throughout the curriculum. This project evolves incrementally as new Angular concepts are introduced.

```bash
npm run start:taskflow
# Runs on http://localhost:4300/
```

The two projects share dependencies but are otherwise fully independent. Changes in one do not affect the other.

---

## 📂 Project Structure

```
angular-ai-tutor/
├── course/                      # Curriculum phase documentation
├── src/                         # Educational app (training exercises)
│   ├── app/                     # Training components, services, etc.
│   ├── main.ts                  # Educational app entry point
│   └── styles.scss              # Global styles
├── projects/
│   └── taskflow/                # TaskFlow Kanban application
│       ├── src/
│       │   ├── app/             # TaskFlow components, services, etc.
│       │   ├── main.ts          # TaskFlow entry point
│       │   └── styles.scss      # TaskFlow styles
│       ├── public/              # TaskFlow static assets
│       ├── tsconfig.app.json    # TaskFlow TypeScript config
│       └── tsconfig.spec.json   # TaskFlow test TypeScript config
├── .clinerules/                 # AI tutor configuration
│   ├── agents/
│   │   └── angular-senior.md    # Senior Angular mentor agent
│   ├── course.md                # Curriculum master roadmap
│   └── rules.md                 # Skill selection rules
├── angular.json                 # Angular workspace configuration
└── package.json                 # Dependencies and scripts
```

---

## 🧪 Test Coverage Policy

After completing **Phase 11 (Testing)**, the following policy takes effect:

1. **Backfill** — All existing components, services, directives, and pipes in TaskFlow must receive unit tests
2. **Ongoing** — Every new or modified component/service/directive/pipe must include corresponding tests before the lesson is marked complete
3. **Threshold** — Minimum code coverage is **90%** (measured per-file, not project-wide)
4. **Enforcement** — Before merging any lesson branch after Phase 11, verify tests pass and coverage meets the threshold

---

## 🎓 Mentoring Approach

This curriculum is designed in **mentoring mode**. The AI tutor will:

- Ask guiding questions instead of immediately giving answers
- Explain Angular internals and how the framework works under the hood
- Compare multiple approaches and explain trade-offs
- Recommend best practices backed by reasoning
- Encourage independent problem solving

> The goal is not to behave like an autocomplete, but like a senior engineer mentoring a junior developer.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start educational app (training)
npm run start:edu

# Start TaskFlow app (project)
npm run start:taskflow

# Build for production
npm run build:taskflow

# Run tests
npm test
```

---

## 📖 Philosophy

This curriculum focuses on **understanding how Angular works and why we make specific architectural decisions**, rather than simply learning the next feature. Each phase builds mental models that help you reason about Angular applications.

By the end of this course, you will:
- Deeply understand Angular's DI system, change detection, signals, and reactive patterns
- Be able to architect production-grade Angular applications
- Have built a complete, real-world application (TaskFlow) from scratch
- Possess the mental models to learn new Angular features independently