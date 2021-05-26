import { BugSplatApiClient } from '../index';

describe('BugSplatApiClient', () => {
    const email = 'fred@bugsplat.com';
    const password = 'Flintstone';
    let client: BugSplatApiClient;

    beforeEach(() => client = new BugSplatApiClient());

    describe('login', () => {
        it('should return 200 for correct email and password', async () => {
            const response = await client.login(email, password);
            const json = await response.json();

            expect(response.status).toEqual(200);
            expect(json.user).toEqual(email);
        });

        it('should return 401 for incorrect email and password', async () => {
            const response = await client.login(email, 'password');
            const json = await response.json();

            expect(response.status).toEqual(401);
        });
    });
});