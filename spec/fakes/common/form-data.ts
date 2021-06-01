export function createFakeFormData() {
    return jasmine.createSpyObj('FormData', ['append']);
}