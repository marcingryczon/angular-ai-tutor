import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';

import { routes } from './app.routes';
import { TaskFlowErrorHandler } from './core/error-handler';
import { loggingInterceptor } from './core/logging.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: ErrorHandler, useClass: TaskFlowErrorHandler },
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
    provideHttpClient(withFetch(), withInterceptors([loggingInterceptor])),
    // The transfer cache replays seed.json from the server render, so the
    // browser does not fetch it a second time right after hydration.
    provideClientHydration(withHttpTransferCacheOptions({ includePostRequests: false })),
  ],
};
