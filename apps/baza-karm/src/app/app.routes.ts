import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadComponent: () => 
        import('./domains/feed/index')
            .then(m => m.FeedComponent)
    },
];
