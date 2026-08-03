export interface ApiClient {
    createFormData(): FormData;
    fetch<T>(route: string, init?: RequestInit): Promise<BugSplatResponse<T>>;
}

export interface BugSplatResponse<T = unknown> {
    status: number;
    body: ReadableStream<Uint8Array> | null;
    json: () => Promise<T>;
    text: () => Promise<string>;
}

export class BugSplatAuthenticationError extends Error {
    readonly isAuthenticationError = true;
}

/**
 * An unsuccessful HTTP response to a request this client made — either to the BugSplat API, or to the
 * S3 presigned URL a symbol upload is PUT to. Carries the status so callers can decide how to react —
 * for example retrying a 5xx or a 429, but failing fast on a 403 that no amount of retrying fixes.
 */
export class BugSplatApiError extends Error {
    readonly isApiError = true;

    constructor(
        message: string,
        readonly status: number
    ) {
        super(message);
        // The cjs build targets es5, where subclassing Error leaves instances on Error.prototype and
        // breaks instanceof. Restore the chain so callers can use instanceof as well as isApiError.
        Object.setPrototypeOf(this, BugSplatApiError.prototype);
        this.name = 'BugSplatApiError';
    }
}

export class BugSplatRateLimitError extends BugSplatApiError {
    readonly isRateLimitError = true;

    constructor(message: string, status = 429) {
        super(message, status);
        Object.setPrototypeOf(this, BugSplatRateLimitError.prototype);
        this.name = 'BugSplatRateLimitError';
    }
}
