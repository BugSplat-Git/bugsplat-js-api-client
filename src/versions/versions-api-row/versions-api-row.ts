import ac from 'argument-contracts';

export interface VersionsApiResponseRow {
  symbolId: string;
  appName: string;
  version: string;
  lastUpdate: string;
  firstReport: string;
  lastReport: string;
  size: string;
  reportsPerDay: string | null;
  rejectedCount: string;
  retired: 0 | 1;
  fullDumps: 0 | 1;
}

export class VersionsApiRow {
  symbolId: number;
  appName: string;
  version: string;
  lastUpdate: string;
  firstReport: string;
  lastReport: string;
  size: number;
  reportsPerDay: number;
  rejectedCount: number;
  retired: 0 | 1;
  fullDumps: 0 | 1;

  constructor(rawApiRow: VersionsApiResponseRow) {
    ac.assertType(rawApiRow, Object, 'rawApiRow');

    let symbolId;
    try {
      symbolId = Number(rawApiRow.symbolId);
    } catch (error) {
      throw new TypeError(`symbolId should be parsable to int. Provided value: ${JSON.stringify(rawApiRow.symbolId)}. Inner Error: ${error}`);
    }

    const safeAppName = rawApiRow.appName ?? '';
    const safeVersion = rawApiRow.version ?? '';
    const safeReportsPerDay = rawApiRow.reportsPerDay ?? 0;

    this.symbolId = symbolId;
    this.appName = safeAppName;
    this.version = safeVersion;
    this.lastUpdate = rawApiRow.lastUpdate;
    this.firstReport = rawApiRow.firstReport;
    this.lastReport = rawApiRow.lastReport;
    this.size = Number(rawApiRow.size);
    this.reportsPerDay = Number(safeReportsPerDay);
    this.rejectedCount = Number(rawApiRow.rejectedCount);
    this.retired = rawApiRow.retired;
    this.fullDumps = rawApiRow.fullDumps;

    Object.freeze(this);
  }
}
