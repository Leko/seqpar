import assert from "assert";

const assertError = (assertion, error) => {
  if (!assertion) {
    return true;
  }
  if (assertion instanceof RegExp) {
    return assertion.test(error.message);
  }
  return assertion(error);
};

export const assertRejects = async (fn, assertion): Promise<void> => {
  try {
    await fn();
    assert.ifError(new Error("Missing expected rejection"));
  } catch (error) {
    if (!assertError(assertion, error)) {
      assert.ifError(new Error("Missing expected rejection"));
    }
  }
};

export const assertDontRejects = async (fn, assertion): Promise<void> => {
  try {
    await fn();
    assert.ok(true);
  } catch (error) {
    assert.ifError(error);
  }
};
