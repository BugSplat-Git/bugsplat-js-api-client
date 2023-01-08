import { BugSplatApiClient } from '@common';
import { CrashPostClient, CrashType } from '@post';
import { VersionsApiClient } from '@versions';
import { firstValueFrom, timer } from 'rxjs';
import { createUploadableFile } from '../create-bugsplat-file';

export async function postNativeCrashAndSymbols(
    authenticatedClient: BugSplatApiClient,
    database: string,
    application: string,
    version: string
): Promise<number> {
    const exeFile = createUploadableFile('./spec/files/native/myConsoleCrasher.exe');
    const pdbFile = createUploadableFile('./spec/files/native/myConsoleCrasher.pdb');
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
): Promise<number> {
    const crashFile = createUploadableFile('./spec/files/native/myConsoleCrasher.zip');
    const crashPostClient = new CrashPostClient(database);
    await firstValueFrom(timer(2000)); // Prevent rate-limiting
    const postCrashResult = await crashPostClient.postCrash(
        application,
        version,
        CrashType.native,
        crashFile,
        'ebe24c1cd1a0912904658fa4fad2b539'
    );
    const json = await postCrashResult.json() as { crashId: number };

    return json.crashId;
}