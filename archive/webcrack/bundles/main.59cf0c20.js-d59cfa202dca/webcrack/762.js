require.d(exports, {
  Z: function () {
    return a;
  }
});
var r = require("./181.js");
function a(e, t) {
  var n = typeof Symbol !== "undefined" && e[Symbol.iterator] || e["@@iterator"];
  if (!n) {
    if (Array.isArray(e) || (n = (0, r.Z)(e)) || t && e && typeof e.length === "number") {
      if (n) {
        e = n;
      }
      var a = 0;
      function o() {}
      return {
        s: o,
        n: function () {
          if (a >= e.length) {
            return {
              done: true
            };
          } else {
            return {
              done: false,
              value: e[a++]
            };
          }
        },
        e: function (e) {
          throw e;
        },
        f: o
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var l;
  var i = true;
  var u = false;
  return {
    s: function () {
      n = n.call(e);
    },
    n: function () {
      var e = n.next();
      i = e.done;
      return e;
    },
    e: function (e) {
      u = true;
      l = e;
    },
    f: function () {
      try {
        if (!i && n.return != null) {
          n.return();
        }
      } finally {
        if (u) {
          throw l;
        }
      }
    }
  };
}