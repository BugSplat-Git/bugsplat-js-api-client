import { UploadableFile } from '@common';
import type { ReadableStream } from 'node:stream/web';

export type SymbolFile = UploadableFile & { dbgId?: string, lastModified?: Date, moduleName?: string };
export type GZippedSymbolFile = Omit<Required<SymbolFile>, 'file'> &  { file: ReadableStream, uncompressedSize: number };
