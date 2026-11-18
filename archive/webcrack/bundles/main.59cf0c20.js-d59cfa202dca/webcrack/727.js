var t = function (e) {
  "use strict";

  var t;
  var n = Object.prototype;
  var r = n.hasOwnProperty;
  var a = typeof Symbol === "function" ? Symbol : {};
  var o = a.iterator || "@@iterator";
  var l = a.asyncIterator || "@@asyncIterator";
  var i = a.toStringTag || "@@toStringTag";
  function u(e, t, n) {
    Object.defineProperty(e, t, {
      value: n,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return e[t];
  }
  try {
    u({}, "");
  } catch (j) {
    u = function (e, t, n) {
      return e[t] = n;
    };
  }
  function c(e, t, n, r) {
    var a = t && t.prototype instanceof m ? t : m;
    var o = Object.create(a.prototype);
    var l = new _(r || []);
    o._invoke = function (e, t, n) {
      var r = f;
      return function (a, o) {
        if (r === p) {
          throw new Error("Generator is already running");
        }
        if (r === h) {
          if (a === "throw") {
            throw o;
          }
          return N();
        }
        n.method = a;
        n.arg = o;
        while (true) {
          var l = n.delegate;
          if (l) {
            var i = E(l, n);
            if (i) {
              if (i === v) {
                continue;
              }
              return i;
            }
          }
          if (n.method === "next") {
            n.sent = n._sent = n.arg;
          } else if (n.method === "throw") {
            if (r === f) {
              r = h;
              throw n.arg;
            }
            n.dispatchException(n.arg);
          } else if (n.method === "return") {
            n.abrupt("return", n.arg);
          }
          r = p;
          var u = s(e, t, n);
          if (u.type === "normal") {
            r = n.done ? h : d;
            if (u.arg === v) {
              continue;
            }
            return {
              value: u.arg,
              done: n.done
            };
          }
          if (u.type === "throw") {
            r = h;
            n.method = "throw";
            n.arg = u.arg;
          }
        }
      };
    }(e, n, l);
    return o;
  }
  function s(e, t, n) {
    try {
      return {
        type: "normal",
        arg: e.call(t, n)
      };
    } catch (j) {
      return {
        type: "throw",
        arg: j
      };
    }
  }
  e.wrap = c;
  var f = "suspendedStart";
  var d = "suspendedYield";
  var p = "executing";
  var h = "completed";
  var v = {};
  function m() {}
  function y() {}
  function g() {}
  var b = {};
  u(b, o, function () {
    return this;
  });
  var w = Object.getPrototypeOf;
  var k = w && w(w(P([])));
  if (k && k !== n && r.call(k, o)) {
    b = k;
  }
  var x = g.prototype = m.prototype = Object.create(b);
  function C(e) {
    ["next", "throw", "return"].forEach(function (t) {
      u(e, t, function (e) {
        return this._invoke(t, e);
      });
    });
  }
  function S(e, t) {
    function n(a, o, l, i) {
      var u = s(e[a], e, o);
      if (u.type !== "throw") {
        var c = u.arg;
        var f = c.value;
        if (f && typeof f === "object" && r.call(f, "__await")) {
          return t.resolve(f.__await).then(function (e) {
            n("next", e, l, i);
          }, function (e) {
            n("throw", e, l, i);
          });
        } else {
          return t.resolve(f).then(function (e) {
            c.value = e;
            l(c);
          }, function (e) {
            return n("throw", e, l, i);
          });
        }
      }
      i(u.arg);
    }
    var a;
    this._invoke = function (e, r) {
      function o() {
        return new t(function (t, a) {
          n(e, r, t, a);
        });
      }
      return a = a ? a.then(o, o) : o();
    };
  }
  function E(e, n) {
    var r = e.iterator[n.method];
    if (r === t) {
      n.delegate = null;
      if (n.method === "throw") {
        if (e.iterator.return && (n.method = "return", n.arg = t, E(e, n), n.method === "throw")) {
          return v;
        }
        n.method = "throw";
        n.arg = new TypeError("The iterator does not provide a 'throw' method");
      }
      return v;
    }
    var a = s(r, e.iterator, n.arg);
    if (a.type === "throw") {
      n.method = "throw";
      n.arg = a.arg;
      n.delegate = null;
      return v;
    }
    var o = a.arg;
    if (o) {
      if (o.done) {
        n[e.resultName] = o.value;
        n.next = e.nextLoc;
        if (n.method !== "return") {
          n.method = "next";
          n.arg = t;
        }
        n.delegate = null;
        return v;
      } else {
        return o;
      }
    } else {
      n.method = "throw";
      n.arg = new TypeError("iterator result is not an object");
      n.delegate = null;
      return v;
    }
  }
  function z(e) {
    var t = {
      tryLoc: e[0]
    };
    if (1 in e) {
      t.catchLoc = e[1];
    }
    if (2 in e) {
      t.finallyLoc = e[2];
      t.afterLoc = e[3];
    }
    this.tryEntries.push(t);
  }
  function L(e) {
    var t = e.completion || {};
    t.type = "normal";
    delete t.arg;
    e.completion = t;
  }
  function _(e) {
    this.tryEntries = [{
      tryLoc: "root"
    }];
    e.forEach(z, this);
    this.reset(true);
  }
  function P(e) {
    if (e) {
      var n = e[o];
      if (n) {
        return n.call(e);
      }
      if (typeof e.next === "function") {
        return e;
      }
      if (!isNaN(e.length)) {
        var a = -1;
        var l = function n() {
          while (++a < e.length) {
            if (r.call(e, a)) {
              n.value = e[a];
              n.done = false;
              return n;
            }
          }
          n.value = t;
          n.done = true;
          return n;
        };
        return l.next = l;
      }
    }
    return {
      next: N
    };
  }
  function N() {
    return {
      value: t,
      done: true
    };
  }
  y.prototype = g;
  u(x, "constructor", g);
  u(g, "constructor", y);
  y.displayName = u(g, i, "GeneratorFunction");
  e.isGeneratorFunction = function (e) {
    var t = typeof e === "function" && e.constructor;
    return !!t && (t === y || (t.displayName || t.name) === "GeneratorFunction");
  };
  e.mark = function (e) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(e, g);
    } else {
      e.__proto__ = g;
      u(e, i, "GeneratorFunction");
    }
    e.prototype = Object.create(x);
    return e;
  };
  e.awrap = function (e) {
    return {
      __await: e
    };
  };
  C(S.prototype);
  u(S.prototype, l, function () {
    return this;
  });
  e.AsyncIterator = S;
  e.async = function (t, n, r, a, o = Promise) {
    var l = new S(c(t, n, r, a), o);
    if (e.isGeneratorFunction(n)) {
      return l;
    } else {
      return l.next().then(function (e) {
        if (e.done) {
          return e.value;
        } else {
          return l.next();
        }
      });
    }
  };
  C(x);
  u(x, i, "Generator");
  u(x, o, function () {
    return this;
  });
  u(x, "toString", function () {
    return "[object Generator]";
  });
  e.keys = function (e) {
    var t = [];
    for (var n in e) {
      t.push(n);
    }
    t.reverse();
    return function n() {
      while (t.length) {
        var r = t.pop();
        if (r in e) {
          n.value = r;
          n.done = false;
          return n;
        }
      }
      n.done = true;
      return n;
    };
  };
  e.values = P;
  _.prototype = {
    constructor: _,
    reset: function (e) {
      this.prev = 0;
      this.next = 0;
      this.sent = this._sent = t;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = t;
      this.tryEntries.forEach(L);
      if (!e) {
        for (var n in this) {
          if (n.charAt(0) === "t" && r.call(this, n) && !isNaN(+n.slice(1))) {
            this[n] = t;
          }
        }
      }
    },
    stop: function () {
      this.done = true;
      var e = this.tryEntries[0].completion;
      if (e.type === "throw") {
        throw e.arg;
      }
      return this.rval;
    },
    dispatchException: function (e) {
      if (this.done) {
        throw e;
      }
      var n = this;
      function a(r, a) {
        i.type = "throw";
        i.arg = e;
        n.next = r;
        if (a) {
          n.method = "next";
          n.arg = t;
        }
        return !!a;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var l = this.tryEntries[o];
        var i = l.completion;
        if (l.tryLoc === "root") {
          return a("end");
        }
        if (l.tryLoc <= this.prev) {
          var u = r.call(l, "catchLoc");
          var c = r.call(l, "finallyLoc");
          if (u && c) {
            if (this.prev < l.catchLoc) {
              return a(l.catchLoc, true);
            }
            if (this.prev < l.finallyLoc) {
              return a(l.finallyLoc);
            }
          } else if (u) {
            if (this.prev < l.catchLoc) {
              return a(l.catchLoc, true);
            }
          } else {
            if (!c) {
              throw new Error("try statement without catch or finally");
            }
            if (this.prev < l.finallyLoc) {
              return a(l.finallyLoc);
            }
          }
        }
      }
    },
    abrupt: function (e, t) {
      for (var n = this.tryEntries.length - 1; n >= 0; --n) {
        var a = this.tryEntries[n];
        if (a.tryLoc <= this.prev && r.call(a, "finallyLoc") && this.prev < a.finallyLoc) {
          var o = a;
          break;
        }
      }
      if (o && (e === "break" || e === "continue") && o.tryLoc <= t && t <= o.finallyLoc) {
        o = null;
      }
      var l = o ? o.completion : {};
      l.type = e;
      l.arg = t;
      if (o) {
        this.method = "next";
        this.next = o.finallyLoc;
        return v;
      } else {
        return this.complete(l);
      }
    },
    complete: function (e, t) {
      if (e.type === "throw") {
        throw e.arg;
      }
      if (e.type === "break" || e.type === "continue") {
        this.next = e.arg;
      } else if (e.type === "return") {
        this.rval = this.arg = e.arg;
        this.method = "return";
        this.next = "end";
      } else if (e.type === "normal" && t) {
        this.next = t;
      }
      return v;
    },
    finish: function (e) {
      for (var t = this.tryEntries.length - 1; t >= 0; --t) {
        var n = this.tryEntries[t];
        if (n.finallyLoc === e) {
          this.complete(n.completion, n.afterLoc);
          L(n);
          return v;
        }
      }
    },
    catch: function (e) {
      for (var t = this.tryEntries.length - 1; t >= 0; --t) {
        var n = this.tryEntries[t];
        if (n.tryLoc === e) {
          var r = n.completion;
          if (r.type === "throw") {
            var a = r.arg;
            L(n);
          }
          return a;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function (e, n, r) {
      this.delegate = {
        iterator: P(e),
        resultName: n,
        nextLoc: r
      };
      if (this.method === "next") {
        this.arg = t;
      }
      return v;
    }
  };
  return e;
}(module.exports);
try {
  regeneratorRuntime = t;
} catch (n) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = t;
  } else {
    Function("r", "regeneratorRuntime = r")(t);
  }
}