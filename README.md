# Angular AI Tutor

An educational Angular workspace designed for use with Cline and local LLMs (Qwen, Llama, DeepSeek, GPT, Claude, etc.).

The project transforms a coding model into an experienced Angular mentor capable of teaching modern Angular while producing production-ready code.

Rather than embedding all Angular knowledge into a single prompt, the project follows a modular Skill-based architecture inspired by the official Angular documentation.

---

# Project Goals

The primary goal of this repository is education.

The AI should:

- teach Angular instead of only generating code
- explain architectural decisions
- recommend best practices
- generate production-ready solutions
- review code
- debug applications
- explain trade-offs
- guide the user through modern Angular development

---

# Repository Structure

```
├── src/                  # Educational app (Angular course exercises)
│   ├── app/
│   ├── main.ts
│   └── styles.scss
│
├── projects/
│   └── taskflow/         # Independent sub-project (TaskFlow Kanban app)
│       ├── src/
│       │   ├── app/
│       │   ├── main.ts
│       │   └── styles.scss
│       ├── public/
│       ├── tsconfig.app.json
│       └── tsconfig.spec.json
│
├── .clinerules/
│   ├── agents/
│   │   └── angular-senior.md
│   ├── course.md
│   └── rules.md
│
├── angular.json
├── package.json
└── README.md
```

---

# Workspace Projects

This Angular workspace contains two independent applications:

## `angular-ai-tutor` (Educational App)

The main project used for course exercises and learning Angular concepts.

```bash
ng serve angular-ai-tutor
# Runs on http://localhost:4200/
```

## `taskflow` (Sub-Project)

An independent application built throughout the course — a project management Kanban board.
This project evolves incrementally as new Angular concepts are introduced.

```bash
ng serve taskflow
# Runs on http://localhost:4300/
```

The two projects share dependencies but are otherwise fully independent.
Changes in one do not affect the other.

---

# Directory Overview

## `.clinerules/agents`

Contains always-active behavioral rules.

Current agent:

- `angular-senior.md`

Responsibilities:

- Senior Angular Architect
- Mentor
- Technical Lead
- Code Reviewer
- Debugging Assistant

---

## `.clinerules/skills/angular-developer`

The primary Skill loaded on demand by Cline.

Responsibilities:

- determine user intent
- load appropriate references
- orchestrate documentation
- extend official Angular guidance with senior engineering experience

---

## `references`

Contains official Angular reference material.

Examples:

- Components
- Signals
- Forms
- Routing
- Dependency Injection
- SSR
- Testing
- Accessibility
- Tailwind
- MCP
- Resource API

These files should remain as close as possible to the official Angular documentation.

---

## `docs`

Project-specific knowledge extending the official documentation.

Examples:

- architecture
- performance
- clean code
- debugging
- RxJS
- testing strategies

---

## `templates`

Reusable templates used by the AI.

Examples:

- component templates
- feature templates
- architecture templates
- testing templates

---

# Training Philosophy

The AI should always prioritize learning over code generation.

Each answer should:

1. Explain the problem.

2. Explain Angular concepts.

3. Explain internal framework behaviour.

4. Compare alternatives.

5. Recommend the best solution.

6. Generate production-ready code.

7. Suggest improvements.

---

# Technology Focus

The project targets modern Angular development.

Primary technologies include:

- Angular
- TypeScript
- Signals
- RxJS
- Angular CLI
- Angular Material
- Tailwind CSS
- SCSS
- Vitest
- Playwright
- Node.js

---

# Code Standards

Generated code should follow:

- SOLID
- DRY
- KISS
- YAGNI
- Clean Architecture
- Feature-first architecture
- Strict TypeScript

---

# Supported Models

Designed primarily for:

- GPT-5.5
- Claude
- Qwen 3.x
- DeepSeek
- Llama 3.x

---

# Notes

The official Angular reference files are considered the source of truth.

The AI should always prefer these references over its internal knowledge whenever applicable.