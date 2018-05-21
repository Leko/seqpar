// @flow
import EventEmitter from "events";
import type Config from "./Config";
import {
  execute,
  configure,
  IDLE,
  ERROR,
  CONFIGURE_SUCCESS,
  EXECUTE_SUCCEESS,
  type Message
} from "./Message";

export default class Worker extends EventEmitter {
  worker: cluster$Worker;
  idle: boolean;

  constructor(worker: cluster$Worker) {
    super();
    this.worker = worker;
    this.idle = false;

    worker.on("message", this.handleMessage.bind(this));
  }

  handleMessage(message: Message) {
    switch (message.type) {
      case IDLE:
        this.idle = true;
        this.emit("idle", this);
    }
  }

  get id(): number {
    return this.worker.id;
  }

  isIdle(): boolean {
    return this.idle;
  }

  async configure(config: Config): Promise<void> {
    this.worker.send(configure(config));
    await this.waitFor(CONFIGURE_SUCCESS);
  }

  async execute(file: string): Promise<boolean> {
    this.idle = false;
    this.worker.send(execute(file));
    await this.waitFor(EXECUTE_SUCCEESS);
    return true;
  }

  async tearDown(): Promise<void> {}

  async waitFor(type: string): Promise<Message> {
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        this.worker.removeListener("error", onError);
        this.worker.removeListener("message", onMessage);
      };
      const onError = (error: Error) => {
        cleanup();
        reject(error);
      };
      const onMessage = (message: Message) => {
        if (message.type === ERROR) {
          cleanup();
          return reject(message.error);
        }
        if (message.type === type) {
          cleanup();
          return resolve(message);
        }
      };

      this.worker.once("error", onError);
      this.worker.on("message", onMessage);
    });
  }
}
