#!/usr/bin/env node
// @flow
import os from "os";
import path from "path";
import fs from "fs";
import yargs from "yargs";
import pkg from "../package.json";
import Config, { type ConfigProps } from "./Config";
import Runner from "./Runner";
import Scenario from "./Scenario";

type CLIOption = ConfigProps & {
  _: Array<string>
};

const numCPUs = os.cpus().length;
// $FlowFixMe
const shell = path.basename(process.env.SHELL);

const cliOption: CLIOption = yargs
  .version(pkg.version)
  .usage(`${pkg.name} [DIRECTORY]`)
  .example(`${pkg.name} 'scripts/**/*.js'`, "Using glob pattern")
  .example(`${pkg.name} --recursive scripts`, "Using recursive flag")
  .example(
    `${pkg.name} --no-bail 'scripts/**/*.js'`,
    "Run all process even if one or more process returns not-zero status"
  )
  .example(`${pkg.name} --concurrency=2 scripts`, "Specify concurrency")
  .example(`${pkg.name} --runtimes=':sh,coffee:coffee,ts:ts-node' scripts`)
  .epilogue(`For more information, find our manual at ${pkg.homepage}`)
  .option("p", {
    alias: "concurrency",
    describe: "Specify the maximum number of concurrency",
    number: true,
    default: numCPUs
  })
  .option("b", {
    alias: "bail",
    describe: "Bail after first test failure",
    boolean: true,
    default: true
  })
  .option("r", {
    alias: "recursive",
    describe: "Include sub directories",
    boolean: true,
    default: false
  })
  .option("reporters", {
    describe: "Specify the reporter to use",
    default: ["file"]
  })
  .option("runtimes", {
    describe: "Use the given runtime(s) to execute files",
    default: `:${shell},${shell}:${shell},js:node`,
    coerce: (runtimes: string) => {
      return runtimes
        .split(",")
        .map(runtime => runtime.split(":"))
        .reduce((acc, [ext, bin]) => ({ ...acc, [ext]: bin }), {});
    }
  }).argv;

const main = async (config: Config, target: string) => {
  const targetAbs = path.join(process.cwd(), target);
  const scenario = await Scenario.create(targetAbs, config);
  const runner = new Runner(config);
  await runner.run(scenario);
};

if (cliOption._.length !== 1) {
  console.error("DIRECTORY must be required");
  process.exit(1);
}

const options = ({
  ...cliOption,
  tempDir: fs.mkdtempSync(path.join(os.tmpdir(), "seqpar-"))
}: ConfigProps);
const config = new Config(options);
main(config, cliOption._[0]).catch(e => {
  console.error(e.stack);
  process.exit(1);
});
