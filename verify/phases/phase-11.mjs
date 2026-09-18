import { atLeast, fileExists, json, truthy, walk } from '../lib/checks.mjs';

const APP = 'projects/taskflow/src/app';

const HINT =
  '\n\nIf these specs pass when you run `ng test taskflow` on their own, nothing is wrong with\nyour code: something else was building this workspace at the same time.';

export default {
  phase: 11,
  title: 'Testing',
  milestone:
    'Unit tests for every unit; coverage ≥ 90% in projects/taskflow/src. No visual change. (spec §10)',
  checks: [
    {
      name: 'the taskflow project has a test target',
      run: () => {
        const config = json('angular.json');
        const test = config.projects.taskflow.architect.test;
        truthy(test, 'angular.json has no test target for taskflow');
        truthy(
          test.builder === '@angular/build:unit-test',
          'use the @angular/build:unit-test builder',
        );
      },
    },
    {
      name: 'new files get a spec again (skipTests is gone)',
      run: () => {
        const config = json('angular.json');
        const schematics = config.projects.taskflow.schematics ?? {};
        const offenders = Object.entries(schematics).filter(([, value]) => value?.skipTests);
        truthy(
          offenders.length === 0,
          `skipTests is still on for: ${offenders.map(([k]) => k).join(', ')}`,
        );
      },
    },
    {
      name: 'coverage thresholds are configured',
      run: () => {
        const config = json('angular.json');
        const options = config.projects.taskflow.architect.test.options ?? {};
        truthy(options.coverage, 'coverage is not enabled on the test target');
        const thresholds = options.coverageThresholds ?? {};

        // Every dimension, not just lines: a threshold set on one metric and left at zero on the
        // rest is a green light that measures nothing.
        atLeast(thresholds.lines ?? 0, 90, 'line coverage threshold (policy: ≥ 90% for src/)');
        atLeast(thresholds.statements ?? 0, 90, 'statement coverage threshold (policy: ≥ 90%)');
        atLeast(thresholds.functions ?? 0, 80, 'function coverage threshold (policy: ≥ 80%)');
        atLeast(thresholds.branches ?? 0, 80, 'branch coverage threshold (policy: ≥ 80%)');
      },
    },
    {
      name: 'the suite passes at those thresholds',
      needsSuite: 'coverage',
      run: async () => {
        // The milestone is a measurement, not a setting. Coverage is enforced by the builder, so
        // a run that exits non-zero means either a red spec or coverage below the thresholds.
        const { runSuite, tail } = await import('../lib/tests.mjs');
        const suite = await runSuite({ coverage: true });
        truthy(
          suite.ok,
          `the suite failed, or coverage is under the thresholds:\n${tail(suite.output, 16)}${HINT}`,
        );
      },
    },
    {
      name: 'the coverage provider is installed',
      run: () => {
        const pkg = json('package.json');
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        truthy(
          deps['@vitest/coverage-v8'] || deps['@vitest/coverage-istanbul'],
          'run: npm install -D @vitest/coverage-v8 (lesson 11.1)',
        );
      },
    },
    {
      name: 'every component, service, directive and pipe has a spec next to it',
      run: () => {
        const hasSpec = (file) => {
          try {
            fileExists(file.replace(/\.ts$/, '.spec.ts'));
            return true;
          } catch {
            return false;
          }
        };
        const units = walk(
          APP,
          (file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'),
        ).filter((file) =>
          /@Component\(|@Injectable\(|@Directive\(|@Pipe\(/.test(fileExists(file)),
        );
        const missing = units
          .filter((file) => !hasSpec(file))
          .map((file) => file.replace(`${APP}/`, ''));
        truthy(missing.length === 0, `no spec for: ${missing.join(', ')}`);
      },
    },
  ],
};
