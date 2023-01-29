import { TableDataRequest } from '@common';

export interface KeyCrashTableDataRequest extends TableDataRequest {
    stackKeyId: number;
}