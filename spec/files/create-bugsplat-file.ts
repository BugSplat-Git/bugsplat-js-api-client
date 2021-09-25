import { BugSplatFile } from '@common';
import fs, { statSync } from 'fs';
import path from 'path';

export function createBugSplatFile(filePath: string): BugSplatFile {
    const fileSize = statSync(filePath).size;
    const fileName = path.basename(filePath);
    return new BugSplatFile(fileName, fileSize, fs.createReadStream(filePath));
}