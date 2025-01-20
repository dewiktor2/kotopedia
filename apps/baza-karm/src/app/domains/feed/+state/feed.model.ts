import { categoryValue } from '../models/category.model';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

type help = PostgrestFilterBuilder<any, any, any[], 'v_products', unknown>;

export interface SupabaseFilter {
  category: categoryValue;
  filterName: string;
  filters: (query: help, flagEnable?: boolean) => help;
}

export interface FeedStateModel {
  categoryFilter: categoryValue;
  currentFilter: string;
  recordCount: number;
  searchInProgress: boolean;
  extraFilters: SupabaseFilter[];
  extraFilter: 'disabled' | 'off' | 'on';
}

export const extraFilters: SupabaseFilter[] = [
  {
    category: 'Polecane',
    filterName: 'Pokaż akceptowalne karmy',
    filters: (query: help, canBeAccepted?: boolean) =>
      canBeAccepted
        ? query
        : query
            .is('produkty_pochodzenia_zwierzecego', null)
            .or('categories.is.null,categories.not.ilike.%Niejasny skład%'),
  },
  {
    category: 'Monobiałkowe',
    filterName: 'Pokaż polecane karmy',
    filters: (query: help, recommended?: boolean) =>
      recommended
        ? query
            .gt('fosfor_sucha', 0)
            .lte('fosfor_sucha', 1)
            .gt('tluszcz_w_suchej', 0)
            .lte('tluszcz_w_suchej', 30)
            .gt('wegle_sucha', 0)
            .lte('wegle_sucha', 10)
            .is('produkty_pochodzenia_zwierzecego', null)
            .or('categories.is.null,categories.not.ilike.%Niejasny skład%')
        : query,
  },
  {
    category: 'Chore nerki',
    filterName: 'Pokaż polecane karmy',
    filters: (query: help, recommended?: boolean) =>
      recommended
        ? query
            .gt('wegle_sucha', 0)
            .lte('wegle_sucha', 10)
            .is('produkty_pochodzenia_zwierzecego', null)
            .or('categories.is.null,categories.not.ilike.%Niejasny skład%')
        : query.gt('wegle_sucha', 0).lte('wegle_sucha', 15),
  },
  {
    category: 'Kocięta',
    filterName: 'Pokaż akceptowalne karmy',
    filters: (query: help, canBeAccepted?: boolean) =>
      canBeAccepted
        ? query
        : query
            .is('produkty_pochodzenia_zwierzecego', null)
            .or('categories.is.null,categories.not.ilike.%Niejasny skład%'),
  },
];
