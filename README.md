[![BugSplat](https://s3.amazonaws.com/bugsplat-public/npm/header.png)](https://www.bugsplat.com)

## Introduction
[@bugsplat/js-api-client](https://www.npmjs.com/package/@bugsplat/js-api-client) is a set of JavaScript client libraries for consuming the BugSplat API. This package is compatible in both browser and node environments as it provides ESM and CommonJS builds for each environment respectively. Additionally this package is implemented in TypeScript and the distributed builds include definition files and source maps.

## Usage
Before using this package you must [register](https://app.bugsplat.com/v2/sign-up) as a new BugSplat user.

Install [@bugsplat/js-api-client](https://www.npmjs.com/package/@bugsplat/js-api-client) via npm 

```sh
npm i @bugsplat/js-api-client
```

Import `BugSplatApiClient` and `Environment` from `@bugsplat\js-api-client`

```ts
import { BugSplatApiClient, Environment } from '@bugsplat/js-api-client';
```

Create an instance of `BugSplatApiClient` and optionally pass values for host and environment

```ts
const bugsplat = new BugSplatApiClient('https://app.bugsplat.com', Environment.Node);
```

Await the call to login to authenticate using an email and password

```ts
const response = await bugsplat.login(email, password);
```

Create an instance of CrashApiClient or any of the API clients with a reference to the BugSplatApiClient instance

```ts
const client = new CrashApiClient(bugsplat);
```

The API clients are built to automatically parse responses from BugSplat into objects that can be used by your application

```ts
const database = 'Fred';
const id = 100389;
const crash = await client.getCrashById(database, id);

for (const stackFrame of crash.thread.stackFrames) {
  console.log(stackFrame);
}

// StackFrame {
//     fileName: 'C:\\BugSplat\\samples\\myConsoleCrasher\\myConsoleCrasher.cpp',
//     functionName: 'myConsoleCrasher!MemoryException',
//     lineNumber: 150,
//     stackFrameLevel: 1,
//     arguments: [],
//     locals: []
// }
// StackFrame {
//     fileName: 'C:\\BugSplat\\samples\\myConsoleCrasher\\myConsoleCrasher.cpp',
//     functionName: 'myConsoleCrasher!wmain',
//     lineNumber: 84,
//     stackFrameLevel: 2,
//     arguments: [
//       { variable: 'int argc', value: '0n2' },
//       { variable: 'wchar_t ** argv', value: '0x0125ef20' }
//     ],
//     locals: [
//       { variable: 'int i', value: '0n1' },
//       { variable: 'int argc', value: '0n2' },
//       { variable: 'wchar_t ** argv', value: '0x0125ef20' }
//     ]
// }
// ...
```

## Contributing

BugSplat ❤️s open source! If you feel that this package can be improved, please open an [Issue](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues). If you have an awesome new feature you'd like to implement, we'd love to merge your [Pull Request](https://github.com/BugSplat-Git/bugsplat-js-api-client/pulls). You can also reach out to us via an email to support@bugsplat.com or the in-app chat on bugsplat.com.
