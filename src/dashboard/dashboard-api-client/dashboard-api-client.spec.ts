import { DashboardApiClient } from '@dashboard';
import { createFakeBugSplatApiClient } from '@spec/fakes/common/bugsplat-api-client';
import { createFakeFormData } from '@spec/fakes/common/form-data';
import { createFakeResponseBody } from '@spec/fakes/common/response';
import { DashboardApiResponse } from './dashboard-api-response';

describe('DashboardApiClient', () => {
    const database = 'Fred';
    const startDate = '2026-01-01';
    const endDate = '2026-02-23';

    const fakeDashboardResponse: DashboardApiResponse = {
        status: 'success',
        database,
        volume30Day: 100,
        crashDataDays: 30,
        crashHistory: {
            totalRows: 1,
            totalCrashes: 100,
            rows: [{ appName: 'All', series: [] }],
        },
        recentCrashes: [],
        statusCounts: {
            current: { open: 5, closed: 3, regression: 1, ignored: 0, total: 9 },
            previous: { open: 4, closed: 2, regression: 0, ignored: 1, total: 7 },
        },
        topStackKeys: [],
    };

    let client: DashboardApiClient;
    let fakeBugSplatApiClient;
    let fakeFormData;

    beforeEach(() => {
        fakeFormData = createFakeFormData();
        const fakeResponse = createFakeResponseBody(200, fakeDashboardResponse);
        fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeResponse);
        client = new DashboardApiClient(fakeBugSplatApiClient);
    });

    describe('getDashboard', () => {
        it('should call fetch with required params', async () => {
            await client.getDashboard({ database, startDate, endDate });

            const fetchCall = fakeBugSplatApiClient.fetch.calls.mostRecent();
            const url = fetchCall.args[0] as string;
            expect(url).toContain('/api/dashboard.php?');
            expect(url).toContain('database=Fred');
            expect(url).toContain('startDate=2026-01-01');
            expect(url).toContain('endDate=2026-02-23');
        });

        it('should include appNames when provided', async () => {
            await client.getDashboard({ database, startDate, endDate, appNames: 'MyApp' });

            const url = fakeBugSplatApiClient.fetch.calls.mostRecent().args[0] as string;
            expect(url).toContain('appNames=MyApp');
        });

        it('should include appVersions when provided', async () => {
            await client.getDashboard({ database, startDate, endDate, appVersions: '1.0,2.0' });

            const url = fakeBugSplatApiClient.fetch.calls.mostRecent().args[0] as string;
            expect(url).toContain('appVersions=1.0%2C2.0');
        });

        it('should include timezone when provided', async () => {
            await client.getDashboard({ database, startDate, endDate, timezone: '+05:30' });

            const url = fakeBugSplatApiClient.fetch.calls.mostRecent().args[0] as string;
            expect(url).toContain('timezone=');
        });

        it('should include interval when provided', async () => {
            await client.getDashboard({ database, startDate, endDate, interval: 'hourly' });

            const url = fakeBugSplatApiClient.fetch.calls.mostRecent().args[0] as string;
            expect(url).toContain('interval=hourly');
        });

        it('should not include optional params when not provided', async () => {
            await client.getDashboard({ database, startDate, endDate });

            const url = fakeBugSplatApiClient.fetch.calls.mostRecent().args[0] as string;
            expect(url).not.toContain('appNames');
            expect(url).not.toContain('appVersions');
            expect(url).not.toContain('timezone');
            expect(url).not.toContain('interval');
        });

        it('should return dashboard response', async () => {
            const result = await client.getDashboard({ database, startDate, endDate });

            expect(result.status).toEqual('success');
            expect(result.volume30Day).toEqual(100);
            expect(result.crashDataDays).toEqual(30);
            expect(result.crashHistory.totalCrashes).toEqual(100);
            expect(result.statusCounts.current.total).toEqual(9);
        });

        it('should throw on error response', async () => {
            const errorResponse = createFakeResponseBody(403, { message: 'Access denied' });
            fakeBugSplatApiClient.fetch.and.returnValue(Promise.resolve(errorResponse));

            try {
                await client.getDashboard({ database, startDate, endDate });
                fail('getDashboard was supposed to throw!');
            } catch (error: any) {
                expect(error.message).toEqual('Access denied');
            }
        });
    });
});
