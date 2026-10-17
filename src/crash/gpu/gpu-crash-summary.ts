/**
 * Normalized GPU crash summary returned as `gpu` by `/api/crash/details`.
 *
 * The backend writes this for crashes it recognises as GPU crashes (DRED / SDK JSON,
 * Unreal GPU breadcrumbs and logs, NVIDIA Aftermath dumps). Non-GPU crashes have `gpu: null`.
 * Every field except `version` is optional because any source may be missing.
 */
export interface GpuCrashSummary {
  version: number;
  sources?: Array<GpuSummarySource>;
  api?: string;
  faultType?: GpuFaultType;
  reason?: string;
  adapter?: GpuAdapter;
  system?: GpuSystem;
  queues?: Array<GpuQueue>;
  activePath?: string;
  pageFault?: GpuPageFault | null;
  shaders?: Array<GpuShader>;
  aftermath?: GpuAftermathStatus;
  gpuDumpExpected?: boolean;
  signature?: string;
}

export type GpuSummarySource = 'sdk' | 'unreal-crashcontext' | 'unreal-log' | 'aftermath';

export type GpuFaultType = 'Hang' | 'PageFault' | 'DeviceRemoved' | 'DeviceReset' | 'DriverError' | 'Unknown';

export type GpuBreadcrumbState = 'Active' | 'Finished' | 'NotStarted';

export type GpuResourceState = 'Live' | 'Freed';

export interface GpuAdapter {
  name?: string;
  vendor?: string;
  vendorId?: number;
  deviceId?: number;
  driverVersion?: string;
  vramMB?: number;
}

export interface GpuSystem {
  cpu?: string;
  os?: string;
}

export interface GpuQueue {
  name?: string;
  nodes?: Array<GpuBreadcrumbNode>;
}

export interface GpuBreadcrumbNode {
  name?: string;
  state?: GpuBreadcrumbState;
  depth?: number;
}

export interface GpuPageFault {
  address?: string;
  resources?: Array<GpuPageFaultResource>;
}

export interface GpuPageFaultResource {
  name?: string;
  type?: string;
  state?: GpuResourceState;
}

export interface GpuShader {
  name?: string;
  hash?: string;
  stage?: string;
  faulted?: boolean;
  source?: string;
}

export interface GpuAftermathStatus {
  present?: boolean;
  decoded?: boolean;
  status?: string;
  note?: string;
}

/**
 * Accepts the `gpu` value from a crash details response. The backend sends a decoded object;
 * a JSON string (the raw column) is parsed too. Anything without a numeric `version` is `null`.
 */
export function createGpuCrashSummary(value: unknown): GpuCrashSummary | null {
  let candidate = value;

  if (typeof candidate === 'string') {
    try {
      candidate = JSON.parse(candidate);
    } catch {
      return null;
    }
  }

  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return null;
  }

  if (typeof (candidate as GpuCrashSummary).version !== 'number') {
    return null;
  }

  return candidate as GpuCrashSummary;
}
