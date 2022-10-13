import { createFakeBugSplatApiClient } from '@spec/fakes/common/bugsplat-api-client';
import { createFakeFormData } from '@spec/fakes/common/form-data';
import { createFakeResponseBody } from '@spec/fakes/common/response';
import * as SummaryTableDataClientModule from '../../summary/summary-api-client/summary-table-data-client';
import { SummaryApiClient } from './summary-api-client';

describe('SummaryApiClient', () => {
    let sut: SummaryApiClient;

    let apiClient;
    let apiClientResponse;
    let database;
    let fakeFormData;
    let pageData;
    let rows;
    let tableDataClient;
    let tableDataClientResponse;
    let stackKeyId;
    let subKeyDepth;
    let userSum;

    beforeEach(() => {
        fakeFormData = createFakeFormData();
        apiClientResponse = createFakeResponseBody(200);
        apiClient = createFakeBugSplatApiClient(fakeFormData, apiClientResponse);

        database = '☕️';
        stackKeyId = '9001';
        subKeyDepth = '7';
        userSum = '123';
        pageData = { coffee: 'black rifle' };
        rows = [{ stackKeyId, subKeyDepth, userSum }];
        tableDataClientResponse = createFakeResponseBody(200, { pageData, rows });
        tableDataClient = jasmine.createSpyObj('SummaryTableDataClient', ['postGetData']);
        tableDataClient.postGetData.and.resolveTo(tableDataClientResponse);
        spyOn(SummaryTableDataClientModule, 'SummaryTableDataClient').and.returnValue(tableDataClient);

        sut = new SummaryApiClient(apiClient);
    });

    describe('getSummary', () => {
        let result;
        let request;

        beforeEach(async () => {
            request = { database };
            result = await sut.getSummary(request);
        });

        it('should call postGetData with request', () => {
            expect(tableDataClient.postGetData).toHaveBeenCalledWith(request);
        });

        it('should return value with stackKeyId, subKeyDepth, and userSum values mapped to numbers', () => {
            expect(result.pageData).toEqual(pageData);
            expect(result.rows[0].stackKeyId).toEqual(Number(stackKeyId));
            expect(result.rows[0].subKeyDepth).toEqual(Number(subKeyDepth));
            expect(result.rows[0].userSum).toEqual(Number(userSum));
        });
    });
});