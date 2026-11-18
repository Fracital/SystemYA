var t = Object.getOwnPropertySymbols;
var n = Object.prototype.hasOwnProperty;
var r = Object.prototype.propertyIsEnumerable;
function a(e) {
  if (e === null || e === undefined) {
    throw new TypeError("Object.assign cannot be called with null or undefined");
  }
  return Object(e);
}
module.exports = function () {
  try {
    if (!Object.assign) {
      return false;
    }
    var e = new String("abc");
    e[5] = "de";
    if (Object.getOwnPropertyNames(e)[0] === "5") {
      return false;
    }
    var t = {};
    for (var n = 0; n < 10; n++) {
      t["_" + String.fromCharCode(n)] = n;
    }
    if (Object.getOwnPropertyNames(t).map(function (e) {
      return t[e];
    }).join("") !== "0123456789") {
      return false;
    }
    var r = {};
    "abcdefghijklmnopqrst".split("").forEach(function (e) {
      r[e] = e;
    });
    return Object.keys(Object.assign({}, r)).join("") === "abcdefghijklmnopqrst";
  } catch (a) {
    return false;
  }
}() ? Object.assign : function (e, o) {
  var l;
  var i;
  var u = a(e);
  for (var c = 1; c < arguments.length; c++) {
    for (var s in l = Object(arguments[c])) {
      if (n.call(l, s)) {
        u[s] = l[s];
      }
    }
    if (t) {
      i = t(l);
      for (var f = 0; f < i.length; f++) {
        if (r.call(l, i[f])) {
          u[i[f]] = l[i[f]];
        }
      }
    }
  }
  return u;
};