# Milestone verification

`npm run verify <phase>` checks the milestone from `course/taskflow-spec.md` §10 against the code
you actually wrote. It is the answer to "am I done with this phase?" that does not require a tutor.

```bash
npm run verify 7     # the "after phase 7" milestone
npm run verify 3 4   # several phases
npm run verify       # every phase — expect red for the ones you have not reached
```

A red check before you have done that phase is normal and useful: the list *is* the phase plan,
written as assertions. A red check **after** you finished the phase is a bug in your code — or a
disagreement with the spec, which is worth a conversation.

## What it does

- **Static checks** read your files: does `BOARD_CONFIG` exist, is every component `OnPush`, does any
  `@for` still track by `$index`, are the old signal stores really deleted.
- **Browser checks** start `ng serve taskflow` on port 4399, drive headless Chrome over the DevTools
  protocol, and assert real behaviour: four columns with no horizontal scroll, a debounced search, a
  dialog that traps focus and gives it back, an unknown board id that redirects.

No test framework and no npm dependency is involved — Node 24 has everything needed. Chrome is found
automatically on macOS; elsewhere set `CHROME_PATH`.

## Adding a check

Phase files live in `verify/phases/phase-NN.mjs` and export `{ phase, title, milestone, checks }`.
A check is `{ name, needsApp?, run }`; `run` throws with a message that says what was expected.
Helpers are in `verify/lib/checks.mjs`.

```js
{
  name: 'the board renders four columns',
  needsApp: true,
  run: async ({ visit }) => {
    const page = await visit('/');
    const columns = await page.evaluate("return document.querySelectorAll('.column').length;");
    equals(columns, 4, 'number of .column elements');
  },
}
```

Write the failure message for the person who will read it at 23:00, not for yourself today.
