function e(e2) {
  return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
}
function t(e2) {
  return e2 instanceof Map ? e2.clear = e2.delete = e2.set = function() {
    throw new Error("map is read-only");
  } : e2 instanceof Set && (e2.add = e2.clear = e2.delete = function() {
    throw new Error("set is read-only");
  }), Object.freeze(e2), Object.getOwnPropertyNames(e2).forEach((n2) => {
    const i2 = e2[n2], o2 = typeof i2;
    "object" !== o2 && "function" !== o2 || Object.isFrozen(i2) || t(i2);
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
function o(e2, ...t2) {
  const n2 = /* @__PURE__ */ Object.create(null);
  for (const t3 in e2)
    n2[t3] = e2[t3];
  return t2.forEach(function(e3) {
    for (const t3 in e3)
      n2[t3] = e3[t3];
  }), n2;
}
const r = (e2) => !!e2.scope;
class a {
  constructor(e2, t2) {
    this.buffer = "", this.classPrefix = t2.classPrefix, e2.walk(this);
  }
  addText(e2) {
    this.buffer += i(e2);
  }
  openNode(e2) {
    if (!r(e2))
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
    r(e2) && (this.buffer += "</span>");
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
class l {
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
      l._collapse(e3);
    }));
  }
}
class c extends l {
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
function d(e2) {
  return e2 ? "string" == typeof e2 ? e2 : e2.source : null;
}
function g(e2) {
  return f("(?=", e2, ")");
}
function u(e2) {
  return f("(?:", e2, ")*");
}
function h(e2) {
  return f("(?:", e2, ")?");
}
function f(...e2) {
  return e2.map((e3) => d(e3)).join("");
}
function p(...e2) {
  const t2 = function(e3) {
    const t3 = e3[e3.length - 1];
    return "object" == typeof t3 && t3.constructor === Object ? (e3.splice(e3.length - 1, 1), t3) : {};
  }(e2);
  return "(" + (t2.capture ? "" : "?:") + e2.map((e3) => d(e3)).join("|") + ")";
}
function b(e2) {
  return new RegExp(e2.toString() + "|").exec("").length - 1;
}
const m = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
function w(e2, { joinWith: t2 }) {
  let n2 = 0;
  return e2.map((e3) => {
    n2 += 1;
    const t3 = n2;
    let i2 = d(e3), o2 = "";
    for (; i2.length > 0; ) {
      const e4 = m.exec(i2);
      if (!e4) {
        o2 += i2;
        break;
      }
      o2 += i2.substring(0, e4.index), i2 = i2.substring(e4.index + e4[0].length), "\\" === e4[0][0] && e4[1] ? o2 += "\\" + String(Number(e4[1]) + t3) : (o2 += e4[0], "(" === e4[0] && n2++);
    }
    return o2;
  }).map((e3) => `(${e3})`).join(t2);
}
const y = "[a-zA-Z]\\w*", x = "[a-zA-Z_]\\w*", k = "\\b\\d+(\\.\\d+)?", E = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", v = "\\b(0b[01]+)", _ = { begin: "\\\\[\\s\\S]", relevance: 0 }, O = { scope: "string", begin: "'", end: "'", illegal: "\\n", contains: [_] }, N = { scope: "string", begin: '"', end: '"', illegal: "\\n", contains: [_] }, S = function(e2, t2, n2 = {}) {
  const i2 = o({ scope: "comment", begin: e2, end: t2, contains: [] }, n2);
  i2.contains.push({ scope: "doctag", begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)", end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/, excludeBegin: true, relevance: 0 });
  const r2 = p("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
  return i2.contains.push({ begin: f(/[ ]+/, "(", r2, /[.]?[:]?([.][ ]|[ ])/, "){3}") }), i2;
}, M = S("//", "$"), R = S("/\\*", "\\*/"), T = S("#", "$"), A = { scope: "number", begin: k, relevance: 0 }, j = { scope: "number", begin: E, relevance: 0 }, I = { scope: "number", begin: v, relevance: 0 }, L = { scope: "regexp", begin: /\/(?=[^/\n]*\/)/, end: /\/[gimuy]*/, contains: [_, { begin: /\[/, end: /\]/, relevance: 0, contains: [_] }] }, B = { scope: "title", begin: y, relevance: 0 }, C = { scope: "title", begin: x, relevance: 0 }, D = { begin: "\\.\\s*" + x, relevance: 0 };
var P = Object.freeze({ __proto__: null, APOS_STRING_MODE: O, BACKSLASH_ESCAPE: _, BINARY_NUMBER_MODE: I, BINARY_NUMBER_RE: v, COMMENT: S, C_BLOCK_COMMENT_MODE: R, C_LINE_COMMENT_MODE: M, C_NUMBER_MODE: j, C_NUMBER_RE: E, END_SAME_AS_BEGIN: function(e2) {
  return Object.assign(e2, { "on:begin": (e3, t2) => {
    t2.data._beginMatch = e3[1];
  }, "on:end": (e3, t2) => {
    t2.data._beginMatch !== e3[1] && t2.ignoreMatch();
  } });
}, HASH_COMMENT_MODE: T, IDENT_RE: y, MATCH_NOTHING_RE: /\b\B/, METHOD_GUARD: D, NUMBER_MODE: A, NUMBER_RE: k, PHRASAL_WORDS_MODE: { begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/ }, QUOTE_STRING_MODE: N, REGEXP_MODE: L, RE_STARTERS_RE: "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", SHEBANG: (e2 = {}) => {
  const t2 = /^#![ ]*\//;
  return e2.binary && (e2.begin = f(t2, /.*\b/, e2.binary, /\b.*/)), o({ scope: "meta", begin: t2, end: /$/, relevance: 0, "on:begin": (e3, t3) => {
    0 !== e3.index && t3.ignoreMatch();
  } }, e2);
}, TITLE_MODE: B, UNDERSCORE_IDENT_RE: x, UNDERSCORE_TITLE_MODE: C });
function z(e2, t2) {
  "." === e2.input[e2.index - 1] && t2.ignoreMatch();
}
function H(e2, t2) {
  void 0 !== e2.className && (e2.scope = e2.className, delete e2.className);
}
function U(e2, t2) {
  t2 && e2.beginKeywords && (e2.begin = "\\b(" + e2.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", e2.__beforeBegin = z, e2.keywords = e2.keywords || e2.beginKeywords, delete e2.beginKeywords, void 0 === e2.relevance && (e2.relevance = 0));
}
function $(e2, t2) {
  Array.isArray(e2.illegal) && (e2.illegal = p(...e2.illegal));
}
function W(e2, t2) {
  if (e2.match) {
    if (e2.begin || e2.end)
      throw new Error("begin & end are not supported with match");
    e2.begin = e2.match, delete e2.match;
  }
}
function G(e2, t2) {
  void 0 === e2.relevance && (e2.relevance = 1);
}
const K = (e2, t2) => {
  if (!e2.beforeMatch)
    return;
  if (e2.starts)
    throw new Error("beforeMatch cannot be used with starts");
  const n2 = Object.assign({}, e2);
  Object.keys(e2).forEach((t3) => {
    delete e2[t3];
  }), e2.keywords = n2.keywords, e2.begin = f(n2.beforeMatch, g(n2.begin)), e2.starts = { relevance: 0, contains: [Object.assign(n2, { endsParent: true })] }, e2.relevance = 0, delete n2.beforeMatch;
}, X = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"], Z = "keyword";
function F(e2, t2, n2 = Z) {
  const i2 = /* @__PURE__ */ Object.create(null);
  return "string" == typeof e2 ? o2(n2, e2.split(" ")) : Array.isArray(e2) ? o2(n2, e2) : Object.keys(e2).forEach(function(n3) {
    Object.assign(i2, F(e2[n3], t2, n3));
  }), i2;
  function o2(e3, n3) {
    t2 && (n3 = n3.map((e4) => e4.toLowerCase())), n3.forEach(function(t3) {
      const n4 = t3.split("|");
      i2[n4[0]] = [e3, q(n4[0], n4[1])];
    });
  }
}
function q(e2, t2) {
  return t2 ? Number(t2) : function(e3) {
    return X.includes(e3.toLowerCase());
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
  let i2 = 0;
  const o2 = e2[n2], r2 = {}, a2 = {};
  for (let e3 = 1; e3 <= t2.length; e3++)
    a2[e3 + i2] = o2[e3], r2[e3 + i2] = true, i2 += b(t2[e3 - 1]);
  e2[n2] = a2, e2[n2]._emit = r2, e2[n2]._multi = true;
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
      te(e3, e3.begin, { key: "beginScope" }), e3.begin = w(e3.begin, { joinWith: "" });
    }
  }(e2), function(e3) {
    if (Array.isArray(e3.end)) {
      if (e3.skip || e3.excludeEnd || e3.returnEnd)
        throw J("skip, excludeEnd, returnEnd not compatible with endScope: {}"), ee;
      if ("object" != typeof e3.endScope || null === e3.endScope)
        throw J("endScope must be object"), ee;
      te(e3, e3.end, { key: "endScope" }), e3.end = w(e3.end, { joinWith: "" });
    }
  }(e2);
}
function ie(e2) {
  function t2(t3, n3) {
    return new RegExp(d(t3), "m" + (e2.case_insensitive ? "i" : "") + (e2.unicodeRegex ? "u" : "") + (n3 ? "g" : ""));
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
      this.matcherRe = t2(w(e3, { joinWith: "|" }), true), this.lastIndex = 0;
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
  return e2.classNameAliases = o(e2.classNameAliases || {}), function n3(r2, a2) {
    const s2 = r2;
    if (r2.isCompiled)
      return s2;
    [H, W, ne, K].forEach((e3) => e3(r2, a2)), e2.compilerExtensions.forEach((e3) => e3(r2, a2)), r2.__beforeBegin = null, [U, $, G].forEach((e3) => e3(r2, a2)), r2.isCompiled = true;
    let l2 = null;
    return "object" == typeof r2.keywords && r2.keywords.$pattern && (r2.keywords = Object.assign({}, r2.keywords), l2 = r2.keywords.$pattern, delete r2.keywords.$pattern), l2 = l2 || /\w+/, r2.keywords && (r2.keywords = F(r2.keywords, e2.case_insensitive)), s2.keywordPatternRe = t2(l2, true), a2 && (r2.begin || (r2.begin = /\B|\b/), s2.beginRe = t2(s2.begin), r2.end || r2.endsWithParent || (r2.end = /\B|\b/), r2.end && (s2.endRe = t2(s2.end)), s2.terminatorEnd = d(s2.end) || "", r2.endsWithParent && a2.terminatorEnd && (s2.terminatorEnd += (r2.end ? "|" : "") + a2.terminatorEnd)), r2.illegal && (s2.illegalRe = t2(r2.illegal)), r2.contains || (r2.contains = []), r2.contains = [].concat(...r2.contains.map(function(e3) {
      return function(e4) {
        e4.variants && !e4.cachedVariants && (e4.cachedVariants = e4.variants.map(function(t3) {
          return o(e4, { variants: null }, t3);
        }));
        if (e4.cachedVariants)
          return e4.cachedVariants;
        if (oe(e4))
          return o(e4, { starts: e4.starts ? o(e4.starts) : null });
        if (Object.isFrozen(e4))
          return o(e4);
        return e4;
      }("self" === e3 ? r2 : e3);
    })), r2.contains.forEach(function(e3) {
      n3(e3, s2);
    }), r2.starts && n3(r2.starts, a2), s2.matcher = function(e3) {
      const t3 = new i2();
      return e3.contains.forEach((e4) => t3.addRule(e4.begin, { rule: e4, type: "begin" })), e3.terminatorEnd && t3.addRule(e3.terminatorEnd, { type: "end" }), e3.illegal && t3.addRule(e3.illegal, { type: "illegal" }), t3;
    }(s2), s2;
  }(e2);
}
function oe(e2) {
  return !!e2 && (e2.endsWithParent || oe(e2.starts));
}
class re extends Error {
  constructor(e2, t2) {
    super(e2), this.name = "HTMLInjectionError", this.html = t2;
  }
}
const ae = i, se = o, le = Symbol("nomatch"), ce = function(e2) {
  const i2 = /* @__PURE__ */ Object.create(null), o2 = /* @__PURE__ */ Object.create(null), r2 = [];
  let a2 = true;
  const s2 = "Could not find the language '{}', did you forget to load/include a language module?", l2 = { disableAutodetect: true, name: "Plain text", contains: [] };
  let d2 = { ignoreUnescapedHTML: false, throwUnescapedHTML: false, noHighlightRe: /^(no-?highlight)$/i, languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i, classPrefix: "hljs-", cssSelector: "pre code", languages: null, __emitter: c };
  function b2(e3) {
    return d2.noHighlightRe.test(e3);
  }
  function m2(e3, t2, n2) {
    let i3 = "", o3 = "";
    "object" == typeof t2 ? (i3 = e3, n2 = t2.ignoreIllegals, o3 = t2.language) : (Y("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Y("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"), o3 = e3, i3 = t2), void 0 === n2 && (n2 = true);
    const r3 = { code: i3, language: o3 };
    N2("before:highlight", r3);
    const a3 = r3.result ? r3.result : w2(r3.language, r3.code, n2);
    return a3.code = r3.code, N2("after:highlight", a3), a3;
  }
  function w2(e3, t2, o3, r3) {
    const l3 = /* @__PURE__ */ Object.create(null);
    function c2() {
      if (!N3.keywords)
        return void M2.addText(R2);
      let e4 = 0;
      N3.keywordPatternRe.lastIndex = 0;
      let t3 = N3.keywordPatternRe.exec(R2), n2 = "";
      for (; t3; ) {
        n2 += R2.substring(e4, t3.index);
        const o4 = E3.case_insensitive ? t3[0].toLowerCase() : t3[0], r4 = (i3 = o4, N3.keywords[i3]);
        if (r4) {
          const [e5, i4] = r4;
          if (M2.addText(n2), n2 = "", l3[o4] = (l3[o4] || 0) + 1, l3[o4] <= 7 && (T2 += i4), e5.startsWith("_"))
            n2 += t3[0];
          else {
            const n3 = E3.classNameAliases[e5] || e5;
            u2(t3[0], n3);
          }
        } else
          n2 += t3[0];
        e4 = N3.keywordPatternRe.lastIndex, t3 = N3.keywordPatternRe.exec(R2);
      }
      var i3;
      n2 += R2.substring(e4), M2.addText(n2);
    }
    function g2() {
      null != N3.subLanguage ? function() {
        if ("" === R2)
          return;
        let e4 = null;
        if ("string" == typeof N3.subLanguage) {
          if (!i2[N3.subLanguage])
            return void M2.addText(R2);
          e4 = w2(N3.subLanguage, R2, true, S2[N3.subLanguage]), S2[N3.subLanguage] = e4._top;
        } else
          e4 = y2(R2, N3.subLanguage.length ? N3.subLanguage : null);
        N3.relevance > 0 && (T2 += e4.relevance), M2.__addSublanguage(e4._emitter, e4.language);
      }() : c2(), R2 = "";
    }
    function u2(e4, t3) {
      "" !== e4 && (M2.startScope(t3), M2.addText(e4), M2.endScope());
    }
    function h2(e4, t3) {
      let n2 = 1;
      const i3 = t3.length - 1;
      for (; n2 <= i3; ) {
        if (!e4._emit[n2]) {
          n2++;
          continue;
        }
        const i4 = E3.classNameAliases[e4[n2]] || e4[n2], o4 = t3[n2];
        i4 ? u2(o4, i4) : (R2 = o4, c2(), R2 = ""), n2++;
      }
    }
    function f2(e4, t3) {
      return e4.scope && "string" == typeof e4.scope && M2.openNode(E3.classNameAliases[e4.scope] || e4.scope), e4.beginScope && (e4.beginScope._wrap ? (u2(R2, E3.classNameAliases[e4.beginScope._wrap] || e4.beginScope._wrap), R2 = "") : e4.beginScope._multi && (h2(e4.beginScope, t3), R2 = "")), N3 = Object.create(e4, { parent: { value: N3 } }), N3;
    }
    function p2(e4, t3, i3) {
      let o4 = function(e5, t4) {
        const n2 = e5 && e5.exec(t4);
        return n2 && 0 === n2.index;
      }(e4.endRe, i3);
      if (o4) {
        if (e4["on:end"]) {
          const i4 = new n(e4);
          e4["on:end"](t3, i4), i4.isMatchIgnored && (o4 = false);
        }
        if (o4) {
          for (; e4.endsParent && e4.parent; )
            e4 = e4.parent;
          return e4;
        }
      }
      if (e4.endsWithParent)
        return p2(e4.parent, t3, i3);
    }
    function b3(e4) {
      return 0 === N3.matcher.regexIndex ? (R2 += e4[0], 1) : (I2 = true, 0);
    }
    function m3(e4) {
      const n2 = e4[0], i3 = t2.substring(e4.index), o4 = p2(N3, e4, i3);
      if (!o4)
        return le;
      const r4 = N3;
      N3.endScope && N3.endScope._wrap ? (g2(), u2(n2, N3.endScope._wrap)) : N3.endScope && N3.endScope._multi ? (g2(), h2(N3.endScope, e4)) : r4.skip ? R2 += n2 : (r4.returnEnd || r4.excludeEnd || (R2 += n2), g2(), r4.excludeEnd && (R2 = n2));
      do {
        N3.scope && M2.closeNode(), N3.skip || N3.subLanguage || (T2 += N3.relevance), N3 = N3.parent;
      } while (N3 !== o4.parent);
      return o4.starts && f2(o4.starts, e4), r4.returnEnd ? 0 : n2.length;
    }
    let x3 = {};
    function k3(i3, r4) {
      const s3 = r4 && r4[0];
      if (R2 += i3, null == s3)
        return g2(), 0;
      if ("begin" === x3.type && "end" === r4.type && x3.index === r4.index && "" === s3) {
        if (R2 += t2.slice(r4.index, r4.index + 1), !a2) {
          const t3 = new Error(`0 width match regex (${e3})`);
          throw t3.languageName = e3, t3.badRule = x3.rule, t3;
        }
        return 1;
      }
      if (x3 = r4, "begin" === r4.type)
        return function(e4) {
          const t3 = e4[0], i4 = e4.rule, o4 = new n(i4), r5 = [i4.__beforeBegin, i4["on:begin"]];
          for (const n2 of r5)
            if (n2 && (n2(e4, o4), o4.isMatchIgnored))
              return b3(t3);
          return i4.skip ? R2 += t3 : (i4.excludeBegin && (R2 += t3), g2(), i4.returnBegin || i4.excludeBegin || (R2 = t3)), f2(i4, e4), i4.returnBegin ? 0 : t3.length;
        }(r4);
      if ("illegal" === r4.type && !o3) {
        const e4 = new Error('Illegal lexeme "' + s3 + '" for mode "' + (N3.scope || "<unnamed>") + '"');
        throw e4.mode = N3, e4;
      }
      if ("end" === r4.type) {
        const e4 = m3(r4);
        if (e4 !== le)
          return e4;
      }
      if ("illegal" === r4.type && "" === s3)
        return 1;
      if (j2 > 1e5 && j2 > 3 * r4.index) {
        throw new Error("potential infinite loop, way more iterations than matches");
      }
      return R2 += s3, s3.length;
    }
    const E3 = v2(e3);
    if (!E3)
      throw J(s2.replace("{}", e3)), new Error('Unknown language: "' + e3 + '"');
    const _3 = ie(E3);
    let O3 = "", N3 = r3 || _3;
    const S2 = {}, M2 = new d2.__emitter(d2);
    !function() {
      const e4 = [];
      for (let t3 = N3; t3 !== E3; t3 = t3.parent)
        t3.scope && e4.unshift(t3.scope);
      e4.forEach((e5) => M2.openNode(e5));
    }();
    let R2 = "", T2 = 0, A2 = 0, j2 = 0, I2 = false;
    try {
      if (E3.__emitTokens)
        E3.__emitTokens(t2, M2);
      else {
        for (N3.matcher.considerAll(); ; ) {
          j2++, I2 ? I2 = false : N3.matcher.considerAll(), N3.matcher.lastIndex = A2;
          const e4 = N3.matcher.exec(t2);
          if (!e4)
            break;
          const n2 = k3(t2.substring(A2, e4.index), e4);
          A2 = e4.index + n2;
        }
        k3(t2.substring(A2));
      }
      return M2.finalize(), O3 = M2.toHTML(), { language: e3, value: O3, relevance: T2, illegal: false, _emitter: M2, _top: N3 };
    } catch (n2) {
      if (n2.message && n2.message.includes("Illegal"))
        return { language: e3, value: ae(t2), illegal: true, relevance: 0, _illegalBy: { message: n2.message, index: A2, context: t2.slice(A2 - 100, A2 + 100), mode: n2.mode, resultSoFar: O3 }, _emitter: M2 };
      if (a2)
        return { language: e3, value: ae(t2), illegal: false, relevance: 0, errorRaised: n2, _emitter: M2, _top: N3 };
      throw n2;
    }
  }
  function y2(e3, t2) {
    t2 = t2 || d2.languages || Object.keys(i2);
    const n2 = function(e4) {
      const t3 = { value: ae(e4), illegal: false, relevance: 0, _top: l2, _emitter: new d2.__emitter(d2) };
      return t3._emitter.addText(e4), t3;
    }(e3), o3 = t2.filter(v2).filter(O2).map((t3) => w2(t3, e3, false));
    o3.unshift(n2);
    const r3 = o3.sort((e4, t3) => {
      if (e4.relevance !== t3.relevance)
        return t3.relevance - e4.relevance;
      if (e4.language && t3.language) {
        if (v2(e4.language).supersetOf === t3.language)
          return 1;
        if (v2(t3.language).supersetOf === e4.language)
          return -1;
      }
      return 0;
    }), [a3, s3] = r3, c2 = a3;
    return c2.secondBest = s3, c2;
  }
  function x2(e3) {
    let t2 = null;
    const n2 = function(e4) {
      let t3 = e4.className + " ";
      t3 += e4.parentNode ? e4.parentNode.className : "";
      const n3 = d2.languageDetectRe.exec(t3);
      if (n3) {
        const t4 = v2(n3[1]);
        return t4 || (Q(s2.replace("{}", n3[1])), Q("Falling back to no-highlight mode for this block.", e4)), t4 ? n3[1] : "no-highlight";
      }
      return t3.split(/\s+/).find((e5) => b2(e5) || v2(e5));
    }(e3);
    if (b2(n2))
      return;
    if (N2("before:highlightElement", { el: e3, language: n2 }), e3.dataset.highlighted)
      return void console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", e3);
    if (e3.children.length > 0 && (d2.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(e3)), d2.throwUnescapedHTML)) {
      throw new re("One of your code blocks includes unescaped HTML.", e3.innerHTML);
    }
    t2 = e3;
    const i3 = t2.textContent, r3 = n2 ? m2(i3, { language: n2, ignoreIllegals: true }) : y2(i3);
    e3.innerHTML = r3.value, e3.dataset.highlighted = "yes", function(e4, t3, n3) {
      const i4 = t3 && o2[t3] || n3;
      e4.classList.add("hljs"), e4.classList.add(`language-${i4}`);
    }(e3, n2, r3.language), e3.result = { language: r3.language, re: r3.relevance, relevance: r3.relevance }, r3.secondBest && (e3.secondBest = { language: r3.secondBest.language, relevance: r3.secondBest.relevance }), N2("after:highlightElement", { el: e3, result: r3, text: i3 });
  }
  let k2 = false;
  function E2() {
    if ("loading" === document.readyState)
      return void (k2 = true);
    document.querySelectorAll(d2.cssSelector).forEach(x2);
  }
  function v2(e3) {
    return e3 = (e3 || "").toLowerCase(), i2[e3] || i2[o2[e3]];
  }
  function _2(e3, { languageName: t2 }) {
    "string" == typeof e3 && (e3 = [e3]), e3.forEach((e4) => {
      o2[e4.toLowerCase()] = t2;
    });
  }
  function O2(e3) {
    const t2 = v2(e3);
    return t2 && !t2.disableAutodetect;
  }
  function N2(e3, t2) {
    const n2 = e3;
    r2.forEach(function(e4) {
      e4[n2] && e4[n2](t2);
    });
  }
  "undefined" != typeof window && window.addEventListener && window.addEventListener("DOMContentLoaded", function() {
    k2 && E2();
  }, false), Object.assign(e2, { highlight: m2, highlightAuto: y2, highlightAll: E2, highlightElement: x2, highlightBlock: function(e3) {
    return Y("10.7.0", "highlightBlock will be removed entirely in v12.0"), Y("10.7.0", "Please use highlightElement now."), x2(e3);
  }, configure: function(e3) {
    d2 = se(d2, e3);
  }, initHighlighting: () => {
    E2(), Y("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
  }, initHighlightingOnLoad: function() {
    E2(), Y("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
  }, registerLanguage: function(t2, n2) {
    let o3 = null;
    try {
      o3 = n2(e2);
    } catch (e3) {
      if (J("Language definition for '{}' could not be registered.".replace("{}", t2)), !a2)
        throw e3;
      J(e3), o3 = l2;
    }
    o3.name || (o3.name = t2), i2[t2] = o3, o3.rawDefinition = n2.bind(null, e2), o3.aliases && _2(o3.aliases, { languageName: t2 });
  }, unregisterLanguage: function(e3) {
    delete i2[e3];
    for (const t2 of Object.keys(o2))
      o2[t2] === e3 && delete o2[t2];
  }, listLanguages: function() {
    return Object.keys(i2);
  }, getLanguage: v2, registerAliases: _2, autoDetection: O2, inherit: se, addPlugin: function(e3) {
    !function(e4) {
      e4["before:highlightBlock"] && !e4["before:highlightElement"] && (e4["before:highlightElement"] = (t2) => {
        e4["before:highlightBlock"](Object.assign({ block: t2.el }, t2));
      }), e4["after:highlightBlock"] && !e4["after:highlightElement"] && (e4["after:highlightElement"] = (t2) => {
        e4["after:highlightBlock"](Object.assign({ block: t2.el }, t2));
      });
    }(e3), r2.push(e3);
  }, removePlugin: function(e3) {
    const t2 = r2.indexOf(e3);
    -1 !== t2 && r2.splice(t2, 1);
  } }), e2.debugMode = function() {
    a2 = false;
  }, e2.safeMode = function() {
    a2 = true;
  }, e2.versionString = "11.9.0", e2.regex = { concat: f, lookahead: g, either: p, optional: h, anyNumberOfTimes: u };
  for (const e3 in P)
    "object" == typeof P[e3] && t(P[e3]);
  return Object.assign(e2, P), e2;
}, de = ce({});
de.newInstance = () => ce({});
var ge = de;
de.HighlightJS = de, de.default = de;
const ue = e(ge), he = ["a", "abbr", "address", "article", "aside", "audio", "b", "blockquote", "body", "button", "canvas", "caption", "cite", "code", "dd", "del", "details", "dfn", "div", "dl", "dt", "em", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "mark", "menu", "nav", "object", "ol", "p", "q", "quote", "samp", "section", "span", "strong", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "ul", "var", "video"], fe = ["any-hover", "any-pointer", "aspect-ratio", "color", "color-gamut", "color-index", "device-aspect-ratio", "device-height", "device-width", "display-mode", "forced-colors", "grid", "height", "hover", "inverted-colors", "monochrome", "orientation", "overflow-block", "overflow-inline", "pointer", "prefers-color-scheme", "prefers-contrast", "prefers-reduced-motion", "prefers-reduced-transparency", "resolution", "scan", "scripting", "update", "width", "min-width", "max-width", "min-height", "max-height"], pe = ["active", "any-link", "blank", "checked", "current", "default", "defined", "dir", "disabled", "drop", "empty", "enabled", "first", "first-child", "first-of-type", "fullscreen", "future", "focus", "focus-visible", "focus-within", "has", "host", "host-context", "hover", "indeterminate", "in-range", "invalid", "is", "lang", "last-child", "last-of-type", "left", "link", "local-link", "not", "nth-child", "nth-col", "nth-last-child", "nth-last-col", "nth-last-of-type", "nth-of-type", "only-child", "only-of-type", "optional", "out-of-range", "past", "placeholder-shown", "read-only", "read-write", "required", "right", "root", "scope", "target", "target-within", "user-invalid", "valid", "visited", "where"], be = ["after", "backdrop", "before", "cue", "cue-region", "first-letter", "first-line", "grammar-error", "marker", "part", "placeholder", "selection", "slotted", "spelling-error"], me = ["align-content", "align-items", "align-self", "all", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "backface-visibility", "background", "background-attachment", "background-blend-mode", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-repeat", "background-size", "block-size", "border", "border-block", "border-block-color", "border-block-end", "border-block-end-color", "border-block-end-style", "border-block-end-width", "border-block-start", "border-block-start-color", "border-block-start-style", "border-block-start-width", "border-block-style", "border-block-width", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-inline", "border-inline-color", "border-inline-end", "border-inline-end-color", "border-inline-end-style", "border-inline-end-width", "border-inline-start", "border-inline-start-color", "border-inline-start-style", "border-inline-start-width", "border-inline-style", "border-inline-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "caret-color", "clear", "clip", "clip-path", "clip-rule", "color", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "contain", "content", "content-visibility", "counter-increment", "counter-reset", "cue", "cue-after", "cue-before", "cursor", "direction", "display", "empty-cells", "filter", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "flow", "font", "font-display", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-size", "font-size-adjust", "font-smoothing", "font-stretch", "font-style", "font-synthesis", "font-variant", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-variation-settings", "font-weight", "gap", "glyph-orientation-vertical", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-start", "grid-gap", "grid-row", "grid-row-end", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "hanging-punctuation", "height", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "ime-mode", "inline-size", "isolation", "justify-content", "left", "letter-spacing", "line-break", "line-height", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-block", "margin-block-end", "margin-block-start", "margin-bottom", "margin-inline", "margin-inline-end", "margin-inline-start", "margin-left", "margin-right", "margin-top", "marks", "mask", "mask-border", "mask-border-mode", "mask-border-outset", "mask-border-repeat", "mask-border-slice", "mask-border-source", "mask-border-width", "mask-clip", "mask-composite", "mask-image", "mask-mode", "mask-origin", "mask-position", "mask-repeat", "mask-size", "mask-type", "max-block-size", "max-height", "max-inline-size", "max-width", "min-block-size", "min-height", "min-inline-size", "min-width", "mix-blend-mode", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "none", "normal", "object-fit", "object-position", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-block", "padding-block-end", "padding-block-start", "padding-bottom", "padding-inline", "padding-inline-end", "padding-inline-start", "padding-left", "padding-right", "padding-top", "page-break-after", "page-break-before", "page-break-inside", "pause", "pause-after", "pause-before", "perspective", "perspective-origin", "pointer-events", "position", "quotes", "resize", "rest", "rest-after", "rest-before", "right", "row-gap", "scroll-margin", "scroll-margin-block", "scroll-margin-block-end", "scroll-margin-block-start", "scroll-margin-bottom", "scroll-margin-inline", "scroll-margin-inline-end", "scroll-margin-inline-start", "scroll-margin-left", "scroll-margin-right", "scroll-margin-top", "scroll-padding", "scroll-padding-block", "scroll-padding-block-end", "scroll-padding-block-start", "scroll-padding-bottom", "scroll-padding-inline", "scroll-padding-inline-end", "scroll-padding-inline-start", "scroll-padding-left", "scroll-padding-right", "scroll-padding-top", "scroll-snap-align", "scroll-snap-stop", "scroll-snap-type", "scrollbar-color", "scrollbar-gutter", "scrollbar-width", "shape-image-threshold", "shape-margin", "shape-outside", "speak", "speak-as", "src", "tab-size", "table-layout", "text-align", "text-align-all", "text-align-last", "text-combine-upright", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-style", "text-emphasis", "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-indent", "text-justify", "text-orientation", "text-overflow", "text-rendering", "text-shadow", "text-transform", "text-underline-position", "top", "transform", "transform-box", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "unicode-bidi", "vertical-align", "visibility", "voice-balance", "voice-duration", "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress", "voice-volume", "white-space", "widows", "width", "will-change", "word-break", "word-spacing", "word-wrap", "writing-mode", "z-index"].reverse();
function we(e2 = document) {
  e2.querySelectorAll('code[lang="css"]').forEach((e3, t2) => {
    ue.highlightElement(e3), e3.classList.contains("language-undefined") && (e3.innerHTML = ue.highlight(e3.innerText, { language: "css" }).value);
  });
}
ue.registerLanguage("css", (e2) => function(e3) {
  const t2 = e3.regex, n2 = ((e4) => ({ IMPORTANT: { scope: "meta", begin: "!important" }, BLOCK_COMMENT: e4.C_BLOCK_COMMENT_MODE, HEXCOLOR: { scope: "number", begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/ }, FUNCTION_DISPATCH: { className: "built_in", begin: /[\w-]+(?=\()/ }, ATTRIBUTE_SELECTOR_MODE: { scope: "selector-attr", begin: /\[/, end: /\]/, illegal: "$", contains: [e4.APOS_STRING_MODE, e4.QUOTE_STRING_MODE] }, CSS_NUMBER_MODE: { scope: "number", begin: e4.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?", relevance: 0 }, CSS_VARIABLE: { className: "attr", begin: /--[A-Za-z_][A-Za-z0-9_-]*/ } }))(e3), i2 = [e3.APOS_STRING_MODE, e3.QUOTE_STRING_MODE];
  return { name: "CSS", case_insensitive: true, illegal: /[=|'\$]/, keywords: { keyframePosition: "from to" }, classNameAliases: { keyframePosition: "selector-tag" }, contains: [n2.BLOCK_COMMENT, { begin: /-(webkit|moz|ms|o)-(?=[a-z])/ }, n2.CSS_NUMBER_MODE, { className: "selector-id", begin: /#[A-Za-z0-9_-]+/, relevance: 0 }, { className: "selector-class", begin: "\\.[a-zA-Z-][a-zA-Z0-9_-]*", relevance: 0 }, n2.ATTRIBUTE_SELECTOR_MODE, { className: "selector-pseudo", variants: [{ begin: ":(" + pe.join("|") + ")" }, { begin: ":(:)?(" + be.join("|") + ")" }] }, n2.CSS_VARIABLE, { className: "attribute", begin: "\\b(" + me.join("|") + ")\\b" }, { begin: /:/, end: /[;}{]/, contains: [n2.BLOCK_COMMENT, n2.HEXCOLOR, n2.IMPORTANT, n2.CSS_NUMBER_MODE, ...i2, { begin: /(url|data-uri)\(/, end: /\)/, relevance: 0, keywords: { built_in: "url data-uri" }, contains: [...i2, { className: "string", begin: /[^)]/, endsWithParent: true, excludeEnd: true }] }, n2.FUNCTION_DISPATCH] }, { begin: t2.lookahead(/@/), end: "[{;]", relevance: 0, illegal: /:/, contains: [{ className: "keyword", begin: /@-?\w[\w]*(-\w+)*/ }, { begin: /\s/, endsWithParent: true, excludeEnd: true, relevance: 0, keywords: { $pattern: /[a-z-]+/, keyword: "and or not only", attribute: fe.join(" ") }, contains: [{ begin: /[a-z-]+(?=:)/, className: "attribute" }, ...i2, n2.CSS_NUMBER_MODE] }] }, { className: "selector-tag", begin: "\\b(" + he.join("|") + ")\\b" }] };
}(e2)), void 0 === window.process && we(document);
export {
  we as execHighlight
};
