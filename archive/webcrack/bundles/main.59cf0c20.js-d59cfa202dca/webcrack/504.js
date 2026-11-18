require.d(exports, {
  VK: function () {
    return s;
  },
  rU: function () {
    return f;
  }
});
var r = require("./885.js");
var a = require("./791.js");
var o = require("./368.js");
var l = require("./256.js");
function i() {
  i = Object.assign || function (e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n) {
        if (Object.prototype.hasOwnProperty.call(n, r)) {
          e[r] = n[r];
        }
      }
    }
    return e;
  };
  return i.apply(this, arguments);
}
function u(e, t) {
  if (e == null) {
    return {};
  }
  var n;
  var r;
  var a = {};
  var o = Object.keys(e);
  for (r = 0; r < o.length; r++) {
    n = o[r];
    if (!(t.indexOf(n) >= 0)) {
      a[n] = e[n];
    }
  }
  return a;
}
var c = ["onClick", "reloadDocument", "replace", "state", "target", "to"];
function s(e) {
  var t = e.basename;
  var n = e.children;
  var i = e.window;
  var u = (0, a.useRef)();
  if (u.current == null) {
    u.current = (0, o.lX)({
      window: i
    });
  }
  var c = u.current;
  var s = (0, a.useState)({
    action: c.action,
    location: c.location
  });
  var f = (0, r.Z)(s, 2);
  var d = f[0];
  var p = f[1];
  (0, a.useLayoutEffect)(function () {
    return c.listen(p);
  }, [c]);
  return (0, a.createElement)(l.F0, {
    basename: t,
    children: n,
    location: d.location,
    navigationType: d.action,
    navigator: c
  });
}
var f = (0, a.forwardRef)(function (e, t) {
  var n = e.onClick;
  var r = e.reloadDocument;
  var s = e.replace;
  var f = s !== undefined && s;
  var d = e.state;
  var p = e.target;
  var h = e.to;
  var v = u(e, c);
  var m = (0, l.oQ)(h);
  var y = function (e, t) {
    var n = t === undefined ? {} : t;
    var r = n.target;
    var i = n.replace;
    var u = n.state;
    var c = (0, l.s0)();
    var s = (0, l.TH)();
    var f = (0, l.WU)(e);
    return (0, a.useCallback)(function (t) {
      if (t.button === 0 && (!r || r === "_self") && !function (e) {
        return !!e.metaKey || !!e.altKey || !!e.ctrlKey || !!e.shiftKey;
      }(t)) {
        t.preventDefault();
        var n = !!i || (0, o.Ep)(s) === (0, o.Ep)(f);
        c(e, {
          replace: n,
          state: u
        });
      }
    }, [s, c, f, i, u, r, e]);
  }(h, {
    replace: f,
    state: d,
    target: p
  });
  return (0, a.createElement)("a", i({}, v, {
    href: m,
    onClick: function (e) {
      if (n) {
        n(e);
      }
      if (!e.defaultPrevented && !r) {
        y(e);
      }
    },
    ref: t,
    target: p
  }));
});