import { FetchOption, CustomDataAdaptor } from '@syncfusion/ej2-data';

import { SupabaseService } from '../../services/supabase.service';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomSupabaseAdaptor extends CustomDataAdaptor {
  readonly #supabaseService = inject(SupabaseService);

  constructor() {
    super();
  }

  handleSupabaseRequest = async (operation: any, option: any) => {
    try {
      const response = await operation;
      if (response.error) {
        throw response.error;
      }

      // Assuming the operation is a 'select' for this example
      option.onSuccess({ result: response.data, count: response.data.length });
    } catch (error) {
      console.error('Supabase error:', error);
      option.onFailure();
    }
  };

  getData = (option: FetchOption) => {
    this.handleSupabaseRequest(this.#supabaseService.productsV2(), option);
  };
}
