import { BugSplatApiClient } from '@common';
import { CrashApiClient } from '@crash';
import { config } from '@spec/config';
import { postNativeCrashAndSymbols } from '@spec/files/native/post-native-crash';

describe('CrashApiClient', () => {
    let crashClient: CrashApiClient;
    let application: string;
    let version: string;
    let id: number;

    beforeEach(async () => {
        const { host, email, password } = config;
        const bugsplatApiClient = await BugSplatApiClient.createAuthenticatedClientForNode(email, password, host);
        application = 'myConsoleCrasher';
        version = `${Math.random() * 1000000}`;
        const result = await postNativeCrashAndSymbols(
            bugsplatApiClient,
            config.database,
            application,
            version
        );
        id = result.crashId;
        
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