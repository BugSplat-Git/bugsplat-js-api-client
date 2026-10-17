import { createFakeGpuCrashSummary } from '@spec/fakes/crash/gpu';
import { createGpuCrashSummary } from './gpu-crash-summary';

describe('createGpuCrashSummary', () => {
  it('should return the summary when given an object with a version', () => {
    const gpu = createFakeGpuCrashSummary();

    expect(createGpuCrashSummary(gpu)).toEqual(gpu);
  });

  it('should parse the summary when given a JSON string', () => {
    const gpu = createFakeGpuCrashSummary();

    expect(createGpuCrashSummary(JSON.stringify(gpu))).toEqual(gpu);
  });

  it('should accept a summary that only has a version', () => {
    expect(createGpuCrashSummary({ version: 1 })).toEqual({ version: 1 });
  });

  it('should return null for null or undefined', () => {
    expect(createGpuCrashSummary(null)).toBeNull();
    expect(createGpuCrashSummary(undefined)).toBeNull();
  });

  it('should return null for an invalid JSON string', () => {
    expect(createGpuCrashSummary('{ not json')).toBeNull();
    expect(createGpuCrashSummary('')).toBeNull();
  });

  it('should return null when version is missing', () => {
    expect(createGpuCrashSummary({ api: 'D3D12' })).toBeNull();
  });

  it('should return null for arrays and primitives', () => {
    expect(createGpuCrashSummary([{ version: 1 }])).toBeNull();
    expect(createGpuCrashSummary(42)).toBeNull();
  });
});
