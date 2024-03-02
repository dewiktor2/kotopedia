import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@kotopedia/domains/feed').then((m) => m.FeedComponent),
    data: { type: 'wszystkie' },
  },
  {
    path: 'wszystkie',
    loadComponent: () =>
      import('@kotopedia/domains/feed').then((m) => m.FeedComponent),
    data: { type: 'wszystkie' },
  },
  {
    path: 'monobialkowe',
    loadComponent: () =>
      import('@kotopedia/domains/feed').then((m) => m.FeedComponent),
    data: { type: 'monobialkowe' },
  },
  {
    path: 'koty-chore',
    loadComponent: () =>
      import('@kotopedia/domains/feed').then((m) => m.FeedComponent),
    data: { type: 'koty-chore' },
  },
  {
    path: 'polecane',
    loadComponent: () =>
      import('@kotopedia/domains/feed').then((m) => m.FeedComponent),
    data: { type: 'polecane' },
  },
  {
    path: 'smaczki',
    loadComponent: () =>
      import('@kotopedia/domains/feed').then((m) => m.FeedComponent),
    data: { type: 'smaczki' },
  },
];
