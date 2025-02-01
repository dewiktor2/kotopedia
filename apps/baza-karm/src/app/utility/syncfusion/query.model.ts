import { SearchSettingsModel } from "@syncfusion/ej2-angular-grids";
import { categoryValue } from "../../domains/feed/models/category.model";

export interface QueryFetch {
  startIndex: number;
  endIndex: number;
  take: number;
  order: { name: string; ascending?: boolean, data?: { referencedTable: string, ascending: false } };
}

export const defaultQueryFetchValue = (orderColumn = 'brand_name') => {
  return {
    startIndex: 0,
    endIndex: 20,
    // Jeśli nie przekażesz nazwy kolumny, użyjemy 'brand_name' jako domyślnej
    order: { name: orderColumn || 'brand_name', ascending: false, data: {} },
  } as ProductQueryFetch;
};

export interface ProductQueryFetch extends QueryFetch {
  startIndex: number;
  endIndex: number;
  take: number;
  search?: SearchSettingsModel;
  categoryFilter?: categoryValue;
  order: { name: string; ascending?: boolean, data?: { referencedTable: string, ascending: false } };
}