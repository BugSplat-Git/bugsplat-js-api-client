import { BugSplatApiClient, Environment } from '@common';
import { createFakeResponseBody } from '@spec/fakes/common/response';

const fakeBugSplatHost = 'https://fake.bugsplat.com';

describe('BugSplatApiClient', () => {
    let client: BugSplatApiClient;
    let expectedStatus;
    let expectedJson;
    let fakeFormData;
    let fakeSuccessResponseBody;

    beforeEach(() => {
        expectedStatus = 'success';
        expectedJson = { success: 'true' };
        fakeFormData = { append: jasmine.createSpy(), toString: () => 'BugSplat rocks!' };
        fakeSuccessResponseBody = createFakeResponseBody(expectedStatus, expectedJson, true);
        client = createFakeBugSplatApiClient(
            Environment.Node,
            fakeSuccessResponseBody,
            fakeFormData
        );
    });

    describe('fetch', () => {
        const route = '/api/crash/details';
        let body;
        let headers;
        let init;
        let result;

        beforeEach(async () => {
            body = fakeFormData;
            headers = { woah: 'dude' };
            init = { body, headers, method: 'POST' };
            result = await client.fetch(route, init);
        });

        it('should call fetch with correct route', () => {
            expect((client as any)._fetch).toHaveBeenCalledWith(`${fakeBugSplatHost}${route}`, jasmine.anything());
        });

        describe('when environment is Browser', () => {
            it('should call fetch with include credentials in request init', async () => {
                client = createFakeBugSplatApiClient(
                    Environment.WebBrowser,
                    fakeSuccessResponseBody,
                    fakeFormData
                );

                await client.fetch(route, init);

                expect((client as any)._fetch).toHaveBeenCalledWith(
                    jasmine.any(String),
                    jasmine.objectContaining({
                        body,
                        credentials: 'include'
                    })
                );
            });
        });

        describe('when environment is Node', () => {
            it('should call fetch with the provided request init', () => {
                expect((client as any)._fetch).toHaveBeenCalledWith(
                    jasmine.any(String),
                    jasmine.objectContaining({
                        body,
                        headers
                    })
                );
            });
        });

        it('should return result', async () => {
            const expectedJson = await fakeSuccessResponseBody.json();
            const resultJson = await result.json();
            expect(resultJson).toEqual(jasmine.objectContaining(expectedJson as Record<string, unknown>));
        });
    });
});

function createFakeBugSplatApiClient(
    environment,
    responseBody,
    formData
): BugSplatApiClient {
    const client = new BugSplatApiClient(fakeBugSplatHost, environment);
    (client as any)._fetch = jasmine.createSpy();
    (client as any)._fetch.and.returnValue(responseBody);
    (client as any)._createFormData = () => formData;
    return client;
}
