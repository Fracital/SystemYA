require.d(exports, {
  Z: function () {
    return a;
  }
});
var r = require("./181.js");
function a(e, t) {
  return function (e) {
    if (Array.isArray(e)) {
      return e;
    }
  }(e) || function (e, t) {
    var n = e == null ? null : typeof Symbol !== "undefined" && e[Symbol.iterator] || e["@@iterator"];
    if (n != null) {
      var r;
      var a;
      var o = [];
      var i = true;
      var l = false;
      try {
        for (n = n.call(e); !(i = (r = n.next()).done) && (o.push(r.value), !t || o.length !== t); i = true);
      } catch (u) {
        l = true;
        a = u;
      } finally {
        try {
          if (!i && n.return != null) {
            n.return();
          }
        } finally {
          if (l) {
            throw a;
          }
        }
      }
      return o;
    }
  }(e, t) || (0, r.Z)(e, t) || function () {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }();
}