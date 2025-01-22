
import { DestroyRef, inject, InjectionToken } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

    const defaultDescription = 'Znajdź najlepsze karmy dla swojego kota.';
    const defaultKeywords = 'kot, karma dla kota, karmy dla kotów, zdrowie kota';

    return () => router.events
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
        switchMap((route) => route.data)
      )
      .subscribe((data) => {
        const title = data['title'] || 'Kotopedia - baza karm dla kotów';
        const description = data['description'] || defaultDescription;
        const keywords = data['keywords'] || defaultKeywords;
        // const canonicalUrl = `${window.location.origin}${router.url}`;

        titleService.setTitle(title);
        meta.updateTag({ name: 'description', content: description });
        meta.updateTag({ name: 'keywords', content: keywords });
        // meta.updateTag({ name: 'canonical', content: canonicalUrl });
      });
  },
});