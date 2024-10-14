class e {
  set(e2, t2, n2) {
    let r2 = "";
    if (n2) {
      const e3 = /* @__PURE__ */ new Date();
      e3.setTime(e3.getTime() + 24 * n2 * 60 * 60 * 1e3), r2 = "expires=" + e3.toUTCString();
    }
    document.cookie = e2 + "=" + t2 + "; " + r2 + "; path=/";
  }
  get(e2) {
    const t2 = e2 + "=";
    let n2;
    return decodeURIComponent(document.cookie).split("; ").forEach((e3) => {
      0 === e3.indexOf(t2) && (n2 = e3.substring(t2.length));
    }), n2;
  }
}
function t(e2) {
  return new URLSearchParams(e2.search).has("debug");
}
function n(e2, ...t2) {
  e2 in console ? console[e2](`[${e2.toUpperCase()}] ${t2.join(", ")}`) : console.log(`[${e2.toUpperCase()}] ${t2.join(", ")}`);
}
const r = ".addReferences", o = r + " sup a", a = "https://owenberesford.me.uk/", i = "appearance", s = 16, l = "showBiblioErrors", c = 180;
async function u(e2, r2, o2) {
  const a2 = function() {
    if ("undefined" != typeof window)
      return window.fetch;
    if ("function" == typeof fetch)
      return fetch;
    throw n("error", "Please stop using old versions of node."), new Error("Please stop using old versions of Node");
  }(), i2 = t(o2);
  try {
    const t2 = await a2(e2, { credentials: "same-origin" });
    if (!t2.ok) {
      if (i2 && n("warn", "Failed to communicate with " + e2), r2)
        return { body: "nothing", headers: {}, ok: false };
      throw new Error("ERROR getting asset " + e2);
    }
    if ( 404 === t2.status) {
console.log("SFSDFSDFS ", t2.headers, t2.status );
      throw new Error("got HTTP 404");
	}
    let o3 = "";
    return o3 = t2.headers.get("content-type").toLowerCase().startsWith("application/json") ? await t2.json() : await t2.text(), i2 && n("info", "Successful JSON transaction " + e2), { body: o3, headers: t2.headers, ok: true };
  } catch (t2) {
    if (i2 && n("error", "KLAXON, KLAXON failed: " + e2 + " " + t2.toString()), r2)
      return { body: "nothing", headers: {}, ok: false };
    throw new Error("ERROR getting asset " + e2 + " " + t2.toString());
  }
}
function d(e2) {
  if (e2) {
    if ("textContent" in e2)
      return e2.textContent;
    if ("innerText" in e2)
      return e2.innerText;
    throw new Error("No text found");
  }
  throw new Error("No element for text found");
}
function f(e2) {
  return e2.pathname.split("/").pop() || "<name>";
}
function h(e2, t2) {
  let n2 = [];
  return n2 = t2.pathname.split("/"), e2.replace(/XXX/, n2.pop());
}
function p(e2) {
  return !(!e2.startsWith("192.168.") && "127.0.0.1" !== e2 && "::1" !== e2 && "0:0:0:0:0:0:0:1" !== e2 && "localhost" !== e2);
}
function g(e2, t2 = 80, n2 = "↩") {
  if (!e2 || e2.length < t2)
    return "" + e2;
  let r2 = 0, o2 = [];
  for (; r2 <= e2.length; )
    r2 + t2 > e2.length ? o2.push(e2.substring(r2, r2 + t2)) : o2.push(e2.substring(r2, r2 + t2) + n2), r2 += t2;
  return o2.join("\n");
}
function m(e2) {
  let t2 = String(e2);
  if (0 === e2 || e2 < 1)
    throw new Error("Value passed must be a counting number above 0");
  return 1 === t2.length && (t2 = "0" + t2), t2;
}
function b(e2, t2, n2 = true) {
  let r2 = "";
  if (r2 = Number(e2) === e2 && e2 % 1 == 0 ? 0 === e2 ? "[No date]" : e2 < 1e10 ? new Date(1e3 * e2) : new Date(e2) : t2, "string" != typeof r2) {
    const e3 = ["", "Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let t3;
    t3 = r2.getHours() ? m(r2.getHours()) : "00", r2 = " " + m(r2.getDate()) + "-" + (n2 ? e3[r2.getMonth() + 1] : m(r2.getMonth() + 1)) + "-" + r2.getUTCFullYear() + " " + (n2 ? "" : t3 + ":00");
  }
  return r2;
}
function y(e2, t2, r2) {
  try {
    if (null === r2)
      throw new Error("Oh no! No DOM object!!");
    const n2 = r2.createElement("template");
    if (n2.innerHTML = t2, "string" == typeof e2) {
      const t3 = r2.querySelector(e2);
      if (null === t3)
        throw new Error("Oh no! DOM element not found: " + e2);
      return t3.append(n2.content);
    }
    return e2.append(n2.content);
  } catch (e3) {
    n("error", e3.toString());
  }
}
function S(e2) {
  if (void 0 === e2)
    return false;
  const t2 = e2.getComputedStyle.toString().includes("[native code]");
  return !("boolean" != typeof t2 || !t2);
}
function w(e2, t2, r2) {
  try {
    if (!S(r2))
      return -1;
    return e2.getBoundingClientRect()[t2];
  } catch (e3) {
    return n("error", "Missing data:" + e3), -1;
  }
}
function A(e2, t2) {
  const n2 = e2.getBoundingClientRect();
  return [Math.round(t2.scrollY + n2.top), Math.round(t2.scrollX + n2.left)];
}
function L(e2 = 1040, t2, n2, r2) {
  if (t2.querySelector(".maquetteContainer") && function(e3, t3) {
    const n3 = new URLSearchParams(e3.search);
    if (n3.has("width"))
      return parseInt(n3.get("width"), 10);
    return t3.innerWidth;
  }(n2, r2) > e2) {
    const e3 = Array.from(t2.querySelectorAll(".maquetteContainer details"));
    for (let t3 = 0; t3 < e3.length; t3++)
      e3[t3].classList.contains("singlePopup") || e3[t3].classList.contains("screenDocs") || (e3[t3].open = true);
  }
}
function R(e2) {
  if (["1", 1, "true", "TRUE", "on", "ON", "yes", "YES"].includes(e2))
    return true;
  if (["0", 0, "false", "FALSE", "off", "OFF", "no", "NO"].includes(e2))
    return false;
  throw new Error("Unknown data " + e2);
}
function E(e2, t2, r2) {
  const o2 = new URLSearchParams(t2.search);
  try {
    e2.createEvent("TouchEvent");
    return o2.has("mobile") ? R(o2.get("mobile")) : function(e3, t3) {
      try {
        const n2 = e3.createElement("div");
        n2.setAttribute("style", "width:1in;"), e3.body.appendChild(n2);
        const r3 = n2.offsetWidth * t3.devicePixelRatio;
        return n2.remove(), r3;
      } catch (e4) {
        return n("error", "ERROR " + e4.toString()), -1;
      }
    }(e2, r2) > c;
  } catch (e3) {
    return !(!o2.has("mobile") || !R(o2.get("mobile")));
  }
}
let q = {};
function v(e2) {
  const t2 = "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.";
  return "Reference popup for link [" + (e2 + 1) + "]\n\nHTTP_ERROR, Site admin: recompile this meta file, as this is a new link.\n " + b(+/* @__PURE__ */ new Date("07-June-2024"), "not used", true) + "\n\n" + t2;
}
function k(e2, t2) {
  const n2 = w(e2, "left", t2), r2 = w(e2, "bottom", t2);
  if (-1 === n2 && -1 === r2)
    return;
  let o2 = e2.parentNode;
  const a2 = ["LI", "SUP", "UL", "OL", "SPAN", "P"];
  for (; a2.includes(o2.tagName); )
    o2 = o2.parentNode;
  n2 > Math.round(w(o2, "width", t2)) - 30 * s && e2.classList.add("leanIn");
  r2 > w(o2, "height", t2) - 3 * s && e2.classList.add("leanUp");
}
async function T(e2, a2, i2, s2) {
  if (q = Object.assign({ indexUpdated: 0, gainingElement: "#biblio", referencesCache: "/resource/XXX-references", renumber: 1, maxAuthLen: 65, debug: t(i2), runFetch: u }, e2), 0 === a2.querySelectorAll(r).length)
    return void n("info", "This URL '" + i2.pathname + "' isn't marked-up for references, so skipped");
  const c2 = await q.runFetch(h(q.referencesCache, i2), false, i2);
  if (c2.ok && Array.isArray(c2.body)) {
    if (a2.querySelectorAll(o).length < c2.length)
      throw new Error("Recompile the meta data for  " + i2.pathname);
    const e3 = a2.querySelector("#biblio");
    e3 && e3.setAttribute("style", ""), function(e4, t3) {
      let n2 = e4.headers.get("last-modified");
      if (!n2)
        return;
      n2.indexOf("BST") > 0 && (n2 = n2.substring(0, n2.length - 4));
      const r2 = new Date(n2).getTime();
      r2 > 0 && y(".addReading .ultraSkinny", '<span>Links updated <time datetime="' + r2 + '" title="When this was last recompiled">' + new Date(r2).toLocaleDateString("en-GB", { hour12: false, dateStyle: "medium" }) + "</time> </span>", t3);
    }(c2, a2);
    const t2 = function(e4) {
      const t3 = ["[No author]", "Resource doesn't set a description tag.", "[No date]"], n2 = [];
      for (let r2 = 0; r2 < e4.length; r2++) {
        if (null === e4[r2]) {
          n2.push(v(r2));
          continue;
        }
        const o2 = b(e4[r2].date, t3[2], true);
        let a3 = e4[r2].title + "", i3 = e4[r2].desc;
        i3 = g(i3, 80), a3 = a3.replace(".", ". "), a3 = g(a3, 80);
        let s3 = e4[r2].auth || t3[0];
        "unknown" === e4[r2].auth && (s3 = t3[0]), s3.length > q.maxAuthLen && (s3 = s3.substring(0, q.maxAuthLen)), n2.push("Reference popup for link [" + (r2 + 1) + "]\n\n" + a3 + "\n" + s3 + " " + o2 + "\n\n" + i3);
      }
      return n2;
    }(c2.body);
    !function(e4, t3, n2) {
      let a3 = 1;
      const i3 = Array.from(t3.querySelectorAll(o));
      if (e4.length > i3.length)
        throw t3.querySelector(r).classList.add(l), t3.querySelector("p[role=status]").textContent += "Recompile meta data", new Error("Too many references in meta-data for this article, pls recompile.");
      for (let t4 = 0; t4 < e4.length; t4++)
        i3[t4].setAttribute("aria-label", "" + e4[t4]), k(i3[t4], n2), q.renumber && (i3[t4].textContent = "" + a3), a3++;
      if (i3.length > e4.length) {
        t3.querySelector("p[role=status]").textContent += "Recompile meta data";
        let r2 = e4.length;
        for (; r2 < i3.length; ) {
          const e5 = v(r2);
          i3[r2].setAttribute("aria-label", "" + e5), k(i3[r2], n2), q.renumber && (i3[r2].textContent = "" + (r2 + 1)), r2++;
        }
      }
    }(t2, a2, s2), a2.querySelector(r).classList.add(l);
  } else {
    !function(e4, t2) {
      const n2 = f(t2), a3 = e4.querySelectorAll(o);
      for (let e5 = 0; e5 < a3.length; e5++) {
        const t3 = `Reference popup for link [${1 + e5}]
ERROR: No valid biblio file found.
site admin, today
HTTP_ERROR, no valid file called ${n2}-references.json found.
`;
        a3[e5].setAttribute("aria-label", "" + t3);
      }
      e4.querySelector(r).classList.add(l);
    }(a2, i2);
    const e3 = '<p class="error">Unable to get bibliographic data for this article.</p>';
    y(q.gainingElement, e3, a2), n("warn", "Unable to get meta data " + h(q.referencesCache, i2), JSON.stringify(Array.from(c2.headers.entries())));
  }
}
function x(e2, t2, n2) {
  t2.querySelectorAll("article a").forEach(function(r2) {
    "git" === d(r2).trim().toLowerCase() && (r2.textContent = "", y(r2, '<i class="fa fa-github" aria-hidden="true"></i> \n		 <span class="sr-only">git</span>', t2), e2 ? (r2.setAttribute("aria-label", function(e3) {
      const t3 = new URL(e3);
      let n3 = "[anon dev]", r3 = "";
      if (t3.username && (n3 = t3.username), t3.pathname) {
        const e4 = t3.pathname.split("/");
        n3 = e4[1], r3 = e4[2];
      } else if (t3.hostname.indexOf("github.io")) {
        const e4 = t3.hostname.split(".");
        n3 = e4[0], r3 = "The " + e4[0] + " project";
      }
      return "Reference popup for link [*]\n\n" + r3 + "\n" + n3 + " [recent time]\n\nA Github project ~ text auto generated without scrapping.";
    }(r2.getAttribute("href"))), k(r2, n2)) : r2.setAttribute("title", "Link to a github project."));
  });
}
function X(e2, t2, n2, r2) {
  if (!p(n2.host) && !E(t2, n2, r2))
    return false;
  const o2 = t2.querySelector("#shareMenu");
  return o2 && !o2.classList.replace("shareMenuOpen", "shareMenu") && o2.classList.replace("shareMenu", "shareMenuOpen"), false;
}
function M(e2, t2, r2, o2) {
  const a2 = t2.querySelector("#mastodonserver");
  let i2 = a2.value;
  const s2 = a2.getAttribute("data-url");
  if ("" === i2 || null === i2)
    return false;
  if (i2 = "https://" + i2 + "/share?text=I+think+this+is+important+" + s2, n("info", "Trying to open mastodon server, " + i2), !S(o2))
    throw Error("Test passed, for " + i2);
  return t2.querySelector("#popup").close(), o2.open(i2, "_blank"), E(t2, r2, o2) && X(0, t2, r2, o2), false;
}
function O(e2, t2, n2) {
  let r2 = e2.querySelector("#shareMenu #mastoTrigger");
  r2 && j(r2, C, e2, n2), r2 = e2.querySelector("#shareGroup .allButtons #mastoTrigger");
  const o2 = function(e3, t3 = "display", n3 = window) {
    let r3 = "";
    e3 && e3.computedStyleMap ? r3 = e3.computedStyleMap()[t3] : e3 && (r3 = n3.getComputedStyle(e3, null).getPropertyValue(t3));
    return r3;
  }(r2, "display", n2);
  o2 && "none" !== o2 && (r2.addEventListener("click", (t3) => C(t3, e2, n2)), r2.addEventListener("keypress", (t3) => C(t3, e2, n2))), r2 = e2.querySelector("#copyURL"), r2 && function(e3, t3, n3) {
    e3.addEventListener("click", (e4) => (t3(e4, n3), false)), e3.addEventListener("touch", (e4) => (t3(e4, n3), false)), e3.addEventListener("keypress", (e4) => (t3(e4, n3), false));
  }(r2, U, t2), F(e2.querySelector("#popup #sendMasto"), M, e2, t2, n2);
  const a2 = Array.from(e2.querySelectorAll("#shareMenuTrigger, #shareClose"));
  for (const r3 in a2)
    F(a2[r3], X, e2, t2, n2);
  j(e2.querySelector("#hideMasto"), N, e2, n2);
}
function C(e2, t2, n2) {
  return S(n2) && t2.querySelector("#popup").showModal(), t2.querySelector("#popup input").focus(), false;
}
function N(e2, t2, n2) {
  return S(n2) && t2.querySelector("#popup").close(), false;
}
function U(e2, t2) {
  try {
    if (!t2.navigator.clipboard)
      throw new Error("No clipboard available");
    t2.navigator.clipboard.writeText(e2.url).then(() => {
    }, (e3) => {
      n("error", "FAILED: copy URL " + e3);
    });
  } catch (e3) {
    n("error", "FAILED: copy URL feature borked " + e3 + "\nIt will fail on a HTTP site.");
  }
}
function j(e2, t2, n2, r2) {
  e2.addEventListener("click", (e3) => (t2(e3, n2, r2), false)), e2.addEventListener("touch", (e3) => (t2(e3, n2, r2), false)), e2.addEventListener("keypress", (e3) => (t2(e3, n2, r2), false));
}
function F(e2, t2, n2, r2, o2) {
  e2.addEventListener("click", (e3) => (t2(e3, n2, r2, o2), false)), e2.addEventListener("touch", (e3) => (t2(e3, n2, r2, o2), false)), e2.addEventListener("keypress", (e3) => (t2(e3, n2, r2, o2), false));
}
let P = {};
function D(e2, t2, n2) {
  let r2 = n2.pathname.split("/"), o2 = "";
  r2 = r2.pop();
  const a2 = new URLSearchParams(n2.search);
  return "group-XXX" === r2 && a2.has("first") && (r2 = a2.get("first")), t2 ? a2.has("first") ? o2 += n2.pathname.replace("group-XXX", r2 + "-meta") : o2 += n2.pathname.replace(r2, e2 + "-meta") : o2 += n2.pathname.replace(r2, e2), o2 += n2.search + n2.hash, o2;
}
function I(e2, t2) {
  let n2 = "button";
  return e2 && (n2 += " lower"), n2;
}
function H(e2, t2) {
  return t2 + "" + e2.replace(/[^a-zA-Z0-9_]/g, "_");
}
function B(e2) {
  return e2.split("/").pop();
}
function $(e2) {
  let t2 = P.group;
  if ("XXX" === P.group) {
    const n2 = new URLSearchParams(e2.search);
    n2.has("first") && (t2 = n2.get("first"));
  }
  if ("XXX" === t2)
    throw new Error("Thou shalt supply the group somewhere");
  return t2;
}
function J(e2, t2, n2, r2, o2) {
  return P.name === "group-" + P.group || (t2 === e2 && (o2 = r2), r2 > 0 && o2 > 0 && n2 > 0 && r2 >= n2 - 1 && (r2 = 0)), [o2, n2, r2];
}
async function W(e2, r2, o2, a2) {
  if (P = Object.assign(P, { name: f(o2), meta: D(P.group, ".json", o2), perRow: 10, titleLimit: 40, rendered: false, iteration: 0, group: "system", count: 1, debug: t(o2), runFetch: u }, e2), "system" === P.group)
    throw new Error("Must set the article group, and not to 'system'.");
  P.meta = D(P.group, ".json", o2);
  const i2 = "group-XXX" === P.name || P.name === "group-" + P.group, s2 = "group" + P.group;
  if (E(r2, o2, a2) && !i2)
    1 === r2.querySelectorAll(".adjacentGroup .adjacentItem").length && (r2.querySelector(".adjacentGroup p").style.display = "none"), y("#" + s2, "<p>As mobile View, use the full page link to the left</p>", r2);
  else {
    const e3 = await P.runFetch(P.meta, false, o2);
    if (!e3.ok || !Array.isArray(e3.body))
      return n("info", "There doesn't seem to be a group meta data file."), void y("#" + s2, "<p>Internal error. Hopefully this will be fixed shortly. </p>", r2);
    if (i2) {
      const t2 = function(e4, t3, n2, r3, o3) {
        let a3 = "";
        for (const i3 in e4) {
          const s3 = H(i3, t3), l2 = E(n2, r3, o3) ? "<br />" : "";
          let c2 = e4[i3].desc;
          c2.length > 235 && (c2 = c2.substr(0, 235) + "..."), a3 += '<a class="adjacentItem" href="' + e4[i3].url + '" title="' + c2 + '">' + e4[i3].title + ' <span class="button">' + e4[i3].title + '</span><p id="adjacent' + s3 + '" >Author: ' + e4[i3].auth + " &nbsp; &nbsp; &nbsp;" + l2 + "  Last edit: " + b(e4[i3].date, "Unknown time", true) + " <br />Description: " + c2 + " </p></a>\n";
        }
        return a3;
      }(e3.body, s2, r2, o2, a2);
      y("#groupXXX", t2, r2), function(e4, t3) {
        const n2 = t3.querySelectorAll(".top-bar.fullWidth header h1");
        n2.length && (n2[0].textContent.includes("whatsmyname") || n2[0].textContent.includes("XXX")) && (n2[0].textContent = "Group " + e4);
        const r3 = t3.querySelectorAll(".adjacentGroup p");
        r3.length && r3[0].textContent.includes("XXX") && (r3[0].textContent = "Some similar articles in " + e4);
      }($(o2), r2);
    } else {
      const t2 = function(e4) {
        let t3 = -1, n2 = P.perRow, r3 = [], o3 = 0, a3 = 0;
        for ([t3, n2, o3] = J(B(e4[0].url), P.name, e4.length, o3, t3); o3 < e4.length; o3++) {
          const i3 = e4[o3].title;
          if (i3 && t3 >= 0 && n2 > 0) {
            r3[a3] = { auth: e4[o3].auth, date: b(e4[o3].date, "[Unknown time]", true), url: e4[o3].url, offset: o3, title: e4[o3].title.substr(0, P.titleLimit), desc: e4[o3].desc }, i3.length > P.titleLimit && (r3[a3].title += "...");
            const t4 = e4[o3].desc;
            t4.length > 235 && (r3[a3].desc = t4.substr(0, 235) + "..."), n2--, a3++;
          }
          if ([t3, n2, o3] = J(B(e4[o3].url), P.name, n2, o3, t3), r3.length === e4.length)
            break;
          if (r3.length >= P.perRow)
            break;
        }
        return r3;
      }(e3.body);
      y("#" + s2, function(e4, t3) {
        let n2 = '<ul class="adjacentList">\n';
        for (const r3 in e4) {
          const o3 = H(r3, t3), a3 = I(e4[r3].desc.length > 110), i3 = "Title: " + e4[r3].title + "\nAuthor: " + e4[r3].auth + " &nbsp; &nbsp; Last edit: " + e4[r3].date + "\nDescription: " + e4[r3].desc;
          n2 += '<li> <a id="link' + o3 + '" class="' + a3 + '" href="' + e4[r3].url + '" aria-label="' + i3 + '" >' + e4[r3].title + "</a> </li>\n";
        }
        return 0 === e4.length ? n2 += "<li> Article doesn't seem setup correctly.</li></ul>" : n2 += '<li><a class="adjacentItem button" href="/resource/group-XXX?first=' + t3 + '" aria-label="This article lists all items in worklog group."> See full list </a></li></ul>', n2;
      }(t2, $(o2)), r2);
    }
  }
}
let G = {};
async function _(e2, o2, i2) {
  const s2 = { referencesCache: "/resource/XXX-references", gainingElement: "#biblio", losingElement: ".addReferences", renumber: 1, forceToEnd: 1, maxDescripLen: 230, maxAuthLen: 65, debug: t(i2), runFetch: u };
  if (G = Object.assign(s2, e2), 0 === o2.querySelectorAll(r).length)
    return void n("info", "URL '" + i2.pathname + "' isn't marked-up for references, so skipped");
  const l2 = o2.querySelector("#biblio");
  l2 && l2.setAttribute("style", ""), o2.querySelector(G.gainingElement + " *").replaceChildren([]), y(G.gainingElement, '<h2 class="biblioSection">References (for mobile UI)</h2> \n<p>The references embedded in the text are displayed here. </p>', o2);
  const c2 = await G.runFetch(h(G.referencesCache, i2), false, i2);
  if (c2.ok && Array.isArray(c2.body)) {
    const e3 = function(e4) {
      let t2 = '<aside role="footnote"><ol class="mobileBiblio">';
      for (const n2 in e4)
        t2 += `<li>
<a href="${e4[n2].url}"> 
<h5>${e4[n2].title}</h5>
<span>${e4[n2].desc}</span>
<span>by ${e4[n2].auth} on ${e4[n2].date}</span>
</a>
</li>
`;
      return t2 += "</ol></aside>", t2;
    }(function(e4) {
      const t2 = ["[No author]", "Resource doesn't set a description tag.", "[No date]"], n2 = [];
      for (const r2 in e4) {
        if (null === e4[r2]) {
          n2.push({ auth: "[No author]", date: "[No date]", desc: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.", offset: parseInt(r2, 10), title: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.", url: a });
          continue;
        }
        const o3 = b(e4[r2].date, t2[2], true);
        let i3 = e4[r2].title + "";
        i3 = i3.replace(".", ".  ");
        let s3 = e4[r2].desc + "";
        s3.length > G.maxDescripLen && (s3 = s3.substring(0, G.maxDescripLen));
        let l3 = e4[r2].auth || t2[0];
        "unknown" === e4[r2].auth && (l3 = t2[0]), l3.length > G.maxAuthLen && (l3 = l3.substring(0, G.maxAuthLen)), n2.push({ auth: l3, date: o3, desc: s3, offset: parseInt(r2, 10), title: i3, url: e4[r2].url });
      }
      return n2;
    }(c2.body));
    !function(e4, t2) {
      if (!G.renumber)
        return;
      const n2 = t2.querySelectorAll(G.losingElement + " sup a");
      for (let e5 = 0; e5 < n2.length; e5++)
        n2[e5].textContent = "" + (e5 + 1), G.forceToEnd && (n2[e5].href = "#biblio");
    }(c2.body, o2), y(G.gainingElement, e3, o2);
  } else {
    const e3 = '<p class="error">Unable to get bibliographic data for this article.</p>';
    y(G.gainingElement, e3, o2), n("warn", "Unable to get meta data " + h(G.referencesCache, i2), JSON.stringify(Array.from(c2.headers.entries())));
  }
}
function Y(e2, t2) {
  if ("Escape" === e2.code || "Escape" === e2.key) {
    const n2 = t2.querySelectorAll("details[open]");
    return n2.length && (n2[0].open = false), e2.preventDefault(), false;
  }
  return true;
}
function K(e2, t2) {
  const n2 = function(e3, t3) {
    if (e3.tagName === t3)
      return e3;
    for (; e3.tagName !== t3; ) {
      if ("A" === e3.tagName)
        return e3;
      if ("BODY" === e3.tagName)
        return;
      if (e3.classList.contains("maquette"))
        return;
      e3 = e3.parentElement;
    }
    return e3;
  }(e2.target, "DETAILS");
  if (n2 && "A" === n2.tagName)
    return true;
  if (n2) {
    const t3 = n2;
    if (e2.preventDefault(), e2.stopPropagation(), t3 && t3.open) {
      if ("SUMMARY" !== e2.target.tagName && null !== t3.querySelector("code"))
        return false;
      t3.open = false;
    } else
      t3.open = true;
  } else {
    const n3 = t2.querySelector("details[open]");
    if (!n3)
      return true;
    e2.preventDefault(), e2.stopPropagation(), n3.open = false;
  }
  return false;
}
let V = { pageInitRun: 0 };
function z(e2, t2) {
  e2.addEventListener("click", t2), e2.addEventListener("touch", t2), e2.addEventListener("keypress", t2);
}
function Q(t2) {
  const n2 = ("undefined" != typeof document ? new e() : { set(e2, t3, n3) {
  }, get(e2) {
  } }).get(i);
  if (!n2)
    return;
  const r2 = JSON.parse(n2);
  if (!r2.ft || !r2.fs)
    return;
  const o2 = "body, .annoyingBody { font-family: " + r2.ft + "; font-size: " + r2.fs + "; direction:" + r2.dn + "; }", a2 = t2.createElement("style");
  a2.setAttribute("id", "client-set-css"), a2.innerText = o2, t2.getElementsByTagName("head")[0].append(a2);
}
function Z(e2, t2) {
  let r2 = null, o2 = "";
  if ("string" == typeof e2)
    o2 = e2, r2 = t2.querySelector(e2);
  else {
    const n2 = e2.target;
    r2 = t2.querySelector("#" + n2.id), o2 = "" + r2.getAttribute("href");
  }
  if (!r2)
    return void n("ERROR", "Malconfigured tabs!! " + e2 + " matches nothing");
  let a2 = t2.querySelectorAll(".tab-title");
  for (let e3 = 0; e3 < a2.length; e3++)
    a2[e3].classList.remove("is-active");
  a2 = t2.querySelectorAll(".tab-title>a");
  for (let e3 = 0; e3 < a2.length; e3++)
    a2[e3].setAttribute("aria-hidden", "true");
  const i2 = t2.querySelectorAll(".tabs-content .tabs-panel");
  for (let e3 = 0; e3 < i2.length; e3++)
    i2[e3].classList.remove("is-active"), i2[e3].setAttribute("aria-hidden", "true");
  const [s2] = t2.querySelectorAll(".tabs-content " + o2);
  s2.classList.add("is-active"), s2.setAttribute("aria-hidden", "false"), r2.parentNode.classList.add("is-active"), r2.setAttribute("aria-hidden", "false");
}
function ee() {
  return V.pageInitRun;
}
!async function(e2, r2, o2, a2) {
  V = Object.assign(V, {}, e2);
  const i2 = t(o2);
  if (V.pageInitRun)
    return void n("warn", "Extra panda should not be run more than once per page");
  V.pageInitRun = 1;
  const s2 = r2.querySelectorAll(".noJS");
  for (let e3 = 0; e3 < s2.length; e3++)
    s2[e3].classList.remove("noJS");
  const l2 = r2.querySelector("#pageMenu");
  l2 ? z(l2, (e3) => function(e4 = ".burgerMenu", t2) {
    const n2 = t2.querySelector(e4), r3 = t2.querySelector("#pageMenu i");
    n2.getAttribute("data-state") ? (n2.classList.remove("burgerMenuOpen"), n2.setAttribute("data-state", ""), r3.classList.add("fa-ob1burger"), r3.classList.remove("fa-cancel")) : (n2.classList.add("burgerMenuOpen"), n2.setAttribute("data-state", "1"), r3.classList.remove("fa-ob1burger"), r3.classList.add("fa-cancel"));
  }(".burgerMenu", r2)) : n("info", "This URL '" + o2.pathname + "' has no burger menu"), function(e3, t2) {
    e3.querySelector("body").setAttribute("style", "--offset-height: 0;");
    const n2 = e3.querySelectorAll(".lotsOfWords, .halferWords, .fewWords");
    for (let e4 = 0; e4 < n2.length; e4++)
      n2[e4].setAttribute("style", "--offset-height: " + A(n2[e4], t2)[0] + "px;");
  }(r2, a2), function(e3, t2, n2) {
    const r3 = E(e3, t2, n2);
    if (!p(t2.host) && !r3)
      return;
    r3 && (e3.querySelector("#sendMasto").textContent = "Share article");
    const o3 = ['<li id="shareClose"> <i class="fa fa-cancel" aria-hidden="true"></i> </li>	<li> <a class="hunchUp" id="copyURL"><i class="fa fa-copy" aria-hidden="true"></i><span class="hunchUp"> copy<br /> URL</span> </a> </li>'], a3 = ["shareMenuTrigger", "siteChartLink", "rssLink"], i3 = Array.from(e3.querySelectorAll(".allButtons a"));
    for (const e4 in i3) {
      if (a3.includes(i3[e4].id))
        continue;
      const t3 = i3[e4].cloneNode(true);
      t3.classList.remove("bigScreenOnly"), o3.push("<li>"), o3.push(t3.outerHTML), o3.push("</li>"), i3[e4].getAttribute("id") && i3[e4].setAttribute("id", "old" + i3[e4].getAttribute("id"));
    }
    o3.unshift('<nav><div class="shareMenu" id="shareMenu"><menu id="mobileMenu">'), o3.push("</menu></div></nav>"), y("#navBar", o3.join("\n"), e3);
  }(r2, o2, a2), O(r2, o2, a2);
  const c2 = null !== r2.querySelector(".addReferences");
  x(c2, r2, a2), function(e3, t2, n2) {
    t2.querySelectorAll("article a").forEach(function(r3) {
      "docs" === d(r3).trim().toLowerCase() && (r3.textContent = "", y(r3, '<i class="fa fa-book-open" aria-hidden="true"></i>\n		 <span class="sr-only">docs</span>', t2), r3.setAttribute(e3 ? "aria-label" : "title", "Link to the project docs; it may be a git page, or a separate webpage. "), e3 && k(r3, n2));
    });
  }(c2, r2, a2), function(e3) {
    const t2 = e3.querySelectorAll(".addArrow");
    for (let n2 = 0; n2 < t2.length; n2++)
      y(t2[n2].parentElement, '<i class="fa fa-play specialPointer" aria-hidden="true"></i>', e3);
  }(r2), function(e3) {
    const t2 = new RegExp("`([^`]+)`", "g"), n2 = new RegExp("/ /", "g"), r3 = e3.querySelectorAll(".addBashSamples");
    if (r3.length > 0)
      for (let e4 = 0; e4 < r3.length; e4++)
        r3[e4].innerHTML = r3[e4].innerHTML.replaceAll(t2, '<code class="bashSample" title="Quote from a bash; will add copy button">$1</code>').replaceAll(n2, "//");
  }(r2), Q(r2), function(e3) {
    const t2 = Array.from(e3.querySelectorAll(".popOverWidget details"));
    t2.length && (n("info", "Modal widget found, extra UI features added"), t2.forEach(function(e4) {
      e4.addEventListener("click", K);
    }), e3.body.addEventListener("click", K), e3.body.addEventListener("keydown", Y));
  }(r2), L(1040, r2, o2, a2), !E(r2, o2, a2) && "/resource/home" !== o2.pathname && r2.querySelectorAll(".reading").length < 2 && function(e3, r3, o3) {
    const a3 = /[ \t\n\r.(),~]/g, i3 = Object.assign({}, { timeFormat: "m", dataLocation: ".blocker", target: "#shareGroup", wordPerMin: 275, codeSelector: "code", refresh: false, debug: t(o3) }, e3), s3 = i3.dataLocation + " img, " + i3.dataLocation + " picture, " + i3.dataLocation + " object";
    let l3 = d(r3.querySelector(i3.dataLocation)).split(a3).filter((e4) => e4).length / i3.wordPerMin;
    if (l3 += r3.querySelectorAll(s3).length / 5, i3.codeSelector && r3.querySelectorAll(i3.codeSelector)) {
      let e4 = 0;
      r3.querySelectorAll(i3.codeSelector).forEach(function(t2) {
        e4 += d(t2).split(a3).filter((e5) => e5).length;
      }), e4 && (l3 += 3 * e4 / i3.wordPerMin);
    }
    if (l3 < 1)
      return void n("info", "No reading time displayed for this article");
    if (i3.refresh) {
      const e4 = r3.querySelector(i3.target + " a.reading");
      e4 && e4.parentNode.removeChild(e4);
    }
    l3 = Math.round(l3);
    const c3 = '<a class="reading" title="See longer version of this reading guide." href="/resource/jQuery-reading-duration">To read: ' + l3 + i3.timeFormat + "</a>";
    y(i3.target, c3, r3);
  }({ dataLocation: "#main", target: ".addReading", debug: i2, refresh: true }, r2, o2);
  {
    const e3 = r2.querySelectorAll(".tabComponent");
    for (let t2 = 0; t2 < e3.length; t2++) {
      const n2 = e3[t2].querySelectorAll(".tab-title a");
      for (let e4 = 0; e4 < n2.length; e4++)
        z(n2[e4], Z);
    }
  }
  if (o2.pathname.match("group-")) {
    const e3 = function(e4, t2, n2) {
      const r3 = t2.pathname.split("/group-");
      if (Array.isArray(r3) && r3.length > 1 && "XXX" !== r3[1])
        return r3[1];
      const o3 = new URLSearchParams(t2.search);
      if (o3.has("first"))
        return o3.get("first");
      if (e4 && e4.getAttribute("data-group")) {
        let t3 = e4.getAttribute("data-group");
        return t3 = t3.trim(), t3.split(",").map((e5, t4) => e5.trim())[0];
      }
      throw new Error("KLAXON, KLAXON, I do not know how to build an adjacent list for " + t2.href);
    }(null, o2);
    e3 && await W({ group: e3, debug: i2, runFetch: "adjacentRunFetch" in V ? V.adjacentRunFetch : u }, r2, o2);
  } else {
    E(r2, o2, a2) ? await _({ debug: i2, renumber: 1, runFetch: "mobileRunFetch" in V ? V.mobileRunFetch : u }, r2, o2) : await T({ debug: i2, renumber: 1, runFetch: "desktopRunFetch" in V ? V.desktopRunFetch : u }, r2, o2);
    const e3 = function(e4, t2 = document) {
      let n2 = t2.querySelector(e4);
      return n2 ? (n2 = n2.getAttribute("data-group"), n2 ? (n2 = n2.split(","), n2 = n2.map((e5, t3) => e5.trim()), "XXX" === n2[0] && n2.shift(), [...n2]) : []) : [];
    }("div#contentGroup", r2);
    if (0 === e3.length)
      n("info", "This URL '" + o2.pathname + "' has no Adjacent groups defined.");
    else
      for (let t2 = 0; t2 < e3.length; t2++)
        await W({ group: e3[t2], debug: i2, iteration: t2, count: e3.length, runFetch: "adjacentRunFetch" in V ? V.adjacentRunFetch : u }, r2, o2);
  }
  "undefined" != typeof document && "function" == typeof document.pageStartup ? document.pageStartup() : n("info", "No article specific scripting found, (it may load manually ATF)");
}({}, document, location, window);
export {
  y as appendIsland,
  ee as hasBeenRun,
  E as isMobile,
  n as log,
  u as runFetch
};
