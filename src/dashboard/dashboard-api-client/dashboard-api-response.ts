export interface DashboardApiResponse {
    status: string;
    database: string;
    volume30Day: number;
    /** Absent until the backend nUploaded change ships; callers should fall back to volume30Day. */
    uploaded30Day?: number;
    crashDataDays: number;
    crashHistory: CrashHistory;
    lastCrashTime: string | null;
    recentCrashes: Array<RecentCrash>;
    statusCounts: StatusCounts;
    topStackKeys: Array<TopStackKey>;
    totalThrottled: number;
    totalThrottledPrevious: number;
}

export interface CrashHistory {
    totalRows: number;
    totalCrashes: number;
    /** Absent until the backend nUploaded change ships; callers should fall back to totalCrashes. */
    totalUploaded?: number;
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
    /** Absent until the backend nUploaded change ships; callers should fall back to totalCrashCount. */
    uploadedCount?: number;
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
