import { TableDataRequest } from '@common';
import { CrashesColumn } from '../crashes-column';

export interface KeyCrashTableDataRequest extends TableDataRequest<CrashesColumn> {
    stackKeyId: number;
}
