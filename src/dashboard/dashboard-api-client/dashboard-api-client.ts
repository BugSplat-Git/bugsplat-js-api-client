import { ApiClient } from '@common';
import { DashboardApiRequest } from './dashboard-api-request';
import { DashboardApiResponse } from './dashboard-api-response';

export class DashboardApiClient {

    constructor(private _client: ApiClient) { }

    async getDashboard(request: DashboardApiRequest): Promise<DashboardApiResponse> {
        const params = new URLSearchParams({
            database: request.database,
        });

        if (request.startDate) {
            params.set('startDate', request.startDate);
        }

        if (request.endDate) {
            params.set('endDate', request.endDate);
        }

        if (request.appNames) {
            params.set('appNames', request.appNames);
        }

        if (request.appVersions) {
            params.set('appVersions', request.appVersions);
        }

        if (request.timezone) {
            params.set('timezone', request.timezone);
        }

        if (request.interval) {
            params.set('interval', request.interval);
        }

        const response = await this._client.fetch<DashboardApiResponse>(
            `/api/dashboard.php?${params}`
        );

        if (response.status !== 200) {
            const error = await response.json() as { message?: string };
            throw new Error(error.message ?? 'Failed to fetch dashboard data');
        }

        return response.json();
    }
}
