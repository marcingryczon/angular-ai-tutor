# Phase 12: Accessibility & Polish
*Focus: Production-ready quality.*

## Git Branch: `lesson-12*-*`

---

### Lesson 12.1: ARIA Fundamentals
- *Objective:* Roles, states, properties.
- *Branch Name:* `lesson-121-aria`
- *Topics:*
  - ARIA roles, states, and properties
  - Semantic HTML vs ARIA attributes
  - Common accessibility pitfalls in Angular
- *Training Exercise:* Add ARIA attributes to a custom component
- *Project Application:* Add ARIA roles to TaskFlow board/column/card structure

---

### Lesson 12.2: Keyboard Navigation
- *Objective:* Focus management, keyboard events.
- *Branch Name:* `lesson-122-keyboard`
- *Topics:*
  - Keyboard event handling in Angular
  - Focus management and focus traps
  - Accessible form controls and buttons
- *Training Exercise:* Make a custom dropdown keyboard-accessible
- *Project Application:* Add keyboard navigation to TaskFlow task actions

---

### Lesson 12.3: Animations
- *Objective:* `@animations`, transition states, motion design.
- *Branch Name:* `lesson-123-animations`
- *Topics:*
  - `@angular/animations` module
  - State transitions and trigger definitions
  - Enter/leave/transition animations
- *Training Exercise:* Animate a component entering and leaving the DOM
- *Project Application:* Animate task card state transitions in TaskFlow
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

- Audit UI with axe DevTools and fix common WCAG 2.1 AA violations
- Implement proper focus management: `tabindex`, focus traps, focus restoration
- Add ARIA attributes where semantic HTML is insufficient (modals, tabs, live regions)
- Ensure keyboard navigability: all interactions work without a mouse
- Test with screen readers (VoiceOver / NVDA) for critical flows
- Apply responsive design and reduced-motion preferences
