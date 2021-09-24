import { ApiDataFilter, ApiDataFilterGroup, OrderFilter } from '@common';
import { TableDataFormDataBuilder } from './table-data-form-data-builder';

describe('TableDataFormDataBuilder', () => {
  let fakeFormData;
  let formDataFactory;

  beforeEach(() => {
    fakeFormData = new FakeFormData();
    formDataFactory = () => fakeFormData;
  });

  it('should return formData with formParts', () => {
    const stackKeyId = '1111111111';
    const formParts = {
      stackKeyId: stackKeyId
    };
    const result = <FakeFormData><unknown>new TableDataFormDataBuilder(formDataFactory, formParts).build();

    expect(result.get('stackKeyId')).toEqual(stackKeyId);
  });

  describe('withFilters', () => {
    let filter0;
    let filter1;
    let filter2;

    beforeEach(() => {
      filter0 = new ApiDataFilter(
        'The filteriest of the filtered filters',
        'THE MOST IMPORTANT VALUE IN THE UNIVERSE',
        'The columniest columnar evarrrrrrr',
      );

      filter1 = new ApiDataFilter(
        'You\'re FILTERED',
        'this value is also amazing. It is the best value. Everyone says it.',
        'filter tower'
      );

      filter2 = new ApiDataFilter(
        'You shall be FILTERED',
        'this value is amazing. It is the best value. Everyone says it.',
        'I like greek style columns'
      );
    });

    it('should build formData with filtergroup, filterValues, filterConditions, filterOperators and filterDataFields', () => {
      const filterGroup0 = ApiDataFilterGroup.fromApiTableFilter(filter0);
      const filterGroup1 = new ApiDataFilterGroup([filter1, filter2]);
      const result = <FakeFormData><unknown>new TableDataFormDataBuilder(formDataFactory)
        .withFilterGroups([filterGroup0, filterGroup1])
        .build();

      expect(result.get('filtergroupopen0')).toEqual('1');
      expect(result.get('filtervalue0')).toEqual(filter0.filterValue);
      expect(result.get('filtercondition0')).toEqual(filter0.filterCondition);
      expect(result.get('filteroperator0')).toEqual(filterGroup0.groupOperator.value);
      expect(result.get('filterdatafield0')).toEqual(filter0.filterDataField);
      expect(result.get('filtergroupclose0')).toEqual('1');
      expect(result.get('filtergroupopen1')).toEqual('1');
      expect(result.get('filtervalue1')).toEqual(filter1.filterValue);
      expect(result.get('filtercondition1')).toEqual(filter1.filterCondition);
      expect(result.get('filteroperator1')).toEqual(filterGroup1.groupOperator.value);
      expect(result.get('filterdatafield1')).toContain(filter1.filterDataField);
      expect(result.get('filtergroupclose1')).toEqual('0');
      expect(result.get('filtergroupopen2')).toEqual('0');
      expect(result.get('filtervalue2')).toEqual(filter2.filterValue);
      expect(result.get('filtercondition2')).toEqual(filter2.filterCondition);
      expect(result.get('filteroperator2')).toEqual(filterGroup1.filterOperator.value);
      expect(result.get('filterdatafield2')).toContain(filter2.filterDataField);
      expect(result.get('filtergroupclose2')).toEqual('1');
    });
  });

  describe('withPage', () => {
    it('should add page', () => {
      const page = 1111111111;

      const result = <FakeFormData><unknown>new TableDataFormDataBuilder(formDataFactory)
        .withPage(page)
        .build();

      expect(result.get('pagenum')).toEqual(`${page}`);
    });
  });

  describe('withPageSize', () => {
    it('should add pageSize', () => {
      const pageSize = 1111111111;

      const result = <FakeFormData><unknown>new TableDataFormDataBuilder(formDataFactory)
        .withPageSize(pageSize)
        .build();

      expect(result.get('pagesize')).toEqual(`${pageSize}`);
    });
  });

  describe('withSortColumn', () => {
    it('should not add sortColumn if sortColumn is falsy', () => {
      const sortColumn = '';

      const result = <FakeFormData><unknown>new TableDataFormDataBuilder(formDataFactory)
        .withSortColumn(sortColumn)
        .build();

      expect(result.has('sortdatafield')).toBeFalse();
    });

    it('should add sortColumn', () => {
      const sortColumn = 'The sortiest column evaaaaar';

      const result = <FakeFormData><unknown>new TableDataFormDataBuilder(formDataFactory)
        .withSortColumn(sortColumn)
        .build();

      expect(result.get('sortdatafield')).toEqual(sortColumn);
    });
  });

  describe('withSortOrder', () => {
    it('should add sortOrder', () => {
      const sortOrder = OrderFilter.ascending;
      const expectedSortOrder = 'asc';

      const result = <FakeFormData><unknown>new TableDataFormDataBuilder(formDataFactory)
        .withSortOrder(sortOrder)
        .build();

      expect(result.get('sortorder')).toEqual(expectedSortOrder);
    });

    it('should not add sortorder if sortOrder is none', () => {
      const sortOrder = OrderFilter.none;

      const result = <FakeFormData><unknown>new TableDataFormDataBuilder(formDataFactory)
        .withSortOrder(sortOrder)
        .build();

      expect(result.has('sortorder')).toBeFalse();
    });
  });

  describe('withDatabase', () => {
    it('should not add database if database is falsy', () => {
      const emptyDatabase = '';

      const result = <FakeFormData><unknown>new TableDataFormDataBuilder(formDataFactory)
        .withDatabase(emptyDatabase)
        .build();

      expect(result.has('database')).toBeFalse();
    });

    it('should add database', () => {
      const database = 'Tequila!';

      const result = <FakeFormData><unknown>new TableDataFormDataBuilder(formDataFactory)
        .withDatabase(database)
        .build();

      expect(result.get('database')).toContain(database);
    });
  });
});

class FakeFormData {
  private _entries: Array<Record<string, string>> = [];

  append(key: string, value: string): void {
    this._entries[key] = value;
  }

  get(key: string): string {
    return this._entries[key];
  }

  has(key: string): boolean {
    return !!this._entries[key];
  }
}