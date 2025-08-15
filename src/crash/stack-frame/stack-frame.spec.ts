import { StackFrame } from '@crash';

describe('stackFrame', () => {

  describe('constructor', () => {
    it('should throw if fileName is not a string', () => {
      expect(() => new StackFrame({ fileName: {} } as any)).toThrow();
    });

    it('should throw if functionName is not a string', () => {
      expect(() => new StackFrame({ fileName: 'string', functionName: {} } as any)).toThrow();
    });

    it('should throw if lineNumber is not a number', () => {
      expect(() => new StackFrame({ fileName: 'string', functionName: 'another string', lineNumber: 'string' } as any)).toThrow();
    });

    it('should throw if stackFrameLevel is not a number', () => {
      expect(() => new StackFrame({ fileName: 'string', functionName: 'another string', lineNumber: 0, stackFrameLevel: 'another string' } as any)).toThrow();
    });

    it('should convert arguments to an array if it is an object', () => {
      const args = { everything: 'nothing' };

      const result = new StackFrame(<any>{
        fileName: 'string',
        functionName: 'another string',
        lineNumber: 0,
        stackFrameLevel: 0,
        arguments: args
      });

      expect(result.arguments).toEqual([args]);
    });

    it('should default arguments to an array if not provided', () => {
      const result = new StackFrame(<any>{
        fileName: 'string',
        functionName: 'another string',
        lineNumber: 0,
        stackFrameLevel: 0
      });

      expect(result.arguments).toEqual([]);
    });

    it('should convert locals to an array if it is an object', () => {
      const locals = { everything: 'nothing' };

      const result = new StackFrame(<any>{
        fileName: 'string',
        functionName: 'another string',
        lineNumber: 0,
        stackFrameLevel: 0,
        locals
      });

      expect(result.locals).toEqual([locals]);
    });

    it('should default locals to an array if not provided', () => {
      const result = new StackFrame(<any>{
        fileName: 'string',
        functionName: 'another string',
        lineNumber: 0,
        stackFrameLevel: 0
      });

      expect(result.locals).toEqual([]);
    });

    it('should create a stackFrame with fileName, functionName, lineNumber, stackFrameLevel, arguments and locals', () => {
      const fileName = 'so';
      const functionName = 'tired';
      const lineNumber = 1;
      const stackFrameLevel = 2;
      const args = [{ foo: 'bar ' }];
      const locals = [{ baz: 'bang' }];

      const result = new StackFrame({
        fileName,
        functionName,
        lineNumber,
        stackFrameLevel,
        arguments: args,
        locals
      });

      expect(result.fileName).toEqual(fileName);
      expect(result.functionName).toEqual(functionName);
      expect(result.lineNumber).toEqual(lineNumber);
      expect(result.stackFrameLevel).toEqual(stackFrameLevel);
      expect(result.arguments).toEqual(args);
      expect(result.locals).toEqual(locals);
    });
  });

  describe('getDescription', () => {
    it('should return formatted string with functionName and lineNumber if they exist', () => {
      const fileName = 'Michael Scott Paper Company';
      const functionName = 'Dunder Mifflin';
      const lineNumber = 100;
      const stackFrame = new StackFrame({
        fileName,
        functionName,
        lineNumber
      });

      const result = stackFrame.getDescription();

      expect(result).toEqual(`${functionName}(${lineNumber})`);
    });

    it('should return formatted string with functionName if functionName exists and lineNumber is falsy', () => {
      const fileName = 'Michael Scott Paper Company';
      const functionName = 'Dunder Mifflin';
      const lineNumber = 0;
      const stackFrame = new StackFrame({
        fileName,
        functionName,
        lineNumber
      });

      const result = stackFrame.getDescription();

      expect(result).toEqual(functionName);
    });

    it('should return \'Unknown\' string if functionName and lineNumber are falsy', () => {
      const fileName = 'Michael Scott Paper Company';
      const functionName = '';
      const lineNumber = 0;
      const stackFrame = new StackFrame({
        fileName,
        functionName,
        lineNumber
      });

      const result = stackFrame.getDescription();

      expect(result).toEqual('Unknown');
    });
  });

  describe('getLocation', () => {
    it('should return formatted string with fileName and lineNumber if they exist', () => {
      const fileName = 'Michael Scott Paper Company';
      const functionName = 'Dunder Mifflin';
      const lineNumber = 100;
      const stackFrame = new StackFrame({
        fileName,
        functionName,
        lineNumber
      });

      const result = stackFrame.getLocation();

      expect(result).toEqual(`${fileName}(${lineNumber})`);
    });

    it('should return formatted string with fileName if fileName exists and lineNumber is falsy', () => {
      const fileName = 'Michael Scott Paper Company';
      const functionName = 'Dunder Mifflin';
      const lineNumber = 0;
      const stackFrame = new StackFrame({
        fileName,
        functionName,
        lineNumber
      });

      const result = stackFrame.getLocation();

      expect(result).toEqual(fileName);
    });

    it('should return empty string if fileName and lineNumber are falsy', () => {
      const result = (new StackFrame({ fileName: '', lineNumber: null } as any)).getLocation();

      expect(result).toEqual('');
    });
  });

  describe('getShortFileName', () => {
    it('should split on / and return last item', () => {
      const expectedFileName = 'drill.ts';

      const result = new StackFrame({ fileName: `./this/is/not/a/${expectedFileName}`, lineNumber: null } as any).getLocation();

      expect(result).toEqual(expectedFileName);
    });

    it('should split on \\ and return last item', () => {
      const expectedFileName = 'black.ts';

      const result = new StackFrame({ fileName: `.\\this\\suit\\is\\not\\${expectedFileName}`, lineNumber: null } as any).getLocation();

      expect(result).toEqual(expectedFileName);
    });

    it('should return correct file name if neither \\ or / exist in string', () => {
      const expectedFileName = 'lettuce turnip the beat.ts';

      const result = new StackFrame({ fileName: expectedFileName, lineNumber: null } as any).getLocation();

      expect(result).toEqual(expectedFileName);
    });
  });
});