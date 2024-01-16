import { createFakeBugSplatApiClient } from '@spec/fakes/common/bugsplat-api-client';
import { createFakeFormData } from '@spec/fakes/common/form-data';
import { createFakeResponseBody } from '@spec/fakes/common/response';
import * as TableDataClientModule from '../../common/data/table-data/table-data-client/table-data-client';
import { UsersApiClient } from './users-api-client';

describe('SummaryApiClient', () => {
    let sut: UsersApiClient;

    let apiClient;
    let apiClientResponse;
    let database;
    let fakeFormData;
    let pageData;
    let rows;
    let tableDataClient;
    let tableDataClientResponse;
    let lastLogin;
    let Restricted;
    let uId;
    let username;

    beforeEach(() => {
        fakeFormData = createFakeFormData();
        apiClientResponse = createFakeResponseBody(200);
        apiClient = createFakeBugSplatApiClient(fakeFormData, apiClientResponse);

        database = '☕️';
        Restricted = '1';
        uId = '7';
        username = 'bobby@bugsplat.com';
        lastLogin = '2018-12-09 11:31:51';
        pageData = { coffee: 'black rifle' };
        rows = [{ Restricted, uId, username, lastLogin }];
        tableDataClientResponse = createFakeResponseBody(200, { pageData, rows });
        tableDataClient = jasmine.createSpyObj('TableDataClient', ['postGetData']);
        tableDataClient.postGetData.and.resolveTo(tableDataClientResponse);
        spyOn(TableDataClientModule, 'TableDataClient').and.returnValue(tableDataClient);

        sut = new UsersApiClient(apiClient);
    });

    describe('getUsers', () => {
        let result;
        let request;

        beforeEach(async () => {
            request = { database };
            result = await sut.getUsers(request);
        });

        it('should call postGetData with request', () => {
            expect(tableDataClient.postGetData).toHaveBeenCalledWith(request);
        });

        it('should return value with Restricted mapped to lower-case, and strings converted to numbers', () => {
            expect(result.pageData).toEqual(pageData);
            expect(result.rows[0].uId).toEqual(Number(uId));
            expect(result.rows[0].lastLogin).toEqual(lastLogin);
            expect(result.rows[0].username).toEqual(username);
            expect(result.rows[0].restricted).toEqual(Boolean(Number(Restricted)));
        });
    });
});