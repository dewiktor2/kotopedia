import { DestroyRef, inject, InjectionToken } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';

export const SEO_HANDLER = new InjectionToken<void>('SEO_HANDLER', {
  providedIn: 'root',
  factory: () => {
    const meta = inject(Meta);
    const titleService = inject(Title);
    const router = inject(Router);
    const activatedRoute = inject(ActivatedRoute);
    const destroyRef = inject(DestroyRef);
    const document = inject(DOCUMENT);

    const defaultDescription = 'Znajdź najlepsze karmy dla swojego kota.';
    const defaultKeywords =
      'kot, karma dla kota, karmy dla kotów, zdrowie kota';

    const updateCanonicalUrl = (url: string) => {
      let link: HTMLLinkElement | null = document.querySelector(
        'link[rel="canonical"]',
      );

      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }

      link.setAttribute('href', url);
    };

    return () =>
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
          takeUntilDestroyed(destroyRef),
          switchMap((route) => route.data || {}),
        )
        .subscribe((data) => {
          const title = data['title'] || 'Kotopedia - baza karm dla kotów';

          titleService.setTitle(title);

          if (data['noMeta']) {
            return;
          }

          const description = data['description'] || defaultDescription;
          const keywords = data['keywords'] || defaultKeywords;
          const canonicalUrl = `${document.location.origin}${router.url}`;

          meta.updateTag({ name: 'description', content: description });
          meta.updateTag({ name: 'keywords', content: keywords });
          updateCanonicalUrl(canonicalUrl);
        });
  },
});
