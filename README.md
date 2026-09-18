# Angular AI Tutor — Angular Mastery Curriculum

> Progressive learning path for mastering modern Angular, built around incrementally developing a real-world application.
>
> **Instantiated from the [AI Tutor Course Template](https://github.com/marcingryczon/template-ai-tutor)** — see `meta/INSTANTIATION.md` for the one-time setup that produced this course.

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
| **0** | ✅ | Project Setup & Angular Fundamentals | [`course/phase-00-fundamentals.md`](course/phase-00-fundamentals.md) |
| **1** | ◐ | Standalone Components & Templates | [`course/phase-01-components.md`](course/phase-01-components.md) |
| **2** | ⬜ | Component Communication | [`course/phase-02-communication.md`](course/phase-02-communication.md) |
| **3** | ⬜ | Dependency Injection | [`course/phase-03-di.md`](course/phase-03-di.md) |
| **4** | ⬜ | Signals & Reactive State | [`course/phase-04-signals.md`](course/phase-04-signals.md) |
| **5** | ⬜ | RxJS, HTTP & Async Patterns (incl. Service Store) | [`course/phase-05-rxjs.md`](course/phase-05-rxjs.md) |
| **6** | ⬜ | Forms | [`course/phase-06-forms.md`](course/phase-06-forms.md) |
| **7** | ⬜ | Routing & Navigation | [`course/phase-07-routing.md`](course/phase-07-routing.md) |
| **8** | ⬜ | Change Detection & Performance | [`course/phase-08-performance.md`](course/phase-08-performance.md) |
| **9** | ⬜ | Directives & Pipes | [`course/phase-09-directives-pipes.md`](course/phase-09-directives-pipes.md) |
| **10** | ⬜ | Server-Side Rendering & Hydration | [`course/phase-10-ssr.md`](course/phase-10-ssr.md) |
| **11** | ⬜ | Testing | [`course/phase-11-testing.md`](course/phase-11-testing.md) |
| **12** | ⬜ | Accessibility & Polish | [`course/phase-12-accessibility.md`](course/phase-12-accessibility.md) |
| **13** | ⬜ | Global State Management with NgRx | [`course/phase-13-ngrx.md`](course/phase-13-ngrx.md) |
| **14** | ⬜ | Architecture & Production (finale — you ship) | [`course/phase-14-production.md`](course/phase-14-production.md) |

> The full phase index is maintained as the **single source of truth** in `agent-skills/course.md`. The table above is a convenience mirror.

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
| `start` | **Clean baseline** — project setup and the curriculum documents. | ❌ Only to update project assumptions or curriculum docs |
| `main` | **Working branch** — receives every completed lesson branch. | ✅ Yes |
| `phase-<n>-<slug>` | **Phase branches** — one per phase, one commit per lesson. Merged to `main` when `npm run verify <n>` passes. | ✅ Yes |
| `taskflow-finished-claude` | **Reference implementation** of the finished TaskFlow — one commit per phase, `npm run verify` green 0–14. Consult it to verify a result against the spec; never copy from it or show it before the matching lesson. | ❌ No |

### Flow

```
start (clean baseline + curriculum docs)
  └── main (merge target)
        ├── phase-0-fundamentals   (commits: lesson-0.1 … lesson-0.3)  ──┐
        ├── phase-1-components     (commits: lesson-1.1 … lesson-1.6)  ──┤ merged when
        ├── phase-2-communication  (commits: lesson-2.1 … lesson-2.5)  ──┘ verification passes
        └── ...
```

### Rules

1. **`start` branch** is the source of truth for the clean project state **and the curriculum files** (`course/`, `agent-skills/`, templates). Curriculum fixes land on `start` and are merged forward into `main`.
2. **`main` tracks progress** — every completed lesson branch merges into `main`
3. **Each phase branches from `main`** after the previous phase merged — ensures a phase starts from all completed work
4. **One branch per phase, one commit per lesson** — branch `phase-3-di`, commits `lesson-3.1: …`, `lesson-3.2: …`. The dot in the commit subject avoids `1.1` vs `11` collisions.
5. **A phase is done when `npm run verify <n>` passes** — see [Verification](#-verification) below

---

## ✅ Verification

Every phase ends with a milestone in [`course/taskflow-spec.md`](course/taskflow-spec.md) §10, and every
milestone is executable:

```bash
npm run verify 7     # the "after phase 7" milestone
npm run verify       # all of them — red is expected for phases you have not reached
```

Static checks read your code (is every component `OnPush`, are the old stores deleted, does any `@for`
still track by `$index`), browser checks drive the real app in headless Chrome (four columns without a
horizontal scrollbar, a debounced search, a dialog that returns focus, an unknown board id that
redirects). Details in [`verify/README.md`](verify/README.md).

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| **Angular** | 22.1 (zoneless, pinned) | Framework |
| **TypeScript** | 6.0 | Type-safe development |
| **RxJS** | 7.8 | Reactive programming |
| **Vitest** | 4.0 | Unit testing |
| **Angular CLI** | 22.1 | Build tool & scaffolding |
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
├── agent-skills/                 # Shared tutor knowledge (used by Claude, Cline, Copilot)
│   ├── angular-skills/
│   │   ├── SKILL.md              # Skills index & per-phase mapping
│   │   └── references/           # 37 authoritative Angular topic files
│   ├── persona.md                # Tutor persona & coding standards (single source of truth)
│   ├── course.md                 # Curriculum master roadmap (single source of truth)
│   └── rules.md                  # Skill selection policy
├── .clinerules/                 # Cline-specific config (thin pointers into agent-skills/)
│   ├── agents/
│   │   └── senior.md            # Pointer → agent-skills/persona.md
│   ├── course.md                # Pointer → agent-skills/course.md
│   └── rules.md                 # Pointer → agent-skills/rules.md
├── .github/                     # Copilot-specific config
│   ├── agents/
│   │   └── angular-developer.agent.md  # Pointer → agent-skills/persona.md
│   └── copilot-instructions.md  # Repository custom instructions
├── course/                      # Curriculum phase documentation
│   ├── phase-TEMPLATE.md        # Reusable phase template
│   ├── phase-00-fundamentals.md
│   └── ... (15 phase files)
├── lessons/                     # Lesson content (Polish), one folder per phase
│   ├── lesson-TEMPLATE.md       # Reusable lesson template
│   └── phase-N-<topic>/N.M-<slug>.md
├── meta/
│   └── INSTANTIATION.md         # One-time setup record (not loaded in tutoring sessions)
├── src/                         # Educational app (training exercises)
│   ├── app/phase-N-<topic>/N.M-<slug>/   # One folder per lesson
│   ├── main.ts                  # Educational app entry point
│   └── styles.scss              # Global styles
├── projects/
│   └── taskflow/                # TaskFlow Kanban application
│       ├── src/
│       │   ├── app/             # core/ · features/ · shared/ (see course/taskflow-spec.md §8)
│       │   ├── main.ts          # TaskFlow entry point
│       │   └── styles.scss      # TaskFlow styles
│       ├── public/              # TaskFlow static assets
│       ├── tsconfig.app.json    # TaskFlow TypeScript config
│       └── tsconfig.spec.json   # TaskFlow test TypeScript config
├── angular.json                 # Angular workspace configuration
└── package.json                 # Dependencies and scripts
```

---

## 📖 Where to Find What (single sources of truth)

| Topic | Authoritative location |
|---|---|
| Phase index, Git branch strategy, learner environment, test coverage policy, workflow protocol | `agent-skills/course.md` |
| Skill selection policy | `agent-skills/rules.md` |
| Tutor persona, coding standards, Angular best practices | `agent-skills/persona.md` |
| Skills index & per-phase skill mapping | `agent-skills/angular-skills/SKILL.md` |
| Authoritative Angular topic references | `agent-skills/angular-skills/references/` |
| Phase lesson plans | `course/phase-NN-<slug>.md` |
| Phase dependencies & order | `course/prerequisites.md` |
| TaskFlow look, structure, seed data, per-phase milestones | `course/taskflow-spec.md` |
| Phase template | `course/phase-TEMPLATE.md` |
| Lesson content | `lessons/*.md` |
| Lesson template | `lessons/lesson-TEMPLATE.md` |
| One-time setup record & verification checklist | `meta/INSTANTIATION.md` |

---

## 🧪 Test Coverage Policy

After completing **Phase 11 (Testing)**, the following policy takes effect:

1. **Backfill** — All existing components, services, directives, and pipes in TaskFlow must receive unit tests
2. **Ongoing** — Every new or modified component/service/directive/pipe must include corresponding tests before the lesson is marked complete
3. **Threshold:**
   - **Project-wide:** ≥ **80%** line coverage
   - **Business logic** (`projects/taskflow/src/`): ≥ **90%**
   - **Training exercises** (`src/app/` of the educational project): no minimum — they are learning artifacts
   - **Config / boilerplate / entry points:** excluded from measurement
4. **Enforcement** — Before merging any lesson branch after Phase 11, verify tests pass and coverage meets the thresholds

> The authoritative policy lives in `agent-skills/course.md`.

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

> **Learner environment:** macOS, zsh. All terminal commands must be adapted to this shell (see `agent-skills/course.md`).

---

## 📖 Philosophy

This curriculum focuses on **understanding how Angular works and why we make specific architectural decisions**, rather than simply learning the next feature. Each phase builds mental models that help you reason about Angular applications.

By the end of this course, you will:
- Deeply understand Angular's DI system, change detection, signals, and reactive patterns
- Be able to architect production-grade Angular applications
- Have built a complete, real-world application (TaskFlow) from scratch
- Possess the mental models to learn new Angular features independently
