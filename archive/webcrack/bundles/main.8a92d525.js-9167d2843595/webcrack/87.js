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
var o = require("./689.js");
var i = require("./470.js");
function l() {
  l = Object.assign ? Object.assign.bind() : function (e) {
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
  return l.apply(this, arguments);
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
var c = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset"];
function s(e) {
  var t = e.basename;
  var n = e.children;
  var l = e.window;
  var u = a.useRef();
  if (u.current == null) {
    u.current = (0, i.lX)({
      window: l,
      v5Compat: true
    });
  }
  var c = u.current;
  var s = a.useState({
    action: c.action,
    location: c.location
  });
  var f = (0, r.Z)(s, 2);
  var d = f[0];
  var p = f[1];
  a.useLayoutEffect(function () {
    return c.listen(p);
  }, [c]);
  return a.createElement(o.F0, {
    basename: t,
    children: n,
    location: d.location,
    navigationType: d.action,
    navigator: c
  });
}
var f = a.forwardRef(function (e, t) {
  var n = e.onClick;
  var r = e.relative;
  var s = e.reloadDocument;
  var f = e.replace;
  var d = e.state;
  var p = e.target;
  var h = e.to;
  var m = e.preventScrollReset;
  var v = u(e, c);
  var g = (0, o.oQ)(h, {
    relative: r
  });
  var y = function (e, t) {
    var n = t === undefined ? {} : t;
    var r = n.target;
    var l = n.replace;
    var u = n.state;
    var c = n.preventScrollReset;
    var s = n.relative;
    var f = (0, o.s0)();
    var d = (0, o.TH)();
    var p = (0, o.WU)(e, {
      relative: s
    });
    return a.useCallback(function (t) {
      if (function (e, t) {
        return e.button === 0 && (!t || t === "_self") && !function (e) {
          return !!e.metaKey || !!e.altKey || !!e.ctrlKey || !!e.shiftKey;
        }(e);
      }(t, r)) {
        t.preventDefault();
        var n = l !== undefined ? l : (0, i.Ep)(d) === (0, i.Ep)(p);
        f(e, {
          replace: n,
          state: u,
          preventScrollReset: c,
          relative: s
        });
      }
    }, [d, f, p, l, u, r, e, c, s]);
  }(h, {
    replace: f,
    state: d,
    target: p,
    preventScrollReset: m,
    relative: r
  });
  return a.createElement("a", l({}, v, {
    href: g,
    onClick: s ? n : function (e) {
      if (n) {
        n(e);
      }
      if (!e.defaultPrevented) {
        y(e);
      }
    },
    ref: t,
    target: p
  }));
});