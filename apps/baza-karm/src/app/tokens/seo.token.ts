import { inject, InjectionToken } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

export const SEO_HANDLER = new InjectionToken<void>('SEO_HANDLER', {
  providedIn: 'root',
  factory: () => {
    const meta = inject(Meta);
    const titleService = inject(Title);
    const router = inject(Router);
    const activatedRoute = inject(ActivatedRoute);

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
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        const title = data['title'] || 'Kotopedia - baza karm dla kotów';
        const description = data['description'] || '';
        titleService.setTitle(title);
        meta.updateTag({ name: 'description', content: description });
      });
  },
});