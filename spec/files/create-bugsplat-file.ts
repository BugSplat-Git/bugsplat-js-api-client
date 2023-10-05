import { UploadableFile } from '@common';
import { createReadStream, ReadStream } from 'fs';
import { stat } from 'fs/promises';
import path from 'path';

export async function createUploadableFile(filePath: string): Promise<UploadableFile> {
    const fileSize = await stat(filePath).then(stats => stats.size);
    const fileName = path.basename(filePath);
    const readableStream = ReadStream.toWeb(createReadStream(filePath));
    return new UploadableFile(fileName, fileSize, readableStream);
}