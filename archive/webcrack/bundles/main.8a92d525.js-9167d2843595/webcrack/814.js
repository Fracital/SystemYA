function r() {
  if (typeof Reflect === "undefined" || !Reflect.construct) {
    return false;
  }
  if (Reflect.construct.sham) {
    return false;
  }
  if (typeof Proxy === "function") {
    return true;
  }
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
require.d(exports, {
  Z: function () {
    return r;
  }
});