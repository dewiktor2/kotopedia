import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { FeedsState } from '@kotopedia/domains/feed';
import { provideServiceWorker } from '@angular/service-worker';
import '@angular/common/locales/global/pl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(appRoutes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    importProvidersFrom(
      NgxsModule.forRoot([FeedsState], {
        developmentMode: isDevMode(),
        selectorOptions: {
          suppressErrors: false,
          injectContainerState: false,
        },
      })
    ),
  ],
};
