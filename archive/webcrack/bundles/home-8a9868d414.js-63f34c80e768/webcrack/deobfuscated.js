Object.deepExtend = function (e, a) {
  for (var t in a) {
    if (a[t] && a[t].constructor && a[t].constructor === Object) {
      e[t] = e[t] || {};
      arguments.callee(e[t], a[t]);
    } else {
      e[t] = a[t];
    }
  }
  return e;
};
"use strict";
var typed = (() => {
  return function (t) {
    function e(n) {
      if (s[n]) {
        return s[n].exports;
      }
      var i = s[n] = {
        exports: {},
        id: n,
        loaded: false
      };
      t[n].call(i.exports, i, i.exports, e);
      i.loaded = true;
      return i.exports;
    }
    var s = {};
    e.m = t;
    e.c = s;
    e.p = "";
    return e(0);
  }([function (t, e, s) {
    Object.defineProperty(e, "__esModule", {
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
    var r = s(1);
    var o = s(3);
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
    e.default = a;
    t.exports = e.default;
  }, function (t, e, s) {
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
    Object.defineProperty(e, "__esModule", {
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
    var a = s(2);
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
    e.default = l;
    var c = new l();
    e.initializer = c;
  }, function (t, e) {
    Object.defineProperty(e, "__esModule", {
      value: true
    });
    var s = {
      strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
      stringsElement: null,
      typeSpeed: 0,
      startDelay: 0,
      backSpeed: 0,
      smartBackspace: true,
      shuffle: false,
      backDelay: 700,
      fadeOut: false,
      fadeOutClass: "typed-fade-out",
      fadeOutDelay: 500,
      loop: false,
      loopCount: Infinity,
      showCursor: true,
      cursorChar: "|",
      autoInsertCss: true,
      attr: null,
      bindInputFocusEvents: false,
      contentType: "html",
      onBegin: function (t) {},
      onComplete: function (t) {},
      preStringTyped: function (t, e) {},
      onStringTyped: function (t, e) {},
      onLastStringBackspaced: function (t) {},
      onTypingPaused: function (t, e) {},
      onTypingResumed: function (t, e) {},
      onReset: function (t) {},
      onStop: function (t, e) {},
      onStart: function (t, e) {},
      onDestroy: function (t) {}
    };
    e.default = s;
    t.exports = e.default;
  }, function (t, e) {
    function s(t, e) {
      if (!(t instanceof e)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    Object.defineProperty(e, "__esModule", {
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
    e.default = i;
    var r = new i();
    e.htmlParser = r;
  }]);
})();
function hexToRgb(e) {
  e = e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (e, a, t, i) {
    return a + a + t + t + i + i;
  });
  var a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
  if (a) {
    return {
      r: parseInt(a[1], 16),
      g: parseInt(a[2], 16),
      b: parseInt(a[3], 16)
    };
  } else {
    return null;
  }
}
function clamp(e, a, t) {
  return Math.min(Math.max(e, a), t);
}
function isInArray(e, a) {
  return a.indexOf(e) > -1;
}
function pjs(e) {
  var a = document.querySelector("body > .particles");
  window.pJS = {
    canvas: {
      el: a,
      w: a.offsetWidth,
      h: a.offsetHeight
    },
    particles: {
      number: {
        value: 400,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#fff"
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#ff0000"
        },
        polygon: {
          nb_sides: 5
        },
        image: {
          src: "",
          width: 100,
          height: 100
        }
      },
      opacity: {
        value: 1,
        random: false,
        anim: {
          enable: false,
          speed: 2,
          opacity_min: 0,
          sync: false
        }
      },
      size: {
        value: 20,
        random: false,
        anim: {
          enable: false,
          speed: 20,
          size_min: 0,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 100,
        color: "#fff",
        opacity: 1,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 3000,
          rotateY: 3000
        }
      },
      array: []
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 100,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 200,
          size: 80,
          duration: 0.4
        },
        repulse: {
          distance: 200,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      },
      mouse: {}
    },
    retina_detect: false,
    fn: {
      interact: {},
      modes: {},
      vendors: {}
    },
    tmp: {}
  };
  var t = window.pJS;
  if (e) {
    Object.deepExtend(t, e);
  }
  t.tmp.obj = {
    size_value: t.particles.size.value,
    size_anim_speed: t.particles.size.anim.speed,
    move_speed: t.particles.move.speed,
    line_linked_distance: t.particles.line_linked.distance,
    line_linked_width: t.particles.line_linked.width,
    mode_grab_distance: t.interactivity.modes.grab.distance,
    mode_bubble_distance: t.interactivity.modes.bubble.distance,
    mode_bubble_size: t.interactivity.modes.bubble.size,
    mode_repulse_distance: t.interactivity.modes.repulse.distance
  };
  t.fn.retinaInit = function () {
    if (t.retina_detect && window.devicePixelRatio > 1) {
      t.canvas.pxratio = window.devicePixelRatio;
      t.tmp.retina = true;
    } else {
      t.canvas.pxratio = 1;
      t.tmp.retina = false;
    }
    t.canvas.w = t.canvas.el.offsetWidth * t.canvas.pxratio;
    t.canvas.h = t.canvas.el.offsetHeight * t.canvas.pxratio;
    t.particles.size.value = t.tmp.obj.size_value * t.canvas.pxratio;
    t.particles.size.anim.speed = t.tmp.obj.size_anim_speed * t.canvas.pxratio;
    t.particles.move.speed = t.tmp.obj.move_speed * t.canvas.pxratio;
    t.particles.line_linked.distance = t.tmp.obj.line_linked_distance * t.canvas.pxratio;
    t.interactivity.modes.grab.distance = t.tmp.obj.mode_grab_distance * t.canvas.pxratio;
    t.interactivity.modes.bubble.distance = t.tmp.obj.mode_bubble_distance * t.canvas.pxratio;
    t.particles.line_linked.width = t.tmp.obj.line_linked_width * t.canvas.pxratio;
    t.interactivity.modes.bubble.size = t.tmp.obj.mode_bubble_size * t.canvas.pxratio;
    t.interactivity.modes.repulse.distance = t.tmp.obj.mode_repulse_distance * t.canvas.pxratio;
  };
  t.fn.canvasInit = function () {
    t.canvas.ctx = t.canvas.el.getContext("2d");
  };
  t.fn.canvasSize = function () {
    t.canvas.el.width = t.canvas.w;
    t.canvas.el.height = t.canvas.h;
    if (t && t.interactivity.events.resize) {
      window.addEventListener("resize", function () {
        t.canvas.w = t.canvas.el.offsetWidth;
        t.canvas.h = t.canvas.el.offsetHeight;
        if (t.tmp.retina) {
          t.canvas.w *= t.canvas.pxratio;
          t.canvas.h *= t.canvas.pxratio;
        }
        t.canvas.el.width = t.canvas.w;
        t.canvas.el.height = t.canvas.h;
        if (!t.particles.move.enable) {
          t.fn.particlesEmpty();
          t.fn.particlesCreate();
          t.fn.particlesDraw();
          t.fn.vendors.densityAutoParticles();
        }
        t.fn.vendors.densityAutoParticles();
      });
    }
  };
  t.fn.canvasPaint = function () {
    t.canvas.ctx.fillRect(0, 0, t.canvas.w, t.canvas.h);
  };
  t.fn.canvasClear = function () {
    t.canvas.ctx.clearRect(0, 0, t.canvas.w, t.canvas.h);
  };
  t.fn.particle = function (e, a, i) {
    this.radius = (t.particles.size.random ? Math.random() : 1) * t.particles.size.value;
    if (t.particles.size.anim.enable) {
      this.size_status = false;
      this.vs = t.particles.size.anim.speed / 100;
      if (!t.particles.size.anim.sync) {
        this.vs = this.vs * Math.random();
      }
    }
    this.x = i ? i.x : Math.random() * t.canvas.w;
    this.y = i ? i.y : Math.random() * t.canvas.h;
    if (this.x > t.canvas.w - this.radius * 2) {
      this.x = this.x - this.radius;
    } else if (this.x < this.radius * 2) {
      this.x = this.x + this.radius;
    }
    if (this.y > t.canvas.h - this.radius * 2) {
      this.y = this.y - this.radius;
    } else if (this.y < this.radius * 2) {
      this.y = this.y + this.radius;
    }
    if (t.particles.move.bounce) {
      t.fn.vendors.checkOverlap(this, i);
    }
    this.color = {};
    if (typeof e.value == "object") {
      if (e.value instanceof Array) {
        var s = e.value[Math.floor(Math.random() * t.particles.color.value.length)];
        this.color.rgb = hexToRgb(s);
      } else {
        if (e.value.r != null && e.value.g != null && e.value.b != null) {
          this.color.rgb = {
            r: e.value.r,
            g: e.value.g,
            b: e.value.b
          };
        }
        if (e.value.h != null && e.value.s != null && e.value.l != null) {
          this.color.hsl = {
            h: e.value.h,
            s: e.value.s,
            l: e.value.l
          };
        }
      }
    } else if (e.value == "random") {
      this.color.rgb = {
        r: Math.floor(Math.random() * 256) + 0,
        g: Math.floor(Math.random() * 256) + 0,
        b: Math.floor(Math.random() * 256) + 0
      };
    } else if (typeof e.value == "string") {
      this.color = e;
      this.color.rgb = hexToRgb(this.color.value);
    }
    this.opacity = (t.particles.opacity.random ? Math.random() : 1) * t.particles.opacity.value;
    if (t.particles.opacity.anim.enable) {
      this.opacity_status = false;
      this.vo = t.particles.opacity.anim.speed / 100;
      if (!t.particles.opacity.anim.sync) {
        this.vo = this.vo * Math.random();
      }
    }
    var n = {};
    switch (t.particles.move.direction) {
      case "top":
        n = {
          x: 0,
          y: -1
        };
        break;
      case "top-right":
        n = {
          x: 0.5,
          y: -0.5
        };
        break;
      case "right":
        n = {
          x: 1,
          y: -0
        };
        break;
      case "bottom-right":
        n = {
          x: 0.5,
          y: 0.5
        };
        break;
      case "bottom":
        n = {
          x: 0,
          y: 1
        };
        break;
      case "bottom-left":
        n = {
          x: -0.5,
          y: 1
        };
        break;
      case "left":
        n = {
          x: -1,
          y: 0
        };
        break;
      case "top-left":
        n = {
          x: -0.5,
          y: -0.5
        };
        break;
      default:
        n = {
          x: 0,
          y: 0
        };
    }
    if (t.particles.move.straight) {
      this.vx = n.x;
      this.vy = n.y;
      if (t.particles.move.random) {
        this.vx = this.vx * Math.random();
        this.vy = this.vy * Math.random();
      }
    } else {
      this.vx = n.x + Math.random() - 0.5;
      this.vy = n.y + Math.random() - 0.5;
    }
    this.vx_i = this.vx;
    this.vy_i = this.vy;
    var r = t.particles.shape.type;
    if (typeof r == "object") {
      if (r instanceof Array) {
        var c = r[Math.floor(Math.random() * r.length)];
        this.shape = c;
      }
    } else {
      this.shape = r;
    }
    if (this.shape == "image") {
      var o = t.particles.shape;
      this.img = {
        src: o.image.src,
        ratio: o.image.width / o.image.height
      };
      this.img.ratio ||= 1;
      if (t.tmp.img_type == "svg" && t.tmp.source_svg != null) {
        t.fn.vendors.createSvgImg(this);
        if (t.tmp.pushing) {
          this.img.loaded = false;
        }
      }
    }
  };
  t.fn.particle.prototype.draw = function () {
    var e = this;
    if (e.radius_bubble != null) {
      var a = e.radius_bubble;
    } else {
      a = e.radius;
    }
    if (e.opacity_bubble != null) {
      var i = e.opacity_bubble;
    } else {
      i = e.opacity;
    }
    if (e.color.rgb) {
      var s = "rgba(" + e.color.rgb.r + "," + e.color.rgb.g + "," + e.color.rgb.b + "," + i + ")";
    } else {
      s = "hsla(" + e.color.hsl.h + "," + e.color.hsl.s + "%," + e.color.hsl.l + "%," + i + ")";
    }
    t.canvas.ctx.fillStyle = s;
    t.canvas.ctx.beginPath();
    switch (e.shape) {
      case "circle":
        t.canvas.ctx.arc(e.x, e.y, a, 0, Math.PI * 2, false);
        break;
      case "edge":
        t.canvas.ctx.rect(e.x - a, e.y - a, a * 2, a * 2);
        break;
      case "triangle":
        t.fn.vendors.drawShape(t.canvas.ctx, e.x - a, e.y + a / 1.66, a * 2, 3, 2);
        break;
      case "polygon":
        t.fn.vendors.drawShape(t.canvas.ctx, e.x - a / (t.particles.shape.polygon.nb_sides / 3.5), e.y - a / 0.76, a * 2.66 / (t.particles.shape.polygon.nb_sides / 3), t.particles.shape.polygon.nb_sides, 1);
        break;
      case "star":
        t.fn.vendors.drawShape(t.canvas.ctx, e.x - a * 2 / (t.particles.shape.polygon.nb_sides / 4), e.y - a / 1.52, a * 2 * 2.66 / (t.particles.shape.polygon.nb_sides / 3), t.particles.shape.polygon.nb_sides, 2);
        break;
      case "image":
        if (t.tmp.img_type == "svg") {
          var n = e.img.obj;
        } else {
          n = t.tmp.img_obj;
        }
        if (n) {
          t.canvas.ctx.drawImage(n, e.x - a, e.y - a, a * 2, a * 2 / e.img.ratio);
        }
    }
    t.canvas.ctx.closePath();
    if (t.particles.shape.stroke.width > 0) {
      t.canvas.ctx.strokeStyle = t.particles.shape.stroke.color;
      t.canvas.ctx.lineWidth = t.particles.shape.stroke.width;
      t.canvas.ctx.stroke();
    }
    t.canvas.ctx.fill();
  };
  t.fn.particlesCreate = function () {
    for (var e = 0; e < t.particles.number.value; e++) {
      t.particles.array.push(new t.fn.particle(t.particles.color, t.particles.opacity.value));
    }
  };
  t.fn.particlesUpdate = function () {
    for (var e = 0; e < t.particles.array.length; e++) {
      var a = t.particles.array[e];
      if (t.particles.move.enable) {
        var i = t.particles.move.speed / 2;
        a.x += a.vx * i;
        a.y += a.vy * i;
      }
      if (t.particles.opacity.anim.enable) {
        if (a.opacity_status == 1) {
          if (a.opacity >= t.particles.opacity.value) {
            a.opacity_status = false;
          }
          a.opacity += a.vo;
        } else {
          if (a.opacity <= t.particles.opacity.anim.opacity_min) {
            a.opacity_status = true;
          }
          a.opacity -= a.vo;
        }
        if (a.opacity < 0) {
          a.opacity = 0;
        }
      }
      if (t.particles.size.anim.enable) {
        if (a.size_status == 1) {
          if (a.radius >= t.particles.size.value) {
            a.size_status = false;
          }
          a.radius += a.vs;
        } else {
          if (a.radius <= t.particles.size.anim.size_min) {
            a.size_status = true;
          }
          a.radius -= a.vs;
        }
        if (a.radius < 0) {
          a.radius = 0;
        }
      }
      if (t.particles.move.out_mode == "bounce") {
        var s = {
          x_left: a.radius,
          x_right: t.canvas.w,
          y_top: a.radius,
          y_bottom: t.canvas.h
        };
      } else {
        s = {
          x_left: -a.radius,
          x_right: t.canvas.w + a.radius,
          y_top: -a.radius,
          y_bottom: t.canvas.h + a.radius
        };
      }
      if (a.x - a.radius > t.canvas.w) {
        a.x = s.x_left;
        a.y = Math.random() * t.canvas.h;
      } else if (a.x + a.radius < 0) {
        a.x = s.x_right;
        a.y = Math.random() * t.canvas.h;
      }
      if (a.y - a.radius > t.canvas.h) {
        a.y = s.y_top;
        a.x = Math.random() * t.canvas.w;
      } else if (a.y + a.radius < 0) {
        a.y = s.y_bottom;
        a.x = Math.random() * t.canvas.w;
      }
      switch (t.particles.move.out_mode) {
        case "bounce":
          if (a.x + a.radius > t.canvas.w) {
            a.vx = -a.vx;
          } else if (a.x - a.radius < 0) {
            a.vx = -a.vx;
          }
          if (a.y + a.radius > t.canvas.h) {
            a.vy = -a.vy;
          } else if (a.y - a.radius < 0) {
            a.vy = -a.vy;
          }
      }
      if (isInArray("grab", t.interactivity.events.onhover.mode)) {
        t.fn.modes.grabParticle(a);
      }
      if (isInArray("bubble", t.interactivity.events.onhover.mode) || isInArray("bubble", t.interactivity.events.onclick.mode)) {
        t.fn.modes.bubbleParticle(a);
      }
      if (isInArray("repulse", t.interactivity.events.onhover.mode) || isInArray("repulse", t.interactivity.events.onclick.mode)) {
        t.fn.modes.repulseParticle(a);
      }
      if (t.particles.line_linked.enable || t.particles.move.attract.enable) {
        for (var n = e + 1; n < t.particles.array.length; n++) {
          var r = t.particles.array[n];
          if (t.particles.line_linked.enable) {
            t.fn.interact.linkParticles(a, r);
          }
          if (t.particles.move.attract.enable) {
            t.fn.interact.attractParticles(a, r);
          }
          if (t.particles.move.bounce) {
            t.fn.interact.bounceParticles(a, r);
          }
        }
      }
    }
  };
  t.fn.particlesDraw = function () {
    t.canvas.ctx.clearRect(0, 0, t.canvas.w, t.canvas.h);
    t.fn.particlesUpdate();
    for (var e = 0; e < t.particles.array.length; e++) {
      t.particles.array[e].draw();
    }
  };
  t.fn.particlesEmpty = function () {
    t.particles.array = [];
  };
  t.fn.particlesRefresh = function () {
    cancelRequestAnimFrame(t.fn.checkAnimFrame);
    cancelRequestAnimFrame(t.fn.drawAnimFrame);
    t.tmp.source_svg = undefined;
    t.tmp.img_obj = undefined;
    t.tmp.count_svg = 0;
    t.fn.particlesEmpty();
    t.fn.canvasClear();
    t.fn.vendors.start();
  };
  t.fn.interact.linkParticles = function (e, a) {
    var i = e.x - a.x;
    var s = e.y - a.y;
    var n = Math.sqrt(i * i + s * s);
    if (n <= t.particles.line_linked.distance) {
      var r = t.particles.line_linked.opacity - n / (1 / t.particles.line_linked.opacity) / t.particles.line_linked.distance;
      if (r > 0) {
        var c = t.particles.line_linked.color_rgb_line;
        t.canvas.ctx.strokeStyle = "rgba(" + c.r + "," + c.g + "," + c.b + "," + r + ")";
        t.canvas.ctx.lineWidth = t.particles.line_linked.width;
        t.canvas.ctx.beginPath();
        t.canvas.ctx.moveTo(e.x, e.y);
        t.canvas.ctx.lineTo(a.x, a.y);
        t.canvas.ctx.stroke();
        t.canvas.ctx.closePath();
      }
    }
  };
  t.fn.interact.attractParticles = function (e, a) {
    var i = e.x - a.x;
    var s = e.y - a.y;
    if (Math.sqrt(i * i + s * s) <= t.particles.line_linked.distance) {
      var n = i / (t.particles.move.attract.rotateX * 1000);
      var r = s / (t.particles.move.attract.rotateY * 1000);
      e.vx -= n;
      e.vy -= r;
      a.vx += n;
      a.vy += r;
    }
  };
  t.fn.interact.bounceParticles = function (e, a) {
    var t = e.x - a.x;
    var i = e.y - a.y;
    var s = Math.sqrt(t * t + i * i);
    if (e.radius + a.radius >= s) {
      e.vx = -e.vx;
      e.vy = -e.vy;
      a.vx = -a.vx;
      a.vy = -a.vy;
    }
  };
  t.fn.modes.pushParticles = function (e, a) {
    t.tmp.pushing = true;
    for (var i = 0; e > i; i++) {
      t.particles.array.push(new t.fn.particle(t.particles.color, t.particles.opacity.value, {
        x: a ? a.pos_x : Math.random() * t.canvas.w,
        y: a ? a.pos_y : Math.random() * t.canvas.h
      }));
      if (i == e - 1) {
        if (!t.particles.move.enable) {
          t.fn.particlesDraw();
        }
        t.tmp.pushing = false;
      }
    }
  };
  t.fn.modes.removeParticles = function (e) {
    t.particles.array.splice(0, e);
    if (!t.particles.move.enable) {
      t.fn.particlesDraw();
    }
  };
  t.fn.modes.bubbleParticle = function (e) {
    function a() {
      e.opacity_bubble = e.opacity;
      e.radius_bubble = e.radius;
    }
    function i(a, i, s, n, r) {
      if (a != i) {
        if (t.tmp.bubble_duration_end) {
          if (s != null) {
            o = a + (a - (n - p * (n - a) / t.interactivity.modes.bubble.duration));
            if (r == "size") {
              e.radius_bubble = o;
            }
            if (r == "opacity") {
              e.opacity_bubble = o;
            }
          }
        } else if (v <= t.interactivity.modes.bubble.distance) {
          if (s != null) {
            var c = s;
          } else {
            c = n;
          }
          if (c != a) {
            var o = n - p * (n - a) / t.interactivity.modes.bubble.duration;
            if (r == "size") {
              e.radius_bubble = o;
            }
            if (r == "opacity") {
              e.opacity_bubble = o;
            }
          }
        } else {
          if (r == "size") {
            e.radius_bubble = undefined;
          }
          if (r == "opacity") {
            e.opacity_bubble = undefined;
          }
        }
      }
    }
    if (t.interactivity.events.onclick.enable && isInArray("bubble", t.interactivity.events.onclick.mode)) {
      if (t.tmp.bubble_clicking) {
        i(t.interactivity.modes.bubble.size, t.particles.size.value, e.radius_bubble, e.radius, "size");
        i(t.interactivity.modes.bubble.opacity, t.particles.opacity.value, e.opacity_bubble, e.opacity, "opacity");
      }
    }
  };
  t.fn.modes.repulseParticle = function (e) {
    if (t.interactivity.events.onhover.enable && isInArray("repulse", t.interactivity.events.onhover.mode) && t.interactivity.status == "mousemove") {
      var a = e.x - t.interactivity.mouse.pos_x;
      var i = e.y - t.interactivity.mouse.pos_y;
      var s = Math.sqrt(a * a + i * i);
      var n = {
        x: a / s,
        y: i / s
      };
      var r = clamp(1 / (o = t.interactivity.modes.repulse.distance) * (Math.pow(s / o, 2) * -1 + 1) * o * 100, 0, 50);
      var c = {
        x: e.x + n.x * r,
        y: e.y + n.y * r
      };
      if (t.particles.move.out_mode == "bounce") {
        if (c.x - e.radius > 0 && c.x + e.radius < t.canvas.w) {
          e.x = c.x;
        }
        if (c.y - e.radius > 0 && c.y + e.radius < t.canvas.h) {
          e.y = c.y;
        }
      } else {
        e.x = c.x;
        e.y = c.y;
      }
    } else if (t.interactivity.events.onclick.enable && isInArray("repulse", t.interactivity.events.onclick.mode)) {
      if (!t.tmp.repulse_finish) {
        t.tmp.repulse_count++;
        if (t.tmp.repulse_count == t.particles.array.length) {
          t.tmp.repulse_finish = true;
        }
      }
      if (t.tmp.repulse_clicking) {
        var o = Math.pow(t.interactivity.modes.repulse.distance / 6, 3);
        var l = t.interactivity.mouse.click_pos_x - e.x;
        var v = t.interactivity.mouse.click_pos_y - e.y;
        var p = l * l + v * v;
        var m = -o / p * 1;
        if (o >= p) {
          (function () {
            var a = Math.atan2(v, l);
            e.vx = m * Math.cos(a);
            e.vy = m * Math.sin(a);
            if (t.particles.move.out_mode == "bounce") {
              var i = {
                x: e.x + e.vx,
                y: e.y + e.vy
              };
              if (i.x + e.radius > t.canvas.w) {
                e.vx = -e.vx;
              } else if (i.x - e.radius < 0) {
                e.vx = -e.vx;
              }
              if (i.y + e.radius > t.canvas.h) {
                e.vy = -e.vy;
              } else if (i.y - e.radius < 0) {
                e.vy = -e.vy;
              }
            }
          })();
        }
      } else if (t.tmp.repulse_clicking == 0) {
        e.vx = e.vx_i;
        e.vy = e.vy_i;
      }
    }
  };
  t.fn.modes.grabParticle = function (e) {
    if (t.interactivity.events.onhover.enable && t.interactivity.status == "mousemove") {
      var a = e.x - t.interactivity.mouse.pos_x;
      var i = e.y - t.interactivity.mouse.pos_y;
      var s = Math.sqrt(a * a + i * i);
      if (s <= t.interactivity.modes.grab.distance) {
        var n = t.interactivity.modes.grab.line_linked.opacity - s / (1 / t.interactivity.modes.grab.line_linked.opacity) / t.interactivity.modes.grab.distance;
        if (n > 0) {
          var r = t.particles.line_linked.color_rgb_line;
          t.canvas.ctx.strokeStyle = "rgba(" + r.r + "," + r.g + "," + r.b + "," + n + ")";
          t.canvas.ctx.lineWidth = t.particles.line_linked.width;
          t.canvas.ctx.beginPath();
          t.canvas.ctx.moveTo(e.x, e.y);
          t.canvas.ctx.lineTo(t.interactivity.mouse.pos_x, t.interactivity.mouse.pos_y);
          t.canvas.ctx.stroke();
          t.canvas.ctx.closePath();
        }
      }
    }
  };
  t.fn.vendors.eventsListeners = function () {
    if (t.interactivity.detect_on == "window") {
      t.interactivity.el = window;
    } else {
      t.interactivity.el = t.canvas.el;
    }
    if (t.interactivity.events.onhover.enable || t.interactivity.events.onclick.enable) {
      t.interactivity.el.addEventListener("mousemove", function (e) {
        if (t.interactivity.el == window) {
          var a = e.clientX;
          var i = e.clientY;
        } else {
          a = e.offsetX || e.clientX;
          i = e.offsetY || e.clientY;
        }
        t.interactivity.mouse.pos_x = a;
        t.interactivity.mouse.pos_y = i;
        if (t.tmp.retina) {
          t.interactivity.mouse.pos_x *= t.canvas.pxratio;
          t.interactivity.mouse.pos_y *= t.canvas.pxratio;
        }
        t.interactivity.status = "mousemove";
      });
      t.interactivity.el.addEventListener("mouseleave", function (e) {
        t.interactivity.mouse.pos_x = null;
        t.interactivity.mouse.pos_y = null;
        t.interactivity.status = "mouseleave";
      });
    }
    if (t.interactivity.events.onclick.enable) {
      t.interactivity.el.addEventListener("click", function () {
        t.interactivity.mouse.click_pos_x = t.interactivity.mouse.pos_x;
        t.interactivity.mouse.click_pos_y = t.interactivity.mouse.pos_y;
        t.interactivity.mouse.click_time = new Date().getTime();
        if (t.interactivity.events.onclick.enable) {
          switch (t.interactivity.events.onclick.mode) {
            case "push":
              if (t.particles.move.enable) {
                t.fn.modes.pushParticles(t.interactivity.modes.push.particles_nb, t.interactivity.mouse);
              } else if (t.interactivity.modes.push.particles_nb == 1) {
                t.fn.modes.pushParticles(t.interactivity.modes.push.particles_nb, t.interactivity.mouse);
              } else if (t.interactivity.modes.push.particles_nb > 1) {
                t.fn.modes.pushParticles(t.interactivity.modes.push.particles_nb);
              }
              break;
            case "remove":
              t.fn.modes.removeParticles(t.interactivity.modes.remove.particles_nb);
              break;
            case "bubble":
              t.tmp.bubble_clicking = true;
              break;
            case "repulse":
              t.tmp.repulse_clicking = true;
              t.tmp.repulse_count = 0;
              t.tmp.repulse_finish = false;
              setTimeout(function () {
                t.tmp.repulse_clicking = false;
              }, t.interactivity.modes.repulse.duration * 1000);
          }
        }
      });
    }
  };
  t.fn.vendors.densityAutoParticles = function () {
    if (t.particles.number.density.enable) {
      var e = t.canvas.el.width * t.canvas.el.height / 1000;
      if (t.tmp.retina) {
        e /= t.canvas.pxratio * 2;
      }
      var a = e * t.particles.number.value / t.particles.number.density.value_area;
      var i = t.particles.array.length - a;
      if (i < 0) {
        t.fn.modes.pushParticles(Math.abs(i));
      } else {
        t.fn.modes.removeParticles(i);
      }
    }
  };
  t.fn.vendors.checkOverlap = function (e, a) {
    for (var i = 0; i < t.particles.array.length; i++) {
      var s = t.particles.array[i];
      var n = e.x - s.x;
      var r = e.y - s.y;
      if (Math.sqrt(n * n + r * r) <= e.radius + s.radius) {
        e.x = a ? a.x : Math.random() * t.canvas.w;
        e.y = a ? a.y : Math.random() * t.canvas.h;
        t.fn.vendors.checkOverlap(e);
      }
    }
  };
  t.fn.vendors.createSvgImg = function (e) {
    var a = t.tmp.source_svg.replace(/#([0-9A-F]{3,6})/gi, function (a, t, i, s) {
      if (e.color.rgb) {
        var n = "rgba(" + e.color.rgb.r + "," + e.color.rgb.g + "," + e.color.rgb.b + "," + e.opacity + ")";
      } else {
        n = "hsla(" + e.color.hsl.h + "," + e.color.hsl.s + "%," + e.color.hsl.l + "%," + e.opacity + ")";
      }
      return n;
    });
    var i = new Blob([a], {
      type: "image/svg+xml;charset=utf-8"
    });
    var s = window.URL || window.webkitURL || window;
    var n = s.createObjectURL(i);
    var r = new Image();
    r.addEventListener("load", function () {
      e.img.obj = r;
      e.img.loaded = true;
      s.revokeObjectURL(n);
      t.tmp.count_svg++;
    });
    r.src = n;
  };
  t.fn.vendors.drawShape = function (e, a, t, i, s, n) {
    var r = s * n;
    var c = s / n;
    var o = (c - 2) * 180 / c;
    var l = Math.PI - Math.PI * o / 180;
    e.save();
    e.beginPath();
    e.translate(a, t);
    e.moveTo(0, 0);
    for (var v = 0; r > v; v++) {
      e.lineTo(i, 0);
      e.translate(i, 0);
      e.rotate(l);
    }
    e.fill();
    e.restore();
  };
  t.fn.vendors.exportImg = function () {
    window.open(t.canvas.el.toDataURL("image/png"), "_blank");
  };
  t.fn.vendors.loadImg = function (e) {
    t.tmp.img_error = undefined;
    if (t.particles.shape.image.src != "") {
      if (e == "svg") {
        var a = new XMLHttpRequest();
        a.open("GET", t.particles.shape.image.src);
        a.onreadystatechange = function (e) {
          if (a.readyState == 4) {
            if (a.status == 200) {
              t.tmp.source_svg = e.currentTarget.response;
              t.fn.vendors.checkBeforeDraw();
            } else {
              console.log("Error pJS - Image not found");
              t.tmp.img_error = true;
            }
          }
        };
        a.send();
      } else {
        var i = new Image();
        i.addEventListener("load", function () {
          t.tmp.img_obj = i;
          t.fn.vendors.checkBeforeDraw();
        });
        i.src = t.particles.shape.image.src;
      }
    } else {
      console.log("Error pJS - No image.src");
      t.tmp.img_error = true;
    }
  };
  t.fn.vendors.draw = function () {
    if (t.particles.shape.type == "image") {
      if (t.tmp.img_type == "svg") {
        if (t.tmp.count_svg >= t.particles.number.value) {
          t.fn.particlesDraw();
          if (t.particles.move.enable) {
            t.fn.drawAnimFrame = requestAnimFrame(t.fn.vendors.draw);
          } else {
            cancelRequestAnimFrame(t.fn.drawAnimFrame);
          }
        } else if (!t.tmp.img_error) {
          t.fn.drawAnimFrame = requestAnimFrame(t.fn.vendors.draw);
        }
      } else if (t.tmp.img_obj != null) {
        t.fn.particlesDraw();
        if (t.particles.move.enable) {
          t.fn.drawAnimFrame = requestAnimFrame(t.fn.vendors.draw);
        } else {
          cancelRequestAnimFrame(t.fn.drawAnimFrame);
        }
      } else if (!t.tmp.img_error) {
        t.fn.drawAnimFrame = requestAnimFrame(t.fn.vendors.draw);
      }
    } else {
      t.fn.particlesDraw();
      if (t.particles.move.enable) {
        t.fn.drawAnimFrame = requestAnimFrame(t.fn.vendors.draw);
      } else {
        cancelRequestAnimFrame(t.fn.drawAnimFrame);
      }
    }
  };
  t.fn.vendors.checkBeforeDraw = function () {
    if (t.particles.shape.type == "image") {
      if (t.tmp.img_type == "svg" && t.tmp.source_svg == null) {
        t.tmp.checkAnimFrame = requestAnimFrame(check);
      } else {
        cancelRequestAnimFrame(t.tmp.checkAnimFrame);
        if (!t.tmp.img_error) {
          t.fn.vendors.init();
          t.fn.vendors.draw();
        }
      }
    } else {
      t.fn.vendors.init();
      t.fn.vendors.draw();
    }
  };
  t.fn.vendors.init = function () {
    t.fn.retinaInit();
    t.fn.canvasInit();
    t.fn.canvasSize();
    t.fn.canvasPaint();
    t.fn.particlesCreate();
    t.fn.vendors.densityAutoParticles();
    t.particles.line_linked.color_rgb_line = hexToRgb(t.particles.line_linked.color);
  };
  t.fn.vendors.start = function () {
    if (isInArray("image", t.particles.shape.type)) {
      t.tmp.img_type = t.particles.shape.image.src.substr(t.particles.shape.image.src.length - 3);
      t.fn.vendors.loadImg(t.tmp.img_type);
    } else {
      t.fn.vendors.checkBeforeDraw();
    }
  };
  t.fn.vendors.eventsListeners();
  t.fn.vendors.start();
}
window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (e) {
  window.setTimeout(e, 1000 / 60);
};
window.cancelRequestAnimFrame = window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout;
pjs({
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 1500
      }
    },
    color: {
      value: "#25414a"
    },
    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#000000"
      },
      polygon: {
        nb_sides: 5
      }
    },
    opacity: {
      value: 1,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 2,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#25414a",
      opacity: 1,
      width: 1
    },
    move: {
      enable: true,
      speed: 0.75,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: false,
        mode: "repulse"
      },
      onclick: {
        enable: false,
        mode: "push"
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1
        }
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 200
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true,
  config_demo: {
    hide_card: false,
    background_color: "#020E12",
    background_image: "",
    background_position: "50% 50%",
    background_repeat: "no-repeat",
    background_size: "cover"
  }
});
new typed(".adjective", {
  strings: ["More Private.", "Uncensored.", "More Secure.", "Safer.", "Easier.", "More Fun."],
  typeSpeed: 50,
  backSpeed: 25,
  backDelay: 2000,
  loop: true,
  showCursor: false
});