import { ApiDataFilterGroup } from '../../search/filter-group/api-data-filter-group';
import { OrderFilter } from '../../search/order-filter/order-filter'; // TODO BG from index?

export interface TableDataRequest {
  database?: string;
  filterGroups?: Array<ApiDataFilterGroup>;
  columnGroups?: Array<string>;
  page?: number;
  pageSize?: number;
  sortColumn?: string;
  sortOrder?: OrderFilter;
}
