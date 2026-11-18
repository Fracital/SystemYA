function r(e, t) {
  r = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (e, t) {
    e.__proto__ = t;
    return e;
  };
  return r(e, t);
}
require.d(exports, {
  Z: function () {
    return r;
  }
});