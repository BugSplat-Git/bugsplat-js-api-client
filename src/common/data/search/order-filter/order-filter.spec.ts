import { OrderFilter } from '@common';

describe('OrderFilter', () => {
  it('should exist', () => {
    expect(OrderFilter).toEqual(jasmine.any(Function));
  });

  it('should have static properties', () => {
    expect(OrderFilter.ascending).toEqual(jasmine.any(OrderFilter));
    expect(OrderFilter.descending).toEqual(jasmine.any(OrderFilter));
    expect(OrderFilter.none).toEqual(jasmine.any(OrderFilter));
  });
});
