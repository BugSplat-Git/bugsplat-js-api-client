import { UploadableFile } from '@common';
import { createReadStream, ReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { basename } from 'node:path';

export async function createUploadableFile(filePath: string): Promise<UploadableFile> {
    const fileSize = await stat(filePath).then(stats => stats.size);
    const fileName = basename(filePath);
    const readableStream = ReadStream.toWeb(createReadStream(filePath));
    return new UploadableFile(fileName, fileSize, readableStream);
}