class e {
  set(e2, t2, n2) {
    let r2 = "";
    if (n2) {
      const e3 = /* @__PURE__ */ new Date();
      e3.setTime(e3.getTime() + 24 * n2 * 60 * 60 * 1e3), r2 = "expires=" + e3.toUTCString();
    }
    document.cookie = e2 + "=" + t2 + "; " + r2 + "; path=/ ;secure";
  }
  get(e2) {
    const t2 = e2 + "=", n2 = decodeURIComponent(document.cookie).split("; ");
    let r2 = "";
    return n2.forEach((e3) => {
      0 === e3.indexOf(t2) && (r2 = e3.substring(t2.length));
    }), r2;
  }
  wipe(e2) {
    const t2 = /* @__PURE__ */ new Date();
    t2.setTime(t2.getTime() + 288e5);
    const n2 = "expires=" + t2.toUTCString();
    document.cookie = e2 + "= ; " + n2 + "; path=/ ;secure", document.cookie = e2 + "= ; " + n2 + "; path=/ ";
  }
}
function t(e2, t2, n2, r2) {
  const o2 = h();
  e2 = e2.replaceAll(";", "%38"), r2 = r2.replaceAll(";", "%38"), n2 = n2.replaceAll(";", "%38"), t2 = t2.replaceAll(";", "%38");
  const a2 = JSON.stringify({ ft: e2, fs: t2, dn: n2, cr: r2 });
  o2.set(l, a2, 365.254);
}
function n(e2, t2 = "debug") {
  return new URLSearchParams(e2.search).has(t2);
}
let r = console;
function o(e2, ...t2) {
  r.LOG_USAGE++, e2 in console ? r[e2](`[${e2.toUpperCase()}] ${t2.join(", ")}`) : r.log(`[${e2.toUpperCase()}] ${t2.join(", ")}`);
}
const a = ".addReferences", i = a + " sup a", s = "https://owenberesford.me.uk/", l = "appearance", c = 16, u = "showBiblioErrors", d = 180;
async function f(e2, t2, r2) {
  const a2 = function() {
    if ("undefined" != typeof window)
      return window.fetch;
    if ("function" == typeof fetch)
      return fetch;
    throw o("error", "Please stop using old versions of node."), new Error("Please stop using old versions of Node");
  }(), i2 = n(r2);
  try {
    const n2 = await a2(e2, { credentials: "same-origin" });
    if (!n2.ok) {
      if (i2 && o("warn", "Failed to communicate with " + e2), t2)
        return { body: "nothing", headers: {}, ok: false };
      throw new Error("ERROR getting asset " + e2);
    }
    if (404 === n2.status)
      throw new Error("got HTTP 404");
    let r3 = "";
    return r3 = n2.headers.get("content-type").toLowerCase().startsWith("application/json") ? await n2.json() : await n2.text(), i2 && o("info", "Successful JSON transaction " + e2), { body: r3, headers: n2.headers, ok: true };
  } catch (n2) {
    if (i2 && o("error", "KLAXON, KLAXON failed: " + e2 + " " + n2.toString()), t2)
      return { body: "nothing", headers: {}, ok: false };
    throw new Error("ERROR getting asset " + e2 + " " + n2.toString());
  }
}
function h() {
  return "undefined" != typeof document ? new e() : { set(e2, t2, n2) {
  }, get: (e2) => "" };
}
function p(e2) {
  if (e2) {
    if ("textContent" in e2)
      return e2.textContent;
    if ("innerText" in e2)
      return e2.innerText;
    throw new Error("No text found");
  }
  throw new Error("No element for text found");
}
function g(e2) {
  return e2.pathname.split("/").pop() || "<name>";
}
function m(e2, t2) {
  let n2 = [];
  return n2 = t2.pathname.split("/"), (!n2 || n2.length < 2) && (n2 = ["resource", "home"]), e2.replace(/XXX/, n2.pop());
}
function y(e2) {
  return !(!e2.startsWith("192.168.") && "127.0.0.1" !== e2 && "::1" !== e2 && "0:0:0:0:0:0:0:1" !== e2 && "localhost" !== e2);
}
function b(e2, t2 = 80, n2 = "↩") {
  if (!e2 || e2.length < t2)
    return "" + e2;
  let r2 = 0, o2 = [];
  for (; r2 <= e2.length; )
    r2 + t2 > e2.length ? o2.push(e2.substring(r2, r2 + t2)) : o2.push(e2.substring(r2, r2 + t2) + n2), r2 += t2;
  return o2.join("\n");
}
function w(e2) {
  const t2 = /^[0-9]{1,3}$/;
  return Array.from(e2.matchAll(/[^ \t\n\r.(),~]+/g)).filter((e3) => !("" === e3[0] || e3[0].match(t2))).length;
}
function A(e2) {
  let t2 = String(e2);
  if (0 === e2 || e2 < 1)
    throw new Error("Value passed must be a counting number above 0");
  return 1 === t2.length && (t2 = "0" + t2), t2;
}
function S(e2) {
  if (["1", 1, "true", "TRUE", "on", "ON", "yes", "YES", "✔", "✓"].includes(e2))
    return true;
  if (["0", 0, "false", "FALSE", "off", "OFF", "no", "NO", "🗙", "✕", "✖", "✖", "✗", "✘"].includes(e2))
    return false;
  throw new Error("Unknown data " + e2);
}
function L(e2, t2, n2 = true) {
  let r2 = "";
  if (r2 = Number(e2) === e2 && e2 % 1 == 0 ? 0 === e2 ? "[No date]" : e2 < 1e10 ? new Date(1e3 * e2) : new Date(e2) : t2, "string" != typeof r2) {
    const e3 = ["", "Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let t3;
    t3 = r2.getHours() ? A(r2.getHours()) : "00", r2 = " " + A(r2.getDate()) + "-" + (n2 ? e3[r2.getMonth() + 1] : A(r2.getMonth() + 1)) + "-" + r2.getUTCFullYear() + " " + (n2 ? "" : t3 + ":00");
  }
  return r2;
}
function E(e2, t2, n2) {
  try {
    if (null === n2)
      throw new Error("Oh no! No DOM object!!");
    const r2 = n2.createElement("template");
    if (r2.innerHTML = t2, "string" == typeof e2) {
      const t3 = n2.querySelector(e2);
      if (null === t3)
        throw new Error("Oh no! DOM element not found: " + e2);
      return t3.append(r2.content);
    }
    return e2.append(r2.content);
  } catch (e3) {
    o("error", e3.toString());
  }
}
function R(e2) {
  if (void 0 === e2)
    return false;
  const t2 = e2.getComputedStyle.toString().includes("[native code]");
  return !("boolean" != typeof t2 || !t2);
}
function v(e2, t2, n2) {
  try {
    if (!R(n2))
      return -1;
    return e2.getBoundingClientRect()[t2];
  } catch (e3) {
    return o("error", "Missing data:" + e3.message), -1;
  }
}
function k(e2, t2) {
  const n2 = e2.getBoundingClientRect();
  return [Math.round(t2.scrollY + n2.top), Math.round(t2.scrollX + n2.left)];
}
async function q(e2, t2, n2) {
  try {
    if (!n2.navigator.clipboard)
      throw new Error("No clipboard available");
    await n2.navigator.clipboard.writeText(t2.href);
  } catch (e3) {
    o("error", "FAILED: copy URL feature borked " + e3.message + "\nIt will fail on a HTTP site.");
  }
}
function T(e2 = 1040, t2, n2, r2) {
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
function x(e2, t2, n2) {
  const r2 = new URLSearchParams(t2.search);
  try {
    e2.createEvent("TouchEvent");
    return r2.has("mobile") ? S(r2.get("mobile")) : C(e2, n2) > d;
  } catch (e3) {
    return !(!r2.has("mobile") || !S(r2.get("mobile")));
  }
}
function C(e2, t2) {
  try {
    const n2 = e2.createElement("div");
    n2.setAttribute("style", "width:1in;"), e2.body.appendChild(n2);
    const r2 = n2.offsetWidth * t2.devicePixelRatio;
    return n2.remove(), r2;
  } catch (e3) {
    return o("error", "ERROR " + e3.toString()), -1;
  }
}
function X(e2, t2) {
  const n2 = e2.documentElement, r2 = e2.body, o2 = t2.innerWidth || n2.clientWidth || r2.clientWidth, a2 = t2.innerHeight || n2.clientHeight || r2.clientHeight;
  let i2 = 0, s2 = 0;
  return s2 = "string" == typeof a2 ? parseInt(a2, 10) : a2, i2 = "string" == typeof o2 ? parseInt(o2, 10) : o2, [i2, s2];
}
let N = { name: "", meta: "", perRow: 10, titleLimit: 40, rendered: false, iteration: 0, group: "system", count: 1, debug: true, runFetch: f };
function O(e2, t2, n2) {
  let r2 = "", o2 = n2.pathname.split("/").pop();
  const a2 = new URLSearchParams(n2.search);
  return "group-XXX" === o2 && a2.has("first") && (o2 = a2.get("first")), t2 ? a2.has("first") ? r2 += n2.pathname.replace("group-XXX", o2 + "-meta") : r2 += n2.pathname.replace(o2, e2 + "-meta") : r2 += n2.pathname.replace(o2, e2), r2 += n2.search + n2.hash, r2;
}
function M(e2, t2) {
  let n2 = "button";
  return e2 && (n2 += " lower"), n2;
}
function U(e2, t2) {
  return t2 + "" + e2.replace(/[^a-zA-Z0-9_]/g, "_");
}
function j(e2) {
  return e2.split("/").pop();
}
function F(e2) {
  let t2 = N.group;
  if ("XXX" === N.group) {
    const n2 = new URLSearchParams(e2.search);
    n2.has("first") && (t2 = n2.get("first"));
  }
  if ("XXX" === t2)
    throw new Error("Thou shalt supply the group somewhere");
  return t2;
}
function P(e2, t2, n2, r2, o2) {
  return N.name === "group-" + N.group || (t2 === e2 && (o2 = r2), r2 > 0 && o2 > 0 && n2 > 0 && r2 >= n2 - 1 && (r2 = 0)), [o2, n2, r2];
}
async function D(e2, t2, r2, a2) {
  if (N = Object.assign(N, { name: g(r2), meta: O(N.group, ".json", r2), debug: n(r2), runFetch: f }, e2), "system" === N.group)
    throw new Error("Must set the article group, and not to 'system'.");
  N.meta = O(N.group, ".json", r2);
  const i2 = "group-XXX" === N.name || N.name === "group-" + N.group, s2 = "group" + N.group;
  if (x(t2, r2, a2) && !i2)
    1 === t2.querySelectorAll(".adjacentGroup .adjacentItem").length && (t2.querySelector(".adjacentGroup p").style.display = "none"), E("#" + s2, "<p>As mobile View, use the full page link to the left</p>", t2);
  else {
    const e3 = await N.runFetch(N.meta, false, r2);
    if (!e3.ok || !Array.isArray(e3.body))
      return o("info", "There doesn't seem to be a group meta data file."), void E("#" + s2, "<p>Internal error. Hopefully this will be fixed shortly. </p>", t2);
    if (i2) {
      const n2 = function(e4, t3, n3, r3, o2) {
        let a3 = "";
        for (const i3 in e4) {
          const s3 = U(i3, t3), l2 = x(n3, r3, o2) ? "<br />" : "";
          let c2 = e4[i3].desc;
          c2.length > 235 && (c2 = c2.substr(0, 235) + "..."), a3 += '<a class="adjacentItem" href="' + e4[i3].url + '" title="' + c2 + '">' + e4[i3].title + ' <span class="button">' + e4[i3].title + '</span><p id="adjacent' + s3 + '" >Author: ' + e4[i3].auth + " &nbsp; &nbsp; &nbsp;" + l2 + "  Last edit: " + L(e4[i3].date, "Unknown time", true) + " <br />Description: " + c2 + " </p></a>\n";
        }
        return a3;
      }(e3.body, s2, t2, r2, a2);
      E("#groupXXX", n2, t2), function(e4, t3) {
        const n3 = Array.from(t3.querySelectorAll(".top-bar.fullWidth header h1"));
        n3.length && (n3[0].textContent.includes("whatsmyname") || n3[0].textContent.includes("XXX")) && (n3[0].textContent = "Group " + e4);
        const r3 = Array.from(t3.querySelectorAll(".adjacentGroup p"));
        r3.length && r3[0].textContent.includes("XXX") && (r3[0].textContent = "Some similar articles in " + e4);
      }(F(r2), t2);
    } else {
      const n2 = function(e4) {
        let t3 = -1, n3 = N.perRow, r3 = [], o2 = 0, a3 = 0;
        for ([t3, n3, o2] = P(j(e4[0].url), N.name, e4.length, o2, t3); o2 < e4.length; o2++) {
          const i3 = e4[o2].title;
          if (i3 && t3 >= 0 && n3 > 0) {
            r3[a3] = { auth: e4[o2].auth, date: L(e4[o2].date, "[Unknown time]", true), url: e4[o2].url, offset: o2, title: e4[o2].title.substr(0, N.titleLimit), desc: e4[o2].desc }, i3.length > N.titleLimit && (r3[a3].title += "...");
            const t4 = e4[o2].desc;
            t4.length > 235 && (r3[a3].desc = t4.substr(0, 235) + "..."), n3--, a3++;
          }
          if ([t3, n3, o2] = P(j(e4[o2].url), N.name, n3, o2, t3), r3.length === e4.length)
            break;
          if (r3.length >= N.perRow)
            break;
        }
        return r3;
      }(e3.body);
      E("#" + s2, function(e4, t3) {
        let n3 = '<ul class="adjacentList">\n';
        for (const r3 in e4) {
          const o2 = U(r3, t3), a3 = M(e4[r3].desc.length > 110), i3 = "Title: " + e4[r3].title + "\nAuthor: " + e4[r3].auth + " &nbsp; &nbsp; Last edit: " + e4[r3].date + "\nDescription: " + e4[r3].desc;
          n3 += '<li> <a id="link' + o2 + '" class="' + a3 + '" href="' + e4[r3].url + '" aria-label="' + i3 + '" >' + e4[r3].title + "</a> </li>\n";
        }
        return 0 === e4.length ? n3 += "<li> Article doesn't seem setup correctly.</li></ul>" : n3 += '<li><a class="adjacentItem button" href="/resource/group-XXX?first=' + t3 + '" aria-label="This article lists all items in worklog group."> See full list </a></li></ul>', n3;
      }(n2, F(r2)), t2);
    }
  }
}
function I(e2, t2, n2, r2) {
  if (!y(n2.host) && !x(t2, n2, r2))
    return false;
  const o2 = t2.querySelector("#shareMenu");
  return o2 && !o2.classList.replace("shareMenuOpen", "shareMenu") && o2.classList.replace("shareMenu", "shareMenuOpen"), false;
}
function H(e2, t2, n2, r2) {
  const a2 = t2.querySelector("#mastodonserver");
  let i2 = a2.value;
  const s2 = a2.getAttribute("data-url");
  if ("" === i2 || null === i2)
    return false;
  if (i2 = "https://" + i2 + "/share?text=I+think+this+is+important+" + s2, o("info", "Trying to open mastodon server, " + i2), !R(r2))
    throw Error("Test passed, for " + i2);
  return t2.querySelector("#popup").close(), r2.open(i2, "_blank"), x(t2, n2, r2) && I(0, t2, n2, r2), false;
}
function B(e2, t2, n2) {
  let r2 = e2.querySelector("#navBar #mastoTrigger");
  if (!r2)
    return;
  if (G(r2, W, e2, n2), r2 = e2.querySelector("#shareGroup .allButtons #mastoTrigger"), r2) {
    const t3 = function(e3, t4 = "display", n3 = window) {
      let r3 = "";
      e3 && e3.computedStyleMap ? r3 = e3.computedStyleMap()[t4] : e3 && (r3 = n3.getComputedStyle(e3, null).getPropertyValue(t4));
      return r3;
    }(r2, "display", n2);
    t3 && "none" !== t3 && (r2.addEventListener("click", (t4) => W(t4, e2, n2)), r2.addEventListener("keypress", (t4) => W(t4, e2, n2)));
  }
  r2 = e2.querySelector("#copyURL"), r2 && function(e3, t3, n3, r3, o3) {
    e3.addEventListener("click", async (e4) => (await t3(n3, r3, o3), false)), e3.addEventListener("touch", async (e4) => (await t3(n3, r3, o3), false)), e3.addEventListener("keypress", async (e4) => (await t3(n3, r3, o3), false));
  }(r2, q, e2, t2, n2), J(e2.querySelector("#popup #sendMasto"), H, e2, t2, n2);
  const o2 = Array.from(e2.querySelectorAll("#shareMenuTrigger, #shareClose"));
  for (const r3 in o2)
    J(o2[r3], I, e2, t2, n2);
  G(e2.querySelector("#hideMasto"), $, e2, n2);
}
function W(e2, t2, n2) {
  return R(n2) && t2.querySelector("#popup").showModal(), t2.querySelector("#popup input").focus(), false;
}
function $(e2, t2, n2) {
  return R(n2) && t2.querySelector("#popup").close(), false;
}
function G(e2, t2, n2, r2) {
  e2.addEventListener("click", (e3) => (t2(e3, n2, r2), false)), e2.addEventListener("touch", (e3) => (t2(e3, n2, r2), false)), e2.addEventListener("keypress", (e3) => (t2(e3, n2, r2), false));
}
function J(e2, t2, n2, r2, o2) {
  e2.addEventListener("click", (e3) => (t2(e3, n2, r2, o2), false)), e2.addEventListener("touch", (e3) => (t2(e3, n2, r2, o2), false)), e2.addEventListener("keypress", (e3) => (t2(e3, n2, r2, o2), false));
}
function _(e2, t2) {
  let n2 = null, r2 = "";
  if ("string" == typeof e2) {
    r2 = e2;
    const a3 = t2.querySelector(e2);
    if (!a3 || "SECTION" !== a3.tagName)
      throw o("error", "what is this? ", a3.outerHTML, a3.tagName), new Error("Bad call");
    n2 = t2.querySelector('.tabList a[href="' + e2 + '"] ');
  } else {
    const o2 = e2.target;
    n2 = t2.querySelector("#" + o2.id), r2 = "" + n2.getAttribute("href");
  }
  if (!r2)
    return void o("ERROR", "Malconfigured tabs!! " + e2 + " => '" + r2 + "' matches nothing");
  const a2 = Array.from(t2.querySelectorAll(".tab-title"));
  for (let e3 = 0; e3 < a2.length; e3++)
    a2[e3].classList.remove("is-active");
  const i2 = Array.from(t2.querySelectorAll(".tab-title>a"));
  for (let e3 = 0; e3 < i2.length; e3++)
    i2[e3].setAttribute("aria-hidden", "true");
  const s2 = Array.from(t2.querySelectorAll(".tabs-content .tabs-panel"));
  for (let e3 = 0; e3 < s2.length; e3++)
    s2[e3].classList.remove("is-active"), s2[e3].setAttribute("aria-hidden", "true");
  const [l2] = Array.from(t2.querySelectorAll(".tabs-content " + r2));
  l2.classList.add("is-active"), l2.setAttribute("aria-hidden", "false");
  n2.parentNode.classList.add("is-active"), n2.setAttribute("aria-hidden", "false");
}
let K = { referencesCache: "/resource/XXX-references", gainingElement: "#biblio", losingElement: ".addReferences", renumber: 1, forceToEnd: 1, maxDescripLen: 230, maxAuthLen: 65, debug: true, runFetch: f };
async function Y(e2, t2, r2) {
  if (K = Object.assign(K, { debug: n(r2) }, e2), 0 === t2.querySelectorAll(a).length)
    return void o("info", "URL '" + r2.pathname + "' isn't marked-up for references, so skipped");
  const i2 = t2.querySelector("#biblio");
  i2 && i2.setAttribute("style", ""), t2.querySelector(K.gainingElement + " *").replaceChildren(), E(K.gainingElement, '<h2 class="biblioSection">References (for mobile UI)</h2> \n<p>The references embedded in the text are displayed here. </p>', t2);
  const l2 = await K.runFetch(m(K.referencesCache, r2), false, r2);
  if (l2.ok && Array.isArray(l2.body)) {
    const e3 = function(e4) {
      let t3 = '<aside role="footnote"><ol class="mobileBiblio">';
      for (const n2 in e4)
        t3 += `<li>
<a href="${e4[n2].url}"> 
<h5>${e4[n2].title}</h5>
<span>${e4[n2].desc}</span>
<span>by ${e4[n2].auth} on ${e4[n2].date}</span>
</a>
</li>
`;
      return t3 += "</ol></aside>", t3;
    }(function(e4) {
      const t3 = ["[No author]", "Resource doesn't set a description tag.", "[No date]"], n2 = [];
      for (const r3 in e4) {
        if (null === e4[r3]) {
          n2.push({ auth: "[No author]", date: "[No date]", desc: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.", offset: parseInt(r3, 10), title: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.", url: s });
          continue;
        }
        const o2 = L(e4[r3].date, t3[2], true);
        let a2 = e4[r3].title + "";
        a2 = a2.replace(".", ".  ");
        let i3 = e4[r3].desc + "";
        i3.length > K.maxDescripLen && (i3 = i3.substring(0, K.maxDescripLen));
        let l3 = e4[r3].auth || t3[0];
        "unknown" === e4[r3].auth && (l3 = t3[0]), l3.length > K.maxAuthLen && (l3 = l3.substring(0, K.maxAuthLen)), n2.push({ auth: l3, date: o2, desc: i3, offset: parseInt(r3, 10), title: a2, url: e4[r3].url });
      }
      return n2;
    }(l2.body));
    !function(e4, t3) {
      if (!K.renumber)
        return;
      const n2 = Array.from(t3.querySelectorAll(K.losingElement + " sup a"));
      for (let e5 = 0; e5 < n2.length; e5++)
        n2[e5].textContent = "" + (e5 + 1), K.forceToEnd && (n2[e5].href = "#biblio");
    }(l2.body, t2), E(K.gainingElement, e3, t2);
  } else {
    const e3 = '<p class="error">Unable to get bibliographic data for this article.</p>';
    E(K.gainingElement, e3, t2), o("warn", "Unable to get meta data " + m(K.referencesCache, r2), JSON.stringify(Array.from(l2.headers.entries())));
  }
}
let V = { indexUpdated: 0, gainingElement: "#biblio", referencesCache: "/resource/XXX-references", renumber: 1, maxAuthLen: 65, debug: true, runFetch: f };
function z(e2) {
  const t2 = "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.";
  return "Reference popup for link [" + (e2 + 1) + "]\n\nHTTP_ERROR, Site admin: recompile this meta file, as this is a new link.\n " + L(+/* @__PURE__ */ new Date("07-June-2024"), "not used", true) + "\n\n" + t2;
}
function Q(e2, t2) {
  if (null === e2)
    return;
  const n2 = v(e2, "left", t2), r2 = v(e2, "top", t2);
  if (-1 === n2 && -1 === r2)
    return;
  let o2 = e2.parentNode;
  const a2 = ["LI", "SUP", "UL", "OL", "SPAN", "P"];
  for (; a2.includes(o2.tagName); )
    o2 = o2.parentNode;
  const i2 = Math.round(v(o2, "left", t2)), s2 = Math.round(v(o2, "top", t2)), l2 = Math.round(v(o2, "width", t2)), u2 = 30 * c, d2 = 5 * c;
  l2 < 650 ? e2.classList.add("leanCentre") : (n2 > i2 + l2 - u2 && e2.classList.add("leanLeft"), n2 < i2 + u2 && e2.classList.add("leanRight"), e2.classList.contains("leanRight") && e2.classList.contains("leanLeft") && (e2.classList.remove("leanRight"), e2.classList.remove("leanLeft"), e2.classList.add("leanCentre")));
  r2 < s2 - d2 && e2.classList.add("leanDown"), r2 > s2 + Math.round(v(o2, "height", t2)) && e2.classList.add("leanUp");
}
async function Z(e2, t2, r2, s2) {
  if (V = Object.assign(V, { debug: n(r2) }, e2), 0 === t2.querySelectorAll(a).length)
    return void o("info", "This URL '" + r2.pathname + "' isn't marked-up for references, so skipped");
  const l2 = await V.runFetch(m(V.referencesCache, r2), false, r2);
  if (l2.ok && Array.isArray(l2.body)) {
    if (t2.querySelectorAll(i).length < l2.body.length)
      throw new Error("Recompile the meta data for  " + r2.pathname);
    const e3 = t2.querySelector("#biblio");
    e3 && e3.setAttribute("style", ""), function(e4, t3) {
      let n3 = e4.headers.get("last-modified");
      if (!n3)
        return;
      n3.indexOf("BST") > 0 && (n3 = n3.substring(0, n3.length - 4));
      const r3 = new Date(n3).getTime();
      r3 > 0 && E(".addReading .ultraSkinny", '<span>Links updated <time datetime="' + r3 + '" title="When this was last recompiled">' + new Date(r3).toLocaleDateString("en-GB", { hour12: false, dateStyle: "medium" }) + "</time> </span>", t3);
    }(l2, t2);
    const n2 = function(e4) {
      const t3 = ["[No author]", "Resource doesn't set a description tag.", "[No date]"], n3 = [];
      for (let r3 = 0; r3 < e4.length; r3++) {
        if (null === e4[r3]) {
          n3.push(z(r3));
          continue;
        }
        const o2 = L(e4[r3].date, t3[2], true);
        let a2 = e4[r3].title + "", i2 = e4[r3].desc;
        i2 = b(i2, 80), a2 = a2.replace(".", ". "), a2 = b(a2, 80);
        let s3 = e4[r3].auth || t3[0];
        "unknown" === e4[r3].auth && (s3 = t3[0]), s3.length > V.maxAuthLen && (s3 = s3.substring(0, V.maxAuthLen)), n3.push("Reference popup for link [" + (r3 + 1) + "]\n\n" + a2 + "\n" + s3 + " " + o2 + "\n\n" + i2);
      }
      return n3;
    }(l2.body);
    !function(e4, t3, n3) {
      let r3 = 1;
      const o2 = Array.from(t3.querySelectorAll(i));
      if (e4.length > o2.length)
        throw t3.querySelector(a).classList.add(u), t3.querySelector("p[role=status]").textContent += " Recompile meta data. ", new Error("Too many references in meta-data for this article, pls recompile.");
      for (let t4 = 0; t4 < e4.length; t4++)
        o2[t4].setAttribute("aria-label", "" + e4[t4]), Q(o2[t4], n3), V.renumber && (o2[t4].textContent = "" + r3), r3++;
      if (o2.length > e4.length) {
        t3.querySelector("p[role=status]").textContent += "Recompile meta data";
        let r4 = e4.length;
        for (; r4 < o2.length; ) {
          const e5 = z(r4);
          o2[r4].setAttribute("aria-label", "" + e5), Q(o2[r4], n3), V.renumber && (o2[r4].textContent = "" + (r4 + 1)), r4++;
        }
      }
    }(n2, t2, s2), t2.querySelector(a).classList.add(u);
  } else {
    !function(e4, t3) {
      const n2 = g(t3), r3 = Array.from(e4.querySelectorAll(i));
      for (let e5 = 0; e5 < r3.length; e5++) {
        const t4 = `Reference popup for link [${1 + e5}]
ERROR: No valid biblio file found.
site admin, today
HTTP_ERROR, no valid file called ${n2}-references.json found.
`;
        r3[e5].setAttribute("aria-label", "" + t4);
      }
      e4.querySelector(a).classList.add(u);
    }(t2, r2);
    const e3 = '<p class="error">Unable to get bibliographic data for this article.</p>';
    E(V.gainingElement, e3, t2), o("warn", "Unable to get meta data " + m(V.referencesCache, r2), JSON.stringify(Array.from(l2.headers.entries())));
  }
}
function ee(e2, t2, n2) {
  t2.querySelectorAll("article a").forEach(function(r2) {
    "git" === p(r2).trim().toLowerCase() && (r2.textContent = "", E(r2, '<i class="fa fa-github" aria-hidden="true"></i> \n		 <span class="sr-only">git</span>', t2), e2 ? (r2.setAttribute("aria-label", function(e3) {
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
    }(r2.getAttribute("href"))), Q(r2, n2)) : r2.setAttribute("title", "Link to a github project."));
  });
}
function te(e2, t2) {
  let n2 = 0;
  return t2.querySelectorAll(e2).forEach(function(e3) {
    n2 += w(p(e3));
  }), n2;
}
function ne(e2, t2) {
  const n2 = e2.target, r2 = function(e3, t3) {
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
  }(n2, "DETAILS");
  if (r2 && "A" === r2.tagName)
    return true;
  if (r2) {
    const t3 = r2;
    if (e2.preventDefault(), e2.stopPropagation(), t3 && t3.open) {
      if ("SUMMARY" !== n2.tagName && null !== t3.querySelector("code"))
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
function re(e2) {
  const t2 = Array.from(e2.querySelectorAll(".popOverWidget details"));
  t2.length && (o("info", "Modal widget found, extra UI features added"), t2.forEach(function(t3) {
    t3.addEventListener("click", function(t4) {
      return ne(t4, e2);
    });
  }), e2.body.addEventListener("click", function(t3) {
    return ne(t3, e2);
  }), e2.body.addEventListener("keydown", function(t3) {
    return function(e3, t4) {
      if ("Escape" === e3.code || "Escape" === e3.key) {
        const n2 = Array.from(t4.querySelectorAll("details[open]"));
        if (n2.length)
          for (let e4 = 0; e4 < n2.length; e4++)
            n2[e4].open = false;
        return e3.preventDefault(), false;
      }
      return true;
    }(t3, e2);
  }));
}
let oe = { pageInitRun: 0 };
function ae() {
  return oe.pageInitRun;
}
!async function(e2, t2, r2, a2) {
  oe = Object.assign(oe, {}, e2);
  const i2 = n(r2);
  if (oe.pageInitRun)
    return void o("warn", "Extra panda should not be run more than once per page");
  oe.pageInitRun = 1;
  const s2 = Array.from(t2.querySelectorAll(".noJS"));
  for (let e3 = 0; e3 < s2.length; e3++)
    s2[e3].classList.remove("noJS");
  !function(e3, t3) {
    e3.querySelector("body").setAttribute("style", "--offset-height: 0;");
    const n2 = Array.from(e3.querySelectorAll(".lotsOfWords, .halferWords, .fewWords"));
    for (let e4 = 0; e4 < n2.length; e4++)
      n2[e4].setAttribute("style", "--offset-height: " + k(n2[e4], t3)[0] + "px;");
  }(t2, a2), function(e3, t3, r3) {
    const o2 = x(e3, t3, r3);
    if (!y(t3.host) && !o2)
      return;
    o2 && (e3.querySelector("#sendMasto").textContent = "Share article");
    const a3 = ['<li id="shareClose"> <i class="fa fa-cancel" aria-hidden="true"></i> </li>	<li> <a class="hunchUp" id="copyURL"><i class="fa fa-copy" aria-hidden="true"></i><span class="hunchUp"> copy<br /> URL</span> </a> </li>'], i3 = ["shareMenuTrigger", "siteChartLink", "rssLink"], s3 = Array.from(e3.querySelectorAll(".allButtons a")), l2 = !y(t3.host) && !n(t3), c3 = e3.querySelector(".allButtons");
    for (const e4 in s3) {
      if (i3.includes(s3[e4].id))
        continue;
      const t4 = s3[e4].cloneNode(true);
      l2 && c3.removeChild(s3[e4]), t4.classList.remove("bigScreenOnly"), a3.push("<li>"), a3.push(t4.outerHTML), a3.push("</li>"), s3[e4].getAttribute("id") && s3[e4].setAttribute("id", "old" + s3[e4].getAttribute("id"));
    }
    a3.unshift('<nav><div class="shareMenu" id="shareMenu"><menu id="mobileMenu">'), a3.push("</menu></div></nav>"), E("#navBar", a3.join("\n"), e3);
  }(t2, r2, a2), B(t2, r2, a2);
  const c2 = null !== t2.querySelector(".addReferences");
  if (ee(c2, t2, a2), function(e3, t3, n2) {
    t3.querySelectorAll("article a").forEach(function(r3) {
      "docs" === p(r3).trim().toLowerCase() && (r3.textContent = "", E(r3, '<i class="fa fa-book-open" aria-hidden="true"></i>\n		 <span class="sr-only">docs</span>', t3), r3.setAttribute(e3 ? "aria-label" : "title", "Link to the project docs; it may be a git page, or a separate webpage. "), e3 && Q(r3, n2));
    });
  }(c2, t2, a2), function(e3) {
    const t3 = Array.from(e3.querySelectorAll(".addArrow"));
    for (let n2 = 0; n2 < t3.length; n2++)
      E(t3[n2].parentElement, '<i class="fa fa-play specialPointer" aria-hidden="true"></i>', e3);
  }(t2), function(e3) {
    const t3 = new RegExp("`([^`]+)`", "g"), n2 = new RegExp("/ /", "g"), r3 = Array.from(e3.querySelectorAll(".addBashSamples"));
    if (r3.length > 0)
      for (let e4 = 0; e4 < r3.length; e4++)
        r3[e4].innerHTML = r3[e4].innerHTML.replaceAll(t3, '<code class="bashSample" title="Quote from a bash; will add copy button">$1</code>').replaceAll(n2, "//");
  }(t2), function(e3) {
    const t3 = h().get(l);
    if (!t3)
      return;
    const n2 = JSON.parse(t3);
    if (n2.ft = n2.ft.replaceAll("%38", ";"), n2.cr = n2.cr.replaceAll("%38", ";"), n2.dn = n2.dn.replaceAll("%38", ";"), n2.fs = n2.fs.replaceAll("%38", ";"), !n2.ft || !n2.fs)
      return;
    const r3 = "body, .annoyingBody { font-family: " + n2.ft + "; font-size: " + n2.fs + "; direction:" + n2.dn + "; }", o2 = e3.createElement("style");
    o2.setAttribute("id", "client-set-css"), o2.innerText = r3, e3.getElementsByTagName("head")[0].append(o2);
  }(t2), re(t2), T(1040, t2, r2, a2), !x(t2, r2, a2) && "/resource/home" !== r2.pathname && t2.querySelectorAll(".reading").length < 2 && function(e3, t3, r3) {
    const a3 = Object.assign({}, { timeFormat: "m", dataLocation: ".blocker", target: "#shareGroup", wordPerMin: 275, codeSelector: "code", refresh: false, debug: n(r3) }, e3), i3 = a3.dataLocation + " img, " + a3.dataLocation + " picture, " + a3.dataLocation + " object", s3 = te(a3.dataLocation, t3);
    if (!s3)
      return;
    let l2 = 0;
    a3.codeSelector && (l2 += te(a3.codeSelector, t3));
    let c3 = (s3 - l2) / a3.wordPerMin + 5 * t3.querySelectorAll(i3).length + 2 * l2 / a3.wordPerMin;
    if (c3 < 1)
      return void o("info", "No reading time displayed for this article");
    if (a3.refresh) {
      const e4 = t3.querySelector(a3.target + " a.reading");
      e4 && e4.parentNode.removeChild(e4);
    }
    c3 = Math.round(c3);
    const u2 = '<a class="reading" title="The text is ' + (l2 + s3) + ' normalised words long.  Link is a longer version of this reading guide guesstimate." href="/resource/jQuery-reading-duration">To read: ' + c3 + a3.timeFormat + "</a>";
    E(a3.target, u2, t3);
  }({ dataLocation: "#main", target: ".addReading", debug: i2, refresh: true }, t2, r2), function(e3, t3) {
    const n2 = e3.querySelectorAll(".tabComponent");
    for (let t4 = 0; t4 < n2.length; t4++) {
      const a3 = Array.from(n2[t4].querySelectorAll(".tab-title a"));
      for (let t5 = 0; t5 < a3.length; t5++)
        o2 = (t6) => {
          _(t6, e3);
        }, (r3 = a3[t5]).addEventListener("click", o2), r3.addEventListener("touch", o2), r3.addEventListener("keypress", o2);
    }
    var r3, o2;
    "" !== t3.hash && _(t3.hash, e3);
  }(t2, r2), r2.pathname.match("group-")) {
    const e3 = function(e4, t3) {
      const n2 = t3.pathname.split("/group-");
      if (Array.isArray(n2) && n2.length > 1 && "XXX" !== n2[1])
        return n2[1];
      const r3 = new URLSearchParams(t3.search);
      if (r3.has("first"))
        return r3.get("first");
      if (e4 && e4.getAttribute("data-group")) {
        let t4 = e4.getAttribute("data-group");
        return t4 = t4.trim(), t4.split(",").map((e5, t5) => e5.trim())[0];
      }
      throw new Error("KLAXON, KLAXON, I do not know how to build an adjacent list for " + t3.href);
    }(null, r2);
    e3 && await D({ group: e3, debug: i2, runFetch: "adjacentRunFetch" in oe ? oe.adjacentRunFetch : f }, t2, r2, a2);
  } else {
    x(t2, r2, a2) ? await Y({ debug: i2, renumber: 1, runFetch: "mobileRunFetch" in oe ? oe.mobileRunFetch : f }, t2, r2) : await Z({ debug: i2, renumber: 1, runFetch: "desktopRunFetch" in oe ? oe.desktopRunFetch : f }, t2, r2, a2);
    const e3 = function(e4, t3 = document) {
      const n2 = t3.querySelector(e4);
      if (!n2)
        return [];
      const r3 = n2.getAttribute("data-group");
      if (!r3)
        return [];
      let o2 = r3.split(",");
      return o2 = o2.map((e5, t4) => e5.trim()), "XXX" === o2[0] && o2.shift(), [...o2];
    }("div#contentGroup", t2);
    if (0 === e3.length)
      o("info", "This URL '" + r2.pathname + "' has no Adjacent groups defined.");
    else
      for (let n2 = 0; n2 < e3.length; n2++)
        await D({ group: e3[n2], debug: i2, iteration: n2, count: e3.length, runFetch: "adjacentRunFetch" in oe ? oe.adjacentRunFetch : f }, t2, r2, a2);
  }
  n(r2, "select") && (o("info", "select and word count feature is ENABLED.  Access= <alt> + w"), t2.body.addEventListener("keydown", (e3) => {
    "w" === e3.key && e3.altKey && o("info", "Word count of selection: " + w(function(e4) {
      try {
        const t3 = e4.getSelection().getRangeAt(0);
        return t3.startOffset === t3.endOffset ? "" : "" + t3.cloneContents().textContent;
      } catch (e5) {
        return o("warn", "Unable to get data for selection", e5.message), "";
      }
    }(a2)));
  })), "undefined" != typeof document && "function" == typeof document.pageStartup ? document.pageStartup() : o("info", "No article specific scripting found, (it may load manually ATF)");
}({}, document, location, window);
export {
  E as appendIsland,
  C as calcScreenDPI,
  X as currentSize,
  ae as hasBeenRun,
  x as isMobile,
  o as log,
  f as runFetch,
  t as storeAppearance
};
