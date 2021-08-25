
import path from 'path';
import { createFakeBugSplatApiClient } from '../../../spec/fakes/common/bugsplat-api-client';
import { createFakeFormData } from '../../../spec/fakes/common/form-data';
import { createFakeResponseBody } from '../../../spec/fakes/common/response';
import { SymbolsApiClient } from './symbols-api-client';
import * as S3ApiClientModule from '../s3-api-client/s3-api-client';
import { of } from 'rxjs';

describe('SymbolsApiClient', () => {
    const database = 'fred';
    const application = 'my-js-crasher';
    const version = '1.0.0';
    const url = 'https://newayz.net';
    let fakeFormData;
    let fakeBugSplatApiClient;
    let fakeSuccessResponse;

    let symbolsApiClient: SymbolsApiClient;

    beforeEach(() => {
        fakeFormData = createFakeFormData();
        fakeSuccessResponse = createFakeResponseBody(200, { url });
        fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeSuccessResponse);

        symbolsApiClient = new SymbolsApiClient(fakeBugSplatApiClient);
    })
    describe('delete', () => {
        let result;

        beforeEach(async () => {
            result = await symbolsApiClient.delete(
                database,
                application,
                version
            );
        });

        it('should call fetch with route containing database, application and version', () => {
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                `/api/symbols?dbName=${database}&appName=${application}&appVersion=${version}`,
                jasmine.anything()
            );
        });

        it('should call fetch with init containing method DELETE and credentials include', () => {
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.objectContaining({
                    method: 'DELETE',
                    credentials: 'include'
                })
            );
        });

        it('should return response', () => {
            expect(result).toEqual(fakeSuccessResponse);
        });

        describe('error', () => {
            it('should throw if response status is not 200', async () => {
                const fakeErrorResponse = createFakeResponseBody(400);
                fakeBugSplatApiClient.fetch.and.resolveTo(fakeErrorResponse);

                await expectAsync(symbolsApiClient.delete(
                    database,
                    application,
                    version
                )).toBeRejectedWithError(`Error deleting symbols for ${database}-${application}-${version} status 400`);
            });

            it('should throw if response json Status is \'Failed\'', async () => {
                const message = '💩';
                const fakeErroResponse = createFakeResponseBody(200, { Status: 'Failed', Error: message });
                fakeBugSplatApiClient.fetch.and.resolveTo(fakeErroResponse);

                await expectAsync(symbolsApiClient.delete(
                    database,
                    application,
                    version
                )).toBeRejectedWithError(message);
            });
        });

        describe('post', () => {
            let fakeS3ApiClient;
            let files;
            let result;
            let timer;

            beforeEach(async () => {
                files = [{
                    name: '📄.sym',
                    size: 1337
                }];
                timer = jasmine.createSpy();
                timer.and.returnValue(of(0));
                (<any>symbolsApiClient)._timer = timer;

                fakeS3ApiClient = jasmine.createSpyObj('S3ApiClient', ['uploadFileToPresignedUrl']);
                fakeS3ApiClient.uploadFileToPresignedUrl.and.resolveTo(fakeSuccessResponse);
                spyOn(S3ApiClientModule, 'S3ApiClient').and.returnValue(fakeS3ApiClient);

                result = await symbolsApiClient.post(
                    database,
                    application,
                    version,
                    files
                );
            });

            it('should append dbName, appName, appVersion, size and symFileName to FormData', () => {
                expect(fakeFormData.append).toHaveBeenCalledWith('dbName', database);
                expect(fakeFormData.append).toHaveBeenCalledWith('appName', application);
                expect(fakeFormData.append).toHaveBeenCalledWith('appVersion', version);
                expect(fakeFormData.append).toHaveBeenCalledWith('size', files[0].size.toString());
                expect(fakeFormData.append).toHaveBeenCalledWith('symFileName', path.basename(files[0].name));
            });

            it('should call fetch with correct route', () => {
                expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                    `/api/symbols`,
                    jasmine.anything()
                );
            });

            it('should call fetch with method POST, formData and include credentials', () => {
                expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                    jasmine.anything(),
                    jasmine.objectContaining({
                        method: 'POST',
                        credentials: 'include',
                        body: fakeFormData
                    })
                );
            });

            it('should call uploadFileToPresignedUrl with url, file and size', () => {
                expect(fakeS3ApiClient.uploadFileToPresignedUrl).toHaveBeenCalledWith(url, files[0].file, files[0].size);
            });

            it('should sleep between requests', () => {
                expect((<any>symbolsApiClient)._timer).toHaveBeenCalledWith(1000);
            });

            it('should return response', () => {
                expect(result).toEqual(
                    jasmine.arrayContaining([fakeSuccessResponse])
                );
            });

            describe('error', () => {
                it('should throw if response status is not 200', async () => {
                    const fakeErrorResponse = createFakeResponseBody(400);
                    fakeBugSplatApiClient.fetch.and.resolveTo(fakeErrorResponse);

                    await expectAsync(symbolsApiClient.post(
                        database,
                        application,
                        version,
                        files
                    )).toBeRejectedWithError(`Error getting presignedUrl for ${files[0].name}`);
                });

                it('should throw if response json Status is \'Failed\'', async () => {
                    const message = '🥱';
                    const fakeErrorResponse = createFakeResponseBody(200, { Status: 'Failed', Error: message });
                    fakeBugSplatApiClient.fetch.and.resolveTo(fakeErrorResponse);

                    await expectAsync(symbolsApiClient.post(
                        database,
                        application,
                        version,
                        files
                    )).toBeRejectedWithError(message);
                });
            });
        });
    });
});