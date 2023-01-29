import { ApiClient, TableDataRequest, BugSplatResponse, TableDataResponse } from '@common';
import { TableDataFormDataBuilder } from '../table-data-form-data-builder/table-data-form-data-builder';

export class TableDataClient {

  constructor(private _apiClient: ApiClient, private _url: string) { }

  // We use POST to get data in most cases because it supports longer queries
  async postGetData<T, U = (Record<string, unknown> | undefined)>(request: TableDataRequest, formParts: Record<string, string> = {}): Promise<BugSplatResponse<TableDataResponse<T, U>>> {
    const factory = () => this._apiClient.createFormData();
    const formData = new TableDataFormDataBuilder(factory, formParts)
      .withDatabase(request.database)
      .withFilterGroups(request.filterGroups)
      .withColumnGroups(request.columnGroups)
      .withPage(request.page)
      .withPageSize(request.pageSize)
      .withSortColumn(request.sortColumn)
      .withSortOrder(request.sortOrder)
      .build();
    const requestInit = {
      method: 'POST',
      body: formData,
      cache: 'no-cache',
      credentials: 'include',
      redirect: 'follow',
      duplex: 'half'
    } as RequestInit;
    return this.makeRequest<T, U>(this._url, requestInit);
  }

  async getData<T, U = (Record<string, unknown> | undefined)>(request: TableDataRequest): Promise<BugSplatResponse<TableDataResponse<T, U>>> {
    const factory = () => this._apiClient.createFormData();
    const formData = new TableDataFormDataBuilder(factory)
      .withDatabase(request.database)
      .withFilterGroups(request.filterGroups)
      .withColumnGroups(request.columnGroups)
      .withPage(request.page)
      .withPageSize(request.pageSize)
      .withSortColumn(request.sortColumn)
      .withSortOrder(request.sortOrder)
      .entries();
    const requestInit = {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'include',
      redirect: 'follow'
    } as RequestInit;
    const queryParams = new URLSearchParams(formData).toString();
    return this.makeRequest<T, U>(`${this._url}?${queryParams}`, requestInit);
  }

  private async makeRequest<T, U = unknown>(url: string, init: RequestInit): Promise<BugSplatResponse<TableDataResponse<T, U>>> {
    const response = await this._apiClient.fetch<RawResponse<TableDataResponse<T,U>>>(url, init);
    const responseData = await response.json();
    const rows = responseData ? responseData[0]?.Rows : [];
    const pageData = responseData ? responseData[0]?.PageData : {};

    const status = response.status;
    const payload = { rows, pageData } as TableDataResponse<T, U>;
    const json = async () => payload;
    const text = async () => JSON.stringify(payload);
    return {
      status,
      json,
      text
    };
  }
}

// https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as
export type RawResponse<T> = Array<{
  [Property in keyof T as Capitalize<string & Property>]: T[Property]
}>

