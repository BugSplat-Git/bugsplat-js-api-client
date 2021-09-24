export class FilterOperator {
  public static readonly and = new FilterOperator('0');
  public static readonly or = new FilterOperator('1');
  private constructor(public value: string) { }
}
