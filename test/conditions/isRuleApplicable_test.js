const assert = require("assert");
const { isRuleApplicable } = require("../../src/Conditionals");

describe("isRuleApplicable", function() {
  describe("sanity check", function() {
    it("requires rule to be an object", function() {
      assert.throws(function() {
        isRuleApplicable("empty", {});
      }, ReferenceError);
    });
    it("requires formData to be an object", function() {
      assert.throws(function() {
        isRuleApplicable({}, 0);
      }, ReferenceError);
    });
  });
  describe("single line", function() {
    let singleLine = {
      firstName: "empty",
    };
    it("empty check", function() {
      assert.equal(isRuleApplicable(singleLine, {}), true);
      assert.equal(isRuleApplicable(singleLine, { firstName: "some" }), false);
      assert.equal(isRuleApplicable(singleLine, { firstName: "" }), true);
      assert.equal(
        isRuleApplicable(singleLine, { firstName: undefined }),
        true
      );
    });
  });
  describe("default use and", function() {
    let rule = {
      firstName: {
        equal: "Will",
      },
      lastName: {
        equal: "Smith",
      },
    };
    it("match only, when both match", function() {
      assert.equal(isRuleApplicable(rule, { firstName: "Will" }), false);
      assert.equal(isRuleApplicable(rule, { lastName: "Smith" }), false);
      assert.equal(
        isRuleApplicable(rule, { firstName: "Will", lastName: "Smith" }),
        true
      );
    });
  });
});
