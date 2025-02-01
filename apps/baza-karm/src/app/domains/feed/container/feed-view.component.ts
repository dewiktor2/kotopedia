import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ViewEncapsulation,
  OnInit,
  Inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import {
  GridModule,
  SortService,
  PageService,
} from '@syncfusion/ej2-angular-grids';
import { FeedComponent } from '../feed.component';
import { FeedCardsComponent } from '../childs/mobile/feed-cards.component';


@Component({
  imports: [
    GridModule,
    FeedComponent,
    FeedCardsComponent
  ],
  providers: [SortService, PageService],
  selector: 'bk-view-feed',
  encapsulation: ViewEncapsulation.None,
  template: ` <div>
    @if(!isMobile) {
        <bk-feed />
    } @else {
        <bk-feed-cards />
    }
  </div>`,
})
export class FeedViewComponent implements OnInit, OnDestroy {
  isMobile = false;
  private resizeListener: () => void;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Przechowujemy referencję do listenera, aby później móc go usunąć
    this.resizeListener = () => this.checkIfMobile();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Ustawienie początkowej wartości flagi
      this.checkIfMobile();
      // Dodajemy listener dla zmiany rozmiaru okna
      window.addEventListener('resize', this.resizeListener);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private checkIfMobile(): void {
    // Uznajemy, że urządzenie mobilne ma szerokość mniejszą niż 768px
    this.isMobile = window.innerWidth < 768;
  }
}
