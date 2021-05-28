import { CrashApiClient } from '..';
import { createFakeSuccessResponseBody } from '../../../spec/fakes/response';

describe('CrashApiClient', () => {
    const database = 'fred';
    const id = 100000;
    const json = 'json!';
    let client: CrashApiClient;
    let fakeBugSplatApiClient;
    let fakeFormData;
    let result;

    beforeEach(async () => {
        const fakeResponse = createFakeSuccessResponseBody(200, json, []);
        fakeFormData = jasmine.createSpyObj('FormData', ['append']);
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

        it('should return response json', () => {
            expect(result).toEqual(json);
        });

        it('should throw if database is falsy', async () => {
            try {
                await client.getCrashById('', id);
                fail('getCrashById was supposed to throw!');
            } catch(error) {
                expect(error.message).toMatch(/to be a non white space string/);
            }
        });

        it('should throw if id is less than or equal to 0', async () => {
            try {
                await client.getCrashById(database, 0);
                fail('getCrashById was supposed to throw!');
            } catch(error) {
                expect(error.message).toMatch(/to be a positive non-zero number/);
            }
        });
    });
});