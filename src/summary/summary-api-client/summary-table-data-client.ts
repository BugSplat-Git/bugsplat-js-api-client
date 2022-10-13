import { ApiClient, BugSplatResponse, TableDataFormDataBuilder } from '@common';
import { SummaryTableDataRequest } from './summary-table-data-request';

export class SummaryTableDataClient {

  constructor(private _apiClient: ApiClient, private _url: string) { }

  // We use POST to get data in most cases because it supports longer queries
  async postGetData(request: SummaryTableDataRequest): Promise<BugSplatResponse> {
    const factory = () => this._apiClient.createFormData();
    const formData = new TableDataFormDataBuilder(factory)
      .withDatabase(request.database)
      .withApplications(request.applications)
      .withVersions(request.versions)
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



