require.d(exports, {
  default: function () {
    return d;
  }
});
import * as t from /*webcrack:missing*/"./762.js";
import * as i from /*webcrack:missing*/"./671.js";
import * as a from /*webcrack:missing*/"./144.js";
import * as s from /*webcrack:missing*/"./340.js";
import * as h from /*webcrack:missing*/"./505.js";
import * as c from /*webcrack:missing*/"./734.js";
import * as u from /*webcrack:missing*/"./337.js";
import * as f from /*webcrack:missing*/"./791.js";
import * as g from /*webcrack:missing*/"./871.js";
import * as v from /*webcrack:missing*/"./504.js";
import * as x from /*webcrack:missing*/"./184.js";
var B = [{
  q: <x.Fragment>My page won't load.</x.Fragment>,
  a: <x.Fragment>Your page may be incompatible with our {(0, u.Z)(<x.Fragment>proxy</x.Fragment>)}. Give the website at most 1 minute to load.</x.Fragment>
}, {
  q: <x.Fragment>Can I host my own {(0, u.Z)(<x.Fragment>proxy</x.Fragment>)}?</x.Fragment>,
  a: <x.Fragment>Yes. Our {(0, u.Z)(<x.Fragment>proxy</x.Fragment>)} scripts are open source. See on <a href="https://github.com/sysce">GitHub</a>.</x.Fragment>
}, {
  q: <x.Fragment>Is my information on the {(0, u.Z)(<x.Fragment>proxy</x.Fragment>)} secure?</x.Fragment>,
  a: <x.Fragment>We do not collect any data, your information is only as secure as the sites you are visiting on them. For privacy concerns, you can review our <v.rU to="/privacy">Privacy Policy</v.rU>.</x.Fragment>
}];
function D() {
  var r = ["BgvUz3rO", "y2fSBa", "yxbWBhK", "y29Uy2f0", "BwfPBG", "Aw5WDxq", "C3rHDgu", "B25FAw5WDxq", "C2v0u3rHDgu", "DgfYz2v0", "DMfSDwu", "y2HPBgrYzw5FDgv4Da", "ChjVChm", "y2HPBgrYzw4", "C3rYAw5N", "AxnbCNjHEq", "zg9Uzq", "CMvUzgvY", "zgf0yxnLDa", "CgfNzq", "C3vWCg9YDa", "Dg9mB3DLCKnHC2u", "Aw5JBhvKzxm", "C2vHCMnO", "zgLZCgXHEq", "BM9Uzq", "ChvZAa", "C2vJDgLVBG", "zM9YBq", "yMfUBMvY", "ChjLDMvUDerLzMf1Bhq", "u3LZDgvTwue", "ieTUB3DSzwrNzwjHC2u", "zgL2", "C3bHBG", "AwnVBG", "yMfY", "Dgv4Da", "u2vHCMnO", "yMLUza", "BM90zq", "tM90ihDOyxqGEw91j3jLigXVB2TPBMCGzM9YpW", "l2nVBNrHy3qUAhrTBa", "q29UDgfJDcbvCW"];
  return (D = function () {
    return r;
  })();
}
function y(r, n) {
  var e = D();
  y = function (n, t) {
    var i = e[n -= 0];
    if (y.QBpQRG === undefined) {
      function a(r) {
        for (var n, e, t = "", i = "", a = 0, s = 0; e = r.charAt(s++); ~e && (n = a % 4 ? n * 64 + e : e, a++ % 4) ? t += String.fromCharCode(n >> (a * -2 & 6) & 255) : 0) {
          e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=".indexOf(e);
        }
        for (var h = 0, c = t.length; h < c; h++) {
          i += "%" + ("00" + t.charCodeAt(h).toString(16)).slice(-2);
        }
        return decodeURIComponent(i);
      }
      y.hxpeox = a;
      r = arguments;
      y.QBpQRG = true;
    }
    var s = e[0];
    var h = n + s;
    var c = r[h];
    if (c) {
      i = c;
    } else {
      i = y.hxpeox(i);
      r[h] = i;
    }
    return i;
  };
  return y(r, n);
}
var d = function (r) {
  var n = y;
  (0, s.Z)(l, r);
  var e = (0, h.Z)(l);
  function l() {
    var r;
    var n = y;
    (0, i.Z)(this, l);
    for (var t = arguments[n(0)], a = new Array(t), s = 0; s < t; s++) {
      a[s] = arguments[s];
    }
    (r = e[n(1)][n(2)](e, [this][n(3)](a)))[n(4)] = (0, f.createRef)();
    r[n(5)] = (0, f.createRef)();
    r[n(6)] = {
      search: ""
    };
    return r;
  }
  (0, a.Z)(l, [{
    key: n(7),
    value: function (r) {
      var e = n;
      this[e(8)]({
        search: r[e(9)][e(10)]
      });
    }
  }, {
    key: n(11),
    value: function (r) {
      var e = n;
      var i = r[e(12)][e(13)];
      if (typeof i === e(14)) {
        return i;
      }
      if (Array[e(15)](i)) {
        var a;
        var s = "";
        var h = (0, t.Z)(i);
        try {
          for (h.s(); !(a = h.n())[e(16)];) {
            var c = a[e(10)];
            if (typeof c === e(14)) {
              s += c;
            } else {
              s += this[e(11)](c);
            }
          }
        } catch (u) {
          h.e(u);
        } finally {
          h.f();
        }
        return s;
      }
      return " ";
    }
  }, {
    key: n(17),
    value: function () {
      var r = n;
      c.ZP[r(18)][r(19)] = r(20);
      var e = [];
      for (var t = 0; t < B[r(0)]; t++) {
        var i = B[t];
        var a = i.q;
        var s = i.a;
        var h = {};
        if (!this[r(11)](a)[r(21)]()[r(22)](this[r(6)][r(23)][r(21)]())) {
          h[r(24)] = r(25);
        }
        const Component = r(27);
        e[r(26)](<Component style={h} key={t}><h1>{a}</h1><p>{s}</p></Component>);
      }
      const Component2 = r(34);
      const Component3 = r(5);
      const Component4 = r(33);
      const Component5 = r(28);
      const Component6 = r(4);
      return <x.Fragment><Component5 className={r(29)} onSubmit={function (n) {
          return n[r(30)]();
        }}><h1>{(0, u.Z)(<x.Fragment>{r(31)}</x.Fragment>)}{r(32)}</h1><Component4 className={r(23)}><Component2 className={r(35)}><g.r /></Component2><Component3 className={r(36)} type={r(37)} placeholder={r(38)} onInput={this[r(7)][r(39)](this)} /></Component4></Component5><Component6 ref={this[r(4)]}>{e}<p className={r(40)}>{r(41)} <v.rU to={r(42)}>{r(43)}</v.rU>.</p></Component6></x.Fragment>;
    }
  }]);
  return l;
}(f.Component);