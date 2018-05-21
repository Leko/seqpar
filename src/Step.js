// @flow
import path from "path";

export opaque type StepID: string = string;

export default class Step {
  static parseId(file: string): StepID {
    const basename = path.basename(file);
    const matched = basename.match(/([^_]+)_/);
    if (!matched || !matched[1]) return basename;

    return matched[1];
  }

  id: StepID;
  files: Array<string>;

  constructor(id: StepID, files: Array<string>) {
    this.id = id;
    this.files = files;
  }
}

export const createStepID = (id: string): StepID => id;
