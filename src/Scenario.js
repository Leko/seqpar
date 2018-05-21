// @flow
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import first from "lodash/first";
import type Config from "./Config";
import FileMatcher from "./FileMatcher";
import Step from "./Step";

export default class Scenario {
  static async create(target: string, config: Config): Promise<Scenario> {
    const matcher = new FileMatcher(config);
    const files = await matcher.match(target);
    const filesById = groupBy(files, Step.parseId);
    const steps = sortBy(Object.entries(filesById), first).map(
      ([id, files]) => new Step(id, files.sort())
    );

    return new Scenario(steps, config);
  }

  steps: Array<Step>;
  config: Config;

  constructor(steps: Array<Step>, config: Config) {
    this.steps = steps;
    this.config = config;
  }
}
