import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import '@angular/common/locales/global/pl';
import { AdsenseModule } from 'ng2-adsense';
import { FeedsState } from './domains/feed/+state/feed.state';
import { NgxsModule } from '@ngxs/store';


export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(appRoutes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    importProvidersFrom(
      AdsenseModule.forRoot({
        adClient: 'ca-pub-4829562881799420'
      }),
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
