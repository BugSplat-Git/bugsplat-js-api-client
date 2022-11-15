import { VersionsApiRow } from './versions-api-row';

describe('VersionApiRow', () => {
    it('should convert retired \'1\' to true', () => {
        const row = { retired: '1' };

        const result = new VersionsApiRow(row as any);

        expect(result.retired).toEqual(true);
    });

    it('should convert retired 1 to true', () => {
        const row = { retired: 1 };

        const result = new VersionsApiRow(row as any);

        expect(result.retired).toEqual(true);
    });

    it('should convert retired \'0\' to false', () => {
        const row = { retired: '0' };

        const result = new VersionsApiRow(row as any);

        expect(result.retired).toEqual(false);
    });

    it('should convert retired 0 to false', () => {
        const row = { retired: 0 };

        const result = new VersionsApiRow(row as any);

        expect(result.retired).toEqual(false);
    });
});