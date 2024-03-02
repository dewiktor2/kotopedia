import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import * as EJ2_LOCALE from '../../assets/i18n/sync-pl.json';
@Injectable({
  providedIn: 'root'
})
export class CultureService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Load the CLDR data in the browser
      this.setCult('pl');
    }
  }

  setCult(locale: string) {
    if (isPlatformBrowser(this.platformId)) {
        L10n.load({ pl: EJ2_LOCALE.pl });
        setCulture('pl');
    }
  }
}
