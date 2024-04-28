import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SupabaseService } from '../../../services/supabase.service';
import { categories, category, categoryValue } from '../models/category.model';
import { FeedStateModel, extraFilters } from './feed.model';

export class SetCategoryFilter {
  static readonly type = '[Feed] SetCategoryFilter';
  constructor(public readonly payload: { categoryFitler: category }) {}
}

export class SetRecordCount {
  static readonly type = '[Feed] SetRecordCount';
  constructor(public readonly payload: { count: number }) {}
}

export class SetCurrentFilter {
  static readonly type = '[Feed] SetCurrentFilter';
  constructor(public readonly payload: { currentFilter: string }) {}
}

export class SetSearchInProgress {
  static readonly type = '[Feed] SetSearchInProgress';
  constructor(public readonly payload: { searchInProgress: boolean }) {}
}

export class ChangeExtraFilter {
  static readonly type = '[Feed] ChangeExtraFilter';
}

@State<FeedStateModel>({
  name: 'feed',
  defaults: {
    recordCount: 0,
    currentFilter: '',
    categoryFilter: 'wszystkie',
    searchInProgress: false,
    extraFilters: extraFilters,
    extraFilter: 'disabled',
  },
})
@Injectable()
export class FeedsState {
  private readonly supabase = inject(SupabaseService);

  @Selector() static categoryFilter(state: FeedStateModel) {
    return state.categoryFilter;
  }

  @Selector() static recordCount(state: FeedStateModel) {
    return state.recordCount;
  }

  @Selector() static currentFilter(state: FeedStateModel) {
    return state.currentFilter;
  }

  @Selector() static searchInProgress(state: FeedStateModel) {
    return state.searchInProgress;
  }

  @Selector() static extraFilters(state: FeedStateModel) {
    return state.extraFilters;
  }

  @Selector() static extraFilter(state: FeedStateModel) {
    return state.extraFilter;
  }

  @Action(SetCategoryFilter)
  async setCategoryFilter(
    ctx: StateContext<FeedStateModel>,
    action: SetCategoryFilter
  ) {
    const value = categories[action.payload.categoryFitler];

    const modulesWithExtraFilters: categoryValue[] = [
      'Kocięta',
      'Chore nerki',
      'Monobiałkowe',
      'Polecane',
    ];
    ctx.patchState({
      categoryFilter: value,
      extraFilter: modulesWithExtraFilters.includes(value as categoryValue)
        ? 'off'
        : 'disabled',
    });
  }

  @Action(SetRecordCount)
  async setRecordCount(
    ctx: StateContext<FeedStateModel>,
    action: SetRecordCount
  ) {
    ctx.patchState({
      recordCount: action.payload.count,
    });
  }

  @Action(SetCurrentFilter)
  async setCurrentFilter(
    ctx: StateContext<FeedStateModel>,
    action: SetCurrentFilter
  ) {
    ctx.patchState({
      currentFilter: action.payload.currentFilter,
    });
  }

  @Action(ChangeExtraFilter)
  async extraFilter(ctx: StateContext<FeedStateModel>) {
    let filter = ctx.getState().extraFilter;

    if (filter === 'on') {
      filter = 'off';
    } else {
      filter = 'on';
    }
    ctx.patchState({
      extraFilter: filter,
    });
  }

  @Action(SetSearchInProgress)
  async setSearchInProgress(
    ctx: StateContext<FeedStateModel>,
    action: SetSearchInProgress
  ) {
    ctx.patchState({
      searchInProgress: action.payload.searchInProgress,
    });
  }
}
