import { CrashPostClient, CrashType } from '@post';
import { config } from '@spec/config';
import { createUploadableFile } from '@spec/files/create-bugsplat-file';
import { delay } from 'src/common/delay';

describe('CrashPostClient', () => {
    beforeEach(async () => delay(2000));  // Prevent rate-limiting

    describe('postCrash', () => {
        it('should post crash to BugSplat and return 200', async () => {
            const application = 'myConsoleCrasher';
            const version = `${Math.random() * 1000000}`;
            const md5 = 'ebe24c1cd1a0912904658fa4fad2b539';
            const crashFile = await createUploadableFile('spec/files/native/myConsoleCrasher.zip');
            const crashPostClient = new CrashPostClient(config.database);
            const result = await crashPostClient.postCrash(
                application,
                version,
                CrashType.native,
                crashFile,
                md5
            );
            const json = await result.json();

            expect(result.status).toEqual(200);
            expect(json.crashId).toBeGreaterThan(0);
        });
    });
});