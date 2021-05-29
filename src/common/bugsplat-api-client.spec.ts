import { BugSplatApiClient } from '.';
import { config } from '../../spec/config';
import { createFakeSuccessResponseBody } from '../../spec/fakes/response';

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
    let fakeSuccessReponseBody;

    beforeEach(() => {
        appendSpy = jasmine.createSpy();
        expectedStatus = 'success';
        expectedJson = { success: 'true' };
        fakeFormData = { append: appendSpy, toString: () => 'BugSplat rocks!' };
        fakeSuccessReponseBody = createFakeSuccessResponseBody(expectedStatus, expectedJson, cookie);
        client = new BugSplatApiClient(email, password, config.host);
        (<any>client)._fetch = jasmine.createSpy();
        (<any>client)._fetch.and.returnValue(fakeSuccessReponseBody);
        (<any>client)._createFormData = () => fakeFormData;
    });

    describe('fetch', () => {
        const route = '/api/crash/data';
        let body;
        let headers;
        let init;
        let result;

        beforeEach(async () => {
            body = fakeFormData;
            headers = { woah: 'dude' };
            init = { body, headers };
            result = await client.fetch(route, init);
        });

        it('should call login if cookie or xsrfToken are falsey', () => {
            expect((<any>client)._fetch).toHaveBeenCalledWith(`${config.host}/api/authenticatev3`, jasmine.anything());
        });

        it('should call fetch with correct route', () => {
            expect((<any>client)._fetch).toHaveBeenCalledWith(`${config.host}${route}`, jasmine.anything());
        });

        it('should call fetch with cookie and xsrf-token headers attached to request init', () => {
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

        it('should return result', () => {
            expect(result).toEqual(fakeSuccessReponseBody);
        });
    });

    describe('login', () => {
        let result;

        beforeEach(async () => result = await client.login(email, password));

        it('should call fetch with correct url', () => {
            expect((<any>client)._fetch).toHaveBeenCalledWith(`${config.host}/api/authenticatev3`, jasmine.anything());
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
                    credentials: 'include',
                    redirect: 'follow'
                })
            );
        });
    })
});
