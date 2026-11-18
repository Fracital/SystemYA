function n(e, t) {
  var n = [];
  var r = [];
  if (t == null) {
    t = function (e, t) {
      if (n[0] === t) {
        return "[Circular ~]";
      } else {
        return "[Circular ~." + r.slice(0, n.indexOf(t)).join(".") + "]";
      }
    };
  }
  return function (a, o) {
    if (n.length > 0) {
      var l = n.indexOf(this);
      if (~l) {
        n.splice(l + 1);
      } else {
        n.push(this);
      }
      if (~l) {
        r.splice(l, Infinity, a);
      } else {
        r.push(a);
      }
      if (~n.indexOf(o)) {
        o = t.call(this, a, o);
      }
    } else {
      n.push(o);
    }
    if (e == null) {
      return o;
    } else {
      return e.call(this, a, o);
    }
  };
}
(module.exports = function (e, t, r, a) {
  return JSON.stringify(e, n(t, a), r);
}).getSerialize = n;