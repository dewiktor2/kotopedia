import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  DataStateChangeEventArgs,
  GridComponent,
  GridModule,
  PageService,
  SortService,
} from '@syncfusion/ej2-angular-grids';
import { Observable, of } from 'rxjs';
import { FeedsService } from '../../services/feeds.service';
import { SearchInputComponent } from '../../utility/components/search-input.component';
import { DismissableTooltipComponent } from '../../utility/components/tooltip/dismissable-tooltip.component';
import { FeedsState } from './+state/feed.state';
import { categories, category } from './models/category.model';
import { UtcToLocalPipe } from './pipes/utc-local.pipe';
import {
  SetCategoryFilter,
  SetCurrentFilter,
  ChangeExtraFilter,
} from './+state/feed.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [
    GridModule,
    AsyncPipe,
    UtcToLocalPipe,
    SearchInputComponent,
    DismissableTooltipComponent,
  ],
  providers: [SortService, PageService],
  selector: 'bk-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FeedComponent implements OnInit {
  @Input()
  index = 1000;

  gridData$!: Observable<DataStateChangeEventArgs>;
  initialPage: object = { pageSize: 20 };
  sortOptions!: object;
  loadingIndicator = { indicatorType: 'Shimmer' };
  recordNumber$ = of(0);
  filter$: Observable<string> = of('disabled');
  filterName = signal('');

  @ViewChild('GridComponent')
  grid!: GridComponent;
  @ViewChild('tooltip')
  tooltip!: DismissableTooltipComponent;
  @ViewChild('problemTooltip')
  problemTooltip!: DismissableTooltipComponent;

  readonly #store = inject(Store);
  readonly #service = inject(FeedsService);
  readonly #route = inject(ActivatedRoute);

  constructor() {
    // Accessing the route data
    this.accessingRouteData();
    this.initGrid();
  }

  private accessingRouteData() {
    this.#route.data.pipe(takeUntilDestroyed()).subscribe((data) => {
      this.#store.dispatch(new SetCurrentFilter({ currentFilter: '' }));
      this.#store.dispatch(
        new SetCategoryFilter({ categoryFitler: data['type'] })
      );
      const type = data['type'] as category;
      const extraFilters = this.#store.selectSnapshot(FeedsState.extraFilters);
      this.filterName.set(
        extraFilters.find((x) => x.category === categories[type])?.filterName ??
          ''
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

  public showProblemModal(data: any) {
    if (!data) {
      return;
    }
    alert(
      `Prześlij napotkany błąd na adres mailowy pomoc@kotopedia.pl z dodatkowymi informacjami o karmie: kod: ${data.id}, firma: ${data.brand_name}`
    );
  }
}
