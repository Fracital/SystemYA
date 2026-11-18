function r(e) {
  r = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
    return e.__proto__ || Object.getPrototypeOf(e);
  };
  return r(e);
}
require.d(exports, {
  Z: function () {
    return r;
  }
});