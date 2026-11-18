const r = flarum.core.compat["forum/app"];
var a = r;
const o = flarum.core.compat["common/Model"];
var s = o;
const i = flarum.core.compat["common/models/Discussion"];
var c = i;
const u = flarum.core.compat["forum/components/IndexPage"];
var l = u;
function d(t, e) {
  d = Object.setPrototypeOf || function (t, e) {
    t.__proto__ = e;
    return t;
  };
  return d(t, e);
}
function f(t, e) {
  t.prototype = Object.create(e.prototype);
  t.prototype.constructor = t;
  d(t, e);
}
const p = flarum.core.compat["common/utils/computed"];
var h = p;
var g = function (t) {
  function e() {
    return t.apply(this, arguments) || this;
  }
  f(e, t);
  var n = e.prototype;
  n.name = function () {
    return s.attribute("name").call(this);
  };
  n.slug = function () {
    return s.attribute("slug").call(this);
  };
  n.description = function () {
    return s.attribute("description").call(this);
  };
  n.color = function () {
    return s.attribute("color").call(this);
  };
  n.backgroundUrl = function () {
    return s.attribute("backgroundUrl").call(this);
  };
  n.backgroundMode = function () {
    return s.attribute("backgroundMode").call(this);
  };
  n.icon = function () {
    return s.attribute("icon").call(this);
  };
  n.position = function () {
    return s.attribute("position").call(this);
  };
  n.parent = function () {
    return s.hasOne("parent").call(this);
  };
  n.children = function () {
    return s.hasMany("children").call(this);
  };
  n.defaultSort = function () {
    return s.attribute("defaultSort").call(this);
  };
  n.isChild = function () {
    return s.attribute("isChild").call(this);
  };
  n.isHidden = function () {
    return s.attribute("isHidden").call(this);
  };
  n.discussionCount = function () {
    return s.attribute("discussionCount").call(this);
  };
  n.lastPostedAt = function () {
    return s.attribute("lastPostedAt", s.transformDate).call(this);
  };
  n.lastPostedDiscussion = function () {
    return s.hasOne("lastPostedDiscussion").call(this);
  };
  n.isRestricted = function () {
    return s.attribute("isRestricted").call(this);
  };
  n.canStartDiscussion = function () {
    return s.attribute("canStartDiscussion").call(this);
  };
  n.canAddToDiscussion = function () {
    return s.attribute("canAddToDiscussion").call(this);
  };
  n.isPrimary = function () {
    return h("position", "parent", function (t, e) {
      return t !== null && e === false;
    }).call(this);
  };
  return e;
}(s);
const v = flarum.core.compat["common/components/Page"];
var y = v;
const T = flarum.core.compat["common/components/Link"];
var b = T;
const x = flarum.core.compat["common/components/LoadingIndicator"];
var w = x;
const N = flarum.core.compat["common/helpers/listItems"];
var _ = N;
const L = flarum.core.compat["common/helpers/humanTime"];
var P = L;
const I = flarum.core.compat["common/utils/classList"];
var C = I;
function k(t, e = {}, n = {}) {
  var r = t && t.icon();
  var a = n.useColor;
  var o = a === undefined || a;
  e.className = C([e.className, "icon", r ? t.icon() : "TagIcon"]);
  if (t && o) {
    e.style = e.style || {};
    e.style["--color"] = t.color();
    if (r) {
      e.style.color = t.color();
    }
  } else if (!t) {
    e.className += " untagged";
  }
  if (r) {
    return m("i", e);
  } else {
    return m("span", e);
  }
}
const D = flarum.core.compat["common/utils/extract"];
var S = D;
function E(t, e = {}) {
  e.style = e.style || {};
  e.className = "TagLabel " + (e.className || "");
  var n = S(e, "link");
  var r = t ? t.name() : app.translator.trans("flarum-tags.lib.deleted_tag_text");
  if (t) {
    var a = t.color();
    if (a) {
      e.style["--tag-bg"] = a;
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
  return m(n ? b : "span", e, m("span", {
    className: "TagLabel-text"
  }, t && t.icon() && k(t, {}, {
    useColor: false
  }), " ", r));
}
function O(t) {
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
var A = function (t) {
  function e() {
    return t.apply(this, arguments) || this;
  }
  f(e, t);
  var n = e.prototype;
  n.oninit = function (e) {
    var n = this;
    t.prototype.oninit.call(this, e);
    app.history.push("tags", app.translator.trans("flarum-tags.forum.header.back_to_tags_tooltip"));
    this.tags = [];
    var r = app.preloadedApiDocument();
    if (r) {
      this.tags = O(r.filter(function (t) {
        return !t.isChild();
      }));
    } else {
      this.loading = true;
      app.tagList.load(["children", "lastPostedDiscussion", "parent"]).then(function () {
        n.tags = O(app.store.all("tags").filter(function (t) {
          return !t.isChild();
        }));
        n.loading = false;
        m.redraw();
      });
    }
  };
  n.view = function () {
    if (this.loading) {
      return m(w, null);
    }
    var t = this.tags.filter(function (t) {
      return t.position() !== null;
    });
    var e = this.tags.filter(function (t) {
      return t.position() === null;
    });
    return m("div", {
      className: "TagsPage"
    }, l.prototype.hero(), m("div", {
      className: "container"
    }, m("nav", {
      className: "TagsPage-nav IndexPage-nav sideNav"
    }, m("ul", null, _(l.prototype.sidebarItems().toArray()))), m("div", {
      className: "TagsPage-content sideNavOffset"
    }, m("ul", {
      className: "TagTiles"
    }, t.map(function (t) {
      var e = t.lastPostedDiscussion();
      var n = O(t.children() || []);
      return m("li", {
        className: "TagTile " + (t.color() ? "colored" : ""),
        style: {
          "--tag-bg": t.color()
        }
      }, m(b, {
        className: "TagTile-info",
        href: app.route.tag(t)
      }, t.icon() && k(t, {}, {
        useColor: false
      }), m("h3", {
        className: "TagTile-name"
      }, t.name()), m("p", {
        className: "TagTile-description"
      }, t.description()), n ? m("div", {
        className: "TagTile-children"
      }, n.map(function (t) {
        return [m(b, {
          href: app.route.tag(t)
        }, t.name()), " "];
      })) : ""), e ? m(b, {
        className: "TagTile-lastPostedDiscussion",
        href: app.route.discussion(e, e.lastPostNumber())
      }, m("span", {
        className: "TagTile-lastPostedDiscussion-title"
      }, e.title()), P(e.lastPostedAt())) : m("span", {
        className: "TagTile-lastPostedDiscussion"
      }));
    })), e.length ? m("div", {
      className: "TagCloud"
    }, e.map(function (t) {
      return [E(t, {
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
}(y);
const j = flarum.core.compat["forum/components/EventPost"];
function R(t, e = {}) {
  var n = [];
  var r = S(e, "link");
  e.className = "TagsLabel " + (e.className || "");
  if (t) {
    O(t).forEach(function (e) {
      if (e || t.length === 1) {
        n.push(E(e, {
          link: r
        }));
      }
    });
  } else {
    n.push(E());
  }
  return m("span", e, n);
}
var M = function (t) {
  function e() {
    return t.apply(this, arguments) || this;
  }
  f(e, t);
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
        tags: R(this.attrs.tagsAdded, {
          link: true
        }),
        count: this.attrs.tagsAdded.length
      });
    }
    if (this.attrs.tagsRemoved.length) {
      t.tagsRemoved = app.translator.trans("flarum-tags.forum.post_stream.tags_text", {
        tags: R(this.attrs.tagsRemoved, {
          link: true
        }),
        count: this.attrs.tagsRemoved.length
      });
    }
    return t;
  };
  return e;
}(j);
function q(t, e, n, r, a, o, s) {
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
var B = require("./126.js");
var H = B;
var F = function () {
  function t() {
    this.loadedIncludes = new Set();
  }
  t.prototype.load = function () {
    var t;
    t = H.mark(function t(e) {
      var n;
      var r = this;
      return H.wrap(function (t) {
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
              return t.abrupt("return", Promise.resolve(a.store.all("tags")));
            case 4:
              return t.abrupt("return", a.store.find("tags", {
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
          q(o, r, a, s, i, "next", t);
        }
        function i(t) {
          q(o, r, a, s, i, "throw", t);
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
const G = flarum.core.compat["common/extend"];
const K = flarum.core.compat["common/components/Separator"];
var $ = K;
const U = flarum.core.compat["common/components/LinkButton"];
var Y = U;
var z = function (t) {
  function e() {
    return t.apply(this, arguments) || this;
  }
  f(e, t);
  e.prototype.view = function (t) {
    var e = this.attrs.model;
    this.constructor.isActive(this.attrs);
    var n = e && e.description();
    var r = C(["TagLinkButton", "hasIcon", this.attrs.className, e.isChild() && "child"]);
    return m(b, {
      className: r,
      href: this.attrs.route,
      style: e ? {
        "--color": e.color()
      } : "",
      title: n || ""
    }, k(e, {
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
}(Y);
function J() {
  (0, G.extend)(l.prototype, "navItems", function (t) {
    t.add("tags", m(Y, {
      icon: "fas fa-th-large",
      href: app.route("tags")
    }, app.translator.trans("flarum-tags.forum.index.tags_link")), -10);
    if (!app.current.matches(A)) {
      t.add("separator", $.component(), -12);
      var e = app.search.stickyParams();
      var n = app.store.all("tags");
      var r = this.currentTag();
      function a(n) {
        var a = r === n;
        if (!a && r) {
          a = r.parent() === n;
        }
        t.add("tag" + n.id(), z.component({
          model: n,
          params: e,
          active: a
        }, n == null ? undefined : n.name()), -14);
      }
      O(n).filter(function (t) {
        return t.position() !== null && (!t.isChild() || r && (t.parent() === r || t.parent() === r.parent()));
      }).forEach(a);
      var o = n.filter(function (t) {
        return t.position() === null;
      }).sort(function (t, e) {
        return e.discussionCount() - t.discussionCount();
      });
      o.splice(0, 3).forEach(a);
      if (o.length) {
        t.add("moreTags", m(Y, {
          href: app.route("tags")
        }, app.translator.trans("flarum-tags.forum.index.more_link")), -16);
      }
    }
  });
}
const Q = flarum.core.compat["forum/states/DiscussionListState"];
var V = Q;
const W = flarum.core.compat["forum/states/GlobalSearchState"];
var X = W;
const Z = flarum.core.compat["common/Component"];
var tt = Z;
var et = function (t) {
  function e() {
    return t.apply(this, arguments) || this;
  }
  f(e, t);
  e.prototype.view = function () {
    var t = this.attrs.model;
    var e = t.color();
    return m("header", {
      className: "Hero TagHero" + (e ? " TagHero--colored" : ""),
      style: e ? {
        "--hero-bg": e
      } : ""
    }, m("div", {
      className: "container"
    }, m("div", {
      className: "containerNarrow"
    }, m("h2", {
      className: "Hero-title"
    }, t.icon() && k(t, {}, {
      useColor: false
    }), " ", t.name()), m("div", {
      className: "Hero-subtitle"
    }, t.description()))));
  };
  return e;
}(tt);
function nt(t) {
  return a.store.all("tags").find(function (e) {
    return e.slug().localeCompare(t, undefined, {
      sensitivity: "base"
    }) === 0;
  });
}
function rt() {
  l.prototype.currentTag = function () {
    var t = this;
    if (this.currentActiveTag) {
      return this.currentActiveTag;
    }
    var e = a.search.params().tags;
    var n = null;
    if (e) {
      n = nt(e);
    }
    if (e && !n || n && !n.isChild() && !n.children()) {
      if (this.currentTagLoading) {
        return;
      }
      this.currentTagLoading = true;
      a.store.find("tags", e, {
        include: "children,children.parent,parent,state"
      }).then(function () {
        t.currentActiveTag = nt(e);
        m.redraw();
      }).finally(function () {
        t.currentTagLoading = false;
      });
    }
    if (n) {
      this.currentActiveTag = n;
      return this.currentActiveTag;
    } else {
      return undefined;
    }
  };
  (0, G.override)(l.prototype, "hero", function (t) {
    var e = this.currentTag();
    if (e) {
      return m(et, {
        model: e
      });
    } else {
      return t();
    }
  });
  (0, G.extend)(l.prototype, "view", function (t) {
    var e = this.currentTag();
    if (e) {
      t.attrs.className += " IndexPage--tag" + e.id();
    }
  });
  (0, G.extend)(l.prototype, "setTitle", function () {
    var t = this.currentTag();
    if (t) {
      a.setTitle(t.name());
    }
  });
  (0, G.extend)(l.prototype, "sidebarItems", function (t) {
    var e = this.currentTag();
    if (e) {
      var n = e.color();
      var r = e.canStartDiscussion() || !a.session.user;
      var o = t.get("newDiscussion");
      if (n) {
        o.attrs.className = C([o.attrs.className, "Button--tagColored"]);
        o.attrs.style = {
          "--color": n
        };
      }
      o.attrs.disabled = !r;
      o.children = a.translator.trans(r ? "core.forum.index.start_discussion_button" : "core.forum.index.cannot_start_discussion_button");
    }
  });
  (0, G.extend)(X.prototype, "params", function (t) {
    t.tags = m.route.param("tags");
  });
  (0, G.extend)(V.prototype, "requestParams", function (t) {
    var e;
    if (typeof t.include == "string") {
      t.include = [t.include];
    } else if ((e = t.include) != null) {
      e.push("tags", "tags.parent");
    }
    if (this.params.tags) {
      var r = t.filter ?? {};
      r.tag = this.params.tags;
      var a = r.q;
      if (a) {
        r.q = a + " tag:" + this.params.tags;
      }
      t.filter = r;
    }
  });
}
const at = flarum.core.compat["forum/components/DiscussionListItem"];
var ot = at;
const st = flarum.core.compat["forum/components/DiscussionHero"];
var it = st;
function ct() {
  (0, G.extend)(ot.prototype, "infoItems", function (t) {
    var e = this.attrs.discussion.tags();
    if (e && e.length) {
      t.add("tags", R(e), 10);
    }
  });
  (0, G.extend)(it.prototype, "view", function (t) {
    var e = O(this.attrs.discussion.tags());
    if (e && e.length) {
      var n = e[0].color();
      if (n) {
        t.attrs.style = {
          "--hero-bg": n
        };
        t.attrs.className += " DiscussionHero--colored";
      }
    }
  });
  (0, G.extend)(it.prototype, "items", function (t) {
    var e = this.attrs.discussion.tags();
    if (e && e.length) {
      t.add("tags", R(e, {
        link: true
      }), 5);
    }
  });
}
const ut = flarum.core.compat["forum/utils/DiscussionControls"];
var lt = ut;
const mt = flarum.core.compat["common/components/Button"];
var dt = mt;
const ft = flarum.core.compat["common/components/Modal"];
var pt = ft;
const ht = flarum.core.compat["forum/components/DiscussionPage"];
var gt = ht;
const vt = flarum.core.compat["common/helpers/highlight"];
var yt = vt;
const Tt = flarum.core.compat["common/utils/extractText"];
var bt = Tt;
const xt = flarum.core.compat["forum/utils/KeyboardNavigatable"];
var wt = xt;
const Nt = flarum.core.compat["common/utils/Stream"];
var _t = Nt;
function Lt(t) {
  var e = app.store.all("tags");
  if (t) {
    return e.filter(function (e) {
      return e.canAddToDiscussion() || t.tags().indexOf(e) !== -1;
    });
  } else {
    return e.filter(function (t) {
      return t.canStartDiscussion();
    });
  }
}
var Pt = ["className", "isToggled"];
var It = function (t) {
  function e() {
    return t.apply(this, arguments) || this;
  }
  f(e, t);
  e.prototype.view = function (t) {
    var e = this.attrs;
    var n = e.className;
    var r = e.isToggled;
    var a = function (t, e) {
      if (t == null) {
        return {};
      }
      var n;
      var r;
      var a = {};
      var o = Object.keys(t);
      for (r = 0; r < o.length; r++) {
        n = o[r];
        if (!(e.indexOf(n) >= 0)) {
          a[n] = t[n];
        }
      }
      return a;
    }(e, Pt);
    var o = r ? "far fa-check-circle" : "far fa-circle";
    return m(dt, Object.assign({}, a, {
      icon: o,
      className: C([n, r && "Button--toggled"])
    }), t.children);
  };
  return e;
}(tt);
var Ct = function (t) {
  function e() {
    var e;
    for (var n = arguments.length, r = new Array(n), o = 0; o < n; o++) {
      r[o] = arguments[o];
    }
    (e = t.call.apply(t, [this].concat(r)) || this).tagsLoading = true;
    e.selected = [];
    e.filter = _t("");
    e.focused = false;
    e.minPrimary = a.forum.attribute("minPrimaryTags");
    e.maxPrimary = a.forum.attribute("maxPrimaryTags");
    e.minSecondary = a.forum.attribute("minSecondaryTags");
    e.maxSecondary = a.forum.attribute("maxSecondaryTags");
    e.bypassReqs = false;
    e.navigator = new wt();
    e.tags = undefined;
    e.selectedTag = undefined;
    return e;
  }
  f(e, t);
  var n = e.prototype;
  n.oninit = function (e) {
    var n = this;
    t.prototype.oninit.call(this, e);
    this.navigator.onUp(function () {
      return n.setIndex(n.getCurrentNumericIndex() - 1, true);
    }).onDown(function () {
      return n.setIndex(n.getCurrentNumericIndex() + 1, true);
    }).onSelect(this.select.bind(this)).onRemove(function () {
      return n.selected.splice(n.selected.length - 1, 1);
    });
    a.tagList.load(["parent"]).then(function () {
      var t;
      n.tagsLoading = false;
      var e = O(Lt(n.attrs.discussion));
      n.tags = e;
      var r = (t = n.attrs.discussion) == null ? undefined : t.tags();
      if (n.attrs.selectedTags) {
        n.attrs.selectedTags.map(n.addTag.bind(n));
      } else if (r) {
        r.forEach(function (t) {
          return t && n.addTag(t);
        });
      }
      n.selectedTag = e[0];
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
      if (e && !this.selected.includes(e)) {
        this.selected.push(e);
      }
      if (!this.selected.includes(t)) {
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
      return a.translator.trans("flarum-tags.forum.choose_tags.edit_title", {
        title: m("em", null, this.attrs.discussion.title())
      });
    } else {
      return a.translator.trans("flarum-tags.forum.choose_tags.title");
    }
  };
  n.getInstruction = function (t, e) {
    if (this.bypassReqs) {
      return "";
    }
    if (t < this.minPrimary) {
      var n = this.minPrimary - t;
      return a.translator.trans("flarum-tags.forum.choose_tags.choose_primary_placeholder", {
        count: n
      });
    }
    if (e < this.minSecondary) {
      var r = this.minSecondary - e;
      return a.translator.trans("flarum-tags.forum.choose_tags.choose_secondary_placeholder", {
        count: r
      });
    }
    return "";
  };
  n.content = function () {
    var t = this;
    if (this.tagsLoading || !this.tags) {
      return m(w, null);
    }
    var e = this.tags;
    var n = this.filter().toLowerCase();
    var r = this.primaryCount();
    var o = this.secondaryCount();
    e = e.filter(function (e) {
      var n = e.parent();
      return n !== null && (n === false || t.selected.includes(n));
    });
    if (r >= this.maxPrimary && !this.bypassReqs) {
      e = e.filter(function (e) {
        return !e.isPrimary() || t.selected.includes(e);
      });
    }
    if (o >= this.maxSecondary && !this.bypassReqs) {
      e = e.filter(function (e) {
        return e.isPrimary() || t.selected.includes(e);
      });
    }
    if (n) {
      e = e.filter(function (t) {
        return t.name().substr(0, n.length).toLowerCase() === n;
      });
    }
    if (!this.selectedTag || !e.includes(this.selectedTag)) {
      this.selectedTag = e[0];
    }
    var s = Math.max(bt(this.getInstruction(r, o)).length, this.filter().length);
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
      }, E(e));
    })), m("input", {
      className: "FormControl",
      placeholder: bt(this.getInstruction(r, o)),
      bidi: this.filter,
      style: {
        width: s + "ch"
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
    }, m(dt, {
      type: "submit",
      className: "Button Button--primary",
      disabled: !this.meetsRequirements(r, o),
      icon: "fas fa-check"
    }, a.translator.trans("flarum-tags.forum.choose_tags.submit_button"))))), m("div", {
      className: "Modal-footer"
    }, m("ul", {
      className: "TagDiscussionModal-list SelectTagList"
    }, e.filter(function (e) {
      return n || !e.parent() || t.selected.includes(e.parent());
    }).map(function (e) {
      return m("li", {
        "data-index": e.id(),
        className: C({
          pinned: e.position() !== null,
          child: !!e.parent(),
          colored: !!e.color(),
          selected: t.selected.includes(e),
          active: t.selectedTag === e
        }),
        style: {
          color: e.color()
        },
        onmouseover: function () {
          return t.selectedTag = e;
        },
        onclick: t.toggleTag.bind(t, e)
      }, k(e), m("span", {
        className: "SelectTagListItem-name"
      }, yt(e.name(), n)), e.description() ? m("span", {
        className: "SelectTagListItem-description"
      }, e.description()) : "");
    })), !!a.forum.attribute("canBypassTagCounts") && m("div", {
      className: "TagDiscussionModal-controls"
    }, m(It, {
      className: "Button",
      onclick: function () {
        return t.bypassReqs = !t.bypassReqs;
      },
      isToggled: this.bypassReqs
    }, a.translator.trans("flarum-tags.forum.choose_tags.bypass_requirements"))))];
  };
  n.meetsRequirements = function (t, e) {
    return !!this.bypassReqs || t >= this.minPrimary && e >= this.minSecondary;
  };
  n.toggleTag = function (t) {
    if (this.tags) {
      if (this.selected.includes(t)) {
        this.removeTag(t);
      } else {
        this.addTag(t);
      }
      if (this.filter()) {
        this.filter("");
        this.selectedTag = this.tags[0];
      }
      this.onready();
    }
  };
  n.select = function (t) {
    if (t.metaKey || t.ctrlKey || this.selectedTag && this.selected.includes(this.selectedTag)) {
      if (this.selected.length) {
        this.$("button[type=\"submit\"]").click();
      }
    } else if (this.selectedTag) {
      this.getItem(this.selectedTag)[0].dispatchEvent(new Event("click"));
    }
  };
  n.selectableItems = function () {
    return this.$(".TagDiscussionModal-list > li");
  };
  n.getCurrentNumericIndex = function () {
    if (this.selectedTag) {
      return this.selectableItems().index(this.getItem(this.selectedTag));
    } else {
      return -1;
    }
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
    var o = n.eq(t);
    this.selectedTag = a.store.getById("tags", o.attr("data-index"));
    m.redraw();
    if (e && this.selectedTag) {
      var s;
      var i = r.scrollTop();
      var c = r.offset().top;
      var u = c + r.outerHeight();
      var l = o.offset().top;
      var d = l + o.outerHeight();
      if (l < c) {
        s = i - c + l - parseInt(r.css("padding-top"), 10);
      } else if (d > u) {
        s = i - u + d + parseInt(r.css("padding-bottom"), 10);
      }
      if (s !== undefined) {
        r.stop(true).animate({
          scrollTop: s
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
        if (a.current.matches(gt)) {
          a.current.get("stream").update();
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
}(pt);
function kt() {
  (0, G.extend)(lt, "moderationControls", function (t, e) {
    if (e.canTag()) {
      t.add("tags", m(dt, {
        icon: "fas fa-tag",
        onclick: function () {
          return app.modal.show(Ct, {
            discussion: e
          });
        }
      }, app.translator.trans("flarum-tags.forum.discussion_controls.edit_tags_button")));
    }
  });
}
const Dt = flarum.core.compat["forum/components/DiscussionComposer"];
var St = Dt;
function Et() {
  (0, G.extend)(l.prototype, "newDiscussionAction", function (t) {
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
  (0, G.extend)(St.prototype, "oninit", function () {
    app.tagList.load(["parent"]).then(function () {
      return m.redraw();
    });
  });
  St.prototype.chooseTags = function () {
    var t = this;
    if (Lt().length) {
      app.modal.show(Ct, {
        selectedTags: (this.composer.fields.tags || []).slice(0),
        onsubmit: function (e) {
          t.composer.fields.tags = e;
          t.$("textarea").focus();
        }
      });
    }
  };
  (0, G.extend)(St.prototype, "headerItems", function (t) {
    var e = this.composer.fields.tags || [];
    var n = Lt();
    t.add("tags", m("a", {
      className: C(["DiscussionComposer-changeTags", !n.length && "disabled"]),
      onclick: this.chooseTags.bind(this)
    }, e.length ? R(e) : m("span", {
      className: "TagLabel untagged"
    }, app.translator.trans("flarum-tags.forum.composer_discussion.choose_tags_link"))), 10);
  });
  (0, G.override)(St.prototype, "onsubmit", function (t) {
    var e = this;
    var n = this.composer.fields.tags || [];
    var r = n.filter(function (t) {
      return t.position() !== null && !t.isChild();
    });
    var a = n.filter(function (t) {
      return t.position() === null;
    });
    var o = Lt();
    var s = parseInt(app.forum.attribute("minPrimaryTags"));
    var i = parseInt(app.forum.attribute("minSecondaryTags"));
    var c = parseInt(app.forum.attribute("maxPrimaryTags"));
    var u = parseInt(app.forum.attribute("maxSecondaryTags"));
    if ((!n.length && c !== 0 && u !== 0 || r.length < s || a.length < i) && o.length) {
      app.modal.show(Ct, {
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
  (0, G.extend)(St.prototype, "data", function (t) {
    t.relationships = t.relationships || {};
    t.relationships.tags = this.composer.fields.tags;
  });
}
const Ot = {
  "tags/utils/sortTags": O,
  "tags/models/Tag": g,
  "tags/helpers/tagsLabel": R,
  "tags/helpers/tagIcon": k,
  "tags/helpers/tagLabel": E
};
const At = Object.assign(Ot, {
  "tags/addTagFilter": rt,
  "tags/addTagControl": kt,
  "tags/components/TagHero": et,
  "tags/components/TagDiscussionModal": Ct,
  "tags/components/TagsPage": A,
  "tags/components/DiscussionTaggedPost": M,
  "tags/components/TagLinkButton": z,
  "tags/addTagList": J,
  "tags/addTagLabels": ct,
  "tags/addTagComposer": Et,
  "tags/utils/getSelectableTags": Lt
});
const jt = flarum.core;
a.initializers.add("flarum-tags", function () {
  a.routes.tags = {
    path: "/tags",
    component: A
  };
  a.routes.tag = {
    path: "/t/:tags",
    component: l
  };
  a.route.tag = function (t) {
    return a.route("tag", {
      tags: t.slug()
    });
  };
  a.postComponents.discussionTagged = M;
  a.store.models.tags = g;
  a.tagList = new F();
  c.prototype.tags = s.hasMany("tags");
  c.prototype.canTag = s.attribute("canTag");
  J();
  rt();
  ct();
  kt();
  Et();
});
Object.assign(jt.compat, At);