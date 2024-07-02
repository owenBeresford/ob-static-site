function e(e2) {
  return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
}
function t(e2) {
  return e2 instanceof Map ? e2.clear = e2.delete = e2.set = function() {
    throw new Error("map is read-only");
  } : e2 instanceof Set && (e2.add = e2.clear = e2.delete = function() {
    throw new Error("set is read-only");
  }), Object.freeze(e2), Object.getOwnPropertyNames(e2).forEach((n2) => {
    const r2 = e2[n2], i2 = typeof r2;
    "object" !== i2 && "function" !== i2 || Object.isFrozen(r2) || t(r2);
  }), e2;
}
class n {
  constructor(e2) {
    void 0 === e2.data && (e2.data = {}), this.data = e2.data, this.isMatchIgnored = false;
  }
  ignoreMatch() {
    this.isMatchIgnored = true;
  }
}
function r(e2) {
  return e2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
function i(e2, ...t2) {
  const n2 = /* @__PURE__ */ Object.create(null);
  for (const t3 in e2)
    n2[t3] = e2[t3];
  return t2.forEach(function(e3) {
    for (const t3 in e3)
      n2[t3] = e3[t3];
  }), n2;
}
const o = (e2) => !!e2.scope;
class s {
  constructor(e2, t2) {
    this.buffer = "", this.classPrefix = t2.classPrefix, e2.walk(this);
  }
  addText(e2) {
    this.buffer += r(e2);
  }
  openNode(e2) {
    if (!o(e2))
      return;
    const t2 = ((e3, { prefix: t3 }) => {
      if (e3.startsWith("language:"))
        return e3.replace("language:", "language-");
      if (e3.includes(".")) {
        const n2 = e3.split(".");
        return [`${t3}${n2.shift()}`, ...n2.map((e4, t4) => `${e4}${"_".repeat(t4 + 1)}`)].join(" ");
      }
      return `${t3}${e3}`;
    })(e2.scope, { prefix: this.classPrefix });
    this.span(t2);
  }
  closeNode(e2) {
    o(e2) && (this.buffer += "</span>");
  }
  value() {
    return this.buffer;
  }
  span(e2) {
    this.buffer += `<span class="${e2}">`;
  }
}
const a = (e2 = {}) => {
  const t2 = { children: [] };
  return Object.assign(t2, e2), t2;
};
class c {
  constructor() {
    this.rootNode = a(), this.stack = [this.rootNode];
  }
  get top() {
    return this.stack[this.stack.length - 1];
  }
  get root() {
    return this.rootNode;
  }
  add(e2) {
    this.top.children.push(e2);
  }
  openNode(e2) {
    const t2 = a({ scope: e2 });
    this.add(t2), this.stack.push(t2);
  }
  closeNode() {
    if (this.stack.length > 1)
      return this.stack.pop();
  }
  closeAllNodes() {
    for (; this.closeNode(); )
      ;
  }
  toJSON() {
    return JSON.stringify(this.rootNode, null, 4);
  }
  walk(e2) {
    return this.constructor._walk(e2, this.rootNode);
  }
  static _walk(e2, t2) {
    return "string" == typeof t2 ? e2.addText(t2) : t2.children && (e2.openNode(t2), t2.children.forEach((t3) => this._walk(e2, t3)), e2.closeNode(t2)), e2;
  }
  static _collapse(e2) {
    "string" != typeof e2 && e2.children && (e2.children.every((e3) => "string" == typeof e3) ? e2.children = [e2.children.join("")] : e2.children.forEach((e3) => {
      c._collapse(e3);
    }));
  }
}
class l extends c {
  constructor(e2) {
    super(), this.options = e2;
  }
  addText(e2) {
    "" !== e2 && this.add(e2);
  }
  startScope(e2) {
    this.openNode(e2);
  }
  endScope() {
    this.closeNode();
  }
  __addSublanguage(e2, t2) {
    const n2 = e2.root;
    t2 && (n2.scope = `language:${t2}`), this.add(n2);
  }
  toHTML() {
    return new s(this, this.options).value();
  }
  finalize() {
    return this.closeAllNodes(), true;
  }
}
function u(e2) {
  return e2 ? "string" == typeof e2 ? e2 : e2.source : null;
}
function g(e2) {
  return p("(?=", e2, ")");
}
function d(e2) {
  return p("(?:", e2, ")*");
}
function h(e2) {
  return p("(?:", e2, ")?");
}
function p(...e2) {
  return e2.map((e3) => u(e3)).join("");
}
function f(...e2) {
  const t2 = function(e3) {
    const t3 = e3[e3.length - 1];
    return "object" == typeof t3 && t3.constructor === Object ? (e3.splice(e3.length - 1, 1), t3) : {};
  }(e2);
  return "(" + (t2.capture ? "" : "?:") + e2.map((e3) => u(e3)).join("|") + ")";
}
function m(e2) {
  return new RegExp(e2.toString() + "|").exec("").length - 1;
}
const b = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
function _(e2, { joinWith: t2 }) {
  let n2 = 0;
  return e2.map((e3) => {
    n2 += 1;
    const t3 = n2;
    let r2 = u(e3), i2 = "";
    for (; r2.length > 0; ) {
      const e4 = b.exec(r2);
      if (!e4) {
        i2 += r2;
        break;
      }
      i2 += r2.substring(0, e4.index), r2 = r2.substring(e4.index + e4[0].length), "\\" === e4[0][0] && e4[1] ? i2 += "\\" + String(Number(e4[1]) + t3) : (i2 += e4[0], "(" === e4[0] && n2++);
    }
    return i2;
  }).map((e3) => `(${e3})`).join(t2);
}
const y = "[a-zA-Z]\\w*", w = "[a-zA-Z_]\\w*", x = "\\b\\d+(\\.\\d+)?", v = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", E = "\\b(0b[01]+)", k = { begin: "\\\\[\\s\\S]", relevance: 0 }, j = { scope: "string", begin: "'", end: "'", illegal: "\\n", contains: [k] }, O = { scope: "string", begin: '"', end: '"', illegal: "\\n", contains: [k] }, N = function(e2, t2, n2 = {}) {
  const r2 = i({ scope: "comment", begin: e2, end: t2, contains: [] }, n2);
  r2.contains.push({ scope: "doctag", begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)", end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/, excludeBegin: true, relevance: 0 });
  const o2 = f("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
  return r2.contains.push({ begin: p(/[ ]+/, "(", o2, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), r2;
}, M = N("//", "$"), S = N("/\\*", "\\*/"), R = N("#", "$"), A = { scope: "number", begin: x, relevance: 0 }, T = { scope: "number", begin: v, relevance: 0 }, I = { scope: "number", begin: E, relevance: 0 }, L = { scope: "regexp", begin: /\/(?=[^/\n]*\/)/, end: /\/[gimuy]*/, contains: [k, { begin: /\[/, end: /\]/, relevance: 0, contains: [k] }] }, B = { scope: "title", begin: y, relevance: 0 }, C = { scope: "title", begin: w, relevance: 0 }, D = { begin: "\\.\\s*" + w, relevance: 0 };
var P = Object.freeze({ __proto__: null, APOS_STRING_MODE: j, BACKSLASH_ESCAPE: k, BINARY_NUMBER_MODE: I, BINARY_NUMBER_RE: E, COMMENT: N, C_BLOCK_COMMENT_MODE: S, C_LINE_COMMENT_MODE: M, C_NUMBER_MODE: T, C_NUMBER_RE: v, END_SAME_AS_BEGIN: function(e2) {
  return Object.assign(e2, { "on:begin": (e3, t2) => {
    t2.data._beginMatch = e3[1];
  }, "on:end": (e3, t2) => {
    t2.data._beginMatch !== e3[1] && t2.ignoreMatch();
  } });
}, HASH_COMMENT_MODE: R, IDENT_RE: y, MATCH_NOTHING_RE: /\b\B/, METHOD_GUARD: D, NUMBER_MODE: A, NUMBER_RE: x, PHRASAL_WORDS_MODE: { begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/ }, QUOTE_STRING_MODE: O, REGEXP_MODE: L, RE_STARTERS_RE: "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", SHEBANG: (e2 = {}) => {
  const t2 = /^#![ ]*\//;
  return e2.binary && (e2.begin = p(t2, /.*\b/, e2.binary, /\b.*/)), i({ scope: "meta", begin: t2, end: /$/, relevance: 0, "on:begin": (e3, t3) => {
    0 !== e3.index && t3.ignoreMatch();
  } }, e2);
}, TITLE_MODE: B, UNDERSCORE_IDENT_RE: w, UNDERSCORE_TITLE_MODE: C });
function $(e2, t2) {
  "." === e2.input[e2.index - 1] && t2.ignoreMatch();
}
function H(e2, t2) {
  void 0 !== e2.className && (e2.scope = e2.className, delete e2.className);
}
function z(e2, t2) {
  t2 && e2.beginKeywords && (e2.begin = "\\b(" + e2.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", e2.__beforeBegin = $, e2.keywords = e2.keywords || e2.beginKeywords, delete e2.beginKeywords, void 0 === e2.relevance && (e2.relevance = 0));
}
function U(e2, t2) {
  Array.isArray(e2.illegal) && (e2.illegal = f(...e2.illegal));
}
function q(e2, t2) {
  if (e2.match) {
    if (e2.begin || e2.end)
      throw new Error("begin & end are not supported with match");
    e2.begin = e2.match, delete e2.match;
  }
}
function W(e2, t2) {
  void 0 === e2.relevance && (e2.relevance = 1);
}
const X = (e2, t2) => {
  if (!e2.beforeMatch)
    return;
  if (e2.starts)
    throw new Error("beforeMatch cannot be used with starts");
  const n2 = Object.assign({}, e2);
  Object.keys(e2).forEach((t3) => {
    delete e2[t3];
  }), e2.keywords = n2.keywords, e2.begin = p(n2.beforeMatch, g(n2.begin)), e2.starts = { relevance: 0, contains: [Object.assign(n2, { endsParent: true })] }, e2.relevance = 0, delete n2.beforeMatch;
}, G = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"], K = "keyword";
function F(e2, t2, n2 = K) {
  const r2 = /* @__PURE__ */ Object.create(null);
  return "string" == typeof e2 ? i2(n2, e2.split(" ")) : Array.isArray(e2) ? i2(n2, e2) : Object.keys(e2).forEach(function(n3) {
    Object.assign(r2, F(e2[n3], t2, n3));
  }), r2;
  function i2(e3, n3) {
    t2 && (n3 = n3.map((e4) => e4.toLowerCase())), n3.forEach(function(t3) {
      const n4 = t3.split("|");
      r2[n4[0]] = [e3, Z(n4[0], n4[1])];
    });
  }
}
function Z(e2, t2) {
  return t2 ? Number(t2) : function(e3) {
    return G.includes(e3.toLowerCase());
  }(e2) ? 0 : 1;
}
const V = {}, J = (e2) => {
  console.error(e2);
}, Q = (e2, ...t2) => {
  console.log(`WARN: ${e2}`, ...t2);
}, Y = (e2, t2) => {
  V[`${e2}/${t2}`] || (console.log(`Deprecated as of ${e2}. ${t2}`), V[`${e2}/${t2}`] = true);
}, ee = new Error();
function te(e2, t2, { key: n2 }) {
  let r2 = 0;
  const i2 = e2[n2], o2 = {}, s2 = {};
  for (let e3 = 1; e3 <= t2.length; e3++)
    s2[e3 + r2] = i2[e3], o2[e3 + r2] = true, r2 += m(t2[e3 - 1]);
  e2[n2] = s2, e2[n2]._emit = o2, e2[n2]._multi = true;
}
function ne(e2) {
  !function(e3) {
    e3.scope && "object" == typeof e3.scope && null !== e3.scope && (e3.beginScope = e3.scope, delete e3.scope);
  }(e2), "string" == typeof e2.beginScope && (e2.beginScope = { _wrap: e2.beginScope }), "string" == typeof e2.endScope && (e2.endScope = { _wrap: e2.endScope }), function(e3) {
    if (Array.isArray(e3.begin)) {
      if (e3.skip || e3.excludeBegin || e3.returnBegin)
        throw J("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), ee;
      if ("object" != typeof e3.beginScope || null === e3.beginScope)
        throw J("beginScope must be object"), ee;
      te(e3, e3.begin, { key: "beginScope" }), e3.begin = _(e3.begin, { joinWith: "" });
    }
  }(e2), function(e3) {
    if (Array.isArray(e3.end)) {
      if (e3.skip || e3.excludeEnd || e3.returnEnd)
        throw J("skip, excludeEnd, returnEnd not compatible with endScope: {}"), ee;
      if ("object" != typeof e3.endScope || null === e3.endScope)
        throw J("endScope must be object"), ee;
      te(e3, e3.end, { key: "endScope" }), e3.end = _(e3.end, { joinWith: "" });
    }
  }(e2);
}
function re(e2) {
  function t2(t3, n3) {
    return new RegExp(u(t3), "m" + (e2.case_insensitive ? "i" : "") + (e2.unicodeRegex ? "u" : "") + (n3 ? "g" : ""));
  }
  class n2 {
    constructor() {
      this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
    }
    addRule(e3, t3) {
      t3.position = this.position++, this.matchIndexes[this.matchAt] = t3, this.regexes.push([t3, e3]), this.matchAt += m(e3) + 1;
    }
    compile() {
      0 === this.regexes.length && (this.exec = () => null);
      const e3 = this.regexes.map((e4) => e4[1]);
      this.matcherRe = t2(_(e3, { joinWith: "|" }), true), this.lastIndex = 0;
    }
    exec(e3) {
      this.matcherRe.lastIndex = this.lastIndex;
      const t3 = this.matcherRe.exec(e3);
      if (!t3)
        return null;
      const n3 = t3.findIndex((e4, t4) => t4 > 0 && void 0 !== e4), r3 = this.matchIndexes[n3];
      return t3.splice(0, n3), Object.assign(t3, r3);
    }
  }
  class r2 {
    constructor() {
      this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
    }
    getMatcher(e3) {
      if (this.multiRegexes[e3])
        return this.multiRegexes[e3];
      const t3 = new n2();
      return this.rules.slice(e3).forEach(([e4, n3]) => t3.addRule(e4, n3)), t3.compile(), this.multiRegexes[e3] = t3, t3;
    }
    resumingScanAtSamePosition() {
      return 0 !== this.regexIndex;
    }
    considerAll() {
      this.regexIndex = 0;
    }
    addRule(e3, t3) {
      this.rules.push([e3, t3]), "begin" === t3.type && this.count++;
    }
    exec(e3) {
      const t3 = this.getMatcher(this.regexIndex);
      t3.lastIndex = this.lastIndex;
      let n3 = t3.exec(e3);
      if (this.resumingScanAtSamePosition())
        if (n3 && n3.index === this.lastIndex)
          ;
        else {
          const t4 = this.getMatcher(0);
          t4.lastIndex = this.lastIndex + 1, n3 = t4.exec(e3);
        }
      return n3 && (this.regexIndex += n3.position + 1, this.regexIndex === this.count && this.considerAll()), n3;
    }
  }
  if (e2.compilerExtensions || (e2.compilerExtensions = []), e2.contains && e2.contains.includes("self"))
    throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
  return e2.classNameAliases = i(e2.classNameAliases || {}), function n3(o2, s2) {
    const a2 = o2;
    if (o2.isCompiled)
      return a2;
    [H, q, ne, X].forEach((e3) => e3(o2, s2)), e2.compilerExtensions.forEach((e3) => e3(o2, s2)), o2.__beforeBegin = null, [z, U, W].forEach((e3) => e3(o2, s2)), o2.isCompiled = true;
    let c2 = null;
    return "object" == typeof o2.keywords && o2.keywords.$pattern && (o2.keywords = Object.assign({}, o2.keywords), c2 = o2.keywords.$pattern, delete o2.keywords.$pattern), c2 = c2 || /\w+/, o2.keywords && (o2.keywords = F(o2.keywords, e2.case_insensitive)), a2.keywordPatternRe = t2(c2, true), s2 && (o2.begin || (o2.begin = /\B|\b/), a2.beginRe = t2(a2.begin), o2.end || o2.endsWithParent || (o2.end = /\B|\b/), o2.end && (a2.endRe = t2(a2.end)), a2.terminatorEnd = u(a2.end) || "", o2.endsWithParent && s2.terminatorEnd && (a2.terminatorEnd += (o2.end ? "|" : "") + s2.terminatorEnd)), o2.illegal && (a2.illegalRe = t2(o2.illegal)), o2.contains || (o2.contains = []), o2.contains = [].concat(...o2.contains.map(function(e3) {
      return function(e4) {
        e4.variants && !e4.cachedVariants && (e4.cachedVariants = e4.variants.map(function(t3) {
          return i(e4, { variants: null }, t3);
        }));
        if (e4.cachedVariants)
          return e4.cachedVariants;
        if (ie(e4))
          return i(e4, { starts: e4.starts ? i(e4.starts) : null });
        if (Object.isFrozen(e4))
          return i(e4);
        return e4;
      }("self" === e3 ? o2 : e3);
    })), o2.contains.forEach(function(e3) {
      n3(e3, a2);
    }), o2.starts && n3(o2.starts, s2), a2.matcher = function(e3) {
      const t3 = new r2();
      return e3.contains.forEach((e4) => t3.addRule(e4.begin, { rule: e4, type: "begin" })), e3.terminatorEnd && t3.addRule(e3.terminatorEnd, { type: "end" }), e3.illegal && t3.addRule(e3.illegal, { type: "illegal" }), t3;
    }(a2), a2;
  }(e2);
}
function ie(e2) {
  return !!e2 && (e2.endsWithParent || ie(e2.starts));
}
class oe extends Error {
  constructor(e2, t2) {
    super(e2), this.name = "HTMLInjectionError", this.html = t2;
  }
}
const se = r, ae = i, ce = Symbol("nomatch"), le = function(e2) {
  const r2 = /* @__PURE__ */ Object.create(null), i2 = /* @__PURE__ */ Object.create(null), o2 = [];
  let s2 = true;
  const a2 = "Could not find the language '{}', did you forget to load/include a language module?", c2 = { disableAutodetect: true, name: "Plain text", contains: [] };
  let u2 = { ignoreUnescapedHTML: false, throwUnescapedHTML: false, noHighlightRe: /^(no-?highlight)$/i, languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i, classPrefix: "hljs-", cssSelector: "pre code", languages: null, __emitter: l };
  function m2(e3) {
    return u2.noHighlightRe.test(e3);
  }
  function b2(e3, t2, n2) {
    let r3 = "", i3 = "";
    "object" == typeof t2 ? (r3 = e3, n2 = t2.ignoreIllegals, i3 = t2.language) : (Y("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Y("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"), i3 = e3, r3 = t2), void 0 === n2 && (n2 = true);
    const o3 = { code: r3, language: i3 };
    O2("before:highlight", o3);
    const s3 = o3.result ? o3.result : _2(o3.language, o3.code, n2);
    return s3.code = o3.code, O2("after:highlight", s3), s3;
  }
  function _2(e3, t2, i3, o3) {
    const c3 = /* @__PURE__ */ Object.create(null);
    function l2() {
      if (!O3.keywords)
        return void M2.addText(S2);
      let e4 = 0;
      O3.keywordPatternRe.lastIndex = 0;
      let t3 = O3.keywordPatternRe.exec(S2), n2 = "";
      for (; t3; ) {
        n2 += S2.substring(e4, t3.index);
        const i4 = v3.case_insensitive ? t3[0].toLowerCase() : t3[0], o4 = (r3 = i4, O3.keywords[r3]);
        if (o4) {
          const [e5, r4] = o4;
          if (M2.addText(n2), n2 = "", c3[i4] = (c3[i4] || 0) + 1, c3[i4] <= 7 && (R2 += r4), e5.startsWith("_"))
            n2 += t3[0];
          else {
            const n3 = v3.classNameAliases[e5] || e5;
            d2(t3[0], n3);
          }
        } else
          n2 += t3[0];
        e4 = O3.keywordPatternRe.lastIndex, t3 = O3.keywordPatternRe.exec(S2);
      }
      var r3;
      n2 += S2.substring(e4), M2.addText(n2);
    }
    function g2() {
      null != O3.subLanguage ? function() {
        if ("" === S2)
          return;
        let e4 = null;
        if ("string" == typeof O3.subLanguage) {
          if (!r2[O3.subLanguage])
            return void M2.addText(S2);
          e4 = _2(O3.subLanguage, S2, true, N2[O3.subLanguage]), N2[O3.subLanguage] = e4._top;
        } else
          e4 = y2(S2, O3.subLanguage.length ? O3.subLanguage : null);
        O3.relevance > 0 && (R2 += e4.relevance), M2.__addSublanguage(e4._emitter, e4.language);
      }() : l2(), S2 = "";
    }
    function d2(e4, t3) {
      "" !== e4 && (M2.startScope(t3), M2.addText(e4), M2.endScope());
    }
    function h2(e4, t3) {
      let n2 = 1;
      const r3 = t3.length - 1;
      for (; n2 <= r3; ) {
        if (!e4._emit[n2]) {
          n2++;
          continue;
        }
        const r4 = v3.classNameAliases[e4[n2]] || e4[n2], i4 = t3[n2];
        r4 ? d2(i4, r4) : (S2 = i4, l2(), S2 = ""), n2++;
      }
    }
    function p2(e4, t3) {
      return e4.scope && "string" == typeof e4.scope && M2.openNode(v3.classNameAliases[e4.scope] || e4.scope), e4.beginScope && (e4.beginScope._wrap ? (d2(S2, v3.classNameAliases[e4.beginScope._wrap] || e4.beginScope._wrap), S2 = "") : e4.beginScope._multi && (h2(e4.beginScope, t3), S2 = "")), O3 = Object.create(e4, { parent: { value: O3 } }), O3;
    }
    function f2(e4, t3, r3) {
      let i4 = function(e5, t4) {
        const n2 = e5 && e5.exec(t4);
        return n2 && 0 === n2.index;
      }(e4.endRe, r3);
      if (i4) {
        if (e4["on:end"]) {
          const r4 = new n(e4);
          e4["on:end"](t3, r4), r4.isMatchIgnored && (i4 = false);
        }
        if (i4) {
          for (; e4.endsParent && e4.parent; )
            e4 = e4.parent;
          return e4;
        }
      }
      if (e4.endsWithParent)
        return f2(e4.parent, t3, r3);
    }
    function m3(e4) {
      return 0 === O3.matcher.regexIndex ? (S2 += e4[0], 1) : (I2 = true, 0);
    }
    function b3(e4) {
      const n2 = e4[0], r3 = t2.substring(e4.index), i4 = f2(O3, e4, r3);
      if (!i4)
        return ce;
      const o4 = O3;
      O3.endScope && O3.endScope._wrap ? (g2(), d2(n2, O3.endScope._wrap)) : O3.endScope && O3.endScope._multi ? (g2(), h2(O3.endScope, e4)) : o4.skip ? S2 += n2 : (o4.returnEnd || o4.excludeEnd || (S2 += n2), g2(), o4.excludeEnd && (S2 = n2));
      do {
        O3.scope && M2.closeNode(), O3.skip || O3.subLanguage || (R2 += O3.relevance), O3 = O3.parent;
      } while (O3 !== i4.parent);
      return i4.starts && p2(i4.starts, e4), o4.returnEnd ? 0 : n2.length;
    }
    let w3 = {};
    function x3(r3, o4) {
      const a3 = o4 && o4[0];
      if (S2 += r3, null == a3)
        return g2(), 0;
      if ("begin" === w3.type && "end" === o4.type && w3.index === o4.index && "" === a3) {
        if (S2 += t2.slice(o4.index, o4.index + 1), !s2) {
          const t3 = new Error(`0 width match regex (${e3})`);
          throw t3.languageName = e3, t3.badRule = w3.rule, t3;
        }
        return 1;
      }
      if (w3 = o4, "begin" === o4.type)
        return function(e4) {
          const t3 = e4[0], r4 = e4.rule, i4 = new n(r4), o5 = [r4.__beforeBegin, r4["on:begin"]];
          for (const n2 of o5)
            if (n2 && (n2(e4, i4), i4.isMatchIgnored))
              return m3(t3);
          return r4.skip ? S2 += t3 : (r4.excludeBegin && (S2 += t3), g2(), r4.returnBegin || r4.excludeBegin || (S2 = t3)), p2(r4, e4), r4.returnBegin ? 0 : t3.length;
        }(o4);
      if ("illegal" === o4.type && !i3) {
        const e4 = new Error('Illegal lexeme "' + a3 + '" for mode "' + (O3.scope || "<unnamed>") + '"');
        throw e4.mode = O3, e4;
      }
      if ("end" === o4.type) {
        const e4 = b3(o4);
        if (e4 !== ce)
          return e4;
      }
      if ("illegal" === o4.type && "" === a3)
        return 1;
      if (T2 > 1e5 && T2 > 3 * o4.index) {
        throw new Error("potential infinite loop, way more iterations than matches");
      }
      return S2 += a3, a3.length;
    }
    const v3 = E2(e3);
    if (!v3)
      throw J(a2.replace("{}", e3)), new Error('Unknown language: "' + e3 + '"');
    const k3 = re(v3);
    let j3 = "", O3 = o3 || k3;
    const N2 = {}, M2 = new u2.__emitter(u2);
    !function() {
      const e4 = [];
      for (let t3 = O3; t3 !== v3; t3 = t3.parent)
        t3.scope && e4.unshift(t3.scope);
      e4.forEach((e5) => M2.openNode(e5));
    }();
    let S2 = "", R2 = 0, A2 = 0, T2 = 0, I2 = false;
    try {
      if (v3.__emitTokens)
        v3.__emitTokens(t2, M2);
      else {
        for (O3.matcher.considerAll(); ; ) {
          T2++, I2 ? I2 = false : O3.matcher.considerAll(), O3.matcher.lastIndex = A2;
          const e4 = O3.matcher.exec(t2);
          if (!e4)
            break;
          const n2 = x3(t2.substring(A2, e4.index), e4);
          A2 = e4.index + n2;
        }
        x3(t2.substring(A2));
      }
      return M2.finalize(), j3 = M2.toHTML(), { language: e3, value: j3, relevance: R2, illegal: false, _emitter: M2, _top: O3 };
    } catch (n2) {
      if (n2.message && n2.message.includes("Illegal"))
        return { language: e3, value: se(t2), illegal: true, relevance: 0, _illegalBy: { message: n2.message, index: A2, context: t2.slice(A2 - 100, A2 + 100), mode: n2.mode, resultSoFar: j3 }, _emitter: M2 };
      if (s2)
        return { language: e3, value: se(t2), illegal: false, relevance: 0, errorRaised: n2, _emitter: M2, _top: O3 };
      throw n2;
    }
  }
  function y2(e3, t2) {
    t2 = t2 || u2.languages || Object.keys(r2);
    const n2 = function(e4) {
      const t3 = { value: se(e4), illegal: false, relevance: 0, _top: c2, _emitter: new u2.__emitter(u2) };
      return t3._emitter.addText(e4), t3;
    }(e3), i3 = t2.filter(E2).filter(j2).map((t3) => _2(t3, e3, false));
    i3.unshift(n2);
    const o3 = i3.sort((e4, t3) => {
      if (e4.relevance !== t3.relevance)
        return t3.relevance - e4.relevance;
      if (e4.language && t3.language) {
        if (E2(e4.language).supersetOf === t3.language)
          return 1;
        if (E2(t3.language).supersetOf === e4.language)
          return -1;
      }
      return 0;
    }), [s3, a3] = o3, l2 = s3;
    return l2.secondBest = a3, l2;
  }
  function w2(e3) {
    let t2 = null;
    const n2 = function(e4) {
      let t3 = e4.className + " ";
      t3 += e4.parentNode ? e4.parentNode.className : "";
      const n3 = u2.languageDetectRe.exec(t3);
      if (n3) {
        const t4 = E2(n3[1]);
        return t4 || (Q(a2.replace("{}", n3[1])), Q("Falling back to no-highlight mode for this block.", e4)), t4 ? n3[1] : "no-highlight";
      }
      return t3.split(/\s+/).find((e5) => m2(e5) || E2(e5));
    }(e3);
    if (m2(n2))
      return;
    if (O2("before:highlightElement", { el: e3, language: n2 }), e3.dataset.highlighted)
      return void console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", e3);
    if (e3.children.length > 0 && (u2.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(e3)), u2.throwUnescapedHTML)) {
      throw new oe("One of your code blocks includes unescaped HTML.", e3.innerHTML);
    }
    t2 = e3;
    const r3 = t2.textContent, o3 = n2 ? b2(r3, { language: n2, ignoreIllegals: true }) : y2(r3);
    e3.innerHTML = o3.value, e3.dataset.highlighted = "yes", function(e4, t3, n3) {
      const r4 = t3 && i2[t3] || n3;
      e4.classList.add("hljs"), e4.classList.add(`language-${r4}`);
    }(e3, n2, o3.language), e3.result = { language: o3.language, re: o3.relevance, relevance: o3.relevance }, o3.secondBest && (e3.secondBest = { language: o3.secondBest.language, relevance: o3.secondBest.relevance }), O2("after:highlightElement", { el: e3, result: o3, text: r3 });
  }
  let x2 = false;
  function v2() {
    if ("loading" === document.readyState)
      return void (x2 = true);
    document.querySelectorAll(u2.cssSelector).forEach(w2);
  }
  function E2(e3) {
    return e3 = (e3 || "").toLowerCase(), r2[e3] || r2[i2[e3]];
  }
  function k2(e3, { languageName: t2 }) {
    "string" == typeof e3 && (e3 = [e3]), e3.forEach((e4) => {
      i2[e4.toLowerCase()] = t2;
    });
  }
  function j2(e3) {
    const t2 = E2(e3);
    return t2 && !t2.disableAutodetect;
  }
  function O2(e3, t2) {
    const n2 = e3;
    o2.forEach(function(e4) {
      e4[n2] && e4[n2](t2);
    });
  }
  "undefined" != typeof window && window.addEventListener && window.addEventListener("DOMContentLoaded", function() {
    x2 && v2();
  }, false), Object.assign(e2, { highlight: b2, highlightAuto: y2, highlightAll: v2, highlightElement: w2, highlightBlock: function(e3) {
    return Y("10.7.0", "highlightBlock will be removed entirely in v12.0"), Y("10.7.0", "Please use highlightElement now."), w2(e3);
  }, configure: function(e3) {
    u2 = ae(u2, e3);
  }, initHighlighting: () => {
    v2(), Y("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
  }, initHighlightingOnLoad: function() {
    v2(), Y("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
  }, registerLanguage: function(t2, n2) {
    let i3 = null;
    try {
      i3 = n2(e2);
    } catch (e3) {
      if (J("Language definition for '{}' could not be registered.".replace("{}", t2)), !s2)
        throw e3;
      J(e3), i3 = c2;
    }
    i3.name || (i3.name = t2), r2[t2] = i3, i3.rawDefinition = n2.bind(null, e2), i3.aliases && k2(i3.aliases, { languageName: t2 });
  }, unregisterLanguage: function(e3) {
    delete r2[e3];
    for (const t2 of Object.keys(i2))
      i2[t2] === e3 && delete i2[t2];
  }, listLanguages: function() {
    return Object.keys(r2);
  }, getLanguage: E2, registerAliases: k2, autoDetection: j2, inherit: ae, addPlugin: function(e3) {
    !function(e4) {
      e4["before:highlightBlock"] && !e4["before:highlightElement"] && (e4["before:highlightElement"] = (t2) => {
        e4["before:highlightBlock"](Object.assign({ block: t2.el }, t2));
      }), e4["after:highlightBlock"] && !e4["after:highlightElement"] && (e4["after:highlightElement"] = (t2) => {
        e4["after:highlightBlock"](Object.assign({ block: t2.el }, t2));
      });
    }(e3), o2.push(e3);
  }, removePlugin: function(e3) {
    const t2 = o2.indexOf(e3);
    -1 !== t2 && o2.splice(t2, 1);
  } }), e2.debugMode = function() {
    s2 = false;
  }, e2.safeMode = function() {
    s2 = true;
  }, e2.versionString = "11.9.0", e2.regex = { concat: p, lookahead: g, either: f, optional: h, anyNumberOfTimes: d };
  for (const e3 in P)
    "object" == typeof P[e3] && t(P[e3]);
  return Object.assign(e2, P), e2;
}, ue = le({});
ue.newInstance = () => le({});
var ge = ue;
ue.HighlightJS = ue, ue.default = ue;
const de = e(ge);
function he(e2 = document) {
  e2.querySelectorAll('code[lang="sql"]').forEach((e3) => {
    de.highlightElement(e3);
  });
}
de.registerLanguage("sql", (e2) => function(e3) {
  const t2 = e3.regex, n2 = e3.COMMENT("--", "$"), r2 = ["true", "false", "unknown"], i2 = ["bigint", "binary", "blob", "boolean", "char", "character", "clob", "date", "dec", "decfloat", "decimal", "float", "int", "integer", "interval", "nchar", "nclob", "national", "numeric", "real", "row", "smallint", "time", "timestamp", "varchar", "varying", "varbinary"], o2 = ["abs", "acos", "array_agg", "asin", "atan", "avg", "cast", "ceil", "ceiling", "coalesce", "corr", "cos", "cosh", "count", "covar_pop", "covar_samp", "cume_dist", "dense_rank", "deref", "element", "exp", "extract", "first_value", "floor", "json_array", "json_arrayagg", "json_exists", "json_object", "json_objectagg", "json_query", "json_table", "json_table_primitive", "json_value", "lag", "last_value", "lead", "listagg", "ln", "log", "log10", "lower", "max", "min", "mod", "nth_value", "ntile", "nullif", "percent_rank", "percentile_cont", "percentile_disc", "position", "position_regex", "power", "rank", "regr_avgx", "regr_avgy", "regr_count", "regr_intercept", "regr_r2", "regr_slope", "regr_sxx", "regr_sxy", "regr_syy", "row_number", "sin", "sinh", "sqrt", "stddev_pop", "stddev_samp", "substring", "substring_regex", "sum", "tan", "tanh", "translate", "translate_regex", "treat", "trim", "trim_array", "unnest", "upper", "value_of", "var_pop", "var_samp", "width_bucket"], s2 = ["create table", "insert into", "primary key", "foreign key", "not null", "alter table", "add constraint", "grouping sets", "on overflow", "character set", "respect nulls", "ignore nulls", "nulls first", "nulls last", "depth first", "breadth first"], a2 = o2, c2 = ["abs", "acos", "all", "allocate", "alter", "and", "any", "are", "array", "array_agg", "array_max_cardinality", "as", "asensitive", "asin", "asymmetric", "at", "atan", "atomic", "authorization", "avg", "begin", "begin_frame", "begin_partition", "between", "bigint", "binary", "blob", "boolean", "both", "by", "call", "called", "cardinality", "cascaded", "case", "cast", "ceil", "ceiling", "char", "char_length", "character", "character_length", "check", "classifier", "clob", "close", "coalesce", "collate", "collect", "column", "commit", "condition", "connect", "constraint", "contains", "convert", "copy", "corr", "corresponding", "cos", "cosh", "count", "covar_pop", "covar_samp", "create", "cross", "cube", "cume_dist", "current", "current_catalog", "current_date", "current_default_transform_group", "current_path", "current_role", "current_row", "current_schema", "current_time", "current_timestamp", "current_path", "current_role", "current_transform_group_for_type", "current_user", "cursor", "cycle", "date", "day", "deallocate", "dec", "decimal", "decfloat", "declare", "default", "define", "delete", "dense_rank", "deref", "describe", "deterministic", "disconnect", "distinct", "double", "drop", "dynamic", "each", "element", "else", "empty", "end", "end_frame", "end_partition", "end-exec", "equals", "escape", "every", "except", "exec", "execute", "exists", "exp", "external", "extract", "false", "fetch", "filter", "first_value", "float", "floor", "for", "foreign", "frame_row", "free", "from", "full", "function", "fusion", "get", "global", "grant", "group", "grouping", "groups", "having", "hold", "hour", "identity", "in", "indicator", "initial", "inner", "inout", "insensitive", "insert", "int", "integer", "intersect", "intersection", "interval", "into", "is", "join", "json_array", "json_arrayagg", "json_exists", "json_object", "json_objectagg", "json_query", "json_table", "json_table_primitive", "json_value", "lag", "language", "large", "last_value", "lateral", "lead", "leading", "left", "like", "like_regex", "listagg", "ln", "local", "localtime", "localtimestamp", "log", "log10", "lower", "match", "match_number", "match_recognize", "matches", "max", "member", "merge", "method", "min", "minute", "mod", "modifies", "module", "month", "multiset", "national", "natural", "nchar", "nclob", "new", "no", "none", "normalize", "not", "nth_value", "ntile", "null", "nullif", "numeric", "octet_length", "occurrences_regex", "of", "offset", "old", "omit", "on", "one", "only", "open", "or", "order", "out", "outer", "over", "overlaps", "overlay", "parameter", "partition", "pattern", "per", "percent", "percent_rank", "percentile_cont", "percentile_disc", "period", "portion", "position", "position_regex", "power", "precedes", "precision", "prepare", "primary", "procedure", "ptf", "range", "rank", "reads", "real", "recursive", "ref", "references", "referencing", "regr_avgx", "regr_avgy", "regr_count", "regr_intercept", "regr_r2", "regr_slope", "regr_sxx", "regr_sxy", "regr_syy", "release", "result", "return", "returns", "revoke", "right", "rollback", "rollup", "row", "row_number", "rows", "running", "savepoint", "scope", "scroll", "search", "second", "seek", "select", "sensitive", "session_user", "set", "show", "similar", "sin", "sinh", "skip", "smallint", "some", "specific", "specifictype", "sql", "sqlexception", "sqlstate", "sqlwarning", "sqrt", "start", "static", "stddev_pop", "stddev_samp", "submultiset", "subset", "substring", "substring_regex", "succeeds", "sum", "symmetric", "system", "system_time", "system_user", "table", "tablesample", "tan", "tanh", "then", "time", "timestamp", "timezone_hour", "timezone_minute", "to", "trailing", "translate", "translate_regex", "translation", "treat", "trigger", "trim", "trim_array", "true", "truncate", "uescape", "union", "unique", "unknown", "unnest", "update", "upper", "user", "using", "value", "values", "value_of", "var_pop", "var_samp", "varbinary", "varchar", "varying", "versioning", "when", "whenever", "where", "width_bucket", "window", "with", "within", "without", "year", "add", "asc", "collation", "desc", "final", "first", "last", "view"].filter((e4) => !o2.includes(e4)), l2 = { begin: t2.concat(/\b/, t2.either(...a2), /\s*\(/), relevance: 0, keywords: { built_in: a2 } };
  return { name: "SQL", case_insensitive: true, illegal: /[{}]|<\//, keywords: { $pattern: /\b[\w\.]+/, keyword: function(e4, { exceptions: t3, when: n3 } = {}) {
    const r3 = n3;
    return t3 = t3 || [], e4.map((e5) => e5.match(/\|\d+$/) || t3.includes(e5) ? e5 : r3(e5) ? `${e5}|0` : e5);
  }(c2, { when: (e4) => e4.length < 3 }), literal: r2, type: i2, built_in: ["current_catalog", "current_date", "current_default_transform_group", "current_path", "current_role", "current_schema", "current_transform_group_for_type", "current_user", "session_user", "system_time", "system_user", "current_time", "localtime", "current_timestamp", "localtimestamp"] }, contains: [{ begin: t2.either(...s2), relevance: 0, keywords: { $pattern: /[\w\.]+/, keyword: c2.concat(s2), literal: r2, type: i2 } }, { className: "type", begin: t2.either("double precision", "large object", "with timezone", "without timezone") }, l2, { className: "variable", begin: /@[a-z0-9][a-z0-9_]*/ }, { className: "string", variants: [{ begin: /'/, end: /'/, contains: [{ begin: /''/ }] }] }, { begin: /"/, end: /"/, contains: [{ begin: /""/ }] }, e3.C_NUMBER_MODE, e3.C_BLOCK_COMMENT_MODE, n2, { className: "operator", begin: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/, relevance: 0 }] };
}(e2)), void 0 === window.process && he(document);
export {
  he as execHighlight
};
