import { ApiClient, bugsplatAppHostUrl, BugSplatResponse } from '@common';
import { OAuthLoginResponse } from './oauth-login-response';

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

    async login(): Promise<BugSplatResponse<OAuthLoginResponse>> {
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

        const response = await this.fetch<LoginResponse>(url, request);
        const responseJson = await response.json();

        if ((responseJson as ErrorResponse).error === 'invalid_client') {
            throw new Error('Could not authenticate, check credentials and try again');
        }

        const loginResponse = responseJson as OAuthLoginResponse;
        this._accessToken = loginResponse.access_token;
        this._tokenType = loginResponse.token_type;

        return response as BugSplatResponse<OAuthLoginResponse>;
    }
    
    createFormData(): FormData {
        return this._createFormData();
    }

    async fetch<T>(route: string, init?: RequestInit): Promise<BugSplatResponse<T>> {
        const url = new URL(route, this._host);
        init = init ?? {};
        
        if (!init.headers) {
            init.headers = {};
        }

        init.headers['Authorization'] = `${this._tokenType} ${this._accessToken}`;
        
        const response = await this._fetch(url.href, init);
        const status = response.status;
        
        if (status === 401) {
            throw new Error('Could not authenticate, check credentials and try again');
        }

        return {
            status,
            json: async () => response.clone().json(),
            text: async () => response.clone().text()
        };
    }  
}

type ErrorResponse = { error: string };
type LoginResponse = ErrorResponse | OAuthLoginResponse;