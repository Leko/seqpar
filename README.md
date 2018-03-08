# seqpar
seqpar is a batch executor run in sequential &amp; parallel.  
It's easy to create efficient build process.

## Install
```
npm i -g seqpar
```

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
  -g, --glob         Only execute files that match glob
  -b, --bail         Bail after first test failure     [boolean] [default: true]
  -c, --colors       Force enabling of colors          [boolean] [default: true]
  -r, --recursive    Include sub directories          [boolean] [default: false]
  --reporters        Specify the reporter to use      [array] [default: "plain"]
  --runtimes         Use the given runtime(s) to execute files
                                    [array] [default: ":bash,bash:bash,js:node"]
```

## Contribution
seqpar welcomes all contributions from anyone.

1. Fork it
1. Run `npm install`
1. Commit your changes
1. Send pull request to `master` branch
