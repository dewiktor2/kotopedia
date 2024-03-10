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
      query.eq('categories', options.categoryFilter);
    }

    if ((options.search && options.search.key)) {
      query.ilike('name_brand_name', `%${options.search.key}%`);
    }

    const count = () => {
      let queryCount = this.#supabase
        .from('v_products')
        .select(`*`, { count: 'exact', head: true });
      if (options.categoryFilter) {
        queryCount.eq('categories', options.categoryFilter);
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

  // async products(options: ProductQueryFetch = defaultQueryFetchValue('nazwa')) {
  //   const categoriesFilter = options.categoryFilter
  //     ? `Categories!inner (
  //     nazwa
  //   )`
  //     : `Categories (
  //     nazwa
  //   )`;

  //   const dwa = await this.#supabase.from('v_products').select();

  //   let query = this.#supabase.from('Products').select(`
  //       *, 
  //       Brands!products_firma_id_fkey(nazwa), 
  //       Flavors (
  //         smak
  //       ),
  //       ${categoriesFilter}
  //     `);

  //   const sortOrder = options.order;

  //   // Conditionally add ordering to the query
  //   if (sortOrder?.name) {
  //     if (sortOrder?.name === 'Brands.nazwa') {
  //       query = query.order('nazwa', {
  //         referencedTable: 'Brands!products_firma_id_fkey(nazwa)',
  //         ascending: sortOrder.ascending,
  //       });
  //     } else {
  //       query = query.order(sortOrder.name, {
  //         ascending: sortOrder?.ascending,
  //       });
  //     }
  //   }

  //   // Conditionally add limit to the query
  //   if (options.startIndex) {
  //     query = query.range(options?.startIndex, options.endIndex);
  //   } else {
  //     query = query.range(0, 20);
  //   }

  //   if (options.categoryFilter) {
  //     query.eq('Categories.nazwa', options.categoryFilter);
  //   }

  //   // Execute the query
  //   const { data, error } = await query;

  //   const count = () => {
  //     let queryCount = this.#supabase.from('Products').select(
  //       `
  //       *, 
  //       Brands!products_firma_id_fkey(nazwa), 
  //       Flavors (
  //         smak
  //       ),
  //       ${categoriesFilter}
  //     `,
  //       { count: 'exact', head: true }
  //     );
  //     if (options.categoryFilter) {
  //       queryCount.eq('Categories.nazwa', options.categoryFilter);
  //     }
  //     return queryCount;
  //   };

  //   const recordNumbers = await count();

  //   return { data, error, recordNumbers };
  // }
}
