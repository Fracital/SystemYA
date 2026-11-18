function r(e, t) {
  r = Object.setPrototypeOf || function (e, t) {
    e.__proto__ = t;
    return e;
  };
  return r(e, t);
}
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
    r(e, t);
  }
}
require.d(exports, {
  Z: function () {
    return a;
  }
});