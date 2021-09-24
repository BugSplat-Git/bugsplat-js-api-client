import { ApiClient, BugSplatResponse, TableDataClient, TableDataRequest, TableDataResponse } from '@common';
import { CrashesApiRow } from '@crashes';

export class CrashesApiClient {

    private _tableDataClient: TableDataClient;

    constructor(private _client: ApiClient) {
        this._tableDataClient = new TableDataClient(this._client, '/allcrash?data');
    }

    async getCrashes(request: TableDataRequest): Promise<TableDataResponse<CrashesApiRow>> {
        const response = await this._tableDataClient.getData(request);
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

        const init = {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow'
        };

        return this._client.fetch('/allcrash?data', <RequestInit><unknown>init);
    }
}