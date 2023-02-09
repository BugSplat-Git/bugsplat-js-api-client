import { QueryFilterGroup, ColumnSortOrder } from '@common';

export interface TableDataRequest {
  database?: string;
  filterGroups?: Array<QueryFilterGroup>;
  columnGroups?: Array<string>;
  page?: number;
  pageSize?: number;
  sortColumn?: string;
  sortOrder?: ColumnSortOrder;
}
