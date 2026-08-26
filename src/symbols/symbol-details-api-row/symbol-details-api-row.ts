import ac from 'argument-contracts';

export interface SymbolDetailsApiResponseRow {
  application: string;
  version: string;
  moduleName: string;
  s3Key: string;
  s3Bucket: string | null;
  symbolType: string | null;
  guid: string | null;
  size: number | string;
  lastUploaded: string | null;
  lastModified: string | null;
  lastAccessed: string | null;
  downloadFile: string;
}

export class SymbolDetailsApiRow {
  application: string;
  version: string;
  moduleName: string;
  s3Key: string;
  s3Bucket: string | null;
  symbolType: string | null;
  guid: string | null;
  size: number;
  lastUploaded: string | null;
  lastModified: string | null;
  lastAccessed: string | null;
  downloadFile: string;

  constructor(rawApiRow: SymbolDetailsApiResponseRow) {
    ac.assertType(rawApiRow, Object, 'rawApiRow');

    this.application = rawApiRow.application ?? '';
    this.version = rawApiRow.version ?? '';
    this.moduleName = rawApiRow.moduleName ?? '';
    this.s3Key = rawApiRow.s3Key ?? '';
    this.s3Bucket = rawApiRow.s3Bucket ?? null;
    this.symbolType = rawApiRow.symbolType ?? null;
    this.guid = rawApiRow.guid ?? null;
    this.size = Number(rawApiRow.size ?? 0);
    this.lastUploaded = rawApiRow.lastUploaded ?? null;
    this.lastModified = rawApiRow.lastModified ?? null;
    this.lastAccessed = rawApiRow.lastAccessed ?? null;
    this.downloadFile = rawApiRow.downloadFile ?? '';

    Object.freeze(this);
  }
}
