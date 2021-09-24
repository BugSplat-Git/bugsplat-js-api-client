import { BugSplatApiClient } from '@common';
import { CrashApiClient } from '@crash';
import { CrashesApiClient } from '@crashes';
import { config } from '@spec/config';

describe('CrashApiClient', () => {
    let crashClient: CrashApiClient;
    let crashesClient: CrashesApiClient;
    const host = config.host;
    const email = config.email;
    const password = config.password;

    const database = 'fred';
    const id = 100000;

    beforeEach(async () => {
        const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(host, email, password);
        crashClient = new CrashApiClient(bugsplat);
        crashesClient = new CrashesApiClient(bugsplat);
    });

    describe('getCrashById', () => {
        it('should return 200 for database fred and crashId 100000', async () => {
            const response = await crashClient.getCrashById(database, id);

            expect(response.id).toEqual(id);
        });
    });

    describe('reprocessCrash', () => {
        it('should return 200 for database fred and a recent crash that has symbols', async () => {
            const pageSize = 100;
            const crashesResponse = await crashesClient.getCrashes({ database, pageSize });
            const crashWithSymbols = crashesResponse.rows.find(row => {
                return Number(row.stackKeyId) > 0 && row.stackKey.includes('myConsoleCrasher!MemoryException');
            });
            const id = Number(crashWithSymbols?.id);

            const response = await crashClient.reprocessCrash(database, id);

            expect(response.success).toEqual(true);
        });
    });
});