import { AdditionalInfo, CrashStatus, ProcessingStatus } from '@crash';
import { createFakeCrashApiResponse } from '@spec/fakes/crash/crash-api-response';
import { createFakeGpuCrashSummary } from '@spec/fakes/crash/gpu';
import ac from 'argument-contracts';
import { createEvents } from '../../events/events-api-client/event';
import * as ThreadCollectionModule from '../thread-collection/thread-collection';
import { createCrashDetails } from './crash-details';

describe('createCrashDetails', () => {
  it('should set all properties', () => {
    const options: any = createFakeCrashApiResponse();

    const result = createCrashDetails(options);

    const { attributes, ...rest } = options;
    expect(result).toEqual(jasmine.objectContaining({
      ...rest,
      attributes: JSON.parse(attributes),
      events: createEvents(options.events),
      additionalInfo: jasmine.any(AdditionalInfo),
    }));
  });

  it('should set gpu to null when the response has no gpu summary', () => {
    const result = createCrashDetails(createFakeCrashApiResponse());

    expect(result.gpu).toBeNull();
  });

  it('should set gpu when the response has a gpu summary object', () => {
    const gpu = createFakeGpuCrashSummary();
    const options = { ...createFakeCrashApiResponse(), gpu };

    const result = createCrashDetails(options);

    expect(result.gpu).toEqual(gpu);
  });

  it('should parse gpu when the response has a gpu summary JSON string', () => {
    const gpu = createFakeGpuCrashSummary();
    const options = { ...createFakeCrashApiResponse(), gpu: JSON.stringify(gpu) };

    const result = createCrashDetails(options);

    expect(result.gpu).toEqual(gpu);
  });

  it('should default comments and description to empty string if null', () => {
    spyOn(ac, 'assertType');
    spyOn(ThreadCollectionModule, 'ThreadCollection');

    const options = {
      id: 85002,
      stackId: 11372,
      stackKeyId: 1364,
      dumpfile: '/fred/myconsolecrasher-2019.2.3.0/2019/02/03/myconsolecrasher_2019.2.3.0_orgjilct-1706618358.zip',
      dumpfileSize: 42,
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
      thread: ({ stackFrames: [], stackKeyId: 0 } as any),
      status: CrashStatus.Open,
    };

    const result = createCrashDetails(options as any);

    expect(result.comments).toEqual('');
    expect(result.description).toEqual('');
  });
});
