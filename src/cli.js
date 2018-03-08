const os = require('os')
const path = require('path')
const yargs = require('yargs')
const pkg = require('../package.json')

const numCPUs = os.cpus().length
const shell = path.basename(process.env.SHELL)

const args = yargs
  .version(pkg.version)
  .usage(`${pkg.name} [DIRECTORY]`)
  .example(`${pkg.name} scripts --recursive`)
  .example(`${pkg.name} scripts --concurrency=2`)
  .example(`${pkg.name} scripts --glob='**/*.js'`)
  .example(`${pkg.name} scripts --no-color`)
  .example(`${pkg.name} scripts --runtimes=':sh,coffee:coffee,ts:ts-node'`)
  .option('p', {
    alias: 'concurrency',
    describe: 'Specify the maximum number of concurrency',
    number: true,
    default: numCPUs,
  })
  .option('g', {
    alias: 'glob',
    describe: 'Only execute files that match glob',
  })
  .option('b', {
    alias: 'bail',
    describe: 'Bail after first test failure',
    boolean: true,
    default: true,
  })
  .option('c', {
    alias: 'colors',
    describe: 'Force enabling of colors',
    boolean: true,
    default: true,
  })
  .option('r', {
    alias: 'recursive',
    describe: 'Include sub directories',
    boolean: true,
    default: false,
  })
  .option('reporters', {
    describe: 'Specify the reporter to use',
    default: 'plain',
    array: true,
  })
  .option('runtimes', {
    describe: 'Use the given runtime(s) to execute files',
    default: `:${shell},${shell}:${shell},js:node`,
    array: true,
  })
  .argv

console.log(args)
