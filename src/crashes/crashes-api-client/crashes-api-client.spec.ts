import { CrashesApiClient } from '@crashes';
import { createFakeBugSplatApiClient } from '@spec/fakes/common/bugsplat-api-client';
import { createFakeFormData } from '@spec/fakes/common/form-data';
import { createFakeResponseBody } from '@spec/fakes/common/response';
import * as TableDataClientModule from '../../common/data/table-data/table-data-client/table-data-client';

describe('CrashesApiClient', () => {
  let sut: CrashesApiClient;

  let apiClient;
  let apiClientResponse;
  let database;
  let fakeFormData;
  let id;
  let pageData;
  let rows;
  let tableDataClient;
  let tableDataClientResponse;
  let Comments;
  let IpAddress;

  beforeEach(() => {
    fakeFormData = createFakeFormData();
    apiClientResponse = createFakeResponseBody(200);
    apiClient = createFakeBugSplatApiClient(fakeFormData, apiClientResponse);

    id = 9001;
    database = '☕️';
    Comments = 'it\'s over 9000!';
    IpAddress = '🏡';
    pageData = { coffee: 'black rifle' };
    rows = [{ id, Comments, IpAddress }];
    tableDataClientResponse = createFakeResponseBody(200, { pageData, rows });
    tableDataClient = jasmine.createSpyObj('TableDataClient', ['postGetData']);
    tableDataClient.postGetData.and.resolveTo(tableDataClientResponse);
    spyOn(TableDataClientModule, 'TableDataClient').and.returnValue(tableDataClient);

    sut = new CrashesApiClient(apiClient);
  });

  describe('getCrashes', () => {
    let result;
    let request;

    beforeEach(async () => {
      request = { database };
      result = await sut.getCrashes(request);
    });

    it('should call postGetData with request', () => {
      expect(tableDataClient.postGetData).toHaveBeenCalledWith(request);
    });

    it('should return value with Comments and IpAddress values mapped to lower-case', () => {
      expect(result.pageData).toEqual(pageData);
      expect(result.rows[0].id).toEqual(id);
      expect(result.rows[0].comments).toEqual(Comments);
      expect(result.rows[0].ipAddress).toEqual(IpAddress);
    });
  });
});
