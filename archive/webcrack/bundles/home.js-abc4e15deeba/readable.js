window.particlesJS.load("particles-js", "/assets/js/particles.min.json");
$(function () {
  $("#adjective").typed({
    strings: ["More Private.", "Uncensored.", "More Secure.", "Safer.", "Easier.", "More Fun."],
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 2000,
    loop: true
  });
});
(function (a) {
  "use strict";

  function b(b, c) {
    this.el = a(b);
    this.options = a.extend({}, a.fn.typed.defaults, c);
    this.isInput = this.el.is("input");
    this.attr = this.options.attr;
    this.showCursor = false;
    this.elContent = this.attr ? this.el.attr(this.attr) : this.el.text();
    this.contentType = this.options.contentType;
    this.typeSpeed = this.options.typeSpeed;
    this.startDelay = this.options.startDelay;
    this.backSpeed = this.options.backSpeed;
    this.backDelay = this.options.backDelay;
    this.stringsElement = this.options.stringsElement;
    this.strings = this.options.strings;
    this.strPos = 0;
    this.arrayPos = 0;
    this.stopNum = 0;
    this.loop = this.options.loop;
    this.loopCount = this.options.loopCount;
    this.curLoop = 0;
    this.stop = false;
    this.cursorChar = this.options.cursorChar;
    this.shuffle = this.options.shuffle;
    this.sequence = [];
    this.build();
  }
  b.prototype = {
    constructor: b,
    init: function () {
      var a = this;
      a.timeout = setTimeout(function () {
        for (var b = 0; b < a.strings.length; ++b) {
          a.sequence[b] = b;
        }
        if (a.shuffle) {
          a.sequence = a.shuffleArray(a.sequence);
        }
        a.typewrite(a.strings[a.sequence[a.arrayPos]], a.strPos);
      }, a.startDelay);
    },
    build: function () {
      var b = this;
      if (this.showCursor === true) {
        this.cursor = a("<span class=\"typed-cursor\">" + this.cursorChar + "</span>");
        this.el.after(this.cursor);
      }
      if (this.stringsElement) {
        this.strings = [];
        this.stringsElement.hide();
        console.log(this.stringsElement.children());
        var c = this.stringsElement.children();
        a.each(c, function (c, d) {
          b.strings.push(a(d).html());
        });
      }
      this.init();
    },
    typewrite: function (a, b) {
      if (this.stop !== true) {
        var c = this;
        c.timeout = setTimeout(function () {
          var d = 0;
          var e = a.substr(b);
          if (e.charAt(0) === "^") {
            var f = 1;
            if (/^\^\d+/.test(e)) {
              e = /\d+/.exec(e)[0];
              f += e.length;
              d = parseInt(e);
            }
            a = a.substring(0, b) + a.substring(b + f);
          }
          if (c.contentType === "html") {
            var g = a.substr(b).charAt(0);
            if (g === "<" || g === "&") {
              var h = "";
              var i = "";
              for (i = g === "<" ? ">" : ";"; a.substr(b + 1).charAt(0) !== i && (h += a.substr(b).charAt(0), b++, !(b + 1 > a.length)););
              b++;
              h += i;
            }
          }
          c.timeout = setTimeout(function () {
            if (b === a.length) {
              c.options.onStringTyped(c.arrayPos);
              if (c.arrayPos === c.strings.length - 1 && (c.options.callback(), c.curLoop++, c.loop === false || c.curLoop === c.loopCount)) {
                return;
              }
              c.timeout = setTimeout(function () {
                c.backspace(a, b);
              }, c.backDelay);
            } else {
              if (b === 0) {
                c.options.preStringTyped(c.arrayPos);
              }
              var d = a.substr(0, b + 1);
              if (c.attr) {
                c.el.attr(c.attr, d);
              } else if (c.isInput) {
                c.el.val(d);
              } else if (c.contentType === "html") {
                c.el.html(d);
              } else {
                c.el.text(d);
              }
              b++;
              c.typewrite(a, b);
            }
          }, d);
        }, this.typeSpeed);
      }
    },
    backspace: function (a, b) {
      if (this.stop !== true) {
        var c = this;
        c.timeout = setTimeout(function () {
          if (c.contentType === "html" && a.substr(b).charAt(0) === ">") {
            for (var d = ""; a.substr(b - 1).charAt(0) !== "<" && (d -= a.substr(b).charAt(0), b--, !(b < 0)););
            b--;
            d += "<";
          }
          var e = a.substr(0, b);
          if (c.attr) {
            c.el.attr(c.attr, e);
          } else if (c.isInput) {
            c.el.val(e);
          } else if (c.contentType === "html") {
            c.el.html(e);
          } else {
            c.el.text(e);
          }
          if (b > c.stopNum) {
            b--;
            c.backspace(a, b);
          } else if (b <= c.stopNum) {
            c.arrayPos++;
            if (c.arrayPos === c.strings.length) {
              c.arrayPos = 0;
              if (c.shuffle) {
                c.sequence = c.shuffleArray(c.sequence);
              }
              c.init();
            } else {
              c.typewrite(c.strings[c.sequence[c.arrayPos]], b);
            }
          }
        }, this.backSpeed);
      }
    },
    shuffleArray: function (a) {
      var b;
      var c;
      var d = a.length;
      if (d) {
        while (--d) {
          c = Math.floor(Math.random() * (d + 1));
          b = a[c];
          a[c] = a[d];
          a[d] = b;
        }
      }
      return a;
    },
    reset: function () {
      var a = this;
      clearInterval(a.timeout);
      this.el.attr("id");
      this.el.empty();
      if (typeof this.cursor != "undefined") {
        this.cursor.remove();
      }
      this.strPos = 0;
      this.arrayPos = 0;
      this.curLoop = 0;
      this.options.resetCallback();
    }
  };
  a.fn.typed = function (c) {
    return this.each(function () {
      var d = a(this);
      var e = d.data("typed");
      var f = typeof c == "object" && c;
      if (e) {
        e.reset();
      }
      d.data("typed", e = new b(this, f));
      if (typeof c == "string") {
        e[c]();
      }
    });
  };
  a.fn.typed.defaults = {
    strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
    stringsElement: null,
    typeSpeed: 0,
    startDelay: 0,
    backSpeed: 0,
    shuffle: false,
    backDelay: 500,
    loop: false,
    loopCount: false,
    showCursor: true,
    cursorChar: "|",
    attr: null,
    contentType: "html",
    callback: function () {},
    preStringTyped: function () {},
    onStringTyped: function () {},
    resetCallback: function () {}
  };
})(window.jQuery);