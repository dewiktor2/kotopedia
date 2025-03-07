import '@angular/common/locales/global/pl';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideStore, withNgxsDevelopmentOptions } from '@ngxs/store';
import { appRoutes } from './app.routes';
import { FeedsState } from './domains/feed/+state/feed.state';
import { provideSvgIconsConfig } from '@ngneat/svg-icon';
import { hamburgerIcon } from '../assets/ngSvg/hamburger';
import { searchIcon } from '../assets/ngSvg/search';
import { descriptionIcon } from '../assets/ngSvg/description';
import { funnelIcon } from '../assets/ngSvg/funnel';
import { chevronDownIcon } from '../assets/ngSvg/chevronDown';
import { leftArrowIcon } from '../assets/ngSvg/leftArrow';
import { UNIVERSAL_PROVIDERS } from '@ng-web-apis/universal';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';

const icons = [
  hamburgerIcon,
  searchIcon,
  descriptionIcon,
  funnelIcon,
  chevronDownIcon,
  leftArrowIcon,
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    NG_EVENT_PLUGINS,
    provideClientHydration(),
    provideRouter(appRoutes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideSvgIconsConfig({
      sizes: {
        xs: '10px',
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '25px',
        xxl: '30px',
      },
      defaultSize: 'md',
      icons,
    }),
    provideStore(
      [FeedsState],
      { developmentMode: isDevMode() },
      withNgxsDevelopmentOptions({
        warnOnUnhandledActions: true,
      }),
    ),
    UNIVERSAL_PROVIDERS,
  ],
};
