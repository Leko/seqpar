// @flow
import fs from "fs";
import path from "path";
import { promisify } from "es6-promisify";
import _glob from "glob";
import type Config from "./Config";

const glob = promisify(_glob);
const readDir = promisify(fs.readdir);
const stat = promisify(fs.stat);

export default class FileMatcher {
  config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async match(target: string): Promise<Array<string>> {
    const targetGlob = this.config.recursive ? `${target}/**/*` : target;
    const files: Array<string> = _glob.hasMagic(targetGlob)
      ? await glob(targetGlob)
      : (await readDir(targetGlob)).map(f => path.join(target, f));
    if (files.length === 0) {
      throw new Error(`'${target}' is not found`);
    }

    const matched: Array<string> = [];
    for (let file of files) {
      const stats = await stat(file);
      if (!stats.isDirectory()) {
        matched.push(file);
      }
    }

    return matched;
  }
}
