import { ApiDataFilterGroup, ColumnSortOrder } from '@common';

export interface TableDataRequest {
  database?: string;
  filterGroups?: Array<ApiDataFilterGroup>;
  columnGroups?: Array<string>;
  page?: number;
  pageSize?: number;
  sortColumn?: string;
  sortOrder?: ColumnSortOrder;
}
