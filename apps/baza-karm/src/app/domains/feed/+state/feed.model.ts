import { categoryValue } from '../models/category.model';

// type help = PostgrestFilterBuilder<any, any, any[], 'v_products', unknown>;

export interface SupabaseFilter {
  category: categoryValue;
  filterName: string;
  filters: (query: any, flagEnable?: boolean) => any;
}

export interface FeedStateModel {
  categoryFilter: categoryValue;
  currentFilter: string;
  recordCount: number;
  searchInProgress: boolean;
  extraFilters: SupabaseFilter[];
  extraFilter: 'disabled' | 'off' | 'on';
}

const acceptableFeedsFilterName = $localize`:@@feed.filter.showAcceptable:Pokaż akceptowalne karmy`;
const recommendedFeedsFilterName = $localize`:@@feed.filter.showRecommended:Pokaż polecane karmy`;

export const extraFilters: SupabaseFilter[] = [
  {
    category: 'Polecane',
    filterName: acceptableFeedsFilterName,
    filters: (query: any, canBeAccepted?: boolean) =>
      canBeAccepted
        ? query
        : query
            .is('produkty_pochodzenia_zwierzecego', null)
            .or('categories.is.null,categories.not.ilike.%Niejasny skład%'),
  },
  {
    category: 'Monobiałkowe',
    filterName: recommendedFeedsFilterName,
    filters: (query: any, recommended?: boolean) =>
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
    filterName: recommendedFeedsFilterName,
    filters: (query: any, recommended?: boolean) =>
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
    filterName: acceptableFeedsFilterName,
    filters: (query: any, canBeAccepted?: boolean) =>
      canBeAccepted
        ? query
        : query
            .is('produkty_pochodzenia_zwierzecego', null)
            .or('categories.is.null,categories.not.ilike.%Niejasny skład%'),
  },
];
