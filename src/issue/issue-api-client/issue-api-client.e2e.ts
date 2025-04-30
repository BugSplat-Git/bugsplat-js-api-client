import { BugSplatApiClient } from '@common';
import { CrashApiClient } from '@crash';
import { IssueApiClient } from '@issue';
import { config } from '@spec/config';
import { postNativeCrashAndWaitForCrashToProcess } from '@spec/files/native/post-native-crash';

describe('IssueApiClient', () => {
  let client: IssueApiClient;
  const { host, email, password, database } = config;
  const expectedMessage = 'hello world!';
  let stackKeyId;

  beforeEach(async () => {
    const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(
      email,
      password,
      host
    );
    const crashClient = new CrashApiClient(bugsplat);
    const response = await postNativeCrashAndWaitForCrashToProcess(
      bugsplat,
      crashClient,
      database,
      'myConsoleCrasher',
      '1.0.0'
    );
    stackKeyId = response.stackKeyId;
    client = new IssueApiClient(bugsplat);
  });

  describe('postStackKeyIssue', () => {
    // Requires a defect tracker to be configured
    it('should return 200 for valid database, stackKeyId, and notes', async () => {
      const response = await client.postStackKeyIssue(database, stackKeyId, expectedMessage);

      expect(response.status).toEqual(200);
    });
  });

  describe('deleteStackKeyIssue', () => {
    it('should return 200 for valid database, stackKeyId', async () => {
      const response = await client.deleteStackKeyIssue(database, stackKeyId);

      expect(response.status).toEqual(200);
    });
  });
});
