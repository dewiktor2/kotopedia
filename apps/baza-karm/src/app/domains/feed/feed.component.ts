import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
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
import { CustomSupabaseAdaptor } from '../../utility/syncfusion/supabase.adapter';
import {
  ChangeExtraFilter,
  FeedsState,
  SetCategoryFilter,
  SetCurrentFilter,
} from './+state/feed.state';
import { UtcToLocalPipe } from './pipes/utc-local.pipe';
import { DismissableTooltipComponent } from '../../utility/components/tooltip/dismissable-tooltip.component';
import { FilterDialogComponent } from './filter/filter-dialog.component';
import { categories, category, categoryValue } from './models/category.model';

@Component({
  standalone: true,
  imports: [
    GridModule,
    CommonModule,
    UtcToLocalPipe,
    SearchInputComponent,
    DismissableTooltipComponent,
    FilterDialogComponent,
  ],
  providers: [SortService, PageService],
  selector: 'bk-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FeedComponent implements OnInit {
  store = inject(Store);
  supabaseAdaptor = inject(CustomSupabaseAdaptor);
  service = inject(FeedsService);
  route = inject(ActivatedRoute);

  data!: Observable<DataStateChangeEventArgs>;
  initialPage: object = { pageSize: 50 };
  sortOptions!: Object;
  loadingIndicator = { indicatorType: 'Shimmer' };

  @ViewChild('GridComponent')
  grid!: GridComponent;

  @ViewChild('tooltip')
  tooltip!: DismissableTooltipComponent;

  @Input()
  index: number = 1000;

  recordNumber$ = of(0);

  filter: Observable<string> = of('disabled');
  filterName = '';

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

  constructor() {
    // Accessing the route data
    this.route.data.subscribe((data) => {
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
    this.service.execute({ skip: 0, take: 50 });
    this.filter = this.store.select(FeedsState.extraFilter);
  }

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.service.execute(state);
  }

  changeCheckboxState() {
    this.store.dispatch(new ChangeExtraFilter());
    this.service.execute({ skip: 0, take: 50 });
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
