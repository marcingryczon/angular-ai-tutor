import { atLeast, fileContains, fileExists, json, truthy, walk } from '../lib/checks.mjs';

const APP = 'projects/taskflow/src/app';

export default {
  phase: 14,
  title: 'Architecture & Production — the finale',
  milestone:
    'Boundaries audited, domain functions extracted, budgets set against the measured size, global error handling, CI, and the app deployed. (spec §10)',
  checks: [
    {
      name: 'core/ never imports from features/',
      run: () => {
        const offenders = walk(`${APP}/core`, (file) => file.endsWith('.ts')).filter((file) =>
          /from '\.\.\/.*features\//.test(fileExists(file)),
        );
        truthy(offenders.length === 0, `core must not depend on features: ${offenders.join(', ')} (lesson 14.1)`);
      },
    },
    {
      name: 'the business rules live in core/domain as pure functions',
      run: () => {
        const files = walk(`${APP}/core/domain`, (file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'));
        atLeast(files.length, 1, 'files in core/domain (lesson 14.2)');
        for (const file of files) {
          const source = fileExists(file);
          truthy(
            !/@Injectable|inject\(/.test(source),
            `${file} is not a pure function module — domain code takes arguments, not dependencies`,
          );
        }
      },
    },
    {
      name: 'the domain functions have their own tests',
      run: () => {
        const specs = walk(`${APP}/core/domain`, (file) => file.endsWith('.spec.ts'));
        atLeast(specs.length, 1, 'spec files in core/domain (lesson 14.2)');
      },
    },
    {
      name: 'bundle budgets are set',
      run: () => {
        const config = json('angular.json');
        const budgets = config.projects.taskflow.architect.build.configurations.production.budgets ?? [];
        const initial = budgets.find((budget) => budget.type === 'initial');
        truthy(initial, 'no initial bundle budget (lesson 14.3)');
      },
    },
    {
      name: 'errors have somewhere to land',
      run: () => {
        fileExists(`${APP}/core/error-handler.ts`);
        fileContains(`${APP}/app.config.ts`, 'ErrorHandler', 'wire the handler in app.config.ts (lesson 14.4)');
      },
    },
    {
      name: 'CI runs the tests and the production build',
      run: () => {
        const workflows = walk('.github/workflows', (file) => /\.ya?ml$/.test(file));
        atLeast(workflows.length, 1, 'workflow files in .github/workflows (lesson 14.4)');
        const content = workflows.map((file) => fileExists(file)).join('\n');
        truthy(/test/.test(content), 'the workflow does not run the tests');
        truthy(/build/.test(content), 'the workflow does not run a production build');
      },
    },
    {
      name: 'the production build is reproducible from a clean checkout',
      run: () => {
        const pkg = json('package.json');
        truthy(pkg.scripts?.['build:taskflow'], 'npm run build:taskflow is missing');
        const ranges = Object.entries({ ...pkg.dependencies }).filter(
          ([name, version]) => name.startsWith('@angular/') && /^[\^~]/.test(version),
        );
        truthy(
          ranges.length === 0,
          `pin the framework for a reproducible build: ${ranges.map(([n, v]) => `${n}@${v}`).join(', ')}`,
        );
      },
    },
  ],
};
