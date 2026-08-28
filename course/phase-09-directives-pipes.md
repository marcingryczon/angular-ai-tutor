# Phase 9: Directives & Pipes
*Focus: Reusable template logic.*

## Git Branch: `lesson-9*-*`

---

### Lesson 9.1: Structural Directives
- *Objective:* Create custom structural directives.
- *Branch Name:* `lesson-91-structural-directives`
- *Topics:*
  - Structural directives: modifying DOM structure
  - `TemplateRef` and `ViewContainerRef`
  - Creating custom structural directives
- *Training Exercise:* Create a `@myIf` structural directive
- *Project Application:* Create permission-based structural directive for TaskFlow (admin-only columns)

---

### Lesson 9.2: Attribute Directives & Host Bindings
- *Objective:* DOM manipulation, class/style directives, and declarative `host:` metadata.
- *Branch Name:* `lesson-92-attribute-directives`
- *Topics:*
  - Attribute directives: modifying element appearance/behavior
  - `ElementRef` and DOM manipulation
  - Dynamic classes and styles
  - `host:` metadata — declarative event, class, style, and attribute bindings (replaces `@HostListener`/`@HostBinding`)
  - When to use `host:` vs `@HostListener` (legacy)
- *Training Exercise:* Create a highlight directive that changes background color
- *Project Application:* Create priority highlight directive for TaskFlow task cards

---

### Lesson 9.3: Custom Pipes
- *Objective:* Pure pipes, pipe transforms, chaining pipes.
- *Branch Name:* `lesson-93-custom-pipes`
- *Topics:*
  - `@Pipe()` decorator and `transform()` method
  - Pure vs impure pipes
  - Pipe chaining and composition
- *Training Exercise:* Create a currency format pipe and a filter pipe
- *Project Application:* Create date format and priority label pipes for TaskFlow
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

- Create structural directives (`@if`, `@for` alternatives) and attribute directives
- Build custom pipes (transform, async) and explain pure vs. impure
- Use host bindings (`host:` metadata) for declarative event/style/class binding
- Implement `ngTemplateOutlet` and content projection with directives
- Optimize `@for` with `track` expression for list performance
