import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
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
import {
  FeedsState,
} from './+state/feed.state';
import { categories, category } from './models/category.model';
import { UtcToLocalPipe } from './pipes/utc-local.pipe';
import { SetCategoryFilter, SetCurrentFilter, ChangeExtraFilter } from './+state/feed.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
    imports: [
        GridModule,
        CommonModule,
        UtcToLocalPipe,
        SearchInputComponent,
        DismissableTooltipComponent
    ],
    providers: [SortService, PageService],
    selector: 'bk-feed',
    templateUrl: './feed.component.html',
    styleUrl: './feed.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class FeedComponent implements OnInit, OnDestroy {
  @Input()
  index = 1000;

  data!: Observable<DataStateChangeEventArgs>;
  initialPage: object = { pageSize: 20 };
  sortOptions!: object;
  loadingIndicator = { indicatorType: 'Shimmer' };
  recordNumber$ = of(0);
  filter: Observable<string> = of('disabled');
  filterName = '';

  @ViewChild('GridComponent')
  grid!: GridComponent;
  @ViewChild('tooltip')
  tooltip!: DismissableTooltipComponent;
  @ViewChild('problemTooltip')
  problemTooltip!: DismissableTooltipComponent;

  private readonly store = inject(Store);
  private readonly service = inject(FeedsService);
  private readonly route = inject(ActivatedRoute);

  buildPackageFunc = (data: any) => {
    // Utworzenie tablicy z kluczami i wartościami, które spełniają kryteria
    const filteredEntries = Object.entries(data).filter(
      ([key, value]) => key.startsWith('opak_') && value === true
    );

    // Przekształcenie filtrowanych wpisów do postaci tekstowej
    const resultText = filteredEntries
      .map(([key, value]) => `${key}`)
      .join(', ');

    return resultText;
  };

  showProblemModal(data: any) {
    if (!data) {
      return;
    }
    alert(`Prześlij napotkany błąd na adres mailowy pomoc@kotopedia.pl z dodatkowymi informacjami o karmie: kod: ${data.id}, firma: ${data.brand_name}`);
  }

  constructor() {
    // Accessing the route data
    this.route.data.pipe(takeUntilDestroyed()).subscribe((data) => {
      this.store.dispatch(
        new SetCategoryFilter({ categoryFitler: data['type'] })
      );
      const type = data['type'] as category;
      this.filterName =
        this.store
          .selectSnapshot(FeedsState.extraFilters)
          .find((x) => x.category === categories[type])?.filterName ?? '';
    });
    this.data = this.service;
    this.sortOptions = {
      columns: [{ field: 'brand_name', direction: 'Descending' }],
    };
    this.recordNumber$ = this.store.select(FeedsState.recordCount);
  }

  public ngOnInit(): void {
    this.service.execute({ skip: 0, take: 20 });
    this.filter = this.store.select(FeedsState.extraFilter);
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new SetCurrentFilter({ currentFilter: '' }));
  }

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.service.execute(state);
  }

  changeCheckboxState() {
    this.store.dispatch(new ChangeExtraFilter());
    this.service.execute({ skip: 0, take: 20 });
  }

  search(searchKey: string) {
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
    } as DataStateChangeEventArgs);
  }
}
