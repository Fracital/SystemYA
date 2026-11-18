var n;
var r;
var a;
var o;
if (typeof performance === "object" && typeof performance.now === "function") {
  var l = performance;
  exports.unstable_now = function () {
    return l.now();
  };
} else {
  var i = Date;
  var u = i.now();
  exports.unstable_now = function () {
    return i.now() - u;
  };
}
if (typeof window === "undefined" || typeof MessageChannel !== "function") {
  var c = null;
  var s = null;
  var f = function e() {
    if (c !== null) {
      try {
        var n = exports.unstable_now();
        c(true, n);
        c = null;
      } catch (r) {
        setTimeout(e, 0);
        throw r;
      }
    }
  };
  n = function (e) {
    if (c !== null) {
      setTimeout(n, 0, e);
    } else {
      c = e;
      setTimeout(f, 0);
    }
  };
  r = function (e, t) {
    s = setTimeout(e, t);
  };
  a = function () {
    clearTimeout(s);
  };
  exports.unstable_shouldYield = function () {
    return false;
  };
  o = exports.unstable_forceFrameRate = function () {};
} else {
  var d = window.setTimeout;
  var p = window.clearTimeout;
  if (typeof console !== "undefined") {
    var h = window.cancelAnimationFrame;
    if (typeof window.requestAnimationFrame !== "function") {
      console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills");
    }
    if (typeof h !== "function") {
      console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills");
    }
  }
  var v = false;
  var m = null;
  var y = -1;
  var g = 5;
  var b = 0;
  exports.unstable_shouldYield = function () {
    return exports.unstable_now() >= b;
  };
  o = function () {};
  exports.unstable_forceFrameRate = function (e) {
    if (e < 0 || e > 125) {
      console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
    } else {
      g = e > 0 ? Math.floor(1000 / e) : 5;
    }
  };
  var w = new MessageChannel();
  var k = w.port2;
  w.port1.onmessage = function () {
    if (m !== null) {
      var e = exports.unstable_now();
      b = e + g;
      try {
        if (m(true, e)) {
          k.postMessage(null);
        } else {
          v = false;
          m = null;
        }
      } catch (n) {
        k.postMessage(null);
        throw n;
      }
    } else {
      v = false;
    }
  };
  n = function (e) {
    m = e;
    if (!v) {
      v = true;
      k.postMessage(null);
    }
  };
  r = function (e, n) {
    y = d(function () {
      e(exports.unstable_now());
    }, n);
  };
  a = function () {
    p(y);
    y = -1;
  };
}
function x(e, t) {
  var n = e.length;
  e.push(t);
  e: while (true) {
    var r = n - 1 >>> 1;
    var a = e[r];
    if (a === undefined || !(E(a, t) > 0)) {
      break e;
    }
    e[r] = t;
    e[n] = a;
    n = r;
  }
}
function C(e) {
  if ((e = e[0]) === undefined) {
    return null;
  } else {
    return e;
  }
}
function S(e) {
  var t = e[0];
  if (t !== undefined) {
    var n = e.pop();
    if (n !== t) {
      e[0] = n;
      e: for (var r = 0, a = e.length; r < a;) {
        var o = (r + 1) * 2 - 1;
        var l = e[o];
        var i = o + 1;
        var u = e[i];
        if (l !== undefined && E(l, n) < 0) {
          if (u !== undefined && E(u, l) < 0) {
            e[r] = u;
            e[i] = n;
            r = i;
          } else {
            e[r] = l;
            e[o] = n;
            r = o;
          }
        } else {
          if (u === undefined || !(E(u, n) < 0)) {
            break e;
          }
          e[r] = u;
          e[i] = n;
          r = i;
        }
      }
    }
    return t;
  }
  return null;
}
function E(e, t) {
  var n = e.sortIndex - t.sortIndex;
  if (n !== 0) {
    return n;
  } else {
    return e.id - t.id;
  }
}
var z = [];
var L = [];
var _ = 1;
var P = null;
var N = 3;
var j = false;
var O = false;
var T = false;
function M(e) {
  for (var t = C(L); t !== null;) {
    if (t.callback === null) {
      S(L);
    } else {
      if (!(t.startTime <= e)) {
        break;
      }
      S(L);
      t.sortIndex = t.expirationTime;
      x(z, t);
    }
    t = C(L);
  }
}
function B(e) {
  T = false;
  M(e);
  if (!O) {
    if (C(z) !== null) {
      O = true;
      n(D);
    } else {
      var t = C(L);
      if (t !== null) {
        r(B, t.startTime - e);
      }
    }
  }
}
function D(e, n) {
  O = false;
  if (T) {
    T = false;
    a();
  }
  j = true;
  var o = N;
  try {
    M(n);
    P = C(z);
    while (P !== null && (!(P.expirationTime > n) || e && !exports.unstable_shouldYield())) {
      var l = P.callback;
      if (typeof l === "function") {
        P.callback = null;
        N = P.priorityLevel;
        var i = l(P.expirationTime <= n);
        n = exports.unstable_now();
        if (typeof i === "function") {
          P.callback = i;
        } else if (P === C(z)) {
          S(z);
        }
        M(n);
      } else {
        S(z);
      }
      P = C(z);
    }
    if (P !== null) {
      var u = true;
    } else {
      var c = C(L);
      if (c !== null) {
        r(B, c.startTime - n);
      }
      u = false;
    }
    return u;
  } finally {
    P = null;
    N = o;
    j = false;
  }
}
var U = o;
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
  if (!O && !j) {
    O = true;
    n(D);
  }
};
exports.unstable_getCurrentPriorityLevel = function () {
  return N;
};
exports.unstable_getFirstCallbackNode = function () {
  return C(z);
};
exports.unstable_next = function (e) {
  switch (N) {
    case 1:
    case 2:
    case 3:
      var t = 3;
      break;
    default:
      t = N;
  }
  var n = N;
  N = t;
  try {
    return e();
  } finally {
    N = n;
  }
};
exports.unstable_pauseExecution = function () {};
exports.unstable_requestPaint = U;
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
  var n = N;
  N = e;
  try {
    return t();
  } finally {
    N = n;
  }
};
exports.unstable_scheduleCallback = function (e, o, l) {
  var i = exports.unstable_now();
  if (typeof l === "object" && l !== null) {
    l = typeof (l = l.delay) === "number" && l > 0 ? i + l : i;
  } else {
    l = i;
  }
  switch (e) {
    case 1:
      var u = -1;
      break;
    case 2:
      u = 250;
      break;
    case 5:
      u = 1073741823;
      break;
    case 4:
      u = 10000;
      break;
    default:
      u = 5000;
  }
  e = {
    id: _++,
    callback: o,
    priorityLevel: e,
    startTime: l,
    expirationTime: u = l + u,
    sortIndex: -1
  };
  if (l > i) {
    e.sortIndex = l;
    x(L, e);
    if (C(z) === null && e === C(L)) {
      if (T) {
        a();
      } else {
        T = true;
      }
      r(B, l - i);
    }
  } else {
    e.sortIndex = u;
    x(z, e);
    if (!O && !j) {
      O = true;
      n(D);
    }
  }
  return e;
};
exports.unstable_wrapCallback = function (e) {
  var t = N;
  return function () {
    var n = N;
    N = t;
    try {
      return e.apply(this, arguments);
    } finally {
      N = n;
    }
  };
};