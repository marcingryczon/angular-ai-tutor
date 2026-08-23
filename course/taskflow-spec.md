# TaskFlow — Visual & Structure Reference

> **Purpose of this file.** This is the single source of truth for *what TaskFlow looks like and how it is organized*. Every learner in this course builds toward this exact look. When you add a feature, match these tokens, class names, layout rules, and seed data so your app stays visually identical to the reference implementation.
>
> **How to use it.** Read top-to-bottom once (design system → screens → interactions → data). Then keep it open while building: copy the exact token values and class names rather than inventing new ones. The whole point is that two different learners produce the *same* app.

---

## 1. Design System (the "look")

The visual foundation lives in `projects/taskflow/src/styles.scss`: it contains
global design tokens, resets, and intentionally shared primitives. Every feature
component must keep its TypeScript class, HTML template, and SCSS styles in
separate files, with component-specific appearance in the component's own
`.scss` file. Do not add inline templates or styles to the `@Component` decorator.

### 1.1 Fonts & icons (loaded in `index.html`)

| Asset | Source | Notes |
|---|---|---|
| **Material Symbols Rounded** | Google Fonts (`fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block`) | Icon font. Rendered as `<span class="material-symbols-rounded">name</span>`. Variants: `--sm` (18px), `--filled` (solid). |
| **Body font** | Font stack leads with `'Inter'`, then system UI fallbacks (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`) | Inter is *not* fetched by default — it relies on a local/system fallback. For pixel-fidelity add an Inter `<link>` in `index.html`; otherwise the look still matches closely via system fonts. |

Icon usage rules:
- Default size 24px (`opsz`), weight 500, outline fill.
- `.material-symbols-rounded--sm` → 18px (used inside buttons and card action icons).
- `.material-symbols-rounded--filled` → solid glyph (used for the topbar logo `view_kanban`).

### 1.2 Color & spacing tokens (`:root`)

Copy these **exactly** — they are what make two builds look identical.

```scss
:root {
  --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

  /* Surfaces & background */
  --bg: #f3f5f9;
  --bg-gradient: linear-gradient(180deg, #eef2f8 0%, #f6f8fc 40%, #ffffff 100%);
  --surface: #ffffff;
  --surface-2: #f7f9fc;   /* column background */
  --surface-3: #eef2f8;   /* subtle fills / hover */
  --border: #e2e8f0;
  --border-strong: #cfd8e3;

  /* Text */
  --text: #1e2633;
  --text-muted: #5b6675;
  --text-subtle: #8a94a3;

  /* Brand & semantic */
  --primary: #3b6fe0;
  --primary-hover: #2f5cc4;
  --primary-soft: #eaf0fd;
  --danger: #e0455a;
  --danger-hover: #c9364b;
  --danger-soft: #fdecef;
  --success: #2fa36b;
  --warning: #d98a1f;

  /* Radii */
  --radius: 12px;      /* cards, columns, filter bar, board-list cards */
  --radius-sm: 8px;    /* buttons, inputs, task cards */
  --radius-lg: 18px;   /* modal panel */

  /* Shadows (subtle → prominent) */
  --shadow-sm: 0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.08);
  --shadow:    0 4px 12px rgba(16,24,40,.08), 0 2px 4px rgba(16,24,40,.04);
  --shadow-lg: 0 12px 32px rgba(16,24,40,.14), 0 4px 8px rgba(16,24,40,.06);

  /* Priority palette (drives the priority badges) */
  --priority-low: #2fa36b;      /* green   */
  --priority-medium: #3b6fe0;   /* blue    */
  --priority-high: #d98a1f;     /* amber   */
  --priority-urgent: #e0455a;   /* red     */
}
```

Global body setup: `box-sizing: border-box` everywhere, no default margins on `html/body`, body uses the fixed vertical gradient background (`--bg-gradient`) over `--bg`, line-height 1.5, antialiased text. Links are `--primary` with no underline; headings have no top margin and weight 600.

### 1.3 Class naming convention (BEM-ish)

The look is reproduced by reusing these exact class names:
- **Block**: `.board`, `.column`, `.task-card`, `.topbar`, `.modal` …
- **Element**: `block__element` → `.task-card__title`, `.column__count`, `.field__input`.
- **Modifier**: `block--modifier` / `element--modifier` → `.btn--primary`, `.badge--urgent`, `.board-card--empty`.

If you need a new visual, add it to the global stylesheet following this scheme — do not scope styles inside components.

---

## 2. App Shell (root layout)

Defined in `app.ts` + `app.html`. Every screen renders inside this shell:

```
┌───────────────────────────────────────────────────────────────┐
│ [▦ TaskFlow]                                    ROLE  [Member ▾] │  ← sticky topbar (57px)
├───────────────────────────────────────────────────────────────┤
│                                                               │
│                        <router-outlet />                      │  ← main.page
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

- **Topbar** (`.topbar`): sticky, `height: 57px`, translucent white (`rgba(255,255,255,.85)`) with `backdrop-filter: saturate(180%) blur(8px)`, bottom border.
  - **Brand** (`.topbar__brand`): a 28×28 rounded tile (`.topbar__logo`, gradient `--primary → #6a8bf0`, white filled `view_kanban` icon) + bold "TaskFlow" name. Links to `/`.
  - **Role switch** (right, `.topbar__role`): uppercase small label "ROLE" + a `<select>` (min-width 108px) with options **Admin / Member**. Bound to `SessionService.role()`. This is the only global control; it drives role-based access.
- **Page** (`.page`): centered, `max-width: 1440px`, horizontal padding `clamp(16px, 4vw, 40px)`, top padding 24px / bottom 48px, `min-height: calc(100dvh - 57px)` so short pages still fill the viewport.

---

## 3. Routes

Defined in `app.routes.ts` (all lazy-loaded):

| Path | Component | Notes |
|---|---|---|
| `` (empty) & `/boards` | `BoardList` | Board gallery + create-board form |
| `/boards/:boardId` | `Board` | The Kanban board; uses `boardResolver` to resolve the board into route data |
| `**` | redirect → `` | Unknown routes fall back to the board list |

---

## 4. Screen: Board List (`/`)

Component: `features/board-list/board-list.ts`. Structure top-to-bottom:

1. **Header** (`.board-list__header`, space-between):
   - `<h1 class="board-list__title">Your boards</h1>` (1.7rem, tight letter-spacing).
   - Subtitle `.board-list__subtitle`: `{{ n }} board(s) · pick one to open` (muted).
2. **Board cards** (`ul.board-cards`, CSS grid `repeat(auto-fill, minmax(260px, 1fr))`, gap 16):
   - Each card is a link (`.board-card__link`) → `/boards/:id`: white surface, border, radius 12, `--shadow-sm`; **hover** lifts it (`--shadow-lg` + `translateY(-2px)`).
     - Top row: board title (1.1rem) on the left + a **visibility badge** on the right.
     - Description: muted, clamped to 2 lines.
     - Meta line: `{{ n }} task(s)` (subtle, semibold, small).
   - **Empty state**: when there are no boards, one dashed-border card with centered text "No boards yet. Create your first one below."
3. **Create-board form** (`.new-board`, white surface card, radius 12, padding 20):
   - Row: **Title** input + **Visibility** select (`private` / `team` / `public`).
   - **Description** input.
   - Primary button "Create board" — disabled while the title is blank.

### Visibility badge colors (shared by list + board header)
| Badge | Text color | Background |
|---|---|---|
| `.visibility-private` | `--text-muted` | `--surface-3` |
| `.visibility-team` | `--primary` | `--primary-soft` |
| `.visibility-public` | `--success` | green-tinted (`color-mix`) |

---

## 5. Screen: Board Page (`/boards/:boardId`)

Component: `features/board/board.ts`. This is the heart of the app. Structure top-to-bottom:

### 5.1 Header (`.board__header`, space-between, wraps)
- **Left** (`.board__heading`):
  - Back link `.board__back`: small "← All boards" (`arrow_back` icon `--sm`) → `/`.
  - `<h1 class="board__title">` board title (1.65rem) + inline visibility badge.
  - Description `.board__desc` (muted, max-width 60ch).
- **Right** (`.board__actions`, gap 10):
  - Primary button "New task" (`add` icon `--sm`) → opens the create modal.
  - **Admin-only block** (`<ng-container *adminOnly>`), visible only when role = Admin:
    - Ghost button "Reset demo data".
    - Danger button "Delete board".

### 5.2 Filter bar (`.board__filter`, white surface card, radius 12, padding 12/14, `--shadow-sm`)
A single row (`flex-wrap`, align-end, gap 14) containing:
- **Search** input `.board__search` (min-width 220), placeholder "Filter by text…".
- **Priority** select (narrow): All / Low / Medium / High / Urgent.
- **Assignee** select (narrow): All / *each user name* / Unassigned.
- **Count** on the far right (`.board__count`, `margin-left:auto`): `{{ n }} task(s)` reflecting the *filtered* total.

All three filters combine; changing any updates the columns and count reactively.

### 5.3 Columns (`.board__columns`)
CSS grid **`repeat(4, minmax(0, 1fr))`**, gap 16, `align-items: start`. The four columns always share the full board width — they shrink to fit and never force a horizontal scrollbar.

Each column (`features/board/column.ts`, `.column`):
- Background `--surface-2`, border, radius 12, padding 10. **Drop highlight** (while dragging over it) → `--primary-soft` background + `--primary` border + soft ring.
- **Header**: uppercase bold small title (letter-spacing) on the left + a count pill `.column__count` (white bg, border, fully rounded, min-width 22) on the right.
- **Cards** (`.column__cards`, gap 10): one `app-task-card` per task; when empty show a dashed "No tasks" box (`.column__empty`).
- **Quick-add** row: leading `add` icon (subtle) + a dashed input, placeholder "Quick add"; pressing Enter creates a task in that column. On focus the input becomes solid white.

### 5.4 Task card (`features/board/task-card.ts`, `.task-card`)
White surface, border, radius 8, padding 12, `--shadow-sm`, `cursor: grab`. **Hover** → `--shadow` + stronger border. **Selected** (viewing) → primary border + soft ring.

Layout inside the card:
- **Header row**: priority badge on the left; action buttons on the right that are *hidden until hover/focus* (`opacity 0 → 1`) — an edit `icon-btn` and a delete `icon-btn--danger`.
- **Title** (0.95rem, semibold).
- **Description** (muted, clamped to 2 lines) — only if present.
- **Footer**: left = small dot + due date (`no due date` when unset); right = an **avatar** circle (26px, blue gradient `#6a8bf0 → #3b6fe0`, white initial letter, 2px surface border) shown only when the task has an assignee.

### 5.5 Priority badge colors
Pill shape, uppercase bold 0.72rem; each level uses its palette color for text with a `color-mix` tinted background + matching soft border:
| Level | Color |
|---|---|
| `.badge--low` | green (`--priority-low`) |
| `.badge--medium` | blue (`--priority-medium`) |
| `.badge--high` | amber (`--priority-high`) |
| `.badge--urgent` | red (`--priority-urgent`) |

### 5.6 Modals (create / edit / view) — `shared/modal.ts`, `.modal`
- **Backdrop** (`.modal__backdrop`): fixed, full-screen, `rgba(16,24,40,.45)` + `blur(2px)`, centers the panel.
- **Panel** (`.modal__panel`): width `min(560px, 100%)`, max-height `calc(100dvh - 48px)`, scrollable, white surface, radius 18 (`--radius-lg`), `--shadow-lg`.
- **Header**: title (1.15rem) + a close `icon-btn`.
- **Body** (padding 16/20/20):
  - *Create / Edit* → the task form (below).
  - *View* → a detail block: title, priority badge, description (`white-space: pre-wrap`), and a meta list (Due / Assignee rows separated by top borders); followed by an actions row — **Edit** (primary) + **Delete** (danger).
- **Accessibility behaviors** (built into `Modal`, match them): closes on **Escape** or a click outside the panel; moves focus into the dialog when opened and restores it to the previously-focused element when closed; locks body scroll while open. The parent controls visibility by conditionally rendering with `@if` — there is no separate "open" state inside the component.

### 5.7 Task form (`features/board/task-form.ts`, `.task-form`)
A **reactive (typed) form** shared by create and edit. Fields, in order: **Title** (required; shows a "Title is required." error when touched+invalid), **Description** (textarea, rows=3), then a row of three — **Priority** select, **Due date** (`<input type="date">`), **Assignee** select (Unassigned + each user). Actions row: primary button first (**"Add task"** on create / **"Save changes"** on edit; disabled while the form is invalid) followed by a plain **Cancel** button. When editing, the form pre-fills from the existing task in `ngOnInit`.

---

## 6. Interactions & Behaviors

Match these exactly so the app *feels* like the reference:

- **Role toggle** (topbar): switching Admin/Member updates `SessionService`. Admin-only actions ("Reset demo data", "Delete board") appear/disappear via the `AdminOnlyDirective` (`*adminOnly`).
- **Drag & drop**: cards are draggable; columns are drop targets. While dragging over a column it highlights (`.column--drop`); dropping moves the task to that column and re-renders counts. Uses native HTML5 DnD with the task id in `dataTransfer`.
- **Quick add**: each column has an inline quick-add input; Enter creates a medium-priority, unassigned task in *that* column.
- **Filters**: text search + priority + assignee all combine (AND). The header count always reflects the filtered total, and empty columns show their "No tasks" state.
- **Card selection**: clicking a card opens the view modal; edit/delete are available from the card's hover actions or inside the modal.
- **Persistence**: everything is saved to `localStorage` under key `taskflow.db.v1`. Access is SSR-safe (no-op outside the browser). "Reset demo data" re-seeds the store.

---

## 7. Domain Model & Seed Data

### 7.1 Types (`core/models.ts`)
- `Priority = 'low' | 'medium' | 'high' | 'urgent'`
- `TaskStatus = 'todo' | 'in-progress' | 'review' | 'done'`
- `Visibility = 'private' | 'team' | 'public'`
- `Role = 'admin' | 'member'`
- `User { id, name, email, role }`
- `Board { id, title, description, visibility, ownerId, columnIds[], createdAt }`
- `Column { id, boardId, title, status, order, wipLimit? }`
- `Task { id, boardId, columnId, title, description, priority, dueDate (yyyy-mm-dd or ''), assigneeId?, createdAt, updatedAt }`

### 7.2 Board configuration (`core/config.ts`, `BOARD_CONFIG` token)
Every new board is seeded with these four columns and the four priorities:
- Columns: **To Do** (`todo`) → **In Progress** (`in-progress`) → **Review** (`review`) → **Done** (`done`).
- Priorities: `low, medium, high, urgent`.

### 7.3 Seed data (`core/db.ts`, `TaskFlowDb.seed()`)
On first run (or after "Reset demo data") the store is seeded with:

**Users**
| id | name | role |
|---|---|---|
| `u_marci` | Marcin | admin |
| `u_anna` | Anna | member |

**Boards** — two, each with the 4 default columns and the same 5 tasks:
- **Marketing Sprint** (visibility `team`, owner `u_marci`)
- **Bug Tracker** (visibility `public`, owner `u_marci`)

**Seeded tasks per board**
| Title | Description | Column | Priority | Assignee | Due |
|---|---|---|---|---|---|
| Draft launch campaign | Write the announcement copy and gather assets. | To Do | medium | Anna | — |
| Design hero banner | Create responsive banner for the landing page. | To Do | low | — | +5 days |
| Ship onboarding email | Compose the 3-step welcome email sequence. | In Progress | high | Marcin | +2 days |
| Review Q3 metrics | Summarise funnel conversion for the exec review. | Review | urgent | Anna | — |
| Update pricing page | Reflect the new tiered pricing. | Done | medium | — | — |

> Due dates are computed relative to "today" at seed time (`+N` days), so they always look current.

---

## 8. File & Folder Layout (the structure)

```
projects/taskflow/src/
├─ index.html                 # loads Material Symbols Rounded; <app-root/>
├─ main.ts                    # bootstrapApplication(App, appConfig)
├─ styles.scss                # ★ the entire design system (single source of look)
└─ app/
   ├─ app.ts / app.html       # root shell: sticky topbar + role switch + <router-outlet/>
   ├─ app.routes.ts           # lazy routes + boardResolver; ** → ''
   ├─ app.config.ts           # providers (provideRouter, BOARD_CONFIG, etc.)
   ├─ core/                   # domain + state (no UI)
   │  ├─ models.ts            # types above
   │  ├─ config.ts            # BOARD_CONFIG token (default columns/priorities)
   │  ├─ db.ts                # TaskFlowDb: localStorage persistence + seed data
   │  ├─ helpers.ts           # newId() and small utilities
   │  ├─ session.service.ts   # role + current user (drives admin-only UI)
   │  ├─ board.store.ts       # boards state (create/delete/reset, counts)
   │  ├─ task.store.ts        # tasks state: filters, computed filteredTasks, CRUD, move
   │  ├─ board.service.ts     # thin service layer over the db for boards
   │  ├─ task.service.ts      # thin service layer over the db for tasks
   │  ├─ board.resolver.ts    # resolves a board by id into route data
   │  └─ role.guard.ts        # role-based route guard (admin/member)
   ├─ features/
   │  ├─ board-list/board-list.ts   # "/" screen: gallery + create-board form
   │  └─ board/
   │     ├─ board.ts          # orchestrator: header, filter bar, columns, modals
   │     ├─ column.ts         # one Kanban column (DnD target, quick-add)
   │     ├─ task-card.ts      # one card (draggable, hover actions, avatar)
   │     └─ task-form.ts      # create/edit form (shared by both modals)
   └─ shared/
      ├─ modal.ts             # reusable dialog (backdrop + panel + close)
      ├─ directives/
      │  ├─ admin-only.directive.ts        # *adminOnly — show only for Admin role
      │  └─ priority-highlight.directive.ts# [priorityHighlight] accent on cards
      └─ pipes/
         ├─ due-date.pipe.ts              # yyyy-mm-dd → "Aug 22, 2026" (empty when unset)
         └─ priority-label.pipe.ts        # 'urgent' → "Urgent"
```

**Architecture invariants (keep these to stay on-brand):**
- **Feature-first**: `core/` holds domain + state with no UI; `features/` hold screens; `shared/` holds reusable primitives.
- **Standalone components**, signal inputs (`input()`), outputs (`output()`), and `inject()`.
- **State lives in stores** (`board.store`, `task.store`) as signals + `computed`; components dispatch mutations to the store rather than mutating data directly.
- **Component file separation** — keep component behavior in `.ts`, templates in `.html`, and component-specific styles in `.scss` files.
- **Global styles are foundational** — use `styles.scss` for design tokens, resets, and styles intentionally shared across components; do not make it the primary source of component-specific styles.

---

## 9. Reproduction Checklist

Use this to verify your build matches the reference look:

- [ ] Global design tokens in `styles.scss` match §1.2 exactly (colors, radii, shadows).
- [ ] Material Symbols Rounded loaded in `index.html`; icons use `.material-symbols-rounded` (+ `--sm` / `--filled`).
- [ ] Root shell = sticky translucent topbar (57px) with gradient logo tile + "TaskFlow" and a ROLE Admin/Member select; content centered at max-width 1440.
- [ ] Board list: auto-fill card grid, hover lift, visibility badges, dashed empty state, create-board form with disabled-until-title button.
- [ ] Board page: back link + title + visibility badge; "New task" primary; admin-only Reset/Delete.
- [ ] Filter bar: text search + Priority select + Assignee select (All / users / Unassigned) + right-aligned filtered count, all in one white card.
- [ ] Columns: exactly 4 (`repeat(4, minmax(0,1fr))`), no horizontal scroll; each has uppercase title + count pill, cards, dashed empty state, and a quick-add row.
- [ ] Task card: priority badge top-left, hover-revealed edit/delete icons, title, clamped description, footer with due date + assignee avatar (blue gradient initial).
- [ ] Priority badges use the 4-level palette; visibility badges use private/team/public colors.
- [ ] Modals: blurred backdrop, 560px panel radius 18, header + close; create/edit share one form; view shows detail + Edit/Delete.
- [ ] Drag & drop moves cards between columns with a drop highlight; quick-add works per column.
- [ ] Role toggle hides/shows admin-only actions.
- [ ] Data persists to `localStorage` (`taskflow.db.v1`) and seeds the 2 users / 2 boards / 5 tasks from §7.3 on first run or reset.