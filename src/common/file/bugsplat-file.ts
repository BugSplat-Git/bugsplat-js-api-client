import type { ReadableStream } from 'node:stream/web';

export class UploadableFile {
    constructor(
        public readonly name: string,
        public readonly size: number,
        public readonly file: File | Buffer | ReadableStream
    ) { }
}