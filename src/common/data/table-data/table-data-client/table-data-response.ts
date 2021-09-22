export interface TableDataResponse<T> {
  rows: Array<T>;
  pageData?: Record<string, unknown>;
}
