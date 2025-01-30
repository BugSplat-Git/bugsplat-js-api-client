import { createFakeBugSplatApiClient } from '@spec/fakes/common/bugsplat-api-client';
import { createFakeFormData } from '@spec/fakes/common/form-data';
import { createFakeResponseBody } from '@spec/fakes/common/response';
import { UsersApiClient } from './users-api-client';
import { UsersApiRow } from './users-api-row';

describe('UsersApiClient', () => {
  let sut: UsersApiClient;

  let apiClient;
  let apiClientResponse;
  let companyId;
  let database;
  let fakeFormData;
  let rows;

  beforeEach(() => {
    companyId = 123;
    database = 'zzz';
    rows = [new UsersApiRow(1, 'x', 1, 'y', 'z', 1, 1, 'a', 'b')];
    fakeFormData = createFakeFormData();
    apiClientResponse = createFakeResponseBody(200, rows);
    apiClient = createFakeBugSplatApiClient(fakeFormData, apiClientResponse);

    sut = new UsersApiClient(apiClient);
  });

  describe('getUsers', () => {
    let result;
    let request;

    beforeEach(async () => {
      request = { database };
      result = await sut.getUsers(request);
    });

    it('should throw if both database and companyId are specified', async () => {
      request = { database, companyId: 1 };
      await expectAsync(sut.getUsers(request)).toBeRejectedWithError(
        'Cannot specify both database and companyId'
      );
    });

    it('should throw if neither database nor companyId are specified', async () => {
      request = {};
      await expectAsync(sut.getUsers(request)).toBeRejectedWithError(
        'Must specify either database or companyId'
      );
    });

    it('should call fetch with url containing database param', () => {
      expect(apiClient.fetch).toHaveBeenCalledWith(
        `/api/user/users.php?database=${database}`
      );
    });

    it('should call fetch with url containing companyId param', async () => {
      request = { companyId: 1 };
      await sut.getUsers(request);
      expect(apiClient.fetch).toHaveBeenCalledWith(
        `/api/user/users.php?companyId=${request.companyId}`
      );
    });

    it('should return rows from response', () => {
      expect(result.rows).toEqual(rows);
    });
  });

  describe('addUserToDatabase', () => {
    let result;
    let email;

    beforeEach(async () => {
      email = '☕️';
      result = await sut.addUserToDatabase(database, email);
    });

    it('should call createFormData', () => {
      expect(apiClient.createFormData).toHaveBeenCalled();
    });

    it('should call append with database and email', () => {
      expect(fakeFormData.append).toHaveBeenCalledWith('database', database);
      expect(fakeFormData.append).toHaveBeenCalledWith('username', email);
    });

    it('should call fetch with url and request containing formData', () => {
      expect(apiClient.fetch).toHaveBeenCalledWith(
        '/api/user/users.php',
        jasmine.objectContaining({ method: 'POST', body: fakeFormData })
      );
    });

    it('should return response', () => {
      expect(result).toEqual(apiClientResponse);
    });
  });

  describe('removeUserFromDatabase', () => {
    let result;
    let email;

    beforeEach(async () => {
      email = 'test@bugsplat.com';
      result = await sut.removeUserFromDatabase(database, email);
    });

    it('should call fetch with url', () => {
      expect(apiClient.fetch).toHaveBeenCalledWith(
        `/api/user/users.php?database=${database}&username=${encodeURIComponent(
          email
        )}`,
        jasmine.objectContaining({ method: 'DELETE' })
      );
    });

    it('should return response', () => {
      expect(result).toEqual(apiClientResponse);
    });
  });

  describe('updateUserForDatabase', () => {
    let result;
    let email;
    let isRestricted;

    beforeEach(async () => {
      email = 'fred@bugsplat.com';
      isRestricted = true;
      result = await sut.updateUserForDatabase(database, email, isRestricted);
    });

    it('should call createFormData', () => {
      expect(apiClient.createFormData).toHaveBeenCalled();
    });

    it('should call append with database and email', () => {
      expect(fakeFormData.append).toHaveBeenCalledWith('database', database);
      expect(fakeFormData.append).toHaveBeenCalledWith('username', email);
      expect(fakeFormData.append).toHaveBeenCalledWith(
        'rights',
        isRestricted ? '0' : '1'
      );
    });

    it('should call fetch with url and request containing formData', () => {
      expect(apiClient.fetch).toHaveBeenCalledWith(
        '/api/user/users.php',
        jasmine.objectContaining({ method: 'POST', body: fakeFormData })
      );
    });

    it('should return response', () => {
      expect(result).toEqual(apiClientResponse);
    });
  });

  describe('addUserToCompany', () => {
    let result;
    let email;

    beforeEach(async () => {
      email = '☕️';
      result = await sut.addUserToCompany(companyId, email);
    });

    it('should call createFormData', () => {
      expect(apiClient.createFormData).toHaveBeenCalled();
    });

    it('should call append with companyId and email', () => {
      expect(fakeFormData.append).toHaveBeenCalledWith(
        'companyId',
        `${companyId}`
      );
      expect(fakeFormData.append).toHaveBeenCalledWith('username', email);
    });

    it('should call fetch with url and request containing formData', () => {
      expect(apiClient.fetch).toHaveBeenCalledWith(
        '/api/user/users.php',
        jasmine.objectContaining({ method: 'POST', body: fakeFormData })
      );
    });

    it('should return response', () => {
      expect(result).toEqual(apiClientResponse);
    });
  });

  describe('removeUserFromCompany', () => {
    let result;
    let uId;

    beforeEach(async () => {
      uId = 1;
      result = await sut.removeUserFromCompany(companyId, uId);
    });

    it('should call fetch with url', () => {
      expect(apiClient.fetch).toHaveBeenCalledWith(
        `/api/user/users.php?companyId=${companyId}&uId=${uId}`,
        jasmine.objectContaining({ method: 'DELETE' })
      );
    });

    it('should return response', () => {
      expect(result).toEqual(apiClientResponse);
    });
  });
});
