function n(t) {
  if (t && t.__esModule) {
    return t;
  } else {
    return {
      default: t
    };
  }
}
function i(t, e) {
  if (!(t instanceof e)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
Object.defineProperty(exports, "__esModule", {
  value: true
});
var r = Object.assign || function (t) {
  for (var e = 1; e < arguments.length; e++) {
    var s = arguments[e];
    for (var n in s) {
      if (Object.prototype.hasOwnProperty.call(s, n)) {
        t[n] = s[n];
      }
    }
  }
  return t;
};
var o = function () {
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
var a = require("./2.js");
var u = n(a);
var l = function () {
  function t() {
    i(this, t);
  }
  o(t, [{
    key: "load",
    value: function (t, e, s) {
      if (typeof s == "string") {
        t.el = document.querySelector(s);
      } else {
        t.el = s;
      }
      t.options = r({}, u.default, e);
      t.isInput = t.el.tagName.toLowerCase() === "input";
      t.attr = t.options.attr;
      t.bindInputFocusEvents = t.options.bindInputFocusEvents;
      t.showCursor = !t.isInput && t.options.showCursor;
      t.cursorChar = t.options.cursorChar;
      t.cursorBlinking = true;
      t.elContent = t.attr ? t.el.getAttribute(t.attr) : t.el.textContent;
      t.contentType = t.options.contentType;
      t.typeSpeed = t.options.typeSpeed;
      t.startDelay = t.options.startDelay;
      t.backSpeed = t.options.backSpeed;
      t.smartBackspace = t.options.smartBackspace;
      t.backDelay = t.options.backDelay;
      t.fadeOut = t.options.fadeOut;
      t.fadeOutClass = t.options.fadeOutClass;
      t.fadeOutDelay = t.options.fadeOutDelay;
      t.isPaused = false;
      t.strings = t.options.strings.map(function (t) {
        return t.trim();
      });
      if (typeof t.options.stringsElement == "string") {
        t.stringsElement = document.querySelector(t.options.stringsElement);
      } else {
        t.stringsElement = t.options.stringsElement;
      }
      if (t.stringsElement) {
        t.strings = [];
        t.stringsElement.style.display = "none";
        var n = Array.prototype.slice.apply(t.stringsElement.children);
        var i = n.length;
        if (i) {
          for (var o = 0; o < i; o += 1) {
            var a = n[o];
            t.strings.push(a.innerHTML.trim());
          }
        }
      }
      t.strPos = 0;
      t.arrayPos = 0;
      t.stopNum = 0;
      t.loop = t.options.loop;
      t.loopCount = t.options.loopCount;
      t.curLoop = 0;
      t.shuffle = t.options.shuffle;
      t.sequence = [];
      t.pause = {
        status: false,
        typewrite: true,
        curString: "",
        curStrPos: 0
      };
      t.typingComplete = false;
      for (var o in t.strings) {
        t.sequence[o] = o;
      }
      t.currentElContent = this.getCurrentElContent(t);
      t.autoInsertCss = t.options.autoInsertCss;
      this.appendAnimationCss(t);
    }
  }, {
    key: "getCurrentElContent",
    value: function (t) {
      var e = "";
      return e = t.attr ? t.el.getAttribute(t.attr) : t.isInput ? t.el.value : t.contentType === "html" ? t.el.innerHTML : t.el.textContent;
    }
  }, {
    key: "appendAnimationCss",
    value: function (t) {
      var e = "data-typed-js-css";
      if (t.autoInsertCss && (t.showCursor || t.fadeOut) && !document.querySelector("[" + e + "]")) {
        var s = document.createElement("style");
        s.type = "text/css";
        s.setAttribute(e, true);
        var n = "";
        if (t.showCursor) {
          n += "\n        .typed-cursor{\n          opacity: 1;\n        }\n        .typed-cursor.typed-cursor--blink{\n          animation: typedjsBlink 0.7s infinite;\n          -webkit-animation: typedjsBlink 0.7s infinite;\n                  animation: typedjsBlink 0.7s infinite;\n        }\n        @keyframes typedjsBlink{\n          50% { opacity: 0.0; }\n        }\n        @-webkit-keyframes typedjsBlink{\n          0% { opacity: 1; }\n          50% { opacity: 0.0; }\n          100% { opacity: 1; }\n        }\n      ";
        }
        if (t.fadeOut) {
          n += "\n        .typed-fade-out{\n          opacity: 0;\n          transition: opacity .25s;\n        }\n        .typed-cursor.typed-cursor--blink.typed-fade-out{\n          -webkit-animation: 0;\n          animation: 0;\n        }\n      ";
        }
        if (s.length !== 0) {
          s.innerHTML = n;
          document.body.appendChild(s);
        }
      }
    }
  }]);
  return t;
}();
exports.default = l;
var c = new l();
exports.initializer = c;