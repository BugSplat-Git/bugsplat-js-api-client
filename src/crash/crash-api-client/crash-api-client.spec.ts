import { CrashApiClient } from '@crash';
import { createFakeBugSplatApiClient } from '@spec/fakes/common/bugsplat-api-client';
import { createFakeFormData } from '@spec/fakes/common/form-data';
import { createFakeResponseBody, FakeResponseBody } from '@spec/fakes/common/response';
import { createFakeCrashApiResponse } from '@spec/fakes/crash/crash-api-response';
import { CrashStatus, createCrashDetails } from '../crash-details/crash-details';
import { ApiClient } from '@common';

describe('CrashApiClient', () => {
  const database = 'fred';
  const id = 100000;
  let fakeFormData;

  beforeEach(() => {
    fakeFormData = createFakeFormData();
  });

  describe('getCrashById', () => {
    let client: CrashApiClient;
    let fakeBugSplatApiClient;
    let fakeCrashApiResponse;
    let result;

    beforeEach(async () => {
      fakeCrashApiResponse = createFakeCrashApiResponse();
      const fakeResponse = createFakeResponseBody(200, fakeCrashApiResponse);
      fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeResponse);
      client = new CrashApiClient(fakeBugSplatApiClient);

      result = await client.getCrashById(database, id);
    });

    it('should call fetch with correct route', () => {
      expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
        '/api/crash/details',
        jasmine.anything()
      );
    });

    it('should call fetch with formData containing database and id', () => {
      expect(fakeFormData.append).toHaveBeenCalledWith('database', database);
      expect(fakeFormData.append).toHaveBeenCalledWith('id', id.toString());
      expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
        jasmine.any(String),
        jasmine.objectContaining({
          method: 'POST',
          body: fakeFormData,
          cache: 'no-cache',
          credentials: 'include',
          redirect: 'follow',
        })
      );
    });

    it('should return response json', () => {
      expect(result).toEqual(jasmine.objectContaining(createCrashDetails(fakeCrashApiResponse)));
    });

    it('should throw if status is not 200', async () => {
      const message = 'Bad requeset';

      try {
        const fakeReprocessErrorBody = { message };
        const fakeResponse = createFakeResponseBody(400, fakeReprocessErrorBody, false);
        const fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeResponse);
        const client = new CrashApiClient(fakeBugSplatApiClient);

        await client.getCrashById(database, id);
        fail('getCrashById was supposed to throw!');
      } catch (error: any) {
        expect(error.message).toEqual(message);
      }
    });

    it('should throw if database is falsy', async () => {
      try {
        await client.getCrashById('', id);
        fail('getCrashById was supposed to throw!');
      } catch (error: any) {
        expect(error.message).toMatch(/to be a non white space string/);
      }
    });

    it('should throw if crashId is less than or equal to 0', async () => {
      try {
        await client.getCrashById(database, 0);
        fail('getCrashById was supposed to throw!');
      } catch (error: any) {
        expect(error.message).toMatch(/to be a positive non-zero number/);
      }
    });
  });

  describe('getCrashByGroupId', () => {
    let client: CrashApiClient;
    let fakeBugSplatApiClient;
    let fakeCrashApiResponse;
    let result;
    const groupId = 12345;

    beforeEach(async () => {
      fakeCrashApiResponse = createFakeCrashApiResponse();
      const fakeResponse = createFakeResponseBody(200, fakeCrashApiResponse);
      fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeResponse);
      client = new CrashApiClient(fakeBugSplatApiClient);

      result = await client.getCrashByGroupId(database, groupId);
    });

    it('should call fetch with correct route', () => {
      expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
        '/api/crash/details',
        jasmine.anything()
      );
    });

    it('should call fetch with formData containing database and stackKeyId', () => {
      expect(fakeFormData.append).toHaveBeenCalledWith('database', database);
      expect(fakeFormData.append).toHaveBeenCalledWith('stackKeyId', groupId.toString());
      expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
        jasmine.any(String),
        jasmine.objectContaining({
          method: 'POST',
          body: fakeFormData,
          cache: 'no-cache',
          credentials: 'include',
          redirect: 'follow',
        })
      );
    });

    it('should return response json', () => {
      expect(result).toEqual(jasmine.objectContaining(createCrashDetails(fakeCrashApiResponse)));
    });

    it('should throw if status is not 200', async () => {
      const message = 'Bad request';

      try {
        const fakeErrorBody = { message };
        const fakeResponse = createFakeResponseBody(400, fakeErrorBody, false);
        const fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeResponse);
        const client = new CrashApiClient(fakeBugSplatApiClient);

        await client.getCrashByGroupId(database, groupId);
        fail('getCrashByGroupId was supposed to throw!');
      } catch (error: any) {
        expect(error.message).toEqual(message);
      }
    });

    it('should throw if database is falsy', async () => {
      try {
        await client.getCrashByGroupId('', groupId);
        fail('getCrashByGroupId was supposed to throw!');
      } catch (error: any) {
        expect(error.message).toMatch(/to be a non white space string/);
      }
    });

    it('should throw if groupId is less than or equal to 0', async () => {
      try {
        await client.getCrashByGroupId(database, 0);
        fail('getCrashByGroupId was supposed to throw!');
      } catch (error: any) {
        expect(error.message).toMatch(/to be a positive non-zero number/);
      }
    });

    it('should throw if groupId is negative', async () => {
      try {
        await client.getCrashByGroupId(database, -1);
        fail('getCrashByGroupId was supposed to throw!');
      } catch (error: any) {
        expect(error.message).toMatch(/to be a positive non-zero number/);
      }
    });
  });

  describe('reprocessCrash', () => {
    let client: CrashApiClient;
    let fakeReprocessApiResponse;
    let fakeBugSplatApiClient;
    let result;
    const processor = 'Oban-127.0.0.1';

    beforeEach(async () => {
      fakeReprocessApiResponse = { success: true };
      const fakeResponse = createFakeResponseBody(202, fakeReprocessApiResponse);
      fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeResponse);
      client = new CrashApiClient(fakeBugSplatApiClient);

      result = await client.reprocessCrash(database, id, true);
    });

    it('should call fetch with correct route', () => {
      expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
        '/api/crash/reprocess',
        jasmine.anything()
      );
    });

    it('should call form data append with processor if provided', async () => {
      await client.reprocessCrash(database, id, true, processor);

      expect(fakeFormData.append).toHaveBeenCalledWith('processor', processor);
    });

    it('should call fetch with formData containing database, id and force', () => {
      expect(fakeFormData.append).toHaveBeenCalledWith('database', database);
      expect(fakeFormData.append).toHaveBeenCalledWith('id', id.toString());
      expect(fakeFormData.append).toHaveBeenCalledWith('force', 'true');
      expect(fakeFormData.append).not.toHaveBeenCalledWith('processor', processor);
      expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
        jasmine.any(String),
        jasmine.objectContaining({
          method: 'POST',
          body: fakeFormData,
          cache: 'no-cache',
          credentials: 'include',
          redirect: 'follow',
        })
      );
    });

    it('should return response json', () => {
      expect(result).toEqual(fakeReprocessApiResponse);
    });

    it('should throw if status is not 202', async () => {
      const message = 'Unprocessable entity';

      try {
        const fakeReprocessErrorBody = { message };
        const fakeResponse = createFakeResponseBody(422, fakeReprocessErrorBody, false);
        const fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeResponse);
        const client = new CrashApiClient(fakeBugSplatApiClient);

        await client.reprocessCrash(database, id);
        fail('reprocessCrash was supposed to throw!');
      } catch (error: any) {
        expect(error.message).toEqual(message);
      }
    });

    it('should throw if database is falsy', async () => {
      try {
        await client.reprocessCrash('', id);
        fail('reprocessCrash was supposed to throw!');
      } catch (error: any) {
        expect(error.message).toMatch(/to be a non white space string/);
      }
    });

    it('should throw if crashId is less than or equal to 0', async () => {
      try {
        await client.reprocessCrash(database, 0);
        fail('reprocessCrash was supposed to throw!');
      } catch (error: any) {
        expect(error.message).toMatch(/to be positive non-zero numbers/);
      }
    });
  });

  describe('postNotes', () => {
    let result;
    let notes;
    let client: CrashApiClient;
    let apiClient: ApiClient;
    let apiClientResponse: FakeResponseBody<unknown>;

    beforeEach(async () => {
      apiClientResponse = createFakeResponseBody(200);
      apiClient = createFakeBugSplatApiClient(fakeFormData, apiClientResponse);
      notes = 'bulletproof coffee';
      client = new CrashApiClient(apiClient);
      result = await client.postNotes(database, id, notes);
    });

    it('should append, database, id, and Comments to formData', () => {
      expect(fakeFormData.append).toHaveBeenCalledWith('database', database);
      expect(fakeFormData.append).toHaveBeenCalledWith('id', `${id}`);
      expect(fakeFormData.append).toHaveBeenCalledWith('notes', notes);
    });

    it('should call fetch with correct route', () => {
      expect(apiClient.fetch).toHaveBeenCalledWith('/api/crash/notes', jasmine.anything());
    });

    it('should call fetch with requestInit containing formData', () => {
      expect(apiClient.fetch).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          method: 'POST',
          body: fakeFormData,
          cache: 'no-cache',
          credentials: 'include',
          redirect: 'follow',
        })
      );
    });

    it('should return result', () => {
      expect(result).toEqual(apiClientResponse);
    });
  });

  describe('postStatus', () => {
    let client: CrashApiClient;
    let fakePostStatusApiResponse;
    let fakeBugSplatApiClient;
    let result;

    beforeEach(async () => {
      fakePostStatusApiResponse = { success: true };
      const fakeResponse = createFakeResponseBody(200, fakePostStatusApiResponse);
      fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeResponse);
      client = new CrashApiClient(fakeBugSplatApiClient);

      result = await client.postStatus(database, id, CrashStatus.Closed);
    });

    it('should call fetch with correct route', () => {
      expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
        '/api/crash/status',
        jasmine.anything()
      );
    });

    it('should call fetch with formData containing database, id and status', () => {
      expect(fakeFormData.append).toHaveBeenCalledWith('database', database);
      expect(fakeFormData.append).toHaveBeenCalledWith('groupId', id.toString());
      expect(fakeFormData.append).toHaveBeenCalledWith('status', CrashStatus.Closed.toString());
    });

    it('should return response json', () => {
      expect(result).toEqual(fakePostStatusApiResponse);
    });

    it('should throw if status is not 200', async () => {
      const message = 'Bad request';

      try {
        const fakePostStatusErrorBody = { message };
        const fakeResponse = createFakeResponseBody(400, fakePostStatusErrorBody, false);
        const fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeResponse);
        const client = new CrashApiClient(fakeBugSplatApiClient);

        await client.postStatus(database, id, CrashStatus.Closed);
        fail('postStatus was supposed to throw!');
      } catch (error: any) {
        expect(error.message).toEqual(message);
      }
    });

    it('should throw if database is falsy', async () => {
      try {
        await client.postStatus('', id, CrashStatus.Closed);
        fail('postStatus was supposed to throw!');
      } catch (error: any) {
        expect(error.message).toMatch(/to be a non white space string/);
      }
    });
  });
});
