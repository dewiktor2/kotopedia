import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  DataStateChangeEventArgs,
  GridModule,
  PageService,
  SortService,
} from '@syncfusion/ej2-angular-grids';
import { Observable } from 'rxjs';
import { FeedsService } from '../../services/feeds.service';
import { CustomSupabaseAdaptor } from '../../utility/syncfusion/supabase.adapter';
import { SetCategoryFilter } from './+state/feed.state';
import { UtcToLocalPipe } from './pipes/utc-local.pipe';
import { SearchInputComponent } from '../../utility/components/search-input.component';

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
  initialPage = { pageSizes: true, pageSize: 20 };
  sortOptions!: Object;
  loadingIndicator = { indicatorType: 'Shimmer' };

  @Input()
  index: number = 1000;

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
  }

  public ngOnInit(): void {
    this.service.execute({ skip: 0, take: 20 });
  }

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.service.execute(state);
  }

  search(searchKey: string) {
    searchKey = searchKey.replace(/\s+/g, ' ').trim();
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
