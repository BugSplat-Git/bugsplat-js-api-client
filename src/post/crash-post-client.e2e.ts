import { CrashPostClient, CrashType } from '@post';
import { config } from '@spec/config';
import { createUploadableFile } from '@spec/files/create-bugsplat-file';
import { delay } from '../common/delay';

describe('CrashPostClient', () => {
    beforeEach(async () => delay(1000));  // Prevent rate-limiting

    describe('postCrash', () => {
        it('should post crash to BugSplat and return 200', async () => {
            const application = 'myConsoleCrasher';
            const version = `${Math.random() * 1000000}`;
            const crashFile = await createUploadableFile('spec/files/native/myConsoleCrasher.zip');
            const crashPostClient = new CrashPostClient(config.database);
            const attributes = {
                'test': 'test'
            };
            const result = await crashPostClient.postCrash(
                application,
                version,
                CrashType.native,
                crashFile,
                attributes
            );
            const json = await result.json();

            expect(result.status).toEqual(200);
            expect(json.crashId).toBeGreaterThan(0);
        });
    });
});