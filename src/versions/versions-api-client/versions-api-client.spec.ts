import { createFakeBugSplatApiClient } from '@spec/fakes/common/bugsplat-api-client';
import { createFakeFormData } from '@spec/fakes/common/form-data';
import { createFakeResponseBody } from '@spec/fakes/common/response';
import { VersionsApiClient } from '@versions';
import path from 'path';
import * as S3ApiClientModule from '../../common/client/s3-api-client/s3-api-client';
import * as TableDataClientModule from '../../common/data/table-data/table-data-client/table-data-client';
import { VersionsApiRow } from '../versions-api-row/versions-api-row';

describe('VersionsApiClient', () => {
    const database = 'fred';
    const application = 'my-js-crasher';
    const version = '1.0.0';
    const url = 'https://newayz.net';
    let fakeFormData;
    let fakeBugSplatApiClient;
    let fakeSuccessResponse;
    let fakeS3ApiClient;
    let rows;
    let tableDataClient;
    let tableDataClientResponse;

    let versionsApiClient: VersionsApiClient;

    beforeEach(() => {
        fakeFormData = createFakeFormData();
        fakeSuccessResponse = createFakeResponseBody(200, { url });
        fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeSuccessResponse);

        fakeS3ApiClient = jasmine.createSpyObj('S3ApiClient', ['uploadFileToPresignedUrl']);
        fakeS3ApiClient.uploadFileToPresignedUrl.and.resolveTo(fakeSuccessResponse);
        spyOn(S3ApiClientModule, 'S3ApiClient').and.returnValue(fakeS3ApiClient);

        rows = [
            {
                symbolId: '163434',
                appName: 'myConsoleCrasher',
                version: '2022.4.20.0',
                size: '14.6255',
                lastUpdate: '2022-04-20T14:20:14Z',
                lastReport: '2022-04-20T14:20:14Z',
                firstReport: '2022-04-20T02:06:31Z',
                reportsPerDay: null,
                fullDumps: '0',
                rejectedCount: '0',
                retired: '0'
            },
        ];
        tableDataClientResponse = createFakeResponseBody(200, { rows });
        tableDataClient = jasmine.createSpyObj('TableDataClient', ['getData']);
        tableDataClient.getData.and.resolveTo(tableDataClientResponse);
        spyOn(TableDataClientModule, 'TableDataClient').and.returnValue(tableDataClient);

        versionsApiClient = new VersionsApiClient(fakeBugSplatApiClient);
    });

    describe('getVersions', () => {
        let result;

        beforeEach(async () => result = await versionsApiClient.getVersions({ database }));

        it('should call getData with request', () => {
            expect(tableDataClient.getData).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    database
                })
            );
        });

        it('should return result mapped to VersionsApiRows', () => {
            expect(result.rows).toEqual(
                jasmine.arrayContaining([
                    new VersionsApiRow(rows[0])
                ])
            );
        });
    });

    describe('deleteVersions', () => {
        it('should call delete with route containing database and appVersions', async () => {
            const appVersions = [
                { application: 'myConsoleCrasher', version: '2022.4.20.0' },
                { application: 'myConsoleCrasher', version: '2022.4.20.1' }
            ];
            await versionsApiClient.deleteVersions(database, appVersions);

            const appVersionsParam = [
                appVersions[0].application,
                appVersions[0].version,
                appVersions[1].application,
                appVersions[1].version
            ].map(encodeURIComponent).join(',');
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                `/api/v2/versions?database=${encodeURIComponent(database)}&appVersions=${appVersionsParam}`,
                jasmine.anything()
            );
        });

        it('should properly encode appVersions with special characters like plus signs', async () => {
            const appVersions = [
                { application: 'myApp', version: '1.0.0+build.123' },
                { application: 'myApp', version: '2.0.0+beta' }
            ];
            await versionsApiClient.deleteVersions(database, appVersions);

            const appVersionsParam = [
                appVersions[0].application,
                appVersions[0].version,
                appVersions[1].application,
                appVersions[1].version
            ].map(encodeURIComponent).join(',');
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                `/api/v2/versions?database=${encodeURIComponent(database)}&appVersions=${appVersionsParam}`,
                jasmine.anything()
            );
            // Verify the plus signs are encoded as %2B, not left as + (which would be decoded as space)
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                jasmine.stringContaining('1.0.0%2Bbuild.123'),
                jasmine.anything()
            );
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                jasmine.stringContaining('2.0.0%2Bbeta'),
                jasmine.anything()
            );
        });

        describe('error', () => {
            it('should throw if response is not 200', async () => {
                const fakeErrorResponse = createFakeResponseBody(400);
                fakeBugSplatApiClient.fetch.and.resolveTo(fakeErrorResponse);

                await expectAsync(versionsApiClient.deleteVersions(database, [])).toBeRejectedWithError(`Error deleting symbols for ${database}- status 400`);
            });

            it('should throw if response json Status is \'Failed\'', async () => {
                const message = '🤮';
                const fakeErrorResponse = createFakeResponseBody(200, { Status: 'Failed', Error: message });
                fakeBugSplatApiClient.fetch.and.resolveTo(fakeErrorResponse);

                await expectAsync(versionsApiClient.deleteVersions(database, [])).toBeRejectedWithError(message);
            });
        });
    });

    describe('putFullDumps', () => {
        const fullDumps = true;
        let result;

        beforeEach(async () => result = await versionsApiClient.putFullDumps(database, application, version, fullDumps));

        it('should call fetch with route containing database, application, version, and fullDumps', () => {
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                `/api/v2/versions?database=${encodeURIComponent(database)}&appName=${encodeURIComponent(application)}&appVersion=${encodeURIComponent(version)}&fullDumps=${encodeURIComponent(fullDumps ? '1' : '0')}`,
                jasmine.anything()
            );
        });

        it('should call fetch with init containing method PUT', () => {
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.objectContaining({
                    method: 'PUT'
                })
            );
        });

        it('should return result', () => {
            expect(result).toEqual(fakeSuccessResponse);
        });
    });


    describe('putRetired', () => {
        const retired = false;
        let result;

        beforeEach(async () => result = await versionsApiClient.putRetired(database, application, version, retired));

        it('should call fetch with route containing database, application, version, and fullDumps', () => {
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                `/api/v2/versions?database=${encodeURIComponent(database)}&appName=${encodeURIComponent(application)}&appVersion=${encodeURIComponent(version)}&retired=${encodeURIComponent(retired ? '1' : '0')}`,
                jasmine.anything()
            );
        });

        it('should call fetch with init containing method PUT', () => {
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.objectContaining({
                    method: 'PUT'
                })
            );
        });

        it('should return result', () => {
            expect(result).toEqual(fakeSuccessResponse);
        });
    });
    describe('deleteSymbols', () => {
        let result;

        beforeEach(async () => {
            result = await versionsApiClient.deleteSymbols(
                database,
                application,
                version
            );
        });

        it('should call fetch with route containing database, application and version', () => {
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                `/api/v2/versions?database=${encodeURIComponent(database)}&appName=${encodeURIComponent(application)}&appVersion=${encodeURIComponent(version)}`,
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

                await expectAsync(versionsApiClient.deleteSymbols(
                    database,
                    application,
                    version
                )).toBeRejectedWithError(`Error deleting symbols for ${database}-${application}-${version} status 400`);
            });

            it('should throw if response json Status is \'Failed\'', async () => {
                const message = '💩';
                const fakeErroResponse = createFakeResponseBody(200, { Status: 'Failed', Error: message });
                fakeBugSplatApiClient.fetch.and.resolveTo(fakeErroResponse);

                await expectAsync(versionsApiClient.deleteSymbols(
                    database,
                    application,
                    version
                )).toBeRejectedWithError(message);
            });
        });
    });

    describe('postSymbols', () => {
        let files;
        let result;
        let timer;

        beforeEach(async () => {
            files = [{
                name: '📄.sym',
                size: 1337
            }];
            timer = jasmine.createSpy();
            timer.and.resolveTo(0);
            (versionsApiClient as any)._timer = timer;

            result = await versionsApiClient.postSymbols(
                database,
                application,
                version,
                files
            );
        });

        it('should append dbName, appName, appVersion, size and symFileName to FormData', () => {
            expect(fakeFormData.append).toHaveBeenCalledWith('database', database);
            expect(fakeFormData.append).toHaveBeenCalledWith('appName', application);
            expect(fakeFormData.append).toHaveBeenCalledWith('appVersion', version);
            expect(fakeFormData.append).toHaveBeenCalledWith('size', files[0].size.toString());
            expect(fakeFormData.append).toHaveBeenCalledWith('symFileName', path.basename(files[0].name));
        });

        it('should call fetch with correct route', () => {
            expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
                '/api/v2/versions',
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

        it('should call uploadFileToPresignedUrl with url, and file', () => {
            expect(fakeS3ApiClient.uploadFileToPresignedUrl).toHaveBeenCalledWith(url, files[0]);
        });

        it('should sleep between requests', () => {
            expect((versionsApiClient as any)._timer).toHaveBeenCalledWith(1000);
        });

        it('should return response', () => {
            expect(result).toEqual(
                jasmine.arrayContaining([fakeSuccessResponse])
            );
        });

        describe('error', () => {
            it('should throw if error with invalid credentials message if status is 403', async () => {
                const fakeErrorResponse = createFakeResponseBody(403);
                fakeBugSplatApiClient.fetch.and.resolveTo(fakeErrorResponse);

                await expectAsync(versionsApiClient.postSymbols(
                    database,
                    application,
                    version,
                    files
                )).toBeRejectedWithError('Error getting presigned URL, invalid credentials');
            });

            it('should throw if response status is not 200, or 403', async () => {
                const fakeErrorResponse = createFakeResponseBody(400);
                fakeBugSplatApiClient.fetch.and.resolveTo(fakeErrorResponse);

                await expectAsync(versionsApiClient.postSymbols(
                    database,
                    application,
                    version,
                    files
                )).toBeRejectedWithError(`Error getting presigned URL for ${files[0].name}`);
            });

            it('should throw if response json Status is \'Failed\'', async () => {
                const message = '🥱';
                const fakeErrorResponse = createFakeResponseBody(200, { Status: 'Failed', Error: message });
                fakeBugSplatApiClient.fetch.and.resolveTo(fakeErrorResponse);

                await expectAsync(versionsApiClient.postSymbols(
                    database,
                    application,
                    version,
                    files
                )).toBeRejectedWithError(message);
            });
        });
    });
});