var r = require("./791.js");
var a = require("./725.js");
var o = require("./296.js");
function l(e) {
  var t = "https://web.archive.org/web/20220526154012/https://reactjs.org/docs/error-decoder.html?invariant=" + e;
  for (var n = 1; n < arguments.length; n++) {
    t += "&args[]=" + encodeURIComponent(arguments[n]);
  }
  return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
if (!r) {
  throw Error(l(227));
}
var i = new Set();
var u = {};
function c(e, t) {
  s(e, t);
  s(e + "Capture", t);
}
function s(e, t) {
  u[e] = t;
  e = 0;
  for (; e < t.length; e++) {
    i.add(t[e]);
  }
}
var f = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
var d = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/;
var p = Object.prototype.hasOwnProperty;
var h = {};
var v = {};
function m(e, t, n, r, a, o, l) {
  this.acceptsBooleans = t === 2 || t === 3 || t === 4;
  this.attributeName = r;
  this.attributeNamespace = a;
  this.mustUseProperty = n;
  this.propertyName = e;
  this.type = t;
  this.sanitizeURL = o;
  this.removeEmptyString = l;
}
var y = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function (e) {
  y[e] = new m(e, 0, false, e, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function (e) {
  var t = e[0];
  y[t] = new m(t, 1, false, e[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  y[e] = new m(e, 2, false, e.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function (e) {
  y[e] = new m(e, 2, false, e, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function (e) {
  y[e] = new m(e, 3, false, e.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  y[e] = new m(e, 3, true, e, null, false, false);
});
["capture", "download"].forEach(function (e) {
  y[e] = new m(e, 4, false, e, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  y[e] = new m(e, 6, false, e, null, false, false);
});
["rowSpan", "start"].forEach(function (e) {
  y[e] = new m(e, 5, false, e.toLowerCase(), null, false, false);
});
var g = /[\-:]([a-z])/g;
function b(e) {
  return e[1].toUpperCase();
}
function w(e, t, n, r) {
  var a = y.hasOwnProperty(t) ? y[t] : null;
  if (!(a !== null ? a.type === 0 : !r && t.length > 2 && (t[0] === "o" || t[0] === "O") && (t[1] === "n" || t[1] === "N"))) {
    if (function (e, t, n, r) {
      if (t === null || typeof t === "undefined" || function (e, t, n, r) {
        if (n !== null && n.type === 0) {
          return false;
        }
        switch (typeof t) {
          case "function":
          case "symbol":
            return true;
          case "boolean":
            return !r && (n !== null ? !n.acceptsBooleans : (e = e.toLowerCase().slice(0, 5)) !== "data-" && e !== "aria-");
          default:
            return false;
        }
      }(e, t, n, r)) {
        return true;
      }
      if (r) {
        return false;
      }
      if (n !== null) {
        switch (n.type) {
          case 3:
            return !t;
          case 4:
            return t === false;
          case 5:
            return isNaN(t);
          case 6:
            return isNaN(t) || t < 1;
        }
      }
      return false;
    }(t, n, a, r)) {
      n = null;
    }
    if (r || a === null) {
      if (function (e) {
        return !!p.call(v, e) || !p.call(h, e) && (d.test(e) ? v[e] = true : (h[e] = true, false));
      }(t)) {
        if (n === null) {
          e.removeAttribute(t);
        } else {
          e.setAttribute(t, "" + n);
        }
      }
    } else if (a.mustUseProperty) {
      e[a.propertyName] = n === null ? a.type !== 3 && "" : n;
    } else {
      t = a.attributeName;
      r = a.attributeNamespace;
      if (n === null) {
        e.removeAttribute(t);
      } else {
        n = (a = a.type) === 3 || a === 4 && n === true ? "" : "" + n;
        if (r) {
          e.setAttributeNS(r, t, n);
        } else {
          e.setAttribute(t, n);
        }
      }
    }
  }
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function (e) {
  var t = e.replace(g, b);
  y[t] = new m(t, 1, false, e, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function (e) {
  var t = e.replace(g, b);
  y[t] = new m(t, 1, false, e, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(g, b);
  y[t] = new m(t, 1, false, e, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  y[e] = new m(e, 1, false, e.toLowerCase(), null, false, false);
});
y.xlinkHref = new m("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function (e) {
  y[e] = new m(e, 1, false, e.toLowerCase(), null, true, true);
});
var k = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
var x = 60103;
var C = 60106;
var S = 60107;
var E = 60108;
var z = 60114;
var L = 60109;
var _ = 60110;
var P = 60112;
var N = 60113;
var j = 60120;
var O = 60115;
var T = 60116;
var M = 60121;
var B = 60128;
var D = 60129;
var U = 60130;
var A = 60131;
if (typeof Symbol === "function" && Symbol.for) {
  var R = Symbol.for;
  x = R("react.element");
  C = R("react.portal");
  S = R("react.fragment");
  E = R("react.strict_mode");
  z = R("react.profiler");
  L = R("react.provider");
  _ = R("react.context");
  P = R("react.forward_ref");
  N = R("react.suspense");
  j = R("react.suspense_list");
  O = R("react.memo");
  T = R("react.lazy");
  M = R("react.block");
  R("react.scope");
  B = R("react.opaque.id");
  D = R("react.debug_trace_mode");
  U = R("react.offscreen");
  A = R("react.legacy_hidden");
}
var I;
var F = typeof Symbol === "function" && Symbol.iterator;
function V(e) {
  if (e === null || typeof e !== "object") {
    return null;
  } else if (typeof (e = F && e[F] || e["@@iterator"]) === "function") {
    return e;
  } else {
    return null;
  }
}
function W(e) {
  if (I === undefined) {
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      I = t && t[1] || "";
    }
  }
  return "\n" + I + e;
}
var H = false;
function Z(e, t) {
  if (!e || H) {
    return "";
  }
  H = true;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = undefined;
  try {
    if (t) {
      t = function () {
        throw Error();
      };
      Object.defineProperty(t.prototype, "props", {
        set: function () {
          throw Error();
        }
      });
      if (typeof Reflect === "object" && Reflect.construct) {
        try {
          Reflect.construct(t, []);
        } catch (u) {
          var r = u;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (u) {
          r = u;
        }
        e.call(t.prototype);
      }
    } else {
      try {
        throw Error();
      } catch (u) {
        r = u;
      }
      e();
    }
  } catch (u) {
    if (u && r && typeof u.stack === "string") {
      for (var a = u.stack.split("\n"), o = r.stack.split("\n"), l = a.length - 1, i = o.length - 1; l >= 1 && i >= 0 && a[l] !== o[i];) {
        i--;
      }
      for (; l >= 1 && i >= 0; l--, i--) {
        if (a[l] !== o[i]) {
          if (l !== 1 || i !== 1) {
            do {
              l--;
              if (--i < 0 || a[l] !== o[i]) {
                return "\n" + a[l].replace(" at new ", " at ");
              }
            } while (l >= 1 && i >= 0);
          }
          break;
        }
      }
    }
  } finally {
    H = false;
    Error.prepareStackTrace = n;
  }
  if (e = e ? e.displayName || e.name : "") {
    return W(e);
  } else {
    return "";
  }
}
function q(e) {
  switch (e.tag) {
    case 5:
      return W(e.type);
    case 16:
      return W("Lazy");
    case 13:
      return W("Suspense");
    case 19:
      return W("SuspenseList");
    case 0:
    case 2:
    case 15:
      return e = Z(e.type, false);
    case 11:
      return e = Z(e.type.render, false);
    case 22:
      return e = Z(e.type._render, false);
    case 1:
      return e = Z(e.type, true);
    default:
      return "";
  }
}
function K(e) {
  if (e == null) {
    return null;
  }
  if (typeof e === "function") {
    return e.displayName || e.name || null;
  }
  if (typeof e === "string") {
    return e;
  }
  switch (e) {
    case S:
      return "Fragment";
    case C:
      return "Portal";
    case z:
      return "Profiler";
    case E:
      return "StrictMode";
    case N:
      return "Suspense";
    case j:
      return "SuspenseList";
  }
  if (typeof e === "object") {
    switch (e.$$typeof) {
      case _:
        return (e.displayName || "Context") + ".Consumer";
      case L:
        return (e._context.displayName || "Context") + ".Provider";
      case P:
        var t = e.render;
        t = t.displayName || t.name || "";
        return e.displayName || (t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef");
      case O:
        return K(e.type);
      case M:
        return K(e._render);
      case T:
        t = e._payload;
        e = e._init;
        try {
          return K(e(t));
        } catch (n) {}
    }
  }
  return null;
}
function Y(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "object":
    case "string":
    case "undefined":
      return e;
    default:
      return "";
  }
}
function $(e) {
  var t = e.type;
  return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
}
function Q(e) {
  e._valueTracker ||= function (e) {
    var t = $(e) ? "checked" : "value";
    var n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
    var r = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n !== "undefined" && typeof n.get === "function" && typeof n.set === "function") {
      var a = n.get;
      var o = n.set;
      Object.defineProperty(e, t, {
        configurable: true,
        get: function () {
          return a.call(this);
        },
        set: function (e) {
          r = "" + e;
          o.call(this, e);
        }
      });
      Object.defineProperty(e, t, {
        enumerable: n.enumerable
      });
      return {
        getValue: function () {
          return r;
        },
        setValue: function (e) {
          r = "" + e;
        },
        stopTracking: function () {
          e._valueTracker = null;
          delete e[t];
        }
      };
    }
  }(e);
}
function G(e) {
  if (!e) {
    return false;
  }
  var t = e._valueTracker;
  if (!t) {
    return true;
  }
  var n = t.getValue();
  var r = "";
  if (e) {
    r = $(e) ? e.checked ? "true" : "false" : e.value;
  }
  return (e = r) !== n && (t.setValue(e), true);
}
function X(e) {
  if (typeof (e = e || (typeof document !== "undefined" ? document : undefined)) === "undefined") {
    return null;
  }
  try {
    return e.activeElement || e.body;
  } catch (t) {
    return e.body;
  }
}
function J(e, t) {
  var n = t.checked;
  return a({}, t, {
    defaultChecked: undefined,
    defaultValue: undefined,
    value: undefined,
    checked: n ?? e._wrapperState.initialChecked
  });
}
function ee(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue;
  var r = t.checked ?? t.defaultChecked;
  n = Y(t.value ?? n);
  e._wrapperState = {
    initialChecked: r,
    initialValue: n,
    controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null
  };
}
function te(e, t) {
  if ((t = t.checked) != null) {
    w(e, "checked", t, false);
  }
}
function ne(e, t) {
  te(e, t);
  var n = Y(t.value);
  var r = t.type;
  if (n != null) {
    if (r === "number") {
      if (n === 0 && e.value === "" || e.value != n) {
        e.value = "" + n;
      }
    } else if (e.value !== "" + n) {
      e.value = "" + n;
    }
  } else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  if (t.hasOwnProperty("value")) {
    ae(e, t.type, n);
  } else if (t.hasOwnProperty("defaultValue")) {
    ae(e, t.type, Y(t.defaultValue));
  }
  if (t.checked == null && t.defaultChecked != null) {
    e.defaultChecked = !!t.defaultChecked;
  }
}
function re(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if ((r === "submit" || r === "reset") && (t.value === undefined || t.value === null)) {
      return;
    }
    t = "" + e._wrapperState.initialValue;
    if (!n && t !== e.value) {
      e.value = t;
    }
    e.defaultValue = t;
  }
  if ((n = e.name) !== "") {
    e.name = "";
  }
  e.defaultChecked = !!e._wrapperState.initialChecked;
  if (n !== "") {
    e.name = n;
  }
}
function ae(e, t, n) {
  if (t !== "number" || X(e.ownerDocument) !== e) {
    if (n == null) {
      e.defaultValue = "" + e._wrapperState.initialValue;
    } else if (e.defaultValue !== "" + n) {
      e.defaultValue = "" + n;
    }
  }
}
function oe(e, t) {
  e = a({
    children: undefined
  }, t);
  if (t = function (e) {
    var t = "";
    r.Children.forEach(e, function (e) {
      if (e != null) {
        t += e;
      }
    });
    return t;
  }(t.children)) {
    e.children = t;
  }
  return e;
}
function le(e, t, n, r) {
  e = e.options;
  if (t) {
    t = {};
    for (var a = 0; a < n.length; a++) {
      t["$" + n[a]] = true;
    }
    for (n = 0; n < e.length; n++) {
      a = t.hasOwnProperty("$" + e[n].value);
      if (e[n].selected !== a) {
        e[n].selected = a;
      }
      if (a && r) {
        e[n].defaultSelected = true;
      }
    }
  } else {
    n = "" + Y(n);
    t = null;
    a = 0;
    for (; a < e.length; a++) {
      if (e[a].value === n) {
        e[a].selected = true;
        if (r) {
          e[a].defaultSelected = true;
        }
        return;
      }
      if (t === null && !e[a].disabled) {
        t = e[a];
      }
    }
    if (t !== null) {
      t.selected = true;
    }
  }
}
function ie(e, t) {
  if (t.dangerouslySetInnerHTML != null) {
    throw Error(l(91));
  }
  return a({}, t, {
    value: undefined,
    defaultValue: undefined,
    children: "" + e._wrapperState.initialValue
  });
}
function ue(e, t) {
  var n = t.value;
  if (n == null) {
    n = t.children;
    t = t.defaultValue;
    if (n != null) {
      if (t != null) {
        throw Error(l(92));
      }
      if (Array.isArray(n)) {
        if (!(n.length <= 1)) {
          throw Error(l(93));
        }
        n = n[0];
      }
      t = n;
    }
    if (t == null) {
      t = "";
    }
    n = t;
  }
  e._wrapperState = {
    initialValue: Y(n)
  };
}
function ce(e, t) {
  var n = Y(t.value);
  var r = Y(t.defaultValue);
  if (n != null) {
    if ((n = "" + n) !== e.value) {
      e.value = n;
    }
    if (t.defaultValue == null && e.defaultValue !== n) {
      e.defaultValue = n;
    }
  }
  if (r != null) {
    e.defaultValue = "" + r;
  }
}
function se(e) {
  var t = e.textContent;
  if (t === e._wrapperState.initialValue && t !== "" && t !== null) {
    e.value = t;
  }
}
var fe = "http://www.w3.org/1999/xhtml";
var de = "http://www.w3.org/2000/svg";
function pe(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function he(e, t) {
  if (e == null || e === "http://www.w3.org/1999/xhtml") {
    return pe(t);
  } else if (e === "http://www.w3.org/2000/svg" && t === "foreignObject") {
    return "http://www.w3.org/1999/xhtml";
  } else {
    return e;
  }
}
var ve;
var me;
me = function (e, t) {
  if (e.namespaceURI !== de || "innerHTML" in e) {
    e.innerHTML = t;
  } else {
    (ve = ve || document.createElement("div")).innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
    t = ve.firstChild;
    while (e.firstChild) {
      e.removeChild(e.firstChild);
    }
    while (t.firstChild) {
      e.appendChild(t.firstChild);
    }
  }
};
var ye = typeof MSApp !== "undefined" && MSApp.execUnsafeLocalFunction ? function (e, t, n, r) {
  MSApp.execUnsafeLocalFunction(function () {
    return me(e, t);
  });
} : me;
function ge(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var be = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};
var we = ["Webkit", "ms", "Moz", "O"];
function ke(e, t, n) {
  if (t == null || typeof t === "boolean" || t === "") {
    return "";
  } else if (n || typeof t !== "number" || t === 0 || be.hasOwnProperty(e) && be[e]) {
    return ("" + t).trim();
  } else {
    return t + "px";
  }
}
function xe(e, t) {
  e = e.style;
  for (var n in t) {
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0;
      var a = ke(n, t[n], r);
      if (n === "float") {
        n = "cssFloat";
      }
      if (r) {
        e.setProperty(n, a);
      } else {
        e[n] = a;
      }
    }
  }
}
Object.keys(be).forEach(function (e) {
  we.forEach(function (t) {
    t = t + e.charAt(0).toUpperCase() + e.substring(1);
    be[t] = be[e];
  });
});
var Ce = a({
  menuitem: true
}, {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
});
function Se(e, t) {
  if (t) {
    if (Ce[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) {
      throw Error(l(137, e));
    }
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) {
        throw Error(l(60));
      }
      if (typeof t.dangerouslySetInnerHTML !== "object" || !("__html" in t.dangerouslySetInnerHTML)) {
        throw Error(l(61));
      }
    }
    if (t.style != null && typeof t.style !== "object") {
      throw Error(l(62));
    }
  }
}
function Ee(e, t) {
  if (e.indexOf("-") === -1) {
    return typeof t.is === "string";
  }
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
function ze(e) {
  if ((e = e.target || e.srcElement || window).correspondingUseElement) {
    e = e.correspondingUseElement;
  }
  if (e.nodeType === 3) {
    return e.parentNode;
  } else {
    return e;
  }
}
var Le = null;
var _e = null;
var Pe = null;
function Ne(e) {
  if (e = ra(e)) {
    if (typeof Le !== "function") {
      throw Error(l(280));
    }
    var t = e.stateNode;
    if (t) {
      t = oa(t);
      Le(e.stateNode, e.type, t);
    }
  }
}
function je(e) {
  if (_e) {
    if (Pe) {
      Pe.push(e);
    } else {
      Pe = [e];
    }
  } else {
    _e = e;
  }
}
function Oe() {
  if (_e) {
    var e = _e;
    var t = Pe;
    Pe = _e = null;
    Ne(e);
    if (t) {
      for (e = 0; e < t.length; e++) {
        Ne(t[e]);
      }
    }
  }
}
function Te(e, t) {
  return e(t);
}
function Me(e, t, n, r, a) {
  return e(t, n, r, a);
}
function Be() {}
var De = Te;
var Ue = false;
var Ae = false;
function Re() {
  if (_e !== null || Pe !== null) {
    Be();
    Oe();
  }
}
function Ie(e, t) {
  var n = e.stateNode;
  if (n === null) {
    return null;
  }
  var r = oa(n);
  if (r === null) {
    return null;
  }
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      if (!(r = !r.disabled)) {
        r = (e = e.type) !== "button" && e !== "input" && e !== "select" && e !== "textarea";
      }
      e = !r;
      break e;
    default:
      e = false;
  }
  if (e) {
    return null;
  }
  if (n && typeof n !== "function") {
    throw Error(l(231, t, typeof n));
  }
  return n;
}
var Fe = false;
if (f) {
  try {
    var Ve = {};
    Object.defineProperty(Ve, "passive", {
      get: function () {
        Fe = true;
      }
    });
    window.addEventListener("test", Ve, Ve);
    window.removeEventListener("test", Ve, Ve);
  } catch (me) {
    Fe = false;
  }
}
function We(e, t, n, r, a, o, l, i, u) {
  var c = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, c);
  } catch (s) {
    this.onError(s);
  }
}
var He = false;
var Ze = null;
var qe = false;
var Ke = null;
var Ye = {
  onError: function (e) {
    He = true;
    Ze = e;
  }
};
function $e(e, t, n, r, a, o, l, i, u) {
  He = false;
  Ze = null;
  We.apply(Ye, arguments);
}
function Qe(e) {
  var t = e;
  var n = e;
  if (e.alternate) {
    while (t.return) {
      t = t.return;
    }
  } else {
    e = t;
    do {
      if (((t = e).flags & 1026) !== 0) {
        n = t.return;
      }
      e = t.return;
    } while (e);
  }
  if (t.tag === 3) {
    return n;
  } else {
    return null;
  }
}
function Ge(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (t === null) {
      if ((e = e.alternate) !== null) {
        t = e.memoizedState;
      }
    }
    if (t !== null) {
      return t.dehydrated;
    }
  }
  return null;
}
function Xe(e) {
  if (Qe(e) !== e) {
    throw Error(l(188));
  }
}
function Je(e) {
  e = function (e) {
    var t = e.alternate;
    if (!t) {
      if ((t = Qe(e)) === null) {
        throw Error(l(188));
      }
      if (t !== e) {
        return null;
      } else {
        return e;
      }
    }
    var n = e;
    var r = t;
    while (true) {
      var a = n.return;
      if (a === null) {
        break;
      }
      var o = a.alternate;
      if (o === null) {
        if ((r = a.return) !== null) {
          n = r;
          continue;
        }
        break;
      }
      if (a.child === o.child) {
        for (o = a.child; o;) {
          if (o === n) {
            Xe(a);
            return e;
          }
          if (o === r) {
            Xe(a);
            return t;
          }
          o = o.sibling;
        }
        throw Error(l(188));
      }
      if (n.return !== r.return) {
        n = a;
        r = o;
      } else {
        var i = false;
        for (var u = a.child; u;) {
          if (u === n) {
            i = true;
            n = a;
            r = o;
            break;
          }
          if (u === r) {
            i = true;
            r = a;
            n = o;
            break;
          }
          u = u.sibling;
        }
        if (!i) {
          for (u = o.child; u;) {
            if (u === n) {
              i = true;
              n = o;
              r = a;
              break;
            }
            if (u === r) {
              i = true;
              r = o;
              n = a;
              break;
            }
            u = u.sibling;
          }
          if (!i) {
            throw Error(l(189));
          }
        }
      }
      if (n.alternate !== r) {
        throw Error(l(190));
      }
    }
    if (n.tag !== 3) {
      throw Error(l(188));
    }
    if (n.stateNode.current === n) {
      return e;
    } else {
      return t;
    }
  }(e);
  if (!e) {
    return null;
  }
  var t = e;
  while (true) {
    if (t.tag === 5 || t.tag === 6) {
      return t;
    }
    if (t.child) {
      t.child.return = t;
      t = t.child;
    } else {
      if (t === e) {
        break;
      }
      while (!t.sibling) {
        if (!t.return || t.return === e) {
          return null;
        }
        t = t.return;
      }
      t.sibling.return = t.return;
      t = t.sibling;
    }
  }
  return null;
}
function et(e, t) {
  var n = e.alternate;
  while (t !== null) {
    if (t === e || t === n) {
      return true;
    }
    t = t.return;
  }
  return false;
}
var tt;
var nt;
var rt;
var at;
var ot = false;
var lt = [];
var it = null;
var ut = null;
var ct = null;
var st = new Map();
var ft = new Map();
var dt = [];
var pt = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function ht(e, t, n, r, a) {
  return {
    blockedOn: e,
    domEventName: t,
    eventSystemFlags: n | 16,
    nativeEvent: a,
    targetContainers: [r]
  };
}
function vt(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      it = null;
      break;
    case "dragenter":
    case "dragleave":
      ut = null;
      break;
    case "mouseover":
    case "mouseout":
      ct = null;
      break;
    case "pointerover":
    case "pointerout":
      st.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      ft.delete(t.pointerId);
  }
}
function mt(e, t, n, r, a, o) {
  if (e === null || e.nativeEvent !== o) {
    e = ht(t, n, r, a, o);
    if (t !== null) {
      if ((t = ra(t)) !== null) {
        nt(t);
      }
    }
    return e;
  } else {
    e.eventSystemFlags |= r;
    t = e.targetContainers;
    if (a !== null && t.indexOf(a) === -1) {
      t.push(a);
    }
    return e;
  }
}
function yt(e) {
  var t = na(e.target);
  if (t !== null) {
    var n = Qe(t);
    if (n !== null) {
      if ((t = n.tag) === 13) {
        if ((t = Ge(n)) !== null) {
          e.blockedOn = t;
          at(e.lanePriority, function () {
            o.unstable_runWithPriority(e.priority, function () {
              rt(n);
            });
          });
          return;
        }
      } else if (t === 3 && n.stateNode.hydrate) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function gt(e) {
  if (e.blockedOn !== null) {
    return false;
  }
  for (var t = e.targetContainers; t.length > 0;) {
    var n = Jt(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n !== null) {
      if ((t = ra(n)) !== null) {
        nt(t);
      }
      e.blockedOn = n;
      return false;
    }
    t.shift();
  }
  return true;
}
function bt(e, t, n) {
  if (gt(e)) {
    n.delete(t);
  }
}
function wt() {
  for (ot = false; lt.length > 0;) {
    var e = lt[0];
    if (e.blockedOn !== null) {
      if ((e = ra(e.blockedOn)) !== null) {
        tt(e);
      }
      break;
    }
    for (var t = e.targetContainers; t.length > 0;) {
      var n = Jt(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n !== null) {
        e.blockedOn = n;
        break;
      }
      t.shift();
    }
    if (e.blockedOn === null) {
      lt.shift();
    }
  }
  if (it !== null && gt(it)) {
    it = null;
  }
  if (ut !== null && gt(ut)) {
    ut = null;
  }
  if (ct !== null && gt(ct)) {
    ct = null;
  }
  st.forEach(bt);
  ft.forEach(bt);
}
function kt(e, t) {
  if (e.blockedOn === t) {
    e.blockedOn = null;
    if (!ot) {
      ot = true;
      o.unstable_scheduleCallback(o.unstable_NormalPriority, wt);
    }
  }
}
function xt(e) {
  function t(t) {
    return kt(t, e);
  }
  if (lt.length > 0) {
    kt(lt[0], e);
    for (var n = 1; n < lt.length; n++) {
      var r = lt[n];
      if (r.blockedOn === e) {
        r.blockedOn = null;
      }
    }
  }
  if (it !== null) {
    kt(it, e);
  }
  if (ut !== null) {
    kt(ut, e);
  }
  if (ct !== null) {
    kt(ct, e);
  }
  st.forEach(t);
  ft.forEach(t);
  n = 0;
  for (; n < dt.length; n++) {
    if ((r = dt[n]).blockedOn === e) {
      r.blockedOn = null;
    }
  }
  while (dt.length > 0 && (n = dt[0]).blockedOn === null) {
    yt(n);
    if (n.blockedOn === null) {
      dt.shift();
    }
  }
}
function Ct(e, t) {
  var n = {};
  n[e.toLowerCase()] = t.toLowerCase();
  n["Webkit" + e] = "webkit" + t;
  n["Moz" + e] = "moz" + t;
  return n;
}
var St = {
  animationend: Ct("Animation", "AnimationEnd"),
  animationiteration: Ct("Animation", "AnimationIteration"),
  animationstart: Ct("Animation", "AnimationStart"),
  transitionend: Ct("Transition", "TransitionEnd")
};
var Et = {};
var zt = {};
function Lt(e) {
  if (Et[e]) {
    return Et[e];
  }
  if (!St[e]) {
    return e;
  }
  var t;
  var n = St[e];
  for (t in n) {
    if (n.hasOwnProperty(t) && t in zt) {
      return Et[e] = n[t];
    }
  }
  return e;
}
if (f) {
  zt = document.createElement("div").style;
  if (!("AnimationEvent" in window)) {
    delete St.animationend.animation;
    delete St.animationiteration.animation;
    delete St.animationstart.animation;
  }
  if (!("TransitionEvent" in window)) {
    delete St.transitionend.transition;
  }
}
var _t = Lt("animationend");
var Pt = Lt("animationiteration");
var Nt = Lt("animationstart");
var jt = Lt("transitionend");
var Ot = new Map();
var Tt = new Map();
var Mt = ["abort", "abort", _t, "animationEnd", Pt, "animationIteration", Nt, "animationStart", "canplay", "canPlay", "canplaythrough", "canPlayThrough", "durationchange", "durationChange", "emptied", "emptied", "encrypted", "encrypted", "ended", "ended", "error", "error", "gotpointercapture", "gotPointerCapture", "load", "load", "loadeddata", "loadedData", "loadedmetadata", "loadedMetadata", "loadstart", "loadStart", "lostpointercapture", "lostPointerCapture", "playing", "playing", "progress", "progress", "seeking", "seeking", "stalled", "stalled", "suspend", "suspend", "timeupdate", "timeUpdate", jt, "transitionEnd", "waiting", "waiting"];
function Bt(e, t) {
  for (var n = 0; n < e.length; n += 2) {
    var r = e[n];
    var a = e[n + 1];
    a = "on" + (a[0].toUpperCase() + a.slice(1));
    Tt.set(r, t);
    Ot.set(r, a);
    c(a, [r]);
  }
}
(0, o.unstable_now)();
var Dt = 8;
function Ut(e) {
  if ((e & 1) !== 0) {
    Dt = 15;
    return 1;
  }
  if ((e & 2) !== 0) {
    Dt = 14;
    return 2;
  }
  if ((e & 4) !== 0) {
    Dt = 13;
    return 4;
  }
  var t = e & 24;
  if (t !== 0) {
    Dt = 12;
    return t;
  } else if ((e & 32) !== 0) {
    Dt = 11;
    return 32;
  } else if ((t = e & 192) !== 0) {
    Dt = 10;
    return t;
  } else if ((e & 256) !== 0) {
    Dt = 9;
    return 256;
  } else if ((t = e & 3584) !== 0) {
    Dt = 8;
    return t;
  } else if ((e & 4096) !== 0) {
    Dt = 7;
    return 4096;
  } else if ((t = e & 4186112) !== 0) {
    Dt = 6;
    return t;
  } else if ((t = e & 62914560) !== 0) {
    Dt = 5;
    return t;
  } else if (e & 67108864) {
    Dt = 4;
    return 67108864;
  } else if ((e & 134217728) !== 0) {
    Dt = 3;
    return 134217728;
  } else if ((t = e & 805306368) !== 0) {
    Dt = 2;
    return t;
  } else if ((e & 1073741824) !== 0) {
    Dt = 1;
    return 1073741824;
  } else {
    Dt = 8;
    return e;
  }
}
function At(e, t) {
  var n = e.pendingLanes;
  if (n === 0) {
    return Dt = 0;
  }
  var r = 0;
  var a = 0;
  var o = e.expiredLanes;
  var l = e.suspendedLanes;
  var i = e.pingedLanes;
  if (o !== 0) {
    r = o;
    a = Dt = 15;
  } else if ((o = n & 134217727) !== 0) {
    var u = o & ~l;
    if (u !== 0) {
      r = Ut(u);
      a = Dt;
    } else if ((i &= o) !== 0) {
      r = Ut(i);
      a = Dt;
    }
  } else if ((o = n & ~l) !== 0) {
    r = Ut(o);
    a = Dt;
  } else if (i !== 0) {
    r = Ut(i);
    a = Dt;
  }
  if (r === 0) {
    return 0;
  }
  r = n & (((r = 31 - Ht(r)) < 0 ? 0 : 1 << r) << 1) - 1;
  if (t !== 0 && t !== r && (t & l) === 0) {
    Ut(t);
    if (a <= Dt) {
      return t;
    }
    Dt = a;
  }
  if ((t = e.entangledLanes) !== 0) {
    e = e.entanglements;
    t &= r;
    while (t > 0) {
      a = 1 << (n = 31 - Ht(t));
      r |= e[n];
      t &= ~a;
    }
  }
  return r;
}
function Rt(e) {
  if ((e = e.pendingLanes & -1073741825) !== 0) {
    return e;
  } else if (e & 1073741824) {
    return 1073741824;
  } else {
    return 0;
  }
}
function It(e, t) {
  switch (e) {
    case 15:
      return 1;
    case 14:
      return 2;
    case 12:
      if ((e = Ft(~t & 24)) === 0) {
        return It(10, t);
      } else {
        return e;
      }
    case 10:
      if ((e = Ft(~t & 192)) === 0) {
        return It(8, t);
      } else {
        return e;
      }
    case 8:
      if ((e = Ft(~t & 3584)) === 0) {
        if ((e = Ft(~t & 4186112)) === 0) {
          e = 512;
        }
      }
      return e;
    case 2:
      if ((t = Ft(~t & 805306368)) === 0) {
        t = 268435456;
      }
      return t;
  }
  throw Error(l(358, e));
}
function Ft(e) {
  return e & -e;
}
function Vt(e) {
  var t = [];
  for (var n = 0; n < 31; n++) {
    t.push(e);
  }
  return t;
}
function Wt(e, t, n) {
  e.pendingLanes |= t;
  var r = t - 1;
  e.suspendedLanes &= r;
  e.pingedLanes &= r;
  (e = e.eventTimes)[t = 31 - Ht(t)] = n;
}
var Ht = Math.clz32 ? Math.clz32 : function (e) {
  if (e === 0) {
    return 32;
  } else {
    return 31 - (Zt(e) / qt | 0) | 0;
  }
};
var Zt = Math.log;
var qt = Math.LN2;
var Kt = o.unstable_UserBlockingPriority;
var Yt = o.unstable_runWithPriority;
var $t = true;
function Qt(e, t, n, r) {
  if (!Ue) {
    Be();
  }
  var a = Xt;
  var o = Ue;
  Ue = true;
  try {
    Me(a, e, t, n, r);
  } finally {
    if (!(Ue = o)) {
      Re();
    }
  }
}
function Gt(e, t, n, r) {
  Yt(Kt, Xt.bind(null, e, t, n, r));
}
function Xt(e, t, n, r) {
  var a;
  if ($t) {
    if ((a = (t & 4) === 0) && lt.length > 0 && pt.indexOf(e) > -1) {
      e = ht(null, e, t, n, r);
      lt.push(e);
    } else {
      var o = Jt(e, t, n, r);
      if (o === null) {
        if (a) {
          vt(e, r);
        }
      } else {
        if (a) {
          if (pt.indexOf(e) > -1) {
            e = ht(o, e, t, n, r);
            lt.push(e);
            return;
          }
          if (function (e, t, n, r, a) {
            switch (t) {
              case "focusin":
                it = mt(it, e, t, n, r, a);
                return true;
              case "dragenter":
                ut = mt(ut, e, t, n, r, a);
                return true;
              case "mouseover":
                ct = mt(ct, e, t, n, r, a);
                return true;
              case "pointerover":
                var o = a.pointerId;
                st.set(o, mt(st.get(o) || null, e, t, n, r, a));
                return true;
              case "gotpointercapture":
                o = a.pointerId;
                ft.set(o, mt(ft.get(o) || null, e, t, n, r, a));
                return true;
            }
            return false;
          }(o, e, t, n, r)) {
            return;
          }
          vt(e, r);
        }
        Br(e, t, r, null, n);
      }
    }
  }
}
function Jt(e, t, n, r) {
  var a = ze(r);
  if ((a = na(a)) !== null) {
    var o = Qe(a);
    if (o === null) {
      a = null;
    } else {
      var l = o.tag;
      if (l === 13) {
        if ((a = Ge(o)) !== null) {
          return a;
        }
        a = null;
      } else if (l === 3) {
        if (o.stateNode.hydrate) {
          if (o.tag === 3) {
            return o.stateNode.containerInfo;
          } else {
            return null;
          }
        }
        a = null;
      } else if (o !== a) {
        a = null;
      }
    }
  }
  Br(e, t, r, a, n);
  return null;
}
var en = null;
var tn = null;
var nn = null;
function rn() {
  if (nn) {
    return nn;
  }
  var e;
  var t;
  var n = tn;
  var r = n.length;
  var a = "value" in en ? en.value : en.textContent;
  var o = a.length;
  for (e = 0; e < r && n[e] === a[e]; e++);
  var l = r - e;
  for (t = 1; t <= l && n[r - t] === a[o - t]; t++);
  return nn = a.slice(e, t > 1 ? 1 - t : undefined);
}
function an(e) {
  var t = e.keyCode;
  if ("charCode" in e) {
    if ((e = e.charCode) === 0 && t === 13) {
      e = 13;
    }
  } else {
    e = t;
  }
  if (e === 10) {
    e = 13;
  }
  if (e >= 32 || e === 13) {
    return e;
  } else {
    return 0;
  }
}
function on() {
  return true;
}
function ln() {
  return false;
}
function un(e) {
  function t(t, n, r, a, o) {
    this._reactName = t;
    this._targetInst = r;
    this.type = n;
    this.nativeEvent = a;
    this.target = o;
    this.currentTarget = null;
    for (var l in e) {
      if (e.hasOwnProperty(l)) {
        t = e[l];
        this[l] = t ? t(a) : a[l];
      }
    }
    this.isDefaultPrevented = a.defaultPrevented ?? a.returnValue === false ? on : ln;
    this.isPropagationStopped = ln;
    return this;
  }
  a(t.prototype, {
    preventDefault: function () {
      this.defaultPrevented = true;
      var e = this.nativeEvent;
      if (e) {
        if (e.preventDefault) {
          e.preventDefault();
        } else if (typeof e.returnValue !== "unknown") {
          e.returnValue = false;
        }
        this.isDefaultPrevented = on;
      }
    },
    stopPropagation: function () {
      var e = this.nativeEvent;
      if (e) {
        if (e.stopPropagation) {
          e.stopPropagation();
        } else if (typeof e.cancelBubble !== "unknown") {
          e.cancelBubble = true;
        }
        this.isPropagationStopped = on;
      }
    },
    persist: function () {},
    isPersistent: on
  });
  return t;
}
var cn;
var sn;
var fn;
var dn = {
  eventPhase: 0,
  bubbles: 0,
  cancelable: 0,
  timeStamp: function (e) {
    return e.timeStamp || Date.now();
  },
  defaultPrevented: 0,
  isTrusted: 0
};
var pn = un(dn);
var hn = a({}, dn, {
  view: 0,
  detail: 0
});
var vn = un(hn);
var mn = a({}, hn, {
  screenX: 0,
  screenY: 0,
  clientX: 0,
  clientY: 0,
  pageX: 0,
  pageY: 0,
  ctrlKey: 0,
  shiftKey: 0,
  altKey: 0,
  metaKey: 0,
  getModifierState: _n,
  button: 0,
  buttons: 0,
  relatedTarget: function (e) {
    if (e.relatedTarget === undefined) {
      if (e.fromElement === e.srcElement) {
        return e.toElement;
      } else {
        return e.fromElement;
      }
    } else {
      return e.relatedTarget;
    }
  },
  movementX: function (e) {
    if ("movementX" in e) {
      return e.movementX;
    } else {
      if (e !== fn) {
        if (fn && e.type === "mousemove") {
          cn = e.screenX - fn.screenX;
          sn = e.screenY - fn.screenY;
        } else {
          sn = cn = 0;
        }
        fn = e;
      }
      return cn;
    }
  },
  movementY: function (e) {
    if ("movementY" in e) {
      return e.movementY;
    } else {
      return sn;
    }
  }
});
var yn = un(mn);
var gn = un(a({}, mn, {
  dataTransfer: 0
}));
var bn = un(a({}, hn, {
  relatedTarget: 0
}));
var wn = un(a({}, dn, {
  animationName: 0,
  elapsedTime: 0,
  pseudoElement: 0
}));
var kn = a({}, dn, {
  clipboardData: function (e) {
    if ("clipboardData" in e) {
      return e.clipboardData;
    } else {
      return window.clipboardData;
    }
  }
});
var xn = un(kn);
var Cn = un(a({}, dn, {
  data: 0
}));
var Sn = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
};
var En = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
};
var zn = {
  Alt: "altKey",
  Control: "ctrlKey",
  Meta: "metaKey",
  Shift: "shiftKey"
};
function Ln(e) {
  var t = this.nativeEvent;
  if (t.getModifierState) {
    return t.getModifierState(e);
  } else {
    return !!(e = zn[e]) && !!t[e];
  }
}
function _n() {
  return Ln;
}
var Pn = a({}, hn, {
  key: function (e) {
    if (e.key) {
      var t = Sn[e.key] || e.key;
      if (t !== "Unidentified") {
        return t;
      }
    }
    if (e.type === "keypress") {
      if ((e = an(e)) === 13) {
        return "Enter";
      } else {
        return String.fromCharCode(e);
      }
    } else if (e.type === "keydown" || e.type === "keyup") {
      return En[e.keyCode] || "Unidentified";
    } else {
      return "";
    }
  },
  code: 0,
  location: 0,
  ctrlKey: 0,
  shiftKey: 0,
  altKey: 0,
  metaKey: 0,
  repeat: 0,
  locale: 0,
  getModifierState: _n,
  charCode: function (e) {
    if (e.type === "keypress") {
      return an(e);
    } else {
      return 0;
    }
  },
  keyCode: function (e) {
    if (e.type === "keydown" || e.type === "keyup") {
      return e.keyCode;
    } else {
      return 0;
    }
  },
  which: function (e) {
    if (e.type === "keypress") {
      return an(e);
    } else if (e.type === "keydown" || e.type === "keyup") {
      return e.keyCode;
    } else {
      return 0;
    }
  }
});
var Nn = un(Pn);
var jn = un(a({}, mn, {
  pointerId: 0,
  width: 0,
  height: 0,
  pressure: 0,
  tangentialPressure: 0,
  tiltX: 0,
  tiltY: 0,
  twist: 0,
  pointerType: 0,
  isPrimary: 0
}));
var On = un(a({}, hn, {
  touches: 0,
  targetTouches: 0,
  changedTouches: 0,
  altKey: 0,
  metaKey: 0,
  ctrlKey: 0,
  shiftKey: 0,
  getModifierState: _n
}));
var Tn = un(a({}, dn, {
  propertyName: 0,
  elapsedTime: 0,
  pseudoElement: 0
}));
var Mn = a({}, mn, {
  deltaX: function (e) {
    if ("deltaX" in e) {
      return e.deltaX;
    } else if ("wheelDeltaX" in e) {
      return -e.wheelDeltaX;
    } else {
      return 0;
    }
  },
  deltaY: function (e) {
    if ("deltaY" in e) {
      return e.deltaY;
    } else if ("wheelDeltaY" in e) {
      return -e.wheelDeltaY;
    } else if ("wheelDelta" in e) {
      return -e.wheelDelta;
    } else {
      return 0;
    }
  },
  deltaZ: 0,
  deltaMode: 0
});
var Bn = un(Mn);
var Dn = [9, 13, 27, 32];
var Un = f && "CompositionEvent" in window;
var An = null;
if (f && "documentMode" in document) {
  An = document.documentMode;
}
var Rn = f && "TextEvent" in window && !An;
var In = f && (!Un || An && An > 8 && An <= 11);
var Fn = String.fromCharCode(32);
var Vn = false;
function Wn(e, t) {
  switch (e) {
    case "keyup":
      return Dn.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function Hn(e) {
  if (typeof (e = e.detail) === "object" && "data" in e) {
    return e.data;
  } else {
    return null;
  }
}
var Zn = false;
var qn = {
  color: true,
  date: true,
  datetime: true,
  "datetime-local": true,
  email: true,
  month: true,
  number: true,
  password: true,
  range: true,
  search: true,
  tel: true,
  text: true,
  time: true,
  url: true,
  week: true
};
function Kn(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  if (t === "input") {
    return !!qn[e.type];
  } else {
    return t === "textarea";
  }
}
function Yn(e, t, n, r) {
  je(r);
  if ((t = Ur(t, "onChange")).length > 0) {
    n = new pn("onChange", "change", null, n, r);
    e.push({
      event: n,
      listeners: t
    });
  }
}
var $n = null;
var Qn = null;
function Gn(e) {
  Pr(e, 0);
}
function Xn(e) {
  if (G(aa(e))) {
    return e;
  }
}
function Jn(e, t) {
  if (e === "change") {
    return t;
  }
}
var er = false;
if (f) {
  var tr;
  if (f) {
    var nr = "oninput" in document;
    if (!nr) {
      var rr = document.createElement("div");
      rr.setAttribute("oninput", "return;");
      nr = typeof rr.oninput === "function";
    }
    tr = nr;
  } else {
    tr = false;
  }
  er = tr && (!document.documentMode || document.documentMode > 9);
}
function ar() {
  if ($n) {
    $n.detachEvent("onpropertychange", or);
    Qn = $n = null;
  }
}
function or(e) {
  if (e.propertyName === "value" && Xn(Qn)) {
    var t = [];
    Yn(t, Qn, e, ze(e));
    e = Gn;
    if (Ue) {
      e(t);
    } else {
      Ue = true;
      try {
        Te(e, t);
      } finally {
        Ue = false;
        Re();
      }
    }
  }
}
function lr(e, t, n) {
  if (e === "focusin") {
    ar();
    Qn = n;
    ($n = t).attachEvent("onpropertychange", or);
  } else if (e === "focusout") {
    ar();
  }
}
function ir(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown") {
    return Xn(Qn);
  }
}
function ur(e, t) {
  if (e === "click") {
    return Xn(t);
  }
}
function cr(e, t) {
  if (e === "input" || e === "change") {
    return Xn(t);
  }
}
var sr = typeof Object.is === "function" ? Object.is : function (e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
};
var fr = Object.prototype.hasOwnProperty;
function dr(e, t) {
  if (sr(e, t)) {
    return true;
  }
  if (typeof e !== "object" || e === null || typeof t !== "object" || t === null) {
    return false;
  }
  var n = Object.keys(e);
  var r = Object.keys(t);
  if (n.length !== r.length) {
    return false;
  }
  for (r = 0; r < n.length; r++) {
    if (!fr.call(t, n[r]) || !sr(e[n[r]], t[n[r]])) {
      return false;
    }
  }
  return true;
}
function pr(e) {
  while (e && e.firstChild) {
    e = e.firstChild;
  }
  return e;
}
function hr(e, t) {
  var n;
  var r = pr(e);
  for (e = 0; r;) {
    if (r.nodeType === 3) {
      n = e + r.textContent.length;
      if (e <= t && n >= t) {
        return {
          node: r,
          offset: t - e
        };
      }
      e = n;
    }
    e: {
      while (r) {
        if (r.nextSibling) {
          r = r.nextSibling;
          break e;
        }
        r = r.parentNode;
      }
      r = undefined;
    }
    r = pr(r);
  }
}
function vr(e, t) {
  return !!e && !!t && (e === t || (!e || e.nodeType !== 3) && (t && t.nodeType === 3 ? vr(e, t.parentNode) : "contains" in e ? e.contains(t) : !!e.compareDocumentPosition && !!(e.compareDocumentPosition(t) & 16)));
}
function mr() {
  for (var e = window, t = X(); t instanceof e.HTMLIFrameElement;) {
    try {
      var n = typeof t.contentWindow.location.href === "string";
    } catch (r) {
      n = false;
    }
    if (!n) {
      break;
    }
    t = X((e = t.contentWindow).document);
  }
  return t;
}
function yr(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
}
var gr = f && "documentMode" in document && document.documentMode <= 11;
var br = null;
var wr = null;
var kr = null;
var xr = false;
function Cr(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  if (!xr && br != null && br === X(r)) {
    if ("selectionStart" in (r = br) && yr(r)) {
      r = {
        start: r.selectionStart,
        end: r.selectionEnd
      };
    } else {
      r = {
        anchorNode: (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection()).anchorNode,
        anchorOffset: r.anchorOffset,
        focusNode: r.focusNode,
        focusOffset: r.focusOffset
      };
    }
    if (!kr || !dr(kr, r)) {
      kr = r;
      if ((r = Ur(wr, "onSelect")).length > 0) {
        t = new pn("onSelect", "select", null, t, n);
        e.push({
          event: t,
          listeners: r
        });
        t.target = br;
      }
    }
  }
}
Bt("cancel cancel click click close close contextmenu contextMenu copy copy cut cut auxclick auxClick dblclick doubleClick dragend dragEnd dragstart dragStart drop drop focusin focus focusout blur input input invalid invalid keydown keyDown keypress keyPress keyup keyUp mousedown mouseDown mouseup mouseUp paste paste pause pause play play pointercancel pointerCancel pointerdown pointerDown pointerup pointerUp ratechange rateChange reset reset seeked seeked submit submit touchcancel touchCancel touchend touchEnd touchstart touchStart volumechange volumeChange".split(" "), 0);
Bt("drag drag dragenter dragEnter dragexit dragExit dragleave dragLeave dragover dragOver mousemove mouseMove mouseout mouseOut mouseover mouseOver pointermove pointerMove pointerout pointerOut pointerover pointerOver scroll scroll toggle toggle touchmove touchMove wheel wheel".split(" "), 1);
Bt(Mt, 2);
for (var Sr = "change selectionchange textInput compositionstart compositionend compositionupdate".split(" "), Er = 0; Er < Sr.length; Er++) {
  Tt.set(Sr[Er], 0);
}
s("onMouseEnter", ["mouseout", "mouseover"]);
s("onMouseLeave", ["mouseout", "mouseover"]);
s("onPointerEnter", ["pointerout", "pointerover"]);
s("onPointerLeave", ["pointerout", "pointerover"]);
c("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
c("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
c("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
c("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
c("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
c("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var zr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" ");
var Lr = new Set("cancel close invalid load scroll toggle".split(" ").concat(zr));
function _r(e, t, n) {
  var r = e.type || "unknown-event";
  e.currentTarget = n;
  (function (e, t, n, r, a, o, i, u, c) {
    $e.apply(this, arguments);
    if (He) {
      if (!He) {
        throw Error(l(198));
      }
      var s = Ze;
      He = false;
      Ze = null;
      if (!qe) {
        qe = true;
        Ke = s;
      }
    }
  })(r, t, undefined, e);
  e.currentTarget = null;
}
function Pr(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n];
    var a = r.event;
    r = r.listeners;
    e: {
      var o = undefined;
      if (t) {
        for (var l = r.length - 1; l >= 0; l--) {
          var i = r[l];
          var u = i.instance;
          var c = i.currentTarget;
          i = i.listener;
          if (u !== o && a.isPropagationStopped()) {
            break e;
          }
          _r(a, i, c);
          o = u;
        }
      } else {
        for (l = 0; l < r.length; l++) {
          u = (i = r[l]).instance;
          c = i.currentTarget;
          i = i.listener;
          if (u !== o && a.isPropagationStopped()) {
            break e;
          }
          _r(a, i, c);
          o = u;
        }
      }
    }
  }
  if (qe) {
    e = Ke;
    qe = false;
    Ke = null;
    throw e;
  }
}
function Nr(e, t) {
  var n = la(t);
  var r = e + "__bubble";
  if (!n.has(r)) {
    Mr(t, e, 2, false);
    n.add(r);
  }
}
var jr = "_reactListening" + Math.random().toString(36).slice(2);
function Or(e) {
  if (!e[jr]) {
    e[jr] = true;
    i.forEach(function (t) {
      if (!Lr.has(t)) {
        Tr(t, false, e, null);
      }
      Tr(t, true, e, null);
    });
  }
}
function Tr(e, t, n, r, a = 0) {
  var o = n;
  if (e === "selectionchange" && n.nodeType !== 9) {
    o = n.ownerDocument;
  }
  if (r !== null && !t && Lr.has(e)) {
    if (e !== "scroll") {
      return;
    }
    a |= 2;
    o = r;
  }
  var l = la(o);
  var i = e + "__" + (t ? "capture" : "bubble");
  if (!l.has(i)) {
    if (t) {
      a |= 4;
    }
    Mr(o, e, a, t);
    l.add(i);
  }
}
function Mr(e, t, n, r) {
  var a = Tt.get(t);
  switch (a === undefined ? 2 : a) {
    case 0:
      a = Qt;
      break;
    case 1:
      a = Gt;
      break;
    default:
      a = Xt;
  }
  n = a.bind(null, t, n, e);
  a = undefined;
  if (!!Fe && (t === "touchstart" || t === "touchmove" || t === "wheel")) {
    a = true;
  }
  if (r) {
    if (a !== undefined) {
      e.addEventListener(t, n, {
        capture: true,
        passive: a
      });
    } else {
      e.addEventListener(t, n, true);
    }
  } else if (a !== undefined) {
    e.addEventListener(t, n, {
      passive: a
    });
  } else {
    e.addEventListener(t, n, false);
  }
}
function Br(e, t, n, r, a) {
  var o = r;
  if ((t & 1) === 0 && (t & 2) === 0 && r !== null) {
    e: while (true) {
      if (r === null) {
        return;
      }
      var l = r.tag;
      if (l === 3 || l === 4) {
        var i = r.stateNode.containerInfo;
        if (i === a || i.nodeType === 8 && i.parentNode === a) {
          break;
        }
        if (l === 4) {
          for (l = r.return; l !== null;) {
            var u = l.tag;
            if ((u === 3 || u === 4) && ((u = l.stateNode.containerInfo) === a || u.nodeType === 8 && u.parentNode === a)) {
              return;
            }
            l = l.return;
          }
        }
        while (i !== null) {
          if ((l = na(i)) === null) {
            return;
          }
          if ((u = l.tag) === 5 || u === 6) {
            r = o = l;
            continue e;
          }
          i = i.parentNode;
        }
      }
      r = r.return;
    }
  }
  (function (e, t, n) {
    if (Ae) {
      return e(t, n);
    }
    Ae = true;
    try {
      De(e, t, n);
    } finally {
      Ae = false;
      Re();
    }
  })(function () {
    var r = o;
    var a = ze(n);
    var l = [];
    e: {
      var i = Ot.get(e);
      if (i !== undefined) {
        var u = pn;
        var c = e;
        switch (e) {
          case "keypress":
            if (an(n) === 0) {
              break e;
            }
          case "keydown":
          case "keyup":
            u = Nn;
            break;
          case "focusin":
            c = "focus";
            u = bn;
            break;
          case "focusout":
            c = "blur";
            u = bn;
            break;
          case "beforeblur":
          case "afterblur":
            u = bn;
            break;
          case "click":
            if (n.button === 2) {
              break e;
            }
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            u = yn;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            u = gn;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            u = On;
            break;
          case _t:
          case Pt:
          case Nt:
            u = wn;
            break;
          case jt:
            u = Tn;
            break;
          case "scroll":
            u = vn;
            break;
          case "wheel":
            u = Bn;
            break;
          case "copy":
          case "cut":
          case "paste":
            u = xn;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            u = jn;
        }
        var s = (t & 4) !== 0;
        var f = !s && e === "scroll";
        var d = s ? i !== null ? i + "Capture" : null : i;
        s = [];
        for (var p, h = r; h !== null;) {
          var v = (p = h).stateNode;
          if (p.tag === 5 && v !== null) {
            p = v;
            if (d !== null) {
              if ((v = Ie(h, d)) != null) {
                s.push(Dr(h, v, p));
              }
            }
          }
          if (f) {
            break;
          }
          h = h.return;
        }
        if (s.length > 0) {
          i = new u(i, c, null, n, a);
          l.push({
            event: i,
            listeners: s
          });
        }
      }
    }
    if ((t & 7) === 0) {
      u = e === "mouseout" || e === "pointerout";
      if ((!(i = e === "mouseover" || e === "pointerover") || (t & 16) !== 0 || !(c = n.relatedTarget || n.fromElement) || !na(c) && !c[ea]) && (u || i) && (i = a.window === a ? a : (i = a.ownerDocument) ? i.defaultView || i.parentWindow : window, u ? (u = r, (c = (c = n.relatedTarget || n.toElement) ? na(c) : null) !== null && (c !== (f = Qe(c)) || c.tag !== 5 && c.tag !== 6) && (c = null)) : (u = null, c = r), u !== c)) {
        s = yn;
        v = "onMouseLeave";
        d = "onMouseEnter";
        h = "mouse";
        if (e === "pointerout" || e === "pointerover") {
          s = jn;
          v = "onPointerLeave";
          d = "onPointerEnter";
          h = "pointer";
        }
        f = u == null ? i : aa(u);
        p = c == null ? i : aa(c);
        (i = new s(v, h + "leave", u, n, a)).target = f;
        i.relatedTarget = p;
        v = null;
        if (na(a) === r) {
          (s = new s(d, h + "enter", c, n, a)).target = p;
          s.relatedTarget = f;
          v = s;
        }
        f = v;
        if (u && c) {
          e: {
            d = c;
            h = 0;
            p = s = u;
            for (; p; p = Ar(p)) {
              h++;
            }
            p = 0;
            v = d;
            for (; v; v = Ar(v)) {
              p++;
            }
            while (h - p > 0) {
              s = Ar(s);
              h--;
            }
            while (p - h > 0) {
              d = Ar(d);
              p--;
            }
            while (h--) {
              if (s === d || d !== null && s === d.alternate) {
                break e;
              }
              s = Ar(s);
              d = Ar(d);
            }
            s = null;
          }
        } else {
          s = null;
        }
        if (u !== null) {
          Rr(l, i, u, s, false);
        }
        if (c !== null && f !== null) {
          Rr(l, f, c, s, true);
        }
      }
      if ((u = (i = r ? aa(r) : window).nodeName && i.nodeName.toLowerCase()) === "select" || u === "input" && i.type === "file") {
        var m = Jn;
      } else if (Kn(i)) {
        if (er) {
          m = cr;
        } else {
          m = ir;
          var y = lr;
        }
      } else if ((u = i.nodeName) && u.toLowerCase() === "input" && (i.type === "checkbox" || i.type === "radio")) {
        m = ur;
      }
      if (m &&= m(e, r)) {
        Yn(l, m, n, a);
      } else {
        if (y) {
          y(e, i, r);
        }
        if (e === "focusout" && (y = i._wrapperState) && y.controlled && i.type === "number") {
          ae(i, "number", i.value);
        }
      }
      y = r ? aa(r) : window;
      switch (e) {
        case "focusin":
          if (Kn(y) || y.contentEditable === "true") {
            br = y;
            wr = r;
            kr = null;
          }
          break;
        case "focusout":
          kr = wr = br = null;
          break;
        case "mousedown":
          xr = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          xr = false;
          Cr(l, n, a);
          break;
        case "selectionchange":
          if (gr) {
            break;
          }
        case "keydown":
        case "keyup":
          Cr(l, n, a);
      }
      var g;
      if (Un) {
        e: {
          switch (e) {
            case "compositionstart":
              var b = "onCompositionStart";
              break e;
            case "compositionend":
              b = "onCompositionEnd";
              break e;
            case "compositionupdate":
              b = "onCompositionUpdate";
              break e;
          }
          b = undefined;
        }
      } else if (Zn) {
        if (Wn(e, n)) {
          b = "onCompositionEnd";
        }
      } else if (e === "keydown" && n.keyCode === 229) {
        b = "onCompositionStart";
      }
      if (b) {
        if (In && n.locale !== "ko") {
          if (Zn || b !== "onCompositionStart") {
            if (b === "onCompositionEnd" && Zn) {
              g = rn();
            }
          } else {
            tn = "value" in (en = a) ? en.value : en.textContent;
            Zn = true;
          }
        }
        if ((y = Ur(r, b)).length > 0) {
          b = new Cn(b, e, null, n, a);
          l.push({
            event: b,
            listeners: y
          });
          if (g) {
            b.data = g;
          } else if ((g = Hn(n)) !== null) {
            b.data = g;
          }
        }
      }
      if (g = Rn ? function (e, t) {
        switch (e) {
          case "compositionend":
            return Hn(t);
          case "keypress":
            if (t.which !== 32) {
              return null;
            } else {
              Vn = true;
              return Fn;
            }
          case "textInput":
            if ((e = t.data) === Fn && Vn) {
              return null;
            } else {
              return e;
            }
          default:
            return null;
        }
      }(e, n) : function (e, t) {
        if (Zn) {
          if (e === "compositionend" || !Un && Wn(e, t)) {
            e = rn();
            nn = tn = en = null;
            Zn = false;
            return e;
          } else {
            return null;
          }
        }
        switch (e) {
          case "paste":
          default:
            return null;
          case "keypress":
            if (!t.ctrlKey && !t.altKey && !t.metaKey || t.ctrlKey && t.altKey) {
              if (t.char && t.char.length > 1) {
                return t.char;
              }
              if (t.which) {
                return String.fromCharCode(t.which);
              }
            }
            return null;
          case "compositionend":
            if (In && t.locale !== "ko") {
              return null;
            } else {
              return t.data;
            }
        }
      }(e, n)) {
        if ((r = Ur(r, "onBeforeInput")).length > 0) {
          a = new Cn("onBeforeInput", "beforeinput", null, n, a);
          l.push({
            event: a,
            listeners: r
          });
          a.data = g;
        }
      }
    }
    Pr(l, t);
  });
}
function Dr(e, t, n) {
  return {
    instance: e,
    listener: t,
    currentTarget: n
  };
}
function Ur(e, t) {
  var n = t + "Capture";
  var r = [];
  while (e !== null) {
    var a = e;
    var o = a.stateNode;
    if (a.tag === 5 && o !== null) {
      a = o;
      if ((o = Ie(e, n)) != null) {
        r.unshift(Dr(e, o, a));
      }
      if ((o = Ie(e, t)) != null) {
        r.push(Dr(e, o, a));
      }
    }
    e = e.return;
  }
  return r;
}
function Ar(e) {
  if (e === null) {
    return null;
  }
  do {
    e = e.return;
  } while (e && e.tag !== 5);
  return e || null;
}
function Rr(e, t, n, r, a) {
  var o = t._reactName;
  var l = [];
  while (n !== null && n !== r) {
    var i = n;
    var u = i.alternate;
    var c = i.stateNode;
    if (u !== null && u === r) {
      break;
    }
    if (i.tag === 5 && c !== null) {
      i = c;
      if (a) {
        if ((u = Ie(n, o)) != null) {
          l.unshift(Dr(n, u, i));
        }
      } else if (!a) {
        if ((u = Ie(n, o)) != null) {
          l.push(Dr(n, u, i));
        }
      }
    }
    n = n.return;
  }
  if (l.length !== 0) {
    e.push({
      event: t,
      listeners: l
    });
  }
}
function Ir() {}
var Fr = null;
var Vr = null;
function Wr(e, t) {
  switch (e) {
    case "button":
    case "input":
    case "select":
    case "textarea":
      return !!t.autoFocus;
  }
  return false;
}
function Hr(e, t) {
  return e === "textarea" || e === "option" || e === "noscript" || typeof t.children === "string" || typeof t.children === "number" || typeof t.dangerouslySetInnerHTML === "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
}
var Zr = typeof setTimeout === "function" ? setTimeout : undefined;
var qr = typeof clearTimeout === "function" ? clearTimeout : undefined;
function Kr(e) {
  if (e.nodeType === 1) {
    e.textContent = "";
  } else if (e.nodeType === 9) {
    if ((e = e.body) != null) {
      e.textContent = "";
    }
  }
}
function Yr(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) {
      break;
    }
  }
  return e;
}
function $r(e) {
  e = e.previousSibling;
  var t = 0;
  while (e) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) {
          return e;
        }
        t--;
      } else if (n === "/$") {
        t++;
      }
    }
    e = e.previousSibling;
  }
  return null;
}
var Qr = 0;
var Gr = Math.random().toString(36).slice(2);
var Xr = "__reactFiber$" + Gr;
var Jr = "__reactProps$" + Gr;
var ea = "__reactContainer$" + Gr;
var ta = "__reactEvents$" + Gr;
function na(e) {
  var t = e[Xr];
  if (t) {
    return t;
  }
  for (var n = e.parentNode; n;) {
    if (t = n[ea] || n[Xr]) {
      n = t.alternate;
      if (t.child !== null || n !== null && n.child !== null) {
        for (e = $r(e); e !== null;) {
          if (n = e[Xr]) {
            return n;
          }
          e = $r(e);
        }
      }
      return t;
    }
    n = (e = n).parentNode;
  }
  return null;
}
function ra(e) {
  if (!(e = e[Xr] || e[ea]) || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) {
    return null;
  } else {
    return e;
  }
}
function aa(e) {
  if (e.tag === 5 || e.tag === 6) {
    return e.stateNode;
  }
  throw Error(l(33));
}
function oa(e) {
  return e[Jr] || null;
}
function la(e) {
  var t = e[ta];
  if (t === undefined) {
    t = e[ta] = new Set();
  }
  return t;
}
var ia = [];
var ua = -1;
function ca(e) {
  return {
    current: e
  };
}
function sa(e) {
  if (!(ua < 0)) {
    e.current = ia[ua];
    ia[ua] = null;
    ua--;
  }
}
function fa(e, t) {
  ua++;
  ia[ua] = e.current;
  e.current = t;
}
var da = {};
var pa = ca(da);
var ha = ca(false);
var va = da;
function ma(e, t) {
  var n = e.type.contextTypes;
  if (!n) {
    return da;
  }
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) {
    return r.__reactInternalMemoizedMaskedChildContext;
  }
  var a;
  var o = {};
  for (a in n) {
    o[a] = t[a];
  }
  if (r) {
    (e = e.stateNode).__reactInternalMemoizedUnmaskedChildContext = t;
    e.__reactInternalMemoizedMaskedChildContext = o;
  }
  return o;
}
function ya(e) {
  return (e = e.childContextTypes) !== null && e !== undefined;
}
function ga() {
  sa(ha);
  sa(pa);
}
function ba(e, t, n) {
  if (pa.current !== da) {
    throw Error(l(168));
  }
  fa(pa, t);
  fa(ha, n);
}
function wa(e, t, n) {
  var r = e.stateNode;
  e = t.childContextTypes;
  if (typeof r.getChildContext !== "function") {
    return n;
  }
  for (var o in r = r.getChildContext()) {
    if (!(o in e)) {
      throw Error(l(108, K(t) || "Unknown", o));
    }
  }
  return a({}, n, r);
}
function ka(e) {
  e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || da;
  va = pa.current;
  fa(pa, e);
  fa(ha, ha.current);
  return true;
}
function xa(e, t, n) {
  var r = e.stateNode;
  if (!r) {
    throw Error(l(169));
  }
  if (n) {
    e = wa(e, t, va);
    r.__reactInternalMemoizedMergedChildContext = e;
    sa(ha);
    sa(pa);
    fa(pa, e);
  } else {
    sa(ha);
  }
  fa(ha, n);
}
var Ca = null;
var Sa = null;
var Ea = o.unstable_runWithPriority;
var za = o.unstable_scheduleCallback;
var La = o.unstable_cancelCallback;
var _a = o.unstable_shouldYield;
var Pa = o.unstable_requestPaint;
var Na = o.unstable_now;
var ja = o.unstable_getCurrentPriorityLevel;
var Oa = o.unstable_ImmediatePriority;
var Ta = o.unstable_UserBlockingPriority;
var Ma = o.unstable_NormalPriority;
var Ba = o.unstable_LowPriority;
var Da = o.unstable_IdlePriority;
var Ua = {};
var Aa = Pa !== undefined ? Pa : function () {};
var Ra = null;
var Ia = null;
var Fa = false;
var Va = Na();
var Wa = Va < 10000 ? Na : function () {
  return Na() - Va;
};
function Ha() {
  switch (ja()) {
    case Oa:
      return 99;
    case Ta:
      return 98;
    case Ma:
      return 97;
    case Ba:
      return 96;
    case Da:
      return 95;
    default:
      throw Error(l(332));
  }
}
function Za(e) {
  switch (e) {
    case 99:
      return Oa;
    case 98:
      return Ta;
    case 97:
      return Ma;
    case 96:
      return Ba;
    case 95:
      return Da;
    default:
      throw Error(l(332));
  }
}
function qa(e, t) {
  e = Za(e);
  return Ea(e, t);
}
function Ka(e, t, n) {
  e = Za(e);
  return za(e, t, n);
}
function Ya() {
  if (Ia !== null) {
    var e = Ia;
    Ia = null;
    La(e);
  }
  $a();
}
function $a() {
  if (!Fa && Ra !== null) {
    Fa = true;
    var e = 0;
    try {
      var t = Ra;
      qa(99, function () {
        for (; e < t.length; e++) {
          var n = t[e];
          do {
            n = n(true);
          } while (n !== null);
        }
      });
      Ra = null;
    } catch (n) {
      if (Ra !== null) {
        Ra = Ra.slice(e + 1);
      }
      za(Oa, Ya);
      throw n;
    } finally {
      Fa = false;
    }
  }
}
var Qa = k.ReactCurrentBatchConfig;
function Ga(e, t) {
  if (e && e.defaultProps) {
    t = a({}, t);
    for (var n in e = e.defaultProps) {
      if (t[n] === undefined) {
        t[n] = e[n];
      }
    }
    return t;
  }
  return t;
}
var Xa = ca(null);
var Ja = null;
var eo = null;
var to = null;
function no() {
  to = eo = Ja = null;
}
function ro(e) {
  var t = Xa.current;
  sa(Xa);
  e.type._context._currentValue = t;
}
function ao(e, t) {
  while (e !== null) {
    var n = e.alternate;
    if ((e.childLanes & t) === t) {
      if (n === null || (n.childLanes & t) === t) {
        break;
      }
      n.childLanes |= t;
    } else {
      e.childLanes |= t;
      if (n !== null) {
        n.childLanes |= t;
      }
    }
    e = e.return;
  }
}
function oo(e, t) {
  Ja = e;
  to = eo = null;
  if ((e = e.dependencies) !== null && e.firstContext !== null) {
    if ((e.lanes & t) !== 0) {
      Ul = true;
    }
    e.firstContext = null;
  }
}
function lo(e, t) {
  if (to !== e && t !== false && t !== 0) {
    if (typeof t !== "number" || t === 1073741823) {
      to = e;
      t = 1073741823;
    }
    t = {
      context: e,
      observedBits: t,
      next: null
    };
    if (eo === null) {
      if (Ja === null) {
        throw Error(l(308));
      }
      eo = t;
      Ja.dependencies = {
        lanes: 0,
        firstContext: t,
        responders: null
      };
    } else {
      eo = eo.next = t;
    }
  }
  return e._currentValue;
}
var io = false;
function uo(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null
    },
    effects: null
  };
}
function co(e, t) {
  e = e.updateQueue;
  if (t.updateQueue === e) {
    t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      effects: e.effects
    };
  }
}
function so(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null
  };
}
function fo(e, t) {
  if ((e = e.updateQueue) !== null) {
    var n = (e = e.shared).pending;
    if (n === null) {
      t.next = t;
    } else {
      t.next = n.next;
      n.next = t;
    }
    e.pending = t;
  }
}
function po(e, t) {
  var n = e.updateQueue;
  var r = e.alternate;
  if (r !== null && n === (r = r.updateQueue)) {
    var a = null;
    var o = null;
    if ((n = n.firstBaseUpdate) !== null) {
      do {
        var l = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null
        };
        if (o === null) {
          a = o = l;
        } else {
          o = o.next = l;
        }
        n = n.next;
      } while (n !== null);
      if (o === null) {
        a = o = t;
      } else {
        o = o.next = t;
      }
    } else {
      a = o = t;
    }
    n = {
      baseState: r.baseState,
      firstBaseUpdate: a,
      lastBaseUpdate: o,
      shared: r.shared,
      effects: r.effects
    };
    e.updateQueue = n;
    return;
  }
  if ((e = n.lastBaseUpdate) === null) {
    n.firstBaseUpdate = t;
  } else {
    e.next = t;
  }
  n.lastBaseUpdate = t;
}
function ho(e, t, n, r) {
  var o = e.updateQueue;
  io = false;
  var l = o.firstBaseUpdate;
  var i = o.lastBaseUpdate;
  var u = o.shared.pending;
  if (u !== null) {
    o.shared.pending = null;
    var c = u;
    var s = c.next;
    c.next = null;
    if (i === null) {
      l = s;
    } else {
      i.next = s;
    }
    i = c;
    var f = e.alternate;
    if (f !== null) {
      var d = (f = f.updateQueue).lastBaseUpdate;
      if (d !== i) {
        if (d === null) {
          f.firstBaseUpdate = s;
        } else {
          d.next = s;
        }
        f.lastBaseUpdate = c;
      }
    }
  }
  if (l !== null) {
    d = o.baseState;
    i = 0;
    f = s = c = null;
    while (true) {
      u = l.lane;
      var p = l.eventTime;
      if ((r & u) === u) {
        if (f !== null) {
          f = f.next = {
            eventTime: p,
            lane: 0,
            tag: l.tag,
            payload: l.payload,
            callback: l.callback,
            next: null
          };
        }
        e: {
          var h = e;
          var v = l;
          u = t;
          p = n;
          switch (v.tag) {
            case 1:
              if (typeof (h = v.payload) === "function") {
                d = h.call(p, d, u);
                break e;
              }
              d = h;
              break e;
            case 3:
              h.flags = h.flags & -4097 | 64;
            case 0:
              if ((u = typeof (h = v.payload) === "function" ? h.call(p, d, u) : h) === null || u === undefined) {
                break e;
              }
              d = a({}, d, u);
              break e;
            case 2:
              io = true;
          }
        }
        if (l.callback !== null) {
          e.flags |= 32;
          if ((u = o.effects) === null) {
            o.effects = [l];
          } else {
            u.push(l);
          }
        }
      } else {
        p = {
          eventTime: p,
          lane: u,
          tag: l.tag,
          payload: l.payload,
          callback: l.callback,
          next: null
        };
        if (f === null) {
          s = f = p;
          c = d;
        } else {
          f = f.next = p;
        }
        i |= u;
      }
      if ((l = l.next) === null) {
        if ((u = o.shared.pending) === null) {
          break;
        }
        l = u.next;
        u.next = null;
        o.lastBaseUpdate = u;
        o.shared.pending = null;
      }
    }
    if (f === null) {
      c = d;
    }
    o.baseState = c;
    o.firstBaseUpdate = s;
    o.lastBaseUpdate = f;
    Fi |= i;
    e.lanes = i;
    e.memoizedState = d;
  }
}
function vo(e, t, n) {
  e = t.effects;
  t.effects = null;
  if (e !== null) {
    for (t = 0; t < e.length; t++) {
      var r = e[t];
      var a = r.callback;
      if (a !== null) {
        r.callback = null;
        r = n;
        if (typeof a !== "function") {
          throw Error(l(191, a));
        }
        a.call(r);
      }
    }
  }
}
var mo = new r.Component().refs;
function yo(e, t, n, r) {
  n = (n = n(r, t = e.memoizedState)) === null || n === undefined ? t : a({}, t, n);
  e.memoizedState = n;
  if (e.lanes === 0) {
    e.updateQueue.baseState = n;
  }
}
var go = {
  isMounted: function (e) {
    return !!(e = e._reactInternals) && Qe(e) === e;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = du();
    var a = pu(e);
    var o = so(r, a);
    o.payload = t;
    if (n !== undefined && n !== null) {
      o.callback = n;
    }
    fo(e, o);
    hu(e, a, r);
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = du();
    var a = pu(e);
    var o = so(r, a);
    o.tag = 1;
    o.payload = t;
    if (n !== undefined && n !== null) {
      o.callback = n;
    }
    fo(e, o);
    hu(e, a, r);
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = du();
    var r = pu(e);
    var a = so(n, r);
    a.tag = 2;
    if (t !== undefined && t !== null) {
      a.callback = t;
    }
    fo(e, a);
    hu(e, r, n);
  }
};
function bo(e, t, n, r, a, o, l) {
  if (typeof (e = e.stateNode).shouldComponentUpdate === "function") {
    return e.shouldComponentUpdate(r, o, l);
  } else {
    return !t.prototype || !t.prototype.isPureReactComponent || !dr(n, r) || !dr(a, o);
  }
}
function wo(e, t, n) {
  var r = false;
  var a = da;
  var o = t.contextType;
  if (typeof o === "object" && o !== null) {
    o = lo(o);
  } else {
    a = ya(t) ? va : pa.current;
    o = (r = (r = t.contextTypes) !== null && r !== undefined) ? ma(e, a) : da;
  }
  t = new t(n, o);
  e.memoizedState = t.state ?? null;
  t.updater = go;
  e.stateNode = t;
  t._reactInternals = e;
  if (r) {
    (e = e.stateNode).__reactInternalMemoizedUnmaskedChildContext = a;
    e.__reactInternalMemoizedMaskedChildContext = o;
  }
  return t;
}
function ko(e, t, n, r) {
  e = t.state;
  if (typeof t.componentWillReceiveProps === "function") {
    t.componentWillReceiveProps(n, r);
  }
  if (typeof t.UNSAFE_componentWillReceiveProps === "function") {
    t.UNSAFE_componentWillReceiveProps(n, r);
  }
  if (t.state !== e) {
    go.enqueueReplaceState(t, t.state, null);
  }
}
function xo(e, t, n, r) {
  var a = e.stateNode;
  a.props = n;
  a.state = e.memoizedState;
  a.refs = mo;
  uo(e);
  var o = t.contextType;
  if (typeof o === "object" && o !== null) {
    a.context = lo(o);
  } else {
    o = ya(t) ? va : pa.current;
    a.context = ma(e, o);
  }
  ho(e, n, a, r);
  a.state = e.memoizedState;
  if (typeof (o = t.getDerivedStateFromProps) === "function") {
    yo(e, t, o, n);
    a.state = e.memoizedState;
  }
  if (typeof t.getDerivedStateFromProps !== "function" && typeof a.getSnapshotBeforeUpdate !== "function" && (typeof a.UNSAFE_componentWillMount === "function" || typeof a.componentWillMount === "function")) {
    t = a.state;
    if (typeof a.componentWillMount === "function") {
      a.componentWillMount();
    }
    if (typeof a.UNSAFE_componentWillMount === "function") {
      a.UNSAFE_componentWillMount();
    }
    if (t !== a.state) {
      go.enqueueReplaceState(a, a.state, null);
    }
    ho(e, n, a, r);
    a.state = e.memoizedState;
  }
  if (typeof a.componentDidMount === "function") {
    e.flags |= 4;
  }
}
var Co = Array.isArray;
function So(e, t, n) {
  if ((e = n.ref) !== null && typeof e !== "function" && typeof e !== "object") {
    if (n._owner) {
      if (n = n._owner) {
        if (n.tag !== 1) {
          throw Error(l(309));
        }
        var r = n.stateNode;
      }
      if (!r) {
        throw Error(l(147, e));
      }
      var a = "" + e;
      if (t !== null && t.ref !== null && typeof t.ref === "function" && t.ref._stringRef === a) {
        return t.ref;
      } else {
        t = function (e) {
          var t = r.refs;
          if (t === mo) {
            t = r.refs = {};
          }
          if (e === null) {
            delete t[a];
          } else {
            t[a] = e;
          }
        };
        t._stringRef = a;
        return t;
      }
    }
    if (typeof e !== "string") {
      throw Error(l(284));
    }
    if (!n._owner) {
      throw Error(l(290, e));
    }
  }
  return e;
}
function Eo(e, t) {
  if (e.type !== "textarea") {
    throw Error(l(31, Object.prototype.toString.call(t) === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : t));
  }
}
function zo(e) {
  function t(t, n) {
    if (e) {
      var r = t.lastEffect;
      if (r !== null) {
        r.nextEffect = n;
        t.lastEffect = n;
      } else {
        t.firstEffect = t.lastEffect = n;
      }
      n.nextEffect = null;
      n.flags = 8;
    }
  }
  function n(n, r) {
    if (!e) {
      return null;
    }
    while (r !== null) {
      t(n, r);
      r = r.sibling;
    }
    return null;
  }
  function r(e, t) {
    for (e = new Map(); t !== null;) {
      if (t.key !== null) {
        e.set(t.key, t);
      } else {
        e.set(t.index, t);
      }
      t = t.sibling;
    }
    return e;
  }
  function a(e, t) {
    (e = qu(e, t)).index = 0;
    e.sibling = null;
    return e;
  }
  function o(t, n, r) {
    t.index = r;
    if (e) {
      if ((r = t.alternate) !== null) {
        if ((r = r.index) < n) {
          t.flags = 2;
          return n;
        } else {
          return r;
        }
      } else {
        t.flags = 2;
        return n;
      }
    } else {
      return n;
    }
  }
  function i(t) {
    if (e && t.alternate === null) {
      t.flags = 2;
    }
    return t;
  }
  function u(e, t, n, r) {
    if (t === null || t.tag !== 6) {
      (t = Qu(n, e.mode, r)).return = e;
      return t;
    } else {
      (t = a(t, n)).return = e;
      return t;
    }
  }
  function c(e, t, n, r) {
    if (t !== null && t.elementType === n.type) {
      (r = a(t, n.props)).ref = So(e, t, n);
      r.return = e;
      return r;
    } else {
      (r = Ku(n.type, n.key, n.props, null, e.mode, r)).ref = So(e, t, n);
      r.return = e;
      return r;
    }
  }
  function s(e, t, n, r) {
    if (t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation) {
      (t = Gu(n, e.mode, r)).return = e;
      return t;
    } else {
      (t = a(t, n.children || [])).return = e;
      return t;
    }
  }
  function f(e, t, n, r, o) {
    if (t === null || t.tag !== 7) {
      (t = Yu(n, e.mode, r, o)).return = e;
      return t;
    } else {
      (t = a(t, n)).return = e;
      return t;
    }
  }
  function d(e, t, n) {
    if (typeof t === "string" || typeof t === "number") {
      (t = Qu("" + t, e.mode, n)).return = e;
      return t;
    }
    if (typeof t === "object" && t !== null) {
      switch (t.$$typeof) {
        case x:
          (n = Ku(t.type, t.key, t.props, null, e.mode, n)).ref = So(e, null, t);
          n.return = e;
          return n;
        case C:
          (t = Gu(t, e.mode, n)).return = e;
          return t;
      }
      if (Co(t) || V(t)) {
        (t = Yu(t, e.mode, n, null)).return = e;
        return t;
      }
      Eo(e, t);
    }
    return null;
  }
  function p(e, t, n, r) {
    var a = t !== null ? t.key : null;
    if (typeof n === "string" || typeof n === "number") {
      if (a !== null) {
        return null;
      } else {
        return u(e, t, "" + n, r);
      }
    }
    if (typeof n === "object" && n !== null) {
      switch (n.$$typeof) {
        case x:
          if (n.key === a) {
            if (n.type === S) {
              return f(e, t, n.props.children, r, a);
            } else {
              return c(e, t, n, r);
            }
          } else {
            return null;
          }
        case C:
          if (n.key === a) {
            return s(e, t, n, r);
          } else {
            return null;
          }
      }
      if (Co(n) || V(n)) {
        if (a !== null) {
          return null;
        } else {
          return f(e, t, n, r, null);
        }
      }
      Eo(e, n);
    }
    return null;
  }
  function h(e, t, n, r, a) {
    if (typeof r === "string" || typeof r === "number") {
      return u(t, e = e.get(n) || null, "" + r, a);
    }
    if (typeof r === "object" && r !== null) {
      switch (r.$$typeof) {
        case x:
          e = e.get(r.key === null ? n : r.key) || null;
          if (r.type === S) {
            return f(t, e, r.props.children, a, r.key);
          } else {
            return c(t, e, r, a);
          }
        case C:
          return s(t, e = e.get(r.key === null ? n : r.key) || null, r, a);
      }
      if (Co(r) || V(r)) {
        return f(t, e = e.get(n) || null, r, a, null);
      }
      Eo(t, r);
    }
    return null;
  }
  function v(a, l, i, u) {
    var c = null;
    var s = null;
    for (var f = l, v = l = 0, m = null; f !== null && v < i.length; v++) {
      if (f.index > v) {
        m = f;
        f = null;
      } else {
        m = f.sibling;
      }
      var y = p(a, f, i[v], u);
      if (y === null) {
        if (f === null) {
          f = m;
        }
        break;
      }
      if (e && f && y.alternate === null) {
        t(a, f);
      }
      l = o(y, l, v);
      if (s === null) {
        c = y;
      } else {
        s.sibling = y;
      }
      s = y;
      f = m;
    }
    if (v === i.length) {
      n(a, f);
      return c;
    }
    if (f === null) {
      for (; v < i.length; v++) {
        if ((f = d(a, i[v], u)) !== null) {
          l = o(f, l, v);
          if (s === null) {
            c = f;
          } else {
            s.sibling = f;
          }
          s = f;
        }
      }
      return c;
    }
    for (f = r(a, f); v < i.length; v++) {
      if ((m = h(f, a, v, i[v], u)) !== null) {
        if (e && m.alternate !== null) {
          f.delete(m.key === null ? v : m.key);
        }
        l = o(m, l, v);
        if (s === null) {
          c = m;
        } else {
          s.sibling = m;
        }
        s = m;
      }
    }
    if (e) {
      f.forEach(function (e) {
        return t(a, e);
      });
    }
    return c;
  }
  function m(a, i, u, c) {
    var s = V(u);
    if (typeof s !== "function") {
      throw Error(l(150));
    }
    if ((u = s.call(u)) == null) {
      throw Error(l(151));
    }
    var f = s = null;
    for (var v = i, m = i = 0, y = null, g = u.next(); v !== null && !g.done; m++, g = u.next()) {
      if (v.index > m) {
        y = v;
        v = null;
      } else {
        y = v.sibling;
      }
      var b = p(a, v, g.value, c);
      if (b === null) {
        if (v === null) {
          v = y;
        }
        break;
      }
      if (e && v && b.alternate === null) {
        t(a, v);
      }
      i = o(b, i, m);
      if (f === null) {
        s = b;
      } else {
        f.sibling = b;
      }
      f = b;
      v = y;
    }
    if (g.done) {
      n(a, v);
      return s;
    }
    if (v === null) {
      for (; !g.done; m++, g = u.next()) {
        if ((g = d(a, g.value, c)) !== null) {
          i = o(g, i, m);
          if (f === null) {
            s = g;
          } else {
            f.sibling = g;
          }
          f = g;
        }
      }
      return s;
    }
    for (v = r(a, v); !g.done; m++, g = u.next()) {
      if ((g = h(v, a, m, g.value, c)) !== null) {
        if (e && g.alternate !== null) {
          v.delete(g.key === null ? m : g.key);
        }
        i = o(g, i, m);
        if (f === null) {
          s = g;
        } else {
          f.sibling = g;
        }
        f = g;
      }
    }
    if (e) {
      v.forEach(function (e) {
        return t(a, e);
      });
    }
    return s;
  }
  return function (e, r, o, u) {
    var c = typeof o === "object" && o !== null && o.type === S && o.key === null;
    if (c) {
      o = o.props.children;
    }
    var s = typeof o === "object" && o !== null;
    if (s) {
      switch (o.$$typeof) {
        case x:
          e: {
            s = o.key;
            c = r;
            while (c !== null) {
              if (c.key === s) {
                if (c.tag === 7) {
                  if (o.type === S) {
                    n(e, c.sibling);
                    (r = a(c, o.props.children)).return = e;
                    e = r;
                    break e;
                  }
                } else if (c.elementType === o.type) {
                  n(e, c.sibling);
                  (r = a(c, o.props)).ref = So(e, c, o);
                  r.return = e;
                  e = r;
                  break e;
                }
                n(e, c);
                break;
              }
              t(e, c);
              c = c.sibling;
            }
            if (o.type === S) {
              (r = Yu(o.props.children, e.mode, u, o.key)).return = e;
              e = r;
            } else {
              (u = Ku(o.type, o.key, o.props, null, e.mode, u)).ref = So(e, r, o);
              u.return = e;
              e = u;
            }
          }
          return i(e);
        case C:
          e: {
            for (c = o.key; r !== null;) {
              if (r.key === c) {
                if (r.tag === 4 && r.stateNode.containerInfo === o.containerInfo && r.stateNode.implementation === o.implementation) {
                  n(e, r.sibling);
                  (r = a(r, o.children || [])).return = e;
                  e = r;
                  break e;
                }
                n(e, r);
                break;
              }
              t(e, r);
              r = r.sibling;
            }
            (r = Gu(o, e.mode, u)).return = e;
            e = r;
          }
          return i(e);
      }
    }
    if (typeof o === "string" || typeof o === "number") {
      o = "" + o;
      if (r !== null && r.tag === 6) {
        n(e, r.sibling);
        (r = a(r, o)).return = e;
        e = r;
      } else {
        n(e, r);
        (r = Qu(o, e.mode, u)).return = e;
        e = r;
      }
      return i(e);
    }
    if (Co(o)) {
      return v(e, r, o, u);
    }
    if (V(o)) {
      return m(e, r, o, u);
    }
    if (s) {
      Eo(e, o);
    }
    if (typeof o === "undefined" && !c) {
      switch (e.tag) {
        case 1:
        case 22:
        case 0:
        case 11:
        case 15:
          throw Error(l(152, K(e.type) || "Component"));
      }
    }
    return n(e, r);
  };
}
var Lo = zo(true);
var _o = zo(false);
var Po = {};
var No = ca(Po);
var jo = ca(Po);
var Oo = ca(Po);
function To(e) {
  if (e === Po) {
    throw Error(l(174));
  }
  return e;
}
function Mo(e, t) {
  fa(Oo, t);
  fa(jo, e);
  fa(No, Po);
  switch (e = t.nodeType) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : he(null, "");
      break;
    default:
      t = he(t = (e = e === 8 ? t.parentNode : t).namespaceURI || null, e = e.tagName);
  }
  sa(No);
  fa(No, t);
}
function Bo() {
  sa(No);
  sa(jo);
  sa(Oo);
}
function Do(e) {
  To(Oo.current);
  var t = To(No.current);
  var n = he(t, e.type);
  if (t !== n) {
    fa(jo, e);
    fa(No, n);
  }
}
function Uo(e) {
  if (jo.current === e) {
    sa(No);
    sa(jo);
  }
}
var Ao = ca(0);
function Ro(e) {
  for (var t = e; t !== null;) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (n !== null && ((n = n.dehydrated) === null || n.data === "$?" || n.data === "$!")) {
        return t;
      }
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== undefined) {
      if ((t.flags & 64) !== 0) {
        return t;
      }
    } else if (t.child !== null) {
      t.child.return = t;
      t = t.child;
      continue;
    }
    if (t === e) {
      break;
    }
    while (t.sibling === null) {
      if (t.return === null || t.return === e) {
        return null;
      }
      t = t.return;
    }
    t.sibling.return = t.return;
    t = t.sibling;
  }
  return null;
}
var Io = null;
var Fo = null;
var Vo = false;
function Wo(e, t) {
  var n = Hu(5, null, null, 0);
  n.elementType = "DELETED";
  n.type = "DELETED";
  n.stateNode = t;
  n.return = e;
  n.flags = 8;
  if (e.lastEffect !== null) {
    e.lastEffect.nextEffect = n;
    e.lastEffect = n;
  } else {
    e.firstEffect = e.lastEffect = n;
  }
}
function Ho(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t) !== null && (e.stateNode = t, true);
    case 6:
      return (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t) !== null && (e.stateNode = t, true);
    default:
      return false;
  }
}
function Zo(e) {
  if (Vo) {
    var t = Fo;
    if (t) {
      var n = t;
      if (!Ho(e, t)) {
        if (!(t = Yr(n.nextSibling)) || !Ho(e, t)) {
          e.flags = e.flags & -1025 | 2;
          Vo = false;
          Io = e;
          return;
        }
        Wo(Io, n);
      }
      Io = e;
      Fo = Yr(t.firstChild);
    } else {
      e.flags = e.flags & -1025 | 2;
      Vo = false;
      Io = e;
    }
  }
}
function qo(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;) {
    e = e.return;
  }
  Io = e;
}
function Ko(e) {
  if (e !== Io) {
    return false;
  }
  if (!Vo) {
    qo(e);
    Vo = true;
    return false;
  }
  var t = e.type;
  if (e.tag !== 5 || t !== "head" && t !== "body" && !Hr(t, e.memoizedProps)) {
    for (t = Fo; t;) {
      Wo(e, t);
      t = Yr(t.nextSibling);
    }
  }
  qo(e);
  if (e.tag === 13) {
    if (!(e = (e = e.memoizedState) !== null ? e.dehydrated : null)) {
      throw Error(l(317));
    }
    e: {
      e = e.nextSibling;
      t = 0;
      while (e) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              Fo = Yr(e.nextSibling);
              break e;
            }
            t--;
          } else if (n === "$" || n === "$!" || n === "$?") {
            t++;
          }
        }
        e = e.nextSibling;
      }
      Fo = null;
    }
  } else {
    Fo = Io ? Yr(e.stateNode.nextSibling) : null;
  }
  return true;
}
function Yo() {
  Fo = Io = null;
  Vo = false;
}
var $o = [];
function Qo() {
  for (var e = 0; e < $o.length; e++) {
    $o[e]._workInProgressVersionPrimary = null;
  }
  $o.length = 0;
}
var Go = k.ReactCurrentDispatcher;
var Xo = k.ReactCurrentBatchConfig;
var Jo = 0;
var el = null;
var tl = null;
var nl = null;
var rl = false;
var al = false;
function ol() {
  throw Error(l(321));
}
function ll(e, t) {
  if (t === null) {
    return false;
  }
  for (var n = 0; n < t.length && n < e.length; n++) {
    if (!sr(e[n], t[n])) {
      return false;
    }
  }
  return true;
}
function il(e, t, n, r, a, o) {
  Jo = o;
  el = t;
  t.memoizedState = null;
  t.updateQueue = null;
  t.lanes = 0;
  Go.current = e === null || e.memoizedState === null ? Tl : Ml;
  e = n(r, a);
  if (al) {
    o = 0;
    do {
      al = false;
      if (!(o < 25)) {
        throw Error(l(301));
      }
      o += 1;
      nl = tl = null;
      t.updateQueue = null;
      Go.current = Bl;
      e = n(r, a);
    } while (al);
  }
  Go.current = Ol;
  t = tl !== null && tl.next !== null;
  Jo = 0;
  nl = tl = el = null;
  rl = false;
  if (t) {
    throw Error(l(300));
  }
  return e;
}
function ul() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };
  if (nl === null) {
    el.memoizedState = nl = e;
  } else {
    nl = nl.next = e;
  }
  return nl;
}
function cl() {
  if (tl === null) {
    var e = el.alternate;
    e = e !== null ? e.memoizedState : null;
  } else {
    e = tl.next;
  }
  var t = nl === null ? el.memoizedState : nl.next;
  if (t !== null) {
    nl = t;
    tl = e;
  } else {
    if (e === null) {
      throw Error(l(310));
    }
    e = {
      memoizedState: (tl = e).memoizedState,
      baseState: tl.baseState,
      baseQueue: tl.baseQueue,
      queue: tl.queue,
      next: null
    };
    if (nl === null) {
      el.memoizedState = nl = e;
    } else {
      nl = nl.next = e;
    }
  }
  return nl;
}
function sl(e, t) {
  if (typeof t === "function") {
    return t(e);
  } else {
    return t;
  }
}
function fl(e) {
  var t = cl();
  var n = t.queue;
  if (n === null) {
    throw Error(l(311));
  }
  n.lastRenderedReducer = e;
  var r = tl;
  var a = r.baseQueue;
  var o = n.pending;
  if (o !== null) {
    if (a !== null) {
      var i = a.next;
      a.next = o.next;
      o.next = i;
    }
    r.baseQueue = a = o;
    n.pending = null;
  }
  if (a !== null) {
    a = a.next;
    r = r.baseState;
    var u = i = o = null;
    var c = a;
    do {
      var s = c.lane;
      if ((Jo & s) === s) {
        if (u !== null) {
          u = u.next = {
            lane: 0,
            action: c.action,
            eagerReducer: c.eagerReducer,
            eagerState: c.eagerState,
            next: null
          };
        }
        r = c.eagerReducer === e ? c.eagerState : e(r, c.action);
      } else {
        var f = {
          lane: s,
          action: c.action,
          eagerReducer: c.eagerReducer,
          eagerState: c.eagerState,
          next: null
        };
        if (u === null) {
          i = u = f;
          o = r;
        } else {
          u = u.next = f;
        }
        el.lanes |= s;
        Fi |= s;
      }
      c = c.next;
    } while (c !== null && c !== a);
    if (u === null) {
      o = r;
    } else {
      u.next = i;
    }
    if (!sr(r, t.memoizedState)) {
      Ul = true;
    }
    t.memoizedState = r;
    t.baseState = o;
    t.baseQueue = u;
    n.lastRenderedState = r;
  }
  return [t.memoizedState, n.dispatch];
}
function dl(e) {
  var t = cl();
  var n = t.queue;
  if (n === null) {
    throw Error(l(311));
  }
  n.lastRenderedReducer = e;
  var r = n.dispatch;
  var a = n.pending;
  var o = t.memoizedState;
  if (a !== null) {
    n.pending = null;
    var i = a = a.next;
    do {
      o = e(o, i.action);
      i = i.next;
    } while (i !== a);
    if (!sr(o, t.memoizedState)) {
      Ul = true;
    }
    t.memoizedState = o;
    if (t.baseQueue === null) {
      t.baseState = o;
    }
    n.lastRenderedState = o;
  }
  return [o, r];
}
function pl(e, t, n) {
  var r = t._getVersion;
  r = r(t._source);
  var a = t._workInProgressVersionPrimary;
  if (a !== null) {
    e = a === r;
  } else {
    e = e.mutableReadLanes;
    if (e = (Jo & e) === e) {
      t._workInProgressVersionPrimary = r;
      $o.push(t);
    }
  }
  if (e) {
    return n(t._source);
  }
  $o.push(t);
  throw Error(l(350));
}
function hl(e, t, n, r) {
  var a = Ti;
  if (a === null) {
    throw Error(l(349));
  }
  var o = t._getVersion;
  var i = o(t._source);
  var u = Go.current;
  var c = u.useState(function () {
    return pl(a, t, n);
  });
  var s = c[1];
  var f = c[0];
  c = nl;
  var d = e.memoizedState;
  var p = d.refs;
  var h = p.getSnapshot;
  var v = d.source;
  d = d.subscribe;
  var m = el;
  e.memoizedState = {
    refs: p,
    source: t,
    subscribe: r
  };
  u.useEffect(function () {
    p.getSnapshot = n;
    p.setSnapshot = s;
    var e = o(t._source);
    if (!sr(i, e)) {
      e = n(t._source);
      if (!sr(f, e)) {
        s(e);
        e = pu(m);
        a.mutableReadLanes |= e & a.pendingLanes;
      }
      e = a.mutableReadLanes;
      a.entangledLanes |= e;
      var r = a.entanglements;
      for (var l = e; l > 0;) {
        var u = 31 - Ht(l);
        var c = 1 << u;
        r[u] |= e;
        l &= ~c;
      }
    }
  }, [n, t, r]);
  u.useEffect(function () {
    return r(t._source, function () {
      var e = p.getSnapshot;
      var n = p.setSnapshot;
      try {
        n(e(t._source));
        var r = pu(m);
        a.mutableReadLanes |= r & a.pendingLanes;
      } catch (o) {
        n(function () {
          throw o;
        });
      }
    });
  }, [t, r]);
  if (!sr(h, n) || !sr(v, t) || !sr(d, r)) {
    (e = {
      pending: null,
      dispatch: null,
      lastRenderedReducer: sl,
      lastRenderedState: f
    }).dispatch = s = jl.bind(null, el, e);
    c.queue = e;
    c.baseQueue = null;
    f = pl(a, t, n);
    c.memoizedState = c.baseState = f;
  }
  return f;
}
function vl(e, t, n) {
  return hl(cl(), e, t, n);
}
function ml(e) {
  var t = ul();
  if (typeof e === "function") {
    e = e();
  }
  t.memoizedState = t.baseState = e;
  e = (e = t.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: sl,
    lastRenderedState: e
  }).dispatch = jl.bind(null, el, e);
  return [t.memoizedState, e];
}
function yl(e, t, n, r) {
  e = {
    tag: e,
    create: t,
    destroy: n,
    deps: r,
    next: null
  };
  if ((t = el.updateQueue) === null) {
    t = {
      lastEffect: null
    };
    el.updateQueue = t;
    t.lastEffect = e.next = e;
  } else if ((n = t.lastEffect) === null) {
    t.lastEffect = e.next = e;
  } else {
    r = n.next;
    n.next = e;
    e.next = r;
    t.lastEffect = e;
  }
  return e;
}
function gl(e) {
  e = {
    current: e
  };
  return ul().memoizedState = e;
}
function bl() {
  return cl().memoizedState;
}
function wl(e, t, n, r) {
  var a = ul();
  el.flags |= e;
  a.memoizedState = yl(t | 1, n, undefined, r === undefined ? null : r);
}
function kl(e, t, n, r) {
  var a = cl();
  r = r === undefined ? null : r;
  var o = undefined;
  if (tl !== null) {
    var l = tl.memoizedState;
    o = l.destroy;
    if (r !== null && ll(r, l.deps)) {
      yl(t, n, o, r);
      return;
    }
  }
  el.flags |= e;
  a.memoizedState = yl(t | 1, n, o, r);
}
function xl(e, t) {
  return wl(516, 4, e, t);
}
function Cl(e, t) {
  return kl(516, 4, e, t);
}
function Sl(e, t) {
  return kl(4, 2, e, t);
}
function El(e, t) {
  if (typeof t === "function") {
    e = e();
    t(e);
    return function () {
      t(null);
    };
  } else if (t !== null && t !== undefined) {
    e = e();
    t.current = e;
    return function () {
      t.current = null;
    };
  } else {
    return undefined;
  }
}
function zl(e, t, n) {
  n = n !== null && n !== undefined ? n.concat([e]) : null;
  return kl(4, 2, El.bind(null, t, e), n);
}
function Ll() {}
function _l(e, t) {
  var n = cl();
  t = t === undefined ? null : t;
  var r = n.memoizedState;
  if (r !== null && t !== null && ll(t, r[1])) {
    return r[0];
  } else {
    n.memoizedState = [e, t];
    return e;
  }
}
function Pl(e, t) {
  var n = cl();
  t = t === undefined ? null : t;
  var r = n.memoizedState;
  if (r !== null && t !== null && ll(t, r[1])) {
    return r[0];
  } else {
    e = e();
    n.memoizedState = [e, t];
    return e;
  }
}
function Nl(e, t) {
  var n = Ha();
  qa(n < 98 ? 98 : n, function () {
    e(true);
  });
  qa(n > 97 ? 97 : n, function () {
    var n = Xo.transition;
    Xo.transition = 1;
    try {
      e(false);
      t();
    } finally {
      Xo.transition = n;
    }
  });
}
function jl(e, t, n) {
  var r = du();
  var a = pu(e);
  var o = {
    lane: a,
    action: n,
    eagerReducer: null,
    eagerState: null,
    next: null
  };
  var l = t.pending;
  if (l === null) {
    o.next = o;
  } else {
    o.next = l.next;
    l.next = o;
  }
  t.pending = o;
  l = e.alternate;
  if (e === el || l !== null && l === el) {
    al = rl = true;
  } else {
    if (e.lanes === 0 && (l === null || l.lanes === 0) && (l = t.lastRenderedReducer) !== null) {
      try {
        var i = t.lastRenderedState;
        var u = l(i, n);
        o.eagerReducer = l;
        o.eagerState = u;
        if (sr(u, i)) {
          return;
        }
      } catch (c) {}
    }
    hu(e, a, r);
  }
}
var Ol = {
  readContext: lo,
  useCallback: ol,
  useContext: ol,
  useEffect: ol,
  useImperativeHandle: ol,
  useLayoutEffect: ol,
  useMemo: ol,
  useReducer: ol,
  useRef: ol,
  useState: ol,
  useDebugValue: ol,
  useDeferredValue: ol,
  useTransition: ol,
  useMutableSource: ol,
  useOpaqueIdentifier: ol,
  unstable_isNewReconciler: false
};
var Tl = {
  readContext: lo,
  useCallback: function (e, t) {
    ul().memoizedState = [e, t === undefined ? null : t];
    return e;
  },
  useContext: lo,
  useEffect: xl,
  useImperativeHandle: function (e, t, n) {
    n = n !== null && n !== undefined ? n.concat([e]) : null;
    return wl(4, 2, El.bind(null, t, e), n);
  },
  useLayoutEffect: function (e, t) {
    return wl(4, 2, e, t);
  },
  useMemo: function (e, t) {
    var n = ul();
    t = t === undefined ? null : t;
    e = e();
    n.memoizedState = [e, t];
    return e;
  },
  useReducer: function (e, t, n) {
    var r = ul();
    t = n !== undefined ? n(t) : t;
    r.memoizedState = r.baseState = t;
    e = (e = r.queue = {
      pending: null,
      dispatch: null,
      lastRenderedReducer: e,
      lastRenderedState: t
    }).dispatch = jl.bind(null, el, e);
    return [r.memoizedState, e];
  },
  useRef: gl,
  useState: ml,
  useDebugValue: Ll,
  useDeferredValue: function (e) {
    var t = ml(e);
    var n = t[0];
    var r = t[1];
    xl(function () {
      var t = Xo.transition;
      Xo.transition = 1;
      try {
        r(e);
      } finally {
        Xo.transition = t;
      }
    }, [e]);
    return n;
  },
  useTransition: function () {
    var e = ml(false);
    var t = e[0];
    gl(e = Nl.bind(null, e[1]));
    return [e, t];
  },
  useMutableSource: function (e, t, n) {
    var r = ul();
    r.memoizedState = {
      refs: {
        getSnapshot: t,
        setSnapshot: null
      },
      source: e,
      subscribe: n
    };
    return hl(r, e, t, n);
  },
  useOpaqueIdentifier: function () {
    if (Vo) {
      var e = false;
      var t = function (e) {
        return {
          $$typeof: B,
          toString: e,
          valueOf: e
        };
      }(function () {
        if (!e) {
          e = true;
          n("r:" + (Qr++).toString(36));
        }
        throw Error(l(355));
      });
      var n = ml(t)[1];
      if ((el.mode & 2) === 0) {
        el.flags |= 516;
        yl(5, function () {
          n("r:" + (Qr++).toString(36));
        }, undefined, null);
      }
      return t;
    }
    ml(t = "r:" + (Qr++).toString(36));
    return t;
  },
  unstable_isNewReconciler: false
};
var Ml = {
  readContext: lo,
  useCallback: _l,
  useContext: lo,
  useEffect: Cl,
  useImperativeHandle: zl,
  useLayoutEffect: Sl,
  useMemo: Pl,
  useReducer: fl,
  useRef: bl,
  useState: function () {
    return fl(sl);
  },
  useDebugValue: Ll,
  useDeferredValue: function (e) {
    var t = fl(sl);
    var n = t[0];
    var r = t[1];
    Cl(function () {
      var t = Xo.transition;
      Xo.transition = 1;
      try {
        r(e);
      } finally {
        Xo.transition = t;
      }
    }, [e]);
    return n;
  },
  useTransition: function () {
    var e = fl(sl)[0];
    return [bl().current, e];
  },
  useMutableSource: vl,
  useOpaqueIdentifier: function () {
    return fl(sl)[0];
  },
  unstable_isNewReconciler: false
};
var Bl = {
  readContext: lo,
  useCallback: _l,
  useContext: lo,
  useEffect: Cl,
  useImperativeHandle: zl,
  useLayoutEffect: Sl,
  useMemo: Pl,
  useReducer: dl,
  useRef: bl,
  useState: function () {
    return dl(sl);
  },
  useDebugValue: Ll,
  useDeferredValue: function (e) {
    var t = dl(sl);
    var n = t[0];
    var r = t[1];
    Cl(function () {
      var t = Xo.transition;
      Xo.transition = 1;
      try {
        r(e);
      } finally {
        Xo.transition = t;
      }
    }, [e]);
    return n;
  },
  useTransition: function () {
    var e = dl(sl)[0];
    return [bl().current, e];
  },
  useMutableSource: vl,
  useOpaqueIdentifier: function () {
    return dl(sl)[0];
  },
  unstable_isNewReconciler: false
};
var Dl = k.ReactCurrentOwner;
var Ul = false;
function Al(e, t, n, r) {
  t.child = e === null ? _o(t, null, n, r) : Lo(t, e.child, n, r);
}
function Rl(e, t, n, r, a) {
  n = n.render;
  var o = t.ref;
  oo(t, a);
  r = il(e, t, n, r, o, a);
  if (e === null || Ul) {
    t.flags |= 1;
    Al(e, t, r, a);
    return t.child;
  } else {
    t.updateQueue = e.updateQueue;
    t.flags &= -517;
    e.lanes &= ~a;
    return oi(e, t, a);
  }
}
function Il(e, t, n, r, a, o) {
  if (e === null) {
    var l = n.type;
    if (typeof l !== "function" || Zu(l) || l.defaultProps !== undefined || n.compare !== null || n.defaultProps !== undefined) {
      (e = Ku(n.type, null, r, t, t.mode, o)).ref = t.ref;
      e.return = t;
      return t.child = e;
    } else {
      t.tag = 15;
      t.type = l;
      return Fl(e, t, l, r, a, o);
    }
  }
  l = e.child;
  if ((a & o) === 0 && (a = l.memoizedProps, (n = (n = n.compare) !== null ? n : dr)(a, r) && e.ref === t.ref)) {
    return oi(e, t, o);
  } else {
    t.flags |= 1;
    (e = qu(l, r)).ref = t.ref;
    e.return = t;
    return t.child = e;
  }
}
function Fl(e, t, n, r, a, o) {
  if (e !== null && dr(e.memoizedProps, r) && e.ref === t.ref) {
    Ul = false;
    if ((o & a) === 0) {
      t.lanes = e.lanes;
      return oi(e, t, o);
    }
    if ((e.flags & 16384) !== 0) {
      Ul = true;
    }
  }
  return Hl(e, t, n, r, o);
}
function Vl(e, t, n) {
  var r = t.pendingProps;
  var a = r.children;
  var o = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden" || r.mode === "unstable-defer-without-hiding") {
    if ((t.mode & 4) === 0) {
      t.memoizedState = {
        baseLanes: 0
      };
      xu(t, n);
    } else {
      if ((n & 1073741824) === 0) {
        e = o !== null ? o.baseLanes | n : n;
        t.lanes = t.childLanes = 1073741824;
        t.memoizedState = {
          baseLanes: e
        };
        xu(t, e);
        return null;
      }
      t.memoizedState = {
        baseLanes: 0
      };
      xu(t, o !== null ? o.baseLanes : n);
    }
  } else {
    if (o !== null) {
      r = o.baseLanes | n;
      t.memoizedState = null;
    } else {
      r = n;
    }
    xu(t, r);
  }
  Al(e, t, a, n);
  return t.child;
}
function Wl(e, t) {
  var n = t.ref;
  if (e === null && n !== null || e !== null && e.ref !== n) {
    t.flags |= 128;
  }
}
function Hl(e, t, n, r, a) {
  var o = ya(n) ? va : pa.current;
  o = ma(t, o);
  oo(t, a);
  n = il(e, t, n, r, o, a);
  if (e === null || Ul) {
    t.flags |= 1;
    Al(e, t, n, a);
    return t.child;
  } else {
    t.updateQueue = e.updateQueue;
    t.flags &= -517;
    e.lanes &= ~a;
    return oi(e, t, a);
  }
}
function Zl(e, t, n, r, a) {
  if (ya(n)) {
    var o = true;
    ka(t);
  } else {
    o = false;
  }
  oo(t, a);
  if (t.stateNode === null) {
    if (e !== null) {
      e.alternate = null;
      t.alternate = null;
      t.flags |= 2;
    }
    wo(t, n, r);
    xo(t, n, r, a);
    r = true;
  } else if (e === null) {
    var l = t.stateNode;
    var i = t.memoizedProps;
    l.props = i;
    var u = l.context;
    var c = n.contextType;
    if (typeof c === "object" && c !== null) {
      c = lo(c);
    } else {
      c = ma(t, c = ya(n) ? va : pa.current);
    }
    var s = n.getDerivedStateFromProps;
    var f = typeof s === "function" || typeof l.getSnapshotBeforeUpdate === "function";
    if (!f && (typeof l.UNSAFE_componentWillReceiveProps === "function" || typeof l.componentWillReceiveProps === "function")) {
      if (i !== r || u !== c) {
        ko(t, l, r, c);
      }
    }
    io = false;
    var d = t.memoizedState;
    l.state = d;
    ho(t, r, l, a);
    u = t.memoizedState;
    if (i !== r || d !== u || ha.current || io) {
      if (typeof s === "function") {
        yo(t, n, s, r);
        u = t.memoizedState;
      }
      if (i = io || bo(t, n, i, r, d, u, c)) {
        if (!f && (typeof l.UNSAFE_componentWillMount === "function" || typeof l.componentWillMount === "function")) {
          if (typeof l.componentWillMount === "function") {
            l.componentWillMount();
          }
          if (typeof l.UNSAFE_componentWillMount === "function") {
            l.UNSAFE_componentWillMount();
          }
        }
        if (typeof l.componentDidMount === "function") {
          t.flags |= 4;
        }
      } else {
        if (typeof l.componentDidMount === "function") {
          t.flags |= 4;
        }
        t.memoizedProps = r;
        t.memoizedState = u;
      }
      l.props = r;
      l.state = u;
      l.context = c;
      r = i;
    } else {
      if (typeof l.componentDidMount === "function") {
        t.flags |= 4;
      }
      r = false;
    }
  } else {
    l = t.stateNode;
    co(e, t);
    i = t.memoizedProps;
    c = t.type === t.elementType ? i : Ga(t.type, i);
    l.props = c;
    f = t.pendingProps;
    d = l.context;
    if (typeof (u = n.contextType) === "object" && u !== null) {
      u = lo(u);
    } else {
      u = ma(t, u = ya(n) ? va : pa.current);
    }
    var p = n.getDerivedStateFromProps;
    if (!(s = typeof p === "function" || typeof l.getSnapshotBeforeUpdate === "function") && (typeof l.UNSAFE_componentWillReceiveProps === "function" || typeof l.componentWillReceiveProps === "function")) {
      if (i !== f || d !== u) {
        ko(t, l, r, u);
      }
    }
    io = false;
    d = t.memoizedState;
    l.state = d;
    ho(t, r, l, a);
    var h = t.memoizedState;
    if (i !== f || d !== h || ha.current || io) {
      if (typeof p === "function") {
        yo(t, n, p, r);
        h = t.memoizedState;
      }
      if (c = io || bo(t, n, c, r, d, h, u)) {
        if (!s && (typeof l.UNSAFE_componentWillUpdate === "function" || typeof l.componentWillUpdate === "function")) {
          if (typeof l.componentWillUpdate === "function") {
            l.componentWillUpdate(r, h, u);
          }
          if (typeof l.UNSAFE_componentWillUpdate === "function") {
            l.UNSAFE_componentWillUpdate(r, h, u);
          }
        }
        if (typeof l.componentDidUpdate === "function") {
          t.flags |= 4;
        }
        if (typeof l.getSnapshotBeforeUpdate === "function") {
          t.flags |= 256;
        }
      } else {
        if (typeof l.componentDidUpdate === "function" && (i !== e.memoizedProps || d !== e.memoizedState)) {
          t.flags |= 4;
        }
        if (typeof l.getSnapshotBeforeUpdate === "function" && (i !== e.memoizedProps || d !== e.memoizedState)) {
          t.flags |= 256;
        }
        t.memoizedProps = r;
        t.memoizedState = h;
      }
      l.props = r;
      l.state = h;
      l.context = u;
      r = c;
    } else {
      if (typeof l.componentDidUpdate === "function" && (i !== e.memoizedProps || d !== e.memoizedState)) {
        t.flags |= 4;
      }
      if (typeof l.getSnapshotBeforeUpdate === "function" && (i !== e.memoizedProps || d !== e.memoizedState)) {
        t.flags |= 256;
      }
      r = false;
    }
  }
  return ql(e, t, n, r, o, a);
}
function ql(e, t, n, r, a, o) {
  Wl(e, t);
  var l = (t.flags & 64) !== 0;
  if (!r && !l) {
    if (a) {
      xa(t, n, false);
    }
    return oi(e, t, o);
  }
  r = t.stateNode;
  Dl.current = t;
  var i = l && typeof n.getDerivedStateFromError !== "function" ? null : r.render();
  t.flags |= 1;
  if (e !== null && l) {
    t.child = Lo(t, e.child, null, o);
    t.child = Lo(t, null, i, o);
  } else {
    Al(e, t, i, o);
  }
  t.memoizedState = r.state;
  if (a) {
    xa(t, n, true);
  }
  return t.child;
}
function Kl(e) {
  var t = e.stateNode;
  if (t.pendingContext) {
    ba(0, t.pendingContext, t.pendingContext !== t.context);
  } else if (t.context) {
    ba(0, t.context, false);
  }
  Mo(e, t.containerInfo);
}
var Yl;
var $l;
var Ql;
var Gl = {
  dehydrated: null,
  retryLane: 0
};
function Xl(e, t, n) {
  var r;
  var a = t.pendingProps;
  var o = Ao.current;
  var l = false;
  if (!(r = (t.flags & 64) !== 0)) {
    r = (e === null || e.memoizedState !== null) && (o & 2) !== 0;
  }
  if (r) {
    l = true;
    t.flags &= -65;
  } else if ((e === null || e.memoizedState !== null) && a.fallback !== undefined && a.unstable_avoidThisFallback !== true) {
    o |= 1;
  }
  fa(Ao, o & 1);
  if (e === null) {
    if (a.fallback !== undefined) {
      Zo(t);
    }
    e = a.children;
    o = a.fallback;
    if (l) {
      e = Jl(t, e, o, n);
      t.child.memoizedState = {
        baseLanes: n
      };
      t.memoizedState = Gl;
      return e;
    } else if (typeof a.unstable_expectedLoadTime === "number") {
      e = Jl(t, e, o, n);
      t.child.memoizedState = {
        baseLanes: n
      };
      t.memoizedState = Gl;
      t.lanes = 33554432;
      return e;
    } else {
      (n = $u({
        mode: "visible",
        children: e
      }, t.mode, n, null)).return = t;
      return t.child = n;
    }
  } else {
    e.memoizedState;
    if (l) {
      a = ti(e, t, a.children, a.fallback, n);
      l = t.child;
      o = e.child.memoizedState;
      l.memoizedState = o === null ? {
        baseLanes: n
      } : {
        baseLanes: o.baseLanes | n
      };
      l.childLanes = e.childLanes & ~n;
      t.memoizedState = Gl;
      return a;
    } else {
      n = ei(e, t, a.children, n);
      t.memoizedState = null;
      return n;
    }
  }
}
function Jl(e, t, n, r) {
  var a = e.mode;
  var o = e.child;
  t = {
    mode: "hidden",
    children: t
  };
  if ((a & 2) === 0 && o !== null) {
    o.childLanes = 0;
    o.pendingProps = t;
  } else {
    o = $u(t, a, 0, null);
  }
  n = Yu(n, a, r, null);
  o.return = e;
  n.return = e;
  o.sibling = n;
  e.child = o;
  return n;
}
function ei(e, t, n, r) {
  var a = e.child;
  e = a.sibling;
  n = qu(a, {
    mode: "visible",
    children: n
  });
  if ((t.mode & 2) === 0) {
    n.lanes = r;
  }
  n.return = t;
  n.sibling = null;
  if (e !== null) {
    e.nextEffect = null;
    e.flags = 8;
    t.firstEffect = t.lastEffect = e;
  }
  return t.child = n;
}
function ti(e, t, n, r, a) {
  var o = t.mode;
  var l = e.child;
  e = l.sibling;
  var i = {
    mode: "hidden",
    children: n
  };
  if ((o & 2) === 0 && t.child !== l) {
    (n = t.child).childLanes = 0;
    n.pendingProps = i;
    if ((l = n.lastEffect) !== null) {
      t.firstEffect = n.firstEffect;
      t.lastEffect = l;
      l.nextEffect = null;
    } else {
      t.firstEffect = t.lastEffect = null;
    }
  } else {
    n = qu(l, i);
  }
  if (e !== null) {
    r = qu(e, r);
  } else {
    (r = Yu(r, o, a, null)).flags |= 2;
  }
  r.return = t;
  n.return = t;
  n.sibling = r;
  t.child = n;
  return r;
}
function ni(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  if (n !== null) {
    n.lanes |= t;
  }
  ao(e.return, t);
}
function ri(e, t, n, r, a, o) {
  var l = e.memoizedState;
  if (l === null) {
    e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: r,
      tail: n,
      tailMode: a,
      lastEffect: o
    };
  } else {
    l.isBackwards = t;
    l.rendering = null;
    l.renderingStartTime = 0;
    l.last = r;
    l.tail = n;
    l.tailMode = a;
    l.lastEffect = o;
  }
}
function ai(e, t, n) {
  var r = t.pendingProps;
  var a = r.revealOrder;
  var o = r.tail;
  Al(e, t, r.children, n);
  if (((r = Ao.current) & 2) !== 0) {
    r = r & 1 | 2;
    t.flags |= 64;
  } else {
    if (e !== null && (e.flags & 64) !== 0) {
      e: for (e = t.child; e !== null;) {
        if (e.tag === 13) {
          if (e.memoizedState !== null) {
            ni(e, n);
          }
        } else if (e.tag === 19) {
          ni(e, n);
        } else if (e.child !== null) {
          e.child.return = e;
          e = e.child;
          continue;
        }
        if (e === t) {
          break e;
        }
        while (e.sibling === null) {
          if (e.return === null || e.return === t) {
            break e;
          }
          e = e.return;
        }
        e.sibling.return = e.return;
        e = e.sibling;
      }
    }
    r &= 1;
  }
  fa(Ao, r);
  if ((t.mode & 2) === 0) {
    t.memoizedState = null;
  } else {
    switch (a) {
      case "forwards":
        n = t.child;
        a = null;
        while (n !== null) {
          if ((e = n.alternate) !== null && Ro(e) === null) {
            a = n;
          }
          n = n.sibling;
        }
        if ((n = a) === null) {
          a = t.child;
          t.child = null;
        } else {
          a = n.sibling;
          n.sibling = null;
        }
        ri(t, false, a, n, o, t.lastEffect);
        break;
      case "backwards":
        n = null;
        a = t.child;
        t.child = null;
        while (a !== null) {
          if ((e = a.alternate) !== null && Ro(e) === null) {
            t.child = a;
            break;
          }
          e = a.sibling;
          a.sibling = n;
          n = a;
          a = e;
        }
        ri(t, true, n, null, o, t.lastEffect);
        break;
      case "together":
        ri(t, false, null, null, undefined, t.lastEffect);
        break;
      default:
        t.memoizedState = null;
    }
  }
  return t.child;
}
function oi(e, t, n) {
  if (e !== null) {
    t.dependencies = e.dependencies;
  }
  Fi |= t.lanes;
  if ((n & t.childLanes) !== 0) {
    if (e !== null && t.child !== e.child) {
      throw Error(l(153));
    }
    if (t.child !== null) {
      n = qu(e = t.child, e.pendingProps);
      t.child = n;
      n.return = t;
      while (e.sibling !== null) {
        e = e.sibling;
        (n = n.sibling = qu(e, e.pendingProps)).return = t;
      }
      n.sibling = null;
    }
    return t.child;
  }
  return null;
}
function li(e, t) {
  if (!Vo) {
    switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        var n = null;
        while (t !== null) {
          if (t.alternate !== null) {
            n = t;
          }
          t = t.sibling;
        }
        if (n === null) {
          e.tail = null;
        } else {
          n.sibling = null;
        }
        break;
      case "collapsed":
        n = e.tail;
        var r = null;
        while (n !== null) {
          if (n.alternate !== null) {
            r = n;
          }
          n = n.sibling;
        }
        if (r === null) {
          if (t || e.tail === null) {
            e.tail = null;
          } else {
            e.tail.sibling = null;
          }
        } else {
          r.sibling = null;
        }
    }
  }
}
function ii(e, t, n) {
  var r = t.pendingProps;
  switch (t.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return null;
    case 1:
    case 17:
      if (ya(t.type)) {
        ga();
      }
      return null;
    case 3:
      Bo();
      sa(ha);
      sa(pa);
      Qo();
      if ((r = t.stateNode).pendingContext) {
        r.context = r.pendingContext;
        r.pendingContext = null;
      }
      if (e === null || e.child === null) {
        if (Ko(t)) {
          t.flags |= 4;
        } else if (!r.hydrate) {
          t.flags |= 256;
        }
      }
      return null;
    case 5:
      Uo(t);
      var o = To(Oo.current);
      n = t.type;
      if (e !== null && t.stateNode != null) {
        $l(e, t, n, r);
        if (e.ref !== t.ref) {
          t.flags |= 128;
        }
      } else {
        if (!r) {
          if (t.stateNode === null) {
            throw Error(l(166));
          }
          return null;
        }
        e = To(No.current);
        if (Ko(t)) {
          r = t.stateNode;
          n = t.type;
          var i = t.memoizedProps;
          r[Xr] = t;
          r[Jr] = i;
          switch (n) {
            case "dialog":
              Nr("cancel", r);
              Nr("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              Nr("load", r);
              break;
            case "video":
            case "audio":
              for (e = 0; e < zr.length; e++) {
                Nr(zr[e], r);
              }
              break;
            case "source":
              Nr("error", r);
              break;
            case "img":
            case "image":
            case "link":
              Nr("error", r);
              Nr("load", r);
              break;
            case "details":
              Nr("toggle", r);
              break;
            case "input":
              ee(r, i);
              Nr("invalid", r);
              break;
            case "select":
              r._wrapperState = {
                wasMultiple: !!i.multiple
              };
              Nr("invalid", r);
              break;
            case "textarea":
              ue(r, i);
              Nr("invalid", r);
          }
          Se(n, i);
          e = null;
          for (var c in i) {
            if (i.hasOwnProperty(c)) {
              o = i[c];
              if (c === "children") {
                if (typeof o === "string") {
                  if (r.textContent !== o) {
                    e = ["children", o];
                  }
                } else if (typeof o === "number" && r.textContent !== "" + o) {
                  e = ["children", "" + o];
                }
              } else if (u.hasOwnProperty(c) && o != null && c === "onScroll") {
                Nr("scroll", r);
              }
            }
          }
          switch (n) {
            case "input":
              Q(r);
              re(r, i, true);
              break;
            case "textarea":
              Q(r);
              se(r);
              break;
            case "select":
            case "option":
              break;
            default:
              if (typeof i.onClick === "function") {
                r.onclick = Ir;
              }
          }
          r = e;
          t.updateQueue = r;
          if (r !== null) {
            t.flags |= 4;
          }
        } else {
          c = o.nodeType === 9 ? o : o.ownerDocument;
          if (e === fe) {
            e = pe(n);
          }
          if (e === fe) {
            if (n === "script") {
              (e = c.createElement("div")).innerHTML = "<script></script>";
              e = e.removeChild(e.firstChild);
            } else if (typeof r.is === "string") {
              e = c.createElement(n, {
                is: r.is
              });
            } else {
              e = c.createElement(n);
              if (n === "select") {
                c = e;
                if (r.multiple) {
                  c.multiple = true;
                } else if (r.size) {
                  c.size = r.size;
                }
              }
            }
          } else {
            e = c.createElementNS(e, n);
          }
          e[Xr] = t;
          e[Jr] = r;
          Yl(e, t);
          t.stateNode = e;
          c = Ee(n, r);
          switch (n) {
            case "dialog":
              Nr("cancel", e);
              Nr("close", e);
              o = r;
              break;
            case "iframe":
            case "object":
            case "embed":
              Nr("load", e);
              o = r;
              break;
            case "video":
            case "audio":
              for (o = 0; o < zr.length; o++) {
                Nr(zr[o], e);
              }
              o = r;
              break;
            case "source":
              Nr("error", e);
              o = r;
              break;
            case "img":
            case "image":
            case "link":
              Nr("error", e);
              Nr("load", e);
              o = r;
              break;
            case "details":
              Nr("toggle", e);
              o = r;
              break;
            case "input":
              ee(e, r);
              o = J(e, r);
              Nr("invalid", e);
              break;
            case "option":
              o = oe(e, r);
              break;
            case "select":
              e._wrapperState = {
                wasMultiple: !!r.multiple
              };
              o = a({}, r, {
                value: undefined
              });
              Nr("invalid", e);
              break;
            case "textarea":
              ue(e, r);
              o = ie(e, r);
              Nr("invalid", e);
              break;
            default:
              o = r;
          }
          Se(n, o);
          var s = o;
          for (i in s) {
            if (s.hasOwnProperty(i)) {
              var f = s[i];
              if (i === "style") {
                xe(e, f);
              } else if (i === "dangerouslySetInnerHTML") {
                if ((f = f ? f.__html : undefined) != null) {
                  ye(e, f);
                }
              } else if (i === "children") {
                if (typeof f === "string") {
                  if (n !== "textarea" || f !== "") {
                    ge(e, f);
                  }
                } else if (typeof f === "number") {
                  ge(e, "" + f);
                }
              } else if (i !== "suppressContentEditableWarning" && i !== "suppressHydrationWarning" && i !== "autoFocus") {
                if (u.hasOwnProperty(i)) {
                  if (f != null && i === "onScroll") {
                    Nr("scroll", e);
                  }
                } else if (f != null) {
                  w(e, i, f, c);
                }
              }
            }
          }
          switch (n) {
            case "input":
              Q(e);
              re(e, r, false);
              break;
            case "textarea":
              Q(e);
              se(e);
              break;
            case "option":
              if (r.value != null) {
                e.setAttribute("value", "" + Y(r.value));
              }
              break;
            case "select":
              e.multiple = !!r.multiple;
              if ((i = r.value) != null) {
                le(e, !!r.multiple, i, false);
              } else if (r.defaultValue != null) {
                le(e, !!r.multiple, r.defaultValue, true);
              }
              break;
            default:
              if (typeof o.onClick === "function") {
                e.onclick = Ir;
              }
          }
          if (Wr(n, r)) {
            t.flags |= 4;
          }
        }
        if (t.ref !== null) {
          t.flags |= 128;
        }
      }
      return null;
    case 6:
      if (e && t.stateNode != null) {
        Ql(0, t, e.memoizedProps, r);
      } else {
        if (typeof r !== "string" && t.stateNode === null) {
          throw Error(l(166));
        }
        n = To(Oo.current);
        To(No.current);
        if (Ko(t)) {
          r = t.stateNode;
          n = t.memoizedProps;
          r[Xr] = t;
          if (r.nodeValue !== n) {
            t.flags |= 4;
          }
        } else {
          (r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r))[Xr] = t;
          t.stateNode = r;
        }
      }
      return null;
    case 13:
      sa(Ao);
      r = t.memoizedState;
      if ((t.flags & 64) !== 0) {
        t.lanes = n;
        return t;
      } else {
        r = r !== null;
        n = false;
        if (e === null) {
          if (t.memoizedProps.fallback !== undefined) {
            Ko(t);
          }
        } else {
          n = e.memoizedState !== null;
        }
        if (r && !n && (t.mode & 2) !== 0) {
          if (e === null && t.memoizedProps.unstable_avoidThisFallback !== true || (Ao.current & 1) !== 0) {
            if (Ai === 0) {
              Ai = 3;
            }
          } else {
            if (Ai === 0 || Ai === 3) {
              Ai = 4;
            }
            if (Ti !== null && ((Fi & 134217727) !== 0 || (Vi & 134217727) !== 0)) {
              gu(Ti, Bi);
            }
          }
        }
        if (r || n) {
          t.flags |= 4;
        }
        return null;
      }
    case 4:
      Bo();
      if (e === null) {
        Or(t.stateNode.containerInfo);
      }
      return null;
    case 10:
      ro(t);
      return null;
    case 19:
      sa(Ao);
      if ((r = t.memoizedState) === null) {
        return null;
      }
      i = (t.flags & 64) !== 0;
      if ((c = r.rendering) === null) {
        if (i) {
          li(r, false);
        } else {
          if (Ai !== 0 || e !== null && (e.flags & 64) !== 0) {
            for (e = t.child; e !== null;) {
              if ((c = Ro(e)) !== null) {
                t.flags |= 64;
                li(r, false);
                if ((i = c.updateQueue) !== null) {
                  t.updateQueue = i;
                  t.flags |= 4;
                }
                if (r.lastEffect === null) {
                  t.firstEffect = null;
                }
                t.lastEffect = r.lastEffect;
                r = n;
                n = t.child;
                while (n !== null) {
                  e = r;
                  (i = n).flags &= 2;
                  i.nextEffect = null;
                  i.firstEffect = null;
                  i.lastEffect = null;
                  if ((c = i.alternate) === null) {
                    i.childLanes = 0;
                    i.lanes = e;
                    i.child = null;
                    i.memoizedProps = null;
                    i.memoizedState = null;
                    i.updateQueue = null;
                    i.dependencies = null;
                    i.stateNode = null;
                  } else {
                    i.childLanes = c.childLanes;
                    i.lanes = c.lanes;
                    i.child = c.child;
                    i.memoizedProps = c.memoizedProps;
                    i.memoizedState = c.memoizedState;
                    i.updateQueue = c.updateQueue;
                    i.type = c.type;
                    e = c.dependencies;
                    i.dependencies = e === null ? null : {
                      lanes: e.lanes,
                      firstContext: e.firstContext
                    };
                  }
                  n = n.sibling;
                }
                fa(Ao, Ao.current & 1 | 2);
                return t.child;
              }
              e = e.sibling;
            }
          }
          if (r.tail !== null && Wa() > qi) {
            t.flags |= 64;
            i = true;
            li(r, false);
            t.lanes = 33554432;
          }
        }
      } else {
        if (!i) {
          if ((e = Ro(c)) !== null) {
            t.flags |= 64;
            i = true;
            if ((n = e.updateQueue) !== null) {
              t.updateQueue = n;
              t.flags |= 4;
            }
            li(r, true);
            if (r.tail === null && r.tailMode === "hidden" && !c.alternate && !Vo) {
              if ((t = t.lastEffect = r.lastEffect) !== null) {
                t.nextEffect = null;
              }
              return null;
            }
          } else if (Wa() * 2 - r.renderingStartTime > qi && n !== 1073741824) {
            t.flags |= 64;
            i = true;
            li(r, false);
            t.lanes = 33554432;
          }
        }
        if (r.isBackwards) {
          c.sibling = t.child;
          t.child = c;
        } else {
          if ((n = r.last) !== null) {
            n.sibling = c;
          } else {
            t.child = c;
          }
          r.last = c;
        }
      }
      if (r.tail !== null) {
        n = r.tail;
        r.rendering = n;
        r.tail = n.sibling;
        r.lastEffect = t.lastEffect;
        r.renderingStartTime = Wa();
        n.sibling = null;
        t = Ao.current;
        fa(Ao, i ? t & 1 | 2 : t & 1);
        return n;
      } else {
        return null;
      }
    case 23:
    case 24:
      Cu();
      if (e !== null && e.memoizedState !== null !== (t.memoizedState !== null) && r.mode !== "unstable-defer-without-hiding") {
        t.flags |= 4;
      }
      return null;
  }
  throw Error(l(156, t.tag));
}
function ui(e) {
  switch (e.tag) {
    case 1:
      if (ya(e.type)) {
        ga();
      }
      var t = e.flags;
      if (t & 4096) {
        e.flags = t & -4097 | 64;
        return e;
      } else {
        return null;
      }
    case 3:
      Bo();
      sa(ha);
      sa(pa);
      Qo();
      if (((t = e.flags) & 64) !== 0) {
        throw Error(l(285));
      }
      e.flags = t & -4097 | 64;
      return e;
    case 5:
      Uo(e);
      return null;
    case 13:
      sa(Ao);
      if ((t = e.flags) & 4096) {
        e.flags = t & -4097 | 64;
        return e;
      } else {
        return null;
      }
    case 19:
      sa(Ao);
      return null;
    case 4:
      Bo();
      return null;
    case 10:
      ro(e);
      return null;
    case 23:
    case 24:
      Cu();
      return null;
    default:
      return null;
  }
}
function ci(e, t) {
  try {
    var n = "";
    var r = t;
    do {
      n += q(r);
      r = r.return;
    } while (r);
    var a = n;
  } catch (o) {
    a = "\nError generating stack: " + o.message + "\n" + o.stack;
  }
  return {
    value: e,
    source: t,
    stack: a
  };
}
function si(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
Yl = function (e, t) {
  for (var n = t.child; n !== null;) {
    if (n.tag === 5 || n.tag === 6) {
      e.appendChild(n.stateNode);
    } else if (n.tag !== 4 && n.child !== null) {
      n.child.return = n;
      n = n.child;
      continue;
    }
    if (n === t) {
      break;
    }
    while (n.sibling === null) {
      if (n.return === null || n.return === t) {
        return;
      }
      n = n.return;
    }
    n.sibling.return = n.return;
    n = n.sibling;
  }
};
$l = function (e, t, n, r) {
  var o = e.memoizedProps;
  if (o !== r) {
    e = t.stateNode;
    To(No.current);
    var l;
    var i = null;
    switch (n) {
      case "input":
        o = J(e, o);
        r = J(e, r);
        i = [];
        break;
      case "option":
        o = oe(e, o);
        r = oe(e, r);
        i = [];
        break;
      case "select":
        o = a({}, o, {
          value: undefined
        });
        r = a({}, r, {
          value: undefined
        });
        i = [];
        break;
      case "textarea":
        o = ie(e, o);
        r = ie(e, r);
        i = [];
        break;
      default:
        if (typeof o.onClick !== "function" && typeof r.onClick === "function") {
          e.onclick = Ir;
        }
    }
    Se(n, r);
    n = null;
    for (f in o) {
      if (!r.hasOwnProperty(f) && o.hasOwnProperty(f) && o[f] != null) {
        if (f === "style") {
          var c = o[f];
          for (l in c) {
            if (c.hasOwnProperty(l)) {
              n ||= {};
              n[l] = "";
            }
          }
        } else if (f !== "dangerouslySetInnerHTML" && f !== "children" && f !== "suppressContentEditableWarning" && f !== "suppressHydrationWarning" && f !== "autoFocus") {
          if (u.hasOwnProperty(f)) {
            i ||= [];
          } else {
            (i = i || []).push(f, null);
          }
        }
      }
    }
    for (f in r) {
      var s = r[f];
      c = o != null ? o[f] : undefined;
      if (r.hasOwnProperty(f) && s !== c && (s != null || c != null)) {
        if (f === "style") {
          if (c) {
            for (l in c) {
              if (!!c.hasOwnProperty(l) && (!s || !s.hasOwnProperty(l))) {
                n ||= {};
                n[l] = "";
              }
            }
            for (l in s) {
              if (s.hasOwnProperty(l) && c[l] !== s[l]) {
                n ||= {};
                n[l] = s[l];
              }
            }
          } else {
            if (!n) {
              i ||= [];
              i.push(f, n);
            }
            n = s;
          }
        } else if (f === "dangerouslySetInnerHTML") {
          s = s ? s.__html : undefined;
          c = c ? c.__html : undefined;
          if (s != null && c !== s) {
            (i = i || []).push(f, s);
          }
        } else if (f === "children") {
          if (typeof s === "string" || typeof s === "number") {
            (i = i || []).push(f, "" + s);
          }
        } else if (f !== "suppressContentEditableWarning" && f !== "suppressHydrationWarning") {
          if (u.hasOwnProperty(f)) {
            if (s != null && f === "onScroll") {
              Nr("scroll", e);
            }
            if (!i && c !== s) {
              i = [];
            }
          } else if (typeof s === "object" && s !== null && s.$$typeof === B) {
            s.toString();
          } else {
            (i = i || []).push(f, s);
          }
        }
      }
    }
    if (n) {
      (i = i || []).push("style", n);
    }
    var f = i;
    if (t.updateQueue = f) {
      t.flags |= 4;
    }
  }
};
Ql = function (e, t, n, r) {
  if (n !== r) {
    t.flags |= 4;
  }
};
var fi = typeof WeakMap === "function" ? WeakMap : Map;
function di(e, t, n) {
  (n = so(-1, n)).tag = 3;
  n.payload = {
    element: null
  };
  var r = t.value;
  n.callback = function () {
    if (!Qi) {
      Qi = true;
      Gi = r;
    }
    si(0, t);
  };
  return n;
}
function pi(e, t, n) {
  (n = so(-1, n)).tag = 3;
  var r = e.type.getDerivedStateFromError;
  if (typeof r === "function") {
    var a = t.value;
    n.payload = function () {
      si(0, t);
      return r(a);
    };
  }
  var o = e.stateNode;
  if (o !== null && typeof o.componentDidCatch === "function") {
    n.callback = function () {
      if (typeof r !== "function") {
        if (Xi === null) {
          Xi = new Set([this]);
        } else {
          Xi.add(this);
        }
        si(0, t);
      }
      var e = t.stack;
      this.componentDidCatch(t.value, {
        componentStack: e !== null ? e : ""
      });
    };
  }
  return n;
}
var hi = typeof WeakSet === "function" ? WeakSet : Set;
function vi(e) {
  var t = e.ref;
  if (t !== null) {
    if (typeof t === "function") {
      try {
        t(null);
      } catch (n) {
        Iu(e, n);
      }
    } else {
      t.current = null;
    }
  }
}
function mi(e, t) {
  switch (t.tag) {
    case 0:
    case 11:
    case 15:
    case 22:
    case 5:
    case 6:
    case 4:
    case 17:
      return;
    case 1:
      if (t.flags & 256 && e !== null) {
        var n = e.memoizedProps;
        var r = e.memoizedState;
        t = (e = t.stateNode).getSnapshotBeforeUpdate(t.elementType === t.type ? n : Ga(t.type, n), r);
        e.__reactInternalSnapshotBeforeUpdate = t;
      }
      return;
    case 3:
      if (t.flags & 256) {
        Kr(t.stateNode.containerInfo);
      }
      return;
  }
  throw Error(l(163));
}
function yi(e, t, n) {
  switch (n.tag) {
    case 0:
    case 11:
    case 15:
    case 22:
      if ((t = (t = n.updateQueue) !== null ? t.lastEffect : null) !== null) {
        e = t = t.next;
        do {
          if ((e.tag & 3) === 3) {
            var r = e.create;
            e.destroy = r();
          }
          e = e.next;
        } while (e !== t);
      }
      if ((t = (t = n.updateQueue) !== null ? t.lastEffect : null) !== null) {
        e = t = t.next;
        do {
          var a = e;
          r = a.next;
          if (((a = a.tag) & 4) !== 0 && (a & 1) !== 0) {
            Uu(n, e);
            Du(n, e);
          }
          e = r;
        } while (e !== t);
      }
      return;
    case 1:
      e = n.stateNode;
      if (n.flags & 4) {
        if (t === null) {
          e.componentDidMount();
        } else {
          r = n.elementType === n.type ? t.memoizedProps : Ga(n.type, t.memoizedProps);
          e.componentDidUpdate(r, t.memoizedState, e.__reactInternalSnapshotBeforeUpdate);
        }
      }
      if ((t = n.updateQueue) !== null) {
        vo(n, t, e);
      }
      return;
    case 3:
      if ((t = n.updateQueue) !== null) {
        e = null;
        if (n.child !== null) {
          switch (n.child.tag) {
            case 5:
            case 1:
              e = n.child.stateNode;
          }
        }
        vo(n, t, e);
      }
      return;
    case 5:
      e = n.stateNode;
      if (t === null && n.flags & 4 && Wr(n.type, n.memoizedProps)) {
        e.focus();
      }
      return;
    case 6:
    case 4:
    case 12:
    case 19:
    case 17:
    case 20:
    case 21:
    case 23:
    case 24:
      return;
    case 13:
      if (n.memoizedState === null) {
        n = n.alternate;
        if (n !== null) {
          n = n.memoizedState;
          if (n !== null) {
            n = n.dehydrated;
            if (n !== null) {
              xt(n);
            }
          }
        }
      }
      return;
  }
  throw Error(l(163));
}
function gi(e, t) {
  var n = e;
  while (true) {
    if (n.tag === 5) {
      var r = n.stateNode;
      if (t) {
        if (typeof (r = r.style).setProperty === "function") {
          r.setProperty("display", "none", "important");
        } else {
          r.display = "none";
        }
      } else {
        r = n.stateNode;
        var a = n.memoizedProps.style;
        a = a !== undefined && a !== null && a.hasOwnProperty("display") ? a.display : null;
        r.style.display = ke("display", a);
      }
    } else if (n.tag === 6) {
      n.stateNode.nodeValue = t ? "" : n.memoizedProps;
    } else if ((n.tag !== 23 && n.tag !== 24 || n.memoizedState === null || n === e) && n.child !== null) {
      n.child.return = n;
      n = n.child;
      continue;
    }
    if (n === e) {
      break;
    }
    while (n.sibling === null) {
      if (n.return === null || n.return === e) {
        return;
      }
      n = n.return;
    }
    n.sibling.return = n.return;
    n = n.sibling;
  }
}
function bi(e, t) {
  if (Sa && typeof Sa.onCommitFiberUnmount === "function") {
    try {
      Sa.onCommitFiberUnmount(Ca, t);
    } catch (o) {}
  }
  switch (t.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
    case 22:
      if ((e = t.updateQueue) !== null && (e = e.lastEffect) !== null) {
        var n = e = e.next;
        do {
          var r = n;
          var a = r.destroy;
          r = r.tag;
          if (a !== undefined) {
            if ((r & 4) !== 0) {
              Uu(t, n);
            } else {
              r = t;
              try {
                a();
              } catch (o) {
                Iu(r, o);
              }
            }
          }
          n = n.next;
        } while (n !== e);
      }
      break;
    case 1:
      vi(t);
      if (typeof (e = t.stateNode).componentWillUnmount === "function") {
        try {
          e.props = t.memoizedProps;
          e.state = t.memoizedState;
          e.componentWillUnmount();
        } catch (o) {
          Iu(t, o);
        }
      }
      break;
    case 5:
      vi(t);
      break;
    case 4:
      Ei(e, t);
  }
}
function wi(e) {
  e.alternate = null;
  e.child = null;
  e.dependencies = null;
  e.firstEffect = null;
  e.lastEffect = null;
  e.memoizedProps = null;
  e.memoizedState = null;
  e.pendingProps = null;
  e.return = null;
  e.updateQueue = null;
}
function ki(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function xi(e) {
  e: {
    for (var t = e.return; t !== null;) {
      if (ki(t)) {
        break e;
      }
      t = t.return;
    }
    throw Error(l(160));
  }
  var n = t;
  t = n.stateNode;
  switch (n.tag) {
    case 5:
      var r = false;
      break;
    case 3:
    case 4:
      t = t.containerInfo;
      r = true;
      break;
    default:
      throw Error(l(161));
  }
  if (n.flags & 16) {
    ge(t, "");
    n.flags &= -17;
  }
  e: t: for (n = e;;) {
    while (n.sibling === null) {
      if (n.return === null || ki(n.return)) {
        n = null;
        break e;
      }
      n = n.return;
    }
    n.sibling.return = n.return;
    n = n.sibling;
    while (n.tag !== 5 && n.tag !== 6 && n.tag !== 18) {
      if (n.flags & 2) {
        continue t;
      }
      if (n.child === null || n.tag === 4) {
        continue t;
      }
      n.child.return = n;
      n = n.child;
    }
    if (!(n.flags & 2)) {
      n = n.stateNode;
      break e;
    }
  }
  if (r) {
    Ci(e, n, t);
  } else {
    Si(e, n, t);
  }
}
function Ci(e, t, n) {
  var r = e.tag;
  var a = r === 5 || r === 6;
  if (a) {
    e = a ? e.stateNode : e.stateNode.instance;
    if (t) {
      if (n.nodeType === 8) {
        n.parentNode.insertBefore(e, t);
      } else {
        n.insertBefore(e, t);
      }
    } else {
      if (n.nodeType === 8) {
        (t = n.parentNode).insertBefore(e, n);
      } else {
        (t = n).appendChild(e);
      }
      if (((n = n._reactRootContainer) === null || n === undefined) && t.onclick === null) {
        t.onclick = Ir;
      }
    }
  } else if (r !== 4 && (e = e.child) !== null) {
    Ci(e, t, n);
    e = e.sibling;
    while (e !== null) {
      Ci(e, t, n);
      e = e.sibling;
    }
  }
}
function Si(e, t, n) {
  var r = e.tag;
  var a = r === 5 || r === 6;
  if (a) {
    e = a ? e.stateNode : e.stateNode.instance;
    if (t) {
      n.insertBefore(e, t);
    } else {
      n.appendChild(e);
    }
  } else if (r !== 4 && (e = e.child) !== null) {
    Si(e, t, n);
    e = e.sibling;
    while (e !== null) {
      Si(e, t, n);
      e = e.sibling;
    }
  }
}
function Ei(e, t) {
  var n;
  var r;
  var a = t;
  var o = false;
  while (true) {
    if (!o) {
      o = a.return;
      e: while (true) {
        if (o === null) {
          throw Error(l(160));
        }
        n = o.stateNode;
        switch (o.tag) {
          case 5:
            r = false;
            break e;
          case 3:
          case 4:
            n = n.containerInfo;
            r = true;
            break e;
        }
        o = o.return;
      }
      o = true;
    }
    if (a.tag === 5 || a.tag === 6) {
      var i = e;
      var u = a;
      var c = u;
      e: while (true) {
        bi(i, c);
        if (c.child !== null && c.tag !== 4) {
          c.child.return = c;
          c = c.child;
        } else {
          if (c === u) {
            break e;
          }
          while (c.sibling === null) {
            if (c.return === null || c.return === u) {
              break e;
            }
            c = c.return;
          }
          c.sibling.return = c.return;
          c = c.sibling;
        }
      }
      if (r) {
        i = n;
        u = a.stateNode;
        if (i.nodeType === 8) {
          i.parentNode.removeChild(u);
        } else {
          i.removeChild(u);
        }
      } else {
        n.removeChild(a.stateNode);
      }
    } else if (a.tag === 4) {
      if (a.child !== null) {
        n = a.stateNode.containerInfo;
        r = true;
        a.child.return = a;
        a = a.child;
        continue;
      }
    } else {
      bi(e, a);
      if (a.child !== null) {
        a.child.return = a;
        a = a.child;
        continue;
      }
    }
    if (a === t) {
      break;
    }
    while (a.sibling === null) {
      if (a.return === null || a.return === t) {
        return;
      }
      if ((a = a.return).tag === 4) {
        o = false;
      }
    }
    a.sibling.return = a.return;
    a = a.sibling;
  }
}
function zi(e, t) {
  switch (t.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
    case 22:
      var n = t.updateQueue;
      if ((n = n !== null ? n.lastEffect : null) !== null) {
        var r = n = n.next;
        do {
          if ((r.tag & 3) === 3) {
            e = r.destroy;
            r.destroy = undefined;
            if (e !== undefined) {
              e();
            }
          }
          r = r.next;
        } while (r !== n);
      }
      return;
    case 1:
    case 12:
    case 17:
      return;
    case 5:
      if ((n = t.stateNode) != null) {
        r = t.memoizedProps;
        var a = e !== null ? e.memoizedProps : r;
        e = t.type;
        var o = t.updateQueue;
        t.updateQueue = null;
        if (o !== null) {
          n[Jr] = r;
          if (e === "input" && r.type === "radio" && r.name != null) {
            te(n, r);
          }
          Ee(e, a);
          t = Ee(e, r);
          a = 0;
          for (; a < o.length; a += 2) {
            var i = o[a];
            var u = o[a + 1];
            if (i === "style") {
              xe(n, u);
            } else if (i === "dangerouslySetInnerHTML") {
              ye(n, u);
            } else if (i === "children") {
              ge(n, u);
            } else {
              w(n, i, u, t);
            }
          }
          switch (e) {
            case "input":
              ne(n, r);
              break;
            case "textarea":
              ce(n, r);
              break;
            case "select":
              e = n._wrapperState.wasMultiple;
              n._wrapperState.wasMultiple = !!r.multiple;
              if ((o = r.value) != null) {
                le(n, !!r.multiple, o, false);
              } else if (e !== !!r.multiple) {
                if (r.defaultValue != null) {
                  le(n, !!r.multiple, r.defaultValue, true);
                } else {
                  le(n, !!r.multiple, r.multiple ? [] : "", false);
                }
              }
          }
        }
      }
      return;
    case 6:
      if (t.stateNode === null) {
        throw Error(l(162));
      }
      t.stateNode.nodeValue = t.memoizedProps;
      return;
    case 3:
      if ((n = t.stateNode).hydrate) {
        n.hydrate = false;
        xt(n.containerInfo);
      }
      return;
    case 13:
      if (t.memoizedState !== null) {
        Zi = Wa();
        gi(t.child, true);
      }
      Li(t);
      return;
    case 19:
      Li(t);
      return;
    case 23:
    case 24:
      gi(t, t.memoizedState !== null);
      return;
  }
  throw Error(l(163));
}
function Li(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    if (n === null) {
      n = e.stateNode = new hi();
    }
    t.forEach(function (t) {
      var r = Vu.bind(null, e, t);
      if (!n.has(t)) {
        n.add(t);
        t.then(r, r);
      }
    });
  }
}
function _i(e, t) {
  return e !== null && ((e = e.memoizedState) === null || e.dehydrated !== null) && (t = t.memoizedState) !== null && t.dehydrated === null;
}
var Pi = Math.ceil;
var Ni = k.ReactCurrentDispatcher;
var ji = k.ReactCurrentOwner;
var Oi = 0;
var Ti = null;
var Mi = null;
var Bi = 0;
var Di = 0;
var Ui = ca(0);
var Ai = 0;
var Ri = null;
var Ii = 0;
var Fi = 0;
var Vi = 0;
var Wi = 0;
var Hi = null;
var Zi = 0;
var qi = Infinity;
function Ki() {
  qi = Wa() + 500;
}
var Yi;
var $i = null;
var Qi = false;
var Gi = null;
var Xi = null;
var Ji = false;
var eu = null;
var tu = 90;
var nu = [];
var ru = [];
var au = null;
var ou = 0;
var lu = null;
var iu = -1;
var uu = 0;
var cu = 0;
var su = null;
var fu = false;
function du() {
  if ((Oi & 48) !== 0) {
    return Wa();
  } else if (iu !== -1) {
    return iu;
  } else {
    return iu = Wa();
  }
}
function pu(e) {
  if (((e = e.mode) & 2) === 0) {
    return 1;
  }
  if ((e & 4) === 0) {
    if (Ha() === 99) {
      return 1;
    } else {
      return 2;
    }
  }
  if (uu === 0) {
    uu = Ii;
  }
  if (Qa.transition !== 0) {
    if (cu !== 0) {
      cu = Hi !== null ? Hi.pendingLanes : 0;
    }
    e = uu;
    var t = ~cu & 4186112;
    if ((t &= -t) === 0) {
      if ((t = (e = ~e & 4186112) & -e) === 0) {
        t = 8192;
      }
    }
    return t;
  }
  e = Ha();
  if ((Oi & 4) !== 0 && e === 98) {
    e = It(12, uu);
  } else {
    e = It(e = function (e) {
      switch (e) {
        case 99:
          return 15;
        case 98:
          return 10;
        case 97:
        case 96:
          return 8;
        case 95:
          return 2;
        default:
          return 0;
      }
    }(e), uu);
  }
  return e;
}
function hu(e, t, n) {
  if (ou > 50) {
    ou = 0;
    lu = null;
    throw Error(l(185));
  }
  if ((e = vu(e, t)) === null) {
    return null;
  }
  Wt(e, t, n);
  if (e === Ti) {
    Vi |= t;
    if (Ai === 4) {
      gu(e, Bi);
    }
  }
  var r = Ha();
  if (t === 1) {
    if ((Oi & 8) !== 0 && (Oi & 48) === 0) {
      bu(e);
    } else {
      mu(e, n);
      if (Oi === 0) {
        Ki();
        Ya();
      }
    }
  } else {
    if ((Oi & 4) !== 0 && (r === 98 || r === 99)) {
      if (au === null) {
        au = new Set([e]);
      } else {
        au.add(e);
      }
    }
    mu(e, n);
  }
  Hi = e;
}
function vu(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  if (n !== null) {
    n.lanes |= t;
  }
  n = e;
  e = e.return;
  while (e !== null) {
    e.childLanes |= t;
    if ((n = e.alternate) !== null) {
      n.childLanes |= t;
    }
    n = e;
    e = e.return;
  }
  if (n.tag === 3) {
    return n.stateNode;
  } else {
    return null;
  }
}
function mu(e, t) {
  var n = e.callbackNode;
  var r = e.suspendedLanes;
  var a = e.pingedLanes;
  var o = e.expirationTimes;
  for (var i = e.pendingLanes; i > 0;) {
    var u = 31 - Ht(i);
    var c = 1 << u;
    var s = o[u];
    if (s === -1) {
      if ((c & r) === 0 || (c & a) !== 0) {
        s = t;
        Ut(c);
        var f = Dt;
        o[u] = f >= 10 ? s + 250 : f >= 6 ? s + 5000 : -1;
      }
    } else if (s <= t) {
      e.expiredLanes |= c;
    }
    i &= ~c;
  }
  r = At(e, e === Ti ? Bi : 0);
  t = Dt;
  if (r === 0) {
    if (n !== null) {
      if (n !== Ua) {
        La(n);
      }
      e.callbackNode = null;
      e.callbackPriority = 0;
    }
  } else {
    if (n !== null) {
      if (e.callbackPriority === t) {
        return;
      }
      if (n !== Ua) {
        La(n);
      }
    }
    if (t === 15) {
      n = bu.bind(null, e);
      if (Ra === null) {
        Ra = [n];
        Ia = za(Oa, $a);
      } else {
        Ra.push(n);
      }
      n = Ua;
    } else if (t === 14) {
      n = Ka(99, bu.bind(null, e));
    } else {
      n = function (e) {
        switch (e) {
          case 15:
          case 14:
            return 99;
          case 13:
          case 12:
          case 11:
          case 10:
            return 98;
          case 9:
          case 8:
          case 7:
          case 6:
          case 4:
          case 5:
            return 97;
          case 3:
          case 2:
          case 1:
            return 95;
          case 0:
            return 90;
          default:
            throw Error(l(358, e));
        }
      }(t);
      n = Ka(n, yu.bind(null, e));
    }
    e.callbackPriority = t;
    e.callbackNode = n;
  }
}
function yu(e) {
  iu = -1;
  cu = uu = 0;
  if ((Oi & 48) !== 0) {
    throw Error(l(327));
  }
  var t = e.callbackNode;
  if (Bu() && e.callbackNode !== t) {
    return null;
  }
  var n = At(e, e === Ti ? Bi : 0);
  if (n === 0) {
    return null;
  }
  var r = n;
  var a = Oi;
  Oi |= 16;
  var o = zu();
  for (Ti === e && Bi === r || (Ki(), Su(e, r));;) {
    try {
      Pu();
      break;
    } catch (u) {
      Eu(e, u);
    }
  }
  no();
  Ni.current = o;
  Oi = a;
  if (Mi !== null) {
    r = 0;
  } else {
    Ti = null;
    Bi = 0;
    r = Ai;
  }
  if ((Ii & Vi) !== 0) {
    Su(e, 0);
  } else if (r !== 0) {
    if (r === 2) {
      Oi |= 64;
      if (e.hydrate) {
        e.hydrate = false;
        Kr(e.containerInfo);
      }
      if ((n = Rt(e)) !== 0) {
        r = Lu(e, n);
      }
    }
    if (r === 1) {
      t = Ri;
      Su(e, 0);
      gu(e, n);
      mu(e, Wa());
      throw t;
    }
    e.finishedWork = e.current.alternate;
    e.finishedLanes = n;
    switch (r) {
      case 0:
      case 1:
        throw Error(l(345));
      case 2:
      case 5:
        Ou(e);
        break;
      case 3:
        gu(e, n);
        if ((n & 62914560) === n && (r = Zi + 500 - Wa()) > 10) {
          if (At(e, 0) !== 0) {
            break;
          }
          if (((a = e.suspendedLanes) & n) !== n) {
            du();
            e.pingedLanes |= e.suspendedLanes & a;
            break;
          }
          e.timeoutHandle = Zr(Ou.bind(null, e), r);
          break;
        }
        Ou(e);
        break;
      case 4:
        gu(e, n);
        if ((n & 4186112) === n) {
          break;
        }
        r = e.eventTimes;
        a = -1;
        while (n > 0) {
          var i = 31 - Ht(n);
          o = 1 << i;
          if ((i = r[i]) > a) {
            a = i;
          }
          n &= ~o;
        }
        n = a;
        if ((n = ((n = Wa() - n) < 120 ? 120 : n < 480 ? 480 : n < 1080 ? 1080 : n < 1920 ? 1920 : n < 3000 ? 3000 : n < 4320 ? 4320 : Pi(n / 1960) * 1960) - n) > 10) {
          e.timeoutHandle = Zr(Ou.bind(null, e), n);
          break;
        }
        Ou(e);
        break;
      default:
        throw Error(l(329));
    }
  }
  mu(e, Wa());
  if (e.callbackNode === t) {
    return yu.bind(null, e);
  } else {
    return null;
  }
}
function gu(e, t) {
  t &= ~Wi;
  t &= ~Vi;
  e.suspendedLanes |= t;
  e.pingedLanes &= ~t;
  e = e.expirationTimes;
  while (t > 0) {
    var n = 31 - Ht(t);
    var r = 1 << n;
    e[n] = -1;
    t &= ~r;
  }
}
function bu(e) {
  if ((Oi & 48) !== 0) {
    throw Error(l(327));
  }
  Bu();
  if (e === Ti && (e.expiredLanes & Bi) !== 0) {
    var t = Bi;
    var n = Lu(e, t);
    if ((Ii & Vi) !== 0) {
      n = Lu(e, t = At(e, t));
    }
  } else {
    n = Lu(e, t = At(e, 0));
  }
  if (e.tag !== 0 && n === 2) {
    Oi |= 64;
    if (e.hydrate) {
      e.hydrate = false;
      Kr(e.containerInfo);
    }
    if ((t = Rt(e)) !== 0) {
      n = Lu(e, t);
    }
  }
  if (n === 1) {
    n = Ri;
    Su(e, 0);
    gu(e, t);
    mu(e, Wa());
    throw n;
  }
  e.finishedWork = e.current.alternate;
  e.finishedLanes = t;
  Ou(e);
  mu(e, Wa());
  return null;
}
function wu(e, t) {
  var n = Oi;
  Oi |= 1;
  try {
    return e(t);
  } finally {
    if ((Oi = n) === 0) {
      Ki();
      Ya();
    }
  }
}
function ku(e, t) {
  var n = Oi;
  Oi &= -2;
  Oi |= 8;
  try {
    return e(t);
  } finally {
    if ((Oi = n) === 0) {
      Ki();
      Ya();
    }
  }
}
function xu(e, t) {
  fa(Ui, Di);
  Di |= t;
  Ii |= t;
}
function Cu() {
  Di = Ui.current;
  sa(Ui);
}
function Su(e, t) {
  e.finishedWork = null;
  e.finishedLanes = 0;
  var n = e.timeoutHandle;
  if (n !== -1) {
    e.timeoutHandle = -1;
    qr(n);
  }
  if (Mi !== null) {
    for (n = Mi.return; n !== null;) {
      var r = n;
      switch (r.tag) {
        case 1:
          if ((r = r.type.childContextTypes) !== null && r !== undefined) {
            ga();
          }
          break;
        case 3:
          Bo();
          sa(ha);
          sa(pa);
          Qo();
          break;
        case 5:
          Uo(r);
          break;
        case 4:
          Bo();
          break;
        case 13:
        case 19:
          sa(Ao);
          break;
        case 10:
          ro(r);
          break;
        case 23:
        case 24:
          Cu();
      }
      n = n.return;
    }
  }
  Ti = e;
  Mi = qu(e.current, null);
  Bi = Di = Ii = t;
  Ai = 0;
  Ri = null;
  Wi = Vi = Fi = 0;
}
function Eu(e, t) {
  while (true) {
    var n = Mi;
    try {
      no();
      Go.current = Ol;
      if (rl) {
        for (var r = el.memoizedState; r !== null;) {
          var a = r.queue;
          if (a !== null) {
            a.pending = null;
          }
          r = r.next;
        }
        rl = false;
      }
      Jo = 0;
      nl = tl = el = null;
      al = false;
      ji.current = null;
      if (n === null || n.return === null) {
        Ai = 1;
        Ri = t;
        Mi = null;
        break;
      }
      e: {
        var o = e;
        var l = n.return;
        var i = n;
        var u = t;
        t = Bi;
        i.flags |= 2048;
        i.firstEffect = i.lastEffect = null;
        if (u !== null && typeof u === "object" && typeof u.then === "function") {
          var c = u;
          if ((i.mode & 2) === 0) {
            var s = i.alternate;
            if (s) {
              i.updateQueue = s.updateQueue;
              i.memoizedState = s.memoizedState;
              i.lanes = s.lanes;
            } else {
              i.updateQueue = null;
              i.memoizedState = null;
            }
          }
          var f = (Ao.current & 1) !== 0;
          var d = l;
          do {
            var p;
            if (p = d.tag === 13) {
              var h = d.memoizedState;
              if (h !== null) {
                p = h.dehydrated !== null;
              } else {
                var v = d.memoizedProps;
                p = v.fallback !== undefined && (v.unstable_avoidThisFallback !== true || !f);
              }
            }
            if (p) {
              var m = d.updateQueue;
              if (m === null) {
                var y = new Set();
                y.add(c);
                d.updateQueue = y;
              } else {
                m.add(c);
              }
              if ((d.mode & 2) === 0) {
                d.flags |= 64;
                i.flags |= 16384;
                i.flags &= -2981;
                if (i.tag === 1) {
                  if (i.alternate === null) {
                    i.tag = 17;
                  } else {
                    var g = so(-1, 1);
                    g.tag = 2;
                    fo(i, g);
                  }
                }
                i.lanes |= 1;
                break e;
              }
              u = undefined;
              i = t;
              var b = o.pingCache;
              if (b === null) {
                b = o.pingCache = new fi();
                u = new Set();
                b.set(c, u);
              } else if ((u = b.get(c)) === undefined) {
                u = new Set();
                b.set(c, u);
              }
              if (!u.has(i)) {
                u.add(i);
                var w = Fu.bind(null, o, c, i);
                c.then(w, w);
              }
              d.flags |= 4096;
              d.lanes = t;
              break e;
            }
            d = d.return;
          } while (d !== null);
          u = Error((K(i.type) || "A React component") + " suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.");
        }
        if (Ai !== 5) {
          Ai = 2;
        }
        u = ci(u, i);
        d = l;
        do {
          switch (d.tag) {
            case 3:
              o = u;
              d.flags |= 4096;
              t &= -t;
              d.lanes |= t;
              po(d, di(0, o, t));
              break e;
            case 1:
              o = u;
              var k = d.type;
              var x = d.stateNode;
              if ((d.flags & 64) === 0 && (typeof k.getDerivedStateFromError === "function" || x !== null && typeof x.componentDidCatch === "function" && (Xi === null || !Xi.has(x)))) {
                d.flags |= 4096;
                t &= -t;
                d.lanes |= t;
                po(d, pi(d, o, t));
                break e;
              }
          }
          d = d.return;
        } while (d !== null);
      }
      ju(n);
    } catch (C) {
      t = C;
      if (Mi === n && n !== null) {
        Mi = n = n.return;
      }
      continue;
    }
    break;
  }
}
function zu() {
  var e = Ni.current;
  Ni.current = Ol;
  if (e === null) {
    return Ol;
  } else {
    return e;
  }
}
function Lu(e, t) {
  var n = Oi;
  Oi |= 16;
  var r = zu();
  for (Ti === e && Bi === t || Su(e, t);;) {
    try {
      _u();
      break;
    } catch (a) {
      Eu(e, a);
    }
  }
  no();
  Oi = n;
  Ni.current = r;
  if (Mi !== null) {
    throw Error(l(261));
  }
  Ti = null;
  Bi = 0;
  return Ai;
}
function _u() {
  while (Mi !== null) {
    Nu(Mi);
  }
}
function Pu() {
  while (Mi !== null && !_a()) {
    Nu(Mi);
  }
}
function Nu(e) {
  var t = Yi(e.alternate, e, Di);
  e.memoizedProps = e.pendingProps;
  if (t === null) {
    ju(e);
  } else {
    Mi = t;
  }
  ji.current = null;
}
function ju(e) {
  var t = e;
  do {
    var n = t.alternate;
    e = t.return;
    if ((t.flags & 2048) === 0) {
      if ((n = ii(n, t, Di)) !== null) {
        Mi = n;
        return;
      }
      if ((n = t).tag !== 24 && n.tag !== 23 || n.memoizedState === null || (Di & 1073741824) !== 0 || (n.mode & 4) === 0) {
        var r = 0;
        for (var a = n.child; a !== null;) {
          r |= a.lanes | a.childLanes;
          a = a.sibling;
        }
        n.childLanes = r;
      }
      if (e !== null && (e.flags & 2048) === 0) {
        if (e.firstEffect === null) {
          e.firstEffect = t.firstEffect;
        }
        if (t.lastEffect !== null) {
          if (e.lastEffect !== null) {
            e.lastEffect.nextEffect = t.firstEffect;
          }
          e.lastEffect = t.lastEffect;
        }
        if (t.flags > 1) {
          if (e.lastEffect !== null) {
            e.lastEffect.nextEffect = t;
          } else {
            e.firstEffect = t;
          }
          e.lastEffect = t;
        }
      }
    } else {
      if ((n = ui(t)) !== null) {
        n.flags &= 2047;
        Mi = n;
        return;
      }
      if (e !== null) {
        e.firstEffect = e.lastEffect = null;
        e.flags |= 2048;
      }
    }
    if ((t = t.sibling) !== null) {
      Mi = t;
      return;
    }
    Mi = t = e;
  } while (t !== null);
  if (Ai === 0) {
    Ai = 5;
  }
}
function Ou(e) {
  var t = Ha();
  qa(99, Tu.bind(null, e, t));
  return null;
}
function Tu(e, t) {
  do {
    Bu();
  } while (eu !== null);
  if ((Oi & 48) !== 0) {
    throw Error(l(327));
  }
  var n = e.finishedWork;
  if (n === null) {
    return null;
  }
  e.finishedWork = null;
  e.finishedLanes = 0;
  if (n === e.current) {
    throw Error(l(177));
  }
  e.callbackNode = null;
  var r = n.lanes | n.childLanes;
  var a = r;
  var o = e.pendingLanes & ~a;
  e.pendingLanes = a;
  e.suspendedLanes = 0;
  e.pingedLanes = 0;
  e.expiredLanes &= a;
  e.mutableReadLanes &= a;
  e.entangledLanes &= a;
  a = e.entanglements;
  var i = e.eventTimes;
  var u = e.expirationTimes;
  while (o > 0) {
    var c = 31 - Ht(o);
    var s = 1 << c;
    a[c] = 0;
    i[c] = -1;
    u[c] = -1;
    o &= ~s;
  }
  if (au !== null && (r & 24) === 0 && au.has(e)) {
    au.delete(e);
  }
  if (e === Ti) {
    Mi = Ti = null;
    Bi = 0;
  }
  if (n.flags > 1) {
    if (n.lastEffect !== null) {
      n.lastEffect.nextEffect = n;
      r = n.firstEffect;
    } else {
      r = n;
    }
  } else {
    r = n.firstEffect;
  }
  if (r !== null) {
    a = Oi;
    Oi |= 32;
    ji.current = null;
    Fr = $t;
    if (yr(i = mr())) {
      if ("selectionStart" in i) {
        u = {
          start: i.selectionStart,
          end: i.selectionEnd
        };
      } else {
        u = (u = i.ownerDocument) && u.defaultView || window;
        e: if ((s = u.getSelection && u.getSelection()) && s.rangeCount !== 0) {
          u = s.anchorNode;
          o = s.anchorOffset;
          c = s.focusNode;
          s = s.focusOffset;
          try {
            u.nodeType;
            c.nodeType;
          } catch (z) {
            u = null;
            break e;
          }
          var f = 0;
          var d = -1;
          var p = -1;
          var h = 0;
          var v = 0;
          var m = i;
          var y = null;
          t: while (true) {
            for (var g; m !== u || o !== 0 && m.nodeType !== 3 || (d = f + o), m !== c || s !== 0 && m.nodeType !== 3 || (p = f + s), m.nodeType === 3 && (f += m.nodeValue.length), (g = m.firstChild) !== null;) {
              y = m;
              m = g;
            }
            while (true) {
              if (m === i) {
                break t;
              }
              if (y === u && ++h === o) {
                d = f;
              }
              if (y === c && ++v === s) {
                p = f;
              }
              if ((g = m.nextSibling) !== null) {
                break;
              }
              y = (m = y).parentNode;
            }
            m = g;
          }
          u = d === -1 || p === -1 ? null : {
            start: d,
            end: p
          };
        } else {
          u = null;
        }
      }
      u = u || {
        start: 0,
        end: 0
      };
    } else {
      u = null;
    }
    Vr = {
      focusedElem: i,
      selectionRange: u
    };
    $t = false;
    su = null;
    fu = false;
    $i = r;
    do {
      try {
        Mu();
      } catch (z) {
        if ($i === null) {
          throw Error(l(330));
        }
        Iu($i, z);
        $i = $i.nextEffect;
      }
    } while ($i !== null);
    su = null;
    $i = r;
    do {
      try {
        for (i = e; $i !== null;) {
          var b = $i.flags;
          if (b & 16) {
            ge($i.stateNode, "");
          }
          if (b & 128) {
            var w = $i.alternate;
            if (w !== null) {
              var k = w.ref;
              if (k !== null) {
                if (typeof k === "function") {
                  k(null);
                } else {
                  k.current = null;
                }
              }
            }
          }
          switch (b & 1038) {
            case 2:
              xi($i);
              $i.flags &= -3;
              break;
            case 6:
              xi($i);
              $i.flags &= -3;
              zi($i.alternate, $i);
              break;
            case 1024:
              $i.flags &= -1025;
              break;
            case 1028:
              $i.flags &= -1025;
              zi($i.alternate, $i);
              break;
            case 4:
              zi($i.alternate, $i);
              break;
            case 8:
              Ei(i, u = $i);
              var x = u.alternate;
              wi(u);
              if (x !== null) {
                wi(x);
              }
          }
          $i = $i.nextEffect;
        }
      } catch (z) {
        if ($i === null) {
          throw Error(l(330));
        }
        Iu($i, z);
        $i = $i.nextEffect;
      }
    } while ($i !== null);
    k = Vr;
    w = mr();
    b = k.focusedElem;
    i = k.selectionRange;
    if (w !== b && b && b.ownerDocument && vr(b.ownerDocument.documentElement, b)) {
      if (i !== null && yr(b)) {
        w = i.start;
        if ((k = i.end) === undefined) {
          k = w;
        }
        if ("selectionStart" in b) {
          b.selectionStart = w;
          b.selectionEnd = Math.min(k, b.value.length);
        } else if ((k = (w = b.ownerDocument || document) && w.defaultView || window).getSelection) {
          k = k.getSelection();
          u = b.textContent.length;
          x = Math.min(i.start, u);
          i = i.end === undefined ? x : Math.min(i.end, u);
          if (!k.extend && x > i) {
            u = i;
            i = x;
            x = u;
          }
          u = hr(b, x);
          o = hr(b, i);
          if (u && o && (k.rangeCount !== 1 || k.anchorNode !== u.node || k.anchorOffset !== u.offset || k.focusNode !== o.node || k.focusOffset !== o.offset)) {
            (w = w.createRange()).setStart(u.node, u.offset);
            k.removeAllRanges();
            if (x > i) {
              k.addRange(w);
              k.extend(o.node, o.offset);
            } else {
              w.setEnd(o.node, o.offset);
              k.addRange(w);
            }
          }
        }
      }
      w = [];
      for (k = b; k = k.parentNode;) {
        if (k.nodeType === 1) {
          w.push({
            element: k,
            left: k.scrollLeft,
            top: k.scrollTop
          });
        }
      }
      if (typeof b.focus === "function") {
        b.focus();
      }
      b = 0;
      for (; b < w.length; b++) {
        (k = w[b]).element.scrollLeft = k.left;
        k.element.scrollTop = k.top;
      }
    }
    $t = !!Fr;
    Vr = Fr = null;
    e.current = n;
    $i = r;
    do {
      try {
        for (b = e; $i !== null;) {
          var C = $i.flags;
          if (C & 36) {
            yi(b, $i.alternate, $i);
          }
          if (C & 128) {
            w = undefined;
            var S = $i.ref;
            if (S !== null) {
              var E = $i.stateNode;
              $i.tag;
              w = E;
              if (typeof S === "function") {
                S(w);
              } else {
                S.current = w;
              }
            }
          }
          $i = $i.nextEffect;
        }
      } catch (z) {
        if ($i === null) {
          throw Error(l(330));
        }
        Iu($i, z);
        $i = $i.nextEffect;
      }
    } while ($i !== null);
    $i = null;
    Aa();
    Oi = a;
  } else {
    e.current = n;
  }
  if (Ji) {
    Ji = false;
    eu = e;
    tu = t;
  } else {
    for ($i = r; $i !== null;) {
      t = $i.nextEffect;
      $i.nextEffect = null;
      if ($i.flags & 8) {
        (C = $i).sibling = null;
        C.stateNode = null;
      }
      $i = t;
    }
  }
  if ((r = e.pendingLanes) === 0) {
    Xi = null;
  }
  if (r === 1) {
    if (e === lu) {
      ou++;
    } else {
      ou = 0;
      lu = e;
    }
  } else {
    ou = 0;
  }
  n = n.stateNode;
  if (Sa && typeof Sa.onCommitFiberRoot === "function") {
    try {
      Sa.onCommitFiberRoot(Ca, n, undefined, (n.current.flags & 64) === 64);
    } catch (z) {}
  }
  mu(e, Wa());
  if (Qi) {
    Qi = false;
    e = Gi;
    Gi = null;
    throw e;
  }
  if ((Oi & 8) === 0) {
    Ya();
  }
  return null;
}
function Mu() {
  while ($i !== null) {
    var e = $i.alternate;
    if (!fu && su !== null) {
      if (($i.flags & 8) !== 0) {
        if (et($i, su)) {
          fu = true;
        }
      } else if ($i.tag === 13 && _i(e, $i) && et($i, su)) {
        fu = true;
      }
    }
    var t = $i.flags;
    if ((t & 256) !== 0) {
      mi(e, $i);
    }
    if ((t & 512) !== 0 && !Ji) {
      Ji = true;
      Ka(97, function () {
        Bu();
        return null;
      });
    }
    $i = $i.nextEffect;
  }
}
function Bu() {
  if (tu !== 90) {
    var e = tu > 97 ? 97 : tu;
    tu = 90;
    return qa(e, Au);
  }
  return false;
}
function Du(e, t) {
  nu.push(t, e);
  if (!Ji) {
    Ji = true;
    Ka(97, function () {
      Bu();
      return null;
    });
  }
}
function Uu(e, t) {
  ru.push(t, e);
  if (!Ji) {
    Ji = true;
    Ka(97, function () {
      Bu();
      return null;
    });
  }
}
function Au() {
  if (eu === null) {
    return false;
  }
  var e = eu;
  eu = null;
  if ((Oi & 48) !== 0) {
    throw Error(l(331));
  }
  var t = Oi;
  Oi |= 32;
  var n = ru;
  ru = [];
  for (var r = 0; r < n.length; r += 2) {
    var a = n[r];
    var o = n[r + 1];
    var i = a.destroy;
    a.destroy = undefined;
    if (typeof i === "function") {
      try {
        i();
      } catch (c) {
        if (o === null) {
          throw Error(l(330));
        }
        Iu(o, c);
      }
    }
  }
  n = nu;
  nu = [];
  r = 0;
  for (; r < n.length; r += 2) {
    a = n[r];
    o = n[r + 1];
    try {
      var u = a.create;
      a.destroy = u();
    } catch (c) {
      if (o === null) {
        throw Error(l(330));
      }
      Iu(o, c);
    }
  }
  for (u = e.current.firstEffect; u !== null;) {
    e = u.nextEffect;
    u.nextEffect = null;
    if (u.flags & 8) {
      u.sibling = null;
      u.stateNode = null;
    }
    u = e;
  }
  Oi = t;
  Ya();
  return true;
}
function Ru(e, t, n) {
  fo(e, t = di(0, t = ci(n, t), 1));
  t = du();
  if ((e = vu(e, 1)) !== null) {
    Wt(e, 1, t);
    mu(e, t);
  }
}
function Iu(e, t) {
  if (e.tag === 3) {
    Ru(e, e, t);
  } else {
    for (var n = e.return; n !== null;) {
      if (n.tag === 3) {
        Ru(n, e, t);
        break;
      }
      if (n.tag === 1) {
        var r = n.stateNode;
        if (typeof n.type.getDerivedStateFromError === "function" || typeof r.componentDidCatch === "function" && (Xi === null || !Xi.has(r))) {
          var a = pi(n, e = ci(t, e), 1);
          fo(n, a);
          a = du();
          if ((n = vu(n, 1)) !== null) {
            Wt(n, 1, a);
            mu(n, a);
          } else if (typeof r.componentDidCatch === "function" && (Xi === null || !Xi.has(r))) {
            try {
              r.componentDidCatch(t, e);
            } catch (o) {}
          }
          break;
        }
      }
      n = n.return;
    }
  }
}
function Fu(e, t, n) {
  var r = e.pingCache;
  if (r !== null) {
    r.delete(t);
  }
  t = du();
  e.pingedLanes |= e.suspendedLanes & n;
  if (Ti === e && (Bi & n) === n) {
    if (Ai === 4 || Ai === 3 && (Bi & 62914560) === Bi && Wa() - Zi < 500) {
      Su(e, 0);
    } else {
      Wi |= n;
    }
  }
  mu(e, t);
}
function Vu(e, t) {
  var n = e.stateNode;
  if (n !== null) {
    n.delete(t);
  }
  if ((t = 0) === 0) {
    if (((t = e.mode) & 2) === 0) {
      t = 1;
    } else if ((t & 4) === 0) {
      t = Ha() === 99 ? 1 : 2;
    } else {
      if (uu === 0) {
        uu = Ii;
      }
      if ((t = Ft(~uu & 62914560)) === 0) {
        t = 4194304;
      }
    }
  }
  n = du();
  if ((e = vu(e, t)) !== null) {
    Wt(e, t, n);
    mu(e, n);
  }
}
function Wu(e, t, n, r) {
  this.tag = e;
  this.key = n;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = t;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = r;
  this.flags = 0;
  this.lastEffect = this.firstEffect = this.nextEffect = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Hu(e, t, n, r) {
  return new Wu(e, t, n, r);
}
function Zu(e) {
  return !!(e = e.prototype) && !!e.isReactComponent;
}
function qu(e, t) {
  var n = e.alternate;
  if (n === null) {
    (n = Hu(e.tag, t, e.key, e.mode)).elementType = e.elementType;
    n.type = e.type;
    n.stateNode = e.stateNode;
    n.alternate = e;
    e.alternate = n;
  } else {
    n.pendingProps = t;
    n.type = e.type;
    n.flags = 0;
    n.nextEffect = null;
    n.firstEffect = null;
    n.lastEffect = null;
  }
  n.childLanes = e.childLanes;
  n.lanes = e.lanes;
  n.child = e.child;
  n.memoizedProps = e.memoizedProps;
  n.memoizedState = e.memoizedState;
  n.updateQueue = e.updateQueue;
  t = e.dependencies;
  n.dependencies = t === null ? null : {
    lanes: t.lanes,
    firstContext: t.firstContext
  };
  n.sibling = e.sibling;
  n.index = e.index;
  n.ref = e.ref;
  return n;
}
function Ku(e, t, n, r, a, o) {
  var i = 2;
  r = e;
  if (typeof e === "function") {
    if (Zu(e)) {
      i = 1;
    }
  } else if (typeof e === "string") {
    i = 5;
  } else {
    e: switch (e) {
      case S:
        return Yu(n.children, a, o, t);
      case D:
        i = 8;
        a |= 16;
        break;
      case E:
        i = 8;
        a |= 1;
        break;
      case z:
        (e = Hu(12, n, t, a | 8)).elementType = z;
        e.type = z;
        e.lanes = o;
        return e;
      case N:
        (e = Hu(13, n, t, a)).type = N;
        e.elementType = N;
        e.lanes = o;
        return e;
      case j:
        (e = Hu(19, n, t, a)).elementType = j;
        e.lanes = o;
        return e;
      case U:
        return $u(n, a, o, t);
      case A:
        (e = Hu(24, n, t, a)).elementType = A;
        e.lanes = o;
        return e;
      default:
        if (typeof e === "object" && e !== null) {
          switch (e.$$typeof) {
            case L:
              i = 10;
              break e;
            case _:
              i = 9;
              break e;
            case P:
              i = 11;
              break e;
            case O:
              i = 14;
              break e;
            case T:
              i = 16;
              r = null;
              break e;
            case M:
              i = 22;
              break e;
          }
        }
        throw Error(l(130, e == null ? e : typeof e, ""));
    }
  }
  (t = Hu(i, n, t, a)).elementType = e;
  t.type = r;
  t.lanes = o;
  return t;
}
function Yu(e, t, n, r) {
  (e = Hu(7, e, r, t)).lanes = n;
  return e;
}
function $u(e, t, n, r) {
  (e = Hu(23, e, r, t)).elementType = U;
  e.lanes = n;
  return e;
}
function Qu(e, t, n) {
  (e = Hu(6, e, null, t)).lanes = n;
  return e;
}
function Gu(e, t, n) {
  (t = Hu(4, e.children !== null ? e.children : [], e.key, t)).lanes = n;
  t.stateNode = {
    containerInfo: e.containerInfo,
    pendingChildren: null,
    implementation: e.implementation
  };
  return t;
}
function Xu(e, t, n) {
  this.tag = t;
  this.containerInfo = e;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.pendingContext = this.context = null;
  this.hydrate = n;
  this.callbackNode = null;
  this.callbackPriority = 0;
  this.eventTimes = Vt(0);
  this.expirationTimes = Vt(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = Vt(0);
  this.mutableSourceEagerHydrationData = null;
}
function Ju(e, t, n, r = null) {
  return {
    $$typeof: C,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n
  };
}
function ec(e, t, n, r) {
  var a = t.current;
  var o = du();
  var i = pu(a);
  e: if (n) {
    t: {
      if (Qe(n = n._reactInternals) !== n || n.tag !== 1) {
        throw Error(l(170));
      }
      var u = n;
      do {
        switch (u.tag) {
          case 3:
            u = u.stateNode.context;
            break t;
          case 1:
            if (ya(u.type)) {
              u = u.stateNode.__reactInternalMemoizedMergedChildContext;
              break t;
            }
        }
        u = u.return;
      } while (u !== null);
      throw Error(l(171));
    }
    if (n.tag === 1) {
      var c = n.type;
      if (ya(c)) {
        n = wa(n, c, u);
        break e;
      }
    }
    n = u;
  } else {
    n = da;
  }
  if (t.context === null) {
    t.context = n;
  } else {
    t.pendingContext = n;
  }
  (t = so(o, i)).payload = {
    element: e
  };
  if ((r = r === undefined ? null : r) !== null) {
    t.callback = r;
  }
  fo(a, t);
  hu(a, i, o);
  return i;
}
function tc(e) {
  if ((e = e.current).child) {
    e.child.tag;
    return e.child.stateNode;
  } else {
    return null;
  }
}
function nc(e, t) {
  if ((e = e.memoizedState) !== null && e.dehydrated !== null) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function rc(e, t) {
  nc(e, t);
  if (e = e.alternate) {
    nc(e, t);
  }
}
function ac(e, t, n) {
  var r = n != null && n.hydrationOptions != null && n.hydrationOptions.mutableSources || null;
  n = new Xu(e, t, n != null && n.hydrate === true);
  t = Hu(3, null, null, t === 2 ? 7 : t === 1 ? 3 : 0);
  n.current = t;
  t.stateNode = n;
  uo(t);
  e[ea] = n.current;
  Or(e.nodeType === 8 ? e.parentNode : e);
  if (r) {
    for (e = 0; e < r.length; e++) {
      var a = (t = r[e])._getVersion;
      a = a(t._source);
      if (n.mutableSourceEagerHydrationData == null) {
        n.mutableSourceEagerHydrationData = [t, a];
      } else {
        n.mutableSourceEagerHydrationData.push(t, a);
      }
    }
  }
  this._internalRoot = n;
}
function oc(e) {
  return !!e && (e.nodeType === 1 || e.nodeType === 9 || e.nodeType === 11 || e.nodeType === 8 && e.nodeValue === " react-mount-point-unstable ");
}
function lc(e, t, n, r, a) {
  var o = n._reactRootContainer;
  if (o) {
    var l = o._internalRoot;
    if (typeof a === "function") {
      var i = a;
      a = function () {
        var e = tc(l);
        i.call(e);
      };
    }
    ec(t, l, e, a);
  } else {
    o = n._reactRootContainer = function (e, t) {
      t ||= !!(t = e ? e.nodeType === 9 ? e.documentElement : e.firstChild : null) && t.nodeType === 1 && !!t.hasAttribute("data-reactroot");
      if (!t) {
        for (var n; n = e.lastChild;) {
          e.removeChild(n);
        }
      }
      return new ac(e, 0, t ? {
        hydrate: true
      } : undefined);
    }(n, r);
    l = o._internalRoot;
    if (typeof a === "function") {
      var u = a;
      a = function () {
        var e = tc(l);
        u.call(e);
      };
    }
    ku(function () {
      ec(t, l, e, a);
    });
  }
  return tc(l);
}
function ic(e, t, n = null) {
  if (!oc(t)) {
    throw Error(l(200));
  }
  return Ju(e, t, null, n);
}
Yi = function (e, t, n) {
  var r = t.lanes;
  if (e !== null) {
    if (e.memoizedProps !== t.pendingProps || ha.current) {
      Ul = true;
    } else {
      if ((n & r) === 0) {
        Ul = false;
        switch (t.tag) {
          case 3:
            Kl(t);
            Yo();
            break;
          case 5:
            Do(t);
            break;
          case 1:
            if (ya(t.type)) {
              ka(t);
            }
            break;
          case 4:
            Mo(t, t.stateNode.containerInfo);
            break;
          case 10:
            r = t.memoizedProps.value;
            var a = t.type._context;
            fa(Xa, a._currentValue);
            a._currentValue = r;
            break;
          case 13:
            if (t.memoizedState !== null) {
              if ((n & t.child.childLanes) !== 0) {
                return Xl(e, t, n);
              } else {
                fa(Ao, Ao.current & 1);
                if ((t = oi(e, t, n)) !== null) {
                  return t.sibling;
                } else {
                  return null;
                }
              }
            }
            fa(Ao, Ao.current & 1);
            break;
          case 19:
            r = (n & t.childLanes) !== 0;
            if ((e.flags & 64) !== 0) {
              if (r) {
                return ai(e, t, n);
              }
              t.flags |= 64;
            }
            if ((a = t.memoizedState) !== null) {
              a.rendering = null;
              a.tail = null;
              a.lastEffect = null;
            }
            fa(Ao, Ao.current);
            if (r) {
              break;
            }
            return null;
          case 23:
          case 24:
            t.lanes = 0;
            return Vl(e, t, n);
        }
        return oi(e, t, n);
      }
      Ul = (e.flags & 16384) !== 0;
    }
  } else {
    Ul = false;
  }
  t.lanes = 0;
  switch (t.tag) {
    case 2:
      r = t.type;
      if (e !== null) {
        e.alternate = null;
        t.alternate = null;
        t.flags |= 2;
      }
      e = t.pendingProps;
      a = ma(t, pa.current);
      oo(t, n);
      a = il(null, t, r, e, a, n);
      t.flags |= 1;
      if (typeof a === "object" && a !== null && typeof a.render === "function" && a.$$typeof === undefined) {
        t.tag = 1;
        t.memoizedState = null;
        t.updateQueue = null;
        if (ya(r)) {
          var o = true;
          ka(t);
        } else {
          o = false;
        }
        t.memoizedState = a.state ?? null;
        uo(t);
        var i = r.getDerivedStateFromProps;
        if (typeof i === "function") {
          yo(t, r, i, e);
        }
        a.updater = go;
        t.stateNode = a;
        a._reactInternals = t;
        xo(t, r, e, n);
        t = ql(null, t, r, true, o, n);
      } else {
        t.tag = 0;
        Al(null, t, a, n);
        t = t.child;
      }
      return t;
    case 16:
      a = t.elementType;
      e: {
        if (e !== null) {
          e.alternate = null;
          t.alternate = null;
          t.flags |= 2;
        }
        e = t.pendingProps;
        a = (o = a._init)(a._payload);
        t.type = a;
        o = t.tag = function (e) {
          if (typeof e === "function") {
            if (Zu(e)) {
              return 1;
            } else {
              return 0;
            }
          }
          if (e !== undefined && e !== null) {
            if ((e = e.$$typeof) === P) {
              return 11;
            }
            if (e === O) {
              return 14;
            }
          }
          return 2;
        }(a);
        e = Ga(a, e);
        switch (o) {
          case 0:
            t = Hl(null, t, a, e, n);
            break e;
          case 1:
            t = Zl(null, t, a, e, n);
            break e;
          case 11:
            t = Rl(null, t, a, e, n);
            break e;
          case 14:
            t = Il(null, t, a, Ga(a.type, e), r, n);
            break e;
        }
        throw Error(l(306, a, ""));
      }
      return t;
    case 0:
      r = t.type;
      a = t.pendingProps;
      return Hl(e, t, r, a = t.elementType === r ? a : Ga(r, a), n);
    case 1:
      r = t.type;
      a = t.pendingProps;
      return Zl(e, t, r, a = t.elementType === r ? a : Ga(r, a), n);
    case 3:
      Kl(t);
      r = t.updateQueue;
      if (e === null || r === null) {
        throw Error(l(282));
      }
      r = t.pendingProps;
      a = (a = t.memoizedState) !== null ? a.element : null;
      co(e, t);
      ho(t, r, null, n);
      if ((r = t.memoizedState.element) === a) {
        Yo();
        t = oi(e, t, n);
      } else {
        if (o = (a = t.stateNode).hydrate) {
          Fo = Yr(t.stateNode.containerInfo.firstChild);
          Io = t;
          o = Vo = true;
        }
        if (o) {
          if ((e = a.mutableSourceEagerHydrationData) != null) {
            for (a = 0; a < e.length; a += 2) {
              (o = e[a])._workInProgressVersionPrimary = e[a + 1];
              $o.push(o);
            }
          }
          n = _o(t, null, r, n);
          t.child = n;
          while (n) {
            n.flags = n.flags & -3 | 1024;
            n = n.sibling;
          }
        } else {
          Al(e, t, r, n);
          Yo();
        }
        t = t.child;
      }
      return t;
    case 5:
      Do(t);
      if (e === null) {
        Zo(t);
      }
      r = t.type;
      a = t.pendingProps;
      o = e !== null ? e.memoizedProps : null;
      i = a.children;
      if (Hr(r, a)) {
        i = null;
      } else if (o !== null && Hr(r, o)) {
        t.flags |= 16;
      }
      Wl(e, t);
      Al(e, t, i, n);
      return t.child;
    case 6:
      if (e === null) {
        Zo(t);
      }
      return null;
    case 13:
      return Xl(e, t, n);
    case 4:
      Mo(t, t.stateNode.containerInfo);
      r = t.pendingProps;
      if (e === null) {
        t.child = Lo(t, null, r, n);
      } else {
        Al(e, t, r, n);
      }
      return t.child;
    case 11:
      r = t.type;
      a = t.pendingProps;
      return Rl(e, t, r, a = t.elementType === r ? a : Ga(r, a), n);
    case 7:
      Al(e, t, t.pendingProps, n);
      return t.child;
    case 8:
    case 12:
      Al(e, t, t.pendingProps.children, n);
      return t.child;
    case 10:
      e: {
        r = t.type._context;
        a = t.pendingProps;
        i = t.memoizedProps;
        o = a.value;
        var u = t.type._context;
        fa(Xa, u._currentValue);
        u._currentValue = o;
        if (i !== null) {
          u = i.value;
          if ((o = sr(u, o) ? 0 : (typeof r._calculateChangedBits === "function" ? r._calculateChangedBits(u, o) : 1073741823) | 0) === 0) {
            if (i.children === a.children && !ha.current) {
              t = oi(e, t, n);
              break e;
            }
          } else {
            for ((u = t.child) !== null && (u.return = t); u !== null;) {
              var c = u.dependencies;
              if (c !== null) {
                i = u.child;
                for (var s = c.firstContext; s !== null;) {
                  if (s.context === r && (s.observedBits & o) !== 0) {
                    if (u.tag === 1) {
                      (s = so(-1, n & -n)).tag = 2;
                      fo(u, s);
                    }
                    u.lanes |= n;
                    if ((s = u.alternate) !== null) {
                      s.lanes |= n;
                    }
                    ao(u.return, n);
                    c.lanes |= n;
                    break;
                  }
                  s = s.next;
                }
              } else {
                i = u.tag === 10 && u.type === t.type ? null : u.child;
              }
              if (i !== null) {
                i.return = u;
              } else {
                for (i = u; i !== null;) {
                  if (i === t) {
                    i = null;
                    break;
                  }
                  if ((u = i.sibling) !== null) {
                    u.return = i.return;
                    i = u;
                    break;
                  }
                  i = i.return;
                }
              }
              u = i;
            }
          }
        }
        Al(e, t, a.children, n);
        t = t.child;
      }
      return t;
    case 9:
      a = t.type;
      r = (o = t.pendingProps).children;
      oo(t, n);
      r = r(a = lo(a, o.unstable_observedBits));
      t.flags |= 1;
      Al(e, t, r, n);
      return t.child;
    case 14:
      o = Ga(a = t.type, t.pendingProps);
      return Il(e, t, a, o = Ga(a.type, o), r, n);
    case 15:
      return Fl(e, t, t.type, t.pendingProps, r, n);
    case 17:
      r = t.type;
      a = t.pendingProps;
      a = t.elementType === r ? a : Ga(r, a);
      if (e !== null) {
        e.alternate = null;
        t.alternate = null;
        t.flags |= 2;
      }
      t.tag = 1;
      if (ya(r)) {
        e = true;
        ka(t);
      } else {
        e = false;
      }
      oo(t, n);
      wo(t, r, a);
      xo(t, r, a, n);
      return ql(null, t, r, true, e, n);
    case 19:
      return ai(e, t, n);
    case 23:
    case 24:
      return Vl(e, t, n);
  }
  throw Error(l(156, t.tag));
};
ac.prototype.render = function (e) {
  ec(e, this._internalRoot, null, null);
};
ac.prototype.unmount = function () {
  var e = this._internalRoot;
  var t = e.containerInfo;
  ec(null, e, null, function () {
    t[ea] = null;
  });
};
tt = function (e) {
  if (e.tag === 13) {
    hu(e, 4, du());
    rc(e, 4);
  }
};
nt = function (e) {
  if (e.tag === 13) {
    hu(e, 67108864, du());
    rc(e, 67108864);
  }
};
rt = function (e) {
  if (e.tag === 13) {
    var t = du();
    var n = pu(e);
    hu(e, n, t);
    rc(e, n);
  }
};
at = function (e, t) {
  return t();
};
Le = function (e, t, n) {
  switch (t) {
    case "input":
      ne(e, n);
      t = n.name;
      if (n.type === "radio" && t != null) {
        for (n = e; n.parentNode;) {
          n = n.parentNode;
        }
        n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + "][type=\"radio\"]");
        t = 0;
        for (; t < n.length; t++) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var a = oa(r);
            if (!a) {
              throw Error(l(90));
            }
            G(r);
            ne(r, a);
          }
        }
      }
      break;
    case "textarea":
      ce(e, n);
      break;
    case "select":
      if ((t = n.value) != null) {
        le(e, !!n.multiple, t, false);
      }
  }
};
Te = wu;
Me = function (e, t, n, r, a) {
  var o = Oi;
  Oi |= 4;
  try {
    return qa(98, e.bind(null, t, n, r, a));
  } finally {
    if ((Oi = o) === 0) {
      Ki();
      Ya();
    }
  }
};
Be = function () {
  if ((Oi & 49) === 0) {
    (function () {
      if (au !== null) {
        var e = au;
        au = null;
        e.forEach(function (e) {
          e.expiredLanes |= e.pendingLanes & 24;
          mu(e, Wa());
        });
      }
      Ya();
    })();
    Bu();
  }
};
De = function (e, t) {
  var n = Oi;
  Oi |= 2;
  try {
    return e(t);
  } finally {
    if ((Oi = n) === 0) {
      Ki();
      Ya();
    }
  }
};
var uc = {
  Events: [ra, aa, oa, je, Oe, Bu, {
    current: false
  }]
};
var cc = {
  findFiberByHostInstance: na,
  bundleType: 0,
  version: "17.0.2",
  rendererPackageName: "react-dom"
};
var sc = {
  bundleType: cc.bundleType,
  version: cc.version,
  rendererPackageName: cc.rendererPackageName,
  rendererConfig: cc.rendererConfig,
  overrideHookState: null,
  overrideHookStateDeletePath: null,
  overrideHookStateRenamePath: null,
  overrideProps: null,
  overridePropsDeletePath: null,
  overridePropsRenamePath: null,
  setSuspenseHandler: null,
  scheduleUpdate: null,
  currentDispatcherRef: k.ReactCurrentDispatcher,
  findHostInstanceByFiber: function (e) {
    if ((e = Je(e)) === null) {
      return null;
    } else {
      return e.stateNode;
    }
  },
  findFiberByHostInstance: cc.findFiberByHostInstance || function () {
    return null;
  },
  findHostInstancesForRefresh: null,
  scheduleRefresh: null,
  scheduleRoot: null,
  setRefreshHandler: null,
  getCurrentFiber: null
};
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined") {
  var fc = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!fc.isDisabled && fc.supportsFiber) {
    try {
      Ca = fc.inject(sc);
      Sa = fc;
    } catch (me) {}
  }
}
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = uc;
exports.createPortal = ic;
exports.findDOMNode = function (e) {
  if (e == null) {
    return null;
  }
  if (e.nodeType === 1) {
    return e;
  }
  var t = e._reactInternals;
  if (t === undefined) {
    if (typeof e.render === "function") {
      throw Error(l(188));
    }
    throw Error(l(268, Object.keys(e)));
  }
  return e = (e = Je(t)) === null ? null : e.stateNode;
};
exports.flushSync = function (e, t) {
  var n = Oi;
  if ((n & 48) !== 0) {
    return e(t);
  }
  Oi |= 1;
  try {
    if (e) {
      return qa(99, e.bind(null, t));
    }
  } finally {
    Oi = n;
    Ya();
  }
};
exports.hydrate = function (e, t, n) {
  if (!oc(t)) {
    throw Error(l(200));
  }
  return lc(null, e, t, true, n);
};
exports.render = function (e, t, n) {
  if (!oc(t)) {
    throw Error(l(200));
  }
  return lc(null, e, t, false, n);
};
exports.unmountComponentAtNode = function (e) {
  if (!oc(e)) {
    throw Error(l(40));
  }
  return !!e._reactRootContainer && (ku(function () {
    lc(null, null, e, false, function () {
      e._reactRootContainer = null;
      e[ea] = null;
    });
  }), true);
};
exports.unstable_batchedUpdates = wu;
exports.unstable_createPortal = function (e, t) {
  return ic(e, t, arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null);
};
exports.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!oc(n)) {
    throw Error(l(200));
  }
  if (e == null || e._reactInternals === undefined) {
    throw Error(l(38));
  }
  return lc(e, t, n, false, r);
};
exports.version = "17.0.2";