import { BugSplatApiClient } from '@common';
import { config } from '@spec/config';
import { SymbolsApiClient } from '@symbols';
import { createReadStream, createWriteStream, ReadStream } from 'node:fs';
import { rm, stat } from 'node:fs/promises';
import { basename } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

describe('SymbolsApiClient', () => {
    let client: SymbolsApiClient;
    let database;
    let application;
    let version = '1.0.0';

    beforeEach(async () => {
        database = config.database;
        application = 'bugsplat-js-api-client';
        version = `${Math.random() * 1000000}`;

        const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(
            config.email,
            config.password,
            config.host
        );

        client = new SymbolsApiClient(bugsplat);
    });

    describe('postSymbols', () => {
        const filePath = './spec/files/native/myConsoleCrasher.pdb';
        const moduleName = 'myConsoleCrasher.pdb';
        const dbgId = '2CA6992CEA8847A8B821730F6F5D20321';
        const gzipFilePath = `${filePath}.gz`;

        beforeEach(async () => 
            await pipeline(
                createReadStream(filePath),
                createGzip(),
                createWriteStream(gzipFilePath)
            )
        );

        it('should return 200 for post with valid database, application, version and files', async () => {
            const name = basename(filePath);
            const stats = await stat(filePath);
            const uncompressedSize = stats.size;
            const lastModified = stats.mtime;    
            const size = await stat(gzipFilePath).then(stats => stats.size);
            const file = ReadStream.toWeb(createReadStream(gzipFilePath));
            const gzippedSymbolFile = {
                name,
                size,
                uncompressedSize,
                dbgId,
                file,
                moduleName,
                lastModified
            };
            const response = await client.postSymbols(
                database,
                application,
                version,
                [gzippedSymbolFile]
            );

            expect(response[0].status).toEqual(200);
        });

        afterEach(async () => rm(gzipFilePath));
    });
});