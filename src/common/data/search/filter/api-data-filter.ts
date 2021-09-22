export class ApiDataFilter {
  constructor(
    public readonly filterValue: string,
    public readonly filterCondition: string,
    public readonly filterDataField: string
  ) {
    Object.freeze(this);
  }
}


