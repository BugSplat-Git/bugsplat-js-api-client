export interface ModuleResponseObject {
  name: string;
  order: string;
  address: string;
  path: string;
  symbolsloaded: string;
  fileversion: string,
  productversion: string;
  checksum: string;
  timedatestamp: string;
}

export class Module {
  constructor(
    public readonly name: string,
    public readonly order: string,
    public readonly address: string,
    public readonly path: string,
    public readonly status: string,
    public readonly fileVersion: string,
    public readonly productVersion: string,
    public readonly checksum: string,
    public readonly timestamp: string
  ) {
    Object.freeze(this);
  }

  static fromResponseObject(object: ModuleResponseObject): Module {
    return new Module(
      object.name,
      object.order,
      object.address,
      object.path,
      object.symbolsloaded,
      object.fileversion,
      object.productversion,
      object.checksum,
      object.timedatestamp
    );
  }
}