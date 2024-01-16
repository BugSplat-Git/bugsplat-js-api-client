import { ApiClient, TableDataClient, TableDataResponse } from '@common';
import { TableDataRequest } from 'dist/esm';
import { RawUsersApiRow, UsersApiRow } from '../users-api-row/users-api-row';

export class UsersApiClient {

    private _tableDataClient: TableDataClient;

    constructor(private _client: ApiClient) {
        this._tableDataClient = new TableDataClient(this._client, '/users?data');
    }

    async getUsers(request: TableDataRequest): Promise<TableDataResponse<UsersApiRow>> {
        const response = await this._tableDataClient.postGetData<RawUsersApiRow>(request);
        const json = await response.json();
        const pageData = json.pageData;
        const rows = json.rows.map(row => new UsersApiRow(row));

        return {
            rows,
            pageData
        };
    }
}
