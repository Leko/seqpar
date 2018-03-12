// @flow
import { sep } from 'path'
import type Step from '../Step'
import File from './File'

export type ProcessInformation = {
  path: string,
  exitCode: number,
  signal: string,
  pid: number,
  spentTime: number,
  stdoutLog: string,
  stderrLog: string,
}
export type Processes = Array<{
  step: Step,
  info: ProcessInformation,
}>

const reporters = {
  file: File,
}

export type ReporterType = $Keys<typeof reporters>

export const getReporter = (type: ReporterType): $Values<typeof reporters> => reporters[type]

export const escapePath = (path: string) => path.split(sep).join('_')
