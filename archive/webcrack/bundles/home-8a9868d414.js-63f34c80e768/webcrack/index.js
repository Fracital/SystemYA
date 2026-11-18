Object.defineProperty(exports, "__esModule", {
  value: true
});
var i = function () {
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
var r = require("./1.js");
var o = require("./3.js");
var a = function () {
  function t(e, s) {
    r.initializer.load(this, s, e);
    this.begin();
  }
  i(t, [{
    key: "toggle",
    value: function () {
      if (this.pause.status) {
        this.start();
      } else {
        this.stop();
      }
    }
  }, {
    key: "stop",
    value: function () {
      if (!this.typingComplete && !this.pause.status) {
        this.toggleBlinking(true);
        this.pause.status = true;
        this.options.onStop(this.arrayPos, this);
      }
    }
  }, {
    key: "start",
    value: function () {
      if (!this.typingComplete) {
        if (this.pause.status) {
          this.pause.status = false;
          if (this.pause.typewrite) {
            this.typewrite(this.pause.curString, this.pause.curStrPos);
          } else {
            this.backspace(this.pause.curString, this.pause.curStrPos);
          }
          this.options.onStart(this.arrayPos, this);
        }
      }
    }
  }, {
    key: "destroy",
    value: function () {
      this.reset(false);
      this.options.onDestroy(this);
    }
  }, {
    key: "reset",
    value: function (t = true) {
      clearInterval(this.timeout);
      this.replaceText("");
      if (this.cursor && this.cursor.parentNode) {
        this.cursor.parentNode.removeChild(this.cursor);
        this.cursor = null;
      }
      this.strPos = 0;
      this.arrayPos = 0;
      this.curLoop = 0;
      if (t) {
        this.insertCursor();
        this.options.onReset(this);
        this.begin();
      }
    }
  }, {
    key: "begin",
    value: function () {
      var t = this;
      this.options.onBegin(this);
      this.typingComplete = false;
      this.shuffleStringsIfNeeded(this);
      this.insertCursor();
      if (this.bindInputFocusEvents) {
        this.bindFocusEvents();
      }
      this.timeout = setTimeout(function () {
        if (t.currentElContent && t.currentElContent.length !== 0) {
          t.backspace(t.currentElContent, t.currentElContent.length);
        } else {
          t.typewrite(t.strings[t.sequence[t.arrayPos]], t.strPos);
        }
      }, this.startDelay);
    }
  }, {
    key: "typewrite",
    value: function (t, e) {
      var s = this;
      if (this.fadeOut && this.el.classList.contains(this.fadeOutClass)) {
        this.el.classList.remove(this.fadeOutClass);
        if (this.cursor) {
          this.cursor.classList.remove(this.fadeOutClass);
        }
      }
      var n = this.humanizer(this.typeSpeed);
      var i = 1;
      if (this.pause.status === true) {
        this.setPauseStatus(t, e, true);
        return;
      } else {
        this.timeout = setTimeout(function () {
          e = o.htmlParser.typeHtmlChars(t, e, s);
          var n = 0;
          var r = t.substr(e);
          if (r.charAt(0) === "^" && /^\^\d+/.test(r)) {
            var a = 1;
            r = /\d+/.exec(r)[0];
            a += r.length;
            n = parseInt(r);
            s.temporaryPause = true;
            s.options.onTypingPaused(s.arrayPos, s);
            t = t.substring(0, e) + t.substring(e + a);
            s.toggleBlinking(true);
          }
          if (r.charAt(0) === "`") {
            while (t.substr(e + i).charAt(0) !== "`" && (i++, !(e + i > t.length)));
            var u = t.substring(0, e);
            var l = t.substring(u.length + 1, e + i);
            var c = t.substring(e + i + 1);
            t = u + l + c;
            i--;
          }
          s.timeout = setTimeout(function () {
            s.toggleBlinking(false);
            if (e >= t.length) {
              s.doneTyping(t, e);
            } else {
              s.keepTyping(t, e, i);
            }
            if (s.temporaryPause) {
              s.temporaryPause = false;
              s.options.onTypingResumed(s.arrayPos, s);
            }
          }, n);
        }, n);
        return;
      }
    }
  }, {
    key: "keepTyping",
    value: function (t, e, s) {
      if (e === 0) {
        this.toggleBlinking(false);
        this.options.preStringTyped(this.arrayPos, this);
      }
      e += s;
      var n = t.substr(0, e);
      this.replaceText(n);
      this.typewrite(t, e);
    }
  }, {
    key: "doneTyping",
    value: function (t, e) {
      var s = this;
      this.options.onStringTyped(this.arrayPos, this);
      this.toggleBlinking(true);
      if (this.arrayPos !== this.strings.length - 1 || !(this.complete(), this.loop === false || this.curLoop === this.loopCount)) {
        this.timeout = setTimeout(function () {
          s.backspace(t, e);
        }, this.backDelay);
      }
    }
  }, {
    key: "backspace",
    value: function (t, e) {
      var s = this;
      if (this.pause.status === true) {
        this.setPauseStatus(t, e, true);
        return;
      }
      if (this.fadeOut) {
        return this.initFadeOut();
      }
      this.toggleBlinking(false);
      var n = this.humanizer(this.backSpeed);
      this.timeout = setTimeout(function () {
        e = o.htmlParser.backSpaceHtmlChars(t, e, s);
        var n = t.substr(0, e);
        s.replaceText(n);
        if (s.smartBackspace) {
          var i = s.strings[s.arrayPos + 1];
          if (i && n === i.substr(0, e)) {
            s.stopNum = e;
          } else {
            s.stopNum = 0;
          }
        }
        if (e > s.stopNum) {
          e--;
          s.backspace(t, e);
        } else if (e <= s.stopNum) {
          s.arrayPos++;
          if (s.arrayPos === s.strings.length) {
            s.arrayPos = 0;
            s.options.onLastStringBackspaced();
            s.shuffleStringsIfNeeded();
            s.begin();
          } else {
            s.typewrite(s.strings[s.sequence[s.arrayPos]], e);
          }
        }
      }, n);
    }
  }, {
    key: "complete",
    value: function () {
      this.options.onComplete(this);
      if (this.loop) {
        this.curLoop++;
      } else {
        this.typingComplete = true;
      }
    }
  }, {
    key: "setPauseStatus",
    value: function (t, e, s) {
      this.pause.typewrite = s;
      this.pause.curString = t;
      this.pause.curStrPos = e;
    }
  }, {
    key: "toggleBlinking",
    value: function (t) {
      if (this.cursor) {
        if (!this.pause.status) {
          if (this.cursorBlinking !== t) {
            this.cursorBlinking = t;
            if (t) {
              this.cursor.classList.add("typed-cursor--blink");
            } else {
              this.cursor.classList.remove("typed-cursor--blink");
            }
          }
        }
      }
    }
  }, {
    key: "humanizer",
    value: function (t) {
      return Math.round(Math.random() * t / 2) + t;
    }
  }, {
    key: "shuffleStringsIfNeeded",
    value: function () {
      if (this.shuffle) {
        this.sequence = this.sequence.sort(function () {
          return Math.random() - 0.5;
        });
      }
    }
  }, {
    key: "initFadeOut",
    value: function () {
      var t = this;
      this.el.className += " " + this.fadeOutClass;
      if (this.cursor) {
        this.cursor.className += " " + this.fadeOutClass;
      }
      return setTimeout(function () {
        t.arrayPos++;
        t.replaceText("");
        if (t.strings.length > t.arrayPos) {
          t.typewrite(t.strings[t.sequence[t.arrayPos]], 0);
        } else {
          t.typewrite(t.strings[0], 0);
          t.arrayPos = 0;
        }
      }, this.fadeOutDelay);
    }
  }, {
    key: "replaceText",
    value: function (t) {
      if (this.attr) {
        this.el.setAttribute(this.attr, t);
      } else if (this.isInput) {
        this.el.value = t;
      } else if (this.contentType === "html") {
        this.el.innerHTML = t;
      } else {
        this.el.textContent = t;
      }
    }
  }, {
    key: "bindFocusEvents",
    value: function () {
      var t = this;
      if (this.isInput) {
        this.el.addEventListener("focus", function (e) {
          t.stop();
        });
        this.el.addEventListener("blur", function (e) {
          if (!t.el.value || t.el.value.length === 0) {
            t.start();
          }
        });
      }
    }
  }, {
    key: "insertCursor",
    value: function () {
      if (this.showCursor) {
        if (!this.cursor) {
          this.cursor = document.createElement("span");
          this.cursor.className = "typed-cursor";
          this.cursor.innerHTML = this.cursorChar;
          if (this.el.parentNode) {
            this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling);
          }
        }
      }
    }
  }]);
  return t;
}();
exports.default = a;
module.exports = exports.default;