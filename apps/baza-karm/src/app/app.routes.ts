import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./domains/feed/container/feed-view.component').then(
        (m) => m.FeedViewComponent,
      ),
    data: {
      type: 'wszystkie',
      title: 'Kotopedia - karmy dla kota',
      description:
        'Kotopedia - baza karm dla kotów, blog, kalkulator dla kotów, karmy dla kota',
      keywords: 'kot, karmy dla kotów, zdrowe karmy, kotopedia, blog o kotach',
    },
    pathMatch: 'full',
  },
  {
    path: 'wszystkie',
    loadComponent: () =>
      import('./domains/feed/container/feed-view.component').then(
        (m) => m.FeedViewComponent,
      ),
    data: {
      type: 'wszystkie',
      title: 'Kotopedia - karmy dla kota',
      description:
        'Kotopedia - baza karm dla kotów, blog, kalkulator dla kotów, karmy dla kota',
      keywords: 'kot, karmy dla kotów, zdrowe karmy, kotopedia, blog o kotach',
    },
  },
  {
    path: 'monobialkowe',
    loadComponent: () =>
      import('./domains/feed/container/feed-view.component').then(
        (m) => m.FeedViewComponent,
      ),
    data: {
      type: 'monobialkowe',
      title: 'Kotopedia - karmy monobiałkowe',
      description: 'Kotopedia - polecane karmy monobiałkowe dla kotów.',
      keywords:
        'karmy monobiałkowe, dieta kota, jedzenie dla kota, zdrowa karma',
    },
  },
  {
    path: 'chore-nerki',
    loadComponent: () =>
      import('./domains/feed/container/feed-view.component').then(
        (m) => m.FeedViewComponent,
      ),
    data: {
      type: 'chore-nerki',
      title: 'Kotopedia - karmy dla kotów z chorymi nerkami',
      description: 'Karmy dla kotów z problemami nerkowymi.',
      keywords:
        'kot z chorymi nerkami, dieta dla kota, karmy weterynaryjne, zdrowie kota',
    },
  },
  {
    path: 'polecane',
    loadComponent: () =>
      import('./domains/feed/container/feed-view.component').then(
        (m) => m.FeedViewComponent,
      ),
    data: {
      type: 'polecane',
      title: 'Kotopedia - polecane karmy',
      description: 'Kotopedia - nasze rekomendacje karm dla kotów.',
      keywords: 'polecane karmy, najlepsze karmy, kot, jedzenie dla kota',
    },
  },
  {
    path: 'chora-trzustka',
    loadComponent: () =>
      import('./domains/feed/container/feed-view.component').then(
        (m) => m.FeedViewComponent,
      ),
    data: {
      type: 'polecane',
      title: 'Kotopedia - polecane karmy',
      description: 'Kotopedia - nasze rekomendacje karm dla kotów.',
      keywords: 'polecane karmy, najlepsze karmy, kot, jedzenie dla kota',
    },
  },
  {
    path: 'kocieta',
    loadComponent: () =>
      import('./domains/feed/container/feed-view.component').then(
        (m) => m.FeedViewComponent,
      ),
    data: {
      type: 'kocięta',
      title: 'Kotopedia - karmy dla kociąt',
      description: 'Karmy dla młodych kotów - sprawdź najlepsze opcje.',
      keywords:
        'kocięta, karma dla kociąt, młody kot, najlepsze karmy dla młodych kotów',
    },
  },
  {
    path: '**',
    loadComponent: () =>
      import('./domains/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
    data: {
      type: 'not-found',
      title: 'Kotopedia - Nie znaleziono podanej strony',
      noMeta: true,
    },
  },
];
