import { S3ApiClient } from './s3-api-client';

describe('S3ApiClient', () => {
    describe('uploadFileToPresignedUrl', () => {
        let s3ApiClient: S3ApiClient;
        let fakeSuccessResponse;
        
        beforeEach(() => {
            fakeSuccessResponse = { status: 200 };
            s3ApiClient = new S3ApiClient();
            (s3ApiClient as any)._fetch = jasmine.createSpy();
            (s3ApiClient as any)._fetch.and.resolveTo(fakeSuccessResponse);
        });

        it('should call fetch with presignedUrl', async () => {
            const url = 'https://bugsplat.com';
            const file = { name: '🐛.txt', size: 1 } as any;

            await s3ApiClient.uploadFileToPresignedUrl(url, file);

            expect((s3ApiClient as any)._fetch).toHaveBeenCalledWith(url, jasmine.anything());
        });

        it('should call fetch with init containing method and headers', async () => {
            const url = 'https://bugsplat.com';
            const name = '🐛.txt';
            const size = 1337;
            const file = { name, size, file: name } as any;

            await s3ApiClient.uploadFileToPresignedUrl(url, file);

            expect((s3ApiClient as any)._fetch).toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.objectContaining({
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/octet-stream',
                        'content-length': `${size}`
                    },
                    body: file.file
                })
            );
        });

        it('should call fetch with additionalHeaders', async () => {
            const url = 'https://bugsplat.com';
            const name = '🐛.txt';
            const size = 1337;
            const file = { name, size, file: name } as any;
            const additionalHeaders = { 'content-encoding': 'gzip' };

            await s3ApiClient.uploadFileToPresignedUrl(url, file, additionalHeaders);

            expect((s3ApiClient as any)._fetch).toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.objectContaining({
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/octet-stream',
                        'content-length': `${size}`,
                        ...additionalHeaders
                    },
                    body: file.file
                })
            );
        });

        it('should return response', async () => {
            const url = 'https://bugsplat.com';
            const name = '🐛.txt';
            const size = 1337;
            const file = { name, size } as any;

            const response = await s3ApiClient.uploadFileToPresignedUrl(url, file);

            expect(response).toEqual(fakeSuccessResponse);
        });

        describe('error', () => {
            it('should throw if response status is not 200', async () => {
                const url = 'https://bugsplat.com';
                const name = '🐛.txt';
                const size = 1337;
                const file = { name, size } as any;
                (s3ApiClient as any)._fetch.and.resolveTo({ status: 500 });

                await expectAsync(s3ApiClient.uploadFileToPresignedUrl(url, file)).toBeRejectedWithError(`Error uploading to presigned URL ${url}`);
            });
        });
    });
});