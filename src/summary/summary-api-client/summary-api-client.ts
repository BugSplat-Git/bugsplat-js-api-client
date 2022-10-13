import { ApiClient, TableDataResponse } from '@common';
import { SummaryApiResponseRow, SummaryApiRow } from '../summary-api-row/summary-api-row';
import { SummaryTableDataClient } from '../summary-table-data/summary-table-data-client';
import { SummaryTableDataRequest } from '../summary-table-data/summary-table-data-request';

export class SummaryApiClient {

    private _tableDataClient: SummaryTableDataClient;

    constructor(private _client: ApiClient) {
        this._tableDataClient = new SummaryTableDataClient(this._client, '/summary?data');
    }

    async getSummary(request: SummaryTableDataRequest): Promise<TableDataResponse<SummaryApiRow>> {
        const response = await this._tableDataClient.postGetData(request);
        const json = await response.json();
        const pageData = json.pageData;
        const rows = json.rows.map((row: SummaryApiResponseRow) => new SummaryApiRow(
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
