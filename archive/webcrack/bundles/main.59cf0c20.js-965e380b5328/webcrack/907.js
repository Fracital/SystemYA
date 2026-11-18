function r(e, t) {
  if (t == null || t > e.length) {
    t = e.length;
  }
  for (var n = 0, r = new Array(t); n < t; n++) {
    r[n] = e[n];
  }
  return r;
}
require.d(exports, {
  Z: function () {
    return r;
  }
});