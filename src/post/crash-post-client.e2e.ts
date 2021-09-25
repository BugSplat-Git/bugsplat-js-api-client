import { CrashPostClient, CrashType } from '@post';
import { config } from '@spec/config';
import { createBugSplatFile } from '@spec/files/create-bugsplat-file';

describe('CrashPostClient', () => {
    
    describe('postCrash', () => {
        it('should post crash to BugSplat and return 200', async () => {
            const application = 'myConsoleCrasher';
            const version = `${Math.random() * 1000000}`;
            const md5 = 'ebe24c1cd1a0912904658fa4fad2b539';
            const crashFile = createBugSplatFile('spec/files/native/myConsoleCrasher.zip');
            const crashPostClient = new CrashPostClient(config.database);
            const result = await crashPostClient.postCrash(
                application,
                version,
                CrashType.native,
                crashFile,
                md5
            );

            expect(result.status).toEqual(200);
        });
    });
});