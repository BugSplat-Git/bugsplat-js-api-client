// We support uploading files via a read stream, but depending on fs directly is not supported in browser.
// Webpack will fail when building a package that relies on fs (even for types).
// This is a copy from fs.d.ts for the type returned by fs.createReadStream() to satisfy the TypeScript compiler.
export interface ReadStream {
    close(): void;
    bytesRead: number;
    path: string | Buffer;
    pending: boolean;

    /**
     * events.EventEmitter
     *   1. open
     *   2. close
     *   3. ready
     */
    addListener(event: "close", listener: () => void): this;
    addListener(event: "data", listener: (chunk: Buffer | string) => void): this;
    addListener(event: "end", listener: () => void): this;
    addListener(event: "error", listener: (err: Error) => void): this;
    addListener(event: "open", listener: (fd: number) => void): this;
    addListener(event: "pause", listener: () => void): this;
    addListener(event: "readable", listener: () => void): this;
    addListener(event: "ready", listener: () => void): this;
    addListener(event: "resume", listener: () => void): this;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;

    on(event: "close", listener: () => void): this;
    on(event: "data", listener: (chunk: Buffer | string) => void): this;
    on(event: "end", listener: () => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: "open", listener: (fd: number) => void): this;
    on(event: "pause", listener: () => void): this;
    on(event: "readable", listener: () => void): this;
    on(event: "ready", listener: () => void): this;
    on(event: "resume", listener: () => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this;

    once(event: "close", listener: () => void): this;
    once(event: "data", listener: (chunk: Buffer | string) => void): this;
    once(event: "end", listener: () => void): this;
    once(event: "error", listener: (err: Error) => void): this;
    once(event: "open", listener: (fd: number) => void): this;
    once(event: "pause", listener: () => void): this;
    once(event: "readable", listener: () => void): this;
    once(event: "ready", listener: () => void): this;
    once(event: "resume", listener: () => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;

    prependListener(event: "close", listener: () => void): this;
    prependListener(event: "data", listener: (chunk: Buffer | string) => void): this;
    prependListener(event: "end", listener: () => void): this;
    prependListener(event: "error", listener: (err: Error) => void): this;
    prependListener(event: "open", listener: (fd: number) => void): this;
    prependListener(event: "pause", listener: () => void): this;
    prependListener(event: "readable", listener: () => void): this;
    prependListener(event: "ready", listener: () => void): this;
    prependListener(event: "resume", listener: () => void): this;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this;

    prependOnceListener(event: "close", listener: () => void): this;
    prependOnceListener(event: "data", listener: (chunk: Buffer | string) => void): this;
    prependOnceListener(event: "end", listener: () => void): this;
    prependOnceListener(event: "error", listener: (err: Error) => void): this;
    prependOnceListener(event: "open", listener: (fd: number) => void): this;
    prependOnceListener(event: "pause", listener: () => void): this;
    prependOnceListener(event: "readable", listener: () => void): this;
    prependOnceListener(event: "ready", listener: () => void): this;
    prependOnceListener(event: "resume", listener: () => void): this;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
}

// interface Readable extends NodeJS.ReadableStream {
//     readable: boolean;
//     readonly readableEncoding: BufferEncoding | null;
//     readonly readableEnded: boolean;
//     readonly readableFlowing: boolean | null;
//     readonly readableHighWaterMark: number;
//     readonly readableLength: number;
//     readonly readableObjectMode: boolean;
//     destroyed: boolean;
//     constructor(opts?: ReadableOptions);
//     _construct?(callback: (error?: Error | null) => void): void;
//     _read(size: number): void;
//     read(size?: number): any;
//     setEncoding(encoding: BufferEncoding): this;
//     pause(): this;
//     resume(): this;
//     isPaused(): boolean;
//     unpipe(destination?: NodeJS.WritableStream): this;
//     unshift(chunk: any, encoding?: BufferEncoding): void;
//     wrap(oldStream: NodeJS.ReadableStream): this;
//     push(chunk: any, encoding?: BufferEncoding): boolean;
//     _destroy(error: Error | null, callback: (error?: Error | null) => void): void;
//     destroy(error?: Error): void;

//     /**
//      * Event emitter
//      * The defined events on documents including:
//      * 1. close
//      * 2. data
//      * 3. end
//      * 4. error
//      * 5. pause
//      * 6. readable
//      * 7. resume
//      */
//     addListener(event: "close", listener: () => void): this;
//     addListener(event: "data", listener: (chunk: any) => void): this;
//     addListener(event: "end", listener: () => void): this;
//     addListener(event: "error", listener: (err: Error) => void): this;
//     addListener(event: "pause", listener: () => void): this;
//     addListener(event: "readable", listener: () => void): this;
//     addListener(event: "resume", listener: () => void): this;
//     addListener(event: string | symbol, listener: (...args: any[]) => void): this;

//     emit(event: "close"): boolean;
//     emit(event: "data", chunk: any): boolean;
//     emit(event: "end"): boolean;
//     emit(event: "error", err: Error): boolean;
//     emit(event: "pause"): boolean;
//     emit(event: "readable"): boolean;
//     emit(event: "resume"): boolean;
//     emit(event: string | symbol, ...args: any[]): boolean;

//     on(event: "close", listener: () => void): this;
//     on(event: "data", listener: (chunk: any) => void): this;
//     on(event: "end", listener: () => void): this;
//     on(event: "error", listener: (err: Error) => void): this;
//     on(event: "pause", listener: () => void): this;
//     on(event: "readable", listener: () => void): this;
//     on(event: "resume", listener: () => void): this;
//     on(event: string | symbol, listener: (...args: any[]) => void): this;

//     once(event: "close", listener: () => void): this;
//     once(event: "data", listener: (chunk: any) => void): this;
//     once(event: "end", listener: () => void): this;
//     once(event: "error", listener: (err: Error) => void): this;
//     once(event: "pause", listener: () => void): this;
//     once(event: "readable", listener: () => void): this;
//     once(event: "resume", listener: () => void): this;
//     once(event: string | symbol, listener: (...args: any[]) => void): this;

//     prependListener(event: "close", listener: () => void): this;
//     prependListener(event: "data", listener: (chunk: any) => void): this;
//     prependListener(event: "end", listener: () => void): this;
//     prependListener(event: "error", listener: (err: Error) => void): this;
//     prependListener(event: "pause", listener: () => void): this;
//     prependListener(event: "readable", listener: () => void): this;
//     prependListener(event: "resume", listener: () => void): this;
//     prependListener(event: string | symbol, listener: (...args: any[]) => void): this;

//     prependOnceListener(event: "close", listener: () => void): this;
//     prependOnceListener(event: "data", listener: (chunk: any) => void): this;
//     prependOnceListener(event: "end", listener: () => void): this;
//     prependOnceListener(event: "error", listener: (err: Error) => void): this;
//     prependOnceListener(event: "pause", listener: () => void): this;
//     prependOnceListener(event: "readable", listener: () => void): this;
//     prependOnceListener(event: "resume", listener: () => void): this;
//     prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;

//     removeListener(event: "close", listener: () => void): this;
//     removeListener(event: "data", listener: (chunk: any) => void): this;
//     removeListener(event: "end", listener: () => void): this;
//     removeListener(event: "error", listener: (err: Error) => void): this;
//     removeListener(event: "pause", listener: () => void): this;
//     removeListener(event: "readable", listener: () => void): this;
//     removeListener(event: "resume", listener: () => void): this;
//     removeListener(event: string | symbol, listener: (...args: any[]) => void): this;

//     [Symbol.asyncIterator](): AsyncIterableIterator<any>;
// }

// interface ReadableOptions extends StreamOptions<Readable> {
//     encoding?: BufferEncoding;
//     read?(this: Readable, size: number): void;
// }

// interface StreamOptions<T extends Stream> extends Abortable {
//     emitClose?: boolean;
//     highWaterMark?: number;
//     objectMode?: boolean;
//     construct?(this: T, callback: (error?: Error | null) => void): void;
//     destroy?(this: T, error: Error | null, callback: (error: Error | null) => void): void;
//     autoDestroy?: boolean;
// }

// interface Stream {
//     constructor(opts?: ReadableOptions);
// }