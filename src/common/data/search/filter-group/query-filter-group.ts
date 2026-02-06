import { QueryFilter, FilterOperator } from '@common';

export class QueryFilterGroup {
  constructor(
    public filters: Array<QueryFilter>,
    public filterOperator: FilterOperator = FilterOperator.and,
    public groupOperator: FilterOperator = FilterOperator.and,
    public groupOpenCount: number = 1,
    public groupCloseCount: number = 1
  ) {
    Object.freeze(this);
  }

  static fromApiTableFilter(filter: QueryFilter): QueryFilterGroup {
    return new QueryFilterGroup([filter]);
  }

  static fromColumnValues(
    values: Array<string>,
    columnName: string,
    filterOperator: FilterOperator = FilterOperator.or
  ): QueryFilterGroup {
    return new QueryFilterGroup(values.map(value => new QueryFilter(value, 'EQUAL', columnName)), filterOperator);
  }

  static fromTimeFrame(columnName: string, startDate?: Date, endDate?: Date): QueryFilterGroup {
    const filters: Array<QueryFilter> = [];

    if (startDate) {
      filters.push(new QueryFilter(startDate.toISOString(), 'GREATER_THAN', columnName));
    }

    if (endDate) {
      filters.push(new QueryFilter(endDate.toISOString(), 'LESS_THAN', columnName));
    }

    return new QueryFilterGroup(filters);
  }
}
