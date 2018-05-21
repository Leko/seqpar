// @flow
import type Config from "../Config";
import type { Processes } from "./index";

export default class File {
  config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async finalize(processes: Processes): Promise<void> {
    processes.forEach(({ step, info }, index) => {
      process.stdout.write(`[${index + 1}] ${info.path}\n`);
      process.stdout.write(`  group: ${step.id}\n`);
      process.stdout.write(`  exit: ${info.exitCode}\n`);
      process.stdout.write(`  spent: ${(info.spentTime / 1000).toFixed(1)}s\n`);
      process.stdout.write(`  logs:\n`);
      process.stdout.write(`    stdout: ${info.stdoutLog}\n`);
      process.stdout.write(`    stderr: ${info.stderrLog}\n`);
    });
  }
}
