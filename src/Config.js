// @flow
import type { ReporterType } from './Reporter'
import Runtime, { type RuntimeProps } from './Runtime'

export type ConfigProps = {
  concurrency: number,
  bail: boolean,
  colors: boolean,
  recursive: boolean,
  reporters: Array<ReporterType>,
  runtimes: { [ext: string]: RuntimeProps },
  tempDir: string,
}

export default class Config {
  concurrency: number
  bail: boolean
  colors: boolean
  recursive: boolean
  reporters: Array<ReporterType>
  runtimes: { [ext: string]: RuntimeProps }
  tempDir: string

  constructor (props: ConfigProps) {
    this.concurrency = props.concurrency
    this.bail = props.bail
    this.colors = props.colors
    this.recursive = props.recursive
    this.reporters = props.reporters
    this.runtimes = props.runtimes
    this.tempDir = props.tempDir
  }

  getRuntime (ext: string): Runtime {
    const executable = this.runtimes[ext] || this.runtimes['']
    return new Runtime(executable)
  }
}
