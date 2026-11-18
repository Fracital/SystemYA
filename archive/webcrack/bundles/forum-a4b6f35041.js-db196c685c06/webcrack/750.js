var e = function (t) {
  "use strict";

  var e;
  var n = Object.prototype;
  var r = n.hasOwnProperty;
  var a = typeof Symbol == "function" ? Symbol : {};
  var o = a.iterator || "@@iterator";
  var s = a.asyncIterator || "@@asyncIterator";
  var i = a.toStringTag || "@@toStringTag";
  function c(t, e, n) {
    Object.defineProperty(t, e, {
      value: n,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return t[e];
  }
  try {
    c({}, "");
  } catch (t) {
    c = function (t, e, n) {
      return t[e] = n;
    };
  }
  function u(t, e, n, r) {
    var a = e && e.prototype instanceof g ? e : g;
    var o = Object.create(a.prototype);
    var s = new C(r || []);
    o._invoke = function (t, e, n) {
      var r = m;
      return function (a, o) {
        if (r === f) {
          throw new Error("Generator is already running");
        }
        if (r === p) {
          if (a === "throw") {
            throw o;
          }
          return D();
        }
        n.method = a;
        n.arg = o;
        while (true) {
          var s = n.delegate;
          if (s) {
            var i = L(s, n);
            if (i) {
              if (i === h) {
                continue;
              }
              return i;
            }
          }
          if (n.method === "next") {
            n.sent = n._sent = n.arg;
          } else if (n.method === "throw") {
            if (r === m) {
              r = p;
              throw n.arg;
            }
            n.dispatchException(n.arg);
          } else if (n.method === "return") {
            n.abrupt("return", n.arg);
          }
          r = f;
          var c = l(t, e, n);
          if (c.type === "normal") {
            r = n.done ? p : d;
            if (c.arg === h) {
              continue;
            }
            return {
              value: c.arg,
              done: n.done
            };
          }
          if (c.type === "throw") {
            r = p;
            n.method = "throw";
            n.arg = c.arg;
          }
        }
      };
    }(t, n, s);
    return o;
  }
  function l(t, e, n) {
    try {
      return {
        type: "normal",
        arg: t.call(e, n)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  t.wrap = u;
  var m = "suspendedStart";
  var d = "suspendedYield";
  var f = "executing";
  var p = "completed";
  var h = {};
  function g() {}
  function v() {}
  function y() {}
  var T = {};
  c(T, o, function () {
    return this;
  });
  var b = Object.getPrototypeOf;
  var x = b && b(b(k([])));
  if (x && x !== n && r.call(x, o)) {
    T = x;
  }
  var w = y.prototype = g.prototype = Object.create(T);
  function N(t) {
    ["next", "throw", "return"].forEach(function (e) {
      c(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function _(t, e) {
    function n(a, o, s, i) {
      var c = l(t[a], t, o);
      if (c.type !== "throw") {
        var u = c.arg;
        var m = u.value;
        if (m && typeof m == "object" && r.call(m, "__await")) {
          return e.resolve(m.__await).then(function (t) {
            n("next", t, s, i);
          }, function (t) {
            n("throw", t, s, i);
          });
        } else {
          return e.resolve(m).then(function (t) {
            u.value = t;
            s(u);
          }, function (t) {
            return n("throw", t, s, i);
          });
        }
      }
      i(c.arg);
    }
    var a;
    this._invoke = function (t, r) {
      function o() {
        return new e(function (e, a) {
          n(t, r, e, a);
        });
      }
      return a = a ? a.then(o, o) : o();
    };
  }
  function L(t, n) {
    var r = t.iterator[n.method];
    if (r === e) {
      n.delegate = null;
      if (n.method === "throw") {
        if (t.iterator.return && (n.method = "return", n.arg = e, L(t, n), n.method === "throw")) {
          return h;
        }
        n.method = "throw";
        n.arg = new TypeError("The iterator does not provide a 'throw' method");
      }
      return h;
    }
    var a = l(r, t.iterator, n.arg);
    if (a.type === "throw") {
      n.method = "throw";
      n.arg = a.arg;
      n.delegate = null;
      return h;
    }
    var o = a.arg;
    if (o) {
      if (o.done) {
        n[t.resultName] = o.value;
        n.next = t.nextLoc;
        if (n.method !== "return") {
          n.method = "next";
          n.arg = e;
        }
        n.delegate = null;
        return h;
      } else {
        return o;
      }
    } else {
      n.method = "throw";
      n.arg = new TypeError("iterator result is not an object");
      n.delegate = null;
      return h;
    }
  }
  function P(t) {
    var e = {
      tryLoc: t[0]
    };
    if (1 in t) {
      e.catchLoc = t[1];
    }
    if (2 in t) {
      e.finallyLoc = t[2];
      e.afterLoc = t[3];
    }
    this.tryEntries.push(e);
  }
  function I(t) {
    var e = t.completion || {};
    e.type = "normal";
    delete e.arg;
    t.completion = e;
  }
  function C(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }];
    t.forEach(P, this);
    this.reset(true);
  }
  function k(t) {
    if (t) {
      var n = t[o];
      if (n) {
        return n.call(t);
      }
      if (typeof t.next == "function") {
        return t;
      }
      if (!isNaN(t.length)) {
        var a = -1;
        var s = function n() {
          while (++a < t.length) {
            if (r.call(t, a)) {
              n.value = t[a];
              n.done = false;
              return n;
            }
          }
          n.value = e;
          n.done = true;
          return n;
        };
        return s.next = s;
      }
    }
    return {
      next: D
    };
  }
  function D() {
    return {
      value: e,
      done: true
    };
  }
  v.prototype = y;
  c(w, "constructor", y);
  c(y, "constructor", v);
  v.displayName = c(y, i, "GeneratorFunction");
  t.isGeneratorFunction = function (t) {
    var e = typeof t == "function" && t.constructor;
    return !!e && (e === v || (e.displayName || e.name) === "GeneratorFunction");
  };
  t.mark = function (t) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(t, y);
    } else {
      t.__proto__ = y;
      c(t, i, "GeneratorFunction");
    }
    t.prototype = Object.create(w);
    return t;
  };
  t.awrap = function (t) {
    return {
      __await: t
    };
  };
  N(_.prototype);
  c(_.prototype, s, function () {
    return this;
  });
  t.AsyncIterator = _;
  t.async = function (e, n, r, a, o = Promise) {
    var s = new _(u(e, n, r, a), o);
    if (t.isGeneratorFunction(n)) {
      return s;
    } else {
      return s.next().then(function (t) {
        if (t.done) {
          return t.value;
        } else {
          return s.next();
        }
      });
    }
  };
  N(w);
  c(w, i, "Generator");
  c(w, o, function () {
    return this;
  });
  c(w, "toString", function () {
    return "[object Generator]";
  });
  t.keys = function (t) {
    var e = [];
    for (var n in t) {
      e.push(n);
    }
    e.reverse();
    return function n() {
      while (e.length) {
        var r = e.pop();
        if (r in t) {
          n.value = r;
          n.done = false;
          return n;
        }
      }
      n.done = true;
      return n;
    };
  };
  t.values = k;
  C.prototype = {
    constructor: C,
    reset: function (t) {
      this.prev = 0;
      this.next = 0;
      this.sent = this._sent = e;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = e;
      this.tryEntries.forEach(I);
      if (!t) {
        for (var n in this) {
          if (n.charAt(0) === "t" && r.call(this, n) && !isNaN(+n.slice(1))) {
            this[n] = e;
          }
        }
      }
    },
    stop: function () {
      this.done = true;
      var t = this.tryEntries[0].completion;
      if (t.type === "throw") {
        throw t.arg;
      }
      return this.rval;
    },
    dispatchException: function (t) {
      if (this.done) {
        throw t;
      }
      var n = this;
      function a(r, a) {
        i.type = "throw";
        i.arg = t;
        n.next = r;
        if (a) {
          n.method = "next";
          n.arg = e;
        }
        return !!a;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var s = this.tryEntries[o];
        var i = s.completion;
        if (s.tryLoc === "root") {
          return a("end");
        }
        if (s.tryLoc <= this.prev) {
          var c = r.call(s, "catchLoc");
          var u = r.call(s, "finallyLoc");
          if (c && u) {
            if (this.prev < s.catchLoc) {
              return a(s.catchLoc, true);
            }
            if (this.prev < s.finallyLoc) {
              return a(s.finallyLoc);
            }
          } else if (c) {
            if (this.prev < s.catchLoc) {
              return a(s.catchLoc, true);
            }
          } else {
            if (!u) {
              throw new Error("try statement without catch or finally");
            }
            if (this.prev < s.finallyLoc) {
              return a(s.finallyLoc);
            }
          }
        }
      }
    },
    abrupt: function (t, e) {
      for (var n = this.tryEntries.length - 1; n >= 0; --n) {
        var a = this.tryEntries[n];
        if (a.tryLoc <= this.prev && r.call(a, "finallyLoc") && this.prev < a.finallyLoc) {
          var o = a;
          break;
        }
      }
      if (o && (t === "break" || t === "continue") && o.tryLoc <= e && e <= o.finallyLoc) {
        o = null;
      }
      var s = o ? o.completion : {};
      s.type = t;
      s.arg = e;
      if (o) {
        this.method = "next";
        this.next = o.finallyLoc;
        return h;
      } else {
        return this.complete(s);
      }
    },
    complete: function (t, e) {
      if (t.type === "throw") {
        throw t.arg;
      }
      if (t.type === "break" || t.type === "continue") {
        this.next = t.arg;
      } else if (t.type === "return") {
        this.rval = this.arg = t.arg;
        this.method = "return";
        this.next = "end";
      } else if (t.type === "normal" && e) {
        this.next = e;
      }
      return h;
    },
    finish: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var n = this.tryEntries[e];
        if (n.finallyLoc === t) {
          this.complete(n.completion, n.afterLoc);
          I(n);
          return h;
        }
      }
    },
    catch: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var n = this.tryEntries[e];
        if (n.tryLoc === t) {
          var r = n.completion;
          if (r.type === "throw") {
            var a = r.arg;
            I(n);
          }
          return a;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function (t, n, r) {
      this.delegate = {
        iterator: k(t),
        resultName: n,
        nextLoc: r
      };
      if (this.method === "next") {
        this.arg = e;
      }
      return h;
    }
  };
  return t;
}(module.exports);
try {
  regeneratorRuntime = e;
} catch (t) {
  if (typeof globalThis == "object") {
    globalThis.regeneratorRuntime = e;
  } else {
    Function("r", "regeneratorRuntime = r")(e);
  }
}