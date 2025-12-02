import { BugSplatApiClient } from '@common';
import { CrashApiClient } from '@crash';
import { config } from '@spec/config';
import { postNativeCrashAndSymbols } from '@spec/files/native/post-native-crash';
import { OAuthClientCredentialsClient } from './oauth-client-credentials-api-client';

describe('OAuthClientCredentialsClient', () => {
    const {
        clientId,
        clientSecret,
        database,
        email,
        host,
        password
    } = config;

    describe('login', () => {
        it('should return 200 with access_token', async () => {
            const client = new OAuthClientCredentialsClient(clientId, clientSecret, host);

            const result = await client.login();
            const json = await result.json();

            expect(result.status).toEqual(200);
            expect(json.access_token).toBeDefined();
            expect(json.token_type).toBeDefined();
        });

        describe('error', () => {
            it('should throw error for incorrect email and password', async () => {
                const client = new OAuthClientCredentialsClient(clientId, 'rocks', host);
                
                await expectAsync(client.login()).toBeRejectedWithError(
                    Error,
                    /Could not authenticate, check credentials and try again/
                );
            });
        });
    });

    describe('fetch', () => {
        let application: string;
        let version: string;
        let id: number;

        beforeEach(async () => {
            const bugsplatApiClient = await BugSplatApiClient.createAuthenticatedClientForNode(email, password, host);
            application = 'myConsoleCrasher';
            version = `${Math.random() * 1000000}`;
            const result = await postNativeCrashAndSymbols(
                bugsplatApiClient,
                config.database,
                application,
                version
            );
            id = result.crashId;
        });

        it('should return 200 for endpoint that requires authentication', async () => {
            const oauthClient = await OAuthClientCredentialsClient.createAuthenticatedClient(clientId, clientSecret, host);
            const crashApiClient = new CrashApiClient(oauthClient);

            const result = await crashApiClient.getCrashById(database, id);

            expect(result.id).toEqual(id);
            expect(result.appName).toEqual(application);
            expect(result.appVersion).toEqual(version);
        });
    });
});
