// ==UserScript==
// @name          MxM In-Editor Formatter (EN)
// @namespace     mxm-tools
// @version       2.0.0
// @deprecated    true
// @homepageURL   https://chromewebstore.google.com/detail/mxm-in-editor-formatter-e/baneadebamaohnochaahaboadkdajamo
// @supportURL    https://chromewebstore.google.com/detail/mxm-in-editor-formatter-e/baneadebamaohnochaahaboadkdajamo
// @description   ⚠️ DEPRECATED — Install the official Chrome extension instead
// @author        Richard Mangezi Muketa
// @match         https://curators.musixmatch.com/*
// @match         https://curators-beta.musixmatch.com/*
// @run-at        document-idle
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/556204/MxM%20In-Editor%20Formatter%20%28EN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556204/MxM%20In-Editor%20Formatter%20%28EN%29.meta.js
// ==/UserScript==

(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const DEPRECATION_TS = Date.UTC(2025, 11, 31, 23, 59, 0);
  const STORE_URL =
    'https://chromewebstore.google.com/detail/mxm-in-editor-formatter-e/baneadebamaohnochaahaboadkdajamo';

  const now = Date.now();

  // Show notice until hard cutoff
  if (now > DEPRECATION_TS) {
    document.body.innerHTML = '';
    alert(
      'MxM In-Editor Formatter has been permanently disabled.\n\n' +
      'Please install the official Chrome extension to continue.'
    );
    window.location.href = STORE_URL;
    return;
  }

  // ----- Modal -----
  const overlay = document.createElement('div');
  const modal = document.createElement('div');

  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  modal.style.cssText = `
    background: linear-gradient(180deg, #0e2a4f, #0b1f3a);
    color: #f5e3a1;
    border: 2px solid #d4af37;
    border-radius: 14px;
    padding: 22px 26px;
    max-width: 520px;
    width: calc(100% - 32px);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    box-shadow: 0 20px 50px rgba(0,0,0,0.6);
  `;

  modal.innerHTML = `
    <h2 style="margin:0 0 10px;font-size:18px;color:#ffd76a;">
      MxM In-Editor Formatter — Deprecation Notice
    </h2>

    <p style="margin:0 0 12px;font-size:14px;line-height:1.5;">
      This userscript is <strong>deprecated</strong> and will be permanently
      disabled on <strong>31 December 2025 at 23:59 (UTC)</strong>.
    </p>

    <p style="margin:0 0 18px;font-size:14px;">
      You may continue using it for now, or install the official Chrome extension.
    </p>

    <div style="display:flex;justify-content:flex-end;gap:12px;">
      <button id="mxmCloseDeprecation"
        style="
          background:#1c355e;
          color:#f5e3a1;
          border:1px solid #d4af37;
          border-radius:10px;
          padding:8px 14px;
          cursor:pointer;
        ">
        Close
      </button>

      <button id="mxmGoExtension"
        style="
          background:#d4af37;
          color:#0b1f3a;
          border:none;
          border-radius:10px;
          padding:8px 16px;
          font-weight:600;
          cursor:pointer;
        ">
        Go to Extension
      </button>
    </div>
  `;

  overlay.appendChild(modal);
  document.documentElement.appendChild(overlay);

  // Prevent dismissal by ESC
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') e.preventDefault();
  }, true);

  document.getElementById('mxmGoExtension').onclick = () => {
    window.open(STORE_URL, '_blank', 'noopener');
  };

  document.getElementById('mxmCloseDeprecation').onclick = () => {
    overlay.remove();
  };
})();

