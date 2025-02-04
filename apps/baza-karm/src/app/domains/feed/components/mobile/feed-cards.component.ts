import { AsyncPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import {
  ChangeExtraFilter,
  SetCategoryFilter,
  SetCurrentFilter,
} from '../../+state/feed.actions';
import { FeedsState } from '../../+state/feed.state';
import { FeedsService } from '../../../../services/feeds.service';
import { SearchInputComponent } from '../../../../utility/components/search-input.component';
import { DismissableTooltipComponent } from '../../../../utility/components/tooltip/dismissable-tooltip.component';
import { categories, category } from '../../models/category.model';

@Component({
  selector: 'bk-feed-cards',
  templateUrl: './feed-cards.component.html',
  imports: [
    SearchInputComponent,
    AsyncPipe,
    DismissableTooltipComponent
  ],
})
export class FeedCardsComponent implements OnInit {
  feedCards = signal<any[]>([]);
  currentPage = signal<number>(1);
  totalCount = signal<number>(0);
  totalPages = signal<number>(1);
  loading = signal<boolean>(false);
  filterName = signal<string>('');
  sortOption = signal<{
    field: string;
    order: 'ascending' | 'descending';
    finalOrder: 'ascending' | 'descending';
  }>({
    field: 'brand_name',
    order: 'ascending',
    finalOrder: 'ascending',
  });
  sortDialogOpen = signal<boolean>(false);
  cardsContainer = viewChild<ElementRef<HTMLElement>>('cardsContainer');

  readonly pageSize = 10;
  filter$!: Observable<string>;

  readonly store = inject(Store);
  readonly service = inject(FeedsService);
  readonly route = inject(ActivatedRoute);

  constructor() {
    this.filter$ = this.store.select(FeedsState.extraFilter);
    this.accessRouteData();
  }

  private accessRouteData(): void {
    this.route.data.pipe(takeUntilDestroyed()).subscribe((data) => {
      this.store.dispatch(new SetCurrentFilter({ currentFilter: '' }));
      // Upewnij się, że właściwość (np. "categoryFitler") odpowiada Twojemu API
      this.store.dispatch(
        new SetCategoryFilter({ categoryFitler: data['type'] })
      );
      const type = data['type'] as category;
      const extraFilters = this.store.selectSnapshot(FeedsState.extraFilters);
      this.filterName.set(
        extraFilters.find((x) => x.category === categories[type])?.filterName ??
          ''
      );
    });
  }

  ngOnInit(): void {
    this.loadPage(1);
  }

  private loadPage(page: number): void {
    this.loading.set(true);
    this.currentPage.set(page);
    // Execute the service with our paging parameters and current sort option
    this.service.execute({
      action: {
        requestType: 'paging',
        currentPage: page.toString(),
        pageSize: this.pageSize,
      } as any,
      sorted: [
        { name: this.sortOption().field, direction: this.sortOption().order },
      ],
    });
    this.service.pipe(map((data: any) => data)).subscribe((response) => {
      console.log(`Data for page ${page} received:`, response.result);
      this.feedCards.set(response.result);
      this.totalCount.set(response.count);
      this.totalPages.set(Math.ceil(response.count / this.pageSize));
      this.loading.set(false);
      // Scroll to top after new page is loaded
      this.scrollToTop();
    });
  }

  public nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.loadPage(this.currentPage() + 1);
    }
  }

  public previousPage(): void {
    if (this.currentPage() > 1) {
      this.loadPage(this.currentPage() - 1);
    }
  }

  private scrollToTop(): void {
    if (this.cardsContainer && this.cardsContainer()?.nativeElement) {
      this.cardsContainer()?.nativeElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Sorting dialog functions
  public openSortDialog(): void {
    this.sortDialogOpen.set(true);
  }

  public closeSortDialog(): void {
    this.sortDialogOpen.set(false);
  }

  public onSortFieldChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortOption.update((current) => ({ ...current, field: select.value }));
  }

  public onSortOrderChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortOption.update((current) => ({
      ...current,
      order: select.value as 'ascending' | 'descending',
    }));
  }

  public applySort(): void {
    this.closeSortDialog();
    this.sortOption.update((current) => ({
      ...current,
      finalOrder: current.order,
    }));
    // Reload page 1 with new sort option
    this.loadPage(1);
  }

  public search(searchKey: string): void {
    searchKey = searchKey.replace(/\s+/g, ' ').trim();
    this.store.dispatch(new SetCurrentFilter({ currentFilter: searchKey }));
    this.service.execute({
      search: [
        {
          fields: ['all'],
          operator: 'contains',
          key: searchKey,
        },
      ],
    } as any);
  }

  public changeCheckboxState(): void {
    this.store.dispatch(new ChangeExtraFilter());
    this.loadPage(1);
  }
}
