export interface ApiClient {
    createFormData(): FormData;
    fetch<T>(route: string, init?: RequestInit): Promise<BugSplatResponse<T>>;
}

export interface BugSplatResponse<T = unknown> {
    status: number;
    json: () => Promise<T>;
    text: () => Promise<string>;
}
