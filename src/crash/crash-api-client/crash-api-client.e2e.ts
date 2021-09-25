import { BugSplatApiClient } from '@common';
import { CrashApiClient } from '@crash';
import { config } from '@spec/config';
import { postNativeCrashAndSymbols } from '@spec/files/native/post-native-crash';

describe('CrashApiClient', () => {
    let crashClient: CrashApiClient;
    let application;
    let version;
    let id;

    beforeEach(async () => {
        const { host, email, password } = config;
        const bugsplatApiClient = await BugSplatApiClient.createAuthenticatedClientForNode(host, email, password);
        application = 'myConsoleCrasher';
        version = `${Math.random() * 1000000}`;
        id = await postNativeCrashAndSymbols(
            bugsplatApiClient,
            config.database,
            application,
            version
        );
        
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