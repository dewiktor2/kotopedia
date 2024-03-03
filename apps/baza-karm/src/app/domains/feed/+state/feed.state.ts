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

@State<FeedStateModel>({
  name: 'feed',
  defaults: {
    recordCount: 0,
    categoryFilter: 'wszystkie',
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
      recordCount: action.payload.count
    });
  }
}
