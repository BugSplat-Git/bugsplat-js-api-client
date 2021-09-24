export class OrderFilter {
  public static readonly ascending: OrderFilter = new OrderFilter('asc', 'fas fa-angle-up');
  public static readonly descending: OrderFilter = new OrderFilter('desc', 'fas fa-angle-down');
  public static readonly none: OrderFilter = new OrderFilter('', '');
  private constructor(public value: string, public css: string) { }
}
