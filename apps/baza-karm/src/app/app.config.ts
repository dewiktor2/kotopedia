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
import '@angular/common/locales/global/pl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(appRoutes),
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
