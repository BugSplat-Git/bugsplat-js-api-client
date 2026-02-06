import { QueryFilter, QueryFilterGroup, FilterOperator } from '@common';

describe('QueryFilterGroup', () => {
  describe('constructor', () => {
    it('should default groupOpenCount and groupCloseCount to 1', () => {
      const filter = new QueryFilter('value', 'EQUAL', 'field');

      const result = new QueryFilterGroup([filter]);

      expect(result.groupOpenCount).toEqual(1);
      expect(result.groupCloseCount).toEqual(1);
    });

    it('should set groupOpenCount and groupCloseCount when provided', () => {
      const filter = new QueryFilter('value', 'EQUAL', 'field');

      const result = new QueryFilterGroup([filter], FilterOperator.and, FilterOperator.and, 2, 3);

      expect(result.groupOpenCount).toEqual(2);
      expect(result.groupCloseCount).toEqual(3);
    });
  });

  describe('fromQueryFilter', () => {
    it('should return filter group containing filter, filter operator and group operator', () => {
      const filter = new QueryFilter('value', 'EQUAL', 'field');

      const result = QueryFilterGroup.fromApiTableFilter(filter);

      expect(result.groupOperator).toEqual(FilterOperator.and);
      expect(result.filterOperator).toEqual(FilterOperator.and);
      expect(result.filters).toEqual([filter]);
    });
  });

  describe('fromColumnValues', () => {
    it('should return filter group containing filters, filter operators and group operator', () => {
      const column = 'Camp Granada';
      const values = ['hello', 'muddah', 'hello', 'fadduh'];

      const result = QueryFilterGroup.fromColumnValues(values, column, FilterOperator.or);

      expect(result.groupOperator).toEqual(FilterOperator.and);
      expect(result.filterOperator).toEqual(FilterOperator.or);
      result.filters.forEach((filter, i) => {
        expect(filter.filterDataField).toEqual(column);
        expect(filter.filterCondition).toEqual('EQUAL');
        expect(filter.filterValue).toEqual(values[i]);
      });
    });
  });

  describe('fromTimeFrame', () => {
    it('should return filter group containing filters, filter operators, and group operator', () => {
      const startDate = new Date();
      const endDate = new Date();

      const result = QueryFilterGroup.fromTimeFrame('crashTime', startDate, endDate);

      expect(result.filters.length).toEqual(2);
      expect(result.filterOperator).toEqual(FilterOperator.and);
      expect(result.groupOperator).toEqual(FilterOperator.and);
      expect(result.filters[0].filterCondition).toEqual('GREATER_THAN');
      expect(result.filters[0].filterDataField).toEqual('crashTime');
      expect(result.filters[0].filterValue).toEqual(startDate.toISOString());
      expect(result.filters[1].filterCondition).toEqual('LESS_THAN');
      expect(result.filters[1].filterDataField).toEqual('crashTime');
      expect(result.filters[1].filterValue).toEqual(endDate.toISOString());
    });

    it('should return empty filter group if startDate and endDate are falsy', () => {
      const result = QueryFilterGroup.fromTimeFrame('crashTime');

      expect(result.filters.length).toEqual(0);
    });
  });
});
