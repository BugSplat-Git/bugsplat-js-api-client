import { ApiClient, BugSplatResponse, TableDataFormDataBuilder, TableDataResponse } from '@common';
import { RawResponse } from 'src/common/data/table-data/table-data-client/table-data-client';
import { SummaryApiResponseRow } from '../summary-api-row/summary-api-row';
import { SummaryTableDataRequest } from './summary-table-data-request';

export class SummaryTableDataClient {

  constructor(private _apiClient: ApiClient, private _url: string) { }

  // We use POST to get data in most cases because it supports longer queries
  async postGetData(request: SummaryTableDataRequest): Promise<BugSplatResponse<TableDataResponse<SummaryApiResponseRow>>> {
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
    const requestInit = {
      method: 'POST',
      body: formData,
      cache: 'no-cache',
      credentials: 'include',
      redirect: 'follow'
    } as RequestInit;
    return this.makeRequest(this._url, requestInit);
  }

  private async makeRequest(url: string, init: RequestInit): Promise<BugSplatResponse<TableDataResponse<SummaryApiResponseRow>>> {
    const response = await this._apiClient.fetch<RawResponse<TableDataResponse<SummaryApiResponseRow>>>(url, init);
    const responseData = await response.json();
    const rows = responseData ? responseData[0]?.Rows : [];
    const pageData = responseData ? responseData[0]?.PageData : {};
    
    const status = response.status;
    const payload = { rows, pageData };
    const json = async () => payload;
    const text = async () => JSON.stringify(payload);
    return {
      status,
      json,
      text
    };
  }
}



