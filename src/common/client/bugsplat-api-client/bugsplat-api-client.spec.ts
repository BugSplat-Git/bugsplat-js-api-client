import { BugSplatApiClient, Environment } from '@common';
import { createFakeResponseBody } from '@spec/fakes/common/response';

const fakeBugSplatHost = 'https://fake.bugsplat.com';

describe('BugSplatApiClient', () => {
    const email = 'bobby@bugsplat.com';
    const password = 'password';
    const xsrfToken = '🪙';
    const cookie = `🍪;xsrf-token=${xsrfToken}`;
    
    let client: BugSplatApiClient;
    let appendSpy;
    let expectedStatus;
    let expectedJson;
    let fakeFormData;
    let fakeSuccessResponseBody;

    beforeEach(() => {
        const headers = new Map([['set-cookie', cookie]]);
        appendSpy = jasmine.createSpy();
        expectedStatus = 'success';
        expectedJson = { success: 'true' };
        fakeFormData = { append: appendSpy, toString: () => 'BugSplat rocks!' };
        fakeSuccessResponseBody = createFakeResponseBody(expectedStatus, expectedJson, true, headers);
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
            await client.login(email, password);
            result = await client.fetch(route, init);
        });

        it('should call fetch with correct route', () => {
            expect((<any>client)._fetch).toHaveBeenCalledWith(`${fakeBugSplatHost}${route}`, jasmine.anything());
        });

        describe('when environment is Browser', () => {
            it('should call fetch with include credentials in request init', async () => {
                client = createFakeBugSplatApiClient(
                    Environment.WebBrowser,
                    fakeSuccessResponseBody,
                    fakeFormData
                );

                await client.fetch(route, init);

                expect((<any>client)._fetch).toHaveBeenCalledWith(
                    jasmine.any(String),
                    jasmine.objectContaining({
                        body,
                        credentials: 'include'
                    })
                );
            });
        });

        describe('when environment is Node', () => {
            it('should call fetch with cookie and xsrf-token headers in request init', () => {
                expect((<any>client)._fetch).toHaveBeenCalledWith(
                    jasmine.any(String),
                    jasmine.objectContaining({
                        body,
                        headers: {
                            ...headers,
                            cookie,
                            'xsrf-token': xsrfToken
                        }
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

    describe('login', () => {
        let result;

        beforeEach(async () => result = await client.login(email, password));

        it('should call fetch with correct url', () => {
            expect((<any>client)._fetch).toHaveBeenCalledWith(`${fakeBugSplatHost}/api/authenticatev3`, jasmine.anything());
        });
    
        it('should append email, password and Login properties to formData', () => {
            expect(appendSpy).toHaveBeenCalledWith('email', email);
            expect(appendSpy).toHaveBeenCalledWith('password', password);
            expect(appendSpy).toHaveBeenCalledWith('Login', 'Login');
        });
    
        it('should call fetch with formData', () => {
            expect((<any>client)._fetch).toHaveBeenCalledWith(
                jasmine.any(String),
                jasmine.objectContaining({
                    method: 'POST',
                    body: fakeFormData,
                    cache: 'no-cache',
                    redirect: 'follow'
                })
            );
        });

        it('should return result', () => {
            expect(result).toEqual(fakeSuccessResponseBody);
        });

        describe('error', () => {
            it('should throw if response status is 401', async () => {
                (<any>client)._fetch.and.returnValue({ status: 401 });
                
                await expectAsync(client.login(email, password)).toBeRejectedWithError(
                    Error,
                    /Could not authenticate, check credentials and try again/
                );
            });
        });
    });
});

function createFakeBugSplatApiClient(
    environment,
    responseBody,
    formData
): BugSplatApiClient {
    const client = new BugSplatApiClient(fakeBugSplatHost, environment);
    (<any>client)._fetch = jasmine.createSpy();
    (<any>client)._fetch.and.returnValue(responseBody);
    (<any>client)._createFormData = () => formData;
    return client;
}