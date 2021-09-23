import { config } from '../../../spec/config';
import { BugSplatApiClient } from '../../common';
import { CrashApiClient } from '../../crash/crash-api-client/crash-api-client';
import { CrashesApiClient } from './crashes-api-client';

describe('CrashesApiClient', () => {
    let crashClient: CrashApiClient;
    let crashesClient: CrashesApiClient;
    const host = config.host;
    const email = config.email;
    const password = config.password;
    const database = 'fred';

    beforeEach(async () => {
        const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(host, email, password);
        crashesClient = new CrashesApiClient(bugsplat);
        crashClient = new CrashApiClient(bugsplat);
    });

    describe('getCrashes', () => {
        it('should return 200 and array of crashes', async () => {
            const pageSize = 10;
            const result = await crashesClient.getCrashes({ database, pageSize });
            const row = result.rows[0];
            expect(result.rows).toBeTruthy();
            expect(result.rows.length).toEqual(pageSize);
            expect(row.id).toBeGreaterThan(100000);
        });
    });

    describe('postNotes', () => {
        it('should return 200', async () => {
            const notes = 'BugSplat rocks!';
            const crashes = await crashesClient.getCrashes({ database });
            const id = Number(crashes.rows[0].id);
            
            await crashesClient.postNotes(database, id, notes);
            const result = await crashClient.getCrashById(database, id);

            expect(result.comments).toEqual(notes);
        });
    });
});