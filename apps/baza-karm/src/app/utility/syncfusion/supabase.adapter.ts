import { FetchOption, CustomDataAdaptor } from '@syncfusion/ej2-data';

import { SupabaseService } from '../../services/supabase.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomSupabaseAdaptor extends CustomDataAdaptor {
  constructor(private supabaseService: SupabaseService) {
    super();
  }

  handleSupabaseRequest = async (operation: any, option: any) => {
    try {
      const response = await operation; // operation is a Supabase client call

      if (response.error) {
        throw response.error;
      }

      // Assuming the operation is a 'select' for this example
      option.onSuccess({ result: response.data, count: response.data.length });
    } catch (error) {
      console.error('Supabase error:', error);
      option.onFailure(); // Pass relevant error information if needed
    }
  };

  // Example usage for a 'getData' operation
  getData = (option: FetchOption) => {
    this.handleSupabaseRequest(this.supabaseService.products(), option);
  };
}
