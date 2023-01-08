import { ApiClient, bugsplatAppHostUrl } from '@common';
export class OAuthClientCredentialsClient implements ApiClient {

    private _accessToken = '';
    private _tokenType = '';
    private _createFormData = () => new FormData();
    private _fetch = globalThis.fetch;

    constructor(
        private _clientId: string,
        private _clientSecret: string,
        private _host: string = bugsplatAppHostUrl
    ) { }

    static async createAuthenticatedClient(
        clientId: string,
        clientSecret: string,
        host: string = bugsplatAppHostUrl
    ): Promise<OAuthClientCredentialsClient> {
        const client = new OAuthClientCredentialsClient(
            clientId,
            clientSecret,
            host
        );
        await client.login();
        return client;
    }

    async login(): Promise<Response> {
        const url = `${this._host}/oauth2/authorize`;
        const method = 'POST';
        const body = this.createFormData();
        body.append('grant_type', 'client_credentials');
        body.append('client_id', this._clientId);
        body.append('client_secret', this._clientSecret);
        body.append('scope', 'restricted');
        const request = {
            method,
            body
        } as RequestInit;

        const response = await this.fetch(url, request);
        const responseJson = await response.clone().json();

        if (responseJson.error === 'invalid_client') {
            throw new Error('Could not authenticate, check credentials and try again');
        }

        this._accessToken = responseJson.access_token;
        this._tokenType = responseJson.token_type;

        return response;
    }
    
    createFormData(): FormData {
        return this._createFormData();
    }

    async fetch(route: string, init?: RequestInit): Promise<Response> {
        const url = new URL(route, this._host);
        init = init ?? {};
        
        if (!init.headers) {
            init.headers = {};
        }

        init.headers['Authorization'] = `${this._tokenType} ${this._accessToken}`;
        
        const response = await this._fetch(url.href, init);
        
        if (response.status === 401) {
            throw new Error('Could not authenticate, check credentials and try again');
        }

        return response;
    }  
}
