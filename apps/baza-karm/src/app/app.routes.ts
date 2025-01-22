import { Route } from '@angular/router';

const paths = [
  { 
    path: '', 
    type: 'wszystkie', 
    title: 'Kotopedia - karmy dla kota', 
    description: 'Kotopedia - baza karm dla kotów, karmy, kalkulator dla kotów, karmy dla kota', 
    keywords: 'kot, kota, karma dla kota, karmy dla kotów, kotopedia, najlepsze karmy, zdrowie kota' 
  },
  { 
    path: 'wszystkie', 
    type: 'wszystkie', 
    title: 'Kotopedia - karmy dla kota', 
    description: 'Kotopedia - baza karm dla kotów, blog, kalkulator dla kotów, karmy dla kota', 
    keywords: 'kot, karmy dla kotów, zdrowe karmy, kotopedia, blog o kotach' 
  },
  { 
    path: 'monobialkowe', 
    type: 'monobialkowe', 
    title: 'Kotopedia - karmy monobiałkowe', 
    description: 'Kotopedia - polecane karmy monobiałkowe dla kotów.', 
    keywords: 'karmy monobiałkowe, dieta kota, jedzenie dla kota, zdrowa karma' 
  },
  { 
    path: 'chore-nerki', 
    type: 'chore-nerki', 
    title: 'Kotopedia - karmy dla kotów z chorymi nerkami', 
    description: 'Karmy dla kotów z problemami nerkowymi.', 
    keywords: 'kot z chorymi nerkami, dieta dla kota, karmy weterynaryjne, zdrowie kota' 
  },
  { 
    path: 'polecane', 
    type: 'polecane', 
    title: 'Kotopedia - polecane karmy', 
    description: 'Kotopedia - nasze rekomendacje karm dla kotów.', 
    keywords: 'polecane karmy, najlepsze karmy, kot, jedzenie dla kota' 
  },
  { 
    path: 'chora-trzustka', 
    type: 'chora-trzustka', 
    title: 'Kotopedia - karmy dla kotów z chorą trzustką', 
    description: 'Kotopedia - karmy dla kotów z problemami trzustkowymi.', 
    keywords: 'kot z chorą trzustką, karmy weterynaryjne, dieta kota' 
  },
  { 
    path: 'kocieta', 
    type: 'kocięta', 
    title: 'Kotopedia - karmy dla kociąt', 
    description: 'Karmy dla młodych kotów - sprawdź najlepsze opcje.', 
    keywords: 'kocięta, karma dla kociąt, młody kot, najlepsze karmy dla młodych kotów' 
  },
];

export const appRoutes: Route[] = paths.map(({ path, type, title, description, keywords }) => ({
  path,
  loadComponent: () => import('./domains/feed/feed.component').then((m) => m.FeedComponent),
  data: { type, title, description, keywords  },
}));