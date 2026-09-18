import { fileExists, truthy, walk } from '../lib/checks.mjs';

const APP = 'projects/taskflow/src/app';

export default {
  phase: 8,
  title: 'Change Detection & Performance',
  milestone:
    'Every component is OnPush, every @for tracks by id, the modal body sits behind @defer. No visual change. (spec §10)',
  checks: [
    {
      name: 'every component uses OnPush',
      run: () => {
        const offenders = walk(
          APP,
          (file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'),
        ).filter((file) => {
          const source = fileExists(file);
          return (
            source.includes('@Component(') && !source.includes('ChangeDetectionStrategy.OnPush')
          );
        });
        truthy(offenders.length === 0, `not OnPush yet: ${offenders.join(', ')}`);
      },
    },
    {
      name: 'no @for tracks by $index',
      run: () => {
        const offenders = walk(APP, (file) => file.endsWith('.html')).filter((file) =>
          /@for\s*\([^)]*track\s+\$index/.test(fileExists(file)),
        );
        truthy(
          offenders.length === 0,
          `tracking by position costs DOM churn: ${offenders.join(', ')} (lesson 8.5)`,
        );
      },
    },
    {
      name: 'every @for has a track expression at all',
      run: () => {
        // The header runs up to the opening brace: `tasks()` inside it has its own parentheses.
        const offenders = walk(APP, (file) => file.endsWith('.html')).filter((file) => {
          const headers = fileExists(file).match(/@for\s*\(([^{]*)\)\s*\{/g) ?? [];
          return headers.some((header) => !header.includes('track'));
        });
        truthy(offenders.length === 0, `@for without track: ${offenders.join(', ')}`);
      },
    },
    {
      name: 'OnPush is the schematic default from now on',
      run: async () => {
        const { json } = await import('../lib/checks.mjs');
        const config = json('angular.json');
        const component =
          config.projects.taskflow.schematics?.['@schematics/angular:component'] ?? {};
        truthy(
          component.changeDetection === 'OnPush',
          'angular.json should generate OnPush components',
        );
      },
    },
    {
      name: 'the modal body is deferred',
      run: () => {
        const found = walk(APP, (file) => file.endsWith('.html')).some((file) =>
          fileExists(file).includes('@defer'),
        );
        truthy(found, 'no @defer block anywhere (lesson 8.5)');
      },
    },
  ],
};
