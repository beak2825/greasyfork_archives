// ==UserScript==
// @name         WTR-LAB Pronouns Fix
// @namespace    https://github.com/youaremyhero/WTR-LAB-Pronouns-Fix
// @version     1.0.0
// @description  Uses a custom JSON glossary on Github to detect gender and changes pronouns on WTR-Lab for a better reading experience.
// @match        *://wtr-lab.com/en/novel/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wtr-lab.com
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @connect      gist.githubusercontent.com
// @connect      githubusercontent.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559092/WTR-LAB%20Pronouns%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/559092/WTR-LAB%20Pronouns%20Fix.meta.js
// ==/UserScript==

(() => {
  "use strict";
  if (!location.hostname.endsWith("wtr-lab.com")) return;

    /* ==========================================================
     CONTRACT (Global)
     - No background polling that mutates content outside chapter-reading pages.
     - All mutations flow through requestRun() → run() single-flight funnel.
     - Infinite reader: per-body forced runs + sweepInfiniteBodies() own correctness.
     ========================================================== */

  /* ==========================================================
   MAP (Search tokens)
   - @CFG   Settings / constants
   - @KEYS  Storage keys
   - @GATE  Page gating / chapter detection
   - @ROOT  Root resolution / root observers
   - @NAV   Navigation detection (Next/TOC/history/url)
   - @SCHED Scheduler (requestRun/drainPendingForced)
   - @RUN   Mutation pipeline (run/apply/markers/signatures)
   - @INF   Infinite reader sweep/per-body runs
   - @UI    UI / pill / onboarding
   - @GLOSS Glossary loader/cache/pickKey
   - @TERM  Term memory / pinned replacement
   - @GENDER Gender inference / carry / heuristics
   - @PRON  Pronoun replacement (smart/sentence-scoped)
   ========================================================== */

  // Enables verbose lifecycle logging.
  // Do NOT gate error or glossary-failure logs behind DEBUG.
  const DEBUG = false;

/* =========================
   @CFG USER SETTINGS
   ========================= */

  const GLOSSARY_URL =
    "https://raw.githubusercontent.com/youaremyhero/WTR-LAB-Pronouns-Fix/main/glossary.template.json"; // duplicate this file to your Github repo and change the link

  const DEFAULT_CARRY_PARAGRAPHS = 2;
  const EARLY_PRONOUN_WINDOW = 160;
  const LOCAL_ANCHOR_WINDOW = 160;
  const MAX_NAMES_SHOWN = 3;

  const TERM_MEM_MAX_KEYS = 300;

  const GLOSSARY_CACHE_KEY = "wtrpf_glossary_cache_v1";
  const GLOSSARY_CACHE_TS  = "wtrpf_glossary_cache_ts_v1";
  const GLOSSARY_CACHE_TTL_MS = 10 * 60 * 1000;

  const UI_KEY_MIN = "wtrpf_ui_min_v1";
  const UI_KEY_POS = "wtrpf_ui_pos_v1";
  const UI_KEY_ON  = "wtrpf_enabled_v1";

  const DRAFT_KEY_PREFIX = "wtrpf_draft_v1:";
  const TERM_MEM_KEY_PREFIX = "wtrpf_term_mem_v1:";
  const CHAPTER_STATE_KEY_PREFIX = "wtrpf_chapter_state_v1:";

  const SELF_MUTATION_COOLDOWN_MS = 450;

  const NAV_SWEEP_MS = 8000;
  const NAV_POLL_MS  = 250;
  const CHAPTER_MONITOR_MS = 500;      // watchdog interval
  const CHAPTER_MONITOR_WARMUP_MS = 12000; // optional: run more often right after load/nav


  const LONGPRESS_MS = 420;

  const CHAPTER_OBS_DEBOUNCE_MS = 180;

  // Post-render resilience (React re-render overwrite protection)
  const POST_SWEEP_DELAYS = [150, 450, 900, 1600, 2600];
  const APPLIED_SIG_KEY_PREFIX = "wtrpf_applied_sig_v1:"; // per novelKey

/* =========================
   @UTIL UTILITIES
   ========================= */

  const SENT_PREFIX = String.raw`(^|[\r\n]+|[.!?…]\s+)(["'“‘(\[]\s*)?`;
  const LETTER = String.raw`\p{L}`;

  const RX_PRONOUN_MALE = /\b(he|him|his|himself)\b/gi;
  const RX_PRONOUN_FEMALE = /\b(she|her|hers|herself)\b/gi;

  const RX_ATTACK_CUES = /\b(knife|blade|sword|dagger|stab|stabs|stabbed|slash|slashed|strike|struck|hit|hits|punched|kicked|cut|pierce|pierced|neck|chest)\b/i;

  function caseLike(src, target) {
    if (!src) return target;
    if (src.toUpperCase() === src) return target.toUpperCase();
    if (src[0] === src[0].toUpperCase()) return target[0].toUpperCase() + target.slice(1);
    return target.toLowerCase();
  }

  function normalizeWeirdSpaces(s) {
    return String(s || "").replace(/\u00A0|\u2009|\u202F/g, " ");
  }

  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function wordBoundaryRegex(phrase) {
    // Unicode-ish boundaries: not a letter/number/_ on either side
    const p = escapeRegExp(String(phrase || "").trim());
    if (!p) return null;
    return new RegExp(String.raw`(^|[^\p{L}\p{N}_])(${p})(?=[^\p{L}\p{N}_]|$)`, "giu");
  }

  /* =========================
     Word-boundary regex cache (perf)
     ========================= */
  const _wtrpfWordRxCache = new Map();

  function wordBoundaryRegexCached(phrase) {
    const key = normalizeWeirdSpaces(String(phrase || "")).trim();
    if (!key) return null;
    if (_wtrpfWordRxCache.has(key)) return _wtrpfWordRxCache.get(key);
    const rx = wordBoundaryRegex(key);
    _wtrpfWordRxCache.set(key, rx);
    return rx;
  }

  function findAllMatches(rx, text, max = 20) {
    rx.lastIndex = 0;
    const out = [];
    let m;

    while ((m = rx.exec(text)) && out.length < max) {
      // WordBoundaryRegex structure is:
      //  (1) left boundary group, (2) the actual phrase
      const left = m[1] || "";
      const phrase = m[2] || m[0] || "";
      const phraseIndex = (m.index || 0) + left.length; // <-- centers on actual name
      out.push({ index: phraseIndex, match: phrase });
    }

    return out;
  }

// CONTRACT (scoreGenderInText)
// @GENDER Weighted scoring of name + pronoun proximity
  function scoreGenderInText(text, entries) {
    const s = normalizeWeirdSpaces(String(text || ""));
    const sL = s.toLowerCase();
    if (!sL) return null;
  
    // Weak global pronoun signal
    const maleP = countMatches(RX_PRONOUN_MALE, s);
    const femP  = countMatches(RX_PRONOUN_FEMALE, s);
  
    // If paragraph contains only pronouns and no names, don’t “invent” a gender
    let anyNameHit = false;
  
    const candidates = []; // { gender, score, name }
  
    for (const [name, info] of entries) {
      const g = String(info?.gender || "").toLowerCase();
      if (g !== "male" && g !== "female") continue;
  
      const aliases = Array.isArray(info?.aliases) ? info.aliases : [];
      const names = [name, ...aliases]
        .filter(Boolean)
        .map(x => normalizeWeirdSpaces(String(x)).trim())
        .filter(Boolean)
        .sort((a, b) => b.length - a.length);
  
      // Cheap prefilter: if none of the names/aliases even appear as substrings, skip regex work
      let mightAppear = false;
      for (const n of names) {
        if (n && sL.includes(n.toLowerCase())) { mightAppear = true; break; }
      }
      if (!mightAppear) continue;
  
      let hitScore = 0;
      let hitCount = 0;
  
      for (const n of names) {
        const rx = wordBoundaryRegexCached(n);
        if (!rx) continue;
  
        // Cap matches so long paragraphs don’t explode CPU
        const matches = findAllMatches(rx, s, 12);
        if (!matches.length) continue;
  
        anyNameHit = true;
        hitCount += matches.length;
  
        for (const mm of matches) {
          // NOTE: mm.index is the match start in the full string
          const center = mm.index;
  
          // Local window around the name mention
          const lo = Math.max(0, center - 180);
          const hi = Math.min(s.length, center + 260);
          const window = s.slice(lo, hi);
  
          const mLocal = countMatches(RX_PRONOUN_MALE, window);
          const fLocal = countMatches(RX_PRONOUN_FEMALE, window);
  
          // Base: “name present”
          hitScore += 6;
  
          // Local pronouns bias the name’s known gender
          if (g === "male") {
            hitScore += mLocal * 2;
            hitScore -= fLocal * 1;
          } else {
            hitScore += fLocal * 2;
            hitScore -= mLocal * 1;
          }
        }
      }
  
      if (hitCount > 0) {
        // Small “name repetition” bonus (capped)
        hitScore += clamp(hitCount, 0, 3);
  
        // Small global pronoun nudge (kept weak)
        const globalBias =
          (g === "male" ? maleP : femP) - (g === "male" ? femP : maleP);
        hitScore += clamp(globalBias, -2, 3);
  
        candidates.push({ gender: g, score: hitScore, name });
      }
    }
  
    if (!anyNameHit) return null;
    if (!candidates.length) return null;
  
    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];
    const second = candidates[1];
  
    // Require separation so pronouns don’t flip-flop in mixed paragraphs
    if (second && (best.score - second.score) < 4) return null;
  
    // Require minimum confidence
    if (best.score < 6) return null;
  
    return best.gender;
  }

  function isSceneBreak(t) {
    const s = (t || "").trim();
    return (s === "***" || s === "— — —" || /^(\*{3,}|-{3,}|={3,}|_{3,})$/.test(s));
  }

  function startsWithPronoun(t) {
    const s = (t || "").trim();
    return /^["'“‘(\[]?\s*(she|he|her|him|his|hers|herself|himself)\b/i.test(s);
  }

  function pronounAppearsEarly(t, limit = EARLY_PRONOUN_WINDOW) {
    const s = (t || "").trim();
    return /\b(she|he|her|him|his|hers|herself|himself)\b/i.test(s.slice(0, limit));
  }

  function countMatches(rx, text) {
    rx.lastIndex = 0;
    const m = String(text).match(rx);
    return m ? m.length : 0;
  }

  function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }

  /* =========================
   Sentence helpers (NEW)
   ========================= */

  function splitIntoSentencesLoose(s) {
    const out = [];
    let start = 0;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (ch === "." || ch === "!" || ch === "?" || ch === "…" || ch === "\n") {
        const end = i + 1;
        out.push(s.slice(start, end));
        start = end;
      }
    }
    if (start < s.length) out.push(s.slice(start));
    return out.filter(x => x && x.trim().length);
  }
  
  function sentenceIsSafeForGender(sentence, gender) {
    const m = countMatches(RX_PRONOUN_MALE, sentence);
    const f = countMatches(RX_PRONOUN_FEMALE, sentence);
  
    if (gender === "female") {
      if (m <= 0) return false;
      if (f > 0 && f >= m) return false;
      return true;
    } else {
      if (f <= 0) return false;
      if (m > 0 && m >= f) return false;
      return true;
    }
  }

// CONTRACT (replacePronounsSentenceScoped)
// @PRON Sentence-scoped replacement for mixed paragraphs
  function replacePronounsSentenceScoped(text, gender) {
    const dir = (gender === "female") ? "toFemale" : "toMale";
    const parts = splitIntoSentencesLoose(text);
    if (!parts.length) return { text, changed: 0 };
  
    let changed = 0;
    const out = parts.map(seg => {
      if (!sentenceIsSafeForGender(seg, gender)) return seg;
      const r = replacePronounsSmart(seg, dir);
      if (r.changed) changed += r.changed;
      return r.text;
    }).join("");
  
    return { text: out, changed };
  }

/* =========================
  Carry guard: block carry when opposite-gender character appears early
  (word-boundary aware + skip tiny aliases)
// CONTRACT (carryGuardAllows)
// @GENDER Carry-heuristic safety guard (prevents cross-character bleed)
 ========================= */
function carryGuardAllows(text, assumedGender, entries, limit = 220) {
  const s = normalizeWeirdSpaces(String(text || "")).slice(0, limit);
  const sL = s.toLowerCase();

  for (const [name, info] of entries) {
    const g = String(info?.gender || "").toLowerCase();
    if (g !== "male" && g !== "female") continue;
    if (g === assumedGender) continue;

    const aliases = Array.isArray(info?.aliases) ? info.aliases : [];
    const names = [name, ...aliases]
      .filter(Boolean)
      .map(x => normalizeWeirdSpaces(String(x)).trim())
      .filter(Boolean);

    for (const n of names) {
      if (n.length < 3) continue;                 // avoid tiny alias false positives
      if (!sL.includes(n.toLowerCase())) continue; // cheap prefilter

      const rx = wordBoundaryRegexCached(n);
      if (rx) {
        rx.lastIndex = 0;
        if (rx.test(s)) return false;
      }
    }
  }
  return true;
}

// CONTRACT (getUrlChapterId)
// @CID Chapter ID from URL (fast, authoritative)
  function getUrlChapterId() {
    const m = location.href.match(/\/chapter-(\d+)(?:\/|$|\?)/i);
    return m ? `chapter-${m[1]}` : "unknown";
  }

// CONTRACT (getDomChapterId)
// @CID Chapter ID from DOM (tracker-based, infinite-safe)
  function getDomChapterId(root) {
    // Preferred: tracker element
    const tracker =
      document.querySelector(".chapter-tracker.active[data-chapter-no]") ||
      root?.closest?.(".chapter-infinite-reader")?.querySelector?.(".chapter-tracker.active[data-chapter-no]") ||
      null;
  
    const no = tracker?.getAttribute?.("data-chapter-no");
    if (no && /^\d+$/.test(no)) return `chapter-${no}`;
  
    // Fallback: tracker id="tracker-776"
    const tid = tracker?.id || "";
    const m1 = tid.match(/tracker-(\d+)/i);
    if (m1) return `chapter-${m1[1]}`;
  
    // Fallback: if they ever put chapter number on container ids like id="chapter-775"
    const host =
      root?.closest?.("[id^='chapter-']") ||
      root?.querySelector?.("[id^='chapter-']") ||
      null;
    const hid = host?.id || "";
    const m2 = hid.match(/chapter-(\d+)/i);
    if (m2) return `chapter-${m2[1]}`;
  
    // Legacy fallback — keep last
    const el = root?.closest?.("[data-chapter-id]") || root?.querySelector?.("[data-chapter-id]");
    const id = el?.getAttribute?.("data-chapter-id");
    if (id) return id;
  
    return "unknown";
  }

// CONTRACT (hash32)
// @SIG Cheap deterministic hash for sampled content (fast enough for innerText)
  function hash32(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) + h) ^ str.charCodeAt(i);
    }
    return (h >>> 0).toString(16);
  }

  /* =========================
     A) Fast sampled text + signature
     Notes:
     - Called from run(), nav sweep, monitor, and infinite sweeper.
     - Keep it cheap; avoid full-root innerText hashing.
     ========================= */
    
    function getSampledText(root, { head = 6, tail = 2 } = {}) {
      if (!root) return "";
      const blocks = getTextBlocks(root);
      if (!blocks.length) return "";
    
      const pick = [];
      const n = blocks.length;
    
      const h = Math.min(head, n);
      for (let i = 0; i < h; i++) pick.push(blocks[i]);
    
      const t = Math.min(tail, Math.max(0, n - h));
      for (let i = n - t; i < n; i++) if (i >= 0) pick.push(blocks[i]);
    
      return pick
        .map(b => normalizeWeirdSpaces((b.textContent || "").trim()))
        .filter(Boolean)
        .join("\n");
    }
    
    function approxChapterMetrics(root) {
      const blocks = getTextBlocks(root);
      let totalLen = 0;
      // cheap-ish length sum
      for (const b of blocks) totalLen += ((b.innerText || "").length || 0);
      return { blocksCount: blocks.length, totalLen };
    }


