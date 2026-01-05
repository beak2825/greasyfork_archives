// ==UserScript==
// @name        XPath Selector
// @namespace   xiaohuohumax/userscripts/xpath-selector
// @version     1.1.3
// @author      xiaohuohumax
// @description XPath Selector -- 一个 XPath 选择器库，快速获取节点数据
// @license     MIT
// ==/UserScript==

var xpathSelector = function() {
  "use strict";
  function t$2(t2, s2, r2, i2) {
    const n2 = { op: s2, func: r2, data: i2 };
    return t2.push(n2), n2;
  }
  function s$2(t2, s2) {
    return t2;
  }
  let r$2 = class r {
    constructor() {
      this.program = [];
    }
    test(s2, r2) {
      return t$2(this.program, 5, s2, void 0 === r2 ? null : r2);
    }
    jump(s2) {
      return t$2(this.program, 3, null, s2);
    }
    record(r2, i2) {
      return t$2(this.program, 4, void 0 === i2 ? s$2 : i2, r2);
    }
    bad(s2 = 1) {
      return t$2(this.program, 1, null, s2);
    }
    accept() {
      return t$2(this.program, 0, null, null);
    }
    fail(s2) {
      return t$2(this.program, 2, s2 || null, null);
    }
  };
  let i$2 = class i2 {
    constructor(t2, s2, r2) {
      this.programLength = t2, this.maxFromByPc = s2, this.maxSurvivorFromByPc = r2;
    }
    static fromProgram(t2) {
      const s2 = t2.length, r2 = [], n2 = [];
      return t2.forEach((t3) => {
        r2.push(0), n2.push(0);
      }), t2.forEach((t3, i3) => {
        switch (t3.op) {
          case 2:
            if (null === t3.func) return;
            if (i3 + 1 >= s2) throw new Error("Invalid program: program could run past end");
            r2[i3 + 1] += 1;
            break;
          case 1:
          case 4:
            if (i3 + 1 >= s2) throw new Error("Invalid program: program could run past end");
            r2[i3 + 1] += 1;
            break;
          case 3:
            t3.data.forEach((t4) => {
              if (t4 < 0 || t4 >= s2) throw new Error("Invalid program: program could run past end");
              r2[t4] += 1;
            });
            break;
          case 5:
            if (i3 + 1 >= s2) throw new Error("Invalid program: program could run past end");
            n2[i3 + 1] += 1;
            break;
          case 0:
            n2[i3] += 1;
        }
      }), new i2(s2, r2, n2);
    }
    static createStub(t2) {
      const s2 = [], r2 = [];
      for (let i3 = 0; i3 < t2; ++i3) s2.push(t2), r2.push(t2);
      return new i2(t2, s2, r2);
    }
  };
  let n$2 = class n {
    constructor(t2) {
      this.acceptingTraces = t2, this.success = t2.length > 0;
    }
  };
  let h$2 = class h {
    constructor(t2) {
      this.t = 0, this.i = 0, this.h = new Uint16Array(t2), this.l = new Uint8Array(t2);
    }
    getBadness(t2) {
      return this.l[t2];
    }
    add(t2, s2) {
      this.l[t2] = s2 > 255 ? 255 : s2;
      const r2 = function(t3, s3, r3, i2, n2) {
        let h2 = i2, e2 = n2;
        for (; h2 < e2; ) {
          const i3 = h2 + e2 >>> 1;
          r3 < s3[t3[i3]] ? e2 = i3 : h2 = i3 + 1;
        }
        return h2;
      }(this.h, this.l, s2, this.i, this.t);
      this.h.copyWithin(r2 + 1, r2, this.t), this.h[r2] = t2, this.t += 1;
    }
    reschedule(t2, s2) {
      const r2 = Math.max(this.l[t2], s2 > 255 ? 255 : s2);
      if (this.l[t2] !== r2) {
        const s3 = this.h.indexOf(t2, this.i);
        if (s3 < 0 || s3 >= this.t) return void (this.l[t2] = r2);
        this.h.copyWithin(s3, s3 + 1, this.t), this.t -= 1, this.add(t2, r2);
      }
    }
    getNextPc() {
      return this.i >= this.t ? null : this.h[this.i++];
    }
    reset() {
      this.t = 0, this.i = 0, this.l.fill(0);
    }
  };
  let e$2 = class e {
    constructor(t2) {
      this.o = [];
      let s2 = t2.length;
      t2.forEach((t3) => {
        this.o.push(t3 > 0 ? s2 : -1), s2 += t3;
      }), this.u = new Uint16Array(s2);
    }
    clear() {
      this.u.fill(0, 0, this.o.length);
    }
    add(t2, s2) {
      const r2 = this.u[s2], i2 = this.o[s2];
      this.u[s2] += 1, this.u[i2 + r2] = t2;
    }
    has(t2) {
      return this.u[t2] > 0;
    }
    forEach(t2, s2) {
      const r2 = this.u[t2], i2 = this.o[t2];
      for (let t3 = i2; t3 < i2 + r2; ++t3) s2(this.u[t3]);
    }
  };
  function l$2(t2, s2, r2 = false) {
    return null === t2 ? s2 : Array.isArray(t2) ? (-1 === t2.indexOf(s2) && (r2 && (t2 = t2.slice()), t2.push(s2)), t2) : t2 === s2 ? t2 : [t2, s2];
  }
  let c$2 = class c {
    constructor(t2, s2) {
      this.prefixes = t2, this.record = s2;
    }
  };
  function o$2(t2, s2) {
    let r2;
    if (null === s2) {
      if (!Array.isArray(t2)) return t2;
      r2 = t2;
    } else r2 = t2 === c$2.EMPTY ? [] : Array.isArray(t2) ? t2 : [t2];
    return new c$2(r2, s2);
  }
  c$2.EMPTY = new c$2([], null);
  let u$2 = class u {
    constructor(t2) {
      this.p = [], this.v = [];
      for (let s2 = 0; s2 < t2; ++s2) this.p.push(0), this.v.push(null);
    }
    mergeTraces(t2, s2, r2, i2, n2, h2) {
      let e2 = false;
      return r2.forEach(s2, (s3) => {
        const r3 = this.trace(s3, i2, n2, h2);
        var c2, o2, u2;
        o2 = r3, u2 = e2, t2 = null === (c2 = t2) ? o2 : null === o2 ? c2 : Array.isArray(o2) ? o2.reduce((t3, s4) => l$2(t3, s4, t3 === o2), c2) : l$2(c2, o2, u2), e2 = t2 === r3;
      }), t2;
    }
    trace(t2, s2, r2, i2) {
      switch (this.p[t2]) {
        case 2:
          return this.v[t2];
        case 1:
          return null;
      }
      this.p[t2] = 1;
      let n2 = null;
      const h2 = s2[t2];
      if (null !== h2) n2 = h2;
      else if (!r2.has(t2)) throw new Error("Trace without source at pc " + t2);
      if (n2 = this.mergeTraces(n2, t2, r2, s2, r2, i2), null !== n2) {
        const s3 = i2[t2];
        null !== s3 && (n2 = o$2(n2, s3));
      }
      return this.v[t2] = n2, this.p[t2] = 2, n2;
    }
    buildSurvivorTraces(t2, s2, r2, i2, n2) {
      for (let h2 = 0, e2 = t2.length; h2 < e2; ++h2) {
        if (!r2.has(h2)) {
          s2[h2] = null;
          continue;
        }
        this.v.fill(null), this.p.fill(0);
        const e3 = this.mergeTraces(null, h2, r2, t2, i2, n2);
        if (null === e3) throw new Error("No non-cyclic paths found to survivor " + h2);
        s2[h2] = o$2(e3, null);
      }
      this.v.fill(null);
    }
  };
  let a$2 = class a {
    constructor(t2) {
      this.g = [], this.k = [], this.m = [], this.A = new e$2(t2.maxFromByPc), this.T = new e$2(t2.maxSurvivorFromByPc), this.S = new u$2(t2.programLength);
      for (let s2 = 0; s2 < t2.programLength; ++s2) this.g.push(null), this.k.push(null), this.m.push(null);
      this.k[0] = c$2.EMPTY;
    }
    reset(t2) {
      this.A.clear(), this.T.clear(), this.g.fill(null), t2 && (this.k.fill(null), this.m.fill(null), this.k[0] = c$2.EMPTY);
    }
    record(t2, s2) {
      this.g[t2] = s2;
    }
    has(t2) {
      return this.A.has(t2) || null !== this.k[t2];
    }
    add(t2, s2) {
      this.A.add(t2, s2);
    }
    hasSurvivor(t2) {
      return this.T.has(t2);
    }
    addSurvivor(t2, s2) {
      this.T.add(t2, s2);
    }
    buildSurvivorTraces() {
      const t2 = this.k;
      this.S.buildSurvivorTraces(t2, this.m, this.T, this.A, this.g), this.k = this.m, this.m = t2;
    }
    getTraces(t2) {
      const s2 = t2.reduce((t3, s3) => l$2(t3, this.k[s3]), null);
      return null === s2 ? [] : Array.isArray(s2) ? s2 : [s2];
    }
  };
  let f$2 = class f {
    constructor(t2) {
      this.I = [], this.N = new h$2(t2.programLength), this.M = new h$2(t2.programLength), this.P = new a$2(t2);
    }
    reset() {
      this.N.reset(), this.N.add(0, 0), this.I.length = 0, this.P.reset(true);
    }
    getNextThreadPc() {
      return this.N.getNextPc();
    }
    step(t2, s2, r2) {
      const i2 = this.P.has(s2);
      this.P.add(t2, s2);
      const n2 = this.N.getBadness(t2) + r2;
      i2 ? this.N.reschedule(s2, n2) : this.N.add(s2, n2);
    }
    stepToNextGeneration(t2, s2) {
      const r2 = this.P.hasSurvivor(s2);
      this.P.addSurvivor(t2, s2);
      const i2 = this.N.getBadness(t2);
      r2 ? this.M.reschedule(s2, i2) : this.M.add(s2, i2);
    }
    accept(t2) {
      this.I.push(t2), this.P.addSurvivor(t2, t2);
    }
    fail(t2) {
    }
    record(t2, s2) {
      this.P.record(t2, s2);
    }
    nextGeneration() {
      this.P.buildSurvivorTraces(), this.P.reset(false);
      const t2 = this.N;
      t2.reset(), this.N = this.M, this.M = t2;
    }
    getAcceptingTraces() {
      return this.P.getTraces(this.I);
    }
  };
  let d$2 = class d {
    constructor(t2) {
      this.U = [], this.G = t2, this.V = i$2.fromProgram(t2), this.U.push(new f$2(this.V));
    }
    execute(t2, s2) {
      const r2 = this.U.pop() || new f$2(this.V);
      r2.reset();
      const i2 = t2.length;
      let h2, e2 = -1;
      do {
        let n2 = r2.getNextThreadPc();
        if (null === n2) break;
        for (++e2, h2 = e2 >= i2 ? null : t2[e2]; null !== n2; ) {
          const t3 = this.G[n2];
          switch (t3.op) {
            case 0:
              null === h2 ? r2.accept(n2) : r2.fail(n2);
              break;
            case 2: {
              const i3 = t3.func;
              if (null === i3 || i3(s2)) {
                r2.fail(n2);
                break;
              }
              r2.step(n2, n2 + 1, 0);
              break;
            }
            case 1:
              r2.step(n2, n2 + 1, t3.data);
              break;
            case 5:
              if (null === h2) {
                r2.fail(n2);
                break;
              }
              if (!(0, t3.func)(h2, t3.data, s2)) {
                r2.fail(n2);
                break;
              }
              r2.stepToNextGeneration(n2, n2 + 1);
              break;
            case 3: {
              const s3 = t3.data, i3 = s3.length;
              if (0 === i3) {
                r2.fail(n2);
                break;
              }
              for (let t4 = 0; t4 < i3; ++t4) r2.step(n2, s3[t4], 0);
              break;
            }
            case 4: {
              const i3 = (0, t3.func)(t3.data, e2, s2);
              null != i3 && r2.record(n2, i3), r2.step(n2, n2 + 1, 0);
              break;
            }
          }
          n2 = r2.getNextThreadPc();
        }
        r2.nextGeneration();
      } while (null !== h2);
      const l2 = new n$2(r2.getAcceptingTraces());
      return r2.reset(), this.U.push(r2), l2;
    }
  };
  function w$2(t2) {
    const s2 = new r$2();
    return t2(s2), new d$2(s2.program);
  }
  function B$1(A2) {
    return (B2) => B2 === A2;
  }
  function a$1(A2, B2) {
    if (null === A2 || null === B2) throw new Error("unescaped hyphen may not be used as a range endpoint");
    if (B2 < A2) throw new Error("character range is in the wrong order");
    return (a2) => A2 <= a2 && a2 <= B2;
  }
  function n$1(A2) {
    return true;
  }
  function e$1() {
    return false;
  }
  function t$1(A2, B2) {
    return (a2) => A2(a2) || B2(a2);
  }
  function G$1(A2, B2) {
    switch (B2.kind) {
      case "predicate":
        return void A2.test(B2.value);
      case "regexp":
        return void r$1(A2, B2.value, false);
    }
  }
  function i$1(A2, B2) {
    B2.forEach((B3) => {
      !function(A3, B4) {
        const [a2, { min: n2, max: e2 }] = B4;
        if (null !== e2) {
          for (let B5 = 0; B5 < n2; ++B5) G$1(A3, a2);
          for (let B5 = n2; B5 < e2; ++B5) {
            const B6 = A3.jump([]);
            B6.data.push(A3.program.length), G$1(A3, a2), B6.data.push(A3.program.length);
          }
        } else if (n2 > 0) {
          for (let B6 = 0; B6 < n2 - 1; ++B6) G$1(A3, a2);
          const B5 = A3.program.length;
          G$1(A3, a2), A3.jump([B5]).data.push(A3.program.length);
        } else {
          const B5 = A3.program.length, n3 = A3.jump([]);
          n3.data.push(A3.program.length), G$1(A3, a2), A3.jump([B5]), n3.data.push(A3.program.length);
        }
      }(A2, B3);
    });
  }
  function r$1(A2, B2, a2) {
    const n2 = A2.program.length, e2 = A2.jump([]);
    a2 && (e2.data.push(A2.program.length), A2.test(() => true), A2.jump([n2]));
    const t2 = [];
    if (B2.forEach((B3) => {
      e2.data.push(A2.program.length), i$1(A2, B3), t2.push(A2.jump([]));
    }), t2.forEach((B3) => {
      B3.data.push(A2.program.length);
    }), a2) {
      const B3 = A2.program.length, a3 = A2.jump([]);
      a3.data.push(A2.program.length), A2.test(() => true), A2.jump([B3]), a3.data.push(A2.program.length);
    }
  }
  function o$1(A2, B2) {
    return { success: true, offset: A2, value: B2 };
  }
  function l$1(A2) {
    return o$1(A2, void 0);
  }
  function H$1(A2, B2, a2 = false) {
    return { success: false, offset: A2, expected: B2, fatal: a2 };
  }
  function C$1(A2) {
    return (B2, a2) => {
      const n2 = a2 + A2.length;
      return B2.slice(a2, n2) === A2 ? o$1(n2, A2) : H$1(a2, [A2]);
    };
  }
  function u$1(A2, B2) {
    return (a2, n2) => {
      const e2 = A2(a2, n2);
      return e2.success ? o$1(e2.offset, B2(e2.value)) : e2;
    };
  }
  function s$1(A2, B2, a2, n2) {
    return (e2, t2) => {
      const G2 = A2(e2, t2);
      return G2.success ? B2(G2.value) ? G2 : H$1(t2, a2, n2) : G2;
    };
  }
  function c$1(A2, B2) {
    return (a2, n2) => {
      let e2 = null;
      for (const t2 of A2) {
        const A3 = t2(a2, n2);
        if (A3.success) return A3;
        if (null === e2 || A3.offset > e2.offset ? e2 = A3 : A3.offset === e2.offset && void 0 === B2 && (e2.expected = e2.expected.concat(A3.expected)), A3.fatal) return A3;
      }
      return B2 = B2 || (null == e2 ? void 0 : e2.expected) || [], e2 && (e2.expected = B2), e2 || H$1(n2, B2);
    };
  }
  function D$1(A2) {
    return (B2, a2) => {
      const n2 = A2(B2, a2);
      return n2.success || n2.fatal ? n2 : o$1(a2, null);
    };
  }
  function m$1(A2) {
    return (B2, a2) => {
      let n2 = [], e2 = a2;
      for (; ; ) {
        const a3 = A2(B2, e2);
        if (!a3.success) {
          if (a3.fatal) return a3;
          break;
        }
        if (n2.push(a3.value), a3.offset === e2) break;
        e2 = a3.offset;
      }
      return o$1(e2, n2);
    };
  }
  function I$1(A2, B2, a2) {
    return (n2, e2) => {
      const t2 = A2(n2, e2);
      if (!t2.success) return t2;
      const G2 = B2(n2, t2.offset);
      return G2.success ? o$1(G2.offset, a2(t2.value, G2.value)) : G2;
    };
  }
  function d$1(A2) {
    return I$1(A2, m$1(A2), (A3, B2) => [A3].concat(B2));
  }
  function h$1(A2, B2) {
    return A2;
  }
  function p$1(A2, B2) {
    return B2;
  }
  function T(A2, B2) {
    return I$1(A2, B2, p$1);
  }
  function F$1(A2, B2) {
    return I$1(A2, B2, h$1);
  }
  function E$1(A2, B2, a2, n2 = false) {
    return T(A2, n2 ? f$1(F$1(B2, a2)) : F$1(B2, a2));
  }
  function g$1(A2, B2) {
    return (a2, n2) => A2(a2, n2).success ? H$1(n2, B2) : l$1(n2);
  }
  function f$1(A2) {
    return (B2, a2) => {
      const n2 = A2(B2, a2);
      return n2.success ? n2 : H$1(n2.offset, n2.expected, true);
    };
  }
  const P$1 = (A2, B2) => A2.length === B2 ? l$1(B2) : H$1(B2, ["end of input"]);
  const M$1 = ["Lu", "Ll", "Lt", "Lm", "Lo", "Mn", "Mc", "Me", "Nd", "Nl", "No", "Pc", "Pd", "Ps", "Pe", "Pi", "Pf", "Po", "Zs", "Zl", "Zp", "Sm", "Sc", "Sk", "So", "Cc", "Cf", "Co", "Cn"];
  const J$1 = {};
  function S$1(A2) {
    return A2.codePointAt(0);
  }
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("").forEach((A2, B2) => {
    J$1[A2] = B2;
  });
  const K$1 = (A2) => -1 === A2 || -2 === A2;
  function b$1(A2) {
    return (B2) => !K$1(B2) && !A2(B2);
  }
  function y$1(A2, B2) {
    return null === B2 ? A2 : (a2) => A2(a2) && !B2(a2);
  }
  const Q = function(A2, B2) {
    const n2 = /* @__PURE__ */ new Map();
    let e2 = 0;
    return A2.forEach((A3, G2) => {
      const i2 = B2[G2];
      null !== A3 && A3.split("|").forEach((A4) => {
        const B3 = n2.get(A4), G3 = a$1(e2, e2 + i2 - 1);
        n2.set(A4, B3 ? t$1(B3, G3) : G3);
      }), e2 += i2;
    }), n2;
  }(["BasicLatin", "Latin-1Supplement", "LatinExtended-A", "LatinExtended-B", "IPAExtensions", "SpacingModifierLetters", "CombiningDiacriticalMarks", "GreekandCoptic|Greek", "Cyrillic", "CyrillicSupplement", "Armenian", "Hebrew", "Arabic", "Syriac", "ArabicSupplement", "Thaana", "NKo", "Samaritan", "Mandaic", "SyriacSupplement", "ArabicExtended-B", "ArabicExtended-A", "Devanagari", "Bengali", "Gurmukhi", "Gujarati", "Oriya", "Tamil", "Telugu", "Kannada", "Malayalam", "Sinhala", "Thai", "Lao", "Tibetan", "Myanmar", "Georgian", "HangulJamo", "Ethiopic", "EthiopicSupplement", "Cherokee", "UnifiedCanadianAboriginalSyllabics", "Ogham", "Runic", "Tagalog", "Hanunoo", "Buhid", "Tagbanwa", "Khmer", "Mongolian", "UnifiedCanadianAboriginalSyllabicsExtended", "Limbu", "TaiLe", "NewTaiLue", "KhmerSymbols", "Buginese", "TaiTham", "CombiningDiacriticalMarksExtended", "Balinese", "Sundanese", "Batak", "Lepcha", "OlChiki", "CyrillicExtended-C", "GeorgianExtended", "SundaneseSupplement", "VedicExtensions", "PhoneticExtensions", "PhoneticExtensionsSupplement", "CombiningDiacriticalMarksSupplement", "LatinExtendedAdditional", "GreekExtended", "GeneralPunctuation", "SuperscriptsandSubscripts", "CurrencySymbols", "CombiningDiacriticalMarksforSymbols|CombiningMarksforSymbols", "LetterlikeSymbols", "NumberForms", "Arrows", "MathematicalOperators", "MiscellaneousTechnical", "ControlPictures", "OpticalCharacterRecognition", "EnclosedAlphanumerics", "BoxDrawing", "BlockElements", "GeometricShapes", "MiscellaneousSymbols", "Dingbats", "MiscellaneousMathematicalSymbols-A", "SupplementalArrows-A", "BraillePatterns", "SupplementalArrows-B", "MiscellaneousMathematicalSymbols-B", "SupplementalMathematicalOperators", "MiscellaneousSymbolsandArrows", "Glagolitic", "LatinExtended-C", "Coptic", "GeorgianSupplement", "Tifinagh", "EthiopicExtended", "CyrillicExtended-A", "SupplementalPunctuation", "CJKRadicalsSupplement", "KangxiRadicals", null, "IdeographicDescriptionCharacters", "CJKSymbolsandPunctuation", "Hiragana", "Katakana", "Bopomofo", "HangulCompatibilityJamo", "Kanbun", "BopomofoExtended", "CJKStrokes", "KatakanaPhoneticExtensions", "EnclosedCJKLettersandMonths", "CJKCompatibility", "CJKUnifiedIdeographsExtensionA", "YijingHexagramSymbols", "CJKUnifiedIdeographs", "YiSyllables", "YiRadicals", "Lisu", "Vai", "CyrillicExtended-B", "Bamum", "ModifierToneLetters", "LatinExtended-D", "SylotiNagri", "CommonIndicNumberForms", "Phags-pa", "Saurashtra", "DevanagariExtended", "KayahLi", "Rejang", "HangulJamoExtended-A", "Javanese", "MyanmarExtended-B", "Cham", "MyanmarExtended-A", "TaiViet", "MeeteiMayekExtensions", "EthiopicExtended-A", "LatinExtended-E", "CherokeeSupplement", "MeeteiMayek", "HangulSyllables", "HangulJamoExtended-B", "HighSurrogates", "HighPrivateUseSurrogates", "LowSurrogates", "PrivateUseArea|PrivateUse", "CJKCompatibilityIdeographs", "AlphabeticPresentationForms", "ArabicPresentationForms-A", "VariationSelectors", "VerticalForms", "CombiningHalfMarks", "CJKCompatibilityForms", "SmallFormVariants", "ArabicPresentationForms-B", "HalfwidthandFullwidthForms", "Specials", "LinearBSyllabary", "LinearBIdeograms", "AegeanNumbers", "AncientGreekNumbers", "AncientSymbols", "PhaistosDisc", null, "Lycian", "Carian", "CopticEpactNumbers", "OldItalic", "Gothic", "OldPermic", "Ugaritic", "OldPersian", null, "Deseret", "Shavian", "Osmanya", "Osage", "Elbasan", "CaucasianAlbanian", "Vithkuqi", null, "LinearA", "LatinExtended-F", null, "CypriotSyllabary", "ImperialAramaic", "Palmyrene", "Nabataean", null, "Hatran", "Phoenician", "Lydian", null, "MeroiticHieroglyphs", "MeroiticCursive", "Kharoshthi", "OldSouthArabian", "OldNorthArabian", null, "Manichaean", "Avestan", "InscriptionalParthian", "InscriptionalPahlavi", "PsalterPahlavi", null, "OldTurkic", null, "OldHungarian", "HanifiRohingya", null, "RumiNumeralSymbols", "Yezidi", "ArabicExtended-C", "OldSogdian", "Sogdian", "OldUyghur", "Chorasmian", "Elymaic", "Brahmi", "Kaithi", "SoraSompeng", "Chakma", "Mahajani", "Sharada", "SinhalaArchaicNumbers", "Khojki", null, "Multani", "Khudawadi", "Grantha", null, "Newa", "Tirhuta", null, "Siddham", "Modi", "MongolianSupplement", "Takri", null, "Ahom", null, "Dogra", null, "WarangCiti", "DivesAkuru", null, "Nandinagari", "ZanabazarSquare", "Soyombo", "UnifiedCanadianAboriginalSyllabicsExtended-A", "PauCinHau", "DevanagariExtended-A", null, "Bhaiksuki", "Marchen", null, "MasaramGondi", "GunjalaGondi", null, "Makasar", "Kawi", null, "LisuSupplement", "TamilSupplement", "Cuneiform", "CuneiformNumbersandPunctuation", "EarlyDynasticCuneiform", null, "Cypro-Minoan", "EgyptianHieroglyphs", "EgyptianHieroglyphFormatControls", null, "AnatolianHieroglyphs", null, "BamumSupplement", "Mro", "Tangsa", "BassaVah", "PahawhHmong", null, "Medefaidrin", null, "Miao", null, "IdeographicSymbolsandPunctuation", "Tangut", "TangutComponents", "KhitanSmallScript", "TangutSupplement", null, "KanaExtended-B", "KanaSupplement", "KanaExtended-A", "SmallKanaExtension", "Nushu", null, "Duployan", "ShorthandFormatControls", null, "ZnamennyMusicalNotation", null, "ByzantineMusicalSymbols", "MusicalSymbols", "AncientGreekMusicalNotation", null, "KaktovikNumerals", "MayanNumerals", "TaiXuanJingSymbols", "CountingRodNumerals", null, "MathematicalAlphanumericSymbols", "SuttonSignWriting", null, "LatinExtended-G", "GlagoliticSupplement", "CyrillicExtended-D", null, "NyiakengPuachueHmong", null, "Toto", "Wancho", null, "NagMundari", null, "EthiopicExtended-B", "MendeKikakui", null, "Adlam", null, "IndicSiyaqNumbers", null, "OttomanSiyaqNumbers", null, "ArabicMathematicalAlphabeticSymbols", null, "MahjongTiles", "DominoTiles", "PlayingCards", "EnclosedAlphanumericSupplement", "EnclosedIdeographicSupplement", "MiscellaneousSymbolsandPictographs", "Emoticons", "OrnamentalDingbats", "TransportandMapSymbols", "AlchemicalSymbols", "GeometricShapesExtended", "SupplementalArrows-C", "SupplementalSymbolsandPictographs", "ChessSymbols", "SymbolsandPictographsExtended-A", "SymbolsforLegacyComputing", null, "CJKUnifiedIdeographsExtensionB", null, "CJKUnifiedIdeographsExtensionC", "CJKUnifiedIdeographsExtensionD", "CJKUnifiedIdeographsExtensionE", "CJKUnifiedIdeographsExtensionF", null, "CJKCompatibilityIdeographsSupplement", null, "CJKUnifiedIdeographsExtensionG", "CJKUnifiedIdeographsExtensionH", null, "Tags", null, "VariationSelectorsSupplement", null, "SupplementaryPrivateUseArea-A|PrivateUse", "SupplementaryPrivateUseArea-B|PrivateUse"], [128, 128, 128, 208, 96, 80, 112, 144, 256, 48, 96, 112, 256, 80, 48, 64, 64, 64, 32, 16, 48, 96, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 256, 160, 96, 256, 384, 32, 96, 640, 32, 96, 32, 32, 32, 32, 128, 176, 80, 80, 48, 96, 32, 32, 144, 80, 128, 64, 64, 80, 48, 16, 48, 16, 48, 128, 64, 64, 256, 256, 112, 48, 48, 48, 80, 64, 112, 256, 256, 64, 32, 160, 128, 32, 96, 256, 192, 48, 16, 256, 128, 128, 256, 256, 96, 32, 128, 48, 80, 96, 32, 128, 128, 224, 16, 16, 64, 96, 96, 48, 96, 16, 32, 48, 16, 256, 256, 6592, 64, 20992, 1168, 64, 48, 320, 96, 96, 32, 224, 48, 16, 64, 96, 32, 48, 48, 32, 96, 32, 96, 32, 96, 32, 48, 64, 80, 64, 11184, 80, 896, 128, 1024, 6400, 512, 80, 688, 16, 16, 16, 32, 32, 144, 240, 16, 128, 128, 64, 80, 64, 48, 128, 32, 64, 32, 48, 32, 48, 32, 64, 32, 80, 48, 48, 80, 48, 64, 80, 64, 384, 64, 64, 64, 32, 32, 48, 48, 32, 32, 32, 64, 32, 96, 96, 32, 32, 32, 64, 64, 32, 32, 48, 80, 80, 48, 128, 64, 288, 32, 64, 64, 48, 64, 64, 48, 32, 128, 80, 48, 80, 48, 96, 32, 80, 48, 48, 80, 128, 128, 128, 96, 160, 128, 96, 32, 80, 48, 80, 176, 80, 80, 96, 96, 64, 96, 80, 96, 16, 64, 96, 160, 112, 80, 64, 96, 80, 304, 32, 96, 80, 16, 64, 1024, 128, 208, 2624, 112, 1072, 48, 4e3, 640, 8576, 576, 48, 96, 48, 144, 688, 96, 96, 160, 64, 32, 6144, 768, 512, 128, 8816, 16, 256, 48, 64, 400, 2304, 160, 16, 4688, 208, 48, 256, 256, 80, 112, 32, 32, 96, 32, 128, 1024, 688, 1104, 256, 48, 96, 112, 80, 320, 48, 64, 464, 48, 736, 32, 224, 32, 96, 784, 80, 64, 80, 176, 256, 256, 48, 112, 96, 256, 256, 768, 80, 48, 128, 128, 128, 256, 256, 112, 144, 256, 1024, 42720, 32, 4160, 224, 5776, 7488, 3088, 544, 1504, 4944, 4192, 711760, 128, 128, 240, 65040, 65536, 65536]), x$1 = function(A2) {
    const n2 = /* @__PURE__ */ new Map(), G2 = A2.split(""), i2 = M$1.map(() => []);
    let r2 = 0, o2 = 0;
    for (; o2 < G2.length; ) {
      const A3 = J$1[G2[o2]], n3 = (31 & A3) - 2;
      let e2 = 1 + J$1[G2[o2 + 1]];
      switch (32 & A3 ? (e2 += J$1[G2[o2 + 2]] << 6, e2 += J$1[G2[o2 + 3]] << 12, e2 += J$1[G2[o2 + 4]] << 18, o2 += 5) : o2 += 2, n3) {
        case -2: {
          let A4 = 0;
          for (let a2 = r2; a2 < r2 + e2; ++a2) {
            i2[A4].push(B$1(a2)), A4 = (A4 + 1) % 2;
          }
          break;
        }
        case -1:
          break;
        default: {
          const A4 = i2[n3];
          1 === e2 ? A4.push(B$1(r2)) : A4.push(a$1(r2, r2 + e2 - 1));
          break;
        }
      }
      r2 += e2;
    }
    const l2 = /* @__PURE__ */ new Map();
    return M$1.forEach((A3, B2) => {
      const a2 = i2[B2].reduce(t$1, e$1);
      n2.set(A3, a2);
      const G3 = A3.charAt(0), r3 = l2.get(G3) || [];
      l2.set(G3, r3), r3.push(a2);
    }), l2.forEach((A3, B2) => {
      n2.set(B2, A3.reduce(t$1, e$1));
    }), n2;
  }("bfUATCYATCPAQATAXATAOATBKJTBXCTBCZPATAQAZANAZADZPAXAQAXAbgUATAYDaATAZAaAGARAXAcAaAZAaAXAMBZADATBZAMAGASAMCTACWXACGDXXADHA3DAAPDAAtCAAFDBCAADCAABCCDBCCABCAABCCDCCAABCAAFCAADDAABCAABCBADCBDBGACADCGDCAEADACAEADACAEADAAPDAARDACAEADAABCBA7DFCAABCBDBABCCAJjDBAAGADaFRZDFLZNFEZGFAZAFAZQnvBAAADFAZACADABBFADCTACABDZBCATACCBACABACAABCQBACIDiCADBCCDCAXDDCADAXAABCBDBCyDvAhaAHEJBA1CAANDAgfBAABAClBBFATFDoTAOABBaBYABAHsOAHATAHBTAHBTAHABHGaBDGDTBBKcFXCTBYATBaBHKTAcATCGfFAGJHUKJTDGBHAmiBAATAGAHGcAaAHFFBHBaAHDGBKJGCaBGATNBAcAGAHAGdHaBBmYBAAHKGABNKJGgHIFBaATCFABBHAYBGVHDFAHIFAHCFAHEBBTOBAGYHCBBTABAGKBEGXZAGFBAcBBFHHGoFAHXcAHfIAG1HAIAHAGAICHHIDHAIBGAHGGJHBTBKJTAFAGOHAIBBAGHBBGBBBGVBAGGBAGABCGDBBHAGAICHDBBIBBBIBHAGABHIABDGBBAGCHBBBKJGBYBMFaAYAGATAHABBHBIABAGFBDGBBBGVBAGGBAGBBAGBBAGBBBHABAICHBBDHBBBHCBCHABGGDBAGABGKJHBGCHATABJHBIABAGIBAGCBAGVBAGGBAGBBAGEBBHAGAICHEBAHBIABAIBHABBGABOGBHBBBKJTAYABGGAHFBAHAIBBAGHBBGBBBGVBAGGBAGBBAGEBBHAGAIAHAIAHDBBIBBBIBHABGHBIABDGBBAGCHBBBKJaAGAMFBJHAGABAGFBCGCBAGDBCGBBAGABAGBBCGBBCGCBCGLBDIBHAIBBCICBAICHABBGABFIABNKJMCaFYAaABEHAICHAGHBAGCBAGWBAGPBBHAGAHCIDBAHCBAHDBGHBBAGCBBGABBGBHBBBKJBGTAMGaAGAHAIBTAGHBAGCBAGWBAGJBAGEBBHAGAIAHAIEBAHAIBBAIBHBBGIBBFGBBAGBHBBBKJBAGBIABLHBIBGIBAGCBAGoHBGAICHDBAICBAICHAGAaABDGCIAMGGCHBBBKJMIaAGFBAHAIBBAGRBCGXBAGIBAGABBGGBCHABDICHCBAHABAIHBFKJBBIBTABLGvHAGBHGBDYAGFFAHHTAKJTBBkGBBAGABAGEBAGXBAGABAGJHAGBHIGABBGEBAFABAHGBAKJBBGDBfGAaCTOaATAaCHBaFKJMJaAHAaAHAaAHAPAQAPAQAIBGHBAGjBDHNIAHETAHBGEHKBAHjBAaHHAaFBAaBTEaDTBBkGqIBHDIAHFIAHBIBHBGAKJTFGFIBHBGDHCGAICGBIGGCHDGMHAIBHBIFHAGAIAKJICHAaBClBACABECABBDqTAFADCmIFAABAGDBBGGBAGABAGDBBGoBAGDBBGgBAGDBBGGBAGABAGDBBGOBAG4BAGDBBmCBAABBHCTIMTBCGPaJBFiVBAABBDFBBOAmrJAAaATAGQUAGZPAQABCmKBAATCLCGHBGGRHCIABIGSHBIATBBIGRHBBLGMBAGCBAHBBLGzHBIAHGIHHAIBHKTCFATCYAGAHABBKJBFMJBFTFOATDHCcAHAKJBFGiFAG0BGGEHBGhHAGABEmFBAABJGeBAHCIDHBICBDIBHAIFHCBDaABCTBKJGdBBGEBKGrBDGZBFKJMABCahGWHBIBHABBTBG0IAHAIAHGBAHAIAHAIBHHIFHJBBHAKJBFKJBFTGFATFBBHNJAHPBwHDIAGuHAIAHEIAHAIEHAIBGHBCKJTGaJHIaITBBAHBIAGdIAHDIBHBIAHCGBKJGrHAIAHBICHAIAHCIBBHTDGjIHHHIBHBBCTEKJBCGCKJGdFFTBDIBGCqBBCCTHBHHCTAHMIAHGGDHAGFHAGBIAHBGABEDrF+DMFADhFkH/gVCAADHghBAADHCHDFBBCFBBDHCHDHCHDFBBCFBBDHBACABACABACABACADHCHDNBBDHEHDHEHDHEHDEBADBCDEAZADAZCDCBADBCDEAZCDDBBDBCDBAZCDHCEZCBBDCBADBCDEAZBBAUKcEOFTBRASAPARBSAPARATHVAWAcEUATIRASATDNBTCXAPAQATKXATANATJUAcEBAcJMAFABBMFXCPAQAFAMJXCPAQABAFMBCYgBOHMJDHAJCHLBOaBCAaDCAaBDACCDBCCDAaACAaBXACEaFCAaACAaACAaACDaADACDDAGDDAaBDBCBXECADDaAXAaBDAaAMPLiCADALDMAaBBDXEaEXBaDXAaBXAaBXAaGXAaeXBaBXAaAXAae3LEAAaHPAQAPAQAaTXBaGPAQA6QBAAXAadXYanXF6EBAABYaKBUM76NBAAMV62CAAXAaIXAa1XH6uBAAXA63DAAPAQAPAQAPAQAPAQAPAQAPAQAPAQAMdarXEPAQAXePAQAPAQAPAQAPAQAPAQAXP6/DAA3CCAAPAQAPAQAPAQAPAQAPAQAPAQAPAQAPAQAPAQAPAQAPAQAX+PAQAPAQAXfPAQA3BEAAavXUaBXFamBBafBA6oBAACvDvABCCDBAFCCADDACADFFBCBgjBAADAaFADHCCADABETDMATBDlBADABEDABBG3BGFATABNHAGWBIGGBAGGBAGGBAGGBAGGBAGGBAGGBAGGBAHfTBRASARASATCRASATARASATIOATBOATARASATBRASAPAQAPAQAPAQAPAQATEFATJOBTDOATAPATMaBTCPAQAPAQAPAQAPAQAOABhaZBA6YBAABL6VDAABZaLBDUATCaAFAGALAPAQAPAQAPAQAPAQAPAQAaBPAQAPAQAPAQAPAQAOAPAQBaALIHDIBOAFEaBLCFAGATAaBBAmVBAABBHBZBFBGAOAmZBAATAFCGABEGqBAmdBAABAaBMDaJGfajBLGPaeBAMJadMHaAMOafMJamMO6/EAAm/mBAa/mUIFAFAm2RAABCa2BIGnFFTBmLEAAFATCGPKJGBBTAtGAHAJCTAHJTAFAAbFBHBmFBAALJHBTFBHZWFIZBANDBA9FADHADCAAJFAZBADGAADDBATCDABCDAPCCADBECADABADABADAADBXFCCADAGAFBDAGGHAGCHAGDHAGWIBHBIAaDHABCMFaBYAaABFGzTDBHIBGxIPHBBHTBKJBFHRGFTCGATAGBHAKJGbHHTBGWHKIBBKTAGcBCHCIAGuHAIBHDIBHBICTMBAFAKJBDTBGEHAFAGIKJGEBAGoHFIBHBIBHBBIGCHAGHHAIABBKJBBTDGPFAGFaCGAIAHAIAGxHAGAHCGBHBGEHBGAHAGABXGBFATBGKIAHBIBTBGAFBIAHABJGFBBGFBBGFBIGGBAGGBADqZAFDDIFAZBBDjPBAAGiIBHAIBHAIBTAIAHABBKJBFmjuCABLGWBDGwhDgAA9/jBAmtFAABBmpBAABlDGBLDEBEGAHAGJXAGMBAGEBAGABAGBBAGBBAmrBAAZQBPmqFAAQAPAaPG/BBG1BGaABfGLYAaCHPTGPAQATABFHPTAOBNBPAQAPAQAPAQAPAQAPAQAPAQAPAQAPAQATBPAQATDNCTCBATDOAPAQAPAQAPAQATCXAOAXCBATAYATBBDGEBAmGCAABBcABATCYATCPAQATAXATAOATBKJTBXCTBCZPATAQAZANAZADZPAXAQAXAPAQATAPAQATBGJFAGsFBGeBCGFBBGFBBGFBBGCBCYBXAZAaAYBBAaAXDaBBJcCaBBBGLBAGZBAGSBAGBBAGOBBGNBhm6BAABETCBDMsBCaIL0MDaQMBaCBAaMBCaABuasHAhBCAAGcBCGwBOHAMaBDGfMDBIGTLAGHLABEGlHEBEGdBATAGjBDGHTALEBpCnDnmNBAABBKJBFCjBDDjBDGnBHGzBKTACKBACOBACGBACBBADKBADOBADGBADBhCBAAm2EAABIGVBJGHBXFFBAFpBAFIhEBAAGFBBGABAGrBAGBBCGABBGWBATAMHGWaBMGGeBHMIBvGSBAGBBEMEGVMFBCTAGZBETAB/G3BDMBGBMPBBMtGAHCBAHBBEHDGDBAGCBAGcBBHCBDHAMIBGTIBGGcMBTAGcMCBfGHaAGbHBBDMETGBIG1BCTGGVBBMHGSBEMHGRBGTDBLMGhPBAAmIBAAB2CyBMDyBGMFGjHDBHKJhlEAAMeBAGpBAHBOABBGBhKBAAHCGcMJGABHGVHKMDTEBVGRHDTDBlGUMGBTGWBIIAHAIAG0HOTGBDMTKJHAGBHBGABIHCIAGsICHDIBHBTBcATDHABJcABBGYBGKJBFHCGjHEIAHHBAKJTDGAIBGABHGiHATBGABIHBIAGvICHIIBGDTDHDTAIAHAKJGATAGATCBAMTBKGRBAGYICHCIBHAIAHBTFHAGBHAB9GGBAGABAGDBAGOBAGJTABFGuHAICHHBEKJBFHBIBBAGHBBGBBBGVBAGGBAGBBAGEBAHBGAIBHAIDBBIBBBICBBGABFIABEGEIBBBHGBCHEhKCAAG0ICHHIBHCIAHAGDTEKJTBBATAHAGCBdGvICHFIAHAIDHBIAHBGBTAGABHKJhlCAAGuICHDBBIDHBIAHBTWGDHBBhGvICHHIBHAIAHBTCGABKKJBFTMBSGqHAIAHAIBHFIAHAGATABFKJB1GaBBHCIBHDIAHEBDKJMBTCaAGGh4CAAGrICHIIAHBTAhjBAACfDfKJMIBLGHBBGABBGHBAGBBAGXIFBAIBBBHBIAHAGAIAGAIAHATCBIKJhFBAAGHBBGmICHDBBHBIDHAGATAGAIABaGAHJGnHFIAGAHDTHHABHGAHFIBHCGtHMIAHBTCGATEBMmIBAABGTJh1DAAGIBAGkIAHGBAHFIAHAGATEBJKJMSBCTBGdBBHVBAIAHGIAHBIAHBhIBAAGGBAGBBAGlHFBCHABAHBBAHGGAHABHKJBFGFBAGBBAGfIEBAHBBAIBHAIAHAGABGKJh1EAAGSHBIBTBBGHBGAIAGMBAGhIBHEBCIBHAIAHATMKJhVBAAGABOMUaHYDaQBMTAmZOAAhlBAAruBAABATEBKmDDAAhLpAAmgBAATBBMmvQAAcPHAGFHOhp+AAmGJAAh4GCAm4IAABGGeBAKJBDTBmOBAABAKJBFGdBBHETABJGvHGTEaDFDTAaABJKJBAMGBAGUBEGShvKAACfDfMWTDhkBAAmKBAABDHAGAI2BGHDFMB/FBTAFAHABKIBBNm3fBABHmVTAABpGIhmLCAFDBAFGBAFBBAmiEAABOGABcGCBBGABNGDBHmLGAAhDkAAmqBAABEGMBCGIBGGJBBaAHBTAcDhbJBAHtBBHWBI6zBAAB761DAABJamBBa7IBHCaCIFcHHHaBHGadHDa8BU6BBAAHCaAh5BAAMTBLMTBL6WBAABIMYhGCAACZDZCZDGBADRCZDZCABACBBBCABBCBBBCDBACHDDBADABADGBADKCZDZCBBACDBBCHBACGBADZCBBACDBACEBACABCCGBADZCZDZCZDZCZDZCZDZCZDZCZDbBBCYXADYXADFCYXADYXADFCYXADYXADFCYXADYXADFCYXADYXADFCADABBKx6/HAAH2aDHxaHHAaNHAaBTEBOHEBAHOhPRAADJGADTBFDFhUDAAHGBAHQBBHGBAHBBAHEBEF9BgHAhvBAAGsBCHGFGBBKJBDGAaAh/EAAGdHABQGrHDKJBEYAhPHAAGaFAHDKJhlLAAGGBAGDBAGBBAGOBAmEDAABBMIHGBoChDhHGFABDKJBDTBhQMAAM6aAMCYAMDhLBAAMsaAMOhBDAAGDBAGaBAGBBAGABBGABAGJBAGDBAGABAGABFGABDGABAGABAGABAGCBAGBBAGABBGABAGABAGABAGABAGABAGBBAGABBGDBAGGBAGDBAGDBAGABAGJBAGQBEGCBAGEBAGQBzXBhNEAAarBD6jBAABLaOBBaOBAaOBAakBJMM6gCAAB3acBMarBDaIBGaBBNaFhZCAA66DAAZE6XLAABDaQBCaMBC62BAABD6eBAABFaLBDaABOaLBDa3BHaJBFanBHadBBaBhNBAA6TFAABLaNBBaMBCaIBGatBAaGBHaNBDaIBGaIBG6SCAABAa2BkKJhFQAAmfbKABfm5ABABFmdDAABBmBaBABNmw0BAhewAAmdIAAhhXAAmKNBABEmfBBAhQxtCcABd8fBAAh/BAAnvDAAhP4PA99/PABB99/PA");
  function L$1(A2) {
    return 32 === A2 || 9 === A2 || 10 === A2 || 13 === A2;
  }
  const X = [B$1(S$1(":")), a$1(S$1("A"), S$1("Z")), B$1(S$1("_")), a$1(S$1("a"), S$1("z")), a$1(192, 214), a$1(216, 246), a$1(192, 214), a$1(216, 246), a$1(248, 767), a$1(880, 893), a$1(895, 8191), a$1(8204, 8205), a$1(8304, 8591), a$1(11264, 12271), a$1(12289, 55295), a$1(63744, 64975), a$1(65008, 65533), a$1(65536, 983039)].reduce(t$1), Z = [X, B$1(S$1("-")), B$1(S$1(".")), a$1(S$1("0"), S$1("9")), B$1(183), a$1(768, 879), a$1(8255, 8256)].reduce(t$1), O = x$1.get("Nd"), k$1 = b$1(O), N$1 = y$1(a$1(0, 1114111), [x$1.get("P"), x$1.get("Z"), x$1.get("C")].reduce(t$1)), v$1 = b$1(N$1);
  function w$1(A2) {
    return 10 !== A2 && 13 !== A2 && !K$1(A2);
  }
  const Y = { s: L$1, S: b$1(L$1), i: X, I: b$1(X), c: Z, C: b$1(Z), d: O, D: k$1, w: N$1, W: v$1 }, U = C$1("*"), j$1 = C$1("\\"), R = C$1("{"), V = C$1("}"), W = C$1("["), q$1 = C$1("]"), z$1 = C$1("^"), $$1 = C$1("$"), _ = C$1(","), AA = C$1("-"), BA = C$1("("), aA = C$1(")"), nA = C$1("."), eA = C$1("|"), tA = C$1("+"), GA = C$1("?"), iA = C$1("-["), rA = S$1("0");
  function oA(A2) {
    function e2(A3) {
      return new Set(A3.split("").map((A4) => S$1(A4)));
    }
    function G2(A3, B2) {
      const a2 = A3.codePointAt(B2);
      return void 0 === a2 ? H$1(B2, ["any character"]) : o$1(B2 + String.fromCodePoint(a2).length, a2);
    }
    const i2 = "xpath" === A2.language ? T(j$1, c$1([u$1(C$1("n"), () => 10), u$1(C$1("r"), () => 13), u$1(C$1("t"), () => 9), u$1(c$1([j$1, eA, nA, AA, z$1, GA, U, tA, R, V, $$1, BA, aA, W, q$1]), (A3) => S$1(A3))])) : T(j$1, c$1([u$1(C$1("n"), () => 10), u$1(C$1("r"), () => 13), u$1(C$1("t"), () => 9), u$1(c$1([j$1, eA, nA, AA, z$1, GA, U, tA, R, V, BA, aA, W, q$1]), (A3) => S$1(A3))]));
    function r2(A3, B2) {
      const a2 = e2(B2);
      return I$1(C$1(A3), D$1(s$1(G2, (A4) => a2.has(A4), B2.split(""))), (A4, B3) => function(A5) {
        const B4 = x$1.get(A5);
        if (null == B4) throw new Error(A5 + " is not a valid unicode category");
        return B4;
      }(null === B3 ? A4 : A4 + String.fromCodePoint(B3)));
    }
    const l2 = c$1([r2("L", "ultmo"), r2("M", "nce"), r2("N", "dlo"), r2("P", "cdseifo"), r2("Z", "slp"), r2("S", "mcko"), r2("C", "cfon")]), p2 = [a$1(S$1("a"), S$1("z")), a$1(S$1("A"), S$1("Z")), a$1(S$1("0"), S$1("9")), B$1(45)].reduce(t$1), M2 = c$1([l2, u$1(T(C$1("Is"), /* @__PURE__ */ function(A3) {
      return (B2, a2) => {
        const n2 = A3(B2, a2);
        return n2.success ? o$1(n2.offset, B2.slice(a2, n2.offset)) : n2;
      };
    }(d$1(s$1(G2, p2, ["block identifier"])))), (B2) => function(A3, B3) {
      const a2 = Q.get(A3);
      if (void 0 === a2) {
        if (B3) return n$1;
        throw new Error(`The unicode block identifier "${A3}" is not known.`);
      }
      return a2;
    }(B2, "xpath" !== A2.language))]), J2 = E$1(C$1("\\p{"), M2, V, true), K2 = u$1(E$1(C$1("\\P{"), M2, V, true), b$1), L2 = T(j$1, u$1(c$1("sSiIcCdDwW".split("").map((A3) => C$1(A3))), (A3) => Y[A3])), X2 = u$1(nA, () => w$1), Z2 = c$1([L2, J2, K2]), O2 = e2("\\[]"), k2 = c$1([i2, s$1(G2, (A3) => !O2.has(A3), ["unescaped character"])]), N2 = c$1([u$1(AA, () => null), k2]), v2 = I$1(N2, T(AA, N2), a$1);
    function oA2(A3, B2) {
      return [A3].concat(B2 || []);
    }
    const lA2 = u$1(/* @__PURE__ */ function(A3) {
      return (B2, a2) => {
        const n2 = A3(B2, a2);
        return n2.success ? o$1(a2, n2.value) : n2;
      };
    }(c$1([q$1, iA])), () => null), HA2 = S$1("-"), CA = c$1([u$1(F$1(F$1(AA, g$1(W, ["not ["])), lA2), () => HA2), T(g$1(AA, ["not -"]), k2)]), uA = c$1([I$1(u$1(CA, B$1), c$1([function(A3, B2) {
      return uA(A3, B2);
    }, lA2]), oA2), I$1(c$1([v2, Z2]), c$1([cA, lA2]), oA2)]);
    const sA = c$1([I$1(u$1(k2, B$1), c$1([uA, lA2]), oA2), I$1(c$1([v2, Z2]), c$1([cA, lA2]), oA2)]);
    function cA(A3, B2) {
      return sA(A3, B2);
    }
    const DA = u$1(sA, (A3) => A3.reduce(t$1)), mA = u$1(T(z$1, DA), b$1), IA = I$1(c$1([T(g$1(z$1, ["not ^"]), DA), mA]), D$1(T(AA, function(A3, B2) {
      return dA(A3, B2);
    })), y$1), dA = E$1(W, IA, q$1, true);
    const hA = "xpath" === A2.language ? c$1([u$1(i2, B$1), Z2, dA, X2, u$1(z$1, () => (A3) => -1 === A3), u$1($$1, () => (A3) => -2 === A3)]) : c$1([u$1(i2, B$1), Z2, dA, X2]), pA = "xpath" === A2.language ? e2(".\\?*+{}()|^$[]") : e2(".\\?*+{}()|[]"), TA = s$1(G2, (A3) => !pA.has(A3), ["NormalChar"]), FA = u$1(T(j$1, I$1(u$1(s$1(G2, a$1(S$1("1"), S$1("9")), ["digit"]), (A3) => A3 - rA), m$1(u$1(s$1(G2, a$1(rA, S$1("9")), ["digit"]), (A3) => A3 - rA)), (A3, B2) => {
      B2.reduce((A4, B3) => 10 * A4 + B3, A3);
    })), (A3) => {
      throw new Error("Backreferences in XPath patterns are not yet implemented.");
    }), EA = "xpath" === A2.language ? c$1([u$1(TA, (A3) => ({ kind: "predicate", value: B$1(A3) })), u$1(hA, (A3) => ({ kind: "predicate", value: A3 })), u$1(E$1(BA, T(D$1(C$1("?:")), SA), aA, true), (A3) => ({ kind: "regexp", value: A3 })), FA]) : c$1([u$1(TA, (A3) => ({ kind: "predicate", value: B$1(A3) })), u$1(hA, (A3) => ({ kind: "predicate", value: A3 })), u$1(E$1(BA, SA, aA, true), (A3) => ({ kind: "regexp", value: A3 }))]), gA = u$1(d$1(u$1(s$1(G2, a$1(rA, S$1("9")), ["digit"]), (A3) => A3 - rA)), (A3) => A3.reduce((A4, B2) => 10 * A4 + B2)), fA = c$1([I$1(gA, T(_, gA), (A3, B2) => {
      if (B2 < A3) throw new Error("quantifier range is in the wrong order");
      return { min: A3, max: B2 };
    }), I$1(gA, _, (A3) => ({ min: A3, max: null })), u$1(gA, (A3) => ({ min: A3, max: A3 }))]), PA = "xpath" === A2.language ? I$1(c$1([u$1(GA, () => ({ min: 0, max: 1 })), u$1(U, () => ({ min: 0, max: null })), u$1(tA, () => ({ min: 1, max: null })), E$1(R, fA, V, true)]), D$1(GA), (A3, B2) => A3) : c$1([u$1(GA, () => ({ min: 0, max: 1 })), u$1(U, () => ({ min: 0, max: null })), u$1(tA, () => ({ min: 1, max: null })), E$1(R, fA, V, true)]), MA = m$1(I$1(EA, u$1(D$1(PA), (A3) => null === A3 ? { min: 1, max: 1 } : A3), (A3, B2) => [A3, B2])), JA = I$1(MA, m$1(T(eA, f$1(MA))), (A3, B2) => [A3].concat(B2));
    function SA(A3, B2) {
      return JA(A3, B2);
    }
    const KA = function(A3) {
      return I$1(A3, P$1, h$1);
    }(JA);
    return function(A3) {
      let B2;
      try {
        B2 = KA(A3, 0);
      } catch (B3) {
        throw new Error(`Error parsing pattern "${A3}": ${B3 instanceof Error ? B3.message : B3}`);
      }
      return B2.success ? B2.value : function(A4, B3, a2) {
        const n2 = a2.map((A5) => `"${A5}"`);
        throw new Error(`Error parsing pattern "${A4}" at offset ${B3}: expected ${n2.length > 1 ? "one of " + n2.join(", ") : n2[0]} but found "${A4.slice(B3, B3 + 1)}"`);
      }(A3, B2.offset, B2.expected);
    };
  }
  function lA(A2) {
    return [...A2].map((A3) => A3.codePointAt(0));
  }
  function HA(B2, a2 = { language: "xsd" }) {
    const n2 = oA(a2)(B2), e2 = w$2((A2) => {
      r$1(A2, n2, "xpath" === a2.language), A2.accept();
    });
    return function(A2) {
      const B3 = "xpath" === a2.language ? [-1, ...lA(A2), -2] : lA(A2);
      return e2.execute(B3).success;
    };
  }
  const xspattern = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    compile: HA
  }, Symbol.toStringTag, { value: "Module" }));
  function n(n2, t2) {
    return { success: true, offset: n2, value: t2 };
  }
  function t(t2) {
    return n(t2, void 0);
  }
  function e(n2, t2, e2 = false) {
    return { success: false, offset: n2, expected: t2, fatal: e2 };
  }
  function r(t2) {
    return (r2, u2) => {
      const o2 = u2 + t2.length;
      return r2.slice(u2, o2) === t2 ? n(o2, t2) : e(u2, [t2]);
    };
  }
  function u(n2) {
    return n2 > 65535 ? 2 : 1;
  }
  function o(n2, r2) {
    return (o2, c2) => {
      const f2 = o2.codePointAt(c2);
      return void 0 !== f2 && n2(f2) ? t(c2 + u(f2)) : e(c2, r2);
    };
  }
  function c(n2, r2) {
    return (u2, o2) => {
      const c2 = o2;
      for (; ; ) {
        const t2 = u2.codePointAt(o2);
        if (void 0 === t2) break;
        if (!n2(t2)) break;
        o2 += t2 > 65535 ? 2 : 1;
      }
      return void 0 !== r2 && o2 === c2 ? e(o2, r2) : t(o2);
    };
  }
  function f(n2, t2, e2) {
    return o((e3) => n2 <= e3 && e3 <= t2, e2 || [`${String.fromCodePoint(n2)}-${String.fromCodePoint(t2)}`]);
  }
  function s(n2) {
    return (r2, o2) => {
      let c2 = n2;
      for (; c2 > 0; ) {
        const n3 = r2.codePointAt(o2);
        if (void 0 === n3) return e(o2, ["any character"]);
        o2 += u(n3), c2 -= 1;
      }
      return t(o2);
    };
  }
  function i(t2, e2) {
    return (r2, u2) => {
      const o2 = t2(r2, u2);
      return o2.success ? n(o2.offset, e2(o2.value)) : o2;
    };
  }
  function l(n2) {
    return i(n2, () => {
    });
  }
  function a(n2, t2, r2, u2) {
    return (o2, c2) => {
      const f2 = n2(o2, c2);
      return f2.success ? t2(f2.value) ? f2 : e(c2, r2, u2) : f2;
    };
  }
  function d(n2, t2) {
    return (r2, u2) => {
      let o2 = null;
      for (const e2 of n2) {
        const n3 = e2(r2, u2);
        if (n3.success) return n3;
        if (null === o2 || n3.offset > o2.offset ? o2 = n3 : n3.offset === o2.offset && void 0 === t2 && (o2.expected = o2.expected.concat(n3.expected)), n3.fatal) return n3;
      }
      return t2 = t2 || (null == o2 ? void 0 : o2.expected) || [], o2 && (o2.expected = t2), o2 || e(u2, t2);
    };
  }
  function v(t2) {
    return (e2, r2) => {
      const u2 = t2(e2, r2);
      return u2.success || u2.fatal ? u2 : n(r2, null);
    };
  }
  function p(t2) {
    return (e2, r2) => {
      let u2 = [], o2 = r2;
      for (; ; ) {
        const n2 = t2(e2, o2);
        if (!n2.success) {
          if (n2.fatal) return n2;
          break;
        }
        if (u2.push(n2.value), n2.offset === o2) break;
        o2 = n2.offset;
      }
      return n(o2, u2);
    };
  }
  function x(n2) {
    return (e2, r2) => {
      let u2 = r2;
      for (; ; ) {
        const t2 = n2(e2, u2);
        if (!t2.success) {
          if (t2.fatal) return t2;
          break;
        }
        if (t2.offset === u2) break;
        u2 = t2.offset;
      }
      return t(u2);
    };
  }
  function y(n2) {
    return i(n2, (n3) => n3.filter((n4) => void 0 !== n4));
  }
  function b(t2, e2, r2) {
    return (u2, o2) => {
      const c2 = t2(u2, o2);
      if (!c2.success) return c2;
      const f2 = e2(u2, c2.offset);
      return f2.success ? n(f2.offset, r2(c2.value, f2.value)) : f2;
    };
  }
  function h(...t2) {
    return (e2, r2) => {
      const u2 = [];
      for (const n2 of t2) {
        const t3 = n2(e2, r2);
        if (!t3.success) return t3;
        r2 = t3.offset, u2.push(t3.value);
      }
      return n(r2, u2);
    };
  }
  function k(...n2) {
    return (e2, r2) => {
      for (const t2 of n2) {
        const n3 = t2(e2, r2);
        if (!n3.success) return n3;
        r2 = n3.offset;
      }
      return t(r2);
    };
  }
  function P(n2) {
    return b(n2, p(n2), (n3, t2) => [n3].concat(t2));
  }
  function g(n2, t2) {
    return n2;
  }
  function A(n2, t2) {
    return t2;
  }
  function m(n2) {
    return b(n2, x(n2), A);
  }
  function C(n2, t2) {
    return b(n2, t2, A);
  }
  function S(n2, t2) {
    return b(n2, t2, g);
  }
  function $(n2, t2, e2, r2 = false) {
    return C(n2, r2 ? D(S(t2, e2)) : S(t2, e2));
  }
  function j(t2) {
    return (e2, r2) => {
      const u2 = t2(e2, r2);
      return u2.success ? n(u2.offset, e2.slice(r2, u2.offset)) : u2;
    };
  }
  function q(t2) {
    return (e2, r2) => {
      const u2 = t2(e2, r2);
      return u2.success ? n(r2, u2.value) : u2;
    };
  }
  function w(n2, r2) {
    return (u2, o2) => n2(u2, o2).success ? e(o2, r2) : t(o2);
  }
  function z(n2, t2, e2) {
    return C(w(t2, e2), n2);
  }
  function B(n2, t2, r2 = 0, u2 = []) {
    return (o2, c2) => {
      const f2 = o2.codePointAt(c2 + r2);
      if (void 0 === f2) return e(c2, u2);
      const s2 = n2[f2];
      return void 0 === s2 ? void 0 === t2 ? e(c2, u2) : t2(o2, c2) : s2(o2, c2);
    };
  }
  function D(n2) {
    return (t2, r2) => {
      const u2 = n2(t2, r2);
      return u2.success ? u2 : e(u2.offset, u2.expected, true);
    };
  }
  const E = (n2, r2) => 0 === r2 ? t(r2) : e(r2, ["start of input"]), F = (n2, r2) => n2.length === r2 ? t(r2) : e(r2, ["end of input"]);
  function G(n2) {
    return b(n2, F, g);
  }
  function H(n2) {
    const t2 = [];
    let e2 = n2.next();
    for (; !e2.done; ) t2.push(e2.value), e2 = n2.next();
    return [t2, e2.value];
  }
  function I(n2) {
    return function* (t2, e2) {
      const r2 = n2(t2, e2);
      return r2.success && (yield r2.value), r2;
    };
  }
  function J(n2, t2) {
    return function* (e2, r2) {
      const u2 = yield* n2(e2, r2);
      return u2.success ? yield* t2(e2, u2.offset) : u2;
    };
  }
  function K(n2) {
    return function* (t2, e2) {
      const r2 = n2(t2, e2);
      let u2 = r2.next();
      for (; !u2.done; ) {
        const n3 = u2.value;
        void 0 !== n3 && (yield n3), u2 = r2.next();
      }
      return u2.value;
    };
  }
  function L(n2) {
    return function* (e2, r2) {
      for (; ; ) {
        const [u2, o2] = H(n2(e2, r2));
        if (!o2.success) return o2.fatal ? o2 : t(r2);
        if (yield* u2, r2 === o2.offset) return t(r2);
        r2 = o2.offset;
      }
    };
  }
  function M(n2) {
    return function* (e2, r2) {
      const [u2, o2] = H(n2(e2, r2));
      return o2.success ? (yield* u2, o2) : o2.fatal ? o2 : t(r2);
    };
  }
  function N(n2) {
    return function* (t2, e2) {
      const r2 = yield* n2(t2, e2);
      return r2.success ? F(t2, r2.offset) : r2;
    };
  }
  const prsc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    codepoint: o,
    codepoints: c,
    collect: H,
    complete: G,
    consume: l,
    cut: D,
    delimited: $,
    dispatch: B,
    end: F,
    error: e,
    except: z,
    filter: a,
    filterUndefined: y,
    first: g,
    followed: S,
    map: i,
    not: w,
    ok: t,
    okWithValue: n,
    optional: v,
    or: d,
    peek: q,
    plus: P,
    plusConsumed: m,
    preceded: C,
    range: f,
    recognize: j,
    second: A,
    sequence: h,
    sequenceConsumed: k,
    skipChars: s,
    star: p,
    starConsumed: x,
    start: E,
    streaming: I,
    streamingComplete: N,
    streamingFilterUndefined: K,
    streamingOptional: M,
    streamingStar: L,
    streamingThen: J,
    then: b,
    token: r
  }, Symbol.toStringTag, { value: "Module" }));
  const fontoxpath = (function(xspattern2, prsc2) {
    const VERSION = "3.33.2";
    const fontoxpathGlobal = {};
    function aa(a2, b2) {
      if (!("0" !== a2 && "-0" !== a2 || "0" !== b2 && "-0" !== b2)) return 0;
      var c2 = /(?:\+|(-))?(\d+)?(?:\.(\d+))?/;
      a2 = c2.exec(a2 + "");
      var d2 = c2.exec(b2 + ""), e2 = !a2[1];
      const f2 = !d2[1];
      b2 = (a2[2] || "").replace(/^0*/, "");
      c2 = (d2[2] || "").replace(/^0*/, "");
      a2 = a2[3] || "";
      d2 = d2[3] || "";
      if (e2 && !f2) return 1;
      if (!e2 && f2) return -1;
      e2 = e2 && f2;
      if (b2.length > c2.length) return e2 ? 1 : -1;
      if (b2.length < c2.length) return e2 ? -1 : 1;
      if (b2 > c2) return e2 ? 1 : -1;
      if (b2 < c2) return e2 ? -1 : 1;
      b2 = Math.max(a2.length, d2.length);
      c2 = a2.padEnd(b2, "0");
      b2 = d2.padEnd(b2, "0");
      return c2 > b2 ? e2 ? 1 : -1 : c2 < b2 ? e2 ? -1 : 1 : 0;
    }
    function ba(a2, b2) {
      a2 = a2.toString();
      if (-1 < a2.indexOf(".") && 0 === b2) return false;
      a2 = /^[-+]?0*([1-9]\d*)?(?:\.((?:\d*[1-9])*)0*)?$/.exec(a2);
      return a2[2] ? a2[2].length <= b2 : true;
    }
    function da() {
      return function(a2, b2) {
        return 1 > aa(a2, b2);
      };
    }
    function fa() {
      return function(a2, b2) {
        return 0 > aa(a2, b2);
      };
    }
    function ha() {
      return function(a2, b2) {
        return -1 < aa(a2, b2);
      };
    }
    function ia() {
      return function(a2, b2) {
        return 0 < aa(a2, b2);
      };
    }
    function ja(a2, b2) {
      switch (b2) {
        case "required":
          return /(Z)|([+-])([01]\d):([0-5]\d)$/.test(a2.toString());
        case "prohibited":
          return !/(Z)|([+-])([01]\d):([0-5]\d)$/.test(a2.toString());
        case "optional":
          return true;
      }
    }
    function ka(a2) {
      switch (a2) {
        case 1:
        case 0:
        case 6:
        case 3:
          return {};
        case 4:
          return { ka: ba, wa: da(), nc: fa(), xa: ha(), oc: ia() };
        case 18:
          return {};
        case 9:
        case 8:
        case 7:
        case 11:
        case 12:
        case 13:
        case 15:
        case 14:
          return { Ba: ja };
        case 22:
        case 21:
        case 20:
        case 23:
        case 44:
          return {};
        default:
          return null;
      }
    }
    var la = {}, ma = {};
    function na(a2) {
      return /^([+-]?(\d*(\.\d*)?([eE][+-]?\d*)?|INF)|NaN)$/.test(a2);
    }
    function oa(a2) {
      return /^[_:A-Za-z][-._:A-Za-z0-9]*$/.test(a2);
    }
    function pa(a2) {
      return oa(a2) && /^[_A-Za-z]([-._A-Za-z0-9])*$/.test(a2);
    }
    function qa(a2) {
      a2 = a2.split(":");
      return 1 === a2.length ? pa(a2[0]) : 2 !== a2.length ? false : pa(a2[0]) && pa(a2[1]);
    }
    function ra(a2) {
      return !/[\u0009\u000A\u000D]/.test(a2);
    }
    function sa(a2) {
      return pa(a2);
    }
    const ta = /* @__PURE__ */ new Map([
      [45, function() {
        return true;
      }],
      [46, function() {
        return true;
      }],
      [1, function() {
        return true;
      }],
      [0, function(a2) {
        return /^(0|1|true|false)$/.test(a2);
      }],
      [6, function(a2) {
        return na(a2);
      }],
      [3, na],
      [4, function(a2) {
        return /^[+-]?\d*(\.\d*)?$/.test(a2);
      }],
      [18, function(a2) {
        return /^(-)?P(\d+Y)?(\d+M)?(\d+D)?(T(\d+H)?(\d+M)?(\d+(\.\d*)?S)?)?$/.test(a2);
      }],
      [9, function(a2) {
        return /^-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?|(24:00:00(\.0+)?))(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/.test(a2);
      }],
      [8, function(a2) {
        return /^(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?|(24:00:00(\.0+)?))(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/.test(a2);
      }],
      [7, function(a2) {
        return /^-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/.test(a2);
      }],
      [11, function(a2) {
        return /^-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/.test(a2);
      }],
      [12, function(a2) {
        return /^-?([1-9][0-9]{3,}|0[0-9]{3})(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/.test(a2);
      }],
      [13, function(a2) {
        return /^--(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/.test(a2);
      }],
      [15, function(a2) {
        return /^---(0[1-9]|[12][0-9]|3[01])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/.test(a2);
      }],
      [14, function(a2) {
        return /^--(0[1-9]|1[0-2])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/.test(a2);
      }],
      [22, function(a2) {
        return /^([0-9A-Fa-f]{2})*$/.test(a2);
      }],
      [21, function(a2) {
        return new RegExp(/^((([A-Za-z0-9+/] ?){4})*((([A-Za-z0-9+/] ?){3}[A-Za-z0-9+/])|(([A-Za-z0-9+/] ?){2}[AEIMQUYcgkosw048] ?=)|(([A-Za-z0-9+/] ?)[AQgw] ?= ?=)))?$/).test(a2);
      }],
      [20, function() {
        return true;
      }],
      [44, qa],
      [48, ra],
      [52, function(a2) {
        return ra(a2) && !/^ | {2,}| $/.test(a2);
      }],
      [51, function(a2) {
        return /^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$/.test(a2);
      }],
      [50, function(a2) {
        return /^[-._:A-Za-z0-9]+$/.test(a2);
      }],
      [25, oa],
      [23, qa],
      [24, pa],
      [42, sa],
      [41, sa],
      [26, function(a2) {
        return pa(a2);
      }],
      [5, function(a2) {
        return /^[+-]?\d+$/.test(a2);
      }],
      [16, function(a2) {
        return /^-?P[0-9]+(Y([0-9]+M)?|M)$/.test(a2);
      }],
      [17, function(a2) {
        return /^-?P([0-9]+D)?(T([0-9]+H)?([0-9]+M)?([0-9]+(\.[0-9]+)?S)?)?$/.test(a2);
      }]
    ]);
    var ua = /* @__PURE__ */ Object.create(null);
    [
      { C: 0, name: 59 },
      { C: 0, name: 46, parent: 59, K: { whiteSpace: "preserve" } },
      { C: 0, name: 19, parent: 46 },
      { C: 0, name: 1, parent: 46 },
      { C: 0, name: 0, parent: 46, K: { whiteSpace: "collapse" } },
      { C: 0, name: 4, parent: 46, K: { whiteSpace: "collapse" } },
      { C: 0, name: 6, parent: 46, K: { whiteSpace: "collapse" } },
      { C: 0, name: 3, parent: 46, K: { whiteSpace: "collapse" } },
      { C: 0, name: 18, parent: 46, K: { whiteSpace: "collapse" } },
      { C: 0, name: 9, parent: 46, K: { Ba: "optional", whiteSpace: "collapse" } },
      { C: 0, name: 8, parent: 46, K: { Ba: "optional", whiteSpace: "collapse" } },
      {
        C: 0,
        name: 7,
        parent: 46,
        K: { Ba: "optional", whiteSpace: "collapse" }
      },
      { C: 0, name: 11, parent: 46, K: { Ba: "optional", whiteSpace: "collapse" } },
      { C: 0, name: 12, parent: 46, K: { Ba: "optional", whiteSpace: "collapse" } },
      { C: 0, name: 13, parent: 46, K: { Ba: "optional", whiteSpace: "collapse" } },
      { C: 0, name: 15, parent: 46, K: { Ba: "optional", whiteSpace: "collapse" } },
      { C: 0, name: 14, parent: 46, K: { Ba: "optional", whiteSpace: "collapse" } },
      { C: 0, name: 22, parent: 46, K: { whiteSpace: "collapse" } },
      { C: 0, name: 21, parent: 46, K: { whiteSpace: "collapse" } },
      { C: 0, name: 20, parent: 46, K: { whiteSpace: "collapse" } },
      { C: 0, name: 23, parent: 46, K: { whiteSpace: "collapse" } },
      { C: 0, name: 44, parent: 46, K: { whiteSpace: "collapse" } },
      { C: 1, name: 10, S: 9, K: { whiteSpace: "collapse", Ba: "required" } },
      { C: 1, name: 48, S: 1, K: { whiteSpace: "replace" } },
      { C: 1, name: 52, S: 48, K: { whiteSpace: "collapse" } },
      { C: 1, name: 51, S: 52, K: { whiteSpace: "collapse" } },
      { C: 1, name: 50, S: 52, K: { whiteSpace: "collapse" } },
      { C: 2, name: 49, type: 50, K: { minLength: 1, whiteSpace: "collapse" } },
      { C: 1, name: 25, S: 52, K: { whiteSpace: "collapse" } },
      { C: 1, name: 24, S: 25, K: { whiteSpace: "collapse" } },
      {
        C: 1,
        name: 42,
        S: 24,
        K: { whiteSpace: "collapse" }
      },
      { C: 1, name: 41, S: 24, K: { whiteSpace: "collapse" } },
      { C: 2, name: 43, type: 41, K: { minLength: 1, whiteSpace: "collapse" } },
      { C: 1, name: 26, S: 24, K: { whiteSpace: "collapse" } },
      { C: 2, name: 40, type: 26, K: { minLength: 1, whiteSpace: "collapse" } },
      { C: 0, name: 5, parent: 4, K: { ka: 0, whiteSpace: "collapse" } },
      { C: 1, name: 27, S: 5, K: { ka: 0, wa: "0", whiteSpace: "collapse" } },
      { C: 1, name: 28, S: 27, K: { ka: 0, wa: "-1", whiteSpace: "collapse" } },
      { C: 1, name: 31, S: 5, K: { ka: 0, wa: "9223372036854775807", xa: "-9223372036854775808", whiteSpace: "collapse" } },
      { C: 1, name: 32, S: 31, K: { ka: 0, wa: "2147483647", xa: "-2147483648", whiteSpace: "collapse" } },
      { C: 1, name: 33, S: 32, K: { ka: 0, wa: "32767", xa: "-32768", whiteSpace: "collapse" } },
      { C: 1, name: 34, S: 33, K: { ka: 0, wa: "127", xa: "-128", whiteSpace: "collapse" } },
      { C: 1, name: 30, S: 5, K: { ka: 0, xa: "0", whiteSpace: "collapse" } },
      { C: 1, name: 36, S: 30, K: { ka: 0, wa: "18446744073709551615", xa: "0", whiteSpace: "collapse" } },
      { C: 1, name: 35, S: 36, K: { ka: 0, wa: "4294967295", xa: "0", whiteSpace: "collapse" } },
      { C: 1, name: 38, S: 35, K: { ka: 0, wa: "65535", xa: "0", whiteSpace: "collapse" } },
      { C: 1, name: 37, S: 38, K: { ka: 0, wa: "255", xa: "0", whiteSpace: "collapse" } },
      { C: 1, name: 29, S: 30, K: { ka: 0, xa: "1", whiteSpace: "collapse" } },
      { C: 1, name: 16, S: 18, K: { whiteSpace: "collapse" } },
      { C: 1, name: 17, S: 18, K: { whiteSpace: "collapse" } },
      { C: 1, name: 60, S: 59 },
      { C: 3, name: 39, Ca: [] },
      { C: 1, name: 61, S: 60 },
      { C: 1, name: 62, S: 60 },
      { C: 0, name: 53, parent: 59 },
      { C: 1, name: 54, S: 53 },
      { C: 1, name: 58, S: 53 },
      { C: 1, name: 47, S: 53 },
      { C: 1, name: 56, S: 53 },
      { C: 1, name: 57, S: 53 },
      { C: 1, name: 55, S: 53 },
      { C: 3, name: 2, Ca: [4, 5, 6, 3] },
      { C: 3, name: 63, Ca: [] }
    ].forEach((a2) => {
      const b2 = a2.name, c2 = a2.K || {};
      switch (a2.C) {
        case 0:
          a2 = a2.parent ? ua[a2.parent] : null;
          var d2 = ta.get(b2) || null;
          ua[b2] = { C: 0, type: b2, Ka: c2, parent: a2, gb: d2, Oa: ka(b2), Ca: [] };
          break;
        case 1:
          a2 = ua[a2.S];
          d2 = ta.get(b2) || null;
          ua[b2] = { C: 1, type: b2, Ka: c2, parent: a2, gb: d2, Oa: a2.Oa, Ca: [] };
          break;
        case 2:
          ua[b2] = { C: 2, type: b2, Ka: c2, parent: ua[a2.type], gb: null, Oa: la, Ca: [] };
          break;
        case 3:
          a2 = a2.Ca.map((e2) => ua[e2]), ua[b2] = { C: 3, type: b2, Ka: c2, parent: null, gb: null, Oa: ma, Ca: a2 };
      }
    });
    function g2(a2, b2) {
      if (!ua[b2]) throw Error("Unknown type");
      return { type: b2, value: a2 };
    }
    var va = g2(true, 0), wa = g2(false, 0);
    var xa = (a2 = "A wrong argument type was specified in a function call.") => Error(`FORG0006: ${a2}`);
    var ya = class {
      constructor(a2, b2) {
        this.done = a2;
        this.value = b2;
      }
    }, p2 = new ya(true);
    function q2(a2) {
      return new ya(false, a2);
    }
    function za(a2, b2) {
      if (3 === b2.C) return !!b2.Ca.find((c2) => za(a2, c2));
      for (; a2; ) {
        if (a2.type === b2.type) return true;
        if (3 === a2.C) return !!a2.Ca.find((c2) => v2(c2.type, b2.type));
        a2 = a2.parent;
      }
      return false;
    }
    function v2(a2, b2) {
      return a2 === b2 ? true : za(ua[a2], ua[b2]);
    }
    var Aa = class {
      constructor(a2) {
        this.o = w2;
        this.h = a2;
        let b2 = -1;
        this.value = { next: () => {
          b2++;
          return b2 >= a2.length ? p2 : q2(a2[b2]);
        } };
      }
      hb() {
        return this;
      }
      filter(a2) {
        let b2 = -1;
        return this.o.create({ next: () => {
          for (b2++; b2 < this.h.length && !a2(this.h[b2], b2, this); ) b2++;
          return b2 >= this.h.length ? p2 : q2(this.h[b2]);
        } });
      }
      first() {
        return this.h[0];
      }
      O() {
        return this.h;
      }
      fa() {
        if (v2(this.h[0].type, 53)) return true;
        throw xa("Cannot determine the effective boolean value of a sequence with a length higher than one.");
      }
      Pa() {
        return this.h.length;
      }
      F() {
        return false;
      }
      oa() {
        return false;
      }
      map(a2) {
        let b2 = -1;
        return this.o.create({ next: () => ++b2 >= this.h.length ? p2 : q2(a2(this.h[b2], b2, this)) }, this.h.length);
      }
      N(a2) {
        return a2(this.h);
      }
      X(a2) {
        return a2.multiple ? a2.multiple(this) : a2.default(this);
      }
    };
    var Ba = class {
      constructor() {
        this.value = { next: () => p2 };
      }
      hb() {
        return this;
      }
      filter() {
        return this;
      }
      first() {
        return null;
      }
      O() {
        return [];
      }
      fa() {
        return false;
      }
      Pa() {
        return 0;
      }
      F() {
        return true;
      }
      oa() {
        return false;
      }
      map() {
        return this;
      }
      N(a2) {
        return a2([]);
      }
      X(a2) {
        return a2.empty ? a2.empty(this) : a2.default(this);
      }
    };
    var Ca = class {
      constructor(a2, b2) {
        this.type = a2;
        this.value = b2;
      }
    };
    const Da = {
      [0]: "xs:boolean",
      [1]: "xs:string",
      [2]: "xs:numeric",
      [3]: "xs:double",
      [4]: "xs:decimal",
      [5]: "xs:integer",
      [6]: "xs:float",
      [7]: "xs:date",
      [8]: "xs:time",
      [9]: "xs:dateTime",
      [10]: "xs:dateTimeStamp",
      [11]: "xs:gYearMonth",
      [12]: "xs:gYear",
      [13]: "xs:gMonthDay",
      [14]: "xs:gMonth",
      [15]: "xs:gDay",
      [16]: "xs:yearMonthDuration",
      [17]: "xs:dayTimeDuration",
      [18]: "xs:duration",
      [19]: "xs:untypedAtomic",
      [20]: "xs:anyURI",
      [21]: "xs:base64Binary",
      [22]: "xs:hexBinary",
      [23]: "xs:QName",
      [24]: "xs:NCName",
      [25]: "xs:Name",
      [26]: "xs:ENTITY",
      [27]: "xs:nonPositiveInteger",
      [28]: "xs:negativeInteger",
      [29]: "xs:positiveInteger",
      [30]: "xs:nonNegativeInteger",
      [31]: "xs:long",
      [32]: "xs:int",
      [33]: "xs:short",
      [34]: "xs:byte",
      [35]: "xs:unsignedInt",
      [36]: "xs:unsignedLong",
      [37]: "xs:unsignedByte",
      [38]: "xs:unsignedShort",
      [39]: "xs:error",
      [40]: "xs:ENTITIES",
      [41]: "xs:IDREF",
      [42]: "xs:ID",
      [43]: "xs:IDREFS",
      [44]: "xs:NOTATION",
      [45]: "xs:anySimpleType",
      [46]: "xs:anyAtomicType",
      [47]: "attribute()",
      [48]: "xs:normalizedString",
      [49]: "xs:NMTOKENS",
      [50]: "xs:NMTOKEN",
      [51]: "xs:language",
      [52]: "xs:token",
      [53]: "node()",
      [54]: "element()",
      [55]: "document-node()",
      [56]: "text()",
      [57]: "processing-instruction()",
      [58]: "comment()",
      [59]: "item()",
      [60]: "function(*)",
      [61]: "map(*)",
      [62]: "array(*)",
      [63]: "none"
    }, Ea = {
      "xs:boolean": 0,
      "xs:string": 1,
      "xs:numeric": 2,
      "xs:double": 3,
      "xs:decimal": 4,
      "xs:integer": 5,
      "xs:float": 6,
      "xs:date": 7,
      "xs:time": 8,
      "xs:dateTime": 9,
      "xs:dateTimeStamp": 10,
      "xs:gYearMonth": 11,
      "xs:gYear": 12,
      "xs:gMonthDay": 13,
      "xs:gMonth": 14,
      "xs:gDay": 15,
      "xs:yearMonthDuration": 16,
      "xs:dayTimeDuration": 17,
      "xs:duration": 18,
      "xs:untypedAtomic": 19,
      "xs:anyURI": 20,
      "xs:base64Binary": 21,
      "xs:hexBinary": 22,
      "xs:QName": 23,
      "xs:NCName": 24,
      "xs:Name": 25,
      "xs:ENTITY": 26,
      "xs:nonPositiveInteger": 27,
      "xs:negativeInteger": 28,
      "xs:positiveInteger": 29,
      "xs:nonNegativeInteger": 30,
      "xs:long": 31,
      "xs:int": 32,
      "xs:short": 33,
      "xs:byte": 34,
      "xs:unsignedInt": 35,
      "xs:unsignedLong": 36,
      "xs:unsignedByte": 37,
      "xs:unsignedShort": 38,
      "xs:error": 39,
      "xs:ENTITIES": 40,
      "xs:IDREF": 41,
      "xs:ID": 42,
      "xs:IDREFS": 43,
      "xs:NOTATION": 44,
      "xs:anySimpleType": 45,
      "xs:anyAtomicType": 46,
      "attribute()": 47,
      "xs:normalizedString": 48,
      "xs:NMTOKENS": 49,
      "xs:NMTOKEN": 50,
      "xs:language": 51,
      "xs:token": 52,
      "node()": 53,
      "element()": 54,
      "document-node()": 55,
      "text()": 56,
      "processing-instruction()": 57,
      "comment()": 58,
      "item()": 59,
      "function(*)": 60,
      "map(*)": 61,
      "array(*)": 62
    };
    function Ha(a2) {
      return 2 === a2.g ? Da[a2.type] + "*" : 1 === a2.g ? Da[a2.type] + "+" : 0 === a2.g ? Da[a2.type] + "?" : Da[a2.type];
    }
    function Ia(a2) {
      if ("none" === a2) throw Error('XPST0051: The type "none" could not be found');
      if (!a2.startsWith("xs:") && 0 <= a2.indexOf(":")) throw Error(`XPST0081: Invalid prefix for input ${a2}`);
      const b2 = Ea[a2];
      if (void 0 === b2) throw Error(`XPST0051: The type "${a2}" could not be found`);
      return b2;
    }
    function Ja(a2) {
      switch (a2[a2.length - 1]) {
        case "*":
          return { type: Ia(a2.substr(0, a2.length - 1)), g: 2 };
        case "?":
          return { type: Ia(a2.substr(0, a2.length - 1)), g: 0 };
        case "+":
          return { type: Ia(a2.substr(0, a2.length - 1)), g: 1 };
        default:
          return { type: Ia(a2), g: 3 };
      }
    }
    function Ka(a2) {
      switch (a2) {
        case "*":
          return 2;
        case "?":
          return 0;
        case "+":
          return 1;
        default:
          return 3;
      }
    }
    function La(a2) {
      const b2 = a2.value;
      if (v2(a2.type, 53)) return true;
      if (v2(a2.type, 0)) return b2;
      if (v2(a2.type, 1) || v2(a2.type, 20) || v2(a2.type, 19)) return 0 !== b2.length;
      if (v2(a2.type, 2)) return !isNaN(b2) && 0 !== b2;
      throw xa(`Cannot determine the effective boolean value of a value with the type ${Da[a2.type]}`);
    }
    function Ma(a2, b2 = 0) {
      a2.h = b2;
    }
    var Na = class {
      constructor(a2, b2 = null) {
        this.D = w2;
        this.value = { next: (c2) => {
          if (null !== this.o && this.h >= this.o) return p2;
          if (void 0 !== this.v[this.h]) return q2(this.v[this.h++]);
          c2 = a2.next(c2);
          if (c2.done) return this.o = this.h, c2;
          if (this.l || 2 > this.h) this.v[this.h] = c2.value;
          this.h++;
          return c2;
        } };
        this.l = false;
        this.v = [];
        this.h = 0;
        this.o = b2;
      }
      hb() {
        return this.D.create(this.O());
      }
      filter(a2) {
        let b2 = -1;
        const c2 = this.value;
        return this.D.create({ next: (d2) => {
          b2++;
          for (d2 = c2.next(d2); !d2.done && !a2(d2.value, b2, this); ) b2++, d2 = c2.next(0);
          return d2;
        } });
      }
      first() {
        if (void 0 !== this.v[0]) return this.v[0];
        const a2 = this.value.next(0);
        Ma(this);
        return a2.done ? null : a2.value;
      }
      O() {
        if (this.h > this.v.length && this.o !== this.v.length) throw Error("Implementation error: Sequence Iterator has progressed.");
        const a2 = this.value;
        this.l = true;
        let b2 = a2.next(0);
        for (; !b2.done; ) b2 = a2.next(0);
        return this.v;
      }
      fa() {
        const a2 = this.value, b2 = this.h;
        Ma(this);
        var c2 = a2.next(0);
        if (c2.done) return Ma(this, b2), false;
        c2 = c2.value;
        if (v2(c2.type, 53)) return Ma(this, b2), true;
        if (!a2.next(0).done) throw xa("Cannot determine the effective boolean value of a sequence with a length higher than one.");
        Ma(this, b2);
        return La(c2);
      }
      Pa(a2 = false) {
        if (null !== this.o) return this.o;
        if (a2) return -1;
        a2 = this.h;
        const b2 = this.O().length;
        Ma(this, a2);
        return b2;
      }
      F() {
        return 0 === this.o ? true : null === this.first();
      }
      oa() {
        if (null !== this.o) return 1 === this.o;
        var a2 = this.value;
        const b2 = this.h;
        Ma(this);
        if (a2.next(0).done) return Ma(this, b2), false;
        a2 = a2.next(0);
        Ma(this, b2);
        return a2.done;
      }
      map(a2) {
        let b2 = 0;
        const c2 = this.value;
        return this.D.create({ next: (d2) => {
          d2 = c2.next(d2);
          return d2.done ? p2 : q2(a2(d2.value, b2++, this));
        } }, this.o);
      }
      N(a2, b2) {
        const c2 = this.value;
        let d2;
        const e2 = [];
        let f2 = true;
        (function() {
          for (let h2 = c2.next(f2 ? 0 : b2); !h2.done; h2 = c2.next(b2)) f2 = false, e2.push(h2.value);
          d2 = a2(e2).value;
        })();
        return this.D.create({ next: () => d2.next(0) });
      }
      X(a2) {
        let b2 = null;
        const c2 = (d2) => {
          b2 = d2.value;
          d2 = d2.Pa(true);
          -1 !== d2 && (this.o = d2);
        };
        return this.D.create({ next: (d2) => {
          if (b2) return b2.next(d2);
          if (this.F()) return c2(a2.empty ? a2.empty(this) : a2.default(this)), b2.next(d2);
          if (this.oa()) return c2(a2.m ? a2.m(this) : a2.default(this)), b2.next(d2);
          c2(a2.multiple ? a2.multiple(this) : a2.default(this));
          return b2.next(d2);
        } });
      }
    };
    var Oa = class {
      constructor(a2) {
        this.v = w2;
        this.h = a2;
        let b2 = false;
        this.value = { next: () => {
          if (b2) return p2;
          b2 = true;
          return q2(a2);
        } };
        this.o = null;
      }
      hb() {
        return this;
      }
      filter(a2) {
        return a2(this.h, 0, this) ? this : this.v.create();
      }
      first() {
        return this.h;
      }
      O() {
        return [this.h];
      }
      fa() {
        null === this.o && (this.o = La(this.h));
        return this.o;
      }
      Pa() {
        return 1;
      }
      F() {
        return false;
      }
      oa() {
        return true;
      }
      map(a2) {
        return this.v.create(a2(this.h, 0, this));
      }
      N(a2) {
        return a2([this.h]);
      }
      X(a2) {
        return a2.m ? a2.m(this) : a2.default(this);
      }
    };
    const Pa = new Ba();
    function Qa(a2 = null, b2 = null) {
      if (null === a2) return Pa;
      if (Array.isArray(a2)) switch (a2.length) {
        case 0:
          return Pa;
        case 1:
          return new Oa(a2[0]);
        default:
          return new Aa(a2);
      }
      return a2.next ? new Na(a2, b2) : new Oa(a2);
    }
    var w2 = { create: Qa, m: (a2) => new Oa(a2), empty: () => Qa(), aa: () => Qa(va), T: () => Qa(wa) };
    function Ra(a2) {
      const b2 = [], c2 = a2.value;
      return () => {
        let d2 = 0;
        return w2.create({ next: () => {
          if (void 0 !== b2[d2]) return b2[d2++];
          const e2 = c2.next(0);
          return e2.done ? e2 : b2[d2++] = e2;
        } });
      };
    }
    var Sa = class {
      constructor(a2, b2, c2) {
        this.namespaceURI = b2 || null;
        this.prefix = a2 || "";
        this.localName = c2;
      }
      za() {
        return this.prefix ? this.prefix + ":" + this.localName : this.localName;
      }
    };
    function Ta(a2, b2) {
      const c2 = a2.value, d2 = b2.map((e2) => null === e2 ? null : Ra(e2));
      b2 = b2.reduce((e2, f2, h2) => {
        null === f2 && e2.push(a2.o[h2]);
        return e2;
      }, []);
      b2 = new Va({ j: b2, arity: b2.length, Ya: true, I: a2.I, localName: "boundFunction", namespaceURI: a2.l, i: a2.s, value: function(e2, f2, h2) {
        const k2 = Array.from(arguments).slice(3), l2 = d2.map((n2) => null === n2 ? k2.shift() : n2());
        return c2.apply(void 0, [e2, f2, h2].concat(l2));
      } });
      return w2.m(b2);
    }
    var Va = class extends Ca {
      constructor({ j: a2, arity: b2, Ya: c2 = false, I: d2 = false, localName: e2, namespaceURI: f2, i: h2, value: k2 }) {
        super(60, null);
        this.value = k2;
        this.I = d2;
        d2 = -1;
        for (k2 = 0; k2 < a2.length; k2++) 4 === a2[k2] && (d2 = k2);
        -1 < d2 && (k2 = Array(b2 - (a2.length - 1)).fill(a2[d2 - 1]), a2 = a2.slice(0, d2).concat(k2));
        this.o = a2;
        this.v = b2;
        this.ia = c2;
        this.D = e2;
        this.l = f2;
        this.s = h2;
      }
      Ya() {
        return this.ia;
      }
    };
    function Wa(a2, b2) {
      const c2 = [];
      2 !== a2 && 1 !== a2 || c2.push("type-1-or-type-2");
      c2.push(`type-${a2}`);
      b2 && c2.push(`name-${b2}`);
      return c2;
    }
    function Xa(a2) {
      const b2 = a2.node.nodeType;
      let c2;
      if (2 === b2 || 1 === b2) c2 = a2.node.localName;
      return Wa(b2, c2);
    }
    function Ya(a2) {
      let b2 = a2.nodeType;
      4 === b2 && (b2 = 3);
      let c2;
      if (2 === b2 || 1 === b2) c2 = a2.localName;
      return Wa(b2, c2);
    }
    var Za = class {
      getAllAttributes(a2, b2 = null) {
        if (1 !== a2.nodeType) return [];
        a2 = Array.from(a2.attributes);
        return null === b2 ? a2 : a2.filter((c2) => Ya(c2).includes(b2));
      }
      getAttribute(a2, b2) {
        return 1 !== a2.nodeType ? null : a2.getAttribute(b2);
      }
      getChildNodes(a2, b2 = null) {
        a2 = Array.from(a2.childNodes);
        return null === b2 ? a2 : a2.filter((c2) => Ya(c2).includes(b2));
      }
      getData(a2) {
        return 2 === a2.nodeType ? a2.value : a2.data;
      }
      getFirstChild(a2, b2 = null) {
        for (a2 = a2.firstChild; a2; a2 = a2.nextSibling) if (null === b2 || Ya(a2).includes(b2)) return a2;
        return null;
      }
      getLastChild(a2, b2 = null) {
        for (a2 = a2.lastChild; a2; a2 = a2.previousSibling) if (null === b2 || Ya(a2).includes(b2)) return a2;
        return null;
      }
      getNextSibling(a2, b2 = null) {
        for (a2 = a2.nextSibling; a2; a2 = a2.nextSibling) if (null === b2 || Ya(a2).includes(b2)) return a2;
        return null;
      }
      getParentNode(a2, b2 = null) {
        return (a2 = 2 === a2.nodeType ? a2.ownerElement : a2.parentNode) ? null === b2 || Ya(a2).includes(b2) ? a2 : null : null;
      }
      getPreviousSibling(a2, b2 = null) {
        for (a2 = a2.previousSibling; a2; a2 = a2.previousSibling) if (null === b2 || Ya(a2).includes(b2)) return a2;
        return null;
      }
    };
    class $a {
      insertBefore(a2, b2, c2) {
        return a2.insertBefore(b2, c2);
      }
      removeAttributeNS(a2, b2, c2) {
        return a2.removeAttributeNS(b2, c2);
      }
      removeChild(a2, b2) {
        return a2.removeChild(b2);
      }
      setAttributeNS(a2, b2, c2, d2) {
        a2.setAttributeNS(b2, c2, d2);
      }
      setData(a2, b2) {
        a2.data = b2;
      }
    }
    var ab = new $a();
    class bb {
      constructor(a2) {
        this.h = a2;
      }
      insertBefore(a2, b2, c2) {
        return this.h.insertBefore(a2, b2, c2);
      }
      removeAttributeNS(a2, b2, c2) {
        return this.h.removeAttributeNS(a2, b2, c2);
      }
      removeChild(a2, b2) {
        return this.h.removeChild(a2, b2);
      }
      setAttributeNS(a2, b2, c2, d2) {
        this.h.setAttributeNS(a2, b2, c2, d2);
      }
      setData(a2, b2) {
        this.h.setData(a2, b2);
      }
    }
    function cb(a2) {
      return void 0 !== a2.Ra;
    }
    function db(a2, b2, c2) {
      let d2 = null;
      b2 && (cb(b2.node) ? d2 = { G: b2.G, offset: c2, parent: b2.node } : b2.G && (d2 = b2.G));
      return { node: a2, G: d2 };
    }
    function eb(a2, b2, c2 = null) {
      return a2.getAllAttributes(b2.node, c2).map((d2) => db(d2, b2, d2.nodeName));
    }
    function fb(a2, b2, c2) {
      b2 = b2.node;
      return cb(b2) ? (a2 = b2.attributes.find((d2) => c2 === d2.name)) ? a2.value : null : (a2 = a2.h.getAttribute(b2, c2)) ? a2 : null;
    }
    function gb(a2, b2, c2 = null) {
      return a2.getChildNodes(b2.node, c2).map((d2, e2) => db(d2, b2, e2));
    }
    function hb(a2, b2) {
      return a2.getData(b2.node);
    }
    function ib(a2, b2, c2 = null) {
      const d2 = b2.node;
      cb(d2) ? a2 = d2.childNodes[0] : ((c2 = a2.h.getFirstChild(d2, c2)) && 10 === c2.nodeType && (c2 = a2.h.getNextSibling(c2)), a2 = c2);
      return a2 ? db(a2, b2, 0) : null;
    }
    function kb(a2, b2, c2 = null) {
      var d2 = b2.node;
      cb(d2) ? (a2 = d2.childNodes.length - 1, d2 = d2.childNodes[a2]) : ((d2 = a2.h.getLastChild(d2, c2)) && 10 === d2.nodeType && (d2 = a2.h.getPreviousSibling(d2)), a2 = a2.getChildNodes(b2.node, c2).length - 1);
      return d2 ? db(d2, b2, a2) : null;
    }
    function x2(a2, b2, c2 = null) {
      const d2 = b2.node, e2 = b2.G;
      if (e2) "number" === typeof e2.offset && d2 === e2.parent.childNodes[e2.offset] || "string" === typeof e2.offset && d2 === e2.parent.attributes.find((f2) => e2.offset === f2.nodeName) ? (a2 = e2.parent, b2 = e2.G) : (a2 = a2.getParentNode(d2, c2), b2 = e2);
      else {
        if (cb(d2)) return null;
        a2 = a2.getParentNode(d2, c2);
        b2 = null;
      }
      return a2 ? { node: a2, G: b2 } : null;
    }
    function lb(a2, b2, c2 = null) {
      const d2 = b2.node;
      let e2, f2, h2;
      const k2 = b2.G;
      if (cb(d2)) k2 && (h2 = k2.offset + 1, e2 = k2.parent.childNodes[h2]);
      else if (k2) h2 = k2.offset + 1, f2 = x2(a2, b2, null), e2 = a2.getChildNodes(f2.node, c2)[h2];
      else {
        for (e2 = d2; e2 && (!(e2 = a2.h.getNextSibling(e2, c2)) || 10 === e2.nodeType); ) ;
        return e2 ? { node: e2, G: null } : null;
      }
      return e2 ? db(e2, f2 || x2(a2, b2, c2), h2) : null;
    }
    function mb(a2, b2, c2 = null) {
      const d2 = b2.node;
      let e2, f2;
      const h2 = b2.G;
      let k2;
      if (cb(d2)) h2 && (k2 = h2.offset - 1, e2 = h2.parent.childNodes[k2]);
      else if (h2) k2 = h2.offset - 1, f2 = x2(a2, b2, null), e2 = a2.getChildNodes(f2.node, c2)[k2];
      else {
        for (e2 = d2; e2 && (!(e2 = a2.h.getPreviousSibling(e2, c2)) || 10 === e2.nodeType); ) ;
        return e2 ? { node: e2, G: null } : null;
      }
      return e2 ? db(e2, f2 || x2(a2, b2, c2), k2) : null;
    }
    var nb = class {
      constructor(a2) {
        this.h = a2;
        this.o = [];
      }
      getAllAttributes(a2, b2 = null) {
        return cb(a2) ? a2.attributes : this.h.getAllAttributes(a2, b2);
      }
      getChildNodes(a2, b2 = null) {
        b2 = cb(a2) ? a2.childNodes : this.h.getChildNodes(a2, b2);
        return 9 === a2.nodeType ? b2.filter((c2) => 10 !== c2.nodeType) : b2;
      }
      getData(a2) {
        return cb(a2) ? 2 === a2.nodeType ? a2.value : a2.data : this.h.getData(a2) || "";
      }
      getParentNode(a2, b2 = null) {
        return this.h.getParentNode(a2, b2);
      }
    };
    var ob = (a2, b2, c2, d2, e2) => e2.N(([f2]) => d2.N(([h2]) => {
      const k2 = f2.value;
      if (0 >= k2 || k2 > h2.h.length) throw Error("FOAY0001: array position out of bounds.");
      return h2.h[k2 - 1]();
    }));
    var pb = class extends Va {
      constructor(a2) {
        super({ value: (b2, c2, d2, e2) => ob(b2, c2, d2, w2.m(this), e2), localName: "get", namespaceURI: "http://www.w3.org/2005/xpath-functions/array", j: [{ type: 5, g: 3 }], arity: 1, i: { type: 59, g: 2 } });
        this.type = 62;
        this.h = a2;
      }
    };
    function qb(a2) {
      switch (a2.node.nodeType) {
        case 2:
          return 47;
        case 1:
          return 54;
        case 3:
        case 4:
          return 56;
        case 7:
          return 57;
        case 8:
          return 58;
        case 9:
          return 55;
        default:
          return 53;
      }
    }
    function rb(a2) {
      return { type: qb(a2), value: a2 };
    }
    function A2(a2, b2) {
      a2 = a2.map((c2) => c2.first());
      return b2(a2);
    }
    function sb(a2, b2) {
      var c2 = v2(a2.type, 1) || v2(a2.type, 20) || v2(a2.type, 19), d2 = v2(b2.type, 1) || v2(b2.type, 20) || v2(b2.type, 19);
      if (c2 && d2) return a2.value === b2.value;
      c2 = v2(a2.type, 4) || v2(a2.type, 3) || v2(a2.type, 6);
      d2 = v2(b2.type, 4) || v2(b2.type, 3) || v2(b2.type, 6);
      if (c2 && d2) return isNaN(a2.value) && isNaN(b2.value) ? true : a2.value === b2.value;
      c2 = v2(a2.type, 0) || v2(a2.type, 22) || v2(a2.type, 18) || v2(a2.type, 23) || v2(a2.type, 44);
      d2 = v2(b2.type, 0) || v2(b2.type, 22) || v2(b2.type, 18) || v2(b2.type, 23) || v2(b2.type, 44);
      return c2 && d2 ? a2.value === b2.value : false;
    }
    var tb = (a2, b2, c2, d2, e2) => A2([d2, e2], ([f2, h2]) => (f2 = f2.h.find((k2) => sb(k2.key, h2))) ? f2.value() : w2.empty());
    var ub = class extends Va {
      constructor(a2) {
        super({ j: [{ type: 59, g: 3 }], arity: 1, localName: "get", namespaceURI: "http://www.w3.org/2005/xpath-functions/map", value: (b2, c2, d2, e2) => tb(b2, c2, d2, w2.m(this), e2), i: { type: 59, g: 2 } });
        this.type = 61;
        this.h = a2;
      }
    };
    function vb(a2, b2) {
      return a2.h() === b2.h() && a2.o() === b2.o();
    }
    var wb = class {
      $a() {
        return 0;
      }
      getHours() {
        return 0;
      }
      getMinutes() {
        return 0;
      }
      ab() {
        return 0;
      }
      h() {
        return 0;
      }
      o() {
        return 0;
      }
      getSeconds() {
        return 0;
      }
      bb() {
        return 0;
      }
      na() {
        return true;
      }
    };
    function xb(a2) {
      var b2 = Math.abs(a2.$a()), c2 = Math.abs(a2.getHours());
      const d2 = Math.abs(a2.getMinutes());
      a2 = Math.abs(a2.getSeconds());
      b2 = `${b2 ? `${b2}D` : ""}`;
      c2 = (c2 ? `${c2}H` : "") + (d2 ? `${d2}M` : "") + (a2 ? `${a2}S` : "");
      return b2 && c2 ? `${b2}T${c2}` : b2 ? b2 : c2 ? `T${c2}` : "T0S";
    }
    var yb = class extends wb {
      constructor(a2) {
        super();
        if (a2 > Number.MAX_SAFE_INTEGER || a2 < Number.MIN_SAFE_INTEGER) throw Error("FODT0002: Number of seconds given to construct DayTimeDuration overflows MAX_SAFE_INTEGER or MIN_SAFE_INTEGER");
        this.ca = a2;
      }
      $a() {
        return Math.trunc(this.ca / 86400);
      }
      getHours() {
        return Math.trunc(this.ca % 86400 / 3600);
      }
      getMinutes() {
        return Math.trunc(this.ca % 3600 / 60);
      }
      o() {
        return this.ca;
      }
      getSeconds() {
        const a2 = this.ca % 60;
        return Object.is(-0, a2) ? 0 : a2;
      }
      na() {
        return Object.is(-0, this.ca) ? false : 0 <= this.ca;
      }
      toString() {
        return (this.na() ? "P" : "-P") + xb(this);
      }
    }, zb = (a2, b2, c2, d2, e2, f2) => {
      a2 = 86400 * a2 + 3600 * b2 + 60 * c2 + d2 + e2;
      return new yb(f2 || 0 === a2 ? a2 : -a2);
    }, Ab = (a2) => (a2 = /^(-)?P(\d+Y)?(\d+M)?(\d+D)?(?:T(\d+H)?(\d+M)?(\d+(\.\d*)?S)?)?$/.exec(a2)) ? zb(a2[4] ? parseInt(a2[4], 10) : 0, a2[5] ? parseInt(a2[5], 10) : 0, a2[6] ? parseInt(a2[6], 10) : 0, a2[7] ? parseInt(a2[7], 10) : 0, a2[8] ? parseFloat(a2[8]) : 0, !a2[1]) : null, Bb = (a2) => {
      a2 = /^(Z)|([+-])([01]\d):([0-5]\d)$/.exec(a2);
      return "Z" === a2[1] ? zb(0, 0, 0, 0, 0, true) : zb(0, a2[3] ? parseInt(a2[3], 10) : 0, a2[4] ? parseInt(a2[4], 10) : 0, 0, 0, "+" === a2[2]);
    };
    function Cb(a2, b2) {
      if (isNaN(b2)) throw Error("FOCA0005: Cannot multiply xs:dayTimeDuration by NaN");
      a2 = a2.ca * b2;
      if (a2 > Number.MAX_SAFE_INTEGER || !Number.isFinite(a2)) throw Error("FODT0002: Value overflow while multiplying xs:dayTimeDuration");
      return new yb(a2 < Number.MIN_SAFE_INTEGER || Object.is(-0, a2) ? 0 : a2);
    }
    function Db(a2) {
      return a2 ? parseInt(a2, 10) : null;
    }
    function Eb(a2) {
      a2 += "";
      const b2 = a2.startsWith("-");
      b2 && (a2 = a2.substring(1));
      return (b2 ? "-" : "") + a2.padStart(4, "0");
    }
    function Fb(a2) {
      return (a2 + "").padStart(2, "0");
    }
    function Hb(a2) {
      a2 += "";
      1 === a2.split(".")[0].length && (a2 = a2.padStart(a2.length + 1, "0"));
      return a2;
    }
    function Ib(a2) {
      return 0 === a2.getHours() && 0 === a2.getMinutes() ? "Z" : (a2.na() ? "+" : "-") + Fb(Math.abs(a2.getHours())) + ":" + Fb(Math.abs(a2.getMinutes()));
    }
    function Jb(a2) {
      var b2 = /^(?:(-?\d{4,}))?(?:--?(\d\d))?(?:-{1,3}(\d\d))?(T)?(?:(\d\d):(\d\d):(\d\d))?(\.\d+)?(Z|(?:[+-]\d\d:\d\d))?$/.exec(a2);
      a2 = b2[1] ? parseInt(b2[1], 10) : null;
      const c2 = Db(b2[2]), d2 = Db(b2[3]), e2 = b2[4], f2 = Db(b2[5]), h2 = Db(b2[6]), k2 = Db(b2[7]), l2 = b2[8] ? parseFloat(b2[8]) : 0;
      b2 = b2[9] ? Bb(b2[9]) : null;
      if (a2 && (-271821 > a2 || 273860 < a2)) throw Error("FODT0001: Datetime year is out of bounds");
      return e2 ? new Kb(a2, c2, d2, f2, h2, k2, l2, b2, 9) : null !== f2 && null !== h2 && null !== k2 ? new Kb(1972, 12, 31, f2, h2, k2, l2, b2, 8) : null !== a2 && null !== c2 && null !== d2 ? new Kb(
        a2,
        c2,
        d2,
        0,
        0,
        0,
        0,
        b2,
        7
      ) : null !== a2 && null !== c2 ? new Kb(a2, c2, 1, 0, 0, 0, 0, b2, 11) : null !== c2 && null !== d2 ? new Kb(1972, c2, d2, 0, 0, 0, 0, b2, 13) : null !== a2 ? new Kb(a2, 1, 1, 0, 0, 0, 0, b2, 12) : null !== c2 ? new Kb(1972, c2, 1, 0, 0, 0, 0, b2, 14) : new Kb(1972, 12, d2, 0, 0, 0, 0, b2, 15);
    }
    function Lb(a2, b2) {
      switch (b2) {
        case 15:
          return new Kb(1972, 12, a2.o, 0, 0, 0, 0, a2.Y, 15);
        case 14:
          return new Kb(1972, a2.h, 1, 0, 0, 0, 0, a2.Y, 14);
        case 12:
          return new Kb(a2.v, 1, 1, 0, 0, 0, 0, a2.Y, 12);
        case 13:
          return new Kb(1972, a2.h, a2.o, 0, 0, 0, 0, a2.Y, 13);
        case 11:
          return new Kb(a2.v, a2.h, 1, 0, 0, 0, 0, a2.Y, 11);
        case 8:
          return new Kb(1972, 12, 31, a2.l, a2.s, a2.D, a2.qa, a2.Y, 8);
        case 7:
          return new Kb(a2.v, a2.h, a2.o, 0, 0, 0, 0, a2.Y, 7);
        default:
          return new Kb(a2.v, a2.h, a2.o, a2.l, a2.s, a2.D, a2.qa, a2.Y, 9);
      }
    }
    function Mb(a2, b2) {
      b2 = a2.Y || b2 || Bb("Z");
      return new Date(Date.UTC(a2.v, a2.h - 1, a2.o, a2.l - b2.getHours(), a2.s - b2.getMinutes(), a2.D, 1e3 * a2.qa));
    }
    var Kb = class {
      constructor(a2, b2, c2, d2, e2, f2, h2, k2, l2 = 9) {
        this.v = a2;
        this.h = b2;
        this.o = c2 + (24 === d2 ? 1 : 0);
        this.l = 24 === d2 ? 0 : d2;
        this.s = e2;
        this.D = f2;
        this.qa = h2;
        this.Y = k2;
        this.type = l2;
      }
      getDay() {
        return this.o;
      }
      getHours() {
        return this.l;
      }
      getMinutes() {
        return this.s;
      }
      getMonth() {
        return this.h;
      }
      getSeconds() {
        return this.D;
      }
      getYear() {
        return this.v;
      }
      toString() {
        switch (this.type) {
          case 9:
            return Eb(this.v) + "-" + Fb(this.h) + "-" + Fb(this.o) + "T" + Fb(this.l) + ":" + Fb(this.s) + ":" + Hb(this.D + this.qa) + (this.Y ? Ib(this.Y) : "");
          case 7:
            return Eb(this.v) + "-" + Fb(this.h) + "-" + Fb(this.o) + (this.Y ? Ib(this.Y) : "");
          case 8:
            return Fb(this.l) + ":" + Fb(this.s) + ":" + Hb(this.D + this.qa) + (this.Y ? Ib(this.Y) : "");
          case 15:
            return "---" + Fb(this.o) + (this.Y ? Ib(this.Y) : "");
          case 14:
            return "--" + Fb(this.h) + (this.Y ? Ib(this.Y) : "");
          case 13:
            return "--" + Fb(this.h) + "-" + Fb(this.o) + (this.Y ? Ib(this.Y) : "");
          case 12:
            return Eb(this.v) + (this.Y ? Ib(this.Y) : "");
          case 11:
            return Eb(this.v) + "-" + Fb(this.h) + (this.Y ? Ib(this.Y) : "");
        }
        throw Error("Unexpected subType");
      }
    };
    function Nb(a2, b2, c2) {
      const d2 = Mb(a2, c2).getTime();
      c2 = Mb(b2, c2).getTime();
      return d2 === c2 ? a2.qa === b2.qa ? 0 : a2.qa > b2.qa ? 1 : -1 : d2 > c2 ? 1 : -1;
    }
    function Ob(a2, b2, c2) {
      return 0 === Nb(a2, b2, c2);
    }
    function Pb(a2, b2, c2) {
      a2 = (Mb(a2, c2).getTime() - Mb(b2, c2).getTime()) / 1e3;
      return new yb(a2);
    }
    function Qb(a2) {
      throw Error(`Not implemented: adding durations to ${Da[a2.type]}`);
    }
    function Rb(a2) {
      throw Error(`Not implemented: subtracting durations from ${Da[a2.type]}`);
    }
    function Sb(a2, b2) {
      if (null === a2) return null;
      switch (typeof a2) {
        case "boolean":
          return a2 ? va : wa;
        case "number":
          return g2(a2, 3);
        case "string":
          return g2(a2, 1);
        case "object":
          if ("nodeType" in a2) return rb({ node: a2, G: null });
          if (Array.isArray(a2)) return new pb(a2.map((c2) => {
            if (void 0 === c2) return () => w2.empty();
            c2 = Sb(c2);
            c2 = null === c2 ? w2.empty() : w2.m(c2);
            return Ra(c2);
          }));
          if (a2 instanceof Date) {
            const c2 = Jb(a2.toISOString());
            return g2(c2, c2.type);
          }
          return new ub(Object.keys(a2).filter((c2) => void 0 !== a2[c2]).map((c2) => {
            var d2 = Sb(a2[c2]);
            d2 = null === d2 ? w2.empty() : w2.m(d2);
            return { key: g2(c2, 1), value: Ra(d2) };
          }));
      }
      throw Error(`Value ${String(a2)} of type "${typeof a2}" is not adaptable to an XPath value.`);
    }
    function Tb(a2, b2) {
      if ("number" !== typeof a2 && ("string" !== typeof a2 || !ta.get(b2)(a2))) throw Error(`Cannot convert JavaScript value '${a2}' to the XPath type ${Da[b2]} since it is not valid.`);
    }
    function Ub(a2, b2, c2) {
      if (null === b2) return null;
      switch (a2) {
        case 0:
          return b2 ? va : wa;
        case 1:
          return g2(b2 + "", 1);
        case 3:
        case 2:
          return Tb(b2, 3), g2(+b2, 3);
        case 4:
          return Tb(b2, a2), g2(+b2, 4);
        case 5:
          return Tb(b2, a2), g2(b2 | 0, 5);
        case 6:
          return Tb(b2, a2), g2(+b2, 6);
        case 7:
        case 8:
        case 9:
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
          if (!(b2 instanceof Date)) throw Error(`The JavaScript value ${b2} with type ${typeof b2} is not a valid type to be converted to an XPath ${Da[a2]}.`);
          return g2(Lb(Jb(b2.toISOString()), a2), a2);
        case 53:
        case 47:
        case 55:
        case 54:
        case 56:
        case 57:
        case 58:
          if ("object" !== typeof b2 || !("nodeType" in b2)) throw Error(`The JavaScript value ${b2} with type ${typeof b2} is not a valid type to be converted to an XPath ${Da[a2]}.`);
          return rb({ node: b2, G: null });
        case 59:
          return Sb(b2);
        case 61:
          return Sb(b2);
        default:
          throw Error(`Values of the type "${Da[a2]}" can not be adapted from JavaScript to equivalent XPath values.`);
      }
    }
    function Vb(a2, b2, c2) {
      if (0 === c2.g) return b2 = Ub(c2.type, b2), null === b2 ? [] : [b2];
      if (2 === c2.g || 1 === c2.g) {
        if (!Array.isArray(b2)) throw Error(`The JavaScript value ${b2} should be an array if it is to be converted to ${Ha(c2)}.`);
        return b2.map((e2) => Ub(c2.type, e2)).filter((e2) => null !== e2);
      }
      const d2 = Ub(c2.type, b2);
      if (null === d2) throw Error(`The JavaScript value ${b2} should be a single entry if it is to be converted to ${Ha(c2)}.`);
      return [d2];
    }
    function Wb(a2, b2, c2 = { type: 59, g: 0 }) {
      return w2.create(Vb(a2, b2, c2));
    }
    var ac = class {
      constructor() {
        this.h = Math.abs(Math.floor(Math.random() * $b) % $b);
      }
    }, $b = 2 ** 32;
    function bc(a2, b2, c2, d2) {
      return new cc({ M: c2, Aa: b2, ta: d2 || a2.ta, ra: a2.ra }, a2.h, a2.o);
    }
    function dc(a2, b2) {
      let c2 = 0;
      const d2 = b2.value;
      return { next: (e2) => {
        e2 = d2.next(e2);
        return e2.done ? p2 : q2(bc(a2, c2++, e2.value, b2));
      } };
    }
    function ec(a2) {
      a2.h.ib || (a2.h.ib = true, a2.h.qb = Jb((/* @__PURE__ */ new Date()).toISOString()), a2.h.vb = Ab("PT0S"));
      return a2.h.qb;
    }
    function fc(a2) {
      a2.h.ib || (a2.h.ib = true, a2.h.qb = Jb((/* @__PURE__ */ new Date()).toISOString()), a2.h.vb = Ab("PT0S"));
      return a2.h.vb;
    }
    function gc(a2, b2 = null) {
      a2 = 29421 * (null !== b2 && void 0 !== b2 ? b2 : a2.o.h) % $b;
      return { rb: Math.floor(a2), $b: a2 / $b };
    }
    function hc(a2, b2) {
      return new cc({ M: a2.M, Aa: a2.Aa, ta: a2.ta, ra: Object.assign(/* @__PURE__ */ Object.create(null), a2.ra, b2) }, a2.h, a2.o);
    }
    var cc = class {
      constructor(a2, b2 = { qb: null, vb: null, ib: false }, c2 = new ac()) {
        this.h = b2;
        this.Aa = a2.Aa;
        this.ta = a2.ta;
        this.M = a2.M;
        this.ra = a2.ra || /* @__PURE__ */ Object.create(null);
        this.o = c2;
      }
    };
    var ic = class {
      constructor(a2, b2, c2, d2, e2, f2, h2, k2, l2) {
        this.debug = a2;
        this.Ha = b2;
        this.h = c2;
        this.Ja = d2;
        this.Ma = e2;
        this.o = f2;
        this.v = h2;
        this.jb = k2;
        this.Ua = l2;
      }
    };
    function jc(a2) {
      let b2 = 0, c2 = null, d2 = true;
      return w2.create({ next: (e2) => {
        for (; b2 < a2.length; ) {
          c2 || (c2 = a2[b2].value, d2 = true);
          const f2 = c2.next(d2 ? 0 : e2);
          d2 = false;
          if (f2.done) b2++, c2 = null;
          else return f2;
        }
        return p2;
      } });
    }
    var kc = (a2, b2, c2) => Error(`FORG0001: Cannot cast ${a2} to ${Da[b2]}${c2 ? `, ${c2}` : ""}`), lc = (a2) => Error(`XPDY0002: ${a2}`), mc = (a2) => Error(`XPTY0004: ${a2}`), nc = (a2) => Error(`FOTY0013: Atomization is not supported for ${Da[a2]}.`), oc = (a2) => Error(`XPST0081: The prefix ${a2} could not be resolved.`);
    function pc(a2, b2) {
      if (v2(a2.type, 46) || v2(a2.type, 19) || v2(a2.type, 0) || v2(a2.type, 4) || v2(a2.type, 3) || v2(a2.type, 6) || v2(a2.type, 5) || v2(a2.type, 2) || v2(a2.type, 23) || v2(a2.type, 1)) return w2.create(a2);
      const c2 = b2.h;
      if (v2(a2.type, 53)) {
        const d2 = a2.value;
        if (2 === d2.node.nodeType || 3 === d2.node.nodeType) return w2.create(g2(hb(c2, d2), 19));
        if (8 === d2.node.nodeType || 7 === d2.node.nodeType) return w2.create(g2(hb(c2, d2), 1));
        const e2 = [];
        (function k2(h2) {
          if (8 !== d2.node.nodeType && 7 !== d2.node.nodeType) {
            var l2 = h2.nodeType;
            3 === l2 || 4 === l2 ? e2.push(c2.getData(h2)) : 1 !== l2 && 9 !== l2 && 11 !== l2 || c2.getChildNodes(h2).forEach((n2) => {
              k2(n2);
            });
          }
        })(d2.node);
        return w2.create(g2(e2.join(""), 19));
      }
      if (v2(a2.type, 60) && !v2(a2.type, 62)) throw nc(a2.type);
      if (v2(a2.type, 62)) return jc(a2.h.map((d2) => qc(d2(), b2)));
      throw Error(`Atomizing ${a2.type} is not implemented.`);
    }
    function qc(a2, b2) {
      let c2 = false;
      const d2 = a2.value;
      let e2 = null;
      return w2.create({ next: () => {
        for (; !c2; ) {
          if (!e2) {
            var f2 = d2.next(0);
            if (f2.done) {
              c2 = true;
              break;
            }
            e2 = pc(f2.value, b2).value;
          }
          f2 = e2.next(0);
          if (f2.done) e2 = null;
          else return f2;
        }
        return p2;
      } });
    }
    function rc(a2) {
      for (a2 = ua[a2]; a2 && 0 !== a2.C; ) a2 = a2.parent;
      return a2 ? a2.type : null;
    }
    function sc(a2, b2) {
      b2 = ua[b2];
      const c2 = b2.Ka;
      if (!c2 || !c2.whiteSpace) return b2.parent ? sc(a2, b2.parent.type) : a2;
      switch (b2.Ka.whiteSpace) {
        case "replace":
          return a2.replace(/[\u0009\u000A\u000D]/g, " ");
        case "collapse":
          return a2.replace(/[\u0009\u000A\u000D]/g, " ").replace(/ {2,}/g, " ").replace(/^ | $/g, "");
      }
      return a2;
    }
    function tc(a2, b2) {
      for (b2 = ua[b2]; b2 && null === b2.gb; ) {
        if (2 === b2.C || 3 === b2.C) return true;
        b2 = b2.parent;
      }
      return b2 ? b2.gb(a2) : true;
    }
    function uc(a2, b2) {
      for (; a2; ) {
        if (a2.Oa && a2.Oa[b2]) return a2.Oa[b2];
        a2 = a2.parent;
      }
      return () => true;
    }
    function vc(a2, b2) {
      let c2 = ua[b2];
      for (; c2; ) {
        if (c2.Ka && !Object.keys(c2.Ka).every((d2) => {
          if ("whiteSpace" === d2) return true;
          const e2 = uc(c2, d2);
          return e2 ? e2(a2, c2.Ka[d2]) : true;
        })) return false;
        c2 = c2.parent;
      }
      return true;
    }
    function wc(a2) {
      return a2 ? 2 === a2.g || 0 === a2.g : true;
    }
    function xc(a2) {
      return a2(1) || a2(19) ? (b2) => ({ u: true, value: g2(b2, 20) }) : () => ({ u: false, error: Error("XPTY0004: Casting not supported from given type to xs:anyURI or any of its derived types.") });
    }
    function yc(a2) {
      return a2(22) ? (b2) => {
        let c2 = "";
        for (let d2 = 0; d2 < b2.length; d2 += 2) c2 += String.fromCharCode(parseInt(b2.substr(d2, 2), 16));
        return { u: true, value: g2(btoa(c2), 21) };
      } : a2(1) || a2(19) ? (b2) => ({ u: true, value: g2(b2, 21) }) : () => ({ error: Error("XPTY0004: Casting not supported from given type to xs:base64Binary or any of its derived types."), u: false });
    }
    function zc(a2) {
      return a2(2) ? (b2) => ({ u: true, value: 0 === b2 || isNaN(b2) ? wa : va }) : a2(1) || a2(19) ? (b2) => {
        switch (b2) {
          case "true":
          case "1":
            return { u: true, value: va };
          case "false":
          case "0":
            return { u: true, value: wa };
          default:
            return { u: false, error: Error("XPTY0004: Casting not supported from given type to xs:boolean or any of its derived types.") };
        }
      } : () => ({ u: false, error: Error("XPTY0004: Casting not supported from given type to xs:boolean or any of its derived types.") });
    }
    function Dc(a2) {
      return a2(9) ? (b2) => ({ u: true, value: g2(Lb(b2, 7), 7) }) : a2(19) || a2(1) ? (b2) => ({ u: true, value: g2(Jb(b2), 7) }) : () => ({ u: false, error: Error("XPTY0004: Casting not supported from given type to xs:date or any of its derived types.") });
    }
    function Ec(a2) {
      return a2(7) ? (b2) => ({ u: true, value: g2(Lb(b2, 9), 9) }) : a2(19) || a2(1) ? (b2) => ({ u: true, value: g2(Jb(b2), 9) }) : () => ({ u: false, error: Error("XPTY0004: Casting not supported from given type to xs:dateTime or any of its derived types.") });
    }
    function Fc(a2) {
      return a2(18) && !a2(16) ? (b2) => ({ u: true, value: g2(b2.Ga, 17) }) : a2(16) ? () => ({ u: true, value: g2(Ab("PT0.0S"), 17) }) : a2(19) || a2(1) ? (b2) => {
        const c2 = Ab(b2);
        return c2 ? { u: true, value: g2(c2, 17) } : { u: false, error: Error(`FORG0001: Can not cast ${b2} to xs:dayTimeDuration`) };
      } : () => ({ u: false, error: Error("XPTY0004: Casting not supported from given type to xs:dayTimeDuration or any of its derived types.") });
    }
    function Gc(a2) {
      return a2(5) ? (b2) => ({ u: true, value: g2(b2, 4) }) : a2(6) || a2(3) ? (b2) => isNaN(b2) || !isFinite(b2) ? { u: false, error: Error(`FOCA0002: Can not cast ${b2} to xs:decimal`) } : Math.abs(b2) > Number.MAX_VALUE ? { u: false, error: Error(`FOAR0002: Can not cast ${b2} to xs:decimal, it is out of bounds for JavaScript numbers`) } : { u: true, value: g2(b2, 4) } : a2(0) ? (b2) => ({ u: true, value: g2(b2 ? 1 : 0, 4) }) : a2(1) || a2(19) ? (b2) => {
        const c2 = parseFloat(b2);
        return !isNaN(c2) || isFinite(c2) ? { u: true, value: g2(c2, 4) } : { u: false, error: Error(`FORG0001: Can not cast ${b2} to xs:decimal`) };
      } : () => ({
        u: false,
        error: Error("XPTY0004: Casting not supported from given type to xs:decimal or any of its derived types.")
      });
    }
    function Hc(a2, b2) {
      return a2(2) ? (c2) => ({ u: true, value: c2 }) : a2(0) ? (c2) => ({ u: true, value: c2 ? 1 : 0 }) : a2(1) || a2(19) ? (c2) => {
        switch (c2) {
          case "NaN":
            return { u: true, value: NaN };
          case "INF":
          case "+INF":
            return { u: true, value: Infinity };
          case "-INF":
            return { u: true, value: -Infinity };
          case "0":
          case "+0":
            return { u: true, value: 0 };
          case "-0":
            return { u: true, value: -0 };
        }
        const d2 = parseFloat(c2);
        return isNaN(d2) ? { u: false, error: kc(c2, b2) } : { u: true, value: d2 };
      } : () => ({ u: false, error: Error(`XPTY0004: Casting not supported from given type to ${b2} or any of its derived types.`) });
    }
    function Ic(a2) {
      const b2 = Hc(a2, 3);
      return (c2) => {
        c2 = b2(c2);
        return c2.u ? { u: true, value: g2(c2.value, 3) } : c2;
      };
    }
    function Jc(a2) {
      const b2 = Math.abs(a2.bb());
      a2 = Math.abs(a2.ab());
      return `${b2 ? `${b2}Y` : ""}${a2 ? `${a2}M` : ""}` || "0M";
    }
    var Kc = class extends wb {
      constructor(a2) {
        super();
        if (a2 > Number.MAX_SAFE_INTEGER || a2 < Number.MIN_SAFE_INTEGER) throw Error("FODT0002: Number of months given to construct YearMonthDuration overflows MAX_SAFE_INTEGER or MIN_SAFE_INTEGER");
        this.ea = a2;
      }
      ab() {
        const a2 = this.ea % 12;
        return 0 === a2 ? 0 : a2;
      }
      h() {
        return this.ea;
      }
      bb() {
        return Math.trunc(this.ea / 12);
      }
      na() {
        return Object.is(-0, this.ea) ? false : 0 <= this.ea;
      }
      toString() {
        return (this.na() ? "P" : "-P") + Jc(this);
      }
    }, Lc = (a2) => {
      var b2 = /^(-)?P(\d+Y)?(\d+M)?(\d+D)?(?:T(\d+H)?(\d+M)?(\d+(\.\d*)?S)?)?$/.exec(a2);
      if (b2) {
        a2 = !b2[1];
        b2 = 12 * (b2[2] ? parseInt(b2[2], 10) : 0) + (b2[3] ? parseInt(b2[3], 10) : 0);
        if (b2 > Number.MAX_SAFE_INTEGER || !Number.isFinite(b2)) throw Error("FODT0002: Value overflow while constructing xs:yearMonthDuration");
        a2 = new Kc(a2 || 0 === b2 ? b2 : -b2);
      } else a2 = null;
      return a2;
    };
    function Mc(a2, b2) {
      if (isNaN(b2)) throw Error("FOCA0005: Cannot multiply xs:yearMonthDuration by NaN");
      a2 = Math.round(a2.ea * b2);
      if (a2 > Number.MAX_SAFE_INTEGER || !Number.isFinite(a2)) throw Error("FODT0002: Value overflow while constructing xs:yearMonthDuration");
      return new Kc(a2 < Number.MIN_SAFE_INTEGER || 0 === a2 ? 0 : a2);
    }
    var Nc = class extends wb {
      constructor(a2, b2) {
        super();
        this.Va = a2;
        this.Ga = b2;
      }
      $a() {
        return this.Ga.$a();
      }
      getHours() {
        return this.Ga.getHours();
      }
      getMinutes() {
        return this.Ga.getMinutes();
      }
      ab() {
        return this.Va.ab();
      }
      h() {
        return this.Va.h();
      }
      o() {
        return this.Ga.o();
      }
      getSeconds() {
        return this.Ga.getSeconds();
      }
      bb() {
        return this.Va.bb();
      }
      na() {
        return this.Va.na() && this.Ga.na();
      }
      toString() {
        const a2 = this.na() ? "P" : "-P", b2 = Jc(this.Va), c2 = xb(this.Ga);
        return "0M" === b2 ? a2 + c2 : "T0S" === c2 ? a2 + b2 : a2 + b2 + c2;
      }
    };
    function Oc(a2) {
      return a2(16) ? (b2) => ({ u: true, value: g2(new Nc(b2, new yb(b2.na() ? 0 : -0)), 18) }) : a2(17) ? (b2) => {
        b2 = new Nc(new Kc(b2.na() ? 0 : -0), b2);
        return { u: true, value: g2(b2, 18) };
      } : a2(18) ? (b2) => ({ u: true, value: g2(b2, 18) }) : a2(19) || a2(1) ? (b2) => {
        var c2;
        return c2 = new Nc(Lc(b2), Ab(b2)), { u: true, value: g2(c2, 18) };
      } : () => ({ u: false, error: Error("XPTY0004: Casting not supported from given type to xs:duration or any of its derived types.") });
    }
    function Pc(a2) {
      const b2 = Hc(a2, 6);
      return (c2) => {
        c2 = b2(c2);
        return c2.u ? { u: true, value: g2(c2.value, 6) } : c2;
      };
    }
    function Qc(a2) {
      return a2(7) || a2(9) ? (b2) => ({ u: true, value: g2(Lb(b2, 15), 15) }) : a2(19) || a2(1) ? (b2) => ({ u: true, value: g2(Jb(b2), 15) }) : () => ({ u: false, error: Error("XPTY0004: Casting not supported from given type to xs:gDay or any of its derived types.") });
    }
    function Rc(a2) {
      return a2(7) || a2(9) ? (b2) => ({ u: true, value: g2(Lb(b2, 14), 14) }) : a2(19) || a2(1) ? (b2) => ({ u: true, value: g2(Jb(b2), 14) }) : () => ({ u: false, error: Error("XPTY0004: Casting not supported from given type to xs:gMonth or any of its derived types.") });
    }
    function Sc(a2) {
      return a2(7) || a2(9) ? (b2) => ({ u: true, value: g2(Lb(b2, 13), 13) }) : a2(19) || a2(1) ? (b2) => ({ u: true, value: g2(Jb(b2), 13) }) : () => ({ u: false, error: Error("XPTY0004: Casting not supported from given type to xs:gMonthDay or any of its derived types.") });
    }
    function Tc(a2) {
      return a2(7) || a2(9) ? (b2) => ({ u: true, value: g2(Lb(b2, 12), 12) }) : a2(19) || a2(1) ? (b2) => ({ u: true, value: g2(Jb(b2), 12) }) : () => ({ u: false, error: Error("XPTY0004: Casting not supported from given type to xs:gYear or any of its derived types.") });
    }
    function Uc(a2) {
      return a2(7) || a2(9) ? (b2) => ({ u: true, value: g2(Lb(b2, 11), 11) }) : a2(19) || a2(1) ? (b2) => ({ u: true, value: g2(Jb(b2), 11) }) : () => ({ u: false, error: Error("XPTY0004: Casting not supported from given type to xs:gYearMonth or any of its derived types.") });
    }
    function Vc(a2) {
      return a2(21) ? (b2) => {
        b2 = atob(b2);
        let c2 = "";
        for (let d2 = 0, e2 = b2.length; d2 < e2; d2++) c2 += Number(b2.charCodeAt(d2)).toString(16);
        return { u: true, value: g2(c2.toUpperCase(), 22) };
      } : a2(1) || a2(19) ? (b2) => ({ u: true, value: g2(b2, 22) }) : () => ({ u: false, error: Error("XPTY0004: Casting not supported from given type to xs:hexBinary or any of its derived types.") });
    }
    function Wc(a2) {
      return a2(0) ? (b2) => ({ u: true, value: g2(b2 ? 1 : 0, 5) }) : a2(2) ? (b2) => {
        const c2 = Math.trunc(b2);
        return !isFinite(c2) || isNaN(c2) ? { u: false, error: Error(`FOCA0002: can not cast ${b2} to xs:integer`) } : Number.isSafeInteger(c2) ? { u: true, value: g2(c2, 5) } : { u: false, error: Error(`FOAR0002: can not cast ${b2} to xs:integer, it is out of bounds for JavaScript numbers.`) };
      } : a2(1) || a2(19) ? (b2) => {
        const c2 = parseInt(b2, 10);
        return isNaN(c2) ? { u: false, error: kc(b2, 5) } : Number.isSafeInteger(c2) ? { u: true, value: g2(c2, 5) } : { u: false, error: Error(`FOCA0003: can not cast ${b2} to xs:integer, it is out of bounds for JavaScript numbers.`) };
      } : () => ({ u: false, error: Error("XPTY0004: Casting not supported from given type to xs:integer or any of its derived types.") });
    }
    const Xc = [3, 6, 4, 5];
    function Yc(a2) {
      var b2 = Zc;
      return (c2) => {
        for (const d2 of Xc) {
          const e2 = b2(a2, d2)(c2);
          if (e2.u) return e2;
        }
        return { u: false, error: Error(`XPTY0004: Casting not supported from "${c2}" given type to xs:numeric or any of its derived types.`) };
      };
    }
    function $c(a2) {
      if (a2(1) || a2(19)) return (b2) => ({ u: true, value: b2 + "" });
      if (a2(20)) return (b2) => ({ u: true, value: b2 });
      if (a2(23)) return (b2) => ({ u: true, value: b2.prefix ? `${b2.prefix}:${b2.localName}` : b2.localName });
      if (a2(44)) return (b2) => ({ u: true, value: b2.toString() });
      if (a2(2)) {
        if (a2(5) || a2(4)) return (b2) => ({ u: true, value: (b2 + "").replace("e", "E") });
        if (a2(6) || a2(3)) return (b2) => isNaN(b2) ? { u: true, value: "NaN" } : isFinite(b2) ? Object.is(b2, -0) ? { u: true, value: "-0" } : { u: true, value: (b2 + "").replace("e", "E").replace("E+", "E") } : { u: true, value: `${0 > b2 ? "-" : ""}INF` };
      }
      return a2(9) || a2(7) || a2(8) || a2(15) || a2(14) || a2(13) || a2(12) || a2(11) ? (b2) => ({ u: true, value: b2.toString() }) : a2(16) ? (b2) => ({ u: true, value: b2.toString() }) : a2(17) ? (b2) => ({ u: true, value: b2.toString() }) : a2(18) ? (b2) => ({ u: true, value: b2.toString() }) : a2(22) ? (b2) => ({ u: true, value: b2.toUpperCase() }) : (b2) => ({ u: true, value: b2 + "" });
    }
    function ad(a2) {
      const b2 = $c(a2);
      return (c2) => {
        c2 = b2(c2);
        return c2.u ? { u: true, value: g2(c2.value, 1) } : c2;
      };
    }
    function bd(a2) {
      return a2(9) ? (b2) => ({ u: true, value: g2(Lb(b2, 8), 8) }) : a2(19) || a2(1) ? (b2) => ({ u: true, value: g2(Jb(b2), 8) }) : () => ({ u: false, error: Error("XPTY0004: Casting not supported from given type to xs:time or any of its derived types.") });
    }
    function cd(a2) {
      const b2 = $c(a2);
      return (c2) => {
        c2 = b2(c2);
        return c2.u ? { u: true, value: g2(c2.value, 19) } : c2;
      };
    }
    function dd(a2) {
      return a2(18) && !a2(17) ? (b2) => ({ u: true, value: g2(b2.Va, 16) }) : a2(17) ? () => ({ u: true, value: g2(Lc("P0M"), 16) }) : a2(19) || a2(1) ? (b2) => {
        const c2 = Lc(b2);
        return c2 ? { u: true, value: g2(c2, 16) } : { u: false, error: kc(b2, 16) };
      } : () => ({ u: false, error: Error("XPTY0004: Casting not supported from given type to xs:yearMonthDuration or any of its derived types.") });
    }
    const ed = [2, 5, 17, 16];
    function Zc(a2, b2) {
      const c2 = (d2) => v2(a2, d2);
      if (39 === b2) return () => ({ u: false, error: Error("FORG0001: Casting to xs:error is always invalid.") });
      switch (b2) {
        case 19:
          return cd(c2);
        case 1:
          return ad(c2);
        case 6:
          return Pc(c2);
        case 3:
          return Ic(c2);
        case 4:
          return Gc(c2);
        case 5:
          return Wc(c2);
        case 2:
          return Yc(a2);
        case 18:
          return Oc(c2);
        case 16:
          return dd(c2);
        case 17:
          return Fc(c2);
        case 9:
          return Ec(c2);
        case 8:
          return bd(c2);
        case 7:
          return Dc(c2);
        case 11:
          return Uc(c2);
        case 12:
          return Tc(c2);
        case 13:
          return Sc(c2);
        case 15:
          return Qc(c2);
        case 14:
          return Rc(c2);
        case 0:
          return zc(c2);
        case 21:
          return yc(c2);
        case 22:
          return Vc(c2);
        case 20:
          return xc(c2);
        case 23:
          throw Error("Casting to xs:QName is not implemented.");
      }
      return () => ({ u: false, error: Error(`XPTY0004: Casting not supported from ${a2} to ${b2}.`) });
    }
    const gd = /* @__PURE__ */ Object.create(null);
    function hd(a2, b2) {
      if (19 === a2 && 1 === b2) return (f2) => ({ u: true, value: g2(f2, 1) });
      if (44 === b2) return () => ({ u: false, error: Error("XPST0080: Casting to xs:NOTATION is not permitted.") });
      if (39 === b2) return () => ({ u: false, error: Error("FORG0001: Casting to xs:error is not permitted.") });
      if (45 === a2 || 45 === b2) return () => ({ u: false, error: Error("XPST0080: Casting from or to xs:anySimpleType is not permitted.") });
      if (46 === a2 || 46 === b2) return () => ({ u: false, error: Error("XPST0080: Casting from or to xs:anyAtomicType is not permitted.") });
      if (v2(a2, 60) && 1 === b2) return () => ({ u: false, error: Error("FOTY0014: Casting from function item to xs:string is not permitted.") });
      if (a2 === b2) return (f2) => ({ u: true, value: { type: b2, value: f2 } });
      const c2 = ed.includes(a2) ? a2 : rc(a2), d2 = ed.includes(b2) ? b2 : rc(b2);
      if (null === d2 || null === c2) return () => ({ u: false, error: Error(`XPST0081: Can not cast: type ${d2 ? Da[a2] : Da[b2]} is unknown.`) });
      const e2 = [];
      1 !== c2 && 19 !== c2 || e2.push((f2) => {
        const h2 = sc(f2, b2);
        return tc(h2, b2) ? { u: true, value: h2 } : { u: false, error: kc(f2, b2, "pattern validation failed.") };
      });
      c2 !== d2 && (e2.push(Zc(c2, d2)), e2.push((f2) => ({
        u: true,
        value: f2.value
      })));
      19 !== d2 && 1 !== d2 || e2.push((f2) => tc(f2, b2) ? { u: true, value: f2 } : { u: false, error: kc(f2, b2, "pattern validation failed.") });
      e2.push((f2) => vc(f2, b2) ? { u: true, value: f2 } : { u: false, error: kc(f2, b2, "pattern validation failed.") });
      e2.push((f2) => ({ u: true, value: { type: b2, value: f2 } }));
      return (f2) => {
        f2 = { u: true, value: f2 };
        for (let h2 = 0, k2 = e2.length; h2 < k2 && (f2 = e2[h2](f2.value), false !== f2.u); ++h2) ;
        return f2;
      };
    }
    function id(a2, b2) {
      const c2 = a2.type + 1e4 * b2;
      let d2 = gd[c2];
      d2 || (d2 = gd[c2] = hd(a2.type, b2));
      return d2.call(void 0, a2.value, b2);
    }
    function jd(a2, b2) {
      a2 = id(a2, b2);
      if (true === a2.u) return a2.value;
      throw a2.error;
    }
    function kd(a2) {
      let b2 = false;
      return { next: () => {
        if (b2) return p2;
        b2 = true;
        return q2(a2);
      } };
    }
    function ld(a2, b2) {
      return a2 === b2 ? true : a2 && b2 && a2.offset === b2.offset && a2.parent === b2.parent ? ld(a2.G, b2.G) : false;
    }
    function md(a2, b2) {
      return a2 === b2 || a2.node === b2.node && ld(a2.G, b2.G) ? true : false;
    }
    function nd(a2, b2, c2) {
      var d2 = x2(a2, b2, null);
      a2 = gb(a2, d2, null);
      for (let e2 = 0, f2 = a2.length; e2 < f2; ++e2) {
        d2 = a2[e2];
        if (md(d2, b2)) return -1;
        if (md(d2, c2)) return 1;
      }
    }
    function od(a2, b2) {
      const c2 = [];
      for (; b2; b2 = x2(a2, b2, null)) c2.unshift(b2);
      return c2;
    }
    function pd(a2, b2) {
      const c2 = [];
      for (; b2; b2 = a2.getParentNode(b2, null)) c2.unshift(b2);
      return c2;
    }
    function qd(a2, b2, c2, d2) {
      if (c2.G || d2.G || cb(c2.node) || cb(d2.node)) {
        if (md(c2, d2)) return 0;
        c2 = od(b2, c2);
        d2 = od(b2, d2);
        const f2 = c2[0], h2 = d2[0];
        if (!md(f2, h2)) return b2 = a2.findIndex((k2) => md(k2, f2)), c2 = a2.findIndex((k2) => md(k2, h2)), -1 === b2 && (b2 = a2.push(f2)), -1 === c2 && (c2 = a2.push(h2)), b2 - c2;
        a2 = 1;
        for (var e2 = Math.min(c2.length, d2.length); a2 < e2 && md(c2[a2], d2[a2]); ++a2) ;
        return c2[a2] ? d2[a2] ? nd(b2, c2[a2], d2[a2]) : 1 : -1;
      }
      c2 = c2.node;
      e2 = d2.node;
      if (c2 === e2) return 0;
      d2 = pd(b2, c2);
      c2 = pd(b2, e2);
      if (d2[0] !== c2[0]) {
        const f2 = { node: d2[0], G: null }, h2 = { node: c2[0], G: null };
        b2 = a2.findIndex((k2) => md(k2, f2));
        c2 = a2.findIndex((k2) => md(k2, h2));
        -1 === b2 && (b2 = a2.push(f2));
        -1 === c2 && (c2 = a2.push(h2));
        return b2 - c2;
      }
      a2 = 1;
      for (e2 = Math.min(d2.length, c2.length); a2 < e2 && d2[a2] === c2[a2]; ++a2) ;
      d2 = d2[a2];
      e2 = c2[a2];
      if (!d2) return -1;
      if (!e2) return 1;
      b2 = b2.getChildNodes(c2[a2 - 1], null);
      for (let f2 = 0, h2 = b2.length; f2 < h2; ++f2) {
        a2 = b2[f2];
        if (a2 === d2) return -1;
        if (a2 === e2) return 1;
      }
    }
    function rd(a2, b2, c2, d2) {
      const e2 = v2(c2.type, 47), f2 = v2(d2.type, 47);
      if (e2 && !f2) {
        if (c2 = x2(b2, c2.value), d2 = d2.value, md(c2, d2)) return 1;
      } else if (f2 && !e2) {
        if (c2 = c2.value, d2 = x2(b2, d2.value), md(c2, d2)) return -1;
      } else if (e2 && f2) {
        if (md(x2(b2, d2.value), x2(b2, c2.value))) return c2.value.node.localName > d2.value.node.localName ? 1 : -1;
        c2 = x2(b2, c2.value);
        d2 = x2(b2, d2.value);
      } else c2 = c2.value, d2 = d2.value;
      return qd(a2, b2, c2, d2);
    }
    function sd(a2, b2, c2) {
      return rd(a2.o, a2, b2, c2);
    }
    function td(a2, b2) {
      return ud(b2, (c2, d2) => rd(a2.o, a2, c2, d2)).filter((c2, d2, e2) => 0 === d2 ? true : !md(c2.value, e2[d2 - 1].value));
    }
    const vd = (a2, b2) => a2 < b2 ? -1 : 0;
    function ud(a2, b2 = vd) {
      if (1 >= a2.length) return a2;
      var c2 = Math.floor(a2.length / 2);
      const d2 = ud(a2.slice(0, c2), b2);
      a2 = ud(a2.slice(c2), b2);
      for (c2 = []; d2.length && a2.length; ) 0 > b2(d2[0], a2[0]) ? c2.push(d2.shift()) : c2.push(a2.shift());
      return c2.concat(d2.concat(a2));
    }
    function wd(a2, b2) {
      if (v2(a2.type, 2)) {
        if (v2(a2.type, 6)) return 3 === b2 ? g2(a2.value, 3) : null;
        if (v2(a2.type, 4)) {
          if (6 === b2) return g2(a2.value, 6);
          if (3 === b2) return g2(a2.value, 3);
        }
        return null;
      }
      return v2(a2.type, 20) && 1 === b2 ? g2(a2.value, 1) : null;
    }
    function xd(a2, b2, c2, d2, e2) {
      if (v2(a2.type, b2.type)) return a2;
      v2(b2.type, 46) && v2(a2.type, 53) && (a2 = pc(a2, c2).first());
      if (v2(a2.type, b2.type) || 46 === b2.type) return a2;
      if (v2(a2.type, 19)) {
        c2 = jd(a2, b2.type);
        if (!c2) throw Error(`XPTY0004 Unable to convert ${e2 ? "return" : "argument"} of type ${Da[a2.type]} to type ${Ha(b2)} while calling ${d2}`);
        return c2;
      }
      c2 = wd(a2, b2.type);
      if (!c2) throw Error(`XPTY0004 Unable to cast ${e2 ? "return" : "argument"} of type ${Da[a2.type]} to type ${Ha(b2)} while calling ${d2}`);
      return c2;
    }
    function yd(a2) {
      switch (a2) {
        case 2:
          return "*";
        case 1:
          return "+";
        case 0:
          return "?";
        case 3:
          return "";
      }
    }
    var zd = (a2, b2, c2, d2, e2) => 0 === a2.g ? b2.X({ default: () => b2.map((f2) => xd(f2, a2, c2, d2, e2)), multiple: () => {
      throw Error(`XPTY0004: Multiplicity of ${e2 ? "function return value" : "function argument"} of type ${Da[a2.type]}${yd(a2.g)} for ${d2} is incorrect. Expected "?", but got "+".`);
    } }) : 1 === a2.g ? b2.X({ empty: () => {
      throw Error(`XPTY0004: Multiplicity of ${e2 ? "function return value" : "function argument"} of type ${Da[a2.type]}${yd(a2.g)} for ${d2} is incorrect. Expected "+", but got "empty-sequence()"`);
    }, default: () => b2.map((f2) => xd(
      f2,
      a2,
      c2,
      d2,
      e2
    )) }) : 2 === a2.g ? b2.map((f2) => xd(f2, a2, c2, d2, e2)) : b2.X({ m: () => b2.map((f2) => xd(f2, a2, c2, d2, e2)), default: () => {
      throw Error(`XPTY0004: Multiplicity of ${e2 ? "function return value" : "function argument"} of type ${Da[a2.type]}${yd(a2.g)} for ${d2} is incorrect. Expected exactly one`);
    } });
    function Ad(a2, b2, c2) {
      return (d2, e2, f2) => {
        if (null === d2.M) throw lc(`The function ${a2} depends on dynamic context, which is absent.`);
        const h2 = zd({ type: b2, g: 3 }, w2.m(d2.M), e2, a2, false);
        return c2(d2, e2, f2, h2);
      };
    }
    var Bd = xspattern2;
    function Cd(a2, b2) {
      return v2(a2, 5) ? g2(b2, 5) : v2(a2, 6) ? g2(b2, 6) : v2(a2, 3) ? g2(b2, 3) : g2(b2, 4);
    }
    const Dd = [{ la: "M", ja: 1e3 }, { la: "CM", ja: 900 }, { la: "D", ja: 500 }, { la: "CD", ja: 400 }, { la: "C", ja: 100 }, { la: "XC", ja: 90 }, { la: "L", ja: 50 }, { la: "XL", ja: 40 }, { la: "X", ja: 10 }, { la: "IX", ja: 9 }, { la: "V", ja: 5 }, { la: "IV", ja: 4 }, { la: "I", ja: 1 }];
    function Ed(a2, b2) {
      const c2 = 0 > a2;
      a2 = Math.abs(a2);
      if (!a2) return "-";
      let d2 = Dd.reduce((e2, f2) => {
        const h2 = Math.floor(a2 / f2.ja);
        a2 -= h2 * f2.ja;
        return e2 + f2.la.repeat(h2);
      }, "");
      b2 && (d2 = d2.toLowerCase());
      c2 && (d2 = `-${d2}`);
      return d2;
    }
    const Fd = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    function Gd(a2, b2) {
      const c2 = 0 > a2;
      a2 = Math.abs(a2);
      if (!a2) return "-";
      let d2 = "", e2;
      for (; 0 < a2; ) e2 = (a2 - 1) % Fd.length, d2 = Fd[e2] + d2, a2 = (a2 - e2) / Fd.length | 0;
      b2 && (d2 = d2.toLowerCase());
      c2 && (d2 = `-${d2}`);
      return d2;
    }
    function Hd(a2, b2, c2 = []) {
      return Array.from({ length: b2 }, (d2, e2) => e2 + a2).filter((d2) => !c2.includes(d2));
    }
    const Id = Hd(1488, 27, [1498, 1501, 1503, 1507, 1509]), Jd = Hd(1575, 36, [1577, 1595, 1596, 1597, 1598, 1599, 1600, 1609]), Kd = "أبجدهوزحطيكلمنسعفصقرشتثخذضظغ".split(""), Ld = [[1e3, "غ"], [900, "ظ"], [800, "ض"], [700, "ذ"], [600, "خ"], [500, "ث"], [400, "ت"], [300, "ش"], [200, "ر"], [100, "ق"], [90, "ص"], [80, "ف"], [70, "ع"], [60, "س"], [
      50,
      "ن"
    ], [40, "م"], [30, "ل"], [20, "ك"], [10, "ي"], [9, "ط"], [8, "ح"], [7, "ز"], [6, "و"], [5, "ه"], [4, "د"], [3, "ج"], [2, "ب"], [1, "أ"]], Md = [[400, "ת"], [300, "ש"], [200, "ר"], [100, "ק"], [90, "צ"], [80, "פ"], [70, "ע"], [60, "ס"], [50, "נ"], [40, "מ"], [30, "ל"], [20, "כ"], [10, "י"], [9, "ט"], [8, "ח"], [7, "ז"], [6, "ו"], [5, "ה"], [4, "ד"], [3, "ג"], [2, "ב"], [1, "א"]];
    function Nd(a2, b2 = []) {
      var c2 = 25;
      b2.sort((d2, e2) => d2 - e2);
      c2 -= b2.length;
      return function(d2) {
        const e2 = 0 > d2;
        d2 = Math.abs(d2);
        if (!d2) return "-";
        const f2 = [];
        for (; 0 < d2; ) {
          let h2 = a2 + (d2 - 1) % c2;
          b2.forEach((k2) => {
            h2 >= k2 && h2++;
          });
          f2.unshift(String.fromCodePoint(h2));
          d2 = Math.floor((d2 - 1) / c2);
        }
        d2 = f2.join("");
        e2 && (d2 = `-${d2}`);
        return d2;
      };
    }
    const Od = Nd(945, [962]), Pd = Nd(913, [930]);
    function Qd(a2) {
      return new Intl.NumberFormat([], { numberingSystem: "arab", useGrouping: false }).format(a2);
    }
    function Rd(a2) {
      return new Intl.NumberFormat([], { numberingSystem: "arabext", useGrouping: false }).format(a2);
    }
    const Sd = /* @__PURE__ */ new Map([["A", function(a2) {
      return Gd(a2, false);
    }], ["a", function(a2) {
      return Gd(a2, true);
    }], ["I", function(a2) {
      return Ed(a2, false);
    }], ["i", function(a2) {
      return Ed(a2, true);
    }], ["lowerGreek", Od], ["α", Od], ["upperGreek", Pd], ["Α", Pd], ["arabicAbjadi", function(a2) {
      const b2 = 0 > a2;
      a2 = Math.abs(a2);
      if (!a2) return "-";
      a2 = Array(Math.floor((a2 - 1) / Kd.length) + 1).fill(Kd[(a2 - 1) % Kd.length]).join(String.fromCodePoint(8204));
      b2 && (a2 = `-${a2}`);
      return a2;
    }], ["arabicAbjadNumeral", function(a2) {
      const b2 = 0 > a2;
      a2 = Math.abs(a2);
      if (!a2) return "-";
      var c2 = [], d2 = Math.floor(a2 / 1e3);
      a2 -= 1e3 * d2;
      if (1 === d2) c2.push(Ld[0][1]);
      else if (1 < d2) {
        for (const [f2, h2] of Ld) {
          var e2 = f2;
          const k2 = h2;
          for (; d2 >= e2; ) c2.push(k2), d2 -= e2;
        }
        c2.push(Ld[0][1]);
      }
      for (const [f2, h2] of Ld) for (d2 = f2, e2 = h2; a2 >= d2; ) a2 -= d2, c2.push(e2);
      c2 = c2.join("");
      b2 && (c2 = `-${c2}`);
      return c2;
    }], ["arabicAlifBaTa", function(a2) {
      const b2 = 0 > a2;
      a2 = Math.abs(a2);
      if (!a2) return "-";
      a2 = Array(Math.floor((a2 - 1) / Jd.length) + 1).fill(String.fromCodePoint(Jd[(a2 - 1) % Jd.length])).join(String.fromCodePoint(8204));
      b2 && (a2 = `-${a2}`);
      return a2;
    }], ["hebrewAlefBet", function(a2) {
      const b2 = 0 > a2;
      a2 = Math.abs(a2);
      if (!a2) return "-";
      var c2 = Math.floor((a2 - 1) / Id.length);
      const d2 = String.fromCodePoint(1514);
      c2 = Array(c2).fill(d2);
      c2.push(String.fromCodePoint(Id[(a2 - 1) % Id.length]));
      a2 = c2.join("");
      b2 && (a2 = `-${a2}`);
      return a2;
    }], ["hebrewNumeral", function(a2) {
      const b2 = 0 > a2;
      a2 = Math.abs(a2);
      if (!a2) return "-";
      var c2 = [], d2 = Math.floor(a2 / 400);
      a2 -= 400 * d2;
      for (var e2 = 0; e2 < d2; e2++) c2.push("ת");
      for (const [f2, h2] of Md) for (d2 = f2, e2 = h2; a2 >= d2; ) a2 -= d2, c2.push(e2);
      a2 = c2.slice(-2).join("");
      "יה" === a2 && c2.splice(-2, 2, "ט", "ו");
      "יו" === a2 && c2.splice(-2, 2, "ט", "ז");
      c2 = c2.join("");
      b2 && (c2 = `-${c2}`);
      return c2;
    }], ["arabicIndicNumeral", Qd], ["١", Qd], ["٢", Qd], ["٣", Qd], ["٤", Qd], ["٥", Qd], ["٦", Qd], ["٧", Qd], ["٨", Qd], ["٩", Qd], ["persianNumeral", Rd], ["۱", Rd], ["۲", Rd], ["۳", Rd], ["۴", Rd], ["۵", Rd], ["۶", Rd], ["۷", Rd], ["۸", Rd], ["۹", Rd]]);
    function Td(a2) {
      if (Math.floor(a2) === a2 || isNaN(a2)) return 0;
      a2 = /\d+(?:\.(\d*))?(?:[Ee](-)?(\d+))*/.exec(`${a2}`);
      const b2 = a2[1] ? a2[1].length : 0;
      if (a2[3]) {
        if (a2[2]) return b2 + parseInt(a2[3], 10);
        a2 = b2 - parseInt(a2[3], 10);
        return 0 > a2 ? 0 : a2;
      }
      return b2;
    }
    function Ud(a2, b2, c2) {
      return b2 && 0 === a2 * c2 % 1 % 0.5 ? 0 === Math.floor(a2 * c2) % 2 ? Math.floor(a2 * c2) / c2 : Math.ceil(a2 * c2) / c2 : Math.round(a2 * c2) / c2;
    }
    function Vd(a2, b2, c2, d2, e2, f2) {
      let h2 = false;
      return w2.create({ next: () => {
        if (h2) return p2;
        const k2 = e2.first();
        if (!k2) return h2 = true, p2;
        if ((v2(k2.type, 6) || v2(k2.type, 3)) && (0 === k2.value || isNaN(k2.value) || Infinity === k2.value || -Infinity === k2.value)) return h2 = true, q2(k2);
        var l2;
        f2 ? l2 = f2.first().value : l2 = 0;
        h2 = true;
        if (Td(k2.value) < l2) return q2(k2);
        const n2 = [5, 4, 3, 6].find((u2) => v2(k2.type, u2)), t2 = jd(k2, 4);
        l2 = Ud(t2.value, a2, Math.pow(10, l2));
        switch (n2) {
          case 4:
            return q2(g2(l2, 4));
          case 3:
            return q2(g2(l2, 3));
          case 6:
            return q2(g2(l2, 6));
          case 5:
            return q2(g2(l2, 5));
        }
      } });
    }
    const Wd = (a2, b2, c2, d2) => qc(d2, b2).X({ empty: () => w2.m(g2(NaN, 3)), m: () => {
      const e2 = id(d2.first(), 3);
      return e2.u ? w2.m(e2.value) : w2.m(g2(NaN, 3));
    }, multiple: () => {
      throw Error("fn:number may only be called with zero or one values");
    } });
    function Xd(a2) {
      let b2 = 5381;
      for (let c2 = 0; c2 < a2.length; ++c2) b2 = 33 * b2 + a2.charCodeAt(c2), b2 %= Number.MAX_SAFE_INTEGER;
      return b2;
    }
    const Yd = (a2, b2, c2, d2 = w2.empty()) => {
      function e2(f2) {
        const h2 = (k2, l2, n2, t2) => {
          if (t2.F() || t2.oa()) return t2;
          k2 = t2.O();
          l2 = f2;
          for (n2 = k2.length - 1; 1 < n2; n2--) {
            l2 = gc(a2, l2).rb;
            t2 = l2 % n2;
            const u2 = k2[t2];
            k2[t2] = k2[n2];
            k2[n2] = u2;
          }
          return w2.create(k2);
        };
        return w2.m(new ub([{ key: g2("number", 1), value: () => w2.m(g2(gc(a2, f2).$b, 3)) }, { key: g2("next", 1), value: () => w2.m(new Va({ value: () => e2(gc(a2, f2).rb), Ya: true, localName: "", namespaceURI: "", j: [], arity: 0, i: { type: 61, g: 3 } })) }, { key: g2("permute", 1), value: () => w2.m(new Va({
          value: h2,
          Ya: true,
          localName: "",
          namespaceURI: "",
          j: [{ type: 59, g: 2 }],
          arity: 1,
          i: { type: 59, g: 2 }
        })) }]));
      }
      b2 = d2.F() ? gc(a2) : gc(a2, Xd(jd(d2.first(), 1).value));
      return e2(b2.rb);
    };
    var Zd = [{ namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "abs", j: [{ type: 2, g: 0 }], i: { type: 2, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.map((e2) => Cd(e2.type, Math.abs(e2.value))) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "format-integer", j: [{ type: 5, g: 0 }, { type: 1, g: 3 }], i: { type: 1, g: 3 }, callFunction: (a2, b2, c2, d2, e2) => {
      a2 = d2.first();
      e2 = e2.first();
      if (d2.F()) return w2.m(g2("", 1));
      d2 = Sd.get(e2.value);
      e2 = a2.value;
      return d2 ? (d2 = d2(e2), w2.m(g2(d2, 1))) : w2.m(g2(e2.toString(), 1));
    } }, {
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      localName: "ceiling",
      j: [{ type: 2, g: 0 }],
      i: { type: 2, g: 0 },
      callFunction: (a2, b2, c2, d2) => d2.map((e2) => Cd(e2.type, Math.ceil(e2.value)))
    }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "floor", j: [{ type: 2, g: 0 }], i: { type: 2, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.map((e2) => Cd(e2.type, Math.floor(e2.value))) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "round", j: [{ type: 2, g: 0 }], i: { type: 2, g: 0 }, callFunction: Vd.bind(null, false) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "round", j: [{
      type: 2,
      g: 0
    }, { type: 5, g: 3 }], i: { type: 2, g: 0 }, callFunction: Vd.bind(null, false) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "round-half-to-even", j: [{ type: 2, g: 0 }], i: { type: 2, g: 0 }, callFunction: Vd.bind(null, true) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "round-half-to-even", j: [{ type: 2, g: 0 }, { type: 5, g: 3 }], i: { type: 2, g: 0 }, callFunction: Vd.bind(null, true) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "number", j: [{ type: 46, g: 0 }], i: { type: 3, g: 3 }, callFunction: Wd }, {
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      localName: "number",
      j: [],
      i: { type: 3, g: 3 },
      callFunction: (a2, b2, c2) => {
        const d2 = a2.M && zd({ type: 46, g: 0 }, w2.m(a2.M), b2, "fn:number", false);
        if (!d2) throw lc("fn:number needs an atomizable context item.");
        return Wd(a2, b2, c2, d2);
      }
    }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "random-number-generator", j: [], i: { type: 61, g: 3 }, callFunction: Yd }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "random-number-generator", j: [{ type: 46, g: 0 }], i: { type: 61, g: 3 }, callFunction: Yd }];
    function $d() {
      throw Error("FOCH0002: No collations are supported");
    }
    const ae = (a2, b2, c2, d2) => d2.X({ empty: () => w2.m(g2("", 1)), default: () => d2.map((e2) => {
      if (v2(e2.type, 53)) {
        const f2 = pc(e2, b2).first();
        return v2(e2.type, 47) ? jd(f2, 1) : f2;
      }
      return jd(e2, 1);
    }) }), be = (a2, b2, c2, d2, e2) => A2([e2], ([f2]) => qc(d2, b2).N((h2) => {
      h2 = h2.map((k2) => jd(k2, 1).value).join(f2.value);
      return w2.m(g2(h2, 1));
    })), ce = (a2, b2, c2, d2) => {
      if (d2.F()) return w2.m(g2(0, 5));
      a2 = d2.first().value;
      return w2.m(g2(Array.from(a2).length, 5));
    }, ee = (a2, b2, c2, d2, e2, f2) => {
      const h2 = Vd(false, a2, b2, c2, e2, null), k2 = null !== f2 ? Vd(false, a2, b2, c2, f2, null) : null;
      let l2 = false, n2 = null, t2 = null, u2 = null;
      return w2.create({ next: () => {
        if (l2) return p2;
        if (!n2 && (n2 = d2.first(), null === n2)) return l2 = true, q2(g2("", 1));
        t2 || (t2 = h2.first());
        !u2 && f2 && (u2 = null, u2 = k2.first());
        l2 = true;
        return q2(g2(Array.from(n2.value).slice(Math.max(t2.value - 1, 0), f2 ? t2.value + u2.value - 1 : void 0).join(""), 1));
      } });
    }, ge = (a2, b2, c2, d2, e2) => {
      if (d2.F() || 0 === d2.first().value.length) return w2.empty();
      a2 = d2.first().value;
      e2 = e2.first().value;
      e2 = fe(e2);
      e2.lastIndex = 0;
      b2 = [];
      c2 = e2.exec(a2);
      for (d2 = 0; c2; ) b2.push(a2.slice(d2, c2.index)), d2 = e2.lastIndex, c2 = e2.exec(a2);
      b2.push(a2.slice(d2));
      return w2.create(b2.map((f2) => g2(f2, 1)));
    }, he = (a2, b2, c2, d2) => {
      if (d2.F()) return w2.m(g2(
        "",
        1
      ));
      a2 = d2.first().value.trim();
      return w2.m(g2(a2.replace(/\s+/g, " "), 1));
    }, ie = /* @__PURE__ */ new Map(), je = /* @__PURE__ */ new Map();
    function fe(a2) {
      if (je.has(a2)) return je.get(a2);
      let b2;
      try {
        b2 = new RegExp(a2, "g");
      } catch (c2) {
        throw Error(`FORX0002: ${c2}`);
      }
      if (b2.test("")) throw Error(`FORX0003: the pattern ${a2} matches the zero length string`);
      je.set(a2, b2);
      return b2;
    }
    var ke = [{ namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "compare", j: [{ type: 1, g: 0 }, { type: 1, g: 0 }], i: { type: 5, g: 0 }, callFunction: (a2, b2, c2, d2, e2) => {
      if (d2.F() || e2.F()) return w2.empty();
      a2 = d2.first().value;
      e2 = e2.first().value;
      return a2 > e2 ? w2.m(g2(1, 5)) : a2 < e2 ? w2.m(g2(-1, 5)) : w2.m(g2(0, 5));
    } }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "compare", j: [{ type: 1, g: 0 }, { type: 1, g: 0 }, { type: 1, g: 3 }], i: { type: 5, g: 0 }, callFunction: $d }, {
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      localName: "concat",
      j: [{ type: 46, g: 0 }, { type: 46, g: 0 }, 4],
      i: { type: 1, g: 3 },
      callFunction: (a2, b2, c2, ...d2) => {
        d2 = d2.map((e2) => qc(e2, b2).N((f2) => w2.m(g2(f2.map((h2) => null === h2 ? "" : jd(h2, 1).value).join(""), 1))));
        return A2(d2, (e2) => w2.m(g2(e2.map((f2) => f2.value).join(""), 1)));
      }
    }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "contains", j: [{ type: 1, g: 0 }, { type: 1, g: 0 }, { type: 1, g: 0 }], i: { type: 0, g: 3 }, callFunction: $d }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "contains", j: [{ type: 1, g: 0 }, { type: 1, g: 0 }], i: { type: 0, g: 3 }, callFunction: (a2, b2, c2, d2, e2) => {
      a2 = d2.F() ? "" : d2.first().value;
      e2 = e2.F() ? "" : e2.first().value;
      return 0 === e2.length ? w2.aa() : 0 === a2.length ? w2.T() : a2.includes(e2) ? w2.aa() : w2.T();
    } }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "ends-with", j: [{ type: 1, g: 0 }, { type: 1, g: 0 }], i: { type: 0, g: 3 }, callFunction: (a2, b2, c2, d2, e2) => {
      a2 = e2.F() ? "" : e2.first().value;
      if (0 === a2.length) return w2.aa();
      d2 = d2.F() ? "" : d2.first().value;
      return 0 === d2.length ? w2.T() : d2.endsWith(a2) ? w2.aa() : w2.T();
    } }, {
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      localName: "ends-with",
      j: [{ type: 1, g: 0 }, { type: 1, g: 0 }, { type: 1, g: 3 }],
      i: { type: 0, g: 3 },
      callFunction: $d
    }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "normalize-space", j: [{ type: 1, g: 0 }], i: { type: 1, g: 3 }, callFunction: he }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "normalize-space", j: [], i: { type: 1, g: 3 }, callFunction: Ad("normalize-space", 1, (a2, b2, c2, d2) => he(a2, b2, c2, ae(a2, b2, c2, d2))) }, {
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      localName: "starts-with",
      j: [{ type: 1, g: 0 }, { type: 1, g: 0 }],
      i: { type: 0, g: 3 },
      callFunction: (a2, b2, c2, d2, e2) => {
        a2 = e2.F() ? "" : e2.first().value;
        if (0 === a2.length) return w2.aa();
        d2 = d2.F() ? "" : d2.first().value;
        return 0 === d2.length ? w2.T() : d2.startsWith(a2) ? w2.aa() : w2.T();
      }
    }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "starts-with", j: [{ type: 1, g: 0 }, { type: 1, g: 0 }, { type: 1, g: 3 }], i: { type: 0, g: 3 }, callFunction: $d }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "string", j: [{ type: 59, g: 0 }], i: { type: 1, g: 3 }, callFunction: ae }, {
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      localName: "string",
      j: [],
      i: { type: 1, g: 3 },
      callFunction: Ad("string", 59, ae)
    }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "substring-before", j: [{ type: 1, g: 0 }, { type: 1, g: 0 }], i: { type: 1, g: 3 }, callFunction: (a2, b2, c2, d2, e2) => {
      a2 = d2.F() ? "" : d2.first().value;
      e2 = e2.F() ? "" : e2.first().value;
      if ("" === e2) return w2.m(g2("", 1));
      e2 = a2.indexOf(e2);
      return -1 === e2 ? w2.m(g2("", 1)) : w2.m(g2(a2.substring(0, e2), 1));
    } }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "substring-after", j: [{ type: 1, g: 0 }, { type: 1, g: 0 }], i: {
      type: 1,
      g: 3
    }, callFunction: (a2, b2, c2, d2, e2) => {
      a2 = d2.F() ? "" : d2.first().value;
      e2 = e2.F() ? "" : e2.first().value;
      if ("" === e2) return w2.m(g2(a2, 1));
      b2 = a2.indexOf(e2);
      return -1 === b2 ? w2.m(g2("", 1)) : w2.m(g2(a2.substring(b2 + e2.length), 1));
    } }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "substring", j: [{ type: 1, g: 0 }, { type: 3, g: 3 }], i: { type: 1, g: 3 }, callFunction: ee }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "substring", j: [{ type: 1, g: 0 }, { type: 3, g: 3 }, { type: 3, g: 3 }], i: { type: 1, g: 3 }, callFunction: ee }, {
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      localName: "upper-case",
      j: [{ type: 1, g: 0 }],
      i: { type: 1, g: 3 },
      callFunction: (a2, b2, c2, d2) => d2.F() ? w2.m(g2("", 1)) : d2.map((e2) => g2(e2.value.toUpperCase(), 1))
    }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "lower-case", j: [{ type: 1, g: 0 }], i: { type: 1, g: 3 }, callFunction: (a2, b2, c2, d2) => d2.F() ? w2.m(g2("", 1)) : d2.map((e2) => g2(e2.value.toLowerCase(), 1)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "string-join", j: [{ type: 46, g: 2 }, { type: 1, g: 3 }], i: { type: 1, g: 3 }, callFunction: be }, {
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      localName: "string-join",
      j: [{ type: 46, g: 2 }],
      i: { type: 1, g: 3 },
      callFunction(a2, b2, c2, d2) {
        return be(a2, b2, c2, d2, w2.m(g2("", 1)));
      }
    }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "string-length", j: [{ type: 1, g: 0 }], i: { type: 5, g: 3 }, callFunction: ce }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "string-length", j: [], i: { type: 5, g: 3 }, callFunction: Ad("string-length", 46, (a2, b2, c2, d2) => ce(a2, b2, c2, ae(a2, b2, c2, d2))) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "tokenize", j: [{
      type: 1,
      g: 0
    }, { type: 1, g: 3 }, { type: 1, g: 3 }], i: { type: 1, g: 2 }, callFunction() {
      throw Error("Not implemented: Using flags in tokenize is not supported");
    } }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "tokenize", j: [{ type: 1, g: 0 }, { type: 1, g: 3 }], i: { type: 1, g: 2 }, callFunction: ge }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "tokenize", j: [{ type: 1, g: 0 }], i: { type: 1, g: 2 }, callFunction(a2, b2, c2, d2) {
      return ge(a2, b2, c2, he(a2, b2, c2, d2), w2.m(g2(" ", 1)));
    } }, { j: [{ type: 1, g: 0 }, { type: 1, g: 3 }, { type: 1, g: 3 }], callFunction: (a2, b2, c2, d2, e2, f2) => A2([d2, e2, f2], ([h2, k2, l2]) => {
      h2 = Array.from(h2 ? h2.value : "");
      const n2 = Array.from(k2.value), t2 = Array.from(l2.value);
      k2 = h2.map((u2) => {
        if (n2.includes(u2)) {
          if (u2 = n2.indexOf(u2), u2 <= t2.length) return t2[u2];
        } else return u2;
      });
      return w2.m(g2(k2.join(""), 1));
    }), localName: "translate", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 1, g: 3 } }, { j: [{ type: 5, g: 2 }], callFunction: (a2, b2, c2, d2) => d2.N((e2) => {
      e2 = e2.map((f2) => {
        f2 = f2.value;
        if (9 === f2 || 10 === f2 || 13 === f2 || 32 <= f2 && 55295 >= f2 || 57344 <= f2 && 65533 >= f2 || 65536 <= f2 && 1114111 >= f2) return String.fromCodePoint(f2);
        throw Error("FOCH0001");
      }).join("");
      return w2.m(g2(e2, 1));
    }), localName: "codepoints-to-string", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 1, g: 3 } }, { j: [{ type: 1, g: 0 }], callFunction: (a2, b2, c2, d2) => A2([d2], ([e2]) => {
      e2 = e2 ? e2.value.split("") : [];
      return 0 === e2.length ? w2.empty() : w2.create(e2.map((f2) => g2(f2.codePointAt(0), 5)));
    }), localName: "string-to-codepoints", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 5, g: 2 } }, { j: [{ type: 1, g: 0 }], callFunction: (a2, b2, c2, d2) => A2([d2], ([e2]) => null === e2 || 0 === e2.value.length ? w2.create(g2("", 1)) : w2.create(g2(encodeURIComponent(e2.value).replace(/[!'()*]/g, (f2) => "%" + f2.charCodeAt(0).toString(16).toUpperCase()), 1))), localName: "encode-for-uri", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 1, g: 3 } }, {
      j: [{ type: 1, g: 0 }],
      callFunction: (a2, b2, c2, d2) => A2([d2], ([e2]) => null === e2 || 0 === e2.value.length ? w2.create(g2("", 1)) : w2.create(g2(e2.value.replace(/([\u00A0-\uD7FF\uE000-\uFDCF\uFDF0-\uFFEF "<>{}|\\^`/\n\u007f\u0080-\u009f]|[\uD800-\uDBFF][\uDC00-\uDFFF])/g, (f2) => encodeURI(f2)), 1))),
      localName: "iri-to-uri",
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      i: { type: 1, g: 3 }
    }, { j: [{ type: 1, g: 0 }, { type: 1, g: 0 }], callFunction: (a2, b2, c2, d2, e2) => A2([d2, e2], ([f2, h2]) => {
      if (null === f2 || null === h2) return w2.empty();
      f2 = f2.value;
      var k2 = h2.value;
      if (f2.length !== k2.length) return w2.T();
      h2 = f2.split("");
      f2 = k2.split("");
      for (k2 = 0; k2 < h2.length; k2++) if (h2[k2].codePointAt(0) !== f2[k2].codePointAt(0)) return w2.T();
      return w2.aa();
    }), localName: "codepoint-equal", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 0, g: 0 } }, { j: [{ type: 1, g: 0 }, { type: 1, g: 3 }], callFunction: (a2, b2, c2, d2, e2) => A2([d2, e2], ([f2, h2]) => {
      f2 = f2 ? f2.value : "";
      h2 = h2.value;
      let k2 = ie.get(h2);
      if (!k2) {
        try {
          k2 = (0, Bd.compile)(h2, { language: "xpath" });
        } catch (l2) {
          throw Error(`FORX0002: ${l2}`);
        }
        ie.set(h2, k2);
      }
      return k2(f2) ? w2.aa() : w2.T();
    }), localName: "matches", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 0, g: 3 } }, { j: [{ type: 1, g: 0 }, { type: 1, g: 3 }, { type: 1, g: 3 }], callFunction: (a2, b2, c2, d2, e2, f2) => A2([d2, e2, f2], ([h2, k2, l2]) => {
      h2 = h2 ? h2.value : "";
      k2 = k2.value;
      l2 = l2.value;
      if (l2.includes("$0")) throw Error("Using $0 in fn:replace to replace substrings with full matches is not supported.");
      l2 = l2.split(/((?:\$\$)|(?:\\\$)|(?:\\\\))/).map((n2) => {
        switch (n2) {
          case "\\$":
            return "$$";
          case "\\\\":
            return "\\";
          case "$$":
            throw Error('FORX0004: invalid replacement: "$$"');
          default:
            return n2;
        }
      }).join("");
      k2 = fe(k2);
      h2 = h2.replace(k2, l2);
      return w2.m(g2(h2, 1));
    }), localName: "replace", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 1, g: 3 } }, { j: [{ type: 1, g: 0 }, { type: 1, g: 3 }, { type: 1, g: 3 }, { type: 1, g: 3 }], localName: "replace", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 1, g: 3 }, callFunction() {
      throw Error("Not implemented: Using flags in replace is not supported");
    } }];
    const le = /* @__PURE__ */ new WeakMap();
    let me = 0;
    const ne = (a2, b2, c2, d2) => A2([d2], ([e2]) => {
      if (null === e2) return w2.empty();
      e2 = e2.value;
      switch (e2.node.nodeType) {
        case 1:
        case 2:
          return w2.m(g2(new Sa(e2.node.prefix, e2.node.namespaceURI, e2.node.localName), 23));
        case 7:
          return w2.m(g2(new Sa("", "", e2.node.target), 23));
        default:
          return w2.empty();
      }
    }), oe = (a2, b2, c2, d2) => d2.X({ default: () => ae(a2, b2, c2, ne(a2, b2, c2, d2)), empty: () => w2.m(g2("", 1)) }), pe = (a2, b2, c2, d2) => qc(d2, b2), qe = (a2, b2, c2, d2) => {
      if (d2.F()) return w2.m(g2("", 1));
      if (!v2(d2.first().type, 53)) throw Error("XPTY0004: The context item must be a node.");
      c2 = d2.first().value;
      a2 = w2;
      b2 = a2.m;
      c2 = c2.node;
      le.has(c2) || le.set(c2, `id${++me}`);
      c2 = le.get(c2);
      return b2.call(a2, g2(c2, 1));
    }, re = (a2, b2, c2, d2) => A2([d2], ([e2]) => {
      e2 = e2 ? e2.value : null;
      return null !== e2 && ib(b2.h, e2, null) ? w2.aa() : w2.T();
    });
    function se(a2, b2) {
      a2 = a2.toLowerCase();
      b2 = b2.toLowerCase();
      return a2 === b2 ? true : 5 > a2.length || !a2.startsWith(b2) ? false : se(a2.replace(/-[a-z0-9]+$/, ""), b2);
    }
    const te = (a2, b2, c2, d2, e2) => {
      b2 = b2.h;
      if (d2.F()) d2 = "";
      else if (v2(d2.first().type, 1)) d2 = d2.first().value;
      else throw Error("XPTY0004: The first argument of lang must be a string.");
      if (e2) e2 = e2.first().value;
      else {
        if (!a2 || !a2.M) throw lc("The function lang depends on dynamic context if a node is not passed as the second argument.");
        if (!v2(a2.M.type, 53)) throw Error("XPTY0004: The context item must be a node.");
        e2 = a2.M.value;
      }
      a: {
        for (a2 = d2; e2; ) if (1 !== e2.node.nodeType) e2 = x2(b2, e2);
        else if (1 === e2.node.nodeType) {
          if (d2 = fb(b2, e2, "xml:lang")) {
            b2 = se(
              d2,
              a2
            ) ? w2.aa() : w2.T();
            break a;
          }
          e2 = x2(b2, e2);
        }
        b2 = w2.T();
      }
      return b2;
    }, ue = (a2, b2, c2, d2) => A2([d2], ([e2]) => {
      function f2(n2) {
        let t2 = 0, u2 = n2;
        for (; null !== u2; ) (n2.node.nodeType !== u2.node.nodeType ? 0 : 1 === u2.node.nodeType ? u2.node.localName === n2.node.localName && u2.node.namespaceURI === n2.node.namespaceURI : 7 === u2.node.nodeType ? u2.node.target === n2.node.target : 1) && t2++, u2 = mb(h2, u2, null);
        return t2;
      }
      if (null === e2) return w2.empty();
      const h2 = b2.h;
      let k2 = "";
      for (e2 = e2.value; null !== x2(b2.h, e2, null); e2 = x2(b2.h, e2, null)) switch (e2.node.nodeType) {
        case 1:
          var l2 = e2;
          k2 = `/Q{${l2.node.namespaceURI || ""}}${l2.node.localName}[${f2(l2)}]${k2}`;
          break;
        case 2:
          l2 = e2;
          k2 = `/@${l2.node.namespaceURI ? `Q{${l2.node.namespaceURI}}` : ""}${l2.node.localName}${k2}`;
          break;
        case 3:
          k2 = `/text()[${f2(e2)}]${k2}`;
          break;
        case 7:
          l2 = e2;
          k2 = `/processing-instruction(${l2.node.target})[${f2(l2)}]${k2}`;
          break;
        case 8:
          k2 = `/comment()[${f2(e2)}]${k2}`;
      }
      return 9 === e2.node.nodeType ? w2.create(g2(k2 || "/", 1)) : w2.create(g2("Q{http://www.w3.org/2005/xpath-functions}root()" + k2, 1));
    }), ve = (a2, b2, c2, d2) => d2.map((e2) => g2(e2.value.node.namespaceURI || "", 20)), we = (a2, b2, c2, d2) => d2.X({ default: () => d2.map((e2) => 7 === e2.value.node.nodeType ? g2(e2.value.node.target, 1) : g2(e2.value.node.localName || "", 1)), empty: () => w2.m(g2("", 1)) });
    function xe(a2, b2, c2) {
      if (2 === b2.node.nodeType) return md(b2, c2);
      for (; c2; ) {
        if (md(b2, c2)) return true;
        if (9 === c2.node.nodeType) break;
        c2 = x2(a2, c2, null);
      }
      return false;
    }
    const ye = (a2, b2, c2, d2) => d2.map((e2) => {
      if (!v2(e2.type, 53)) throw Error("XPTY0004 Argument passed to fn:root() should be of the type node()");
      let f2;
      for (e2 = e2.value; e2; ) f2 = e2, e2 = x2(b2.h, f2, null);
      return rb(f2);
    });
    var ze = [{ j: [{ type: 53, g: 0 }], callFunction: oe, localName: "name", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 1, g: 3 } }, { j: [], callFunction: Ad("name", 53, oe), localName: "name", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 1, g: 3 } }, { j: [{ type: 53, g: 3 }], callFunction: ve, localName: "namespace-uri", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 20, g: 3 } }, {
      j: [],
      callFunction: Ad("namespace-uri", 53, ve),
      localName: "namespace-uri",
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      i: { type: 20, g: 3 }
    }, { j: [{ type: 53, g: 2 }], callFunction: (a2, b2, c2, d2) => d2.N((e2) => {
      if (!e2.length) return w2.empty();
      e2 = td(b2.h, e2).reduceRight((f2, h2, k2, l2) => {
        if (k2 === l2.length - 1) return f2.push(h2), f2;
        if (xe(b2.h, h2.value, f2[0].value)) return f2;
        f2.unshift(h2);
        return f2;
      }, []);
      return w2.create(e2);
    }), localName: "innermost", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 53, g: 2 } }, { j: [{ type: 53, g: 2 }], callFunction: (a2, b2, c2, d2) => d2.N((e2) => {
      if (!e2.length) return w2.empty();
      e2 = td(b2.h, e2).reduce((f2, h2, k2) => {
        if (0 === k2) return f2.push(h2), f2;
        if (xe(b2.h, f2[f2.length - 1].value, h2.value)) return f2;
        f2.push(h2);
        return f2;
      }, []);
      return w2.create(e2);
    }, 1), localName: "outermost", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 53, g: 2 } }, { j: [{ type: 53, g: 0 }], callFunction: re, localName: "has-children", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 0, g: 3 } }, { j: [], callFunction: Ad("has-children", 53, re), localName: "has-children", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 0, g: 3 } }, {
      j: [{ type: 53, g: 0 }],
      callFunction: ue,
      localName: "path",
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      i: { type: 1, g: 0 }
    }, { j: [], callFunction: Ad("path", 53, ue), localName: "path", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 1, g: 0 } }, { j: [{ type: 53, g: 0 }], callFunction: ne, localName: "node-name", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 23, g: 0 } }, { j: [], callFunction: Ad("node-name", 53, ne), localName: "node-name", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 23, g: 0 } }, {
      j: [{ type: 53, g: 0 }],
      callFunction: we,
      localName: "local-name",
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      i: { type: 1, g: 3 }
    }, { j: [], callFunction: Ad("local-name", 53, we), localName: "local-name", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 1, g: 3 } }, { j: [{ type: 53, g: 0 }], callFunction: ye, localName: "root", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 53, g: 0 } }, { j: [], callFunction: Ad("root", 53, ye), localName: "root", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 53, g: 0 } }, {
      j: [],
      callFunction: Ad("data", 59, pe),
      localName: "data",
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      i: { type: 46, g: 2 }
    }, { j: [{ type: 59, g: 2 }], callFunction: pe, localName: "data", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 46, g: 2 } }, { j: [{ type: 1, g: 0 }], callFunction: te, localName: "lang", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 0, g: 3 } }, { j: [{ type: 1, g: 0 }, { type: 53, g: 3 }], callFunction: te, localName: "lang", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 0, g: 3 } }, {
      j: [],
      callFunction: Ad("generate-id", 53, qe),
      localName: "generate-id",
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      i: { type: 1, g: 3 }
    }, { j: [{ type: 53, g: 0 }], callFunction: qe, localName: "generate-id", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 1, g: 3 } }];
    function Ae(a2, b2) {
      let c2 = 0;
      const d2 = a2.length;
      let e2 = false, f2 = null;
      return { next: () => {
        if (!e2) {
          for (; c2 < d2; ) {
            f2 || (f2 = b2(a2[c2], c2, a2));
            const h2 = f2.next(0);
            f2 = null;
            if (h2.value) c2++;
            else return q2(false);
          }
          e2 = true;
          return q2(true);
        }
        return p2;
      } };
    }
    function Be(a2) {
      a2 = a2.node.nodeType;
      return 1 === a2 || 3 === a2;
    }
    function Ce(a2, b2) {
      if ((v2(a2.type, 4) || v2(a2.type, 6)) && (v2(b2.type, 4) || v2(b2.type, 6))) {
        var c2 = jd(a2, 6), d2 = jd(b2, 6);
        return c2.value === d2.value || isNaN(a2.value) && isNaN(b2.value);
      }
      return (v2(a2.type, 4) || v2(a2.type, 6) || v2(a2.type, 3)) && (v2(b2.type, 4) || v2(b2.type, 6) || v2(b2.type, 3)) ? (c2 = jd(a2, 3), d2 = jd(b2, 3), c2.value === d2.value || isNaN(a2.value) && isNaN(b2.value)) : v2(a2.type, 23) && v2(b2.type, 23) ? a2.value.namespaceURI === b2.value.namespaceURI && a2.value.localName === b2.value.localName : (v2(a2.type, 9) || v2(a2.type, 7) || v2(a2.type, 8) || v2(a2.type, 11) || v2(a2.type, 12) || v2(
        a2.type,
        13
      ) || v2(a2.type, 14) || v2(a2.type, 15)) && (v2(b2.type, 9) || v2(b2.type, 7) || v2(b2.type, 8) || v2(b2.type, 11) || v2(b2.type, 12) || v2(b2.type, 13) || v2(b2.type, 14) || v2(b2.type, 15)) ? Ob(a2.value, b2.value) : (v2(a2.type, 16) || v2(a2.type, 17) || v2(a2.type, 18)) && (v2(b2.type, 16) || v2(b2.type, 17) || v2(b2.type, 17)) ? vb(a2.value, b2.value) : a2.value === b2.value;
    }
    function De(a2, b2, c2) {
      const [d2, e2] = [b2, c2].map((f2) => ({ type: 1, value: f2.reduce((h2, k2) => h2 += pc(k2, a2).first().value, "") }));
      return q2(Ce(d2, e2));
    }
    function Ee(a2, b2, c2, d2) {
      for (; a2.value && v2(a2.value.type, 56); ) {
        b2.push(a2.value);
        const e2 = lb(d2, a2.value.value);
        a2 = c2.next(0);
        if (e2 && 3 !== e2.node.nodeType) break;
      }
      return a2;
    }
    function Fe(a2, b2, c2, d2, e2) {
      const f2 = b2.h, h2 = d2.value, k2 = e2.value;
      let l2 = null, n2 = null, t2 = null, u2;
      const z2 = [], y2 = [];
      return { next: () => {
        for (; !u2; ) if (l2 || (l2 = h2.next(0)), l2 = Ee(l2, z2, h2, f2), n2 || (n2 = k2.next(0)), n2 = Ee(n2, y2, k2, f2), z2.length || y2.length) {
          var G2 = De(b2, z2, y2);
          z2.length = 0;
          y2.length = 0;
          if (false === G2.value) return u2 = true, G2;
        } else {
          if (l2.done || n2.done) return u2 = true, q2(l2.done === n2.done);
          t2 || (t2 = Ge(a2, b2, c2, l2.value, n2.value));
          G2 = t2.next(0);
          t2 = null;
          if (false === G2.value) return u2 = true, G2;
          n2 = l2 = null;
        }
        return p2;
      } };
    }
    function He(a2, b2, c2, d2, e2) {
      return d2.h.length !== e2.h.length ? kd(false) : Ae(d2.h, (f2) => {
        const h2 = e2.h.find((k2) => Ce(k2.key, f2.key));
        return h2 ? Fe(a2, b2, c2, f2.value(), h2.value()) : kd(false);
      });
    }
    function Ie(a2, b2, c2, d2, e2) {
      return d2.h.length !== e2.h.length ? kd(false) : Ae(d2.h, (f2, h2) => {
        h2 = e2.h[h2];
        return Fe(a2, b2, c2, f2(), h2());
      });
    }
    function Je(a2, b2, c2, d2, e2) {
      d2 = gb(b2.h, d2.value);
      e2 = gb(b2.h, e2.value);
      d2 = d2.filter((f2) => Be(f2));
      e2 = e2.filter((f2) => Be(f2));
      d2 = w2.create(d2.map((f2) => rb(f2)));
      e2 = w2.create(e2.map((f2) => rb(f2)));
      return Fe(a2, b2, c2, d2, e2);
    }
    function Ke(a2, b2, c2, d2, e2) {
      const f2 = Fe(a2, b2, c2, ne(a2, b2, c2, w2.m(d2)), ne(a2, b2, c2, w2.m(e2))), h2 = Je(a2, b2, c2, d2, e2);
      d2 = eb(b2.h, d2.value).filter((n2) => "http://www.w3.org/2000/xmlns/" !== n2.node.namespaceURI).sort((n2, t2) => n2.node.nodeName > t2.node.nodeName ? 1 : -1).map((n2) => rb(n2));
      e2 = eb(b2.h, e2.value).filter((n2) => "http://www.w3.org/2000/xmlns/" !== n2.node.namespaceURI).sort((n2, t2) => n2.node.nodeName > t2.node.nodeName ? 1 : -1).map((n2) => rb(n2));
      const k2 = Fe(a2, b2, c2, w2.create(d2), w2.create(e2));
      let l2 = false;
      return { next: () => {
        if (l2) return p2;
        var n2 = f2.next(0);
        if (!n2.done && false === n2.value) return l2 = true, n2;
        n2 = k2.next(0);
        if (!n2.done && false === n2.value) return l2 = true, n2;
        n2 = h2.next(0);
        l2 = true;
        return n2;
      } };
    }
    function Le(a2, b2, c2, d2, e2) {
      const f2 = Fe(a2, b2, c2, ne(a2, b2, c2, w2.m(d2)), ne(a2, b2, c2, w2.m(e2)));
      let h2 = false;
      return { next: () => {
        if (h2) return p2;
        const k2 = f2.next(0);
        return k2.done || false !== k2.value ? q2(Ce(pc(d2, b2).first(), pc(e2, b2).first())) : (h2 = true, k2);
      } };
    }
    function Ge(a2, b2, c2, d2, e2) {
      if (v2(d2.type, 46) && v2(e2.type, 46)) return kd(Ce(d2, e2));
      if (v2(d2.type, 61) && v2(e2.type, 61)) return He(a2, b2, c2, d2, e2);
      if (v2(d2.type, 62) && v2(e2.type, 62)) return Ie(a2, b2, c2, d2, e2);
      if (v2(d2.type, 53) && v2(e2.type, 53)) {
        if (v2(d2.type, 55) && v2(e2.type, 55)) return Je(a2, b2, c2, d2, e2);
        if (v2(d2.type, 54) && v2(e2.type, 54)) return Ke(a2, b2, c2, d2, e2);
        if (v2(d2.type, 47) && v2(e2.type, 47) || v2(d2.type, 57) && v2(e2.type, 57) || v2(d2.type, 58) && v2(e2.type, 58)) return Le(a2, b2, c2, d2, e2);
      }
      return kd(false);
    }
    var Me = class extends cc {
      constructor() {
        super({ M: null, Aa: -1, ta: w2.empty(), ra: {} });
      }
    };
    var Ne = (a2 = "Can not execute an updating expression in a non-updating context.") => Error(`XUST0001: ${a2}`), Oe = (a2) => Error(`XUTY0004: The attribute ${a2.name}="${a2.value}" follows a node that is not an attribute node.`), Pe = () => Error("XUTY0005: The target of a insert expression with into must be a single element or document node."), Qe = () => Error("XUTY0006: The target of a insert expression with before or after must be a single element, text, comment, or processing instruction node."), Re = () => Error("XUTY0008: The target of a replace expression must be a single element, attribute, text, comment, or processing instruction node."), Se = () => Error("XUTY0012: The target of a rename expression must be a single element, attribute, or processing instruction node."), Te = (a2) => Error(`XUDY0017: The target ${a2.outerHTML} is used in more than one replace value of expression.`), Ue = (a2) => Error(`XUDY0021: Applying the updates will result in the XDM instance violating constraint: '${a2}'`), Ve = (a2) => Error(`XUDY0023: The namespace binding ${a2} is conflicting.`), We = (a2) => Error(`XUDY0024: The namespace binding ${a2} is conflicting.`), Xe = () => Error("XUDY0027: The target for an insert, replace, or rename expression expression should not be empty.");
    function C2(a2, b2, c2) {
      b2 && null !== b2.M ? a2.B ? (null === a2.ob && (a2.ob = Ra(a2.h(new Me(), c2).hb())), a2 = a2.ob()) : a2 = a2.h(b2, c2) : a2 = a2.h(b2, c2);
      return a2;
    }
    var D2 = class {
      constructor(a2, b2, c2 = { B: false, W: false, R: "unsorted", subtree: false }, d2 = false, e2) {
        this.o = a2;
        this.ia = c2.R || "unsorted";
        this.subtree = !!c2.subtree;
        this.W = !!c2.W;
        this.B = !!c2.B;
        this.Fa = b2;
        this.I = false;
        this.ob = null;
        this.Qb = d2;
        this.type = e2;
      }
      D() {
        return null;
      }
      v(a2) {
        this.Fa.forEach((b2) => b2.v(a2));
        if (!this.Qb && this.Fa.some((b2) => b2.I)) throw Ne();
      }
    };
    var Ye = class {
      constructor(a2, b2) {
        this.J = a2;
        this.da = b2;
      }
    };
    var Ze = class {
      constructor(a2) {
        a2 && "object" === typeof a2 && "nodeType" in a2 && (a2 = a2.ownerDocument || a2, "function" === typeof a2.createElementNS && "function" === typeof a2.createProcessingInstruction && "function" === typeof a2.createTextNode && "function" === typeof a2.createComment && (this.h = a2));
        this.h || (this.h = null);
      }
      createAttributeNS(a2, b2) {
        if (!this.h) throw Error("Please pass a node factory if an XQuery script uses node constructors");
        return this.h.createAttributeNS(a2, b2);
      }
      createCDATASection(a2) {
        if (!this.h) throw Error("Please pass a node factory if an XQuery script uses node constructors");
        return this.h.createCDATASection(a2);
      }
      createComment(a2) {
        if (!this.h) throw Error("Please pass a node factory if an XQuery script uses node constructors");
        return this.h.createComment(a2);
      }
      createDocument() {
        if (!this.h) throw Error("Please pass a node factory if an XQuery script uses node constructors");
        return this.h.implementation.createDocument(null, null, null);
      }
      createElementNS(a2, b2) {
        if (!this.h) throw Error("Please pass a node factory if an XQuery script uses node constructors");
        return this.h.createElementNS(
          a2,
          b2
        );
      }
      createProcessingInstruction(a2, b2) {
        if (!this.h) throw Error("Please pass a node factory if an XQuery script uses node constructors");
        return this.h.createProcessingInstruction(a2, b2);
      }
      createTextNode(a2) {
        if (!this.h) throw Error("Please pass a node factory if an XQuery script uses node constructors");
        return this.h.createTextNode(a2);
      }
    };
    function $e(a2, b2, c2, d2) {
      return eb(d2, a2, `name-${b2}`).some((e2) => e2.node.localName === b2 && e2.node.namespaceURI === c2);
    }
    var af = (a2, b2, c2, d2) => {
      const e2 = x2(c2, a2).node, f2 = (a2 = lb(c2, a2)) ? a2.node : null;
      b2.forEach((h2) => {
        d2.insertBefore(e2, h2.node, f2);
      });
    }, bf = (a2, b2, c2, d2) => {
      const e2 = x2(c2, a2).node;
      b2.forEach((f2) => {
        d2.insertBefore(e2, f2.node, a2.node);
      });
    }, cf = (a2, b2, c2, d2) => {
      const e2 = (c2 = ib(c2, a2)) ? c2.node : null;
      b2.forEach((f2) => {
        d2.insertBefore(a2.node, f2.node, e2);
      });
    }, df = (a2, b2, c2) => {
      b2.forEach((d2) => {
        c2.insertBefore(a2.node, d2.node, null);
      });
    }, ef = (a2, b2, c2, d2) => {
      b2.forEach((e2) => {
        const f2 = e2.node.localName, h2 = e2.node.namespaceURI;
        if ($e(a2, f2, h2, c2)) throw Ue(`An attribute ${h2 ? `Q{${h2}}${f2}` : f2} already exists.`);
        d2.setAttributeNS(a2.node, h2, f2, hb(c2, e2));
      });
    }, gf = (a2, b2, c2, d2, e2) => {
      d2 || (d2 = new Ze(a2 ? a2.node : null));
      let f2;
      switch (a2.node.nodeType) {
        case 1:
          const h2 = c2.getAllAttributes(a2.node), k2 = c2.getChildNodes(a2.node), l2 = d2.createElementNS(b2.namespaceURI, b2.za());
          f2 = { node: l2, G: null };
          h2.forEach((n2) => {
            e2.setAttributeNS(l2, n2.namespaceURI, n2.nodeName, n2.value);
          });
          k2.forEach((n2) => {
            e2.insertBefore(l2, n2, null);
          });
          break;
        case 2:
          b2 = d2.createAttributeNS(b2.namespaceURI, b2.za());
          b2.value = hb(c2, a2);
          f2 = { node: b2, G: null };
          break;
        case 7:
          f2 = { node: d2.createProcessingInstruction(
            b2.za(),
            hb(c2, a2)
          ), G: null };
      }
      if (!x2(c2, a2)) throw Error("Not supported: renaming detached nodes.");
      ff(a2, [f2], c2, e2);
    }, hf = (a2, b2, c2, d2) => {
      c2.getChildNodes(a2.node).forEach((e2) => d2.removeChild(a2.node, e2));
      b2 && d2.insertBefore(a2.node, b2.node, null);
    }, ff = (a2, b2, c2, d2) => {
      const e2 = x2(c2, a2);
      var f2 = a2.node.nodeType;
      if (2 === f2) {
        if (b2.some((k2) => 2 !== k2.node.nodeType)) throw Error('Constraint "If $target is an attribute node, $replacement must consist of zero or more attribute nodes." failed.');
        const h2 = e2 ? e2.node : null;
        d2.removeAttributeNS(h2, a2.node.namespaceURI, a2.node.localName);
        b2.forEach((k2) => {
          const l2 = k2.node.localName, n2 = k2.node.namespaceURI;
          if ($e(e2, l2, n2, c2)) throw Ue(`An attribute ${n2 ? `Q{${n2}}${l2}` : l2} already exists.`);
          d2.setAttributeNS(h2, n2, l2, hb(c2, k2));
        });
      }
      if (1 === f2 || 3 === f2 || 8 === f2 || 7 === f2) {
        const h2 = (f2 = lb(c2, a2)) ? f2.node : null;
        d2.removeChild(e2.node, a2.node);
        b2.forEach((k2) => {
          d2.insertBefore(e2.node, k2.node, h2);
        });
      }
    };
    var kf = (a2, b2, c2, d2) => {
      jf(a2, b2);
      a2.filter((e2) => -1 !== ["insertInto", "insertAttributes", "replaceValue", "rename"].indexOf(e2.type)).forEach((e2) => {
        switch (e2.type) {
          case "insertInto":
            df(e2.target, e2.content, d2);
            break;
          case "insertAttributes":
            ef(e2.target, e2.content, b2, d2);
            break;
          case "rename":
            gf(e2.target, e2.o, b2, c2, d2);
            break;
          case "replaceValue":
            var f2 = e2.target;
            e2 = e2.o;
            if (2 === f2.node.nodeType) {
              const h2 = x2(b2, f2);
              h2 ? d2.setAttributeNS(h2.node, f2.node.namespaceURI, f2.node.localName, e2) : f2.node.value = e2;
            } else d2.setData(f2.node, e2);
        }
      });
      a2.filter((e2) => -1 !== ["insertBefore", "insertAfter", "insertIntoAsFirst", "insertIntoAsLast"].indexOf(e2.type)).forEach((e2) => {
        switch (e2.type) {
          case "insertAfter":
            af(e2.target, e2.content, b2, d2);
            break;
          case "insertBefore":
            bf(e2.target, e2.content, b2, d2);
            break;
          case "insertIntoAsFirst":
            cf(e2.target, e2.content, b2, d2);
            break;
          case "insertIntoAsLast":
            df(e2.target, e2.content, d2);
        }
      });
      a2.filter((e2) => "replaceNode" === e2.type).forEach((e2) => {
        ff(e2.target, e2.o, b2, d2);
      });
      a2.filter((e2) => "replaceElementContent" === e2.type).forEach((e2) => {
        hf(e2.target, e2.text, b2, d2);
      });
      a2.filter((e2) => "delete" === e2.type).forEach((e2) => {
        e2 = e2.target;
        var f2 = x2(b2, e2);
        (f2 = f2 ? f2.node : null) && (2 === e2.node.nodeType ? d2.removeAttributeNS(f2, e2.node.namespaceURI, e2.node.localName) : d2.removeChild(f2, e2.node));
      });
      if (a2.some((e2) => "put" === e2.type)) throw Error('Not implemented: the execution for pendingUpdate "put" is not yet implemented.');
    };
    const jf = (a2, b2) => {
      function c2(f2, h2) {
        const k2 = /* @__PURE__ */ new Set();
        a2.filter((l2) => l2.type === f2).map((l2) => l2.target).forEach((l2) => {
          l2 = l2 ? l2.node : null;
          k2.has(l2) && h2(l2);
          k2.add(l2);
        });
      }
      c2("rename", (f2) => {
        throw Error(`XUDY0015: The target ${f2.outerHTML} is used in more than one rename expression.`);
      });
      c2("replaceNode", (f2) => {
        throw Error(`XUDY0016: The target ${f2.outerHTML} is used in more than one replace expression.`);
      });
      c2("replaceValue", (f2) => {
        throw Te(f2);
      });
      c2("replaceElementContent", (f2) => {
        throw Te(f2);
      });
      const d2 = /* @__PURE__ */ new Map(), e2 = (f2) => new Sa(
        f2.node.prefix,
        f2.node.namespaceURI,
        f2.node.localName
      );
      a2.filter((f2) => "replaceNode" === f2.type && 2 === f2.target.node.nodeType).forEach((f2) => {
        var h2 = x2(b2, f2.target);
        h2 = h2 ? h2.node : null;
        const k2 = d2.get(h2);
        k2 ? k2.push(...f2.o.map(e2)) : d2.set(h2, f2.o.map(e2));
      });
      a2.filter((f2) => "rename" === f2.type && 2 === f2.target.node.nodeType).forEach((f2) => {
        var h2 = x2(b2, f2.target);
        if (h2) {
          h2 = h2.node;
          var k2 = d2.get(h2);
          k2 ? k2.push(f2.o) : d2.set(h2, [f2.o]);
        }
      });
      d2.forEach((f2) => {
        const h2 = {};
        f2.forEach((k2) => {
          h2[k2.prefix] || (h2[k2.prefix] = k2.namespaceURI);
          if (h2[k2.prefix] !== k2.namespaceURI) throw We(k2.namespaceURI);
        });
      });
    };
    var lf = (a2, ...b2) => a2.concat(...b2.filter(Boolean));
    function mf(a2) {
      return a2.I ? (b2, c2) => a2.s(b2, c2) : (b2, c2) => {
        const d2 = a2.h(b2, c2);
        return { next: () => {
          const e2 = d2.O();
          return q2({ da: [], J: e2 });
        } };
      };
    }
    var nf = class extends D2 {
      constructor(a2, b2, c2, d2) {
        super(a2, b2, c2, true, d2);
        this.I = true;
      }
      h() {
        throw Ne();
      }
    };
    function of(a2, b2) {
      a2 = a2.next(0);
      b2(a2.value.da);
      return w2.create(a2.value.J);
    }
    function pf(a2) {
      a2.Fa.some((b2) => b2.I) && (a2.I = true);
    }
    var qf = class extends nf {
      constructor(a2, b2, c2, d2) {
        super(a2, b2, c2, d2);
        this.I = this.Fa.some((e2) => e2.I);
      }
      h(a2, b2) {
        return this.A(a2, b2, this.Fa.map((c2) => (d2) => c2.h(d2, b2)));
      }
      s(a2, b2) {
        let c2 = [];
        const d2 = this.A(a2, b2, this.Fa.map((f2) => f2.I ? (h2) => {
          h2 = f2.s(h2, b2);
          return of(h2, (k2) => c2 = lf(c2, k2));
        } : (h2) => f2.h(h2, b2)));
        let e2 = false;
        return { next: () => {
          if (e2) return p2;
          const f2 = d2.O();
          e2 = true;
          return q2(new Ye(f2, c2));
        } };
      }
      v(a2) {
        super.v(a2);
        pf(this);
      }
    };
    const rf = ["external", "attribute", "nodeName", "nodeType", "universal"], sf = rf.length;
    function tf(a2, b2) {
      for (let c2 = 0; c2 < sf; ++c2) {
        if (b2.h[c2] < a2.h[c2]) return 1;
        if (b2.h[c2] > a2.h[c2]) return -1;
      }
      return 0;
    }
    var uf = class {
      constructor(a2) {
        this.h = rf.map((b2) => a2[b2] || 0);
        if (Object.keys(a2).some((b2) => !rf.includes(b2))) throw Error("Invalid specificity kind passed");
      }
      add(a2) {
        const b2 = rf.reduce((c2, d2, e2) => {
          c2[d2] = this.h[e2] + a2.h[e2];
          return c2;
        }, /* @__PURE__ */ Object.create(null));
        return new uf(b2);
      }
    };
    const vf = () => mc("Expected base expression of a function call to evaluate to a sequence of single function item");
    function wf(a2, b2, c2, d2) {
      const e2 = [];
      for (let f2 = 0; f2 < b2.length; ++f2) {
        if (null === b2[f2]) {
          e2.push(null);
          continue;
        }
        const h2 = zd(a2[f2], b2[f2], c2, d2, false);
        e2.push(h2);
      }
      return e2;
    }
    function Cf(a2, b2) {
      if (!v2(a2.type, 60)) throw mc("Expected base expression to evaluate to a function item");
      if (a2.v !== b2) throw vf();
      return a2;
    }
    function Df(a2, b2, c2, d2, e2, f2, h2) {
      let k2 = 0;
      e2 = e2.map((l2) => l2 ? null : f2[k2++](c2));
      e2 = wf(a2.o, e2, d2, a2.D);
      if (0 <= e2.indexOf(null)) return Ta(a2, e2);
      b2 = b2.apply(void 0, [c2, d2, h2, ...e2]);
      return zd(a2.s, b2, d2, a2.D, true);
    }
    var Ff = class extends qf {
      constructor(a2, b2, c2) {
        super(new uf({ external: 1 }), [a2].concat(b2.filter((d2) => !!d2)), { R: "unsorted", W: false, subtree: false, B: false }, c2);
        this.ma = b2.length;
        this.P = b2.map((d2) => null === d2);
        this.L = null;
        this.ya = a2;
        this.La = b2;
      }
      s(a2, b2) {
        if (!this.l || !this.l.I) return super.s(a2, b2);
        let c2 = [];
        const d2 = Df(this.l, (f2, h2, k2, ...l2) => of(this.l.value(f2, h2, k2, ...l2), (n2) => {
          c2 = lf(c2, n2);
        }), a2, b2, this.P, this.La.map((f2) => () => f2.I ? of(f2.s(a2, b2), (h2) => {
          c2 = lf(c2, h2);
        }) : C2(f2, a2, b2)), this.L);
        let e2 = false;
        return { next: () => {
          if (e2) return p2;
          const f2 = d2.O();
          e2 = true;
          return q2({
            da: c2,
            J: f2
          });
        } };
      }
      A(a2, b2, [c2, ...d2]) {
        if (this.l) return Df(this.l, (f2, h2, k2, ...l2) => this.l.value(f2, h2, k2, ...l2), a2, b2, this.P, d2, this.L);
        const e2 = c2(a2);
        return e2.X({ default: () => {
          throw vf();
        }, m: () => e2.N(([f2]) => {
          f2 = Cf(f2, this.ma);
          if (f2.I) throw Error("XUDY0038: The function returned by the PrimaryExpr of a dynamic function invocation can not be an updating function");
          return Df(f2, f2.value, a2, b2, this.P, d2, this.L);
        }) });
      }
      v(a2) {
        this.L = Ef(a2);
        super.v(a2);
        if (this.ya.B) {
          a2 = C2(this.ya, null, null);
          if (!a2.oa()) throw vf();
          this.l = Cf(a2.first(), this.ma);
          this.l.I && (this.I = true);
        }
      }
    };
    const Gf = (a2, b2, c2, d2, e2, f2) => A2([d2, e2, f2], ([h2, k2, l2]) => {
      k2 = k2.value;
      l2 = l2.value;
      if (k2 > h2.h.length || 0 >= k2) throw Error("FOAY0001: subarray start out of bounds.");
      if (0 > l2) throw Error("FOAY0002: subarray length out of bounds.");
      if (k2 + l2 > h2.h.length + 1) throw Error("FOAY0001: subarray start + length out of bounds.");
      return w2.m(new pb(h2.h.slice(k2 - 1, l2 + k2 - 1)));
    }), Hf = (a2, b2, c2, d2, e2) => A2([d2], ([f2]) => e2.N((h2) => {
      h2 = h2.map((l2) => l2.value).sort((l2, n2) => n2 - l2).filter((l2, n2, t2) => t2[n2 - 1] !== l2);
      const k2 = f2.h.concat();
      for (let l2 = 0, n2 = h2.length; l2 < n2; ++l2) {
        const t2 = h2[l2];
        if (t2 > f2.h.length || 0 >= t2) throw Error("FOAY0001: subarray position out of bounds.");
        k2.splice(t2 - 1, 1);
      }
      return w2.m(new pb(k2));
    })), If = (a2) => v2(a2, 1) || v2(a2, 20) || v2(a2, 19), Jf = (a2, b2, c2, d2, e2) => 0 === d2.length ? 0 !== e2.length : 0 !== e2.length && Ge(a2, b2, c2, d2[0], e2[0]).next(0).value ? Jf(a2, b2, c2, d2.slice(1), e2.slice(1)) : d2[0].value !== d2[0].value ? true : If(d2[0].type) && 0 !== e2.length && If(e2[0].type) ? d2[0].value < e2[0].value : 0 === e2.length ? false : d2[0].value < e2[0].value, Kf = (a2, b2, c2, d2) => {
      d2.sort((e2, f2) => Fe(a2, b2, c2, w2.create(e2), w2.create(f2)).next(0).value ? 0 : Jf(a2, b2, c2, e2, f2) ? -1 : 1);
      return w2.m(new pb(d2.map((e2) => () => w2.create(e2))));
    };
    function Lf(a2) {
      return v2(a2.type, 62) ? jc(a2.h.map((b2) => b2().N((c2) => jc(c2.map(Lf))))) : w2.m(a2);
    }
    var Mf = [
      { namespaceURI: "http://www.w3.org/2005/xpath-functions/array", localName: "size", j: [{ type: 62, g: 3 }], i: { type: 5, g: 3 }, callFunction: (a2, b2, c2, d2) => A2([d2], ([e2]) => w2.m(g2(e2.h.length, 5))) },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions/array", localName: "get", j: [{ type: 62, g: 3 }, { type: 5, g: 3 }], i: { type: 59, g: 2 }, callFunction: ob },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions/array", localName: "put", j: [{ type: 62, g: 3 }, { type: 5, g: 3 }, { type: 59, g: 2 }], i: { type: 62, g: 3 }, callFunction: (a2, b2, c2, d2, e2, f2) => A2([e2, d2], ([h2, k2]) => {
        h2 = h2.value;
        if (0 >= h2 || h2 > k2.h.length) throw Error("FOAY0001: array position out of bounds.");
        k2 = k2.h.concat();
        k2.splice(h2 - 1, 1, Ra(f2));
        return w2.m(new pb(k2));
      }) },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions/array", localName: "append", j: [{ type: 62, g: 3 }, { type: 59, g: 2 }], i: { type: 62, g: 3 }, callFunction: (a2, b2, c2, d2, e2) => A2([d2], ([f2]) => w2.m(new pb(f2.h.concat([Ra(e2)])))) },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions/array", localName: "subarray", j: [{ type: 62, g: 3 }, { type: 5, g: 3 }, { type: 5, g: 3 }], i: { type: 62, g: 3 }, callFunction: Gf },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions/array", localName: "subarray", j: [{ type: 62, g: 3 }, { type: 5, g: 3 }], i: { type: 62, g: 3 }, callFunction(a2, b2, c2, d2, e2) {
        const f2 = w2.m(g2(d2.first().value.length - e2.first().value + 1, 5));
        return Gf(a2, b2, c2, d2, e2, f2);
      } },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions/array", localName: "remove", j: [{ type: 62, g: 3 }, { type: 5, g: 2 }], i: { type: 62, g: 3 }, callFunction: Hf },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions/array", localName: "insert-before", j: [{ type: 62, g: 3 }, { type: 5, g: 3 }, {
        type: 59,
        g: 2
      }], i: { type: 62, g: 3 }, callFunction: (a2, b2, c2, d2, e2, f2) => A2([d2, e2], ([h2, k2]) => {
        k2 = k2.value;
        if (k2 > h2.h.length + 1 || 0 >= k2) throw Error("FOAY0001: subarray position out of bounds.");
        h2 = h2.h.concat();
        h2.splice(k2 - 1, 0, Ra(f2));
        return w2.m(new pb(h2));
      }) },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions/array", localName: "head", j: [{ type: 62, g: 3 }], i: { type: 59, g: 2 }, callFunction(a2, b2, c2, d2) {
        return ob(a2, b2, c2, d2, w2.m(g2(1, 5)));
      } },
      {
        namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
        localName: "tail",
        j: [{ type: 62, g: 3 }],
        i: { type: 59, g: 2 },
        callFunction(a2, b2, c2, d2) {
          return Hf(a2, b2, c2, d2, w2.m(g2(1, 5)));
        }
      },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions/array", localName: "reverse", j: [{ type: 62, g: 3 }], i: { type: 62, g: 3 }, callFunction: (a2, b2, c2, d2) => A2([d2], ([e2]) => w2.m(new pb(e2.h.concat().reverse()))) },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions/array", localName: "join", j: [{ type: 62, g: 2 }], i: { type: 62, g: 3 }, callFunction: (a2, b2, c2, d2) => d2.N((e2) => {
        e2 = e2.reduce((f2, h2) => f2.concat(h2.h), []);
        return w2.m(new pb(e2));
      }) },
      {
        namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
        localName: "for-each",
        j: [{ type: 62, g: 3 }, { type: 60, g: 3 }],
        i: { type: 62, g: 3 },
        callFunction: (a2, b2, c2, d2, e2) => A2([d2, e2], ([f2, h2]) => {
          if (1 !== h2.v) throw mc("The callback passed into array:for-each has a wrong arity.");
          f2 = f2.h.map((k2) => Ra(h2.value.call(void 0, a2, b2, c2, wf(h2.o, [k2()], b2, "array:for-each")[0])));
          return w2.m(new pb(f2));
        })
      },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions/array", localName: "filter", j: [{ type: 62, g: 3 }, { type: 60, g: 3 }], i: { type: 62, g: 3 }, callFunction: (a2, b2, c2, d2, e2) => A2([d2, e2], ([f2, h2]) => {
        if (1 !== h2.v) throw mc("The callback passed into array:filter has a wrong arity.");
        const k2 = f2.h.map((t2) => {
          t2 = wf(h2.o, [t2()], b2, "array:filter")[0];
          const u2 = h2.value;
          return u2(a2, b2, c2, t2);
        }), l2 = [];
        let n2 = false;
        return w2.create({ next: () => {
          if (n2) return p2;
          for (let u2 = 0, z2 = f2.h.length; u2 < z2; ++u2) {
            var t2 = k2[u2].fa();
            l2[u2] = t2;
          }
          t2 = f2.h.filter((u2, z2) => l2[z2]);
          n2 = true;
          return q2(new pb(t2));
        } });
      }) },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions/array", localName: "fold-left", j: [{ type: 62, g: 3 }, { type: 59, g: 2 }, { type: 60, g: 3 }], i: { type: 59, g: 2 }, callFunction: (a2, b2, c2, d2, e2, f2) => A2([d2, f2], ([h2, k2]) => {
        if (2 !== k2.v) throw mc("The callback passed into array:fold-left has a wrong arity.");
        return h2.h.reduce((l2, n2) => {
          n2 = wf(k2.o, [n2()], b2, "array:fold-left")[0];
          return k2.value.call(void 0, a2, b2, c2, l2, n2);
        }, e2);
      }) },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions/array", localName: "fold-right", j: [{ type: 62, g: 3 }, { type: 59, g: 2 }, { type: 60, g: 3 }], i: { type: 59, g: 2 }, callFunction: (a2, b2, c2, d2, e2, f2) => A2([d2, f2], ([h2, k2]) => {
        if (2 !== k2.v) throw mc("The callback passed into array:fold-right has a wrong arity.");
        return h2.h.reduceRight((l2, n2) => {
          n2 = wf(k2.o, [n2()], b2, "array:fold-right")[0];
          return k2.value.call(void 0, a2, b2, c2, l2, n2);
        }, e2);
      }) },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions/array", localName: "for-each-pair", j: [{ type: 62, g: 3 }, { type: 62, g: 3 }, { type: 60, g: 3 }], i: { type: 62, g: 3 }, callFunction: (a2, b2, c2, d2, e2, f2) => A2([d2, e2, f2], ([h2, k2, l2]) => {
        if (2 !== l2.v) throw mc("The callback passed into array:for-each-pair has a wrong arity.");
        const n2 = [];
        for (let t2 = 0, u2 = Math.min(h2.h.length, k2.h.length); t2 < u2; ++t2) {
          const [z2, y2] = wf(l2.o, [h2.h[t2](), k2.h[t2]()], b2, "array:for-each-pair");
          n2[t2] = Ra(l2.value.call(void 0, a2, b2, c2, z2, y2));
        }
        return w2.m(new pb(n2));
      }) },
      {
        namespaceURI: "http://www.w3.org/2005/xpath-functions/array",
        localName: "sort",
        j: [{ type: 62, g: 3 }],
        i: { type: 62, g: 3 },
        callFunction: (a2, b2, c2, d2) => A2([d2], ([e2]) => {
          e2 = e2.h.map((f2) => f2().O());
          return Kf(a2, b2, c2, e2);
        })
      },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions/array", localName: "flatten", j: [{ type: 59, g: 2 }], i: { type: 59, g: 2 }, callFunction: (a2, b2, c2, d2) => d2.N((e2) => jc(e2.map(Lf))) }
    ];
    function E2(a2, b2, c2, d2, e2) {
      return e2.F() ? e2 : w2.m(jd(e2.first(), a2));
    }
    var Nf = [{ namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "untypedAtomic", j: [{ type: 46, g: 0 }], i: { type: 19, g: 0 }, callFunction: E2.bind(null, 19) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "error", j: [{ type: 46, g: 0 }], i: { type: 39, g: 0 }, callFunction: E2.bind(null, 39) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "string", j: [{ type: 46, g: 0 }], i: { type: 1, g: 0 }, callFunction: E2.bind(null, 1) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "boolean", j: [{ type: 46, g: 0 }], i: {
      type: 0,
      g: 0
    }, callFunction: E2.bind(null, 0) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "decimal", j: [{ type: 46, g: 0 }], i: { type: 4, g: 0 }, callFunction: E2.bind(null, 4) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "float", j: [{ type: 46, g: 0 }], i: { type: 6, g: 0 }, callFunction: E2.bind(null, 6) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "double", j: [{ type: 46, g: 0 }], i: { type: 3, g: 0 }, callFunction: E2.bind(null, 3) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "duration", j: [{
      type: 46,
      g: 0
    }], i: { type: 18, g: 0 }, callFunction: E2.bind(null, 18) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "dateTime", j: [{ type: 46, g: 0 }], i: { type: 9, g: 0 }, callFunction: E2.bind(null, 9) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "dateTimeStamp", j: [{ type: 46, g: 0 }], i: { type: 10, g: 0 }, callFunction: E2.bind(null, 10) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "time", j: [{ type: 46, g: 0 }], i: { type: 8, g: 0 }, callFunction: E2.bind(null, 8) }, {
      namespaceURI: "http://www.w3.org/2001/XMLSchema",
      localName: "date",
      j: [{ type: 46, g: 0 }],
      i: { type: 7, g: 0 },
      callFunction: E2.bind(null, 7)
    }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "gYearMonth", j: [{ type: 46, g: 0 }], i: { type: 11, g: 0 }, callFunction: E2.bind(null, 11) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "gYear", j: [{ type: 46, g: 0 }], i: { type: 12, g: 0 }, callFunction: E2.bind(null, 12) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "gMonthDay", j: [{ type: 46, g: 0 }], i: { type: 13, g: 0 }, callFunction: E2.bind(null, 13) }, {
      namespaceURI: "http://www.w3.org/2001/XMLSchema",
      localName: "gDay",
      j: [{ type: 46, g: 0 }],
      i: { type: 15, g: 0 },
      callFunction: E2.bind(null, 15)
    }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "gMonth", j: [{ type: 46, g: 0 }], i: { type: 14, g: 0 }, callFunction: E2.bind(null, 14) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "hexBinary", j: [{ type: 46, g: 0 }], i: { type: 22, g: 0 }, callFunction: E2.bind(null, 22) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "base64Binary", j: [{ type: 46, g: 0 }], i: { type: 21, g: 0 }, callFunction: E2.bind(null, 21) }, {
      namespaceURI: "http://www.w3.org/2001/XMLSchema",
      localName: "QName",
      j: [{ type: 46, g: 0 }],
      i: { type: 23, g: 0 },
      callFunction: (a2, b2, c2, d2) => {
        if (d2.F()) return d2;
        a2 = d2.first();
        if (v2(a2.type, 2)) throw Error("XPTY0004: The provided QName is not a string-like value.");
        a2 = jd(a2, 1).value;
        a2 = sc(a2, 23);
        if (!tc(a2, 23)) throw Error("FORG0001: The provided QName is invalid.");
        if (!a2.includes(":")) return c2 = c2.$(""), w2.m(g2(new Sa("", c2, a2), 23));
        const [e2, f2] = a2.split(":");
        c2 = c2.$(e2);
        if (!c2) throw Error(`FONS0004: The value ${a2} can not be cast to a QName. Did you mean to use fn:QName?`);
        return w2.m(g2(new Sa(
          e2,
          c2,
          f2
        ), 23));
      }
    }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "anyURI", j: [{ type: 46, g: 0 }], i: { type: 20, g: 0 }, callFunction: E2.bind(null, 20) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "normalizedString", j: [{ type: 46, g: 0 }], i: { type: 48, g: 0 }, callFunction: E2.bind(null, 48) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "token", j: [{ type: 46, g: 0 }], i: { type: 52, g: 0 }, callFunction: E2.bind(null, 52) }, {
      namespaceURI: "http://www.w3.org/2001/XMLSchema",
      localName: "language",
      j: [{ type: 46, g: 0 }],
      i: { type: 51, g: 0 },
      callFunction: E2.bind(null, 51)
    }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "NMTOKEN", j: [{ type: 46, g: 0 }], i: { type: 50, g: 0 }, callFunction: E2.bind(null, 50) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "NMTOKENS", j: [{ type: 46, g: 0 }], i: { type: 49, g: 2 }, callFunction: E2.bind(null, 49) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "Name", j: [{ type: 46, g: 0 }], i: { type: 25, g: 0 }, callFunction: E2.bind(null, 25) }, {
      namespaceURI: "http://www.w3.org/2001/XMLSchema",
      localName: "NCName",
      j: [{ type: 46, g: 0 }],
      i: { type: 24, g: 0 },
      callFunction: E2.bind(null, 24)
    }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "ID", j: [{ type: 46, g: 0 }], i: { type: 42, g: 0 }, callFunction: E2.bind(null, 42) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "IDREF", j: [{ type: 46, g: 0 }], i: { type: 41, g: 0 }, callFunction: E2.bind(null, 41) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "IDREFS", j: [{ type: 46, g: 0 }], i: { type: 43, g: 2 }, callFunction: E2.bind(null, 43) }, {
      namespaceURI: "http://www.w3.org/2001/XMLSchema",
      localName: "ENTITY",
      j: [{ type: 46, g: 0 }],
      i: { type: 26, g: 0 },
      callFunction: E2.bind(null, 26)
    }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "ENTITIES", j: [{ type: 46, g: 0 }], i: { type: 40, g: 2 }, callFunction: E2.bind(null, 40) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "integer", j: [{ type: 46, g: 0 }], i: { type: 5, g: 0 }, callFunction: E2.bind(null, 5) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "nonPositiveInteger", j: [{ type: 46, g: 0 }], i: { type: 27, g: 0 }, callFunction: E2.bind(null, 27) }, {
      namespaceURI: "http://www.w3.org/2001/XMLSchema",
      localName: "negativeInteger",
      j: [{ type: 46, g: 0 }],
      i: { type: 28, g: 0 },
      callFunction: E2.bind(null, 28)
    }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "long", j: [{ type: 46, g: 0 }], i: { type: 31, g: 0 }, callFunction: E2.bind(null, 31) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "int", j: [{ type: 46, g: 0 }], i: { type: 32, g: 0 }, callFunction: E2.bind(null, 32) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "short", j: [{ type: 46, g: 0 }], i: { type: 33, g: 0 }, callFunction: E2.bind(null, 33) }, {
      namespaceURI: "http://www.w3.org/2001/XMLSchema",
      localName: "byte",
      j: [{ type: 46, g: 0 }],
      i: { type: 34, g: 0 },
      callFunction: E2.bind(null, 34)
    }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "nonNegativeInteger", j: [{ type: 46, g: 0 }], i: { type: 30, g: 0 }, callFunction: E2.bind(null, 30) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "unsignedLong", j: [{ type: 46, g: 0 }], i: { type: 36, g: 0 }, callFunction: E2.bind(null, 36) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "unsignedInt", j: [{ type: 46, g: 0 }], i: { type: 35, g: 0 }, callFunction: E2.bind(null, 35) }, {
      namespaceURI: "http://www.w3.org/2001/XMLSchema",
      localName: "unsignedShort",
      j: [{ type: 46, g: 0 }],
      i: { type: 38, g: 0 },
      callFunction: E2.bind(null, 38)
    }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "unsignedByte", j: [{ type: 46, g: 0 }], i: { type: 37, g: 0 }, callFunction: E2.bind(null, 37) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "positiveInteger", j: [{ type: 46, g: 0 }], i: { type: 29, g: 0 }, callFunction: E2.bind(null, 29) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "yearMonthDuration", j: [{ type: 46, g: 0 }], i: { type: 16, g: 0 }, callFunction: E2.bind(
      null,
      16
    ) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "dayTimeDuration", j: [{ type: 46, g: 0 }], i: { type: 17, g: 0 }, callFunction: E2.bind(null, 17) }, { namespaceURI: "http://www.w3.org/2001/XMLSchema", localName: "dateTimeStamp", j: [{ type: 46, g: 0 }], i: { type: 10, g: 0 }, callFunction: E2.bind(null, 10) }];
    const Of = (a2, b2, c2, d2) => d2.F() ? d2 : w2.m(g2(d2.first().value.getYear(), 5)), Pf = (a2, b2, c2, d2) => d2.F() ? d2 : w2.m(g2(d2.first().value.getMonth(), 5)), Qf = (a2, b2, c2, d2) => d2.F() ? d2 : w2.m(g2(d2.first().value.getDay(), 5)), Rf = (a2, b2, c2, d2) => d2.F() ? d2 : w2.m(g2(d2.first().value.getHours(), 5)), Sf = (a2, b2, c2, d2) => d2.F() ? d2 : w2.m(g2(d2.first().value.getMinutes(), 5)), Tf = (a2, b2, c2, d2) => {
      d2.F() || (a2 = w2, b2 = a2.m, d2 = d2.first().value, d2 = b2.call(a2, g2(d2.D + d2.qa, 4)));
      return d2;
    }, Uf = (a2, b2, c2, d2) => d2.F() ? d2 : (a2 = d2.first().value.Y) ? w2.m(g2(a2, 17)) : w2.empty();
    var Vf = [
      { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "dateTime", j: [{ type: 7, g: 0 }, { type: 8, g: 0 }], i: { type: 9, g: 0 }, callFunction: (a2, b2, c2, d2, e2) => {
        if (d2.F()) return d2;
        if (e2.F()) return e2;
        a2 = d2.first().value;
        e2 = e2.first().value;
        b2 = a2.Y;
        c2 = e2.Y;
        if (b2 || c2) {
          if (!b2 || c2) {
            if (!b2 && c2) b2 = c2;
            else if (!vb(b2, c2)) throw Error("FORG0008: fn:dateTime: got a date and time value with different timezones.");
          }
        } else b2 = null;
        return w2.m(g2(new Kb(a2.getYear(), a2.getMonth(), a2.getDay(), e2.getHours(), e2.getMinutes(), e2.getSeconds(), e2.qa, b2), 9));
      } },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "year-from-dateTime", j: [{ type: 9, g: 0 }], i: { type: 5, g: 0 }, callFunction: Of },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "month-from-dateTime", j: [{ type: 9, g: 0 }], i: { type: 5, g: 0 }, callFunction: Pf },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "day-from-dateTime", j: [{ type: 9, g: 0 }], i: { type: 5, g: 0 }, callFunction: Qf },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "hours-from-dateTime", j: [{
        type: 9,
        g: 0
      }], i: { type: 5, g: 0 }, callFunction: Rf },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "minutes-from-dateTime", j: [{ type: 9, g: 0 }], i: { type: 5, g: 0 }, callFunction: Sf },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "seconds-from-dateTime", j: [{ type: 9, g: 0 }], i: { type: 4, g: 0 }, callFunction: Tf },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "timezone-from-dateTime", j: [{ type: 9, g: 0 }], i: { type: 17, g: 0 }, callFunction: Uf },
      {
        namespaceURI: "http://www.w3.org/2005/xpath-functions",
        localName: "year-from-date",
        j: [{ type: 7, g: 0 }],
        i: { type: 5, g: 0 },
        callFunction: Of
      },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "month-from-date", j: [{ type: 7, g: 0 }], i: { type: 5, g: 0 }, callFunction: Pf },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "day-from-date", j: [{ type: 7, g: 0 }], i: { type: 5, g: 0 }, callFunction: Qf },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "timezone-from-date", j: [{ type: 7, g: 0 }], i: { type: 17, g: 0 }, callFunction: Uf },
      {
        namespaceURI: "http://www.w3.org/2005/xpath-functions",
        localName: "hours-from-time",
        j: [{ type: 8, g: 0 }],
        i: { type: 5, g: 0 },
        callFunction: Rf
      },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "minutes-from-time", j: [{ type: 8, g: 0 }], i: { type: 5, g: 0 }, callFunction: Sf },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "seconds-from-time", j: [{ type: 8, g: 0 }], i: { type: 4, g: 0 }, callFunction: Tf },
      { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "timezone-from-time", j: [{ type: 8, g: 0 }], i: { type: 17, g: 0 }, callFunction: Uf }
    ];
    function Wf(a2, b2) {
      const c2 = b2.h, d2 = b2.Ja, e2 = b2.Ma;
      switch (a2.node.nodeType) {
        case 1:
          const h2 = d2.createElementNS(a2.node.namespaceURI, a2.node.nodeName);
          c2.getAllAttributes(a2.node).forEach((k2) => e2.setAttributeNS(h2, k2.namespaceURI, k2.nodeName, k2.value));
          for (var f2 of gb(c2, a2)) a2 = Wf(f2, b2), e2.insertBefore(h2, a2.node, null);
          return { node: h2, G: null };
        case 2:
          return b2 = d2.createAttributeNS(a2.node.namespaceURI, a2.node.nodeName), b2.value = hb(c2, a2), { node: b2, G: null };
        case 4:
          return { node: d2.createCDATASection(hb(c2, a2)), G: null };
        case 8:
          return { node: d2.createComment(hb(
            c2,
            a2
          )), G: null };
        case 9:
          f2 = d2.createDocument();
          for (const k2 of gb(c2, a2)) a2 = Wf(k2, b2), e2.insertBefore(f2, a2.node, null);
          return { node: f2, G: null };
        case 7:
          return { node: d2.createProcessingInstruction(a2.node.target, hb(c2, a2)), G: null };
        case 3:
          return { node: d2.createTextNode(hb(c2, a2)), G: null };
      }
    }
    function Xf(a2, b2) {
      const c2 = b2.Ma;
      var d2 = b2.Ja;
      const e2 = b2.h;
      if (cb(a2.node)) switch (a2.node.nodeType) {
        case 2:
          return d2 = d2.createAttributeNS(a2.node.namespaceURI, a2.node.nodeName), d2.value = hb(e2, a2), d2;
        case 8:
          return d2.createComment(hb(e2, a2));
        case 1:
          const f2 = a2.node.prefix, h2 = a2.node.localName, k2 = d2.createElementNS(a2.node.namespaceURI, f2 ? f2 + ":" + h2 : h2);
          gb(e2, a2).forEach((l2) => {
            l2 = Xf(l2, b2);
            c2.insertBefore(k2, l2, null);
          });
          eb(e2, a2).forEach((l2) => {
            c2.setAttributeNS(k2, l2.node.namespaceURI, l2.node.nodeName, hb(e2, l2));
          });
          k2.normalize();
          return k2;
        case 7:
          return d2.createProcessingInstruction(
            a2.node.target,
            hb(e2, a2)
          );
        case 3:
          return d2.createTextNode(hb(e2, a2));
      }
      else return Wf(a2, b2).node;
    }
    function Yf(a2, b2, c2) {
      let d2 = a2;
      for (a2 = x2(c2, d2); null !== a2; ) {
        if (2 === d2.node.nodeType) b2.push(d2.node.nodeName);
        else {
          const e2 = gb(c2, a2);
          b2.push(e2.findIndex((f2) => md(f2, d2)));
        }
        d2 = a2;
        a2 = x2(c2, d2);
      }
      return d2;
    }
    function Zf(a2, b2, c2) {
      for (; 0 < b2.length; ) {
        const d2 = b2.pop();
        "string" === typeof d2 ? a2 = eb(c2, a2).find((e2) => e2.node.nodeName === d2) : a2 = gb(c2, a2)[d2];
      }
      return a2.node;
    }
    function $f(a2, b2, c2) {
      var d2 = a2.node;
      if (!(cb(d2) || c2 || a2.G)) return d2;
      d2 = b2.v;
      const e2 = [];
      if (c2) return Xf(a2, b2);
      a2 = Yf(a2, e2, b2.h);
      c2 = d2.get(a2.node);
      c2 || (c2 = { node: Xf(a2, b2), G: null }, d2.set(a2.node, c2));
      return Zf(c2, e2, b2.h);
    }
    const ag = (a2, b2, c2, d2, e2) => d2.N((f2) => {
      var h2;
      let k2 = "";
      for (let l2 = 0; l2 < f2.length; l2++) {
        const n2 = f2[l2], t2 = b2.Ua && v2(n2.type, 53) ? b2.Ua.serializeToString($f(n2.value, b2, false)) : null === (h2 = qc(w2.m(n2), b2).map((u2) => jd(u2, 1)).first()) || void 0 === h2 ? void 0 : h2.value;
        t2 && (k2 += `{type: ${Da[n2.type]}, value: ${t2}}
`);
      }
      void 0 !== e2 && (k2 += e2.first().value);
      b2.jb.trace(k2);
      return w2.create(f2);
    });
    var bg = [{ j: [{ type: 59, g: 2 }], callFunction: ag, localName: "trace", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 59, g: 2 } }, { j: [{ type: 59, g: 2 }, { type: 1, g: 3 }], callFunction: ag, localName: "trace", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 59, g: 2 } }];
    const cg = (a2, b2, c2, d2, e2) => {
      a2 = void 0 === d2 || d2.F() ? new Sa("err", "http://www.w3.org/2005/xqt-errors", "FOER0000") : d2.first().value;
      b2 = "";
      void 0 === e2 || e2.F() || (b2 = `: ${e2.first().value}`);
      throw Error(`${a2.localName}${b2}`);
    };
    var dg = [{ namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "error", j: [], i: { type: 63, g: 3 }, callFunction: cg }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "error", j: [{ type: 23, g: 0 }], i: { type: 63, g: 3 }, callFunction: cg }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "error", j: [{ type: 23, g: 0 }, { type: 1, g: 3 }], i: { type: 63, g: 3 }, callFunction: cg }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "error", j: [{ type: 23, g: 0 }, { type: 1, g: 3 }, { type: 59, g: 2 }], i: {
      type: 63,
      g: 3
    }, callFunction() {
      throw Error("Not implemented: Using an error object in error is not supported");
    } }];
    function eg(a2) {
      return "string" === typeof a2 ? a2 : (a2 = new Za().getChildNodes(a2).find((b2) => 8 === b2.nodeType)) ? a2.data : "some expression";
    }
    var fg = class extends Error {
      constructor(a2, b2) {
        super(a2);
        this.position = { end: { ha: b2.end.ha, line: b2.end.line, offset: b2.end.offset }, start: { ha: b2.start.ha, line: b2.start.line, offset: b2.start.offset } };
      }
    };
    function gg(a2, b2) {
      if (b2 instanceof Error) throw b2;
      "string" !== typeof a2 && (a2 = eg(a2));
      const c2 = hg(b2);
      a2 = a2.replace(/\r/g, "").split("\n");
      const d2 = Math.floor(Math.log10(Math.min(c2.end.line + 2, a2.length))) + 1;
      a2 = a2.reduce((e2, f2, h2) => {
        var k2 = h2 + 1;
        if (2 < c2.start.line - k2 || 2 < k2 - c2.end.line) return e2;
        h2 = `${Array(d2).fill(" ", 0, Math.floor(Math.log10(k2)) + 1 - d2).join("")}${k2}: `;
        e2.push(`${h2}${f2}`);
        if (k2 >= c2.start.line && k2 <= c2.end.line) {
          const l2 = k2 < c2.end.line ? f2.length + h2.length : c2.end.ha - 1 + h2.length;
          k2 = k2 > c2.start.line ? h2.length : c2.start.ha - 1 + h2.length;
          f2 = " ".repeat(h2.length) + Array.from(f2.substring(0, k2 - h2.length), (n2) => "	" === n2 ? "	" : " ").join("") + "^".repeat(l2 - k2);
          e2.push(f2);
        }
        return e2;
      }, []);
      b2 = ig(b2).join("\n");
      throw new fg(a2.join("\n") + "\n\n" + b2, c2);
    }
    const jg = /* @__PURE__ */ Object.create(null);
    function kg(a2, b2) {
      const c2 = /* @__PURE__ */ new Map();
      for (let d2 = 0; d2 < a2.length + 1; ++d2) c2.set(d2, /* @__PURE__ */ new Map());
      return function h2(e2, f2) {
        if (0 === e2) return f2;
        if (0 === f2) return e2;
        if (c2.get(e2).has(f2)) return c2.get(e2).get(f2);
        var k2 = 0;
        a2[e2 - 1] !== b2[f2 - 1] && (k2 = 1);
        k2 = Math.min(h2(e2 - 1, f2) + 1, h2(e2, f2 - 1) + 1, h2(e2 - 1, f2 - 1) + k2);
        c2.get(e2).set(f2, k2);
        return k2;
      }(a2.length, b2.length);
    }
    function lg(a2) {
      const b2 = jg[a2] ? jg[a2] : Object.keys(jg).map((c2) => ({ name: c2, sb: kg(a2, c2.slice(c2.lastIndexOf(":") + 1)) })).sort((c2, d2) => c2.sb - d2.sb).slice(0, 5).filter((c2) => c2.sb < a2.length / 2).reduce((c2, d2) => c2.concat(jg[d2.name]), []).slice(0, 5);
      return b2.length ? b2.map((c2) => `"Q{${c2.namespaceURI}}${c2.localName} (${c2.j.map((d2) => 4 === d2 ? "..." : Ha(d2)).join(", ")})"`).reduce((c2, d2, e2, f2) => 0 === e2 ? c2 + d2 : c2 + ((e2 !== f2.length - 1 ? ", " : " or ") + d2), "Did you mean ") + "?" : "No similar functions found.";
    }
    function mg(a2, b2, c2) {
      var d2 = jg[a2 + ":" + b2];
      return d2 ? (d2 = d2.find((e2) => e2.j.some((f2) => 4 === f2) ? e2.j.length - 1 <= c2 : e2.j.length === c2)) ? { j: d2.j, arity: c2, callFunction: d2.callFunction, I: d2.I, localName: b2, namespaceURI: a2, i: d2.i } : null : null;
    }
    function ng(a2, b2, c2, d2, e2) {
      jg[a2 + ":" + b2] || (jg[a2 + ":" + b2] = []);
      jg[a2 + ":" + b2].push({ j: c2, arity: c2.length, callFunction: e2, I: false, localName: b2, namespaceURI: a2, i: d2 });
    }
    var og = { xml: "http://www.w3.org/XML/1998/namespace", xs: "http://www.w3.org/2001/XMLSchema", fn: "http://www.w3.org/2005/xpath-functions", map: "http://www.w3.org/2005/xpath-functions/map", array: "http://www.w3.org/2005/xpath-functions/array", math: "http://www.w3.org/2005/xpath-functions/math", fontoxpath: "http://fontoxml.com/fontoxpath", local: "http://www.w3.org/2005/xquery-local-functions" };
    var pg = class {
      constructor(a2, b2, c2, d2) {
        this.Da = [/* @__PURE__ */ Object.create(null)];
        this.Ea = /* @__PURE__ */ Object.create(null);
        this.s = a2;
        this.ia = Object.keys(b2).reduce((e2, f2) => {
          if (void 0 === b2[f2]) return e2;
          e2[f2] = `Q{}${f2}[0]`;
          return e2;
        }, /* @__PURE__ */ Object.create(null));
        this.o = /* @__PURE__ */ Object.create(null);
        this.h = /* @__PURE__ */ Object.create(null);
        this.v = c2;
        this.l = d2;
        this.D = [];
      }
      va(a2, b2, c2) {
        return mg(a2, b2, c2);
      }
      eb(a2, b2) {
        if (a2) return null;
        a2 = this.ia[b2];
        this.o[b2] || (this.o[b2] = { name: b2 });
        return a2;
      }
      Sa(a2, b2) {
        const c2 = this.l(a2, b2);
        if (c2) this.D.push({ dc: a2, arity: b2, Db: c2 });
        else if ("" === a2.prefix) {
          if (this.v) return {
            namespaceURI: this.v,
            localName: a2.localName
          };
        } else if (b2 = this.$(a2.prefix, true)) return { namespaceURI: b2, localName: a2.localName };
        return c2;
      }
      $(a2, b2 = true) {
        if (!b2) return null;
        if (og[a2]) return og[a2];
        b2 = this.s(a2);
        this.h[a2] || (this.h[a2] = { namespaceURI: b2, prefix: a2 });
        return void 0 !== b2 || a2 ? b2 : null;
      }
    };
    var qg = (a2, b2) => {
      a2 = 2 === a2.node.nodeType ? `${a2.node.nodeName}="${hb(b2, a2)}"` : a2.node.outerHTML;
      return Error(`XQTY0024: The node ${a2} follows a node that is not an attribute node or a namespace node.`);
    }, rg = (a2) => Error(`XQDY0044: The node name "${a2.za()}" is invalid for a computed attribute constructor.`), sg = () => Error("XQST0045: Functions and variables may not be declared in one of the reserved namespace URIs."), tg = (a2, b2) => Error(`XQST0049: The function or variable "Q{${a2}}${b2}" is declared more than once.`), ug = () => Error("XQST0060: Functions declared in a module or as an external function must reside in a namespace."), vg = () => Error("XQST0066: A Prolog may contain at most one default function namespace declaration."), wg = () => Error("XQST0070: The prefixes xml and xmlns may not be used in a namespace declaration or be bound to another namespaceURI."), xg = (a2) => Error(`XQDY0074: The value "${a2}" of a name expressions cannot be converted to an expanded QName.`), yg = (a2) => Error(`XPST0081: The prefix "${a2}" could not be resolved`);
    function zg(a2, b2) {
      return `Q{${a2 || ""}}${b2}`;
    }
    function Ag(a2, b2) {
      for (let c2 = a2.length - 1; 0 <= c2; --c2) if (b2 in a2[c2]) return a2[c2][b2];
    }
    function Ef(a2) {
      const b2 = new Bg(a2.o);
      for (let c2 = 0; c2 < a2.h + 1; ++c2) b2.D = [Object.assign(/* @__PURE__ */ Object.create(null), b2.D[0], a2.D[c2])], b2.Da = [Object.assign(/* @__PURE__ */ Object.create(null), b2.Da[0], a2.Da[c2])], b2.l = Object.assign(/* @__PURE__ */ Object.create(null), a2.l), b2.Ea = a2.Ea, b2.v = a2.v;
      return b2;
    }
    function Cg(a2) {
      a2.s++;
      a2.h++;
      a2.D[a2.h] = /* @__PURE__ */ Object.create(null);
      a2.Da[a2.h] = /* @__PURE__ */ Object.create(null);
    }
    function Dg(a2, b2, c2) {
      return (a2 = a2.Ea[zg(b2, c2)]) ? a2 : null;
    }
    function Eg(a2, b2, c2, d2, e2) {
      d2 = zg(b2, c2) + "~" + d2;
      if (a2.l[d2]) throw tg(b2, c2);
      a2.l[d2] = e2;
    }
    function Fg(a2, b2, c2) {
      a2.D[a2.h][b2] = c2;
    }
    function Gg(a2, b2, c2) {
      b2 = zg(b2 || "", c2);
      return a2.Da[a2.h][b2] = `${b2}[${a2.s}]`;
    }
    function Hg(a2, b2, c2, d2) {
      a2.Ea[`${zg(b2 || "", c2)}[${a2.s}]`] = d2;
    }
    function Ig(a2) {
      a2.D.length = a2.h;
      a2.Da.length = a2.h;
      a2.h--;
    }
    var Bg = class {
      constructor(a2) {
        this.o = a2;
        this.s = this.h = 0;
        this.D = [/* @__PURE__ */ Object.create(null)];
        this.l = /* @__PURE__ */ Object.create(null);
        this.v = null;
        this.Ea = a2 && a2.Ea;
        this.Da = a2 && a2.Da;
      }
      va(a2, b2, c2, d2 = false) {
        const e2 = this.l[zg(a2, b2) + "~" + c2];
        return !e2 || d2 && e2.wb ? null === this.o ? null : this.o.va(a2, b2, c2, d2) : e2;
      }
      eb(a2, b2) {
        const c2 = Ag(this.Da, zg(a2, b2));
        return c2 ? c2 : null === this.o ? null : this.o.eb(a2, b2);
      }
      Sa(a2, b2) {
        var c2 = a2.prefix;
        const d2 = a2.localName;
        return "" === c2 && this.v ? { localName: d2, namespaceURI: this.v } : c2 && (c2 = this.$(c2, false)) ? { localName: d2, namespaceURI: c2 } : null === this.o ? null : this.o.Sa(a2, b2);
      }
      $(a2, b2 = true) {
        const c2 = Ag(this.D, a2 || "");
        return void 0 === c2 ? null === this.o ? void 0 : this.o.$(a2 || "", b2) : c2;
      }
    };
    function F2(a2, b2) {
      "*" === b2 || Array.isArray(b2) || (b2 = [b2]);
      for (let c2 = 1; c2 < a2.length; ++c2) {
        if (!Array.isArray(a2[c2])) continue;
        const d2 = a2[c2];
        if ("*" === b2 || b2.includes(d2[0])) return d2;
      }
      return null;
    }
    function H2(a2) {
      return 2 > a2.length ? "" : "object" === typeof a2[1] ? a2[2] || "" : a2[1] || "";
    }
    function I2(a2, b2) {
      if (!Array.isArray(a2)) return null;
      a2 = a2[1];
      return "object" !== typeof a2 || Array.isArray(a2) ? null : b2 in a2 ? a2[b2] : null;
    }
    function J2(a2, b2) {
      return b2.reduce(F2, a2);
    }
    function K2(a2, b2) {
      const c2 = [];
      for (let d2 = 1; d2 < a2.length; ++d2) {
        if (!Array.isArray(a2[d2])) continue;
        const e2 = a2[d2];
        "*" !== b2 && e2[0] !== b2 || c2.push(e2);
      }
      return c2;
    }
    function Jg(a2) {
      return { localName: H2(a2), namespaceURI: I2(a2, "URI"), prefix: I2(a2, "prefix") };
    }
    function Kg(a2) {
      const b2 = F2(a2, "typeDeclaration");
      if (!b2 || F2(b2, "voidSequenceType")) return { type: 59, g: 2 };
      const c2 = (f2) => {
        switch (f2[0]) {
          case "documentTest":
            return 55;
          case "elementTest":
            return 54;
          case "attributeTest":
            return 47;
          case "piTest":
            return 57;
          case "commentTest":
            return 58;
          case "textTest":
            return 56;
          case "anyKindTest":
            return 53;
          case "anyItemType":
            return 59;
          case "anyFunctionTest":
          case "functionTest":
          case "typedFunctionTest":
            return 60;
          case "anyMapTest":
          case "typedMapTest":
            return 61;
          case "anyArrayTest":
          case "typedArrayTest":
            return 62;
          case "atomicType":
            return Ia([I2(f2, "prefix"), H2(f2)].join(":"));
          case "parenthesizedItemType":
            return c2(F2(f2, "*"));
          default:
            throw Error(`Type declaration "${F2(b2, "*")[0]}" is not supported.`);
        }
      };
      a2 = { type: c2(F2(b2, "*")), g: 3 };
      let d2 = null;
      const e2 = F2(b2, "occurrenceIndicator");
      e2 && (d2 = H2(e2));
      switch (d2) {
        case "*":
          return a2.g = 2, a2;
        case "?":
          return a2.g = 0, a2;
        case "+":
          return a2.g = 1, a2;
        case "":
        case null:
          return a2;
      }
    }
    function L2(a2, b2, c2) {
      if ("object" !== typeof a2[1] || Array.isArray(a2[1])) {
        const d2 = {};
        d2[b2] = c2;
        a2.splice(1, 0, d2);
      } else a2[1][b2] = c2;
    }
    function Lg(a2) {
      const b2 = { type: 62, g: 3 };
      L2(a2, "type", b2);
      return b2;
    }
    function Mg(a2, b2) {
      if (!b2 || !b2.ga) return { type: 59, g: 2 };
      var c2 = F2(a2, "EQName");
      if (!c2) return { type: 59, g: 2 };
      var d2 = Jg(c2);
      c2 = d2.localName;
      const e2 = d2.prefix;
      d2 = K2(F2(a2, "arguments"), "*");
      c2 = b2.ga.Sa({ localName: c2, prefix: e2 }, d2.length);
      if (!c2) return { type: 59, g: 2 };
      b2 = b2.ga.va(c2.namespaceURI, c2.localName, d2.length + 1);
      if (!b2) return { type: 59, g: 2 };
      59 !== b2.i.type && L2(a2, "type", b2.i);
      return b2.i;
    }
    function M2(a2, b2, c2) {
      return (a2 << 20) + (b2 << 12) + (c2.charCodeAt(0) << 8) + c2.charCodeAt(1);
    }
    var Ng = { [M2(2, 2, "idivOp")]: 5, [M2(16, 16, "addOp")]: 16, [M2(16, 16, "subtractOp")]: 16, [M2(16, 16, "divOp")]: 4, [M2(16, 2, "multiplyOp")]: 16, [M2(16, 2, "divOp")]: 16, [M2(2, 16, "multiplyOp")]: 16, [M2(17, 17, "addOp")]: 17, [M2(17, 17, "subtractOp")]: 17, [M2(17, 17, "divOp")]: 4, [M2(17, 2, "multiplyOp")]: 17, [M2(17, 2, "divOp")]: 17, [M2(2, 17, "multiplyOp")]: 17, [M2(9, 9, "subtractOp")]: 17, [M2(7, 7, "subtractOp")]: 17, [M2(8, 8, "subtractOp")]: 17, [M2(9, 16, "addOp")]: 9, [M2(9, 16, "subtractOp")]: 9, [M2(9, 17, "addOp")]: 9, [M2(9, 17, "subtractOp")]: 9, [M2(7, 16, "addOp")]: 7, [M2(
      7,
      16,
      "subtractOp"
    )]: 7, [M2(7, 17, "addOp")]: 7, [M2(7, 17, "subtractOp")]: 7, [M2(8, 17, "addOp")]: 8, [M2(8, 17, "subtractOp")]: 8, [M2(9, 16, "addOp")]: 9, [M2(9, 16, "subtractOp")]: 9, [M2(9, 17, "addOp")]: 9, [M2(9, 17, "subtractOp")]: 9, [M2(7, 17, "addOp")]: 7, [M2(7, 17, "subtractOp")]: 7, [M2(7, 16, "addOp")]: 7, [M2(7, 16, "subtractOp")]: 7, [M2(8, 17, "addOp")]: 8, [M2(8, 17, "subtractOp")]: 8 }, Og = {
      [M2(2, 2, "addOp")]: (a2, b2) => a2 + b2,
      [M2(2, 2, "subtractOp")]: (a2, b2) => a2 - b2,
      [M2(2, 2, "multiplyOp")]: (a2, b2) => a2 * b2,
      [M2(2, 2, "divOp")]: (a2, b2) => a2 / b2,
      [M2(2, 2, "modOp")]: (a2, b2) => a2 % b2,
      [M2(2, 2, "idivOp")]: (a2, b2) => Math.trunc(a2 / b2),
      [M2(16, 16, "addOp")]: function(a2, b2) {
        return new Kc(a2.ea + b2.ea);
      },
      [M2(16, 16, "subtractOp")]: function(a2, b2) {
        return new Kc(a2.ea - b2.ea);
      },
      [M2(16, 16, "divOp")]: function(a2, b2) {
        return a2.ea / b2.ea;
      },
      [M2(16, 2, "multiplyOp")]: Mc,
      [M2(16, 2, "divOp")]: function(a2, b2) {
        if (isNaN(b2)) throw Error("FOCA0005: Cannot divide xs:yearMonthDuration by NaN");
        a2 = Math.round(a2.ea / b2);
        if (a2 > Number.MAX_SAFE_INTEGER || !Number.isFinite(a2)) throw Error("FODT0002: Value overflow while dividing xs:yearMonthDuration");
        return new Kc(a2 < Number.MIN_SAFE_INTEGER || 0 === a2 ? 0 : a2);
      },
      [M2(2, 16, "multiplyOp")]: (a2, b2) => Mc(b2, a2),
      [M2(17, 17, "addOp")]: function(a2, b2) {
        return new yb(a2.ca + b2.ca);
      },
      [M2(17, 17, "subtractOp")]: function(a2, b2) {
        return new yb(a2.ca - b2.ca);
      },
      [M2(17, 17, "divOp")]: function(a2, b2) {
        if (0 === b2.ca) throw Error("FOAR0001: Division by 0");
        return a2.ca / b2.ca;
      },
      [M2(17, 2, "multiplyOp")]: Cb,
      [M2(17, 2, "divOp")]: function(a2, b2) {
        if (isNaN(b2)) throw Error("FOCA0005: Cannot divide xs:dayTimeDuration by NaN");
        a2 = a2.ca / b2;
        if (a2 > Number.MAX_SAFE_INTEGER || !Number.isFinite(a2)) throw Error("FODT0002: Value overflow while dividing xs:dayTimeDuration");
        return new yb(a2 < Number.MIN_SAFE_INTEGER || Object.is(-0, a2) ? 0 : a2);
      },
      [M2(2, 17, "multiplyOp")]: (a2, b2) => Cb(b2, a2),
      [M2(9, 9, "subtractOp")]: Pb,
      [M2(7, 7, "subtractOp")]: Pb,
      [M2(8, 8, "subtractOp")]: Pb,
      [M2(9, 16, "addOp")]: Qb,
      [M2(9, 16, "subtractOp")]: Rb,
      [M2(9, 17, "addOp")]: Qb,
      [M2(9, 17, "subtractOp")]: Rb,
      [M2(7, 16, "addOp")]: Qb,
      [M2(7, 16, "subtractOp")]: Rb,
      [M2(7, 17, "addOp")]: Qb,
      [M2(7, 17, "subtractOp")]: Rb,
      [M2(8, 17, "addOp")]: Qb,
      [M2(8, 17, "subtractOp")]: Rb,
      [M2(9, 16, "addOp")]: Qb,
      [M2(9, 16, "subtractOp")]: Rb,
      [M2(9, 17, "addOp")]: Qb,
      [M2(9, 17, "subtractOp")]: Rb,
      [M2(7, 17, "addOp")]: Qb,
      [M2(7, 17, "subtractOp")]: Rb,
      [M2(7, 16, "addOp")]: Qb,
      [M2(7, 16, "subtractOp")]: Rb,
      [M2(8, 17, "addOp")]: Qb,
      [M2(8, 17, "subtractOp")]: Rb
    };
    function Pg(a2, b2) {
      return v2(a2, 5) && v2(b2, 5) ? 5 : v2(a2, 4) && v2(b2, 4) ? 4 : v2(a2, 6) && v2(b2, 6) ? 6 : 3;
    }
    const Qg = [2, 16, 17, 9, 7, 8];
    function Rg(a2, b2, c2) {
      function d2(l2, n2) {
        return { U: e2 ? e2(l2) : l2, V: f2 ? f2(n2) : n2 };
      }
      let e2 = null, f2 = null;
      v2(b2, 19) && (e2 = (l2) => jd(l2, 3), b2 = 3);
      v2(c2, 19) && (f2 = (l2) => jd(l2, 3), c2 = 3);
      const h2 = Qg.filter((l2) => v2(b2, l2)), k2 = Qg.filter((l2) => v2(c2, l2));
      if (h2.includes(2) && k2.includes(2)) {
        const l2 = Og[M2(2, 2, a2)];
        let n2 = Ng[M2(2, 2, a2)];
        n2 || (n2 = Pg(b2, c2));
        "divOp" === a2 && 5 === n2 && (n2 = 4);
        return "idivOp" === a2 ? Sg(d2, l2)[0] : (t2, u2) => {
          const { U: z2, V: y2 } = d2(t2, u2);
          return g2(l2(z2.value, y2.value), n2);
        };
      }
      for (const l2 of h2) for (const n2 of k2) {
        const t2 = Og[M2(l2, n2, a2)], u2 = Ng[M2(l2, n2, a2)];
        if (t2 && void 0 !== u2) return (z2, y2) => {
          const {
            U: G2,
            V: N2
          } = d2(z2, y2);
          return g2(t2(G2.value, N2.value), u2);
        };
      }
    }
    function Tg(a2, b2, c2) {
      function d2(n2, t2) {
        return { U: f2 ? f2(n2) : n2, V: h2 ? h2(t2) : t2 };
      }
      var e2 = [2, 53, 59, 46, 47];
      if (e2.includes(b2) || e2.includes(c2)) return 2;
      let f2 = null, h2 = null;
      v2(b2, 19) && (f2 = (n2) => jd(n2, 3), b2 = 3);
      v2(c2, 19) && (h2 = (n2) => jd(n2, 3), c2 = 3);
      var k2 = Qg.filter((n2) => v2(b2, n2));
      e2 = Qg.filter((n2) => v2(c2, n2));
      if (k2.includes(2) && e2.includes(2)) {
        var l2 = Ng[M2(2, 2, a2)];
        void 0 === l2 && (l2 = Pg(b2, c2));
        "divOp" === a2 && 5 === l2 && (l2 = 4);
        return "idivOp" === a2 ? Sg(d2, (n2, t2) => Math.trunc(n2 / t2))[1] : l2;
      }
      for (l2 of k2) for (const n2 of e2) if (k2 = Ng[M2(l2, n2, a2)], void 0 !== k2) return k2;
    }
    function Sg(a2, b2) {
      return [(c2, d2) => {
        const { U: e2, V: f2 } = a2(c2, d2);
        if (0 === f2.value) throw Error("FOAR0001: Divisor of idiv operator cannot be (-)0");
        if (Number.isNaN(e2.value) || Number.isNaN(f2.value) || !Number.isFinite(e2.value)) throw Error("FOAR0002: One of the operands of idiv is NaN or the first operand is (-)INF");
        return Number.isFinite(e2.value) && !Number.isFinite(f2.value) ? g2(0, 5) : g2(b2(e2.value, f2.value), 5);
      }, 5];
    }
    const Ug = /* @__PURE__ */ Object.create(null);
    var Vg = class extends D2 {
      constructor(a2, b2, c2, d2, e2) {
        super(b2.o.add(c2.o), [b2, c2], { B: false }, false, d2);
        this.A = b2;
        this.L = c2;
        this.l = a2;
        this.s = e2;
      }
      h(a2, b2) {
        return qc(C2(this.A, a2, b2), b2).N((c2) => 0 === c2.length ? w2.empty() : qc(C2(this.L, a2, b2), b2).N((d2) => {
          if (0 === d2.length) return w2.empty();
          if (1 < c2.length || 1 < d2.length) throw Error('XPTY0004: the operands of the "' + this.l + '" operator should be empty or singleton.');
          const e2 = c2[0];
          d2 = d2[0];
          if (this.s && this.type) return w2.m(this.s(e2, d2));
          var f2 = e2.type;
          var h2 = d2.type, k2 = this.l;
          const l2 = `${f2}~${h2}~${k2}`;
          let n2 = Ug[l2];
          n2 || (n2 = Ug[l2] = Rg(k2, f2, h2));
          f2 = n2;
          if (!f2) throw Error(`XPTY0004: ${this.l} not available for types ${Da[e2.type]} and ${Da[d2.type]}`);
          return w2.m(f2(e2, d2));
        }));
      }
    };
    function Wg(a2, b2) {
      var c2 = O2;
      let d2 = false;
      for (var e2 = 1; e2 < a2.length; e2++) switch (a2[e2][0]) {
        case "letClause":
          Xg(b2);
          var f2 = a2[e2], h2 = b2, k2 = c2, l2 = J2(f2, ["letClauseItem", "typedVariableBinding", "varName"]);
          l2 = Jg(l2);
          f2 = J2(f2, ["letClauseItem", "letExpr"]);
          k2 = k2(f2[1], h2);
          Yg(h2, l2.localName, k2);
          break;
        case "forClause":
          d2 = true;
          Xg(b2);
          Zg(a2[e2], b2, c2);
          break;
        case "whereClause":
          Xg(b2);
          h2 = a2[e2];
          c2(h2, b2);
          L2(h2, "type", { type: 0, g: 3 });
          break;
        case "orderByClause":
          Xg(b2);
          break;
        case "returnClause":
          e2 = a2[e2];
          h2 = c2;
          c2 = J2(e2, ["*"]);
          b2 = h2(c2, b2);
          L2(c2, "type", b2);
          L2(e2, "type", b2);
          c2 = b2;
          if (!c2) return {
            type: 59,
            g: 2
          };
          d2 && (c2 = { type: c2.type, g: 2 });
          59 !== c2.type && L2(a2, "type", c2);
          return c2;
        default:
          c2 = c2(a2[e2], b2);
          if (!c2) return { type: 59, g: 2 };
          d2 && (c2 = { type: c2.type, g: 2 });
          59 !== c2.type && L2(a2, "type", c2);
          return c2;
      }
      if (0 < b2.h) b2.h--, b2.o.pop(), b2.v.pop();
      else throw Error("Variable scope out of bound");
    }
    function Zg(a2, b2, c2) {
      const d2 = Jg(J2(a2, ["forClauseItem", "typedVariableBinding", "varName"]));
      if (a2 = J2(a2, ["forClauseItem", "forExpr", "sequenceExpr"])) a2 = K2(a2, "*").map((e2) => c2(e2, b2)), a2.includes(void 0) || a2.includes(null) || (a2 = $g(a2), 1 === a2.length && Yg(b2, d2.localName, a2[0]));
    }
    function $g(a2) {
      return a2.filter((b2, c2, d2) => d2.findIndex((e2) => e2.type === b2.type && e2.g === b2.g) === c2);
    }
    function ah(a2, b2) {
      if (!b2 || !b2.ga) return { type: 59, g: 2 };
      const c2 = F2(a2, "functionName");
      var d2 = Jg(c2);
      let e2 = d2.localName;
      var f2 = d2.prefix;
      let h2 = d2.namespaceURI;
      d2 = K2(F2(a2, "arguments"), "*");
      if (null === h2) {
        f2 = b2.ga.Sa({ localName: e2, prefix: f2 }, d2.length);
        if (!f2) return { type: 59, g: 2 };
        e2 = f2.localName;
        h2 = f2.namespaceURI;
        L2(c2, "URI", h2);
        c2[2] = e2;
      }
      b2 = b2.ga.va(h2, e2, d2.length);
      if (!b2 || 63 === b2.i.type) return { type: 59, g: 2 };
      59 !== b2.i.type && L2(a2, "type", b2.i);
      return b2.i;
    }
    function bh(a2) {
      const b2 = { type: 61, g: 3 };
      L2(a2, "type", b2);
      return b2;
    }
    function ch(a2, b2) {
      if (!b2 || !b2.ga) return { type: 59, g: 2 };
      const c2 = F2(a2, "functionName");
      var d2 = Jg(c2);
      let e2 = d2.localName;
      var f2 = d2.namespaceURI;
      const h2 = d2.prefix;
      d2 = Number(J2(a2, ["integerConstantExpr", "value"])[1]);
      if (!f2) {
        f2 = b2.ga.Sa({ localName: e2, prefix: h2 }, d2);
        if (!f2) return { type: 59, g: 2 };
        e2 = f2.localName;
        f2 = f2.namespaceURI;
        L2(c2, "URI", f2);
      }
      b2 = b2.ga.va(f2, e2, d2) || null;
      if (!b2) return { type: 59, g: 2 };
      59 !== b2.i.type && 63 !== b2.i.type && L2(a2, "type", b2.i);
      return b2.i;
    }
    function dh(a2, b2) {
      var c2 = K2(a2, "stepExpr");
      if (!c2) return { type: 59, g: 2 };
      for (const f2 of c2) {
        a: {
          c2 = f2;
          var d2 = b2;
          let h2 = null;
          if (!c2) break a;
          var e2 = K2(c2, "*");
          let k2 = "";
          for (const l2 of e2) switch (l2[0]) {
            case "filterExpr":
              h2 = I2(J2(l2, ["*"]), "type");
              break;
            case "xpathAxis":
              k2 = l2[1];
              b: {
                switch (k2) {
                  case "attribute":
                    h2 = { type: 47, g: 2 };
                    break b;
                  case "child":
                  case "decendant":
                  case "self":
                  case "descendant-or-self":
                  case "following-sibling":
                  case "following":
                  case "namespace":
                  case "parent":
                  case "ancestor":
                  case "preceding-sibling":
                  case "preceding":
                  case "ancestor-or-self":
                    h2 = { type: 53, g: 2 };
                    break b;
                }
                h2 = void 0;
              }
              break;
            case "nameTest":
              e2 = Jg(l2);
              if (null !== e2.namespaceURI) break;
              if ("attribute" === k2 && !e2.prefix) break;
              e2 = d2.$(e2.prefix || "");
              void 0 !== e2 && L2(l2, "URI", e2);
              break;
            case "lookup":
              h2 = { type: 59, g: 2 };
          }
          h2 && 59 !== h2.type && L2(c2, "type", h2);
        }
        d2 = I2(f2, "type");
      }
      d2 && 59 !== d2.type && L2(a2, "type", d2);
      return d2;
    }
    function eh(a2) {
      const b2 = { type: 0, g: 3 };
      L2(a2, "type", b2);
      return b2;
    }
    function fh(a2, b2, c2) {
      0 === b2 ? b2 = { type: 53, g: 2 } : 1 === b2 ? b2 = c2[0] : c2.includes(void 0) || c2.includes(null) ? b2 = { type: 59, g: 2 } : (b2 = $g(c2), b2 = 1 < b2.length ? { type: 59, g: 2 } : { type: b2[0].type, g: 2 });
      b2 && 59 !== b2.type && L2(a2, "type", b2);
      return b2;
    }
    function gh(a2, b2, c2, d2) {
      if (!b2 || c2.includes(void 0)) return { type: 59, g: 2 };
      var e2 = K2(a2, "typeswitchExprCaseClause");
      for (let h2 = 0; h2 < c2.length; h2++) {
        var f2 = F2(e2[h2], "*");
        switch (f2[0]) {
          case "sequenceType":
            if (f2 = hh(f2, b2, c2[h2])) return 59 !== f2.type && L2(a2, "type", f2), f2;
            continue;
          case "sequenceTypeUnion":
            for (d2 = K2(f2, "*"), e2 = 0; 2 > e2; e2++) if (f2 = hh(d2[e2], b2, c2[h2])) return 59 !== f2.type && L2(a2, "type", f2), f2;
          default:
            return { type: 59, g: 2 };
        }
      }
      59 !== d2.type && L2(a2, "type", d2);
      return d2;
    }
    function hh(a2, b2, c2) {
      const d2 = K2(a2, "*"), e2 = F2(a2, "atomicType");
      if (!e2) return { type: 59, g: 2 };
      if (Ia(I2(e2, "prefix") + ":" + e2[2]) === b2.type) {
        if (1 === d2.length) {
          if (3 === b2.g) return c2;
        } else if (a2 = F2(a2, "occurrenceIndicator")[1], b2.g === Ka(a2)) return c2;
      }
    }
    function ih(a2, b2) {
      O2(a2, b2);
    }
    function O2(a2, b2) {
      var c2 = jh.get(a2[0]);
      if (c2) return c2(a2, b2);
      for (c2 = 1; c2 < a2.length; c2++) a2[c2] && O2(a2[c2], b2);
    }
    const kh = (a2, b2) => {
      var c2 = O2(F2(a2, "firstOperand")[1], b2);
      const d2 = O2(F2(a2, "secondOperand")[1], b2);
      var e2 = a2[0];
      if (c2 && d2) if (b2 = Tg(e2, c2.type, d2.type)) c2 = { type: b2, g: c2.g }, 2 !== b2 && 59 !== b2 && L2(a2, "type", c2), a2 = c2;
      else throw Error(`XPTY0004: ${e2} not available for types ${Ha(c2)} and ${Ha(d2)}`);
      else a2 = { type: 2, g: 3 };
      return a2;
    }, lh = (a2, b2) => {
      O2(F2(a2, "firstOperand")[1], b2);
      O2(F2(a2, "secondOperand")[1], b2);
      a: {
        switch (a2[0]) {
          case "orOp":
            b2 = { type: 0, g: 3 };
            L2(a2, "type", b2);
            a2 = b2;
            break a;
          case "andOp":
            b2 = { type: 0, g: 3 };
            L2(a2, "type", b2);
            a2 = b2;
            break a;
        }
        a2 = void 0;
      }
      return a2;
    }, mh = (a2, b2) => {
      O2(F2(a2, "firstOperand")[1], b2);
      O2(F2(a2, "secondOperand")[1], b2);
      a: {
        switch (a2[0]) {
          case "unionOp":
            b2 = { type: 53, g: 2 };
            L2(a2, "type", b2);
            a2 = b2;
            break a;
          case "intersectOp":
            b2 = { type: 53, g: 2 };
            L2(a2, "type", b2);
            a2 = b2;
            break a;
          case "exceptOp":
            b2 = { type: 53, g: 2 };
            L2(a2, "type", b2);
            a2 = b2;
            break a;
        }
        a2 = void 0;
      }
      return a2;
    }, nh = (a2, b2) => {
      O2(F2(a2, "firstOperand")[1], b2);
      O2(F2(a2, "secondOperand")[1], b2);
      b2 = { type: 0, g: 3 };
      L2(a2, "type", b2);
      return b2;
    }, oh = (a2, b2) => {
      O2(F2(a2, "firstOperand")[1], b2);
      O2(F2(a2, "secondOperand")[1], b2);
      b2 = I2(J2(a2, ["firstOperand", "*"]), "type");
      const c2 = I2(J2(
        a2,
        ["secondOperand", "*"]
      ), "type");
      b2 = { type: 0, g: wc(b2) || wc(c2) ? 0 : 3 };
      L2(a2, "type", b2);
      return b2;
    }, ph = (a2, b2) => {
      O2(F2(a2, "firstOperand")[1], b2);
      O2(F2(a2, "secondOperand")[1], b2);
      b2 = I2(J2(a2, ["firstOperand", "*"]), "type");
      const c2 = I2(J2(a2, ["secondOperand", "*"]), "type");
      b2 = { type: 0, g: wc(b2) || wc(c2) ? 0 : 3 };
      L2(a2, "type", b2);
      return b2;
    }, jh = /* @__PURE__ */ new Map([["unaryMinusOp", (a2, b2) => {
      b2 = O2(F2(a2, "operand")[1], b2);
      b2 ? v2(b2.type, 2) ? (b2 = { type: b2.type, g: b2.g }, L2(a2, "type", b2), a2 = b2) : (b2 = { type: 3, g: 3 }, L2(a2, "type", b2), a2 = b2) : (b2 = { type: 2, g: 2 }, L2(a2, "type", b2), a2 = b2);
      return a2;
    }], [
      "unaryPlusOp",
      (a2, b2) => {
        b2 = O2(F2(a2, "operand")[1], b2);
        b2 ? v2(b2.type, 2) ? (b2 = { type: b2.type, g: b2.g }, L2(a2, "type", b2), a2 = b2) : (b2 = { type: 3, g: 3 }, L2(a2, "type", b2), a2 = b2) : (b2 = { type: 2, g: 2 }, L2(a2, "type", b2), a2 = b2);
        return a2;
      }
    ], ["addOp", kh], ["subtractOp", kh], ["divOp", kh], ["idivOp", kh], ["modOp", kh], ["multiplyOp", kh], ["andOp", lh], ["orOp", lh], ["sequenceExpr", (a2, b2) => {
      const c2 = K2(a2, "*"), d2 = c2.map((e2) => O2(e2, b2));
      return fh(a2, c2.length, d2);
    }], ["unionOp", mh], ["intersectOp", mh], ["exceptOp", mh], ["stringConcatenateOp", (a2, b2) => {
      O2(F2(a2, "firstOperand")[1], b2);
      O2(
        F2(a2, "secondOperand")[1],
        b2
      );
      b2 = { type: 1, g: 3 };
      L2(a2, "type", b2);
      return b2;
    }], ["rangeSequenceExpr", (a2, b2) => {
      O2(F2(a2, "startExpr")[1], b2);
      O2(F2(a2, "endExpr")[1], b2);
      b2 = { type: 5, g: 1 };
      L2(a2, "type", b2);
      return b2;
    }], ["equalOp", nh], ["notEqualOp", nh], ["lessThanOrEqualOp", nh], ["lessThanOp", nh], ["greaterThanOrEqualOp", nh], ["greaterThanOp", nh], ["eqOp", oh], ["neOp", oh], ["ltOp", oh], ["leOp", oh], ["gtOp", oh], ["geOp", oh], ["isOp", ph], ["nodeBeforeOp", ph], ["nodeAfterOp", ph], ["pathExpr", (a2, b2) => {
      const c2 = F2(a2, "rootExpr");
      c2 && c2[1] && O2(c2[1], b2);
      K2(a2, "stepExpr").map((d2) => O2(d2, b2));
      return dh(a2, b2);
    }], ["contextItemExpr", () => ({ type: 59, g: 2 })], ["ifThenElseExpr", (a2, b2) => {
      var c2 = F2(a2, "ifClause") || F2(K2(a2, "x:stackTrace")[0], "ifClause");
      const d2 = F2(a2, "thenClause") || F2(K2(a2, "x:stackTrace")[1], "thenClause"), e2 = F2(a2, "elseClause") || F2(K2(a2, "x:stackTrace")[2], "elseClause");
      O2(F2(c2, "*"), b2);
      c2 = O2(F2(d2, "*"), b2);
      b2 = O2(F2(e2, "*"), b2);
      c2 && b2 ? c2.type === b2.type && c2.g === b2.g ? (59 !== c2.type && L2(a2, "type", c2), a2 = c2) : a2 = { type: 59, g: 2 } : a2 = { type: 59, g: 2 };
      return a2;
    }], ["instanceOfExpr", (a2, b2) => {
      O2(F2(a2, "argExpr"), b2);
      O2(F2(a2, "sequenceType"), b2);
      b2 = {
        type: 0,
        g: 3
      };
      L2(a2, "type", b2);
      return b2;
    }], ["integerConstantExpr", (a2) => {
      const b2 = { type: 5, g: 3 };
      L2(a2, "type", b2);
      return b2;
    }], ["doubleConstantExpr", (a2) => {
      const b2 = { type: 3, g: 3 };
      L2(a2, "type", b2);
      return b2;
    }], ["decimalConstantExpr", (a2) => {
      const b2 = { type: 4, g: 3 };
      L2(a2, "type", b2);
      return b2;
    }], ["stringConstantExpr", (a2) => {
      const b2 = { type: 1, g: 3 };
      L2(a2, "type", b2);
      return b2;
    }], ["functionCallExpr", (a2, b2) => {
      const c2 = F2(a2, "arguments");
      K2(c2, "*").map((d2) => O2(d2, b2));
      return ah(a2, b2);
    }], ["arrowExpr", (a2, b2) => {
      O2(F2(a2, "argExpr")[1], b2);
      return Mg(a2, b2);
    }], [
      "dynamicFunctionInvocationExpr",
      (a2, b2) => {
        O2(J2(a2, ["functionItem", "*"]), b2);
        (a2 = F2(a2, "arguments")) && O2(a2, b2);
        return { type: 59, g: 2 };
      }
    ], ["namedFunctionRef", (a2, b2) => ch(a2, b2)], ["inlineFunctionExpr", (a2, b2) => {
      O2(F2(a2, "functionBody")[1], b2);
      b2 = { type: 60, g: 3 };
      L2(a2, "type", b2);
      return b2;
    }], ["castExpr", (a2) => {
      var b2 = J2(a2, ["singleType", "atomicType"]);
      b2 = { type: Ia(I2(b2, "prefix") + ":" + b2[2]), g: 3 };
      59 !== b2.type && L2(a2, "type", b2);
      return b2;
    }], ["castableExpr", (a2) => {
      const b2 = { type: 0, g: 3 };
      L2(a2, "type", b2);
      return b2;
    }], ["simpleMapExpr", (a2, b2) => {
      const c2 = K2(a2, "pathExpr");
      let d2;
      for (let e2 = 0; e2 < c2.length; e2++) d2 = O2(c2[e2], b2);
      void 0 !== d2 && null !== d2 ? ((b2 = { type: d2.type, g: 2 }, 59 !== b2.type) && L2(a2, "type", b2), a2 = b2) : a2 = { type: 59, g: 2 };
      return a2;
    }], ["mapConstructor", (a2, b2) => {
      K2(a2, "mapConstructorEntry").map((c2) => ({ key: O2(J2(c2, ["mapKeyExpr", "*"]), b2), value: O2(J2(c2, ["mapValueExpr", "*"]), b2) }));
      return bh(a2);
    }], ["arrayConstructor", (a2, b2) => {
      K2(F2(a2, "*"), "arrayElem").map((c2) => O2(c2, b2));
      return Lg(a2);
    }], ["unaryLookup", (a2) => {
      F2(a2, "NCName");
      return { type: 59, g: 2 };
    }], ["typeswitchExpr", (a2, b2) => {
      const c2 = O2(F2(a2, "argExpr")[1], b2), d2 = K2(a2, "typeswitchExprCaseClause").map((f2) => O2(J2(
        f2,
        ["resultExpr"]
      )[1], b2)), e2 = O2(J2(a2, ["typeswitchExprDefaultClause", "resultExpr"])[1], b2);
      return gh(a2, c2, d2, e2);
    }], ["quantifiedExpr", (a2, b2) => {
      K2(a2, "*").map((c2) => O2(c2, b2));
      return eh(a2);
    }], ["x:stackTrace", (a2, b2) => {
      a2 = K2(a2, "*");
      return O2(a2[0], b2);
    }], ["queryBody", (a2, b2) => O2(a2[1], b2)], ["flworExpr", (a2, b2) => Wg(a2, b2)], ["varRef", (a2, b2) => {
      const c2 = Jg(F2(a2, "name"));
      var d2;
      a: {
        for (d2 = b2.h; 0 <= d2; d2--) {
          const e2 = b2.o[d2][c2.localName];
          if (e2) {
            d2 = e2;
            break a;
          }
        }
        d2 = void 0;
      }
      d2 && 59 !== d2.type && L2(a2, "type", d2);
      null === c2.namespaceURI && (b2 = b2.$(c2.prefix), void 0 !== b2 && L2(
        a2,
        "URI",
        b2
      ));
      return d2;
    }]]);
    function Xg(a2) {
      a2.h++;
      a2.o.push({});
      a2.v.push({});
    }
    function Yg(a2, b2, c2) {
      if (a2.o[a2.h][b2]) throw Error(`Another variable of in the scope ${a2.h} with the same name ${b2} already exists`);
      a2.o[a2.h][b2] = c2;
    }
    var qh = class {
      constructor(a2) {
        this.h = 0;
        this.ga = a2;
        this.o = [{}];
        this.v = [{}];
      }
      $(a2) {
        for (let b2 = this.h; 0 <= b2; b2--) {
          const c2 = this.v[b2][a2];
          if (void 0 !== c2) return c2;
        }
        return this.ga ? this.ga.$(a2) : void 0;
      }
    };
    var rh = class extends D2 {
      constructor(a2, b2) {
        super(new uf({ external: 1 }), a2, { B: a2.every((c2) => c2.B) }, false, b2);
        this.l = a2;
      }
      h(a2, b2) {
        return 0 === this.l.length ? w2.m(new pb([])) : C2(this.l[0], a2, b2).N((c2) => w2.m(new pb(c2.map((d2) => Ra(w2.m(d2))))));
      }
    };
    var sh = class extends D2 {
      constructor(a2, b2) {
        super(new uf({ external: 1 }), a2, { B: a2.every((c2) => c2.B) }, false, b2);
        this.l = a2;
      }
      h(a2, b2) {
        return w2.m(new pb(this.l.map((c2) => Ra(C2(c2, a2, b2)))));
      }
    };
    function th(a2) {
      if (null === a2) throw lc("context is absent, it needs to be present to use axes.");
      if (!v2(a2.type, 53)) throw Error("XPTY0020: Axes can only be applied to nodes.");
      return a2.value;
    }
    function uh(a2, b2, c2) {
      let d2 = b2;
      return { next: () => {
        if (!d2) return p2;
        const e2 = d2;
        d2 = x2(a2, e2, c2);
        return q2(rb(e2));
      } };
    }
    var vh = class extends D2 {
      constructor(a2, b2) {
        b2 = b2 || { Qa: false };
        super(a2.o, [a2], { R: "reverse-sorted", W: false, subtree: false, B: false });
        this.l = a2;
        this.s = !!b2.Qa;
      }
      h(a2, b2) {
        b2 = b2.h;
        a2 = th(a2.M);
        var c2 = this.l.D();
        c2 = c2 && (c2.startsWith("name-") || "type-1" === c2) ? "type-1" : null;
        return w2.create(uh(b2, this.s ? a2 : x2(b2, a2, c2), c2)).filter((d2) => this.l.l(d2));
      }
    };
    const wh = /* @__PURE__ */ new Map([["type-1-or-type-2", ["name", "type-1", "type-2"]], ["type-1", ["name"]], ["type-2", ["name"]]]);
    function xh(a2, b2) {
      if (null === a2) return b2;
      if (null === b2 || a2 === b2) return a2;
      const c2 = a2.startsWith("name-") ? "name" : a2, d2 = b2.startsWith("name-") ? "name" : b2, e2 = wh.get(c2);
      if (void 0 !== e2 && e2.includes(d2)) return b2;
      b2 = wh.get(d2);
      return void 0 !== b2 && b2.includes(c2) ? a2 : "empty";
    }
    var yh = class extends D2 {
      constructor(a2, b2) {
        super(new uf({ attribute: 1 }), [a2], { R: "unsorted", subtree: true, W: true, B: false });
        this.l = a2;
        this.s = xh(this.l.D(), b2);
      }
      h(a2, b2) {
        b2 = b2.h;
        a2 = th(a2.M);
        if (1 !== a2.node.nodeType) return w2.empty();
        a2 = eb(b2, a2, this.s).filter((c2) => "http://www.w3.org/2000/xmlns/" !== c2.node.namespaceURI).map((c2) => rb(c2)).filter((c2) => this.l.l(c2));
        return w2.create(a2);
      }
      D() {
        return "type-1";
      }
    };
    var zh = class extends D2 {
      constructor(a2, b2) {
        super(a2.o, [a2], { R: "sorted", subtree: true, W: true, B: false });
        this.s = a2;
        this.l = xh(b2, a2.D());
      }
      h(a2, b2) {
        const c2 = b2.h, d2 = th(a2.M);
        a2 = d2.node.nodeType;
        if (1 !== a2 && 9 !== a2) return w2.empty();
        let e2 = null, f2 = false;
        return w2.create({ next: () => {
          for (; !f2; ) {
            if (!e2) {
              e2 = ib(c2, d2, this.l);
              if (!e2) {
                f2 = true;
                continue;
              }
              return q2(rb(e2));
            }
            if (e2 = lb(c2, e2, this.l)) return q2(rb(e2));
            f2 = true;
          }
          return p2;
        } }).filter((h2) => this.s.l(h2));
      }
    };
    function Ah(a2, b2, c2) {
      const d2 = b2.node.nodeType;
      if (1 !== d2 && 9 !== d2) return { next: () => p2 };
      let e2 = ib(a2, b2, c2);
      return { next() {
        if (!e2) return p2;
        const f2 = e2;
        e2 = lb(a2, e2, c2);
        return q2(f2);
      } };
    }
    function Bh(a2, b2, c2) {
      const d2 = [kd(b2)];
      return { next: (e2) => {
        0 < d2.length && 0 !== (e2 & 1) && d2.shift();
        if (!d2.length) return p2;
        for (e2 = d2[0].next(0); e2.done; ) {
          d2.shift();
          if (!d2.length) return p2;
          e2 = d2[0].next(0);
        }
        d2.unshift(Ah(a2, e2.value, c2));
        return q2(rb(e2.value));
      } };
    }
    var Ch = class extends D2 {
      constructor(a2, b2) {
        b2 = b2 || { Qa: false };
        super(a2.o, [a2], { B: false, W: false, R: "sorted", subtree: true });
        this.l = a2;
        this.s = !!b2.Qa;
        this.A = (a2 = this.l.D()) && (a2.startsWith("name-") || "type-1" === a2) || "type-1-or-type-2" === a2 ? "type-1" : null;
      }
      h(a2, b2) {
        b2 = b2.h;
        a2 = th(a2.M);
        a2 = Bh(b2, a2, this.A);
        this.s || a2.next(0);
        return w2.create(a2).filter((c2) => this.l.l(c2));
      }
    };
    function Dh(a2, b2, c2) {
      var d2 = a2.node.nodeType;
      if (1 !== d2 && 9 !== d2) return a2;
      for (d2 = kb(b2, a2, c2); null !== d2; ) {
        if (1 !== d2.node.nodeType) return d2;
        a2 = d2;
        d2 = kb(b2, a2, c2);
      }
      return a2;
    }
    function Eh(a2, b2, c2 = false, d2) {
      if (c2) {
        let f2 = b2, h2 = false;
        return { next: () => {
          if (h2) return p2;
          if (md(f2, b2)) return f2 = Dh(b2, a2, d2), md(f2, b2) ? (h2 = true, p2) : q2(rb(f2));
          const k2 = f2.node.nodeType, l2 = 9 === k2 || 2 === k2 ? null : mb(a2, f2, d2);
          if (null !== l2) return f2 = Dh(l2, a2, d2), q2(rb(f2));
          f2 = 9 === k2 ? null : x2(a2, f2, d2);
          return md(f2, b2) ? (h2 = true, p2) : q2(rb(f2));
        } };
      }
      const e2 = [Ah(a2, b2, d2)];
      return { next: () => {
        if (!e2.length) return p2;
        let f2 = e2[0].next(0);
        for (; f2.done; ) {
          e2.shift();
          if (!e2.length) return p2;
          f2 = e2[0].next(0);
        }
        e2.unshift(Ah(a2, f2.value, d2));
        return q2(rb(f2.value));
      } };
    }
    function Fh(a2, b2, c2) {
      const d2 = [];
      for (; b2 && 9 !== b2.node.nodeType; b2 = x2(a2, b2, null)) {
        const f2 = lb(a2, b2, c2);
        f2 && d2.push(f2);
      }
      let e2 = null;
      return { next: () => {
        for (; e2 || d2.length; ) {
          if (!e2) {
            e2 = Eh(a2, d2[0], false, c2);
            var f2 = q2(rb(d2[0]));
            const h2 = lb(a2, d2[0], c2);
            h2 ? d2[0] = h2 : d2.shift();
            return f2;
          }
          f2 = e2.next(0);
          if (f2.done) e2 = null;
          else return f2;
        }
        return p2;
      } };
    }
    var Gh = class extends D2 {
      constructor(a2) {
        super(a2.o, [a2], { R: "sorted", W: true, subtree: false, B: false });
        this.l = a2;
        this.s = (a2 = this.l.D()) && (a2.startsWith("name-") || "type-1" === a2) ? "type-1" : null;
      }
      h(a2, b2) {
        b2 = b2.h;
        a2 = th(a2.M);
        return w2.create(Fh(b2, a2, this.s)).filter((c2) => this.l.l(c2));
      }
    };
    function Hh(a2, b2, c2) {
      return { next: () => (b2 = b2 && lb(a2, b2, c2)) ? q2(rb(b2)) : p2 };
    }
    var Ih = class extends D2 {
      constructor(a2, b2) {
        super(a2.o, [a2], { R: "sorted", W: true, subtree: false, B: false });
        this.l = a2;
        this.s = xh(this.l.D(), b2);
      }
      h(a2, b2) {
        b2 = b2.h;
        a2 = th(a2.M);
        return w2.create(Hh(b2, a2, this.s)).filter((c2) => this.l.l(c2));
      }
    };
    var Jh = class extends D2 {
      constructor(a2, b2) {
        super(a2.o, [a2], { R: "reverse-sorted", W: true, subtree: true, B: false });
        this.l = a2;
        this.s = xh(b2, this.l.D());
      }
      h(a2, b2) {
        b2 = b2.h;
        a2 = th(a2.M);
        a2 = x2(b2, a2, this.s);
        if (!a2) return w2.empty();
        a2 = rb(a2);
        return this.l.l(a2) ? w2.m(a2) : w2.empty();
      }
    };
    function Kh(a2, b2, c2) {
      const d2 = [];
      for (; b2 && 9 !== b2.node.nodeType; b2 = x2(a2, b2, null)) {
        const f2 = mb(a2, b2, c2);
        null !== f2 && d2.push(f2);
      }
      let e2 = null;
      return { next: () => {
        for (; e2 || d2.length; ) {
          e2 || (e2 = Eh(a2, d2[0], true, c2));
          var f2 = e2.next(0);
          if (f2.done) {
            e2 = null;
            f2 = mb(a2, d2[0], c2);
            const h2 = q2(rb(d2[0]));
            null === f2 ? d2.shift() : d2[0] = f2;
            return h2;
          }
          return f2;
        }
        return p2;
      } };
    }
    var Lh = class extends D2 {
      constructor(a2) {
        super(a2.o, [a2], { B: false, W: true, R: "reverse-sorted", subtree: false });
        this.l = a2;
        this.s = (a2 = this.l.D()) && (a2.startsWith("name-") || "type-1" === a2) ? "type-1" : null;
      }
      h(a2, b2) {
        b2 = b2.h;
        a2 = th(a2.M);
        return w2.create(Kh(b2, a2, this.s)).filter((c2) => this.l.l(c2));
      }
    };
    function Mh(a2, b2, c2) {
      return { next: () => (b2 = b2 && mb(a2, b2, c2)) ? q2(rb(b2)) : p2 };
    }
    var Nh = class extends D2 {
      constructor(a2, b2) {
        super(a2.o, [a2], { B: false, W: true, R: "reverse-sorted", subtree: false });
        this.l = a2;
        this.s = xh(this.l.D(), b2);
      }
      h(a2, b2) {
        b2 = b2.h;
        a2 = th(a2.M);
        return w2.create(Mh(b2, a2, this.s)).filter((c2) => this.l.l(c2));
      }
    };
    var Oh = class extends D2 {
      constructor(a2, b2) {
        super(a2.o, [a2], { R: "sorted", subtree: true, W: true, B: false });
        this.l = a2;
        this.s = xh(this.l.D(), b2);
      }
      h(a2) {
        th(a2.M);
        return this.l.l(a2.M) ? w2.m(a2.M) : w2.empty();
      }
      D() {
        return this.s;
      }
    };
    var Ph = class extends qf {
      constructor(a2, b2, c2, d2) {
        super(a2.o.add(b2.o).add(c2.o), [a2, b2, c2], { B: a2.B && b2.B && c2.B, W: b2.W === c2.W && b2.W, R: b2.ia === c2.ia ? b2.ia : "unsorted", subtree: b2.subtree === c2.subtree && b2.subtree }, d2);
        this.l = a2;
      }
      A(a2, b2, c2) {
        let d2 = null;
        const e2 = c2[0](a2);
        return w2.create({ next: (f2) => {
          d2 || (d2 = (e2.fa() ? c2[1](a2) : c2[2](a2)).value);
          return d2.next(f2);
        } });
      }
      v(a2) {
        super.v(a2);
        if (this.l.I) throw Ne();
      }
    };
    function hg(a2) {
      return a2.h instanceof Error ? a2.location : hg(a2.h);
    }
    function ig(a2) {
      let b2;
      b2 = a2.h instanceof fg ? ["Inner error:", a2.h.message] : a2.h instanceof Error ? [a2.h.toString()] : ig(a2.h);
      b2.push(`  at <${a2.o}${a2.Wa ? ` (${a2.Wa})` : ""}>:${a2.location.start.line}:${a2.location.start.ha} - ${a2.location.end.line}:${a2.location.end.ha}`);
      return b2;
    }
    var Qh = class {
      constructor(a2, b2, c2, d2) {
        this.location = a2;
        this.o = b2;
        this.Wa = c2;
        this.h = d2;
      }
    };
    var Rh = class extends qf {
      constructor(a2, b2, c2, d2) {
        super(c2.o, [c2], { B: c2.B, W: c2.W, R: c2.ia, subtree: c2.subtree });
        this.L = b2;
        this.P = { end: { ha: a2.end.ha, line: a2.end.line, offset: a2.end.offset }, start: { ha: a2.start.ha, line: a2.start.line, offset: a2.start.offset } };
        this.l = d2;
      }
      A(a2, b2, [c2]) {
        let d2;
        try {
          d2 = c2(a2);
        } catch (e2) {
          throw new Qh(this.P, this.L, this.l, e2);
        }
        return w2.create({ next: (e2) => {
          try {
            return d2.value.next(e2);
          } catch (f2) {
            throw new Qh(this.P, this.L, this.l, f2);
          }
        } });
      }
      v(a2) {
        try {
          super.v(a2);
        } catch (b2) {
          throw new Qh(this.P, this.L, this.l, b2);
        }
      }
      D() {
        return this.Fa[0].D();
      }
    };
    function Sh(a2, b2, c2, d2) {
      let e2 = [];
      const f2 = a2.L(b2, c2, d2, (k2) => {
        if (a2.l instanceof Th) {
          const n2 = Sh(a2.l, b2, k2, d2);
          return of(n2, (t2) => e2 = t2);
        }
        let l2 = null;
        return w2.create({ next: () => {
          for (; ; ) {
            if (!l2) {
              var n2 = k2.next(0);
              if (n2.done) return p2;
              n2 = a2.l.s(n2.value, d2);
              l2 = of(n2, (t2) => e2 = lf(e2, t2)).value;
            }
            n2 = l2.next(0);
            if (n2.done) l2 = null;
            else return n2;
          }
        } });
      });
      let h2 = false;
      return { next: () => {
        if (h2) return p2;
        const k2 = f2.O();
        h2 = true;
        return q2(new Ye(k2, e2));
      } };
    }
    function Uh(a2, b2, c2, d2) {
      return a2.L(b2, c2, d2, (e2) => {
        if (a2.l instanceof Th) return Uh(a2.l, b2, e2, d2);
        let f2 = null;
        return w2.create({ next: () => {
          for (; ; ) {
            if (!f2) {
              var h2 = e2.next(0);
              if (h2.done) return p2;
              f2 = C2(a2.l, h2.value, d2).value;
            }
            h2 = f2.next(0);
            if (h2.done) f2 = null;
            else return h2;
          }
        } });
      });
    }
    var Th = class extends D2 {
      constructor(a2, b2, c2, d2) {
        super(a2, b2, c2, true);
        this.l = d2;
        this.I = this.l.I;
      }
      h(a2, b2) {
        return this.L(a2, kd(a2), b2, (c2) => {
          if (this.l instanceof Th) return Uh(this.l, a2, c2, b2);
          let d2 = null;
          return w2.create({ next: (e2) => {
            for (; ; ) {
              if (!d2) {
                var f2 = c2.next(0);
                if (f2.done) return p2;
                d2 = C2(this.l, f2.value, b2).value;
              }
              f2 = d2.next(e2);
              if (f2.done) d2 = null;
              else return f2;
            }
          } });
        });
      }
      s(a2, b2) {
        return Sh(this, a2, kd(a2), b2);
      }
      v(a2) {
        super.v(a2);
        this.I = this.l.I;
        for (const b2 of this.Fa) if (b2 !== this.l && b2.I) throw Ne();
      }
    };
    var Vh = class extends Th {
      constructor(a2, b2, c2, d2) {
        super(b2.o.add(d2.o), [b2, d2], { B: false }, d2);
        this.P = a2.prefix;
        this.ma = a2.namespaceURI;
        this.Pb = a2.localName;
        this.yb = null;
        this.A = c2;
        this.La = null;
        this.ya = b2;
      }
      L(a2, b2, c2, d2) {
        let e2 = null, f2 = null, h2 = 0;
        return d2({ next: () => {
          for (; ; ) {
            if (!e2) {
              var k2 = b2.next(0);
              if (k2.done) return p2;
              f2 = k2.value;
              h2 = 0;
              e2 = C2(this.ya, f2, c2).value;
            }
            const l2 = e2.next(0);
            if (l2.done) e2 = null;
            else return h2++, k2 = { [this.yb]: () => w2.m(l2.value) }, this.La && (k2[this.La] = () => w2.m(new Ca(5, h2))), q2(hc(f2, k2));
          }
        } });
      }
      v(a2) {
        if (this.P && (this.ma = a2.$(this.P), !this.ma && this.P)) throw Error(`XPST0081: Could not resolve namespace for prefix ${this.P} in a for expression`);
        this.ya.v(a2);
        Cg(a2);
        this.yb = Gg(a2, this.ma, this.Pb);
        if (this.A) {
          if (this.A.prefix && (this.A.namespaceURI = a2.$(this.A.prefix), !this.A.namespaceURI && this.A.prefix)) throw Error(`XPST0081: Could not resolve namespace for prefix ${this.P} in the positionalVariableBinding in a for expression`);
          this.La = Gg(a2, this.A.namespaceURI, this.A.localName);
        }
        this.l.v(a2);
        Ig(a2);
        if (this.ya.I) throw Ne();
        this.l.I && (this.I = true);
      }
    };
    var Wh = class extends D2 {
      constructor(a2, b2, c2) {
        super(new uf({ external: 1 }), [c2], { B: false, R: "unsorted" });
        this.P = a2.map(({ name: d2 }) => d2);
        this.A = a2.map(({ type: d2 }) => d2);
        this.s = null;
        this.L = b2;
        this.l = c2;
      }
      h(a2, b2) {
        const c2 = new Va({ j: this.A, arity: this.A.length, Ya: true, I: this.l.I, localName: "dynamic-function", namespaceURI: "", i: this.L, value: (d2, e2, f2, ...h2) => {
          d2 = hc(bc(a2, -1, null, w2.empty()), this.s.reduce((k2, l2, n2) => {
            k2[l2] = Ra(h2[n2]);
            return k2;
          }, /* @__PURE__ */ Object.create(null)));
          return C2(this.l, d2, b2);
        } });
        return w2.m(c2);
      }
      v(a2) {
        Cg(a2);
        this.s = this.P.map((b2) => Gg(
          a2,
          b2.namespaceURI,
          b2.localName
        ));
        this.l.v(a2);
        Ig(a2);
        if (this.l.I) throw Error("Not implemented: inline functions can not yet be updating.");
      }
    };
    var Xh = class extends Th {
      constructor(a2, b2, c2) {
        super(b2.o.add(c2.o), [b2, c2], { B: false, W: c2.W, R: c2.ia, subtree: c2.subtree }, c2);
        if (a2.prefix || a2.namespaceURI) throw Error("Not implemented: let expressions with namespace usage.");
        this.A = a2.prefix;
        this.P = a2.namespaceURI;
        this.La = a2.localName;
        this.ma = b2;
        this.ya = null;
      }
      L(a2, b2, c2, d2) {
        return d2({ next: () => {
          var e2 = b2.next(0);
          if (e2.done) return p2;
          e2 = e2.value;
          e2 = hc(e2, { [this.ya]: Ra(C2(this.ma, e2, c2)) });
          return q2(e2);
        } });
      }
      v(a2) {
        if (this.A && (this.P = a2.$(this.A), !this.P && this.A)) throw Error(`XPST0081: Could not resolve namespace for prefix ${this.A} using in a for expression`);
        this.ma.v(a2);
        Cg(a2);
        this.ya = Gg(a2, this.P, this.La);
        this.l.v(a2);
        Ig(a2);
        this.I = this.l.I;
        if (this.ma.I) throw Ne();
      }
    };
    var Yh = class extends D2 {
      constructor(a2, b2) {
        super(new uf({}), [], { B: true, R: "sorted" }, false, b2);
        let c2;
        switch (b2.type) {
          case 5:
            c2 = g2(parseInt(a2, 10), b2.type);
            break;
          case 1:
            c2 = g2(a2, b2.type);
            break;
          case 4:
          case 3:
            c2 = g2(parseFloat(a2), b2.type);
            break;
          default:
            throw new TypeError("Type " + b2 + " not expected in a literal");
        }
        this.l = () => w2.m(c2);
      }
      h() {
        return this.l();
      }
    };
    var Zh = class extends D2 {
      constructor(a2, b2) {
        super(new uf({ external: 1 }), a2.reduce((c2, { key: d2, value: e2 }) => c2.concat(d2, e2), []), { B: false }, false, b2);
        this.l = a2;
      }
      h(a2, b2) {
        const c2 = this.l.map((d2) => qc(C2(d2.key, a2, b2), b2).X({ default: () => {
          throw Error("XPTY0004: A key of a map should be a single atomizable value.");
        }, m: (e2) => e2 }));
        return A2(c2, (d2) => w2.m(new ub(d2.map((e2, f2) => ({ key: e2, value: Ra(C2(this.l[f2].value, a2, b2)) })))));
      }
    };
    var $h = class extends D2 {
      constructor(a2, b2, c2) {
        super(new uf({ external: 1 }), [], { B: true }, false, c2);
        this.s = b2;
        this.A = a2;
        this.l = null;
      }
      h() {
        const a2 = new Va({ j: this.l.j, I: this.l.I, arity: this.s, localName: this.l.localName, namespaceURI: this.l.namespaceURI, i: this.l.i, value: this.l.callFunction });
        return w2.m(a2);
      }
      v(a2) {
        let b2 = this.A.namespaceURI, c2 = this.A.localName;
        const d2 = this.A.prefix;
        if (null === b2) {
          const e2 = a2.Sa({ localName: c2, prefix: d2 }, this.s);
          if (!e2) throw Error(`XPST0017: The function ${d2 ? d2 + ":" : ""}${c2} with arity ${this.s} could not be resolved. ${lg(c2)}`);
          b2 = e2.namespaceURI;
          c2 = e2.localName;
        }
        this.l = a2.va(b2, c2, this.s) || null;
        if (!this.l) throw a2 = this.A, Error(`XPST0017: Function ${`${a2.namespaceURI ? `Q{${a2.namespaceURI}}` : a2.prefix ? `${a2.prefix}:` : ""}${a2.localName}`} with arity of ${this.s} not registered. ${lg(c2)}`);
        super.v(a2);
      }
    };
    const ai = { [5]: 5, [27]: 5, [28]: 5, [31]: 5, [32]: 5, [33]: 5, [34]: 5, [30]: 5, [36]: 5, [35]: 5, [38]: 5, [37]: 5, [29]: 5, [4]: 4, [6]: 6, [3]: 3 };
    var bi = class extends D2 {
      constructor(a2, b2, c2) {
        super(b2.o, [b2], { B: false }, false, c2);
        this.s = b2;
        this.l = a2;
      }
      h(a2, b2) {
        return qc(C2(this.s, a2, b2), b2).N((c2) => {
          if (0 === c2.length) return w2.empty();
          var d2 = c2[0];
          if (this.type) return c2 = "+" === this.l ? +d2.value : -d2.value, 0 === d2.type && (c2 = Number.NaN), w2.m(g2(c2, this.type.type));
          if (1 < c2.length) throw Error("XPTY0004: The operand to a unary operator must be a sequence with a length less than one");
          return v2(d2.type, 19) ? (d2 = jd(d2, 3).value, w2.m(g2("+" === this.l ? d2 : -d2, 3))) : v2(d2.type, 2) ? "+" === this.l ? w2.m(d2) : w2.m(g2(-1 * d2.value, ai[d2.type])) : w2.m(g2(Number.NaN, 3));
        });
      }
    };
    var ci = class extends D2 {
      constructor(a2, b2) {
        super(a2.reduce((c2, d2) => c2.add(d2.o), new uf({})), a2, { B: a2.every((c2) => c2.B) }, false, b2);
        this.l = a2;
        this.s = a2.reduce((c2, d2) => xh(c2, d2.D()), null);
      }
      h(a2, b2) {
        let c2 = 0, d2 = null, e2 = false, f2 = null;
        if (null !== a2) {
          const h2 = a2.M;
          null !== h2 && v2(h2.type, 53) && (f2 = Xa(h2.value));
        }
        return w2.create({ next: () => {
          if (!e2) {
            for (; c2 < this.l.length; ) {
              if (!d2) {
                const h2 = this.l[c2];
                if (null !== f2 && null !== h2.D() && !f2.includes(h2.D())) return c2++, e2 = true, q2(wa);
                d2 = C2(h2, a2, b2);
              }
              if (false === d2.fa()) return e2 = true, q2(wa);
              d2 = null;
              c2++;
            }
            e2 = true;
            return q2(va);
          }
          return p2;
        } });
      }
      D() {
        return this.s;
      }
    };
    var di = class extends D2 {
      constructor(a2, b2) {
        super(a2.reduce((d2, e2) => 0 < tf(d2, e2.o) ? d2 : e2.o, new uf({})), a2, { B: a2.every((d2) => d2.B) }, false, b2);
        let c2;
        for (b2 = 0; b2 < a2.length; ++b2) {
          void 0 === c2 && (c2 = a2[b2].D());
          if (null === c2) break;
          if (c2 !== a2[b2].D()) {
            c2 = null;
            break;
          }
        }
        this.s = c2;
        this.l = a2;
      }
      h(a2, b2) {
        let c2 = 0, d2 = null, e2 = false, f2 = null;
        if (null !== a2) {
          const h2 = a2.M;
          null !== h2 && v2(h2.type, 53) && (f2 = Xa(h2.value));
        }
        return w2.create({ next: () => {
          if (!e2) {
            for (; c2 < this.l.length; ) {
              if (!d2) {
                const h2 = this.l[c2];
                if (null !== f2 && null !== h2.D() && !f2.includes(h2.D())) {
                  c2++;
                  continue;
                }
                d2 = C2(h2, a2, b2);
              }
              if (true === d2.fa()) return e2 = true, q2(va);
              d2 = null;
              c2++;
            }
            e2 = true;
            return q2(wa);
          }
          return p2;
        } });
      }
      D() {
        return this.s;
      }
    };
    function ei(a2, b2) {
      let c2;
      return w2.create({ next: (d2) => {
        for (; ; ) {
          if (!c2) {
            var e2 = a2.value.next(d2);
            if (e2.done) return p2;
            c2 = pc(e2.value, b2);
          }
          e2 = c2.value.next(d2);
          if (e2.done) c2 = null;
          else return e2;
        }
      } });
    }
    function fi(a2, b2) {
      if ("eqOp" === a2) return (c2, d2) => {
        const { U: e2, V: f2 } = b2(c2, d2);
        return e2.value.namespaceURI === f2.value.namespaceURI && e2.value.localName === f2.value.localName;
      };
      if ("neOp" === a2) return (c2, d2) => {
        const { U: e2, V: f2 } = b2(c2, d2);
        return e2.value.namespaceURI !== f2.value.namespaceURI || e2.value.localName !== f2.value.localName;
      };
      throw Error('XPTY0004: Only the "eq" and "ne" comparison is defined for xs:QName');
    }
    function gi(a2, b2) {
      switch (a2) {
        case "eqOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return e2.value === f2.value;
          };
        case "neOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return e2.value !== f2.value;
          };
        case "ltOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return e2.value < f2.value;
          };
        case "leOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return e2.value <= f2.value;
          };
        case "gtOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return e2.value > f2.value;
          };
        case "geOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return e2.value >= f2.value;
          };
      }
    }
    function hi(a2, b2) {
      switch (a2) {
        case "ltOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return e2.value.ea < f2.value.ea;
          };
        case "leOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return vb(e2.value, f2.value) || e2.value.ea < f2.value.ea;
          };
        case "gtOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return e2.value.ea > f2.value.ea;
          };
        case "geOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return vb(e2.value, f2.value) || e2.value.ea > f2.value.ea;
          };
      }
    }
    function ii(a2, b2) {
      switch (a2) {
        case "eqOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return vb(e2.value, f2.value);
          };
        case "ltOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return e2.value.ca < f2.value.ca;
          };
        case "leOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return vb(e2.value, f2.value) || e2.value.ca < f2.value.ca;
          };
        case "gtOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return e2.value.ca > f2.value.ca;
          };
        case "geOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return vb(e2.value, f2.value) || e2.value.ca > f2.value.ca;
          };
      }
    }
    function ji(a2, b2) {
      switch (a2) {
        case "eqOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return vb(e2.value, f2.value);
          };
        case "neOp":
          return (c2, d2) => {
            const { U: e2, V: f2 } = b2(c2, d2);
            return !vb(e2.value, f2.value);
          };
      }
    }
    function ki(a2, b2) {
      switch (a2) {
        case "eqOp":
          return (c2, d2, e2) => {
            const { U: f2, V: h2 } = b2(c2, d2);
            return Ob(f2.value, h2.value, fc(e2));
          };
        case "neOp":
          return (c2, d2, e2) => {
            const { U: f2, V: h2 } = b2(c2, d2);
            return !Ob(f2.value, h2.value, fc(e2));
          };
        case "ltOp":
          return (c2, d2, e2) => {
            const { U: f2, V: h2 } = b2(c2, d2);
            c2 = fc(e2);
            return 0 > Nb(f2.value, h2.value, c2);
          };
        case "leOp":
          return (c2, d2, e2) => {
            const { U: f2, V: h2 } = b2(c2, d2);
            (c2 = Ob(f2.value, h2.value, fc(e2))) || (e2 = fc(e2), c2 = 0 > Nb(f2.value, h2.value, e2));
            return c2;
          };
        case "gtOp":
          return (c2, d2, e2) => {
            const { U: f2, V: h2 } = b2(c2, d2);
            c2 = fc(e2);
            return 0 < Nb(
              f2.value,
              h2.value,
              c2
            );
          };
        case "geOp":
          return (c2, d2, e2) => {
            const { U: f2, V: h2 } = b2(c2, d2);
            (c2 = Ob(f2.value, h2.value, fc(e2))) || (e2 = fc(e2), c2 = 0 < Nb(f2.value, h2.value, e2));
            return c2;
          };
      }
    }
    function li(a2, b2) {
      switch (a2) {
        case "eqOp":
          return (c2, d2, e2) => {
            const { U: f2, V: h2 } = b2(c2, d2);
            return Ob(f2.value, h2.value, fc(e2));
          };
        case "neOp":
          return (c2, d2, e2) => {
            const { U: f2, V: h2 } = b2(c2, d2);
            return !Ob(f2.value, h2.value, fc(e2));
          };
      }
    }
    function mi(a2, b2, c2) {
      function d2(n2, t2) {
        return { U: h2 ? h2(n2) : n2, V: k2 ? k2(t2) : t2 };
      }
      function e2(n2) {
        return v2(b2, n2) && v2(c2, n2);
      }
      function f2(n2) {
        return 0 < n2.filter((t2) => v2(b2, t2)).length && 0 < n2.filter((t2) => v2(c2, t2)).length;
      }
      let h2 = null, k2 = null;
      v2(b2, 19) && v2(c2, 19) ? b2 = c2 = 1 : v2(b2, 19) ? (h2 = (n2) => jd(n2, c2), b2 = c2) : v2(c2, 19) && (k2 = (n2) => jd(n2, b2), c2 = b2);
      if (v2(b2, 23) && v2(c2, 23)) return fi(a2, d2);
      if (e2(0) || f2([1, 47, 61]) || f2([2, 47, 61]) || e2(20) || e2(22) || e2(21) || f2([1, 20])) {
        var l2 = gi(a2, d2);
        if (void 0 !== l2) return l2;
      }
      if (e2(16) && (l2 = hi(a2, d2), void 0 !== l2) || e2(17) && (l2 = ii(a2, d2), void 0 !== l2) || e2(18) && (l2 = ji(a2, d2), void 0 !== l2)) return l2;
      if (e2(9) || e2(7) || e2(8)) {
        if (l2 = ki(a2, d2), void 0 !== l2) return l2;
      }
      if (e2(11) || e2(12) || e2(13) || e2(14) || e2(15)) {
        if (l2 = li(a2, d2), void 0 !== l2) return l2;
      }
      throw Error(`XPTY0004: ${a2} not available for ${Da[b2]} and ${Da[c2]}`);
    }
    const ni = /* @__PURE__ */ Object.create(null);
    function oi(a2, b2, c2) {
      const d2 = `${b2}~${c2}~${a2}`;
      let e2 = ni[d2];
      e2 || (e2 = ni[d2] = mi(a2, b2, c2));
      return e2;
    }
    var pi = class extends D2 {
      constructor(a2, b2, c2) {
        super(b2.o.add(c2.o), [b2, c2], { B: false });
        this.l = b2;
        this.A = c2;
        this.s = a2;
      }
      h(a2, b2) {
        const c2 = C2(this.l, a2, b2), d2 = C2(this.A, a2, b2), e2 = ei(c2, b2), f2 = ei(d2, b2);
        return e2.X({ empty: () => w2.empty(), m: () => f2.X({ empty: () => w2.empty(), m: () => {
          const h2 = e2.first(), k2 = f2.first();
          return oi(this.s, h2.type, k2.type)(h2, k2, a2) ? w2.aa() : w2.T();
        }, multiple: () => {
          throw Error("XPTY0004: Sequences to compare are not singleton.");
        } }), multiple: () => {
          throw Error("XPTY0004: Sequences to compare are not singleton.");
        } });
      }
    };
    const qi = { equalOp: "eqOp", notEqualOp: "neOp", lessThanOrEqualOp: "leOp", lessThanOp: "ltOp", greaterThanOrEqualOp: "geOp", greaterThanOp: "gtOp" };
    function ri(a2, b2, c2, d2) {
      a2 = qi[a2];
      return c2.N((e2) => b2.filter((f2) => {
        for (let l2 = 0, n2 = e2.length; l2 < n2; ++l2) {
          let t2 = e2[l2], u2 = void 0, z2 = void 0;
          var h2 = f2.type, k2 = t2.type;
          if (v2(h2, 19) || v2(k2, 19)) v2(h2, 2) ? u2 = 3 : v2(k2, 2) ? z2 = 3 : v2(h2, 17) ? u2 = 17 : v2(k2, 17) ? z2 = 17 : v2(h2, 16) ? u2 = 16 : v2(k2, 16) ? z2 = 16 : v2(h2, 19) ? z2 = k2 : v2(k2, 19) && (u2 = h2);
          const [y2, G2] = [z2, u2];
          h2 = y2;
          k2 = G2;
          h2 ? f2 = jd(f2, h2) : k2 && (t2 = jd(t2, k2));
          if (oi(a2, f2.type, t2.type)(f2, t2, d2)) return true;
        }
        return false;
      }).X({ default: () => w2.aa(), empty: () => w2.T() }));
    }
    var si = class extends D2 {
      constructor(a2, b2, c2) {
        super(b2.o.add(c2.o), [b2, c2], { B: false });
        this.l = b2;
        this.A = c2;
        this.s = a2;
      }
      h(a2, b2) {
        const c2 = C2(this.l, a2, b2), d2 = C2(this.A, a2, b2);
        return c2.X({ empty: () => w2.T(), default: () => d2.X({ empty: () => w2.T(), default: () => {
          const e2 = ei(c2, b2), f2 = ei(d2, b2);
          return ri(this.s, e2, f2, a2);
        } }) });
      }
    };
    function ti(a2, b2, c2, d2) {
      if (!v2(c2, 53) || !v2(d2, 53)) throw Error("XPTY0004: Sequences to compare are not nodes");
      switch (a2) {
        case "isOp":
          return ui(c2, d2);
        case "nodeBeforeOp":
          return b2 ? (e2, f2) => 0 > sd(b2, e2.first(), f2.first()) : void 0;
        case "nodeAfterOp":
          return b2 ? (e2, f2) => 0 < sd(b2, e2.first(), f2.first()) : void 0;
        default:
          throw Error("Unexpected operator");
      }
    }
    function ui(a2, b2) {
      return a2 !== b2 || 47 !== a2 && 53 !== a2 && 54 !== a2 && 55 !== a2 && 56 !== a2 && 57 !== a2 && 58 !== a2 ? () => false : (c2, d2) => md(c2.first().value, d2.first().value);
    }
    var vi = class extends D2 {
      constructor(a2, b2, c2) {
        super(b2.o.add(c2.o), [b2, c2], { B: false });
        this.l = b2;
        this.A = c2;
        this.s = a2;
      }
      h(a2, b2) {
        const c2 = C2(this.l, a2, b2), d2 = C2(this.A, a2, b2);
        return c2.X({ empty: () => w2.empty(), multiple: () => {
          throw Error("XPTY0004: Sequences to compare are not singleton");
        }, m: () => d2.X({ empty: () => w2.empty(), multiple: () => {
          throw Error("XPTY0004: Sequences to compare are not singleton");
        }, m: () => {
          const e2 = c2.first(), f2 = d2.first();
          return ti(this.s, b2.h, e2.type, f2.type)(c2, d2, a2) ? w2.aa() : w2.T();
        } }) });
      }
    };
    function wi(a2, b2, c2, d2) {
      return c2.N((e2) => {
        if (e2.some((f2) => !v2(f2.type, 53))) throw Error(`XPTY0004: Sequences given to ${a2} should only contain nodes.`);
        return "sorted" === d2 ? w2.create(e2) : "reverse-sorted" === d2 ? w2.create(e2.reverse()) : w2.create(td(b2, e2));
      });
    }
    var xi = class extends D2 {
      constructor(a2, b2, c2, d2) {
        super(0 < tf(b2.o, c2.o) ? b2.o : c2.o, [b2, c2], { B: b2.B && c2.B }, false, d2);
        this.l = a2;
        this.s = b2;
        this.A = c2;
      }
      h(a2, b2) {
        const c2 = wi(this.l, b2.h, C2(this.s, a2, b2), this.s.ia);
        a2 = wi(this.l, b2.h, C2(this.A, a2, b2), this.A.ia);
        const d2 = c2.value, e2 = a2.value;
        let f2 = null, h2 = null, k2 = false, l2 = false;
        return w2.create({ next: () => {
          if (k2) return p2;
          for (; !l2; ) {
            if (!f2) {
              var n2 = d2.next(0);
              if (n2.done) return k2 = true, p2;
              f2 = n2.value;
            }
            if (!h2) {
              n2 = e2.next(0);
              if (n2.done) {
                l2 = true;
                break;
              }
              h2 = n2.value;
            }
            if (md(f2.value, h2.value)) {
              if (n2 = q2(f2), h2 = f2 = null, "intersectOp" === this.l) return n2;
            } else if (0 > sd(b2.h, f2, h2)) {
              if (n2 = q2(f2), f2 = null, "exceptOp" === this.l) return n2;
            } else h2 = null;
          }
          if ("exceptOp" === this.l) return null !== f2 ? (n2 = q2(f2), f2 = null, n2) : d2.next(0);
          k2 = true;
          return p2;
        } });
      }
    };
    var yi = class extends qf {
      constructor(a2, b2) {
        super(a2.reduce((c2, d2) => c2.add(d2.o), new uf({})), a2, { R: "unsorted", B: a2.every((c2) => c2.B) }, b2);
      }
      A(a2, b2, c2) {
        return c2.length ? jc(c2.map((d2) => d2(a2))) : w2.empty();
      }
    };
    var zi = class extends D2 {
      constructor(a2, b2, c2) {
        super(new uf({}).add(a2.o), [a2, b2], { B: a2.B && b2.B }, false, c2);
        this.l = a2;
        this.s = b2;
      }
      h(a2, b2) {
        const c2 = C2(this.l, a2, b2), d2 = dc(a2, c2);
        let e2 = null, f2 = null, h2 = false;
        return w2.create({ next: (k2) => {
          for (; !h2; ) {
            if (!e2 && (e2 = d2.next(k2), e2.done)) return h2 = true, p2;
            f2 || (f2 = C2(this.s, e2.value, b2));
            const l2 = f2.value.next(k2);
            if (l2.done) e2 = f2 = null;
            else return l2;
          }
        } });
      }
    };
    var Ai = class extends D2 {
      constructor(a2, b2, c2) {
        super(a2.o, [a2], { B: false });
        this.l = Ia(b2.prefix ? `${b2.prefix}:${b2.localName}` : b2.localName);
        if (46 === this.l || 45 === this.l || 44 === this.l) throw Error("XPST0080: Casting to xs:anyAtomicType, xs:anySimpleType or xs:NOTATION is not permitted.");
        if (b2.namespaceURI) throw Error("Not implemented: castable as expressions with a namespace URI.");
        this.A = a2;
        this.s = c2;
      }
      h(a2, b2) {
        const c2 = qc(C2(this.A, a2, b2), b2);
        return c2.X({ empty: () => this.s ? w2.aa() : w2.T(), m: () => c2.map((d2) => id(d2, this.l).u ? va : wa), multiple: () => w2.T() });
      }
    };
    var Bi = class extends D2 {
      constructor(a2, b2, c2) {
        super(a2.o, [a2], { B: false });
        this.l = Ia(b2.prefix ? `${b2.prefix}:${b2.localName}` : b2.localName);
        if (46 === this.l || 45 === this.l || 44 === this.l) throw Error("XPST0080: Casting to xs:anyAtomicType, xs:anySimpleType or xs:NOTATION is not permitted.");
        if (b2.namespaceURI) throw Error("Not implemented: casting expressions with a namespace URI.");
        this.A = a2;
        this.s = c2;
      }
      h(a2, b2) {
        const c2 = qc(C2(this.A, a2, b2), b2);
        return c2.X({ empty: () => {
          if (!this.s) throw Error("XPTY0004: Sequence to cast is empty while target type is singleton.");
          return w2.empty();
        }, m: () => c2.map((d2) => jd(d2, this.l)), multiple: () => {
          throw Error("XPTY0004: Sequence to cast is not singleton or empty.");
        } });
      }
    };
    function Ci(a2, b2) {
      const c2 = a2.value;
      let d2 = null, e2 = false;
      return w2.create({ next: () => {
        for (; !e2; ) {
          if (!d2) {
            var f2 = c2.next(0);
            if (f2.done) return e2 = true, q2(va);
            d2 = b2(f2.value);
          }
          f2 = d2.fa();
          d2 = null;
          if (false === f2) return e2 = true, q2(wa);
        }
        return p2;
      } });
    }
    var Di = class extends D2 {
      constructor(a2, b2, c2, d2) {
        super(a2.o, [a2], { B: false }, false, d2);
        this.A = a2;
        this.s = b2;
        this.l = c2;
      }
      h(a2, b2) {
        const c2 = C2(this.A, a2, b2);
        return c2.X({ empty: () => "?" === this.l || "*" === this.l ? w2.aa() : w2.T(), multiple: () => "+" === this.l || "*" === this.l ? Ci(c2, (d2) => {
          const e2 = w2.m(d2);
          d2 = bc(a2, 0, d2, e2);
          return C2(this.s, d2, b2);
        }) : w2.T(), m: () => Ci(c2, (d2) => {
          const e2 = w2.m(d2);
          d2 = bc(a2, 0, d2, e2);
          return C2(this.s, d2, b2);
        }) });
      }
    };
    function Ei(a2, b2) {
      return null !== a2 && null !== b2 && v2(a2.type, 53) && v2(b2.type, 53) ? md(a2.value, b2.value) : false;
    }
    function Fi(a2) {
      let b2 = a2.next(0);
      if (b2.done) return w2.empty();
      let c2 = null, d2 = null;
      return w2.create({ next(e2) {
        if (b2.done) return p2;
        c2 || (c2 = b2.value.value);
        let f2;
        do
          if (f2 = c2.next(e2), f2.done) {
            b2 = a2.next(0);
            if (b2.done) return f2;
            c2 = b2.value.value;
          }
        while (f2.done || Ei(f2.value, d2));
        d2 = f2.value;
        return f2;
      } });
    }
    function Gi(a2, b2) {
      const c2 = [];
      (function() {
        for (var f2 = b2.next(0); !f2.done; ) {
          const h2 = f2.value.value;
          f2 = { current: h2.next(0), next: (k2) => h2.next(k2) };
          f2.current.done || c2.push(f2);
          f2 = b2.next(0);
        }
      })();
      let d2 = null, e2 = false;
      return w2.create({ [Symbol.iterator]() {
        return this;
      }, next: () => {
        e2 || (e2 = true, c2.every((h2) => v2(h2.current.value.type, 53)) && c2.sort((h2, k2) => sd(a2, h2.current.value, k2.current.value)));
        let f2;
        do {
          if (!c2.length) return p2;
          const h2 = c2.shift();
          f2 = h2.current;
          h2.current = h2.next(0);
          if (!v2(f2.value.type, 53)) return f2;
          if (!h2.current.done) {
            let k2 = 0, l2 = c2.length - 1, n2 = 0;
            for (; k2 <= l2; ) {
              n2 = Math.floor((k2 + l2) / 2);
              const t2 = sd(a2, h2.current.value, c2[n2].current.value);
              if (0 === t2) {
                k2 = n2;
                break;
              }
              0 < t2 ? k2 = n2 + 1 : l2 = n2 - 1;
            }
            c2.splice(k2, 0, h2);
          }
        } while (Ei(f2.value, d2));
        d2 = f2.value;
        return f2;
      } });
    }
    var Hi = class extends D2 {
      constructor(a2, b2) {
        super(a2.reduce((c2, d2) => 0 < tf(c2, d2.o) ? c2 : d2.o, new uf({})), a2, { B: a2.every((c2) => c2.B) }, false, b2);
        this.l = a2;
      }
      h(a2, b2) {
        if (this.l.every((c2) => "sorted" === c2.ia)) {
          let c2 = 0;
          return Gi(b2.h, { next: () => c2 >= this.l.length ? p2 : q2(C2(this.l[c2++], a2, b2)) }).map((d2) => {
            if (!v2(d2.type, 53)) throw Error("XPTY0004: The sequences to union are not of type node()*");
            return d2;
          });
        }
        return jc(this.l.map((c2) => C2(c2, a2, b2))).N((c2) => {
          if (c2.some((d2) => !v2(d2.type, 53))) throw Error("XPTY0004: The sequences to union are not of type node()*");
          c2 = td(
            b2.h,
            c2
          );
          return w2.create(c2);
        });
      }
    };
    function Ii(a2) {
      return a2.every((b2) => null === b2 || v2(b2.type, 5) || v2(b2.type, 4)) || null !== a2.map((b2) => b2 ? rc(b2.type) : null).reduce((b2, c2) => null === c2 ? b2 : c2 === b2 ? b2 : null) ? a2 : a2.every((b2) => null === b2 || v2(b2.type, 1) || v2(b2.type, 20)) ? a2.map((b2) => b2 ? jd(b2, 1) : null) : a2.every((b2) => null === b2 || v2(b2.type, 4) || v2(b2.type, 6)) ? a2.map((b2) => b2 ? jd(b2, 6) : b2) : a2.every((b2) => null === b2 || v2(b2.type, 4) || v2(b2.type, 6) || v2(b2.type, 3)) ? a2.map((b2) => b2 ? jd(b2, 3) : b2) : null;
    }
    function Ji(a2) {
      return (a2 = a2.find((b2) => !!b2)) ? rc(a2.type) : null;
    }
    var Ki = class extends Th {
      constructor(a2, b2) {
        super(new uf({}), [b2, ...a2.map((c2) => c2.ba)], { B: false, W: false, R: "unsorted", subtree: false }, b2);
        this.A = a2;
      }
      L(a2, b2, c2, d2) {
        if (this.A[1]) throw Error("More than one order spec is not supported for the order by clause.");
        const e2 = [];
        let f2 = false, h2, k2, l2 = null;
        const n2 = this.A[0];
        return w2.create({ next: () => {
          if (!f2) {
            for (var t2 = b2.next(0); !t2.done; ) e2.push(t2.value), t2 = b2.next(0);
            t2 = e2.map((z2) => n2.ba.h(z2, c2)).map((z2) => qc(z2, c2));
            if (t2.find((z2) => !z2.F() && !z2.oa())) throw Error("XPTY0004: Order by only accepts empty or singleton sequences");
            h2 = t2.map((z2) => z2.first());
            h2 = h2.map((z2) => null === z2 ? z2 : v2(19, z2.type) ? jd(z2, 1) : z2);
            if (Ji(h2) && (h2 = Ii(h2), !h2)) throw Error("XPTY0004: Could not cast values");
            t2 = h2.length;
            k2 = h2.map((z2, y2) => y2);
            for (let z2 = 0; z2 < t2; z2++) if (z2 + 1 !== t2) for (let y2 = z2; 0 <= y2; y2--) {
              const G2 = y2, N2 = y2 + 1;
              if (N2 === t2) continue;
              const U2 = h2[k2[G2]], ca = h2[k2[N2]];
              if (null !== ca || null !== U2) {
                if (n2.cc) {
                  if (null === U2) continue;
                  if (null === ca && null !== U2) {
                    [k2[G2], k2[N2]] = [k2[N2], k2[G2]];
                    continue;
                  }
                  if (isNaN(ca.value) && null !== U2 && !isNaN(U2.value)) {
                    [k2[G2], k2[N2]] = [k2[N2], k2[G2]];
                    continue;
                  }
                } else {
                  if (null === ca) continue;
                  if (null === U2 && null !== ca) {
                    [k2[G2], k2[N2]] = [k2[N2], k2[G2]];
                    continue;
                  }
                  if (isNaN(U2.value) && null !== ca && !isNaN(ca.value)) {
                    [k2[G2], k2[N2]] = [k2[N2], k2[G2]];
                    continue;
                  }
                }
                oi("gtOp", U2.type, ca.type)(U2, ca, a2) && ([k2[G2], k2[N2]] = [k2[N2], k2[G2]]);
              }
            }
            let u2 = n2.Bb ? 0 : h2.length - 1;
            l2 = d2({ next: () => n2.Bb ? u2 >= h2.length ? p2 : q2(e2[k2[u2++]]) : 0 > u2 ? p2 : q2(e2[k2[u2--]]) }).value;
            f2 = true;
          }
          return l2.next(0);
        } });
      }
    };
    var Li = class extends D2 {
      constructor(a2) {
        super(a2 ? a2.o : new uf({}), a2 ? [a2] : [], { R: "sorted", subtree: false, W: false, B: false });
        this.l = a2;
      }
      h(a2, b2) {
        if (null === a2.M) throw lc("context is absent, it needs to be present to use paths.");
        var c2 = b2.h;
        let d2 = a2.M.value;
        for (; 9 !== d2.node.nodeType; ) if (d2 = x2(c2, d2), null === d2) throw Error("XPDY0050: the root node of the context node is not a document node.");
        c2 = w2.m(rb(d2));
        return this.l ? C2(this.l, bc(a2, 0, c2.first(), c2), b2) : c2;
      }
    };
    var Mi = class extends D2 {
      constructor(a2) {
        super(new uf({}), [], { R: "sorted" }, false, a2);
      }
      h(a2) {
        if (null === a2.M) throw lc('context is absent, it needs to be present to use the "." operator');
        return w2.m(a2.M);
      }
    };
    function Ni(a2, b2) {
      let c2 = false, d2 = false;
      b2.forEach((e2) => {
        v2(e2.type, 53) ? c2 = true : d2 = true;
      });
      if (d2 && c2) throw Error("XPTY0018: The path operator should either return nodes or non-nodes. Mixed sequences are not allowed.");
      return c2 ? td(a2, b2) : b2;
    }
    var Oi = class extends D2 {
      constructor(a2, b2) {
        const c2 = a2.every((e2) => e2.W), d2 = a2.every((e2) => e2.subtree);
        super(a2.reduce((e2, f2) => e2.add(f2.o), new uf({})), a2, { B: false, W: c2, R: b2 ? "sorted" : "unsorted", subtree: d2 });
        this.l = a2;
        this.s = b2;
      }
      h(a2, b2) {
        let c2 = true;
        return this.l.reduce((d2, e2, f2) => {
          const h2 = null === d2 ? kd(a2) : dc(a2, d2);
          d2 = { next: (l2) => {
            l2 = h2.next(l2);
            if (l2.done) return p2;
            if (null !== l2.value.M && !v2(l2.value.M.type, 53) && 0 < f2) throw Error("XPTY0019: The result of E1 in a path expression E1/E2 should not evaluate to a sequence of nodes.");
            return q2(C2(
              e2,
              l2.value,
              b2
            ));
          } };
          let k2;
          if (this.s) switch (e2.ia) {
            case "reverse-sorted":
              const l2 = d2;
              d2 = { next: (n2) => {
                n2 = l2.next(n2);
                return n2.done ? n2 : q2(n2.value.N((t2) => w2.create(t2.reverse())));
              } };
            case "sorted":
              if (e2.subtree && c2) {
                k2 = Fi(d2);
                break;
              }
              k2 = Gi(b2.h, d2);
              break;
            case "unsorted":
              return Fi(d2).N((n2) => w2.create(Ni(b2.h, n2)));
          }
          else k2 = Fi(d2);
          c2 = c2 && e2.W;
          return k2;
        }, null);
      }
      D() {
        return this.l[0].D();
      }
    };
    var Pi = class extends D2 {
      constructor(a2, b2) {
        super(a2.o.add(b2.o), [a2, b2], { B: a2.B && b2.B, W: a2.W, R: a2.ia, subtree: a2.subtree });
        this.s = a2;
        this.l = b2;
      }
      h(a2, b2) {
        const c2 = C2(this.s, a2, b2);
        if (this.l.B) {
          const k2 = C2(this.l, a2, b2);
          if (k2.F()) return k2;
          const l2 = k2.first();
          if (v2(l2.type, 2)) {
            let n2 = l2.value;
            if (!Number.isInteger(n2)) return w2.empty();
            const t2 = c2.value;
            let u2 = false;
            return w2.create({ next: () => {
              if (!u2) {
                for (let z2 = t2.next(0); !z2.done; z2 = t2.next(0)) if (1 === n2--) return u2 = true, z2;
                u2 = true;
              }
              return p2;
            } });
          }
          return k2.fa() ? c2 : w2.empty();
        }
        const d2 = c2.value;
        let e2 = null, f2 = 0, h2 = null;
        return w2.create({ next: (k2) => {
          let l2 = false;
          for (; !e2 || !e2.done; ) {
            e2 || (e2 = d2.next(l2 ? 0 : k2), l2 = true);
            if (e2.done) break;
            h2 || (h2 = C2(this.l, bc(a2, f2, e2.value, c2), b2));
            var n2 = h2.first();
            n2 = null === n2 ? false : v2(n2.type, 2) ? n2.value === f2 + 1 : h2.fa();
            h2 = null;
            const t2 = e2.value;
            e2 = null;
            f2++;
            if (n2) return q2(t2);
          }
          return e2;
        } });
      }
      D() {
        return this.s.D();
      }
    };
    function Qi(a2, b2, c2) {
      c2 = [c2];
      if (v2(a2.type, 62)) if ("*" === b2) c2.push(...a2.h.map((d2) => d2()));
      else if (v2(b2.type, 5)) {
        const d2 = b2.value;
        if (a2.h.length < d2 || 0 >= d2) throw Error("FOAY0001: Array index out of bounds");
        c2.push(a2.h[d2 - 1]());
      } else throw Error("XPTY0004: The key specifier is not an integer.");
      else if (v2(a2.type, 61)) "*" === b2 ? c2.push(...a2.h.map((d2) => d2.value())) : (a2 = a2.h.find((d2) => sb(d2.key, b2))) && c2.push(a2.value());
      else throw Error("XPTY0004: The provided context item is not a map or an array.");
      return jc(c2);
    }
    function Ri(a2, b2, c2, d2, e2) {
      if ("*" === b2) return Qi(a2, b2, c2);
      b2 = C2(b2, d2, e2);
      b2 = Ra(b2)().N((f2) => f2.reduce((h2, k2) => Qi(a2, k2, h2), new Ba()));
      return jc([c2, b2]);
    }
    var Si = class extends D2 {
      constructor(a2, b2) {
        super(a2.o, [a2].concat("*" === b2 ? [] : [b2]), { B: a2.B, R: a2.ia, subtree: a2.subtree });
        this.l = a2;
        this.s = b2;
      }
      h(a2, b2) {
        return C2(this.l, a2, b2).N((c2) => c2.reduce((d2, e2) => Ri(e2, this.s, d2, a2, b2), new Ba()));
      }
      D() {
        return this.l.D();
      }
    };
    var Ti = class extends D2 {
      constructor(a2, b2) {
        super(new uf({ external: 1 }), "*" === a2 ? [] : [a2], { B: false }, false, b2);
        this.l = a2;
      }
      h(a2, b2) {
        return Ri(a2.M, this.l, new Ba(), a2, b2);
      }
    };
    var Ui = class extends D2 {
      constructor(a2, b2, c2, d2) {
        const e2 = b2.map((f2) => f2.fb);
        b2 = b2.map((f2) => f2.name);
        super(e2.reduce((f2, h2) => f2.add(h2.o), c2.o), e2.concat(c2), { B: false }, false, d2);
        this.s = a2;
        this.A = b2;
        this.L = e2;
        this.P = c2;
        this.l = null;
      }
      h(a2, b2) {
        let c2 = a2;
        const d2 = this.l.map((k2, l2) => {
          const n2 = C2(this.L[l2], c2, b2).O();
          c2 = hc(a2, { [k2]: () => w2.create(n2) });
          return n2;
        });
        if (d2.some((k2) => 0 === k2.length)) return "every" === this.s ? w2.aa() : w2.T();
        const e2 = Array(d2.length).fill(0);
        e2[0] = -1;
        for (var f2 = true; f2; ) {
          f2 = false;
          for (let k2 = 0, l2 = e2.length; k2 < l2; ++k2) {
            var h2 = d2[k2];
            if (++e2[k2] > h2.length - 1) e2[k2] = 0;
            else {
              f2 = /* @__PURE__ */ Object.create(null);
              for (h2 = 0; h2 < e2.length; h2++) {
                const n2 = d2[h2][e2[h2]];
                f2[this.l[h2]] = () => w2.m(n2);
              }
              f2 = hc(a2, f2);
              f2 = C2(this.P, f2, b2);
              if (f2.fa() && "some" === this.s) return w2.aa();
              if (!f2.fa() && "every" === this.s) return w2.T();
              f2 = true;
              break;
            }
          }
        }
        return "every" === this.s ? w2.aa() : w2.T();
      }
      v(a2) {
        this.l = [];
        for (let c2 = 0, d2 = this.A.length; c2 < d2; ++c2) {
          this.L[c2].v(a2);
          Cg(a2);
          var b2 = this.A[c2];
          const e2 = b2.prefix ? a2.$(b2.prefix) : null;
          b2 = Gg(a2, e2, b2.localName);
          this.l[c2] = b2;
        }
        this.P.v(a2);
        for (let c2 = 0, d2 = this.A.length; c2 < d2; ++c2) Ig(a2);
      }
    };
    var Vi = class extends D2 {
      constructor(a2) {
        super(a2, [], { B: false });
      }
      h(a2) {
        return this.l(a2.M) ? w2.aa() : w2.T();
      }
    };
    var Wi = class extends Vi {
      constructor(a2) {
        super(new uf({ nodeType: 1 }));
        this.s = a2;
      }
      l(a2) {
        if (!v2(a2.type, 53)) return false;
        a2 = a2.value.node.nodeType;
        return 3 === this.s && 4 === a2 ? true : this.s === a2;
      }
      D() {
        return `type-${this.s}`;
      }
    };
    var Xi = class extends Vi {
      constructor(a2, b2 = { kind: null }) {
        const c2 = a2.prefix, d2 = a2.namespaceURI;
        a2 = a2.localName;
        const e2 = {};
        "*" !== a2 && (e2.nodeName = 1);
        e2.nodeType = 1;
        super(new uf(e2));
        this.s = a2;
        this.L = d2;
        this.A = c2;
        this.P = b2.kind;
      }
      l(a2) {
        const b2 = v2(a2.type, 54), c2 = v2(a2.type, 47);
        if (!b2 && !c2) return false;
        a2 = a2.value;
        return null !== this.P && (1 === this.P && !b2 || 2 === this.P && !c2) ? false : null === this.A && "" !== this.L && "*" === this.s ? true : "*" === this.A ? "*" === this.s ? true : this.s === a2.node.localName : "*" !== this.s && this.s !== a2.node.localName ? false : (a2.node.namespaceURI || null) === (("" === this.A ? b2 ? this.L : null : this.L) || null);
      }
      D() {
        return "*" === this.s ? null === this.P ? "type-1-or-type-2" : `type-${this.P}` : `name-${this.s}`;
      }
      v(a2) {
        if (null === this.L && "*" !== this.A && (this.L = a2.$(this.A || "") || null, !this.L && this.A)) throw Error(`XPST0081: The prefix ${this.A} could not be resolved.`);
      }
    };
    var Yi = class extends Vi {
      constructor(a2) {
        super(new uf({ nodeName: 1 }));
        this.s = a2;
      }
      l(a2) {
        return v2(a2.type, 57) && a2.value.node.target === this.s;
      }
      D() {
        return "type-7";
      }
    };
    var Zi = class extends Vi {
      constructor(a2) {
        super(new uf({}));
        this.s = a2;
      }
      l(a2) {
        return v2(a2.type, Ia(this.s.prefix ? this.s.prefix + ":" + this.s.localName : this.s.localName));
      }
    };
    var $i = class extends D2 {
      constructor(a2, b2, c2) {
        super(new uf({}), [], { B: false, R: "unsorted" });
        this.A = c2;
        this.s = b2;
        this.L = a2;
        this.l = null;
      }
      h(a2, b2) {
        if (!a2.ra[this.l]) {
          if (this.P) return this.P(a2, b2);
          throw Error("XQDY0054: The variable " + this.A + " is declared but not in scope.");
        }
        return a2.ra[this.l]();
      }
      v(a2) {
        null === this.s && this.L && (this.s = a2.$(this.L));
        this.l = a2.eb(this.s || "", this.A);
        if (!this.l) throw Error("XPST0008, The variable " + this.A + " is not in scope.");
        if (a2 = a2.Ea[this.l]) this.P = a2;
      }
    };
    var aj = class extends Th {
      constructor(a2, b2) {
        super(new uf({}), [a2, b2], { B: false, W: false, R: "unsorted", subtree: false }, b2);
        this.A = a2;
      }
      L(a2, b2, c2, d2) {
        let e2 = null, f2 = null;
        return d2({ next: () => {
          for (; ; ) {
            if (!f2) {
              var h2 = b2.next(0);
              if (h2.done) return p2;
              e2 = h2.value;
              f2 = C2(this.A, e2, c2);
            }
            h2 = f2.fa();
            const k2 = e2;
            f2 = e2 = null;
            if (h2) return q2(k2);
          }
        } });
      }
    };
    var bj = class {
      constructor(a2) {
        this.type = a2;
      }
    };
    var cj = class extends bj {
      constructor(a2) {
        super("delete");
        this.target = a2;
      }
      h(a2) {
        return { type: this.type, target: $f(this.target, a2, false) };
      }
    };
    var dj = class extends bj {
      constructor(a2, b2, c2) {
        super(c2);
        this.target = a2;
        this.content = b2;
      }
      h(a2) {
        return { type: this.type, target: $f(this.target, a2, false), content: this.content.map((b2) => $f(b2, a2, true)) };
      }
    };
    var ej = class extends dj {
      constructor(a2, b2) {
        super(a2, b2, "insertAfter");
      }
    };
    var fj = class extends bj {
      constructor(a2, b2) {
        super("insertAttributes");
        this.target = a2;
        this.content = b2;
      }
      h(a2) {
        return { type: this.type, target: $f(this.target, a2, false), content: this.content.map((b2) => $f(b2, a2, true)) };
      }
    };
    var gj = class extends dj {
      constructor(a2, b2) {
        super(a2, b2, "insertBefore");
      }
    };
    var hj = class extends dj {
      constructor(a2, b2) {
        super(a2, b2, "insertIntoAsFirst");
      }
    };
    var ij = class extends dj {
      constructor(a2, b2) {
        super(a2, b2, "insertIntoAsLast");
      }
    };
    var jj = class extends dj {
      constructor(a2, b2) {
        super(a2, b2, "insertInto");
      }
    };
    var kj = class extends bj {
      constructor(a2, b2) {
        super("rename");
        this.target = a2;
        this.o = b2.za ? b2 : new Sa(b2.prefix, b2.namespaceURI, b2.localName);
      }
      h(a2) {
        return { type: this.type, target: $f(this.target, a2, false), newName: { prefix: this.o.prefix, namespaceURI: this.o.namespaceURI, localName: this.o.localName } };
      }
    };
    var lj = class extends bj {
      constructor(a2, b2) {
        super("replaceElementContent");
        this.target = a2;
        this.text = b2;
      }
      h(a2) {
        return { type: this.type, target: $f(this.target, a2, false), text: this.text ? $f(this.text, a2, true) : null };
      }
    };
    var mj = class extends bj {
      constructor(a2, b2) {
        super("replaceNode");
        this.target = a2;
        this.o = b2;
      }
      h(a2) {
        return { type: this.type, target: $f(this.target, a2, false), replacement: this.o.map((b2) => $f(b2, a2, true)) };
      }
    };
    var nj = class extends bj {
      constructor(a2, b2) {
        super("replaceValue");
        this.target = a2;
        this.o = b2;
      }
      h(a2) {
        return { type: this.type, target: $f(this.target, a2, false), ["string-value"]: this.o };
      }
    };
    var oj = (a2, b2) => new mj(a2, b2);
    var pj = class extends nf {
      constructor(a2) {
        super(new uf({}), [a2], { B: false, R: "unsorted" });
        this.l = a2;
      }
      s(a2, b2) {
        const c2 = mf(this.l)(a2, b2), d2 = b2.h;
        let e2, f2;
        return { next: () => {
          if (!e2) {
            const h2 = c2.next(0);
            if (h2.value.J.some((k2) => !v2(k2.type, 53))) throw Error("XUTY0007: The target of a delete expression must be a sequence of zero or more nodes.");
            e2 = h2.value.J;
            f2 = h2.value.da;
          }
          e2 = e2.filter((h2) => x2(d2, h2.value));
          return q2({ da: lf(e2.map((h2) => new cj(h2.value)), f2), J: [] });
        } };
      }
    };
    function qj(a2, b2, c2, d2, e2, f2) {
      const h2 = b2.h;
      a2.reduce(function t2(l2, n2) {
        if (v2(n2.type, 62)) return n2.h.forEach((u2) => u2().O().forEach((z2) => t2(l2, z2))), l2;
        l2.push(n2);
        return l2;
      }, []).forEach((l2, n2, t2) => {
        if (v2(l2.type, 47)) {
          if (e2) throw f2(l2.value, h2);
          c2.push(l2.value.node);
        } else if (v2(l2.type, 46) || v2(l2.type, 53) && 3 === l2.value.node.nodeType) {
          const u2 = v2(l2.type, 46) ? jd(pc(l2, b2).first(), 1).value : hb(h2, l2.value);
          0 !== n2 && v2(t2[n2 - 1].type, 46) && v2(l2.type, 46) ? (d2.push({ data: " " + u2, Ra: true, nodeType: 3 }), e2 = true) : u2 && (d2.push({ data: "" + u2, Ra: true, nodeType: 3 }), e2 = true);
        } else if (v2(
          l2.type,
          55
        )) {
          const u2 = [];
          gb(h2, l2.value).forEach((z2) => u2.push(rb(z2)));
          e2 = qj(u2, b2, c2, d2, e2, f2);
        } else if (v2(l2.type, 53)) d2.push(l2.value.node), e2 = true;
        else {
          if (v2(l2.type, 60)) throw nc(l2.type);
          throw Error(`Atomizing ${l2.type} is not implemented.`);
        }
      });
      return e2;
    }
    function rj(a2, b2, c2) {
      const d2 = [], e2 = [];
      let f2 = false;
      a2.forEach((h2) => {
        f2 = qj(h2, b2, d2, e2, f2, c2);
      });
      return { attributes: d2, Xa: e2 };
    }
    function sj(a2, b2, c2, d2, e2) {
      const f2 = [];
      switch (a2) {
        case 4:
          d2.length && f2.push(new fj(b2, d2));
          e2.length && f2.push(new hj(b2, e2));
          break;
        case 5:
          d2.length && f2.push(new fj(b2, d2));
          e2.length && f2.push(new ij(b2, e2));
          break;
        case 3:
          d2.length && f2.push(new fj(b2, d2));
          e2.length && f2.push(new jj(b2, e2));
          break;
        case 2:
          d2.length && f2.push(new fj(c2, d2));
          e2.length && f2.push(new gj(b2, e2));
          break;
        case 1:
          d2.length && f2.push(new fj(c2, d2)), e2.length && f2.push(new ej(b2, e2));
      }
      return f2;
    }
    var tj = class extends nf {
      constructor(a2, b2, c2) {
        super(new uf({}), [a2, c2], { B: false, R: "unsorted" });
        this.L = a2;
        this.l = b2;
        this.A = c2;
      }
      s(a2, b2) {
        const c2 = mf(this.L)(a2, b2), d2 = mf(this.A)(a2, b2), e2 = b2.h;
        let f2, h2, k2, l2, n2, t2;
        return { next: () => {
          if (!f2) {
            var u2 = c2.next(0);
            const z2 = rj([u2.value.J], b2, Oe);
            f2 = z2.attributes.map((y2) => ({ node: y2, G: null }));
            h2 = z2.Xa.map((y2) => ({ node: y2, G: null }));
            k2 = u2.value.da;
          }
          if (!l2) {
            u2 = d2.next(0);
            if (0 === u2.value.J.length) throw Xe();
            if (3 <= this.l) {
              if (1 !== u2.value.J.length) throw Pe();
              if (!v2(u2.value.J[0].type, 54) && !v2(u2.value.J[0].type, 55)) throw Pe();
            } else {
              if (1 !== u2.value.J.length) throw Qe();
              if (!(v2(u2.value.J[0].type, 54) || v2(u2.value.J[0].type, 56) || v2(u2.value.J[0].type, 58) || v2(u2.value.J[0].type, 57))) throw Qe();
              t2 = x2(e2, u2.value.J[0].value, null);
              if (null === t2) throw Error(`XUDY0029: The target ${u2.value.J[0].value.outerHTML} for inserting a node before or after must have a parent.`);
            }
            l2 = u2.value.J[0];
            n2 = u2.value.da;
          }
          if (f2.length) {
            if (3 <= this.l) {
              if (!v2(l2.type, 54)) throw Error("XUTY0022: An insert expression specifies the insertion of an attribute node into a document node.");
            } else if (1 !== t2.node.nodeType) throw Error("XUDY0030: An insert expression specifies the insertion of an attribute node before or after a child of a document node.");
            f2.reduce((z2, y2) => {
              const G2 = y2.node.prefix || "";
              var N2 = y2.node.prefix || "";
              const U2 = y2.node.namespaceURI, ca = N2 ? l2.value.node.lookupNamespaceURI(N2) : null;
              if (ca && ca !== U2) throw Ve(U2);
              if ((N2 = z2[N2]) && U2 !== N2) throw We(U2);
              z2[G2] = y2.node.namespaceURI;
              return z2;
            }, {});
          }
          return q2({ J: [], da: lf(sj(this.l, l2.value, t2 ? t2 : null, f2, h2), k2, n2) });
        } };
      }
    };
    const uj = () => mc("Casting not supported from given type to a single xs:string or xs:untypedAtomic or any of its derived types."), vj = /([A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])/, wj = new RegExp(`${vj.source}${new RegExp(`(${vj.source}|[-.0-9·̀-ͯ‿⁀])`).source}*`, "g"), xj = (a2) => (a2 = a2.match(wj)) ? 1 === a2.length : false;
    function yj(a2, b2) {
      return qc(b2, a2).X({ m: (c2) => {
        c2 = c2.first();
        if (v2(c2.type, 1) || v2(c2.type, 19)) {
          if (!xj(c2.value)) throw Error(`XQDY0041: The value "${c2.value}" of a name expressions cannot be converted to a NCName.`);
          return w2.m(c2);
        }
        throw uj();
      }, default: () => {
        throw uj();
      } }).value;
    }
    function zj(a2, b2, c2) {
      return qc(c2, b2).X({ m: (d2) => {
        d2 = d2.first();
        if (v2(d2.type, 23)) return w2.m(d2);
        if (v2(d2.type, 1) || v2(d2.type, 19)) {
          let e2, f2;
          d2 = d2.value.split(":");
          1 === d2.length ? d2 = d2[0] : (e2 = d2[0], f2 = a2.$(e2), d2 = d2[1]);
          if (!xj(d2) || e2 && !xj(e2)) throw xg(e2 ? `${e2}:${d2}` : d2);
          if (e2 && !f2) throw xg(`${e2}:${d2}`);
          return w2.m({ type: 23, value: new Sa(e2, f2, d2) });
        }
        throw uj();
      }, default: () => {
        throw uj();
      } }).value;
    }
    var Aj = class extends nf {
      constructor(a2, b2) {
        super(new uf({}), [a2, b2], { B: false, R: "unsorted" });
        this.A = a2;
        this.L = b2;
        this.l = void 0;
      }
      s(a2, b2) {
        const c2 = mf(this.A)(a2, b2), d2 = mf(this.L)(a2, b2);
        return { next: () => {
          const e2 = c2.next(0);
          var f2 = e2.value.J;
          if (0 === f2.length) throw Xe();
          if (1 !== f2.length) throw Se();
          if (!v2(f2[0].type, 54) && !v2(f2[0].type, 47) && !v2(f2[0].type, 57)) throw Se();
          f2 = f2[0];
          const h2 = d2.next(0);
          a: {
            var k2 = this.l;
            var l2 = w2.create(h2.value.J);
            switch (f2.type) {
              case 54:
                k2 = zj(k2, b2, l2).next(0).value.value;
                if ((l2 = f2.value.node.lookupNamespaceURI(k2.prefix)) && l2 !== k2.namespaceURI) throw Ve(k2.namespaceURI);
                break a;
              case 47:
                k2 = zj(k2, b2, l2).next(0).value.value;
                if (k2.namespaceURI && (l2 = f2.value.node.lookupNamespaceURI(k2.prefix)) && l2 !== k2.namespaceURI) throw Ve(k2.namespaceURI);
                break a;
              case 57:
                k2 = yj(b2, l2).next(0).value.value;
                k2 = new Sa("", null, k2);
                break a;
            }
            k2 = void 0;
          }
          return q2({ J: [], da: lf([new kj(f2.value, k2)], e2.value.da, h2.value.da) });
        } };
      }
      v(a2) {
        this.l = Ef(a2);
        super.v(a2);
      }
    };
    function Bj(a2, b2, c2) {
      let d2, e2, f2;
      return { next: () => {
        if (!d2) {
          var h2 = c2.next(0), k2 = rj([h2.value.J], a2, We);
          d2 = { attributes: k2.attributes.map((l2) => ({ node: l2, G: null })), Xa: k2.Xa.map((l2) => ({ node: l2, G: null })) };
          e2 = h2.value.da;
        }
        k2 = b2.next(0);
        if (0 === k2.value.J.length) throw Xe();
        if (1 !== k2.value.J.length) throw Re();
        if (!(v2(k2.value.J[0].type, 54) || v2(k2.value.J[0].type, 47) || v2(k2.value.J[0].type, 56) || v2(k2.value.J[0].type, 58) || v2(k2.value.J[0].type, 57))) throw Re();
        f2 = x2(a2.h, k2.value.J[0].value, null);
        if (null === f2) throw Error(`XUDY0009: The target ${k2.value.J[0].value.outerHTML} for replacing a node must have a parent.`);
        h2 = k2.value.J[0];
        k2 = k2.value.da;
        if (v2(h2.type, 47)) {
          if (d2.Xa.length) throw Error("XUTY0011: When replacing an attribute the new value must be zero or more attribute nodes.");
          d2.attributes.reduce((l2, n2) => {
            const t2 = n2.node.prefix || "";
            n2 = n2.node.namespaceURI;
            var u2 = f2.node.lookupNamespaceURI(t2);
            if (u2 && u2 !== n2) throw Ve(n2);
            if ((u2 = l2[t2]) && n2 !== u2) throw We(n2);
            l2[t2] = n2;
            return l2;
          }, {});
        } else if (d2.attributes.length) throw Error("XUTY0010: When replacing an an element, text, comment, or processing instruction node the new value must be a single node.");
        return q2({ J: [], da: lf([oj(h2.value, [].concat(d2.attributes, d2.Xa))], e2, k2) });
      } };
    }
    function Cj(a2, b2, c2) {
      let d2, e2, f2, h2, k2 = false;
      return { next: () => {
        if (k2) return p2;
        if (!f2) {
          var l2 = c2.next(0);
          const n2 = qc(w2.create(l2.value.J), a2).map((t2) => jd(t2, 1)).O().map((t2) => t2.value).join(" ");
          f2 = 0 === n2.length ? null : { node: a2.Ja.createTextNode(n2), G: null };
          h2 = l2.value.da;
        }
        if (!d2) {
          l2 = b2.next(0);
          if (0 === l2.value.J.length) throw Xe();
          if (1 !== l2.value.J.length) throw Re();
          if (!(v2(l2.value.J[0].type, 54) || v2(l2.value.J[0].type, 47) || v2(l2.value.J[0].type, 56) || v2(l2.value.J[0].type, 58) || v2(l2.value.J[0].type, 57))) throw Re();
          d2 = l2.value.J[0];
          e2 = l2.value.da;
        }
        if (v2(
          d2.type,
          54
        )) return k2 = true, q2({ J: [], da: lf([new lj(d2.value, f2)], h2, e2) });
        if (v2(d2.type, 47) || v2(d2.type, 56) || v2(d2.type, 58) || v2(d2.type, 57)) {
          l2 = f2 ? hb(a2.h, f2) : "";
          if (v2(d2.type, 58) && (l2.includes("--") || l2.endsWith("-"))) throw Error(`XQDY0072: The content "${l2}" for a comment node contains two adjacent hyphens or ends with a hyphen.`);
          if (v2(d2.type, 57) && l2.includes("?>")) throw Error(`XQDY0026: The content "${l2}" for a processing instruction node contains "?>".`);
          k2 = true;
          return q2({ J: [], da: lf([new nj(d2.value, l2)], h2, e2) });
        }
      } };
    }
    var Qj = class extends nf {
      constructor(a2, b2, c2) {
        super(new uf({}), [b2, c2], { B: false, R: "unsorted" });
        this.L = a2;
        this.l = b2;
        this.A = c2;
      }
      s(a2, b2) {
        const c2 = mf(this.l)(a2, b2);
        a2 = mf(this.A)(a2, b2);
        return this.L ? Cj(b2, c2, a2) : Bj(b2, c2, a2);
      }
    };
    function Rj(a2) {
      switch (a2.type) {
        case "delete":
          return new cj({ node: a2.target, G: null });
        case "insertAfter":
          return new ej({ node: a2.target, G: null }, a2.content.map((b2) => ({ node: b2, G: null })));
        case "insertBefore":
          return new gj({ node: a2.target, G: null }, a2.content.map((b2) => ({ node: b2, G: null })));
        case "insertInto":
          return new jj({ node: a2.target, G: null }, a2.content.map((b2) => ({ node: b2, G: null })));
        case "insertIntoAsFirst":
          return new hj({ node: a2.target, G: null }, a2.content.map((b2) => ({ node: b2, G: null })));
        case "insertIntoAsLast":
          return new ij({
            node: a2.target,
            G: null
          }, a2.content.map((b2) => ({ node: b2, G: null })));
        case "insertAttributes":
          return new fj({ node: a2.target, G: null }, a2.content.map((b2) => ({ node: b2, G: null })));
        case "rename":
          return new kj({ node: a2.target, G: null }, a2.newName);
        case "replaceNode":
          return new mj({ node: a2.target, G: null }, a2.replacement.map((b2) => ({ node: b2, G: null })));
        case "replaceValue":
          return new nj({ node: a2.target, G: null }, a2["string-value"]);
        case "replaceElementContent":
          return new lj({ node: a2.target, G: null }, a2.text ? { node: a2.text, G: null } : null);
        default:
          throw Error(`Unexpected type "${a2.type}" when parsing a transferable pending update.`);
      }
    }
    function Sj(a2, b2, c2) {
      if (b2.find((e2) => md(e2, a2))) return true;
      const d2 = x2(c2, a2);
      return d2 ? Sj(d2, b2, c2) : false;
    }
    var Tj = class extends nf {
      constructor(a2, b2, c2) {
        super(new uf({}), a2.reduce((d2, e2) => {
          d2.push(e2.fb);
          return d2;
        }, [b2, c2]), { B: false, R: "unsorted" });
        this.l = a2;
        this.L = b2;
        this.A = c2;
        this.I = null;
      }
      h(a2, b2) {
        a2 = this.s(a2, b2);
        return of(a2, () => {
        });
      }
      s(a2, b2) {
        const c2 = b2.h, d2 = b2.Ja, e2 = b2.Ma, f2 = [];
        let h2, k2, l2;
        const n2 = [], t2 = [];
        return { next: () => {
          if (n2.length !== this.l.length) for (var u2 = n2.length; u2 < this.l.length; u2++) {
            const y2 = this.l[u2];
            var z2 = f2[u2];
            z2 || (f2[u2] = z2 = mf(y2.fb)(a2, b2));
            z2 = z2.next(0);
            if (1 !== z2.value.J.length || !v2(z2.value.J[0].type, 53)) throw Error("XUTY0013: The source expression of a copy modify expression must return a single node.");
            const G2 = rb(Wf(z2.value.J[0].value, b2));
            n2.push(G2.value);
            t2.push(z2.value.da);
            a2 = hc(a2, { [y2.fc]: () => w2.m(G2) });
          }
          l2 || (h2 || (h2 = mf(this.L)(a2, b2)), l2 = h2.next(0).value.da);
          l2.forEach((y2) => {
            if (y2.target && !Sj(y2.target, n2, c2)) throw Error(`XUDY0014: The target ${y2.target.node.outerHTML} must be a node created by the copy clause.`);
            if ("put" === y2.type) throw Error("XUDY0037: The modify expression of a copy modify expression can not contain a fn:put.");
          });
          u2 = l2.map((y2) => {
            y2 = y2.h(b2);
            return Rj(y2);
          });
          kf(u2, c2, d2, e2);
          k2 || (k2 = mf(this.A)(a2, b2));
          u2 = k2.next(0);
          return q2({
            J: u2.value.J,
            da: lf(u2.value.da, ...t2)
          });
        } };
      }
      v(a2) {
        Cg(a2);
        this.l.forEach((b2) => b2.fc = Gg(a2, b2.Jb.namespaceURI, b2.Jb.localName));
        super.v(a2);
        Ig(a2);
        this.I = this.l.some((b2) => b2.fb.I) || this.A.I;
      }
    };
    function Uj(a2, b2) {
      return { node: { nodeType: 2, Ra: true, nodeName: a2.za(), namespaceURI: a2.namespaceURI, prefix: a2.prefix, localName: a2.localName, name: a2.za(), value: b2 }, G: null };
    }
    var Vj = class extends D2 {
      constructor(a2, b2) {
        let c2 = b2.nb || [];
        c2 = c2.concat(a2.Na || []);
        super(new uf({}), c2, { B: false, R: "unsorted" });
        a2.Na ? this.s = a2.Na : this.name = new Sa(a2.prefix, a2.namespaceURI, a2.localName);
        this.l = b2;
        this.A = void 0;
      }
      h(a2, b2) {
        let c2, d2, e2, f2 = false;
        return w2.create({ next: () => {
          if (f2) return p2;
          if (!d2) {
            if (this.s) {
              if (!c2) {
                var h2 = this.s.h(a2, b2);
                c2 = zj(this.A, b2, h2);
              }
              d2 = c2.next(0).value.value;
            } else d2 = this.name;
            if (d2) {
              if ("xmlns" === d2.prefix) throw rg(d2);
              if ("" === d2.prefix && "xmlns" === d2.localName) throw rg(d2);
              if ("http://www.w3.org/2000/xmlns/" === d2.namespaceURI) throw rg(d2);
              if ("xml" === d2.prefix && "http://www.w3.org/XML/1998/namespace" !== d2.namespaceURI) throw rg(d2);
              if ("" !== d2.prefix && "xml" !== d2.prefix && "http://www.w3.org/XML/1998/namespace" === d2.namespaceURI) throw rg(d2);
            }
          }
          if (this.l.nb) return h2 = this.l.nb, e2 || (e2 = jc(h2.map((k2) => qc(k2.h(a2, b2), b2).N((l2) => w2.m(g2(l2.map((n2) => n2.value).join(" "), 1))))).N((k2) => w2.m(rb(Uj(d2, k2.map((l2) => l2.value).join(""))))).value), e2.next(0);
          f2 = true;
          return q2(rb(Uj(d2, this.l.value)));
        } });
      }
      v(a2) {
        this.A = Ef(a2);
        if (this.name && this.name.prefix && !this.name.namespaceURI) {
          const b2 = a2.$(this.name.prefix);
          if (void 0 === b2 && this.name.prefix) throw oc(this.name.prefix);
          this.name.namespaceURI = b2 || null;
        }
        super.v(a2);
      }
    };
    var Wj = class extends D2 {
      constructor(a2) {
        super(a2 ? a2.o : new uf({}), a2 ? [a2] : [], { B: false, R: "unsorted" });
        this.l = a2;
      }
      h(a2, b2) {
        const c2 = { data: "", Ra: true, nodeType: 8 }, d2 = { node: c2, G: null };
        if (!this.l) return w2.m(rb(d2));
        a2 = C2(this.l, a2, b2);
        return qc(a2, b2).N((e2) => {
          e2 = e2.map((f2) => jd(f2, 1).value).join(" ");
          if (-1 !== e2.indexOf("-->")) throw Error('XQDY0072: The contents of the data of a comment may not include "-->"');
          c2.data = e2;
          return w2.m(rb(d2));
        });
      }
    };
    var Xj = class extends D2 {
      constructor(a2, b2, c2, d2) {
        super(new uf({}), d2.concat(b2).concat(a2.Na || []), { B: false, R: "unsorted" });
        a2.Na ? this.s = a2.Na : this.l = new Sa(a2.prefix, a2.namespaceURI, a2.localName);
        this.P = c2.reduce((e2, f2) => {
          if (f2.prefix in e2) throw Error(`XQST0071: The namespace declaration with the prefix ${f2.prefix} has already been declared on the constructed element.`);
          e2[f2.prefix || ""] = f2.uri;
          return e2;
        }, {});
        this.L = b2;
        this.ma = d2;
        this.A = void 0;
      }
      h(a2, b2) {
        let c2 = false, d2, e2, f2 = false, h2, k2, l2, n2 = false;
        return w2.create({ next: () => {
          if (n2) return p2;
          c2 || (d2 || (d2 = jc(this.L.map((G2) => C2(G2, a2, b2)))), e2 = d2.O(), c2 = true);
          if (!f2) {
            h2 || (h2 = this.ma.map((G2) => C2(G2, a2, b2)));
            var t2 = [];
            for (var u2 = 0; u2 < h2.length; u2++) {
              var z2 = h2[u2].O();
              t2.push(z2);
            }
            k2 = t2;
            f2 = true;
          }
          this.s && (l2 || (t2 = this.s.h(a2, b2), l2 = zj(this.A, b2, t2)), this.l = l2.next(0).value.value);
          if ("xmlns" === this.l.prefix || "http://www.w3.org/2000/xmlns/" === this.l.namespaceURI || "xml" === this.l.prefix && "http://www.w3.org/XML/1998/namespace" !== this.l.namespaceURI || this.l.prefix && "xml" !== this.l.prefix && "http://www.w3.org/XML/1998/namespace" === this.l.namespaceURI) throw Error(`XQDY0096: The node name "${this.l.za()}" is invalid for a computed element constructor.`);
          const y2 = { nodeType: 1, Ra: true, attributes: [], childNodes: [], nodeName: this.l.za(), namespaceURI: this.l.namespaceURI, prefix: this.l.prefix, localName: this.l.localName };
          t2 = { node: y2, G: null };
          e2.forEach((G2) => {
            y2.attributes.push(G2.value.node);
          });
          u2 = rj(k2, b2, qg);
          u2.attributes.forEach((G2) => {
            if (y2.attributes.find((N2) => N2.namespaceURI === G2.namespaceURI && N2.localName === G2.localName)) throw Error(`XQDY0025: The attribute ${G2.name} does not have an unique name in the constructed element.`);
            y2.attributes.push(G2);
          });
          u2.Xa.forEach((G2) => {
            y2.childNodes.push(G2);
          });
          for (u2 = 0; u2 < y2.childNodes.length; u2++) {
            z2 = y2.childNodes[u2];
            if (!cb(z2) || 3 !== z2.nodeType) continue;
            const G2 = y2.childNodes[u2 - 1];
            G2 && cb(G2) && 3 === G2.nodeType && (G2.data += z2.data, y2.childNodes.splice(u2, 1), u2--);
          }
          n2 = true;
          return q2(rb(t2));
        } });
      }
      v(a2) {
        Cg(a2);
        Object.keys(this.P).forEach((b2) => Fg(a2, b2, this.P[b2]));
        this.Fa.forEach((b2) => b2.v(a2));
        this.L.reduce((b2, c2) => {
          if (c2.name) {
            c2 = `Q{${null === c2.name.namespaceURI ? a2.$(c2.name.prefix) : c2.name.namespaceURI}}${c2.name.localName}`;
            if (b2.includes(c2)) throw Error(`XQST0040: The attribute ${c2} does not have an unique name in the constructed element.`);
            b2.push(c2);
          }
          return b2;
        }, []);
        if (this.l && null === this.l.namespaceURI) {
          const b2 = a2.$(this.l.prefix);
          if (void 0 === b2 && this.l.prefix) throw oc(this.l.prefix);
          this.l.namespaceURI = b2;
        }
        this.A = Ef(a2);
        Ig(a2);
      }
    };
    function Yj(a2) {
      if (/^xml$/i.test(a2)) throw Error(`XQDY0064: The target of a created PI may not be "${a2}"`);
    }
    function Zj(a2, b2) {
      return { node: { data: b2, Ra: true, nodeName: a2, nodeType: 7, target: a2 }, G: null };
    }
    var ak = class extends D2 {
      constructor(a2, b2) {
        const c2 = a2.xb ? [a2.xb].concat(b2) : [b2];
        super(c2.reduce((d2, e2) => d2.add(e2.o), new uf({})), c2, { B: false, R: "unsorted" });
        this.l = a2;
        this.s = b2;
      }
      h(a2, b2) {
        const c2 = C2(this.s, a2, b2);
        return qc(c2, b2).N((d2) => {
          const e2 = d2.map((h2) => jd(h2, 1).value).join(" ");
          if (-1 !== e2.indexOf("?>")) throw Error('XQDY0026: The contents of the data of a processing instruction may not include "?>"');
          if (null !== this.l.Fb) return d2 = this.l.Fb, Yj(d2), w2.m(rb(Zj(d2, e2)));
          d2 = C2(this.l.xb, a2, b2);
          const f2 = yj(b2, d2);
          return w2.create({ next: () => {
            var h2 = f2.next(0);
            if (h2.done) return h2;
            h2 = h2.value.value;
            Yj(h2);
            return q2(rb(Zj(h2, e2)));
          } });
        });
      }
    };
    var bk = class extends D2 {
      constructor(a2) {
        super(a2 ? a2.o : new uf({}), a2 ? [a2] : [], { B: false, R: "unsorted" });
        this.l = a2;
      }
      h(a2, b2) {
        if (!this.l) return w2.empty();
        a2 = C2(this.l, a2, b2);
        return qc(a2, b2).N((c2) => {
          if (0 === c2.length) return w2.empty();
          c2 = { node: { data: c2.map((d2) => jd(d2, 1).value).join(" "), Ra: true, nodeType: 3 }, G: null };
          return w2.m(rb(c2));
        });
      }
    };
    var ck = class extends qf {
      constructor(a2, b2, c2, d2) {
        super(new uf({}), [a2, ...b2.map((e2) => e2.pb), c2].concat(...b2.map((e2) => e2.Ib.map((f2) => f2.Hb))), { B: false, W: false, R: "unsorted", subtree: false }, d2);
        this.L = a2;
        this.l = b2.length;
        this.P = b2.map((e2) => e2.Ib);
      }
      A(a2, b2, c2) {
        return c2[0](a2).N((d2) => {
          for (let e2 = 0; e2 < this.l; e2++) if (this.P[e2].some((f2) => {
            switch (f2.ec) {
              case "?":
                if (1 < d2.length) return false;
                break;
              case "*":
                break;
              case "+":
                if (1 > d2.length) return false;
                break;
              default:
                if (1 !== d2.length) return false;
            }
            const h2 = w2.create(d2);
            return d2.every((k2, l2) => {
              k2 = bc(a2, l2, k2, h2);
              return C2(f2.Hb, k2, b2).fa();
            });
          })) return c2[e2 + 1](a2);
          return c2[this.l + 1](a2);
        });
      }
      v(a2) {
        super.v(a2);
        if (this.L.I) throw Ne();
      }
    };
    var dk = class extends qf {
      constructor(a2, b2, c2, d2) {
        super(new uf({}), [a2, c2, ...b2.map((e2) => e2.pb)].concat(...b2.map((e2) => e2.Gb.map((f2) => f2))), { B: false, W: false, R: "unsorted", subtree: false }, d2);
        this.L = a2;
        this.l = b2.length;
        this.P = b2.map((e2) => e2.Gb);
      }
      A(a2, b2, c2) {
        const d2 = ei(c2[0](a2), b2), [, e2, ...f2] = c2;
        return d2.X({ multiple: () => {
          throw Error("XPTY0004: The operand for a switch expression should result in zero or one item");
        }, default: () => {
          const h2 = d2.first(), k2 = !h2;
          for (let n2 = 0; n2 < this.l; n2++) {
            var l2 = this.P[n2].map((t2) => C2(t2, a2, b2));
            for (const t2 of l2) if (l2 = ei(t2, b2), l2.F()) {
              if (k2) return f2[n2](a2);
            } else {
              if (!l2.oa()) throw Error("XPTY0004: The operand for a switch case should result in zero or one item");
              if (!k2 && (l2 = l2.first(), Ge(a2, b2, null, h2, l2).next(0).value)) return f2[n2](a2);
            }
          }
          return e2(a2);
        } });
      }
      v(a2) {
        super.v(a2);
        if (this.L.I) throw Ne();
      }
    };
    var ek = { Z: false, sa: false }, fk = { Z: true, sa: false }, gk = { Z: true, sa: true };
    function P2(a2) {
      return a2.Z ? a2.sa ? gk : fk : ek;
    }
    function Q2(a2, b2) {
      switch (a2[0]) {
        case "andOp":
          var c2 = I2(a2, "type");
          return new ci(hk("andOp", a2, P2(b2)), c2);
        case "orOp":
          return c2 = I2(a2, "type"), new di(hk("orOp", a2, P2(b2)), c2);
        case "unaryPlusOp":
          return c2 = F2(F2(a2, "operand"), "*"), a2 = I2(a2, "type"), new bi("+", Q2(c2, b2), a2);
        case "unaryMinusOp":
          return c2 = F2(F2(a2, "operand"), "*"), a2 = I2(a2, "type"), new bi("-", Q2(c2, b2), a2);
        case "addOp":
        case "subtractOp":
        case "multiplyOp":
        case "divOp":
        case "idivOp":
        case "modOp":
          var d2 = a2[0], e2 = Q2(J2(a2, ["firstOperand", "*"]), P2(b2));
          b2 = Q2(J2(a2, ["secondOperand", "*"]), P2(b2));
          const f2 = I2(a2, "type"), h2 = I2(J2(a2, ["firstOperand", "*"]), "type"), k2 = I2(J2(a2, ["secondOperand", "*"]), "type");
          h2 && k2 && I2(a2, "type") && (c2 = Rg(d2, h2.type, k2.type));
          return new Vg(d2, e2, b2, f2, c2);
        case "sequenceExpr":
          return ik(a2, b2);
        case "unionOp":
          return c2 = I2(a2, "type"), new Hi([Q2(J2(a2, ["firstOperand", "*"]), P2(b2)), Q2(J2(a2, ["secondOperand", "*"]), P2(b2))], c2);
        case "exceptOp":
        case "intersectOp":
          return c2 = I2(a2, "type"), new xi(a2[0], Q2(J2(a2, ["firstOperand", "*"]), P2(b2)), Q2(J2(a2, ["secondOperand", "*"]), P2(b2)), c2);
        case "stringConcatenateOp":
          return jk(a2, b2);
        case "rangeSequenceExpr":
          return kk(
            a2,
            b2
          );
        case "equalOp":
        case "notEqualOp":
        case "lessThanOrEqualOp":
        case "lessThanOp":
        case "greaterThanOrEqualOp":
        case "greaterThanOp":
          return lk("generalCompare", a2, b2);
        case "eqOp":
        case "neOp":
        case "ltOp":
        case "leOp":
        case "gtOp":
        case "geOp":
          return lk("valueCompare", a2, b2);
        case "isOp":
        case "nodeBeforeOp":
        case "nodeAfterOp":
          return lk("nodeCompare", a2, b2);
        case "pathExpr":
          return mk(a2, b2);
        case "contextItemExpr":
          return new Mi(I2(a2, "type"));
        case "functionCallExpr":
          return nk(a2, b2);
        case "inlineFunctionExpr":
          return ok(a2, b2);
        case "arrowExpr":
          return pk(a2, b2);
        case "dynamicFunctionInvocationExpr":
          return qk(a2, b2);
        case "namedFunctionRef":
          return b2 = F2(a2, "functionName"), c2 = I2(a2, "type"), a2 = H2(J2(a2, ["integerConstantExpr", "value"])), new $h(Jg(b2), parseInt(a2, 10), c2);
        case "integerConstantExpr":
          return new Yh(H2(F2(a2, "value")), { type: 5, g: 3 });
        case "stringConstantExpr":
          return new Yh(H2(F2(a2, "value")), { type: 1, g: 3 });
        case "decimalConstantExpr":
          return new Yh(H2(F2(a2, "value")), { type: 4, g: 3 });
        case "doubleConstantExpr":
          return new Yh(H2(F2(a2, "value")), { type: 3, g: 3 });
        case "varRef":
          const { prefix: l2, namespaceURI: n2, localName: t2 } = Jg(F2(a2, "name"));
          return new $i(l2, n2, t2);
        case "flworExpr":
          return rk(a2, b2);
        case "quantifiedExpr":
          return sk(a2, b2);
        case "ifThenElseExpr":
          return c2 = I2(a2, "type"), d2 = F2(a2, "ifClause") || K2(a2, "x:stackTrace")[0], e2 = F2(a2, "thenClause") || K2(a2, "x:stackTrace")[1], a2 = F2(a2, "elseClause") || K2(a2, "x:stackTrace")[2], new Ph(Q2(d2, P2(b2)), Q2(e2, b2), Q2(a2, b2), c2);
        case "instanceOfExpr":
          return c2 = Q2(J2(a2, ["argExpr", "*"]), b2), d2 = J2(a2, ["sequenceType", "*"]), e2 = J2(a2, ["sequenceType", "occurrenceIndicator"]), a2 = I2(a2, "type"), new Di(c2, Q2(d2, P2(b2)), e2 ? H2(e2) : "", a2);
        case "castExpr":
          return b2 = Q2(F2(F2(a2, "argExpr"), "*"), P2(b2)), c2 = F2(a2, "singleType"), a2 = Jg(F2(c2, "atomicType")), c2 = null !== F2(c2, "optional"), new Bi(b2, a2, c2);
        case "castableExpr":
          return b2 = Q2(F2(F2(a2, "argExpr"), "*"), P2(b2)), c2 = F2(a2, "singleType"), a2 = Jg(F2(c2, "atomicType")), c2 = null !== F2(c2, "optional"), new Ai(b2, a2, c2);
        case "simpleMapExpr":
          return tk(a2, b2);
        case "mapConstructor":
          return uk(a2, b2);
        case "arrayConstructor":
          return vk(a2, b2);
        case "unaryLookup":
          return c2 = I2(a2, "type"), new Ti(wk(a2, b2), c2);
        case "typeswitchExpr":
          return xk(
            a2,
            b2
          );
        case "switchExpr":
          return yk(a2, b2);
        case "elementConstructor":
          return zk(a2, b2);
        case "attributeConstructor":
          return Ak(a2, b2);
        case "computedAttributeConstructor":
          return (c2 = F2(a2, "tagName")) ? c2 = Jg(c2) : (c2 = F2(a2, "tagNameExpr"), c2 = { Na: Q2(F2(c2, "*"), P2(b2)) }), b2 = Q2(F2(F2(a2, "valueExpr"), "*"), P2(b2)), new Vj(c2, { nb: [b2] });
        case "computedCommentConstructor":
          if (!b2.Z) throw Error("XPST0003: Use of XQuery functionality is not allowed in XPath context");
          b2 = (a2 = F2(a2, "argExpr")) ? Q2(F2(a2, "*"), P2(b2)) : null;
          return new Wj(b2);
        case "computedTextConstructor":
          if (!b2.Z) throw Error("XPST0003: Use of XQuery functionality is not allowed in XPath context");
          b2 = (a2 = F2(a2, "argExpr")) ? Q2(F2(a2, "*"), P2(b2)) : null;
          return new bk(b2);
        case "computedElementConstructor":
          return Bk(a2, b2);
        case "computedPIConstructor":
          if (!b2.Z) throw Error("XPST0003: Use of XQuery functionality is not allowed in XPath context");
          c2 = F2(a2, "piTargetExpr");
          d2 = F2(a2, "piTarget");
          e2 = F2(a2, "piValueExpr");
          a2 = I2(a2, "type");
          return new ak({ xb: c2 ? Q2(F2(c2, "*"), P2(b2)) : null, Fb: d2 ? H2(d2) : null }, e2 ? Q2(F2(e2, "*"), P2(b2)) : new yi([], a2));
        case "CDataSection":
          return new Yh(H2(a2), { type: 1, g: 3 });
        case "deleteExpr":
          return b2 = Q2(
            J2(a2, ["targetExpr", "*"]),
            b2
          ), new pj(b2);
        case "insertExpr":
          c2 = Q2(J2(a2, ["sourceExpr", "*"]), b2);
          e2 = K2(a2, "*")[1];
          switch (e2[0]) {
            case "insertAfter":
              d2 = 1;
              break;
            case "insertBefore":
              d2 = 2;
              break;
            case "insertInto":
              d2 = (d2 = F2(e2, "*")) ? "insertAsFirst" === d2[0] ? 4 : 5 : 3;
          }
          b2 = Q2(J2(a2, ["targetExpr", "*"]), b2);
          return new tj(c2, d2, b2);
        case "renameExpr":
          return c2 = Q2(J2(a2, ["targetExpr", "*"]), b2), b2 = Q2(J2(a2, ["newNameExpr", "*"]), b2), new Aj(c2, b2);
        case "replaceExpr":
          return c2 = !!F2(a2, "replaceValue"), d2 = Q2(J2(a2, ["targetExpr", "*"]), b2), b2 = Q2(J2(a2, ["replacementExpr", "*"]), b2), new Qj(c2, d2, b2);
        case "transformExpr":
          return Ck(
            a2,
            b2
          );
        case "x:stackTrace":
          c2 = a2;
          for (a2 = c2[2]; "x:stackTrace" === a2[0]; ) c2 = a2, a2 = a2[2];
          c2 = c2[1];
          return new Rh(c2, a2[0], Q2(a2, b2), c2.Wa);
        case "ifClause":
        case "thenClause":
        case "elseClause":
          return Q2(F2(a2, "*"), b2);
        default:
          return Dk(a2);
      }
    }
    function Dk(a2) {
      switch (a2[0]) {
        case "nameTest":
          return new Xi(Jg(a2));
        case "piTest":
          return (a2 = F2(a2, "piTarget")) ? new Yi(H2(a2)) : new Wi(7);
        case "commentTest":
          return new Wi(8);
        case "textTest":
          return new Wi(3);
        case "documentTest":
          return new Wi(9);
        case "attributeTest":
          var b2 = (a2 = F2(a2, "attributeName")) && F2(a2, "star");
          return !a2 || b2 ? new Wi(2) : new Xi(Jg(F2(a2, "QName")), { kind: 2 });
        case "elementTest":
          return b2 = (a2 = F2(a2, "elementName")) && F2(a2, "star"), !a2 || b2 ? new Wi(1) : new Xi(Jg(F2(a2, "QName")), { kind: 1 });
        case "anyKindTest":
          return new Zi({
            prefix: "",
            namespaceURI: null,
            localName: "node()"
          });
        case "anyMapTest":
          return new Zi({ prefix: "", namespaceURI: null, localName: "map(*)" });
        case "anyArrayTest":
          return new Zi({ prefix: "", namespaceURI: null, localName: "array(*)" });
        case "Wildcard":
          return F2(a2, "star") ? (b2 = F2(a2, "uri")) ? a2 = new Xi({ localName: "*", namespaceURI: H2(b2), prefix: "" }) : (b2 = F2(a2, "NCName"), a2 = "star" === F2(a2, "*")[0] ? new Xi({ localName: H2(b2), namespaceURI: null, prefix: "*" }) : new Xi({ localName: "*", namespaceURI: null, prefix: H2(b2) })) : a2 = new Xi({
            localName: "*",
            namespaceURI: null,
            prefix: "*"
          }), a2;
        case "atomicType":
          return new Zi(Jg(a2));
        case "anyItemType":
          return new Zi({ prefix: "", namespaceURI: null, localName: "item()" });
        default:
          throw Error("No selector counterpart for: " + a2[0] + ".");
      }
    }
    function vk(a2, b2) {
      const c2 = I2(a2, "type");
      a2 = F2(a2, "*");
      const d2 = K2(a2, "arrayElem").map((e2) => Q2(F2(e2, "*"), P2(b2)));
      switch (a2[0]) {
        case "curlyArray":
          return new rh(d2, c2);
        case "squareArray":
          return new sh(d2, c2);
        default:
          throw Error("Unrecognized arrayType: " + a2[0]);
      }
    }
    function uk(a2, b2) {
      const c2 = I2(a2, "type");
      return new Zh(K2(a2, "mapConstructorEntry").map((d2) => ({ key: Q2(J2(d2, ["mapKeyExpr", "*"]), P2(b2)), value: Q2(J2(d2, ["mapValueExpr", "*"]), P2(b2)) })), c2);
    }
    function hk(a2, b2, c2) {
      function d2(f2) {
        const h2 = F2(F2(f2, "firstOperand"), "*");
        f2 = F2(F2(f2, "secondOperand"), "*");
        h2[0] === a2 ? d2(h2) : e2.push(Q2(h2, c2));
        f2[0] === a2 ? d2(f2) : e2.push(Q2(f2, c2));
      }
      const e2 = [];
      d2(b2);
      return e2;
    }
    function wk(a2, b2) {
      a2 = F2(a2, "*");
      switch (a2[0]) {
        case "NCName":
          return new Yh(H2(a2), { type: 1, g: 3 });
        case "star":
          return "*";
        default:
          return Q2(a2, P2(b2));
      }
    }
    function lk(a2, b2, c2) {
      var d2 = J2(b2, ["firstOperand", "*"]);
      const e2 = J2(b2, ["secondOperand", "*"]);
      d2 = Q2(d2, P2(c2));
      c2 = Q2(e2, P2(c2));
      switch (a2) {
        case "valueCompare":
          return new pi(b2[0], d2, c2);
        case "nodeCompare":
          return new vi(b2[0], d2, c2);
        case "generalCompare":
          return new si(b2[0], d2, c2);
      }
    }
    function Ek(a2, b2, c2) {
      a2 = K2(a2, "*");
      return new Ki(a2.filter((d2) => "stable" !== d2[0]).map((d2) => {
        var e2 = F2(d2, "orderModifier"), f2 = e2 ? F2(e2, "orderingKind") : null;
        e2 = e2 ? F2(e2, "emptyOrderingMode") : null;
        f2 = f2 ? "ascending" === H2(f2) : true;
        e2 = e2 ? "empty least" === H2(e2) : true;
        return { ba: Q2(J2(d2, ["orderByExpr", "*"]), b2), Bb: f2, cc: e2 };
      }), c2);
    }
    function rk(a2, b2) {
      var c2 = K2(a2, "*");
      a2 = F2(c2[c2.length - 1], "*");
      c2 = c2.slice(0, -1);
      if (1 < c2.length && !b2.Z) throw Error("XPST0003: Use of XQuery FLWOR expressions in XPath is no allowed");
      return c2.reduceRight((d2, e2) => {
        switch (e2[0]) {
          case "forClause":
            e2 = K2(e2, "*");
            for (var f2 = e2.length - 1; 0 <= f2; --f2) {
              var h2 = e2[f2], k2 = J2(h2, ["forExpr", "*"]);
              const l2 = F2(h2, "positionalVariableBinding");
              d2 = new Vh(Jg(J2(h2, ["typedVariableBinding", "varName"])), Q2(k2, P2(b2)), l2 ? Jg(l2) : null, d2);
            }
            return d2;
          case "letClause":
            e2 = K2(e2, "*");
            for (f2 = e2.length - 1; 0 <= f2; --f2) h2 = e2[f2], k2 = J2(
              h2,
              ["letExpr", "*"]
            ), d2 = new Xh(Jg(J2(h2, ["typedVariableBinding", "varName"])), Q2(k2, P2(b2)), d2);
            return d2;
          case "whereClause":
            e2 = K2(e2, "*");
            for (f2 = e2.length - 1; 0 <= f2; --f2) d2 = new aj(Q2(e2[f2], b2), d2);
            return d2;
          case "windowClause":
            throw Error(`Not implemented: ${e2[0]} is not implemented yet.`);
          case "groupByClause":
            throw Error(`Not implemented: ${e2[0]} is not implemented yet.`);
          case "orderByClause":
            return Ek(e2, b2, d2);
          case "countClause":
            throw Error(`Not implemented: ${e2[0]} is not implemented yet.`);
          default:
            throw Error(`Not implemented: ${e2[0]} is not supported in a flwor expression`);
        }
      }, Q2(a2, b2));
    }
    function nk(a2, b2) {
      const c2 = F2(a2, "functionName"), d2 = K2(F2(a2, "arguments"), "*");
      a2 = I2(a2, "type");
      return new Ff(new $h(Jg(c2), d2.length, a2), d2.map((e2) => "argumentPlaceholder" === e2[0] ? null : Q2(e2, b2)), a2);
    }
    function pk(a2, b2) {
      const c2 = I2(a2, "type");
      var d2 = J2(a2, ["argExpr", "*"]);
      a2 = K2(a2, "*").slice(1);
      d2 = [Q2(d2, b2)];
      for (let f2 = 0; f2 < a2.length; f2++) if ("arguments" !== a2[f2][0]) {
        if ("arguments" === a2[f2 + 1][0]) {
          var e2 = K2(a2[f2 + 1], "*");
          d2 = d2.concat(e2.map((h2) => "argumentPlaceholder" === h2[0] ? null : Q2(h2, b2)));
        }
        e2 = "EQName" === a2[f2][0] ? new $h(Jg(a2[f2]), d2.length, c2) : Q2(a2[f2], P2(b2));
        d2 = [new Ff(e2, d2, c2)];
      }
      return d2[0];
    }
    function qk(a2, b2) {
      const c2 = J2(a2, ["functionItem", "*"]), d2 = I2(a2, "type");
      a2 = F2(a2, "arguments");
      let e2 = [];
      a2 && (e2 = K2(a2, "*").map((f2) => "argumentPlaceholder" === f2[0] ? null : Q2(f2, b2)));
      return new Ff(Q2(c2, b2), e2, d2);
    }
    function ok(a2, b2) {
      const c2 = K2(F2(a2, "paramList"), "*"), d2 = J2(a2, ["functionBody", "*"]), e2 = I2(a2, "type");
      return new Wh(c2.map((f2) => ({ name: Jg(F2(f2, "varName")), type: Kg(f2) })), Kg(a2), d2 ? Q2(d2, b2) : new yi([], e2));
    }
    function mk(a2, b2) {
      const c2 = I2(a2, "type");
      var d2 = K2(a2, "stepExpr");
      let e2 = false;
      var f2 = d2.map((h2) => {
        var k2 = F2(h2, "xpathAxis");
        let l2;
        var n2 = K2(h2, "*");
        const t2 = [];
        let u2 = null, z2 = false;
        for (const y2 of n2) switch (y2[0]) {
          case "lookup":
            t2.push(["lookup", wk(y2, b2)]);
            break;
          case "predicate":
          case "predicates":
            for (const G2 of K2(y2, "*")) {
              n2 = Q2(G2, P2(b2));
              if (!z2) {
                const N2 = n2.D();
                null === N2 ? z2 = true : u2 = xh(u2, N2);
              }
              t2.push(["predicate", n2]);
            }
        }
        if (k2) switch (e2 = true, h2 = F2(h2, "attributeTest anyElementTest piTest documentTest elementTest commentTest namespaceTest anyKindTest textTest anyFunctionTest typedFunctionTest schemaAttributeTest atomicType anyItemType parenthesizedItemType typedMapTest typedArrayTest nameTest Wildcard".split(" ")), h2 = Dk(h2), H2(k2)) {
          case "ancestor":
            l2 = new vh(h2, { Qa: false });
            break;
          case "ancestor-or-self":
            l2 = new vh(h2, { Qa: true });
            break;
          case "attribute":
            l2 = new yh(h2, u2);
            break;
          case "child":
            l2 = new zh(h2, u2);
            break;
          case "descendant":
            l2 = new Ch(h2, { Qa: false });
            break;
          case "descendant-or-self":
            l2 = new Ch(h2, { Qa: true });
            break;
          case "parent":
            l2 = new Jh(h2, u2);
            break;
          case "following-sibling":
            l2 = new Ih(h2, u2);
            break;
          case "preceding-sibling":
            l2 = new Nh(h2, u2);
            break;
          case "following":
            l2 = new Gh(h2);
            break;
          case "preceding":
            l2 = new Lh(h2);
            break;
          case "self":
            l2 = new Oh(h2, u2);
        }
        else k2 = J2(
          h2,
          ["filterExpr", "*"]
        ), l2 = Q2(k2, P2(b2));
        for (const y2 of t2) switch (y2[0]) {
          case "lookup":
            l2 = new Si(l2, y2[1]);
            break;
          case "predicate":
            l2 = new Pi(l2, y2[1]);
        }
        l2.type = c2;
        return l2;
      });
      a2 = F2(a2, "rootExpr");
      d2 = e2 || null !== a2 || 1 < d2.length;
      if (!d2 && 1 === f2.length || !a2 && 1 === f2.length && "sorted" === f2[0].ia) return f2[0];
      if (a2 && 0 === f2.length) return new Li(null);
      f2 = new Oi(f2, d2);
      return a2 ? new Li(f2) : f2;
    }
    function sk(a2, b2) {
      const c2 = I2(a2, "type"), d2 = H2(F2(a2, "quantifier")), e2 = J2(a2, ["predicateExpr", "*"]);
      a2 = K2(a2, "quantifiedExprInClause").map((f2) => {
        const h2 = Jg(J2(f2, ["typedVariableBinding", "varName"]));
        f2 = J2(f2, ["sourceExpr", "*"]);
        return { name: h2, fb: Q2(f2, P2(b2)) };
      });
      return new Ui(d2, a2, Q2(e2, P2(b2)), c2);
    }
    function ik(a2, b2) {
      var c2 = K2(a2, "*").map((d2) => Q2(d2, b2));
      if (1 === c2.length) return c2[0];
      c2 = I2(a2, "type");
      return new yi(K2(a2, "*").map((d2) => Q2(d2, b2)), c2);
    }
    function tk(a2, b2) {
      const c2 = I2(a2, "type");
      return K2(a2, "*").reduce((d2, e2) => null === d2 ? Q2(e2, P2(b2)) : new zi(d2, Q2(e2, P2(b2)), c2), null);
    }
    function jk(a2, b2) {
      const c2 = I2(a2, "type");
      a2 = [J2(a2, ["firstOperand", "*"]), J2(a2, ["secondOperand", "*"])];
      return new Ff(new $h({ localName: "concat", namespaceURI: "http://www.w3.org/2005/xpath-functions", prefix: "" }, a2.length, c2), a2.map((d2) => Q2(d2, P2(b2))), c2);
    }
    function kk(a2, b2) {
      const c2 = I2(a2, "type");
      a2 = [F2(F2(a2, "startExpr"), "*"), F2(F2(a2, "endExpr"), "*")];
      const d2 = new $h({ localName: "to", namespaceURI: "http://fontoxpath/operators", prefix: "" }, a2.length, c2);
      return new Ff(d2, a2.map((e2) => Q2(e2, P2(b2))), c2);
    }
    function zk(a2, b2) {
      if (!b2.Z) throw Error("XPST0003: Use of XQuery functionality is not allowed in XPath context");
      const c2 = Jg(F2(a2, "tagName"));
      var d2 = F2(a2, "attributeList");
      const e2 = d2 ? K2(d2, "attributeConstructor").map((f2) => Q2(f2, P2(b2))) : [];
      d2 = d2 ? K2(d2, "namespaceDeclaration").map((f2) => {
        const h2 = F2(f2, "prefix");
        return { prefix: h2 ? H2(h2) : "", uri: H2(F2(f2, "uri")) };
      }) : [];
      a2 = (a2 = F2(a2, "elementContent")) ? K2(a2, "*").map((f2) => Q2(f2, P2(b2))) : [];
      return new Xj(c2, e2, d2, a2);
    }
    function Ak(a2, b2) {
      if (!b2.Z) throw Error("XPST0003: Use of XQuery functionality is not allowed in XPath context");
      const c2 = Jg(F2(a2, "attributeName"));
      var d2 = F2(a2, "attributeValue");
      d2 = d2 ? H2(d2) : null;
      a2 = (a2 = F2(a2, "attributeValueExpr")) ? K2(a2, "*").map((e2) => Q2(e2, P2(b2))) : null;
      return new Vj(c2, { value: d2, nb: a2 });
    }
    function Bk(a2, b2) {
      var c2 = F2(a2, "tagName");
      c2 ? c2 = Jg(c2) : (c2 = F2(a2, "tagNameExpr"), c2 = { Na: Q2(F2(c2, "*"), P2(b2)) });
      a2 = (a2 = F2(a2, "contentExpr")) ? K2(a2, "*").map((d2) => Q2(d2, P2(b2))) : [];
      return new Xj(c2, [], [], a2);
    }
    function Ck(a2, b2) {
      const c2 = K2(F2(a2, "transformCopies"), "transformCopy").map((e2) => {
        const f2 = Jg(F2(F2(e2, "varRef"), "name"));
        return { fb: Q2(F2(F2(e2, "copySource"), "*"), b2), Jb: new Sa(f2.prefix, f2.namespaceURI, f2.localName) };
      }), d2 = Q2(F2(F2(a2, "modifyExpr"), "*"), b2);
      a2 = Q2(F2(F2(a2, "returnExpr"), "*"), b2);
      return new Tj(c2, d2, a2);
    }
    function xk(a2, b2) {
      if (!b2.Z) throw Error("XPST0003: Use of XQuery functionality is not allowed in XPath context");
      const c2 = I2(a2, "type"), d2 = Q2(F2(F2(a2, "argExpr"), "*"), b2), e2 = K2(a2, "typeswitchExprCaseClause").map((f2) => {
        const h2 = 0 === K2(f2, "sequenceTypeUnion").length ? [F2(f2, "sequenceType")] : K2(F2(f2, "sequenceTypeUnion"), "sequenceType");
        return { pb: Q2(J2(f2, ["resultExpr", "*"]), b2), Ib: h2.map((k2) => {
          const l2 = F2(k2, "occurrenceIndicator");
          return { ec: l2 ? H2(l2) : "", Hb: Q2(F2(k2, "*"), b2) };
        }) };
      });
      a2 = Q2(J2(a2, ["typeswitchExprDefaultClause", "resultExpr", "*"]), b2);
      return new ck(d2, e2, a2, c2);
    }
    function yk(a2, b2) {
      if (!b2.Z) throw Error("XPST0003: Use of XQuery functionality is not allowed in XPath context");
      const c2 = I2(a2, "type"), d2 = Q2(F2(F2(a2, "argExpr"), "*"), b2), e2 = K2(a2, "switchExprCaseClause").map((f2) => {
        const h2 = K2(f2, "switchCaseExpr");
        return { pb: Q2(J2(f2, ["resultExpr", "*"]), b2), Gb: h2.map((k2) => Q2(F2(k2, "*"), b2)) };
      });
      a2 = Q2(J2(a2, ["switchExprDefaultClause", "resultExpr", "*"]), b2);
      return new dk(d2, e2, a2, c2);
    }
    function Fk(a2, b2) {
      return Q2(a2, b2);
    }
    const Gk = /* @__PURE__ */ new Map();
    class Hk {
      constructor(a2, b2, c2, d2, e2, f2) {
        this.v = a2;
        this.D = b2;
        this.h = c2;
        this.kb = d2;
        this.o = e2;
        this.l = f2;
      }
    }
    function Ik(a2, b2, c2, d2, e2, f2, h2, k2) {
      a2 = Gk.get(a2);
      if (!a2) return null;
      b2 = a2[b2 + (f2 ? "_DEBUG" : "")];
      return b2 ? (b2 = b2.find((l2) => l2.o === h2 && l2.v.every((n2) => c2(n2.prefix) === n2.namespaceURI) && l2.D.every((n2) => void 0 !== d2[n2.name]) && l2.kb.every((n2) => e2[n2.prefix] === n2.namespaceURI) && l2.l.every((n2) => {
        const t2 = k2(n2.dc, n2.arity);
        return t2 && t2.namespaceURI === n2.Db.namespaceURI && t2.localName === n2.Db.localName;
      }))) ? { ba: b2.h, hc: false } : null : null;
    }
    function Jk(a2, b2, c2, d2, e2, f2, h2) {
      let k2 = Gk.get(a2);
      k2 || (k2 = /* @__PURE__ */ Object.create(null), Gk.set(a2, k2));
      a2 = b2 + (f2 ? "_DEBUG" : "");
      (b2 = k2[a2]) || (b2 = k2[a2] = []);
      b2.push(new Hk(Object.values(c2.h), Object.values(c2.o), e2, Object.keys(d2).map((l2) => ({ namespaceURI: d2[l2], prefix: l2 })), h2, c2.D));
    }
    function Kk(a2) {
      var b2 = new Za();
      if ("http://www.w3.org/2005/XQueryX" !== a2.namespaceURI && "http://www.w3.org/2005/XQueryX" !== a2.namespaceURI && "http://fontoxml.com/fontoxpath" !== a2.namespaceURI && "http://www.w3.org/2007/xquery-update-10" !== a2.namespaceURI) throw mc("The XML structure passed as an XQueryX program was not valid XQueryX");
      const c2 = ["stackTrace" === a2.localName ? "x:stackTrace" : a2.localName], d2 = b2.getAllAttributes(a2);
      d2 && 0 < d2.length && c2.push(Array.from(d2).reduce((e2, f2) => {
        "comment" !== f2.localName && "start" !== f2.localName && "end" !== f2.localName || "stackTrace" !== a2.localName ? "type" === f2.localName ? e2[f2.localName] = Ja(f2.value) : e2[f2.localName] = f2.value : e2[f2.localName] = JSON.parse(f2.value);
        return e2;
      }, {}));
      b2 = b2.getChildNodes(a2);
      for (const e2 of b2) switch (e2.nodeType) {
        case 1:
          c2.push(Kk(e2));
          break;
        case 3:
          c2.push(e2.data);
      }
      return c2;
    }
    const Lk = /* @__PURE__ */ Object.create(null);
    var Mk = (a2, b2) => {
      let c2 = Lk[a2];
      c2 || (c2 = Lk[a2] = { Ia: [], Ta: [], pa: null, source: b2.source });
      const d2 = c2.pa || (() => {
      });
      c2.Ia = c2.Ia.concat(b2.Ia);
      c2.Ta = c2.Ta.concat(b2.Ta);
      c2.pa = (e2) => {
        d2(e2);
        b2.pa && b2.pa(e2);
      };
    }, Nk = (a2, b2) => {
      const c2 = Lk[b2];
      if (!c2) throw Error(`XQST0051: No modules found with the namespace uri ${b2}`);
      c2.Ia.forEach((d2) => {
        d2.cb && Eg(a2, b2, d2.localName, d2.arity, d2);
      });
      c2.Ta.forEach((d2) => {
        Gg(a2, b2, d2.localName);
        Hg(a2, b2, d2.localName, (e2, f2) => C2(d2.ba, e2, f2));
      });
    }, Ok = () => {
      Object.keys(Lk).forEach((a2) => {
        a2 = Lk[a2];
        if (a2.pa) try {
          a2.pa(a2);
        } catch (b2) {
          a2.pa = null, gg(
            a2.source,
            b2
          );
        }
        a2.pa = null;
      });
    };
    function Pk(a2) {
      return a2.replace(/(\x0D\x0A)|(\x0D(?!\x0A))/g, String.fromCharCode(10));
    }
    var R2 = prsc2;
    function Qk(a2, b2) {
      return (c2, d2) => {
        if (b2.has(d2)) return b2.get(d2);
        c2 = a2(c2, d2);
        b2.set(d2, c2);
        return c2;
      };
    }
    function S2(a2, b2) {
      return (0, R2.delimited)(b2, a2, b2);
    }
    function T2(a2, b2) {
      return a2.reverse().reduce((c2, d2) => (0, R2.preceded)(d2, c2), b2);
    }
    function Rk(a2, b2, c2, d2) {
      return (0, R2.then)((0, R2.then)(a2, b2, (e2, f2) => [e2, f2]), c2, ([e2, f2], h2) => d2(e2, f2, h2));
    }
    function Sk(a2, b2, c2, d2, e2) {
      return (0, R2.then)((0, R2.then)((0, R2.then)(a2, b2, (f2, h2) => [f2, h2]), c2, ([f2, h2], k2) => [f2, h2, k2]), d2, ([f2, h2, k2], l2) => e2(f2, h2, k2, l2));
    }
    function Tk(a2, b2, c2, d2, e2, f2) {
      return (0, R2.then)((0, R2.then)((0, R2.then)((0, R2.then)(a2, b2, (h2, k2) => [h2, k2]), c2, ([h2, k2], l2) => [h2, k2, l2]), d2, ([h2, k2, l2], n2) => [h2, k2, l2, n2]), e2, ([h2, k2, l2, n2], t2) => f2(h2, k2, l2, n2, t2));
    }
    function Uk(a2) {
      return (0, R2.map)(a2, (b2) => [b2]);
    }
    function Vk(a2, b2) {
      return (0, R2.map)((0, R2.or)(a2), () => b2);
    }
    function Wk(a2) {
      return (b2, c2) => (b2 = a2.exec(b2.substring(c2))) && 0 === b2.index ? (0, R2.okWithValue)(c2 + b2[0].length, b2[0]) : (0, R2.error)(c2, [a2.source], false);
    }
    var Xk = (0, R2.or)([(0, R2.token)(" "), (0, R2.token)("	"), (0, R2.token)("\r"), (0, R2.token)("\n")]), Yk = (0, R2.token)("(:"), Zk = (0, R2.token)(":)"), $k = (0, R2.token)("(#"), al = (0, R2.token)("#)"), bl = (0, R2.token)("("), cl = (0, R2.token)(")"), dl = (0, R2.token)("["), el = (0, R2.token)("]"), fl = (0, R2.token)("{"), gl = (0, R2.token)("}"), hl = (0, R2.token)("{{"), il = (0, R2.token)("}}"), jl = (0, R2.token)("'"), kl = (0, R2.token)("''"), ll = (0, R2.token)('"'), ml = (0, R2.token)('""'), nl = (0, R2.token)("<![CDATA["), ol = (0, R2.token)("]]>"), pl = (0, R2.token)("/>"), ql = (0, R2.token)("</"), rl = (0, R2.token)("<!--"), sl = (0, R2.token)("-->"), tl = (0, R2.token)("<?"), ul = (0, R2.token)("?>"), vl = (0, R2.token)("&#x"), wl = (0, R2.token)("&#"), xl = (0, R2.token)(":*"), yl = (0, R2.token)("*:"), zl = (0, R2.token)(":="), Al = (0, R2.token)("&"), Bl = (0, R2.token)(":"), Cl = (0, R2.token)(";"), Dl = (0, R2.token)("*"), El = (0, R2.token)("@"), Fl = (0, R2.token)("$"), Gl = (0, R2.token)("#"), Hl = (0, R2.token)("%"), Il = (0, R2.token)("?"), Jl = (0, R2.token)("="), Kl = (0, R2.followed)((0, R2.token)("!"), (0, R2.not)((0, R2.peek)(Jl), [])), Ll = (0, R2.followed)((0, R2.token)("|"), (0, R2.not)(
      (0, R2.peek)((0, R2.token)("|")),
      []
    )), Ml = (0, R2.token)("||"), Nl = (0, R2.token)("!="), Ol = (0, R2.token)("<"), Pl = (0, R2.token)("<<"), Ql = (0, R2.token)("<="), Rl = (0, R2.token)(">"), Sl = (0, R2.token)(">>"), Tl = (0, R2.token)(">="), Ul = (0, R2.token)(","), Vl = (0, R2.token)("."), Wl = (0, R2.token)(".."), Xl = (0, R2.token)("+"), Yl = (0, R2.token)("-"), Zl = (0, R2.token)("/"), $l = (0, R2.token)("//"), am = (0, R2.token)("=>"), bm = (0, R2.token)("e"), cm = (0, R2.token)("E");
    (0, R2.token)("l");
    (0, R2.token)("L");
    (0, R2.token)("m");
    (0, R2.token)("M");
    var dm = (0, R2.token)("Q");
    (0, R2.token)("x");
    (0, R2.token)("X");
    var em = (0, R2.token)("as"), fm = (0, R2.token)("cast"), gm = (0, R2.token)("castable"), hm = (0, R2.token)("treat"), im = (0, R2.token)("instance"), jm = (0, R2.token)("of"), km = (0, R2.token)("node"), lm = (0, R2.token)("nodes"), mm = (0, R2.token)("delete"), nm = (0, R2.token)("value"), om = (0, R2.token)("function"), pm = (0, R2.token)("map"), qm = (0, R2.token)("element"), rm = (0, R2.token)("attribute"), sm = (0, R2.token)("schema-element"), tm = (0, R2.token)("intersect"), um = (0, R2.token)("except"), vm = (0, R2.token)("union"), wm = (0, R2.token)("to"), xm = (0, R2.token)("is"), ym = (0, R2.token)("or"), zm = (0, R2.token)("and"), Am = (0, R2.token)("div"), Bm = (0, R2.token)("idiv"), Cm = (0, R2.token)("mod"), Dm = (0, R2.token)("eq"), Em = (0, R2.token)("ne"), Fm = (0, R2.token)("lt"), Gm = (0, R2.token)("le"), Hm = (0, R2.token)("gt"), Im = (0, R2.token)("ge"), Jm = (0, R2.token)("amp"), Km = (0, R2.token)("quot"), Lm = (0, R2.token)("apos"), Mm = (0, R2.token)("if"), Nm = (0, R2.token)("then"), Om = (0, R2.token)("else"), Pm = (0, R2.token)("allowing"), Qm = (0, R2.token)("empty"), Rm = (0, R2.token)("at"), Sm = (0, R2.token)("in"), Tm = (0, R2.token)("for"), Um = (0, R2.token)("let"), Vm = (0, R2.token)("where"), Wm = (0, R2.token)("collation"), Xm = (0, R2.token)("group"), Ym = (0, R2.token)("by"), Zm = (0, R2.token)("order"), $m = (0, R2.token)("stable"), an = (0, R2.token)("return"), bn = (0, R2.token)("array"), cn = (0, R2.token)("document"), dn = (0, R2.token)("namespace"), en = (0, R2.token)("text"), fn = (0, R2.token)("comment"), gn = (0, R2.token)("processing-instruction"), hn = (0, R2.token)("lax"), jn = (0, R2.token)("strict"), kn = (0, R2.token)("validate"), ln = (0, R2.token)("type"), mn = (0, R2.token)("declare"), nn = (0, R2.token)("default"), on = (0, R2.token)("boundary-space"), pn = (0, R2.token)("strip"), qn = (0, R2.token)("preserve"), rn = (0, R2.token)("no-preserve"), sn = (0, R2.token)("inherit"), tn = (0, R2.token)("no-inherit"), un = (0, R2.token)("greatest"), vn = (0, R2.token)("least"), wn = (0, R2.token)("copy-namespaces"), xn = (0, R2.token)("decimal-format"), yn = (0, R2.token)("case"), zn = (0, R2.token)("typeswitch"), An = (0, R2.token)("some"), Bn = (0, R2.token)("every"), Cn = (0, R2.token)("satisfies"), Dn = (0, R2.token)("replace"), En = (0, R2.token)("with"), Fn = (0, R2.token)("copy"), Gn = (0, R2.token)("modify"), Hn = (0, R2.token)("first"), In = (0, R2.token)("last"), Jn = (0, R2.token)("before"), Kn = (0, R2.token)("after"), Ln = (0, R2.token)("into"), Mn = (0, R2.token)("insert"), Nn = (0, R2.token)("rename"), On = (0, R2.token)("switch"), Pn = (0, R2.token)("variable"), Qn = (0, R2.token)("external"), Rn = (0, R2.token)("updating"), Sn = (0, R2.token)("import"), Tn = (0, R2.token)("schema"), Un = (0, R2.token)("module"), Vn = (0, R2.token)("base-uri"), Wn = (0, R2.token)("construction"), Xn = (0, R2.token)("ordering"), Yn = (0, R2.token)("ordered"), Zn = (0, R2.token)("unordered"), $n = (0, R2.token)("option"), ao = (0, R2.token)("context"), bo = (0, R2.token)("item"), co = (0, R2.token)("xquery"), eo = (0, R2.token)("version"), fo = (0, R2.token)("encoding"), go = (0, R2.token)("document-node"), ho = (0, R2.token)("namespace-node"), io = (0, R2.token)("schema-attribute"), jo = (0, R2.token)("ascending"), ko = (0, R2.token)("descending"), lo = (0, R2.token)("empty-sequence"), mo = (0, R2.token)("child::"), no = (0, R2.token)("descendant::"), oo = (0, R2.token)("attribute::"), po = (0, R2.token)("self::"), qo = (0, R2.token)("descendant-or-self::"), ro = (0, R2.token)("following-sibling::"), so = (0, R2.token)("following::"), to = (0, R2.token)("parent::"), uo = (0, R2.token)("ancestor::"), vo = (0, R2.token)("preceding-sibling::"), wo = (0, R2.token)("preceding::"), xo = (0, R2.token)("ancestor-or-self::"), yo = (0, R2.token)("decimal-separator"), zo = (0, R2.token)("grouping-separator"), Ao = (0, R2.token)("infinity"), Bo = (0, R2.token)("minus-sign"), Co = (0, R2.token)("NaN"), Do = (0, R2.token)("per-mille"), Eo = (0, R2.token)("zero-digit"), Fo = (0, R2.token)("digit"), Go = (0, R2.token)("pattern-separator"), Ho = (0, R2.token)("exponent-separator"), Io = (0, R2.token)("schema-attribute("), Jo = (0, R2.token)("document-node("), Ko = (0, R2.token)("processing-instruction("), Lo = (0, R2.token)("processing-instruction()"), Mo = (0, R2.token)("comment()"), No = (0, R2.token)("text()"), Oo = (0, R2.token)("namespace-node()"), Po = (0, R2.token)("node()"), Qo = (0, R2.token)("item()"), Ro = (0, R2.token)("empty-sequence()");
    (0, R2.token)("`");
    var So = (0, R2.token)("``["), To = (0, R2.token)("]``"), Uo = (0, R2.token)("`{"), Vo = (0, R2.token)("}`");
    var Wo = /* @__PURE__ */ new Map(), Xo = /* @__PURE__ */ new Map(), Yo = (0, R2.or)([Wk(/[\t\n\r -\uD7FF\uE000\uFFFD]/), Wk(/[\uD800-\uDBFF][\uDC00-\uDFFF]/)]), Zo = (0, R2.preceded)((0, R2.peek)((0, R2.not)((0, R2.or)([Yk, Zk]), ['comment contents cannot contain "(:" or ":)"'])), Yo), $o = (0, R2.map)((0, R2.delimited)(Yk, (0, R2.star)((0, R2.or)([Zo, function(a2, b2) {
      return $o(a2, b2);
    }])), Zk, true), (a2) => a2.join("")), ap = (0, R2.or)([Xk, $o]), bp = (0, R2.map)((0, R2.plus)(Xk), (a2) => a2.join("")), V2 = Qk((0, R2.map)((0, R2.star)(ap), (a2) => a2.join("")), Wo), X2 = Qk((0, R2.map)((0, R2.plus)(ap), (a2) => a2.join("")), Xo);
    const cp = (0, R2.or)([Wk(/[A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/), (0, R2.then)(Wk(/[\uD800-\uDB7F]/), Wk(/[\uDC00-\uDFFF]/), (a2, b2) => a2 + b2)]), dp = (0, R2.or)([cp, Wk(/[\-\.0-9\xB7\u0300-\u036F\u203F\u2040]/)]);
    var ep = (0, R2.then)(cp, (0, R2.star)(dp), (a2, b2) => a2 + b2.join("")), fp = (0, R2.map)(ep, (a2) => ["prefix", a2]);
    const gp = (0, R2.or)([cp, Bl]), hp = (0, R2.or)([dp, Bl]);
    (0, R2.then)(gp, (0, R2.star)(hp), (a2, b2) => a2 + b2.join(""));
    const ip = (0, R2.map)(ep, (a2) => [{ prefix: "", URI: null }, a2]), jp = (0, R2.then)(ep, (0, R2.preceded)(Bl, ep), (a2, b2) => [{ prefix: a2, URI: null }, b2]);
    var kp = (0, R2.or)([jp, ip]), lp = (0, R2.followed)(T2([dm, V2, fl], (0, R2.map)((0, R2.star)(Wk(/[^{}]/)), (a2) => a2.join("").replace(/\s+/g, " ").trim())), gl);
    const mp = (0, R2.then)(lp, ep, (a2, b2) => [a2, b2]);
    var np = (0, R2.or)([(0, R2.map)(mp, (a2) => [{ prefix: null, URI: a2[0] }, a2[1]]), kp]), op = (0, R2.or)([(0, R2.map)(np, (a2) => ["QName", ...a2]), (0, R2.map)(Dl, () => ["star"])]), pp = (0, R2.map)((0, R2.preceded)(Fl, np), (a2) => ["varRef", ["name", ...a2]]);
    var qp = (0, R2.peek)((0, R2.or)([bl, ll, jl, ap])), rp = (0, R2.map)((0, R2.or)([mo, no, oo, po, qo, ro, so]), (a2) => a2.substring(0, a2.length - 2)), sp = (0, R2.map)((0, R2.or)([to, uo, vo, wo, xo]), (a2) => a2.substring(0, a2.length - 2)), tp = Rk(Al, (0, R2.or)([Fm, Hm, Jm, Km, Lm]), Cl, (a2, b2, c2) => a2 + b2 + c2), up = (0, R2.or)([Rk(vl, Wk(/[0-9a-fA-F]+/), Cl, (a2, b2, c2) => a2 + b2 + c2), Rk(wl, Wk(/[0-9]+/), Cl, (a2, b2, c2) => a2 + b2 + c2)]), vp = Vk([ml], '"'), wp = Vk([kl], "'"), xp = Uk(Vk([Mo], "commentTest")), yp = Uk(Vk([No], "textTest")), zp = Uk(Vk([Oo], "namespaceTest")), Ap = Uk(Vk([Po], "anyKindTest"));
    const Bp = Wk(/[0-9]+/), Cp = (0, R2.then)((0, R2.or)([(0, R2.then)(Vl, Bp, (a2, b2) => a2 + b2), (0, R2.then)(Bp, (0, R2.optional)((0, R2.preceded)(Vl, Wk(/[0-9]*/))), (a2, b2) => a2 + (null !== b2 ? "." + b2 : ""))]), Rk((0, R2.or)([bm, cm]), (0, R2.optional)((0, R2.or)([Xl, Yl])), Bp, (a2, b2, c2) => a2 + (b2 ? b2 : "") + c2), (a2, b2) => ["doubleConstantExpr", ["value", a2 + b2]]), Dp = (0, R2.or)([(0, R2.map)((0, R2.preceded)(Vl, Bp), (a2) => ["decimalConstantExpr", ["value", "." + a2]]), (0, R2.then)((0, R2.followed)(Bp, Vl), (0, R2.optional)(Bp), (a2, b2) => ["decimalConstantExpr", ["value", a2 + "." + (null !== b2 ? b2 : "")]])]);
    var Ep = (0, R2.map)(Bp, (a2) => ["integerConstantExpr", ["value", a2]]), Fp = (0, R2.followed)((0, R2.or)([Cp, Dp, Ep]), (0, R2.peek)((0, R2.not)(Wk(/[a-zA-Z]/), ["no alphabetical characters after numeric literal"]))), Gp = (0, R2.map)((0, R2.followed)(Vl, (0, R2.peek)((0, R2.not)(Vl, ["context item should not be followed by another ."]))), () => ["contextItemExpr"]), Hp = (0, R2.or)([bn, rm, fn, go, qm, lo, om, Mm, bo, pm, ho, km, gn, io, sm, On, en, zn]), Ip = Uk(Vk([Il], "argumentPlaceholder")), Jp = (0, R2.or)([Il, Dl, Xl]), Kp = (0, R2.preceded)((0, R2.peek)((0, R2.not)(
      Wk(/[{}<&]/),
      ["elementContentChar cannot be {, }, <, or &"]
    )), Yo), Lp = (0, R2.map)((0, R2.delimited)(nl, (0, R2.star)((0, R2.preceded)((0, R2.peek)((0, R2.not)(ol, ['CDataSection content may not contain "]]>"'])), Yo)), ol, true), (a2) => ["CDataSection", a2.join("")]), Mp = (0, R2.preceded)((0, R2.peek)((0, R2.not)(Wk(/["{}<&]/), ['quotAttrValueContentChar cannot be ", {, }, <, or &'])), Yo), Np = (0, R2.preceded)((0, R2.peek)((0, R2.not)(Wk(/['{}<&]/), ["aposAttrValueContentChar cannot be ', {, }, <, or &"])), Yo), Op = (0, R2.map)((0, R2.star)((0, R2.or)([(0, R2.preceded)((0, R2.peek)((0, R2.not)(
      Yl,
      []
    )), Yo), (0, R2.map)(T2([Yl, (0, R2.peek)((0, R2.not)(Yl, []))], Yo), (a2) => "-" + a2)])), (a2) => a2.join("")), Pp = (0, R2.map)((0, R2.delimited)(rl, Op, sl, true), (a2) => ["computedCommentConstructor", ["argExpr", ["stringConstantExpr", ["value", a2]]]]);
    const Qp = (0, R2.filter)(ep, (a2) => "xml" !== a2.toLowerCase(), ['A processing instruction target cannot be "xml"']), Rp = (0, R2.map)((0, R2.star)((0, R2.preceded)((0, R2.peek)((0, R2.not)(ul, [])), Yo)), (a2) => a2.join(""));
    var Sp = (0, R2.then)((0, R2.preceded)(tl, (0, R2.cut)(Qp)), (0, R2.cut)((0, R2.followed)((0, R2.optional)((0, R2.preceded)(bp, Rp)), ul)), (a2, b2) => ["computedPIConstructor", ["piTarget", a2], ["piValueExpr", ["stringConstantExpr", ["value", b2]]]]), Tp = (0, R2.map)($l, () => ["stepExpr", ["xpathAxis", "descendant-or-self"], ["anyKindTest"]]), Up = (0, R2.or)([hn, jn]), Vp = (0, R2.map)((0, R2.star)((0, R2.followed)(Yo, (0, R2.peek)((0, R2.not)(al, ["Pragma contents should not contain '#)'"])))), (a2) => a2.join("")), Wp = (0, R2.map)((0, R2.followed)((0, R2.or)([
      Dm,
      Em,
      Fm,
      Gm,
      Hm,
      Im
    ]), qp), (a2) => a2 + "Op"), Xp = (0, R2.or)([(0, R2.followed)(Vk([xm], "isOp"), qp), Vk([Pl], "nodeBeforeOp"), Vk([Sl], "nodeAfterOp")]), Yp = (0, R2.or)([Vk([Jl], "equalOp"), Vk([Nl], "notEqualOp"), Vk([Ql], "lessThanOrEqualOp"), Vk([Ol], "lessThanOp"), Vk([Tl], "greaterThanOrEqualOp"), Vk([Rl], "greaterThanOp")]), Zp = (0, R2.map)(Rn, () => ["annotation", ["annotationName", "updating"]]);
    const $p = (0, R2.or)([qn, rn]), aq = (0, R2.or)([sn, tn]);
    var bq = (0, R2.or)([yo, zo, Ao, Bo, Co, Hl, Do, Eo, Fo, Go, Ho]), cq = (0, R2.map)(T2([mn, X2, on, X2], (0, R2.or)([qn, pn])), (a2) => ["boundarySpaceDecl", a2]), dq = (0, R2.map)(T2([mn, X2, Wn, X2], (0, R2.or)([qn, pn])), (a2) => ["constructionDecl", a2]), eq = (0, R2.map)(T2([mn, X2, Xn, X2], (0, R2.or)([Yn, Zn])), (a2) => ["orderingModeDecl", a2]), fq = (0, R2.map)(T2([mn, X2, nn, X2, Zm, X2, Qm, X2], (0, R2.or)([un, vn])), (a2) => ["emptyOrderDecl", a2]), gq = (0, R2.then)(T2([mn, X2, wn, X2], $p), T2([V2, Ul, V2], aq), (a2, b2) => ["copyNamespacesDecl", ["preserveMode", a2], ["inheritMode", b2]]);
    function hq(a2) {
      switch (a2[0]) {
        case "constantExpr":
        case "varRef":
        case "contextItemExpr":
        case "functionCallExpr":
        case "sequenceExpr":
        case "elementConstructor":
        case "computedElementConstructor":
        case "computedAttributeConstructor":
        case "computedDocumentConstructor":
        case "computedTextConstructor":
        case "computedCommentConstructor":
        case "computedNamespaceConstructor":
        case "computedPIConstructor":
        case "orderedExpr":
        case "unorderedExpr":
        case "namedFunctionRef":
        case "inlineFunctionExpr":
        case "dynamicFunctionInvocationExpr":
        case "mapConstructor":
        case "arrayConstructor":
        case "stringConstructor":
        case "unaryLookup":
          return a2;
      }
      return [
        "sequenceExpr",
        a2
      ];
    }
    function iq(a2) {
      if (!(1 <= a2 && 55295 >= a2 || 57344 <= a2 && 65533 >= a2 || 65536 <= a2 && 1114111 >= a2)) throw Error("XQST0090: The character reference " + a2 + " (" + a2.toString(16) + ") does not reference a valid codePoint.");
    }
    function jq(a2) {
      return a2.replace(/(&[^;]+);/g, (b2) => {
        if (/^&#x/.test(b2)) return b2 = parseInt(b2.slice(3, -1), 16), iq(b2), String.fromCodePoint(b2);
        if (/^&#/.test(b2)) return b2 = parseInt(b2.slice(2, -1), 10), iq(b2), String.fromCodePoint(b2);
        switch (b2) {
          case "&lt;":
            return "<";
          case "&gt;":
            return ">";
          case "&amp;":
            return "&";
          case "&quot;":
            return String.fromCharCode(34);
          case "&apos;":
            return String.fromCharCode(39);
        }
        throw Error('XPST0003: Unknown character reference: "' + b2 + '"');
      });
    }
    function kq(a2, b2, c2) {
      if (!a2.length) return [];
      let d2 = [a2[0]];
      for (let e2 = 1; e2 < a2.length; ++e2) {
        const f2 = d2[d2.length - 1];
        "string" === typeof f2 && "string" === typeof a2[e2] ? d2[d2.length - 1] = f2 + a2[e2] : d2.push(a2[e2]);
      }
      if ("string" === typeof d2[0] && 0 === d2.length) return [];
      d2 = d2.reduce((e2, f2, h2) => {
        if ("string" !== typeof f2) e2.push(f2);
        else if (c2 && /^\s*$/.test(f2)) {
          const k2 = d2[h2 + 1];
          k2 && "CDataSection" === k2[0] ? e2.push(jq(f2)) : (h2 = d2[h2 - 1]) && "CDataSection" === h2[0] && e2.push(jq(f2));
        } else e2.push(jq(f2));
        return e2;
      }, []);
      if (!d2.length) return d2;
      if (1 < d2.length || b2) for (a2 = 0; a2 < d2.length; a2++) "string" === typeof d2[a2] && (d2[a2] = ["stringConstantExpr", ["value", d2[a2]]]);
      return d2;
    }
    function lq(a2) {
      return a2[0].prefix ? a2[0].prefix + ":" + a2[1] : a2[1];
    }
    var mq = (0, R2.then)(np, (0, R2.optional)(Il), (a2, b2) => null !== b2 ? ["singleType", ["atomicType", ...a2], ["optional"]] : ["singleType", ["atomicType", ...a2]]), nq = (0, R2.map)(np, (a2) => ["atomicType", ...a2]);
    const oq = /* @__PURE__ */ new Map();
    function pq(a2) {
      function b2(m2, r2) {
        return r2.reduce((B2, W2) => [W2[0], ["firstOperand", B2], ["secondOperand", W2[1]]], m2);
      }
      function c2(m2, r2, B2) {
        return (0, R2.then)(m2, (0, R2.star)((0, R2.then)(S2(r2, V2), (0, R2.cut)(m2), (W2, ea) => [W2, ea])), B2);
      }
      function d2(m2, r2, B2 = "firstOperand", W2 = "secondOperand") {
        return (0, R2.then)(m2, (0, R2.optional)((0, R2.then)(S2(r2, V2), (0, R2.cut)(m2), (ea, Fa) => [ea, Fa])), (ea, Fa) => null === Fa ? ea : [Fa[0], [B2, ea], [W2, Fa[1]]]);
      }
      function e2(m2) {
        return a2.mb ? (r2, B2) => {
          r2 = m2(r2, B2);
          if (!r2.success) return r2;
          const W2 = n2.has(B2) ? n2.get(B2) : { offset: B2, line: -1, ha: -1 }, ea = n2.has(r2.offset) ? n2.get(r2.offset) : { offset: r2.offset, line: -1, ha: -1 };
          n2.set(B2, W2);
          n2.set(r2.offset, ea);
          B2 = r2.value.Wa;
          return (0, R2.okWithValue)(r2.offset, ["x:stackTrace", Object.assign({ start: W2, end: ea }, B2 ? { Wa: B2 } : {}), r2.value]);
        } : m2;
      }
      function f2(m2, r2) {
        return Dj(m2, r2);
      }
      function h2(m2, r2) {
        return xf(m2, r2);
      }
      function k2(m2, r2) {
        return e2((0, R2.or)([Dr, Er, Fr, Gr, Hr, Ir, Jr, Kr, Lr, Mr, Nr]))(m2, r2);
      }
      function l2(m2, r2) {
        return c2(k2, Ul, (B2, W2) => 0 === W2.length ? B2 : ["sequenceExpr", B2, ...W2.map((ea) => ea[1])])(m2, r2);
      }
      const n2 = /* @__PURE__ */ new Map(), t2 = (0, R2.preceded)(dl, (0, R2.followed)(S2(
        l2,
        V2
      ), el)), u2 = (0, R2.map)(a2.Za ? (0, R2.or)([S2((0, R2.star)((0, R2.or)([tp, up, vp, Wk(/[^"&]/)])), ll), S2((0, R2.star)((0, R2.or)([tp, up, wp, Wk(/[^'&]/)])), jl)]) : (0, R2.or)([S2((0, R2.star)((0, R2.or)([vp, Wk(/[^"]/)])), ll), S2((0, R2.star)((0, R2.or)([wp, Wk(/[^']/)])), jl)]), (m2) => m2.join("")), z2 = (0, R2.or)([(0, R2.map)(T2([qm, V2], (0, R2.delimited)((0, R2.followed)(bl, V2), (0, R2.then)(op, T2([V2, Ul, V2], np), (m2, r2) => [["elementName", m2], ["typeName", ...r2]]), (0, R2.preceded)(V2, cl))), ([m2, r2]) => ["elementTest", m2, r2]), (0, R2.map)(T2([qm, V2], (0, R2.delimited)(bl, op, cl)), (m2) => [
        "elementTest",
        ["elementName", m2]
      ]), (0, R2.map)(T2([qm, V2], (0, R2.delimited)(bl, V2, cl)), () => ["elementTest"])]), y2 = (0, R2.or)([(0, R2.map)(np, (m2) => ["QName", ...m2]), (0, R2.map)(Dl, () => ["star"])]), G2 = (0, R2.or)([(0, R2.map)(T2([rm, V2], (0, R2.delimited)((0, R2.followed)(bl, V2), (0, R2.then)(y2, T2([V2, Ul, V2], np), (m2, r2) => [["attributeName", m2], ["typeName", ...r2]]), (0, R2.preceded)(V2, cl))), ([m2, r2]) => ["attributeTest", m2, r2]), (0, R2.map)(T2([rm, V2], (0, R2.delimited)(bl, y2, cl)), (m2) => ["attributeTest", ["attributeName", m2]]), (0, R2.map)(T2([rm, V2], (0, R2.delimited)(bl, V2, cl)), () => ["attributeTest"])]), N2 = (0, R2.map)(T2([sm, V2, bl], (0, R2.followed)(np, cl)), (m2) => ["schemaElementTest", ...m2]), U2 = (0, R2.map)((0, R2.delimited)(Io, S2(np, V2), cl), (m2) => ["schemaAttributeTest", ...m2]), ca = (0, R2.map)((0, R2.preceded)(Jo, (0, R2.followed)(S2((0, R2.optional)((0, R2.or)([z2, N2])), V2), cl)), (m2) => ["documentTest", ...m2 ? [m2] : []]), Ga = (0, R2.or)([(0, R2.map)((0, R2.preceded)(Ko, (0, R2.followed)(S2((0, R2.or)([ep, u2]), V2), cl)), (m2) => ["piTest", ["piTarget", m2]]), Uk(Vk([Lo], "piTest"))]), Gb = (0, R2.or)([ca, z2, G2, N2, U2, Ga, xp, yp, zp, Ap]), Xb = (0, R2.or)([(0, R2.map)((0, R2.preceded)(yl, ep), (m2) => ["Wildcard", ["star"], ["NCName", m2]]), Uk(Vk([Dl], "Wildcard")), (0, R2.map)((0, R2.followed)(lp, Dl), (m2) => ["Wildcard", ["uri", m2], ["star"]]), (0, R2.map)((0, R2.followed)(ep, xl), (m2) => ["Wildcard", ["NCName", m2], ["star"]])]), fd = (0, R2.or)([Xb, (0, R2.map)(np, (m2) => ["nameTest", ...m2])]), Yb = (0, R2.or)([Gb, fd]), Or = (0, R2.then)((0, R2.optional)(El), Yb, (m2, r2) => null !== m2 || "attributeTest" === r2[0] || "schemaAttributeTest" === r2[0] ? ["stepExpr", ["xpathAxis", "attribute"], r2] : ["stepExpr", ["xpathAxis", "child"], r2]), Pr = (0, R2.or)([(0, R2.then)(rp, Yb, (m2, r2) => [
        "stepExpr",
        ["xpathAxis", m2],
        r2
      ]), Or]), Qr = (0, R2.map)(Wl, () => ["stepExpr", ["xpathAxis", "parent"], ["anyKindTest"]]), Rr = (0, R2.or)([(0, R2.then)(sp, Yb, (m2, r2) => ["stepExpr", ["xpathAxis", m2], r2]), Qr]), Sr = (0, R2.map)((0, R2.star)((0, R2.preceded)(V2, t2)), (m2) => 0 < m2.length ? ["predicates", ...m2] : void 0), Tr = (0, R2.then)((0, R2.or)([Rr, Pr]), Sr, (m2, r2) => void 0 === r2 ? m2 : m2.concat([r2])), yf = (0, R2.or)([Fp, (0, R2.map)(u2, (m2) => ["stringConstantExpr", ["value", a2.Za ? jq(m2) : m2]])]), zf = (0, R2.or)([(0, R2.delimited)(bl, S2(l2, V2), cl), (0, R2.map)((0, R2.delimited)(bl, V2, cl), () => ["sequenceExpr"])]), Ej = (0, R2.or)([k2, Ip]), de = (0, R2.map)((0, R2.delimited)(bl, S2((0, R2.optional)((0, R2.then)(Ej, (0, R2.star)((0, R2.preceded)(S2(Ul, V2), Ej)), (m2, r2) => [m2, ...r2])), V2), cl), (m2) => null !== m2 ? m2 : []), Ur = (0, R2.preceded)((0, R2.not)(Rk(Hp, V2, bl, () => {
      }), ["cannot use reserved keyword for function names"]), e2((0, R2.then)(np, (0, R2.preceded)(V2, de), (m2, r2) => {
        r2 = ["functionCallExpr", ["functionName", ...m2], null !== r2 ? ["arguments", ...r2] : ["arguments"]];
        const B2 = m2[0].prefix, W2 = m2[0].URI;
        m2 = m2[1];
        r2.Wa = B2 ? `${B2}:${m2}` : W2 ? `Q{${W2}}${m2}` : m2;
        return r2;
      }))), Vr = (0, R2.then)(
        np,
        (0, R2.preceded)(Gl, Ep),
        (m2, r2) => ["namedFunctionRef", ["functionName", ...m2], r2]
      ), Ua = (0, R2.delimited)(fl, S2((0, R2.optional)(l2), V2), gl), Fj = (0, R2.map)(Ua, (m2) => m2 ? m2 : ["sequenceExpr"]), jb = (0, R2.or)([(0, R2.map)(Ro, () => [["voidSequenceType"]]), (0, R2.then)(f2, (0, R2.optional)((0, R2.preceded)(V2, Jp)), (m2, r2) => [m2, ...null !== r2 ? [["occurrenceIndicator", r2]] : []])]), Af = (0, R2.then)(T2([Hl, V2], np), (0, R2.optional)((0, R2.followed)((0, R2.then)(T2([bl, V2], yf), (0, R2.star)(T2([Ul, V2], yf)), (m2, r2) => m2.concat(r2)), cl)), (m2, r2) => [
        "annotation",
        ["annotationName", ...m2],
        ...r2 ? ["arguments", r2] : []
      ]), Wr = (0, R2.map)(T2([om, V2, bl, V2, Dl, V2], cl), () => ["anyFunctionTest"]), Xr = (0, R2.then)(T2([om, V2, bl, V2], (0, R2.optional)(c2(jb, Ul, (m2, r2) => m2.concat.apply(m2, r2.map((B2) => B2[1]))))), T2([V2, cl, X2, em, X2], jb), (m2, r2) => ["typedFunctionTest", ["paramTypeList", ["sequenceType", ...m2 ? m2 : []]], ["sequenceType", ...r2]]), Yr = (0, R2.then)((0, R2.star)(Af), (0, R2.or)([Wr, Xr]), (m2, r2) => [r2[0], ...m2, ...r2.slice(1)]), Zr = (0, R2.map)(T2([pm, V2, bl, V2, Dl, V2], cl), () => ["anyMapTest"]), $r = (0, R2.then)(T2([pm, V2, bl, V2], nq), T2([V2, Ul], (0, R2.followed)(
        S2(jb, V2),
        cl
      )), (m2, r2) => ["typedMapTest", m2, ["sequenceType", ...r2]]), as = (0, R2.or)([Zr, $r]), bs = (0, R2.map)(T2([bn, V2, bl, V2, Dl, V2], cl), () => ["anyArrayTest"]), cs = (0, R2.map)(T2([bn, V2, bl], (0, R2.followed)(S2(jb, V2), cl)), (m2) => ["typedArrayTest", ["sequenceType", ...m2]]), ds = (0, R2.or)([bs, cs]), es = (0, R2.map)((0, R2.delimited)(bl, S2(f2, V2), cl), (m2) => ["parenthesizedItemType", m2]), Dj = (0, R2.or)([Gb, Uk(Vk([Qo], "anyItemType")), Yr, as, ds, nq, es]), Ac = (0, R2.map)(T2([em, X2], jb), (m2) => ["typeDeclaration", ...m2]), fs = (0, R2.then)((0, R2.preceded)(Fl, np), (0, R2.optional)((0, R2.preceded)(
        X2,
        Ac
      )), (m2, r2) => ["param", ["varName", ...m2], ...r2 ? [r2] : []]), Gj = c2(fs, Ul, (m2, r2) => [m2, ...r2.map((B2) => B2[1])]), gs = Sk((0, R2.star)(Af), T2([V2, om, V2, bl, V2], (0, R2.optional)(Gj)), T2([V2, cl, V2], (0, R2.optional)((0, R2.map)(T2([em, V2], (0, R2.followed)(jb, V2)), (m2) => ["typeDeclaration", ...m2]))), Fj, (m2, r2, B2, W2) => ["inlineFunctionExpr", ...m2, ["paramList", ...r2 ? r2 : []], ...B2 ? [B2] : [], ["functionBody", W2]]), hs = (0, R2.or)([Vr, gs]), is = (0, R2.map)(k2, (m2) => ["mapKeyExpr", m2]), js = (0, R2.map)(k2, (m2) => ["mapValueExpr", m2]), ks = (0, R2.then)(is, (0, R2.preceded)(S2(Bl, V2), js), (m2, r2) => [
        "mapConstructorEntry",
        m2,
        r2
      ]), ls = (0, R2.preceded)(pm, (0, R2.delimited)(S2(fl, V2), (0, R2.map)((0, R2.optional)(c2(ks, S2(Ul, V2), (m2, r2) => [m2, ...r2.map((B2) => B2[1])])), (m2) => m2 ? ["mapConstructor", ...m2] : ["mapConstructor"]), (0, R2.preceded)(V2, gl))), ms = (0, R2.map)((0, R2.delimited)(dl, S2((0, R2.optional)(c2(k2, Ul, (m2, r2) => [m2, ...r2.map((B2) => B2[1])].map((B2) => ["arrayElem", B2]))), V2), el), (m2) => ["squareArray", ...null !== m2 ? m2 : []]), ns = (0, R2.map)((0, R2.preceded)(bn, (0, R2.preceded)(V2, Ua)), (m2) => ["curlyArray", ...null !== m2 ? [["arrayElem", m2]] : []]), os = (0, R2.map)((0, R2.or)([ms, ns]), (m2) => [
        "arrayConstructor",
        m2
      ]), Hj = (0, R2.map)((0, R2.star)((0, R2.preceded)((0, R2.peek)((0, R2.not)((0, R2.or)([Uo, Vo, To]), ["String constructors can not contain interpolation characters"])), Yo)), (m2) => ["stringConstructorChars", m2.join("")]), ps = (0, R2.map)((0, R2.delimited)(Uo, l2, Vo, true), (m2) => ["stringConstructorInterpolation", m2]), qs = (0, R2.then)(Hj, (0, R2.star)((0, R2.then)(ps, Hj, (m2, r2) => [m2, r2])), (m2, r2) => {
        m2 = [m2];
        for (const [B2, W2] of r2) m2.push(B2, W2);
        return m2;
      }), rs = (0, R2.map)((0, R2.delimited)(So, qs, To, true), (m2) => ["stringConstructor", ...m2]), Ij = (0, R2.or)([ep, Ep, zf, Dl]), ss = (0, R2.map)((0, R2.preceded)(Il, (0, R2.preceded)(V2, Ij)), (m2) => "*" === m2 ? ["unaryLookup", ["star"]] : "string" === typeof m2 ? ["unaryLookup", ["NCName", m2]] : ["unaryLookup", m2]), Bf = (0, R2.or)([tp, up, Vk([hl], "{"), Vk([il], "}"), (0, R2.map)(Ua, (m2) => m2 || ["sequenceExpr"])]), ts = (0, R2.or)([Lp, function(m2, r2) {
        return Jj(m2, r2);
      }, Bf, Kp]), us = (0, R2.or)([(0, R2.map)(Mp, (m2) => m2.replace(/[\x20\x0D\x0A\x09]/g, " ")), Bf]), vs = (0, R2.or)([(0, R2.map)(Np, (m2) => m2.replace(/[\x20\x0D\x0A\x09]/g, " ")), Bf]), ws = (0, R2.map)((0, R2.or)([S2((0, R2.star)((0, R2.or)([vp, us])), ll), S2((0, R2.star)((0, R2.or)([
        wp,
        vs
      ])), jl)]), (m2) => kq(m2, false, false)), xs = (0, R2.then)(kp, (0, R2.preceded)(S2(Jl, (0, R2.optional)(bp)), ws), (m2, r2) => {
        if ("" === m2[0].prefix && "xmlns" === m2[1]) {
          if (r2.length && "string" !== typeof r2[0]) throw Error("XQST0022: A namespace declaration may not contain enclosed expressions");
          return ["namespaceDeclaration", r2.length ? ["uri", r2[0]] : ["uri"]];
        }
        if ("xmlns" === m2[0].prefix) {
          if (r2.length && "string" !== typeof r2[0]) throw Error("XQST0022: The namespace declaration for 'xmlns:" + m2[1] + "' may not contain enclosed expressions");
          return [
            "namespaceDeclaration",
            ["prefix", m2[1]],
            r2.length ? ["uri", r2[0]] : ["uri"]
          ];
        }
        return ["attributeConstructor", ["attributeName"].concat(m2), 0 === r2.length ? ["attributeValue"] : 1 === r2.length && "string" === typeof r2[0] ? ["attributeValue", r2[0]] : ["attributeValueExpr"].concat(r2)];
      }), ys = (0, R2.map)((0, R2.star)((0, R2.preceded)(bp, (0, R2.optional)(xs))), (m2) => m2.filter(Boolean)), zs = Rk((0, R2.preceded)(Ol, kp), ys, (0, R2.or)([(0, R2.map)(pl, () => null), (0, R2.then)((0, R2.preceded)(Rl, (0, R2.star)(ts)), T2([V2, ql], (0, R2.followed)(kp, (0, R2.then)((0, R2.optional)(bp), Rl, () => null))), (m2, r2) => [kq(m2, true, true), r2])]), (m2, r2, B2) => {
        var W2 = B2;
        if (B2 && B2.length) {
          W2 = lq(m2);
          const ea = lq(B2[1]);
          if (W2 !== ea) throw Error('XQST0118: The start and the end tag of an element constructor must be equal. "' + W2 + '" does not match "' + ea + '"');
          W2 = B2[0];
        }
        return ["elementConstructor", ["tagName", ...m2], ...r2.length ? [["attributeList", ...r2]] : [], ...W2 && W2.length ? [["elementContent", ...W2]] : []];
      }), Jj = (0, R2.or)([zs, Pp, Sp]), As = (0, R2.map)(T2([cn, V2], Ua), (m2) => ["computedDocumentConstructor", ...m2 ? [["argExpr", m2]] : []]), Bs = (0, R2.map)(Ua, (m2) => m2 ? [[
        "contentExpr",
        m2
      ]] : []), Cs = (0, R2.then)(T2([qm, V2], (0, R2.or)([(0, R2.map)(np, (m2) => ["tagName", ...m2]), (0, R2.map)((0, R2.delimited)(fl, S2(l2, V2), gl), (m2) => ["tagNameExpr", m2])])), (0, R2.preceded)(V2, Bs), (m2, r2) => ["computedElementConstructor", m2, ...r2]), Ds = (0, R2.then)((0, R2.preceded)(rm, (0, R2.or)([(0, R2.map)(T2([qp, V2], np), (m2) => ["tagName", ...m2]), (0, R2.map)((0, R2.preceded)(V2, (0, R2.delimited)(fl, S2(l2, V2), gl)), (m2) => ["tagNameExpr", m2])])), (0, R2.preceded)(V2, Ua), (m2, r2) => ["computedAttributeConstructor", m2, ["valueExpr", r2 ? r2 : ["sequenceExpr"]]]), Es = (0, R2.map)(Ua, (m2) => m2 ? [[
        "prefixExpr",
        m2
      ]] : []), Fs = (0, R2.map)(Ua, (m2) => m2 ? [["URIExpr", m2]] : []), Gs = (0, R2.then)(T2([dn, V2], (0, R2.or)([fp, Es])), (0, R2.preceded)(V2, Fs), (m2, r2) => ["computedNamespaceConstructor", ...m2, ...r2]), Hs = (0, R2.map)(T2([en, V2], Ua), (m2) => ["computedTextConstructor", ...m2 ? [["argExpr", m2]] : []]), Is = (0, R2.map)(T2([fn, V2], Ua), (m2) => ["computedCommentConstructor", ...m2 ? [["argExpr", m2]] : []]), Js = T2([gn, V2], (0, R2.then)((0, R2.or)([(0, R2.map)(ep, (m2) => ["piTarget", m2]), (0, R2.map)((0, R2.delimited)(fl, S2(l2, V2), gl), (m2) => ["piTargetExpr", m2])]), (0, R2.preceded)(V2, Ua), (m2, r2) => [
        "computedPIConstructor",
        m2,
        ...r2 ? [["piValueExpr", r2]] : []
      ])), Ks = (0, R2.or)([As, Cs, Ds, Gs, Hs, Is, Js]), Ls = (0, R2.or)([Jj, Ks]), Kj = (0, R2.or)([yf, pp, zf, Gp, Ur, Ls, hs, ls, os, rs, ss]), Lj = (0, R2.map)(T2([Il, V2], Ij), (m2) => "*" === m2 ? ["lookup", ["star"]] : "string" === typeof m2 ? ["lookup", ["NCName", m2]] : ["lookup", m2]), Ms = (0, R2.then)((0, R2.map)(Kj, (m2) => hq(m2)), (0, R2.star)((0, R2.or)([(0, R2.map)((0, R2.preceded)(V2, t2), (m2) => ["predicate", m2]), (0, R2.map)((0, R2.preceded)(V2, de), (m2) => ["argumentList", m2]), (0, R2.preceded)(V2, Lj)])), (m2, r2) => {
        function B2() {
          Mj && 1 === Fa.length ? Bc.push([
            "predicate",
            Fa[0]
          ]) : 0 !== Fa.length && Bc.push(["predicates", ...Fa]);
          Fa.length = 0;
        }
        function W2(Zb) {
          B2();
          0 !== Bc.length ? ("sequenceExpr" === ea[0][0] && 2 < ea[0].length && (ea = [["sequenceExpr", ...ea]]), ea = [["filterExpr", ...ea], ...Bc], Bc.length = 0) : Zb && (ea = [["filterExpr", ...ea]]);
        }
        let ea = [m2];
        const Fa = [], Bc = [];
        let Mj = false;
        for (const Zb of r2) switch (Zb[0]) {
          case "predicate":
            Fa.push(Zb[1]);
            break;
          case "lookup":
            Mj = true;
            B2();
            Bc.push(Zb);
            break;
          case "argumentList":
            W2(false);
            1 < ea.length && (ea = [["sequenceExpr", ["pathExpr", ["stepExpr", ...ea]]]]);
            ea = [[
              "dynamicFunctionInvocationExpr",
              ["functionItem", ...ea],
              ...Zb[1].length ? [["arguments", ...Zb[1]]] : []
            ]];
            break;
          default:
            throw Error("unreachable");
        }
        W2(true);
        return ea;
      }), Cc = (0, R2.or)([(0, R2.map)(Ms, (m2) => ["stepExpr", ...m2]), Tr]), Ns = (0, R2.followed)(Kj, (0, R2.peek)((0, R2.not)((0, R2.preceded)(V2, (0, R2.or)([t2, de, Lj])), ["primary expression not followed by predicate, argumentList, or lookup"]))), Os = (0, R2.or)([
        Rk(Cc, (0, R2.preceded)(V2, Tp), (0, R2.preceded)(V2, h2), (m2, r2, B2) => ["pathExpr", m2, r2, ...B2]),
        (0, R2.then)(Cc, (0, R2.preceded)(S2(Zl, V2), h2), (m2, r2) => ["pathExpr", m2, ...r2]),
        Ns,
        (0, R2.map)(Cc, (m2) => ["pathExpr", m2])
      ]), xf = (0, R2.or)([Rk(Cc, (0, R2.preceded)(V2, Tp), (0, R2.preceded)(V2, h2), (m2, r2, B2) => [m2, r2, ...B2]), (0, R2.then)(Cc, (0, R2.preceded)(S2(Zl, V2), h2), (m2, r2) => [m2, ...r2]), (0, R2.map)(Cc, (m2) => [m2])]), Ps = (0, R2.or)([(0, R2.map)(T2([Zl, V2], xf), (m2) => ["pathExpr", ["rootExpr"], ...m2]), (0, R2.then)(Tp, (0, R2.preceded)(V2, xf), (m2, r2) => ["pathExpr", ["rootExpr"], m2, ...r2]), (0, R2.map)(
        (0, R2.followed)(Zl, (0, R2.not)((0, R2.preceded)(V2, a2.Za ? Wk(/[*<a-zA-Z]/) : Wk(/[*a-zA-Z]/)), ["Single rootExpr cannot be by followed by something that can be interpreted as a relative path"])),
        () => ["pathExpr", ["rootExpr"]]
      )]), Qs = Qk((0, R2.or)([Os, Ps]), oq), Rs = (0, R2.preceded)(kn, (0, R2.then)((0, R2.optional)((0, R2.or)([(0, R2.map)((0, R2.preceded)(V2, Up), (m2) => ["validationMode", m2]), (0, R2.map)(T2([V2, ln, V2], np), (m2) => ["type", ...m2])])), (0, R2.delimited)((0, R2.preceded)(V2, fl), S2(l2, V2), gl), (m2, r2) => ["validateExpr", ...m2 ? [m2] : [], ["argExpr", r2]])), Ss = (0, R2.delimited)($k, (0, R2.then)((0, R2.preceded)(V2, np), (0, R2.optional)((0, R2.preceded)(X2, Vp)), (m2, r2) => r2 ? ["pragma", ["pragmaName", m2], ["pragmaContents", r2]] : ["pragma", ["pragmaName", m2]]), (0, R2.preceded)(
        V2,
        al
      )), Ts = (0, R2.map)((0, R2.followed)((0, R2.plus)(Ss), (0, R2.preceded)(V2, (0, R2.delimited)(fl, S2((0, R2.optional)(l2), V2), gl))), (m2) => ["extensionExpr", ...m2]), Us = e2(c2(Qs, Kl, (m2, r2) => 0 === r2.length ? m2 : ["simpleMapExpr", "pathExpr" === m2[0] ? m2 : ["pathExpr", ["stepExpr", ["filterExpr", hq(m2)]]]].concat(r2.map((B2) => {
        B2 = B2[1];
        return "pathExpr" === B2[0] ? B2 : ["pathExpr", ["stepExpr", ["filterExpr", hq(B2)]]];
      })))), Vs = (0, R2.or)([Rs, Ts, Us]), Nj = (0, R2.or)([(0, R2.then)((0, R2.or)([Vk([Yl], "unaryMinusOp"), Vk([Xl], "unaryPlusOp")]), (0, R2.preceded)(V2, function(m2, r2) {
        return Nj(
          m2,
          r2
        );
      }), (m2, r2) => [m2, ["operand", r2]]), Vs]), Ws = (0, R2.or)([(0, R2.map)(np, (m2) => ["EQName", ...m2]), pp, zf]), Xs = (0, R2.then)(Nj, (0, R2.star)(T2([V2, am, V2], (0, R2.then)(Ws, (0, R2.preceded)(V2, de), (m2, r2) => [m2, r2]))), (m2, r2) => r2.reduce((B2, W2) => ["arrowExpr", ["argExpr", B2], W2[0], ["arguments", ...W2[1]]], m2)), Ys = (0, R2.then)(Xs, (0, R2.optional)(T2([V2, fm, X2, em, qp, V2], mq)), (m2, r2) => null !== r2 ? ["castExpr", ["argExpr", m2], r2] : m2), Zs = (0, R2.then)(Ys, (0, R2.optional)(T2([V2, gm, X2, em, qp, V2], mq)), (m2, r2) => null !== r2 ? ["castableExpr", ["argExpr", m2], r2] : m2), $s = (0, R2.then)(Zs, (0, R2.optional)(T2([
        V2,
        hm,
        X2,
        em,
        qp,
        V2
      ], jb)), (m2, r2) => null !== r2 ? ["treatExpr", ["argExpr", m2], ["sequenceType", ...r2]] : m2), at = (0, R2.then)($s, (0, R2.optional)(T2([V2, im, X2, jm, qp, V2], jb)), (m2, r2) => null !== r2 ? ["instanceOfExpr", ["argExpr", m2], ["sequenceType", ...r2]] : m2), bt = c2(at, (0, R2.followed)((0, R2.or)([Vk([tm], "intersectOp"), Vk([um], "exceptOp")]), qp), b2), ct = c2(bt, (0, R2.or)([Vk([Ll], "unionOp"), (0, R2.followed)(Vk([vm], "unionOp"), qp)]), b2), dt = c2(ct, (0, R2.or)([Vk([Dl], "multiplyOp"), (0, R2.followed)(Vk([Am], "divOp"), qp), (0, R2.followed)(Vk([Bm], "idivOp"), qp), (0, R2.followed)(Vk(
        [Cm],
        "modOp"
      ), qp)]), b2), et = c2(dt, (0, R2.or)([Vk([Yl], "subtractOp"), Vk([Xl], "addOp")]), b2), ft = d2(et, (0, R2.followed)(Vk([wm], "rangeSequenceExpr"), qp), "startExpr", "endExpr"), gt = c2(ft, Vk([Ml], "stringConcatenateOp"), b2), ht = d2(gt, (0, R2.or)([Wp, Xp, Yp])), it = c2(ht, (0, R2.followed)(Vk([zm], "andOp"), qp), b2), Nr = c2(it, (0, R2.followed)(Vk([ym], "orOp"), qp), b2), jt = e2((0, R2.map)(l2, (m2) => ["ifClause", m2])), kt = e2((0, R2.map)(k2, (m2) => ["thenClause", m2])), lt = e2((0, R2.map)(k2, (m2) => ["elseClause", m2])), Hr = (0, R2.then)((0, R2.then)(T2([Mm, V2, bl, V2], jt), T2(
        [V2, cl, V2, Nm, qp, V2],
        kt
      ), (m2, r2) => [m2, r2]), T2([V2, Om, qp, V2], lt), (m2, r2) => ["ifThenElseExpr", m2[0], m2[1], r2]), mt = (0, R2.delimited)(Pm, X2, Qm), nt = (0, R2.map)(T2([Rm, X2, Fl], np), (m2) => ["positionalVariableBinding", ...m2]), ot = Tk((0, R2.preceded)(Fl, (0, R2.cut)(np)), (0, R2.cut)((0, R2.preceded)(V2, (0, R2.optional)(Ac))), (0, R2.cut)((0, R2.preceded)(V2, (0, R2.optional)(mt))), (0, R2.cut)((0, R2.preceded)(V2, (0, R2.optional)(nt))), (0, R2.cut)((0, R2.preceded)(S2(Sm, V2), k2)), (m2, r2, B2, W2, ea) => ["forClauseItem", ["typedVariableBinding", ["varName", ...m2, ...r2 ? [r2] : []]], ...B2 ? [["allowingEmpty"]] : [], ...W2 ? [W2] : [], ["forExpr", ea]]), pt = T2([Tm, X2], c2(ot, Ul, (m2, r2) => ["forClause", m2, ...r2.map((B2) => B2[1])])), qt = Rk((0, R2.preceded)(Fl, np), (0, R2.preceded)(V2, (0, R2.optional)(Ac)), (0, R2.preceded)(S2(zl, V2), k2), (m2, r2, B2) => ["letClauseItem", ["typedVariableBinding", ["varName", ...m2], ...r2 ? [r2] : []], ["letExpr", B2]]), rt = (0, R2.map)(T2([Um, V2], c2(qt, Ul, (m2, r2) => [m2, ...r2.map((B2) => B2[1])])), (m2) => ["letClause", ...m2]), Oj = (0, R2.or)([pt, rt]), st = (0, R2.map)(T2([Vm, qp, V2], k2), (m2) => ["whereClause", m2]), tt = (0, R2.map)((0, R2.preceded)(Fl, np), (m2) => ["varName", ...m2]), ut = (0, R2.then)((0, R2.preceded)(V2, (0, R2.optional)(Ac)), (0, R2.preceded)(S2(zl, V2), k2), (m2, r2) => ["groupVarInitialize", ...m2 ? [["typeDeclaration", ...m2]] : [], ["varValue", r2]]), vt = Rk(tt, (0, R2.optional)(ut), (0, R2.optional)((0, R2.map)((0, R2.preceded)(S2(Wm, V2), u2), (m2) => ["collation", m2])), (m2, r2, B2) => ["groupingSpec", m2, ...r2 ? [r2] : [], ...B2 ? [B2] : []]), wt = c2(vt, Ul, (m2, r2) => [m2, ...r2.map((B2) => B2[1])]), xt = (0, R2.map)(T2([Xm, X2, Ym, V2], wt), (m2) => ["groupByClause", ...m2]), yt = Rk((0, R2.optional)((0, R2.or)([jo, ko])), (0, R2.optional)(T2([V2, Qm, V2], (0, R2.or)([un, vn].map((m2) => (0, R2.map)(m2, (r2) => "empty " + r2))))), (0, R2.preceded)(V2, (0, R2.optional)(T2([Wm, V2], u2))), (m2, r2, B2) => m2 || r2 || B2 ? ["orderModifier", ...m2 ? [["orderingKind", m2]] : [], ...r2 ? [["emptyOrderingMode", r2]] : [], ...B2 ? [["collation", B2]] : []] : null), zt = (0, R2.then)(k2, (0, R2.preceded)(V2, yt), (m2, r2) => ["orderBySpec", ["orderByExpr", m2], ...r2 ? [r2] : []]), At = c2(zt, Ul, (m2, r2) => [m2, ...r2.map((B2) => B2[1])]), Bt = (0, R2.then)((0, R2.or)([(0, R2.map)(T2([Zm, X2], Ym), () => false), (0, R2.map)(T2([$m, X2, Zm, X2], Ym), () => true)]), (0, R2.preceded)(V2, At), (m2, r2) => ["orderByClause", ...m2 ? [["stable"]] : [], ...r2]), Ct = (0, R2.or)([Oj, st, xt, Bt]), Dt = (0, R2.map)(T2([an, V2], k2), (m2) => ["returnClause", m2]), Dr = Rk(Oj, (0, R2.cut)((0, R2.star)((0, R2.preceded)(V2, Ct))), (0, R2.cut)((0, R2.preceded)(V2, Dt)), (m2, r2, B2) => ["flworExpr", m2, ...r2, B2]), Et = c2(jb, Ll, (m2, r2) => 0 === r2.length ? ["sequenceType", ...m2] : ["sequenceTypeUnion", ["sequenceType", ...m2], ...r2.map((B2) => ["sequenceType", ...B2[1]])]), Ft = Rk(T2([yn, V2], (0, R2.optional)((0, R2.preceded)(Fl, (0, R2.followed)((0, R2.followed)(np, X2), em)))), (0, R2.preceded)(V2, Et), T2([X2, an, X2], k2), (m2, r2, B2) => ["typeswitchExprCaseClause"].concat(m2 ? [["variableBinding", ...m2]] : [], [r2], [["resultExpr", B2]])), Gr = Sk((0, R2.preceded)(zn, S2((0, R2.delimited)(bl, S2(l2, V2), cl), V2)), (0, R2.plus)((0, R2.followed)(Ft, V2)), T2([nn, X2], (0, R2.optional)((0, R2.preceded)(Fl, (0, R2.followed)(np, X2)))), T2([an, X2], k2), (m2, r2, B2, W2) => ["typeswitchExpr", ["argExpr", m2], ...r2, ["typeswitchExprDefaultClause", ...B2 || [], ["resultExpr", W2]]]), Gt = Rk((0, R2.preceded)(Fl, np), (0, R2.optional)((0, R2.preceded)(X2, Ac)), (0, R2.preceded)(S2(Sm, X2), k2), (m2, r2, B2) => ["quantifiedExprInClause", [
        "typedVariableBinding",
        ["varName", ...m2],
        ...r2 ? [r2] : []
      ], ["sourceExpr", B2]]), Ht = c2(Gt, Ul, (m2, r2) => [m2, ...r2.map((B2) => B2[1])]), Er = Rk((0, R2.or)([An, Bn]), (0, R2.preceded)(X2, Ht), (0, R2.preceded)(S2(Cn, V2), k2), (m2, r2, B2) => ["quantifiedExpr", ["quantifier", m2], ...r2, ["predicateExpr", B2]]), Jr = (0, R2.map)(T2([mm, X2, (0, R2.or)([lm, km]), X2], k2), (m2) => ["deleteExpr", ["targetExpr", m2]]), Lr = Rk(T2([Dn, X2], (0, R2.optional)(T2([nm, X2, jm], X2))), T2([km, X2], k2), (0, R2.preceded)(S2(En, X2), k2), (m2, r2, B2) => m2 ? ["replaceExpr", ["replaceValue"], ["targetExpr", r2], ["replacementExpr", B2]] : ["replaceExpr", ["targetExpr", r2], [
        "replacementExpr",
        B2
      ]]), It = (0, R2.then)(pp, (0, R2.preceded)(S2(zl, V2), k2), (m2, r2) => ["transformCopy", m2, ["copySource", r2]]), Mr = Rk(T2([Fn, X2], c2(It, Ul, (m2, r2) => [m2, ...r2.map((B2) => B2[1])])), T2([V2, Gn, X2], k2), (0, R2.preceded)(S2(an, X2), k2), (m2, r2, B2) => ["transformExpr", ["transformCopies", ...m2], ["modifyExpr", r2], ["returnExpr", B2]]), Jt = (0, R2.or)([
        (0, R2.followed)((0, R2.map)((0, R2.optional)((0, R2.followed)(T2([em, X2], (0, R2.or)([(0, R2.map)(Hn, () => ["insertAsFirst"]), (0, R2.map)(In, () => ["insertAsLast"])])), X2)), (m2) => m2 ? ["insertInto", m2] : ["insertInto"]), Ln),
        (0, R2.map)(Kn, () => ["insertAfter"]),
        (0, R2.map)(Jn, () => ["insertBefore"])
      ]), Ir = Rk(T2([Mn, X2, (0, R2.or)([lm, km]), X2], k2), (0, R2.preceded)(X2, Jt), (0, R2.preceded)(X2, k2), (m2, r2, B2) => ["insertExpr", ["sourceExpr", m2], r2, ["targetExpr", B2]]), Kr = (0, R2.then)(T2([Nn, X2, km, V2], k2), T2([X2, em, X2], k2), (m2, r2) => ["renameExpr", ["targetExpr", m2], ["newNameExpr", r2]]), Kt = (0, R2.then)((0, R2.plus)((0, R2.then)((0, R2.map)(T2([yn, X2], (0, R2.cut)(k2)), (m2) => ["switchCaseExpr", m2]), (0, R2.cut)(X2), (m2) => m2)), (0, R2.cut)(T2([an, X2], (0, R2.cut)(k2))), (m2, r2) => ["switchExprCaseClause", ...m2, ["resultExpr", r2]]), Fr = Rk(T2(
        [On, V2, bl],
        (0, R2.cut)(l2)
      ), (0, R2.cut)(T2([V2, cl, (0, R2.cut)(V2)], (0, R2.plus)((0, R2.followed)(Kt, V2)))), (0, R2.cut)(T2([nn, X2, an, X2], k2)), (m2, r2, B2) => ["switchExpr", ["argExpr", m2], ...r2, ["switchExprDefaultClause", ["resultExpr", B2]]]), Lt = (0, R2.map)(l2, (m2) => ["queryBody", m2]), Mt = T2([mn, X2, dn, X2], (0, R2.cut)((0, R2.then)(ep, (0, R2.preceded)(S2(Jl, V2), u2), (m2, r2) => ["namespaceDecl", ["prefix", m2], ["uri", r2]]))), Nt = (0, R2.then)(T2([Pn, X2, Fl, V2], (0, R2.then)(np, (0, R2.optional)((0, R2.preceded)(V2, Ac)), (m2, r2) => [m2, r2])), (0, R2.cut)((0, R2.or)([(0, R2.map)(T2([V2, zl, V2], k2), (m2) => [
        "varValue",
        m2
      ]), (0, R2.map)(T2([X2, Qn], (0, R2.optional)(T2([V2, zl, V2], k2))), (m2) => ["external", ...m2 ? [["varValue", m2]] : []])])), ([m2, r2], B2) => ["varDecl", ["varName", ...m2], ...null !== r2 ? [r2] : [], B2]), Ot = Sk(
        T2([om, X2, (0, R2.cut)((0, R2.peek)((0, R2.not)((0, R2.followed)(Hp, (0, R2.not)(Bl, [""])), ["Cannot use reserved function name"])))], np),
        (0, R2.cut)(T2([V2, bl, V2], (0, R2.optional)(Gj))),
        (0, R2.cut)(T2([V2, cl], (0, R2.optional)(T2([X2, em, X2], jb)))),
        (0, R2.cut)((0, R2.preceded)(V2, (0, R2.or)([(0, R2.map)(Fj, (m2) => ["functionBody", m2]), (0, R2.map)(Qn, () => ["externalDefinition"])]))),
        (m2, r2, B2, W2) => ["functionDecl", ["functionName", ...m2], ["paramList", ...r2 || []], ...B2 ? [["typeDeclaration", ...B2]] : [], W2]
      ), Pt = T2([mn, X2], (0, R2.then)((0, R2.star)((0, R2.followed)((0, R2.or)([Af, Zp]), X2)), (0, R2.or)([Nt, Ot]), (m2, r2) => [r2[0], ...m2, ...r2.slice(1)])), Qt = (0, R2.then)(T2([mn, X2, nn, X2], (0, R2.or)([qm, om])), T2([X2, dn, X2], u2), (m2, r2) => ["defaultNamespaceDecl", ["defaultNamespaceCategory", m2], ["uri", r2]]), Rt = (0, R2.or)([(0, R2.map)((0, R2.followed)(T2([dn, X2], ep), (0, R2.preceded)(V2, Jl)), (m2) => ["namespacePrefix", m2]), (0, R2.map)(
        T2([nn, X2, qm, X2], dn),
        () => ["defaultElementNamespace"]
      )]), St = T2([Sn, X2, Tn], Rk((0, R2.optional)((0, R2.preceded)(X2, Rt)), (0, R2.preceded)(V2, u2), (0, R2.optional)((0, R2.then)(T2([X2, Rm, X2], u2), (0, R2.star)(T2([V2, Ul, V2], u2)), (m2, r2) => [m2, ...r2])), (m2, r2, B2) => ["schemaImport", ...m2 ? [m2] : [], ["targetNamespace", r2], ...B2 ? [B2] : []])), Tt = T2([Sn, X2, Un], Rk((0, R2.optional)((0, R2.followed)(T2([X2, dn, X2], ep), (0, R2.preceded)(V2, Jl))), (0, R2.preceded)(V2, u2), (0, R2.optional)((0, R2.then)(T2([X2, Rm, X2], u2), (0, R2.star)(T2([V2, Ul, V2], u2)), (m2, r2) => [m2, ...r2])), (m2, r2) => ["moduleImport", [
        "namespacePrefix",
        m2
      ], ["targetNamespace", r2]])), Ut = (0, R2.or)([St, Tt]), Vt = (0, R2.map)(T2([mn, X2, nn, X2, Wm, X2], u2), (m2) => ["defaultCollationDecl", m2]), Wt = (0, R2.map)(T2([mn, X2, Vn, X2], u2), (m2) => ["baseUriDecl", m2]), Xt = (0, R2.then)(T2([mn, X2], (0, R2.or)([(0, R2.map)(T2([xn, X2], np), (m2) => ["decimalFormatName", ...m2]), (0, R2.map)(T2([nn, X2], xn), () => null)])), (0, R2.star)((0, R2.then)((0, R2.preceded)(X2, bq), (0, R2.preceded)(S2(Jl, X2), u2), (m2, r2) => ["decimalFormatParam", ["decimalFormatParamName", m2], ["decimalFormatParamValue", r2]])), (m2, r2) => ["decimalFormatDecl", ...m2 ? [m2] : [], ...r2]), Yt = (0, R2.or)([cq, Vt, Wt, dq, eq, fq, gq, Xt]), Zt = (0, R2.then)(T2([mn, X2, $n, X2], np), (0, R2.preceded)(X2, u2), (m2, r2) => ["optionDecl", ["optionName", m2], ["optionContents", r2]]), $t = (0, R2.then)(T2([mn, X2, ao, X2, bo], (0, R2.optional)(T2([X2, em], Dj))), (0, R2.or)([(0, R2.map)((0, R2.preceded)(S2(zl, V2), k2), (m2) => ["varValue", m2]), (0, R2.map)(T2([X2, Qn], (0, R2.optional)((0, R2.preceded)(S2(zl, V2), k2))), () => ["external"])]), (m2, r2) => ["contextItemDecl", ...m2 ? [["contextItemType", m2]] : [], r2]), Pj = (0, R2.then)(
        (0, R2.star)((0, R2.followed)((0, R2.or)([Qt, Yt, Mt, Ut]), (0, R2.cut)(S2(Cl, V2)))),
        (0, R2.star)((0, R2.followed)((0, R2.or)([$t, Pt, Zt]), (0, R2.cut)(S2(Cl, V2)))),
        (m2, r2) => 0 === m2.length && 0 === r2.length ? null : ["prolog", ...m2, ...r2]
      ), au = T2([Un, X2, dn, X2], (0, R2.then)((0, R2.followed)(ep, S2(Jl, V2)), (0, R2.followed)(u2, S2(Cl, V2)), (m2, r2) => ["moduleDecl", ["prefix", m2], ["uri", r2]])), bu = (0, R2.then)(au, (0, R2.preceded)(V2, Pj), (m2, r2) => ["libraryModule", m2, ...r2 ? [r2] : []]), cu = (0, R2.then)(Pj, (0, R2.preceded)(V2, Lt), (m2, r2) => ["mainModule", ...m2 ? [m2] : [], r2]), du = (0, R2.map)(T2([co, V2], (0, R2.followed)((0, R2.or)([(0, R2.then)((0, R2.preceded)(fo, X2), u2, (m2) => [
        "encoding",
        m2
      ]), (0, R2.then)(T2([eo, X2], u2), (0, R2.optional)(T2([X2, fo, X2], u2)), (m2, r2) => [["version", m2], ...r2 ? [["encoding", r2]] : []])]), (0, R2.preceded)(V2, Cl))), (m2) => ["versionDecl", ...m2]), eu = (0, R2.then)((0, R2.optional)(S2(du, V2)), (0, R2.or)([bu, cu]), (m2, r2) => ["module", ...m2 ? [m2] : [], r2]), fu = (0, R2.complete)(S2(eu, V2));
      return (m2, r2) => {
        n2.clear();
        r2 = fu(m2, r2);
        let B2 = 1, W2 = 1;
        for (let ea = 0; ea < m2.length + 1; ea++) {
          if (n2.has(ea)) {
            const Fa = n2.get(ea);
            Fa.line = W2;
            Fa.ha = B2;
          }
          "\n" === m2[ea] ? (W2++, B2 = 1) : B2++;
        }
        return r2;
      };
    }
    const qq = pq({ mb: false, Za: false }), rq = pq({ mb: true, Za: false }), sq = pq({ mb: false, Za: true }), tq = pq({ mb: true, Za: true });
    function uq(a2, b2) {
      var c2 = !!b2.Z;
      b2 = !!b2.debug;
      Wo.clear();
      Xo.clear();
      oq.clear();
      c2 = c2 ? b2 ? tq(a2, 0) : sq(a2, 0) : b2 ? rq(a2, 0) : qq(a2, 0);
      if (true === c2.success) return c2.value;
      a2 = a2.substring(0, c2.offset).split("\n");
      b2 = a2[a2.length - 1].length + 1;
      throw new Qh({ start: { offset: c2.offset, line: a2.length, ha: b2 }, end: { offset: c2.offset + 1, line: a2.length, ha: b2 + 1 } }, "", "", Error(`XPST0003: Failed to parse script. Expected ${[...new Set(c2.expected)]}`));
    }
    const vq = "http://www.w3.org/XML/1998/namespace http://www.w3.org/2001/XMLSchema http://www.w3.org/2001/XMLSchema-instance http://www.w3.org/2005/xpath-functions http://www.w3.org/2005/xpath-functions/math http://www.w3.org/2012/xquery http://www.w3.org/2005/xpath-functions/array http://www.w3.org/2005/xpath-functions/map".split(" ");
    function wq(a2, b2, c2, d2, e2) {
      var f2 = F2(a2, "functionName"), h2 = I2(f2, "prefix") || "";
      let k2 = I2(f2, "URI");
      const l2 = H2(f2);
      if (null === k2 && (k2 = "" === h2 ? null === b2.v ? "http://www.w3.org/2005/xpath-functions" : b2.v : b2.$(h2), !k2 && h2)) throw yg(h2);
      if (vq.includes(k2)) throw sg();
      h2 = K2(a2, "annotation").map((y2) => F2(y2, "annotationName"));
      f2 = h2.every((y2) => !I2(y2, "URI") && "private" !== H2(y2));
      h2 = h2.some((y2) => !I2(y2, "URI") && "updating" === H2(y2));
      if (!k2) throw ug();
      const n2 = Kg(a2), t2 = K2(F2(a2, "paramList"), "param"), u2 = t2.map((y2) => F2(y2, "varName")), z2 = t2.map((y2) => Kg(y2));
      if (a2 = F2(a2, "functionBody")) {
        if (b2.va(
          k2,
          l2,
          z2.length
        )) throw tg(k2, l2);
        if (!e2) return;
        const y2 = Fk(a2[1], { sa: false, Z: true }), G2 = new Bg(b2), N2 = u2.map((U2) => {
          let ca = I2(U2, "URI");
          const Ga = I2(U2, "prefix");
          U2 = H2(U2);
          Ga && null === ca && (ca = b2.$(Ga || ""));
          return Gg(G2, ca, U2);
        });
        e2 = h2 ? { j: z2, arity: u2.length, callFunction: (U2, ca, Ga, ...Gb) => {
          U2 = hc(bc(U2, -1, null, w2.empty()), N2.reduce((Xb, fd, Yb) => {
            Xb[fd] = Ra(Gb[Yb]);
            return Xb;
          }, /* @__PURE__ */ Object.create(null)));
          return y2.s(U2, ca);
        }, wb: false, I: true, cb: f2, localName: l2, namespaceURI: k2, i: n2 } : { j: z2, arity: u2.length, callFunction: (U2, ca, Ga, ...Gb) => {
          U2 = hc(bc(U2, -1, null, w2.empty()), N2.reduce((Xb, fd, Yb) => {
            Xb[fd] = Ra(Gb[Yb]);
            return Xb;
          }, /* @__PURE__ */ Object.create(null)));
          return C2(y2, U2, ca);
        }, wb: false, I: false, cb: f2, localName: l2, namespaceURI: k2, i: n2 };
        c2.push({ ba: y2, Eb: G2 });
        d2.push({ arity: u2.length, ba: y2, Ab: e2, localName: l2, namespaceURI: k2, cb: f2 });
      } else {
        if (h2) throw Error("Updating external function declarations are not supported");
        e2 = { j: z2, arity: u2.length, callFunction: (y2, G2, N2, ...U2) => {
          const ca = N2.va(k2, l2, u2.length, true);
          if (!ca) throw Error(`XPST0017: Function Q{${k2}}${l2} with arity of ${u2.length} not registered. ${lg(l2)}`);
          if (ca.i.type !== n2.type || ca.j.some((Ga, Gb) => Ga.type !== z2[Gb].type)) throw Error("External function declaration types do not match actual function");
          return ca.callFunction(y2, G2, N2, ...U2);
        }, wb: true, I: false, localName: l2, namespaceURI: k2, cb: f2, i: n2 };
      }
      Eg(b2, k2, l2, u2.length, e2);
    }
    function xq(a2, b2, c2, d2) {
      const e2 = [], f2 = [];
      K2(a2, "*").forEach((t2) => {
        switch (t2[0]) {
          case "moduleImport":
          case "namespaceDecl":
          case "defaultNamespaceDecl":
          case "functionDecl":
          case "varDecl":
            break;
          default:
            throw Error("Not implemented: only module imports, namespace declarations, and function declarations are implemented in XQuery modules");
        }
      });
      const h2 = /* @__PURE__ */ new Set();
      K2(a2, "moduleImport").forEach((t2) => {
        const u2 = H2(F2(t2, "namespacePrefix"));
        t2 = H2(F2(t2, "targetNamespace"));
        if (h2.has(t2)) throw Error(`XQST0047: The namespace "${t2}" is imported more than once.`);
        h2.add(t2);
        Fg(b2, u2, t2);
      });
      K2(a2, "namespaceDecl").forEach((t2) => {
        const u2 = H2(F2(t2, "prefix"));
        t2 = H2(F2(t2, "uri"));
        if ("xml" === u2 || "xmlns" === u2) throw wg();
        if ("http://www.w3.org/XML/1998/namespace" === t2 || "http://www.w3.org/2000/xmlns/" === t2) throw wg();
        Fg(b2, u2, t2);
      });
      let k2 = null, l2 = null;
      for (const t2 of K2(a2, "defaultNamespaceDecl")) {
        const u2 = H2(F2(t2, "defaultNamespaceCategory")), z2 = H2(F2(t2, "uri"));
        if (!z2) throw ug();
        if ("http://www.w3.org/XML/1998/namespace" === z2 || "http://www.w3.org/2000/xmlns/" === z2) throw wg();
        if ("function" === u2) {
          if (k2) throw vg();
          k2 = z2;
        } else if ("element" === u2) {
          if (l2) throw vg();
          l2 = z2;
        }
      }
      k2 && (b2.v = k2);
      l2 && Fg(b2, "", l2);
      K2(a2, "functionDecl").forEach((t2) => {
        wq(t2, b2, e2, f2, c2);
      });
      const n2 = [];
      K2(a2, "varDecl").forEach((t2) => {
        const u2 = Jg(F2(t2, "varName"));
        let z2 = u2.namespaceURI;
        if (null === z2 && (z2 = b2.$(u2.prefix), !z2 && u2.prefix)) throw yg(u2.prefix);
        if (vq.includes(z2)) throw sg();
        var y2 = F2(t2, "external");
        t2 = F2(t2, "varValue");
        let G2, N2;
        null !== y2 ? (y2 = F2(y2, "varValue"), null !== y2 && (G2 = F2(y2, "*"))) : null !== t2 && (G2 = F2(t2, "*"));
        if (n2.some((U2) => U2.namespaceURI === z2 && U2.localName === u2.localName)) throw Error(`XQST0049: The variable ${z2 ? `Q{${z2}}` : ""}${u2.localName} has already been declared.`);
        Gg(b2, z2 || "", u2.localName);
        if (c2 && (G2 && (N2 = Fk(G2, { sa: false, Z: true })), G2 && !Dg(b2, z2 || "", u2.localName))) {
          let U2 = null;
          Hg(b2, z2, u2.localName, (ca, Ga) => {
            if (U2) return U2();
            U2 = Ra(C2(N2, ca, Ga));
            return U2();
          });
          e2.push({ ba: N2, Eb: new Bg(b2) });
          n2.push({ ba: N2, localName: u2.localName, namespaceURI: z2 });
        }
      });
      f2.forEach((t2) => {
        if (!t2.Ab.I && t2.ba.I) throw Ne(`The function Q{${t2.namespaceURI}}${t2.localName} is updating but the %updating annotation is missing.`);
      });
      return {
        Ia: f2.map((t2) => t2.Ab),
        Ta: n2,
        source: d2,
        pa: (t2) => {
          h2.forEach((u2) => {
            Nk(b2, u2);
          });
          e2.forEach(({ ba: u2, Eb: z2 }) => {
            h2.forEach((y2) => {
              Nk(z2, y2);
            });
            t2.Ia.forEach((y2) => {
              z2.va(y2.namespaceURI, y2.localName, y2.arity, true) || y2.cb && Eg(z2, y2.namespaceURI, y2.localName, y2.arity, y2);
            });
            t2.Ta.forEach((y2) => {
              z2.eb(y2.namespaceURI, y2.localName) || Gg(z2, y2.namespaceURI, y2.localName);
            });
            u2.v(z2);
          });
        }
      };
    }
    function yq(a2, b2, c2, d2, e2, f2, h2) {
      const k2 = b2.Z ? "XQuery" : "XPath";
      c2 = b2.Ha ? null : Ik(a2, k2, c2, d2, e2, b2.debug, f2, h2);
      return null !== c2 ? { state: c2.hc ? 1 : 2, ba: c2.ba } : { state: 0, Zb: "string" === typeof a2 ? uq(a2, b2) : Kk(a2) };
    }
    function zq(a2, b2, c2, d2) {
      const e2 = F2(a2, "mainModule");
      if (!e2) throw Error("Can not execute a library module.");
      const f2 = F2(e2, "prolog");
      if (f2) {
        if (!b2.Z) throw Error("XPST0003: Use of XQuery functionality is not allowed in XPath context");
        Ok();
        d2 = xq(f2, c2, true, d2);
        d2.pa(d2);
      }
      O2(a2, new qh(c2));
      a2 = J2(e2, ["queryBody", "*"]);
      return Q2(a2, b2);
    }
    function Aq(a2, b2, c2, d2, e2, f2, h2) {
      const k2 = new pg(c2, d2, f2, h2), l2 = new Bg(k2);
      0 < Object.keys(e2).length && Ok();
      Object.keys(e2).forEach((n2) => {
        const t2 = e2[n2];
        Nk(l2, t2);
        Fg(l2, n2, t2);
      });
      "string" === typeof a2 && (a2 = Pk(a2));
      c2 = yq(a2, b2, c2, d2, e2, f2, h2);
      switch (c2.state) {
        case 2:
          return { ga: l2, ba: c2.ba };
        case 1:
          return c2.ba.v(l2), Jk(a2, b2.Z ? "XQuery" : "XPath", k2, e2, c2.ba, b2.debug, f2), { ga: l2, ba: c2.ba };
        case 0:
          return c2 = zq(c2.Zb, b2, l2, a2), c2.v(l2), b2.Ha || Jk(a2, b2.Z ? "XQuery" : "XPath", k2, e2, c2, b2.debug, f2), { ga: l2, ba: c2 };
      }
    }
    function Bq(a2) {
      if (v2(a2.type, 1)) return a2.value;
      if (v2(a2.type, 54)) return a2.value.node;
      throw mc(`Unable to convert selector argument of type ${Da[a2.type]} to either an ${Da[1]} or an ${Da[54]} representing an XQueryX program while calling 'fontoxpath:evaluate'`);
    }
    function Cq(a2, b2, c2, d2) {
      a2 = a2.first();
      const e2 = b2.first().h.reduce((f2, h2) => {
        f2[h2.key.value] = Ra(h2.value());
        return f2;
      }, /* @__PURE__ */ Object.create(null));
      b2 = e2["."] ? e2["."]() : w2.empty();
      delete e2["."];
      a2 = Bq(a2);
      try {
        const { ba: f2, ga: h2 } = Aq(a2, { sa: false, Z: true, debug: d2.debug, Ha: d2.Ha }, (n2) => c2.$(n2), Object.keys(e2).reduce((n2, t2) => {
          n2[t2] = t2;
          return n2;
        }, {}), {}, "http://www.w3.org/2005/xpath-functions", (n2, t2) => c2.Sa(n2, t2)), k2 = !b2.F(), l2 = new cc({ M: k2 ? b2.first() : null, Aa: k2 ? 0 : -1, ta: b2, ra: Object.keys(e2).reduce((n2, t2) => {
          n2[h2.eb(null, t2)] = e2[t2];
          return n2;
        }, /* @__PURE__ */ Object.create(null)) });
        return { ic: f2.h(l2, d2).value, ac: a2 };
      } catch (f2) {
        gg(a2, f2);
      }
    }
    function Dq(a2, b2, c2) {
      if (1 !== b2.node.nodeType && 9 !== b2.node.nodeType) return [];
      const d2 = gb(a2, b2).reduce((e2, f2) => {
        for (const h2 of Dq(a2, f2, c2)) e2.push(h2);
        return e2;
      }, []);
      c2(b2) && d2.unshift(b2);
      return d2;
    }
    const Eq = (a2, b2, c2, d2, e2) => {
      a2 = e2.first();
      if (!a2) throw lc("The context is absent, it needs to be present to use id function.");
      if (!v2(a2.type, 53)) throw mc("The context item is not a node, it needs to be node to use id function.");
      const f2 = b2.h, h2 = d2.O().reduce((k2, l2) => {
        l2.value.split(/\s+/).forEach((n2) => {
          k2[n2] = true;
        });
        return k2;
      }, /* @__PURE__ */ Object.create(null));
      for (b2 = a2.value; 9 !== b2.node.nodeType; ) if (b2 = x2(f2, b2), null === b2) throw Error("FODC0001: the root node of the target node is not a document node.");
      b2 = Dq(f2, b2, (k2) => {
        if (1 !== k2.node.nodeType) return false;
        k2 = fb(f2, k2, "id");
        if (!k2 || !h2[k2]) return false;
        h2[k2] = false;
        return true;
      });
      return w2.create(b2.map((k2) => rb(k2)));
    }, Fq = (a2, b2, c2, d2, e2) => {
      a2 = e2.first();
      if (!a2) throw lc("The context is absent, it needs to be present to use idref function.");
      if (!v2(a2.type, 53)) throw mc("The context item is not a node, it needs to be node to use idref function.");
      const f2 = b2.h, h2 = d2.O().reduce((k2, l2) => {
        k2[l2.value] = true;
        return k2;
      }, /* @__PURE__ */ Object.create(null));
      for (b2 = a2.value; 9 !== b2.node.nodeType; ) if (b2 = x2(f2, b2), null === b2) throw Error("FODC0001: the root node of the context node is not a document node.");
      b2 = Dq(f2, b2, (k2) => 1 !== k2.node.nodeType ? false : (k2 = fb(f2, k2, "idref")) ? k2.split(/\s+/).some((l2) => h2[l2]) : false);
      return w2.create(b2.map((k2) => rb(k2)));
    };
    function Gq(a2) {
      switch (typeof a2) {
        case "object":
          return Array.isArray(a2) ? w2.m(new pb(a2.map((b2) => Ra(Gq(b2))))) : null === a2 ? w2.empty() : w2.m(new ub(Object.keys(a2).map((b2) => ({ key: g2(b2, 1), value: Ra(Gq(a2[b2])) }))));
        case "number":
          return w2.m(g2(a2, 3));
        case "string":
          return w2.m(g2(a2, 1));
        case "boolean":
          return a2 ? w2.aa() : w2.T();
        default:
          throw Error("Unexpected type in JSON parse");
      }
    }
    const Hq = (a2, b2, c2, d2, e2) => {
      const f2 = w2.m(g2("duplicates", 1));
      a2 = tb(a2, b2, c2, e2, f2);
      const h2 = a2.F() ? "use-first" : a2.first().value;
      return d2.N((k2) => w2.m(new ub(k2.reduce((l2, n2) => {
        n2.h.forEach((t2) => {
          const u2 = l2.findIndex((z2) => sb(z2.key, t2.key));
          if (0 <= u2) switch (h2) {
            case "reject":
              throw Error("FOJS0003: Duplicate encountered when merging maps.");
            case "use-last":
              l2.splice(u2, 1, t2);
              return;
            case "combine":
              l2.splice(u2, 1, { key: t2.key, value: Ra(w2.create(l2[u2].value().O().concat(t2.value().O()))) });
              return;
            default:
              return;
          }
          l2.push(t2);
        });
        return l2;
      }, []))));
    };
    function Iq(a2, b2, c2) {
      let d2 = 1;
      const e2 = a2.value;
      a2 = a2.Pa(true);
      let f2 = null;
      const h2 = Math.max(b2 - 1, 0);
      -1 !== a2 && (f2 = Math.max(0, (null === c2 ? a2 : Math.max(0, Math.min(a2, c2 + (b2 - 1)))) - h2));
      return w2.create({ next: (k2) => {
        for (; d2 < b2; ) e2.next(k2), d2++;
        if (null !== c2 && d2 >= b2 + c2) return p2;
        k2 = e2.next(k2);
        d2++;
        return k2;
      } }, f2);
    }
    function Jq(a2) {
      return a2.map((b2) => v2(b2.type, 19) ? jd(b2, 3) : b2);
    }
    function Kq(a2) {
      a2 = Jq(a2);
      if (a2.some((b2) => Number.isNaN(b2.value))) return [g2(NaN, 3)];
      a2 = Ii(a2);
      if (!a2) throw Error("FORG0006: Incompatible types to be converted to a common type");
      return a2;
    }
    const Lq = (a2, b2, c2, d2, e2, f2) => A2([e2, f2], ([h2, k2]) => {
      if (Infinity === h2.value) return w2.empty();
      if (-Infinity === h2.value) return k2 && Infinity === k2.value ? w2.empty() : d2;
      if (k2) {
        if (isNaN(k2.value)) return w2.empty();
        Infinity === k2.value && (k2 = null);
      }
      return isNaN(h2.value) ? w2.empty() : Iq(d2, Math.round(h2.value), k2 ? Math.round(k2.value) : null);
    }), Mq = (a2, b2, c2, d2, e2) => {
      if (d2.F()) return e2;
      a2 = Jq(d2.O());
      a2 = Ii(a2);
      if (!a2) throw Error("FORG0006: Incompatible types to be converted to a common type");
      if (!a2.every((f2) => v2(f2.type, 2))) throw Error("FORG0006: items passed to fn:sum are not all numeric.");
      b2 = a2.reduce((f2, h2) => f2 + h2.value, 0);
      return a2.every((f2) => v2(f2.type, 5)) ? w2.m(g2(b2, 5)) : a2.every((f2) => v2(f2.type, 3)) ? w2.m(g2(b2, 3)) : a2.every((f2) => v2(f2.type, 4)) ? w2.m(g2(b2, 4)) : w2.m(g2(b2, 6));
    };
    var Nq = [].concat(Mf, [{ namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "boolean", j: [{ type: 59, g: 2 }], i: { type: 0, g: 3 }, callFunction: (a2, b2, c2, d2) => d2.fa() ? w2.aa() : w2.T() }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "true", j: [], i: { type: 0, g: 3 }, callFunction: () => w2.aa() }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "not", j: [{ type: 59, g: 2 }], i: { type: 0, g: 3 }, callFunction: (a2, b2, c2, d2) => false === d2.fa() ? w2.aa() : w2.T() }, {
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      localName: "false",
      j: [],
      i: { type: 0, g: 3 },
      callFunction: () => w2.T()
    }], [{ namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "last", j: [], i: { type: 5, g: 3 }, callFunction: (a2) => {
      if (null === a2.M) throw lc("The fn:last() function depends on dynamic context, which is absent.");
      let b2 = false;
      return w2.create({ next: () => {
        if (b2) return p2;
        const c2 = a2.ta.Pa();
        b2 = true;
        return q2(g2(c2, 5));
      } }, 1);
    } }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "position", j: [], i: { type: 5, g: 3 }, callFunction: (a2) => {
      if (null === a2.M) throw lc("The fn:position() function depends on dynamic context, which is absent.");
      return w2.m(g2(a2.Aa + 1, 5));
    } }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "current-dateTime", j: [], i: { type: 10, g: 3 }, callFunction: (a2) => w2.m(g2(ec(a2), 10)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "current-date", j: [], i: { type: 7, g: 3 }, callFunction: (a2) => w2.m(g2(Lb(ec(a2), 7), 7)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "current-time", j: [], i: { type: 8, g: 3 }, callFunction: (a2) => w2.m(g2(Lb(ec(a2), 8), 8)) }, {
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      localName: "implicit-timezone",
      j: [],
      i: { type: 17, g: 3 },
      callFunction: (a2) => w2.m(g2(fc(a2), 17))
    }], Nf, Vf, bg, [{ namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "years-from-duration", j: [{ type: 18, g: 0 }], i: { type: 5, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.F() ? d2 : w2.m(g2(d2.first().value.bb(), 5)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "months-from-duration", j: [{ type: 18, g: 0 }], i: { type: 5, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.F() ? d2 : w2.m(g2(d2.first().value.ab(), 5)) }, {
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      localName: "days-from-duration",
      j: [{ type: 18, g: 0 }],
      i: { type: 5, g: 0 },
      callFunction: (a2, b2, c2, d2) => d2.F() ? d2 : w2.m(g2(d2.first().value.$a(), 5))
    }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "hours-from-duration", j: [{ type: 18, g: 0 }], i: { type: 5, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.F() ? d2 : w2.m(g2(d2.first().value.getHours(), 5)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "minutes-from-duration", j: [{ type: 18, g: 0 }], i: { type: 5, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.F() ? d2 : w2.m(g2(d2.first().value.getMinutes(), 5)) }, {
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      localName: "seconds-from-duration",
      j: [{ type: 18, g: 0 }],
      i: { type: 4, g: 0 },
      callFunction: (a2, b2, c2, d2) => d2.F() ? d2 : w2.m(g2(d2.first().value.getSeconds(), 4))
    }], dg, [{ namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "id", j: [{ type: 1, g: 2 }, { type: 53, g: 3 }], i: { type: 54, g: 2 }, callFunction: Eq }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "id", j: [{ type: 1, g: 2 }], i: { type: 54, g: 2 }, callFunction(a2, b2, c2, d2) {
      return Eq(a2, b2, c2, d2, w2.m(a2.M));
    } }, {
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      localName: "idref",
      j: [{ type: 1, g: 2 }, { type: 53, g: 3 }],
      i: { type: 53, g: 2 },
      callFunction: Fq
    }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "idref", j: [{ type: 1, g: 2 }], i: { type: 53, g: 2 }, callFunction(a2, b2, c2, d2) {
      return Fq(a2, b2, c2, d2, w2.m(a2.M));
    } }], [{ namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "parse-json", j: [{ type: 1, g: 3 }], i: { type: 59, g: 0 }, callFunction: (a2, b2, c2, d2) => {
      let e2;
      try {
        e2 = JSON.parse(d2.first().value);
      } catch (f2) {
        throw Error("FOJS0001: parsed JSON string contains illegal JSON.");
      }
      return Gq(e2);
    } }], [{
      namespaceURI: "http://www.w3.org/2005/xpath-functions/map",
      localName: "contains",
      j: [{ type: 61, g: 3 }, { type: 46, g: 3 }],
      i: { type: 0, g: 3 },
      callFunction: (a2, b2, c2, d2, e2) => A2([d2, e2], ([f2, h2]) => f2.h.some((k2) => sb(k2.key, h2)) ? w2.aa() : w2.T())
    }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/map", localName: "entry", j: [{ type: 46, g: 3 }, { type: 59, g: 2 }], i: { type: 61, g: 3 }, callFunction: (a2, b2, c2, d2, e2) => d2.map((f2) => new ub([{ key: f2, value: Ra(e2) }])) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/map", localName: "for-each", j: [{ type: 61, g: 3 }, { type: 59, g: 2 }], i: { type: 59, g: 2 }, callFunction: (a2, b2, c2, d2, e2) => A2([
      d2,
      e2
    ], ([f2, h2]) => jc(f2.h.map((k2) => h2.value.call(void 0, a2, b2, c2, w2.m(k2.key), k2.value())))) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/map", localName: "get", j: [{ type: 61, g: 3 }, { type: 46, g: 3 }], i: { type: 59, g: 2 }, callFunction: tb }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/map", localName: "keys", j: [{ type: 61, g: 3 }], i: { type: 46, g: 2 }, callFunction: (a2, b2, c2, d2) => A2([d2], ([e2]) => w2.create(e2.h.map((f2) => f2.key))) }, {
      namespaceURI: "http://www.w3.org/2005/xpath-functions/map",
      localName: "merge",
      j: [{ type: 61, g: 2 }, { type: 61, g: 3 }],
      i: { type: 61, g: 3 },
      callFunction: Hq
    }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/map", localName: "merge", j: [{ type: 61, g: 2 }], i: { type: 61, g: 3 }, callFunction(a2, b2, c2, d2) {
      return Hq(a2, b2, c2, d2, w2.m(new ub([{ key: g2("duplicates", 1), value: () => w2.m(g2("use-first", 1)) }])));
    } }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/map", localName: "put", j: [{ type: 61, g: 3 }, { type: 46, g: 3 }, { type: 59, g: 2 }], i: { type: 61, g: 3 }, callFunction: (a2, b2, c2, d2, e2, f2) => A2([d2, e2], ([h2, k2]) => {
      h2 = h2.h.concat();
      const l2 = h2.findIndex((n2) => sb(n2.key, k2));
      0 <= l2 ? h2.splice(
        l2,
        1,
        { key: k2, value: Ra(f2) }
      ) : h2.push({ key: k2, value: Ra(f2) });
      return w2.m(new ub(h2));
    }) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/map", localName: "remove", j: [{ type: 61, g: 3 }, { type: 46, g: 2 }], i: { type: 61, g: 3 }, callFunction: (a2, b2, c2, d2, e2) => A2([d2], ([f2]) => {
      const h2 = f2.h.concat();
      return e2.N((k2) => {
        k2.forEach((l2) => {
          const n2 = h2.findIndex((t2) => sb(t2.key, l2));
          0 <= n2 && h2.splice(n2, 1);
        });
        return w2.m(new ub(h2));
      });
    }) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/map", localName: "size", j: [{ type: 61, g: 3 }], i: { type: 5, g: 3 }, callFunction: (a2, b2, c2, d2) => d2.map((e2) => g2(e2.h.length, 5)) }], [{ namespaceURI: "http://www.w3.org/2005/xpath-functions/math", localName: "pi", j: [], i: { type: 3, g: 3 }, callFunction: () => w2.m(g2(Math.PI, 3)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/math", localName: "exp", j: [{ type: 3, g: 0 }], i: { type: 3, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.map((e2) => g2(Math.pow(Math.E, e2.value), 3)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/math", localName: "exp10", j: [{ type: 3, g: 0 }], i: { type: 3, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.map((e2) => g2(
      Math.pow(10, e2.value),
      3
    )) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/math", localName: "log", j: [{ type: 3, g: 0 }], i: { type: 3, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.map((e2) => g2(Math.log(e2.value), 3)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/math", localName: "log10", j: [{ type: 3, g: 0 }], i: { type: 3, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.map((e2) => g2(Math.log10(e2.value), 3)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/math", localName: "pow", j: [{ type: 3, g: 0 }, { type: 2, g: 3 }], i: { type: 3, g: 0 }, callFunction: (a2, b2, c2, d2, e2) => e2.N(([f2]) => d2.map((h2) => 1 !== Math.abs(h2.value) || Number.isFinite(f2.value) ? g2(Math.pow(h2.value, f2.value), 3) : g2(1, 3))) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/math", localName: "sqrt", j: [{ type: 3, g: 0 }], i: { type: 3, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.map((e2) => g2(Math.sqrt(e2.value), 3)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/math", localName: "sin", j: [{ type: 3, g: 0 }], i: { type: 3, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.map((e2) => g2(Math.sin(e2.value), 3)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/math", localName: "cos", j: [{
      type: 3,
      g: 0
    }], i: { type: 3, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.map((e2) => g2(Math.cos(e2.value), 3)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/math", localName: "tan", j: [{ type: 3, g: 0 }], i: { type: 3, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.map((e2) => g2(Math.tan(e2.value), 3)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/math", localName: "asin", j: [{ type: 3, g: 0 }], i: { type: 3, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.map((e2) => g2(Math.asin(e2.value), 3)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/math", localName: "acos", j: [{
      type: 3,
      g: 0
    }], i: { type: 3, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.map((e2) => g2(Math.acos(e2.value), 3)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/math", localName: "atan", j: [{ type: 3, g: 0 }], i: { type: 3, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.map((e2) => g2(Math.atan(e2.value), 3)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions/math", localName: "atan2", j: [{ type: 3, g: 0 }, { type: 3, g: 3 }], i: { type: 3, g: 0 }, callFunction: (a2, b2, c2, d2, e2) => e2.N(([f2]) => d2.map((h2) => g2(Math.atan2(h2.value, f2.value), 3))) }], ze, Zd, [{
      namespaceURI: "http://fontoxpath/operators",
      localName: "to",
      j: [{ type: 5, g: 0 }, { type: 5, g: 0 }],
      i: { type: 5, g: 2 },
      callFunction: (a2, b2, c2, d2, e2) => {
        a2 = d2.first();
        e2 = e2.first();
        if (null === a2 || null === e2) return w2.empty();
        let f2 = a2.value;
        e2 = e2.value;
        return f2 > e2 ? w2.empty() : w2.create({ next: () => q2(g2(f2++, 5)) }, e2 - f2 + 1);
      }
    }], [{ namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "QName", j: [{ type: 1, g: 0 }, { type: 1, g: 3 }], i: { type: 23, g: 3 }, callFunction: (a2, b2, c2, d2, e2) => A2([d2, e2], ([f2, h2]) => {
      h2 = h2.value;
      if (!tc(h2, 23)) throw Error("FOCA0002: The provided QName is invalid.");
      f2 = f2 ? f2.value || null : null;
      if (null === f2 && h2.includes(":")) throw Error("FOCA0002: The URI of a QName may not be empty if a prefix is provided.");
      if (d2.F()) return w2.m(g2(new Sa("", null, h2), 23));
      if (!h2.includes(":")) return w2.m(g2(new Sa("", f2, h2), 23));
      const [k2, l2] = h2.split(":");
      return w2.m(g2(new Sa(k2, f2, l2), 23));
    }) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "prefix-from-QName", j: [{ type: 23, g: 0 }], i: { type: 24, g: 0 }, callFunction: (a2, b2, c2, d2) => A2([d2], ([e2]) => {
      if (null === e2) return w2.empty();
      e2 = e2.value;
      return e2.prefix ? w2.m(g2(e2.prefix, 24)) : w2.empty();
    }) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "local-name-from-QName", j: [{ type: 23, g: 0 }], i: { type: 24, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.map((e2) => g2(e2.value.localName, 24)) }, { namespaceURI: "http://www.w3.org/2005/xpath-functions", localName: "namespace-uri-from-QName", j: [{ type: 23, g: 0 }], i: { type: 20, g: 0 }, callFunction: (a2, b2, c2, d2) => d2.map((e2) => g2(e2.value.namespaceURI || "", 20)) }], [{
      j: [{ type: 59, g: 2 }],
      callFunction: (a2, b2, c2, d2) => d2.X({ empty: () => w2.aa(), multiple: () => w2.T(), m: () => w2.T() }),
      localName: "empty",
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      i: { type: 0, g: 3 }
    }, { j: [{ type: 59, g: 2 }], callFunction: (a2, b2, c2, d2) => d2.X({ empty: () => w2.T(), multiple: () => w2.aa(), m: () => w2.aa() }), localName: "exists", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 0, g: 3 } }, { j: [{ type: 59, g: 2 }], callFunction: (a2, b2, c2, d2) => Iq(d2, 1, 1), localName: "head", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 59, g: 0 } }, {
      j: [{ type: 59, g: 2 }],
      callFunction: (a2, b2, c2, d2) => Iq(d2, 2, null),
      localName: "tail",
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      i: { type: 59, g: 2 }
    }, { j: [{ type: 59, g: 2 }, { type: 5, g: 3 }, { type: 59, g: 2 }], callFunction: (a2, b2, c2, d2, e2, f2) => {
      if (d2.F()) return f2;
      if (f2.F()) return d2;
      a2 = d2.O();
      e2 = e2.first().value - 1;
      0 > e2 ? e2 = 0 : e2 > a2.length && (e2 = a2.length);
      b2 = a2.slice(e2);
      return w2.create(a2.slice(0, e2).concat(f2.O(), b2));
    }, localName: "insert-before", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 59, g: 2 } }, {
      j: [{ type: 59, g: 2 }, { type: 5, g: 3 }],
      callFunction: (a2, b2, c2, d2, e2) => {
        a2 = e2.first().value;
        d2 = d2.O();
        if (!d2.length || 1 > a2 || a2 > d2.length) return w2.create(d2);
        d2.splice(a2 - 1, 1);
        return w2.create(d2);
      },
      localName: "remove",
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      i: { type: 59, g: 2 }
    }, { j: [{ type: 59, g: 2 }], callFunction: (a2, b2, c2, d2) => d2.N((e2) => w2.create(e2.reverse())), localName: "reverse", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 59, g: 2 } }, { j: [{ type: 59, g: 2 }, { type: 3, g: 3 }], callFunction: (a2, b2, c2, d2, e2) => Lq(a2, b2, c2, d2, e2, w2.empty()), localName: "subsequence", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 59, g: 2 } }, {
      j: [{ type: 59, g: 2 }, { type: 3, g: 3 }, { type: 3, g: 3 }],
      callFunction: Lq,
      localName: "subsequence",
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      i: { type: 59, g: 2 }
    }, { j: [{ type: 59, g: 2 }], callFunction: (a2, b2, c2, d2) => d2, localName: "unordered", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 59, g: 2 } }, { j: [{ type: 46, g: 2 }], callFunction: (a2, b2, c2, d2) => {
      const e2 = qc(d2, b2).O();
      return w2.create(e2).filter((f2, h2) => e2.slice(0, h2).every((k2) => !Ce(f2, k2)));
    }, localName: "distinct-values", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 46, g: 2 } }, { j: [{ type: 46, g: 2 }, { type: 1, g: 3 }], callFunction() {
      throw Error("FOCH0002: No collations are supported");
    }, localName: "distinct-values", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 46, g: 2 } }, { j: [{ type: 46, g: 2 }, { type: 46, g: 3 }], callFunction: (a2, b2, c2, d2, e2) => e2.N(([f2]) => qc(d2, b2).map((h2, k2) => oi("eqOp", h2.type, f2.type)(h2, f2, a2) ? g2(k2 + 1, 5) : g2(-1, 5)).filter((h2) => -1 !== h2.value)), localName: "index-of", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 5, g: 2 } }, {
      j: [{ type: 46, g: 2 }, { type: 46, g: 3 }, { type: 1, g: 3 }],
      callFunction() {
        throw Error("FOCH0002: No collations are supported");
      },
      localName: "index-of",
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      i: { type: 5, g: 2 }
    }, { j: [{ type: 59, g: 2 }, { type: 59, g: 2 }], callFunction: (a2, b2, c2, d2, e2) => {
      let f2 = false;
      const h2 = Fe(a2, b2, c2, d2, e2);
      return w2.create({ next: () => {
        if (f2) return p2;
        const k2 = h2.next(0);
        if (k2.done) return k2;
        f2 = true;
        return q2(g2(k2.value, 0));
      } });
    }, localName: "deep-equal", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 0, g: 3 } }, {
      j: [{ type: 59, g: 2 }, { type: 59, g: 2 }, { type: 1, g: 3 }],
      callFunction() {
        throw Error("FOCH0002: No collations are supported");
      },
      localName: "deep-equal",
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      i: { type: 0, g: 3 }
    }, { j: [{ type: 59, g: 2 }], callFunction: (a2, b2, c2, d2) => {
      let e2 = false;
      return w2.create({ next: () => {
        if (e2) return p2;
        const f2 = d2.Pa();
        e2 = true;
        return q2(g2(f2, 5));
      } });
    }, localName: "count", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 5, g: 3 } }, { j: [{ type: 46, g: 2 }], callFunction: (a2, b2, c2, d2) => {
      if (d2.F()) return d2;
      a2 = Jq(d2.O());
      a2 = Ii(a2);
      if (!a2) throw Error("FORG0006: Incompatible types to be converted to a common type");
      if (!a2.every((e2) => v2(e2.type, 2))) throw Error("FORG0006: items passed to fn:avg are not all numeric.");
      b2 = a2.reduce((e2, f2) => e2 + f2.value, 0) / a2.length;
      return a2.every((e2) => v2(e2.type, 5) || v2(e2.type, 3)) ? w2.m(g2(b2, 3)) : a2.every((e2) => v2(e2.type, 4)) ? w2.m(g2(b2, 4)) : w2.m(g2(b2, 6));
    }, localName: "avg", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 46, g: 0 } }, { j: [{ type: 46, g: 2 }], callFunction: (a2, b2, c2, d2) => {
      if (d2.F()) return d2;
      a2 = Kq(d2.O());
      return w2.m(a2.reduce((e2, f2) => e2.value < f2.value ? f2 : e2));
    }, localName: "max", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 46, g: 0 } }, { j: [{ type: 46, g: 2 }, { type: 1, g: 3 }], callFunction() {
      throw Error("FOCH0002: No collations are supported");
    }, localName: "max", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 46, g: 0 } }, { j: [{ type: 46, g: 2 }], callFunction: (a2, b2, c2, d2) => {
      if (d2.F()) return d2;
      a2 = Kq(d2.O());
      return w2.m(a2.reduce((e2, f2) => e2.value > f2.value ? f2 : e2));
    }, localName: "min", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 46, g: 0 } }, { j: [{ type: 46, g: 2 }, { type: 1, g: 3 }], callFunction() {
      throw Error("FOCH0002: No collations are supported");
    }, localName: "min", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 46, g: 0 } }, { j: [{
      type: 46,
      g: 2
    }], callFunction: (a2, b2, c2, d2) => Mq(a2, b2, c2, d2, w2.m(g2(0, 5))), localName: "sum", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 46, g: 3 } }, { j: [{ type: 46, g: 2 }, { type: 46, g: 0 }], callFunction: Mq, localName: "sum", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 46, g: 0 } }, {
      j: [{ type: 59, g: 2 }],
      callFunction: (a2, b2, c2, d2) => {
        if (!d2.F() && !d2.oa()) throw Error("FORG0003: The argument passed to fn:zero-or-one contained more than one item.");
        return d2;
      },
      localName: "zero-or-one",
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      i: { type: 59, g: 0 }
    }, { j: [{ type: 59, g: 2 }], callFunction: (a2, b2, c2, d2) => {
      if (d2.F()) throw Error("FORG0004: The argument passed to fn:one-or-more was empty.");
      return d2;
    }, localName: "one-or-more", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 59, g: 1 } }, { j: [{ type: 59, g: 2 }], callFunction: (a2, b2, c2, d2) => {
      if (!d2.oa()) throw Error("FORG0005: The argument passed to fn:exactly-one is empty or contained more than one item.");
      return d2;
    }, localName: "exactly-one", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: {
      type: 59,
      g: 3
    } }, {
      j: [{ type: 59, g: 2 }, { type: 60, g: 3 }],
      callFunction: (a2, b2, c2, d2, e2) => {
        if (d2.F()) return d2;
        const f2 = e2.first(), h2 = f2.o;
        if (1 !== h2.length) throw Error("XPTY0004: signature of function passed to fn:filter is incompatible.");
        return d2.filter((k2) => {
          k2 = zd(h2[0], w2.m(k2), b2, "fn:filter", false);
          k2 = f2.value.call(void 0, a2, b2, c2, k2);
          if (!k2.oa() || !v2(k2.first().type, 0)) throw Error("XPTY0004: signature of function passed to fn:filter is incompatible.");
          return k2.first().value;
        });
      },
      localName: "filter",
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      i: { type: 59, g: 2 }
    }, {
      j: [{ type: 59, g: 2 }, { type: 60, g: 3 }],
      callFunction: (a2, b2, c2, d2, e2) => {
        if (d2.F()) return d2;
        const f2 = e2.first(), h2 = f2.o;
        if (1 !== h2.length) throw Error("XPTY0004: signature of function passed to fn:for-each is incompatible.");
        const k2 = d2.value;
        let l2;
        return w2.create({ next: (n2) => {
          for (; ; ) {
            if (!l2) {
              var t2 = k2.next(0);
              if (t2.done) return t2;
              t2 = zd(h2[0], w2.m(t2.value), b2, "fn:for-each", false);
              l2 = f2.value.call(void 0, a2, b2, c2, t2).value;
            }
            t2 = l2.next(n2);
            if (!t2.done) return t2;
            l2 = null;
          }
        } });
      },
      localName: "for-each",
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      i: { type: 59, g: 2 }
    }, { j: [{ type: 59, g: 2 }, { type: 59, g: 2 }, { type: 60, g: 3 }], callFunction: (a2, b2, c2, d2, e2, f2) => {
      if (d2.F()) return d2;
      const h2 = f2.first(), k2 = h2.o;
      if (2 !== k2.length) throw Error("XPTY0004: signature of function passed to fn:fold-left is incompatible.");
      return d2.N((l2) => l2.reduce((n2, t2) => {
        n2 = zd(k2[0], n2, b2, "fn:fold-left", false);
        t2 = zd(k2[1], w2.m(t2), b2, "fn:fold-left", false);
        return h2.value.call(void 0, a2, b2, c2, n2, t2);
      }, e2));
    }, localName: "fold-left", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 59, g: 2 } }, { j: [{ type: 59, g: 2 }, {
      type: 59,
      g: 2
    }, { type: 60, g: 3 }], callFunction: (a2, b2, c2, d2, e2, f2) => {
      if (d2.F()) return d2;
      const h2 = f2.first(), k2 = h2.o;
      if (2 !== k2.length) throw Error("XPTY0004: signature of function passed to fn:fold-right is incompatible.");
      return d2.N((l2) => l2.reduceRight((n2, t2) => {
        n2 = zd(k2[0], n2, b2, "fn:fold-right", false);
        t2 = zd(k2[1], w2.m(t2), b2, "fn:fold-right", false);
        return h2.value.call(void 0, a2, b2, c2, t2, n2);
      }, e2));
    }, localName: "fold-right", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 59, g: 2 } }, { j: [{ type: 59, g: 2 }], callFunction: (a2, b2, c2, d2) => {
      if (!b2.Ua) throw Error("serialize() called but no xmlSerializer set in execution parameters.");
      a2 = d2.O();
      if (!a2.every((e2) => v2(e2.type, 53))) throw Error("Expected argument to fn:serialize to resolve to a sequence of Nodes.");
      return w2.m(g2(a2.map((e2) => b2.Ua.serializeToString($f(e2.value, b2, false))).join(""), 1));
    }, localName: "serialize", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 1, g: 3 } }], ke, [{
      j: [{ type: 59, g: 3 }, { type: 61, g: 3 }],
      callFunction: (a2, b2, c2, d2, e2) => {
        let f2, h2;
        return w2.create({ next: () => {
          f2 || ({ ic: f2, ac: h2 } = Cq(d2, e2, c2, b2));
          try {
            return f2.next(0);
          } catch (k2) {
            gg(h2, k2);
          }
        } });
      },
      localName: "evaluate",
      namespaceURI: "http://fontoxml.com/fontoxpath",
      i: { type: 59, g: 2 }
    }, { j: [], callFunction: () => w2.m(g2(VERSION, 1)), localName: "version", namespaceURI: "http://fontoxml.com/fontoxpath", i: { type: 1, g: 3 } }], [{
      j: [{ type: 23, g: 3 }, { type: 5, g: 3 }],
      callFunction: (a2, b2, c2, d2, e2) => A2([d2, e2], ([f2, h2]) => {
        const k2 = c2.va(f2.value.namespaceURI, f2.value.localName, h2.value);
        if (null === k2) return w2.empty();
        f2 = new Va({ j: k2.j, arity: h2.value, localName: f2.value.localName, namespaceURI: f2.value.namespaceURI, i: k2.i, value: k2.callFunction });
        return w2.m(f2);
      }),
      localName: "function-lookup",
      namespaceURI: "http://www.w3.org/2005/xpath-functions",
      i: { g: 0, type: 60 }
    }, { j: [{ type: 60, g: 3 }], callFunction: (a2, b2, c2, d2) => A2([d2], ([e2]) => e2.Ya() ? w2.empty() : w2.m(g2(new Sa("", e2.l, e2.D), 23))), localName: "function-name", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 23, g: 0 } }, { j: [{ type: 60, g: 3 }], callFunction: (a2, b2, c2, d2) => A2([d2], ([e2]) => w2.m(g2(e2.v, 5))), localName: "function-arity", namespaceURI: "http://www.w3.org/2005/xpath-functions", i: { type: 5, g: 3 } }]);
    class Oq {
      constructor(a2) {
        this.h = a2;
      }
      createAttributeNS(a2, b2) {
        return this.h.createAttributeNS(a2, b2);
      }
      createCDATASection(a2) {
        return this.h.createCDATASection(a2);
      }
      createComment(a2) {
        return this.h.createComment(a2);
      }
      createDocument() {
        return this.h.createDocument();
      }
      createElementNS(a2, b2) {
        return this.h.createElementNS(a2, b2);
      }
      createProcessingInstruction(a2, b2) {
        return this.h.createProcessingInstruction(a2, b2);
      }
      createTextNode(a2) {
        return this.h.createTextNode(a2);
      }
    }
    var Pq = Symbol("IS_XPATH_VALUE_SYMBOL");
    function Qq(a2) {
      return (b2, c2) => {
        b2 = Vb(new nb(null === c2 ? new Za() : c2), b2, Ja(a2));
        return { [Pq]: true, zb: b2 };
      };
    }
    Nq.forEach((a2) => {
      ng(a2.namespaceURI, a2.localName, a2.j, a2.i, a2.callFunction);
    });
    function Rq(a2) {
      return a2 && "object" === typeof a2 && "lookupNamespaceURI" in a2 ? (b2) => a2.lookupNamespaceURI(b2 || null) : () => null;
    }
    function Sq(a2) {
      return ({ prefix: b2, localName: c2 }) => b2 ? null : { namespaceURI: a2, localName: c2 };
    }
    function Tq(a2, b2, c2, d2, e2, f2) {
      if (null === d2 || void 0 === d2) d2 = d2 || {};
      const h2 = e2 ? { jb: e2.logger || { trace: console.log.bind(console) }, Ma: e2.documentWriter, kb: e2.moduleImports, Cb: e2.namespaceResolver, bc: e2.functionNameResolver, Ja: e2.nodesFactory, Ua: e2.xmlSerializer } : { jb: { trace: console.log.bind(console) }, kb: {}, Cb: null, Ja: null, Ma: null, Ua: null }, k2 = new nb(null === c2 ? new Za() : c2);
      c2 = h2.kb || /* @__PURE__ */ Object.create(null);
      var l2 = void 0 === e2.defaultFunctionNamespaceURI ? "http://www.w3.org/2005/xpath-functions" : e2.defaultFunctionNamespaceURI;
      const n2 = Aq(
        a2,
        f2,
        h2.Cb || Rq(b2),
        d2,
        c2,
        l2,
        h2.bc || Sq(l2)
      );
      a2 = b2 ? Wb(k2, b2) : w2.empty();
      b2 = !h2.Ja && f2.Z ? new Ze(b2) : new Oq(h2.Ja);
      c2 = h2.Ma ? new bb(h2.Ma) : ab;
      l2 = h2.Ua;
      const t2 = Object.keys(d2).reduce((y2, G2) => {
        const N2 = d2[G2];
        y2[`Q{}${G2}[0]`] = N2 && "object" === typeof N2 && Pq in N2 ? () => w2.create(N2.zb) : () => Wb(k2, d2[G2]);
        return y2;
      }, /* @__PURE__ */ Object.create(null));
      let u2;
      for (const y2 of Object.keys(n2.ga.Ea)) t2[y2] || (t2[y2] = () => (0, n2.ga.Ea[y2])(u2, z2));
      u2 = new cc({ M: a2.first(), Aa: 0, ta: a2, ra: t2 });
      const z2 = new ic(f2.debug, f2.Ha, k2, b2, c2, e2.currentContext, /* @__PURE__ */ new Map(), h2.jb, l2);
      return { tb: u2, ub: z2, ba: n2.ba };
    }
    function Uq(a2, b2) {
      const c2 = {};
      let d2 = 0, e2 = false, f2 = null;
      return { next: () => {
        if (e2) return p2;
        for (; d2 < a2.h.length; ) {
          const k2 = a2.h[d2].key.value;
          if (!f2) {
            const l2 = a2.h[d2];
            var h2 = l2.value().X({ default: (n2) => n2, multiple: () => {
              throw Error(`Serialization error: The value of an entry in a map is expected to be a single item or an empty sequence. Use arrays when putting multiple values in a map. The value of the key ${l2.key.value} holds multiple items`);
            } }).first();
            if (null === h2) {
              c2[k2] = null;
              d2++;
              continue;
            }
            f2 = Vq(h2, b2);
          }
          h2 = f2.next(0);
          f2 = null;
          c2[k2] = h2.value;
          d2++;
        }
        e2 = true;
        return q2(c2);
      } };
    }
    function Wq(a2, b2) {
      const c2 = [];
      let d2 = 0, e2 = false, f2 = null;
      return { next: () => {
        if (e2) return p2;
        for (; d2 < a2.h.length; ) {
          if (!f2) {
            var h2 = a2.h[d2]().X({ default: (k2) => k2, multiple: () => {
              throw Error("Serialization error: The value of an entry in an array is expected to be a single item or an empty sequence. Use nested arrays when putting multiple values in an array.");
            } }).first();
            if (null === h2) {
              c2[d2++] = null;
              continue;
            }
            f2 = Vq(h2, b2);
          }
          h2 = f2.next(0);
          f2 = null;
          c2[d2++] = h2.value;
        }
        e2 = true;
        return q2(c2);
      } };
    }
    function Vq(a2, b2) {
      if (v2(a2.type, 61)) return Uq(a2, b2);
      if (v2(a2.type, 62)) return Wq(a2, b2);
      if (v2(a2.type, 23)) {
        const c2 = a2.value;
        return { next: () => q2(`Q{${c2.namespaceURI || ""}}${c2.localName}`) };
      }
      switch (a2.type) {
        case 7:
        case 8:
        case 9:
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
          const c2 = a2.value;
          return { next: () => q2(Mb(c2)) };
        case 47:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
        case 58:
          const d2 = a2.value;
          return { next: () => q2($f(d2, b2, false)) };
        default:
          return { next: () => q2(a2.value) };
      }
    }
    var Xq = { ANY: 0, NUMBER: 1, STRING: 2, BOOLEAN: 3, NODES: 7, FIRST_NODE: 9, STRINGS: 10, MAP: 11, ARRAY: 12, NUMBERS: 13, ALL_RESULTS: 14, ASYNC_ITERATOR: 99 };
    Xq[Xq.ANY] = "ANY";
    Xq[Xq.NUMBER] = "NUMBER";
    Xq[Xq.STRING] = "STRING";
    Xq[Xq.BOOLEAN] = "BOOLEAN";
    Xq[Xq.NODES] = "NODES";
    Xq[Xq.FIRST_NODE] = "FIRST_NODE";
    Xq[Xq.STRINGS] = "STRINGS";
    Xq[Xq.MAP] = "MAP";
    Xq[Xq.ARRAY] = "ARRAY";
    Xq[Xq.NUMBERS] = "NUMBERS";
    Xq[Xq.ALL_RESULTS] = "ALL_RESULTS";
    Xq[Xq.ASYNC_ITERATOR] = "ASYNC_ITERATOR";
    function Yq(a2, b2, c2, d2) {
      switch (c2) {
        case 3:
          return b2.fa();
        case 2:
          return b2 = qc(b2, d2).O(), b2.length ? b2.map((l2) => jd(l2, 1).value).join(" ") : "";
        case 10:
          return b2 = qc(b2, d2).O(), b2.length ? b2.map((l2) => l2.value + "") : [];
        case 1:
          return b2 = b2.first(), null !== b2 && v2(b2.type, 2) ? b2.value : NaN;
        case 9:
          b2 = b2.first();
          if (null === b2) return null;
          if (!v2(b2.type, 53)) throw Error("Expected XPath " + eg(a2) + " to resolve to Node. Got " + Da[b2.type]);
          return $f(b2.value, d2, false);
        case 7:
          b2 = b2.O();
          if (!b2.every((l2) => v2(l2.type, 53))) throw Error("Expected XPath " + eg(a2) + " to resolve to a sequence of Nodes.");
          return b2.map((l2) => $f(l2.value, d2, false));
        case 11:
          b2 = b2.O();
          if (1 !== b2.length) throw Error("Expected XPath " + eg(a2) + " to resolve to a single map.");
          b2 = b2[0];
          if (!v2(b2.type, 61)) throw Error("Expected XPath " + eg(a2) + " to resolve to a map");
          return Uq(b2, d2).next(0).value;
        case 12:
          b2 = b2.O();
          if (1 !== b2.length) throw Error("Expected XPath " + eg(a2) + " to resolve to a single array.");
          b2 = b2[0];
          if (!v2(b2.type, 62)) throw Error("Expected XPath " + eg(a2) + " to resolve to an array");
          return Wq(b2, d2).next(0).value;
        case 13:
          return b2.O().map((l2) => {
            if (!v2(
              l2.type,
              2
            )) throw Error("Expected XPath " + eg(a2) + " to resolve to numbers");
            return l2.value;
          });
        case 99:
          const e2 = b2.value;
          let f2 = null, h2 = false;
          const k2 = () => {
            for (; !h2; ) {
              if (!f2) {
                var l2 = e2.next(0);
                if (l2.done) {
                  h2 = true;
                  break;
                }
                f2 = Vq(l2.value, d2);
              }
              l2 = f2.next(0);
              f2 = null;
              return l2;
            }
            return Promise.resolve({ done: true, value: null });
          };
          return "asyncIterator" in Symbol ? { [Symbol.asyncIterator]() {
            return this;
          }, next: () => new Promise((l2) => l2(k2())).catch((l2) => {
            gg(a2, l2);
          }) } : { next: () => new Promise((l2) => l2(k2())) };
        case 14:
          return b2.O().map((l2) => Vq(l2, d2).next(0).value);
        default:
          return b2 = b2.O(), b2.every((l2) => v2(l2.type, 53) && !v2(l2.type, 47)) ? (b2 = b2.map((l2) => $f(l2.value, d2, false)), 1 === b2.length ? b2[0] : b2) : 1 === b2.length ? (b2 = b2[0], v2(b2.type, 62) ? Wq(b2, d2).next(0).value : v2(b2.type, 61) ? Uq(b2, d2).next(0).value : pc(b2, d2).first().value) : qc(w2.create(b2), d2).O().map((l2) => l2.value);
      }
    }
    let Zq = false, $q = null;
    var ar = { getPerformanceSummary() {
      const a2 = $q.getEntriesByType("measure").filter((b2) => b2.name.startsWith("XPath: "));
      return Array.from(a2.reduce((b2, c2) => {
        var d2 = c2.name.substring(7);
        b2.has(d2) ? (d2 = b2.get(d2), d2.times += 1, d2.totalDuration += c2.duration) : b2.set(d2, { xpath: d2, times: 1, totalDuration: c2.duration, average: 0 });
        return b2;
      }, /* @__PURE__ */ new Map()).values()).map((b2) => {
        b2.average = b2.totalDuration / b2.times;
        return b2;
      }).sort((b2, c2) => c2.totalDuration - b2.totalDuration);
    }, setPerformanceImplementation(a2) {
      $q = a2;
    }, startProfiling() {
      if (null === $q) throw Error("Performance API object must be set using `profiler.setPerformanceImplementation` before starting to profile");
      $q.clearMarks();
      $q.clearMeasures();
      Zq = true;
    }, stopProfiling() {
      Zq = false;
    } };
    let br = 0;
    var cr = { XPATH_3_1_LANGUAGE: "XPath3.1", XQUERY_3_1_LANGUAGE: "XQuery3.1", XQUERY_UPDATE_3_1_LANGUAGE: "XQueryUpdate3.1" };
    const dr = (a2, b2, c2, d2, e2, f2) => {
      e2 = e2 || 0;
      if (!a2 || "string" !== typeof a2 && !("nodeType" in a2)) throw new TypeError("Failed to execute 'evaluateXPath': xpathExpression must be a string or an element depicting an XQueryX DOM tree.");
      f2 = f2 || {};
      let h2, k2;
      try {
        const n2 = Tq(a2, b2, c2 || null, d2 || {}, f2, { sa: "XQueryUpdate3.1" === f2.language, Z: "XQuery3.1" === f2.language || "XQueryUpdate3.1" === f2.language, debug: !!f2.debug, Ha: !!f2.disableCache });
        var l2 = n2.tb;
        h2 = n2.ub;
        k2 = n2.ba;
      } catch (n2) {
        gg(a2, n2);
      }
      if (k2.I) throw Error("XUST0001: Updating expressions should be evaluated as updating expressions");
      if (3 === e2 && b2 && "object" === typeof b2 && "nodeType" in b2 && (c2 = k2.D(), b2 = Ya(b2), null !== c2 && !b2.includes(c2))) return false;
      try {
        b2 = a2;
        Zq && ("string" !== typeof b2 && (b2 = eg(b2)), $q.mark(`${b2}${0 === br ? "" : "@" + br}`), br++);
        const n2 = C2(k2, l2, h2), t2 = Yq(a2, n2, e2, h2);
        e2 = a2;
        Zq && ("string" !== typeof e2 && (e2 = eg(e2)), br--, l2 = `${e2}${0 === br ? "" : "@" + br}`, $q.measure(`XPath: ${e2}`, l2), $q.clearMarks(l2));
        return t2;
      } catch (n2) {
        gg(a2, n2);
      }
    };
    Object.assign(dr, { jc: 14, ANY_TYPE: 0, Lb: 12, Mb: 99, BOOLEAN_TYPE: 3, Ob: 9, Rb: 11, Tb: 7, Ub: 13, NUMBER_TYPE: 1, Vb: 10, STRING_TYPE: 2, kc: "XPath3.1", lc: "XQuery3.1", Yb: "XQueryUpdate3.1" });
    Object.assign(dr, { ALL_RESULTS_TYPE: 14, ANY_TYPE: 0, ARRAY_TYPE: 12, ASYNC_ITERATOR_TYPE: 99, BOOLEAN_TYPE: 3, FIRST_NODE_TYPE: 9, MAP_TYPE: 11, NODES_TYPE: 7, NUMBERS_TYPE: 13, NUMBER_TYPE: 1, STRINGS_TYPE: 10, STRING_TYPE: 2, XPATH_3_1_LANGUAGE: "XPath3.1", XQUERY_3_1_LANGUAGE: "XQuery3.1", XQUERY_UPDATE_3_1_LANGUAGE: "XQueryUpdate3.1" });
    function er(a2, b2, c2, d2, e2) {
      return dr(a2, b2, c2, d2, dr.Mb, e2);
    }
    function fr(a2, b2, c2, d2) {
      return { pendingUpdateList: a2.da.map((e2) => e2.h(d2)), xdmValue: Yq(b2, w2.create(a2.J), c2, d2) };
    }
    async function gr(a2, b2, c2, d2, e2) {
      e2 = e2 || {};
      Ok();
      let f2, h2;
      try {
        const n2 = Tq(a2, b2, c2 || null, d2 || {}, e2 || {}, { sa: true, Z: true, debug: !!e2.debug, Ha: !!e2.disableCache });
        var k2 = n2.tb;
        f2 = n2.ub;
        h2 = n2.ba;
      } catch (n2) {
        gg(a2, n2);
      }
      if (!h2.I) {
        k2 = [];
        a2 = er(a2, b2, c2, d2, Object.assign(Object.assign({}, e2), { language: "XQueryUpdate3.1" }));
        for (b2 = await a2.next(); !b2.done; b2 = await a2.next()) k2.push(b2.value);
        return Promise.resolve({ pendingUpdateList: [], xdmValue: k2 });
      }
      let l2;
      try {
        l2 = h2.s(k2, f2).next(0);
      } catch (n2) {
        gg(a2, n2);
      }
      return fr(l2.value, a2, e2.returnType, f2);
    }
    function hr(a2, b2, c2, d2, e2) {
      e2 = e2 || {};
      Ok();
      let f2, h2, k2;
      try {
        const n2 = Tq(a2, b2, c2 || null, d2 || {}, e2 || {}, { sa: true, Z: true, debug: !!e2.debug, Ha: !!e2.disableCache });
        f2 = n2.tb;
        h2 = n2.ub;
        k2 = n2.ba;
      } catch (n2) {
        gg(a2, n2);
      }
      if (!k2.I) return { pendingUpdateList: [], xdmValue: dr(a2, b2, c2, d2, e2.i, Object.assign(Object.assign({}, e2), { language: dr.Yb })) };
      let l2;
      try {
        l2 = k2.s(f2, h2).next(0);
      } catch (n2) {
        gg(a2, n2);
      }
      return fr(l2.value, a2, e2.returnType, h2);
    }
    function ir(a2, b2, c2, d2, e2) {
      return dr(a2, b2, c2, d2, dr.Lb, e2);
    }
    function jr(a2, b2, c2, d2, e2) {
      return dr(a2, b2, c2, d2, dr.BOOLEAN_TYPE, e2);
    }
    function kr(a2, b2, c2, d2, e2) {
      return dr(a2, b2, c2, d2, dr.Ob, e2);
    }
    function lr(a2, b2, c2, d2, e2) {
      return dr(a2, b2, c2, d2, dr.Rb, e2);
    }
    function mr(a2, b2, c2, d2, e2) {
      return dr(a2, b2, c2, d2, dr.Tb, e2);
    }
    function nr(a2, b2, c2, d2, e2) {
      return dr(a2, b2, c2, d2, dr.NUMBER_TYPE, e2);
    }
    function or(a2, b2, c2, d2, e2) {
      return dr(a2, b2, c2, d2, dr.Ub, e2);
    }
    function pr(a2, b2, c2, d2, e2) {
      return dr(a2, b2, c2, d2, dr.STRING_TYPE, e2);
    }
    function qr(a2, b2, c2, d2, e2) {
      return dr(a2, b2, c2, d2, dr.Vb, e2);
    }
    function rr(a2, b2, c2, d2) {
      b2 = new nb(b2 ? b2 : new Za());
      d2 = d2 ? new bb(d2) : ab;
      c2 = c2 ? c2 = new Oq(c2) : null;
      a2 = a2.map(Rj);
      kf(a2, b2, c2, d2);
    }
    function Y2(a2, b2, c2) {
      return { code: a2, ua: b2, H: c2, isAstAccepted: true };
    }
    function sr(a2) {
      return { isAstAccepted: false, reason: a2 };
    }
    function Z2(a2, b2) {
      return a2.isAstAccepted ? b2(a2) : a2;
    }
    function tr(a2, b2) {
      return a2.isAstAccepted ? b2(a2) : [a2, null];
    }
    function ur(a2, b2, c2) {
      return Z2(a2, (d2) => {
        switch (d2.ua.type) {
          case 0:
            return d2;
          case 1:
            return Z2(vr(c2, d2, "nodes"), (e2) => Z2(vr(c2, b2, "contextItem"), (f2) => Y2(`(function () {
							const { done, value } = ${e2.code}(${f2.code}).next();
							return done ? null : value;
						})()`, { type: 0 }, [...e2.H, ...f2.H])));
          default:
            throw Error(`invalid generated code type to convert to value: ${d2.ua.type}`);
        }
      });
    }
    function wr(a2, b2, c2, d2) {
      a2 = ur(a2, c2, d2);
      return b2 && 0 === b2.type && 3 === b2.g ? a2 : Z2(a2, (e2) => Y2(`!!${e2.code}`, { type: 0 }, e2.H));
    }
    function xr(a2, b2, c2) {
      return b2 ? a2.isAstAccepted && 0 !== a2.ua.type ? sr("Atomization only implemented for single value") : v2(b2.type, 1) ? a2 : v2(b2.type, 47) ? Z2(vr(c2, a2, "attr"), (d2) => Y2(`(${d2.code} ? domFacade.getData(${d2.code}) : null)`, { type: 0 }, d2.H)) : sr("Atomization only implemented for string and attribute") : sr("Can not atomize value if type was not annotated");
    }
    function yr(a2, b2, c2, d2) {
      a2 = ur(a2, c2, d2);
      d2 = xr(a2, b2, d2);
      return wc(b2) ? Z2(d2, (e2) => Y2(`${e2.code} ?? ''`, { type: 0 }, e2.H)) : d2;
    }
    function zr(a2, b2, c2) {
      return Z2(vr(c2, a2, "node"), (d2) => 1 === d2.ua.type ? d2 : b2 && !v2(b2.type, 53) ? sr("Can not evaluate to node if expression does not result in nodes") : Y2(`(function () {
				if (${d2.code} !== null && !${d2.code}.nodeType) {
					throw new Error('XPDY0050: The result of the expression was not a node');
				}
				return ${d2.code};
			})()`, { type: 0 }, d2.H));
    }
    function Ar(a2, b2, c2, d2) {
      return Z2(a2, (e2) => {
        switch (e2.ua.type) {
          case 1:
            return Z2(vr(d2, e2, "nodes"), (f2) => Z2(vr(d2, c2, "contextItem"), (h2) => Y2(`Array.from(${f2.code}(${h2.code}))`, { type: 0 }, [...f2.H, ...h2.H])));
          case 0:
            return Z2(vr(d2, zr(e2, b2, d2), "node"), (f2) => Y2(`(${f2.code} === null ? [] : [${f2.code}])`, { type: 0 }, f2.H));
          default:
            return sr("Unsupported code type to evaluate to nodes");
        }
      });
    }
    function Br(a2, b2) {
      return Z2(a2, (c2) => Z2(b2, (d2) => {
        if (0 !== c2.ua.type || 0 !== d2.ua.type) throw Error("can only use emitAnd with value expressions");
        return Y2(`${c2.code} && ${d2.code}`, { type: 0 }, [...c2.H, ...d2.H]);
      }));
    }
    function Cr(a2, b2, c2, d2) {
      return (a2 = J2(a2, [b2, "*"])) ? d2.h(a2, c2, d2) : [sr(`${b2} expression not found`), null];
    }
    const gu = { equalOp: "eqOp", notEqualOp: "neOp", lessThanOrEqualOp: "leOp", lessThanOp: "ltOp", greaterThanOrEqualOp: "geOp", greaterThanOp: "gtOp" }, hu = { eqOp: "eqOp", neOp: "neOp", leOp: "geOp", ltOp: "gtOp", geOp: "leOp", gtOp: "ltOp" };
    function iu(a2, b2, c2, d2) {
      const e2 = I2(J2(a2, ["firstOperand", "*"]), "type"), f2 = I2(J2(a2, ["secondOperand", "*"]), "type");
      if (!e2 || !f2) return sr("Can not generate code for value compare without both types");
      var h2 = [47, 1];
      if (!h2.includes(e2.type) || !h2.includes(f2.type)) return sr(`Unsupported types in compare: [${Da[e2.type]}, ${Da[f2.type]}]`);
      h2 = /* @__PURE__ */ new Map([["eqOp", "==="], ["neOp", "!=="]]);
      if (!h2.has(b2)) return sr(b2 + " not yet implemented");
      const k2 = h2.get(b2);
      [b2] = Cr(a2, "firstOperand", c2, d2);
      b2 = ur(b2, c2, d2);
      b2 = xr(b2, e2, d2);
      return Z2(
        vr(d2, b2, "first"),
        (l2) => {
          var [n2] = Cr(a2, "secondOperand", c2, d2);
          n2 = ur(n2, c2, d2);
          n2 = xr(n2, f2, d2);
          return Z2(vr(d2, n2, "second"), (t2) => {
            const u2 = [];
            wc(e2) && u2.push(`${l2.code} === null`);
            wc(f2) && u2.push(`${t2.code} === null`);
            return Y2(`(${u2.length ? `${u2.join(" || ")} ? null : ` : ""}${l2.code} ${k2} ${t2.code})`, { type: 0 }, [...l2.H, ...t2.H]);
          });
        }
      );
    }
    function ju(a2, b2, c2, d2, e2, f2) {
      var h2 = I2(J2(a2, [b2, "*"]), "type");
      const k2 = I2(J2(a2, [c2, "*"]), "type");
      if (!h2 || !k2) return sr("Can not generate code for general compare without both types");
      var l2 = [47, 1];
      if (!l2.includes(h2.type) || !l2.includes(k2.type)) return sr(`Unsupported types in compare: [${Da[h2.type]}, ${Da[k2.type]}]`);
      l2 = /* @__PURE__ */ new Map([["eqOp", "==="], ["neOp", "!=="]]);
      if (!l2.has(d2)) return sr(d2 + " not yet implemented");
      const n2 = l2.get(d2);
      [b2] = Cr(a2, b2, e2, f2);
      b2 = ur(b2, e2, f2);
      h2 = xr(b2, h2, f2);
      return Z2(vr(f2, h2, "single"), (t2) => {
        const [u2] = Cr(a2, c2, e2, f2);
        return Z2(vr(f2, u2, "multiple"), (z2) => {
          if (1 !== z2.ua.type) return sr("can only generate general compare for a single value and a generator");
          const y2 = ku(f2, lu(f2, "n")), G2 = xr(y2, k2, f2);
          return Z2(e2, (N2) => Z2(G2, (U2) => Y2(`(function () {
									for (const ${y2.code} of ${z2.code}(${N2.code})) {
										${U2.H.join("\n")}
										if (${U2.code} ${n2} ${t2.code}) {
											return true;
										}
									}
									return false;
								})()`, { type: 0 }, [...t2.H, ...y2.H, ...N2.H, ...z2.H])));
        });
      });
    }
    function mu(a2) {
      return JSON.stringify(a2).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    const su = { "false#0": nu, "local-name#0": ou, "local-name#1": ou, "name#0": pu, "name#1": pu, "not#1": qu, "true#0": ru }, tu = { ["http://fontoxml.com/fontoxpath"]: ["version#0"], [""]: ["root#1", "path#1"] };
    function uu(a2, b2, c2, d2) {
      const [e2] = d2.h(a2, c2, d2);
      a2 = I2(a2, "type");
      if (b2 ? 2 === b2.g || 1 === b2.g : 1) return sr("Not supported: sequence arguments with multiple items");
      if (v2(b2.type, 53)) return b2 = ur(e2, c2, d2), zr(b2, a2, d2);
      switch (b2.type) {
        case 59:
          return ur(e2, c2, d2);
        case 0:
          return wr(e2, a2, c2, d2);
        case 1:
          return yr(e2, a2, c2, d2);
      }
      return sr(`Argument types not supported: ${a2 ? Da[a2.type] : "unknown"} -> ${Da[b2.type]}`);
    }
    function vu(a2, b2, c2, d2) {
      if (a2.length !== b2.length || b2.some((l2) => 4 === l2)) return sr("Not supported: variadic function or mismatch in argument count");
      if (0 === a2.length) return Y2("", { type: 0 }, []);
      const [e2, ...f2] = a2, [h2, ...k2] = b2;
      a2 = vr(d2, uu(e2, h2, c2, d2), "arg");
      return 0 === f2.length ? a2 : Z2(a2, (l2) => {
        const n2 = vu(f2, k2, c2, d2);
        return Z2(n2, (t2) => Y2(`${l2.code}, ${t2.code}`, { type: 0 }, [...l2.H, ...t2.H]));
      });
    }
    function wu(a2, b2) {
      return Z2(a2, (c2) => (b2 ? 2 === b2.g || 1 === b2.g : 1) || ![0, 1].includes(b2.type) && !v2(b2.type, 53) ? sr(`Function return type ${Da[b2.type]} not supported`) : c2);
    }
    function xu(a2, b2, c2) {
      const { localName: d2, namespaceURI: e2 } = Jg(F2(a2, "functionName")), f2 = K2(F2(a2, "arguments"), "*");
      var h2 = f2.length;
      const k2 = `${d2}#${h2}`, l2 = e2 === c2.D;
      if (l2) {
        const n2 = su[k2];
        if (void 0 !== n2) return n2(a2, b2, c2);
      }
      if ((a2 = tu[l2 ? "" : e2]) && !a2.includes(k2)) return sr(`Not supported: built-in function not on allow list: ${k2}`);
      h2 = mg(e2, d2, h2);
      if (!h2) return sr(`Unknown function / arity: ${k2}`);
      if (h2.I) return sr("Not supported: updating functions");
      b2 = vu(f2, h2.j, b2, c2);
      b2 = Z2(b2, (n2) => Y2(
        `runtimeLib.callFunction(domFacade, ${mu(e2)}, ${mu(d2)}, [${n2.code}], options)`,
        { type: 0 },
        n2.H
      ));
      return wu(b2, h2.i);
    }
    function yu(a2, b2) {
      return Z2(vr(b2, a2, "contextItem"), (c2) => Y2(c2.code, { type: 0 }, [...c2.H, `if (${c2.code} === undefined || ${c2.code} === null) {
					throw errXPDY0002('The function which was called depends on dynamic context, which is absent.');
				}`]));
    }
    function zu(a2, b2, c2, d2) {
      if ((a2 = J2(a2, ["arguments", "*"])) && "contextItemExpr" !== a2[0]) {
        const e2 = I2(a2, "type");
        if (!e2 || !v2(e2.type, 53)) return sr("name function only implemented if arg is a node");
        [a2] = c2.h(a2, b2, c2);
      } else a2 = yu(b2, c2);
      b2 = ur(a2, b2, c2);
      return Z2(vr(c2, b2, "arg"), (e2) => Y2(`(${e2.code} ? ${d2(e2.code)} : '')`, { type: 0 }, e2.H));
    }
    function pu(a2, b2, c2) {
      return zu(a2, b2, c2, (d2) => `(((${d2}.prefix || '').length !== 0 ? ${d2}.prefix + ':' : '')
		+ (${d2}.localName || ${d2}.target || ''))`);
    }
    function ou(a2, b2, c2) {
      return zu(a2, b2, c2, (d2) => `(${d2}.localName || ${d2}.target || '')`);
    }
    function qu(a2, b2, c2) {
      var d2 = J2(a2, ["arguments", "*"]);
      a2 = I2(d2, "type");
      [d2] = c2.h(d2, b2, c2);
      b2 = wr(d2, a2, b2, c2);
      return Z2(b2, (e2) => Y2(`!${e2.code}`, { type: 0 }, e2.H));
    }
    function nu() {
      return Y2("false", { type: 0 }, []);
    }
    function ru() {
      return Y2("true", { type: 0 }, []);
    }
    function Au(a2, b2, c2, d2) {
      const [e2, f2] = Cr(a2, "firstOperand", c2, d2);
      var h2 = I2(J2(a2, ["firstOperand", "*"]), "type");
      h2 = wr(e2, h2, c2, d2);
      const [k2, l2] = Cr(a2, "secondOperand", c2, d2);
      h2 = Z2(h2, (t2) => {
        var u2 = I2(J2(a2, ["secondOperand", "*"]), "type");
        u2 = wr(k2, u2, c2, d2);
        return Z2(u2, (z2) => Y2(`(${t2.code} ${b2} ${z2.code})`, { type: 0 }, [...t2.H, ...z2.H]));
      });
      const n2 = "&&" === b2 ? xh(f2, l2) : f2 === l2 ? f2 : null;
      return [h2, n2];
    }
    function Bu(a2, b2, c2) {
      return Z2(a2, (d2) => Z2(b2, (e2) => Z2(c2, (f2) => Y2(`for (${d2.code}) {
						${e2.H.join("\n")}
						if (!(${e2.code})) {
							continue;
						}
						${f2.H.join("\n")}
						${f2.code}
					}`, { type: 2 }, d2.H))));
    }
    function Cu(a2, b2, c2, d2, e2) {
      const f2 = b2 ? `, "${b2}"` : "";
      b2 = Z2(d2, (h2) => Z2(e2, (k2) => Y2(`let ${h2.code} = domFacade.getFirstChild(${k2.code}${f2});
							${h2.code};
							${h2.code} = domFacade.getNextSibling(${h2.code}${f2})`, { type: 2 }, [...h2.H, ...k2.H])));
      return Bu(b2, a2, c2);
    }
    function Du(a2, b2, c2, d2, e2) {
      const f2 = xh(b2, "type-2"), h2 = Z2(e2, (k2) => Y2(`(${k2.code} && ${k2.code}.nodeType === /*ELEMENT_NODE*/ ${1} ? domFacade.getAllAttributes(${k2.code}${f2 ? `, "${f2}"` : ""}) : [])`, { type: 0 }, k2.H));
      b2 = Z2(d2, (k2) => Z2(h2, (l2) => Y2(`const ${k2.code} of ${l2.code}`, { type: 2 }, [...k2.H, ...l2.H])));
      return Bu(b2, a2, c2);
    }
    function Eu(a2, b2, c2, d2, e2) {
      const f2 = b2 ? `, "${b2}"` : "";
      b2 = Z2(e2, (h2) => Y2(`domFacade.getParentNode(${h2.code}${f2})`, { type: 0 }, h2.H));
      return Fu(d2, b2, a2, c2);
    }
    function Fu(a2, b2, c2, d2) {
      const e2 = Br(a2, c2);
      return Z2(a2, (f2) => Z2(b2, (h2) => Z2(e2, (k2) => Z2(d2, (l2) => Y2(`const ${f2.code} = ${h2.code};
						${k2.H.join("\n")}
						if (${k2.code}) {
							${l2.H.join("\n")}
							${l2.code}
						}`, { type: 2 }, [...f2.H, ...h2.H])))));
    }
    function Gu(a2, b2, c2, d2, e2, f2) {
      a2 = H2(a2);
      switch (a2) {
        case "attribute":
          return [Du(b2, c2, d2, e2, f2), "type-1"];
        case "child":
          return [Cu(b2, c2, d2, e2, f2), null];
        case "parent":
          return [Eu(b2, c2, d2, e2, f2), null];
        case "self":
          return [Fu(e2, f2, b2, d2), c2];
        default:
          return [sr(`Unsupported: the ${a2} axis`), null];
      }
    }
    const Hu = { Wb: "textTest", Nb: "elementTest", Sb: "nameTest", Xb: "Wildcard", Kb: "anyKindTest" };
    var Iu = Object.values(Hu);
    function Ju(a2) {
      return [Z2(a2, (b2) => Y2(`(${b2.code}.nodeType === /*TEXT_NODE*/ ${3} ||
				${b2.code}.nodeType === /* CDATA_SECTION_NODE */ ${4})`, { type: 0 }, [])), "type-3"];
    }
    function Ku(a2, b2) {
      if (null === a2.namespaceURI && "*" !== a2.prefix) {
        b2 = b2.$(a2.prefix || "") || null;
        if (!b2 && a2.prefix) throw Error(`XPST0081: The prefix ${a2.prefix} could not be resolved.`);
        a2.namespaceURI = b2;
      }
    }
    function Lu(a2, b2, c2, d2) {
      Ku(a2, d2);
      const e2 = a2.prefix, f2 = a2.namespaceURI, h2 = a2.localName;
      return tr(c2, (k2) => {
        var l2 = b2 ? Y2(`${k2.code}.nodeType
						&& (${k2.code}.nodeType === /*ELEMENT_NODE*/ ${1}
						|| ${k2.code}.nodeType === /*ATTRIBUTE_NODE*/ ${2})`, { type: 0 }, []) : Y2(`${k2.code}.nodeType
						&& ${k2.code}.nodeType === /*ELEMENT_NODE*/ ${1}`, { type: 0 }, []);
        if ("*" === e2) return "*" === h2 ? [l2, b2 ? "type-1-or-type-2" : "type-1"] : [Br(l2, Y2(`${k2.code}.localName === ${mu(h2)}`, { type: 0 }, [])), `name-${h2}`];
        l2 = "*" === h2 ? l2 : Br(l2, Y2(`${k2.code}.localName === ${mu(h2)}`, { type: 0 }, []));
        var n2 = Y2(mu(f2), { type: 0 }, []);
        n2 = "" === e2 && b2 ? Z2(n2, (t2) => Y2(`${k2.code}.nodeType === /*ELEMENT_NODE*/ ${1} ? ${t2.code} : null`, { type: 0 }, t2.H)) : n2;
        n2 = Z2(n2, (t2) => Y2(`(${k2.code}.namespaceURI || null) === ((${t2.code}) || null)`, { type: 0 }, t2.H));
        return [Br(l2, n2), `name-${h2}`];
      });
    }
    function Mu(a2, b2, c2) {
      const d2 = (a2 = F2(a2, "elementName")) && F2(a2, "star");
      if (null === a2 || d2) return [Z2(b2, (e2) => Y2(`${e2.code}.nodeType === /*ELEMENT_NODE*/ ${1}`, { type: 0 }, [])), "type-1"];
      a2 = Jg(F2(a2, "QName"));
      return Lu(a2, false, b2, c2);
    }
    function Nu(a2) {
      return [Z2(a2, (b2) => Y2(`!!${b2.code}.nodeType`, { type: 0 }, [])), null];
    }
    function Ou(a2, b2, c2, d2) {
      var e2 = a2[0];
      switch (e2) {
        case Hu.Nb:
          return Mu(a2, c2, d2);
        case Hu.Wb:
          return Ju(c2);
        case Hu.Sb:
          return Lu(Jg(a2), b2, c2, d2);
        case Hu.Xb:
          return F2(a2, "star") ? (e2 = F2(a2, "uri"), null !== e2 ? a2 = Lu({ localName: "*", namespaceURI: H2(e2), prefix: "" }, b2, c2, d2) : (e2 = F2(a2, "NCName"), a2 = "star" === F2(a2, "*")[0] ? Lu({ localName: H2(e2), namespaceURI: null, prefix: "*" }, b2, c2, d2) : Lu({ localName: "*", namespaceURI: null, prefix: H2(e2) }, b2, c2, d2))) : a2 = Lu({ localName: "*", namespaceURI: null, prefix: "*" }, b2, c2, d2), a2;
        case Hu.Kb:
          return Nu(c2);
        default:
          return [
            sr(`Test not implemented: '${e2}`),
            null
          ];
      }
    }
    function Pu(a2, b2, c2) {
      const [d2, e2] = c2.h(a2, b2, c2);
      return [wr(d2, I2(a2, "type"), b2, c2), e2];
    }
    function Qu(a2, b2, c2) {
      a2 = a2 ? K2(a2, "*") : [];
      const [d2, e2] = a2.reduce(([f2, h2], k2) => {
        if (!f2) return Pu(k2, b2, c2);
        let l2 = h2;
        return tr(f2, (n2) => {
          const [t2, u2] = Pu(k2, b2, c2);
          l2 = xh(h2, u2);
          return [Z2(t2, (z2) => Y2(`${n2.code} && ${z2.code}`, { type: 0 }, [...n2.H, ...z2.H])), l2];
        });
      }, [null, null]);
      return [d2 ? Z2(d2, (f2) => Y2(`(function () {
							${f2.H.join("\n")}
							return ${f2.code};
						})()`, { type: 0 }, [])) : null, e2];
    }
    function Ru(a2, b2, c2, d2) {
      if (0 === a2.length) return [Z2(c2, (y2) => Y2(`yield ${y2.code};`, { type: 2 }, y2.H)), null];
      const [e2, ...f2] = a2;
      if (0 < K2(e2, "lookup").length) return [sr("Unsupported: lookups"), null];
      const h2 = ku(d2, lu(d2, "contextItem"));
      a2 = F2(e2, "predicates");
      const [k2, l2] = Qu(a2, h2, d2);
      if (a2 = F2(e2, "xpathAxis")) {
        var n2 = F2(e2, Iu);
        if (!n2) return [sr("Unsupported test in step"), null];
        var t2 = H2(a2);
        b2 = "attribute" === t2 || "self" === t2 && b2;
        const [y2, G2] = Ou(n2, b2, h2, d2);
        n2 = null === k2 ? y2 : Br(y2, k2);
        t2 = xh(G2, l2);
        [b2] = Ru(f2, b2, h2, d2);
        return Gu(a2, n2, t2, b2, h2, c2);
      }
      a2 = J2(e2, ["filterExpr", "*"]);
      if (!a2) return [sr("Unsupported: unknown step type"), null];
      const [u2, z2] = d2.h(a2, c2, d2);
      return [Z2(u2, (y2) => {
        const G2 = 0 === f2.length ? Y2("", { type: 2 }, []) : Y2(`if (${h2.code} !== null && !${h2.code}.nodeType) {
									throw new Error('XPTY0019: The result of E1 in a path expression E1/E2 should evaluate to a sequence of nodes.');
								}`, { type: 2 }, []), [N2] = Ru(f2, true, h2, d2), U2 = null === k2 ? N2 : Z2(k2, (ca) => Z2(N2, (Ga) => Y2(`if (${ca.code}) {
									${Ga.H.join("\n")}
									${Ga.code}
								}`, { type: 2 }, ca.H)));
        return Z2(U2, (ca) => {
          switch (y2.ua.type) {
            case 1:
              return Z2(c2, (Ga) => Y2(`for (const ${h2.code} of ${y2.code}(${Ga.code})) {
									${ca.H.join("\n")}
									${ca.code}
								}`, { type: 2 }, [...h2.H, ...y2.H, ...G2.H]));
            case 0:
              return Y2(`const ${h2.code} = ${y2.code};
							${G2.code}
							if (${h2.code} !== null) {
								${ca.H.join("\n")}
								${ca.code}
							}`, { type: 2 }, [...h2.H, ...y2.H, ...G2.H]);
            default:
              return sr("Unsupported generated code type for filterExpr");
          }
        });
      }), z2];
    }
    function Su(a2) {
      return Z2(a2, (b2) => Y2(`(function () {
				let n = ${b2.code};
				while (n.nodeType !== /*DOCUMENT_NODE*/${9}) {
					n = domFacade.getParentNode(n);
					if (n === null) {
						throw new Error('XPDY0050: the root node of the context node is not a document node.');
					}
				}
				return n;
			})()`, { type: 0 }, b2.H));
    }
    function Tu(a2, b2, c2) {
      return tr(b2, (d2) => {
        if (0 < K2(a2, "lookup").length) return [sr("Unsupported: lookups"), null];
        var e2 = F2(a2, "predicates");
        const [f2, h2] = Qu(e2, d2, c2);
        e2 = F2(a2, Iu);
        if (!e2) return [sr("Unsupported test in step"), null];
        const [k2, l2] = Ou(e2, true, d2, c2);
        e2 = null === f2 ? k2 : Br(k2, f2);
        const n2 = xh(l2, h2);
        return [Z2(e2, (t2) => Y2(`((${t2.code}) ? ${d2.code} : null)`, { type: 0 }, [...d2.H, ...t2.H])), n2];
      });
    }
    function Uu(a2, b2, c2) {
      const d2 = K2(a2, "stepExpr");
      if (1 === d2.length) {
        const k2 = F2(d2[0], "xpathAxis");
        if (k2 && "self" === H2(k2)) return Tu(d2[0], b2, c2);
      }
      const e2 = ku(c2, lu(c2, "contextItem"));
      b2 = (a2 = F2(a2, "rootExpr")) ? vr(c2, Su(e2), "root") : e2;
      const [f2, h2] = Ru(d2, !a2, b2, c2);
      return [Z2(f2, (k2) => Y2(`(function* (${e2.code}) {
			${k2.H.join("\n")}
			${k2.code}
		})`, { type: 1 }, [])), h2];
    }
    function Vu(a2, b2, c2) {
      const d2 = a2[0];
      switch (d2) {
        case "contextItemExpr":
          return [b2, null];
        case "pathExpr":
          return Uu(a2, b2, c2);
        case "andOp":
          return Au(a2, "&&", b2, c2);
        case "orOp":
          return Au(a2, "||", b2, c2);
        case "stringConstantExpr":
          return a2 = F2(a2, "value")[1] || "", a2 = mu(a2), [Y2(a2, { type: 0 }, []), null];
        case "equalOp":
        case "notEqualOp":
        case "lessThanOrEqualOp":
        case "lessThanOp":
        case "greaterThanOrEqualOp":
        case "greaterThanOp":
        case "eqOp":
        case "neOp":
        case "ltOp":
        case "leOp":
        case "gtOp":
        case "geOp":
        case "isOp":
        case "nodeBeforeOp":
        case "nodeAfterOp":
          a: switch (d2) {
            case "eqOp":
            case "neOp":
            case "ltOp":
            case "leOp":
            case "gtOp":
            case "geOp":
            case "isOp":
              a2 = iu(a2, d2, b2, c2);
              break a;
            case "equalOp":
            case "notEqualOp":
            case "lessThanOrEqualOp":
            case "lessThanOp":
            case "greaterThanOrEqualOp":
            case "greaterThanOp":
              const e2 = I2(J2(a2, ["firstOperand", "*"]), "type"), f2 = I2(J2(a2, ["secondOperand", "*"]), "type");
              a2 = e2 && f2 ? 3 === e2.g && 3 === f2.g ? iu(a2, gu[d2], b2, c2) : 3 === e2.g ? ju(a2, "firstOperand", "secondOperand", gu[d2], b2, c2) : 3 === f2.g ? ju(a2, "secondOperand", "firstOperand", hu[gu[d2]], b2, c2) : sr("General comparison for sequences is not implemented") : sr("types of compare are not known");
              break a;
            default:
              a2 = sr(`Unsupported compare type: ${d2}`);
          }
          return [
            a2,
            null
          ];
        case "functionCallExpr":
          return [xu(a2, b2, c2), null];
        default:
          return [sr(`Unsupported: the base expression '${d2}'.`), null];
      }
    }
    function vr(a2, b2, c2) {
      return Z2(b2, (d2) => {
        var e2 = a2.o.get(d2);
        e2 || (e2 = lu(a2, c2), e2 = Y2(e2, d2.ua, [...d2.H, `const ${e2} = ${d2.code};`]), a2.o.set(d2, e2), a2.o.set(e2, e2));
        return e2;
      });
    }
    function lu(a2, b2 = "v") {
      const c2 = a2.v.get(b2) || 0;
      a2.v.set(b2, c2 + 1);
      return `${b2}${c2}`;
    }
    function ku(a2, b2) {
      b2 = Y2(b2, { type: 0 }, []);
      a2.o.set(b2, b2);
      return b2;
    }
    var Wu = class {
      constructor(a2, b2) {
        this.o = /* @__PURE__ */ new Map();
        this.v = /* @__PURE__ */ new Map();
        this.$ = a2;
        this.D = b2;
        this.h = Vu;
      }
    };
    function Xu(a2) {
      const b2 = K2(a2, "*");
      if ("pathExpr" === a2[0]) return true;
      for (const c2 of b2) if (Xu(c2)) return true;
      return false;
    }
    function Yu(a2, b2, c2) {
      c2 = c2 || {};
      b2 = b2 || 0;
      if ("string" === typeof a2) {
        a2 = Pk(a2);
        var d2 = { Z: "XQuery3.1" === c2.language || "XQueryUpdate3.1" === c2.language, debug: false };
        try {
          var e2 = uq(a2, d2);
        } catch (h2) {
          gg(a2, h2);
        }
      } else e2 = Kk(a2);
      a2 = F2(e2, "mainModule");
      if (!a2) return sr("Unsupported: XQuery Library modules are not supported.");
      if (F2(a2, "prolog")) return sr("Unsupported: XQuery Prologs are not supported.");
      d2 = void 0 === c2.defaultFunctionNamespaceURI ? "http://www.w3.org/2005/xpath-functions" : c2.defaultFunctionNamespaceURI;
      a2 = new Wu(c2.namespaceResolver || Rq(null), d2);
      c2 = new qh(new Bg(new pg(a2.$, {}, d2, c2.functionNameResolver || Sq("http://www.w3.org/2005/xpath-functions"))));
      O2(e2, c2);
      if (c2 = F2(e2, "mainModule")) if (F2(c2, "prolog")) a2 = sr("Unsupported: XQuery.");
      else {
        var f2 = J2(c2, ["queryBody", "*"]);
        c2 = ku(a2, "contextItem");
        [d2] = a2.h(f2, c2, a2);
        b: switch (f2 = I2(f2, "type"), b2) {
          case 9:
            b2 = ur(d2, c2, a2);
            a2 = zr(b2, f2, a2);
            break b;
          case 7:
            a2 = Ar(d2, f2, c2, a2);
            break b;
          case 3:
            a2 = wr(d2, f2, c2, a2);
            break b;
          case 2:
            a2 = yr(d2, f2, c2, a2);
            break b;
          default:
            a2 = sr(`Unsupported: the return type '${b2}'.`);
        }
        a2.isAstAccepted && (a2 = `
		${a2.H.join("\n")}
		return ${a2.code};`, b2 = "\n	return (contextItem, domFacade, runtimeLib, options) => {\n		const {\n			errXPDY0002,\n		} = runtimeLib;", Xu(e2) && (b2 += '\n		if (!contextItem) {\n			throw errXPDY0002("Context is needed to evaluate the given path expression.");\n		}\n\n		if (!contextItem.nodeType) {\n			throw new Error("Context item must be subtype of node().");\n		}\n		'), a2 = { code: b2 + (a2 + "}\n//# sourceURL=generated.js"), isAstAccepted: true });
      }
      else a2 = sr("Unsupported: Can not execute a library module.");
      return a2;
    }
    class Zu extends Error {
      constructor(a2, b2, c2) {
        var d2 = a2.stack;
        d2 && (d2.includes(a2.message) && (d2 = d2.substr(d2.indexOf(a2.message) + a2.message.length).trim()), d2 = d2.split("\n"), d2.splice(10), d2 = d2.map((e2) => e2.startsWith("    ") || e2.startsWith("	") ? e2 : `    ${e2}`), d2 = d2.join("\n"));
        super(`Custom XPath function Q{${c2}}${b2} raised:
${a2.message}
${d2}`);
      }
    }
    function $u(a2, b2, c2) {
      return 0 === b2.g ? a2.F() ? null : Vq(a2.first(), c2).next(0).value : 2 === b2.g || 1 === b2.g ? a2.O().map((d2) => {
        if (v2(d2.type, 47)) throw Error("Cannot pass attribute nodes to custom functions");
        return Vq(d2, c2).next(0).value;
      }) : Vq(a2.first(), c2).next(0).value;
    }
    function av(a2) {
      if ("object" === typeof a2) return a2;
      a2 = a2.split(":");
      if (2 !== a2.length) throw Error("Do not register custom functions in the default function namespace");
      const [b2, c2] = a2;
      a2 = og[b2];
      if (!a2) {
        a2 = `generated_namespace_uri_${b2}`;
        if (og[b2]) throw Error("Prefix already registered: Do not register the same prefix twice.");
        og[b2] = a2;
      }
      return { localName: c2, namespaceURI: a2 };
    }
    function bv(a2, b2, c2, d2) {
      const { namespaceURI: e2, localName: f2 } = av(a2);
      if (!e2) throw ug();
      const h2 = b2.map((l2) => Ja(l2)), k2 = Ja(c2);
      ng(e2, f2, h2, k2, function(l2, n2, t2) {
        var u2 = Array.from(arguments);
        u2.splice(0, 3);
        u2 = u2.map((G2, N2) => $u(G2, h2[N2], n2));
        const z2 = { currentContext: n2.o, domFacade: n2.h.h };
        let y2;
        try {
          y2 = d2.apply(void 0, [z2, ...u2]);
        } catch (G2) {
          throw new Zu(G2, f2, e2);
        }
        return y2 && "object" === typeof y2 && Object.getOwnPropertySymbols(y2).includes(Pq) ? w2.create(y2.zb) : Wb(n2.h, y2, k2);
      });
    }
    var cv = { callFunction(a2, b2, c2, d2, e2) {
      const f2 = mg(b2, c2, d2.length);
      if (!f2) throw Error("function not found for codegen function call");
      b2 = new cc({ M: null, Aa: 0, ta: w2.empty(), ra: {} });
      const h2 = new nb(a2);
      a2 = new ic(false, false, h2, null, null, e2 ? e2.currentContext : null, null);
      d2 = f2.callFunction(b2, a2, null, ...d2.map((k2, l2) => Wb(h2, k2, f2.j[l2])));
      return $u(d2, { type: 59, g: 0 }, a2);
    }, errXPDY0002: lc };
    var dv = (a2, b2, c2, d2) => {
      c2 = c2 ? c2 : new Za();
      return a2()(null !== b2 && void 0 !== b2 ? b2 : null, c2, cv, d2);
    };
    const ev = { ["http://www.w3.org/2005/XQueryX"]: "xqx", ["http://www.w3.org/2007/xquery-update-10"]: "xquf", ["http://fontoxml.com/fontoxpath"]: "x" };
    function fv(a2, b2) {
      switch (a2) {
        case "copySource":
        case "insertAfter":
        case "insertAsFirst":
        case "insertAsLast":
        case "insertBefore":
        case "insertInto":
        case "modifyExpr":
        case "newNameExpr":
        case "replacementExpr":
        case "replaceValue":
        case "returnExpr":
        case "sourceExpr":
        case "targetExpr":
        case "transformCopies":
        case "transformCopy":
          return { localName: a2, lb: b2 || "http://www.w3.org/2005/XQueryX" };
        case "deleteExpr":
        case "insertExpr":
        case "renameExpr":
        case "replaceExpr":
        case "transformExpr":
          return { localName: a2, lb: "http://www.w3.org/2007/xquery-update-10" };
        case "x:stackTrace":
          return { localName: "stackTrace", lb: "http://fontoxml.com/fontoxpath" };
        default:
          return { localName: a2, lb: "http://www.w3.org/2005/XQueryX" };
      }
    }
    function gv(a2, b2, c2, d2, e2) {
      if ("string" === typeof c2) return 0 === c2.length ? null : b2.createTextNode(c2);
      if (!Array.isArray(c2)) throw new TypeError("JsonML element should be an array or string");
      var f2 = fv(c2[0], d2);
      d2 = f2.localName;
      f2 = f2.lb;
      const h2 = b2.createElementNS(f2, ev[f2] + ":" + d2), k2 = c2[1];
      var l2 = 1;
      if ("object" === typeof k2 && !Array.isArray(k2)) {
        if (null !== k2) for (var n2 of Object.keys(k2)) l2 = k2[n2], null !== l2 && ("type" === n2 ? void 0 !== l2 && a2.setAttributeNS(h2, f2, "fontoxpath:" + n2, Ha(l2)) : ("start" !== n2 && "end" !== n2 && "comment" !== n2 || "stackTrace" !== d2 || (l2 = JSON.stringify(l2)), e2 && "prefix" === n2 && "" === l2 || a2.setAttributeNS(h2, f2, ev[f2] + ":" + n2, l2)));
        l2 = 2;
      }
      for (let t2 = l2, u2 = c2.length; t2 < u2; ++t2) n2 = gv(a2, b2, c2[t2], f2, e2), null !== n2 && a2.insertBefore(h2, n2, null);
      return h2;
    }
    function hv(a2, b2, c2, d2 = ab) {
      a2 = Pk(a2);
      let e2;
      try {
        e2 = uq(a2, { Z: "XQuery3.1" === b2.language || "XQueryUpdate3.1" === b2.language, debug: b2.debug });
      } catch (l2) {
        gg(a2, l2);
      }
      var f2 = new pg(b2.namespaceResolver || (() => null), {}, void 0 === b2.defaultFunctionNamespaceURI ? "http://www.w3.org/2005/xpath-functions" : b2.defaultFunctionNamespaceURI, b2.functionNameResolver || (() => null));
      f2 = new Bg(f2);
      var h2 = F2(e2, ["mainModule", "libraryModule"]), k2 = F2(h2, "moduleDecl");
      if (k2) {
        const l2 = H2(F2(k2, "prefix"));
        k2 = H2(F2(k2, "uri"));
        Fg(f2, l2, k2);
      }
      (h2 = F2(h2, "prolog")) && xq(h2, f2, false, a2);
      false !== b2.annotateAst && ih(e2, new qh(f2));
      f2 = new Za();
      b2 = gv(d2, c2, e2, null, false === b2.mc);
      d2.insertBefore(b2, c2.createComment(a2), f2.getFirstChild(b2));
      return b2;
    }
    function iv(a2) {
      return Promise.resolve(a2);
    }
    function jv(a2, b2 = { debug: false }) {
      try {
        var c2 = uq(a2, { Z: true, debug: b2.debug });
      } catch (f2) {
        gg(a2, f2);
      }
      ih(c2, new qh());
      b2 = F2(c2, "libraryModule");
      if (!b2) throw Error("XQuery module must be declared in a library module.");
      c2 = F2(b2, "moduleDecl");
      var d2 = F2(c2, "uri");
      const e2 = H2(d2);
      c2 = F2(c2, "prefix");
      d2 = H2(c2);
      c2 = new Bg(new pg(() => null, /* @__PURE__ */ Object.create(null), "http://www.w3.org/2005/xpath-functions", Sq("http://www.w3.org/2005/xpath-functions")));
      Fg(c2, d2, e2);
      b2 = F2(b2, "prolog");
      if (null !== b2) {
        let f2;
        try {
          f2 = xq(b2, c2, true, a2);
        } catch (h2) {
          gg(a2, h2);
        }
        f2.Ia.forEach(({ namespaceURI: h2 }) => {
          if (e2 !== h2) throw Error("XQST0048: Functions and variables declared in a module must reside in the module target namespace.");
        });
        Mk(e2, f2);
      } else Mk(e2, { Ia: [], Ta: [], pa: null, source: a2 });
      return e2;
    }
    const kv = /* @__PURE__ */ new Map();
    function lv(a2) {
      var b2;
      a: {
        if (b2 = Gk.get(a2)) {
          for (const c2 of Object.keys(b2)) if (b2[c2] && b2[c2].length) {
            b2 = b2[c2][0].h;
            break a;
          }
        }
        b2 = null;
      }
      if (b2) return b2;
      if (kv.has(a2)) return kv.get(a2);
      b2 = "string" === typeof a2 ? uq(a2, { Z: false }) : Kk(a2);
      b2 = J2(b2, ["mainModule", "queryBody", "*"]);
      if (null === b2) throw Error("Library modules do not have a specificity");
      b2 = Fk(b2, { sa: false, Z: false });
      kv.set(a2, b2);
      return b2;
    }
    function mv(a2) {
      return lv(a2).D();
    }
    function nv(a2, b2) {
      return tf(lv(a2).o, lv(b2).o);
    }
    var ov = new Za();
    "undefined" !== typeof fontoxpathGlobal && (fontoxpathGlobal.compareSpecificity = nv, fontoxpathGlobal.compileXPathToJavaScript = Yu, fontoxpathGlobal.domFacade = ov, fontoxpathGlobal.evaluateXPath = dr, fontoxpathGlobal.evaluateXPathToArray = ir, fontoxpathGlobal.evaluateXPathToAsyncIterator = er, fontoxpathGlobal.evaluateXPathToBoolean = jr, fontoxpathGlobal.evaluateXPathToFirstNode = kr, fontoxpathGlobal.evaluateXPathToMap = lr, fontoxpathGlobal.evaluateXPathToNodes = mr, fontoxpathGlobal.evaluateXPathToNumber = nr, fontoxpathGlobal.evaluateXPathToNumbers = or, fontoxpathGlobal.evaluateXPathToString = pr, fontoxpathGlobal.evaluateXPathToStrings = qr, fontoxpathGlobal.evaluateUpdatingExpression = gr, fontoxpathGlobal.evaluateUpdatingExpressionSync = hr, fontoxpathGlobal.executeJavaScriptCompiledXPath = dv, fontoxpathGlobal.executePendingUpdateList = rr, fontoxpathGlobal.getBucketForSelector = mv, fontoxpathGlobal.getBucketsForNode = Ya, fontoxpathGlobal.precompileXPath = iv, fontoxpathGlobal.registerXQueryModule = jv, fontoxpathGlobal.registerCustomXPathFunction = bv, fontoxpathGlobal.parseScript = hv, fontoxpathGlobal.profiler = ar, fontoxpathGlobal.createTypedValueFactory = Qq, fontoxpathGlobal.finalizeModuleRegistration = Ok, fontoxpathGlobal.Language = cr, fontoxpathGlobal.ReturnType = Xq);
    return fontoxpathGlobal;
  }).call(typeof window === "undefined" ? void 0 : window, xspattern, prsc);
  fontoxpath.compareSpecificity;
  fontoxpath.compileXPathToJavaScript;
  fontoxpath.createTypedValueFactory;
  fontoxpath.domFacade;
  fontoxpath.evaluateUpdatingExpression;
  fontoxpath.evaluateUpdatingExpressionSync;
  fontoxpath.evaluateXPath;
  fontoxpath.evaluateXPathToArray;
  fontoxpath.evaluateXPathToAsyncIterator;
  fontoxpath.evaluateXPathToBoolean;
  fontoxpath.evaluateXPathToFirstNode;
  fontoxpath.evaluateXPathToMap;
  fontoxpath.evaluateXPathToNodes;
  fontoxpath.evaluateXPathToNumber;
  fontoxpath.evaluateXPathToNumbers;
  fontoxpath.evaluateXPathToString;
  fontoxpath.evaluateXPathToStrings;
  fontoxpath.executeJavaScriptCompiledXPath;
  fontoxpath.executePendingUpdateList;
  fontoxpath.finalizeModuleRegistration;
  fontoxpath.getBucketForSelector;
  fontoxpath.getBucketsForNode;
  fontoxpath.Language;
  fontoxpath.parseScript;
  fontoxpath.precompileXPath;
  fontoxpath.profiler;
  fontoxpath.registerCustomXPathFunction;
  fontoxpath.registerXQueryModule;
  fontoxpath.ReturnType;
  function returnTypeTransition(returnType) {
    const returnTypeMap = {
      "string": fontoxpath.ReturnType.STRING,
      "strings": fontoxpath.ReturnType.STRINGS,
      "number": fontoxpath.ReturnType.NUMBER,
      "numbers": fontoxpath.ReturnType.NUMBERS,
      "boolean": fontoxpath.ReturnType.BOOLEAN,
      "nodes": fontoxpath.ReturnType.NODES,
      "first-node": fontoxpath.ReturnType.FIRST_NODE,
      "map": fontoxpath.ReturnType.MAP,
      "array": fontoxpath.ReturnType.ARRAY,
      "all-results": fontoxpath.ReturnType.ALL_RESULTS
    };
    if (!returnTypeMap[returnType]) {
      throw new Error(`Invalid return type: ${returnType}, expected one of ${Object.keys(returnTypeMap).join(", ")}`);
    }
    return returnTypeMap[returnType];
  }
  function createXPathSelector() {
    function xpathSelector2(options) {
      return fontoxpath.evaluateXPath(
        options.expression,
        options.node || document,
        null,
        null,
        returnTypeTransition(options.returnType)
      );
    }
    xpathSelector2.selectString = (expression, node) => xpathSelector2({ expression, node, returnType: "string" });
    xpathSelector2.selectStrings = (expression, node) => xpathSelector2({ expression, node, returnType: "strings" });
    xpathSelector2.selectNumber = (expression, node) => xpathSelector2({ expression, node, returnType: "number" });
    xpathSelector2.selectNumbers = (expression, node) => xpathSelector2({ expression, node, returnType: "numbers" });
    xpathSelector2.selectBoolean = (expression, node) => xpathSelector2({ expression, node, returnType: "boolean" });
    xpathSelector2.selectNodes = (expression, node) => xpathSelector2({ expression, node, returnType: "nodes" });
    xpathSelector2.selectFirstNode = (expression, node) => xpathSelector2({ expression, node, returnType: "first-node" });
    xpathSelector2.selectMap = (expression, node) => xpathSelector2({ expression, node, returnType: "map" });
    xpathSelector2.selectArray = (expression, node) => xpathSelector2({ expression, node, returnType: "array" });
    xpathSelector2.selectAllResults = (expression, node) => xpathSelector2({ expression, node, returnType: "all-results" });
    return xpathSelector2;
  }
  const index = createXPathSelector();
  return index;
}();
