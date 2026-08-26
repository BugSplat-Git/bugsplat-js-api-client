import {
    ApiClient,
    TableDataClient,
    TableDataRequest,
    TableDataResponse,
    isErrorResponse,
} from '@common';
import { SymbolDetailsColumn } from '../symbol-details-column';
import { SymbolDetailsApiResponseRow, SymbolDetailsApiRow } from '../symbol-details-api-row/symbol-details-api-row';

export class SymbolDetailsApiClient {
    private readonly route = '/api/v2/symbols';

    private _tableDataClient: TableDataClient;

    constructor(private _client: ApiClient) {
        this._tableDataClient = new TableDataClient(this._client, this.route);
    }

    async getSymbolDetails(
        request: TableDataRequest<SymbolDetailsColumn>
    ): Promise<TableDataResponse<SymbolDetailsApiRow>> {
        const response = await this._tableDataClient.postGetData<SymbolDetailsApiResponseRow>(request);

        if (isErrorResponse(response)) {
            throw new Error((await response.json()).message);
        }

        const json = await response.json();
        const pageData = json.pageData;
        const rows = json.rows.map((row) => new SymbolDetailsApiRow(row));

        return {
            rows,
            pageData,
        };
    }
}
