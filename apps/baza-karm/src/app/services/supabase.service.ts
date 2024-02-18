import { Injectable } from '@angular/core';
import {
  AuthSession,
  SupabaseClient,
  SupabaseClientOptions,
  createClient,
} from '@supabase/supabase-js';
import { environment } from '../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  #supabase!: SupabaseClient;
  _session: AuthSession | null = null;

  constructor() {
    // console.log(environment.supabaseKey);
    // console.log(environment.supabaseUrl);
  }

  init() {
    const options = {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    } as SupabaseClientOptions<any>;

    try {
      // ANON_KEY and ANON_URL are string constants from your project
      this.#supabase = createClient(
        environment.supabaseUrl,
        environment.supabaseKey,
        {
          auth: { persistSession: false, autoRefreshToken: false },
        }
      );
    } catch (ex) {
      console.log(ex);
    }
  }

  get session() {
    this.#supabase.auth.getSession().then(({ data }: any) => {
      this._session = data.session;
    });
    return this._session;
  }

  products() {
    return this.#supabase
      .from('Products')
      .select(`*`)
      .then((data: any) => {
        console.log(data);
      });
  }
}
