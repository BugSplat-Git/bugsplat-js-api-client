import { ApiClient, bugsplatAppHostUrl, BugSplatResponse } from '@common';
import { OAuthLoginResponse } from './oauth-login-response';
import { BugSplatApiError, BugSplatAuthenticationError, BugSplatRateLimitError } from '../api-client';

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
        const route = '/oauth2/authorize';
        const method = 'POST';
        const body = this.createFormData();
        body.append('grant_type', 'client_credentials');
        body.append('client_id', this._clientId);
        body.append('client_secret', this._clientSecret);
        const request = {
            method,
            body,
            duplex: 'half'
        } as RequestInit;

        const response = await this.fetch<LoginResponse>(route, request);

        // The rate limiter answers with an empty body, so parsing first turns a 429 into
        // "Unexpected end of JSON input" and throws the status away with it.
        if (response.status === 429) {
            const retryAfterSeconds = parseRetryAfter(response.headers);
            const retry = retryAfterSeconds ? `, retry after ${retryAfterSeconds} seconds` : '';
            throw new BugSplatRateLimitError(
                `Could not authenticate, too many requests${retry}`,
                response.status,
                retryAfterSeconds
            );
        }

        const responseJson = await readLoginResponse(response);

        if ((responseJson as ErrorResponse).error === 'invalid_client') {
            throw new BugSplatAuthenticationError('Could not authenticate, check credentials and try again');
        }

        const loginResponse = responseJson as OAuthLoginResponse;

        // Only a bad secret answers with `invalid_client`. An unknown client id comes back as
        // 400 { "message": "Unknown clientId ..." }, which matches no error shape we look for — the
        // absent token is the only signal that authentication failed. Without this login() resolves,
        // the token stays empty, and every later request 401s in the middle of the caller's work.
        if (!loginResponse.access_token) {
            const detail = describeLoginFailure(responseJson, response.status);
            throw new BugSplatAuthenticationError(`Could not authenticate, check credentials and try again: ${detail}`);
        }

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
        const body = response.body;

        if (status === 401) {
            throw new BugSplatAuthenticationError('Could not authenticate, check credentials and try again');
        }

        return {
            status,
            body,
            headers: response.headers,
            json: async () => response.clone().json(),
            text: async () => response.clone().text()
        };
    }
}

/**
 * A proxy error page, a gateway timeout, or anything else that isn't JSON would otherwise escape as a
 * bare SyntaxError, which names neither the endpoint nor the status the caller needs to act on.
 */
async function readLoginResponse(response: BugSplatResponse<LoginResponse>): Promise<LoginResponse> {
    try {
        return await response.json();
    } catch {
        const body = await response.text().catch(() => '');
        const snippet = body.trim().slice(0, 200);
        const detail = snippet || 'the response body was empty';
        throw new BugSplatApiError(
            `Could not authenticate, the authorize endpoint returned status ${response.status} and a response that isn't JSON: ${detail}`,
            response.status
        );
    }
}

/** Surfaces whatever the server said about the failure, so callers aren't left guessing at the cause. */
function describeLoginFailure(responseJson: LoginResponse, status: number): string {
    const errorResponse = responseJson as ErrorResponse;
    return errorResponse.error_description ?? errorResponse.message ?? errorResponse.error ?? `status ${status}`;
}

/** Retry-After is either a delay in seconds or an HTTP date; only the former is worth reporting. */
function parseRetryAfter(headers: Headers | undefined): number | undefined {
    const value = Number(headers?.get('retry-after'));
    return Number.isFinite(value) && value > 0 ? value : undefined;
}

type ErrorResponse = { error?: string, error_description?: string, message?: string };
type LoginResponse = ErrorResponse | OAuthLoginResponse;