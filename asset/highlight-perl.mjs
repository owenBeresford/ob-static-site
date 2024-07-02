function e(e2) {
  return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
}
function n(e2) {
  return e2 instanceof Map ? e2.clear = e2.delete = e2.set = function() {
    throw new Error("map is read-only");
  } : e2 instanceof Set && (e2.add = e2.clear = e2.delete = function() {
    throw new Error("set is read-only");
  }), Object.freeze(e2), Object.getOwnPropertyNames(e2).forEach((t2) => {
    const i2 = e2[t2], r2 = typeof i2;
    "object" !== r2 && "function" !== r2 || Object.isFrozen(i2) || n(i2);
  }), e2;
}
class t {
  constructor(e2) {
    void 0 === e2.data && (e2.data = {}), this.data = e2.data, this.isMatchIgnored = false;
  }
  ignoreMatch() {
    this.isMatchIgnored = true;
  }
}
function i(e2) {
  return e2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
function r(e2, ...n2) {
  const t2 = /* @__PURE__ */ Object.create(null);
  for (const n3 in e2)
    t2[n3] = e2[n3];
  return n2.forEach(function(e3) {
    for (const n3 in e3)
      t2[n3] = e3[n3];
  }), t2;
}
const s = (e2) => !!e2.scope;
class o {
  constructor(e2, n2) {
    this.buffer = "", this.classPrefix = n2.classPrefix, e2.walk(this);
  }
  addText(e2) {
    this.buffer += i(e2);
  }
  openNode(e2) {
    if (!s(e2))
      return;
    const n2 = ((e3, { prefix: n3 }) => {
      if (e3.startsWith("language:"))
        return e3.replace("language:", "language-");
      if (e3.includes(".")) {
        const t2 = e3.split(".");
        return [`${n3}${t2.shift()}`, ...t2.map((e4, n4) => `${e4}${"_".repeat(n4 + 1)}`)].join(" ");
      }
      return `${n3}${e3}`;
    })(e2.scope, { prefix: this.classPrefix });
    this.span(n2);
  }
  closeNode(e2) {
    s(e2) && (this.buffer += "</span>");
  }
  value() {
    return this.buffer;
  }
  span(e2) {
    this.buffer += `<span class="${e2}">`;
  }
}
const a = (e2 = {}) => {
  const n2 = { children: [] };
  return Object.assign(n2, e2), n2;
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
    const n2 = a({ scope: e2 });
    this.add(n2), this.stack.push(n2);
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
  static _walk(e2, n2) {
    return "string" == typeof n2 ? e2.addText(n2) : n2.children && (e2.openNode(n2), n2.children.forEach((n3) => this._walk(e2, n3)), e2.closeNode(n2)), e2;
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
  __addSublanguage(e2, n2) {
    const t2 = e2.root;
    n2 && (t2.scope = `language:${n2}`), this.add(t2);
  }
  toHTML() {
    return new o(this, this.options).value();
  }
  finalize() {
    return this.closeAllNodes(), true;
  }
}
function g(e2) {
  return e2 ? "string" == typeof e2 ? e2 : e2.source : null;
}
function u(e2) {
  return p("(?=", e2, ")");
}
function d(e2) {
  return p("(?:", e2, ")*");
}
function h(e2) {
  return p("(?:", e2, ")?");
}
function p(...e2) {
  return e2.map((e3) => g(e3)).join("");
}
function f(...e2) {
  const n2 = function(e3) {
    const n3 = e3[e3.length - 1];
    return "object" == typeof n3 && n3.constructor === Object ? (e3.splice(e3.length - 1, 1), n3) : {};
  }(e2);
  return "(" + (n2.capture ? "" : "?:") + e2.map((e3) => g(e3)).join("|") + ")";
}
function b(e2) {
  return new RegExp(e2.toString() + "|").exec("").length - 1;
}
const m = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
function w(e2, { joinWith: n2 }) {
  let t2 = 0;
  return e2.map((e3) => {
    t2 += 1;
    const n3 = t2;
    let i2 = g(e3), r2 = "";
    for (; i2.length > 0; ) {
      const e4 = m.exec(i2);
      if (!e4) {
        r2 += i2;
        break;
      }
      r2 += i2.substring(0, e4.index), i2 = i2.substring(e4.index + e4[0].length), "\\" === e4[0][0] && e4[1] ? r2 += "\\" + String(Number(e4[1]) + n3) : (r2 += e4[0], "(" === e4[0] && t2++);
    }
    return r2;
  }).map((e3) => `(${e3})`).join(n2);
}
const y = "[a-zA-Z]\\w*", E = "[a-zA-Z_]\\w*", x = "\\b\\d+(\\.\\d+)?", _ = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", v = "\\b(0b[01]+)", k = { begin: "\\\\[\\s\\S]", relevance: 0 }, S = { scope: "string", begin: "'", end: "'", illegal: "\\n", contains: [k] }, O = { scope: "string", begin: '"', end: '"', illegal: "\\n", contains: [k] }, N = function(e2, n2, t2 = {}) {
  const i2 = r({ scope: "comment", begin: e2, end: n2, contains: [] }, t2);
  i2.contains.push({ scope: "doctag", begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)", end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/, excludeBegin: true, relevance: 0 });
  const s2 = f("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
  return i2.contains.push({ begin: p(/[ ]+/, "(", s2, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), i2;
}, M = N("//", "$"), A = N("/\\*", "\\*/"), R = N("#", "$"), j = { scope: "number", begin: x, relevance: 0 }, T = { scope: "number", begin: _, relevance: 0 }, I = { scope: "number", begin: v, relevance: 0 }, L = { scope: "regexp", begin: /\/(?=[^/\n]*\/)/, end: /\/[gimuy]*/, contains: [k, { begin: /\[/, end: /\]/, relevance: 0, contains: [k] }] }, B = { scope: "title", begin: y, relevance: 0 }, H = { scope: "title", begin: E, relevance: 0 }, C = { begin: "\\.\\s*" + E, relevance: 0 };
var P = Object.freeze({ __proto__: null, APOS_STRING_MODE: S, BACKSLASH_ESCAPE: k, BINARY_NUMBER_MODE: I, BINARY_NUMBER_RE: v, COMMENT: N, C_BLOCK_COMMENT_MODE: A, C_LINE_COMMENT_MODE: M, C_NUMBER_MODE: T, C_NUMBER_RE: _, END_SAME_AS_BEGIN: function(e2) {
  return Object.assign(e2, { "on:begin": (e3, n2) => {
    n2.data._beginMatch = e3[1];
  }, "on:end": (e3, n2) => {
    n2.data._beginMatch !== e3[1] && n2.ignoreMatch();
  } });
}, HASH_COMMENT_MODE: R, IDENT_RE: y, MATCH_NOTHING_RE: /\b\B/, METHOD_GUARD: C, NUMBER_MODE: j, NUMBER_RE: x, PHRASAL_WORDS_MODE: { begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/ }, QUOTE_STRING_MODE: O, REGEXP_MODE: L, RE_STARTERS_RE: "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", SHEBANG: (e2 = {}) => {
  const n2 = /^#![ ]*\//;
  return e2.binary && (e2.begin = p(n2, /.*\b/, e2.binary, /\b.*/)), r({ scope: "meta", begin: n2, end: /$/, relevance: 0, "on:begin": (e3, n3) => {
    0 !== e3.index && n3.ignoreMatch();
  } }, e2);
}, TITLE_MODE: B, UNDERSCORE_IDENT_RE: E, UNDERSCORE_TITLE_MODE: H });
function $(e2, n2) {
  "." === e2.input[e2.index - 1] && n2.ignoreMatch();
}
function D(e2, n2) {
  void 0 !== e2.className && (e2.scope = e2.className, delete e2.className);
}
function q(e2, n2) {
  n2 && e2.beginKeywords && (e2.begin = "\\b(" + e2.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", e2.__beforeBegin = $, e2.keywords = e2.keywords || e2.beginKeywords, delete e2.beginKeywords, void 0 === e2.relevance && (e2.relevance = 0));
}
function U(e2, n2) {
  Array.isArray(e2.illegal) && (e2.illegal = f(...e2.illegal));
}
function z(e2, n2) {
  if (e2.match) {
    if (e2.begin || e2.end)
      throw new Error("begin & end are not supported with match");
    e2.begin = e2.match, delete e2.match;
  }
}
function W(e2, n2) {
  void 0 === e2.relevance && (e2.relevance = 1);
}
const K = (e2, n2) => {
  if (!e2.beforeMatch)
    return;
  if (e2.starts)
    throw new Error("beforeMatch cannot be used with starts");
  const t2 = Object.assign({}, e2);
  Object.keys(e2).forEach((n3) => {
    delete e2[n3];
  }), e2.keywords = t2.keywords, e2.begin = p(t2.beforeMatch, u(t2.begin)), e2.starts = { relevance: 0, contains: [Object.assign(t2, { endsParent: true })] }, e2.relevance = 0, delete t2.beforeMatch;
}, X = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"], G = "keyword";
function F(e2, n2, t2 = G) {
  const i2 = /* @__PURE__ */ Object.create(null);
  return "string" == typeof e2 ? r2(t2, e2.split(" ")) : Array.isArray(e2) ? r2(t2, e2) : Object.keys(e2).forEach(function(t3) {
    Object.assign(i2, F(e2[t3], n2, t3));
  }), i2;
  function r2(e3, t3) {
    n2 && (t3 = t3.map((e4) => e4.toLowerCase())), t3.forEach(function(n3) {
      const t4 = n3.split("|");
      i2[t4[0]] = [e3, Z(t4[0], t4[1])];
    });
  }
}
function Z(e2, n2) {
  return n2 ? Number(n2) : function(e3) {
    return X.includes(e3.toLowerCase());
  }(e2) ? 0 : 1;
}
const V = {}, J = (e2) => {
  console.error(e2);
}, Y = (e2, ...n2) => {
  console.log(`WARN: ${e2}`, ...n2);
}, Q = (e2, n2) => {
  V[`${e2}/${n2}`] || (console.log(`Deprecated as of ${e2}. ${n2}`), V[`${e2}/${n2}`] = true);
}, ee = new Error();
function ne(e2, n2, { key: t2 }) {
  let i2 = 0;
  const r2 = e2[t2], s2 = {}, o2 = {};
  for (let e3 = 1; e3 <= n2.length; e3++)
    o2[e3 + i2] = r2[e3], s2[e3 + i2] = true, i2 += b(n2[e3 - 1]);
  e2[t2] = o2, e2[t2]._emit = s2, e2[t2]._multi = true;
}
function te(e2) {
  !function(e3) {
    e3.scope && "object" == typeof e3.scope && null !== e3.scope && (e3.beginScope = e3.scope, delete e3.scope);
  }(e2), "string" == typeof e2.beginScope && (e2.beginScope = { _wrap: e2.beginScope }), "string" == typeof e2.endScope && (e2.endScope = { _wrap: e2.endScope }), function(e3) {
    if (Array.isArray(e3.begin)) {
      if (e3.skip || e3.excludeBegin || e3.returnBegin)
        throw J("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), ee;
      if ("object" != typeof e3.beginScope || null === e3.beginScope)
        throw J("beginScope must be object"), ee;
      ne(e3, e3.begin, { key: "beginScope" }), e3.begin = w(e3.begin, { joinWith: "" });
    }
  }(e2), function(e3) {
    if (Array.isArray(e3.end)) {
      if (e3.skip || e3.excludeEnd || e3.returnEnd)
        throw J("skip, excludeEnd, returnEnd not compatible with endScope: {}"), ee;
      if ("object" != typeof e3.endScope || null === e3.endScope)
        throw J("endScope must be object"), ee;
      ne(e3, e3.end, { key: "endScope" }), e3.end = w(e3.end, { joinWith: "" });
    }
  }(e2);
}
function ie(e2) {
  function n2(n3, t3) {
    return new RegExp(g(n3), "m" + (e2.case_insensitive ? "i" : "") + (e2.unicodeRegex ? "u" : "") + (t3 ? "g" : ""));
  }
  class t2 {
    constructor() {
      this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
    }
    addRule(e3, n3) {
      n3.position = this.position++, this.matchIndexes[this.matchAt] = n3, this.regexes.push([n3, e3]), this.matchAt += b(e3) + 1;
    }
    compile() {
      0 === this.regexes.length && (this.exec = () => null);
      const e3 = this.regexes.map((e4) => e4[1]);
      this.matcherRe = n2(w(e3, { joinWith: "|" }), true), this.lastIndex = 0;
    }
    exec(e3) {
      this.matcherRe.lastIndex = this.lastIndex;
      const n3 = this.matcherRe.exec(e3);
      if (!n3)
        return null;
      const t3 = n3.findIndex((e4, n4) => n4 > 0 && void 0 !== e4), i3 = this.matchIndexes[t3];
      return n3.splice(0, t3), Object.assign(n3, i3);
    }
  }
  class i2 {
    constructor() {
      this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
    }
    getMatcher(e3) {
      if (this.multiRegexes[e3])
        return this.multiRegexes[e3];
      const n3 = new t2();
      return this.rules.slice(e3).forEach(([e4, t3]) => n3.addRule(e4, t3)), n3.compile(), this.multiRegexes[e3] = n3, n3;
    }
    resumingScanAtSamePosition() {
      return 0 !== this.regexIndex;
    }
    considerAll() {
      this.regexIndex = 0;
    }
    addRule(e3, n3) {
      this.rules.push([e3, n3]), "begin" === n3.type && this.count++;
    }
    exec(e3) {
      const n3 = this.getMatcher(this.regexIndex);
      n3.lastIndex = this.lastIndex;
      let t3 = n3.exec(e3);
      if (this.resumingScanAtSamePosition())
        if (t3 && t3.index === this.lastIndex)
          ;
        else {
          const n4 = this.getMatcher(0);
          n4.lastIndex = this.lastIndex + 1, t3 = n4.exec(e3);
        }
      return t3 && (this.regexIndex += t3.position + 1, this.regexIndex === this.count && this.considerAll()), t3;
    }
  }
  if (e2.compilerExtensions || (e2.compilerExtensions = []), e2.contains && e2.contains.includes("self"))
    throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
  return e2.classNameAliases = r(e2.classNameAliases || {}), function t3(s2, o2) {
    const a2 = s2;
    if (s2.isCompiled)
      return a2;
    [D, z, te, K].forEach((e3) => e3(s2, o2)), e2.compilerExtensions.forEach((e3) => e3(s2, o2)), s2.__beforeBegin = null, [q, U, W].forEach((e3) => e3(s2, o2)), s2.isCompiled = true;
    let c2 = null;
    return "object" == typeof s2.keywords && s2.keywords.$pattern && (s2.keywords = Object.assign({}, s2.keywords), c2 = s2.keywords.$pattern, delete s2.keywords.$pattern), c2 = c2 || /\w+/, s2.keywords && (s2.keywords = F(s2.keywords, e2.case_insensitive)), a2.keywordPatternRe = n2(c2, true), o2 && (s2.begin || (s2.begin = /\B|\b/), a2.beginRe = n2(a2.begin), s2.end || s2.endsWithParent || (s2.end = /\B|\b/), s2.end && (a2.endRe = n2(a2.end)), a2.terminatorEnd = g(a2.end) || "", s2.endsWithParent && o2.terminatorEnd && (a2.terminatorEnd += (s2.end ? "|" : "") + o2.terminatorEnd)), s2.illegal && (a2.illegalRe = n2(s2.illegal)), s2.contains || (s2.contains = []), s2.contains = [].concat(...s2.contains.map(function(e3) {
      return function(e4) {
        e4.variants && !e4.cachedVariants && (e4.cachedVariants = e4.variants.map(function(n3) {
          return r(e4, { variants: null }, n3);
        }));
        if (e4.cachedVariants)
          return e4.cachedVariants;
        if (re(e4))
          return r(e4, { starts: e4.starts ? r(e4.starts) : null });
        if (Object.isFrozen(e4))
          return r(e4);
        return e4;
      }("self" === e3 ? s2 : e3);
    })), s2.contains.forEach(function(e3) {
      t3(e3, a2);
    }), s2.starts && t3(s2.starts, o2), a2.matcher = function(e3) {
      const n3 = new i2();
      return e3.contains.forEach((e4) => n3.addRule(e4.begin, { rule: e4, type: "begin" })), e3.terminatorEnd && n3.addRule(e3.terminatorEnd, { type: "end" }), e3.illegal && n3.addRule(e3.illegal, { type: "illegal" }), n3;
    }(a2), a2;
  }(e2);
}
function re(e2) {
  return !!e2 && (e2.endsWithParent || re(e2.starts));
}
class se extends Error {
  constructor(e2, n2) {
    super(e2), this.name = "HTMLInjectionError", this.html = n2;
  }
}
const oe = i, ae = r, ce = Symbol("nomatch"), le = function(e2) {
  const i2 = /* @__PURE__ */ Object.create(null), r2 = /* @__PURE__ */ Object.create(null), s2 = [];
  let o2 = true;
  const a2 = "Could not find the language '{}', did you forget to load/include a language module?", c2 = { disableAutodetect: true, name: "Plain text", contains: [] };
  let g2 = { ignoreUnescapedHTML: false, throwUnescapedHTML: false, noHighlightRe: /^(no-?highlight)$/i, languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i, classPrefix: "hljs-", cssSelector: "pre code", languages: null, __emitter: l };
  function b2(e3) {
    return g2.noHighlightRe.test(e3);
  }
  function m2(e3, n2, t2) {
    let i3 = "", r3 = "";
    "object" == typeof n2 ? (i3 = e3, t2 = n2.ignoreIllegals, r3 = n2.language) : (Q("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Q("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"), r3 = e3, i3 = n2), void 0 === t2 && (t2 = true);
    const s3 = { code: i3, language: r3 };
    O2("before:highlight", s3);
    const o3 = s3.result ? s3.result : w2(s3.language, s3.code, t2);
    return o3.code = s3.code, O2("after:highlight", o3), o3;
  }
  function w2(e3, n2, r3, s3) {
    const c3 = /* @__PURE__ */ Object.create(null);
    function l2() {
      if (!O3.keywords)
        return void M2.addText(A2);
      let e4 = 0;
      O3.keywordPatternRe.lastIndex = 0;
      let n3 = O3.keywordPatternRe.exec(A2), t2 = "";
      for (; n3; ) {
        t2 += A2.substring(e4, n3.index);
        const r4 = _3.case_insensitive ? n3[0].toLowerCase() : n3[0], s4 = (i3 = r4, O3.keywords[i3]);
        if (s4) {
          const [e5, i4] = s4;
          if (M2.addText(t2), t2 = "", c3[r4] = (c3[r4] || 0) + 1, c3[r4] <= 7 && (R2 += i4), e5.startsWith("_"))
            t2 += n3[0];
          else {
            const t3 = _3.classNameAliases[e5] || e5;
            d2(n3[0], t3);
          }
        } else
          t2 += n3[0];
        e4 = O3.keywordPatternRe.lastIndex, n3 = O3.keywordPatternRe.exec(A2);
      }
      var i3;
      t2 += A2.substring(e4), M2.addText(t2);
    }
    function u2() {
      null != O3.subLanguage ? function() {
        if ("" === A2)
          return;
        let e4 = null;
        if ("string" == typeof O3.subLanguage) {
          if (!i2[O3.subLanguage])
            return void M2.addText(A2);
          e4 = w2(O3.subLanguage, A2, true, N2[O3.subLanguage]), N2[O3.subLanguage] = e4._top;
        } else
          e4 = y2(A2, O3.subLanguage.length ? O3.subLanguage : null);
        O3.relevance > 0 && (R2 += e4.relevance), M2.__addSublanguage(e4._emitter, e4.language);
      }() : l2(), A2 = "";
    }
    function d2(e4, n3) {
      "" !== e4 && (M2.startScope(n3), M2.addText(e4), M2.endScope());
    }
    function h2(e4, n3) {
      let t2 = 1;
      const i3 = n3.length - 1;
      for (; t2 <= i3; ) {
        if (!e4._emit[t2]) {
          t2++;
          continue;
        }
        const i4 = _3.classNameAliases[e4[t2]] || e4[t2], r4 = n3[t2];
        i4 ? d2(r4, i4) : (A2 = r4, l2(), A2 = ""), t2++;
      }
    }
    function p2(e4, n3) {
      return e4.scope && "string" == typeof e4.scope && M2.openNode(_3.classNameAliases[e4.scope] || e4.scope), e4.beginScope && (e4.beginScope._wrap ? (d2(A2, _3.classNameAliases[e4.beginScope._wrap] || e4.beginScope._wrap), A2 = "") : e4.beginScope._multi && (h2(e4.beginScope, n3), A2 = "")), O3 = Object.create(e4, { parent: { value: O3 } }), O3;
    }
    function f2(e4, n3, i3) {
      let r4 = function(e5, n4) {
        const t2 = e5 && e5.exec(n4);
        return t2 && 0 === t2.index;
      }(e4.endRe, i3);
      if (r4) {
        if (e4["on:end"]) {
          const i4 = new t(e4);
          e4["on:end"](n3, i4), i4.isMatchIgnored && (r4 = false);
        }
        if (r4) {
          for (; e4.endsParent && e4.parent; )
            e4 = e4.parent;
          return e4;
        }
      }
      if (e4.endsWithParent)
        return f2(e4.parent, n3, i3);
    }
    function b3(e4) {
      return 0 === O3.matcher.regexIndex ? (A2 += e4[0], 1) : (I2 = true, 0);
    }
    function m3(e4) {
      const t2 = e4[0], i3 = n2.substring(e4.index), r4 = f2(O3, e4, i3);
      if (!r4)
        return ce;
      const s4 = O3;
      O3.endScope && O3.endScope._wrap ? (u2(), d2(t2, O3.endScope._wrap)) : O3.endScope && O3.endScope._multi ? (u2(), h2(O3.endScope, e4)) : s4.skip ? A2 += t2 : (s4.returnEnd || s4.excludeEnd || (A2 += t2), u2(), s4.excludeEnd && (A2 = t2));
      do {
        O3.scope && M2.closeNode(), O3.skip || O3.subLanguage || (R2 += O3.relevance), O3 = O3.parent;
      } while (O3 !== r4.parent);
      return r4.starts && p2(r4.starts, e4), s4.returnEnd ? 0 : t2.length;
    }
    let E3 = {};
    function x3(i3, s4) {
      const a3 = s4 && s4[0];
      if (A2 += i3, null == a3)
        return u2(), 0;
      if ("begin" === E3.type && "end" === s4.type && E3.index === s4.index && "" === a3) {
        if (A2 += n2.slice(s4.index, s4.index + 1), !o2) {
          const n3 = new Error(`0 width match regex (${e3})`);
          throw n3.languageName = e3, n3.badRule = E3.rule, n3;
        }
        return 1;
      }
      if (E3 = s4, "begin" === s4.type)
        return function(e4) {
          const n3 = e4[0], i4 = e4.rule, r4 = new t(i4), s5 = [i4.__beforeBegin, i4["on:begin"]];
          for (const t2 of s5)
            if (t2 && (t2(e4, r4), r4.isMatchIgnored))
              return b3(n3);
          return i4.skip ? A2 += n3 : (i4.excludeBegin && (A2 += n3), u2(), i4.returnBegin || i4.excludeBegin || (A2 = n3)), p2(i4, e4), i4.returnBegin ? 0 : n3.length;
        }(s4);
      if ("illegal" === s4.type && !r3) {
        const e4 = new Error('Illegal lexeme "' + a3 + '" for mode "' + (O3.scope || "<unnamed>") + '"');
        throw e4.mode = O3, e4;
      }
      if ("end" === s4.type) {
        const e4 = m3(s4);
        if (e4 !== ce)
          return e4;
      }
      if ("illegal" === s4.type && "" === a3)
        return 1;
      if (T2 > 1e5 && T2 > 3 * s4.index) {
        throw new Error("potential infinite loop, way more iterations than matches");
      }
      return A2 += a3, a3.length;
    }
    const _3 = v2(e3);
    if (!_3)
      throw J(a2.replace("{}", e3)), new Error('Unknown language: "' + e3 + '"');
    const k3 = ie(_3);
    let S3 = "", O3 = s3 || k3;
    const N2 = {}, M2 = new g2.__emitter(g2);
    !function() {
      const e4 = [];
      for (let n3 = O3; n3 !== _3; n3 = n3.parent)
        n3.scope && e4.unshift(n3.scope);
      e4.forEach((e5) => M2.openNode(e5));
    }();
    let A2 = "", R2 = 0, j2 = 0, T2 = 0, I2 = false;
    try {
      if (_3.__emitTokens)
        _3.__emitTokens(n2, M2);
      else {
        for (O3.matcher.considerAll(); ; ) {
          T2++, I2 ? I2 = false : O3.matcher.considerAll(), O3.matcher.lastIndex = j2;
          const e4 = O3.matcher.exec(n2);
          if (!e4)
            break;
          const t2 = x3(n2.substring(j2, e4.index), e4);
          j2 = e4.index + t2;
        }
        x3(n2.substring(j2));
      }
      return M2.finalize(), S3 = M2.toHTML(), { language: e3, value: S3, relevance: R2, illegal: false, _emitter: M2, _top: O3 };
    } catch (t2) {
      if (t2.message && t2.message.includes("Illegal"))
        return { language: e3, value: oe(n2), illegal: true, relevance: 0, _illegalBy: { message: t2.message, index: j2, context: n2.slice(j2 - 100, j2 + 100), mode: t2.mode, resultSoFar: S3 }, _emitter: M2 };
      if (o2)
        return { language: e3, value: oe(n2), illegal: false, relevance: 0, errorRaised: t2, _emitter: M2, _top: O3 };
      throw t2;
    }
  }
  function y2(e3, n2) {
    n2 = n2 || g2.languages || Object.keys(i2);
    const t2 = function(e4) {
      const n3 = { value: oe(e4), illegal: false, relevance: 0, _top: c2, _emitter: new g2.__emitter(g2) };
      return n3._emitter.addText(e4), n3;
    }(e3), r3 = n2.filter(v2).filter(S2).map((n3) => w2(n3, e3, false));
    r3.unshift(t2);
    const s3 = r3.sort((e4, n3) => {
      if (e4.relevance !== n3.relevance)
        return n3.relevance - e4.relevance;
      if (e4.language && n3.language) {
        if (v2(e4.language).supersetOf === n3.language)
          return 1;
        if (v2(n3.language).supersetOf === e4.language)
          return -1;
      }
      return 0;
    }), [o3, a3] = s3, l2 = o3;
    return l2.secondBest = a3, l2;
  }
  function E2(e3) {
    let n2 = null;
    const t2 = function(e4) {
      let n3 = e4.className + " ";
      n3 += e4.parentNode ? e4.parentNode.className : "";
      const t3 = g2.languageDetectRe.exec(n3);
      if (t3) {
        const n4 = v2(t3[1]);
        return n4 || (Y(a2.replace("{}", t3[1])), Y("Falling back to no-highlight mode for this block.", e4)), n4 ? t3[1] : "no-highlight";
      }
      return n3.split(/\s+/).find((e5) => b2(e5) || v2(e5));
    }(e3);
    if (b2(t2))
      return;
    if (O2("before:highlightElement", { el: e3, language: t2 }), e3.dataset.highlighted)
      return void console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", e3);
    if (e3.children.length > 0 && (g2.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(e3)), g2.throwUnescapedHTML)) {
      throw new se("One of your code blocks includes unescaped HTML.", e3.innerHTML);
    }
    n2 = e3;
    const i3 = n2.textContent, s3 = t2 ? m2(i3, { language: t2, ignoreIllegals: true }) : y2(i3);
    e3.innerHTML = s3.value, e3.dataset.highlighted = "yes", function(e4, n3, t3) {
      const i4 = n3 && r2[n3] || t3;
      e4.classList.add("hljs"), e4.classList.add(`language-${i4}`);
    }(e3, t2, s3.language), e3.result = { language: s3.language, re: s3.relevance, relevance: s3.relevance }, s3.secondBest && (e3.secondBest = { language: s3.secondBest.language, relevance: s3.secondBest.relevance }), O2("after:highlightElement", { el: e3, result: s3, text: i3 });
  }
  let x2 = false;
  function _2() {
    if ("loading" === document.readyState)
      return void (x2 = true);
    document.querySelectorAll(g2.cssSelector).forEach(E2);
  }
  function v2(e3) {
    return e3 = (e3 || "").toLowerCase(), i2[e3] || i2[r2[e3]];
  }
  function k2(e3, { languageName: n2 }) {
    "string" == typeof e3 && (e3 = [e3]), e3.forEach((e4) => {
      r2[e4.toLowerCase()] = n2;
    });
  }
  function S2(e3) {
    const n2 = v2(e3);
    return n2 && !n2.disableAutodetect;
  }
  function O2(e3, n2) {
    const t2 = e3;
    s2.forEach(function(e4) {
      e4[t2] && e4[t2](n2);
    });
  }
  "undefined" != typeof window && window.addEventListener && window.addEventListener("DOMContentLoaded", function() {
    x2 && _2();
  }, false), Object.assign(e2, { highlight: m2, highlightAuto: y2, highlightAll: _2, highlightElement: E2, highlightBlock: function(e3) {
    return Q("10.7.0", "highlightBlock will be removed entirely in v12.0"), Q("10.7.0", "Please use highlightElement now."), E2(e3);
  }, configure: function(e3) {
    g2 = ae(g2, e3);
  }, initHighlighting: () => {
    _2(), Q("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
  }, initHighlightingOnLoad: function() {
    _2(), Q("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
  }, registerLanguage: function(n2, t2) {
    let r3 = null;
    try {
      r3 = t2(e2);
    } catch (e3) {
      if (J("Language definition for '{}' could not be registered.".replace("{}", n2)), !o2)
        throw e3;
      J(e3), r3 = c2;
    }
    r3.name || (r3.name = n2), i2[n2] = r3, r3.rawDefinition = t2.bind(null, e2), r3.aliases && k2(r3.aliases, { languageName: n2 });
  }, unregisterLanguage: function(e3) {
    delete i2[e3];
    for (const n2 of Object.keys(r2))
      r2[n2] === e3 && delete r2[n2];
  }, listLanguages: function() {
    return Object.keys(i2);
  }, getLanguage: v2, registerAliases: k2, autoDetection: S2, inherit: ae, addPlugin: function(e3) {
    !function(e4) {
      e4["before:highlightBlock"] && !e4["before:highlightElement"] && (e4["before:highlightElement"] = (n2) => {
        e4["before:highlightBlock"](Object.assign({ block: n2.el }, n2));
      }), e4["after:highlightBlock"] && !e4["after:highlightElement"] && (e4["after:highlightElement"] = (n2) => {
        e4["after:highlightBlock"](Object.assign({ block: n2.el }, n2));
      });
    }(e3), s2.push(e3);
  }, removePlugin: function(e3) {
    const n2 = s2.indexOf(e3);
    -1 !== n2 && s2.splice(n2, 1);
  } }), e2.debugMode = function() {
    o2 = false;
  }, e2.safeMode = function() {
    o2 = true;
  }, e2.versionString = "11.9.0", e2.regex = { concat: p, lookahead: u, either: f, optional: h, anyNumberOfTimes: d };
  for (const e3 in P)
    "object" == typeof P[e3] && n(P[e3]);
  return Object.assign(e2, P), e2;
}, ge = le({});
ge.newInstance = () => le({});
var ue = ge;
ge.HighlightJS = ge, ge.default = ge;
const de = e(ue);
function he(e2 = document) {
  e2.querySelectorAll('code[lang="perl"]').forEach((e3) => {
    de.highlightElement(e3);
  });
}
de.registerLanguage("perl", (e2) => function(e3) {
  const n2 = e3.regex, t2 = /[dualxmsipngr]{0,12}/, i2 = { $pattern: /[\w.]+/, keyword: ["abs", "accept", "alarm", "and", "atan2", "bind", "binmode", "bless", "break", "caller", "chdir", "chmod", "chomp", "chop", "chown", "chr", "chroot", "close", "closedir", "connect", "continue", "cos", "crypt", "dbmclose", "dbmopen", "defined", "delete", "die", "do", "dump", "each", "else", "elsif", "endgrent", "endhostent", "endnetent", "endprotoent", "endpwent", "endservent", "eof", "eval", "exec", "exists", "exit", "exp", "fcntl", "fileno", "flock", "for", "foreach", "fork", "format", "formline", "getc", "getgrent", "getgrgid", "getgrnam", "gethostbyaddr", "gethostbyname", "gethostent", "getlogin", "getnetbyaddr", "getnetbyname", "getnetent", "getpeername", "getpgrp", "getpriority", "getprotobyname", "getprotobynumber", "getprotoent", "getpwent", "getpwnam", "getpwuid", "getservbyname", "getservbyport", "getservent", "getsockname", "getsockopt", "given", "glob", "gmtime", "goto", "grep", "gt", "hex", "if", "index", "int", "ioctl", "join", "keys", "kill", "last", "lc", "lcfirst", "length", "link", "listen", "local", "localtime", "log", "lstat", "lt", "ma", "map", "mkdir", "msgctl", "msgget", "msgrcv", "msgsnd", "my", "ne", "next", "no", "not", "oct", "open", "opendir", "or", "ord", "our", "pack", "package", "pipe", "pop", "pos", "print", "printf", "prototype", "push", "q|0", "qq", "quotemeta", "qw", "qx", "rand", "read", "readdir", "readline", "readlink", "readpipe", "recv", "redo", "ref", "rename", "require", "reset", "return", "reverse", "rewinddir", "rindex", "rmdir", "say", "scalar", "seek", "seekdir", "select", "semctl", "semget", "semop", "send", "setgrent", "sethostent", "setnetent", "setpgrp", "setpriority", "setprotoent", "setpwent", "setservent", "setsockopt", "shift", "shmctl", "shmget", "shmread", "shmwrite", "shutdown", "sin", "sleep", "socket", "socketpair", "sort", "splice", "split", "sprintf", "sqrt", "srand", "stat", "state", "study", "sub", "substr", "symlink", "syscall", "sysopen", "sysread", "sysseek", "system", "syswrite", "tell", "telldir", "tie", "tied", "time", "times", "tr", "truncate", "uc", "ucfirst", "umask", "undef", "unless", "unlink", "unpack", "unshift", "untie", "until", "use", "utime", "values", "vec", "wait", "waitpid", "wantarray", "warn", "when", "while", "write", "x|0", "xor", "y|0"].join(" ") }, r2 = { className: "subst", begin: "[$@]\\{", end: "\\}", keywords: i2 }, s2 = { begin: /->\{/, end: /\}/ }, o2 = { variants: [{ begin: /\$\d/ }, { begin: n2.concat(/[$%@](\^\w\b|#\w+(::\w+)*|\{\w+\}|\w+(::\w*)*)/, "(?![A-Za-z])(?![@$%])") }, { begin: /[$%@][^\s\w{]/, relevance: 0 }] }, a2 = [e3.BACKSLASH_ESCAPE, r2, o2], c2 = [/!/, /\//, /\|/, /\?/, /'/, /"/, /#/], l2 = (e4, i3, r3 = "\\1") => {
    const s3 = "\\1" === r3 ? r3 : n2.concat(r3, i3);
    return n2.concat(n2.concat("(?:", e4, ")"), i3, /(?:\\.|[^\\\/])*?/, s3, /(?:\\.|[^\\\/])*?/, r3, t2);
  }, g2 = (e4, i3, r3) => n2.concat(n2.concat("(?:", e4, ")"), i3, /(?:\\.|[^\\\/])*?/, r3, t2), u2 = [o2, e3.HASH_COMMENT_MODE, e3.COMMENT(/^=\w/, /=cut/, { endsWithParent: true }), s2, { className: "string", contains: a2, variants: [{ begin: "q[qwxr]?\\s*\\(", end: "\\)", relevance: 5 }, { begin: "q[qwxr]?\\s*\\[", end: "\\]", relevance: 5 }, { begin: "q[qwxr]?\\s*\\{", end: "\\}", relevance: 5 }, { begin: "q[qwxr]?\\s*\\|", end: "\\|", relevance: 5 }, { begin: "q[qwxr]?\\s*<", end: ">", relevance: 5 }, { begin: "qw\\s+q", end: "q", relevance: 5 }, { begin: "'", end: "'", contains: [e3.BACKSLASH_ESCAPE] }, { begin: '"', end: '"' }, { begin: "`", end: "`", contains: [e3.BACKSLASH_ESCAPE] }, { begin: /\{\w+\}/, relevance: 0 }, { begin: "-?\\w+\\s*=>", relevance: 0 }] }, { className: "number", begin: "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b", relevance: 0 }, { begin: "(\\/\\/|" + e3.RE_STARTERS_RE + "|\\b(split|return|print|reverse|grep)\\b)\\s*", keywords: "split return print reverse grep", relevance: 0, contains: [e3.HASH_COMMENT_MODE, { className: "regexp", variants: [{ begin: l2("s|tr|y", n2.either(...c2, { capture: true })) }, { begin: l2("s|tr|y", "\\(", "\\)") }, { begin: l2("s|tr|y", "\\[", "\\]") }, { begin: l2("s|tr|y", "\\{", "\\}") }], relevance: 2 }, { className: "regexp", variants: [{ begin: /(m|qr)\/\//, relevance: 0 }, { begin: g2("(?:m|qr)?", /\//, /\//) }, { begin: g2("m|qr", n2.either(...c2, { capture: true }), /\1/) }, { begin: g2("m|qr", /\(/, /\)/) }, { begin: g2("m|qr", /\[/, /\]/) }, { begin: g2("m|qr", /\{/, /\}/) }] }] }, { className: "function", beginKeywords: "sub", end: "(\\s*\\(.*?\\))?[;{]", excludeEnd: true, relevance: 5, contains: [e3.TITLE_MODE] }, { begin: "-\\w\\b", relevance: 0 }, { begin: "^__DATA__$", end: "^__END__$", subLanguage: "mojolicious", contains: [{ begin: "^@@.*", end: "$", className: "comment" }] }];
  return r2.contains = u2, s2.contains = u2, { name: "Perl", aliases: ["pl", "pm"], keywords: i2, contains: u2 };
}(e2)), void 0 === window.process && he(document);
export {
  he as execHighlight
};
