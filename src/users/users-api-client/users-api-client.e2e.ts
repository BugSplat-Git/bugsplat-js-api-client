import { BugSplatApiClient } from '@common';
import { config } from '@spec/config';
import { UsersApiClient } from './users-api-client';

describe('UsersApiClient', () => {
    let usersClient: UsersApiClient;

    beforeEach(async () => {
        const { host, email, password } = config;
        const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(email, password, host);
        usersClient = new UsersApiClient(bugsplat);
    });

    describe('getUsers', () => {
        it('should return 200 and array of users', async () => {
            const database = config.database;

            const { rows } = await usersClient.getUsers({
                database,
            });

            const userRow = rows.find(row => row.username === config.email);
            expect(rows).toBeTruthy();
            expect(userRow).toBeTruthy();
        });
    });
});
