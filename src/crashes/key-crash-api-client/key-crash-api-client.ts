import { ApiClient, BugSplatResponse, TableDataClient, TableDataResponse } from '@common';
import { CrashesApiRow } from '@crashes';
import { CrashesApiResponseRow } from '../crashes-api-row/crashes-api-row';
import { KeyCrashPageData } from './key-crash-page-data';
import { KeyCrashTableDataRequest } from './key-crash-table-data-request';

export class KeyCrashApiClient {

    private _tableDataClient: TableDataClient;

    constructor(private _client: ApiClient) {
        this._tableDataClient = new TableDataClient(this._client, '/keycrash?data&crashTimeSpan');
    }

    async getCrashes(request: KeyCrashTableDataRequest): Promise<TableDataResponse<CrashesApiRow, KeyCrashPageData>> {
        const formParts = { stackKeyId: `${request.stackKeyId}` };
        const response = await this._tableDataClient.postGetData<CrashesApiResponseRow, KeyCrashPageData>(request, formParts);
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
        stackKeyId: number,
        notes: string
    ): Promise<BugSplatResponse> {
        const formData = this._client.createFormData();
        formData.append('database', database);
        formData.append('stackKeyId', stackKeyId.toString());
        formData.append('stackKeyComment', notes);

        const request = {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow',
            duplex: 'half'
        } as RequestInit;

        return this._client.fetch('/api/stackKeyComment.php', request);
    }
}