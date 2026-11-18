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
import * as s from "./0.js";
var n = s;
import * as r from "./1.js";
var l = r;
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
}(l);
e(c.prototype, {
  type: l.attribute("type"),
  reason: l.attribute("reason"),
  reasonDetail: l.attribute("reasonDetail"),
  createdAt: l.attribute("createdAt", l.transformDate),
  post: l.hasOne("post"),
  user: l.hasOne("user")
});
var u = c;
import * as p from "./8.js";
var f = p;
import * as d from "./9.js";
var g = d;
import * as h from "./10.js";
var v = h;
import * as b from "./11.js";
var _ = b;
import * as y from "./12.js";
var x = y;
import * as N from "./13.js";
var F = N;
import * as k from "./14.js";
var w = k;
import * as C from "./15.js";
var D = C;
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
      return m("li", null, m(v, {
        href: app.route.post(a),
        className: "Notification Flag",
        onclick: function (t) {
          app.flags.index = a;
          t.redraw = false;
        }
      }, x(a.user()), w("fas fa-flag", {
        className: "Notification-icon"
      }), m("span", {
        className: "Notification-content"
      }, app.translator.trans("flarum-flags.forum.flagged_posts.item_text", {
        username: F(a.user()),
        em: m("em", null),
        discussion: a.discussion().title()
      })), D(t.createdAt()), m("div", {
        className: "Notification-excerpt"
      }, a.contentPlain())));
    }) : this.state.loading ? _.component({
      className: "LoadingIndicator--block"
    }) : m("div", {
      className: "NotificationList-empty"
    }, app.translator.trans("flarum-flags.forum.flagged_posts.empty_text")))));
  };
  return a;
}(g);
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
}(f);
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
import * as j from "./3.js";
import * as M from "./6.js";
var L = M;
import * as B from "./4.js";
var T = B;
import * as S from "./16.js";
var E = S;
import * as I from "./7.js";
var H = I;
import * as R from "./2.js";
var U = R;
var G = function (t) {
  function a() {
    return t.apply(this, arguments) || this;
  }
  i(a, t);
  var o = a.prototype;
  o.oninit = function (a) {
    t.prototype.oninit.call(this, a);
    this.success = false;
    this.reason = H("");
    this.reasonDetail = H("");
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
      }, m(T, {
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
      onclick: U("value", this.reason)
    }), m("strong", null, app.translator.trans("flarum-flags.forum.flag_post.reason_off_topic_label")), app.translator.trans("flarum-flags.forum.flag_post.reason_off_topic_text"), this.reason() === "off_topic" ? m("textarea", {
      className: "FormControl",
      placeholder: app.translator.trans("flarum-flags.forum.flag_post.reason_details_placeholder"),
      value: this.reasonDetail(),
      oninput: U("value", this.reasonDetail)
    }) : ""), m("label", {
      className: "checkbox"
    }, m("input", {
      type: "radio",
      name: "reason",
      checked: this.reason() === "inappropriate",
      value: "inappropriate",
      onclick: U("value", this.reason)
    }), m("strong", null, app.translator.trans("flarum-flags.forum.flag_post.reason_inappropriate_label")), app.translator.trans("flarum-flags.forum.flag_post.reason_inappropriate_text", {
      a: t ? m("a", {
        href: t,
        target: "_blank"
      }) : undefined
    }), this.reason() === "inappropriate" ? m("textarea", {
      className: "FormControl",
      placeholder: app.translator.trans("flarum-flags.forum.flag_post.reason_details_placeholder"),
      value: this.reasonDetail(),
      oninput: U("value", this.reasonDetail)
    }) : ""), m("label", {
      className: "checkbox"
    }, m("input", {
      type: "radio",
      name: "reason",
      checked: this.reason() === "spam",
      value: "spam",
      onclick: U("value", this.reason)
    }), m("strong", null, app.translator.trans("flarum-flags.forum.flag_post.reason_spam_label")), app.translator.trans("flarum-flags.forum.flag_post.reason_spam_text"), this.reason() === "spam" ? m("textarea", {
      className: "FormControl",
      placeholder: app.translator.trans("flarum-flags.forum.flag_post.reason_details_placeholder"),
      value: this.reasonDetail(),
      oninput: U("value", this.reasonDetail)
    }) : ""), m("label", {
      className: "checkbox"
    }, m("input", {
      type: "radio",
      name: "reason",
      checked: this.reason() === "other",
      value: "other",
      onclick: U("value", this.reason)
    }), m("strong", null, app.translator.trans("flarum-flags.forum.flag_post.reason_other_label")), this.reason() === "other" ? m("textarea", {
      className: "FormControl",
      value: this.reasonDetail(),
      oninput: U("value", this.reasonDetail)
    }) : ""))), m("div", {
      className: "Form-group"
    }, m(T, {
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
}(E);
function q() {
  Object(j.extend)(L, "userControls", function (t, a) {
    if (!a.isHidden() && a.contentType() === "comment" && a.canFlag()) {
      t.add("flag", m(T, {
        icon: "fas fa-flag",
        onclick: function () {
          return n.modal.show(G, {
            post: a
          });
        }
      }, n.translator.trans("flarum-flags.forum.post_controls.flag_button")));
    }
  });
}
import * as z from "./17.js";
var V = z;
import * as J from "./18.js";
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
}(J);
function Q() {
  Object(j.extend)(V.prototype, "items", function (t) {
    if (n.forum.attribute("canViewFlags")) {
      t.add("flags", m(K, {
        state: n.flags
      }), 15);
    }
  });
}
import * as W from "./5.js";
var X = W;
import * as Y from "./19.js";
var Z = Y;
import * as $ from "./20.js";
var tt = $;
function at() {
  Object(j.extend)(X.prototype, "elementAttrs", function (t) {
    if (this.attrs.post.flags().length) {
      t.className += " Post--flagged";
    }
  });
  X.prototype.dismissFlag = function (t) {
    var a = this.attrs.post;
    delete a.data.relationships.flags;
    this.subtree.invalidate();
    if (n.flags.cache) {
      n.flags.cache.some(function (t, o) {
        if (t.post() === a) {
          n.flags.cache.splice(o, 1);
          if (n.flags.index === a) {
            var e = n.flags.cache[o];
            e ||= n.flags.cache[0];
            if (e) {
              var s = e.post();
              n.flags.index = s;
              m.route.set(n.route.post(s));
            }
          }
          return true;
        }
      });
    }
    return n.request({
      url: n.forum.attribute("apiUrl") + a.apiEndpoint() + "/flags",
      method: "DELETE",
      body: t
    });
  };
  X.prototype.flagActionItems = function () {
    var t = this;
    var a = new Z();
    var o = L.destructiveControls(this.attrs.post);
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
    a.add("dismiss", m(T, {
      className: "Button",
      icon: "far fa-eye-slash",
      onclick: this.dismissFlag.bind(this)
    }, n.translator.trans("flarum-flags.forum.post.dismiss_flag_button")), -100);
    return a;
  };
  Object(j.extend)(X.prototype, "content", function (t) {
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
  X.prototype.flagReason = function (t) {
    if (t.type() === "user") {
      var a = t.user();
      var o = t.reason();
      var e = t.reasonDetail();
      var s = tt(t.createdAt());
      return [n.translator.trans(o ? "flarum-flags.forum.post.flagged_by_with_reason_text" : "flarum-flags.forum.post.flagged_by_text", {
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
import * as et from "./21.js";
n.initializers.add("flarum-flags", function () {
  n.store.models.posts.prototype.flags = l.hasMany("flags");
  n.store.models.posts.prototype.canFlag = l.attribute("canFlag");
  n.store.models.flags = u;
  n.routes.flags = {
    path: "/flags",
    component: O
  };
  n.flags = new A(n);
  q();
  Q();
  at();
});
e(et.compat, ot);