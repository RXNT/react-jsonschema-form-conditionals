const predicate = require("predicate");
const assert = require("assert");

describe("equal", function () {
  it("work with same strings", function () {
    assert.equal(predicate.eq("Will", "Will"), true);
    assert.equal(predicate.eq("Will", "1Will"), false);
  });
});

describe("empty", function () {
  it("work with empty", function () {
    assert.equal(predicate.empty(""), true);
    assert.equal(predicate.empty(undefined), true);
    assert.equal(predicate.empty(null), true);
  });
});
