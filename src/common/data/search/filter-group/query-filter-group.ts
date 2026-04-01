import { QueryFilter, FilterOperator } from '@common';

export class QueryFilterGroup<TColumn extends string> {
  constructor(
    public filters: Array<QueryFilter<TColumn>>,
    public filterOperator: FilterOperator = FilterOperator.and,
    public groupOperator: FilterOperator = FilterOperator.and,
    public groupOpenCount: number = 1,
    public groupCloseCount: number = 1
  ) {
    Object.freeze(this);
  }

  static fromApiTableFilter<TColumn extends string>(filter: QueryFilter<TColumn>): QueryFilterGroup<TColumn> {
    return new QueryFilterGroup([filter]);
  }

  static fromColumnValues<TColumn extends string>(
    values: Array<string>,
    columnName: TColumn,
    filterOperator: FilterOperator = FilterOperator.or
  ): QueryFilterGroup<TColumn> {
    return new QueryFilterGroup(values.map(value => new QueryFilter(value, 'EQUAL', columnName)), filterOperator);
  }

  static fromTimeFrame<TColumn extends string>(columnName: TColumn, startDate?: Date, endDate?: Date): QueryFilterGroup<TColumn> {
    const filters: Array<QueryFilter<TColumn>> = [];

    if (startDate) {
      filters.push(new QueryFilter(startDate.toISOString(), 'GREATER_THAN', columnName));
    }

    if (endDate) {
      filters.push(new QueryFilter(endDate.toISOString(), 'LESS_THAN', columnName));
    }

    return new QueryFilterGroup(filters);
  }
}