// CONTRACT (chapterSignature)
// @SIG Chapter signature (blocks + length + sampled hash)
  function chapterSignature(root, forcedCid = null) {
    if (!root) return "";
    const cid = forcedCid || getChapterId(root) || "unknown";
    const { blocksCount, totalLen } = approxChapterMetrics(root);
    const sampled = getSampledText(root, { head: 6, tail: 2 });
    const h = sampled ? hash32(sampled) : "0";
    return `${cid}|b:${blocksCount}|len:${totalLen}|h:${h}`;
  }

  function appliedSigKey(novelKey) {
    return APPLIED_SIG_KEY_PREFIX + novelKey;
  }
  function loadAppliedSigMap(novelKey) {
    try {
      return JSON.parse(sessionStorage.getItem(appliedSigKey(novelKey)) || "{}");
    } catch {
      return {};
    }
  }
  function saveAppliedSigMap(novelKey, map) {
    sessionStorage.setItem(appliedSigKey(novelKey), JSON.stringify(map || {}));
  }
  function getAppliedSig(novelKey, chapterId) {
    const m = loadAppliedSigMap(novelKey);
    return String(m?.[chapterId] || "");
  }
  function setAppliedSig(novelKey, chapterId, sig) {
    const m = loadAppliedSigMap(novelKey);
    m[chapterId] = String(sig || "");
    saveAppliedSigMap(novelKey, m);
  }


/* =========================
   PRONOUN REPLACEMENT
   ========================= */
// CONTRACT (replacePronounsSmart)
// @PRON Core pronoun replacement engine (case-aware, possessive-safe)
  function replacePronounsSmart(text, direction) {
    text = normalizeWeirdSpaces(text);
    const original = text;
    let changed = 0;

    const rep = (rx, toFn) => {
      text = text.replace(rx, (m, ...rest) => {
        const out = toFn(m, ...rest);
        if (out !== m) changed++;
        return out;
      });
    };

    if (direction === "toFemale") {
      rep(/\bhim[\s\u00A0\u2009\u202F-]*self\b/giu, (m) => caseLike(m, "herself"));
    } else {
      rep(/\bher[\s\u00A0\u2009\u202F-]*self\b/giu, (m) => caseLike(m, "himself"));
    }

    if (direction === "toMale") {
      rep(new RegExp(SENT_PREFIX + `(she)\\b`, "giu"), (m, p1, p2, w) => `${p1}${p2 || ""}${caseLike(w, "He")}`);
      rep(new RegExp(SENT_PREFIX + `(herself)\\b`, "giu"), (m, p1, p2, w) => `${p1}${p2 || ""}${caseLike(w, "Himself")}`);
      rep(new RegExp(SENT_PREFIX + `(hers)\\b`, "giu"), (m, p1, p2, w) => `${p1}${p2 || ""}${caseLike(w, "His")}`);
      rep(new RegExp(SENT_PREFIX + `(her)\\b(?=\\s+${LETTER})`, "giu"), (m, p1, p2, w) => `${p1}${p2 || ""}${caseLike(w, "His")}`);
      rep(new RegExp(SENT_PREFIX + `(her)\\b(?!\\s+${LETTER})`, "giu"), (m, p1, p2, w) => `${p1}${p2 || ""}${caseLike(w, "Him")}`);
    } else {
      rep(new RegExp(SENT_PREFIX + `(he)\\b`, "giu"), (m, p1, p2, w) => `${p1}${p2 || ""}${caseLike(w, "She")}`);
      rep(new RegExp(SENT_PREFIX + `(himself)\\b`, "giu"), (m, p1, p2, w) => `${p1}${p2 || ""}${caseLike(w, "Herself")}`);
      rep(new RegExp(SENT_PREFIX + `(him)\\b`, "giu"), (m, p1, p2, w) => `${p1}${p2 || ""}${caseLike(w, "Her")}`);
      rep(new RegExp(SENT_PREFIX + `(his)\\b(?=\\s+${LETTER})`, "giu"), (m, p1, p2, w) => `${p1}${p2 || ""}${caseLike(w, "Her")}`);
      rep(new RegExp(SENT_PREFIX + `(his)\\b(?!\\s+${LETTER})`, "giu"), (m, p1, p2, w) => `${p1}${p2 || ""}${caseLike(w, "Hers")}`);
    }

    if (direction === "toMale") {
      rep(/\bshe\b/giu, (m) => caseLike(m, "he"));
      rep(/\bherself\b/giu, (m) => caseLike(m, "himself"));
      rep(/\bhers\b/giu, (m) => caseLike(m, "his"));
      rep(new RegExp(String.raw`\bher\b(?=\s+${LETTER})`, "giu"), (m) => caseLike(m, "his"));
      rep(/\bher\b/giu, (m) => caseLike(m, "him"));
    } else {
      rep(/\bhe\b/giu, (m) => caseLike(m, "she"));
      rep(/\bhimself\b/giu, (m) => caseLike(m, "herself"));
      rep(/\bhim\b/giu, (m) => caseLike(m, "her"));
      rep(new RegExp(String.raw`\bhis\b(?=\s+${LETTER})`, "giu"), (m) => caseLike(m, "her"));
      rep(/\bhis\b/giu, (m) => caseLike(m, "hers"));
    }

    return { text, changed: text === original ? 0 : changed };
  }

  function conservativeShouldApply(region, gender) {
    const maleCount = countMatches(RX_PRONOUN_MALE, region);
    const femCount = countMatches(RX_PRONOUN_FEMALE, region);
    if (gender === "male") return femCount > 0;
    return maleCount > 0;
  }

/* =========================
   ANCHORED FIXES
   ========================= */

  function getSentenceEndIndex(s, start, maxExtra = 320) {
    const limit = Math.min(s.length, start + maxExtra);
    for (let i = start; i < limit; i++) {
      const ch = s[i];
      if (ch === "." || ch === "!" || ch === "?" || ch === "…" || ch === "\n") return i + 1;
    }
    return Math.min(s.length, start + maxExtra);
  }

  function detectPassiveAgentGender(text, entries) {
    const s = text;
    for (const [name, info] of entries) {
      const g = String(info.gender || "").toLowerCase();
      if (g !== "male" && g !== "female") continue;
      const nEsc = escapeRegExp(name);
      const rx = new RegExp(String.raw`\b(?:was|were|is|are|been)\b[^.?!\n]{0,80}\bby\s+${nEsc}\b`, "i");
      if (rx.test(s)) return g;
    }
    return null;
  }

  function detectDialogueSpeakerGender(text, entries) {
    const s = text;
    const found = [];
    for (const [name, info] of entries) {
      const g = String(info.gender || "").toLowerCase();
      if (g !== "male" && g !== "female") continue;
      const nEsc = escapeRegExp(name);

      const rx1 = new RegExp(String.raw`["“][^"”]{3,}["”]\s*(?:,?\s*)?(?:said|asked|shouted|whispered|replied|muttered|yelled)\s+${nEsc}\b`, "i");
      const rx2 = new RegExp(String.raw`\b${nEsc}\b\s*(?:said|asked|shouted|whispered|replied|muttered|yelled)\s*(?:,?\s*)?["“]`, "i");

      if (rx1.test(s) || rx2.test(s)) found.push(g);
    }
    if (!found.length) return null;
    return found.every(x => x === found[0]) ? found[0] : null;
  }

  function applyAnchoredFixes(text, entries, opts) {
    let changed = 0;
    let s = normalizeWeirdSpaces(text);

    const { verbBasedWindow = false, passiveVoice = false, onlyChangeIfWrong = false } = opts;

    for (const [name, info] of entries) {
      const gender = String(info.gender || "").toLowerCase();
      if (gender !== "male" && gender !== "female") continue;

      const strictPossessive = !!info.strictPossessive;

      const allNames = [name, ...(Array.isArray(info.aliases) ? info.aliases : [])]
        .filter(Boolean)
        .sort((a, b) => String(b).length - String(a).length);

      const dir = (gender === "female") ? "toFemale" : "toMale";

    for (const n of allNames) {
      const re = wordBoundaryRegexCached(n);
      if (!re) continue;
      re.lastIndex = 0;
    
      let m;
      while ((m = re.exec(s)) !== null) {
        // wordBoundaryRegex() structure:
        //  (1) left boundary group, (2) the actual phrase
        const left = m[1] || "";
        const hit = m[2] || n;
        const start = (m.index || 0) + left.length;
    
        const baseEnd = verbBasedWindow
          ? getSentenceEndIndex(s, start + hit.length, 360)
          : Math.min(s.length, start + hit.length + LOCAL_ANCHOR_WINDOW);
    
        let end = baseEnd;
        if (strictPossessive) end = Math.min(s.length, Math.max(end, start + hit.length + 220));
    
        const region = s.slice(start, end);
        if (onlyChangeIfWrong && !conservativeShouldApply(region, gender)) continue;
    
        let out = replacePronounsSmart(region, dir);
    
        if (passiveVoice) {
          const gAgent = detectPassiveAgentGender(region, entries);
          if (gAgent) {
            const d2 = (gAgent === "female") ? "toFemale" : "toMale";
            const out2 = replacePronounsSmart(out.text, d2);
            out = { text: out2.text, changed: out.changed + out2.changed };
          }
        }
    
        if (out.text !== region) {
          s = s.slice(0, start) + out.text + s.slice(end);
          changed += Math.max(1, out.changed);
    
          // IMPORTANT: re-sync lastIndex to prevent loop forever or skip
          re.lastIndex = start + out.text.length;
        }
      }
    }

    }

    return { text: s, changed };
  }

/* =========================
   TERM MEMORY
   ========================= */

  function getNovelKeyFromURL() {
    const m = location.href.match(/wtr-lab\.com\/en\/novel\/(\d+)\//i);
    return m ? `wtr-lab.com/en/novel/${m[1]}/` : "wtr-lab.com/en/novel/";
  }

  function createNovelKeyReloadGuard(getNovelKey) {
    const RELOAD_GUARD_KEY = "wtrpf_reload_guard_href_v1";
    let lastNovelKey = getNovelKey();
  
    function check(why) {
      const nk = getNovelKey();
      if (!nk) return;
  
      if (nk !== lastNovelKey) {
        const href = location.href;
        const guard = sessionStorage.getItem(RELOAD_GUARD_KEY);
  
        if (guard === href) {
          lastNovelKey = nk;
          return;
        }
  
        sessionStorage.setItem(RELOAD_GUARD_KEY, href);
        console.log("[WTRPF] Novel changed -> reload:", { why, from: lastNovelKey, to: nk, href });
        location.reload();
        return;
      }
  
      lastNovelKey = nk;
    }
  
    return { check };
  }

// CONTRACT (getChapterId)
// @CID Unified chapter ID resolver (DOM → URL fallback)
  function getChapterId(root) {
  const domCid = getDomChapterId(root);
  if (domCid && domCid !== "unknown") return domCid;

  const urlCid = getUrlChapterId();
  if (urlCid && urlCid !== "unknown") return urlCid;

  return "unknown";
}


  function termMemKey(novelKey) { return TERM_MEM_KEY_PREFIX + novelKey; }

  function loadTermMemory(novelKey) {
    try { return JSON.parse(localStorage.getItem(termMemKey(novelKey)) || "{}"); }
    catch { return {}; }
  }
  function saveTermMemory(novelKey, mem) {
    try {
      const keys = Object.keys(mem || {});
      if (keys.length > TERM_MEM_MAX_KEYS) {
        const excess = keys.length - TERM_MEM_MAX_KEYS;
        for (let i = 0; i < excess; i++) delete mem[keys[i]];
      }
    } catch {}
    localStorage.setItem(termMemKey(novelKey), JSON.stringify(mem || {}));
  }
  // CONTRACT (applyTermPatches)
  // @TERM Apply pinned / preferred term replacements
  function applyTermPatches(root, cfgTerms, mem, opts) {
    const enforcePlainText = !!opts?.enforcePinnedTermsOnPlainText;
    const map = Object.assign({}, cfgTerms || {}, mem || {});
    let changed = 0;

    const spans = Array.from(root.querySelectorAll("span.text-patch.system[data-hash]"));
    for (const sp of spans) {
      const h = sp.getAttribute("data-hash");
      if (!h) continue;
      const rec = map[h];
      if (!rec || !rec.preferred) continue;

      const desired = String(rec.preferred);
      if (sp.textContent !== desired) {
        sp.textContent = desired;
        changed++;
      }
    }

    if (enforcePlainText) {
      const pinned = [];
      for (const [, rec] of Object.entries(map)) {
        if (!rec || !rec.preferred || !rec.pinned) continue;
        const al = Array.isArray(rec.aliases) ? rec.aliases : [];
        pinned.push({ preferred: String(rec.preferred), variants: [String(rec.preferred), ...al].filter(Boolean) });
      }
      if (pinned.length) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode(node) {
            const p = node.parentNode;
            if (!p) return NodeFilter.FILTER_REJECT;
            const tag = p.nodeName;
            if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
            const el = p.nodeType === 1 ? p : p.parentElement;
            if (el && el.closest && el.closest("a, button, input, textarea, select")) return NodeFilter.FILTER_REJECT;
            if (!node.nodeValue || node.nodeValue.trim().length < 2) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
        });

        while (walker.nextNode()) {
          const node = walker.currentNode;
          const t = node.nodeValue;
          let t2 = t;

          for (const it of pinned) {
            for (const v of it.variants) {
              if (!v) continue;
              const rx = new RegExp(String.raw`(^|[^\p{L}\p{N}_])${escapeRegExp(v)}([^\p{L}\p{N}_]|$)`, "giu");
              t2 = t2.replace(rx, (m, p1, p2) => `${p1}${it.preferred}${p2}`);
            }
          }

          if (t2 !== t) {
            node.nodeValue = t2;
            changed++;
          }
        }
      }
    }

    return changed;
  }

/* =========================
   DRAFT HELPERS (PER-NOVEL)
   ========================= */

  function draftKeyFor(novelKey) {
    // novelKey is like "wtr-lab.com/en/novel/14370/"
    const nk = novelKey || getNovelKeyFromURL();
    return DRAFT_KEY_PREFIX + nk;
  }
  // CONTRACT (loadDraft)
  // @TERM Load per-novel draft
  function loadDraft(novelKey) {
    try {
      return JSON.parse(localStorage.getItem(draftKeyFor(novelKey)) || '{"items":[],"snippet":""}');
    } catch {
      return { items: [], snippet: "" };
    }
  }
  // CONTRACT (saveDraft)
  // @TERM Persist per-novel draft
  function saveDraft(novelKey, d) {
    localStorage.setItem(draftKeyFor(novelKey), JSON.stringify(d || { items: [], snippet: "" }));
  }

  function oneLineCharacterSnippet(name, gender, aliases) {
    const obj = { gender: String(gender) };
    if (Array.isArray(aliases) && aliases.length) obj.aliases = aliases;
    const inner = JSON.stringify(obj);
    return `"${name}": ${inner},`;
  }

/* =========================
   CONTENT TARGETING
   ========================= */
