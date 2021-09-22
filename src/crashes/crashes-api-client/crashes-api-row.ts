export interface CrashData {
  id: string;
  stackKey: string;
  stackKeyId: string;
  appName: string;
  appVersion: string;
  appDescription: string;
  userDescription: string;
  user: string;
  email: string;
  ipAddress: string;
  crashTime: string;
  defectId: string;
  defectUrl: string;
  defectLabel: string;
  skDefectId: string;
  skDefectUrl: string;
  skDefectLabel: string;
  comments: string;
  skComments: string;
  exceptionCode: string;
  exceptionMessage: string;
}

export class CrashesApiRow implements CrashData {
  public id: string;
  public stackKey: string;
  public stackKeyId: string;
  public appName: string;
  public appVersion: string;
  public appDescription: string;
  public userDescription: string;
  public user: string;
  public email: string;
  public events: Array<Event>; // TODO BG is this correct?
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

  constructor(rawApiRow: { Comments: string, IpAddress: string }) {
    const { Comments, IpAddress, ...sameNamedProperties } = rawApiRow;

    Object.assign(this, sameNamedProperties, {
      comments: Comments || '',
      ipAddress: IpAddress,
    });

    Object.freeze(this);
  }
}
