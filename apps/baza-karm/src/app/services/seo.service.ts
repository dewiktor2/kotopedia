import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private meta: Meta, private router: Router, private titleService: Title) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const description = this.getDescriptionForCurrentRoute();
        this.meta.updateTag({ name: 'description', content: description });
      });
  }

  getDescriptionForCurrentRoute(): string {
    if (this.router.url === '/wszystkie') {
      this.titleService.setTitle('Kotopedia - karmy dla kota')
      return 'Kotopedia - baza karm dla kotów, blog, kalkulator dla kotów, karmy dla kota';
    }
    if (this.router.url === '/monobialkowe') {
      this.titleService.setTitle('Kotopedia - polecane karmy monobiałkowe dla kota')
      return 'Kotopedia - baza karm dla kotów, blog, kalkulator dla kotów, karmy monobiałkowe dla kotów';
    }
    if (this.router.url === '/chore-nerki') {
      this.titleService.setTitle('Kotopedia - karmy dla kotów dla kotów z chorymi nerkami')
      return 'Kotopedia - baza karm dla kotów, karmy dla kotów chorych na nerki';
    }
    if (this.router.url === '/polecane') {
      this.titleService.setTitle('Kotopedia - polecane karmy dla kota')
      return 'Kotopedia - baza karm dla kotów, blog, kalkulator dla kotów, polecane karmy dla kotów';
    }
    if (this.router.url === '/kocięta') {
      this.titleService.setTitle('Kotopedia - karmy dla kociąt')
      return 'Kotopedia - baza karm dla kotów, blog, kalkulator dla kotów, karmy dla kociąt';
    }
    if (this.router.url === '/chora-trzustka') {
      this.titleService.setTitle('Kotopedia - karmy dla kotów z chorą trzustką')
      return 'Kotopedia - baza karm dla kotów, blog, kalkulator dla kotów, karmy dla kotów z chorą trzustką';
    }
    return 'Kotopedia - baza karm dla kotów, blog, kalkulator dla kotów, karmy dla kota';
  }
}
