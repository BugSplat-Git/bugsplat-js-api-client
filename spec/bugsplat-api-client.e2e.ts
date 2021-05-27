import { BugSplatApiClient } from '../index';
import { config } from './config';

describe('BugSplatApiClient', () => {
    const email = 'fred@bugsplat.com';
    const password = 'Flintstone';
    let client: BugSplatApiClient;

    beforeEach(() => client = new BugSplatApiClient(email, password, config.host));

    describe('login', () => {
        it('should return 200 for correct email and password', async () => {
            const response = await client.login(email, password);
            const json = await response.json();

            expect(response.status).toEqual(200);
            expect(json.user).toEqual(email);
        });

        it('should throw error for incorrect email and password', async () => {
            try {
                await client.login(email, 'password');
                fail('login was supposed to throw!');
            } catch (error) {
                expect(error.message).toMatch(/Invalid email or password/);
            }
        });
    });
});