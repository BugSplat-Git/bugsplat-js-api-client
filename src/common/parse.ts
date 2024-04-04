export function safeParseJson(json: string | undefined): Record<string, unknown> {
    if (!json) {
        return {};
    }

    try {
        return JSON.parse(json);
    } catch {
        return {};
    }
}