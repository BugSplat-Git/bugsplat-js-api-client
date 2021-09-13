import { StackFrame, ThreadCollection } from '..';

describe('thread collection', () => {

  it('should map stackFramels to new StackFrame objects', () => {
    const options = createRawResponse();
    const threadCollection = new ThreadCollection(options);

    threadCollection.stackFrames.forEach((stackFrame, i) => expect(stackFrame).toEqual(new StackFrame(options.stackFrames[i])));
  });

  it('should set stackFrames to an empty array if options.stackFrames is empty', () => {
    const result = new ThreadCollection({
      stackFrames: []
    });

    expect(result.stackFrames).toEqual([]);
  });

  describe('getEntryPoint', () => {
    it('should return first element of stackFrames if subKeyDepth is 0', () => {
      const options = createRawResponse();
      const threadCollection = new ThreadCollection(options);

      const result = threadCollection.getEntryPoint();

      expect(result).toEqual(new StackFrame(options.stackFrames[0]));
    });

    it('should return sub key if subKeyDepth is not 0', () => {
      const expectedStackFrameIndex = 1;
      const options = createRawResponse(expectedStackFrameIndex + 1);
      const threadCollection = new ThreadCollection(options);

      const result = threadCollection.getEntryPoint();

      expect(result).toEqual(new StackFrame(options.stackFrames[expectedStackFrameIndex]));
    });
  });
});

function createRawResponse(subKeyDepth = 0): any {
  return {
    'stackId': 123456789,
    'subKeyDepth': subKeyDepth,
    'stackFrames': [
      {
        'stackFrameLevel': 0,
        'lineNumber': 100,
        'functionName': 'myConsoleCrasher!MemoryException',
        'fileName': 'c:/www/depot/src/bugsplatautomation/bugsplatautomation/bin/x64/release/temp/7f1fa880-7a7c-4dbc-a8e8-3b62ac9dc841/bugsplat/samples/myconsolecrasher/myconsolecrasher.cpp'
      },
      {
        'stackFrameLevel': 1,
        'lineNumber': 94,
        'functionName': 'myConsoleCrasher!wmain',
        'fileName': 'c:/www/depot/src/bugsplatautomation/bugsplatautomation/bin/x64/release/temp/7f1fa880-7a7c-4dbc-a8e8-3b62ac9dc841/bugsplat/samples/myconsolecrasher/myconsolecrasher.cpp'
      },
      {
        'stackFrameLevel': 2,
        'lineNumber': 79,
        'functionName': 'myConsoleCrasher!invoke_main',
        'fileName': 'f:/dd/vctools/crt/vcstartup/src/startup/exe_common.inl'
      }
    ]
  };
}
