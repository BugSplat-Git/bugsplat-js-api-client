import type fs from 'fs';

export class UploadableFile {
    constructor(
        public readonly name: string,
        public readonly size: number,
        public readonly file: File | fs.ReadStream | Buffer,
        public readonly lastModifiedDate?: Date,
        public readonly debugId?: string
    ) { }
}