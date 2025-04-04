import { BugSplatApiClient } from '@common';
import { CrashApiClient } from '@crash';
import { CrashPostClient, CrashType } from '@post';
import { VersionsApiClient } from '@versions';
import { PostCrashResponse } from 'src/post/post-crash-response';
import { createUploadableFile } from '../create-bugsplat-file';
import { createSymbolFile } from '../create-symbol-file';
import { delay } from '../../../src/common/delay';

export async function postNativeCrashAndSymbols(
    authenticatedClient: BugSplatApiClient,
    database: string,
    application: string,
    version: string
): Promise<PostCrashResponse> {
    const exeFile = await createSymbolFile('./spec/files/native/myConsoleCrasher.exe');
    const pdbFile = await createSymbolFile('./spec/files/native/myConsoleCrasher.pdb');
    const files = [exeFile, pdbFile];
    const symbolsApiClient = new VersionsApiClient(authenticatedClient);
    await symbolsApiClient.postSymbols(
        database,
        application,
        version,
        files
    );

    return postNativeCrash(database, application, version);
}

export async function postNativeCrash(
    database: string,
    application: string,
    version: string
): Promise<PostCrashResponse> {
    const crashFile = await createUploadableFile('./spec/files/native/myConsoleCrasher.zip');
    const crashPostClient = new CrashPostClient(database);
    await delay(1000); // Prevent rate-limiting
    const postCrashResult = await crashPostClient.postCrash(
        application,
        version,
        CrashType.native,
        crashFile,
    );
    return postCrashResult.json();
}

export async function postNativeCrashAndWaitForCrashToProcess(
    bugsplat: BugSplatApiClient,
    crashClient: CrashApiClient,
    database: string,
    application: string,
    version: string
): Promise<PostCrashResponse> {
    const result = await postNativeCrashAndSymbols(
        bugsplat,
        database,
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
        const crash = await crashClient.getCrashById(database, crashId);
        stackKeyId = crash.stackKeyId as number;
        if (stackKeyId > 0) {
            break;
        }
        await delay(3000);
    }

    return {
        crashId,
        stackKeyId
    };
}
