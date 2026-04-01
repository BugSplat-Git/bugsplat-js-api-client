import { QueryFilterGroup, ColumnSortOrder } from '@common';

export interface TableDataRequest<TColumn extends string> {
  database?: string;
  filterGroups?: Array<QueryFilterGroup<TColumn>>;
  columnGroups?: Array<TColumn>;
  page?: number;
  pageSize?: number;
  sortColumn?: TColumn;
  sortOrder?: ColumnSortOrder;
}
