import { ApiClient, BugSplatResponse } from '../../..';
import { TableDataFormDataBuilder } from '../table-data-form-data-builder/table-data-form-data-builder';
import { TableDataRequest } from './table-data-request';

export class TableDataClient {

  constructor(private _apiClient: ApiClient, private _url: string) { }

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
      .build();
    const init = {
      method: 'POST',
      body: formData,
      cache: 'no-cache',
      credentials: 'include',
      redirect: 'follow'
    };
    const response = await this._apiClient.fetch(this._url, <RequestInit><unknown>init);
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



