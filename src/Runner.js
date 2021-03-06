// @flow
import path from "path";
import times from "lodash/times";
import Scenario from "./Scenario";
import Config from "./Config";
import Step from "./Step";
import { getReporter, type Processes } from "./Reporter";
import type { ExecutedMessage, ProgressMessage } from "./Message";
import ProgressBarManager from "./ProgressBarManager";
import ProgressBar from "./ProgressBar";
import WorkerPool from "./WorkerPool";

export default class Runner {
  config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async run(scenario: Scenario): Promise<void> {
    const reporters = this.config.reporters.map(type => {
      const Reporter = getReporter(type);
      return new Reporter(this.config);
    });
    const bars = times(this.config.concurrency, () => new ProgressBar());
    const bar = new ProgressBarManager(bars);
    const pool = new WorkerPool(this.config, {
      exec: path.join(__dirname, "task.js")
    });

    let step: Step;
    const processes: Processes = [];
    try {
      pool.on(
        "progress",
        (worker: Worker, message: ProgressMessage, index: number) => {
          bar.get(index).display(step, message);
        }
      );
      pool.on(
        "executed",
        (worker: Worker, message: ExecutedMessage, index: number) => {
          if (this.config.bail && message.exitCode !== 0) {
            throw new Error(require("fs").readFileSync(message.stderrLog));
          }
          processes.push({ step, info: message });
        }
      );

      for (step of scenario.steps) {
        await this.runStep(pool, step);
      }
      await bar.clear();
    } catch (error) {
      await bar.clear();
      console.error(error);
    } finally {
      await Promise.all(reporters.map(r => r.finalize(processes)));

      await pool.disconnect();
    }
  }

  async runStep(pool: WorkerPool, step: Step): Promise<boolean> {
    const files = step.files.slice();

    const next = async () => {
      if (files.length === 0) {
        return true;
      }
      const file = files.pop();
      await pool.execute(file).then(next);
    };

    const initials = times(this.config.concurrency, () => next());
    return Promise.all(initials);
  }
}
