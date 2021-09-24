import { AdditionalInfo, GroupableThreadCollection, ThreadCollection } from '@crash';
import { convertEventsToEventStreamEvents, Event, EventResponseObject } from '@events';
import ac from 'argument-contracts';
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
  Assembla = 'Assembla'
}

interface CrashDetailsConstructorOptions {
  processed: ProcessingStatus;

  additionalFiles?: Array<string>;
  appKey?: string;
  appName?: string;
  appVersion?: string;
  comments?: string;
  crashTime?: string;
  defectTrackerType?: DefectTrackerType;
  defectLabel?: string;
  defectUrl?: string;
  description?: string;
  dumpfile?: string;
  email?: string;
  events: Array<EventResponseObject>;
  exceptionCode?: string;
  exceptionMessage?: string;
  id?: number;
  ipAddress?: string;
  missingSymbols?: boolean;
  nextCrashId?: number;
  platform?: string;
  previousCrashId?: number;
  processor?: string;
  stackKeyId?: number;
  stackKeyDefectLabel?: string;
  stackKeyDefectUrl?: string;
  thread?: GroupableThreadCollection;
  user?: string;
  debuggerOutput?: AdditionalInfoResponseObject;
}

function defaultToEmptyString(value, name) {
  if(value) {
    ac.assertString(value, name);
    return value;
  } else {
    return '';
  }
}

export class CrashDetails {
  processed: ProcessingStatus;

  additionalFiles?: Array<string>;
  appKey?: string;
  appName?: string;
  appVersion?: string;
  comments?: string;
  crashTime?: string;
  defectTrackerType?: DefectTrackerType;
  defectId?: string;
  defectLabel?: string;
  defectUrl?: string;
  description?: string;
  dumpfile?: string;
  email?: string;
  events: Array<Event>;
  exceptionCode?: string;
  exceptionMessage?: string;
  id?: number;
  ipAddress?: string;
  missingSymbols?: boolean;
  nextCrashId?: number;
  platform?: string;
  previousCrashId?: number;
  processor?: string;
  stackKeyId?: number;
  stackKeyDefectId?: number;
  stackKeyDefectLabel?: string;
  stackKeyDefectUrl?: string;
  thread?: GroupableThreadCollection;
  user?: string;
  additionalInfo?: AdditionalInfo;

  constructor(options: CrashDetailsConstructorOptions) {
    ac.assertNumber(options.processed, 'options.processed');

    ac.assertNumber(<number>options.id, 'options.id');
    ac.assertNumber(<number>options.stackKeyId, 'options.stackKeyId');
    ac.assertBoolean(<boolean>options.missingSymbols, 'options.missingSymbols');

    const safeAppName = defaultToEmptyString(
      options.appName,
      'options.appName'
    );
    const safeAppVersion = defaultToEmptyString(
      options.appVersion,
      'options.appVersion'
    );
    const safeAppKey = defaultToEmptyString(options.appKey, 'options.appKey');
    const safeNotes = defaultToEmptyString(
      options.comments,
      'options.comments'
    );
    const safeCrashTime = defaultToEmptyString(
      options.crashTime,
      'options.crashTime'
    );
    const safeDefectLabel = defaultToEmptyString(
      options.defectLabel,
      'options.defectLabel'
    );
    const safeDefectUrl = defaultToEmptyString(
      options.defectUrl,
      'options.defectUrl'
    );
    const safeDescription = defaultToEmptyString(
      options.description,
      'options.description'
    );
    const safeDumpfile = defaultToEmptyString(
      options.dumpfile,
      'options.dumpfile'
    );
    const safeEmail = defaultToEmptyString(options.email, 'options.email');
    const safeExceptionCode = defaultToEmptyString(
      options.exceptionCode,
      'options.exceptionCode'
    );
    const safeExceptionMessage = defaultToEmptyString(
      options.exceptionMessage,
      'options.exceptionMessage'
    );
    const safeIpAddress = defaultToEmptyString(
      options.ipAddress,
      'options.ipAddress'
    );
    const safePlatform = defaultToEmptyString(
      options.platform,
      'options.platform'
    );
    const safeProcessor = defaultToEmptyString(
      options.processor,
      'options.processor'
    );
    const safeStackKeyDefectLabel = defaultToEmptyString(
      options.stackKeyDefectLabel,
      'options.stackKeyDefectLabel'
    );
    const safeStackKeyDefectUrl = defaultToEmptyString(
      options.stackKeyDefectUrl,
      'options.stackKeyDefectUrl'
    );
    const safeUser = defaultToEmptyString(options.user, 'options.user');

    ac.assertType(options.thread, ThreadCollection, 'options.thread');
    ac.assertType(options.additionalFiles, Array, 'options.additionalFiles');

    this.additionalFiles = options.additionalFiles;
    this.appKey = safeAppKey;
    this.appName = safeAppName;
    this.appVersion = safeAppVersion;
    this.comments = safeNotes;
    this.crashTime = safeCrashTime;
    this.defectTrackerType = options.defectTrackerType;
    this.defectLabel = safeDefectLabel;
    this.defectUrl = safeDefectUrl;
    this.description = safeDescription;
    this.dumpfile = safeDumpfile;
    this.email = safeEmail;
    this.events = convertEventsToEventStreamEvents(options.events);
    this.exceptionCode = safeExceptionCode;
    this.exceptionMessage = safeExceptionMessage;
    this.id = options.id;
    this.ipAddress = safeIpAddress;
    this.missingSymbols = options.missingSymbols;
    this.nextCrashId = options.nextCrashId;
    this.platform = safePlatform;
    this.previousCrashId = options.previousCrashId;
    this.processed = options.processed;
    this.processor = safeProcessor;
    this.stackKeyId = options.stackKeyId;
    this.stackKeyDefectLabel = safeStackKeyDefectLabel;
    this.stackKeyDefectUrl = safeStackKeyDefectUrl;
    this.thread = new GroupableThreadCollection({
      ...<ThreadCollection>options.thread,
      stackKeyId: <number>options.stackKeyId,
    });
    this.user = safeUser;
    this.additionalInfo = AdditionalInfo.fromRawResponse(
      options.debuggerOutput
    );

    Object.freeze(this);
  }
}