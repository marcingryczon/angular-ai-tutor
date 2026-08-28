# Phase 3: Dependency Injection
*Focus: The power of Angular's DI system.*

## Git Branch: `lesson-3*-*`

---

### Lesson 3.1: `inject()` API
- *Objective:* Functional injection replacing constructor DI.
- *Branch Name:* `lesson-31-inject-api`
- *Topics:*
  - `inject<T>()` function: functional DI replacing `constructor` pattern
  - Injection context and injector hierarchy basics
  - Why `inject()` is preferred over constructor DI in modern Angular
- *Training Exercise:* Create a service and inject it using `inject()` instead of constructor
- *Project Application:* Refactor TaskFlow components to use `inject()` for services

---

### Lesson 3.2: Creating Services
- *Objective:* Injectable services, environment providers, singleton pattern.
- *Branch Name:* `lesson-32-services`
- *Topics:*
  - `injectable()` decorator and `providedIn: 'root'`
  - Singleton services vs scoped services
  - Providing services via `providers` array
- *Training Exercise:* Create a counter service shared between two components
- *Project Application:* Create `BoardService` and `TaskService` for TaskFlow

---

### Lesson 3.3: DI Fundamentals
- *Objective:* Provider tokens, `useValue`, `useFactory`, `useClass`.
- *Branch Name:* `lesson-33-di-fundamentals`
- *Topics:*
  - InjectionToken<T>: abstract tokens for non-class dependencies
  - `useValue`: provide a static value
  - `useFactory`: provide a value computed by a factory function
  - `useClass`: provide an implementation for an abstract token
- *Training Exercise:* Provide configuration via `useValue`, swap implementations via `useClass`
- *Project Application:* Provide board configuration (column names, priorities) via provider tokens

---

### Lesson 3.4: Hierarchical Injectors
- *Objective:* Component injectors, `EnvironmentInjector`, injector trees.
- *Branch Name:* `lesson-34-hierarchical-injectors`
- *Topics:*
  - Root injector vs element injector
  - `providers` in `@Component()` — scoped providers
  - How child components discover parents via injector hierarchy
- *Training Exercise:* Create a scoped provider that differs between parent and child
- *Project Application:* Scope TaskFlow board-specific providers per board instance
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

- Explain the injector hierarchy: root → environment → component → element
- Create and inject services at different scopes (root, feature, component-level)
- Use `InjectionToken` for non-class dependencies (strings, configs, factories)
- Implement lazy services with `forwardRef` and factory providers
- Debug DI issues: circular dependencies, `NullInjectorError`, provider scope mistakes
