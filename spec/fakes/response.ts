export function createFakeSuccessResponseBody(status, json, headers) {
    return {
        status: status,
        json: async() => (json),
        ok: true,
        headers: { get: () => headers }
    };
}