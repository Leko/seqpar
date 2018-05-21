// @flow
import assert from "assert";
import sinon from "sinon";
import { describe, it } from "mocha";
import Step, { type StepID, createStepID } from "../../src/Step";
import { progress } from "../../src/Message";
import ProgressBar from "../../src/ProgressBar";

describe("ProgressBar", () => {
  describe("constructor", () => {
    it("bar is initialized", () => {
      const progressBar = new ProgressBar();
      assert.ok(progressBar.bar);
    });
  });
  describe("display", () => {
    it("display line length same as terminal width", () => {
      const progressBar = new ProgressBar();
      const stepId: StepID = createStepID("1");
      const step = new Step(stepId, []);
      const message = progress({ workerId: 0, log: "test", spent: 1200 });
      const stub = sinon.stub(progressBar.bar, "update");
      progressBar.display(step, message);
      const line = Object.values(stub.args[0][1]).join("");
      // $FlowFixMe(stdout-has-columns)
      assert.equal(line.length, process.stdout.columns);
      stub.restore();
    });
  });
});
