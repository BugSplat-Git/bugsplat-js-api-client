export interface TableDataResponse<T, U = Record<string, unknown>> {
  rows: Array<T>;
  pageData?: U;
}
