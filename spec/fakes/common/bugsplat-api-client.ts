export function createFakeBugSplatApiClient(
    formData,
    response
) {
    const fakeBugSplatApiClient = jasmine.createSpyObj('BugSplatApiClient', [
        'createFormData',
        'fetch'
    ]);
    fakeBugSplatApiClient.createFormData.and.returnValue(formData);
    fakeBugSplatApiClient.fetch.and.returnValue(Promise.resolve(response));
    return fakeBugSplatApiClient;
}