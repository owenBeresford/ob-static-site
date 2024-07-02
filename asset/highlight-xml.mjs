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
const o = (e2) => !!e2.scope;
class r {
  constructor(e2, n2) {
    this.buffer = "", this.classPrefix = n2.classPrefix, e2.walk(this);
  }
  addText(e2) {
    this.buffer += i(e2);
  }
  openNode(e2) {
    if (!o(e2))
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
function p(...e2) {
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
const x = "[a-zA-Z]\\w*", w = "[a-zA-Z_]\\w*", _ = "\\b\\d+(\\.\\d+)?", y = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", N = "\\b(0b[01]+)", v = { begin: "\\\\[\\s\\S]", relevance: 0 }, O = { scope: "string", begin: "'", end: "'", illegal: "\\n", contains: [v] }, S = { scope: "string", begin: '"', end: '"', illegal: "\\n", contains: [v] }, k = function(e2, n2, t2 = {}) {
  const i2 = s({ scope: "comment", begin: e2, end: n2, contains: [] }, t2);
  i2.contains.push({ scope: "doctag", begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)", end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/, excludeBegin: true, relevance: 0 });
  const o2 = p("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
  return i2.contains.push({ begin: f(/[ ]+/, "(", o2, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), i2;
}, M = k("//", "$"), R = k("/\\*", "\\*/"), A = k("#", "$"), j = { scope: "number", begin: _, relevance: 0 }, T = { scope: "number", begin: y, relevance: 0 }, I = { scope: "number", begin: N, relevance: 0 }, L = { scope: "regexp", begin: /\/(?=[^/\n]*\/)/, end: /\/[gimuy]*/, contains: [v, { begin: /\[/, end: /\]/, relevance: 0, contains: [v] }] }, B = { scope: "title", begin: x, relevance: 0 }, P = { scope: "title", begin: w, relevance: 0 }, D = { begin: "\\.\\s*" + w, relevance: 0 };
var H = Object.freeze({ __proto__: null, APOS_STRING_MODE: O, BACKSLASH_ESCAPE: v, BINARY_NUMBER_MODE: I, BINARY_NUMBER_RE: N, COMMENT: k, C_BLOCK_COMMENT_MODE: R, C_LINE_COMMENT_MODE: M, C_NUMBER_MODE: T, C_NUMBER_RE: y, END_SAME_AS_BEGIN: function(e2) {
  return Object.assign(e2, { "on:begin": (e3, n2) => {
    n2.data._beginMatch = e3[1];
  }, "on:end": (e3, n2) => {
    n2.data._beginMatch !== e3[1] && n2.ignoreMatch();
  } });
}, HASH_COMMENT_MODE: A, IDENT_RE: x, MATCH_NOTHING_RE: /\b\B/, METHOD_GUARD: D, NUMBER_MODE: j, NUMBER_RE: _, PHRASAL_WORDS_MODE: { begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/ }, QUOTE_STRING_MODE: S, REGEXP_MODE: L, RE_STARTERS_RE: "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", SHEBANG: (e2 = {}) => {
  const n2 = /^#![ ]*\//;
  return e2.binary && (e2.begin = f(n2, /.*\b/, e2.binary, /\b.*/)), s({ scope: "meta", begin: n2, end: /$/, relevance: 0, "on:begin": (e3, n3) => {
    0 !== e3.index && n3.ignoreMatch();
  } }, e2);
}, TITLE_MODE: B, UNDERSCORE_IDENT_RE: w, UNDERSCORE_TITLE_MODE: P });
function C(e2, n2) {
  "." === e2.input[e2.index - 1] && n2.ignoreMatch();
}
function $(e2, n2) {
  void 0 !== e2.className && (e2.scope = e2.className, delete e2.className);
}
function z(e2, n2) {
  n2 && e2.beginKeywords && (e2.begin = "\\b(" + e2.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", e2.__beforeBegin = C, e2.keywords = e2.keywords || e2.beginKeywords, delete e2.beginKeywords, void 0 === e2.relevance && (e2.relevance = 0));
}
function U(e2, n2) {
  Array.isArray(e2.illegal) && (e2.illegal = p(...e2.illegal));
}
function W(e2, n2) {
  if (e2.match) {
    if (e2.begin || e2.end)
      throw new Error("begin & end are not supported with match");
    e2.begin = e2.match, delete e2.match;
  }
}
function G(e2, n2) {
  void 0 === e2.relevance && (e2.relevance = 1);
}
const X = (e2, n2) => {
  if (!e2.beforeMatch)
    return;
  if (e2.starts)
    throw new Error("beforeMatch cannot be used with starts");
  const t2 = Object.assign({}, e2);
  Object.keys(e2).forEach((n3) => {
    delete e2[n3];
  }), e2.keywords = t2.keywords, e2.begin = f(t2.beforeMatch, u(t2.begin)), e2.starts = { relevance: 0, contains: [Object.assign(t2, { endsParent: true })] }, e2.relevance = 0, delete t2.beforeMatch;
}, K = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"], F = "keyword";
function Z(e2, n2, t2 = F) {
  const i2 = /* @__PURE__ */ Object.create(null);
  return "string" == typeof e2 ? s2(t2, e2.split(" ")) : Array.isArray(e2) ? s2(t2, e2) : Object.keys(e2).forEach(function(t3) {
    Object.assign(i2, Z(e2[t3], n2, t3));
  }), i2;
  function s2(e3, t3) {
    n2 && (t3 = t3.map((e4) => e4.toLowerCase())), t3.forEach(function(n3) {
      const t4 = n3.split("|");
      i2[t4[0]] = [e3, V(t4[0], t4[1])];
    });
  }
}
function V(e2, n2) {
  return n2 ? Number(n2) : function(e3) {
    return K.includes(e3.toLowerCase());
  }(e2) ? 0 : 1;
}
const q = {}, J = (e2) => {
  console.error(e2);
}, Q = (e2, ...n2) => {
  console.log(`WARN: ${e2}`, ...n2);
}, Y = (e2, n2) => {
  q[`${e2}/${n2}`] || (console.log(`Deprecated as of ${e2}. ${n2}`), q[`${e2}/${n2}`] = true);
}, ee = new Error();
function ne(e2, n2, { key: t2 }) {
  let i2 = 0;
  const s2 = e2[t2], o2 = {}, r2 = {};
  for (let e3 = 1; e3 <= n2.length; e3++)
    r2[e3 + i2] = s2[e3], o2[e3 + i2] = true, i2 += b(n2[e3 - 1]);
  e2[t2] = r2, e2[t2]._emit = o2, e2[t2]._multi = true;
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
      ne(e3, e3.begin, { key: "beginScope" }), e3.begin = E(e3.begin, { joinWith: "" });
    }
  }(e2), function(e3) {
    if (Array.isArray(e3.end)) {
      if (e3.skip || e3.excludeEnd || e3.returnEnd)
        throw J("skip, excludeEnd, returnEnd not compatible with endScope: {}"), ee;
      if ("object" != typeof e3.endScope || null === e3.endScope)
        throw J("endScope must be object"), ee;
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
      n3.position = this.position++, this.matchIndexes[this.matchAt] = n3, this.regexes.push([n3, e3]), this.matchAt += b(e3) + 1;
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
  return e2.classNameAliases = s(e2.classNameAliases || {}), function t3(o2, r2) {
    const a2 = o2;
    if (o2.isCompiled)
      return a2;
    [$, W, te, X].forEach((e3) => e3(o2, r2)), e2.compilerExtensions.forEach((e3) => e3(o2, r2)), o2.__beforeBegin = null, [z, U, G].forEach((e3) => e3(o2, r2)), o2.isCompiled = true;
    let c2 = null;
    return "object" == typeof o2.keywords && o2.keywords.$pattern && (o2.keywords = Object.assign({}, o2.keywords), c2 = o2.keywords.$pattern, delete o2.keywords.$pattern), c2 = c2 || /\w+/, o2.keywords && (o2.keywords = Z(o2.keywords, e2.case_insensitive)), a2.keywordPatternRe = n2(c2, true), r2 && (o2.begin || (o2.begin = /\B|\b/), a2.beginRe = n2(a2.begin), o2.end || o2.endsWithParent || (o2.end = /\B|\b/), o2.end && (a2.endRe = n2(a2.end)), a2.terminatorEnd = g(a2.end) || "", o2.endsWithParent && r2.terminatorEnd && (a2.terminatorEnd += (o2.end ? "|" : "") + r2.terminatorEnd)), o2.illegal && (a2.illegalRe = n2(o2.illegal)), o2.contains || (o2.contains = []), o2.contains = [].concat(...o2.contains.map(function(e3) {
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
      }("self" === e3 ? o2 : e3);
    })), o2.contains.forEach(function(e3) {
      t3(e3, a2);
    }), o2.starts && t3(o2.starts, r2), a2.matcher = function(e3) {
      const n3 = new i2();
      return e3.contains.forEach((e4) => n3.addRule(e4.begin, { rule: e4, type: "begin" })), e3.terminatorEnd && n3.addRule(e3.terminatorEnd, { type: "end" }), e3.illegal && n3.addRule(e3.illegal, { type: "illegal" }), n3;
    }(a2), a2;
  }(e2);
}
function se(e2) {
  return !!e2 && (e2.endsWithParent || se(e2.starts));
}
class oe extends Error {
  constructor(e2, n2) {
    super(e2), this.name = "HTMLInjectionError", this.html = n2;
  }
}
const re = i, ae = s, ce = Symbol("nomatch"), le = function(e2) {
  const i2 = /* @__PURE__ */ Object.create(null), s2 = /* @__PURE__ */ Object.create(null), o2 = [];
  let r2 = true;
  const a2 = "Could not find the language '{}', did you forget to load/include a language module?", c2 = { disableAutodetect: true, name: "Plain text", contains: [] };
  let g2 = { ignoreUnescapedHTML: false, throwUnescapedHTML: false, noHighlightRe: /^(no-?highlight)$/i, languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i, classPrefix: "hljs-", cssSelector: "pre code", languages: null, __emitter: l };
  function b2(e3) {
    return g2.noHighlightRe.test(e3);
  }
  function m2(e3, n2, t2) {
    let i3 = "", s3 = "";
    "object" == typeof n2 ? (i3 = e3, t2 = n2.ignoreIllegals, s3 = n2.language) : (Y("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Y("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"), s3 = e3, i3 = n2), void 0 === t2 && (t2 = true);
    const o3 = { code: i3, language: s3 };
    S2("before:highlight", o3);
    const r3 = o3.result ? o3.result : E2(o3.language, o3.code, t2);
    return r3.code = o3.code, S2("after:highlight", r3), r3;
  }
  function E2(e3, n2, s3, o3) {
    const c3 = /* @__PURE__ */ Object.create(null);
    function l2() {
      if (!S3.keywords)
        return void M2.addText(R2);
      let e4 = 0;
      S3.keywordPatternRe.lastIndex = 0;
      let n3 = S3.keywordPatternRe.exec(R2), t2 = "";
      for (; n3; ) {
        t2 += R2.substring(e4, n3.index);
        const s4 = y3.case_insensitive ? n3[0].toLowerCase() : n3[0], o4 = (i3 = s4, S3.keywords[i3]);
        if (o4) {
          const [e5, i4] = o4;
          if (M2.addText(t2), t2 = "", c3[s4] = (c3[s4] || 0) + 1, c3[s4] <= 7 && (A2 += i4), e5.startsWith("_"))
            t2 += n3[0];
          else {
            const t3 = y3.classNameAliases[e5] || e5;
            d2(n3[0], t3);
          }
        } else
          t2 += n3[0];
        e4 = S3.keywordPatternRe.lastIndex, n3 = S3.keywordPatternRe.exec(R2);
      }
      var i3;
      t2 += R2.substring(e4), M2.addText(t2);
    }
    function u2() {
      null != S3.subLanguage ? function() {
        if ("" === R2)
          return;
        let e4 = null;
        if ("string" == typeof S3.subLanguage) {
          if (!i2[S3.subLanguage])
            return void M2.addText(R2);
          e4 = E2(S3.subLanguage, R2, true, k2[S3.subLanguage]), k2[S3.subLanguage] = e4._top;
        } else
          e4 = x2(R2, S3.subLanguage.length ? S3.subLanguage : null);
        S3.relevance > 0 && (A2 += e4.relevance), M2.__addSublanguage(e4._emitter, e4.language);
      }() : l2(), R2 = "";
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
        const i4 = y3.classNameAliases[e4[t2]] || e4[t2], s4 = n3[t2];
        i4 ? d2(s4, i4) : (R2 = s4, l2(), R2 = ""), t2++;
      }
    }
    function f2(e4, n3) {
      return e4.scope && "string" == typeof e4.scope && M2.openNode(y3.classNameAliases[e4.scope] || e4.scope), e4.beginScope && (e4.beginScope._wrap ? (d2(R2, y3.classNameAliases[e4.beginScope._wrap] || e4.beginScope._wrap), R2 = "") : e4.beginScope._multi && (h2(e4.beginScope, n3), R2 = "")), S3 = Object.create(e4, { parent: { value: S3 } }), S3;
    }
    function p2(e4, n3, i3) {
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
        return p2(e4.parent, n3, i3);
    }
    function b3(e4) {
      return 0 === S3.matcher.regexIndex ? (R2 += e4[0], 1) : (I2 = true, 0);
    }
    function m3(e4) {
      const t2 = e4[0], i3 = n2.substring(e4.index), s4 = p2(S3, e4, i3);
      if (!s4)
        return ce;
      const o4 = S3;
      S3.endScope && S3.endScope._wrap ? (u2(), d2(t2, S3.endScope._wrap)) : S3.endScope && S3.endScope._multi ? (u2(), h2(S3.endScope, e4)) : o4.skip ? R2 += t2 : (o4.returnEnd || o4.excludeEnd || (R2 += t2), u2(), o4.excludeEnd && (R2 = t2));
      do {
        S3.scope && M2.closeNode(), S3.skip || S3.subLanguage || (A2 += S3.relevance), S3 = S3.parent;
      } while (S3 !== s4.parent);
      return s4.starts && f2(s4.starts, e4), o4.returnEnd ? 0 : t2.length;
    }
    let w3 = {};
    function _3(i3, o4) {
      const a3 = o4 && o4[0];
      if (R2 += i3, null == a3)
        return u2(), 0;
      if ("begin" === w3.type && "end" === o4.type && w3.index === o4.index && "" === a3) {
        if (R2 += n2.slice(o4.index, o4.index + 1), !r2) {
          const n3 = new Error(`0 width match regex (${e3})`);
          throw n3.languageName = e3, n3.badRule = w3.rule, n3;
        }
        return 1;
      }
      if (w3 = o4, "begin" === o4.type)
        return function(e4) {
          const n3 = e4[0], i4 = e4.rule, s4 = new t(i4), o5 = [i4.__beforeBegin, i4["on:begin"]];
          for (const t2 of o5)
            if (t2 && (t2(e4, s4), s4.isMatchIgnored))
              return b3(n3);
          return i4.skip ? R2 += n3 : (i4.excludeBegin && (R2 += n3), u2(), i4.returnBegin || i4.excludeBegin || (R2 = n3)), f2(i4, e4), i4.returnBegin ? 0 : n3.length;
        }(o4);
      if ("illegal" === o4.type && !s3) {
        const e4 = new Error('Illegal lexeme "' + a3 + '" for mode "' + (S3.scope || "<unnamed>") + '"');
        throw e4.mode = S3, e4;
      }
      if ("end" === o4.type) {
        const e4 = m3(o4);
        if (e4 !== ce)
          return e4;
      }
      if ("illegal" === o4.type && "" === a3)
        return 1;
      if (T2 > 1e5 && T2 > 3 * o4.index) {
        throw new Error("potential infinite loop, way more iterations than matches");
      }
      return R2 += a3, a3.length;
    }
    const y3 = N2(e3);
    if (!y3)
      throw J(a2.replace("{}", e3)), new Error('Unknown language: "' + e3 + '"');
    const v3 = ie(y3);
    let O3 = "", S3 = o3 || v3;
    const k2 = {}, M2 = new g2.__emitter(g2);
    !function() {
      const e4 = [];
      for (let n3 = S3; n3 !== y3; n3 = n3.parent)
        n3.scope && e4.unshift(n3.scope);
      e4.forEach((e5) => M2.openNode(e5));
    }();
    let R2 = "", A2 = 0, j2 = 0, T2 = 0, I2 = false;
    try {
      if (y3.__emitTokens)
        y3.__emitTokens(n2, M2);
      else {
        for (S3.matcher.considerAll(); ; ) {
          T2++, I2 ? I2 = false : S3.matcher.considerAll(), S3.matcher.lastIndex = j2;
          const e4 = S3.matcher.exec(n2);
          if (!e4)
            break;
          const t2 = _3(n2.substring(j2, e4.index), e4);
          j2 = e4.index + t2;
        }
        _3(n2.substring(j2));
      }
      return M2.finalize(), O3 = M2.toHTML(), { language: e3, value: O3, relevance: A2, illegal: false, _emitter: M2, _top: S3 };
    } catch (t2) {
      if (t2.message && t2.message.includes("Illegal"))
        return { language: e3, value: re(n2), illegal: true, relevance: 0, _illegalBy: { message: t2.message, index: j2, context: n2.slice(j2 - 100, j2 + 100), mode: t2.mode, resultSoFar: O3 }, _emitter: M2 };
      if (r2)
        return { language: e3, value: re(n2), illegal: false, relevance: 0, errorRaised: t2, _emitter: M2, _top: S3 };
      throw t2;
    }
  }
  function x2(e3, n2) {
    n2 = n2 || g2.languages || Object.keys(i2);
    const t2 = function(e4) {
      const n3 = { value: re(e4), illegal: false, relevance: 0, _top: c2, _emitter: new g2.__emitter(g2) };
      return n3._emitter.addText(e4), n3;
    }(e3), s3 = n2.filter(N2).filter(O2).map((n3) => E2(n3, e3, false));
    s3.unshift(t2);
    const o3 = s3.sort((e4, n3) => {
      if (e4.relevance !== n3.relevance)
        return n3.relevance - e4.relevance;
      if (e4.language && n3.language) {
        if (N2(e4.language).supersetOf === n3.language)
          return 1;
        if (N2(n3.language).supersetOf === e4.language)
          return -1;
      }
      return 0;
    }), [r3, a3] = o3, l2 = r3;
    return l2.secondBest = a3, l2;
  }
  function w2(e3) {
    let n2 = null;
    const t2 = function(e4) {
      let n3 = e4.className + " ";
      n3 += e4.parentNode ? e4.parentNode.className : "";
      const t3 = g2.languageDetectRe.exec(n3);
      if (t3) {
        const n4 = N2(t3[1]);
        return n4 || (Q(a2.replace("{}", t3[1])), Q("Falling back to no-highlight mode for this block.", e4)), n4 ? t3[1] : "no-highlight";
      }
      return n3.split(/\s+/).find((e5) => b2(e5) || N2(e5));
    }(e3);
    if (b2(t2))
      return;
    if (S2("before:highlightElement", { el: e3, language: t2 }), e3.dataset.highlighted)
      return void console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", e3);
    if (e3.children.length > 0 && (g2.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(e3)), g2.throwUnescapedHTML)) {
      throw new oe("One of your code blocks includes unescaped HTML.", e3.innerHTML);
    }
    n2 = e3;
    const i3 = n2.textContent, o3 = t2 ? m2(i3, { language: t2, ignoreIllegals: true }) : x2(i3);
    e3.innerHTML = o3.value, e3.dataset.highlighted = "yes", function(e4, n3, t3) {
      const i4 = n3 && s2[n3] || t3;
      e4.classList.add("hljs"), e4.classList.add(`language-${i4}`);
    }(e3, t2, o3.language), e3.result = { language: o3.language, re: o3.relevance, relevance: o3.relevance }, o3.secondBest && (e3.secondBest = { language: o3.secondBest.language, relevance: o3.secondBest.relevance }), S2("after:highlightElement", { el: e3, result: o3, text: i3 });
  }
  let _2 = false;
  function y2() {
    if ("loading" === document.readyState)
      return void (_2 = true);
    document.querySelectorAll(g2.cssSelector).forEach(w2);
  }
  function N2(e3) {
    return e3 = (e3 || "").toLowerCase(), i2[e3] || i2[s2[e3]];
  }
  function v2(e3, { languageName: n2 }) {
    "string" == typeof e3 && (e3 = [e3]), e3.forEach((e4) => {
      s2[e4.toLowerCase()] = n2;
    });
  }
  function O2(e3) {
    const n2 = N2(e3);
    return n2 && !n2.disableAutodetect;
  }
  function S2(e3, n2) {
    const t2 = e3;
    o2.forEach(function(e4) {
      e4[t2] && e4[t2](n2);
    });
  }
  "undefined" != typeof window && window.addEventListener && window.addEventListener("DOMContentLoaded", function() {
    _2 && y2();
  }, false), Object.assign(e2, { highlight: m2, highlightAuto: x2, highlightAll: y2, highlightElement: w2, highlightBlock: function(e3) {
    return Y("10.7.0", "highlightBlock will be removed entirely in v12.0"), Y("10.7.0", "Please use highlightElement now."), w2(e3);
  }, configure: function(e3) {
    g2 = ae(g2, e3);
  }, initHighlighting: () => {
    y2(), Y("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
  }, initHighlightingOnLoad: function() {
    y2(), Y("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
  }, registerLanguage: function(n2, t2) {
    let s3 = null;
    try {
      s3 = t2(e2);
    } catch (e3) {
      if (J("Language definition for '{}' could not be registered.".replace("{}", n2)), !r2)
        throw e3;
      J(e3), s3 = c2;
    }
    s3.name || (s3.name = n2), i2[n2] = s3, s3.rawDefinition = t2.bind(null, e2), s3.aliases && v2(s3.aliases, { languageName: n2 });
  }, unregisterLanguage: function(e3) {
    delete i2[e3];
    for (const n2 of Object.keys(s2))
      s2[n2] === e3 && delete s2[n2];
  }, listLanguages: function() {
    return Object.keys(i2);
  }, getLanguage: N2, registerAliases: v2, autoDetection: O2, inherit: ae, addPlugin: function(e3) {
    !function(e4) {
      e4["before:highlightBlock"] && !e4["before:highlightElement"] && (e4["before:highlightElement"] = (n2) => {
        e4["before:highlightBlock"](Object.assign({ block: n2.el }, n2));
      }), e4["after:highlightBlock"] && !e4["after:highlightElement"] && (e4["after:highlightElement"] = (n2) => {
        e4["after:highlightBlock"](Object.assign({ block: n2.el }, n2));
      });
    }(e3), o2.push(e3);
  }, removePlugin: function(e3) {
    const n2 = o2.indexOf(e3);
    -1 !== n2 && o2.splice(n2, 1);
  } }), e2.debugMode = function() {
    r2 = false;
  }, e2.safeMode = function() {
    r2 = true;
  }, e2.versionString = "11.9.0", e2.regex = { concat: f, lookahead: u, either: p, optional: h, anyNumberOfTimes: d };
  for (const e3 in H)
    "object" == typeof H[e3] && n(H[e3]);
  return Object.assign(e2, H), e2;
}, ge = le({});
ge.newInstance = () => le({});
var ue = ge;
ge.HighlightJS = ge, ge.default = ge;
const de = e(ue);
function he(e2 = document) {
  e2.querySelectorAll('code[lang="xml"]').forEach((e3) => {
    de.highlightElement(e3);
  });
}
de.registerLanguage("xml", (e2) => function(e3) {
  const n2 = e3.regex, t2 = n2.concat(/[\p{L}_]/u, n2.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u), i2 = { className: "symbol", begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/ }, s2 = { begin: /\s/, contains: [{ className: "keyword", begin: /#?[a-z_][a-z1-9_-]+/, illegal: /\n/ }] }, o2 = e3.inherit(s2, { begin: /\(/, end: /\)/ }), r2 = e3.inherit(e3.APOS_STRING_MODE, { className: "string" }), a2 = e3.inherit(e3.QUOTE_STRING_MODE, { className: "string" }), c2 = { endsWithParent: true, illegal: /</, relevance: 0, contains: [{ className: "attr", begin: /[\p{L}0-9._:-]+/u, relevance: 0 }, { begin: /=\s*/, relevance: 0, contains: [{ className: "string", endsParent: true, variants: [{ begin: /"/, end: /"/, contains: [i2] }, { begin: /'/, end: /'/, contains: [i2] }, { begin: /[^\s"'=<>`]+/ }] }] }] };
  return { name: "HTML, XML", aliases: ["html", "xhtml", "rss", "atom", "xjb", "xsd", "xsl", "plist", "wsf", "svg"], case_insensitive: true, unicodeRegex: true, contains: [{ className: "meta", begin: /<![a-z]/, end: />/, relevance: 10, contains: [s2, a2, r2, o2, { begin: /\[/, end: /\]/, contains: [{ className: "meta", begin: /<![a-z]/, end: />/, contains: [s2, o2, a2, r2] }] }] }, e3.COMMENT(/<!--/, /-->/, { relevance: 10 }), { begin: /<!\[CDATA\[/, end: /\]\]>/, relevance: 10 }, i2, { className: "meta", end: /\?>/, variants: [{ begin: /<\?xml/, relevance: 10, contains: [a2] }, { begin: /<\?[a-z][a-z0-9]+/ }] }, { className: "tag", begin: /<style(?=\s|>)/, end: />/, keywords: { name: "style" }, contains: [c2], starts: { end: /<\/style>/, returnEnd: true, subLanguage: ["css", "xml"] } }, { className: "tag", begin: /<script(?=\s|>)/, end: />/, keywords: { name: "script" }, contains: [c2], starts: { end: /<\/script>/, returnEnd: true, subLanguage: ["javascript", "handlebars", "xml"] } }, { className: "tag", begin: /<>|<\/>/ }, { className: "tag", begin: n2.concat(/</, n2.lookahead(n2.concat(t2, n2.either(/\/>/, />/, /\s/)))), end: /\/?>/, contains: [{ className: "name", begin: t2, relevance: 0, starts: c2 }] }, { className: "tag", begin: n2.concat(/<\//, n2.lookahead(n2.concat(t2, />/))), contains: [{ className: "name", begin: t2, relevance: 0 }, { begin: />/, relevance: 0, endsParent: true }] }] };
}(e2)), void 0 === window.process && he(document);
export {
  he as execHighlight
};
