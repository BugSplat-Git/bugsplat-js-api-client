import { QueryFilterGroup, BugSplatApiClient, FilterOperator } from '@common';
import { CrashApiClient } from '@crash';
import { CrashesApiClient } from '@crashes';
import { config } from '@spec/config';
import { postNativeCrash, postNativeCrashAndSymbols } from '@spec/files/native/post-native-crash';

describe('CrashesApiClient', () => {
    let crashClient: CrashApiClient;
    let crashesClient: CrashesApiClient;
    let application: string;
    let version: string;
    let id: number;

    beforeEach(async () => {
        const { host, email, password } = config;
        const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(email, password, host);
        crashesClient = new CrashesApiClient(bugsplat);
        crashClient = new CrashApiClient(bugsplat);
        application = 'myConsoleCrasher';
        version = `${Math.random() * 1000000}`;
        const result = await postNativeCrashAndSymbols(
            bugsplat,
            config.database,
            application,
            version
        );
        id = result.crashId;
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

        it('should return 200 with crashes sorted by sortColumn and sortOrder', async () => {
            const database = config.database;
            const pageSize = 2;
            const sortColumn = 'id';
            const sortOrder = 'asc';
            const newestCrashId = await postNativeCrash(
                config.database,
                application,
                version
            );
            const filterGroups = [QueryFilterGroup.fromColumnValues([`${id}`, `${newestCrashId}`], 'id', FilterOperator.or)];

            const result = await crashesClient.getCrashes({
                database,
                filterGroups,
                pageSize,
                sortColumn,
                sortOrder
            });

            const row = result.rows[0];
            expect(row.id).toEqual(id);
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