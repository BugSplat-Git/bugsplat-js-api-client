import { BugSplatApiClient } from '@common';
import { CrashApiClient, CrashStatus } from '@crash';
import { config } from '@spec/config';
import { postNativeCrashAndWaitForCrashToProcess } from '@spec/files/native/post-native-crash';

describe('CrashApiClient', () => {
  let crashClient: CrashApiClient;
  let application: string;
  let version: string;
  let id: number;
  let stackKeyId: number;

  beforeEach(async () => {
    const { host, email, password } = config;
    const bugsplatApiClient = await BugSplatApiClient.createAuthenticatedClientForNode(
      email,
      password,
      host
    );
    application = 'myConsoleCrasher';
    version = `${Math.random() * 1000000}`;
    crashClient = new CrashApiClient(bugsplatApiClient);
    const result = await postNativeCrashAndWaitForCrashToProcess(
      bugsplatApiClient,
      crashClient,
      config.database,
      application,
      version
    );
    id = result.crashId;
    stackKeyId = result.stackKeyId;
  });

  describe('getCrashById', () => {
    it('should return 200', async () => {
      const response = await crashClient.getCrashById(config.database, id);

      expect(response.id).toEqual(id);
      expect(response.appName).toEqual(application);
      expect(response.appVersion).toEqual(version);
    });
  });

  describe('reprocessCrash', () => {
    it('should return 200 for a recent crash that has symbols', async () => {
      const response = await crashClient.reprocessCrash(config.database, id);

      expect(response.status).toEqual('success');
    });
  });

  describe('postNotes', () => {
    it('should return 200', async () => {
      const database = config.database;
      const notes = 'BugSplat rocks!';

      await crashClient.postNotes(database, id, notes);
      const result = await crashClient.getCrashById(database, id);

      expect(result.comments).toEqual(notes);
    });
  });

  describe('postStatus', () => {
    it('should return 200', async () => {
      const response = await crashClient.postStatus(config.database, stackKeyId, CrashStatus.Open);

      expect(response.status).toEqual('success');
    });
  });
});
