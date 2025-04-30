import { IssueApiClient } from '@issue';
import { createFakeBugSplatApiClient } from '@spec/fakes/common/bugsplat-api-client';
import { createFakeFormData } from '@spec/fakes/common/form-data';
import { createFakeResponseBody } from '@spec/fakes/common/response';
import { fakeEventsApiResponse } from '@spec/fakes/events/events-api-response';

describe('IssueApiClient', () => {
  const database = 'fred';
  const id = 100000;
  const notes = 'hello world!';
  let client: IssueApiClient;
  let fakeBugSplatApiClient;
  let fakeFormData;

  beforeEach(() => {
    const fakeResponse = createFakeResponseBody(200, fakeEventsApiResponse);
    fakeFormData = createFakeFormData();
    fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeResponse);
    client = new IssueApiClient(fakeBugSplatApiClient);
  });

  describe('postStackKeyIssue', () => {
    beforeEach(async () => await client.postStackKeyIssue(database, id, notes));

    it('should throw if database is falsy', async () => {
      try {
        await client.postStackKeyIssue('', id, notes);
        fail('postStackKeyIssue was supposed to throw!');
      } catch (error: any) {
        expect(error.message).toMatch(/to be a non white space string/);
      }
    });

    it('should throw if id is less than or equal to 0', async () => {
      try {
        await client.postStackKeyIssue(database, -1, notes);
        fail('postStackKeyIssue was supposed to throw!');
      } catch (error: any) {
        expect(error.message).toMatch(/to be a positive non-zero number/);
      }
    });

    it('should call fetch with route and formData', () => {
      expect(fakeFormData.append).toHaveBeenCalledWith('database', database);
      expect(fakeFormData.append).toHaveBeenCalledWith('stackKeyId', id.toString());
      expect(fakeFormData.append).toHaveBeenCalledWith('notes', notes);
      expect(fakeFormData.append).not.toHaveBeenCalledWith('linkDefectId');
      expect(fakeBugSplatApiClient.fetch).toHaveBeenCalledWith(
        '/api/logDefect',
        jasmine.objectContaining({
          method: 'POST',
          body: fakeFormData,
          duplex: 'half',
        })
      );
    });

    it('should call fetch with linkDefectId if provided', () => {
      const linkDefectId = '123';
      client.postStackKeyIssue(database, id, notes, linkDefectId);

      expect(fakeFormData.append).toHaveBeenCalledWith('linkDefectId', linkDefectId);
    });
  });
});
