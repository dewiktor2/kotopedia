import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { FeedCardsComponent } from '../components/mobile/feed-cards.component';
import { FeedComponent } from '../components/desktop/feed.component';

@Component({
  imports: [FeedComponent, FeedCardsComponent],
  selector: 'bk-view-feed',
  encapsulation: ViewEncapsulation.None,
  template: ` @if (!isMobile) {
      <bk-feed />
    } @else {
      <bk-feed-cards />
    }`,
})
export class FeedViewComponent implements OnInit, OnDestroy {
  readonly #platformId = inject(PLATFORM_ID);
  isMobile = false;
  #resizeListener: () => void;

  constructor() {
    // Przechowujemy referencję do listenera, aby później móc go usunąć
    this.#resizeListener = () => this.checkIfMobile();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.#platformId)) {
      this.checkIfMobile();
      window.addEventListener('resize', this.#resizeListener);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.#platformId)) {
      window.removeEventListener('resize', this.#resizeListener);
    }
  }

  private checkIfMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }
}
