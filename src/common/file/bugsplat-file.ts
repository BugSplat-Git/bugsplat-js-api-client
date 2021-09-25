import type fs from 'fs';

export class BugSplatFile {
    constructor(
        public readonly name: string,
        public readonly size: number,
        public readonly file: File | fs.ReadStream
    ) { }
}