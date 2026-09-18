# Phase 9: Directives & Pipes
*Focus: Reusable template logic.*

## Git Branch: `lesson-9.<n>-*`
## Training dir: `src/app/phase-9-directives-pipes/9.<n>-<slug>/` · Lesson notes: `lessons/phase-9-directives-pipes/9.<n>-<slug>.md`

---

### Lesson 9.1: Structural Directives & Templates
- *Objective:* Create custom structural directives.
- *Branch Name:* `lesson-9.1-structural-directives`
- *Topics:*
  - `<ng-template>`, `TemplateRef`, `ViewContainerRef` — how `@if` works underneath
  - `*directive` microsyntax desugars to `<ng-template [directive]>`
  - Creating a structural directive: `createEmbeddedView()` / `clear()`
  - `NgTemplateOutlet` for rendering a passed-in template
  - When a structural directive beats `@if` (cross-cutting concerns like permissions)
- *Training Exercise:* Create `*appUnless` (inverse of `@if`) and render a template via `ngTemplateOutlet`
- *Project Application:* Create `shared/directives/admin-only.directive.ts` (`*adminOnly`) reading `SessionService.role()`; wrap "Reset demo data" and "Delete board" with it (spec §5.1)

---

### Lesson 9.2: Attribute Directives & Host Bindings
- *Objective:* DOM behavior and declarative `host` metadata.
- *Branch Name:* `lesson-9.2-attribute-directives`
- *Reference:* `agent-skills/angular-skills/references/host-elements.md`
- *Topics:*
  - `@Directive({ selector: '[appX]' })` with `input()`s
  - `host: { '[class.x]': 'expr', '(click)': 'handler()', '[attr.role]': '"button"' }` — replaces `@HostBinding` / `@HostListener`
  - `ElementRef` + `Renderer2` when you must touch the DOM
  - `hostDirectives` — composing directives
- *Training Exercise:* Create a highlight directive that changes background color on hover via `host`
- *Project Application:* Create `shared/directives/priority-highlight.directive.ts` (`[priorityHighlight]="task.priority"`) that sets a left accent on task cards

---

### Lesson 9.3: Custom Pipes
- *Objective:* Pure pipes, pipe transforms, chaining pipes.
- *Branch Name:* `lesson-9.3-custom-pipes`
- *Topics:*
  - `@Pipe({ name })` and `PipeTransform`
  - Pure vs impure pipes; pipes as memoized template functions
  - Built-ins worth knowing: `DatePipe`, `TitleCasePipe`, `AsyncPipe`
  - Pipe vs `computed()` — where each belongs
- *Training Exercise:* Create a `truncate` pipe with a length argument and a `pluralize` pipe
- *Project Application:* Create `shared/pipes/due-date.pipe.ts` (`yyyy-mm-dd` → "Aug 22, 2026", empty when unset) and `priority-label.pipe.ts` (`'urgent'` → "Urgent") — spec §8
---

## Phase Completion Criteria

Before marking this phase as complete:

- [ ] All lessons implemented and merged to `main`
- [ ] All training exercises completed
- [ ] All project applications integrated into TaskFlow
- [ ] Code reviewed and follows best practices
- [ ] Tests pass (if Testing Phase already completed)

---

## Key Takeaways

After completing this phase, the learner should be able to:

- Explain how `@if` / `*directive` work through `TemplateRef` and `ViewContainerRef`
- Build structural directives for cross-cutting concerns and render templates with `ngTemplateOutlet`
- Build attribute directives with `host` metadata and `hostDirectives`
- Build pure pipes and decide between a pipe and a `computed()`
