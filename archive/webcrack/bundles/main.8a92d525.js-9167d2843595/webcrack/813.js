function n(e, t) {
  var n = e.length;
  e.push(t);
  e: while (n > 0) {
    var r = n - 1 >>> 1;
    var a = e[r];
    if (!(o(a, t) > 0)) {
      break e;
    }
    e[r] = t;
    e[n] = a;
    n = r;
  }
}
function r(e) {
  if (e.length === 0) {
    return null;
  } else {
    return e[0];
  }
}
function a(e) {
  if (e.length === 0) {
    return null;
  }
  var t = e[0];
  var n = e.pop();
  if (n !== t) {
    e[0] = n;
    e: for (var r = 0, a = e.length, i = a >>> 1; r < i;) {
      var l = (r + 1) * 2 - 1;
      var u = e[l];
      var c = l + 1;
      var s = e[c];
      if (o(u, n) < 0) {
        if (c < a && o(s, u) < 0) {
          e[r] = s;
          e[c] = n;
          r = c;
        } else {
          e[r] = u;
          e[l] = n;
          r = l;
        }
      } else {
        if (!(c < a) || !(o(s, n) < 0)) {
          break e;
        }
        e[r] = s;
        e[c] = n;
        r = c;
      }
    }
  }
  return t;
}
function o(e, t) {
  var n = e.sortIndex - t.sortIndex;
  if (n !== 0) {
    return n;
  } else {
    return e.id - t.id;
  }
}
if (typeof performance === "object" && typeof performance.now === "function") {
  var i = performance;
  exports.unstable_now = function () {
    return i.now();
  };
} else {
  var l = Date;
  var u = l.now();
  exports.unstable_now = function () {
    return l.now() - u;
  };
}
var c = [];
var s = [];
var f = 1;
var d = null;
var p = 3;
var h = false;
var m = false;
var v = false;
var g = typeof setTimeout === "function" ? setTimeout : null;
var y = typeof clearTimeout === "function" ? clearTimeout : null;
var b = typeof setImmediate !== "undefined" ? setImmediate : null;
function w(e) {
  for (var t = r(s); t !== null;) {
    if (t.callback === null) {
      a(s);
    } else {
      if (!(t.startTime <= e)) {
        break;
      }
      a(s);
      t.sortIndex = t.expirationTime;
      n(c, t);
    }
    t = r(s);
  }
}
function k(e) {
  v = false;
  w(e);
  if (!m) {
    if (r(c) !== null) {
      m = true;
      L(S);
    } else {
      var t = r(s);
      if (t !== null) {
        M(k, t.startTime - e);
      }
    }
  }
}
function S(e, n) {
  m = false;
  if (v) {
    v = false;
    y(_);
    _ = -1;
  }
  h = true;
  var o = p;
  try {
    w(n);
    d = r(c);
    while (d !== null && (!(d.expirationTime > n) || e && !T())) {
      var i = d.callback;
      if (typeof i === "function") {
        d.callback = null;
        p = d.priorityLevel;
        var l = i(d.expirationTime <= n);
        n = exports.unstable_now();
        if (typeof l === "function") {
          d.callback = l;
        } else if (d === r(c)) {
          a(c);
        }
        w(n);
      } else {
        a(c);
      }
      d = r(c);
    }
    if (d !== null) {
      var u = true;
    } else {
      var f = r(s);
      if (f !== null) {
        M(k, f.startTime - n);
      }
      u = false;
    }
    return u;
  } finally {
    d = null;
    p = o;
    h = false;
  }
}
if (typeof navigator !== "undefined" && navigator.scheduling !== undefined && navigator.scheduling.isInputPending !== undefined) {
  navigator.scheduling.isInputPending.bind(navigator.scheduling);
}
var x;
var E = false;
var C = null;
var _ = -1;
var P = 5;
var O = -1;
function T() {
  return !(exports.unstable_now() - O < P);
}
function z() {
  if (C !== null) {
    var e = exports.unstable_now();
    O = e;
    var n = true;
    try {
      n = C(true, e);
    } finally {
      if (n) {
        x();
      } else {
        E = false;
        C = null;
      }
    }
  } else {
    E = false;
  }
}
if (typeof b === "function") {
  x = function () {
    b(z);
  };
} else if (typeof MessageChannel !== "undefined") {
  var N = new MessageChannel();
  var R = N.port2;
  N.port1.onmessage = z;
  x = function () {
    R.postMessage(null);
  };
} else {
  x = function () {
    g(z, 0);
  };
}
function L(e) {
  C = e;
  if (!E) {
    E = true;
    x();
  }
}
function M(e, n) {
  _ = g(function () {
    e(exports.unstable_now());
  }, n);
}
exports.unstable_IdlePriority = 5;
exports.unstable_ImmediatePriority = 1;
exports.unstable_LowPriority = 4;
exports.unstable_NormalPriority = 3;
exports.unstable_Profiling = null;
exports.unstable_UserBlockingPriority = 2;
exports.unstable_cancelCallback = function (e) {
  e.callback = null;
};
exports.unstable_continueExecution = function () {
  if (!m && !h) {
    m = true;
    L(S);
  }
};
exports.unstable_forceFrameRate = function (e) {
  if (e < 0 || e > 125) {
    console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
  } else {
    P = e > 0 ? Math.floor(1000 / e) : 5;
  }
};
exports.unstable_getCurrentPriorityLevel = function () {
  return p;
};
exports.unstable_getFirstCallbackNode = function () {
  return r(c);
};
exports.unstable_next = function (e) {
  switch (p) {
    case 1:
    case 2:
    case 3:
      var t = 3;
      break;
    default:
      t = p;
  }
  var n = p;
  p = t;
  try {
    return e();
  } finally {
    p = n;
  }
};
exports.unstable_pauseExecution = function () {};
exports.unstable_requestPaint = function () {};
exports.unstable_runWithPriority = function (e, t) {
  switch (e) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      break;
    default:
      e = 3;
  }
  var n = p;
  p = e;
  try {
    return t();
  } finally {
    p = n;
  }
};
exports.unstable_scheduleCallback = function (e, a, o) {
  var i = exports.unstable_now();
  if (typeof o === "object" && o !== null) {
    o = typeof (o = o.delay) === "number" && o > 0 ? i + o : i;
  } else {
    o = i;
  }
  switch (e) {
    case 1:
      var l = -1;
      break;
    case 2:
      l = 250;
      break;
    case 5:
      l = 1073741823;
      break;
    case 4:
      l = 10000;
      break;
    default:
      l = 5000;
  }
  e = {
    id: f++,
    callback: a,
    priorityLevel: e,
    startTime: o,
    expirationTime: l = o + l,
    sortIndex: -1
  };
  if (o > i) {
    e.sortIndex = o;
    n(s, e);
    if (r(c) === null && e === r(s)) {
      if (v) {
        y(_);
        _ = -1;
      } else {
        v = true;
      }
      M(k, o - i);
    }
  } else {
    e.sortIndex = l;
    n(c, e);
    if (!m && !h) {
      m = true;
      L(S);
    }
  }
  return e;
};
exports.unstable_shouldYield = T;
exports.unstable_wrapCallback = function (e) {
  var t = p;
  return function () {
    var n = p;
    p = t;
    try {
      return e.apply(this, arguments);
    } finally {
      p = n;
    }
  };
};