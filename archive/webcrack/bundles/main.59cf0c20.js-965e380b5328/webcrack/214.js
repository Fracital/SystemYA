require.d(exports, {
  Z: function () {
    return m;
  }
});
var r = require("./861.js");
var a = require("./885.js");
var o = require("./762.js");
var l = require("./671.js");
var i = require("./144.js");
var u = require("./340.js");
var c = require("./505.js");
var s = require("./757.js");
var f = s;
var d = require("./791.js");
var p = require("./184.js");
var m = function (e) {
  (0, u.Z)(s, e);
  var n = (0, c.Z)(s);
  function s() {
    var e;
    (0, l.Z)(this, s);
    for (var r = arguments.length, a = new Array(r), o = 0; o < r; o++) {
      a[o] = arguments[o];
    }
    (e = n.call.apply(n, [this].concat(a))).timeouts = [];
    return e;
  }
  (0, i.Z)(s, [{
    key: "componentWillUnmount",
    value: function () {
      this.unmounting = true;
      var n;
      var r = (0, o.Z)(this.timeouts);
      try {
        for (r.s(); !(n = r.n()).done;) {
          var l = (0, a.Z)(n.value, 2);
          var i = l[0];
          var u = l[1];
          i();
          clearTimeout(u);
        }
      } catch (c) {
        r.e(c);
      } finally {
        r.f();
      }
    }
  }, {
    key: "sleep",
    value: function () {
      var n = (0, r.Z)(f.mark(function t(n) {
        var a = this;
        return f.wrap(function (e) {
          while (true) {
            switch (e.prev = e.next) {
              case 0:
                if (!this.unmounting) {
                  e.next = 2;
                  break;
                }
                return e.abrupt("return");
              case 2:
                e.next = 4;
                return new Promise(function (e) {
                  a.timeouts.push([e, setTimeout(e, n)]);
                });
              case 4:
                return e.abrupt("return", e.sent);
              case 5:
              case "end":
                return e.stop();
            }
          }
        }, t, this);
      }));
      return function (t) {
        return n.apply(this, arguments);
      };
    }()
  }, {
    key: "render",
    value: function () {
      return <span ref={this.element} />;
    }
  }]);
  return s;
}(d.Component);