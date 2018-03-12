// @flow
import cluster from 'cluster'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import {
  idle,
  configured,
  executed,
  progress,
  ERROR,
  EXECUTE,
  CONFIGURE,
  type Message, IDLE,
} from './Message'
import Config from './Config'
import { escapePath, type ProcessInformation } from './Reporter'

let config: Config

const relative = (file) => path.relative(process.cwd(), file)

const send = async (message: Message): Promise<void> => {
  // $FlowFixMe
  process.send(message)
}

const run = async (config: Config, file: string): Promise<ProcessInformation> => {
  return new Promise((resolve, reject) => {
    const runtime = 'sh'
    const startsAt = new Date()
    const stdoutLog = path.join(config.tempDir, `${escapePath(file)}_stdout`)
    const stderrLog = path.join(config.tempDir, `${escapePath(file)}_stderr`)
    const cp = spawn(runtime, [file])
    const pid = cp.pid
    cp.stdout.pipe(fs.createWriteStream(stdoutLog))
    cp.stderr.pipe(fs.createWriteStream(stderrLog))

    cp.on('close', (exitCode: number, signal: string) => resolve({
      path: relative(file),
      exitCode,
      signal,
      pid,
      spentTime: new Date() - startsAt,
      stdoutLog,
      stderrLog,
    }))
    cp.on('error', reject)
    cp.on('disconnect', (...args) => console.error('disconnect', ...args))
  })
}

const toIdle = async () => {
  await send(idle())
  await send(progress({
    workerId: cluster.worker.id,
    log: IDLE,
    spent: 0,
  }))
}

process.on('message', async (message: Message) => {
  try {
    switch (message.type) {
      case CONFIGURE: {
        config = new Config(message.config)
        await send(configured())
        await toIdle()
        return
      }
      case EXECUTE: {
        const executeFile = message.path
        const start = new Date()
        const tid = setInterval(async () => {
          await send(progress({
            workerId: cluster.worker.id,
            log: `EXECUTING ${relative(executeFile)}`,
            spent: new Date() - start,
          }))
        }, 200)
        const result = await run(config, executeFile)
        clearInterval(tid)
        await send(executed(result))
        await toIdle()
        return
      }
      default:
        throw new Error(`Unexpected message type: ${message.type}`)
    }
  } catch (error) {
    send({ type: ERROR, error: error })
  }
})
