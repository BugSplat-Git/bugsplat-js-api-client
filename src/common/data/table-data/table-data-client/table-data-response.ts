export interface TableDataResponse<T, U = unknown> {
  rows: Array<T>;
  pageData?: Record<string, U>;
}
