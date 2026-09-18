# Phase 12: Accessibility & Polish
*Focus: Production-ready quality.*

## Git Branch: `lesson-12.<n>-*`
## Training dir: `src/app/phase-12-accessibility/12.<n>-<slug>/` · Lesson notes: `lessons/phase-12-accessibility/12.<n>-<slug>.md`

---

### Lesson 12.1: ARIA Fundamentals
- *Objective:* Roles, states, properties; semantic HTML first.
- *Branch Name:* `lesson-12.1-aria`
- *Topics:*
  - Semantic HTML before ARIA (`<button>`, `<nav>`, `<ul>`, `<dialog>`-like patterns)
  - ARIA roles, states, and properties; `aria-label`, `aria-live`
  - Binding ARIA in Angular: `[attr.aria-*]`
  - Auditing with axe DevTools / Lighthouse
- *Training Exercise:* Add ARIA attributes to a custom component and fix its axe report
- *Project Application:* Give the board an accessible structure (`role="list"`/`listitem` on columns/cards, `aria-label`s on icon buttons, live region for the task count)

---

### Lesson 12.2: Keyboard Navigation & Focus Management
- *Objective:* Everything works without a mouse.
- *Branch Name:* `lesson-12.2-keyboard-focus`
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
- *Topics:*
  - `animate.enter` / `animate.leave` (Angular 20.2+) with CSS transitions/keyframes — the recommended approach
  - `@angular/animations` — legacy awareness only (deprecated); how to read `trigger()` / `transition()` code
  - `prefers-reduced-motion` media query
  - Route transitions with View Transitions API (`withViewTransitions()`)
- *Training Exercise:* Animate a component entering and leaving the DOM with `animate.enter` / `animate.leave`
- *Project Application:* Animate task card insertion/removal and the modal open/close; disable under reduced motion
---

## Phase Completion Criteria

Before marking this phase as complete:

- [ ] All lessons implemented and merged to `main`
- [ ] All training exercises completed
- [ ] All project applications integrated into TaskFlow
- [ ] Code reviewed and follows best practices
- [ ] Tests pass and coverage thresholds are met

---

## Key Takeaways

After completing this phase, the learner should be able to:

- Audit UI with axe / Lighthouse and fix common WCAG 2.1 AA violations
- Prefer semantic HTML and add ARIA only where it is insufficient
- Implement focus management: traps, restoration, roving `tabindex`
- Provide keyboard alternatives for pointer-only interactions like drag & drop
- Animate with `animate.enter` / `animate.leave` and honor reduced-motion preferences
