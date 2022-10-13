import { TableDataRequest } from '@common';

export interface SummaryTableDataRequest extends TableDataRequest {
    applications?: Array<string>;
    versions?: Array<string>;
}