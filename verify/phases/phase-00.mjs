import { fileContains, fileExists, json, truthy } from '../lib/checks.mjs';

const APP = 'projects/taskflow/src/app';

export default {
  phase: 0,
  title: 'Project Setup & Angular Fundamentals',
  milestone: 'Unchanged UI. core/models.ts and core/helpers.ts exist. (spec §10)',
  checks: [
    {
      name: 'the workspace compiles in strict mode',
      run: () => {
        const config = json('tsconfig.json');
        truthy(config.compilerOptions.strict === true, 'tsconfig.json needs "strict": true');
      },
    },
    {
      name: 'core/models.ts declares the domain (spec §7.1)',
      run: () => {
        const types = ['Priority', 'TaskStatus', 'Visibility', 'Role', 'User', 'Board', 'Column', 'Task'];
        const source = fileExists(`${APP}/core/models.ts`);
        for (const type of types) {
          truthy(
            new RegExp(`(type|interface)\\s+${type}\\b`).test(source),
            `core/models.ts is missing the ${type} type`,
          );
        }
      },
    },
    {
      name: 'core/helpers.ts exports newId() and a generic findById()',
      run: () => {
        fileContains(`${APP}/core/helpers.ts`, /function newId/, 'lesson 0.2.3');
        fileContains(`${APP}/core/helpers.ts`, /function findById<\s*T extends/, 'it must stay generic — no any');
      },
    },
    {
      name: 'the domain model avoids any',
      run: () => {
        const source = fileExists(`${APP}/core/models.ts`);
        truthy(!/\bany\b/.test(source), 'core/models.ts still contains "any"');
      },
    },
  ],
};
