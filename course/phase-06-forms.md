# Phase 6: Forms
*Focus: User input with modern form patterns.*

## Git Branch: `lesson-6*-*`

---

### Lesson 6.1: Template-Driven Forms
- *Objective:* `ngModel`, simple validation, quick forms.
- *Branch Name:* `lesson-61-template-forms`
- *Topics:*
  - `FormsModule` and `ngModel`
  - Form control names, validation states
  - Error messages based on validation errors
- *Training Exercise:* Build a simple contact form with validation
- *Project Application:* Add task creation form in TaskFlow

---

### Lesson 6.2: Signal Forms
- *Objective:* `control()`, `formGroup()` modern reactive forms.
- *Branch Name:* `lesson-62-signal-forms`
- *Topics:*
  - `formGroup()` and `control()` — signal-based reactive forms
  - Form validation with signals
  - Why Signal Forms replace legacy Reactive Forms
- *Training Exercise:* Build a form with `formGroup()` and `control()`, validate inputs
- *Project Application:* Replace template forms with Signal Forms in TaskFlow

---

### Lesson 6.3: Reactive Forms (Legacy)
- *Objective:* `FormControl`, `FormGroup` legacy pattern awareness.
- *Branch Name:* `lesson-63-reactive-forms`
- *Topics:*
  - `FormControl`, `FormGroup`, `FormArray` — legacy reactive forms API
  - How Signal Forms relate to legacy Reactive Forms
  - Migration awareness: when and how to migrate
- *Training Exercise:* Recognize legacy patterns in existing code
- *Project Application:* N/A (awareness lesson)

---

### Lesson 6.4: Custom Validators & Async Validators
- *Objective:* Build reusable validation logic.
- *Branch Name:* `lesson-64-validators`
- *Topics:*
  - Sync custom validators: `validator()` function
  - Async custom validators: debounced API checks
  - Cross-field validation patterns
- *Training Exercise:* Create a "no whitespace" validator and a "password match" validator
- *Project Application:* Add duplicate task name validator per board in TaskFlow