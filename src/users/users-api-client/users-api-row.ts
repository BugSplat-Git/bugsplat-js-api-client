export class UsersApiRow {
  constructor(
    public readonly dbId: number,
    public readonly dbName: string,
    public readonly uId: number,
    public readonly username: string,
    public readonly lastLogin: string,
    public readonly unrestricted: number,
    public readonly requireMFA: number,
    public readonly firstName: string = '',
    public readonly lastName: string = ''
  ) {}
}
