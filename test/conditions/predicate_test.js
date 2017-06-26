const predicate = require("predicate");
const assert = require("assert");

describe("equal", function() {
  it("work with same strings", function() {
    assert.equal(predicate.is("Will", "Will"), true);
    assert.equal(predicate.is("Will", "1Will"), false);
  });
});
