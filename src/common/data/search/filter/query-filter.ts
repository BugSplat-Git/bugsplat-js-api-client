import { QueryFilterCondition } from '../filter-condition/filter-condition';

export class QueryFilter {
  constructor(
    public readonly filterValue: string,
    public readonly filterCondition: QueryFilterCondition,
    public readonly filterDataField: string
  ) {
    Object.freeze(this);
  }
}


