require.d(exports, {
  Z: function () {
    return o;
  }
});
var r = require("./907.js");
var a = require("./181.js");
function o(e) {
  return function (e) {
    if (Array.isArray(e)) {
      return (0, r.Z)(e);
    }
  }(e) || function (e) {
    if (typeof Symbol !== "undefined" && e[Symbol.iterator] != null || e["@@iterator"] != null) {
      return Array.from(e);
    }
  }(e) || (0, a.Z)(e) || function () {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }();
}