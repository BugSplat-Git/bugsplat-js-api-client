import { TableDataRequest } from '@common';
import { SummaryColumn } from '../summary-column';

export interface SummaryTableDataRequest extends TableDataRequest<SummaryColumn> {
    applications?: Array<string>;
    versions?: Array<string>;
}
