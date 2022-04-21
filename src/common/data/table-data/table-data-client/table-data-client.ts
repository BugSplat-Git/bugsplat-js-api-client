import { ApiClient, TableDataRequest, BugSplatResponse } from '@common';
import { TableDataFormDataBuilder } from '../table-data-form-data-builder/table-data-form-data-builder';

export class TableDataClient {

  constructor(private _apiClient: ApiClient, private _url: string) { }

  // We use POST to get data in most cases because it supports longer queries
  async postGetData(request: TableDataRequest): Promise<BugSplatResponse> {
    const factory = () => this._apiClient.createFormData();
    const formData = new TableDataFormDataBuilder(factory)
      .withDatabase(request.database)
      .withFilterGroups(request.filterGroups)
      .withColumnGroups(request.columnGroups)
      .withPage(request.page)
      .withPageSize(request.pageSize)
      .withSortColumn(request.sortColumn)
      .withSortOrder(request.sortOrder)
      .build();
    const init = {
      method: 'POST',
      body: formData,
      cache: 'no-cache',
      credentials: 'include',
      redirect: 'follow'
    };
    return this.makeRequest(this._url, <RequestInit><unknown>init);
  }

  async getData(request: TableDataRequest): Promise<BugSplatResponse> {
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
    const init = {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'include',
      redirect: 'follow'
    };
    const queryParams = new URLSearchParams(formData).toString();
    return this.makeRequest(`${this._url}?${queryParams}`, <RequestInit><unknown>init);
  }

  private async makeRequest(url: string, init: RequestInit): Promise<BugSplatResponse> {
    const response = await this._apiClient.fetch(url, init);
    const responseData = await response.json();
    const rows = responseData ? responseData[0]?.Rows : [];
    const pageData = responseData ? responseData[0]?.PageData : {};
    
    const status = response.status;
    const json = async () => ({ rows, pageData });
    return {
      status,
      json
    };
  }
}



