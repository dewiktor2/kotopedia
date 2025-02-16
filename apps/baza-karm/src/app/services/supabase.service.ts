import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  AuthSession,
  AuthTokenResponsePassword,
  SignInWithPasswordCredentials,
  SupabaseClient,
  createClient,
} from '@supabase/supabase-js';
import { Observable, from, tap } from 'rxjs';
import { environment } from '../../env/environment';
import { FeedsState } from '../domains/feed/+state/feed.state';
import { categoryValue } from '../domains/feed/models/category.model';
import {
  ProductQueryFetch,
  defaultQueryFetchValue,
} from '../utility/syncfusion/query.model';

const globalSupabase = createClient(
  environment.supabaseUrl,
  environment.supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken:true,
      storageKey: 'supabase-key'
    },
  },
);

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  #supabase: SupabaseClient = globalSupabase;
  _session: AuthSession | null = null;
  readonly #store = inject(Store);

  constructor() {
    this.restoreSession();
  }

  private async restoreSession() {
    this.#supabase.auth.getSession().then(({ data }: any) => {
      this._session = data.session;
    });
  }

  get logged() {
    return this._session?.user?.id;
  }

  get session() {
    this.#supabase.auth.getSession().then(({ data }: any) => {
      this._session = data.session;
    });
    return this._session;
  }

  login(
    creditionals: SignInWithPasswordCredentials,
  ): Observable<AuthTokenResponsePassword | null> {
    return from(this.#supabase.auth.signInWithPassword(creditionals)).pipe(
      tap((data: AuthTokenResponsePassword) => {
        if(data.error) {
          throw new Error(`${data.error}`);
        }
        this._session = data.data.session;
      }),
    );
  }

  /**
   * Pobiera dane produktów z widoku 'v_products' przy uwzględnieniu
   * opcji filtrowania, wyszukiwania, sortowania i paginacji.
   *
   * @param options - Parametry zapytania, domyślnie ustawione dla kolumny 'brand_name'
   */
  async productsV2(
    options: ProductQueryFetch = defaultQueryFetchValue('brand_name'),
  ) {
    // Inicjujemy zapytanie
    let query = this.#supabase.from('v_products').select();

    // Filtrowanie po kategorii
    if (options.categoryFilter) {
      query = this.filterQueryByCategory(query, options.categoryFilter);
    }

    // Filtrowanie po wyszukiwarce (np. fraza wpisana przez użytkownika)
    if (options.search && options.search.key) {
      query = query.ilike('name_brand_name', `%${options.search.key}%`);
    }

    // Przygotowanie zapytania pobierającego liczbę rekordów (count)
    const countQuery = () => {
      let queryCount = this.#supabase
        .from('v_products')
        .select('*', { count: 'exact', head: true });
      if (options.categoryFilter) {
        queryCount = this.filterQueryByCategory(
          queryCount,
          options.categoryFilter,
        );
      }
      if (options.search && options.search.key) {
        queryCount = queryCount.ilike(
          'name_brand_name',
          `%${options.search.key}%`,
        );
      }
      return queryCount;
    };

    const recordNumbers = await countQuery();

    // Sortowanie – jeśli przekazano odpowiednią kolumnę, dodajemy tie-breaker po 'id'
    const sortOrder = options.order;
    if (sortOrder && sortOrder.name) {
      query = query.order(sortOrder.name, { ascending: sortOrder.ascending });
      query = query.order('id', { ascending: true });
    }

    // Paginacja – jawne sprawdzenie, czy mamy liczby (0 również jest poprawną wartością)
    if (
      typeof options.startIndex === 'number' &&
      typeof options.endIndex === 'number'
    ) {
      query = query.range(options.startIndex, options.endIndex);
    } else {
      query = query.range(0, 20);
    }

    const { data, error } = await query;
    return { data, error, recordNumbers };
  }

  /**
   * Rozszerza zapytanie o dodatkowe filtry w zależności od przekazanej kategorii.
   *
   * @param query - Obiekt zapytania do Supabase
   * @param categoryFilter - Wybrana kategoria filtracji
   * @returns Zaktualizowany obiekt zapytania
   */
  filterQueryByCategory(query: any, categoryFilter: categoryValue): any {
    // Pobieramy dodatkowe filtry zapisane w stanie
    const extraFilters = this.#store
      .selectSnapshot(FeedsState.extraFilters)
      .find((x) => x.category === categoryFilter);

    if (categoryFilter === 'Polecane') {
      query = query
        .gt('fosfor_sucha', 0)
        .lte('fosfor_sucha', 1)
        .gt('tluszcz_w_suchej', 0)
        .lte('tluszcz_w_suchej', 30)
        .gt('wegle_sucha', 0)
        .lte('wegle_sucha', 10);
    }
    if (categoryFilter === 'Monobiałkowe') {
      query = query.not('flavors', 'like', '%,%').not('flavors', 'is', null);
    }
    if (categoryFilter === 'Chore nerki') {
      query = query
        .gt('fosfor_sucha', 0)
        .lte('fosfor_sucha', 1)
        .not('fosfor_sucha', 'is', null)
        .gt('tluszcz_w_suchej', 0)
        .lte('tluszcz_w_suchej', 30);
    }
    if (categoryFilter === 'Kocięta') {
      query = query
        .gt('bialko_sucha', 40)
        .gt('fosfor_sucha', 0)
        .gte('fosfor_sucha', 0.84)
        .gt('wegle_sucha', 0)
        .lte('wegle_sucha', 10);
    }
    if (categoryFilter === 'Chora trzustka') {
      query = query
        .gt('fosfor_sucha', 0)
        .lte('fosfor_sucha', 1)
        .gt('tluszcz_w_suchej', 0)
        .lte('tluszcz_w_suchej', 25)
        .gt('wegle_sucha', 0)
        .lte('wegle_sucha', 5)
        .is('produkty_pochodzenia_zwierzecego', null);
    }

    // Jeżeli dostępne są dodatkowe filtry, aplikujemy je (np. włączone/wyłączone)
    if (extraFilters) {
      const extraFilter = this.#store.selectSnapshot(FeedsState.extraFilter);
      query = extraFilters.filters(query, extraFilter === 'on');
    }

    return query;
  }
}
