import { AsyncPipe } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  DataStateChangeEventArgs,
  Filter,
  FilterService,
  FilterSettingsModel,
  Grid,
  GridComponent,
  GridModule,
  PageService,
  SortService,
} from '@syncfusion/ej2-angular-grids';
import { Observable, of } from 'rxjs';
import {
  ChangeExtraFilter,
  SetCategoryFilter,
  SetCurrentFilter,
} from '../../+state/feed.actions';
import { FeedsState } from '../../+state/feed.state';
import { FeedsService } from '../../../../services/feeds.service';
import { links } from '../../../../utility/components/menu/links';
import { SearchInputComponent } from '../../../../utility/components/search-input.component';
import { DismissableTooltipComponent } from '../../../../utility/components/tooltip/dismissable-tooltip.component';
import { UtcToLocalPipe } from '../../../../utility/pipes/utc-local.pipe';
import { showProblemModal } from '../../functions/show-problem-modal';
import { categories, category } from '../../models/category.model';

Grid.Inject(Filter);

@Component({
  imports: [
    GridModule,
    AsyncPipe,
    UtcToLocalPipe,
    SearchInputComponent,
    DismissableTooltipComponent,
    RouterLink,
  ],
  providers: [SortService, FilterService, PageService],
  selector: 'bk-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FeedComponent implements OnInit {
  gridData$!: Observable<DataStateChangeEventArgs>;
  initialPage: object = { pageSize: 20 };
  sortOptions!: object;
  loadingIndicator = { indicatorType: 'Shimmer' };
  recordNumber$ = of(0);
  filter$: Observable<string> = of('disabled');
  filterName = signal('');
  filterSettings: FilterSettingsModel = { mode: 'OnEnter' };
  router = inject(Router);
  links = links;

  grid = viewChild<GridComponent>('GridComponent');
  tooltip = viewChild<DismissableTooltipComponent>('tooltip');
  problemTooltip = viewChild<DismissableTooltipComponent>('problemTooltip');

  readonly #store = inject(Store);
  readonly #service = inject(FeedsService);
  readonly #route = inject(ActivatedRoute);

  showProblem = (data: { id: string | number; brand_name: string }) =>
    showProblemModal(data);

  constructor() {
    // Accessing the route data
    this.accessingRouteData();
    this.initGrid();
  }

  private accessingRouteData() {
    this.#route.data.pipe(takeUntilDestroyed()).subscribe((data) => {
      this.#store.dispatch(new SetCurrentFilter({ currentFilter: '' }));
      this.#store.dispatch(
        new SetCategoryFilter({ categoryFitler: data['type'] }),
      );
      const type = data['type'] as category;
      const extraFilters = this.#store.selectSnapshot(FeedsState.extraFilters);
      this.filterName.set(
        extraFilters.find((x) => x.category === categories[type])?.filterName ??
          '',
      );
    });
  }

  private initGrid() {
    this.gridData$ = this.#service;
    this.sortOptions = {
      columns: [{ field: 'brand_name', direction: 'Descending' }],
    };
    this.recordNumber$ = this.#store.select(FeedsState.recordCount);
  }

  public ngOnInit(): void {
    this.#service.execute({ skip: 0, take: 20 });
    this.filter$ = this.#store.select(FeedsState.extraFilter);
  }

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.#service.execute(state);
  }

  changeCheckboxState() {
    this.#store.dispatch(new ChangeExtraFilter());
    this.#service.execute({ skip: 0, take: 20 });
  }

  search(searchKey: string) {
    searchKey = searchKey.replace(/\s+/g, ' ').trim();
    this.#store.dispatch(new SetCurrentFilter({ currentFilter: searchKey }));
    this.#service.execute({
      search: [
        {
          fields: ['all'],
          operator: 'contains',
          key: searchKey,
        },
      ],
    } as DataStateChangeEventArgs);
  }
}
