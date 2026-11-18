var r;
require.d(exports, {
  AW: function () {
    return U;
  },
  F0: function () {
    return $;
  },
  TH: function () {
    return T;
  },
  WU: function () {
    return R;
  },
  Z5: function () {
    return B;
  },
  oQ: function () {
    return P;
  },
  s0: function () {
    return N;
  }
});
var a = require("./982.js");
var o = require("./671.js");
var i = require("./144.js");
var l = require("./136.js");
var u = require("./104.js");
var c = require("./885.js");
var s = require("./470.js");
var f = require("./791.js");
function d() {
  d = Object.assign ? Object.assign.bind() : function (e) {
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
  return d.apply(this, arguments);
}
var p = typeof Object.is === "function" ? Object.is : function (e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
};
var h = f.useState;
var m = f.useEffect;
var v = f.useLayoutEffect;
var g = f.useDebugValue;
function y(e) {
  var t = e.getSnapshot;
  var n = e.value;
  try {
    var r = t();
    return !p(n, r);
  } catch (a) {
    return true;
  }
}
if (typeof window !== "undefined" && typeof window.document !== "undefined") {
  window.document.createElement;
}
(r ||= require.t(f, 2)).useSyncExternalStore;
var b = f.createContext(null);
var w = f.createContext(null);
var k = f.createContext(null);
var S = f.createContext(null);
var x = f.createContext(null);
var E = f.createContext(null);
var C = f.createContext({
  outlet: null,
  matches: []
});
var _ = f.createContext(null);
function P(e, t) {
  var n = (t === undefined ? {} : t).relative;
  if (!O()) {
    (0, s.kG)(false);
  }
  var r = f.useContext(x);
  var a = r.basename;
  var o = r.navigator;
  var i = R(e, {
    relative: n
  });
  var l = i.hash;
  var u = i.pathname;
  var c = i.search;
  var d = u;
  if (a !== "/") {
    d = u === "/" ? a : (0, s.RQ)([a, u]);
  }
  return o.createHref({
    pathname: d,
    search: c,
    hash: l
  });
}
function O() {
  return f.useContext(E) != null;
}
function T() {
  if (!O()) {
    (0, s.kG)(false);
  }
  return f.useContext(E).location;
}
function z(e) {
  return e.filter(function (t, n) {
    return n === 0 || !t.route.index && t.pathnameBase !== e[n - 1].pathnameBase;
  });
}
function N() {
  if (!O()) {
    (0, s.kG)(false);
  }
  var e = f.useContext(x);
  var t = e.basename;
  var n = e.navigator;
  var r = f.useContext(C).matches;
  var a = T().pathname;
  var o = JSON.stringify(z(r).map(function (e) {
    return e.pathnameBase;
  }));
  var i = f.useRef(false);
  f.useEffect(function () {
    i.current = true;
  });
  return f.useCallback(function (e, r = {}) {
    if (i.current) {
      if (typeof e !== "number") {
        var l = (0, s.pC)(e, JSON.parse(o), a, r.relative === "path");
        if (t !== "/") {
          l.pathname = l.pathname === "/" ? t : (0, s.RQ)([t, l.pathname]);
        }
        (r.replace ? n.replace : n.push)(l, r.state, r);
      } else {
        n.go(e);
      }
    }
  }, [t, n, o, a]);
}
function R(e, t) {
  var n = (t === undefined ? {} : t).relative;
  var r = f.useContext(C).matches;
  var a = T().pathname;
  var o = JSON.stringify(z(r).map(function (e) {
    return e.pathnameBase;
  }));
  return f.useMemo(function () {
    return (0, s.pC)(e, JSON.parse(o), a, n === "path");
  }, [e, o, a, n]);
}
function L() {
  var e = function () {
    var e;
    var t = f.useContext(_);
    var n = F(M.UseRouteError);
    var r = f.useContext(C);
    var a = r.matches[r.matches.length - 1];
    if (t) {
      return t;
    }
    if (!r) {
      (0, s.kG)(false);
    }
    if (!a.route.id) {
      (0, s.kG)(false);
    }
    if ((e = n.errors) == null) {
      return undefined;
    } else {
      return e[a.route.id];
    }
  }();
  var t = (0, s.WK)(e) ? e.status + " " + e.statusText : e instanceof Error ? e.message : JSON.stringify(e);
  var n = e instanceof Error ? e.stack : null;
  var r = "rgba(200,200,200, 0.5)";
  var a = {
    padding: "0.5rem",
    backgroundColor: r
  };
  var o = {
    padding: "2px 4px",
    backgroundColor: r
  };
  return f.createElement(f.Fragment, null, f.createElement("h2", null, "Unhandled Thrown Error!"), f.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, t), n ? f.createElement("pre", {
    style: a
  }, n) : null, f.createElement("p", null, "💿 Hey developer 👋"), f.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own\xA0", f.createElement("code", {
    style: o
  }, "errorElement"), " props on\xA0", f.createElement("code", {
    style: o
  }, "<Route>")));
}
var M;
var j = function (e) {
  (0, l.Z)(n, e);
  var t = (0, u.Z)(n);
  function n(e) {
    var r;
    (0, o.Z)(this, n);
    (r = t.call(this, e)).state = {
      location: e.location,
      error: e.error
    };
    return r;
  }
  (0, i.Z)(n, [{
    key: "componentDidCatch",
    value: function (e, t) {
      console.error("React Router caught the following error during render", e, t);
    }
  }, {
    key: "render",
    value: function () {
      if (this.state.error) {
        return f.createElement(_.Provider, {
          value: this.state.error,
          children: this.props.component
        });
      } else {
        return this.props.children;
      }
    }
  }], [{
    key: "getDerivedStateFromError",
    value: function (e) {
      return {
        error: e
      };
    }
  }, {
    key: "getDerivedStateFromProps",
    value: function (e, t) {
      if (t.location !== e.location) {
        return {
          error: e.error,
          location: e.location
        };
      } else {
        return {
          error: e.error || t.error,
          location: t.location
        };
      }
    }
  }]);
  return n;
}(f.Component);
function A(e) {
  var t = e.routeContext;
  var n = e.match;
  var r = e.children;
  var a = f.useContext(b);
  if (a && n.route.errorElement) {
    a._deepestRenderedBoundaryId = n.route.id;
  }
  return f.createElement(C.Provider, {
    value: t
  }, r);
}
function I(e, t = [], n) {
  if (e == null) {
    if (n == null || !n.errors) {
      return null;
    }
    e = n.matches;
  }
  var r = e;
  var a = n == null ? undefined : n.errors;
  if (a != null) {
    var o = r.findIndex(function (e) {
      return e.route.id && (a == null ? undefined : a[e.route.id]);
    });
    if (!(o >= 0)) {
      (0, s.kG)(false);
    }
    r = r.slice(0, Math.min(r.length, o + 1));
  }
  return r.reduceRight(function (e, o, i) {
    var l = o.route.id ? a == null ? undefined : a[o.route.id] : null;
    var u = n ? o.route.errorElement || f.createElement(L, null) : null;
    function c() {
      return f.createElement(A, {
        match: o,
        routeContext: {
          outlet: e,
          matches: t.concat(r.slice(0, i + 1))
        }
      }, l ? u : o.route.element !== undefined ? o.route.element : e);
    }
    if (n && (o.route.errorElement || i === 0)) {
      return f.createElement(j, {
        location: n.location,
        component: u,
        error: l,
        children: c()
      });
    } else {
      return c();
    }
  }, null);
}
function F(e) {
  var t = f.useContext(k);
  if (!t) {
    (0, s.kG)(false);
  }
  return t;
}
(function (e) {
  e.UseLoaderData = "useLoaderData";
  e.UseActionData = "useActionData";
  e.UseRouteError = "useRouteError";
  e.UseNavigation = "useNavigation";
  e.UseRouteLoaderData = "useRouteLoaderData";
  e.UseMatches = "useMatches";
  e.UseRevalidator = "useRevalidator";
})(M ||= {});
var D;
function U(e) {
  (0, s.kG)(false);
}
function $(e) {
  var t = e.basename;
  var n = t === undefined ? "/" : t;
  var r = e.children;
  var a = r === undefined ? null : r;
  var o = e.location;
  var i = e.navigationType;
  var l = i === undefined ? s.aU.Pop : i;
  var u = e.navigator;
  var c = e.static;
  var d = c !== undefined && c;
  if (O()) {
    (0, s.kG)(false);
  }
  var p = n.replace(/^\/*/, "/");
  var h = f.useMemo(function () {
    return {
      basename: p,
      navigator: u,
      static: d
    };
  }, [p, u, d]);
  if (typeof o === "string") {
    o = (0, s.cP)(o);
  }
  var m = o;
  var v = m.pathname;
  var g = v === undefined ? "/" : v;
  var y = m.search;
  var b = y === undefined ? "" : y;
  var w = m.hash;
  var k = w === undefined ? "" : w;
  var S = m.state;
  var C = S === undefined ? null : S;
  var _ = m.key;
  var P = _ === undefined ? "default" : _;
  var T = f.useMemo(function () {
    var e = (0, s.Zn)(g, p);
    if (e == null) {
      return null;
    } else {
      return {
        pathname: e,
        search: b,
        hash: k,
        state: C,
        key: P
      };
    }
  }, [p, g, b, k, C, P]);
  if (T == null) {
    return null;
  } else {
    return f.createElement(x.Provider, {
      value: h
    }, f.createElement(E.Provider, {
      children: a,
      value: {
        location: T,
        navigationType: l
      }
    }));
  }
}
function B(e) {
  var t = e.children;
  var n = e.location;
  var r = f.useContext(w);
  return function (e, t) {
    if (!O()) {
      (0, s.kG)(false);
    }
    var n;
    var r = f.useContext(k);
    var a = f.useContext(C).matches;
    var o = a[a.length - 1];
    var i = o ? o.params : {};
    if (o) {
      o.pathname;
    }
    var l = o ? o.pathnameBase : "/";
    if (o) {
      o.route;
    }
    var u = T();
    if (t) {
      var c;
      var p = typeof t === "string" ? (0, s.cP)(t) : t;
      if (l !== "/" && !((c = p.pathname) == null ? undefined : c.startsWith(l))) {
        (0, s.kG)(false);
      }
      n = p;
    } else {
      n = u;
    }
    var h = n.pathname || "/";
    var m = l === "/" ? h : h.slice(l.length) || "/";
    var v = (0, s.fp)(e, {
      pathname: m
    });
    var g = I(v && v.map(function (e) {
      return Object.assign({}, e, {
        params: Object.assign({}, i, e.params),
        pathname: (0, s.RQ)([l, e.pathname]),
        pathnameBase: e.pathnameBase === "/" ? l : (0, s.RQ)([l, e.pathnameBase])
      });
    }), a, r || undefined);
    if (t) {
      return f.createElement(E.Provider, {
        value: {
          location: d({
            pathname: "/",
            search: "",
            hash: "",
            state: null,
            key: "default"
          }, n),
          navigationType: s.aU.Pop
        }
      }, g);
    } else {
      return g;
    }
  }(r && !t ? r.router.routes : V(t), n);
}
(function (e) {
  e[e.pending = 0] = "pending";
  e[e.success = 1] = "success";
  e[e.error = 2] = "error";
})(D ||= {});
var W = new Promise(function () {});
f.Component;
function V(e, t = []) {
  var n = [];
  f.Children.forEach(e, function (e, r) {
    if (f.isValidElement(e)) {
      if (e.type !== f.Fragment) {
        if (e.type !== U) {
          (0, s.kG)(false);
        }
        var o = [].concat((0, a.Z)(t), [r]);
        var i = {
          id: e.props.id || o.join("-"),
          caseSensitive: e.props.caseSensitive,
          element: e.props.element,
          index: e.props.index,
          path: e.props.path,
          loader: e.props.loader,
          action: e.props.action,
          errorElement: e.props.errorElement,
          hasErrorBoundary: e.props.errorElement != null,
          shouldRevalidate: e.props.shouldRevalidate,
          handle: e.props.handle
        };
        if (e.props.children) {
          i.children = V(e.props.children, o);
        }
        n.push(i);
      } else {
        n.push.apply(n, V(e.props.children, t));
      }
    }
  });
  return n;
}