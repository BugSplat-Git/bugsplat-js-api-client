import { QueryFilterCondition } from '../filter-condition/filter-condition';

export class QueryFilter<TColumn extends string> {
  constructor(
    public readonly filterValue: string | number | Array<string | number>,
    public readonly filterCondition: QueryFilterCondition,
    public readonly filterDataField: TColumn
  ) {
    Object.freeze(this);
  }
}
