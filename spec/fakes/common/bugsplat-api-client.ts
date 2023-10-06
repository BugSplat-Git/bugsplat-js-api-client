import { ApiClient } from '@common';

export function createFakeBugSplatApiClient(
    formData: FormData,
    response: any
): jasmine.SpyObj<ApiClient> {
    const fakeBugSplatApiClient = jasmine.createSpyObj('BugSplatApiClient', [
        'createFormData',
        'fetch'
    ]);
    fakeBugSplatApiClient.createFormData.and.returnValue(formData);
    fakeBugSplatApiClient.fetch.and.returnValue(Promise.resolve(response));
    return fakeBugSplatApiClient;
}