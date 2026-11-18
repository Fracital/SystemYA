function s(t, e) {
  if (!(t instanceof e)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
Object.defineProperty(exports, "__esModule", {
  value: true
});
var n = function () {
  function t(t, e) {
    for (var s = 0; s < e.length; s++) {
      var n = e[s];
      n.enumerable = n.enumerable || false;
      n.configurable = true;
      if ("value" in n) {
        n.writable = true;
      }
      Object.defineProperty(t, n.key, n);
    }
  }
  return function (e, s, n) {
    if (s) {
      t(e.prototype, s);
    }
    if (n) {
      t(e, n);
    }
    return e;
  };
}();
var i = function () {
  function t() {
    s(this, t);
  }
  n(t, [{
    key: "typeHtmlChars",
    value: function (t, e, s) {
      if (s.contentType !== "html") {
        return e;
      }
      var n = t.substr(e).charAt(0);
      if (n === "<" || n === "&") {
        var i = "";
        for (i = n === "<" ? ">" : ";"; t.substr(e + 1).charAt(0) !== i && (e++, !(e + 1 > t.length)););
        e++;
      }
      return e;
    }
  }, {
    key: "backSpaceHtmlChars",
    value: function (t, e, s) {
      if (s.contentType !== "html") {
        return e;
      }
      var n = t.substr(e).charAt(0);
      if (n === ">" || n === ";") {
        var i = "";
        for (i = n === ">" ? "<" : "&"; t.substr(e - 1).charAt(0) !== i && (e--, !(e < 0)););
        e--;
      }
      return e;
    }
  }]);
  return t;
}();
exports.default = i;
var r = new i();
exports.htmlParser = r;