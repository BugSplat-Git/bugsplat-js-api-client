export function createFakeResponseBody(
    status: number,
    json: any = {},
    headers: any = []
) {
    return {
        status: status,
        json: async() => (json),
        ok: true,
        headers: { get: () => headers }
    };
}