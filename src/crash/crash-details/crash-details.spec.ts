import { CrashDetails, ProcessingStatus } from '@crash';
import { EventStreamActionType } from '@events';
import { createFakeCrashApiResponse } from '@spec/fakes/crash/crash-api-response';
import ac from 'argument-contracts';
import * as ThreadCollectionModule from '../thread-collection/thread-collection';

describe('Crash Details', () => {
  it('should set all properties', () => {
    const options = createFakeCrashApiResponse();

    const result = new CrashDetails(options);

    Object.keys(options).forEach(key => {
      if (key !== 'events') {
        expect(options[key]).toEqual(result[key]);
      } else {
        expect(result.events).toEqual(jasmine.arrayContaining([
          jasmine.objectContaining({
            action: EventStreamActionType.comment,
            createdDate: new Date(options.events[0].timestamp),
            subject: {
              initials: options.events[0].username.substring(0, 2),
              email: options.events[0].username,
            },
            message: options.events[0].message,
          })
        ]));
      }
    });
  });

  it('should default comments and description to empty string if null', () => {
    spyOn(ac, 'assertType');
    spyOn(ThreadCollectionModule, 'ThreadCollection');

    const options = {
      id: 85002,
      stackId: 11372,
      stackKeyId: 1364,
      dumpfile: '/fred/myconsolecrasher-2019.2.3.0/2019/02/03/myconsolecrasher_2019.2.3.0_orgjilct-1706618358.zip',
      appName: 'myConsoleCrasher',
      appVersion: '2019.2.3.0',
      appKey: '',
      crashTypeId: 1,
      crashTime: '2019-02-03 17:22:23 UTC',
      user: 'Fred',
      email: 'fred@bedrock.com',
      events: [],
      description: null,
      ipAddress: '76.119.161.250,172.17.67.161',
      missingSymbols: true,
      platform: '.NET',
      processor: 'OBAN-10.0.7.144',
      comments: null,
      processed: ProcessingStatus.Complete,
      thread: (<any>{ stackFrames: [], stackKeyId: 0 })
    };

    const result = new CrashDetails(<any>options);

    expect(result.comments).toEqual('');
    expect(result.description).toEqual('');
  });
});
