# [5.0.0](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v4.3.0...v5.0.0) (2023-02-06)


* feat!: remove EventStream (#97) ([136aad9](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/136aad9a93af3b2716f2a9ca990b00ee001e2b61)), closes [#97](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/97) [#29](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/29) [#96](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/96)


### BREAKING CHANGES

* removes EventStream

# [4.3.0](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v4.2.0...v4.3.0) (2023-02-03)


### Features

* update KeyCrashPageData ([#95](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/95)) ([986832d](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/986832dfb1b9072207d1a367290868dbe33bb7c4))

# [4.2.0](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v4.1.0...v4.2.0) (2023-02-02)


### Features

* add page data for crash and key crash ([#94](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/94)) ([c818fd1](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/c818fd10c108ceee9c7ec4fbea2c569dc1e3e0f5))

# [4.1.0](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v4.0.0...v4.1.0) (2023-01-29)


### Features

* add key crash client ([#93](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/93)) ([3768787](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/376878776631496b2e84ce3cc076334835bcf569))

# [4.0.0](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v3.0.0...v4.0.0) (2023-01-09)


* feat!: allow body reuse (#92) ([498f448](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/498f448988c03a8b5249309ec330c92d257f382a)), closes [#92](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/92)


### BREAKING CHANGES

* api client now returns Response instead of BugSplatResponse to allow cloning. BugSplatResponse `json` no longer returns type `any`.

# [3.0.0](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v2.1.3...v3.0.0) (2022-11-15)


* feat!: require node 18 (#88) ([01b9907](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/01b9907efa31368d24d071eed4ff242b12667f13)), closes [#88](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/88)


### BREAKING CHANGES

* requires Node.js 18 or later

## [2.1.3](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v2.1.2...v2.1.3) (2022-11-15)


### Bug Fixes

* better messages for 4xx errors ([#87](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/87)) ([115486e](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/115486e59353be23bab3a3c204597863302edcd3))

## [2.1.2](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v2.1.1...v2.1.2) (2022-11-10)


### Bug Fixes

* set retired and fullDumps correctly ([#86](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/86)) ([632e027](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/632e0271aabed7b7c818e1c107f997f968c7884a))

## [2.1.1](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v2.1.0...v2.1.1) (2022-10-19)


### Bug Fixes

* better error for invalid client id or client secret ([#84](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/84)) ([16b349a](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/16b349a44bbc651da4084e2306b801f4ac23f33a))

# [2.1.0](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v2.0.0...v2.1.0) (2022-10-13)


### Features

* add summary client ([#82](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/82)) ([ff1a9b3](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/ff1a9b3a94828450d0d309703afdc3e870f8befc))

# [2.0.0](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v1.1.6...v2.0.0) (2022-04-21)


### Features

* replace Symbols API Client with Versions API Client ([#76](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/76)) ([cd0fe3b](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/cd0fe3b18ae9e117b1fcc165e40a1c6c39d1a817)), closes [#75](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/75)


### BREAKING CHANGES

* we've merged the Symbols and Versions APIs to a single Versions API and thus have removed the Symbols API client.

## [1.1.6](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v1.1.5...v1.1.6) (2021-12-09)


### Bug Fixes

* add sortOrder to table-data-request ([#67](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/67)) ([80e2bde](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/80e2bde40cbc47168c5aea16ba77277c7722f192)), closes [#64](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/64)

## [1.1.5](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v1.1.4...v1.1.5) (2021-11-27)


### Bug Fixes

* add groupByCount to CrashesApiRow ([#65](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/65)) ([9caa770](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/9caa77028987ab58e95b1e8205fcef63825f8eb7)), closes [#64](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/64)

## [1.1.4](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v1.1.3...v1.1.4) (2021-11-22)


### Bug Fixes

* crashesApiRow id, stackKeyId should be type number ([#63](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/63)) ([3b98da9](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/3b98da9edd6e94802cf6f47d188b7b7192766965)), closes [#62](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/62)

## [1.1.3](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v1.1.2...v1.1.3) (2021-11-22)


### Bug Fixes

* expose TableDataFormDataBuilder ([#61](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/61)) ([a72b4a9](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/a72b4a9f1352ed5b2ea6311f2fdf422a114fb67e)), closes [#60](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/60)

## [1.1.2](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v1.1.1...v1.1.2) (2021-11-22)


### Bug Fixes

* throw more useful error if OAuthClientCredentialsApiClient fails to authenticate ([#58](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/58)) ([6c0cd4c](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/6c0cd4c69a752ad6ef28c6c3ff6ce7dff273e2a1)), closes [#52](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/52)

## [1.1.1](https://github.com/BugSplat-Git/bugsplat-js-api-client/compare/v1.1.0...v1.1.1) (2021-11-19)


### Bug Fixes

* Adds Buffer to UploadableFile union type ([#54](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/54)) ([0e023fb](https://github.com/BugSplat-Git/bugsplat-js-api-client/commit/0e023fbfed9b93cec7a0f18ed4ab3f0756143a3a)), closes [#53](https://github.com/BugSplat-Git/bugsplat-js-api-client/issues/53)
