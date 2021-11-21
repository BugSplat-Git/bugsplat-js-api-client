import { CrashApiClient, CrashDetails } from '@crash';
import { createFakeBugSplatApiClient } from '@spec/fakes/common/bugsplat-api-client';
import { createFakeFormData } from '@spec/fakes/common/form-data';
import { createFakeResponseBody } from '@spec/fakes/common/response';
import { createFakeCrashApiResponse } from '@spec/fakes/crash/crash-api-response';

describe('CrashApiClient', () => {
    const database = 'fred';
    const id = 100000;
    let fakeFormData;

    beforeEach(() => {
        fakeFormData = createFakeFormData();
    });

    describe('getCrashById', () => {
        let client: CrashApiClient;
        let fakeBugSplatApiClient;
        let fakeCrashApiResponse;
        let result;

        beforeEach(async () => {
            fakeCrashApiResponse = createFakeCrashApiResponse();
            const fakeResponse = createFakeResponseBody(200, fakeCrashApiResponse);
            fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeResponse);
            client = new CrashApiClient(fakeBugSplatApiClient);

            result = await client.getCrashById(database, id);
        });

        it('should call fetch with correct route', () => {
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith('/api/crash/data', jasmine.anything());
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
            expect(result).toEqual(
                jasmine.objectContaining(new CrashDetails(fakeCrashApiResponse))
            );
        });

        it('should throw if status is not 200', async () => {
            const message = 'Bad requeset';

            try {
                const fakeReprocessErrorBody = { message };
                const fakeResponse = createFakeResponseBody(400, fakeReprocessErrorBody, false);
                const fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeResponse);
                const client = new CrashApiClient(fakeBugSplatApiClient);

                await client.getCrashById(database, id);
                fail('getCrashById was supposed to throw!');
            } catch (error: any) {
                expect(error.message).toEqual(message);
            }
        });

        it('should throw if database is falsy', async () => {
            try {
                await client.getCrashById('', id);
                fail('getCrashById was supposed to throw!');
            } catch (error: any) {
                expect(error.message).toMatch(/to be a non white space string/);
            }
        });

        it('should throw if crashId is less than or equal to 0', async () => {
            try {
                await client.getCrashById(database, 0);
                fail('getCrashById was supposed to throw!');
            } catch (error: any) {
                expect(error.message).toMatch(/to be a positive non-zero number/);
            }
        });
    });

    describe('reprocessCrash', () => {
        let client: CrashApiClient;
        let fakeReprocessApiResponse;
        let fakeBugSplatApiClient;
        let result;

        beforeEach(async () => {
            fakeReprocessApiResponse = { success: true };
            const fakeResponse = createFakeResponseBody(202, fakeReprocessApiResponse);
            fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeResponse);
            client = new CrashApiClient(fakeBugSplatApiClient);

            result = await client.reprocessCrash(database, id, true);
        });

        it('should call fetch with correct route', () => {
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith('/api/crash/reprocess', jasmine.anything());
        });

        it('should call fetch with formData containing database, id and force', () => {
            expect(fakeFormData.append).toHaveBeenCalledWith('database', database);
            expect(fakeFormData.append).toHaveBeenCalledWith('id', id.toString());
            expect(fakeFormData.append).toHaveBeenCalledWith('force', 'true');
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
            expect(result).toEqual(fakeReprocessApiResponse);
        });

        it('should throw if status is not 202', async () => {
            const message = 'Unprocessable entity';

            try {
                const fakeReprocessErrorBody = { message };
                const fakeResponse = createFakeResponseBody(422, fakeReprocessErrorBody, false);
                const fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeResponse);
                const client = new CrashApiClient(fakeBugSplatApiClient);

                await client.reprocessCrash(database, id);
                fail('reprocessCrash was supposed to throw!');
            } catch (error: any) {
                expect(error.message).toEqual(message);
            }
        });

        it('should throw if database is falsy', async () => {
            try {
                await client.reprocessCrash('', id);
                fail('reprocessCrash was supposed to throw!');
            } catch (error: any) {
                expect(error.message).toMatch(/to be a non white space string/);
            }
        });

        it('should throw if crashId is less than or equal to 0', async () => {
            try {
                await client.reprocessCrash(database, 0);
                fail('reprocessCrash was supposed to throw!');
            } catch (error: any) {
                expect(error.message).toMatch(/to be a positive non-zero number/);
            }
        });
    });
});