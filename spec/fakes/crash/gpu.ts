import { GpuBreakdown, GpuCrashSummary } from '@crash';

export const createFakeGpuCrashSummary = (): GpuCrashSummary => ({
    version: 1,
    sources: ['sdk', 'aftermath'],
    api: 'D3D12',
    faultType: 'Hang',
    reason: 'DXGI_ERROR_DEVICE_HUNG',
    adapter: {
        name: 'NVIDIA RTX A5500 Laptop GPU',
        vendor: 'NVIDIA',
        vendorId: 4318,
        deviceId: 9655,
        driverVersion: '595.95',
        vramMB: 4095,
    },
    system: { cpu: '13th Gen Intel(R) Core(TM) i9-13950HX', os: 'Windows 10.0.26200' },
    queues: [
        {
            name: 'Graphics',
            nodes: [
                { name: 'Frame 606', state: 'Active', depth: 0 },
                { name: 'TexturePoolCopyOps', state: 'Active', depth: 1 },
            ],
        },
    ],
    activePath: 'Frame 606 > TexturePoolCopyOps',
    pageFault: null,
    shaders: [],
    aftermath: { present: true, decoded: false, status: 'Timeout', note: 'decoding disabled' },
    gpuDumpExpected: true,
    signature: 'Hang · NVIDIA · TexturePoolCopyOps',
});

export const createFakeGpuBreakdown = (): GpuBreakdown => ({
    total: 120,
    gpuCrashes: 97,
    signatures: [{ signature: 'Hang · NVIDIA · BuildHZB', count: 40, latestCrashId: 123 }],
    faultTypes: [{ value: 'Hang', count: 60 }],
    vendors: [{ value: 'NVIDIA', count: 70 }],
    adapters: [{ value: 'NVIDIA GeForce RTX 4070', count: 30 }],
    drivers: [{ value: 'NVIDIA 595.95', count: 25 }],
    cpus: [{ value: '13th Gen Intel(R) Core(TM) i9-13900K', count: 12 }],
});
