# Lesson 0.1: Workspace Anatomy

## Lesson Objective

Understand the structure of an Angular workspace, the key configuration files, and the build flow of an application.

---

## What Is an Angular Workspace?

A workspace is the "factory" of an Angular project. It is not merely a folder of files — it is a coherent environment for building, compiling, and running the application.

---

## Key Configuration Files

### 1. `angular.json` — The Brain of the Project
- **`projects`** — project definitions (`angular-ai-tutor`, `taskflow`)
- **`architect`** — build targets: `build`, `serve`, `test`
- **`builder`** — the tool used (`@angular/build:application`, `@angular/build:dev-server`)
- **`options`** — paths to entry files, assets, and styles
- **`configurations`** — `production` and `development` profiles

### 2. `package.json` — Dependencies
- **Angular v22** — a very new version
- `dependencies`: `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/router`, `rxjs`
- `devDependencies`: `@angular/cli`, `typescript`, `vitest`, `jsdom`

### 3. `tsconfig.json` — TypeScript Strict Mode
- `noImplicitOverride`, `noFallthroughCasesInSwitch`, `isolatedModules`
- `angularCompilerOptions`: strict injection parameters, strict input modifiers
- `references`: TypeScript sub-projects

### 4. `src/main.ts` — Entry Point
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig);
```
Functional bootstrap (no NgModules) — Angular 17+.

### 5. `src/index.html` — HTML Template
- `<app-root>` — the root component selector
- `<base href="/">` — the base path for the router

---

## The Full `ng serve` Flow

### Phase 1: CLI (Angular Command Line Interface)
1. `ng serve` reads `angular.json` — finds the default project
2. From `architect.serve` it selects the `development` configuration
3. Reads `builder: @angular/build:dev-server`
4. From `buildTarget` it knows which build to use

### Phase 2: Build (compilation)
5. Reads `browser: "src/main.ts"` — the entry point
6. TypeScript compiles `main.ts` and all imports into JavaScript
7. SCSS is compiled into CSS
8. All files are bundled

### Phase 3: Dev Server
9. The dev server starts on `http://localhost:4200`
10. It serves `index.html`

### Phase 4: Framework (runtime in the browser)
11. The browser runs the script → `bootstrapApplication(App, appConfig)`
12. Angular finds `<app-root>` and replaces it with the component's content
13. It renders `app.html` with the data

---

## Key Concept

**CLI ≠ Framework**

- **CLI** is the build tool (like a hammer) — it runs in the terminal
- **Framework** is the code that runs in the browser (the tower)

These are two different worlds. The CLI is not needed at runtime.

---

## Project Tree

```
angular-ai-tutor/
├── angular.json          # Workspace configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript (root)
├── tsconfig.app.json     # TypeScript (application)
├── tsconfig.spec.json    # TypeScript (tests)
├── src/                  # Main application
│   ├── main.ts           # Entry point
│   ├── index.html        # HTML template
│   ├── styles.scss       # Global styles
│   └── app/              # Root component
│       ├── app.ts        # Root component
│       ├── app.config.ts # Application configuration
│       ├── app.routes.ts # Route definitions
│       ├── app.html      # Template
│       └── app.scss      # Component styles
├── projects/taskflow/    # Second project
└── public/               # Static assets
```

---

## Two Projects in One Workspace

1. **`angular-ai-tutor`** — the main educational project
2. **`taskflow`** — the TaskFlow application (Kanban board)

A single workspace can contain many projects (applications, libraries).

---

## Exercises

### Exercise 1: Configuration Trace

**Question:** Which field in `angular.json` points to `src/main.ts` as the entry point?

**Answer:** The full path is `projects.angular-ai-tutor.architect.build.options.browser → "src/main.ts"`.

**Call chain:**
1. `ng serve` → `architect.serve` → `buildTarget: "angular-ai-tutor:build:development"`
2. `buildTarget` decomposes into: project `angular-ai-tutor` → target `build` → configuration `development`
3. `architect.build.options.browser` → `"src/main.ts"`

---

### Exercise 2: The taskflow Project

**Question:** What is the entry-point path for the `taskflow` project? Why is it different?

**Answer:** `projects/taskflow/src/main.ts`. It differs because `taskflow` has its own `root: "projects/taskflow"` and `sourceRoot: "projects/taskflow/src"`. Each project in the workspace has its own file layout.

---

### Exercise 3: CLI Commands

| Command | Effect |
|---|---|
| `ng build` | Builds the default project (`angular-ai-tutor`) in `production` |
| `ng build --configuration development` | Builds without optimizations, with source maps |
| `ng serve taskflow` | Runs the taskflow project on port 4200 |
| `ng serve taskflow --port 4300` | Runs taskflow on port 4300 |

---

### Exercise 4: TypeScript References

**Question:** How many references are defined in `tsconfig.json`?

**Answer:** 3 references:
1. `./tsconfig.app.json` — build of the `angular-ai-tutor` application
2. `./tsconfig.spec.json` — tests of the `angular-ai-tutor` application
3. `./projects/taskflow/tsconfig.app.json` — build of the `taskflow` application

A new file in `src/app/` is covered by `tsconfig.app.json`, because that file points to `src/main.ts` as the entry point and recursively includes all imports.

---

## Acceptance Criteria

You have completed this lesson when you can:

- [ ] Explain what an Angular workspace is and how it differs from a plain folder
- [ ] Identify the role of each of the five key files: `angular.json`, `package.json`, `tsconfig.json`, `src/main.ts`, `src/index.html`
- [ ] Trace the full `ng serve` flow across its four phases (CLI → Build → Dev Server → Framework)
- [ ] State why `ng serve` and `ng build` are two different "worlds" (build-time vs runtime)
- [ ] Locate the entry point of **both** projects in the workspace and explain why their paths differ
- [ ] List the three TypeScript project references defined in the root `tsconfig.json`

---

## Key Takeaways

- **Workspace** is a build environment, not just a folder of files
- **`angular.json`** is the heart of the configuration — it defines projects, targets, and configurations
- **CLI ≠ Framework** — the CLI is the build tool, the framework is the code in the browser
- **`ng serve`** goes through 4 phases: CLI → Build → Dev Server → Framework
- **`ng build`** generates static files in `dist/` with production optimizations
- One workspace can contain **multiple projects**, each with its own configuration

---

## Next Steps

- **Lesson 0.2: TypeScript Strict Mode** — go deeper into `tsconfig.json` compiler options and why strictness matters
- **Phase 0 continuation:** explore `app.config.ts` and the functional bootstrap in detail
