import { BugSplatApiClient, TableDataResponse } from '@common';
import { config } from '@spec/config';
import { UserApiResponseStatus, UsersApiClient } from './users-api-client';

describe('UsersApiClient', () => {
    let companyId: number;
    let testEmail: string;
    let usersClient: UsersApiClient;


    beforeEach(async () => {
        const { host, email, password } = config;
        const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(email, password, host);
        companyId = await getCompanyId(bugsplat, config.database);
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

    describe('addUserToCompany', () => {
        it('should return 200 and message', async () => {
            const response = await usersClient.addUserToCompany(companyId, testEmail);
            const body = await response.json();
            expect(response.status).toEqual(200);
            expect(body.status).not.toEqual(UserApiResponseStatus.fail);
        });
    });

    describe('removeUserFromCompany', () => {
        it('should return 200 and message', async () => {
            const { uId: uIdAdded } = await await usersClient.addUserToCompany(companyId, testEmail).then(response => response.json());
            const response = await usersClient.removeUserFromCompany(companyId, uIdAdded);
            const body = await response.json();
            expect(response.status).toEqual(200);
            expect(body.status).not.toEqual(UserApiResponseStatus.fail);
        });
    });
});

async function getCompanyId(apiClient: BugSplatApiClient, database: string): Promise<number> {
    const rows = await apiClient.fetch<Array<{ dbName: string, companyId: string }>>('/api/databases.php').then(response => response.json());
    const row = rows.find(row => row.dbName === database);
    if (!row?.companyId) {
        throw new Error(`Could not find database ${database}`);
    }
    return Number(row.companyId);
}