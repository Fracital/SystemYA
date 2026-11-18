var r = require("./725.js");
var a = 60103;
var o = 60106;
exports.Fragment = 60107;
exports.StrictMode = 60108;
exports.Profiler = 60114;
var l = 60109;
var i = 60110;
var u = 60112;
exports.Suspense = 60113;
var c = 60115;
var s = 60116;
if (typeof Symbol === "function" && Symbol.for) {
  var f = Symbol.for;
  a = f("react.element");
  o = f("react.portal");
  exports.Fragment = f("react.fragment");
  exports.StrictMode = f("react.strict_mode");
  exports.Profiler = f("react.profiler");
  l = f("react.provider");
  i = f("react.context");
  u = f("react.forward_ref");
  exports.Suspense = f("react.suspense");
  c = f("react.memo");
  s = f("react.lazy");
}
var d = typeof Symbol === "function" && Symbol.iterator;
function p(e) {
  var t = "https://web.archive.org/web/20220526154012/https://reactjs.org/docs/error-decoder.html?invariant=" + e;
  for (var n = 1; n < arguments.length; n++) {
    t += "&args[]=" + encodeURIComponent(arguments[n]);
  }
  return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var h = {
  isMounted: function () {
    return false;
  },
  enqueueForceUpdate: function () {},
  enqueueReplaceState: function () {},
  enqueueSetState: function () {}
};
var v = {};
function m(e, t, n) {
  this.props = e;
  this.context = t;
  this.refs = v;
  this.updater = n || h;
}
function y() {}
function g(e, t, n) {
  this.props = e;
  this.context = t;
  this.refs = v;
  this.updater = n || h;
}
m.prototype.isReactComponent = {};
m.prototype.setState = function (e, t) {
  if (typeof e !== "object" && typeof e !== "function" && e != null) {
    throw Error(p(85));
  }
  this.updater.enqueueSetState(this, e, t, "setState");
};
m.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
y.prototype = m.prototype;
var b = g.prototype = new y();
b.constructor = g;
r(b, m.prototype);
b.isPureReactComponent = true;
var w = {
  current: null
};
var k = Object.prototype.hasOwnProperty;
var x = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
function C(e, t, n) {
  var r;
  var o = {};
  var l = null;
  var i = null;
  if (t != null) {
    if (t.ref !== undefined) {
      i = t.ref;
    }
    if (t.key !== undefined) {
      l = "" + t.key;
    }
    for (r in t) {
      if (k.call(t, r) && !x.hasOwnProperty(r)) {
        o[r] = t[r];
      }
    }
  }
  var u = arguments.length - 2;
  if (u === 1) {
    o.children = n;
  } else if (u > 1) {
    var c = Array(u);
    for (var s = 0; s < u; s++) {
      c[s] = arguments[s + 2];
    }
    o.children = c;
  }
  if (e && e.defaultProps) {
    for (r in u = e.defaultProps) {
      if (o[r] === undefined) {
        o[r] = u[r];
      }
    }
  }
  return {
    $$typeof: a,
    type: e,
    key: l,
    ref: i,
    props: o,
    _owner: w.current
  };
}
function S(e) {
  return typeof e === "object" && e !== null && e.$$typeof === a;
}
var E = /\/+/g;
function z(e, t) {
  if (typeof e === "object" && e !== null && e.key != null) {
    return function (e) {
      var t = {
        "=": "=0",
        ":": "=2"
      };
      return "$" + e.replace(/[=:]/g, function (e) {
        return t[e];
      });
    }("" + e.key);
  } else {
    return t.toString(36);
  }
}
function L(e, t, n, r, l) {
  var i = typeof e;
  if (i === "undefined" || i === "boolean") {
    e = null;
  }
  var u = false;
  if (e === null) {
    u = true;
  } else {
    switch (i) {
      case "string":
      case "number":
        u = true;
        break;
      case "object":
        switch (e.$$typeof) {
          case a:
          case o:
            u = true;
        }
    }
  }
  if (u) {
    l = l(u = e);
    e = r === "" ? "." + z(u, 0) : r;
    if (Array.isArray(l)) {
      n = "";
      if (e != null) {
        n = e.replace(E, "$&/") + "/";
      }
      L(l, t, n, "", function (e) {
        return e;
      });
    } else if (l != null) {
      if (S(l)) {
        l = function (e, t) {
          return {
            $$typeof: a,
            type: e.type,
            key: t,
            ref: e.ref,
            props: e.props,
            _owner: e._owner
          };
        }(l, n + (!l.key || u && u.key === l.key ? "" : ("" + l.key).replace(E, "$&/") + "/") + e);
      }
      t.push(l);
    }
    return 1;
  }
  u = 0;
  r = r === "" ? "." : r + ":";
  if (Array.isArray(e)) {
    for (var c = 0; c < e.length; c++) {
      var s = r + z(i = e[c], c);
      u += L(i, t, n, s, l);
    }
  } else {
    s = function (e) {
      if (e === null || typeof e !== "object") {
        return null;
      } else if (typeof (e = d && e[d] || e["@@iterator"]) === "function") {
        return e;
      } else {
        return null;
      }
    }(e);
    if (typeof s === "function") {
      e = s.call(e);
      c = 0;
      while (!(i = e.next()).done) {
        u += L(i = i.value, t, n, s = r + z(i, c++), l);
      }
    } else if (i === "object") {
      t = "" + e;
      throw Error(p(31, t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t));
    }
  }
  return u;
}
function _(e, t, n) {
  if (e == null) {
    return e;
  }
  var r = [];
  var a = 0;
  L(e, r, "", "", function (e) {
    return t.call(n, e, a++);
  });
  return r;
}
function P(e) {
  if (e._status === -1) {
    var t = e._result;
    t = t();
    e._status = 0;
    e._result = t;
    t.then(function (t) {
      if (e._status === 0) {
        t = t.default;
        e._status = 1;
        e._result = t;
      }
    }, function (t) {
      if (e._status === 0) {
        e._status = 2;
        e._result = t;
      }
    });
  }
  if (e._status === 1) {
    return e._result;
  }
  throw e._result;
}
var N = {
  current: null
};
function j() {
  var e = N.current;
  if (e === null) {
    throw Error(p(321));
  }
  return e;
}
var O = {
  ReactCurrentDispatcher: N,
  ReactCurrentBatchConfig: {
    transition: 0
  },
  ReactCurrentOwner: w,
  IsSomeRendererActing: {
    current: false
  },
  assign: r
};
exports.Children = {
  map: _,
  forEach: function (e, t, n) {
    _(e, function () {
      t.apply(this, arguments);
    }, n);
  },
  count: function (e) {
    var t = 0;
    _(e, function () {
      t++;
    });
    return t;
  },
  toArray: function (e) {
    return _(e, function (e) {
      return e;
    }) || [];
  },
  only: function (e) {
    if (!S(e)) {
      throw Error(p(143));
    }
    return e;
  }
};
exports.Component = m;
exports.PureComponent = g;
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = O;
exports.cloneElement = function (e, t, n) {
  if (e === null || e === undefined) {
    throw Error(p(267, e));
  }
  var o = r({}, e.props);
  var l = e.key;
  var i = e.ref;
  var u = e._owner;
  if (t != null) {
    if (t.ref !== undefined) {
      i = t.ref;
      u = w.current;
    }
    if (t.key !== undefined) {
      l = "" + t.key;
    }
    if (e.type && e.type.defaultProps) {
      var c = e.type.defaultProps;
    }
    for (s in t) {
      if (k.call(t, s) && !x.hasOwnProperty(s)) {
        o[s] = t[s] === undefined && c !== undefined ? c[s] : t[s];
      }
    }
  }
  var s = arguments.length - 2;
  if (s === 1) {
    o.children = n;
  } else if (s > 1) {
    c = Array(s);
    for (var f = 0; f < s; f++) {
      c[f] = arguments[f + 2];
    }
    o.children = c;
  }
  return {
    $$typeof: a,
    type: e.type,
    key: l,
    ref: i,
    props: o,
    _owner: u
  };
};
exports.createContext = function (e, t = null) {
  (e = {
    $$typeof: i,
    _calculateChangedBits: t,
    _currentValue: e,
    _currentValue2: e,
    _threadCount: 0,
    Provider: null,
    Consumer: null
  }).Provider = {
    $$typeof: l,
    _context: e
  };
  return e.Consumer = e;
};
exports.createElement = C;
exports.createFactory = function (e) {
  var t = C.bind(null, e);
  t.type = e;
  return t;
};
exports.createRef = function () {
  return {
    current: null
  };
};
exports.forwardRef = function (e) {
  return {
    $$typeof: u,
    render: e
  };
};
exports.isValidElement = S;
exports.lazy = function (e) {
  return {
    $$typeof: s,
    _payload: {
      _status: -1,
      _result: e
    },
    _init: P
  };
};
exports.memo = function (e, t) {
  return {
    $$typeof: c,
    type: e,
    compare: t === undefined ? null : t
  };
};
exports.useCallback = function (e, t) {
  return j().useCallback(e, t);
};
exports.useContext = function (e, t) {
  return j().useContext(e, t);
};
exports.useDebugValue = function () {};
exports.useEffect = function (e, t) {
  return j().useEffect(e, t);
};
exports.useImperativeHandle = function (e, t, n) {
  return j().useImperativeHandle(e, t, n);
};
exports.useLayoutEffect = function (e, t) {
  return j().useLayoutEffect(e, t);
};
exports.useMemo = function (e, t) {
  return j().useMemo(e, t);
};
exports.useReducer = function (e, t, n) {
  return j().useReducer(e, t, n);
};
exports.useRef = function (e) {
  return j().useRef(e);
};
exports.useState = function (e) {
  return j().useState(e);
};
exports.version = "17.0.2";