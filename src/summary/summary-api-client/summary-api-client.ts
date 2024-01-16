import { ApiClient, TableDataClient, TableDataResponse } from '@common';
import { SummaryApiResponseRow, SummaryApiRow } from '../summary-api-row/summary-api-row';
import { SummaryTableDataRequest } from '../summary-table-data/summary-table-data-request';

export class SummaryApiClient {

    private _tableDataClient: TableDataClient;

    constructor(private _client: ApiClient) {
        this._tableDataClient = new TableDataClient(this._client, '/summary?data');
    }

    async getSummary(request: SummaryTableDataRequest): Promise<TableDataResponse<SummaryApiRow>> {
        const appNames = request.applications?.join(',') || '';
        const versions = request.versions?.join(',') || '';
        const formParts = { appNames, versions };
        const response = await this._tableDataClient.postGetData<SummaryApiResponseRow>(request, formParts);
        const json = await response.json();
        const pageData = json.pageData;
        const rows = json.rows.map(row => new SummaryApiRow(
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
            Number(row.userSum)
        )
        );

        return {
            rows,
            pageData
        };
    }
}
