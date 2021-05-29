import { ThreadCollection, StackFrame, Module, Register } from '..';

const ATTRIBUTES = '@attributes';

export interface AdditionalInfoConstructorOptions {
  os: string;
  debuggerOutput: string;
  registers: Array<Register>;
  modules: Array<Module>;
  threads: Array<ThreadCollection>;
}

export class AdditionalInfo implements AdditionalInfoConstructorOptions {
  os: string;
  debuggerOutput: string;
  registers: Array<Register>;
  modules: Array<Module>;
  threads: Array<ThreadCollection>;

  constructor(options: AdditionalInfoConstructorOptions) {

    this.os = options.os || '';
    this.debuggerOutput = options.debuggerOutput || '';
    this.registers = options.registers || [];
    this.modules = options.modules || [];
    this.threads = options.threads || [];

    Object.freeze(this);
  }

  static fromRawResponse(response: any): AdditionalInfo {

    if (!response) {
      return new AdditionalInfo({
        os: '',
        debuggerOutput: '',
        registers: [],
        modules: [],
        threads: []
      });
    }

    const os = response.os || '';

    const debuggerOutput = !isEmpty(response.process.DebugOutput)
      ? response.process.DebugOutput.DbgEngOutput
      : '';

    const registers = !isEmpty(response.process.exception.registers)
      ? createRegistersArray(response.process.exception.registers)
      : [];

    const threads = !isEmpty(response.process.threads)
      ? createThreadCollectionArray(response.process.threads.thread)
      : [];

    const modules = !isEmpty(response.process.modules)
      ? createModulesArray(response.process.modules.module)
      : [];

    return new AdditionalInfo({
      os,
      debuggerOutput,
      registers,
      modules,
      threads
    });
  }
}

function createModulesArray(modules: Array<any>): Array<Module> {
  if (!modules) {
    modules = [];
  }

  if (!Array.isArray(modules)) {
    modules = [modules];
  }

  return modules.map(module => Module.fromResponseObject(module));
}

function createRegistersArray(registers: any): Array<Register> {
  return Register.fromResponseObject(registers);
}

function createThreadCollectionArray(threads: Array<any>): Array<ThreadCollection> {
  if (!threads) {
    threads = [];
  }

  if (!Array.isArray(threads)) {
    threads = [threads];
  }

  return threads
    .filter(thread => thread[ATTRIBUTES].current === 'no' && !isEmpty(thread.frame))
    .map(thread => new ThreadCollection({
      threadId: createThreadId(thread),
      stackFrames: createStackFramesArray(thread)
    }));
}

function createThreadId(thread: any): string {
  return !isEmpty(thread[ATTRIBUTES].id) ? thread[ATTRIBUTES].id : '';
}

function createStackFramesArray(thread: any): Array<StackFrame> {
  if (!Array.isArray(thread.frame)) {
    thread.frame = [thread.frame];
  }

  return thread.frame.map(frame => new StackFrame({
    fileName: !isEmpty(frame.file) ? frame.file : '',
    functionName: !isEmpty(frame.symbol) ? frame.symbol : '',
    lineNumber: !isEmpty(frame.line) ? parseInt(frame.line) : 0,
    arguments: !isEmpty(frame.arguments) ? frame.arguments : [],
    locals: !isEmpty(frame.locals) ? frame.locals : []
  }));
}

function isEmpty(obj: object): boolean {
  if (!obj) {
    return true;
  }
  return Object.keys(obj) && Object.keys(obj).length == 0;
}
