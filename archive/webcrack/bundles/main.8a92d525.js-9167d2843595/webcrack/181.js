require.d(exports, {
  Z: function () {
    return a;
  }
});
var r = require("./907.js");
function a(e, t) {
  if (e) {
    if (typeof e === "string") {
      return (0, r.Z)(e, t);
    }
    var n = Object.prototype.toString.call(e).slice(8, -1);
    if (n === "Object" && e.constructor) {
      n = e.constructor.name;
    }
    if (n === "Map" || n === "Set") {
      return Array.from(e);
    } else if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
      return (0, r.Z)(e, t);
    } else {
      return undefined;
    }
  }
}