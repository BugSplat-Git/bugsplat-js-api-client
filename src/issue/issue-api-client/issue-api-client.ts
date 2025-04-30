import { ApiClient, BugSplatResponse } from '@common';
import ac from 'argument-contracts';

export class IssueApiClient {
  constructor(private _client: ApiClient) {}

  postStackKeyIssue(
    database: string,
    stackKeyId: number,
    notes: string,
    linkDefectId?: string
  ): Promise<BugSplatResponse<IssuePostSuccessResponse>> {
    ac.assertNonWhiteSpaceString(database, 'database');
    if (stackKeyId <= 0) {
      throw new Error(
        `Expected stackKeyId to be a positive non-zero number. Value received: "${stackKeyId}"`
      );
    }

    const method = 'POST';
    const body = this._client.createFormData();
    const duplex = 'half';

    body.append('database', database);
    body.append('stackKeyId', `${stackKeyId}`);
    body.append('notes', notes);

    if (linkDefectId) {
      body.append('linkDefectId', linkDefectId);
    }

    return this._client.fetch('/api/logDefect', {
      method,
      body,
      duplex,
    } as RequestInit);
  }

  deleteStackKeyIssue(
    database: string,
    stackKeyId: number
  ): Promise<BugSplatResponse<IssueDeleteSuccessResponse>> {
    return this._client.fetch(`/api/logDefect?database=${database}&stackKeyId=${stackKeyId}`, {
      method: 'DELETE',
    });
  }
}

type IssuePostSuccessResponse = { status: string; stackKeyId: number; defectId: string };
type IssueDeleteSuccessResponse = { status: string; stackKeyId: number };
