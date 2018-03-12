// @flow
import EventEmitter from 'events'
import cluster from 'cluster'
import type Config from './Config'
import Worker from './Worker'
import {
  type Message, PROGRESS,
} from './Message'

export default class WorkerPool extends EventEmitter {
  config: Config
  workers: Array<Worker>

  constructor (config: Config, options: cluster$setupMasterOpts) {
    super()
    const deafultOptions: cluster$setupMasterOpts = {}

    this.workers = []
    this.config = config

    cluster.setupMaster(Object.assign(deafultOptions, options))
    cluster.on('exit', this.revive.bind(this))
    cluster.on('disconnect', this.revive.bind(this))
    cluster.on('message', this.handleMessage.bind(this))
  }

  handleMessage (rawWorker: cluster$Worker, message: Message) {
    const index = this.findIndexByRawWorker(rawWorker)
    const worker = this.workers[index]
    switch (message.type) {
      case PROGRESS:
        return this.emit('progress', worker, message, index)
    }
  }

  async revive (diedWorker?: cluster$Worker): Promise<void> {
    if (diedWorker) {
      try {
        const index = this.findIndexByRawWorker(diedWorker)
        const killedWorkers = this.workers.splice(index, 1)
        for (let killedWorker of killedWorkers) {
          await killedWorker.tearDown()
        }
      } catch (error) {
        console.error(error)
      }
    }

    const concurrency = this.config.concurrency

    while (1) {
      if (this.workers.length >= concurrency) {
        break
      }

      const worker = new Worker(cluster.fork())
      this.workers.push(worker)
      worker.on('idle', (worker: Worker) => {
        const index = this.workers.indexOf(worker)
        this.emit('idle', worker, index)
      })
      await worker.configure(this.config)
    }
  }

  findByRawWorker (worker: cluster$Worker): Worker {
    const found = this.workers.find(w => {
      return w.worker.id === worker.id
    })
    if (!found) {
      throw new RangeError(`worker id=${worker.id} is not managed`)
    }

    return found
  }

  findIndexByRawWorker (worker: cluster$Worker): number {
    const found = this.findByRawWorker(worker)
    return this.workers.indexOf(found)
  }

  async execute (file: string): Promise<void> {
    await this.revive()
    await this.runInIdleWorker(worker => worker.execute(file))
  }

  async runInIdleWorker (task: (worker: Worker) => Promise<any>): Promise<any> {
    const idleWorker = this.workers.find(worker => worker.isIdle())
    if (idleWorker) {
      return task(idleWorker)
    }

    const wait = () => new Promise((resolve, reject) => {
      const wakeUp = (worker) => {
        if (worker.isIdle()) {
          this.removeListener('idle', wakeUp)
          task(worker).then(resolve).catch(reject)
        } else {
          wait().then(resolve).catch(reject)
        }
      }
      this.on('idle', wakeUp)
    })

    return wait()
  }

  async disconnect (): Promise<void> {
    cluster.removeAllListeners()
    cluster.disconnect()
  }
}
