import { Injectable, inject } from '@angular/core';
import {
  AuthSession,
  SupabaseClient,
  createClient,
} from '@supabase/supabase-js';
import { environment } from '../../env/environment';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { categoryValue } from '../domains/feed/models/category.model';
import { Store } from '@ngxs/store';
import { FeedsState } from '../domains/feed/+state/feed.state';
import { ProductQueryFetch, defaultQueryFetchValue } from '../utility/syncfusion/query.model';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  #supabase!: SupabaseClient;
  _session: AuthSession | null = null;

  private readonly store = inject(Store);

  constructor() {
    this.init();
  }

  private init() {
    this.#supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: { persistSession: false, autoRefreshToken: false },
      }
    );
  }

  get session() {
    this.#supabase.auth.getSession().then(({ data }: any) => {
      this._session = data.session;
    });
    return this._session;
  }

  async productsV2(
    options: ProductQueryFetch = defaultQueryFetchValue('nazwa')
  ) {
    let query = this.#supabase.from('v_products').select();

    if (options.categoryFilter) {
      // query.eq('categories', options.categoryFilter);
      query = this.filterQueryByCategory(query, options.categoryFilter);
    }

    if (options.search && options.search.key) {
      query.ilike('name_brand_name', `%${options.search.key}%`);
    }

    const count = () => {
      let queryCount = this.#supabase
        .from('v_products')
        .select(`*`, { count: 'exact', head: true });
      if (options.categoryFilter) {
        queryCount = this.filterQueryByCategory(
          queryCount,
          options.categoryFilter
        );
      }
      if (options.search && options.search.key) {
        queryCount.ilike('name_brand_name', `%${options.search.key}%`);
      }
      return queryCount;
    };

    const recordNumbers = await count();

    const sortOrder = options.order;

    if (sortOrder?.name) {
      query = query.order(sortOrder.name, {
        ascending: sortOrder?.ascending,
      });
      query = query.order('id', { ascending: true });
    }

    // Conditionally add limit to the query
    if (options.startIndex) {
      query = query.range(options?.startIndex, options.endIndex);
    } else {
      query = query.range(0, 20);
    }

    // Execute the query
    const { data, error } = await query;

    return { data, error, recordNumbers };
  }

  filterQueryByCategory(
    query: PostgrestFilterBuilder<any, any, any[], 'v_products', unknown>,
    categoryFilter: categoryValue
  ): PostgrestFilterBuilder<any, any, any[], 'v_products', unknown> {
    const extraFilters = this.store
      .selectSnapshot(FeedsState.extraFilters)
      .find((x) => x.category === categoryFilter);
    if (categoryFilter === 'Polecane') {
      query = query.gt('fosfor_sucha', 0).lte('fosfor_sucha', 1);
      query = query.gt('tluszcz_w_suchej', 0).lte('tluszcz_w_suchej', 30);
      query = query.gt('wegle_sucha', 0).lte('wegle_sucha', 10);
    }
    if (categoryFilter === 'Monobiałkowe') {
      query = query.not('flavors', 'like', '%,%');
      query = query.not('flavors', 'is', null);
    }
    if (categoryFilter === 'Chore nerki') {
      query = query.gt('fosfor_sucha', 0).lte('fosfor_sucha', 1);
      query = query.not('fosfor_sucha', 'is', null);
      query = query.gt('tluszcz_w_suchej', 0).lte('tluszcz_w_suchej', 30);
    }
    if (categoryFilter === 'Kocięta') {
      query = query.gt('bialko_sucha', 40);
      query = query.gt('fosfor_sucha', 0).gte('fosfor_sucha', 0.84);
      query = query.gt('wegle_sucha', 0).lte('wegle_sucha', 10);
    }
    if (categoryFilter === 'Chora trzustka') {
      query = query.gt('fosfor_sucha', 0).lte('fosfor_sucha', 1);
      query = query.gt('tluszcz_w_suchej', 0).lte('tluszcz_w_suchej', 25);
      query = query.gt('wegle_sucha', 0).lte('wegle_sucha', 5);
      query = query.is('produkty_pochodzenia_zwierzecego', null);
    }

    if (extraFilters) {
      const extraFilter = this.store.selectSnapshot(FeedsState.extraFilter);
      query = extraFilters.filters(query, extraFilter === 'on');
    }

    return query;
  }
}
