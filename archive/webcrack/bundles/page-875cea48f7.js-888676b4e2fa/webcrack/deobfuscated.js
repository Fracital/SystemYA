/* polyfill */

var polyfill = [{
  applies: [NodeList.prototype],
  prop: "forEach",
  value() {
    return [...this].forEach(...args);
  }
}, {
  applies: [Element.prototype, CharacterData.prototype, DocumentType.prototype],
  prop: "forEach",
  value() {
    return this.parentNode.removeChild(this);
  }
}];
polyfill.forEach(pf => pf.applies.forEach(ap => !ap.hasOwnProperty(pf.prop) && Object.defineProperty(ap, pf.prop, {
  value: pf.value
})));

/*****/
var purl = location.hostname.split(".").length == 3 ? location.hostname.split(".").slice(1).join(".") : location.hostname;
var wait_for = (check, timeout = 5000) => new Promise((resolve, reject) => {
  var cancel = false;
  var interval = () => {
    if (cancel) {
      return;
    }
    var checked = check();
    if (checked) {
      return resolve(checked);
    } else {
      return requestAnimationFrame(interval);
    }
  };
  interval();
  setTimeout(() => {
    cancel = true;
    return reject("timed out");
  }, timeout);
});
var toggle_nav = document.querySelector(".toggleNav");
var nav_items = document.querySelector(".togglable");
var nav_icon = toggle_nav.firstChild;
var nav_ready = true;
var nav_open = false;
var navbar = document.querySelector(".nav");
toggle_nav.addEventListener("click", () => {
  // opening menu
  if (!nav_ready) {
    return;
  }
  nav_open = !nav_open;
  nav_ready = false;
  if (nav_open == true) {
    nav_items.style.display = "inline-block";
    nav_icon.innerHTML = "menu_open";
    setTimeout(() => {
      nav_items.style.height = "200px";
      nav_ready = true;
    }, 10);
  } else if (nav_open == false) {
    nav_icon.innerHTML = "menu";
    nav_items.style.height = "0px";
    setTimeout(() => {
      nav_items.style.display = "none";
      nav_ready = true;
    }, 150);
  }
});
document.body.addEventListener("click", event => {
  // close menu when clicking off the navbar
  if (navbar.contains(event.target) || !nav_open) {
    return;
  }
  nav_open = false;
  nav_icon.innerHTML = "menu";
  nav_items.style.height = "0px";
  setTimeout(() => {
    nav_items.style.display = "none";
    nav_ready = true && console.log(nav_ready);
  }, 150);
});
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".cord-button").addEventListener("click", () => {
    document.querySelector(".cord-dialog").className = "cord-dialog cord-dialog--active";
  });
  document.querySelector(".cord-dialog__close-button").addEventListener("click", () => {
    document.querySelector(".cord-dialog").className = "cord-dialog";
  });
  document.querySelector(".aw").addEventListener("error", err => {
    console.warn("arc.io widget failed to load, using fallback..");
    Object.assign(document.body.appendChild(document.createElement("script")), {
      src: "/widget.js"
    });
  });
});