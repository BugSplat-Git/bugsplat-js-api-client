import ac from 'argument-contracts';
import { StackFrame } from '@crash';

export interface ThreadCollectionConstructorOptions {
  threadId?: string;
  stackId?: number;
  subKeyDepth?: number;
  stackFrames: Array<StackFrame>;
}

export class ThreadCollection implements ThreadCollectionConstructorOptions {
  threadId?: string;
  stackId?: number;
  subKeyDepth?: number;
  stackFrames: Array<StackFrame>;

  constructor(options: ThreadCollectionConstructorOptions) {
    ac.assertArrayOf(options.stackFrames, StackFrame, 'options.stackFrames');

    if (options.threadId) {
      ac.assertString(options.threadId);
      this.threadId = options.threadId;
    } else {
      this.threadId = '';
    }

    if (options.stackId) {
      ac.assertNumber(options.stackId);
      this.stackId = options.stackId;
    } else {
      this.stackId = 0;
    }

    if (options.subKeyDepth) {
      ac.assertNumber(options.subKeyDepth);
      this.subKeyDepth = options.subKeyDepth;
    } else {
      this.subKeyDepth = 0;
    }

    this.stackFrames = options.stackFrames && options.stackFrames.length
      ? options.stackFrames.map(stackFrame => new StackFrame(stackFrame))
      : [];
  }

  getEntryPoint(): StackFrame {
    return this.subKeyDepth
      ? this.stackFrames[this.subKeyDepth - 1]
      : this.stackFrames[0];
  }
}
