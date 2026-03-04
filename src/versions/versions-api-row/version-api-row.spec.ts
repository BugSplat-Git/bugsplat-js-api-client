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

    it('should convert totalCrashCount string to number', () => {
        const row = { totalCrashCount: '100' };

        const result = new VersionsApiRow(row as any);

        expect(result.totalCrashCount).toEqual(100);
    });

    it('should convert periodCrashCount string to number', () => {
        const row = { periodCrashCount: '50' };

        const result = new VersionsApiRow(row as any);

        expect(result.periodCrashCount).toEqual(50);
    });

    it('should default totalCrashCount to 0 when undefined', () => {
        const row = {};

        const result = new VersionsApiRow(row as any);

        expect(result.totalCrashCount).toEqual(0);
    });

    it('should default periodCrashCount to 0 when undefined', () => {
        const row = {};

        const result = new VersionsApiRow(row as any);

        expect(result.periodCrashCount).toEqual(0);
    });
});