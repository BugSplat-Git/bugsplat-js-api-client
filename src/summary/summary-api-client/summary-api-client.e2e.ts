import { BugSplatApiClient } from '@common';
import { config } from '@spec/config';
import { postNativeCrashAndSymbols } from '@spec/files/native/post-native-crash';
import { SummaryApiClient } from './summary-api-client';
import { delay } from '../../common/delay';

describe('SummaryApiClient', () => {
    let summaryClient: SummaryApiClient;
    let application;
    let version;

    beforeEach(async () => {
        const { host, email, password } = config;
        const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(email, password, host);
        summaryClient = new SummaryApiClient(bugsplat);
        application = 'myConsoleCrasher';
        version = `${Math.random() * 1000000}`;
        await postNativeCrashAndSymbols(
            bugsplat,
            config.database,
            application,
            version
        );
    });

    describe('getSummary', () => {
        it('should return 200 and array of stack keys', async () => {
            const stackKey = 'myConsoleCrasher!MemoryException(150)';
            const database = config.database;
            const applications = [application];
            const versions = [version];
            const pageSize = 1;

            let result;
            for (let i = 0; i < 150; i++) {
                result = await summaryClient.getSummary({
                    database,
                    applications,
                    versions,
                    pageSize
                });

                const isProcessed = result.rows[0].stackKeyId > 0;
                if (isProcessed) {
                    break;
                }

                await delay(2000);
            }

            const row = result.rows.find(row => row.stackKey === stackKey);
            expect(result.rows).toBeTruthy();
            expect(result.rows.length).toEqual(pageSize);
            expect(row?.stackKeyId).toBeGreaterThanOrEqual(1);
            expect(row?.stackKey).toEqual(stackKey);
        });
    });
});
