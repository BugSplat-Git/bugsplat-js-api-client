import { UploadableFile } from '@common';
import fs, { statSync } from 'fs';
import path from 'path';

export function createUploadableFile(filePath: string): UploadableFile {
    const fileSize = statSync(filePath).size;
    const fileName = path.basename(filePath);
    return new UploadableFile(fileName, fileSize, fs.createReadStream(filePath));
}