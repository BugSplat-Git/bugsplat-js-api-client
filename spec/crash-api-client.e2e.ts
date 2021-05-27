import { BugSplatApiClient, CrashApiClient } from '..';
import { config } from './config';

describe('CrashApiClient', () => {
    const email = 'fred@bugsplat.com';
    const password = 'Flintstone';
    const database = 'fred';
    const id = 100000;
    let client: CrashApiClient;

    beforeEach(() => {
        client = new CrashApiClient(
            new BugSplatApiClient(email, password, config.host)
        );
    });

    describe('getCrashById', () => {
        it('should return 200 for database fred and crashId 100000', async () => {
            const response = await client.getCrashById(database, id);
            const json = await response.json();

            expect(response.status).toEqual(200);
            expect(json.id).toEqual(id)
        });
    });
});