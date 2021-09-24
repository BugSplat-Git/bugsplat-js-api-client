import { GroupableThreadCollection } from '@crash';

describe('GroupableThreadCollection', () => {
  it('should throw if stackKeyId is not a number', () => {
    expect(() => new GroupableThreadCollection({ stackKeyId: <any>undefined, stackFrames: [] })).toThrowError(/number/);
  });

  it('should return object with properties', () => {
    const stackFrames = [];
    const stackKeyId = 9;
    const stackId = 10;
    const subKeyDepth = 11;
    const threadId = '12';
    const options = {
      stackFrames,
      stackId,
      stackKeyId,
      subKeyDepth,
      threadId
    };

    const result = new GroupableThreadCollection(options);

    expect(result).toEqual(jasmine.objectContaining(options));
  });
});