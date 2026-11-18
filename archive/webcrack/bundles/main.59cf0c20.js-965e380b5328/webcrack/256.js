require.d(exports, {
  AW: function () {
    return f;
  },
  F0: function () {
    return d;
  },
  TH: function () {
    return m;
  },
  WU: function () {
    return b;
  },
  Z5: function () {
    return p;
  },
  j3: function () {
    return s;
  },
  oQ: function () {
    return h;
  },
  s0: function () {
    return y;
  }
});
var r = require("./885.js");
var a = require("./791.js");
var o = require("./368.js");
function l(e, t) {
  if (!e) {
    throw new Error(t);
  }
}
var i = (0, a.createContext)(null);
var u = (0, a.createContext)(null);
var c = (0, a.createContext)({
  outlet: null,
  matches: []
});
function s(e) {
  return function (e) {
    var t = (0, a.useContext)(c).outlet;
    if (t) {
      return (0, a.createElement)(g.Provider, {
        value: e
      }, t);
    }
    return t;
  }(e.context);
}
function f(e) {
  l(false);
}
function d(e) {
  var t = e.basename;
  var n = t === undefined ? "/" : t;
  var r = e.children;
  var c = r === undefined ? null : r;
  var s = e.location;
  var f = e.navigationType;
  var d = f === undefined ? o.aU.Pop : f;
  var p = e.navigator;
  var h = e.static;
  var m = h !== undefined && h;
  if (v()) {
    l(false);
  }
  var y = j(n);
  var g = (0, a.useMemo)(function () {
    return {
      basename: y,
      navigator: p,
      static: m
    };
  }, [y, p, m]);
  if (typeof s === "string") {
    s = (0, o.cP)(s);
  }
  var b = s;
  var w = b.pathname;
  var k = w === undefined ? "/" : w;
  var x = b.search;
  var C = x === undefined ? "" : x;
  var S = b.hash;
  var E = S === undefined ? "" : S;
  var z = b.state;
  var L = z === undefined ? null : z;
  var _ = b.key;
  var N = _ === undefined ? "default" : _;
  var O = (0, a.useMemo)(function () {
    var e = P(k, y);
    if (e == null) {
      return null;
    } else {
      return {
        pathname: e,
        search: C,
        hash: E,
        state: L,
        key: N
      };
    }
  }, [y, k, C, E, L, N]);
  if (O == null) {
    return null;
  } else {
    return (0, a.createElement)(i.Provider, {
      value: g
    }, (0, a.createElement)(u.Provider, {
      children: c,
      value: {
        location: O,
        navigationType: d
      }
    }));
  }
}
function p(e) {
  var t = e.children;
  var n = e.location;
  return function (e, t) {
    if (!v()) {
      l(false);
    }
    var n = (0, a.useContext)(c).matches;
    var r = n[n.length - 1];
    var i = r ? r.params : {};
    if (r) {
      r.pathname;
    }
    var u = r ? r.pathnameBase : "/";
    if (r) {
      r.route;
    }
    0;
    var s;
    var f = m();
    if (t) {
      var d;
      var p = typeof t === "string" ? (0, o.cP)(t) : t;
      if (u !== "/" && !((d = p.pathname) == null ? undefined : d.startsWith(u))) {
        l(false);
      }
      s = p;
    } else {
      s = f;
    }
    var h = s.pathname || "/";
    var y = u === "/" ? h : h.slice(u.length) || "/";
    var g = function (e, t, n = "/") {
      var r = P((typeof t === "string" ? (0, o.cP)(t) : t).pathname || "/", n);
      if (r == null) {
        return null;
      }
      var a = k(e);
      (function (e) {
        e.sort(function (e, t) {
          if (e.score !== t.score) {
            return t.score - e.score;
          } else {
            return function (e, t) {
              var n = e.length === t.length && e.slice(0, -1).every(function (e, n) {
                return e === t[n];
              });
              if (n) {
                return e[e.length - 1] - t[t.length - 1];
              } else {
                return 0;
              }
            }(e.routesMeta.map(function (e) {
              return e.childrenIndex;
            }), t.routesMeta.map(function (e) {
              return e.childrenIndex;
            }));
          }
        });
      })(a);
      for (var l = null, i = 0; l == null && i < a.length; ++i) {
        l = E(a[i], r);
      }
      return l;
    }(e, {
      pathname: y
    });
    0;
    return z(g && g.map(function (e) {
      return Object.assign({}, e, {
        params: Object.assign({}, i, e.params),
        pathname: N([u, e.pathname]),
        pathnameBase: e.pathnameBase === "/" ? u : N([u, e.pathnameBase])
      });
    }), n);
  }(w(t), n);
}
function h(e) {
  if (!v()) {
    l(false);
  }
  var t = (0, a.useContext)(i);
  var n = t.basename;
  var r = t.navigator;
  var u = b(e);
  var c = u.hash;
  var s = u.pathname;
  var f = u.search;
  var d = s;
  if (n !== "/") {
    var p = function (e) {
      if (e === "" || e.pathname === "") {
        return "/";
      } else if (typeof e === "string") {
        return (0, o.cP)(e).pathname;
      } else {
        return e.pathname;
      }
    }(e);
    var h = p != null && p.endsWith("/");
    d = s === "/" ? n + (h ? "/" : "") : N([n, s]);
  }
  return r.createHref({
    pathname: d,
    search: f,
    hash: c
  });
}
function v() {
  return (0, a.useContext)(u) != null;
}
function m() {
  if (!v()) {
    l(false);
  }
  return (0, a.useContext)(u).location;
}
function y() {
  if (!v()) {
    l(false);
  }
  var e = (0, a.useContext)(i);
  var t = e.basename;
  var n = e.navigator;
  var r = (0, a.useContext)(c).matches;
  var o = m().pathname;
  var u = JSON.stringify(r.map(function (e) {
    return e.pathnameBase;
  }));
  var s = (0, a.useRef)(false);
  (0, a.useEffect)(function () {
    s.current = true;
  });
  return (0, a.useCallback)(function (e, r = {}) {
    if (s.current) {
      if (typeof e !== "number") {
        var a = _(e, JSON.parse(u), o);
        if (t !== "/") {
          a.pathname = N([t, a.pathname]);
        }
        (r.replace ? n.replace : n.push)(a, r.state);
      } else {
        n.go(e);
      }
    }
  }, [t, n, u, o]);
}
var g = (0, a.createContext)(null);
function b(e) {
  var t = (0, a.useContext)(c).matches;
  var n = m().pathname;
  var r = JSON.stringify(t.map(function (e) {
    return e.pathnameBase;
  }));
  return (0, a.useMemo)(function () {
    return _(e, JSON.parse(r), n);
  }, [e, r, n]);
}
function w(e) {
  var t = [];
  a.Children.forEach(e, function (e) {
    if ((0, a.isValidElement)(e)) {
      if (e.type !== a.Fragment) {
        if (e.type !== f) {
          l(false);
        }
        var n = {
          caseSensitive: e.props.caseSensitive,
          element: e.props.element,
          index: e.props.index,
          path: e.props.path
        };
        if (e.props.children) {
          n.children = w(e.props.children);
        }
        t.push(n);
      } else {
        t.push.apply(t, w(e.props.children));
      }
    }
  });
  return t;
}
function k(e, t = [], n = [], r = "") {
  e.forEach(function (e, a) {
    var o = {
      relativePath: e.path || "",
      caseSensitive: e.caseSensitive === true,
      childrenIndex: a,
      route: e
    };
    if (o.relativePath.startsWith("/")) {
      if (!o.relativePath.startsWith(r)) {
        l(false);
      }
      o.relativePath = o.relativePath.slice(r.length);
    }
    var i = N([r, o.relativePath]);
    var u = n.concat(o);
    if (e.children && e.children.length > 0) {
      if (e.index === true) {
        l(false);
      }
      k(e.children, t, u, i);
    }
    if (e.path != null || e.index) {
      t.push({
        path: i,
        score: S(i, e.index),
        routesMeta: u
      });
    }
  });
  return t;
}
var x = /^:\w+$/;
function C(e) {
  return e === "*";
}
function S(e, t) {
  var n = e.split("/");
  var r = n.length;
  if (n.some(C)) {
    r += -2;
  }
  if (t) {
    r += 2;
  }
  return n.filter(function (e) {
    return !C(e);
  }).reduce(function (e, t) {
    return e + (x.test(t) ? 3 : t === "" ? 1 : 10);
  }, r);
}
function E(e, t) {
  for (var n = e.routesMeta, r = {}, a = "/", o = [], l = 0; l < n.length; ++l) {
    var i = n[l];
    var u = l === n.length - 1;
    var c = a === "/" ? t : t.slice(a.length) || "/";
    var s = L({
      path: i.relativePath,
      caseSensitive: i.caseSensitive,
      end: u
    }, c);
    if (!s) {
      return null;
    }
    Object.assign(r, s.params);
    var f = i.route;
    o.push({
      params: r,
      pathname: N([a, s.pathname]),
      pathnameBase: j(N([a, s.pathnameBase])),
      route: f
    });
    if (s.pathnameBase !== "/") {
      a = N([a, s.pathnameBase]);
    }
  }
  return o;
}
function z(e, t = []) {
  if (e == null) {
    return null;
  } else {
    return e.reduceRight(function (n, r, o) {
      return (0, a.createElement)(c.Provider, {
        children: r.route.element !== undefined ? r.route.element : n,
        value: {
          outlet: n,
          matches: t.concat(e.slice(0, o + 1))
        }
      });
    }, null);
  }
}
function L(e, t) {
  if (typeof e === "string") {
    e = {
      path: e,
      caseSensitive: false,
      end: true
    };
  }
  var n = function (e, t = false, n = true) {
    var r = [];
    var a = "^" + e.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^$?{}|()[\]]/g, "\\$&").replace(/:(\w+)/g, function (e, t) {
      r.push(t);
      return "([^\\/]+)";
    });
    if (e.endsWith("*")) {
      r.push("*");
      a += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
    } else {
      a += n ? "\\/*$" : "(?:(?=[.~-]|%[0-9A-F]{2})|\\b|\\/|$)";
    }
    return [new RegExp(a, t ? undefined : "i"), r];
  }(e.path, e.caseSensitive, e.end);
  var a = (0, r.Z)(n, 2);
  var o = a[0];
  var l = a[1];
  var i = t.match(o);
  if (!i) {
    return null;
  }
  var u = i[0];
  var c = u.replace(/(.)\/+$/, "$1");
  var s = i.slice(1);
  return {
    params: l.reduce(function (e, t, n) {
      if (t === "*") {
        var r = s[n] || "";
        c = u.slice(0, u.length - r.length).replace(/(.)\/+$/, "$1");
      }
      e[t] = function (e, t) {
        try {
          return decodeURIComponent(e);
        } catch (n) {
          return e;
        }
      }(s[n] || "");
      return e;
    }, {}),
    pathname: u,
    pathnameBase: c,
    pattern: e
  };
}
function _(e, t, n) {
  var r;
  var a = typeof e === "string" ? (0, o.cP)(e) : e;
  var l = e === "" || a.pathname === "" ? "/" : a.pathname;
  if (l == null) {
    r = n;
  } else {
    var i = t.length - 1;
    if (l.startsWith("..")) {
      for (var u = l.split("/"); u[0] === "..";) {
        u.shift();
        i -= 1;
      }
      a.pathname = u.join("/");
    }
    r = i >= 0 ? t[i] : "/";
  }
  var c = function (e, t = "/") {
    var n = typeof e === "string" ? (0, o.cP)(e) : e;
    var r = n.pathname;
    var a = n.search;
    var l = a === undefined ? "" : a;
    var i = n.hash;
    var u = i === undefined ? "" : i;
    var c = r ? r.startsWith("/") ? r : function (e, t) {
      var n = t.replace(/\/+$/, "").split("/");
      e.split("/").forEach(function (e) {
        if (e === "..") {
          if (n.length > 1) {
            n.pop();
          }
        } else if (e !== ".") {
          n.push(e);
        }
      });
      if (n.length > 1) {
        return n.join("/");
      } else {
        return "/";
      }
    }(r, t) : t;
    return {
      pathname: c,
      search: O(l),
      hash: T(u)
    };
  }(a, r);
  if (l && l !== "/" && l.endsWith("/") && !c.pathname.endsWith("/")) {
    c.pathname += "/";
  }
  return c;
}
function P(e, t) {
  if (t === "/") {
    return e;
  }
  if (!e.toLowerCase().startsWith(t.toLowerCase())) {
    return null;
  }
  var n = e.charAt(t.length);
  if (n && n !== "/") {
    return null;
  } else {
    return e.slice(t.length) || "/";
  }
}
function N(e) {
  return e.join("/").replace(/\/\/+/g, "/");
}
function j(e) {
  return e.replace(/\/+$/, "").replace(/^\/*/, "/");
}
function O(e) {
  if (e && e !== "?") {
    if (e.startsWith("?")) {
      return e;
    } else {
      return "?" + e;
    }
  } else {
    return "";
  }
}
function T(e) {
  if (e && e !== "#") {
    if (e.startsWith("#")) {
      return e;
    } else {
      return "#" + e;
    }
  } else {
    return "";
  }
}