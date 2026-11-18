function r(e, t, n, r, a, o, l) {
  try {
    var i = e[o](l);
    var u = i.value;
  } catch (c) {
    n(c);
    return;
  }
  if (i.done) {
    t(u);
  } else {
    Promise.resolve(u).then(r, a);
  }
}
function a(e) {
  return function () {
    var t = this;
    var n = arguments;
    return new Promise(function (a, o) {
      var l = e.apply(t, n);
      function i(e) {
        r(l, a, o, i, u, "next", e);
      }
      function u(e) {
        r(l, a, o, i, u, "throw", e);
      }
      i(undefined);
    });
  };
}
require.d(exports, {
  Z: function () {
    return a;
  }
});