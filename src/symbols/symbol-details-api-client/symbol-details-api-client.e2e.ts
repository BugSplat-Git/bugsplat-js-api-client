import { BugSplatApiClient, FilterOperator, QueryFilterGroup } from '@common';
import { config } from '@spec/config';
import { postNativeCrashAndSymbols } from '@spec/files/native/post-native-crash';
import { SymbolDetailsApiClient } from '@symbols';
import { VersionsApiClient } from '@versions';

describe('SymbolDetailsApiClient', () => {
    let bugsplat: BugSplatApiClient;
    let client: SymbolDetailsApiClient;
    let database;
    let application;
    let version;

    beforeEach(async () => {
        database = config.database;
        application = 'bugsplat-js-api-client';
        version = `${Math.random() * 1000000}`;

        bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(
            config.email,
            config.password,
            config.host
        );

        await postNativeCrashAndSymbols(
            bugsplat,
            database,
            application,
            version
        );

        client = new SymbolDetailsApiClient(bugsplat);
    });

    afterEach(async () => {
        await new VersionsApiClient(bugsplat).deleteVersions(
            database,
            [{ application, version }]
        );
    });

    describe('getSymbolDetails', () => {
        it('should return 200 with a row per uploaded symbol file', async () => {
            const result = await client.getSymbolDetails({
                database,
                filterGroups: [QueryFilterGroup.fromColumnValues([version], 'version', FilterOperator.or)]
            });

            expect(result.rows.length).toBeGreaterThan(0);
            result.rows.forEach((row) => {
                expect(row.application).toEqual(application);
                expect(row.version).toEqual(version);
                expect(row.moduleName).toBeTruthy();
                expect(row.downloadFile).toBeTruthy();
            });
            expect(result.rows.some((row) => row.moduleName.includes('myConsoleCrasher'))).toBeTrue();
        });

        // The endpoint hands size back as an int for filtered queries and a string
        // for plain ones, so assert the client always resolves it to a number.
        it('should return size as a number greater than zero', async () => {
            const result = await client.getSymbolDetails({
                database,
                filterGroups: [QueryFilterGroup.fromColumnValues([version], 'version', FilterOperator.or)]
            });

            result.rows.forEach((row) => {
                expect(typeof row.size).toEqual('number');
                expect(row.size).toBeGreaterThan(0);
            });
        });

        it('should respect pageSize', async () => {
            const result = await client.getSymbolDetails({
                database,
                filterGroups: [QueryFilterGroup.fromColumnValues([version], 'version', FilterOperator.or)],
                pageSize: 1
            });

            expect(result.rows.length).toEqual(1);
        });

        // /api/v2/symbols must answer 401 as JSON rather than redirecting to the
        // HTML login flow, which is what an unversioned auth helper would do.
        it('should reject with an authentication error when the client is not authenticated', async () => {
            const unauthenticated = new SymbolDetailsApiClient(new BugSplatApiClient(config.host));

            await expectAsync(unauthenticated.getSymbolDetails({ database }))
                .toBeRejectedWithError('Authentication failure');
        });
    });
});
