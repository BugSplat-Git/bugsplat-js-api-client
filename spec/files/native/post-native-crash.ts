import { BugSplatApiClient } from '@common';
import { CrashPostClient, CrashType } from '@post';
import { SymbolsApiClient } from '@symbols';
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
    const symbolsApiClient = new SymbolsApiClient(authenticatedClient);
    await symbolsApiClient.postSymbols(
        database,
        application,
        version,
        files
    );

    const crashFile = createUploadableFile('./spec/files/native/myConsoleCrasher.zip');
    const crashPostClient = new CrashPostClient(database);
    const postCrashResult = await crashPostClient.postCrash(
        application,
        version,
        CrashType.native,
        crashFile,
        'ebe24c1cd1a0912904658fa4fad2b539'
    );
    const json = await postCrashResult.json();

    return json.crashId;
}