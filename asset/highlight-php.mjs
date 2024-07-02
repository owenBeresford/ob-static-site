function e(e2) {
  return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
}
function t(e2) {
  return e2 instanceof Map ? e2.clear = e2.delete = e2.set = function() {
    throw new Error("map is read-only");
  } : e2 instanceof Set && (e2.add = e2.clear = e2.delete = function() {
    throw new Error("set is read-only");
  }), Object.freeze(e2), Object.getOwnPropertyNames(e2).forEach((n2) => {
    const i2 = e2[n2], r2 = typeof i2;
    "object" !== r2 && "function" !== r2 || Object.isFrozen(i2) || t(i2);
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
function i(e2) {
  return e2.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
function r(e2, ...t2) {
  const n2 = /* @__PURE__ */ Object.create(null);
  for (const t3 in e2)
    n2[t3] = e2[t3];
  return t2.forEach(function(e3) {
    for (const t3 in e3)
      n2[t3] = e3[t3];
  }), n2;
}
const o = (e2) => !!e2.scope;
class a {
  constructor(e2, t2) {
    this.buffer = "", this.classPrefix = t2.classPrefix, e2.walk(this);
  }
  addText(e2) {
    this.buffer += i(e2);
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
const s = (e2 = {}) => {
  const t2 = { children: [] };
  return Object.assign(t2, e2), t2;
};
class c {
  constructor() {
    this.rootNode = s(), this.stack = [this.rootNode];
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
    const t2 = s({ scope: e2 });
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
    return new a(this, this.options).value();
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
function b(e2) {
  return new RegExp(e2.toString() + "|").exec("").length - 1;
}
const _ = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
function m(e2, { joinWith: t2 }) {
  let n2 = 0;
  return e2.map((e3) => {
    n2 += 1;
    const t3 = n2;
    let i2 = u(e3), r2 = "";
    for (; i2.length > 0; ) {
      const e4 = _.exec(i2);
      if (!e4) {
        r2 += i2;
        break;
      }
      r2 += i2.substring(0, e4.index), i2 = i2.substring(e4.index + e4[0].length), "\\" === e4[0][0] && e4[1] ? r2 += "\\" + String(Number(e4[1]) + t3) : (r2 += e4[0], "(" === e4[0] && n2++);
    }
    return r2;
  }).map((e3) => `(${e3})`).join(t2);
}
const E = "[a-zA-Z]\\w*", w = "[a-zA-Z_]\\w*", x = "\\b\\d+(\\.\\d+)?", y = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", O = "\\b(0b[01]+)", v = { begin: "\\\\[\\s\\S]", relevance: 0 }, S = { scope: "string", begin: "'", end: "'", illegal: "\\n", contains: [v] }, M = { scope: "string", begin: '"', end: '"', illegal: "\\n", contains: [v] }, I = function(e2, t2, n2 = {}) {
  const i2 = r({ scope: "comment", begin: e2, end: t2, contains: [] }, n2);
  i2.contains.push({ scope: "doctag", begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)", end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/, excludeBegin: true, relevance: 0 });
  const o2 = f("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
  return i2.contains.push({ begin: p(/[ ]+/, "(", o2, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), i2;
}, k = I("//", "$"), R = I("/\\*", "\\*/"), N = I("#", "$"), A = { scope: "number", begin: x, relevance: 0 }, T = { scope: "number", begin: y, relevance: 0 }, j = { scope: "number", begin: O, relevance: 0 }, L = { scope: "regexp", begin: /\/(?=[^/\n]*\/)/, end: /\/[gimuy]*/, contains: [v, { begin: /\[/, end: /\]/, relevance: 0, contains: [v] }] }, C = { scope: "title", begin: E, relevance: 0 }, B = { scope: "title", begin: w, relevance: 0 }, D = { begin: "\\.\\s*" + w, relevance: 0 };
var P = Object.freeze({ __proto__: null, APOS_STRING_MODE: S, BACKSLASH_ESCAPE: v, BINARY_NUMBER_MODE: j, BINARY_NUMBER_RE: O, COMMENT: I, C_BLOCK_COMMENT_MODE: R, C_LINE_COMMENT_MODE: k, C_NUMBER_MODE: T, C_NUMBER_RE: y, END_SAME_AS_BEGIN: function(e2) {
  return Object.assign(e2, { "on:begin": (e3, t2) => {
    t2.data._beginMatch = e3[1];
  }, "on:end": (e3, t2) => {
    t2.data._beginMatch !== e3[1] && t2.ignoreMatch();
  } });
}, HASH_COMMENT_MODE: N, IDENT_RE: E, MATCH_NOTHING_RE: /\b\B/, METHOD_GUARD: D, NUMBER_MODE: A, NUMBER_RE: x, PHRASAL_WORDS_MODE: { begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/ }, QUOTE_STRING_MODE: M, REGEXP_MODE: L, RE_STARTERS_RE: "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", SHEBANG: (e2 = {}) => {
  const t2 = /^#![ ]*\//;
  return e2.binary && (e2.begin = p(t2, /.*\b/, e2.binary, /\b.*/)), r({ scope: "meta", begin: t2, end: /$/, relevance: 0, "on:begin": (e3, t3) => {
    0 !== e3.index && t3.ignoreMatch();
  } }, e2);
}, TITLE_MODE: C, UNDERSCORE_IDENT_RE: w, UNDERSCORE_TITLE_MODE: B });
function H(e2, t2) {
  "." === e2.input[e2.index - 1] && t2.ignoreMatch();
}
function $(e2, t2) {
  void 0 !== e2.className && (e2.scope = e2.className, delete e2.className);
}
function U(e2, t2) {
  t2 && e2.beginKeywords && (e2.begin = "\\b(" + e2.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", e2.__beforeBegin = H, e2.keywords = e2.keywords || e2.beginKeywords, delete e2.beginKeywords, void 0 === e2.relevance && (e2.relevance = 0));
}
function F(e2, t2) {
  Array.isArray(e2.illegal) && (e2.illegal = f(...e2.illegal));
}
function z(e2, t2) {
  if (e2.match) {
    if (e2.begin || e2.end)
      throw new Error("begin & end are not supported with match");
    e2.begin = e2.match, delete e2.match;
  }
}
function K(e2, t2) {
  void 0 === e2.relevance && (e2.relevance = 1);
}
const G = (e2, t2) => {
  if (!e2.beforeMatch)
    return;
  if (e2.starts)
    throw new Error("beforeMatch cannot be used with starts");
  const n2 = Object.assign({}, e2);
  Object.keys(e2).forEach((t3) => {
    delete e2[t3];
  }), e2.keywords = n2.keywords, e2.begin = p(n2.beforeMatch, g(n2.begin)), e2.starts = { relevance: 0, contains: [Object.assign(n2, { endsParent: true })] }, e2.relevance = 0, delete n2.beforeMatch;
}, Z = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"], W = "keyword";
function X(e2, t2, n2 = W) {
  const i2 = /* @__PURE__ */ Object.create(null);
  return "string" == typeof e2 ? r2(n2, e2.split(" ")) : Array.isArray(e2) ? r2(n2, e2) : Object.keys(e2).forEach(function(n3) {
    Object.assign(i2, X(e2[n3], t2, n3));
  }), i2;
  function r2(e3, n3) {
    t2 && (n3 = n3.map((e4) => e4.toLowerCase())), n3.forEach(function(t3) {
      const n4 = t3.split("|");
      i2[n4[0]] = [e3, Q(n4[0], n4[1])];
    });
  }
}
function Q(e2, t2) {
  return t2 ? Number(t2) : function(e3) {
    return Z.includes(e3.toLowerCase());
  }(e2) ? 0 : 1;
}
const q = {}, V = (e2) => {
  console.error(e2);
}, J = (e2, ...t2) => {
  console.log(`WARN: ${e2}`, ...t2);
}, Y = (e2, t2) => {
  q[`${e2}/${t2}`] || (console.log(`Deprecated as of ${e2}. ${t2}`), q[`${e2}/${t2}`] = true);
}, ee = new Error();
function te(e2, t2, { key: n2 }) {
  let i2 = 0;
  const r2 = e2[n2], o2 = {}, a2 = {};
  for (let e3 = 1; e3 <= t2.length; e3++)
    a2[e3 + i2] = r2[e3], o2[e3 + i2] = true, i2 += b(t2[e3 - 1]);
  e2[n2] = a2, e2[n2]._emit = o2, e2[n2]._multi = true;
}
function ne(e2) {
  !function(e3) {
    e3.scope && "object" == typeof e3.scope && null !== e3.scope && (e3.beginScope = e3.scope, delete e3.scope);
  }(e2), "string" == typeof e2.beginScope && (e2.beginScope = { _wrap: e2.beginScope }), "string" == typeof e2.endScope && (e2.endScope = { _wrap: e2.endScope }), function(e3) {
    if (Array.isArray(e3.begin)) {
      if (e3.skip || e3.excludeBegin || e3.returnBegin)
        throw V("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), ee;
      if ("object" != typeof e3.beginScope || null === e3.beginScope)
        throw V("beginScope must be object"), ee;
      te(e3, e3.begin, { key: "beginScope" }), e3.begin = m(e3.begin, { joinWith: "" });
    }
  }(e2), function(e3) {
    if (Array.isArray(e3.end)) {
      if (e3.skip || e3.excludeEnd || e3.returnEnd)
        throw V("skip, excludeEnd, returnEnd not compatible with endScope: {}"), ee;
      if ("object" != typeof e3.endScope || null === e3.endScope)
        throw V("endScope must be object"), ee;
      te(e3, e3.end, { key: "endScope" }), e3.end = m(e3.end, { joinWith: "" });
    }
  }(e2);
}
function ie(e2) {
  function t2(t3, n3) {
    return new RegExp(u(t3), "m" + (e2.case_insensitive ? "i" : "") + (e2.unicodeRegex ? "u" : "") + (n3 ? "g" : ""));
  }
  class n2 {
    constructor() {
      this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
    }
    addRule(e3, t3) {
      t3.position = this.position++, this.matchIndexes[this.matchAt] = t3, this.regexes.push([t3, e3]), this.matchAt += b(e3) + 1;
    }
    compile() {
      0 === this.regexes.length && (this.exec = () => null);
      const e3 = this.regexes.map((e4) => e4[1]);
      this.matcherRe = t2(m(e3, { joinWith: "|" }), true), this.lastIndex = 0;
    }
    exec(e3) {
      this.matcherRe.lastIndex = this.lastIndex;
      const t3 = this.matcherRe.exec(e3);
      if (!t3)
        return null;
      const n3 = t3.findIndex((e4, t4) => t4 > 0 && void 0 !== e4), i3 = this.matchIndexes[n3];
      return t3.splice(0, n3), Object.assign(t3, i3);
    }
  }
  class i2 {
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
  return e2.classNameAliases = r(e2.classNameAliases || {}), function n3(o2, a2) {
    const s2 = o2;
    if (o2.isCompiled)
      return s2;
    [$, z, ne, G].forEach((e3) => e3(o2, a2)), e2.compilerExtensions.forEach((e3) => e3(o2, a2)), o2.__beforeBegin = null, [U, F, K].forEach((e3) => e3(o2, a2)), o2.isCompiled = true;
    let c2 = null;
    return "object" == typeof o2.keywords && o2.keywords.$pattern && (o2.keywords = Object.assign({}, o2.keywords), c2 = o2.keywords.$pattern, delete o2.keywords.$pattern), c2 = c2 || /\w+/, o2.keywords && (o2.keywords = X(o2.keywords, e2.case_insensitive)), s2.keywordPatternRe = t2(c2, true), a2 && (o2.begin || (o2.begin = /\B|\b/), s2.beginRe = t2(s2.begin), o2.end || o2.endsWithParent || (o2.end = /\B|\b/), o2.end && (s2.endRe = t2(s2.end)), s2.terminatorEnd = u(s2.end) || "", o2.endsWithParent && a2.terminatorEnd && (s2.terminatorEnd += (o2.end ? "|" : "") + a2.terminatorEnd)), o2.illegal && (s2.illegalRe = t2(o2.illegal)), o2.contains || (o2.contains = []), o2.contains = [].concat(...o2.contains.map(function(e3) {
      return function(e4) {
        e4.variants && !e4.cachedVariants && (e4.cachedVariants = e4.variants.map(function(t3) {
          return r(e4, { variants: null }, t3);
        }));
        if (e4.cachedVariants)
          return e4.cachedVariants;
        if (re(e4))
          return r(e4, { starts: e4.starts ? r(e4.starts) : null });
        if (Object.isFrozen(e4))
          return r(e4);
        return e4;
      }("self" === e3 ? o2 : e3);
    })), o2.contains.forEach(function(e3) {
      n3(e3, s2);
    }), o2.starts && n3(o2.starts, a2), s2.matcher = function(e3) {
      const t3 = new i2();
      return e3.contains.forEach((e4) => t3.addRule(e4.begin, { rule: e4, type: "begin" })), e3.terminatorEnd && t3.addRule(e3.terminatorEnd, { type: "end" }), e3.illegal && t3.addRule(e3.illegal, { type: "illegal" }), t3;
    }(s2), s2;
  }(e2);
}
function re(e2) {
  return !!e2 && (e2.endsWithParent || re(e2.starts));
}
class oe extends Error {
  constructor(e2, t2) {
    super(e2), this.name = "HTMLInjectionError", this.html = t2;
  }
}
const ae = i, se = r, ce = Symbol("nomatch"), le = function(e2) {
  const i2 = /* @__PURE__ */ Object.create(null), r2 = /* @__PURE__ */ Object.create(null), o2 = [];
  let a2 = true;
  const s2 = "Could not find the language '{}', did you forget to load/include a language module?", c2 = { disableAutodetect: true, name: "Plain text", contains: [] };
  let u2 = { ignoreUnescapedHTML: false, throwUnescapedHTML: false, noHighlightRe: /^(no-?highlight)$/i, languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i, classPrefix: "hljs-", cssSelector: "pre code", languages: null, __emitter: l };
  function b2(e3) {
    return u2.noHighlightRe.test(e3);
  }
  function _2(e3, t2, n2) {
    let i3 = "", r3 = "";
    "object" == typeof t2 ? (i3 = e3, n2 = t2.ignoreIllegals, r3 = t2.language) : (Y("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Y("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"), r3 = e3, i3 = t2), void 0 === n2 && (n2 = true);
    const o3 = { code: i3, language: r3 };
    M2("before:highlight", o3);
    const a3 = o3.result ? o3.result : m2(o3.language, o3.code, n2);
    return a3.code = o3.code, M2("after:highlight", a3), a3;
  }
  function m2(e3, t2, r3, o3) {
    const c3 = /* @__PURE__ */ Object.create(null);
    function l2() {
      if (!M3.keywords)
        return void k2.addText(R2);
      let e4 = 0;
      M3.keywordPatternRe.lastIndex = 0;
      let t3 = M3.keywordPatternRe.exec(R2), n2 = "";
      for (; t3; ) {
        n2 += R2.substring(e4, t3.index);
        const r4 = y3.case_insensitive ? t3[0].toLowerCase() : t3[0], o4 = (i3 = r4, M3.keywords[i3]);
        if (o4) {
          const [e5, i4] = o4;
          if (k2.addText(n2), n2 = "", c3[r4] = (c3[r4] || 0) + 1, c3[r4] <= 7 && (N2 += i4), e5.startsWith("_"))
            n2 += t3[0];
          else {
            const n3 = y3.classNameAliases[e5] || e5;
            d2(t3[0], n3);
          }
        } else
          n2 += t3[0];
        e4 = M3.keywordPatternRe.lastIndex, t3 = M3.keywordPatternRe.exec(R2);
      }
      var i3;
      n2 += R2.substring(e4), k2.addText(n2);
    }
    function g2() {
      null != M3.subLanguage ? function() {
        if ("" === R2)
          return;
        let e4 = null;
        if ("string" == typeof M3.subLanguage) {
          if (!i2[M3.subLanguage])
            return void k2.addText(R2);
          e4 = m2(M3.subLanguage, R2, true, I2[M3.subLanguage]), I2[M3.subLanguage] = e4._top;
        } else
          e4 = E2(R2, M3.subLanguage.length ? M3.subLanguage : null);
        M3.relevance > 0 && (N2 += e4.relevance), k2.__addSublanguage(e4._emitter, e4.language);
      }() : l2(), R2 = "";
    }
    function d2(e4, t3) {
      "" !== e4 && (k2.startScope(t3), k2.addText(e4), k2.endScope());
    }
    function h2(e4, t3) {
      let n2 = 1;
      const i3 = t3.length - 1;
      for (; n2 <= i3; ) {
        if (!e4._emit[n2]) {
          n2++;
          continue;
        }
        const i4 = y3.classNameAliases[e4[n2]] || e4[n2], r4 = t3[n2];
        i4 ? d2(r4, i4) : (R2 = r4, l2(), R2 = ""), n2++;
      }
    }
    function p2(e4, t3) {
      return e4.scope && "string" == typeof e4.scope && k2.openNode(y3.classNameAliases[e4.scope] || e4.scope), e4.beginScope && (e4.beginScope._wrap ? (d2(R2, y3.classNameAliases[e4.beginScope._wrap] || e4.beginScope._wrap), R2 = "") : e4.beginScope._multi && (h2(e4.beginScope, t3), R2 = "")), M3 = Object.create(e4, { parent: { value: M3 } }), M3;
    }
    function f2(e4, t3, i3) {
      let r4 = function(e5, t4) {
        const n2 = e5 && e5.exec(t4);
        return n2 && 0 === n2.index;
      }(e4.endRe, i3);
      if (r4) {
        if (e4["on:end"]) {
          const i4 = new n(e4);
          e4["on:end"](t3, i4), i4.isMatchIgnored && (r4 = false);
        }
        if (r4) {
          for (; e4.endsParent && e4.parent; )
            e4 = e4.parent;
          return e4;
        }
      }
      if (e4.endsWithParent)
        return f2(e4.parent, t3, i3);
    }
    function b3(e4) {
      return 0 === M3.matcher.regexIndex ? (R2 += e4[0], 1) : (j2 = true, 0);
    }
    function _3(e4) {
      const n2 = e4[0], i3 = t2.substring(e4.index), r4 = f2(M3, e4, i3);
      if (!r4)
        return ce;
      const o4 = M3;
      M3.endScope && M3.endScope._wrap ? (g2(), d2(n2, M3.endScope._wrap)) : M3.endScope && M3.endScope._multi ? (g2(), h2(M3.endScope, e4)) : o4.skip ? R2 += n2 : (o4.returnEnd || o4.excludeEnd || (R2 += n2), g2(), o4.excludeEnd && (R2 = n2));
      do {
        M3.scope && k2.closeNode(), M3.skip || M3.subLanguage || (N2 += M3.relevance), M3 = M3.parent;
      } while (M3 !== r4.parent);
      return r4.starts && p2(r4.starts, e4), o4.returnEnd ? 0 : n2.length;
    }
    let w3 = {};
    function x3(i3, o4) {
      const s3 = o4 && o4[0];
      if (R2 += i3, null == s3)
        return g2(), 0;
      if ("begin" === w3.type && "end" === o4.type && w3.index === o4.index && "" === s3) {
        if (R2 += t2.slice(o4.index, o4.index + 1), !a2) {
          const t3 = new Error(`0 width match regex (${e3})`);
          throw t3.languageName = e3, t3.badRule = w3.rule, t3;
        }
        return 1;
      }
      if (w3 = o4, "begin" === o4.type)
        return function(e4) {
          const t3 = e4[0], i4 = e4.rule, r4 = new n(i4), o5 = [i4.__beforeBegin, i4["on:begin"]];
          for (const n2 of o5)
            if (n2 && (n2(e4, r4), r4.isMatchIgnored))
              return b3(t3);
          return i4.skip ? R2 += t3 : (i4.excludeBegin && (R2 += t3), g2(), i4.returnBegin || i4.excludeBegin || (R2 = t3)), p2(i4, e4), i4.returnBegin ? 0 : t3.length;
        }(o4);
      if ("illegal" === o4.type && !r3) {
        const e4 = new Error('Illegal lexeme "' + s3 + '" for mode "' + (M3.scope || "<unnamed>") + '"');
        throw e4.mode = M3, e4;
      }
      if ("end" === o4.type) {
        const e4 = _3(o4);
        if (e4 !== ce)
          return e4;
      }
      if ("illegal" === o4.type && "" === s3)
        return 1;
      if (T2 > 1e5 && T2 > 3 * o4.index) {
        throw new Error("potential infinite loop, way more iterations than matches");
      }
      return R2 += s3, s3.length;
    }
    const y3 = O2(e3);
    if (!y3)
      throw V(s2.replace("{}", e3)), new Error('Unknown language: "' + e3 + '"');
    const v3 = ie(y3);
    let S3 = "", M3 = o3 || v3;
    const I2 = {}, k2 = new u2.__emitter(u2);
    !function() {
      const e4 = [];
      for (let t3 = M3; t3 !== y3; t3 = t3.parent)
        t3.scope && e4.unshift(t3.scope);
      e4.forEach((e5) => k2.openNode(e5));
    }();
    let R2 = "", N2 = 0, A2 = 0, T2 = 0, j2 = false;
    try {
      if (y3.__emitTokens)
        y3.__emitTokens(t2, k2);
      else {
        for (M3.matcher.considerAll(); ; ) {
          T2++, j2 ? j2 = false : M3.matcher.considerAll(), M3.matcher.lastIndex = A2;
          const e4 = M3.matcher.exec(t2);
          if (!e4)
            break;
          const n2 = x3(t2.substring(A2, e4.index), e4);
          A2 = e4.index + n2;
        }
        x3(t2.substring(A2));
      }
      return k2.finalize(), S3 = k2.toHTML(), { language: e3, value: S3, relevance: N2, illegal: false, _emitter: k2, _top: M3 };
    } catch (n2) {
      if (n2.message && n2.message.includes("Illegal"))
        return { language: e3, value: ae(t2), illegal: true, relevance: 0, _illegalBy: { message: n2.message, index: A2, context: t2.slice(A2 - 100, A2 + 100), mode: n2.mode, resultSoFar: S3 }, _emitter: k2 };
      if (a2)
        return { language: e3, value: ae(t2), illegal: false, relevance: 0, errorRaised: n2, _emitter: k2, _top: M3 };
      throw n2;
    }
  }
  function E2(e3, t2) {
    t2 = t2 || u2.languages || Object.keys(i2);
    const n2 = function(e4) {
      const t3 = { value: ae(e4), illegal: false, relevance: 0, _top: c2, _emitter: new u2.__emitter(u2) };
      return t3._emitter.addText(e4), t3;
    }(e3), r3 = t2.filter(O2).filter(S2).map((t3) => m2(t3, e3, false));
    r3.unshift(n2);
    const o3 = r3.sort((e4, t3) => {
      if (e4.relevance !== t3.relevance)
        return t3.relevance - e4.relevance;
      if (e4.language && t3.language) {
        if (O2(e4.language).supersetOf === t3.language)
          return 1;
        if (O2(t3.language).supersetOf === e4.language)
          return -1;
      }
      return 0;
    }), [a3, s3] = o3, l2 = a3;
    return l2.secondBest = s3, l2;
  }
  function w2(e3) {
    let t2 = null;
    const n2 = function(e4) {
      let t3 = e4.className + " ";
      t3 += e4.parentNode ? e4.parentNode.className : "";
      const n3 = u2.languageDetectRe.exec(t3);
      if (n3) {
        const t4 = O2(n3[1]);
        return t4 || (J(s2.replace("{}", n3[1])), J("Falling back to no-highlight mode for this block.", e4)), t4 ? n3[1] : "no-highlight";
      }
      return t3.split(/\s+/).find((e5) => b2(e5) || O2(e5));
    }(e3);
    if (b2(n2))
      return;
    if (M2("before:highlightElement", { el: e3, language: n2 }), e3.dataset.highlighted)
      return void console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", e3);
    if (e3.children.length > 0 && (u2.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(e3)), u2.throwUnescapedHTML)) {
      throw new oe("One of your code blocks includes unescaped HTML.", e3.innerHTML);
    }
    t2 = e3;
    const i3 = t2.textContent, o3 = n2 ? _2(i3, { language: n2, ignoreIllegals: true }) : E2(i3);
    e3.innerHTML = o3.value, e3.dataset.highlighted = "yes", function(e4, t3, n3) {
      const i4 = t3 && r2[t3] || n3;
      e4.classList.add("hljs"), e4.classList.add(`language-${i4}`);
    }(e3, n2, o3.language), e3.result = { language: o3.language, re: o3.relevance, relevance: o3.relevance }, o3.secondBest && (e3.secondBest = { language: o3.secondBest.language, relevance: o3.secondBest.relevance }), M2("after:highlightElement", { el: e3, result: o3, text: i3 });
  }
  let x2 = false;
  function y2() {
    if ("loading" === document.readyState)
      return void (x2 = true);
    document.querySelectorAll(u2.cssSelector).forEach(w2);
  }
  function O2(e3) {
    return e3 = (e3 || "").toLowerCase(), i2[e3] || i2[r2[e3]];
  }
  function v2(e3, { languageName: t2 }) {
    "string" == typeof e3 && (e3 = [e3]), e3.forEach((e4) => {
      r2[e4.toLowerCase()] = t2;
    });
  }
  function S2(e3) {
    const t2 = O2(e3);
    return t2 && !t2.disableAutodetect;
  }
  function M2(e3, t2) {
    const n2 = e3;
    o2.forEach(function(e4) {
      e4[n2] && e4[n2](t2);
    });
  }
  "undefined" != typeof window && window.addEventListener && window.addEventListener("DOMContentLoaded", function() {
    x2 && y2();
  }, false), Object.assign(e2, { highlight: _2, highlightAuto: E2, highlightAll: y2, highlightElement: w2, highlightBlock: function(e3) {
    return Y("10.7.0", "highlightBlock will be removed entirely in v12.0"), Y("10.7.0", "Please use highlightElement now."), w2(e3);
  }, configure: function(e3) {
    u2 = se(u2, e3);
  }, initHighlighting: () => {
    y2(), Y("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
  }, initHighlightingOnLoad: function() {
    y2(), Y("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
  }, registerLanguage: function(t2, n2) {
    let r3 = null;
    try {
      r3 = n2(e2);
    } catch (e3) {
      if (V("Language definition for '{}' could not be registered.".replace("{}", t2)), !a2)
        throw e3;
      V(e3), r3 = c2;
    }
    r3.name || (r3.name = t2), i2[t2] = r3, r3.rawDefinition = n2.bind(null, e2), r3.aliases && v2(r3.aliases, { languageName: t2 });
  }, unregisterLanguage: function(e3) {
    delete i2[e3];
    for (const t2 of Object.keys(r2))
      r2[t2] === e3 && delete r2[t2];
  }, listLanguages: function() {
    return Object.keys(i2);
  }, getLanguage: O2, registerAliases: v2, autoDetection: S2, inherit: se, addPlugin: function(e3) {
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
    a2 = false;
  }, e2.safeMode = function() {
    a2 = true;
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
  e2.querySelectorAll('code[lang="php"]').forEach((e3) => {
    de.highlightElement(e3);
  });
}
de.registerLanguage("php", (e2) => function(e3) {
  const t2 = e3.regex, n2 = /(?![A-Za-z0-9])(?![$])/, i2 = t2.concat(/[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/, n2), r2 = t2.concat(/(\\?[A-Z][a-z0-9_\x7f-\xff]+|\\?[A-Z]+(?=[A-Z][a-z0-9_\x7f-\xff])){1,}/, n2), o2 = { scope: "variable", match: "\\$+" + i2 }, a2 = { scope: "subst", variants: [{ begin: /\$\w+/ }, { begin: /\{\$/, end: /\}/ }] }, s2 = e3.inherit(e3.APOS_STRING_MODE, { illegal: null }), c2 = "[ 	\n]", l2 = { scope: "string", variants: [e3.inherit(e3.QUOTE_STRING_MODE, { illegal: null, contains: e3.QUOTE_STRING_MODE.contains.concat(a2) }), s2, { begin: /<<<[ \t]*(?:(\w+)|"(\w+)")\n/, end: /[ \t]*(\w+)\b/, contains: e3.QUOTE_STRING_MODE.contains.concat(a2), "on:begin": (e4, t3) => {
    t3.data._beginMatch = e4[1] || e4[2];
  }, "on:end": (e4, t3) => {
    t3.data._beginMatch !== e4[1] && t3.ignoreMatch();
  } }, e3.END_SAME_AS_BEGIN({ begin: /<<<[ \t]*'(\w+)'\n/, end: /[ \t]*(\w+)\b/ })] }, u2 = { scope: "number", variants: [{ begin: "\\b0[bB][01]+(?:_[01]+)*\\b" }, { begin: "\\b0[oO][0-7]+(?:_[0-7]+)*\\b" }, { begin: "\\b0[xX][\\da-fA-F]+(?:_[\\da-fA-F]+)*\\b" }, { begin: "(?:\\b\\d+(?:_\\d+)*(\\.(?:\\d+(?:_\\d+)*))?|\\B\\.\\d+)(?:[eE][+-]?\\d+)?" }], relevance: 0 }, g2 = ["false", "null", "true"], d2 = ["__CLASS__", "__DIR__", "__FILE__", "__FUNCTION__", "__COMPILER_HALT_OFFSET__", "__LINE__", "__METHOD__", "__NAMESPACE__", "__TRAIT__", "die", "echo", "exit", "include", "include_once", "print", "require", "require_once", "array", "abstract", "and", "as", "binary", "bool", "boolean", "break", "callable", "case", "catch", "class", "clone", "const", "continue", "declare", "default", "do", "double", "else", "elseif", "empty", "enddeclare", "endfor", "endforeach", "endif", "endswitch", "endwhile", "enum", "eval", "extends", "final", "finally", "float", "for", "foreach", "from", "global", "goto", "if", "implements", "instanceof", "insteadof", "int", "integer", "interface", "isset", "iterable", "list", "match|0", "mixed", "new", "never", "object", "or", "private", "protected", "public", "readonly", "real", "return", "string", "switch", "throw", "trait", "try", "unset", "use", "var", "void", "while", "xor", "yield"], h2 = ["Error|0", "AppendIterator", "ArgumentCountError", "ArithmeticError", "ArrayIterator", "ArrayObject", "AssertionError", "BadFunctionCallException", "BadMethodCallException", "CachingIterator", "CallbackFilterIterator", "CompileError", "Countable", "DirectoryIterator", "DivisionByZeroError", "DomainException", "EmptyIterator", "ErrorException", "Exception", "FilesystemIterator", "FilterIterator", "GlobIterator", "InfiniteIterator", "InvalidArgumentException", "IteratorIterator", "LengthException", "LimitIterator", "LogicException", "MultipleIterator", "NoRewindIterator", "OutOfBoundsException", "OutOfRangeException", "OuterIterator", "OverflowException", "ParentIterator", "ParseError", "RangeException", "RecursiveArrayIterator", "RecursiveCachingIterator", "RecursiveCallbackFilterIterator", "RecursiveDirectoryIterator", "RecursiveFilterIterator", "RecursiveIterator", "RecursiveIteratorIterator", "RecursiveRegexIterator", "RecursiveTreeIterator", "RegexIterator", "RuntimeException", "SeekableIterator", "SplDoublyLinkedList", "SplFileInfo", "SplFileObject", "SplFixedArray", "SplHeap", "SplMaxHeap", "SplMinHeap", "SplObjectStorage", "SplObserver", "SplPriorityQueue", "SplQueue", "SplStack", "SplSubject", "SplTempFileObject", "TypeError", "UnderflowException", "UnexpectedValueException", "UnhandledMatchError", "ArrayAccess", "BackedEnum", "Closure", "Fiber", "Generator", "Iterator", "IteratorAggregate", "Serializable", "Stringable", "Throwable", "Traversable", "UnitEnum", "WeakReference", "WeakMap", "Directory", "__PHP_Incomplete_Class", "parent", "php_user_filter", "self", "static", "stdClass"], p2 = { keyword: d2, literal: ((e4) => {
    const t3 = [];
    return e4.forEach((e5) => {
      t3.push(e5), e5.toLowerCase() === e5 ? t3.push(e5.toUpperCase()) : t3.push(e5.toLowerCase());
    }), t3;
  })(g2), built_in: h2 }, f2 = (e4) => e4.map((e5) => e5.replace(/\|\d+$/, "")), b2 = { variants: [{ match: [/new/, t2.concat(c2, "+"), t2.concat("(?!", f2(h2).join("\\b|"), "\\b)"), r2], scope: { 1: "keyword", 4: "title.class" } }] }, _2 = t2.concat(i2, "\\b(?!\\()"), m2 = { variants: [{ match: [t2.concat(/::/, t2.lookahead(/(?!class\b)/)), _2], scope: { 2: "variable.constant" } }, { match: [/::/, /class/], scope: { 2: "variable.language" } }, { match: [r2, t2.concat(/::/, t2.lookahead(/(?!class\b)/)), _2], scope: { 1: "title.class", 3: "variable.constant" } }, { match: [r2, t2.concat("::", t2.lookahead(/(?!class\b)/))], scope: { 1: "title.class" } }, { match: [r2, /::/, /class/], scope: { 1: "title.class", 3: "variable.language" } }] }, E2 = { scope: "attr", match: t2.concat(i2, t2.lookahead(":"), t2.lookahead(/(?!::)/)) }, w2 = { relevance: 0, begin: /\(/, end: /\)/, keywords: p2, contains: [E2, o2, m2, e3.C_BLOCK_COMMENT_MODE, l2, u2, b2] }, x2 = { relevance: 0, match: [/\b/, t2.concat("(?!fn\\b|function\\b|", f2(d2).join("\\b|"), "|", f2(h2).join("\\b|"), "\\b)"), i2, t2.concat(c2, "*"), t2.lookahead(/(?=\()/)], scope: { 3: "title.function.invoke" }, contains: [w2] };
  w2.contains.push(x2);
  const y2 = [E2, m2, e3.C_BLOCK_COMMENT_MODE, l2, u2, b2];
  return { case_insensitive: false, keywords: p2, contains: [{ begin: t2.concat(/#\[\s*/, r2), beginScope: "meta", end: /]/, endScope: "meta", keywords: { literal: g2, keyword: ["new", "array"] }, contains: [{ begin: /\[/, end: /]/, keywords: { literal: g2, keyword: ["new", "array"] }, contains: ["self", ...y2] }, ...y2, { scope: "meta", match: r2 }] }, e3.HASH_COMMENT_MODE, e3.COMMENT("//", "$"), e3.COMMENT("/\\*", "\\*/", { contains: [{ scope: "doctag", match: "@[A-Za-z]+" }] }), { match: /__halt_compiler\(\);/, keywords: "__halt_compiler", starts: { scope: "comment", end: e3.MATCH_NOTHING_RE, contains: [{ match: /\?>/, scope: "meta", endsParent: true }] } }, { scope: "meta", variants: [{ begin: /<\?php/, relevance: 10 }, { begin: /<\?=/ }, { begin: /<\?/, relevance: 0.1 }, { begin: /\?>/ }] }, { scope: "variable.language", match: /\$this\b/ }, o2, x2, m2, { match: [/const/, /\s/, i2], scope: { 1: "keyword", 3: "variable.constant" } }, b2, { scope: "function", relevance: 0, beginKeywords: "fn function", end: /[;{]/, excludeEnd: true, illegal: "[$%\\[]", contains: [{ beginKeywords: "use" }, e3.UNDERSCORE_TITLE_MODE, { begin: "=>", endsParent: true }, { scope: "params", begin: "\\(", end: "\\)", excludeBegin: true, excludeEnd: true, keywords: p2, contains: ["self", o2, m2, e3.C_BLOCK_COMMENT_MODE, l2, u2] }] }, { scope: "class", variants: [{ beginKeywords: "enum", illegal: /[($"]/ }, { beginKeywords: "class interface trait", illegal: /[:($"]/ }], relevance: 0, end: /\{/, excludeEnd: true, contains: [{ beginKeywords: "extends implements" }, e3.UNDERSCORE_TITLE_MODE] }, { beginKeywords: "namespace", relevance: 0, end: ";", illegal: /[.']/, contains: [e3.inherit(e3.UNDERSCORE_TITLE_MODE, { scope: "title.class" })] }, { beginKeywords: "use", relevance: 0, end: ";", contains: [{ match: /\b(as|const|function)\b/, scope: "keyword" }, e3.UNDERSCORE_TITLE_MODE] }, l2, u2] };
}(e2)), void 0 === window.process && he(document);
export {
  he as execHighlight
};
