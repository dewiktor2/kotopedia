import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import * as EJ2_LOCALE from '../../assets/i18n/sync-pl.json';

export const CULTURE_HANDLER = new InjectionToken<() => void>(
  'CULTURE_HANDLER',
  {
    providedIn: 'root',
    factory: () => {
      const platformId = inject(PLATFORM_ID);

      return () => {
        if (isPlatformBrowser(platformId)) {
          // Load the CLDR data in the browser
          L10n.load({ pl: EJ2_LOCALE.pl });
          setCulture('pl');
        }
      };
    },
  },
);
