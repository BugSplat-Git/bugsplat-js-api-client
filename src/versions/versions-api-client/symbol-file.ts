import { UploadableFile } from '@common';

export type SymbolFile = UploadableFile & { dbgId?: string, lastModified?: Date, moduleName?: string }