require.d(exports, {
  Z: function () {
    return a;
  }
});
var r = require("./611.js");
function a(e, t) {
  if (typeof t !== "function" && t !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  e.prototype = Object.create(t && t.prototype, {
    constructor: {
      value: e,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(e, "prototype", {
    writable: false
  });
  if (t) {
    (0, r.Z)(e, t);
  }
}