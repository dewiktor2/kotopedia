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
    path: 'chore-nerki',
    loadComponent: () =>
      import('@kotopedia/domains/feed').then((m) => m.FeedComponent),
    data: { type: 'chore-nerki' },
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
    path: 'chora-trzustka',
    loadComponent: () =>
      import('@kotopedia/domains/feed').then((m) => m.FeedComponent),
    data: { type: 'chora-trzustka' },
  },
  {
    path: 'kocięta',
    loadComponent: () =>
      import('@kotopedia/domains/feed').then((m) => m.FeedComponent),
    data: { type: 'kocięta' },
  },
  {
    path: 'smaczki',
    loadComponent: () =>
      import('@kotopedia/domains/feed').then((m) => m.FeedComponent),
    data: { type: 'smaczki' },
  },
];
