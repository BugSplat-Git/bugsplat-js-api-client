import { BugSplatApiClient, UploadableFile } from '@common';
import { config } from '@spec/config';
import { VersionsApiClient } from '@versions';
import fs from 'fs';
import path from 'path';

describe('VersionsApiClient', () => {
    let client: VersionsApiClient;
    const application = 'bugsplat-js-api-client';
    const version = '1.0.0';

    beforeEach(async () => {
        const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(
            config.email,
            config.password,
            config.host
        );
        client = new VersionsApiClient(bugsplat);
    });

    describe('delete', () => {
        it('should return 200 for delete with valid database, application and version', async () => {
            const response = await client.deleteSymbols(
                config.database,
                application,
                version
            );

            expect(response.status).toEqual(200);
        });
    });

    describe('post', () => {
        it('should return 200 for post with valid database, application, version and files', async () => {
            const filePath = './spec/files/js/index.js.map';
            const name = path.basename(filePath);
            const size = fs.statSync(filePath).size;
            const file = new UploadableFile(name, size, fs.createReadStream(filePath));
            const response = await client.postSymbols(
                config.database,
                application,
                version,
                [file]
            );

            expect(response[0].status).toEqual(200);
        });
    });
});