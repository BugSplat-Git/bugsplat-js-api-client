import ac from 'argument-contracts';

const splitRegex = /(\\|\/)/;

export interface StackFrameConstructorOptions {
  fileName?: string;
  functionName: string;
  lineNumber?: number;
  stackFrameLevel?: number;
  arguments?: Array<any>;
  locals?: Array<any>;
}

export class StackFrame implements StackFrameConstructorOptions {
  fileName?: string;
  functionName: string;
  lineNumber?: number;
  stackFrameLevel?: number;
  arguments?: Array<any>;
  locals?: Array<any>;

  constructor(options: StackFrameConstructorOptions) {
    let fileName = options.fileName;
    if (fileName) {
      ac.assertString(<string>options.fileName, 'options.fileName')
    } else {
      fileName = '';
    }

    let functionName = options.functionName;
    if (functionName) {
      ac.assertString(options.functionName, 'options.functionName')
    } else {
      functionName = '';
    }

    let lineNumber = options.lineNumber;
    if (lineNumber) {
      ac.assertNumber(<number>options.lineNumber, 'options.lineNumber')
    } else {
      lineNumber = undefined;
    }

    let stackFrameLevel = options.stackFrameLevel;
    if (stackFrameLevel) {
      ac.assertNumber(<number>options.stackFrameLevel, 'options.stackFrameLevel')
    } else {
      stackFrameLevel = undefined;
    }

    let args = options.arguments || [];
    if (!Array.isArray(args)) {
      args = [args];
    }

    let locals = options.locals || [];
    if (!Array.isArray(locals)) {
      locals = [locals];
    }

    this.fileName = fileName;
    this.functionName = functionName;
    this.lineNumber = lineNumber;
    this.stackFrameLevel = stackFrameLevel;
    this.arguments = args;
    this.locals = locals;

    Object.freeze(this);
  }

  getDescription(): string {
    if (this.functionName && !this.lineNumber) {
      return `${this.functionName}`;
    }

    if (this.functionName && this.lineNumber) {
      return `${this.functionName}(${this.lineNumber})`;
    }

    return 'Unknown';
  }

  getLocation(): string {
    if (this.fileName && !this.lineNumber) {
      return `${this.getShortFileName(this.fileName)}`;
    }

    if (this.fileName && this.lineNumber) {
      return `${this.getShortFileName(this.fileName)}(${this.lineNumber})`;
    }

    return '';
  }

  private getShortFileName(fileName: string): string {
    return fileName?.split(splitRegex).pop() ?? '';
  }
}

export interface VariableValuePair {
  variable: string,
  value: string
}