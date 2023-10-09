import { UploadableFile } from '@common';
import type { ReadableStream } from 'node:stream/web';

export type SymbolFile = UploadableFile & { dbgId?: string, lastModified?: Date, moduleName?: string, uncompressedSize: number };
export type GZippedSymbolFile = Omit<Required<SymbolFile>, 'file'> &  { file: ReadableStream };
