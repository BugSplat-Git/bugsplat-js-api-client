import { CrashesApiClient } from './crashes-api-client';
import * as TableDataClientModule from '../../common/data/table-data/table-data-client/table-data-client';
import { createFakeBugSplatApiClient } from '../../../spec/fakes/common/bugsplat-api-client';
import { createFakeFormData } from '../../../spec/fakes/common/form-data';
import { createFakeResponseBody } from '../../../spec/fakes/common/response';


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
        tableDataClient = jasmine.createSpyObj('TableDataClient', ['getData']);
        tableDataClient.getData.and.resolveTo(tableDataClientResponse);
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

        it('should call getData with request', () => {
            expect(tableDataClient.getData).toHaveBeenCalledWith(request);
        });

        it('should return value with Comments and IpAddress values mapped to lower-case', () => {
            expect(result.pageData).toEqual(pageData);
            expect(result.rows[0].id).toEqual(id);
            expect(result.rows[0].comments).toEqual(Comments);
            expect(result.rows[0].ipAddress).toEqual(IpAddress);
        });
    });

    describe('postNotes', () => {
        let result;
        let notes;

        beforeEach(async () => {
            notes = 'bulletproof coffee';
            result = await sut.postNotes(database, id, notes);
        });

        it('should append, update true, database, id, and Comments to formData', () => {
            expect(fakeFormData.append).toHaveBeenCalledWith('update', 'true');
            expect(fakeFormData.append).toHaveBeenCalledWith('database', database);
            expect(fakeFormData.append).toHaveBeenCalledWith('id', `${id}`);
            expect(fakeFormData.append).toHaveBeenCalledWith('Comments', notes);
        });

        it('should call fetch with correct route', () => {
            expect(apiClient.fetch).toHaveBeenCalledWith('/allcrash?data', jasmine.anything());
        });

        it('should call fetch with requestInit containing formData', () => {
            expect(apiClient.fetch).toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.objectContaining({
                    method: 'POST',
                    body: fakeFormData,
                    cache: 'no-cache',
                    credentials: 'include',
                    redirect: 'follow'
                })
            );
        });

        it('should return result', () => {
            expect(result).toEqual(apiClientResponse);
        });
    });
});