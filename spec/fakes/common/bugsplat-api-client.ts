export function createFakeBugSplatApiClient(
    formData: FormData,
    response: any
): any {
    const fakeBugSplatApiClient = jasmine.createSpyObj('BugSplatApiClient', [
        'createFormData',
        'fetch'
    ]);
    fakeBugSplatApiClient.createFormData.and.returnValue(formData);
    fakeBugSplatApiClient.fetch.and.returnValue(Promise.resolve(response));
    return fakeBugSplatApiClient;
}