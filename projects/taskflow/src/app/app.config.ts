import {
  ApplicationConfig,
  ErrorHandler,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { TaskFlowErrorHandler } from './core/error-handler';
import { loggingInterceptor } from './core/logging.interceptor';
import { boardsFeature } from './core/ngrx/board.store';
import { tasksFeature } from './core/ngrx/task.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: ErrorHandler, useClass: TaskFlowErrorHandler },
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
    provideHttpClient(withFetch(), withInterceptors([loggingInterceptor])),
    // The transfer cache replays seed.json from the server render, so the
    // browser does not fetch it a second time right after hydration.
    provideClientHydration(withHttpTransferCacheOptions({ includePostRequests: false })),
    provideStore({
      [boardsFeature.name]: boardsFeature.reducer,
      [tasksFeature.name]: tasksFeature.reducer,
    }),
    // Time-travel debugging in dev; a read-only log in production builds.
    provideStoreDevtools({ maxAge: 50, logOnly: !isDevMode(), connectInZone: false }),
  ],
};
