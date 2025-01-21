// import { Injectable } from '@angular/core';
// import { Meta, Title } from '@angular/platform-browser';
// import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// import { filter, map, mergeMap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class SeoService {
//   constructor(private meta: Meta, private titleService: Title, private router: Router, private activatedRoute: ActivatedRoute) {
//     this.router.events
//       .pipe(
//         filter((event) => event instanceof NavigationEnd),
//         map(() => this.activatedRoute),
//         map((route) => {
//           while (route.firstChild) {
//             route = route.firstChild;
//           }
//           return route;
//         }),
//         mergeMap((route) => route.data)
//       )
//       .subscribe((data) => {
//         const title = data['title'] || 'Kotopedia - baza karm dla kotów';
//         const description = data['description'] || '';
//         this.titleService.setTitle(title);
//         this.meta.updateTag({ name: 'description', content: description });
//       });
//   }
// }