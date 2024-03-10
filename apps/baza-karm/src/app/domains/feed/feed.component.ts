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
  FeedsState,
  SetCategoryFilter,
  SetCurrentFilter,
} from './+state/feed.state';
import { UtcToLocalPipe } from './pipes/utc-local.pipe';

@Component({
  standalone: true,
  imports: [GridModule, CommonModule, UtcToLocalPipe, SearchInputComponent],
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

  @Input()
  index: number = 1000;

  recordNumber$ = of(0);

  constructor() {
    // Accessing the route data
    this.route.data.subscribe((data) => {
      this.store.dispatch(
        new SetCategoryFilter({ categoryFitler: data['type'] })
      );
    });
    this.data = this.service;
    this.sortOptions = {
      columns: [{ field: 'brand_name', direction: 'Descending' }],
    };
    this.recordNumber$ = this.store.select(FeedsState.recordCount);
  }

  public ngOnInit(): void {
    this.service.execute({ skip: 0, take: 50 });
  }

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.service.execute(state);
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
