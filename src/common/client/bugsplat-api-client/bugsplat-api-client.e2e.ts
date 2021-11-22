import { BugSplatApiClient } from '@common';
import { config } from '@spec/config';

describe('BugSplatApiClient', () => {
    let client: BugSplatApiClient;
    const host = config.host;
    const email = config.email;
    const password = config.password;

    beforeEach(() => client = new BugSplatApiClient(host));

    describe('login', () => {
        it('should return 200 for correct email and password', async () => {
            const response = await client.login(email, password);
            const json = await response.json();

            expect(response.status).toEqual(200);
            expect(json.user).toEqual(email);
        });

        describe('error', () => {
            it('should throw error for incorrect email and password', async () => {
                await expectAsync(client.login(email, 'password')).toBeRejectedWithError(
                    Error,
                    /Could not authenticate, check credentials and try again/
                );
            });
        });
    });
});