// CONTRACT (findContentRoot)
// @ROOT Resolve correct chapter body (single + infinite)
  function findContentRoot() {

// IMPORTANT:
// - This function is primarily for single-chapter pages and initial bootstrapping.
// - In infinite reader mode, run() (Patch D/E) and sweepInfiniteBodies() own the
//   correctness of which chapter-body to patch.
// - Avoid adding more infinite-mode heuristics here to prevent logic drift.

    // Guard: never resolve a root on TOC/description/non-chapter pages
    if (!isChapterReadingPage()) return null;

      // 1) Prefer ACTIVE chapter in infinite reader mode (or when tracker exists)
      const activeTracker = document.querySelector(".chapter-tracker.active[data-chapter-no]");
      const no = activeTracker?.getAttribute?.("data-chapter-no");
    
      if (no && /^\d+$/.test(no)) {
        // Common patterns observed on WTR-like readers
        const idCandidates = [
          `#chapter-${no}`,
          `#tracker-${no}`,
          `[data-chapter-no="${no}"]`,
          `[data-chapter-id="chapter-${no}"]`,
        ];
    
        for (const sel of idCandidates) {
          const host = document.querySelector(sel);
          if (!host) continue;
    
          // Try to find the text container inside this chapter host
          const cb =
            host.querySelector?.(".chapter-body") ||
            host.closest?.(".chapter-body") ||
            host.querySelector?.("article, main, section") ||
            host;
    
          if (cb && (cb.innerText || "").trim().length > 200) return cb;
        }
    
        // Fallback: pick the chapter-body closest to the active tracker
        const near =
          activeTracker.closest?.(".chapter-infinite-reader, .chapter, article, main, section") ||
          activeTracker.parentElement;
        const cbNear = near?.querySelector?.(".chapter-body");
        if (cbNear && (cbNear.innerText || "").trim().length > 200) return cbNear;
      }
    

      // 2) Infinite mode fallback: newest chapter-body that isn't patched yet
      const inf = document.querySelector(".chapter-infinite-reader");
      if (inf) {
      const bodies = Array.from(inf.querySelectorAll(".chapter-body"));
      const rev = bodies.slice().reverse();
      
      const newestUnpatched = rev.find(el => {
        const ok = (el.innerText || "").trim().length > 200;
        const already = el.dataset?.wtrpfPatchedChapter;
        return ok && !already;
      });
      if (newestUnpatched) return newestUnpatched;
      
      const lastGood = rev.find(el => (el.innerText || "").trim().length > 200);
      if (lastGood) return lastGood;
      }
    
      // 3) Single chapter fallback (original behavior)
      const cb = document.querySelector(".chapter-body");
      if (cb) return cb;
    
      const likely = document.querySelector("[data-chapter-id]")?.closest?.(".chapter-body, .chapter, main, article");
      if (likely) return likely;
    
      return null;
    }

  const SKIP_CLOSEST = [
    "header","nav","footer","aside","form",
    "button","input","textarea","select",
    "[role='navigation']",
    ".breadcrumbs",".breadcrumb",".toolbar",".tools",".tool",
    ".pagination",".pager",".share",".social",
    ".menu",".navbar",".nav",".btn",".button"
  ].join(",");

  function isSkippable(el) {
    return !!(el && el.closest && el.closest(SKIP_CLOSEST));
  }

// CONTRACT (getTextBlocks)
// @ROOT Extract patchable text blocks
  function getTextBlocks(root) {
    const blocks = Array.from(root.querySelectorAll("p, blockquote, li"));
    return blocks.filter(b => {
      if (isSkippable(b)) return false;
      const t = (b.innerText || "").trim();
      return t.length >= 20;
    });
  }

// CONTRACT (contentReady)
// @ROOT Content readiness gate (prevents premature runs)
  function contentReady(root) {
    if (!root) return false;
    const blocks = getTextBlocks(root);
    const textLen = (root.innerText || "").trim().length;
    return (blocks.length >= 2 && textLen >= 200);
  }
// CONTRACT (getInfiniteHost)
// @INF Locate infinite reader host
  function getInfiniteHost() {
  return document.querySelector(".chapter-infinite-reader") || null;
}
// CONTRACT (getAllChapterBodiesInInfinite)
// @INF Enumerate chapter bodies in infinite reader
  function getAllChapterBodiesInInfinite() {
    const host = getInfiniteHost();
    if (!host) return [];
    return Array.from(host.querySelectorAll(".chapter-body"))
      .filter(b => (b.innerText || "").trim().length > 200);
  }
  // CONTRACT (getChapterIdForBody)
// @INF Resolve chapterId for a specific infinite body
  function getChapterIdForBody(body) {
    const container =
      body.closest?.(".chapter, .chapter-infinite-reader, article, section, main") || body;
  
    const tracker =
      container.querySelector?.(".chapter-tracker[data-chapter-no]") ||
      body.querySelector?.(".chapter-tracker[data-chapter-no]") ||
      null;
  
    const no = tracker?.getAttribute?.("data-chapter-no");
    if (no && /^\d+$/.test(no)) return `chapter-${no}`;
  
    const tid = tracker?.id || "";
    const m1 = tid.match(/tracker-(\d+)/i);
    if (m1) return `chapter-${m1[1]}`;
  
    const domCid = getDomChapterId(body);
    if (domCid && domCid !== "unknown") return domCid;
  
    const urlCid = getUrlChapterId();
    if (urlCid && urlCid !== "unknown") return urlCid;
  
    return "unknown";
  }

  // SWEEPER HELPERS 
  // Mark bodies already fully handled (separate from per-block markers)
  function bodyIsSwept(body) {
    return body?.dataset?.wtrpfSwept === "1";
  }
  function markBodySwept(body) {
    if (body?.dataset) body.dataset.wtrpfSwept = "1";
  }

    // Mark bodies queued for a run (prevents re-queue spam)
  function bodyIsQueued(body) {
    return body?.dataset?.wtrpfQueued === "1";
  }
  function markBodyQueued(body) {
    if (body?.dataset) body.dataset.wtrpfQueued = "1";
  }
  function clearBodyQueued(body) {
    if (body?.dataset) delete body.dataset.wtrpfQueued;
  }

/* =========================
   CHAPTER PAGE GATE
   ========================= */

    function isLikelyChapterUrl() {
      // Fast path: chapters use /chapter-<n>
      return /\/chapter-\d+(?:\/|$|\?)/i.test(location.href);
    }
  
  function isChapterReadingPage() {
    // 1) URL is authoritative and fast
    if (isLikelyChapterUrl()) return true;
  
    // 2) DOM-authoritative signals (NO contentReady / scoring fallbacks)
    // These should not exist on TOC/description pages.
    if (document.querySelector(".chapter-infinite-reader")) return true;
    if (document.querySelector(".chapter-body")) return true;
    if (document.querySelector(".chapter-tracker.active[data-chapter-no]")) return true;
  
    return false;
  }

/* =========================
   ROOT OBSERVER MANAGER
   ========================= */
// CONTRACT (createRootObserverManager)
// @ROOT Tracks active chapter root across SPA remounts
  function createRootObserverManager(onRootChange) {
    /* CONTRACT (RootObserverManager)
       - Track a single "currentRoot" for single-reader mode.
       - Re-resolve if the root is detached or explicitly removed.
       - Never calls run() directly; navigation layer decides when to patch.
     */
    let currentRoot = null;
    let rootObserver = null;
  
    function disconnect() {
      if (rootObserver) {
        try { rootObserver.disconnect(); } catch {}
        rootObserver = null;
      }
    }

    // add a short retry when findContentRoot() returns null
    let resolveRetryTimer = null;
    function scheduleResolveRetry() {
      if (resolveRetryTimer) return;
      resolveRetryTimer = setTimeout(() => {
        resolveRetryTimer = null;
        resolve();
      }, 180);
    }

    function observe(root) {
      disconnect();
      if (!root) return;
  
      currentRoot = root;
  
      rootObserver = new MutationObserver((muts) => {
        // NEW: if React/SPA detached the root without a clean "removedNodes includes root" signal
        if (currentRoot && !document.contains(currentRoot)) {
          resolve();
          return;
        }
      
        for (const m of muts) {
          if (m.type !== "childList") continue;
      
          // Keep original strict check
          if (Array.from(m.removedNodes || []).includes(currentRoot)) {
            resolve();
            return;
          }
        }
      });

      const parent = root.parentNode || document.body;
      rootObserver.observe(parent, { childList: true, subtree: true });
    }
  
    function resolve() {
      const newRoot = findContentRoot();
    
      // NEW: during remounts findContentRoot can be temporarily null — retry once shortly
      if (!newRoot) {
        scheduleResolveRetry();
        return false;
      }
    
      if (newRoot === currentRoot) return true;
    
      observe(newRoot);
      onRootChange(newRoot);
      return true;
    }

    // Initial resolve
    resolve();
  
    return {
      resolve,
      getRoot: () => currentRoot,
      disconnect
    };
  }

/* =========================
   ROOT MANAGER INSTANCE
   ========================= */

  const rootManager = createRootObserverManager((newRoot) => {
    console.log("[WTRPF] Root changed:", newRoot);
    try { window.__wtrpf_ui?.syncPillVisibility?.(); } catch {}
    // Do NOT auto-run here; nav sweep controls execution
  });

/* =========================
   CHARACTER DETECTION
   ========================= */


  function detectCharactersOnPage(root, entries) {
    const hay = normalizeWeirdSpaces(root?.innerText || "");
    const hayLower = hay.toLowerCase();
    const detected = [];
    for (const [name, info] of entries) {
      const names = [name, ...(Array.isArray(info.aliases) ? info.aliases : [])]
        .filter(Boolean)
        .map(s => normalizeWeirdSpaces(String(s)));

      let hit = false;
      for (const n of names) {
        const trimmed = (n || "").trim();
        if (trimmed.length < 3) continue;
        if (!hayLower.includes(trimmed.toLowerCase())) continue;

        const rx = wordBoundaryRegexCached(trimmed);
        if (!rx) continue;
        rx.lastIndex = 0;
        if (rx.test(hay)) { hit = true; break; }
      }

      if (hit) detected.push([name, info]);
    }
    return detected;
  }

 /* =========================
   GLOSSARY HELPERS
   ========================= */
// CONTRACT (pickKey)
// @GLOSS Select glossary block by URL
  function pickKey(glossary) {
    const url = location.href;
    const keys = Object.keys(glossary || {}).filter(k => k !== "default");
    const matches = keys.filter(k => url.includes(k)).sort((a, b) => b.length - a.length);
    return matches[0] || "default";
  }

/* =========================
   RELIABLE GLOSSARY LOADER (+ CACHE)
   ========================= */

  function glossaryCacheKeys(url) {
    const h = hash32(String(url || ""));
    return {
      dataKey: `${GLOSSARY_CACHE_KEY}:${h}`,
      tsKey: `${GLOSSARY_CACHE_TS}:${h}`,
    };
  }
  // CONTRACT (loadGlossaryJSON)
 // @GLOSS Cached glossary loader with fallback
  function loadGlossaryJSON(url) {
    /* CONTRACT (Glossary loader)
       - Prefer cached JSON when fresh; fall back to cached JSON on fetch errors.
       - Never throw raw network errors (normalize to "Glossary error").
       - Cache is keyed by URL hash to avoid collisions across forks/branches.
     */
    return new Promise((resolve, reject) => {
      const { dataKey, tsKey } = glossaryCacheKeys(url);

      const cached = localStorage.getItem(dataKey);
      const cachedTs = Number(localStorage.getItem(tsKey) || "0");
      const cacheFresh = cached && cachedTs && (Date.now() - cachedTs) <= GLOSSARY_CACHE_TTL_MS;

      const useCache = () => {
        if (!cached) return reject(new Error("Glossary error"));
        try { resolve(JSON.parse(cached)); }
        catch { reject(new Error("Glossary error")); }
      };

      if (cacheFresh) return useCache();

      if (typeof GM_xmlhttpRequest === "function") {
        GM_xmlhttpRequest({
          method: "GET",
          url,
          headers: { "Cache-Control": "no-cache" },
          onload: (r) => {
            try {
              if (r.status < 200 || r.status >= 300) {
                if (cached) return useCache();
                return reject(new Error("Glossary error"));
              }
              localStorage.setItem(dataKey, r.responseText);
              localStorage.setItem(tsKey, String(Date.now()));
              resolve(JSON.parse(r.responseText));
            } catch {
              if (cached) return useCache();
              reject(new Error("Glossary error"));
            }
          },
          onerror: () => {
            if (cached) return useCache();
            reject(new Error("Glossary error"));
          }
        });
        return;
      }

      fetch(url, { cache: "no-store" })
        .then(async (res) => {
          const txt = await res.text();
          if (!res.ok) throw new Error("Glossary error");
          localStorage.setItem(dataKey, txt);
          localStorage.setItem(tsKey, String(Date.now()));
          return JSON.parse(txt);
        })
        .then(resolve)
        .catch(() => {
          if (cached) return useCache();
          reject(new Error("Glossary error"));
        });
    });
  }

/* =========================
   NODE REPLACEMENT COUNTING
   ========================= */

  function replaceInTextNodes(blockEl, fnReplace) {
    const walker = document.createTreeWalker(blockEl, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentNode;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.nodeName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
        const el = parent.nodeType === 1 ? parent : parent.parentElement;
        if (el && el.closest && el.closest("a, button, input, textarea, select")) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || node.nodeValue.trim().length < 2) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let changed = 0;
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const before = node.nodeValue;
      const out = fnReplace(before);
      if (!out || typeof out !== "object") continue;

      const after = out.text ?? before;
      let delta = Number(out.changed || 0);

      if (after !== before) {
        if (delta <= 0) {
          const b0 = countMatches(RX_PRONOUN_MALE, before) + countMatches(RX_PRONOUN_FEMALE, before);
          const b1 = countMatches(RX_PRONOUN_MALE, after) + countMatches(RX_PRONOUN_FEMALE, after);
          delta = Math.max(1, Math.abs(b0 - b1));
        }
        node.nodeValue = after;
        changed += delta;
      }
    }
    return changed;
  }

/* =========================
   UI DESIGN
   ========================= */
