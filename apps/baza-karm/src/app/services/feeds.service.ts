import { DestroyRef, Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataStateChangeEventArgs, Sorts } from '@syncfusion/ej2-angular-grids';
import { Observable, Subject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { SetSearchInProgress, SetRecordCount } from '../domains/feed/+state/feed.actions';
import { FeedsState } from '../domains/feed/+state/feed.state';
import { defaultQueryFetchValue, ProductQueryFetch, QueryFetch } from '../utility/syncfusion/query.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class FeedsService extends Subject<DataStateChangeEventArgs> {
  readonly #store = inject(Store);
  readonly #client = inject(SupabaseService);
  destroyRef = inject(DestroyRef);

  constructor() {
    super();
  }

  /**
   * Uruchamia pobieranie danych na podstawie przekazanego stanu siatki.
   * Wynik (obiekt DataStateChangeEventArgs) jest emitowany do subskrybentów.
   *
   * @param state - Stan zmiany danych z gridu (m.in. sortowanie, paginacja, wyszukiwanie)
   */
  public execute(state: DataStateChangeEventArgs): void {
    this.getData(state)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((dataState: DataStateChangeEventArgs) => super.next(dataState));
  }

  /**
   * Przygotowuje zapytanie o dane na podstawie stanu gridu.
   *
   * @param state - Obiekt DataStateChangeEventArgs zawierający m.in. sortowanie, wyszukiwanie i paginację.
   * @returns Observable emitujący wynik zapytania w postaci DataStateChangeEventArgs.
   */
  protected getData(state: DataStateChangeEventArgs): Observable<DataStateChangeEventArgs> {
    // Inicjujemy zapytanie z domyślnym sortowaniem po 'brand_name'
    const query = defaultQueryFetchValue('brand_name') as ProductQueryFetch;

    // Obsługa sortowania – jeśli użytkownik wybrał sortowanie, nadpisujemy domyślne ustawienie
    if (state && state.sorted && state.sorted.length) {
      const sort = state.sorted[0] as Sorts;
      query.order = {
        name: sort.name as string,
        ascending: sort.direction === 'ascending',
      };
    }

    // Pobieramy aktualny filtr z NGXS (jeśli użytkownik coś wpisał)
    const currentFilter = this.#store.selectSnapshot(FeedsState.currentFilter);
    if ((state && state.search?.length && state.search[0].key) || currentFilter) {
      query.search = state.search?.[0] ?? {
        key: currentFilter,
        fields: ['all'],
        operator: 'contains',
      };
    }

    // Pobieramy wybraną kategorię z NGXS
    query.categoryFilter = this.#store.selectSnapshot(FeedsState.categoryFilter);

    // Obsługa paginacji – jeśli akcja wskazuje na zmianę strony
    if (state.action?.requestType === 'paging') {
      const action = state.action as any;
      query.startIndex = (action.currentPage - 1) * action.pageSize;
      query.endIndex = action.currentPage * action.pageSize - 1;
    }

    // Ustawiamy flagę, że wyszukiwanie jest w toku
    this.#store.dispatch(new SetSearchInProgress({ searchInProgress: true }));

    return this.fetchData(query).pipe(
      map((response: any) => {
        const result = response.data;
        const count = response.count;
        // Aktualizujemy stan liczby rekordów
        this.#store.dispatch(new SetRecordCount({ count }));
        return { result, count } as DataStateChangeEventArgs;
      }),
      finalize(() => {
        // Po zakończeniu wyszukiwania wyłączamy wskaźnik wyszukiwania
        this.#store.dispatch(new SetSearchInProgress({ searchInProgress: false }));
      })
    );
  }

  /**
   * Wykonuje zapytanie do Supabase poprzez metodę productsV2 z SupabaseService.
   *
   * @param query - Obiekt zawierający parametry zapytania (filtry, paginacja, sortowanie, wyszukiwanie)
   * @returns Observable z wynikiem zapytania, zawierającym dane i liczbę rekordów.
   */
  private fetchData(query: QueryFetch): Observable<any> {
    return new Observable((observer) => {
      this.#client
        .productsV2(query)
        .then((result: any) => {
          if (result.error) {
            return { data: [], count: 0 };
          }
          return { data: result.data, count: result?.recordNumbers?.count ?? 0 };
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
