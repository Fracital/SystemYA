function r() {
  r = Object.assign || function (e) {
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
  return r.apply(this, arguments);
}
var a;
require.d(exports, {
  aU: function () {
    return a;
  },
  lX: function () {
    return u;
  },
  Ep: function () {
    return d;
  },
  cP: function () {
    return p;
  }
});
(function (e) {
  e.Pop = "POP";
  e.Push = "PUSH";
  e.Replace = "REPLACE";
})(a ||= {});
function o(e) {
  return e;
}
var l = "beforeunload";
var i = "popstate";
function u(e = {}) {
  var t = e.window;
  var n = t === undefined ? document.defaultView : t;
  var u = n.history;
  function h() {
    var e = n.location;
    var t = e.pathname;
    var r = e.search;
    var a = e.hash;
    var l = u.state || {};
    return [l.idx, o({
      pathname: t,
      search: r,
      hash: a,
      state: l.usr || null,
      key: l.key || "default"
    })];
  }
  var v = null;
  n.addEventListener(i, function () {
    if (v) {
      k.call(v);
      v = null;
    } else {
      var e = a.Pop;
      var t = h();
      var n = t[0];
      var r = t[1];
      if (k.length) {
        if (n != null) {
          var o = g - n;
          if (o) {
            v = {
              action: e,
              location: r,
              retry: function () {
                L(o * -1);
              }
            };
            L(o);
          }
        }
      } else {
        z(e);
      }
    }
  });
  var m = a.Pop;
  var y = h();
  var g = y[0];
  var b = y[1];
  var w = s();
  var k = s();
  function x(e) {
    if (typeof e === "string") {
      return e;
    } else {
      return d(e);
    }
  }
  function C(e, t = null) {
    return o(r({
      pathname: b.pathname,
      hash: "",
      search: ""
    }, typeof e === "string" ? p(e) : e, {
      state: t,
      key: f()
    }));
  }
  function S(e, t) {
    return [{
      usr: e.state,
      key: e.key,
      idx: t
    }, x(e)];
  }
  function E(e, t, n) {
    return !k.length || (k.call({
      action: e,
      location: t,
      retry: n
    }), false);
  }
  function z(e) {
    m = e;
    var t = h();
    g = t[0];
    b = t[1];
    w.call({
      action: m,
      location: b
    });
  }
  function L(e) {
    u.go(e);
  }
  if (g == null) {
    g = 0;
    u.replaceState(r({}, u.state, {
      idx: g
    }), "");
  }
  var _ = {
    get action() {
      return m;
    },
    get location() {
      return b;
    },
    createHref: x,
    push: function e(t, r) {
      var o = a.Push;
      var l = C(t, r);
      if (E(o, l, function () {
        e(t, r);
      })) {
        var i = S(l, g + 1);
        var c = i[0];
        var s = i[1];
        try {
          u.pushState(c, "", s);
        } catch (f) {
          n.location.assign(s);
        }
        z(o);
      }
    },
    replace: function e(t, n) {
      var r = a.Replace;
      var o = C(t, n);
      if (E(r, o, function () {
        e(t, n);
      })) {
        var l = S(o, g);
        var i = l[0];
        var c = l[1];
        u.replaceState(i, "", c);
        z(r);
      }
    },
    go: L,
    back: function () {
      L(-1);
    },
    forward: function () {
      L(1);
    },
    listen: function (e) {
      return w.push(e);
    },
    block: function (e) {
      var t = k.push(e);
      if (k.length === 1) {
        n.addEventListener(l, c);
      }
      return function () {
        t();
        if (!k.length) {
          n.removeEventListener(l, c);
        }
      };
    }
  };
  return _;
}
function c(e) {
  e.preventDefault();
  e.returnValue = "";
}
function s() {
  var e = [];
  return {
    get length() {
      return e.length;
    },
    push: function (t) {
      e.push(t);
      return function () {
        e = e.filter(function (e) {
          return e !== t;
        });
      };
    },
    call: function (t) {
      e.forEach(function (e) {
        return e && e(t);
      });
    }
  };
}
function f() {
  return Math.random().toString(36).substr(2, 8);
}
function d(e) {
  var t = e.pathname;
  var n = t === undefined ? "/" : t;
  var r = e.search;
  var a = r === undefined ? "" : r;
  var o = e.hash;
  var l = o === undefined ? "" : o;
  if (a && a !== "?") {
    n += a.charAt(0) === "?" ? a : "?" + a;
  }
  if (l && l !== "#") {
    n += l.charAt(0) === "#" ? l : "#" + l;
  }
  return n;
}
function p(e) {
  var t = {};
  if (e) {
    var n = e.indexOf("#");
    if (n >= 0) {
      t.hash = e.substr(n);
      e = e.substr(0, n);
    }
    var r = e.indexOf("?");
    if (r >= 0) {
      t.search = e.substr(r);
      e = e.substr(0, r);
    }
    if (e) {
      t.pathname = e;
    }
  }
  return t;
}