// CONTRACT (makeUI)
// @UI Build pill + panel UI (stateful)
      function makeUI({ novelKey }) {
        let savedPos = {};
        try { savedPos = JSON.parse(localStorage.getItem(UI_KEY_POS) || "{}"); }
        catch { savedPos = {}; localStorage.removeItem(UI_KEY_POS); }
      
        const enabledInit = localStorage.getItem(UI_KEY_ON);
        if (enabledInit !== "0" && enabledInit !== "1") localStorage.setItem(UI_KEY_ON, "1");
      
        function enabled() { return localStorage.getItem(UI_KEY_ON) !== "0"; }
        function setEnabled(v) { localStorage.setItem(UI_KEY_ON, v ? "1" : "0"); }
      
        let glossaryOk = true;
      
        // Summary state
        let charactersCount = 0;
        let charactersList3 = "";
        let changedTotal = 0;
      
        // Full detected cache (for UI view)
        let lastDetectedEntries = [];
      
        // View state: "main" or "chars"
        let view = "main";
      
        const ONBOARD_KEY = "wtrpf_onboard_seen_v1";
        let showOnboard = false;
      
        const style = document.createElement("style");
        style.textContent = `
          .wtrpf-added-term {
            text-shadow: 0 0 10px rgba(255,255,255,0.25);
            outline: 1px solid rgba(255,255,255,0.18);
            border-radius: 4px;
            padding: 0 2px;
          }
          .wtrpf-linklike {
            cursor: pointer;
            text-decoration: underline;
            text-underline-offset: 2px;
          }
          .wtrpf-linklike:hover { opacity: .92; }
        `;
        document.documentElement.appendChild(style);
      
        function applyPos(el) {
          if (savedPos.left != null) {
            el.style.left = savedPos.left + "px";
            el.style.right = "auto";
          } else {
            el.style.left = "12px";
            el.style.right = "auto";
          }
          el.style.top = (savedPos.top ?? 12) + "px";
        }
      
        function clampToViewport(el) {
          const rect = el.getBoundingClientRect();
          const maxLeft = Math.max(6, window.innerWidth - rect.width - 6);
          const maxTop = Math.max(6, window.innerHeight - rect.height - 6);
          const left = Math.min(Math.max(6, rect.left), maxLeft);
          const top = Math.min(Math.max(6, rect.top), maxTop);
          el.style.left = left + "px";
          el.style.top = top + "px";
          el.style.right = "auto";
          localStorage.setItem(UI_KEY_POS, JSON.stringify({ left: Math.round(left), top: Math.round(top) }));
        }
      
        function enableDrag(el, allowButtonClicks = true) {
          let startX = 0, startY = 0, startTop = 0, startLeft = 0, dragging = false;
      
          el.addEventListener("pointerdown", e => {
            if (allowButtonClicks && e.target && e.target.tagName === "BUTTON") return;
            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = el.getBoundingClientRect();
            startTop = rect.top;
            startLeft = rect.left;
            try { el.setPointerCapture(e.pointerId); } catch {}
          });
      
          el.addEventListener("pointermove", e => {
            if (!dragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            el.style.top = (startTop + dy) + "px";
            el.style.left = (startLeft + dx) + "px";
            el.style.right = "auto";
          });
      
          const end = () => {
            if (!dragging) return;
            dragging = false;
            clampToViewport(el);
          };
      
          el.addEventListener("pointerup", end);
          el.addEventListener("pointercancel", end);
        }
      
        const isMobile = window.innerWidth <= 480;
      
        const box = document.createElement("div");
        box.style.cssText = `
          position: fixed; z-index: 2147483647;
          background: rgba(0,0,0,0.50);
          color: #fff;
          border-radius: 12px;
          padding: 10px 12px;
          font: 12px/1.35 system-ui, -apple-system, Segoe UI, Roboto, Arial;
          box-shadow: 0 10px 28px rgba(0,0,0,.25);
          max-width: ${isMobile ? "60vw" : "min(520px, 58vw)"};
          width: ${isMobile ? "60vw" : "auto"};
          height: auto;
          backdrop-filter: blur(6px);
          user-select: none;
          touch-action: none;
        `;
      
        const topRow = document.createElement("div");
        topRow.style.cssText = `display:flex; align-items:center; justify-content:space-between; gap:10px;`;
      
        const title = document.createElement("div");
        title.textContent = "PronounsFix";
        title.style.cssText = `font-weight: 600;`;
      
        const controls = document.createElement("div");
        controls.style.cssText = `display:flex; gap:8px; align-items:center;`;
      
        const toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.style.cssText = `
          appearance:none; border:0; cursor:pointer;
          padding: 6px 10px; border-radius: 999px;
          background: rgba(255,255,255,0.12); color:#fff;
          font: 12px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial;
        `;
      
        const helpBtn = document.createElement("button");
        helpBtn.type = "button";
        helpBtn.textContent = "?";
        helpBtn.title = "Help";
        helpBtn.style.cssText = `
          appearance:none; border:0; cursor:pointer;
          width:26px; height:26px; border-radius:9px;
          background:rgba(255,255,255,0.10); color:#fff;
          font-size:14px; line-height:26px; padding:0;
        `;
      
        const minBtn = document.createElement("button");
        minBtn.type = "button";
        minBtn.textContent = "—";
        minBtn.title = "Minimise";
        minBtn.style.cssText = `
          appearance:none; border:0; cursor:pointer;
          width:26px; height:26px; border-radius:9px;
          background:rgba(255,255,255,0.12); color:#fff;
          font-size:16px; line-height:26px; padding:0;
        `;
      
        const disclaimer = document.createElement("div");
        disclaimer.textContent = "Works best on single page reader type";
        disclaimer.style.cssText = `
          margin-top: 4px;
          font-size: 11px;
          font-style: italic;
          opacity: .78;
          user-select: none;
        `;
      
        // SUMMARY (clickable line1)
        const summary = document.createElement("div");
        summary.style.cssText = `white-space: pre-line; opacity: .95; margin-top:8px;`;
      
        const summaryLine1 = document.createElement("div");
        summaryLine1.style.cssText = `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
        summaryLine1.classList.add("wtrpf-linklike");
      
        const summaryLine2 = document.createElement("div");
        summaryLine2.style.cssText = `margin-top: 2px;`;
      
        summary.appendChild(summaryLine1);
        summary.appendChild(summaryLine2);
      
        // Onboard block
        const onboard = document.createElement("div");
        onboard.style.cssText = `
          display:none;
          margin-top:10px;
          padding: 8px 10px;
          border-radius: 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          opacity: .95;
        `;
      
        const tipsTitle = document.createElement("div");
        tipsTitle.textContent = "Tips:";
        tipsTitle.style.cssText = `font-weight: 600; margin-bottom: 6px;`;
      
        const tipsList = document.createElement("ul");
        tipsList.style.cssText = `margin: 0; padding-left: 18px; white-space: normal;`;
      
        const tipItems = [
          "Long-press a WTR term (span) to open the character menu.",
          "Choose Male/Female to add a one-line JSON snippet to Draft.",
          "Draft persists; Copy JSON copies the snippet.",
          "Pronoun fixes rerun automatically when you go Next."
        ];
        for (const t of tipItems) {
          const li = document.createElement("li");
          li.textContent = t;
          li.style.cssText = `margin: 4px 0;`;
          tipsList.appendChild(li);
        }
        onboard.appendChild(tipsTitle);
        onboard.appendChild(tipsList);
      
        const divider = document.createElement("div");
        divider.style.cssText = `height:1px; background: rgba(255,255,255,0.12); margin:10px 0;`;
      
        // Draft / New Character section (unchanged UI)
        const sectionHeader = document.createElement("div");
        sectionHeader.style.cssText = `display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:8px;`;
      
        const sectionTitle = document.createElement("div");
        sectionTitle.textContent = "New Character (JSON)";
        sectionTitle.style.cssText = `font-weight: 700; opacity:.95;`;
      
        const sectionToggle = document.createElement("button");
        sectionToggle.type = "button";
        sectionToggle.textContent = "Open";
        sectionToggle.style.cssText = `
          appearance:none; border:0; cursor:pointer;
          padding: 6px 10px; border-radius: 10px;
          background: rgba(255,255,255,0.12); color:#fff;
          font: 12px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial;
          flex: 0 0 auto;
        `;
      
        let draftSectionOpen = false;
      
        const draftWrap = document.createElement("div");
        draftWrap.style.cssText = `display:none; margin-top:10px;`;
      
        const draftLabel = document.createElement("div");
        draftLabel.textContent = "Draft (copy into glossary.json)";
        draftLabel.style.cssText = `font-weight:600; opacity:.9; margin-bottom:6px;`;
      
        const draftBox = document.createElement("textarea");
        draftBox.readOnly = true;
        draftBox.spellcheck = false;
        draftBox.style.cssText = `
          width: 100%;
          min-height: 54px;
          max-height: 160px;
          resize: vertical;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 10px;
          background: rgba(255,255,255,0.08);
          color: #fff;
          padding: 8px 10px;
          font: 12px/1.35 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          outline: none;
        `;
      
        const btnRow = document.createElement("div");
        btnRow.style.cssText = `display:flex; gap:8px; margin-top:8px; flex-wrap: wrap;`;
      
        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.textContent = "Copy JSON";
        copyBtn.style.cssText = `
          appearance:none; border:0; cursor:pointer;
          padding: 6px 10px; border-radius: 10px;
          background: rgba(255,255,255,0.16); color:#fff;
          font: 12px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial;
        `;
      
        const clearBtn = document.createElement("button");
        clearBtn.type = "button";
        clearBtn.textContent = "Clear Draft";
        clearBtn.style.cssText = `
          appearance:none; border:0; cursor:pointer;
          padding: 6px 10px; border-radius: 10px;
          background: rgba(255,255,255,0.10); color:#fff;
          font: 12px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial;
        `;
      
        const draftCountRow = document.createElement("div");
        draftCountRow.style.cssText = `opacity:.85; margin-top:8px;`;
        draftCountRow.textContent = "Draft: 0";
      
        // Minimized pill
        const pill = document.createElement("div");
        pill.style.cssText = `
          display:none; position: fixed; z-index: 2147483647;
          background: rgba(0,0,0,0.37);
          color:#fff;
          border-radius: 999px;
          padding: 4px 6px;
          font: 11px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial;
          box-shadow: 0 10px 28px rgba(0,0,0,.25);
          backdrop-filter: blur(6px);
          user-select: none;
          touch-action: none;
          max-width: 220px;
          overflow: hidden;
        `;
      
        const pillRow = document.createElement("div");
        pillRow.style.cssText = `display:flex; align-items:center; gap:8px; min-width: 0;`;
      
        const pillText = document.createElement("div");
        pillText.style.cssText = `padding: 1px 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width:0; max-width: 150px;`;
      
        const pillExpandBtn = document.createElement("button");
        pillExpandBtn.type = "button";
        pillExpandBtn.textContent = "+";
        pillExpandBtn.title = "Expand";
        pillExpandBtn.style.cssText = `
          appearance:none; border:0; cursor:pointer;
          width:22px; height:22px; border-radius:8px;
          background:rgba(255,255,255,0.10); color:#fff;
          font-size:14px; line-height:22px; padding:0;
          flex: 0 0 auto;
        `;
      
        // Characters view container (NEW)
        const charView = document.createElement("div");
        charView.style.cssText = `display:none; margin-top:10px;`;
      
        const charHeader = document.createElement("div");
        charHeader.style.cssText = `display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px;`;
      
        const charTitle = document.createElement("div");
        charTitle.textContent = "Characters on this page";
        charTitle.style.cssText = `font-weight:700; opacity:.95;`;
      
        const backBtn = document.createElement("button");
        backBtn.type = "button";
        backBtn.textContent = "Back";
        backBtn.style.cssText = `
          appearance:none; border:0; cursor:pointer;
          padding: 6px 10px; border-radius: 10px;
          background: rgba(255,255,255,0.12); color:#fff;
          font: 12px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial;
          flex: 0 0 auto;
        `;
      
        const charListWrap = document.createElement("div");
        // Height capped; internal scroll
        charListWrap.style.cssText = `
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          padding: 8px 10px;
          max-height: ${isMobile ? "38vh" : "42vh"};
          overflow: auto;
          overscroll-behavior: contain;
        `;
      
        const charList = document.createElement("ul");
        charList.style.cssText = `margin: 0; padding-left: 18px; white-space: normal;`;
      
        charListWrap.appendChild(charList);
        charHeader.appendChild(charTitle);
        charHeader.appendChild(backBtn);
        charView.appendChild(charHeader);
        charView.appendChild(charListWrap);
      
        function refreshToggleUI() {
          const on = enabled();
          toggleBtn.textContent = on ? "ON" : "OFF";
          toggleBtn.style.background = on ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.10)";
          pillText.textContent = `PF (${on ? "ON" : "OFF"})`;
        }
      
        function refreshSummary() {
          if (!glossaryOk) {
            summaryLine1.textContent = "Glossary error";
            summaryLine2.textContent = "";
            summaryLine1.classList.remove("wtrpf-linklike");
            return;
          }
      
          // line1 is clickable to open character view
          summaryLine1.classList.add("wtrpf-linklike");
          summaryLine1.textContent =
            `• Characters: ${charactersCount}` + (charactersList3 ? ` • ${charactersList3}` : "");
      
          summaryLine2.textContent = `• Changed: ${changedTotal}`;
        }
      
        function renderCharList(detectedEntries) {
          charList.innerHTML = "";
          const list = Array.isArray(detectedEntries) ? detectedEntries : [];
      
          if (!list.length) {
            const li = document.createElement("li");
            li.textContent = "No characters detected on this page.";
            li.style.cssText = `margin: 4px 0; opacity: .9;`;
            charList.appendChild(li);
            return;
          }
      
          for (const [name, info] of list) {
            const g = String(info?.gender || "").toLowerCase();
            const label = (g === "female" || g === "male") ? g : "unknown";
      
            const li = document.createElement("li");
            li.style.cssText = `margin: 4px 0;`;
      
            // name (gender)
            const strong = document.createElement("span");
            strong.textContent = `${name}`;
            strong.style.cssText = `font-weight: 600;`;
      
            const meta = document.createElement("span");
            meta.textContent = ` (${label})`;
            meta.style.cssText = `opacity: .85;`;
      
            li.appendChild(strong);
            li.appendChild(meta);
      
            charList.appendChild(li);
          }
        }
      
        function setView(next) {
          view = next === "chars" ? "chars" : "main";
      
          const inChars = (view === "chars");
      
          // In Characters view: hide everything except topRow + charView
          disclaimer.style.display = inChars ? "none" : "block";
          summary.style.display = inChars ? "none" : "block";
          onboard.style.display = inChars ? "none" : (showOnboard ? "block" : "none");
          divider.style.display = inChars ? "none" : "block";
          sectionHeader.style.display = inChars ? "none" : "flex";
          draftWrap.style.display = inChars ? "none" : (draftSectionOpen ? "block" : "none");
          draftCountRow.style.display = inChars ? "none" : "block";
      
          charView.style.display = inChars ? "block" : "none";
      
          clampToViewport(box);
        }
      
        function setDraftUI(jsonSnippet, count) {
          const draftCount = count || 0;
          draftCountRow.textContent = `Draft: ${draftCount}`;
      
          const show = draftSectionOpen;
          draftWrap.style.display = show ? "block" : "none";
      
          const hasDraft = draftCount > 0 && !!jsonSnippet;
          draftBox.value = show ? (hasDraft ? jsonSnippet : "") : "";
      
          copyBtn.disabled = !hasDraft;
          clearBtn.disabled = !hasDraft;
          copyBtn.style.opacity = hasDraft ? "1" : "0.55";
          clearBtn.style.opacity = hasDraft ? "1" : "0.55";
      
          sectionToggle.textContent = draftSectionOpen ? "Close" : "Open";
        }
      
        toggleBtn.onclick = () => {
          setEnabled(!enabled());
          refreshToggleUI();
          setTimeout(() => location.reload(), 150);
        };
      
        helpBtn.onclick = () => {
          showOnboard = !showOnboard;
          onboard.style.display = showOnboard ? "block" : "none";
          localStorage.setItem(ONBOARD_KEY, "1");
          clampToViewport(box);
        };
      
        function setMin(min) {
          localStorage.setItem(UI_KEY_MIN, min ? "1" : "0");
          box.style.display = min ? "none" : "block";

          // Pill visibility is now gated by chapter reading page detection
          const canShowPill = min && isChapterReadingPage();
          pill.style.display = canShowPill ? "block" : "none";
        }

        minBtn.onclick = () => setMin(true);
        pillExpandBtn.onclick = () => setMin(false);
        pillText.onclick = () => setMin(false);
      
        sectionToggle.onclick = () => {
          draftSectionOpen = !draftSectionOpen;
          const d = loadDraft(novelKey);
          setDraftUI(d?.snippet || "", (d?.items || []).length);
          clampToViewport(box);
        };
      
        // Click line1 to enter Characters view (NEW)
        summaryLine1.onclick = () => {
          if (!glossaryOk) return;
          renderCharList(lastDetectedEntries);
          setView("chars");
        };
      
        backBtn.onclick = () => {
          setView("main");
        };
      
        controls.appendChild(toggleBtn);
        controls.appendChild(helpBtn);
        controls.appendChild(minBtn);
      
        topRow.appendChild(title);
        topRow.appendChild(controls);
      
        sectionHeader.appendChild(sectionTitle);
        sectionHeader.appendChild(sectionToggle);
      
        box.appendChild(topRow);
        box.appendChild(disclaimer);
        box.appendChild(summary);
        box.appendChild(onboard);
        box.appendChild(divider);
        box.appendChild(sectionHeader);
      
        draftWrap.appendChild(draftLabel);
        draftWrap.appendChild(draftBox);
      
        btnRow.appendChild(copyBtn);
        btnRow.appendChild(clearBtn);
      
        draftWrap.appendChild(btnRow);
        box.appendChild(draftWrap);
        box.appendChild(draftCountRow);
      
        // Characters view goes after summary area (still inside expanded box)
        box.appendChild(charView);
      
        pillRow.appendChild(pillText);
        pillRow.appendChild(pillExpandBtn);
        pill.appendChild(pillRow);
      
        document.documentElement.appendChild(box);
        document.documentElement.appendChild(pill);
      
        applyPos(box);
        applyPos(pill);
      
        enableDrag(box, true);
        enableDrag(pill, true);
      
        refreshToggleUI();
        refreshSummary();
      
        // minimized by default
        setMin(true);
      
        if (localStorage.getItem(ONBOARD_KEY) === "1") {
          showOnboard = false;
          onboard.style.display = "none";
        }
      
        // Ensure correct initial view
        setView("main");
      
        async function writeClipboard(text) {
          try {
            await navigator.clipboard.writeText(text);
            return true;
          } catch {
            try {
              const ta = document.createElement("textarea");
              ta.value = text;
              ta.style.position = "fixed";
              ta.style.left = "-9999px";
              document.body.appendChild(ta);
              ta.focus();
              ta.select();
              const ok = document.execCommand("copy");
              document.body.removeChild(ta);
              return ok;
            } catch {
              return false;
            }
          }
        }
      
        copyBtn.onclick = async () => {
          if (copyBtn.disabled) return;
          const d = loadDraft(novelKey);
          const txt = d?.snippet || "";
          if (!txt) return;
          await writeClipboard(txt);
        };
      
        clearBtn.onclick = () => {
          if (clearBtn.disabled) return;
          saveDraft(novelKey, { items: [], snippet: "" });
          setDraftUI("", 0);
        };
      
        return {
          isEnabled: () => enabled(),
          setGlossaryOk: (ok) => { glossaryOk = !!ok; refreshSummary(); },
          setCharacters: (detectedEntries, meta = {}) => {
            const base = Array.isArray(detectedEntries) ? detectedEntries : [];
            lastDetectedEntries = base;
      
            charactersCount = base.length;
      
            const names = base.slice(0, MAX_NAMES_SHOWN).map(([name, info]) => {
              const g = String(info.gender || "").toLowerCase();
              const label = (g === "female" || g === "male") ? g : "unknown";
              return `${name} (${label})`;
            });
            charactersList3 = names.join(", ") + (base.length > MAX_NAMES_SHOWN ? " …" : "");
            refreshSummary();
      
            // If user is currently in character view, live-refresh the list
            if (view === "chars") {
              renderCharList(lastDetectedEntries);
            }
          },
          setChanged: (val) => {
            changedTotal = clamp(Number(val) || 0, 0, 999999);
            refreshSummary();
          },
          setMinimized: (min) => setMin(!!min),
          setDraftUI,
          refreshDraftUI: () => {
            const d = loadDraft(novelKey);
            setDraftUI(d?.snippet || "", (d?.items || []).length);
          },
          syncPillVisibility: () => {
            const isMin = localStorage.getItem(UI_KEY_MIN) === "1";
            // Only show pill if minimized AND on chapter reading page
            pill.style.display = (isMin && isChapterReadingPage()) ? "block" : "none";
          },
        };
      }

  // ==========================================================
  // Add popup (small + X + Male/Female only)
  // - FIX: add touch long-press fallback (Firefox Android)
  // CONTRACT (installAddPopup)
// @UI Long-press character popup (desktop + touch)
  // ==========================================================
  function installAddPopup({ ui, novelKey }) {
    const popup = document.createElement("div");
    popup.style.cssText = `
      position: fixed; z-index: 2147483647;
      display:none;
      background: rgba(0,0,0,0.80);
      color:#fff;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      padding: 8px;
      font: 12px/1.3 system-ui, -apple-system, Segoe UI, Roboto, Arial;
      box-shadow: 0 10px 28px rgba(0,0,0,.25);
      backdrop-filter: blur(6px);
      width: min(220px, 70vw);
      user-select: none;
    `;

    const header = document.createElement("div");
    header.style.cssText = `display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:6px;`;

    const hTitle = document.createElement("div");
    hTitle.textContent = "Add Character";
    hTitle.style.cssText = `font-weight:700; opacity:.95;`;

    const xBtn = document.createElement("button");
    xBtn.type = "button";
    xBtn.textContent = "✕";
    xBtn.style.cssText = `
      appearance:none; border:0; cursor:pointer;
      width:24px; height:24px; border-radius:9px;
      background:rgba(255,255,255,0.10); color:#fff;
      font-size:13px; line-height:24px; padding:0;
      flex: 0 0 auto;
    `;

    const picked = document.createElement("div");
    picked.style.cssText = `opacity:.92; margin-bottom:8px; white-space: nowrap; overflow:hidden; text-overflow: ellipsis;`;

    const row = document.createElement("div");
    row.style.cssText = `display:flex; gap:6px;`;

    const mkBtn = (label) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.style.cssText = `
        appearance:none; border:0; cursor:pointer;
        padding: 6px 8px; border-radius: 10px;
        background: rgba(255,255,255,0.14); color:#fff;
        font: 12px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial;
        flex: 1;
      `;
      return b;
    };

    const maleBtn = mkBtn("Male");
    const femaleBtn = mkBtn("Female");

    header.appendChild(hTitle);
    header.appendChild(xBtn);
    row.appendChild(maleBtn);
    row.appendChild(femaleBtn);

    popup.appendChild(header);
    popup.appendChild(picked);
    popup.appendChild(row);
    document.documentElement.appendChild(popup);

    let ctxText = "";

    function hide() {
      popup.style.display = "none";
      ctxText = "";
    }

    function showAt(x, y, text) {
      ctxText = (text || "").trim();
      if (!ctxText) return;

      picked.textContent = `Selected: ${ctxText}`;

      const w = 240;
      const h = 120;
      const left = clamp(x, 6, window.innerWidth - w);
      const top = clamp(y, 6, window.innerHeight - h);

      popup.style.left = left + "px";
      popup.style.top  = top + "px";
      popup.style.display = "block";
    }

    xBtn.onclick = hide;
    popup.addEventListener("pointerdown", (e) => e.stopPropagation());
    document.addEventListener("scroll", hide, true);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); }, true);

    function upsertDraftLine(line) {
    const d = loadDraft(novelKey); // keep per-novel
    const items = Array.isArray(d.items) ? d.items : [];
    if (!items.includes(line)) items.push(line);
    const snippet = items.join("\n");
    saveDraft(novelKey, { items, snippet });
    ui.refreshDraftUI?.();
  }

    maleBtn.onclick = () => {
      if (!ctxText) return;
      upsertDraftLine(oneLineCharacterSnippet(ctxText, "male"));
      hide();
    };
    femaleBtn.onclick = () => {
      if (!ctxText) return;
      upsertDraftLine(oneLineCharacterSnippet(ctxText, "female"));
      hide();
    };

    // ----- LONG PRESS target: WTR term spans
    function findTermSpanFromTarget(target) {
      return target?.closest?.("span.text-patch.system[data-hash]") || null;
    }
    
    // Pointer-based (desktop/most browsers)
    let lpTimer = null;
    let lpSpan = null;
    let lpStartX = 0;
    let lpStartY = 0;
    
    function clearLP() {
      if (lpTimer) clearTimeout(lpTimer);
      lpTimer = null;
      lpSpan = null;
    }
    
    document.addEventListener("pointerdown", (e) => {
      const sp = findTermSpanFromTarget(e.target);
      if (!sp) return;
    
      clearLP();
      lpSpan = sp;
      lpStartX = e.clientX;
      lpStartY = e.clientY;
    
      lpTimer = setTimeout(() => {
        const txt = (lpSpan?.textContent || "").trim();
        if (!txt) return;
        showAt(lpStartX + 6, lpStartY + 6, txt);
      }, LONGPRESS_MS);
    }, true);
    
    document.addEventListener("pointerup", clearLP, true);
    document.addEventListener("pointercancel", clearLP, true);
    document.addEventListener("pointermove", (e) => {
      if (!lpTimer) return;
      const dx = Math.abs(e.clientX - lpStartX);
      const dy = Math.abs(e.clientY - lpStartY);
      if (dx + dy > 10) clearLP();
    }, true);
    
    // Touch fallback (Firefox Android) — improved
    let tTimer = null;
    let tSpan = null;
    let tStartX = 0;
    let tStartY = 0;
    let tTriggered = false;
    
    function clearTouchLP() {
      if (tTimer) clearTimeout(tTimer);
      tTimer = null;
      tSpan = null;
      tTriggered = false;
    }
    
    document.addEventListener("touchstart", (e) => {
      const touch = e.touches && e.touches[0];
      if (!touch) return;
    
      const sp = findTermSpanFromTarget(e.target);
      if (!sp) return;
    
      clearTouchLP();
      tSpan = sp;
      tStartX = touch.clientX;
      tStartY = touch.clientY;
    
      // Important: passive:false to preventDefault when the long-press triggers
      tTimer = setTimeout(() => {
        const txt = (tSpan?.textContent || "").trim();
        if (!txt) return;
      
        tTriggered = true;
        showAt(tStartX + 6, tStartY + 6, txt);
      }, LONGPRESS_MS);
    }, { capture: true, passive: false });
    
    document.addEventListener("touchmove", (e) => {
      if (!tTimer) return;
      const touch = e.touches && e.touches[0];
      if (!touch) return;
    
      const dx = Math.abs(touch.clientX - tStartX);
      const dy = Math.abs(touch.clientY - tStartY);
      if (dx + dy > 12) clearTouchLP();
    }, { capture: true, passive: true });
    
    document.addEventListener("touchend", (e) => {
      // If triggered long-press, block the "ghost" click/select aftermath.
      if (tTriggered) {
        try { e.preventDefault(); } catch {}
        try { e.stopPropagation(); } catch {}
      }
      clearTouchLP();
    }, { capture: true, passive: false });
    
    document.addEventListener("touchcancel", clearTouchLP, { capture: true, passive: true });
    
    // Selection popup still allowed
    document.addEventListener("mouseup", (e) => {
      const sel = window.getSelection?.();
      const s = sel ? String(sel.toString() || "") : "";
      const txt = s.trim();
      if (!txt || txt.length < 2) return;
    
      const root = rootManager?.getRoot() || findContentRoot();
      if (!root || !root.contains(e.target)) return;
    
      showAt(e.clientX + 6, e.clientY + 6, txt);
    }, true);
    
    function isClickInsidePopup(target) {
      return popup.contains(target);
    }
    
    document.addEventListener("pointerdown", (e) => {
      if (popup.style.display !== "block") return;
      if (isClickInsidePopup(e.target)) return;
      hide();
    }, true);
    
    return { hide };
  }

/* =========================
//   @NAV NAVIGATION HOOKS
   ========================= */
// CONTRACT (installNextButtonHook)
// @NAV Detect Next navigation clicks
    function installNextButtonHook(onNav) {
      document.addEventListener("click", (e) => {
        const t = e.target;
        if (!t) return;
    
        // Accept button, link, or role=button containers
        const el =
          t.closest?.("button, a, [role='button']") ||
          t.closest?.("[aria-label]") ||
          null;
    
        if (!el) return;
    
        // Fast-path: rel=next
        if ((el.getAttribute?.("rel") || "").toLowerCase() === "next") {
          setTimeout(() => onNav("next-rel"), 20);
          return;
        }
    
        // Check aria-label/title
        const aria = (el.getAttribute?.("aria-label") || "").toLowerCase();
        const title = (el.getAttribute?.("title") || "").toLowerCase();
        if (aria.includes("next") || title.includes("next")) {
          setTimeout(() => onNav("next-aria"), 20);
          return;
        }
    
        // Check visible text
        const txt = normalizeWeirdSpaces(el.textContent || "").trim().toLowerCase();
        if (txt === "next" || txt.startsWith("next ")) {
          setTimeout(() => onNav("next-text"), 20);
          return;
        }
    
        // Restrict href-based detection to nav/pagination-ish areas OR chapter-looking links
        const href = el.getAttribute?.("href") || "";
        const looksLikeChapterLink = /\/chapter-\d+/i.test(href);
    
        const navish =
          el.closest?.(".pagination, .pager, nav, header, [role='navigation'], .reader-nav, .chapter-nav") ||
          el.matches?.("[rel='next'], [aria-label*='next' i], [title*='next' i]");
    
        if (!navish && !looksLikeChapterLink) return;
    
        if (looksLikeChapterLink) {
          setTimeout(() => onNav("next-href"), 20);
          return;
        }
      }, true);
    }

    function installHistoryHooksLite(onNav) {
    const fire = (why) => setTimeout(() => onNav(why || "history-lite"), 60);
  
    window.addEventListener("popstate", () => fire("popstate"), true);
    window.addEventListener("pageshow", () => fire("pageshow"), true);
  
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) fire("visibility");
    }, true);
  }

  function installUrlChangeWatcher(onNav, isEnabled) {
    let lastHref = location.href;
    let lastFireAt = 0;
  
    const timer = setInterval(() => {
      if (!isEnabled() || document.hidden) return;
  
      const href = location.href;
      if (href === lastHref) return;
  
      lastHref = href;
  
      const now = Date.now();
      if (now - lastFireAt < 450) return; // throttle
      lastFireAt = now;
  
      onNav("url-change");
    }, 250);
  
    // NEW: allow disposal on mode flip
    return {
      disconnect() {
        try { clearInterval(timer); } catch {}
      }
    };
  }
      // CONTRACT (installChapterTrackerObserver)
      // @NAV Observe active tracker changes (infinite & single)
      function installChapterTrackerObserver(onNav, isEnabled) {
      let lastCid = null;
      let mo = null;
      let fireAt = 0;
    
      function getActiveTrackerCid() {
        const tr = document.querySelector(".chapter-tracker.active[data-chapter-no]");
        const no = tr?.getAttribute?.("data-chapter-no");
        return (no && /^\d+$/.test(no)) ? `chapter-${no}` : null;
      }
    
      function arm() {
        const host =
          document.querySelector(".chapter-infinite-reader") ||
          document.querySelector(".chapter-tracker")?.parentElement ||
          document.body;
    
        if (mo) {
          try { mo.disconnect(); } catch {}
          mo = null;
        }
    
        mo = new MutationObserver(() => {
          if (!isEnabled() || document.hidden) return;
    
          const cid = getActiveTrackerCid();
          if (!cid) return;
    
          // First seed
          if (!lastCid) { lastCid = cid; return; }
    
          // If Next changed the active tracker, this is our “navigation”
          if (cid !== lastCid) {
            lastCid = cid;

            const now = Date.now();
            if (now - fireAt < 250) return;   // throttle
            fireAt = now;
            
            onNav("tracker-active-changed");
          }
        });
    
        // Watch for class flips (active) and chapter-no changes / node swaps
        mo.observe(host, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ["class", "data-chapter-no", "id"]
        });
    
        // Seed initial
        lastCid = getActiveTrackerCid() || lastCid;
      }
    
      arm();
    
      // In case the reader remounts, re-arm once after a short delay
      setTimeout(arm, 1200);
    }

  function installActiveContentObserver(getRoot, onDirty, isEnabled) {
    let mo = null;
    let lastRoot = null;
    let t = null;
  
    const arm = () => {
      if (!isEnabled() || document.hidden) return;
  
      const root = (typeof getRoot === "function" ? getRoot() : null) || (rootManager?.getRoot?.() || findContentRoot());
      if (!root || root === lastRoot) return;
  
      if (mo) { try { mo.disconnect(); } catch {} }
      lastRoot = root;
  
      mo = new MutationObserver(() => {
        if (!isEnabled() || document.hidden) return;
        if (t) return;
        t = setTimeout(() => { t = null; onDirty("active-root-mutation"); }, 220);
      });
  
      mo.observe(root, { subtree: true, childList: true, characterData: true });
    };
  
    // re-arm periodically (root can change without being removed cleanly)
    const tick = setInterval(arm, 600);
    setTimeout(() => clearInterval(tick), 25000);
  
    arm();
  
    return {
      rearm: arm,
      disconnect: () => {
        try { clearInterval(tick); } catch {}
        if (mo) { try { mo.disconnect(); } catch {} mo = null; }
      }
    };
  }

      function installInfiniteReaderAppendObserver(onNav, isEnabled) {
      let mo = null;
    
      function arm() {
        const host = document.querySelector(".chapter-infinite-reader");
        if (!host) return false;
    
        if (mo) { try { mo.disconnect(); } catch {} }
    
        mo = new MutationObserver((muts) => {
          if (!isEnabled() || document.hidden) return;
    
          for (const m of muts) {
            for (const n of (m.addedNodes || [])) {
              if (!(n instanceof Element)) continue;
    
              // new chapter content arrived
              if (n.matches?.(".chapter-body") || n.querySelector?.(".chapter-body")) {
                onNav("infinite-append");
                return;
              }
            }
          }
        });
    
        mo.observe(host, { childList: true, subtree: true });
        return true;
      }
    
      // try now, and retry once if the reader mounts later
      if (!arm()) setTimeout(arm, 1200);
    
      return { disconnect: () => { if (mo) { try { mo.disconnect(); } catch {} } } };
    }
// CONTRACT (installTocClickHook)
// @NAV Detect TOC chapter jumps
    function installTocClickHook(onNav) {
    document.addEventListener("click", (e) => {
      const a = e.target?.closest?.("a[href]") || null;
      if (!a) return;
  
      const href = a.getAttribute("href") || "";
      // must look like a chapter jump
      if (!/\/chapter-\d+/i.test(href)) return;
  
      // Optional: tighten if you know TOC container selectors
      // const inToc = !!a.closest(".toc, .chapter-list, .modal, [role='dialog']");
      // if (!inToc) return;
  
      // Fire immediately so preNavSig/preNavCid reflect the *old* chapter
      onNav("toc-click");
    }, true);
  }

/* =========================
   MAIN
   ========================= */

    (async () => {
      // 1) Load glossary (cached loader already handles fallback)
      let glossary;
      try {
        glossary = await loadGlossaryJSON(GLOSSARY_URL);
        if (!glossary || typeof glossary !== "object") throw new Error("bad glossary");
      } catch {
        return;
      }
    
      // 2) Pick config block for this URL
      const key = pickKey(glossary);
      const cfg = glossary[key] || {};
    
      // 3) Resolve novelKey EARLY (used by UI + per-novel storage)
      const novelKey = (key === "default") ? getNovelKeyFromURL() : key;
      const chapterStateKey = CHAPTER_STATE_KEY_PREFIX + novelKey;
    
      // 4) Build UI FIRST (fixes ui-used-before-init + ensures per-novel draft)
      const ui = makeUI({ novelKey });
      window.__wtrpf_ui = ui;
      ui.syncPillVisibility?.();
    
      // Respect OFF toggle early
      if (!ui.isEnabled()) return;
    
    // Optional: reload-on-novel-switch safety (recommended)
    const novelReloadGuard = createNovelKeyReloadGuard(getNovelKeyFromURL);

      // 5) Validate glossary URL (tokenized GitHub URLs tend to break)
      if (!GLOSSARY_URL || /\?token=GHSAT/i.test(GLOSSARY_URL)) {
        ui.setGlossaryOk(false);
        return;
      }
    
      // 6) Upgrades flags
      const upgrades = cfg.upgrades || {};
      const U = {
        anchoredFixes: upgrades.anchoredFixes !== false,
        verbBasedWindow: !!upgrades.verbBasedWindow,
        passiveVoice: !!upgrades.passiveVoice,
        dialogueSpeaker: !!upgrades.dialogueSpeaker,
        roleHeuristicCarry: !!upgrades.roleHeuristicCarry,
        onlyChangeIfWrong: !!upgrades.onlyChangeIfWrong,
        termMemoryAssist: !!upgrades.termMemoryAssist,
        enforcePinnedTermsOnPlainText: !!upgrades.enforcePinnedTermsOnPlainText
      };
    
      // 7) Merge characters + validate
      const characters = {
        ...(glossary.default?.characters || {}),
        ...(cfg.characters || {})
      };
      const entries = Object.entries(characters);
    
      if (!entries.length) {
        ui.setGlossaryOk(false);
        return;
      }
      ui.setGlossaryOk(true);
    
      // 8) Terms + UI bootstraps
      const cfgTerms = cfg.terms || {};
      ui.refreshDraftUI?.();
      installAddPopup({ ui, novelKey });
    
      // 9) Mode + behavioral settings
      const mode = String(cfg.mode || "paragraph").toLowerCase();
      const primaryCharacter = cfg.primaryCharacter || null;
      const forceGender = String(cfg.forceGender || "").toLowerCase();
      const carryParagraphs = Number.isFinite(+cfg.carryParagraphs)
        ? Math.max(0, Math.min(5, +cfg.carryParagraphs))
        : DEFAULT_CARRY_PARAGRAPHS;

    function loadChapterState() {
      try { return JSON.parse(sessionStorage.getItem(chapterStateKey) || "{}"); }
      catch { return {}; }
    }
    
    function saveChapterState(st) {
      sessionStorage.setItem(chapterStateKey, JSON.stringify(st || {}));
    }

    function getChapterLastChanged(st, chapterId) {
      return Number(st?.lastByChapter?.[chapterId] || 0);
    }

    function setChapterLastChanged(st, chapterId, val) {
      if (!st.lastByChapter) st.lastByChapter = {};
      st.lastByChapter[chapterId] = val;
    }

 // CONTRACT (computeGenderForText)
// @GENDER Main gender resolution pipeline (force → primary → dialogue → score → fallback)     
  function computeGenderForText(text) {
    if (forceGender === "male" || forceGender === "female") return forceGender;
  
    const t = String(text || "");
    const tL = t.toLowerCase();
  
    if (primaryCharacter && tL.includes(String(primaryCharacter).toLowerCase()) && characters[primaryCharacter]) {
      const g0 = String(characters[primaryCharacter].gender || "").toLowerCase();
      if (g0 === "female" || g0 === "male") return g0;
    }
  
    // If the paragraph looks like dialogue attribution, try speaker first
    const looksDialogue =
      /["“][^"”]{3,}["”]/.test(t) &&
      /\b(said|asked|replied|shouted|whispered|muttered|yelled)\b/i.test(t);
  
    if (looksDialogue && U.dialogueSpeaker) {
      const gSpeaker = detectDialogueSpeakerGender(t, entries);
      if (gSpeaker) return gSpeaker;
    }
  
    const scored = scoreGenderInText(t, entries);
    if (scored) return scored;
  
    if (U.passiveVoice) {
      const gAgent = detectPassiveAgentGender(t, entries);
      if (gAgent) return gAgent;
    }
  
    if (U.dialogueSpeaker) {
      const gSpeaker2 = detectDialogueSpeakerGender(t, entries);
      if (gSpeaker2) return gSpeaker2;
    }
  
    // Fallback: strict word-boundary
    for (const [name, info] of entries) {
      const g = String(info.gender || "").toLowerCase();
      if (g !== "female" && g !== "male") continue;
  
      const all = [name, ...(Array.isArray(info.aliases) ? info.aliases : [])]
        .filter(Boolean)
        .sort((a,b) => String(b).length - String(a).length);
  
      for (const n of all) {
        const rx = wordBoundaryRegexCached(n);
        if (rx) {
          rx.lastIndex = 0;
          if (rx.test(t)) return g;
        }
      }
    }
  
    return null;
  }

    function updateDetectedCharactersUI(root) {
      const cid = getChapterId(root);
      const sig = chapterSignature(root, cid);
    
      const cached = getCharCache(cid);
      if (cached && cached.sig && sig && cached.sig === sig) {
        ui.setCharacters(cached.detected || [], { fromCache: true });
        return;
      }
    
      const detected = detectCharactersOnPage(root, entries);
      setCharCache(cid, sig, detected);
    
      ui.setCharacters(detected || [], { fromCache: false });
    }

    let lastActorGender = null;
    let lastActorTTL = 0;

    let lastChapterId = null;
    let lastSig = "";
    let running = false;
    let lastRunAt = 0;

    let navSweepTimer = null;
    function stopNavSweep() {
      if (navSweepTimer) clearInterval(navSweepTimer);
      navSweepTimer = null;
    }

  /* =========================
   Character detection cache
   ========================= */
    const _charDetectCache = new Map(); // key: chapterId -> { sig, detected }
    
    // helper
    function getCharCache(chapterId) {
      return _charDetectCache.get(String(chapterId || "unknown")) || null;
    }
    function setCharCache(chapterId, sig, detected) {
      _charDetectCache.set(String(chapterId || "unknown"), {
        sig: String(sig || ""),
        detected: Array.isArray(detected) ? detected : []
      });
    }

    function rootPatchedFor(root, chapterId) {
      return root?.dataset?.wtrpfPatchedChapter === String(chapterId);
    }
    function markRootPatched(root, chapterId) {
      if (!root || !root.dataset) return;
      root.dataset.wtrpfPatchedChapter = String(chapterId);
    }

    function blockIsPatched(b) {
      return b?.dataset?.wtrpfPatched === "1";
    }
    function markBlockPatched(b) {
      if (!b || !b.dataset) return;
      b.dataset.wtrpfPatched = "1";
    }

    // ==========================================================
    // RUN + MONITOR (REWRITE)
    // - single-flight (no concurrent runs, even forceFull)
    // - consistent scheduling funnel (everything goes through requestRun)
    // - safer SPA mismatch handling (compare sigs apples-to-apples)
    // - "not ready" retry (prevents missed runs after Next/TOC)
    // - monitor is single-instance + mode-aware + avoids global forceFull in infinite
    // ==========================================================
    
    // helper: clear patch markers correctly
    function clearPatchMarkers(root) {
      try {
        if (!root) return;
    
        // root marker
        if (root.dataset) {
          delete root.dataset.wtrpfPatchedChapter;
          delete root.dataset.wtrpfSwept;
          delete root.dataset.wtrpfQueued;
        }
    
        // block markers
        const blocks = root.querySelectorAll?.("p, blockquote, li") || [];
        blocks.forEach(el => {
          if (el?.dataset) delete el.dataset.wtrpfPatched;
        });
      } catch {}
    }

    // RUN FUNCTION  
    
    function run({ forceFull = false, forcedRoot = null, forcedChapterId = null } = {}) {
        /* CONTRACT @RUN (run)
       - Single-flight: if running, drop (scheduler re-queues when needed).
       - Never patch when document.hidden or feature toggle OFF.
       - Never silently "miss" a nav: if root not ready, requestRun retry.
       - forcedRoot/forcedChapterId must be treated as authoritative targets.
       */
      DEBUG && console.log("[WTRPF] run() enter forceFull=", forceFull, "href=", location.href);

      if (!ui.isEnabled()) return;
      if (document.hidden) return;
    
      // Single-flight always. forceFull bypasses gates, not concurrency.
      if (running) return;
    
      const now = Date.now();
      if (!forceFull && (now - lastRunAt < SELF_MUTATION_COOLDOWN_MS)) return;
    
      let root = forcedRoot || (rootManager?.getRoot?.() || findContentRoot());

      // PATCH D — infinite reader active body binding
      if (!forcedRoot && document.querySelector(".chapter-infinite-reader")) {
        const activeTracker =
          document.querySelector(".chapter-tracker.active[data-chapter-no]");
        const no = activeTracker?.getAttribute?.("data-chapter-no");
      
        if (no && /^\d+$/.test(no)) {
          const body =
            document.querySelector(`#chapter-${no} .chapter-body`) ||
            document.querySelector(`#tracker-${no} .chapter-body`) ||
            activeTracker.closest?.(
              ".chapter, article, section, main"
            )?.querySelector?.(".chapter-body") ||
            null;
      
          if (body) root = body;
        }
      }

      // PATCH E — fallback to most-visible chapter body (tracker lag hardening)
        if (!forcedRoot && document.querySelector(".chapter-infinite-reader")) {
          if (!root || !root.classList?.contains("chapter-body")) {
            const bodies = Array.from(
              document.querySelectorAll(".chapter-infinite-reader .chapter-body")
            );
        
            let best = null;
            let bestScore = 0;
        
            for (const b of bodies) {
              const r = b.getBoundingClientRect();
              if (r.bottom <= 0 || r.top >= window.innerHeight) continue;
        
              const visible =
                Math.min(r.bottom, window.innerHeight) -
                Math.max(r.top, 0);
        
              if (visible > bestScore) {
                bestScore = visible;
                best = b;
              }
            }
        
            if (best) root = best;
          }
        }

     if (!root) return;
    
      // If this run is targeting an infinite body, clear its queued marker
      if (root?.dataset?.wtrpfQueued === "1") {
        delete root.dataset.wtrpfQueued;
      }
    
      // If content not ready, don't silently drop: schedule one retry (cheap insurance for SPA nav)
      if (!contentReady(root)) {
        if (!forceFull) requestRun("run-not-ready-retry", { forceFull: false, forcedRoot, forcedChapterId });
        return;
      }
    
      // --- SPA DOM/URL grace handling (avoid patching old content) ---
      const urlCid = getUrlChapterId();
      const domCid = getDomChapterId(root);
    
      run._lastHref = run._lastHref || location.href;
      if (location.href !== run._lastHref) {
        run._lastHref = location.href;
        run._domGraceStart = 0;
      }
    
      const DOM_GRACE_MS = 1200;
      run._domGraceStart = run._domGraceStart || 0;
    
      const mismatch =
        (urlCid !== "unknown" && domCid !== "unknown" && domCid !== urlCid) ||
        (urlCid !== "unknown" && domCid === "unknown");
    
      if (mismatch) {
        if (!run._domGraceStart) run._domGraceStart = Date.now();
    
        // Non-force: give the DOM a moment to catch up
        if (!forceFull && (Date.now() - run._domGraceStart < DOM_GRACE_MS)) return;
    
        // Compare signatures with matching chapterIds (avoid domCid sig vs urlCid applied)
        const sigDom = (domCid && domCid !== "unknown") ? chapterSignature(root, domCid) : "";
        const sigUrl = (urlCid && urlCid !== "unknown") ? chapterSignature(root, urlCid) : "";
    
        // If DOM still shows previous chapter and it's already stable, don't waste a run
        if (domCid !== "unknown" && urlCid !== "unknown" && domCid !== urlCid) {
          const appliedDom = getAppliedSig(novelKey, domCid);
          if (appliedDom && sigDom && sigDom === appliedDom) return;
        }
    
        const appliedUrl = getAppliedSig(novelKey, urlCid);
        if (appliedUrl && sigUrl && sigUrl === appliedUrl) {
          run._domGraceStart = 0;
          return;
        }
      }
      run._domGraceStart = 0;
    
      // Final chapterId selection (forced wins; else prefer DOM id if known)
      const chapterId =
        (forcedChapterId && forcedChapterId !== "unknown")
          ? forcedChapterId
          : ((domCid !== "unknown") ? domCid : urlCid);
    
      let pronounEdits = 0;
    
      function paragraphSeemsSingleGender(text, gender) {
        const s = normalizeWeirdSpaces(String(text || ""));
        const m = countMatches(RX_PRONOUN_MALE, s);
        const f = countMatches(RX_PRONOUN_FEMALE, s);
    
        // If paragraph has both genders’ pronouns, be conservative
        if (m > 0 && f > 0) {
          if (gender === "male") return m >= (f * 3);
          return f >= (m * 3);
        }
        return true;
      }
    
      // Signature gate: skip only if same as last applied in this session (unless forceFull)
      const sigBefore = chapterSignature(root, chapterId);
      if (!forceFull && sigBefore && sigBefore === lastSig) return;
    
      running = true;
      try {
        // New chapter boundary
        if (chapterId !== lastChapterId) {
          lastChapterId = chapterId;
    
          localStorage.setItem(UI_KEY_MIN, "1");
          ui.setMinimized(true);
    
          lastActorGender = null;
          lastActorTTL = 0;
    
          // React can reuse DOM nodes; clear markers on boundary
          clearPatchMarkers(root);
        }
    
        // If forceFull, clear markers to reprocess
        if (forceFull) clearPatchMarkers(root);
    
        // If root is a chapter body, clear infinite-mode flags too
        if (root?.classList?.contains("chapter-body") && root?.dataset) {
          delete root.dataset.wtrpfSwept;
          delete root.dataset.wtrpfQueued;
        }
    
        // UI: show last known count for this chapter until compute a new one
        const st0 = loadChapterState();
        const lastChanged = getChapterLastChanged(st0, chapterId);
        ui.setChanged(lastChanged > 0 ? lastChanged : 0);
    
        // Apply term patches (if enabled)
        if (U.termMemoryAssist || Object.keys(cfgTerms).length) {
          const mem = loadTermMemory(novelKey);
          applyTermPatches(root, cfgTerms, mem, U);
        }
    
        updateDetectedCharactersUI(root);
    
        // Resolve mode
        let usedMode = mode;
        let chapterGender = null;
    
        if (mode === "chapter") {
          if (forceGender === "male" || forceGender === "female") {
            chapterGender = forceGender;
          } else if (primaryCharacter && characters[primaryCharacter]) {
            const g = String(characters[primaryCharacter].gender || "").toLowerCase();
            if (g === "female" || g === "male") chapterGender = g;
          }
          if (!chapterGender) usedMode = "paragraph";
        }
    
        // Decide which blocks to process
        const alreadyPatched = rootPatchedFor(root, chapterId);
        const doFullPass = forceFull || !alreadyPatched;
    
        const blocksAll = getTextBlocks(root);
        const blocks = doFullPass ? blocksAll : blocksAll.filter(b => !blockIsPatched(b));
        if (!blocks.length) return;
    
        let lastGender = null;
        let carryLeft = 0;
    
        for (const b of blocks) {
          const bt = (b.innerText || "").trim();
          if (!bt) { markBlockPatched(b); continue; }
    
          if (isSceneBreak(bt)) {
            lastGender = null;
            carryLeft = 0;
            lastActorGender = null;
            lastActorTTL = 0;
            markBlockPatched(b);
            continue;
          }
    
          // Anchored fixes first
        if (U.anchoredFixes) {
          const anchoredOpts = Object.assign({}, U, { onlyChangeIfWrong: true });
          pronounEdits += replaceInTextNodes(b, (txt) => applyAnchoredFixes(txt, entries, anchoredOpts));
        }
    
          let g = null;
          let hadDirectMatch = false;
    
          if (usedMode === "chapter") {
            g = chapterGender;
            hadDirectMatch = true;
          } else {
            const computed = computeGenderForText(bt);
            if (computed) {
              g = computed;
              hadDirectMatch = true;
          
              if (U.roleHeuristicCarry && RX_ATTACK_CUES.test(bt)) {
                lastActorGender = computed;
                lastActorTTL = 2;
              }
            } else {
              // Carry from lastGender (guarded)
              if (lastGender && carryLeft > 0 && (startsWithPronoun(bt) || pronounAppearsEarly(bt, EARLY_PRONOUN_WINDOW))) {
                if (carryGuardAllows(bt, lastGender, entries)) {
                  g = lastGender;
                  carryLeft--;
                }
              }
          
              // Role heuristic carry (only if still no gender)
              if (!g && U.roleHeuristicCarry && lastActorGender && lastActorTTL > 0) {
                if ((startsWithPronoun(bt) || pronounAppearsEarly(bt, EARLY_PRONOUN_WINDOW)) && RX_ATTACK_CUES.test(bt)) {
                  g = lastActorGender;
                  lastActorTTL--;
                }
              }
            }
          }

          if (g) {
            const dir = (g === "female") ? "toFemale" : "toMale";
    
          let doFull = true;
          if (U.onlyChangeIfWrong) doFull = conservativeShouldApply(bt, g);
          
          if (doFull) {
            pronounEdits += replaceInTextNodes(b, (txt) => {
              if (!paragraphSeemsSingleGender(txt, g)) {
                return replacePronounsSentenceScoped(txt, g);
              }
              return replacePronounsSmart(txt, dir);
            });
          }

            if (usedMode !== "chapter" && hadDirectMatch) {
              lastGender = g;
              carryLeft = carryParagraphs;
            }
          }
    
          markBlockPatched(b);
        }
    
        if (doFullPass) markRootPatched(root, chapterId);
    
        // Avoid inflating counts if already equals applied signature
        if (pronounEdits > 0) {
          const sigNow = chapterSignature(root, chapterId);
          const applied = getAppliedSig(novelKey, chapterId);
          if (applied && sigNow === applied) pronounEdits = 0;
        }
    
        // Persist counts
        const st = loadChapterState();
        const prev = getChapterLastChanged(st, chapterId);
    
        if (pronounEdits > 0) {
          setChapterLastChanged(st, chapterId, pronounEdits);
          ui.setChanged(pronounEdits);
        } else if (prev > 0) {
          ui.setChanged(prev);
        } else {
          ui.setChanged(0);
        }
    
        // Record signature AFTER applying
        const sigAfter = chapterSignature(root, chapterId);
        if (sigAfter) {
          setAppliedSig(novelKey, chapterId, sigAfter);
          lastSig = sigAfter;
        } else {
          lastSig = sigBefore;
        }
    
        saveChapterState(st);
      } finally {
        running = false;
        lastRunAt = Date.now();
      }
    
      // If a forced body was queued while busy, schedule it (through requestRun)
      try { drainPendingForced(); } catch {}
    }

  /* =========================
   C) Single debounced scheduler
   ========================= */
  const RUN_DEBOUNCE_MS = 140;
  const RUN_TIMER_MAX_WAIT_MS = 2000; // failsafe: never get "stuck" longer than this
  
  let _runTimer = null;
  let _runTimerSetAt = 0;
  let _pendingRun = null; // { forceFull, forcedRoot, forcedChapterId, reason, ts, allowOffChapter }

