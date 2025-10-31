import { ApiClient, TableDataClient, TableDataResponse, isErrorResponse } from '@common';
import { SummaryApiResponseRow, SummaryApiRow } from '../summary-api-row/summary-api-row';
import { SummaryTableDataRequest } from '../summary-table-data/summary-table-data-request';

export class SummaryApiClient {
    private _tableDataClient: TableDataClient;

    constructor(private _client: ApiClient) {
        this._tableDataClient = new TableDataClient(this._client, 'api/v2/summary');
    }

    async getSummary(request: SummaryTableDataRequest): Promise<TableDataResponse<SummaryApiRow>> {
        const formParts = {};
        if (request.applications && request.applications.length) {
            formParts['appNames'] = request.applications.join(',');
        }
        if (request.versions && request.versions.length) {
            formParts['versions'] = request.versions.join(',');
        }

        const response = await this._tableDataClient.postGetData<SummaryApiResponseRow>(
            request,
            formParts
        );

        if (isErrorResponse(response)) {
            throw new Error((await response.json()).message);
        }

        const responseData = await response.json();
        const pageData = responseData.pageData || {};
        const rows = responseData.rows.map(
            (row) =>
                new SummaryApiRow(
                    row.stackKey,
                    Number(row.stackKeyId),
                    row.firstReport,
                    row.lastReport,
                    row.crashSum,
                    row.techSupportSubject,
                    row.stackKeyDefectId,
                    row.stackKeyDefectUrl,
                    row.stackKeyDefectLabel,
                    row.comments,
                    Number(row.subKeyDepth),
                    Number(row.userSum),
                    Number(row.status)
                )
        );

        return {
            rows,
            pageData,
        };
    }
}
