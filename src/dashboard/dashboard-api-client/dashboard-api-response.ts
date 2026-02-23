export interface DashboardApiResponse {
    status: string;
    database: string;
    volume30Day: number;
    crashDataDays: number;
    crashHistory: CrashHistory;
    recentCrashes: Array<RecentCrash>;
    statusCounts: StatusCounts;
    topStackKeys: Array<TopStackKey>;
}

export interface CrashHistory {
    totalRows: number;
    totalCrashes: number;
    rows: Array<CrashHistoryRow>;
}

export interface CrashHistoryRow {
    appName: string;
    appVersion?: string;
    series: Array<CrashHistoryDataPoint>;
}

export interface CrashHistoryDataPoint {
    timestamp: number;
    totalCrashCount: number;
    throttleCrashCount: number;
    retireCrashCount: number;
    day?: number;
    hour?: string;
}

export interface RecentCrash {
    id: number;
    status: number;
    stackKey: string;
    stackKeyId: number;
    crashTime: string;
    appName: string;
    appVersion: string;
    exceptionMessage: string;
}

export interface StatusCounts {
    current: StatusCountGroup;
    previous: StatusCountGroup;
}

export interface StatusCountGroup {
    open: number;
    closed: number;
    regression: number;
    ignored: number;
    total: number;
}

export interface TopStackKey {
    stackKey: string;
    stackKeyId: number;
    crashSum: number;
}
