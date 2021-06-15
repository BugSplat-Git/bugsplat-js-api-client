import { CrashApiClient } from './crash-api-client';
import { config } from '../../../spec/config';
import { BugSplatApiClient } from '../../common';

describe('CrashApiClient', () => {
    let client: CrashApiClient;
    let host = config.host;
    let email = config.email;
    let password = config.password;

    const database = 'fred';
    const id = 100000;

    beforeEach(async () => {
        const bugsplat = new BugSplatApiClient(host); 
        await bugsplat.login(email, password);
        client = new CrashApiClient(bugsplat);
    });

    describe('getCrashById', () => {
        it('should return 200 for database fred and crashId 100000', async () => {
            const response = await client.getCrashById(database, id);

            expect(response.id).toEqual(id);
        });
    });
});