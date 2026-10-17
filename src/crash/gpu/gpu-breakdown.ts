/**
 * GPU sub-groups for one crash group, returned by `/api/crash/gpu-breakdown`.
 * Each list is sorted by count descending and holds at most 20 entries.
 */
export interface GpuBreakdown {
  total: number;
  gpuCrashes: number;
  signatures: Array<GpuSignatureCount>;
  faultTypes: Array<GpuValueCount>;
  vendors: Array<GpuValueCount>;
  adapters: Array<GpuValueCount>;
  drivers: Array<GpuValueCount>;
  cpus: Array<GpuValueCount>;
}

export interface GpuSignatureCount {
  signature: string;
  count: number;
  latestCrashId: number;
}

export interface GpuValueCount {
  value: string;
  count: number;
}

export type GpuBreakdownRawResponse = Partial<GpuBreakdown>;

export function createGpuBreakdown(response: GpuBreakdownRawResponse): GpuBreakdown {
  return {
    total: toNumber(response.total),
    gpuCrashes: toNumber(response.gpuCrashes),
    signatures: (response.signatures ?? []).map((row) => ({
      signature: row.signature ?? '',
      count: toNumber(row.count),
      latestCrashId: toNumber(row.latestCrashId),
    })),
    faultTypes: toValueCounts(response.faultTypes),
    vendors: toValueCounts(response.vendors),
    adapters: toValueCounts(response.adapters),
    drivers: toValueCounts(response.drivers),
    cpus: toValueCounts(response.cpus),
  };
}

function toValueCounts(rows: Array<GpuValueCount> | undefined): Array<GpuValueCount> {
  return (rows ?? []).map((row) => ({ value: row.value ?? '', count: toNumber(row.count) }));
}

// MySQL aggregates can arrive as strings through PHP; normalize so consumers can do math.
function toNumber(value: unknown): number {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
}
