import { AdditionalInfo, GroupableThreadCollection, ThreadCollection } from '@crash';
import { Event } from '@events';
import ac from 'argument-contracts';
import { safeParseJson } from '../../common/parse';
import { EventResponseObject, createEvents } from '../../events/events-api-client/event';
import { AdditionalInfoResponseObject } from '../additional-info/additional-info';

export enum ProcessingStatus {
  Processing,
  ActiveThreadComplete,
  Complete
}

export enum DefectTrackerType {
  None = 'None',
  FogBugz = 'FogBugz',
  Jira = 'Jira',
  Azure = 'Azure DevOps',
  YouTrack = 'YouTrack',
  GitHub = 'GitHub',
  Assembla = 'Assembla',
  Monday = 'Monday',
  GitLab = 'GitLab',
  Favro = 'Favro',
}

export enum CrashStatus {
  Open = 0,
  Closed = 1,
  Regression = 2,
}

export interface CrashDetails {
  processed: ProcessingStatus;

  appKey: string;
  appName: string;
  appVersion: string;
  attributes: Record<string, unknown>;
  comments: string;
  crashTime: string;
  defectTrackerType: DefectTrackerType;
  defectId: string;
  defectLabel: string;
  defectUrl: string;
  description: string;
  dumpfile: string;
  dumpfileSize: number;
  email: string;
  events: Array<Event>;
  exceptionCode: string;
  exceptionMessage: string;
  id: number;
  ipAddress: string;
  missingSymbols: boolean;
  nextCrashId: number;
  platform: string;
  previousCrashId: number;
  processor: string;
  status: CrashStatus;
  stackKey: string;
  stackKeyComment: string;
  stackKeyId: number;
  stackKeyDefectId: number;
  stackKeyDefectLabel: string;
  stackKeyDefectUrl: string;
  thread: GroupableThreadCollection;
  user: string;
  additionalInfo: AdditionalInfo;
}

export function createCrashDetails(options: CrashDetailsRawResponse): CrashDetails {
  ac.assertNumber(options.processed as number, 'options.processed');

  ac.assertNumber(<number>options.id, 'options.id');
  ac.assertNumber(<number>options.stackKeyId, 'options.stackKeyId');
  ac.assertBoolean(<boolean>options.missingSymbols, 'options.missingSymbols');
  ac.assertNumber(<number>options.dumpfileSize, 'options.dumpfileSize');

  const appName = defaultToEmptyString(options.appName, 'options.appName');
  const appVersion = defaultToEmptyString(options.appVersion, 'options.appVersion');
  const appKey = defaultToEmptyString(options.appKey, 'options.appKey');
  const attributes = safeParseJson(options.attributes);
  const comments = defaultToEmptyString(options.comments, 'options.comments');
  const crashTime = defaultToEmptyString(options.crashTime, 'options.crashTime');
  const defectLabel = defaultToEmptyString(options.defectLabel, 'options.defectLabel');
  const defectUrl = defaultToEmptyString(options.defectUrl, 'options.defectUrl');
  const description = defaultToEmptyString(options.description, 'options.description');
  const dumpfile = defaultToEmptyString(options.dumpfile, 'options.dumpfile');
  const email = defaultToEmptyString(options.email, 'options.email');
  const exceptionCode = defaultToEmptyString(options.exceptionCode, 'options.exceptionCode');
  const exceptionMessage = defaultToEmptyString(options.exceptionMessage, 'options.exceptionMessage');
  const ipAddress = defaultToEmptyString(options.ipAddress, 'options.ipAddress');
  const platform = defaultToEmptyString(options.platform, 'options.platform');
  const processor = defaultToEmptyString(options.processor, 'options.processor');
  const stackKey = defaultToEmptyString(options.stackKey, 'options.stackKey');
  const stackKeyComment = defaultToEmptyString(options.stackKeyComment, 'options.stackKeyComment');
  const stackKeyDefectLabel = defaultToEmptyString(options.stackKeyDefectLabel, 'options.stackKeyDefectLabel');
  const stackKeyDefectUrl = defaultToEmptyString(options.stackKeyDefectUrl, 'options.stackKeyDefectUrl');
  const user = defaultToEmptyString(options.user, 'options.user');

  ac.assertType(options.thread, ThreadCollection, 'options.thread');
  ac.assertType(options.events, Array, 'options.events');

  const status = (options.status || 0) as CrashStatus;
  const events = createEvents(options.events as EventResponseObject[]);
  const thread = new GroupableThreadCollection({
    ...<ThreadCollection>options.thread,
    stackKeyId: <number>options.stackKeyId,
  });
  const additionalInfo = AdditionalInfo.fromRawResponse(
    options.debuggerOutput
  );

  return {
    ...options,
    appKey,
    appName,
    appVersion,
    attributes,
    comments,
    crashTime,
    defectLabel,
    defectUrl,
    description,
    dumpfile,
    email,
    exceptionCode,
    exceptionMessage,
    ipAddress,
    platform,
    processor,
    status,
    stackKey,
    stackKeyComment,
    stackKeyDefectLabel,
    stackKeyDefectUrl,
    user,
    thread,
    additionalInfo,
    events,
  } as CrashDetails;
}

export interface CrashDetailsRawResponse extends Partial<Omit<CrashDetails, 'events' | 'debuggerOutput' | 'attributes'>> {
  attributes?: string;
  events?: Array<EventResponseObject>;
  debuggerOutput?: AdditionalInfoResponseObject;
}

function defaultToEmptyString(value, name) {
  if (value) {
    ac.assertString(value, name);
    return value;
  } else {
    return '';
  }
}
