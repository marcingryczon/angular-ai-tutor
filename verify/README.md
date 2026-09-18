# Milestone verification

`npm run verify <phase>` checks the milestone from `course/taskflow-spec.md` §10 against the code
you actually wrote. It is the answer to "am I done with this phase?" that does not require a tutor.

```bash
npm run verify 7     # the "after phase 7" milestone
npm run verify 3 4   # several phases
npm run verify       # every phase — expect red for the ones you have not reached
```

A red check before you have done that phase is normal and useful: the list _is_ the phase plan,
written as assertions. A red check **after** you finished the phase is a bug in your code — or a
disagreement with the spec, which is worth a conversation.

## What it does

- **Static checks** read your files: does `BOARD_CONFIG` exist, is every component `OnPush`, does any
  `@for` still track by `$index`, are the old signal stores really deleted.
- **Browser checks** start `ng serve taskflow` on port 4399, drive headless Chrome over the DevTools
  protocol, and assert real behaviour: four columns with no horizontal scroll, a debounced search, a
  dialog that traps focus and gives it back, an unknown board id that redirects.
- **Suite checks** run your own unit tests (`verify/lib/tests.mjs`). From lesson 3.6 the specs have to
  be green, not merely present; from Phase 11 the run adds `--coverage`, which makes the builder
  enforce the thresholds in `angular.json` — so a passing run *is* the coverage assertion. The run is
  cached, so two phases asking for it pay for it once.

No test framework and no npm dependency is involved — Node 24 has everything needed. Chrome is found
automatically on macOS; elsewhere set `CHROME_PATH`.

## The rule these checks follow

**A milestone that has been reached stays reached.** Phase 5 moves the state out of the services and
Phase 13 moves it again into NgRx slices, so a Phase 4 check that looks for `signal(` _in
`board.service.ts`_ would go red later through no fault of the learner. Checks therefore assert the
milestone ("state is held in signals somewhere in `core/`"), not the file layout of the phase that
introduced it. `npm run verify` on a finished app should be green from 0 to 14.

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

Write the failure message for the person who will read it at 23:00, not for yourself today. Multi-line
messages are printed in full, so quoting a failing spec or a build log is worth doing.

## Checking the checks

A green suite proves nothing until you have seen it go red. The way to trust a new check is to break
the thing it guards — remove one `OnPush`, widen a column so four no longer fit, drop a coverage
threshold — run it, confirm the failure names the right file, and revert. Two of these checks were
found to be lying that way: one counted spec files while claiming the suite was green, and one asserted
a single coverage metric while three others sat at zero.
