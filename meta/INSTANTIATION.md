# Template Instantiation Procedure (Angular)

> **One-time setup.** This procedure documents how this course was instantiated from the
> **AI Tutor Course Template** for **Angular**. It is NOT loaded during normal tutoring sessions.
>
> The instantiation is **complete** — all placeholders are replaced, the phase structure is
> designed, skills are populated, and the project is scaffolded.

---

## What was done

1. **Placeholders replaced** with Angular-specific values (table below), including the
   **Learner Environment** section in `agent-skills/course.md`.
2. **Skills populated** in `agent-skills/angular-skills/references/` (37 topic files) from the official
   Angular 22 documentation. See `agent-skills/angular-skills/SKILL.md` for the index and source priority.
3. **Phase structure designed** — 15 phases derived from what is unique to Angular
   (standalone components, DI, signals, RxJS, forms, routing, SSR, testing, a11y, architecture,
   NgRx). See the Phase Index in `agent-skills/course.md`.
4. **Phase files** created in `course/` from `course/phase-TEMPLATE.md`, each with
   **Phase Completion Criteria** and **Key Takeaways**.
5. **Project scaffolded** — a two-project workspace:
   - `src/app/` (educational/training app)
   - `projects/taskflow/` (the **TaskFlow** application — a Kanban-style project manager)
6. **Lesson files** created in `lessons/` from `lessons/lesson-TEMPLATE.md`.

---

## Resolved Placeholders

| Placeholder | Resolved value |
|---|---|
| LANGUAGE | Angular (TypeScript) |
| FRAMEWORK | Angular 22 |
| PACKAGE_MANAGER | npm |
| BUILD_COMMAND | `npm start` / `ng serve` |
| PROJECT_NAME | TaskFlow |
| PROJECT_DESCRIPTION | Multi-board Kanban-style task manager |
| TEST_FRAMEWORK | Vitest 4 |
| LINTER | Prettier + TypeScript (strict); ESLint optional (`ng add angular-eslint`) |
| EXTENSION | .ts / .html / .scss |
| OS | macOS |
| SHELL | zsh |

---

## Skill Sources

Prioritized official documentation as skills:

| Area | Skill Source |
|---|---|
| Angular core | Angular.dev (official) |
| TypeScript | TypeScript Handbook |
| RxJS | rxjs.dev |
| NgRx | ngrx.io |

All official skills live in `agent-skills/angular-skills/references/`.

---

## Post-Instantiation Verification Checklist

- [x] No placeholder tokens remain in curriculum config files
- [x] Phase structure designed (15 phases, each with 3+ lessons), derived from Angular
- [x] Every phase file registered in the Phase Index of `agent-skills/course.md`
- [x] Skills populated — at least one skill file per phase in `agent-skills/angular-skills/references/`
- [ ] Every skill file has version metadata — **TODO:** add `Language`/`Source`/`Last verified`
      headers to `references/*.md` (tracked in `agent-skills/angular-skills/SKILL.md`)
- [x] `agent-skills/persona.md` contains no empty or placeholder sections
- [x] `TaskFlow` project name and description set consistently in all files
- [x] Training (`src/app/`) and application (`projects/taskflow/`) directories exist
- [x] Phase and lesson templates use **English** consistently with the course
- [x] **Learner Environment** filled in `agent-skills/course.md`
- [x] `start` branch (clean baseline) and `main` (merge target) exist
- [x] First lesson branch created from `main`

> **Remaining item:** the per-skill `Last verified` metadata headers are the only open item.
> They are additive and non-blocking — add them to each `references/*.md` file when next edited.
