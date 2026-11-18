flarum.core = function (t) {
  var e = {};
  function n(i) {
    if (e[i]) {
      return e[i].exports;
    }
    var r = e[i] = {
      i: i,
      l: false,
      exports: {}
    };
    t[i].call(r.exports, r, r.exports, n);
    r.l = true;
    return r.exports;
  }
  n.m = t;
  n.c = e;
  n.d = function (t, e, i) {
    if (!n.o(t, e)) {
      Object.defineProperty(t, e, {
        enumerable: true,
        get: i
      });
    }
  };
  n.r = function (t) {
    if (typeof Symbol != "undefined" && Symbol.toStringTag) {
      Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(t, "__esModule", {
      value: true
    });
  };
  n.t = function (t, e) {
    if (e & 1) {
      t = n(t);
    }
    if (e & 8) {
      return t;
    }
    if (e & 4 && typeof t == "object" && t && t.__esModule) {
      return t;
    }
    var i = Object.create(null);
    n.r(i);
    Object.defineProperty(i, "default", {
      enumerable: true,
      value: t
    });
    if (e & 2 && typeof t != "string") {
      for (var r in t) {
        n.d(i, r, function (e) {
          return t[e];
        }.bind(null, r));
      }
    }
    return i;
  };
  n.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    n.d(e, "a", e);
    return e;
  };
  n.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  };
  n.p = "";
  return n(n.s = 151);
}([function (t, e, n) {
  "use strict";

  function i(t, e) {
    return (i = Object.setPrototypeOf || function (t, e) {
      t.__proto__ = e;
      return t;
    })(t, e);
  }
  function r(t, e) {
    t.prototype = Object.create(e.prototype);
    t.prototype.constructor = t;
    i(t, e);
  }
  n.d(e, "a", function () {
    return r;
  });
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return i;
  });
  var i = function () {
    function t(t = {}, e = null) {
      this.data = t;
      this.freshness = new Date();
      this.exists = false;
      this.store = e;
    }
    var e = t.prototype;
    e.id = function () {
      return this.data.id;
    };
    e.attribute = function (t) {
      return this.data.attributes[t];
    };
    e.pushData = function (e) {
      for (var n in e) {
        if (typeof e[n] == "object") {
          this.data[n] = this.data[n] || {};
          for (var i in e[n]) {
            if (e[n][i] instanceof t) {
              e[n][i] = {
                data: t.getIdentifier(e[n][i])
              };
            }
            this.data[n][i] = e[n][i];
          }
        } else {
          this.data[n] = e[n];
        }
      }
      this.freshness = new Date();
    };
    e.pushAttributes = function (t) {
      this.pushData({
        attributes: t
      });
    };
    e.save = function (e, n) {
      var i = this;
      if (n === undefined) {
        n = {};
      }
      var r = {
        type: this.data.type,
        id: this.data.id,
        attributes: e
      };
      if (e.relationships) {
        r.relationships = {};
        for (var o in e.relationships) {
          var s = e.relationships[o];
          r.relationships[o] = {
            data: s instanceof Array ? s.map(t.getIdentifier) : t.getIdentifier(s)
          };
        }
        delete e.relationships;
      }
      var a = this.copyData();
      this.pushData(r);
      var c = {
        data: r
      };
      if (n.meta) {
        c.meta = n.meta;
      }
      return app.request(Object.assign({
        method: this.exists ? "PATCH" : "POST",
        url: app.forum.attribute("apiUrl") + this.apiEndpoint(),
        body: c
      }, n)).then(function (t) {
        i.store.data[t.data.type] = i.store.data[t.data.type] || {};
        i.store.data[t.data.type][t.data.id] = i;
        return i.store.pushPayload(t);
      }, function (t) {
        i.pushData(a);
        m.redraw();
        throw t;
      });
    };
    e.delete = function (t, e) {
      var n = this;
      if (e === undefined) {
        e = {};
      }
      if (this.exists) {
        return app.request(Object.assign({
          method: "DELETE",
          url: app.forum.attribute("apiUrl") + this.apiEndpoint(),
          body: t
        }, e)).then(function () {
          n.exists = false;
          n.store.remove(n);
        });
      } else {
        return Promise.resolve();
      }
    };
    e.apiEndpoint = function () {
      return "/" + this.data.type + (this.exists ? "/" + this.data.id : "");
    };
    e.copyData = function () {
      return JSON.parse(JSON.stringify(this.data));
    };
    t.attribute = function (t, e) {
      return function () {
        var n = this.data.attributes && this.data.attributes[t];
        if (e) {
          return e(n);
        } else {
          return n;
        }
      };
    };
    t.hasOne = function (t) {
      return function () {
        if (this.data.relationships) {
          var e = this.data.relationships[t];
          if (e) {
            return app.store.getById(e.data.type, e.data.id);
          }
        }
        return false;
      };
    };
    t.hasMany = function (t) {
      return function () {
        if (this.data.relationships) {
          var e = this.data.relationships[t];
          if (e) {
            return e.data.map(function (t) {
              return app.store.getById(t.type, t.id);
            });
          }
        }
        return false;
      };
    };
    t.transformDate = function (t) {
      if (t) {
        return new Date(t);
      } else {
        return null;
      }
    };
    t.getIdentifier = function (t) {
      return {
        type: t.data.type,
        id: t.data.id
      };
    };
    return t;
  }();
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return l;
  });
  var i = n(0);
  var r = n(3);
  var o = n(5);
  var s = n(7);
  var a = n(14);
  var c = n(8);
  var u = n(15);
  var l = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    var n = e.prototype;
    n.view = function (t) {
      var e = Object.assign({}, this.attrs);
      e.type = e.type || "button";
      if (e.title && !t.children) {
        e["aria-label"] = e.title;
      }
      if (typeof e.title == "object") {
        e.title = Object(c.a)(e.title);
      }
      if (!e.title && t.children) {
        e.title = Object(c.a)(t.children);
      }
      var n = Object(a.a)(e, "icon");
      var i = Object(a.a)(e, "loading");
      if (e.disabled || i) {
        delete e.onclick;
      }
      e.className = Object(s.a)([e.className, n && "hasIcon", (e.disabled || i) && "disabled", i && "loading"]);
      return m("button", e, this.getButtonContent(t.children));
    };
    n.getButtonContent = function (t) {
      var e = this.attrs.icon;
      return [e && e !== true ? Object(o.a)(e, {
        className: "Button-icon"
      }) : "", t ? m("span", {
        className: "Button-label"
      }, t) : "", this.attrs.loading ? m(u.a, {
        size: "small",
        display: "inline"
      }) : ""];
    };
    return e;
  }(r.a);
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return i;
  });
  var i = function () {
    function t() {
      this.element = undefined;
      this.attrs = undefined;
    }
    var e = t.prototype;
    e.oninit = function (t) {
      this.setAttrs(t.attrs);
    };
    e.oncreate = function (t) {
      this.element = t.dom;
    };
    e.onbeforeupdate = function (t) {
      this.setAttrs(t.attrs);
    };
    e.onupdate = function (t) {};
    e.onbeforeremove = function (t) {};
    e.onremove = function (t) {};
    e.$ = function (t) {
      function e(e) {
        return t.apply(this, arguments);
      }
      e.toString = function () {
        return t.toString();
      };
      return e;
    }(function (t) {
      var e = $(this.element);
      if (t) {
        return e.find(t);
      } else {
        return e;
      }
    });
    t.component = function (t = {}, e = null) {
      var n = Object.assign({}, t);
      return m(this, n, e);
    };
    e.setAttrs = function (t = {}) {
      this.constructor.initAttrs(t);
      if (t) {
        if ("children" in t) {
          throw new Error("[" + this.constructor.name + "] The \"children\" attribute of attrs should never be used. Either pass children in as the vnode children or rename the attribute");
        }
        if ("tag" in t) {
          throw new Error("[" + this.constructor.name + "] You cannot use the \"tag\" attribute name with Mithril 2.");
        }
      }
      this.attrs = t;
    };
    t.initAttrs = function (t) {};
    return t;
  }();
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return r;
  });
  function i(t, e) {
    this.content = undefined;
    this.priority = undefined;
    this.key = undefined;
    this.content = t;
    this.priority = e;
  }
  var r = function () {
    function t() {
      this.items = {};
    }
    var e = t.prototype;
    e.isEmpty = function () {
      for (var t in this.items) {
        if (this.items.hasOwnProperty(t)) {
          return false;
        }
      }
      return true;
    };
    e.has = function (t) {
      return !!this.items[t];
    };
    e.get = function (t) {
      return this.items[t].content;
    };
    e.add = function (t, e, n = 0) {
      this.items[t] = new i(e, n);
      return this;
    };
    e.replace = function (t, e = null, n = null) {
      if (this.items[t]) {
        if (e !== null) {
          this.items[t].content = e;
        }
        if (n !== null) {
          this.items[t].priority = n;
        }
      }
      return this;
    };
    e.remove = function (t) {
      delete this.items[t];
      return this;
    };
    e.merge = function (t) {
      for (var e in t.items) {
        if (t.items.hasOwnProperty(e) && t.items[e] instanceof i) {
          this.items[e] = t.items[e];
        }
      }
      return this;
    };
    e.toArray = function () {
      var t = [];
      for (var e in this.items) {
        if (this.items.hasOwnProperty(e) && this.items[e] instanceof i) {
          this.items[e].content = Object(this.items[e].content);
          this.items[e].content.itemName = e;
          t.push(this.items[e]);
          this.items[e].key = t.length;
        }
      }
      return t.sort(function (t, e) {
        if (t.priority === e.priority) {
          return t.key - e.key;
        } else if (t.priority > e.priority) {
          return -1;
        } else {
          return 1;
        }
      }).map(function (t) {
        return t.content;
      });
    };
    return t;
  }();
}, function (t, e, n) {
  "use strict";

  function i(t, e = {}) {
    e.className = "icon " + t + " " + (e.className || "");
    return m("i", e);
  }
  n.d(e, "a", function () {
    return i;
  });
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return s;
  });
  var i = n(21);
  var r = n(7);
  function o(t) {
    return t.tag === i.a;
  }
  function s(t) {
    if (!(t instanceof Array)) {
      t = [t];
    }
    return function (t) {
      var e;
      var n = [];
      t.filter(Boolean).forEach(function (i, r) {
        if (!o(i) || e && !o(e) && r !== t.length - 1) {
          e = i;
          n.push(i);
        }
      });
      return n;
    }(t).map(function (t) {
      var e = t.tag && t.tag.isListItem;
      var n = t.tag && t.tag.isActive && t.tag.isActive(t.attrs);
      var i = t.attrs && t.attrs.itemClassName || t.itemClassName;
      if (e) {
        t.attrs = t.attrs || {};
        t.attrs.key = t.attrs.key || t.itemName;
        t.key = t.attrs.key;
      }
      if (e) {
        return t;
      } else {
        return m("li", {
          className: Object(r.a)([i, t.itemName && "item-" + t.itemName, n && "active"]),
          key: t.attrs && t.attrs.key || t.itemName
        }, t);
      }
    });
  }
}, function (t, e, n) {
  "use strict";

  function i(t) {
    var e;
    var n;
    var r = "";
    if (typeof t == "string" || typeof t == "number") {
      r += t;
    } else if (typeof t == "object") {
      if (Array.isArray(t)) {
        for (e = 0; e < t.length; e++) {
          if (t[e] && (n = i(t[e]))) {
            if (r) {
              r += " ";
            }
            r += n;
          }
        }
      } else {
        for (e in t) {
          if (t[e]) {
            if (r) {
              r += " ";
            }
            r += e;
          }
        }
      }
    }
    return r;
  }
  function r() {
    var t;
    for (var e, n = 0, r = ""; n < arguments.length;) {
      if ((t = arguments[n++]) && (e = i(t))) {
        if (r) {
          r += " ";
        }
        r += e;
      }
    }
    return r;
  }
  e.a = r;
}, function (t, e, n) {
  "use strict";

  function i(t) {
    if (t instanceof Array) {
      return t.map(function (t) {
        return i(t);
      }).join("");
    } else if (typeof t == "object" && t !== null) {
      if (t.children) {
        return i(t.children);
      } else {
        return t.text;
      }
    } else {
      return t;
    }
  }
  n.d(e, "a", function () {
    return i;
  });
}, function (t, e, n) {
  "use strict";

  var i = n(105);
  var r = n.n(i);
  e.a = r.a;
}, function (t, e, n) {
  "use strict";

  var i = n(0);
  var r = n(1);
  var o = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    return e;
  }(r.a);
  Object.assign(o.prototype, {
    nameSingular: r.a.attribute("nameSingular"),
    namePlural: r.a.attribute("namePlural"),
    color: r.a.attribute("color"),
    icon: r.a.attribute("icon"),
    isHidden: r.a.attribute("isHidden")
  });
  o.ADMINISTRATOR_ID = "1";
  o.GUEST_ID = "2";
  o.MEMBER_ID = "3";
  e.a = o;
}, function (t, e, n) {
  "use strict";

  function i() {
    return (i = Object.assign || function (t) {
      for (var e = 1; e < arguments.length; e++) {
        var n = arguments[e];
        for (var i in n) {
          if (Object.prototype.hasOwnProperty.call(n, i)) {
            t[i] = n[i];
          }
        }
      }
      return t;
    }).apply(this, arguments);
  }
  n.d(e, "a", function () {
    return i;
  });
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return a;
  });
  var i = n(22);
  var r = n(0);
  var o = n(3);
  var s = n(14);
  var a = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(r.a)(e, t);
    e.prototype.view = function (t) {
      var e = t.attrs;
      var n = e.options;
      var r = n === undefined ? {} : n;
      var o = Object(i.a)(e, ["options"]);
      o.href = o.href || "";
      var a = t.children || {
        tag: "#",
        children: t.text
      };
      if (o.external) {
        return m("a", o, a);
      } else {
        if (o.href === m.route.get()) {
          if (!("replace" in r)) {
            r.replace = true;
          }
        }
        if (Object(s.a)(o, "force")) {
          if (!("state" in r)) {
            r.state = {};
          }
          if (!("key" in r.state)) {
            r.state.key = Date.now();
          }
        }
        o.options = r;
        return m(m.route.Link, o, a);
      }
    };
    return e;
  }(o.a);
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return a;
  });
  var i = n(0);
  var r = n(3);
  var o = n(27);
  var s = n(2);
  var a = function (t) {
    function e() {
      var e;
      for (var n = arguments.length, i = new Array(n), r = 0; r < n; r++) {
        i[r] = arguments[r];
      }
      (e = t.call.apply(t, [this].concat(i)) || this).alertAttrs = null;
      return e;
    }
    Object(i.a)(e, t);
    var n = e.prototype;
    n.oncreate = function (e) {
      var n = this;
      t.prototype.oncreate.call(this, e);
      this.attrs.animateShow(function () {
        return n.onready();
      });
    };
    n.onbeforeremove = function (e) {
      t.prototype.onbeforeremove.call(this, e);
      if (!this.attrs.state.modal) {
        this.attrs.animateHide();
        return new Promise(function (t) {
          return setTimeout(t, 300);
        });
      }
    };
    n.view = function () {
      if (this.alertAttrs) {
        this.alertAttrs.dismissible = false;
      }
      return m("div", {
        className: "Modal modal-dialog " + this.className()
      }, m("div", {
        className: "Modal-content"
      }, this.constructor.isDismissible ? m("div", {
        className: "Modal-close App-backControl"
      }, s.a.component({
        icon: "fas fa-times",
        onclick: this.hide.bind(this),
        className: "Button Button--icon Button--link"
      })) : "", m("form", {
        onsubmit: this.onsubmit.bind(this)
      }, m("div", {
        className: "Modal-header"
      }, m("h3", {
        className: "App-titleControl App-titleControl--text"
      }, this.title())), this.alertAttrs ? m("div", {
        className: "Modal-alert"
      }, o.a.component(this.alertAttrs)) : "", this.content())));
    };
    n.className = function () {};
    n.title = function () {};
    n.content = function () {};
    n.onsubmit = function () {};
    n.onready = function () {
      this.$("form").find("input, select, textarea").first().focus().select();
    };
    n.hide = function () {
      this.attrs.state.close();
    };
    n.loaded = function () {
      this.loading = false;
      m.redraw();
    };
    n.onerror = function (t) {
      this.alertAttrs = t.alert;
      m.redraw();
      if (t.status === 422 && t.response.errors) {
        this.$("form [name=" + t.response.errors[0].source.pointer.replace("/data/attributes/", "") + "]").select();
      } else {
        this.onready();
      }
    };
    return e;
  }(r.a);
  a.isDismissible = true;
}, function (t, e, n) {
  "use strict";

  function i(t, e) {
    var n = t[e];
    delete t[e];
    return n;
  }
  n.d(e, "a", function () {
    return i;
  });
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return a;
  });
  var i = n(22);
  var r = n(0);
  var o = n(3);
  var s = n(7);
  var a = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(r.a)(e, t);
    e.prototype.view = function () {
      var t = this.attrs;
      var e = t.display;
      var n = e === undefined ? "block" : e;
      var r = t.size;
      var o = r === undefined ? "medium" : r;
      var a = t.containerClassName;
      var c = t.className;
      var u = Object(i.a)(t, ["display", "size", "containerClassName", "className"]);
      var l = Object(s.a)("LoadingIndicator", c);
      var d = Object(s.a)("LoadingIndicator-container", n !== "unset" && "LoadingIndicator-container--" + n, o && "LoadingIndicator-container--" + o, a);
      return m("div", Object.assign({
        "aria-label": app.translator.trans("core.lib.loading_indicator.accessible_label"),
        role: "status"
      }, u.containerAttrs, {
        "data-size": o,
        className: d
      }), m("div", Object.assign({
        "aria-hidden": true,
        className: l
      }, u)));
    };
    return e;
  }(o.a);
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return s;
  });
  var i = n(0);
  var r = n(2);
  var o = n(12);
  var s = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    e.initAttrs = function (e) {
      t.initAttrs.call(this, e);
      e.active = this.isActive(e);
      if (e.force === undefined) {
        e.force = true;
      }
    };
    e.prototype.view = function (e) {
      var n = t.prototype.view.call(this, e);
      n.tag = o.a;
      n.attrs.active = String(n.attrs.active);
      return n;
    };
    e.isActive = function (t) {
      if (t.active !== undefined) {
        return t.active;
      } else {
        return m.route.get() === t.href;
      }
    };
    return e;
  }(r.a);
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return a;
  });
  var i = n(0);
  var r = n(3);
  var o = n(5);
  var s = n(6);
  var a = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    e.initAttrs = function (t) {
      t.className = t.className || "";
      t.buttonClassName = t.buttonClassName || "";
      t.menuClassName = t.menuClassName || "";
      t.label = t.label || "";
      t.caretIcon = t.caretIcon !== undefined ? t.caretIcon : "fas fa-caret-down";
      t.accessibleToggleLabel = t.accessibleToggleLabel || app.translator.trans("core.lib.dropdown.toggle_dropdown_accessible_label");
    };
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.showing = false;
    };
    n.view = function (t) {
      var e = t.children ? Object(s.a)(t.children) : [];
      return m("div", {
        className: "ButtonGroup Dropdown dropdown " + this.attrs.className + " itemCount" + e.length + (this.showing ? " open" : "")
      }, this.getButton(t.children), this.getMenu(e));
    };
    n.oncreate = function (e) {
      var n = this;
      t.prototype.oncreate.call(this, e);
      this.$().on("shown.bs.dropdown", function () {
        n.showing = true;
        if (n.attrs.onshow) {
          n.attrs.onshow();
        }
        m.redraw();
        var t = n.$(".Dropdown-menu");
        var e = t.hasClass("Dropdown-menu--right");
        t.removeClass("Dropdown-menu--top Dropdown-menu--right");
        t.toggleClass("Dropdown-menu--top", t.offset().top + t.height() > $(window).scrollTop() + $(window).height());
        if (t.offset().top < 0) {
          t.removeClass("Dropdown-menu--top");
        }
        t.toggleClass("Dropdown-menu--right", e || t.offset().left + t.width() > $(window).scrollLeft() + $(window).width());
      });
      this.$().on("hidden.bs.dropdown", function () {
        n.showing = false;
        if (n.attrs.onhide) {
          n.attrs.onhide();
        }
        m.redraw();
      });
    };
    n.getButton = function (t) {
      return m("button", {
        className: "Dropdown-toggle " + this.attrs.buttonClassName,
        "aria-haspopup": "menu",
        "aria-label": this.attrs.accessibleToggleLabel,
        "data-toggle": "dropdown",
        onclick: this.attrs.onclick
      }, this.getButtonContent(t));
    };
    n.getButtonContent = function (t) {
      return [this.attrs.icon ? Object(o.a)(this.attrs.icon, {
        className: "Button-icon"
      }) : "", m("span", {
        className: "Button-label"
      }, this.attrs.label), this.attrs.caretIcon ? Object(o.a)(this.attrs.caretIcon, {
        className: "Button-caret"
      }) : ""];
    };
    n.getMenu = function (t) {
      return m("ul", {
        className: "Dropdown-menu dropdown-menu " + this.attrs.menuClassName
      }, t);
    };
    return e;
  }(r.a);
}, function (t, e, n) {
  "use strict";

  function i(t, e = {}) {
    e.className = "Avatar " + (e.className || "");
    var n = "";
    var i = e.title === "undefined" || e.title;
    if (!i) {
      delete e.title;
    }
    if (t) {
      var r = t.displayName() || "?";
      var o = t.avatarUrl();
      if (i) {
        e.title = e.title || r;
      }
      if (o) {
        return m("img", Object.assign({}, e, {
          src: o,
          alt: ""
        }));
      }
      n = r.charAt(0).toUpperCase();
      e.style = {
        background: t.color()
      };
    }
    return m("span", e, n);
  }
  n.d(e, "a", function () {
    return i;
  });
}, function (t, e, n) {
  "use strict";

  function i(t) {
    var e = t && t.displayName() || app.translator.trans("core.lib.username.deleted_text");
    return m("span", {
      className: "username"
    }, e);
  }
  n.d(e, "a", function () {
    return i;
  });
}, function (t, e, n) {
  "use strict";

  function i() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) {
      e[n] = arguments[n];
    }
    var i;
    var r = e.slice(0, -1);
    var o = e.slice(-1)[0];
    var s = {};
    return function () {
      var t = this;
      var e = false;
      r.forEach(function (n) {
        var i = typeof t[n] == "function" ? t[n]() : t[n];
        if (s[n] !== i) {
          e = true;
          s[n] = i;
        }
      });
      if (e) {
        i = o.apply(this, r.map(function (t) {
          return s[t];
        }));
      }
      return i;
    };
  }
  n.d(e, "a", function () {
    return i;
  });
}, function (t, e, n) {
  "use strict";

  var i = n(0);
  var r = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    e.prototype.view = function () {
      return m("li", {
        className: "Dropdown-separator"
      });
    };
    return e;
  }(n(3).a);
  r.isListItem = true;
  e.a = r;
}, function (t, e, n) {
  "use strict";

  function i(t, e) {
    if (t == null) {
      return {};
    }
    var n;
    var i;
    var r = {};
    var o = Object.keys(t);
    for (i = 0; i < o.length; i++) {
      n = o[i];
      if (!(e.indexOf(n) >= 0)) {
        r[n] = t[n];
      }
    }
    return r;
  }
  n.d(e, "a", function () {
    return i;
  });
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return c;
  });
  var i = n(22);
  var r = n(0);
  var o = n(3);
  var s = n(7);
  var a = n(8);
  var c = function (t) {
    function e() {
      var e;
      for (var n = arguments.length, i = new Array(n), r = 0; r < n; r++) {
        i[r] = arguments[r];
      }
      (e = t.call.apply(t, [this].concat(i)) || this).firstChild = null;
      e.childDomNode = null;
      e.oldText = "";
      e.oldVisibility = undefined;
      e.shouldRecreateTooltip = false;
      e.shouldChangeTooltipVisibility = false;
      return e;
    }
    Object(r.a)(e, t);
    var n = e.prototype;
    n.view = function (t) {
      var e = t.children;
      var n = this.attrs;
      n.text;
      var r = n.tooltipVisible;
      n.showOnFocus;
      n.position;
      var o = n.ignoreTitleWarning;
      var s = o !== undefined && o;
      n.html;
      n.delay;
      Object(i.a)(n, ["text", "tooltipVisible", "showOnFocus", "position", "ignoreTitleWarning", "html", "delay"]);
      if (this.attrs.title && !s) {
        console.warn("`title` attribute was passed to Tooltip component. Was this intentional? Tooltip content should be passed to the `text` attr instead.");
      }
      var a = this.getRealText();
      if (a !== this.oldText) {
        this.oldText = a;
        this.shouldRecreateTooltip = true;
      }
      if (r !== this.oldVisibility) {
        this.oldVisibility = this.attrs.tooltipVisible;
        this.shouldChangeTooltipVisibility = true;
      }
      if (e === undefined) {
        throw new Error("Tooltip component was provided with no direct child DOM element. Tooltips must contain a single direct DOM node to attach to.");
      }
      if (e.length !== 1) {
        throw new Error("Tooltip component was either passed more than one or no child node.\n\nPlease wrap multiple children in another element, such as a <div> or <span>.");
      }
      var c = e[0];
      if (typeof c != "object" || Array.isArray(c) || c === null) {
        throw new Error("Tooltip component was provided with no direct child DOM element. Tooltips must contain a single direct DOM node to attach to.");
      }
      if (typeof c.tag == "string" && ["#", "[", "<"].includes(c.tag)) {
        throw new Error("Tooltip component with provided with a vnode with tag \"" + c.tag + "\". This is not a DOM element, so is not a valid child element. Please wrap this vnode in another element, such as a <div> or <span>.");
      }
      this.firstChild = c;
      return e;
    };
    n.oncreate = function (e) {
      t.prototype.oncreate.call(this, e);
      this.checkDomNodeChanged();
      this.recreateTooltip();
    };
    n.onupdate = function (e) {
      t.prototype.onupdate.call(this, e);
      this.checkDomNodeChanged();
      this.recreateTooltip();
    };
    n.recreateTooltip = function () {
      if (this.shouldRecreateTooltip && this.childDomNode !== null) {
        $(this.childDomNode).tooltip("destroy", "DANGEROUS_tooltip_jquery_fn_deprecation_exempt");
        this.createTooltip();
        this.shouldRecreateTooltip = false;
      }
      if (this.shouldChangeTooltipVisibility) {
        this.shouldChangeTooltipVisibility = false;
        this.updateVisibility();
      }
    };
    n.updateVisibility = function () {
      if (this.childDomNode !== null) {
        if (this.attrs.tooltipVisible === true) {
          $(this.childDomNode).tooltip("show", "DANGEROUS_tooltip_jquery_fn_deprecation_exempt");
        } else if (this.attrs.tooltipVisible === false) {
          $(this.childDomNode).tooltip("hide", "DANGEROUS_tooltip_jquery_fn_deprecation_exempt");
        }
      }
    };
    n.createTooltip = function () {
      if (this.childDomNode !== null) {
        var t = this.attrs;
        var e = t.showOnFocus;
        var n = e === undefined || e;
        var i = t.position;
        var r = i === undefined ? "top" : i;
        var o = t.delay;
        var a = t.html;
        var c = a !== undefined && a;
        var u = t.tooltipVisible;
        t.text;
        var l = typeof u == "boolean" ? "manual" : Object(s.a)("hover", [n && "focus"]);
        var d = this.getRealText();
        this.childDomNode.setAttribute("title", d);
        this.childDomNode.setAttribute("aria-label", d);
        $(this.childDomNode).tooltip({
          html: c,
          delay: o,
          placement: r,
          trigger: l
        }, "DANGEROUS_tooltip_jquery_fn_deprecation_exempt");
      }
    };
    n.getRealText = function () {
      var t = this.attrs.text;
      if (Array.isArray(t)) {
        return Object(a.a)(t);
      } else {
        return t;
      }
    };
    n.checkDomNodeChanged = function () {
      var t = this.firstChild.dom;
      if (t && !t.isSameNode(this.childDomNode)) {
        this.childDomNode = t;
        this.shouldRecreateTooltip = true;
      }
    };
    return e;
  }(o.a);
}, function (t, e, n) {
  t.exports = function () {
    "use strict";

    var t = "millisecond";
    var e = "second";
    var n = "minute";
    var i = "hour";
    var r = "day";
    var o = "week";
    var s = "month";
    var a = "quarter";
    var c = "year";
    var u = "date";
    var l = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;
    var d = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
    var p = {
      name: "en",
      weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
      months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_")
    };
    function h(t, e, n) {
      var i = String(t);
      if (!i || i.length >= e) {
        return t;
      } else {
        return "" + Array(e + 1 - i.length).join(n) + t;
      }
    }
    var f = {
      s: h,
      z: function (t) {
        var e = -t.utcOffset();
        var n = Math.abs(e);
        var i = Math.floor(n / 60);
        var r = n % 60;
        return (e <= 0 ? "+" : "-") + h(i, 2, "0") + ":" + h(r, 2, "0");
      },
      m: function t(e, n) {
        if (e.date() < n.date()) {
          return -t(n, e);
        }
        var i = (n.year() - e.year()) * 12 + (n.month() - e.month());
        var r = e.clone().add(i, s);
        var o = n - r < 0;
        var a = e.clone().add(i + (o ? -1 : 1), s);
        return +(-(i + (n - r) / (o ? r - a : a - r)) || 0);
      },
      a: function (t) {
        if (t < 0) {
          return Math.ceil(t) || 0;
        } else {
          return Math.floor(t);
        }
      },
      p: function (l) {
        return {
          M: s,
          y: c,
          w: o,
          d: r,
          D: u,
          h: i,
          m: n,
          s: e,
          ms: t,
          Q: a
        }[l] || String(l || "").toLowerCase().replace(/s$/, "");
      },
      u: function (t) {
        return t === undefined;
      }
    };
    var m = "en";
    var v = {
      [m]: p
    };
    function g(t) {
      return t instanceof x;
    }
    function b(t, e, n) {
      var i;
      if (!t) {
        return m;
      }
      if (typeof t == "string") {
        if (v[t]) {
          i = t;
        }
        if (e) {
          v[t] = e;
          i = t;
        }
      } else {
        var r = t.name;
        v[r] = t;
        i = r;
      }
      if (!n && i) {
        m = i;
      }
      return i || !n && m;
    }
    function y(t, e) {
      if (g(t)) {
        return t.clone();
      }
      var n = typeof e == "object" ? e : {};
      n.date = t;
      n.args = arguments;
      return new x(n);
    }
    var w = f;
    w.l = b;
    w.i = g;
    w.w = function (t, e) {
      return y(t, {
        locale: e.$L,
        utc: e.$u,
        x: e.$x,
        $offset: e.$offset
      });
    };
    var x = function () {
      function p(t) {
        this.$L = b(t.locale, null, true);
        this.parse(t);
      }
      var h = p.prototype;
      h.parse = function (t) {
        this.$d = function (t) {
          var e = t.date;
          var n = t.utc;
          if (e === null) {
            return new Date(NaN);
          }
          if (w.u(e)) {
            return new Date();
          }
          if (e instanceof Date) {
            return new Date(e);
          }
          if (typeof e == "string" && !/Z$/i.test(e)) {
            var i = e.match(l);
            if (i) {
              var r = i[2] - 1 || 0;
              var o = (i[7] || "0").substring(0, 3);
              if (n) {
                return new Date(Date.UTC(i[1], r, i[3] || 1, i[4] || 0, i[5] || 0, i[6] || 0, o));
              } else {
                return new Date(i[1], r, i[3] || 1, i[4] || 0, i[5] || 0, i[6] || 0, o);
              }
            }
          }
          return new Date(e);
        }(t);
        this.$x = t.x || {};
        this.init();
      };
      h.init = function () {
        var t = this.$d;
        this.$y = t.getFullYear();
        this.$M = t.getMonth();
        this.$D = t.getDate();
        this.$W = t.getDay();
        this.$H = t.getHours();
        this.$m = t.getMinutes();
        this.$s = t.getSeconds();
        this.$ms = t.getMilliseconds();
      };
      h.$utils = function () {
        return w;
      };
      h.isValid = function () {
        return this.$d.toString() !== "Invalid Date";
      };
      h.isSame = function (t, e) {
        var n = y(t);
        return this.startOf(e) <= n && n <= this.endOf(e);
      };
      h.isAfter = function (t, e) {
        return y(t) < this.startOf(e);
      };
      h.isBefore = function (t, e) {
        return this.endOf(e) < y(t);
      };
      h.$g = function (t, e, n) {
        if (w.u(t)) {
          return this[e];
        } else {
          return this.set(n, t);
        }
      };
      h.unix = function () {
        return Math.floor(this.valueOf() / 1000);
      };
      h.valueOf = function () {
        return this.$d.getTime();
      };
      h.startOf = function (t, a) {
        var l = this;
        var d = !!w.u(a) || a;
        var p = w.p(t);
        function h(t, e) {
          var n = w.w(l.$u ? Date.UTC(l.$y, e, t) : new Date(l.$y, e, t), l);
          if (d) {
            return n;
          } else {
            return n.endOf(r);
          }
        }
        function f(t, e) {
          return w.w(l.toDate()[t].apply(l.toDate("s"), (d ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e)), l);
        }
        var m = this.$W;
        var v = this.$M;
        var g = this.$D;
        var b = "set" + (this.$u ? "UTC" : "");
        switch (p) {
          case c:
            if (d) {
              return h(1, 0);
            } else {
              return h(31, 11);
            }
          case s:
            if (d) {
              return h(1, v);
            } else {
              return h(0, v + 1);
            }
          case o:
            var y = this.$locale().weekStart || 0;
            var x = (m < y ? m + 7 : m) - y;
            return h(d ? g - x : g + (6 - x), v);
          case r:
          case u:
            return f(b + "Hours", 0);
          case i:
            return f(b + "Minutes", 1);
          case n:
            return f(b + "Seconds", 2);
          case e:
            return f(b + "Milliseconds", 3);
          default:
            return this.clone();
        }
      };
      h.endOf = function (t) {
        return this.startOf(t, false);
      };
      h.$set = function (o, a) {
        var l;
        var d = w.p(o);
        var p = "set" + (this.$u ? "UTC" : "");
        var h = (l = {}, l[r] = p + "Date", l[u] = p + "Date", l[s] = p + "Month", l[c] = p + "FullYear", l[i] = p + "Hours", l[n] = p + "Minutes", l[e] = p + "Seconds", l[t] = p + "Milliseconds", l)[d];
        var f = d === r ? this.$D + (a - this.$W) : a;
        if (d === s || d === c) {
          var m = this.clone().set(u, 1);
          m.$d[h](f);
          m.init();
          this.$d = m.set(u, Math.min(this.$D, m.daysInMonth())).$d;
        } else if (h) {
          this.$d[h](f);
        }
        this.init();
        return this;
      };
      h.set = function (t, e) {
        return this.clone().$set(t, e);
      };
      h.get = function (t) {
        return this[w.p(t)]();
      };
      h.add = function (t, a) {
        var u;
        var l = this;
        t = Number(t);
        var d = w.p(a);
        function p(e) {
          var n = y(l);
          return w.w(n.date(n.date() + Math.round(e * t)), l);
        }
        if (d === s) {
          return this.set(s, this.$M + t);
        }
        if (d === c) {
          return this.set(c, this.$y + t);
        }
        if (d === r) {
          return p(1);
        }
        if (d === o) {
          return p(7);
        }
        var h = (u = {}, u[n] = 60000, u[i] = 3600000, u[e] = 1000, u)[d] || 1;
        var f = this.$d.getTime() + t * h;
        return w.w(f, this);
      };
      h.subtract = function (t, e) {
        return this.add(t * -1, e);
      };
      h.format = function (t) {
        var e = this;
        if (!this.isValid()) {
          return "Invalid Date";
        }
        var n = t || "YYYY-MM-DDTHH:mm:ssZ";
        var i = w.z(this);
        var r = this.$locale();
        var o = this.$H;
        var s = this.$m;
        var a = this.$M;
        var c = r.weekdays;
        var u = r.months;
        function l(t, i, r, o) {
          return t && (t[i] || t(e, n)) || r[i].substr(0, o);
        }
        function p(t) {
          return w.s(o % 12 || 12, t, "0");
        }
        var h = r.meridiem || function (t, e, n) {
          var i = t < 12 ? "AM" : "PM";
          if (n) {
            return i.toLowerCase();
          } else {
            return i;
          }
        };
        var f = {
          YY: String(this.$y).slice(-2),
          YYYY: this.$y,
          M: a + 1,
          MM: w.s(a + 1, 2, "0"),
          MMM: l(r.monthsShort, a, u, 3),
          MMMM: l(u, a),
          D: this.$D,
          DD: w.s(this.$D, 2, "0"),
          d: String(this.$W),
          dd: l(r.weekdaysMin, this.$W, c, 2),
          ddd: l(r.weekdaysShort, this.$W, c, 3),
          dddd: c[this.$W],
          H: String(o),
          HH: w.s(o, 2, "0"),
          h: p(1),
          hh: p(2),
          a: h(o, s, true),
          A: h(o, s, false),
          m: String(s),
          mm: w.s(s, 2, "0"),
          s: String(this.$s),
          ss: w.s(this.$s, 2, "0"),
          SSS: w.s(this.$ms, 3, "0"),
          Z: i
        };
        return n.replace(d, function (t, e) {
          return e || f[t] || i.replace(":", "");
        });
      };
      h.utcOffset = function () {
        return -Math.round(this.$d.getTimezoneOffset() / 15) * 15;
      };
      h.diff = function (t, u, l) {
        var d;
        var p = w.p(u);
        var h = y(t);
        var f = (h.utcOffset() - this.utcOffset()) * 60000;
        var m = this - h;
        var v = w.m(this, h);
        v = (d = {}, d[c] = v / 12, d[s] = v, d[a] = v / 3, d[o] = (m - f) / 604800000, d[r] = (m - f) / 86400000, d[i] = m / 3600000, d[n] = m / 60000, d[e] = m / 1000, d)[p] || m;
        if (l) {
          return v;
        } else {
          return w.a(v);
        }
      };
      h.daysInMonth = function () {
        return this.endOf(s).$D;
      };
      h.$locale = function () {
        return v[this.$L];
      };
      h.locale = function (t, e) {
        if (!t) {
          return this.$L;
        }
        var n = this.clone();
        var i = b(t, e, true);
        if (i) {
          n.$L = i;
        }
        return n;
      };
      h.clone = function () {
        return w.w(this.$d, this);
      };
      h.toDate = function () {
        return new Date(this.valueOf());
      };
      h.toJSON = function () {
        if (this.isValid()) {
          return this.toISOString();
        } else {
          return null;
        }
      };
      h.toISOString = function () {
        return this.$d.toISOString();
      };
      h.toString = function () {
        return this.$d.toUTCString();
      };
      return p;
    }();
    var N = x.prototype;
    y.prototype = N;
    [["$ms", t], ["$s", e], ["$m", n], ["$H", i], ["$W", r], ["$M", s], ["$y", c], ["$D", u]].forEach(function (t) {
      N[t[1]] = function (e) {
        return this.$g(e, t[0], t[1]);
      };
    });
    y.extend = function (t, e) {
      if (!t.$i) {
        t(e, x, y);
        t.$i = true;
      }
      return y;
    };
    y.locale = b;
    y.isDayjs = g;
    y.unix = function (t) {
      return y(t * 1000);
    };
    y.en = v[m];
    y.Ls = v;
    y.p = {};
    return y;
  }();
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return o;
  });
  var i = n(24);
  var r = n.n(i);
  n(81);
  function o(t) {
    var e = r()(t);
    var n = r()();
    if (e.isAfter(n)) {
      e = n;
    }
    if (e.diff(r()()) < -2592000000) {
      if (e.year() === r()().year()) {
        return e.format("D MMM");
      } else {
        return e.format("ll");
      }
    } else {
      return e.fromNow();
    }
  }
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return l;
  });
  var i = n(11);
  var r = n(22);
  var o = n(0);
  var s = n(23);
  var a = n(3);
  var c = n(5);
  var u = n(7);
  var l = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    e.prototype.view = function () {
      var t = this.attrs;
      var e = t.type;
      var n = t.icon;
      var o = t.label;
      var a = Object(r.a)(t, ["type", "icon", "label"]);
      var l = Object(u.a)("Badge", [e && "Badge--" + e], a.className);
      var d = n ? Object(c.a)(n, {
        className: "Badge-icon"
      }) : m.trust("&nbsp;");
      var p = Object(i.a)({}, a, {
        className: l
      });
      var h = m("div", p, d);
      if (o) {
        return m(s.a, {
          text: o
        }, h);
      } else {
        return h;
      }
    };
    return e;
  }(a.a);
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return c;
  });
  var i = n(0);
  var r = n(3);
  var o = n(2);
  var s = n(6);
  var a = n(14);
  var c = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    e.prototype.view = function (t) {
      var e = Object.assign({}, this.attrs);
      var n = Object(a.a)(e, "type");
      e.className = "Alert Alert--" + n + " " + (e.className || "");
      var i = Object(a.a)(e, "content") || t.children;
      var r = Object(a.a)(e, "controls") || [];
      var c = Object(a.a)(e, "dismissible");
      var u = Object(a.a)(e, "ondismiss");
      var l = [];
      if (c || c === undefined) {
        l.push(m(o.a, {
          icon: "fas fa-times",
          className: "Button Button--link Button--icon Alert-dismiss",
          onclick: u
        }));
      }
      return m("div", e, m("span", {
        className: "Alert-body"
      }, i), m("ul", {
        className: "Alert-controls"
      }, Object(s.a)(r.concat(l))));
    };
    return e;
  }(r.a);
}, function (t, e, n) {
  "use strict";

  function i(t, e, n, i, r, o) {
    return {
      tag: t,
      key: e,
      attrs: n,
      children: i,
      text: r,
      dom: o,
      domSize: undefined,
      state: undefined,
      events: undefined,
      instance: undefined
    };
  }
  i.normalize = function (t) {
    if (Array.isArray(t)) {
      return i("[", undefined, undefined, i.normalizeChildren(t), undefined, undefined);
    } else if (t == null || typeof t == "boolean") {
      return null;
    } else if (typeof t == "object") {
      return t;
    } else {
      return i("#", undefined, undefined, String(t), undefined, undefined);
    }
  };
  i.normalizeChildren = function (t) {
    var e = [];
    if (t.length) {
      var n = t[0] != null && t[0].key != null;
      for (var r = 1; r < t.length; r++) {
        if ((t[r] != null && t[r].key != null) !== n) {
          throw new TypeError("Vnodes must either always have keys or never have keys!");
        }
      }
      for (r = 0; r < t.length; r++) {
        e[r] = i.normalize(t[r]);
      }
    }
    return e;
  };
  t.exports = i;
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return r;
  });
  var i = n(0);
  var r = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    e.initAttrs = function (e) {
      t.initAttrs.call(this, e);
      if (e.group) {
        e.icon = e.group.icon();
        e.style = {
          backgroundColor: e.group.color()
        };
        e.label = e.label === undefined ? e.group.nameSingular() : e.label;
        e.type = "group--" + e.group.id();
        delete e.group;
      }
    };
    return e;
  }(n(26).a);
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return s;
  });
  var i = n(0);
  var r = n(3);
  var o = n(46);
  var s = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      app.previous = app.current;
      app.current = new o.a(this.constructor, {
        routeName: this.attrs.routeName
      });
      app.drawer.hide();
      app.modal.close();
      this.bodyClass = "";
      this.scrollTopOnCreate = true;
      this.useBrowserScrollRestoration = true;
    };
    n.oncreate = function (e) {
      t.prototype.oncreate.call(this, e);
      if (this.bodyClass) {
        $("#app").addClass(this.bodyClass);
      }
      if (this.scrollTopOnCreate) {
        $(window).scrollTop(0);
      }
      if ("scrollRestoration" in history) {
        history.scrollRestoration = this.useBrowserScrollRestoration ? "auto" : "manual";
      }
    };
    n.onremove = function (e) {
      t.prototype.onremove.call(this, e);
      if (this.bodyClass) {
        $("#app").removeClass(this.bodyClass);
      }
    };
    return e;
  }(r.a);
}, function (t, e, n) {
  "use strict";

  function i(t, e, n = 0) {
    return (n > 0 ? "..." : "") + t.substring(n, n + e) + (t.length > n + e ? "..." : "");
  }
  function r(t) {
    return t.toLowerCase().replace(/[^a-z0-9]/gi, "-").replace(/-+/g, "-").replace(/-$|^-/g, "");
  }
  function o(t) {
    var e = t.replace(/(<\/p>|<br>)/g, "$1 &nbsp;").replace(/<img\b[^>]*>/gi, " ");
    var n = $("<div/>").html(e);
    n.find(o.removeSelectors.join(",")).remove();
    return n.text().replace(/\s+/g, " ").trim();
  }
  function s(t) {
    return t.substr(0, 1).toUpperCase() + t.substr(1);
  }
  n.r(e);
  n.d(e, "truncate", function () {
    return i;
  });
  n.d(e, "slug", function () {
    return r;
  });
  n.d(e, "getPlainContent", function () {
    return o;
  });
  n.d(e, "ucfirst", function () {
    return s;
  });
  o.removeSelectors = ["blockquote", "script"];
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return a;
  });
  var i = n(0);
  var r = n(17);
  var o = n(5);
  function s(t) {
    var e = t.tag;
    return (typeof e != "string" || e === "a" || e === "button") && ("initAttrs" in e && e.initAttrs(t.attrs), "isActive" in e ? e.isActive(t.attrs) : t.attrs.active);
  }
  var a = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    e.initAttrs = function (e) {
      e.caretIcon = e.caretIcon !== undefined ? e.caretIcon : "fas fa-sort";
      t.initAttrs.call(this, e);
      e.className += " Dropdown--select";
    };
    e.prototype.getButtonContent = function (t) {
      var e = t.find(s);
      var n = e && e.children || this.attrs.defaultLabel;
      if (n instanceof Array) {
        n = n[0];
      }
      return [m("span", {
        className: "Button-label"
      }, n), Object(o.a)(this.attrs.caretIcon, {
        className: "Button-caret"
      })];
    };
    return e;
  }(r.a);
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return r;
  });
  var i = n(31);
  function r(t, e, n) {
    if (!e && !n) {
      return t;
    }
    var r = e instanceof RegExp ? e : new RegExp(e, "gi");
    var o = t;
    var s = 0;
    if (n) {
      if (e) {
        s = Math.max(0, t.search(r) - n / 2);
      }
      o = Object(i.truncate)(o, n, s);
    }
    o = $("<div/>").text(o).html();
    if (e) {
      o = o.replace(r, "<mark>$&</mark>");
    }
    return m.trust(o);
  }
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return r;
  });
  var i = null;
  function r(t, e) {
    var n = e.text;
    var r = e.selectionStart;
    var o = e.selectionEnd;
    var s = t.selectionStart;
    var a = t.value.slice(0, s);
    var c = t.value.slice(t.selectionEnd);
    if (i === null || i === true) {
      t.contentEditable = "true";
      try {
        i = document.execCommand("insertText", false, n);
      } catch (t) {
        i = false;
      }
      t.contentEditable = "false";
    }
    if (i && !t.value.slice(0, t.selectionStart).endsWith(n)) {
      i = false;
    }
    if (!i) {
      t.value = a + n + c;
      t.dispatchEvent(new CustomEvent("input", {
        bubbles: true,
        cancelable: true
      }));
    }
    if (r != null && o != null) {
      t.setSelectionRange(r, o);
    } else {
      t.setSelectionRange(s, t.selectionEnd);
    }
  }
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return r;
  });
  var i = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (t) {
    return window.setTimeout(t, 1000 / 60);
  };
  var r = function () {
    function t(t) {
      this.callback = t;
      this.ticking = false;
    }
    var e = t.prototype;
    e.loop = function () {
      var t = this;
      if (!this.ticking) {
        i(function () {
          t.update();
          t.ticking = false;
        });
        this.ticking = true;
      }
    };
    e.update = function () {
      this.callback(window.pageYOffset);
    };
    e.start = function () {
      if (!this.active) {
        window.addEventListener("scroll", this.active = this.loop.bind(this), {
          passive: true
        });
      }
    };
    e.stop = function () {
      window.removeEventListener("scroll", this.active);
      this.active = null;
    };
    return t;
  }();
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return r;
  });
  var i = n(0);
  var r = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    e.initAttrs = function (e) {
      t.initAttrs.call(this, e);
      e.className = (e.className || "") + " Checkbox--switch";
    };
    e.prototype.getDisplay = function () {
      if (this.attrs.loading) {
        return t.prototype.getDisplay.call(this);
      } else {
        return "";
      }
    };
    return e;
  }(n(45).a);
}, function (t, e, n) {
  "use strict";

  e.a = function (t, e) {
    return function () {
      e(this.getAttribute(t) || this[t]);
    };
  };
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return r;
  });
  var i = n(11);
  var r = function () {
    function t(t, e) {
      this.component = undefined;
      this.routeName = undefined;
      this.component = t;
      this.routeName = e;
    }
    var e = t.prototype;
    e.makeKey = function () {
      return this.routeName + JSON.stringify(m.route.param());
    };
    e.makeAttrs = function (t) {
      return Object(i.a)({}, t.attrs, {
        routeName: this.routeName
      });
    };
    e.onmatch = function (t, e, n) {
      return this.component;
    };
    e.render = function (t) {
      return [Object(i.a)({}, t, {
        attrs: this.makeAttrs(t),
        key: this.makeKey()
      })];
    };
    return t;
  }();
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return c;
  });
  var i = n(0);
  var r = n(1);
  var o = n(20);
  var s = n(4);
  var a = n(26);
  var c = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    return e;
  }(r.a);
  Object.assign(c.prototype, {
    title: r.a.attribute("title"),
    slug: r.a.attribute("slug"),
    createdAt: r.a.attribute("createdAt", r.a.transformDate),
    user: r.a.hasOne("user"),
    firstPost: r.a.hasOne("firstPost"),
    lastPostedAt: r.a.attribute("lastPostedAt", r.a.transformDate),
    lastPostedUser: r.a.hasOne("lastPostedUser"),
    lastPost: r.a.hasOne("lastPost"),
    lastPostNumber: r.a.attribute("lastPostNumber"),
    commentCount: r.a.attribute("commentCount"),
    replyCount: Object(o.a)("commentCount", function (t) {
      return Math.max(0, t - 1);
    }),
    posts: r.a.hasMany("posts"),
    mostRelevantPost: r.a.hasOne("mostRelevantPost"),
    lastReadAt: r.a.attribute("lastReadAt", r.a.transformDate),
    lastReadPostNumber: r.a.attribute("lastReadPostNumber"),
    isUnread: Object(o.a)("unreadCount", function (t) {
      return !!t;
    }),
    isRead: Object(o.a)("unreadCount", function (t) {
      return app.session.user && !t;
    }),
    hiddenAt: r.a.attribute("hiddenAt", r.a.transformDate),
    hiddenUser: r.a.hasOne("hiddenUser"),
    isHidden: Object(o.a)("hiddenAt", function (t) {
      return !!t;
    }),
    canReply: r.a.attribute("canReply"),
    canRename: r.a.attribute("canRename"),
    canHide: r.a.attribute("canHide"),
    canDelete: r.a.attribute("canDelete"),
    removePost: function (t) {
      var e = this.data.relationships;
      var n = e && e.posts;
      if (n) {
        n.data.some(function (e, i) {
          if (t === e.id) {
            n.data.splice(i, 1);
            return true;
          }
        });
      }
    },
    unreadCount: function () {
      var t = app.session.user;
      if (t && t.markedAllAsReadAt() < this.lastPostedAt()) {
        var e = Math.max(0, this.lastPostNumber() - (this.lastReadPostNumber() || 0));
        return Math.min(e, this.commentCount());
      }
      return 0;
    },
    badges: function () {
      var t = new s.a();
      if (this.isHidden()) {
        t.add("hidden", m(a.a, {
          type: "hidden",
          icon: "fas fa-trash",
          label: app.translator.trans("core.lib.badge.hidden_tooltip")
        }));
      }
      return t;
    },
    postIds: function () {
      var t = this.data.relationships.posts;
      if (t) {
        return t.data.map(function (t) {
          return t.id;
        });
      } else {
        return [];
      }
    }
  });
}, function (t, e, n) {
  "use strict";

  function i(t, e, n) {
    (Array.isArray(e) ? e : [e]).forEach(function (e) {
      var i = t[e];
      t[e] = function () {
        for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++) {
          e[r] = arguments[r];
        }
        var o = i ? i.apply(this, e) : undefined;
        n.apply(this, [o].concat(e));
        return o;
      };
      Object.assign(t[e], i);
    });
  }
  function r(t, e, n) {
    (Array.isArray(e) ? e : [e]).forEach(function (e) {
      var i = t[e];
      t[e] = function () {
        for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++) {
          e[r] = arguments[r];
        }
        return n.apply(this, [i.bind(this)].concat(e));
      };
      Object.assign(t[e], i);
    });
  }
  n.r(e);
  n.d(e, "extend", function () {
    return i;
  });
  n.d(e, "override", function () {
    return r;
  });
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return s;
  });
  var i = n(0);
  var r = n(3);
  var o = n(6);
  var s = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    e.prototype.view = function (t) {
      return m("fieldset", {
        className: this.attrs.className
      }, m("legend", null, this.attrs.label), m("ul", null, Object(o.a)(t.children)));
    };
    return e;
  }(r.a);
}, function (t, e, n) {
  "use strict";

  function i(t, e) {
    return t && (t === e || t.prototype instanceof e);
  }
  n.d(e, "a", function () {
    return i;
  });
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return s;
  });
  var i = n(24);
  var r = n.n(i);
  var o = n(25);
  function s(t) {
    var e = r()(t);
    var n = e.format();
    var i = e.format("LLLL");
    var s = Object(o.a)(t);
    return m("time", {
      pubdate: true,
      datetime: n,
      title: i,
      "data-humantime": true
    }, s);
  }
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return a;
  });
  var i = n(104);
  var r = n.n(i);
  var o = n(34);
  var s = n(4);
  var a = function () {
    function t(t, e) {
      this.el = undefined;
      this.el = document.createElement("textarea");
      this.build(t, e);
    }
    var e = t.prototype;
    e.build = function (t, e) {
      var n = this;
      this.el.className = e.classNames.join(" ");
      this.el.disabled = e.disabled;
      this.el.placeholder = e.placeholder;
      this.el.value = e.value;
      function i(t) {
        e.inputListeners.forEach(function (t) {
          t();
        });
        t.redraw = false;
      }
      this.el.oninput = function (t) {
        e.oninput(n.el.value);
        i(t);
      };
      this.el.onclick = i;
      this.el.onkeyup = i;
      this.el.addEventListener("keydown", function (t) {
        n.keyHandlers(e).toArray().forEach(function (e) {
          return e(t);
        });
      });
      t.append(this.el);
    };
    e.keyHandlers = function (t) {
      var e = new s.a();
      e.add("submit", function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          t.onsubmit();
        }
      });
      return e;
    };
    e.moveCursorTo = function (t) {
      this.setSelectionRange(t, t);
    };
    e.getSelectionRange = function () {
      return [this.el.selectionStart, this.el.selectionEnd];
    };
    e.getLastNChars = function (t) {
      return this.el.value.slice(Math.max(0, this.el.selectionStart - t), this.el.selectionStart);
    };
    e.insertAtCursor = function (t) {
      this.insertAt(this.el.selectionStart, t);
    };
    e.insertAt = function (t, e) {
      this.insertBetween(t, t, e);
    };
    e.insertBetween = function (t, e, n) {
      this.setSelectionRange(t, e);
      var i = t + n.length;
      Object(o.a)(this.el, {
        text: n,
        selectionStart: i,
        selectionEnd: i
      });
    };
    e.replaceBeforeCursor = function (t, e) {
      this.insertBetween(t, this.el.selectionStart, e);
    };
    e.setSelectionRange = function (t, e) {
      this.el.setSelectionRange(t, e);
      this.focus();
    };
    e.getCaretCoordinates = function (t) {
      var e = r()(this.el, t);
      return {
        top: e.top - this.el.scrollTop,
        left: e.left
      };
    };
    e.disabled = function (t) {
      this.el.disabled = t;
    };
    e.focus = function () {
      this.el.focus();
    };
    e.destroy = function () {
      this.el.remove();
    };
    return t;
  }();
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return u;
  });
  var i = n(0);
  var r = n(3);
  var o = n(15);
  var s = n(5);
  var a = n(7);
  var c = n(37);
  var u = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    var n = e.prototype;
    n.view = function (t) {
      if (this.attrs.state === "0") {
        this.attrs.state = false;
      }
      var e = Object(a.a)(["Checkbox", this.attrs.state ? "on" : "off", this.attrs.className, this.attrs.loading && "loading", this.attrs.disabled && "disabled"]);
      return m("label", {
        className: e
      }, m("input", {
        type: "checkbox",
        checked: this.attrs.state,
        disabled: this.attrs.disabled,
        onchange: Object(c.a)("checked", this.onchange.bind(this))
      }), m("div", {
        className: "Checkbox-display"
      }, this.getDisplay()), t.children);
    };
    n.getDisplay = function () {
      if (this.attrs.loading) {
        return m(o.a, {
          display: "unset",
          size: "small"
        });
      } else {
        return Object(s.a)(this.attrs.state ? "fas fa-check" : "fas fa-times");
      }
    };
    n.onchange = function (t) {
      if (this.attrs.onchange) {
        this.attrs.onchange(t, this);
      }
    };
    return e;
  }(r.a);
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return r;
  });
  var i = n(42);
  var r = function () {
    function t(t, e = {}) {
      this.type = t;
      this.data = e;
    }
    var e = t.prototype;
    e.matches = function (t, e) {
      var n = this;
      if (e === undefined) {
        e = {};
      }
      return !!Object(i.a)(this.type, t) && Object.keys(e).every(function (t) {
        return n.data[t] === e[t];
      });
    };
    e.get = function (t) {
      return this.data[t];
    };
    e.set = function (t, e) {
      this.data[t] = e;
    };
    return t;
  }();
}, function (t, e) {
  t.exports = function (t, e, n) {
    if (e in t) {
      Object.defineProperty(t, e, {
        value: n,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      t[e] = n;
    }
    return t;
  };
  t.exports.default = t.exports;
  t.exports.__esModule = true;
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return i;
  });
  function i(t, e, n, i) {
    this.status = undefined;
    this.options = undefined;
    this.xhr = undefined;
    this.responseText = undefined;
    this.response = undefined;
    this.alert = undefined;
    this.status = t;
    this.responseText = e;
    this.options = n;
    this.xhr = i;
    try {
      this.response = JSON.parse(e);
    } catch (t) {
      this.response = null;
    }
    this.alert = null;
  }
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return a;
  });
  var i = n(0);
  var r = n(3);
  var o = n(2);
  var s = n(16);
  var a = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    var n = e.prototype;
    n.view = function () {
      var t = app;
      var e = t.history;
      var n = t.pane;
      return m("div", {
        className: "Navigation ButtonGroup " + (this.attrs.className || ""),
        onmouseenter: n && n.show.bind(n),
        onmouseleave: n && n.onmouseleave.bind(n)
      }, e.canGoBack() ? [this.getBackButton(), this.getPaneButton()] : this.getDrawerButton());
    };
    n.getBackButton = function () {
      var t = app.history;
      var e = t.getPrevious() || {};
      return s.a.component({
        className: "Button Navigation-back Button--icon",
        href: t.backUrl(),
        icon: "fas fa-chevron-left",
        title: e.title,
        onclick: function (e) {
          if (!e.shiftKey && !e.ctrlKey && !e.metaKey && e.which !== 2) {
            e.preventDefault();
            t.back();
          }
        }
      });
    };
    n.getPaneButton = function () {
      var t = app.pane;
      if (t && t.active) {
        return o.a.component({
          className: "Button Button--icon Navigation-pin" + (t.pinned ? " active" : ""),
          onclick: t.togglePinned.bind(t),
          icon: "fas fa-thumbtack"
        });
      } else {
        return "";
      }
    };
    n.getDrawerButton = function () {
      if (!this.attrs.drawer) {
        return "";
      }
      var t = app.drawer;
      var e = app.session.user;
      return o.a.component({
        className: "Button Button--icon Navigation-drawer" + (e && e.newNotificationCount() ? " new" : ""),
        onclick: function (e) {
          e.stopPropagation();
          t.show();
        },
        icon: "fas fa-bars"
      });
    };
    return e;
  }(r.a);
}, function (t, e) {
  var n;
  n = function () {
    return this;
  }();
  try {
    n = n || new Function("return this")();
  } catch (t) {
    if (typeof window == "object") {
      n = window;
    }
  }
  t.exports = n;
}, function (t, e, n) {
  "use strict";

  function i(t, e, n, i) {
    var r;
    var o = false;
    var s = 0;
    function a() {
      if (r) {
        clearTimeout(r);
      }
    }
    function c() {
      for (var c = arguments.length, u = new Array(c), l = 0; l < c; l++) {
        u[l] = arguments[l];
      }
      var d = this;
      var p = Date.now() - s;
      function h() {
        s = Date.now();
        n.apply(d, u);
      }
      function f() {
        r = undefined;
      }
      if (!o) {
        if (i && !r) {
          h();
        }
        a();
        if (i === undefined && p > t) {
          h();
        } else if (e !== true) {
          r = setTimeout(i ? f : h, i === undefined ? t - p : t);
        }
      }
    }
    if (typeof e != "boolean") {
      i = n;
      n = e;
      e = undefined;
    }
    c.cancel = function () {
      a();
      o = true;
    };
    return c;
  }
  function r(t, e, n) {
    if (n === undefined) {
      return i(t, e, false);
    } else {
      return i(t, n, e !== false);
    }
  }
  n.d(e, "a", function () {
    return r;
  });
  n.d(e, "b", function () {
    return i;
  });
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return r;
  });
  var i = n(11);
  function r(t, e = null, n = {}) {
    var r = Object(i.a)({}, n);
    r.state = r.state || {};
    r.state.key = Date.now();
    m.route.set(t, e, r);
  }
}, function (t, e, n) {
  "use strict";

  (function (e) {
    t.exports = function () {
      if (typeof globalThis == "object") {
        return globalThis;
      }
      var t;
      try {
        t = this || new Function("return this")();
      } catch (t) {
        if (typeof window == "object") {
          return window;
        }
        if (typeof self == "object") {
          return self;
        }
        if (e !== undefined) {
          return e;
        }
      }
      return t;
    }();
  }).call(this, n(50));
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return i;
  });
  var i = function () {
    function t() {
      for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) {
        e[n] = arguments[n];
      }
      this.callbacks = e;
      this.data = {};
      this.needsRebuild();
    }
    var e = t.prototype;
    e.needsRebuild = function () {
      var t = this;
      var e = false;
      this.callbacks.forEach(function (n, i) {
        var r = n();
        if (r !== t.data[i]) {
          t.data[i] = r;
          e = true;
        }
      });
      return e;
    };
    e.check = function () {
      for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) {
        e[n] = arguments[n];
      }
      this.callbacks = this.callbacks.concat(e);
      this.needsRebuild();
    };
    e.invalidate = function () {
      this.data = {};
    };
    return t;
  }();
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return r;
  });
  var i = n(0);
  var r = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    e.prototype.view = function () {
      return m("div", {
        className: "Placeholder"
      }, m("p", null, this.attrs.text));
    };
    return e;
  }(n(3).a);
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return d;
  });
  var i = n(0);
  var r = n(13);
  var o = n(2);
  var s = n(29);
  var a = n(10);
  var c = n(8);
  var u = n(4);
  var l = n(9);
  var d = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      var n = this;
      t.prototype.oninit.call(this, e);
      var i = this.attrs.user;
      this.username = Object(l.a)(i.username() || "");
      this.email = Object(l.a)(i.email() || "");
      this.isEmailConfirmed = Object(l.a)(i.isEmailConfirmed() || false);
      this.setPassword = Object(l.a)(false);
      this.password = Object(l.a)(i.password() || "");
      this.groups = {};
      app.store.all("groups").filter(function (t) {
        return [a.a.GUEST_ID, a.a.MEMBER_ID].indexOf(t.id()) === -1;
      }).forEach(function (t) {
        return n.groups[t.id()] = Object(l.a)(i.groups().indexOf(t) !== -1);
      });
    };
    n.className = function () {
      return "EditUserModal Modal--small";
    };
    n.title = function () {
      return app.translator.trans("core.lib.edit_user.title");
    };
    n.content = function () {
      var t = this.fields().toArray();
      return m("div", {
        className: "Modal-body"
      }, t.length > 1 ? m("div", {
        className: "Form"
      }, this.fields().toArray()) : app.translator.trans("core.lib.edit_user.nothing_available"));
    };
    n.fields = function () {
      var t = this;
      var e = new u.a();
      if (app.session.user.canEditCredentials()) {
        e.add("username", m("div", {
          className: "Form-group"
        }, m("label", null, app.translator.trans("core.lib.edit_user.username_heading")), m("input", {
          className: "FormControl",
          placeholder: Object(c.a)(app.translator.trans("core.lib.edit_user.username_label")),
          bidi: this.username,
          disabled: this.nonAdminEditingAdmin()
        })), 40);
        if (app.session.user !== this.attrs.user) {
          e.add("email", m("div", {
            className: "Form-group"
          }, m("label", null, app.translator.trans("core.lib.edit_user.email_heading")), m("div", null, m("input", {
            className: "FormControl",
            placeholder: Object(c.a)(app.translator.trans("core.lib.edit_user.email_label")),
            bidi: this.email,
            disabled: this.nonAdminEditingAdmin()
          })), !this.isEmailConfirmed() && this.userIsAdmin(app.session.user) ? m("div", null, o.a.component({
            className: "Button Button--block",
            loading: this.loading,
            onclick: this.activate.bind(this)
          }, app.translator.trans("core.lib.edit_user.activate_button"))) : ""), 30);
          e.add("password", m("div", {
            className: "Form-group"
          }, m("label", null, app.translator.trans("core.lib.edit_user.password_heading")), m("div", null, m("label", {
            className: "checkbox"
          }, m("input", {
            type: "checkbox",
            onchange: function (e) {
              t.setPassword(e.target.checked);
              m.redraw.sync();
              if (e.target.checked) {
                t.$("[name=password]").select();
              }
              e.redraw = false;
            },
            disabled: this.nonAdminEditingAdmin()
          }), app.translator.trans("core.lib.edit_user.set_password_label")), this.setPassword() ? m("input", {
            className: "FormControl",
            type: "password",
            name: "password",
            placeholder: Object(c.a)(app.translator.trans("core.lib.edit_user.password_label")),
            bidi: this.password,
            disabled: this.nonAdminEditingAdmin()
          }) : "")), 20);
        }
      }
      if (app.session.user.canEditGroups()) {
        e.add("groups", m("div", {
          className: "Form-group EditUserModal-groups"
        }, m("label", null, app.translator.trans("core.lib.edit_user.groups_heading")), m("div", null, Object.keys(this.groups).map(function (t) {
          return app.store.getById("groups", t);
        }).map(function (e) {
          return m("label", {
            className: "checkbox"
          }, m("input", {
            type: "checkbox",
            bidi: t.groups[e.id()],
            disabled: e.id() === a.a.ADMINISTRATOR_ID && (t.attrs.user === app.session.user || !t.userIsAdmin(app.session.user))
          }), s.a.component({
            group: e,
            label: ""
          }), " ", e.nameSingular());
        }))), 10);
      }
      e.add("submit", m("div", {
        className: "Form-group"
      }, o.a.component({
        className: "Button Button--primary",
        type: "submit",
        loading: this.loading
      }, app.translator.trans("core.lib.edit_user.submit_button"))), -10);
      return e;
    };
    n.activate = function () {
      var t = this;
      this.loading = true;
      var e = {
        username: this.username(),
        isEmailConfirmed: true
      };
      this.attrs.user.save(e, {
        errorHandler: this.onerror.bind(this)
      }).then(function () {
        t.isEmailConfirmed(true);
        t.loading = false;
        m.redraw();
      }).catch(function () {
        t.loading = false;
        m.redraw();
      });
    };
    n.data = function () {
      var t = this;
      var e = {
        relationships: {}
      };
      if (this.attrs.user.canEditCredentials() && !this.nonAdminEditingAdmin()) {
        e.username = this.username();
        if (app.session.user !== this.attrs.user) {
          e.email = this.email();
        }
        if (this.setPassword()) {
          e.password = this.password();
        }
      }
      if (this.attrs.user.canEditGroups()) {
        e.relationships.groups = Object.keys(this.groups).filter(function (e) {
          return t.groups[e]();
        }).map(function (t) {
          return app.store.getById("groups", t);
        });
      }
      return e;
    };
    n.onsubmit = function (t) {
      var e = this;
      t.preventDefault();
      this.loading = true;
      this.attrs.user.save(this.data(), {
        errorHandler: this.onerror.bind(this)
      }).then(this.hide.bind(this)).catch(function () {
        e.loading = false;
        m.redraw();
      });
    };
    n.nonAdminEditingAdmin = function () {
      return this.userIsAdmin(this.attrs.user) && !this.userIsAdmin(app.session.user);
    };
    n.userIsAdmin = function (t) {
      return t.groups().some(function (t) {
        return t.id() === a.a.ADMINISTRATOR_ID;
      });
    };
    return e;
  }(r.a);
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return i;
  });
  var i = function () {
    function t(t = {}, e = 1, n = 20) {
      this.location = undefined;
      this.pageSize = undefined;
      this.pages = [];
      this.params = {};
      this.initialLoading = false;
      this.loadingPrev = false;
      this.loadingNext = false;
      this.params = t;
      this.location = {
        page: e
      };
      this.pageSize = n;
    }
    var e = t.prototype;
    e.clear = function () {
      this.pages = [];
      m.redraw();
    };
    e.loadPrev = function () {
      var t = this;
      if (this.loadingPrev || this.getLocation().page === 1) {
        return Promise.resolve();
      }
      this.loadingPrev = true;
      var e = this.getPrevPageNumber();
      return this.loadPage(e).then(this.parseResults.bind(this, e)).finally(function () {
        return t.loadingPrev = false;
      });
    };
    e.loadNext = function () {
      var t = this;
      if (this.loadingNext) {
        return Promise.resolve();
      }
      this.loadingNext = true;
      var e = this.getNextPageNumber();
      return this.loadPage(e).then(this.parseResults.bind(this, e)).finally(function () {
        return t.loadingNext = false;
      });
    };
    e.parseResults = function (t, e) {
      var n;
      var i = Number(t);
      var r = ((n = e.payload) == null ? undefined : n.links) || {};
      var o = {
        number: i,
        items: e,
        hasNext: !!r.next,
        hasPrev: !!r.prev
      };
      if (this.isEmpty() || i > this.getNextPageNumber() - 1) {
        this.pages.push(o);
      } else {
        this.pages.unshift(o);
      }
      this.location = {
        page: i
      };
      m.redraw();
    };
    e.loadPage = function (t = 1) {
      var e = this.requestParams();
      e.page = {
        offset: this.pageSize * (t - 1)
      };
      if (Array.isArray(e.include)) {
        e.include = e.include.join(",");
      }
      return app.store.find(this.type, e);
    };
    e.requestParams = function () {
      return this.params;
    };
    e.refreshParams = function (t, e) {
      if (this.isEmpty() || this.paramsChanged(t)) {
        this.params = t;
        return this.refresh(e);
      }
    };
    e.refresh = function (t) {
      var e = this;
      if (t === undefined) {
        t = 1;
      }
      this.initialLoading = true;
      this.loadingPrev = false;
      this.loadingNext = false;
      this.clear();
      this.location = {
        page: t
      };
      return this.loadPage().then(function (t) {
        e.pages = [];
        e.parseResults(e.location.page, t);
      }).finally(function () {
        return e.initialLoading = false;
      });
    };
    e.getPages = function () {
      return this.pages;
    };
    e.getLocation = function () {
      return this.location;
    };
    e.isLoading = function () {
      return this.initialLoading || this.loadingNext || this.loadingPrev;
    };
    e.isInitialLoading = function () {
      return this.initialLoading;
    };
    e.isLoadingPrev = function () {
      return this.loadingPrev;
    };
    e.isLoadingNext = function () {
      return this.loadingNext;
    };
    e.hasItems = function () {
      return !!this.getAllItems().length;
    };
    e.isEmpty = function () {
      return !this.isInitialLoading() && !this.hasItems();
    };
    e.hasPrev = function () {
      var t;
      return (t = this.pages[0]) != null && !!t.hasPrev;
    };
    e.hasNext = function () {
      var t;
      return (t = this.pages[this.pages.length - 1]) != null && !!t.hasNext;
    };
    e.getParams = function () {
      return this.params;
    };
    e.getNextPageNumber = function () {
      var t;
      var e = (t = this.pages[this.pages.length - 1]) == null ? undefined : t.number;
      if (e && !isNaN(e)) {
        return e + 1;
      } else {
        return this.location.page;
      }
    };
    e.getPrevPageNumber = function () {
      var t;
      var e = (t = this.pages[0]) == null ? undefined : t.number;
      if (e && !isNaN(e)) {
        return Math.max(e - 1, 1);
      } else {
        return this.location.page;
      }
    };
    e.paramsChanged = function (t) {
      var e = this;
      return Object.keys(t).some(function (n) {
        return e.getParams()[n] !== t[n];
      });
    };
    e.getAllItems = function () {
      return this.getPages().map(function (t) {
        return t.items;
      }).flat();
    };
    return t;
  }();
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return o;
  });
  var i = n(11);
  var r = n(0);
  var o = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(r.a)(e, t);
    var n = e.prototype;
    n.view = function () {
      var t = this.attrs.state.modal;
      return m("div", {
        className: "ModalManager modal fade"
      }, t ? t.componentClass.component(Object(i.a)({}, t.attrs, {
        animateShow: this.animateShow.bind(this),
        animateHide: this.animateHide.bind(this),
        state: this.attrs.state
      })) : "");
    };
    n.oncreate = function (e) {
      t.prototype.oncreate.call(this, e);
      this.$().on("hidden.bs.modal", this.attrs.state.close.bind(this.attrs.state));
    };
    n.animateShow = function (t) {
      var e = !!this.attrs.state.modal.componentClass.isDismissible;
      if (this.$().hasClass("in")) {
        t();
      } else {
        this.$().one("shown.bs.modal", t).modal({
          backdrop: e || "static",
          keyboard: e
        }).modal("show");
      }
    };
    n.animateHide = function () {
      this.$().modal("hide");
    };
    return e;
  }(n(3).a);
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return o;
  });
  var i = n(0);
  var r = n(3);
  n(27);
  var o = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.state = this.attrs.state;
    };
    n.view = function () {
      var t = this;
      return m("div", {
        className: "AlertManager"
      }, Object.entries(this.state.getActiveAlerts()).map(function (e) {
        var n = e[0];
        var i = e[1];
        return m("div", {
          className: "AlertManager-alert"
        }, m(i.componentClass, Object.assign({}, i.attrs, {
          ondismiss: t.state.dismiss.bind(t.state, n)
        }), i.children));
      }));
    };
    return e;
  }(r.a);
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return r;
  });
  var i = n(0);
  var r = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    var n = e.prototype;
    n.className = function () {
      return "RequestErrorModal Modal--large";
    };
    n.title = function () {
      if (this.attrs.error.xhr) {
        return this.attrs.error.xhr.status + " " + this.attrs.error.xhr.statusText;
      } else {
        return "";
      }
    };
    n.content = function () {
      var t;
      var e = this.attrs;
      var n = e.error;
      var i = e.formattedError;
      if (i) {
        t = i.join("\n\n");
      } else {
        try {
          var r = n.response || JSON.parse(n.responseText);
          t = JSON.stringify(r, null, 2);
        } catch (e) {
          t = n.responseText;
        }
      }
      return m("div", {
        className: "Modal-body"
      }, m("pre", null, this.attrs.error.options.method, " ", this.attrs.error.options.url, m("br", null), m("br", null), t));
    };
    return e;
  }(n(13).a);
}, function (t, e) {
  t.exports = function (t, e) {
    if (!(t instanceof e)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  t.exports.default = t.exports;
  t.exports.__esModule = true;
}, function (t, e) {
  function n(t, e) {
    for (var n = 0; n < e.length; n++) {
      var i = e[n];
      i.enumerable = i.enumerable || false;
      i.configurable = true;
      if ("value" in i) {
        i.writable = true;
      }
      Object.defineProperty(t, i.key, i);
    }
  }
  t.exports = function (t, e, i) {
    if (e) {
      n(t.prototype, e);
    }
    if (i) {
      n(t, i);
    }
    return t;
  };
  t.exports.default = t.exports;
  t.exports.__esModule = true;
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return i;
  });
  var i = function () {
    function t(t) {
      this.data = {};
      this.models = t;
    }
    var e = t.prototype;
    e.pushPayload = function (t) {
      if (t.included) {
        t.included.map(this.pushObject.bind(this));
      }
      var e = t.data instanceof Array ? t.data.map(this.pushObject.bind(this)) : this.pushObject(t.data);
      e.payload = t;
      return e;
    };
    e.pushObject = function (t) {
      if (!this.models[t.type]) {
        return null;
      }
      var e = this.data[t.type] = this.data[t.type] || {};
      if (e[t.id]) {
        e[t.id].pushData(t);
      } else {
        e[t.id] = this.createRecord(t.type, t);
      }
      e[t.id].exists = true;
      return e[t.id];
    };
    e.find = function (t, e, n = {}, i = {}) {
      var r = n;
      var o = app.forum.attribute("apiUrl") + "/" + t;
      if (e instanceof Array) {
        o += "?filter[id]=" + e.join(",");
      } else if (typeof e == "object") {
        r = e;
      } else if (e) {
        o += "/" + e;
      }
      return app.request(Object.assign({
        method: "GET",
        url: o,
        params: r
      }, i)).then(this.pushPayload.bind(this));
    };
    e.getById = function (t, e) {
      return this.data[t] && this.data[t][e];
    };
    e.getBy = function (t, e, n) {
      return this.all(t).filter(function (t) {
        return t[e]() === n;
      })[0];
    };
    e.all = function (t) {
      var e = this.data[t];
      if (e) {
        return Object.keys(e).map(function (t) {
          return e[t];
        });
      } else {
        return [];
      }
    };
    e.remove = function (t) {
      delete this.data[t.data.type][t.id()];
    };
    e.createRecord = function (t, e = {}) {
      e.type = e.type || t;
      return new this.models[t](e, this);
    };
    return t;
  }();
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return i;
  });
  var i = function () {
    function t(t, e) {
      this.user = t;
      this.csrfToken = e;
    }
    var e = t.prototype;
    e.login = function (t, e = {}) {
      return app.request(Object.assign({
        method: "POST",
        url: app.forum.attribute("baseUrl") + "/login",
        body: t
      }, e));
    };
    e.logout = function () {
      window.location = app.forum.attribute("baseUrl") + "/logout?token=" + this.csrfToken;
    };
    return t;
  }();
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return i;
  });
  var i = function () {
    function t() {
      var t = this;
      $("#content").click(function (e) {
        if (t.isOpen()) {
          e.preventDefault();
          t.hide();
        }
      });
    }
    var e = t.prototype;
    e.isOpen = function () {
      return $("#app").hasClass("drawerOpen");
    };
    e.hide = function () {
      var t = $("#app");
      if (t.hasClass("drawerOpen")) {
        var e = $("#drawer");
        e.css("visibility", "visible").one("transitionend", function () {
          return e.css("visibility", "");
        });
        t.removeClass("drawerOpen");
        if (this.$backdrop) {
          this.$backdrop.remove();
        }
      }
    };
    e.show = function () {
      var t = this;
      $("#app").addClass("drawerOpen");
      this.$backdrop = $("<div/>").addClass("drawer-backdrop fade").appendTo("body").click(function () {
        return t.hide();
      });
      setTimeout(function () {
        return t.$backdrop.addClass("in");
      });
    };
    return t;
  }();
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return r;
  });
  var i = n(38);
  function r(t, e = "") {
    var n = {};
    for (var r in t) {
      var o = t[r];
      if ("resolver" in o) {
        n[e + o.path] = o.resolver;
      } else {
        if (!("component" in o)) {
          throw new Error("Either a resolver or a component must be provided for the route [" + r + "]");
        }
        var s = "resolverClass" in o ? o.resolverClass : i.a;
        n[e + o.path] = new s(o.component, r);
      }
    }
    return n;
  }
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return o;
  });
  var i = n(25);
  function r() {
    $("[data-humantime]").each(function () {
      var t = $(this);
      var e = Object(i.a)(t.attr("datetime"));
      t.html(e);
    });
  }
  function o() {
    setInterval(r, 10000);
  }
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return r;
  });
  var i = n(0);
  var r = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    e.prototype.apiEndpoint = function () {
      return "/";
    };
    return e;
  }(n(1).a);
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return u;
  });
  var i = n(0);
  var r = n(1);
  var o = n(70);
  var s = n(4);
  var a = n(20);
  var c = n(29);
  var u = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    return e;
  }(r.a);
  Object.assign(u.prototype, {
    username: r.a.attribute("username"),
    slug: r.a.attribute("slug"),
    displayName: r.a.attribute("displayName"),
    email: r.a.attribute("email"),
    isEmailConfirmed: r.a.attribute("isEmailConfirmed"),
    password: r.a.attribute("password"),
    avatarUrl: r.a.attribute("avatarUrl"),
    preferences: r.a.attribute("preferences"),
    groups: r.a.hasMany("groups"),
    joinTime: r.a.attribute("joinTime", r.a.transformDate),
    lastSeenAt: r.a.attribute("lastSeenAt", r.a.transformDate),
    markedAllAsReadAt: r.a.attribute("markedAllAsReadAt", r.a.transformDate),
    unreadNotificationCount: r.a.attribute("unreadNotificationCount"),
    newNotificationCount: r.a.attribute("newNotificationCount"),
    discussionCount: r.a.attribute("discussionCount"),
    commentCount: r.a.attribute("commentCount"),
    canEdit: r.a.attribute("canEdit"),
    canEditCredentials: r.a.attribute("canEditCredentials"),
    canEditGroups: r.a.attribute("canEditGroups"),
    canDelete: r.a.attribute("canDelete"),
    avatarColor: null,
    color: Object(a.a)("username", "avatarUrl", "avatarColor", function (t, e, n) {
      if (n) {
        return "rgb(" + n.join(", ") + ")";
      } else if (e) {
        this.calculateAvatarColor();
        return "";
      } else {
        return "#" + Object(o.a)(t);
      }
    }),
    isOnline: function () {
      return dayjs().subtract(5, "minutes").isBefore(this.lastSeenAt());
    },
    badges: function () {
      var t = new s.a();
      var e = this.groups();
      if (e) {
        e.forEach(function (e) {
          t.add("group" + e.id(), c.a.component({
            group: e
          }));
        });
      }
      return t;
    },
    calculateAvatarColor: function () {
      var t = new Image();
      var e = this;
      t.onload = function () {
        var t = new ColorThief();
        e.avatarColor = t.getColor(this);
        e.freshness = new Date();
        m.redraw();
      };
      t.crossOrigin = "anonymous";
      t.src = this.avatarUrl();
    },
    savePreferences: function (t) {
      var e = this.preferences();
      Object.assign(e, t);
      return this.save({
        preferences: e
      });
    }
  });
}, function (t, e, n) {
  "use strict";

  function i(t) {
    var e = 0;
    for (var n = 0; n < t.length; n++) {
      e += t.charCodeAt(n);
    }
    var i = function (t, e, n) {
      var i;
      var r;
      var o;
      var s = Math.floor(t * 6);
      var a = t * 6 - s;
      var c = n * (1 - e);
      var u = n * (1 - a * e);
      var l = n * (1 - (1 - a) * e);
      switch (s % 6) {
        case 0:
          i = n;
          r = l;
          o = c;
          break;
        case 1:
          i = u;
          r = n;
          o = c;
          break;
        case 2:
          i = c;
          r = n;
          o = l;
          break;
        case 3:
          i = c;
          r = u;
          o = n;
          break;
        case 4:
          i = l;
          r = c;
          o = n;
          break;
        case 5:
          i = n;
          r = c;
          o = u;
      }
      return {
        r: Math.floor(i * 255),
        g: Math.floor(r * 255),
        b: Math.floor(o * 255)
      };
    }(e % 360 / 360, 0.3, 0.9);
    return "" + i.r.toString(16) + i.g.toString(16) + i.b.toString(16);
  }
  n.d(e, "a", function () {
    return i;
  });
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return a;
  });
  var i = n(0);
  var r = n(1);
  var o = n(20);
  var s = n(31);
  var a = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    return e;
  }(r.a);
  Object.assign(a.prototype, {
    number: r.a.attribute("number"),
    discussion: r.a.hasOne("discussion"),
    createdAt: r.a.attribute("createdAt", r.a.transformDate),
    user: r.a.hasOne("user"),
    contentType: r.a.attribute("contentType"),
    content: r.a.attribute("content"),
    contentHtml: r.a.attribute("contentHtml"),
    contentPlain: Object(o.a)("contentHtml", s.getPlainContent),
    editedAt: r.a.attribute("editedAt", r.a.transformDate),
    editedUser: r.a.hasOne("editedUser"),
    isEdited: Object(o.a)("editedAt", function (t) {
      return !!t;
    }),
    hiddenAt: r.a.attribute("hiddenAt", r.a.transformDate),
    hiddenUser: r.a.hasOne("hiddenUser"),
    isHidden: Object(o.a)("hiddenAt", function (t) {
      return !!t;
    }),
    canEdit: r.a.attribute("canEdit"),
    canHide: r.a.attribute("canHide"),
    canDelete: r.a.attribute("canDelete")
  });
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return o;
  });
  var i = n(0);
  var r = n(1);
  var o = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    return e;
  }(r.a);
  Object.assign(o.prototype, {
    contentType: r.a.attribute("contentType"),
    content: r.a.attribute("content"),
    createdAt: r.a.attribute("createdAt", r.a.transformDate),
    isRead: r.a.attribute("isRead"),
    user: r.a.hasOne("user"),
    fromUser: r.a.hasOne("fromUser"),
    subject: r.a.hasOne("subject")
  });
}, function (t, e, n) {
  "use strict";

  e.a = function (t, e) {
    var n = new RegExp("(\\w+\\/)?(" + e + "|common)\\/");
    return new Proxy(t, {
      get: function (t, e) {
        return t[e] || t[e.replace(n, "$1")];
      }
    });
  };
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return H;
  });
  var i = n(61);
  var r = n.n(i);
  var o = n(62);
  var s = n.n(o);
  var a = n(106);
  var c = n.n(a);
  var u = n(107);
  var l = n.n(u);
  var d = n(91);
  var p = n.n(d);
  var h = n(108);
  var f = n.n(h);
  var v = n(47);
  var g = n.n(v);
  function b(t) {
    return t.reduce(function (t, e) {
      return t.concat(Array.isArray(e) ? b(e) : e);
    }, []);
  }
  function y(t) {
    var e = {};
    return function () {
      for (var n = arguments.length, i = new Array(n), r = 0; r < n; r++) {
        i[r] = arguments[r];
      }
      var o = i.length ? i.map(function (t) {
        if (t === null) {
          return "null";
        } else if (t === undefined) {
          return "undefined";
        } else if (typeof t == "function") {
          return t.toString();
        } else if (t instanceof Date) {
          return t.toISOString();
        } else {
          return JSON.stringify(t);
        }
      }).join("|") : "_(no-args)_";
      if (Object.prototype.hasOwnProperty.call(e, o)) {
        return e[o];
      }
      var s = t.apply(undefined, i);
      e[o] = s;
      return s;
    };
  }
  function w(t) {
    var e = function (t) {
      return /\s/.test(t);
    };
    var n = [];
    var i = {};
    var r = 0;
    for (var o = null, s = false, a = 0; a < t.length;) {
      if (s && (e(t[a]) || t[a] === "{")) {
        s = false;
        o = t.slice(r, a);
        if (t[a] === "{") {
          a--;
        }
      } else if (!s && !e(t[a])) {
        var c = t[a] === "{";
        if (o && c) {
          var u = x(t, a);
          if (u === -1) {
            throw new Error(`Unbalanced curly braces in string: "${t}"`);
          }
          i[o] = t.slice(a + 1, u);
          a = u;
          o = null;
        } else {
          if (o) {
            n.push(o);
            o = null;
          }
          s = true;
          r = a;
        }
      }
      a++;
    }
    if (s) {
      o = t.slice(r);
    }
    if (o) {
      n.push(o);
    }
    return {
      args: n,
      cases: i
    };
  }
  function x(t, e) {
    var n = 0;
    for (var i = e + 1; i < t.length; i++) {
      var r = t.charAt(i);
      if (r === "}") {
        if (n === 0) {
          return i;
        }
        n--;
      } else if (r === "{") {
        n++;
      }
    }
    return -1;
  }
  function N(t) {
    return function t(e, n, i, r = []) {
      if (!e) {
        return r;
      }
      if (i === 1) {
        r.push(e);
        return r;
      }
      var o = e.indexOf(n);
      if (o === -1) {
        r.push(e);
        return r;
      }
      var s = e.substring(0, o).trim();
      var a = e.substring(o + n.length + 1).trim();
      r.push(s);
      return t(a, n, i - 1, r);
    }(t.slice(1, -1), ",", 3);
  }
  function C(t, e) {
    var n = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(t);
      if (e) {
        i = i.filter(function (e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        });
      }
      n.push.apply(n, i);
    }
    return n;
  }
  function T(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e] ?? {};
      if (e % 2) {
        C(Object(n), true).forEach(function (e) {
          g()(t, e, n[e]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(t, Object.getOwnPropertyDescriptors(n));
      } else {
        C(Object(n)).forEach(function (e) {
          Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e));
        });
      }
    }
    return t;
  }
  var S = 0;
  function O(t, e) {
    for (var n = 0, i = "", r = 0, o = {}; n < t.length;) {
      if (t[n] !== "#" || r) {
        i += t[n];
      } else {
        var s = `__hashToken${S++}`;
        i += `{${s}, number}`;
        o[s] = e;
      }
      if (t[n] === "{") {
        r++;
      } else if (t[n] === "}") {
        r--;
      }
      n++;
    }
    return {
      caseBody: i,
      numberValues: o
    };
  }
  function k(t, e = "", _param, n, i) {
    var r = w(e);
    var o = r.args;
    var s = r.cases;
    var a = parseInt(t);
    o.forEach(function (t) {
      if (t.startsWith("offset:")) {
        a -= parseInt(t.slice("offset:".length));
      }
    });
    var c = [];
    if (a === 1) {
      c.push("one");
    }
    c.push(`=${a}`, "other");
    for (var u = 0; u < c.length; u++) {
      var l = c[u];
      if (l in s) {
        var d = O(s[l], a);
        var p = d.caseBody;
        var h = d.numberValues;
        return i(p, T(T({}, n), h));
      }
    }
    return t;
  }
  function j(t, e = "", _param2, n, i) {
    var r = w(e);
    var o = r.cases;
    if (t in o) {
      return i(o[t], n);
    } else if ("other" in o) {
      return i(o.other, n);
    } else {
      return t;
    }
  }
  function A(t, e, n) {
    return `<${t}>${n}</${t}>`;
  }
  function E(t, e, n) {
    var i = [];
    P(t, 0, 0, i, function (r, o, s, a, c, u) {
      if (o) {
        return {
          break: true
        };
      }
      var l = function (t, e, n, i) {
        var r;
        var o = 1;
        P(t, n, i, [], function (t, n, i, s, a, c) {
          if (i === e && (n ? o-- : o++, o === 0)) {
            r = {
              segmentIndex: s,
              segmentStart: c,
              segmentEnd: a
            };
            return {
              exit: true
            };
          }
          return {
            exit: false
          };
        });
        return r;
      }(t, s, a, c);
      if (!l) {
        throw new Error(`Unbalanced tags: no closing tag found for <${s}>`);
      }
      var d = l.segmentIndex === a;
      var p = t[l.segmentIndex];
      var h = [];
      if (d) {
        h.push(r.slice(c + 1, l.segmentStart));
      } else {
        h.push(r.slice(c + 1));
        for (var f = a + 1; f < l.segmentIndex; f++) {
          h.push(t[f]);
        }
        h.push(p.slice(0, l.segmentStart));
      }
      i.push(r.slice(0, u));
      i.push(n(s, e, E(h.filter(function (t) {
        return t !== "";
      }), e, n)));
      t.splice(l.segmentIndex + 1, 0, p.slice(l.segmentEnd + 1));
      return {
        processedSegment: true,
        newSegmentIndex: l.segmentIndex,
        break: true
      };
    });
    return i.filter(function (t) {
      return t !== "";
    });
  }
  function P(t, e, n, i, r) {
    var o;
    for (var s = e; s < t.length; s++) {
      var a = t[s];
      if (typeof a == "string") {
        var c = false;
        var u = null;
        var l = false;
        var d = false;
        for (var p = s === e ? n : 0; p < a.length; p++) {
          if (l || a[p] !== "<") {
            if (l && a[p] === ">") {
              var h = a.slice(u + 1 + c, p);
              var f = r(a, c, h, s, p, u);
              if (f.exit) {
                return;
              }
              if (f.newSegmentIndex) {
                s = f.newSegmentIndex;
              }
              if (f.processedSegment) {
                d = true;
              }
              if (f.break) {
                break;
              }
              c = false;
              u = null;
              l = false;
            } else if (l && (o = a[p], !/[a-zA-Z-_]/.test(o))) {
              c = false;
              u = null;
              l = false;
            }
          } else {
            u = p;
            l = true;
            if (a[p + 1] === "/") {
              c = true;
              p++;
            }
          }
        }
        if (!d) {
          i.push(a);
        }
      } else {
        i.push(a);
      }
    }
  }
  function _(t) {
    var e = function () {
      if (typeof Reflect == "undefined" || !Reflect.construct) {
        return false;
      }
      if (Reflect.construct.sham) {
        return false;
      }
      if (typeof Proxy == "function") {
        return true;
      }
      try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
        return true;
      } catch (t) {
        return false;
      }
    }();
    return function () {
      var n;
      var i = p()(t);
      if (e) {
        var r = p()(this).constructor;
        n = Reflect.construct(i, arguments, r);
      } else {
        n = i.apply(this, arguments);
      }
      return l()(this, n);
    };
  }
  var D = function (t) {
    c()(n, t);
    var e = _(n);
    function n(t) {
      var i;
      var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      r()(this, n);
      (i = e.call(this, t, o)).richHandler = s || A;
      return i;
    }
    s()(n, [{
      key: "rich",
      value: function (t, e = {}) {
        var n = b(this.process(t, e));
        return E(n, e, this.richHandler);
      }
    }]);
    return n;
  }(function () {
    function t(e) {
      var n = this;
      var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      r()(this, t);
      g()(this, "format", y(function (t, e = {}) {
        return b(n.process(t, e)).join("");
      }));
      this.locale = e;
      this.typeHandlers = i;
    }
    s()(t, [{
      key: "process",
      value: function (t, e = {}) {
        if (!t) {
          return [];
        }
        var n = t.indexOf("{");
        if (n !== -1) {
          var i = x(t, n);
          if (i === -1) {
            throw new Error(`Unbalanced curly braces in string: "${t}"`);
          }
          var r = t.substring(n, i + 1);
          if (r) {
            var o = [];
            var s = t.substring(0, n);
            if (s) {
              o.push(s);
            }
            var a = N(r);
            var c = f()(a, 3);
            var u = c[0];
            var l = c[1];
            var d = c[2];
            var p = e[u];
            if (p == null) {
              p = "";
            }
            var h = l && this.typeHandlers[l];
            o.push(h ? h(p, d, this.locale, e, this.process.bind(this)) : p);
            var m = t.substring(i + 1);
            if (m) {
              o.push(this.process(m, e));
            }
            return o;
          }
        }
        return [t];
      }
    }]);
    return t;
  }());
  function $(t, e) {
    var n = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(t);
      if (e) {
        i = i.filter(function (e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        });
      }
      n.push.apply(n, i);
    }
    return n;
  }
  function I(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e] ?? {};
      if (e % 2) {
        $(Object(n), true).forEach(function (e) {
          g()(t, e, n[e]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(t, Object.getOwnPropertyDescriptors(n));
      } else {
        $(Object(n)).forEach(function (e) {
          Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e));
        });
      }
    }
    return t;
  }
  function M(t, e, n) {
    var i = e[t] || m(t);
    var r = m.fragment(n).children;
    return I(I({}, i), {}, {
      children: r
    });
  }
  var L = n(19);
  var R = n(14);
  var H = function () {
    function t() {
      this.translations = {};
      this.formatter = new D(null, this.formatterTypeHandlers(), M);
    }
    var e = t.prototype;
    e.setLocale = function (t) {
      this.formatter.locale = t;
    };
    e.addTranslations = function (t) {
      Object.assign(this.translations, t);
    };
    e.formatterTypeHandlers = function () {
      return {
        plural: k,
        select: j
      };
    };
    e.preprocessParameters = function (t) {
      if ("user" in t) {
        var e = Object(R.a)(t, "user");
        t.username ||= Object(L.a)(e);
      }
      return t;
    };
    e.trans = function (t, e = {}) {
      var n = this.translations[t];
      if (n) {
        e = this.preprocessParameters(e);
        return this.formatter.rich(n, e);
      } else {
        return t;
      }
    };
    return t;
  }();
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return _;
  });
  var i = n(4);
  var r = n(2);
  var o = n(58);
  var s = n(59);
  var a = n(60);
  var c = n(74);
  var u = n(63);
  var l = n(64);
  var d = n(14);
  var p = n(65);
  var h = n(66);
  var f = n(48);
  var v = n(35);
  var g = n(67);
  var b = n(40);
  var y = n(68);
  var w = n(69);
  var x = n(39);
  var N = n(71);
  var C = n(10);
  var T = n(72);
  var S = n(46);
  var O = n(13);
  var k = function () {
    function t() {
      this.modal = null;
    }
    var e = t.prototype;
    e.show = function (t, e) {
      if (!(t.prototype instanceof O.a)) {
        console.error("The ModalManager can only show Modals.");
        throw new Error("The ModalManager can only show Modals.");
      }
      clearTimeout(this.closeTimeout);
      this.modal = {
        componentClass: t,
        attrs: e
      };
      m.redraw.sync();
    };
    e.close = function () {
      var t = this;
      if (this.modal) {
        this.closeTimeout = setTimeout(function () {
          t.modal = null;
          m.redraw();
        });
      }
    };
    return t;
  }();
  var j = n(27);
  var A = function () {
    function t() {
      this.activeAlerts = {};
      this.alertId = 0;
    }
    var e = t.prototype;
    e.getActiveAlerts = function () {
      return this.activeAlerts;
    };
    e.show = function (t, e, n) {
      var i;
      var r = j.a;
      var o = {};
      if (arguments.length == 1) {
        i = t;
      } else if (arguments.length == 2) {
        o = t;
        i = e;
      } else if (arguments.length == 3) {
        r = t;
        o = e;
        i = n;
      }
      this.activeAlerts[++this.alertId] = {
        children: i,
        attrs: o,
        componentClass: r
      };
      m.redraw();
      return this.alertId;
    };
    e.dismiss = function (t) {
      if (t && t in this.activeAlerts) {
        delete this.activeAlerts[t];
        m.redraw();
      }
    };
    e.clear = function () {
      this.activeAlerts = {};
      m.redraw();
    };
    return t;
  }();
  function E(t, e) {
    var n = typeof Symbol != "undefined" && t[Symbol.iterator] || t["@@iterator"];
    if (n) {
      return (n = n.call(t)).next.bind(n);
    }
    if (Array.isArray(t) || (n = function (t, e) {
      if (!t) {
        return;
      }
      if (typeof t == "string") {
        return P(t, e);
      }
      var n = Object.prototype.toString.call(t).slice(8, -1);
      if (n === "Object" && t.constructor) {
        n = t.constructor.name;
      }
      if (n === "Map" || n === "Set") {
        return Array.from(t);
      }
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
        return P(t, e);
      }
    }(t)) || e && t && typeof t.length == "number") {
      if (n) {
        t = n;
      }
      var i = 0;
      return function () {
        if (i >= t.length) {
          return {
            done: true
          };
        } else {
          return {
            done: false,
            value: t[i++]
          };
        }
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function P(t, e) {
    if (e == null || e > t.length) {
      e = t.length;
    }
    for (var n = 0, i = new Array(e); n < e; n++) {
      i[n] = t[n];
    }
    return i;
  }
  var _ = function () {
    function t() {
      this.forum = null;
      this.routes = {};
      this.initializers = new i.a();
      this.session = null;
      this.translator = new c.a();
      this.store = new u.a({
        forums: y.a,
        users: w.a,
        discussions: x.a,
        posts: N.a,
        groups: C.a,
        notifications: T.a
      });
      this.cache = {};
      this.booted = false;
      this.requestErrorAlert = null;
      this.current = new S.a(null);
      this.previous = new S.a(null);
      this.modal = new k();
      this.alerts = new A();
      this.data = undefined;
      this.title = "";
      this.titleCount = 0;
      this.initialRoute = undefined;
    }
    var e = t.prototype;
    e.load = function (t) {
      this.data = t;
      this.translator.setLocale(t.locale);
    };
    e.boot = function () {
      var t = this;
      this.initializers.toArray().forEach(function (e) {
        return e(t);
      });
      this.store.pushPayload({
        data: this.data.resources
      });
      this.forum = this.store.getById("forums", 1);
      this.session = new l.a(this.store.getById("users", this.data.session.userId), this.data.session.csrfToken);
      this.mount();
      this.initialRoute = window.location.href;
    };
    e.bootExtensions = function (t) {
      var e = this;
      Object.keys(t).forEach(function (n) {
        var i = t[n];
        if (i.extend) {
          for (var r, o = E(i.extend.flat(Infinity)); !(r = o()).done;) {
            r.value.extend(e, {
              name: n,
              exports: i
            });
          }
        }
      });
    };
    e.mount = function (t) {
      var e = this;
      if (t === undefined) {
        t = "";
      }
      m.mount(document.getElementById("modal"), {
        view: function () {
          return o.a.component({
            state: e.modal
          });
        }
      });
      m.mount(document.getElementById("alerts"), {
        view: function () {
          return s.a.component({
            state: e.alerts
          });
        }
      });
      this.drawer = new p.a();
      m.route(document.getElementById("content"), t + "/", Object(h.a)(this.routes, t));
      var n = new v.a(function (t) {
        var e = $("#app");
        var n = e.offset().top;
        e.toggleClass("affix", t >= n).toggleClass("scrolled", t > n);
        $(".App-header").toggleClass("navbar-fixed-top", t >= n);
      });
      n.start();
      n.update();
      $(function () {
        $("body").addClass("ontouchstart" in window ? "touch" : "no-touch");
      });
      Object(g.a)();
    };
    e.preloadedApiDocument = function () {
      if (this.data.apiDocument && window.location.href === this.initialRoute) {
        var t = this.store.pushPayload(this.data.apiDocument);
        this.data.apiDocument = null;
        return t;
      }
      return null;
    };
    e.screen = function () {
      return getComputedStyle(document.documentElement).getPropertyValue("--flarum-screen");
    };
    e.setTitle = function (t) {
      this.title = t;
      this.updateTitle();
    };
    e.setTitleCount = function (t) {
      this.titleCount = t;
      this.updateTitle();
    };
    e.updateTitle = function () {
      var t = this.titleCount ? "(" + this.titleCount + ") " : "";
      var e = this.title && m.route.get() !== this.forum.attribute("basePath") + "/" ? this.title + " - " : "";
      var n = this.forum.attribute("title");
      document.title = t + e + n;
    };
    e.request = function (t) {
      var e = this;
      var n = Object.assign({}, t);
      n.background = n.background || true;
      Object(b.extend)(n, "config", function (t, n) {
        return n.setRequestHeader("X-CSRF-Token", e.session.csrfToken);
      });
      if (n.method !== "GET" && n.method !== "POST") {
        var i = n.method;
        Object(b.extend)(n, "config", function (t, e) {
          return e.setRequestHeader("X-HTTP-Method-Override", i);
        });
        n.method = "POST";
      }
      n.deserialize = n.deserialize || function (t) {
        return t;
      };
      n.errorHandler = n.errorHandler || function (t) {
        throw t;
      };
      var o = n.extract;
      n.extract = function (t) {
        var e;
        e = o ? o(t.responseText) : t.responseText || null;
        var i = t.status;
        if (i < 200 || i > 299) {
          throw new f.a(i, e, n, t);
        }
        if (t.getResponseHeader) {
          var r = t.getResponseHeader("X-CSRF-Token");
          if (r) {
            app.session.csrfToken = r;
          }
        }
        try {
          return JSON.parse(e);
        } catch (i) {
          throw new f.a(500, e, n, t);
        }
      };
      if (this.requestErrorAlert) {
        this.alerts.dismiss(this.requestErrorAlert);
      }
      return m.request(n).then(function (t) {
        return t;
      }, function (t) {
        var i;
        switch (t.status) {
          case 422:
            i = t.response.errors.map(function (t) {
              return [t.detail, m("br", null)];
            }).reduce(function (t, e) {
              return t.concat(e);
            }, []).slice(0, -1);
            break;
          case 401:
          case 403:
            i = app.translator.trans("core.lib.error.permission_denied_message");
            break;
          case 404:
          case 410:
            i = app.translator.trans("core.lib.error.not_found_message");
            break;
          case 429:
            i = app.translator.trans("core.lib.error.rate_limit_exceeded_message");
            break;
          default:
            i = app.translator.trans("core.lib.error.generic_message");
        }
        var o = app.forum.attribute("debug");
        var s = t.response && t.response.errors;
        var a = Array.isArray(s) && s[0] && s[0].detail && s.map(function (t) {
          return decodeURI(t.detail);
        });
        t.alert = {
          type: "error",
          content: i,
          controls: o && [m(r.a, {
            className: "Button Button--link",
            onclick: e.showDebug.bind(e, t, a)
          }, "Debug")]
        };
        try {
          n.errorHandler(t);
        } catch (t) {
          if (o && t.xhr) {
            var c;
            var u = t.options;
            var l = u.method;
            var d = u.url;
            var p = t.xhr.status;
            var h = p === undefined ? "" : p;
            console.group(l + " " + d + " " + h);
            (c = console).error.apply(c, a || [t]);
            console.groupEnd();
          }
          e.requestErrorAlert = e.alerts.show(t.alert, t.alert.content);
        }
        return Promise.reject(t);
      });
    };
    e.showDebug = function (t, e) {
      this.alerts.dismiss(this.requestErrorAlert);
      this.modal.show(a.a, {
        error: t,
        formattedError: e
      });
    };
    e.route = function (t, e = {}) {
      var n = this.routes[t];
      if (!n) {
        throw new Error("Route '" + t + "' does not exist");
      }
      var i = n.path.replace(/:([^\/]+)/g, function (t, n) {
        return Object(d.a)(e, n);
      });
      for (var r in e) {
        if (e.hasOwnProperty(r) && !e[r]) {
          delete e[r];
        }
      }
      var o = m.buildQueryString(e);
      return (m.route.prefix === "" ? this.forum.attribute("basePath") : "") + i + (o ? "?" + o : "");
    };
    return t;
  }();
}, function (t, e, n) {
  "use strict";

  function i(t, e) {
    var n = t.tag === "select" ? t.attrs.multi ? "multi" : "select" : t.attrs.type;
    t.attrs.onchange = n === "multi" ? function () {
      e([].slice.call(this.selectedOptions, function (t) {
        return t.value;
      }));
    } : n === "select" ? function (t) {
      e(this.selectedOptions[0].value);
    } : n === "checkbox" ? function (t) {
      e(this.checked);
    } : t.attrs.oninput = function (t) {
      e(this.value);
    };
    if (t.tag === "select") {
      t.children.forEach(function (t) {
        if (t.attrs.value === e() || t.children[0] === e()) {
          t.attrs.selected = true;
        }
      });
    } else if (n === "checkbox") {
      t.attrs.checked = e();
    } else if (n === "radio") {
      t.attrs.checked = e() === t.attrs.value;
    } else {
      t.attrs.value = e();
    }
    t.attrs.bidi = null;
    return t;
  }
  n.d(e, "a", function () {
    return o;
  });
  i.view = function (t, e, n) {
    return i(e, e.attrs.bidi);
  };
  var r = i;
  function o(t) {
    var e = t.m;
    function n(t) {
      for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++) {
        i[o - 1] = arguments[o];
      }
      var s = e.apply(this, arguments);
      s.attrs ||= {};
      if (s.attrs.bidi) {
        r(s, s.attrs.bidi);
      }
      return s;
    }
    Object.keys(e).forEach(function (t) {
      return n[t] = e[t];
    });
    t.m = n;
  }
}, function (t, e, n) {
  "use strict";

  function i(t) {
    return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  n.d(e, "a", function () {
    return i;
  });
}, function (t, e, n) {
  "use strict";

  var i = n(98);
  t.exports = n(121)(i, requestAnimationFrame, console);
}, function (t, e, n) {
  "use strict";

  var i = n(99);
  var r = n(100);
  t.exports = function (t, e) {
    if (/:([^\/\.-]+)(\.{3})?:/.test(t)) {
      throw new SyntaxError("Template parameter names *must* be separated");
    }
    if (e == null) {
      return t;
    }
    var n = t.indexOf("?");
    var o = t.indexOf("#");
    var s = o < 0 ? t.length : o;
    var a = n < 0 ? s : n;
    var c = t.slice(0, a);
    var u = {};
    r(u, e);
    var l = c.replace(/:([^\/\.-]+)(\.{3})?/g, function (t, n, i) {
      delete u[n];
      if (e[n] == null) {
        return t;
      } else if (i) {
        return e[n];
      } else {
        return encodeURIComponent(String(e[n]));
      }
    });
    var d = l.indexOf("?");
    var p = l.indexOf("#");
    var h = p < 0 ? l.length : p;
    var f = d < 0 ? h : d;
    var m = l.slice(0, f);
    if (n >= 0) {
      m += t.slice(n, s);
    }
    if (d >= 0) {
      m += (n < 0 ? "?" : "&") + l.slice(d, h);
    }
    var v = i(u);
    if (v) {
      m += (n < 0 && d < 0 ? "?" : "&") + v;
    }
    if (o >= 0) {
      m += t.slice(o);
    }
    if (p >= 0) {
      m += (o < 0 ? "" : "&") + l.slice(p);
    }
    return m;
  };
}, function (t, e, n) {
  "use strict";

  var i = n(101);
  t.exports = function (t) {
    var e = t.indexOf("?");
    var n = t.indexOf("#");
    var r = n < 0 ? t.length : n;
    var o = e < 0 ? r : e;
    var s = t.slice(0, o).replace(/\/{2,}/g, "/");
    if (s) {
      if (s[0] !== "/") {
        s = "/" + s;
      }
      if (s.length > 1 && s[s.length - 1] === "/") {
        s = s.slice(0, -1);
      }
    } else {
      s = "/";
    }
    return {
      path: s,
      params: e < 0 ? {} : i(t.slice(e + 1, r))
    };
  };
}, function (t, e, n) {
  t.exports = function () {
    "use strict";

    return function (t, e, n) {
      t = t || {};
      var i = e.prototype;
      var r = {
        future: "in %s",
        past: "%s ago",
        s: "a few seconds",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
      };
      function o(t, e, n, r) {
        return i.fromToBase(t, e, n, r);
      }
      n.en.relativeTime = r;
      i.fromToBase = function (e, i, o, s, a) {
        var c;
        var u;
        var l;
        var d = o.$locale().relativeTime || r;
        var p = t.thresholds || [{
          l: "s",
          r: 44,
          d: "second"
        }, {
          l: "m",
          r: 89
        }, {
          l: "mm",
          r: 44,
          d: "minute"
        }, {
          l: "h",
          r: 89
        }, {
          l: "hh",
          r: 21,
          d: "hour"
        }, {
          l: "d",
          r: 35
        }, {
          l: "dd",
          r: 25,
          d: "day"
        }, {
          l: "M",
          r: 45
        }, {
          l: "MM",
          r: 10,
          d: "month"
        }, {
          l: "y",
          r: 17
        }, {
          l: "yy",
          d: "year"
        }];
        for (var h = p.length, f = 0; f < h; f += 1) {
          var m = p[f];
          if (m.d) {
            c = s ? n(e).diff(o, m.d, true) : o.diff(e, m.d, true);
          }
          var v = (t.rounding || Math.round)(Math.abs(c));
          l = c > 0;
          if (v <= m.r || !m.r) {
            if (v <= 1 && f > 0) {
              m = p[f - 1];
            }
            var g = d[m.l];
            if (a) {
              v = a("" + v);
            }
            u = typeof g == "string" ? g.replace("%d", v) : g(v, i, m.l, l);
            break;
          }
        }
        if (i) {
          return u;
        }
        var b = l ? d.future : d.past;
        if (typeof b == "function") {
          return b(u);
        } else {
          return b.replace("%s", u);
        }
      };
      i.to = function (t, e) {
        return o(t, e, this, true);
      };
      i.from = function (t, e) {
        return o(t, e, this);
      };
      function s(t) {
        if (t.$u) {
          return n.utc();
        } else {
          return n();
        }
      }
      i.toNow = function (t) {
        return this.to(s(this), t);
      };
      i.fromNow = function (t) {
        return this.from(s(this), t);
      };
    };
  }();
}, function (t, e, n) {
  "use strict";

  function i(t) {
    if (t >= 1000000) {
      return Math.floor(t / 1000000) + app.translator.trans("core.lib.number_suffix.mega_text");
    } else if (t >= 1000) {
      return (t / 1000).toFixed(1) + app.translator.trans("core.lib.number_suffix.kilo_text");
    } else {
      return t.toString();
    }
  }
  n.d(e, "a", function () {
    return i;
  });
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return l;
  });
  var i = n(0);
  var r = n(3);
  var o = n(4);
  var s = n(6);
  var a = n(2);
  var c = n(44);
  var u = n(23);
  var l = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.value = this.attrs.value || "";
      this.disabled = !!this.attrs.disabled;
    };
    n.view = function () {
      return m("div", {
        className: "TextEditor"
      }, m("div", {
        className: "TextEditor-editorContainer"
      }), m("ul", {
        className: "TextEditor-controls Composer-footer"
      }, Object(s.a)(this.controlItems().toArray()), m("li", {
        className: "TextEditor-toolbar"
      }, this.toolbarItems().toArray())));
    };
    n.oncreate = function (e) {
      t.prototype.oncreate.call(this, e);
      this.attrs.composer.editor = this.buildEditor(this.$(".TextEditor-editorContainer")[0]);
    };
    n.onupdate = function (e) {
      t.prototype.onupdate.call(this, e);
      var n = !!this.attrs.disabled;
      if (this.disabled !== n) {
        this.disabled = n;
        this.attrs.composer.editor.disabled(n);
      }
    };
    n.buildEditorParams = function () {
      var t = this;
      return {
        classNames: ["FormControl", "Composer-flexible", "TextEditor-editor"],
        disabled: this.disabled,
        placeholder: this.attrs.placeholder || "",
        value: this.value,
        oninput: this.oninput.bind(this),
        inputListeners: [],
        onsubmit: function () {
          t.onsubmit();
          m.redraw();
        }
      };
    };
    n.buildEditor = function (t) {
      return new c.a(t, this.buildEditorParams());
    };
    n.controlItems = function () {
      var t = new o.a();
      t.add("submit", a.a.component({
        icon: "fas fa-paper-plane",
        className: "Button Button--primary",
        itemClassName: "App-primaryControl",
        onclick: this.onsubmit.bind(this)
      }, this.attrs.submitLabel));
      if (this.attrs.preview) {
        t.add("preview", m(u.a, {
          text: app.translator.trans("core.forum.composer.preview_tooltip")
        }, m(a.a, {
          icon: "far fa-eye",
          className: "Button Button--icon",
          onclick: this.attrs.preview
        })));
      }
      return t;
    };
    n.toolbarItems = function () {
      return new o.a();
    };
    n.oninput = function (t) {
      this.value = t;
      this.attrs.onchange(this.value);
    };
    n.onsubmit = function () {
      this.attrs.onsubmit(this.value);
    };
    return e;
  }(r.a);
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return r;
  });
  var i = /[.*+?^${}()|[\]\\]/g;
  function r(t) {
    return t.replace(i, "\\$&");
  }
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return a;
  });
  var i = n(0);
  var r = n(17);
  var o = n(2);
  var s = n(5);
  var a = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    e.initAttrs = function (e) {
      t.initAttrs.call(this, e);
      e.className += " Dropdown--split";
      e.menuClassName += " Dropdown-menu--right";
    };
    var n = e.prototype;
    n.getButton = function (t) {
      var e = this.getFirstChild(t);
      var n = Object.assign({}, e.attrs);
      n.className = (n.className || "") + " SplitDropdown-button Button " + this.attrs.buttonClassName;
      return [o.a.component(n, e.children), m("button", {
        className: "Dropdown-toggle Button Button--icon " + this.attrs.buttonClassName,
        "aria-haspopup": "menu",
        "aria-label": this.attrs.accessibleToggleLabel,
        "data-toggle": "dropdown"
      }, Object(s.a)(this.attrs.icon, {
        className: "Button-icon"
      }), Object(s.a)("fas fa-caret-down", {
        className: "Button-caret"
      }))];
    };
    n.getFirstChild = function (t) {
      for (var e = t; e instanceof Array;) {
        e = e[0];
      }
      return e;
    };
    return e;
  }(r.a);
}, function (t, e, n) {
  "use strict";

  function i(t, e) {
    var n = $(window);
    var i = $(t).offset().top - n.scrollTop();
    e();
    n.scrollTop($(t).offset().top - i);
  }
  n.d(e, "a", function () {
    return i;
  });
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return r;
  });
  var i = n(5);
  function r(t) {
    if (t.lastSeenAt() && t.isOnline()) {
      return m("span", {
        className: "UserOnline"
      }, Object(i.a)("fas fa-circle"));
    }
  }
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return o;
  });
  var i = n(24);
  var r = n.n(i);
  function o(t) {
    var e = r()(t);
    var n = e.format();
    var i = e.format("LLLL");
    return m("time", {
      pubdate: true,
      datetime: n
    }, i);
  }
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return a;
  });
  var i = n(0);
  var r = n(3);
  var o = n(5);
  var s = n(37);
  var a = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(i.a)(e, t);
    e.prototype.view = function () {
      var t = this.attrs;
      var e = t.options;
      var n = t.onchange;
      var i = t.value;
      var r = t.disabled;
      return m("span", {
        className: "Select"
      }, m("select", {
        className: "Select-input FormControl",
        onchange: n ? Object(s.a)("value", n.bind(this)) : undefined,
        value: i,
        disabled: r
      }, Object.keys(e).map(function (t) {
        return m("option", {
          value: t
        }, e[t]);
      })), Object(o.a)("fas fa-sort", {
        className: "Select-caret"
      }));
    };
    return e;
  }(r.a);
}, function (t, e, n) {
  "use strict";

  function i(t) {
    if (t.length === 2) {
      return app.translator.trans("core.lib.series.two_text", {
        first: t[0],
        second: t[1]
      });
    }
    if (t.length >= 3) {
      var e = t.slice(1, t.length - 1).reduce(function (t, e) {
        return t.concat([e, app.translator.trans("core.lib.series.glue_text")]);
      }, []).slice(0, -1);
      return app.translator.trans("core.lib.series.three_text", {
        first: t[0],
        second: e,
        third: t[t.length - 1]
      });
    }
    return t;
  }
  n.d(e, "a", function () {
    return i;
  });
}, function (t, e) {
  function n(e) {
    t.exports = n = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
      return t.__proto__ || Object.getPrototypeOf(t);
    };
    t.exports.default = t.exports;
    t.exports.__esModule = true;
    return n(e);
  }
  t.exports = n;
  t.exports.default = t.exports;
  t.exports.__esModule = true;
}, function (t, e, n) {
  "use strict";

  function i(t) {
    if (t === undefined) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return t;
  }
  n.d(e, "a", function () {
    return i;
  });
}, function (t, e, n) {
  "use strict";

  var i = n(28);
  var r = n(94);
  var o = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g;
  var s = {};
  var a = {}.hasOwnProperty;
  function c(t) {
    for (var e in t) {
      if (a.call(t, e)) {
        return false;
      }
    }
    return true;
  }
  function u(t) {
    for (var e, n = "div", i = [], r = {}; e = o.exec(t);) {
      var a = e[1];
      var c = e[2];
      if (a === "" && c !== "") {
        n = c;
      } else if (a === "#") {
        r.id = c;
      } else if (a === ".") {
        i.push(c);
      } else if (e[3][0] === "[") {
        var u = e[6];
        u &&= u.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\");
        if (e[4] === "class") {
          i.push(u);
        } else {
          r[e[4]] = u === "" ? u : u || true;
        }
      }
    }
    if (i.length > 0) {
      r.className = i.join(" ");
    }
    return s[t] = {
      tag: n,
      attrs: r
    };
  }
  function l(t, e) {
    var n = e.attrs;
    var r = i.normalizeChildren(e.children);
    var o = a.call(n, "class");
    var s = o ? n.class : n.className;
    e.tag = t.tag;
    e.attrs = null;
    e.children = undefined;
    if (!c(t.attrs) && !c(n)) {
      var u = {};
      for (var l in n) {
        if (a.call(n, l)) {
          u[l] = n[l];
        }
      }
      n = u;
    }
    for (var l in t.attrs) {
      if (a.call(t.attrs, l) && l !== "className" && !a.call(n, l)) {
        n[l] = t.attrs[l];
      }
    }
    if (s != null || t.attrs.className != null) {
      n.className = s != null ? t.attrs.className != null ? String(t.attrs.className) + " " + String(s) : s : t.attrs.className ?? null;
    }
    if (o) {
      n.class = null;
    }
    for (var l in n) {
      if (a.call(n, l) && l !== "key") {
        e.attrs = n;
        break;
      }
    }
    if (Array.isArray(r) && r.length === 1 && r[0] != null && r[0].tag === "#") {
      e.text = r[0].children;
    } else {
      e.children = r;
    }
    return e;
  }
  t.exports = function (t) {
    if (t == null || typeof t != "string" && typeof t != "function" && typeof t.view != "function") {
      throw Error("The selector must be either a string or a component.");
    }
    var e = r.apply(1, arguments);
    if (typeof t == "string" && (e.children = i.normalizeChildren(e.children), t !== "[")) {
      return l(s[t] || u(t), e);
    } else {
      e.tag = t;
      return e;
    }
  };
}, function (t, e, n) {
  "use strict";

  var i = n(28);
  t.exports = function () {
    var t;
    var e = arguments[this];
    var n = this + 1;
    if (e == null) {
      e = {};
    } else if (typeof e != "object" || e.tag != null || Array.isArray(e)) {
      e = {};
      n = this;
    }
    if (arguments.length === n + 1) {
      t = arguments[n];
      if (!Array.isArray(t)) {
        t = [t];
      }
    } else {
      for (t = []; n < arguments.length;) {
        t.push(arguments[n++]);
      }
    }
    return i("", e.key, e, t);
  };
}, function (t, e, n) {
  "use strict";

  (function (e) {
    var i = n(96);
    if (typeof window != "undefined") {
      if (window.Promise === undefined) {
        window.Promise = i;
      } else {
        window.Promise.prototype.finally ||= i.prototype.finally;
      }
      t.exports = window.Promise;
    } else if (e !== undefined) {
      if (e.Promise === undefined) {
        e.Promise = i;
      } else {
        e.Promise.prototype.finally ||= i.prototype.finally;
      }
      t.exports = e.Promise;
    } else {
      t.exports = i;
    }
  }).call(this, n(50));
}, function (t, e, n) {
  "use strict";

  (function (e) {
    var n = function t(n) {
      if (!(this instanceof t)) {
        throw new Error("Promise must be called with `new`");
      }
      if (typeof n != "function") {
        throw new TypeError("executor must be a function");
      }
      var i = this;
      var r = [];
      var o = [];
      var s = l(r, true);
      var a = l(o, false);
      var c = i._instance = {
        resolvers: r,
        rejectors: o
      };
      var u = typeof e == "function" ? e : setTimeout;
      function l(t, e) {
        return function n(s) {
          var l;
          try {
            if (!e || s == null || typeof s != "object" && typeof s != "function" || typeof (l = s.then) != "function") {
              u(function () {
                if (!e && t.length === 0) {
                  console.error("Possible unhandled promise rejection:", s);
                }
                for (var i = 0; i < t.length; i++) {
                  t[i](s);
                }
                r.length = 0;
                o.length = 0;
                c.state = e;
                c.retry = function () {
                  n(s);
                };
              });
            } else {
              if (s === i) {
                throw new TypeError("Promise can't be resolved w/ itself");
              }
              d(l.bind(s));
            }
          } catch (t) {
            a(t);
          }
        };
      }
      function d(t) {
        var e = 0;
        function n(t) {
          return function (n) {
            if (!(e++ > 0)) {
              t(n);
            }
          };
        }
        var i = n(a);
        try {
          t(n(s), i);
        } catch (t) {
          i(t);
        }
      }
      d(n);
    };
    n.prototype.then = function (t, e) {
      var i;
      var r;
      var o = this._instance;
      function s(t, e, n, s) {
        e.push(function (e) {
          if (typeof t != "function") {
            n(e);
          } else {
            try {
              i(t(e));
            } catch (t) {
              if (r) {
                r(t);
              }
            }
          }
        });
        if (typeof o.retry == "function" && s === o.state) {
          o.retry();
        }
      }
      var a = new n(function (t, e) {
        i = t;
        r = e;
      });
      s(t, o.resolvers, i, true);
      s(e, o.rejectors, r, false);
      return a;
    };
    n.prototype.catch = function (t) {
      return this.then(null, t);
    };
    n.prototype.finally = function (t) {
      return this.then(function (e) {
        return n.resolve(t()).then(function () {
          return e;
        });
      }, function (e) {
        return n.resolve(t()).then(function () {
          return n.reject(e);
        });
      });
    };
    n.resolve = function (t) {
      if (t instanceof n) {
        return t;
      } else {
        return new n(function (e) {
          e(t);
        });
      }
    };
    n.reject = function (t) {
      return new n(function (e, n) {
        n(t);
      });
    };
    n.all = function (t) {
      return new n(function (e, n) {
        var i = t.length;
        var r = 0;
        var o = [];
        if (t.length === 0) {
          e([]);
        } else {
          for (var s = 0; s < t.length; s++) {
            (function (s) {
              function a(t) {
                r++;
                o[s] = t;
                if (r === i) {
                  e(o);
                }
              }
              if (t[s] == null || typeof t[s] != "object" && typeof t[s] != "function" || typeof t[s].then != "function") {
                a(t[s]);
              } else {
                t[s].then(a, n);
              }
            })(s);
          }
        }
      });
    };
    n.race = function (t) {
      return new n(function (e, n) {
        for (var i = 0; i < t.length; i++) {
          t[i].then(e, n);
        }
      });
    };
    t.exports = n;
  }).call(this, n(97).setImmediate);
}, function (t, e, n) {
  (function (t) {
    var i = t !== undefined && t || typeof self != "undefined" && self || window;
    var r = Function.prototype.apply;
    function o(t, e) {
      this._id = t;
      this._clearFn = e;
    }
    e.setTimeout = function () {
      return new o(r.call(setTimeout, i, arguments), clearTimeout);
    };
    e.setInterval = function () {
      return new o(r.call(setInterval, i, arguments), clearInterval);
    };
    e.clearTimeout = e.clearInterval = function (t) {
      if (t) {
        t.close();
      }
    };
    o.prototype.unref = o.prototype.ref = function () {};
    o.prototype.close = function () {
      this._clearFn.call(i, this._id);
    };
    e.enroll = function (t, e) {
      clearTimeout(t._idleTimeoutId);
      t._idleTimeout = e;
    };
    e.unenroll = function (t) {
      clearTimeout(t._idleTimeoutId);
      t._idleTimeout = -1;
    };
    e._unrefActive = e.active = function (t) {
      clearTimeout(t._idleTimeoutId);
      var e = t._idleTimeout;
      if (e >= 0) {
        t._idleTimeoutId = setTimeout(function () {
          if (t._onTimeout) {
            t._onTimeout();
          }
        }, e);
      }
    };
    n(118);
    e.setImmediate = typeof self != "undefined" && self.setImmediate || t !== undefined && t.setImmediate || this && this.setImmediate;
    e.clearImmediate = typeof self != "undefined" && self.clearImmediate || t !== undefined && t.clearImmediate || this && this.clearImmediate;
  }).call(this, n(50));
}, function (t, e, n) {
  "use strict";

  t.exports = n(120)(window);
}, function (t, e, n) {
  "use strict";

  t.exports = function (t) {
    if (Object.prototype.toString.call(t) !== "[object Object]") {
      return "";
    }
    var e = [];
    for (var n in t) {
      i(n, t[n]);
    }
    return e.join("&");
    function i(t, n) {
      if (Array.isArray(n)) {
        for (var r = 0; r < n.length; r++) {
          i(t + "[" + r + "]", n[r]);
        }
      } else if (Object.prototype.toString.call(n) === "[object Object]") {
        for (var r in n) {
          i(t + "[" + r + "]", n[r]);
        }
      } else {
        e.push(encodeURIComponent(t) + (n != null && n !== "" ? "=" + encodeURIComponent(n) : ""));
      }
    }
  };
}, function (t, e, n) {
  "use strict";

  t.exports = Object.assign || function (t, e) {
    if (e) {
      Object.keys(e).forEach(function (n) {
        t[n] = e[n];
      });
    }
  };
}, function (t, e, n) {
  "use strict";

  t.exports = function (t) {
    if (t === "" || t == null) {
      return {};
    }
    if (t.charAt(0) === "?") {
      t = t.slice(1);
    }
    for (var e = t.split("&"), n = {}, i = {}, r = 0; r < e.length; r++) {
      var o = e[r].split("=");
      var s = decodeURIComponent(o[0]);
      var a = o.length === 2 ? decodeURIComponent(o[1]) : "";
      if (a === "true") {
        a = true;
      } else if (a === "false") {
        a = false;
      }
      var c = s.split(/\]\[?|\[/);
      var u = i;
      if (s.indexOf("[") > -1) {
        c.pop();
      }
      for (var l = 0; l < c.length; l++) {
        var d = c[l];
        var p = c[l + 1];
        var h = p == "" || !isNaN(parseInt(p, 10));
        if (d === "") {
          if (n[s = c.slice(0, l).join()] == null) {
            n[s] = Array.isArray(u) ? u.length : 0;
          }
          d = n[s]++;
        } else if (d === "__proto__") {
          break;
        }
        if (l === c.length - 1) {
          u[d] = a;
        } else {
          var f = Object.getOwnPropertyDescriptor(u, d);
          if (f != null) {
            f = f.value;
          }
          if (f == null) {
            u[d] = f = h ? [] : {};
          }
          u = f;
        }
      }
    }
    return i;
  };
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return i;
  });
  var i = {};
  n.r(i);
  n.d(i, "Model", function () {
    return u;
  });
  n.d(i, "PostTypes", function () {
    return l;
  });
  n.d(i, "Routes", function () {
    return d;
  });
  n(110);
  n(112);
  n(126);
  n(127);
  n(128);
  n(129);
  n(130);
  n(131);
  n(132);
  var r = n(81);
  var o = n.n(r);
  var s = n(103);
  var a = n.n(s);
  var c = n(76);
  var u = function () {
    function t(t, e = null) {
      this.type = undefined;
      this.attributes = [];
      this.hasOnes = [];
      this.hasManys = [];
      this.type = t;
      this.model = e;
    }
    var e = t.prototype;
    e.attribute = function (t) {
      this.attributes.push(t);
      return this;
    };
    e.hasOne = function (t) {
      this.hasOnes.push(t);
      return this;
    };
    e.hasMany = function (t) {
      this.hasManys.push(t);
      return this;
    };
    e.extend = function (t, e) {
      if (this.model) {
        t.store.models[this.type] = this.model;
      }
      var n = t.store.models[this.type];
      this.attributes.forEach(function (t) {
        return n.prototype[t] = n.attribute(t);
      });
      this.hasOnes.forEach(function (t) {
        return n.prototype[t] = n.hasOne(t);
      });
      this.hasManys.forEach(function (t) {
        return n.prototype[t] = n.hasMany(t);
      });
    };
    return t;
  }();
  var l = function () {
    function t() {
      this.postComponents = {};
    }
    var e = t.prototype;
    e.add = function (t, e) {
      this.postComponents[t] = e;
      return this;
    };
    e.extend = function (t, e) {
      Object.assign(t.postComponents, this.postComponents);
    };
    return t;
  }();
  var d = function () {
    function t() {
      this.routes = {};
    }
    var e = t.prototype;
    e.add = function (t, e, n) {
      this.routes[t] = {
        path: e,
        component: n
      };
      return this;
    };
    e.extend = function (t, e) {
      Object.assign(t.routes, this.routes);
    };
    return t;
  }();
  n(133);
  dayjs.extend(o.a);
  dayjs.extend(a.a);
  Object(c.a)(window);
  var p = $.fn.tooltip;
  $.fn.tooltip = function (t, e) {
    if (!["DANGEROUS_tooltip_jquery_fn_deprecation_exempt"].includes(e)) {
      console.warn("Calling `$.tooltip` is now deprecated. Please use the `<Tooltip>` component exposed by flarum/core instead. `$.tooltip` may be removed in a future version of Flarum.\n\nIf this component doesn't meet your requirements, please open an issue: https://github.com/flarum/core/issues/new?assignees=davwheat&labels=type/bug,needs-verification&template=bug-report.md&title=Tooltip%20component%20unsuitable%20for%20use%20case");
    }
    p.bind(this)(t);
  };
}, function (t, e, n) {
  t.exports = function () {
    "use strict";

    var t = {
      LTS: "h:mm:ss A",
      LT: "h:mm A",
      L: "MM/DD/YYYY",
      LL: "MMMM D, YYYY",
      LLL: "MMMM D, YYYY h:mm A",
      LLLL: "dddd, MMMM D, YYYY h:mm A"
    };
    return function (e, n, i) {
      var r = n.prototype;
      var o = r.format;
      i.en.formats = t;
      r.format = function (e = "YYYY-MM-DDTHH:mm:ssZ") {
        var n = this.$locale().formats;
        var i = function (e, n) {
          return e.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function (e, i, r) {
            var o = r && r.toUpperCase();
            return i || n[r] || t[r] || n[o].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function (t, e, n) {
              return e || n.slice(1);
            });
          });
        }(e, n === undefined ? {} : n);
        return o.call(this, i);
      };
    };
  }();
}, function (t, e, n) {
  (function () {
    var e = ["direction", "boxSizing", "width", "height", "overflowX", "overflowY", "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth", "borderStyle", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "fontStyle", "fontVariant", "fontWeight", "fontStretch", "fontSize", "fontSizeAdjust", "lineHeight", "fontFamily", "textAlign", "textTransform", "textIndent", "textDecoration", "letterSpacing", "wordSpacing", "tabSize", "MozTabSize"];
    var n = typeof window != "undefined";
    var i = n && window.mozInnerScreenX != null;
    function r(t, r, o) {
      if (!n) {
        throw new Error("textarea-caret-position#getCaretCoordinates should only be called in a browser");
      }
      var s = o && o.debug || false;
      if (s) {
        var a = document.querySelector("#input-textarea-caret-position-mirror-div");
        if (a) {
          a.parentNode.removeChild(a);
        }
      }
      var c = document.createElement("div");
      c.id = "input-textarea-caret-position-mirror-div";
      document.body.appendChild(c);
      var u = c.style;
      var l = window.getComputedStyle ? window.getComputedStyle(t) : t.currentStyle;
      var d = t.nodeName === "INPUT";
      u.whiteSpace = "pre-wrap";
      if (!d) {
        u.wordWrap = "break-word";
      }
      u.position = "absolute";
      if (!s) {
        u.visibility = "hidden";
      }
      e.forEach(function (t) {
        if (d && t === "lineHeight") {
          u.lineHeight = l.height;
        } else {
          u[t] = l[t];
        }
      });
      if (i) {
        if (t.scrollHeight > parseInt(l.height)) {
          u.overflowY = "scroll";
        }
      } else {
        u.overflow = "hidden";
      }
      c.textContent = t.value.substring(0, r);
      if (d) {
        c.textContent = c.textContent.replace(/\s/g, "\xA0");
      }
      var p = document.createElement("span");
      p.textContent = t.value.substring(r) || ".";
      c.appendChild(p);
      var h = {
        top: p.offsetTop + parseInt(l.borderTopWidth),
        left: p.offsetLeft + parseInt(l.borderLeftWidth),
        height: parseInt(l.lineHeight)
      };
      if (s) {
        p.style.backgroundColor = "#aaa";
      } else {
        document.body.removeChild(c);
      }
      return h;
    }
    if (t.exports !== undefined) {
      t.exports = r;
    } else if (n) {
      window.getCaretCoordinates = r;
    }
  })();
}, function (t, e, n) {
  "use strict";

  t.exports = n(134);
}, function (t, e, n) {
  var i = n(135);
  t.exports = function (t, e) {
    if (typeof e != "function" && e !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    t.prototype = Object.create(e && e.prototype, {
      constructor: {
        value: t,
        writable: true,
        configurable: true
      }
    });
    if (e) {
      i(t, e);
    }
  };
  t.exports.default = t.exports;
  t.exports.__esModule = true;
}, function (t, e, n) {
  var i = n(136).default;
  var r = n(137);
  t.exports = function (t, e) {
    if (!e || i(e) !== "object" && typeof e != "function") {
      return r(t);
    } else {
      return e;
    }
  };
  t.exports.default = t.exports;
  t.exports.__esModule = true;
}, function (t, e, n) {
  var i = n(138);
  var r = n(139);
  var o = n(140);
  var s = n(142);
  t.exports = function (t, e) {
    return i(t) || r(t, e) || o(t, e) || s();
  };
  t.exports.default = t.exports;
  t.exports.__esModule = true;
}, function (t, e, n) {
  "use strict";

  var i = {};
  n.r(i);
  n.d(i, "throttle", function () {
    return k.b;
  });
  n.d(i, "debounce", function () {
    return k.a;
  });
  var r = n(40);
  var o = n(64);
  var s = n(63);
  var a = n(44);
  var c = {
    handlers: null,
    getHandlers: function (t) {
      this.handlers = this.handlers || {};
      this.handlers[t] = this.handlers[t] || [];
      return this.handlers[t];
    },
    trigger: function (t) {
      var e = this;
      for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++) {
        i[r - 1] = arguments[r];
      }
      this.getHandlers(t).forEach(function (t) {
        return t.apply(e, i);
      });
    },
    on: function (t, e) {
      this.getHandlers(t).push(e);
    },
    one: function (t, e) {
      this.getHandlers(t).push(function n() {
        e.apply(this, arguments);
        this.off(t, n);
      });
    },
    off: function (t, e) {
      var n = this.getHandlers(t);
      var i = n.indexOf(e);
      if (i !== -1) {
        n.splice(i, 1);
      }
    }
  };
  var u = n(67);
  var l = n(4);
  var d = n(0);
  var p = n(25);
  var h = n(20);
  var f = n(34);
  var v = {
    prefix: "",
    suffix: "",
    blockPrefix: "",
    blockSuffix: "",
    multiline: false,
    replaceNext: "",
    prefixSpace: false,
    scanFor: "",
    surroundWithNewlines: false,
    orderedList: false,
    trimFirst: false
  };
  function g(t) {
    return t.trim().split("\n").length > 1;
  }
  function b(t, e) {
    return Array(e + 1).join(t);
  }
  function y(t, e, n) {
    for (var i = e, r = n ? /\n/ : /\s/; t[i] && !t[i].match(r);) {
      i++;
    }
    return i;
  }
  function w(t) {
    var e;
    var n;
    var i = t.value.slice(0, t.selectionStart);
    var r = t.value.slice(t.selectionEnd);
    var o = i.match(/\n*$/);
    var s = r.match(/^\n*/);
    var a = o ? o[0].length : 0;
    var c = s ? s[0].length : 0;
    if (i.match(/\S/) && a < 2) {
      e = b("\n", 2 - a);
    }
    if (r.match(/\S/) && c < 2) {
      n = b("\n", 2 - c);
    }
    if (e == null) {
      e = "";
    }
    if (n == null) {
      n = "";
    }
    return {
      newlinesToAppend: e,
      newlinesToPrepend: n
    };
  }
  var x = n(65);
  var N = n(86);
  var C = n(48);
  var T = n(82);
  var S = n(84);
  var O = n(31);
  var k = n(51);
  var j = n(9);
  var A = n(54);
  var E = n(52);
  var P = n(14);
  var _ = n(35);
  var D = n(70);
  var I = n(42);
  var M = n(76);
  var L = n(73);
  var R = n(7);
  var H = n(8);
  var B = n(77);
  var U = n(66);
  var F = n(37);
  var q = n(72);
  var z = n(69);
  var W = n(71);
  var V = n(39);
  var Y = n(10);
  var G = n(68);
  var K = n(3);
  var X = n(74);
  var J = n(59);
  var Q = n(30);
  var Z = n(36);
  var tt = n(26);
  var et = n(15);
  var nt = n(55);
  var it = n(21);
  var rt = n(17);
  var ot = n(85);
  var st = n(60);
  var at = n(41);
  var ct = n(89);
  var ut = n(49);
  var lt = n(27);
  var dt = n(12);
  var pt = n(16);
  var ht = n(45);
  var ft = n(32);
  var mt = n(58);
  var vt = n(2);
  var gt = n(13);
  var bt = n(29);
  var yt = n(83);
  var wt = n(23);
  var xt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(d.a)(e, t);
    e.prototype.view = function (e) {
      var n = t.prototype.view.call(this, e);
      var i = n.attrs.title;
      delete n.attrs.title;
      return m(wt.a, {
        text: i
      }, n);
    };
    e.initAttrs = function (e) {
      t.initAttrs.call(this, e);
      e.className = e.className || "Button Button--icon Button--link";
    };
    return e;
  }(vt.a);
  var Nt = n(56);
  var Ct = n(1);
  var Tt = n(75);
  var St = n(88);
  var Ot = n(18);
  var kt = n(5);
  var jt = n(43);
  var At = n(90);
  var Et = n(33);
  var Pt = n(19);
  var _t = n(87);
  var Dt = n(6);
  var $t = function () {
    function t() {
      this.element = undefined;
    }
    var e = t.prototype;
    e.$ = function (t) {
      function e(e) {
        return t.apply(this, arguments);
      }
      e.toString = function () {
        return t.toString();
      };
      return e;
    }(function (t) {
      var e = $(this.element);
      if (t) {
        return e.find(t);
      } else {
        return e;
      }
    });
    e.render = function () {
      var t = this;
      var e = this.view();
      e.attrs = e.attrs || {};
      var n = e.attrs.oncreate;
      e.attrs.oncreate = function (e) {
        t.element = e.dom;
        if (n) {
          n.apply(t, [e]);
        }
      };
      return e;
    };
    return t;
  }();
  var It = n(38);
  var Mt = n(57);
  e.a = {
    extend: r,
    Session: o.a,
    Store: s.a,
    "utils/BasicEditorDriver": a.a,
    "utils/evented": c,
    "utils/liveHumanTimes": u.a,
    "utils/ItemList": l.a,
    "utils/mixin": function (t) {
      var e = function (t) {
        function e() {
          return t.apply(this, arguments) || this;
        }
        Object(d.a)(e, t);
        return e;
      }(t);
      for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++) {
        i[r - 1] = arguments[r];
      }
      i.forEach(function (t) {
        Object.assign(e.prototype, t);
      });
      return e;
    },
    "utils/humanTime": p.a,
    "utils/computed": h.a,
    "utils/insertText": f.a,
    "utils/styleSelectedText": function (t, e) {
      t.focus();
      e = Object.assign({}, v, e);
      var n;
      var i = t.value.slice(t.selectionStart, t.selectionEnd);
      n = e.orderedList ? function (t) {
        var e;
        var n;
        var i;
        var r;
        var o = /^\d+\.\s+/;
        var s = t.selectionStart === t.selectionEnd;
        var a = t.value.slice(t.selectionStart, t.selectionEnd);
        var c = a;
        var u = a.split("\n");
        if (s) {
          var l = t.value.slice(0, t.selectionStart).split(/\n/);
          i = t.selectionStart - l[l.length - 1].length;
          r = y(t.value, t.selectionStart, true);
          c = t.value.slice(i, r);
        }
        var d = c.split("\n");
        if (d.every(function (t) {
          return o.test(t);
        })) {
          u = d.map(function (t) {
            return t.replace(o, "");
          });
          a = u.join("\n");
          if (s && i && r) {
            var p = d[0].length - u[0].length;
            n = e = t.selectionStart - p;
            t.selectionStart = i;
            t.selectionEnd = r;
          }
        } else {
          u = function (t) {
            var e;
            var n;
            var i;
            var r = [];
            i = e = 0;
            n = t.length;
            for (; e < n; i = ++e) {
              var o = t[i];
              r.push(i + 1 + ". " + o);
            }
            return r;
          }(u);
          a = u.join("\n");
          var h = w(t);
          var f = h.newlinesToAppend;
          var m = h.newlinesToPrepend;
          n = t.selectionStart + f.length;
          e = n + a.length;
          if (s) {
            n = e;
          }
          a = f + a + m;
        }
        return {
          text: a,
          selectionStart: n,
          selectionEnd: e
        };
      }(t) : e.multiline && g(i) ? function (t, e) {
        var n = e.prefix;
        var i = e.suffix;
        var r = e.surroundWithNewlines;
        var o = t.value.slice(t.selectionStart, t.selectionEnd);
        var s = t.selectionStart;
        var a = t.selectionEnd;
        var c = o.split("\n");
        if (c.every(function (t) {
          return t.startsWith(n) && t.endsWith(i);
        })) {
          o = c.map(function (t) {
            return t.slice(n.length, t.length - i.length);
          }).join("\n");
          a = s + o.length;
        } else {
          o = c.map(function (t) {
            return n + t + i;
          }).join("\n");
          if (r) {
            var u = w(t);
            var l = u.newlinesToAppend;
            var d = u.newlinesToPrepend;
            s += l.length;
            a = s + o.length;
            o = l + o + d;
          }
        }
        return {
          text: o,
          selectionStart: s,
          selectionEnd: a
        };
      }(t, e) : function (t, e) {
        var n;
        var i;
        var r = e.prefix;
        var o = e.suffix;
        var s = e.blockPrefix;
        var a = e.blockSuffix;
        var c = e.replaceNext;
        var u = e.prefixSpace;
        var l = e.scanFor;
        var d = e.surroundWithNewlines;
        var p = t.selectionStart;
        var h = t.selectionEnd;
        var f = t.value.slice(t.selectionStart, t.selectionEnd);
        var m = g(f) && s.length > 0 ? s + "\n" : r;
        var v = g(f) && a.length > 0 ? "\n" + a : o;
        if (u) {
          var b = t.value[t.selectionStart - 1];
          if (t.selectionStart !== 0 && b != null && !b.match(/\s/)) {
            m = " " + m;
          }
        }
        f = function (t, e, n, i = false) {
          if (t.selectionStart === t.selectionEnd) {
            t.selectionStart = function (t, e) {
              var n = e;
              while (t[n] && t[n - 1] != null && !t[n - 1].match(/\s/)) {
                n--;
              }
              return n;
            }(t.value, t.selectionStart);
            t.selectionEnd = y(t.value, t.selectionEnd, i);
          } else {
            var r = t.selectionStart - e.length;
            var o = t.selectionEnd + n.length;
            var s = t.value.slice(r, t.selectionStart) === e;
            var a = t.value.slice(t.selectionEnd, o) === n;
            if (s && a) {
              t.selectionStart = r;
              t.selectionEnd = o;
            }
          }
          return t.value.slice(t.selectionStart, t.selectionEnd);
        }(t, m, v, e.multiline);
        var x = t.selectionStart;
        var N = t.selectionEnd;
        var C = c.length > 0 && v.indexOf(c) > -1 && f.length > 0;
        if (d) {
          var T = w(t);
          n = T.newlinesToAppend;
          i = T.newlinesToPrepend;
          m = n + r;
          v += i;
        }
        if (f.startsWith(m) && f.endsWith(v)) {
          var S = f.slice(m.length, f.length - v.length);
          if (p === h) {
            var O = p - m.length;
            O = Math.max(O, x);
            O = Math.min(O, x + S.length);
            x = N = O;
          } else {
            N = x + S.length;
          }
          return {
            text: S,
            selectionStart: x,
            selectionEnd: N
          };
        }
        if (C) {
          if (l.length > 0 && f.match(l)) {
            v = v.replace(c, f);
            var k = m + v;
            x = N = x + m.length;
            return {
              text: k,
              selectionStart: x,
              selectionEnd: N
            };
          }
          var j = m + f + v;
          x = x + m.length + f.length + v.indexOf(c);
          N = x + c.length;
          return {
            text: j,
            selectionStart: x,
            selectionEnd: N
          };
        }
        var A = m + f + v;
        x = p + m.length;
        N = h + m.length;
        var E = f.match(/^\s*|\s*$/g);
        if (e.trimFirst && E) {
          var P = E[0] || "";
          var _ = E[1] || "";
          A = P + m + f.trim() + v + _;
          x += P.length;
          N -= _.length;
        }
        return {
          text: A,
          selectionStart: x,
          selectionEnd: N
        };
      }(t, e);
      Object(f.a)(t, n);
    },
    "utils/Drawer": x.a,
    "utils/anchorScroll": N.a,
    "utils/RequestError": C.a,
    "utils/abbreviateNumber": T.a,
    "utils/string": O,
    "utils/SubtreeRetainer": A.a,
    "utils/escapeRegExp": S.a,
    "utils/extract": P.a,
    "utils/ScrollListener": _.a,
    "utils/stringToColor": D.a,
    "utils/Stream": j.a,
    "utils/subclassOf": I.a,
    "utils/setRouteWithForcedRefresh": E.a,
    "utils/patchMithril": M.a,
    "utils/proxifyCompat": L.a,
    "utils/classList": R.a,
    "utils/extractText": H.a,
    "utils/formatNumber": B.a,
    "utils/mapRoutes": U.a,
    "utils/withAttr": F.a,
    "utils/throttleDebounce": i,
    "models/Notification": q.a,
    "models/User": z.a,
    "models/Post": W.a,
    "models/Discussion": V.a,
    "models/Group": Y.a,
    "models/Forum": G.a,
    Component: K.a,
    Fragment: $t,
    Translator: X.a,
    "components/AlertManager": J.a,
    "components/Page": Q.a,
    "components/Switch": Z.a,
    "components/Badge": tt.a,
    "components/LoadingIndicator": et.a,
    "components/Placeholder": nt.a,
    "components/Separator": it.a,
    "components/Dropdown": rt.a,
    "components/SplitDropdown": ot.a,
    "components/RequestErrorModal": st.a,
    "components/FieldSet": at.a,
    "components/Select": ct.a,
    "components/Navigation": ut.a,
    "components/Alert": lt.a,
    "components/Link": dt.a,
    "components/LinkButton": pt.a,
    "components/Checkbox": ht.a,
    "components/SelectDropdown": ft.a,
    "components/ModalManager": mt.a,
    "components/Button": vt.a,
    "components/Modal": gt.a,
    "components/GroupBadge": bt.a,
    "components/TextEditor": yt.a,
    "components/TextEditorButton": xt,
    "components/Tooltip": wt.a,
    "components/EditUserModal": Nt.a,
    Model: Ct.a,
    Application: Tt.a,
    "helpers/fullTime": St.a,
    "helpers/avatar": Ot.a,
    "helpers/icon": kt.a,
    "helpers/humanTime": jt.a,
    "helpers/punctuateSeries": At.a,
    "helpers/highlight": Et.a,
    "helpers/username": Pt.a,
    "helpers/userOnline": _t.a,
    "helpers/listItems": Dt.a,
    "resolvers/DefaultResolver": It.a,
    "states/PaginatedListState": Mt.a
  };
}, function (t, e, n) {
  var i = n(111);
  var r = n(53);
  if (r.$ === undefined) {
    r.$ = i;
  }
  if (r.jQuery === undefined) {
    r.jQuery = i;
  }
  t.exports = i;
}, function (t, e, n) {
  var i;
  /*!
   * jQuery JavaScript Library v3.6.0
   * https://jquery.com/
   *
   * Includes Sizzle.js
   * https://sizzlejs.com/
   *
   * Copyright OpenJS Foundation and other contributors
   * Released under the MIT license
   * https://jquery.org/license
   *
   * Date: 2021-03-02T17:08Z
   */
  (function (e, n) {
    "use strict";

    if (typeof t.exports == "object") {
      t.exports = e.document ? n(e, true) : function (t) {
        if (!t.document) {
          throw new Error("jQuery requires a window with a document");
        }
        return n(t);
      };
    } else {
      n(e);
    }
  })(typeof window != "undefined" ? window : this, function (n, r) {
    "use strict";

    var o = [];
    var s = Object.getPrototypeOf;
    var a = o.slice;
    var c = o.flat ? function (t) {
      return o.flat.call(t);
    } : function (t) {
      return o.concat.apply([], t);
    };
    var u = o.push;
    var l = o.indexOf;
    var d = {};
    var p = d.toString;
    var h = d.hasOwnProperty;
    var f = h.toString;
    var m = f.call(Object);
    var v = {};
    function g(t) {
      return typeof t == "function" && typeof t.nodeType != "number" && typeof t.item != "function";
    }
    function b(t) {
      return t != null && t === t.window;
    }
    var y = n.document;
    var w = {
      type: true,
      src: true,
      nonce: true,
      noModule: true
    };
    function x(t, e, n) {
      var i;
      var r;
      var o = (n = n || y).createElement("script");
      o.text = t;
      if (e) {
        for (i in w) {
          if (r = e[i] || e.getAttribute && e.getAttribute(i)) {
            o.setAttribute(i, r);
          }
        }
      }
      n.head.appendChild(o).parentNode.removeChild(o);
    }
    function N(t) {
      if (t == null) {
        return t + "";
      } else if (typeof t == "object" || typeof t == "function") {
        return d[p.call(t)] || "object";
      } else {
        return typeof t;
      }
    }
    var C = function t(e, n) {
      return new t.fn.init(e, n);
    };
    function T(t) {
      var e = !!t && "length" in t && t.length;
      var n = N(t);
      return !g(t) && !b(t) && (n === "array" || e === 0 || typeof e == "number" && e > 0 && e - 1 in t);
    }
    C.fn = C.prototype = {
      jquery: "3.6.0",
      constructor: C,
      length: 0,
      toArray: function () {
        return a.call(this);
      },
      get: function (t) {
        if (t == null) {
          return a.call(this);
        } else if (t < 0) {
          return this[t + this.length];
        } else {
          return this[t];
        }
      },
      pushStack: function (t) {
        var e = C.merge(this.constructor(), t);
        e.prevObject = this;
        return e;
      },
      each: function (t) {
        return C.each(this, t);
      },
      map: function (t) {
        return this.pushStack(C.map(this, function (e, n) {
          return t.call(e, n, e);
        }));
      },
      slice: function () {
        return this.pushStack(a.apply(this, arguments));
      },
      first: function () {
        return this.eq(0);
      },
      last: function () {
        return this.eq(-1);
      },
      even: function () {
        return this.pushStack(C.grep(this, function (t, e) {
          return (e + 1) % 2;
        }));
      },
      odd: function () {
        return this.pushStack(C.grep(this, function (t, e) {
          return e % 2;
        }));
      },
      eq: function (t) {
        var e = this.length;
        var n = +t + (t < 0 ? e : 0);
        return this.pushStack(n >= 0 && n < e ? [this[n]] : []);
      },
      end: function () {
        return this.prevObject || this.constructor();
      },
      push: u,
      sort: o.sort,
      splice: o.splice
    };
    C.extend = C.fn.extend = function () {
      var t;
      var e;
      var n;
      var i;
      var r;
      var o;
      var s = arguments[0] || {};
      var a = 1;
      var c = arguments.length;
      var u = false;
      if (typeof s == "boolean") {
        u = s;
        s = arguments[a] || {};
        a++;
      }
      if (typeof s != "object" && !g(s)) {
        s = {};
      }
      if (a === c) {
        s = this;
        a--;
      }
      for (; a < c; a++) {
        if ((t = arguments[a]) != null) {
          for (e in t) {
            i = t[e];
            if (e !== "__proto__" && s !== i) {
              if (u && i && (C.isPlainObject(i) || (r = Array.isArray(i)))) {
                n = s[e];
                o = r && !Array.isArray(n) ? [] : r || C.isPlainObject(n) ? n : {};
                r = false;
                s[e] = C.extend(u, o, i);
              } else if (i !== undefined) {
                s[e] = i;
              }
            }
          }
        }
      }
      return s;
    };
    C.extend({
      expando: "jQuery" + ("3.6.0" + Math.random()).replace(/\D/g, ""),
      isReady: true,
      error: function (t) {
        throw new Error(t);
      },
      noop: function () {},
      isPlainObject: function (t) {
        var e;
        var n;
        return !!t && p.call(t) === "[object Object]" && (!(e = s(t)) || typeof (n = h.call(e, "constructor") && e.constructor) == "function" && f.call(n) === m);
      },
      isEmptyObject: function (t) {
        var e;
        for (e in t) {
          return false;
        }
        return true;
      },
      globalEval: function (t, e, n) {
        x(t, {
          nonce: e && e.nonce
        }, n);
      },
      each: function (t, e) {
        var n;
        var i = 0;
        if (T(t)) {
          for (n = t.length; i < n && e.call(t[i], i, t[i]) !== false; i++);
        } else {
          for (i in t) {
            if (e.call(t[i], i, t[i]) === false) {
              break;
            }
          }
        }
        return t;
      },
      makeArray: function (t, e) {
        var n = e || [];
        if (t != null) {
          if (T(Object(t))) {
            C.merge(n, typeof t == "string" ? [t] : t);
          } else {
            u.call(n, t);
          }
        }
        return n;
      },
      inArray: function (t, e, n) {
        if (e == null) {
          return -1;
        } else {
          return l.call(e, t, n);
        }
      },
      merge: function (t, e) {
        for (var n = +e.length, i = 0, r = t.length; i < n; i++) {
          t[r++] = e[i];
        }
        t.length = r;
        return t;
      },
      grep: function (t, e, n) {
        var i = [];
        for (var r = 0, o = t.length, s = !n; r < o; r++) {
          if (!e(t[r], r) !== s) {
            i.push(t[r]);
          }
        }
        return i;
      },
      map: function (t, e, n) {
        var i;
        var r;
        var o = 0;
        var s = [];
        if (T(t)) {
          for (i = t.length; o < i; o++) {
            if ((r = e(t[o], o, n)) != null) {
              s.push(r);
            }
          }
        } else {
          for (o in t) {
            if ((r = e(t[o], o, n)) != null) {
              s.push(r);
            }
          }
        }
        return c(s);
      },
      guid: 1,
      support: v
    });
    if (typeof Symbol == "function") {
      C.fn[Symbol.iterator] = o[Symbol.iterator];
    }
    C.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (t, e) {
      d["[object " + e + "]"] = e.toLowerCase();
    });
    var S =
    /*!
       * Sizzle CSS Selector Engine v2.3.6
       * https://sizzlejs.com/
       *
       * Copyright JS Foundation and other contributors
       * Released under the MIT license
       * https://js.foundation/
       *
       * Date: 2021-02-16
       */
    function (t) {
      var e;
      var n;
      var i;
      var r;
      var o;
      var s;
      var a;
      var c;
      var u;
      var l;
      var d;
      var p;
      var h;
      var f;
      var m;
      var v;
      var g;
      var b;
      var y;
      var w = "sizzle" + new Date() * 1;
      var x = t.document;
      var N = 0;
      var C = 0;
      var T = ct();
      var S = ct();
      var O = ct();
      var k = ct();
      function j(t, e) {
        if (t === e) {
          d = true;
        }
        return 0;
      }
      var A = {}.hasOwnProperty;
      var E = [];
      var P = E.pop;
      var _ = E.push;
      var D = E.push;
      var $ = E.slice;
      function I(t, e) {
        for (var n = 0, i = t.length; n < i; n++) {
          if (t[n] === e) {
            return n;
          }
        }
        return -1;
      }
      var M = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped";
      var L = "[\\x20\\t\\r\\n\\f]";
      var R = "(?:\\\\[\\da-fA-F]{1,6}" + L + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+";
      var H = "\\[" + L + "*(" + R + ")(?:" + L + "*([*^$|!~]?=)" + L + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + R + "))|)" + L + "*\\]";
      var B = ":(" + R + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + H + ")*)|.*)\\)|)";
      var U = new RegExp(L + "+", "g");
      var F = new RegExp("^" + L + "+|((?:^|[^\\\\])(?:\\\\.)*)" + L + "+$", "g");
      var q = new RegExp("^" + L + "*," + L + "*");
      var z = new RegExp("^" + L + "*([>+~]|" + L + ")" + L + "*");
      var W = new RegExp(L + "|>");
      var V = new RegExp(B);
      var Y = new RegExp("^" + R + "$");
      var G = {
        ID: new RegExp("^#(" + R + ")"),
        CLASS: new RegExp("^\\.(" + R + ")"),
        TAG: new RegExp("^(" + R + "|[*])"),
        ATTR: new RegExp("^" + H),
        PSEUDO: new RegExp("^" + B),
        CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + L + "*(even|odd|(([+-]|)(\\d*)n|)" + L + "*(?:([+-]|)" + L + "*(\\d+)|))" + L + "*\\)|)", "i"),
        bool: new RegExp("^(?:" + M + ")$", "i"),
        needsContext: new RegExp("^" + L + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + L + "*((?:-\\d)?\\d*)" + L + "*\\)|)(?=[^-]|$)", "i")
      };
      var K = /HTML$/i;
      var X = /^(?:input|select|textarea|button)$/i;
      var J = /^h\d$/i;
      var Q = /^[^{]+\{\s*\[native \w/;
      var Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
      var tt = /[+~]/;
      var et = new RegExp("\\\\[\\da-fA-F]{1,6}" + L + "?|\\\\([^\\r\\n\\f])", "g");
      function nt(t, e) {
        var n = "0x" + t.slice(1) - 65536;
        return e || (n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, n & 1023 | 56320));
      }
      var it = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g;
      function rt(t, e) {
        if (e) {
          if (t === "\0") {
            return "�";
          } else {
            return t.slice(0, -1) + "\\" + t.charCodeAt(t.length - 1).toString(16) + " ";
          }
        } else {
          return "\\" + t;
        }
      }
      function ot() {
        p();
      }
      var st = wt(function (t) {
        return t.disabled === true && t.nodeName.toLowerCase() === "fieldset";
      }, {
        dir: "parentNode",
        next: "legend"
      });
      try {
        D.apply(E = $.call(x.childNodes), x.childNodes);
        E[x.childNodes.length].nodeType;
      } catch (t) {
        D = {
          apply: E.length ? function (t, e) {
            _.apply(t, $.call(e));
          } : function (t, e) {
            for (var n = t.length, i = 0; t[n++] = e[i++];);
            t.length = n - 1;
          }
        };
      }
      function at(t, e, i, r) {
        var o;
        var a;
        var u;
        var l;
        var d;
        var f;
        var g;
        var b = e && e.ownerDocument;
        var x = e ? e.nodeType : 9;
        i = i || [];
        if (typeof t != "string" || !t || x !== 1 && x !== 9 && x !== 11) {
          return i;
        }
        if (!r && (p(e), e = e || h, m)) {
          if (x !== 11 && (d = Z.exec(t))) {
            if (o = d[1]) {
              if (x === 9) {
                if (!(u = e.getElementById(o))) {
                  return i;
                }
                if (u.id === o) {
                  i.push(u);
                  return i;
                }
              } else if (b && (u = b.getElementById(o)) && y(e, u) && u.id === o) {
                i.push(u);
                return i;
              }
            } else {
              if (d[2]) {
                D.apply(i, e.getElementsByTagName(t));
                return i;
              }
              if ((o = d[3]) && n.getElementsByClassName && e.getElementsByClassName) {
                D.apply(i, e.getElementsByClassName(o));
                return i;
              }
            }
          }
          if (n.qsa && !k[t + " "] && (!v || !v.test(t)) && (x !== 1 || e.nodeName.toLowerCase() !== "object")) {
            g = t;
            b = e;
            if (x === 1 && (W.test(t) || z.test(t))) {
              if ((b = tt.test(t) && gt(e.parentNode) || e) !== e || !n.scope) {
                if (l = e.getAttribute("id")) {
                  l = l.replace(it, rt);
                } else {
                  e.setAttribute("id", l = w);
                }
              }
              a = (f = s(t)).length;
              while (a--) {
                f[a] = (l ? "#" + l : ":scope") + " " + yt(f[a]);
              }
              g = f.join(",");
            }
            try {
              D.apply(i, b.querySelectorAll(g));
              return i;
            } catch (e) {
              k(t, true);
            } finally {
              if (l === w) {
                e.removeAttribute("id");
              }
            }
          }
        }
        return c(t.replace(F, "$1"), e, i, r);
      }
      function ct() {
        var t = [];
        return function e(n, r) {
          if (t.push(n + " ") > i.cacheLength) {
            delete e[t.shift()];
          }
          return e[n + " "] = r;
        };
      }
      function ut(t) {
        t[w] = true;
        return t;
      }
      function lt(t) {
        var e = h.createElement("fieldset");
        try {
          return !!t(e);
        } catch (t) {
          return false;
        } finally {
          if (e.parentNode) {
            e.parentNode.removeChild(e);
          }
          e = null;
        }
      }
      function dt(t, e) {
        var n = t.split("|");
        for (var r = n.length; r--;) {
          i.attrHandle[n[r]] = e;
        }
      }
      function pt(t, e) {
        var n = e && t;
        var i = n && t.nodeType === 1 && e.nodeType === 1 && t.sourceIndex - e.sourceIndex;
        if (i) {
          return i;
        }
        if (n) {
          while (n = n.nextSibling) {
            if (n === e) {
              return -1;
            }
          }
        }
        if (t) {
          return 1;
        } else {
          return -1;
        }
      }
      function ht(t) {
        return function (e) {
          return e.nodeName.toLowerCase() === "input" && e.type === t;
        };
      }
      function ft(t) {
        return function (e) {
          var n = e.nodeName.toLowerCase();
          return (n === "input" || n === "button") && e.type === t;
        };
      }
      function mt(t) {
        return function (e) {
          if ("form" in e) {
            if (e.parentNode && e.disabled === false) {
              if ("label" in e) {
                if ("label" in e.parentNode) {
                  return e.parentNode.disabled === t;
                } else {
                  return e.disabled === t;
                }
              } else {
                return e.isDisabled === t || e.isDisabled !== !t && st(e) === t;
              }
            } else {
              return e.disabled === t;
            }
          } else {
            return "label" in e && e.disabled === t;
          }
        };
      }
      function vt(t) {
        return ut(function (e) {
          e = +e;
          return ut(function (n, i) {
            var r;
            var o = t([], n.length, e);
            for (var s = o.length; s--;) {
              if (n[r = o[s]]) {
                n[r] = !(i[r] = n[r]);
              }
            }
          });
        });
      }
      function gt(t) {
        return t && t.getElementsByTagName !== undefined && t;
      }
      n = at.support = {};
      o = at.isXML = function (t) {
        var e = t && t.namespaceURI;
        var n = t && (t.ownerDocument || t).documentElement;
        return !K.test(e || n && n.nodeName || "HTML");
      };
      p = at.setDocument = function (t) {
        var e;
        var r;
        var s = t ? t.ownerDocument || t : x;
        if (s != h && s.nodeType === 9 && s.documentElement) {
          f = (h = s).documentElement;
          m = !o(h);
          if (x != h && (r = h.defaultView) && r.top !== r) {
            if (r.addEventListener) {
              r.addEventListener("unload", ot, false);
            } else if (r.attachEvent) {
              r.attachEvent("onunload", ot);
            }
          }
          n.scope = lt(function (t) {
            f.appendChild(t).appendChild(h.createElement("div"));
            return t.querySelectorAll !== undefined && !t.querySelectorAll(":scope fieldset div").length;
          });
          n.attributes = lt(function (t) {
            t.className = "i";
            return !t.getAttribute("className");
          });
          n.getElementsByTagName = lt(function (t) {
            t.appendChild(h.createComment(""));
            return !t.getElementsByTagName("*").length;
          });
          n.getElementsByClassName = Q.test(h.getElementsByClassName);
          n.getById = lt(function (t) {
            f.appendChild(t).id = w;
            return !h.getElementsByName || !h.getElementsByName(w).length;
          });
          if (n.getById) {
            i.filter.ID = function (t) {
              var e = t.replace(et, nt);
              return function (t) {
                return t.getAttribute("id") === e;
              };
            };
            i.find.ID = function (t, e) {
              if (e.getElementById !== undefined && m) {
                var n = e.getElementById(t);
                if (n) {
                  return [n];
                } else {
                  return [];
                }
              }
            };
          } else {
            i.filter.ID = function (t) {
              var e = t.replace(et, nt);
              return function (t) {
                var n = t.getAttributeNode !== undefined && t.getAttributeNode("id");
                return n && n.value === e;
              };
            };
            i.find.ID = function (t, e) {
              if (e.getElementById !== undefined && m) {
                var n;
                var i;
                var r;
                var o = e.getElementById(t);
                if (o) {
                  if ((n = o.getAttributeNode("id")) && n.value === t) {
                    return [o];
                  }
                  r = e.getElementsByName(t);
                  i = 0;
                  while (o = r[i++]) {
                    if ((n = o.getAttributeNode("id")) && n.value === t) {
                      return [o];
                    }
                  }
                }
                return [];
              }
            };
          }
          i.find.TAG = n.getElementsByTagName ? function (t, e) {
            if (e.getElementsByTagName !== undefined) {
              return e.getElementsByTagName(t);
            } else if (n.qsa) {
              return e.querySelectorAll(t);
            } else {
              return undefined;
            }
          } : function (t, e) {
            var n;
            var i = [];
            var r = 0;
            var o = e.getElementsByTagName(t);
            if (t === "*") {
              while (n = o[r++]) {
                if (n.nodeType === 1) {
                  i.push(n);
                }
              }
              return i;
            }
            return o;
          };
          i.find.CLASS = n.getElementsByClassName && function (t, e) {
            if (e.getElementsByClassName !== undefined && m) {
              return e.getElementsByClassName(t);
            }
          };
          g = [];
          v = [];
          if (n.qsa = Q.test(h.querySelectorAll)) {
            lt(function (t) {
              var e;
              f.appendChild(t).innerHTML = "<a id='" + w + "'></a><select id='" + w + "-\r\\' msallowcapture=''><option selected=''></option></select>";
              if (t.querySelectorAll("[msallowcapture^='']").length) {
                v.push("[*^$]=" + L + "*(?:''|\"\")");
              }
              if (!t.querySelectorAll("[selected]").length) {
                v.push("\\[" + L + "*(?:value|" + M + ")");
              }
              if (!t.querySelectorAll("[id~=" + w + "-]").length) {
                v.push("~=");
              }
              (e = h.createElement("input")).setAttribute("name", "");
              t.appendChild(e);
              if (!t.querySelectorAll("[name='']").length) {
                v.push("\\[" + L + "*name" + L + "*=" + L + "*(?:''|\"\")");
              }
              if (!t.querySelectorAll(":checked").length) {
                v.push(":checked");
              }
              if (!t.querySelectorAll("a#" + w + "+*").length) {
                v.push(".#.+[+~]");
              }
              t.querySelectorAll("\\\f");
              v.push("[\\r\\n\\f]");
            });
            lt(function (t) {
              t.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
              var e = h.createElement("input");
              e.setAttribute("type", "hidden");
              t.appendChild(e).setAttribute("name", "D");
              if (t.querySelectorAll("[name=d]").length) {
                v.push("name" + L + "*[*^$|!~]?=");
              }
              if (t.querySelectorAll(":enabled").length !== 2) {
                v.push(":enabled", ":disabled");
              }
              f.appendChild(t).disabled = true;
              if (t.querySelectorAll(":disabled").length !== 2) {
                v.push(":enabled", ":disabled");
              }
              t.querySelectorAll("*,:x");
              v.push(",.*:");
            });
          }
          if (n.matchesSelector = Q.test(b = f.matches || f.webkitMatchesSelector || f.mozMatchesSelector || f.oMatchesSelector || f.msMatchesSelector)) {
            lt(function (t) {
              n.disconnectedMatch = b.call(t, "*");
              b.call(t, "[s!='']:x");
              g.push("!=", B);
            });
          }
          v = v.length && new RegExp(v.join("|"));
          g = g.length && new RegExp(g.join("|"));
          e = Q.test(f.compareDocumentPosition);
          y = e || Q.test(f.contains) ? function (t, e) {
            var n = t.nodeType === 9 ? t.documentElement : t;
            var i = e && e.parentNode;
            return t === i || !!i && i.nodeType === 1 && !!(n.contains ? n.contains(i) : t.compareDocumentPosition && t.compareDocumentPosition(i) & 16);
          } : function (t, e) {
            if (e) {
              while (e = e.parentNode) {
                if (e === t) {
                  return true;
                }
              }
            }
            return false;
          };
          j = e ? function (t, e) {
            if (t === e) {
              d = true;
              return 0;
            }
            var i = !t.compareDocumentPosition - !e.compareDocumentPosition;
            return i || ((i = (t.ownerDocument || t) == (e.ownerDocument || e) ? t.compareDocumentPosition(e) : 1) & 1 || !n.sortDetached && e.compareDocumentPosition(t) === i ? t == h || t.ownerDocument == x && y(x, t) ? -1 : e == h || e.ownerDocument == x && y(x, e) ? 1 : l ? I(l, t) - I(l, e) : 0 : i & 4 ? -1 : 1);
          } : function (t, e) {
            if (t === e) {
              d = true;
              return 0;
            }
            var n;
            var i = 0;
            var r = t.parentNode;
            var o = e.parentNode;
            var s = [t];
            var a = [e];
            if (!r || !o) {
              if (t == h) {
                return -1;
              } else if (e == h) {
                return 1;
              } else if (r) {
                return -1;
              } else if (o) {
                return 1;
              } else if (l) {
                return I(l, t) - I(l, e);
              } else {
                return 0;
              }
            }
            if (r === o) {
              return pt(t, e);
            }
            for (n = t; n = n.parentNode;) {
              s.unshift(n);
            }
            for (n = e; n = n.parentNode;) {
              a.unshift(n);
            }
            while (s[i] === a[i]) {
              i++;
            }
            if (i) {
              return pt(s[i], a[i]);
            } else if (s[i] == x) {
              return -1;
            } else if (a[i] == x) {
              return 1;
            } else {
              return 0;
            }
          };
          return h;
        } else {
          return h;
        }
      };
      at.matches = function (t, e) {
        return at(t, null, null, e);
      };
      at.matchesSelector = function (t, e) {
        p(t);
        if (n.matchesSelector && m && !k[e + " "] && (!g || !g.test(e)) && (!v || !v.test(e))) {
          try {
            var i = b.call(t, e);
            if (i || n.disconnectedMatch || t.document && t.document.nodeType !== 11) {
              return i;
            }
          } catch (t) {
            k(e, true);
          }
        }
        return at(e, h, null, [t]).length > 0;
      };
      at.contains = function (t, e) {
        if ((t.ownerDocument || t) != h) {
          p(t);
        }
        return y(t, e);
      };
      at.attr = function (t, e) {
        if ((t.ownerDocument || t) != h) {
          p(t);
        }
        var r = i.attrHandle[e.toLowerCase()];
        var o = r && A.call(i.attrHandle, e.toLowerCase()) ? r(t, e, !m) : undefined;
        if (o !== undefined) {
          return o;
        } else if (n.attributes || !m) {
          return t.getAttribute(e);
        } else if ((o = t.getAttributeNode(e)) && o.specified) {
          return o.value;
        } else {
          return null;
        }
      };
      at.escape = function (t) {
        return (t + "").replace(it, rt);
      };
      at.error = function (t) {
        throw new Error("Syntax error, unrecognized expression: " + t);
      };
      at.uniqueSort = function (t) {
        var e;
        var i = [];
        var r = 0;
        var o = 0;
        d = !n.detectDuplicates;
        l = !n.sortStable && t.slice(0);
        t.sort(j);
        if (d) {
          while (e = t[o++]) {
            if (e === t[o]) {
              r = i.push(o);
            }
          }
          while (r--) {
            t.splice(i[r], 1);
          }
        }
        l = null;
        return t;
      };
      r = at.getText = function (t) {
        var e;
        var n = "";
        var i = 0;
        var o = t.nodeType;
        if (o) {
          if (o === 1 || o === 9 || o === 11) {
            if (typeof t.textContent == "string") {
              return t.textContent;
            }
            for (t = t.firstChild; t; t = t.nextSibling) {
              n += r(t);
            }
          } else if (o === 3 || o === 4) {
            return t.nodeValue;
          }
        } else {
          while (e = t[i++]) {
            n += r(e);
          }
        }
        return n;
      };
      (i = at.selectors = {
        cacheLength: 50,
        createPseudo: ut,
        match: G,
        attrHandle: {},
        find: {},
        relative: {
          ">": {
            dir: "parentNode",
            first: true
          },
          " ": {
            dir: "parentNode"
          },
          "+": {
            dir: "previousSibling",
            first: true
          },
          "~": {
            dir: "previousSibling"
          }
        },
        preFilter: {
          ATTR: function (t) {
            t[1] = t[1].replace(et, nt);
            t[3] = (t[3] || t[4] || t[5] || "").replace(et, nt);
            if (t[2] === "~=") {
              t[3] = " " + t[3] + " ";
            }
            return t.slice(0, 4);
          },
          CHILD: function (t) {
            t[1] = t[1].toLowerCase();
            if (t[1].slice(0, 3) === "nth") {
              if (!t[3]) {
                at.error(t[0]);
              }
              t[4] = +(t[4] ? t[5] + (t[6] || 1) : (t[3] === "even" || t[3] === "odd") * 2);
              t[5] = +(t[7] + t[8] || t[3] === "odd");
            } else if (t[3]) {
              at.error(t[0]);
            }
            return t;
          },
          PSEUDO: function (t) {
            var e;
            var n = !t[6] && t[2];
            if (G.CHILD.test(t[0])) {
              return null;
            } else {
              if (t[3]) {
                t[2] = t[4] || t[5] || "";
              } else if (n && V.test(n) && (e = s(n, true)) && (e = n.indexOf(")", n.length - e) - n.length)) {
                t[0] = t[0].slice(0, e);
                t[2] = n.slice(0, e);
              }
              return t.slice(0, 3);
            }
          }
        },
        filter: {
          TAG: function (t) {
            var e = t.replace(et, nt).toLowerCase();
            if (t === "*") {
              return function () {
                return true;
              };
            } else {
              return function (t) {
                return t.nodeName && t.nodeName.toLowerCase() === e;
              };
            }
          },
          CLASS: function (t) {
            var e = T[t + " "];
            return e || (e = new RegExp("(^|" + L + ")" + t + "(" + L + "|$)")) && T(t, function (t) {
              return e.test(typeof t.className == "string" && t.className || t.getAttribute !== undefined && t.getAttribute("class") || "");
            });
          },
          ATTR: function (t, e, n) {
            return function (i) {
              var r = at.attr(i, t);
              if (r == null) {
                return e === "!=";
              } else {
                return !e || (r += "", e === "=" ? r === n : e === "!=" ? r !== n : e === "^=" ? n && r.indexOf(n) === 0 : e === "*=" ? n && r.indexOf(n) > -1 : e === "$=" ? n && r.slice(-n.length) === n : e === "~=" ? (" " + r.replace(U, " ") + " ").indexOf(n) > -1 : e === "|=" && (r === n || r.slice(0, n.length + 1) === n + "-"));
              }
            };
          },
          CHILD: function (t, e, n, i, r) {
            var o = t.slice(0, 3) !== "nth";
            var s = t.slice(-4) !== "last";
            var a = e === "of-type";
            if (i === 1 && r === 0) {
              return function (t) {
                return !!t.parentNode;
              };
            } else {
              return function (e, n, c) {
                var u;
                var l;
                var d;
                var p;
                var h;
                var f;
                var m = o !== s ? "nextSibling" : "previousSibling";
                var v = e.parentNode;
                var g = a && e.nodeName.toLowerCase();
                var b = !c && !a;
                var y = false;
                if (v) {
                  if (o) {
                    while (m) {
                      for (p = e; p = p[m];) {
                        if (a ? p.nodeName.toLowerCase() === g : p.nodeType === 1) {
                          return false;
                        }
                      }
                      f = m = t === "only" && !f && "nextSibling";
                    }
                    return true;
                  }
                  f = [s ? v.firstChild : v.lastChild];
                  if (s && b) {
                    y = (h = (u = (l = (d = (p = v)[w] || (p[w] = {}))[p.uniqueID] || (d[p.uniqueID] = {}))[t] || [])[0] === N && u[1]) && u[2];
                    p = h && v.childNodes[h];
                    while (p = ++h && p && p[m] || (y = h = 0) || f.pop()) {
                      if (p.nodeType === 1 && ++y && p === e) {
                        l[t] = [N, h, y];
                        break;
                      }
                    }
                  } else {
                    if (b) {
                      y = h = (u = (l = (d = (p = e)[w] || (p[w] = {}))[p.uniqueID] || (d[p.uniqueID] = {}))[t] || [])[0] === N && u[1];
                    }
                    if (y === false) {
                      while ((p = ++h && p && p[m] || (y = h = 0) || f.pop()) && ((a ? p.nodeName.toLowerCase() !== g : p.nodeType !== 1) || !++y || (b && ((l = (d = p[w] ||= {})[p.uniqueID] || (d[p.uniqueID] = {}))[t] = [N, y]), p !== e)));
                    }
                  }
                  return (y -= r) === i || y % i == 0 && y / i >= 0;
                }
              };
            }
          },
          PSEUDO: function (t, e) {
            var n;
            var r = i.pseudos[t] || i.setFilters[t.toLowerCase()] || at.error("unsupported pseudo: " + t);
            if (r[w]) {
              return r(e);
            } else if (r.length > 1) {
              n = [t, t, "", e];
              if (i.setFilters.hasOwnProperty(t.toLowerCase())) {
                return ut(function (t, n) {
                  var i;
                  var o = r(t, e);
                  for (var s = o.length; s--;) {
                    t[i = I(t, o[s])] = !(n[i] = o[s]);
                  }
                });
              } else {
                return function (t) {
                  return r(t, 0, n);
                };
              }
            } else {
              return r;
            }
          }
        },
        pseudos: {
          not: ut(function (t) {
            var e = [];
            var n = [];
            var i = a(t.replace(F, "$1"));
            if (i[w]) {
              return ut(function (t, e, n, r) {
                var o;
                var s = i(t, null, r, []);
                for (var a = t.length; a--;) {
                  if (o = s[a]) {
                    t[a] = !(e[a] = o);
                  }
                }
              });
            } else {
              return function (t, r, o) {
                e[0] = t;
                i(e, null, o, n);
                e[0] = null;
                return !n.pop();
              };
            }
          }),
          has: ut(function (t) {
            return function (e) {
              return at(t, e).length > 0;
            };
          }),
          contains: ut(function (t) {
            t = t.replace(et, nt);
            return function (e) {
              return (e.textContent || r(e)).indexOf(t) > -1;
            };
          }),
          lang: ut(function (t) {
            if (!Y.test(t || "")) {
              at.error("unsupported lang: " + t);
            }
            t = t.replace(et, nt).toLowerCase();
            return function (e) {
              var n;
              do {
                if (n = m ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang")) {
                  return (n = n.toLowerCase()) === t || n.indexOf(t + "-") === 0;
                }
              } while ((e = e.parentNode) && e.nodeType === 1);
              return false;
            };
          }),
          target: function (e) {
            var n = t.location && t.location.hash;
            return n && n.slice(1) === e.id;
          },
          root: function (t) {
            return t === f;
          },
          focus: function (t) {
            return t === h.activeElement && (!h.hasFocus || h.hasFocus()) && (!!t.type || !!t.href || !!~t.tabIndex);
          },
          enabled: mt(false),
          disabled: mt(true),
          checked: function (t) {
            var e = t.nodeName.toLowerCase();
            return e === "input" && !!t.checked || e === "option" && !!t.selected;
          },
          selected: function (t) {
            if (t.parentNode) {
              t.parentNode.selectedIndex;
            }
            return t.selected === true;
          },
          empty: function (t) {
            for (t = t.firstChild; t; t = t.nextSibling) {
              if (t.nodeType < 6) {
                return false;
              }
            }
            return true;
          },
          parent: function (t) {
            return !i.pseudos.empty(t);
          },
          header: function (t) {
            return J.test(t.nodeName);
          },
          input: function (t) {
            return X.test(t.nodeName);
          },
          button: function (t) {
            var e = t.nodeName.toLowerCase();
            return e === "input" && t.type === "button" || e === "button";
          },
          text: function (t) {
            var e;
            return t.nodeName.toLowerCase() === "input" && t.type === "text" && ((e = t.getAttribute("type")) == null || e.toLowerCase() === "text");
          },
          first: vt(function () {
            return [0];
          }),
          last: vt(function (t, e) {
            return [e - 1];
          }),
          eq: vt(function (t, e, n) {
            return [n < 0 ? n + e : n];
          }),
          even: vt(function (t, e) {
            for (var n = 0; n < e; n += 2) {
              t.push(n);
            }
            return t;
          }),
          odd: vt(function (t, e) {
            for (var n = 1; n < e; n += 2) {
              t.push(n);
            }
            return t;
          }),
          lt: vt(function (t, e, n) {
            for (var i = n < 0 ? n + e : n > e ? e : n; --i >= 0;) {
              t.push(i);
            }
            return t;
          }),
          gt: vt(function (t, e, n) {
            for (var i = n < 0 ? n + e : n; ++i < e;) {
              t.push(i);
            }
            return t;
          })
        }
      }).pseudos.nth = i.pseudos.eq;
      for (e in {
        radio: true,
        checkbox: true,
        file: true,
        password: true,
        image: true
      }) {
        i.pseudos[e] = ht(e);
      }
      for (e in {
        submit: true,
        reset: true
      }) {
        i.pseudos[e] = ft(e);
      }
      function bt() {}
      function yt(t) {
        for (var e = 0, n = t.length, i = ""; e < n; e++) {
          i += t[e].value;
        }
        return i;
      }
      function wt(t, e, n) {
        var i = e.dir;
        var r = e.next;
        var o = r || i;
        var s = n && o === "parentNode";
        var a = C++;
        if (e.first) {
          return function (e, n, r) {
            while (e = e[i]) {
              if (e.nodeType === 1 || s) {
                return t(e, n, r);
              }
            }
            return false;
          };
        } else {
          return function (e, n, c) {
            var u;
            var l;
            var p = [N, a];
            if (c) {
              while (e = e[i]) {
                if ((e.nodeType === 1 || s) && t(e, n, c)) {
                  return true;
                }
              }
            } else {
              while (e = e[i]) {
                if (e.nodeType === 1 || s) {
                  l = (e[w] ||= {})[e.uniqueID] ||= {};
                  if (r && r === e.nodeName.toLowerCase()) {
                    e = e[i] || e;
                  } else {
                    if ((u = l[o]) && u[0] === N && u[1] === a) {
                      return p[2] = u[2];
                    }
                    l[o] = p;
                    if (p[2] = t(e, n, c)) {
                      return true;
                    }
                  }
                }
              }
            }
            return false;
          };
        }
      }
      function xt(t) {
        if (t.length > 1) {
          return function (e, n, i) {
            for (var r = t.length; r--;) {
              if (!t[r](e, n, i)) {
                return false;
              }
            }
            return true;
          };
        } else {
          return t[0];
        }
      }
      function Nt(t, e, n, i, r) {
        var o;
        var s = [];
        for (var a = 0, c = t.length, u = e != null; a < c; a++) {
          if (o = t[a]) {
            if (!n || !!n(o, i, r)) {
              s.push(o);
              if (u) {
                e.push(a);
              }
            }
          }
        }
        return s;
      }
      function Ct(t, e, n, i, r, o) {
        if (i && !i[w]) {
          i = Ct(i);
        }
        if (r && !r[w]) {
          r = Ct(r, o);
        }
        return ut(function (o, s, a, c) {
          var u;
          var l;
          var d;
          var p = [];
          var h = [];
          var f = s.length;
          var m = o || function (t, e, n) {
            for (var i = 0, r = e.length; i < r; i++) {
              at(t, e[i], n);
            }
            return n;
          }(e || "*", a.nodeType ? [a] : a, []);
          var v = !t || !o && e ? m : Nt(m, p, t, a, c);
          var g = n ? r || (o ? t : f || i) ? [] : s : v;
          if (n) {
            n(v, g, a, c);
          }
          if (i) {
            u = Nt(g, h);
            i(u, [], a, c);
            l = u.length;
            while (l--) {
              if (d = u[l]) {
                g[h[l]] = !(v[h[l]] = d);
              }
            }
          }
          if (o) {
            if (r || t) {
              if (r) {
                u = [];
                l = g.length;
                while (l--) {
                  if (d = g[l]) {
                    u.push(v[l] = d);
                  }
                }
                r(null, g = [], u, c);
              }
              for (l = g.length; l--;) {
                if ((d = g[l]) && (u = r ? I(o, d) : p[l]) > -1) {
                  o[u] = !(s[u] = d);
                }
              }
            }
          } else {
            g = Nt(g === s ? g.splice(f, g.length) : g);
            if (r) {
              r(null, s, g, c);
            } else {
              D.apply(s, g);
            }
          }
        });
      }
      function Tt(t) {
        var e;
        var n;
        var r;
        for (var o = t.length, s = i.relative[t[0].type], a = s || i.relative[" "], c = s ? 1 : 0, l = wt(function (t) {
            return t === e;
          }, a, true), d = wt(function (t) {
            return I(e, t) > -1;
          }, a, true), p = [function (t, n, i) {
            var r = !s && (i || n !== u) || ((e = n).nodeType ? l(t, n, i) : d(t, n, i));
            e = null;
            return r;
          }]; c < o; c++) {
          if (n = i.relative[t[c].type]) {
            p = [wt(xt(p), n)];
          } else {
            if ((n = i.filter[t[c].type].apply(null, t[c].matches))[w]) {
              for (r = ++c; r < o && !i.relative[t[r].type]; r++);
              return Ct(c > 1 && xt(p), c > 1 && yt(t.slice(0, c - 1).concat({
                value: t[c - 2].type === " " ? "*" : ""
              })).replace(F, "$1"), n, c < r && Tt(t.slice(c, r)), r < o && Tt(t = t.slice(r)), r < o && yt(t));
            }
            p.push(n);
          }
        }
        return xt(p);
      }
      bt.prototype = i.filters = i.pseudos;
      i.setFilters = new bt();
      s = at.tokenize = function (t, e) {
        var n;
        var r;
        var o;
        var s;
        var a;
        var c;
        var u;
        var l = S[t + " "];
        if (l) {
          if (e) {
            return 0;
          } else {
            return l.slice(0);
          }
        }
        a = t;
        c = [];
        u = i.preFilter;
        while (a) {
          if (!n || !!(r = q.exec(a))) {
            if (r) {
              a = a.slice(r[0].length) || a;
            }
            c.push(o = []);
          }
          n = false;
          if (r = z.exec(a)) {
            n = r.shift();
            o.push({
              value: n,
              type: r[0].replace(F, " ")
            });
            a = a.slice(n.length);
          }
          for (s in i.filter) {
            if (!!(r = G[s].exec(a)) && (!u[s] || !!(r = u[s](r)))) {
              n = r.shift();
              o.push({
                value: n,
                type: s,
                matches: r
              });
              a = a.slice(n.length);
            }
          }
          if (!n) {
            break;
          }
        }
        if (e) {
          return a.length;
        } else if (a) {
          return at.error(t);
        } else {
          return S(t, c).slice(0);
        }
      };
      a = at.compile = function (t, e) {
        var n;
        var r = [];
        var o = [];
        var a = O[t + " "];
        if (!a) {
          e ||= s(t);
          n = e.length;
          while (n--) {
            if ((a = Tt(e[n]))[w]) {
              r.push(a);
            } else {
              o.push(a);
            }
          }
          (a = O(t, function (t, e) {
            var n = e.length > 0;
            var r = t.length > 0;
            function o(o, s, a, c, l) {
              var d;
              var f;
              var v;
              var g = 0;
              var b = "0";
              var y = o && [];
              var w = [];
              var x = u;
              var C = o || r && i.find.TAG("*", l);
              var T = N += x == null ? 1 : Math.random() || 0.1;
              var S = C.length;
              for (l && (u = s == h || s || l); b !== S && (d = C[b]) != null; b++) {
                if (r && d) {
                  f = 0;
                  if (!s && d.ownerDocument != h) {
                    p(d);
                    a = !m;
                  }
                  while (v = t[f++]) {
                    if (v(d, s || h, a)) {
                      c.push(d);
                      break;
                    }
                  }
                  if (l) {
                    N = T;
                  }
                }
                if (n) {
                  if (d = !v && d) {
                    g--;
                  }
                  if (o) {
                    y.push(d);
                  }
                }
              }
              g += b;
              if (n && b !== g) {
                for (f = 0; v = e[f++];) {
                  v(y, w, s, a);
                }
                if (o) {
                  if (g > 0) {
                    while (b--) {
                      if (!y[b] && !w[b]) {
                        w[b] = P.call(c);
                      }
                    }
                  }
                  w = Nt(w);
                }
                D.apply(c, w);
                if (l && !o && w.length > 0 && g + e.length > 1) {
                  at.uniqueSort(c);
                }
              }
              if (l) {
                N = T;
                u = x;
              }
              return y;
            }
            if (n) {
              return ut(o);
            } else {
              return o;
            }
          }(o, r))).selector = t;
        }
        return a;
      };
      c = at.select = function (t, e, n, r) {
        var o;
        var c;
        var u;
        var l;
        var d;
        var p = typeof t == "function" && t;
        var h = !r && s(t = p.selector || t);
        n = n || [];
        if (h.length === 1) {
          if ((c = h[0] = h[0].slice(0)).length > 2 && (u = c[0]).type === "ID" && e.nodeType === 9 && m && i.relative[c[1].type]) {
            if (!(e = (i.find.ID(u.matches[0].replace(et, nt), e) || [])[0])) {
              return n;
            }
            if (p) {
              e = e.parentNode;
            }
            t = t.slice(c.shift().value.length);
          }
          for (o = G.needsContext.test(t) ? 0 : c.length; o-- && (u = c[o], !i.relative[l = u.type]);) {
            if ((d = i.find[l]) && (r = d(u.matches[0].replace(et, nt), tt.test(c[0].type) && gt(e.parentNode) || e))) {
              c.splice(o, 1);
              if (!(t = r.length && yt(c))) {
                D.apply(n, r);
                return n;
              }
              break;
            }
          }
        }
        (p || a(t, h))(r, e, !m, n, !e || tt.test(t) && gt(e.parentNode) || e);
        return n;
      };
      n.sortStable = w.split("").sort(j).join("") === w;
      n.detectDuplicates = !!d;
      p();
      n.sortDetached = lt(function (t) {
        return t.compareDocumentPosition(h.createElement("fieldset")) & 1;
      });
      if (!lt(function (t) {
        t.innerHTML = "<a href='#'></a>";
        return t.firstChild.getAttribute("href") === "#";
      })) {
        dt("type|href|height|width", function (t, e, n) {
          if (!n) {
            return t.getAttribute(e, e.toLowerCase() === "type" ? 1 : 2);
          }
        });
      }
      if (!n.attributes || !lt(function (t) {
        t.innerHTML = "<input/>";
        t.firstChild.setAttribute("value", "");
        return t.firstChild.getAttribute("value") === "";
      })) {
        dt("value", function (t, e, n) {
          if (!n && t.nodeName.toLowerCase() === "input") {
            return t.defaultValue;
          }
        });
      }
      if (!lt(function (t) {
        return t.getAttribute("disabled") == null;
      })) {
        dt(M, function (t, e, n) {
          var i;
          if (!n) {
            if (t[e] === true) {
              return e.toLowerCase();
            } else if ((i = t.getAttributeNode(e)) && i.specified) {
              return i.value;
            } else {
              return null;
            }
          }
        });
      }
      return at;
    }(n);
    C.find = S;
    (C.expr = S.selectors)[":"] = C.expr.pseudos;
    C.uniqueSort = C.unique = S.uniqueSort;
    C.text = S.getText;
    C.isXMLDoc = S.isXML;
    C.contains = S.contains;
    C.escapeSelector = S.escape;
    function O(t, e, n) {
      var i = [];
      var r = n !== undefined;
      while ((t = t[e]) && t.nodeType !== 9) {
        if (t.nodeType === 1) {
          if (r && C(t).is(n)) {
            break;
          }
          i.push(t);
        }
      }
      return i;
    }
    function k(t, e) {
      var n = [];
      for (; t; t = t.nextSibling) {
        if (t.nodeType === 1 && t !== e) {
          n.push(t);
        }
      }
      return n;
    }
    var j = C.expr.match.needsContext;
    function A(t, e) {
      return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase();
    }
    var E = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    function P(t, e, n) {
      if (g(e)) {
        return C.grep(t, function (t, i) {
          return !!e.call(t, i, t) !== n;
        });
      } else if (e.nodeType) {
        return C.grep(t, function (t) {
          return t === e !== n;
        });
      } else if (typeof e != "string") {
        return C.grep(t, function (t) {
          return l.call(e, t) > -1 !== n;
        });
      } else {
        return C.filter(e, t, n);
      }
    }
    C.filter = function (t, e, n) {
      var i = e[0];
      if (n) {
        t = ":not(" + t + ")";
      }
      if (e.length === 1 && i.nodeType === 1) {
        if (C.find.matchesSelector(i, t)) {
          return [i];
        } else {
          return [];
        }
      } else {
        return C.find.matches(t, C.grep(e, function (t) {
          return t.nodeType === 1;
        }));
      }
    };
    C.fn.extend({
      find: function (t) {
        var e;
        var n;
        var i = this.length;
        var r = this;
        if (typeof t != "string") {
          return this.pushStack(C(t).filter(function () {
            for (e = 0; e < i; e++) {
              if (C.contains(r[e], this)) {
                return true;
              }
            }
          }));
        }
        n = this.pushStack([]);
        e = 0;
        for (; e < i; e++) {
          C.find(t, r[e], n);
        }
        if (i > 1) {
          return C.uniqueSort(n);
        } else {
          return n;
        }
      },
      filter: function (t) {
        return this.pushStack(P(this, t || [], false));
      },
      not: function (t) {
        return this.pushStack(P(this, t || [], true));
      },
      is: function (t) {
        return !!P(this, typeof t == "string" && j.test(t) ? C(t) : t || [], false).length;
      }
    });
    var _;
    var D = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (C.fn.init = function (t, e, n) {
      var i;
      var r;
      if (!t) {
        return this;
      }
      n = n || _;
      if (typeof t == "string") {
        if (!(i = t[0] === "<" && t[t.length - 1] === ">" && t.length >= 3 ? [null, t, null] : D.exec(t)) || !i[1] && e) {
          if (!e || e.jquery) {
            return (e || n).find(t);
          } else {
            return this.constructor(e).find(t);
          }
        }
        if (i[1]) {
          e = e instanceof C ? e[0] : e;
          C.merge(this, C.parseHTML(i[1], e && e.nodeType ? e.ownerDocument || e : y, true));
          if (E.test(i[1]) && C.isPlainObject(e)) {
            for (i in e) {
              if (g(this[i])) {
                this[i](e[i]);
              } else {
                this.attr(i, e[i]);
              }
            }
          }
          return this;
        }
        if (r = y.getElementById(i[2])) {
          this[0] = r;
          this.length = 1;
        }
        return this;
      }
      if (t.nodeType) {
        this[0] = t;
        this.length = 1;
        return this;
      } else if (g(t)) {
        if (n.ready !== undefined) {
          return n.ready(t);
        } else {
          return t(C);
        }
      } else {
        return C.makeArray(t, this);
      }
    }).prototype = C.fn;
    _ = C(y);
    var $ = /^(?:parents|prev(?:Until|All))/;
    var I = {
      children: true,
      contents: true,
      next: true,
      prev: true
    };
    function M(t, e) {
      while ((t = t[e]) && t.nodeType !== 1);
      return t;
    }
    C.fn.extend({
      has: function (t) {
        var e = C(t, this);
        var n = e.length;
        return this.filter(function () {
          for (var t = 0; t < n; t++) {
            if (C.contains(this, e[t])) {
              return true;
            }
          }
        });
      },
      closest: function (t, e) {
        var n;
        var i = 0;
        var r = this.length;
        var o = [];
        var s = typeof t != "string" && C(t);
        if (!j.test(t)) {
          for (; i < r; i++) {
            for (n = this[i]; n && n !== e; n = n.parentNode) {
              if (n.nodeType < 11 && (s ? s.index(n) > -1 : n.nodeType === 1 && C.find.matchesSelector(n, t))) {
                o.push(n);
                break;
              }
            }
          }
        }
        return this.pushStack(o.length > 1 ? C.uniqueSort(o) : o);
      },
      index: function (t) {
        if (t) {
          if (typeof t == "string") {
            return l.call(C(t), this[0]);
          } else {
            return l.call(this, t.jquery ? t[0] : t);
          }
        } else if (this[0] && this[0].parentNode) {
          return this.first().prevAll().length;
        } else {
          return -1;
        }
      },
      add: function (t, e) {
        return this.pushStack(C.uniqueSort(C.merge(this.get(), C(t, e))));
      },
      addBack: function (t) {
        return this.add(t == null ? this.prevObject : this.prevObject.filter(t));
      }
    });
    C.each({
      parent: function (t) {
        var e = t.parentNode;
        if (e && e.nodeType !== 11) {
          return e;
        } else {
          return null;
        }
      },
      parents: function (t) {
        return O(t, "parentNode");
      },
      parentsUntil: function (t, e, n) {
        return O(t, "parentNode", n);
      },
      next: function (t) {
        return M(t, "nextSibling");
      },
      prev: function (t) {
        return M(t, "previousSibling");
      },
      nextAll: function (t) {
        return O(t, "nextSibling");
      },
      prevAll: function (t) {
        return O(t, "previousSibling");
      },
      nextUntil: function (t, e, n) {
        return O(t, "nextSibling", n);
      },
      prevUntil: function (t, e, n) {
        return O(t, "previousSibling", n);
      },
      siblings: function (t) {
        return k((t.parentNode || {}).firstChild, t);
      },
      children: function (t) {
        return k(t.firstChild);
      },
      contents: function (t) {
        if (t.contentDocument != null && s(t.contentDocument)) {
          return t.contentDocument;
        } else {
          if (A(t, "template")) {
            t = t.content || t;
          }
          return C.merge([], t.childNodes);
        }
      }
    }, function (t, e) {
      C.fn[t] = function (n, i) {
        var r = C.map(this, e, n);
        if (t.slice(-5) !== "Until") {
          i = n;
        }
        if (i && typeof i == "string") {
          r = C.filter(i, r);
        }
        if (this.length > 1) {
          if (!I[t]) {
            C.uniqueSort(r);
          }
          if ($.test(t)) {
            r.reverse();
          }
        }
        return this.pushStack(r);
      };
    });
    var L = /[^\x20\t\r\n\f]+/g;
    function R(t) {
      return t;
    }
    function H(t) {
      throw t;
    }
    function B(t, e, n, i) {
      var r;
      try {
        if (t && g(r = t.promise)) {
          r.call(t).done(e).fail(n);
        } else if (t && g(r = t.then)) {
          r.call(t, e, n);
        } else {
          e.apply(undefined, [t].slice(i));
        }
      } catch (t) {
        n.apply(undefined, [t]);
      }
    }
    C.Callbacks = function (t) {
      t = typeof t == "string" ? function (t) {
        var e = {};
        C.each(t.match(L) || [], function (t, n) {
          e[n] = true;
        });
        return e;
      }(t) : C.extend({}, t);
      var e;
      var n;
      var i;
      var r;
      var o = [];
      var s = [];
      var a = -1;
      function c() {
        r = r || t.once;
        i = e = true;
        for (; s.length; a = -1) {
          for (n = s.shift(); ++a < o.length;) {
            if (o[a].apply(n[0], n[1]) === false && t.stopOnFalse) {
              a = o.length;
              n = false;
            }
          }
        }
        if (!t.memory) {
          n = false;
        }
        e = false;
        if (r) {
          o = n ? [] : "";
        }
      }
      var u = {
        add: function () {
          if (o) {
            if (n && !e) {
              a = o.length - 1;
              s.push(n);
            }
            (function e(n) {
              C.each(n, function (n, i) {
                if (g(i)) {
                  if (!t.unique || !u.has(i)) {
                    o.push(i);
                  }
                } else if (i && i.length && N(i) !== "string") {
                  e(i);
                }
              });
            })(arguments);
            if (n && !e) {
              c();
            }
          }
          return this;
        },
        remove: function () {
          C.each(arguments, function (t, e) {
            for (var n; (n = C.inArray(e, o, n)) > -1;) {
              o.splice(n, 1);
              if (n <= a) {
                a--;
              }
            }
          });
          return this;
        },
        has: function (t) {
          if (t) {
            return C.inArray(t, o) > -1;
          } else {
            return o.length > 0;
          }
        },
        empty: function () {
          o &&= [];
          return this;
        },
        disable: function () {
          r = s = [];
          o = n = "";
          return this;
        },
        disabled: function () {
          return !o;
        },
        lock: function () {
          r = s = [];
          if (!n && !e) {
            o = n = "";
          }
          return this;
        },
        locked: function () {
          return !!r;
        },
        fireWith: function (t, n) {
          if (!r) {
            n = [t, (n = n || []).slice ? n.slice() : n];
            s.push(n);
            if (!e) {
              c();
            }
          }
          return this;
        },
        fire: function () {
          u.fireWith(this, arguments);
          return this;
        },
        fired: function () {
          return !!i;
        }
      };
      return u;
    };
    C.extend({
      Deferred: function (t) {
        var e = [["notify", "progress", C.Callbacks("memory"), C.Callbacks("memory"), 2], ["resolve", "done", C.Callbacks("once memory"), C.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", C.Callbacks("once memory"), C.Callbacks("once memory"), 1, "rejected"]];
        var i = "pending";
        var r = {
          state: function () {
            return i;
          },
          always: function () {
            o.done(arguments).fail(arguments);
            return this;
          },
          catch: function (t) {
            return r.then(null, t);
          },
          pipe: function () {
            var t = arguments;
            return C.Deferred(function (n) {
              C.each(e, function (e, i) {
                var r = g(t[i[4]]) && t[i[4]];
                o[i[1]](function () {
                  var t = r && r.apply(this, arguments);
                  if (t && g(t.promise)) {
                    t.promise().progress(n.notify).done(n.resolve).fail(n.reject);
                  } else {
                    n[i[0] + "With"](this, r ? [t] : arguments);
                  }
                });
              });
              t = null;
            }).promise();
          },
          then: function (t, i, r) {
            var o = 0;
            function s(t, e, i, r) {
              return function () {
                var a = this;
                var c = arguments;
                function u() {
                  var n;
                  var u;
                  if (!(t < o)) {
                    if ((n = i.apply(a, c)) === e.promise()) {
                      throw new TypeError("Thenable self-resolution");
                    }
                    u = n && (typeof n == "object" || typeof n == "function") && n.then;
                    if (g(u)) {
                      if (r) {
                        u.call(n, s(o, e, R, r), s(o, e, H, r));
                      } else {
                        o++;
                        u.call(n, s(o, e, R, r), s(o, e, H, r), s(o, e, R, e.notifyWith));
                      }
                    } else {
                      if (i !== R) {
                        a = undefined;
                        c = [n];
                      }
                      (r || e.resolveWith)(a, c);
                    }
                  }
                }
                var l = r ? u : function () {
                  try {
                    u();
                  } catch (n) {
                    if (C.Deferred.exceptionHook) {
                      C.Deferred.exceptionHook(n, l.stackTrace);
                    }
                    if (t + 1 >= o) {
                      if (i !== H) {
                        a = undefined;
                        c = [n];
                      }
                      e.rejectWith(a, c);
                    }
                  }
                };
                if (t) {
                  l();
                } else {
                  if (C.Deferred.getStackHook) {
                    l.stackTrace = C.Deferred.getStackHook();
                  }
                  n.setTimeout(l);
                }
              };
            }
            return C.Deferred(function (n) {
              e[0][3].add(s(0, n, g(r) ? r : R, n.notifyWith));
              e[1][3].add(s(0, n, g(t) ? t : R));
              e[2][3].add(s(0, n, g(i) ? i : H));
            }).promise();
          },
          promise: function (t) {
            if (t != null) {
              return C.extend(t, r);
            } else {
              return r;
            }
          }
        };
        var o = {};
        C.each(e, function (t, n) {
          var s = n[2];
          var a = n[5];
          r[n[1]] = s.add;
          if (a) {
            s.add(function () {
              i = a;
            }, e[3 - t][2].disable, e[3 - t][3].disable, e[0][2].lock, e[0][3].lock);
          }
          s.add(n[3].fire);
          o[n[0]] = function () {
            o[n[0] + "With"](this === o ? undefined : this, arguments);
            return this;
          };
          o[n[0] + "With"] = s.fireWith;
        });
        r.promise(o);
        if (t) {
          t.call(o, o);
        }
        return o;
      },
      when: function (t) {
        var e = arguments.length;
        var n = e;
        var i = Array(n);
        var r = a.call(arguments);
        var o = C.Deferred();
        function s(t) {
          return function (n) {
            i[t] = this;
            r[t] = arguments.length > 1 ? a.call(arguments) : n;
            if (! --e) {
              o.resolveWith(i, r);
            }
          };
        }
        if (e <= 1 && (B(t, o.done(s(n)).resolve, o.reject, !e), o.state() === "pending" || g(r[n] && r[n].then))) {
          return o.then();
        }
        while (n--) {
          B(r[n], s(n), o.reject);
        }
        return o.promise();
      }
    });
    var U = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    C.Deferred.exceptionHook = function (t, e) {
      if (n.console && n.console.warn && t && U.test(t.name)) {
        n.console.warn("jQuery.Deferred exception: " + t.message, t.stack, e);
      }
    };
    C.readyException = function (t) {
      n.setTimeout(function () {
        throw t;
      });
    };
    var F = C.Deferred();
    function q() {
      y.removeEventListener("DOMContentLoaded", q);
      n.removeEventListener("load", q);
      C.ready();
    }
    C.fn.ready = function (t) {
      F.then(t).catch(function (t) {
        C.readyException(t);
      });
      return this;
    };
    C.extend({
      isReady: false,
      readyWait: 1,
      ready: function (t) {
        if (!(t === true ? --C.readyWait : C.isReady)) {
          C.isReady = true;
          if (t === true || !(--C.readyWait > 0)) {
            F.resolveWith(y, [C]);
          }
        }
      }
    });
    C.ready.then = F.then;
    if (y.readyState === "complete" || y.readyState !== "loading" && !y.documentElement.doScroll) {
      n.setTimeout(C.ready);
    } else {
      y.addEventListener("DOMContentLoaded", q);
      n.addEventListener("load", q);
    }
    var z = function t(e, n, i, r, o, s, a) {
      var c = 0;
      var u = e.length;
      var l = i == null;
      if (N(i) === "object") {
        o = true;
        for (c in i) {
          t(e, n, c, i[c], true, s, a);
        }
      } else if (r !== undefined && (o = true, g(r) || (a = true), l && (a ? (n.call(e, r), n = null) : (l = n, n = function (t, e, n) {
        return l.call(C(t), n);
      })), n)) {
        for (; c < u; c++) {
          n(e[c], i, a ? r : r.call(e[c], c, n(e[c], i)));
        }
      }
      if (o) {
        return e;
      } else if (l) {
        return n.call(e);
      } else if (u) {
        return n(e[0], i);
      } else {
        return s;
      }
    };
    var W = /^-ms-/;
    var V = /-([a-z])/g;
    function Y(t, e) {
      return e.toUpperCase();
    }
    function G(t) {
      return t.replace(W, "ms-").replace(V, Y);
    }
    function K(t) {
      return t.nodeType === 1 || t.nodeType === 9 || !+t.nodeType;
    }
    function X() {
      this.expando = C.expando + X.uid++;
    }
    X.uid = 1;
    X.prototype = {
      cache: function (t) {
        var e = t[this.expando];
        if (!e) {
          e = {};
          if (K(t)) {
            if (t.nodeType) {
              t[this.expando] = e;
            } else {
              Object.defineProperty(t, this.expando, {
                value: e,
                configurable: true
              });
            }
          }
        }
        return e;
      },
      set: function (t, e, n) {
        var i;
        var r = this.cache(t);
        if (typeof e == "string") {
          r[G(e)] = n;
        } else {
          for (i in e) {
            r[G(i)] = e[i];
          }
        }
        return r;
      },
      get: function (t, e) {
        if (e === undefined) {
          return this.cache(t);
        } else {
          return t[this.expando] && t[this.expando][G(e)];
        }
      },
      access: function (t, e, n) {
        if (e === undefined || e && typeof e == "string" && n === undefined) {
          return this.get(t, e);
        } else {
          this.set(t, e, n);
          if (n !== undefined) {
            return n;
          } else {
            return e;
          }
        }
      },
      remove: function (t, e) {
        var n;
        var i = t[this.expando];
        if (i !== undefined) {
          if (e !== undefined) {
            n = (e = Array.isArray(e) ? e.map(G) : (e = G(e)) in i ? [e] : e.match(L) || []).length;
            while (n--) {
              delete i[e[n]];
            }
          }
          if (e === undefined || C.isEmptyObject(i)) {
            if (t.nodeType) {
              t[this.expando] = undefined;
            } else {
              delete t[this.expando];
            }
          }
        }
      },
      hasData: function (t) {
        var e = t[this.expando];
        return e !== undefined && !C.isEmptyObject(e);
      }
    };
    var J = new X();
    var Q = new X();
    var Z = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
    var tt = /[A-Z]/g;
    function et(t, e, n) {
      var i;
      if (n === undefined && t.nodeType === 1) {
        i = "data-" + e.replace(tt, "-$&").toLowerCase();
        if (typeof (n = t.getAttribute(i)) == "string") {
          try {
            n = function (t) {
              return t === "true" || t !== "false" && (t === "null" ? null : t === +t + "" ? +t : Z.test(t) ? JSON.parse(t) : t);
            }(n);
          } catch (t) {}
          Q.set(t, e, n);
        } else {
          n = undefined;
        }
      }
      return n;
    }
    C.extend({
      hasData: function (t) {
        return Q.hasData(t) || J.hasData(t);
      },
      data: function (t, e, n) {
        return Q.access(t, e, n);
      },
      removeData: function (t, e) {
        Q.remove(t, e);
      },
      _data: function (t, e, n) {
        return J.access(t, e, n);
      },
      _removeData: function (t, e) {
        J.remove(t, e);
      }
    });
    C.fn.extend({
      data: function (t, e) {
        var n;
        var i;
        var r;
        var o = this[0];
        var s = o && o.attributes;
        if (t === undefined) {
          if (this.length && (r = Q.get(o), o.nodeType === 1 && !J.get(o, "hasDataAttrs"))) {
            for (n = s.length; n--;) {
              if (s[n] && (i = s[n].name).indexOf("data-") === 0) {
                i = G(i.slice(5));
                et(o, i, r[i]);
              }
            }
            J.set(o, "hasDataAttrs", true);
          }
          return r;
        }
        if (typeof t == "object") {
          return this.each(function () {
            Q.set(this, t);
          });
        } else {
          return z(this, function (e) {
            var n;
            if (o && e === undefined) {
              if ((n = Q.get(o, t)) !== undefined || (n = et(o, t)) !== undefined) {
                return n;
              } else {
                return undefined;
              }
            }
            this.each(function () {
              Q.set(this, t, e);
            });
          }, null, e, arguments.length > 1, null, true);
        }
      },
      removeData: function (t) {
        return this.each(function () {
          Q.remove(this, t);
        });
      }
    });
    C.extend({
      queue: function (t, e, n) {
        var i;
        if (t) {
          e = (e || "fx") + "queue";
          i = J.get(t, e);
          if (n) {
            if (!i || Array.isArray(n)) {
              i = J.access(t, e, C.makeArray(n));
            } else {
              i.push(n);
            }
          }
          return i || [];
        }
      },
      dequeue: function (t, e) {
        var n = C.queue(t, e = e || "fx");
        var i = n.length;
        var r = n.shift();
        var o = C._queueHooks(t, e);
        if (r === "inprogress") {
          r = n.shift();
          i--;
        }
        if (r) {
          if (e === "fx") {
            n.unshift("inprogress");
          }
          delete o.stop;
          r.call(t, function () {
            C.dequeue(t, e);
          }, o);
        }
        if (!i && o) {
          o.empty.fire();
        }
      },
      _queueHooks: function (t, e) {
        var n = e + "queueHooks";
        return J.get(t, n) || J.access(t, n, {
          empty: C.Callbacks("once memory").add(function () {
            J.remove(t, [e + "queue", n]);
          })
        });
      }
    });
    C.fn.extend({
      queue: function (t, e) {
        var n = 2;
        if (typeof t != "string") {
          e = t;
          t = "fx";
          n--;
        }
        if (arguments.length < n) {
          return C.queue(this[0], t);
        } else if (e === undefined) {
          return this;
        } else {
          return this.each(function () {
            var n = C.queue(this, t, e);
            C._queueHooks(this, t);
            if (t === "fx" && n[0] !== "inprogress") {
              C.dequeue(this, t);
            }
          });
        }
      },
      dequeue: function (t) {
        return this.each(function () {
          C.dequeue(this, t);
        });
      },
      clearQueue: function (t) {
        return this.queue(t || "fx", []);
      },
      promise: function (t, e) {
        var n;
        var i = 1;
        var r = C.Deferred();
        var o = this;
        var s = this.length;
        function a() {
          if (! --i) {
            r.resolveWith(o, [o]);
          }
        }
        if (typeof t != "string") {
          e = t;
          t = undefined;
        }
        t = t || "fx";
        while (s--) {
          if ((n = J.get(o[s], t + "queueHooks")) && n.empty) {
            i++;
            n.empty.add(a);
          }
        }
        a();
        return r.promise(e);
      }
    });
    var nt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
    var it = new RegExp("^(?:([+-])=|)(" + nt + ")([a-z%]*)$", "i");
    var rt = ["Top", "Right", "Bottom", "Left"];
    var ot = y.documentElement;
    function st(t) {
      return C.contains(t.ownerDocument, t);
    }
    var at = {
      composed: true
    };
    if (ot.getRootNode) {
      st = function (t) {
        return C.contains(t.ownerDocument, t) || t.getRootNode(at) === t.ownerDocument;
      };
    }
    function ct(t, e) {
      return (t = e || t).style.display === "none" || t.style.display === "" && st(t) && C.css(t, "display") === "none";
    }
    function ut(t, e, n, i) {
      var r;
      var o;
      var s = 20;
      var a = i ? function () {
        return i.cur();
      } : function () {
        return C.css(t, e, "");
      };
      var c = a();
      var u = n && n[3] || (C.cssNumber[e] ? "" : "px");
      var l = t.nodeType && (C.cssNumber[e] || u !== "px" && +c) && it.exec(C.css(t, e));
      if (l && l[3] !== u) {
        c /= 2;
        u = u || l[3];
        l = +c || 1;
        while (s--) {
          C.style(t, e, l + u);
          if ((1 - o) * (1 - (o = a() / c || 0.5)) <= 0) {
            s = 0;
          }
          l /= o;
        }
        C.style(t, e, (l *= 2) + u);
        n = n || [];
      }
      if (n) {
        l = +l || +c || 0;
        r = n[1] ? l + (n[1] + 1) * n[2] : +n[2];
        if (i) {
          i.unit = u;
          i.start = l;
          i.end = r;
        }
      }
      return r;
    }
    var lt = {};
    function dt(t) {
      var e;
      var n = t.ownerDocument;
      var i = t.nodeName;
      var r = lt[i];
      return r || (e = n.body.appendChild(n.createElement(i)), r = C.css(e, "display"), e.parentNode.removeChild(e), r === "none" && (r = "block"), lt[i] = r, r);
    }
    function pt(t, e) {
      var n;
      var i;
      var r = [];
      for (var o = 0, s = t.length; o < s; o++) {
        if ((i = t[o]).style) {
          n = i.style.display;
          if (e) {
            if (n === "none") {
              r[o] = J.get(i, "display") || null;
              if (!r[o]) {
                i.style.display = "";
              }
            }
            if (i.style.display === "" && ct(i)) {
              r[o] = dt(i);
            }
          } else if (n !== "none") {
            r[o] = "none";
            J.set(i, "display", n);
          }
        }
      }
      for (o = 0; o < s; o++) {
        if (r[o] != null) {
          t[o].style.display = r[o];
        }
      }
      return t;
    }
    C.fn.extend({
      show: function () {
        return pt(this, true);
      },
      hide: function () {
        return pt(this);
      },
      toggle: function (t) {
        if (typeof t == "boolean") {
          if (t) {
            return this.show();
          } else {
            return this.hide();
          }
        } else {
          return this.each(function () {
            if (ct(this)) {
              C(this).show();
            } else {
              C(this).hide();
            }
          });
        }
      }
    });
    var ht;
    var ft;
    var mt = /^(?:checkbox|radio)$/i;
    var vt = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
    var gt = /^$|^module$|\/(?:java|ecma)script/i;
    ht = y.createDocumentFragment().appendChild(y.createElement("div"));
    (ft = y.createElement("input")).setAttribute("type", "radio");
    ft.setAttribute("checked", "checked");
    ft.setAttribute("name", "t");
    ht.appendChild(ft);
    v.checkClone = ht.cloneNode(true).cloneNode(true).lastChild.checked;
    ht.innerHTML = "<textarea>x</textarea>";
    v.noCloneChecked = !!ht.cloneNode(true).lastChild.defaultValue;
    ht.innerHTML = "<option></option>";
    v.option = !!ht.lastChild;
    var bt = {
      thead: [1, "<table>", "</table>"],
      col: [2, "<table><colgroup>", "</colgroup></table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: [0, "", ""]
    };
    function yt(t, e) {
      var n;
      n = t.getElementsByTagName !== undefined ? t.getElementsByTagName(e || "*") : t.querySelectorAll !== undefined ? t.querySelectorAll(e || "*") : [];
      if (e === undefined || e && A(t, e)) {
        return C.merge([t], n);
      } else {
        return n;
      }
    }
    function wt(t, e) {
      for (var n = 0, i = t.length; n < i; n++) {
        J.set(t[n], "globalEval", !e || J.get(e[n], "globalEval"));
      }
    }
    bt.tbody = bt.tfoot = bt.colgroup = bt.caption = bt.thead;
    bt.th = bt.td;
    if (!v.option) {
      bt.optgroup = bt.option = [1, "<select multiple='multiple'>", "</select>"];
    }
    var xt = /<|&#?\w+;/;
    function Nt(t, e, n, i, r) {
      var o;
      var s;
      var a;
      var c;
      var u;
      var l;
      var d = e.createDocumentFragment();
      var p = [];
      for (var h = 0, f = t.length; h < f; h++) {
        if ((o = t[h]) || o === 0) {
          if (N(o) === "object") {
            C.merge(p, o.nodeType ? [o] : o);
          } else if (xt.test(o)) {
            s = s || d.appendChild(e.createElement("div"));
            a = (vt.exec(o) || ["", ""])[1].toLowerCase();
            c = bt[a] || bt._default;
            s.innerHTML = c[1] + C.htmlPrefilter(o) + c[2];
            l = c[0];
            while (l--) {
              s = s.lastChild;
            }
            C.merge(p, s.childNodes);
            (s = d.firstChild).textContent = "";
          } else {
            p.push(e.createTextNode(o));
          }
        }
      }
      d.textContent = "";
      h = 0;
      while (o = p[h++]) {
        if (i && C.inArray(o, i) > -1) {
          if (r) {
            r.push(o);
          }
        } else {
          u = st(o);
          s = yt(d.appendChild(o), "script");
          if (u) {
            wt(s);
          }
          if (n) {
            for (l = 0; o = s[l++];) {
              if (gt.test(o.type || "")) {
                n.push(o);
              }
            }
          }
        }
      }
      return d;
    }
    var Ct = /^([^.]*)(?:\.(.+)|)/;
    function Tt() {
      return true;
    }
    function St() {
      return false;
    }
    function Ot(t, e) {
      return t === function () {
        try {
          return y.activeElement;
        } catch (t) {}
      }() == (e === "focus");
    }
    function kt(t, e, n, i, r, o) {
      var s;
      var a;
      if (typeof e == "object") {
        if (typeof n != "string") {
          i = i || n;
          n = undefined;
        }
        for (a in e) {
          kt(t, a, n, i, e[a], o);
        }
        return t;
      }
      if (i == null && r == null) {
        r = n;
        i = n = undefined;
      } else if (r == null) {
        if (typeof n == "string") {
          r = i;
          i = undefined;
        } else {
          r = i;
          i = n;
          n = undefined;
        }
      }
      if (r === false) {
        r = St;
      } else if (!r) {
        return t;
      }
      if (o === 1) {
        s = r;
        (r = function (t) {
          C().off(t);
          return s.apply(this, arguments);
        }).guid = s.guid ||= C.guid++;
      }
      return t.each(function () {
        C.event.add(this, e, r, i, n);
      });
    }
    function jt(t, e, n) {
      if (n) {
        J.set(t, e, false);
        C.event.add(t, e, {
          namespace: false,
          handler: function (t) {
            var i;
            var r;
            var o = J.get(this, e);
            if (t.isTrigger & 1 && this[e]) {
              if (o.length) {
                if ((C.event.special[e] || {}).delegateType) {
                  t.stopPropagation();
                }
              } else {
                o = a.call(arguments);
                J.set(this, e, o);
                i = n(this, e);
                this[e]();
                if (o !== (r = J.get(this, e)) || i) {
                  J.set(this, e, false);
                } else {
                  r = {};
                }
                if (o !== r) {
                  t.stopImmediatePropagation();
                  t.preventDefault();
                  return r && r.value;
                }
              }
            } else if (o.length) {
              J.set(this, e, {
                value: C.event.trigger(C.extend(o[0], C.Event.prototype), o.slice(1), this)
              });
              t.stopImmediatePropagation();
            }
          }
        });
      } else if (J.get(t, e) === undefined) {
        C.event.add(t, e, Tt);
      }
    }
    C.event = {
      global: {},
      add: function (t, e, n, i, r) {
        var o;
        var s;
        var a;
        var c;
        var u;
        var l;
        var d;
        var p;
        var h;
        var f;
        var m;
        var v = J.get(t);
        if (K(t)) {
          if (n.handler) {
            n = (o = n).handler;
            r = o.selector;
          }
          if (r) {
            C.find.matchesSelector(ot, r);
          }
          n.guid ||= C.guid++;
          if (!(c = v.events)) {
            c = v.events = Object.create(null);
          }
          if (!(s = v.handle)) {
            s = v.handle = function (e) {
              if (C !== undefined && C.event.triggered !== e.type) {
                return C.event.dispatch.apply(t, arguments);
              } else {
                return undefined;
              }
            };
          }
          u = (e = (e || "").match(L) || [""]).length;
          while (u--) {
            h = m = (a = Ct.exec(e[u]) || [])[1];
            f = (a[2] || "").split(".").sort();
            if (h) {
              d = C.event.special[h] || {};
              h = (r ? d.delegateType : d.bindType) || h;
              d = C.event.special[h] || {};
              l = C.extend({
                type: h,
                origType: m,
                data: i,
                handler: n,
                guid: n.guid,
                selector: r,
                needsContext: r && C.expr.match.needsContext.test(r),
                namespace: f.join(".")
              }, o);
              if (!(p = c[h])) {
                (p = c[h] = []).delegateCount = 0;
                if (!d.setup || d.setup.call(t, i, f, s) === false) {
                  if (t.addEventListener) {
                    t.addEventListener(h, s);
                  }
                }
              }
              if (d.add) {
                d.add.call(t, l);
                l.handler.guid ||= n.guid;
              }
              if (r) {
                p.splice(p.delegateCount++, 0, l);
              } else {
                p.push(l);
              }
              C.event.global[h] = true;
            }
          }
        }
      },
      remove: function (t, e, n, i, r) {
        var o;
        var s;
        var a;
        var c;
        var u;
        var l;
        var d;
        var p;
        var h;
        var f;
        var m;
        var v = J.hasData(t) && J.get(t);
        if (v && (c = v.events)) {
          for (u = (e = (e || "").match(L) || [""]).length; u--;) {
            h = m = (a = Ct.exec(e[u]) || [])[1];
            f = (a[2] || "").split(".").sort();
            if (h) {
              d = C.event.special[h] || {};
              p = c[h = (i ? d.delegateType : d.bindType) || h] || [];
              a = a[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)");
              s = o = p.length;
              while (o--) {
                l = p[o];
                if ((!!r || m === l.origType) && (!n || n.guid === l.guid) && (!a || !!a.test(l.namespace)) && (!i || i === l.selector || i === "**" && !!l.selector)) {
                  p.splice(o, 1);
                  if (l.selector) {
                    p.delegateCount--;
                  }
                  if (d.remove) {
                    d.remove.call(t, l);
                  }
                }
              }
              if (s && !p.length) {
                if (!d.teardown || d.teardown.call(t, f, v.handle) === false) {
                  C.removeEvent(t, h, v.handle);
                }
                delete c[h];
              }
            } else {
              for (h in c) {
                C.event.remove(t, h + e[u], n, i, true);
              }
            }
          }
          if (C.isEmptyObject(c)) {
            J.remove(t, "handle events");
          }
        }
      },
      dispatch: function (t) {
        var e;
        var n;
        var i;
        var r;
        var o;
        var s;
        var a = new Array(arguments.length);
        var c = C.event.fix(t);
        var u = (J.get(this, "events") || Object.create(null))[c.type] || [];
        var l = C.event.special[c.type] || {};
        a[0] = c;
        e = 1;
        for (; e < arguments.length; e++) {
          a[e] = arguments[e];
        }
        c.delegateTarget = this;
        if (!l.preDispatch || l.preDispatch.call(this, c) !== false) {
          s = C.event.handlers.call(this, c, u);
          e = 0;
          while ((r = s[e++]) && !c.isPropagationStopped()) {
            c.currentTarget = r.elem;
            n = 0;
            while ((o = r.handlers[n++]) && !c.isImmediatePropagationStopped()) {
              if (!c.rnamespace || o.namespace === false || !!c.rnamespace.test(o.namespace)) {
                c.handleObj = o;
                c.data = o.data;
                if ((i = ((C.event.special[o.origType] || {}).handle || o.handler).apply(r.elem, a)) !== undefined && (c.result = i) === false) {
                  c.preventDefault();
                  c.stopPropagation();
                }
              }
            }
          }
          if (l.postDispatch) {
            l.postDispatch.call(this, c);
          }
          return c.result;
        }
      },
      handlers: function (t, e) {
        var n;
        var i;
        var r;
        var o;
        var s;
        var a = [];
        var c = e.delegateCount;
        var u = t.target;
        if (c && u.nodeType && (t.type !== "click" || !(t.button >= 1))) {
          for (; u !== this; u = u.parentNode || this) {
            if (u.nodeType === 1 && (t.type !== "click" || u.disabled !== true)) {
              o = [];
              s = {};
              n = 0;
              for (; n < c; n++) {
                if (s[r = (i = e[n]).selector + " "] === undefined) {
                  s[r] = i.needsContext ? C(r, this).index(u) > -1 : C.find(r, this, null, [u]).length;
                }
                if (s[r]) {
                  o.push(i);
                }
              }
              if (o.length) {
                a.push({
                  elem: u,
                  handlers: o
                });
              }
            }
          }
        }
        u = this;
        if (c < e.length) {
          a.push({
            elem: u,
            handlers: e.slice(c)
          });
        }
        return a;
      },
      addProp: function (t, e) {
        Object.defineProperty(C.Event.prototype, t, {
          enumerable: true,
          configurable: true,
          get: g(e) ? function () {
            if (this.originalEvent) {
              return e(this.originalEvent);
            }
          } : function () {
            if (this.originalEvent) {
              return this.originalEvent[t];
            }
          },
          set: function (e) {
            Object.defineProperty(this, t, {
              enumerable: true,
              configurable: true,
              writable: true,
              value: e
            });
          }
        });
      },
      fix: function (t) {
        if (t[C.expando]) {
          return t;
        } else {
          return new C.Event(t);
        }
      },
      special: {
        load: {
          noBubble: true
        },
        click: {
          setup: function (t) {
            var e = this || t;
            if (mt.test(e.type) && e.click && A(e, "input")) {
              jt(e, "click", Tt);
            }
            return false;
          },
          trigger: function (t) {
            var e = this || t;
            if (mt.test(e.type) && e.click && A(e, "input")) {
              jt(e, "click");
            }
            return true;
          },
          _default: function (t) {
            var e = t.target;
            return mt.test(e.type) && e.click && A(e, "input") && J.get(e, "click") || A(e, "a");
          }
        },
        beforeunload: {
          postDispatch: function (t) {
            if (t.result !== undefined && t.originalEvent) {
              t.originalEvent.returnValue = t.result;
            }
          }
        }
      }
    };
    C.removeEvent = function (t, e, n) {
      if (t.removeEventListener) {
        t.removeEventListener(e, n);
      }
    };
    (C.Event = function (t, e) {
      if (!(this instanceof C.Event)) {
        return new C.Event(t, e);
      }
      if (t && t.type) {
        this.originalEvent = t;
        this.type = t.type;
        this.isDefaultPrevented = t.defaultPrevented || t.defaultPrevented === undefined && t.returnValue === false ? Tt : St;
        this.target = t.target && t.target.nodeType === 3 ? t.target.parentNode : t.target;
        this.currentTarget = t.currentTarget;
        this.relatedTarget = t.relatedTarget;
      } else {
        this.type = t;
      }
      if (e) {
        C.extend(this, e);
      }
      this.timeStamp = t && t.timeStamp || Date.now();
      this[C.expando] = true;
    }).prototype = {
      constructor: C.Event,
      isDefaultPrevented: St,
      isPropagationStopped: St,
      isImmediatePropagationStopped: St,
      isSimulated: false,
      preventDefault: function () {
        var t = this.originalEvent;
        this.isDefaultPrevented = Tt;
        if (t && !this.isSimulated) {
          t.preventDefault();
        }
      },
      stopPropagation: function () {
        var t = this.originalEvent;
        this.isPropagationStopped = Tt;
        if (t && !this.isSimulated) {
          t.stopPropagation();
        }
      },
      stopImmediatePropagation: function () {
        var t = this.originalEvent;
        this.isImmediatePropagationStopped = Tt;
        if (t && !this.isSimulated) {
          t.stopImmediatePropagation();
        }
        this.stopPropagation();
      }
    };
    C.each({
      altKey: true,
      bubbles: true,
      cancelable: true,
      changedTouches: true,
      ctrlKey: true,
      detail: true,
      eventPhase: true,
      metaKey: true,
      pageX: true,
      pageY: true,
      shiftKey: true,
      view: true,
      char: true,
      code: true,
      charCode: true,
      key: true,
      keyCode: true,
      button: true,
      buttons: true,
      clientX: true,
      clientY: true,
      offsetX: true,
      offsetY: true,
      pointerId: true,
      pointerType: true,
      screenX: true,
      screenY: true,
      targetTouches: true,
      toElement: true,
      touches: true,
      which: true
    }, C.event.addProp);
    C.each({
      focus: "focusin",
      blur: "focusout"
    }, function (t, e) {
      C.event.special[t] = {
        setup: function () {
          jt(this, t, Ot);
          return false;
        },
        trigger: function () {
          jt(this, t);
          return true;
        },
        _default: function () {
          return true;
        },
        delegateType: e
      };
    });
    C.each({
      mouseenter: "mouseover",
      mouseleave: "mouseout",
      pointerenter: "pointerover",
      pointerleave: "pointerout"
    }, function (t, e) {
      C.event.special[t] = {
        delegateType: e,
        bindType: e,
        handle: function (t) {
          var n;
          var i = this;
          var r = t.relatedTarget;
          var o = t.handleObj;
          if (!r || r !== i && !C.contains(i, r)) {
            t.type = o.origType;
            n = o.handler.apply(this, arguments);
            t.type = e;
          }
          return n;
        }
      };
    });
    C.fn.extend({
      on: function (t, e, n, i) {
        return kt(this, t, e, n, i);
      },
      one: function (t, e, n, i) {
        return kt(this, t, e, n, i, 1);
      },
      off: function (t, e, n) {
        var i;
        var r;
        if (t && t.preventDefault && t.handleObj) {
          i = t.handleObj;
          C(t.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler);
          return this;
        }
        if (typeof t == "object") {
          for (r in t) {
            this.off(r, e, t[r]);
          }
          return this;
        }
        if (e === false || typeof e == "function") {
          n = e;
          e = undefined;
        }
        if (n === false) {
          n = St;
        }
        return this.each(function () {
          C.event.remove(this, t, n, e);
        });
      }
    });
    var At = /<script|<style|<link/i;
    var Et = /checked\s*(?:[^=]|=\s*.checked.)/i;
    var Pt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    function _t(t, e) {
      return A(t, "table") && A(e.nodeType !== 11 ? e : e.firstChild, "tr") && C(t).children("tbody")[0] || t;
    }
    function Dt(t) {
      t.type = (t.getAttribute("type") !== null) + "/" + t.type;
      return t;
    }
    function $t(t) {
      if ((t.type || "").slice(0, 5) === "true/") {
        t.type = t.type.slice(5);
      } else {
        t.removeAttribute("type");
      }
      return t;
    }
    function It(t, e) {
      var n;
      var i;
      var r;
      var o;
      var s;
      var a;
      if (e.nodeType === 1) {
        if (J.hasData(t) && (a = J.get(t).events)) {
          J.remove(e, "handle events");
          for (r in a) {
            n = 0;
            i = a[r].length;
            for (; n < i; n++) {
              C.event.add(e, r, a[r][n]);
            }
          }
        }
        if (Q.hasData(t)) {
          o = Q.access(t);
          s = C.extend({}, o);
          Q.set(e, s);
        }
      }
    }
    function Mt(t, e) {
      var n = e.nodeName.toLowerCase();
      if (n === "input" && mt.test(t.type)) {
        e.checked = t.checked;
      } else if (n === "input" || n === "textarea") {
        e.defaultValue = t.defaultValue;
      }
    }
    function Lt(t, e, n, i) {
      e = c(e);
      var r;
      var o;
      var s;
      var a;
      var u;
      var l;
      var d = 0;
      var p = t.length;
      var h = p - 1;
      var f = e[0];
      var m = g(f);
      if (m || p > 1 && typeof f == "string" && !v.checkClone && Et.test(f)) {
        return t.each(function (r) {
          var o = t.eq(r);
          if (m) {
            e[0] = f.call(this, r, o.html());
          }
          Lt(o, e, n, i);
        });
      }
      if (p && (o = (r = Nt(e, t[0].ownerDocument, false, t, i)).firstChild, r.childNodes.length === 1 && (r = o), o || i)) {
        for (a = (s = C.map(yt(r, "script"), Dt)).length; d < p; d++) {
          u = r;
          if (d !== h) {
            u = C.clone(u, true, true);
            if (a) {
              C.merge(s, yt(u, "script"));
            }
          }
          n.call(t[d], u, d);
        }
        if (a) {
          l = s[s.length - 1].ownerDocument;
          C.map(s, $t);
          d = 0;
          for (; d < a; d++) {
            u = s[d];
            if (gt.test(u.type || "") && !J.access(u, "globalEval") && C.contains(l, u)) {
              if (u.src && (u.type || "").toLowerCase() !== "module") {
                if (C._evalUrl && !u.noModule) {
                  C._evalUrl(u.src, {
                    nonce: u.nonce || u.getAttribute("nonce")
                  }, l);
                }
              } else {
                x(u.textContent.replace(Pt, ""), u, l);
              }
            }
          }
        }
      }
      return t;
    }
    function Rt(t, e, n) {
      for (var i, r = e ? C.filter(e, t) : t, o = 0; (i = r[o]) != null; o++) {
        if (!n && i.nodeType === 1) {
          C.cleanData(yt(i));
        }
        if (i.parentNode) {
          if (n && st(i)) {
            wt(yt(i, "script"));
          }
          i.parentNode.removeChild(i);
        }
      }
      return t;
    }
    C.extend({
      htmlPrefilter: function (t) {
        return t;
      },
      clone: function (t, e, n) {
        var i;
        var r;
        var o;
        var s;
        var a = t.cloneNode(true);
        var c = st(t);
        if (!v.noCloneChecked && (t.nodeType === 1 || t.nodeType === 11) && !C.isXMLDoc(t)) {
          s = yt(a);
          i = 0;
          r = (o = yt(t)).length;
          for (; i < r; i++) {
            Mt(o[i], s[i]);
          }
        }
        if (e) {
          if (n) {
            o = o || yt(t);
            s = s || yt(a);
            i = 0;
            r = o.length;
            for (; i < r; i++) {
              It(o[i], s[i]);
            }
          } else {
            It(t, a);
          }
        }
        if ((s = yt(a, "script")).length > 0) {
          wt(s, !c && yt(t, "script"));
        }
        return a;
      },
      cleanData: function (t) {
        var e;
        for (var n, i, r = C.event.special, o = 0; (n = t[o]) !== undefined; o++) {
          if (K(n)) {
            if (e = n[J.expando]) {
              if (e.events) {
                for (i in e.events) {
                  if (r[i]) {
                    C.event.remove(n, i);
                  } else {
                    C.removeEvent(n, i, e.handle);
                  }
                }
              }
              n[J.expando] = undefined;
            }
            n[Q.expando] &&= undefined;
          }
        }
      }
    });
    C.fn.extend({
      detach: function (t) {
        return Rt(this, t, true);
      },
      remove: function (t) {
        return Rt(this, t);
      },
      text: function (t) {
        return z(this, function (t) {
          if (t === undefined) {
            return C.text(this);
          } else {
            return this.empty().each(function () {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                this.textContent = t;
              }
            });
          }
        }, null, t, arguments.length);
      },
      append: function () {
        return Lt(this, arguments, function (t) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            _t(this, t).appendChild(t);
          }
        });
      },
      prepend: function () {
        return Lt(this, arguments, function (t) {
          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
            var e = _t(this, t);
            e.insertBefore(t, e.firstChild);
          }
        });
      },
      before: function () {
        return Lt(this, arguments, function (t) {
          if (this.parentNode) {
            this.parentNode.insertBefore(t, this);
          }
        });
      },
      after: function () {
        return Lt(this, arguments, function (t) {
          if (this.parentNode) {
            this.parentNode.insertBefore(t, this.nextSibling);
          }
        });
      },
      empty: function () {
        for (var t, e = 0; (t = this[e]) != null; e++) {
          if (t.nodeType === 1) {
            C.cleanData(yt(t, false));
            t.textContent = "";
          }
        }
        return this;
      },
      clone: function (t, e) {
        t = t != null && t;
        e = e == null ? t : e;
        return this.map(function () {
          return C.clone(this, t, e);
        });
      },
      html: function (t) {
        return z(this, function (t) {
          var e = this[0] || {};
          var n = 0;
          var i = this.length;
          if (t === undefined && e.nodeType === 1) {
            return e.innerHTML;
          }
          if (typeof t == "string" && !At.test(t) && !bt[(vt.exec(t) || ["", ""])[1].toLowerCase()]) {
            t = C.htmlPrefilter(t);
            try {
              for (; n < i; n++) {
                if ((e = this[n] || {}).nodeType === 1) {
                  C.cleanData(yt(e, false));
                  e.innerHTML = t;
                }
              }
              e = 0;
            } catch (t) {}
          }
          if (e) {
            this.empty().append(t);
          }
        }, null, t, arguments.length);
      },
      replaceWith: function () {
        var t = [];
        return Lt(this, arguments, function (e) {
          var n = this.parentNode;
          if (C.inArray(this, t) < 0) {
            C.cleanData(yt(this));
            if (n) {
              n.replaceChild(e, this);
            }
          }
        }, t);
      }
    });
    C.each({
      appendTo: "append",
      prependTo: "prepend",
      insertBefore: "before",
      insertAfter: "after",
      replaceAll: "replaceWith"
    }, function (t, e) {
      C.fn[t] = function (t) {
        var n;
        var i = [];
        var r = C(t);
        for (var o = r.length - 1, s = 0; s <= o; s++) {
          n = s === o ? this : this.clone(true);
          C(r[s])[e](n);
          u.apply(i, n.get());
        }
        return this.pushStack(i);
      };
    });
    var Ht = new RegExp("^(" + nt + ")(?!px)[a-z%]+$", "i");
    function Bt(t) {
      var e = t.ownerDocument.defaultView;
      if (!e || !e.opener) {
        e = n;
      }
      return e.getComputedStyle(t);
    }
    function Ut(t, e, n) {
      var i;
      var r;
      var o = {};
      for (r in e) {
        o[r] = t.style[r];
        t.style[r] = e[r];
      }
      i = n.call(t);
      for (r in e) {
        t.style[r] = o[r];
      }
      return i;
    }
    var Ft = new RegExp(rt.join("|"), "i");
    function qt(t, e, n) {
      var i;
      var r;
      var o;
      var s;
      var a = t.style;
      if (n = n || Bt(t)) {
        if ((s = n.getPropertyValue(e) || n[e]) === "" && !st(t)) {
          s = C.style(t, e);
        }
        if (!v.pixelBoxStyles() && Ht.test(s) && Ft.test(e)) {
          i = a.width;
          r = a.minWidth;
          o = a.maxWidth;
          a.minWidth = a.maxWidth = a.width = s;
          s = n.width;
          a.width = i;
          a.minWidth = r;
          a.maxWidth = o;
        }
      }
      if (s !== undefined) {
        return s + "";
      } else {
        return s;
      }
    }
    function zt(t, e) {
      return {
        get: function () {
          if (!t()) {
            return (this.get = e).apply(this, arguments);
          }
          delete this.get;
        }
      };
    }
    (function () {
      function t() {
        if (l) {
          u.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0";
          l.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%";
          ot.appendChild(u).appendChild(l);
          var t = n.getComputedStyle(l);
          i = t.top !== "1%";
          c = e(t.marginLeft) === 12;
          l.style.right = "60%";
          s = e(t.right) === 36;
          r = e(t.width) === 36;
          l.style.position = "absolute";
          o = e(l.offsetWidth / 3) === 12;
          ot.removeChild(u);
          l = null;
        }
      }
      function e(t) {
        return Math.round(parseFloat(t));
      }
      var i;
      var r;
      var o;
      var s;
      var a;
      var c;
      var u = y.createElement("div");
      var l = y.createElement("div");
      if (l.style) {
        l.style.backgroundClip = "content-box";
        l.cloneNode(true).style.backgroundClip = "";
        v.clearCloneStyle = l.style.backgroundClip === "content-box";
        C.extend(v, {
          boxSizingReliable: function () {
            t();
            return r;
          },
          pixelBoxStyles: function () {
            t();
            return s;
          },
          pixelPosition: function () {
            t();
            return i;
          },
          reliableMarginLeft: function () {
            t();
            return c;
          },
          scrollboxSize: function () {
            t();
            return o;
          },
          reliableTrDimensions: function () {
            var t;
            var e;
            var i;
            var r;
            if (a == null) {
              t = y.createElement("table");
              e = y.createElement("tr");
              i = y.createElement("div");
              t.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
              e.style.cssText = "border:1px solid";
              e.style.height = "1px";
              i.style.height = "9px";
              i.style.display = "block";
              ot.appendChild(t).appendChild(e).appendChild(i);
              r = n.getComputedStyle(e);
              a = parseInt(r.height, 10) + parseInt(r.borderTopWidth, 10) + parseInt(r.borderBottomWidth, 10) === e.offsetHeight;
              ot.removeChild(t);
            }
            return a;
          }
        });
      }
    })();
    var Wt = ["Webkit", "Moz", "ms"];
    var Vt = y.createElement("div").style;
    var Yt = {};
    function Gt(t) {
      var e = C.cssProps[t] || Yt[t];
      return e || (t in Vt ? t : Yt[t] = function (t) {
        var e = t[0].toUpperCase() + t.slice(1);
        for (var n = Wt.length; n--;) {
          if ((t = Wt[n] + e) in Vt) {
            return t;
          }
        }
      }(t) || t);
    }
    var Kt = /^(none|table(?!-c[ea]).+)/;
    var Xt = /^--/;
    var Jt = {
      position: "absolute",
      visibility: "hidden",
      display: "block"
    };
    var Qt = {
      letterSpacing: "0",
      fontWeight: "400"
    };
    function Zt(t, e, n) {
      var i = it.exec(e);
      if (i) {
        return Math.max(0, i[2] - (n || 0)) + (i[3] || "px");
      } else {
        return e;
      }
    }
    function te(t, e, n, i, r, o) {
      var s = e === "width" ? 1 : 0;
      var a = 0;
      var c = 0;
      if (n === (i ? "border" : "content")) {
        return 0;
      }
      for (; s < 4; s += 2) {
        if (n === "margin") {
          c += C.css(t, n + rt[s], true, r);
        }
        if (i) {
          if (n === "content") {
            c -= C.css(t, "padding" + rt[s], true, r);
          }
          if (n !== "margin") {
            c -= C.css(t, "border" + rt[s] + "Width", true, r);
          }
        } else {
          c += C.css(t, "padding" + rt[s], true, r);
          if (n !== "padding") {
            c += C.css(t, "border" + rt[s] + "Width", true, r);
          } else {
            a += C.css(t, "border" + rt[s] + "Width", true, r);
          }
        }
      }
      if (!i && o >= 0) {
        c += Math.max(0, Math.ceil(t["offset" + e[0].toUpperCase() + e.slice(1)] - o - c - a - 0.5)) || 0;
      }
      return c;
    }
    function ee(t, e, n) {
      var i = Bt(t);
      var r = (!v.boxSizingReliable() || n) && C.css(t, "boxSizing", false, i) === "border-box";
      var o = r;
      var s = qt(t, e, i);
      var a = "offset" + e[0].toUpperCase() + e.slice(1);
      if (Ht.test(s)) {
        if (!n) {
          return s;
        }
        s = "auto";
      }
      if ((!v.boxSizingReliable() && r || !v.reliableTrDimensions() && A(t, "tr") || s === "auto" || !parseFloat(s) && C.css(t, "display", false, i) === "inline") && t.getClientRects().length) {
        r = C.css(t, "boxSizing", false, i) === "border-box";
        if (o = a in t) {
          s = t[a];
        }
      }
      return (s = parseFloat(s) || 0) + te(t, e, n || (r ? "border" : "content"), o, i, s) + "px";
    }
    function ne(t, e, n, i, r) {
      return new ne.prototype.init(t, e, n, i, r);
    }
    C.extend({
      cssHooks: {
        opacity: {
          get: function (t, e) {
            if (e) {
              var n = qt(t, "opacity");
              if (n === "") {
                return "1";
              } else {
                return n;
              }
            }
          }
        }
      },
      cssNumber: {
        animationIterationCount: true,
        columnCount: true,
        fillOpacity: true,
        flexGrow: true,
        flexShrink: true,
        fontWeight: true,
        gridArea: true,
        gridColumn: true,
        gridColumnEnd: true,
        gridColumnStart: true,
        gridRow: true,
        gridRowEnd: true,
        gridRowStart: true,
        lineHeight: true,
        opacity: true,
        order: true,
        orphans: true,
        widows: true,
        zIndex: true,
        zoom: true
      },
      cssProps: {},
      style: function (t, e, n, i) {
        if (t && t.nodeType !== 3 && t.nodeType !== 8 && t.style) {
          var r;
          var o;
          var s;
          var a = G(e);
          var c = Xt.test(e);
          var u = t.style;
          if (!c) {
            e = Gt(a);
          }
          s = C.cssHooks[e] || C.cssHooks[a];
          if (n === undefined) {
            if (s && "get" in s && (r = s.get(t, false, i)) !== undefined) {
              return r;
            } else {
              return u[e];
            }
          }
          if ((o = typeof n) === "string" && (r = it.exec(n)) && r[1]) {
            n = ut(t, e, r);
            o = "number";
          }
          if (n != null && n == n) {
            if (o === "number" && !c) {
              n += r && r[3] || (C.cssNumber[a] ? "" : "px");
            }
            if (!v.clearCloneStyle && n === "" && e.indexOf("background") === 0) {
              u[e] = "inherit";
            }
            if (!s || !("set" in s) || (n = s.set(t, n, i)) !== undefined) {
              if (c) {
                u.setProperty(e, n);
              } else {
                u[e] = n;
              }
            }
          }
        }
      },
      css: function (t, e, n, i) {
        var r;
        var o;
        var s;
        var a = G(e);
        if (!Xt.test(e)) {
          e = Gt(a);
        }
        if ((s = C.cssHooks[e] || C.cssHooks[a]) && "get" in s) {
          r = s.get(t, true, n);
        }
        if (r === undefined) {
          r = qt(t, e, i);
        }
        if (r === "normal" && e in Qt) {
          r = Qt[e];
        }
        if (n === "" || n) {
          o = parseFloat(r);
          if (n === true || isFinite(o)) {
            return o || 0;
          } else {
            return r;
          }
        } else {
          return r;
        }
      }
    });
    C.each(["height", "width"], function (t, e) {
      C.cssHooks[e] = {
        get: function (t, n, i) {
          if (n) {
            if (!Kt.test(C.css(t, "display")) || t.getClientRects().length && t.getBoundingClientRect().width) {
              return ee(t, e, i);
            } else {
              return Ut(t, Jt, function () {
                return ee(t, e, i);
              });
            }
          }
        },
        set: function (t, n, i) {
          var r;
          var o = Bt(t);
          var s = !v.scrollboxSize() && o.position === "absolute";
          var a = (s || i) && C.css(t, "boxSizing", false, o) === "border-box";
          var c = i ? te(t, e, i, a, o) : 0;
          if (a && s) {
            c -= Math.ceil(t["offset" + e[0].toUpperCase() + e.slice(1)] - parseFloat(o[e]) - te(t, e, "border", false, o) - 0.5);
          }
          if (c && (r = it.exec(n)) && (r[3] || "px") !== "px") {
            t.style[e] = n;
            n = C.css(t, e);
          }
          return Zt(0, n, c);
        }
      };
    });
    C.cssHooks.marginLeft = zt(v.reliableMarginLeft, function (t, e) {
      if (e) {
        return (parseFloat(qt(t, "marginLeft")) || t.getBoundingClientRect().left - Ut(t, {
          marginLeft: 0
        }, function () {
          return t.getBoundingClientRect().left;
        })) + "px";
      }
    });
    C.each({
      margin: "",
      padding: "",
      border: "Width"
    }, function (t, e) {
      C.cssHooks[t + e] = {
        expand: function (n) {
          for (var i = 0, r = {}, o = typeof n == "string" ? n.split(" ") : [n]; i < 4; i++) {
            r[t + rt[i] + e] = o[i] || o[i - 2] || o[0];
          }
          return r;
        }
      };
      if (t !== "margin") {
        C.cssHooks[t + e].set = Zt;
      }
    });
    C.fn.extend({
      css: function (t, e) {
        return z(this, function (t, e, n) {
          var i;
          var r;
          var o = {};
          var s = 0;
          if (Array.isArray(e)) {
            i = Bt(t);
            r = e.length;
            for (; s < r; s++) {
              o[e[s]] = C.css(t, e[s], false, i);
            }
            return o;
          }
          if (n !== undefined) {
            return C.style(t, e, n);
          } else {
            return C.css(t, e);
          }
        }, t, e, arguments.length > 1);
      }
    });
    C.Tween = ne;
    ne.prototype = {
      constructor: ne,
      init: function (t, e, n, i, r, o) {
        this.elem = t;
        this.prop = n;
        this.easing = r || C.easing._default;
        this.options = e;
        this.start = this.now = this.cur();
        this.end = i;
        this.unit = o || (C.cssNumber[n] ? "" : "px");
      },
      cur: function () {
        var t = ne.propHooks[this.prop];
        if (t && t.get) {
          return t.get(this);
        } else {
          return ne.propHooks._default.get(this);
        }
      },
      run: function (t) {
        var e;
        var n = ne.propHooks[this.prop];
        if (this.options.duration) {
          this.pos = e = C.easing[this.easing](t, this.options.duration * t, 0, 1, this.options.duration);
        } else {
          this.pos = e = t;
        }
        this.now = (this.end - this.start) * e + this.start;
        if (this.options.step) {
          this.options.step.call(this.elem, this.now, this);
        }
        if (n && n.set) {
          n.set(this);
        } else {
          ne.propHooks._default.set(this);
        }
        return this;
      }
    };
    ne.prototype.init.prototype = ne.prototype;
    ne.propHooks = {
      _default: {
        get: function (t) {
          var e;
          if (t.elem.nodeType !== 1 || t.elem[t.prop] != null && t.elem.style[t.prop] == null) {
            return t.elem[t.prop];
          } else if ((e = C.css(t.elem, t.prop, "")) && e !== "auto") {
            return e;
          } else {
            return 0;
          }
        },
        set: function (t) {
          if (C.fx.step[t.prop]) {
            C.fx.step[t.prop](t);
          } else if (t.elem.nodeType !== 1 || !C.cssHooks[t.prop] && t.elem.style[Gt(t.prop)] == null) {
            t.elem[t.prop] = t.now;
          } else {
            C.style(t.elem, t.prop, t.now + t.unit);
          }
        }
      }
    };
    ne.propHooks.scrollTop = ne.propHooks.scrollLeft = {
      set: function (t) {
        if (t.elem.nodeType && t.elem.parentNode) {
          t.elem[t.prop] = t.now;
        }
      }
    };
    C.easing = {
      linear: function (t) {
        return t;
      },
      swing: function (t) {
        return 0.5 - Math.cos(t * Math.PI) / 2;
      },
      _default: "swing"
    };
    (C.fx = ne.prototype.init).step = {};
    var ie;
    var re;
    var oe = /^(?:toggle|show|hide)$/;
    var se = /queueHooks$/;
    function ae() {
      if (re) {
        if (y.hidden === false && n.requestAnimationFrame) {
          n.requestAnimationFrame(ae);
        } else {
          n.setTimeout(ae, C.fx.interval);
        }
        C.fx.tick();
      }
    }
    function ce() {
      n.setTimeout(function () {
        ie = undefined;
      });
      return ie = Date.now();
    }
    function ue(t, e) {
      var n;
      var i = 0;
      var r = {
        height: t
      };
      for (e = e ? 1 : 0; i < 4; i += 2 - e) {
        r["margin" + (n = rt[i])] = r["padding" + n] = t;
      }
      if (e) {
        r.opacity = r.width = t;
      }
      return r;
    }
    function le(t, e, n) {
      var i;
      var r = (de.tweeners[e] || []).concat(de.tweeners["*"]);
      for (var o = 0, s = r.length; o < s; o++) {
        if (i = r[o].call(n, e, t)) {
          return i;
        }
      }
    }
    function de(t, e, n) {
      var i;
      var r;
      var o = 0;
      var s = de.prefilters.length;
      var a = C.Deferred().always(function () {
        delete c.elem;
      });
      function c() {
        if (r) {
          return false;
        }
        var e = ie || ce();
        var n = Math.max(0, u.startTime + u.duration - e);
        var i = 1 - (n / u.duration || 0);
        for (var o = 0, s = u.tweens.length; o < s; o++) {
          u.tweens[o].run(i);
        }
        a.notifyWith(t, [u, i, n]);
        if (i < 1 && s) {
          return n;
        } else {
          if (!s) {
            a.notifyWith(t, [u, 1, 0]);
          }
          a.resolveWith(t, [u]);
          return false;
        }
      }
      var u = a.promise({
        elem: t,
        props: C.extend({}, e),
        opts: C.extend(true, {
          specialEasing: {},
          easing: C.easing._default
        }, n),
        originalProperties: e,
        originalOptions: n,
        startTime: ie || ce(),
        duration: n.duration,
        tweens: [],
        createTween: function (e, n) {
          var i = C.Tween(t, u.opts, e, n, u.opts.specialEasing[e] || u.opts.easing);
          u.tweens.push(i);
          return i;
        },
        stop: function (e) {
          var n = 0;
          var i = e ? u.tweens.length : 0;
          if (r) {
            return this;
          }
          for (r = true; n < i; n++) {
            u.tweens[n].run(1);
          }
          if (e) {
            a.notifyWith(t, [u, 1, 0]);
            a.resolveWith(t, [u, e]);
          } else {
            a.rejectWith(t, [u, e]);
          }
          return this;
        }
      });
      var l = u.props;
      for (!function (t, e) {
        var n;
        var i;
        var r;
        var o;
        var s;
        for (n in t) {
          r = e[i = G(n)];
          o = t[n];
          if (Array.isArray(o)) {
            r = o[1];
            o = t[n] = o[0];
          }
          if (n !== i) {
            t[i] = o;
            delete t[n];
          }
          if ((s = C.cssHooks[i]) && "expand" in s) {
            o = s.expand(o);
            delete t[i];
            for (n in o) {
              if (!(n in t)) {
                t[n] = o[n];
                e[n] = r;
              }
            }
          } else {
            e[i] = r;
          }
        }
      }(l, u.opts.specialEasing); o < s; o++) {
        if (i = de.prefilters[o].call(u, t, l, u.opts)) {
          if (g(i.stop)) {
            C._queueHooks(u.elem, u.opts.queue).stop = i.stop.bind(i);
          }
          return i;
        }
      }
      C.map(l, le, u);
      if (g(u.opts.start)) {
        u.opts.start.call(t, u);
      }
      u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always);
      C.fx.timer(C.extend(c, {
        elem: t,
        anim: u,
        queue: u.opts.queue
      }));
      return u;
    }
    C.Animation = C.extend(de, {
      tweeners: {
        "*": [function (t, e) {
          var n = this.createTween(t, e);
          ut(n.elem, t, it.exec(e), n);
          return n;
        }]
      },
      tweener: function (t, e) {
        if (g(t)) {
          e = t;
          t = ["*"];
        } else {
          t = t.match(L);
        }
        var n;
        for (var i = 0, r = t.length; i < r; i++) {
          n = t[i];
          de.tweeners[n] = de.tweeners[n] || [];
          de.tweeners[n].unshift(e);
        }
      },
      prefilters: [function (t, e, n) {
        var i;
        var r;
        var o;
        var s;
        var a;
        var c;
        var u;
        var l;
        var d = "width" in e || "height" in e;
        var p = this;
        var h = {};
        var f = t.style;
        var m = t.nodeType && ct(t);
        var v = J.get(t, "fxshow");
        if (!n.queue) {
          if ((s = C._queueHooks(t, "fx")).unqueued == null) {
            s.unqueued = 0;
            a = s.empty.fire;
            s.empty.fire = function () {
              if (!s.unqueued) {
                a();
              }
            };
          }
          s.unqueued++;
          p.always(function () {
            p.always(function () {
              s.unqueued--;
              if (!C.queue(t, "fx").length) {
                s.empty.fire();
              }
            });
          });
        }
        for (i in e) {
          r = e[i];
          if (oe.test(r)) {
            delete e[i];
            o = o || r === "toggle";
            if (r === (m ? "hide" : "show")) {
              if (r !== "show" || !v || v[i] === undefined) {
                continue;
              }
              m = true;
            }
            h[i] = v && v[i] || C.style(t, i);
          }
        }
        if ((c = !C.isEmptyObject(e)) || !C.isEmptyObject(h)) {
          if (d && t.nodeType === 1) {
            n.overflow = [f.overflow, f.overflowX, f.overflowY];
            if ((u = v && v.display) == null) {
              u = J.get(t, "display");
            }
            if ((l = C.css(t, "display")) === "none") {
              if (u) {
                l = u;
              } else {
                pt([t], true);
                u = t.style.display || u;
                l = C.css(t, "display");
                pt([t]);
              }
            }
            if ((l === "inline" || l === "inline-block" && u != null) && C.css(t, "float") === "none") {
              if (!c) {
                p.done(function () {
                  f.display = u;
                });
                if (u == null) {
                  l = f.display;
                  u = l === "none" ? "" : l;
                }
              }
              f.display = "inline-block";
            }
          }
          if (n.overflow) {
            f.overflow = "hidden";
            p.always(function () {
              f.overflow = n.overflow[0];
              f.overflowX = n.overflow[1];
              f.overflowY = n.overflow[2];
            });
          }
          c = false;
          for (i in h) {
            if (!c) {
              if (v) {
                if ("hidden" in v) {
                  m = v.hidden;
                }
              } else {
                v = J.access(t, "fxshow", {
                  display: u
                });
              }
              if (o) {
                v.hidden = !m;
              }
              if (m) {
                pt([t], true);
              }
              p.done(function () {
                if (!m) {
                  pt([t]);
                }
                J.remove(t, "fxshow");
                for (i in h) {
                  C.style(t, i, h[i]);
                }
              });
            }
            c = le(m ? v[i] : 0, i, p);
            if (!(i in v)) {
              v[i] = c.start;
              if (m) {
                c.end = c.start;
                c.start = 0;
              }
            }
          }
        }
      }],
      prefilter: function (t, e) {
        if (e) {
          de.prefilters.unshift(t);
        } else {
          de.prefilters.push(t);
        }
      }
    });
    C.speed = function (t, e, n) {
      var i = t && typeof t == "object" ? C.extend({}, t) : {
        complete: n || !n && e || g(t) && t,
        duration: t,
        easing: n && e || e && !g(e) && e
      };
      if (C.fx.off) {
        i.duration = 0;
      } else if (typeof i.duration != "number") {
        if (i.duration in C.fx.speeds) {
          i.duration = C.fx.speeds[i.duration];
        } else {
          i.duration = C.fx.speeds._default;
        }
      }
      if (i.queue == null || i.queue === true) {
        i.queue = "fx";
      }
      i.old = i.complete;
      i.complete = function () {
        if (g(i.old)) {
          i.old.call(this);
        }
        if (i.queue) {
          C.dequeue(this, i.queue);
        }
      };
      return i;
    };
    C.fn.extend({
      fadeTo: function (t, e, n, i) {
        return this.filter(ct).css("opacity", 0).show().end().animate({
          opacity: e
        }, t, n, i);
      },
      animate: function (t, e, n, i) {
        var r = C.isEmptyObject(t);
        var o = C.speed(e, n, i);
        function s() {
          var e = de(this, C.extend({}, t), o);
          if (r || J.get(this, "finish")) {
            e.stop(true);
          }
        }
        s.finish = s;
        if (r || o.queue === false) {
          return this.each(s);
        } else {
          return this.queue(o.queue, s);
        }
      },
      stop: function (t, e, n) {
        function i(t) {
          var e = t.stop;
          delete t.stop;
          e(n);
        }
        if (typeof t != "string") {
          n = e;
          e = t;
          t = undefined;
        }
        if (e) {
          this.queue(t || "fx", []);
        }
        return this.each(function () {
          var e = true;
          var r = t != null && t + "queueHooks";
          var o = C.timers;
          var s = J.get(this);
          if (r) {
            if (s[r] && s[r].stop) {
              i(s[r]);
            }
          } else {
            for (r in s) {
              if (s[r] && s[r].stop && se.test(r)) {
                i(s[r]);
              }
            }
          }
          for (r = o.length; r--;) {
            if (o[r].elem === this && (t == null || o[r].queue === t)) {
              o[r].anim.stop(n);
              e = false;
              o.splice(r, 1);
            }
          }
          if (!!e || !n) {
            C.dequeue(this, t);
          }
        });
      },
      finish: function (t) {
        if (t !== false) {
          t = t || "fx";
        }
        return this.each(function () {
          var e;
          var n = J.get(this);
          var i = n[t + "queue"];
          var r = n[t + "queueHooks"];
          var o = C.timers;
          var s = i ? i.length : 0;
          n.finish = true;
          C.queue(this, t, []);
          if (r && r.stop) {
            r.stop.call(this, true);
          }
          e = o.length;
          while (e--) {
            if (o[e].elem === this && o[e].queue === t) {
              o[e].anim.stop(true);
              o.splice(e, 1);
            }
          }
          for (e = 0; e < s; e++) {
            if (i[e] && i[e].finish) {
              i[e].finish.call(this);
            }
          }
          delete n.finish;
        });
      }
    });
    C.each(["toggle", "show", "hide"], function (t, e) {
      var n = C.fn[e];
      C.fn[e] = function (t, i, r) {
        if (t == null || typeof t == "boolean") {
          return n.apply(this, arguments);
        } else {
          return this.animate(ue(e, true), t, i, r);
        }
      };
    });
    C.each({
      slideDown: ue("show"),
      slideUp: ue("hide"),
      slideToggle: ue("toggle"),
      fadeIn: {
        opacity: "show"
      },
      fadeOut: {
        opacity: "hide"
      },
      fadeToggle: {
        opacity: "toggle"
      }
    }, function (t, e) {
      C.fn[t] = function (t, n, i) {
        return this.animate(e, t, n, i);
      };
    });
    C.timers = [];
    C.fx.tick = function () {
      var t;
      var e = 0;
      var n = C.timers;
      for (ie = Date.now(); e < n.length; e++) {
        if (!(t = n[e])() && n[e] === t) {
          n.splice(e--, 1);
        }
      }
      if (!n.length) {
        C.fx.stop();
      }
      ie = undefined;
    };
    C.fx.timer = function (t) {
      C.timers.push(t);
      C.fx.start();
    };
    C.fx.interval = 13;
    C.fx.start = function () {
      if (!re) {
        re = true;
        ae();
      }
    };
    C.fx.stop = function () {
      re = null;
    };
    C.fx.speeds = {
      slow: 600,
      fast: 200,
      _default: 400
    };
    C.fn.delay = function (t, e) {
      t = C.fx && C.fx.speeds[t] || t;
      e = e || "fx";
      return this.queue(e, function (e, i) {
        var r = n.setTimeout(e, t);
        i.stop = function () {
          n.clearTimeout(r);
        };
      });
    };
    (function () {
      var t = y.createElement("input");
      var e = y.createElement("select").appendChild(y.createElement("option"));
      t.type = "checkbox";
      v.checkOn = t.value !== "";
      v.optSelected = e.selected;
      (t = y.createElement("input")).value = "t";
      t.type = "radio";
      v.radioValue = t.value === "t";
    })();
    var pe;
    var he = C.expr.attrHandle;
    C.fn.extend({
      attr: function (t, e) {
        return z(this, C.attr, t, e, arguments.length > 1);
      },
      removeAttr: function (t) {
        return this.each(function () {
          C.removeAttr(this, t);
        });
      }
    });
    C.extend({
      attr: function (t, e, n) {
        var i;
        var r;
        var o = t.nodeType;
        if (o !== 3 && o !== 8 && o !== 2) {
          if (t.getAttribute === undefined) {
            return C.prop(t, e, n);
          } else {
            if (o !== 1 || !C.isXMLDoc(t)) {
              r = C.attrHooks[e.toLowerCase()] || (C.expr.match.bool.test(e) ? pe : undefined);
            }
            if (n !== undefined) {
              if (n === null) {
                C.removeAttr(t, e);
                return;
              } else if (r && "set" in r && (i = r.set(t, n, e)) !== undefined) {
                return i;
              } else {
                t.setAttribute(e, n + "");
                return n;
              }
            } else if (r && "get" in r && (i = r.get(t, e)) !== null) {
              return i;
            } else if ((i = C.find.attr(t, e)) == null) {
              return undefined;
            } else {
              return i;
            }
          }
        }
      },
      attrHooks: {
        type: {
          set: function (t, e) {
            if (!v.radioValue && e === "radio" && A(t, "input")) {
              var n = t.value;
              t.setAttribute("type", e);
              if (n) {
                t.value = n;
              }
              return e;
            }
          }
        }
      },
      removeAttr: function (t, e) {
        var n;
        var i = 0;
        var r = e && e.match(L);
        if (r && t.nodeType === 1) {
          while (n = r[i++]) {
            t.removeAttribute(n);
          }
        }
      }
    });
    pe = {
      set: function (t, e, n) {
        if (e === false) {
          C.removeAttr(t, n);
        } else {
          t.setAttribute(n, n);
        }
        return n;
      }
    };
    C.each(C.expr.match.bool.source.match(/\w+/g), function (t, e) {
      var n = he[e] || C.find.attr;
      he[e] = function (t, e, i) {
        var r;
        var o;
        var s = e.toLowerCase();
        if (!i) {
          o = he[s];
          he[s] = r;
          r = n(t, e, i) != null ? s : null;
          he[s] = o;
        }
        return r;
      };
    });
    var fe = /^(?:input|select|textarea|button)$/i;
    var me = /^(?:a|area)$/i;
    function ve(t) {
      return (t.match(L) || []).join(" ");
    }
    function ge(t) {
      return t.getAttribute && t.getAttribute("class") || "";
    }
    function be(t) {
      if (Array.isArray(t)) {
        return t;
      } else {
        return typeof t == "string" && t.match(L) || [];
      }
    }
    C.fn.extend({
      prop: function (t, e) {
        return z(this, C.prop, t, e, arguments.length > 1);
      },
      removeProp: function (t) {
        return this.each(function () {
          delete this[C.propFix[t] || t];
        });
      }
    });
    C.extend({
      prop: function (t, e, n) {
        var i;
        var r;
        var o = t.nodeType;
        if (o !== 3 && o !== 8 && o !== 2) {
          if (o !== 1 || !C.isXMLDoc(t)) {
            e = C.propFix[e] || e;
            r = C.propHooks[e];
          }
          if (n !== undefined) {
            if (r && "set" in r && (i = r.set(t, n, e)) !== undefined) {
              return i;
            } else {
              return t[e] = n;
            }
          } else if (r && "get" in r && (i = r.get(t, e)) !== null) {
            return i;
          } else {
            return t[e];
          }
        }
      },
      propHooks: {
        tabIndex: {
          get: function (t) {
            var e = C.find.attr(t, "tabindex");
            if (e) {
              return parseInt(e, 10);
            } else if (fe.test(t.nodeName) || me.test(t.nodeName) && t.href) {
              return 0;
            } else {
              return -1;
            }
          }
        }
      },
      propFix: {
        for: "htmlFor",
        class: "className"
      }
    });
    if (!v.optSelected) {
      C.propHooks.selected = {
        get: function (t) {
          var e = t.parentNode;
          if (e && e.parentNode) {
            e.parentNode.selectedIndex;
          }
          return null;
        },
        set: function (t) {
          var e = t.parentNode;
          if (e) {
            e.selectedIndex;
            if (e.parentNode) {
              e.parentNode.selectedIndex;
            }
          }
        }
      };
    }
    C.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
      C.propFix[this.toLowerCase()] = this;
    });
    C.fn.extend({
      addClass: function (t) {
        var e;
        var n;
        var i;
        var r;
        var o;
        var s;
        var a;
        var c = 0;
        if (g(t)) {
          return this.each(function (e) {
            C(this).addClass(t.call(this, e, ge(this)));
          });
        }
        if ((e = be(t)).length) {
          while (n = this[c++]) {
            r = ge(n);
            if (i = n.nodeType === 1 && " " + ve(r) + " ") {
              for (s = 0; o = e[s++];) {
                if (i.indexOf(" " + o + " ") < 0) {
                  i += o + " ";
                }
              }
              if (r !== (a = ve(i))) {
                n.setAttribute("class", a);
              }
            }
          }
        }
        return this;
      },
      removeClass: function (t) {
        var e;
        var n;
        var i;
        var r;
        var o;
        var s;
        var a;
        var c = 0;
        if (g(t)) {
          return this.each(function (e) {
            C(this).removeClass(t.call(this, e, ge(this)));
          });
        }
        if (!arguments.length) {
          return this.attr("class", "");
        }
        if ((e = be(t)).length) {
          while (n = this[c++]) {
            r = ge(n);
            if (i = n.nodeType === 1 && " " + ve(r) + " ") {
              for (s = 0; o = e[s++];) {
                while (i.indexOf(" " + o + " ") > -1) {
                  i = i.replace(" " + o + " ", " ");
                }
              }
              if (r !== (a = ve(i))) {
                n.setAttribute("class", a);
              }
            }
          }
        }
        return this;
      },
      toggleClass: function (t, e) {
        var n = typeof t;
        var i = n === "string" || Array.isArray(t);
        if (typeof e == "boolean" && i) {
          if (e) {
            return this.addClass(t);
          } else {
            return this.removeClass(t);
          }
        } else if (g(t)) {
          return this.each(function (n) {
            C(this).toggleClass(t.call(this, n, ge(this), e), e);
          });
        } else {
          return this.each(function () {
            var e;
            var r;
            var o;
            var s;
            if (i) {
              r = 0;
              o = C(this);
              s = be(t);
              while (e = s[r++]) {
                if (o.hasClass(e)) {
                  o.removeClass(e);
                } else {
                  o.addClass(e);
                }
              }
            } else if (t === undefined || n === "boolean") {
              if (e = ge(this)) {
                J.set(this, "__className__", e);
              }
              if (this.setAttribute) {
                this.setAttribute("class", e || t === false ? "" : J.get(this, "__className__") || "");
              }
            }
          });
        }
      },
      hasClass: function (t) {
        var e;
        var n;
        var i = 0;
        for (e = " " + t + " "; n = this[i++];) {
          if (n.nodeType === 1 && (" " + ve(ge(n)) + " ").indexOf(e) > -1) {
            return true;
          }
        }
        return false;
      }
    });
    var ye = /\r/g;
    C.fn.extend({
      val: function (t) {
        var e;
        var n;
        var i;
        var r = this[0];
        if (arguments.length) {
          i = g(t);
          return this.each(function (n) {
            var r;
            if (this.nodeType === 1) {
              if ((r = i ? t.call(this, n, C(this).val()) : t) == null) {
                r = "";
              } else if (typeof r == "number") {
                r += "";
              } else if (Array.isArray(r)) {
                r = C.map(r, function (t) {
                  if (t == null) {
                    return "";
                  } else {
                    return t + "";
                  }
                });
              }
              if (!(e = C.valHooks[this.type] || C.valHooks[this.nodeName.toLowerCase()]) || !("set" in e) || e.set(this, r, "value") === undefined) {
                this.value = r;
              }
            }
          });
        } else if (r) {
          if ((e = C.valHooks[r.type] || C.valHooks[r.nodeName.toLowerCase()]) && "get" in e && (n = e.get(r, "value")) !== undefined) {
            return n;
          } else if (typeof (n = r.value) == "string") {
            return n.replace(ye, "");
          } else if (n == null) {
            return "";
          } else {
            return n;
          }
        } else {
          return undefined;
        }
      }
    });
    C.extend({
      valHooks: {
        option: {
          get: function (t) {
            var e = C.find.attr(t, "value");
            return e ?? ve(C.text(t));
          }
        },
        select: {
          get: function (t) {
            var e;
            var n;
            var i;
            var r = t.options;
            var o = t.selectedIndex;
            var s = t.type === "select-one";
            var a = s ? null : [];
            var c = s ? o + 1 : r.length;
            for (i = o < 0 ? c : s ? o : 0; i < c; i++) {
              if (((n = r[i]).selected || i === o) && !n.disabled && (!n.parentNode.disabled || !A(n.parentNode, "optgroup"))) {
                e = C(n).val();
                if (s) {
                  return e;
                }
                a.push(e);
              }
            }
            return a;
          },
          set: function (t, e) {
            var n;
            var i;
            var r = t.options;
            var o = C.makeArray(e);
            for (var s = r.length; s--;) {
              if ((i = r[s]).selected = C.inArray(C.valHooks.option.get(i), o) > -1) {
                n = true;
              }
            }
            if (!n) {
              t.selectedIndex = -1;
            }
            return o;
          }
        }
      }
    });
    C.each(["radio", "checkbox"], function () {
      C.valHooks[this] = {
        set: function (t, e) {
          if (Array.isArray(e)) {
            return t.checked = C.inArray(C(t).val(), e) > -1;
          }
        }
      };
      if (!v.checkOn) {
        C.valHooks[this].get = function (t) {
          if (t.getAttribute("value") === null) {
            return "on";
          } else {
            return t.value;
          }
        };
      }
    });
    v.focusin = "onfocusin" in n;
    var we = /^(?:focusinfocus|focusoutblur)$/;
    function xe(t) {
      t.stopPropagation();
    }
    C.extend(C.event, {
      trigger: function (t, e, i, r) {
        var o;
        var s;
        var a;
        var c;
        var u;
        var l;
        var d;
        var p;
        var f = [i || y];
        var m = h.call(t, "type") ? t.type : t;
        var v = h.call(t, "namespace") ? t.namespace.split(".") : [];
        s = p = a = i = i || y;
        if (i.nodeType !== 3 && i.nodeType !== 8 && !we.test(m + C.event.triggered) && (m.indexOf(".") > -1 && (v = m.split("."), m = v.shift(), v.sort()), u = m.indexOf(":") < 0 && "on" + m, (t = t[C.expando] ? t : new C.Event(m, typeof t == "object" && t)).isTrigger = r ? 2 : 3, t.namespace = v.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + v.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = undefined, t.target ||= i, e = e == null ? [t] : C.makeArray(e, [t]), d = C.event.special[m] || {}, r || !d.trigger || d.trigger.apply(i, e) !== false)) {
          if (!r && !d.noBubble && !b(i)) {
            c = d.delegateType || m;
            if (!we.test(c + m)) {
              s = s.parentNode;
            }
            for (; s; s = s.parentNode) {
              f.push(s);
              a = s;
            }
            if (a === (i.ownerDocument || y)) {
              f.push(a.defaultView || a.parentWindow || n);
            }
          }
          for (o = 0; (s = f[o++]) && !t.isPropagationStopped();) {
            p = s;
            t.type = o > 1 ? c : d.bindType || m;
            if (l = (J.get(s, "events") || Object.create(null))[t.type] && J.get(s, "handle")) {
              l.apply(s, e);
            }
            if ((l = u && s[u]) && l.apply && K(s)) {
              t.result = l.apply(s, e);
              if (t.result === false) {
                t.preventDefault();
              }
            }
          }
          t.type = m;
          if (!r && !t.isDefaultPrevented() && (!d._default || d._default.apply(f.pop(), e) === false) && !!K(i)) {
            if (u && g(i[m]) && !b(i)) {
              if (a = i[u]) {
                i[u] = null;
              }
              C.event.triggered = m;
              if (t.isPropagationStopped()) {
                p.addEventListener(m, xe);
              }
              i[m]();
              if (t.isPropagationStopped()) {
                p.removeEventListener(m, xe);
              }
              C.event.triggered = undefined;
              if (a) {
                i[u] = a;
              }
            }
          }
          return t.result;
        }
      },
      simulate: function (t, e, n) {
        var i = C.extend(new C.Event(), n, {
          type: t,
          isSimulated: true
        });
        C.event.trigger(i, null, e);
      }
    });
    C.fn.extend({
      trigger: function (t, e) {
        return this.each(function () {
          C.event.trigger(t, e, this);
        });
      },
      triggerHandler: function (t, e) {
        var n = this[0];
        if (n) {
          return C.event.trigger(t, e, n, true);
        }
      }
    });
    if (!v.focusin) {
      C.each({
        focus: "focusin",
        blur: "focusout"
      }, function (t, e) {
        function n(t) {
          C.event.simulate(e, t.target, C.event.fix(t));
        }
        C.event.special[e] = {
          setup: function () {
            var i = this.ownerDocument || this.document || this;
            var r = J.access(i, e);
            if (!r) {
              i.addEventListener(t, n, true);
            }
            J.access(i, e, (r || 0) + 1);
          },
          teardown: function () {
            var i = this.ownerDocument || this.document || this;
            var r = J.access(i, e) - 1;
            if (r) {
              J.access(i, e, r);
            } else {
              i.removeEventListener(t, n, true);
              J.remove(i, e);
            }
          }
        };
      });
    }
    var Ne = n.location;
    var Ce = {
      guid: Date.now()
    };
    var Te = /\?/;
    C.parseXML = function (t) {
      var e;
      var i;
      if (!t || typeof t != "string") {
        return null;
      }
      try {
        e = new n.DOMParser().parseFromString(t, "text/xml");
      } catch (t) {}
      i = e && e.getElementsByTagName("parsererror")[0];
      if (!e || !!i) {
        C.error("Invalid XML: " + (i ? C.map(i.childNodes, function (t) {
          return t.textContent;
        }).join("\n") : t));
      }
      return e;
    };
    var Se = /\[\]$/;
    var Oe = /\r?\n/g;
    var ke = /^(?:submit|button|image|reset|file)$/i;
    var je = /^(?:input|select|textarea|keygen)/i;
    function Ae(t, e, n, i) {
      var r;
      if (Array.isArray(e)) {
        C.each(e, function (e, r) {
          if (n || Se.test(t)) {
            i(t, r);
          } else {
            Ae(t + "[" + (typeof r == "object" && r != null ? e : "") + "]", r, n, i);
          }
        });
      } else if (n || N(e) !== "object") {
        i(t, e);
      } else {
        for (r in e) {
          Ae(t + "[" + r + "]", e[r], n, i);
        }
      }
    }
    C.param = function (t, e) {
      var n;
      var i = [];
      function r(t, e) {
        var n = g(e) ? e() : e;
        i[i.length] = encodeURIComponent(t) + "=" + encodeURIComponent(n == null ? "" : n);
      }
      if (t == null) {
        return "";
      }
      if (Array.isArray(t) || t.jquery && !C.isPlainObject(t)) {
        C.each(t, function () {
          r(this.name, this.value);
        });
      } else {
        for (n in t) {
          Ae(n, t[n], e, r);
        }
      }
      return i.join("&");
    };
    C.fn.extend({
      serialize: function () {
        return C.param(this.serializeArray());
      },
      serializeArray: function () {
        return this.map(function () {
          var t = C.prop(this, "elements");
          if (t) {
            return C.makeArray(t);
          } else {
            return this;
          }
        }).filter(function () {
          var t = this.type;
          return this.name && !C(this).is(":disabled") && je.test(this.nodeName) && !ke.test(t) && (this.checked || !mt.test(t));
        }).map(function (t, e) {
          var n = C(this).val();
          if (n == null) {
            return null;
          } else if (Array.isArray(n)) {
            return C.map(n, function (t) {
              return {
                name: e.name,
                value: t.replace(Oe, "\r\n")
              };
            });
          } else {
            return {
              name: e.name,
              value: n.replace(Oe, "\r\n")
            };
          }
        }).get();
      }
    });
    var Ee = /%20/g;
    var Pe = /#.*$/;
    var _e = /([?&])_=[^&]*/;
    var De = /^(.*?):[ \t]*([^\r\n]*)$/gm;
    var $e = /^(?:GET|HEAD)$/;
    var Ie = /^\/\//;
    var Me = {};
    var Le = {};
    var Re = `*/*`;
    var He = y.createElement("a");
    function Be(t) {
      return function (e, n) {
        if (typeof e != "string") {
          n = e;
          e = "*";
        }
        var i;
        var r = 0;
        var o = e.toLowerCase().match(L) || [];
        if (g(n)) {
          while (i = o[r++]) {
            if (i[0] === "+") {
              i = i.slice(1) || "*";
              (t[i] = t[i] || []).unshift(n);
            } else {
              (t[i] = t[i] || []).push(n);
            }
          }
        }
      };
    }
    function Ue(t, e, n, i) {
      var r = {};
      var o = t === Le;
      function s(a) {
        var c;
        r[a] = true;
        C.each(t[a] || [], function (t, a) {
          var u = a(e, n, i);
          if (typeof u != "string" || o || r[u]) {
            if (o) {
              return !(c = u);
            } else {
              return undefined;
            }
          } else {
            e.dataTypes.unshift(u);
            s(u);
            return false;
          }
        });
        return c;
      }
      return s(e.dataTypes[0]) || !r["*"] && s("*");
    }
    function Fe(t, e) {
      var n;
      var i;
      var r = C.ajaxSettings.flatOptions || {};
      for (n in e) {
        if (e[n] !== undefined) {
          (r[n] ? t : i ||= {})[n] = e[n];
        }
      }
      if (i) {
        C.extend(true, t, i);
      }
      return t;
    }
    He.href = Ne.href;
    C.extend({
      active: 0,
      lastModified: {},
      etag: {},
      ajaxSettings: {
        url: Ne.href,
        type: "GET",
        isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Ne.protocol),
        global: true,
        processData: true,
        async: true,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        accepts: {
          "*": Re,
          text: "text/plain",
          html: "text/html",
          xml: "application/xml, text/xml",
          json: "application/json, text/javascript"
        },
        contents: {
          xml: /\bxml\b/,
          html: /\bhtml/,
          json: /\bjson\b/
        },
        responseFields: {
          xml: "responseXML",
          text: "responseText",
          json: "responseJSON"
        },
        converters: {
          "* text": String,
          "text html": true,
          "text json": JSON.parse,
          "text xml": C.parseXML
        },
        flatOptions: {
          url: true,
          context: true
        }
      },
      ajaxSetup: function (t, e) {
        if (e) {
          return Fe(Fe(t, C.ajaxSettings), e);
        } else {
          return Fe(C.ajaxSettings, t);
        }
      },
      ajaxPrefilter: Be(Me),
      ajaxTransport: Be(Le),
      ajax: function (t, e) {
        if (typeof t == "object") {
          e = t;
          t = undefined;
        }
        var i;
        var r;
        var o;
        var s;
        var a;
        var c;
        var u;
        var l;
        var d;
        var p;
        var h = C.ajaxSetup({}, e = e || {});
        var f = h.context || h;
        var m = h.context && (f.nodeType || f.jquery) ? C(f) : C.event;
        var v = C.Deferred();
        var g = C.Callbacks("once memory");
        var b = h.statusCode || {};
        var w = {};
        var x = {};
        var N = "canceled";
        var T = {
          readyState: 0,
          getResponseHeader: function (t) {
            var e;
            if (u) {
              if (!s) {
                for (s = {}; e = De.exec(o);) {
                  s[e[1].toLowerCase() + " "] = (s[e[1].toLowerCase() + " "] || []).concat(e[2]);
                }
              }
              e = s[t.toLowerCase() + " "];
            }
            if (e == null) {
              return null;
            } else {
              return e.join(", ");
            }
          },
          getAllResponseHeaders: function () {
            if (u) {
              return o;
            } else {
              return null;
            }
          },
          setRequestHeader: function (t, e) {
            if (u == null) {
              t = x[t.toLowerCase()] = x[t.toLowerCase()] || t;
              w[t] = e;
            }
            return this;
          },
          overrideMimeType: function (t) {
            if (u == null) {
              h.mimeType = t;
            }
            return this;
          },
          statusCode: function (t) {
            var e;
            if (t) {
              if (u) {
                T.always(t[T.status]);
              } else {
                for (e in t) {
                  b[e] = [b[e], t[e]];
                }
              }
            }
            return this;
          },
          abort: function (t) {
            var e = t || N;
            if (i) {
              i.abort(e);
            }
            S(0, e);
            return this;
          }
        };
        v.promise(T);
        h.url = ((t || h.url || Ne.href) + "").replace(Ie, Ne.protocol + "//");
        h.type = e.method || e.type || h.method || h.type;
        h.dataTypes = (h.dataType || "*").toLowerCase().match(L) || [""];
        if (h.crossDomain == null) {
          c = y.createElement("a");
          try {
            c.href = h.url;
            c.href = c.href;
            h.crossDomain = He.protocol + "//" + He.host != c.protocol + "//" + c.host;
          } catch (t) {
            h.crossDomain = true;
          }
        }
        if (h.data && h.processData && typeof h.data != "string") {
          h.data = C.param(h.data, h.traditional);
        }
        Ue(Me, h, e, T);
        if (u) {
          return T;
        }
        if ((l = C.event && h.global) && C.active++ == 0) {
          C.event.trigger("ajaxStart");
        }
        h.type = h.type.toUpperCase();
        h.hasContent = !$e.test(h.type);
        r = h.url.replace(Pe, "");
        if (h.hasContent) {
          if (h.data && h.processData && (h.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
            h.data = h.data.replace(Ee, "+");
          }
        } else {
          p = h.url.slice(r.length);
          if (h.data && (h.processData || typeof h.data == "string")) {
            r += (Te.test(r) ? "&" : "?") + h.data;
            delete h.data;
          }
          if (h.cache === false) {
            r = r.replace(_e, "$1");
            p = (Te.test(r) ? "&" : "?") + "_=" + Ce.guid++ + p;
          }
          h.url = r + p;
        }
        if (h.ifModified) {
          if (C.lastModified[r]) {
            T.setRequestHeader("If-Modified-Since", C.lastModified[r]);
          }
          if (C.etag[r]) {
            T.setRequestHeader("If-None-Match", C.etag[r]);
          }
        }
        if (h.data && h.hasContent && h.contentType !== false || e.contentType) {
          T.setRequestHeader("Content-Type", h.contentType);
        }
        T.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + (h.dataTypes[0] !== "*" ? ", " + Re + "; q=0.01" : "") : h.accepts["*"]);
        for (d in h.headers) {
          T.setRequestHeader(d, h.headers[d]);
        }
        if (h.beforeSend && (h.beforeSend.call(f, T, h) === false || u)) {
          return T.abort();
        }
        N = "abort";
        g.add(h.complete);
        T.done(h.success);
        T.fail(h.error);
        if (i = Ue(Le, h, e, T)) {
          T.readyState = 1;
          if (l) {
            m.trigger("ajaxSend", [T, h]);
          }
          if (u) {
            return T;
          }
          if (h.async && h.timeout > 0) {
            a = n.setTimeout(function () {
              T.abort("timeout");
            }, h.timeout);
          }
          try {
            u = false;
            i.send(w, S);
          } catch (t) {
            if (u) {
              throw t;
            }
            S(-1, t);
          }
        } else {
          S(-1, "No Transport");
        }
        function S(t, e, s, c) {
          var d;
          var p;
          var y;
          var w;
          var x;
          var N = e;
          if (!u) {
            u = true;
            if (a) {
              n.clearTimeout(a);
            }
            i = undefined;
            o = c || "";
            T.readyState = t > 0 ? 4 : 0;
            d = t >= 200 && t < 300 || t === 304;
            if (s) {
              w = function (t, e, n) {
                var i;
                var r;
                var o;
                var s;
                var a = t.contents;
                for (var c = t.dataTypes; c[0] === "*";) {
                  c.shift();
                  if (i === undefined) {
                    i = t.mimeType || e.getResponseHeader("Content-Type");
                  }
                }
                if (i) {
                  for (r in a) {
                    if (a[r] && a[r].test(i)) {
                      c.unshift(r);
                      break;
                    }
                  }
                }
                if (c[0] in n) {
                  o = c[0];
                } else {
                  for (r in n) {
                    if (!c[0] || t.converters[r + " " + c[0]]) {
                      o = r;
                      break;
                    }
                    s ||= r;
                  }
                  o = o || s;
                }
                if (o) {
                  if (o !== c[0]) {
                    c.unshift(o);
                  }
                  return n[o];
                }
              }(h, T, s);
            }
            if (!d && C.inArray("script", h.dataTypes) > -1 && C.inArray("json", h.dataTypes) < 0) {
              h.converters["text script"] = function () {};
            }
            w = function (t, e, n, i) {
              var r;
              var o;
              var s;
              var a;
              var c;
              var u = {};
              var l = t.dataTypes.slice();
              if (l[1]) {
                for (s in t.converters) {
                  u[s.toLowerCase()] = t.converters[s];
                }
              }
              for (o = l.shift(); o;) {
                if (t.responseFields[o]) {
                  n[t.responseFields[o]] = e;
                }
                if (!c && i && t.dataFilter) {
                  e = t.dataFilter(e, t.dataType);
                }
                c = o;
                if (o = l.shift()) {
                  if (o === "*") {
                    o = c;
                  } else if (c !== "*" && c !== o) {
                    if (!(s = u[c + " " + o] || u["* " + o])) {
                      for (r in u) {
                        if ((a = r.split(" "))[1] === o && (s = u[c + " " + a[0]] || u["* " + a[0]])) {
                          if (s === true) {
                            s = u[r];
                          } else if (u[r] !== true) {
                            o = a[0];
                            l.unshift(a[1]);
                          }
                          break;
                        }
                      }
                    }
                    if (s !== true) {
                      if (s && t.throws) {
                        e = s(e);
                      } else {
                        try {
                          e = s(e);
                        } catch (t) {
                          return {
                            state: "parsererror",
                            error: s ? t : "No conversion from " + c + " to " + o
                          };
                        }
                      }
                    }
                  }
                }
              }
              return {
                state: "success",
                data: e
              };
            }(h, w, T, d);
            if (d) {
              if (h.ifModified) {
                if (x = T.getResponseHeader("Last-Modified")) {
                  C.lastModified[r] = x;
                }
                if (x = T.getResponseHeader("etag")) {
                  C.etag[r] = x;
                }
              }
              if (t === 204 || h.type === "HEAD") {
                N = "nocontent";
              } else if (t === 304) {
                N = "notmodified";
              } else {
                N = w.state;
                p = w.data;
                d = !(y = w.error);
              }
            } else {
              y = N;
              if (!!t || !N) {
                N = "error";
                if (t < 0) {
                  t = 0;
                }
              }
            }
            T.status = t;
            T.statusText = (e || N) + "";
            if (d) {
              v.resolveWith(f, [p, N, T]);
            } else {
              v.rejectWith(f, [T, N, y]);
            }
            T.statusCode(b);
            b = undefined;
            if (l) {
              m.trigger(d ? "ajaxSuccess" : "ajaxError", [T, h, d ? p : y]);
            }
            g.fireWith(f, [T, N]);
            if (l) {
              m.trigger("ajaxComplete", [T, h]);
              if (! --C.active) {
                C.event.trigger("ajaxStop");
              }
            }
          }
        }
        return T;
      },
      getJSON: function (t, e, n) {
        return C.get(t, e, n, "json");
      },
      getScript: function (t, e) {
        return C.get(t, undefined, e, "script");
      }
    });
    C.each(["get", "post"], function (t, e) {
      C[e] = function (t, n, i, r) {
        if (g(n)) {
          r = r || i;
          i = n;
          n = undefined;
        }
        return C.ajax(C.extend({
          url: t,
          type: e,
          dataType: r,
          data: n,
          success: i
        }, C.isPlainObject(t) && t));
      };
    });
    C.ajaxPrefilter(function (t) {
      var e;
      for (e in t.headers) {
        if (e.toLowerCase() === "content-type") {
          t.contentType = t.headers[e] || "";
        }
      }
    });
    C._evalUrl = function (t, e, n) {
      return C.ajax({
        url: t,
        type: "GET",
        dataType: "script",
        cache: true,
        async: false,
        global: false,
        converters: {
          "text script": function () {}
        },
        dataFilter: function (t) {
          C.globalEval(t, e, n);
        }
      });
    };
    C.fn.extend({
      wrapAll: function (t) {
        var e;
        if (this[0]) {
          if (g(t)) {
            t = t.call(this[0]);
          }
          e = C(t, this[0].ownerDocument).eq(0).clone(true);
          if (this[0].parentNode) {
            e.insertBefore(this[0]);
          }
          e.map(function () {
            for (var t = this; t.firstElementChild;) {
              t = t.firstElementChild;
            }
            return t;
          }).append(this);
        }
        return this;
      },
      wrapInner: function (t) {
        if (g(t)) {
          return this.each(function (e) {
            C(this).wrapInner(t.call(this, e));
          });
        } else {
          return this.each(function () {
            var e = C(this);
            var n = e.contents();
            if (n.length) {
              n.wrapAll(t);
            } else {
              e.append(t);
            }
          });
        }
      },
      wrap: function (t) {
        var e = g(t);
        return this.each(function (n) {
          C(this).wrapAll(e ? t.call(this, n) : t);
        });
      },
      unwrap: function (t) {
        this.parent(t).not("body").each(function () {
          C(this).replaceWith(this.childNodes);
        });
        return this;
      }
    });
    C.expr.pseudos.hidden = function (t) {
      return !C.expr.pseudos.visible(t);
    };
    C.expr.pseudos.visible = function (t) {
      return !!t.offsetWidth || !!t.offsetHeight || !!t.getClientRects().length;
    };
    C.ajaxSettings.xhr = function () {
      try {
        return new n.XMLHttpRequest();
      } catch (t) {}
    };
    var qe = {
      0: 200,
      1223: 204
    };
    var ze = C.ajaxSettings.xhr();
    v.cors = !!ze && "withCredentials" in ze;
    v.ajax = ze = !!ze;
    C.ajaxTransport(function (t) {
      var e;
      var i;
      if (v.cors || ze && !t.crossDomain) {
        return {
          send: function (r, o) {
            var s;
            var a = t.xhr();
            a.open(t.type, t.url, t.async, t.username, t.password);
            if (t.xhrFields) {
              for (s in t.xhrFields) {
                a[s] = t.xhrFields[s];
              }
            }
            if (t.mimeType && a.overrideMimeType) {
              a.overrideMimeType(t.mimeType);
            }
            if (!t.crossDomain && !r["X-Requested-With"]) {
              r["X-Requested-With"] = "XMLHttpRequest";
            }
            for (s in r) {
              a.setRequestHeader(s, r[s]);
            }
            e = function (t) {
              return function () {
                if (e) {
                  e = i = a.onload = a.onerror = a.onabort = a.ontimeout = a.onreadystatechange = null;
                  if (t === "abort") {
                    a.abort();
                  } else if (t === "error") {
                    if (typeof a.status != "number") {
                      o(0, "error");
                    } else {
                      o(a.status, a.statusText);
                    }
                  } else {
                    o(qe[a.status] || a.status, a.statusText, (a.responseType || "text") !== "text" || typeof a.responseText != "string" ? {
                      binary: a.response
                    } : {
                      text: a.responseText
                    }, a.getAllResponseHeaders());
                  }
                }
              };
            };
            a.onload = e();
            i = a.onerror = a.ontimeout = e("error");
            if (a.onabort !== undefined) {
              a.onabort = i;
            } else {
              a.onreadystatechange = function () {
                if (a.readyState === 4) {
                  n.setTimeout(function () {
                    if (e) {
                      i();
                    }
                  });
                }
              };
            }
            e = e("abort");
            try {
              a.send(t.hasContent && t.data || null);
            } catch (t) {
              if (e) {
                throw t;
              }
            }
          },
          abort: function () {
            if (e) {
              e();
            }
          }
        };
      }
    });
    C.ajaxPrefilter(function (t) {
      if (t.crossDomain) {
        t.contents.script = false;
      }
    });
    C.ajaxSetup({
      accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
      },
      contents: {
        script: /\b(?:java|ecma)script\b/
      },
      converters: {
        "text script": function (t) {
          C.globalEval(t);
          return t;
        }
      }
    });
    C.ajaxPrefilter("script", function (t) {
      if (t.cache === undefined) {
        t.cache = false;
      }
      if (t.crossDomain) {
        t.type = "GET";
      }
    });
    C.ajaxTransport("script", function (t) {
      var e;
      var n;
      if (t.crossDomain || t.scriptAttrs) {
        return {
          send: function (i, r) {
            e = C("<script>").attr(t.scriptAttrs || {}).prop({
              charset: t.scriptCharset,
              src: t.url
            }).on("load error", n = function (t) {
              e.remove();
              n = null;
              if (t) {
                r(t.type === "error" ? 404 : 200, t.type);
              }
            });
            y.head.appendChild(e[0]);
          },
          abort: function () {
            if (n) {
              n();
            }
          }
        };
      }
    });
    var We;
    var Ve = [];
    var Ye = /(=)\?(?=&|$)|\?\?/;
    C.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function () {
        var t = Ve.pop() || C.expando + "_" + Ce.guid++;
        this[t] = true;
        return t;
      }
    });
    C.ajaxPrefilter("json jsonp", function (t, e, i) {
      var r;
      var o;
      var s;
      var a = t.jsonp !== false && (Ye.test(t.url) ? "url" : typeof t.data == "string" && (t.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && Ye.test(t.data) && "data");
      if (a || t.dataTypes[0] === "jsonp") {
        r = t.jsonpCallback = g(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback;
        if (a) {
          t[a] = t[a].replace(Ye, "$1" + r);
        } else if (t.jsonp !== false) {
          t.url += (Te.test(t.url) ? "&" : "?") + t.jsonp + "=" + r;
        }
        t.converters["script json"] = function () {
          if (!s) {
            C.error(r + " was not called");
          }
          return s[0];
        };
        t.dataTypes[0] = "json";
        o = n[r];
        n[r] = function () {
          s = arguments;
        };
        i.always(function () {
          if (o === undefined) {
            C(n).removeProp(r);
          } else {
            n[r] = o;
          }
          if (t[r]) {
            t.jsonpCallback = e.jsonpCallback;
            Ve.push(r);
          }
          if (s && g(o)) {
            o(s[0]);
          }
          s = o = undefined;
        });
        return "script";
      }
    });
    (We = y.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>";
    v.createHTMLDocument = We.childNodes.length === 2;
    C.parseHTML = function (t, e, n) {
      if (typeof t != "string") {
        return [];
      } else {
        if (typeof e == "boolean") {
          n = e;
          e = false;
        }
        if (!e) {
          if (v.createHTMLDocument) {
            (i = (e = y.implementation.createHTMLDocument("")).createElement("base")).href = y.location.href;
            e.head.appendChild(i);
          } else {
            e = y;
          }
        }
        o = !n && [];
        if (r = E.exec(t)) {
          return [e.createElement(r[1])];
        } else {
          r = Nt([t], e, o);
          if (o && o.length) {
            C(o).remove();
          }
          return C.merge([], r.childNodes);
        }
      }
      var i;
      var r;
      var o;
    };
    C.fn.load = function (t, e, n) {
      var i;
      var r;
      var o;
      var s = this;
      var a = t.indexOf(" ");
      if (a > -1) {
        i = ve(t.slice(a));
        t = t.slice(0, a);
      }
      if (g(e)) {
        n = e;
        e = undefined;
      } else if (e && typeof e == "object") {
        r = "POST";
      }
      if (s.length > 0) {
        C.ajax({
          url: t,
          type: r || "GET",
          dataType: "html",
          data: e
        }).done(function (t) {
          o = arguments;
          s.html(i ? C("<div>").append(C.parseHTML(t)).find(i) : t);
        }).always(n && function (t, e) {
          s.each(function () {
            n.apply(this, o || [t.responseText, e, t]);
          });
        });
      }
      return this;
    };
    C.expr.pseudos.animated = function (t) {
      return C.grep(C.timers, function (e) {
        return t === e.elem;
      }).length;
    };
    C.offset = {
      setOffset: function (t, e, n) {
        var i;
        var r;
        var o;
        var s;
        var a;
        var c;
        var u = C.css(t, "position");
        var l = C(t);
        var d = {};
        if (u === "static") {
          t.style.position = "relative";
        }
        a = l.offset();
        o = C.css(t, "top");
        c = C.css(t, "left");
        if ((u === "absolute" || u === "fixed") && (o + c).indexOf("auto") > -1) {
          s = (i = l.position()).top;
          r = i.left;
        } else {
          s = parseFloat(o) || 0;
          r = parseFloat(c) || 0;
        }
        if (g(e)) {
          e = e.call(t, n, C.extend({}, a));
        }
        if (e.top != null) {
          d.top = e.top - a.top + s;
        }
        if (e.left != null) {
          d.left = e.left - a.left + r;
        }
        if ("using" in e) {
          e.using.call(t, d);
        } else {
          l.css(d);
        }
      }
    };
    C.fn.extend({
      offset: function (t) {
        if (arguments.length) {
          if (t === undefined) {
            return this;
          } else {
            return this.each(function (e) {
              C.offset.setOffset(this, t, e);
            });
          }
        }
        var e;
        var n;
        var i = this[0];
        if (i) {
          if (i.getClientRects().length) {
            e = i.getBoundingClientRect();
            n = i.ownerDocument.defaultView;
            return {
              top: e.top + n.pageYOffset,
              left: e.left + n.pageXOffset
            };
          } else {
            return {
              top: 0,
              left: 0
            };
          }
        } else {
          return undefined;
        }
      },
      position: function () {
        if (this[0]) {
          var t;
          var e;
          var n;
          var i = this[0];
          var r = {
            top: 0,
            left: 0
          };
          if (C.css(i, "position") === "fixed") {
            e = i.getBoundingClientRect();
          } else {
            e = this.offset();
            n = i.ownerDocument;
            t = i.offsetParent || n.documentElement;
            while (t && (t === n.body || t === n.documentElement) && C.css(t, "position") === "static") {
              t = t.parentNode;
            }
            if (t && t !== i && t.nodeType === 1) {
              (r = C(t).offset()).top += C.css(t, "borderTopWidth", true);
              r.left += C.css(t, "borderLeftWidth", true);
            }
          }
          return {
            top: e.top - r.top - C.css(i, "marginTop", true),
            left: e.left - r.left - C.css(i, "marginLeft", true)
          };
        }
      },
      offsetParent: function () {
        return this.map(function () {
          for (var t = this.offsetParent; t && C.css(t, "position") === "static";) {
            t = t.offsetParent;
          }
          return t || ot;
        });
      }
    });
    C.each({
      scrollLeft: "pageXOffset",
      scrollTop: "pageYOffset"
    }, function (t, e) {
      var n = e === "pageYOffset";
      C.fn[t] = function (i) {
        return z(this, function (t, i, r) {
          var o;
          if (b(t)) {
            o = t;
          } else if (t.nodeType === 9) {
            o = t.defaultView;
          }
          if (r === undefined) {
            if (o) {
              return o[e];
            } else {
              return t[i];
            }
          }
          if (o) {
            o.scrollTo(n ? o.pageXOffset : r, n ? r : o.pageYOffset);
          } else {
            t[i] = r;
          }
        }, t, i, arguments.length);
      };
    });
    C.each(["top", "left"], function (t, e) {
      C.cssHooks[e] = zt(v.pixelPosition, function (t, n) {
        if (n) {
          n = qt(t, e);
          if (Ht.test(n)) {
            return C(t).position()[e] + "px";
          } else {
            return n;
          }
        }
      });
    });
    C.each({
      Height: "height",
      Width: "width"
    }, function (t, e) {
      C.each({
        padding: "inner" + t,
        content: e,
        "": "outer" + t
      }, function (n, i) {
        C.fn[i] = function (r, o) {
          var s = arguments.length && (n || typeof r != "boolean");
          var a = n || (r === true || o === true ? "margin" : "border");
          return z(this, function (e, n, r) {
            var o;
            if (b(e)) {
              if (i.indexOf("outer") === 0) {
                return e["inner" + t];
              } else {
                return e.document.documentElement["client" + t];
              }
            } else if (e.nodeType === 9) {
              o = e.documentElement;
              return Math.max(e.body["scroll" + t], o["scroll" + t], e.body["offset" + t], o["offset" + t], o["client" + t]);
            } else if (r === undefined) {
              return C.css(e, n, a);
            } else {
              return C.style(e, n, r, a);
            }
          }, e, s ? r : undefined, s);
        };
      });
    });
    C.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (t, e) {
      C.fn[e] = function (t) {
        return this.on(e, t);
      };
    });
    C.fn.extend({
      bind: function (t, e, n) {
        return this.on(t, null, e, n);
      },
      unbind: function (t, e) {
        return this.off(t, null, e);
      },
      delegate: function (t, e, n, i) {
        return this.on(e, t, n, i);
      },
      undelegate: function (t, e, n) {
        if (arguments.length === 1) {
          return this.off(t, "**");
        } else {
          return this.off(e, t || "**", n);
        }
      },
      hover: function (t, e) {
        return this.mouseenter(t).mouseleave(e || t);
      }
    });
    C.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function (t, e) {
      C.fn[e] = function (t, n) {
        if (arguments.length > 0) {
          return this.on(e, null, t, n);
        } else {
          return this.trigger(e);
        }
      };
    });
    var Ge = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    C.proxy = function (t, e) {
      var n;
      var i;
      var r;
      if (typeof e == "string") {
        n = t[e];
        e = t;
        t = n;
      }
      if (g(t)) {
        i = a.call(arguments, 2);
        (r = function () {
          return t.apply(e || this, i.concat(a.call(arguments)));
        }).guid = t.guid = t.guid || C.guid++;
        return r;
      }
    };
    C.holdReady = function (t) {
      if (t) {
        C.readyWait++;
      } else {
        C.ready(true);
      }
    };
    C.isArray = Array.isArray;
    C.parseJSON = JSON.parse;
    C.nodeName = A;
    C.isFunction = g;
    C.isWindow = b;
    C.camelCase = G;
    C.type = N;
    C.now = Date.now;
    C.isNumeric = function (t) {
      var e = C.type(t);
      return (e === "number" || e === "string") && !isNaN(t - parseFloat(t));
    };
    C.trim = function (t) {
      if (t == null) {
        return "";
      } else {
        return (t + "").replace(Ge, "");
      }
    };
    if ((i = function () {
      return C;
    }.apply(e, [])) !== undefined) {
      t.exports = i;
    }
    var Ke = n.jQuery;
    var Xe = n.$;
    C.noConflict = function (t) {
      if (n.$ === C) {
        n.$ = Xe;
      }
      if (t && n.jQuery === C) {
        n.jQuery = Ke;
      }
      return C;
    };
    if (r === undefined) {
      n.jQuery = n.$ = C;
    }
    return C;
  });
}, function (t, e, n) {
  var i = n(113);
  var r = n(53);
  if (r.m === undefined) {
    r.m = i;
  }
  t.exports = i;
}, function (t, e, n) {
  "use strict";

  var i = n(114);
  var r = n(117);
  var o = n(78);
  function s() {
    return i.apply(this, arguments);
  }
  s.m = i;
  s.trust = i.trust;
  s.fragment = i.fragment;
  s.mount = o.mount;
  s.route = n(123);
  s.render = n(98);
  s.redraw = o.redraw;
  s.request = r.request;
  s.jsonp = r.jsonp;
  s.parseQueryString = n(101);
  s.buildQueryString = n(99);
  s.parsePathname = n(80);
  s.buildPathname = n(79);
  s.vnode = n(28);
  s.PromisePolyfill = n(96);
  t.exports = s;
}, function (t, e, n) {
  "use strict";

  var i = n(93);
  i.trust = n(115);
  i.fragment = n(116);
  t.exports = i;
}, function (t, e, n) {
  "use strict";

  var i = n(28);
  t.exports = function (t) {
    if (t == null) {
      t = "";
    }
    return i("<", undefined, undefined, t, undefined, undefined);
  };
}, function (t, e, n) {
  "use strict";

  var i = n(28);
  var r = n(94);
  t.exports = function () {
    var t = r.apply(0, arguments);
    t.tag = "[";
    t.children = i.normalizeChildren(t.children);
    return t;
  };
}, function (t, e, n) {
  "use strict";

  var i = n(95);
  var r = n(78);
  t.exports = n(122)(window, i, r.redraw);
}, function (t, e, n) {
  (function (t, e) {
    (function (t, n) {
      "use strict";

      if (!t.setImmediate) {
        var i;
        var r;
        var o;
        var s;
        var a;
        var c = 1;
        var u = {};
        var l = false;
        var d = t.document;
        var p = Object.getPrototypeOf && Object.getPrototypeOf(t);
        p = p && p.setTimeout ? p : t;
        if ({}.toString.call(t.process) === "[object process]") {
          i = function (t) {
            e.nextTick(function () {
              f(t);
            });
          };
        } else if (!function () {
          if (t.postMessage && !t.importScripts) {
            var e = true;
            var n = t.onmessage;
            t.onmessage = function () {
              e = false;
            };
            t.postMessage("", "*");
            t.onmessage = n;
            return e;
          }
        }()) {
          if (t.MessageChannel) {
            (o = new MessageChannel()).port1.onmessage = function (t) {
              f(t.data);
            };
            i = function (t) {
              o.port2.postMessage(t);
            };
          } else if (d && "onreadystatechange" in d.createElement("script")) {
            r = d.documentElement;
            i = function (t) {
              var e = d.createElement("script");
              e.onreadystatechange = function () {
                f(t);
                e.onreadystatechange = null;
                r.removeChild(e);
                e = null;
              };
              r.appendChild(e);
            };
          } else {
            i = function (t) {
              setTimeout(f, 0, t);
            };
          }
        } else {
          s = "setImmediate$" + Math.random() + "$";
          a = function (e) {
            if (e.source === t && typeof e.data == "string" && e.data.indexOf(s) === 0) {
              f(+e.data.slice(s.length));
            }
          };
          if (t.addEventListener) {
            t.addEventListener("message", a, false);
          } else {
            t.attachEvent("onmessage", a);
          }
          i = function (e) {
            t.postMessage(s + e, "*");
          };
        }
        p.setImmediate = function (t) {
          if (typeof t != "function") {
            t = new Function("" + t);
          }
          for (var e = new Array(arguments.length - 1), n = 0; n < e.length; n++) {
            e[n] = arguments[n + 1];
          }
          var r = {
            callback: t,
            args: e
          };
          u[c] = r;
          i(c);
          return c++;
        };
        p.clearImmediate = h;
      }
      function h(t) {
        delete u[t];
      }
      function f(t) {
        if (l) {
          setTimeout(f, 0, t);
        } else {
          var e = u[t];
          if (e) {
            l = true;
            try {
              (function (t) {
                var e = t.callback;
                var n = t.args;
                switch (n.length) {
                  case 0:
                    e();
                    break;
                  case 1:
                    e(n[0]);
                    break;
                  case 2:
                    e(n[0], n[1]);
                    break;
                  case 3:
                    e(n[0], n[1], n[2]);
                    break;
                  default:
                    e.apply(undefined, n);
                }
              })(e);
            } finally {
              h(t);
              l = false;
            }
          }
        }
      }
    })(typeof self == "undefined" ? t === undefined ? this : t : self);
  }).call(this, n(50), n(119));
}, function (t, e) {
  var n;
  var i;
  var r = t.exports = {};
  function o() {
    throw new Error("setTimeout has not been defined");
  }
  function s() {
    throw new Error("clearTimeout has not been defined");
  }
  function a(t) {
    if (n === setTimeout) {
      return setTimeout(t, 0);
    }
    if ((n === o || !n) && setTimeout) {
      n = setTimeout;
      return setTimeout(t, 0);
    }
    try {
      return n(t, 0);
    } catch (e) {
      try {
        return n.call(null, t, 0);
      } catch (e) {
        return n.call(this, t, 0);
      }
    }
  }
  (function () {
    try {
      n = typeof setTimeout == "function" ? setTimeout : o;
    } catch (t) {
      n = o;
    }
    try {
      i = typeof clearTimeout == "function" ? clearTimeout : s;
    } catch (t) {
      i = s;
    }
  })();
  var c;
  var u = [];
  var l = false;
  var d = -1;
  function p() {
    if (l && c) {
      l = false;
      if (c.length) {
        u = c.concat(u);
      } else {
        d = -1;
      }
      if (u.length) {
        h();
      }
    }
  }
  function h() {
    if (!l) {
      var t = a(p);
      l = true;
      for (var e = u.length; e;) {
        c = u;
        u = [];
        while (++d < e) {
          if (c) {
            c[d].run();
          }
        }
        d = -1;
        e = u.length;
      }
      c = null;
      l = false;
      (function (t) {
        if (i === clearTimeout) {
          return clearTimeout(t);
        }
        if ((i === s || !i) && clearTimeout) {
          i = clearTimeout;
          return clearTimeout(t);
        }
        try {
          i(t);
        } catch (e) {
          try {
            return i.call(null, t);
          } catch (e) {
            return i.call(this, t);
          }
        }
      })(t);
    }
  }
  function f(t, e) {
    this.fun = t;
    this.array = e;
  }
  function m() {}
  r.nextTick = function (t) {
    var e = new Array(arguments.length - 1);
    if (arguments.length > 1) {
      for (var n = 1; n < arguments.length; n++) {
        e[n - 1] = arguments[n];
      }
    }
    u.push(new f(t, e));
    if (u.length === 1 && !l) {
      a(h);
    }
  };
  f.prototype.run = function () {
    this.fun.apply(null, this.array);
  };
  r.title = "browser";
  r.browser = true;
  r.env = {};
  r.argv = [];
  r.version = "";
  r.versions = {};
  r.on = m;
  r.addListener = m;
  r.once = m;
  r.off = m;
  r.removeListener = m;
  r.removeAllListeners = m;
  r.emit = m;
  r.prependListener = m;
  r.prependOnceListener = m;
  r.listeners = function (t) {
    return [];
  };
  r.binding = function (t) {
    throw new Error("process.binding is not supported");
  };
  r.cwd = function () {
    return "/";
  };
  r.chdir = function (t) {
    throw new Error("process.chdir is not supported");
  };
  r.umask = function () {
    return 0;
  };
}, function (t, e, n) {
  "use strict";

  var i = n(28);
  t.exports = function (t) {
    var e;
    var n = t && t.document;
    var r = {
      svg: "http://www.w3.org/2000/svg",
      math: "http://www.w3.org/1998/Math/MathML"
    };
    function o(t) {
      return t.attrs && t.attrs.xmlns || r[t.tag];
    }
    function s(t, e) {
      if (t.state !== e) {
        throw new Error("`vnode.state` must not be modified");
      }
    }
    function a(t) {
      var e = t.state;
      try {
        return this.apply(e, arguments);
      } finally {
        s(t, e);
      }
    }
    function c() {
      try {
        return n.activeElement;
      } catch (t) {
        return null;
      }
    }
    function u(t, e, n, i, r, o, s) {
      for (var a = n; a < i; a++) {
        var c = e[a];
        if (c != null) {
          l(t, c, r, s, o);
        }
      }
    }
    function l(t, e, r, s, c) {
      var d = e.tag;
      if (typeof d == "string") {
        e.state = {};
        if (e.attrs != null) {
          M(e.attrs, e, r);
        }
        switch (d) {
          case "#":
            (function (t, e, i) {
              e.dom = n.createTextNode(e.children);
              y(t, e.dom, i);
            })(t, e, c);
            break;
          case "<":
            p(t, e, s, c);
            break;
          case "[":
            (function (t, e, i, r, o) {
              var s = n.createDocumentFragment();
              if (e.children != null) {
                var a = e.children;
                u(s, a, 0, a.length, i, null, r);
              }
              e.dom = s.firstChild;
              e.domSize = s.childNodes.length;
              y(t, s, o);
            })(t, e, r, s, c);
            break;
          default:
            (function (t, e, r, s, a) {
              var c = e.tag;
              var l = e.attrs;
              var d = l && l.is;
              var p = (s = o(e) || s) ? d ? n.createElementNS(s, c, {
                is: d
              }) : n.createElementNS(s, c) : d ? n.createElement(c, {
                is: d
              }) : n.createElement(c);
              e.dom = p;
              if (l != null) {
                (function (t, e, n) {
                  for (var i in e) {
                    O(t, i, null, e[i], n);
                  }
                })(e, l, s);
              }
              y(t, p, a);
              if (!w(e) && (e.text != null && (e.text !== "" ? p.textContent = e.text : e.children = [i("#", undefined, undefined, e.text, undefined, undefined)]), e.children != null)) {
                var h = e.children;
                u(p, h, 0, h.length, r, null, s);
                if (e.tag === "select" && l != null) {
                  (function (t, e) {
                    if ("value" in e) {
                      if (e.value === null) {
                        if (t.dom.selectedIndex !== -1) {
                          t.dom.value = null;
                        }
                      } else {
                        var n = "" + e.value;
                        if (t.dom.value !== n || t.dom.selectedIndex === -1) {
                          t.dom.value = n;
                        }
                      }
                    }
                    if ("selectedIndex" in e) {
                      O(t, "selectedIndex", null, e.selectedIndex, undefined);
                    }
                  })(e, l);
                }
              }
            })(t, e, r, s, c);
        }
      } else {
        (function (t, e, n, r, o) {
          (function (t, e) {
            var n;
            if (typeof t.tag.view == "function") {
              t.state = Object.create(t.tag);
              if ((n = t.state.view).$$reentrantLock$$ != null) {
                return;
              }
              n.$$reentrantLock$$ = true;
            } else {
              t.state = undefined;
              if ((n = t.tag).$$reentrantLock$$ != null) {
                return;
              }
              n.$$reentrantLock$$ = true;
              t.state = t.tag.prototype != null && typeof t.tag.prototype.view == "function" ? new t.tag(t) : t.tag(t);
            }
            M(t.state, t, e);
            if (t.attrs != null) {
              M(t.attrs, t, e);
            }
            t.instance = i.normalize(a.call(t.state.view, t));
            if (t.instance === t) {
              throw Error("A view cannot return the vnode it received as argument");
            }
            n.$$reentrantLock$$ = null;
          })(e, n);
          if (e.instance != null) {
            l(t, e.instance, n, r, o);
            e.dom = e.instance.dom;
            e.domSize = e.dom != null ? e.instance.domSize : 0;
          } else {
            e.domSize = 0;
          }
        })(t, e, r, s, c);
      }
    }
    var d = {
      caption: "table",
      thead: "table",
      tbody: "table",
      tfoot: "table",
      tr: "tbody",
      th: "tr",
      td: "tr",
      colgroup: "table",
      col: "colgroup"
    };
    function p(t, e, i, r) {
      var o = e.children.match(/^\s*?<(\w+)/im) || [];
      var s = n.createElement(d[o[1]] || "div");
      if (i === "http://www.w3.org/2000/svg") {
        s.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\">" + e.children + "</svg>";
        s = s.firstChild;
      } else {
        s.innerHTML = e.children;
      }
      e.dom = s.firstChild;
      e.domSize = s.childNodes.length;
      e.instance = [];
      for (var a, c = n.createDocumentFragment(); a = s.firstChild;) {
        e.instance.push(a);
        c.appendChild(a);
      }
      y(t, c, r);
    }
    function h(t, e, n, i, r, o) {
      if (e !== n && (e != null || n != null)) {
        if (e == null || e.length === 0) {
          u(t, n, 0, n.length, i, r, o);
        } else if (n == null || n.length === 0) {
          x(t, e, 0, e.length);
        } else {
          var s = e[0] != null && e[0].key != null;
          var a = n[0] != null && n[0].key != null;
          var c = 0;
          var d = 0;
          if (!s) {
            while (d < e.length && e[d] == null) {
              d++;
            }
          }
          if (!a) {
            while (c < n.length && n[c] == null) {
              c++;
            }
          }
          if (a === null && s == null) {
            return;
          }
          if (s !== a) {
            x(t, e, d, e.length);
            u(t, n, c, n.length, i, r, o);
          } else if (a) {
            var p;
            var h;
            for (var y, w, C, T = e.length - 1, S = n.length - 1; T >= d && S >= c && (y = e[T], w = n[S], y.key === w.key);) {
              if (y !== w) {
                f(t, y, w, i, r, o);
              }
              if (w.dom != null) {
                r = w.dom;
              }
              T--;
              S--;
            }
            while (T >= d && S >= c && (p = e[d], h = n[c], p.key === h.key)) {
              d++;
              c++;
              if (p !== h) {
                f(t, p, h, i, g(e, d, r), o);
              }
            }
            while (T >= d && S >= c && c !== S && p.key === w.key && y.key === h.key) {
              b(t, y, C = g(e, d, r));
              if (y !== h) {
                f(t, y, h, i, C, o);
              }
              if (++c <= --S) {
                b(t, p, r);
              }
              if (p !== w) {
                f(t, p, w, i, r, o);
              }
              if (w.dom != null) {
                r = w.dom;
              }
              d++;
              y = e[--T];
              w = n[S];
              p = e[d];
              h = n[c];
            }
            while (T >= d && S >= c && y.key === w.key) {
              if (y !== w) {
                f(t, y, w, i, r, o);
              }
              if (w.dom != null) {
                r = w.dom;
              }
              S--;
              y = e[--T];
              w = n[S];
            }
            if (c > S) {
              x(t, e, d, T + 1);
            } else if (d > T) {
              u(t, n, c, S + 1, i, r, o);
            } else {
              var O;
              var k;
              var j = r;
              var A = S - c + 1;
              var E = new Array(A);
              var P = 0;
              var _ = 0;
              var D = 2147483647;
              var $ = 0;
              for (_ = 0; _ < A; _++) {
                E[_] = -1;
              }
              for (_ = S; _ >= c; _--) {
                if (O == null) {
                  O = m(e, d, T + 1);
                }
                var I = O[(w = n[_]).key];
                if (I != null) {
                  D = I < D ? I : -1;
                  E[_ - c] = I;
                  y = e[I];
                  e[I] = null;
                  if (y !== w) {
                    f(t, y, w, i, r, o);
                  }
                  if (w.dom != null) {
                    r = w.dom;
                  }
                  $++;
                }
              }
              r = j;
              if ($ !== T - d + 1) {
                x(t, e, d, T + 1);
              }
              if ($ === 0) {
                u(t, n, c, S + 1, i, r, o);
              } else if (D === -1) {
                P = (k = function (t) {
                  var e = [0];
                  var n = 0;
                  var i = 0;
                  var r = 0;
                  var o = v.length = t.length;
                  for (r = 0; r < o; r++) {
                    v[r] = t[r];
                  }
                  for (r = 0; r < o; ++r) {
                    if (t[r] !== -1) {
                      var s = e[e.length - 1];
                      if (t[s] < t[r]) {
                        v[r] = s;
                        e.push(r);
                      } else {
                        n = 0;
                        i = e.length - 1;
                        while (n < i) {
                          var a = (n >>> 1) + (i >>> 1) + (n & i & 1);
                          if (t[e[a]] < t[r]) {
                            n = a + 1;
                          } else {
                            i = a;
                          }
                        }
                        if (t[r] < t[e[n]]) {
                          if (n > 0) {
                            v[r] = e[n - 1];
                          }
                          e[n] = r;
                        }
                      }
                    }
                  }
                  n = e.length;
                  i = e[n - 1];
                  while (n-- > 0) {
                    e[n] = i;
                    i = v[i];
                  }
                  v.length = 0;
                  return e;
                }(E)).length - 1;
                _ = S;
                for (; _ >= c; _--) {
                  h = n[_];
                  if (E[_ - c] === -1) {
                    l(t, h, i, o, r);
                  } else if (k[P] === _ - c) {
                    P--;
                  } else {
                    b(t, h, r);
                  }
                  if (h.dom != null) {
                    r = n[_].dom;
                  }
                }
              } else {
                for (_ = S; _ >= c; _--) {
                  h = n[_];
                  if (E[_ - c] === -1) {
                    l(t, h, i, o, r);
                  }
                  if (h.dom != null) {
                    r = n[_].dom;
                  }
                }
              }
            }
          } else {
            var M = e.length < n.length ? e.length : n.length;
            for (c = c < d ? c : d; c < M; c++) {
              if ((p = e[c]) !== (h = n[c]) && (p != null || h != null)) {
                if (p == null) {
                  l(t, h, i, o, g(e, c + 1, r));
                } else if (h == null) {
                  N(t, p);
                } else {
                  f(t, p, h, i, g(e, c + 1, r), o);
                }
              }
            }
            if (e.length > M) {
              x(t, e, c, e.length);
            }
            if (n.length > M) {
              u(t, n, c, n.length, i, r, o);
            }
          }
        }
      }
    }
    function f(t, e, n, r, s, c) {
      var u = e.tag;
      if (u === n.tag) {
        n.state = e.state;
        n.events = e.events;
        if (function (t, e) {
          do {
            var n;
            if (t.attrs != null && typeof t.attrs.onbeforeupdate == "function") {
              if ((n = a.call(t.attrs.onbeforeupdate, t, e)) !== undefined && !n) {
                break;
              }
            }
            if (typeof t.tag != "string" && typeof t.state.onbeforeupdate == "function") {
              if ((n = a.call(t.state.onbeforeupdate, t, e)) !== undefined && !n) {
                break;
              }
            }
            return false;
          } while (0);
          t.dom = e.dom;
          t.domSize = e.domSize;
          t.instance = e.instance;
          t.attrs = e.attrs;
          t.children = e.children;
          t.text = e.text;
          return true;
        }(n, e)) {
          return;
        }
        if (typeof u == "string") {
          if (n.attrs != null) {
            L(n.attrs, n, r);
          }
          switch (u) {
            case "#":
              (function (t, e) {
                if (t.children.toString() !== e.children.toString()) {
                  t.dom.nodeValue = e.children;
                }
                e.dom = t.dom;
              })(e, n);
              break;
            case "<":
              (function (t, e, n, i, r) {
                if (e.children !== n.children) {
                  C(t, e);
                  p(t, n, i, r);
                } else {
                  n.dom = e.dom;
                  n.domSize = e.domSize;
                  n.instance = e.instance;
                }
              })(t, e, n, c, s);
              break;
            case "[":
              (function (t, e, n, i, r, o) {
                h(t, e.children, n.children, i, r, o);
                var s = 0;
                var a = n.children;
                n.dom = null;
                if (a != null) {
                  for (var c = 0; c < a.length; c++) {
                    var u = a[c];
                    if (u != null && u.dom != null) {
                      if (n.dom == null) {
                        n.dom = u.dom;
                      }
                      s += u.domSize || 1;
                    }
                  }
                  if (s !== 1) {
                    n.domSize = s;
                  }
                }
              })(t, e, n, r, s, c);
              break;
            default:
              (function (t, e, n, r) {
                var s = e.dom = t.dom;
                r = o(e) || r;
                if (e.tag === "textarea") {
                  if (e.attrs == null) {
                    e.attrs = {};
                  }
                  if (e.text != null) {
                    e.attrs.value = e.text;
                    e.text = undefined;
                  }
                }
                (function (t, e, n, i) {
                  if (n != null) {
                    for (var r in n) {
                      O(t, r, e && e[r], n[r], i);
                    }
                  }
                  var o;
                  if (e != null) {
                    for (var r in e) {
                      if ((o = e[r]) != null && (n == null || n[r] == null)) {
                        k(t, r, o, i);
                      }
                    }
                  }
                })(e, t.attrs, e.attrs, r);
                if (!w(e)) {
                  if (t.text != null && e.text != null && e.text !== "") {
                    if (t.text.toString() !== e.text.toString()) {
                      t.dom.firstChild.nodeValue = e.text;
                    }
                  } else {
                    if (t.text != null) {
                      t.children = [i("#", undefined, undefined, t.text, undefined, t.dom.firstChild)];
                    }
                    if (e.text != null) {
                      e.children = [i("#", undefined, undefined, e.text, undefined, undefined)];
                    }
                    h(s, t.children, e.children, n, null, r);
                  }
                }
              })(e, n, r, c);
          }
        } else {
          (function (t, e, n, r, o, s) {
            n.instance = i.normalize(a.call(n.state.view, n));
            if (n.instance === n) {
              throw Error("A view cannot return the vnode it received as argument");
            }
            L(n.state, n, r);
            if (n.attrs != null) {
              L(n.attrs, n, r);
            }
            if (n.instance != null) {
              if (e.instance == null) {
                l(t, n.instance, r, s, o);
              } else {
                f(t, e.instance, n.instance, r, o, s);
              }
              n.dom = n.instance.dom;
              n.domSize = n.instance.domSize;
            } else if (e.instance != null) {
              N(t, e.instance);
              n.dom = undefined;
              n.domSize = 0;
            } else {
              n.dom = e.dom;
              n.domSize = e.domSize;
            }
          })(t, e, n, r, s, c);
        }
      } else {
        N(t, e);
        l(t, n, r, c, s);
      }
    }
    function m(t, e, n) {
      var i = Object.create(null);
      for (; e < n; e++) {
        var r = t[e];
        if (r != null) {
          var o = r.key;
          if (o != null) {
            i[o] = e;
          }
        }
      }
      return i;
    }
    var v = [];
    function g(t, e, n) {
      for (; e < t.length; e++) {
        if (t[e] != null && t[e].dom != null) {
          return t[e].dom;
        }
      }
      return n;
    }
    function b(t, e, i) {
      var r = n.createDocumentFragment();
      (function t(e, n, i) {
        while (i.dom != null && i.dom.parentNode === e) {
          if (typeof i.tag != "string") {
            if ((i = i.instance) != null) {
              continue;
            }
          } else if (i.tag === "<") {
            for (var r = 0; r < i.instance.length; r++) {
              n.appendChild(i.instance[r]);
            }
          } else if (i.tag !== "[") {
            n.appendChild(i.dom);
          } else if (i.children.length === 1) {
            if ((i = i.children[0]) != null) {
              continue;
            }
          } else {
            for (r = 0; r < i.children.length; r++) {
              var o = i.children[r];
              if (o != null) {
                t(e, n, o);
              }
            }
          }
          break;
        }
      })(t, r, e);
      y(t, r, i);
    }
    function y(t, e, n) {
      if (n != null) {
        t.insertBefore(e, n);
      } else {
        t.appendChild(e);
      }
    }
    function w(t) {
      if (t.attrs == null || t.attrs.contenteditable == null && t.attrs.contentEditable == null) {
        return false;
      }
      var e = t.children;
      if (e != null && e.length === 1 && e[0].tag === "<") {
        var n = e[0].children;
        if (t.dom.innerHTML !== n) {
          t.dom.innerHTML = n;
        }
      } else if (t.text != null || e != null && e.length !== 0) {
        throw new Error("Child node of a contenteditable must be trusted");
      }
      return true;
    }
    function x(t, e, n, i) {
      for (var r = n; r < i; r++) {
        var o = e[r];
        if (o != null) {
          N(t, o);
        }
      }
    }
    function N(t, e) {
      var n;
      var i;
      var r;
      var o = 0;
      var c = e.state;
      if (typeof e.tag != "string" && typeof e.state.onbeforeremove == "function") {
        if ((r = a.call(e.state.onbeforeremove, e)) != null && typeof r.then == "function") {
          o = 1;
          n = r;
        }
      }
      if (e.attrs && typeof e.attrs.onbeforeremove == "function") {
        if ((r = a.call(e.attrs.onbeforeremove, e)) != null && typeof r.then == "function") {
          o |= 2;
          i = r;
        }
      }
      s(e, c);
      if (o) {
        if (n != null) {
          function u() {
            if (o & 1) {
              if (!(o &= 2)) {
                l();
              }
            }
          }
          n.then(u, u);
        }
        if (i != null) {
          u = function () {
            if (o & 2) {
              if (!(o &= 1)) {
                l();
              }
            }
          };
          i.then(u, u);
        }
      } else {
        S(e);
        T(t, e);
      }
      function l() {
        s(e, c);
        S(e);
        T(t, e);
      }
    }
    function C(t, e) {
      for (var n = 0; n < e.instance.length; n++) {
        t.removeChild(e.instance[n]);
      }
    }
    function T(t, e) {
      while (e.dom != null && e.dom.parentNode === t) {
        if (typeof e.tag != "string") {
          if ((e = e.instance) != null) {
            continue;
          }
        } else if (e.tag === "<") {
          C(t, e);
        } else {
          if (e.tag !== "[" && (t.removeChild(e.dom), !Array.isArray(e.children))) {
            break;
          }
          if (e.children.length === 1) {
            if ((e = e.children[0]) != null) {
              continue;
            }
          } else {
            for (var n = 0; n < e.children.length; n++) {
              var i = e.children[n];
              if (i != null) {
                T(t, i);
              }
            }
          }
        }
        break;
      }
    }
    function S(t) {
      if (typeof t.tag != "string" && typeof t.state.onremove == "function") {
        a.call(t.state.onremove, t);
      }
      if (t.attrs && typeof t.attrs.onremove == "function") {
        a.call(t.attrs.onremove, t);
      }
      if (typeof t.tag != "string") {
        if (t.instance != null) {
          S(t.instance);
        }
      } else {
        var e = t.children;
        if (Array.isArray(e)) {
          for (var n = 0; n < e.length; n++) {
            var i = e[n];
            if (i != null) {
              S(i);
            }
          }
        }
      }
    }
    function O(t, e, i, r, o) {
      if (e !== "key" && e !== "is" && r != null && !j(e) && (i !== r || function (t, e) {
        return e === "value" || e === "checked" || e === "selectedIndex" || e === "selected" && t.dom === c() || t.tag === "option" && t.dom.parentNode === n.activeElement;
      }(t, e) || typeof r == "object")) {
        if (e[0] === "o" && e[1] === "n") {
          return I(t, e, r);
        }
        if (e.slice(0, 6) === "xlink:") {
          t.dom.setAttributeNS("http://www.w3.org/1999/xlink", e.slice(6), r);
        } else if (e === "style") {
          D(t.dom, i, r);
        } else if (A(t, e, o)) {
          if (e === "value") {
            if ((t.tag === "input" || t.tag === "textarea") && t.dom.value === "" + r && t.dom === c()) {
              return;
            }
            if (t.tag === "select" && i !== null && t.dom.value === "" + r) {
              return;
            }
            if (t.tag === "option" && i !== null && t.dom.value === "" + r) {
              return;
            }
          }
          if (t.tag === "input" && e === "type") {
            t.dom.setAttribute(e, r);
          } else {
            t.dom[e] = r;
          }
        } else if (typeof r == "boolean") {
          if (r) {
            t.dom.setAttribute(e, "");
          } else {
            t.dom.removeAttribute(e);
          }
        } else {
          t.dom.setAttribute(e === "className" ? "class" : e, r);
        }
      }
    }
    function k(t, e, n, i) {
      if (e !== "key" && e !== "is" && n != null && !j(e)) {
        if (e[0] !== "o" || e[1] !== "n" || j(e)) {
          if (e === "style") {
            D(t.dom, n, null);
          } else if (!A(t, e, i) || e === "className" || e === "value" && (t.tag === "option" || t.tag === "select" && t.dom.selectedIndex === -1 && t.dom === c()) || t.tag === "input" && e === "type") {
            var r = e.indexOf(":");
            if (r !== -1) {
              e = e.slice(r + 1);
            }
            if (n !== false) {
              t.dom.removeAttribute(e === "className" ? "class" : e);
            }
          } else {
            t.dom[e] = null;
          }
        } else {
          I(t, e, undefined);
        }
      }
    }
    function j(t) {
      return t === "oninit" || t === "oncreate" || t === "onupdate" || t === "onremove" || t === "onbeforeremove" || t === "onbeforeupdate";
    }
    function A(t, e, n) {
      return n === undefined && (t.tag.indexOf("-") > -1 || t.attrs != null && t.attrs.is || e !== "href" && e !== "list" && e !== "form" && e !== "width" && e !== "height") && e in t.dom;
    }
    var E = /[A-Z]/g;
    function P(t) {
      return "-" + t.toLowerCase();
    }
    function _(t) {
      if (t[0] === "-" && t[1] === "-") {
        return t;
      } else if (t === "cssFloat") {
        return "float";
      } else {
        return t.replace(E, P);
      }
    }
    function D(t, e, n) {
      if (e === n) ;else if (n == null) {
        t.style.cssText = "";
      } else if (typeof n != "object") {
        t.style.cssText = n;
      } else if (e == null || typeof e != "object") {
        t.style.cssText = "";
        for (var i in n) {
          if ((r = n[i]) != null) {
            t.style.setProperty(_(i), String(r));
          }
        }
      } else {
        for (var i in n) {
          var r;
          if ((r = n[i]) != null && (r = String(r)) !== String(e[i])) {
            t.style.setProperty(_(i), r);
          }
        }
        for (var i in e) {
          if (e[i] != null && n[i] == null) {
            t.style.removeProperty(_(i));
          }
        }
      }
    }
    function $() {
      this._ = e;
    }
    function I(t, e, n) {
      if (t.events != null) {
        if (t.events[e] === n) {
          return;
        }
        if (n == null || typeof n != "function" && typeof n != "object") {
          if (t.events[e] != null) {
            t.dom.removeEventListener(e.slice(2), t.events, false);
          }
          t.events[e] = undefined;
        } else {
          if (t.events[e] == null) {
            t.dom.addEventListener(e.slice(2), t.events, false);
          }
          t.events[e] = n;
        }
      } else if (n != null && (typeof n == "function" || typeof n == "object")) {
        t.events = new $();
        t.dom.addEventListener(e.slice(2), t.events, false);
        t.events[e] = n;
      }
    }
    function M(t, e, n) {
      if (typeof t.oninit == "function") {
        a.call(t.oninit, e);
      }
      if (typeof t.oncreate == "function") {
        n.push(a.bind(t.oncreate, e));
      }
    }
    function L(t, e, n) {
      if (typeof t.onupdate == "function") {
        n.push(a.bind(t.onupdate, e));
      }
    }
    $.prototype = Object.create(null);
    $.prototype.handleEvent = function (t) {
      var e;
      var n = this["on" + t.type];
      if (typeof n == "function") {
        e = n.call(t.currentTarget, t);
      } else if (typeof n.handleEvent == "function") {
        n.handleEvent(t);
      }
      if (this._ && t.redraw !== false) {
        (0, this._)();
      }
      if (e === false) {
        t.preventDefault();
        t.stopPropagation();
      }
    };
    return function (t, n, r) {
      if (!t) {
        throw new TypeError("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.");
      }
      var o = [];
      var s = c();
      var a = t.namespaceURI;
      if (t.vnodes == null) {
        t.textContent = "";
      }
      n = i.normalizeChildren(Array.isArray(n) ? n : [n]);
      var u = e;
      try {
        e = typeof r == "function" ? r : undefined;
        h(t, t.vnodes, n, o, null, a === "http://www.w3.org/1999/xhtml" ? undefined : a);
      } finally {
        e = u;
      }
      t.vnodes = n;
      if (s != null && c() !== s && typeof s.focus == "function") {
        s.focus();
      }
      for (var l = 0; l < o.length; l++) {
        o[l]();
      }
    };
  };
}, function (t, e, n) {
  "use strict";

  var i = n(28);
  t.exports = function (t, e, n) {
    var r = [];
    var o = false;
    var s = false;
    function a() {
      if (o) {
        throw new Error("Nested m.redraw.sync() call");
      }
      o = true;
      for (var e = 0; e < r.length; e += 2) {
        try {
          t(r[e], i(r[e + 1]), c);
        } catch (t) {
          n.error(t);
        }
      }
      o = false;
    }
    function c() {
      if (!s) {
        s = true;
        e(function () {
          s = false;
          a();
        });
      }
    }
    c.sync = a;
    return {
      mount: function (e, n) {
        if (n != null && n.view == null && typeof n != "function") {
          throw new TypeError("m.mount(element, component) expects a component, not a vnode");
        }
        var o = r.indexOf(e);
        if (o >= 0) {
          r.splice(o, 2);
          t(e, [], c);
        }
        if (n != null) {
          r.push(e, n);
          t(e, i(n), c);
        }
      },
      redraw: c
    };
  };
}, function (t, e, n) {
  "use strict";

  var i = n(79);
  t.exports = function (t, e, n) {
    var r = 0;
    function o(t) {
      return new e(t);
    }
    function s(t) {
      return function (r, s) {
        if (typeof r != "string") {
          s = r;
          r = r.url;
        } else if (s == null) {
          s = {};
        }
        var a = new e(function (e, n) {
          t(i(r, s.params), s, function (t) {
            if (typeof s.type == "function") {
              if (Array.isArray(t)) {
                for (var n = 0; n < t.length; n++) {
                  t[n] = new s.type(t[n]);
                }
              } else {
                t = new s.type(t);
              }
            }
            e(t);
          }, n);
        });
        if (s.background === true) {
          return a;
        }
        var c = 0;
        function u() {
          if (--c == 0 && typeof n == "function") {
            n();
          }
        }
        return function t(e) {
          var n = e.then;
          e.constructor = o;
          e.then = function () {
            c++;
            var i = n.apply(e, arguments);
            i.then(u, function (t) {
              u();
              if (c === 0) {
                throw t;
              }
            });
            return t(i);
          };
          return e;
        }(a);
      };
    }
    function a(t, e) {
      for (var n in t.headers) {
        if ({}.hasOwnProperty.call(t.headers, n) && e.test(n)) {
          return true;
        }
      }
      return false;
    }
    o.prototype = e.prototype;
    o.__proto__ = e;
    return {
      request: s(function (e, n, i, r) {
        var o;
        var s = n.method != null ? n.method.toUpperCase() : "GET";
        var c = n.body;
        var u = (n.serialize == null || n.serialize === JSON.serialize) && !(c instanceof t.FormData);
        var l = n.responseType || (typeof n.extract == "function" ? "" : "json");
        var d = new t.XMLHttpRequest();
        var p = false;
        var h = d;
        var f = d.abort;
        d.abort = function () {
          p = true;
          f.call(this);
        };
        d.open(s, e, n.async !== false, typeof n.user == "string" ? n.user : undefined, typeof n.password == "string" ? n.password : undefined);
        if (u && c != null && !a(n, /^content-type$/i)) {
          d.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        }
        if (typeof n.deserialize != "function" && !a(n, /^accept$/i)) {
          d.setRequestHeader("Accept", "application/json, text/*");
        }
        if (n.withCredentials) {
          d.withCredentials = n.withCredentials;
        }
        if (n.timeout) {
          d.timeout = n.timeout;
        }
        d.responseType = l;
        for (var m in n.headers) {
          if ({}.hasOwnProperty.call(n.headers, m)) {
            d.setRequestHeader(m, n.headers[m]);
          }
        }
        d.onreadystatechange = function (t) {
          if (!p && t.target.readyState === 4) {
            try {
              var o;
              var s = t.target.status >= 200 && t.target.status < 300 || t.target.status === 304 || /^file:\/\//i.test(e);
              var a = t.target.response;
              if (l === "json") {
                if (!t.target.responseType && typeof n.extract != "function") {
                  a = JSON.parse(t.target.responseText);
                }
              } else if (!l || l === "text") {
                if (a == null) {
                  a = t.target.responseText;
                }
              }
              if (typeof n.extract == "function") {
                a = n.extract(t.target, n);
                s = true;
              } else if (typeof n.deserialize == "function") {
                a = n.deserialize(a);
              }
              if (s) {
                i(a);
              } else {
                try {
                  o = t.target.responseText;
                } catch (t) {
                  o = a;
                }
                var c = new Error(o);
                c.code = t.target.status;
                c.response = a;
                r(c);
              }
            } catch (t) {
              r(t);
            }
          }
        };
        if (typeof n.config == "function" && (d = n.config(d, n, e) || d) !== h) {
          o = d.abort;
          d.abort = function () {
            p = true;
            o.call(this);
          };
        }
        if (c == null) {
          d.send();
        } else if (typeof n.serialize == "function") {
          d.send(n.serialize(c));
        } else if (c instanceof t.FormData) {
          d.send(c);
        } else {
          d.send(JSON.stringify(c));
        }
      }),
      jsonp: s(function (e, n, i, o) {
        var s = n.callbackName || "_mithril_" + Math.round(Math.random() * 10000000000000000) + "_" + r++;
        var a = t.document.createElement("script");
        t[s] = function (e) {
          delete t[s];
          a.parentNode.removeChild(a);
          i(e);
        };
        a.onerror = function () {
          delete t[s];
          a.parentNode.removeChild(a);
          o(new Error("JSONP request failed"));
        };
        a.src = e + (e.indexOf("?") < 0 ? "?" : "&") + encodeURIComponent(n.callbackKey || "callback") + "=" + encodeURIComponent(s);
        t.document.documentElement.appendChild(a);
      })
    };
  };
}, function (t, e, n) {
  "use strict";

  var i = n(78);
  t.exports = n(124)(window, i);
}, function (t, e, n) {
  "use strict";

  (function (e) {
    var i = n(28);
    var r = n(93);
    var o = n(95);
    var s = n(79);
    var a = n(80);
    var c = n(125);
    var u = n(100);
    var l = {};
    t.exports = function (t, n) {
      var d;
      function p(e, n, i) {
        e = s(e, n);
        if (d != null) {
          d();
          var r = i ? i.state : null;
          var o = i ? i.title : null;
          if (i && i.replace) {
            t.history.replaceState(r, o, y.prefix + e);
          } else {
            t.history.pushState(r, o, y.prefix + e);
          }
        } else {
          t.location.href = y.prefix + e;
        }
      }
      var h;
      var f;
      var m;
      var v;
      var g = l;
      var b = y.SKIP = {};
      function y(r, s, w) {
        if (r == null) {
          throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined");
        }
        var x;
        var N = 0;
        var C = Object.keys(w).map(function (t) {
          if (t[0] !== "/") {
            throw new SyntaxError("Routes must start with a `/`");
          }
          if (/:([^\/\.-]+)(\.{3})?:/.test(t)) {
            throw new SyntaxError("Route parameter names must be separated with either `/`, `.`, or `-`");
          }
          return {
            route: t,
            component: w[t],
            check: c(t)
          };
        });
        var T = typeof e == "function" ? e : setTimeout;
        var S = o.resolve();
        var O = false;
        d = null;
        if (s != null) {
          var k = a(s);
          if (!C.some(function (t) {
            return t.check(k);
          })) {
            throw new ReferenceError("Default route doesn't match any known routes");
          }
        }
        function j() {
          O = false;
          var e = t.location.hash;
          if (y.prefix[0] !== "#") {
            e = t.location.search + e;
            if (y.prefix[0] !== "?" && (e = t.location.pathname + e)[0] !== "/") {
              e = "/" + e;
            }
          }
          var i = e.concat().replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent).slice(y.prefix.length);
          var r = a(i);
          function o() {
            if (i === s) {
              throw new Error("Could not resolve default route " + s);
            }
            p(s, null, {
              replace: true
            });
          }
          u(r.params, t.history.state);
          (function t(e) {
            for (; e < C.length; e++) {
              if (C[e].check(r)) {
                var s = C[e].component;
                var a = C[e].route;
                var c = s;
                var u = v = function (o) {
                  if (u === v) {
                    if (o === b) {
                      return t(e + 1);
                    }
                    h = o == null || typeof o.view != "function" && typeof o != "function" ? "div" : o;
                    f = r.params;
                    m = i;
                    v = null;
                    g = s.render ? s : null;
                    if (N === 2) {
                      n.redraw();
                    } else {
                      N = 2;
                      n.redraw.sync();
                    }
                  }
                };
                if (s.view || typeof s == "function") {
                  s = {};
                  u(c);
                } else if (s.onmatch) {
                  S.then(function () {
                    return s.onmatch(r.params, i, a);
                  }).then(u, o);
                } else {
                  u("div");
                }
                return;
              }
            }
            o();
          })(0);
        }
        d = function () {
          if (!O) {
            O = true;
            T(j);
          }
        };
        if (typeof t.history.pushState == "function") {
          x = function () {
            t.removeEventListener("popstate", d, false);
          };
          t.addEventListener("popstate", d, false);
        } else if (y.prefix[0] === "#") {
          d = null;
          x = function () {
            t.removeEventListener("hashchange", j, false);
          };
          t.addEventListener("hashchange", j, false);
        }
        return n.mount(r, {
          onbeforeupdate: function () {
            return !!(N = N ? 2 : 1) && l !== g;
          },
          oncreate: j,
          onremove: x,
          view: function () {
            if (N && l !== g) {
              var t = [i(h, f.key, f)];
              if (g) {
                t = g.render(t[0]);
              }
              return t;
            }
          }
        });
      }
      y.set = function (t, e, n) {
        if (v != null) {
          (n = n || {}).replace = true;
        }
        v = null;
        p(t, e, n);
      };
      y.get = function () {
        return m;
      };
      y.prefix = "#!";
      y.Link = {
        view: function (t) {
          var e;
          var n;
          var i = t.attrs.options;
          var o = {};
          u(o, t.attrs);
          o.selector = o.options = o.key = o.oninit = o.oncreate = o.onbeforeupdate = o.onupdate = o.onbeforeremove = o.onremove = null;
          var s = r(t.attrs.selector || "a", o, t.children);
          if (s.attrs.disabled = Boolean(s.attrs.disabled)) {
            s.attrs.href = null;
            s.attrs["aria-disabled"] = "true";
            s.attrs.onclick = null;
          } else {
            e = s.attrs.onclick;
            n = s.attrs.href;
            s.attrs.href = y.prefix + n;
            s.attrs.onclick = function (t) {
              var r;
              if (typeof e == "function") {
                r = e.call(t.currentTarget, t);
              } else if (e != null && typeof e == "object") {
                if (typeof e.handleEvent == "function") {
                  e.handleEvent(t);
                }
              }
              if (r !== false && !t.defaultPrevented && (t.button === 0 || t.which === 0 || t.which === 1) && (!t.currentTarget.target || t.currentTarget.target === "_self") && !t.ctrlKey && !t.metaKey && !t.shiftKey && !t.altKey) {
                t.preventDefault();
                t.redraw = false;
                y.set(n, null, i);
              }
            };
          }
          return s;
        }
      };
      y.param = function (t) {
        if (f && t != null) {
          return f[t];
        } else {
          return f;
        }
      };
      return y;
    };
  }).call(this, n(97).setImmediate);
}, function (t, e, n) {
  "use strict";

  var i = n(80);
  t.exports = function (t) {
    var e = i(t);
    var n = Object.keys(e.params);
    var r = [];
    var o = new RegExp("^" + e.path.replace(/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g, function (t, e, n) {
      if (e == null) {
        return "\\" + t;
      } else {
        r.push({
          k: e,
          r: n === "..."
        });
        if (n === "...") {
          return "(.*)";
        } else if (n === ".") {
          return "([^/]+)\\.";
        } else {
          return "([^/]+)" + (n || "");
        }
      }
    }) + "$");
    return function (t) {
      for (var i = 0; i < n.length; i++) {
        if (e.params[n[i]] !== t.params[n[i]]) {
          return false;
        }
      }
      if (!r.length) {
        return o.test(t.path);
      }
      var s = o.exec(t.path);
      if (s == null) {
        return false;
      }
      for (i = 0; i < r.length; i++) {
        t.params[r[i].k] = r[i].r ? s[i + 1] : decodeURIComponent(s[i + 1]);
      }
      return true;
    };
  };
}, function (t, e, n) {
  var i = n(24);
  var r = n(53);
  if (r.dayjs === undefined) {
    r.dayjs = i;
  }
  t.exports = i;
}, function (t, e) {
  (function (t) {
    "use strict";

    var e = function e(n, i) {
      this.options = t.extend({}, e.DEFAULTS, i);
      var r = this.options.target === e.DEFAULTS.target ? t(this.options.target) : t(document).find(this.options.target);
      this.$target = r.on("scroll.bs.affix.data-api", t.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", t.proxy(this.checkPositionWithEventLoop, this));
      this.$element = t(n);
      this.affixed = null;
      this.unpin = null;
      this.pinnedOffset = null;
      this.checkPosition();
    };
    function n(n) {
      return this.each(function () {
        var i = t(this);
        var r = i.data("bs.affix");
        var o = typeof n == "object" && n;
        if (!r) {
          i.data("bs.affix", r = new e(this, o));
        }
        if (typeof n == "string") {
          r[n]();
        }
      });
    }
    e.VERSION = "3.4.1";
    e.RESET = "affix affix-top affix-bottom";
    e.DEFAULTS = {
      offset: 0,
      target: window
    };
    e.prototype.getState = function (t, e, n, i) {
      var r = this.$target.scrollTop();
      var o = this.$element.offset();
      var s = this.$target.height();
      if (n != null && this.affixed == "top") {
        return r < n && "top";
      }
      if (this.affixed == "bottom") {
        if (n != null) {
          return !(r + this.unpin <= o.top) && "bottom";
        } else {
          return !(r + s <= t - i) && "bottom";
        }
      }
      var a = this.affixed == null;
      var c = a ? r : o.top;
      if (n != null && r <= n) {
        return "top";
      } else {
        return i != null && c + (a ? s : e) >= t - i && "bottom";
      }
    };
    e.prototype.getPinnedOffset = function () {
      if (this.pinnedOffset) {
        return this.pinnedOffset;
      }
      this.$element.removeClass(e.RESET).addClass("affix");
      var t = this.$target.scrollTop();
      var n = this.$element.offset();
      return this.pinnedOffset = n.top - t;
    };
    e.prototype.checkPositionWithEventLoop = function () {
      setTimeout(t.proxy(this.checkPosition, this), 1);
    };
    e.prototype.checkPosition = function () {
      if (this.$element.is(":visible")) {
        var n = this.$element.height();
        var i = this.options.offset;
        var r = i.top;
        var o = i.bottom;
        var s = Math.max(t(document).height(), t(document.body).height());
        if (typeof i != "object") {
          o = r = i;
        }
        if (typeof r == "function") {
          r = i.top(this.$element);
        }
        if (typeof o == "function") {
          o = i.bottom(this.$element);
        }
        var a = this.getState(s, n, r, o);
        if (this.affixed != a) {
          if (this.unpin != null) {
            this.$element.css("top", "");
          }
          var c = "affix" + (a ? "-" + a : "");
          var u = t.Event(c + ".bs.affix");
          this.$element.trigger(u);
          if (u.isDefaultPrevented()) {
            return;
          }
          this.affixed = a;
          this.unpin = a == "bottom" ? this.getPinnedOffset() : null;
          this.$element.removeClass(e.RESET).addClass(c).trigger(c.replace("affix", "affixed") + ".bs.affix");
        }
        if (a == "bottom") {
          this.$element.offset({
            top: s - n - o
          });
        }
      }
    };
    var i = t.fn.affix;
    t.fn.affix = n;
    t.fn.affix.Constructor = e;
    t.fn.affix.noConflict = function () {
      t.fn.affix = i;
      return this;
    };
    t(window).on("load", function () {
      t("[data-spy=\"affix\"]").each(function () {
        var e = t(this);
        var i = e.data();
        i.offset = i.offset || {};
        if (i.offsetBottom != null) {
          i.offset.bottom = i.offsetBottom;
        }
        if (i.offsetTop != null) {
          i.offset.top = i.offsetTop;
        }
        n.call(e, i);
      });
    });
  })(jQuery);
}, function (t, e) {
  (function (t) {
    "use strict";

    var e = "[data-toggle=\"dropdown\"]";
    function n(e) {
      t(e).on("click.bs.dropdown", this.toggle);
    }
    function i(e) {
      var n = e.attr("data-target");
      n ||= (n = e.attr("href")) && /#[A-Za-z]/.test(n) && n.replace(/.*(?=#[^\s]*$)/, "");
      var i = n !== "#" ? t(document).find(n) : null;
      if (i && i.length) {
        return i;
      } else {
        return e.parent();
      }
    }
    function r(n) {
      if (!n || n.which !== 3) {
        t(".dropdown-backdrop").remove();
        t(e).each(function () {
          var e = t(this);
          var r = i(e);
          var o = {
            relatedTarget: this
          };
          if (r.hasClass("open")) {
            if (!n || n.type != "click" || !/input|textarea/i.test(n.target.tagName) || !t.contains(r[0], n.target)) {
              r.trigger(n = t.Event("hide.bs.dropdown", o));
              if (!n.isDefaultPrevented()) {
                e.attr("aria-expanded", "false");
                r.removeClass("open").trigger(t.Event("hidden.bs.dropdown", o));
              }
            }
          }
        });
      }
    }
    n.VERSION = "3.4.1";
    n.prototype.toggle = function (e) {
      var n = t(this);
      if (!n.is(".disabled, :disabled")) {
        var o = i(n);
        var s = o.hasClass("open");
        r();
        if (!s) {
          if ("ontouchstart" in document.documentElement && !o.closest(".navbar-nav").length) {
            t(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(t(this)).on("click", r);
          }
          var a = {
            relatedTarget: this
          };
          o.trigger(e = t.Event("show.bs.dropdown", a));
          if (e.isDefaultPrevented()) {
            return;
          }
          n.trigger("focus").attr("aria-expanded", "true");
          o.toggleClass("open").trigger(t.Event("shown.bs.dropdown", a));
        }
        return false;
      }
    };
    n.prototype.keydown = function (n) {
      if (/(38|40|27|32)/.test(n.which) && !/input|textarea/i.test(n.target.tagName)) {
        var r = t(this);
        n.preventDefault();
        n.stopPropagation();
        if (!r.is(".disabled, :disabled")) {
          var o = i(r);
          var s = o.hasClass("open");
          if (!s && n.which != 27 || s && n.which == 27) {
            if (n.which == 27) {
              o.find(e).trigger("focus");
            }
            return r.trigger("click");
          }
          var a = o.find(".dropdown-menu li:not(.disabled):visible a");
          if (a.length) {
            var c = a.index(n.target);
            if (n.which == 38 && c > 0) {
              c--;
            }
            if (n.which == 40 && c < a.length - 1) {
              c++;
            }
            if (!~c) {
              c = 0;
            }
            a.eq(c).trigger("focus");
          }
        }
      }
    };
    var o = t.fn.dropdown;
    t.fn.dropdown = function (e) {
      return this.each(function () {
        var i = t(this);
        var r = i.data("bs.dropdown");
        if (!r) {
          i.data("bs.dropdown", r = new n(this));
        }
        if (typeof e == "string") {
          r[e].call(i);
        }
      });
    };
    t.fn.dropdown.Constructor = n;
    t.fn.dropdown.noConflict = function () {
      t.fn.dropdown = o;
      return this;
    };
    t(document).on("click.bs.dropdown.data-api", r).on("click.bs.dropdown.data-api", ".dropdown form", function (t) {
      t.stopPropagation();
    }).on("click.bs.dropdown.data-api", e, n.prototype.toggle).on("keydown.bs.dropdown.data-api", e, n.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", n.prototype.keydown);
  })(jQuery);
}, function (t, e) {
  (function (t) {
    "use strict";

    function e(e, n) {
      this.options = n;
      this.$body = t(document.body);
      this.$element = t(e);
      this.$dialog = this.$element.find(".modal-dialog");
      this.$backdrop = null;
      this.isShown = null;
      this.originalBodyPad = null;
      this.scrollbarWidth = 0;
      this.ignoreBackdropClick = false;
      this.fixedContent = ".navbar-fixed-top, .navbar-fixed-bottom";
      if (this.options.remote) {
        this.$element.find(".modal-content").load(this.options.remote, t.proxy(function () {
          this.$element.trigger("loaded.bs.modal");
        }, this));
      }
    }
    function n(n, i) {
      return this.each(function () {
        var r = t(this);
        var o = r.data("bs.modal");
        var s = t.extend({}, e.DEFAULTS, r.data(), typeof n == "object" && n);
        if (!o) {
          r.data("bs.modal", o = new e(this, s));
        }
        if (typeof n == "string") {
          o[n](i);
        } else if (s.show) {
          o.show(i);
        }
      });
    }
    e.VERSION = "3.4.1";
    e.TRANSITION_DURATION = 300;
    e.BACKDROP_TRANSITION_DURATION = 150;
    e.DEFAULTS = {
      backdrop: true,
      keyboard: true,
      show: true
    };
    e.prototype.toggle = function (t) {
      if (this.isShown) {
        return this.hide();
      } else {
        return this.show(t);
      }
    };
    e.prototype.show = function (n) {
      var i = this;
      var r = t.Event("show.bs.modal", {
        relatedTarget: n
      });
      this.$element.trigger(r);
      if (!this.isShown && !r.isDefaultPrevented()) {
        this.isShown = true;
        this.checkScrollbar();
        this.setScrollbar();
        this.$body.addClass("modal-open");
        this.escape();
        this.resize();
        this.$element.on("click.dismiss.bs.modal", "[data-dismiss=\"modal\"]", t.proxy(this.hide, this));
        this.$dialog.on("mousedown.dismiss.bs.modal", function () {
          i.$element.one("mouseup.dismiss.bs.modal", function (e) {
            if (t(e.target).is(i.$element)) {
              i.ignoreBackdropClick = true;
            }
          });
        });
        this.backdrop(function () {
          var r = t.support.transition && i.$element.hasClass("fade");
          if (!i.$element.parent().length) {
            i.$element.appendTo(i.$body);
          }
          i.$element.show().scrollTop(0);
          i.adjustDialog();
          if (r) {
            i.$element[0].offsetWidth;
          }
          i.$element.addClass("in");
          i.enforceFocus();
          var o = t.Event("shown.bs.modal", {
            relatedTarget: n
          });
          if (r) {
            i.$dialog.one("bsTransitionEnd", function () {
              i.$element.trigger("focus").trigger(o);
            }).emulateTransitionEnd(e.TRANSITION_DURATION);
          } else {
            i.$element.trigger("focus").trigger(o);
          }
        });
      }
    };
    e.prototype.hide = function (n) {
      if (n) {
        n.preventDefault();
      }
      n = t.Event("hide.bs.modal");
      this.$element.trigger(n);
      if (this.isShown && !n.isDefaultPrevented()) {
        this.isShown = false;
        this.escape();
        this.resize();
        t(document).off("focusin.bs.modal");
        this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal");
        this.$dialog.off("mousedown.dismiss.bs.modal");
        if (t.support.transition && this.$element.hasClass("fade")) {
          this.$element.one("bsTransitionEnd", t.proxy(this.hideModal, this)).emulateTransitionEnd(e.TRANSITION_DURATION);
        } else {
          this.hideModal();
        }
      }
    };
    e.prototype.enforceFocus = function () {
      t(document).off("focusin.bs.modal").on("focusin.bs.modal", t.proxy(function (t) {
        if (document !== t.target && this.$element[0] !== t.target && !this.$element.has(t.target).length) {
          this.$element.trigger("focus");
        }
      }, this));
    };
    e.prototype.escape = function () {
      if (this.isShown && this.options.keyboard) {
        this.$element.on("keydown.dismiss.bs.modal", t.proxy(function (t) {
          if (t.which == 27) {
            this.hide();
          }
        }, this));
      } else if (!this.isShown) {
        this.$element.off("keydown.dismiss.bs.modal");
      }
    };
    e.prototype.resize = function () {
      if (this.isShown) {
        t(window).on("resize.bs.modal", t.proxy(this.handleUpdate, this));
      } else {
        t(window).off("resize.bs.modal");
      }
    };
    e.prototype.hideModal = function () {
      var t = this;
      this.$element.hide();
      this.backdrop(function () {
        t.$body.removeClass("modal-open");
        t.resetAdjustments();
        t.resetScrollbar();
        t.$element.trigger("hidden.bs.modal");
      });
    };
    e.prototype.removeBackdrop = function () {
      if (this.$backdrop) {
        this.$backdrop.remove();
      }
      this.$backdrop = null;
    };
    e.prototype.backdrop = function (n) {
      var i = this;
      var r = this.$element.hasClass("fade") ? "fade" : "";
      if (this.isShown && this.options.backdrop) {
        var o = t.support.transition && r;
        this.$backdrop = t(document.createElement("div")).addClass("modal-backdrop " + r).appendTo(this.$body);
        this.$element.on("click.dismiss.bs.modal", t.proxy(function (t) {
          if (this.ignoreBackdropClick) {
            this.ignoreBackdropClick = false;
          } else if (t.target === t.currentTarget) {
            if (this.options.backdrop == "static") {
              this.$element[0].focus();
            } else {
              this.hide();
            }
          }
        }, this));
        if (o) {
          this.$backdrop[0].offsetWidth;
        }
        this.$backdrop.addClass("in");
        if (!n) {
          return;
        }
        if (o) {
          this.$backdrop.one("bsTransitionEnd", n).emulateTransitionEnd(e.BACKDROP_TRANSITION_DURATION);
        } else {
          n();
        }
      } else if (!this.isShown && this.$backdrop) {
        this.$backdrop.removeClass("in");
        function s() {
          i.removeBackdrop();
          if (n) {
            n();
          }
        }
        if (t.support.transition && this.$element.hasClass("fade")) {
          this.$backdrop.one("bsTransitionEnd", s).emulateTransitionEnd(e.BACKDROP_TRANSITION_DURATION);
        } else {
          s();
        }
      } else if (n) {
        n();
      }
    };
    e.prototype.handleUpdate = function () {
      this.adjustDialog();
    };
    e.prototype.adjustDialog = function () {
      var t = this.$element[0].scrollHeight > document.documentElement.clientHeight;
      this.$element.css({
        paddingLeft: !this.bodyIsOverflowing && t ? this.scrollbarWidth : "",
        paddingRight: this.bodyIsOverflowing && !t ? this.scrollbarWidth : ""
      });
    };
    e.prototype.resetAdjustments = function () {
      this.$element.css({
        paddingLeft: "",
        paddingRight: ""
      });
    };
    e.prototype.checkScrollbar = function () {
      var t = window.innerWidth;
      if (!t) {
        var e = document.documentElement.getBoundingClientRect();
        t = e.right - Math.abs(e.left);
      }
      this.bodyIsOverflowing = document.body.clientWidth < t;
      this.scrollbarWidth = this.measureScrollbar();
    };
    e.prototype.setScrollbar = function () {
      var e = parseInt(this.$body.css("padding-right") || 0, 10);
      this.originalBodyPad = document.body.style.paddingRight || "";
      var n = this.scrollbarWidth;
      if (this.bodyIsOverflowing) {
        this.$body.css("padding-right", e + n);
        t(this.fixedContent).each(function (e, i) {
          var r = i.style.paddingRight;
          var o = t(i).css("padding-right");
          t(i).data("padding-right", r).css("padding-right", parseFloat(o) + n + "px");
        });
      }
    };
    e.prototype.resetScrollbar = function () {
      this.$body.css("padding-right", this.originalBodyPad);
      t(this.fixedContent).each(function (e, n) {
        var i = t(n).data("padding-right");
        t(n).removeData("padding-right");
        n.style.paddingRight = i || "";
      });
    };
    e.prototype.measureScrollbar = function () {
      var t = document.createElement("div");
      t.className = "modal-scrollbar-measure";
      this.$body.append(t);
      var e = t.offsetWidth - t.clientWidth;
      this.$body[0].removeChild(t);
      return e;
    };
    var i = t.fn.modal;
    t.fn.modal = n;
    t.fn.modal.Constructor = e;
    t.fn.modal.noConflict = function () {
      t.fn.modal = i;
      return this;
    };
    t(document).on("click.bs.modal.data-api", "[data-toggle=\"modal\"]", function (e) {
      var i = t(this);
      var r = i.attr("href");
      var o = i.attr("data-target") || r && r.replace(/.*(?=#[^\s]+$)/, "");
      var s = t(document).find(o);
      var a = s.data("bs.modal") ? "toggle" : t.extend({
        remote: !/#/.test(r) && r
      }, s.data(), i.data());
      if (i.is("a")) {
        e.preventDefault();
      }
      s.one("show.bs.modal", function (t) {
        if (!t.isDefaultPrevented()) {
          s.one("hidden.bs.modal", function () {
            if (i.is(":visible")) {
              i.trigger("focus");
            }
          });
        }
      });
      n.call(s, a, this);
    });
  })(jQuery);
}, function (t, e) {
  (function (t) {
    "use strict";

    var e = ["sanitize", "whiteList", "sanitizeFn"];
    var n = ["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"];
    var i = {
      "*": ["class", "dir", "id", "lang", "role", /^aria-[\w-]*$/i],
      a: ["target", "href", "title", "rel"],
      area: [],
      b: [],
      br: [],
      col: [],
      code: [],
      div: [],
      em: [],
      hr: [],
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      i: [],
      img: ["src", "alt", "title", "width", "height"],
      li: [],
      ol: [],
      p: [],
      pre: [],
      s: [],
      small: [],
      span: [],
      sub: [],
      sup: [],
      strong: [],
      u: [],
      ul: []
    };
    var r = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;
    var o = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;
    function s(e, i) {
      var s = e.nodeName.toLowerCase();
      if (t.inArray(s, i) !== -1) {
        return t.inArray(s, n) === -1 || Boolean(e.nodeValue.match(r) || e.nodeValue.match(o));
      }
      var a = t(i).filter(function (t, e) {
        return e instanceof RegExp;
      });
      for (var c = 0, u = a.length; c < u; c++) {
        if (s.match(a[c])) {
          return true;
        }
      }
      return false;
    }
    function a(e, n, i) {
      if (e.length === 0) {
        return e;
      }
      if (i && typeof i == "function") {
        return i(e);
      }
      if (!document.implementation || !document.implementation.createHTMLDocument) {
        return e;
      }
      var r = document.implementation.createHTMLDocument("sanitization");
      r.body.innerHTML = e;
      var o = t.map(n, function (t, e) {
        return e;
      });
      var a = t(r.body).find("*");
      for (var c = 0, u = a.length; c < u; c++) {
        var l = a[c];
        var d = l.nodeName.toLowerCase();
        if (t.inArray(d, o) !== -1) {
          var p = t.map(l.attributes, function (t) {
            return t;
          });
          var h = [].concat(n["*"] || [], n[d] || []);
          for (var f = 0, m = p.length; f < m; f++) {
            if (!s(p[f], h)) {
              l.removeAttribute(p[f].nodeName);
            }
          }
        } else {
          l.parentNode.removeChild(l);
        }
      }
      return r.body.innerHTML;
    }
    function c(t, e) {
      this.type = null;
      this.options = null;
      this.enabled = null;
      this.timeout = null;
      this.hoverState = null;
      this.$element = null;
      this.inState = null;
      this.init("tooltip", t, e);
    }
    c.VERSION = "3.4.1";
    c.TRANSITION_DURATION = 150;
    c.DEFAULTS = {
      animation: true,
      placement: "top",
      selector: false,
      template: "<div class=\"tooltip\" role=\"tooltip\"><div class=\"tooltip-arrow\"></div><div class=\"tooltip-inner\"></div></div>",
      trigger: "hover focus",
      title: "",
      delay: 0,
      html: false,
      container: false,
      viewport: {
        selector: "body",
        padding: 0
      },
      sanitize: true,
      sanitizeFn: null,
      whiteList: i
    };
    c.prototype.init = function (e, n, i) {
      this.enabled = true;
      this.type = e;
      this.$element = t(n);
      this.options = this.getOptions(i);
      this.$viewport = this.options.viewport && t(document).find(t.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport);
      this.inState = {
        click: false,
        hover: false,
        focus: false
      };
      if (this.$element[0] instanceof document.constructor && !this.options.selector) {
        throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
      }
      var r = this.options.trigger.split(" ");
      for (var o = r.length; o--;) {
        var s = r[o];
        if (s == "click") {
          this.$element.on("click." + this.type, this.options.selector, t.proxy(this.toggle, this));
        } else if (s != "manual") {
          var a = s == "hover" ? "mouseenter" : "focusin";
          var c = s == "hover" ? "mouseleave" : "focusout";
          this.$element.on(a + "." + this.type, this.options.selector, t.proxy(this.enter, this));
          this.$element.on(c + "." + this.type, this.options.selector, t.proxy(this.leave, this));
        }
      }
      if (this.options.selector) {
        this._options = t.extend({}, this.options, {
          trigger: "manual",
          selector: ""
        });
      } else {
        this.fixTitle();
      }
    };
    c.prototype.getDefaults = function () {
      return c.DEFAULTS;
    };
    c.prototype.getOptions = function (n) {
      var i = this.$element.data();
      for (var r in i) {
        if (i.hasOwnProperty(r) && t.inArray(r, e) !== -1) {
          delete i[r];
        }
      }
      if ((n = t.extend({}, this.getDefaults(), i, n)).delay && typeof n.delay == "number") {
        n.delay = {
          show: n.delay,
          hide: n.delay
        };
      }
      if (n.sanitize) {
        n.template = a(n.template, n.whiteList, n.sanitizeFn);
      }
      return n;
    };
    c.prototype.getDelegateOptions = function () {
      var e = {};
      var n = this.getDefaults();
      if (this._options) {
        t.each(this._options, function (t, i) {
          if (n[t] != i) {
            e[t] = i;
          }
        });
      }
      return e;
    };
    c.prototype.enter = function (e) {
      var n = e instanceof this.constructor ? e : t(e.currentTarget).data("bs." + this.type);
      if (!n) {
        n = new this.constructor(e.currentTarget, this.getDelegateOptions());
        t(e.currentTarget).data("bs." + this.type, n);
      }
      if (e instanceof t.Event) {
        n.inState[e.type == "focusin" ? "focus" : "hover"] = true;
      }
      if (n.tip().hasClass("in") || n.hoverState == "in") {
        n.hoverState = "in";
      } else {
        clearTimeout(n.timeout);
        n.hoverState = "in";
        if (!n.options.delay || !n.options.delay.show) {
          return n.show();
        }
        n.timeout = setTimeout(function () {
          if (n.hoverState == "in") {
            n.show();
          }
        }, n.options.delay.show);
      }
    };
    c.prototype.isInStateTrue = function () {
      for (var t in this.inState) {
        if (this.inState[t]) {
          return true;
        }
      }
      return false;
    };
    c.prototype.leave = function (e) {
      var n = e instanceof this.constructor ? e : t(e.currentTarget).data("bs." + this.type);
      if (!n) {
        n = new this.constructor(e.currentTarget, this.getDelegateOptions());
        t(e.currentTarget).data("bs." + this.type, n);
      }
      if (e instanceof t.Event) {
        n.inState[e.type == "focusout" ? "focus" : "hover"] = false;
      }
      if (!n.isInStateTrue()) {
        clearTimeout(n.timeout);
        n.hoverState = "out";
        if (!n.options.delay || !n.options.delay.hide) {
          return n.hide();
        }
        n.timeout = setTimeout(function () {
          if (n.hoverState == "out") {
            n.hide();
          }
        }, n.options.delay.hide);
      }
    };
    c.prototype.show = function () {
      var e = t.Event("show.bs." + this.type);
      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e);
        var n = t.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
        if (e.isDefaultPrevented() || !n) {
          return;
        }
        var i = this;
        var r = this.tip();
        var o = this.getUID(this.type);
        this.setContent();
        r.attr("id", o);
        this.$element.attr("aria-describedby", o);
        if (this.options.animation) {
          r.addClass("fade");
        }
        var s = typeof this.options.placement == "function" ? this.options.placement.call(this, r[0], this.$element[0]) : this.options.placement;
        var a = /\s?auto?\s?/i;
        var u = a.test(s);
        if (u) {
          s = s.replace(a, "") || "top";
        }
        r.detach().css({
          top: 0,
          left: 0,
          display: "block"
        }).addClass(s).data("bs." + this.type, this);
        if (this.options.container) {
          r.appendTo(t(document).find(this.options.container));
        } else {
          r.insertAfter(this.$element);
        }
        this.$element.trigger("inserted.bs." + this.type);
        var l = this.getPosition();
        var d = r[0].offsetWidth;
        var p = r[0].offsetHeight;
        if (u) {
          var h = s;
          var f = this.getPosition(this.$viewport);
          s = s == "bottom" && l.bottom + p > f.bottom ? "top" : s == "top" && l.top - p < f.top ? "bottom" : s == "right" && l.right + d > f.width ? "left" : s == "left" && l.left - d < f.left ? "right" : s;
          r.removeClass(h).addClass(s);
        }
        var m = this.getCalculatedOffset(s, l, d, p);
        this.applyPlacement(m, s);
        function v() {
          var t = i.hoverState;
          i.$element.trigger("shown.bs." + i.type);
          i.hoverState = null;
          if (t == "out") {
            i.leave(i);
          }
        }
        if (t.support.transition && this.$tip.hasClass("fade")) {
          r.one("bsTransitionEnd", v).emulateTransitionEnd(c.TRANSITION_DURATION);
        } else {
          v();
        }
      }
    };
    c.prototype.applyPlacement = function (e, n) {
      var i = this.tip();
      var r = i[0].offsetWidth;
      var o = i[0].offsetHeight;
      var s = parseInt(i.css("margin-top"), 10);
      var a = parseInt(i.css("margin-left"), 10);
      if (isNaN(s)) {
        s = 0;
      }
      if (isNaN(a)) {
        a = 0;
      }
      e.top += s;
      e.left += a;
      t.offset.setOffset(i[0], t.extend({
        using: function (t) {
          i.css({
            top: Math.round(t.top),
            left: Math.round(t.left)
          });
        }
      }, e), 0);
      i.addClass("in");
      var c = i[0].offsetWidth;
      var u = i[0].offsetHeight;
      if (n == "top" && u != o) {
        e.top = e.top + o - u;
      }
      var l = this.getViewportAdjustedDelta(n, e, c, u);
      if (l.left) {
        e.left += l.left;
      } else {
        e.top += l.top;
      }
      var d = /top|bottom/.test(n);
      var p = d ? l.left * 2 - r + c : l.top * 2 - o + u;
      var h = d ? "offsetWidth" : "offsetHeight";
      i.offset(e);
      this.replaceArrow(p, i[0][h], d);
    };
    c.prototype.replaceArrow = function (t, e, n) {
      this.arrow().css(n ? "left" : "top", (1 - t / e) * 50 + "%").css(n ? "top" : "left", "");
    };
    c.prototype.setContent = function () {
      var t = this.tip();
      var e = this.getTitle();
      if (this.options.html) {
        if (this.options.sanitize) {
          e = a(e, this.options.whiteList, this.options.sanitizeFn);
        }
        t.find(".tooltip-inner").html(e);
      } else {
        t.find(".tooltip-inner").text(e);
      }
      t.removeClass("fade in top bottom left right");
    };
    c.prototype.hide = function (e) {
      var n = this;
      var i = t(this.$tip);
      var r = t.Event("hide.bs." + this.type);
      function o() {
        if (n.hoverState != "in") {
          i.detach();
        }
        if (n.$element) {
          n.$element.removeAttr("aria-describedby").trigger("hidden.bs." + n.type);
        }
        if (e) {
          e();
        }
      }
      this.$element.trigger(r);
      if (!r.isDefaultPrevented()) {
        i.removeClass("in");
        if (t.support.transition && i.hasClass("fade")) {
          i.one("bsTransitionEnd", o).emulateTransitionEnd(c.TRANSITION_DURATION);
        } else {
          o();
        }
        this.hoverState = null;
        return this;
      }
    };
    c.prototype.fixTitle = function () {
      var t = this.$element;
      if (t.attr("title") || typeof t.attr("data-original-title") != "string") {
        t.attr("data-original-title", t.attr("title") || "").attr("title", "");
      }
    };
    c.prototype.hasContent = function () {
      return this.getTitle();
    };
    c.prototype.getPosition = function (e) {
      var n = (e = e || this.$element)[0];
      var i = n.tagName == "BODY";
      var r = n.getBoundingClientRect();
      if (r.width == null) {
        r = t.extend({}, r, {
          width: r.right - r.left,
          height: r.bottom - r.top
        });
      }
      var o = window.SVGElement && n instanceof window.SVGElement;
      var s = i ? {
        top: 0,
        left: 0
      } : o ? null : e.offset();
      var a = {
        scroll: i ? document.documentElement.scrollTop || document.body.scrollTop : e.scrollTop()
      };
      var c = i ? {
        width: t(window).width(),
        height: t(window).height()
      } : null;
      return t.extend({}, r, a, c, s);
    };
    c.prototype.getCalculatedOffset = function (t, e, n, i) {
      if (t == "bottom") {
        return {
          top: e.top + e.height,
          left: e.left + e.width / 2 - n / 2
        };
      } else if (t == "top") {
        return {
          top: e.top - i,
          left: e.left + e.width / 2 - n / 2
        };
      } else if (t == "left") {
        return {
          top: e.top + e.height / 2 - i / 2,
          left: e.left - n
        };
      } else {
        return {
          top: e.top + e.height / 2 - i / 2,
          left: e.left + e.width
        };
      }
    };
    c.prototype.getViewportAdjustedDelta = function (t, e, n, i) {
      var r = {
        top: 0,
        left: 0
      };
      if (!this.$viewport) {
        return r;
      }
      var o = this.options.viewport && this.options.viewport.padding || 0;
      var s = this.getPosition(this.$viewport);
      if (/right|left/.test(t)) {
        var a = e.top - o - s.scroll;
        var c = e.top + o - s.scroll + i;
        if (a < s.top) {
          r.top = s.top - a;
        } else if (c > s.top + s.height) {
          r.top = s.top + s.height - c;
        }
      } else {
        var u = e.left - o;
        var l = e.left + o + n;
        if (u < s.left) {
          r.left = s.left - u;
        } else if (l > s.right) {
          r.left = s.left + s.width - l;
        }
      }
      return r;
    };
    c.prototype.getTitle = function () {
      var t = this.$element;
      var e = this.options;
      return t.attr("data-original-title") || (typeof e.title == "function" ? e.title.call(t[0]) : e.title);
    };
    c.prototype.getUID = function (t) {
      do {
        t += ~~(Math.random() * 1000000);
      } while (document.getElementById(t));
      return t;
    };
    c.prototype.tip = function () {
      if (!this.$tip && (this.$tip = t(this.options.template), this.$tip.length != 1)) {
        throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
      }
      return this.$tip;
    };
    c.prototype.arrow = function () {
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow");
    };
    c.prototype.enable = function () {
      this.enabled = true;
    };
    c.prototype.disable = function () {
      this.enabled = false;
    };
    c.prototype.toggleEnabled = function () {
      this.enabled = !this.enabled;
    };
    c.prototype.toggle = function (e) {
      var n = this;
      if (e) {
        if (!(n = t(e.currentTarget).data("bs." + this.type))) {
          n = new this.constructor(e.currentTarget, this.getDelegateOptions());
          t(e.currentTarget).data("bs." + this.type, n);
        }
      }
      if (e) {
        n.inState.click = !n.inState.click;
        if (n.isInStateTrue()) {
          n.enter(n);
        } else {
          n.leave(n);
        }
      } else if (n.tip().hasClass("in")) {
        n.leave(n);
      } else {
        n.enter(n);
      }
    };
    c.prototype.destroy = function () {
      var t = this;
      clearTimeout(this.timeout);
      this.hide(function () {
        t.$element.off("." + t.type).removeData("bs." + t.type);
        if (t.$tip) {
          t.$tip.detach();
        }
        t.$tip = null;
        t.$arrow = null;
        t.$viewport = null;
        t.$element = null;
      });
    };
    c.prototype.sanitizeHtml = function (t) {
      return a(t, this.options.whiteList, this.options.sanitizeFn);
    };
    var u = t.fn.tooltip;
    t.fn.tooltip = function (e) {
      return this.each(function () {
        var n = t(this);
        var i = n.data("bs.tooltip");
        var r = typeof e == "object" && e;
        if (!!i || !/destroy|hide/.test(e)) {
          if (!i) {
            n.data("bs.tooltip", i = new c(this, r));
          }
          if (typeof e == "string") {
            i[e]();
          }
        }
      });
    };
    t.fn.tooltip.Constructor = c;
    t.fn.tooltip.noConflict = function () {
      t.fn.tooltip = u;
      return this;
    };
  })(jQuery);
}, function (t, e) {
  (function (t) {
    "use strict";

    t.fn.emulateTransitionEnd = function (e) {
      var n = false;
      var i = this;
      t(this).one("bsTransitionEnd", function () {
        n = true;
      });
      setTimeout(function () {
        if (!n) {
          t(i).trigger(t.support.transition.end);
        }
      }, e);
      return this;
    };
    t(function () {
      t.support.transition = function () {
        var t = document.createElement("bootstrap");
        var e = {
          WebkitTransition: "webkitTransitionEnd",
          MozTransition: "transitionend",
          OTransition: "oTransitionEnd otransitionend",
          transition: "transitionend"
        };
        for (var n in e) {
          if (t.style[n] !== undefined) {
            return {
              end: e[n]
            };
          }
        }
        return false;
      }();
      if (t.support.transition) {
        t.event.special.bsTransitionEnd = {
          bindType: t.support.transition.end,
          delegateType: t.support.transition.end,
          handle: function (e) {
            if (t(e.target).is(this)) {
              return e.handleObj.handler.apply(this, arguments);
            }
          }
        };
      }
    });
  })(jQuery);
}, function (t, e) {
  (function (t) {
    function e(e) {
      if (typeof e.data == "string") {
        e.data = {
          keys: e.data
        };
      }
      if (e.data && e.data.keys && typeof e.data.keys == "string") {
        var n = e.handler;
        var i = e.data.keys.toLowerCase().split(" ");
        e.handler = function (e) {
          if (this === e.target || (!t.hotkeys.options.filterInputAcceptingElements || !t.hotkeys.textInputTypes.test(e.target.nodeName)) && (!t.hotkeys.options.filterContentEditable || !t(e.target).attr("contenteditable")) && (!t.hotkeys.options.filterTextInputs || !(t.inArray(e.target.type, t.hotkeys.textAcceptingInputTypes) > -1))) {
            var r = e.type !== "keypress" && t.hotkeys.specialKeys[e.which];
            var o = String.fromCharCode(e.which).toLowerCase();
            var s = "";
            var a = {};
            t.each(["alt", "ctrl", "shift"], function (t, n) {
              if (e[n + "Key"] && r !== n) {
                s += n + "+";
              }
            });
            if (e.metaKey && !e.ctrlKey && r !== "meta") {
              s += "meta+";
            }
            if (e.metaKey && r !== "meta" && s.indexOf("alt+ctrl+shift+") > -1) {
              s = s.replace("alt+ctrl+shift+", "hyper+");
            }
            if (r) {
              a[s + r] = true;
            } else {
              a[s + o] = true;
              a[s + t.hotkeys.shiftNums[o]] = true;
              if (s === "shift+") {
                a[t.hotkeys.shiftNums[o]] = true;
              }
            }
            for (var c = 0, u = i.length; c < u; c++) {
              if (a[i[c]]) {
                return n.apply(this, arguments);
              }
            }
          }
        };
      }
    }
    t.hotkeys = {
      version: "0.2.0",
      specialKeys: {
        8: "backspace",
        9: "tab",
        10: "return",
        13: "return",
        16: "shift",
        17: "ctrl",
        18: "alt",
        19: "pause",
        20: "capslock",
        27: "esc",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        45: "insert",
        46: "del",
        59: ";",
        61: "=",
        96: "0",
        97: "1",
        98: "2",
        99: "3",
        100: "4",
        101: "5",
        102: "6",
        103: "7",
        104: "8",
        105: "9",
        106: "*",
        107: "+",
        109: "-",
        110: ".",
        111: "/",
        112: "f1",
        113: "f2",
        114: "f3",
        115: "f4",
        116: "f5",
        117: "f6",
        118: "f7",
        119: "f8",
        120: "f9",
        121: "f10",
        122: "f11",
        123: "f12",
        144: "numlock",
        145: "scroll",
        173: "-",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'"
      },
      shiftNums: {
        "`": "~",
        1: "!",
        2: "@",
        3: "#",
        4: "$",
        5: "%",
        6: "^",
        7: "&",
        8: "*",
        9: "(",
        0: ")",
        "-": "_",
        "=": "+",
        ";": ": ",
        "'": "\"",
        ",": "<",
        ".": ">",
        "/": "?",
        "\\": "|"
      },
      textAcceptingInputTypes: ["text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime", "datetime-local", "search", "color", "tel"],
      textInputTypes: /textarea|input|select/i,
      options: {
        filterInputAcceptingElements: true,
        filterTextInputs: true,
        filterContentEditable: true
      }
    };
    t.each(["keydown", "keyup", "keypress"], function () {
      t.event.special[this] = {
        add: e
      };
    });
  })(jQuery || this.jQuery || window.jQuery);
}, function (t, e) {
  Array.prototype.flat ||= function t(e = 1) {
    if (e > 0) {
      return Array.prototype.reduce.call(this, function (n, i) {
        return n.concat(Array.isArray(i) ? t.call(i, e - 1) : i);
      }, []);
    } else {
      return [].concat(this);
    }
  };
}, function (t, e, n) {
  (function () {
    "use strict";

    n.SKIP = {};
    n.lift = function () {
      var t = arguments[0];
      var e = Array.prototype.slice.call(arguments, 1);
      return r(e).map(function (e) {
        return t.apply(undefined, e);
      });
    };
    n.scan = function (t, e, i) {
      var r = i.map(function (i) {
        var r = t(e, i);
        if (r !== n.SKIP) {
          e = r;
        }
        return r;
      });
      r(e);
      return r;
    };
    n.merge = r;
    n.combine = i;
    n.scanMerge = function (t, e) {
      var n = t.map(function (t) {
        return t[0];
      });
      var r = i(function () {
        var i = arguments[arguments.length - 1];
        n.forEach(function (n, r) {
          if (i.indexOf(n) > -1) {
            e = t[r][1](e, n());
          }
        });
        return e;
      }, n);
      r(e);
      return r;
    };
    n["fantasy-land/of"] = n;
    var e = false;
    function n(t) {
      var e;
      var r = [];
      var s = [];
      function a(e) {
        if (arguments.length && e !== n.SKIP) {
          t = e;
          if (o(a)) {
            a._changing();
            a._state = "active";
            r.forEach(function (e, n) {
              e(s[n](t));
            });
          }
        }
        return t;
      }
      function c() {
        (e = n()).map(function (t) {
          if (t === true) {
            a._parents.forEach(function (t) {
              t._unregisterChild(a);
            });
            a._state = "ended";
            a._parents.length = r.length = s.length = 0;
          }
          return t;
        });
        return e;
      }
      a.constructor = n;
      a._state = arguments.length && t !== n.SKIP ? "active" : "pending";
      a._parents = [];
      a._changing = function () {
        if (o(a)) {
          a._state = "changing";
        }
        r.forEach(function (t) {
          t._changing();
        });
      };
      a._map = function (e, i) {
        var o = i ? n() : n(e(t));
        o._parents.push(a);
        r.push(o);
        s.push(e);
        return o;
      };
      a.map = function (t) {
        return a._map(t, a._state !== "active");
      };
      a.toJSON = function () {
        if (t != null && typeof t.toJSON == "function") {
          return t.toJSON();
        } else {
          return t;
        }
      };
      a["fantasy-land/map"] = a.map;
      a["fantasy-land/ap"] = function (t) {
        return i(function (t, e) {
          return t()(e());
        }, [t, a]);
      };
      a._unregisterChild = function (t) {
        var e = r.indexOf(t);
        if (e !== -1) {
          r.splice(e, 1);
          s.splice(e, 1);
        }
      };
      Object.defineProperty(a, "end", {
        get: function () {
          return e || c();
        }
      });
      return a;
    }
    function i(t, e) {
      var i = e.every(function (t) {
        if (t.constructor !== n) {
          throw new Error("Ensure that each item passed to stream.combine/stream.merge/lift is a stream");
        }
        return t._state === "active";
      });
      var r = i ? n(t.apply(null, e.concat([e]))) : n();
      var o = [];
      var s = e.map(function (n) {
        return n._map(function (s) {
          o.push(n);
          if (i || e.every(function (t) {
            return t._state !== "pending";
          })) {
            i = true;
            r(t.apply(null, e.concat([o])));
            o = [];
          }
          return s;
        }, true);
      });
      var a = r.end.map(function (t) {
        if (t === true) {
          s.forEach(function (t) {
            t.end(true);
          });
          a.end(true);
        }
      });
      return r;
    }
    function r(t) {
      return i(function () {
        return t.map(function (t) {
          return t();
        });
      }, t);
    }
    function o(t) {
      return t._state === "pending" || t._state === "active" || t._state === "changing";
    }
    Object.defineProperty(n, "HALT", {
      get: function () {
        if (!e) {
          console.log("HALT is deprecated and has been renamed to SKIP");
        }
        e = true;
        return n.SKIP;
      }
    });
    t.exports = n;
  })();
}, function (t, e) {
  function n(e, i) {
    t.exports = n = Object.setPrototypeOf || function (t, e) {
      t.__proto__ = e;
      return t;
    };
    t.exports.default = t.exports;
    t.exports.__esModule = true;
    return n(e, i);
  }
  t.exports = n;
  t.exports.default = t.exports;
  t.exports.__esModule = true;
}, function (t, e) {
  function n(e) {
    if (typeof Symbol == "function" && typeof Symbol.iterator == "symbol") {
      t.exports = n = function (t) {
        return typeof t;
      };
      t.exports.default = t.exports;
      t.exports.__esModule = true;
    } else {
      t.exports = n = function (t) {
        if (t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype) {
          return "symbol";
        } else {
          return typeof t;
        }
      };
      t.exports.default = t.exports;
      t.exports.__esModule = true;
    }
    return n(e);
  }
  t.exports = n;
  t.exports.default = t.exports;
  t.exports.__esModule = true;
}, function (t, e) {
  t.exports = function (t) {
    if (t === undefined) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return t;
  };
  t.exports.default = t.exports;
  t.exports.__esModule = true;
}, function (t, e) {
  t.exports = function (t) {
    if (Array.isArray(t)) {
      return t;
    }
  };
  t.exports.default = t.exports;
  t.exports.__esModule = true;
}, function (t, e) {
  t.exports = function (t, e) {
    var n = t && (typeof Symbol != "undefined" && t[Symbol.iterator] || t["@@iterator"]);
    if (n != null) {
      var i;
      var r;
      var o = [];
      var s = true;
      var a = false;
      try {
        for (n = n.call(t); !(s = (i = n.next()).done) && (o.push(i.value), !e || o.length !== e); s = true);
      } catch (t) {
        a = true;
        r = t;
      } finally {
        try {
          if (!s && n.return != null) {
            n.return();
          }
        } finally {
          if (a) {
            throw r;
          }
        }
      }
      return o;
    }
  };
  t.exports.default = t.exports;
  t.exports.__esModule = true;
}, function (t, e, n) {
  var i = n(141);
  t.exports = function (t, e) {
    if (t) {
      if (typeof t == "string") {
        return i(t, e);
      }
      var n = Object.prototype.toString.call(t).slice(8, -1);
      if (n === "Object" && t.constructor) {
        n = t.constructor.name;
      }
      if (n === "Map" || n === "Set") {
        return Array.from(t);
      } else if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
        return i(t, e);
      } else {
        return undefined;
      }
    }
  };
  t.exports.default = t.exports;
  t.exports.__esModule = true;
}, function (t, e) {
  t.exports = function (t, e) {
    if (e == null || e > t.length) {
      e = t.length;
    }
    for (var n = 0, i = new Array(e); n < e; n++) {
      i[n] = t[n];
    }
    return i;
  };
  t.exports.default = t.exports;
  t.exports.__esModule = true;
}, function (t, e) {
  t.exports = function () {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  };
  t.exports.default = t.exports;
  t.exports.__esModule = true;
},, function (t, e, n) {
  var i = n(145);
  var r = n(53);
  if (r.punycode === undefined) {
    r.punycode = i;
  }
  t.exports = i;
}, function (t, e, n) {
  (function (t, i) {
    var r; /*! https://mths.be/punycode v1.4.1 by @mathias */
    (function (o) {
      if (e) {
        e.nodeType;
      }
      if (t) {
        t.nodeType;
      }
      var s = typeof i == "object" && i;
      if (s.global !== s && s.window !== s) {
        s.self;
      }
      var a;
      var c = 2147483647;
      var u = /^xn--/;
      var l = /[^\x20-\x7E]/;
      var d = /[\x2E\u3002\uFF0E\uFF61]/g;
      var p = {
        overflow: "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      };
      var h = Math.floor;
      var f = String.fromCharCode;
      function m(t) {
        throw new RangeError(p[t]);
      }
      function v(t, e) {
        for (var n = t.length, i = []; n--;) {
          i[n] = e(t[n]);
        }
        return i;
      }
      function g(t, e) {
        var n = t.split("@");
        var i = "";
        if (n.length > 1) {
          i = n[0] + "@";
          t = n[1];
        }
        return i + v((t = t.replace(d, ".")).split("."), e).join(".");
      }
      function b(t) {
        for (var e, n, i = [], r = 0, o = t.length; r < o;) {
          if ((e = t.charCodeAt(r++)) >= 55296 && e <= 56319 && r < o) {
            if (((n = t.charCodeAt(r++)) & 64512) == 56320) {
              i.push(((e & 1023) << 10) + (n & 1023) + 65536);
            } else {
              i.push(e);
              r--;
            }
          } else {
            i.push(e);
          }
        }
        return i;
      }
      function y(t) {
        return v(t, function (t) {
          var e = "";
          if (t > 65535) {
            e += f((t -= 65536) >>> 10 & 1023 | 55296);
            t = t & 1023 | 56320;
          }
          return e += f(t);
        }).join("");
      }
      function w(t, e) {
        return t + 22 + (t < 26) * 75 - ((e != 0) << 5);
      }
      function x(t, e, n) {
        var i = 0;
        t = n ? h(t / 700) : t >> 1;
        t += h(t / e);
        for (; t > 455; i += 36) {
          t = h(t / 35);
        }
        return h(i + t * 36 / (t + 38));
      }
      function N(t) {
        var e;
        var n;
        var i;
        var r;
        var o;
        var s;
        var a;
        var u;
        var l;
        var d;
        var p;
        var f = [];
        var v = t.length;
        var g = 0;
        var b = 128;
        var w = 72;
        if ((n = t.lastIndexOf("-")) < 0) {
          n = 0;
        }
        i = 0;
        for (; i < n; ++i) {
          if (t.charCodeAt(i) >= 128) {
            m("not-basic");
          }
          f.push(t.charCodeAt(i));
        }
        for (r = n > 0 ? n + 1 : 0; r < v;) {
          o = g;
          s = 1;
          a = 36;
          for (; r >= v && m("invalid-input"), ((u = (p = t.charCodeAt(r++)) - 48 < 10 ? p - 22 : p - 65 < 26 ? p - 65 : p - 97 < 26 ? p - 97 : 36) >= 36 || u > h((c - g) / s)) && m("overflow"), g += u * s, !(u < (l = a <= w ? 1 : a >= w + 26 ? 26 : a - w)); a += 36) {
            if (s > h(c / (d = 36 - l))) {
              m("overflow");
            }
            s *= d;
          }
          w = x(g - o, e = f.length + 1, o == 0);
          if (h(g / e) > c - b) {
            m("overflow");
          }
          b += h(g / e);
          g %= e;
          f.splice(g++, 0, b);
        }
        return y(f);
      }
      function C(t) {
        var e;
        var n;
        var i;
        var r;
        var o;
        var s;
        var a;
        var u;
        var l;
        var d;
        var p;
        var v;
        var g;
        var y;
        var N;
        var C = [];
        v = (t = b(t)).length;
        e = 128;
        n = 0;
        o = 72;
        s = 0;
        for (; s < v; ++s) {
          if ((p = t[s]) < 128) {
            C.push(f(p));
          }
        }
        i = r = C.length;
        if (r) {
          C.push("-");
        }
        while (i < v) {
          a = c;
          s = 0;
          for (; s < v; ++s) {
            if ((p = t[s]) >= e && p < a) {
              a = p;
            }
          }
          if (a - e > h((c - n) / (g = i + 1))) {
            m("overflow");
          }
          n += (a - e) * g;
          e = a;
          s = 0;
          for (; s < v; ++s) {
            if ((p = t[s]) < e && ++n > c) {
              m("overflow");
            }
            if (p == e) {
              u = n;
              l = 36;
              for (; !(u < (d = l <= o ? 1 : l >= o + 26 ? 26 : l - o)); l += 36) {
                N = u - d;
                y = 36 - d;
                C.push(f(w(d + N % y, 0)));
                u = h(N / y);
              }
              C.push(f(w(u, 0)));
              o = x(n, g, i == r);
              n = 0;
              ++i;
            }
          }
          ++n;
          ++e;
        }
        return C.join("");
      }
      a = {
        version: "1.4.1",
        ucs2: {
          decode: b,
          encode: y
        },
        decode: N,
        encode: C,
        toASCII: function (t) {
          return g(t, function (t) {
            if (l.test(t)) {
              return "xn--" + C(t);
            } else {
              return t;
            }
          });
        },
        toUnicode: function (t) {
          return g(t, function (t) {
            if (u.test(t)) {
              return N(t.slice(4).toLowerCase());
            } else {
              return t;
            }
          });
        }
      };
      if ((r = function () {
        return a;
      }.call(e, n, e, t)) !== undefined) {
        t.exports = r;
      }
    })();
  }).call(this, n(146)(t), n(50));
}, function (t, e) {
  t.exports = function (t) {
    if (!t.webpackPolyfill) {
      t.deprecate = function () {};
      t.paths = [];
      t.children ||= [];
      Object.defineProperty(t, "loaded", {
        enumerable: true,
        get: function () {
          return t.l;
        }
      });
      Object.defineProperty(t, "id", {
        enumerable: true,
        get: function () {
          return t.i;
        }
      });
      t.webpackPolyfill = 1;
    }
    return t;
  };
}, function (t, e, n) {
  var i = n(148);
  var r = n(53);
  if (r.ColorThief === undefined) {
    r.ColorThief = i;
  }
  t.exports = i;
}, function (t, e) {
  /*!
   * Color Thief v2.0
   * by Lokesh Dhakar - http://www.lokeshdhakar.com
   *
   * Thanks
   * ------
   * Nick Rabinowitz - For creating quantize.js.
   * John Schulz - For clean up and optimization. @JFSIII
   * Nathan Spady - For adding drag and drop support to the demo page.
   *
   * License
   * -------
   * Copyright 2011, 2015 Lokesh Dhakar
   * Released under the MIT license
   * https://raw.githubusercontent.com/lokesh/color-thief/master/LICENSE
   *
   */
  function n(t) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
    this.width = this.canvas.width = t.width;
    this.height = this.canvas.height = t.height;
    this.context.drawImage(t, 0, 0, this.width, this.height);
  }
  n.prototype.clear = function () {
    this.context.clearRect(0, 0, this.width, this.height);
  };
  n.prototype.update = function (t) {
    this.context.putImageData(t, 0, 0);
  };
  n.prototype.getPixelCount = function () {
    return this.width * this.height;
  };
  n.prototype.getImageData = function () {
    return this.context.getImageData(0, 0, this.width, this.height);
  };
  n.prototype.removeCanvas = function () {
    this.canvas.parentNode.removeChild(this.canvas);
  };
  function i() {}
  /*!
  * quantize.js Copyright 2008 Nick Rabinowitz.
  * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
  */
  /*!
   * Block below copied from Protovis: http://mbostock.github.com/protovis/
   * Copyright 2010 Stanford Visualization Group
   * Licensed under the BSD License: http://www.opensource.org/licenses/bsd-license.php
   */
  i.prototype.getColor = function (t, e) {
    return this.getPalette(t, 5, e)[0];
  };
  i.prototype.getPalette = function (t, e = 10, i) {
    if (i === undefined || i < 1) {
      i = 10;
    }
    var r;
    var s;
    var a;
    var c;
    var u = new n(t);
    var l = u.getImageData().data;
    for (var d = u.getPixelCount(), p = [], h = 0; d > h; h += i) {
      s = l[(r = h * 4) + 0];
      a = l[r + 1];
      c = l[r + 2];
      if (l[r + 3] >= 125) {
        if (!(s > 250) || !(a > 250) || !(c > 250)) {
          p.push([s, a, c]);
        }
      }
    }
    var f = o.quantize(p, e);
    var m = f ? f.palette() : null;
    u.removeCanvas();
    return m;
  };
  if (!r) {
    var r = {
      map: function (t, e) {
        var n = {};
        if (e) {
          return t.map(function (t, i) {
            n.index = i;
            return e.call(n, t);
          });
        } else {
          return t.slice();
        }
      },
      naturalOrder: function (t, e) {
        if (e > t) {
          return -1;
        } else if (t > e) {
          return 1;
        } else {
          return 0;
        }
      },
      sum: function (t, e) {
        var n = {};
        return t.reduce(e ? function (t, i, r) {
          n.index = r;
          return t + e.call(n, i);
        } : function (t, e) {
          return t + e;
        }, 0);
      },
      max: function (t, e) {
        return Math.max.apply(null, e ? r.map(t, e) : t);
      }
    };
  }
  var o = function () {
    function t(t, e, n) {
      return (t << c * 2) + (e << c) + n;
    }
    function e(t) {
      function e() {
        n.sort(t);
        i = true;
      }
      var n = [];
      var i = false;
      return {
        push: function (t) {
          n.push(t);
          i = false;
        },
        peek: function (t) {
          if (!i) {
            e();
          }
          if (t === undefined) {
            t = n.length - 1;
          }
          return n[t];
        },
        pop: function () {
          if (!i) {
            e();
          }
          return n.pop();
        },
        size: function () {
          return n.length;
        },
        map: function (t) {
          return n.map(t);
        },
        debug: function () {
          if (!i) {
            e();
          }
          return n;
        }
      };
    }
    function n(t, e, n, i, r, o, s) {
      var a = this;
      a.r1 = t;
      a.r2 = e;
      a.g1 = n;
      a.g2 = i;
      a.b1 = r;
      a.b2 = o;
      a.histo = s;
    }
    function i() {
      this.vboxes = new e(function (t, e) {
        return r.naturalOrder(t.vbox.count() * t.vbox.volume(), e.vbox.count() * e.vbox.volume());
      });
    }
    function o(e) {
      var n;
      var i;
      var r;
      var o;
      var s = new Array(1 << c * 3);
      e.forEach(function (e) {
        i = e[0] >> u;
        r = e[1] >> u;
        o = e[2] >> u;
        n = t(i, r, o);
        s[n] = (s[n] || 0) + 1;
      });
      return s;
    }
    function s(t, e) {
      var i;
      var r;
      var o;
      var s = 1000000;
      var a = 0;
      var c = 1000000;
      var l = 0;
      var d = 1000000;
      var p = 0;
      t.forEach(function (t) {
        i = t[0] >> u;
        r = t[1] >> u;
        o = t[2] >> u;
        if (s > i) {
          s = i;
        } else if (i > a) {
          a = i;
        }
        if (c > r) {
          c = r;
        } else if (r > l) {
          l = r;
        }
        if (d > o) {
          d = o;
        } else if (o > p) {
          p = o;
        }
      });
      return new n(s, a, c, l, d, p, e);
    }
    function a(e, n) {
      if (n.count()) {
        var i = n.r2 - n.r1 + 1;
        var o = n.g2 - n.g1 + 1;
        var s = n.b2 - n.b1 + 1;
        var a = r.max([i, o, s]);
        if (n.count() == 1) {
          return [n.copy()];
        }
        var c;
        var u;
        var l;
        var d;
        var p = 0;
        var h = [];
        var f = [];
        if (a == i) {
          for (c = n.r1; c <= n.r2; c++) {
            d = 0;
            u = n.g1;
            for (; u <= n.g2; u++) {
              for (l = n.b1; l <= n.b2; l++) {
                d += e[t(c, u, l)] || 0;
              }
            }
            p += d;
            h[c] = p;
          }
        } else if (a == o) {
          for (c = n.g1; c <= n.g2; c++) {
            d = 0;
            u = n.r1;
            for (; u <= n.r2; u++) {
              for (l = n.b1; l <= n.b2; l++) {
                d += e[t(u, c, l)] || 0;
              }
            }
            p += d;
            h[c] = p;
          }
        } else {
          for (c = n.b1; c <= n.b2; c++) {
            d = 0;
            u = n.r1;
            for (; u <= n.r2; u++) {
              for (l = n.g1; l <= n.g2; l++) {
                d += e[t(u, l, c)] || 0;
              }
            }
            p += d;
            h[c] = p;
          }
        }
        h.forEach(function (t, e) {
          f[e] = p - t;
        });
        return function (t) {
          var e;
          var i;
          var r;
          var o;
          var s;
          var a = t + "1";
          var u = t + "2";
          var l = 0;
          for (c = n[a]; c <= n[u]; c++) {
            if (h[c] > p / 2) {
              r = n.copy();
              o = n.copy();
              e = c - n[a];
              s = (i = n[u] - c) >= e ? Math.min(n[u] - 1, ~~(c + i / 2)) : Math.max(n[a], ~~(c - 1 - e / 2));
              while (!h[s]) {
                s++;
              }
              for (l = f[s]; !l && h[s - 1];) {
                l = f[--s];
              }
              r[u] = s;
              o[a] = r[u] + 1;
              return [r, o];
            }
          }
        }(a == i ? "r" : a == o ? "g" : "b");
      }
    }
    var c = 5;
    var u = 8 - c;
    var l = 1000;
    var d = 0.75;
    n.prototype = {
      volume: function (t) {
        var e = this;
        if (!e._volume || t) {
          e._volume = (e.r2 - e.r1 + 1) * (e.g2 - e.g1 + 1) * (e.b2 - e.b1 + 1);
        }
        return e._volume;
      },
      count: function (e) {
        var n = this;
        var i = n.histo;
        if (!n._count_set || e) {
          var r;
          var o;
          var s;
          var a = 0;
          for (r = n.r1; r <= n.r2; r++) {
            for (o = n.g1; o <= n.g2; o++) {
              for (s = n.b1; s <= n.b2; s++) {
                index = t(r, o, s);
                a += i[index] || 0;
              }
            }
          }
          n._count = a;
          n._count_set = true;
        }
        return n._count;
      },
      copy: function () {
        var t = this;
        return new n(t.r1, t.r2, t.g1, t.g2, t.b1, t.b2, t.histo);
      },
      avg: function (e) {
        var n = this;
        var i = n.histo;
        if (!n._avg || e) {
          var r;
          var o;
          var s;
          var a;
          var u = 0;
          var l = 1 << 8 - c;
          var d = 0;
          var p = 0;
          var h = 0;
          for (o = n.r1; o <= n.r2; o++) {
            for (s = n.g1; s <= n.g2; s++) {
              for (a = n.b1; a <= n.b2; a++) {
                u += r = i[t(o, s, a)] || 0;
                d += r * (o + 0.5) * l;
                p += r * (s + 0.5) * l;
                h += r * (a + 0.5) * l;
              }
            }
          }
          n._avg = u ? [~~(d / u), ~~(p / u), ~~(h / u)] : [~~(l * (n.r1 + n.r2 + 1) / 2), ~~(l * (n.g1 + n.g2 + 1) / 2), ~~(l * (n.b1 + n.b2 + 1) / 2)];
        }
        return n._avg;
      },
      contains: function (t) {
        var e = this;
        var n = t[0] >> u;
        gval = t[1] >> u;
        bval = t[2] >> u;
        return n >= e.r1 && n <= e.r2 && gval >= e.g1 && gval <= e.g2 && bval >= e.b1 && bval <= e.b2;
      }
    };
    i.prototype = {
      push: function (t) {
        this.vboxes.push({
          vbox: t,
          color: t.avg()
        });
      },
      palette: function () {
        return this.vboxes.map(function (t) {
          return t.color;
        });
      },
      size: function () {
        return this.vboxes.size();
      },
      map: function (t) {
        for (var e = this.vboxes, n = 0; n < e.size(); n++) {
          if (e.peek(n).vbox.contains(t)) {
            return e.peek(n).color;
          }
        }
        return this.nearest(t);
      },
      nearest: function (t) {
        var e;
        var n;
        var i;
        for (var r = this.vboxes, o = 0; o < r.size(); o++) {
          if (e > (n = Math.sqrt(Math.pow(t[0] - r.peek(o).color[0], 2) + Math.pow(t[1] - r.peek(o).color[1], 2) + Math.pow(t[2] - r.peek(o).color[2], 2))) || e === undefined) {
            e = n;
            i = r.peek(o).color;
          }
        }
        return i;
      },
      forcebw: function () {
        var t = this.vboxes;
        t.sort(function (t, e) {
          return r.naturalOrder(r.sum(t.color), r.sum(e.color));
        });
        var e = t[0].color;
        if (e[0] < 5 && e[1] < 5 && e[2] < 5) {
          t[0].color = [0, 0, 0];
        }
        var n = t.length - 1;
        var i = t[n].color;
        if (i[0] > 251 && i[1] > 251 && i[2] > 251) {
          t[n].color = [255, 255, 255];
        }
      }
    };
    return {
      quantize: function (t, n) {
        function c(t, e) {
          var n;
          for (var i = 1, r = 0; l > r;) {
            if ((n = t.pop()).count()) {
              var o = a(u, n);
              var s = o[0];
              var c = o[1];
              if (!s) {
                return;
              }
              t.push(s);
              if (c) {
                t.push(c);
                i++;
              }
              if (i >= e) {
                return;
              }
              if (r++ > l) {
                return;
              }
            } else {
              t.push(n);
              r++;
            }
          }
        }
        if (!t.length || n < 2 || n > 256) {
          return false;
        }
        var u = o(t);
        u.forEach(function () {
          0;
        });
        var p = s(t, u);
        var h = new e(function (t, e) {
          return r.naturalOrder(t.count(), e.count());
        });
        h.push(p);
        c(h, d * n);
        var f = new e(function (t, e) {
          return r.naturalOrder(t.count() * t.volume(), e.count() * e.volume());
        });
        for (; h.size();) {
          f.push(h.pop());
        }
        c(f, n - f.size());
        var m = new i();
        for (; f.size();) {
          m.push(f.pop());
        }
        return m;
      }
    };
  }();
  t.exports = i;
}, function (t, e) {},, function (t, e, n) {
  "use strict";

  n.r(e);
  n.d(e, "Extend", function () {
    return i.a;
  });
  n.d(e, "app", function () {
    return je;
  });
  n.d(e, "compat", function () {
    return Ie;
  });
  var i = n(102);
  n(144);
  n(147);
  var r = n(92);
  var o = n(0);
  var s = n(52);
  var a = function () {
    function t(t) {
      this.stack = [];
    }
    var e = t.prototype;
    e.getCurrent = function () {
      return this.stack[this.stack.length - 1];
    };
    e.getPrevious = function () {
      return this.stack[this.stack.length - 2];
    };
    e.push = function (t, e, n = m.route.get()) {
      var i = this.stack[this.stack.length - 2];
      if (i && i.name === t) {
        this.stack.pop();
      }
      var r = this.getCurrent();
      if (r && r.name === t) {
        Object.assign(r, {
          url: n,
          title: e
        });
      } else {
        this.stack.push({
          name: t,
          url: n,
          title: e
        });
      }
    };
    e.canGoBack = function () {
      return this.stack.length > 1;
    };
    e.back = function () {
      if (!this.canGoBack()) {
        return this.home();
      }
      this.stack.pop();
      m.route.set(this.getCurrent().url);
    };
    e.backUrl = function () {
      return this.stack[this.stack.length - 2].url;
    };
    e.home = function () {
      this.stack.splice(0);
      Object(s.a)("/");
    };
    return t;
  }();
  var c = function () {
    function t(t) {
      this.pinnedKey = "panePinned";
      this.$element = $(t);
      this.pinned = localStorage.getItem(this.pinnedKey) === "true";
      this.active = false;
      this.showing = false;
      this.render();
    }
    var e = t.prototype;
    e.enable = function () {
      this.active = true;
      this.render();
    };
    e.disable = function () {
      this.active = false;
      this.showing = false;
      this.render();
    };
    e.show = function () {
      clearTimeout(this.hideTimeout);
      this.showing = true;
      this.render();
    };
    e.hide = function () {
      this.showing = false;
      this.render();
    };
    e.onmouseleave = function () {
      this.hideTimeout = setTimeout(this.hide.bind(this), 250);
    };
    e.togglePinned = function () {
      this.pinned = !this.pinned;
      localStorage.setItem(this.pinnedKey, this.pinned ? "true" : "false");
      this.render();
    };
    e.render = function () {
      this.$element.toggleClass("panePinned", this.pinned).toggleClass("hasPane", this.active).toggleClass("paneShowing", this.showing);
    };
    return t;
  }();
  var u = n(30);
  var l = n(4);
  var d = n(3);
  var p = n(6);
  var h = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.view = function () {
      return m("header", {
        className: "Hero DiscussionHero"
      }, m("div", {
        className: "container"
      }, m("ul", {
        className: "DiscussionHero-items"
      }, Object(p.a)(this.items().toArray()))));
    };
    n.items = function () {
      var t = new l.a();
      var e = this.attrs.discussion;
      var n = e.badges().toArray();
      if (n.length) {
        t.add("badges", m("ul", {
          className: "DiscussionHero-badges badges"
        }, Object(p.a)(n)), 10);
      }
      t.add("title", m("h2", {
        className: "DiscussionHero-title"
      }, e.title()));
      return t;
    };
    return e;
  }(d.a);
  var f = n(12);
  var v = n(18);
  var g = n(33);
  var b = n(5);
  var y = n(25);
  var w = n(82);
  var x = n(17);
  var N = n(43);
  var C = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    e.prototype.view = function () {
      var t = this.attrs.discussion;
      var e = this.attrs.lastPost && t.replyCount();
      var n = t[e ? "lastPostedUser" : "user"]();
      var i = t[e ? "lastPostedAt" : "createdAt"]();
      return m("span", null, e ? Object(b.a)("fas fa-reply") : "", " ", app.translator.trans("core.forum.discussion_list." + (e ? "replied" : "started") + "_text", {
        user: n,
        ago: Object(N.a)(i)
      }));
    };
    return e;
  }(d.a);
  var T = n(54);
  var S = n(15);
  var O = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.handler = function () {
      return this.attrs.when() || undefined;
    };
    n.oncreate = function (e) {
      t.prototype.oncreate.call(this, e);
      this.boundHandler = this.handler.bind(this);
      $(window).on("beforeunload", this.boundHandler);
    };
    n.onremove = function (e) {
      t.prototype.onremove.call(this, e);
      $(window).off("beforeunload", this.boundHandler);
    };
    n.view = function (t) {
      return t.children[0];
    };
    return e;
  }(d.a);
  var k = n(83);
  var j = n(7);
  var A = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      var n = this;
      t.prototype.oninit.call(this, e);
      this.composer = this.attrs.composer;
      this.loading = false;
      if (this.attrs.confirmExit) {
        this.composer.preventClosingWhen(function () {
          return n.hasChanges();
        }, this.attrs.confirmExit);
      }
      this.composer.fields.content(this.attrs.originalContent || "");
    };
    n.view = function () {
      return m(O, {
        when: this.hasChanges.bind(this)
      }, m("div", {
        className: "ComposerBody " + (this.attrs.className || "")
      }, Object(v.a)(this.attrs.user, {
        className: "ComposerBody-avatar"
      }), m("div", {
        className: "ComposerBody-content"
      }, m("ul", {
        className: "ComposerBody-header"
      }, Object(p.a)(this.headerItems().toArray())), m("div", {
        className: "ComposerBody-editor"
      }, k.a.component({
        submitLabel: this.attrs.submitLabel,
        placeholder: this.attrs.placeholder,
        disabled: this.loading || this.attrs.disabled,
        composer: this.composer,
        preview: this.jumpToPreview && this.jumpToPreview.bind(this),
        onchange: this.composer.fields.content,
        onsubmit: this.onsubmit.bind(this),
        value: this.composer.fields.content()
      }))), m(S.a, {
        display: "unset",
        containerClassName: Object(j.a)("ComposerBody-loading", this.loading && "active"),
        size: "large"
      })));
    };
    n.hasChanges = function () {
      var t = this.composer.fields.content();
      return t && t !== this.attrs.originalContent;
    };
    n.headerItems = function () {
      return new l.a();
    };
    n.onsubmit = function () {};
    n.loaded = function () {
      this.loading = false;
      m.redraw();
    };
    return e;
  }(d.a);
  var E = n(2);
  var P = n(8);
  function _(t) {
    if (app.composer.isFullScreen()) {
      app.composer.minimize();
      t.stopPropagation();
    }
  }
  var D = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    e.initAttrs = function (e) {
      t.initAttrs.call(this, e);
      e.placeholder = e.placeholder || Object(P.a)(app.translator.trans("core.forum.composer_reply.body_placeholder"));
      e.submitLabel = e.submitLabel || app.translator.trans("core.forum.composer_reply.submit_button");
      e.confirmExit = e.confirmExit || Object(P.a)(app.translator.trans("core.forum.composer_reply.discard_confirmation"));
    };
    var n = e.prototype;
    n.headerItems = function () {
      var e = t.prototype.headerItems.call(this);
      var n = this.attrs.discussion;
      e.add("title", m("h3", null, Object(b.a)("fas fa-reply"), " ", m(f.a, {
        href: app.route.discussion(n),
        onclick: _
      }, n.title())));
      return e;
    };
    n.jumpToPreview = function (t) {
      _(t);
      m.route.set(app.route.discussion(this.attrs.discussion, "reply"));
    };
    n.data = function () {
      return {
        content: this.composer.fields.content(),
        relationships: {
          discussion: this.attrs.discussion
        }
      };
    };
    n.onsubmit = function () {
      var t = this;
      var e = this.attrs.discussion;
      this.loading = true;
      m.redraw();
      var n = this.data();
      app.store.createRecord("posts").save(n).then(function (n) {
        if (app.viewingDiscussion(e)) {
          var i = app.current.get("stream");
          i.update().then(function () {
            return i.goToNumber(n.number());
          });
        } else {
          var r;
          var o = E.a.component({
            className: "Button Button--link",
            onclick: function () {
              m.route.set(app.route.post(n));
              app.alerts.dismiss(r);
            }
          }, app.translator.trans("core.forum.composer_reply.view_button"));
          r = app.alerts.show({
            type: "success",
            controls: [o]
          }, app.translator.trans("core.forum.composer_reply.posted_message"));
        }
        t.composer.hide();
      }, this.loaded.bind(this));
    };
    return e;
  }(A);
  var I = n(13);
  var M = n(9);
  var L = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.email = Object(M.a)(this.attrs.email || "");
      this.success = false;
    };
    n.className = function () {
      return "ForgotPasswordModal Modal--small";
    };
    n.title = function () {
      return app.translator.trans("core.forum.forgot_password.title");
    };
    n.content = function () {
      if (this.success) {
        return m("div", {
          className: "Modal-body"
        }, m("div", {
          className: "Form Form--centered"
        }, m("p", {
          className: "helpText"
        }, app.translator.trans("core.forum.forgot_password.email_sent_message")), m("div", {
          className: "Form-group"
        }, m(E.a, {
          className: "Button Button--primary Button--block",
          onclick: this.hide.bind(this)
        }, app.translator.trans("core.forum.forgot_password.dismiss_button")))));
      } else {
        return m("div", {
          className: "Modal-body"
        }, m("div", {
          className: "Form Form--centered"
        }, m("p", {
          className: "helpText"
        }, app.translator.trans("core.forum.forgot_password.text")), m("div", {
          className: "Form-group"
        }, m("input", {
          className: "FormControl",
          name: "email",
          type: "email",
          placeholder: Object(P.a)(app.translator.trans("core.forum.forgot_password.email_placeholder")),
          bidi: this.email,
          disabled: this.loading
        })), m("div", {
          className: "Form-group"
        }, E.a.component({
          className: "Button Button--primary Button--block",
          type: "submit",
          loading: this.loading
        }, app.translator.trans("core.forum.forgot_password.submit_button")))));
      }
    };
    n.onsubmit = function (t) {
      var e = this;
      t.preventDefault();
      this.loading = true;
      app.request({
        method: "POST",
        url: app.forum.attribute("apiUrl") + "/forgot",
        body: {
          email: this.email()
        },
        errorHandler: this.onerror.bind(this)
      }).then(function () {
        e.success = true;
        e.alert = null;
      }).catch(function () {}).then(this.loaded.bind(this));
    };
    n.onerror = function (e) {
      if (e.status === 404) {
        e.alert.content = app.translator.trans("core.forum.forgot_password.not_found_message");
      }
      t.prototype.onerror.call(this, e);
    };
    return e;
  }(I.a);
  var R = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.view = function () {
      return m("div", {
        className: "LogInButtons"
      }, this.items().toArray());
    };
    n.items = function () {
      return new l.a();
    };
    return e;
  }(d.a);
  var H = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.username = Object(M.a)(this.attrs.username || "");
      this.email = Object(M.a)(this.attrs.email || "");
      this.password = Object(M.a)(this.attrs.password || "");
    };
    n.className = function () {
      return "Modal--small SignUpModal";
    };
    n.title = function () {
      return app.translator.trans("core.forum.sign_up.title");
    };
    n.content = function () {
      return [m("div", {
        className: "Modal-body"
      }, this.body()), m("div", {
        className: "Modal-footer"
      }, this.footer())];
    };
    n.isProvided = function (t) {
      return this.attrs.provided && this.attrs.provided.indexOf(t) !== -1;
    };
    n.body = function () {
      return [this.attrs.token ? "" : m(R, null), m("div", {
        className: "Form Form--centered"
      }, this.fields().toArray())];
    };
    n.fields = function () {
      var t = new l.a();
      t.add("username", m("div", {
        className: "Form-group"
      }, m("input", {
        className: "FormControl",
        name: "username",
        type: "text",
        placeholder: Object(P.a)(app.translator.trans("core.forum.sign_up.username_placeholder")),
        bidi: this.username,
        disabled: this.loading || this.isProvided("username")
      })), 30);
      t.add("email", m("div", {
        className: "Form-group"
      }, m("input", {
        className: "FormControl",
        name: "email",
        type: "email",
        placeholder: Object(P.a)(app.translator.trans("core.forum.sign_up.email_placeholder")),
        bidi: this.email,
        disabled: this.loading || this.isProvided("email")
      })), 20);
      if (!this.attrs.token) {
        t.add("password", m("div", {
          className: "Form-group"
        }, m("input", {
          className: "FormControl",
          name: "password",
          type: "password",
          placeholder: Object(P.a)(app.translator.trans("core.forum.sign_up.password_placeholder")),
          bidi: this.password,
          disabled: this.loading
        })), 10);
      }
      t.add("submit", m("div", {
        className: "Form-group"
      }, m(E.a, {
        className: "Button Button--primary Button--block",
        type: "submit",
        loading: this.loading
      }, app.translator.trans("core.forum.sign_up.submit_button"))), -10);
      return t;
    };
    n.footer = function () {
      return [m("p", {
        className: "SignUpModal-logIn"
      }, app.translator.trans("core.forum.sign_up.log_in_text", {
        a: m("a", {
          onclick: this.logIn.bind(this)
        })
      }))];
    };
    n.logIn = function () {
      var t = {
        identification: this.email() || this.username(),
        password: this.password()
      };
      app.modal.show(B, t);
    };
    n.onready = function () {
      if (this.attrs.username && !this.attrs.email) {
        this.$("[name=email]").select();
      } else {
        this.$("[name=username]").select();
      }
    };
    n.onsubmit = function (t) {
      t.preventDefault();
      this.loading = true;
      var e = this.submitData();
      app.request({
        url: app.forum.attribute("baseUrl") + "/register",
        method: "POST",
        body: e,
        errorHandler: this.onerror.bind(this)
      }).then(function () {
        return window.location.reload();
      }, this.loaded.bind(this));
    };
    n.submitData = function () {
      var t = {
        username: this.username(),
        email: this.email()
      };
      if (this.attrs.token) {
        t.token = this.attrs.token;
      } else {
        t.password = this.password();
      }
      return t;
    };
    return e;
  }(I.a);
  var B = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.identification = Object(M.a)(this.attrs.identification || "");
      this.password = Object(M.a)(this.attrs.password || "");
      this.remember = Object(M.a)(!!this.attrs.remember);
    };
    n.className = function () {
      return "LogInModal Modal--small";
    };
    n.title = function () {
      return app.translator.trans("core.forum.log_in.title");
    };
    n.content = function () {
      return [m("div", {
        className: "Modal-body"
      }, this.body()), m("div", {
        className: "Modal-footer"
      }, this.footer())];
    };
    n.body = function () {
      return [m(R, null), m("div", {
        className: "Form Form--centered"
      }, this.fields().toArray())];
    };
    n.fields = function () {
      var t = new l.a();
      t.add("identification", m("div", {
        className: "Form-group"
      }, m("input", {
        className: "FormControl",
        name: "identification",
        type: "text",
        placeholder: Object(P.a)(app.translator.trans("core.forum.log_in.username_or_email_placeholder")),
        bidi: this.identification,
        disabled: this.loading
      })), 30);
      t.add("password", m("div", {
        className: "Form-group"
      }, m("input", {
        className: "FormControl",
        name: "password",
        type: "password",
        placeholder: Object(P.a)(app.translator.trans("core.forum.log_in.password_placeholder")),
        bidi: this.password,
        disabled: this.loading
      })), 20);
      t.add("remember", m("div", {
        className: "Form-group"
      }, m("div", null, m("label", {
        className: "checkbox"
      }, m("input", {
        type: "checkbox",
        bidi: this.remember,
        disabled: this.loading
      }), app.translator.trans("core.forum.log_in.remember_me_label")))), 10);
      t.add("submit", m("div", {
        className: "Form-group"
      }, E.a.component({
        className: "Button Button--primary Button--block",
        type: "submit",
        loading: this.loading
      }, app.translator.trans("core.forum.log_in.submit_button"))), -10);
      return t;
    };
    n.footer = function () {
      return [m("p", {
        className: "LogInModal-forgotPassword"
      }, m("a", {
        onclick: this.forgotPassword.bind(this)
      }, app.translator.trans("core.forum.log_in.forgot_password_link"))), app.forum.attribute("allowSignUp") ? m("p", {
        className: "LogInModal-signUp"
      }, app.translator.trans("core.forum.log_in.sign_up_text", {
        a: m("a", {
          onclick: this.signUp.bind(this)
        })
      })) : ""];
    };
    n.forgotPassword = function () {
      var t = this.identification();
      var e = t.indexOf("@") !== -1 ? {
        email: t
      } : undefined;
      app.modal.show(L, e);
    };
    n.signUp = function () {
      var t = {
        password: this.password()
      };
      var e = this.identification();
      t[e.indexOf("@") !== -1 ? "email" : "username"] = e;
      app.modal.show(H, t);
    };
    n.onready = function () {
      this.$("[name=" + (this.identification() ? "password" : "identification") + "]").select();
    };
    n.onsubmit = function (t) {
      t.preventDefault();
      this.loading = true;
      var e = this.identification();
      var n = this.password();
      var i = this.remember();
      app.session.login({
        identification: e,
        password: n,
        remember: i
      }, {
        errorHandler: this.onerror.bind(this)
      }).then(function () {
        return window.location.reload();
      }, this.loaded.bind(this));
    };
    n.onerror = function (e) {
      if (e.status === 401) {
        e.alert.content = app.translator.trans("core.forum.log_in.invalid_login_message");
      }
      t.prototype.onerror.call(this, e);
    };
    return e;
  }(I.a);
  var U = n(21);
  var F = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.discussion = this.attrs.discussion;
      this.currentTitle = this.attrs.currentTitle;
      this.newTitle = Object(M.a)(this.currentTitle);
    };
    n.className = function () {
      return "RenameDiscussionModal Modal--small";
    };
    n.title = function () {
      return app.translator.trans("core.forum.rename_discussion.title");
    };
    n.content = function () {
      return m("div", {
        className: "Modal-body"
      }, m("div", {
        className: "Form Form--centered"
      }, m("div", {
        className: "Form-group"
      }, m("input", {
        className: "FormControl",
        bidi: this.newTitle,
        type: "text"
      })), m("div", {
        className: "Form-group"
      }, E.a.component({
        className: "Button Button--primary Button--block",
        type: "submit",
        loading: this.loading
      }, app.translator.trans("core.forum.rename_discussion.submit_button")))));
    };
    n.onsubmit = function (t) {
      var e = this;
      t.preventDefault();
      this.loading = true;
      var n = this.newTitle();
      var i = this.currentTitle;
      if (n && n !== i) {
        return this.discussion.save({
          title: n
        }).then(function () {
          if (app.viewingDiscussion(e.discussion)) {
            app.current.get("stream").update();
          }
          m.redraw();
          e.hide();
        }).catch(function () {
          e.loading = false;
          m.redraw();
        });
      }
      this.hide();
    };
    return e;
  }(I.a);
  var q = {
    controls: function (t, e) {
      var n = this;
      var i = new l.a();
      ["user", "moderation", "destructive"].forEach(function (r) {
        var o = n[r + "Controls"](t, e).toArray();
        if (o.length) {
          o.forEach(function (t) {
            return i.add(t.itemName, t);
          });
          i.add(r + "Separator", U.a.component());
        }
      });
      return i;
    },
    userControls: function (t, e) {
      var n = this;
      var i = new l.a();
      if (e instanceof pt) {
        i.add("reply", !app.session.user || t.canReply() ? E.a.component({
          icon: "fas fa-reply",
          onclick: function () {
            return n.replyAction.bind(t)(true, false).catch(function () {});
          }
        }, app.translator.trans(app.session.user ? "core.forum.discussion_controls.reply_button" : "core.forum.discussion_controls.log_in_to_reply_button")) : E.a.component({
          icon: "fas fa-reply",
          className: "disabled",
          title: app.translator.trans("core.forum.discussion_controls.cannot_reply_text")
        }, app.translator.trans("core.forum.discussion_controls.cannot_reply_button")));
      }
      return i;
    },
    moderationControls: function (t) {
      var e = new l.a();
      if (t.canRename()) {
        e.add("rename", E.a.component({
          icon: "fas fa-pencil-alt",
          onclick: this.renameAction.bind(t)
        }, app.translator.trans("core.forum.discussion_controls.rename_button")));
      }
      return e;
    },
    destructiveControls: function (t) {
      var e = new l.a();
      if (t.isHidden()) {
        if (t.canHide()) {
          e.add("restore", E.a.component({
            icon: "fas fa-reply",
            onclick: this.restoreAction.bind(t)
          }, app.translator.trans("core.forum.discussion_controls.restore_button")));
        }
        if (t.canDelete()) {
          e.add("delete", E.a.component({
            icon: "fas fa-times",
            onclick: this.deleteAction.bind(t)
          }, app.translator.trans("core.forum.discussion_controls.delete_forever_button")));
        }
      } else if (t.canHide()) {
        e.add("hide", E.a.component({
          icon: "far fa-trash-alt",
          onclick: this.hideAction.bind(t)
        }, app.translator.trans("core.forum.discussion_controls.delete_button")));
      }
      return e;
    },
    replyAction: function (t, e) {
      var n = this;
      return new Promise(function (i, r) {
        if (app.session.user) {
          if (n.canReply()) {
            if (!app.composer.composingReplyTo(n) || !!e) {
              app.composer.load(D, {
                user: app.session.user,
                discussion: n
              });
            }
            app.composer.show();
            if (t && app.viewingDiscussion(n) && !app.composer.isFullScreen()) {
              app.current.get("stream").goToNumber("reply");
            }
            return i(app.composer);
          } else {
            return r();
          }
        } else {
          app.modal.show(B);
          return r();
        }
      });
    },
    hideAction: function () {
      this.pushAttributes({
        hiddenAt: new Date(),
        hiddenUser: app.session.user
      });
      return this.save({
        isHidden: true
      });
    },
    restoreAction: function () {
      this.pushAttributes({
        hiddenAt: null,
        hiddenUser: null
      });
      return this.save({
        isHidden: false
      });
    },
    deleteAction: function () {
      var t = this;
      if (confirm(Object(P.a)(app.translator.trans("core.forum.discussion_controls.delete_confirmation")))) {
        if (app.viewingDiscussion(this)) {
          app.history.back();
        }
        return this.delete().then(function () {
          return app.discussions.removeDiscussion(t);
        });
      }
    },
    renameAction: function () {
      return app.modal.show(F, {
        currentTitle: this.title(),
        discussion: this
      });
    }
  };
  function z(t) {
    var e;
    var n;
    var i;
    var r;
    var o = $(t);
    var s = false;
    var a = false;
    var c = 0;
    function u(t, e = {}) {
      e.duration = e.duration || "fast";
      e.step = function (t) {
        $(this).css("transform", "translate(" + t + "px, 0)");
      };
      o.find(".Slidable-content").animate({
        "background-position-x": t
      }, e);
    }
    function l() {
      u(0, {
        complete: function () {
          o.removeClass("sliding");
          e.hide();
          n.hide();
          a = false;
        }
      });
    }
    o.find(".Slidable-content").on("touchstart", function (t) {
      e = o.find(".Slidable-underneath--left:not(.disabled)");
      n = o.find(".Slidable-underneath--right:not(.disabled)");
      i = t.originalEvent.targetTouches[0].clientX;
      r = t.originalEvent.targetTouches[0].clientY;
      s = true;
      c = 0;
    }).on("touchmove", function (t) {
      var u = t.originalEvent.targetTouches[0].clientX;
      var l = t.originalEvent.targetTouches[0].clientY;
      if (s && Math.abs(u - i) > Math.abs(l - r)) {
        a = true;
      }
      s = false;
      if (a) {
        c = u - i;
        function d(t, e) {
          if (t.length) {
            var n = e === "left" ? c > 0 : c < 0;
            if (n && t.hasClass("Slidable-underneath--elastic")) {
              c -= c * 0.5;
            }
            t.toggle(n);
            var i = Math.max(0, Math.min(1, (Math.abs(c) - 25) / 50));
            t.find(".icon").css("transform", "scale(" + i + ")");
          } else {
            c = Math[e === "left" ? "min" : "max"](0, c);
          }
        }
        d(e, "left");
        d(n, "right");
        $(this).css("transform", "translate(" + c + "px, 0)");
        $(this).css("background-position-x", c + "px");
        o.toggleClass("sliding", !!c);
        t.preventDefault();
      }
    }).on("touchend", function () {
      function t(t) {
        t.click();
        if (t.hasClass("Slidable-underneath--elastic")) {
          l();
        } else {
          u((c > 0 ? 1 : -1) * o.width());
        }
      }
      if (n.length && c < -50) {
        t(n);
      } else if (e.length && c > 50) {
        t(e);
      } else {
        l();
      }
      s = false;
      a = false;
    });
    return {
      reset: l
    };
  }
  var W = n(84);
  var V = n(23);
  var Y = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      var n = this;
      t.prototype.oninit.call(this, e);
      this.subtree = new T.a(function () {
        return n.attrs.discussion.freshness;
      }, function () {
        var t = app.session.user && app.session.user.markedAllAsReadAt();
        return t && t.getTime();
      }, function () {
        return n.active();
      });
    };
    n.elementAttrs = function () {
      return {
        className: Object(j.a)(["DiscussionListItem", this.active() ? "active" : "", this.attrs.discussion.isHidden() ? "DiscussionListItem--hidden" : "", "ontouchstart" in window ? "Slidable" : ""])
      };
    };
    n.view = function () {
      var t = this.attrs.discussion;
      var e = t.user();
      var n = t.isUnread();
      var i = t.isRead();
      var r = !this.showRepliesCount() && n;
      var o = 0;
      var s = q.controls(t, this).toArray();
      var a = this.elementAttrs();
      if (this.attrs.params.q) {
        var c = t.mostRelevantPost();
        if (c) {
          o = c.number();
        }
        var u = Object(W.a)(this.attrs.params.q);
        this.highlightRegExp = new RegExp(u + "|" + u.trim().replace(/\s+/g, "|"), "gi");
      } else {
        o = Math.min(t.lastPostNumber(), (t.lastReadPostNumber() || 0) + 1);
      }
      return m("div", a, s.length ? x.a.component({
        icon: "fas fa-ellipsis-v",
        className: "DiscussionListItem-controls",
        buttonClassName: "Button Button--icon Button--flat Slidable-underneath Slidable-underneath--right",
        accessibleToggleLabel: app.translator.trans("core.forum.discussion_controls.toggle_dropdown_accessible_label")
      }, s) : "", m("span", {
        className: "Slidable-underneath Slidable-underneath--left Slidable-underneath--elastic" + (n ? "" : " disabled"),
        onclick: this.markAsRead.bind(this)
      }, Object(b.a)("fas fa-check")), m("div", {
        className: "DiscussionListItem-content Slidable-content" + (n ? " unread" : "") + (i ? " read" : "")
      }, m(V.a, {
        text: app.translator.trans("core.forum.discussion_list.started_text", {
          user: e,
          ago: Object(y.a)(t.createdAt())
        }),
        position: "right"
      }, m(f.a, {
        className: "DiscussionListItem-author",
        href: e ? app.route.user(e) : "#"
      }, Object(v.a)(e, {
        title: ""
      }))), m("ul", {
        className: "DiscussionListItem-badges badges"
      }, Object(p.a)(t.badges().toArray())), m(f.a, {
        href: app.route.discussion(t, o),
        className: "DiscussionListItem-main"
      }, m("h3", {
        className: "DiscussionListItem-title"
      }, Object(g.a)(t.title(), this.highlightRegExp)), m("ul", {
        className: "DiscussionListItem-info"
      }, Object(p.a)(this.infoItems().toArray()))), m("span", {
        tabindex: "0",
        role: "button",
        className: "DiscussionListItem-count",
        onclick: this.markAsRead.bind(this),
        title: r ? app.translator.trans("core.forum.discussion_list.mark_as_read_tooltip") : ""
      }, Object(w.a)(t[r ? "unreadCount" : "replyCount"]()))));
    };
    n.oncreate = function (e) {
      t.prototype.oncreate.call(this, e);
      if ("ontouchstart" in window) {
        var n = z(this.$());
        this.$(".DiscussionListItem-controls").on("hidden.bs.dropdown", function () {
          return n.reset();
        });
      }
    };
    n.onbeforeupdate = function (e, n) {
      t.prototype.onbeforeupdate.call(this, e, n);
      return this.subtree.needsRebuild();
    };
    n.active = function () {
      return app.current.matches(pt, {
        discussion: this.attrs.discussion
      });
    };
    n.showFirstPost = function () {
      return ["newest", "oldest"].indexOf(this.attrs.params.sort) !== -1;
    };
    n.showRepliesCount = function () {
      return this.attrs.params.sort === "replies";
    };
    n.markAsRead = function () {
      var t = this.attrs.discussion;
      if (t.isUnread()) {
        t.save({
          lastReadPostNumber: t.lastPostNumber()
        });
        m.redraw();
      }
    };
    n.infoItems = function () {
      var t = new l.a();
      if (this.attrs.params.q) {
        var e = this.attrs.discussion.mostRelevantPost() || this.attrs.discussion.firstPost();
        if (e && e.contentType() === "comment") {
          var n = Object(g.a)(e.contentPlain(), this.highlightRegExp, 175);
          t.add("excerpt", n, -100);
        }
      } else {
        t.add("terminalPost", C.component({
          discussion: this.attrs.discussion,
          lastPost: !this.showFirstPost()
        }));
      }
      return t;
    };
    return e;
  }(d.a);
  var G = n(55);
  var K = n(39);
  var X = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    e.prototype.view = function () {
      var t;
      var e = this.attrs.state;
      var n = e.getParams();
      if (e.isInitialLoading() || e.isLoadingNext()) {
        t = m(S.a, null);
      } else if (e.hasNext()) {
        t = E.a.component({
          className: "Button",
          onclick: e.loadNext.bind(e)
        }, app.translator.trans("core.forum.discussion_list.load_more_button"));
      }
      if (e.isEmpty()) {
        var i = app.translator.trans("core.forum.discussion_list.empty_text");
        return m("div", {
          className: "DiscussionList"
        }, G.a.component({
          text: i
        }));
      }
      return m("div", {
        className: "DiscussionList" + (e.isSearchResults() ? " DiscussionList--searchResults" : "")
      }, m("ul", {
        className: "DiscussionList-discussions"
      }, e.getPages().map(function (t) {
        return t.items.map(function (t) {
          return m("li", {
            key: t.id(),
            "data-id": t.id()
          }, Y.component({
            discussion: t,
            params: n
          }));
        });
      })), m("div", {
        className: "DiscussionList-loadMore"
      }, t));
    };
    return e;
  }(d.a);
  function J(t) {
    if (t.pageX < 10) {
      app.pane.show();
    }
  }
  var Q = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.view = function () {
      if (this.attrs.state.hasItems()) {
        return m("div", {
          className: "DiscussionPage-list"
        }, this.enoughSpace() && m(X, {
          state: this.attrs.state
        }));
      }
    };
    n.oncreate = function (e) {
      t.prototype.oncreate.call(this, e);
      var n = $(e.dom);
      var i = app.pane;
      n.hover(i.show.bind(i), i.onmouseleave.bind(i));
      $(document).on("mousemove", J);
      if (app.previous.matches(pt)) {
        var r = app.cache.discussionListPaneScrollTop || 0;
        n.scrollTop(r);
      } else {
        var o = n.find(".DiscussionListItem.active");
        if (o.length) {
          var s = n.offset().top;
          var a = s + n.outerHeight();
          var c = o.offset().top;
          var u = c + o.outerHeight();
          if (c < s || u > a) {
            n.scrollTop(n.scrollTop() - s + c);
          }
        }
      }
    };
    n.onremove = function (t) {
      app.cache.discussionListPaneScrollTop = $(t.dom).scrollTop();
      $(document).off("mousemove", J);
    };
    n.enoughSpace = function () {
      return !$(".App-navigation").is(":visible");
    };
    return e;
  }(d.a);
  var Z = n(35);
  var tt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    e.prototype.view = function () {
      return m("div", {
        className: "Post CommentPost LoadingPost"
      }, m("header", {
        className: "Post-header"
      }, Object(v.a)(null, {
        className: "PostUser-avatar"
      }), m("div", {
        className: "fakeText"
      })), m("div", {
        className: "Post-body"
      }, m("div", {
        className: "fakeText"
      }), m("div", {
        className: "fakeText"
      }), m("div", {
        className: "fakeText"
      })));
    };
    return e;
  }(d.a);
  var et = n(19);
  var nt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    e.initAttrs = function (t) {
      t.className = t.className || "";
      t.surround = t.surround || function (t) {
        return t();
      };
    };
    var n = e.prototype;
    n.view = function () {
      return m("div", {
        className: this.attrs.className
      });
    };
    n.oncreate = function (e) {
      var n;
      var i = this;
      t.prototype.oncreate.call(this, e);
      function r() {
        if (i.attrs.composer.isVisible()) {
          var t = i.attrs.composer.fields.content();
          if (n !== t) {
            n = t;
            i.attrs.surround(function () {
              return s9e.TextFormatter.preview(n || "", e.dom);
            });
          }
        }
      }
      r();
      this.updateInterval = setInterval(r, 50);
    };
    n.onremove = function (e) {
      t.prototype.onremove.call(this, e);
      clearInterval(this.updateInterval);
    };
    return e;
  }(d.a);
  var it = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.view = function () {
      var t = this;
      if (app.composer.composingReplyTo(this.attrs.discussion)) {
        return m("article", {
          className: "Post CommentPost editing"
        }, m("header", {
          className: "Post-header"
        }, m("div", {
          className: "PostUser"
        }, m("h3", null, Object(v.a)(app.session.user, {
          className: "PostUser-avatar"
        }), Object(et.a)(app.session.user)), m("ul", {
          className: "PostUser-badges badges"
        }, Object(p.a)(app.session.user.badges().toArray())))), m(nt, {
          className: "Post-body",
          composer: app.composer,
          surround: this.anchorPreview.bind(this)
        }));
      }
      return m("article", {
        className: "Post ReplyPlaceholder",
        onclick: function () {
          q.replyAction.call(t.attrs.discussion, true).catch(function () {});
        }
      }, m("header", {
        className: "Post-header"
      }, Object(v.a)(app.session.user, {
        className: "PostUser-avatar"
      }), " ", app.translator.trans("core.forum.post_stream.reply_placeholder")));
    };
    n.anchorPreview = function (t) {
      var e = $(window).scrollTop() + $(window).height() >= $(document).height();
      t();
      if (e) {
        $(window).scrollTop($(document).height());
      }
    };
    return e;
  }(d.a);
  var rt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.discussion = this.attrs.discussion;
      this.stream = this.attrs.stream;
      this.scrollListener = new Z.a(this.onscroll.bind(this));
    };
    n.view = function () {
      var t;
      var e = this;
      var n = this.stream.viewingEnd();
      var i = this.stream.posts();
      var r = this.discussion.postIds();
      function o(t) {
        $(t.dom).addClass("fadeIn");
        setTimeout(function () {
          return $(t.dom).removeClass("fadeIn");
        }, 500);
      }
      var s = i.map(function (n, i) {
        var s;
        var a = {
          "data-index": e.stream.visibleStart + i
        };
        if (n) {
          var c = n.createdAt();
          var u = app.postComponents[n.contentType()];
          s = u ? u.component({
            post: n
          }) : "";
          a.key = "post" + n.id();
          a.oncreate = o;
          a["data-time"] = c.toISOString();
          a["data-number"] = n.number();
          a["data-id"] = n.id();
          a["data-type"] = n.contentType();
          var l = c - t;
          if (l > 345600000) {
            s = [m("div", {
              className: "PostStream-timeGap"
            }, m("span", null, app.translator.trans("core.forum.post_stream.time_lapsed_text", {
              period: dayjs().add(l, "ms").fromNow(true)
            }))), s];
          }
          t = c;
        } else {
          a.key = "post" + r[e.stream.visibleStart + i];
          s = tt.component();
        }
        return m("div", Object.assign({
          className: "PostStream-item"
        }, a), s);
      });
      if (!n && i[this.stream.visibleEnd - this.stream.visibleStart - 1]) {
        s.push(m("div", {
          className: "PostStream-loadMore",
          key: "loadMore"
        }, m(E.a, {
          className: "Button",
          onclick: this.stream.loadNext.bind(this.stream)
        }, app.translator.trans("core.forum.post_stream.load_more_button"))));
      }
      if (!!n && (!app.session.user || !!this.discussion.canReply())) {
        s.push(m("div", {
          className: "PostStream-item",
          key: "reply",
          "data-index": this.stream.count(),
          oncreate: o
        }, it.component({
          discussion: this.discussion
        })));
      }
      return m("div", {
        className: "PostStream"
      }, s);
    };
    n.onupdate = function (e) {
      t.prototype.onupdate.call(this, e);
      this.triggerScroll();
    };
    n.oncreate = function (e) {
      var n = this;
      t.prototype.oncreate.call(this, e);
      this.triggerScroll();
      setTimeout(function () {
        return n.scrollListener.start();
      });
    };
    n.onremove = function (e) {
      t.prototype.onremove.call(this, e);
      this.scrollListener.stop();
      clearTimeout(this.calculatePositionTimeout);
    };
    n.triggerScroll = function () {
      if (this.stream.needsScroll) {
        var t = this.stream.targetPost;
        this.stream.needsScroll = false;
        if ("number" in t) {
          this.scrollToNumber(t.number, this.stream.animateScroll);
        } else if ("index" in t) {
          this.scrollToIndex(t.index, this.stream.animateScroll, t.reply);
        }
      }
    };
    n.onscroll = function (t = window.pageYOffset) {
      if (!this.stream.paused && !this.stream.pagesLoading) {
        this.updateScrubber(t);
        this.loadPostsIfNeeded(t);
        clearTimeout(this.calculatePositionTimeout);
        this.calculatePositionTimeout = setTimeout(this.calculatePosition.bind(this, t), 100);
      }
    };
    n.loadPostsIfNeeded = function (t = window.pageYOffset) {
      var e = this.getMarginTop();
      var n = $(window).height() - e;
      var i = t + e;
      if (this.stream.visibleStart > 0) {
        var r = this.$(".PostStream-item[data-index=" + this.stream.visibleStart + "]");
        if (r.length && r.offset().top > i - 300) {
          this.stream.loadPrevious();
        }
      }
      if (this.stream.visibleEnd < this.stream.count()) {
        var o = this.$(".PostStream-item[data-index=" + (this.stream.visibleEnd - 1) + "]");
        if (o.length && o.offset().top + o.outerHeight(true) < i + n + 300) {
          this.stream.loadNext();
        }
      }
    };
    n.updateScrubber = function (t = window.pageYOffset) {
      var e = this.getMarginTop();
      var n = $(window).height() - e;
      var i = t + e;
      var r = this.$(".PostStream-item[data-index]");
      var o = 0;
      var s = "";
      var a = null;
      r.each(function () {
        var t = $(this);
        var e = t.offset().top;
        var r = t.outerHeight(true);
        if (e + r < i) {
          return true;
        }
        if (e > i + n) {
          return false;
        }
        var c = Math.max(0, i - e);
        var u = Math.min(r, i + n - e) - c;
        if (a === null) {
          a = parseFloat(t.data("index")) + c / r;
        }
        if (u > 0) {
          o += u / r;
        }
        var l = t.data("time");
        if (l) {
          s = l;
        }
      });
      this.stream.index = a !== null ? a + 1 : this.stream.count();
      this.stream.visible = o;
      if (s) {
        this.stream.description = dayjs(s).format("MMMM YYYY");
      }
    };
    n.calculatePosition = function (t = window.pageYOffset) {
      var e;
      var n;
      var i = this.getMarginTop();
      var r = $(window);
      var o = r.height() - i;
      var s = r.scrollTop() + i;
      var a = t + i;
      this.$(".PostStream-item").each(function () {
        var t = $(this);
        var i = t.offset().top;
        var r = t.outerHeight(true);
        var c = Math.max(0, a - i);
        if (e === undefined && (c / r < 0.75 || (r - c) / o > 0.25)) {
          e = t.data("number");
        }
        if (i + r > s) {
          if (!(i + r < s + o)) {
            return false;
          }
          if (t.data("number")) {
            n = t.data("number");
          }
        }
      });
      if (e) {
        this.attrs.onPositionChange(e || 1, n, e);
      }
    };
    n.getMarginTop = function () {
      var t = app.screen() === "phone" ? "#app-navigation" : "#header";
      return this.$() && $(t).outerHeight() + parseInt(this.$().css("margin-top"), 10);
    };
    n.scrollToNumber = function (t, e) {
      var n = this.$(".PostStream-item[data-number=" + t + "]");
      return this.scrollToItem(n, e).then(this.flashItem.bind(this, n));
    };
    n.scrollToIndex = function (t, e, n) {
      var i = n ? $(".PostStream-item:last-child") : this.$(".PostStream-item[data-index=" + t + "]");
      this.scrollToItem(i, e, true, n);
      if (n) {
        this.flashItem(i);
      }
    };
    n.scrollToItem = function (t, e, n, i) {
      var r = this;
      var o = $("html, body").stop(true);
      var s = t.data("index");
      if (t.length) {
        var a = t.offset().top - this.getMarginTop();
        var c = t.offset().top + t.height();
        var u = $(document).scrollTop();
        var l = u + $(window).height();
        if (n || a < u || c > l) {
          var d = i ? c - $(window).height() + app.composer.computedHeight() : t.is(":first-child") ? 0 : a;
          if (e) {
            if (d !== u) {
              o.animate({
                scrollTop: d
              }, "fast");
            }
          } else {
            o.scrollTop(d);
          }
        }
      }
      function p() {
        r.updateScrubber();
        if (s !== undefined) {
          r.stream.index = s + 1;
        }
      }
      p();
      this.stream.forceUpdateScrubber = true;
      return Promise.all([o.promise(), this.stream.loadPromise]).then(function () {
        var t;
        m.redraw.sync();
        if (i) {
          var e = $(".PostStream-item:last-child");
          $(window).scrollTop(e.offset().top + e.height() - $(window).height() + app.composer.computedHeight());
        } else if (s === 0) {
          $(window).scrollTop(0);
        } else if (t = $(".PostStream-item[data-index=" + s + "]").offset()) {
          $(window).scrollTop(t.top - r.getMarginTop());
        }
        p();
        r.calculatePosition();
        r.stream.paused = false;
        r.loadPostsIfNeeded();
      });
    };
    n.flashItem = function (t) {
      t.removeClass("fadeIn");
      t.addClass("flash").on("animationend webkitAnimationEnd", function (e) {
        t.removeClass("flash");
      });
    };
    return e;
  }(d.a);
  var ot = n(77);
  var st = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.stream = this.attrs.stream;
      this.handlers = {};
      this.scrollListener = new Z.a(this.updateScrubberValues.bind(this, {
        fromScroll: true,
        forceHeightChange: true
      }));
    };
    n.view = function () {
      var t = this.stream.count();
      var e = app.translator.trans("core.forum.post_scrubber.viewing_text", {
        count: t,
        index: m("span", {
          className: "Scrubber-index"
        }),
        formattedCount: m("span", {
          className: "Scrubber-count"
        }, Object(ot.a)(t))
      });
      var n = this.stream.discussion.unreadCount();
      var i = t ? Math.min(t - this.stream.index, n) / t : 0;
      function r(t) {
        var e = $(t.dom);
        var n = {
          top: 100 - i * 100 + "%",
          height: i * 100 + "%"
        };
        if (t.state.oldStyle) {
          e.stop(true).css(t.state.oldStyle).animate(n);
        } else {
          e.css(n);
        }
        t.state.oldStyle = n;
      }
      var o = ["PostStreamScrubber", "Dropdown"];
      if (this.attrs.className) {
        o.push(this.attrs.className);
      }
      return m("div", {
        className: o.join(" ")
      }, m("button", {
        className: "Button Dropdown-toggle",
        "data-toggle": "dropdown"
      }, e, " ", Object(b.a)("fas fa-sort")), m("div", {
        className: "Dropdown-menu dropdown-menu"
      }, m("div", {
        className: "Scrubber"
      }, m("a", {
        className: "Scrubber-first",
        onclick: this.goToFirst.bind(this)
      }, Object(b.a)("fas fa-angle-double-up"), " ", app.translator.trans("core.forum.post_scrubber.original_post_link")), m("div", {
        className: "Scrubber-scrollbar"
      }, m("div", {
        className: "Scrubber-before"
      }), m("div", {
        className: "Scrubber-handle"
      }, m("div", {
        className: "Scrubber-bar"
      }), m("div", {
        className: "Scrubber-info"
      }, m("strong", null, e), m("span", {
        className: "Scrubber-description"
      }))), m("div", {
        className: "Scrubber-after"
      }), m("div", {
        className: "Scrubber-unread",
        oncreate: r,
        onupdate: r
      }, app.translator.trans("core.forum.post_scrubber.unread_text", {
        count: n
      }))), m("a", {
        className: "Scrubber-last",
        onclick: this.goToLast.bind(this)
      }, Object(b.a)("fas fa-angle-double-down"), " ", app.translator.trans("core.forum.post_scrubber.now_link")))));
    };
    n.onupdate = function (e) {
      var n = this;
      t.prototype.onupdate.call(this, e);
      if (this.stream.forceUpdateScrubber) {
        this.stream.forceUpdateScrubber = false;
        this.stream.loadPromise.then(function () {
          return n.updateScrubberValues({
            animate: true,
            forceHeightChange: true
          });
        });
      }
    };
    n.oncreate = function (e) {
      var n = this;
      t.prototype.oncreate.call(this, e);
      $(window).on("resize", this.handlers.onresize = this.onresize.bind(this)).resize();
      this.$(".Scrubber-scrollbar").bind("click", this.onclick.bind(this)).bind("dragstart mousedown touchstart", function (t) {
        return t.preventDefault();
      });
      this.dragging = false;
      this.mouseStart = 0;
      this.indexStart = 0;
      this.$(".Scrubber-handle").bind("mousedown touchstart", this.onmousedown.bind(this)).click(function (t) {
        return t.stopPropagation();
      });
      $(document).on("mousemove touchmove", this.handlers.onmousemove = this.onmousemove.bind(this)).on("mouseup touchend", this.handlers.onmouseup = this.onmouseup.bind(this));
      setTimeout(function () {
        return n.scrollListener.start();
      });
      this.stream.loadPromise.then(function () {
        return n.updateScrubberValues({
          animate: false,
          forceHeightChange: true
        });
      });
    };
    n.onremove = function (e) {
      t.prototype.onremove.call(this, e);
      this.scrollListener.stop();
      $(window).off("resize", this.handlers.onresize);
      $(document).off("mousemove touchmove", this.handlers.onmousemove).off("mouseup touchend", this.handlers.onmouseup);
    };
    n.updateScrubberValues = function (t) {
      var e = this;
      if (t === undefined) {
        t = {};
      }
      var n = this.stream.index;
      var i = this.stream.count();
      var r = this.stream.visible || 1;
      var o = this.percentPerPost();
      var s = this.$();
      s.find(".Scrubber-index").text(Object(ot.a)(this.stream.sanitizeIndex(Math.max(1, n))));
      s.find(".Scrubber-description").text(this.stream.description);
      s.toggleClass("disabled", this.stream.disabled());
      var a = {};
      a.before = Math.max(0, o.index * Math.min(n - 1, i - r));
      a.handle = Math.min(100 - a.before, o.visible * r);
      a.after = 100 - a.before - a.handle;
      if ((!t.fromScroll || !this.stream.paused) && (!this.adjustingHeight || !!t.forceHeightChange)) {
        var c = t.animate ? "animate" : "css";
        this.adjustingHeight = true;
        var u = [];
        for (var l in a) {
          var d = s.find(".Scrubber-" + l);
          u.push(d.stop(true, true)[c]({
            height: a[l] + "%"
          }, "fast").promise());
          if (c === "animate") {
            d.css("overflow", "visible");
          }
        }
        Promise.all(u).then(function () {
          return e.adjustingHeight = false;
        });
      }
    };
    n.goToFirst = function () {
      this.stream.goToFirst();
      this.updateScrubberValues({
        animate: true,
        forceHeightChange: true
      });
    };
    n.goToLast = function () {
      this.stream.goToLast();
      this.updateScrubberValues({
        animate: true,
        forceHeightChange: true
      });
    };
    n.onresize = function () {
      var t = this.$();
      var e = this.$(".Scrubber-scrollbar");
      e.css("max-height", $(window).height() - t.offset().top + $(window).scrollTop() - parseInt($("#app").css("padding-bottom"), 10) - (t.outerHeight() - e.outerHeight()));
    };
    n.onmousedown = function (t) {
      t.redraw = false;
      this.mouseStart = t.clientY || t.originalEvent.touches[0].clientY;
      this.indexStart = this.stream.index;
      this.dragging = true;
      $("body").css("cursor", "move");
      this.$().toggleClass("dragging", this.dragging);
    };
    n.onmousemove = function (t) {
      if (this.dragging) {
        var e = ((t.clientY || t.originalEvent.touches[0].clientY) - this.mouseStart) / this.$(".Scrubber-scrollbar").outerHeight() * 100 / this.percentPerPost().index || 0;
        var n = Math.min(this.indexStart + e, this.stream.count() - 1);
        this.stream.index = Math.max(0, n);
        this.updateScrubberValues();
      }
    };
    n.onmouseup = function () {
      this.$().toggleClass("dragging", this.dragging);
      if (this.dragging) {
        this.mouseStart = 0;
        this.indexStart = 0;
        this.dragging = false;
        $("body").css("cursor", "");
        this.$().removeClass("open");
        var t = Math.floor(this.stream.index);
        this.stream.goToIndex(t);
      }
    };
    n.onclick = function (t) {
      var e = this.$(".Scrubber-scrollbar");
      var n = ((t.pageY || t.originalEvent.touches[0].pageY) - e.offset().top + $("body").scrollTop()) / e.outerHeight() * 100;
      var i = (n -= parseFloat(e.find(".Scrubber-handle")[0].style.height) / 2) / this.percentPerPost().index;
      i = Math.max(0, Math.min(this.stream.count() - 1, i));
      this.stream.goToIndex(Math.floor(i));
      this.updateScrubberValues({
        animate: true,
        forceHeightChange: true
      });
      this.$().removeClass("open");
    };
    n.percentPerPost = function () {
      var t = this.stream.count() || 1;
      var e = this.stream.visible || 1;
      var n = 50 / this.$(".Scrubber-scrollbar").outerHeight() * 100;
      var i = Math.max(100 / t, n / e);
      var r = t === e ? 0 : (100 - i * e) / (t - e);
      return {
        index: r,
        visible: i
      };
    };
    return e;
  }(d.a);
  var at = n(85);
  var ct = n(51);
  var ut = n(86);
  var lt = function () {
    function t(t, e = []) {
      this.discussion = t;
      this.paused = false;
      this.loadPageTimeouts = {};
      this.pagesLoading = 0;
      this.index = 0;
      this.number = 1;
      this.visible = 1;
      this.description = "";
      this.forceUpdateScrubber = false;
      this.loadNext = Object(ct.b)(300, this._loadNext);
      this.loadPrevious = Object(ct.b)(300, this._loadPrevious);
      this.show(e);
    }
    var e = t.prototype;
    e.update = function () {
      if (this.viewingEnd()) {
        this.visibleEnd = this.count();
        return this.loadRange(this.visibleStart, this.visibleEnd);
      } else {
        return Promise.resolve();
      }
    };
    e.goToFirst = function () {
      return this.goToIndex(0);
    };
    e.goToLast = function () {
      return this.goToIndex(this.count() - 1, true);
    };
    e.goToNumber = function (t, e = false) {
      if (t === "reply") {
        var n = this.goToLast();
        this.targetPost.reply = true;
        return n;
      }
      this.paused = true;
      this.loadPromise = this.loadNearNumber(t);
      this.needsScroll = true;
      this.targetPost = {
        number: t
      };
      this.animateScroll = !e;
      this.number = t;
      return this.loadPromise.then(function () {
        return m.redraw();
      });
    };
    e.goToIndex = function (t, e = false) {
      this.paused = true;
      this.loadPromise = this.loadNearIndex(t);
      this.needsScroll = true;
      this.targetPost = {
        index: t
      };
      this.animateScroll = !e;
      this.index = t;
      m.redraw();
      return this.loadPromise;
    };
    e.loadNearNumber = function (t) {
      if (this.posts().some(function (e) {
        return e && Number(e.number()) === Number(t);
      })) {
        return Promise.resolve();
      } else {
        this.reset();
        return app.store.find("posts", {
          filter: {
            discussion: this.discussion.id()
          },
          page: {
            near: t
          }
        }).then(this.show.bind(this));
      }
    };
    e.loadNearIndex = function (t) {
      if (t >= this.visibleStart && t < this.visibleEnd) {
        return Promise.resolve();
      }
      var e = this.sanitizeIndex(t - this.constructor.loadCount / 2);
      var n = e + this.constructor.loadCount;
      this.reset(e, n);
      return this.loadRange(e, n).then(this.show.bind(this));
    };
    e._loadNext = function () {
      var t = this.visibleEnd;
      var e = this.visibleEnd = this.sanitizeIndex(this.visibleEnd + this.constructor.loadCount);
      var n = t - this.constructor.loadCount * 2;
      if (n > this.visibleStart && n >= 0) {
        this.visibleStart = n + this.constructor.loadCount + 1;
        if (this.loadPageTimeouts[n]) {
          clearTimeout(this.loadPageTimeouts[n]);
          this.loadPageTimeouts[n] = null;
          this.pagesLoading--;
        }
      }
      this.loadPage(t, e);
    };
    e._loadPrevious = function () {
      var t = this.visibleStart;
      var e = this.visibleStart = this.sanitizeIndex(this.visibleStart - this.constructor.loadCount);
      var n = e + this.constructor.loadCount * 2;
      if (n < this.visibleEnd && n <= this.count()) {
        this.visibleEnd = n;
        if (this.loadPageTimeouts[n]) {
          clearTimeout(this.loadPageTimeouts[n]);
          this.loadPageTimeouts[n] = null;
          this.pagesLoading--;
        }
      }
      this.loadPage(e, t, true);
    };
    e.loadPage = function (t, e, n) {
      var i = this;
      if (n === undefined) {
        n = false;
      }
      this.pagesLoading++;
      function r() {
        if (!(t < i.visibleStart) && !(e > i.visibleEnd)) {
          var r = n ? i.visibleEnd - 1 : i.visibleStart;
          Object(ut.a)(".PostStream-item[data-index=\"" + r + "\"]", m.redraw.sync);
        }
      }
      r();
      this.loadPageTimeouts[t] = setTimeout(function () {
        i.loadRange(t, e).then(function () {
          r();
          i.pagesLoading--;
        });
        i.loadPageTimeouts[t] = null;
      }, this.pagesLoading - 1 ? 1000 : 0);
    };
    e.loadRange = function (t, e) {
      var n = [];
      var i = [];
      this.discussion.postIds().slice(t, e).forEach(function (t) {
        var e = app.store.getById("posts", t);
        if (e && e.discussion() && e.canEdit() !== undefined) {
          i.push(e);
        } else {
          n.push(t);
        }
      });
      if (n.length) {
        return app.store.find("posts", n).then(function (t) {
          return i.concat(t).sort(function (t, e) {
            return t.createdAt() - e.createdAt();
          });
        });
      } else {
        return Promise.resolve(i);
      }
    };
    e.show = function (t) {
      this.visibleStart = t.length ? this.discussion.postIds().indexOf(t[0].id()) : 0;
      this.visibleEnd = this.sanitizeIndex(this.visibleStart + t.length);
    };
    e.reset = function (t, e) {
      this.visibleStart = t || 0;
      this.visibleEnd = this.sanitizeIndex(e || this.constructor.loadCount);
    };
    e.posts = function () {
      return this.discussion.postIds().slice(this.visibleStart, this.visibleEnd).map(function (t) {
        var e = app.store.getById("posts", t);
        if (e && e.discussion() && e.canEdit() !== undefined) {
          return e;
        } else {
          return null;
        }
      });
    };
    e.count = function () {
      return this.discussion.postIds().length;
    };
    e.disabled = function () {
      return this.visible >= this.count();
    };
    e.viewingEnd = function () {
      return Math.abs(this.count() - this.visibleEnd) <= 1;
    };
    e.sanitizeIndex = function (t) {
      return Math.max(0, Math.min(this.count(), Math.floor(t)));
    };
    return t;
  }();
  lt.loadCount = 20;
  var dt = lt;
  var pt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.useBrowserScrollRestoration = false;
      this.discussion = null;
      this.near = m.route.param("near") || 0;
      this.load();
      if (app.discussions.hasItems()) {
        app.pane.enable();
        app.pane.hide();
      }
      app.history.push("discussion");
      this.bodyClass = "App--discussion";
    };
    n.onremove = function (e) {
      t.prototype.onremove.call(this, e);
      app.pane.disable();
      if (app.composer.composingReplyTo(this.discussion) && !app.composer.fields.content()) {
        app.composer.hide();
      } else {
        app.composer.minimize();
      }
    };
    n.view = function () {
      var t = this.discussion;
      return m("div", {
        className: "DiscussionPage"
      }, m(Q, {
        state: app.discussions
      }), m("div", {
        className: "DiscussionPage-discussion"
      }, t ? [h.component({
        discussion: t
      }), m("div", {
        className: "container"
      }, m("nav", {
        className: "DiscussionPage-nav"
      }, m("ul", null, Object(p.a)(this.sidebarItems().toArray()))), m("div", {
        className: "DiscussionPage-stream"
      }, rt.component({
        discussion: t,
        stream: this.stream,
        onPositionChange: this.positionChanged.bind(this)
      })))] : m(S.a, null)));
    };
    n.load = function () {
      var t = app.preloadedApiDocument();
      if (t) {
        setTimeout(this.show.bind(this, t), 0);
      } else {
        var e = this.requestParams();
        app.store.find("discussions", m.route.param("id"), e).then(this.show.bind(this));
      }
      m.redraw();
    };
    n.requestParams = function () {
      return {
        bySlug: true,
        page: {
          near: this.near
        }
      };
    };
    n.show = function (t) {
      var e = this;
      app.history.push("discussion", t.title());
      app.setTitle(t.title());
      app.setTitleCount(0);
      var n = [];
      if (t.payload && t.payload.included) {
        var i = t.id();
        n = t.payload.included.filter(function (t) {
          return t.type === "posts" && t.relationships && t.relationships.discussion && t.relationships.discussion.data.id === i;
        }).map(function (t) {
          return app.store.getById("posts", t.id);
        }).sort(function (t, e) {
          return t.createdAt() - e.createdAt();
        }).slice(0, 20);
      }
      this.stream = new dt(t, n);
      this.stream.goToNumber(m.route.param("near") || n[0] && n[0].number(), true).then(function () {
        e.discussion = t;
        app.current.set("discussion", t);
        app.current.set("stream", e.stream);
      });
    };
    n.sidebarItems = function () {
      var t = new l.a();
      t.add("controls", at.a.component({
        icon: "fas fa-ellipsis-v",
        className: "App-primaryControl",
        buttonClassName: "Button--primary",
        accessibleToggleLabel: app.translator.trans("core.forum.discussion_controls.toggle_dropdown_accessible_label")
      }, q.controls(this.discussion, this).toArray()));
      t.add("scrubber", st.component({
        stream: this.stream,
        className: "App-titleControl"
      }), -100);
      return t;
    };
    n.positionChanged = function (t, e) {
      var n = this.discussion;
      var i = app.route.discussion(n, this.near = t);
      window.history.replaceState(null, document.title, i);
      app.history.push("discussion", n.title());
      if (app.session.user && e > (n.lastReadPostNumber() || 0)) {
        n.save({
          lastReadPostNumber: e
        });
        m.redraw();
      }
    };
    return e;
  }(u.a);
  var ht = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.view = function () {
      return m("ul", {
        className: "Header-controls"
      }, Object(p.a)(this.items().toArray()));
    };
    n.items = function () {
      return new l.a();
    };
    return e;
  }(d.a);
  var ft = n(11);
  var mt = n(16);
  var vt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    e.initAttrs = function (e) {
      t.initAttrs.call(this, e);
      e.className = "SessionDropdown";
      e.buttonClassName = "Button Button--user Button--flat";
      e.menuClassName = "Dropdown-menu--right";
      e.accessibleToggleLabel = app.translator.trans("core.forum.header.session_dropdown_accessible_label");
    };
    var n = e.prototype;
    n.view = function (e) {
      return t.prototype.view.call(this, Object(ft.a)({}, e, {
        children: this.items().toArray()
      }));
    };
    n.getButtonContent = function () {
      var t = app.session.user;
      return [Object(v.a)(t), " ", m("span", {
        className: "Button-label"
      }, Object(et.a)(t))];
    };
    n.items = function () {
      var t = new l.a();
      var e = app.session.user;
      t.add("profile", mt.a.component({
        icon: "fas fa-user",
        href: app.route.user(e)
      }, app.translator.trans("core.forum.header.profile_button")), 100);
      t.add("settings", mt.a.component({
        icon: "fas fa-cog",
        href: app.route("settings")
      }, app.translator.trans("core.forum.header.settings_button")), 50);
      if (app.forum.attribute("adminUrl")) {
        t.add("administration", mt.a.component({
          icon: "fas fa-wrench",
          href: app.forum.attribute("adminUrl"),
          target: "_blank"
        }, app.translator.trans("core.forum.header.admin_button")), 0);
      }
      t.add("separator", U.a.component(), -90);
      t.add("logOut", E.a.component({
        icon: "fas fa-sign-out-alt",
        onclick: app.session.logout.bind(app.session)
      }, app.translator.trans("core.forum.header.log_out_button")), -100);
      return t;
    };
    return e;
  }(x.a);
  var gt = n(32);
  var bt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.view = function () {
      var t = this.attrs.state;
      return m("div", {
        className: "NotificationList"
      }, m("div", {
        className: "NotificationList-header"
      }, m("h4", {
        className: "App-titleControl App-titleControl--text"
      }, app.translator.trans("core.forum.notifications.title")), m("div", {
        className: "App-primaryControl"
      }, m(E.a, {
        className: "Button Button--link",
        icon: "fas fa-check",
        title: app.translator.trans("core.forum.notifications.mark_all_as_read_tooltip"),
        onclick: t.markAllAsRead.bind(t)
      }))), m("div", {
        className: "NotificationList-content"
      }, this.content(t)));
    };
    n.content = function (t) {
      if (t.isLoading()) {
        return m(S.a, {
          className: "LoadingIndicator--block"
        });
      } else if (t.hasItems()) {
        return t.getPages().map(function (t) {
          var e = [];
          var n = {};
          t.items.forEach(function (t) {
            var i = t.subject();
            if (i !== undefined) {
              var r = null;
              if (i instanceof K.a) {
                r = i;
              } else if (i && i.discussion) {
                r = i.discussion();
              }
              var o = r ? r.id() : 0;
              n[o] = n[o] || {
                discussion: r,
                notifications: []
              };
              n[o].notifications.push(t);
              if (e.indexOf(n[o]) === -1) {
                e.push(n[o]);
              }
            }
          });
          return e.map(function (t) {
            var e = t.discussion && t.discussion.badges().toArray();
            return m("div", {
              className: "NotificationGroup"
            }, t.discussion ? m(f.a, {
              className: "NotificationGroup-header",
              href: app.route.discussion(t.discussion)
            }, e && !!e.length && m("ul", {
              className: "NotificationGroup-badges badges"
            }, Object(p.a)(e)), m("span", null, t.discussion.title())) : m("div", {
              className: "NotificationGroup-header"
            }, app.forum.attribute("title")), m("ul", {
              className: "NotificationGroup-content"
            }, t.notifications.map(function (t) {
              var e = app.notificationComponents[t.contentType()];
              if (e) {
                return m("li", null, e.component({
                  notification: t
                }));
              } else {
                return "";
              }
            })));
          });
        });
      } else {
        return m("div", {
          className: "NotificationList-empty"
        }, app.translator.trans("core.forum.notifications.empty_text"));
      }
    };
    n.oncreate = function (e) {
      t.prototype.oncreate.call(this, e);
      this.$notifications = this.$(".NotificationList-content");
      this.$scrollParent = this.inPanel() ? this.$notifications : $(window);
      this.boundScrollHandler = this.scrollHandler.bind(this);
      this.$scrollParent.on("scroll", this.boundScrollHandler);
    };
    n.onremove = function (e) {
      t.prototype.onremove.call(this, e);
      this.$scrollParent.off("scroll", this.boundScrollHandler);
    };
    n.scrollHandler = function () {
      var t = this.attrs.state;
      var e = this.inPanel() ? this.$scrollParent[0] : document.documentElement;
      var n = Math.abs(e.scrollHeight - e.scrollTop - e.clientHeight) <= 1;
      if (t.hasNext() && !t.isLoadingNext() && n) {
        t.loadNext();
      }
    };
    n.inPanel = function () {
      return this.$notifications.css("overflow") === "auto";
    };
    return e;
  }(d.a);
  var yt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    e.initAttrs = function (e) {
      e.className = e.className || "NotificationsDropdown";
      e.buttonClassName = e.buttonClassName || "Button Button--flat";
      e.menuClassName = e.menuClassName || "Dropdown-menu--right";
      e.label = e.label || app.translator.trans("core.forum.notifications.tooltip");
      e.icon = e.icon || "fas fa-bell";
      e.accessibleToggleLabel = e.accessibleToggleLabel || app.translator.trans("core.forum.notifications.toggle_dropdown_accessible_label");
      t.initAttrs.call(this, e);
    };
    var n = e.prototype;
    n.getButton = function () {
      var e = this.getNewCount();
      var n = t.prototype.getButton.call(this);
      n.attrs.title = this.attrs.label;
      n.attrs.className = Object(j.a)(n.attrs.className, [e && "new"]);
      n.attrs.onclick = this.onclick.bind(this);
      return n;
    };
    n.getButtonContent = function () {
      var t = this.getUnreadCount();
      return [Object(b.a)(this.attrs.icon, {
        className: "Button-icon"
      }), t !== 0 && m("span", {
        className: "NotificationsDropdown-unread"
      }, t), m("span", {
        className: "Button-label"
      }, this.attrs.label)];
    };
    n.getMenu = function () {
      return m("div", {
        className: Object(j.a)("Dropdown-menu", this.attrs.menuClassName),
        onclick: this.menuClick.bind(this)
      }, this.showing && bt.component({
        state: this.attrs.state
      }));
    };
    n.onclick = function () {
      if (app.drawer.isOpen()) {
        this.goToRoute();
      } else {
        this.attrs.state.load();
      }
    };
    n.goToRoute = function () {
      m.route.set(app.route("notifications"));
    };
    n.getUnreadCount = function () {
      return app.session.user.unreadNotificationCount();
    };
    n.getNewCount = function () {
      return app.session.user.newNotificationCount();
    };
    n.menuClick = function (t) {
      if (t.shiftKey || t.metaKey || t.ctrlKey || t.which === 2) {
        t.stopPropagation();
      }
    };
    return e;
  }(x.a);
  var wt = function () {
    function t() {
      this.callbacks = new Map();
      this.whenCallback = function (t) {
        return true;
      };
    }
    var e = t.prototype;
    e.onUp = function (t) {
      this.callbacks.set(38, function (e) {
        e.preventDefault();
        t(e);
      });
      return this;
    };
    e.onDown = function (t) {
      this.callbacks.set(40, function (e) {
        e.preventDefault();
        t(e);
      });
      return this;
    };
    e.onSelect = function (t) {
      function e(e) {
        e.preventDefault();
        t(e);
      }
      this.callbacks.set(9, e);
      this.callbacks.set(13, e);
      return this;
    };
    e.onCancel = function (t) {
      this.callbacks.set(27, function (e) {
        e.stopPropagation();
        e.preventDefault();
        t(e);
      });
      return this;
    };
    e.onRemove = function (t) {
      this.callbacks.set(8, function (e) {
        if (e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
          t(e);
          e.preventDefault();
        }
      });
      return this;
    };
    e.when = function (t) {
      this.whenCallback = t;
      return this;
    };
    e.bindTo = function (t) {
      t.on("keydown", this.navigate.bind(this));
    };
    e.navigate = function (t) {
      if (this.whenCallback(t)) {
        var e = this.callbacks.get(t.which);
        if (e) {
          e(t);
        }
      }
    };
    return t;
  }();
  var xt = function () {
    function t() {
      this.results = new Map();
    }
    var e = t.prototype;
    e.search = function (t) {
      var e = this;
      t = t.toLowerCase();
      this.results.set(t, []);
      var n = {
        filter: {
          q: t
        },
        page: {
          limit: 3
        },
        include: "mostRelevantPost"
      };
      return app.store.find("discussions", n).then(function (n) {
        return e.results.set(t, n);
      });
    };
    e.view = function (t) {
      t = t.toLowerCase();
      var e = (this.results.get(t) || []).map(function (e) {
        var n = e.mostRelevantPost();
        return m("li", {
          className: "DiscussionSearchResult",
          "data-index": "discussions" + e.id()
        }, m(f.a, {
          href: app.route.discussion(e, n && n.number())
        }, m("div", {
          className: "DiscussionSearchResult-title"
        }, Object(g.a)(e.title(), t)), n ? m("div", {
          className: "DiscussionSearchResult-excerpt"
        }, Object(g.a)(n.contentPlain(), t, 100)) : ""));
      });
      return [m("li", {
        className: "Dropdown-header"
      }, app.translator.trans("core.forum.search.discussions_heading")), m("li", null, m(mt.a, {
        icon: "fas fa-search",
        href: app.route("index", {
          q: t
        })
      }, app.translator.trans("core.forum.search.all_discussions_button", {
        query: t
      })))].concat(e);
    };
    return t;
  }();
  var Nt = function () {
    function t() {
      this.results = new Map();
    }
    var e = t.prototype;
    e.search = function (t) {
      var e = this;
      return app.store.find("users", {
        filter: {
          q: t
        },
        page: {
          limit: 5
        }
      }).then(function (n) {
        e.results.set(t, n);
        m.redraw();
      });
    };
    e.view = function (t) {
      t = t.toLowerCase();
      var e = (this.results.get(t) || []).concat(app.store.all("users").filter(function (e) {
        return [e.username(), e.displayName()].some(function (e) {
          return e.toLowerCase().substr(0, t.length) === t;
        });
      })).filter(function (t, e, n) {
        return n.lastIndexOf(t) === e;
      }).sort(function (t, e) {
        return t.displayName().localeCompare(e.displayName());
      });
      if (e.length) {
        return [m("li", {
          className: "Dropdown-header"
        }, app.translator.trans("core.forum.search.users_heading"))].concat(e.map(function (e) {
          var n = Object(et.a)(e);
          var i = [Object(g.a)(n.text, t)];
          return m("li", {
            className: "UserSearchResult",
            "data-index": "users" + e.id()
          }, m(f.a, {
            href: app.route.user(e)
          }, Object(v.a)(e), Object(ft.a)({}, n, {
            text: undefined,
            children: i
          })));
        }));
      } else {
        return [];
      }
    };
    return t;
  }();
  var Ct = function (t) {
    function e() {
      var e;
      for (var n = arguments.length, i = new Array(n), r = 0; r < n; r++) {
        i[r] = arguments[r];
      }
      (e = t.call.apply(t, [this].concat(i)) || this).state = undefined;
      e.hasFocus = false;
      e.sources = undefined;
      e.loadingSources = 0;
      e.index = 0;
      e.navigator = undefined;
      e.searchTimeout = undefined;
      e.updateMaxHeightHandler = undefined;
      return e;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.state = this.attrs.state;
    };
    n.view = function () {
      var t = this;
      var e = this.state.getInitialSearch();
      this.sources ||= this.sourceItems().toArray();
      if (!this.sources.length) {
        return m("div", null);
      }
      var n = Object(P.a)(app.translator.trans("core.forum.header.search_placeholder"));
      return m("div", {
        role: "search",
        className: Object(j.a)({
          Search: true,
          open: this.state.getValue() && this.hasFocus,
          focused: this.hasFocus,
          active: !!e,
          loading: !!this.loadingSources
        })
      }, m("div", {
        className: "Search-input"
      }, m("input", {
        "aria-label": n,
        className: "FormControl",
        type: "search",
        placeholder: n,
        value: this.state.getValue(),
        oninput: function (e) {
          return t.state.setValue(e.target.value);
        },
        onfocus: function () {
          return t.hasFocus = true;
        },
        onblur: function () {
          return t.hasFocus = false;
        }
      }), this.loadingSources ? m(S.a, {
        size: "small",
        display: "inline",
        containerClassName: "Button Button--icon Button--link"
      }) : e ? m("button", {
        className: "Search-clear Button Button--icon Button--link",
        onclick: this.clear.bind(this)
      }, Object(b.a)("fas fa-times-circle")) : ""), m("ul", {
        className: "Dropdown-menu Search-results"
      }, this.state.getValue() && this.hasFocus ? this.sources.map(function (e) {
        return e.view(t.state.getValue());
      }) : ""));
    };
    n.updateMaxHeight = function () {
      var t = window.innerHeight - this.element.querySelector(".Search-input>.FormControl").getBoundingClientRect().bottom - 14;
      this.element.querySelector(".Search-results").style["max-height"] = t + "px";
    };
    n.onupdate = function (e) {
      t.prototype.onupdate.call(this, e);
      this.setIndex(this.getCurrentNumericIndex());
      if (this.sources.length) {
        this.updateMaxHeight();
      }
    };
    n.oncreate = function (n) {
      var i = this;
      t.prototype.oncreate.call(this, n);
      var r = this;
      var o = this.state;
      this.setIndex(this.getCurrentNumericIndex());
      this.$(".Search-results").on("mousedown", function (t) {
        return t.preventDefault();
      }).on("click", function () {
        return i.$("input").blur();
      }).on("mouseenter", "> li:not(.Dropdown-header)", function () {
        r.setIndex(r.selectableItems().index(this));
      });
      var s = this.$("input");
      this.navigator = new wt();
      this.navigator.onUp(function () {
        return i.setIndex(i.getCurrentNumericIndex() - 1, true);
      }).onDown(function () {
        return i.setIndex(i.getCurrentNumericIndex() + 1, true);
      }).onSelect(this.selectResult.bind(this)).onCancel(this.clear.bind(this)).bindTo(s);
      s.on("input focus", function () {
        var t = this.value.toLowerCase();
        if (t) {
          clearTimeout(r.searchTimeout);
          r.searchTimeout = setTimeout(function () {
            if (!o.isCached(t)) {
              if (t.length >= e.MIN_SEARCH_LEN) {
                r.sources.map(function (e) {
                  if (e.search) {
                    r.loadingSources++;
                    e.search(t).then(function () {
                      r.loadingSources = Math.max(0, r.loadingSources - 1);
                      m.redraw();
                    });
                  }
                });
              }
              o.cache(t);
              m.redraw();
            }
          }, 250);
        }
      }).on("focus", function () {
        $(this).one("mouseup", function (t) {
          return t.preventDefault();
        }).select();
      });
      this.updateMaxHeightHandler = this.updateMaxHeight.bind(this);
      window.addEventListener("resize", this.updateMaxHeightHandler);
    };
    n.onremove = function (e) {
      t.prototype.onremove.call(this, e);
      window.removeEventListener("resize", this.updateMaxHeightHandler);
    };
    n.selectResult = function () {
      clearTimeout(this.searchTimeout);
      this.loadingSources = 0;
      if (this.state.getValue()) {
        m.route.set(this.getItem(this.index).find("a").attr("href"));
      } else {
        this.clear();
      }
      this.$("input").blur();
    };
    n.clear = function () {
      this.state.clear();
    };
    n.sourceItems = function () {
      var t = new l.a();
      if (app.forum.attribute("canViewForum")) {
        t.add("discussions", new xt());
      }
      if (app.forum.attribute("canSearchUsers")) {
        t.add("users", new Nt());
      }
      return t;
    };
    n.selectableItems = function () {
      return this.$(".Search-results > li:not(.Dropdown-header)");
    };
    n.getCurrentNumericIndex = function () {
      return this.selectableItems().index(this.getItem(this.index));
    };
    n.getItem = function (t) {
      var e = this.selectableItems();
      var n = e.filter("[data-index=\"" + t + "\"]");
      if (!n.length) {
        n = e.eq(t);
      }
      return n;
    };
    n.setIndex = function (t, e = false) {
      var n = this.selectableItems();
      var i = n.parent();
      var r = t;
      if (t < 0) {
        r = n.length - 1;
      } else if (t >= n.length) {
        r = 0;
      }
      var o = n.removeClass("active").eq(r).addClass("active");
      this.index = parseInt(o.attr("data-index")) || r;
      if (e) {
        var s;
        var a = i.scrollTop();
        var c = i.offset().top;
        var u = c + i.outerHeight();
        var l = o.offset().top;
        var d = l + o.outerHeight();
        if (l < c) {
          s = a - c + l - parseInt(i.css("padding-top"), 10);
        } else if (d > u) {
          s = a - u + d + parseInt(i.css("padding-bottom"), 10);
        }
        if (s !== undefined) {
          i.stop(true).animate({
            scrollTop: s
          }, 100);
        }
      }
    };
    return e;
  }(d.a);
  Ct.MIN_SEARCH_LEN = 3;
  var Tt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.view = function () {
      return m("ul", {
        className: "Header-controls"
      }, Object(p.a)(this.items().toArray()));
    };
    n.items = function () {
      var t = new l.a();
      t.add("search", Ct.component({
        state: app.search
      }), 30);
      if (app.forum.attribute("showLanguageSelector") && Object.keys(app.data.locales).length > 1) {
        var e = [];
        function n(t) {
          e.push(E.a.component({
            active: app.data.locale === t,
            icon: app.data.locale !== t || "fas fa-check",
            onclick: function () {
              if (app.session.user) {
                app.session.user.savePreferences({
                  locale: t
                }).then(function () {
                  return window.location.reload();
                });
              } else {
                document.cookie = "locale=" + t + "; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT";
                window.location.reload();
              }
            }
          }, app.data.locales[t]));
        }
        for (var i in app.data.locales) {
          n(i);
        }
        t.add("locale", gt.a.component({
          buttonClassName: "Button Button--link",
          accessibleToggleLabel: app.translator.trans("core.forum.header.locale_dropdown_accessible_label")
        }, e), 20);
      }
      if (app.session.user) {
        t.add("notifications", yt.component({
          state: app.notifications
        }), 10);
        t.add("session", vt.component(), 0);
      } else {
        if (app.forum.attribute("allowSignUp")) {
          t.add("signUp", E.a.component({
            className: "Button Button--link",
            onclick: function () {
              return app.modal.show(H);
            }
          }, app.translator.trans("core.forum.header.sign_up_link")), 10);
        }
        t.add("logIn", E.a.component({
          className: "Button Button--link",
          onclick: function () {
            return app.modal.show(B);
          }
        }, app.translator.trans("core.forum.header.log_in_link")), 0);
      }
      return t;
    };
    return e;
  }(d.a);
  var St = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    e.initAttrs = function (e) {
      t.initAttrs.call(this, e);
      e.className = e.className || "Button Button--icon Button--link";
    };
    return e;
  }(E.a);
  var Ot = n(42);
  n(149);
  var kt = function () {
    function t() {
      this.position = t.Position.HIDDEN;
      this.height = null;
      this.body = {
        attrs: {}
      };
      this.editor = null;
      this.clear();
    }
    var e = t.prototype;
    e.load = function (t, e) {
      var n = {
        componentClass: t,
        attrs: e
      };
      if (!this.preventExit()) {
        if (this.isVisible()) {
          this.clear();
          m.redraw.sync();
        }
        this.body = n;
      }
    };
    e.clear = function () {
      this.position = t.Position.HIDDEN;
      this.body = {
        attrs: {}
      };
      this.onExit = null;
      this.fields = {
        content: Object(M.a)("")
      };
      if (this.editor) {
        this.editor.destroy();
      }
      this.editor = null;
    };
    e.show = function () {
      if (this.position !== t.Position.NORMAL && this.position !== t.Position.FULLSCREEN) {
        this.position = t.Position.NORMAL;
        m.redraw.sync();
      }
    };
    e.hide = function () {
      this.clear();
      m.redraw();
    };
    e.close = function () {
      if (!this.preventExit()) {
        this.hide();
      }
    };
    e.minimize = function () {
      if (this.isVisible()) {
        this.position = t.Position.MINIMIZED;
        m.redraw();
      }
    };
    e.fullScreen = function () {
      if (this.isVisible()) {
        this.position = t.Position.FULLSCREEN;
        m.redraw();
      }
    };
    e.exitFullScreen = function () {
      if (this.position === t.Position.FULLSCREEN) {
        this.position = t.Position.NORMAL;
        m.redraw();
      }
    };
    e.bodyMatches = function (t, e) {
      var n = this;
      if (e === undefined) {
        e = {};
      }
      return !!Object(Ot.a)(this.body.componentClass, t) && Object.keys(e).every(function (t) {
        return n.body.attrs[t] === e[t];
      });
    };
    e.isVisible = function () {
      return this.position !== t.Position.HIDDEN;
    };
    e.isFullScreen = function () {
      return this.position === t.Position.FULLSCREEN || app.screen() === "phone";
    };
    e.composingReplyTo = function (t) {
      return this.isVisible() && this.bodyMatches(D, {
        discussion: t
      });
    };
    e.preventExit = function () {
      if (this.isVisible() && this.onExit) {
        if (this.onExit.callback()) {
          return !confirm(this.onExit.message);
        } else {
          return undefined;
        }
      }
    };
    e.preventClosingWhen = function (t, e) {
      this.onExit = {
        callback: t,
        message: e
      };
    };
    e.minimumHeight = function () {
      return 200;
    };
    e.maximumHeight = function () {
      return $(window).height() - $("#header").outerHeight();
    };
    e.computedHeight = function () {
      if (this.position === t.Position.MINIMIZED) {
        return "";
      } else if (this.position === t.Position.FULLSCREEN) {
        return $(window).height();
      } else {
        return Math.max(this.minimumHeight(), Math.min(this.height, this.maximumHeight()));
      }
    };
    return t;
  }();
  kt.Position = {
    HIDDEN: "hidden",
    NORMAL: "normal",
    MINIMIZED: "minimized",
    FULLSCREEN: "fullScreen"
  };
  var jt = kt;
  var At = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.state = this.attrs.state;
      this.active = false;
      this.prevPosition = this.state.position;
    };
    n.view = function () {
      var t = this.state.body;
      var e = {
        normal: this.state.position === jt.Position.NORMAL,
        minimized: this.state.position === jt.Position.MINIMIZED,
        fullScreen: this.state.position === jt.Position.FULLSCREEN,
        active: this.active,
        visible: this.state.isVisible()
      };
      var n = this.state.position === jt.Position.MINIMIZED ? this.state.show.bind(this.state) : undefined;
      return m("div", {
        className: "Composer " + Object(j.a)(e)
      }, m("div", {
        className: "Composer-handle",
        oncreate: this.configHandle.bind(this)
      }), m("ul", {
        className: "Composer-controls"
      }, Object(p.a)(this.controlItems().toArray())), m("div", {
        className: "Composer-content",
        onclick: n
      }, t.componentClass ? t.componentClass.component(Object(ft.a)({}, t.attrs, {
        composer: this.state,
        disabled: e.minimized
      })) : ""));
    };
    n.onupdate = function (e) {
      t.prototype.onupdate.call(this, e);
      if (this.state.position === this.prevPosition) {
        this.updateHeight();
      } else {
        this.animatePositionChange();
        this.prevPosition = this.state.position;
      }
    };
    n.oncreate = function (e) {
      var n = this;
      t.prototype.oncreate.call(this, e);
      this.initializeHeight();
      this.$().hide().css("bottom", -this.state.computedHeight());
      this.$().on("focus blur", ":input,.TextEditor-editorContainer", function (t) {
        n.active = t.type === "focusin";
        m.redraw();
      });
      this.$().on("keydown", ":input,.TextEditor-editorContainer", "esc", function () {
        return n.state.close();
      });
      this.handlers = {};
      $(window).on("resize", this.handlers.onresize = this.updateHeight.bind(this)).resize();
      $(document).on("mousemove", this.handlers.onmousemove = this.onmousemove.bind(this)).on("mouseup", this.handlers.onmouseup = this.onmouseup.bind(this));
    };
    n.onremove = function (e) {
      t.prototype.onremove.call(this, e);
      $(window).off("resize", this.handlers.onresize);
      $(document).off("mousemove", this.handlers.onmousemove).off("mouseup", this.handlers.onmouseup);
    };
    n.configHandle = function (t) {
      var e = this;
      $(t.dom).css("cursor", "row-resize").bind("dragstart mousedown", function (t) {
        return t.preventDefault();
      }).mousedown(function (t) {
        e.mouseStart = t.clientY;
        e.heightStart = e.$().height();
        e.handle = $(this);
        $("body").css("cursor", "row-resize");
      });
    };
    n.onmousemove = function (t) {
      if (this.handle) {
        var e = this.mouseStart - t.clientY;
        this.changeHeight(this.heightStart + e);
        var n = $(window).scrollTop();
        var i = n > 0 && n + $(window).height() >= $(document).height();
        this.updateBodyPadding(i);
      }
    };
    n.onmouseup = function () {
      if (this.handle) {
        this.handle = null;
        $("body").css("cursor", "");
      }
    };
    n.focus = function () {
      this.$(".Composer-content :input:enabled:visible, .TextEditor-editor").first().focus();
    };
    n.updateHeight = function () {
      var t = this.state.computedHeight();
      var e = this.$(".Composer-flexible");
      this.$().height(t);
      if (e.length) {
        var n = e.offset().top - this.$().offset().top;
        var i = parseInt(e.css("padding-bottom"), 10);
        var r = this.$(".Composer-footer").outerHeight(true);
        e.height(this.$().outerHeight() - n - i - r);
      }
    };
    n.updateBodyPadding = function () {
      var t = this.state.position !== jt.Position.HIDDEN && this.state.position !== jt.Position.MINIMIZED && app.screen() !== "phone" ? this.state.computedHeight() - parseInt($("#app").css("padding-bottom"), 10) : 0;
      $("#content").css({
        paddingBottom: t
      });
    };
    n.animatePositionChange = function () {
      if (this.prevPosition !== jt.Position.FULLSCREEN || this.state.position !== jt.Position.NORMAL) {
        switch (this.state.position) {
          case jt.Position.HIDDEN:
            return this.hide();
          case jt.Position.MINIMIZED:
            return this.minimize();
          case jt.Position.FULLSCREEN:
            return this.focus();
          case jt.Position.NORMAL:
            return this.show();
        }
      } else {
        this.focus();
      }
    };
    n.animateHeightChange = function () {
      var t = this.$().stop(true);
      var e = t.outerHeight();
      var n = $(window).scrollTop();
      t.show();
      this.updateHeight();
      var i = t.outerHeight();
      if (this.prevPosition === jt.Position.HIDDEN) {
        t.css({
          bottom: -i,
          height: i
        });
      } else {
        t.css({
          height: e
        });
      }
      var r = t.animate({
        bottom: 0,
        height: i
      }, "fast").promise();
      this.updateBodyPadding();
      $(window).scrollTop(n);
      return r;
    };
    n.showBackdrop = function () {
      this.$backdrop = $("<div/>").addClass("composer-backdrop").appendTo("body");
    };
    n.hideBackdrop = function () {
      if (this.$backdrop) {
        this.$backdrop.remove();
      }
    };
    n.show = function () {
      var t = this;
      this.animateHeightChange().then(function () {
        return t.focus();
      });
      if (app.screen() === "phone") {
        var e = document.documentElement;
        var n = Math.min(e.scrollTop, e.scrollHeight - e.clientHeight);
        this.$().css("top", $(".App").is(".mobile-safari") ? n : 0);
        this.showBackdrop();
      }
    };
    n.hide = function () {
      var t = this;
      var e = this.$();
      e.stop(true).animate({
        bottom: -e.height()
      }, "fast", function () {
        e.hide();
        t.hideBackdrop();
        t.updateBodyPadding();
      });
    };
    n.minimize = function () {
      this.animateHeightChange();
      this.$().css("top", "auto");
      this.hideBackdrop();
    };
    n.controlItems = function () {
      var t = new l.a();
      if (this.state.position === jt.Position.FULLSCREEN) {
        t.add("exitFullScreen", St.component({
          icon: "fas fa-compress",
          title: app.translator.trans("core.forum.composer.exit_full_screen_tooltip"),
          onclick: this.state.exitFullScreen.bind(this.state)
        }));
      } else {
        if (this.state.position !== jt.Position.MINIMIZED) {
          t.add("minimize", St.component({
            icon: "fas fa-minus minimize",
            title: app.translator.trans("core.forum.composer.minimize_tooltip"),
            onclick: this.state.minimize.bind(this.state),
            itemClassName: "App-backControl"
          }));
          t.add("fullScreen", St.component({
            icon: "fas fa-expand",
            title: app.translator.trans("core.forum.composer.full_screen_tooltip"),
            onclick: this.state.fullScreen.bind(this.state)
          }));
        }
        t.add("close", St.component({
          icon: "fas fa-times",
          title: app.translator.trans("core.forum.composer.close_tooltip"),
          onclick: this.state.close.bind(this.state)
        }));
      }
      return t;
    };
    n.initializeHeight = function () {
      this.state.height = localStorage.getItem("composerHeight");
      this.state.height ||= this.defaultHeight();
    };
    n.defaultHeight = function () {
      return this.$().height();
    };
    n.changeHeight = function (t) {
      this.state.height = t;
      this.updateHeight();
      localStorage.setItem("composerHeight", this.state.height);
    };
    return e;
  }(d.a);
  var Et = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.view = function () {
      var t = this;
      var e = this.attrs.notification;
      var n = this.href();
      return m(f.a, {
        className: Object(j.a)("Notification", "Notification--" + e.contentType(), [!e.isRead() && "unread"]),
        href: n,
        external: n.includes("://"),
        onclick: this.markAsRead.bind(this)
      }, Object(v.a)(e.fromUser()), Object(b.a)(this.icon(), {
        className: "Notification-icon"
      }), m("span", {
        className: "Notification-title"
      }, m("span", {
        className: "Notification-content"
      }, this.content()), m("span", {
        className: "Notification-title-spring"
      }), Object(N.a)(e.createdAt())), !e.isRead() && m(E.a, {
        className: "Notification-action Button Button--link",
        icon: "fas fa-check",
        title: app.translator.trans("core.forum.notifications.mark_as_read_tooltip"),
        onclick: function (e) {
          e.preventDefault();
          e.stopPropagation();
          t.markAsRead();
        }
      }), m("div", {
        className: "Notification-excerpt"
      }, this.excerpt()));
    };
    n.icon = function () {};
    n.href = function () {};
    n.content = function () {};
    n.excerpt = function () {};
    n.markAsRead = function () {
      if (!this.attrs.notification.isRead()) {
        app.session.user.pushAttributes({
          unreadNotificationCount: app.session.user.unreadNotificationCount() - 1
        });
        this.attrs.notification.save({
          isRead: true
        });
      }
    };
    return e;
  }(d.a);
  var Pt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.icon = function () {
      return "fas fa-pencil-alt";
    };
    n.href = function () {
      var t = this.attrs.notification;
      return app.route.discussion(t.subject(), t.content().postNumber);
    };
    n.content = function () {
      return app.translator.trans("core.forum.notifications.discussion_renamed_text", {
        user: this.attrs.notification.fromUser()
      });
    };
    return e;
  }(Et);
  function _t(t) {
    if (app.composer.isFullScreen()) {
      app.composer.minimize();
      t.stopPropagation();
    }
  }
  var Dt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    e.initAttrs = function (e) {
      t.initAttrs.call(this, e);
      e.submitLabel = e.submitLabel || app.translator.trans("core.forum.composer_edit.submit_button");
      e.confirmExit = e.confirmExit || app.translator.trans("core.forum.composer_edit.discard_confirmation");
      e.originalContent = e.originalContent || e.post.content();
      e.user = e.user || e.post.user();
      e.post.editedContent = e.originalContent;
    };
    var n = e.prototype;
    n.headerItems = function () {
      var e = t.prototype.headerItems.call(this);
      var n = this.attrs.post;
      e.add("title", m("h3", null, Object(b.a)("fas fa-pencil-alt"), " ", m(f.a, {
        href: app.route.discussion(n.discussion(), n.number()),
        onclick: _t
      }, app.translator.trans("core.forum.composer_edit.post_link", {
        number: n.number(),
        discussion: n.discussion().title()
      }))));
      return e;
    };
    n.jumpToPreview = function (t) {
      _t(t);
      m.route.set(app.route.post(this.attrs.post));
    };
    n.data = function () {
      return {
        content: this.composer.fields.content()
      };
    };
    n.onsubmit = function () {
      var t = this;
      var e = this.attrs.post.discussion();
      this.loading = true;
      var n = this.data();
      this.attrs.post.save(n).then(function (n) {
        if (app.viewingDiscussion(e)) {
          app.current.get("stream").goToNumber(n.number());
        } else {
          var i;
          var r = E.a.component({
            className: "Button Button--link",
            onclick: function () {
              m.route.set(app.route.post(n));
              app.alerts.dismiss(i);
            }
          }, app.translator.trans("core.forum.composer_edit.view_button"));
          i = app.alerts.show({
            type: "success",
            controls: [r]
          }, app.translator.trans("core.forum.composer_edit.edited_message"));
        }
        t.composer.hide();
      }, this.loaded.bind(this));
    };
    return e;
  }(A);
  var $t = {
    controls: function (t, e) {
      var n = this;
      var i = new l.a();
      ["user", "moderation", "destructive"].forEach(function (r) {
        var o = n[r + "Controls"](t, e).toArray();
        if (o.length) {
          o.forEach(function (t) {
            return i.add(t.itemName, t);
          });
          i.add(r + "Separator", U.a.component());
        }
      });
      return i;
    },
    userControls: function (t, e) {
      return new l.a();
    },
    moderationControls: function (t, e) {
      var n = new l.a();
      if (t.contentType() === "comment" && t.canEdit()) {
        if (!t.isHidden()) {
          n.add("edit", E.a.component({
            icon: "fas fa-pencil-alt",
            onclick: this.editAction.bind(t)
          }, app.translator.trans("core.forum.post_controls.edit_button")));
        }
      }
      return n;
    },
    destructiveControls: function (t, e) {
      var n = new l.a();
      if (t.contentType() !== "comment" || t.isHidden()) {
        if (t.contentType() === "comment" && t.canHide()) {
          n.add("restore", E.a.component({
            icon: "fas fa-reply",
            onclick: this.restoreAction.bind(t)
          }, app.translator.trans("core.forum.post_controls.restore_button")));
        }
        if (t.canDelete()) {
          n.add("delete", E.a.component({
            icon: "fas fa-times",
            onclick: this.deleteAction.bind(t, e)
          }, app.translator.trans("core.forum.post_controls.delete_forever_button")));
        }
      } else if (t.canHide()) {
        n.add("hide", E.a.component({
          icon: "far fa-trash-alt",
          onclick: this.hideAction.bind(t)
        }, app.translator.trans("core.forum.post_controls.delete_button")));
      }
      return n;
    },
    editAction: function () {
      var t = this;
      return new Promise(function (e) {
        app.composer.load(Dt, {
          post: t
        });
        app.composer.show();
        return e();
      });
    },
    hideAction: function () {
      if (confirm(Object(P.a)(app.translator.trans("core.forum.post_controls.hide_confirmation")))) {
        this.pushAttributes({
          hiddenAt: new Date(),
          hiddenUser: app.session.user
        });
        return this.save({
          isHidden: true
        }).then(function () {
          return m.redraw();
        });
      }
    },
    restoreAction: function () {
      this.pushAttributes({
        hiddenAt: null,
        hiddenUser: null
      });
      return this.save({
        isHidden: false
      }).then(function () {
        return m.redraw();
      });
    },
    deleteAction: function (t) {
      var e = this;
      if (confirm(Object(P.a)(app.translator.trans("core.forum.post_controls.delete_confirmation")))) {
        if (t) {
          t.loading = true;
        }
        return this.delete().then(function () {
          var t = e.discussion();
          t.removePost(e.id());
          if (!t.postIds().length) {
            app.discussions.removeDiscussion(t);
            if (app.viewingDiscussion(t)) {
              app.history.back();
            }
          }
        }).catch(function () {}).then(function () {
          if (t) {
            t.loading = false;
          }
          m.redraw();
        });
      }
    }
  };
  var It = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      var n = this;
      t.prototype.oninit.call(this, e);
      this.loading = false;
      this.subtree = new T.a(function () {
        return n.attrs.post.freshness;
      }, function () {
        var t = n.attrs.post.user();
        return t && t.freshness;
      }, function () {
        return n.controlsOpen;
      });
    };
    n.view = function () {
      var t = this;
      var e = this.elementAttrs();
      e.className = this.classes(e.className).join(" ");
      var n = $t.controls(this.attrs.post, this).toArray();
      return m("article", e, m("div", null, this.content(), m("aside", {
        className: "Post-actions"
      }, m("ul", null, Object(p.a)(this.actionItems().toArray()), n.length ? m("li", null, m(x.a, {
        className: "Post-controls",
        buttonClassName: "Button Button--icon Button--flat",
        menuClassName: "Dropdown-menu--right",
        icon: "fas fa-ellipsis-h",
        onshow: function () {
          return t.$(".Post-actions").addClass("open");
        },
        onhide: function () {
          return t.$(".Post-actions").removeClass("open");
        },
        accessibleToggleLabel: app.translator.trans("core.forum.post_controls.toggle_dropdown_accessible_label")
      }, n)) : "")), m("footer", {
        className: "Post-footer"
      }, m("ul", null, Object(p.a)(this.footerItems().toArray())))));
    };
    n.onbeforeupdate = function (e) {
      t.prototype.onbeforeupdate.call(this, e);
      return this.subtree.needsRebuild();
    };
    n.onupdate = function (e) {
      t.prototype.onupdate.call(this, e);
      var n = this.$(".Post-actions");
      var i = this.$(".Post-controls");
      n.toggleClass("open", i.hasClass("open"));
    };
    n.elementAttrs = function () {
      return {};
    };
    n.content = function () {
      return [];
    };
    n.classes = function (t) {
      var e = (t || "").split(" ").concat(["Post"]);
      var n = this.attrs.post.user();
      var i = this.attrs.post.discussion();
      if (this.loading) {
        e.push("Post--loading");
      }
      if (n && n === app.session.user) {
        e.push("Post--by-actor");
      }
      if (n && n === i.user()) {
        e.push("Post--by-start-user");
      }
      return e;
    };
    n.actionItems = function () {
      return new l.a();
    };
    n.footerItems = function () {
      return new l.a();
    };
    return e;
  }(d.a);
  var Mt = n(56);
  var Lt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.view = function (t) {
      return t.children[0];
    };
    n.oncreate = function (e) {
      t.prototype.oncreate.call(this, e);
      this.boundOnresize = this.onresize.bind(this);
      $(window).on("resize", this.boundOnresize).resize();
    };
    n.onremove = function (e) {
      t.prototype.onremove.call(this, e);
      $(window).off("resize", this.boundOnresize);
    };
    n.onresize = function () {
      var t = this;
      var e = this.$();
      var n = $("#header");
      var i = $("#footer");
      var r = e.find("> ul");
      $(window).off(".affix");
      r.removeClass("affix affix-top affix-bottom").removeData("bs.affix");
      if (!(e.outerHeight(true) > $(window).height() - n.outerHeight(true))) {
        r.affix({
          offset: {
            top: function () {
              return e.offset().top - n.outerHeight(true) - parseInt(e.css("margin-top"), 10);
            },
            bottom: function () {
              return t.bottom = i.outerHeight(true);
            }
          }
        });
      }
    };
    return e;
  }(d.a);
  var Rt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.user = null;
      this.bodyClass = "App--user";
    };
    n.view = function () {
      return m("div", {
        className: "UserPage"
      }, this.user ? [m(Ut, {
        user: this.user,
        className: "Hero UserHero",
        editable: this.user.canEdit() || this.user === app.session.user,
        controlsButtonClassName: "Button"
      }), m("div", {
        className: "container"
      }, m("div", {
        className: "sideNavContainer"
      }, m(Lt, null, m("nav", {
        className: "sideNav UserPage-nav"
      }, m("ul", null, Object(p.a)(this.sidebarItems().toArray())))), m("div", {
        className: "sideNavOffset UserPage-content"
      }, this.content())))] : [m(S.a, {
        display: "block"
      })]);
    };
    n.content = function () {};
    n.show = function (t) {
      this.user = t;
      app.current.set("user", t);
      app.setTitle(t.displayName());
      m.redraw();
    };
    n.loadUser = function (t) {
      var e = this;
      var n = t.toLowerCase();
      app.preloadedApiDocument();
      app.store.all("users").some(function (i) {
        if ((i.username().toLowerCase() === n || i.id() === t) && i.joinTime()) {
          e.show(i);
          return true;
        }
      });
      if (!this.user) {
        app.store.find("users", t, {
          bySlug: true
        }).then(this.show.bind(this));
      }
    };
    n.sidebarItems = function () {
      var t = new l.a();
      t.add("nav", m(gt.a, {
        className: "App-titleControl",
        buttonClassName: "Button"
      }, this.navItems().toArray()));
      return t;
    };
    n.navItems = function () {
      var t = new l.a();
      var e = this.user;
      t.add("posts", m(mt.a, {
        href: app.route("user.posts", {
          username: e.slug()
        }),
        icon: "far fa-comment"
      }, app.translator.trans("core.forum.user.posts_link"), " ", m("span", {
        className: "Button-badge"
      }, e.commentCount())), 100);
      t.add("discussions", m(mt.a, {
        href: app.route("user.discussions", {
          username: e.slug()
        }),
        icon: "fas fa-bars"
      }, app.translator.trans("core.forum.user.discussions_link"), " ", m("span", {
        className: "Button-badge"
      }, e.discussionCount())), 90);
      if (app.session.user === e) {
        t.add("separator", m(U.a, null), -90);
        t.add("settings", m(mt.a, {
          href: app.route("settings"),
          icon: "fas fa-cog"
        }, app.translator.trans("core.forum.user.settings_link")), -100);
      }
      return t;
    };
    return e;
  }(u.a);
  var Ht = {
    controls: function (t, e) {
      var n = this;
      var i = new l.a();
      ["user", "moderation", "destructive"].forEach(function (r) {
        var o = n[r + "Controls"](t, e).toArray();
        if (o.length) {
          o.forEach(function (t) {
            return i.add(t.itemName, t);
          });
          i.add(r + "Separator", m(U.a, null));
        }
      });
      return i;
    },
    userControls: function () {
      return new l.a();
    },
    moderationControls: function (t) {
      var e = new l.a();
      if (t.canEdit() || t.canEditCredentials() || t.canEditGroups()) {
        e.add("edit", m(E.a, {
          icon: "fas fa-pencil-alt",
          onclick: this.editAction.bind(this, t)
        }, app.translator.trans("core.forum.user_controls.edit_button")));
      }
      return e;
    },
    destructiveControls: function (t) {
      var e = new l.a();
      if (t.id() !== "1" && t.canDelete()) {
        e.add("delete", m(E.a, {
          icon: "fas fa-times",
          onclick: this.deleteAction.bind(this, t)
        }, app.translator.trans("core.forum.user_controls.delete_button")));
      }
      return e;
    },
    deleteAction: function (t) {
      var e = this;
      if (confirm(app.translator.trans("core.forum.user_controls.delete_confirmation"))) {
        t.delete().then(function () {
          e.showDeletionAlert(t, "success");
          if (app.current.matches(Rt, {
            user: t
          })) {
            app.history.back();
          } else {
            window.location.reload();
          }
        }).catch(function () {
          return e.showDeletionAlert(t, "error");
        });
      }
    },
    showDeletionAlert: function (t, e) {
      var n = t.data.attributes;
      var i = n.username;
      var r = n.email;
      var o = {
        success: "core.forum.user_controls.delete_success_message",
        error: "core.forum.user_controls.delete_error_message"
      }[e];
      app.alerts.show({
        type: e
      }, app.translator.trans(o, {
        username: i,
        email: r
      }));
    },
    editAction: function (t) {
      app.modal.show(Mt.a, {
        user: t
      });
    }
  };
  var Bt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.loading = false;
      this.isDraggedOver = false;
    };
    n.view = function () {
      var t = this.attrs.user;
      return m("div", {
        className: Object(j.a)(["AvatarEditor", "Dropdown", this.attrs.className, this.loading && "loading", this.isDraggedOver && "dragover"])
      }, Object(v.a)(t), m("a", {
        className: t.avatarUrl() ? "Dropdown-toggle" : "Dropdown-toggle AvatarEditor--noAvatar",
        title: app.translator.trans("core.forum.user.avatar_upload_tooltip"),
        "data-toggle": "dropdown",
        onclick: this.quickUpload.bind(this),
        ondragover: this.enableDragover.bind(this),
        ondragenter: this.enableDragover.bind(this),
        ondragleave: this.disableDragover.bind(this),
        ondragend: this.disableDragover.bind(this),
        ondrop: this.dropUpload.bind(this)
      }, this.loading ? m(S.a, {
        display: "unset",
        size: "large"
      }) : t.avatarUrl() ? Object(b.a)("fas fa-pencil-alt") : Object(b.a)("fas fa-plus-circle")), m("ul", {
        className: "Dropdown-menu Menu"
      }, Object(p.a)(this.controlItems().toArray())));
    };
    n.controlItems = function () {
      var t = new l.a();
      t.add("upload", m(E.a, {
        icon: "fas fa-upload",
        onclick: this.openPicker.bind(this)
      }, app.translator.trans("core.forum.user.avatar_upload_button")));
      t.add("remove", m(E.a, {
        icon: "fas fa-times",
        onclick: this.remove.bind(this)
      }, app.translator.trans("core.forum.user.avatar_remove_button")));
      return t;
    };
    n.enableDragover = function (t) {
      t.preventDefault();
      t.stopPropagation();
      this.isDraggedOver = true;
    };
    n.disableDragover = function (t) {
      t.preventDefault();
      t.stopPropagation();
      this.isDraggedOver = false;
    };
    n.dropUpload = function (t) {
      t.preventDefault();
      t.stopPropagation();
      this.isDraggedOver = false;
      this.upload(t.dataTransfer.files[0]);
    };
    n.quickUpload = function (t) {
      if (!this.attrs.user.avatarUrl()) {
        t.preventDefault();
        t.stopPropagation();
        this.openPicker();
      }
    };
    n.openPicker = function () {
      var t = this;
      if (!this.loading) {
        $("<input type=\"file\">").appendTo("body").hide().click().on("input", function (e) {
          t.upload($(e.target)[0].files[0]);
        });
      }
    };
    n.upload = function (t) {
      if (!this.loading) {
        var e = this.attrs.user;
        var n = new FormData();
        n.append("avatar", t);
        this.loading = true;
        m.redraw();
        app.request({
          method: "POST",
          url: app.forum.attribute("apiUrl") + "/users/" + e.id() + "/avatar",
          serialize: function (t) {
            return t;
          },
          body: n
        }).then(this.success.bind(this), this.failure.bind(this));
      }
    };
    n.remove = function () {
      var t = this.attrs.user;
      this.loading = true;
      m.redraw();
      app.request({
        method: "DELETE",
        url: app.forum.attribute("apiUrl") + "/users/" + t.id() + "/avatar"
      }).then(this.success.bind(this), this.failure.bind(this));
    };
    n.success = function (t) {
      app.store.pushPayload(t);
      delete this.attrs.user.avatarColor;
      this.loading = false;
      m.redraw();
    };
    n.failure = function (t) {
      this.loading = false;
      m.redraw();
    };
    return e;
  }(d.a);
  var Ut = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.view = function () {
      var t = this.attrs.user;
      var e = Ht.controls(t, this).toArray();
      var n = t.color();
      var i = t.badges().toArray();
      return m("div", {
        className: "UserCard " + (this.attrs.className || ""),
        style: n ? {
          backgroundColor: n
        } : ""
      }, m("div", {
        className: "darkenBackground"
      }, m("div", {
        className: "container"
      }, e.length ? x.a.component({
        className: "UserCard-controls App-primaryControl",
        menuClassName: "Dropdown-menu--right",
        buttonClassName: this.attrs.controlsButtonClassName,
        label: app.translator.trans("core.forum.user_controls.button"),
        accessibleToggleLabel: app.translator.trans("core.forum.user_controls.toggle_dropdown_accessible_label"),
        icon: "fas fa-ellipsis-v"
      }, e) : "", m("div", {
        className: "UserCard-profile"
      }, m("h2", {
        className: "UserCard-identity"
      }, this.attrs.editable ? [Bt.component({
        user: t,
        className: "UserCard-avatar"
      }), Object(et.a)(t)] : m(f.a, {
        href: app.route.user(t)
      }, m("div", {
        className: "UserCard-avatar"
      }, Object(v.a)(t)), Object(et.a)(t))), i.length ? m("ul", {
        className: "UserCard-badges badges"
      }, Object(p.a)(i)) : "", m("ul", {
        className: "UserCard-info"
      }, Object(p.a)(this.infoItems().toArray()))))));
    };
    n.infoItems = function () {
      var t = new l.a();
      var e = this.attrs.user;
      var n = e.lastSeenAt();
      if (n) {
        var i = e.isOnline();
        t.add("lastSeen", m("span", {
          className: "UserCard-lastSeen" + (i ? " online" : "")
        }, i ? [Object(b.a)("fas fa-circle"), " ", app.translator.trans("core.forum.user.online_text")] : [Object(b.a)("far fa-clock"), " ", Object(y.a)(n)]));
      }
      t.add("joined", app.translator.trans("core.forum.user.joined_date_text", {
        ago: Object(y.a)(e.joinTime())
      }));
      return t;
    };
    return e;
  }(d.a);
  var Ft = n(87);
  var qt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.view = function () {
      var t = this.attrs.post;
      var e = t.user();
      if (!e) {
        return m("div", {
          className: "PostUser"
        }, m("h3", null, Object(v.a)(e, {
          className: "PostUser-avatar"
        }), " ", Object(et.a)(e)));
      }
      var n = "";
      if (!t.isHidden() && this.attrs.cardVisible) {
        n = Ut.component({
          user: e,
          className: "UserCard--popover",
          controlsButtonClassName: "Button Button--icon Button--flat"
        });
      }
      return m("div", {
        className: "PostUser"
      }, m("h3", null, m(f.a, {
        href: app.route.user(e)
      }, Object(v.a)(e, {
        className: "PostUser-avatar"
      }), Object(Ft.a)(e), Object(et.a)(e))), m("ul", {
        className: "PostUser-badges badges"
      }, Object(p.a)(e.badges().toArray())), n);
    };
    n.oncreate = function (e) {
      var n;
      var i = this;
      t.prototype.oncreate.call(this, e);
      this.$().on("mouseover", "h3 a, .UserCard", function () {
        clearTimeout(n);
        n = setTimeout(i.showCard.bind(i), 500);
      }).on("mouseout", "h3 a, .UserCard", function () {
        clearTimeout(n);
        n = setTimeout(i.hideCard.bind(i), 250);
      });
    };
    n.showCard = function () {
      var t = this;
      this.attrs.oncardshow();
      setTimeout(function () {
        return t.$(".UserCard").addClass("in");
      });
    };
    n.hideCard = function () {
      var t = this;
      this.$(".UserCard").removeClass("in").one("transitionend webkitTransitionEnd oTransitionEnd", function () {
        t.attrs.oncardhide();
      });
    };
    return e;
  }(d.a);
  var zt = n(88);
  var Wt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.view = function () {
      var t = this.attrs.post;
      var e = t.createdAt();
      var n = this.getPermalink(t);
      var i = "ontouchstart" in document.documentElement;
      return m("div", {
        className: "Dropdown PostMeta"
      }, m("a", {
        className: "Dropdown-toggle",
        onclick: function (t) {
          var e = this;
          setTimeout(function () {
            return $(e).parent().find(".PostMeta-permalink").select();
          });
          t.redraw = false;
        },
        "data-toggle": "dropdown"
      }, Object(N.a)(e)), m("div", {
        className: "Dropdown-menu dropdown-menu"
      }, m("span", {
        className: "PostMeta-number"
      }, app.translator.trans("core.forum.post.number_tooltip", {
        number: t.number()
      })), " ", m("span", {
        className: "PostMeta-time"
      }, Object(zt.a)(e)), " ", m("span", {
        className: "PostMeta-ip"
      }, t.data.attributes.ipAddress), i ? m("a", {
        className: "Button PostMeta-permalink",
        href: n
      }, n) : m("input", {
        className: "FormControl PostMeta-permalink",
        value: n,
        onclick: function (t) {
          return t.stopPropagation();
        }
      })));
    };
    n.getPermalink = function (t) {
      return window.location.origin + app.route.post(t);
    };
    return e;
  }(d.a);
  var Vt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
    };
    n.view = function () {
      var t = this.attrs.post;
      var e = t.editedUser();
      var n = app.translator.trans("core.forum.post.edited_tooltip", {
        user: e,
        ago: Object(y.a)(t.editedAt())
      });
      return m(V.a, {
        text: n
      }, m("span", {
        class: "PostEdited"
      }, app.translator.trans("core.forum.post.edited_text")));
    };
    n.oncreate = function (e) {
      t.prototype.oncreate.call(this, e);
    };
    return e;
  }(d.a);
  var Yt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      var n = this;
      t.prototype.oninit.call(this, e);
      this.revealContent = false;
      this.cardVisible = false;
      this.subtree.check(function () {
        return n.cardVisible;
      }, function () {
        return n.isEditing();
      }, function () {
        return n.revealContent;
      });
    };
    n.content = function () {
      return t.prototype.content.call(this).concat([m("header", {
        className: "Post-header"
      }, m("ul", null, Object(p.a)(this.headerItems().toArray()))), m("div", {
        className: "Post-body"
      }, this.isEditing() ? m(nt, {
        className: "Post-preview",
        composer: app.composer
      }) : m.trust(this.attrs.post.contentHtml()))]);
    };
    n.refreshContent = function () {
      var t = this.isEditing() ? "" : this.attrs.post.contentHtml();
      if (this.contentHtml !== t) {
        this.$(".Post-body script").each(function () {
          var t = document.createElement("script");
          t.textContent = this.textContent;
          Array.from(this.attributes).forEach(function (e) {
            return t.setAttribute(e.name, e.value);
          });
          this.parentNode.replaceChild(t, this);
        });
      }
      this.contentHtml = t;
    };
    n.oncreate = function (e) {
      t.prototype.oncreate.call(this, e);
      this.refreshContent();
    };
    n.onupdate = function (e) {
      t.prototype.onupdate.call(this, e);
      this.refreshContent();
    };
    n.isEditing = function () {
      return app.composer.bodyMatches(Dt, {
        post: this.attrs.post
      });
    };
    n.elementAttrs = function () {
      var e = this.attrs.post;
      var n = t.prototype.elementAttrs.call(this);
      n.className = (n.className || "") + " " + Object(j.a)({
        CommentPost: true,
        "Post--hidden": e.isHidden(),
        "Post--edited": e.isEdited(),
        revealContent: this.revealContent,
        editing: this.isEditing()
      });
      return n;
    };
    n.toggleContent = function () {
      this.revealContent = !this.revealContent;
    };
    n.headerItems = function () {
      var t = this;
      var e = new l.a();
      var n = this.attrs.post;
      e.add("user", qt.component({
        post: n,
        cardVisible: this.cardVisible,
        oncardshow: function () {
          t.cardVisible = true;
          m.redraw();
        },
        oncardhide: function () {
          t.cardVisible = false;
          m.redraw();
        }
      }), 100);
      e.add("meta", Wt.component({
        post: n
      }));
      if (n.isEdited() && !n.isHidden()) {
        e.add("edited", Vt.component({
          post: n
        }));
      }
      if (n.isHidden()) {
        e.add("toggle", E.a.component({
          className: "Button Button--default Button--more",
          icon: "fas fa-ellipsis-h",
          onclick: this.toggleContent.bind(this)
        }));
      }
      return e;
    };
    return e;
  }(It);
  var Gt = n(31);
  var Kt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.elementAttrs = function () {
      var e = t.prototype.elementAttrs.call(this);
      e.className = (e.className || "") + " EventPost " + Object(Gt.ucfirst)(this.attrs.post.contentType()) + "Post";
      return e;
    };
    n.content = function () {
      var e = this.attrs.post.user();
      var n = Object(et.a)(e);
      var i = Object.assign(this.descriptionData(), {
        user: e,
        username: e ? m(f.a, {
          className: "EventPost-user",
          href: app.route.user(e)
        }, n) : n
      });
      return t.prototype.content.call(this).concat([Object(b.a)(this.icon(), {
        className: "EventPost-icon"
      }), m("div", {
        class: "EventPost-info"
      }, this.description(i))]);
    };
    n.icon = function () {
      return "";
    };
    n.description = function (t) {
      return app.translator.trans(this.descriptionKey(), t);
    };
    n.descriptionKey = function () {
      return "";
    };
    n.descriptionData = function () {
      return {};
    };
    return e;
  }(It);
  var Xt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.icon = function () {
      return "fas fa-pencil-alt";
    };
    n.description = function (t) {
      var e = app.translator.trans("core.forum.post_stream.discussion_renamed_text", t);
      var n = app.translator.trans("core.forum.post_stream.discussion_renamed_old_tooltip", t);
      return m("span", {
        title: Object(P.a)(n)
      }, e);
    };
    n.descriptionData = function () {
      var t = this.attrs.post;
      var e = t.content()[0];
      var n = t.content()[1];
      return {
        old: e,
        new: m("strong", {
          className: "DiscussionRenamedPost-new"
        }, n)
      };
    };
    return e;
  }(Kt);
  n(40);
  var Jt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.hidden = localStorage.getItem("welcomeHidden");
    };
    n.view = function () {
      var t = this;
      if (this.hidden) {
        return m("div", null);
      }
      return m("header", {
        className: "Hero WelcomeHero"
      }, m("div", {
        class: "container"
      }, E.a.component({
        icon: "fas fa-times",
        onclick: function () {
          t.$().slideUp(t.hide.bind(t));
        },
        className: "Hero-close Button Button--icon Button--link"
      }), m("div", {
        className: "containerNarrow"
      }, m("h2", {
        className: "Hero-title"
      }, app.forum.attribute("welcomeTitle")), m("div", {
        className: "Hero-subtitle"
      }, m.trust(app.forum.attribute("welcomeMessage"))))));
    };
    n.hide = function () {
      localStorage.setItem("welcomeHidden", "true");
      this.hidden = true;
    };
    return e;
  }(d.a);
  var Qt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    e.initAttrs = function (e) {
      t.initAttrs.call(this, e);
      e.placeholder = e.placeholder || Object(P.a)(app.translator.trans("core.forum.composer_discussion.body_placeholder"));
      e.submitLabel = e.submitLabel || app.translator.trans("core.forum.composer_discussion.submit_button");
      e.confirmExit = e.confirmExit || Object(P.a)(app.translator.trans("core.forum.composer_discussion.discard_confirmation"));
      e.titlePlaceholder = e.titlePlaceholder || Object(P.a)(app.translator.trans("core.forum.composer_discussion.title_placeholder"));
      e.className = "ComposerBody--discussion";
    };
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.composer.fields.title = this.composer.fields.title || Object(M.a)("");
      this.title = this.composer.fields.title;
    };
    n.headerItems = function () {
      var e = t.prototype.headerItems.call(this);
      e.add("title", m("h3", null, app.translator.trans("core.forum.composer_discussion.title")), 100);
      e.add("discussionTitle", m("h3", null, m("input", {
        className: "FormControl",
        bidi: this.title,
        placeholder: this.attrs.titlePlaceholder,
        disabled: !!this.attrs.disabled,
        onkeydown: this.onkeydown.bind(this)
      })));
      return e;
    };
    n.onkeydown = function (t) {
      if (t.which === 13) {
        t.preventDefault();
        this.composer.editor.moveCursorTo(0);
      }
      t.redraw = false;
    };
    n.hasChanges = function () {
      return this.title() || this.composer.fields.content();
    };
    n.data = function () {
      return {
        title: this.title(),
        content: this.composer.fields.content()
      };
    };
    n.onsubmit = function () {
      var t = this;
      this.loading = true;
      var e = this.data();
      app.store.createRecord("discussions").save(e).then(function (e) {
        t.composer.hide();
        app.discussions.refresh({
          deferClear: true
        });
        m.route.set(app.route.discussion(e));
      }, this.loaded.bind(this));
    };
    return e;
  }(A);
  var Zt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (n) {
      t.prototype.oninit.call(this, n);
      if (app.previous.matches(pt)) {
        this.lastDiscussion = app.previous.get("discussion");
      }
      if (app.previous.matches(e)) {
        app.discussions.clear();
      }
      app.discussions.refreshParams(app.search.params(), m.route.param("page"));
      app.history.push("index", app.translator.trans("core.forum.header.back_to_index_tooltip"));
      this.bodyClass = "App--index";
      this.scrollTopOnCreate = false;
    };
    n.view = function () {
      return m("div", {
        className: "IndexPage"
      }, this.hero(), m("div", {
        className: "container"
      }, m("div", {
        className: "sideNavContainer"
      }, m("nav", {
        className: "IndexPage-nav sideNav"
      }, m("ul", null, Object(p.a)(this.sidebarItems().toArray()))), m("div", {
        className: "IndexPage-results sideNavOffset"
      }, m("div", {
        className: "IndexPage-toolbar"
      }, m("ul", {
        className: "IndexPage-toolbar-view"
      }, Object(p.a)(this.viewItems().toArray())), m("ul", {
        className: "IndexPage-toolbar-action"
      }, Object(p.a)(this.actionItems().toArray()))), m(X, {
        state: app.discussions
      })))));
    };
    n.setTitle = function () {
      app.setTitle(app.translator.trans("core.forum.index.meta_title_text"));
      app.setTitleCount(0);
    };
    n.oncreate = function (e) {
      t.prototype.oncreate.call(this, e);
      this.setTitle();
      var n = app.cache.heroHeight;
      var i = app.cache.heroHeight = this.$(".Hero").outerHeight() || 0;
      var r = app.cache.scrollTop;
      $("#app").css("min-height", $(window).height() + i);
      if (app.previous.type != null && (app.screen() == "desktop" || app.screen() == "desktop-hd" || this.lastDiscussion ? $(window).scrollTop(r - n + i) : $(window).scrollTop(0), this.lastDiscussion)) {
        var o = this.$("li[data-id=\"" + this.lastDiscussion.id() + "\"] .DiscussionListItem");
        if (o.length) {
          var s = $("#header").outerHeight();
          var a = $(window).height();
          var c = o.offset().top;
          var u = c + o.outerHeight();
          if (c < r + s || u > r + a) {
            $(window).scrollTop(c - s);
          }
        }
      }
    };
    n.onbeforeremove = function (e) {
      t.prototype.onbeforeremove.call(this, e);
      app.cache.scrollTop = $(window).scrollTop();
    };
    n.onremove = function (e) {
      t.prototype.onremove.call(this, e);
      $("#app").css("min-height", "");
    };
    n.hero = function () {
      return Jt.component();
    };
    n.sidebarItems = function () {
      var t = this;
      var e = new l.a();
      var n = app.forum.attribute("canStartDiscussion") || !app.session.user;
      e.add("newDiscussion", E.a.component({
        icon: "fas fa-edit",
        className: "Button Button--primary IndexPage-newDiscussion",
        itemClassName: "App-primaryControl",
        onclick: function () {
          return t.newDiscussionAction().catch(function () {});
        },
        disabled: !n
      }, app.translator.trans(n ? "core.forum.index.start_discussion_button" : "core.forum.index.cannot_start_discussion_button")));
      e.add("nav", gt.a.component({
        buttonClassName: "Button",
        className: "App-titleControl",
        accessibleToggleLabel: app.translator.trans("core.forum.index.toggle_sidenav_dropdown_accessible_label")
      }, this.navItems(this).toArray()));
      return e;
    };
    n.navItems = function () {
      var t = new l.a();
      var e = app.search.stickyParams();
      t.add("allDiscussions", mt.a.component({
        href: app.route("index", e),
        icon: "far fa-comments"
      }, app.translator.trans("core.forum.index.all_discussions_link")), 100);
      return t;
    };
    n.viewItems = function () {
      var t = new l.a();
      var e = app.discussions.sortMap();
      var n = {};
      for (var i in e) {
        n[i] = app.translator.trans("core.forum.index_sort." + i + "_button");
      }
      t.add("sort", x.a.component({
        buttonClassName: "Button",
        label: n[app.search.params().sort] || Object.keys(e).map(function (t) {
          return n[t];
        })[0],
        accessibleToggleLabel: app.translator.trans("core.forum.index_sort.toggle_dropdown_accessible_label")
      }, Object.keys(n).map(function (t) {
        var i = n[t];
        var r = (app.search.params().sort || Object.keys(e)[0]) === t;
        return E.a.component({
          icon: !r || "fas fa-check",
          onclick: app.search.changeSort.bind(app.search, t),
          active: r
        }, i);
      })));
      return t;
    };
    n.actionItems = function () {
      var t = new l.a();
      t.add("refresh", E.a.component({
        title: app.translator.trans("core.forum.index.refresh_tooltip"),
        icon: "fas fa-sync",
        className: "Button Button--icon",
        onclick: function () {
          app.discussions.refresh();
          if (app.session.user) {
            app.store.find("users", app.session.user.id());
            m.redraw();
          }
        }
      }));
      if (app.session.user) {
        t.add("markAllAsRead", E.a.component({
          title: app.translator.trans("core.forum.index.mark_all_as_read_tooltip"),
          icon: "fas fa-check",
          className: "Button Button--icon",
          onclick: this.markAllAsRead.bind(this)
        }));
      }
      return t;
    };
    n.newDiscussionAction = function () {
      return new Promise(function (t, e) {
        if (app.session.user) {
          app.composer.load(Qt, {
            user: app.session.user
          });
          app.composer.show();
          return t(app.composer);
        } else {
          app.modal.show(B);
          return e();
        }
      });
    };
    n.markAllAsRead = function () {
      if (confirm(app.translator.trans("core.forum.index.mark_all_as_read_confirmation"))) {
        app.session.user.save({
          markedAllAsReadAt: new Date()
        });
      }
    };
    return e;
  }(u.a);
  Zt.providesInitialSearch = true;
  var te = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.loading = true;
      this.moreResults = false;
      this.posts = [];
      this.loadLimit = 20;
      this.loadUser(m.route.param("username"));
    };
    n.content = function () {
      if (this.posts.length !== 0 || this.loading) {
        if (this.loading) {
          t = m(S.a, null);
        } else if (this.moreResults) {
          t = m("div", {
            className: "PostsUserPage-loadMore"
          }, m(E.a, {
            className: "Button",
            onclick: this.loadMore.bind(this)
          }, app.translator.trans("core.forum.user.posts_load_more_button")));
        }
        return m("div", {
          className: "PostsUserPage"
        }, m("ul", {
          className: "PostsUserPage-list"
        }, this.posts.map(function (t) {
          return m("li", null, m("div", {
            className: "PostsUserPage-discussion"
          }, app.translator.trans("core.forum.user.in_discussion_text", {
            discussion: m(f.a, {
              href: app.route.post(t)
            }, t.discussion().title())
          })), m(Yt, {
            post: t
          }));
        })), m("div", {
          className: "PostsUserPage-loadMore"
        }, t));
      } else {
        return m("div", {
          className: "PostsUserPage"
        }, m(G.a, {
          text: app.translator.trans("core.forum.user.posts_empty_text")
        }));
      }
      var t;
    };
    n.show = function (e) {
      t.prototype.show.call(this, e);
      this.refresh();
    };
    n.refresh = function () {
      this.loading = true;
      this.posts = [];
      m.redraw();
      this.loadResults().then(this.parseResults.bind(this));
    };
    n.loadResults = function (t) {
      return app.store.find("posts", {
        filter: {
          author: this.user.username(),
          type: "comment"
        },
        page: {
          offset: t,
          limit: this.loadLimit
        },
        sort: "-createdAt"
      });
    };
    n.loadMore = function () {
      this.loading = true;
      this.loadResults(this.posts.length).then(this.parseResults.bind(this));
    };
    n.parseResults = function (t) {
      this.loading = false;
      [].push.apply(this.posts, t);
      this.moreResults = t.length >= this.loadLimit;
      m.redraw();
      return t;
    };
    return e;
  }(Rt);
  function ee(t, e) {
    for (var n = 0; n < e.length; n++) {
      var i = e[n];
      i.enumerable = i.enumerable || false;
      i.configurable = true;
      if ("value" in i) {
        i.writable = true;
      }
      Object.defineProperty(t, i.key, i);
    }
  }
  function ne(t, e, n) {
    if (e) {
      ee(t.prototype, e);
    }
    if (n) {
      ee(t, n);
    }
    return t;
  }
  var ie = n(57);
  function re(t, e) {
    var n = typeof Symbol != "undefined" && t[Symbol.iterator] || t["@@iterator"];
    if (n) {
      return (n = n.call(t)).next.bind(n);
    }
    if (Array.isArray(t) || (n = function (t, e) {
      if (!t) {
        return;
      }
      if (typeof t == "string") {
        return oe(t, e);
      }
      var n = Object.prototype.toString.call(t).slice(8, -1);
      if (n === "Object" && t.constructor) {
        n = t.constructor.name;
      }
      if (n === "Map" || n === "Set") {
        return Array.from(t);
      }
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
        return oe(t, e);
      }
    }(t)) || e && t && typeof t.length == "number") {
      if (n) {
        t = n;
      }
      var i = 0;
      return function () {
        if (i >= t.length) {
          return {
            done: true
          };
        } else {
          return {
            done: false,
            value: t[i++]
          };
        }
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function oe(t, e) {
    if (e == null || e > t.length) {
      e = t.length;
    }
    for (var n = 0, i = new Array(e); n < e; n++) {
      i[n] = t[n];
    }
    return i;
  }
  var se = function (t) {
    function e(e, n) {
      var i;
      (i = t.call(this, e, n, 20) || this).extraDiscussions = [];
      return i;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.requestParams = function () {
      var t = {
        include: ["user", "lastPostedUser"],
        filter: {}
      };
      t.sort = this.sortMap()[this.params.sort];
      if (this.params.q) {
        t.filter.q = this.params.q;
        t.include.push("mostRelevantPost", "mostRelevantPost.user");
      }
      return t;
    };
    n.loadPage = function (e = 1) {
      var n = app.preloadedApiDocument();
      if (n) {
        this.initialLoading = false;
        return Promise.resolve(n);
      } else {
        return t.prototype.loadPage.call(this, e);
      }
    };
    n.clear = function () {
      t.prototype.clear.call(this);
      this.extraDiscussions = [];
    };
    n.sortMap = function () {
      var t = {};
      if (this.params.q) {
        t.relevance = "";
      }
      t.latest = "-lastPostedAt";
      t.top = "-commentCount";
      t.newest = "-createdAt";
      t.oldest = "createdAt";
      return t;
    };
    n.isSearchResults = function () {
      return !!this.params.q;
    };
    n.removeDiscussion = function (t) {
      for (var e, n = re(this.pages); !(e = n()).done;) {
        var i = e.value;
        var r = i.items.indexOf(t);
        if (r !== -1) {
          i.items.splice(r, 1);
          break;
        }
      }
      var o = this.extraDiscussions.indexOf(t);
      if (o !== -1) {
        this.extraDiscussions.splice(o);
      }
      m.redraw();
    };
    n.addDiscussion = function (t) {
      this.removeDiscussion(t);
      this.extraDiscussions.unshift(t);
      m.redraw();
    };
    n.getAllItems = function () {
      return this.extraDiscussions.concat(t.prototype.getAllItems.call(this));
    };
    n.getPages = function () {
      var e = t.prototype.getPages.call(this);
      if (this.extraDiscussions.length) {
        return [{
          number: -1,
          items: this.extraDiscussions
        }].concat(e);
      } else {
        return e;
      }
    };
    ne(e, [{
      key: "type",
      get: function () {
        return "discussions";
      }
    }]);
    return e;
  }(ie.a);
  var ae = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.loadUser(m.route.param("username"));
    };
    n.show = function (e) {
      t.prototype.show.call(this, e);
      this.state = new se({
        q: "author:" + e.username(),
        sort: "newest"
      });
      this.state.refresh();
    };
    n.content = function () {
      return m("div", {
        className: "DiscussionsUserPage"
      }, X.component({
        state: this.state
      }));
    };
    return e;
  }(Rt);
  var ce = n(36);
  var ue = n(41);
  var le = n(45);
  var de = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.methods = this.notificationMethods().toArray();
      this.loading = {};
      this.types = this.notificationTypes().toArray();
    };
    n.view = function () {
      var t = this;
      var e = this.attrs.user.preferences();
      return m("table", {
        className: "NotificationGrid"
      }, m("thead", null, m("tr", null, m("td", null), this.methods.map(function (e) {
        return m("th", {
          className: "NotificationGrid-groupToggle",
          onclick: t.toggleMethod.bind(t, e.name)
        }, Object(b.a)(e.icon), " ", e.label);
      }))), m("tbody", null, this.types.map(function (n) {
        return m("tr", null, m("td", {
          className: "NotificationGrid-groupToggle",
          onclick: t.toggleType.bind(t, n.name)
        }, Object(b.a)(n.icon), " ", n.label), t.methods.map(function (i) {
          var r = t.preferenceKey(n.name, i.name);
          return m("td", {
            className: "NotificationGrid-checkbox"
          }, m(le.a, {
            state: !!e[r],
            loading: t.loading[r],
            disabled: !(r in e),
            onchange: t.toggle.bind(t, [r])
          }));
        }));
      })));
    };
    n.oncreate = function (e) {
      t.prototype.oncreate.call(this, e);
      this.$("thead .NotificationGrid-groupToggle").bind("mouseenter mouseleave", function (t) {
        var e = parseInt($(this).index(), 10) + 1;
        $(this).parents("table").find("td:nth-child(" + e + ")").toggleClass("highlighted", t.type === "mouseenter");
      });
      this.$("tbody .NotificationGrid-groupToggle").bind("mouseenter mouseleave", function (t) {
        $(this).parent().find("td").toggleClass("highlighted", t.type === "mouseenter");
      });
    };
    n.toggle = function (t) {
      var e = this;
      var n = this.attrs.user;
      var i = n.preferences();
      var r = !i[t[0]];
      t.forEach(function (t) {
        e.loading[t] = true;
        i[t] = r;
      });
      m.redraw();
      n.save({
        preferences: i
      }).then(function () {
        t.forEach(function (t) {
          return e.loading[t] = false;
        });
        m.redraw();
      });
    };
    n.toggleMethod = function (t) {
      var e = this;
      var n = this.types.map(function (n) {
        return e.preferenceKey(n.name, t);
      }).filter(function (t) {
        return t in e.attrs.user.preferences();
      });
      this.toggle(n);
    };
    n.toggleType = function (t) {
      var e = this;
      var n = this.methods.map(function (n) {
        return e.preferenceKey(t, n.name);
      }).filter(function (t) {
        return t in e.attrs.user.preferences();
      });
      this.toggle(n);
    };
    n.preferenceKey = function (t, e) {
      return "notify_" + t + "_" + e;
    };
    n.notificationMethods = function () {
      var t = new l.a();
      t.add("alert", {
        name: "alert",
        icon: "fas fa-bell",
        label: app.translator.trans("core.forum.settings.notify_by_web_heading")
      });
      t.add("email", {
        name: "email",
        icon: "far fa-envelope",
        label: app.translator.trans("core.forum.settings.notify_by_email_heading")
      });
      return t;
    };
    n.notificationTypes = function () {
      var t = new l.a();
      t.add("discussionRenamed", {
        name: "discussionRenamed",
        icon: "fas fa-pencil-alt",
        label: app.translator.trans("core.forum.settings.notify_discussion_renamed_label")
      });
      return t;
    };
    return e;
  }(d.a);
  var pe = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.className = function () {
      return "ChangePasswordModal Modal--small";
    };
    n.title = function () {
      return app.translator.trans("core.forum.change_password.title");
    };
    n.content = function () {
      return m("div", {
        className: "Modal-body"
      }, m("div", {
        className: "Form Form--centered"
      }, m("p", {
        className: "helpText"
      }, app.translator.trans("core.forum.change_password.text")), m("div", {
        className: "Form-group"
      }, E.a.component({
        className: "Button Button--primary Button--block",
        type: "submit",
        loading: this.loading
      }, app.translator.trans("core.forum.change_password.send_button")))));
    };
    n.onsubmit = function (t) {
      t.preventDefault();
      this.loading = true;
      app.request({
        method: "POST",
        url: app.forum.attribute("apiUrl") + "/forgot",
        body: {
          email: app.session.user.email()
        }
      }).then(this.hide.bind(this), this.loaded.bind(this));
    };
    return e;
  }(I.a);
  var he = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.success = false;
      this.email = Object(M.a)(app.session.user.email());
      this.password = Object(M.a)("");
    };
    n.className = function () {
      return "ChangeEmailModal Modal--small";
    };
    n.title = function () {
      return app.translator.trans("core.forum.change_email.title");
    };
    n.content = function () {
      if (this.success) {
        return m("div", {
          className: "Modal-body"
        }, m("div", {
          className: "Form Form--centered"
        }, m("p", {
          className: "helpText"
        }, app.translator.trans("core.forum.change_email.confirmation_message", {
          email: m("strong", null, this.email())
        })), m("div", {
          className: "Form-group"
        }, m(E.a, {
          className: "Button Button--primary Button--block",
          onclick: this.hide.bind(this)
        }, app.translator.trans("core.forum.change_email.dismiss_button")))));
      } else {
        return m("div", {
          className: "Modal-body"
        }, m("div", {
          className: "Form Form--centered"
        }, m("div", {
          className: "Form-group"
        }, m("input", {
          type: "email",
          name: "email",
          className: "FormControl",
          placeholder: app.session.user.email(),
          bidi: this.email,
          disabled: this.loading
        })), m("div", {
          className: "Form-group"
        }, m("input", {
          type: "password",
          name: "password",
          className: "FormControl",
          placeholder: app.translator.trans("core.forum.change_email.confirm_password_placeholder"),
          bidi: this.password,
          disabled: this.loading
        })), m("div", {
          className: "Form-group"
        }, E.a.component({
          className: "Button Button--primary Button--block",
          type: "submit",
          loading: this.loading
        }, app.translator.trans("core.forum.change_email.submit_button")))));
      }
    };
    n.onsubmit = function (t) {
      var e = this;
      t.preventDefault();
      if (this.email() !== app.session.user.email()) {
        this.loading = true;
        this.alertAttrs = null;
        app.session.user.save({
          email: this.email()
        }, {
          errorHandler: this.onerror.bind(this),
          meta: {
            password: this.password()
          }
        }).then(function () {
          e.success = true;
        }).catch(function () {}).then(this.loaded.bind(this));
      } else {
        this.hide();
      }
    };
    n.onerror = function (e) {
      if (e.status === 401) {
        e.alert.content = app.translator.trans("core.forum.change_email.incorrect_password_message");
      }
      t.prototype.onerror.call(this, e);
    };
    return e;
  }(I.a);
  var fe = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.show(app.session.user);
      app.setTitle(app.translator.trans("core.forum.settings.title"));
    };
    n.content = function () {
      return m("div", {
        className: "SettingsPage"
      }, m("ul", null, Object(p.a)(this.settingsItems().toArray())));
    };
    n.settingsItems = function () {
      var t = this;
      var e = new l.a();
      ["account", "notifications", "privacy"].forEach(function (n) {
        e.add(n, m(ue.a, {
          className: "Settings-" + n,
          label: app.translator.trans("core.forum.settings." + n + "_heading")
        }, t[n + "Items"]().toArray()));
      });
      return e;
    };
    n.accountItems = function () {
      var t = new l.a();
      t.add("changePassword", m(E.a, {
        className: "Button",
        onclick: function () {
          return app.modal.show(pe);
        }
      }, app.translator.trans("core.forum.settings.change_password_button")));
      t.add("changeEmail", m(E.a, {
        className: "Button",
        onclick: function () {
          return app.modal.show(he);
        }
      }, app.translator.trans("core.forum.settings.change_email_button")));
      return t;
    };
    n.notificationsItems = function () {
      var t = new l.a();
      t.add("notificationGrid", m(de, {
        user: this.user
      }));
      return t;
    };
    n.privacyItems = function () {
      var t = this;
      var e = new l.a();
      e.add("discloseOnline", m(ce.a, {
        state: this.user.preferences().discloseOnline,
        onchange: function (e) {
          t.discloseOnlineLoading = true;
          t.user.savePreferences({
            discloseOnline: e
          }).then(function () {
            t.discloseOnlineLoading = false;
            m.redraw();
          });
        },
        loading: this.discloseOnlineLoading
      }, app.translator.trans("core.forum.settings.privacy_disclose_online_label")));
      return e;
    };
    return e;
  }(Rt);
  var me = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      app.history.push("notifications");
      app.notifications.load();
      this.bodyClass = "App--notifications";
    };
    n.view = function () {
      return m("div", {
        className: "NotificationsPage"
      }, m(bt, {
        state: app.notifications
      }));
    };
    return e;
  }(u.a);
  var ve = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.canonicalizeDiscussionSlug = function (t) {
      if (t) {
        return t.split("-")[0];
      }
    };
    n.makeKey = function () {
      var t = Object(ft.a)({}, m.route.param());
      if ("near" in t) {
        delete t.near;
      }
      t.id = this.canonicalizeDiscussionSlug(t.id);
      return this.routeName.replace(".near", "") + JSON.stringify(t);
    };
    n.onmatch = function (n, i, r) {
      if (app.current.matches(pt) && this.canonicalizeDiscussionSlug(n.id) === this.canonicalizeDiscussionSlug(m.route.param("id"))) {
        e.scrollToPostNumber = n.near || "1";
      }
      return t.prototype.onmatch.call(this, n, i, r);
    };
    n.render = function (n) {
      if (e.scrollToPostNumber !== null) {
        var i = e.scrollToPostNumber;
        setTimeout(function () {
          return app.current.get("stream").goToNumber(i);
        });
        e.scrollToPostNumber = null;
      }
      return t.prototype.render.call(this, n);
    };
    return e;
  }(n(38).a);
  ve.scrollToPostNumber = null;
  function ge(t) {
    t.routes = {
      index: {
        path: "/all",
        component: Zt
      },
      discussion: {
        path: "/d/:id",
        component: pt,
        resolverClass: ve
      },
      "discussion.near": {
        path: "/d/:id/:near",
        component: pt,
        resolverClass: ve
      },
      user: {
        path: "/u/:username",
        component: te
      },
      "user.posts": {
        path: "/u/:username",
        component: te
      },
      "user.discussions": {
        path: "/u/:username/discussions",
        component: ae
      },
      settings: {
        path: "/settings",
        component: fe
      },
      notifications: {
        path: "/notifications",
        component: me
      }
    };
    t.route.discussion = function (e, n) {
      return t.route(n && n !== 1 ? "discussion.near" : "discussion", {
        id: e.slug(),
        near: n && n !== 1 ? n : undefined
      });
    };
    t.route.post = function (e) {
      return t.route.discussion(e.discussion(), e.number());
    };
    t.route.user = function (e) {
      return t.route("user", {
        username: e.slug()
      });
    };
  }
  var be = n(27);
  function ye(t) {
    var e = t.session.user;
    if (e && !e.isEmailConfirmed()) {
      var n = function (n) {
        function i() {
          return n.apply(this, arguments) || this;
        }
        Object(o.a)(i, n);
        var r = i.prototype;
        r.oninit = function (t) {
          n.prototype.oninit.call(this, t);
          this.loading = false;
          this.sent = false;
        };
        r.view = function () {
          return m(E.a, {
            class: "Button Button--link",
            onclick: this.onclick.bind(this),
            loading: this.loading,
            disabled: this.sent
          }, this.sent ? [Object(b.a)("fas fa-check"), " ", t.translator.trans("core.forum.user_email_confirmation.sent_message")] : t.translator.trans("core.forum.user_email_confirmation.resend_button"));
        };
        r.onclick = function () {
          var n = this;
          this.loading = true;
          m.redraw();
          t.request({
            method: "POST",
            url: t.forum.attribute("apiUrl") + "/users/" + e.id() + "/send-confirmation"
          }).then(function () {
            n.loading = false;
            n.sent = true;
            m.redraw();
          }).catch(function () {
            n.loading = false;
            m.redraw();
          });
        };
        return i;
      }(d.a);
      var i = function (t) {
        function e() {
          return t.apply(this, arguments) || this;
        }
        Object(o.a)(e, t);
        e.prototype.view = function (e) {
          var n = t.prototype.view.call(this, e);
          return Object(ft.a)({}, n, {
            children: [m("div", {
              className: "container"
            }, n.children)]
          });
        };
        return e;
      }(be.a);
      m.mount($("<div/>").insertBefore("#content")[0], {
        view: function () {
          return m(i, {
            dismissible: false,
            controls: [m(n, null)]
          }, t.translator.trans("core.forum.user_email_confirmation.alert_message", {
            email: m("strong", null, e.email())
          }));
        }
      });
    }
  }
  var we = n(75);
  var xe = n(49);
  var Ne = function (t) {
    function e() {
      return t.call(this, {}, 1, 10) || this;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.load = function () {
      if (app.session.user.newNotificationCount()) {
        this.pages = [];
        this.location = {
          page: 1
        };
      }
      if (this.pages.length > 0) {
        return Promise.resolve();
      } else {
        app.session.user.pushAttributes({
          newNotificationCount: 0
        });
        return t.prototype.loadNext.call(this);
      }
    };
    n.markAllAsRead = function () {
      if (this.pages.length !== 0) {
        app.session.user.pushAttributes({
          unreadNotificationCount: 0
        });
        this.pages.forEach(function (t) {
          t.items.forEach(function (t) {
            return t.pushAttributes({
              isRead: true
            });
          });
        });
        return app.request({
          url: app.forum.attribute("apiUrl") + "/notifications/read",
          method: "POST"
        });
      }
    };
    ne(e, [{
      key: "type",
      get: function () {
        return "notifications";
      }
    }]);
    return e;
  }(ie.a);
  var Ce = n(22);
  var Te = function () {
    function t(t = []) {
      this.cachedSearches = undefined;
      this.value = "";
      this.cachedSearches = new Set(t);
    }
    var e = t.prototype;
    e.getInitialSearch = function () {
      return "";
    };
    e.getValue = function () {
      return this.value;
    };
    e.setValue = function (t) {
      this.value = t;
    };
    e.clear = function () {
      this.setValue("");
    };
    e.cache = function (t) {
      this.cachedSearches.add(t);
    };
    e.isCached = function (t) {
      return this.cachedSearches.has(t);
    };
    return t;
  }();
  var Se = function (t) {
    function e(e) {
      var n;
      if (e === undefined) {
        e = [];
      }
      (n = t.call(this, e) || this).initialValueSet = false;
      return n;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.getValue = function () {
      if (!this.initialValueSet && this.currPageProvidesSearch()) {
        this.intializeValue();
      }
      return t.prototype.getValue.call(this);
    };
    n.intializeValue = function () {
      this.setValue(this.getInitialSearch());
      this.initialValueSet = true;
    };
    n.currPageProvidesSearch = function () {
      return app.current.type && app.current.type.providesInitialSearch;
    };
    n.getInitialSearch = function () {
      if (this.currPageProvidesSearch()) {
        return this.params().q;
      } else {
        return "";
      }
    };
    n.clear = function () {
      t.prototype.clear.call(this);
      if (this.getInitialSearch()) {
        this.clearInitialSearch();
      } else {
        m.redraw();
      }
    };
    n.clearInitialSearch = function () {
      var t = this.params();
      t.q;
      var e = Object(Ce.a)(t, ["q"]);
      Object(s.a)(app.route(app.current.get("routeName"), e));
    };
    n.stickyParams = function () {
      return {
        sort: m.route.param("sort"),
        q: m.route.param("q")
      };
    };
    n.params = function () {
      var t = this.stickyParams();
      t.filter = m.route.param("filter");
      return t;
    };
    n.changeSort = function (t) {
      var e = this.params();
      if (t === Object.keys(app.discussions.sortMap())[0]) {
        delete e.sort;
      } else {
        e.sort = t;
      }
      Object(s.a)(app.route(app.current.get("routeName"), e));
    };
    return e;
  }(Te);
  var Oe = function (t) {
    function e() {
      var e;
      (e = t.call(this) || this).notificationComponents = {
        discussionRenamed: Pt
      };
      e.postComponents = {
        comment: Yt,
        discussionRenamed: Xt
      };
      e.pane = null;
      e.drawer = null;
      e.history = new a();
      e.notifications = new Ne(Object(r.a)(e));
      e.search = new Se();
      e.composer = new jt();
      ge(Object(r.a)(e));
      e.discussions = new se({});
      return e;
    }
    Object(o.a)(e, t);
    var n = e.prototype;
    n.mount = function () {
      var e = this;
      var n = this.forum.attribute("defaultRoute");
      var i = "index";
      for (var r in this.routes) {
        if (this.routes[r].path === n) {
          i = r;
        }
      }
      this.routes[i].path = "/";
      this.history.push(i, this.translator.trans("core.forum.header.back_to_index_tooltip"), "/");
      this.pane = new c(document.getElementById("app"));
      m.route.prefix = "";
      t.prototype.mount.call(this, this.forum.attribute("basePath"));
      m.mount(document.getElementById("app-navigation"), {
        view: function () {
          return xe.a.component({
            className: "App-backControl",
            drawer: true
          });
        }
      });
      m.mount(document.getElementById("header-navigation"), xe.a);
      m.mount(document.getElementById("header-primary"), ht);
      m.mount(document.getElementById("header-secondary"), Tt);
      m.mount(document.getElementById("composer"), {
        view: function () {
          return At.component({
            state: e.composer
          });
        }
      });
      ye(this);
      $("#home-link").click(function (t) {
        if (!t.ctrlKey && !t.metaKey && t.which !== 2) {
          t.preventDefault();
          app.history.home();
          if (app.session.user) {
            app.store.find("users", app.session.user.id());
            m.redraw();
          }
        }
      });
      if ("ontouchstart" in window && navigator.vendor && navigator.vendor.includes("Apple") && navigator.userAgent && !navigator.userAgent.includes("CriOS") && !navigator.userAgent.includes("FxiOS")) {
        $(function () {
          $(".App").addClass("mobile-safari");
        });
      }
    };
    n.viewingDiscussion = function (t) {
      return this.current.matches(pt, {
        discussion: t
      });
    };
    n.authenticationComplete = function (t) {
      if (t.loggedIn) {
        window.location.reload();
      } else {
        this.modal.show(H, t);
      }
    };
    return e;
  }(we.a);
  var ke = new Oe();
  window.app = ke;
  var je = ke;
  var Ae = n(109);
  var Ee = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    e.initAttrs = function (e) {
      e.className = (e.className || "") + " LogInButton";
      e.onclick = function () {
        var t = $(window);
        window.open(app.forum.attribute("baseUrl") + e.path, "logInPopup", "width=580,height=400,top=" + (t.height() / 2 - 200) + ",left=" + (t.width() / 2 - 290) + ",status=no,scrollbars=yes,resizable=no");
      };
      t.initAttrs.call(this, e);
    };
    return e;
  }(E.a);
  var Pe = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(o.a)(e, t);
    e.prototype.view = function () {
      var t = this.attrs.post;
      var e = t.user();
      var n = Object(g.a)(t.contentPlain(), this.attrs.highlight, 300);
      return m(f.a, {
        className: "PostPreview",
        href: app.route.post(t),
        onclick: this.attrs.onclick
      }, m("span", {
        className: "PostPreview-content"
      }, Object(v.a)(e), Object(et.a)(e), " ", m("span", {
        className: "PostPreview-excerpt"
      }, n)));
    };
    return e;
  }(d.a);
  var _e = n(44);
  var De = Object.assign(Ae.a, {
    "utils/PostControls": $t,
    "utils/KeyboardNavigatable": wt,
    "utils/slidable": z,
    "utils/History": a,
    "utils/DiscussionControls": q,
    "utils/alertEmailConfirmation": ye,
    "utils/UserControls": Ht,
    "utils/Pane": c,
    "utils/BasicEditorDriver": _e.a,
    "states/ComposerState": jt,
    "states/DiscussionListState": se,
    "states/GlobalSearchState": Se,
    "states/NotificationListState": Ne,
    "states/PostStreamState": dt,
    "states/SearchState": Te,
    "components/AffixedSidebar": Lt,
    "components/DiscussionPage": pt,
    "components/DiscussionListPane": Q,
    "components/LogInModal": B,
    "components/ComposerBody": A,
    "components/ForgotPasswordModal": L,
    "components/Notification": Et,
    "components/LogInButton": Ee,
    "components/DiscussionsUserPage": ae,
    "components/Composer": At,
    "components/SessionDropdown": vt,
    "components/HeaderPrimary": ht,
    "components/PostEdited": Vt,
    "components/PostStream": rt,
    "components/ChangePasswordModal": pe,
    "components/IndexPage": Zt,
    "components/DiscussionRenamedNotification": Pt,
    "components/DiscussionsSearchSource": xt,
    "components/HeaderSecondary": Tt,
    "components/ComposerButton": St,
    "components/DiscussionList": X,
    "components/ReplyPlaceholder": it,
    "components/AvatarEditor": Bt,
    "components/Post": It,
    "components/SettingsPage": fe,
    "components/TerminalPost": C,
    "components/ChangeEmailModal": he,
    "components/NotificationsDropdown": yt,
    "components/UserPage": Rt,
    "components/PostUser": qt,
    "components/UserCard": Ut,
    "components/UsersSearchSource": Nt,
    "components/NotificationGrid": de,
    "components/PostPreview": Pe,
    "components/EventPost": Kt,
    "components/DiscussionHero": h,
    "components/PostMeta": Wt,
    "components/DiscussionRenamedPost": Xt,
    "components/DiscussionComposer": Qt,
    "components/LogInButtons": R,
    "components/NotificationList": bt,
    "components/WelcomeHero": Jt,
    "components/SignUpModal": H,
    "components/CommentPost": Yt,
    "components/ComposerPostPreview": nt,
    "components/ReplyComposer": D,
    "components/NotificationsPage": me,
    "components/PostStreamScrubber": st,
    "components/EditPostComposer": Dt,
    "components/RenameDiscussionModal": F,
    "components/Search": Ct,
    "components/DiscussionListItem": Y,
    "components/LoadingPost": tt,
    "components/PostsUserPage": te,
    "resolvers/DiscussionPageResolver": ve,
    routes: ge,
    ForumApplication: Oe
  });
  var $e = n(73);
  De.app = je;
  var Ie = Object($e.a)(De, "forum");
}]);
(function () {
  var HINT = {
    EMOTICONS_NOT_AFTER: 0,
    LITEDOWN_DECODE_HTML_ENTITIES: 0,
    PREG_HAS_PASSTHROUGH: false,
    RULE_AUTO_CLOSE: 1,
    RULE_AUTO_REOPEN: 1,
    RULE_BREAK_PARAGRAPH: 1,
    RULE_CREATE_PARAGRAPHS: 1,
    RULE_DISABLE_AUTO_BR: 1,
    RULE_ENABLE_AUTO_BR: 1,
    RULE_IGNORE_TAGS: 1,
    RULE_IGNORE_TEXT: 1,
    RULE_IGNORE_WHITESPACE: 1,
    RULE_IS_TRANSPARENT: 1,
    RULE_PREVENT_BR: 1,
    RULE_SUSPEND_AUTO_BR: 1,
    RULE_TRIM_FIRST_LINE: 1,
    attributeDefaultValue: 0,
    closeAncestor: 0,
    closeParent: 1,
    createChild: 1,
    fosterParent: 1,
    hash: 1,
    ignoreAttrs: 1,
    namespaces: 0,
    onRender: 1,
    onUpdate: 1,
    regexp: 1,
    regexpLimit: 1,
    requireAncestor: 0
  };
  var o553403F9 = [0];
  var oF6AF222C = [32623];
  var o8DE1CD10 = [32587];
  var oA385316A = [16705];
  var oBB818D5A = [23885];
  var oB565876D = {
    flags: 2
  };
  var o939F1698 = {
    flags: 514
  };
  var oA80287CC = {
    flags: 3089
  };
  var o1BC3EAF4 = {
    filterChain: [],
    required: false
  };
  var o02D8DBB5 = {
    filterChain: [],
    required: true
  };
  var oD4869BFF = {
    B: 1,
    C: 1,
    COLOR: 1,
    EM: 1,
    EMAIL: 1,
    I: 1,
    S: 1,
    SIZE: 1,
    STRONG: 1,
    U: 1,
    URL: 1
  };
  var oF3C6FA42 = {
    closeParent: oD4869BFF,
    flags: 3349
  };
  var oDF43256F = [function (attrValue, attrName) {
    return NumericFilter.filterUint(attrValue);
  }];
  function o118B31AC(tag, tagConfig) {
    return filterAttributes(tag, tagConfig, registeredVars, logger);
  }
  var o1B4F5B52 = [o118B31AC];
  var o56E79363 = [function (attrValue, attrName) {
    return RegexpFilter.filter(attrValue, /^[-0-9A-Za-z_]+$/);
  }];
  function o6377B813(attrValue, attrName) {
    return RegexpFilter.filter(attrValue, /^[- +,.0-9A-Za-z_]+$/);
  }
  var o75AB9259 = {
    filterChain: oDF43256F,
    required: false
  };
  var o6CB0A318 = {
    filterChain: oDF43256F,
    required: true
  };
  var oE2346708 = {
    filterChain: o56E79363,
    required: true
  };
  var oABCFC4A3 = {
    filterChain: [o6377B813],
    required: true
  };
  var oF307D35C = {
    filterChain: [function (attrValue, attrName) {
      return UrlFilter.filter(attrValue, registeredVars.urlConfig, logger);
    }],
    required: true
  };
  var o1AF69066 = {
    closeParent: oD4869BFF,
    flags: 268,
    fosterParent: oD4869BFF
  };
  var o5DB432B1 = {
    allowed: o8DE1CD10,
    attributes: {},
    bitNumber: 3,
    filterChain: o1B4F5B52,
    nestingLimit: 10,
    rules: oB565876D,
    tagLimit: 5000
  };
  var o8988A276 = {
    allowed: o8DE1CD10,
    attributes: {},
    bitNumber: 3,
    filterChain: o1B4F5B52,
    nestingLimit: 10,
    rules: {
      flags: 0
    },
    tagLimit: 5000
  };
  var o1262D8F4 = {
    allowed: o8DE1CD10,
    attributes: {},
    bitNumber: 2,
    filterChain: o1B4F5B52,
    nestingLimit: 10,
    rules: {
      closeParent: oD4869BFF,
      flags: 260,
      fosterParent: oD4869BFF
    },
    tagLimit: 5000
  };
  var xsl = "<xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"><xsl:output method=\"html\" encoding=\"utf-8\" indent=\"no\"/><xsl:decimal-format decimal-separator=\".\"/><xsl:param$pDISCUSSION_URL\">https://forum.sys32.dev/d/</xsl:param><xsl:param$pPROFILE_URL\">https://forum.sys32.dev/u/</xsl:param>$aB|DEL|EM|H1|H2|H3|H4|H5|H6|I|LI|S|STRONG|SUB|SUP|U|p\"><xsl:element$p{translate(name(),'BDEGHILMNOPRSTU','bdeghilmnoprstu')}\">$b</xsl:element>$c$aC\"><code>$b</code>$c$aCENTER\"><div$ktext-align:center\">$b</div>$c$aCODE\"><pre data-s9e-livepreview-hash=\"\" data-s9e-livepreview-onupdate=\"if(typeof hljsLoader!=='undefined')hljsLoader.highlightBlocks(this)\"><code><xsl:if$f@lang\"><xsl:attribute$pclass\">language-$d@lang\"/></xsl:attribute></xsl:if>$b</code><script async=\"\" crossorigin=\"anonymous\" data-hljs-style=\"github-gist\" data-s9e-livepreview-onrender=\"if(typeof hljsLoader!=='undefined')this.parentNode.removeChild(this)\" integrity=\"sha384-ApZEJ0Xp885xfW2XkSo/ExMDLktFehU+dHjw7BJHxQCFf1PBDYVkMo8qZSO5lqoa\" onload=\"hljsLoader.highlightBlocks(this.parentNode)\" src=\"https://cdn.jsdelivr.net/gh/s9e/hljs-loader@1.0.22/loader.min.js\"/></pre>$c$aCOLOR\"><span$kcolor:{@color}\">$b</span>$c$aE\"><$n><$g$f.=':)'\">🙂</$g><$g$f.=':D'\">😃</$g><$g$f.=':P'\">😛</$g><$g$f.=':('\">🙁</$g><$g$f.=':|'\">😐</$g><$g$f.=';)'\">😉</$g><$g$f.=&quot;:'(&quot;\">😢</$g><$g$f.=':O'\">😮</$g><$g$f.='&gt;:('\">😡</$g><$j>$d.\"/></$j></$n>$c$aEMAIL\"><a href=\"mailto:{@email}\">$b</a>$c$aESC\">$b$c$aHR\"><hr/>$c$aIMG\"><img src=\"{@src}\" title=\"{@title}\" alt=\"{@alt}\">$hheight|@width\"/></img>$c$aISPOILER\"><span$espoiler\"$iclass\" onclick=\"removeAttribute('class')\">$b</span>$c$aLIST\"><$n><$g$fnot(@type)\"><ul>$b</ul></$g><$g$fstarts-with(@type,'decimal')or starts-with(@type,'lower')or starts-with(@type,'upper')\"><ol$k$o>$hstart\"/>$b</ol></$g><$j><ul$k$o>$b</ul></$j></$n>$c$aPOSTMENTION\"><$n><$g$f@deleted!=1\"><a href=\"{$DISCUSSION_URL}{@discussionid}/{@number}\"$ePostMention\" data-id=\"{@id}\">$d$l\"/></a></$g><$j><span$ePostMention PostMention--deleted\" data-id=\"{@id}\">$d$l\"/></span></$j></$n>$c$aQUOTE\"><blockquote><xsl:if$fnot(@author)\"><xsl:attribute$pclass\">uncited</xsl:attribute></xsl:if><div><xsl:if$f@author\"><cite>$d@author\"/> wrote:</cite></xsl:if>$b</div></blockquote>$c$aSIZE\"><span$kfont-size:{@size}px\">$b</span>$c$aSPOILER\"><details$espoiler\"$iopen\">$b</details>$c$aUPL-FILE\"><div$eButtonGroup\"$m{@uuid}\"><div$eButton hasIcon Button--icon Button--primary\"><i$efas fa-download\"/></div><div$eButton\">$d@content\"/></div><div$eButton\">$d@size\"/></div></div>$c$aUPL-IMAGE\"><div$efof-download row\"$m{@uuid}\"><div$ecard\"><div$ewrapper\"$kbackground:url({@url}) center / cover no-repeat\"><div$eheader\"><ul$emenu-content\"><li><div$efar fa-hdd\"><span>$d@size\"/></span></div></li></ul></div><div$edata\"><div$econtent\"><h4$etitle\">$d@content\"/></h4><div$eButton Button--primary Button-icon Button--block\"><i$efas fa-download\"/></div></div></div></div></div></div>$c$aUPL-IMAGE-PREVIEW\"><img src=\"{@url}\" title=\"{@base_name}\"/>$c$aURL\"><a href=\"{@url}\" rel=\" nofollow ugc\">$htitle\"/>$b</a>$c$aUSERMENTION\"><$n><$g$f@deleted!=1\"><a href=\"{$PROFILE_URL}{@slug}\"$eUserMention\">@$d$l\"/></a></$g><$j><span$eUserMention UserMention--deleted\">@$d$l\"/></span></$j></$n>$c$abr\"><br/>$c$ae|i|s\"/></xsl:stylesheet>".replace(/\$[a-p]/g, function (k) {
    return {
      $a: "<xsl:template match=\"",
      $b: "<xsl:apply-templates/>",
      $c: "</xsl:template>",
      $d: "<xsl:value-of select=\"",
      $e: " class=\"",
      $f: " test=\"",
      $g: "xsl:when",
      $h: "<xsl:copy-of select=\"@",
      $i: " data-s9e-livepreview-ignore-attrs=\"",
      $j: "xsl:otherwise",
      $k: " style=\"",
      $l: "@displayname",
      $m: " data-fof-upload-download-uuid=\"",
      $n: "xsl:choose",
      $o: "list-style-type:{@type}\"",
      $p: " name=\""
    }[k];
  });
  var EmailFilter = {
    filter: function (attrValue) {
      if (/^[-\w.+]+@[-\w.]+$/.test(attrValue)) {
        return attrValue;
      } else {
        return false;
      }
    }
  };
  var FalseFilter = {
    filter: function (attrValue) {
      return false;
    }
  };
  var HashmapFilter = {
    filter: function (attrValue, map, strict) {
      if (attrValue in map) {
        return map[attrValue];
      }
      if (strict) {
        return false;
      } else {
        return attrValue;
      }
    }
  };
  var MapFilter = {
    filter: function (attrValue, map) {
      var i = -1;
      var cnt = map.length;
      while (++i < cnt) {
        if (map[i][0].test(attrValue)) {
          return map[i][1];
        }
      }
      return attrValue;
    }
  };
  var NetworkFilter = {
    filterIp: function (attrValue) {
      if (/^[\d.]+$/.test(attrValue)) {
        return NetworkFilter.filterIpv4(attrValue);
      }
      if (/^[\da-f:]+$/i.test(attrValue)) {
        return NetworkFilter.filterIpv6(attrValue);
      }
      return false;
    },
    filterIpport: function (attrValue) {
      var m;
      var ip;
      if (m = /^\[([\da-f:]+)(\]:[1-9]\d*)$/i.exec(attrValue)) {
        ip = NetworkFilter.filterIpv6(m[1]);
        if (ip === false) {
          return false;
        }
        return "[" + ip + m[2];
      }
      if (m = /^([\d.]+)(:[1-9]\d*)$/.exec(attrValue)) {
        ip = NetworkFilter.filterIpv4(m[1]);
        if (ip === false) {
          return false;
        }
        return ip + m[2];
      }
      return false;
    },
    filterIpv4: function (attrValue) {
      if (!/^\d+\.\d+\.\d+\.\d+$/.test(attrValue)) {
        return false;
      }
      var i = 4;
      var p = attrValue.split(".");
      while (--i >= 0) {
        if (p[i][0] === "0" || p[i] > 255) {
          return false;
        }
      }
      return attrValue;
    },
    filterIpv6: function (attrValue) {
      if (/^([\da-f]{0,4}:){2,7}(?:[\da-f]{0,4}|\d+\.\d+\.\d+\.\d+)$/.test(attrValue)) {
        return attrValue;
      } else {
        return false;
      }
    }
  };
  var NumericFilter = {
    filterFloat: function (attrValue) {
      if (/^(?:0|-?[1-9]\d*)(?:\.\d+)?(?:e[1-9]\d*)?$/i.test(attrValue)) {
        return attrValue;
      } else {
        return false;
      }
    },
    filterInt: function (attrValue) {
      if (/^(?:0|-?[1-9]\d*)$/.test(attrValue)) {
        return attrValue;
      } else {
        return false;
      }
    },
    filterRange: function (attrValue, min, max, logger) {
      if (!/^(?:0|-?[1-9]\d*)$/.test(attrValue)) {
        return false;
      }
      attrValue = parseInt(attrValue, 10);
      if (attrValue < min) {
        if (logger) {
          logger.warn("Value outside of range, adjusted up to min value", {
            attrValue: attrValue,
            min: min,
            max: max
          });
        }
        return min;
      }
      if (attrValue > max) {
        if (logger) {
          logger.warn("Value outside of range, adjusted down to max value", {
            attrValue: attrValue,
            min: min,
            max: max
          });
        }
        return max;
      }
      return attrValue;
    },
    filterUint: function (attrValue) {
      if (/^(?:0|[1-9]\d*)$/.test(attrValue)) {
        return attrValue;
      } else {
        return false;
      }
    }
  };
  var RegexpFilter = {
    filter: function (attrValue, regexp) {
      if (regexp.test(attrValue)) {
        return attrValue;
      } else {
        return false;
      }
    }
  };
  var TimestampFilter = {
    filter: function (attrValue) {
      var m = /^(?=\d)(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(attrValue);
      if (m) {
        return (m[1] || 0) * 3600 + (m[2] || 0) * 60 + (+m[3] || 0);
      }
      return NumericFilter.filterUint(attrValue);
    }
  };
  var UrlFilter = {
    filter: function (attrValue, urlConfig, logger) {
      var p = UrlFilter.parseUrl(attrValue.replace(/^\s+/, "").replace(/\s+$/, ""));
      var error = UrlFilter.validateUrl(urlConfig, p);
      if (error) {
        if (logger) {
          p.attrValue = attrValue;
          logger.err(error, p);
        }
        return false;
      }
      return UrlFilter.rebuildUrl(urlConfig, p);
    },
    parseUrl: function (url) {
      var regexp = /^(?:([a-z][-+.\w]*):)?(?:\/\/(?:([^:\/?#]*)(?::([^\/?#]*)?)?@)?(?:(\[[a-f\d:]+\]|[^:\/?#]+)(?::(\d*))?)?(?![^\/?#]))?([^?#]*)(\?[^#]*)?(#.*)?$/i;
      var m = regexp.exec(url);
      var parts = {};
      var tokens = ["scheme", "user", "pass", "host", "port", "path", "query", "fragment"];
      tokens.forEach(function (name, i) {
        parts[name] = m[i + 1] > "" ? m[i + 1] : "";
      });
      parts.scheme = parts.scheme.toLowerCase();
      parts.host = parts.host.replace(/[\u3002\uff0e\uff61]/g, ".").replace(/\.+$/g, "");
      if (/[^\x00-\x7F]/.test(parts.host) && typeof punycode !== "undefined") {
        parts.host = punycode.toASCII(parts.host);
      }
      return parts;
    },
    rebuildUrl: function (urlConfig, p) {
      var url = "";
      if (p.scheme !== "") {
        url += p.scheme + ":";
      }
      if (p.host !== "") {
        url += "//";
        if (p.user !== "") {
          url += rawurlencode(decodeURIComponent(p.user));
          if (p.pass !== "") {
            url += ":" + rawurlencode(decodeURIComponent(p.pass));
          }
          url += "@";
        }
        url += p.host;
        if (p.port !== "") {
          url += ":" + p.port;
        }
      } else if (p.scheme === "file") {
        url += "//";
      }
      var path = p.path + p.query + p.fragment;
      path = path.replace(/%.?[a-f]/g, function (str) {
        return str.toUpperCase();
      }, path);
      url += UrlFilter.sanitizeUrl(path);
      if (!p.scheme) {
        url = url.replace(/^([^\/]*):/, "$1%3A");
      }
      return url;
    },
    sanitizeUrl: function (url) {
      return url.replace(/[^\u0020-\u007E]+/g, encodeURIComponent).replace(/%(?![0-9A-Fa-f]{2})|[^!#-&*-;=?-Z_a-z~]/g, function (m) {
        return "%" + m[0].charCodeAt(0).toString(16).toUpperCase();
      });
    },
    validateUrl: function (urlConfig, p) {
      if (p.scheme !== "" && !urlConfig.allowedSchemes.test(p.scheme)) {
        return "URL scheme is not allowed";
      }
      if (p.host !== "") {
        var regexp = /^(?!-)[-a-z0-9]{0,62}[a-z0-9](?:\.(?!-)[-a-z0-9]{0,62}[a-z0-9])*$/i;
        if (!regexp.test(p.host)) {
          if (!NetworkFilter.filterIpv4(p.host) && !NetworkFilter.filterIpv6(p.host.replace(/^\[(.*)\]$/, "$1", p.host))) {
            return "URL host is invalid";
          }
        }
        if (urlConfig.disallowedHosts && urlConfig.disallowedHosts.test(p.host) || urlConfig.restrictedHosts && !urlConfig.restrictedHosts.test(p.host)) {
          return "URL host is not allowed";
        }
      } else if (/^(?:(?:f|ht)tps?)$/.test(p.scheme)) {
        return "Missing host";
      }
    }
  };
  function html_entity_decode(str) {
    var b = document.createElement("b");
    html_entity_decode = function (str) {
      b.innerHTML = str.replace(/</g, "&lt;");
      return b.textContent;
    };
    return html_entity_decode(str);
  }
  function htmlspecialchars_compat(str) {
    var t = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "\"": "&quot;"
    };
    return str.replace(/[<>&"]/g, function (c) {
      return t[c];
    });
  }
  function htmlspecialchars_noquotes(str) {
    var t = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;"
    };
    return str.replace(/[<>&]/g, function (c) {
      return t[c];
    });
  }
  function rawurlencode(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }
  function returnFalse() {
    return false;
  }
  function returnTrue() {
    return true;
  }
  function executeAttributePreprocessors(tag, tagConfig) {
    if (typeof tagConfig.attributePreprocessors === "undefined") {
      return;
    }
    tagConfig.attributePreprocessors.forEach(function (ap) {
      var attrName = ap[0];
      var regexp = ap[1];
      var map = ap[2];
      if (tag.hasAttribute(attrName)) {
        executeAttributePreprocessor(tag, attrName, regexp, map);
      }
    });
  }
  function filterAttributes(tag, tagConfig, registeredVars, logger) {
    var attributes = {};
    var attrName;
    for (attrName in tagConfig.attributes) {
      var attrConfig = tagConfig.attributes[attrName];
      var attrValue = false;
      if (tag.hasAttribute(attrName)) {
        attrValue = executeAttributeFilterChain(attrConfig.filterChain, attrName, tag.getAttribute(attrName));
      }
      if (attrValue !== false) {
        attributes[attrName] = attrValue;
      } else if (HINT.attributeDefaultValue && typeof attrConfig.defaultValue !== "undefined") {
        attributes[attrName] = attrConfig.defaultValue;
      } else if (attrConfig.required) {
        tag.invalidate();
      }
    }
    tag.setAttributes(attributes);
  }
  function filterTag(tag) {
    var tagName = tag.getName();
    var tagConfig = tagsConfig[tagName];
    logger.setTag(tag);
    for (var i = 0; i < tagConfig.filterChain.length; ++i) {
      if (tag.isInvalid()) {
        break;
      }
      tagConfig.filterChain[i](tag, tagConfig);
    }
    logger.unsetTag();
  }
  function executeAttributeFilterChain(filterChain, attrName, attrValue) {
    logger.setAttribute(attrName);
    for (var i = 0; i < filterChain.length; ++i) {
      attrValue = filterChain[i](attrValue, attrName);
      if (attrValue === false) {
        break;
      }
    }
    logger.unsetAttribute();
    return attrValue;
  }
  function executeAttributePreprocessor(tag, attrName, regexp, map) {
    var attrValue = tag.getAttribute(attrName);
    var captures = getNamedCaptures(attrValue, regexp, map);
    var k;
    for (k in captures) {
      if (k === attrName || !tag.hasAttribute(k)) {
        tag.setAttribute(k, captures[k]);
      }
    }
  }
  function getNamedCaptures(attrValue, regexp, map) {
    var m = regexp.exec(attrValue);
    if (!m) {
      return [];
    }
    var values = {};
    map.forEach(function (k, i) {
      if (typeof m[i] === "string" && m[i] !== "") {
        values[k] = m[i];
      }
    });
    return values;
  }
  function Logger() {}
  Logger.prototype = {
    add: function (type, msg, context) {},
    clear: function () {},
    setAttribute: function (attrName) {},
    setTag: function (tag) {},
    unsetAttribute: function () {},
    unsetTag: function () {},
    debug: function (msg, context) {},
    err: function (msg, context) {},
    info: function (msg, context) {},
    warn: function (msg, context) {}
  };
  function Tag(type, name, pos, len, priority) {
    this.type = +type;
    this.name = name;
    this.pos = +pos;
    this.len = +len;
    this.sortPriority = +priority || 0;
    this.attributes = {};
    this.cascade = [];
    if (isNaN(type + pos + len)) {
      this.invalidate();
    }
  }
  Tag.START_TAG = 1;
  Tag.END_TAG = 2;
  Tag.SELF_CLOSING_TAG = 3;
  Tag.prototype.attributes;
  Tag.prototype.cascade;
  Tag.prototype.endTag;
  Tag.prototype.invalid = false;
  Tag.prototype.len;
  Tag.prototype.name;
  Tag.prototype.pos;
  Tag.prototype.sortPriority;
  Tag.prototype.startTag;
  Tag.prototype.type;
  Tag.prototype.addFlags = function (flags) {
    this.flags |= flags;
  };
  Tag.prototype.cascadeInvalidationTo = function (tag) {
    this.cascade.push(tag);
    if (this.invalid) {
      tag.invalidate();
    }
  };
  Tag.prototype.invalidate = function () {
    if (!this.invalid) {
      this.invalid = true;
      this.cascade.forEach(function (tag) {
        tag.invalidate();
      });
    }
  };
  Tag.prototype.pairWith = function (tag) {
    if (this.canBePaired(this, tag)) {
      this.endTag = tag;
      tag.startTag = this;
      this.cascadeInvalidationTo(tag);
    } else if (this.canBePaired(tag, this)) {
      this.startTag = tag;
      tag.endTag = this;
    }
  };
  Tag.prototype.canBePaired = function (startTag, endTag) {
    return startTag.name === endTag.name && startTag.type === Tag.START_TAG && endTag.type === Tag.END_TAG && startTag.pos <= startTag.pos;
  };
  Tag.prototype.removeFlags = function (flags) {
    this.flags &= ~flags;
  };
  Tag.prototype.setFlags = function (flags) {
    this.flags = flags;
  };
  Tag.prototype.getAttributes = function () {
    var attributes = {};
    for (var attrName in this.attributes) {
      attributes[attrName] = this.attributes[attrName];
    }
    return attributes;
  };
  Tag.prototype.getEndTag = function () {
    return this.endTag;
  };
  Tag.prototype.getFlags = function () {
    return this.flags;
  };
  Tag.prototype.getLen = function () {
    return this.len;
  };
  Tag.prototype.getName = function () {
    return this.name;
  };
  Tag.prototype.getPos = function () {
    return this.pos;
  };
  Tag.prototype.getSortPriority = function () {
    return this.sortPriority;
  };
  Tag.prototype.getStartTag = function () {
    return this.startTag;
  };
  Tag.prototype.getType = function () {
    return this.type;
  };
  Tag.prototype.canClose = function (startTag) {
    if (this.invalid || !this.canBePaired(startTag, this) || this.startTag && this.startTag !== startTag || startTag.endTag && startTag.endTag !== this) {
      return false;
    }
    return true;
  };
  Tag.prototype.isBrTag = function () {
    return this.name === "br";
  };
  Tag.prototype.isEndTag = function () {
    return !!(this.type & Tag.END_TAG);
  };
  Tag.prototype.isIgnoreTag = function () {
    return this.name === "i";
  };
  Tag.prototype.isInvalid = function () {
    return this.invalid;
  };
  Tag.prototype.isParagraphBreak = function () {
    return this.name === "pb";
  };
  Tag.prototype.isSelfClosingTag = function () {
    return this.type === Tag.SELF_CLOSING_TAG;
  };
  Tag.prototype.isSystemTag = function () {
    return "br i pb v".indexOf(this.name) > -1;
  };
  Tag.prototype.isStartTag = function () {
    return !!(this.type & Tag.START_TAG);
  };
  Tag.prototype.isVerbatim = function () {
    return this.name === "v";
  };
  Tag.prototype.getAttribute = function (attrName) {
    return this.attributes[attrName];
  };
  Tag.prototype.hasAttribute = function (attrName) {
    return attrName in this.attributes;
  };
  Tag.prototype.removeAttribute = function (attrName) {
    delete this.attributes[attrName];
  };
  Tag.prototype.setAttribute = function (attrName, attrValue) {
    this.attributes[attrName] = attrValue;
  };
  Tag.prototype.setAttributes = function (attributes) {
    this.attributes = {};
    for (var attrName in attributes) {
      this.attributes[attrName] = attributes[attrName];
    }
  };
  var RULE_AUTO_CLOSE = 1;
  var RULE_AUTO_REOPEN = 2;
  var RULE_BREAK_PARAGRAPH = 4;
  var RULE_CREATE_PARAGRAPHS = 8;
  var RULE_DISABLE_AUTO_BR = 16;
  var RULE_ENABLE_AUTO_BR = 32;
  var RULE_IGNORE_TAGS = 64;
  var RULE_IGNORE_TEXT = 128;
  var RULE_IGNORE_WHITESPACE = 256;
  var RULE_IS_TRANSPARENT = 512;
  var RULE_PREVENT_BR = 1024;
  var RULE_SUSPEND_AUTO_BR = 2048;
  var RULE_TRIM_FIRST_LINE = 4096;
  var RULES_AUTO_LINEBREAKS = RULE_DISABLE_AUTO_BR | RULE_ENABLE_AUTO_BR | RULE_SUSPEND_AUTO_BR;
  var RULES_INHERITANCE = RULE_ENABLE_AUTO_BR;
  var WHITESPACE = " \n\t";
  var cntOpen;
  var cntTotal;
  var context;
  var currentFixingCost;
  var currentTag;
  var isRich;
  var logger = new Logger();
  var maxFixingCost = 10000;
  var namespaces;
  var openTags;
  var output;
  var plugins = {
    Autoemail: {
      parser: function (text, matches) {
        var config = {
          attrName: "email",
          tagName: "EMAIL"
        };
        var tagName = config.tagName;
        var attrName = config.attrName;
        matches.forEach(function (m) {
          var startTag = addStartTag(tagName, m[0][1], 0);
          startTag.setAttribute(attrName, m[0][0]);
          var endTag = addEndTag(tagName, m[0][1] + m[0][0].length, 0);
          startTag.pairWith(endTag);
        });
      },
      quickMatch: "@",
      regexp: /\b[-a-z0-9_+.]+@[-a-z0-9.]*[a-z0-9]/ig,
      regexpLimit: 50000
    },
    Autolink: {
      parser: function (text, matches) {
        var config = {
          attrName: "url",
          tagName: "URL"
        };
        matches.forEach(function (m) {
          linkifyUrl(m[0][1], trimUrl(m[0][0]));
        });
        function linkifyUrl(tagPos, url) {
          var endPos = tagPos + url.length;
          var endTag = addEndTag(config.tagName, endPos, 0);
          if (url[3] === ".") {
            url = "http://" + url;
          }
          var startTag = addStartTag(config.tagName, tagPos, 0, 1);
          startTag.setAttribute(config.attrName, url);
          startTag.pairWith(endTag);
          var contentTag = addVerbatim(tagPos, endPos - tagPos, 1000);
          startTag.cascadeInvalidationTo(contentTag);
        }
        function trimUrl(url) {
          return url.replace(/(?:(?![-=)\/_])[\s!-.:-@[-`{-~])+$/, "");
        }
      },
      quickMatch: ":",
      regexp: /\bhttps?:(?:[^\s()\[\]\uFF01-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65]|\([^\s()]*\)|\[\w*\])+/ig,
      regexpLimit: 50000
    },
    BBCodes: {
      parser: function (text, matches) {
        var config = {
          bbcodes: {
            "*": {
              tagName: "LI"
            },
            B: [],
            CENTER: [],
            CODE: {
              defaultAttribute: "lang"
            },
            COLOR: [],
            DEL: [],
            EMAIL: {
              contentAttributes: ["email"]
            },
            I: [],
            IMG: {
              contentAttributes: ["src"],
              defaultAttribute: "src"
            },
            LIST: {
              defaultAttribute: "type"
            },
            QUOTE: {
              defaultAttribute: "author"
            },
            S: [],
            SIZE: [],
            U: [],
            "UPL-FILE": {
              contentAttributes: ["content"],
              defaultAttribute: "uuid"
            },
            "UPL-IMAGE": {
              contentAttributes: ["content"],
              defaultAttribute: "uuid"
            },
            "UPL-IMAGE-PREVIEW": {
              defaultAttribute: "url"
            },
            URL: {
              contentAttributes: ["url"]
            }
          }
        };
        var attributes;
        var bbcodeConfig;
        var bbcodeName;
        var bbcodeSuffix;
        var pos;
        var startPos;
        var textLen = text.length;
        var uppercaseText = "";
        matches.forEach(function (m) {
          bbcodeName = m[1][0].toUpperCase();
          if (!(bbcodeName in config.bbcodes)) {
            return;
          }
          bbcodeConfig = config.bbcodes[bbcodeName];
          startPos = m[0][1];
          pos = startPos + m[0][0].length;
          try {
            parseBBCode();
          } catch (e) {}
        });
        function addBBCodeEndTag() {
          return addEndTag(getTagName(), startPos, pos - startPos);
        }
        function addBBCodeSelfClosingTag() {
          var tag = addSelfClosingTag(getTagName(), startPos, pos - startPos);
          tag.setAttributes(attributes);
          return tag;
        }
        function addBBCodeStartTag() {
          var tag = addStartTag(getTagName(), startPos, pos - startPos);
          tag.setAttributes(attributes);
          return tag;
        }
        function captureEndTag() {
          if (!uppercaseText) {
            uppercaseText = text.toUpperCase();
          }
          var match = "[/" + bbcodeName + bbcodeSuffix + "]";
          var endTagPos = uppercaseText.indexOf(match, pos);
          if (endTagPos < 0) {
            return null;
          }
          return addEndTag(getTagName(), endTagPos, match.length);
        }
        function getTagName() {
          return bbcodeConfig.tagName || bbcodeName;
        }
        function parseAttributes() {
          var firstPos = pos;
          var attrName;
          attributes = {};
          while (pos < textLen) {
            var c = text[pos];
            if (" \n\t".indexOf(c) > -1) {
              ++pos;
              continue;
            }
            if ("/]".indexOf(c) > -1) {
              return;
            }
            var spn = /^[-\w]*/.exec(text.substring(pos, pos + 100))[0].length;
            if (spn) {
              attrName = text.substring(pos, pos + spn).toLowerCase();
              pos += spn;
              if (pos >= textLen) {
                throw "";
              }
              if (text[pos] !== "=") {
                continue;
              }
            } else if (c === "=" && pos === firstPos) {
              attrName = bbcodeConfig.defaultAttribute || bbcodeName.toLowerCase();
            } else {
              throw "";
            }
            if (++pos >= textLen) {
              throw "";
            }
            attributes[attrName] = parseAttributeValue();
          }
        }
        function parseAttributeValue() {
          if (text[pos] === "\"" || text[pos] === "'") {
            return parseQuotedAttributeValue();
          }
          var match = /(?:[^\s\]]|[ \t](?!\s*(?:[-\w]+=|\/?\])))*/.exec(text.substring(pos));
          var attrValue = match[0];
          pos += attrValue.length;
          return attrValue;
        }
        function parseBBCode() {
          parseBBCodeSuffix();
          if (text[startPos + 1] === "/") {
            if (text[pos] === "]" && bbcodeSuffix === "") {
              ++pos;
              addBBCodeEndTag();
            }
            return;
          }
          parseAttributes();
          if (bbcodeConfig.predefinedAttributes) {
            for (var attrName in bbcodeConfig.predefinedAttributes) {
              if (!(attrName in attributes)) {
                attributes[attrName] = bbcodeConfig.predefinedAttributes[attrName];
              }
            }
          }
          if (text[pos] === "]") {
            ++pos;
          } else {
            if (text.substring(pos, pos + 2) === "/]") {
              pos += 2;
              addBBCodeSelfClosingTag();
            }
            return;
          }
          var contentAttributes = [];
          if (bbcodeConfig.contentAttributes) {
            bbcodeConfig.contentAttributes.forEach(function (attrName) {
              if (!(attrName in attributes)) {
                contentAttributes.push(attrName);
              }
            });
          }
          var requireEndTag = bbcodeSuffix || bbcodeConfig.forceLookahead;
          var endTag = requireEndTag || contentAttributes.length ? captureEndTag() : null;
          if (endTag) {
            contentAttributes.forEach(function (attrName) {
              attributes[attrName] = text.substring(pos, endTag.getPos());
            });
          } else if (requireEndTag) {
            return;
          }
          var tag = addBBCodeStartTag();
          if (endTag) {
            tag.pairWith(endTag);
          }
        }
        function parseBBCodeSuffix() {
          bbcodeSuffix = "";
          if (text[pos] === ":") {
            bbcodeSuffix = /^:\d*/.exec(text.substring(pos))[0];
            pos += bbcodeSuffix.length;
          }
        }
        function parseQuotedAttributeValue() {
          var quote = text[pos];
          var valuePos = pos + 1;
          do {
            pos = text.indexOf(quote, pos + 1);
            if (pos < 0) {
              throw "";
            }
            var n = 1;
            while (text[pos - n] === "\\") {
              ++n;
            }
          } while (n % 2 === 0);
          var attrValue = text.substring(valuePos, pos);
          if (attrValue.indexOf("\\") > -1) {
            attrValue = attrValue.replace(/\\([\\'"])/g, "$1");
          }
          ++pos;
          return attrValue;
        }
      },
      quickMatch: "[",
      regexp: /\[\/?(\*|[-\w]+)(?=[\]\s=:\/])/g,
      regexpLimit: 50000
    },
    Emoticons: {
      parser: function (text, matches) {
        var config = {
          tagName: "E"
        };
        matches.forEach(function (m) {
          if (HINT.EMOTICONS_NOT_AFTER && config.notAfter && m[0][1] && config.notAfter.test(text[m[0][1] - 1])) {
            return;
          }
          addSelfClosingTag(config.tagName, m[0][1], m[0][0].length);
        });
      },
      regexp: /(?::(?:[()DOP|]|'\()|;\)|>:\()/g,
      regexpLimit: 50000
    },
    Escaper: {
      parser: function (text, matches) {
        var config = {
          tagName: "ESC"
        };
        matches.forEach(function (m) {
          addTagPair(config.tagName, m[0][1], 1, m[0][1] + m[0][0].length, 0);
        });
      },
      quickMatch: "\\",
      regexp: /\\[-!#()*+.:<>@[\\\]^_`{|}~]/g,
      regexpLimit: 50000
    },
    Litedown: {
      parser: function (text, matches) {
        var config = {
          decodeHtmlEntities: false
        };
        var decodeHtmlEntities = config.decodeHtmlEntities;
        var hasEscapedChars = false;
        var hasReferences = false;
        var linkReferences = {};
        if (text.indexOf("\\") >= 0) {
          hasEscapedChars = true;
          text = text.replace(/\\[!"'()*<>[\\\]^_`~]/g, function (str) {
            return {
              "\\!": "0",
              "\\\"": "1",
              "\\'": "2",
              "\\(": "3",
              "\\)": "4",
              "\\*": "5",
              "\\<": "6",
              "\\>": "7",
              "\\[": "8",
              "\\\\": "9",
              "\\]": "A",
              "\\^": "B",
              "\\_": "C",
              "\\`": "D",
              "\\~": "E"
            }[str];
          });
        }
        text += "\n\n";
        function decode(str) {
          if (HINT.LITEDOWN_DECODE_HTML_ENTITIES && decodeHtmlEntities && str.indexOf("&") > -1) {
            str = html_entity_decode(str);
          }
          str = str.replace(/\x1A/g, "");
          if (hasEscapedChars) {
            str = str.replace(/\x1B./g, function (seq) {
              return {
                "0": "!",
                "1": "\"",
                "2": "'",
                "3": "(",
                "4": ")",
                "5": "*",
                "6": "<",
                "7": ">",
                "8": "[",
                "9": "\\",
                "A": "]",
                "B": "^",
                "C": "_",
                "D": "`",
                "E": "~"
              }[seq];
            });
          }
          return str;
        }
        function isAfterWhitespace(pos) {
          return pos > 0 && isWhitespace(text.charAt(pos - 1));
        }
        function isAlnum(chr) {
          return " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".indexOf(chr) > 0;
        }
        function isBeforeWhitespace(pos) {
          return isWhitespace(text[pos + 1]);
        }
        function isSurroundedByAlnum(pos, len) {
          return pos > 0 && isAlnum(text[pos - 1]) && isAlnum(text[pos + len]);
        }
        function isWhitespace(chr) {
          return " \n\t".indexOf(chr) > -1;
        }
        function markBoundary(pos) {
          text = text.substring(0, pos) + "" + text.substring(pos + 1);
        }
        function overwrite(pos, len) {
          if (len > 0) {
            text = text.substring(0, pos) + new Array(1 + len).join("") + text.substring(pos + len);
          }
        }
        function parseInlineMarkup(str, regexp, tagName) {
          if (text.indexOf(str) === -1) {
            return;
          }
          var m;
          while (m = regexp.exec(text)) {
            var match = m[0];
            var matchPos = m.index;
            var matchLen = match.length;
            var endPos = matchPos + matchLen - 2;
            addTagPair(tagName, matchPos, 2, endPos, 2);
            overwrite(matchPos, 2);
            overwrite(endPos, 2);
          }
        }
        function parseAbstractScript(tagName, syntaxChar, shortRegexp, longRegexp) {
          var pos = text.indexOf(syntaxChar);
          if (pos === -1) {
            return;
          }
          parseShortForm(pos);
          parseLongForm(pos);
          function parseLongForm(pos) {
            pos = text.indexOf(syntaxChar + "(", pos);
            if (pos === -1) {
              return;
            }
            var m;
            var regexp = longRegexp;
            regexp.lastIndex = pos;
            while (m = regexp.exec(text)) {
              var match = m[0];
              var matchPos = m.index;
              var matchLen = match.length;
              addTagPair(tagName, matchPos, 2, matchPos + matchLen - 1, 1);
              overwrite(matchPos, matchLen);
            }
            if (match) {
              parseLongForm(pos);
            }
          }
          function parseShortForm(pos) {
            var m;
            var regexp = shortRegexp;
            regexp.lastIndex = pos;
            while (m = regexp.exec(text)) {
              var match = m[0];
              var matchPos = m.index;
              var matchLen = match.length;
              var startPos = matchPos;
              var endLen = match.charAt(matchLen - 1) === syntaxChar ? 1 : 0;
              var endPos = matchPos + matchLen - endLen;
              addTagPair(tagName, startPos, 1, endPos, endLen);
            }
          }
        }
        function setLinkAttributes(tag, linkInfo, attrName) {
          var url = linkInfo.replace(/^\s*/, "").replace(/\s*$/, "");
          var title = "";
          var pos = url.indexOf(" ");
          if (pos !== -1) {
            title = url.substring(pos).replace(/^\s*\S/, "").replace(/\S\s*$/, "");
            url = url.substring(0, pos);
          }
          if (/^<.+>$/.test(url)) {
            url = url.replace(/^<(.+)>$/, "$1").replace(/\\>/g, ">");
          }
          tag.setAttribute(attrName, decode(url));
          if (title > "") {
            tag.setAttribute("title", decode(title));
          }
        }
        (function () {
          var setextLines = {};
          function parse() {
            matchSetextLines();
            var blocks = [];
            var blocksCnt = 0;
            var codeFence;
            var codeIndent = 4;
            var codeTag;
            var lineIsEmpty = true;
            var lists = [];
            var listsCnt = 0;
            var newContext = false;
            var textBoundary = 0;
            var breakParagraph;
            var continuation;
            var ignoreLen;
            var indentStr;
            var indentLen;
            var lfPos;
            var listIndex;
            var maxIndent;
            var minIndent;
            var blockDepth;
            var tagPos;
            var tagLen;
            var matches = [];
            var m;
            var regexp = /^(?:(?=[-*+\d \t>`~#_])((?: {0,3}>(?:(?!!)|!(?![^\n>]*?!<)) ?)+)?([ \t]+)?(\* *\* *\*[* ]*$|- *- *-[- ]*$|_ *_ *_[_ ]*$)?((?:[-*+]|\d+\.)[ \t]+(?=\S))?[ \t]*(#{1,6}[ \t]+|```+[^`\n]*$|~~~+[^~\n]*$)?)?/gm;
            while (m = regexp.exec(text)) {
              matches.push(m);
              if (m.index === regexp.lastIndex) {
                ++regexp.lastIndex;
              }
            }
            matches.forEach(function (m) {
              var blockMarks = [];
              var matchPos = m.index;
              var matchLen = m[0].length;
              var startPos;
              var startLen;
              var endPos;
              var endLen;
              ignoreLen = 0;
              blockDepth = 0;
              continuation = !lineIsEmpty;
              lfPos = text.indexOf("\n", matchPos);
              lineIsEmpty = lfPos === matchPos + matchLen && !m[3] && !m[4] && !m[5];
              if (!matchLen) {
                ++regexp.lastIndex;
              }
              breakParagraph = lineIsEmpty && continuation;
              if (m[1]) {
                blockMarks = getBlockMarks(m[1]);
                blockDepth = blockMarks.length;
                ignoreLen = m[1].length;
                if (codeTag && codeTag.hasAttribute("blockDepth")) {
                  blockDepth = Math.min(blockDepth, codeTag.getAttribute("blockDepth"));
                  ignoreLen = computeBlockIgnoreLen(m[1], blockDepth);
                }
                overwrite(matchPos, ignoreLen);
              }
              if (blockDepth < blocksCnt && !continuation) {
                newContext = true;
                do {
                  var startTag = blocks.pop();
                  addEndTag(startTag.getName(), textBoundary, 0).pairWith(startTag);
                } while (blockDepth < --blocksCnt);
              }
              if (blockDepth > blocksCnt && !lineIsEmpty) {
                newContext = true;
                do {
                  var tagName = blockMarks[blocksCnt] === ">!" ? "SPOILER" : "QUOTE";
                  blocks.push(addStartTag(tagName, matchPos, 0, -999));
                } while (blockDepth > ++blocksCnt);
              }
              var indentWidth = 0;
              var indentPos = 0;
              if (m[2] && !codeFence) {
                indentStr = m[2];
                indentLen = indentStr.length;
                do {
                  if (indentStr[indentPos] === " ") {
                    ++indentWidth;
                  } else {
                    indentWidth = indentWidth + 4 & ~3;
                  }
                } while (++indentPos < indentLen && indentWidth < codeIndent);
              }
              if (codeTag && !codeFence && indentWidth < codeIndent && !lineIsEmpty) {
                newContext = true;
              }
              if (newContext) {
                newContext = false;
                if (codeTag) {
                  if (textBoundary > codeTag.getPos()) {
                    overwrite(codeTag.getPos(), textBoundary - codeTag.getPos());
                    codeTag.pairWith(addEndTag("CODE", textBoundary, 0, -1));
                  } else {
                    codeTag.invalidate();
                  }
                  codeTag = null;
                  codeFence = null;
                }
                lists.forEach(function (list) {
                  closeList(list, textBoundary);
                });
                lists = [];
                listsCnt = 0;
                if (matchPos) {
                  markBoundary(matchPos - 1);
                }
              }
              if (indentWidth >= codeIndent) {
                if (codeTag || !continuation) {
                  ignoreLen = (m[1] || "").length + indentPos;
                  if (!codeTag) {
                    codeTag = addStartTag("CODE", matchPos + ignoreLen, 0, -999);
                  }
                  m = {};
                }
              } else if (!codeTag) {
                var hasListItem = !!m[4];
                if (!indentWidth && !continuation && !hasListItem) {
                  listIndex = -1;
                } else if (continuation && !hasListItem) {
                  listIndex = listsCnt - 1;
                } else if (!listsCnt) {
                  listIndex = hasListItem ? 0 : -1;
                } else {
                  listIndex = 0;
                  while (listIndex < listsCnt && indentWidth > lists[listIndex].maxIndent) {
                    ++listIndex;
                  }
                }
                while (listIndex < listsCnt - 1) {
                  closeList(lists.pop(), textBoundary);
                  --listsCnt;
                }
                if (listIndex === listsCnt && !hasListItem) {
                  --listIndex;
                }
                if (hasListItem && listIndex >= 0) {
                  breakParagraph = true;
                  tagPos = matchPos + ignoreLen + indentPos;
                  tagLen = m[4].length;
                  var itemTag = addStartTag("LI", tagPos, tagLen);
                  overwrite(tagPos, tagLen);
                  if (listIndex < listsCnt) {
                    addEndTag("LI", textBoundary, 0).pairWith(lists[listIndex].itemTag);
                    lists[listIndex].itemTag = itemTag;
                    lists[listIndex].itemTags.push(itemTag);
                  } else {
                    ++listsCnt;
                    if (listIndex) {
                      minIndent = lists[listIndex - 1].maxIndent + 1;
                      maxIndent = Math.max(minIndent, listIndex * 4);
                    } else {
                      minIndent = 0;
                      maxIndent = indentWidth;
                    }
                    var listTag = addStartTag("LIST", tagPos, 0);
                    if (m[4].indexOf(".") > -1) {
                      listTag.setAttribute("type", "decimal");
                      var start = +m[4];
                      if (start !== 1) {
                        listTag.setAttribute("start", start);
                      }
                    }
                    lists.push({
                      listTag: listTag,
                      itemTag: itemTag,
                      itemTags: [itemTag],
                      minIndent: minIndent,
                      maxIndent: maxIndent,
                      tight: true
                    });
                  }
                }
                if (listsCnt && !continuation && !lineIsEmpty) {
                  if (lists[0].itemTags.length > 1 || !hasListItem) {
                    lists.forEach(function (list) {
                      list.tight = false;
                    });
                  }
                }
                codeIndent = (listsCnt + 1) * 4;
              }
              if (m[5]) {
                if (m[5][0] === "#") {
                  startLen = m[5].length;
                  startPos = matchPos + matchLen - startLen;
                  endLen = getAtxHeaderEndTagLen(matchPos + matchLen, lfPos);
                  endPos = lfPos - endLen;
                  addTagPair("H" + /#{1,6}/.exec(m[5])[0].length, startPos, startLen, endPos, endLen);
                  markBoundary(startPos);
                  markBoundary(lfPos);
                  if (continuation) {
                    breakParagraph = true;
                  }
                } else if (m[5][0] === "`" || m[5][0] === "~") {
                  tagPos = matchPos + ignoreLen;
                  tagLen = lfPos - tagPos;
                  if (codeTag && m[5] === codeFence) {
                    codeTag.pairWith(addEndTag("CODE", tagPos, tagLen, -1));
                    addIgnoreTag(textBoundary, tagPos - textBoundary);
                    overwrite(codeTag.getPos(), tagPos + tagLen - codeTag.getPos());
                    codeTag = null;
                    codeFence = null;
                  } else if (!codeTag) {
                    codeTag = addStartTag("CODE", tagPos, tagLen);
                    codeFence = m[5].replace(/[^`~]+/, "");
                    codeTag.setAttribute("blockDepth", blockDepth);
                    addIgnoreTag(tagPos + tagLen, 1);
                    var lang = m[5].replace(/^[`~\s]*/, "").replace(/\s+$/, "");
                    if (lang !== "") {
                      codeTag.setAttribute("lang", lang);
                    }
                  }
                }
              } else if (m[3] && !listsCnt && text[matchPos + matchLen] !== "") {
                addSelfClosingTag("HR", matchPos + ignoreLen, matchLen - ignoreLen);
                breakParagraph = true;
                markBoundary(lfPos);
              } else if (setextLines[lfPos] && setextLines[lfPos].blockDepth === blockDepth && !lineIsEmpty && !listsCnt && !codeTag) {
                addTagPair(setextLines[lfPos].tagName, matchPos + ignoreLen, 0, setextLines[lfPos].endPos, setextLines[lfPos].endLen);
                markBoundary(setextLines[lfPos].endPos + setextLines[lfPos].endLen);
              }
              if (breakParagraph) {
                addParagraphBreak(textBoundary);
                markBoundary(textBoundary);
              }
              if (!lineIsEmpty) {
                textBoundary = lfPos;
              }
              if (ignoreLen) {
                addIgnoreTag(matchPos, ignoreLen, 1000);
              }
            });
          }
          function closeList(list, textBoundary) {
            addEndTag("LIST", textBoundary, 0).pairWith(list.listTag);
            addEndTag("LI", textBoundary, 0).pairWith(list.itemTag);
            if (list.tight) {
              list.itemTags.forEach(function (itemTag) {
                itemTag.removeFlags(RULE_CREATE_PARAGRAPHS);
              });
            }
          }
          function computeBlockIgnoreLen(str, maxBlockDepth) {
            var remaining = str;
            while (--maxBlockDepth >= 0) {
              remaining = remaining.replace(/^ *>!? ?/, "");
            }
            return str.length - remaining.length;
          }
          function getAtxHeaderEndTagLen(startPos, endPos) {
            var content = text.substring(startPos, endPos);
            var m = /[ \t]*#*[ \t]*$/.exec(content);
            return m[0].length;
          }
          function getBlockMarks(str) {
            var blockMarks = [];
            var regexp = />!?/g;
            var m;
            while (m = regexp.exec(str)) {
              blockMarks.push(m[0]);
            }
            return blockMarks;
          }
          function matchSetextLines() {
            if (text.indexOf("-") === -1 && text.indexOf("=") === -1) {
              return;
            }
            var m;
            var regexp = /^(?=[-=>])(?:>!? ?)*(?=[-=])(?:-+|=+) *$/gm;
            while (m = regexp.exec(text)) {
              var match = m[0];
              var matchPos = m.index;
              var endPos = matchPos - 1;
              while (endPos > 0 && text[endPos - 1] === " ") {
                --endPos;
              }
              setextLines[matchPos - 1] = {
                endLen: matchPos + match.length - endPos,
                endPos: endPos,
                blockDepth: match.length - match.replace(/>/g, "").length,
                tagName: match[0] === "=" ? "H1" : "H2"
              };
            }
          }
          parse();
        })();
        (function () {
          function parse() {
            if (text.indexOf("]:") < 0) {
              return;
            }
            var m;
            var regexp = /^\x1A* {0,3}\[([^\x17\]]+)\]: *([^[\s\x17]+ *(?:"[^\x17]*?"|'[^\x17]*?'|\([^\x17)]*\))?) *(?=$|\x17)\n?/gm;
            while (m = regexp.exec(text)) {
              addIgnoreTag(m.index, m[0].length);
              var id = m[1].toLowerCase();
              if (!linkReferences[id]) {
                hasReferences = true;
                linkReferences[id] = m[2];
              }
            }
          }
          parse();
        })();
        (function () {
          function parse() {
            var markers = getInlineCodeMarkers();
            var i = -1;
            var cnt = markers.length;
            while (++i < cnt - 1) {
              var pos = markers[i].next;
              var j = i;
              if (text[markers[i].pos] !== "`") {
                ++markers[i].pos;
                --markers[i].len;
              }
              while (++j < cnt && markers[j].pos === pos) {
                if (markers[j].len === markers[i].len) {
                  addInlineCodeTags(markers[i], markers[j]);
                  i = j;
                  break;
                }
                pos = markers[j].next;
              }
            }
          }
          function addInlineCodeTags(left, right) {
            var startPos = left.pos;
            var startLen = left.len + left.trimAfter;
            var endPos = right.pos - right.trimBefore;
            var endLen = right.len + right.trimBefore;
            addTagPair("C", startPos, startLen, endPos, endLen);
            overwrite(startPos, endPos + endLen - startPos);
          }
          function getInlineCodeMarkers() {
            var pos = text.indexOf("`");
            if (pos < 0) {
              return [];
            }
            var regexp = /(`+)(\s*)[^\x17`]*/g;
            var trimNext = 0;
            var markers = [];
            var _text = text.replace(/\x1BD/g, "\\`");
            var m;
            regexp.lastIndex = pos;
            while (m = regexp.exec(_text)) {
              markers.push({
                pos: m.index,
                len: m[1].length,
                trimBefore: trimNext,
                trimAfter: m[2].length,
                next: m.index + m[0].length
              });
              trimNext = m[0].length - m[0].replace(/\s+$/, "").length;
            }
            return markers;
          }
          parse();
        })();
        (function () {
          function parse() {
            var pos = text.indexOf("![");
            if (pos === -1) {
              return;
            }
            if (text.indexOf("](", pos) > 0) {
              parseInlineImages();
            }
            if (hasReferences) {
              parseReferenceImages();
            }
          }
          function addImageTag(startPos, endPos, endLen, linkInfo, alt) {
            var tag = addTagPair("IMG", startPos, 2, endPos, endLen);
            setLinkAttributes(tag, linkInfo, "src");
            tag.setAttribute("alt", decode(alt));
            overwrite(startPos, endPos + endLen - startPos);
          }
          function parseInlineImages() {
            var m;
            var regexp = /!\[(?:[^\x17[\]]|\[[^\x17[\]]*\])*\]\(( *(?:[^\x17\s()]|\([^\x17\s()]*\))*(?=[ )]) *(?:"[^\x17]*?"|'[^\x17]*?'|\([^\x17)]*\))? *)\)/g;
            while (m = regexp.exec(text)) {
              var linkInfo = m[1];
              var startPos = m.index;
              var endLen = 3 + linkInfo.length;
              var endPos = startPos + m[0].length - endLen;
              var alt = m[0].substring(2, m[0].length - endLen);
              addImageTag(startPos, endPos, endLen, linkInfo, alt);
            }
          }
          function parseReferenceImages() {
            var m;
            var regexp = /!\[((?:[^\x17[\]]|\[[^\x17[\]]*\])*)\](?: ?\[([^\x17[\]]+)\])?/g;
            while (m = regexp.exec(text)) {
              var startPos = m.index;
              var endPos = startPos + 2 + m[1].length;
              var endLen = 1;
              var alt = m[1];
              var id = alt;
              if (m[2] > "" && linkReferences[m[2]]) {
                endLen = m[0].length - alt.length - 2;
                id = m[2];
              } else if (!linkReferences[id]) {
                continue;
              }
              addImageTag(startPos, endPos, endLen, linkReferences[id], alt);
            }
          }
          parse();
        })();
        (function () {
          function parse() {
            parseInlineMarkup(">!", />![^\x17]+?!</g, "ISPOILER");
            parseInlineMarkup("||", /\|\|[^\x17]+?\|\|/g, "ISPOILER");
          }
          parse();
        })();
        (function () {
          function parse() {
            if (text.indexOf("](") !== -1) {
              parseInlineLinks();
            }
            if (text.indexOf("<") !== -1) {
              parseAutomaticLinks();
            }
            if (hasReferences) {
              parseReferenceLinks();
            }
          }
          function addLinkTag(startPos, endPos, endLen, linkInfo) {
            var priority = endLen === 1 ? 1 : -1;
            var tag = addTagPair("URL", startPos, 1, endPos, endLen, priority);
            setLinkAttributes(tag, linkInfo, "url");
            overwrite(startPos, 1);
            overwrite(endPos, endLen);
          }
          function getLabels() {
            var labels = {};
            var m;
            var regexp = /\[((?:[^\x17[\]]|\[[^\x17[\]]*\])*)\]/g;
            while (m = regexp.exec(text)) {
              labels[m.index] = m[1].toLowerCase();
            }
            return labels;
          }
          function parseAutomaticLinks() {
            var m;
            var regexp = /<[-+.\w]+([:@])[^\x17\s>]+?(?:>|\x1B7)/g;
            while (m = regexp.exec(text)) {
              var content = decode(m[0].replace(/\x1B/g, "\\")).replace(/^<(.+)>$/, "$1");
              var startPos = m.index;
              var endPos = startPos + m[0].length - 1;
              var tagName = m[1] === ":" ? "URL" : "EMAIL";
              var attrName = tagName.toLowerCase();
              addTagPair(tagName, startPos, 1, endPos, 1).setAttribute(attrName, content);
            }
          }
          function parseInlineLinks() {
            var m;
            var regexp = /\[(?:[^\x17[\]]|\[[^\x17[\]]*\])*\]\(( *(?:\([^\x17\s()]*\)|[^\x17\s)])*(?=[ )]) *(?:"[^\x17]*?"|'[^\x17]*?'|\([^\x17)]*\))? *)\)/g;
            while (m = regexp.exec(text)) {
              var linkInfo = m[1];
              var startPos = m.index;
              var endLen = 3 + linkInfo.length;
              var endPos = startPos + m[0].length - endLen;
              addLinkTag(startPos, endPos, endLen, linkInfo);
            }
          }
          function parseReferenceLinks() {
            var labels = getLabels();
            var startPos;
            for (startPos in labels) {
              var id = labels[startPos];
              var labelPos = +startPos + 2 + id.length;
              var endPos = labelPos - 1;
              var endLen = 1;
              if (text[labelPos] === " ") {
                ++labelPos;
              }
              if (labels[labelPos] > "" && linkReferences[labels[labelPos]]) {
                id = labels[labelPos];
                endLen = labelPos + 2 + id.length - endPos;
              }
              if (linkReferences[id]) {
                addLinkTag(+startPos, endPos, endLen, linkReferences[id]);
              }
            }
          }
          parse();
        })();
        (function () {
          function parse() {
            parseInlineMarkup("~~", /~~[^\x17]+?~~(?!~)/g, "DEL");
          }
          parse();
        })();
        (function () {
          function parse() {
            parseAbstractScript("SUB", "~", /~[^\x17\s!"#$%&\'()*+,\-.\/:;<=>?@[\]^_`{}|~]+~?/g, /~\([^\x17()]+\)/g);
          }
          parse();
        })();
        (function () {
          function parse() {
            parseAbstractScript("SUP", "^", /\^[^\x17\s!"#$%&\'()*+,\-.\/:;<=>?@[\]^_`{}|~]+\^?/g, /\^\([^\x17()]+\)/g);
          }
          parse();
        })();
        (function () {
          var closeEm;
          var closeStrong;
          var emPos;
          var emEndPos;
          var remaining;
          var strongPos;
          var strongEndPos;
          function parse() {
            parseEmphasisByCharacter("*", /\*+/g);
            parseEmphasisByCharacter("_", /_+/g);
          }
          function adjustEndingPositions() {
            if (closeEm && closeStrong) {
              if (emPos < strongPos) {
                emEndPos += 2;
              } else {
                ++strongEndPos;
              }
            }
          }
          function adjustStartingPositions() {
            if (emPos >= 0 && emPos === strongPos) {
              if (closeEm) {
                emPos += 2;
              } else {
                ++strongPos;
              }
            }
          }
          function closeSpans() {
            if (closeEm) {
              --remaining;
              addTagPair("EM", emPos, 1, emEndPos, 1);
              emPos = -1;
            }
            if (closeStrong) {
              remaining -= 2;
              addTagPair("STRONG", strongPos, 2, strongEndPos, 2);
              strongPos = -1;
            }
          }
          function getEmphasisByBlock(regexp, pos) {
            var block = [];
            var blocks = [];
            var breakPos = text.indexOf("", pos);
            var m;
            regexp.lastIndex = pos;
            while (m = regexp.exec(text)) {
              var matchPos = m.index;
              var matchLen = m[0].length;
              if (matchPos > breakPos) {
                blocks.push(block);
                block = [];
                breakPos = text.indexOf("", matchPos);
              }
              if (!ignoreEmphasis(matchPos, matchLen)) {
                block.push([matchPos, matchLen]);
              }
            }
            blocks.push(block);
            return blocks;
          }
          function ignoreEmphasis(pos, len) {
            return text.charAt(pos) === "_" && len === 1 && isSurroundedByAlnum(pos, len);
          }
          function openSpans(pos) {
            if (remaining & 1) {
              emPos = pos - remaining;
            }
            if (remaining & 2) {
              strongPos = pos - remaining;
            }
          }
          function parseEmphasisByCharacter(character, regexp) {
            var pos = text.indexOf(character);
            if (pos === -1) {
              return;
            }
            getEmphasisByBlock(regexp, pos).forEach(processEmphasisBlock);
          }
          function processEmphasisBlock(block) {
            emPos = -1;
            strongPos = -1;
            block.forEach(function (pair) {
              processEmphasisMatch(pair[0], pair[1]);
            });
          }
          function processEmphasisMatch(matchPos, matchLen) {
            var canOpen = !isBeforeWhitespace(matchPos + matchLen - 1);
            var canClose = !isAfterWhitespace(matchPos);
            var closeLen = canClose ? Math.min(matchLen, 3) : 0;
            closeEm = !!(closeLen & 1) && emPos >= 0;
            closeStrong = !!(closeLen & 2) && strongPos >= 0;
            emEndPos = matchPos;
            strongEndPos = matchPos;
            remaining = matchLen;
            adjustStartingPositions();
            adjustEndingPositions();
            closeSpans();
            remaining = canOpen ? Math.min(remaining, 3) : 0;
            openSpans(matchPos + matchLen);
          }
          parse();
        })();
        (function () {
          function parse() {
            var pos = text.indexOf("  \n");
            while (pos > 0) {
              addBrTag(pos + 2).cascadeInvalidationTo(addVerbatim(pos + 2, 1));
              pos = text.indexOf("  \n", pos + 3);
            }
          }
          parse();
        })();
      }
    },
    Preg: {
      parser: function (text, matches) {
        var config = {
          generics: [["USERMENTION", /\B@["|“](((?!"#[a-z]{0,3}[0-9]+).)+)["|”]#([0-9]+)\b/g, 0, ["", "displayname", "", "id"]], ["USERMENTION", /\B@([a-z0-9_-]+)(?!#)/ig, 0, ["", "username"]], ["POSTMENTION", /\B@["|“](((?!"#[a-z]{0,3}[0-9]+).)+)["|”]#p([0-9]+)\b/g, 0, ["", "displayname", "", "id"]]]
        };
        config.generics.forEach(function (entry) {
          var tagName = entry[0];
          var regexp = entry[1];
          var passthroughIdx = entry[2];
          var map = entry[3];
          var m;
          regexp.lastIndex = 0;
          while (m = regexp.exec(text)) {
            var startTagPos = m.index;
            var matchLen = m[0].length;
            var tag;
            if (HINT.PREG_HAS_PASSTHROUGH && passthroughIdx && m[passthroughIdx] !== "") {
              var contentPos = text.indexOf(m[passthroughIdx], startTagPos);
              var contentLen = m[passthroughIdx].length;
              var startTagLen = contentPos - startTagPos;
              var endTagPos = contentPos + contentLen;
              var endTagLen = matchLen - (startTagLen + contentLen);
              tag = addTagPair(tagName, startTagPos, startTagLen, endTagPos, endTagLen, -100);
            } else {
              tag = addSelfClosingTag(tagName, startTagPos, matchLen, -100);
            }
            map.forEach(function (attrName, i) {
              if (attrName && typeof m[i] !== "undefined") {
                tag.setAttribute(attrName, m[i]);
              }
            });
          }
        });
      }
    }
  };
  var pos;
  var registeredVars = {
    urlConfig: {
      allowedSchemes: /^https?$/i
    }
  };
  var rootContext = {
    allowed: oF6AF222C,
    flags: 40
  };
  var tagsConfig = {
    B: o5DB432B1,
    C: {
      allowed: o553403F9,
      attributes: {},
      bitNumber: 3,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: {
        flags: 66
      },
      tagLimit: 5000
    },
    CENTER: {
      allowed: oF6AF222C,
      attributes: {},
      bitNumber: 2,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: o1AF69066,
      tagLimit: 5000
    },
    CODE: {
      allowed: o553403F9,
      attributes: {
        lang: {
          filterChain: o56E79363,
          required: false
        }
      },
      bitNumber: 2,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: {
        closeParent: oD4869BFF,
        flags: 4436,
        fosterParent: oD4869BFF
      },
      tagLimit: 5000
    },
    COLOR: {
      allowed: o8DE1CD10,
      attributes: {
        color: {
          filterChain: [function (attrValue, attrName) {
            return RegexpFilter.filter(attrValue, /^(?:#(?:(?:[0-9a-f]{3}){1,2}|(?:[0-9a-f]{4}){1,2})|rgb\(\d{1,3}, *\d{1,3}, *\d{1,3}\)|rgba\(\d{1,3}, *\d{1,3}, *\d{1,3}, *\d*(?:\.\d+)?\)|[a-z]+)$/i);
          }],
          required: true
        }
      },
      bitNumber: 3,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: oB565876D,
      tagLimit: 5000
    },
    DEL: {
      allowed: oF6AF222C,
      attributes: {},
      bitNumber: 3,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: {
        flags: 512
      },
      tagLimit: 5000
    },
    E: {
      allowed: oA385316A,
      attributes: {},
      bitNumber: 6,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: oA80287CC,
      tagLimit: 5000
    },
    EM: o5DB432B1,
    EMAIL: {
      allowed: oBB818D5A,
      attributes: {
        email: {
          filterChain: [function (attrValue, attrName) {
            return EmailFilter.filter(attrValue);
          }],
          required: true
        }
      },
      bitNumber: 1,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: o939F1698,
      tagLimit: 5000
    },
    ESC: {
      allowed: o553403F9,
      attributes: {},
      bitNumber: 0,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: {
        flags: 1616
      },
      tagLimit: 5000
    },
    H1: o1262D8F4,
    H2: o1262D8F4,
    H3: o1262D8F4,
    H4: o1262D8F4,
    H5: o1262D8F4,
    H6: o1262D8F4,
    HR: {
      allowed: oA385316A,
      attributes: {},
      bitNumber: 2,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: oF3C6FA42,
      tagLimit: 5000
    },
    I: o5DB432B1,
    IMG: {
      allowed: oA385316A,
      attributes: {
        alt: o1BC3EAF4,
        height: o75AB9259,
        src: oF307D35C,
        title: o1BC3EAF4,
        width: o75AB9259
      },
      bitNumber: 3,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: oA80287CC,
      tagLimit: 5000
    },
    ISPOILER: o8988A276,
    LI: {
      allowed: oF6AF222C,
      attributes: {},
      bitNumber: 4,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: {
        closeParent: {
          B: 1,
          C: 1,
          COLOR: 1,
          EM: 1,
          EMAIL: 1,
          I: 1,
          LI: 1,
          S: 1,
          SIZE: 1,
          STRONG: 1,
          U: 1,
          URL: 1
        },
        flags: 264,
        fosterParent: oD4869BFF
      },
      tagLimit: 5000
    },
    LIST: {
      allowed: [32529],
      attributes: {
        start: o75AB9259,
        type: {
          filterChain: [function (attrValue, attrName) {
            return HashmapFilter.filter(attrValue, {
              A: "upper-alpha",
              I: "upper-roman",
              a: "lower-alpha",
              i: "lower-roman",
              "1": "decimal"
            }, false);
          }, o6377B813],
          required: false
        }
      },
      bitNumber: 2,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: {
        closeParent: oD4869BFF,
        createChild: ["LI"],
        flags: 3460,
        fosterParent: oD4869BFF
      },
      tagLimit: 5000
    },
    POSTMENTION: {
      allowed: oA385316A,
      attributes: {
        discussionid: o6CB0A318,
        displayname: o02D8DBB5,
        id: o6CB0A318,
        number: o6CB0A318
      },
      bitNumber: 1,
      filterChain: [function (tag, tagConfig) {
        return function (tag) {
          return flarum.extensions["flarum-mentions"].filterPostMentions(tag);
        }(tag);
      }, o118B31AC],
      nestingLimit: 10,
      rules: oA80287CC,
      tagLimit: 5000
    },
    QUOTE: {
      allowed: oF6AF222C,
      attributes: {
        author: o1BC3EAF4
      },
      bitNumber: 2,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: o1AF69066,
      tagLimit: 5000
    },
    S: o5DB432B1,
    SIZE: {
      allowed: o8DE1CD10,
      attributes: {
        size: {
          filterChain: [function (attrValue, attrName) {
            return NumericFilter.filterRange(attrValue, 8, 36, logger);
          }],
          required: true
        }
      },
      bitNumber: 3,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: oB565876D,
      tagLimit: 5000
    },
    SPOILER: {
      allowed: oF6AF222C,
      attributes: {},
      bitNumber: 5,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: o1AF69066,
      tagLimit: 5000
    },
    STRONG: o5DB432B1,
    SUB: o8988A276,
    SUP: o8988A276,
    U: o5DB432B1,
    "UPL-FILE": {
      allowed: oA385316A,
      attributes: {
        content: oABCFC4A3,
        size: oABCFC4A3,
        uuid: oE2346708
      },
      bitNumber: 2,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: oF3C6FA42,
      tagLimit: 5000
    },
    "UPL-IMAGE": {
      allowed: oA385316A,
      attributes: {
        content: oABCFC4A3,
        size: oABCFC4A3,
        url: oF307D35C,
        uuid: oE2346708
      },
      bitNumber: 2,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: oF3C6FA42,
      tagLimit: 5000
    },
    "UPL-IMAGE-PREVIEW": {
      allowed: oA385316A,
      attributes: {
        url: oF307D35C
      },
      bitNumber: 3,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: oA80287CC,
      tagLimit: 5000
    },
    URL: {
      allowed: oBB818D5A,
      attributes: {
        title: o1BC3EAF4,
        url: oF307D35C
      },
      bitNumber: 1,
      filterChain: o1B4F5B52,
      nestingLimit: 10,
      rules: o939F1698,
      tagLimit: 5000
    },
    USERMENTION: {
      allowed: oA385316A,
      attributes: {
        displayname: o02D8DBB5,
        id: o6CB0A318
      },
      bitNumber: 1,
      filterChain: [function (tag, tagConfig) {
        return function (tag) {
          return flarum.extensions["flarum-mentions"].filterUserMentions(tag);
        }(tag);
      }, o118B31AC],
      nestingLimit: 10,
      rules: oA80287CC,
      tagLimit: 5000
    }
  };
  var tagStack;
  var tagStackIsSorted;
  var text;
  var textLen;
  var uid = 0;
  var wsPos;
  function disableTag(tagName) {
    if (tagsConfig[tagName]) {
      copyTagConfig(tagName).isDisabled = true;
    }
  }
  function enableTag(tagName) {
    if (tagsConfig[tagName]) {
      copyTagConfig(tagName).isDisabled = false;
    }
  }
  function getLogger() {
    return logger;
  }
  function parse(_text) {
    reset(_text);
    var _uid = uid;
    executePluginParsers();
    processTags();
    finalizeOutput();
    if (uid !== _uid) {
      throw "The parser has been reset during execution";
    }
    if (currentFixingCost > maxFixingCost) {
      logger.warn("Fixing cost limit exceeded");
    }
    return output;
  }
  function reset(_text) {
    _text = _text.replace(/\r\n?/g, "\n");
    _text = _text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]+/g, "");
    logger.clear();
    cntOpen = {};
    cntTotal = {};
    currentFixingCost = 0;
    currentTag = null;
    isRich = false;
    namespaces = {};
    openTags = [];
    output = "";
    pos = 0;
    tagStack = [];
    tagStackIsSorted = false;
    text = _text;
    textLen = text.length;
    wsPos = 0;
    context = rootContext;
    context.inParagraph = false;
    ++uid;
  }
  function setTagLimit(tagName, tagLimit) {
    if (tagsConfig[tagName]) {
      copyTagConfig(tagName).tagLimit = tagLimit;
    }
  }
  function setNestingLimit(tagName, nestingLimit) {
    if (tagsConfig[tagName]) {
      copyTagConfig(tagName).nestingLimit = nestingLimit;
    }
  }
  function copyTagConfig(tagName) {
    var tagConfig = {};
    var k;
    for (k in tagsConfig[tagName]) {
      tagConfig[k] = tagsConfig[tagName][k];
    }
    return tagsConfig[tagName] = tagConfig;
  }
  function encodeUnicodeSupplementaryCharacters() {
    output = output.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, encodeUnicodeSupplementaryCharactersCallback);
  }
  function encodeUnicodeSupplementaryCharactersCallback(pair) {
    var cp = (pair.charCodeAt(0) << 10) + pair.charCodeAt(1) - 56613888;
    return "&#" + cp + ";";
  }
  function finalizeOutput() {
    var tmp;
    outputText(textLen, 0, true);
    do {
      tmp = output;
      output = output.replace(/<([^ />]+)[^>]*><\/\1>/g, "");
    } while (output !== tmp);
    output = output.replace(/<\/i><i>/g, "");
    output = output.replace(/[\x00-\x08\x0B-\x1F]/g, "");
    encodeUnicodeSupplementaryCharacters();
    var tagName = isRich ? "r" : "t";
    tmp = "<" + tagName;
    if (HINT.namespaces) {
      for (var prefix in namespaces) {
        tmp += " xmlns:" + prefix + "=\"urn:s9e:TextFormatter:" + prefix + "\"";
      }
    }
    output = tmp + ">" + output + "</" + tagName + ">";
  }
  function outputTag(tag) {
    isRich = true;
    var tagName = tag.getName();
    var tagPos = tag.getPos();
    var tagLen = tag.getLen();
    var tagFlags = tag.getFlags();
    var skipBefore = 0;
    var skipAfter = 0;
    if (HINT.RULE_IGNORE_WHITESPACE && tagFlags & RULE_IGNORE_WHITESPACE) {
      skipBefore = 1;
      skipAfter = tag.isEndTag() ? 2 : 1;
    }
    var closeParagraph = !tag.isStartTag() || !!HINT.RULE_BREAK_PARAGRAPH && !!(tagFlags & RULE_BREAK_PARAGRAPH);
    outputText(tagPos, skipBefore, closeParagraph);
    var tagText = tagLen ? htmlspecialchars_noquotes(text.substring(tagPos, tagPos + tagLen)) : "";
    if (tag.isStartTag()) {
      if (!HINT.RULE_BREAK_PARAGRAPH || !(tagFlags & RULE_BREAK_PARAGRAPH)) {
        outputParagraphStart(tagPos);
      }
      if (HINT.namespaces) {
        var colonPos = tagName.indexOf(":");
        if (colonPos > 0) {
          namespaces[tagName.substring(0, colonPos)] = 0;
        }
      }
      output += "<" + tagName;
      var attributes = tag.getAttributes();
      var attributeNames = [];
      for (var attrName in attributes) {
        attributeNames.push(attrName);
      }
      attributeNames.sort(function (a, b) {
        if (a > b) {
          return 1;
        } else {
          return -1;
        }
      });
      attributeNames.forEach(function (attrName) {
        output += " " + attrName + "=\"" + htmlspecialchars_compat(attributes[attrName].toString()).replace(/\n/g, "&#10;") + "\"";
      });
      if (tag.isSelfClosingTag()) {
        if (tagLen) {
          output += ">" + tagText + "</" + tagName + ">";
        } else {
          output += "/>";
        }
      } else if (tagLen) {
        output += "><s>" + tagText + "</s>";
      } else {
        output += ">";
      }
    } else {
      if (tagLen) {
        output += "<e>" + tagText + "</e>";
      }
      output += "</" + tagName + ">";
    }
    pos = tagPos + tagLen;
    wsPos = pos;
    while (skipAfter && wsPos < textLen && text[wsPos] === "\n") {
      --skipAfter;
      ++wsPos;
    }
  }
  function outputText(catchupPos, maxLines, closeParagraph) {
    if (closeParagraph) {
      if (!(context.flags & RULE_CREATE_PARAGRAPHS)) {
        closeParagraph = false;
      } else {
        maxLines = -1;
      }
    }
    if (pos >= catchupPos) {
      if (closeParagraph) {
        outputParagraphEnd();
      }
    }
    if (wsPos > pos) {
      var skipPos = Math.min(catchupPos, wsPos);
      output += text.substring(pos, skipPos);
      pos = skipPos;
      if (pos >= catchupPos) {
        if (closeParagraph) {
          outputParagraphEnd();
        }
      }
    }
    var catchupText;
    if (HINT.RULE_IGNORE_TEXT && context.flags & RULE_IGNORE_TEXT) {
      catchupText = text.substring(pos, catchupPos);
      if (!/^[ \n\t]*$/.test(catchupText)) {
        catchupText = "<i>" + htmlspecialchars_noquotes(catchupText) + "</i>";
      }
      output += catchupText;
      pos = catchupPos;
      if (closeParagraph) {
        outputParagraphEnd();
      }
      return;
    }
    var ignorePos = catchupPos;
    var ignoreLen = 0;
    while (maxLines && --ignorePos >= pos) {
      var c = text[ignorePos];
      if (c !== " " && c !== "\n" && c !== "\t") {
        break;
      }
      if (c === "\n") {
        --maxLines;
      }
      ++ignoreLen;
    }
    catchupPos -= ignoreLen;
    if (HINT.RULE_CREATE_PARAGRAPHS && context.flags & RULE_CREATE_PARAGRAPHS) {
      if (!context.inParagraph) {
        outputWhitespace(catchupPos);
        if (catchupPos > pos) {
          outputParagraphStart(catchupPos);
        }
      }
      var pbPos = text.indexOf("\n\n", pos);
      while (pbPos > -1 && pbPos < catchupPos) {
        outputText(pbPos, 0, true);
        outputParagraphStart(catchupPos);
        pbPos = text.indexOf("\n\n", pos);
      }
    }
    if (catchupPos > pos) {
      catchupText = htmlspecialchars_noquotes(text.substring(pos, catchupPos));
      if (HINT.RULE_ENABLE_AUTO_BR && (context.flags & RULES_AUTO_LINEBREAKS) === RULE_ENABLE_AUTO_BR) {
        catchupText = catchupText.replace(/\n/g, "<br/>\n");
      }
      output += catchupText;
    }
    if (closeParagraph) {
      outputParagraphEnd();
    }
    if (ignoreLen) {
      output += text.substring(catchupPos, catchupPos + ignoreLen);
    }
    pos = catchupPos + ignoreLen;
  }
  function outputBrTag(tag) {
    outputText(tag.getPos(), 0, false);
    output += "<br/>";
  }
  function outputIgnoreTag(tag) {
    var tagPos = tag.getPos();
    var tagLen = tag.getLen();
    var ignoreText = text.substring(tagPos, tagPos + tagLen);
    outputText(tagPos, 0, false);
    output += "<i>" + htmlspecialchars_noquotes(ignoreText) + "</i>";
    isRich = true;
    pos = tagPos + tagLen;
  }
  function outputParagraphStart(maxPos) {
    if (!HINT.RULE_CREATE_PARAGRAPHS) {
      return;
    }
    if (context.inParagraph || !(context.flags & RULE_CREATE_PARAGRAPHS)) {
      return;
    }
    outputWhitespace(maxPos);
    if (pos < textLen) {
      output += "<p>";
      context.inParagraph = true;
    }
  }
  function outputParagraphEnd() {
    if (!context.inParagraph) {
      return;
    }
    output += "</p>";
    context.inParagraph = false;
  }
  function outputVerbatim(tag) {
    var flags = context.flags;
    context.flags = tag.getFlags();
    outputText(currentTag.getPos() + currentTag.getLen(), 0, false);
    context.flags = flags;
  }
  function outputWhitespace(maxPos) {
    while (pos < maxPos && " \n\t".indexOf(text[pos]) > -1) {
      output += text[pos];
      ++pos;
    }
  }
  function disablePlugin(pluginName) {
    if (plugins[pluginName]) {
      plugins[pluginName].isDisabled = true;
    }
  }
  function enablePlugin(pluginName) {
    if (plugins[pluginName]) {
      plugins[pluginName].isDisabled = false;
    }
  }
  function executePluginParser(pluginName) {
    var pluginConfig = plugins[pluginName];
    if (pluginConfig.quickMatch && text.indexOf(pluginConfig.quickMatch) < 0) {
      return;
    }
    var matches = [];
    if (HINT.regexp && HINT.regexpLimit && typeof pluginConfig.regexp !== "undefined" && typeof pluginConfig.regexpLimit !== "undefined") {
      matches = getMatches(pluginConfig.regexp, pluginConfig.regexpLimit);
      if (!matches.length) {
        return;
      }
    }
    getPluginParser(pluginName)(text, matches);
  }
  function executePluginParsers() {
    for (var pluginName in plugins) {
      if (!plugins[pluginName].isDisabled) {
        executePluginParser(pluginName);
      }
    }
  }
  function getMatches(regexp, limit) {
    regexp.lastIndex = 0;
    var matches = [];
    var cnt = 0;
    var m;
    while (++cnt <= limit && (m = regexp.exec(text))) {
      var pos = m.index;
      var match = [[m[0], pos]];
      var i = 0;
      while (++i < m.length) {
        var str = m[i];
        if (str === undefined) {
          match.push(["", -1]);
        } else {
          match.push([str, text.indexOf(str, pos)]);
          pos += str.length;
        }
      }
      matches.push(match);
    }
    return matches;
  }
  function getPluginParser(pluginName) {
    return plugins[pluginName].parser;
  }
  function registerParser(pluginName, parser, regexp, limit) {
    if (!plugins[pluginName]) {
      plugins[pluginName] = {};
    }
    if (regexp) {
      plugins[pluginName].regexp = regexp;
      plugins[pluginName].limit = limit || Infinity;
    }
    plugins[pluginName].parser = parser;
  }
  function closeAncestor(tag) {
    if (!HINT.closeAncestor) {
      return false;
    }
    if (openTags.length) {
      var tagName = tag.getName();
      var tagConfig = tagsConfig[tagName];
      if (tagConfig.rules.closeAncestor) {
        var i = openTags.length;
        while (--i >= 0) {
          var ancestor = openTags[i];
          var ancestorName = ancestor.getName();
          if (tagConfig.rules.closeAncestor[ancestorName]) {
            ++currentFixingCost;
            tagStack.push(tag);
            addMagicEndTag(ancestor, tag.getPos(), tag.getSortPriority() - 1);
            return true;
          }
        }
      }
    }
    return false;
  }
  function closeParent(tag) {
    if (!HINT.closeParent) {
      return false;
    }
    if (openTags.length) {
      var tagName = tag.getName();
      var tagConfig = tagsConfig[tagName];
      if (tagConfig.rules.closeParent) {
        var parent = openTags[openTags.length - 1];
        var parentName = parent.getName();
        if (tagConfig.rules.closeParent[parentName]) {
          ++currentFixingCost;
          tagStack.push(tag);
          addMagicEndTag(parent, tag.getPos(), tag.getSortPriority() - 1);
          return true;
        }
      }
    }
    return false;
  }
  function createChild(tag) {
    if (!HINT.createChild) {
      return;
    }
    var tagConfig = tagsConfig[tag.getName()];
    if (tagConfig.rules.createChild) {
      var priority = -1000;
      var _text = text.substring(pos);
      var tagPos = pos + _text.length - _text.replace(/^[ \n\r\t]+/, "").length;
      tagConfig.rules.createChild.forEach(function (tagName) {
        addStartTag(tagName, tagPos, 0, ++priority);
      });
    }
  }
  function fosterParent(tag) {
    if (!HINT.fosterParent) {
      return false;
    }
    if (openTags.length) {
      var tagName = tag.getName();
      var tagConfig = tagsConfig[tagName];
      if (tagConfig.rules.fosterParent) {
        var parent = openTags[openTags.length - 1];
        var parentName = parent.getName();
        if (tagConfig.rules.fosterParent[parentName]) {
          if (parentName !== tagName && currentFixingCost < maxFixingCost) {
            addFosterTag(tag, parent);
          }
          tagStack.push(tag);
          addMagicEndTag(parent, tag.getPos(), tag.getSortPriority() - 1);
          currentFixingCost += 4;
          return true;
        }
      }
    }
    return false;
  }
  function requireAncestor(tag) {
    if (!HINT.requireAncestor) {
      return false;
    }
    var tagName = tag.getName();
    var tagConfig = tagsConfig[tagName];
    if (tagConfig.rules.requireAncestor) {
      var i = tagConfig.rules.requireAncestor.length;
      while (--i >= 0) {
        var ancestorName = tagConfig.rules.requireAncestor[i];
        if (cntOpen[ancestorName]) {
          return false;
        }
      }
      logger.err("Tag requires an ancestor", {
        requireAncestor: tagConfig.rules.requireAncestor.join(", "),
        tag: tag
      });
      return true;
    }
    return false;
  }
  function addFosterTag(tag, fosterTag) {
    var coords = getMagicStartCoords(tag.getPos() + tag.getLen());
    var childPos = coords[0];
    var childPrio = coords[1];
    var childTag = addCopyTag(fosterTag, childPos, 0, childPrio);
    tag.cascadeInvalidationTo(childTag);
  }
  function addMagicEndTag(startTag, tagPos, prio) {
    var tagName = startTag.getName();
    if (HINT.RULE_IGNORE_WHITESPACE && (currentTag.getFlags() | startTag.getFlags()) & RULE_IGNORE_WHITESPACE) {
      tagPos = getMagicEndPos(tagPos);
    }
    var endTag = addEndTag(tagName, tagPos, 0, prio || 0);
    endTag.pairWith(startTag);
    return endTag;
  }
  function getMagicEndPos(tagPos) {
    while (tagPos > pos && WHITESPACE.indexOf(text[tagPos - 1]) > -1) {
      --tagPos;
    }
    return tagPos;
  }
  function getMagicStartCoords(tagPos) {
    var nextPos;
    var nextPrio;
    var nextTag;
    var prio;
    if (!tagStack.length) {
      nextPos = textLen + 1;
      nextPrio = 0;
    } else {
      nextTag = tagStack[tagStack.length - 1];
      nextPos = nextTag.getPos();
      nextPrio = nextTag.getSortPriority();
    }
    while (tagPos < nextPos && WHITESPACE.indexOf(text[tagPos]) > -1) {
      ++tagPos;
    }
    prio = tagPos === nextPos ? nextPrio - 1 : 0;
    return [tagPos, prio];
  }
  function isFollowedByClosingTag(tag) {
    if (!tagStack.length) {
      return false;
    } else {
      return tagStack[tagStack.length - 1].canClose(tag);
    }
  }
  function processTags() {
    if (!tagStack.length) {
      return;
    }
    for (var tagName in tagsConfig) {
      cntOpen[tagName] = 0;
      cntTotal[tagName] = 0;
    }
    do {
      while (tagStack.length) {
        if (!tagStackIsSorted) {
          sortTags();
        }
        currentTag = tagStack.pop();
        processCurrentTag();
      }
      openTags.forEach(function (startTag) {
        addMagicEndTag(startTag, textLen);
      });
    } while (tagStack.length);
  }
  function processCurrentTag() {
    if (context.flags & RULE_IGNORE_TAGS && !currentTag.canClose(openTags[openTags.length - 1]) && !currentTag.isSystemTag()) {
      currentTag.invalidate();
    }
    var tagPos = currentTag.getPos();
    var tagLen = currentTag.getLen();
    if (pos > tagPos && !currentTag.isInvalid()) {
      var startTag = currentTag.getStartTag();
      if (startTag && openTags.indexOf(startTag) >= 0) {
        addEndTag(startTag.getName(), pos, Math.max(0, tagPos + tagLen - pos)).pairWith(startTag);
        return;
      }
      if (currentTag.isIgnoreTag()) {
        var ignoreLen = tagPos + tagLen - pos;
        if (ignoreLen > 0) {
          addIgnoreTag(pos, ignoreLen);
          return;
        }
      }
      currentTag.invalidate();
    }
    if (currentTag.isInvalid()) {
      return;
    }
    if (currentTag.isIgnoreTag()) {
      outputIgnoreTag(currentTag);
    } else if (currentTag.isBrTag()) {
      if (!HINT.RULE_PREVENT_BR || !(context.flags & RULE_PREVENT_BR)) {
        outputBrTag(currentTag);
      }
    } else if (currentTag.isParagraphBreak()) {
      outputText(currentTag.getPos(), 0, true);
    } else if (currentTag.isVerbatim()) {
      outputVerbatim(currentTag);
    } else if (currentTag.isStartTag()) {
      processStartTag(currentTag);
    } else {
      processEndTag(currentTag);
    }
  }
  function processStartTag(tag) {
    var tagName = tag.getName();
    var tagConfig = tagsConfig[tagName];
    if (cntTotal[tagName] >= tagConfig.tagLimit) {
      logger.err("Tag limit exceeded", {
        tag: tag,
        tagName: tagName,
        tagLimit: tagConfig.tagLimit
      });
      tag.invalidate();
      return;
    }
    filterTag(tag);
    if (tag.isInvalid()) {
      return;
    }
    if (currentFixingCost < maxFixingCost) {
      if (fosterParent(tag) || closeParent(tag) || closeAncestor(tag)) {
        return;
      }
    }
    if (cntOpen[tagName] >= tagConfig.nestingLimit) {
      logger.err("Nesting limit exceeded", {
        tag: tag,
        tagName: tagName,
        nestingLimit: tagConfig.nestingLimit
      });
      tag.invalidate();
      return;
    }
    if (!tagIsAllowed(tagName)) {
      var msg = "Tag is not allowed in this context";
      var context = {
        tag: tag,
        tagName: tagName
      };
      if (tag.getLen() > 0) {
        logger.warn(msg, context);
      } else {
        logger.debug(msg, context);
      }
      tag.invalidate();
      return;
    }
    if (requireAncestor(tag)) {
      tag.invalidate();
      return;
    }
    if (HINT.RULE_AUTO_CLOSE && tag.getFlags() & RULE_AUTO_CLOSE && !tag.isSelfClosingTag() && !tag.getEndTag() && !isFollowedByClosingTag(tag)) {
      var newTag = new Tag(Tag.SELF_CLOSING_TAG, tagName, tag.getPos(), tag.getLen());
      newTag.setAttributes(tag.getAttributes());
      newTag.setFlags(tag.getFlags());
      tag = newTag;
    }
    if (HINT.RULE_TRIM_FIRST_LINE && tag.getFlags() & RULE_TRIM_FIRST_LINE && text[tag.getPos() + tag.getLen()] === "\n") {
      addIgnoreTag(tag.getPos() + tag.getLen(), 1);
    }
    outputTag(tag);
    pushContext(tag);
    createChild(tag);
  }
  function processEndTag(tag) {
    var tagName = tag.getName();
    if (!cntOpen[tagName]) {
      return;
    }
    var closeTags = [];
    var i = openTags.length;
    while (--i >= 0) {
      var openTag = openTags[i];
      if (tag.canClose(openTag)) {
        break;
      }
      closeTags.push(openTag);
      ++currentFixingCost;
    }
    if (i < 0) {
      logger.debug("Skipping end tag with no start tag", {
        tag: tag
      });
      return;
    }
    var flags = tag.getFlags();
    closeTags.forEach(function (openTag) {
      flags |= openTag.getFlags();
    });
    var ignoreWhitespace = HINT.RULE_IGNORE_WHITESPACE && flags & RULE_IGNORE_WHITESPACE;
    var keepReopening = HINT.RULE_AUTO_REOPEN && currentFixingCost < maxFixingCost;
    var reopenTags = [];
    closeTags.forEach(function (openTag) {
      var openTagName = openTag.getName();
      if (keepReopening) {
        if (openTag.getFlags() & RULE_AUTO_REOPEN) {
          reopenTags.push(openTag);
        } else {
          keepReopening = false;
        }
      }
      var tagPos = tag.getPos();
      if (ignoreWhitespace) {
        tagPos = getMagicEndPos(tagPos);
      }
      var endTag = new Tag(Tag.END_TAG, openTagName, tagPos, 0);
      endTag.setFlags(openTag.getFlags());
      outputTag(endTag);
      popContext();
    });
    outputTag(tag);
    popContext();
    if (closeTags.length && currentFixingCost < maxFixingCost) {
      var ignorePos = pos;
      i = tagStack.length;
      while (--i >= 0 && ++currentFixingCost < maxFixingCost) {
        var upcomingTag = tagStack[i];
        if (upcomingTag.getPos() > ignorePos || upcomingTag.isStartTag()) {
          break;
        }
        var j = closeTags.length;
        while (--j >= 0 && ++currentFixingCost < maxFixingCost) {
          if (upcomingTag.canClose(closeTags[j])) {
            closeTags.splice(j, 1);
            if (reopenTags[j]) {
              reopenTags.splice(j, 1);
            }
            ignorePos = Math.max(ignorePos, upcomingTag.getPos() + upcomingTag.getLen());
            break;
          }
        }
      }
      if (ignorePos > pos) {
        outputIgnoreTag(new Tag(Tag.SELF_CLOSING_TAG, "i", pos, ignorePos - pos));
      }
    }
    reopenTags.forEach(function (startTag) {
      var newTag = addCopyTag(startTag, pos, 0);
      var endTag = startTag.getEndTag();
      if (endTag) {
        newTag.pairWith(endTag);
      }
    });
  }
  function popContext() {
    var tag = openTags.pop();
    --cntOpen[tag.getName()];
    context = context.parentContext;
  }
  function pushContext(tag) {
    var tagName = tag.getName();
    var tagFlags = tag.getFlags();
    var tagConfig = tagsConfig[tagName];
    ++cntTotal[tagName];
    if (tag.isSelfClosingTag()) {
      return;
    }
    var allowed = [];
    context.allowed.forEach(function (v, k) {
      if (!HINT.RULE_IS_TRANSPARENT || !(tagFlags & RULE_IS_TRANSPARENT)) {
        v = v & 65280 | v >> 8;
      }
      allowed.push(tagConfig.allowed[k] & v);
    });
    var flags = tagFlags | context.flags & RULES_INHERITANCE;
    if (flags & RULE_DISABLE_AUTO_BR) {
      flags &= ~RULE_ENABLE_AUTO_BR;
    }
    ++cntOpen[tagName];
    openTags.push(tag);
    context = {
      parentContext: context
    };
    context.allowed = allowed;
    context.flags = flags;
  }
  function tagIsAllowed(tagName) {
    var n = tagsConfig[tagName].bitNumber;
    return !!(context.allowed[n >> 3] & 1 << (n & 7));
  }
  function addStartTag(name, pos, len, prio) {
    return addTag(Tag.START_TAG, name, pos, len, prio || 0);
  }
  function addEndTag(name, pos, len, prio) {
    return addTag(Tag.END_TAG, name, pos, len, prio || 0);
  }
  function addSelfClosingTag(name, pos, len, prio) {
    return addTag(Tag.SELF_CLOSING_TAG, name, pos, len, prio || 0);
  }
  function addBrTag(pos, prio) {
    return addTag(Tag.SELF_CLOSING_TAG, "br", pos, 0, prio || 0);
  }
  function addIgnoreTag(pos, len, prio) {
    return addTag(Tag.SELF_CLOSING_TAG, "i", pos, Math.min(len, textLen - pos), prio || 0);
  }
  function addParagraphBreak(pos, prio) {
    return addTag(Tag.SELF_CLOSING_TAG, "pb", pos, 0, prio || 0);
  }
  function addCopyTag(tag, pos, len, prio) {
    var copy = addTag(tag.getType(), tag.getName(), pos, len, tag.getSortPriority());
    copy.setAttributes(tag.getAttributes());
    return copy;
  }
  function addTag(type, name, pos, len, prio) {
    var tag = new Tag(type, name, pos, len, prio || 0);
    if (tagsConfig[name]) {
      tag.setFlags(tagsConfig[name].rules.flags);
    }
    if (!tagsConfig[name] && !tag.isSystemTag() || isInvalidTextSpan(pos, len)) {
      tag.invalidate();
    } else if (tagsConfig[name] && tagsConfig[name].isDisabled) {
      logger.warn("Tag is disabled", {
        tag: tag,
        tagName: name
      });
      tag.invalidate();
    } else {
      insertTag(tag);
    }
    return tag;
  }
  function isInvalidTextSpan(pos, len) {
    return len < 0 || pos < 0 || pos + len > textLen || /[\uDC00-\uDFFF]/.test(text.substring(pos, pos + 1) + text.substring(pos + len, pos + len + 1));
  }
  function insertTag(tag) {
    if (!tagStackIsSorted) {
      tagStack.push(tag);
    } else {
      var i = tagStack.length;
      var key = getSortKey(tag);
      while (i > 0 && key > getSortKey(tagStack[i - 1])) {
        tagStack[i] = tagStack[i - 1];
        --i;
      }
      tagStack[i] = tag;
    }
  }
  function addTagPair(name, startPos, startLen, endPos, endLen, prio) {
    var endTag = addEndTag(name, endPos, endLen, -prio || 0);
    var startTag = addStartTag(name, startPos, startLen, prio || 0);
    startTag.pairWith(endTag);
    return startTag;
  }
  function addVerbatim(pos, len, prio) {
    return addTag(Tag.SELF_CLOSING_TAG, "v", pos, len, prio || 0);
  }
  function sortTags() {
    var arr = {};
    var keys = [];
    var i = tagStack.length;
    while (--i >= 0) {
      var tag = tagStack[i];
      var key = getSortKey(tag, i);
      keys.push(key);
      arr[key] = tag;
    }
    keys.sort();
    i = keys.length;
    tagStack = [];
    while (--i >= 0) {
      tagStack.push(arr[keys[i]]);
    }
    tagStackIsSorted = true;
  }
  function getSortKey(tag, tagIndex) {
    var prioFlag = tag.getSortPriority() >= 0;
    var prio = tag.getSortPriority();
    if (!prioFlag) {
      prio += 1073741824;
    }
    var lenFlag = tag.getLen() > 0;
    var lenOrder;
    if (lenFlag) {
      lenOrder = textLen - tag.getLen();
    } else {
      var order = {
        [Tag.END_TAG]: 0,
        [Tag.SELF_CLOSING_TAG]: 1,
        [Tag.START_TAG]: 2
      };
      lenOrder = order[tag.getType()];
    }
    return hex32(tag.getPos()) + +prioFlag + hex32(prio) + +lenFlag + hex32(lenOrder) + hex32(tagIndex || 0);
  }
  function hex32(number) {
    var hex = number.toString(16);
    return "        ".substring(hex.length) + hex;
  }
  var MSXML = typeof DOMParser === "undefined" || typeof XSLTProcessor === "undefined";
  var xslt = {
    init: function (xsl) {
      var stylesheet = xslt.loadXML(xsl);
      if (MSXML) {
        var generator = new ActiveXObject("MSXML2.XSLTemplate.6.0");
        generator.stylesheet = stylesheet;
        xslt.proc = generator.createProcessor();
      } else {
        xslt.proc = new XSLTProcessor();
        xslt.proc.importStylesheet(stylesheet);
      }
    },
    loadXML: function (xml) {
      var dom;
      if (MSXML) {
        dom = new ActiveXObject("MSXML2.FreeThreadedDOMDocument.6.0");
        dom.async = false;
        dom.validateOnParse = false;
        dom.loadXML(xml);
      } else {
        dom = new DOMParser().parseFromString(xml, "text/xml");
      }
      if (!dom) {
        throw "Cannot parse " + xml;
      }
      return dom;
    },
    setParameter: function (paramName, paramValue) {
      if (MSXML) {
        xslt.proc.addParameter(paramName, paramValue, "");
      } else {
        xslt.proc.setParameter(null, paramName, paramValue);
      }
    },
    transformToFragment: function (xml, targetDoc) {
      if (MSXML) {
        var div = targetDoc.createElement("div");
        var fragment = targetDoc.createDocumentFragment();
        xslt.proc.input = xslt.loadXML(xml);
        xslt.proc.transform();
        div.innerHTML = xslt.proc.output;
        while (div.firstChild) {
          fragment.appendChild(div.firstChild);
        }
        return fragment;
      }
      return xslt.proc.transformToFragment(xslt.loadXML(xml), targetDoc);
    }
  };
  xslt.init(xsl);
  var functionCache = {};
  function preview(text, target) {
    var targetDoc = target.ownerDocument;
    if (!targetDoc) {
      throw "Target does not have a ownerDocument";
    }
    var resultFragment = xslt.transformToFragment(parse(text).replace(/<[eis]>[^<]*<\/[eis]>/g, ""), targetDoc);
    var lastUpdated = target;
    if (typeof window !== "undefined" && "chrome" in window) {
      resultFragment.querySelectorAll("script").forEach(function (oldScript) {
        let newScript = document.createElement("script");
        for (let attribute of oldScript.attributes) {
          newScript.setAttribute(attribute.name, attribute.value);
        }
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }
    if (HINT.hash) {
      computeHashes(resultFragment);
    }
    if (HINT.onRender) {
      executeEvents(resultFragment, "render");
    }
    function computeHashes(fragment) {
      var nodes = fragment.querySelectorAll("[data-s9e-livepreview-hash]");
      var i = nodes.length;
      while (--i >= 0) {
        nodes[i].setAttribute("data-s9e-livepreview-hash", hash(nodes[i].outerHTML));
      }
    }
    function executeEvent(node, eventName) {
      var code = node.getAttribute("data-s9e-livepreview-on" + eventName);
      if (!functionCache[code]) {
        functionCache[code] = new Function(code);
      }
      functionCache[code].call(node);
    }
    function executeEvents(root, eventName) {
      if (root instanceof Element && root.hasAttribute("data-s9e-livepreview-on" + eventName)) {
        executeEvent(root, eventName);
      }
      var nodes = root.querySelectorAll("[data-s9e-livepreview-on" + eventName + "]");
      var i = nodes.length;
      while (--i >= 0) {
        executeEvent(nodes[i], eventName);
      }
    }
    function refreshElementContent(oldParent, newParent) {
      var oldNodes = oldParent.childNodes;
      var newNodes = newParent.childNodes;
      var oldCnt = oldNodes.length;
      var newCnt = newNodes.length;
      var oldNode;
      var newNode;
      var left = 0;
      var right = 0;
      while (left < oldCnt && left < newCnt) {
        oldNode = oldNodes[left];
        newNode = newNodes[left];
        if (!refreshNode(oldNode, newNode)) {
          break;
        }
        ++left;
      }
      var maxRight = Math.min(oldCnt - left, newCnt - left);
      while (right < maxRight) {
        oldNode = oldNodes[oldCnt - (right + 1)];
        newNode = newNodes[newCnt - (right + 1)];
        if (!refreshNode(oldNode, newNode)) {
          break;
        }
        ++right;
      }
      var i = oldCnt - right;
      while (--i >= left) {
        oldParent.removeChild(oldNodes[i]);
        lastUpdated = oldParent;
      }
      var rightBoundary = newCnt - right;
      if (left >= rightBoundary) {
        return;
      }
      var newNodesFragment = targetDoc.createDocumentFragment();
      i = left;
      do {
        newNode = newNodes[i];
        if (HINT.onUpdate && newNode instanceof Element) {
          executeEvents(newNode, "update");
        }
        lastUpdated = newNodesFragment.appendChild(newNode);
      } while (i < --rightBoundary);
      if (!right) {
        oldParent.appendChild(newNodesFragment);
      } else {
        oldParent.insertBefore(newNodesFragment, oldParent.childNodes[left]);
      }
    }
    function refreshNode(oldNode, newNode) {
      if (oldNode.nodeName !== newNode.nodeName || oldNode.nodeType !== newNode.nodeType) {
        return false;
      }
      if (oldNode instanceof HTMLElement && newNode instanceof HTMLElement) {
        if (!oldNode.isEqualNode(newNode) && !elementHashesMatch(oldNode, newNode)) {
          if (HINT.onUpdate && newNode.hasAttribute("data-s9e-livepreview-onupdate")) {
            executeEvent(newNode, "update");
          }
          syncElementAttributes(oldNode, newNode);
          refreshElementContent(oldNode, newNode);
        }
      } else if (oldNode.nodeType === 3 || oldNode.nodeType === 8) {
        if (oldNode.nodeValue !== newNode.nodeValue) {
          oldNode.nodeValue = newNode.nodeValue;
          lastUpdated = oldNode;
        }
      }
      return true;
    }
    function elementHashesMatch(oldEl, newEl) {
      if (!HINT.hash) {
        return false;
      }
      const attrName = "data-s9e-livepreview-hash";
      return oldEl.hasAttribute(attrName) && newEl.hasAttribute(attrName) && oldEl.getAttribute(attrName) === newEl.getAttribute(attrName);
    }
    function hash(text) {
      var pos = text.length;
      var s1 = 0;
      var s2 = 0;
      while (--pos >= 0) {
        s1 = (s1 + text.charCodeAt(pos)) % 65535;
        s2 = (s1 + s2) % 65535;
      }
      return s2 << 16 | s1;
    }
    function syncElementAttributes(oldEl, newEl) {
      var oldAttributes = oldEl.attributes;
      var newAttributes = newEl.attributes;
      var oldCnt = oldAttributes.length;
      var newCnt = newAttributes.length;
      var i = oldCnt;
      var ignoreAttrs = " " + oldEl.getAttribute("data-s9e-livepreview-ignore-attrs") + " ";
      while (--i >= 0) {
        var oldAttr = oldAttributes[i];
        var namespaceURI = oldAttr.namespaceURI;
        var attrName = oldAttr.name;
        if (HINT.ignoreAttrs && ignoreAttrs.indexOf(" " + attrName + " ") > -1) {
          continue;
        }
        if (!newEl.hasAttributeNS(namespaceURI, attrName)) {
          oldEl.removeAttributeNS(namespaceURI, attrName);
          lastUpdated = oldEl;
        }
      }
      i = newCnt;
      while (--i >= 0) {
        var newAttr = newAttributes[i];
        var namespaceURI = newAttr.namespaceURI;
        var attrName = newAttr.name;
        var attrValue = newAttr.value;
        if (HINT.ignoreAttrs && ignoreAttrs.indexOf(" " + attrName + " ") > -1) {
          continue;
        }
        if (attrValue !== oldEl.getAttributeNS(namespaceURI, attrName)) {
          oldEl.setAttributeNS(namespaceURI, attrName, attrValue);
          lastUpdated = oldEl;
        }
      }
    }
    refreshElementContent(target, resultFragment);
    return lastUpdated;
  }
  function setParameter(paramName, paramValue) {
    xslt.setParameter(paramName, paramValue);
  }
  if (!window.s9e) {
    window.s9e = {};
  }
  window.s9e.TextFormatter = {
    preview: preview
  };
})();
var module = {};
module.exports = function (t) {
  var a = {};
  function o(e) {
    if (a[e]) {
      return a[e].exports;
    }
    var s = a[e] = {
      i: e,
      l: false,
      exports: {}
    };
    t[e].call(s.exports, s, s.exports, o);
    s.l = true;
    return s.exports;
  }
  o.m = t;
  o.c = a;
  o.d = function (t, a, e) {
    if (!o.o(t, a)) {
      Object.defineProperty(t, a, {
        enumerable: true,
        get: e
      });
    }
  };
  o.r = function (t) {
    if (typeof Symbol != "undefined" && Symbol.toStringTag) {
      Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(t, "__esModule", {
      value: true
    });
  };
  o.t = function (t, a) {
    if (a & 1) {
      t = o(t);
    }
    if (a & 8) {
      return t;
    }
    if (a & 4 && typeof t == "object" && t && t.__esModule) {
      return t;
    }
    var e = Object.create(null);
    o.r(e);
    Object.defineProperty(e, "default", {
      enumerable: true,
      value: t
    });
    if (a & 2 && typeof t != "string") {
      for (var s in t) {
        o.d(e, s, function (a) {
          return t[a];
        }.bind(null, s));
      }
    }
    return e;
  };
  o.n = function (t) {
    var a = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    o.d(a, "a", a);
    return a;
  };
  o.o = function (t, a) {
    return Object.prototype.hasOwnProperty.call(t, a);
  };
  o.p = "";
  return o(o.s = 22);
}([function (t, a) {
  t.exports = flarum.core.compat.app;
}, function (t, a) {
  t.exports = flarum.core.compat.Model;
}, function (t, a) {
  t.exports = flarum.core.compat["utils/withAttr"];
}, function (t, a) {
  t.exports = flarum.core.compat.extend;
}, function (t, a) {
  t.exports = flarum.core.compat["components/Button"];
}, function (t, a) {
  t.exports = flarum.core.compat["components/Post"];
}, function (t, a) {
  t.exports = flarum.core.compat["utils/PostControls"];
}, function (t, a) {
  t.exports = flarum.core.compat["utils/Stream"];
}, function (t, a) {
  t.exports = flarum.core.compat["components/Page"];
}, function (t, a) {
  t.exports = flarum.core.compat.Component;
}, function (t, a) {
  t.exports = flarum.core.compat["components/Link"];
}, function (t, a) {
  t.exports = flarum.core.compat["components/LoadingIndicator"];
}, function (t, a) {
  t.exports = flarum.core.compat["helpers/avatar"];
}, function (t, a) {
  t.exports = flarum.core.compat["helpers/username"];
}, function (t, a) {
  t.exports = flarum.core.compat["helpers/icon"];
}, function (t, a) {
  t.exports = flarum.core.compat["helpers/humanTime"];
}, function (t, a) {
  t.exports = flarum.core.compat["components/Modal"];
}, function (t, a) {
  t.exports = flarum.core.compat["components/HeaderSecondary"];
}, function (t, a) {
  t.exports = flarum.core.compat["components/NotificationsDropdown"];
}, function (t, a) {
  t.exports = flarum.core.compat["utils/ItemList"];
}, function (t, a) {
  t.exports = flarum.core.compat["utils/humanTime"];
}, function (t, a) {
  t.exports = flarum.core;
}, function (t, a, o) {
  "use strict";

  function e() {
    return (e = Object.assign || function (t) {
      for (var a = 1; a < arguments.length; a++) {
        var o = arguments[a];
        for (var e in o) {
          if (Object.prototype.hasOwnProperty.call(o, e)) {
            t[e] = o[e];
          }
        }
      }
      return t;
    }).apply(this, arguments);
  }
  o.r(a);
  var s = o(0);
  var n = o.n(s);
  var r = o(1);
  var l = o.n(r);
  function i(t, a) {
    t.prototype = Object.create(a.prototype);
    t.prototype.constructor = t;
    t.__proto__ = a;
  }
  var c = function (t) {
    function a() {
      return t.apply(this, arguments) || this;
    }
    i(a, t);
    return a;
  }(l.a);
  e(c.prototype, {
    type: l.a.attribute("type"),
    reason: l.a.attribute("reason"),
    reasonDetail: l.a.attribute("reasonDetail"),
    createdAt: l.a.attribute("createdAt", l.a.transformDate),
    post: l.a.hasOne("post"),
    user: l.a.hasOne("user")
  });
  var u = c;
  var p = o(8);
  var f = o.n(p);
  var d = o(9);
  var g = o.n(d);
  var h = o(10);
  var v = o.n(h);
  var b = o(11);
  var _ = o.n(b);
  var y = o(12);
  var x = o.n(y);
  var N = o(13);
  var F = o.n(N);
  var k = o(14);
  var w = o.n(k);
  var C = o(15);
  var D = o.n(C);
  var P = function (t) {
    function a() {
      return t.apply(this, arguments) || this;
    }
    i(a, t);
    var o = a.prototype;
    o.oninit = function (a) {
      t.prototype.oninit.call(this, a);
      this.state = this.attrs.state;
    };
    o.view = function () {
      var t = this.state.cache || [];
      return m("div", {
        className: "NotificationList FlagList"
      }, m("div", {
        className: "NotificationList-header"
      }, m("h4", {
        className: "App-titleControl App-titleControl--text"
      }, app.translator.trans("flarum-flags.forum.flagged_posts.title"))), m("div", {
        className: "NotificationList-content"
      }, m("ul", {
        className: "NotificationGroup-content"
      }, t.length ? t.map(function (t) {
        var a = t.post();
        return m("li", null, m(v.a, {
          href: app.route.post(a),
          className: "Notification Flag",
          onclick: function (t) {
            app.flags.index = a;
            t.redraw = false;
          }
        }, x()(a.user()), w()("fas fa-flag", {
          className: "Notification-icon"
        }), m("span", {
          className: "Notification-content"
        }, app.translator.trans("flarum-flags.forum.flagged_posts.item_text", {
          username: F()(a.user()),
          em: m("em", null),
          discussion: a.discussion().title()
        })), D()(t.createdAt()), m("div", {
          className: "Notification-excerpt"
        }, a.contentPlain())));
      }) : this.state.loading ? _.a.component({
        className: "LoadingIndicator--block"
      }) : m("div", {
        className: "NotificationList-empty"
      }, app.translator.trans("flarum-flags.forum.flagged_posts.empty_text")))));
    };
    return a;
  }(g.a);
  var O = function (t) {
    function a() {
      return t.apply(this, arguments) || this;
    }
    i(a, t);
    var o = a.prototype;
    o.oninit = function (a) {
      t.prototype.oninit.call(this, a);
      app.history.push("flags");
      app.flags.load();
      this.bodyClass = "App--flags";
    };
    o.view = function () {
      return m("div", {
        className: "FlagsPage"
      }, m(P, {
        state: app.flags
      }));
    };
    return a;
  }(f.a);
  var A = function () {
    function t(t) {
      this.app = t;
      this.loading = false;
    }
    t.prototype.load = function () {
      var t = this;
      if (!this.cache || !!this.app.session.user.attribute("newFlagCount")) {
        this.loading = true;
        m.redraw();
        this.app.store.find("flags").then(function (a) {
          t.app.session.user.pushAttributes({
            newFlagCount: 0
          });
          t.cache = a.sort(function (t, a) {
            return a.createdAt() - t.createdAt();
          });
        }).catch(function () {}).then(function () {
          t.loading = false;
          m.redraw();
        });
      }
    };
    return t;
  }();
  var j = o(3);
  var M = o(6);
  var L = o.n(M);
  var B = o(4);
  var T = o.n(B);
  var S = o(16);
  var E = o.n(S);
  var I = o(7);
  var H = o.n(I);
  var R = o(2);
  var U = o.n(R);
  var G = function (t) {
    function a() {
      return t.apply(this, arguments) || this;
    }
    i(a, t);
    var o = a.prototype;
    o.oninit = function (a) {
      t.prototype.oninit.call(this, a);
      this.success = false;
      this.reason = H()("");
      this.reasonDetail = H()("");
    };
    o.className = function () {
      return "FlagPostModal Modal--medium";
    };
    o.title = function () {
      return app.translator.trans("flarum-flags.forum.flag_post.title");
    };
    o.content = function () {
      if (this.success) {
        return m("div", {
          className: "Modal-body"
        }, m("div", {
          className: "Form Form--centered"
        }, m("p", {
          className: "helpText"
        }, app.translator.trans("flarum-flags.forum.flag_post.confirmation_message")), m("div", {
          className: "Form-group"
        }, m(T.a, {
          className: "Button Button--primary Button--block",
          onclick: this.hide.bind(this)
        }, app.translator.trans("flarum-flags.forum.flag_post.dismiss_button")))));
      }
      var t = app.forum.attribute("guidelinesUrl");
      return m("div", {
        className: "Modal-body"
      }, m("div", {
        className: "Form Form--centered"
      }, m("div", {
        className: "Form-group"
      }, m("div", null, m("label", {
        className: "checkbox"
      }, m("input", {
        type: "radio",
        name: "reason",
        checked: this.reason() === "off_topic",
        value: "off_topic",
        onclick: U()("value", this.reason)
      }), m("strong", null, app.translator.trans("flarum-flags.forum.flag_post.reason_off_topic_label")), app.translator.trans("flarum-flags.forum.flag_post.reason_off_topic_text"), this.reason() === "off_topic" ? m("textarea", {
        className: "FormControl",
        placeholder: app.translator.trans("flarum-flags.forum.flag_post.reason_details_placeholder"),
        value: this.reasonDetail(),
        oninput: U()("value", this.reasonDetail)
      }) : ""), m("label", {
        className: "checkbox"
      }, m("input", {
        type: "radio",
        name: "reason",
        checked: this.reason() === "inappropriate",
        value: "inappropriate",
        onclick: U()("value", this.reason)
      }), m("strong", null, app.translator.trans("flarum-flags.forum.flag_post.reason_inappropriate_label")), app.translator.trans("flarum-flags.forum.flag_post.reason_inappropriate_text", {
        a: t ? m("a", {
          href: t,
          target: "_blank"
        }) : undefined
      }), this.reason() === "inappropriate" ? m("textarea", {
        className: "FormControl",
        placeholder: app.translator.trans("flarum-flags.forum.flag_post.reason_details_placeholder"),
        value: this.reasonDetail(),
        oninput: U()("value", this.reasonDetail)
      }) : ""), m("label", {
        className: "checkbox"
      }, m("input", {
        type: "radio",
        name: "reason",
        checked: this.reason() === "spam",
        value: "spam",
        onclick: U()("value", this.reason)
      }), m("strong", null, app.translator.trans("flarum-flags.forum.flag_post.reason_spam_label")), app.translator.trans("flarum-flags.forum.flag_post.reason_spam_text"), this.reason() === "spam" ? m("textarea", {
        className: "FormControl",
        placeholder: app.translator.trans("flarum-flags.forum.flag_post.reason_details_placeholder"),
        value: this.reasonDetail(),
        oninput: U()("value", this.reasonDetail)
      }) : ""), m("label", {
        className: "checkbox"
      }, m("input", {
        type: "radio",
        name: "reason",
        checked: this.reason() === "other",
        value: "other",
        onclick: U()("value", this.reason)
      }), m("strong", null, app.translator.trans("flarum-flags.forum.flag_post.reason_other_label")), this.reason() === "other" ? m("textarea", {
        className: "FormControl",
        value: this.reasonDetail(),
        oninput: U()("value", this.reasonDetail)
      }) : ""))), m("div", {
        className: "Form-group"
      }, m(T.a, {
        className: "Button Button--primary Button--block",
        type: "submit",
        loading: this.loading,
        disabled: !this.reason()
      }, app.translator.trans("flarum-flags.forum.flag_post.submit_button")))));
    };
    o.onsubmit = function (t) {
      var a = this;
      t.preventDefault();
      this.loading = true;
      app.store.createRecord("flags").save({
        reason: this.reason() === "other" ? null : this.reason(),
        reasonDetail: this.reasonDetail(),
        relationships: {
          user: app.session.user,
          post: this.attrs.post
        }
      }, {
        errorHandler: this.onerror.bind(this)
      }).then(function () {
        return a.success = true;
      }).catch(function () {}).then(this.loaded.bind(this));
    };
    return a;
  }(E.a);
  function q() {
    Object(j.extend)(L.a, "userControls", function (t, a) {
      if (!a.isHidden() && a.contentType() === "comment" && a.canFlag()) {
        t.add("flag", m(T.a, {
          icon: "fas fa-flag",
          onclick: function () {
            return n.a.modal.show(G, {
              post: a
            });
          }
        }, n.a.translator.trans("flarum-flags.forum.post_controls.flag_button")));
      }
    });
  }
  var z = o(17);
  var V = o.n(z);
  var J = o(18);
  var K = function (t) {
    function a() {
      return t.apply(this, arguments) || this;
    }
    i(a, t);
    a.initAttrs = function (a) {
      a.label = a.label || app.translator.trans("flarum-flags.forum.flagged_posts.tooltip");
      a.icon = a.icon || "fas fa-flag";
      t.initAttrs.call(this, a);
    };
    var o = a.prototype;
    o.getMenu = function () {
      return m("div", {
        className: "Dropdown-menu " + this.attrs.menuClassName,
        onclick: this.menuClick.bind(this)
      }, this.showing ? P.component({
        state: this.attrs.state
      }) : "");
    };
    o.goToRoute = function () {
      m.route.set(app.route("flags"));
    };
    o.getUnreadCount = function () {
      if (app.flags.cache) {
        return app.flags.cache.length;
      } else {
        return app.forum.attribute("flagCount");
      }
    };
    o.getNewCount = function () {
      return app.session.user.attribute("newFlagCount");
    };
    return a;
  }(o.n(J).a);
  function Q() {
    Object(j.extend)(V.a.prototype, "items", function (t) {
      if (n.a.forum.attribute("canViewFlags")) {
        t.add("flags", m(K, {
          state: n.a.flags
        }), 15);
      }
    });
  }
  var W = o(5);
  var X = o.n(W);
  var Y = o(19);
  var Z = o.n(Y);
  var $ = o(20);
  var tt = o.n($);
  function at() {
    Object(j.extend)(X.a.prototype, "elementAttrs", function (t) {
      if (this.attrs.post.flags().length) {
        t.className += " Post--flagged";
      }
    });
    X.a.prototype.dismissFlag = function (t) {
      var a = this.attrs.post;
      delete a.data.relationships.flags;
      this.subtree.invalidate();
      if (n.a.flags.cache) {
        n.a.flags.cache.some(function (t, o) {
          if (t.post() === a) {
            n.a.flags.cache.splice(o, 1);
            if (n.a.flags.index === a) {
              var e = n.a.flags.cache[o];
              e ||= n.a.flags.cache[0];
              if (e) {
                var s = e.post();
                n.a.flags.index = s;
                m.route.set(n.a.route.post(s));
              }
            }
            return true;
          }
        });
      }
      return n.a.request({
        url: n.a.forum.attribute("apiUrl") + a.apiEndpoint() + "/flags",
        method: "DELETE",
        body: t
      });
    };
    X.a.prototype.flagActionItems = function () {
      var t = this;
      var a = new Z.a();
      var o = L.a.destructiveControls(this.attrs.post);
      Object.keys(o.items).forEach(function (a) {
        var e = o.get(a).attrs;
        e.className = "Button";
        Object(j.extend)(e, "onclick", function () {
          return t.dismissFlag();
        });
      });
      a.add("controls", m("div", {
        className: "ButtonGroup"
      }, o.toArray()));
      a.add("dismiss", m(T.a, {
        className: "Button",
        icon: "far fa-eye-slash",
        onclick: this.dismissFlag.bind(this)
      }, n.a.translator.trans("flarum-flags.forum.post.dismiss_flag_button")), -100);
      return a;
    };
    Object(j.extend)(X.a.prototype, "content", function (t) {
      var a = this;
      var o = this.attrs.post;
      var e = o.flags();
      if (e.length) {
        if (o.isHidden()) {
          this.revealContent = true;
        }
        t.unshift(m("div", {
          className: "Post-flagged"
        }, m("div", {
          className: "Post-flagged-flags"
        }, e.map(function (t) {
          return m("div", {
            className: "Post-flagged-flag"
          }, a.flagReason(t));
        })), m("div", {
          className: "Post-flagged-actions"
        }, this.flagActionItems().toArray())));
      }
    });
    X.a.prototype.flagReason = function (t) {
      if (t.type() === "user") {
        var a = t.user();
        var o = t.reason();
        var e = t.reasonDetail();
        var s = tt()(t.createdAt());
        return [n.a.translator.trans(o ? "flarum-flags.forum.post.flagged_by_with_reason_text" : "flarum-flags.forum.post.flagged_by_text", {
          time: s,
          user: a,
          reason: o
        }), e ? m("span", {
          className: "Post-flagged-detail"
        }, e) : ""];
      }
    };
  }
  var ot = {
    "flags/addFlagsToPosts": at,
    "flags/addFlagControl": q,
    "flags/addFlagsDropdown": Q,
    "flags/models/Flag": u,
    "flags/components/FlagList": P,
    "flags/components/FlagPostModal": G,
    "flags/components/FlagsPage": O,
    "flags/components/FlagsDropdown": K
  };
  var et = o(21);
  n.a.initializers.add("flarum-flags", function () {
    n.a.store.models.posts.prototype.flags = l.a.hasMany("flags");
    n.a.store.models.posts.prototype.canFlag = l.a.attribute("canFlag");
    n.a.store.models.flags = u;
    n.a.routes.flags = {
      path: "/flags",
      component: O
    };
    n.a.flags = new A(n.a);
    q();
    Q();
    at();
  });
  e(et.compat, ot);
}]);
flarum.extensions["flarum-flags"] = module.exports;
var module = {};
module.exports = function (e) {
  var t = {};
  function n(s) {
    if (t[s]) {
      return t[s].exports;
    }
    var o = t[s] = {
      i: s,
      l: false,
      exports: {}
    };
    e[s].call(o.exports, o, o.exports, n);
    o.l = true;
    return o.exports;
  }
  n.m = e;
  n.c = t;
  n.d = function (e, t, s) {
    if (!n.o(e, t)) {
      Object.defineProperty(e, t, {
        enumerable: true,
        get: s
      });
    }
  };
  n.r = function (e) {
    if (typeof Symbol != "undefined" && Symbol.toStringTag) {
      Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(e, "__esModule", {
      value: true
    });
  };
  n.t = function (e, t) {
    if (t & 1) {
      e = n(e);
    }
    if (t & 8) {
      return e;
    }
    if (t & 4 && typeof e == "object" && e && e.__esModule) {
      return e;
    }
    var s = Object.create(null);
    n.r(s);
    Object.defineProperty(s, "default", {
      enumerable: true,
      value: e
    });
    if (t & 2 && typeof e != "string") {
      for (var o in e) {
        n.d(s, o, function (t) {
          return e[t];
        }.bind(null, o));
      }
    }
    return s;
  };
  n.n = function (e) {
    var t = e && e.__esModule ? function () {
      return e.default;
    } : function () {
      return e;
    };
    n.d(t, "a", t);
    return t;
  };
  n.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  };
  n.p = "";
  return n(n.s = 6);
}([function (e, t) {
  e.exports = flarum.core.compat.app;
}, function (e, t) {
  e.exports = flarum.core.compat.extend;
}, function (e, t) {
  e.exports = flarum.core.compat["components/DiscussionList"];
}, function (e, t) {
  e.exports = flarum.core.compat["components/IndexPage"];
}, function (e, t) {
  e.exports = flarum.core.compat["components/DiscussionPage"];
}, function (e, t) {
  e.exports = flarum.core.compat["components/Button"];
}, function (e, t, n) {
  "use strict";

  n.r(t);
  var s = n(1);
  var o = n(0);
  var r = n.n(o);
  var u = n(2);
  var i = n.n(u);
  var a = n(4);
  var c = n.n(a);
  var d = n(3);
  var p = n.n(d);
  var f = n(5);
  var l = n.n(f);
  r.a.initializers.add("flarum-pusher", function () {
    var e = new Promise(function (e) {
      $.getScript("//cdn.jsdelivr.net/npm/pusher-js@7.0.3/dist/web/pusher.min.js", function () {
        var t = new Pusher(r.a.forum.attribute("pusherKey"), {
          authEndpoint: r.a.forum.attribute("apiUrl") + "/pusher/auth",
          cluster: r.a.forum.attribute("pusherCluster"),
          auth: {
            headers: {
              "X-CSRF-Token": r.a.session.csrfToken
            }
          }
        });
        return e({
          channels: {
            main: t.subscribe("public"),
            user: r.a.session.user ? t.subscribe("private-user" + r.a.session.user.id()) : null
          },
          pusher: t
        });
      });
    });
    r.a.pusher = e;
    r.a.pushedUpdates = [];
    Object(s.extend)(i.a.prototype, "oncreate", function () {
      r.a.pusher.then(function (e) {
        e.pusher.bind("newPost", function (e) {
          var t = r.a.discussions.getParams();
          if (!t.q && !t.sort && !t.filter) {
            if (t.tags) {
              var n = r.a.store.getBy("tags", "slug", t.tags);
              if (e.tagIds.indexOf(n.id()) === -1) {
                return;
              }
            }
            var s = String(e.discussionId);
            if ((!r.a.current.get("discussion") || s !== r.a.current.get("discussion").id()) && r.a.pushedUpdates.indexOf(s) === -1) {
              r.a.pushedUpdates.push(s);
              if (r.a.current.matches(p.a)) {
                r.a.setTitleCount(r.a.pushedUpdates.length);
              }
              m.redraw();
            }
          }
        });
      });
    });
    Object(s.extend)(i.a.prototype, "onremove", function () {
      r.a.pusher.then(function (e) {
        e.pusher.unbind("newPost");
      });
    });
    Object(s.extend)(i.a.prototype, "view", function (e) {
      var t = this;
      if (r.a.pushedUpdates) {
        var n = r.a.pushedUpdates.length;
        if (n) {
          e.children.unshift(l.a.component({
            className: "Button Button--block DiscussionList-update",
            onclick: function () {
              t.attrs.state.refresh(false).then(function () {
                t.loadingUpdated = false;
                r.a.pushedUpdates = [];
                r.a.setTitleCount(0);
                m.redraw();
              });
              t.loadingUpdated = true;
            },
            loading: this.loadingUpdated
          }, r.a.translator.trans("flarum-pusher.forum.discussion_list.show_updates_text", {
            count: n
          })));
        }
      }
    });
    Object(s.extend)(i.a.prototype, "addDiscussion", function (e, t) {
      var n = r.a.pushedUpdates.indexOf(t.id());
      if (n !== -1) {
        r.a.pushedUpdates.splice(n, 1);
      }
      if (r.a.current.matches(p.a)) {
        r.a.setTitleCount(r.a.pushedUpdates.length);
      }
      m.redraw();
    });
    Object(s.extend)(c.a.prototype, "oncreate", function () {
      var e = this;
      r.a.pusher.then(function (t) {
        t.pusher.bind("newPost", function (t) {
          var n = String(t.discussionId);
          if (e.discussion && e.discussion.id() === n && e.stream) {
            var s = e.discussion.commentCount();
            r.a.store.find("discussions", e.discussion.id()).then(function () {
              e.stream.update();
              if (!document.hasFocus()) {
                r.a.setTitleCount(Math.max(0, e.discussion.commentCount() - s));
                $(window).one("focus", function () {
                  return r.a.setTitleCount(0);
                });
              }
            });
          }
        });
      });
    });
    Object(s.extend)(c.a.prototype, "onremove", function () {
      r.a.pusher.then(function (e) {
        e.pusher.unbind("newPost");
      });
    });
    Object(s.extend)(p.a.prototype, "actionItems", function (e) {
      e.remove("refresh");
    });
    r.a.pusher.then(function (e) {
      var t = e.channels;
      if (t.user) {
        t.user.bind("notification", function () {
          r.a.session.user.pushAttributes({
            unreadNotificationCount: r.a.session.user.unreadNotificationCount() + 1,
            newNotificationCount: r.a.session.user.newNotificationCount() + 1
          });
          r.a.notifications.clear();
          m.redraw();
        });
      }
    });
  });
}]);
flarum.extensions["flarum-pusher"] = module.exports;
var module = {};
module.exports = function (t) {
  var e = {};
  function i(o) {
    if (e[o]) {
      return e[o].exports;
    }
    var a = e[o] = {
      i: o,
      l: false,
      exports: {}
    };
    t[o].call(a.exports, a, a.exports, i);
    a.l = true;
    return a.exports;
  }
  i.m = t;
  i.c = e;
  i.d = function (t, e, o) {
    if (!i.o(t, e)) {
      Object.defineProperty(t, e, {
        enumerable: true,
        get: o
      });
    }
  };
  i.r = function (t) {
    if (typeof Symbol != "undefined" && Symbol.toStringTag) {
      Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(t, "__esModule", {
      value: true
    });
  };
  i.t = function (t, e) {
    if (e & 1) {
      t = i(t);
    }
    if (e & 8) {
      return t;
    }
    if (e & 4 && typeof t == "object" && t && t.__esModule) {
      return t;
    }
    var o = Object.create(null);
    i.r(o);
    Object.defineProperty(o, "default", {
      enumerable: true,
      value: t
    });
    if (e & 2 && typeof t != "string") {
      for (var a in t) {
        i.d(o, a, function (e) {
          return t[e];
        }.bind(null, a));
      }
    }
    return o;
  };
  i.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    i.d(e, "a", e);
    return e;
  };
  i.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  };
  i.p = "";
  return i(i.s = 26);
}([function (t, e) {
  t.exports = flarum.core.compat["common/app"];
},, function (t, e) {
  t.exports = flarum.core.compat["common/Model"];
}, function (t, e, i) {
  "use strict";

  function o(t, e) {
    t.prototype = Object.create(e.prototype);
    t.prototype.constructor = t;
    t.__proto__ = e;
  }
  i.d(e, "a", function () {
    return o;
  });
}, function (t, e) {
  t.exports = flarum.core.compat["common/components/Button"];
}, function (t, e) {
  t.exports = flarum.core.compat["common/extend"];
},,, function (t, e) {
  t.exports = flarum.core.compat["common/Component"];
}, function (t, e) {
  t.exports = flarum.core.compat["common/components/Alert"];
},, function (t, e) {
  t.exports = flarum.core.compat["common/components/LoadingIndicator"];
}, function (t, e) {
  t.exports = flarum.core.compat["common/components/TextEditor"];
}, function (t, e) {
  t.exports = flarum.core.compat["forum/components/UserPage"];
}, function (t, e) {
  t.exports = flarum.core.compat["common/utils/classList"];
}, function (t, e) {
  t.exports = flarum.core.compat["common/components/Tooltip"];
}, function (t, e) {
  t.exports = flarum.core.compat["common/utils/extractText"];
}, function (t, e) {
  t.exports = flarum.core.compat["common/models/User"];
}, function (t, e) {
  t.exports = flarum.core.compat["common/components/LinkButton"];
}, function (t, e) {
  t.exports = flarum.core.compat["common/utils/mixin"];
}, function (t, e) {
  t.exports = flarum.core.compat["forum/components/Post"];
}, function (t, e) {
  t.exports = flarum.core.compat["common/components/Modal"];
},,,,, function (t, e, i) {
  "use strict";

  i.r(e);
  i.d(e, "components", function () {
    return X;
  });
  var o = i(5);
  var a = i(0);
  var n = i.n(a);
  var s = i(13);
  var r = i.n(s);
  var l = i(18);
  var u = i.n(l);
  var d = i(3);
  var p = i(2);
  var c = i.n(p);
  var f = i(19);
  var h = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(d.a)(e, t);
    e.prototype.apiEndpoint = function () {
      return "/fof/uploads" + (this.exists ? "/" + this.data.id : "");
    };
    return e;
  }(i.n(f)()(c.a, {
    baseName: c.a.attribute("baseName"),
    path: c.a.attribute("path"),
    url: c.a.attribute("url"),
    type: c.a.attribute("type"),
    size: c.a.attribute("size"),
    humanSize: c.a.attribute("humanSize"),
    createdAt: c.a.attribute("createdAt"),
    uuid: c.a.attribute("uuid"),
    tag: c.a.attribute("tag"),
    hidden: c.a.attribute("hidden"),
    bbcode: c.a.attribute("bbcode")
  }));
  var g = function () {
    function t() {
      this.user = null;
      this.files = [];
      this.moreResults = false;
      this.loading = false;
    }
    var e = t.prototype;
    e.setUser = function (t) {
      if (t !== this.user) {
        this.user = t;
        this.files = [];
        this.loadResults();
      }
    };
    e.loadResults = function (t = 0) {
      if (this.user) {
        this.loading = true;
        return n.a.store.find("fof/uploads", {
          filter: {
            user: this.user.id()
          },
          page: {
            offset: t
          }
        }).then(this.parseResults.bind(this));
      }
    };
    e.loadMore = function () {
      this.loading = true;
      this.loadResults(this.files.length).then(this.parseResults.bind(this));
    };
    e.parseResults = function (t) {
      var e;
      (e = this.files).push.apply(e, t);
      this.loading = false;
      this.moreResults = !!t.payload.links && !!t.payload.links.next;
      m.redraw();
      return t;
    };
    e.addToList = function (t) {
      var e;
      if (Array.isArray(t)) {
        (e = this.files).unshift.apply(e, t);
      } else {
        this.files.unshift(t);
      }
    };
    e.hasFiles = function () {
      return this.files.length > 0;
    };
    e.isLoading = function () {
      return this.loading;
    };
    e.hasMoreResults = function () {
      return this.moreResults;
    };
    e.empty = function () {
      return !this.hasFiles() && !this.isLoading();
    };
    return t;
  }();
  var b = i(20);
  var v = i.n(b);
  var y = i(12);
  var x = i.n(y);
  var F = i(8);
  var w = i.n(F);
  var _ = i(4);
  var N = i.n(_);
  var B = i(11);
  var O = i.n(B);
  var M = i(14);
  var L = i.n(M);
  var S = i(15);
  var k = i.n(S);
  var T = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(d.a)(e, t);
    var i = e.prototype;
    i.oninit = function (e) {
      var i = this;
      t.prototype.oninit.call(this, e);
      this.attrs.uploader.on("uploaded", function () {
        i.$("form")[0].reset();
        m.redraw();
      });
      this.isMediaUploadButton = e.attrs.isMediaUploadButton || false;
    };
    i.view = function () {
      var t = this.attrs.uploader.uploading ? n.a.translator.trans("fof-upload.forum.states.loading") : n.a.translator.trans("fof-upload.forum.buttons.upload");
      return m(k.a, {
        text: t
      }, m(N.a, {
        className: L()(["Button", "hasIcon", "fof-upload-button", !this.isMediaUploadButton && !this.attrs.uploader.uploading && "Button--icon", !this.isMediaUploadButton && !this.attrs.uploader.uploading && "Button--link", this.attrs.uploader.uploading && "uploading"]),
        icon: !this.attrs.uploader.uploading && "fas fa-file-upload",
        onclick: this.uploadButtonClicked.bind(this),
        disabled: this.attrs.disabled
      }, this.attrs.uploader.uploading && m(O.a, {
        size: "tiny",
        className: "LoadingIndicator--inline Button-icon"
      }), (this.isMediaUploadButton || this.attrs.uploader.uploading) && m("span", {
        className: "Button-label"
      }, t), m("form", null, m("input", {
        type: "file",
        multiple: true,
        onchange: this.process.bind(this)
      }))));
    };
    i.process = function (t) {
      var e = this.$("input").prop("files");
      if (e.length !== 0) {
        this.attrs.uploader.upload(e, !this.isMediaUploadButton);
      }
    };
    i.uploadButtonClicked = function (t) {
      this.$("input").click();
    };
    return e;
  }(w.a);
  var j = function () {
    function t(t, e) {
      this.upload = t;
      this.composerElement = e;
      this.handlers = {};
      if (this.supportsFileDragging()) {
        this.composerElement.addEventListener("dragover", this.handlers.in = this.in.bind(this));
        this.composerElement.addEventListener("dragleave", this.handlers.out = this.out.bind(this));
        this.composerElement.addEventListener("dragend", this.handlers.out);
        this.composerElement.addEventListener("drop", this.handlers.dropping = this.dropping.bind(this));
      }
    }
    var e = t.prototype;
    e.supportsFileDragging = function () {
      var t = document.createElement("div");
      return ("draggable" in t || "ondragstart" in t && "ondrop" in t) && "FormData" in window && "FileReader" in window;
    };
    e.unload = function () {
      if (this.handlers.in) {
        this.composerElement.removeEventListener("dragover", this.handlers.in);
        this.composerElement.removeEventListener("dragleave", this.handlers.out);
        this.composerElement.removeEventListener("dragend", this.handlers.out);
        this.composerElement.removeEventListener("drop", this.handlers.dropping);
      }
    };
    e.isNotFile = function (t) {
      if (t.dataTransfer.items) {
        for (var e = 0; e < t.dataTransfer.items.length; e++) {
          if (t.dataTransfer.items[e].kind !== "file") {
            return true;
          }
        }
      }
      return false;
    };
    e.in = function (t) {
      if (!this.isNotFile(t)) {
        t.preventDefault();
        if (!this.over) {
          this.composerElement.classList.add("fof-upload-dragging");
          this.over = true;
        }
      }
    };
    e.out = function (t) {
      if (!this.isNotFile(t)) {
        t.preventDefault();
        if (this.over) {
          this.composerElement.classList.remove("fof-upload-dragging");
          this.over = false;
        }
      }
    };
    e.dropping = function (t) {
      if (!this.isNotFile(t)) {
        t.preventDefault();
        this.upload(t.dataTransfer.files);
        this.composerElement.classList.remove("fof-upload-dragging");
      }
    };
    return t;
  }();
  var E = function () {
    function t(t, e) {
      this.upload = t;
      e.addEventListener("paste", this.paste.bind(this));
    }
    t.prototype.paste = function (t) {
      if (t.clipboardData && t.clipboardData.items) {
        for (var e = t.clipboardData.items, i = [], o = 0; o < e.length; o++) {
          if (e[o].type.indexOf("image") !== -1) {
            i.push(e[o].getAsFile());
          }
        }
        if (i.length > 0) {
          t.preventDefault();
          this.upload(i);
        }
      }
    };
    return t;
  }();
  var U = function () {
    function t() {
      this.callbacks = {
        success: [],
        failure: [],
        uploading: [],
        uploaded: []
      };
      this.uploading = false;
    }
    var e = t.prototype;
    e.on = function (t, e) {
      this.callbacks[t].push(e);
    };
    e.dispatch = function (t, e) {
      this.callbacks[t].forEach(function (t) {
        return t(e);
      });
    };
    e.upload = function (t, e) {
      var i = this;
      if (e === undefined) {
        e = true;
      }
      this.uploading = true;
      this.dispatch("uploading", t);
      m.redraw();
      var o = new FormData();
      for (var a = 0; a < t.length; a++) {
        o.append("files[]", t[a]);
      }
      return n.a.request({
        method: "POST",
        url: n.a.forum.attribute("apiUrl") + "/fof/upload",
        serialize: function (t) {
          return t;
        },
        body: o
      }).then(function (t) {
        return i.uploaded(t, e);
      }).catch(function (t) {
        i.uploading = false;
        m.redraw();
        throw t;
      });
    };
    e.uploaded = function (t, e) {
      var i = this;
      if (e === undefined) {
        e = false;
      }
      this.uploading = false;
      t.data.forEach(function (t) {
        var o = n.a.store.pushObject(t);
        n.a.fileListState.addToList(o);
        i.dispatch("success", {
          file: o,
          addBBcode: e
        });
      });
      this.dispatch("uploaded");
    };
    return t;
  }();
  var D = i(21);
  var A = i.n(D);
  var C = i(9);
  var R = i.n(C);
  var z = i(16);
  var P = i.n(z);
  var H = ["image/png", "image/jpg", "image/jpeg", "image/svg+xml", "image/gif"];
  var I = ["application/zip", "application/x-7z-compressed", "application/gzip", "application/vnd.rar", "application/x-rar-compressed"];
  var $ = ["text/html", "text/css", "text/javascript", "application/json", "application/ld+json", "text/javascript", "application/x-httpd-php"];
  var q = ["application/x-abiword", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/pdf"];
  var V = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(d.a)(e, t);
    var i = e.prototype;
    i.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      app.fileListState.setUser(e.attrs.user || app.session.user);
      this.inModal = e.attrs.selectable;
      this.restrictFileType = e.attrs.restrictFileType || null;
      this.downloadOnClick = this.attrs.downloadOnClick || false;
      this.filesBeingHidden = [];
      this.user = app.fileListState.user;
    };
    i.view = function () {
      var t = this;
      var e = app.fileListState;
      return m("div", {
        className: "fof-upload-file-list",
        "aria-live": "polite"
      }, e.isLoading() && e.files.length === 0 && m("div", {
        className: "fof-upload-loading"
      }, app.translator.trans("fof-upload.forum.file_list.loading"), m(O.a, null)), this.inModal && e.empty() && m("p", {
        className: "fof-upload-empty"
      }, m("i", {
        className: "fas fa-cloud-upload-alt fof-upload-empty-icon"
      }), app.translator.trans("fof-upload.forum.file_list.modal_empty_" + (app.screen() !== "phone" ? "desktop" : "phone"))), !this.inModal && e.empty() && m("p", {
        className: "fof-upload-empty"
      }, app.translator.trans("fof-upload.forum.file_list.empty")), m("ul", null, e.files.map(function (e) {
        var i;
        i = e.type();
        var o = H.includes(i) ? "image" : i.includes("image/") ? "far fa-file-image" : i.includes("video/") ? "far fa-file-video" : I.indexOf(i) >= 0 ? "far fa-file-archive" : i === "application/pdf" ? "far fa-file-pdf" : q.indexOf(i) >= 0 ? "far fa-file-word" : i.includes("audio/") ? "far fa-file-audio" : $.indexOf(i) >= 0 ? "far fa-file-code" : "far fa-file";
        var a = !t.restrictFileType || t.isSelectable(e);
        var n = L()(["fof-file", o === "image" && "fof-file-type-image", t.attrs.selectedFiles && t.attrs.selectedFiles.indexOf(e.id()) >= 0 && "fof-file-selected"]);
        var s = e.baseName();
        var r = t.filesBeingHidden.includes(e.uuid());
        return m("li", {
          "aria-busy": r
        }, app.session.user && (t.user === app.session.user || app.session.user.deleteOthersMediaLibrary()) && m(N.a, {
          className: "Button Button--icon fof-file-delete",
          icon: "far fa-trash-alt",
          "aria-label": app.translator.trans("fof-upload.forum.file_list.delete_file_a11y_label", {
            fileName: s
          }),
          disabled: r,
          onclick: t.hideFile.bind(t, e)
        }), m("button", {
          className: n,
          onclick: function () {
            return t.onFileClick(e);
          },
          disabled: !a || r,
          "aria-label": P()(app.translator.trans("fof-upload.forum.file_list.select_file_a11y_label", {
            fileName: s
          }))
        }, m("figure", null, o === "image" ? m("img", {
          src: e.url(),
          className: "fof-file-image-preview",
          draggable: false,
          alt: ""
        }) : m("span", {
          className: "fof-file-icon",
          role: "presentation"
        }, m("i", {
          className: "fa-fw " + o
        })), m("figcaption", {
          className: "fof-file-name"
        }, s), r && m("span", {
          class: "fof-file-loading",
          role: "status",
          "aria-label": app.translator.trans("fof-upload.forum.file_list.hide_file.loading")
        }, m(O.a, null)))));
      })), e.hasMoreResults() && m("div", {
        className: "fof-load-more-files"
      }, m(N.a, {
        className: "Button Button--primary",
        disabled: e.isLoading(),
        loading: e.isLoading(),
        onclick: function () {
          return e.loadMore();
        }
      }, app.translator.trans("fof-upload.forum.file_list.load_more_files_btn"))));
    };
    i.onFileClick = function (t) {
      if (this.attrs.onFileSelect) {
        this.attrs.onFileSelect(t);
      } else if (this.attrs.downloadOnClick) {
        window.open(t.url());
      }
    };
    i.isSelectable = function (t) {
      var e = t.type();
      if (Array.isArray(this.restrictFileType)) {
        return this.restrictFileType.indexOf(e) >= 0;
      } else if (this.restrictFileType === "image") {
        return e.includes("image/");
      } else if (this.restrictFileType === "audio") {
        return e.includes("audio/");
      } else {
        return this.restrictFileType === "video" && e.includes("video/");
      }
    };
    i.hideFile = function (t) {
      var e = this;
      var i = t.uuid();
      if (!this.filesBeingHidden.includes(i)) {
        this.filesBeingHidden.push(i);
        if (confirm(P()(app.translator.trans("fof-upload.forum.file_list.hide_file.hide_confirmation", {
          fileName: t.baseName()
        })))) {
          app.request({
            method: "PATCH",
            url: app.forum.attribute("apiUrl") + "/fof/upload/hide",
            body: {
              uuid: i
            }
          }).then(function () {
            app.alerts.show(R.a, {
              type: "success"
            }, app.translator.trans("fof-upload.forum.file_list.hide_file.hide_success"));
          }).catch(function () {
            app.alerts.show(R.a, {
              type: "error"
            }, app.translator.trans("fof-upload.forum.file_list.hide_file.hide_fail", {
              fileName: t.fileName()
            }));
          }).then(function () {
            var t = app.fileListState;
            var o = t.files.findIndex(function (t) {
              return i === t.uuid();
            });
            t.files.splice(o, 1);
            var a = e.filesBeingHidden.indexOf(i);
            e.filesBeingHidden.splice(a, 1);
          });
        } else {
          var o = this.filesBeingHidden.indexOf(i);
          this.filesBeingHidden.splice(o, 1);
        }
      }
    };
    return e;
  }(w.a);
  var G = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(d.a)(e, t);
    var i = e.prototype;
    i.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.uploader = e.attrs.uploader;
      this.selectedFiles = [];
      this.multiSelect = e.attrs.multiSelect || true;
      this.restrictFileType = e.attrs.restrictFileType || null;
      this.dragDrop = null;
      this.onUpload();
    };
    i.className = function () {
      return "Modal--large fof-file-manager-modal";
    };
    i.oncreate = function (e) {
      var i = this;
      t.prototype.oncreate.call(this, e);
      this.dragDrop = new j(function (t) {
        return i.uploader.upload(t, false);
      }, this.$().find(".Modal-content")[0]);
    };
    i.onremove = function () {
      if (this.dragDrop) {
        this.dragDrop.unload();
      }
    };
    i.view = function () {
      var t = this.selectedFiles.length;
      return m("div", {
        className: "Modal modal-dialog " + this.className()
      }, m("div", {
        className: "Modal-content"
      }, m("div", {
        className: "fof-modal-buttons App-backControl"
      }, m(T, {
        uploader: this.uploader,
        disabled: app.fileListState.isLoading(),
        isMediaUploadButton: true
      })), m("div", {
        className: "fof-drag-and-drop"
      }, m("div", {
        className: "fof-drag-and-drop-release"
      }, m("i", {
        className: "fas fa-cloud-upload-alt"
      }), app.translator.trans("fof-upload.forum.file_list.release_to_upload"))), m("div", {
        className: "Modal-header"
      }, m("h3", {
        className: "App-titleControl App-titleControl--text"
      }, app.translator.trans("fof-upload.forum.media_manager"))), this.alertAttrs && m("div", {
        className: "Modal-alert"
      }, m(Alert, this.alertAttrs)), m("div", {
        className: "Modal-body"
      }, m(V, {
        user: this.attrs.user,
        selectable: true,
        onFileSelect: this.onFileSelect.bind(this),
        selectedFiles: this.selectedFiles,
        restrictFileType: this.restrictFileType
      })), m("div", {
        className: "Modal-footer"
      }, m(N.a, {
        onclick: this.hide.bind(this),
        className: "Button"
      }, app.translator.trans("fof-upload.forum.buttons.cancel")), m(N.a, {
        onclick: this.onSelect.bind(this),
        disabled: this.selectedFiles.length === 0 || !this.multiSelect && this.selectedFiles.length > 1,
        className: "Button Button--primary"
      }, app.translator.trans("fof-upload.forum.file_list.confirm_selection_btn", {
        fileCount: t
      })))));
    };
    i.onFileSelect = function (t) {
      var e = this.selectedFiles.indexOf(t.id());
      if (e >= 0) {
        this.selectedFiles.splice(e, 1);
      } else if (this.multiSelect) {
        this.selectedFiles.push(t.id());
      } else {
        this.selectedFiles = [t.id()];
      }
    };
    i.onUpload = function () {
      var t = this;
      this.uploader.on("success", function (e) {
        var i = e.file;
        if (t.multiSelect) {
          t.selectedFiles.push(i.id());
        } else {
          t.selectedFiles = [i.id()];
        }
      });
    };
    i.onSelect = function () {
      this.hide();
      if (this.attrs.onSelect) {
        this.attrs.onSelect(this.selectedFiles);
      } else {
        this.selectedFiles.map(function (t) {
          var e = app.store.getById("files", t);
          app.composer.editor.insertAtCursor(e.bbcode() + "\n");
        });
      }
    };
    return e;
  }(A.a);
  var J = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(d.a)(e, t);
    var i = e.prototype;
    i.view = function () {
      return m(k.a, {
        text: n.a.translator.trans("fof-upload.forum.buttons.media")
      }, N.a.component({
        className: "Button fof-upload-button Button--icon",
        onclick: this.fileManagerButtonClicked.bind(this),
        icon: "fas fa-photo-video"
      }));
    };
    i.fileManagerButtonClicked = function (t) {
      t.preventDefault();
      n.a.modal.show(G, {
        uploader: this.attrs.uploader
      });
    };
    return e;
  }(w.a);
  var K = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(d.a)(e, t);
    var i = e.prototype;
    i.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      this.user = null;
      this.loadUser(m.route.param("username"));
    };
    i.content = function () {
      if (app.session.user && (app.session.user.viewOthersMediaLibrary() || this.user === app.session.user)) {
        return this.user && V.component({
          user: this.user,
          selectable: false,
          downloadOnClick: true
        });
      } else {
        return null;
      }
    };
    i.show = function (e) {
      t.prototype.show.call(this, e);
      this.user = e;
    };
    return e;
  }(r.a);
  var Q = i(17);
  var W = i.n(Q);
  var X = {
    DragAndDrop: j,
    FileManagerButton: J,
    FileManagerModal: G,
    UserFileList: V,
    Uploader: U
  };
  n.a.initializers.add("fof-upload", function () {
    W.a.prototype.viewOthersMediaLibrary = c.a.attribute("fof-upload-viewOthersMediaLibrary");
    W.a.prototype.deleteOthersMediaLibrary = c.a.attribute("fof-upload-deleteOthersMediaLibrary");
    Object(o.extend)(x.a.prototype, "oninit", function () {
      this.uploader = new U();
    });
    Object(o.extend)(x.a.prototype, "controlItems", function (t) {
      if (n.a.forum.attribute("fof-upload.canUpload")) {
        var e = n.a.forum.attribute("fof-upload.composerButtonVisiblity");
        if (e === "both" || e === "media-btn") {
          t.add("fof-upload-media", J.component({
            uploader: this.uploader
          }));
        }
        if (e === "both" || e === "upload-btn") {
          t.add("fof-upload", T.component({
            uploader: this.uploader
          }));
        }
      }
    });
    Object(o.extend)(x.a.prototype, "oncreate", function (t, e) {
      var i = this;
      if (n.a.forum.attribute("fof-upload.canUpload")) {
        this.uploader.on("success", function (t) {
          var e = t.file;
          if (t.addBBcode && (i.attrs.composer.editor.insertAtCursor(e.bbcode() + "\n"), typeof i.attrs.preview == "function")) {
            var o = n.a.composer.isFullScreen;
            n.a.composer.isFullScreen = function () {
              return false;
            };
            i.attrs.preview();
            n.a.composer.isFullScreen = o;
          }
        });
        this.dragAndDrop = new j(function (t) {
          return i.uploader.upload(t);
        }, this.$().parents(".Composer")[0]);
        new E(function (t) {
          return i.uploader.upload(t);
        }, this.$(".TextEditor-editor")[0]);
      }
    });
    Object(o.extend)(x.a.prototype, "onremove", function (t, e) {
      if (n.a.forum.attribute("fof-upload.canUpload")) {
        this.dragAndDrop.unload();
      }
    });
    Object(o.extend)(v.a.prototype, "oncreate", function () {
      var t = this;
      this.$("[data-fof-upload-download-uuid]").unbind("click").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (n.a.forum.attribute("fof-upload.canDownload")) {
          var i = n.a.forum.attribute("apiUrl") + "/fof/download";
          i += "/" + e.currentTarget.dataset.fofUploadDownloadUuid;
          i += "/" + t.attrs.post.id();
          i += "/" + n.a.session.csrfToken;
          window.open(i);
        } else {
          alert(n.a.translator.trans("fof-upload.forum.states.unauthorized"));
        }
      });
    });
    n.a.store.models.files = h;
    n.a.fileListState = new g();
    n.a.routes["user.uploads"] = {
      path: "/u/:username/uploads",
      component: K
    };
    Object(o.extend)(r.a.prototype, "navItems", function (t) {
      if (n.a.session.user && (n.a.session.user.viewOthersMediaLibrary() || this.user === n.a.session.user)) {
        t.add("uploads", u.a.component({
          href: n.a.route("user.uploads", {
            username: this.user.username()
          }),
          name: "uploads",
          icon: "fas fa-file-upload"
        }, this.user === n.a.session.user ? n.a.translator.trans("fof-upload.forum.buttons.media") : n.a.translator.trans("fof-upload.forum.buttons.user_uploads")), 80);
      }
    });
  });
}]);
flarum.extensions["fof-upload"] = module.exports;
var module = {};
module.exports = function (t) {
  var e = {};
  function n(r) {
    if (e[r]) {
      return e[r].exports;
    }
    var a = e[r] = {
      i: r,
      l: false,
      exports: {}
    };
    t[r].call(a.exports, a, a.exports, n);
    a.l = true;
    return a.exports;
  }
  n.m = t;
  n.c = e;
  n.d = function (t, e, r) {
    if (!n.o(t, e)) {
      Object.defineProperty(t, e, {
        enumerable: true,
        get: r
      });
    }
  };
  n.r = function (t) {
    if (typeof Symbol != "undefined" && Symbol.toStringTag) {
      Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(t, "__esModule", {
      value: true
    });
  };
  n.t = function (t, e) {
    if (e & 1) {
      t = n(t);
    }
    if (e & 8) {
      return t;
    }
    if (e & 4 && typeof t == "object" && t && t.__esModule) {
      return t;
    }
    var r = Object.create(null);
    n.r(r);
    Object.defineProperty(r, "default", {
      enumerable: true,
      value: t
    });
    if (e & 2 && typeof t != "string") {
      for (var a in t) {
        n.d(r, a, function (e) {
          return t[e];
        }.bind(null, a));
      }
    }
    return r;
  };
  n.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    n.d(e, "a", e);
    return e;
  };
  n.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  };
  n.p = "";
  return n(n.s = 52);
}([function (t, e) {
  t.exports = flarum.core.compat.Model;
}, function (t, e) {
  t.exports = flarum.core.compat.extend;
}, function (t, e, n) {
  "use strict";

  function r(t) {
    return t.slice(0).sort(function (t, e) {
      var n = t.position();
      var r = e.position();
      if (n === null && r === null) {
        return e.discussionCount() - t.discussionCount();
      }
      if (r === null) {
        return -1;
      }
      if (n === null) {
        return 1;
      }
      var a = t.parent();
      var o = e.parent();
      if (a === o) {
        return n - r;
      } else if (a && o) {
        return a.position() - o.position();
      } else if (a) {
        if (a === e) {
          return 1;
        } else {
          return a.position() - r;
        }
      } else if (o) {
        if (o === t) {
          return -1;
        } else {
          return n - o.position();
        }
      } else {
        return 0;
      }
    });
  }
  n.d(e, "a", function () {
    return r;
  });
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return o;
  });
  var r = n(9);
  var a = n.n(r);
  function o(t, e = {}, n = {}) {
    var r = t && t.icon();
    var o = n.useColor;
    var s = o === undefined || o;
    e.className = a()([e.className, "icon", r ? t.icon() : "TagIcon"]);
    if (t) {
      e.style = e.style || {};
      if (r) {
        e.style.color = s ? t.color() : "";
      } else {
        e.style.backgroundColor = t.color();
      }
    } else {
      e.className += " untagged";
    }
    if (r) {
      return m("i", e);
    } else {
      return m("span", e);
    }
  }
}, function (t, e, n) {
  "use strict";

  function r(t, e) {
    t.prototype = Object.create(e.prototype);
    t.prototype.constructor = t;
    t.__proto__ = e;
  }
  n.d(e, "a", function () {
    return r;
  });
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return c;
  });
  var r = n(15);
  var a = n.n(r);
  var o = n(10);
  var s = n.n(o);
  var i = n(3);
  function c(t, e = {}) {
    e.style = e.style || {};
    e.className = "TagLabel " + (e.className || "");
    var n = a()(e, "link");
    var r = t ? t.name() : app.translator.trans("flarum-tags.lib.deleted_tag_text");
    if (t) {
      var o = t.color();
      if (o) {
        e.style.backgroundColor = e.style.color = o;
        e.className += " colored";
      }
      if (n) {
        e.title = t.description() || "";
        e.href = app.route("tag", {
          tags: t.slug()
        });
      }
      if (t.isChild()) {
        e.className += " TagLabel--child";
      }
    } else {
      e.className += " untagged";
    }
    return m(n ? s.a : "span", e, m("span", {
      className: "TagLabel-text"
    }, t && t.icon() && Object(i.a)(t, {}, {
      useColor: false
    }), " ", r));
  }
}, function (t, e) {
  t.exports = flarum.core.compat["components/IndexPage"];
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return i;
  });
  var r = n(15);
  var a = n.n(r);
  var o = n(5);
  var s = n(2);
  function i(t, e = {}) {
    var n = [];
    var r = a()(e, "link");
    e.className = "TagsLabel " + (e.className || "");
    if (t) {
      Object(s.a)(t).forEach(function (e) {
        if (e || t.length === 1) {
          n.push(Object(o.a)(e, {
            link: r
          }));
        }
      });
    } else {
      n.push(Object(o.a)());
    }
    return m("span", e, n);
  }
}, function (t, e) {
  t.exports = flarum.core.compat["components/Button"];
}, function (t, e) {
  t.exports = flarum.core.compat["utils/classList"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/Link"];
}, function (t, e) {
  t.exports = flarum.core.compat["utils/Stream"];
}, function (t, e, n) {
  "use strict";

  function r() {
    return (r = Object.assign || function (t) {
      for (var e = 1; e < arguments.length; e++) {
        var n = arguments[e];
        for (var r in n) {
          if (Object.prototype.hasOwnProperty.call(n, r)) {
            t[r] = n[r];
          }
        }
      }
      return t;
    }).apply(this, arguments);
  }
  n.d(e, "a", function () {
    return r;
  });
}, function (t, e, n) {
  "use strict";

  n.d(e, "a", function () {
    return l;
  });
  var r = n(4);
  var a = n(0);
  var o = n.n(a);
  var s = n(19);
  var i = n.n(s);
  var c = n(20);
  var u = n.n(c);
  var l = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(r.a)(e, t);
    return e;
  }(i()(o.a, {
    name: o.a.attribute("name"),
    slug: o.a.attribute("slug"),
    description: o.a.attribute("description"),
    color: o.a.attribute("color"),
    backgroundUrl: o.a.attribute("backgroundUrl"),
    backgroundMode: o.a.attribute("backgroundMode"),
    icon: o.a.attribute("icon"),
    position: o.a.attribute("position"),
    parent: o.a.hasOne("parent"),
    children: o.a.hasMany("children"),
    defaultSort: o.a.attribute("defaultSort"),
    isChild: o.a.attribute("isChild"),
    isHidden: o.a.attribute("isHidden"),
    discussionCount: o.a.attribute("discussionCount"),
    lastPostedAt: o.a.attribute("lastPostedAt", o.a.transformDate),
    lastPostedDiscussion: o.a.hasOne("lastPostedDiscussion"),
    isRestricted: o.a.attribute("isRestricted"),
    canStartDiscussion: o.a.attribute("canStartDiscussion"),
    canAddToDiscussion: o.a.attribute("canAddToDiscussion"),
    isPrimary: u()("position", "parent", function (t, e) {
      return t !== null && e === false;
    })
  }));
}, function (t, e) {
  t.exports = flarum.core.compat["components/LoadingIndicator"];
}, function (t, e) {
  t.exports = flarum.core.compat["utils/extract"];
},, function (t, e) {
  t.exports = flarum.core.compat["components/DiscussionComposer"];
}, function (t, e) {}, function (t, e) {
  t.exports = flarum.core.compat["utils/mixin"];
}, function (t, e) {
  t.exports = flarum.core.compat["utils/computed"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/Modal"];
}, function (t, e, n) {
  "use strict";

  var r = n(2);
  var a = n(13);
  var o = n(7);
  var s = n(3);
  var i = n(5);
  e.a = {
    "tags/utils/sortTags": r.a,
    "tags/models/Tag": a.a,
    "tags/helpers/tagsLabel": o.a,
    "tags/helpers/tagIcon": s.a,
    "tags/helpers/tagLabel": i.a
  };
}, function (t, e) {
  t.exports = flarum.core;
}, function (t, e) {
  t.exports = flarum.core.compat["components/LinkButton"];
}, function (t, e) {
  t.exports = flarum.core.compat["models/Discussion"];
}, function (t, e, n) {
  t.exports = n(53);
}, function (t, e) {
  t.exports = flarum.core.compat["components/DiscussionHero"];
}, function (t, e) {
  t.exports = flarum.core.compat["utils/extractText"];
},, function (t, e, n) {
  "use strict";

  var r = n(12);
  var a = n(0);
  var o = n.n(a);
  var s = n(25);
  var i = n.n(s);
  var c = n(6);
  var u = n.n(c);
  var l = n(13);
  var p = n(4);
  var f = n(32);
  var d = n.n(f);
  var h = n(10);
  var g = n.n(h);
  var v = n(14);
  var y = n.n(v);
  var b = n(33);
  var x = n.n(b);
  var T = n(34);
  var O = n.n(T);
  var w = n(3);
  var _ = n(5);
  var j = n(2);
  var N = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(p.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      var n = this;
      t.prototype.oninit.call(this, e);
      app.history.push("tags", app.translator.trans("flarum-tags.forum.header.back_to_tags_tooltip"));
      this.tags = [];
      var r = app.preloadedApiDocument();
      if (r) {
        this.tags = Object(j.a)(r.filter(function (t) {
          return !t.isChild();
        }));
      } else {
        this.loading = true;
        app.tagList.load(["children", "lastPostedDiscussion"]).then(function () {
          n.tags = Object(j.a)(app.store.all("tags").filter(function (t) {
            return !t.isChild();
          }));
          n.loading = false;
          m.redraw();
        });
      }
    };
    n.view = function () {
      if (this.loading) {
        return m(y.a, null);
      }
      var t = this.tags.filter(function (t) {
        return t.position() !== null;
      });
      var e = this.tags.filter(function (t) {
        return t.position() === null;
      });
      return m("div", {
        className: "TagsPage"
      }, u.a.prototype.hero(), m("div", {
        className: "container"
      }, m("nav", {
        className: "TagsPage-nav IndexPage-nav sideNav"
      }, m("ul", null, x()(u.a.prototype.sidebarItems().toArray()))), m("div", {
        className: "TagsPage-content sideNavOffset"
      }, m("ul", {
        className: "TagTiles"
      }, t.map(function (t) {
        var e = t.lastPostedDiscussion();
        var n = Object(j.a)(t.children() || []);
        return m("li", {
          className: "TagTile " + (t.color() ? "colored" : ""),
          style: {
            backgroundColor: t.color()
          }
        }, m(g.a, {
          className: "TagTile-info",
          href: app.route.tag(t)
        }, t.icon() && Object(w.a)(t, {}, {
          useColor: false
        }), m("h3", {
          className: "TagTile-name"
        }, t.name()), m("p", {
          className: "TagTile-description"
        }, t.description()), n ? m("div", {
          className: "TagTile-children"
        }, n.map(function (t) {
          return [m(g.a, {
            href: app.route.tag(t)
          }, t.name()), " "];
        })) : ""), e ? m(g.a, {
          className: "TagTile-lastPostedDiscussion",
          href: app.route.discussion(e, e.lastPostNumber())
        }, m("span", {
          className: "TagTile-lastPostedDiscussion-title"
        }, e.title()), O()(e.lastPostedAt())) : m("span", {
          className: "TagTile-lastPostedDiscussion"
        }));
      })), e.length ? m("div", {
        className: "TagCloud"
      }, e.map(function (t) {
        return [Object(_.a)(t, {
          link: true
        }), " "];
      })) : "")));
    };
    n.oncreate = function (e) {
      t.prototype.oncreate.call(this, e);
      app.setTitle(app.translator.trans("flarum-tags.forum.all_tags.meta_title_text"));
      app.setTitleCount(0);
    };
    return e;
  }(d.a);
  var L = n(35);
  var P = n.n(L);
  var C = n(7);
  var k = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(p.a)(e, t);
    e.initAttrs = function (e) {
      t.initAttrs.call(this, e);
      var n = e.post.content()[0];
      var r = e.post.content()[1];
      function a(t, e) {
        return t.filter(function (t) {
          return e.indexOf(t) === -1;
        }).map(function (t) {
          return app.store.getById("tags", t);
        });
      }
      e.tagsAdded = a(r, n);
      e.tagsRemoved = a(n, r);
    };
    var n = e.prototype;
    n.icon = function () {
      return "fas fa-tag";
    };
    n.descriptionKey = function () {
      if (this.attrs.tagsAdded.length) {
        if (this.attrs.tagsRemoved.length) {
          return "flarum-tags.forum.post_stream.added_and_removed_tags_text";
        } else {
          return "flarum-tags.forum.post_stream.added_tags_text";
        }
      } else {
        return "flarum-tags.forum.post_stream.removed_tags_text";
      }
    };
    n.descriptionData = function () {
      var t = {};
      if (this.attrs.tagsAdded.length) {
        t.tagsAdded = app.translator.trans("flarum-tags.forum.post_stream.tags_text", {
          tags: Object(C.a)(this.attrs.tagsAdded, {
            link: true
          }),
          count: this.attrs.tagsAdded.length
        });
      }
      if (this.attrs.tagsRemoved.length) {
        t.tagsRemoved = app.translator.trans("flarum-tags.forum.post_stream.tags_text", {
          tags: Object(C.a)(this.attrs.tagsRemoved, {
            link: true
          }),
          count: this.attrs.tagsRemoved.length
        });
      }
      return t;
    };
    return e;
  }(P.a);
  var I = n(26);
  var D = n.n(I);
  function S(t, e, n, r, a, o, s) {
    try {
      var i = t[o](s);
      var c = i.value;
    } catch (t) {
      n(t);
      return;
    }
    if (i.done) {
      e(c);
    } else {
      Promise.resolve(c).then(r, a);
    }
  }
  var E = function () {
    function t() {
      this.loadedIncludes = new Set();
    }
    t.prototype.load = function () {
      var t;
      t = D.a.mark(function t(e) {
        var n;
        var r = this;
        return D.a.wrap(function (t) {
          while (true) {
            switch (t.prev = t.next) {
              case 0:
                if (e === undefined) {
                  e = [];
                }
                if ((n = e.filter(function (t) {
                  return !r.loadedIncludes.has(t);
                })).length !== 0) {
                  t.next = 4;
                  break;
                }
                return t.abrupt("return", Promise.resolve(app.store.all("tags")));
              case 4:
                return t.abrupt("return", app.store.find("tags", {
                  include: n.join(",")
                }).then(function (t) {
                  n.forEach(function (t) {
                    return r.loadedIncludes.add(t);
                  });
                  return t;
                }));
              case 5:
              case "end":
                return t.stop();
            }
          }
        }, t);
      });
      function e() {
        var e = this;
        var n = arguments;
        return new Promise(function (r, a) {
          var o = t.apply(e, n);
          function s(t) {
            S(o, r, a, s, i, "next", t);
          }
          function i(t) {
            S(o, r, a, s, i, "throw", t);
          }
          s(undefined);
        });
      }
      return function (t) {
        return e.apply(this, arguments);
      };
    }();
    return t;
  }();
  var A = n(1);
  var M = n(36);
  var R = n.n(M);
  var B = n(24);
  var H = n.n(B);
  var F = n(9);
  var G = n.n(F);
  var q = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(p.a)(e, t);
    e.prototype.view = function (t) {
      var e = this.attrs.model;
      var n = this.constructor.isActive(this.attrs);
      var r = e && e.description();
      var a = G()(["TagLinkButton", "hasIcon", this.attrs.className, e.isChild() && "child"]);
      return m(g.a, {
        className: a,
        href: this.attrs.route,
        style: n && e ? {
          color: e.color()
        } : "",
        title: r || ""
      }, Object(w.a)(e, {
        className: "Button-icon"
      }), m("span", {
        className: "Button-label"
      }, e ? e.name() : app.translator.trans("flarum-tags.forum.index.untagged_link")));
    };
    e.initAttrs = function (e) {
      t.initAttrs.call(this, e);
      var n = e.model;
      e.params.tags = n ? n.slug() : "untagged";
      e.route = app.route("tag", e.params);
    };
    return e;
  }(H.a);
  function K() {
    Object(A.extend)(u.a.prototype, "navItems", function (t) {
      t.add("tags", m(H.a, {
        icon: "fas fa-th-large",
        href: app.route("tags")
      }, app.translator.trans("flarum-tags.forum.index.tags_link")), -10);
      if (!app.current.matches(N)) {
        t.add("separator", R.a.component(), -12);
        var e = app.search.stickyParams();
        var n = app.store.all("tags");
        var r = this.currentTag();
        function a(n) {
          var a = r === n;
          if (!a && r) {
            a = r.parent() === n;
          }
          t.add("tag" + n.id(), q.component({
            model: n,
            params: e,
            active: a
          }, n == null ? undefined : n.name()), -14);
        }
        Object(j.a)(n).filter(function (t) {
          return t.position() !== null && (!t.isChild() || r && (t.parent() === r || t.parent() === r.parent()));
        }).forEach(a);
        var o = n.filter(function (t) {
          return t.position() === null;
        }).sort(function (t, e) {
          return e.discussionCount() - t.discussionCount();
        });
        o.splice(0, 3).forEach(a);
        if (o.length) {
          t.add("moreTags", m(H.a, {
            href: app.route("tags")
          }, app.translator.trans("flarum-tags.forum.index.more_link")), -16);
        }
      }
    });
  }
  var $ = n(37);
  var U = n.n($);
  var Y = n(38);
  var z = n.n(Y);
  var J = n(39);
  var Q = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(p.a)(e, t);
    e.prototype.view = function () {
      var t = this.attrs.model;
      var e = t.color();
      return m("header", {
        className: "Hero TagHero" + (e ? " TagHero--colored" : ""),
        style: e ? {
          color: "#fff",
          backgroundColor: e
        } : ""
      }, m("div", {
        className: "container"
      }, m("div", {
        className: "containerNarrow"
      }, m("h2", {
        className: "Hero-title"
      }, t.icon() && Object(w.a)(t, {}, {
        useColor: false
      }), " ", t.name()), m("div", {
        className: "Hero-subtitle"
      }, t.description()))));
    };
    return e;
  }(n.n(J).a);
  function V() {
    u.a.prototype.currentTag = function () {
      var t = this;
      if (this.currentActiveTag) {
        return this.currentActiveTag;
      }
      var e = app.search.params().tags;
      var n = null;
      if (e) {
        n = app.store.getBy("tags", "slug", e);
      }
      if (e && !n || n && !n.isChild() && !n.children()) {
        app.store.find("tags", e, {
          include: "children,children.parent,parent,state"
        }).then(function () {
          t.currentActiveTag = app.store.getBy("tags", "slug", e);
          m.redraw();
        });
      }
      if (n) {
        this.currentActiveTag = n;
        return this.currentActiveTag;
      } else {
        return undefined;
      }
    };
    Object(A.override)(u.a.prototype, "hero", function (t) {
      var e = this.currentTag();
      if (e) {
        return m(Q, {
          model: e
        });
      } else {
        return t();
      }
    });
    Object(A.extend)(u.a.prototype, "view", function (t) {
      var e = this.currentTag();
      if (e) {
        t.attrs.className += " IndexPage--tag" + e.id();
      }
    });
    Object(A.extend)(u.a.prototype, "setTitle", function () {
      var t = this.currentTag();
      if (t) {
        app.setTitle(t.name());
      }
    });
    Object(A.extend)(u.a.prototype, "sidebarItems", function (t) {
      var e = this.currentTag();
      if (e) {
        var n = e.color();
        var r = e.canStartDiscussion() || !app.session.user;
        if (n) {
          t.get("newDiscussion").attrs.style = {
            backgroundColor: n
          };
        }
        t.get("newDiscussion").attrs.disabled = !r;
        t.get("newDiscussion").children = app.translator.trans(r ? "core.forum.index.start_discussion_button" : "core.forum.index.cannot_start_discussion_button");
      }
    });
    Object(A.extend)(z.a.prototype, "params", function (t) {
      t.tags = m.route.param("tags");
    });
    Object(A.extend)(U.a.prototype, "requestParams", function (t) {
      t.include.push("tags");
      if (this.params.tags) {
        t.filter.tag = this.params.tags;
        var e = t.filter.q;
        if (e) {
          t.filter.q = e + " tag:" + this.params.tags;
        }
      }
    });
  }
  var W = n(40);
  var X = n.n(W);
  var Z = n(27);
  var tt = n.n(Z);
  function et() {
    Object(A.extend)(X.a.prototype, "infoItems", function (t) {
      var e = this.attrs.discussion.tags();
      if (e && e.length) {
        t.add("tags", Object(C.a)(e), 10);
      }
    });
    Object(A.extend)(tt.a.prototype, "view", function (t) {
      var e = Object(j.a)(this.attrs.discussion.tags());
      if (e && e.length) {
        var n = e[0].color();
        if (n) {
          t.attrs.style = {
            backgroundColor: n
          };
          t.attrs.className += " DiscussionHero--colored";
        }
      }
    });
    Object(A.extend)(tt.a.prototype, "items", function (t) {
      var e = this.attrs.discussion.tags();
      if (e && e.length) {
        t.add("tags", Object(C.a)(e, {
          link: true
        }), 5);
      }
    });
  }
  var nt = n(41);
  var rt = n.n(nt);
  var at = n(8);
  var ot = n.n(at);
  var st = n(21);
  var it = n.n(st);
  var ct = n(42);
  var ut = n.n(ct);
  var lt = n(43);
  var pt = n.n(lt);
  var ft = n(28);
  var dt = n.n(ft);
  var mt = n(44);
  var ht = n.n(mt);
  var gt = n(11);
  var vt = n.n(gt);
  function yt(t) {
    var e = app.store.all("tags");
    return e = t ? e.filter(function (e) {
      return e.canAddToDiscussion() || t.tags().indexOf(e) !== -1;
    }) : e.filter(function (t) {
      return t.canStartDiscussion();
    });
  }
  var bt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    Object(p.a)(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      var n = this;
      t.prototype.oninit.call(this, e);
      this.tagsLoading = true;
      this.selected = [];
      this.filter = vt()("");
      this.focused = false;
      this.minPrimary = app.forum.attribute("minPrimaryTags");
      this.maxPrimary = app.forum.attribute("maxPrimaryTags");
      this.minSecondary = app.forum.attribute("minSecondaryTags");
      this.maxSecondary = app.forum.attribute("maxSecondaryTags");
      this.navigator = new ht.a();
      this.navigator.onUp(function () {
        return n.setIndex(n.getCurrentNumericIndex() - 1, true);
      }).onDown(function () {
        return n.setIndex(n.getCurrentNumericIndex() + 1, true);
      }).onSelect(this.select.bind(this)).onRemove(function () {
        return n.selected.splice(n.selected.length - 1, 1);
      });
      app.tagList.load(["parent"]).then(function () {
        n.tagsLoading = false;
        n.tags = Object(j.a)(yt(n.attrs.discussion));
        if (n.attrs.selectedTags) {
          n.attrs.selectedTags.map(n.addTag.bind(n));
        } else if (n.attrs.discussion) {
          n.attrs.discussion.tags().map(n.addTag.bind(n));
        }
        n.index = n.tags[0].id();
        m.redraw();
      });
    };
    n.primaryCount = function () {
      return this.selected.filter(function (t) {
        return t.isPrimary();
      }).length;
    };
    n.secondaryCount = function () {
      return this.selected.filter(function (t) {
        return !t.isPrimary();
      }).length;
    };
    n.addTag = function (t) {
      if (t.canStartDiscussion()) {
        var e = t.parent();
        if (e && this.selected.indexOf(e) === -1) {
          this.selected.push(e);
        }
        if (this.selected.indexOf(t) === -1) {
          this.selected.push(t);
        }
      }
    };
    n.removeTag = function (t) {
      var e = this.selected.indexOf(t);
      if (e !== -1) {
        this.selected.splice(e, 1);
        this.selected.filter(function (e) {
          return e.parent() === t;
        }).forEach(this.removeTag.bind(this));
      }
    };
    n.className = function () {
      return "TagDiscussionModal";
    };
    n.title = function () {
      if (this.attrs.discussion) {
        return app.translator.trans("flarum-tags.forum.choose_tags.edit_title", {
          title: m("em", null, this.attrs.discussion.title())
        });
      } else {
        return app.translator.trans("flarum-tags.forum.choose_tags.title");
      }
    };
    n.getInstruction = function (t, e) {
      if (t < this.minPrimary) {
        var n = this.minPrimary - t;
        return app.translator.trans("flarum-tags.forum.choose_tags.choose_primary_placeholder", {
          count: n
        });
      }
      if (e < this.minSecondary) {
        var r = this.minSecondary - e;
        return app.translator.trans("flarum-tags.forum.choose_tags.choose_secondary_placeholder", {
          count: r
        });
      }
      return "";
    };
    n.content = function () {
      var t = this;
      if (this.tagsLoading) {
        return m(y.a, null);
      }
      var e = this.tags;
      var n = this.filter().toLowerCase();
      var r = this.primaryCount();
      var a = this.secondaryCount();
      e = e.filter(function (e) {
        var n = e.parent();
        return n === false || t.selected.indexOf(n) !== -1;
      });
      if (r >= this.maxPrimary) {
        e = e.filter(function (e) {
          return !e.isPrimary() || t.selected.indexOf(e) !== -1;
        });
      }
      if (a >= this.maxSecondary) {
        e = e.filter(function (e) {
          return e.isPrimary() || t.selected.indexOf(e) !== -1;
        });
      }
      if (n) {
        e = e.filter(function (t) {
          return t.name().substr(0, n.length).toLowerCase() === n;
        });
      }
      if (e.indexOf(this.index) === -1) {
        this.index = e[0];
      }
      var o = Math.max(dt()(this.getInstruction(r, a)).length, this.filter().length);
      return [m("div", {
        className: "Modal-body"
      }, m("div", {
        className: "TagDiscussionModal-form"
      }, m("div", {
        className: "TagDiscussionModal-form-input"
      }, m("div", {
        className: "TagsInput FormControl " + (this.focused ? "focus" : ""),
        onclick: function () {
          return t.$(".TagsInput input").focus();
        }
      }, m("span", {
        className: "TagsInput-selected"
      }, this.selected.map(function (e) {
        return m("span", {
          className: "TagsInput-tag",
          onclick: function () {
            t.removeTag(e);
            t.onready();
          }
        }, Object(_.a)(e));
      })), m("input", {
        className: "FormControl",
        placeholder: dt()(this.getInstruction(r, a)),
        bidi: this.filter,
        style: {
          width: o + "ch"
        },
        onkeydown: this.navigator.navigate.bind(this.navigator),
        onfocus: function () {
          return t.focused = true;
        },
        onblur: function () {
          return t.focused = false;
        }
      }))), m("div", {
        className: "TagDiscussionModal-form-submit App-primaryControl"
      }, m(ot.a, {
        type: "submit",
        className: "Button Button--primary",
        disabled: !this.meetsRequirements(r, a),
        icon: "fas fa-check"
      }, app.translator.trans("flarum-tags.forum.choose_tags.submit_button"))))), m("div", {
        className: "Modal-footer"
      }, m("ul", {
        className: "TagDiscussionModal-list SelectTagList"
      }, e.filter(function (e) {
        return n || !e.parent() || t.selected.indexOf(e.parent()) !== -1;
      }).map(function (e) {
        return m("li", {
          "data-index": e.id(),
          className: G()({
            pinned: e.position() !== null,
            child: !!e.parent(),
            colored: !!e.color(),
            selected: t.selected.indexOf(e) !== -1,
            active: t.index === e
          }),
          style: {
            color: e.color()
          },
          onmouseover: function () {
            return t.index = e;
          },
          onclick: t.toggleTag.bind(t, e)
        }, Object(w.a)(e), m("span", {
          className: "SelectTagListItem-name"
        }, pt()(e.name(), n)), e.description() ? m("span", {
          className: "SelectTagListItem-description"
        }, e.description()) : "");
      })))];
    };
    n.meetsRequirements = function (t, e) {
      return !!app.forum.attribute("canBypassTagCounts") || t >= this.minPrimary && e >= this.minSecondary;
    };
    n.toggleTag = function (t) {
      if (this.selected.indexOf(t) !== -1) {
        this.removeTag(t);
      } else {
        this.addTag(t);
      }
      if (this.filter()) {
        this.filter("");
        this.index = this.tags[0];
      }
      this.onready();
    };
    n.select = function (t) {
      if (t.metaKey || t.ctrlKey || this.selected.indexOf(this.index) !== -1) {
        if (this.selected.length) {
          this.$("button[type=\"submit\"]").click();
        }
      } else {
        this.getItem(this.index)[0].dispatchEvent(new Event("click"));
      }
    };
    n.selectableItems = function () {
      return this.$(".TagDiscussionModal-list > li");
    };
    n.getCurrentNumericIndex = function () {
      return this.selectableItems().index(this.getItem(this.index));
    };
    n.getItem = function (t) {
      return this.selectableItems().filter("[data-index=\"" + t.id() + "\"]");
    };
    n.setIndex = function (t, e) {
      var n = this.selectableItems();
      var r = n.parent();
      if (t < 0) {
        t = n.length - 1;
      } else if (t >= n.length) {
        t = 0;
      }
      var a = n.eq(t);
      this.index = app.store.getById("tags", a.attr("data-index"));
      m.redraw();
      if (e) {
        var o;
        var s = r.scrollTop();
        var i = r.offset().top;
        var c = i + r.outerHeight();
        var u = a.offset().top;
        var l = u + a.outerHeight();
        if (u < i) {
          o = s - i + u - parseInt(r.css("padding-top"), 10);
        } else if (l > c) {
          o = s - c + l + parseInt(r.css("padding-bottom"), 10);
        }
        if (o !== undefined) {
          r.stop(true).animate({
            scrollTop: o
          }, 100);
        }
      }
    };
    n.onsubmit = function (t) {
      t.preventDefault();
      var e = this.attrs.discussion;
      var n = this.selected;
      if (e) {
        e.save({
          relationships: {
            tags: n
          }
        }).then(function () {
          if (app.current.matches(ut.a)) {
            app.current.get("stream").update();
          }
          m.redraw();
        });
      }
      if (this.attrs.onsubmit) {
        this.attrs.onsubmit(n);
      }
      this.hide();
    };
    return e;
  }(it.a);
  function xt() {
    Object(A.extend)(rt.a, "moderationControls", function (t, e) {
      if (e.canTag()) {
        t.add("tags", m(ot.a, {
          icon: "fas fa-tag",
          onclick: function () {
            return app.modal.show(bt, {
              discussion: e
            });
          }
        }, app.translator.trans("flarum-tags.forum.discussion_controls.edit_tags_button")));
      }
    });
  }
  var Tt = n(17);
  var Ot = n.n(Tt);
  function wt() {
    Object(A.extend)(u.a.prototype, "newDiscussionAction", function (t) {
      var e = this.currentTag();
      if (e) {
        var n = e.parent();
        var r = n ? [n, e] : [e];
        t.then(function (t) {
          return t.fields.tags = r;
        });
      } else {
        app.composer.fields.tags = [];
      }
    });
    Object(A.extend)(Ot.a.prototype, "oninit", function () {
      app.tagList.load(["parent"]).then(function () {
        return m.redraw();
      });
    });
    Ot.a.prototype.chooseTags = function () {
      var t = this;
      if (yt().length) {
        app.modal.show(bt, {
          selectedTags: (this.composer.fields.tags || []).slice(0),
          onsubmit: function (e) {
            t.composer.fields.tags = e;
            t.$("textarea").focus();
          }
        });
      }
    };
    Object(A.extend)(Ot.a.prototype, "headerItems", function (t) {
      var e = this.composer.fields.tags || [];
      var n = yt();
      t.add("tags", m("a", {
        className: G()(["DiscussionComposer-changeTags", !n.length && "disabled"]),
        onclick: this.chooseTags.bind(this)
      }, e.length ? Object(C.a)(e) : m("span", {
        className: "TagLabel untagged"
      }, app.translator.trans("flarum-tags.forum.composer_discussion.choose_tags_link"))), 10);
    });
    Object(A.override)(Ot.a.prototype, "onsubmit", function (t) {
      var e = this;
      var n = this.composer.fields.tags || [];
      var r = n.filter(function (t) {
        return t.position() !== null && !t.isChild();
      });
      var a = n.filter(function (t) {
        return t.position() === null;
      });
      var o = yt();
      if ((!n.length || r.length < app.forum.attribute("minPrimaryTags") || a.length < app.forum.attribute("minSecondaryTags")) && o.length) {
        app.modal.show(bt, {
          selectedTags: n,
          onsubmit: function (n) {
            e.composer.fields.tags = n;
            t();
          }
        });
      } else {
        t();
      }
    });
    Object(A.extend)(Ot.a.prototype, "data", function (t) {
      t.relationships = t.relationships || {};
      t.relationships.tags = this.composer.fields.tags;
    });
  }
  var _t = n(22);
  var jt = Object(r.a)(_t.a, {
    "tags/addTagFilter": V,
    "tags/addTagControl": xt,
    "tags/components/TagHero": Q,
    "tags/components/TagDiscussionModal": bt,
    "tags/components/TagsPage": N,
    "tags/components/DiscussionTaggedPost": k,
    "tags/components/TagLinkButton": q,
    "tags/addTagList": K,
    "tags/addTagLabels": et,
    "tags/addTagComposer": wt
  });
  var Nt = n(23);
  app.initializers.add("flarum-tags", function (t) {
    t.routes.tags = {
      path: "/tags",
      component: N
    };
    t.routes.tag = {
      path: "/t/:tags",
      component: u.a
    };
    t.route.tag = function (e) {
      return t.route("tag", {
        tags: e.slug()
      });
    };
    t.postComponents.discussionTagged = k;
    t.store.models.tags = l.a;
    t.tagList = new E();
    i.a.prototype.tags = o.a.hasMany("tags");
    i.a.prototype.canTag = o.a.attribute("canTag");
    K();
    V();
    et();
    xt();
    wt();
  });
  Object(r.a)(Nt.compat, jt);
},, function (t, e) {
  t.exports = flarum.core.compat["components/Page"];
}, function (t, e) {
  t.exports = flarum.core.compat["helpers/listItems"];
}, function (t, e) {
  t.exports = flarum.core.compat["helpers/humanTime"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/EventPost"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/Separator"];
}, function (t, e) {
  t.exports = flarum.core.compat["states/DiscussionListState"];
}, function (t, e) {
  t.exports = flarum.core.compat["states/GlobalSearchState"];
}, function (t, e) {
  t.exports = flarum.core.compat.Component;
}, function (t, e) {
  t.exports = flarum.core.compat["components/DiscussionListItem"];
}, function (t, e) {
  t.exports = flarum.core.compat["utils/DiscussionControls"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/DiscussionPage"];
}, function (t, e) {
  t.exports = flarum.core.compat["helpers/highlight"];
}, function (t, e) {
  t.exports = flarum.core.compat["utils/KeyboardNavigatable"];
},,,,,,,, function (t, e, n) {
  "use strict";

  n.r(e);
  var r = n(18);
  for (var a in r) {
    if (a !== "default") {
      (function (t) {
        n.d(e, t, function () {
          return r[t];
        });
      })(a);
    }
  }
  n(30);
}, function (t, e, n) {
  var r = function () {
    return this || typeof self == "object" && self;
  }() || Function("return this")();
  var a = r.regeneratorRuntime && Object.getOwnPropertyNames(r).indexOf("regeneratorRuntime") >= 0;
  var o = a && r.regeneratorRuntime;
  r.regeneratorRuntime = undefined;
  t.exports = n(54);
  if (a) {
    r.regeneratorRuntime = o;
  } else {
    try {
      delete r.regeneratorRuntime;
    } catch (t) {
      r.regeneratorRuntime = undefined;
    }
  }
}, function (t, e) {
  (function (e) {
    "use strict";

    var n = Object.prototype;
    var r = n.hasOwnProperty;
    var a = typeof Symbol == "function" ? Symbol : {};
    var o = a.iterator || "@@iterator";
    var s = a.asyncIterator || "@@asyncIterator";
    var i = a.toStringTag || "@@toStringTag";
    var c = typeof t == "object";
    var u = e.regeneratorRuntime;
    if (u) {
      if (c) {
        t.exports = u;
      }
    } else {
      (u = e.regeneratorRuntime = c ? t.exports : {}).wrap = h;
      var l = {};
      var p = {
        [o]: function () {
          return this;
        }
      };
      var f = Object.getPrototypeOf;
      var d = f && f(f(N([])));
      if (d && d !== n && r.call(d, o)) {
        p = d;
      }
      var m = b.prototype = v.prototype = Object.create(p);
      y.prototype = m.constructor = b;
      b.constructor = y;
      b[i] = y.displayName = "GeneratorFunction";
      u.isGeneratorFunction = function (t) {
        var e = typeof t == "function" && t.constructor;
        return !!e && (e === y || (e.displayName || e.name) === "GeneratorFunction");
      };
      u.mark = function (t) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(t, b);
        } else {
          t.__proto__ = b;
          if (!(i in t)) {
            t[i] = "GeneratorFunction";
          }
        }
        t.prototype = Object.create(m);
        return t;
      };
      u.awrap = function (t) {
        return {
          __await: t
        };
      };
      x(T.prototype);
      T.prototype[s] = function () {
        return this;
      };
      u.AsyncIterator = T;
      u.async = function (t, e, n, r) {
        var a = new T(h(t, e, n, r));
        if (u.isGeneratorFunction(e)) {
          return a;
        } else {
          return a.next().then(function (t) {
            if (t.done) {
              return t.value;
            } else {
              return a.next();
            }
          });
        }
      };
      x(m);
      m[i] = "Generator";
      m[o] = function () {
        return this;
      };
      m.toString = function () {
        return "[object Generator]";
      };
      u.keys = function (t) {
        var e = [];
        for (var n in t) {
          e.push(n);
        }
        e.reverse();
        return function n() {
          while (e.length) {
            var r = e.pop();
            if (r in t) {
              n.value = r;
              n.done = false;
              return n;
            }
          }
          n.done = true;
          return n;
        };
      };
      u.values = N;
      j.prototype = {
        constructor: j,
        reset: function (t) {
          this.prev = 0;
          this.next = 0;
          this.sent = this._sent = undefined;
          this.done = false;
          this.delegate = null;
          this.method = "next";
          this.arg = undefined;
          this.tryEntries.forEach(_);
          if (!t) {
            for (var e in this) {
              if (e.charAt(0) === "t" && r.call(this, e) && !isNaN(+e.slice(1))) {
                this[e] = undefined;
              }
            }
          }
        },
        stop: function () {
          this.done = true;
          var t = this.tryEntries[0].completion;
          if (t.type === "throw") {
            throw t.arg;
          }
          return this.rval;
        },
        dispatchException: function (t) {
          if (this.done) {
            throw t;
          }
          var e = this;
          function n(n, r) {
            s.type = "throw";
            s.arg = t;
            e.next = n;
            if (r) {
              e.method = "next";
              e.arg = undefined;
            }
            return !!r;
          }
          for (var a = this.tryEntries.length - 1; a >= 0; --a) {
            var o = this.tryEntries[a];
            var s = o.completion;
            if (o.tryLoc === "root") {
              return n("end");
            }
            if (o.tryLoc <= this.prev) {
              var i = r.call(o, "catchLoc");
              var c = r.call(o, "finallyLoc");
              if (i && c) {
                if (this.prev < o.catchLoc) {
                  return n(o.catchLoc, true);
                }
                if (this.prev < o.finallyLoc) {
                  return n(o.finallyLoc);
                }
              } else if (i) {
                if (this.prev < o.catchLoc) {
                  return n(o.catchLoc, true);
                }
              } else {
                if (!c) {
                  throw new Error("try statement without catch or finally");
                }
                if (this.prev < o.finallyLoc) {
                  return n(o.finallyLoc);
                }
              }
            }
          }
        },
        abrupt: function (t, e) {
          for (var n = this.tryEntries.length - 1; n >= 0; --n) {
            var a = this.tryEntries[n];
            if (a.tryLoc <= this.prev && r.call(a, "finallyLoc") && this.prev < a.finallyLoc) {
              var o = a;
              break;
            }
          }
          if (o && (t === "break" || t === "continue") && o.tryLoc <= e && e <= o.finallyLoc) {
            o = null;
          }
          var s = o ? o.completion : {};
          s.type = t;
          s.arg = e;
          if (o) {
            this.method = "next";
            this.next = o.finallyLoc;
            return l;
          } else {
            return this.complete(s);
          }
        },
        complete: function (t, e) {
          if (t.type === "throw") {
            throw t.arg;
          }
          if (t.type === "break" || t.type === "continue") {
            this.next = t.arg;
          } else if (t.type === "return") {
            this.rval = this.arg = t.arg;
            this.method = "return";
            this.next = "end";
          } else if (t.type === "normal" && e) {
            this.next = e;
          }
          return l;
        },
        finish: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var n = this.tryEntries[e];
            if (n.finallyLoc === t) {
              this.complete(n.completion, n.afterLoc);
              _(n);
              return l;
            }
          }
        },
        catch: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var n = this.tryEntries[e];
            if (n.tryLoc === t) {
              var r = n.completion;
              if (r.type === "throw") {
                var a = r.arg;
                _(n);
              }
              return a;
            }
          }
          throw new Error("illegal catch attempt");
        },
        delegateYield: function (t, e, n) {
          this.delegate = {
            iterator: N(t),
            resultName: e,
            nextLoc: n
          };
          if (this.method === "next") {
            this.arg = undefined;
          }
          return l;
        }
      };
    }
    function h(t, e, n, r) {
      var a = e && e.prototype instanceof v ? e : v;
      var o = Object.create(a.prototype);
      var s = new j(r || []);
      o._invoke = function (t, e, n) {
        var r = "suspendedStart";
        return function (a, o) {
          if (r === "executing") {
            throw new Error("Generator is already running");
          }
          if (r === "completed") {
            if (a === "throw") {
              throw o;
            }
            return L();
          }
          n.method = a;
          n.arg = o;
          while (true) {
            var s = n.delegate;
            if (s) {
              var i = O(s, n);
              if (i) {
                if (i === l) {
                  continue;
                }
                return i;
              }
            }
            if (n.method === "next") {
              n.sent = n._sent = n.arg;
            } else if (n.method === "throw") {
              if (r === "suspendedStart") {
                r = "completed";
                throw n.arg;
              }
              n.dispatchException(n.arg);
            } else if (n.method === "return") {
              n.abrupt("return", n.arg);
            }
            r = "executing";
            var c = g(t, e, n);
            if (c.type === "normal") {
              r = n.done ? "completed" : "suspendedYield";
              if (c.arg === l) {
                continue;
              }
              return {
                value: c.arg,
                done: n.done
              };
            }
            if (c.type === "throw") {
              r = "completed";
              n.method = "throw";
              n.arg = c.arg;
            }
          }
        };
      }(t, n, s);
      return o;
    }
    function g(t, e, n) {
      try {
        return {
          type: "normal",
          arg: t.call(e, n)
        };
      } catch (t) {
        return {
          type: "throw",
          arg: t
        };
      }
    }
    function v() {}
    function y() {}
    function b() {}
    function x(t) {
      ["next", "throw", "return"].forEach(function (e) {
        t[e] = function (t) {
          return this._invoke(e, t);
        };
      });
    }
    function T(t) {
      var e;
      this._invoke = function (n, a) {
        function o() {
          return new Promise(function (e, o) {
            (function e(n, a, o, s) {
              var i = g(t[n], t, a);
              if (i.type !== "throw") {
                var c = i.arg;
                var u = c.value;
                if (u && typeof u == "object" && r.call(u, "__await")) {
                  return Promise.resolve(u.__await).then(function (t) {
                    e("next", t, o, s);
                  }, function (t) {
                    e("throw", t, o, s);
                  });
                } else {
                  return Promise.resolve(u).then(function (t) {
                    c.value = t;
                    o(c);
                  }, function (t) {
                    return e("throw", t, o, s);
                  });
                }
              }
              s(i.arg);
            })(n, a, e, o);
          });
        }
        return e = e ? e.then(o, o) : o();
      };
    }
    function O(t, e) {
      var n = t.iterator[e.method];
      if (n === undefined) {
        e.delegate = null;
        if (e.method === "throw") {
          if (t.iterator.return && (e.method = "return", e.arg = undefined, O(t, e), e.method === "throw")) {
            return l;
          }
          e.method = "throw";
          e.arg = new TypeError("The iterator does not provide a 'throw' method");
        }
        return l;
      }
      var r = g(n, t.iterator, e.arg);
      if (r.type === "throw") {
        e.method = "throw";
        e.arg = r.arg;
        e.delegate = null;
        return l;
      }
      var a = r.arg;
      if (a) {
        if (a.done) {
          e[t.resultName] = a.value;
          e.next = t.nextLoc;
          if (e.method !== "return") {
            e.method = "next";
            e.arg = undefined;
          }
          e.delegate = null;
          return l;
        } else {
          return a;
        }
      } else {
        e.method = "throw";
        e.arg = new TypeError("iterator result is not an object");
        e.delegate = null;
        return l;
      }
    }
    function w(t) {
      var e = {
        tryLoc: t[0]
      };
      if (1 in t) {
        e.catchLoc = t[1];
      }
      if (2 in t) {
        e.finallyLoc = t[2];
        e.afterLoc = t[3];
      }
      this.tryEntries.push(e);
    }
    function _(t) {
      var e = t.completion || {};
      e.type = "normal";
      delete e.arg;
      t.completion = e;
    }
    function j(t) {
      this.tryEntries = [{
        tryLoc: "root"
      }];
      t.forEach(w, this);
      this.reset(true);
    }
    function N(t) {
      if (t) {
        var e = t[o];
        if (e) {
          return e.call(t);
        }
        if (typeof t.next == "function") {
          return t;
        }
        if (!isNaN(t.length)) {
          var n = -1;
          var a = function e() {
            while (++n < t.length) {
              if (r.call(t, n)) {
                e.value = t[n];
                e.done = false;
                return e;
              }
            }
            e.value = undefined;
            e.done = true;
            return e;
          };
          return a.next = a;
        }
      }
      return {
        next: L
      };
    }
    function L() {
      return {
        value: undefined,
        done: true
      };
    }
  })(function () {
    return this || typeof self == "object" && self;
  }() || Function("return this")());
}]);
flarum.extensions["flarum-tags"] = module.exports;
var module = {};
module.exports = function (t) {
  var e = {};
  function n(s) {
    if (e[s]) {
      return e[s].exports;
    }
    var a = e[s] = {
      i: s,
      l: false,
      exports: {}
    };
    t[s].call(a.exports, a, a.exports, n);
    a.l = true;
    return a.exports;
  }
  n.m = t;
  n.c = e;
  n.d = function (t, e, s) {
    if (!n.o(t, e)) {
      Object.defineProperty(t, e, {
        enumerable: true,
        get: s
      });
    }
  };
  n.r = function (t) {
    if (typeof Symbol != "undefined" && Symbol.toStringTag) {
      Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(t, "__esModule", {
      value: true
    });
  };
  n.t = function (t, e) {
    if (e & 1) {
      t = n(t);
    }
    if (e & 8) {
      return t;
    }
    if (e & 4 && typeof t == "object" && t && t.__esModule) {
      return t;
    }
    var s = Object.create(null);
    n.r(s);
    Object.defineProperty(s, "default", {
      enumerable: true,
      value: t
    });
    if (e & 2 && typeof t != "string") {
      for (var a in t) {
        n.d(s, a, function (e) {
          return t[e];
        }.bind(null, a));
      }
    }
    return s;
  };
  n.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    n.d(e, "a", e);
    return e;
  };
  n.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  };
  n.p = "";
  return n(n.s = 11);
}([function (t, e) {
  t.exports = flarum.core.compat.app;
}, function (t, e) {
  t.exports = flarum.core.compat["components/Button"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/Notification"];
}, function (t, e) {
  t.exports = flarum.core.compat.Model;
}, function (t, e) {
  t.exports = flarum.core.compat["models/User"];
}, function (t, e) {
  t.exports = flarum.core.compat["utils/withAttr"];
}, function (t, e) {
  t.exports = flarum.core.compat.extend;
}, function (t, e) {
  t.exports = flarum.core.compat["utils/Stream"];
}, function (t, e) {
  t.exports = flarum.core.compat["utils/UserControls"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/Badge"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/Modal"];
}, function (t, e, n) {
  "use strict";

  n.r(e);
  var s = n(6);
  var a = n(0);
  var r = n.n(a);
  var o = n(8);
  var u = n.n(o);
  var i = n(1);
  var l = n.n(i);
  var p = n(9);
  var c = n.n(p);
  var d = n(3);
  var f = n.n(d);
  var y = n(4);
  var h = n.n(y);
  function b(t, e) {
    t.prototype = Object.create(e.prototype);
    t.prototype.constructor = t;
    t.__proto__ = e;
  }
  var v = n(10);
  var _ = n.n(v);
  var x = n(7);
  var g = n.n(x);
  var j = n(5);
  var S = n.n(j);
  var U = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    b(e, t);
    var n = e.prototype;
    n.oninit = function (e) {
      t.prototype.oninit.call(this, e);
      var n = this.attrs.user.suspendedUntil();
      var s = null;
      if (new Date() > n) {
        n = null;
      }
      if (n) {
        s = n.getFullYear() === 9999 ? "indefinitely" : "limited";
      }
      this.status = g()(s);
      this.daysRemaining = g()(s === "limited" && 1 - dayjs().diff(n, "days"));
    };
    n.className = function () {
      return "SuspendUserModal Modal--small";
    };
    n.title = function () {
      return app.translator.trans("flarum-suspend.forum.suspend_user.title", {
        user: this.attrs.user
      });
    };
    n.content = function () {
      var t = this;
      return m("div", {
        className: "Modal-body"
      }, m("div", {
        className: "Form"
      }, m("div", {
        className: "Form-group"
      }, m("label", null, app.translator.trans("flarum-suspend.forum.suspend_user.status_heading")), m("div", null, m("label", {
        className: "checkbox"
      }, m("input", {
        type: "radio",
        name: "status",
        checked: !this.status(),
        value: "",
        onclick: S()("value", this.status)
      }), app.translator.trans("flarum-suspend.forum.suspend_user.not_suspended_label")), m("label", {
        className: "checkbox"
      }, m("input", {
        type: "radio",
        name: "status",
        checked: this.status() === "indefinitely",
        value: "indefinitely",
        onclick: S()("value", this.status)
      }), app.translator.trans("flarum-suspend.forum.suspend_user.indefinitely_label")), m("label", {
        className: "checkbox SuspendUserModal-days"
      }, m("input", {
        type: "radio",
        name: "status",
        checked: this.status() === "limited",
        value: "limited",
        onclick: function (e) {
          t.status(e.target.value);
          m.redraw.sync();
          t.$(".SuspendUserModal-days-input input").select();
          e.redraw = false;
        }
      }), app.translator.trans("flarum-suspend.forum.suspend_user.limited_time_label"), this.status() === "limited" ? m("div", {
        className: "SuspendUserModal-days-input"
      }, m("input", {
        type: "number",
        min: "0",
        value: this.daysRemaining(),
        oninput: S()("value", this.daysRemaining),
        className: "FormControl"
      }), app.translator.trans("flarum-suspend.forum.suspend_user.limited_time_days_text")) : ""))), m("div", {
        className: "Form-group"
      }, m(l.a, {
        className: "Button Button--primary",
        loading: this.loading,
        type: "submit"
      }, app.translator.trans("flarum-suspend.forum.suspend_user.submit_button")))));
    };
    n.onsubmit = function (t) {
      var e = this;
      t.preventDefault();
      this.loading = true;
      var n = null;
      switch (this.status()) {
        case "indefinitely":
          n = new Date("2038-01-01");
          break;
        case "limited":
          n = dayjs().add(this.daysRemaining(), "days").toDate();
      }
      this.attrs.user.save({
        suspendedUntil: n
      }).then(function () {
        return e.hide();
      }, this.loaded.bind(this));
    };
    return e;
  }(_.a);
  var M = n(2);
  var N = n.n(M);
  var k = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    b(e, t);
    var n = e.prototype;
    n.icon = function () {
      return "fas fa-ban";
    };
    n.href = function () {
      return app.route.user(this.attrs.notification.subject());
    };
    n.content = function () {
      var t = this.attrs.notification;
      var e = t.content();
      var n = dayjs(e).from(t.createdAt(), true);
      return app.translator.trans("flarum-suspend.forum.notifications.user_suspended_text", {
        user: t.fromUser(),
        timeReadable: n
      });
    };
    return e;
  }(N.a);
  var O = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    b(e, t);
    var n = e.prototype;
    n.icon = function () {
      return "fas fa-ban";
    };
    n.href = function () {
      return app.route.user(this.attrs.notification.subject());
    };
    n.content = function () {
      var t = this.attrs.notification;
      return app.translator.trans("flarum-suspend.forum.notifications.user_unsuspended_text", {
        user: t.fromUser()
      });
    };
    return e;
  }(N.a);
  r.a.initializers.add("flarum-suspend", function () {
    r.a.notificationComponents.userSuspended = k;
    r.a.notificationComponents.userUnsuspended = O;
    h.a.prototype.canSuspend = f.a.attribute("canSuspend");
    h.a.prototype.suspendedUntil = f.a.attribute("suspendedUntil", f.a.transformDate);
    Object(s.extend)(u.a, "moderationControls", function (t, e) {
      if (e.canSuspend()) {
        t.add("suspend", l.a.component({
          icon: "fas fa-ban",
          onclick: function () {
            return r.a.modal.show(U, {
              user: e
            });
          }
        }, r.a.translator.trans("flarum-suspend.forum.user_controls.suspend_button")));
      }
    });
    Object(s.extend)(h.a.prototype, "badges", function (t) {
      var e = this.suspendedUntil();
      if (new Date() < e) {
        t.add("suspended", c.a.component({
          icon: "fas fa-ban",
          type: "suspended",
          label: r.a.translator.trans("flarum-suspend.forum.user_badge.suspended_tooltip")
        }));
      }
    });
  });
}]);
flarum.extensions["flarum-suspend"] = module.exports;
var module = {};
module.exports = function (t) {
  var o = {};
  function n(r) {
    if (o[r]) {
      return o[r].exports;
    }
    var s = o[r] = {
      i: r,
      l: false,
      exports: {}
    };
    t[r].call(s.exports, s, s.exports, n);
    s.l = true;
    return s.exports;
  }
  n.m = t;
  n.c = o;
  n.d = function (t, o, r) {
    if (!n.o(t, o)) {
      Object.defineProperty(t, o, {
        enumerable: true,
        get: r
      });
    }
  };
  n.r = function (t) {
    if (typeof Symbol != "undefined" && Symbol.toStringTag) {
      Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(t, "__esModule", {
      value: true
    });
  };
  n.t = function (t, o) {
    if (o & 1) {
      t = n(t);
    }
    if (o & 8) {
      return t;
    }
    if (o & 4 && typeof t == "object" && t && t.__esModule) {
      return t;
    }
    var r = Object.create(null);
    n.r(r);
    Object.defineProperty(r, "default", {
      enumerable: true,
      value: t
    });
    if (o & 2 && typeof t != "string") {
      for (var s in t) {
        n.d(r, s, function (o) {
          return t[o];
        }.bind(null, s));
      }
    }
    return r;
  };
  n.n = function (t) {
    var o = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    n.d(o, "a", o);
    return o;
  };
  n.o = function (t, o) {
    return Object.prototype.hasOwnProperty.call(t, o);
  };
  n.p = "";
  return n(n.s = 23);
}([function (t, o) {
  t.exports = flarum.core.compat.extend;
}, function (t, o) {
  t.exports = flarum.core.compat["components/IndexPage"];
}, function (t, o) {
  t.exports = flarum.core.compat["helpers/icon"];
}, function (t, o) {
  t.exports = flarum.core.compat.app;
}, function (t, o) {
  t.exports = flarum.core.compat["models/Discussion"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/Button"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/Badge"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/DiscussionPage"];
}, function (t, o) {
  t.exports = flarum.core.compat["utils/classList"];
}, function (t, o) {
  t.exports = flarum.core.compat.Model;
}, function (t, o) {
  t.exports = flarum.core.compat["components/NotificationGrid"];
}, function (t, o) {
  t.exports = flarum.core.compat["utils/DiscussionControls"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/Dropdown"];
}, function (t, o) {
  t.exports = flarum.core.compat["common/components/Tooltip"];
}, function (t, o) {
  t.exports = flarum.core.compat["utils/extractText"];
}, function (t, o) {
  t.exports = flarum.core.compat.Component;
}, function (t, o) {
  t.exports = flarum.core.compat["components/LinkButton"];
}, function (t, o) {
  t.exports = flarum.core.compat["states/DiscussionListState"];
}, function (t, o) {
  t.exports = flarum.core.compat["states/GlobalSearchState"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/SettingsPage"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/Switch"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/Notification"];
}, function (t, o) {
  t.exports = flarum.core.compat["helpers/username"];
}, function (t, o, n) {
  "use strict";

  n.r(o);
  var r = n(0);
  var s = n(3);
  var e = n.n(s);
  var a = n(9);
  var i = n.n(a);
  var c = n(4);
  var u = n.n(c);
  var l = n(1);
  var p = n.n(l);
  var f = n(10);
  var b = n.n(f);
  var d = n(6);
  var g = n.n(d);
  var _ = n(5);
  var w = n.n(_);
  var y = n(7);
  var h = n.n(y);
  var x = n(11);
  var v = n.n(x);
  function O() {
    return (O = Object.assign || function (t) {
      for (var o = 1; o < arguments.length; o++) {
        var n = arguments[o];
        for (var r in n) {
          if (Object.prototype.hasOwnProperty.call(n, r)) {
            t[r] = n[r];
          }
        }
      }
      return t;
    }).apply(this, arguments);
  }
  function j(t, o) {
    t.prototype = Object.create(o.prototype);
    t.prototype.constructor = t;
    t.__proto__ = o;
  }
  var S = n(12);
  var P = n.n(S);
  var N = n(13);
  var M = n.n(N);
  var k = n(2);
  var B = n.n(k);
  var D = n(14);
  var I = n.n(D);
  var T = n(8);
  var A = n.n(T);
  var L = n(15);
  var R = function (t) {
    function o() {
      return t.apply(this, arguments) || this;
    }
    j(o, t);
    o.prototype.view = function () {
      return m("button", {
        className: "SubscriptionMenuItem hasIcon",
        onclick: this.attrs.onclick
      }, this.attrs.active ? B()("fas fa-check", {
        className: "Button-icon"
      }) : "", m("span", {
        className: "SubscriptionMenuItem-label"
      }, B()(this.attrs.icon, {
        className: "Button-icon"
      }), m("strong", null, this.attrs.label), m("span", {
        className: "SubscriptionMenuItem-description"
      }, this.attrs.description)));
    };
    return o;
  }(n.n(L).a);
  var C = function (t) {
    function o() {
      return t.apply(this, arguments) || this;
    }
    j(o, t);
    var n = o.prototype;
    n.oninit = function (o) {
      t.prototype.oninit.call(this, o);
      this.options = [{
        subscription: null,
        icon: "far fa-star",
        label: app.translator.trans("flarum-subscriptions.forum.sub_controls.not_following_button"),
        description: app.translator.trans("flarum-subscriptions.forum.sub_controls.not_following_text")
      }, {
        subscription: "follow",
        icon: "fas fa-star",
        label: app.translator.trans("flarum-subscriptions.forum.sub_controls.following_button"),
        description: app.translator.trans("flarum-subscriptions.forum.sub_controls.following_text")
      }, {
        subscription: "ignore",
        icon: "far fa-eye-slash",
        label: app.translator.trans("flarum-subscriptions.forum.sub_controls.ignoring_button"),
        description: app.translator.trans("flarum-subscriptions.forum.sub_controls.ignoring_text")
      }];
    };
    n.view = function () {
      var t = this;
      var o = this.attrs.discussion;
      var n = o.subscription();
      var r = app.translator.trans("flarum-subscriptions.forum.sub_controls.follow_button");
      var s = "far fa-star";
      var e = "SubscriptionMenu-button--" + n;
      switch (n) {
        case "follow":
          r = app.translator.trans("flarum-subscriptions.forum.sub_controls.following_button");
          s = "fas fa-star";
          break;
        case "ignore":
          r = app.translator.trans("flarum-subscriptions.forum.sub_controls.ignoring_button");
          s = "far fa-eye-slash";
      }
      var a = app.session.user.preferences();
      var i = a.notify_newPost_email;
      var c = a.notify_newPost_alert;
      var u = I()(app.translator.trans(i ? "flarum-subscriptions.forum.sub_controls.notify_email_tooltip" : "flarum-subscriptions.forum.sub_controls.notify_alert_tooltip"));
      var l = (i || c) && n === null;
      var p = m(w.a, {
        className: A()("Button", "SubscriptionMenu-button", e),
        icon: s,
        onclick: this.saveSubscription.bind(this, o, ["follow", "ignore"].indexOf(n) !== -1 ? null : "follow")
      }, r);
      return m("div", {
        className: "Dropdown ButtonGroup SubscriptionMenu"
      }, l ? m(M.a, {
        text: u,
        position: "bottom"
      }, p) : p, m("button", {
        className: A()("Dropdown-toggle Button Button--icon", e),
        "data-toggle": "dropdown"
      }, B()("fas fa-caret-down", {
        className: "Button-icon"
      })), m("ul", {
        className: "Dropdown-menu dropdown-menu Dropdown-menu--right"
      }, this.options.map(function (r) {
        return m("li", null, R.component(O(O({}, r), {}, {
          onclick: t.saveSubscription.bind(t, o, r.subscription),
          active: n === r.subscription
        })));
      })));
    };
    n.saveSubscription = function (t, o) {
      t.save({
        subscription: o
      });
      this.$(".SubscriptionMenu-button").tooltip("hide");
    };
    return o;
  }(P.a);
  var G = n(16);
  var F = n.n(G);
  var q = n(17);
  var z = n.n(q);
  var U = n(18);
  var $ = n.n(U);
  var E = n(19);
  var H = n.n(E);
  var J = n(20);
  var K = n.n(J);
  var Q = n(21);
  var V = n.n(Q);
  n(22);
  var W = function (t) {
    function o() {
      return t.apply(this, arguments) || this;
    }
    j(o, t);
    var n = o.prototype;
    n.icon = function () {
      return "fas fa-star";
    };
    n.href = function () {
      var t = this.attrs.notification;
      var o = t.subject();
      var n = t.content() || {};
      return app.route.discussion(o, n.postNumber);
    };
    n.content = function () {
      return app.translator.trans("flarum-subscriptions.forum.notifications.new_post_text", {
        user: this.attrs.notification.fromUser()
      });
    };
    return o;
  }(V.a);
  e.a.initializers.add("subscriptions", function () {
    e.a.routes.following = {
      path: "/following",
      component: p.a
    };
    e.a.notificationComponents.newPost = W;
    u.a.prototype.subscription = i.a.attribute("subscription");
    Object(r.extend)(u.a.prototype, "badges", function (t) {
      var o;
      switch (this.subscription()) {
        case "follow":
          o = g.a.component({
            label: app.translator.trans("flarum-subscriptions.forum.badge.following_tooltip"),
            icon: "fas fa-star",
            type: "following"
          });
          break;
        case "ignore":
          o = g.a.component({
            label: app.translator.trans("flarum-subscriptions.forum.badge.ignoring_tooltip"),
            icon: "far fa-eye-slash",
            type: "ignoring"
          });
      }
      if (o) {
        t.add("subscription", o);
      }
    });
    Object(r.extend)(v.a, "userControls", function (t, o, n) {
      if (app.session.user && !(n instanceof h.a)) {
        var r = {
          none: {
            label: app.translator.trans("flarum-subscriptions.forum.discussion_controls.follow_button"),
            icon: "fas fa-star",
            save: "follow"
          },
          follow: {
            label: app.translator.trans("flarum-subscriptions.forum.discussion_controls.unfollow_button"),
            icon: "far fa-star",
            save: null
          },
          ignore: {
            label: app.translator.trans("flarum-subscriptions.forum.discussion_controls.unignore_button"),
            icon: "fas fa-eye",
            save: null
          }
        };
        var s = o.subscription() || "none";
        t.add("subscription", w.a.component({
          icon: r[s].icon,
          onclick: o.save.bind(o, {
            subscription: r[s].save
          })
        }, r[s].label));
      }
    });
    Object(r.extend)(h.a.prototype, "sidebarItems", function (t) {
      if (app.session.user) {
        var o = this.discussion;
        t.add("subscription", C.component({
          discussion: o
        }));
      }
    });
    Object(r.extend)(p.a.prototype, "navItems", function (t) {
      if (app.session.user) {
        var o = app.search.stickyParams();
        t.add("following", F.a.component({
          href: app.route("following", o),
          icon: "fas fa-star"
        }, app.translator.trans("flarum-subscriptions.forum.index.following_link")), 50);
      }
    });
    Object(r.extend)(p.a.prototype, "setTitle", function () {
      if (app.current.get("routeName") === "following") {
        app.setTitle(app.translator.trans("flarum-subscriptions.forum.following.meta_title_text"));
      }
    });
    Object(r.extend)($.a.prototype, "params", function (t) {
      t.onFollowing = app.current.get("routeName") === "following";
    });
    Object(r.extend)(z.a.prototype, "requestParams", function (t) {
      if (this.params.onFollowing) {
        t.filter.subscription = "following";
      }
    });
    Object(r.extend)(H.a.prototype, "notificationsItems", function (t) {
      var o = this;
      t.add("followAfterReply", K.a.component({
        state: this.user.preferences().followAfterReply,
        onchange: function (t) {
          o.followAfterReplyLoading = true;
          o.user.savePreferences({
            followAfterReply: t
          }).then(function () {
            o.followAfterReplyLoading = false;
            m.redraw();
          });
        },
        loading: this.followAfterReplyLoading
      }, app.translator.trans("flarum-subscriptions.forum.settings.follow_after_reply_label")));
    });
    Object(r.extend)(b.a.prototype, "notificationTypes", function (t) {
      t.add("newPost", {
        name: "newPost",
        icon: "fas fa-star",
        label: e.a.translator.trans("flarum-subscriptions.forum.settings.notify_new_post_label")
      });
    });
  });
}]);
flarum.extensions["flarum-subscriptions"] = module.exports;
var module = {};
module.exports = function (t) {
  var o = {};
  function n(e) {
    if (o[e]) {
      return o[e].exports;
    }
    var r = o[e] = {
      i: e,
      l: false,
      exports: {}
    };
    t[e].call(r.exports, r, r.exports, n);
    r.l = true;
    return r.exports;
  }
  n.m = t;
  n.c = o;
  n.d = function (t, o, e) {
    if (!n.o(t, o)) {
      Object.defineProperty(t, o, {
        enumerable: true,
        get: e
      });
    }
  };
  n.r = function (t) {
    if (typeof Symbol != "undefined" && Symbol.toStringTag) {
      Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(t, "__esModule", {
      value: true
    });
  };
  n.t = function (t, o) {
    if (o & 1) {
      t = n(t);
    }
    if (o & 8) {
      return t;
    }
    if (o & 4 && typeof t == "object" && t && t.__esModule) {
      return t;
    }
    var e = Object.create(null);
    n.r(e);
    Object.defineProperty(e, "default", {
      enumerable: true,
      value: t
    });
    if (o & 2 && typeof t != "string") {
      for (var r in t) {
        n.d(e, r, function (o) {
          return t[o];
        }.bind(null, r));
      }
    }
    return e;
  };
  n.n = function (t) {
    var o = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    n.d(o, "a", o);
    return o;
  };
  n.o = function (t, o) {
    return Object.prototype.hasOwnProperty.call(t, o);
  };
  n.p = "";
  return n(n.s = 13);
}([function (t, o) {
  t.exports = flarum.core.compat.app;
}, function (t, o) {
  t.exports = flarum.core.compat.extend;
}, function (t, o) {
  t.exports = flarum.core.compat["models/Discussion"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/DiscussionPage"];
}, function (t, o) {
  t.exports = flarum.core.compat.Model;
}, function (t, o) {
  t.exports = flarum.core.compat["utils/DiscussionControls"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/EventPost"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/Badge"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/Button"];
}, function (t, o) {
  t.exports = flarum.core.compat["states/DiscussionListState"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/DiscussionListItem"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/IndexPage"];
}, function (t, o) {
  t.exports = flarum.core.compat["utils/string"];
}, function (t, o, n) {
  "use strict";

  n.r(o);
  var e = n(0);
  var r = n.n(e);
  var c = n(4);
  var i = n.n(c);
  var s = n(2);
  var a = n.n(s);
  var u = n(6);
  var p = function (t) {
    var o;
    var n;
    function e() {
      return t.apply(this, arguments) || this;
    }
    n = t;
    (o = e).prototype = Object.create(n.prototype);
    o.prototype.constructor = o;
    o.__proto__ = n;
    var r = e.prototype;
    r.icon = function () {
      return "fas fa-thumbtack";
    };
    r.descriptionKey = function () {
      if (this.attrs.post.content().sticky) {
        return "flarum-sticky.forum.post_stream.discussion_stickied_text";
      } else {
        return "flarum-sticky.forum.post_stream.discussion_unstickied_text";
      }
    };
    return e;
  }(n.n(u).a);
  var f = n(1);
  var l = n(7);
  var d = n.n(l);
  var y = n(5);
  var k = n.n(y);
  var b = n(3);
  var x = n.n(b);
  var _ = n(8);
  var v = n.n(_);
  var h = n(9);
  var S = n.n(h);
  var g = n(10);
  var j = n.n(g);
  var O = n(11);
  var P = n.n(O);
  var D = n(12);
  r.a.initializers.add("flarum-sticky", function () {
    r.a.postComponents.discussionStickied = p;
    a.a.prototype.isSticky = i.a.attribute("isSticky");
    a.a.prototype.canSticky = i.a.attribute("canSticky");
    Object(f.extend)(a.a.prototype, "badges", function (t) {
      if (this.isSticky()) {
        t.add("sticky", d.a.component({
          type: "sticky",
          label: app.translator.trans("flarum-sticky.forum.badge.sticky_tooltip"),
          icon: "fas fa-thumbtack"
        }), 10);
      }
    });
    Object(f.extend)(k.a, "moderationControls", function (t, o) {
      if (o.canSticky()) {
        t.add("sticky", v.a.component({
          icon: "fas fa-thumbtack",
          onclick: this.stickyAction.bind(o)
        }, app.translator.trans(o.isSticky() ? "flarum-sticky.forum.discussion_controls.unsticky_button" : "flarum-sticky.forum.discussion_controls.sticky_button")));
      }
    });
    k.a.stickyAction = function () {
      this.save({
        isSticky: !this.isSticky()
      }).then(function () {
        if (app.current.matches(x.a)) {
          app.current.get("stream").update();
        }
        m.redraw();
      });
    };
    Object(f.extend)(S.a.prototype, "requestParams", function (t) {
      if (app.current.matches(P.a) || app.current.matches(x.a)) {
        t.include.push("firstPost");
      }
    });
    Object(f.extend)(j.a.prototype, "infoItems", function (t) {
      var o = this.attrs.discussion;
      if (o.isSticky() && !this.attrs.params.q && !o.lastReadPostNumber()) {
        var n = o.firstPost();
        if (n) {
          var e = Object(D.truncate)(n.contentPlain(), 175);
          t.add("excerpt", m("div", null, e), -100);
        }
      }
    });
  });
}]);
flarum.extensions["flarum-sticky"] = module.exports;
var module = {};
module.exports = function (t) {
  var e = {};
  function n(o) {
    if (e[o]) {
      return e[o].exports;
    }
    var r = e[o] = {
      i: o,
      l: false,
      exports: {}
    };
    t[o].call(r.exports, r, r.exports, n);
    r.l = true;
    return r.exports;
  }
  n.m = t;
  n.c = e;
  n.d = function (t, e, o) {
    if (!n.o(t, e)) {
      Object.defineProperty(t, e, {
        enumerable: true,
        get: o
      });
    }
  };
  n.r = function (t) {
    if (typeof Symbol != "undefined" && Symbol.toStringTag) {
      Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(t, "__esModule", {
      value: true
    });
  };
  n.t = function (t, e) {
    if (e & 1) {
      t = n(t);
    }
    if (e & 8) {
      return t;
    }
    if (e & 4 && typeof t == "object" && t && t.__esModule) {
      return t;
    }
    var o = Object.create(null);
    n.r(o);
    Object.defineProperty(o, "default", {
      enumerable: true,
      value: t
    });
    if (e & 2 && typeof t != "string") {
      for (var r in t) {
        n.d(o, r, function (e) {
          return t[e];
        }.bind(null, r));
      }
    }
    return o;
  };
  n.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    n.d(e, "a", e);
    return e;
  };
  n.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  };
  n.p = "";
  return n(n.s = 30);
}([function (t, e) {
  t.exports = flarum.core.compat.extend;
}, function (t, e) {
  t.exports = flarum.core.compat["components/CommentPost"];
}, function (t, e) {
  t.exports = flarum.core.compat.app;
}, function (t, e) {
  t.exports = flarum.core.compat["utils/string"];
}, function (t, e) {
  t.exports = flarum.core.compat["helpers/username"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/PostPreview"];
}, function (t, e) {
  t.exports = flarum.core.compat["helpers/icon"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/EditPostComposer"];
}, function (t, e) {
  t.exports = flarum.core.compat.Fragment;
}, function (t, e) {
  t.exports = flarum.core.compat["components/Notification"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/TextEditor"];
}, function (t, e) {
  t.exports = flarum.core.compat["utils/extractText"];
},, function (t, e) {
  t.exports = flarum.core.compat["components/NotificationGrid"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/LoadingIndicator"];
}, function (t, e) {
  t.exports = flarum.core.compat.Model;
}, function (t, e) {
  t.exports = flarum.core.compat["models/Post"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/Link"];
}, function (t, e) {
  t.exports = flarum.core.compat["helpers/punctuateSeries"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/Button"];
}, function (t, e) {
  t.exports = flarum.core.compat["utils/DiscussionControls"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/TextEditorButton"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/ReplyComposer"];
}, function (t, e) {
  t.exports = flarum.core.compat["helpers/avatar"];
}, function (t, e) {
  t.exports = flarum.core.compat["helpers/highlight"];
}, function (t, e) {
  t.exports = flarum.core.compat["utils/KeyboardNavigatable"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/UserPage"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/LinkButton"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/PostsUserPage"];
},, function (t, e, n) {
  "use strict";

  n.r(e);
  n.d(e, "filterUserMentions", function () {
    return bt;
  });
  n.d(e, "filterPostMentions", function () {
    return yt;
  });
  var o = n(0);
  var r = n(2);
  var i = n.n(r);
  var s = n(13);
  var a = n.n(s);
  var u = n(3);
  var c = n(1);
  var p = n.n(c);
  var f = n(5);
  var l = n.n(f);
  var d = n(14);
  var h = n.n(d);
  var v = n(15);
  var b = n.n(v);
  var y = n(16);
  var g = n.n(y);
  var x = n(17);
  var w = n.n(x);
  var P = n(18);
  var C = n.n(P);
  var T = n(4);
  var _ = n.n(T);
  var M = n(6);
  var j = n.n(M);
  var B = n(19);
  var O = n.n(B);
  var A = n(20);
  var k = n.n(A);
  var H = n(7);
  var S = n.n(H);
  function N(t) {
    return t.displayName().replace(/"#[a-z]{0,3}[0-9]+/, "_");
  }
  function I(t, e, n) {
    var o = t.user();
    var r = "@\"" + (o && N(o) || app.translator.trans("core.lib.username.deleted_text")) + "\"#p" + t.id() + " ";
    if (!e.fields.content()) {
      e.body.attrs.originalContent = r;
    }
    var i = e.editor.getSelectionRange()[0];
    var s = e.fields.content().slice(0, i);
    var a = s.length == 0 ? 0 : 3 - s.match(/(\n{0,2})$/)[0].length;
    e.editor.insertAtCursor(Array(a).join("\n") + (n ? "> " + r + n.trim().replace(/\n/g, "\n> ") + "\n\n" : r), false);
  }
  function E(t, e) {
    if (app.composer.bodyMatches(S.a) && app.composer.body.attrs.post.discussion() === t.discussion()) {
      I(t, app.composer, e);
    } else {
      k.a.replyAction.call(t.discussion()).then(function (n) {
        return I(t, n, e);
      });
    }
  }
  function W(t, e) {
    t.prototype = Object.create(e.prototype);
    t.prototype.constructor = t;
    t.__proto__ = e;
  }
  var D = n(8);
  var L = n.n(D);
  var R = function (t) {
    function e(e) {
      var n;
      (n = t.call(this) || this).post = e;
      return n;
    }
    W(e, t);
    var n = e.prototype;
    n.view = function () {
      var t = this;
      return m("button", {
        class: "Button PostQuoteButton",
        onclick: function () {
          E(t.post, t.content);
        }
      }, j()("fas fa-quote-left", {
        className: "Button-icon"
      }), app.translator.trans("flarum-mentions.forum.post.quote_button"));
    };
    n.show = function (t, e) {
      var n = this.$().show();
      var o = n.offsetParent().offset();
      n.css("left", t - o.left).css("top", e - o.top);
      this.hideHandler = this.hide.bind(this);
      $(document).on("mouseup", this.hideHandler);
    };
    n.showStart = function (t, e) {
      var n = this.$();
      this.show(t, $(window).scrollTop() + e - n.outerHeight() - 5);
    };
    n.showEnd = function (t, e) {
      var n = this.$();
      this.show(t - n.outerWidth(), $(window).scrollTop() + e + 5);
    };
    n.hide = function () {
      this.$().hide();
      $(document).off("mouseup", this.hideHandler);
    };
    return e;
  }(L.a);
  function U() {
    Object(o.extend)(p.a.prototype, "oncreate", function () {
      var t = this.attrs.post;
      if (!t.isHidden() && (!app.session.user || !!t.discussion().canReply())) {
        var e = this.$(".Post-body");
        var n = $("<div class=\"Post-quoteButtonContainer\"></div>");
        var o = new R(t);
        function r(t) {
          setTimeout(function () {
            var r = function (t) {
              var e = window.getSelection();
              if (e.rangeCount) {
                var n = e.getRangeAt(0);
                var o = n.commonAncestorContainer;
                if (t[0] === o || $.contains(t[0], o)) {
                  var r = $("<div>").append(n.cloneContents());
                  r.find("img.emoji").replaceWith(function () {
                    return this.alt;
                  });
                  r.find("img").replaceWith(function () {
                    return "![](" + this.src + ")";
                  });
                  r.find("a").replaceWith(function () {
                    return "[" + this.innerText + "](" + this.href + ")";
                  });
                  return r.text();
                }
              }
              return "";
            }(e);
            if (r) {
              o.content = r;
              m.render(n[0], o.render());
              var i = window.getSelection().getRangeAt(0).getClientRects();
              var s = i[0];
              if (t.clientY < s.bottom && t.clientX - s.right < s.left - t.clientX) {
                o.showStart(s.left, s.top);
              } else {
                var a = i[i.length - 1];
                o.showEnd(a.right, a.bottom);
              }
            }
          }, 1);
        }
        this.$().after(n).on("mouseup", r);
        if ("ontouchstart" in window) {
          document.addEventListener("selectionchange", r, false);
        }
      }
    });
  }
  var q = n(10);
  var J = n.n(q);
  var z = n(21);
  var F = n.n(z);
  var X = n(22);
  var Y = n.n(X);
  var G = n(23);
  var K = n.n(G);
  var Q = n(24);
  var V = n.n(Q);
  var Z = n(25);
  var tt = n.n(Z);
  function et(t) {
    if (t === undefined) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return t;
  }
  function nt(t, e, n) {
    if (e in t) {
      Object.defineProperty(t, e, {
        value: n,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      t[e] = n;
    }
    return t;
  }
  var ot = function (t) {
    function e() {
      var e;
      for (var n = arguments.length, o = new Array(n), r = 0; r < n; r++) {
        o[r] = arguments[r];
      }
      nt(et(et(e = t.call.apply(t, [this].concat(o)) || this)), "items", []);
      nt(et(et(e)), "active", false);
      nt(et(et(e)), "index", 0);
      nt(et(et(e)), "keyWasJustPressed", false);
      return e;
    }
    W(e, t);
    var n = e.prototype;
    n.view = function () {
      return m("ul", {
        className: "Dropdown-menu MentionsDropdown"
      }, this.items.map(function (t) {
        return m("li", null, t);
      }));
    };
    n.show = function (t, e) {
      this.$().show().css({
        left: t + "px",
        top: e + "px"
      });
      this.active = true;
    };
    n.hide = function () {
      this.$().hide();
      this.active = false;
    };
    n.navigate = function (t) {
      var e = this;
      this.keyWasJustPressed = true;
      this.setIndex(this.index + t, true);
      clearTimeout(this.keyWasJustPressedTimeout);
      this.keyWasJustPressedTimeout = setTimeout(function () {
        return e.keyWasJustPressed = false;
      }, 500);
    };
    n.complete = function () {
      this.$("li").eq(this.index).find("button").click();
    };
    n.setIndex = function (t, e) {
      if (!this.keyWasJustPressed || e) {
        var n = this.$();
        var o = n.find("li");
        var r = t;
        if (r < 0) {
          r = o.length - 1;
        } else if (r >= o.length) {
          r = 0;
        }
        this.index = r;
        var i = o.removeClass("active").eq(r).addClass("active");
        if (e) {
          var s;
          var a = n.scrollTop();
          var u = n.offset().top;
          var c = u + n.outerHeight();
          var p = i.offset().top;
          var f = p + i.outerHeight();
          if (p < u) {
            s = a - u + p - parseInt(n.css("padding-top"), 10);
          } else if (f > c) {
            s = a - c + f + parseInt(n.css("padding-bottom"), 10);
          }
          if (s !== undefined) {
            n.stop(true).animate({
              scrollTop: s
            }, 100);
          }
        }
      }
    };
    return e;
  }(L.a);
  function rt() {
    var t = $("<div class=\"ComposerBody-mentionsDropdownContainer\"></div>");
    var e = new ot();
    Object(o.extend)(J.a.prototype, "oncreate", function (n) {
      var o = this.$(".TextEditor-editor").wrap("<div class=\"ComposerBody-mentionsWrapper\"></div>");
      this.navigator = new tt.a();
      this.navigator.when(function () {
        return e.active;
      }).onUp(function () {
        return e.navigate(-1);
      }).onDown(function () {
        return e.navigate(1);
      }).onSelect(e.complete.bind(e)).onCancel(e.hide.bind(e)).bindTo(o);
      o.after(t);
    });
    Object(o.extend)(J.a.prototype, "buildEditorParams", function (n) {
      var o;
      var r;
      var i;
      var s;
      var a;
      var c = [];
      var p = Array.from(app.store.all("users"));
      var f = new Set(p.map(function (t) {
        return t.id();
      }));
      n.inputListeners.push(function (n) {
        var l = app.composer.editor.getSelectionRange();
        var d = l[0];
        if (!(l[1] - d > 0)) {
          var h = app.composer.editor.getLastNChars(30);
          r = 0;
          for (var v = h.length - 1; v >= 0; v--) {
            if (h.substr(v, 1) === "@" && (v == 0 || /\s/.test(h.substr(v - 1, 1)))) {
              o = v + 1;
              r = d - h.length + v + 1;
              break;
            }
          }
          e.hide();
          e.active = false;
          if (r) {
            i = h.substring(o).toLowerCase();
            s = i.match(/^["|“]((?:(?!"#).)+)$/);
            i = s && s[1] || i;
            function b(t, n, o, s = "") {
              var a = _()(t);
              if (i) {
                a.children = [V()(a.text, i)];
                delete a.text;
              }
              return m("button", {
                className: "PostPreview " + s,
                onclick: function () {
                  return function (t) {
                    app.composer.editor.replaceBeforeCursor(r - 1, t + " ");
                    e.hide();
                  }(n);
                },
                onmouseenter: function () {
                  e.setIndex($(this).parent().index());
                }
              }, m("span", {
                className: "PostPreview-content"
              }, K()(t), a, " ", " ", o));
            }
            function y(t) {
              return [t.username(), t.displayName()].some(function (t) {
                return t.toLowerCase().substr(0, i.length) === i;
              });
            }
            function g() {
              var n = [];
              if (i) {
                p.forEach(function (t) {
                  if (y(t)) {
                    n.push(b(t, "@\"" + N(t) + "\"#" + t.id(), "", "MentionsDropdown-user"));
                  }
                });
              }
              if (app.composer.bodyMatches(Y.a) || app.composer.bodyMatches(S.a)) {
                var o = app.composer.body.attrs;
                var s = o.post;
                var a = s && s.discussion() || o.discussion;
                if (a) {
                  a.posts().filter(function (t) {
                    return t && t.contentType() === "comment" && (!s || t.number() < s.number());
                  }).sort(function (t, e) {
                    return e.createdAt() - t.createdAt();
                  }).filter(function (t) {
                    var e = t.user();
                    return e && y(e);
                  }).splice(0, 5).forEach(function (t) {
                    var e = t.user();
                    n.push(b(e, "@\"" + N(e) + "\"#p" + t.id(), [app.translator.trans("flarum-mentions.forum.composer.reply_to_post_text", {
                      number: t.number()
                    }), " — ", Object(u.truncate)(t.contentPlain(), 200)], "MentionsDropdown-post"));
                  });
                }
              }
              if (n.length) {
                e.items = n;
                m.render(t[0], e.render());
                e.show();
                var c = app.composer.editor.getCaretCoordinates(r);
                var f = e.$().outerWidth();
                var l = e.$().outerHeight();
                var d = e.$().offsetParent();
                var h = c.left;
                var v = c.top + 15;
                if (v + l > d.height()) {
                  v = c.top - l - 15;
                }
                if (h + f > d.width()) {
                  h = d.width() - f;
                }
                v = Math.max(-(d.offset().top - $(document).scrollTop()), v);
                h = Math.max(-d.offset().left, h);
                e.show(h, v);
              } else {
                e.active = false;
                e.hide();
              }
            }
            e.active = true;
            g();
            e.setIndex(0);
            e.$().scrollTop(0);
            clearTimeout(a);
            if (i.length > 1) {
              a = setTimeout(function () {
                var t = i.toLowerCase();
                if (c.indexOf(t) === -1) {
                  app.store.find("users", {
                    filter: {
                      q: i
                    },
                    page: {
                      limit: 5
                    }
                  }).then(function (t) {
                    t.forEach(function (t) {
                      if (!f.has(t.id())) {
                        f.add(t.id());
                        p.push(t);
                      }
                    });
                    if (e.active) {
                      g();
                    }
                  });
                  c.push(t);
                }
              }, 250);
            }
          }
        }
      });
    });
    Object(o.extend)(J.a.prototype, "toolbarItems", function (t) {
      var e = this;
      t.add("mention", m(F.a, {
        onclick: function () {
          return e.attrs.composer.editor.insertAtCursor(" @");
        },
        icon: "fas fa-at"
      }, app.translator.trans("flarum-mentions.forum.composer.mention_tooltip")));
    });
  }
  var it = n(9);
  var st = n.n(it);
  var at = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    W(e, t);
    var n = e.prototype;
    n.icon = function () {
      return "fas fa-reply";
    };
    n.href = function () {
      var t = this.attrs.notification;
      var e = t.subject();
      var n = t.content();
      return app.route.discussion(e.discussion(), n && n.replyNumber);
    };
    n.content = function () {
      var t = this.attrs.notification.fromUser();
      return app.translator.trans("flarum-mentions.forum.notifications.post_mentioned_text", {
        user: t,
        count: 1
      });
    };
    n.excerpt = function () {
      return Object(u.truncate)(this.attrs.notification.subject().contentPlain(), 200);
    };
    return e;
  }(st.a);
  var ut = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    W(e, t);
    var n = e.prototype;
    n.icon = function () {
      return "fas fa-at";
    };
    n.href = function () {
      var t = this.attrs.notification.subject();
      return app.route.discussion(t.discussion(), t.number());
    };
    n.content = function () {
      var t = this.attrs.notification.fromUser();
      return app.translator.trans("flarum-mentions.forum.notifications.user_mentioned_text", {
        user: t
      });
    };
    n.excerpt = function () {
      return Object(u.truncate)(this.attrs.notification.subject().contentPlain(), 200);
    };
    return e;
  }(st.a);
  var ct = n(26);
  var pt = n.n(ct);
  var ft = n(27);
  var lt = n.n(ft);
  var mt = n(28);
  var dt = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    W(e, t);
    e.prototype.loadResults = function (t) {
      return app.store.find("posts", {
        filter: {
          type: "comment",
          mentioned: this.user.id()
        },
        page: {
          offset: t,
          limit: this.loadLimit
        },
        sort: "-createdAt"
      });
    };
    return e;
  }(n.n(mt).a);
  var ht = n(11);
  var vt = n.n(ht);
  function bt(t) {
    var e;
    if (app.forum.attribute("allowUsernameMentionFormat") && t.hasAttribute("username")) {
      e = app.store.getBy("users", "username", t.getAttribute("username"));
    } else if (t.hasAttribute("id")) {
      e = app.store.getById("users", t.getAttribute("id"));
    }
    if (e) {
      t.setAttribute("id", e.id());
      t.setAttribute("slug", e.slug());
      t.setAttribute("displayname", vt()(_()(e)));
      return true;
    }
    t.invalidate();
  }
  function yt(t) {
    var e = app.store.getById("posts", t.getAttribute("id"));
    if (e) {
      t.setAttribute("discussionid", e.discussion().id());
      t.setAttribute("number", e.number());
      t.setAttribute("displayname", vt()(_()(e.user())));
      return true;
    }
  }
  i.a.initializers.add("flarum-mentions", function () {
    (function () {
      function t() {
        var t = this.attrs.post.contentHtml();
        if (t !== this.oldPostContentHtml && !this.isEditing()) {
          this.oldPostContentHtml = t;
          var e = this.attrs.post;
          var n = this.$();
          this.$().on("click", ".UserMention:not(.UserMention--deleted), .PostMention:not(.PostMention--deleted)", function (t) {
            m.route.set(this.getAttribute("href"));
            t.preventDefault();
          });
          this.$(".PostMention:not(.PostMention--deleted)").each(function () {
            var t;
            var o = $(this);
            var r = o.data("id");
            var i = $("<ul class=\"Dropdown-menu PostMention-preview fade\"/>");
            n.append(i);
            function s() {
              return $(".PostStream-item[data-id=\"" + r + "\"]");
            }
            function a() {
              var t = s();
              var a = false;
              if (t.length) {
                var u = t.offset().top;
                var c = window.pageYOffset;
                if (u > c && u + t.height() < c + $(window).height()) {
                  t.addClass("pulsate");
                  a = true;
                }
              }
              if (!a) {
                function p() {
                  var t = i.outerHeight(true);
                  var e = 0;
                  if (o.offset().top - t < $(window).scrollTop() + $("#header").outerHeight()) {
                    e += o.outerHeight(true);
                  } else {
                    e -= t;
                  }
                  i.show().css("top", o.offset().top - n.offset().top + e).css("left", o.offsetParent().offset().left - n.offset().left).css("max-width", o.offsetParent().width());
                }
                function f(t) {
                  var n = t.discussion();
                  m.render(i[0], [n !== e.discussion() ? m("li", null, m("span", {
                    className: "PostMention-preview-discussion"
                  }, n.title())) : "", m("li", null, l.a.component({
                    post: t
                  }))]);
                  p();
                }
                var d = app.store.getById("posts", r);
                if (d && d.discussion()) {
                  f(d);
                } else {
                  m.render(i[0], h.a.component());
                  app.store.find("posts", r).then(f);
                  p();
                }
                setTimeout(function () {
                  return i.off("transitionend").addClass("in");
                });
              }
            }
            function u() {
              s().removeClass("pulsate");
              if (i.hasClass("in")) {
                i.removeClass("in").one("transitionend", function () {
                  return i.hide();
                });
              }
            }
            o.on("touchend", function (t) {
              if (t.cancelable) {
                t.preventDefault();
              }
            });
            o.add(i).hover(function () {
              clearTimeout(t);
              t = setTimeout(a, 250);
            }, function () {
              clearTimeout(t);
              s().removeClass("pulsate");
              t = setTimeout(u, 250);
            }).on("touchend", function (t) {
              a();
              t.stopPropagation();
            });
            $(document).on("touchend", u);
          });
        }
      }
      Object(o.extend)(p.a.prototype, "oncreate", t);
      Object(o.extend)(p.a.prototype, "onupdate", t);
    })();
    (function () {
      function t() {
        this.$(".Post-mentionedBy-preview").removeClass("in").one("transitionend", function () {
          $(this).hide();
        });
      }
      g.a.prototype.mentionedBy = b.a.hasMany("mentionedBy");
      Object(o.extend)(p.a.prototype, "oncreate", function () {
        var e;
        var n = this;
        var o = this.attrs.post.mentionedBy();
        if (o && o.length) {
          var r = $("<ul class=\"Dropdown-menu Post-mentionedBy-preview fade\"/>");
          this.$().append(r);
          var i = this.$();
          var s = this.$(".Post-mentionedBy");
          function a() {
            if (!!r.hasClass("in") || !r.is(":visible")) {
              m.render(r[0], o.map(function (e) {
                return m("li", {
                  "data-number": e.number()
                }, l.a.component({
                  post: e,
                  onclick: t.bind(n)
                }));
              }));
              r.show().css("top", s.offset().top - i.offset().top + s.outerHeight(true)).css("left", s.offsetParent().offset().left - i.offset().left).css("max-width", i.width());
              setTimeout(function () {
                return r.off("transitionend").addClass("in");
              });
            }
          }
          s.add(r).hover(function () {
            clearTimeout(e);
            e = setTimeout(a, 250);
          }, function () {
            clearTimeout(e);
            e = setTimeout(t, 250);
          });
          this.$().find(".Post-mentionedBy-summary a").hover(function () {
            r.find("[data-number=\"" + $(this).data("number") + "\"]").addClass("active");
          }, function () {
            r.find("[data-number]").removeClass("active");
          });
        }
      });
      Object(o.extend)(p.a.prototype, "footerItems", function (e) {
        var n = this;
        var o = this.attrs.post.mentionedBy();
        if (o && o.length) {
          var r = [];
          var i = o.sort(function (t) {
            if (t.user() === app.session.user) {
              return -1;
            } else {
              return 0;
            }
          }).filter(function (t) {
            var e = t.user();
            if (r.indexOf(e) === -1) {
              r.push(e);
              return true;
            }
          });
          var s = i.length > 4;
          var a = i.slice(0, s ? 3 : 4).map(function (e) {
            var o = e.user();
            return m(w.a, {
              href: app.route.post(e),
              onclick: t.bind(n),
              "data-number": e.number()
            }, app.session.user === o ? app.translator.trans("flarum-mentions.forum.post.you_text") : _()(o));
          });
          if (s) {
            var u = i.length - a.length;
            a.push(app.translator.trans("flarum-mentions.forum.post.others_text", {
              count: u
            }));
          }
          e.add("replies", m("div", {
            className: "Post-mentionedBy"
          }, m("span", {
            className: "Post-mentionedBy-summary"
          }, j()("fas fa-reply"), app.translator.trans("flarum-mentions.forum.post.mentioned_by" + (i[0].user() === app.session.user ? "_self" : "") + "_text", {
            count: a.length,
            users: C()(a)
          }))));
        }
      });
    })();
    Object(o.extend)(p.a.prototype, "actionItems", function (t) {
      var e = this.attrs.post;
      if (!e.isHidden() && (!app.session.user || !!e.discussion().canReply())) {
        t.add("reply", m(O.a, {
          className: "Button Button--link",
          onclick: function () {
            return E(e);
          }
        }, app.translator.trans("flarum-mentions.forum.post.reply_link")));
      }
    });
    U();
    rt();
    i.a.notificationComponents.postMentioned = at;
    i.a.notificationComponents.userMentioned = ut;
    Object(o.extend)(a.a.prototype, "notificationTypes", function (t) {
      t.add("postMentioned", {
        name: "postMentioned",
        icon: "fas fa-reply",
        label: i.a.translator.trans("flarum-mentions.forum.settings.notify_post_mentioned_label")
      });
      t.add("userMentioned", {
        name: "userMentioned",
        icon: "fas fa-at",
        label: i.a.translator.trans("flarum-mentions.forum.settings.notify_user_mentioned_label")
      });
    });
    i.a.routes["user.mentions"] = {
      path: "/u/:username/mentions",
      component: dt
    };
    Object(o.extend)(pt.a.prototype, "navItems", function (t) {
      var e = this.user;
      t.add("mentions", lt.a.component({
        href: i.a.route("user.mentions", {
          username: e.slug()
        }),
        name: "mentions",
        icon: "fas fa-at"
      }, i.a.translator.trans("flarum-mentions.forum.user.mentions_link")), 80);
    });
    u.getPlainContent.removeSelectors.push("a.PostMention");
  });
}]);
flarum.extensions["flarum-mentions"] = module.exports;
var module = {};
module.exports = function (t) {
  var e = {};
  function o(n) {
    if (e[n]) {
      return e[n].exports;
    }
    var r = e[n] = {
      i: n,
      l: false,
      exports: {}
    };
    t[n].call(r.exports, r, r.exports, o);
    r.l = true;
    return r.exports;
  }
  o.m = t;
  o.c = e;
  o.d = function (t, e, n) {
    if (!o.o(t, e)) {
      Object.defineProperty(t, e, {
        enumerable: true,
        get: n
      });
    }
  };
  o.r = function (t) {
    if (typeof Symbol != "undefined" && Symbol.toStringTag) {
      Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(t, "__esModule", {
      value: true
    });
  };
  o.t = function (t, e) {
    if (e & 1) {
      t = o(t);
    }
    if (e & 8) {
      return t;
    }
    if (e & 4 && typeof t == "object" && t && t.__esModule) {
      return t;
    }
    var n = Object.create(null);
    o.r(n);
    Object.defineProperty(n, "default", {
      enumerable: true,
      value: t
    });
    if (e & 2 && typeof t != "string") {
      for (var r in t) {
        o.d(n, r, function (e) {
          return t[e];
        }.bind(null, r));
      }
    }
    return n;
  };
  o.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    o.d(e, "a", e);
    return e;
  };
  o.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  };
  o.p = "";
  return o(o.s = 7);
}([function (t, e) {
  t.exports = flarum.core.compat["common/Component"];
}, function (t, e) {
  t.exports = flarum.core.compat.extend;
}, function (t, e) {
  t.exports = flarum.core.compat["common/components/TextEditor"];
}, function (t, e) {
  t.exports = flarum.core.compat["common/utils/BasicEditorDriver"];
}, function (t, e) {
  t.exports = flarum.core.compat["common/utils/styleSelectedText"];
}, function (t, e) {
  t.exports = flarum.core.compat["common/helpers/icon"];
}, function (t, e) {
  t.exports = flarum.core.compat["common/components/Tooltip"];
}, function (t, e, o) {
  "use strict";

  o.r(e);
  var n = o(1);
  var r = o(2);
  var i = o.n(r);
  var c = o(3);
  var a = o.n(c);
  var l = o(4);
  var u = o.n(l);
  function f(t, e) {
    return (f = Object.setPrototypeOf || function (t, e) {
      t.__proto__ = e;
      return t;
    })(t, e);
  }
  function s(t, e) {
    t.prototype = Object.create(e.prototype);
    t.prototype.constructor = t;
    f(t, e);
  }
  var p = o(0);
  var d = o.n(p);
  var x = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    s(e, t);
    e.prototype.view = function (t) {
      return m("div", {
        class: "MarkdownToolbar"
      }, t.children);
    };
    return e;
  }(d.a);
  var y = o(5);
  var h = o.n(y);
  var b = o(6);
  var k = o.n(b);
  var v = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    s(e, t);
    var o = e.prototype;
    o.oncreate = function (e) {
      t.prototype.oncreate.call(this, e);
    };
    o.view = function () {
      var t = m("button", {
        className: "Button Button--icon Button--link",
        type: "button",
        "data-hotkey": this.attrs.hotkey,
        onkeydown: this.keydown.bind(this),
        onclick: this.attrs.onclick
      }, h()(this.attrs.icon));
      if (this.attrs.title) {
        return m(k.a, {
          text: this.attrs.title
        }, t);
      } else {
        return t;
      }
    };
    o.keydown = function (t) {
      if (t.key === " " || t.key === "Enter") {
        t.preventDefault();
        this.element.click();
      }
    };
    return e;
  }(d.a);
  var _ = navigator.userAgent.match(/Macintosh/) ? "⌘" : "ctrl";
  var g = {
    header: {
      prefix: "### "
    },
    bold: {
      prefix: "**",
      suffix: "**",
      trimFirst: true
    },
    italic: {
      prefix: "_",
      suffix: "_",
      trimFirst: true
    },
    quote: {
      prefix: "> ",
      multiline: true,
      surroundWithNewlines: true
    },
    code: {
      prefix: "`",
      suffix: "`",
      blockPrefix: "```",
      blockSuffix: "```"
    },
    link: {
      prefix: "[",
      suffix: "](https://)",
      replaceNext: "https://",
      scanFor: "https?://"
    },
    image: {
      prefix: "![",
      suffix: "](https://)",
      replaceNext: "https://",
      scanFor: "https?://"
    },
    unordered_list: {
      prefix: "- ",
      multiline: true,
      surroundWithNewlines: true
    },
    ordered_list: {
      prefix: "1. ",
      multiline: true,
      orderedList: true
    }
  };
  function w(t) {
    u()(app.composer.editor.el, g[t]);
  }
  function O(t, e) {
    return function (o) {
      if (o.key === e && (o.metaKey && _ === "⌘" || o.ctrlKey && _ === "ctrl")) {
        w(t);
      }
    };
  }
  app.initializers.add("flarum-markdown", function (t) {
    Object(n.extend)(a.a.prototype, "keyHandlers", function (t) {
      t.add("bold", O("bold", "b"));
      t.add("italic", O("italic", "i"));
    });
    Object(n.extend)(i.a.prototype, "toolbarItems", function (e) {
      function o(e, o) {
        return t.translator.trans("flarum-markdown.forum.composer." + e + "_tooltip") + (o ? " <" + _ + "-" + o + ">" : "");
      }
      function n(t) {
        return function () {
          return w(t);
        };
      }
      e.add("markdown", m(x, {
        for: this.textareaId,
        setShortcutHandler: function (t) {
          return shortcutHandler = t;
        }
      }, m(v, {
        title: o("header"),
        icon: "fas fa-heading",
        onclick: n("header")
      }), m(v, {
        title: o("bold", "b"),
        icon: "fas fa-bold",
        onclick: n("bold")
      }), m(v, {
        title: o("italic", "i"),
        icon: "fas fa-italic",
        onclick: n("italic")
      }), m(v, {
        title: o("quote"),
        icon: "fas fa-quote-left",
        onclick: n("quote")
      }), m(v, {
        title: o("code"),
        icon: "fas fa-code",
        onclick: n("code")
      }), m(v, {
        title: o("link"),
        icon: "fas fa-link",
        onclick: n("link")
      }), m(v, {
        title: o("image"),
        icon: "fas fa-image",
        onclick: n("image")
      }), m(v, {
        title: o("unordered_list"),
        icon: "fas fa-list-ul",
        onclick: n("unordered_list")
      }), m(v, {
        title: o("ordered_list"),
        icon: "fas fa-list-ol",
        onclick: n("ordered_list")
      })), 100);
    });
  });
}]);
flarum.extensions["flarum-markdown"] = module.exports;
var module = {};
module.exports = function (o) {
  var t = {};
  function n(e) {
    if (t[e]) {
      return t[e].exports;
    }
    var r = t[e] = {
      i: e,
      l: false,
      exports: {}
    };
    o[e].call(r.exports, r, r.exports, n);
    r.l = true;
    return r.exports;
  }
  n.m = o;
  n.c = t;
  n.d = function (o, t, e) {
    if (!n.o(o, t)) {
      Object.defineProperty(o, t, {
        enumerable: true,
        get: e
      });
    }
  };
  n.r = function (o) {
    if (typeof Symbol != "undefined" && Symbol.toStringTag) {
      Object.defineProperty(o, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(o, "__esModule", {
      value: true
    });
  };
  n.t = function (o, t) {
    if (t & 1) {
      o = n(o);
    }
    if (t & 8) {
      return o;
    }
    if (t & 4 && typeof o == "object" && o && o.__esModule) {
      return o;
    }
    var e = Object.create(null);
    n.r(e);
    Object.defineProperty(e, "default", {
      enumerable: true,
      value: o
    });
    if (t & 2 && typeof o != "string") {
      for (var r in o) {
        n.d(e, r, function (t) {
          return o[t];
        }.bind(null, r));
      }
    }
    return e;
  };
  n.n = function (o) {
    var t = o && o.__esModule ? function () {
      return o.default;
    } : function () {
      return o;
    };
    n.d(t, "a", t);
    return t;
  };
  n.o = function (o, t) {
    return Object.prototype.hasOwnProperty.call(o, t);
  };
  n.p = "";
  return n(n.s = 11);
}([function (o, t) {
  o.exports = flarum.core.compat.app;
}, function (o, t) {
  o.exports = flarum.core.compat.extend;
}, function (o, t) {
  o.exports = flarum.core.compat["models/Discussion"];
}, function (o, t) {
  o.exports = flarum.core.compat.Model;
}, function (o, t) {
  o.exports = flarum.core.compat["utils/DiscussionControls"];
}, function (o, t) {
  o.exports = flarum.core.compat["components/NotificationGrid"];
}, function (o, t) {
  o.exports = flarum.core.compat["components/EventPost"];
}, function (o, t) {
  o.exports = flarum.core.compat["components/Notification"];
}, function (o, t) {
  o.exports = flarum.core.compat["components/Badge"];
}, function (o, t) {
  o.exports = flarum.core.compat["components/DiscussionPage"];
}, function (o, t) {
  o.exports = flarum.core.compat["components/Button"];
}, function (o, t, n) {
  "use strict";

  n.r(t);
  var e = n(1);
  var r = n(0);
  var c = n.n(r);
  var i = n(3);
  var a = n.n(i);
  var s = n(2);
  var u = n.n(s);
  var f = n(5);
  var p = n.n(f);
  function l(o, t) {
    o.prototype = Object.create(t.prototype);
    o.prototype.constructor = o;
    o.__proto__ = t;
  }
  var d = n(6);
  var k = function (o) {
    function t() {
      return o.apply(this, arguments) || this;
    }
    l(t, o);
    var n = t.prototype;
    n.icon = function () {
      if (this.attrs.post.content().locked) {
        return "fas fa-lock";
      } else {
        return "fas fa-unlock";
      }
    };
    n.descriptionKey = function () {
      if (this.attrs.post.content().locked) {
        return "flarum-lock.forum.post_stream.discussion_locked_text";
      } else {
        return "flarum-lock.forum.post_stream.discussion_unlocked_text";
      }
    };
    return t;
  }(n.n(d).a);
  var b = n(7);
  var y = function (o) {
    function t() {
      return o.apply(this, arguments) || this;
    }
    l(t, o);
    var n = t.prototype;
    n.icon = function () {
      return "fas fa-lock";
    };
    n.href = function () {
      var o = this.attrs.notification;
      return app.route.discussion(o.subject(), o.content().postNumber);
    };
    n.content = function () {
      return app.translator.trans("flarum-lock.forum.notifications.discussion_locked_text", {
        user: this.attrs.notification.fromUser()
      });
    };
    return t;
  }(n.n(b).a);
  var _ = n(8);
  var x = n.n(_);
  var h = n(4);
  var v = n.n(h);
  var L = n(9);
  var g = n.n(L);
  var j = n(10);
  var O = n.n(j);
  c.a.initializers.add("flarum-lock", function () {
    c.a.postComponents.discussionLocked = k;
    c.a.notificationComponents.discussionLocked = y;
    u.a.prototype.isLocked = a.a.attribute("isLocked");
    u.a.prototype.canLock = a.a.attribute("canLock");
    Object(e.extend)(u.a.prototype, "badges", function (o) {
      if (this.isLocked()) {
        o.add("locked", x.a.component({
          type: "locked",
          label: app.translator.trans("flarum-lock.forum.badge.locked_tooltip"),
          icon: "fas fa-lock"
        }));
      }
    });
    Object(e.extend)(v.a, "moderationControls", function (o, t) {
      if (t.canLock()) {
        o.add("lock", O.a.component({
          icon: "fas fa-lock",
          onclick: this.lockAction.bind(t)
        }, app.translator.trans(t.isLocked() ? "flarum-lock.forum.discussion_controls.unlock_button" : "flarum-lock.forum.discussion_controls.lock_button")));
      }
    });
    v.a.lockAction = function () {
      this.save({
        isLocked: !this.isLocked()
      }).then(function () {
        if (app.current.matches(g.a)) {
          app.current.get("stream").update();
        }
        m.redraw();
      });
    };
    Object(e.extend)(p.a.prototype, "notificationTypes", function (o) {
      o.add("discussionLocked", {
        name: "discussionLocked",
        icon: "fas fa-lock",
        label: c.a.translator.trans("flarum-lock.forum.settings.notify_discussion_locked_label")
      });
    });
  });
}]);
flarum.extensions["flarum-lock"] = module.exports;
var module = {};
module.exports = function (t) {
  var e = {};
  function o(n) {
    if (e[n]) {
      return e[n].exports;
    }
    var r = e[n] = {
      i: n,
      l: false,
      exports: {}
    };
    t[n].call(r.exports, r, r.exports, o);
    r.l = true;
    return r.exports;
  }
  o.m = t;
  o.c = e;
  o.d = function (t, e, n) {
    if (!o.o(t, e)) {
      Object.defineProperty(t, e, {
        enumerable: true,
        get: n
      });
    }
  };
  o.r = function (t) {
    if (typeof Symbol != "undefined" && Symbol.toStringTag) {
      Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(t, "__esModule", {
      value: true
    });
  };
  o.t = function (t, e) {
    if (e & 1) {
      t = o(t);
    }
    if (e & 8) {
      return t;
    }
    if (e & 4 && typeof t == "object" && t && t.__esModule) {
      return t;
    }
    var n = Object.create(null);
    o.r(n);
    Object.defineProperty(n, "default", {
      enumerable: true,
      value: t
    });
    if (e & 2 && typeof t != "string") {
      for (var r in t) {
        o.d(n, r, function (e) {
          return t[e];
        }.bind(null, r));
      }
    }
    return n;
  };
  o.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    o.d(e, "a", e);
    return e;
  };
  o.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  };
  o.p = "";
  return o(o.s = 16);
}([function (t, e) {
  t.exports = flarum.core.compat.app;
}, function (t, e) {
  t.exports = flarum.core.compat.extend;
}, function (t, e) {
  t.exports = flarum.core.compat["components/CommentPost"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/Link"];
}, function (t, e) {
  t.exports = flarum.core.compat["helpers/username"];
}, function (t, e) {
  t.exports = flarum.core.compat["models/Post"];
}, function (t, e) {
  t.exports = flarum.core.compat.Model;
}, function (t, e) {
  t.exports = flarum.core.compat["components/NotificationGrid"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/Button"];
}, function (t, e) {
  t.exports = flarum.core.compat["helpers/punctuateSeries"];
}, function (t, e) {
  t.exports = flarum.core.compat["helpers/icon"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/Modal"];
}, function (t, e) {
  t.exports = flarum.core.compat["helpers/avatar"];
}, function (t, e) {
  t.exports = flarum.core.compat["components/Notification"];
}, function (t, e) {
  t.exports = flarum.core.compat["utils/string"];
},, function (t, e, o) {
  "use strict";

  o.r(e);
  var n = o(1);
  var r = o(0);
  var a = o.n(r);
  var s = o(5);
  var i = o.n(s);
  var u = o(6);
  var c = o.n(u);
  var l = o(7);
  var f = o.n(l);
  var p = o(8);
  var d = o.n(p);
  var k = o(2);
  var h = o.n(k);
  var y = o(3);
  var x = o.n(y);
  var b = o(9);
  var v = o.n(b);
  var _ = o(4);
  var j = o.n(_);
  var g = o(10);
  var O = o.n(g);
  function M(t, e) {
    t.prototype = Object.create(e.prototype);
    t.prototype.constructor = t;
    t.__proto__ = e;
  }
  var P = o(11);
  var L = o.n(P);
  var N = o(12);
  var S = o.n(N);
  var B = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    M(e, t);
    var o = e.prototype;
    o.className = function () {
      return "PostLikesModal Modal--small";
    };
    o.title = function () {
      return app.translator.trans("flarum-likes.forum.post_likes.title");
    };
    o.content = function () {
      return m("div", {
        className: "Modal-body"
      }, m("ul", {
        className: "PostLikesModal-list"
      }, this.attrs.post.likes().map(function (t) {
        return m("li", null, m(x.a, {
          href: app.route.user(t)
        }, S()(t), " ", " ", j()(t)));
      })));
    };
    return e;
  }(L.a);
  var T = o(13);
  var w = o.n(T);
  var C = o(14);
  var I = function (t) {
    function e() {
      return t.apply(this, arguments) || this;
    }
    M(e, t);
    var o = e.prototype;
    o.icon = function () {
      return "far fa-thumbs-up";
    };
    o.href = function () {
      return app.route.post(this.attrs.notification.subject());
    };
    o.content = function () {
      var t = this.attrs.notification.fromUser();
      return app.translator.trans("flarum-likes.forum.notifications.post_liked_text", {
        user: t,
        count: 1
      });
    };
    o.excerpt = function () {
      return Object(C.truncate)(this.attrs.notification.subject().contentPlain(), 200);
    };
    return e;
  }(w.a);
  a.a.initializers.add("flarum-likes", function () {
    a.a.notificationComponents.postLiked = I;
    i.a.prototype.canLike = c.a.attribute("canLike");
    i.a.prototype.likes = c.a.hasMany("likes");
    Object(n.extend)(h.a.prototype, "actionItems", function (t) {
      var e = this.attrs.post;
      if (!e.isHidden() && e.canLike()) {
        var o = e.likes();
        var n = a.a.session.user && o && o.some(function (t) {
          return t === a.a.session.user;
        });
        t.add("like", d.a.component({
          className: "Button Button--link",
          onclick: function () {
            n = !n;
            e.save({
              isLiked: n
            });
            var t = e.data.relationships.likes.data;
            t.some(function (e, o) {
              if (e.id === a.a.session.user.id()) {
                t.splice(o, 1);
                return true;
              }
            });
            if (n) {
              t.unshift({
                type: "users",
                id: a.a.session.user.id()
              });
            }
          }
        }, a.a.translator.trans(n ? "flarum-likes.forum.post.unlike_link" : "flarum-likes.forum.post.like_link")));
      }
    });
    Object(n.extend)(h.a.prototype, "footerItems", function (t) {
      var e = this.attrs.post;
      var o = e.likes();
      if (o && o.length) {
        var n = o.length > 4;
        var r = o.sort(function (t) {
          if (t === a.a.session.user) {
            return -1;
          } else {
            return 1;
          }
        }).slice(0, n ? 3 : 4).map(function (t) {
          return m(x.a, {
            href: a.a.route.user(t)
          }, t === a.a.session.user ? a.a.translator.trans("flarum-likes.forum.post.you_text") : j()(t));
        });
        if (n) {
          var s = o.length - r.length;
          r.push(m("a", {
            href: "#",
            onclick: function (t) {
              t.preventDefault();
              a.a.modal.show(B, {
                post: e
              });
            }
          }, a.a.translator.trans("flarum-likes.forum.post.others_link", {
            count: s
          })));
        }
        t.add("liked", m("div", {
          className: "Post-likedBy"
        }, O()("far fa-thumbs-up"), a.a.translator.trans("flarum-likes.forum.post.liked_by" + (o[0] === a.a.session.user ? "_self" : "") + "_text", {
          count: r.length,
          users: v()(r)
        })));
      }
    });
    Object(n.extend)(f.a.prototype, "notificationTypes", function (t) {
      t.add("postLiked", {
        name: "postLiked",
        icon: "far fa-thumbs-up",
        label: a.a.translator.trans("flarum-likes.forum.settings.notify_post_liked_label")
      });
    });
  });
}]);
flarum.extensions["flarum-likes"] = module.exports;
var module = {};
module.exports = function (e) {
  var d = {};
  function a(u) {
    if (d[u]) {
      return d[u].exports;
    }
    var o = d[u] = {
      i: u,
      l: false,
      exports: {}
    };
    e[u].call(o.exports, o, o.exports, a);
    o.l = true;
    return o.exports;
  }
  a.m = e;
  a.c = d;
  a.d = function (e, d, u) {
    if (!a.o(e, d)) {
      Object.defineProperty(e, d, {
        enumerable: true,
        get: u
      });
    }
  };
  a.r = function (e) {
    if (typeof Symbol != "undefined" && Symbol.toStringTag) {
      Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(e, "__esModule", {
      value: true
    });
  };
  a.t = function (e, d) {
    if (d & 1) {
      e = a(e);
    }
    if (d & 8) {
      return e;
    }
    if (d & 4 && typeof e == "object" && e && e.__esModule) {
      return e;
    }
    var u = Object.create(null);
    a.r(u);
    Object.defineProperty(u, "default", {
      enumerable: true,
      value: e
    });
    if (d & 2 && typeof e != "string") {
      for (var o in e) {
        a.d(u, o, function (d) {
          return e[d];
        }.bind(null, o));
      }
    }
    return u;
  };
  a.n = function (e) {
    var d = e && e.__esModule ? function () {
      return e.default;
    } : function () {
      return e;
    };
    a.d(d, "a", d);
    return d;
  };
  a.o = function (e, d) {
    return Object.prototype.hasOwnProperty.call(e, d);
  };
  a.p = "";
  return a(a.s = 9);
}([function (e, d) {
  e.exports = flarum.core.compat.extend;
}, function (e, d) {
  e.exports = flarum.core.compat["components/TextEditor"];
}, function (e) {
  e.exports = {
    "😀": ["gleeful"],
    "😃": ["glad", "smile"],
    "😄": ["happy"],
    "😁": ["blissful", "grin"],
    "😆": ["amused", "laugh", "lol"],
    "😅": ["embarassed", "sweat_smile"],
    "🤣": ["entertained", "rofl"],
    "😂": ["joyful", "haha"],
    "🙂": ["pleased", "slight_smile"],
    "🙃": ["ecstatic", "upside_down"],
    "😉": ["coy", "wink"],
    "😊": ["blush"],
    "😇": ["innocent", "halo"],
    "🥰": ["love"],
    "😍": ["lovestruck"],
    "🤩": ["starstruck"],
    "😘": ["flirty"],
    "😗": ["kiss"],
    "☺️": ["relaxed"],
    "😚": ["loving_kiss"],
    "😙": ["happy_kiss"],
    "🥲": ["tear_smile"],
    "😋": ["yum", "savour"],
    "😛": ["playful", "tongue_out"],
    "😜": ["mischievous"],
    "🤪": ["crazy"],
    "😝": ["facetious", "lmao"],
    "🤑": ["pretentious", "money_mouth"],
    "🤗": ["hugging"],
    "🤭": ["gasp"],
    "🤫": ["shushing"],
    "🤔": ["curious", "thinking"],
    "🤐": ["silenced", "zipper_mouth"],
    "🤨": ["contempt"],
    "😐️": ["indifferent", "neutral"],
    "😑": ["apathetic", "expressionless"],
    "😶": ["vacant", "no_mouth"],
    "😏": ["cocky", "smirk"],
    "😒": ["unamused"],
    "🙄": ["disbelief"],
    "😬": ["grimaced"],
    "🤥": ["lying"],
    "😌": ["relieved"],
    "😔": ["pensive"],
    "😪": ["sleepy"],
    "🤤": ["drooling"],
    "😴": ["exhausted", "sleeping"],
    "😷": ["ill", "mask"],
    "🤒": ["sick"],
    "🤕": ["injured"],
    "🤢": ["nauseated"],
    "🤮": ["vomiting"],
    "🤧": ["sneezing"],
    "🥵": ["overheating"],
    "🥶": ["freezing"],
    "🥴": ["woozy"],
    "😵": ["dizzy"],
    "🤯": ["shocked", "exploding_head"],
    "🤠": ["cowboy"],
    "🥳": ["partying", "celebrating"],
    "🥸": ["disguised_face"],
    "😎": ["confident"],
    "🤓": ["nerd"],
    "🧐": ["monocle"],
    "😕": ["confused"],
    "😟": ["worried"],
    "🙁": ["cheerless", "slight_frown"],
    "☹️": ["sad", "frowning"],
    "😮": ["surprised"],
    "😯": ["hushed"],
    "😲": ["astonished"],
    "😳": ["flushed"],
    "🥺": ["pleading"],
    "😦": ["bored"],
    "😧": ["anguished", "wtf"],
    "😨": ["fearful"],
    "😰": ["cold_sweat", "anxious", "frustrated"],
    "😥": ["hopeful"],
    "😢": ["upset", "cry"],
    "😭": ["distressed", "sob"],
    "😱": ["frightened", "scream"],
    "😖": ["confounded"],
    "😣": ["persevered"],
    "😞": ["disappointed"],
    "😓": ["shamed"],
    "😩": ["weary"],
    "😫": ["tired"],
    "🥱": ["yawn"],
    "😤": ["annoyed", "hrmph"],
    "😡": ["enraged", "pout"],
    "😠": ["angry"],
    "🤬": ["censored"],
    "😈": ["imp"],
    "👿": ["angry_imp"],
    "💀": ["skull"],
    "☠️": ["crossbones"],
    "💩": ["poop"],
    "🤡": ["clown"],
    "👹": ["ogre"],
    "👺": ["goblin"],
    "👻": ["ghost"],
    "👽️": ["alien"],
    "👾": ["alien_monster", "space_invader"],
    "🤖": ["robot"],
    "😺": ["smiling_cat"],
    "😸": ["grinning_cat"],
    "😹": ["joyful_cat"],
    "😻": ["lovestruck_cat"],
    "😼": ["smirking_cat"],
    "😽": ["kissing_cat"],
    "🙀": ["weary_cat"],
    "😿": ["crying_cat"],
    "😾": ["pouting_cat"],
    "🙈": ["see_no_evil"],
    "🙉": ["hear_no_evil"],
    "🙊": ["speak_no_evil"],
    "💋": ["kiss_lips"],
    "💌": ["love_letter"],
    "💘": ["cupid"],
    "💝": ["heart_ribbon"],
    "💖": ["sparkling_heart"],
    "💗": ["heartpulse"],
    "💓": ["heartbeat"],
    "💞": ["revolving_hearts"],
    "💕": ["two_hearts"],
    "💟": ["heart_decoration"],
    "❣️": ["heart_exclamation"],
    "💔": ["broken_heart"],
    "❤️": ["heart"],
    "🧡": ["orange_heart"],
    "💛": ["yellow_heart"],
    "💚": ["green_heart"],
    "💙": ["blue_heart"],
    "💜": ["purple_heart"],
    "🤎": ["brown_heart"],
    "🖤": ["black_heart"],
    "🤍": ["white_heart"],
    "💯": ["100"],
    "💢": ["anger"],
    "💥": ["boom", "collision"],
    "💫": ["dizzy_star"],
    "💦": ["sweat_drops"],
    "💨": ["dash"],
    "🕳️": ["hole"],
    "💣️": ["bomb"],
    "💬": ["speech"],
    "👁‍🗨": ["eye_bubble"],
    "🗨️": ["left_speech"],
    "🗯️": ["right_anger_speech"],
    "💭": ["thought"],
    "💤": ["zzz"],
    "👋": ["wave"],
    "🤚": ["raised_backhand"],
    "🖐️": ["splayed_hand"],
    "✋": ["raised_hand"],
    "🖖": ["vulcan"],
    "👌": ["ok_hand"],
    "🤌": ["pinched_fingers"],
    "🤏": ["pinch"],
    "✌️": ["victory"],
    "🤞": ["fingers_crossed"],
    "🤟": ["love_you_gesture"],
    "🤘": ["metal"],
    "🤙": ["call_me"],
    "👈️": ["point_left"],
    "👉️": ["point_right"],
    "👆️": ["backhand_point_up"],
    "🖕": ["middle_finger"],
    "👇️": ["point_down"],
    "☝️": ["point_up"],
    "👍️": ["thumbsup", "+1", "yes"],
    "👎️": ["thumbsdown", "-1", "no"],
    "✊": ["fist"],
    "👊": ["punch"],
    "🤛": ["left_facing_fist"],
    "🤜": ["right_facing_fist"],
    "👏": ["clap"],
    "🙌": ["raised_hands"],
    "👐": ["open_hands"],
    "🤲": ["palms_up"],
    "🤝": ["handshake"],
    "🙏": ["pray"],
    "✍️": ["writing_hand"],
    "💅": ["nail_care"],
    "🤳": ["selfie"],
    "💪": ["muscle", "right_bicep"],
    "🦾": ["mech_arm"],
    "🦿": ["mech_leg"],
    "🦵": ["leg"],
    "🦶": ["foot"],
    "👂️": ["ear"],
    "🦻": ["hearing_aid"],
    "👃": ["nose"],
    "🧠": ["brain"],
    "🫀": ["anatomical_heart"],
    "🫁": ["lungs"],
    "🦷": ["tooth"],
    "🦴": ["bone"],
    "👀": ["eyes"],
    "👁️": ["eye"],
    "👅": ["tongue"],
    "👄": ["lips"],
    "👶": ["baby"],
    "🧒": ["child"],
    "👦": ["boy"],
    "👧": ["girl"],
    "🧑": ["adult"],
    "👱": ["blond_person"],
    "👨": ["man"],
    "🧔": ["bearded_person"],
    "👨‍🦰": ["red_haired_man"],
    "👨‍🦱": ["curly_haired_man"],
    "👨‍🦳": ["white_haired_man"],
    "👨‍🦲": ["bald_man"],
    "👩": ["woman"],
    "👩‍🦰": ["red_haired_woman"],
    "🧑‍🦰": ["red_haired_person"],
    "👩‍🦱": ["curly_haired_woman"],
    "🧑‍🦱": ["curly_haired_person"],
    "👩‍🦳": ["white_haired_woman"],
    "🧑‍🦳": ["white_haired_person"],
    "👩‍🦲": ["bald_woman"],
    "🧑‍🦲": ["bald_person"],
    "👱‍♀️": ["blond_woman"],
    "👱‍♂️": ["blond_man"],
    "🧓": ["older_adult"],
    "👴": ["older_man"],
    "👵": ["older_woman"],
    "🙍": ["person_frowning"],
    "🙍‍♂️": ["man_frowning"],
    "🙍‍♀️": ["woman_frowning"],
    "🙎": ["person_pouting"],
    "🙎‍♂️": ["man_pouting"],
    "🙎‍♀️": ["woman_pouting"],
    "🙅": ["person_gesturing_no"],
    "🙅‍♂️": ["man_gesturing_no"],
    "🙅‍♀️": ["woman_gesturing_no"],
    "🙆": ["person_gesturing_ok"],
    "🙆‍♂️": ["man_gesturing_ok"],
    "🙆‍♀️": ["woman_gesturing_ok"],
    "💁": ["person_tipping_hand"],
    "💁‍♂️": ["man_tipping_hand"],
    "💁‍♀️": ["woman_tipping_hand"],
    "🙋": ["person_raising_hand"],
    "🙋‍♂️": ["man_raising_hand"],
    "🙋‍♀️": ["woman_raising_hand"],
    "🧏": ["person_deaf"],
    "🧏‍♂️": ["man_deaf"],
    "🧏‍♀️": ["woman_deaf"],
    "🙇": ["person_bowing"],
    "🙇‍♂️": ["man_bowing"],
    "🙇‍♀️": ["woman_bowing"],
    "🤦": ["person_facepalming"],
    "🤦‍♂️": ["man_facepalming"],
    "🤦‍♀️": ["woman_facepalming"],
    "🤷": ["person_shrugging"],
    "🤷‍♂️": ["man_shrugging"],
    "🤷‍♀️": ["woman_shrugging"],
    "🧑‍⚕️": ["person_health_worker"],
    "👨‍⚕️": ["man_health_worker"],
    "👩‍⚕️": ["woman_health_worker"],
    "🧑‍🎓": ["person_student"],
    "👨‍🎓": ["man_student"],
    "👩‍🎓": ["woman_student"],
    "🧑‍🏫": ["person_teacher"],
    "👨‍🏫": ["man_teacher"],
    "👩‍🏫": ["woman_teacher"],
    "🧑‍⚖️": ["person_judge"],
    "👨‍⚖️": ["man_judge"],
    "👩‍⚖️": ["woman_judge"],
    "🧑‍🌾": ["person_farmer"],
    "👨‍🌾": ["man_farmer"],
    "👩‍🌾": ["woman_farmer"],
    "🧑‍🍳": ["person_cook"],
    "👨‍🍳": ["man_cook"],
    "👩‍🍳": ["woman_cook"],
    "🧑‍🔧": ["person_mechanic"],
    "👨‍🔧": ["man_mechanic"],
    "👩‍🔧": ["woman_mechanic"],
    "🧑‍🏭": ["person_factory_worker"],
    "👨‍🏭": ["man_factory_worker"],
    "👩‍🏭": ["woman_factory_worker"],
    "🧑‍💼": ["person_office_worker"],
    "👨‍💼": ["man_office_worker"],
    "👩‍💼": ["woman_office_worker"],
    "🧑‍🔬": ["person_scientist"],
    "👨‍🔬": ["man_scientist"],
    "👩‍🔬": ["woman_scientist"],
    "🧑‍💻": ["person_technologist"],
    "👨‍💻": ["man_technologist"],
    "👩‍💻": ["woman_technologist"],
    "🧑‍🎤": ["person_singer"],
    "👨‍🎤": ["man_singer"],
    "👩‍🎤": ["woman_singer"],
    "🧑‍🎨": ["person_artist"],
    "👨‍🎨": ["man_artist"],
    "👩‍🎨": ["woman_artist"],
    "🧑‍✈️": ["person_pilot"],
    "👨‍✈️": ["man_pilot"],
    "👩‍✈️": ["woman_pilot"],
    "🧑‍🚀": ["person_astronaut"],
    "👨‍🚀": ["man_astronaut"],
    "👩‍🚀": ["woman_astronaut"],
    "🧑‍🚒": ["person_firefighter"],
    "👨‍🚒": ["man_firefighter"],
    "👩‍🚒": ["woman_firefighter"],
    "👮": ["police_officer"],
    "👮‍♂️": ["man_police_officer"],
    "👮‍♀️": ["woman_police_officer"],
    "🕵️": ["detective"],
    "🕵️‍♂️": ["man_detective"],
    "🕵️‍♀️": ["woman_detective"],
    "💂": ["guard"],
    "💂‍♂️": ["man_guard"],
    "💂‍♀️": ["woman_guard"],
    "🥷": ["ninja"],
    "👷": ["construction_worker"],
    "👷‍♂️": ["man_construction_worker"],
    "👷‍♀️": ["woman_construction_worker"],
    "🤴": ["prince"],
    "👸": ["princess"],
    "👳": ["person_turban"],
    "👳‍♂️": ["man_turban"],
    "👳‍♀️": ["woman_turban"],
    "👲": ["man_chinese_cap"],
    "🧕": ["woman_headscarf"],
    "🤵": ["man_tuxedo"],
    "🤵‍♂️": ["man_in_tuxedo"],
    "🤵‍♀️": ["woman_in_tuxedo"],
    "👰": ["person_veiled_bride", "bride_veil"],
    "👰‍♂️": ["man_veiled_bride"],
    "👰‍♀️": ["woman_veiled_bride"],
    "🤰": ["pregnant_woman"],
    "🤱": ["breast_feeding"],
    "👩‍🍼": ["woman_feeding_baby"],
    "👨‍🍼": ["man_feeding_baby"],
    "🧑‍🍼": ["person_feeding_baby"],
    "👼": ["baby_angel"],
    "🎅": ["santa"],
    "🤶": ["mrs_claus"],
    "🧑‍🎄": ["mx_claus"],
    "🦸": ["hero", "superhero"],
    "🦸‍♂️": ["man_hero"],
    "🦸‍♀️": ["woman_hero"],
    "🦹": ["villain", "supervillain"],
    "🦹‍♂️": ["man_villain"],
    "🦹‍♀️": ["woman_villain"],
    "🧙": ["mage"],
    "🧙‍♂️": ["man_mage"],
    "🧙‍♀️": ["woman_mage"],
    "🧚": ["fairy"],
    "🧚‍♂️": ["man_fairy"],
    "🧚‍♀️": ["woman_fairy"],
    "🧛": ["vampire"],
    "🧛‍♂️": ["man_vampire"],
    "🧛‍♀️": ["woman_vampire"],
    "🧜": ["merperson"],
    "🧜‍♂️": ["merman"],
    "🧜‍♀️": ["mermaid"],
    "🧝": ["elf"],
    "🧝‍♂️": ["man_elf"],
    "🧝‍♀️": ["woman_elf"],
    "🧞": ["genie"],
    "🧞‍♂️": ["man_genie"],
    "🧞‍♀️": ["woman_genie"],
    "🧟": ["zombie"],
    "🧟‍♂️": ["man_zombie"],
    "🧟‍♀️": ["woman_zombie"],
    "💆": ["person_getting_massage"],
    "💆‍♂️": ["man_getting_face_massage"],
    "💆‍♀️": ["woman_getting_face_massage"],
    "💇": ["person_getting_haircut"],
    "💇‍♂️": ["man_getting_haircut"],
    "💇‍♀️": ["woman_getting_haircut"],
    "🚶": ["person_walking"],
    "🚶‍♂️": ["man_walking"],
    "🚶‍♀️": ["woman_walking"],
    "🧍": ["person_standing"],
    "🧍‍♂️": ["man_standing"],
    "🧍‍♀️": ["woman_standing"],
    "🧎": ["person_kneeling"],
    "🧎‍♂️": ["man_kneeling"],
    "🧎‍♀️": ["woman_kneeling"],
    "🧑‍🦯": ["person_probing_cane"],
    "👨‍🦯": ["man_probing_cane"],
    "👩‍🦯": ["woman_probing_cane"],
    "🧑‍🦼": ["person_motor_wheelchair"],
    "👨‍🦼": ["man_motor_wheelchair"],
    "👩‍🦼": ["woman_motor_wheelchair"],
    "🧑‍🦽": ["person_wheelchair"],
    "👨‍🦽": ["man_wheelchair"],
    "👩‍🦽": ["woman_wheelchair"],
    "🏃": ["person_running"],
    "🏃‍♂️": ["man_running"],
    "🏃‍♀️": ["woman_running"],
    "💃": ["dancer", "woman_dancing"],
    "🕺": ["man_dancing"],
    "🕴️": ["levitate"],
    "👯": ["people_bunny_ears_partying"],
    "👯‍♂️": ["men_bunny_ears_partying"],
    "👯‍♀️": ["women_bunny_ears_partying"],
    "🧖": ["person_steamy_room"],
    "🧖‍♂️": ["man_steamy_room"],
    "🧖‍♀️": ["woman_steamy_room"],
    "🧗": ["person_climbing"],
    "🧗‍♂️": ["man_climbing"],
    "🧗‍♀️": ["woman_climbing"],
    "🤺": ["person_fencing"],
    "🏇": ["horse_racing"],
    "⛷️": ["skier"],
    "🏂️": ["snowboarder"],
    "🏌️": ["person_golfing"],
    "🏌️‍♂️": ["man_golfing"],
    "🏌️‍♀️": ["woman_golfing"],
    "🏄️": ["person_surfing"],
    "🏄‍♂️": ["man_surfing"],
    "🏄‍♀️": ["woman_surfing"],
    "🚣": ["person_rowing_boat"],
    "🚣‍♂️": ["man_rowing_boat"],
    "🚣‍♀️": ["woman_rowing_boat"],
    "🏊️": ["person_swimming"],
    "🏊‍♂️": ["man_swimming"],
    "🏊‍♀️": ["woman_swimming"],
    "⛹️": ["person_bouncing_ball"],
    "⛹️‍♂️": ["man_bouncing_ball"],
    "⛹️‍♀️": ["woman_bouncing_ball"],
    "🏋️": ["person_lifting_weights"],
    "🏋️‍♂️": ["man_lifting_weights"],
    "🏋️‍♀️": ["woman_lifting_weights"],
    "🚴": ["person_biking"],
    "🚴‍♂️": ["man_biking"],
    "🚴‍♀️": ["woman_biking"],
    "🚵": ["person_mountain_biking"],
    "🚵‍♂️": ["man_mountain_biking"],
    "🚵‍♀️": ["woman_mountain_biking"],
    "🤸": ["person_cartwheel"],
    "🤸‍♂️": ["man_cartwheeling"],
    "🤸‍♀️": ["woman_cartwheeling"],
    "🤼": ["people_wrestling"],
    "🤼‍♂️": ["men_wrestling"],
    "🤼‍♀️": ["women_wrestling"],
    "🤽": ["person_water_polo"],
    "🤽‍♂️": ["man_water_polo"],
    "🤽‍♀️": ["woman_water_polo"],
    "🤾": ["person_handball"],
    "🤾‍♂️": ["man_handball"],
    "🤾‍♀️": ["woman_handball"],
    "🤹": ["person_juggling"],
    "🤹‍♂️": ["man_juggling"],
    "🤹‍♀️": ["woman_juggling"],
    "🧘": ["person_lotus_position"],
    "🧘‍♂️": ["man_lotus_position"],
    "🧘‍♀️": ["woman_lotus_position"],
    "🛀": ["bath"],
    "🛌": ["in_bed"],
    "🧑‍🤝‍🧑": ["holding_hands_people"],
    "👭": ["holding_hands_ww"],
    "👫": ["holding_hands_mw", "holding_hands_wm"],
    "👬": ["holding_hands_mm"],
    "💏": ["couple"],
    "👩‍❤️‍💋‍👨": ["kiss_mw", "kiss_wm"],
    "👨‍❤️‍💋‍👨": ["kiss_mm"],
    "👩‍❤️‍💋‍👩": ["kiss_ww"],
    "💑": ["couple_heart"],
    "👩‍❤️‍👨": ["couple_mw", "couple_wm"],
    "👨‍❤️‍👨": ["couple_mm"],
    "👩‍❤️‍👩": ["couple_ww"],
    "👪️": ["family"],
    "👨‍👩‍👦": ["family_mwb"],
    "👨‍👩‍👧": ["family_mwg"],
    "👨‍👩‍👧‍👦": ["family_mwgb"],
    "👨‍👩‍👦‍👦": ["family_mwbb"],
    "👨‍👩‍👧‍👧": ["family_mwgg"],
    "👨‍👨‍👦": ["family_mmb"],
    "👨‍👨‍👧": ["family_mmg"],
    "👨‍👨‍👧‍👦": ["family_mmgb"],
    "👨‍👨‍👦‍👦": ["family_mmbb"],
    "👨‍👨‍👧‍👧": ["family_mmgg"],
    "👩‍👩‍👦": ["family_wwb"],
    "👩‍👩‍👧": ["family_wwg"],
    "👩‍👩‍👧‍👦": ["family_wwgb"],
    "👩‍👩‍👦‍👦": ["family_wwbb"],
    "👩‍👩‍👧‍👧": ["family_wwgg"],
    "👨‍👦": ["family_mb"],
    "👨‍👦‍👦": ["family_mbb"],
    "👨‍👧": ["family_mg"],
    "👨‍👧‍👦": ["family_mgb"],
    "👨‍👧‍👧": ["family_mgg"],
    "👩‍👦": ["family_wb"],
    "👩‍👦‍👦": ["family_wbb"],
    "👩‍👧": ["family_wg"],
    "👩‍👧‍👦": ["family_wgb"],
    "👩‍👧‍👧": ["family_wgg"],
    "🗣️": ["speaking_head"],
    "👤": ["bust_silhouette"],
    "👥": ["busts_silhouette"],
    "🫂": ["people_hugging"],
    "👣": ["footprints"],
    "🏻": ["tone_light", "tone1"],
    "🏼": ["tone_medium_light", "tone2"],
    "🏽": ["tone_medium", "tone3"],
    "🏾": ["tone_medium_dark", "tone4"],
    "🏿": ["tone_dark", "tone5"],
    "🦰": ["red_hair"],
    "🦱": ["curly_hair"],
    "🦳": ["white_hair"],
    "🦲": ["bald"],
    "🐵": ["monkey_face"],
    "🐒": ["monkey"],
    "🦍": ["gorilla"],
    "🦧": ["orangutan"],
    "🐶": ["dog_face"],
    "🐕️": ["dog"],
    "🦮": ["guide_dog"],
    "🐕‍🦺": ["service_dog"],
    "🐩": ["poodle"],
    "🐺": ["wolf_face"],
    "🦊": ["fox_face"],
    "🦝": ["raccoon"],
    "🐱": ["cat_face"],
    "🐈️": ["cat"],
    "🐈‍⬛": ["black_cat"],
    "🦁": ["lion_face"],
    "🐯": ["tiger_face"],
    "🐅": ["tiger"],
    "🐆": ["leopard"],
    "🐴": ["horse_face"],
    "🐎": ["horse"],
    "🦄": ["unicorn_face"],
    "🦓": ["zebra"],
    "🦌": ["deer"],
    "🦬": ["bison"],
    "🐮": ["cow_face"],
    "🐂": ["ox"],
    "🐃": ["water_buffalo"],
    "🐄": ["cow"],
    "🐷": ["pig_face"],
    "🐖": ["pig"],
    "🐗": ["boar"],
    "🐽": ["pig_nose"],
    "🐏": ["ram"],
    "🐑": ["sheep"],
    "🐐": ["goat"],
    "🐪": ["camel"],
    "🐫": ["two_hump_camel"],
    "🦙": ["llama"],
    "🦒": ["giraffe"],
    "🐘": ["elephant"],
    "🦣": ["mammoth"],
    "🦏": ["rhino"],
    "🦛": ["hippo"],
    "🐭": ["mouse_face"],
    "🐁": ["mouse"],
    "🐀": ["rat"],
    "🐹": ["hamster_face"],
    "🐰": ["rabbit_face"],
    "🐇": ["rabbit"],
    "🐿️": ["chipmunk"],
    "🦫": ["beaver"],
    "🦔": ["hedgehog"],
    "🦇": ["bat"],
    "🐻": ["bear_face"],
    "🐻‍❄️": ["polar_bear_face"],
    "🐨": ["koala_face"],
    "🐼": ["panda_face"],
    "🦥": ["sloth"],
    "🦦": ["otter"],
    "🦨": ["skunk"],
    "🦘": ["kangaroo"],
    "🦡": ["badger"],
    "🐾": ["feet"],
    "🦃": ["turkey"],
    "🐔": ["chicken"],
    "🐓": ["rooster"],
    "🐣": ["hatching_chick"],
    "🐤": ["baby_chick"],
    "🐥": ["hatched_chick"],
    "🐦️": ["bird"],
    "🐧": ["penguin"],
    "🕊️": ["dove"],
    "🦅": ["eagle"],
    "🦆": ["duck"],
    "🦢": ["swan"],
    "🦉": ["owl"],
    "🦤": ["dodo"],
    "🪶": ["feather"],
    "🦩": ["flamingo"],
    "🦚": ["peacock"],
    "🦜": ["parrot"],
    "🐸": ["frog_face"],
    "🐊": ["crocodile"],
    "🐢": ["turtle"],
    "🦎": ["lizard"],
    "🐍": ["snake"],
    "🐲": ["dragon_face"],
    "🐉": ["dragon"],
    "🦕": ["sauropod"],
    "🦖": ["trex"],
    "🐳": ["spouting_whale"],
    "🐋": ["whale"],
    "🐬": ["dolphin"],
    "🦭": ["seal"],
    "🐟️": ["fish"],
    "🐠": ["tropical_fish"],
    "🐡": ["blowfish"],
    "🦈": ["shark"],
    "🐙": ["octopus"],
    "🐚": ["shell"],
    "🐌": ["snail"],
    "🦋": ["butterfly"],
    "🐛": ["bug"],
    "🐜": ["ant"],
    "🐝": ["bee"],
    "🪲": ["beetle"],
    "🐞": ["lady_bug"],
    "🦗": ["cricket"],
    "🪳": ["cockroach"],
    "🕷️": ["spider"],
    "🕸️": ["spider_web"],
    "🦂": ["scorpion"],
    "🦟": ["mosquito"],
    "🪰": ["fly"],
    "🪱": ["worm"],
    "🦠": ["microbe", "germ"],
    "💐": ["bouquet"],
    "🌸": ["cherry_blossom"],
    "💮": ["white_flower"],
    "🏵️": ["rosette"],
    "🌹": ["rose"],
    "🥀": ["wilted_rose"],
    "🌺": ["hibiscus"],
    "🌻": ["sunflower"],
    "🌼": ["blossom"],
    "🌷": ["tulip"],
    "🌱": ["seedling"],
    "🪴": ["potted_plant"],
    "🌲": ["evergreen_tree"],
    "🌳": ["deciduous_tree"],
    "🌴": ["palm_tree"],
    "🌵": ["cactus"],
    "🌾": ["ear_of_rice"],
    "🌿": ["herb"],
    "☘️": ["shamrock"],
    "🍀": ["four_leaf_clover"],
    "🍁": ["maple_leaf"],
    "🍂": ["fallen_leaf"],
    "🍃": ["leaves"],
    "🍇": ["grapes"],
    "🍈": ["melon"],
    "🍉": ["watermelon"],
    "🍊": ["tangerine"],
    "🍋": ["lemon"],
    "🍌": ["banana"],
    "🍍": ["pineapple"],
    "🥭": ["mango"],
    "🍎": ["apple"],
    "🍏": ["green_apple"],
    "🍐": ["pear"],
    "🍑": ["peach"],
    "🍒": ["cherries"],
    "🍓": ["strawberry"],
    "🫐": ["blueberry"],
    "🥝": ["kiwi"],
    "🍅": ["tomato"],
    "🫒": ["olive"],
    "🥥": ["coconut"],
    "🥑": ["avocado"],
    "🍆": ["eggplant"],
    "🥔": ["potato"],
    "🥕": ["carrot"],
    "🌽": ["corn"],
    "🌶️": ["hot_pepper"],
    "🫑": ["bell_pepper"],
    "🥒": ["cucumber"],
    "🥬": ["leafy_green"],
    "🥦": ["broccoli"],
    "🧄": ["garlic"],
    "🧅": ["onion"],
    "🍄": ["mushroom"],
    "🥜": ["peanuts"],
    "🌰": ["chestnut"],
    "🍞": ["bread"],
    "🥐": ["croissant"],
    "🥖": ["french_bread"],
    "🫓": ["flatbread"],
    "🥨": ["pretzel"],
    "🥯": ["bagel"],
    "🥞": ["pancakes"],
    "🧇": ["waffle"],
    "🧀": ["cheese"],
    "🍖": ["meat_on_bone"],
    "🍗": ["poultry_leg"],
    "🥩": ["cut_of_meat"],
    "🥓": ["bacon"],
    "🍔": ["hamburger"],
    "🍟": ["fries"],
    "🍕": ["pizza"],
    "🌭": ["hotdog"],
    "🥪": ["sandwich"],
    "🌮": ["taco"],
    "🌯": ["burrito"],
    "🫔": ["tamale"],
    "🥙": ["stuffed_flatbread"],
    "🧆": ["falafel"],
    "🥚": ["egg"],
    "🍳": ["cooking"],
    "🥘": ["shallow_pan_of_food"],
    "🍲": ["stew"],
    "🫕": ["fondue"],
    "🥣": ["bowl_spoon"],
    "🥗": ["salad"],
    "🍿": ["popcorn"],
    "🧈": ["butter"],
    "🧂": ["salt"],
    "🥫": ["canned_food"],
    "🍱": ["bento"],
    "🍘": ["rice_cracker"],
    "🍙": ["rice_ball"],
    "🍚": ["rice"],
    "🍛": ["curry"],
    "🍜": ["ramen"],
    "🍝": ["spaghetti"],
    "🍠": ["sweet_potato"],
    "🍢": ["oden"],
    "🍣": ["sushi"],
    "🍤": ["fried_shrimp"],
    "🍥": ["fish_cake"],
    "🥮": ["moon_cake"],
    "🍡": ["dango"],
    "🥟": ["dumpling"],
    "🥠": ["fortune_cookie"],
    "🥡": ["takeout_box"],
    "🦀": ["crab"],
    "🦞": ["lobster"],
    "🦐": ["shrimp"],
    "🦑": ["squid"],
    "🦪": ["oyster"],
    "🍦": ["icecream"],
    "🍧": ["shaved_ice"],
    "🍨": ["ice_cream"],
    "🍩": ["doughnut"],
    "🍪": ["cookie"],
    "🎂": ["birthday"],
    "🍰": ["cake"],
    "🧁": ["cupcake"],
    "🥧": ["pie"],
    "🍫": ["chocolate_bar"],
    "🍬": ["candy"],
    "🍭": ["lollipop"],
    "🍮": ["custard"],
    "🍯": ["honey_pot"],
    "🍼": ["baby_bottle"],
    "🥛": ["milk"],
    "☕️": ["coffee"],
    "🫖": ["teapot"],
    "🍵": ["tea"],
    "🍶": ["sake"],
    "🍾": ["champagne"],
    "🍷": ["wine_glass"],
    "🍸️": ["cocktail"],
    "🍹": ["tropical_drink"],
    "🍺": ["beer"],
    "🍻": ["beers"],
    "🥂": ["champagne_glass"],
    "🥃": ["tumbler_glass"],
    "🥤": ["cup_straw"],
    "🧋": ["bubble_tea", "boba_drink"],
    "🧃": ["beverage_box", "juice_box"],
    "🧉": ["mate", "yerba_mate"],
    "🧊": ["ice"],
    "🥢": ["chopsticks"],
    "🍽️": ["fork_knife_plate"],
    "🍴": ["utensils"],
    "🥄": ["spoon"],
    "🔪": ["knife"],
    "🏺": ["amphora"],
    "🌍️": ["earth_africa"],
    "🌎️": ["earth_americas"],
    "🌏️": ["earth_asia"],
    "🌐": ["globe"],
    "🗺️": ["map"],
    "🗾": ["japan"],
    "🧭": ["compass"],
    "🏔️": ["snowy_mountain"],
    "⛰️": ["mountain"],
    "🌋": ["volcano"],
    "🗻": ["mount_fuji"],
    "🏕️": ["camping"],
    "🏖️": ["beach"],
    "🏜️": ["desert"],
    "🏝️": ["island"],
    "🏞️": ["park"],
    "🏟️": ["stadium"],
    "🏛️": ["classical_building"],
    "🏗️": ["construction_site"],
    "🧱": ["brick"],
    "🪨": ["rock"],
    "🪵": ["wood"],
    "🛖": ["hut"],
    "🏘️": ["homes"],
    "🏚️": ["house_abandoned"],
    "🏠️": ["house"],
    "🏡": ["house_garden"],
    "🏢": ["office"],
    "🏣": ["ja_post_office"],
    "🏤": ["post_office"],
    "🏥": ["hospital"],
    "🏦": ["bank"],
    "🏨": ["hotel"],
    "🏩": ["love_hotel"],
    "🏪": ["convenience_store"],
    "🏫": ["school"],
    "🏬": ["department_store"],
    "🏭️": ["factory"],
    "🏯": ["japanese_castle"],
    "🏰": ["castle", "european_castle"],
    "💒": ["wedding"],
    "🗼": ["tokyo_tower"],
    "🗽": ["statue_of_liberty"],
    "⛪️": ["church"],
    "🕌": ["mosque"],
    "🛕": ["hindu_temple"],
    "🕍": ["synagogue"],
    "⛩️": ["shinto_shrine"],
    "🕋": ["kaaba"],
    "⛲️": ["fountain"],
    "⛺️": ["tent"],
    "🌁": ["foggy"],
    "🌃": ["night_stars"],
    "🏙️": ["cityscape"],
    "🌄": ["sunrise_over_mountains"],
    "🌅": ["sunrise"],
    "🌆": ["dusk"],
    "🌇": ["sunset"],
    "🌉": ["bridge_at_night"],
    "♨️": ["hotsprings"],
    "🎠": ["carousel_horse"],
    "🎡": ["ferris_wheel"],
    "🎢": ["roller_coaster"],
    "💈": ["barber"],
    "🎪": ["circus_tent"],
    "🚂": ["steam_locomotive"],
    "🚃": ["railway_car"],
    "🚄": ["bullettrain_side"],
    "🚅": ["bullettrain"],
    "🚆": ["train"],
    "🚇️": ["metro"],
    "🚈": ["light_rail"],
    "🚉": ["station"],
    "🚊": ["tram"],
    "🚝": ["monorail"],
    "🚞": ["mountain_railway"],
    "🚋": ["tram_car"],
    "🚌": ["bus"],
    "🚍️": ["oncoming_bus"],
    "🚎": ["trolleybus"],
    "🚐": ["minibus"],
    "🚑️": ["ambulance"],
    "🚒": ["fire_engine"],
    "🚓": ["police_car"],
    "🚔️": ["oncoming_police_car"],
    "🚕": ["taxi"],
    "🚖": ["oncoming_taxi"],
    "🚗": ["red_car"],
    "🚘️": ["oncoming_automobile"],
    "🚙": ["blue_car"],
    "🛻": ["pickup_truck"],
    "🚚": ["truck"],
    "🚛": ["lorry"],
    "🚜": ["tractor"],
    "🏎️": ["race_car"],
    "🏍️": ["motorcycle"],
    "🛵": ["motor_scooter"],
    "🦽": ["wheelchair"],
    "🦼": ["motor_wheelchair"],
    "🛺": ["auto_rickshaw"],
    "🚲️": ["bike"],
    "🛴": ["scooter"],
    "🛹": ["skateboard"],
    "🛼": ["roller_skate"],
    "🚏": ["bus_stop"],
    "🛣️": ["motorway"],
    "🛤️": ["railway_track"],
    "🛢️": ["oil_drum"],
    "⛽️": ["fuel_pump"],
    "🚨": ["rotating_light", "police_light"],
    "🚥": ["traffic_light"],
    "🚦": ["vertical_traffic_light"],
    "🛑": ["stop_sign", "octagonal_sign"],
    "🚧": ["construction"],
    "⚓️": ["anchor"],
    "⛵️": ["sailboat"],
    "🛶": ["canoe"],
    "🚤": ["speedboat"],
    "🛳️": ["cruise_ship"],
    "⛴️": ["ferry"],
    "🛥️": ["motorboat"],
    "🚢": ["ship"],
    "✈️": ["airplane"],
    "🛩️": ["small_airplane"],
    "🛫": ["airplane_departure"],
    "🛬": ["airplane_arriving"],
    "🪂": ["parachute"],
    "💺": ["seat"],
    "🚁": ["helicopter"],
    "🚟": ["suspension_railway"],
    "🚠": ["mountain_cableway"],
    "🚡": ["aerial_tramway"],
    "🛰️": ["satellite"],
    "🚀": ["rocket"],
    "🛸": ["flying_saucer"],
    "🛎️": ["bellhop"],
    "🧳": ["luggage"],
    "⌛️": ["hourglass"],
    "⏳️": ["hourglass_flowing"],
    "⌚️": ["watch"],
    "⏰": ["alarm_clock"],
    "⏱️": ["stopwatch"],
    "⏲️": ["timer"],
    "🕰️": ["clock"],
    "🕛️": ["clock12"],
    "🕧️": ["clock1230"],
    "🕐️": ["clock1"],
    "🕜️": ["clock130"],
    "🕑️": ["clock2"],
    "🕝️": ["clock230"],
    "🕒️": ["clock3"],
    "🕞️": ["clock330"],
    "🕓️": ["clock4"],
    "🕟️": ["clock430"],
    "🕔️": ["clock5"],
    "🕠️": ["clock530"],
    "🕕️": ["clock6"],
    "🕡️": ["clock630"],
    "🕖️": ["clock7"],
    "🕢️": ["clock730"],
    "🕗️": ["clock8"],
    "🕣️": ["clock830"],
    "🕘️": ["clock9"],
    "🕤️": ["clock930"],
    "🕙️": ["clock10"],
    "🕥️": ["clock1030"],
    "🕚️": ["clock11"],
    "🕦️": ["clock1130"],
    "🌑": ["new_moon"],
    "🌒": ["waxing_crescent_moon"],
    "🌓": ["first_quarter_moon"],
    "🌔": ["waxing_gibbous_moon"],
    "🌕️": ["full_moon"],
    "🌖": ["waning_gibbous_moon"],
    "🌗": ["last_quarter_moon"],
    "🌘": ["waning_crescent_moon"],
    "🌙": ["crescent_moon"],
    "🌚": ["new_moon_face"],
    "🌛": ["first_quarter_moon_face"],
    "🌜️": ["last_quarter_moon_face"],
    "🌡️": ["thermometer"],
    "☀️": ["sun"],
    "🌝": ["full_moon_face"],
    "🌞": ["sun_face"],
    "🪐": ["ringed_planet", "saturn"],
    "⭐️": ["star"],
    "🌟": ["star2", "glowing_star"],
    "🌠": ["star3", "shooting_star"],
    "🌌": ["milky_way"],
    "☁️": ["cloud"],
    "⛅️": ["partly_sunny"],
    "⛈️": ["storm"],
    "🌤️": ["overcast"],
    "🌥️": ["cloudy"],
    "🌦️": ["sunshower"],
    "🌧️": ["rain"],
    "🌨️": ["snow"],
    "🌩️": ["lightning"],
    "🌪️": ["tornado"],
    "🌫️": ["fog"],
    "🌬️": ["wind_face"],
    "🌀": ["cyclone"],
    "🌈": ["rainbow"],
    "🌂": ["closed_umbrella"],
    "☂️": ["umbrella"],
    "☔️": ["umbrella_rain"],
    "⛱️": ["beach_umbrella"],
    "⚡️": ["zap", "high_voltage"],
    "❄️": ["snowflake"],
    "☃️": ["snowy_snowman"],
    "⛄️": ["snowman"],
    "☄️": ["comet"],
    "🔥": ["fire"],
    "💧": ["droplet"],
    "🌊": ["ocean"],
    "🎃": ["jack_o_lantern"],
    "🎄": ["christmas_tree", "xmas_tree"],
    "🎆": ["fireworks"],
    "🎇": ["sparkler"],
    "🧨": ["firecracker"],
    "✨": ["sparkles"],
    "🎈": ["balloon"],
    "🎉": ["tada", "party"],
    "🎊": ["confetti_ball"],
    "🎋": ["tanabata_tree"],
    "🎍": ["bamboo", "pine_decor"],
    "🎎": ["dolls"],
    "🎏": ["carp_streamer"],
    "🎐": ["wind_chime"],
    "🎑": ["moon_ceremony", "rice_scene"],
    "🧧": ["red_envelope"],
    "🎀": ["ribbon"],
    "🎁": ["gift"],
    "🎗️": ["reminder_ribbon"],
    "🎟️": ["tickets", "admission"],
    "🎫": ["ticket"],
    "🎖️": ["military_medal"],
    "🏆️": ["trophy"],
    "🏅": ["medal"],
    "🥇": ["first_place"],
    "🥈": ["second_place"],
    "🥉": ["third_place"],
    "⚽️": ["soccer"],
    "⚾️": ["baseball"],
    "🥎": ["softball"],
    "🏀": ["basketball"],
    "🏐": ["volleyball"],
    "🏈": ["football"],
    "🏉": ["rugby"],
    "🎾": ["tennis"],
    "🥏": ["flying_disc"],
    "🎳": ["bowling"],
    "🏏": ["cricket_game"],
    "🏑": ["field_hockey"],
    "🏒": ["hockey"],
    "🥍": ["lacrosse"],
    "🏓": ["ping_pong"],
    "🏸": ["badminton"],
    "🥊": ["boxing_glove"],
    "🥋": ["gi", "martial_arts_uniform"],
    "🥅": ["goal"],
    "⛳️": ["golf"],
    "⛸️": ["ice_skate"],
    "🎣": ["fishing_pole"],
    "🤿": ["diving_mask", "scuba_mask"],
    "🎽": ["running_shirt"],
    "🎿": ["ski"],
    "🛷": ["sled"],
    "🥌": ["curling_stone"],
    "🎯": ["dart"],
    "🪀": ["yoyo"],
    "🪁": ["kite"],
    "🎱": ["8ball"],
    "🔮": ["crystal_ball"],
    "🪄": ["wand"],
    "🧿": ["nazar_amulet"],
    "🎮️": ["video_game"],
    "🕹️": ["joystick"],
    "🎰": ["slot_machine"],
    "🎲": ["game_die"],
    "🧩": ["jigsaw", "puzzle_piece"],
    "🧸": ["teddy_bear"],
    "🪅": ["pinata"],
    "🪆": ["nesting_dolls"],
    "♠️": ["spades"],
    "♥️": ["hearts"],
    "♦️": ["diamonds"],
    "♣️": ["clubs"],
    "♟️": ["chess_pawn"],
    "🃏": ["black_joker"],
    "🀄️": ["mahjong"],
    "🎴": ["flower_cards"],
    "🎭️": ["performing_arts"],
    "🖼️": ["frame_photo"],
    "🎨": ["art", "palette"],
    "🧵": ["spool"],
    "🪡": ["sewing_needle"],
    "🧶": ["yarn"],
    "🪢": ["knot"],
    "👓️": ["glasses"],
    "🕶️": ["sunglasses"],
    "🥽": ["goggles"],
    "🥼": ["lab_coat"],
    "🦺": ["safety_vest"],
    "👔": ["necktie", "tie"],
    "👕": ["shirt"],
    "👖": ["jeans"],
    "🧣": ["scarf"],
    "🧤": ["gloves"],
    "🧥": ["coat"],
    "🧦": ["socks"],
    "👗": ["dress"],
    "👘": ["kimono"],
    "🥻": ["sari"],
    "🩱": ["one_piece_swimsuit"],
    "🩲": ["briefs"],
    "🩳": ["shorts"],
    "👙": ["bikini"],
    "👚": ["blouse", "womans_clothes"],
    "👛": ["purse"],
    "👜": ["handbag"],
    "👝": ["pouch", "clutch_bag"],
    "🛍️": ["shopping_bags"],
    "🎒": ["backpack"],
    "🩴": ["sandal"],
    "👞": ["dress_shoe", "mans_shoe"],
    "👟": ["sneaker", "athletic_shoe"],
    "🥾": ["hiking_boot"],
    "🥿": ["flat_shoe"],
    "👠": ["high_heel"],
    "👡": ["womans_sandal"],
    "🩰": ["ballet_shoes"],
    "👢": ["womans_boot"],
    "👑": ["crown"],
    "👒": ["womans_hat"],
    "🎩": ["top_hat"],
    "🎓️": ["graduation_cap"],
    "🧢": ["billed_cap"],
    "🪖": ["military_helmet"],
    "⛑️": ["helmet_cross"],
    "📿": ["prayer_beads"],
    "💄": ["lipstick"],
    "💍": ["ring"],
    "💎": ["gem"],
    "🔇": ["mute", "no_sound"],
    "🔈️": ["speaker", "low_sound"],
    "🔉": ["sound"],
    "🔊": ["loud_sound"],
    "📢": ["loudspeaker"],
    "📣": ["megaphone"],
    "📯": ["postal_horn"],
    "🔔": ["bell"],
    "🔕": ["no_bell"],
    "🎼": ["musical_score"],
    "🎵": ["musical_note"],
    "🎶": ["musical_notes"],
    "🎙️": ["studio_microphone"],
    "🎚️": ["level_slider"],
    "🎛️": ["control_knobs"],
    "🎤": ["microphone"],
    "🎧️": ["headphones"],
    "📻️": ["radio"],
    "🎷": ["saxophone"],
    "🪗": ["accordion"],
    "🎸": ["guitar"],
    "🎹": ["musical_keyboard"],
    "🎺": ["trumpet"],
    "🎻": ["violin"],
    "🪕": ["banjo"],
    "🥁": ["drum"],
    "🪘": ["long_drum"],
    "📱": ["mobile", "iphone", "android"],
    "📲": ["mobile_calling"],
    "☎️": ["telephone"],
    "📞": ["telephone_receiver"],
    "📟️": ["pager"],
    "📠": ["fax"],
    "🔋": ["battery"],
    "🔌": ["electric_plug"],
    "💻️": ["laptop"],
    "🖥️": ["desktop", "computer"],
    "🖨️": ["printer"],
    "⌨️": ["keyboard"],
    "🖱️": ["computer_mouse"],
    "🖲️": ["trackball"],
    "💽": ["minidisc"],
    "💾": ["floppy_disk"],
    "💿️": ["cd", "disk"],
    "📀": ["dvd"],
    "🧮": ["abacus"],
    "🎥": ["movie_camera"],
    "🎞️": ["film_frames"],
    "📽️": ["projector"],
    "🎬️": ["clapper"],
    "📺️": ["tv"],
    "📷️": ["camera"],
    "📸": ["camera_flash"],
    "📹️": ["video_camera"],
    "📼": ["vhs"],
    "🔍️": ["mag"],
    "🔎": ["mag_right"],
    "🕯️": ["candle"],
    "💡": ["bulb", "light_bulb"],
    "🔦": ["flashlight"],
    "🏮": ["red_lantern"],
    "🪔": ["diya_lamp"],
    "📔": ["decorative_notebook"],
    "📕": ["closed_book"],
    "📖": ["book"],
    "📗": ["green_book"],
    "📘": ["blue_book"],
    "📙": ["orange_book"],
    "📚️": ["books"],
    "📓": ["notebook"],
    "📒": ["ledger"],
    "📃": ["page_curl"],
    "📜": ["scroll"],
    "📄": ["page_facing_up"],
    "📰": ["newspaper"],
    "🗞️": ["rolled_newspaper"],
    "📑": ["bookmark_tabs"],
    "🔖": ["bookmark"],
    "🏷️": ["label"],
    "💰️": ["moneybag"],
    "🪙": ["coin"],
    "💴": ["yen"],
    "💵": ["dollar"],
    "💶": ["euro"],
    "💷": ["pound"],
    "💸": ["money_wings"],
    "💳️": ["credit_card"],
    "🧾": ["receipt"],
    "💹": ["ja_chart"],
    "✉️": ["envelope"],
    "📧": ["email"],
    "📨": ["incoming_envelope"],
    "📩": ["envelope_arrow"],
    "📤️": ["outbox_tray"],
    "📥️": ["inbox_tray"],
    "📦️": ["package"],
    "📫️": ["mailbox"],
    "📪️": ["mailbox_closed"],
    "📬️": ["mailbox_mail"],
    "📭️": ["mailbox_no_mail"],
    "📮": ["postbox"],
    "🗳️": ["ballot_box"],
    "✏️": ["pencil"],
    "✒️": ["black_nib"],
    "🖋️": ["fountain_pen"],
    "🖊️": ["pen"],
    "🖌️": ["paintbrush"],
    "🖍️": ["crayon"],
    "📝": ["memo"],
    "💼": ["briefcase"],
    "📁": ["file_folder"],
    "📂": ["open_file_folder"],
    "🗂️": ["dividers"],
    "📅": ["date", "calendar"],
    "📆": ["torn_calendar"],
    "🗒️": ["notepad_spiral"],
    "🗓️": ["calendar_spiral"],
    "📇": ["card_index"],
    "📈": ["chart_up"],
    "📉": ["chart_down"],
    "📊": ["bar_chart"],
    "📋️": ["clipboard"],
    "📌": ["pushpin"],
    "📍": ["round_pushpin"],
    "📎": ["paperclip"],
    "🖇️": ["paperclips"],
    "📏": ["straight_ruler"],
    "📐": ["triangular_ruler"],
    "✂️": ["scissors"],
    "🗃️": ["card_box"],
    "🗄️": ["file_cabinet"],
    "🗑️": ["trashcan", "wastebasket"],
    "🔒️": ["lock"],
    "🔓️": ["unlock"],
    "🔏": ["locked_pen"],
    "🔐": ["locked_key"],
    "🔑": ["key"],
    "🗝️": ["old_key"],
    "🔨": ["hammer"],
    "🪓": ["axe"],
    "⛏️": ["pick"],
    "⚒️": ["hammer_pick"],
    "🛠️": ["tools", "hammer_wrench"],
    "🗡️": ["dagger"],
    "⚔️": ["crossed_swords"],
    "🔫": ["gun", "pistol"],
    "🪃": ["boomerang"],
    "🏹": ["bow"],
    "🛡️": ["shield"],
    "🪚": ["saw"],
    "🔧": ["wrench"],
    "🪛": ["screwdriver"],
    "🔩": ["nut_and_bolt"],
    "⚙️": ["gear"],
    "🗜️": ["clamp", "compression"],
    "⚖️": ["scales"],
    "🦯": ["probing_cane"],
    "🔗": ["link"],
    "⛓️": ["chains"],
    "🪝": ["hook"],
    "🧰": ["toolbox"],
    "🧲": ["magnet"],
    "🪜": ["ladder"],
    "⚗️": ["alembic"],
    "🧪": ["test_tube"],
    "🧫": ["petri_dish"],
    "🧬": ["dna", "double_helix"],
    "🔬": ["microscope"],
    "🔭": ["telescope"],
    "📡": ["satellite_antenna"],
    "💉": ["syringe"],
    "🩸": ["blood_drop"],
    "💊": ["pill"],
    "🩹": ["bandaid", "adhesive_bandage"],
    "🩺": ["stethoscope"],
    "🚪": ["door"],
    "🛗": ["elevator"],
    "🪞": ["mirror"],
    "🪟": ["window"],
    "🛏️": ["bed"],
    "🛋️": ["couch"],
    "🪑": ["chair"],
    "🚽": ["toilet"],
    "🪠": ["plunger"],
    "🚿": ["shower"],
    "🛁": ["bathtub"],
    "🪤": ["mouse_trap"],
    "🪒": ["razor"],
    "🧴": ["lotion"],
    "🧷": ["safety_pin"],
    "🧹": ["broom"],
    "🧺": ["basket"],
    "🧻": ["toilet_paper"],
    "🪣": ["bucket"],
    "🧼": ["soap"],
    "🪥": ["toothbrush"],
    "🧽": ["sponge"],
    "🧯": ["fire_extinguisher"],
    "🛒": ["shopping_cart"],
    "🚬": ["cigarette", "smoking"],
    "⚰️": ["coffin"],
    "🪦": ["headstone"],
    "⚱️": ["urn"],
    "🗿": ["moai"],
    "🪧": ["placard"],
    "🏧": ["atm"],
    "🚮": ["litter_bin"],
    "🚰": ["potable_water"],
    "♿️": ["handicapped"],
    "🚹️": ["mens"],
    "🚺️": ["womens"],
    "🚻": ["restroom", "bathroom"],
    "🚼️": ["baby_symbol"],
    "🚾": ["wc"],
    "🛂": ["passport_control"],
    "🛃": ["customs"],
    "🛄": ["baggage_claim"],
    "🛅": ["left_luggage"],
    "⚠️": ["warning"],
    "🚸": ["children_crossing"],
    "⛔️": ["no_entry"],
    "🚫": ["no_entry_sign"],
    "🚳": ["no_bicycles"],
    "🚭️": ["no_smoking"],
    "🚯": ["do_not_litter"],
    "🚱": ["non_potable_water"],
    "🚷": ["no_pedestrians"],
    "📵": ["no_mobile_phones"],
    "🔞": ["underage"],
    "☢️": ["radioactive"],
    "☣️": ["biohazard"],
    "⬆️": ["arrow_up"],
    "↗️": ["arrow_upper_right"],
    "➡️": ["arrow_right"],
    "↘️": ["arrow_lower_right"],
    "⬇️": ["arrow_down"],
    "↙️": ["arrow_lower_left"],
    "⬅️": ["arrow_left"],
    "↖️": ["arrow_upper_left"],
    "↕️": ["arrow_up_down"],
    "↔️": ["arrow_left_right"],
    "↩️": ["arrow_left_hook"],
    "↪️": ["arrow_right_hook"],
    "⤴️": ["arrow_heading_up"],
    "⤵️": ["arrow_heading_down"],
    "🔃": ["clockwise"],
    "🔄": ["counter_clockwise"],
    "🔙": ["back"],
    "🔚": ["end"],
    "🔛": ["on"],
    "🔜": ["soon"],
    "🔝": ["top"],
    "🛐": ["place_of_worship"],
    "⚛️": ["atom"],
    "🕉️": ["om_symbol"],
    "✡️": ["star_of_david"],
    "☸️": ["wheel_of_dharma"],
    "☯️": ["yin_yang"],
    "✝️": ["cross"],
    "☦️": ["orthodox_cross"],
    "☪️": ["star_and_crescent"],
    "☮️": ["peace"],
    "🕎": ["menorah"],
    "🔯": ["six_pointed_star"],
    "♈️": ["aries"],
    "♉️": ["taurus"],
    "♊️": ["gemini"],
    "♋️": ["cancer"],
    "♌️": ["leo"],
    "♍️": ["virgo"],
    "♎️": ["libra"],
    "♏️": ["scorpius"],
    "♐️": ["sagittarius"],
    "♑️": ["capricorn"],
    "♒️": ["aquarius"],
    "♓️": ["pisces"],
    "⛎": ["ophiuchus"],
    "🔀": ["shuffle"],
    "🔁": ["repeat"],
    "🔂": ["repeat_single"],
    "▶️": ["play"],
    "⏩️": ["fast_forward"],
    "⏭️": ["next_track"],
    "⏯️": ["play_pause"],
    "◀️": ["reverse"],
    "⏪️": ["rewind"],
    "⏮️": ["previous_track"],
    "🔼": ["up_button"],
    "⏫": ["fast_up_button"],
    "🔽": ["down_button"],
    "⏬": ["fast_down_button"],
    "⏸️": ["pause"],
    "⏹️": ["stop"],
    "⏺️": ["record"],
    "⏏️": ["eject"],
    "🎦": ["cinema"],
    "🔅": ["dim", "low_brightness"],
    "🔆": ["bright", "high_brightness"],
    "📶": ["signal_strength", "antenna_bars"],
    "📳": ["vibration_mode"],
    "📴": ["mobile_phone_off"],
    "♀️": ["female", "female_sign"],
    "♂️": ["male", "male_sign"],
    "⚧️": ["trans"],
    "✖️": ["multiplication"],
    "➕": ["plus"],
    "➖": ["minus"],
    "➗": ["division"],
    "♾️": ["infinity"],
    "‼️": ["bangbang", "double_exclamation"],
    "⁉️": ["interrobang", "exclamation_question"],
    "❓️": ["question"],
    "❔": ["white_question"],
    "❕": ["white_exclamation"],
    "❗️": ["exclamation"],
    "〰️": ["wavy_dash"],
    "💱": ["currency_exchange"],
    "💲": ["dollar_sign"],
    "⚕️": ["medical"],
    "♻️": ["recycle"],
    "⚜️": ["fleur-de-lis"],
    "🔱": ["trident"],
    "📛": ["name_badge"],
    "🔰": ["ja_beginner"],
    "⭕️": ["o"],
    "✅": ["white_check_mark"],
    "☑️": ["checked_ballot"],
    "✔️": ["check_mark"],
    "❌": ["x", "cross_mark"],
    "❎": ["cross_mark_button"],
    "➰": ["curly_loop"],
    "➿": ["double_curly_loop"],
    "〽️": ["part_alternation_mark"],
    "✳️": ["eight_spoked_asterisk"],
    "✴️": ["eight_pointed_star"],
    "❇️": ["sparkle"],
    "©️": ["copyright"],
    "®️": ["registered"],
    "™️": ["tm"],
    "#️⃣": ["hash"],
    "*️⃣": ["asterisk"],
    "0️⃣": ["zero"],
    "1️⃣": ["one"],
    "2️⃣": ["two"],
    "3️⃣": ["three"],
    "4️⃣": ["four"],
    "5️⃣": ["five"],
    "6️⃣": ["six"],
    "7️⃣": ["seven"],
    "8️⃣": ["eight"],
    "9️⃣": ["nine"],
    "🔟": ["ten"],
    "🔠": ["upper_abcd"],
    "🔡": ["abcd"],
    "🔢": ["1234"],
    "🔣": ["symbols"],
    "🔤": ["abc"],
    "🅰️": ["a_blood"],
    "🆎": ["ab_blood"],
    "🅱️": ["b_blood"],
    "🆑": ["cl"],
    "🆒": ["cool"],
    "🆓": ["free"],
    ℹ️: ["info"],
    "🆔": ["id"],
    "Ⓜ️": ["m"],
    "🆕": ["new"],
    "🆖": ["ng"],
    "🅾️": ["o_blood"],
    "🆗": ["ok"],
    "🅿️": ["p"],
    "🆘": ["sos"],
    "🆙": ["up"],
    "🆚": ["vs"],
    "🈁": ["ja_here", "koko"],
    "🈂️": ["ja_service_charge"],
    "🈷️": ["ja_monthly_amount"],
    "🈶": ["ja_not_free_of_carge"],
    "🈯️": ["ja_reserved"],
    "🉐": ["ja_bargain"],
    "🈹": ["ja_discount"],
    "🈚️": ["ja_free_of_charge"],
    "🈲": ["ja_prohibited"],
    "🉑": ["ja_acceptable"],
    "🈸": ["ja_application"],
    "🈴": ["ja_passing_grade"],
    "🈳": ["ja_vacancy"],
    "㊗️": ["ja_congratulations"],
    "㊙️": ["ja_secret"],
    "🈺": ["ja_open_for_business"],
    "🈵": ["ja_no_vacancy"],
    "🔴": ["red_circle"],
    "🟠": ["orange_circle"],
    "🟡": ["yellow_circle"],
    "🟢": ["green_circle"],
    "🔵": ["blue_circle"],
    "🟣": ["purple_circle"],
    "🟤": ["brown_circle"],
    "⚫️": ["black_circle"],
    "⚪️": ["white_circle"],
    "🟥": ["red_square"],
    "🟧": ["orange_square"],
    "🟨": ["yellow_square"],
    "🟩": ["green_square"],
    "🟦": ["blue_square"],
    "🟪": ["purple_square"],
    "🟫": ["brown_square"],
    "⬛️": ["large_black_square"],
    "⬜️": ["large_white_square"],
    "◼️": ["medium_black_square"],
    "◻️": ["medium_white_square"],
    "◾️": ["medium_small_black_square"],
    "◽️": ["medium_small_white_square"],
    "▪️": ["small_black_square"],
    "▫️": ["small_white_square"],
    "🔶": ["large_orange_diamond"],
    "🔷": ["large_blue_diamond"],
    "🔸": ["small_orange_diamond"],
    "🔹": ["small_blue_diamond"],
    "🔺": ["up_red_triangle"],
    "🔻": ["down_red_triangle"],
    "💠": ["diamond_dot"],
    "🔘": ["radio_button"],
    "🔳": ["white_square_button"],
    "🔲": ["black_square_button"],
    "🏁": ["checkered_flag"],
    "🚩": ["triangle_flag"],
    "🎌": ["crossed_flags"],
    "🏴": ["black_flag"],
    "🏳️": ["white_flag"],
    "🏳️‍🌈": ["rainbow_flag"],
    "🏳️‍⚧️": ["trans_flag"],
    "🏴‍☠️": ["pirate_flag", "jolly_roger"],
    "🇦🇨": ["flag_ac"],
    "🇦🇩": ["flag_ad"],
    "🇦🇪": ["flag_ae"],
    "🇦🇫": ["flag_af"],
    "🇦🇬": ["flag_ag"],
    "🇦🇮": ["flag_ai"],
    "🇦🇱": ["flag_al"],
    "🇦🇲": ["flag_am"],
    "🇦🇴": ["flag_ao"],
    "🇦🇶": ["flag_aq"],
    "🇦🇷": ["flag_ar"],
    "🇦🇸": ["flag_as"],
    "🇦🇹": ["flag_at"],
    "🇦🇺": ["flag_au"],
    "🇦🇼": ["flag_aw"],
    "🇦🇽": ["flag_ax"],
    "🇦🇿": ["flag_az"],
    "🇧🇦": ["flag_ba"],
    "🇧🇧": ["flag_bb"],
    "🇧🇩": ["flag_bd"],
    "🇧🇪": ["flag_be"],
    "🇧🇫": ["flag_bf"],
    "🇧🇬": ["flag_bg"],
    "🇧🇭": ["flag_bh"],
    "🇧🇮": ["flag_bi"],
    "🇧🇯": ["flag_bj"],
    "🇧🇱": ["flag_bl"],
    "🇧🇲": ["flag_bm"],
    "🇧🇳": ["flag_bn"],
    "🇧🇴": ["flag_bo"],
    "🇧🇶": ["flag_bq"],
    "🇧🇷": ["flag_br"],
    "🇧🇸": ["flag_bs"],
    "🇧🇹": ["flag_bt"],
    "🇧🇻": ["flag_bv"],
    "🇧🇼": ["flag_bw"],
    "🇧🇾": ["flag_by"],
    "🇧🇿": ["flag_bz"],
    "🇨🇦": ["flag_ca"],
    "🇨🇨": ["flag_cc"],
    "🇨🇩": ["flag_cd"],
    "🇨🇫": ["flag_cf"],
    "🇨🇬": ["flag_cg"],
    "🇨🇭": ["flag_ch"],
    "🇨🇮": ["flag_ci"],
    "🇨🇰": ["flag_ck"],
    "🇨🇱": ["flag_cl"],
    "🇨🇲": ["flag_cm"],
    "🇨🇳": ["flag_cn"],
    "🇨🇴": ["flag_co"],
    "🇨🇵": ["flag_cp"],
    "🇨🇷": ["flag_cr"],
    "🇨🇺": ["flag_cu"],
    "🇨🇻": ["flag_cv"],
    "🇨🇼": ["flag_cw"],
    "🇨🇽": ["flag_cx"],
    "🇨🇾": ["flag_cy"],
    "🇨🇿": ["flag_cz"],
    "🇩🇪": ["flag_de"],
    "🇩🇬": ["flag_dg"],
    "🇩🇯": ["flag_dj"],
    "🇩🇰": ["flag_dk"],
    "🇩🇲": ["flag_dm"],
    "🇩🇴": ["flag_do"],
    "🇩🇿": ["flag_dz"],
    "🇪🇦": ["flag_ea"],
    "🇪🇨": ["flag_ec"],
    "🇪🇪": ["flag_ee"],
    "🇪🇬": ["flag_eg"],
    "🇪🇭": ["flag_eh"],
    "🇪🇷": ["flag_er"],
    "🇪🇸": ["flag_es"],
    "🇪🇹": ["flag_et"],
    "🇪🇺": ["flag_eu"],
    "🇫🇮": ["flag_fi"],
    "🇫🇯": ["flag_fj"],
    "🇫🇰": ["flag_fk"],
    "🇫🇲": ["flag_fm"],
    "🇫🇴": ["flag_fo"],
    "🇫🇷": ["flag_fr"],
    "🇬🇦": ["flag_ga"],
    "🇬🇧": ["flag_gb"],
    "🇬🇩": ["flag_gd"],
    "🇬🇪": ["flag_ge"],
    "🇬🇫": ["flag_gf"],
    "🇬🇬": ["flag_gg"],
    "🇬🇭": ["flag_gh"],
    "🇬🇮": ["flag_gi"],
    "🇬🇱": ["flag_gl"],
    "🇬🇲": ["flag_gm"],
    "🇬🇳": ["flag_gn"],
    "🇬🇵": ["flag_gp"],
    "🇬🇶": ["flag_gq"],
    "🇬🇷": ["flag_gr"],
    "🇬🇸": ["flag_gs"],
    "🇬🇹": ["flag_gt"],
    "🇬🇺": ["flag_gu"],
    "🇬🇼": ["flag_gw"],
    "🇬🇾": ["flag_gy"],
    "🇭🇰": ["flag_hk"],
    "🇭🇲": ["flag_hm"],
    "🇭🇳": ["flag_hn"],
    "🇭🇷": ["flag_hr"],
    "🇭🇹": ["flag_ht"],
    "🇭🇺": ["flag_hu"],
    "🇮🇨": ["flag_ic"],
    "🇮🇩": ["flag_id"],
    "🇮🇪": ["flag_ie"],
    "🇮🇱": ["flag_il"],
    "🇮🇲": ["flag_im"],
    "🇮🇳": ["flag_in"],
    "🇮🇴": ["flag_io"],
    "🇮🇶": ["flag_iq"],
    "🇮🇷": ["flag_ir"],
    "🇮🇸": ["flag_is"],
    "🇮🇹": ["flag_it"],
    "🇯🇪": ["flag_je"],
    "🇯🇲": ["flag_jm"],
    "🇯🇴": ["flag_jo"],
    "🇯🇵": ["flag_jp"],
    "🇰🇪": ["flag_ke"],
    "🇰🇬": ["flag_kg"],
    "🇰🇭": ["flag_kh"],
    "🇰🇮": ["flag_ki"],
    "🇰🇲": ["flag_km"],
    "🇰🇳": ["flag_kn"],
    "🇰🇵": ["flag_kp"],
    "🇰🇷": ["flag_kr"],
    "🇰🇼": ["flag_kw"],
    "🇰🇾": ["flag_ky"],
    "🇰🇿": ["flag_kz"],
    "🇱🇦": ["flag_la"],
    "🇱🇧": ["flag_lb"],
    "🇱🇨": ["flag_lc"],
    "🇱🇮": ["flag_li"],
    "🇱🇰": ["flag_lk"],
    "🇱🇷": ["flag_lr"],
    "🇱🇸": ["flag_ls"],
    "🇱🇹": ["flag_lt"],
    "🇱🇺": ["flag_lu"],
    "🇱🇻": ["flag_lv"],
    "🇱🇾": ["flag_ly"],
    "🇲🇦": ["flag_ma"],
    "🇲🇨": ["flag_mc"],
    "🇲🇩": ["flag_md"],
    "🇲🇪": ["flag_me"],
    "🇲🇫": ["flag_mf"],
    "🇲🇬": ["flag_mg"],
    "🇲🇭": ["flag_mh"],
    "🇲🇰": ["flag_mk"],
    "🇲🇱": ["flag_ml"],
    "🇲🇲": ["flag_mm"],
    "🇲🇳": ["flag_mn"],
    "🇲🇴": ["flag_mo"],
    "🇲🇵": ["flag_mp"],
    "🇲🇶": ["flag_mq"],
    "🇲🇷": ["flag_mr"],
    "🇲🇸": ["flag_ms"],
    "🇲🇹": ["flag_mt"],
    "🇲🇺": ["flag_mu"],
    "🇲🇻": ["flag_mv"],
    "🇲🇼": ["flag_mw"],
    "🇲🇽": ["flag_mx"],
    "🇲🇾": ["flag_my"],
    "🇲🇿": ["flag_mz"],
    "🇳🇦": ["flag_na"],
    "🇳🇨": ["flag_nc"],
    "🇳🇪": ["flag_ne"],
    "🇳🇫": ["flag_nf"],
    "🇳🇬": ["flag_ng"],
    "🇳🇮": ["flag_ni"],
    "🇳🇱": ["flag_nl"],
    "🇳🇴": ["flag_no"],
    "🇳🇵": ["flag_np"],
    "🇳🇷": ["flag_nr"],
    "🇳🇺": ["flag_nu"],
    "🇳🇿": ["flag_nz"],
    "🇴🇲": ["flag_om"],
    "🇵🇦": ["flag_pa"],
    "🇵🇪": ["flag_pe"],
    "🇵🇫": ["flag_pf"],
    "🇵🇬": ["flag_pg"],
    "🇵🇭": ["flag_ph"],
    "🇵🇰": ["flag_pk"],
    "🇵🇱": ["flag_pl"],
    "🇵🇲": ["flag_pm"],
    "🇵🇳": ["flag_pn"],
    "🇵🇷": ["flag_pr"],
    "🇵🇸": ["flag_ps"],
    "🇵🇹": ["flag_pt"],
    "🇵🇼": ["flag_pw"],
    "🇵🇾": ["flag_py"],
    "🇶🇦": ["flag_qa"],
    "🇷🇪": ["flag_re"],
    "🇷🇴": ["flag_ro"],
    "🇷🇸": ["flag_rs"],
    "🇷🇺": ["flag_ru"],
    "🇷🇼": ["flag_rw"],
    "🇸🇦": ["flag_sa"],
    "🇸🇧": ["flag_sb"],
    "🇸🇨": ["flag_sc"],
    "🇸🇩": ["flag_sd"],
    "🇸🇪": ["flag_se"],
    "🇸🇬": ["flag_sg"],
    "🇸🇭": ["flag_sh"],
    "🇸🇮": ["flag_si"],
    "🇸🇯": ["flag_sj"],
    "🇸🇰": ["flag_sk"],
    "🇸🇱": ["flag_sl"],
    "🇸🇲": ["flag_sm"],
    "🇸🇳": ["flag_sn"],
    "🇸🇴": ["flag_so"],
    "🇸🇷": ["flag_sr"],
    "🇸🇸": ["flag_ss"],
    "🇸🇹": ["flag_st"],
    "🇸🇻": ["flag_sv"],
    "🇸🇽": ["flag_sx"],
    "🇸🇾": ["flag_sy"],
    "🇸🇿": ["flag_sz"],
    "🇹🇦": ["flag_ta"],
    "🇹🇨": ["flag_tc"],
    "🇹🇩": ["flag_td"],
    "🇹🇫": ["flag_tf"],
    "🇹🇬": ["flag_tg"],
    "🇹🇭": ["flag_th"],
    "🇹🇯": ["flag_tj"],
    "🇹🇰": ["flag_tk"],
    "🇹🇱": ["flag_tl"],
    "🇹🇲": ["flag_tm"],
    "🇹🇳": ["flag_tn"],
    "🇹🇴": ["flag_to"],
    "🇹🇷": ["flag_tr"],
    "🇹🇹": ["flag_tt"],
    "🇹🇻": ["flag_tv"],
    "🇹🇼": ["flag_tw"],
    "🇹🇿": ["flag_tz"],
    "🇺🇦": ["flag_ua"],
    "🇺🇬": ["flag_ug"],
    "🇺🇲": ["flag_um"],
    "🇺🇳": ["flag_un"],
    "🇺🇸": ["flag_us", "usa"],
    "🇺🇾": ["flag_uy"],
    "🇺🇿": ["flag_uz"],
    "🇻🇦": ["flag_va"],
    "🇻🇨": ["flag_vc"],
    "🇻🇪": ["flag_ve"],
    "🇻🇬": ["flag_vg"],
    "🇻🇮": ["flag_vi"],
    "🇻🇳": ["flag_vn"],
    "🇻🇺": ["flag_vu"],
    "🇼🇫": ["flag_wf"],
    "🇼🇸": ["flag_ws"],
    "🇽🇰": ["flag_xk"],
    "🇾🇪": ["flag_ye"],
    "🇾🇹": ["flag_yt"],
    "🇿🇦": ["flag_za"],
    "🇿🇲": ["flag_zm"],
    "🇿🇼": ["flag_zw"],
    "🏴󠁧󠁢󠁥󠁮󠁧󠁿": ["flag_gbeng", "england"],
    "🏴󠁧󠁢󠁳󠁣󠁴󠁿": ["flag_gbsct", "scotland"],
    "🏴󠁧󠁢󠁷󠁬󠁳󠁿": ["flag_gbwls", "wales"]
  };
}, function (e) {
  e.exports = {};
}, function (e, d) {
  e.exports = flarum.core.compat.app;
}, function (e, d) {
  e.exports = flarum.core.compat["components/TextEditorButton"];
}, function (e, d) {
  e.exports = flarum.core.compat["utils/KeyboardNavigatable"];
}, function (e, d) {
  e.exports = flarum.core.compat.Fragment;
}, function (e, d) {
  e.exports = flarum.core.compat["models/Post"];
}, function (e, d, a) {
  "use strict";

  a.r(d);
  var u = a(4);
  var o = a.n(u);
  var n = a(2);
  a(3);
  var r = a(0);
  var t = a(1);
  var c = a.n(t);
  var f = a(5);
  var i = a.n(f);
  var _ = a(6);
  var l = a.n(_);
  function s(e) {
    if (e === undefined) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return e;
  }
  function g(e, d, a) {
    if (d in e) {
      Object.defineProperty(e, d, {
        value: a,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      e[d] = a;
    }
    return e;
  }
  var p = a(7);
  var b = function (e) {
    var d;
    var a;
    function u() {
      var d;
      for (var a = arguments.length, u = new Array(a), o = 0; o < a; o++) {
        u[o] = arguments[o];
      }
      g(s(s(d = e.call.apply(e, [this].concat(u)) || this)), "items", []);
      g(s(s(d)), "active", false);
      g(s(s(d)), "index", 0);
      g(s(s(d)), "keyWasJustPressed", false);
      return d;
    }
    a = e;
    (d = u).prototype = Object.create(a.prototype);
    d.prototype.constructor = d;
    d.__proto__ = a;
    var o = u.prototype;
    o.view = function () {
      return m("ul", {
        className: "Dropdown-menu EmojiDropdown"
      }, m("li", {
        className: "Dropdown-header"
      }, app.translator.trans("flarum-emoji.forum.composer.type_to_search_text")), this.items.map(function (e) {
        return m("li", {
          key: e.attrs.key
        }, e);
      }));
    };
    o.show = function (e, d) {
      this.$().show().css({
        left: e + "px",
        top: d + "px"
      });
      this.active = true;
    };
    o.hide = function () {
      this.$().hide();
      this.active = false;
    };
    o.navigate = function (e) {
      var d = this;
      this.keyWasJustPressed = true;
      this.setIndex(this.index + e, true);
      clearTimeout(this.keyWasJustPressedTimeout);
      this.keyWasJustPressedTimeout = setTimeout(function () {
        return d.keyWasJustPressed = false;
      }, 500);
    };
    o.complete = function () {
      this.$("li:not(.Dropdown-header)").eq(this.index).find("button").click();
    };
    o.setIndex = function (e, d) {
      if (!this.keyWasJustPressed || d) {
        var a = this.$();
        var u = a.find("li:not(.Dropdown-header)");
        var o = e;
        if (o < 0) {
          o = u.length - 1;
        } else if (o >= u.length) {
          o = 0;
        }
        this.index = o;
        var n = u.removeClass("active").eq(o).addClass("active");
        if (d) {
          var r;
          var t = a.scrollTop();
          var c = a.offset().top;
          var f = c + a.outerHeight();
          var i = n.offset().top;
          var _ = i + n.outerHeight();
          if (i < c) {
            r = t - c + i - parseInt(a.css("padding-top"), 10);
          } else if (_ > f) {
            r = t - f + _ + parseInt(a.css("padding-bottom"), 10);
          }
          if (r !== undefined) {
            a.stop(true).animate({
              scrollTop: r
            }, 100);
          }
        }
      }
    };
    return u;
  }(a.n(p).a);
  var h = function () {
    var e = {
      base: "https://twemoji.maxcdn.com/v/13.0.0/",
      ext: ".png",
      size: "72x72",
      className: "emoji",
      convert: {
        fromCodePoint: function (e) {
          var d = typeof e == "string" ? parseInt(e, 16) : e;
          if (d < 65536) {
            return t(d);
          }
          return t(55296 + ((d -= 65536) >> 10), 56320 + (d & 1023));
        },
        toCodePoint: p
      },
      onerror: function () {
        if (this.parentNode) {
          this.parentNode.replaceChild(c(this.alt, false), this);
        }
      },
      parse: function (d, a) {
        if (!a || typeof a == "function") {
          a = {
            callback: a
          };
        }
        return (typeof d == "string" ? l : _)(d, {
          callback: a.callback || f,
          attributes: typeof a.attributes == "function" ? a.attributes : g,
          base: typeof a.base == "string" ? a.base : e.base,
          ext: a.ext || e.ext,
          size: a.folder || (u = a.size || e.size, typeof u == "number" ? u + "x" + u : u),
          className: a.className || e.className,
          onerror: a.onerror || e.onerror
        });
        var u;
      },
      replace: m,
      test: function (e) {
        a.lastIndex = 0;
        var d = a.test(e);
        a.lastIndex = 0;
        return d;
      }
    };
    var d = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      "\"": "&quot;"
    };
    var a = /(?:\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d])|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udeeb\udeec\udef4-\udefc\udfe0-\udfeb]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78\udd7a-\uddb4\uddb7\uddba\uddbc-\uddcb\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7a\ude80-\ude86\ude90-\udea8\udeb0-\udeb6\udec0-\udec2\uded0-\uded6]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g;
    var u = /\uFE0F/g;
    var o = String.fromCharCode(8205);
    var n = /[&<>'"]/g;
    var r = /^(?:iframe|noframes|noscript|script|select|style|textarea)$/;
    var t = String.fromCharCode;
    return e;
    function c(e, d) {
      return document.createTextNode(d ? e.replace(u, "") : e);
    }
    function f(e, d) {
      return `${d.base}${d.size}/${e}${d.ext}`;
    }
    function i(e) {
      return p(e.indexOf(o) < 0 ? e.replace(u, "") : e);
    }
    function _(e, d) {
      var u;
      var o;
      var n;
      for (var t, f, _, l, s, g, m, p, b, h, w = function e(d, a) {
          var u;
          var o;
          var n = d.childNodes;
          for (var t = n.length; t--;) {
            if ((o = (u = n[t]).nodeType) === 3) {
              a.push(u);
            } else if (o === 1 && !("ownerSVGElement" in u) && !r.test(u.nodeName.toLowerCase())) {
              e(u, a);
            }
          }
          return a;
        }(e, []), k = w.length; k--;) {
        n = false;
        t = document.createDocumentFragment();
        _ = (f = w[k]).nodeValue;
        s = 0;
        while (l = a.exec(_)) {
          if ((g = l.index) !== s) {
            t.appendChild(c(_.slice(s, g), true));
          }
          b = i(p = l[0]);
          s = g + p.length;
          h = d.callback(b, d);
          if (b && h) {
            (m = new Image()).onerror = d.onerror;
            m.setAttribute("draggable", "false");
            for (o in u = d.attributes(p, b)) {
              if (u.hasOwnProperty(o) && o.indexOf("on") !== 0 && !m.hasAttribute(o)) {
                m.setAttribute(o, u[o]);
              }
            }
            m.className = d.className;
            m.alt = p;
            m.src = h;
            n = true;
            t.appendChild(m);
          }
          if (!m) {
            t.appendChild(c(p, false));
          }
          m = null;
        }
        if (n) {
          if (s < _.length) {
            t.appendChild(c(_.slice(s), true));
          }
          f.parentNode.replaceChild(t, f);
        }
      }
      return e;
    }
    function l(e, d) {
      return m(e, function (e) {
        var a;
        var u;
        var o = e;
        var r = i(e);
        var t = d.callback(r, d);
        if (r && t) {
          o = `<img class="${d.className}" draggable="false" alt="${e}" src="${t}"`;
          for (u in a = d.attributes(e, r)) {
            if (a.hasOwnProperty(u) && u.indexOf("on") !== 0 && o.indexOf(" " + u + "=") === -1) {
              o = o.concat(" ", u, "=\"", a[u].replace(n, s), "\"");
            }
          }
          o = o.concat("/>");
        }
        return o;
      });
    }
    function s(e) {
      return d[e];
    }
    function g() {
      return null;
    }
    function m(e, d) {
      return String(e).replace(a, d);
    }
    function p(e, d) {
      var a = [];
      var u = 0;
      for (var o = 0, n = 0; n < e.length;) {
        u = e.charCodeAt(n++);
        if (o) {
          a.push((65536 + (o - 55296 << 10) + (u - 56320)).toString(16));
          o = 0;
        } else if (u >= 55296 && u <= 56319) {
          o = u;
        } else {
          a.push(u.toString(16));
        }
      }
      return a.join(d || "-");
    }
  }();
  var w = String.fromCharCode(8205);
  var k = /\uFE0F/g;
  function y(e) {
    return h.convert.toCodePoint(e.indexOf(w) < 0 ? e.replace(k, "") : e);
  }
  var v = "https://cdn.jsdelivr.net/gh/twitter/twemoji@" + /([0-9]+).[0-9]+.[0-9]+/g.exec(h.base)[1] + "/assets/";
  function x() {
    var e = Object.keys(n);
    var d = $("<div class=\"ComposerBody-emojiDropdownContainer\"></div>");
    var a = new b();
    Object(r.extend)(c.a.prototype, "oncreate", function () {
      var e = this.$(".TextEditor-editor").wrap("<div class=\"ComposerBody-emojiWrapper\"></div>");
      this.navigator = new l.a();
      this.navigator.when(function () {
        return a.active;
      }).onUp(function () {
        return a.navigate(-1);
      }).onDown(function () {
        return a.navigate(1);
      }).onSelect(a.complete.bind(a)).onCancel(a.hide.bind(a)).bindTo(e);
      e.after(d);
    });
    Object(r.extend)(c.a.prototype, "buildEditorParams", function (u) {
      var o;
      var r;
      var t;
      var c = this;
      u.inputListeners.push(function (u) {
        var f = app.composer.editor.getSelectionRange();
        var i = f[0];
        if (!(f[1] - i > 0)) {
          var _ = app.composer.editor.getLastNChars(15);
          r = 0;
          for (var l = _.length - 1; l >= 0; l--) {
            var s = _.substr(l, 1);
            if (!/[a-z0-9]|\+|\-|_|\:/.test(s)) {
              break;
            }
            if (s === ":" && (l == 0 || /\s/.test(_.substr(l - 1, 1)))) {
              o = l + 1;
              r = i - _.length + l + 1;
              break;
            }
          }
          a.hide();
          a.active = false;
          if (r) {
            t = _.substring(o).toLowerCase();
            function g(e) {
              var d = e.emoji;
              var u = e.name;
              var o = e.code;
              return m("button", {
                key: d,
                onclick: function () {
                  e = d;
                  c.attrs.composer.editor.replaceBeforeCursor(r - 1, e + " ");
                  a.hide();
                  return;
                  var e;
                },
                onmouseenter: function () {
                  a.setIndex($(this).parent().index() - 1);
                }
              }, m("img", {
                alt: d,
                class: "emoji",
                draggable: "false",
                loading: "lazy",
                src: v + "72x72/" + o + ".png"
              }), u);
            }
            (function () {
              var u;
              var o;
              var c = [];
              u = t;
              o = new RegExp("\\(([" + "+.*?[]{}()^$|\\".replace(/(.)/g, "\\$1") + "])\\)", "g");
              var f = new RegExp("(.*)" + u.toLowerCase().replace(/(.)/g, "($1)(.*?)").replace(o, "(\\$1)") + "$", "i");
              var i = 7;
              function _(d) {
                for (var a = 0; a < e.length && i > 0; a++) {
                  var u = e[a];
                  if (c.indexOf(u) === -1) {
                    var o = n[u];
                    var r = Array.isArray(o);
                    var t = 0;
                    for (o = r ? o : o[Symbol.iterator]();;) {
                      var f;
                      if (r) {
                        if (t >= o.length) {
                          break;
                        }
                        f = o[t++];
                      } else {
                        if ((t = o.next()).done) {
                          break;
                        }
                        f = t.value;
                      }
                      if (d(f)) {
                        --i;
                        c.push(u);
                        break;
                      }
                    }
                  }
                }
              }
              _(function (e) {
                return e.indexOf(t) === 0;
              });
              _(function (e) {
                return f.test(e);
              });
              var l = c.map(function (e) {
                return {
                  emoji: e,
                  name: n[e][0],
                  code: y(e)
                };
              }).map(g);
              if (l.length) {
                a.items = l;
                m.render(d[0], a.render());
                a.show();
                var s = app.composer.editor.getCaretCoordinates(r);
                var p = a.$().outerWidth();
                var b = a.$().outerHeight();
                var h = a.$().offsetParent();
                var w = s.left;
                var k = s.top + 15;
                if (k + b > h.height()) {
                  k = s.top - b - 15;
                }
                if (w + p > h.width()) {
                  w = h.width() - p;
                }
                k = Math.max(-(h.offset().top - $(document).scrollTop()), k);
                w = Math.max(-h.offset().left, w);
                a.show(w, k);
              }
            })();
            a.setIndex(0);
            a.$().scrollTop(0);
            a.active = true;
          }
        }
      });
    });
    Object(r.extend)(c.a.prototype, "toolbarItems", function (e) {
      var d = this;
      e.add("emoji", m(i.a, {
        onclick: function () {
          return d.attrs.composer.editor.insertAtCursor(" :");
        },
        icon: "far fa-smile"
      }, app.translator.trans("flarum-emoji.forum.composer.emoji_tooltip")));
    });
  }
  var j = a(8);
  var z = a.n(j);
  var q = {
    base: v,
    attributes: function () {
      return {
        loading: "lazy"
      };
    }
  };
  o.a.initializers.add("flarum-emoji", function () {
    x();
    Object(r.override)(z.a.prototype, "contentHtml", function (e) {
      var d = e();
      if (this.oldContentHtml !== d) {
        this.emojifiedContentHtml = h.parse(d, q);
        this.oldContentHtml = d;
      }
      return this.emojifiedContentHtml;
    });
    Object(r.override)(s9e.TextFormatter, "preview", function (e, d, a) {
      e(d, a);
      h.parse(a, q);
    });
  });
}]);
flarum.extensions["flarum-emoji"] = module.exports;
var module = {};
module.exports = function (t) {
  var o = {};
  function e(r) {
    if (o[r]) {
      return o[r].exports;
    }
    var n = o[r] = {
      i: r,
      l: false,
      exports: {}
    };
    t[r].call(n.exports, n, n.exports, e);
    n.l = true;
    return n.exports;
  }
  e.m = t;
  e.c = o;
  e.d = function (t, o, r) {
    if (!e.o(t, o)) {
      Object.defineProperty(t, o, {
        enumerable: true,
        get: r
      });
    }
  };
  e.r = function (t) {
    if (typeof Symbol != "undefined" && Symbol.toStringTag) {
      Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(t, "__esModule", {
      value: true
    });
  };
  e.t = function (t, o) {
    if (o & 1) {
      t = e(t);
    }
    if (o & 8) {
      return t;
    }
    if (o & 4 && typeof t == "object" && t && t.__esModule) {
      return t;
    }
    var r = Object.create(null);
    e.r(r);
    Object.defineProperty(r, "default", {
      enumerable: true,
      value: t
    });
    if (o & 2 && typeof t != "string") {
      for (var n in t) {
        e.d(r, n, function (o) {
          return t[o];
        }.bind(null, n));
      }
    }
    return r;
  };
  e.n = function (t) {
    var o = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    e.d(o, "a", o);
    return o;
  };
  e.o = function (t, o) {
    return Object.prototype.hasOwnProperty.call(t, o);
  };
  e.p = "";
  return e(e.s = 10);
}([function (t, o) {
  t.exports = flarum.core.compat.app;
}, function (t, o) {
  t.exports = flarum.core.compat.extend;
}, function (t, o) {
  t.exports = flarum.core.compat["models/Post"];
}, function (t, o) {
  t.exports = flarum.core.compat["models/Discussion"];
}, function (t, o) {
  t.exports = flarum.core.compat["utils/PostControls"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/Post"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/Badge"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/DiscussionListItem"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/CommentPost"];
}, function (t, o) {
  t.exports = flarum.core.compat["components/Button"];
}, function (t, o, e) {
  "use strict";

  e.r(o);
  var r = e(1);
  var n = e(0);
  var a = e.n(n);
  var p = e(3);
  var s = e.n(p);
  var i = e(2);
  var u = e.n(i);
  var c = e(6);
  var l = e.n(c);
  var f = e(7);
  var d = e.n(f);
  var v = e(5);
  var b = e.n(v);
  var x = e(8);
  var y = e.n(x);
  var A = e(9);
  var g = e.n(A);
  var h = e(4);
  var _ = e.n(h);
  a.a.initializers.add("flarum-approval", function () {
    s.a.prototype.isApproved = s.a.attribute("isApproved");
    Object(r.extend)(s.a.prototype, "badges", function (t) {
      if (!this.isApproved() && !t.has("hidden")) {
        t.add("awaitingApproval", m(l.a, {
          type: "awaitingApproval",
          icon: "fas fa-gavel",
          label: a.a.translator.trans("flarum-approval.forum.badge.awaiting_approval_tooltip")
        }));
      }
    });
    u.a.prototype.isApproved = u.a.attribute("isApproved");
    u.a.prototype.canApprove = u.a.attribute("canApprove");
    Object(r.extend)(d.a.prototype, "elementAttrs", function (t) {
      if (!this.attrs.discussion.isApproved()) {
        t.className += " DiscussionListItem--unapproved";
      }
    });
    Object(r.extend)(b.a.prototype, "elementAttrs", function (t) {
      if (!this.attrs.post.isApproved()) {
        t.className += " Post--unapproved";
      }
    });
    Object(r.extend)(y.a.prototype, "headerItems", function (t) {
      if (!this.attrs.post.isApproved() && !this.attrs.post.isHidden()) {
        t.add("unapproved", a.a.translator.trans("flarum-approval.forum.post.awaiting_approval_text"));
      }
    });
    Object(r.override)(b.a.prototype, "flagReason", function (t, o) {
      if (o.type() === "approval") {
        return a.a.translator.trans("flarum-approval.forum.post.awaiting_approval_text");
      } else {
        return t(o);
      }
    });
    Object(r.extend)(_.a, "destructiveControls", function (t, o) {
      if (!o.isApproved() && o.canApprove()) {
        t.add("approve", m(g.a, {
          icon: "fas fa-check",
          onclick: _.a.approveAction.bind(o)
        }, a.a.translator.trans("flarum-approval.forum.post_controls.approve_button")), 10);
      }
    });
    _.a.approveAction = function () {
      this.save({
        isApproved: true
      });
      if (this.number() === 1) {
        this.discussion().pushAttributes({
          isApproved: true
        });
      }
    };
  }, -10);
}]);
flarum.extensions["flarum-approval"] = module.exports;
var module = {};
"use strict";
class ForceURL {
  constructor(url) {
    this.parse(url);
  }
  toString() {
    if (this.data instanceof URL) {
      return this.data.toString();
    } else {
      return this.data.href;
    }
  }
  get host() {
    return this.data.host;
  }
  get path() {
    return this.data.href.substr(this.data.origin.length);
  }
  get protocol() {
    return this.data.protocol;
  }
  parse(input) {
    try {
      this.data = new URL(input, location);
    } catch (err) {
      this.data = {
        href: input,
        host: "",
        pathname: "",
        protocol: "http:"
      };
    }
    ;
    return this;
  }
}
;
class FlarumImageProxy {
  constructor() {
    this.parser = new DOMParser();
    this.hook();
  }
  safe(url) {
    if (!(url instanceof ForceURL)) {
      throw new TypeError("Bad URL");
    }
    if (url.host == location.host) {
      return true;
    }
    return false;
  }
  parse_html(html) {
    if (typeof html != "string" || !html.length) {
      return "";
    }
    var frag = this.parser.parseFromString(`<body>${html}</body>`, "text/html");
    ;
    for (let node of frag.querySelectorAll("img[src]")) {
      let src = new ForceURL(node.src);
      if (!this.safe(src)) {
        if (!node.alt) {
          node.alt = node.src;
        }
        node.src = "/proxy.php?url=" + encodeURIComponent(src.toString());
      }
    }
    return frag.body.innerHTML;
  }
  hook() {
    var self = this;
    var orig = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
    Object.defineProperty(Element.prototype, "innerHTML", {
      get() {
        return orig.get.call(this);
      },
      set(value) {
        return orig.set.call(this, self.parse_html(value));
      }
    });
  }
}
;
module.exports = new FlarumImageProxy();
flarum.extensions["site-custom"] = module.exports;

//# sourceMappingURL=https://forum.sys32.dev/assets/forum.js.map