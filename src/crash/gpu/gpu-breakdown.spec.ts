import { createFakeGpuBreakdown } from '@spec/fakes/crash/gpu';
import { createGpuBreakdown } from './gpu-breakdown';

describe('createGpuBreakdown', () => {
  it('should return all properties', () => {
    const breakdown = createFakeGpuBreakdown();

    expect(createGpuBreakdown(breakdown)).toEqual(breakdown);
  });

  it('should default missing lists to empty arrays and missing counts to 0', () => {
    expect(createGpuBreakdown({})).toEqual({
      total: 0,
      gpuCrashes: 0,
      signatures: [],
      faultTypes: [],
      vendors: [],
      adapters: [],
      drivers: [],
      cpus: [],
    });
  });

  it('should convert numeric strings to numbers', () => {
    const result = createGpuBreakdown({
      total: '120',
      gpuCrashes: '97',
      signatures: [{ signature: 'Hang · NVIDIA · BuildHZB', count: '40', latestCrashId: '123' }],
      vendors: [{ value: 'NVIDIA', count: '70' }],
    } as any);

    expect(result.total).toEqual(120);
    expect(result.gpuCrashes).toEqual(97);
    expect(result.signatures).toEqual([{ signature: 'Hang · NVIDIA · BuildHZB', count: 40, latestCrashId: 123 }]);
    expect(result.vendors).toEqual([{ value: 'NVIDIA', count: 70 }]);
  });
});
