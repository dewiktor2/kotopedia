import { Route } from '@angular/router';

const allFeedsSeo = {
  title: $localize`:@@seo.all.title:Kotopedia - karmy dla kota`,
  description: $localize`:@@seo.all.description:Kotopedia - baza karm dla kotów, blog, kalkulator dla kotów, karmy dla kota`,
  keywords: $localize`:@@seo.all.keywords:kot, karmy dla kotów, zdrowe karmy, kotopedia, blog o kotach`,
};

const singleProteinFeedsSeo = {
  title: $localize`:@@seo.singleProtein.title:Kotopedia - karmy monobiałkowe`,
  description: $localize`:@@seo.singleProtein.description:Kotopedia - polecane karmy monobiałkowe dla kotów.`,
  keywords: $localize`:@@seo.singleProtein.keywords:karmy monobiałkowe, dieta kota, jedzenie dla kota, zdrowa karma`,
};

const kidneyFeedsSeo = {
  title: $localize`:@@seo.kidney.title:Kotopedia - karmy dla kotów z chorymi nerkami`,
  description: $localize`:@@seo.kidney.description:Karmy dla kotów z problemami nerkowymi.`,
  keywords: $localize`:@@seo.kidney.keywords:kot z chorymi nerkami, dieta dla kota, karmy weterynaryjne, zdrowie kota`,
};

const recommendedFeedsSeo = {
  title: $localize`:@@seo.recommended.title:Kotopedia - polecane karmy`,
  description: $localize`:@@seo.recommended.description:Kotopedia - nasze rekomendacje karm dla kotów.`,
  keywords: $localize`:@@seo.recommended.keywords:polecane karmy, najlepsze karmy, kot, jedzenie dla kota`,
};

const kittenFeedsSeo = {
  title: $localize`:@@seo.kitten.title:Kotopedia - karmy dla kociąt`,
  description: $localize`:@@seo.kitten.description:Karmy dla młodych kotów - sprawdź najlepsze opcje.`,
  keywords: $localize`:@@seo.kitten.keywords:kocięta, karma dla kociąt, młody kot, najlepsze karmy dla młodych kotów`,
};

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./domains/feed/container/feed-view.component').then(
        (m) => m.FeedViewComponent,
      ),
    data: {
      type: 'wszystkie',
      ...allFeedsSeo,
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
      ...allFeedsSeo,
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
      ...singleProteinFeedsSeo,
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
      ...kidneyFeedsSeo,
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
      ...recommendedFeedsSeo,
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
      ...recommendedFeedsSeo,
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
      ...kittenFeedsSeo,
    },
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./domains/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./domains/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
    data: {
      type: 'not-found',
      title: $localize`:@@seo.notFound.title:Kotopedia - Nie znaleziono podanej strony`,
      noMeta: true,
    },
  },
];
