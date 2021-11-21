export function createFakeResponseBody(
    status: number,
    json: any = {},
    ok = true,
    headers: any = []
) {
    return {
        status,
        ok,
        json: async() => (json),
        headers: { get: () => headers }
    };
}