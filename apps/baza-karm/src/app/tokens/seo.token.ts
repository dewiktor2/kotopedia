import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter, map, switchMap } from 'rxjs/operators';

export const SEO_HANDLER = new InjectionToken<void>('SEO_HANDLER', {
  providedIn: 'root',
  factory: () => {
    const meta = inject(Meta);
    const titleService = inject(Title);
    const router = inject(Router);
    const activatedRoute = inject(ActivatedRoute);
    const platformId = inject(PLATFORM_ID);
    const document = inject(DOCUMENT);

    const defaultDescription = 'Znajdź najlepsze karmy dla swojego kota.';
    const defaultKeywords =
      'kot, karma dla kota, karmy dla kotów, zdrowie kota';

    return () => {
      if (isPlatformBrowser(platformId)) {
        router.events
          .pipe(
            filter((event) => event instanceof NavigationEnd),
            map(() => activatedRoute),
            map((route) => {
              while (route.firstChild) {
                route = route.firstChild;
              }
              return route;
            }),
            switchMap((route) => route.data)
          )
          .subscribe((data) => {
            const title = data['title'] || 'Kotopedia - baza karm dla kotów';
            const description = data['description'] || defaultDescription;
            const keywords = data['keywords'] || defaultKeywords;

            const canonicalLinkElement = document.querySelector(
              'link[rel="canonical"]'
            ) as HTMLLinkElement | null;

            const canonicalUrl = `${document.location.origin}${router.url}`;

            titleService.setTitle(title);
            meta.updateTag({ name: 'description', content: description });
            meta.updateTag({ name: 'keywords', content: keywords });

            if (canonicalLinkElement) {
              canonicalLinkElement.href = canonicalUrl;
            } else {
              const link: HTMLLinkElement = document.createElement('link');
              link.setAttribute('rel', 'canonical');
              link.setAttribute('href', canonicalUrl);
              document.head.appendChild(link);
            }
          });
      }
    };
  },
});
