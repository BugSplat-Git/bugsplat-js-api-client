import ac from 'argument-contracts';
import { ThreadCollection, ThreadCollectionConstructorOptions } from './thread-collection';

export interface GroupableThreadCollectionConstructorOptions extends ThreadCollectionConstructorOptions {
  stackKeyId: number;
}

export class GroupableThreadCollection extends ThreadCollection {
  stackKeyId: number;

  constructor(options: GroupableThreadCollectionConstructorOptions) {
    super(options);

    ac.assertNumber(options.stackKeyId);
    this.stackKeyId = options.stackKeyId;
  }
}