import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { FeedStateModel } from './feed.model';
import { SupabaseService } from '../../../services/supabase.service';

export class SetCategoryFilter {
  static readonly type = '[Feed] SetCategoryFilter';
  constructor(public readonly payload: { categoryFitler: string }) {}
}

@State<FeedStateModel>({
  name: 'feed',
  defaults: {
    categoryFilter: 'wszystkie',
  },
})
@Injectable()
export class FeedsState {
  private readonly supabase = inject(SupabaseService);

  @Selector() static categoryFilter(state: FeedStateModel) {
    return state.categoryFilter;
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
}
