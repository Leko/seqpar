# seqpar

[![Greenkeeper badge](https://badges.greenkeeper.io/Leko/seqpar.svg)](https://greenkeeper.io/)
[![npm](https://img.shields.io/npm/v/seqpar.svg)](https://www.npmjs.com/package/seqpar)
[![GitHub license](https://img.shields.io/github/license/Leko/seqpar.svg)](https://github.com/Leko/seqpar/blob/master/LICENSE)
[![CircleCI](https://circleci.com/gh/Leko/seqpar/tree/master.svg?style=svg)](https://circleci.com/gh/Leko/seqpar/tree/master)

seqpar is a batch executor run in sequential &amp; parallel.  
It's easy to create efficient build process.

![seqpar_beautify](https://user-images.githubusercontent.com/1424963/37290004-8183a70e-264e-11e8-9a00-e723715a6e60.gif)

## Install
```
npm i -g seqpar
```

### Requirement
- Node.js 6+

## Defint first batch file
All batch files are named in `{GROUP}_name(.{ext})` (e.g. `000_init.js`, `01_lint.sh`, `999_failover`).

```sh
#!/usr/bin/env bash

echo 'Hello, seqpar!'
```

```js
console.log('Hello, seqpar!')
```

### Executable order and parallelism
Same `GROUP` run in parallel, different group run in sequential.

```
000_init
010_bootstrap_npm   <- Run in parallel
010_bootstrap_pods  <- Run in parallel
010_bootstrap_cargo <- Run in parallel
020_lint
030_build
040_tag                <- Run in parallel
040_generate_changelog <- Run in parallel
040_prepublish         <- Run in parallel
999_publish
```

## Usage
```
seqpar [DIRECTORY]

Options:
  --help             Show help                                         [boolean]
  --version          Show version number                               [boolean]
  -p, --concurrency  Specify the maximum number of concurrency
                                                           [number] [default: 4]
  -b, --bail         Bail after first test failure     [boolean] [default: true]
  -r, --recursive    Include sub directories          [boolean] [default: false]
  --reporters        Specify the reporter to use             [default: ["file"]]
  --runtimes         Use the given runtime(s) to execute files
                                            [default: ":bash,bash:bash,js:node"]

Examples:
  seqpar 'scripts/**/*.js'                  Using glob pattern
  seqpar --recursive scripts                Using recursive flag
  seqpar --no-bail 'scripts/**/*.js'        Run all process even if one or more
                                            process returns not-zero status
  seqpar --concurrency=2 scripts            Specify concurrency
  seqpar --runtimes=':sh,coffee:coffee,ts:ts-node' scripts

For more information, find our manual at https://github.com/Leko/seqpar
```

## Contribution
seqpar welcomes all contributions from anyone.

1. Fork it
1. Run `npm install`
1. Commit your changes
1. Send pull request to `master` branch
