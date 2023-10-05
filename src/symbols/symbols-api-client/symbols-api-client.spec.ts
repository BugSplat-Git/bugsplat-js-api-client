import { SymbolsApiClient } from './symbols-api-client';

describe('SymbolsApiClient', () => {
    const database = 'fred';
    const application = 'my-js-crasher';
    const version = '1.0.0';
    const url = 'https://newayz.net';
    let fakeFormData;
    let fakeBugSplatApiClient;
    let fakeSuccessResponse;
    let fakeS3ApiClient;

    let symbolsApiClient: SymbolsApiClient;

    beforeEach(() => {
        // TODO BG
    });

    describe('postSymbols', () => {
        // TODO BG
        // let files;
        // let result;
        // let timer;

        // beforeEach(async () => {
        //     files = [{
        //         name: '📄.sym',
        //         size: 1337
        //     }];
        //     timer = jasmine.createSpy();
        //     timer.and.returnValue(of(0));
        //     (<any>versionsApiClient)._timer = timer;

        //     result = await versionsApiClient.postSymbols(
        //         database,
        //         application,
        //         version,
        //         files
        //     );
        // });

        // it('should append dbName, appName, appVersion, size and symFileName to FormData', () => {
        //     expect(fakeFormData.append).toHaveBeenCalledWith('database', database);
        //     expect(fakeFormData.append).toHaveBeenCalledWith('appName', application);
        //     expect(fakeFormData.append).toHaveBeenCalledWith('appVersion', version);
        //     expect(fakeFormData.append).toHaveBeenCalledWith('size', files[0].size.toString());
        //     expect(fakeFormData.append).toHaveBeenCalledWith('symFileName', path.basename(files[0].name));
        // });

        // it('should call fetch with correct route', () => {
        //     expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
        //         '/api/versions',
        //         jasmine.anything()
        //     );
        // });

        // it('should call fetch with method POST, formData and include credentials', () => {
        //     expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
        //         jasmine.anything(),
        //         jasmine.objectContaining({
        //             method: 'POST',
        //             credentials: 'include',
        //             body: fakeFormData
        //         })
        //     );
        // });

        // it('should call uploadFileToPresignedUrl with url, and file', () => {
        //     expect(fakeS3ApiClient.uploadFileToPresignedUrl).toHaveBeenCalledWith(url, files[0]);
        // });

        // it('should sleep between requests', () => {
        //     expect((<any>versionsApiClient)._timer).toHaveBeenCalledWith(1000);
        // });

        // it('should return response', () => {
        //     expect(result).toEqual(
        //         jasmine.arrayContaining([fakeSuccessResponse])
        //     );
        // });

        // describe('error', () => {
        //     it('should throw if error with invalid credentials message if status is 403', async () => {
        //         const fakeErrorResponse = createFakeResponseBody(403);
        //         fakeBugSplatApiClient.fetch.and.resolveTo(fakeErrorResponse);

        //         await expectAsync(versionsApiClient.postSymbols(
        //             database,
        //             application,
        //             version,
        //             files
        //         )).toBeRejectedWithError('Error getting presigned URL, invalid credentials');
        //     });
            
        //     it('should throw if response status is not 200, or 403', async () => {
        //         const fakeErrorResponse = createFakeResponseBody(400);
        //         fakeBugSplatApiClient.fetch.and.resolveTo(fakeErrorResponse);

        //         await expectAsync(versionsApiClient.postSymbols(
        //             database,
        //             application,
        //             version,
        //             files
        //         )).toBeRejectedWithError(`Error getting presigned URL for ${files[0].name}`);
        //     });

        //     it('should throw if response json Status is \'Failed\'', async () => {
        //         const message = '🥱';
        //         const fakeErrorResponse = createFakeResponseBody(200, { Status: 'Failed', Error: message });
        //         fakeBugSplatApiClient.fetch.and.resolveTo(fakeErrorResponse);

        //         await expectAsync(versionsApiClient.postSymbols(
        //             database,
        //             application,
        //             version,
        //             files
        //         )).toBeRejectedWithError(message);
        //     });
        // });
    });
});