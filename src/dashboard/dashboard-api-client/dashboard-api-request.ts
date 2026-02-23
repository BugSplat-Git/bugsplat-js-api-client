export interface DashboardApiRequest {
    database: string;
    startDate: string;
    endDate: string;
    appNames?: string;
    appVersions?: string;
    timezone?: string;
    interval?: 'hourly' | 'daily';
}
