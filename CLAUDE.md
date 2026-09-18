# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **progressive Angular curriculum** — an educational project where the learner builds `TaskFlow` (a Kanban app) across 15 phases. Two apps live in one Angular workspace:

- **`angular-ai-tutor`** (`src/`) — Isolated training exercises per lesson
- **`taskflow`** (`projects/taskflow/`) — The real-world Kanban app built incrementally

## Commands

```bash
# Dev servers
npm run start:edu        # Educational app on :4200
npm run start:taskflow   # TaskFlow app on :4300

# Builds
npm run build:edu
npm run build:taskflow

# Tests
npm test                 # All projects
npm run test:edu
npm run test:taskflow
```

No lint command is configured separately — use `ng lint` if needed via Angular CLI.

## Architecture

### Workspace Structure

```
src/app/phase-N-<topic>/N.M-<lesson>/    ← training exercises
lessons/phase-N-<topic>/N.M-<lesson>.md  ← lesson content (Polish)
projects/taskflow/src/app/               ← real-world app (core/ · features/ · shared/ from lesson 1.1)
course/                                  ← lesson plans (English) + taskflow-spec.md (incl. §10 milestones)
agent-skills/                            ← shared persona, curriculum & Angular references (used by Claude, Cline, Copilot)
.clinerules/                             ← Cline-specific config (thin pointers, phase pointer)
.github/                                 ← Copilot-specific config (repo instructions, agent registration)
```

### Two-Step Learning Pattern

Every lesson follows: **train in isolation** (`src/app/phase-N-*/`) → **apply to TaskFlow** (`projects/taskflow/`). Never skip to TaskFlow without the isolated exercise first.

### Lesson Branch Convention

Branches use dotted lesson numbers: `lesson-1.5-component-styling`, `lesson-0.2.1-ts-strict-why`. The dot prevents collision (e.g., `1.1` vs `11`). The undotted form (`lesson-15-…`) is wrong. Reference implementation of the finished app: `taskflow-finished` (read-only, never shown to the learner ahead of a lesson).

### Phase Progression

- **Phases 1–3:** No `signal()` / `computed()` / `effect()` for state — regular class properties. `input()`, `output()`, `model()`, `viewChild()` are used (standard component API).
- **Phase 4+:** Angular signals for reactive state
- **Phase 5+:** RxJS + `HttpClient` + `resource()` for async; signal service store
- **Phase 11+:** Vitest unit tests; before that, skip tests entirely (`skipTests: true` in `angular.json` schematics)
- **Phase 14:** `@ngrx/store` replaces the signal service store (migration)
- **Zoneless throughout:** no `zone.js` in the workspace — change detection is signal-driven

## Key Conventions

### Component Files — Always Separate

```typescript
@Component({
  selector: 'app-foo',
  templateUrl: './foo.html',  // never inline
  styleUrl: './foo.scss',     // never inline
})
export class Foo { }
```

### Protected Visibility for Component Internals

```typescript
export class Counter {
  protected count = signal(0);   // template-accessible, not public API
  protected increment() { ... }
}
```

### TypeScript — Strict Mode is Non-Negotiable

`strict: true` plus `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `strictInjectionParameters`. No `any`. Use `readonly` where applicable. Union types for domain models (`'low' | 'medium' | 'high'`).

### Test Policy

See `agent-skills/course.md` (`## IMPORTANT` item 8 and `## Test Coverage Policy`).

## Single Sources of Truth

| Need | File |
|---|---|
| Phase index, branching, test policy | `agent-skills/course.md` |
| Tutor persona & coding standards | `agent-skills/persona.md` |
| Angular references (37 topics) | `agent-skills/angular-skills/references/` |
| TaskFlow visual/domain spec | `course/taskflow-spec.md` — pixel-perfect required |
| Detailed lesson plans | `course/phase-NN-<slug>.md` |
| Lesson content (Polish) | `lessons/` |

## TaskFlow Spec

`course/taskflow-spec.md` is the **golden spec** for colors, spacing, typography, layouts, and seed data. All TaskFlow UI implementations must match it exactly. Read it before any TaskFlow visual work.

## Hard Rules for AI Tutoring Mode

These apply when acting as the AI tutor for the learner. The operational rules (file edits, npm commands, test timing, language policy, learner environment) are centralized in `agent-skills/course.md` (`## IMPORTANT`) — load it and follow it in full. Teaching style (guiding questions, explaining internals and trade-offs) is defined in `agent-skills/persona.md` (`## Teaching Mode`).

## Modern Angular Patterns (v22)

- Standalone components only (no NgModules); class names without `Component` suffix (`Board`, files `board.ts`)
- `inject()` function for DI (not constructor injection)
- `provideRouter()`, `provideBrowserGlobalErrorListeners()`, `provideHttpClient()` at app level
- New control flow syntax: `@if`, `@for`, `@switch`, `@defer` (not `*ngIf`/`*ngFor`)
- Signals for fine-grained reactivity (Phase 4+); `OnPush` everywhere from Phase 8
- Signal Forms (`@angular/forms/signals`) for TaskFlow forms; legacy Reactive Forms for awareness only
- `animate.enter` / `animate.leave` instead of the deprecated `@angular/animations`
- Verify every API against `agent-skills/angular-skills/references/` — reference files win over phase files and model memory