// CONTRACT (requestRun)
// @SCHED Debounced run scheduler (sticky forceFull)
  function requestRun(reason, opts = {}) {
        /* CONTRACT (requestRun)
      - The ONLY public entrypoint for scheduling mutations.
       - Coalesces triggers; latest wins for root/chapterId; forceFull is sticky.
       - Off-chapter pages are gated unless forcedRoot or allowOffChapter is true.
       - Must not recurse unbounded (RUN_TIMER_MAX_WAIT_MS failsafe).
     */
    if (!ui.isEnabled() || document.hidden) return;
  
    const forcedRoot = opts.forcedRoot || null;
  
    // Gate: don't schedule runs off chapter pages unless explicitly allowed or forcedRoot is provided
    if (!forcedRoot && !opts.allowOffChapter && !isChapterReadingPage()) {
      ui.syncPillVisibility?.();
      return;
    }
  
    const req = {
      forceFull: !!opts.forceFull,
      forcedRoot,
      forcedChapterId: opts.forcedChapterId || null,
      allowOffChapter: !!opts.allowOffChapter,
      reason: String(reason || "request"),
      ts: Date.now()
    };
  
    // Latest wins; forceFull is sticky
    if (_pendingRun) {
      req.forceFull = req.forceFull || _pendingRun.forceFull;
  
      if (!req.forcedRoot && _pendingRun.forcedRoot) req.forcedRoot = _pendingRun.forcedRoot;
      if (!req.forcedChapterId && _pendingRun.forcedChapterId) req.forcedChapterId = _pendingRun.forcedChapterId;
  
      // If anything previously required off-chapter, keep it
      req.allowOffChapter = req.allowOffChapter || _pendingRun.allowOffChapter;
    }
    _pendingRun = req;
  
    // If already have a timer, ensure it can't get stuck forever
    if (_runTimer) {
      if (_runTimerSetAt && (Date.now() - _runTimerSetAt) > RUN_TIMER_MAX_WAIT_MS) {
        clearTimeout(_runTimer);
        _runTimer = null;
      } else {
        return;
      }
    }
  
    _runTimerSetAt = Date.now();
    _runTimer = setTimeout(() => {
      _runTimer = null;
      _runTimerSetAt = 0;
  
      const r = _pendingRun;
      _pendingRun = null;
      if (!r) return;
  
      // If a run is in-flight, requeue once with a tiny delay instead of dropping the request
      if (running) {
        _pendingRun = r;
        setTimeout(() => {
          if (_pendingRun && !_runTimer) requestRun("rearm-while-running", {
            forceFull: r.forceFull,
            forcedRoot: r.forcedRoot,
            forcedChapterId: r.forcedChapterId,
            allowOffChapter: r.allowOffChapter
          });
        }, 60);
        return;
      }
      
      console.log("[WTRPF] requestRun→run:", r.reason, "forceFull=", r.forceFull);
      run({
        forceFull: r.forceFull,
        forcedRoot: r.forcedRoot,
        forcedChapterId: r.forcedChapterId
      });
    }, RUN_DEBOUNCE_MS);
  }
  
  /* ==========================================================
     // CONTRACT (drainPendingForced)
     // @SCHED Retry queued forced infinite runs
     drainPendingForced() — hardened
     - safe retries when DOM isn't ready yet
     - doesn't lose work if _pendingForced is overwritten mid-check
     ========================================================== */
  function drainPendingForced() {
        /* CONTRACT (drainPendingForced)
       - Single pending forced body only (_pendingForced).
      - If body not ready yet, retry via requestRun up to a small cap.
      - Must not stomp a newer _pendingForced snapshot.
        */
    if (!_pendingForced || running) return;
  
    const snap = _pendingForced; // snapshot for race safety
    const { root, cid } = snap || {};
    if (!root || !cid) { _pendingForced = null; return; }
  
    if (!document.contains(root)) { _pendingForced = null; return; }
  
    // If not ready yet, retry a few times via scheduler
    snap.tries = (snap.tries || 0) + 1;
  
    // If _pendingForced changed while working, don't stomp it
    if (_pendingForced !== snap) return;
  
    if (!contentReady(root)) {
      if (snap.tries > 10) { _pendingForced = null; return; }
      // schedule a gentle retry (forcedRoot bypasses chapter-page gate)
      requestRun("drain-pending-forced-retry", { forceFull: true, forcedRoot: root, forcedChapterId: cid });
      return;
    }
  
    _pendingForced = null;
    requestRun("drain-pending-forced", { forceFull: true, forcedRoot: root, forcedChapterId: cid });
  }

