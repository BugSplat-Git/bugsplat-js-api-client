import { SymbolDetailsApiRow } from './symbol-details-api-row';

describe('SymbolDetailsApiRow', () => {
    it('should keep size as a number', () => {
        const row = { size: 1047851 };

        const result = new SymbolDetailsApiRow(row as any);

        expect(result.size).toEqual(1047851);
    });

    it('should convert size string to number', () => {
        const row = { size: '1047851' };

        const result = new SymbolDetailsApiRow(row as any);

        expect(result.size).toEqual(1047851);
    });

    it('should default size to 0 when undefined', () => {
        const row = {};

        const result = new SymbolDetailsApiRow(row as any);

        expect(result.size).toEqual(0);
    });

    it('should preserve null for nullable columns', () => {
        const row = { s3Bucket: null, symbolType: null, guid: null, lastUploaded: null, lastModified: null, lastAccessed: null };

        const result = new SymbolDetailsApiRow(row as any);

        expect(result.s3Bucket).toBeNull();
        expect(result.symbolType).toBeNull();
        expect(result.guid).toBeNull();
        expect(result.lastUploaded).toBeNull();
        expect(result.lastModified).toBeNull();
        expect(result.lastAccessed).toBeNull();
    });

    it('should default string columns to an empty string when undefined', () => {
        const row = {};

        const result = new SymbolDetailsApiRow(row as any);

        expect(result.application).toEqual('');
        expect(result.version).toEqual('');
        expect(result.moduleName).toEqual('');
        expect(result.s3Key).toEqual('');
        expect(result.downloadFile).toEqual('');
    });

    it('should freeze the row', () => {
        const result = new SymbolDetailsApiRow({} as any);

        expect(Object.isFrozen(result)).toEqual(true);
    });
});
