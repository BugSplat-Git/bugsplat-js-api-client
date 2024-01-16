export interface RawUsersApiRow {
  Restricted: string;
  lastLogin: string;
  uId: string;
  username: string;
}

export class UsersApiRow {
  lastLogin: string;
  restricted: boolean;
  uId: number;
  username: string;

  constructor(row: RawUsersApiRow) {
    if (typeof row.Restricted !== 'string' || (row.Restricted !== '1' && row.Restricted !== '0')) {
      throw new TypeError(`Expected 'Restricted' property wih value of '1' or '0'. Provided value: ${JSON.stringify(row)}`);
    }

    if (typeof row.lastLogin !== 'string') {
      throw new TypeError(`Expected 'lastLogin' property to be a string. Provided value: ${JSON.stringify(row)}`);
    }

    if (typeof row.uId !== 'string') {
      throw new TypeError(`Expected 'uId' property to be parsable to an int. Provided value: ${JSON.stringify(row)}`);
    }

    const safeUId = Number(row.uId);
    if (isNaN(safeUId)) {
      throw new TypeError(`Expected 'uId' property to be parsable to an int. Provided value: ${JSON.stringify(row)}`);
    }

    if (typeof row.username !== 'string') {
      throw new TypeError(`Expected 'username' property to be a string. Provided value: ${JSON.stringify(row)}`);
    }

    this.lastLogin = row.lastLogin;
    this.restricted = row.Restricted === '1' ? true : false;
    this.uId = safeUId;
    this.username = row.username;

    Object.freeze(this);
  }
}
