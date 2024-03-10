import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataStateChangeEventArgs, Sorts } from '@syncfusion/ej2-angular-grids';
import { Observable, Subject, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import {
  FeedsState,
  SetRecordCount,
  SetSearchInProgress,
} from '../domains/feed/+state/feed.state';
import {
  ProductQueryFetch,
  QueryFetch,
  defaultQueryFetchValue,
} from '../utility/syncfusion';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class FeedsService extends Subject<DataStateChangeEventArgs> {
  private store = inject(Store);

  private readonly client = inject(SupabaseService);

  constructor() {
    super();
  }

  public execute(state: any): void {
    this.getData(state).subscribe((x) => super.next(x));
  }

  protected getData(
    state: DataStateChangeEventArgs
  ): Observable<DataStateChangeEventArgs> {
    // const pageQuery = `$skip=${state.skip}&$top=${state.take}`;
    // let sortQuery: string = '';
    const query = defaultQueryFetchValue('') as ProductQueryFetch;

    if (state && (state.sorted || []).length) {
      const sort = (state?.sorted as Sorts[])[0];

      query.order = {
        name: sort.name as string,
        ascending: sort.direction === 'ascending',
      };
    }

    const currentFilter = this.store.selectSnapshot(FeedsState.currentFilter);

    if (
      (state && state?.search?.length && state.search[0].key) ||
      currentFilter
    ) {
      const search = state?.search?.[0] ?? {
        key: currentFilter,
        fields: ['all'],
        operator: 'contains',
      };

      query.search = search;
    }

    const categoryFilter = this.store.selectSnapshot(FeedsState.categoryFilter);

    query.categoryFilter = categoryFilter;

    if (state.action?.requestType === 'paging') {
      const action = state.action as any;
      query.startIndex = (action.currentPage - 1) * action.pageSize;
      query.endIndex = action.currentPage * action.pageSize - 1;
    }

    this.store.dispatch(new SetSearchInProgress({ searchInProgress: true }));

    return this.fetchData(query).pipe(
      map((response: any) => {
        const result = response.data;
        const count = response.count;
        this.store.dispatch(
          new SetRecordCount({
            count,
          })
        );
        return { result, count } as DataStateChangeEventArgs;
      }),
      finalize(() => {
        this.store.dispatch(
          new SetSearchInProgress({ searchInProgress: false })
        );
      })
    );
  }

  private fetchData(query: QueryFetch): Observable<any> {
    return new Observable((observer) => {
      this.client
        .productsV2(query)
        .then((result: any) => {
          if (result.error) {
            return {
              data: [],
              count: 0,
            };
          }
          return {
            data: result.data,
            count: result?.recordNumbers?.count ?? 0,
          };
        })
        .then((data) => {
          observer.next(data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
