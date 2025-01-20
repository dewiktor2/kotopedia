import { category } from '../models/category.model';

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
