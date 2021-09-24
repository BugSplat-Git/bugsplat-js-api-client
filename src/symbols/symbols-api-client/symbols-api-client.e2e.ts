import { BugSplatApiClient } from '@common';
import { config } from '@spec/config';
import { SymbolsApiClient } from '@symbols';
import fs from 'fs';
import path from 'path';

describe('SymbolsApiClient', () => {
    let client: SymbolsApiClient;
    const host = config.host;
    const email = config.email;
    const password = config.password;

    const database = 'fred';
    const application = 'bugsplat-js-api-client';
    const version = '1.0.0';

    beforeEach(async () => {
        const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(host, email, password);
        client = new SymbolsApiClient(bugsplat);
    });

    describe('delete', () => {
        it('should return 200 for delete with valid database, application and version', async () => {
            const response = await client.delete(
                database,
                application,
                version
            );

            expect(response.status).toEqual(200);
        });
    });

    describe('post', () => {
        it('should return 200 for post with valid database, application, version and files', async () => {
            const filePath = './dist/cjs/index.js.map';
            const name = path.basename(filePath);
            const size = fs.statSync(filePath).size;
            const file = {
                name,
                size,
                file: fs.createReadStream(filePath)
            };
            const response = await client.post(
                database,
                application,
                version,
                [file]
            );

            expect(response[0].status).toEqual(200);
        });
    });
});