import { Injectable } from '@angular/core';
import {
  AuthSession,
  SupabaseClient,
  SupabaseClientOptions,
  createClient,
} from '@supabase/supabase-js';
import { environment } from '../../env/environment';
import {
  ProductQueryFetch,
  defaultQueryFetchValue,
} from '../utility/syncfusion';

import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  #supabase!: SupabaseClient;
  _session: AuthSession | null = null;

  constructor() {
    this.init();
  }

  private init() {
    const options = {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    } as SupabaseClientOptions<any>;

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
      query = query.range(0, 50);
    }

    // Execute the query
    const { data, error } = await query;

    return { data, error, recordNumbers };
  }

  filterQueryByCategory(
    query: PostgrestFilterBuilder<any, any, any[], 'v_products', unknown>,
    categoryFilter: string
  ): PostgrestFilterBuilder<any, any, any[], 'v_products', unknown> {
    if (categoryFilter === 'Polecane') {
      query = query.lt('fosfor_sucha', 1);
      query = query.lt('tluszcz_w_suchej', 30);
      query = query.lt('wegle_sucha', 5);
      query = query.gt('bialko_sucha', 45);
    }
    if (categoryFilter === 'Monobiałkowe') {
      query = query.not('flavors', 'like', '%,%');
      query = query.not('flavors', 'is', null)
    }
    return query;
  }
}
