var t;
var n;
var r = module.exports = {};
function a() {
  throw new Error("setTimeout has not been defined");
}
function o() {
  throw new Error("clearTimeout has not been defined");
}
function l(e) {
  if (t === setTimeout) {
    return setTimeout(e, 0);
  }
  if ((t === a || !t) && setTimeout) {
    t = setTimeout;
    return setTimeout(e, 0);
  }
  try {
    return t(e, 0);
  } catch (n) {
    try {
      return t.call(null, e, 0);
    } catch (n) {
      return t.call(this, e, 0);
    }
  }
}
(function () {
  try {
    t = typeof setTimeout === "function" ? setTimeout : a;
  } catch (e) {
    t = a;
  }
  try {
    n = typeof clearTimeout === "function" ? clearTimeout : o;
  } catch (e) {
    n = o;
  }
})();
var i;
var u = [];
var c = false;
var s = -1;
function f() {
  if (c && i) {
    c = false;
    if (i.length) {
      u = i.concat(u);
    } else {
      s = -1;
    }
    if (u.length) {
      d();
    }
  }
}
function d() {
  if (!c) {
    var e = l(f);
    c = true;
    for (var t = u.length; t;) {
      i = u;
      u = [];
      while (++s < t) {
        if (i) {
          i[s].run();
        }
      }
      s = -1;
      t = u.length;
    }
    i = null;
    c = false;
    (function (e) {
      if (n === clearTimeout) {
        return clearTimeout(e);
      }
      if ((n === o || !n) && clearTimeout) {
        n = clearTimeout;
        return clearTimeout(e);
      }
      try {
        n(e);
      } catch (t) {
        try {
          return n.call(null, e);
        } catch (t) {
          return n.call(this, e);
        }
      }
    })(e);
  }
}
function p(e, t) {
  this.fun = e;
  this.array = t;
}
function h() {}
r.nextTick = function (e) {
  var t = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var n = 1; n < arguments.length; n++) {
      t[n - 1] = arguments[n];
    }
  }
  u.push(new p(e, t));
  if (u.length === 1 && !c) {
    l(d);
  }
};
p.prototype.run = function () {
  this.fun.apply(null, this.array);
};
r.title = "browser";
r.browser = true;
r.env = {};
r.argv = [];
r.version = "";
r.versions = {};
r.on = h;
r.addListener = h;
r.once = h;
r.off = h;
r.removeListener = h;
r.removeAllListeners = h;
r.emit = h;
r.prependListener = h;
r.prependOnceListener = h;
r.listeners = function (e) {
  return [];
};
r.binding = function (e) {
  throw new Error("process.binding is not supported");
};
r.cwd = function () {
  return "/";
};
r.chdir = function (e) {
  throw new Error("process.chdir is not supported");
};
r.umask = function () {
  return 0;
};