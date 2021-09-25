import { BugSplatApiClient } from '@common';
import { CrashApiClient } from '@crash';
import { CrashPostClient, CrashType } from '@post';
import { config } from '@spec/config';
import { createBugSplatFile } from '@spec/files/create-bugsplat-file';
import { SymbolsApiClient } from '@symbols';

describe('CrashApiClient', () => {
    let crashClient: CrashApiClient;
    let application;
    let version;
    let id;

    beforeEach(async () => {
        application = 'myConsoleCrasher';
        version = `${Math.random() * 1000000}`;
        const exeFile = createBugSplatFile('./spec/files/native/myConsoleCrasher.exe');
        const pdbFile = createBugSplatFile('./spec/files/native/myConsoleCrasher.pdb');
        const files = [exeFile, pdbFile];
        const bugsplatApiClient = await BugSplatApiClient.createAuthenticatedClientForNode(
            config.host,
            config.email,
            config.password
        );
        const symbolsApiClient = new SymbolsApiClient(bugsplatApiClient);
        await symbolsApiClient.post(
            config.database,
            application,
            version,
            files
        );

        const crashFile = createBugSplatFile('./spec/files/native/myConsoleCrasher.zip');
        const crashPostClient = new CrashPostClient(config.database);
        const postCrashResult = await crashPostClient.postCrash(
            application,
            version,
            CrashType.native,
            crashFile,
            'ebe24c1cd1a0912904658fa4fad2b539'
        );
        const json = await postCrashResult.json();

        id = json.crashId;
        crashClient = new CrashApiClient(bugsplatApiClient);
    });

    describe('getCrashById', () => {
        it('should return 200', async () => {
            const response = await crashClient.getCrashById(config.database, id);

            expect(response.id).toEqual(id);
            expect(response.appName).toEqual(application);
            expect(response.appVersion).toEqual(version);
        });
    });

    describe('reprocessCrash', () => {
        it('should return 200 for a recent crash that has symbols', async () => {
            const response = await crashClient.reprocessCrash(config.database, id);

            expect(response.success).toEqual(true);
        });
    });
});