/* ==========================================================
   REWRITE 1: sweepInfiniteBodies()
   - Fix: don’t mark swept unless actually applied / stabilized
   - Fix: avoid forcedRoot globals; pass forcedRoot/forcedChapterId into run()
   - Fix: don’t lose a chapter if run is busy; queue for later
   ========================================================== */
  // SINGLE shared pending forced run
  // Used by sweepInfiniteBodies() + drainPendingForced()
  let _pendingForced = null; // { root, cid, tries }

  // IMPORTANT:
  // _pendingForced is the ONLY cross-run bridge for infinite-reader bodies.
  // Do NOT convert this into a queue/array without redesigning drainPendingForced(),
  // its retry behavior, and how "queued" markers are managed.

  function sweepInfiniteBodies() {
        /* CONTRACT @INF (sweepInfiniteBodies)
       - Never marks swept unless the body's signature matches applied signature.
       - Never calls run() directly; schedules forced runs via requestRun.
       - Uses body queued marker to avoid spamming and to preserve work while running.
       - Maintains ONLY one cross-run pending forced body (_pendingForced).
     */
      const host = document.querySelector(".chapter-infinite-reader");
      if (!host) return;
    
      const bodies = Array.from(host.querySelectorAll(".chapter-body"))
        .filter(b => (b.innerText || "").trim().length > 200);
    
      for (const body of bodies) {
        if (!body) continue;
    
        // Already declared stable → skip
        if (body.dataset.wtrpfSwept === "1") continue;
    
        const cid = getChapterIdForBody(body);
        if (!cid || cid === "unknown") continue;
        if (!contentReady(body)) continue;
    
        const sigNow = chapterSignature(body, cid);
        const applied = getAppliedSig(novelKey, cid);
    
        // Applied & stable → mark swept
        if (applied && sigNow && sigNow === applied) {
          body.dataset.wtrpfSwept = "1";
          clearBodyQueued(body);
          continue;
        }
    
        // Already queued → don’t spam
        if (bodyIsQueued(body)) continue;
    
        // If a run is active, queue ONE pending forced body safely
        if (running) {
          // Do not overwrite an existing pending forced unless it's the same body
          if (!_pendingForced || _pendingForced.root === body) {
            _pendingForced = { root: body, cid, tries: 0 };
          }
          markBodyQueued(body);
          continue;
        }
    
        // Not running → schedule a forced run via scheduler
        markBodyQueued(body);
    
        requestRun("infinite-sweep", {
          forceFull: true,
          forcedRoot: body,
          forcedChapterId: cid
        });
      }
    }
