---
name: angular-skills
description: Index of official Angular skills and per-phase reference map. The authoritative Angular knowledge base for the tutor — load the relevant reference file(s) before answering any Angular-specific question.
---

# Angular Skills

This directory holds the **authoritative Angular knowledge base** for the tutor.
Before answering any Angular-specific question, **load the relevant reference file(s)** from
`./references/` — do not rely on model memory.

> **Source priority:** Official Skills (these files) take precedence over internal model
> knowledge. When a conflict arises, the official source wins. Extend — never duplicate —
> the official documentation with senior engineering experience (see `../../.clinerules/rules.md`).

---

## Source Priority

| Area | Authoritative source |
|---|---|
| Angular core (components, DI, signals, forms, router, SSR) | Angular.dev (official) |
| TypeScript | TypeScript Handbook |
| RxJS | rxjs.dev |
| NgRx | ngrx.io |
| Styling (Tailwind) | tailwindcss.com |

---

## Reference Files (`references/`)

37 official Angular topic files, grouped by area:

### Workspace & Tooling
- `cli.md` — Angular CLI commands, builders, and the workspace model
- `migrations.md` — version upgrades and migration schematics
- `mcp.md` — the angular-cli MCP server tools
- `environment-configuration.md` — environments and runtime configuration
- `rendering-strategies.md` — CSR, SSR, and hydration strategies
- `tailwind-css.md` — Tailwind CSS integration

### Components & Templates
- `components.md` — standalone components, metadata, lifecycle
- `component-styling.md` — styles, encapsulation, host bindings
- `host-elements.md` — host attributes, classes, listeners, and styles
- `inputs.md` — signal inputs and input transformations
- `outputs.md` — output events and EventEmitter
- `angular-animations.md` — the animations module and transition API

### Dependency Injection
- `di-fundamentals.md` — providers, injectors, and injection basics
- `creating-services.md` — defining and injecting services
- `defining-providers.md` — provider configuration and scopes
- `hierarchical-injectors.md` — injector hierarchy and element injectors
- `injection-context.md` — injection contexts and the `inject()` function
- `linked-signal.md` — linked signals for derived state

### Signals
- `signals-overview.md` — signal fundamentals, computed, and effect
- `effects.md` — side effects and the `effect()` API
- `resource.md` — the `resource()` API for async data

### Forms
- `reactive-forms.md` — reactive forms (typed)
- `template-driven-forms.md` — template-driven forms
- `signal-forms.md` — signal-based form state

### Routing
- `define-routes.md` — route configuration
- `route-guards.md` — functional guards (canActivate, etc.)
- `router-lifecycle.md` — navigation lifecycle hooks
- `navigate-to-routes.md` — programmatic navigation
- `data-resolvers.md` — data resolvers
- `loading-strategies.md` — lazy loading and preloaders
- `show-routes-with-outlets.md` — outlets and nested routing
- `route-animations.md` — route transition animations
- `router-testing.md` — testing the router

### Testing
- `testing-fundamentals.md` — testing with Vitest and the Angular harness
- `component-harnesses.md` — component harnesses
- `e2e-testing.md` — end-to-end testing

### Accessibility
- `angular-aria.md` — ARIA attributes and Angular accessibility APIs

---

## Per-Phase Reference Map

Use this to quickly find which reference files support a given phase
(phase files live in `course/`):

| Phase | Topic | Key reference files |
|---|---|---|
| 00 | Fundamentals & Workspace | `cli.md`, `migrations.md`, `mcp.md`, `environment-configuration.md` |
| 01 | Components & Templates | `components.md`, `component-styling.md`, `host-elements.md`, `angular-animations.md` |
| 02 | Component Communication | `inputs.md`, `outputs.md`, `host-elements.md` |
| 03 | Dependency Injection | `di-fundamentals.md`, `creating-services.md`, `defining-providers.md`, `hierarchical-injectors.md`, `injection-context.md` |
| 04 | Signals & Reactive State | `signals-overview.md`, `effects.md`, `resource.md`, `linked-signal.md` |
| 05 | RxJS & Async Patterns | *(see rxjs.dev — no dedicated file yet)*, `resource.md` |
| 06 | Forms | `reactive-forms.md`, `template-driven-forms.md`, `signal-forms.md` |
| 07 | Routing & Navigation | `define-routes.md`, `route-guards.md`, `router-lifecycle.md`, `navigate-to-routes.md`, `data-resolvers.md`, `loading-strategies.md`, `show-routes-with-outlets.md`, `route-animations.md` |
| 08 | Change Detection & Performance | `signals-overview.md`, `effects.md`, `rendering-strategies.md` |
| 09 | Directives & Pipes | `host-elements.md`, `components.md` |
| 10 | SSR & Hydration | `rendering-strategies.md`, `environment-configuration.md` |
| 11 | Testing | `testing-fundamentals.md`, `component-harnesses.md`, `e2e-testing.md`, `router-testing.md` |
| 12 | Accessibility & Polish | `angular-aria.md`, `component-styling.md` |
| 13 | Architecture & Production | `migrations.md`, `environment-configuration.md`, `rendering-strategies.md`, `cli.md` |
| 14 | Global State (NgRx) | *(see ngrx.io — no dedicated file yet)*, `signals-overview.md`, `resource.md` |

> **Coverage note:** Phases 05 (RxJS) and 14 (NgRx) currently rely on the official
> rxjs.dev and ngrx.io documentation rather than a local reference file. When a local
> reference file is added, register it above and in the Reference Files list.

---

## Adding / Maintaining Skills

1. Drop the new topic file into `references/` (kebab-case `.md`).
2. Add it to the **Reference Files** list above (correct topic group).
3. Map it to the relevant phase(s) in the **Per-Phase Reference Map**.
4. Add the version metadata header (below) to the file.
5. Keep the file **English** and aligned with the official source.

### Version Metadata Header (add to every reference file)

```
Language:   Angular
Version:    22
Source:     https://angular.dev/...
Last verified: YYYY-MM-DD
```

> **TODO:** the 37 existing reference files do not yet carry this metadata header —
> add it to each file when next edited. Tracked in `meta/INSTANTIATION.md`.

---

## Usage (for the tutor)

1. Identify the Angular topic from the user's question or the current phase.
2. Open the relevant `references/*.md` file(s) from the Per-Phase Reference Map.
3. Ground the explanation in that file; cite the official source URL.
4. Extend with senior engineering experience (internals, trade-offs, best practices)
   without contradicting the official source.