(function (global) {
  const hasWindow = typeof window !== 'undefined' && typeof document !== 'undefined';
  const root = hasWindow ? window : global;
  const SCRIPT_VERSION = '2.0.0'; // Bumped version
  const ALWAYS_AGGRESSIVE = true;
  const SETTINGS_KEY = 'mxmFmtSettings.v105';
  const defaults = { showPanel: true, aggressiveNumbers: true };
  const LAST_ORIGINAL_KEY = 'mxmFmtLastOriginal.v1';
  let lastFormatState = null;
  const runningAsExtension =
    typeof chrome !== 'undefined' &&
    typeof chrome.runtime === 'object' &&
    !!chrome.runtime?.id;
  const extensionDefaults = {
    lang: "EN",
    autoLowercase: false,
    fixBackingVocals: true,
    showFloatingButton: !runningAsExtension // show button for userscript installs
  };
  const extensionOptions = { ...extensionDefaults };
  const LANG_RULES = {
    EN: { preserve: ['Latin'], droppedG: true, tagMap: {} },
    RU: {
      preserve: ['Cyrillic'],
      droppedG: false,
      tagMap: {
        куплет: '#VERSE',
        припев: '#CHORUS',
        хук: '#HOOK',
        бридж: '#BRIDGE',
        интерлюдия: '#BRIDGE',
        брейкдаун: '#BRIDGE',
        брэйкдаун: '#BRIDGE',
        инструментал: '#INSTRUMENTAL',
        интро: '#INTRO',
        аутро: '#OUTRO',
        предприпев: '#PRE-CHORUS',
        'пред-припев': '#PRE-CHORUS'
      }
    },
    ES: {
      preserve: ['Latin'],
      droppedG: false,
      tagMap: {
        verso: '#VERSE',
        coro: '#CHORUS',
        puente: '#BRIDGE',
        intro: '#INTRO',
        outro: '#OUTRO',
        instrumental: '#INSTRUMENTAL'
      }
    },
    PT: {
      preserve: ['Latin'],
      droppedG: false,
      tagMap: {
        verso: '#VERSE',
        refrão: '#CHORUS',
        ponte: '#BRIDGE',
        intro: '#INTRO',
        outro: '#OUTRO',
        instrumental: '#INSTRUMENTAL'
      }
    },
    FR: {
      preserve: ['Latin'],
      droppedG: false,
      tagMap: {
        couplet: '#VERSE',
        refrain: '#CHORUS',
        pont: '#BRIDGE',
        intro: '#INTRO',
        outro: '#OUTRO',
        instrumental: '#INSTRUMENTAL'
      }
    },
    IT: {
      preserve: ['Latin'],
      droppedG: false,
      tagMap: {
        strofa: '#VERSE',
        ritornello: '#CHORUS',
        bridge: '#BRIDGE',
        intro: '#INTRO',
        outro: '#OUTRO',
        strumentale: '#INSTRUMENTAL'
      }
    },
    EL: { preserve: ['Greek'], droppedG: false, tagMap: {} }
  };

  function readLocalOption(key){
    if(!hasWindow) return null;
    try{
      return root.localStorage.getItem(key);
    }catch{
      return null;
    }
  }

  function writeLocalOption(key,value){
    if(!hasWindow) return;
    try{
      if(value===null) root.localStorage.removeItem(key);
      else root.localStorage.setItem(key,value);
    }catch{
      /* ignore storage errors */
    }
  }

  const storedLang = readLocalOption('mxmFmtLang');
  if(typeof storedLang === 'string' && storedLang) extensionOptions.lang = storedLang;
  const storedLower = readLocalOption('mxmFmtAutoLowercase');
  if(storedLower !== null) extensionOptions.autoLowercase = storedLower === '1' || storedLower === 'true';

  const BV_FIRST_WORD_EXCEPTIONS = new Set([
    'I',
    "I'm",
    "I'ma",
    "I'll",
    "I'd",
    'i',
    "i'm",
    "i'ma",
    "i'll",
    "i'd",
    'Jesus',
    'Christ',
    'God',
    'Lord',
    'jesus',
    'christ',
    'god',
    'lord'
  ]);

  function loadSettings() {
    if (!hasWindow) return { ...defaults };
    try {
      const stored = root.localStorage.getItem(SETTINGS_KEY);
      return { ...defaults, ...(stored ? JSON.parse(stored) : {}) };
    } catch {
      return { ...defaults };
    }
  }

  const settings = loadSettings();

  function saveLastOriginal(el, text) {
    lastFormatState = { text, element: el || null, doc: el?.ownerDocument || null };
    if (hasWindow) {
      try {
        root.localStorage.setItem(LAST_ORIGINAL_KEY, JSON.stringify({ text }));
      } catch (err) {
        console.warn('Failed to persist last original:', err);
        toast('⚠️ Could not store original lyrics (storage full)');
      }
    }
    updateRevertButtonState();
  }

  function readStoredOriginal() {
    if (!hasWindow) return null;
    let raw = null;
    try {
      raw = root.localStorage.getItem(LAST_ORIGINAL_KEY);
    } catch {
      return null;
    }
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.text === 'string') return parsed.text;
    } catch {
      return raw;
    }
    return null;
  }

  function getLastOriginalText() {
    if (lastFormatState) return lastFormatState.text;
    return readStoredOriginal();
  }

  const focusTrackedDocs = new WeakSet();
  const shortcutTrackedDocs = new WeakSet();

  const INSTRUMENTAL_PHRASE_RE = /^(?:instrumental(?:\s+(?:break|bridge|outro|interlude|solo))?)$/i;

  // ============================================================
  //  STRICT ROUTE DETECTION LAYER (Mode=Edit Only)
  //  Replaces previous DOM-based detection
  // ============================================================

  function isAllowedPage() {
    if (!hasWindow) return false;
    const url = new URL(window.location.href);

    // 1. Must be on /tool path
    if (url.pathname !== '/tool' && url.pathname !== '/tool/') return false;

    // 2. Must be STRICTLY 'edit' mode
    // This filters out: mode=sync, mode=tag_structure, mode=tag_performer, etc.
    const mode = url.searchParams.get('mode');
    if (mode !== 'edit') return false;

    return true;
  }

  function checkRouteAndVisibility() {
    let container = document.getElementById('mxmFmtBtnWrap');
    const allowed = isAllowedPage();

    if (allowed) {
        // If allowed but missing, create it
        if (!container && extensionOptions.showFloatingButton) {
            createFloatingButton();
            container = document.getElementById('mxmFmtBtnWrap');
        }

        // Ensure it is visible
        if (container) container.style.display = 'flex';
        ensureShortcutListeners();
    } else {
        // If forbidden, hide it
        if (container) container.style.display = 'none';
    }
  }

  // Monitor URL changes for Single Page Application navigation
  if (hasWindow) {
    let lastUrl = location.href;
    const spaObserver = new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            checkRouteAndVisibility();
        }
    });
    // Start observing body for changes that indicate navigation
    spaObserver.observe(document.body, { childList: true, subtree: true });
  }

  // ============================================================
  //   END OF ROUTE DETECTION LAYER
  // ============================================================


  // ---------- Dynamic Focus Tracker ----------
  let currentEditable = null;
  function findDeepEditable(rootDoc) {
    let el = rootDoc.activeElement;
    while (el) {
      if (el.shadowRoot && el.shadowRoot.activeElement) el = el.shadowRoot.activeElement;
      else if (el.tagName === "IFRAME" && el.contentDocument?.activeElement)
        el = el.contentDocument.activeElement;
      else break;
    }
    if (el?.isContentEditable || el?.tagName === "TEXTAREA" || el?.getAttribute?.("role") === "textbox")
      return el;
    return null;
  }

  // ---------- Number Rules ----------
  const NUM_WORDS_0_10 = ["zero","one","two","three","four","five","six","seven","eight","nine","ten"];
  const WORD_TO_NUM_11_19 = { eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19 };
  const WORD_TO_TENS = { twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90 };
  const WORD_TO_ONES = { one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9 };
  const OCLOCK_DIGIT_TO_WORD = {
    1:"one",2:"two",3:"three",4:"four",5:"five",6:"six",7:"seven",8:"eight",9:"nine",10:"ten",11:"eleven",12:"twelve"
  };
  const OCLOCK_WORD_SET = new Set(Object.values(OCLOCK_DIGIT_TO_WORD));

  function isTimeContext(line, _s, e) {
    const after = line.slice(e);
    return (/^\s*:\s*\d{2}/.test(after) || /^\s*(?:a|p)\.?m\.?/i.test(after) || /^\s*(?:am|pm)\b/i.test(after));
  }
  function isDateContext(line, s, e) {
    const ctx = line.slice(Math.max(0, s - 6), Math.min(line.length, e + 6));
    return (/(?:\d{1,2}[\/-]\d{1,2}(?:[\/-]\d{2,4})?)/.test(ctx) || /\b(19|20)\d{2}\b/.test(ctx));
  }
  function isDecadeNumeric(line, _s, e) {
    const after = line.slice(e);
    return /^['’]s\b/.test(after);
  }
  function isOClockFollowing(line, e) {
    const after = line.slice(e);
    return /^\s*(?:o\s+clock|oclock|o['’]clock)\b/i.test(after);
  }
  function isCountingSequence(line) {
    // ← replace the whole old function with this one line
    return /^\s*(?:\d{1,2}\s*[,–—.\u2026]?\s*){2,}\d{1,2}\b.*\b(?:go|down|lift.?off|let['’]?s\s*go|c'?mon|start|ready|set|and)?\b/i.test(line.trim());
  }

  function spellOutCountSequence(line) {
    // ← replace the whole old function with this
    return line
      .replace(/\b(0|[1-9]|10)\b/g, (_, d) => ["zero","one","two","three","four","five","six","seven","eight","nine","ten"][d])
      .replace(/\s*[,–—.\u2026]+\s*/g, ", ")   // turns - • … : ; into ", "
      .replace(/\s+/g, " ")                           // collapse spaces
      .trim();                                 // remove leading/trailing junk
      // no capitalization → stays lowercase, exactly what you want
  }
  function numerals0to10ToWords(line) {
    const re = /\b(0|1|2|3|4|5|6|7|8|9|10)\b/g;
    let out = "", last = 0, m;
    while ((m = re.exec(line)) !== null) {
      const s = m.index, e = s + m[0].length, num = parseInt(m[0], 10);
      if (
        isTimeContext(line, s, e) ||
        isDateContext(line, s, e) ||
        isDecadeNumeric(line, s, e)
      ) {
        out += line.slice(last, e);
      }
      else out += line.slice(last, s) + NUM_WORDS_0_10[num];
      last = e;
    }
    out += line.slice(last);
    return out;
  }
  function words11to99ToNumerals(line) {
    line = line.replace(/\b(eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)\b/gi,
      (w, raw, offset, str) => {
        const end = offset + w.length;
        if (isOClockFollowing(str, end)) return w;
        return String(WORD_TO_NUM_11_19[raw.toLowerCase()]);
      });
    line = line.replace(/\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:[-\s]+(one|two|three|four|five|six|seven|eight|nine)|(one|two|three|four|five|six|seven|eight|nine))?\b/gi,
      (_, tensRaw, onesWithSep, onesBare, offset, str) => {
        const match = _;
        const end = offset + match.length;
        if (isOClockFollowing(str, end)) return match;
        let n = WORD_TO_TENS[tensRaw.toLowerCase()];
        const onesRaw = onesWithSep || onesBare;
        if (onesRaw) n += WORD_TO_ONES[onesRaw.toLowerCase()];
        return String(n);
      });
    return line;
  }
  function applyNumberRules(text) {
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const currentLine = lines[i];
      if (isCountingSequence(currentLine)) {
        lines[i] = spellOutCountSequence(currentLine);
        continue;
      }
      // Always convert 0–10 to words, and 11–99 to numerals when aggressive mode is on.
      let L = numerals0to10ToWords(currentLine);
      if (settings.aggressiveNumbers) L = words11to99ToNumerals(L);
      lines[i] = L;
    }
    return lines.join('\n');
  }

  function normalizeSpelledOutNumbers(text) {
    return text.replace(
      /\b(one|two|three|four|five|six|seven|eight|nine|ten)\s+(?=(one|two|three|four|five|six|seven|eight|nine|ten)\b)/gi,
      "$1, "
    );
  }

  function normalizeOClock(text) {
    if (!text) return text;
    const re = /\b(?:(\d{1,2})|(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve))\s*(o['’]?\s*clock)\b/gi;
    return text.replace(re, (match, digit, word, tail) => {
      let baseWord;
      if (digit) {
        const num = parseInt(digit, 10);
        baseWord = OCLOCK_DIGIT_TO_WORD[num];
        if (!baseWord) return match;
      } else {
        const lower = word.toLowerCase();
        if (!OCLOCK_WORD_SET.has(lower)) return match;
        baseWord = lower;
      }
      let normalizedWord;
      if (word) {
        if (word === word.toUpperCase()) normalizedWord = baseWord.toUpperCase();
        else normalizedWord = baseWord;
      } else {
        normalizedWord = baseWord;
      }
      const tailLetters = tail.replace(/[^A-Za-z]/g, '');
      const isAllCaps = tailLetters && tailLetters === tailLetters.toUpperCase();
      if (isAllCaps) normalizedWord = normalizedWord.toUpperCase();
      const clockPart = isAllCaps ? " O'CLOCK" : " o'clock";
      return normalizedWord + clockPart;
    });
  }

  const WORD_TO_DIGIT_TIME = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
  seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12
};

  const MERIDIEM_PATTERN = '(?:a|p)\\s*\\.?\\s*m\\.?';
  const MERIDIEM_TRAIL = '(?=$|[^A-Za-z0-9_])';
  const DIGIT_TIME_RE = new RegExp(`\\b(\\d{1,2})(?:\\s*[:.]\\s*(\\d{1,2}))?\\s*(${MERIDIEM_PATTERN})${MERIDIEM_TRAIL}`, 'gi');
  const WORD_TIME_RE = new RegExp(`\\b(${Object.keys(WORD_TO_DIGIT_TIME).join('|')})\\b\\s*(${MERIDIEM_PATTERN})${MERIDIEM_TRAIL}`, 'gi');

  function normalizeAmPmTimes(text) {
    if (!text) return text;

    const normalizeMeridiem = token => {
      const match = token.match(/[ap]/i);
      const letter = match ? match[0].toLowerCase() : 'a';
      return letter === 'a' ? 'a.m.' : 'p.m.';
    };

    text = text.replace(DIGIT_TIME_RE, (match, hourRaw, minuteRaw, meridiemToken) => {
      const hour = parseInt(hourRaw, 10);
      if (!Number.isFinite(hour) || hour > 12) return match;
      if (minuteRaw && minuteRaw.length > 2) return match;
      const minute = minuteRaw ? minuteRaw.padStart(2, '0') : null;
      const meridiem = normalizeMeridiem(meridiemToken);
      return minute ? `${hour}:${minute} ${meridiem}` : `${hour} ${meridiem}`;
    });

    text = text.replace(WORD_TIME_RE, (match, hourWord, meridiemToken) => {
      const hour = WORD_TO_DIGIT_TIME[hourWord.toLowerCase()];
      if (hour === undefined) return match;
      const meridiem = normalizeMeridiem(meridiemToken);
      return `${hour} ${meridiem}`;
    });

    return text;
  }

  const NO_INTERJECTION_FOLLOWERS = new Set([
    "i","i'm","im","i'd","i'll","i've","imma",
    "you","you're","youre","u","ya","y'all","yall","ya'll",
    "he","she","we","they","it","it's","its",
    "there","there's","theres","this","that","these","those",
    "dont","don't","do","does","did","didn't","didnt",
    "cant","can't","cannot","wont","won't","wouldnt","wouldn't",
    "shouldnt","shouldn't","couldnt","couldn't","aint","ain't",
    "never","ever","please","thanks","thank","sorry",
    "sir","ma'am","maam","bro","dude","man","girl","boy","baby","babe","darling","honey",
    "stop","wait","listen","hold","hang","come","comeon","c'mon","let","lets","let's",
    "leave","gimme","gonna","gotta","no","nah"
  ]);

  const NO_TRAILING_SKIP_PREV = new Set([
    "say","says","said","tell","tells","told","ask","asks","asked",
    "reply","replies","replied","yell","yells","yelled","shout","shouts","shouted",
    "scream","screams","screamed","whisper","whispers","whispered"
  ]);

  const NO_QUOTE_CHARS = "\"'“”‘’";
  const NO_BETWEEN_WORDS_RE = /((?:['’]?)[A-Za-z0-9][^\s,.;!?()#"]*)([ \t]+)([Nn][Oo])([ \t]+)((?:['’]?)[A-Za-z0-9][^\s,.;!?()#"]*)/g;
  const NO_FILLER_REMOVE_RE =
    /(\b(?:yeah|yea|yah|ya|yup|yep|yuh)\b)(\s*,?\s+)([Nn][Oo])(\s+)((?:['’]?)[A-Za-z0-9][^\s,.;!?()#"]*)/gi;

  function normalizeNoBoundaryWord(word, removeLeading) {
    if (!word) return '';
    let out = word;
    if (removeLeading) out = out.replace(/^['’"]+/, '');
    else out = out.replace(/['’"]+$/, '');
    return out.toLowerCase();
  }

  function isNumericToken(token) {
    return token !== '' && /^\d+$/.test(token);
  }

  function shouldIsolateStandaloneNo(prevWord, nextWord) {
    if (!nextWord) return false;
    const prevLower = normalizeNoBoundaryWord(prevWord, true);
    const nextLower = normalizeNoBoundaryWord(nextWord, false);
    if (!nextLower) return false;
    if (nextLower === 'no') return false;
    if (prevLower === 'no') return false;
    if (isNumericToken(prevLower) || isNumericToken(nextLower)) return true;
    if (NO_INTERJECTION_FOLLOWERS.has(nextLower)) return true;
    return false;
  }

  function shouldCommaAfterNo(str, idx) {
    let i = idx;
    while (i < str.length && (str[i] === ' ' || str[i] === '\t')) i++;
    while (i < str.length && NO_QUOTE_CHARS.includes(str[i])) i++;
    if (i >= str.length) return false;
    if (str[i] === '\n') return false;
    if (str[i] === ',') return false;
    if (/[.!?;:)]/.test(str[i])) return false;
    const match = str.slice(i).match(/^([A-Za-z']+)/);
    if (!match) return false;
    const nextLower = match[1].toLowerCase();
    return NO_INTERJECTION_FOLLOWERS.has(nextLower);
  }

  function applyNoCommaRules(text) {
    if (!text) return text;

    // Exempt idioms like "Say no more" from added commas
    text = text.replace(/\b(Say|Told|Telling|Tell|Tells)\s+no\s+more\b/gi, m => m);

    text = text.replace(
      NO_FILLER_REMOVE_RE,
      (match, fillerWord, separator, _noWord, postSpaces, nextWord) => {
        if (separator.includes('\n') || postSpaces.includes('\n')) return match;
        const nextLower = nextWord.replace(/['’"]+$/, '').toLowerCase();
        if (nextLower === 'no') return match;
        if (NO_INTERJECTION_FOLLOWERS.has(nextLower)) return match;
        const normalizedSeparator = separator.includes(',') ? ', ' : ' ';
        return `${fillerWord}${normalizedSeparator}${nextWord}`;
      }
    );

    text = text.replace(
      NO_BETWEEN_WORDS_RE,
      (match, prevWord, preSpaces, noWord, postSpaces, nextWord) => {
        if (preSpaces.includes('\n') || postSpaces.includes('\n')) return match;

        const prevLower = prevWord.replace(/^['’"]+/, '').toLowerCase();
        const nextLower = nextWord.replace(/['’"]+$/, '').toLowerCase();
        if (nextLower === 'more' && /^(say|told|telling|tell|tells)$/.test(prevLower)) return match;

        if (!shouldIsolateStandaloneNo(prevWord, nextWord)) return match;

        return `${prevWord}, ${noWord}, ${nextWord}`;
      }
    );

    text = text.replace(
      /((?:['’]?)[A-Za-z0-9][^\s,.;!?()#"]*)(\s*,\s*)([Nn][Oo])([ \t]+)((?:['’]?)[A-Za-z0-9][^\s,.;!?()#"]*)/g,
      (match, prevWord, commaBlock, noWord, postSpaces, nextWord) => {
        if (postSpaces.includes('\n')) return match;

        const prevLower = prevWord.replace(/^['’"]+/, '').toLowerCase();
        const nextLower = nextWord.replace(/['’"]+$/, '').toLowerCase();
        if (nextLower === 'more' && /^(say|told|telling|tell|tells)$/.test(prevLower)) return match;

        if (!shouldIsolateStandaloneNo(prevWord, nextWord)) return match;

        return `${prevWord}, ${noWord}, ${nextWord}`;
      }
    );

    text = text.replace(
      /((?:['’]?)[A-Za-z0-9][^\s,.;!?()#"]*)([ \t]+)([Nn][Oo])(\s*,\s*)((?:['’]?)[A-Za-z0-9][^\s,.;!?()#"]*)/g,
      (match, prevWord, preSpaces, noWord, commaBlock, nextWord) => {
        if (preSpaces.includes('\n') || postSpaces.includes('\n')) return match;

        const prevLower = prevWord.replace(/^['’"]+/, '').toLowerCase();
        const nextLower = nextWord.replace(/['’"]+$/, '').toLowerCase();
        if (nextLower === 'more' && /^(say|told|telling|tell|tells)$/.test(prevLower)) return match;

        if (!shouldIsolateStandaloneNo(prevWord, nextWord)) return match;

        return `${prevWord}, ${noWord}, ${nextWord}`;
      }
    );

    text = text.replace(
      /(\b[\w'"]+)(\s*,\s*|\s+)([Nn][Oo])(\s+)([A-Za-z']+)/g,
      (match, prevWord, separator, noWord, postSpace, nextWord, offset, str) => {
        if (separator.includes('\n') || postSpace.includes('\n')) return match;
        const noStart = offset + prevWord.length + separator.length;
        if (!shouldCommaAfterNo(str, noStart + noWord.length)) return match;

        const nextLower = nextWord.toLowerCase();
        const prevLower = prevWord.replace(/^["']/,'').toLowerCase();

        if (nextLower === 'more' && /^(say|told|telling|tell|tells)$/.test(prevLower)) {
          return match;
        }

        if (!shouldIsolateStandaloneNo(prevWord, nextWord)) return match;

        const hasCommaBefore = separator.includes(',');
        const before = hasCommaBefore
          ? `${prevWord}, ${noWord}`
          : (NO_TRAILING_SKIP_PREV.has(prevLower)
            ? `${prevWord} ${noWord}`
            : `${prevWord}, ${noWord}`);

        if (NO_INTERJECTION_FOLLOWERS.has(nextLower)) {
          return `${before}, ${nextWord}`;
        }

        return `${before} ${nextWord}`;
      }
    );

    text = text.replace(/\b([Nn][Oo])([ \t]+)(?=[Nn][Oo]\b)/g, (_, word) => word + ', ');

    text = text.replace(/(\.\.\.|…)([ \t]+)([Nn][Oo])\b(?!\s*,)/g,
      (match, dots, spaces, noWord, offset, str) => {
        const noStart = offset + dots.length + spaces.length;
        const afterIndex = noStart + noWord.length;
        if (shouldCommaAfterNo(str, afterIndex)) return `${dots}, ${noWord}`;

        let i = afterIndex;
        while (i < str.length && /\s/.test(str[i])) i++;
        while (i < str.length && NO_QUOTE_CHARS.includes(str[i])) i++;
        if (i >= str.length || str[i] === '\n') return `${dots}, ${noWord}`;
        if (/[.!?;:)]/.test(str[i])) return `${dots}, ${noWord}`;

        return match;
      });

    text = text.replace(/(^|\n)(\s*)([Nn][Oo])\b(?!\s*,)/g, (match, boundary, spaces, word, offset, str) => {
      const afterIndex = offset + match.length;
      if (shouldCommaAfterNo(str, afterIndex)) return boundary + spaces + word + ',';
      return match;
    });

    text = text.replace(/(\b[\w'"]+)([ \t]+)([Nn][Oo])(?=(?:\s*[.!?](?:\s|$)|\s*$))/g,
      (_match, prevWord, _spaces, noWord) => `${prevWord}, ${noWord}`);

    return text;
  }

// ---------- Global Proper Noun Support (no CSV) ----------
  // Small, hand-picked list you can extend as needed.
  // Everything should be stored in lowercase here; the canonical
  // form is what will be written into the lyrics.
  // === GLOBAL PROPER NOUN CANONICAL MAP ===
  const GLOBAL_PROPER_CANONICAL = {
    // Countries
    "usa": "USA",
    "uk": "UK",
    "france": "France",
    "china": "China",
    "japan": "Japan",
    "brazil": "Brazil",
    "spain": "Spain",
    "mexico": "Mexico",
    "germany": "Germany",
    "italy": "Italy",
    "canada": "Canada",
    "australia": "Australia",

    // US Cities
    "ny": "NY",
    "nyc": "NYC",
    "atl": "ATL",
    "atlanta": "Atlanta",
    "miami": "Miami",
    "chicago": "Chicago",
    "houston": "Houston",
    "dallas": "Dallas",
    "memphis": "Memphis",
    "detroit": "Detroit",
    "oakland": "Oakland",
    "baltimore": "Baltimore",
    "compton": "Compton",
    "queens": "Queens",
    "harlem": "Harlem",
    "bronx": "Bronx",
    "brooklyn": "Brooklyn",
    "philly": "Philly",
    "boston": "Boston",

    // International Cities
    "london": "London",
    "paris": "Paris",
    "tokyo": "Tokyo",
    "osaka": "Osaka",
    "kyoto": "Kyoto",
    "seoul": "Seoul",
    "lagos": "Lagos",
    "accra": "Accra",
    "nairobi": "Nairobi",
    "kampala": "Kampala",
    "kigali": "Kigali",
    "johannesburg": "Johannesburg",
    "durban": "Durban",
    "sydney": "Sydney",
    "melbourne": "Melbourne",
    "toronto": "Toronto",
    "vancouver": "Vancouver",
    "amsterdam": "Amsterdam",
    "berlin": "Berlin",
    "munich": "Munich",
    "dubai": "Dubai",
    "kingston": "Kingston",
    "rio": "Rio",

    // Places & Hoods
    "hollywood": "Hollywood",
    "beverly": "Beverly",
    "chinatown": "Chinatown",
    "soweto": "Soweto",
    "kibera": "Kibera",

    // Luxury Fashion
    "gucci": "Gucci",
    "chanel": "Chanel",
    "prada": "Prada",
    "balenciaga": "Balenciaga",
    "dior": "Dior",
    "fendi": "Fendi",
    "versace": "Versace",
    "givenchy": "Givenchy",
    "hermes": "Hermès",
    "cartier": "Cartier",
    "burberry": "Burberry",
    "moncler": "Moncler",
    "off-white": "Off-White",
    "bape": "Bape",

    // Footwear / Streetwear
    "nike": "Nike",
    "adidas": "Adidas",
    "puma": "Puma",
    "vans": "Vans",
    "converse": "Converse",
    "timberland": "Timberland",
    "timbs": "Timbs",

    // Tech & Platforms
    "itunes": "iTunes",
    "spotify": "Spotify",
    "deezer": "Deezer",
    "youtube": "YouTube",
    "tiktok": "TikTok",
    "instagram": "Instagram",
    "facebook": "Facebook",
    "twitter": "Twitter",
    "snapchat": "Snapchat",
    "reddit": "Reddit",
    "whatsapp": "WhatsApp",
    "telegram": "Telegram",
    "gmail": "Gmail",
    "google": "Google",
    "amazon": "Amazon",
     "xbox": "Xbox",
    "playstation": "PlayStation",
    "nintendo": "Nintendo",
    "github": "GitHub",
    "chatgpt": "ChatGPT",

    // Convenience stores
    "7-eleven": "7-Eleven",

    // Cars
    "toyota": "Toyota",
    "benz": "Benz",
    "chevy": "Chevy",
    "bmw": "BMW",
    "tesla": "Tesla",
    "audi": "Audi",
    "honda": "Honda",
    "nissan": "Nissan",
    "subaru": "Subaru",
    "jeep": "Jeep",
    "lamborghini": "Lamborghini",
    "ferrari": "Ferrari",
    "porsche": "Porsche",
    "maserati": "Maserati",
    "rover": "Rover",

    // Alcohol
    "hennessy": "Hennessy",
    "henny": "Henny",
    "moet": "Moët",
    "patrón": "Patrón",
    "bacardi": "Bacardi",
    "ciroc": "CÎROC",

    // Weapons (always capitalize)
    "glock": "Glock",
    "uzi": "Uzi",
    "draco": "Draco",
    "ak": "AK",
    "ar": "AR"
  };

  /* ============================================================
      === GOOGLE SHEET PROPER NOUN CANONICAL MAP (STRUCTURAL-FUZZY) ===
      Column A (lowercase raw) → Column B (canonical form)
      ============================================================ */

  const GLOBAL_PROPER_FROM_SHEET = {
    "usa": "USA",
    "uk": "UK",
    "france": "France",
    "china": "China",
    "japan": "Japan",
    "brazil": "Brazil",
    "spain": "Spain",
    "mexico": "Mexico",
    "germany": "Germany",
    "italy": "Italy",
    "canada": "Canada",
    "australia": "Australia",
    "south africa": "South Africa",
    "ny": "NY",
    "nyc": "NYC",
    "atl": "ATL",
    "atlanta": "Atlanta",
    "miami": "Miami",
    "chicago": "Chicago",
    "houston": "Houston",
    "dallas": "Dallas",
    "memphis": "Memphis",
    "detroit": "Detroit",
    "oakland": "Oakland",
    "baltimore": "Baltimore",
    "compton": "Compton",
    "harlem": "Harlem",
    "bronx": "Bronx",
    "brooklyn": "Brooklyn",
    "philly": "Philly",
    "boston": "Boston",
    "los angeles": "Los Angeles",
    "new york": "New York",
    "new york city": "New York City",
    "long beach": "Long Beach",
    "london": "London",
    "paris": "Paris",
    "tokyo": "Tokyo",
    "osaka": "Osaka",
    "kyoto": "Kyoto",
    "seoul": "Seoul",
    "lagos": "Lagos",
    "accra": "Accra",
    "nairobi": "Nairobi",
    "kampala": "Kampala",
    "kigali": "Kigali",
    "johannesburg": "Johannesburg",
    "durban": "Durban",
    "sydney": "Sydney",
    "melbourne": "Melbourne",
    "toronto": "Toronto",
    "vancouver": "Vancouver",
    "amsterdam": "Amsterdam",
    "berlin": "Berlin",
    "munich": "Munich",
    "dubai": "Dubai",
    "kingston": "Kingston",
    "rio": "Rio",
    "cape town": "Cape Town",
    "hollywood": "Hollywood",
    "beverly": "Beverly",
    "chinatown": "Chinatown",
    "soweto": "Soweto",
    "kibera": "Kibera",
    "beverly hills": "Beverly Hills",
    "gucci": "Gucci",
    "chanel": "Chanel",
    "prada": "Prada",
    "balenciaga": "Balenciaga",
    "dior": "Dior",
    "fendi": "Fendi",
    "versace": "Versace",
    "givenchy": "Givenchy",
    "hermes": "Hermès",
    "cartier": "Cartier",
    "burberry": "Burberry",
    "moncler": "Moncler",
    "off-white": "Off-White",
    "bape": "Bape",
    "louis vuitton": "Louis Vuitton",
	"mercedes benz": "Mercedes-Benz",
    "nike": "Nike",
    "adidas": "Adidas",
    "puma": "Puma",
    "vans": "Vans",
    "converse": "Converse",
    "timberland": "Timberland",
    "timbs": "Timbs",
    "itunes": "iTunes",
    "spotify": "Spotify",
    "deezer": "Deezer",
    "tidal": "TIDAL",
    "youtube": "YouTube",
    "tiktok": "TikTok",
    "instagram": "Instagram",
    "facebook": "Facebook",
    "twitter": "Twitter",
    "snapchat": "Snapchat",
    "reddit": "Reddit",
    "whatsapp": "WhatsApp",
    "telegram": "Telegram",
    "gmail": "Gmail",
    "google": "Google",
    "amazon": "Amazon",
    "xbox": "Xbox",
    "playstation": "PlayStation",
    "nintendo": "Nintendo",
    "github": "GitHub",
    "chatgpt": "ChatGPT",
    "toyota": "Toyota",
    "benz": "Benz",
    "chevy": "Chevy",
    "bmw": "BMW",
    "tesla": "Tesla",
    "audi": "Audi",
    "honda": "Honda",
    "nissan": "Nissan",
    "subaru": "Subaru",
    "jeep": "Jeep",
	"rolex": "Rolex",
	"smith and wesson": "Smith & Wesson",
    "lamborghini": "Lamborghini",
    "ferrari": "Ferrari",
    "porsche": "Porsche",
    "maserati": "Maserati",
    "rover": "Rover",
    "range rover": "Range Rover",
    "hennessy": "Hennessy",
    "henny": "Henny",
    "moet": "Moët",
    "patrón": "Patrón",
    "bacardi": "Bacardi",
    "ciroc": "CÎROC",
    "grey goose": "Grey Goose",
    "don julio": "Don Julio",
    "bud light": "Bud Light",
    "7-11": "7-Eleven",
    "7 eleven": "7-Eleven",
    "seven 11": "7-Eleven",
    "seven eleven": "7-Eleven",
    "seven-eleven": "7-Eleven",
    "glock": "Glock",
    "uzi": "Uzi",
    "draco": "Draco",
    "ak": "AK",
    "ar": "AR",
    "xmas": "Christmas",
    "christmas eve": "Christmas Eve",
    "christmas day": "Christmas Day",
    "nye": "New Year's Eve",
    "new years eve": "New Year's Eve",
    "new years day": "New Year's Day",
    "halloween": "Halloween",
    "thanksgiving": "Thanksgiving",
    "valentine's day": "Valentine's Day",
    "easter": "Easter"
  };

  /* === STRUCTURAL-FUZZY NORMALIZER === */
  function normalizeSheetKey(str) {
    return str
      .toLowerCase()
      .replace(/[.'’]/g, "")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* === BUILD FUZZY LOOKUP === */
  const GLOBAL_SHEET_FUZZY = {};
  for (const [rawKey, canonical] of Object.entries(GLOBAL_PROPER_FROM_SHEET)) {
    GLOBAL_SHEET_FUZZY[normalizeSheetKey(rawKey)] = canonical;
  }

  function applyGlobalProperNouns(text) {
    if (!text) return text;

    // ---- 1. Phrase-first replacement from sheet ----
    for (const [rawKey, canonical] of Object.entries(GLOBAL_PROPER_FROM_SHEET)) {
      if (rawKey.includes(" ")) {
        const pattern = rawKey.replace(/\s+/g, "\\s+");
        const re = new RegExp(`\\b${pattern}\\b`, "gi");
        text = text.replace(re, canonical);
      }
    }

    // ---- 2. Token-level fuzzy replacements ----
    // FIX: Corrected regex to use \b word boundary and include hyphens, periods, and slashes
    const tokenRe = /\b[0-9A-Za-z][0-9A-Za-z.'$-]*\b/g;

    text = text.replace(tokenRe, raw => {
      const nRaw = normalizeSheetKey(raw);

      if (GLOBAL_SHEET_FUZZY[nRaw]) {
        return GLOBAL_SHEET_FUZZY[nRaw];
      }

      const lower = raw.toLowerCase();
      if (GLOBAL_PROPER_CANONICAL[lower]) {
        return GLOBAL_PROPER_CANONICAL[lower];
      }

      return raw;
    });

    return text;
  }
  const SENTENCE_ENDER_FOLLOWING_QUOTES = new Set(["'", '"', '‘', '’', '“', '”']);

  function capitalizeAfterSentenceEnders(text) {
    if (!text) return text;
    const chars = Array.from(text);
    const isSpace = c => c === ' ' || c === '\t' || c === '\n';
	const isSkippable = c => SENTENCE_ENDER_FOLLOWING_QUOTES.has(c) || c === '(' || c === ')';
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      if (ch !== '?' && ch !== '!') continue;
      let k = i + 1;
      while (k < chars.length) {
        if (isSpace(chars[k]) || isSkippable(chars[k])) {

        k++;
          } else {
          break;
        }
      }

      if (k < chars.length && chars[k] >= 'a' && chars[k] <= 'z') {
        chars[k] = chars[k].toUpperCase();
      }
    }
    return chars.join('');
  }

  function ensureStandaloneICapitalized(text) {
    if (!text) return text;
    return text.replace(/\bi\b/g, 'I');
  }

  const HYPHEN_CHARS = new Set(['-', '\u2010', '\u2011', '\u2012', '\u2013', '\u2014', '\u2212']);
  const LETTER_RE = /\p{L}/u;
  const HYPHENATED_EM_TOKEN = '\uF000';

  function normalizeEmPronouns(text) {
    if (!text) return text;
    return text.replace(/\bem\b/gi, (match, offset, str) => {
      const prevIndex = offset - 1;
      if (prevIndex >= 0) {
        const prevChar = str[prevIndex];
        if (!/\s/.test(prevChar)) return match;

        let lookback = prevIndex;
        while (lookback >= 0 && /\s/.test(str[lookback])) lookback--;
        if (lookback >= 0 && HYPHEN_CHARS.has(str[lookback])) {
          const gap = str.slice(lookback + 1, offset);
          if (/\r|\n/.test(gap)) {
            let beforeHyphen = lookback - 1;
            while (beforeHyphen >= 0 && /\s/.test(str[beforeHyphen])) beforeHyphen--;
            if (beforeHyphen >= 0 && LETTER_RE.test(str[beforeHyphen])) return match;
          }
        }
      }
      return "'em";
    });
  }

  function normalizeStructureTags(text) {
    if (!text) return text;

    return text
      .replace(/(^|\n)\s*intro(?:\s*\d+)?\s*(?=\n)/gi, (_, boundary) => boundary + "#INTRO")
      .replace(/(^|\n)\s*verse(?:\s*\d+)?\s*(?=\n)/gi, (_, boundary) => boundary + "#VERSE")
      .replace(/(^|\n)\s*pre[- ]?chorus(?:\s*\d+)?\s*(?=\n)/gi, (_, boundary) => boundary + "#PRE-CHORUS")
      .replace(/(^|\n)\s*chorus(?:\s*\d+)?\s*(?=\n)/gi, (_, boundary) => boundary + "#CHORUS")
      .replace(/(^|\n)\s*post[- ]?chorus(?:\s*\d+)?\s*(?=\n)/gi, (_, boundary) => boundary + "#HOOK")
      .replace(/(^|\n)\s*hook(?:\s*\d+)?\s*(?=\n)/gi, (_, boundary) => boundary + "#HOOK")
      .replace(/(^|\n)\s*bridge(?:\s*\d+)?\s*(?=\n)/gi, (_, boundary) => boundary + "#BRIDGE")
      .replace(/(^|\n)\s*(ad[- ]?libs?|spoken)\s*(?=\n)/gi, (_, boundary) => boundary + "#HOOK")
      .replace(/(^|\n)\s*outro(?:\s*\d+)?\s*(?=\n)/gi, (_, boundary) => boundary + "#OUTRO");
  }

  function normalizeInstrumentalSections(text) {
    if (!text) return text;

    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const trimmed = raw.trim();
      if (!trimmed) continue;
      if (trimmed === '#INSTRUMENTAL') {
        lines[i] = '#INSTRUMENTAL';
        continue;
      }

      let normalized = trimmed.replace(/^[\[(]+/, '').replace(/[\])]+$/, '').trim();
      normalized = normalized.replace(/^[\-–—:]+\s*/, '').replace(/\s*[\-–—:]+$/, '');
      normalized = normalized.replace(/[.,!?;:]+$/g, '').trim();

      if (normalized && INSTRUMENTAL_PHRASE_RE.test(normalized)) {
        lines[i] = '#INSTRUMENTAL';
      }
    }

    return lines.join('\n');
  }

  function enforceStructureTagSpacing(text) {
    if (!text) return text;

    const lines = text.split('\n');
    const result = [];

    for (const raw of lines) {
      const trimmed = raw.trim();
      if (trimmed.startsWith('#') && trimmed !== '#INSTRUMENTAL') {
        while (result.length && result[result.length - 1].trim() === '') result.pop();
        if (result.length) result.push('');
        result.push(trimmed);
      } else {
        result.push(raw);
      }
    }

    return result.join('\n');
  }

// ---------- Smart Proper Noun / Brand Recognizer (heuristic, no big dictionary) ----------

  // Tiny high-value brand/platform map for cases where input is fully lowercase.
  // This is NOT meant to be exhaustive, just the heavy hitters.
  const ALWAYS_PROPER_CANONICAL = {
    gucci: "Gucci",
    chanel: "Chanel",
    prada: "Prada",
    louis: "Louis",                // so "Louis Vuitton" won't be stuck as lowercase
    "louis vuitton": "Louis Vuitton",
    nike: "Nike",
    adidas: "Adidas",
    puma: "Puma",

    google: "Google",
    amazon: "Amazon",
    microsoft: "Microsoft",

    spotify: "Spotify",
    deezer: "Deezer",
    tidal: "TIDAL",
    boomplay: "Boomplay",
    audiomack: "Audiomack",
    soundcloud: "SoundCloud",

    tiktok: "TikTok",
    "tik tok": "TikTok",
    youtube: "YouTube",
    instagram: "Instagram",
    facebook: "Facebook",
    twitter: "Twitter",
    x: "X",
    reddit: "Reddit",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    snapchat: "Snapchat",

    github: "GitHub",
    chatgpt: "ChatGPT"
  };

  // Very small set of "boring" words we never auto-promote just because of capitalization.
  const COMMON_WORDS = new Set([
    "the","a","an","and","or","but","if","then","else","for","from","to","in","on","at",
    "with","without","of","by","as","is","am","are","was","were","be","been","being",
    "this","that","these","those","here","there","now","when","where","why","how",
    "i","you","he","she","it","we","they","me","him","her","us","them",
    "yeah","yea","yup","nah","no","oh","ooh","ah","uh","um","huh","hey"
  ]);

  function isAllUpper(word) {
    return word === word.toUpperCase() && /[A-Z]/.test(word);
  }

  function hasInternalCapital(word) {
    if (!/[A-Z]/.test(word)) return false;
    // any capital that is not the first char
    return /[A-Z]/.test(word.slice(1));
  }

  function isCapitalized(word) {
    if (word.length === 0) return false;
    const first = word[0];
    const rest = word.slice(1);
    return first === first.toUpperCase() && first !== first.toLowerCase()
      && rest === rest.toLowerCase();
  }

  function titleCaseSimple(str) {
    return str
      .split(/\s+/)
      .map(w => w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w)
      .join(" ");
  }

  // Build a map of lowercased tokens -> "canonical" casing we want to enforce.
  function buildSmartProperMap(text) {
    // FIX: Corrected regex to use \b word boundary and include hyphens, periods, and slashes
    const tokenRe = /\b[A-Za-z0-9][A-Za-z0-9'’\-\.\/]*\b/g;
    const stats = new Map();

    let m;
    while ((m = tokenRe.exec(text)) !== null) {
      const raw = m[0];
      const lower = raw.toLowerCase();
      if (!stats.has(lower)) {
        stats.set(lower, {
          count: 0,
          forms: new Set(),
          seenCapitalized: false,
          seenAllUpper: false,
          seenInternalUpper: false
        });
      }
      const s = stats.get(lower);
      s.count++;
      s.forms.add(raw);
      if (isCapitalized(raw)) s.seenCapitalized = true;
      if (isAllUpper(raw)) s.seenAllUpper = true;
      if (hasInternalCapital(raw)) s.seenInternalUpper = true;
    }

    // Look for contexts like "feat X", "ft. X", "produced by X", etc.
    // Any tokens immediately after these cues are strong proper-noun candidates.
    const cueRe = /\b(feat\.?|featuring|ft\.?|prod\.?|produced|remix|remixed|mixed|mix|version|vs\.?)\b\s+([0-9A-Za-z][0-9A-Za-z.'$]*(?:\s+[0-9A-Za-z][0-9A-Za-z.'$]*){0,3})/gi;
    while ((m = cueRe.exec(text)) !== null) {
      const tail = m[2];
      const parts = tail.split(/\s+/);
      for (const part of parts) {
        const lower = part.toLowerCase();
        const s = stats.get(lower);
        if (!s) continue;
        // Treat as if we saw a capitalized form, unless it's obviously a common word.
        if (!COMMON_WORDS.has(lower)) {
          s.seenCapitalized = true;
        }
      }
    }

    const map = new Map();

    for (const [lower, s] of stats.entries()) {
      // 1) Always-proper brand/platform/tech map (works even if source is fully lowercase)
      if (Object.prototype.hasOwnProperty.call(ALWAYS_PROPER_CANONICAL, lower)) {
        map.set(lower, ALWAYS_PROPER_CANONICAL[lower]);
        continue;
      }

      // 2) Strong mixed-case patterns (GitHub, YouTube, PlayStation)
      if (s.seenInternalUpper) {
        // Use the longest mixed-case form we saw
        let best = null;
        for (const f of s.forms) {
          if (!hasInternalCapital(f)) continue;
          if (!best || f.length > best.length) best = f;
        }
        if (!best) {
          // fallback: first form
          best = s.forms.values().next().value;
        }
        map.set(lower, best);
        continue;
      }

      // 3) Acronyms / all-caps tokens like USA, BBC, NASA
      if (s.seenAllUpper && lower.length >= 2 && lower.length <= 6 && !COMMON_WORDS.has(lower)) {
        // Use an all-caps canonical
        let best = null;
        for (const f of s.forms) {
          if (isAllUpper(f)) { best = f; break; }
        }
        if (!best) best = lower.toUpperCase();
        map.set(lower, best);
        continue;
      }

      // 4) "Looks like a name": rare, capitalized somewhere, not a super common word
      if (s.seenCapitalized && !COMMON_WORDS.has(lower) && s.count <= 4) {
        // pick the most "namey" form (capitalized if present)
        let capitalForm = null;
        for (const f of s.forms) {
          if (isCapitalized(f)) {
            capitalForm = f;
            break;
          }
        }
        const canonical = capitalForm || titleCaseSimple(lower);
        map.set(lower, canonical);
        continue;
      }

      // Otherwise, we don't touch it.
    }

    // Also support multi-word ALWAYS_PROPER entries like "louis vuitton"
    // by building a secondary phrase map.
    const phraseMap = new Map();
    for (const [key, canonical] of Object.entries(ALWAYS_PROPER_CANONICAL)) {
      if (key.includes(" ")) {
        phraseMap.set(key, canonical);
      }
    }

    return { wordMap: map, phraseMap };
  }

  function applySmartProperNouns(text) {
    if (!text) return text;

    const { wordMap, phraseMap } = buildSmartProperMap(text);

    // First, handle multi-word patterns from ALWAYS_PROPER_CANONICAL ("louis vuitton" → "Louis Vuitton").
    if (phraseMap.size > 0) {
      for (const [key, canonical] of phraseMap.entries()) {
        const pattern = key.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\s+/g, "\\s+");
        const re = new RegExp(`\\b${pattern}\\b`, "gi");
        text = text.replace(re, canonical);
      }
    }

    // Then apply single-word canonicalizations.
    const tokenRe = /\b[0-9A-Za-z][0-9A-Za-z.'$]*\b/g;
    text = text.replace(tokenRe, (raw) => {
      const lower = raw.toLowerCase();
      const canonical = wordMap.get(lower);
      if (!canonical) return raw;
      return canonical;
    });

    return text;
  }

  // ---------- Accent Normalization (safe, word-boundary only) ----------
  const ACCENT_CANONICAL_MAP = {
    chateau: 'château',
    resume: 'résumé',
    fiance: 'fiancé',
    cafe: 'café'
  };

  function normalizeAccents(text) {
    if (!text) return text;
    for (const [plain, accented] of Object.entries(ACCENT_CANONICAL_MAP)) {
      const re = new RegExp(`\\b${plain}\\b`, 'gi');
      text = text.replace(re, accented);
    }
    return text;
  }

  // ---------- Formatter ----------
  function formatLyrics(input, _options = {}) {
    if (!input) return "";
    if (input.length > 50000) {
      console.warn('Large input detected (>50k chars): minimal normalization only.');
      return input.replace(/\s+$/gm, '').trim();
    }
    let x = ("\n" + input.trim() + "\n");
    // Accent normalization (must run early)
    x = normalizeAccents(x);
    const preservedStandaloneParens = [];
    const STANDALONE_PAREN_SENTINEL = "__MXM_SP__";

    x = x.replace(/(^|\n)([^\S\n]*\([^\n]*\)[^\S\n]*)(?=\n)/g, (match, boundary, candidate) => {
      const trimmed = candidate.trim();
      if (trimmed.startsWith("(") && trimmed.endsWith(")") && !trimmed.includes("\n")) {
        const placeholder = `${STANDALONE_PAREN_SENTINEL}${preservedStandaloneParens.length}__`;

        let cleaned = candidate
          .replace(/,([ \t]*\))/g, "$1")  // remove comma before )
          .replace(/[ \t]+\)/g, ")")      // remove space before )
          .replace(/\( +/g, "(");          // remove space after (

        cleaned = cleaned.replace(/(\(\s*)(["'“”‘’]?)([a-z])/g, (_, prefix, quote, letter) =>
          prefix + quote + letter.toUpperCase()
        );

        preservedStandaloneParens.push(cleaned);
        return boundary + placeholder;
      }
      return match;
    });

    const hyphenatedEmTokens = [];

    const currentLang = (extensionOptions.lang || 'EN').toUpperCase();
    const langProfile = LANG_RULES[currentLang] || LANG_RULES.EN;

    const applyCasedReplacement = (match, canonical) => {
      if (match === match.toUpperCase()) return canonical.toUpperCase();
      if (match[0] === match[0].toUpperCase()) return canonical.charAt(0).toUpperCase() + canonical.slice(1);
      return canonical;
    };

    for (const [src, tag] of Object.entries(langProfile.tagMap)) {
      const rx = new RegExp(`(^|\\n)\\s*\\[?${src}\\]?\\s*(?=\\n|$)`, 'gi');
      x = x.replace(rx, `$1${tag}`);
    }

    // --- RU structure normalization (runs BEFORE generic [ ... ] mapper) ---
    // Accepts: optional leading #[, (, spaces], the Russian label, optional number,
    // optional separators/credits, then optional closing ], )
    // Examples matched:
    //    [Куплет 1: Artist], (Припев — Мумий Тролль), #Интерлюдия - Имя, Инструментал
    if (currentLang === 'RU') {
      const RU_STRUCTURE_RE =
        /(^|\n)\s*#?\s*[\[\(\s]*\s*(куплет|припев|хук|бридж|интерлюдия|брейкдаун|брэйкдаун|инструментал|интро|аутро|предприпев|пред-припев)(?:\s*\d+)?(?:\s*[-:–—]\s*[\p{L}\d .,'’&()\-–—]*)?[\]\)\s]*(?=\n|$)/gimu;

      x = x.replace(RU_STRUCTURE_RE, (match, boundary, raw) => {
        switch (raw.toLowerCase()) {
          case 'куплет': return `${boundary}#VERSE`;
          case 'припев': return `${boundary}#CHORUS`;
          case 'хук': return `${boundary}#HOOK`;
          case 'бридж':
          case 'интерлюдия':
          case 'брейкдаун':
          case 'брэйкдаун':
            return `${boundary}#BRIDGE`;
          case 'инструментал': return `${boundary}#INSTRUMENTAL`;
          case 'интро': return `${boundary}#INTRO`;
          case 'аутро': return `${boundary}#OUTRO`;
          case 'предприпев':
          case 'пред-припев':
            return `${boundary}#PRE-CHORUS`;
          default:
            return match;
        }
      });
    }

    // --- Conditional Cyrillic “e” conversion ---
    // Only for Latin-script languages
    if (langProfile.preserve.includes('Latin')) {
      x = x.replace(/[\u0435\u0415]/g, m => (m === '\u0415' ? 'E' : 'e'));
    }

    // --- Preserve full Cyrillic/Greek scripts ---
    if (langProfile.preserve.includes('Cyrillic') || langProfile.preserve.includes('Greek')) {
      // No transliteration, only punctuation cleanup applies
    }

    // Clean + normalize (dash behavior differs for RU)
    x = x
      .replace(/[\u2000-\u200b\u202f\u205f\u2060\u00a0]/gu, " ")
      .replace(/ {2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[\u2019\u2018\u0060\u00b4]/gu, "'")
      .replace(/[\u{1F300}-\u{1FAFF}\u{FE0F}\u2600-\u26FF\u2700-\u27BF\u2669-\u266F]/gu, "");

    if (currentLang !== 'RU') {
      x = x.replace(/[\u2013\u2014]/gu, "-");
    }

    if (currentLang === 'RU') {
      const RU_REPLACEMENTS = {
        "ща": "сейчас",
        "ваще": "вообще",
        "че": "что",
        "чё": "что",
        "типо": "типа",
        "ладноу": "",
        "окей": "ок",
        "брр": "",
        "пау": "",
        "уоу": "",
        "эй": "эй",
        "йо": "йо"
      };

      x = x.replace(/\b[\p{L}’']+\b/gu, (word) => {
        const lower = word.toLowerCase();
        if (!Object.prototype.hasOwnProperty.call(RU_REPLACEMENTS, lower)) return word;

        const replacement = RU_REPLACEMENTS[lower];
        if (!replacement) return replacement;
        if (word === word.toUpperCase()) return replacement.toUpperCase();
        if (word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase()) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
      });
    }

    x = x.replace(/[【〔［｛〈《]/g, '[')
         .replace(/[】〕］｝〉》]/g, ']')
         .replace(/[（﹙]/g, '(')
         .replace(/[）﹚]/g, ')');

    // === Pure syllable-line detector (prevents stanza merging) ===
    const PURE_SYLLABLE_LINE_RE = /^[ \t]*(?:la|na)(?:-(?:la|na))+[ \t]*$/i;

    // Section tags
    x = x.replace(/\[(.*?)\]/g, (_, raw) => {
      const t = String(raw).toLowerCase().trim();
      if (/^intro/.test(t)) return "#INTRO";
      if (/^verse/.test(t)) return "#VERSE";
      if (/^pre[- ]?chorus/.test(t)) return "#PRE-CHORUS";
      if (/^chorus/.test(t)) return "#CHORUS";
      if (/^bridge/.test(t)) return "#BRIDGE";
      if (/^(hook|refrain|post-chorus|postchorus|drop|break|interlude)/.test(t)) return "#HOOK";
      if (/^outro/.test(t)) return "#OUTRO";
      if (/^instrumental(?:\s+(?:break|bridge|outro|interlude|solo))?/.test(t)) return "#INSTRUMENTAL";
      return "#" + String(raw).toUpperCase().replace(/\d+/g, "").replace(/ +/g, "-");
    });

    x = normalizeStructureTags(x);

    // Normalize any hook variants into #HOOK
    x = x.replace(/(^|\n)\s*[\[(]?(hook|HOOK)[\])]?(\s*\d+)?\s*(?=\n|$)/g, (_, b) => `${b}#HOOK`);

    if (currentLang === 'RU') {
      // === Russian Structure Tag Normalization ===
      const RU_STRUCTURE_RE =
        /(^|\n)\s*[\[(]*(куплет|припев|хук|бридж|интерлюдия|брейкдаун|брэйкдаун|инструментал|интро|аутро|предприпев|пред-припев)[\])]*(?:\s*[-:–—]\s*[\p{L}\d .,'’&()-]*)?(?=\n|$)/gimu;

      x = x.replace(RU_STRUCTURE_RE, (_, boundary, raw) => {
        const lower = raw.toLowerCase();
        switch (lower) {
          case 'куплет':
            return `${boundary}#VERSE`;
          case 'припев':
            return `${boundary}#CHORUS`;
          case 'хук':
            return `${boundary}#HOOK`;
          case 'бридж':
          case 'интерлюдия':
          case 'брейкдаун':
          case 'брэйкдаун':
            return `${boundary}#BRIDGE`;
          case 'инструментал':
            return `${boundary}#INSTRUMENTAL`;
          case 'интро':
            return `${boundary}#INTRO`;
          case 'аутро':
            return `${boundary}#OUTRO`;
          case 'предприпев':
          case 'пред-припев':
            return `${boundary}#PRE-CHORUS`;
          default:
            return _;
        }
      });
    }

    x = normalizeInstrumentalSections(x);
    x = enforceStructureTagSpacing(x);

    // === Normalize common holiday and festive terms (including inside parentheses) ===
    x = x.replace(/\bchristmas[\s-]*eve\b/gi, "Christmas Eve");
    x = x.replace(/\bchristmas[\s-]*day\b/gi, "Christmas Day");
    x = x.replace(/\bchristmas[\s-]*time\b/gi, "Christmastime");
    x = x.replace(/\bnew[\s-]*year[\s-]*s[\s-]*eve\b/gi, "New Year's Eve");
    x = x.replace(/\bnew[\s-]*year[\s-]*s[\s-]*day\b/gi, "New Year's Day");
    x = x.replace(/\bnew[\s-]*years?\b/gi, "New Year");
    x = x.replace(/\bhappy[\s-]*holidays?\b/gi, "Happy Holidays");
    x = x.replace(/\bseasons?[\s-]*greetings?\b/gi, "Season's Greetings");

    // 7-Eleven and variants
    x = x.replace(
      /\b(?:7\s*[-/]\s*11|seven\s*[-\s]+11|seven\s*[-\s]+eleven)\b/gi,
      "7-Eleven"
    );

    // Can not -> cannot (but not "can not only")
    x = x.replace(/\b(C|c)an not\b(?!\s+only)/g, (_, c) =>
      c === "C" ? "Cannot" : "cannot"
    );

    // 24/7 -> 24-7
    x = x.replace(/\b24\s*\/\s*7\b/g, "24-7");

    // Normalize selected phrases and ensure religious names are capitalized
    x = x.replace(/\bnight[\s-]*time\b/gi, (match) => applyCasedReplacement(match, 'nighttime'));
    x = x.replace(/\bone[\s-]+night[\s-]+stand\b/gi, (match) => applyCasedReplacement(match, 'one-night-stand'));
    x = x.replace(/\bvery\s+very\b/gi, (match) => {
      if (match === match.toUpperCase()) return 'VERY, VERY';
      if (match[0] === match[0].toUpperCase()) return 'Very, very';
      return 'very, very';
    });
    x = x.replace(/\bjesus\b/gi, (match) => applyCasedReplacement(match, 'Jesus'));
    x = x.replace(/\bchrist\b/gi, (match) => applyCasedReplacement(match, 'Christ'));

    x = x.replace(/([A-Za-z])-(?:[ \t]*)(\r?\n)(\s*)(em\b)/gi, (match, letter, newline, spaces, word) => {
      const token = `${HYPHENATED_EM_TOKEN}${hyphenatedEmTokens.length}${HYPHENATED_EM_TOKEN}`;
      hyphenatedEmTokens.push(word);
      return `${letter}-${newline}${spaces}${token}`;
    });

    // Remove end-line punctuation
    x = x.replace(/[.,;:\-]+(?=[ \t]*\n)/g, "");

    // Instrumental normalization and tag spacing handled immediately after tag conversion

    // Contractions
    // --- Contraction normalization block ---
    {
      const contractionLines = x.split('\n');
      for (let i = 0; i < contractionLines.length; i++) {
        let line = contractionLines[i];
        // Fix 'till → 'til without creating ''til
        line = line
          .replace(/\b['’]{2,}till\b/gi, "'til")   // collapse double apostrophes safely
          .replace(/\b['’]?till\b/gi, "'til");     // main rule
        line = line.replace(/\bgunna\b/gi, "gonna");
                line = line.replace(/\bgonna['’]\b/gi, "gonna");
        line = line.replace(/\bgon\b(?!['\u2019])/gi, "gon'");
        line = line.replace(/'?c(?:uz|us|os|oz)\b/gi, (match, offset, str) => {
          const prevChar = offset > 0 ? str[offset - 1] : '';
          const nextIndex = offset + match.length;
          const nextChar = nextIndex < str.length ? str[nextIndex] : '';
          if (/\w/.test(prevChar) || /\w/.test(nextChar)) return match;

          const hasLeadingApostrophe = match[0] === "'" || match[0] === "\u2019";
          const core = hasLeadingApostrophe ? match.slice(1) : match;
          const firstChar = core[0] ?? '';
          const isAllUpper = core === core.toUpperCase();
          const isTitleCase = firstChar !== '' && firstChar === firstChar.toUpperCase();
          const isLineStart = offset === 0;

          if (isAllUpper) return "'CAUSE";
          if (isLineStart) return "'Cause";
          if (isTitleCase) return "'Cause";
          return "'cause";
        });
        line = line.replace(/\bcause\b/gi, (match, offset, str) => {
          const prev = offset > 0 ? str[offset - 1] : '';
          if (prev === "'" || prev === "\u2019") return match;
          if (match === match.toUpperCase()) return "'CAUSE";
          if (match[0] === match[0].toUpperCase()) return "'Cause";
          return "'cause";
        });
        line = line.replace(/\bimma\b/gi, "I'ma");
                line = line.replace(/\bi'll\b/gi, "I'll");
                line = line.replace(/\bive\b/gi, "I've");
		line = line.replace(/\bi've\b/gi, "I've");
		line = line.replace(/\bi'd\b/gi, "I'd");
        line = line.replace(/\bim'ma\b/gi, "I'ma");
        line = line.replace(/\bem'(?!\w)/gi, (match, offset, str) => {
          const prev = offset > 0 ? str[offset - 1] : '';
          if (prev === "'" || prev === "\u2019") return match;
          return "'em";
        });
        contractionLines[i] = line;
      }
      x = contractionLines.join('\n');
    }
    // --- End contraction normalization block ---

    x = x
      .replace(/(?<!['\w])ti(?:ll|l)(?:')?(?!\w)/gi, (m, offset, str) => {
        const prev = offset > 0 ? str[offset - 1] : '';
        if (prev === "'" || prev === "\u2019") return m;
        const base = m.replace(/'/g, "");
        if (base === base.toUpperCase()) return "'TIL";
        if (base[0] === base[0].toUpperCase()) return "'Til";
        return "'til";
      })
      .replace(/\bima\b/gi, "I'ma")
	  .replace(/\bimma\b/gi, "I'ma")
	  .replace(/\bi'mma\b/gi, "I'ma")
      .replace(/\bim\b/gi, "I'm")
      .replace(/\bdont\b/gi, "don't")
      .replace(/\bcant\b/gi, "can't")
      .replace(/\bwont\b/gi, "won't")
      .replace(/\bwasnt\b/gi, "wasn't")
      .replace(/\bisnt\b/gi, "isn't")
      .replace(/\baint\b/gi, "ain't")
      .replace(/\bwoah\b/gi, "whoa")
	  .replace(/\byall\b/gi, "y'all")
	  .replace(/\bya'll\b/gi, "y'all")
	  .replace(/\beveryday\b/gi, "every day")
	  .replace(/\bmhm\b/gi, "hmm")
	  .replace(/\bmhmm\b/gi, "hmm")
	  .replace(/\bmmh\b/gi, "hmm")
	  .replace(/\trynna\b/gi, "tryna");

    x = x.replace(/((?:^|\n)\s*)'til\b/g, (match, boundary, offset, str) => {
      const start = offset + boundary.length;
      const afterStart = start + 4;
      const lineEnd = str.indexOf('\n', afterStart);
      const rest = lineEnd === -1 ? str.slice(afterStart) : str.slice(afterStart, lineEnd);
      const hasLower = /[a-z]/.test(rest);
      const hasUpper = /[A-Z]/.test(rest);
      const replacement = hasUpper && !hasLower ? "'TIL" : "'Til";
      return boundary + replacement;
    });

    x = x.replace(/(-\s+)'til\b/g, (_, prefix) => prefix + "'Til");

    x = normalizeAmPmTimes(x);
    x = normalizeEmPronouns(x);

    if (hyphenatedEmTokens.length) {
      const tokenRe = new RegExp(`${HYPHENATED_EM_TOKEN}(\\d+)${HYPHENATED_EM_TOKEN}`, 'g');
      x = x.replace(tokenRe, (_, idx) => hyphenatedEmTokens[Number(idx)] ?? 'em');
    }

   // Interjections
const CLOSING_QUOTES = new Set(["'", '"', "’", "”"]);
const INTERJECTION_STOPPERS = ",!?.-;:)]}";

const WELL_ALLOWED_PRECEDERS = new Set([
  "oh","ah","yeah","yea","yah","uh","um","huh","hmm","mm",
  "aw","aww","awww","gee","gosh","hey","and","but","so","yet",
  "or","anyway","anyways","well"
]);

const WELL_PRECEDER_WORDS = new Set([
  "a","an","the","this","that","these","those","my","your","his","her","their","our",
  "its","some","any","such","each","every","too","very","so","as","quite","pretty",
  "rather","really","real","feel","feels","felt","feeling","do","does","did","doing",
  "done","to","am","is","are","was","were","be","been","being","stay","stays","stayed",
  "staying","keep","keeps","kept","keeping","remain","remains","remained","remaining",
  "seem","seems","seemed","seeming","sound","sounds","sounded","sounding","look",
  "looks","looked","looking","become","becomes","became","becoming","grow","grows",
  "grew","growing","live","lives","lived","living","work","works","worked","working",
  "play","plays","played","playing"
]);

const WELL_CLAUSE_STARTERS = new Set([
  "i","im","id","ill","ive","you","youre","youd","youll","youve","ya","yall","yous",
  "youse","he","hes","hed","hell","she","shes","shed","shell","we","were","wed","well",
  "weve","they","theyre","theyd","theyll","theyve","it","its","itd","itll","this","that",
  "these","those","there","theres","therell","thered","thereve","therere","who","whos",
  "what","whats","where","wheres","when","whens","why","whys","how","hows","the","a","an",
  "another","all","someone","somebody","anyone","anybody","everyone","everybody","nobody",
  "nothing","something","anything","everything","so","then","now","anyway","anyways","anyhow",
  "anyhoo","guess","maybe","perhaps","alright","alrighty","allright","okay","ok","okey","uh",
  "oh","well","right","listen","look","hey","hi","hello","yo","dude","man","girl","boy","baby",
  "honey","buddy","sir","maam","ladies","folks","guys","people","kid","kids","partner","friend",
  "friends","gimme","lemme","dear","cause","because","cuz","cos","coz","if","when","whenever",
  "while","since","once","after","before","for","and","but","or","yet","though","let","lets",
  "gonna","please","cmon","come","should","shoulda","shouldve","shouldnt","could","coulda",
  "couldve","couldnt","would","woulda","wouldve","wouldnt","might","mighta","mightve","mightnt",
  "may","must","mustve","mustnt","shall","shant","can","cant","cannot","won","wont","will",
  "did","didnt","do","dont","does","doesnt","done","doing","ain","aint","is","isnt","are",
  "arent","was","wasnt","were","werent","have","havent","has","hasnt","had","hadnt"
]);

    x = x.replace(/\b(oh|ah|yeah|uh)h+\b(?=[\s,!.?\)]|$)/gi, (match, base) => base);
    x = x.replace(/\b(oh|ah|yeah|whoa|ooh|uh|well)\b(?!,)/gi, (m, word, off, str) => {
      const after = str.slice(off + m.length);
      const lower = word.toLowerCase();

      let idx = 0;
      while (idx < after.length && /\s/.test(after[idx])) idx++;
      if (idx >= after.length) return lower === "well" ? m : m + ',';

      if (after[idx] === ',') return m;

      while (idx < after.length && CLOSING_QUOTES.has(after[idx])) {
        idx++;
        while (idx < after.length && /\s/.test(after[idx])) idx++;
        if (idx >= after.length) return m;
        if (after[idx] === ',') return m;
      }

      if (idx >= after.length) return m;

      const next = after[idx];

      if (lower === "well") {
        const before = str.slice(0, off);
        const trimmedBefore = before.replace(/\s+$/, '');
        const prevChar = trimmedBefore.slice(-1);
        const prevWordMatch = trimmedBefore.match(/([A-Za-z'’]+)[^A-Za-z'’]*$/);
        const prevWord = prevWordMatch ? prevWordMatch[1].replace(/^['’]+/, '').toLowerCase() : null;

        if (prevWord && WELL_PRECEDER_WORDS.has(prevWord)) return m;
        if (prevChar && /[A-Za-z0-9]/.test(prevChar) && (!prevWord || !WELL_ALLOWED_PRECEDERS.has(prevWord))) return m;
        if (INTERJECTION_STOPPERS.includes(next)) return m;

        let clauseIdx = idx;
        while (clauseIdx < after.length && '([{'.includes(after[clauseIdx])) {
          clauseIdx++;
          while (clauseIdx < after.length && /\s/.test(after[clauseIdx])) clauseIdx++;
        }

        while (clauseIdx < after.length && CLOSING_QUOTES.has(after[clauseIdx])) {
          clauseIdx++;
          while (clauseIdx < after.length && /\s/.test(after[clauseIdx])) clauseIdx++;
        }

        if (clauseIdx >= after.length) return m;

        const clauseStart = after.slice(clauseIdx);
        const nextWordMatch = clauseStart.match(/^([A-Za-z'’]+)/);
        if (!nextWordMatch) return m;

        let candidate = nextWordMatch[1].toLowerCase().replace(/[’]/g, "'");
        candidate = candidate.replace(/^'+/, '');
        if (!candidate) return m;

        const forms = new Set([candidate]);
        const noApos = candidate.replace(/'/g, '');
        forms.add(noApos);
        const noSuffix = candidate.replace(/(?:'ll|'re|'ve|'d|'m|'s)$/g, '');
        if (noSuffix && noSuffix !== candidate) {
          forms.add(noSuffix);
          forms.add(noSuffix.replace(/'/g, ''));
        }

        for (const form of forms) {
          const normalized = form.replace(/'/g, '');
          if (normalized && WELL_CLAUSE_STARTERS.has(normalized)) return m + ',';
        }

        return m;
      }

      if (INTERJECTION_STOPPERS.includes(next)) return m;
      return m + ',';
    });

    x = x.replace(/\b(oh|ah|yeah|whoa|ooh|uh|well)\b\s*,\s*(?=\))/gi, '$1');

    // === Dropped-G (smart and safe fix, live CSV cache + sync fallback) ===
    (() => {
      const CSV_URL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQY2TH74oBLQWTeI0j7WobaPUe-UC4Vdc2dn7nVjgtT9h9H7AFAmErladiu6SgT2Wacuk4oEMBieKD/pub?output=csv";
      const LOCAL_KEY = "mxmDroppedGExclusionsCSV.v1";

      const LOCAL_EXCLUSIONS = new Set([
        "begin","began","within","cousin","violin","virgin","gremlin","origin","margin","resin","penguin",
        "pumpkin","grin","chin","twin","skin","basin","raisn","spain","birkin","balmain","boutin","login","pin","curtain",
        "fin","din","min","gin","lin","kin","sin","win","bin","thin","tin","akin","leadin","captain","mountain",
        "fountain","certain","again","gain","spin","twin","main","cain","maintain","retain","detain","vain","regain",
        "rain","brain","pain","drain","train","grain","cabin","satin","chain","robin","kevin","kelvin","plain","remain","campaign",
        "fein","contain","domain","explain","sustain","pertain","obtain","entertain","villain","admin","abstain","stain"
      ]);

      const parseCSV = (text) =>
        new Set(
          text
            .split(/\r?\n/)
            .map((l) => l.trim().split(",")[0]?.toLowerCase())
            .filter((w) => w && /^[a-z]+$/.test(w))
        );

      // Try to read cached exclusions first
      let EXCLUSIONS = LOCAL_EXCLUSIONS;
      try {
        const cached = localStorage.getItem(LOCAL_KEY);
        if (cached) EXCLUSIONS = parseCSV(cached);
      } catch {}

      // Fire-and-forget fetch (updates cache asynchronously)
      fetch(CSV_URL)
        .then((r) => (r.ok ? r.text() : ""))
        .then((t) => {
          if (t) localStorage.setItem(LOCAL_KEY, t);
        })
        .catch(() => {});

      // Apply Dropped-G immediately
      x = x.replace(/\b([A-Za-z]+in)(?!['’g])\b/g, (match, base) => {
        if (EXCLUSIONS.has(base.toLowerCase())) return match;
        if (match === match.toUpperCase()) return base.toUpperCase() + "'";
        if (match[0] === match[0].toUpperCase()) return base[0].toUpperCase() + base.slice(1) + "'";
        return base + "'";
      });
    })();

      // === Normalize syllable repetitions (na, la, etc.) ===
      {
        const SYLLABLE_RE =
          /((?:^|[?!.\s]*)?)((?:na|la))(?:[-\t ]+\2){1,}\b|((?:^|[?!.\s]*)?)((?:na|la){4,})\b/gi;

        function normalizeSyllablesInLine(line) {
          return line.replace(
            SYLLABLE_RE,
            (full, boundaryA, syllableA, boundaryB, fused) => {
              const boundary = boundaryA || boundaryB || '';
              const syllable = (syllableA || (fused ? fused.slice(0, 2) : '') || '')
                .toLowerCase();
              if (!syllable) return full;

              // Count total syllables
              const matches = (full.match(new RegExp(syllable, 'gi')) || []).length;
              const total = Math.max(2, matches);

              // Group syllables in sets of 4, separated by commas every 4 repeats
              const parts = [];
              for (let i = 0; i < total; i += 4) {
                const group = Array.from(
                  { length: Math.min(4, total - i) },
                  () => syllable
                ).join('-');
                parts.push(group);
              }

              // Handle fused 'lalalalala' (5+ la's)
              if (fused && /^la+$/i.test(fused) && total > 4) {
                const groups = [];
                for (let i = 0; i < total; i += 4) {
                  const chunk = Math.min(4, total - i);
                  groups.push(
                    Array.from({ length: chunk }, () => syllable).join('-')
                  );
                }
                return boundary + groups.join(', ');
              }

              let formatted = parts.join(', ');
              if (/[?!.\n]\s*$/.test(boundary)) {
                formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
              }

              return boundary + formatted;
            }
          );
        }

        x = x
          .split('\n')
          .map((line) => {
            const trimmed = line.trim();

            // HARD RULE: pure la/la-na stanza lines must not be touched at all
            if (PURE_SYLLABLE_LINE_RE.test(trimmed)) {
              return line;
            }

            return normalizeSyllablesInLine(line);
          })
          .join('\n');
      }

    // Numbers & timing logic
    x = normalizeOClock(x);
    x = applyNumberRules(x);
    x = normalizeSpelledOutNumbers(x);
    x = applyNoCommaRules(x);

    // Normalize "God damn" into "Goddamn" or "goddamn"
    x = x.replace(/\b[Gg]od damn\b/g, (m, offset, str) => {
      const isStart = /^[\s"']*$/.test(str.slice(0, offset));
      return isStart ? "Goddamn" : "goddamn";
    });

    // Normalize all variants of "tryna"
    x = x.replace(
      /\btry(?:in'?|i?n+a?|i?n'?na?|i?n'?n?a?)\b/gi,
      "tryna"
    );

    // Normalize till → 'til (only when used as "until")
    x = x
      .replace(/\b['’]{2,}till\b/gi, "'til")   // collapse double apostrophes safely
      .replace(/\b['’]?till\b/gi, "'til");     // main rule

    // past time → pastime (leisure activity)
    x = x.replace(/\bpast time\b/gi, (m) => {
      return m[0] === m[0].toUpperCase() ? "Pastime" : "pastime";
    });

    // everytime → every time
    x = x.replace(/\beverytime\b/gi, (m) => {
      if (m === m.toUpperCase()) return "EVERY TIME";
      if (m[0] === m[0].toUpperCase()) return "Every time";
      return "every time";
    });

    // Hollywood Boulevard
    x = x.replace(/\bhollywood boulevard\b/gi, "Hollywood Boulevard");

    // Sunset Strip
    x = x.replace(/\bsunset strip\b/gi, "Sunset Strip");

    // Add comma after "thank you" when followed by an address word or name
    x = x.replace(
      /\b(thank you)\s+([A-Za-z][A-Za-z'’-]*)\b/gi,
      (full, ty, name) => {
        if (ty === ty.toUpperCase()) {
          return `THANK YOU, ${name.toUpperCase()}`;
        }
        if (ty[0] === ty[0].toUpperCase()) {
          return `Thank you, ${name[0].toUpperCase() + name.slice(1)}`;
        }
        return `thank you, ${name}`;
      }
    );

    // Remove stray spaces that appear immediately before punctuation marks
    x = x.replace(/[ \t]+([!?.,;:])/g, '$1');

    // Normalize repeated punctuation: ??, !!, '', etc.
    x = x
      // collapse multiple apostrophes or fancy quotes to a single '
      .replace(/['’]{2,}/g, "'")

      // collapse multiple ? or ! into one
      .replace(/([!?])\1+/g, "$1")

      // remove comma(s) directly after ? or !
      .replace(/([!?]),+/g, "$1");

    // Standalone pronoun fixes
    x = ensureStandaloneICapitalized(x);

    // Ensure "'cause" is capitalized at the start of lines while respecting all-caps lines
    x = x.replace(/(^|\n)(\s*)('?cause)\b/gi, (match, boundary, spaces, token, offset, str) => {
      const tokenEnd = offset + boundary.length + spaces.length + token.length;
      const lineEnd = str.indexOf('\n', tokenEnd);
      const rest = lineEnd === -1 ? str.slice(tokenEnd) : str.slice(tokenEnd, lineEnd);
      const hasLower = /[a-z]/.test(rest);
      const hasUpper = /[A-Z]/.test(rest);
      if ((hasUpper && !hasLower) || token === token.toUpperCase()) {
        return boundary + spaces + "'CAUSE";
      }
      return boundary + spaces + "'Cause";
    });

    // Capitalize first letter of each line (ignoring leading whitespace)
    x = x.replace(/(^|\n)(\s*)(["'“”‘’]?)(\p{Ll})/gu, (_, boundary, space, quote, letter) =>
      boundary + space + quote + letter.toLocaleUpperCase()
    );

    // === Backing vocals normalization (moved earlier to prevent re-capitalization) ===
    x = x.replace(/(?<!^|\n)\(([^)]+)\)/g, (match, inner) => {
      const trimmed = inner.trim();
      if (!trimmed) return match;

      const firstWord = trimmed.split(/\s+/)[0] || '';
      const lowerFirst = firstWord.toLocaleLowerCase();

      if (BV_FIRST_WORD_EXCEPTIONS.has(firstWord) || BV_FIRST_WORD_EXCEPTIONS.has(lowerFirst))
        return match;

      if (/^(yeah|yea|yo|la|na|woo|hey|ha|uh|o+h)$/i.test(firstWord)) {
        return `(${trimmed.toLocaleLowerCase()})`;
      }

      return `(${lowerFirst}${trimmed.slice(firstWord.length)})`;
    });


	// === Apply global proper-noun engine ===
    x = applyGlobalProperNouns(x);

    // Maintain capitalization for lines starting with "("
    x = x.replace(/(^|\n)(\(\s*)(["'“”‘’]?)(\p{Ll})/gu,
      (_, boundary, parenWithSpace, quote, letter) => boundary + parenWithSpace + quote + letter.toLocaleUpperCase()
    );

    // Restore normal sentence capitalization
    x = capitalizeAfterSentenceEnders(x);

    // Comma relocation fix retained
    x = x.replace(/,[ \t]*\(([^)]*?)\)(?=[ \t]*\S)/g, (match, inner, offset, str) => {
      const afterIdx = offset + match.length;
      if (str[afterIdx] === ',') return match;
      return ` (${inner}),`;
    });
    x = x.replace(/,[ \t]*\(([^)]*?)\)[ \t]*$/gm, ' ($1)');


    // ---------- Final Sanitation (Strict Parenthetical Safe) ----------

    // ❌ Do not add, remove, or alter newlines anywhere
    // ✅ Only lowercase the first word after ")" (except I / I'm / I'ma)
    x = x.replace(/(?<![?!])\)[ \t]+(\p{Lu}\p{Ll}*)\b/gu, (match, word) => {
      const exceptions = ['I', "I'm", "I'ma"];
      return exceptions.includes(word) ? `) ${word}` : `) ${word.toLocaleLowerCase()}`;
    });

    x = x
      .replace(/([,;!?])(\S)/g, (match, punct, next, offset, str) => {

        const following = str[offset + match.length] || '';
        if (
          next === "'" &&
          following &&
          following.toLocaleLowerCase() !== following.toLocaleUpperCase()
        ) {
          return punct + ' ' + next;
        }
		if (next === '"' || next === "'" || next === '”' || next === '’') return punct + next;
        const isLetter = next.toLocaleLowerCase() !== next.toLocaleUpperCase();
        if (isLetter || /\d/.test(next)) return punct + ' ' + next;
        return punct + next;
      })
      .replace(/ +/g, " ")                             // collapse multiple spaces
      .replace(/[ \t]+([,.;!?\)])/g, "$1")             // preserve newlines, remove only spaces before punctuation (except before "(")
      .replace(/([!?])[ \t]+(?=")/g, '$1')              // keep punctuation tight to closing quotes
      .replace(/([!?])(?=\s*["“(])/g, '$1 ')           // preserve space before opening quotes
      .replace(/(?<=[A-Za-z0-9])"(?=[^\s"!.?,;:)\]])/g, '" ') // ensure space after closing quotes when followed by text
      .replace(/([!?])[ \t]*(?=\()/g, "$1 ")          // ensure space between !/? and following "("
      .replace(/([A-Za-z])\(/g, "$1 (")              // space before (
      .replace(/\)([A-Za-z])/g, ") $1")              // space after )
      .replace(/\( +/g, "(").replace(/ +\)/g, ")")
      .replace(/,{2,}/g, ",")                        // collapse duplicate commas
      .replace(/,([ \t]*\))/g, "$1");                // remove commas immediately before a closing parenthesis

 // --- PATCH START: Prevent quote-line merging ---

// Optional: if a quote starts the next line right after text, force proper spacing
x = x.replace(/([A-Za-z])(\r?\n)"(?=[A-Za-z])/g, '$1\n"');

// --- PATCH END ---

    // 1️⃣ Remove trailing commas from line endings entirely
    x = x.replace(/,+\s*$/gm, "");
    x = x.replace(/([!?])[ \t]+(["'“”‘’])/g, "$1$2"); // remove space between punctuation and any quote mark
	x = x.replace(/([!?])[ \t]+(["'“”‘’])/g, "$1$2"); // remove space between punctuation and any quote mark

    // Prevent any amalgamation of lines ending with ")" or BV phrases
    x = x.replace(/(\))[ \t]*\n(?=[^\n])/g, '$1\n');

    // Remove overly aggressive BV adjacency merging
    x = x.replace(/((?:\)|\byeah\b)[,!?]*)\s*\n(?=\([^)]+\)\s*[a-z])/gi, '$1\n');
      x = x.replace(/([.!?])([ \t]*["'“”‘’])[ \t]*\n(?=[^\n])/g, '$1$2\n');

    if (preservedStandaloneParens.length > 0) {
      const restoreRe = new RegExp(`${STANDALONE_PAREN_SENTINEL}(\\d+)__`, 'g');
      x = x.replace(restoreRe, (_, idx) => {
        const original = preservedStandaloneParens[Number(idx)];
        return original === undefined ? '' : original;
      });
    }

    // 2️⃣ Ensure a blank line before structure tags when previous stanza ends with yeah/oh/whoa/huh or ")"
    x = x.replace(
      /(\b(?:yeah|oh|whoa|huh|ooh|ah|uh)\b|\))[ \t]*\n+(?=#(?:INTRO|VERSE|PRE-CHORUS|CHORUS|BRIDGE|HOOK|OUTRO))/gim,
      '$1\n\n'
    );

// --- PATCH START: Strict fix for double commas + quote spacing ---

// 1️⃣ Collapse redundant commas but keep line integrity
x = x.replace(/,{2,}/g, ','); // collapse double commas
x = x.replace(/[ \t]*,(?=[A-Za-z0-9])/g, ', '); // normalize comma spacing before words only
x = x.replace(/,[ \t]+,[ \t]*/g, ', '); // safety fix for broken comma pairs


// 2️⃣ Fix quote spacing inside parentheses — no other structure touched
x = x
  .replace(/\(\s*["“]/g, '("') // remove space between ( and "
  .replace(/["”]\s*\)/g, '")'); // remove space before closing )
// --- PATCH END ---

     // --- Final I-contraction normalization (post-format override) ---
x = x
  // I'll corrections (ill / i'll)
  .replace(/\b(i['’]?\s?ll)(?=[\s,.)!?'"]|$)/gi, "I'll")
  // I've corrections (ive / i've)
  .replace(/\b(i['’]?\s?ve)(?=[\s,.)!?'"]|$)/gi, "I've")
  // I'd corrections (id / i'd)
  .replace(/\b(i['’]?\s?d)(?=[\s,.)!?'"]|$)/gi, "I'd");


    // === Fix: Holiday and Proper Noun Corrections (adjusted for Christmastime) ===
    x = x.replace(/\bchrismast\b/gi, 'Christmas');
    x = x.replace(/\bchristmas[\s-]*time\b/gi, 'Christmastime');
    x = x.replace(/\bchristmas[\s-]*eve\b/gi, 'Christmas Eve');

    // === Merge duplicate structure tags & remove blank spacing ===
    x = x.replace(/(#(INTRO|VERSE|PRE-CHORUS|CHORUS|BRIDGE|HOOK|OUTRO))(\n\s*\n\1)+/g, '$1');
    x = x.replace(/(#\w+\n)\n+/g, '$1');

    // === Ensure blank line before structure tags for readability ===
    x = x.replace(/([^)#\n])\n(?=#(INTRO|VERSE|PRE-CHORUS|CHORUS|BRIDGE|HOOK|OUTRO))/g, '$1\n\n');

    // === Prevent #HOOK duplication after non-verbal insertion ===
    x = x.replace(/(#(INTRO|VERSE|PRE-CHORUS|CHORUS|BRIDGE|HOOK|OUTRO))(\n\1)+/g, '$1');

    // === Final cleanup ===
    x = x.replace(/ +\n/g, '\n'); // trim spaces before line breaks
    x = x.replace(/\n{3,}/g, '\n\n'); // collapse 3+ newlines into 2

	  // === Structural cleanup ===
    x = x.replace(/\n[ \t]*\n+(?=#INSTRUMENTAL\b)/g, '\n');
    x = x.replace(/\s+$/, '');

    // === Strengthened structure tag deduplication (prevents #HOOK double lines) ===
    x = x.replace(/(#(INTRO|VERSE|PRE-CHORUS|CHORUS|BRIDGE|HOOK|OUTRO)\s*\n\s*)+#\2/gi, '#$2');
    x = x.replace(/(#HOOK\s*\n\s*)+#HOOK/gi, '#HOOK');
    x = x.replace(/(#CHORUS\s*\n\s*)+#CHORUS/gi, '#CHORUS');

    // === Final-Pass: Capitalize first letter when line starts with "(" ===
    x = x.replace(/(^|\n)(\(\s*)(["'“”‘’]?)(\p{Ll})/gu,
      (_, b, p, q, l) => b + p + q + l.toLocaleUpperCase()
    );

    // 4️⃣ Remove stray indentation and trailing spaces on each line
    x = x.replace(/^[ \t]+/gm, "");
    x = x.replace(/[ \t]+$/gm, "");

    // === Remove syllable uniqueness markers ===
    x = x.replace(/\u200B\d*/g, "");

    // --- LOWERCASE MAIN VOCAL AFTER BACKING VOCAL SPLIT ---
    // (He loves her) Could anyone love you better? -> (He loves her) could anyone love you better?
    // FIX: Changed \s* to [ \t]* so it does not consume newlines and merge separate lines
    x = x.replace(/(^|\n)(\([^\n]*?\))[ \t]*([A-Z][^\n]*)/g, function(match, boundary, bv, tail){
      var first = tail.split(/\s+/)[0];
      if(BV_FIRST_WORD_EXCEPTIONS.has(first)) return match;
      var lowered = tail.charAt(0).toLowerCase() + tail.slice(1);
      return boundary + bv + " " + lowered;
    });

    x = x.trim();

    return x;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { formatLyrics };
  }

  if (!hasWindow) return;

  function bindFocusTracker(doc) {
    if (!doc || focusTrackedDocs.has(doc)) return;
    doc.addEventListener("focusin", e => {
      const el = e.target;
      if (el?.isContentEditable || el?.tagName === "TEXTAREA" || el?.getAttribute?.("role") === "textbox")
        currentEditable = el;
    });
    focusTrackedDocs.add(doc);
  }

  // ---------- Editor I/O ----------
  function getEditorText(el){return el.isContentEditable?el.innerText:el.value;}
  function setNativeValue(el,v){
    const ownerDoc=el?.ownerDocument||document;
    const ownerWin=ownerDoc?.defaultView||window;
    const p=Object.getPrototypeOf(el);
    const d=Object.getOwnPropertyDescriptor(p,'value');
    const s=d&&d.set;
    if(s)s.call(el,v);else el.value=v;
    const EventCtor=ownerWin?.Event||Event;
    el.dispatchEvent(new EventCtor('input',{bubbles:true}));
    el.dispatchEvent(new EventCtor('change',{bubbles:true}));
  }
  function replaceInContentEditable(el,t){
    const ownerDoc=el?.ownerDocument||document;
    const ownerWin=ownerDoc?.defaultView||window;
    el.focus();
    try{
      ownerDoc.execCommand('selectAll',false,null);
      ownerDoc.execCommand('insertText',false,t);
    }catch{
      el.innerText=t;
      const InputCtor=ownerWin?.InputEvent
        || (typeof InputEvent!=='undefined'?InputEvent:undefined)
        || ownerWin?.Event
        || Event;
      el.dispatchEvent(new InputCtor('input',{bubbles:true}));
    }
  }
  function writeToEditor(el,t){if(el.isContentEditable&&ALWAYS_AGGRESSIVE){replaceInContentEditable(el,t);setTimeout(()=>replaceInContentEditable(el,t),10);return true;}if(el.isContentEditable){replaceInContentEditable(el,t);return true;}if(el.tagName==='TEXTAREA'||el.tagName==='INPUT'){setNativeValue(el,t);return true;}return false;}

  // ---------- UI ----------
  function resolveUiContext() {
    if (!hasWindow) return { doc: null, win: null };
    try {
      const topWin = window.top;
      if (topWin && topWin.document) return { doc: topWin.document, win: topWin };
    } catch {
      /* ignore cross-origin access errors */
    }
    return { doc: document, win: window };
  }

  const { doc: uiDocument, win: uiWindowCandidate } = resolveUiContext();
  const uiWindow = uiDocument?.defaultView || uiWindowCandidate || window;
  bindFocusTracker(document);
  if (uiDocument && uiDocument !== document) bindFocusTracker(uiDocument);
  const BUTTON_RIGHT_OFFSET = 16;
  const BUTTON_BASE_BOTTOM = 146;
  const BUTTON_GAP_PX = 12;
  const MAX_CONFLICT_RIGHT_PX = 240;
  const REPOSITION_INTERVAL_MS = 250;
  const REPOSITION_ATTEMPTS = 6;
  const RAISE_BY_FACTOR = 1.5;
  let latestButtonBottom = BUTTON_BASE_BOTTOM;

  function computeBottomOffset(el) {
    const doc = el?.ownerDocument;
    const win = doc?.defaultView;
    if (!doc || !win) return BUTTON_BASE_BOTTOM;
    let requiredBottom = BUTTON_BASE_BOTTOM;
    const elements = doc.querySelectorAll('*');
    for (const node of elements) {
      if (!(node instanceof win.HTMLElement) || node === el) continue;
      const style = win.getComputedStyle(node);
      if (style.position !== 'fixed') continue;
      const rect = node.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) continue;
      const bottom = parseFloat(style.bottom);
      const right = parseFloat(style.right);
      if (!Number.isFinite(bottom) || !Number.isFinite(right)) continue;
      if (right > MAX_CONFLICT_RIGHT_PX) continue;
      const candidate = bottom + rect.height * RAISE_BY_FACTOR + BUTTON_GAP_PX;
      if (candidate > requiredBottom) requiredBottom = candidate;
    }
    return Math.round(requiredBottom);
  }

  function placeButton(el){
    if(!el) return;
    el.style.right=`${BUTTON_RIGHT_OFFSET}px`;
    latestButtonBottom=computeBottomOffset(el);
    el.style.bottom=`${latestButtonBottom}px`;
  }

  function bindShortcutListener(doc){
    if(!doc || shortcutTrackedDocs.has(doc)) return;
    doc.addEventListener('keydown',e=>{if(e.altKey&&!e.ctrlKey&&!e.metaKey&&e.key.toLowerCase()==='m'){e.preventDefault();runFormat();}});
    shortcutTrackedDocs.add(doc);
  }

  function ensureShortcutListeners(){
    bindShortcutListener(document);
    if(uiDocument && uiDocument!==document) bindShortcutListener(uiDocument);
  }

  let floatingButtonContainer=null;
  let floatingFormatButton=null;
  let floatingRevertButton=null;
  let floatingButtonIntervalId=null;
  let floatingButtonResizeHandler=null;
  let repositionTimeout=null;

  function createFloatingButton(){
    if(!uiDocument?.documentElement) return;
    const buttonParent=uiDocument.body||uiDocument.documentElement;
    if(!buttonParent) return;

    // Updated Colors to match Logo (approx)
    const MF_BLUE='#0e4f7a'; // Slightly richer blue from icon
    const MF_GOLD='#d4af37'; // Metallic Gold
    const MF_GLOW='rgba(212, 175, 55, 0.55)'; // Gold Glow

    let container=floatingButtonContainer||uiDocument.getElementById('mxmFmtBtnWrap');
    if(!container){
      container=uiDocument.createElement('div');
      container.id='mxmFmtBtnWrap';
      container.setAttribute('role','group');
      container.setAttribute('aria-label','Lyrics formatter controls');

      // FIX FOR FLICKER: Determine correct display style immediately based on current URL
      const initialDisplay = isAllowedPage() ? 'flex' : 'none';
      Object.assign(container.style,{display:initialDisplay,gap:'12px',alignItems:'center',position:'fixed',zIndex:2147483647,padding:'8px 10px',borderRadius:'16px',border:'none',background:'transparent',backdropFilter:'none'});
    }

    let formatBtn=floatingFormatButton||container.querySelector('#mxmFmtBtn');
    if(!formatBtn){
      formatBtn=uiDocument.createElement('button');
      formatBtn.id='mxmFmtBtn';
      formatBtn.type='button';
      // New content: Serif Italic 'f'
      formatBtn.innerHTML = '<span style="font-family: \'Times New Roman\', serif; font-style: italic; font-weight: 700; font-size: 38px; line-height: 1; padding-bottom: 4px; padding-right: 2px;">f</span>';
      formatBtn.setAttribute('aria-label','Format lyrics (Alt+M)');
      container.appendChild(formatBtn);
    }

    if(!formatBtn.dataset.mxmStyled){
      // Updated Styles: Circular, Blue BG, Gold Text
      Object.assign(formatBtn.style,{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${MF_GOLD}`,
        background: MF_BLUE,
        color: MF_GOLD,
        cursor:'pointer',
        transition:'transform .18s ease, box-shadow .18s ease',
        boxShadow:`0 4px 14px ${MF_GLOW}`
      });
      formatBtn.addEventListener('mouseenter',()=>{formatBtn.style.transform='translateY(-3px) scale(1.05)';formatBtn.style.boxShadow=`0 6px 22px ${MF_GLOW}`;});
      formatBtn.addEventListener('mouseleave',()=>{formatBtn.style.transform='';formatBtn.style.boxShadow=`0 4px 14px ${MF_GLOW}`;});
      formatBtn.addEventListener('focus',()=>{formatBtn.style.boxShadow=`0 0 0 3px ${MF_GLOW}`;});
      formatBtn.addEventListener('blur',()=>{formatBtn.style.boxShadow=`0 4px 14px ${MF_GLOW}`;});
      formatBtn.addEventListener('click',()=>{formatBtn.animate([{transform:'scale(0.9)'},{transform:'scale(1)'}],{duration:150,easing:'ease-out'});});
      formatBtn.dataset.mxmStyled='1';
    }

    let revertBtn=floatingRevertButton||container.querySelector('#mxmFmtRevertBtn');
    if(!revertBtn){
      revertBtn=uiDocument.createElement('button');
      revertBtn.id='mxmFmtRevertBtn';
      revertBtn.type='button';
      // New content: Undo Arrow SVG
      const undoSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>`;
      revertBtn.innerHTML = undoSvg;
      revertBtn.setAttribute('aria-label','Revert to original lyrics');
      container.appendChild(revertBtn);
    }

    if(!revertBtn.dataset.mxmStyled){
       // Updated Styles: Smaller Circular Button, Blue BG, Gold Icon
      Object.assign(revertBtn.style,{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        border: `1px solid ${MF_GOLD}`,
        background: MF_BLUE,
        color: MF_GOLD,
        cursor:'pointer',
        transition:'transform .18s ease, box-shadow .18s ease, opacity .2s',
        boxShadow:'0 4px 12px rgba(0,0,0,.3)'
      });
      revertBtn.addEventListener('mouseenter',()=>{if(revertBtn.disabled) return;revertBtn.style.transform='translateY(-2px)';revertBtn.style.boxShadow='0 6px 16px rgba(0,0,0,.4)';});
      revertBtn.addEventListener('mouseleave',()=>{revertBtn.style.transform='';revertBtn.style.boxShadow=revertBtn.disabled?'':'0 4px 12px rgba(0,0,0,.3)';});
      revertBtn.addEventListener('focus',()=>{revertBtn.style.boxShadow=`0 0 0 2px ${MF_GOLD}`;});
      revertBtn.addEventListener('blur',()=>{revertBtn.style.boxShadow=revertBtn.disabled?'':'0 4px 12px rgba(0,0,0,.3)';});
      revertBtn.dataset.mxmStyled='1';
    }

    let gearBtn=container.querySelector('#mxmFmtGear');
    if(!gearBtn){
      gearBtn=uiDocument.createElement('button');
      gearBtn.textContent='⚙️';
      gearBtn.id='mxmFmtGear';
      gearBtn.title='Formatter settings';
      gearBtn.type='button';
      gearBtn.setAttribute('aria-label','Formatter settings');
      gearBtn.setAttribute('aria-haspopup','true');
      gearBtn.setAttribute('aria-expanded','false');
      container.appendChild(gearBtn);
    }

    if(!gearBtn.dataset.mxmStyled){
      // Make the gear icon Gold
      Object.assign(gearBtn.style,{fontSize:'18px',marginLeft:'2px',cursor:'pointer',background:'transparent',border:'none',color:MF_GOLD,padding:'6px',textShadow: '0 2px 4px rgba(0,0,0,0.5)'});
      gearBtn.dataset.mxmStyled='1';
    }

    gearBtn.onclick=e=>{
      e.stopPropagation();
      let pop=uiDocument.getElementById('mxmFmtPopover');
      if(pop){
        const closerRef=pop.__mxmCloser;
        if(typeof closerRef==='function') uiDocument.removeEventListener('click',closerRef);
        pop.remove();
        gearBtn.setAttribute('aria-expanded','false');
        return;
      }

      pop=uiDocument.createElement('div');
      pop.id='mxmFmtPopover';
      Object.assign(pop.style,{position:'absolute',bottom:'70px',right:'0',background:'#1e1e1e',border:`1px solid ${MF_GOLD}`,borderRadius:'10px',padding:'8px 12px',fontSize:'13px',color:'#eee',boxShadow:'0 4px 16px rgba(0,0,0,0.4)',zIndex:2147483647});

      pop.innerHTML=`
    <div style="margin-bottom:6px;">
      <label style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <span style="color:${MF_GOLD}">Language:</span>
        <select id="mxmLangSelect" style="background:#222;color:#fff;border:1px solid #444;border-radius:6px;padding:2px 4px;">
          <option value="EN">EN</option>
          <option value="RU">RU</option>
          <option value="ES">ES</option>
          <option value="PT">PT</option>
          <option value="FR">FR</option>
          <option value="IT">IT</option>
        </select>
      </label>
    </div>
    <div>
      <label style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <span style="color:${MF_GOLD}">Auto Lowercase:</span>
        <input type="checkbox" id="mxmLowercaseToggle">
      </label>
    </div>
  `.trim();

      const langSel=pop.querySelector('#mxmLangSelect');
      const lcToggle=pop.querySelector('#mxmLowercaseToggle');
      const storedLangValue=readLocalOption('mxmFmtLang');
      langSel.value=storedLangValue||extensionOptions.lang||'EN';
      if(!langSel.querySelector(`option[value="${langSel.value}"]`))
        langSel.value=extensionOptions.lang||'EN';
      if(!langSel.querySelector(`option[value="${langSel.value}"]`))
        langSel.value='EN';
      lcToggle.checked=Boolean(extensionOptions.autoLowercase);

      langSel.onchange=ev=>{
        const nextLang=ev.target.value;
        extensionOptions.lang=nextLang;
        writeLocalOption('mxmFmtLang',nextLang);
        toast(`Language set to ${nextLang}`);
      };
      lcToggle.onchange=ev=>{
        const isChecked=Boolean(ev.target.checked);
        extensionOptions.autoLowercase=isChecked;
        writeLocalOption('mxmFmtAutoLowercase',isChecked?'1':'0');
        toast(`Auto lowercase ${isChecked?'enabled':'disabled'}`);
      };

      container.appendChild(pop);
      gearBtn.setAttribute('aria-expanded','true');
      const closer=evt=>{
        if(!pop.contains(evt.target) && evt.target!==gearBtn){
          pop.remove();
          uiDocument.removeEventListener('click',closer);
          gearBtn.setAttribute('aria-expanded','false');
        }
      };
      pop.__mxmCloser=closer;
      uiDocument.addEventListener('click',closer);
    };

    if(!container.isConnected) buttonParent.appendChild(container);

    // container.style.boxShadow='0 6px 18px rgba(0,0,0,.28)'; // Removed container shadow since buttons have their own
    placeButton(container);

    const hostWindow=uiWindow||window;
    if(floatingButtonIntervalId){
      hostWindow.clearInterval(floatingButtonIntervalId);
      floatingButtonIntervalId=null;
    }
    let repositionCount=0;
    floatingButtonIntervalId=hostWindow.setInterval(()=>{
      repositionCount++;
      placeButton(container);
      if(repositionCount>=REPOSITION_ATTEMPTS){
        hostWindow.clearInterval(floatingButtonIntervalId);
        floatingButtonIntervalId=null;
      }
    },REPOSITION_INTERVAL_MS);

    if(floatingButtonResizeHandler){
      hostWindow.removeEventListener('resize',floatingButtonResizeHandler);
    }
    floatingButtonResizeHandler=()=>{
      if(repositionTimeout) clearTimeout(repositionTimeout);
      repositionTimeout=setTimeout(()=>placeButton(container),150);
    };
    hostWindow.addEventListener('resize',floatingButtonResizeHandler);

    formatBtn.onclick=()=>runFormat();
    revertBtn.onclick=()=>revertLastFormat();
    floatingButtonContainer=container;
    floatingFormatButton=formatBtn;
    floatingRevertButton=revertBtn;
    updateRevertButtonState();
    ensureShortcutListeners();
  }

  function removeFloatingButton(){
    const hostWindow=uiWindow||window;
    if(floatingButtonIntervalId){
      hostWindow.clearInterval(floatingButtonIntervalId);
      floatingButtonIntervalId=null;
    }
    if(repositionTimeout){
      clearTimeout(repositionTimeout);
      repositionTimeout=null;
    }
    if(floatingButtonResizeHandler){
      hostWindow.removeEventListener('resize',floatingButtonResizeHandler);
      floatingButtonResizeHandler=null;
    }
    const popover=uiDocument?.getElementById('mxmFmtPopover');
    if(popover){
      const closerRef=pop.__mxmCloser;
      if(typeof closerRef==='function') uiDocument.removeEventListener('click',closerRef);
      popover.remove();
    }
    const container=floatingButtonContainer||uiDocument?.getElementById('mxmFmtBtnWrap');
    if(container?.isConnected) container.remove();
    floatingButtonContainer=null;
    floatingFormatButton=null;
    floatingRevertButton=null;
    latestButtonBottom=BUTTON_BASE_BOTTOM;
  }

  function syncFloatingButtonVisibility(){
    if(extensionOptions.showFloatingButton) createFloatingButton();
    else removeFloatingButton();
  }

  function updateRevertButtonState(){
    const btn=floatingRevertButton||uiDocument?.getElementById('mxmFmtRevertBtn');
    if(!btn) return;
    const hasStored=lastFormatState!==null || readStoredOriginal()!==null;
    btn.disabled=!hasStored;
    btn.setAttribute('aria-disabled',btn.disabled?'true':'false');
    btn.style.opacity=btn.disabled?'0.55':'1';
    btn.style.cursor=btn.disabled?'not-allowed':'pointer';
    if(btn.disabled){
      btn.style.transform='';
      btn.style.boxShadow='';
    }else if(!btn.style.boxShadow){
      btn.style.boxShadow='0 4px 12px rgba(0,0,0,.3)';
    }
  }

  function revertLastFormat(){
    const original=getLastOriginalText();
    if(original===null){
      alert('No previous lyrics stored. Format the lyrics before trying to revert.');
      return;
    }
    let target=null;
    if(lastFormatState?.element && lastFormatState.element.isConnected){
      target=lastFormatState.element;
    }
    if(!target){
      const docCandidate=lastFormatState?.doc||uiDocument||document;
      target=findDeepEditable(docCandidate)||currentEditable;
    }
    if(!target){
      alert('Click inside the lyrics field first, then press Revert.');
      return;
    }
    writeToEditor(target,original);
    toast('Restored original lyrics');
  }

  function applyExtensionOptions(updates={}){
    if(!updates || typeof updates!=='object') return;
    const prevShow=extensionOptions.showFloatingButton;
    if(Object.prototype.hasOwnProperty.call(updates,'lang') && typeof updates.lang==='string'){
      extensionOptions.lang=updates.lang;
      writeLocalOption('mxmFmtLang',extensionOptions.lang);
    }
    if(Object.prototype.hasOwnProperty.call(updates,'autoLowercase')){
      extensionOptions.autoLowercase=Boolean(updates.autoLowercase);
      writeLocalOption('mxmFmtAutoLowercase',extensionOptions.autoLowercase?'1':'0');
    }
    if(Object.prototype.hasOwnProperty.call(updates,'fixBackingVocals'))
      extensionOptions.fixBackingVocals=Boolean(updates.fixBackingVocals);
    let showChanged=false;
    if(Object.prototype.hasOwnProperty.call(updates,'showFloatingButton')){
      const nextShow=Boolean(updates.showFloatingButton);
      showChanged=nextShow!==prevShow;
      extensionOptions.showFloatingButton=nextShow;
    }
    if(showChanged) syncFloatingButtonVisibility();
    else if(extensionOptions.showFloatingButton && !floatingButtonContainer) createFloatingButton();

  }

  function initializeExtensionOptions(){
    ensureShortcutListeners();
    syncFloatingButtonVisibility();


    const chromeStorage=typeof chrome!=='undefined'?chrome.storage:undefined;
    if(!chromeStorage?.sync) return;

    chromeStorage.sync.get(['mxmLang','mxmLower','mxmBV','mxmButton'],data=>{
      const payload=data||{};
      applyExtensionOptions({
        lang: payload.mxmLang || extensionDefaults.lang,
        autoLowercase: Boolean(payload.mxmLower),
        fixBackingVocals: payload.mxmBV ?? extensionDefaults.fixBackingVocals,
        showFloatingButton: Boolean(payload.mxmButton)
      });
    });

    if(chromeStorage.onChanged?.addListener){
      chromeStorage.onChanged.addListener((changes,area)=>{
        if(area!=='sync') return;
        const updates={};
        if(Object.prototype.hasOwnProperty.call(changes,'mxmLang'))
          updates.lang=changes.mxmLang.newValue || extensionDefaults.lang;
        if(Object.prototype.hasOwnProperty.call(changes,'mxmLower'))
          updates.autoLowercase=Boolean(changes.mxmLower.newValue);
        if(Object.prototype.hasOwnProperty.call(changes,'mxmBV'))
          updates.fixBackingVocals=changes.mxmBV.newValue ?? extensionDefaults.fixBackingVocals;
        if(Object.prototype.hasOwnProperty.call(changes,'mxmButton'))
          updates.showFloatingButton=Boolean(changes.mxmButton.newValue);
        if(Object.keys(updates).length) applyExtensionOptions(updates);
      });
    }
  }

  initializeExtensionOptions();
  // Call IMMEDIATELY to set correct state without waiting for timeout
  // This prevents valid pages from waiting, and ensures invalid pages (missions) never see the button
  checkRouteAndVisibility();
  function toast(msg){
    if(!uiDocument) return;
    const t=uiDocument.createElement('div');
    const toastBottom=Math.max(latestButtonBottom+48,BUTTON_BASE_BOTTOM+48);
    Object.assign(t.style,{background:'rgba(17,17,17,.95)',color:'#eaeaea',border:'1px solid #333',borderRadius:'10px',padding:'8px 10px',fontFamily:'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',fontSize:'12px',position:'fixed',right:`${BUTTON_RIGHT_OFFSET}px`,bottom:`${toastBottom}px`,zIndex:2147483647,boxShadow:'0 8px 22px rgba(0,0,0,.35)'});
    t.setAttribute('role','status');
    t.setAttribute('aria-live','polite');
    t.textContent=msg;
    uiDocument.documentElement.appendChild(t);
    (uiWindow||window).setTimeout(()=>t.remove(),1800);
  }

  // ---------- Runner ----------
  function runFormat(passedOptions){
    if(passedOptions && typeof passedOptions==='object'){
      const updates={};
      if(Object.prototype.hasOwnProperty.call(passedOptions,'lang') && typeof passedOptions.lang==='string')
        updates.lang=passedOptions.lang;
      if(Object.prototype.hasOwnProperty.call(passedOptions,'autoLowercase'))
        updates.autoLowercase=Boolean(passedOptions.autoLowercase);
      if(Object.prototype.hasOwnProperty.call(passedOptions,'fixBackingVocals'))
        updates.fixBackingVocals=Boolean(passedOptions.fixBackingVocals);
      if(Object.prototype.hasOwnProperty.call(passedOptions,'showFloatingButton'))
        updates.showFloatingButton=Boolean(passedOptions.showFloatingButton);
      if(Object.keys(updates).length) applyExtensionOptions(updates);
    }

    const searchDoc=uiDocument||document;
    const el=currentEditable||findDeepEditable(searchDoc);
    if(!el){alert('Click inside the lyrics field first, then press Alt+M.');return;}
    const before=getEditorText(el);
    saveLastOriginal(el,before);

    let raw=before;

    // === AUTO LOWERCASE: APPLY BEFORE FORMATTING, THEN TURN OFF ===
    if(extensionOptions.autoLowercase){
      // Lowercase only non-tag lines (do not touch #VERSE/#CHORUS/etc.)
      raw = raw.replace(/(^|\n)(?!#)([^\n]+)/g, function(m,b,line){
        return b + line.toLowerCase();
      });

      // Auto-disable after one use
      extensionOptions.autoLowercase = false;
      writeLocalOption('mxmFmtAutoLowercase','0');

      // Update UI toggle if settings panel is open
      if(uiDocument){
        const toggle = uiDocument.getElementById('mxmLowercaseToggle');
        if(toggle) toggle.checked = false;
      }
    }
    // === END AUTO LOWERCASE BLOCK ===

    let out=formatLyrics(raw,extensionOptions);

    writeToEditor(el,out);
    toast(`Formatted ✓ (v${SCRIPT_VERSION})`);
  }

  // Listen for popup-triggered Format Lyrics
  window.runFormat = window.runFormat || function(options) {
    const event = new CustomEvent('mxmFormatRequest', { detail: options || null });
    document.dispatchEvent(event);
  };

	 // ==== Floating button visibility toggle ====
  document.addEventListener('mxmFormatRequest', (evt) => {
    if (typeof runFormat === 'function') runFormat(evt?.detail);
  });

  // Replaced the simple interval with one that calls the strict route check
  setInterval(() => {
    if (typeof checkRouteAndVisibility === 'function') {
        checkRouteAndVisibility();
    }
  }, 1000);

})(typeof globalThis !== 'undefined' ? globalThis : this);
