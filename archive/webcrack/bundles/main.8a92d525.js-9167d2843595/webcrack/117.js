var n = Symbol.for("react.element");
var r = Symbol.for("react.portal");
var a = Symbol.for("react.fragment");
var o = Symbol.for("react.strict_mode");
var i = Symbol.for("react.profiler");
var l = Symbol.for("react.provider");
var u = Symbol.for("react.context");
var c = Symbol.for("react.forward_ref");
var s = Symbol.for("react.suspense");
var f = Symbol.for("react.memo");
var d = Symbol.for("react.lazy");
var p = Symbol.iterator;
var h = {
  isMounted: function () {
    return false;
  },
  enqueueForceUpdate: function () {},
  enqueueReplaceState: function () {},
  enqueueSetState: function () {}
};
var m = Object.assign;
var v = {};
function g(e, t, n) {
  this.props = e;
  this.context = t;
  this.refs = v;
  this.updater = n || h;
}
function y() {}
function b(e, t, n) {
  this.props = e;
  this.context = t;
  this.refs = v;
  this.updater = n || h;
}
g.prototype.isReactComponent = {};
g.prototype.setState = function (e, t) {
  if (typeof e !== "object" && typeof e !== "function" && e != null) {
    throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  }
  this.updater.enqueueSetState(this, e, t, "setState");
};
g.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
y.prototype = g.prototype;
var w = b.prototype = new y();
w.constructor = b;
m(w, g.prototype);
w.isPureReactComponent = true;
var k = Array.isArray;
var S = Object.prototype.hasOwnProperty;
var x = {
  current: null
};
var E = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
function C(e, t, r) {
  var a;
  var o = {};
  var i = null;
  var l = null;
  if (t != null) {
    if (t.ref !== undefined) {
      l = t.ref;
    }
    if (t.key !== undefined) {
      i = "" + t.key;
    }
    for (a in t) {
      if (S.call(t, a) && !E.hasOwnProperty(a)) {
        o[a] = t[a];
      }
    }
  }
  var u = arguments.length - 2;
  if (u === 1) {
    o.children = r;
  } else if (u > 1) {
    var c = Array(u);
    for (var s = 0; s < u; s++) {
      c[s] = arguments[s + 2];
    }
    o.children = c;
  }
  if (e && e.defaultProps) {
    for (a in u = e.defaultProps) {
      if (o[a] === undefined) {
        o[a] = u[a];
      }
    }
  }
  return {
    $$typeof: n,
    type: e,
    key: i,
    ref: l,
    props: o,
    _owner: x.current
  };
}
function _(e) {
  return typeof e === "object" && e !== null && e.$$typeof === n;
}
var P = /\/+/g;
function O(e, t) {
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
function T(e, t, a, o, i) {
  var l = typeof e;
  if (l === "undefined" || l === "boolean") {
    e = null;
  }
  var u = false;
  if (e === null) {
    u = true;
  } else {
    switch (l) {
      case "string":
      case "number":
        u = true;
        break;
      case "object":
        switch (e.$$typeof) {
          case n:
          case r:
            u = true;
        }
    }
  }
  if (u) {
    i = i(u = e);
    e = o === "" ? "." + O(u, 0) : o;
    if (k(i)) {
      a = "";
      if (e != null) {
        a = e.replace(P, "$&/") + "/";
      }
      T(i, t, a, "", function (e) {
        return e;
      });
    } else if (i != null) {
      if (_(i)) {
        i = function (e, t) {
          return {
            $$typeof: n,
            type: e.type,
            key: t,
            ref: e.ref,
            props: e.props,
            _owner: e._owner
          };
        }(i, a + (!i.key || u && u.key === i.key ? "" : ("" + i.key).replace(P, "$&/") + "/") + e);
      }
      t.push(i);
    }
    return 1;
  }
  u = 0;
  o = o === "" ? "." : o + ":";
  if (k(e)) {
    for (var c = 0; c < e.length; c++) {
      var s = o + O(l = e[c], c);
      u += T(l, t, a, s, i);
    }
  } else {
    s = function (e) {
      if (e === null || typeof e !== "object") {
        return null;
      } else if (typeof (e = p && e[p] || e["@@iterator"]) === "function") {
        return e;
      } else {
        return null;
      }
    }(e);
    if (typeof s === "function") {
      e = s.call(e);
      c = 0;
      while (!(l = e.next()).done) {
        u += T(l = l.value, t, a, s = o + O(l, c++), i);
      }
    } else if (l === "object") {
      t = String(e);
      throw Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
    }
  }
  return u;
}
function z(e, t, n) {
  if (e == null) {
    return e;
  }
  var r = [];
  var a = 0;
  T(e, r, "", "", function (e) {
    return t.call(n, e, a++);
  });
  return r;
}
function N(e) {
  if (e._status === -1) {
    var t = e._result;
    (t = t()).then(function (t) {
      if (e._status === 0 || e._status === -1) {
        e._status = 1;
        e._result = t;
      }
    }, function (t) {
      if (e._status === 0 || e._status === -1) {
        e._status = 2;
        e._result = t;
      }
    });
    if (e._status === -1) {
      e._status = 0;
      e._result = t;
    }
  }
  if (e._status === 1) {
    return e._result.default;
  }
  throw e._result;
}
var R = {
  current: null
};
var L = {
  transition: null
};
var M = {
  ReactCurrentDispatcher: R,
  ReactCurrentBatchConfig: L,
  ReactCurrentOwner: x
};
exports.Children = {
  map: z,
  forEach: function (e, t, n) {
    z(e, function () {
      t.apply(this, arguments);
    }, n);
  },
  count: function (e) {
    var t = 0;
    z(e, function () {
      t++;
    });
    return t;
  },
  toArray: function (e) {
    return z(e, function (e) {
      return e;
    }) || [];
  },
  only: function (e) {
    if (!_(e)) {
      throw Error("React.Children.only expected to receive a single React element child.");
    }
    return e;
  }
};
exports.Component = g;
exports.Fragment = a;
exports.Profiler = i;
exports.PureComponent = b;
exports.StrictMode = o;
exports.Suspense = s;
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = M;
exports.cloneElement = function (e, t, r) {
  if (e === null || e === undefined) {
    throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
  }
  var a = m({}, e.props);
  var o = e.key;
  var i = e.ref;
  var l = e._owner;
  if (t != null) {
    if (t.ref !== undefined) {
      i = t.ref;
      l = x.current;
    }
    if (t.key !== undefined) {
      o = "" + t.key;
    }
    if (e.type && e.type.defaultProps) {
      var u = e.type.defaultProps;
    }
    for (c in t) {
      if (S.call(t, c) && !E.hasOwnProperty(c)) {
        a[c] = t[c] === undefined && u !== undefined ? u[c] : t[c];
      }
    }
  }
  var c = arguments.length - 2;
  if (c === 1) {
    a.children = r;
  } else if (c > 1) {
    u = Array(c);
    for (var s = 0; s < c; s++) {
      u[s] = arguments[s + 2];
    }
    a.children = u;
  }
  return {
    $$typeof: n,
    type: e.type,
    key: o,
    ref: i,
    props: a,
    _owner: l
  };
};
exports.createContext = function (e) {
  (e = {
    $$typeof: u,
    _currentValue: e,
    _currentValue2: e,
    _threadCount: 0,
    Provider: null,
    Consumer: null,
    _defaultValue: null,
    _globalName: null
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
    $$typeof: c,
    render: e
  };
};
exports.isValidElement = _;
exports.lazy = function (e) {
  return {
    $$typeof: d,
    _payload: {
      _status: -1,
      _result: e
    },
    _init: N
  };
};
exports.memo = function (e, t) {
  return {
    $$typeof: f,
    type: e,
    compare: t === undefined ? null : t
  };
};
exports.startTransition = function (e) {
  var t = L.transition;
  L.transition = {};
  try {
    e();
  } finally {
    L.transition = t;
  }
};
exports.unstable_act = function () {
  throw Error("act(...) is not supported in production builds of React.");
};
exports.useCallback = function (e, t) {
  return R.current.useCallback(e, t);
};
exports.useContext = function (e) {
  return R.current.useContext(e);
};
exports.useDebugValue = function () {};
exports.useDeferredValue = function (e) {
  return R.current.useDeferredValue(e);
};
exports.useEffect = function (e, t) {
  return R.current.useEffect(e, t);
};
exports.useId = function () {
  return R.current.useId();
};
exports.useImperativeHandle = function (e, t, n) {
  return R.current.useImperativeHandle(e, t, n);
};
exports.useInsertionEffect = function (e, t) {
  return R.current.useInsertionEffect(e, t);
};
exports.useLayoutEffect = function (e, t) {
  return R.current.useLayoutEffect(e, t);
};
exports.useMemo = function (e, t) {
  return R.current.useMemo(e, t);
};
exports.useReducer = function (e, t, n) {
  return R.current.useReducer(e, t, n);
};
exports.useRef = function (e) {
  return R.current.useRef(e);
};
exports.useState = function (e) {
  return R.current.useState(e);
};
exports.useSyncExternalStore = function (e, t, n) {
  return R.current.useSyncExternalStore(e, t, n);
};
exports.useTransition = function () {
  return R.current.useTransition();
};
exports.version = "18.2.0";