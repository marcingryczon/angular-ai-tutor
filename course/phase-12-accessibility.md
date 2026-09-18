# Phase 12: Accessibility & Polish
*Focus: Production-ready quality.*

## Git Branch: `lesson-12.<n>-*`
## Training dir: `src/app/phase-12-accessibility/12.<n>-<slug>/` · Lesson notes: `lessons/phase-12-accessibility/12.<n>-<slug>.md`

---

### Lesson 12.1: ARIA Fundamentals
- *Objective:* Roles, states, properties; semantic HTML first.
- *Branch Name:* `lesson-12.1-aria`
- *Reference:* `agent-skills/angular-skills/references/angular-aria.md`
- *Topics:*
  - Semantic HTML before ARIA (`<button>`, `<nav>`, `<ul>`, `<dialog>`-like patterns)
  - ARIA roles, states, and properties; `aria-label`, `aria-live`
  - Binding ARIA in Angular: `[attr.aria-*]`
  - Auditing with axe DevTools / Lighthouse
  - Contrast is part of the audit: check the §1.2 palette against WCAG AA (4.5:1 for body text, 3:1 for large text and UI borders) — `--text-subtle` on `--surface-2` and the priority badge text on its tinted background are the pairs to measure first
- *Training Exercise:* Add ARIA attributes to a custom component and fix its axe report
- *Project Application:* Give the board an accessible structure (`role="list"`/`listitem` on columns/cards, `aria-label`s on icon buttons, live region for the task count)

---

### Lesson 12.2: Keyboard Navigation & Focus Management
- *Objective:* Everything works without a mouse.
- *Branch Name:* `lesson-12.2-keyboard-focus`
- *Reference:* `agent-skills/angular-skills/references/angular-aria.md`
- *Topics:*
  - Keyboard events, `tabindex`, roving focus
  - Focus traps, focus restoration, body scroll lock
  - `viewChild()` + `afterNextRender()` to move focus
  - Keyboard alternative for drag & drop
- *Training Exercise:* Make a custom dropdown keyboard-accessible
- *Project Application:* Finish `shared/modal.ts` per spec §5.6: close on Escape / outside click, move focus in on open, restore on close, lock body scroll. Add a keyboard "move task" action (menu on the card) as the DnD alternative.

---

### Lesson 12.3: Animations & Motion
- *Objective:* Enter/leave animations the modern way; respect reduced motion.
- *Branch Name:* `lesson-12.3-animations`
- *Reference:* `agent-skills/angular-skills/references/angular-animations.md` · `agent-skills/angular-skills/references/route-animations.md`
- *Topics:*
  - `animate.enter` / `animate.leave` (Angular 20.2+) with CSS transitions/keyframes — the recommended approach
  - `@angular/animations` — legacy awareness only (deprecated); how to read `trigger()` / `transition()` code
  - `prefers-reduced-motion` media query
  - Route transitions with View Transitions API (`withViewTransitions()`)
- *Training Exercise:* Animate a component entering and leaving the DOM with `animate.enter` / `animate.leave`
- *Project Application:* Animate task card insertion/removal and the modal open/close; disable under reduced motion
---

### Lesson 12.4: Accessible Forms & Announcements
- *Objective:* Make the task form usable by someone who cannot see it.
- *Branch Name:* `phase-12-accessibility` (commit `lesson-12.4-accessible-forms`)
- *Reference:* `agent-skills/angular-skills/references/angular-aria.md` · `agent-skills/angular-skills/references/signal-forms.md`
- *Topics:*
  - Every control needs a name: `<label for>` beats `aria-label`, and a placeholder is not a label
  - Wiring an error message to its field with `aria-describedby`, and marking the field `aria-invalid`
  - Announcing what changed: `aria-live="polite"` for the filtered task count, `role="alert"` for a submit failure
  - Focus after an action: where does focus go when the modal closes, when a task is deleted, when the form fails to submit?
  - Required vs `aria-required`, and why `[disabled]` on a submit button hides the reason from a screen reader
- *Training Exercise:* Take the 6.2 training form, run axe on it, and fix every violation without changing what it looks like
- *Project Application:* Audit `task-form` and the create-board form: labels, `aria-describedby` on the "Title is required." error, an announced result after a successful create, and focus returned to the element that opened the modal

Before marking this phase as complete:

- [ ] All lessons implemented and merged to `main`
- [ ] All training exercises completed
- [ ] All project applications integrated into TaskFlow
- [ ] Code reviewed and follows best practices
- [ ] `npm run verify 12` passes — the milestone in `taskflow-spec.md` §10 is reached
- [ ] Tests pass and coverage thresholds are met

---

## Key Takeaways

After completing this phase, the learner should be able to:

- Audit UI with axe / Lighthouse and fix common WCAG 2.1 AA violations
- Prefer semantic HTML and add ARIA only where it is insufficient
- Implement focus management: traps, restoration, roving `tabindex`
- Provide keyboard alternatives for pointer-only interactions like drag & drop
- Animate with `animate.enter` / `animate.leave` and honor reduced-motion preferences
