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
            const file = '🐛.txt' as any;

            await s3ApiClient.uploadFileToPresignedUrl(url, file, 1);

            expect((s3ApiClient as any)._fetch).toHaveBeenCalledWith(url, jasmine.anything());
        });

        it('should call fetch with init containing method and headers', async () => {
            const url = 'https://bugsplat.com';
            const file = '🐛.txt' as any;
            const size = 1337;

            await s3ApiClient.uploadFileToPresignedUrl(url, file, size);

            expect((s3ApiClient as any)._fetch).toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.objectContaining({
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/octet-stream',
                        'content-length': `${size}`
                    },
                    body: file
                })
            );
        });

        it('should return response', async () => {
            const url = 'https://bugsplat.com';
            const file = '🐛.txt' as any;
            const size = 1337;

            const response = await s3ApiClient.uploadFileToPresignedUrl(url, file, size);

            expect(response).toEqual(fakeSuccessResponse);
        });

        describe('error', () => {
            it('should throw if response status is not 200', async () => {
                const url = 'https://bugsplat.com';
                const file = '🐛.txt' as any;
                const size = 1337;
                (s3ApiClient as any)._fetch.and.resolveTo({ status: 500 });

                await expectAsync(s3ApiClient.uploadFileToPresignedUrl(url, file, size)).toBeRejectedWithError(`Error uploading to presignedUrl ${url}`);
            });
        });
    });
});