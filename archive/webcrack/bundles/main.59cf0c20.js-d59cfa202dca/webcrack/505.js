require.d(exports, {
  Z: function () {
    return i;
  }
});
var r = require("./120.js");
function a(e) {
  a = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function (e) {
    return typeof e;
  } : function (e) {
    if (e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype) {
      return "symbol";
    } else {
      return typeof e;
    }
  };
  return a(e);
}
var o = require("./326.js");
function l(e, t) {
  if (t && (a(t) === "object" || typeof t === "function")) {
    return t;
  }
  if (t !== undefined) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return (0, o.Z)(e);
}
function i(e) {
  var t = function () {
    if (typeof Reflect === "undefined" || !Reflect.construct) {
      return false;
    }
    if (Reflect.construct.sham) {
      return false;
    }
    if (typeof Proxy === "function") {
      return true;
    }
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }();
  return function () {
    var n;
    var a = (0, r.Z)(e);
    if (t) {
      var o = (0, r.Z)(this).constructor;
      n = Reflect.construct(a, arguments, o);
    } else {
      n = a.apply(this, arguments);
    }
    return l(this, n);
  };
}