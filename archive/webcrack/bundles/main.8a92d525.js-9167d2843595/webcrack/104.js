require.d(exports, {
  Z: function () {
    return l;
  }
});
var r = require("./120.js");
var a = require("./814.js");
function o(e) {
  o = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function (e) {
    return typeof e;
  } : function (e) {
    if (e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype) {
      return "symbol";
    } else {
      return typeof e;
    }
  };
  return o(e);
}
function i(e, t) {
  if (t && (o(t) === "object" || typeof t === "function")) {
    return t;
  }
  if (t !== undefined) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return function (e) {
    if (e === undefined) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return e;
  }(e);
}
function l(e) {
  var t = (0, a.Z)();
  return function () {
    var n;
    var a = (0, r.Z)(e);
    if (t) {
      var o = (0, r.Z)(this).constructor;
      n = Reflect.construct(a, arguments, o);
    } else {
      n = a.apply(this, arguments);
    }
    return i(this, n);
  };
}