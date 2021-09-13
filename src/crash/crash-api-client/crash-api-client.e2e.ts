import { CrashApiClient } from './crash-api-client';
import { config } from '../../../spec/config';
import { BugSplatApiClient } from '../../common';

describe('CrashApiClient', () => {
    let client: CrashApiClient;
    const host = config.host;
    const email = config.email;
    const password = config.password;

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

    describe('reprocessCrash', () => {
        it('should return 200 for database fred and a recent crash that has symbols', async () => {
            // TODO BG https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/19
            const response = await client.reprocessCrash(database, 103339);

            expect(response.success).toEqual(true);
        });
    });
});