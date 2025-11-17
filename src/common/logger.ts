export class Logger {
    private _verbose: boolean = false;

    constructor(verbose: boolean = false) {
        this._verbose = verbose;
    }

    setVerbose(verbose: boolean): void {
        this._verbose = verbose;
    }

    log(message: string, ...args: unknown[]): void {
        if (this._verbose) {
            console.log(`[BugSplat] ${message}`, ...args);
        }
    }

    error(message: string, ...args: unknown[]): void {
        if (this._verbose) {
            console.error(`[BugSplat] ${message}`, ...args);
        }
    }

    warn(message: string, ...args: unknown[]): void {
        if (this._verbose) {
            console.warn(`[BugSplat] ${message}`, ...args);
        }
    }
}

