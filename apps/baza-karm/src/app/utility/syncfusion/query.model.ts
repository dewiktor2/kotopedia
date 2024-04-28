import { SearchSettingsModel } from "@syncfusion/ej2-angular-grids";
import { categoryValue } from "../../domains/feed/models/category.model";

export interface QueryFetch {
  startIndex: number;
  endIndex: number;
  take: number;
  order: { name: string; ascending?: boolean, data?: { referencedTable: string, ascending: false } };
}

export const defaultQueryFetchValue = (orderColumn: string) => {
  return {
    startIndex: 0,
    endIndex: 20,
    order: { name: orderColumn, ascending: false, data: {} },
  } as any;
}

export interface ProductQueryFetch extends QueryFetch {
  startIndex: number;
  endIndex: number;
  take: number;
  search?: SearchSettingsModel;
  categoryFilter?: categoryValue;
  order: { name: string; ascending?: boolean, data?: { referencedTable: string, ascending: false } };
}