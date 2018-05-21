// @flow

export type RuntimeProps = string;

export default class Runtime {
  executable: string;

  constructor(executable: RuntimeProps) {
    this.executable = executable;
  }
}
