[![BugSplat](https://s3.amazonaws.com/bugsplat-public/npm/header.png)](https://www.bugsplat.com)

# Introduction
[@bugsplat/js-api-client](https://www.npmjs.com/package/@bugsplat/js-api-client) is a set of JavaScript client libraries for consuming the BugSplat API. This package is compatible in both browser and node environments as it provides ESM and CommonJS builds for each environment respectively. Additionally this package is implemented in TypeScript and the distributed builds include definition files and source maps.

# Overview

Before using this package you must [register](https://app.bugsplat.com/v2/sign-up) as a new BugSplat user.

## Install

Install [@bugsplat/js-api-client](https://www.npmjs.com/package/@bugsplat/js-api-client) via npm 

```sh
npm i @bugsplat/js-api-client
```

## Import

Import `BugSplatApiClient` and `Environment` from `@bugsplat\js-api-client`

```ts
import { BugSplatApiClient, Environment } from '@bugsplat/js-api-client';
```

## Authenticate

Create an authenticated `BugSplatApiClient` following the steps below. Authentication is slightly different depending on if you are use `@bugsplat/js-api-client` in a Node.js or Web Browser environment.

### Node.js

Node.js client's will need to authenticate in order to access most APIs. For convenience, the static factory function `createAuthenticatedClientForNode` can be used to return an authenticated instance of `BugSplatApiClient`.

```ts
const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(host, email, password);
```

### Web Browser

Browser clients will need to authenticate in order to access most APIs. However, the browser has access to cookies and thus may already be authenticated. If you need to authenticate, a static factory function `createAuthenticatedClientForWebBrowser` can be used to return an authenticated instance of `BugSplatApiClient`.

```ts
const bugsplat = await BugSplatApiClient.createAuthenticatedClientForBrowser(host, email, password);
```

## Usage

Create an instance of `CrashApiClient` or any of the API clients and pass a reference to the `BugSplatApiClient` instance

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

# Contributing

BugSplat ❤️s open source! If you feel that this package can be improved, please open an [Issue](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues). If you have an awesome new feature you'd like to implement, we'd love to merge your [Pull Request](https://github.com/BugSplat-Git/bugsplat-js-api-client/pulls). You can also reach out to us via an email to support@bugsplat.com or the in-app chat on bugsplat.com.
