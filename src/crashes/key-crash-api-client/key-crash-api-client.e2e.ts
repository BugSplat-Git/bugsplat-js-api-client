import { ApiDataFilterGroup, BugSplatApiClient, FilterOperator } from '@common';
import { CrashApiClient } from '@crash';
import { KeyCrashApiClient } from '@crashes';
import { config } from '@spec/config';
import { CrashInfo, postNativeCrash, postNativeCrashAndSymbols } from '@spec/files/native/post-native-crash';
import { firstValueFrom, timer } from 'rxjs';

describe('KeyCrashApiClient', () => {
    let crashClient: CrashApiClient;
    let keyCrashClient: KeyCrashApiClient;
    let application;
    let version;
    let id;
    let stackKeyId;

    beforeEach(async () => {
        const { host, email, password } = config;
        const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(email, password, host);
        keyCrashClient = new KeyCrashApiClient(bugsplat);
        crashClient = new CrashApiClient(bugsplat);
        application = 'myConsoleCrasher';
        version = `${Math.random() * 1000000}`;
        const result = await postNativeCrashAndWaitForCrashToProcess(
            bugsplat,
            crashClient,
            application,
            version
        );
        id = result.crashId;
        stackKeyId = result.stackKeyId;
    });

    describe('getCrashes', () => {
        it('should return 200 and array of crashes', async () => {
            const database = config.database;
            const pageSize = 1;

            const result = await keyCrashClient.getCrashes({ database, stackKeyId, pageSize });

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

            const result = await keyCrashClient.getCrashes({ database, stackKeyId, pageSize, columnGroups });

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
            const filterGroups = [ApiDataFilterGroup.fromColumnValues([`${id}`, `${newestCrashId}`], 'id', FilterOperator.or)];

            const result = await keyCrashClient.getCrashes({
                database,
                stackKeyId,
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

            const postNotesResult = await keyCrashClient.postNotes(database, stackKeyId, notes);
            const result = await crashClient.getCrashById(database, id);

            expect(postNotesResult.status).toEqual(200);
            expect(result.stackKeyComment).toEqual(notes);
        });
    });
});

async function postNativeCrashAndWaitForCrashToProcess(
    bugsplat: BugSplatApiClient,
    crashClient: CrashApiClient,
    application: string,
    version: string
): Promise<CrashInfo> {
    const result = await postNativeCrashAndSymbols(
        bugsplat,
        config.database,
        application,
        version
    );

    const crashId = result.crashId;
    let stackKeyId = result.stackKeyId;

    if (stackKeyId > 0) {
        return {
            crashId,
            stackKeyId
        };
    }

    for (let i = 0; i < 60; i++) {
        const crash = await crashClient.getCrashById(config.database, crashId);
        stackKeyId = crash.stackKeyId as number;
        if (stackKeyId > 0) {
            break;
        }
        await firstValueFrom(timer(3000));
    }

    return {
        crashId,
        stackKeyId
    };
}