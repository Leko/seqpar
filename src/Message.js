// @flow
import type Config from './Config'
import type { ProcessInformation } from './Reporter'

// https://qiita.com/mizchi/items/0e2db7c56541c46a7785
// eslint-disable-next-line no-unused-vars
type __ReturnType<B, F: (...any) => B> = B
export type $ReturnType<F> = __ReturnType<*, F>

export const IDLE: 'IDLE' = 'IDLE'
export const ERROR: 'ERROR' = 'ERROR'
export const EXECUTE: 'EXECUTE' = 'EXECUTE'
export const EXECUTE_SUCCEESS: 'EXECUTE_SUCCEESS' = 'EXECUTE_SUCCEESS'
export const CONFIGURE: 'CONFIGURE' = 'CONFIGURE'
export const CONFIGURE_SUCCESS: 'CONFIGURE_SUCCESS' = 'CONFIGURE_SUCCESS'
export const PROGRESS: 'PROGRESS' = 'PROGRESS'

export const idle = () => ({
  type: IDLE,
})
export const error = (error: Error) => ({
  type: ERROR,
  error: {
    name: error.name,
    // $FlowFixMe(Node.js-has-code-prop)
    code: error.code,
    message: error.message,
    stack: error.stack,
  },
})
export const execute = (path: string) => ({
  type: EXECUTE,
  path,
})
export const executed = ({ path, exitCode, signal, pid, spentTime, stdoutLog, stderrLog }: ProcessInformation) => ({
  type: EXECUTE_SUCCEESS,
  path,
  exitCode,
  signal,
  pid,
  spentTime,
  stdoutLog,
  stderrLog,
})
export const configure = (config: Config) => ({
  type: CONFIGURE,
  config,
})
export const configured = () => ({
  type: CONFIGURE_SUCCESS,
})
export const progress = ({ workerId, log, spent }: { workerId: number, log: string, spent: number }) => ({
  type: PROGRESS,
  workerId,
  log,
  spent,
})

export type IdleMessage = $ReturnType<typeof idle>
export type ErrorMessage = $ReturnType<typeof error>
export type ExecuteMessage = $ReturnType<typeof execute>
export type ExecutedMessage = $ReturnType<typeof executed>
export type ConfigureMessage = $ReturnType<typeof configure>
export type ConfiguredMessage = $ReturnType<typeof configured>
export type ProgressMessage = $ReturnType<typeof progress>

export type Message =
  IdleMessage
  | ErrorMessage
  | ExecuteMessage
  | ExecutedMessage
  | ConfigureMessage
  | ConfiguredMessage
  | ProgressMessage
