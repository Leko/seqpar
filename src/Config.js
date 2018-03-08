// @flow
import chalk from 'chalk'
import type { ReporterType } from './Reporter'
import type { RuntimeProps } from './Runtime'

type ConfigProps = {
  concurrency: number,
  glob: string,
  bail: boolean,
  colors: boolean,
  recursive: boolean,
  reporters: Array<ReporterType>,
  runtimes: Array<RuntimeProps>,
}

export default class Config {
  concurrency: number
  glob: string
  bail: boolean
  colors: boolean
  recursive: boolean
  reporters: Array<ReporterType>
  runtimes: Array<RuntimeProps>

  constructor (props: ConfigProps) {
    this.concurrency = props.concurrency
    this.glob = props.glob
    this.bail = props.bail
    this.colors = props.colors
    this.recursive = props.recursive
    this.reporters = props.reporters
    this.runtimes = props.runtimes
  }

  get chalk () {
    return new chalk.constructor({ enabled: this.colors })
  }
}
