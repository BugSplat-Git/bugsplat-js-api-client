import { BugSplatApiClient } from '../../common';
import { AdditionalInfo, GroupableThreadCollection } from '..';
import ac from 'argument-contracts';
import assert from 'assert/strict';

export class CrashApiClient {

    constructor(private _client: BugSplatApiClient) { }

    async getCrashById(database: string, id: number): Promise<CrashResponse> {
        ac.assertNonWhiteSpaceString(database, 'database');
        if (id <= 0) {
            throw new Error(`Expected id to be a positive non-zero number. Value received: "${id}"`);
        }

        const formData = this._client.createFormData();
        formData.append('database', database);
        formData.append('id', id.toString());

        const init = {
            method: 'POST',
            body: formData,
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow'
        };

        const response = await this._client.fetch('/api/crash/data.php', <any>init);
        const json = await response.json();

        if (response.status !== 200) {
            throw new Error(json.message);
        }
        return json;
    }
}

export enum DefectTrackerType {
    None = 'None',
    FogBugz = 'FogBugz',
    Jira = 'Jira',
    Azure = 'Azure DevOps',
    YouTrack = 'YouTrack',
    GitHub = 'GitHub',
    Assembla = 'Assembla'
}

export enum ProcessingStatus {
    Processing,
    ActiveThreadComplete,
    Complete
}

export interface CrashResponse {
    processed: ProcessingStatus;

    additionalFiles?: Array<string>;
    appKey?: string;
    appName?: string;
    appVersion?: string;
    comments?: string;
    crashTime?: string;
    defectTrackerType?: DefectTrackerType;
    defectLabel?: string;
    defectUrl?: string;
    description?: string;
    dumpfile?: string;
    email?: string;
    events: Array<any>;
    exceptionCode?: string;
    exceptionMessage?: string;
    id?: number;
    ipAddress?: string;
    missingSymbols?: boolean;
    nextCrashId?: number;
    platform?: string;
    previousCrashId?: number;
    processor?: string;
    stackKeyId?: number;
    stackKeyDefectLabel?: string;
    stackKeyDefectUrl?: string;
    thread?: GroupableThreadCollection;
    user?: string;
    debuggerOutput?: AdditionalInfo;
}