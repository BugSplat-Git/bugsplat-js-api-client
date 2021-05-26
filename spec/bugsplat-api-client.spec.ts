import { BugSplatApiClient } from '../index';

describe('BugSplatApiClient', () => {

    const expectedStatus = 'success';
    const expectedJson = { success: 'true' };
    
    let client: BugSplatApiClient;
    let appendSpy;
    let fakeFormData;
    let fakeSuccessReponseBody;
    let email;
    let password;
    let result;

    beforeEach(async () => {
        appendSpy = jasmine.createSpy();
        fakeFormData = { append: appendSpy, toString: () => 'BugSplat rocks!' };
        fakeSuccessReponseBody = {
            status: expectedStatus,
            json: async() => (expectedJson),
            ok: true,
            headers: { raw: () => ({ 'set-cookie': [] }) }
        };
        client = new BugSplatApiClient();
        (<any>client)._fetch = jasmine.createSpy();
        (<any>client)._fetch.and.returnValue(fakeSuccessReponseBody);
        (<any>client)._formData = () => fakeFormData;

        email = 'bobby@bugsplat.com';
        password = 'password';
        result = await client.login(email, password);
    });

    it('should call fetch with correct url', () => {
        expect((<any>client)._fetch).toHaveBeenCalledWith('https://app.bugsplat.com/api/authenticatev3', jasmine.anything());
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
});