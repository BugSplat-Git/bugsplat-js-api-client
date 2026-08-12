import { createFakeFormData } from '@spec/fakes/common/form-data';
import { createFakeResponseBody, FakeResponseBody } from '@spec/fakes/common/response';
import { OAuthClientCredentialsClient } from './oauth-client-credentials-api-client';
import { BugSplatResponse } from '@common';
import { OAuthLoginResponse } from './oauth-login-response';

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
        (sut as any)._fetch.and.returnValues(
            Promise.resolve(fakeAuthorizeResponseBody),
            Promise.resolve(fakeFetchResponseBody)
        );
    });

    describe('login', () => {
        let result: BugSplatResponse<OAuthLoginResponse>;

        beforeEach(async () => result = await sut.login());

        it('should call fetch with correct url', () => {
            expect((sut as any)._fetch).toHaveBeenCalledWith(
                `${host}/oauth2/authorize`,
                jasmine.anything()
            );
        });

        it('should call fetch with formData containing correct values', () => {
            expect(fakeFormData.append).toHaveBeenCalledWith('grant_type', 'client_credentials');
            expect(fakeFormData.append).toHaveBeenCalledWith('client_id', clientId);
            expect(fakeFormData.append).toHaveBeenCalledWith('client_secret', clientSecret);
            expect((sut as any)._fetch).toHaveBeenCalledWith(
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

            it('should reject when the response carries no access_token', async () => {
                // An unknown client id answers 400 with a message rather than an OAuth error payload.
                sut = createLoginFailureClient(createFakeResponseBody(400, { message: 'Unknown clientId 🤷' }));

                await expectAsync(sut.login()).toBeRejectedWith(jasmine.objectContaining({
                    isAuthenticationError: true,
                    message: 'Could not authenticate, check credentials and try again: Unknown clientId 🤷'
                }));
            });

            it('should not store a token when the response carries no access_token', async () => {
                sut = createLoginFailureClient(createFakeResponseBody(400, { message: 'Unknown clientId 🤷' }));

                await expectAsync(sut.login()).toBeRejected();

                expect((sut as any)._accessToken).toBeFalsy();
                expect((sut as any)._tokenType).toBeFalsy();
            });

            it('should reject a 2xx that carries no access_token', async () => {
                // #142: a success status is not on its own proof that authentication succeeded.
                sut = createLoginFailureClient(createFakeResponseBody(200, { token_type: 'Bearer' }));

                await expectAsync(sut.login()).toBeRejectedWith(jasmine.objectContaining({
                    isAuthenticationError: true,
                    message: 'Could not authenticate, check credentials and try again: status 200'
                }));
            });

            it('should prefer error_description over other details', async () => {
                sut = createLoginFailureClient(createFakeResponseBody(400, {
                    error: 'invalid_request',
                    error_description: 'grant_type is required',
                    message: 'ignored'
                }));

                await expectAsync(sut.login()).toBeRejectedWithError(Error, /grant_type is required/);
            });

            it('should fall back to the status when the response carries no detail', async () => {
                sut = createLoginFailureClient(createFakeResponseBody(500, {}));

                await expectAsync(sut.login()).toBeRejectedWithError(
                    Error,
                    /Could not authenticate, check credentials and try again: status 500/
                );
            });

            it('should reject a rate limited authorize request as a rate limit error', async () => {
                sut = createLoginFailureClient(createUnparseableResponseBody(429, '', new Headers({ 'retry-after': '60' })));

                await expectAsync(sut.login()).toBeRejectedWith(jasmine.objectContaining({
                    isRateLimitError: true,
                    status: 429,
                    retryAfterSeconds: 60,
                    message: 'Could not authenticate, too many requests, retry after 60 seconds'
                }));
            });

            it('should omit the retry hint when the rate limit response carries no Retry-After', async () => {
                sut = createLoginFailureClient(createUnparseableResponseBody(429, ''));

                await expectAsync(sut.login()).toBeRejectedWith(jasmine.objectContaining({
                    isRateLimitError: true,
                    retryAfterSeconds: undefined,
                    message: 'Could not authenticate, too many requests'
                }));
            });

            it('should not report a rate limit as an authentication failure', async () => {
                // symbol-upload fails fast on isAuthenticationError, so a retryable 429 must not carry it.
                sut = createLoginFailureClient(createUnparseableResponseBody(429, ''));

                const error = await sut.login().catch(error => error);

                expect(error.isAuthenticationError).toBeUndefined();
            });

            it('should reject with the status and body when the response is not json', async () => {
                sut = createLoginFailureClient(createUnparseableResponseBody(502, '<html>Bad Gateway</html>'));

                await expectAsync(sut.login()).toBeRejectedWith(jasmine.objectContaining({
                    isApiError: true,
                    status: 502,
                    message: 'Could not authenticate, the authorize endpoint returned status 502 and a response that isn\'t JSON: <html>Bad Gateway</html>'
                }));
            });

            it('should say the body was empty when an unparseable response carries no body', async () => {
                sut = createLoginFailureClient(createUnparseableResponseBody(504, ''));

                await expectAsync(sut.login()).toBeRejectedWithError(
                    Error,
                    /status 504 and a response that isn't JSON: the response body was empty/
                );
            });

            function createLoginFailureClient(responseBody) {
                return createFakeOAuthClientCredentialsClient(clientId, clientSecret, host, responseBody, fakeFormData);
            }

            // Stands in for a response the server never encoded as JSON: the real Response rejects
            // json() while text() still hands back whatever arrived.
            function createUnparseableResponseBody(status: number, text: string, headers = new Headers()) {
                const body = {
                    status,
                    headers,
                    ok: false,
                    json: () => Promise.reject(new SyntaxError('Unexpected end of JSON input')),
                    text: () => Promise.resolve(text),
                    clone: () => body
                };
                return body;
            }
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
            expect((sut as any)._fetch).toHaveBeenCalledWith(
                `${host}${route}`,
                jasmine.anything()
            );
        });

        it('should call fetch with init containing Authorization header', () => {
            const mostRecentCallArgs = (sut as any)._fetch.calls.mostRecent().args;
            const headers = mostRecentCallArgs[1].headers;
            expect(headers).toEqual(jasmine.objectContaining({
                ...headers,
                Authorization: `${fakeAuthorizeResult.token_type} ${fakeAuthorizeResult.access_token}`
            }));
        });

        it('should call fetch with new init if init is not provided', async () => {
            (sut as any)._fetch.and.returnValue(Promise.resolve(fakeAuthorizeResponseBody));

            await sut.fetch(route);

            const mostRecentCallArgs = (sut as any)._fetch.calls.mostRecent().args;
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
                (sut as any)._fetch.and.resolveTo(createFakeResponseBody(401));

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
    (client as any)._fetch = jasmine.createSpy();
    (client as any)._fetch.and.returnValue(responseBody);
    (client as any)._createFormData = () => formData;
    return client;
}

interface AuthorizeResult {
    access_token: string;
    token_type: string;
}