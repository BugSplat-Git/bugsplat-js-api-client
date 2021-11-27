import { config } from '@spec/config';
import { BugSplatApiClient } from '@common';
import { CrashApiClient } from '@crash';
import { CrashesApiClient } from '@crashes';
import { postNativeCrashAndSymbols } from '@spec/files/native/post-native-crash';

describe('CrashesApiClient', () => {
    let crashClient: CrashApiClient;
    let crashesClient: CrashesApiClient;
    let application;
    let version;
    let id;

    beforeEach(async () => {
        const { host, email, password } = config;
        const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(email, password, host);
        crashesClient = new CrashesApiClient(bugsplat);
        crashClient = new CrashApiClient(bugsplat);
        application = 'myConsoleCrasher';
        version = `${Math.random() * 1000000}`;
        id = await postNativeCrashAndSymbols(
            bugsplat,
            config.database,
            application,
            version
        );
    });

    describe('getCrashes', () => {
        it('should return 200 and array of crashes', async () => {
            const database = config.database;
            const pageSize = 1;
            
            const result = await crashesClient.getCrashes({ database, pageSize });
            
            const row = result.rows.find(row => Number(row.id) === id);
            expect(result.rows).toBeTruthy();
            expect(result.rows.length).toEqual(pageSize);
            expect(row?.id).toBeGreaterThan(1);
            expect(row?.appName).toEqual(application);
            expect(row?.appVersion).toEqual(version);
        });

        it('should return 200 and groupByCount for grouped crashes query', async () => {
            const database = config.database;
            const pageSize = 1;
            const columnGroups = ['stackKey'];
            
            const result = await crashesClient.getCrashes({ database, pageSize, columnGroups });
            
            const row = result.rows[0];
            expect(result.rows).toBeTruthy();
            expect(result.rows.length).toEqual(pageSize);
            expect(row?.groupByCount).toBeGreaterThanOrEqual(1);
        });
    });

    describe('postNotes', () => {
        it('should return 200', async () => {
            const database = config.database;
            const notes = 'BugSplat rocks!';
            
            await crashesClient.postNotes(database, id, notes);
            const result = await crashClient.getCrashById(database, id);

            expect(result.comments).toEqual(notes);
        });
    });
});