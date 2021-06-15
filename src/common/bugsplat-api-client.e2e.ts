import { BugSplatApiClient } from '.';
import { config } from '../../spec/config';

describe('BugSplatApiClient', () => {
    let client: BugSplatApiClient;
    let host = config.host;
    let email = config.email;
    let password = config.password;

    beforeEach(() => client = new BugSplatApiClient(host));

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