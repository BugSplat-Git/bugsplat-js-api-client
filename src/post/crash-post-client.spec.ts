import { Environment, UploadableFile } from '@common';
import { CrashPostClient, CrashType } from '@post';
import { createFakeBugSplatApiClient } from '@spec/fakes/common/bugsplat-api-client';
import { createFakeFormData } from '@spec/fakes/common/form-data';
import { createFakeResponseBody } from '@spec/fakes/common/response';
import * as BugSplatApiClientModule from '../common/client/bugsplat-api-client/bugsplat-api-client';
import * as S3ApiClientModule from '../common/client/s3-api-client/s3-api-client';

describe('CrashPostClient', () => {
    let sut: CrashPostClient;

    let bugsplatApiClient;
    let fakeFormData;
    let fakeCommitS3UploadResponse;
    let fakeGetUploadUrlResponse;
    let s3ApiClient;

    let application: string;
    let attributes: Record<string, string>;
    let database: string;
    let file: UploadableFile;
    let ipAddress: string;
    let type: CrashType;
    let url: string;
    let version: string;

    let result;

    beforeEach(() => {
        database = 'pumpkin';
        application = 'spice';
        attributes = {
            'test': 'test'
        };
        file = { name: 'pumpkin-spice-latte-recipe.txt', file: '🎃🌶☕️' as any, size: 100 };
        ipAddress = '127.0.0.1';
        type = CrashType.native;
        url = 'https://cassies.coffee/yum';
        version = 'latte';

        fakeFormData = createFakeFormData();
        fakeCommitS3UploadResponse = createFakeResponseBody(200);
        fakeGetUploadUrlResponse = createFakeResponseBody(200, { url });
        bugsplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeGetUploadUrlResponse);
        bugsplatApiClient.fetch.and.returnValues(
            Promise.resolve(fakeGetUploadUrlResponse),
            Promise.resolve(fakeCommitS3UploadResponse)
        );
        spyOn(BugSplatApiClientModule, 'BugSplatApiClient').and.returnValue(bugsplatApiClient);

        s3ApiClient = jasmine.createSpyObj('S3ApiClient', ['uploadFileToPresignedUrl']);
        s3ApiClient.uploadFileToPresignedUrl.and.resolveTo(); 
        spyOn(S3ApiClientModule, 'S3ApiClient').and.returnValue(s3ApiClient);

        sut = new CrashPostClient(database, Environment.Node, ipAddress);
    });

    describe('postCrash', () => {
        beforeEach(async () => {
            result = await sut.postCrash(
                application,
                version,
                type,
                file,
                attributes
            );
        });

        it('should call fetch with getCrashUploadUrl route to get presignedUrl for crash upload', () => {
            const presignedUrl = `api/getCrashUploadUrl?database=${database}&appName=${application}&appVersion=${version}&crashPostSize=${file.size}`;
            expect(bugsplatApiClient.fetch).toHaveBeenCalledWith(presignedUrl);
        });

        it('should call uploadFileToPresignedUrl with uploadUrl, and file', () => {
            expect(s3ApiClient.uploadFileToPresignedUrl).toHaveBeenCalledWith(url, file);
        });

        it('should call fetch with commitS3CrashUpload route and formData containing correct properties', () => {
            expect(fakeFormData.append).toHaveBeenCalledWith('database', database);
            expect(fakeFormData.append).toHaveBeenCalledWith('appName', application);
            expect(fakeFormData.append).toHaveBeenCalledWith('appVersion', version);
            expect(fakeFormData.append).toHaveBeenCalledWith('crashType', type.name);
            expect(fakeFormData.append).toHaveBeenCalledWith('crashTypeId', `${type.id}`);
            expect(fakeFormData.append).toHaveBeenCalledWith('s3key', url);
            expect(fakeFormData.append).toHaveBeenCalledWith('attributes', JSON.stringify(attributes));
            expect(bugsplatApiClient.fetch).toHaveBeenCalledWith(
                '/api/commitS3CrashUpload',
                jasmine.objectContaining({
                    method: 'POST',
                    body: fakeFormData
                })
            );
        });

        it('should return result', () => {
            expect(result).toEqual(fakeCommitS3UploadResponse);
        });
    });
});