import type { ReadableStream } from 'node:stream/web';

// A stream cannot be closed if there's an active reader.
// Try and cancel the stream, and ignore the error that's thrown if it's locked.
// This is exactly what the official node.js fetch implementation does.
// https://github.com/nodejs/node/issues/42411#issuecomment-1073284684
// https://github.com/nodejs/node/blob/15b39026197437493af224f0fe69aa878ec1abd3/deps/undici/src/lib/web/fetch/index.js#L331-L336
export async function safeCancel(stream: ReadableStream): Promise<void> {
    return stream.cancel().catch((err) => {
        if (err.code === 'ERR_INVALID_STATE') {
            // Node bug?
            return;
        }
        throw err;
    });
}