import { SymbolFile } from '@common';
import { stat } from 'node:fs/promises';
import { createUploadableFile } from './create-bugsplat-file';

export async function createSymbolFile(path: string): Promise<SymbolFile> {
    const uploadableFile = await createUploadableFile(path);
    const uncompressedSize = await stat(path).then(stats => stats.size);
    return {
        ...uploadableFile,
        uncompressedSize
    };
}