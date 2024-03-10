import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { FeedStateModel } from './feed.model';
import { SupabaseService } from '../../../services/supabase.service';

export class SetCategoryFilter {
  static readonly type = '[Feed] SetCategoryFilter';
  constructor(public readonly payload: { categoryFitler: string }) {}
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

@State<FeedStateModel>({
  name: 'feed',
  defaults: {
    recordCount: 0,
    currentFilter: '',
    categoryFilter: 'wszystkie',
    searchInProgress: false,
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

  @Action(SetCategoryFilter)
  async setCategoryFilter(
    ctx: StateContext<FeedStateModel>,
    action: SetCategoryFilter
  ) {
    const dwa: Record<string, string | undefined> = {
      ['wszystkie']: undefined,
      ['polecane']: 'Polecane',
      ['monobialkowe']: 'Monobiałkowe',
      ['koty-chore']: 'Koty chore',
      ['smaczki']: 'Smaczki',
    };
    ctx.patchState({
      categoryFilter: dwa[action.payload.categoryFitler],
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
