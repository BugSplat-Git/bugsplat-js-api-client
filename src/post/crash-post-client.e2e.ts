import { BugSplatApiClient, BugSplatFile } from "@common";
import { SymbolsApiClient } from "@symbols";
import { config } from '@spec/config';
import fs, { statSync } from "fs";
import path from 'path'
import { CrashPostClient, CrashType } from "@post";

describe('CrashPostClient', () => {
    
    describe('postCrash', () => {
        it('should post crash to BugSplat and return 200', async () => {
            const application = 'myConsoleCrasher';
            const version = `${Math.random() * 1000000}`;
            const md5 = 'ebe24c1cd1a0912904658fa4fad2b539';
            // const exeFile = createBugSplatFile('spec/files/native/myConsoleCrasher.exe');
            // const pdbFile = createBugSplatFile('spec/files/native/myConsoleCrasher.pdb');
            // const files = [exeFile, pdbFile];
            // const bugsplatApiClient = new BugSplatApiClient();
            // const symbolsApiClient = new SymbolsApiClient(bugsplatApiClient);
            // await symbolsApiClient.post(
            //     config.database,
            //     application,
            //     version,
            //     files
            // );

            const crashFile = createBugSplatFile('spec/files/native/myConsoleCrasher.zip');
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
        });
    });
});

function createBugSplatFile(filePath: string): BugSplatFile {
    const fileSize = statSync(filePath).size;
    const fileName = path.basename(filePath);
    return new BugSplatFile(fileName, fileSize, fs.createReadStream(filePath));
}