import { ApiClient, BugSplatResponse, TableDataResponse } from '@common';
import { UsersTableDataRequest } from './users-table-data-request';
import { UsersApiRow } from './users-api-row';

const USERS_BASE_URL = '/api/user/users.php';
export class UsersApiClient {
  constructor(private _client: ApiClient) {}

  async getUsers(
    request: UsersTableDataRequest
  ): Promise<TableDataResponse<UsersApiRow>> {
    const { database, companyId, email } = request;
    if (database && companyId) {
      throw new Error('Cannot specify both database and companyId');
    }
    if (!database && !companyId) {
      throw new Error('Must specify either database or companyId');
    }
    const params = new URLSearchParams();
    if (database) {
      params.append('database', database);
    }
    if (companyId) {
      params.append('companyId', companyId.toString());
    }
    if (email) {
      params.append('username', email);
    }
    const url = `${USERS_BASE_URL}?${params.toString()}`;
    const response = await this._client.fetch<Array<UsersApiRow>>(url);
    const rows = await response.json();

    return {
      rows,
    };
  }

  async addUserToDatabase(
    database: string,
    email: string
  ): Promise<BugSplatResponse<AddUserResponse>> {
    const formData = this._client.createFormData();
    formData.append('database', database);
    formData.append('username', email);
    const request = {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'include',
      redirect: 'follow',
      body: formData,
    } as RequestInit;

    const response = await this._client.fetch<AddUserResponse>(
      USERS_BASE_URL,
      request
    );
    if (response.status !== 200) {
      throw new Error(
        `Error adding user ${email} to database ${database} status ${response.status}`
      );
    }

    return response;
  }

  async removeUserFromDatabase(
    database: string,
    email: string
  ): Promise<BugSplatResponse<UsersApiResponse>> {
    const url = `${USERS_BASE_URL}?database=${database}&username=${encodeURIComponent(
      email
    )}`;
    const request = {
      method: 'DELETE',
      cache: 'no-cache',
      credentials: 'include',
      redirect: 'follow',
    } as RequestInit;

    const response = await this._client.fetch<UsersApiResponse>(url, request);
    if (response.status !== 200) {
      throw new Error(
        `Error remove user ${email} for ${database} status ${response.status}`
      );
    }

    return response;
  }

  async updateUserForDatabase(
    database: string,
    email: string,
    isRestricted: boolean
  ): Promise<BugSplatResponse<AddUserResponse>> {
    const rights = isRestricted ? '0' : '1';
    const formData = this._client.createFormData();
    formData.append('database', database);
    formData.append('username', email);
    formData.append('rights', rights);

    const request = {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'include',
      redirect: 'follow',
      body: formData,
    } as RequestInit;

    const response = await this._client.fetch<AddUserResponse>(
      USERS_BASE_URL,
      request
    );
    if (response.status !== 200) {
      throw new Error(
        `Error updating user ${email} in database ${database} status ${response.status}`
      );
    }

    return response;
  }

  async addUserToCompany(
    companyId: number,
    email: string
  ): Promise<BugSplatResponse<AddUserResponse>> {
    const formData = this._client.createFormData();
    formData.append('companyId', companyId.toString());
    formData.append('username', email);
    const request = {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'include',
      redirect: 'follow',
      body: formData,
    } as RequestInit;

    const response = await this._client.fetch<AddUserResponse>(
      USERS_BASE_URL,
      request
    );
    if (response.status !== 200) {
      throw new Error(
        `Error adding user ${email} to company ${companyId} status ${response.status}`
      );
    }

    return response;
  }

  async removeUserFromCompany(
    companyId: number,
    uId: number
  ): Promise<BugSplatResponse<UsersApiResponse>> {
    const url = `${USERS_BASE_URL}?companyId=${companyId}&uId=${uId}`;
    const request = {
      method: 'DELETE',
      cache: 'no-cache',
      credentials: 'include',
      redirect: 'follow',
    } as RequestInit;

    const response = await this._client.fetch<UsersApiResponse>(url, request);
    if (response.status !== 200) {
      throw new Error(
        `Error removing user ${uId} for company ${companyId} status ${response.status}`
      );
    }

    return response;
  }
}

export enum UserApiResponseStatus {
  success = 'success',
  warning = 'warning',
  fail = 'fail',
}

export interface UsersApiResponse {
  status: UserApiResponseStatus;
  message?: string;
}

export interface AddUserResponse extends UsersApiResponse {
  database?: string;
  companyId?: number;
  uId: number;
}
