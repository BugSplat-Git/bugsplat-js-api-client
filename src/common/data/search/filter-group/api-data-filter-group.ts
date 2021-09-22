import { EQUAL, GREATER_THAN, LESS_THAN } from '../filter-condition/filter-condition';
import { FilterOperator } from '../filter-operator/filter-operator';
import { ApiDataFilter } from '../filter/api-data-filter';

export class ApiDataFilterGroup {
  constructor(
    public filters: Array<ApiDataFilter>,
    public filterOperator: FilterOperator = FilterOperator.and,
    public groupOperator: FilterOperator = FilterOperator.and
  ) {
    Object.freeze(this);
  }

  static fromApiTableFilter(filter: ApiDataFilter): ApiDataFilterGroup {
    return new ApiDataFilterGroup([filter]);
  }

  static fromColumnValues(
    values: Array<string>,
    columnName: string,
    filterOperator: FilterOperator = FilterOperator.or
  ): ApiDataFilterGroup {
    return new ApiDataFilterGroup(values.map(value => new ApiDataFilter(value, EQUAL, columnName)), filterOperator);
  }

  static fromTimeFrame(columnName: string, startDate?: Date, endDate?: Date): ApiDataFilterGroup {
    const filters: Array<ApiDataFilter> = [];

    if (startDate) {
      filters.push(new ApiDataFilter(startDate.toISOString(), GREATER_THAN, columnName));
    }

    if (endDate) {
      filters.push(new ApiDataFilter(endDate.toISOString(), LESS_THAN, columnName));
    }

    return new ApiDataFilterGroup(filters);
  }
}
