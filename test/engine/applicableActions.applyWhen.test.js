const assert = require("assert");
const { applyWhen } = require("../../src/engine/applicableActions");

describe("applyWhen", function() {
  describe("sanity check", function() {
    it("requires rule to be an object", function() {
      assert.throws(function() {
        applyWhen("empty", {});
      }, ReferenceError);
    });
    it("requires formData to be an object", function() {
      assert.throws(function() {
        applyWhen({}, 0);
      }, ReferenceError);
    });
  });
  describe("single line", function() {
    let singleLine = {
      firstName: "empty",
    };
    it("empty check", function() {
      assert.equal(applyWhen(singleLine, {}), true);
      assert.equal(applyWhen(singleLine, { firstName: "some" }), false);
      assert.equal(applyWhen(singleLine, { firstName: "" }), true);
      assert.equal(applyWhen(singleLine, { firstName: undefined }), true);
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
      assert.equal(applyWhen(rule, { firstName: "Will" }), false);
      assert.equal(applyWhen(rule, { lastName: "Smith" }), false);
      assert.equal(
        applyWhen(rule, { firstName: "Will", lastName: "Smith" }),
        true
      );
    });
  });
});
