var r = require("./451.js");
function a() {
  var e = 4022871197;
  return function (t) {
    if (t) {
      t = t.toString();
      for (var n = 0; n < t.length; n++) {
        var r = (e += t.charCodeAt(n)) * 0.02519603282416938;
        r -= e = r >>> 0;
        e = (r *= e) >>> 0;
        e += (r -= e) * 4294967296;
      }
      return (e >>> 0) * 2.3283064365386963e-10;
    }
    e = 4022871197;
  };
}
function o(e) {
  return function () {
    var t;
    var n;
    var o = 48;
    var l = 1;
    var i = o;
    var u = new Array(o);
    var c = 0;
    var s = new a();
    for (t = 0; t < o; t++) {
      u[t] = s(Math.random());
    }
    function f() {
      if (++i >= o) {
        i = 0;
      }
      var e = u[i] * 1768863 + l * 2.3283064365386963e-10;
      return u[i] = e - (l = e | 0);
    }
    function d(e) {
      return Math.floor(e * (f() + (f() * 2097152 | 0) * 1.1102230246251565e-16));
    }
    d.string = function (e) {
      var t;
      var n = "";
      for (t = 0; t < e; t++) {
        n += String.fromCharCode(33 + d(94));
      }
      return n;
    };
    function p() {
      var e = Array.prototype.slice.call(arguments);
      for (t = 0; t < e.length; t++) {
        for (n = 0; n < o; n++) {
          u[n] -= s(e[t]);
          if (u[n] < 0) {
            u[n] += 1;
          }
        }
      }
    }
    d.cleanString = function (e) {
      return e = (e = (e = e.replace(/(^\s*)|(\s*$)/gi, "")).replace(/[\x00-\x1F]/gi, "")).replace(/\n /, "\n");
    };
    d.hashString = function (e) {
      e = d.cleanString(e);
      s(e);
      t = 0;
      for (; t < e.length; t++) {
        c = e.charCodeAt(t);
        n = 0;
        for (; n < o; n++) {
          u[n] -= s(c);
          if (u[n] < 0) {
            u[n] += 1;
          }
        }
      }
    };
    d.seed = function (e) {
      if (typeof e === "undefined" || e === null) {
        e = Math.random();
      }
      if (typeof e !== "string") {
        e = r(e, function (e, t) {
          if (typeof t === "function") {
            return t.toString();
          } else {
            return t;
          }
        });
      }
      d.initState();
      d.hashString(e);
    };
    d.addEntropy = function () {
      var e = [];
      for (t = 0; t < arguments.length; t++) {
        e.push(arguments[t]);
      }
      p(c++ + new Date().getTime() + e.join("") + Math.random());
    };
    d.initState = function () {
      s();
      t = 0;
      for (; t < o; t++) {
        u[t] = s(" ");
      }
      l = 1;
      i = o;
    };
    d.done = function () {
      s = null;
    };
    if (typeof e !== "undefined") {
      d.seed(e);
    }
    d.range = function (e) {
      return d(e);
    };
    d.random = function () {
      return d(Number.MAX_VALUE - 1) / Number.MAX_VALUE;
    };
    d.floatBetween = function (e, t) {
      return d.random() * (t - e) + e;
    };
    d.intBetween = function (e, t) {
      return Math.floor(d.random() * (t - e + 1)) + e;
    };
    return d;
  }();
}
o.create = function (e) {
  return new o(e);
};
module.exports = o;