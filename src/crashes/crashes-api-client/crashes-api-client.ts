import { ApiClient, BugSplatResponse, TableDataClient, TableDataRequest, TableDataResponse } from '@common';
import { CrashesApiRow } from '@crashes';
import { CrashesApiResponseRow } from 'dist/esm/crashes/crashes-api-row/crashes-api-row';

export class CrashesApiClient {

    private _tableDataClient: TableDataClient;

    constructor(private _client: ApiClient) {
        this._tableDataClient = new TableDataClient(this._client, '/allcrash?data');
    }

    async getCrashes(request: TableDataRequest): Promise<TableDataResponse<CrashesApiRow>> {
        const response = await this._tableDataClient.postGetData<CrashesApiResponseRow>(request);
        const json = await response.json();
        const pageData = json.pageData;
        const rows = json.rows.map(row => new CrashesApiRow(row));

        return {
            rows,
            pageData
        };
    }

    postNotes(
        database: string,
        id: number,
        notes: string
    ): Promise<BugSplatResponse> {
        const formData = this._client.createFormData();
        formData.append('update', 'true');
        formData.append('database', database);
        formData.append('id', `${id}`);
        formData.append('Comments', notes);

        const request = {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow'
        } as RequestInit;

        return this._client.fetch('/allcrash?data', request);
    }
}