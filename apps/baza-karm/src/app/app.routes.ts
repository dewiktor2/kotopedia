import { Route } from '@angular/router';

const paths = [
  { path: '', type: 'wszystkie' },
  { path: 'wszystkie', type: 'wszystkie' },
  { path: 'monobialkowe', type: 'monobialkowe' },
  { path: 'chore-nerki', type: 'chore-nerki' },
  { path: 'koty-chore', type: 'koty-chore' },
  { path: 'polecane', type: 'polecane' },
  { path: 'chora-trzustka', type: 'chora-trzustka' },
  { path: 'kocieta', type: 'kocięta' },
  { path: 'smaczki', type: 'smaczki' },
];

export const appRoutes: Route[] = paths.map(({ path, type }) => ({
  path,
  loadComponent: () =>  import('./domains/feed/feed.component').then((m) => m.FeedComponent),
  data: { type },
}));