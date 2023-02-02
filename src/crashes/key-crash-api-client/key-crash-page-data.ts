import { Event } from '@events';
import { DefectTrackerType } from 'src/crash/crash-details/crash-details';

export interface KeyCrashPageData {
    stackKeyId: number;
    isSubBucket: boolean;
    isSubKeyedStack: boolean;
    primaryStackKeyId: number;
    subKeyDepth: number;
    stackKey: string;
    defectTracker: boolean;
    defectTrackerType: DefectTrackerType;
    stackKeyDefectId: number;
    stackKeyComments: string;
    firstCrashTime: Date;
    lastCrashTime: Date;
    events: Array<Event>;
}
