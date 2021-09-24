interface CrashData {
  id: string;
  stackKey: string;
  stackKeyId: string;
  appName: string;
  appVersion: string;
  appDescription: string;
  userDescription: string;
  user: string;
  email: string;
  crashTime: string;
  defectId: string;
  defectUrl: string;
  defectLabel: string;
  skDefectId: string;
  skDefectUrl: string;
  skDefectLabel: string;
  skComments: string;
  exceptionCode: string;
  exceptionMessage: string;
}

export interface CrashDataWithMappedProperties extends CrashData {
  comments: string;
  ipAddress: string;
}

export interface CrashesApiResponseRow extends CrashData {
  Comments: string;
  IpAddress: string;
}

export class CrashesApiRow {
  public id: string;
  public stackKey: string;
  public stackKeyId: string;
  public appName: string;
  public appVersion: string;
  public appDescription: string;
  public userDescription: string;
  public user: string;
  public email: string;
  public ipAddress: string;
  public crashTime: string;
  public defectId: string;
  public defectUrl: string;
  public defectLabel: string;
  public skDefectId: string;
  public skDefectUrl: string;
  public skDefectLabel: string;
  public comments: string;
  public skComments: string;
  public exceptionCode: string;
  public exceptionMessage: string;

  constructor(rawApiRow: CrashesApiResponseRow) {
    this.id = rawApiRow.id;
    this.stackKey = rawApiRow.stackKey;
    this.stackKeyId = rawApiRow.stackKeyId;
    this.appName = rawApiRow.appName;
    this.appVersion = rawApiRow.appVersion;
    this.appDescription = rawApiRow.appDescription;
    this.userDescription = rawApiRow.userDescription;
    this.user = rawApiRow.user;
    this.email = rawApiRow.email;
    this.ipAddress = rawApiRow.IpAddress;
    this.crashTime = rawApiRow.crashTime;
    this.defectId = rawApiRow.defectId;
    this.defectUrl = rawApiRow.defectUrl;
    this.defectLabel = rawApiRow.defectLabel;
    this.skDefectId = rawApiRow.skDefectId;
    this.skDefectUrl = rawApiRow.skDefectUrl;
    this.skDefectLabel = rawApiRow.skDefectLabel;
    this.comments = rawApiRow.Comments;
    this.skComments = rawApiRow.skComments;
    this.exceptionCode = rawApiRow.exceptionCode;
    this.exceptionMessage = rawApiRow.exceptionMessage;

    Object.freeze(this);
  }
}
