import '@angular/common/locales/global/pl';
import {
  ApplicationConfig,
  isDevMode
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideStore, withNgxsDevelopmentOptions } from '@ngxs/store';
import { appRoutes } from './app.routes';
import { FeedsState } from './domains/feed/+state/feed.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(appRoutes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideStore(
      [FeedsState],
      { developmentMode: isDevMode() },
      withNgxsDevelopmentOptions({
        warnOnUnhandledActions: true,
      })
    ),
  ],
};
