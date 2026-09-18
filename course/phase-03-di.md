# Phase 3: Dependency Injection
*Focus: The power of Angular's DI system.*

## Git Branch: `lesson-3.<n>-*`
## Training dir: `src/app/phase-3-di/3.<n>-<slug>/` · Lesson notes: `lessons/phase-3-di/3.<n>-<slug>.md`

---

### Lesson 3.1: `inject()` API
- *Objective:* Functional injection replacing constructor DI.
- *Branch Name:* `lesson-3.1-inject-api`
- *Reference:* `agent-skills/angular-skills/references/injection-context.md`
- *Topics:*
  - `inject<T>(Token)` — functional DI replacing the `constructor` pattern
  - Injection context: where `inject()` is allowed (field initializers, constructors, factories, guards) and where it throws
  - `runInInjectionContext()` for the edge cases
  - Why `inject()` is preferred: inheritance, mixins, readability
- *Training Exercise:* Create a service and inject it using `inject()` instead of constructor
- *Project Application:* Nothing to refactor yet — every service from 3.2 onward is injected with `inject()`

---

### Lesson 3.2: Creating Services
- *Objective:* Injectable services, `providedIn: 'root'`, the singleton pattern.
- *Branch Name:* `lesson-3.2-services`
- *Reference:* `agent-skills/angular-skills/references/creating-services.md`
- *Topics:*
  - `@Injectable({ providedIn: 'root' })` — tree-shakable singletons
  - Root singletons vs scoped services
  - Providing services via a `providers` array (component or route)
  - Service as the owner of shared state (still plain properties — signals in Phase 4)
- *Training Exercise:* Create a counter service shared between two components
- *Project Application:* Create `core/session.service.ts` (current `role`, current `user`; replaces the plain property in `App`), `core/board.service.ts` and `core/task.service.ts` holding the in-memory seed data from spec §7.3. `Board` reads from the services instead of local arrays.
- *Binding gotcha:* the role is still a plain property here, so `[(role)]="session.role"` does not compile — keep a getter/setter on `App` (or bind `[role]` + `(roleChange)`) until Phase 4 turns it into a signal. This is a good moment to explain what `[(x)]` actually desugars to.

---

### Lesson 3.3: DI Fundamentals — Tokens & Providers
- *Objective:* `InjectionToken`, `useValue`, `useFactory`, `useClass`, `useExisting`.
- *Branch Name:* `lesson-3.3-di-fundamentals`
- *Reference:* `agent-skills/angular-skills/references/defining-providers.md` · `agent-skills/angular-skills/references/di-fundamentals.md`
- *Topics:*
  - `InjectionToken<T>`: tokens for non-class dependencies
  - `useValue`, `useFactory` (with `deps` / `inject()` inside), `useClass`, `useExisting`
  - Built-in tokens: `DOCUMENT`, `PLATFORM_ID`
  - `inject(Token, { optional: true })`
- *Training Exercise:* Provide configuration via `useValue`, swap implementations via `useClass`
- *Project Application:* Create `core/config.ts` with the `BOARD_CONFIG` token and `DEFAULT_BOARD_CONFIG` (four columns, four priorities — spec §7.2); provide it in `app.config.ts`

---

### Lesson 3.4: Hierarchical Injectors
- *Objective:* Element injectors, environment injectors, resolution order.
- *Branch Name:* `lesson-3.4-hierarchical-injectors`
- *Reference:* `agent-skills/angular-skills/references/hierarchical-injectors.md`
- *Topics:*
  - Root / environment injector vs element injector
  - `providers` in `@Component()` — one instance per component instance
  - Resolution modifiers: `{ self, skipSelf, host, optional }`
  - Common failure: `NullInjectorError` and how to read it
- *Training Exercise:* Create a scoped provider that differs between parent and child
- *Project Application:* Provide a component-level `providers` override of `BOARD_CONFIG` on a demo board to prove scoping, then remove it (TaskFlow keeps the root config)

---

### Lesson 3.5: Persistence Service (`localStorage`)
- *Objective:* Encapsulate browser storage behind an injectable service.
- *Branch Name:* `lesson-3.5-persistence`
- *Reference:* `agent-skills/angular-skills/references/creating-services.md`
- *Topics:*
  - Why storage access belongs in one service (testability, SSR safety, versioning)
  - `localStorage` with a versioned key (`taskflow.db.v1`) and JSON (de)serialization
  - Guarding browser-only APIs: `inject(PLATFORM_ID)` + `isPlatformBrowser()` (deepened in Phase 10)
  - Seeding: first run vs "Reset demo data"
- *Training Exercise:* Build a `StorageService<T>` with `load()`, `save()`, `clear()` and a fallback when storage is unavailable
- *Project Application:* Create `core/db.ts` (`TaskFlowDb`): `load()`, `save()`, `seed()` per spec §7.3. `BoardService` / `TaskService` read and write through it. Add the admin "Reset demo data" action (role check done inline for now; the `*adminOnly` directive comes in Phase 9)
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

- Explain the injector hierarchy: root / environment → element, and how resolution walks up
- Create and inject services at different scopes (root, route, component)
- Use `InjectionToken` with `useValue` / `useFactory` / `useClass` for non-class dependencies
- Debug DI issues: `NullInjectorError`, injection-context errors, provider scope mistakes
- Isolate browser storage behind a service that is safe to run outside the browser
