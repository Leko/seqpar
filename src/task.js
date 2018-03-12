// @flow
import cluster from 'cluster'
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

type ProcessInformation = {
  exitCode: number,
  signal: string,
}

let config: Config

const send = async (message: Message): Promise<void> => {
  // $FlowFixMe
  process.send(message)
}

const run = async (config: Config, path: string): Promise<ProcessInformation> => {
  return new Promise((resolve, reject) => {
    const runtime = 'sh'
    const cp = spawn(runtime, [path])

    cp.on('close', (exitCode: number, signal: string) => resolve({ exitCode, signal }))
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
            log: `EXECUTING ${path.relative(process.cwd(), executeFile)}`,
            spent: new Date() - start,
          }))
        }, 200)
        const { exitCode, signal } = await run(config, executeFile)
        clearInterval(tid)
        await send(executed({ exitCode, signal }))
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
