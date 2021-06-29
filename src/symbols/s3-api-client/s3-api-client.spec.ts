import * as ExistsModule from '../exists';
import { S3ApiClient } from './s3-api-client';

describe('S3ApiClient', () => {
    describe('uploadFileToPresignedUrl', () => {
        let s3ApiClient;
        let fakeReadStream;
        let fakeSuccessResponse;
        
        beforeEach(() => {
            fakeReadStream = '🦦';
            fakeSuccessResponse = { status: 200 };
            spyOn(ExistsModule, 'exists').and.returnValue(true);
            s3ApiClient = new S3ApiClient();
            s3ApiClient._fs = jasmine.createSpyObj('fs', ['createReadStream']);
            s3ApiClient._fs.createReadStream.and.returnValue(fakeReadStream);
            s3ApiClient._fetch = jasmine.createSpy();
            s3ApiClient._fetch.and.resolveTo(fakeSuccessResponse);
        });

        it('should throw if file does not exist', async () => {
            const path = '/file/not/found';
            (<jasmine.Spy>ExistsModule.exists).and.returnValue(false);
            await expectAsync(s3ApiClient.uploadFileToPresignedUrl('url', path)).toBeRejectedWithError(`File does not exist at path: ${path}!`);
        });

        it('should call fetch with presignedUrl', async () => {
            const url = 'https://bugsplat.com';
            const path = '/some/fake/path';

            await s3ApiClient.uploadFileToPresignedUrl(url, path);

            expect(s3ApiClient._fetch).toHaveBeenCalledWith(url, jasmine.anything());
        });

        it('should call fetch with init containing method and headers', async () => {
            const url = 'https://bugsplat.com';
            const path = '/some/fake/path';
            const size = 1337;

            await s3ApiClient.uploadFileToPresignedUrl(url, path, size);

            expect(s3ApiClient._fetch).toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.objectContaining({
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/octet-stream',
                        'content-length': `${size}`
                    },
                    body: fakeReadStream
                })
            );
        });

        it('should return response', async () => {
            const url = 'https://bugsplat.com';
            const path = '/some/fake/path';
            const size = 1337;

            const response = await s3ApiClient.uploadFileToPresignedUrl(url, path, size);

            expect(response).toEqual(fakeSuccessResponse);
        });

        describe('error', () => {
            it('should throw if response status is not 200', async () => {
                const url = 'https://bugsplat.com';
                const path = '/some/fake/path';
                const size = 1337;
                s3ApiClient._fetch.and.resolveTo({ status: 500 });

                await expectAsync(s3ApiClient.uploadFileToPresignedUrl(url, path, size)).toBeRejectedWithError(`Error uploading ${path} to presignedUrl`);
            });
        });
    });
});