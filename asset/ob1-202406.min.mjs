function e(e2 = location) {
  return new URLSearchParams(e2.search).has("debug");
}
function t(e2, ...t2) {
  e2 in console ? console[e2](`[${e2.toUpperCase()}] ${t2.join(", ")}`) : console.log(`[${e2.toUpperCase()}] ${t2.join(", ")}`);
}
const n = ".addReferences", r = n + " sup a", o = "https://owenberesford.me.uk/", i = "appearance", a = 16, s = 180;
async function c(n2, r2) {
  const o2 = function() {
    if ("undefined" != typeof window)
      return window.fetch;
    if ("function" == typeof fetch)
      return fetch;
    throw t("error", "Please stop using old versions of node."), new Error("Please stop using old versions of Node");
  }(), i2 = e();
  try {
    const e2 = await o2(n2, { credentials: "same-origin" });
    if (!e2.ok) {
      if (i2 && t("warn", "Failed to communicate with " + n2), r2)
        return { body: "nothing", headers: {}, ok: false };
      throw new Error("ERROR getting asset " + n2);
    }
    let a2 = "";
    return a2 = e2.headers.get("content-type").toLowerCase().startsWith("application/json") ? await e2.json() : await e2.text(), i2 && t("info", "Successful JSON transaction " + n2), { body: a2, headers: e2.headers, ok: true };
  } catch (e2) {
    if (i2 && t("error", "KLAXON, KLAXON failed: " + n2 + " " + e2.toString()), r2)
      return { body: "nothing", headers: {}, ok: false };
    throw new Error("ERROR getting asset " + n2);
  }
}
class l {
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
function u(e2) {
  if (e2) {
    if ("textContent" in e2)
      return e2.textContent;
    if ("innerText" in e2)
      return e2.innerText;
    throw new Error("No text found");
  }
  throw new Error("No element for text found");
}
function d(e2 = location) {
  return e2.pathname.split("/").pop() || "<name>";
}
function f(e2, t2 = location) {
  let n2 = [];
  return n2 = t2.pathname.split("/"), e2.replace(/XXX/, n2.pop());
}
function h(e2) {
  return !(!e2.startsWith("192.168.") && "127.0.0.1" !== e2 && "::1" !== e2 && "0:0:0:0:0:0:0:1" !== e2 && "localhost" !== e2);
}
function p(e2, t2 = 80, n2 = "↩") {
  if (!e2 || e2.length < t2)
    return "" + e2;
  let r2 = 0, o2 = [];
  for (; r2 <= e2.length; )
    r2 + t2 > e2.length ? o2.push(e2.substring(r2, r2 + t2)) : o2.push(e2.substring(r2, r2 + t2) + n2), r2 += t2;
  return o2.join("\n");
}
function g(e2) {
  let t2 = String(e2);
  if (0 === e2 || e2 < 1)
    throw new Error("Value passed must be a counting number above 0");
  return 1 === t2.length && (t2 = "0" + t2), t2;
}
function m(e2, t2, n2 = true) {
  let r2 = "";
  if (r2 = Number(e2) === e2 && e2 % 1 == 0 ? 0 === e2 ? "[No date]" : e2 < 1e10 ? new Date(1e3 * e2) : new Date(e2) : t2, "string" != typeof r2) {
    const e3 = ["", "Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let t3;
    t3 = r2.getHours() ? g(r2.getHours()) : "00", r2 = " " + g(r2.getDate()) + "-" + (n2 ? e3[r2.getMonth() + 1] : g(r2.getMonth() + 1)) + "-" + r2.getUTCFullYear() + " " + (n2 ? "" : t3 + ":00");
  }
  return r2;
}
function b(e2, n2, r2 = document) {
  try {
    if (null === r2)
      throw new Error("Oh no! No DOM object!!");
    const t2 = r2.createElement("template");
    if (t2.innerHTML = n2, "string" != typeof e2)
      return e2.append(t2.content);
    {
      const n3 = r2.querySelector(e2);
      if (null === n3)
        throw new Error("Oh no! DOM element not found: " + e2);
      n3.append(t2.content);
    }
  } catch (e3) {
    t("error", e3.toString());
  }
}
function y() {
  let e2;
  return e2 = "object" == typeof _window ? Object.getOwnPropertyDescriptor(_window, "window")?.get?.toString().includes("[native code]") : Object.getOwnPropertyDescriptor(window, "window")?.get?.toString().includes("[native code]"), !("boolean" != typeof e2 || !e2);
}
function w(e2, n2) {
  try {
    if (!y())
      return -1;
    return e2.getBoundingClientRect()[n2];
  } catch (e3) {
    return t("error", "Missing data:" + e3), -1;
  }
}
function S(e2, t2 = document) {
  const r2 = t2.querySelector(n);
  if (!r2)
    return -1;
  const o2 = Math.round(w(r2, "width"));
  return e2 ? o2 - 32 * a : o2;
}
function A(e2, t2) {
  const n2 = e2.getBoundingClientRect();
  return [Math.round(t2.scrollY + n2.top), Math.round(t2.scrollX + n2.left)];
}
function L(e2) {
  if (["1", 1, "true", "TRUE", "on", "ON", "yes", "YES"].includes(e2))
    return true;
  if (["0", 0, "false", "FALSE", "off", "OFF", "no", "NO"].includes(e2))
    return false;
  throw new Error("Unknown data " + e2);
}
function R(e2 = document, n2 = location, r2 = window) {
  const o2 = new URLSearchParams(n2.search);
  try {
    e2.createEvent("TouchEvent");
    return o2.has("mobile") ? L(o2.get("mobile")) : function(e3 = document, n3 = window) {
      try {
        const t2 = e3.createElement("div");
        t2.setAttribute("style", "width:1in;"), e3.body.appendChild(t2);
        const r3 = t2.offsetWidth * n3.devicePixelRatio;
        return t2.remove(), r3;
      } catch (e4) {
        return t("error", "ERROR " + e4.toString()), -1;
      }
    }(e2, r2) > s;
  } catch (e3) {
    return !(!o2.has("mobile") || !L(o2.get("mobile")));
  }
}
let E = {};
function v(e2) {
  const t2 = "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.";
  return "Reference popup for link [" + (e2 + 1) + "]\n\nHTTP_ERROR, Site admin: recompile this meta file, as this is a new link.\n " + m(+/* @__PURE__ */ new Date("07-June-2024"), "not used", true) + "\n\n" + t2;
}
function q(e2, t2) {
  const n2 = w(e2, "left"), r2 = w(e2, "bottom");
  if (-1 === n2 && -1 === r2)
    return;
  n2 > t2 && e2.classList.add("leanIn");
  let o2 = e2.parentNode;
  const i2 = ["LI", "SUP", "UL", "OL", "SPAN", "P"];
  for (; i2.includes(o2.tagName); )
    o2 = o2.parentNode;
  r2 > w(o2, "height") - 3 * a && e2.classList.add("leanUp");
}
async function k(o2, i2 = document, a2 = location) {
  if (E = Object.assign({ indexUpdated: 0, gainingElement: "#biblio", referencesCache: "/resource/XXX-references", renumber: 1, maxAuthLen: 65, debug: e(), runFetch: c }, o2), 0 === i2.querySelectorAll(n).length)
    return void t("info", "This URL '" + a2.pathname + "' isn't marked-up for references, so skipped");
  const s2 = await E.runFetch(f(E.referencesCache, a2), false);
  if (s2.ok && Array.isArray(s2.body)) {
    if (i2.querySelectorAll(r).length < s2.length)
      throw new Error("Recompile the meta data for  " + a2.pathname);
    const e2 = i2.querySelector("#biblio");
    e2 && e2.setAttribute("style", ""), function(e3, t3 = document) {
      const n2 = new Date(e3.headers.get("last-modified")).getTime();
      n2 > 0 && b(".addReading .ultraSkinny", '<span>Links updated <time datetime="' + n2 + '" title="When this was last recompiled">' + new Date(n2).toLocaleDateString("en-GB", { hour12: false, dateStyle: "medium" }) + "</time> </span>", t3);
    }(s2);
    const t2 = function(e3) {
      const t3 = ["[No author]", "Resource doesn't set a description tag.", "[No date]"], n2 = [];
      for (let r2 = 0; r2 < e3.length; r2++) {
        if (null === e3[r2]) {
          n2.push(v(r2));
          continue;
        }
        const o3 = m(e3[r2].date, t3[2], true);
        let i3 = e3[r2].title + "", a3 = e3[r2].desc;
        a3 = p(a3, 80), i3 = i3.replace(".", ". "), i3 = p(i3, 80);
        let s3 = e3[r2].auth || t3[0];
        "unknown" === e3[r2].auth && (s3 = t3[0]), s3.length > E.maxAuthLen && (s3 = s3.substring(0, E.maxAuthLen)), n2.push("Reference popup for link [" + (r2 + 1) + "]\n\n" + i3 + "\n" + s3 + " " + o3 + "\n\n" + a3);
      }
      return n2;
    }(s2.body);
    !function(e3, t3 = document) {
      const n2 = S(true, t3);
      let o3 = 1;
      const i3 = t3.querySelectorAll(r);
      for (const t4 in e3)
        i3[t4].setAttribute("aria-label", "" + e3[t4]), q(i3[t4], n2), E.renumber && (i3[t4].textContent = "" + o3), o3++;
      if (i3.length > e3.length) {
        let t4 = e3.length;
        for (; t4 < i3.length; ) {
          const e4 = v(t4);
          i3[t4].setAttribute("aria-label", "" + e4), q(i3[t4], n2), E.renumber && (i3[t4].textContent = "" + (t4 + 1)), t4++;
        }
      }
    }(t2, i2), i2.querySelector(n).classList.add("showBiblioErrors");
  } else {
    !function(e3 = document, t2 = location) {
      const n2 = d(t2), o3 = e3.querySelectorAll(r);
      for (let e4 = 0; e4 < o3.length; e4++) {
        const t3 = `Reference popup for link [${1 + e4}]
ERROR: No valid biblio file found.
site admin, today
HTTP_ERROR, no valid file called ${n2}-references.json found.
`;
        o3[e4].setAttribute("aria-label", "" + t3);
      }
    }(i2, a2);
    const e2 = '<p class="error">Unable to get bibliographic data for this article.</p>';
    b(E.gainingElement, e2, i2), t("warn", "Unable to get meta data " + f(E.referencesCache, a2), JSON.stringify(Array.from(s2.headers.entries())));
  }
}
function T(e2, t2 = document) {
  const n2 = S(true, t2);
  t2.querySelectorAll("article a").forEach(function(r2) {
    "git" === u(r2).trim().toLowerCase() && (r2.textContent = "", b(r2, '<i class="fa fa-github" aria-hidden="true"></i>', t2), e2 ? (r2.setAttribute("aria-label", function(e3) {
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
    }(r2.getAttribute("href"))), q(r2, n2)) : r2.setAttribute("title", "Link to a github project."));
  });
}
function O(e2, t2 = document, n2 = location) {
  if (!h(n2.host) && !R(t2, n2))
    return false;
  const r2 = t2.querySelector("#shareMenu");
  return r2 && !r2.classList.replace("shareMenuOpen", "shareMenu") && r2.classList.replace("shareMenu", "shareMenuOpen"), false;
}
function x(e2, n2 = document, r2 = location, o2 = window) {
  const i2 = n2.querySelector("#mastodonserver");
  let a2 = i2.value;
  const s2 = i2.getAttribute("data-url");
  if ("" === a2 || null === a2)
    return false;
  if (a2 = "https://" + a2 + "/share?text=I+think+this+is+important+" + s2, t("info", "Trying to open mastodon server, " + a2), !y())
    throw Error("Test passed, for " + a2);
  return n2.querySelector("#popup").close(), o2.open(a2, "_blank"), R(n2, r2) && O(0, n2, r2), false;
}
function M(e2 = document, t2 = location, n2 = window) {
  let r2 = e2.querySelector("#shareMenu #mastoTrigger");
  r2 && C(r2, X, e2), r2 = e2.querySelector("#shareGroup .allButtons #mastoTrigger");
  const o2 = function(e3, t3 = "display", n3 = window) {
    let r3 = "";
    e3 && e3.computedStyleMap ? r3 = e3.computedStyleMap()[t3] : e3 && (r3 = n3.getComputedStyle(e3, null).getPropertyValue(t3));
    return r3;
  }(r2, "display", n2);
  o2 && "none" !== o2 && (r2.addEventListener("click", (t3) => X(t3, e2)), r2.addEventListener("keypress", (t3) => X(t3, e2))), r2 = e2.querySelector("#copyURL"), r2 && C(r2, j, t2), function(e3, t3, n3, r3 = location, o3 = window) {
    e3.addEventListener("click", (e4) => (t3(e4, n3, r3, o3), false)), e3.addEventListener("touch", (e4) => (t3(e4, n3, r3, o3), false)), e3.addEventListener("keypress", (e4) => (t3(e4, n3, r3, o3), false));
  }(e2.querySelector("#popup #sendMasto"), x, e2, t2, n2);
  const i2 = Array.from(e2.querySelectorAll("#shareMenuTrigger, #shareClose"));
  for (const n3 in i2)
    U(i2[n3], O, e2, t2);
  C(e2.querySelector("#hideMasto"), N, e2);
}
function X(e2, t2 = document) {
  return y() && t2.querySelector("#popup").showModal(), t2.querySelector("#popup input").focus(), false;
}
function N(e2, t2 = document) {
  return y() && t2.querySelector("#popup").close(), false;
}
function j(e2 = location, n2 = window) {
  try {
    if (!n2.navigator.clipboard)
      throw new Error("No clipboard available");
    n2.navigator.clipboard.writeText(e2.url).then(() => {
    }, (e3) => {
      t("error", "FAILED: copy URL " + e3);
    });
  } catch (e3) {
    t("error", "FAILED: copy URL feature borked " + e3 + "\nIt will fail on a HTTP site.");
  }
}
function C(e2, t2, n2 = document) {
  e2.addEventListener("click", (e3) => (t2(e3, n2), false)), e2.addEventListener("touch", (e3) => (t2(e3, n2), false)), e2.addEventListener("keypress", (e3) => (t2(e3, n2), false));
}
function U(e2, t2, n2, r2 = location) {
  e2.addEventListener("click", (e3) => (t2(e3, n2, r2), false)), e2.addEventListener("touch", (e3) => (t2(e3, n2, r2), false)), e2.addEventListener("keypress", (e3) => (t2(e3, n2, r2), false));
}
let F = {};
function D(e2, t2, n2 = location) {
  let r2 = n2.protocol + "//" + n2.host, o2 = n2.pathname.split("/");
  o2 = o2.pop();
  const i2 = new URLSearchParams(n2.search);
  return "group-XXX" === o2 && i2.has("first") && (o2 = i2.get("first")), t2 ? i2.has("first") ? r2 += n2.pathname.replace("group-XXX", o2 + "-meta") : r2 += n2.pathname.replace(o2, e2 + "-meta") : r2 += n2.pathname.replace(o2, e2), r2 += n2.search + n2.hash, r2;
}
function P(e2, t2) {
  let n2 = "button";
  return e2 && (n2 += " lower"), n2;
}
function I(e2, t2) {
  return t2 + "" + e2.replace(/[^a-zA-Z0-9_]/g, "_");
}
function H(e2) {
  return e2.split("/").pop();
}
function B(e2 = location) {
  let t2 = F.group;
  if ("XXX" === F.group) {
    const n2 = new URLSearchParams(e2.search);
    n2.has("first") && (t2 = n2.get("first"));
  }
  if ("XXX" === t2)
    throw new Error("Thou shalt supply the group somewhere");
  return t2;
}
function $(e2, t2, n2, r2, o2) {
  return F.name === "group-" + F.group || (t2 === e2 && (o2 = r2), r2 > 0 && o2 > 0 && n2 > 0 && r2 >= n2 - 1 && (r2 = 0)), [o2, n2, r2];
}
async function J(n2, r2 = document, o2 = location) {
  if (F = Object.assign(F, { name: d(o2), meta: D(F.group, ".json", o2), perRow: 10, titleLimit: 40, rendered: false, iteration: 0, group: "system", count: 1, debug: e(), runFetch: c }, n2), "system" === F.group)
    throw new Error("Must set the article group, and not to 'system'.");
  F.meta = D(F.group, ".json", o2);
  const i2 = "group-XXX" === F.name || F.name === "group-" + F.group, a2 = "group" + F.group;
  if (R(r2, o2) && !i2)
    1 === r2.querySelectorAll(".adjacentGroup .adjacentItem").length && (r2.querySelector(".adjacentGroup p").style.display = "none"), b("#" + a2, "<p>As mobile View, use the full page link to the left</p>", r2);
  else {
    const e2 = await F.runFetch(F.meta, false);
    if (!e2.ok || !Array.isArray(e2.body))
      return t("info", "There doesn't seem to be a group meta data file."), void b("#" + a2, "<p>Internal error. Hopefully this will be fixed shortly. </p>", r2);
    if (i2) {
      const t2 = function(e3, t3, n3 = document, r3 = location) {
        let o3 = "";
        for (const i3 in e3) {
          const a3 = I(i3, t3), s2 = R(n3, r3) ? "<br />" : "";
          let c2 = e3[i3].desc;
          c2.length > 235 && (c2 = c2.substr(0, 235) + "..."), o3 += '<a class="adjacentItem" href="' + e3[i3].url + '" title="' + c2 + '">' + e3[i3].title + ' <span class="button">' + e3[i3].title + '</span><p id="adjacent' + a3 + '" >Author: ' + e3[i3].auth + " &nbsp; &nbsp; &nbsp;" + s2 + "  Last edit: " + m(e3[i3].date, "Unknown time", true) + " <br />Description: " + c2 + " </p></a>\n";
        }
        return o3;
      }(e2.body, a2, r2, o2);
      b("#" + a2, t2, r2), function(e3, t3 = document) {
        const n3 = t3.querySelectorAll(".top-bar.fullWidth header h1");
        n3.length && (n3[0].textContent.includes("whatsmyname") || n3[0].textContent.includes("XXX")) && (n3[0].textContent = "Group " + e3);
        const r3 = t3.querySelectorAll(".adjacentGroup p");
        r3.length && r3[0].textContent.includes("XXX") && (r3[0].textContent = "Some similar articles in " + e3);
      }(B(o2), r2);
    } else {
      const t2 = function(e3) {
        let t3 = -1, n3 = F.perRow, r3 = [], o3 = 0, i3 = 0;
        for ([t3, n3, o3] = $(H(e3[0].url), F.name, e3.length, o3, t3); o3 < e3.length; o3++) {
          const a3 = e3[o3].title;
          if (a3 && t3 >= 0 && n3 > 0) {
            r3[i3] = { auth: e3[o3].auth, date: m(e3[o3].date, "[Unknown time]", true), url: e3[o3].url, offset: o3, title: e3[o3].title.substr(0, F.titleLimit), desc: e3[o3].desc }, a3.length > F.titleLimit && (r3[i3].title += "...");
            const t4 = e3[o3].desc;
            t4.length > 235 && (r3[i3].desc = t4.substr(0, 235) + "..."), n3--, i3++;
          }
          if ([t3, n3, o3] = $(H(e3[o3].url), F.name, n3, o3, t3), r3.length === e3.length)
            break;
          if (r3.length >= F.perRow)
            break;
        }
        return r3;
      }(e2.body);
      b("#" + a2, function(e3, t3) {
        let n3 = '<ul class="adjacentList">\n';
        for (const r3 in e3) {
          const o3 = I(r3, t3), i3 = P(e3[r3].desc.length > 110), a3 = "Title: " + e3[r3].title + "\nAuthor: " + e3[r3].auth + " &nbsp; &nbsp; Last edit: " + e3[r3].date + "\nDescription: " + e3[r3].desc;
          n3 += '<li> <a id="link' + o3 + '" class="' + i3 + '" href="' + e3[r3].url + '" aria-label="' + a3 + '" >' + e3[r3].title + "</a> </li>\n";
        }
        return n3 += "</ul>", n3;
      }(t2, B(o2)), r2);
    }
  }
}
let _ = {};
async function G(r2, i2 = document, a2 = location) {
  const s2 = { referencesCache: "/resource/XXX-references", gainingElement: "#biblio", losingElement: ".addReferences", renumber: 1, forceToEnd: 1, maxDescripLen: 230, maxAuthLen: 65, debug: e(), runFetch: c };
  if (_ = Object.assign(s2, r2), 0 === i2.querySelectorAll(n).length)
    return void t("info", "URL '" + a2.pathname + "' isn't marked-up for references, so skipped");
  const l2 = i2.querySelector("#biblio");
  l2 && l2.setAttribute("style", ""), i2.querySelector(_.gainingElement + " *").replaceChildren([]), b(_.gainingElement, '<h2 class="biblioSection">References (for mobile UI)</h2> \n<p>The references embedded in the text are displayed here. </p>', i2);
  const u2 = await _.runFetch(f(_.referencesCache, a2), false);
  if (u2.ok && Array.isArray(u2.body)) {
    const e2 = function(e3) {
      let t2 = '<ol class="mobileBiblio">';
      for (const n2 in e3)
        t2 += `<li>
<a href="${e3[n2].url}"> 
<h5>${e3[n2].title}</h5>
<span>${e3[n2].desc}</span>
<span>by ${e3[n2].auth} on ${e3[n2].date}</span>
</a>
</li>
`;
      return t2 += "</ol>", t2;
    }(function(e3) {
      const t2 = ["[No author]", "Resource doesn't set a description tag.", "[No date]"], n2 = [];
      for (const r3 in e3) {
        if (null === e3[r3]) {
          n2.push({ auth: "[No author]", date: "[No date]", desc: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.", offset: parseInt(r3, 10), title: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.", url: o });
          continue;
        }
        const i3 = m(e3[r3].date, t2[2], true);
        let a3 = e3[r3].title + "";
        a3 = a3.replace(".", ".  ");
        let s3 = e3[r3].desc + "";
        s3.length > _.maxDescripLen && (s3 = s3.substring(0, _.maxDescripLen));
        let c2 = e3[r3].auth || t2[0];
        "unknown" === e3[r3].auth && (c2 = t2[0]), c2.length > _.maxAuthLen && (c2 = c2.substring(0, _.maxAuthLen)), n2.push({ auth: c2, date: i3, desc: s3, offset: parseInt(r3, 10), title: a3, url: e3[r3].url });
      }
      return n2;
    }(u2.body));
    !function(e3, t2 = document) {
      if (!_.renumber)
        return;
      const n2 = t2.querySelectorAll(_.losingElement + " sup a");
      for (let e4 = 0; e4 < n2.length; e4++)
        n2[e4].textContent = "" + (e4 + 1), _.forceToEnd && (n2[e4].href = "#biblio");
    }(u2.body, i2), b(_.gainingElement, e2, i2);
  } else {
    const e2 = '<p class="error">Unable to get bibliographic data for this article.</p>';
    b(_.gainingElement, e2, i2), t("warn", "Unable to get meta data " + f(_.referencesCache, a2), JSON.stringify(Array.from(u2.headers.entries())));
  }
}
function W(e2, t2 = document) {
  if ("Escape" === e2.code || "Escape" === e2.key) {
    const e3 = t2.querySelectorAll("details[open]");
    e3.length && (e3[0].open = false);
  }
  return e2.preventDefault(), false;
}
function K(e2, t2 = document) {
  const n2 = function(e3, t3) {
    if (e3.tagName === t3)
      return e3;
    for (; e3.tagName !== t3; ) {
      if ("A" === e3.tagName)
        return e3;
      if ("BODY" === e3.tagName)
        return;
      e3 = e3.parentElement;
    }
    return e3;
  }(e2.target, "DETAILS");
  if (n2 && "A" === n2.tagName)
    return true;
  if (n2) {
    const e3 = n2;
    e3 && e3.open ? e3.open = false : e3.open = true;
  } else {
    const e3 = t2.querySelector("details[open]");
    e3 && (e3.open = false);
  }
  return e2.preventDefault(), false;
}
let Y = { pageInitRun: 0 };
function V(e2, t2) {
  e2.addEventListener("click", t2), e2.addEventListener("touch", t2), e2.addEventListener("keypress", t2);
}
function z(e2, n2 = document) {
  let r2 = null, o2 = "";
  if ("string" == typeof e2)
    o2 = e2, r2 = n2.querySelector(e2);
  else {
    const t2 = e2.target;
    r2 = n2.querySelector("#" + t2.id), o2 = "" + r2.getAttribute("href");
  }
  if (!r2)
    return void t("ERROR", "Malconfigured tabs!! " + e2 + " matches nothing");
  let i2 = n2.querySelectorAll(".tab-title");
  for (let e3 = 0; e3 < i2.length; e3++)
    i2[e3].classList.remove("is-active");
  i2 = n2.querySelectorAll(".tab-title>a");
  for (let e3 = 0; e3 < i2.length; e3++)
    i2[e3].setAttribute("aria-hidden", "true");
  const a2 = n2.querySelectorAll(".tabs-content .tabs-panel");
  for (let e3 = 0; e3 < a2.length; e3++)
    a2[e3].classList.remove("is-active"), a2[e3].setAttribute("aria-hidden", "true");
  const [s2] = n2.querySelectorAll(".tabs-content " + o2);
  s2.classList.add("is-active"), s2.setAttribute("aria-hidden", "false"), r2.parentNode.classList.add("is-active"), r2.setAttribute("aria-hidden", "false");
}
function Q() {
  return Y.pageInitRun;
}
!async function(n2, r2 = document, o2 = location, a2 = window) {
  Y = Object.assign(Y, {}, n2);
  const s2 = e();
  if (Y.pageInitRun)
    return void t("warn", "Extra panda should not be run more than once per page");
  Y.pageInitRun = 1;
  const d2 = r2.querySelectorAll(".noJS");
  for (let e2 = 0; e2 < d2.length; e2++)
    d2[e2].classList.remove("noJS");
  const f2 = r2.querySelector("#pageMenu");
  f2 ? V(f2, (e2) => function(e3 = ".burgerMenu", t2 = document) {
    const n3 = t2.querySelector(e3), r3 = t2.querySelector("#pageMenu i");
    n3.getAttribute("data-state") ? (n3.classList.remove("burgerMenuOpen"), n3.setAttribute("data-state", ""), r3.classList.add("fa-ob1burger"), r3.classList.remove("fa-cancel")) : (n3.classList.add("burgerMenuOpen"), n3.setAttribute("data-state", "1"), r3.classList.remove("fa-ob1burger"), r3.classList.add("fa-cancel"));
  }(".burgerMenu", r2)) : t("info", "This URL '" + o2.pathname + "' has no burger menu"), function(e2 = document, t2 = window) {
    e2.querySelector("body").setAttribute("style", "--offset-height: 0;");
    const n3 = e2.querySelectorAll(".lotsOfWords, .halferWords, .fewWords");
    for (let e3 = 0; e3 < n3.length; e3++)
      n3[e3].setAttribute("style", "--offset-height: " + A(n3[e3], t2)[0] + "px;");
  }(r2, a2), function(e2 = document, t2 = location) {
    if (!h(t2.host) && !R(e2, t2))
      return;
    R(e2, t2) && (e2.querySelector("#sendMasto").textContent = "Share article");
    const n3 = ['<li id="shareClose"> <i class="fa fa-cancel" aria-hidden="true"></i> </li>	<li> <a class="hunchUp" id="copyURL"><i class="fa fa-copy" aria-hidden="true"></i><span class="hunchUp"> copy<br /> URL</span> </a> </li>'], r3 = ["shareMenuTrigger", "siteChartLink", "rssLink"], o3 = Array.from(e2.querySelectorAll(".allButtons a"));
    for (const e3 in o3) {
      if (r3.includes(o3[e3].id))
        continue;
      const t3 = o3[e3].cloneNode(true);
      t3.classList.remove("bigScreenOnly"), n3.push("<li>"), n3.push(t3.outerHTML), n3.push("</li>"), o3[e3].getAttribute("id") && o3[e3].setAttribute("id", "old" + o3[e3].getAttribute("id"));
    }
    n3.unshift('<nav><div class="shareMenu" id="shareMenu"><menu id="mobileMenu">'), n3.push("</menu></div></nav>"), b("#navBar", n3.join("\n"), e2);
  }(r2, o2), M(r2, o2, a2);
  const p2 = null !== r2.querySelector(".addReferences");
  T(p2, r2), function(e2, t2 = document) {
    const n3 = S(true, t2);
    t2.querySelectorAll("article a").forEach(function(r3) {
      "docs" === u(r3).trim().toLowerCase() && (r3.textContent = "", b(r3, '<i class="fa fa-book-open" aria-hidden="true"></i>', t2), r3.setAttribute(e2 ? "aria-label" : "title", "Link to the project docs; it may be a git page, or a separate webpage. "), e2 && q(r3, n3));
    });
  }(p2, r2), function(e2 = document) {
    const t2 = e2.querySelectorAll(".addArrow");
    for (let n3 = 0; n3 < t2.length; n3++)
      b(t2[n3].parentElement, '<i class="fa fa-play specialPointer" aria-hidden="true"></i>', e2);
  }(r2), function(e2 = document) {
    const t2 = new RegExp("`([^`]+)`", "g"), n3 = new RegExp("/ /", "g"), r3 = e2.querySelectorAll(".addBashSamples");
    if (r3.length > 0)
      for (let e3 = 0; e3 < r3.length; e3++)
        r3[e3].innerHTML = r3[e3].innerHTML.replaceAll(t2, '<code class="bashSample" title="Quote from a bash; will add copy button">$1</code>').replaceAll(n3, "//");
  }(r2), function(e2 = document) {
    const t2 = new l().get(i);
    if (!t2)
      return;
    const n3 = JSON.parse(t2);
    if (!n3.ft || !n3.fs)
      return;
    const r3 = "body, .annoyingBody { font-family: " + n3.ft + "; font-size: " + n3.fs + "; direction:" + n3.dn + "; }", o3 = e2.createElement("style");
    o3.setAttribute("id", "client-set-css"), o3.innerText = r3, e2.getElementsByTagName("head")[0].append(o3);
  }(r2), function(e2 = document) {
    const t2 = Array.from(e2.querySelectorAll(".popOverWidget details"));
    t2.length && t2.forEach(function(e3) {
      e3.addEventListener("keydown", W), e3.addEventListener("click", K);
    });
  }(r2), !R(r2, o2) && "/resource/home" !== o2.pathname && r2.querySelectorAll(".reading").length < 2 && function(n3, r3 = document) {
    const o3 = /[ \t\n\r.(),~]/g, i2 = Object.assign({}, { timeFormat: "m", dataLocation: ".blocker", target: "#shareGroup", wordPerMin: 275, codeSelector: "code", refresh: false, debug: e() }, n3), a3 = i2.dataLocation + " img, " + i2.dataLocation + " picture, " + i2.dataLocation + " object";
    let s3 = u(r3.querySelector(i2.dataLocation)).split(o3).filter((e2) => e2).length / i2.wordPerMin;
    if (s3 += r3.querySelectorAll(a3).length / 5, i2.codeSelector && r3.querySelectorAll(i2.codeSelector)) {
      let e2 = 0;
      r3.querySelectorAll(i2.codeSelector).forEach(function(t2) {
        e2 += u(t2).split(o3).filter((e3) => e3).length;
      }), e2 && (s3 += 3 * e2 / i2.wordPerMin);
    }
    if (s3 < 1)
      return void t("info", "No reading time displayed for this article");
    if (i2.refresh) {
      const e2 = r3.querySelector(i2.target + " a.reading");
      e2 && e2.parentNode.removeChild(e2);
    }
    s3 = Math.round(s3);
    const c2 = '<a class="reading" title="See longer version of this reading guide." href="/resource/jQuery-reading-duration">To read: ' + s3 + i2.timeFormat + "</a>";
    b(i2.target, c2, r3);
  }({ dataLocation: "#main", target: ".addReading", debug: s2, refresh: true }, r2);
  {
    const e2 = r2.querySelectorAll(".tabComponent");
    for (let t2 = 0; t2 < e2.length; t2++) {
      const n3 = e2[t2].querySelectorAll(".tab-title a");
      for (let e3 = 0; e3 < n3.length; e3++)
        V(n3[e3], z);
    }
  }
  if (o2.pathname.match("group-")) {
    const e2 = function(e3, t2 = location, n3 = document) {
      const r3 = t2.pathname.split("/group-");
      if (Array.isArray(r3) && r3.length > 1 && "XXX" !== r3[1])
        return r3[1];
      const o3 = new URLSearchParams(t2.search);
      if (o3.has("first"))
        return o3.get("first");
      if (e3 && e3.getAttribute("data-group")) {
        let t3 = e3.getAttribute("data-group");
        return t3 = t3.trim(), t3.split(",").map((e4, t4) => e4.trim())[0];
      }
      throw new Error("KLAXON, KLAXON, I do not know how to build an adjacent list for " + t2.href);
    }(null, o2, r2);
    e2 && await J({ group: e2, debug: s2, runFetch: "adjacentRunFetch" in Y ? Y.adjacentRunFetch : c }, r2, o2);
  } else {
    R(r2, o2) ? await G({ debug: s2, renumber: 1, runFetch: "mobileRunFetch" in Y ? Y.mobileRunFetch : c }, r2, o2) : await k({ debug: s2, runFetch: "desktopRunFetch" in Y ? Y.desktopRunFetch : c, renumber: 1 }, r2, o2);
    const e2 = function(e3, t2 = document) {
      let n3 = t2.querySelector(e3);
      return n3 ? (n3 = n3.getAttribute("data-group"), n3 ? (n3 = n3.split(","), n3 = n3.map((e4, t3) => e4.trim()), "XXX" === n3[0] && n3.shift(), [...n3]) : []) : [];
    }("div#contentGroup", r2);
    if (0 === e2.length)
      t("info", "This URL '" + o2.pathname + "' has no Adjacent groups defined.");
    else
      for (let t2 = 0; t2 < e2.length; t2++)
        await J({ group: e2[t2], debug: s2, iteration: t2, count: e2.length, runFetch: "adjacentRunFetch" in Y ? Y.adjacentRunFetch : c }, r2, o2);
  }
  "function" == typeof document.pageStartup ? document.pageStartup() : t("info", "No article specific scripting found, (it may load manually ATF)");
}();
export {
  b as appendIsland,
  Q as hasBeenRun,
  t as log,
  c as runFetch
};
