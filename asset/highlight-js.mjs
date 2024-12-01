function e(e2) {
  return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
}
function n(e2) {
  return e2 instanceof Map ? e2.clear = e2.delete = e2.set = function() {
    throw new Error("map is read-only");
  } : e2 instanceof Set && (e2.add = e2.clear = e2.delete = function() {
    throw new Error("set is read-only");
  }), Object.freeze(e2), Object.getOwnPropertyNames(e2).forEach((t2) => {
    const i2 = e2[t2], s2 = typeof i2;
    "object" !== s2 && "function" !== s2 || Object.isFrozen(i2) || n(i2);
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
function s(e2, ...n2) {
  const t2 = /* @__PURE__ */ Object.create(null);
  for (const n3 in e2)
    t2[n3] = e2[n3];
  return n2.forEach(function(e3) {
    for (const n3 in e3)
      t2[n3] = e3[n3];
  }), t2;
}
const a = (e2) => !!e2.scope;
class r {
  constructor(e2, n2) {
    this.buffer = "", this.classPrefix = n2.classPrefix, e2.walk(this);
  }
  addText(e2) {
    this.buffer += i(e2);
  }
  openNode(e2) {
    if (!a(e2))
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
    a(e2) && (this.buffer += "</span>");
  }
  value() {
    return this.buffer;
  }
  span(e2) {
    this.buffer += `<span class="${e2}">`;
  }
}
const o = (e2 = {}) => {
  const n2 = { children: [] };
  return Object.assign(n2, e2), n2;
};
class c {
  constructor() {
    this.rootNode = o(), this.stack = [this.rootNode];
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
    const n2 = o({ scope: e2 });
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
    return new r(this, this.options).value();
  }
  finalize() {
    return this.closeAllNodes(), true;
  }
}
function g(e2) {
  return e2 ? "string" == typeof e2 ? e2 : e2.source : null;
}
function u(e2) {
  return f("(?=", e2, ")");
}
function d(e2) {
  return f("(?:", e2, ")*");
}
function h(e2) {
  return f("(?:", e2, ")?");
}
function f(...e2) {
  return e2.map((e3) => g(e3)).join("");
}
function b(...e2) {
  const n2 = function(e3) {
    const n3 = e3[e3.length - 1];
    return "object" == typeof n3 && n3.constructor === Object ? (e3.splice(e3.length - 1, 1), n3) : {};
  }(e2);
  return "(" + (n2.capture ? "" : "?:") + e2.map((e3) => g(e3)).join("|") + ")";
}
function p(e2) {
  return new RegExp(e2.toString() + "|").exec("").length - 1;
}
const m = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
function E(e2, { joinWith: n2 }) {
  let t2 = 0;
  return e2.map((e3) => {
    t2 += 1;
    const n3 = t2;
    let i2 = g(e3), s2 = "";
    for (; i2.length > 0; ) {
      const e4 = m.exec(i2);
      if (!e4) {
        s2 += i2;
        break;
      }
      s2 += i2.substring(0, e4.index), i2 = i2.substring(e4.index + e4[0].length), "\\" === e4[0][0] && e4[1] ? s2 += "\\" + String(Number(e4[1]) + n3) : (s2 += e4[0], "(" === e4[0] && t2++);
    }
    return s2;
  }).map((e3) => `(${e3})`).join(n2);
}
const y = "[a-zA-Z]\\w*", _ = "[a-zA-Z_]\\w*", w = "\\b\\d+(\\.\\d+)?", x = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", A = "\\b(0b[01]+)", N = { begin: "\\\\[\\s\\S]", relevance: 0 }, v = { scope: "string", begin: "'", end: "'", illegal: "\\n", contains: [N] }, S = { scope: "string", begin: '"', end: '"', illegal: "\\n", contains: [N] }, O = function(e2, n2, t2 = {}) {
  const i2 = s({ scope: "comment", begin: e2, end: n2, contains: [] }, t2);
  i2.contains.push({ scope: "doctag", begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)", end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/, excludeBegin: true, relevance: 0 });
  const a2 = b("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
  return i2.contains.push({ begin: f(/[ ]+/, "(", a2, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), i2;
}, k = O("//", "$"), R = O("/\\*", "\\*/"), M = O("#", "$"), I = { scope: "number", begin: w, relevance: 0 }, T = { scope: "number", begin: x, relevance: 0 }, j = { scope: "number", begin: A, relevance: 0 }, B = { scope: "regexp", begin: /\/(?=[^/\n]*\/)/, end: /\/[gimuy]*/, contains: [N, { begin: /\[/, end: /\]/, relevance: 0, contains: [N] }] }, L = { scope: "title", begin: y, relevance: 0 }, C = { scope: "title", begin: _, relevance: 0 }, D = { begin: "\\.\\s*" + _, relevance: 0 };
var $ = Object.freeze({ __proto__: null, APOS_STRING_MODE: v, BACKSLASH_ESCAPE: N, BINARY_NUMBER_MODE: j, BINARY_NUMBER_RE: A, COMMENT: O, C_BLOCK_COMMENT_MODE: R, C_LINE_COMMENT_MODE: k, C_NUMBER_MODE: T, C_NUMBER_RE: x, END_SAME_AS_BEGIN: function(e2) {
  return Object.assign(e2, { "on:begin": (e3, n2) => {
    n2.data._beginMatch = e3[1];
  }, "on:end": (e3, n2) => {
    n2.data._beginMatch !== e3[1] && n2.ignoreMatch();
  } });
}, HASH_COMMENT_MODE: M, IDENT_RE: y, MATCH_NOTHING_RE: /\b\B/, METHOD_GUARD: D, NUMBER_MODE: I, NUMBER_RE: w, PHRASAL_WORDS_MODE: { begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/ }, QUOTE_STRING_MODE: S, REGEXP_MODE: B, RE_STARTERS_RE: "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", SHEBANG: (e2 = {}) => {
  const n2 = /^#![ ]*\//;
  return e2.binary && (e2.begin = f(n2, /.*\b/, e2.binary, /\b.*/)), s({ scope: "meta", begin: n2, end: /$/, relevance: 0, "on:begin": (e3, n3) => {
    0 !== e3.index && n3.ignoreMatch();
  } }, e2);
}, TITLE_MODE: L, UNDERSCORE_IDENT_RE: _, UNDERSCORE_TITLE_MODE: C });
function P(e2, n2) {
  "." === e2.input[e2.index - 1] && n2.ignoreMatch();
}
function H(e2, n2) {
  void 0 !== e2.className && (e2.scope = e2.className, delete e2.className);
}
function U(e2, n2) {
  n2 && e2.beginKeywords && (e2.begin = "\\b(" + e2.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", e2.__beforeBegin = P, e2.keywords = e2.keywords || e2.beginKeywords, delete e2.beginKeywords, void 0 === e2.relevance && (e2.relevance = 0));
}
function z(e2, n2) {
  Array.isArray(e2.illegal) && (e2.illegal = b(...e2.illegal));
}
function Z(e2, n2) {
  if (e2.match) {
    if (e2.begin || e2.end)
      throw new Error("begin & end are not supported with match");
    e2.begin = e2.match, delete e2.match;
  }
}
function F(e2, n2) {
  void 0 === e2.relevance && (e2.relevance = 1);
}
const G = (e2, n2) => {
  if (!e2.beforeMatch)
    return;
  if (e2.starts)
    throw new Error("beforeMatch cannot be used with starts");
  const t2 = Object.assign({}, e2);
  Object.keys(e2).forEach((n3) => {
    delete e2[n3];
  }), e2.keywords = t2.keywords, e2.begin = f(t2.beforeMatch, u(t2.begin)), e2.starts = { relevance: 0, contains: [Object.assign(t2, { endsParent: true })] }, e2.relevance = 0, delete t2.beforeMatch;
}, W = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"], K = "keyword";
function X(e2, n2, t2 = K) {
  const i2 = /* @__PURE__ */ Object.create(null);
  return "string" == typeof e2 ? s2(t2, e2.split(" ")) : Array.isArray(e2) ? s2(t2, e2) : Object.keys(e2).forEach(function(t3) {
    Object.assign(i2, X(e2[t3], n2, t3));
  }), i2;
  function s2(e3, t3) {
    n2 && (t3 = t3.map((e4) => e4.toLowerCase())), t3.forEach(function(n3) {
      const t4 = n3.split("|");
      i2[t4[0]] = [e3, q(t4[0], t4[1])];
    });
  }
}
function q(e2, n2) {
  return n2 ? Number(n2) : function(e3) {
    return W.includes(e3.toLowerCase());
  }(e2) ? 0 : 1;
}
const J = {}, V = (e2) => {
  console.error(e2);
}, Q = (e2, ...n2) => {
  console.log(`WARN: ${e2}`, ...n2);
}, Y = (e2, n2) => {
  J[`${e2}/${n2}`] || (console.log(`Deprecated as of ${e2}. ${n2}`), J[`${e2}/${n2}`] = true);
}, ee = new Error();
function ne(e2, n2, { key: t2 }) {
  let i2 = 0;
  const s2 = e2[t2], a2 = {}, r2 = {};
  for (let e3 = 1; e3 <= n2.length; e3++)
    r2[e3 + i2] = s2[e3], a2[e3 + i2] = true, i2 += p(n2[e3 - 1]);
  e2[t2] = r2, e2[t2]._emit = a2, e2[t2]._multi = true;
}
function te(e2) {
  !function(e3) {
    e3.scope && "object" == typeof e3.scope && null !== e3.scope && (e3.beginScope = e3.scope, delete e3.scope);
  }(e2), "string" == typeof e2.beginScope && (e2.beginScope = { _wrap: e2.beginScope }), "string" == typeof e2.endScope && (e2.endScope = { _wrap: e2.endScope }), function(e3) {
    if (Array.isArray(e3.begin)) {
      if (e3.skip || e3.excludeBegin || e3.returnBegin)
        throw V("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), ee;
      if ("object" != typeof e3.beginScope || null === e3.beginScope)
        throw V("beginScope must be object"), ee;
      ne(e3, e3.begin, { key: "beginScope" }), e3.begin = E(e3.begin, { joinWith: "" });
    }
  }(e2), function(e3) {
    if (Array.isArray(e3.end)) {
      if (e3.skip || e3.excludeEnd || e3.returnEnd)
        throw V("skip, excludeEnd, returnEnd not compatible with endScope: {}"), ee;
      if ("object" != typeof e3.endScope || null === e3.endScope)
        throw V("endScope must be object"), ee;
      ne(e3, e3.end, { key: "endScope" }), e3.end = E(e3.end, { joinWith: "" });
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
      n3.position = this.position++, this.matchIndexes[this.matchAt] = n3, this.regexes.push([n3, e3]), this.matchAt += p(e3) + 1;
    }
    compile() {
      0 === this.regexes.length && (this.exec = () => null);
      const e3 = this.regexes.map((e4) => e4[1]);
      this.matcherRe = n2(E(e3, { joinWith: "|" }), true), this.lastIndex = 0;
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
  return e2.classNameAliases = s(e2.classNameAliases || {}), function t3(a2, r2) {
    const o2 = a2;
    if (a2.isCompiled)
      return o2;
    [H, Z, te, G].forEach((e3) => e3(a2, r2)), e2.compilerExtensions.forEach((e3) => e3(a2, r2)), a2.__beforeBegin = null, [U, z, F].forEach((e3) => e3(a2, r2)), a2.isCompiled = true;
    let c2 = null;
    return "object" == typeof a2.keywords && a2.keywords.$pattern && (a2.keywords = Object.assign({}, a2.keywords), c2 = a2.keywords.$pattern, delete a2.keywords.$pattern), c2 = c2 || /\w+/, a2.keywords && (a2.keywords = X(a2.keywords, e2.case_insensitive)), o2.keywordPatternRe = n2(c2, true), r2 && (a2.begin || (a2.begin = /\B|\b/), o2.beginRe = n2(o2.begin), a2.end || a2.endsWithParent || (a2.end = /\B|\b/), a2.end && (o2.endRe = n2(o2.end)), o2.terminatorEnd = g(o2.end) || "", a2.endsWithParent && r2.terminatorEnd && (o2.terminatorEnd += (a2.end ? "|" : "") + r2.terminatorEnd)), a2.illegal && (o2.illegalRe = n2(a2.illegal)), a2.contains || (a2.contains = []), a2.contains = [].concat(...a2.contains.map(function(e3) {
      return function(e4) {
        e4.variants && !e4.cachedVariants && (e4.cachedVariants = e4.variants.map(function(n3) {
          return s(e4, { variants: null }, n3);
        }));
        if (e4.cachedVariants)
          return e4.cachedVariants;
        if (se(e4))
          return s(e4, { starts: e4.starts ? s(e4.starts) : null });
        if (Object.isFrozen(e4))
          return s(e4);
        return e4;
      }("self" === e3 ? a2 : e3);
    })), a2.contains.forEach(function(e3) {
      t3(e3, o2);
    }), a2.starts && t3(a2.starts, r2), o2.matcher = function(e3) {
      const n3 = new i2();
      return e3.contains.forEach((e4) => n3.addRule(e4.begin, { rule: e4, type: "begin" })), e3.terminatorEnd && n3.addRule(e3.terminatorEnd, { type: "end" }), e3.illegal && n3.addRule(e3.illegal, { type: "illegal" }), n3;
    }(o2), o2;
  }(e2);
}
function se(e2) {
  return !!e2 && (e2.endsWithParent || se(e2.starts));
}
class ae extends Error {
  constructor(e2, n2) {
    super(e2), this.name = "HTMLInjectionError", this.html = n2;
  }
}
const re = i, oe = s, ce = Symbol("nomatch"), le = function(e2) {
  const i2 = /* @__PURE__ */ Object.create(null), s2 = /* @__PURE__ */ Object.create(null), a2 = [];
  let r2 = true;
  const o2 = "Could not find the language '{}', did you forget to load/include a language module?", c2 = { disableAutodetect: true, name: "Plain text", contains: [] };
  let g2 = { ignoreUnescapedHTML: false, throwUnescapedHTML: false, noHighlightRe: /^(no-?highlight)$/i, languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i, classPrefix: "hljs-", cssSelector: "pre code", languages: null, __emitter: l };
  function p2(e3) {
    return g2.noHighlightRe.test(e3);
  }
  function m2(e3, n2, t2) {
    let i3 = "", s3 = "";
    "object" == typeof n2 ? (i3 = e3, t2 = n2.ignoreIllegals, s3 = n2.language) : (Y("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Y("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"), s3 = e3, i3 = n2), void 0 === t2 && (t2 = true);
    const a3 = { code: i3, language: s3 };
    S2("before:highlight", a3);
    const r3 = a3.result ? a3.result : E2(a3.language, a3.code, t2);
    return r3.code = a3.code, S2("after:highlight", r3), r3;
  }
  function E2(e3, n2, s3, a3) {
    const c3 = /* @__PURE__ */ Object.create(null);
    function l2() {
      if (!S3.keywords)
        return void k2.addText(R2);
      let e4 = 0;
      S3.keywordPatternRe.lastIndex = 0;
      let n3 = S3.keywordPatternRe.exec(R2), t2 = "";
      for (; n3; ) {
        t2 += R2.substring(e4, n3.index);
        const s4 = x3.case_insensitive ? n3[0].toLowerCase() : n3[0], a4 = (i3 = s4, S3.keywords[i3]);
        if (a4) {
          const [e5, i4] = a4;
          if (k2.addText(t2), t2 = "", c3[s4] = (c3[s4] || 0) + 1, c3[s4] <= 7 && (M2 += i4), e5.startsWith("_"))
            t2 += n3[0];
          else {
            const t3 = x3.classNameAliases[e5] || e5;
            d2(n3[0], t3);
          }
        } else
          t2 += n3[0];
        e4 = S3.keywordPatternRe.lastIndex, n3 = S3.keywordPatternRe.exec(R2);
      }
      var i3;
      t2 += R2.substring(e4), k2.addText(t2);
    }
    function u2() {
      null != S3.subLanguage ? function() {
        if ("" === R2)
          return;
        let e4 = null;
        if ("string" == typeof S3.subLanguage) {
          if (!i2[S3.subLanguage])
            return void k2.addText(R2);
          e4 = E2(S3.subLanguage, R2, true, O2[S3.subLanguage]), O2[S3.subLanguage] = e4._top;
        } else
          e4 = y2(R2, S3.subLanguage.length ? S3.subLanguage : null);
        S3.relevance > 0 && (M2 += e4.relevance), k2.__addSublanguage(e4._emitter, e4.language);
      }() : l2(), R2 = "";
    }
    function d2(e4, n3) {
      "" !== e4 && (k2.startScope(n3), k2.addText(e4), k2.endScope());
    }
    function h2(e4, n3) {
      let t2 = 1;
      const i3 = n3.length - 1;
      for (; t2 <= i3; ) {
        if (!e4._emit[t2]) {
          t2++;
          continue;
        }
        const i4 = x3.classNameAliases[e4[t2]] || e4[t2], s4 = n3[t2];
        i4 ? d2(s4, i4) : (R2 = s4, l2(), R2 = ""), t2++;
      }
    }
    function f2(e4, n3) {
      return e4.scope && "string" == typeof e4.scope && k2.openNode(x3.classNameAliases[e4.scope] || e4.scope), e4.beginScope && (e4.beginScope._wrap ? (d2(R2, x3.classNameAliases[e4.beginScope._wrap] || e4.beginScope._wrap), R2 = "") : e4.beginScope._multi && (h2(e4.beginScope, n3), R2 = "")), S3 = Object.create(e4, { parent: { value: S3 } }), S3;
    }
    function b2(e4, n3, i3) {
      let s4 = function(e5, n4) {
        const t2 = e5 && e5.exec(n4);
        return t2 && 0 === t2.index;
      }(e4.endRe, i3);
      if (s4) {
        if (e4["on:end"]) {
          const i4 = new t(e4);
          e4["on:end"](n3, i4), i4.isMatchIgnored && (s4 = false);
        }
        if (s4) {
          for (; e4.endsParent && e4.parent; )
            e4 = e4.parent;
          return e4;
        }
      }
      if (e4.endsWithParent)
        return b2(e4.parent, n3, i3);
    }
    function p3(e4) {
      return 0 === S3.matcher.regexIndex ? (R2 += e4[0], 1) : (j2 = true, 0);
    }
    function m3(e4) {
      const t2 = e4[0], i3 = n2.substring(e4.index), s4 = b2(S3, e4, i3);
      if (!s4)
        return ce;
      const a4 = S3;
      S3.endScope && S3.endScope._wrap ? (u2(), d2(t2, S3.endScope._wrap)) : S3.endScope && S3.endScope._multi ? (u2(), h2(S3.endScope, e4)) : a4.skip ? R2 += t2 : (a4.returnEnd || a4.excludeEnd || (R2 += t2), u2(), a4.excludeEnd && (R2 = t2));
      do {
        S3.scope && k2.closeNode(), S3.skip || S3.subLanguage || (M2 += S3.relevance), S3 = S3.parent;
      } while (S3 !== s4.parent);
      return s4.starts && f2(s4.starts, e4), a4.returnEnd ? 0 : t2.length;
    }
    let _3 = {};
    function w3(i3, a4) {
      const o3 = a4 && a4[0];
      if (R2 += i3, null == o3)
        return u2(), 0;
      if ("begin" === _3.type && "end" === a4.type && _3.index === a4.index && "" === o3) {
        if (R2 += n2.slice(a4.index, a4.index + 1), !r2) {
          const n3 = new Error(`0 width match regex (${e3})`);
          throw n3.languageName = e3, n3.badRule = _3.rule, n3;
        }
        return 1;
      }
      if (_3 = a4, "begin" === a4.type)
        return function(e4) {
          const n3 = e4[0], i4 = e4.rule, s4 = new t(i4), a5 = [i4.__beforeBegin, i4["on:begin"]];
          for (const t2 of a5)
            if (t2 && (t2(e4, s4), s4.isMatchIgnored))
              return p3(n3);
          return i4.skip ? R2 += n3 : (i4.excludeBegin && (R2 += n3), u2(), i4.returnBegin || i4.excludeBegin || (R2 = n3)), f2(i4, e4), i4.returnBegin ? 0 : n3.length;
        }(a4);
      if ("illegal" === a4.type && !s3) {
        const e4 = new Error('Illegal lexeme "' + o3 + '" for mode "' + (S3.scope || "<unnamed>") + '"');
        throw e4.mode = S3, e4;
      }
      if ("end" === a4.type) {
        const e4 = m3(a4);
        if (e4 !== ce)
          return e4;
      }
      if ("illegal" === a4.type && "" === o3)
        return 1;
      if (T2 > 1e5 && T2 > 3 * a4.index) {
        throw new Error("potential infinite loop, way more iterations than matches");
      }
      return R2 += o3, o3.length;
    }
    const x3 = A2(e3);
    if (!x3)
      throw V(o2.replace("{}", e3)), new Error('Unknown language: "' + e3 + '"');
    const N3 = ie(x3);
    let v3 = "", S3 = a3 || N3;
    const O2 = {}, k2 = new g2.__emitter(g2);
    !function() {
      const e4 = [];
      for (let n3 = S3; n3 !== x3; n3 = n3.parent)
        n3.scope && e4.unshift(n3.scope);
      e4.forEach((e5) => k2.openNode(e5));
    }();
    let R2 = "", M2 = 0, I2 = 0, T2 = 0, j2 = false;
    try {
      if (x3.__emitTokens)
        x3.__emitTokens(n2, k2);
      else {
        for (S3.matcher.considerAll(); ; ) {
          T2++, j2 ? j2 = false : S3.matcher.considerAll(), S3.matcher.lastIndex = I2;
          const e4 = S3.matcher.exec(n2);
          if (!e4)
            break;
          const t2 = w3(n2.substring(I2, e4.index), e4);
          I2 = e4.index + t2;
        }
        w3(n2.substring(I2));
      }
      return k2.finalize(), v3 = k2.toHTML(), { language: e3, value: v3, relevance: M2, illegal: false, _emitter: k2, _top: S3 };
    } catch (t2) {
      if (t2.message && t2.message.includes("Illegal"))
        return { language: e3, value: re(n2), illegal: true, relevance: 0, _illegalBy: { message: t2.message, index: I2, context: n2.slice(I2 - 100, I2 + 100), mode: t2.mode, resultSoFar: v3 }, _emitter: k2 };
      if (r2)
        return { language: e3, value: re(n2), illegal: false, relevance: 0, errorRaised: t2, _emitter: k2, _top: S3 };
      throw t2;
    }
  }
  function y2(e3, n2) {
    n2 = n2 || g2.languages || Object.keys(i2);
    const t2 = function(e4) {
      const n3 = { value: re(e4), illegal: false, relevance: 0, _top: c2, _emitter: new g2.__emitter(g2) };
      return n3._emitter.addText(e4), n3;
    }(e3), s3 = n2.filter(A2).filter(v2).map((n3) => E2(n3, e3, false));
    s3.unshift(t2);
    const a3 = s3.sort((e4, n3) => {
      if (e4.relevance !== n3.relevance)
        return n3.relevance - e4.relevance;
      if (e4.language && n3.language) {
        if (A2(e4.language).supersetOf === n3.language)
          return 1;
        if (A2(n3.language).supersetOf === e4.language)
          return -1;
      }
      return 0;
    }), [r3, o3] = a3, l2 = r3;
    return l2.secondBest = o3, l2;
  }
  function _2(e3) {
    let n2 = null;
    const t2 = function(e4) {
      let n3 = e4.className + " ";
      n3 += e4.parentNode ? e4.parentNode.className : "";
      const t3 = g2.languageDetectRe.exec(n3);
      if (t3) {
        const n4 = A2(t3[1]);
        return n4 || (Q(o2.replace("{}", t3[1])), Q("Falling back to no-highlight mode for this block.", e4)), n4 ? t3[1] : "no-highlight";
      }
      return n3.split(/\s+/).find((e5) => p2(e5) || A2(e5));
    }(e3);
    if (p2(t2))
      return;
    if (S2("before:highlightElement", { el: e3, language: t2 }), e3.dataset.highlighted)
      return void console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", e3);
    if (e3.children.length > 0 && (g2.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(e3)), g2.throwUnescapedHTML)) {
      throw new ae("One of your code blocks includes unescaped HTML.", e3.innerHTML);
    }
    n2 = e3;
    const i3 = n2.textContent, a3 = t2 ? m2(i3, { language: t2, ignoreIllegals: true }) : y2(i3);
    e3.innerHTML = a3.value, e3.dataset.highlighted = "yes", function(e4, n3, t3) {
      const i4 = n3 && s2[n3] || t3;
      e4.classList.add("hljs"), e4.classList.add(`language-${i4}`);
    }(e3, t2, a3.language), e3.result = { language: a3.language, re: a3.relevance, relevance: a3.relevance }, a3.secondBest && (e3.secondBest = { language: a3.secondBest.language, relevance: a3.secondBest.relevance }), S2("after:highlightElement", { el: e3, result: a3, text: i3 });
  }
  let w2 = false;
  function x2() {
    if ("loading" === document.readyState)
      return void (w2 = true);
    document.querySelectorAll(g2.cssSelector).forEach(_2);
  }
  function A2(e3) {
    return e3 = (e3 || "").toLowerCase(), i2[e3] || i2[s2[e3]];
  }
  function N2(e3, { languageName: n2 }) {
    "string" == typeof e3 && (e3 = [e3]), e3.forEach((e4) => {
      s2[e4.toLowerCase()] = n2;
    });
  }
  function v2(e3) {
    const n2 = A2(e3);
    return n2 && !n2.disableAutodetect;
  }
  function S2(e3, n2) {
    const t2 = e3;
    a2.forEach(function(e4) {
      e4[t2] && e4[t2](n2);
    });
  }
  "undefined" != typeof window && window.addEventListener && window.addEventListener("DOMContentLoaded", function() {
    w2 && x2();
  }, false), Object.assign(e2, { highlight: m2, highlightAuto: y2, highlightAll: x2, highlightElement: _2, highlightBlock: function(e3) {
    return Y("10.7.0", "highlightBlock will be removed entirely in v12.0"), Y("10.7.0", "Please use highlightElement now."), _2(e3);
  }, configure: function(e3) {
    g2 = oe(g2, e3);
  }, initHighlighting: () => {
    x2(), Y("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
  }, initHighlightingOnLoad: function() {
    x2(), Y("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
  }, registerLanguage: function(n2, t2) {
    let s3 = null;
    try {
      s3 = t2(e2);
    } catch (e3) {
      if (V("Language definition for '{}' could not be registered.".replace("{}", n2)), !r2)
        throw e3;
      V(e3), s3 = c2;
    }
    s3.name || (s3.name = n2), i2[n2] = s3, s3.rawDefinition = t2.bind(null, e2), s3.aliases && N2(s3.aliases, { languageName: n2 });
  }, unregisterLanguage: function(e3) {
    delete i2[e3];
    for (const n2 of Object.keys(s2))
      s2[n2] === e3 && delete s2[n2];
  }, listLanguages: function() {
    return Object.keys(i2);
  }, getLanguage: A2, registerAliases: N2, autoDetection: v2, inherit: oe, addPlugin: function(e3) {
    !function(e4) {
      e4["before:highlightBlock"] && !e4["before:highlightElement"] && (e4["before:highlightElement"] = (n2) => {
        e4["before:highlightBlock"](Object.assign({ block: n2.el }, n2));
      }), e4["after:highlightBlock"] && !e4["after:highlightElement"] && (e4["after:highlightElement"] = (n2) => {
        e4["after:highlightBlock"](Object.assign({ block: n2.el }, n2));
      });
    }(e3), a2.push(e3);
  }, removePlugin: function(e3) {
    const n2 = a2.indexOf(e3);
    -1 !== n2 && a2.splice(n2, 1);
  } }), e2.debugMode = function() {
    r2 = false;
  }, e2.safeMode = function() {
    r2 = true;
  }, e2.versionString = "11.9.0", e2.regex = { concat: f, lookahead: u, either: b, optional: h, anyNumberOfTimes: d };
  for (const e3 in $)
    "object" == typeof $[e3] && n($[e3]);
  return Object.assign(e2, $), e2;
}, ge = le({});
ge.newInstance = () => le({});
var ue = ge;
ge.HighlightJS = ge, ge.default = ge;
const de = e(ue), he = "[A-Za-z$_][0-9A-Za-z$_]*", fe = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"], be = ["true", "false", "null", "undefined", "NaN", "Infinity"], pe = ["Object", "Function", "Boolean", "Symbol", "Math", "Date", "Number", "BigInt", "String", "RegExp", "Array", "Float32Array", "Float64Array", "Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Int32Array", "Uint16Array", "Uint32Array", "BigInt64Array", "BigUint64Array", "Set", "Map", "WeakSet", "WeakMap", "ArrayBuffer", "SharedArrayBuffer", "Atomics", "DataView", "JSON", "Promise", "Generator", "GeneratorFunction", "AsyncFunction", "Reflect", "Proxy", "Intl", "WebAssembly"], me = ["Error", "EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"], Ee = ["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"], ye = ["arguments", "this", "super", "console", "window", "document", "localStorage", "sessionStorage", "module", "global"], _e = [].concat(Ee, pe, me);
function we(e2 = document) {
  e2.querySelectorAll('code[lang="javascript"],code[lang="js"]').forEach((e3) => {
    de.highlightElement(e3);
  });
}
de.registerLanguage("javascript", (e2) => function(e3) {
  const n2 = e3.regex, t2 = he, i2 = "<>", s2 = "</>", a2 = { begin: /<[A-Za-z0-9\\._:-]+/, end: /\/[A-Za-z0-9\\._:-]+>|\/>/, isTrulyOpeningTag: (e4, n3) => {
    const t3 = e4[0].length + e4.index, i3 = e4.input[t3];
    if ("<" === i3 || "," === i3)
      return void n3.ignoreMatch();
    let s3;
    ">" === i3 && (((e5, { after: n4 }) => {
      const t4 = "</" + e5[0].slice(1);
      return -1 !== e5.input.indexOf(t4, n4);
    })(e4, { after: t3 }) || n3.ignoreMatch());
    const a3 = e4.input.substring(t3);
    ((s3 = a3.match(/^\s*=/)) || (s3 = a3.match(/^\s+extends\s+/)) && 0 === s3.index) && n3.ignoreMatch();
  } }, r2 = { $pattern: he, keyword: fe, literal: be, built_in: _e, "variable.language": ye }, o2 = "[0-9](_?[0-9])*", c2 = `\\.(${o2})`, l2 = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", g2 = { className: "number", variants: [{ begin: `(\\b(${l2})((${c2})|\\.)?|(${c2}))[eE][+-]?(${o2})\\b` }, { begin: `\\b(${l2})\\b((${c2})\\b|\\.)?|(${c2})\\b` }, { begin: "\\b(0|[1-9](_?[0-9])*)n\\b" }, { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" }, { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" }, { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" }, { begin: "\\b0[0-7]+n?\\b" }], relevance: 0 }, u2 = { className: "subst", begin: "\\$\\{", end: "\\}", keywords: r2, contains: [] }, d2 = { begin: "html`", end: "", starts: { end: "`", returnEnd: false, contains: [e3.BACKSLASH_ESCAPE, u2], subLanguage: "xml" } }, h2 = { begin: "css`", end: "", starts: { end: "`", returnEnd: false, contains: [e3.BACKSLASH_ESCAPE, u2], subLanguage: "css" } }, f2 = { begin: "gql`", end: "", starts: { end: "`", returnEnd: false, contains: [e3.BACKSLASH_ESCAPE, u2], subLanguage: "graphql" } }, b2 = { className: "string", begin: "`", end: "`", contains: [e3.BACKSLASH_ESCAPE, u2] }, p2 = { className: "comment", variants: [e3.COMMENT(/\/\*\*(?!\/)/, "\\*/", { relevance: 0, contains: [{ begin: "(?=@[A-Za-z]+)", relevance: 0, contains: [{ className: "doctag", begin: "@[A-Za-z]+" }, { className: "type", begin: "\\{", end: "\\}", excludeEnd: true, excludeBegin: true, relevance: 0 }, { className: "variable", begin: t2 + "(?=\\s*(-)|$)", endsParent: true, relevance: 0 }, { begin: /(?=[^\n])\s/, relevance: 0 }] }] }), e3.C_BLOCK_COMMENT_MODE, e3.C_LINE_COMMENT_MODE] }, m2 = [e3.APOS_STRING_MODE, e3.QUOTE_STRING_MODE, d2, h2, f2, b2, { match: /\$\d+/ }, g2];
  u2.contains = m2.concat({ begin: /\{/, end: /\}/, keywords: r2, contains: ["self"].concat(m2) });
  const E2 = [].concat(p2, u2.contains), y2 = E2.concat([{ begin: /\(/, end: /\)/, keywords: r2, contains: ["self"].concat(E2) }]), _2 = { className: "params", begin: /\(/, end: /\)/, excludeBegin: true, excludeEnd: true, keywords: r2, contains: y2 }, w2 = { variants: [{ match: [/class/, /\s+/, t2, /\s+/, /extends/, /\s+/, n2.concat(t2, "(", n2.concat(/\./, t2), ")*")], scope: { 1: "keyword", 3: "title.class", 5: "keyword", 7: "title.class.inherited" } }, { match: [/class/, /\s+/, t2], scope: { 1: "keyword", 3: "title.class" } }] }, x2 = { relevance: 0, match: n2.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/), className: "title.class", keywords: { _: [...pe, ...me] } }, A2 = { variants: [{ match: [/function/, /\s+/, t2, /(?=\s*\()/] }, { match: [/function/, /\s*(?=\()/] }], className: { 1: "keyword", 3: "title.function" }, label: "func.def", contains: [_2], illegal: /%/ }, N2 = { match: n2.concat(/\b/, (v2 = [...Ee, "super", "import"], n2.concat("(?!", v2.join("|"), ")")), t2, n2.lookahead(/\(/)), className: "title.function", relevance: 0 };
  var v2;
  const S2 = { begin: n2.concat(/\./, n2.lookahead(n2.concat(t2, /(?![0-9A-Za-z$_(])/))), end: t2, excludeBegin: true, keywords: "prototype", className: "property", relevance: 0 }, O2 = { match: [/get|set/, /\s+/, t2, /(?=\()/], className: { 1: "keyword", 3: "title.function" }, contains: [{ begin: /\(\)/ }, _2] }, k2 = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e3.UNDERSCORE_IDENT_RE + ")\\s*=>", R2 = { match: [/const|var|let/, /\s+/, t2, /\s*/, /=\s*/, /(async\s*)?/, n2.lookahead(k2)], keywords: "async", className: { 1: "keyword", 3: "title.function" }, contains: [_2] };
  return { name: "JavaScript", aliases: ["js", "jsx", "mjs", "cjs"], keywords: r2, exports: { PARAMS_CONTAINS: y2, CLASS_REFERENCE: x2 }, illegal: /#(?![$_A-z])/, contains: [e3.SHEBANG({ label: "shebang", binary: "node", relevance: 5 }), { label: "use_strict", className: "meta", relevance: 10, begin: /^\s*['"]use (strict|asm)['"]/ }, e3.APOS_STRING_MODE, e3.QUOTE_STRING_MODE, d2, h2, f2, b2, p2, { match: /\$\d+/ }, g2, x2, { className: "attr", begin: t2 + n2.lookahead(":"), relevance: 0 }, R2, { begin: "(" + e3.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*", keywords: "return throw case", relevance: 0, contains: [p2, e3.REGEXP_MODE, { className: "function", begin: k2, returnBegin: true, end: "\\s*=>", contains: [{ className: "params", variants: [{ begin: e3.UNDERSCORE_IDENT_RE, relevance: 0 }, { className: null, begin: /\(\s*\)/, skip: true }, { begin: /\(/, end: /\)/, excludeBegin: true, excludeEnd: true, keywords: r2, contains: y2 }] }] }, { begin: /,/, relevance: 0 }, { match: /\s+/, relevance: 0 }, { variants: [{ begin: i2, end: s2 }, { match: /<[A-Za-z0-9\\._:-]+\s*\/>/ }, { begin: a2.begin, "on:begin": a2.isTrulyOpeningTag, end: a2.end }], subLanguage: "xml", contains: [{ begin: a2.begin, end: a2.end, skip: true, contains: ["self"] }] }] }, A2, { beginKeywords: "while if switch catch for" }, { begin: "\\b(?!function)" + e3.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{", returnBegin: true, label: "func.def", contains: [_2, e3.inherit(e3.TITLE_MODE, { begin: t2, className: "title.function" })] }, { match: /\.\.\./, relevance: 0 }, S2, { match: "\\$" + t2, relevance: 0 }, { match: [/\bconstructor(?=\s*\()/], className: { 1: "title.function" }, contains: [_2] }, N2, { relevance: 0, match: /\b[A-Z][A-Z_0-9]+\b/, className: "variable.constant" }, w2, O2, { match: /\$[(.]/ }] };
}(e2)), void 0 === window.process && we(document);
export {
  we as execHighlight
};
