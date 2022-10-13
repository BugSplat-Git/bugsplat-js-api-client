interface SummaryData {
  stackKey: string,
  firstReport: string,
  lastReport: string,
  crashSum: string,
  techSupportSubject: string,
  stackKeyDefectId: string,
  stackKeyDefectUrl: string,
  stackKeyDefectLabel: string,
  comments: string,
}

export interface SummaryApiResponseRow extends SummaryData {
  stackKeyId: string;
  subKeyDepth: string;
  userSum: string;
}

interface SummaryDataWithMappedProperties extends SummaryData {
  stackKeyId: number;
  subKeyDepth: number;
  userSum: number;
}


export class SummaryApiRow implements SummaryDataWithMappedProperties {
  constructor(
    public stackKey: string,
    public stackKeyId: number,
    public firstReport: string,
    public lastReport: string,
    public crashSum: string,
    public techSupportSubject: string,
    public stackKeyDefectId: string,
    public stackKeyDefectUrl: string,
    public stackKeyDefectLabel: string,
    public comments: string,
    public subKeyDepth: number,
    public userSum: number
  ) { }
}
