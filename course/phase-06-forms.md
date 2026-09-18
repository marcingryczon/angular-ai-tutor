# Phase 6: Forms
*Focus: User input with modern form patterns.*

## Git Branch: `lesson-6.<n>-*`
## Training dir: `src/app/phase-6-forms/6.<n>-<slug>/` · Lesson notes: `lessons/phase-6-forms/6.<n>-<slug>.md`

> **Decision:** TaskFlow uses **Signal Forms** (`@angular/forms/signals`) — consistent with `taskflow-spec.md` §5.7 and the reference implementation. Legacy Reactive Forms are covered for awareness only. Check `agent-skills/angular-skills/references/signal-forms.md` for the API status in the detected Angular version before teaching.

---

### Lesson 6.1: Template-Driven Forms
- *Objective:* `ngModel`, simple validation, quick forms.
- *Branch Name:* `lesson-6.1-template-forms`
- *Reference:* `agent-skills/angular-skills/references/template-driven-forms.md`
- *Topics:*
  - `FormsModule`, `[(ngModel)]`, `#ctrl="ngModel"`
  - Validation attributes (`required`, `minlength`) and control states (`touched`, `invalid`)
  - Where template-driven forms stop scaling
- *Training Exercise:* Build a simple contact form with validation
- *Project Application:* Rewrite the column quick-add row with `ngModel` + `required`; Enter submits only when valid

---

### Lesson 6.2: Signal Forms
- *Objective:* Model-driven forms built on signals.
- *Branch Name:* `lesson-6.2-signal-forms`
- *Reference:* `agent-skills/angular-skills/references/signal-forms.md`
- *Topics:*
  - `form(modelSignal, schema)` — the form is derived from a `signal<T>()` model
  - `[formField]` directive binding an input to a field
  - Field state: `value()`, `valid()`, `touched()`, `errors()` — always **call the field first**: `form.title().touched()`, and the form root is `form().invalid()`
  - Schema rules: `required()`, `minLength()`, `validate()`
  - `submit(form, async () => { … })` — marks every field touched and runs only when valid; the callback **must** be `async`
  - What `[formField]` already owns: never set `value`, `disabled`, `readonly`, `min` or `max` on a bound input (NG8022) — use the schema rules instead. Static `value` on radio/checkbox is the one exception.
  - Why signal forms: type-safe, reactive, no `FormGroup` boilerplate
- *Training Exercise:* Build a form with `form()` and a schema, validate inputs, show errors when touched
- *Project Application:* Build `features/board/task-form.ts` per spec §5.7 (title required, description, priority, due date, assignee) and open it in the `Modal` from 2.4 for **create** and **edit**

---

### Lesson 6.3: Reactive Forms (Legacy Awareness)
- *Objective:* Read and migrate `FormControl` / `FormGroup` code.
- *Branch Name:* `lesson-6.3-reactive-forms`
- *Reference:* `agent-skills/angular-skills/references/reactive-forms.md`
- *Topics:*
  - `FormControl`, `FormGroup`, `FormArray`, `FormBuilder`, `Validators`
  - Typed reactive forms (`NonNullableFormBuilder`)
  - Mapping concepts: `FormGroup` → `form()`, `Validators.required` → `required()`
- *Training Exercise:* Convert a small `FormGroup` form to a signal form
- *Project Application:* N/A (awareness lesson)

---

### Lesson 6.4: Custom & Async Validators
- *Objective:* Reusable validation logic in signal forms.
- *Branch Name:* `lesson-6.4-validators`
- *Reference:* `agent-skills/angular-skills/references/signal-forms.md`
- *Topics:*
  - `validate()` with a custom rule returning an error object or `null`
  - Cross-field validation (rule on the parent path)
  - Async validation with `validateAsync({ params, factory, onSuccess, onError })` — `params` is a function, `onError` is **required**, and `debounce(path, ms)` throttles the model updates
  - Surfacing errors in the template with `errors()`
- *Training Exercise:* Create a "no whitespace-only" validator and a "password match" cross-field validator
- *Project Application:* Add a "duplicate task title in this board" validator to `task-form`
---

## Phase Completion Criteria

Before marking this phase as complete:

- [ ] All lessons implemented and merged to `main`
- [ ] All training exercises completed
- [ ] All project applications integrated into TaskFlow
- [ ] Code reviewed and follows best practices
- [ ] `npm run verify 6` passes — the milestone in `taskflow-spec.md` §10 is reached
- [ ] Tests pass (if Testing Phase already completed)

---

## Key Takeaways

After completing this phase, the learner should be able to:

- Build quick forms with `ngModel` and know when they stop scaling
- Build typed signal forms with `form()`, a schema, and `[formField]`, and read field state
- Read legacy `FormGroup` / `FormControl` code and map it to signal forms
- Write custom, cross-field, and async validators and render their errors
