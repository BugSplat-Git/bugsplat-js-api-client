import { Event } from '@events';
import { DefectTrackerType } from '../../crash/crash-details/crash-details';
import { createEvents, EventResponseObject } from '../../events/events-api-client/event';

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
    stackKeyDefectUrl: string;
    stackKeyDefectLabel: string;
    stackKeyComments: string;
    firstCrashTime: string;
    lastCrashTime: string;
    events: Array<Event>;
}

export function createKeyCrashPageData(pageData: KeyCrashPageDataRawResponse): KeyCrashPageData {
    const events = createEvents(pageData.events);
    return {
        ...pageData,
        events
    };
}

export type KeyCrashPageDataRawResponse = Omit<KeyCrashPageData, 'events'> & { events: Array<EventResponseObject> };
