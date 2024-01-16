import { BugSplatApiClient } from '@common';
import { config } from '@spec/config';
import { UserApiResponseStatus, UsersApiClient } from './users-api-client';

describe('UsersApiClient', () => {
    let testEmail: string;
    let usersClient: UsersApiClient;

    beforeEach(async () => {
        const { host, email, password } = config;
        const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(email, password, host);
        usersClient = new UsersApiClient(bugsplat);
        testEmail = 'bobby+unittests@bugsplat.com';
    });

    describe('getUsers', () => {
        it('should return 200 and a specific user', async () => {
            const database = config.database;

            const { rows } = await usersClient.getUsers({
                database,
                email: config.email
            });

            const userRow = rows[0];
            expect(rows).toBeTruthy();
            expect(userRow).toBeTruthy();
        });

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

    describe('addUserToDatabase', () => {
        it('should return 200 and message', async () => {
            const response = await usersClient.addUserToDatabase(config.database, testEmail);
            const body = await response.json();
            expect(response.status).toEqual(200);
            expect(body.status).toEqual(UserApiResponseStatus.success);
        });
    });

    describe('removeUserFromDatabase', () => {
        it('should return 200 and message', async () => {
            const { uId } = await await usersClient.addUserToDatabase(config.database, testEmail).then(response => response.json());
            const response = await usersClient.removeUserFromDatabase(config.database, uId);
            const body = await response.json();
            expect(response.status).toEqual(200);
            expect(body.status).toEqual(UserApiResponseStatus.success);
        });
    });

    describe('updateUserForDatabase', () => {
        it('should return 200 and message', async () => {
            const { uId: uIdAdded } = await await usersClient.addUserToDatabase(config.database, testEmail).then(response => response.json());
            const response = await usersClient.updateUserForDatabase(config.database, testEmail, false);
            const body = await response.json();
            expect(response.status).toEqual(200);
            expect(body.status).toEqual(UserApiResponseStatus.success);
            expect(uIdAdded).toEqual(body.uId);
        });
    });

    // TODO BG companies tests
});
