import {
    ApiClient,
    BugSplatResponse,
    TableDataClient,
    TableDataRequest,
    TableDataResponse,
} from '@common';
import { CrashesApiRow, CrashesPageData } from '@crashes';
import { isErrorResponse } from 'src/common/data/table-data/table-data-client/table-data-client';
import { CrashesApiResponseRow } from '../crashes-api-row/crashes-api-row';

export class CrashesApiClient {
    private _tableDataClient: TableDataClient;

    constructor(private _client: ApiClient) {
        this._tableDataClient = new TableDataClient(this._client, '/api/crashes.php');
    }

    async deleteCrashes(database: string, ids: number[]): Promise<BugSplatResponse> {
        const urlParams = new URLSearchParams({ database, ids: ids.join(',') });
        const request = {
            method: 'DELETE',
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow',
            duplex: 'half',
        } as RequestInit;
        return this._client.fetch(`/api/crashes.php?${urlParams}`, request);
    }

    async getCrashes(
        request: TableDataRequest
    ): Promise<TableDataResponse<CrashesApiRow, CrashesPageData>> {
        const response = await this._tableDataClient.postGetData<
            CrashesApiResponseRow,
            CrashesPageData
        >(request);

        if (isErrorResponse(response)) {
            throw new Error(response.message);
        }

        const responseData = await response.json();
        const pageData = responseData.pageData;
        const rows = responseData.rows.map((row) => new CrashesApiRow(row));

        return {
            rows,
            pageData,
        };
    }
}
