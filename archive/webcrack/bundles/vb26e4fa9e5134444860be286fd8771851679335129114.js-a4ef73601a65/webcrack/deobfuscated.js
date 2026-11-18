(() => {
  var e = {
    343: e => {
      "use strict";

      var n = [];
      for (var t = 0; t < 256; ++t) {
        n[t] = (t + 256).toString(16).substr(1);
      }
      e.exports = function (e, t) {
        var r = t || 0;
        var i = n;
        return [i[e[r++]], i[e[r++]], i[e[r++]], i[e[r++]], "-", i[e[r++]], i[e[r++]], "-", i[e[r++]], i[e[r++]], "-", i[e[r++]], i[e[r++]], "-", i[e[r++]], i[e[r++]], i[e[r++]], i[e[r++]], i[e[r++]], i[e[r++]]].join("");
      };
    },
    944: e => {
      "use strict";

      var n = typeof crypto != "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != "undefined" && typeof window.msCrypto.getRandomValues == "function" && msCrypto.getRandomValues.bind(msCrypto);
      if (n) {
        var t = new Uint8Array(16);
        e.exports = function () {
          n(t);
          return t;
        };
      } else {
        var r = new Array(16);
        e.exports = function () {
          var e;
          for (var n = 0; n < 16; n++) {
            if ((n & 3) == 0) {
              e = Math.random() * 4294967296;
            }
            r[n] = e >>> ((n & 3) << 3) & 255;
          }
          return r;
        };
      }
    },
    508: (e, n, t) => {
      "use strict";

      var r = t(944);
      var i = t(343);
      e.exports = function (e, n, t) {
        var o = n && t || 0;
        if (typeof e == "string") {
          n = e === "binary" ? new Array(16) : null;
          e = null;
        }
        var a = (e = e || {}).random || (e.rng || r)();
        a[6] = a[6] & 15 | 64;
        a[8] = a[8] & 63 | 128;
        if (n) {
          for (var c = 0; c < 16; ++c) {
            n[o + c] = a[c];
          }
        }
        return n || i(a);
      };
    },
    168: function (e, n, t) {
      "use strict";

      var r = this && this.__assign || function () {
        r = Object.assign || function (e) {
          var n;
          for (var t = 1, r = arguments.length; t < r; t++) {
            for (var i in n = arguments[t]) {
              if (Object.prototype.hasOwnProperty.call(n, i)) {
                e[i] = n[i];
              }
            }
          }
          return e;
        };
        return r.apply(this, arguments);
      };
      n.__esModule = true;
      var i = t(699);
      var o = t(752);
      var a = t(511);
      var c = t(508);
      (function () {
        function e(e) {
          var n = "";
          n = window.location.origin ? window.location.origin : `${window.location.protocol}://${window.location.host}`;
          if (e && typeof e == "string") {
            if (e.indexOf("/") === 0) {
              n += e;
            } else {
              try {
                var t = new URL(e);
                return `${t.protocol}://${t.host}${t.pathname}`;
              } catch (e) {}
            }
          } else {
            var r = window.location.pathname;
            if (r && r.length > 0) {
              n += r;
            }
          }
          return n;
        }
        function n(e) {
          if (e == null) {
            return undefined;
          } else {
            return Math.round(e * 1000) / 1000;
          }
        }
        function t(e, n) {
          for (var t in e) {
            var r = e[t];
            if (n !== undefined) {
              if (typeof r == "number" || typeof r == "string") {
                n[t] = r;
              } else if (Array.isArray(r)) {
                n[t] = JSON.parse(JSON.stringify(r));
              }
            }
          }
        }
        (function () {
          var s;
          var u;
          var f = window.performance || window.webkitPerformance || window.msPerformance || window.mozPerformance;
          var d = "data-cf-beacon";
          var l = document.currentScript || (typeof document.querySelector == "function" ? document.querySelector(`script[${d}]`) : undefined);
          var p = c();
          var v = [];
          var m = window.__cfBeacon ? window.__cfBeacon : {};
          if (m && m.load === "single") {
            return;
          }
          if (l) {
            var g = l.getAttribute(d);
            if (g) {
              try {
                m = r(r({}, m), JSON.parse(g));
              } catch (e) {}
            } else {
              var y = l.getAttribute("src");
              if (y && typeof URLSearchParams == "function") {
                var h = new URLSearchParams(y.replace(/^[^\?]+\??/, ""));
                var w = h.get("token");
                if (w) {
                  m.token = w;
                }
                var T = h.get("spa");
                m.spa = T === null || T === "true";
              }
            }
            if (m && m.load !== "multi") {
              m.load = "single";
            }
            window.__cfBeacon = m;
          }
          if (!f || !m || !m.token) {
            return;
          }
          var E;
          var b = false;
          document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "hidden") {
              if (R && A()) {
                var n = e();
                if ((E == null ? undefined : E.url) != n || !(E == null ? undefined : E.triggered)) {
                  B();
                }
                I(n);
              }
              if (!b && E) {
                b = true;
                _();
              }
            } else if (document.visibilityState === "visible") {
              new Date().getTime();
            }
          });
          var S = {};
          function C(e) {
            if (!e) {
              return "";
            }
            var n = e.localName;
            if (e.id && e.id.length > 0) {
              n += `#${e.id}`;
            }
            if (e.className && e.className.length > 0) {
              n += `.${e.className.split(" ").join(".")}`;
            }
            return n;
          }
          function L(e) {
            var n;
            var t = window.location.pathname;
            var r = (n = e.entries) && n.length !== 0 ? n[n.length - 1] : null;
            S[e.name.toLowerCase()] = {
              value: e.value,
              path: t
            };
            switch (e.name) {
              case "CLS":
                r = function (e) {
                  if (!e || e.length === 0) {
                    return null;
                  }
                  var n = e.reduce(function (e, n) {
                    if (e && e.value > n.value) {
                      return e;
                    } else {
                      return n;
                    }
                  });
                  if (n && n.sources && n.sources.length) {
                    var t = n.sources.reduce(function (e, n) {
                      if (e.node && e.previousRect.width * e.previousRect.height > n.previousRect.width * n.previousRect.height) {
                        return e;
                      } else {
                        return n;
                      }
                    });
                    if (t) {
                      return t;
                    }
                  }
                }(e.entries);
                if (r && S.cls) {
                  S.cls.element = C(r.node);
                  S.cls.currentRect = r.currentRect;
                  S.cls.previousRect = r.previousRect;
                }
                break;
              case "FID":
                if (r && S.fid) {
                  S.fid.element = C(r.target);
                  S.fid.name = r.name;
                }
                break;
              case "LCP":
                if (r && S.lcp) {
                  S.lcp.element = C(r.element);
                  S.lcp.size = r.size;
                  S.lcp.url = r.url;
                }
            }
          }
          if (typeof PerformanceObserver == "function") {
            (0, a.onLCP)(L);
            (0, a.onFID)(L);
            (0, a.onFCP)(L);
            (0, a.onINP)(L);
            (0, a.onTTFB)(L);
            if (PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.includes("layout-shift")) {
              (0, a.onCLS)(L);
            }
          }
          var R = m && (m.spa === undefined || m.spa === true);
          var P = m.send && m.send.to ? m.send.to : m.version === undefined ? "https://cloudflareinsights.com/cdn-cgi/rum" : null;
          function B(r) {
            function a(e, n) {
              c.resources = e;
              if (n != 0) {
                c.bypassTiming = true;
              }
              if (m) {
                if (m.r === 1) {
                  c.resources = [];
                }
                (0, o.sendObjectBeacon)("", c, function () {}, false, P);
                if (m.forward !== undefined && m.forward.url !== undefined) {
                  (0, o.sendObjectBeacon)("", c, function () {}, false, m.forward.url);
                }
              }
            }
            var c = function (r) {
              var a = 1;
              var c = f.timing;
              var u = f.memory;
              var d = r || e();
              var l = {
                memory: {},
                timings: {},
                resources: [],
                tempResources: [],
                referrer: x(),
                errorCount: 0,
                eventType: i.EventType.Load,
                firstPaint: 0,
                firstContentfulPaint: 0,
                si: m ? m.si : 0,
                startTime: k(),
                versions: {
                  fl: m ? m.version : "",
                  js: "2023.3.0",
                  timings: a
                },
                pageloadId: p,
                location: d,
                wd: N(),
                b: m.b
              };
              if (s == null) {
                if (typeof f.getEntriesByType == "function") {
                  var v = f.getEntriesByType("navigation");
                  if (v && Array.isArray(v) && v.length > 0) {
                    l.timingsV2 = {};
                    l.versions.timings = 2;
                    delete l.timings;
                    t(v[0], l.timingsV2);
                  }
                }
                if (l.versions.timings === 1) {
                  t(c, l.timings);
                }
                t(u, l.memory);
              } else {
                F(l);
              }
              l.firstPaint = M("first-paint");
              l.firstContentfulPaint = M("first-contentful-paint");
              l.errorCount = window.__cfErrCount || 0;
              if (m) {
                if (m.icTag) {
                  l.icTag = m.icTag;
                }
                l.siteToken = m.token;
              }
              if (typeof f.getEntriesByType == "function") {
                var g = f.getEntriesByType("resource") ?? [];
                var y = 0;
                var h = 0;
                g.forEach(function (e) {
                  var t = {
                    n: e.name,
                    s: n(e.startTime),
                    d: n(e.duration),
                    i: e.initiatorType,
                    p: e.nextHopProtocol,
                    rs: n(e.redirectStart),
                    re: n(e.redirectEnd),
                    fs: n(e.fetchStart),
                    ds: n(e.domainLookupStart),
                    de: n(e.domainLookupEnd),
                    cs: n(e.connectStart),
                    ce: n(e.connectEnd),
                    qs: n(e.requestStart),
                    ps: n(e.responseStart),
                    pe: n(e.responseEnd),
                    ws: n(e.workerStart),
                    ss: n(e.secureConnectionStart),
                    ts: e.transferSize,
                    ec: e.encodedBodySize,
                    dc: e.decodedBodySize
                  };
                  if (l.tempResources && l.tempResources[h] === undefined) {
                    l.tempResources[h] = [];
                  }
                  var r = JSON.stringify(t).length;
                  if (y + r < 62000 && l.tempResources) {
                    y += r;
                    l.tempResources[h].push(t);
                  } else {
                    h++;
                    y = 0;
                  }
                });
              }
              if (JSON.stringify(l).length >= 64000) {
                l.resources = [];
              }
              if (s !== undefined) {
                delete l.timings;
                delete l.memory;
                delete l.errorCount;
              }
              return l;
            }(r);
            if (c && m) {
              var u = c.tempResources;
              delete c.tempResources;
              if (R && u && u.length === 0) {
                a([], 0);
              }
              if (!u) {
                return;
              }
              u.forEach(function (e, n) {
                a(e, n);
              });
            }
          }
          function _() {
            var n = function () {
              var n = f.getEntriesByType("navigation")[0];
              var t = "";
              try {
                t = typeof f.getEntriesByType == "function" ? new URL(n == null ? undefined : n.name).pathname : u ? new URL(u).pathname : window.location.pathname;
              } catch (e) {}
              var r = {
                referrer: document.referrer || "",
                eventType: i.EventType.WebVitalsV2,
                si: m ? m.si : 0,
                versions: {
                  js: "2023.3.0"
                },
                pageloadId: p,
                location: e(),
                landingPath: t,
                startTime: k(),
                wd: N(),
                b: m.b
              };
              if (m) {
                if (m.version) {
                  r.versions.fl = m.version;
                }
                if (m.icTag) {
                  r.icTag = m.icTag;
                }
                r.siteToken = m.token;
              }
              if (S) {
                ["lcp", "fid", "cls", "fcp", "ttfb", "inp"].forEach(function (e) {
                  r[e] = {
                    value: -1,
                    path: undefined
                  };
                  if (S[e] && S[e].value !== undefined) {
                    r[e] = S[e];
                  }
                });
              }
              F(r);
              return r;
            }();
            if (!R) {
              n.resources = [];
              delete n.tempResources;
            }
            if (m) {
              (0, o.sendObjectBeacon)("", n, function () {}, true, P);
            }
          }
          function O() {
            var n = window.__cfRl && window.__cfRl.done || window.__cfQR && window.__cfQR.done;
            if (n) {
              n.then(B);
            } else {
              B();
            }
            E = {
              id: p,
              url: e(),
              ts: new Date().getTime(),
              triggered: true
            };
          }
          if (window.document.readyState === "complete") {
            O();
          } else {
            window.addEventListener("load", function () {
              window.setTimeout(O);
            });
          }
          function A() {
            return R && v.filter(function (e) {
              return e.id === p;
            }).length === 0;
          }
          function I(e) {
            v.push({
              id: p,
              url: e,
              ts: new Date().getTime()
            });
            if (v.length > 3) {
              v.shift();
            }
          }
          if (R) {
            u = e();
            (function (n) {
              var t = n.pushState;
              if (t) {
                function r() {
                  p = c();
                  if (typeof f.clearResourceTimings == "function") {
                    f.clearResourceTimings();
                  }
                  0;
                }
                n.pushState = function (i, o, a) {
                  s = e(a);
                  var c = e();
                  var u = true;
                  if (s == c) {
                    u = false;
                  }
                  if (u) {
                    if (A()) {
                      if ((E == null ? undefined : E.url) != c || !(E == null ? undefined : E.triggered)) {
                        B(c);
                      }
                      I(c);
                    }
                    r();
                  }
                  return t.apply(n, [i, o, a]);
                };
                window.addEventListener("popstate", function (n) {
                  if (A()) {
                    if ((E == null ? undefined : E.url) != s || !(E == null ? undefined : E.triggered)) {
                      B(s);
                    }
                    I(s);
                  }
                  s = e();
                  r();
                });
              }
            })(window.history);
          }
          function k() {
            return f.timeOrigin;
          }
          function x() {
            var e = document.referrer || "";
            var n = v[v.length - 1];
            if (R && E && n) {
              return n.url;
            } else {
              return e;
            }
          }
          function N() {
            return navigator.webdriver;
          }
          function F(e) {
            if (typeof f.getEntriesByType == "function") {
              var n = f.getEntriesByType("navigation");
              var r = {};
              e.timingsV2 = {};
              if (n && n[0] && n[0].nextHopProtocol) {
                r.nextHopProtocol = n[0].nextHopProtocol;
              }
              t(r, e.timingsV2);
            }
          }
          function M(e) {
            var n;
            if (e === "first-contentful-paint" && S.fcp && S.fcp.value) {
              return S.fcp.value;
            }
            if (typeof f.getEntriesByType == "function") {
              var t = (n = f.getEntriesByType("paint")) === null || n === undefined ? undefined : n.filter(function (n) {
                return n.name === e;
              })[0];
              if (t) {
                return t.startTime;
              } else {
                return 0;
              }
            }
            return 0;
          }
        })();
      })();
    },
    752: (e, n) => {
      "use strict";

      n.__esModule = true;
      n.sendObjectBeacon = undefined;
      n.sendObjectBeacon = function (e, n, t, r = false, i = null) {
        var o = i || (n.siteToken && n.versions.fl ? `/cdn-cgi/rum?${e}` : `/cdn-cgi/beacon/performance?${e}`);
        var a = true;
        if (navigator && typeof navigator.userAgent == "string") {
          try {
            var c = navigator.userAgent.match(/Chrome\/([0-9]+)/);
            if (c && c[0].toLowerCase().indexOf("chrome") > -1 && parseInt(c[1]) < 81) {
              a = false;
            }
          } catch (e) {}
        }
        if (navigator && typeof navigator.sendBeacon == "function" && a && r) {
          n.st = 1;
          var s = JSON.stringify(n);
          navigator.sendBeacon(o, new Blob([s], {
            type: "application/json"
          }));
        } else {
          n.st = 2;
          s = JSON.stringify(n);
          var u = new XMLHttpRequest();
          if (t) {
            u.onreadystatechange = function () {
              if (this.readyState == 4 && this.status == 204) {
                t();
              }
            };
          }
          u.open("POST", o, true);
          u.setRequestHeader("content-type", "application/json");
          u.send(s);
        }
      };
    },
    699: (e, n) => {
      "use strict";

      n.__esModule = true;
      n.EventType = undefined;
      (function (e) {
        e[e.Load = 1] = "Load";
        e[e.Additional = 2] = "Additional";
        e[e.WebVitalsV2 = 3] = "WebVitalsV2";
      })(n.EventType ||= {});
    },
    511: function (e, n) {
      (function (e) {
        "use strict";

        var n;
        var t;
        var r;
        var i;
        var o;
        var a = -1;
        function c(e) {
          addEventListener("pageshow", function (n) {
            if (n.persisted) {
              a = n.timeStamp;
              e(n);
            }
          }, true);
        }
        function s() {
          return window.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
        }
        function u() {
          var e = s();
          return e && e.activationStart || 0;
        }
        function f(e, n) {
          var t = s();
          var r = "navigate";
          if (a >= 0) {
            r = "back-forward-cache";
          } else if (t) {
            r = document.prerendering || u() > 0 ? "prerender" : document.wasDiscarded ? "restore" : t.type.replace(/_/g, "-");
          }
          return {
            name: e,
            value: n === undefined ? -1 : n,
            rating: "good",
            delta: 0,
            entries: [],
            id: `v3-${Date.now()}-${Math.floor(Math.random() * 8999999999999) + 1000000000000}`,
            navigationType: r
          };
        }
        function d(e, n, t) {
          try {
            if (PerformanceObserver.supportedEntryTypes.includes(e)) {
              var r = new PerformanceObserver(function (e) {
                Promise.resolve().then(function () {
                  n(e.getEntries());
                });
              });
              r.observe(Object.assign({
                type: e,
                buffered: true
              }, t || {}));
              return r;
            }
          } catch (e) {}
        }
        function l(e, n, t, r) {
          var i;
          var o;
          return function (a) {
            if (n.value >= 0 && (a || r) && ((o = n.value - (i || 0)) || i === undefined)) {
              i = n.value;
              n.delta = o;
              n.rating = function (e, n) {
                if (e > n[1]) {
                  return "poor";
                } else if (e > n[0]) {
                  return "needs-improvement";
                } else {
                  return "good";
                }
              }(n.value, t);
              e(n);
            }
          };
        }
        function p(e) {
          requestAnimationFrame(function () {
            return requestAnimationFrame(function () {
              return e();
            });
          });
        }
        function v(e) {
          function n(n) {
            if (n.type === "pagehide" || document.visibilityState === "hidden") {
              e(n);
            }
          }
          addEventListener("visibilitychange", n, true);
          addEventListener("pagehide", n, true);
        }
        function m(e) {
          var n = false;
          return function (t) {
            if (!n) {
              e(t);
              n = true;
            }
          };
        }
        var g = -1;
        function y() {
          if (document.visibilityState !== "hidden" || document.prerendering) {
            return Infinity;
          } else {
            return 0;
          }
        }
        function h(e) {
          if (document.visibilityState === "hidden" && g > -1) {
            g = e.type === "visibilitychange" ? e.timeStamp : 0;
            T();
          }
        }
        function w() {
          addEventListener("visibilitychange", h, true);
          addEventListener("prerenderingchange", h, true);
        }
        function T() {
          removeEventListener("visibilitychange", h, true);
          removeEventListener("prerenderingchange", h, true);
        }
        function E() {
          if (g < 0) {
            g = y();
            w();
            c(function () {
              setTimeout(function () {
                g = y();
                w();
              }, 0);
            });
          }
          return {
            get firstHiddenTime() {
              return g;
            }
          };
        }
        function b(e) {
          if (document.prerendering) {
            addEventListener("prerenderingchange", function () {
              return e();
            }, true);
          } else {
            e();
          }
        }
        function S(e, n) {
          n = n || {};
          b(function () {
            var t;
            var r = [1800, 3000];
            var i = E();
            var o = f("FCP");
            var a = d("paint", function (e) {
              e.forEach(function (e) {
                if (e.name === "first-contentful-paint") {
                  a.disconnect();
                  if (e.startTime < i.firstHiddenTime) {
                    o.value = Math.max(e.startTime - u(), 0);
                    o.entries.push(e);
                    t(true);
                  }
                }
              });
            });
            if (a) {
              t = l(e, o, r, n.reportAllChanges);
              c(function (i) {
                o = f("FCP");
                t = l(e, o, r, n.reportAllChanges);
                p(function () {
                  o.value = performance.now() - i.timeStamp;
                  t(true);
                });
              });
            }
          });
        }
        function C(e, n) {
          n = n || {};
          S(m(function () {
            var t;
            var r = [0.1, 0.25];
            var i = f("CLS", 0);
            var o = 0;
            var a = [];
            function s(e) {
              e.forEach(function (e) {
                if (!e.hadRecentInput) {
                  var n = a[0];
                  var t = a[a.length - 1];
                  if (o && e.startTime - t.startTime < 1000 && e.startTime - n.startTime < 5000) {
                    o += e.value;
                    a.push(e);
                  } else {
                    o = e.value;
                    a = [e];
                  }
                }
              });
              if (o > i.value) {
                i.value = o;
                i.entries = a;
                t();
              }
            }
            var u = d("layout-shift", s);
            if (u) {
              t = l(e, i, r, n.reportAllChanges);
              v(function () {
                s(u.takeRecords());
                t(true);
              });
              c(function () {
                o = 0;
                i = f("CLS", 0);
                t = l(e, i, r, n.reportAllChanges);
                p(function () {
                  return t();
                });
              });
              setTimeout(t, 0);
            }
          }));
        }
        var L = {
          passive: true,
          capture: true
        };
        var R = new Date();
        function P(e, i) {
          if (!n) {
            n = i;
            t = e;
            r = new Date();
            O(removeEventListener);
            B();
          }
        }
        function B() {
          if (t >= 0 && t < r - R) {
            var e = {
              entryType: "first-input",
              name: n.type,
              target: n.target,
              cancelable: n.cancelable,
              startTime: n.timeStamp,
              processingStart: n.timeStamp + t
            };
            i.forEach(function (n) {
              n(e);
            });
            i = [];
          }
        }
        function _(e) {
          if (e.cancelable) {
            var n = (e.timeStamp > 1000000000000 ? new Date() : performance.now()) - e.timeStamp;
            if (e.type == "pointerdown") {
              (function (e, n) {
                function t() {
                  P(e, n);
                  i();
                }
                function r() {
                  i();
                }
                function i() {
                  removeEventListener("pointerup", t, L);
                  removeEventListener("pointercancel", r, L);
                }
                addEventListener("pointerup", t, L);
                addEventListener("pointercancel", r, L);
              })(n, e);
            } else {
              P(n, e);
            }
          }
        }
        function O(e) {
          ["mousedown", "keydown", "touchstart", "pointerdown"].forEach(function (n) {
            return e(n, _, L);
          });
        }
        function A(e, r) {
          r = r || {};
          b(function () {
            var o;
            var a = [100, 300];
            var s = E();
            var u = f("FID");
            function p(e) {
              if (e.startTime < s.firstHiddenTime) {
                u.value = e.processingStart - e.startTime;
                u.entries.push(e);
                o(true);
              }
            }
            function g(e) {
              e.forEach(p);
            }
            var y = d("first-input", g);
            o = l(e, u, a, r.reportAllChanges);
            if (y) {
              v(m(function () {
                g(y.takeRecords());
                y.disconnect();
              }));
            }
            if (y) {
              c(function () {
                var c;
                u = f("FID");
                o = l(e, u, a, r.reportAllChanges);
                i = [];
                t = -1;
                n = null;
                O(addEventListener);
                c = p;
                i.push(c);
                B();
              });
            }
          });
        }
        var I = 0;
        var k = Infinity;
        var x = 0;
        function N(e) {
          e.forEach(function (e) {
            if (e.interactionId) {
              k = Math.min(k, e.interactionId);
              x = Math.max(x, e.interactionId);
              I = x ? (x - k) / 7 + 1 : 0;
            }
          });
        }
        function F() {
          if (o) {
            return I;
          } else {
            return performance.interactionCount || 0;
          }
        }
        function M() {
          if (!("interactionCount" in performance) && !o) {
            o = d("event", N, {
              type: "event",
              buffered: true,
              durationThreshold: 0
            });
          }
        }
        var V = 0;
        function j() {
          return F() - V;
        }
        var D = [];
        var H = {};
        function J(e) {
          var n = D[D.length - 1];
          var t = H[e.interactionId];
          if (t || D.length < 10 || e.duration > n.latency) {
            if (t) {
              t.entries.push(e);
              t.latency = Math.max(t.latency, e.duration);
            } else {
              var r = {
                id: e.interactionId,
                latency: e.duration,
                entries: [e]
              };
              H[r.id] = r;
              D.push(r);
            }
            D.sort(function (e, n) {
              return n.latency - e.latency;
            });
            D.splice(10).forEach(function (e) {
              delete H[e.id];
            });
          }
        }
        function q(e, n) {
          n = n || {};
          b(function () {
            var t = [200, 500];
            M();
            var r;
            var i = f("INP");
            function o(e) {
              e.forEach(function (e) {
                if (e.interactionId) {
                  J(e);
                }
                if (e.entryType === "first-input" && !D.some(function (n) {
                  return n.entries.some(function (n) {
                    return e.duration === n.duration && e.startTime === n.startTime;
                  });
                })) {
                  J(e);
                }
              });
              var n;
              n = Math.min(D.length - 1, Math.floor(j() / 50));
              var t = D[n];
              if (t && t.latency !== i.value) {
                i.value = t.latency;
                i.entries = t.entries;
                r();
              }
            }
            var a = d("event", o, {
              durationThreshold: n.durationThreshold || 40
            });
            r = l(e, i, t, n.reportAllChanges);
            if (a) {
              a.observe({
                type: "first-input",
                buffered: true
              });
              v(function () {
                o(a.takeRecords());
                if (i.value < 0 && j() > 0) {
                  i.value = 0;
                  i.entries = [];
                }
                r(true);
              });
              c(function () {
                D = [];
                V = F();
                i = f("INP");
                r = l(e, i, t, n.reportAllChanges);
              });
            }
          });
        }
        var z = {};
        function U(e, n) {
          n = n || {};
          b(function () {
            var t;
            var r = [2500, 4000];
            var i = E();
            var o = f("LCP");
            function a(e) {
              var n = e[e.length - 1];
              if (n) {
                var r = Math.max(n.startTime - u(), 0);
                if (r < i.firstHiddenTime) {
                  o.value = r;
                  o.entries = [n];
                  t();
                }
              }
            }
            var s = d("largest-contentful-paint", a);
            if (s) {
              t = l(e, o, r, n.reportAllChanges);
              var g = m(function () {
                if (!z[o.id]) {
                  a(s.takeRecords());
                  s.disconnect();
                  z[o.id] = true;
                  t(true);
                }
              });
              ["keydown", "click"].forEach(function (e) {
                addEventListener(e, g, true);
              });
              v(g);
              c(function (i) {
                o = f("LCP");
                t = l(e, o, r, n.reportAllChanges);
                p(function () {
                  o.value = performance.now() - i.timeStamp;
                  z[o.id] = true;
                  t(true);
                });
              });
            }
          });
        }
        var W = function e(n) {
          if (document.prerendering) {
            b(function () {
              return e(n);
            });
          } else if (document.readyState !== "complete") {
            addEventListener("load", function () {
              return e(n);
            }, true);
          } else {
            setTimeout(n, 0);
          }
        };
        function Q(e, n) {
          n = n || {};
          var t = [800, 1800];
          var r = f("TTFB");
          var i = l(e, r, t, n.reportAllChanges);
          W(function () {
            var o = s();
            if (o) {
              var a = o.responseStart;
              if (a <= 0 || a > performance.now()) {
                return;
              }
              r.value = Math.max(a - u(), 0);
              r.entries = [o];
              i(true);
              c(function () {
                r = f("TTFB", 0);
                (i = l(e, r, t, n.reportAllChanges))(true);
              });
            }
          });
        }
        e.getCLS = C;
        e.getFCP = S;
        e.getFID = A;
        e.getINP = q;
        e.getLCP = U;
        e.getTTFB = Q;
        e.onCLS = C;
        e.onFCP = S;
        e.onFID = A;
        e.onINP = q;
        e.onLCP = U;
        e.onTTFB = Q;
        Object.defineProperty(e, "__esModule", {
          value: true
        });
      })(n);
    }
  };
  var n = {};
  (function t(r) {
    var i = n[r];
    if (i !== undefined) {
      return i.exports;
    }
    var o = n[r] = {
      exports: {}
    };
    e[r].call(o.exports, o, o.exports, t);
    return o.exports;
  })(168);
})();
//# sourceMappingURL=performance.min.js.map