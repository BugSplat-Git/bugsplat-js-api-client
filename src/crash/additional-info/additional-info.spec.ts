import { AdditionalInfo } from '..';

describe('AdditionalInfo', () => {
  describe('fromRawResponse', () => {
    let apiResponse;

    beforeEach(() => apiResponse = createApiResponse());

    it('should convert API response to AdditionalInfo', () => {
      const nonCurrentThreadsLength = apiResponse.process.threads.thread.filter(validThread).length;
      const debuggerOutputLength = apiResponse.process.DebugOutput.DbgEngOutput.length;
      const modulesLength = apiResponse.process.modules.module.length;
      const registersLength = Object.keys(apiResponse.process.exception.registers).length;
      const os = apiResponse.os;

      const result = AdditionalInfo.fromRawResponse(apiResponse);

      expect(result.os).toEqual(os);
      expect(result.debuggerOutput.length).toEqual(debuggerOutputLength);
      expect(result.threads.length).toEqual(nonCurrentThreadsLength);
      expect(result.modules.length).toEqual(modulesLength);
      expect(result.registers.length).toEqual(registersLength);
    });

    it('should not add empty frames to array of ThreadCollections', async () => {
      const expectedThreads = apiResponse.process.threads.thread.filter(validThread);

      const result = AdditionalInfo.fromRawResponse(apiResponse);

      expect(result.threads.length).toEqual(expectedThreads.length);
    });

    it('should convert empty file objects to empty strings', () => {
      const expectedThreads = apiResponse.process.threads.thread.filter(validThread);

      const result = AdditionalInfo.fromRawResponse(apiResponse);

      result.threads.forEach((thread, i) => thread.stackFrames.forEach((frame, j) => {
        const expectedFrame = expectedThreads[i].frame[j];
        const expectedFileName = !isEmpty(expectedFrame.file) ? expectedFrame.file : '';
        expect(frame.fileName).toEqual(expectedFileName);
      }));
    });

    it('should convert empty symbol objects to empty strings', () => {
      const expectedThreads = apiResponse.process.threads.thread.filter(validThread);

      const result = AdditionalInfo.fromRawResponse(apiResponse);

      result.threads.forEach((thread, i) => thread.stackFrames.forEach((frame, j) => {
        const expectedFrame = expectedThreads[i].frame[j];
        const expectedFunctionName = !isEmpty(expectedFrame.symbol) ? expectedFrame.symbol : '';
        expect(frame.functionName).toEqual(expectedFunctionName);
      }));
    });

    it('should convert empty line objects to undefined', () => {
      const expectedThreads = apiResponse.process.threads.thread.filter(validThread);

      const result = AdditionalInfo.fromRawResponse(apiResponse);

      result.threads.forEach((thread, i) => thread.stackFrames.forEach((frame, j) => {
        const expectedFrame = expectedThreads[i].frame[j];
        const expectedLineNumber = !isEmpty(expectedFrame.line) ? expectedFrame.line : undefined;
        expect(frame.lineNumber).toEqual(expectedLineNumber);
      }));
    });

    it('should convert undefined modules to empty array', () => {
      apiResponse.process.modules.module = undefined;

      const result = AdditionalInfo.fromRawResponse(apiResponse);

      expect(result.modules).toEqual([]);
    });

    it('should convert undefined threads to empty array', () => {
      apiResponse.process.threads.thread = undefined;

      const result = AdditionalInfo.fromRawResponse(apiResponse);

      expect(result.threads).toEqual([]);
    });
  });
});

function isEmpty(obj: any): boolean {
  return Object.keys(obj) && Object.keys(obj).length == 0;
}

function validThread(thread: any): boolean {
  return thread['@attributes'].current === 'no' && !isEmpty(thread.frame);
}

function createApiResponse(): any {
  return {
    'platform': 'Windows',
    'os': 'Windows 10 Version 17763 MP (8 procs) Free x86 compatible',
    'process': {
      'exception': {
        'func': 'myConsoleCrasher!MemoryException',
        'code': 'c0000005',
        'explanation': 'Access violation',
        'file': 'c:\\www\\bugsplatautomation\\bugsplatautomation\\bin\\x64\\release\\temp\\aedf8ff7-8cc6-49df-821a-88b961e1e12b\\bugsplat\\samples\\myconsolecrasher\\myconsolecrasher.cpp',
        'line': '100',
        'offset': '0x1e',
        'registers': {
          'cs': '0023',
          'ds': '002b',
          'eax': 'cccccccc',
        }
      },
      'modules': {
        '@attributes': {
          'numloaded': '30'
        },
        'module': [{
          'name': 'BugSplatRc',
          'order': '0',
          'address': '00d50000-00d69000',
          'path': 'C:\\www\\BugsplatAutomation\\BugsplatAutomation\\bin\\x64\\Release\\temp\\aedf8ff7-8cc6-49df-821a-88b961e1e12b\\BugSplat\\bin\\BugSplatRc.dll',
          'symbolsloaded': 'file not found',
          'fileversion': '1.0.0.1',
          'productversion': '1.0.0.1',
          'checksum': '0001E4BC',
          'timedatestamp': 'Wed Oct 31 14:38:08 2018'
        }, {
          'name': 'myConsoleCrasher',
          'order': '1',
          'address': '00da0000-00dc1000',
          'path': 'C:\\www\\BugsplatAutomation\\BugsplatAutomation\\bin\\x64\\Release\\temp\\aedf8ff7-8cc6-49df-821a-88b961e1e12b\\BugSplat\\bin\\myConsoleCrasher.exe',
          'symbolsloaded': 'deferred',
          'fileversion': {},
          'productversion': {},
          'checksum': '00000000',
          'timedatestamp': 'Thu Mar 21 16:17:26 2019'
        }]
      },
      'threads': {
        '@attributes': {
          'count': '5'
        },
        'thread': [{
          '@attributes': {
            'id': '4',
            'current': 'yes',
            'framecount': '9'
          },
          'frame': [{
            'symbol': 'myConsoleCrasher!MemoryException',
            'arguments': {},
            'locals': {},
            'file': 'c:\\www\\bugsplatautomation\\bugsplatautomation\\bin\\x64\\release\\temp\\aedf8ff7-8cc6-49df-821a-88b961e1e12b\\bugsplat\\samples\\myconsolecrasher\\myconsolecrasher.cpp',
            'line': '100',
            'offset': '0x1e'
          }]
        }, {
          '@attributes': {
            'id': '0',
            'current': 'no',
            'framecount': '8'
          },
          'frame': [{
            'symbol': 'ntdll!NtWaitForSingleObject',
            'arguments': {},
            'locals': {},
            'file': {},
            'line': {},
            'offset': '0xc'
          }]
        }, {
          '@attributes': {
            'id': '0',
            'current': 'no',
            'framecount': '0'
          },
          'frame': {}
        }]
      },
      'DebugOutput': {
        'DbgEngOutput': 'stuff!'
      },
    }
  };
}