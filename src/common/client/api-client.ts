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
