export class CrashType {
    static readonly crashpad = new CrashType('Crashpad', 5);
    static readonly dotnet = new CrashType('Windows.NET', 8);
    static readonly electron = new CrashType('Electron', 22);
    static readonly native = new CrashType('Windows.Native', 1);
    static readonly mac = new CrashType('macOS', 13);
    static readonly ps4 = new CrashType('PlayStation 4', 28);
    static readonly ps5 = new CrashType('PlayStation 5', 29);
    static readonly xml = new CrashType('Xml.Report', 21);
    private constructor(public readonly name: string, public readonly id: number) { }
}