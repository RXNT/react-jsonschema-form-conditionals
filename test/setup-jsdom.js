var jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Setup the jsdom environment
// @see https://github.com/facebook/react/issues/5046
if (!global.hasOwnProperty("window")) {
  global.document = new JSDOM("<!doctype html><html><body></body></html>");
  global.window = global.document.window;
  global.navigator = global.window.navigator;
}

// atob
global.atob = require("atob");

// HTML debugging helper
global.d = function d(node) {
  console.log(require("html").prettyPrint(node.outerHTML, { indent_size: 2 }));
};
