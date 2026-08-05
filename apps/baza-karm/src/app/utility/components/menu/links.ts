const navigationLinks = [
  {
    route: '/wszystkie',
    name: $localize`:@@navigation.allFeeds:Wszystkie`,
  },
  {
    route: '/polecane',
    name: $localize`:@@navigation.recommendedFeeds:Polecane`,
  },
  {
    route: '/monobialkowe',
    name: $localize`:@@navigation.singleProteinFeeds:Monobiałkowe`,
  },
  {
    route: '/chore-nerki',
    name: $localize`:@@navigation.kidneyFeeds:Chore nerki`,
  },
  {
    route: '/chora-trzustka',
    name: $localize`:@@navigation.pancreasFeeds:Chora trzustka`,
  },
  {
    route: '/kocieta',
    name: $localize`:@@navigation.kittenFeeds:Kocięta`,
  },
];

export const links = {
  mobile: navigationLinks,
  desktop: navigationLinks,
};
