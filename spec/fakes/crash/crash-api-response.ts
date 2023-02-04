import { GroupableThreadCollection, ProcessingStatus } from '@crash';
import { EventType } from '@events';
import { createFakeEvents } from '@spec/fakes/events/events';
import { CrashDetailsRawResponse } from 'src/crash/crash-details/crash-details';

export const createFakeCrashApiResponse = () => ({
    processed: ProcessingStatus.Complete as number,
    additionalFiles: ['1.txt', '2.png'],
    appKey: 'ardvark',
    appName: 'boregard',
    appVersion: '1.2.3.4',
    comments: 'blah blah blah',
    crashTime: '2023-02-04T17:58:15+0000Z',
    defectLabel: 'weee!',
    defectUrl: 'http://newayz.net',
    description: 'haa!',
    dumpfile: '💩',
    email: 'bobby@newayz.net',
    events: createFakeEvents([EventType.Comment]),
    exceptionCode: '0010',
    exceptionMessage: 'u dun goofd',
    id: 999,
    ipAddress: '192.168.0.1',
    missingSymbols: true,
    nextCrashId: 1000,
    platform: 'NES',
    previousCrashId: 998,
    processor: 'Pentium 4',
    stackKeyComment: 'hello world!',
    stackKeyId: 117,
    stackKeyDefectLabel: 'idk',
    stackKeyDefectUrl: 'http://toppong.com',
    thread: new GroupableThreadCollection({ stackFrames: [], stackKeyId: 117 }),
    user: 'Fred'
} as CrashDetailsRawResponse);