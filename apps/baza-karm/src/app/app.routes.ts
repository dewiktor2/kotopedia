import { Route } from '@angular/router';

const paths = [
  { path: '', type: 'wszystkie', title: 'Kotopedia - karmy dla kota', description: 'Kotopedia - baza karm dla kotów, blog, kalkulator dla kotów, karmy dla kota' },
  { path: 'wszystkie', type: 'wszystkie', title: 'Kotopedia - karmy dla kota', description: 'Kotopedia - baza karm dla kotów, blog, kalkulator dla kotów, karmy dla kota' },
  { path: 'monobialkowe', type: 'monobialkowe', title: 'Kotopedia - karmy monobiałkowe', description: 'Kotopedia - polecane karmy monobiałkowe dla kotów.' },
  { path: 'chore-nerki', type: 'chore-nerki', title: 'Kotopedia - karmy dla kotów z chorymi nerkami', description: 'Karmy dla kotów z problemami nerkowymi.' },
  { path: 'polecane', type: 'polecane', title: 'Kotopedia - polecane karmy', description: 'Kotopedia - nasze rekomendacje karm dla kotów.' },
  { path: 'chora-trzustka', type: 'chora-trzustka', title: 'Kotopedia - karmy dla kotów z chorą trzustką', description: 'Kotopedia - karmy dla kotów z problemami trzustkowymi.' },
  { path: 'kocieta', type: 'kocięta', title: 'Kotopedia - karmy dla kociąt', description: 'Karmy dla młodych kotów - sprawdź najlepsze opcje.' },
    // { path: 'koty-chore', type: 'koty-chore', title: 'Kotopedia - karmy dla kotów chorych', description: 'Kotopedia - karmy dla kotów z różnymi schorzeniami.' },
  // { path: 'smaczki', type: 'smaczki', title: 'Kotopedia - smaczki dla kotów', description: 'Pyszne smaczki dla kotów - wybierz ulubione.' },
];

export const appRoutes: Route[] = paths.map(({ path, type, title, description }) => ({
  path,
  loadComponent: () => import('./domains/feed/feed.component').then((m) => m.FeedComponent),
  data: { type, title, description },
}));