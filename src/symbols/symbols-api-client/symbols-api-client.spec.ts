import { ApiClient } from '@common';
import { createFakeBugSplatApiClient } from '@spec/fakes/common/bugsplat-api-client';
import { createFakeFormData } from '@spec/fakes/common/form-data';
import { createFakeResponseBody } from '@spec/fakes/common/response';
import { SymbolsApiClient } from './symbols-api-client';

describe('SymbolsApiClient', () => {
    const database = 'database';
    const application = 'application';
    const version = 'version';

    let files;
    let fakeFormData;
    let fakeFile;
    let fakeCheckStream;
    let fakeUntouchedStream;
    let fakeUploadResponse;
    let fakeTimer;
    let url;

    let apiClient: jasmine.SpyObj<ApiClient>;
    let symbolsApiClient: SymbolsApiClient;

    beforeEach(() => {
        fakeCheckStream = createFakeStream(new Uint8Array([0x1f, 0x8b]), false);
        fakeUntouchedStream = createFakeStream(new Uint8Array([0xde, 0xad, 0xbe, 0xef]), false);
        fakeFile = createFakeFile(fakeCheckStream, fakeUntouchedStream);
        fakeFormData = createFakeFormData();
        files = [{ file: fakeFile }];
        url = 'https://presigned.url';
        
        const fakePresignedUrlResponse = createFakeResponseBody(200, { url });
        apiClient = createFakeBugSplatApiClient(fakeFormData, fakePresignedUrlResponse);
        symbolsApiClient = new SymbolsApiClient(apiClient);

        fakeTimer = jasmine.createSpy('timer');
        fakeTimer.and.resolveTo(0);
        fakeUploadResponse = createFakeResponseBody(200, { Status: 'Success' });
        (symbolsApiClient as any)._s3ApiClient = jasmine.createSpyObj('S3ApiClient', ['uploadFileToPresignedUrl']);
        (symbolsApiClient as any)._s3ApiClient.uploadFileToPresignedUrl.and.resolveTo(fakeUploadResponse);
        (symbolsApiClient as any)._timer = fakeTimer;
    });

    describe('postSymbols', () => {
        it('should throw if stream can\'t be read', async () => {
            fakeCheckStream = createFakeStream(new Uint8Array([]), true);
            fakeFile = createFakeFile(fakeCheckStream, fakeUntouchedStream);
            files = [{ file: fakeFile }];

            return expectAsync(symbolsApiClient.postSymbols(database, application, version, files)).toBeRejectedWithError(/Could not read symbol file/);
        });

        it('should throw if stream does not start with gzip magic bytes', () => {
            fakeCheckStream = createFakeStream(new Uint8Array([]), false);
            fakeFile = createFakeFile(fakeCheckStream, fakeUntouchedStream);
            files = [{ file: fakeFile }];

            return expectAsync(symbolsApiClient.postSymbols(database, application, version, files)).toBeRejectedWithError(/is not a gzipped stream/);
        });

        it('should set file to untouched stream to prevent locking', async () => {
            await symbolsApiClient.postSymbols(database, application, version, files);

            expect(files[0].file).toBe(fakeUntouchedStream);
        });

        it('should get presigned url', async () => {
            await symbolsApiClient.postSymbols(database, application, version, files);

            expect(apiClient.fetch).toHaveBeenCalledWith(
                '/symsrv/uploadUrl',
                jasmine.objectContaining({
                    method: 'POST',
                    body: fakeFormData
                })
            );
        });

        it('should upload file to presigned url', async () => {
            await symbolsApiClient.postSymbols(database, application, version, files);

            expect((symbolsApiClient as any)._s3ApiClient.uploadFileToPresignedUrl).toHaveBeenCalledWith(
                url,
                jasmine.objectContaining({
                    file: fakeUntouchedStream
                }),
                jasmine.objectContaining({
                    'content-encoding': 'gzip'
                })
            );
        });

        it('should complete upload', async () => {
            await symbolsApiClient.postSymbols(database, application, version, files);

            expect(apiClient.fetch).toHaveBeenCalledWith(
                '/symsrv/uploadComplete',
                jasmine.objectContaining({
                    method: 'POST',
                    body: fakeFormData
                })
            );
        });

        it('should wait 1 second between requests', async () => {
            await symbolsApiClient.postSymbols(database, application, version, files);

            expect(fakeTimer).toHaveBeenCalledWith(1000);
        });

        it('should return upload response', async () => {
            const result = await symbolsApiClient.postSymbols(database, application, version, files);

            expect(result).toEqual([fakeUploadResponse]);
        });
    });
});

function createFakeStream(value: any, done: boolean) {
    return {
        getReader: () => ({
            read: () => Promise.resolve({ value, done })
        })
    };
}

function createFakeFile(checkStream, untouchedStream) {
    return {
        tee: () => [checkStream, untouchedStream]
    };
}