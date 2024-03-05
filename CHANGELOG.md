## [4.1.2](https://github.com/uniqueck/asciidoctor-jira/compare/v4.1.1...v4.1.2) (2024-03-05)


### Build

* Bump eslint from 8.56.0 to 8.57.0 ([74e6d36](https://github.com/uniqueck/asciidoctor-jira/commit/74e6d3657dec0ed612ff8f6167f74a78445ebe34))
* Bump mocha from 10.2.0 to 10.3.0 ([a59de25](https://github.com/uniqueck/asciidoctor-jira/commit/a59de25439c07ad17c0f144782a25cca3c5fb9f5))

### Fix

* Wrong underscore for JIRA_PASSWORD environment variable ([072c09f](https://github.com/uniqueck/asciidoctor-jira/commit/072c09fb3474dde4cd8fa84dafef528b4f36d860))

### Upgrade

* Bump dotenv from 16.4.1 to 16.4.5 ([a1f1fa6](https://github.com/uniqueck/asciidoctor-jira/commit/a1f1fa61e9fd796e637ecf90996c6abeea741da9))

## [4.1.1](https://github.com/uniqueck/asciidoctor-jira/compare/v4.1.0...v4.1.1) (2024-02-05)


### Fix

* Missing due date should skip issue ([08680de](https://github.com/uniqueck/asciidoctor-jira/commit/08680de8d3363831c37375366ba09f85bb964583))

# [4.1.0](https://github.com/uniqueck/asciidoctor-jira/compare/v4.0.1...v4.1.0) (2024-01-28)


### Build

* Bump @antora/site-generator-default from 3.1.6 to 3.1.7 ([d9ce33d](https://github.com/uniqueck/asciidoctor-jira/commit/d9ce33d97cca9df7bea5c5f5f29bd891d42b8199))
* Bump chai from 4.3.10 to 4.4.1 ([bf8e265](https://github.com/uniqueck/asciidoctor-jira/commit/bf8e265e24a85259eebe617281cc51f98f4e2a7f))
* Bump semantic-release from 22.0.12 to 23.0.0 ([1288347](https://github.com/uniqueck/asciidoctor-jira/commit/1288347fda4c520b1e9bac319346aee5b0eef6b1))
* Bump semantic-release from 22.0.8 to 22.0.12 ([a32668a](https://github.com/uniqueck/asciidoctor-jira/commit/a32668a4aa2e1bf42fc088c798e654e0881f70ed))
* use node 20.x for semantic release ([705755e](https://github.com/uniqueck/asciidoctor-jira/commit/705755ee923a49badae26f8ff3824dabd336a9ba))

### New

* introduce JIRA_PAT / ROADMAP_JIRA_PAT for bearer authentication for jira (fixes #170) ([aa6ae2a](https://github.com/uniqueck/asciidoctor-jira/commit/aa6ae2a048610ed9f172f8271d51aad179bcadb2)), closes [#170](https://github.com/uniqueck/asciidoctor-jira/issues/170)

### Upgrade

* Bump dotenv from 16.3.1 to 16.4.1 ([40d123e](https://github.com/uniqueck/asciidoctor-jira/commit/40d123e0b0d561a84d90c4c0ee842b6b81042c0e))

## [4.0.1](https://github.com/uniqueck/asciidoctor-jira/compare/v4.0.0...v4.0.1) (2024-01-03)


### Build

* Bump @antora/site-generator-default from 3.1.5 to 3.1.6 ([d6c0cbe](https://github.com/uniqueck/asciidoctor-jira/commit/d6c0cbed326b83d254229649a1ac1b6e31486a8e))
* Bump eslint from 8.54.0 to 8.56.0 ([5b494ae](https://github.com/uniqueck/asciidoctor-jira/commit/5b494aeff87e871ae6048c41c408227ad90be733))

### Fix

* Test adapted so that they run independently of the current year ([3014f7c](https://github.com/uniqueck/asciidoctor-jira/commit/3014f7c872feae3020a46074e90a72489490cc5d))

# [4.0.0](https://github.com/uniqueck/asciidoctor-jira/compare/v3.4.2...v4.0.0) (2023-11-26)


### Breaking

* Change default column size for `id` and all other columns and also enable to define custom sizes for each column (fixes #152) ([58796f4](https://github.com/uniqueck/asciidoctor-jira/commit/58796f4ac78ce382425d25f405a02ab498dc30a6)), closes [#152](https://github.com/uniqueck/asciidoctor-jira/issues/152)

## [3.4.2](https://github.com/uniqueck/asciidoctor-jira/compare/v3.4.1...v3.4.2) (2023-11-24)


### Build

* Bump @antora/site-generator-default from 3.1.4 to 3.1.5 ([e147882](https://github.com/uniqueck/asciidoctor-jira/commit/e1478828cfe449209f42cec1be5f469deeb82fad))
* Bump eslint from 8.50.0 to 8.53.0 ([d77de1a](https://github.com/uniqueck/asciidoctor-jira/commit/d77de1a38da51bbc7e350f72de2ead0cd8b9558d))
* Bump eslint from 8.53.0 to 8.54.0 ([1d5b7ec](https://github.com/uniqueck/asciidoctor-jira/commit/1d5b7ecab5d933106bdfb5dcaaf16b1878e50e0b))
* Bump semantic-release from 22.0.5 to 22.0.7 ([9053d73](https://github.com/uniqueck/asciidoctor-jira/commit/9053d73583b3b51d20fc29c5b6b9852257b5371f))
* Bump semantic-release from 22.0.7 to 22.0.8 ([70a14bf](https://github.com/uniqueck/asciidoctor-jira/commit/70a14bf6e04540faa0eb068445d4b7df1fce7ff9))

### Fix

* Handling wrong jql responses (fixes #147) ([1b88d00](https://github.com/uniqueck/asciidoctor-jira/commit/1b88d00bfd5da9606f4d8406479c1ce9a8c66273)), closes [#147](https://github.com/uniqueck/asciidoctor-jira/issues/147)

## [3.4.1](https://github.com/uniqueck/asciidoctor-jira/compare/v3.4.0...v3.4.1) (2023-10-02)


### Chore

* Cleanup unused code ([4593f7e](https://github.com/uniqueck/asciidoctor-jira/commit/4593f7ecfe1645fd551c5e5ca76c5ff4adf58d88))

### Fix

* parent is passed to method not the document object ([e5a5609](https://github.com/uniqueck/asciidoctor-jira/commit/e5a560951ff6a0799c681ea5c76e2a20fc9782b7))

# [3.4.0](https://github.com/uniqueck/asciidoctor-jira/compare/v3.3.1...v3.4.0) (2023-10-01)


### Build

* Bump chai from 4.3.8 to 4.3.10 ([f5d0105](https://github.com/uniqueck/asciidoctor-jira/commit/f5d0105cfff2f2d7f4ddeff8669d176d06d4ec71))
* Bump rimraf from 5.0.4 to 5.0.5 ([9f570b7](https://github.com/uniqueck/asciidoctor-jira/commit/9f570b7fc15ff970213ddac087b8311272c2dd44))

### Fix

* Only request custom field ids and not all fields ([9404c21](https://github.com/uniqueck/asciidoctor-jira/commit/9404c217227e4e6ddb989c2253edb56361a3007b))

### New

* Add roadmap layout options ([c869f64](https://github.com/uniqueck/asciidoctor-jira/commit/c869f64887bd45fe4f3fb47b51738314351a8ea3))

## [3.3.1](https://github.com/uniqueck/asciidoctor-jira/compare/v3.3.0...v3.3.1) (2023-09-26)


### Fix

* Jira Base url with defined project key ([b86913d](https://github.com/uniqueck/asciidoctor-jira/commit/b86913dd87ce4706d38d60ca99626570cd1d6c45))

# [3.3.0](https://github.com/uniqueck/asciidoctor-jira/compare/v3.2.0...v3.3.0) (2023-09-26)


### Build

* Bump eslint from 8.49.0 to 8.50.0 ([812c492](https://github.com/uniqueck/asciidoctor-jira/commit/812c4923269bb6da8429e58b09e647ef9f9d68f7))
* Bump rimraf from 5.0.1 to 5.0.4 ([af80eb0](https://github.com/uniqueck/asciidoctor-jira/commit/af80eb074f3cacfb0972e070ac5ff6aac3d5f99c))
* Bump semantic-release from 22.0.1 to 22.0.5 ([30f452c](https://github.com/uniqueck/asciidoctor-jira/commit/30f452c94a10047f40724f35a9402254fb5f9ba4))

### New

* Allow different jira instances based on project key ([096e81a](https://github.com/uniqueck/asciidoctor-jira/commit/096e81a9ac916cb5208cdc478812d120fae29f7b))

# [3.2.0](https://github.com/uniqueck/asciidoctor-jira/compare/v3.1.3...v3.2.0) (2023-09-25)


### Build

* Provide credentials for roadmap extension ([ee2066e](https://github.com/uniqueck/asciidoctor-jira/commit/ee2066eaccfc7b682b209ab62c8e28801ddc9b52))

### Chore

* Extract configuration settings for roadmap extension ([528cab9](https://github.com/uniqueck/asciidoctor-jira/commit/528cab98187839e5b2d7a3257b5cfb11a2cdd4db))
* Migrate old asciidoc based changelog to markdown based changelog ([5138f9b](https://github.com/uniqueck/asciidoctor-jira/commit/5138f9b755c56673534caa4f265a5c1f31e25ec5))

### Fix

* Authentication handling with JIRA ([9090787](https://github.com/uniqueck/asciidoctor-jira/commit/9090787647cd4b383329cf0095ecb7c5a6278557))
* create unique name for generated images ([9b62a59](https://github.com/uniqueck/asciidoctor-jira/commit/9b62a59127beb8fe586e47c3498af1df40e44616))
* Lint issues ([9361e29](https://github.com/uniqueck/asciidoctor-jira/commit/9361e295941e8150a20b933df481e2eb9d93ab0d))
* Roadmap extension only request specific fields ([a0f4cdf](https://github.com/uniqueck/asciidoctor-jira/commit/a0f4cdf082c8cf0e1beff51d155f5ace312e80e3))

### New

* Add option to define custom jql part for each category ([1b4517d](https://github.com/uniqueck/asciidoctor-jira/commit/1b4517dc2ddf2723b24c16ead1924ef3ce89249a))

## [3.1.3](https://github.com/uniqueck/asciidoctor-jira/compare/v3.1.2...v3.1.3) (2023-09-22)


### Fix

* create unique name for generated images ([ebd3cbd](https://github.com/uniqueck/asciidoctor-jira/commit/ebd3cbd4f51f92e5ed91b9c7af5642bb52f96cc9))

## [3.1.2](https://github.com/uniqueck/asciidoctor-jira/compare/v3.1.1...v3.1.2) (2023-09-22)


### Fix

* add missing main script flag in package.json ([aec00bc](https://github.com/uniqueck/asciidoctor-jira/commit/aec00bc6d99f839ba65959f1ab44b52ed22f0cb0))

## [3.1.1](https://github.com/uniqueck/asciidoctor-jira/compare/v3.1.0...v3.1.1) (2023-09-22)


### Fix

* add main script in package.json ([8e2ea7a](https://github.com/uniqueck/asciidoctor-jira/commit/8e2ea7a53efc9289400aaf2f91fc4f8eea35c1af))

# [3.1.0](https://github.com/uniqueck/asciidoctor-jira/compare/v3.0.0...v3.1.0) (2023-09-22)


### Build

* Bump semantic-release from 22.0.0 to 22.0.1 ([e740ca5](https://github.com/uniqueck/asciidoctor-jira/commit/e740ca5d7c599e74d3ad9a83851da837bccdbbf1))

### Chore

* restructure tests and fix lint issues ([4c04add](https://github.com/uniqueck/asciidoctor-jira/commit/4c04add0271280466f251da03dcf6a2e6175b9b8))

### New

* add new roadmap extension ([f349bf8](https://github.com/uniqueck/asciidoctor-jira/commit/f349bf878ab4afe20c5fccef22ff487b05540aa0))
* use project key on block macro for default jql ([75e2fd9](https://github.com/uniqueck/asciidoctor-jira/commit/75e2fd96bc420e7b0fce36ec70ee667df2298cab))

# [3.0.0](https://github.com/uniqueck/asciidoctor-jira/compare/v2.0.0...v3.0.0) (2023-09-18)


### Breaking

* Use lib directory instead of src directory ([3c85a0b](https://github.com/uniqueck/asciidoctor-jira/commit/3c85a0b2c545f522f4d1c00fad18234763c7a1d7))

### Build

* Bump chai from 4.3.7 to 4.3.8 ([97db42c](https://github.com/uniqueck/asciidoctor-jira/commit/97db42cab989914556f64990a8a945e2d758d796))
* Bump conventional-changelog-eslint from 4.0.0 to 5.0.0 ([c56d799](https://github.com/uniqueck/asciidoctor-jira/commit/c56d799d30f0aa59fd6d99d83a4b03d548b1875c))
* Bump semantic-release from 21.0.7 to 22.0.0 ([4712681](https://github.com/uniqueck/asciidoctor-jira/commit/471268191c51d3dce9f1c7f0dd324482775ac938))
* Remove unused dependency jest ([36040f0](https://github.com/uniqueck/asciidoctor-jira/commit/36040f0ff2444f304dc426f84fd6ec566d8cb72a))
* Switch to eslint instead of standard ([0415f01](https://github.com/uniqueck/asciidoctor-jira/commit/0415f01229204f294d6915ea927db2aafc3a209c))

# [2.0.0](https://github.com/uniqueck/asciidoctor-jira/compare/v1.1.0...v2.0.0) (2023-09-18)


### Breaking

* Drop support for node 16 ([c39f1d0](https://github.com/uniqueck/asciidoctor-jira/commit/c39f1d009153121caca8d54251611ffac068a97d))

# [1.1.0](https://github.com/uniqueck/asciidoctor-jira/compare/v1.0.0...v1.1.0) (2023-07-09)


### Build

* Bump @antora/site-generator-default from 2.3.4 to 3.1.4 ([363d7cc](https://github.com/uniqueck/asciidoctor-jira/commit/363d7cc457a831681815f99f75b3a7c367e1b9bc))
* Bump jest from 29.5.0 to 29.6.1 ([1feb5c9](https://github.com/uniqueck/asciidoctor-jira/commit/1feb5c992e63e8c9305e3097da68031875fa07f1))
* Bump mocha from 9.1.3 to 10.2.0 ([3f5e437](https://github.com/uniqueck/asciidoctor-jira/commit/3f5e437ecfac17fb188883703a60e3d69a618299))
* Bump rimraf from 3.0.2 to 5.0.1 ([187cb3d](https://github.com/uniqueck/asciidoctor-jira/commit/187cb3d48d4e01a28b89f184d5a71bf0b6fcff22))
* Bump semantic-release from 21.0.5 to 21.0.7 ([1c041f3](https://github.com/uniqueck/asciidoctor-jira/commit/1c041f371f650b20f04a2ab0fda1a36f488a92b9))
* configure commit message prefix for dependabot ([c008fa5](https://github.com/uniqueck/asciidoctor-jira/commit/c008fa5fadd8e33160d0a4cf0b3f5fc99a04daf9))
* only test in workflow ci ([52af2b2](https://github.com/uniqueck/asciidoctor-jira/commit/52af2b2e18ef9826e5ec52ccc73e650dcacba016))
* Update Github Actions ([78b9e85](https://github.com/uniqueck/asciidoctor-jira/commit/78b9e85fc6b71a191706c2617237b63318397fbd))

### Chore

* Bump chai from 4.3.6 to 4.3.7 ([b0e73d6](https://github.com/uniqueck/asciidoctor-jira/commit/b0e73d604acf33a30ed4a3a70c132c272a5dd13b))
* Bump jest from 28.1.2 to 29.5.0 ([29d497c](https://github.com/uniqueck/asciidoctor-jira/commit/29d497c6098a882fe13d2955a6b51528452e0428))
* Bump standard from 17.0.0 to 17.1.0 ([1e3e3ac](https://github.com/uniqueck/asciidoctor-jira/commit/1e3e3ac59a1f28edf855d14f703fadd0039145a2))
* change keywords in package.json ([fb58693](https://github.com/uniqueck/asciidoctor-jira/commit/fb5869360bd88efd19906d72a1c36672c78ef686))
* Use logger instead of console.log (#51) ([7bb021b](https://github.com/uniqueck/asciidoctor-jira/commit/7bb021bb349188c5c4596eaf071291517b78e015)), closes [#51](https://github.com/uniqueck/asciidoctor-jira/issues/51)

### Docs

* update ci badge ([737a742](https://github.com/uniqueck/asciidoctor-jira/commit/737a7425a96e83fa09e6c32b041574bb1bf8e2e8))

### New

* Provide a simple solution to render fields of type array (#97) ([bf9ef7b](https://github.com/uniqueck/asciidoctor-jira/commit/bf9ef7ba9229ea1fe393ded904b8d25c084be913)), closes [#97](https://github.com/uniqueck/asciidoctor-jira/issues/97)

### Upgrade

* Bump dotenv from 16.0.1 to 16.3.1 ([b65912a](https://github.com/uniqueck/asciidoctor-jira/commit/b65912a6a0c5a430ae28505e2d20333c30094da8))
* Bump mkdirp from 1.0.4 to 3.0.1 ([d7ec5d9](https://github.com/uniqueck/asciidoctor-jira/commit/d7ec5d9b6519c137b93e7c4a82a1b5d25336c5f9))

# 1.0.0 (2023-06-18)


### Breaking

* Upgrade min required NodeJs version to 16.x ([5bdb073](https://github.com/uniqueck/asciidoctor-jira/commit/5bdb073d473e9b8135a8238e584179d3c75d5427))

### Build

* switch to semantic release workflow ([24ae00b](https://github.com/uniqueck/asciidoctor-jira/commit/24ae00b690cdc97ee47dd530f9e146286c16477c))

# 0.2.2 - (2022-08-01)

### Fix

* Handle value of custom field of type number correct

# 0.2.1 - (2022-08-01)

### Fix

* Only show issue type icon, if `issuetye` as `customFieldId` defined

# 0.2.0 - (2022-07-20)

### Chore

* Bump `shx` from 0.3.3 to 0.3.4
* Bump `asciidoctor.js` from 2.2.5 to 2.2.6
* Bump `dotenv` from 10.0.0 to 16.0.1
* Bump `chai` from 4.3.4 to 4.3.6
* Bump `standard` from 16.0.4 to 17.0.0
* Bump `jest` from 27.2.5 to 28.1.2

### New

* Introduce a changelog
* Allow to use nested custom field ids
