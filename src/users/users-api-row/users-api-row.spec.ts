import { UsersApiRow } from './users-api-row';

describe('UsersApiRow', () => {
  let options;

  beforeEach(() => {
    options = {
      Restricted: '1',
      lastLogin: '2018-12-09 11:31:51',
      uId: '4',
      username: 'Fred',
    };
  });

  describe('lastLogin', () => {
    it('should throw if does not exist', () => {
      delete options.lastLogin;
      expect(() => new UsersApiRow(options)).toThrowError(/lastLogin/);
    });

    it('should throw if not a string', () => {
      options.lastLogin = 1234;
      expect(() => new UsersApiRow(options)).toThrowError(/lastLogin/);
    });
  });

  describe('Restricted', () => {
    it('should throw if does not exist', () => {
      delete options.Restricted;
      expect(() => new UsersApiRow(options)).toThrowError(/Restricted/);
    });

    it('should throw if not a string', () => {
      options.Restricted = 1234;
      expect(() => new UsersApiRow(options)).toThrowError(/Restricted/);
    });

    it('should throw if not a "1" or "0"', () => {
      options.Restricted = '12';
      expect(() => new UsersApiRow(options)).toThrowError(/Restricted/);

      options.Restricted = '1';
      expect(() => new UsersApiRow(options)).not.toThrow();

      options.Restricted = '0';
      expect(() => new UsersApiRow(options)).not.toThrow();
    });
  });

  describe('uId', () => {
    it('should throw if does not exist', () => {
      delete options.uId;
      expect(() => new UsersApiRow(options)).toThrowError(/uId/);
    });

    it('should throw if not a string', () => {
      options.uId = 1234;
      expect(() => new UsersApiRow(options)).toThrowError(/uId/);
    });

    it('should throw if not parsable to an int', () => {
      options.uId = 'abcd';
      expect(() => new UsersApiRow(options)).toThrowError(/uId/);

      options.uId = '1000';
      expect(() => new UsersApiRow(options)).not.toThrow();

      options.uId = '99999';
      expect(() => new UsersApiRow(options)).not.toThrow();
    });
  });

  describe('username', () => {
    it('should throw if does not exist', () => {
      delete options.username;
      expect(() => new UsersApiRow(options)).toThrowError(/username/);
    });

    it('should throw if not a string', () => {
      options.username = 1234;
      expect(() => new UsersApiRow(options)).toThrowError(/username/);
    });
  });

  describe('once instantiated', () => {
    it('should not be modifiable', () => {
      const result = new UsersApiRow(options);

      expect(() => {
        result.lastLogin = 'abcd';
      }).toThrow();
      expect(() => {
        result.restricted = false;
      }).toThrow();
      expect(() => {
        result.uId = 1;
      }).toThrow();
      expect(() => {
        result.username = 'abcd';
      }).toThrow();
    });
  });
});
