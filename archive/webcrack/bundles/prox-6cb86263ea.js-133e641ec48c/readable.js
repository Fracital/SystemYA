var host = location.hostname.split(".");
var purl = location.hostname;
if (host.length == 3) {
  purl = `${host[1]}.${host[2]}`;
}
var cookie = document.getElementsByClassName("cookie")[0];
var ifr = document.getElementById("ifr");
cookie.addEventListener("click", () => {
  document.getElementById("ifr").style.display = "none";
  document.getElementById("ifr").setAttribute("src", "about:blank");
  cookie.style.display = "none";
});
function visit(type) {
  var URL = document.getElementsByName("cdURL")[0].value;
  if (URL != "") {
    document.cookie = "oldsmobile=owo; max-age=259200; sameSite=lax; domain=" + purl + "; path=/; secure;";
    cookie.style.display = "block";
    ifr.style.display = "block";
    if (type === "VI") {
      cookie.setAttribute("style", "background-image:url(\"/assets/src/VIA.png\"); display:block;");
      ifr.setAttribute("src", `https://c.${purl}/${URL}`);
    } else if (type === "PP") {
      cookie.setAttribute("style", "background-image:url(\"/assets/src/PP.png\"); display:block;");
      ifr.setAttribute("src", `/?"=${URL}`);
    } else if (type === "NU") {
      cookie.setAttribute("style", "background-image:url(\"/assets/src/NU.png\"); display:block;");
      ifr.setAttribute("src", `/;/${URL}`);
    } else if (type === "NC") {
      cookie.setAttribute("style", "background-image:url(\"/assets/src/NC.png\"); display:block;");
      ifr.setAttribute("src", `https://cdn.${purl}/`);
      document.cookie = `urlthingy=${URL}; domain=.${purl}; path=/`;
    }
  }
}
function rec(url, work, desc) {
  var sug = document.createElement("div");
  var a = document.createElement("span");
  document.getElementById("sugging").appendChild(sug);
  sug.appendChild(a);
  sug.setAttribute("id", "sug");
  a.setAttribute("class", "brug");
  a.innerHTML = url;
  a.innerHTML = url;
  a.setAttribute("onclick", "document.getElementsByName('cdURL')[0].value=this.innerHTML");
  work.forEach((e, i, a) => {
    var badge = document.createElement("span");
    sug.appendChild(badge);
    badge.innerHTML = e;
    if (e == "CD") {
      badge.setAttribute("class", "badge bge-blu");
    }
    if (e == "PD") {
      badge.setAttribute("class", "badge bge-blu");
    }
    if (e == "NC") {
      badge.setAttribute("class", "badge bge-grn");
    }
    if (e == "NU") {
      badge.setAttribute("class", "badge bge-red");
    }
    if (e == "PP") {
      badge.setAttribute("class", "badge bge-org");
    }
  });
  if (typeof desc != "undefined") {
    sug.innerHTML += " | " + desc;
  }
}
rec("invidio.us", ["PD", "NC", "PP", "NU"], "YouTube Videos");
rec("google.com", ["PD", "NC", "PP", "NU"], "Google");
rec("justbuild.lol", ["PD", "NC", "PP", "NU"]);
rec("mrdoob.com", ["PD", "NC", "NU"]);
rec("1v1.lol", ["PD", "NC", "NU"]);
rec("youtube.com", ["PD", "PP"], "YouTube");
;
rec("discord.com", ["PD"], "Only QR code login");
document.getElementById("wdq").innerHTML = "What do these buttons mean?";
document.getElementById("wdqe").innerHTML = "When a recommended site has a badge nexts to its name, you can use one or either of the buttons on the recommended site and has a good chance of loading.";