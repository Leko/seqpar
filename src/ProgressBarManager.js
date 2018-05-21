// @flow
import ProgressBar from "./ProgressBar";

export default class ProgressBarManager {
  bars: Array<ProgressBar>;

  constructor(bars: Array<ProgressBar>) {
    this.bars = bars;
  }

  get(index: number): ProgressBar {
    if (!this.bars[index]) {
      throw new RangeError(
        `Out of bounds: ${index}. Max index is ${this.bars.length - 1}`
      );
    }

    return this.bars[index];
  }

  async clear(): Promise<void> {
    for (let bar of this.bars) {
      await bar.clear();
    }
    for (let bar of this.bars) {
      bar.bar.cursor.reset();
    }
    process.stdout.removeAllListeners("before:newlines");
  }
}