// CONTRACT (startChapterMonitor)
// @RUN Watchdog for silent DOM overwrites / signature drift
    function startChapterMonitor() {
    let startedAt = Date.now();
  
    // startedAt = Date.now();
  
    let timer = null;
  
    const tick = () => {
      const inInfinite = !!document.querySelector(".chapter-infinite-reader");
      if (inInfinite) sweepInfiniteBodies();
  
      if (!ui.isEnabled()) return;
      if (document.hidden) return;
      if (running) return;
  
      drainPendingForced();
  
      if (inInfinite) return;
  
      const root = rootManager?.getRoot?.() || findContentRoot();
      if (!contentReady(root)) return;
  
      const cid = getChapterId(root);
      const sigNow = chapterSignature(root, cid);
      if (!cid || !sigNow) return;
  
      const applied = getAppliedSig(novelKey, cid);
      
      // PATCH — signature drift with stable chapterId (Contents-panel nav)
      if (applied && sigNow && sigNow !== applied) {
        // Content changed without chapterId change → force full re-run
        requestRun("monitor-signature-drift", {
          forceFull: true,
          forcedRoot: root,
          forcedChapterId: cid
        });
        return;
      }
      
      // Normal first-apply case
      if (!applied) {
        requestRun("monitor-first-apply", {
          forceFull: true,
          forcedRoot: root,
          forcedChapterId: cid
        });
        return;
      }

      // Warmup: don't spam, only nudge occasionally
      const age = Date.now() - startedAt;
      if (age < CHAPTER_MONITOR_WARMUP_MS) {
        // e.g. at most once per 1200ms
        tick._lastWarm = tick._lastWarm || 0;
        if (Date.now() - tick._lastWarm > 1200) {
          tick._lastWarm = Date.now();
          requestRun("monitor-light", { forceFull: false, forcedRoot: root, forcedChapterId: cid });
        }
      }
    };
  
    const schedule = () => {
      if (timer) clearTimeout(timer);
  
      const age = Date.now() - startedAt;
      const interval = (age < CHAPTER_MONITOR_WARMUP_MS) ? 350 : 900;
  
      timer = setTimeout(() => {
        tick();
        schedule();
      }, interval);
    };
  
    schedule();
  
    // optional: expose a reset hook
    startChapterMonitor.resetWarmup = () => { startedAt = Date.now(); };
  }

  // CONTRACT (startNavSweep)
  // @NAV Poll until URL + DOM stabilize, then requestRun
      function startNavSweep(reason = "nav", epoch = navEpoch) {
      stopNavSweep();
    
      const startAt = Date.now();
      let stableHits = 0;
      let lastSeenChapterId = null;
      let sawNewContent = false;
    
      const FALLBACK_AFTER_MS = 1600;
    
      navSweepTimer = setInterval(() => {
        if (epoch !== navEpoch) { stopNavSweep(); return; }
        if (!ui.isEnabled() || document.hidden) { stopNavSweep(); return; }
        if (Date.now() - startAt > NAV_SWEEP_MS) { stopNavSweep(); return; }
    
        // In infinite mode, do not use nav sweep for patching;
        // sweeper + per-body forced runs own correctness.
        if (document.querySelector(".chapter-infinite-reader")) {
          ui.syncPillVisibility?.();
          stopNavSweep();
          return;
        }
    
        const root = rootManager?.getRoot?.() || findContentRoot();
        ui.syncPillVisibility?.();
        if (!root || root === document.body) return;
        if (!contentReady(root)) { stableHits = 0; return; }
    
        const urlCid = getUrlChapterId();
        const domCid = getDomChapterId(root);
    
        const now = Date.now();
        const canFallback = (now - startAt) >= FALLBACK_AFTER_MS;
    
        // Choose CID safely:
        // 1) strict agree
        // 2) fallback prefers DOM-derived cid (root-bound), because root is what will patch
        let cid = null;
    
        if (urlCid !== "unknown" && domCid !== "unknown" && urlCid === domCid) {
          cid = urlCid;
        } else if (canFallback && domCid !== "unknown") {
          cid = domCid;
        } else if (canFallback && urlCid !== "unknown" && domCid === "unknown") {
          // only accept URL-only when DOM can't identify AND we've seen new content
          cid = urlCid;
        } else {
          stableHits = 0;
          return;
        }
    
        const sigNow = chapterSignature(root, cid);
        if (!sigNow) { stableHits = 0; return; }
    
        // Ensure don't stabilize on "old chapter" before swap.
        if (!sawNewContent) {
          if (sigNow !== preNavSig || cid !== preNavCid) {
            sawNewContent = true;
          } else {
            stableHits = 0;
            return;
          }
        }
    
        if (cid !== lastSeenChapterId) {
          lastSeenChapterId = cid;
          stableHits = 0;
          localStorage.setItem(UI_KEY_MIN, "1");
          ui.setMinimized(true);
        }
    
        const applied = getAppliedSig(novelKey, cid);
    
        // If not applied or overwritten, schedule a deterministic forced run for THIS root/cid.
        if (!applied || sigNow !== applied) {
          // avoid spamming if a run is already happening / queued
          if (!running) {
            requestRun("nav-sweep", { forceFull: true, forcedRoot: root, forcedChapterId: cid });
          }
          stableHits = 0;
          return;
        }
    
        stableHits++;
        if (stableHits >= 2) stopNavSweep();
      }, NAV_POLL_MS);
    }

      // ==========================================================
      // Hooks (B) — simplify: NO early forced runs; sweep decides when it's safe
      // ==========================================================
      let preNavSig = "";
      let preNavCid = "";
      let navEpoch = 0;

      let _onNavLastAt = 0;
      let _onNavLastWhy = "";

      // CONTRACT (onNav)
    // @NAV Unified navigation handler (Next / TOC / tracker / URL)
        const onNav = (why) => {
          const now = Date.now();
          if (now - _onNavLastAt < 250) return; // throttle bursts
          _onNavLastAt = now;
          _onNavLastWhy = String(why || "");
          console.log("[WTRPF] onNav fired:", why, "href=", location.href);
        
          localStorage.setItem(UI_KEY_MIN, "1");
          ui.setMinimized(true);
          ui.syncPillVisibility?.();
          ui.refreshDraftUI?.(); // NEW: load draft for the current novel immediately
        
          // Reset session gates
          lastSig = "";
          lastChapterId = null;

          try { startChapterMonitor.resetWarmup?.(); } catch {}

          // Capture "before nav" identity so sweep won't stabilize on old chapter
          const root0 = rootManager?.getRoot?.() || findContentRoot();
          preNavCid = root0 ? getChapterId(root0) : "";
          preNavSig = root0 ? chapterSignature(root0) : "";
          navEpoch++;

          /* ==========================================================
           PATCH — targeted marker reset for TOC / tracker nav
           Purpose:
           - Handle React DOM reuse where chapter content changes
             but the root element stays the same.
           - Prevent deadlock where blocks remain marked patched
             and run() exits early.
           ========================================================== */
          try {
            const rootNow = rootManager?.getRoot?.() || findContentRoot();
            if (rootNow && rootNow.dataset) {
              // Clear root-level markers
              delete rootNow.dataset.wtrpfPatchedChapter;
              delete rootNow.dataset.wtrpfSwept;
              delete rootNow.dataset.wtrpfQueued;
          
              // Clear block-level markers
              const blocks = rootNow.querySelectorAll("p, blockquote, li");
              blocks.forEach(b => {
                if (b?.dataset?.wtrpfPatched) delete b.dataset.wtrpfPatched;
              });
            }
          } catch {}
        
          rootManager.resolve();
          
          // If infinite reader is present, nav sweep won't run.
          // Force a sweep + force-run the currently active body.
          if (document.querySelector(".chapter-infinite-reader")) {
            setTimeout(() => {
              try { sweepInfiniteBodies(); } catch {}
          
              // Try to force-run the ACTIVE chapter body (TOC often focuses existing body, no append)
              const activeTracker = document.querySelector(".chapter-tracker.active[data-chapter-no]");
              const no = activeTracker?.getAttribute?.("data-chapter-no");
          
              if (no && /^\d+$/.test(no)) {
                // Find the body corresponding to the active chapter
                const body =
                  document.querySelector(`#chapter-${no} .chapter-body`) ||
                  document.querySelector(`#tracker-${no} .chapter-body`) ||
                  activeTracker.closest?.(".chapter, article, section, main")?.querySelector?.(".chapter-body") ||
                  null;
          
                if (body && contentReady(body)) {
                  const cid = `chapter-${no}`;
                  requestRun("toc/infinite-active", {
                    forceFull: true,
                    forcedRoot: body,
                    forcedChapterId: cid
                  });
                }
              }
            }, 120);
    
            return; // IMPORTANT: don't startNavSweep in infinite mode
          }
          
          startNavSweep(String(why || "nav"), navEpoch); // startNavSweep will requestRun when safe
        };

        // ==========================================================
        // Route watcher: hide pill immediately when leaving chapter pages (SPA-safe)
        // ==========================================================
      // CONTRACT (installRouteWatcher)
      // @GATE Hide pill + resolve root on route changes  
      function installRouteWatcher({ ui, rootManager, stopNavSweep }) {
        /* CONTRACT (installRouteWatcher)
           - Sync pill visibility ASAP on any route change (SPA-safe).
           - Must NOT trigger run() directly; should be cheap.
           - Stops nav sweep when leaving chapter pages.
           - Intentionally does not restore history.* wrappers (script lifetime ownership).
         */
          
          let lastHref = location.href;
          let syncBurstTimer = null;
        
          const doSync = (why) => {
            try { rootManager?.resolve?.(); } catch {}
            try { novelReloadGuard?.check?.(why); } catch {}
            try { ui?.syncPillVisibility?.(); } catch {}
            
            // If we're NOT on a chapter page, stop any sweep and hard-hide pill
            // (syncPillVisibility already hides, this is just extra safety)
            try {
              if (typeof stopNavSweep === "function" && !isChapterReadingPage()) {
                stopNavSweep();
              }
            } catch {}
          };
        
          // Run a small burst of syncs to catch "URL changed but DOM not swapped yet"
          const syncBurst = (why) => {
            if (syncBurstTimer) clearTimeout(syncBurstTimer);
        
            // Immediate + retries
            doSync(why + ":t0");
            setTimeout(() => doSync(why + ":t150"), 150);
            setTimeout(() => doSync(why + ":t400"), 400);
            setTimeout(() => doSync(why + ":t900"), 900);
        
            // Optional: one final delayed sync
            syncBurstTimer = setTimeout(() => doSync(why + ":t1600"), 1600);
          };
        
          window.addEventListener("popstate", () => syncBurst("popstate"), true);
          window.addEventListener("hashchange", () => syncBurst("hashchange"), true);
        
          const _push = history.pushState;
          const _rep  = history.replaceState;
        
          function wrapped(fn, why) {
            return function () {
              const r = fn.apply(this, arguments);
              setTimeout(() => syncBurst(why), 0);
              return r;
            };
          }
        
          history.pushState = wrapped(_push, "pushState");
          history.replaceState = wrapped(_rep, "replaceState");

          const hrefPollTimer = setInterval(() => {
          const href = location.href;
          if (href === lastHref) return;
          lastHref = href;
          syncBurst("href-poll");
        }, 250);
          
          document.addEventListener("click", () => setTimeout(() => syncBurst("click"), 60), true);
        
          syncBurst("init");
        
        return {
          disconnect() {
            try { clearInterval(hrefPollTimer); } catch {}
            // (Don’t unpatch history.* here—keeping it simple + safe.)
          }
        };
        }

        // Keep nav-nudge:
        setTimeout(() => startNavSweep("nav-nudge"), 900);
      
      /* =========================
         F) Mode-aware wiring
         (Keeps hooks but avoids redundant observers per mode.)
         ========================= */

    let _hooksWired = false;
    let _hookMode = null; // "infinite" or "single"
    
    // Keep track of disconnectors to cleanly switch modes
    const _hookDisposers = new Set();
    function _trackDisposer(d) {
      if (!d) return;
      if (typeof d === "function") _hookDisposers.add(d);
      else if (typeof d.disconnect === "function") _hookDisposers.add(() => d.disconnect());
    }
    function _disposeModeSpecificHooks() {
      for (const fn of _hookDisposers) {
        try { fn(); } catch {}
      }
      _hookDisposers.clear();
    }

    function isInfiniteModeNow() {
      return !!document.querySelector(".chapter-infinite-reader");
    }

      // ===== DO NOT SIMPLIFY =====
      // Contract @NAV (wireHooksModeAware):
      // - Always-on hooks are installed once.
      // - Mode-specific observers are disposable and must be re-armed on mode flip.
      // ==========================
   
    function wireHooksModeAware() {
      const infinite = isInfiniteModeNow();
      const mode = infinite ? "infinite" : "single";

          /* CONTRACT (wireHooksModeAware)
       - Always-on hooks are installed once (click/history/tracker/toc).
       - Mode-specific observers are disposable and MUST be swapped on mode flip.
       - Must never double-install interval/observer hooks (leaks + duplicate nav events).
       */
    
    // If already installed hooks, DO NOT install again.
    // But if mode changed, dispose mode-specific observers and re-arm the right set.
    if (_hooksWired) {
      if (_hookMode !== mode) {
        _hookMode = mode;
    
        // NEW: tear down mode-specific observers from prior mode
        _disposeModeSpecificHooks();
    
        rootManager.resolve();
        onNav("mode-changed");
        ui.syncPillVisibility?.();

        // Re-arm mode-specific observers for the new mode
        // (Intentionally do NOT re-install the always-on click/history/tracker hooks.)
        if (mode === "single") {
          // URL watcher mainly for single-chapter
          _trackDisposer(installUrlChangeWatcher((why) => onNav(why), ui.isEnabled));
    
          const activeObs = installActiveContentObserver(
            () => (rootManager?.getRoot?.() || findContentRoot()),
            (why) => {
              const root = rootManager?.getRoot?.() || findContentRoot();
              if (!root || !contentReady(root)) return;
    
              const cid = getChapterId(root);
              const sigNow = chapterSignature(root, cid);
              if (!cid || !sigNow) return;
    
              const applied = getAppliedSig(novelKey, cid);
              if (!applied || sigNow !== applied) {
                requestRun("active-root-overwrite", { forceFull: true });
              }
            },
            ui.isEnabled
          );
          _trackDisposer(activeObs);
        } else {
          const infObs = installInfiniteReaderAppendObserver((why) => {
            onNav(why);
            setTimeout(() => sweepInfiniteBodies(), 80);
          }, ui.isEnabled);
          _trackDisposer(infObs);
        }
    
      } else {
        // Mode same: just refresh root + do a mild sweep in case the reader mounted late.
        rootManager.resolve();
        startNavSweep("late-mount-nudge", navEpoch);
      }
      return;
    }
 
      _hooksWired = true;
      _hookMode = mode;
    
      // Always helpful across modes
      installNextButtonHook((why) => onNav(why));
      installHistoryHooksLite((why) => onNav(why));
      installChapterTrackerObserver((why) => onNav(why), ui.isEnabled);
      installTocClickHook((why) => onNav(why));
    
      // Mode-specific observers must be disposable (for mode flips)
      if (!infinite) {
        _trackDisposer(installUrlChangeWatcher((why) => onNav(why), ui.isEnabled));
      
        const activeObs = installActiveContentObserver(
          () => (rootManager?.getRoot?.() || findContentRoot()),
          (why) => {
            const root = rootManager?.getRoot?.() || findContentRoot();
            if (!root || !contentReady(root)) return;
      
            const cid = getChapterId(root);
            const sigNow = chapterSignature(root, cid);
            if (!cid || !sigNow) return;
      
            const applied = getAppliedSig(novelKey, cid);
            if (!applied || sigNow !== applied) {
              requestRun("active-root-overwrite", { forceFull: true });
            }
          },
          ui.isEnabled
        );
        _trackDisposer(activeObs);
      } else {
        const infObs = installInfiniteReaderAppendObserver((why) => {
          onNav(why);
          setTimeout(() => sweepInfiniteBodies(), 80);
        }, ui.isEnabled);
        _trackDisposer(infObs);
      }
    }
    // CONTRACT (installModeFlipWatcher)
    // @GATE Detect single ↔ infinite reader flips
    function installModeFlipWatcher() {
      let last = isInfiniteModeNow() ? "infinite" : "single";
      let t = null;
    
      const mo = new MutationObserver(() => {
        if (t) return;
        t = setTimeout(() => {
          t = null;
          const cur = isInfiniteModeNow() ? "infinite" : "single";
          if (cur === last) return;
          last = cur;
          wireHooksModeAware();
        }, 120);
      });
    
      mo.observe(document.documentElement, { childList: true, subtree: true });
      return { disconnect: () => { try { mo.disconnect(); } catch {} } };
    }
 
      // Call once at startup:
      wireHooksModeAware();

      // Install route watcher once (SPA: hide pill immediately when leaving chapter pages)
      _trackDisposer(installRouteWatcher({ ui, rootManager, stopNavSweep }));

      // NEW: watch for infinite reader mount/unmount and rewire observers
      _trackDisposer(installModeFlipWatcher());
   
      // And re-evaluate once shortly after load (reader can mount late):
      setTimeout(() => wireHooksModeAware(), 1600);

      // Initial run
      requestRun("initial", { forceFull: true });
      
      // Start watchdog
      startChapterMonitor();
    
  })();
})();
