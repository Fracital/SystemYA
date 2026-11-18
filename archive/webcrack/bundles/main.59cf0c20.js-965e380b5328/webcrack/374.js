require("./725.js");
var r = require("./791.js");
var a = 60103;
exports.Fragment = 60107;
if (typeof Symbol === "function" && Symbol.for) {
  var o = Symbol.for;
  a = o("react.element");
  exports.Fragment = o("react.fragment");
}
var l = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner;
var i = Object.prototype.hasOwnProperty;
var u = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
function c(e, t, n) {
  var r;
  var o = {};
  var c = null;
  var s = null;
  if (n !== undefined) {
    c = "" + n;
  }
  if (t.key !== undefined) {
    c = "" + t.key;
  }
  if (t.ref !== undefined) {
    s = t.ref;
  }
  for (r in t) {
    if (i.call(t, r) && !u.hasOwnProperty(r)) {
      o[r] = t[r];
    }
  }
  if (e && e.defaultProps) {
    for (r in t = e.defaultProps) {
      if (o[r] === undefined) {
        o[r] = t[r];
      }
    }
  }
  return {
    $$typeof: a,
    type: e,
    key: c,
    ref: s,
    props: o,
    _owner: l.current
  };
}
exports.jsx = c;
exports.jsxs = c;