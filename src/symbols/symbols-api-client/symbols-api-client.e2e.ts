import fs from "fs";
import path from 'path';
import { config } from "../../../spec/config";
import { BugSplatApiClient } from "../../common";
import { SymbolsApiClient } from "./symbols-api-client";

describe('SymbolsApiClient', () => {
    let client: SymbolsApiClient;
    let host = config.host;
    let email = config.email;
    let password = config.password;

    const database = 'fred';
    const application = 'bugsplat-js-api-client';
    const version = '1.0.0';

    beforeEach(async () => {
        const bugsplat = new BugSplatApiClient(host); 
        await bugsplat.login(email, password);
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