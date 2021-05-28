import { Register } from './register';

describe('fromResponseObject', () => {
  it('should convert object keys and values into array of name value pairs', () => {
    const registersObject = { };
    const expectedNames = ['eee', 'fff'];
    const expectedValue = ['0x69696', 'abcdef'];
    registersObject[expectedNames[0]] = expectedValue[0];
    registersObject[expectedNames[1]] = expectedValue[1];

    const results = Register.fromResponseObject(registersObject);
    
    results.forEach((result, index) => {
      expect(result.name).toEqual(expectedNames[index]);
      expect(result.value).toEqual(expectedValue[index]);
    });
  });
});