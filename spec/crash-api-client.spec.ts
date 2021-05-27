import { CrashApiClient } from "..";

describe('CrashApiClient', () => {
    const database = 'fred';
    const id = 100000;
    let client: CrashApiClient;
    let fakeBugSplatApiClient;
    let fakeFormData;
    let fakeResponse;
    let result;

    beforeEach(async () => {
        fakeFormData = jasmine.createSpyObj('FormData', ['append']);
        fakeResponse = { status: 9001 };
        fakeBugSplatApiClient = jasmine.createSpyObj('BugSplatApiClient', [
            'createFormData',
            'fetch'
        ]);
        fakeBugSplatApiClient.createFormData.and.returnValue(fakeFormData);
        fakeBugSplatApiClient.fetch.and.returnValue(Promise.resolve(fakeResponse));
        client = new CrashApiClient(fakeBugSplatApiClient);

        result = await client.getCrashById(database, id);
    });

    describe('getCrashById', () => {
        it('should call fetch with correct route', () => {
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith('/api/crash/data.php', jasmine.anything());
        });

        it('should call fetch with formData containing database and id', () => {
            expect(fakeFormData.append).toHaveBeenCalledWith('database', database);
            expect(fakeFormData.append).toHaveBeenCalledWith('id', id.toString());
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                jasmine.any(String),
                jasmine.objectContaining({
                    method: 'POST',
                    body: fakeFormData,
                    cache: 'no-cache',
                    credentials: 'include',
                    redirect: 'follow'
                })
            );
        });

        it('should return response', () => {
            expect(result).toEqual(fakeResponse);
        });
    });
});