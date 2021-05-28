export class Register {
  constructor(public readonly name: string, public readonly value: string) {
    Object.freeze(this)
  }

  static fromResponseObject(object: object): Array<Register> {
    return Object.keys(object).map(key => new Register(key, object[key]));
  }
}