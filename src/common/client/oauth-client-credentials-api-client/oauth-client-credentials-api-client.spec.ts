import { createFakeFormData } from '@spec/fakes/common/form-data';
import { createFakeResponseBody, FakeResponseBody } from '@spec/fakes/common/response';
import { BugSplatResponse } from 'dist/esm';
import { OAuthLoginResponse } from 'dist/esm/common/client/oauth-client-credentials-api-client/oauth-login-response';
import { OAuthClientCredentialsClient } from './oauth-client-credentials-api-client';

describe('OAuthClientCredentialsClient', () => {
    let clientId: string;
    let clientSecret: string;
    let fakeAuthorizeResponseBody: FakeResponseBody<AuthorizeResult>;
    let fakeAuthorizeResult: AuthorizeResult;
    let fakeFetchResponseBody: FakeResponseBody<unknown>;
    let fakeFetchResult;
    let fakeFormData;
    let host;

    let sut: OAuthClientCredentialsClient;

    beforeEach(() => {
        clientId = '🎫';
        clientSecret = '🔐';
        host = 'https://app.bugsplat.com';

        fakeAuthorizeResult = { access_token: '🪙', token_type: 'bearer' };
        fakeAuthorizeResponseBody = createFakeResponseBody(200, fakeAuthorizeResult);
        fakeFetchResult = { crashes: [1, 2, 3] };
        fakeFetchResponseBody = createFakeResponseBody(200, fakeFetchResult);
        fakeFormData = createFakeFormData();
        sut = createFakeOAuthClientCredentialsClient(
            clientId,
            clientSecret,
            host,
            fakeAuthorizeResponseBody,
            fakeFormData
        );
        (<any>sut)._fetch.and.returnValues(
            Promise.resolve(fakeAuthorizeResponseBody),
            Promise.resolve(fakeFetchResponseBody)
        );
    });

    describe('login', () => {
        let result: BugSplatResponse<OAuthLoginResponse>;

        beforeEach(async () => result = await sut.login());

        it('should call fetch with correct url', () => {
            expect((<any>sut)._fetch).toHaveBeenCalledWith(
                `${host}/oauth2/authorize`,
                jasmine.anything()
            );
        });

        it('should call fetch with formData containing correct values', () => {
            expect(fakeFormData.append).toHaveBeenCalledWith('grant_type', 'client_credentials');
            expect(fakeFormData.append).toHaveBeenCalledWith('client_id', clientId);
            expect(fakeFormData.append).toHaveBeenCalledWith('client_secret', clientSecret);
            expect(fakeFormData.append).toHaveBeenCalledWith('scope', 'restricted');
            expect((<any>sut)._fetch).toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.objectContaining({
                    method: 'POST',
                    body: fakeFormData
                })
            );
        });

        it('should return result', async () => {
            const json = await result.json();
            expect(result.status).toEqual(fakeAuthorizeResponseBody.status);
            expect(json).toEqual(fakeAuthorizeResult);
        });

        describe('error', () => {
            it('should return useful error message when authentication fails', async () => {
                const failureResponseBody = createFakeResponseBody(200, { error: 'invalid_client' });
                sut = createFakeOAuthClientCredentialsClient(
                    'blah',
                    'blah',
                    host,
                    failureResponseBody,
                    fakeFormData
                );

                await expectAsync(sut.login()).toBeRejectedWithError(
                    Error,
                    /Could not authenticate, check credentials and try again/
                );
            });
        });
    });

    describe('fetch', () => {
        let route;
        let headers;
        let result: BugSplatResponse<unknown>;

        beforeEach(async () => {
            route = '/what/will/we/do/with/a/drunken/sailor';
            await sut.login();

            headers = { foo: 'bar' };
            result = await sut.fetch(route, { headers });
        });

        it('should call fetch with correct url', () => {
            expect((<any>sut)._fetch).toHaveBeenCalledWith(
                `${host}${route}`,
                jasmine.anything()
            );
        });

        it('should call fetch with init containing Authorization header', () => {
            const mostRecentCallArgs = (<any>sut)._fetch.calls.mostRecent().args;
            const headers = mostRecentCallArgs[1].headers;
            expect(headers).toEqual(jasmine.objectContaining({
                ...headers,
                Authorization: `${fakeAuthorizeResult.token_type} ${fakeAuthorizeResult.access_token}`
            }));
        });

        it('should call fetch with new init if init is not provided', async () => {
            (<any>sut)._fetch.and.returnValue(Promise.resolve(fakeAuthorizeResponseBody));

            await sut.fetch(route);

            const mostRecentCallArgs = (<any>sut)._fetch.calls.mostRecent().args;
            const headers = mostRecentCallArgs[1].headers;
            expect(headers).toEqual(jasmine.objectContaining({
                Authorization: `${fakeAuthorizeResult.token_type} ${fakeAuthorizeResult.access_token}`
            }));
        });

        it('should return result', async () => {
            const expectedJson = await fakeFetchResponseBody.json();
            const resultJson = await result.json();
            expect(resultJson).toEqual(jasmine.objectContaining(expectedJson as Record<string, unknown>));
        });

        describe('error', () => {
            it('should throw error with useful message if fetch returns 401', async () => {
                (<any>sut)._fetch.and.resolveTo(createFakeResponseBody(401));

                await expectAsync(sut.fetch(route)).toBeRejectedWithError(
                    Error,
                    /Could not authenticate/
                );
            });
        });
    });
});

function createFakeOAuthClientCredentialsClient(
    clientId,
    clientSecret,
    host,
    responseBody,
    formData
): OAuthClientCredentialsClient {
    const client = new OAuthClientCredentialsClient(clientId, clientSecret, host);
    (<any>client)._fetch = jasmine.createSpy();
    (<any>client)._fetch.and.returnValue(responseBody);
    (<any>client)._createFormData = () => formData;
    return client;
}

interface AuthorizeResult {
    access_token: string;
    token_type: string;
}