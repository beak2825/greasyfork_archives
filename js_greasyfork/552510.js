// ==UserScript==
// @name         Scowl like Thucydides
// @namespace    http://tathamei.com/
// @version      3.1
// @description  Finds Ancient Greek text, converts it to archaic majuscule with updated OU/EI logic, and applies a custom font.
// @author       Tathamei
// @match        *://*/*
// @exclude      https://tathamei.com/*
// @exclude      https://docs.google.com/*
// @exclude      https://suno.com/*
// @exclude      https://www.google.com/search*
// @exclude      https://google.com/search*
// @license      Proprietary
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552510/Scowl%20like%20Thucydides.user.js
// @updateURL https://update.greasyfork.org/scripts/552510/Scowl%20like%20Thucydides.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ======================= 1) FONT & CLASS =======================
  GM_addStyle(`
    @font-face {
      font-family: 'ArchaicGreekFont';
      /* Replace with your actual base64 font data */
      src: url(data:font/woff2;base64,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) format('woff2');
      font-weight: normal;
      font-style: normal;
    }
  .archaic-greek-text {
    font-family: 'ArchaicGreekFont', sans-serif !important;
    font-size: calc(1em + 2px) !important;
  }
`);

  // Editable guard (don’t touch inputs/editors)
  const EDITABLE_SELECTOR =
    'input, textarea, select, option, [contenteditable]:not([contenteditable="false"]), [role="textbox"], .ProseMirror, .ql-editor, .public-DraftEditor-content';
  function isEditableRoot(el) {
    if (!el) return false;
    if (el.isContentEditable) return true;
    return !!el.closest(EDITABLE_SELECTOR);
  }

  // ======================= 2) MAPS (Majuscule + Macrons) =======================
  const archaicMajusculeMap = {
    // --- VOWELS ---
    // Alpha
    'α':'Α','ἀ':'Α','ά':'Α','ὰ':'Α','ἄ':'Α','ἂ':'Α','ᾶ':'Α','ἆ':'Α',
    'Ἀ':'Α','Ἄ':'Α','Ἂ':'Α','Ἆ':'Α',
    'ἁ':'ͰΑ','ᾁ':'ͰΑΙ','ἇ':'ͰΑ','ἅ':'ͰΑ','ἃ':'ͰΑ',
    'ᾷ':'ΑΙ','ᾴ':'ΑΙ','ᾳ':'ΑΙ','ᾀ':'ΑΙ',
    'Ἁ':'ͰA','Ἅ':'ͰA',

    // Epsilon
    'ε':'Ε','ἐ':'Ε','έ':'Ε','ὲ':'Ε','ἔ':'Ε','ἒ':'Ε',
    'Ἐ':'Ε','Ἔ':'Ε','Ἒ':'Ε',
    'ἑ':'ͰΕ','ἓ':'ͰΕ','ἕ':'ͰΕ',
    'Ἑ':'ͰΕ','Ἕ':'ͰΕ',

    // Eta → Epsilon (archaic)
    'η':'Ε','ἠ':'Ε','ή':'Ε','ὴ':'Ε','ῆ':'Ε','ἤ':'Ε','ἢ':'Ε','ἦ':'Ε',
    'Η':'Ε','Ἠ':'Ε','Ἤ':'Ε','Ἢ':'Ε','Ἦ':'Ε',
    'ἡ':'ͰΕ','ᾗ':'ͰΕΙ','ἧ':'ͰΕ','ἥ':'ͰΕ','ἣ':'ͰΕ','ᾑ':'ͰΕΙ',
    'ῄ':'ΕΙ','ᾖ':'ΕΙ','ῇ':'ΕΙ','ῃ':'ΕΙ','ᾐ':'ΕΙ',
    'Ἡ':'ͰΕ',

    // Iota
    'ι':'Ι','ἰ':'Ι','ί':'Ι','ὶ':'Ι','ῖ':'Ι','ἴ':'Ι','ἶ':'Ι','ϊ':'Ι','ΐ':'Ι',
    'Ἰ':'Ι','Ἴ':'Ι','Ἲ':'Ι','Ἶ':'Ι',
    'ἳ':'ͰΙ','ἱ':'ͰΙ','ἵ':'ͰΙ','ἷ':'ͰΙ',
    'Ἱ':'ͰΙ','Ἵ':'ͰΙ',

    // Omicron
    'ο':'Ο','ὀ':'Ο','ό':'Ο','ὸ':'Ο','ὄ':'Ο','ὂ':'Ο',
    'Ὀ':'Ο','Ὄ':'Ο','Ὂ':'Ο',
    'ὁ':'ͰΟ','ὅ':'ͰΟ','ὃ':'ͰΟ',
    'Ὁ':'ͰΟ','Ὅ':'ͰΟ',

    // Omega → Omicron
    'ω':'Ο','ὠ':'Ο','ώ':'Ο','ὼ':'Ο','ῶ':'Ο','ὦ':'Ο','ὢ':'Ο',
    'Ω':'Ο','Ὠ':'Ο','Ὤ':'Ο','Ὢ':'Ο','Ὦ':'Ο',
    'ὡ':'ͰΟ','ὧ':'ͰΟ','ὥ':'ͰΟ',
    'ᾧ':'ͰΟΙ','ῳ':'ΟΙ','ῷ':'ΟΙ','ᾠ':'ΟΙ','ᾤ':'ΟΙ','ῴ':'ΟΙ',
    'Ὡ':'ͰΟ',

    // Upsilon
    'υ':'Υ','ὐ':'Υ','ύ':'Υ','ὺ':'Υ','ὔ':'Υ','ὒ':'Υ','ῦ':'Υ','ὖ':'Υ',
    'ὕ':'ͰΥ','ὑ':'ͰΥ','ὗ':'ͰΥ',
    'Ὑ':'ͰΥ','Ὓ':'ͰΥ','Ὗ':'ͰΥ','Ὕ':'ͰΥ',

    // Consonants
    'β':'Β','γ':'Γ','δ':'Δ','ζ':'Ζ','θ':'Θ','κ':'Κ','λ':'Λ','μ':'Μ','ν':'Ν','π':'Π','ρ':'Ρ','ς':'Σ','σ':'Σ','τ':'Τ','φ':'Φ','χ':'Χ','ͱ':'Ͱ',
    // Rho with rough
    'ῥ':'ͰΡ',

    // Compounds
    'ξ':'ΧΣ','Ξ':'ΧΣ','ψ':'ΦΣ','Ψ':'ΦΣ'
  };

  const archaicMap_MacronsOn = {
    // Alpha (macron)
    'ᾶ':'Ā','ἆ':'Ā','Ἆ':'Ā','ἇ':'ͰĀ','ᾷ':'ĀΙ',
    // Eta → Ē
    'η':'Ē','ἠ':'Ē','ή':'Ē','ὴ':'Ē','ῆ':'Ē','ἤ':'Ē','ἢ':'Ē','ἦ':'Ē',
    'Η':'Ē','Ἠ':'Ē','Ἤ':'Ē','Ἢ':'Ē','Ἦ':'Ē',
    'ἡ':'ͰĒ','ᾗ':'ͰĒΙ','ἧ':'ͰĒ','ἥ':'ͰĒ','ἣ':'ͰĒ','ᾑ':'ͰĒΙ',
    'ῄ':'ĒΙ','ᾖ':'ĒΙ','ῇ':'ĒΙ','ῃ':'ĒΙ','ᾐ':'ĒΙ',
    'Ἡ':'ͰĒ',
    // Iota
    'ῖ':'Ī','ἶ':'Ī','Ἶ':'Ī','ἷ':'ͰĪ',
    // Omega → Ō
    'ω':'Ō','ὠ':'Ō','ώ':'Ō','ὼ':'Ō','ῶ':'Ō','ὦ':'Ō','ὢ':'Ō',
    'Ω':'Ō','Ὠ':'Ō','Ὤ':'Ō','Ὢ':'Ō','Ὦ':'Ō',
    'ὡ':'ͰŌ','ὧ':'ͰŌ','ὥ':'ͰŌ',
    'ᾧ':'ͰŌΙ','ῳ':'ŌΙ','ῷ':'ŌΙ','ᾠ':'ŌΙ','ᾤ':'ŌΙ','ῴ':'ŌΙ',
    'Ὡ':'ͰŌ',
    // Upsilon
    'ῦ':'Ȳ','ὖ':'Ȳ','ὗ':'ͰȲ','Ὗ':'ͰȲ'
  };

  let MACRONS_ON = false;
  function mapChar(ch) {
    if (MACRONS_ON && archaicMap_MacronsOn[ch] != null) return archaicMap_MacronsOn[ch];
    return (archaicMajusculeMap[ch] != null) ? archaicMajusculeMap[ch] : ch;
  }

  // ======================= 3) OU & EI LOGIC (updated) =======================
  // Charsets for ο and υ variants (explicit)
  const OMICRONS = "οὀὈὄὌὂὊόὸὁὉὅὍὃ";
  const UPSILONS = "υὐὔὒὖῦὕὗὑὙὛὝὟύὺ";
  const OU_ANY_RE     = new RegExp("[" + OMICRONS + "][" + UPSILONS + "]", "g");
  const OU_ANY_RE_ONE = new RegExp("[" + OMICRONS + "][" + UPSILONS + "]");

  // For EI pairs (ε + ι variants)
  const EPSILONS = "εἐἑέὲἔἒΕἘἙἜἝἚ";
  const IOTAS    = "ιἰἱίὶῖἴἳἶἷϊΐΙἸἹἼἺἾἵἽ";
  const EI_ANY_RE     = new RegExp("[" + EPSILONS + "][" + IOTAS + "]", "g");
  const EI_ANY_RE_ONE = new RegExp("[" + EPSILONS + "][" + IOTAS + "]");

  // Rough-breathing upsilons (lower + upper)
  const ROUGH_UPSILON = "ὑὕὓὗὙὝὛὟ";

  // Normalize (strip diacritics, keep Greek letters), lowercase
  function normalizeForLookup(word) {
    return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  // ---- OU “keep” & “collapse” sets (updated) ----
  // Keep whole-word OU (true diphthongs / particles)
  const KEEP_TRUE_OU_WORDS = new Set([
    'ουν','ου','ους','βους','τουτο','που',
    'ουκ','ουχ','ουχι','ουδε' // negative particle and friends
  ]);
  // Collapse ALL OU in entire lexeme (e.g., βουλή*, δοῦναι)
  const COLLAPSE_WHOLE_WORDS = new Set(['βουλη','βουλης','βουλην','δουναι']);

  // OU endings (updated: includes -ουντι)
  const ENDINGS = [
    { re: /ουσιν$/,  ouLen: 5 },
    { re: /ουσι$/,   ouLen: 4 },
    { re: /ουμεν$/,  ouLen: 5 },
    { re: /ουσα$/,   ouLen: 4 },
    { re: /ουντος$/, ouLen: 6 },
    { re: /ουντες$/, ouLen: 6 },
    { re: /ουντα$/,  ouLen: 5 },
    { re: /ουν$/,    ouLen: 3 }, // guarded by KEEP_TRUE_OU_WORDS (οὖν)
    { re: /ους$/,    ouLen: 3 },
    { re: /ου$/,     ouLen: 2 },
    { re: /ουμαι$/,  ouLen: 5 },
    { re: /ουται$/,  ouLen: 5 },
    { re: /ουνται$/, ouLen: 6 },
    { re: /ουμεθα$/, ouLen: 7 },
    { re: /ουσθε$/,  ouLen: 6 },
    { re: /ουσθαι$/, ouLen: 6 },
    { re: /ουμην$/,  ouLen: 5 },
    { re: /ουτο$/,   ouLen: 4 }, // guarded for demonstrative τοῦτο
    { re: /ουντο$/,  ouLen: 5 },
    { re: /ουντι$/,  ouLen: 5 }  // NEW
  ];

  // Reposition rough breathing for OU diphthongs:
  // α/ε/ο + (rough upsilon) → ͱ + (lowercase base) + υ
  function repositionRoughOU(s) {
    const chars = Array.from(s);
    const out = [];
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      const nextExists = i + 1 < chars.length;
      const n = nextExists ? chars[i + 1] : '';
      const isBase = (c === 'α' || c === 'Α' || c === 'ε' || c === 'Ε' || c === 'ο' || c === 'Ο');
      const isRoughU = nextExists && ROUGH_UPSILON.includes(n);
      if (isBase && isRoughU) {
        out.push('ͱ');      // small heta placeholder (later unified to Ͱ)
        out.push(c.toLowerCase());
        out.push('υ');
        i++;                // consume the rough‑upsilon char
        continue;
      }
      out.push(c);
    }
    return out.join('');
  }

  // NEW: collapse INTERNAL spurious OU from contractions (ε+ο, ο+ε, ο+ο)
  function collapseInternalOU(coreWord, showMacrons) {
    if (!OU_ANY_RE_ONE.test(coreWord)) return null;

    const norm = normalizeForLookup(coreWord);
    if (KEEP_TRUE_OU_WORDS.has(norm)) return null;

    const replacement = showMacrons ? 'Ō' : 'Ο';

    // participle stem: -οῦντ-
    const idxNT = norm.indexOf('ουντ');
    if (idxNT !== -1) {
      return coreWord.slice(0, idxNT) + replacement + coreWord.slice(idxNT + 2);
    }

    // middle/passive participle & related: -ούμεν-
    const idxME = norm.indexOf('ουμε');
    if (idxME !== -1) {
      return coreWord.slice(0, idxME) + replacement + coreWord.slice(idxME + 2);
    }

    // contracted οῦ anywhere inside
    const rawCirc = coreWord.indexOf('οῦ');
    if (rawCirc !== -1) {
      return coreWord.slice(0, rawCirc) + replacement + coreWord.slice(rawCirc + 2);
    }

    return null;
  }

  // Collapse the LAST ending-OU ONLY (index via normalized string)
  function collapseEndingOU(coreWord, showMacrons) {
    const norm = normalizeForLookup(coreWord);
    if (KEEP_TRUE_OU_WORDS.has(norm)) return null; // keep οὖν/οὐ/οὖς/βοῦς/τοῦτο/...

    for (const { re, ouLen } of ENDINGS) {
      const m = norm.match(re);
      if (!m) continue;
      if (norm === 'τουτο') continue; // guard demonstrative

      const start = norm.length - ouLen;      // position of ending's 'ο'
      const replacement = showMacrons ? 'Ō' : 'Ο';
      return coreWord.slice(0, start) + replacement + coreWord.slice(start + 2);
    }
    return null;
  }

  // ---- ἐν assimilation before β / π (no punctuation crossing) ----
  function applyEnAssimilation(tokens) {
    const isWhitespace  = s => /^[ \n\r\t]+$/.test(s);
    const isPunct       = s => /^[.,?!;:᾽'"]+$/.test(s);
    const startsWithBetaOrPi = s => {
      if (!s) return false;
      const look = s.replace(/^[\(\[\{«"“]+/, '');
      const first = look[0];
      return first === 'β' || first === 'Β' || first === 'π' || first === 'Π';
    };

    const out = tokens.slice();
    for (let i = 0; i < out.length; i++) {
      if (out[i] === 'ἐν') {
        let j = i + 1;
        while (j < out.length && isWhitespace(out[j])) j++;
        if (j < out.length && !isPunct(out[j]) && startsWithBetaOrPi(out[j])) {
          out[i] = 'ἐμ';
        }
      }
    }
    return out;
  }

  // ---- EI (spurious) helpers & rules (ported) ----
  // “keep as true ει” — exact forms
  const KEEP_TRUE_EI_WORDS = new Set([
    'ει',      // εἰ “if”
    'εις',     // prep. εἰς
    'ημεις',   // ἡμεῖς
    'υμεις',   // ὑμεῖς
    'ταθαμει', // project-specific keep from converter
    'δειν'     // δειν
  ]);
  // keep by stem prefix
  const KEEP_TRUE_EI_PREFIXES = ['πειρ']; // (σπειρ removed so verbs can collapse)

  // forced collapse (exact)
  const FORCE_EI_COLLAPSE_EXACT = new Set(['ειμι','ειναι']); // εἰμί, εἶναι

  // forced collapse (prefix stems)
  const FORCE_EI_COLLAPSE_PREFIXES = [
    'ξειν','στειν','κτειν','ιμειρ','μειζ','φθειρ',
    'τειν', // τείνω family
    'νειμ'  // νεῖμαι family
  ];

  // forced collapse (regex families) + guard
  const FORCE_EI_COLLAPSE_REGEXPS = [
    { re: /^χειρ(ων|ον|ονος|ονι|ονα|ιστ)/, guard: (original) => !/ῶ/.test(original) },
    { re: /^σπειρ(ω|εις|ει|ομεν|ετε|ουσιν?|ειν)$/, guard: null } // verbs only (not σπεῖρα)
  ];

  // LN aorists suffix families (augment-gated)
  const LN_ACTIVE_SUFFIXES = [
    // -ειλα
    'ειλα','ειλας','ειλε','ειλεν','ειλαμεν','ειλατε','ειλαν',
    // -εινα
    'εινα','εινας','εινε','εινεν','ειναμεν','εινατε','ειναν',
    // -ειρα
    'ειρα','ειρας','ειρε','ειρεν','ειραμεν','ειρατε','ειραν',
    // -ειμα (e.g., ἔνειμα)
    'ειμα','ειμας','ειμε','ειμεν','ειμαμεν','ειματε','ειμαν'
  ];
  const PREVERB_PREFIXES = [
    'απ','κατ','μετ','παρ','προσ','συν','εκ','εξ','εν','αν',
    'υπ','υπερ','προ','περι','παρα','εισ','αμφ','ανα','καθ','δια','δι'
  ];
  function hasAugmentLike(norm) {
    if (!norm) return false;
    if (norm.startsWith('ε') || norm.startsWith('η')) return true;
    for (const pv of PREVERB_PREFIXES) {
      if (norm.startsWith(pv + 'ε') || norm.startsWith(pv + 'η')) return true;
    }
    return false;
  }

  function isNumeralEis(word) {
    return word === 'εἷς' || word === 'Εἷς' || word === 'εἷΣ' || word === 'ΕἷΣ';
  }
  function isNonSpuriousEimi(original) {
    return original === 'εἶμι' || original === 'Εἶμι';
  }

  function collapseLiquidNasalAoristEI(coreWord, replacer) {
    const norm = normalizeForLookup(coreWord);
    if (!hasAugmentLike(norm)) return null;
    for (const suf of LN_ACTIVE_SUFFIXES) {
      if (norm.endsWith(suf)) {
        const start = norm.length - suf.length; // index of suffix's 'ε'
        return coreWord.slice(0, start) + replacer + coreWord.slice(start + 2);
      }
    }
    return null;
  }

  function collapseForcedLexemeEI(coreWord, replacer) {
    if (isNonSpuriousEimi(coreWord)) return null; // DO NOT collapse εἶμι
    const norm = normalizeForLookup(coreWord);

    // exact forms
    if (FORCE_EI_COLLAPSE_EXACT.has(norm)) {
      return coreWord.replace(EI_ANY_RE, replacer);
    }
    // patterned families (e.g., χείρων/χείριστος), with guard (avoid χερῶν)
    for (const { re, guard } of FORCE_EI_COLLAPSE_REGEXPS) {
      if (re.test(norm) && (!guard || guard(coreWord))) {
        return coreWord.replace(EI_ANY_RE, replacer);
      }
    }
    // stem prefixes (μείζ‑, φθείρ‑, τείν‑, νείμ‑, …)
    for (const p of FORCE_EI_COLLAPSE_PREFIXES) {
      if (norm.startsWith(p)) {
        return coreWord.replace(EI_ANY_RE, replacer);
      }
    }
    return null;
  }

  function collapseSpuriousEI(coreWord, replacer) {
    if (!EI_ANY_RE_ONE.test(coreWord)) return null;

    // εἷς → Ͱ + replacer + Σ (majuscule stream wants heta)
    if (isNumeralEis(coreWord)) return 'Ͱ' + replacer + 'Σ';

    // LN aorists (augment-gated)
    const ln = collapseLiquidNasalAoristEI(coreWord, replacer);
    if (ln !== null) return ln;

    // keep true diphthongs
    const norm = normalizeForLookup(coreWord);
    if (KEEP_TRUE_EI_WORDS.has(norm)) return null;
    for (const keepPref of KEEP_TRUE_EI_PREFIXES) {
      if (norm.startsWith(keepPref)) return null;
    }

    // forced lexemes/stems/patterns
    const forced = collapseForcedLexemeEI(coreWord, replacer);
    if (forced !== null) return forced;

    // generic spurious endings (collapse only the ending’s ει)
    const EI_ENDINGS = [
      { re: /ειν$/, eiLen: 3 },
      { re: /εις$/, eiLen: 3 },
      { re: /ει$/,  eiLen: 2 },
      { re: /ειται$/,  eiLen: 5 }, { re: /εισθε$/,  eiLen: 6 }, { re: /εισθαι$/, eiLen: 6 },
      { re: /ειτε$/,   eiLen: 4 }, { re: /ειτο$/,   eiLen: 4 }, { re: /ειμην$/,  eiLen: 5 },
      { re: /εισο$/,   eiLen: 4 }, { re: /ειμεν$/,  eiLen: 5 }, { re: /εισαν$/,  eiLen: 5 },
      { re: /εια$/,    eiLen: 3 },
      { re: /εις$/,    eiLen: 3 } // βασιλεῖς/πρέσβεις
    ];

    for (const { re, eiLen } of EI_ENDINGS) {
      const m = norm.match(re);
      if (!m) continue;
      const start = norm.length - eiLen; // index of ending's 'ε'
      return coreWord.slice(0, start) + replacer + coreWord.slice(start + 2);
    }
    return null;
  }

  // Per‑word OU handling with lexeme/ending/internal rules
  function processWordForArchaicOU(word, showMacrons) {
    const punctuationRegex = /[.,?!;:᾽'"]+$/;
    const trailing = (word.match(punctuationRegex) || [''])[0];
    let core = word.replace(punctuationRegex, '');
    if (!core) return word;

    // 0) Restore rough‑OU placement
    core = repositionRoughOU(core);

    // 1) Try INTERNAL contracted OU first
    const internal = collapseInternalOU(core, showMacrons);
    if (internal !== null) {
      core = internal;
    }

    // 2) If no OU now, skip
    if (!OU_ANY_RE_ONE.test(core)) {
      return core + trailing;
    }

    const norm = normalizeForLookup(core);

    // 3) Whole‑word keep (οὐκ, οὐ, οὖν, βοῦς, τοῦτο, που, …)
    if (KEEP_TRUE_OU_WORDS.has(norm)) {
      return core + trailing;
    }

    // 4) Whole‑lexeme force collapse (βουλή*, δοῦναι)
    if (COLLAPSE_WHOLE_WORDS.has(norm)) {
      const replacement = showMacrons ? 'Ō' : 'Ο';
      const replaced = core.replace(OU_ANY_RE, replacement);
      return replaced + trailing;
    }

    // 5) Ending‑only collapse
    const collapsed = collapseEndingOU(core, showMacrons);
    if (collapsed !== null) return collapsed + trailing;

    // 6) Default: leave true OU; mapping will make ΟΥ
    return core + trailing;
  }

  // Per‑word EI handling (collapse to Ε or Ē before mapping)
  function processWordForArchaicEI(word, showMacrons) {
    const punctuationRegex = /[.,?!;:᾽'"]+$/;
    const trailing = (word.match(punctuationRegex) || [''])[0];
    let core = word.replace(punctuationRegex, '');
    if (!core) return word;

    const replacer = showMacrons ? 'Ē' : 'Ε';
    const collapsed = collapseSpuriousEI(core, replacer);
    if (collapsed !== null) return collapsed + trailing;

    return core + trailing;
  }

  // ======================= 4) CORE CONVERTER =======================
  const diphthongVowelBases = new Set(['α','ε','ο','η','ω','Α','Ε','Ο','Η','Ω']);
  const roughBreathingSecond = new Set([
    'ἱ','ἵ','ἳ','ἷ','Ἱ','Ἵ','Ἳ','Ἷ',  // iota rough
    'ὑ','ὕ','ὓ','ὗ','Ὑ','Ὕ','Ὓ','Ὗ'   // upsilon rough
  ]);

  // Convert a *single Greek word* to archaic majuscule with current macron mode
  function convertToArchaic(word) {
    const normalizedInput = word.normalize('NFC');

    // OU + EI morphology (internal/ending/lexeme rules; augment‑gated LN aorists; keeps)
    const afterOU = processWordForArchaicOU(normalizedInput, MACRONS_ON);
    const prepped  = processWordForArchaicEI(afterOU, MACRONS_ON);

    // Map char‑by‑char; handle rough second‑vowel diphthongs for big H (Ͱ) placement
    let out = '';
    for (let i = 0; i < prepped.length; i++) {
      const ch = prepped[i];
      const prev = i > 0 ? prepped[i - 1] : null;

      if (prev && diphthongVowelBases.has(prev) && roughBreathingSecond.has(ch)) {
        const prevOut = mapChar(prev);
        // Remove previously appended prevOut (we're going to prepend Ͱ instead)
        out = out.slice(0, -prevOut.length);
        const currNoBreath = mapChar(ch).replace(/[ͱͰ]/g, '');
        out += 'Ͱ' + prevOut + currNoBreath;
        continue;
      }

      out += mapChar(ch);
    }

    // Unify small heta → big; force Ω/ω → Ο; κφ → ΧΦ after uppercasing
    out = out.replace(/ͱ/g, 'Ͱ').replace(/[Ωω]/g, 'Ο');
    out = out.replace(/ΚΦ/g, 'ΧΦ');

    return out;
  }

  // ======================= 5) NODE PROCESSING =======================
  // Detect nodes to process (Greek blocks or Latin macron letters)
//  const ALL_GREEK_CHARS_REGEX = /([\u0100\u0112\u012a\u014c\u016a\u0232\u0370-\u03FF\u1F00-\u1FFF]+)/gu;
const ALL_GREEK_CHARS_REGEX = /([\u0100\u0101\u0112\u0113\u012A\u012B\u014C\u014D\u016A\u016B\u0232\u0233\u0370\u0371\u0390\u0391\u0392\u0393\u0394\u0395\u0396\u0397\u0398\u0399\u039A\u039B\u039C\u039D\u039F\u03A0\u03A1\u03A3\u03A4\u03A5\u03A6\u03A7\u03A9\u03AC\u03AD\u03AE\u03AF\u03B1\u03B2\u03B3\u03B4\u03B5\u03B6\u03B7\u03B8\u03B9\u03BA\u03BB\u03BC\u03BD\u03BE\u03BF\u03C0\u03C1\u03C2\u03C3\u03C4\u03C5\u03C6\u03C7\u03C8\u03c9\u03CA\u03CC\u03CE\u03CD\u1F00\u1F02\u1F04\u1F06\u1F08\u1F0A\u1F0C\u1F0E\u1F10\u1F12\u1F14\u1F18\u1F1A\u1F1C\u1F20\u1F21\u1F22\u1F24\u1F26\u1F28\u1F2A\u1F2C\u1F2E\u1F30\u1F34\u1F36\u1F38\u1F3A\u1F3C\u1F3E\u1F40\u1F42\u1F44\u1F48\u1F4A\u1F4C\u1F50\u1F52\u1F54\u1F56\u1F5D\u1F60\u1F62\u1F66\u1F68\u1F6A\u1F6C\u1F6E\u1F70\u1F72\u1F74\u1F76\u1F78\u1F7A\u1F7C\u1F80\u1FB6\u1FC6\u1FD6\u1FE6\u1FF6\u{10144}\u{10145}\u002c\u002e\u0022\u003a\u0027\u003b])/gu;

  function processAndWrap(rootNode) {
    if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE, Node.DOCUMENT_FRAGMENT_NODE].includes(rootNode.nodeType)) {
      return;
    }

    const walker = document.createTreeWalker(
      rootNode,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const p = node.parentElement;
          if (!p) return NodeFilter.FILTER_REJECT;
          if (isEditableRoot(p)) return NodeFilter.FILTER_REJECT;

          const tag = p.tagName ? p.tagName.toUpperCase() : '';
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') return NodeFilter.FILTER_REJECT;
          if (p.closest('.archaic-greek-text')) return NodeFilter.FILTER_REJECT;

          if (ALL_GREEK_CHARS_REGEX.test(node.nodeValue)) {
            ALL_GREEK_CHARS_REGEX.lastIndex = 0;
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );

    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);

    const TOKEN_SPLIT = /([ \n\r\t.,?!;:᾽'"]+)/; // spaces & punctuation as standalone tokens
    const GREEK_RE = /[\u0370-\u03FF\u1F00-\u1FFF]/; // does token contain Greek?

    for (const node of nodes) {
      const text = node.nodeValue;
      const parts = text.split(TOKEN_SPLIT);

      // ἐν → ἐμ before β/π across whitespace (no punctuation)
      const tokens = applyEnAssimilation(parts);

      const frag = document.createDocumentFragment();
      for (const tok of tokens) {
        if (!tok) continue;

        // whitespace or punctuation → keep as text
        if (/^[ \n\r\t]+$/.test(tok) || /^[.,?!;:᾽'"]+$/.test(tok)) {
          frag.appendChild(document.createTextNode(tok));
          continue;
        }

        // If token contains Greek, convert & wrap; else keep as text
        if (GREEK_RE.test(tok)) {
          const span = document.createElement('span');
          span.className = 'archaic-greek-text';
          span.setAttribute('data-original', tok);
          span.textContent = convertToArchaic(tok);
          frag.appendChild(span);
        } else {
          frag.appendChild(document.createTextNode(tok));
        }
      }

      if (node.parentNode) node.parentNode.replaceChild(frag, node);
    }
  }

  function reconvertAll(root = document) {
    root.querySelectorAll('.archaic-greek-text').forEach(span => {
      const original = span.getAttribute('data-original');
      if (original != null) {
        span.textContent = convertToArchaic(original);
      }
    });
  }

  // ======================= 6) DYNAMIC CONTENT HANDLING =======================
  // Initial pass
  processAndWrap(document.body);

  // Queue + throttle for observer flush
  const pending = new Set();
  let flushTimer = null;
  const FLUSH_DELAY = 50;
  const BATCH_SIZE = 20;

  function enqueue(node) {
    let el = null;
    if (node.nodeType === Node.ELEMENT_NODE) el = node;
    else if (node.nodeType === Node.TEXT_NODE) el = node.parentElement;
    if (!el) return;
    if (!document.body.contains(el)) return;
    if (isEditableRoot(el)) return;
    pending.add(el);
  }

  function minimizeRoots(nodes) {
    const set = new Set(nodes);
    return nodes.filter(n => {
      let p = n.parentElement;
      while (p) {
        if (set.has(p)) return false;
        p = p.parentElement;
      }
      return true;
    });
  }

  function scheduleFlush() {
    if (flushTimer) return;
    flushTimer = setTimeout(flush, FLUSH_DELAY);
  }

  function flush() {
    flushTimer = null;
    const unique = Array.from(pending);
    pending.clear();

    const roots = minimizeRoots(unique);
    let index = 0;

    function step() {
      const end = Math.min(index + BATCH_SIZE, roots.length);
      for (; index < end; index++) {
        processAndWrap(roots[index]);
      }
      if (index < roots.length) {
        setTimeout(step, 16);
      }
    }
    step();
  }

  // ======================= 7) MACRON TOGGLE UI =======================
  (function injectMacronToggle() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'macronToggle';
    btn.textContent = 'Macrons: ' + (MACRONS_ON ? 'ON' : 'OFF');
    btn.style.cssText = [
      'position:fixed',
      'right:14px',
      'bottom:14px',
      'z-index:2147483647',
      'padding:8px 12px',
      'border-radius:10px',
      'border:1px solid rgba(255,255,255,.2)',
      'background:#111',
      'color:#eee',
      'font:600 12px system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
      'box-shadow:0 2px 8px rgba(0,0,0,.3)',
      'cursor:pointer',
      'opacity:.85'
    ].join(';');

    btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
    btn.addEventListener('mouseleave', () => btn.style.opacity = '.85');

    btn.addEventListener('click', () => {
      MACRONS_ON = !MACRONS_ON;
      btn.textContent = 'Macrons: ' + (MACRONS_ON ? 'ON' : 'OFF');
      reconvertAll();
    });

    document.documentElement.appendChild(btn);
  })();

  // ======================= 8) MUTATION OBSERVER =======================
  const observer = new MutationObserver((mutations) => {
    const all = mutations.concat(observer.takeRecords());
    for (const m of all) {
      if (m.type === 'childList') {
        m.addedNodes.forEach(enqueue);
        enqueue(m.target);
      } else if (m.type === 'characterData') {
        enqueue(m.target);
        enqueue(m.target.parentElement);
      }
    }
    scheduleFlush();
  });

  observer.observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true
  });
})();
