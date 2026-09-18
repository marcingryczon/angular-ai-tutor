import { fileContains, fileExists, json, truthy } from '../lib/checks.mjs';

const APP = 'projects/taskflow/src/app';

export default {
  phase: 10,
  title: 'Server-Side Rendering & Hydration',
  milestone:
    'SSR on: / prerendered, the board page server-rendered, hydration clean, TaskFlowDb a no-op on the server. (spec §10)',
  checks: [
    {
      name: 'the SSR entry points exist',
      run: () => {
        for (const file of [
          'projects/taskflow/src/main.server.ts',
          'projects/taskflow/src/server.ts',
          `${APP}/app.config.server.ts`,
          `${APP}/app.routes.server.ts`,
        ]) {
          fileExists(file);
        }
      },
    },
    {
      name: 'render modes follow the milestone: / prerendered, the board server-rendered',
      run: () => {
        const source = fileExists(`${APP}/app.routes.server.ts`);
        truthy(source.includes('RenderMode.Prerender'), 'nothing is prerendered (lesson 10.1)');
        truthy(
          source.includes('RenderMode.Server'),
          'the board page must be server-rendered (lesson 10.1)',
        );
      },
    },
    {
      name: 'hydration is on and the seed is transferred, not refetched',
      run: () => {
        fileContains(`${APP}/app.config.ts`, 'provideClientHydration', 'lesson 10.2');
        fileContains(`${APP}/app.config.ts`, 'withHttpTransferCacheOptions', 'lesson 10.3');
      },
    },
    {
      name: 'the store does not read localStorage during construction',
      run: async () => {
        const { walk } = await import('../lib/checks.mjs');
        const stores = walk(`${APP}/core`, (file) => /store\.ts$/.test(file));
        for (const file of stores) {
          const source = fileExists(file);
          if (source.includes('loadPersisted') || source.includes('localStorage')) {
            truthy(
              source.includes('afterNextRender'),
              `${file} reads persisted state without afterNextRender() — that is the hydration mismatch from lesson 10.2`,
            );
          }
        }
      },
    },
    {
      name: 'the build target is configured for SSR and allows a local host',
      run: () => {
        const config = json('angular.json');
        const options = config.projects.taskflow.architect.build.options;
        truthy(
          options.server && options.ssr,
          'angular.json is missing the server / ssr build options',
        );
        const hosts = options.security?.allowedHosts ?? [];
        truthy(
          hosts.length > 0,
          'security.allowedHosts is empty — the built server answers 400 for localhost (lesson 10.1)',
        );
      },
    },
  ],
};
