require.d(exports, {
  default: function () {
    return w;
  }
});
import * as i from /*webcrack:missing*/"./671.js";
import * as t from /*webcrack:missing*/"./144.js";
import * as h from /*webcrack:missing*/"./340.js";
import * as g from /*webcrack:missing*/"./505.js";
import * as s from /*webcrack:missing*/"./791.js";
import * as B from /*webcrack:missing*/"./426.js";
var v = B;
import * as c from /*webcrack:missing*/"./337.js";
import * as a from /*webcrack:missing*/"./734.js";
import * as l from /*webcrack:missing*/"./164.js";
import * as j from /*webcrack:missing*/"./184.js";
var w = function (r) {
  (0, h.Z)(B, r);
  var e = (0, g.Z)(B);
  function B() {
    var r;
    (0, i.Z)(this, B);
    for (var t = arguments.length, h = new Array(t), g = 0; g < t; g++) {
      h[g] = arguments[g];
    }
    (r = e.call.apply(e, [this].concat(h))).container = (0, s.createRef)();
    return r;
  }
  (0, t.Z)(B, [{
    key: "componentDidMount",
    value: function () {
      var r;
      r = v.env.NODE_ENV === "development" ? "http://127.0.0.1:5000/build/bookmark.js" : "https://cdn.jsdelivr.net/gh/sysce/query/dist/query.js";
      var i = `<!DOCTYPE HTML><html><head><title>about:blank</title><meta charset='utf-8' /></head><body><script src=${JSON.stringify(r)}></script></body></html>`;
      this.file = URL.createObjectURL(new Blob([i], {
        type: "text/html"
      }));
      var t = document.createElement("a");
      t.style.color = "red";
      t.href = this.file;
      t.download = "Insta-Proxy.html";
      (0, l.render)((0, c.Z)(<j.Fragment>Download Insta-Proxy</j.Fragment>), t);
      this.container.current.append(t);
    }
  }, {
    key: "componentWillUnmount",
    value: function () {
      URL.revokeObjectURL(this.file);
    }
  }, {
    key: "render",
    value: function () {
      a.ZP.dataset.page = "bookmark";
      return <main><h1>{(0, c.Z)(<j.Fragment>Insta-Proxy</j.Fragment>)}</h1><hr /><h2>What is {(0, c.Z)(<j.Fragment>Insta-Proxy</j.Fragment>)}?</h2><p>{(0, c.Z)(<j.Fragment>Insta-Proxy</j.Fragment>)} is a new script that allows you to open an {(0, c.Z)(<j.Fragment>unblocked proxy</j.Fragment>)} when needed.</p><h2>How to install {(0, c.Z)(<j.Fragment>Insta-Proxy</j.Fragment>)}:</h2><p>To install {(0, c.Z)(<j.Fragment>Insta-Proxy Addon</j.Fragment>)}, simply download the file below: <br /><span ref={this.container} /></p><h2>How to use {(0, c.Z)(<j.Fragment>Insta-Proxy</j.Fragment>)}:</h2><ol><li>Open your Files app</li><li>Find your Downloads folder</li><li>Look for {(0, c.Z)(<j.Fragment>Insta-Proxy.html</j.Fragment>)} (If you can't find {(0, c.Z)(<j.Fragment>Insta-Proxy.html</j.Fragment>)}, download it from above)</li><li>Open {(0, c.Z)(<j.Fragment>Insta-Proxy.html</j.Fragment>)} in your web browser.</li></ol><p>Once you have completed all the steps, you will be on {(0, c.Z)(<j.Fragment>Insta-Proxy</j.Fragment>)}.</p></main>;
    }
  }]);
  return B;
}(s.Component);