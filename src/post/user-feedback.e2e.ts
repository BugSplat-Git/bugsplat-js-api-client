import { UploadableFile } from '@common';
import { CrashPostClient, postUserFeedback } from '@post';
import { config } from '@spec/config';
import { delay } from '../common/delay';

describe('postUserFeedback', () => {
  beforeEach(async () => delay(1000)); // Prevent rate-limiting

  it('should post user feedback with attachments via /post/feedback/ and return 200', async () => {
    const application = 'myConsoleCrasher';
    const version = `${Math.random() * 1000000}`;
    const crashPostClient = new CrashPostClient(config.database);
    const attachmentContent = Buffer.from('e2e attachment contents\n', 'utf-8');
    const attachment = new UploadableFile(
      'attachment.txt',
      attachmentContent.length,
      attachmentContent
    );

    const result = await postUserFeedback(
      crashPostClient,
      application,
      version,
      {
        title: 'js-api-client e2e feedback',
        description: 'Verifies multipart form post with attachments',
        user: 'e2e-user',
        email: 'e2e@bugsplat.com',
        attachments: [attachment],
        attributes: { test: 'user-feedback-e2e' },
      }
    );
    const json = await result.json();

    expect(result.status).toEqual(200);
    expect(json.crash_id).toBeGreaterThan(0);
  });
});
