[![bugsplat-github-banner-basic-outline](https://user-images.githubusercontent.com/20464226/149019306-3186103c-5315-4dad-a499-4fd1df408475.png)](https://bugsplat.com)
<br/>
# <div align="center">BugSplat</div> 
### **<div align="center">Crash and error reporting built for busy developers.</div>**
<div align="center">
    <a href="https://twitter.com/BugSplatCo">
        <img alt="Follow @bugsplatco on Twitter" src="https://img.shields.io/twitter/follow/bugsplatco?label=Follow%20BugSplat&style=social">
    </a>
    <a href="https://discord.gg/K4KjjRV5ve">
        <img alt="Join BugSplat on Discord" src="https://img.shields.io/discord/664965194799251487?label=Join%20Discord&logo=Discord&style=social">
    </a>
</div>

## 👋 Introduction
[@bugsplat/js-api-client](https://www.npmjs.com/package/@bugsplat/js-api-client) is a set of JavaScript client libraries for consuming the BugSplat API. This package is compatible in both browser and node environments as it provides ESM and CommonJS builds for each environment respectively. Additionally this package is implemented in TypeScript and the distributed builds include definition files and source maps.

## 🏗 Installation

Install [@bugsplat/js-api-client](https://www.npmjs.com/package/@bugsplat/js-api-client) via npm. This package currently requires Node.js 18 or later.

```sh
npm i @bugsplat/js-api-client
```

If you need to use a version of Node.js that's older than 18, you can install `@bugsplat/js-api-client@2.1.3`.

## ⚙️ Configuration

Import `BugSplatApiClient` and `Environment` from `@bugsplat\js-api-client`

```ts
import { BugSplatApiClient, Environment } from '@bugsplat/js-api-client';
```

Create an authenticated `BugSplatApiClient` following the steps below. Authentication is slightly different depending on if you are use `@bugsplat/js-api-client` in a Node.js or Web Browser environment. The method used to authenticate also depends on if you already have access to the user's email and password, or if you have to prompt for it at a later time.

The `host` value used to create a new instance of `BugSplatApiClient` is `https://app.bugsplat.com` for most scenarios. When using this library to upload a crash reports the host value will be `https://{{database}}.bugsplat.com`.

### Node.js
The static factory function `createAuthenticatedClientForNode` can be used to return an authenticated instance of `BugSplatApiClient` in Node.js environments.

```ts
const bugsplat = await BugSplatApiClient.createAuthenticatedClientForNode(email, password, host);
```

If you need to authenticate at a later time, you can create an instance of `BugSplatApiClient` and call `login` manually.

```ts
const bugsplat = new BugSplatApiClient(host, Environment.Node);
await bugsplat.login(email, password);
```

### Web Browser

The static factory function `createAuthenticatedClientForWebBrowser` can be used to return an authenticated instance of `BugSplatApiClient`.

```ts
const bugsplat = await BugSplatApiClient.createAuthenticatedClientForBrowser(email, password, host);
```

If you need to authenticate at a later time, you can create an instance of `BugSplatApiClient` and call `login` manually.

```ts
const bugsplat = new BugSplatApiClient(host, Environment.WebBrowser);
await bugsplat.login(email, password);
```

## ⌨️ Usage

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

## 🧑‍💻 Contributing

BugSplat ❤️s open source! If you feel that this package can be improved, please open an [Issue](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues). If you have an awesome new feature you'd like to implement, we'd love to merge your [Pull Request](https://github.com/BugSplat-Git/bugsplat-js-api-client/pulls). You can also send us an [email](mailto:support@bugsplat.com), join us on [Discord](https://discord.gg/K4KjjRV5ve), or message us via the in-app chat on [bugsplat.com](https://bugsplat.com).
