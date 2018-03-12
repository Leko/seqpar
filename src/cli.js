// @flow
import os from 'os'
import path from 'path'
import yargs from 'yargs'
import pkg from '../package.json'
import Config, { type ConfigProps } from './Config'
import Runner from './Runner'
import Scenario from './Scenario'

type CLIOption = ConfigProps & {
  _: Array<string>,
}

const numCPUs = os.cpus().length
// $FlowFixMe
const shell = path.basename(process.env.SHELL)

const cliOption: CLIOption = yargs
  .version(pkg.version)
  .usage(`${pkg.name} [DIRECTORY]`)
  .example(`${pkg.name} scripts/**/*.js`)
  .example(`${pkg.name} scripts --recursive`)
  .example(`${pkg.name} scripts --concurrency=2`)
  .example(`${pkg.name} scripts --no-color`)
  .example(`${pkg.name} scripts --runtimes=':sh,coffee:coffee,ts:ts-node'`)
  .epilogue(`For more information, find our manual at ${pkg.homepage}`)
  .option('p', {
    alias: 'concurrency',
    describe: 'Specify the maximum number of concurrency',
    number: true,
    default: numCPUs,
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
  })
  .option('runtimes', {
    describe: 'Use the given runtime(s) to execute files',
    default: `:${shell},${shell}:${shell},js:node`,
    coerce: (runtimes: string) => {
      return runtimes.split(',')
        .map(runtime => runtime.split(':'))
        .reduce((acc, [ext, bin]) => ({ ...acc, [ext]: bin }), {})
    },
  })
  .argv

const main = async (config: Config, target: string) => {
  const targetAbs = path.join(process.cwd(), target)
  const scenario = await Scenario.create(targetAbs, config)
  const runner = new Runner(config)
  await runner.run(scenario)
}

if (cliOption._.length !== 1) {
  console.error('DIRECTORY must be required')
  process.exit(1)
}

const config = new Config(cliOption)
main(config, cliOption._[0])
  .catch(e => {
    console.error(e.stack)
    process.exit(1)
  })
