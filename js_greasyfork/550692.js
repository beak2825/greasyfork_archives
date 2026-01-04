// ==UserScript==
// @name         SEC XBRL Extractor
// @version      1.0.11
// @description  Extract key data from SEC iXBRL filings and open a formatted report in a new tab (strict current-period matching). Prefers months over weeks; tooltip with start/end; shows FAB only for 10-Q / 10-K; non-blocking FAB; preserves custom link styling.
// @author       vacuity
// @license      MIT
// @match        https://www.sec.gov/*
// @grant        GM_openInTab
// @run-at       document-idle
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/550692/SEC%20XBRL%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/550692/SEC%20XBRL%20Extractor.meta.js
// ==/UserScript==
(function () {
  'use strict';

  // ---------- Config ----------
  const HOST_ID = 'sec-xbrl-extractor-host';
  const WRAP_ID = 'sec-xbrl-extractor-wrap';
  const BTN_ID  = 'sec-xbrl-extractor-fab';

  // Cache for form-type checks per target filing URL
  const FORM_CHECK_CACHE = new Map(); // key: docUrl => true/false
  let lastCheckHref = null;           // to avoid races with navigation
  let checkInFlight = null;

  // ---------- Page targeting ----------
  function urlMatches() {
    try {
      const u = new URL(location.href);
      if (u.hostname !== 'www.sec.gov') return false;
      if (u.pathname.startsWith('/Archives/edgar/data/')) return true;
      if (u.pathname === '/ix') {
        const p = u.searchParams.get('doc') || u.searchParams.get('file') || '';
        return p.startsWith('/Archives/edgar/data/');
      }
      return false;
    } catch {
      return false;
    }
  }

  function getDocUrlForCheck() {
    const u = new URL(location.href);
    if (u.pathname.startsWith('/Archives/edgar/data/')) return location.href;
    if (u.pathname === '/ix') {
      const p = u.searchParams.get('doc') || u.searchParams.get('file');
      if (!p) return null;
      if (/^https?:\/\//i.test(p)) return p;
      return new URL(p, 'https://www.sec.gov').href;
    }
    return null;
  }

  // ---------- FAB rendering (non-blocking host; minimal interactive wrapper) ----------
  function injectFabStylesOnce() {
    if (document.getElementById(`${BTN_ID}-styles`)) return;
    const css = `
      #${BTN_ID}{
        padding:10px 14px; border-radius:8px; border:1px solid #1f4980;
        background:#2b579a; color:#fff;
        font:13px/1.2 Segoe UI, Calibri, Arial, sans-serif;
        box-shadow:0 3px 10px rgba(0,0,0,0.2);
        cursor:pointer;
      }
      #${BTN_ID}:hover{ background:#1f4980; }
    `.trim();

    const ns = document.documentElement.namespaceURI || 'http://www.w3.org/1999/xhtml';
    const styleEl = document.createElementNS(ns, 'style');
    styleEl.id = `${BTN_ID}-styles`;
    styleEl.setAttribute('type', 'text/css');
    styleEl.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(styleEl);
  }

  function createFabIfNeeded() {
    if (document.getElementById(HOST_ID)) return;

    injectFabStylesOnce();
    const ns = document.documentElement.namespaceURI || 'http://www.w3.org/1999/xhtml';

    // Non-interactive host: never intercepts clicks/pages (prevents any “grey overlay” issues)
    const host = document.createElementNS(ns, 'div');
    host.id = HOST_ID;
    host.setAttribute('style', [
      'position:fixed',
      'right:16px',
      'bottom:16px',
      'z-index:2147483647',
      'pointer-events:none',
      'width:auto',
      'height:auto',
      'background:transparent'
    ].join(';'));

    // Minimal interactive wrapper (only the button rectangle is clickable)
    const wrap = document.createElementNS(ns, 'div');
    wrap.id = WRAP_ID;
    wrap.setAttribute('style', [
      'pointer-events:auto',
      'display:inline-flex',
      'align-items:center',
      'justify-content:center'
    ].join(';'));

    // Button
    const btn = document.createElementNS(ns, 'button');
    btn.id = BTN_ID;
    btn.type = 'button';
    btn.textContent = 'SEC XBRL Extractor';
    btn.addEventListener('click', () =>
      runExtractor().catch(err => {
        console.error('[SEC XBRL Extractor] Failed:', err);
        alert('SEC XBRL Extractor encountered an error. See console for details.');
      })
    );

    wrap.appendChild(btn);
    host.appendChild(wrap);
    (document.body || document.documentElement).appendChild(host);
  }

  function removeFabIfAny() {
    const host = document.getElementById(HOST_ID);
    if (host) host.remove();
  }

// Accept 10‑Q, 10‑K, 20‑F (including amendments like 10‑K/A, 20‑F/A).
// Strategy:
// 1) Prefer visible dei:DocumentType (not hidden and not xsi:nil).
// 2) Fall back to any dei:DocumentType if visible is absent.
// Returns: true only for accepted forms; false otherwise.
// Notes:
// - Handles variants like "FORM 10-K", hyphen/no-hyphen ("10-K" vs "10K"),
//   and strips "/A" before comparing.
// - isInlineHidden(el) should already exist in your script.
async function detectIs10Qor10KFromDoc(doc) {
  const nodes = Array.from(doc.querySelectorAll('[name="dei:DocumentType"]'));
  const visible = nodes.find(el => el.getAttribute('xsi:nil') !== 'true' && !isInlineHidden(el));
  const any = visible || nodes.find(el => el.getAttribute('xsi:nil') !== 'true');

  const accept = (t) => {
    if (!t) return false;
    let s = String(t).toUpperCase()
      .replace(/\u00A0/g, ' ')
      .trim()
      .replace(/^FORM\s+/, '')  // handle "FORM 10-K"
      .replace(/\s+/g, '')      // remove internal spaces
      .replace(/\/A$/, '')      // strip amendment
      .replace(/-/g, '');       // normalize "10-K" -> "10K"
    return s === '10Q' || s === '10K' || s === '20F';
  };

  return any ? accept(any.textContent) : false;
}

  async function checkIs10Qor10K(docUrl) {
    // Cache
    if (FORM_CHECK_CACHE.has(docUrl)) return FORM_CHECK_CACHE.get(docUrl);

    // If current page is already the filing HTML, use it directly
    if (location.href === docUrl && location.pathname.startsWith('/Archives/edgar/data/')) {
      const ok = await detectIs10Qor10KFromDoc(document);
      FORM_CHECK_CACHE.set(docUrl, ok);
      return ok;
    }

    // Otherwise fetch the target filing once (same-origin)
    try {
      const res = await fetch(docUrl, { credentials: 'include' });
      const buf = await res.arrayBuffer();
      const html = new TextDecoder('utf-8').decode(buf);
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const ok = await detectIs10Qor10KFromDoc(doc);
      FORM_CHECK_CACHE.set(docUrl, ok);
      return ok;
    } catch (e) {
      console.warn('[SEC XBRL Extractor] form-type check failed:', e);
      FORM_CHECK_CACHE.set(docUrl, false);
      return false;
    }
  }

  async function ensureButton() {
    if (!urlMatches()) {
      removeFabIfAny();
      return;
    }

    // Debounce / race-guard per URL
    const hrefNow = location.href;
    lastCheckHref = hrefNow;

    const docUrl = getDocUrlForCheck();
    if (!docUrl) {
      removeFabIfAny();
      return;
    }

    // Show/hide based on cached info if available immediately
    if (FORM_CHECK_CACHE.has(docUrl)) {
      const ok = FORM_CHECK_CACHE.get(docUrl);
      if (ok) createFabIfNeeded();
      else removeFabIfAny();
      return;
    }

    // Kick off a single in-flight check for this URL
    if (!checkInFlight) {
      checkInFlight = (async () => {
        const ok = await checkIs10Qor10K(docUrl);
        // Only apply result if the page is still the same
        if (lastCheckHref === hrefNow) {
          if (ok) createFabIfNeeded();
          else removeFabIfAny();
        }
        checkInFlight = null;
      })();
    }
  }

  // ---------- Initial + subsequent checks ----------
  ensureButton();
  document.addEventListener('DOMContentLoaded', ensureButton);
  window.addEventListener('load', ensureButton);
  window.addEventListener('popstate', ensureButton);
  document.addEventListener('visibilitychange', ensureButton);

  // ---------- Main extractor ----------
  function resolveFilingUrlFromViewer() {
    const u = new URL(location.href);
    const p = u.searchParams.get('doc') || u.searchParams.get('file');
    if (p) return /^https?:\/\//i.test(p) ? p : new URL(p, 'https://www.sec.gov').href;
    return location.href;
  }

  async function runExtractor() {
    const rawUrl = resolveFilingUrlFromViewer();
    const res = await fetch(rawUrl);
    const buffer = await res.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    const html = decoder.decode(buffer);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // ===== Narrative results =====
    const results = [];

    // ===== Company name =====
    const companyName = getCompanyName(doc);

    // ===== Form Type =====
    let formType = 'Unknown';
    let formTypeUpper = 'UNKNOWN';
    const docTypeElVisible = Array.from(doc.querySelectorAll('[name="dei:DocumentType"]'))
      .find(el => el.getAttribute('xsi:nil') !== 'true' && !isInlineHidden(el));
    const docTypeElAny = docTypeElVisible ||
      Array.from(doc.querySelectorAll('[name="dei:DocumentType"]'))
        .find(el => el.getAttribute('xsi:nil') !== 'true');
    let docTypeText = docTypeElAny
      ? (docTypeElAny.textContent || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim()
      : null;

    if (docTypeText) {
      const rawCode = docTypeText.toUpperCase();
      formType = `FORM ${rawCode}`;
      formTypeUpper = `FORM ${rawCode.replace(/\/A$/, '')}`;
    } else {
      const legacy = html.match(/Form\s+10-\[QK]/i);
      if (legacy) {
        formType = legacy[0].toUpperCase().replace(/^FORM/, 'FORM');
        formTypeUpper = formType;
      }
    }

    const lowerHtml = html.toLowerCase();

    // ===== Period end date =====
    const periodEndFromPref = getPeriodEndDatePreferred(doc); // ISO or human
    const periodEndProseFallback = extractEndDateFromProse(doc.documentElement.textContent || '');
    const periodEndRaw = periodEndFromPref ?? periodEndProseFallback;

    let periodEndDisplay = 'N/A';
    if (periodEndRaw) {
      periodEndDisplay = /^\d{4}-\d{2}-\d{2}$/.test(periodEndRaw)
        ? formatISODate(periodEndRaw)
        : formatDate(periodEndRaw);
    }

    const desiredEndISO =
      (/^\d{4}-\d{2}-\d{2}$/.test(periodEndRaw) ? periodEndRaw : toISOFromHumanDate(periodEndRaw)) || null;

    // ===== Derive measurement (prefer months) + start/end
    const measurement = derivePeriodMeasurement(doc, desiredEndISO, formTypeUpper, lowerHtml);
    const desiredMonths = (measurement.type === 'months') ? Number(measurement.value) : null;

    const periodHeaderText =
      measurement.type === 'weeks' ? `${measurement.value} weeks` :
      measurement.type === 'months' ? `${spellOut369Keep12(String(measurement.value))} months` :
      `[period]`;

    const tooltipStartISO = measurement.startISO ?? 'N/A';
    const tooltipEndISO   = (measurement.endISO ?? desiredEndISO) ?? 'N/A';
    const periodTooltip   = `Start: ${tooltipStartISO}\nEnd: ${tooltipEndISO}`;

    const formTypeHtml = `<b>Form Type:</b> ${formType}`;
    // Dotted underline via .period-tip in output CSS
    const periodHtml   = `<b class="period-tip" title="${escapeHtml(periodTooltip)}">Period:</b> ${periodHeaderText} ended ${periodEndDisplay}`;

    // ===== Tags =====
    const tags = {
      // Balance Sheet (instants)
      'Cash and cash equivalents': 'us-gaap:CashAndCashEquivalentsAtCarryingValue',
      'Cash, cash equivalents, and restricted cash': 'us-gaap:CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents',
      'Cash': 'us-gaap:Cash',
      'Cash equivalents': 'us-gaap:CashEquivalentsAtCarryingValue',
      'Restricted cash': 'us-gaap:RestrictedCash',
      'Current restricted cash': 'us-gaap:RestrictedCashCurrent',
      'Investments at fair value': 'us-gaap:InvestmentOwnedAtFairValue',
      'Total assets': 'us-gaap:Assets',
      'Total current liabilities': 'us-gaap:LiabilitiesCurrent',
      'Accumulated deficit': 'us-gaap:RetainedEarningsAccumulatedDeficit',
      'Accumulated comprehensive deficit': 'us-gaap:AccumulatedOtherComprehensiveIncomeLossNetOfTax',
      // Operations (durations)
      'Revenues': 'us-gaap:Revenues',
      'Revenue including assessed tax': 'us-gaap:RevenueFromContractWithCustomerIncludingAssessedTax',
      'Revenue excluding assessed tax': 'us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax',
      'Total investment income': 'us-gaap:GrossInvestmentIncomeOperating',
      'Operating Loss': 'us-gaap:OperatingIncomeLoss',
      'Net Loss': 'us-gaap:NetIncomeLoss',
      // Cash flows (durations)
      'Cash flows from operating activities': 'us-gaap:NetCashProvidedByUsedInOperatingActivities',
      'Cash flows from investing activities': 'us-gaap:NetCashProvidedByUsedInInvestingActivities',
      'Net cash flow (including exchange rate effect)':
        'us-gaap:CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalentsPeriodIncreaseDecreaseIncludingExchangeRateEffect',
      'Net cash flow (excluding exchange rate effect)':
        'us-gaap:CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalentsPeriodIncreaseDecreaseExcludingExchangeRateEffect'
    };

    const endForFacts = measurement.endISO || desiredEndISO;

    // ===== Extract facts =====
    const facts = Object.create(null);
    for (const [label, tag] of Object.entries(tags)) {
      const chosen = selectBestFactForTag(doc, tag, {
        desiredEndISO: endForFacts,
        desiredMonths,
        strictEndISOAll: true
      });
      if (!chosen) continue;
      const { num } = chosen;
      const formatted = Number.isNaN(num) ? 'Not available' : formatNumber(num, label);
      let displayLabel = label;
      if (label === 'Accumulated deficit') displayLabel = num < 0 ? 'Accumulated deficit' : 'Retained Earnings';
      if (label === 'Accumulated comprehensive deficit') {
        displayLabel = num > 0 ? 'Accumulated other comprehensive income' : 'Accumulated comprehensive deficit';
      }
      if (label === 'Operating Loss') displayLabel = num < 0 ? 'Operating Loss' : 'Operating Income';
      if (label === 'Net Loss') displayLabel = num < 0 ? 'Net Loss' : 'Net Income';
      facts[label] = { num, formatted, displayLabel };
    }

      // ===== Going Concern =====
      // Intention: find "substantial doubt" discussion even when the filing uses <div> instead of <p>.
      // Edge cases handled: iX filings that wrap narrative in styled <div> blocks (no <p> tags).
      // Output: If found, we inject the matched paragraphs with <mark> around "whether" to flag
      //         evaluative language that may not assert going-concern risk.
      const paragraphs = Array.from(doc.querySelectorAll('p'));
      const concern = paragraphs
      .map(p => textWithoutHiddenAndIXBRL(p))
      .filter(txt => txt.toLowerCase().includes('substantial doubt'));

      const paragraphs2 = Array.from(doc.querySelectorAll('div'));
      const concern2 = paragraphs2
      .map(div => textWithoutHiddenAndIXBRL(div))
      .filter(txt => txt.toLowerCase().includes('substantial doubt'));

      // Highlight helper: case-insensitive word-boundary match for "whether".
      // When triggered, wraps the word in <mark> with a tooltip to alert users that
      // this sentence may be evaluative (i.e., not necessarily an assertion of risk).
      const highlightWhether = (s) =>
      String(s).replace(
          /\b(whether)\b/gi,
          '<mark title="This may be evaluative language rather than a going-concern assertion.">$1</mark>'
      );

      if (concern.length) {
          const highlighted = concern.map(highlightWhether).join('<br><br>');
          results.push(`<h3>Going Concern:</h3>${highlighted}`);
      } else if (concern2.length) {
          const highlighted = concern2.map(highlightWhether).join('<br><br>');
          results.push(`<h3>Going Concern:</h3>${highlighted}`);
      } else {
          results.push(`<h3>Going Concern:</h3> No going concern risk`);
      }

    // ===== FINANCIAL CONDITION =====
    const formLabel = formType.replace('FORM ', 'Form ');
    // DO NOT CHANGE: Keep the original HTML link style (user preference)
    const formLink = `<a href="${rawUrl}" style="color: rgb(31, 73, 125); text-decoration: none;">${formLabel}</a>`;

    // Cash fallback
    const cash =
      facts['Cash and cash equivalents']?.formatted
      ?? facts['Cash, cash equivalents, and restricted cash']?.formatted
      ?? facts['Cash equivalents']?.formatted
      ?? '[cash]';

    const acc = facts['Accumulated deficit'];
    const showDeficit  = acc?.displayLabel === 'Accumulated deficit';
    const deficitValue = acc?.formatted ?? '[deficit]';

    const net = facts['Net Loss'];
    const showNetLoss = net?.displayLabel === 'Net Loss';
    const netValue    = net?.formatted ?? '[net]';

    const periodHyphen =
      measurement.type === 'weeks' ? `${measurement.value}-week` :
      measurement.type === 'months' ? `${hyphenNumberForSentence(String(measurement.value))}-month` :
      null;

    const periodPhrase = periodHyphen
      ? `for the ${periodHyphen} period ended ${periodEndDisplay}`
      : `for the period ended ${periodEndDisplay}`;

    let analysis = `
<p style="font-family: Calibri; font-size: 10pt; margin-top: 6pt; margin-bottom: 0;">
  <span style="color: rgb(79, 129, 189);">FINANCIAL CONDITION</span>
</p>`;

    analysis += `
<p style="font-family: Calibri; font-size: 10pt; margin-top: 6pt; margin-bottom: 0;">
  The most recent ${formLink}, ${periodPhrase}, indicates that the company had cash and cash equivalents of ${cash}`;
    if (showDeficit) analysis += ` and an accumulated deficit of ${deficitValue}`;
    if (showNetLoss) {
      const precedingText =
        measurement.type === 'weeks' ? `${measurement.value} weeks` :
        measurement.type === 'months' ? `${spellOut369Keep12(String(measurement.value))} months` :
        `period`;
      analysis += `, and reported a net loss of ${netValue} for the preceding ${precedingText}.`;
    } else {
      analysis += `.`;
    }
    if (concern.length) analysis += ` The company discloses that these factors raise substantial doubt over its ability to continue as a going concern.`;
    analysis += `</p>`;
    results.push(analysis);

    // ===== Output page =====
    const financialTableHtml = buildFinancialTable(facts, tags);
    const outputHtml = `
<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>SEC XBRL Extracted Data</title>
<style>
body { font-family: Calibri, sans-serif; padding: 20px; line-height: 1.6; }
b { color: #003366; }
h1 { margin: 0 0 12px 0; font-size: 20px; }
h2 { margin-top: 20px; display: flex; align-items: center; gap: 12px; }
table.financial-grid { width: 100%; border-collapse: collapse; table-layout: fixed; }
table.financial-grid th { text-align: left; color: #003366; border-bottom: 1px solid #ddd; padding: 6px 12px; }
table.financial-grid td { vertical-align: top; padding: 8px 12px; }
table.financial-grid .cell-list > div { margin: 6px 0; }
/* Tooltips and dotted underline */
.cell-list b[title] { border-bottom: 1px dotted #999; cursor: help; }
.period-tip { border-bottom: 1px dotted #999; cursor: help; }
/* Toggle visibility for compact vs exact numbers */
.value-exact { display: none; }
body.show-exact .value-exact { display: inline; }
body.show-exact .value-abbr  { display: none; }
/* Color coding */
.neg { color: #b22222; } /* firebrick red */
.pos { color: #006400; } /* dark green */
/* "Not found" deemphasis */
.not-found { color: #888; }
.toggle-precise { font-weight: normal; font-size: 12px; color: #333; }
</style>
</head>
<body>
<h1>${companyName}</h1>
${formTypeHtml}<br><br>
${periodHtml}
<h2>
  Extracted Financial Data
  <label class="toggle-precise">
    <input type="checkbox" id="toggleExact"> Show precise numbers
  </label>
</h2>
${financialTableHtml}
${results.join('<br><br>')}
<script>
(function(){
  var cb = document.getElementById('toggleExact');
  if (!cb) return;
  var apply = function(){ document.body.classList.toggle('show-exact', cb.checked); };
  cb.addEventListener('change', apply);
}());
</script>
</body>
</html>
`;

    const blob = new Blob([outputHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win && typeof GM_openInTab === 'function') {
      GM_openInTab(url, { active: true, insert: true });
    }
  }

  // ===================== Helpers =====================

  function getCompanyName(doc) {
    const all = Array.from(doc.querySelectorAll('[name="dei:EntityRegistrantName"]'))
      .filter(el => el.getAttribute('xsi:nil') !== 'true');
    const visible = all.find(el => !isInlineHidden(el) && normalizeText(el.textContent));
    const pick = visible || all.find(el => normalizeText(el.textContent));
    return pick ? normalizeText(pick.textContent) : '[Company Name]';
  }

  function normalizeText(s) {
    return String(s || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Prefer months; return start/end
  function derivePeriodMeasurement(doc, desiredEndISO, formTypeUpper, lowerHtml) {
    const dur = getDurationCandidatesForEndDate(doc, desiredEndISO);
    if (dur.length) {
      let monthsCand = null;
      let weeksCand = null;
      let bestWeeksCand = null;
      let bestDays = -1;

      for (const c of dur) {
        const { startISO, endISO } = c;
        const days = daysInclusive(startISO, endISO);
        const weeks = Math.round(days / 7);

        if (days > bestDays) { bestDays = days; bestWeeksCand = { weeks, startISO, endISO }; }

        const strictMonths = diffMonthsInclusive(startISO, endISO);
        if (strictMonths) monthsCand = { months: strictMonths, startISO, endISO };

        if ((weeks >= 12 && weeks <= 14) ||
            (weeks >= 25 && weeks <= 27) ||
            (weeks >= 38 && weeks <= 40) ||
            (weeks >= 51 && weeks <= 54)) {
          weeksCand = { weeks, startISO, endISO };
        }
      }

      if (monthsCand) {
        return { type: 'months', value: monthsCand.months, startISO: monthsCand.startISO, endISO: monthsCand.endISO };
      }
      if (weeksCand) {
        return { type: 'weeks', value: weeksCand.weeks, startISO: weeksCand.startISO, endISO: weeksCand.endISO };
      }
      if (bestWeeksCand && bestWeeksCand.weeks > 0) {
        return { type: 'weeks', value: bestWeeksCand.weeks, startISO: bestWeeksCand.startISO, endISO: bestWeeksCand.endISO };
      }
    }

    const m = extractPeriodMonthsFromProse(lowerHtml, formTypeUpper);
    if (m !== '[period]') {
      return { type: 'months', value: Number(m), startISO: null, endISO: desiredEndISO || null };
    }
    return { type: 'unknown', value: null, startISO: null, endISO: desiredEndISO || null };
  }

  function getDurationCandidatesForEndDate(doc, desiredEndISO) {
    if (!desiredEndISO) return [];
    const preferredTags = [
      'us-gaap:NetIncomeLoss',
      'us-gaap:OperatingIncomeLoss',
      'us-gaap:Revenues',
      'us-gaap:CashAndCashEquivalentsAtCarryingValue'
    ];
    const seen = new Set();
    const out = [];
    const gatherFromEl = (el) => {
      const ctxId = el.getAttribute('contextref') || el.getAttribute('contextRef');
      if (!ctxId || seen.has(ctxId)) return;
      seen.add(ctxId);
      const ctxEl = doc.getElementById(ctxId);
      if (!ctxEl) return;
      const endNode =
        ctxEl.querySelector('xbrli\\:period xbrli\\:endDate') ||
        ctxEl.querySelector('period enddate');
      const startNode =
        ctxEl.querySelector('xbrli\\:period xbrli\\:startDate') ||
        ctxEl.querySelector('period startdate');
      if (!endNode || !startNode) return; // skip instants
      const endISO = (endNode.textContent || '').trim();
      const startISO = (startNode.textContent || '').trim();
      if (endISO === desiredEndISO) out.push({ startISO, endISO });
    };
    for (const tag of preferredTags) {
      const els = Array.from(doc.querySelectorAll(`[name="${tag}"]`))
        .filter(e => e.getAttribute('xsi:nil') !== 'true');
      for (const el of els) gatherFromEl(el);
    }
    return out;
  }

  function daysInclusive(startISO, endISO) {
    const s = new Date(startISO + 'T00:00:00Z');
    const e = new Date(endISO + 'T00:00:00Z');
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0;
    const MS = 86400000;
    return Math.round((e - s) / MS) + 1;
  }

  // Strict calendar-month detection → 3|6|9|12 or null
  function diffMonthsInclusive(startISO, endISO) {
    if (!startISO || !endISO) return null;
    const [ys, ms, ds] = startISO.split('-').map(Number);
    const [ye, me, de] = endISO.split('-').map(Number);
    if (!ys || !ms || !ds || !ye || !me || !de) return null;
    if (ds !== 1) return null;
    const lastDayEnd = daysInMonthUTC(ye, me);
    if (de !== lastDayEnd) return null;
    const months = (ye - ys) * 12 + (me - ms) + 1;
    return [3, 6, 9, 12].includes(months) ? months : null;
  }

  function daysInMonthUTC(year, month1to12) {
    return new Date(Date.UTC(year, month1to12, 0)).getUTCDate();
  }

  function extractEndDateFromProse(rawText) {
    const txt = String(rawText).toLowerCase();
    const re = /\b(?:three|six|nine|twelve|3|6|9|12)\s+months\s+ended\s+([a-z]+ \d{1,2},\s+\d{4})/g;
    let match, candidates = [];
    while ((match = re.exec(txt)) !== null) candidates.push(match[1]);
    if (!candidates.length) return null;

    const toISO = (s) => {
      const m = s.match(/([a-z]+)\s+(\d{1,2}),\s+(\d{4})/i);
      if (!m) return null;
      const months = {
        january:1,february:2,march:3,april:4,may:5,june:6,
        july:7,august:8,september:9,october:10,november:11,december:12
      };
      const mm = months[m[1].toLowerCase()];
      if (!mm) return null;
      return `${m[3]}-${String(mm).padStart(2,'0')}-${String(Number(m[2])).padStart(2,'0')}`;
    };
    let best = candidates[0], bestISO = toISO(candidates[0]);
    for (let i = 1; i < candidates.length; i++) {
      const iso = toISO(candidates[i]);
      if (iso && (!bestISO || iso > bestISO)) { best = candidates[i]; bestISO = iso; }
    }
    return best.charAt(0).toUpperCase() + best.slice(1);
  }

  function getPeriodEndDatePreferred(doc) {
    const node = Array.from(doc.querySelectorAll('[name="dei:DocumentPeriodEndDate"]'))
      .find(el => el.getAttribute('xsi:nil') !== 'true' && !isInlineHidden(el));
    if (node) {
      const text = (node.textContent || '').trim();
      const iso = toISOFromHumanDate(text);
      return iso || text;
    }
    const preferredTags = [
      'us-gaap:NetIncomeLoss',
      'us-gaap:OperatingIncomeLoss',
      'us-gaap:Revenues',
      'us-gaap:CashAndCashEquivalentsAtCarryingValue'
    ];
    const tryGet = (tag) => {
      const el = Array.from(doc.querySelectorAll(`[name="${tag}"]`))
        .find(e => e.getAttribute('xsi:nil') !== 'true');
      if (!el) return null;
      const ctx = el.getAttribute('contextref') || el.getAttribute('contextRef');
      if (!ctx) return null;
      const ctxEl = doc.getElementById(ctx);
      if (!ctxEl) return null;
      const endNode =
        ctxEl.querySelector('xbrli\\:period xbrli\\:endDate') ||
        ctxEl.querySelector('xbrli\\:instant') ||
        ctxEl.querySelector('period enddate, instant');
      if (!endNode) return null;
      const iso = (endNode.textContent || '').trim();
      return /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso : null;
    };
    for (const t of preferredTags) {
      const iso = tryGet(t);
      if (iso) return iso;
    }
    return null;
  }

  function toISOFromHumanDate(human) {
    if (!human) return null;
    const m = human.match(/^\s*([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})\s*$/);
    if (!m) return null;
    const [, mon, dStr, yStr] = m;
    const months = {
      january:1,february:2,march:3,april:4,may:5,june:6,
      july:7,august:8,september:9,october:10,november:11,december:12
    };
    const mm = months[mon.toLowerCase()];
    if (!mm) return null;
    const dd = String(Number(dStr)).padStart(2, '0');
    const mo = String(mm).padStart(2, '0');
    return `${yStr}-${mo}-${dd}`;
  }

  function spellOut369Keep12(n) {
    if (n === '3') return 'three';
    if (n === '6') return 'six';
    if (n === '9') return 'nine';
    if (n === '12') return '12';
    return n;
  }
  function hyphenNumberForSentence(n) {
    if (n === '[period]') return null;
    return spellOut369Keep12(n);
  }

  function selectBestFactForTag(doc, tag, opts = {}) {
    const { desiredEndISO, desiredMonths, strictEndISOAll } = opts;
    const els = Array.from(doc.querySelectorAll(`[name="${tag}"]`))
      .filter(e => e.getAttribute('xsi:nil') !== 'true');
    if (!els.length) return null;

    const candidates = [];
    for (const el of els) {
      const c = buildFactCandidate(doc, el);
      if (c) candidates.push(c);
    }
    if (!candidates.length) return null;

    let filtered = candidates.slice();
    if (desiredEndISO) {
      const exact = candidates.filter(c => c.endISO === desiredEndISO);
      if (strictEndISOAll) {
        if (!exact.length) return null;
        filtered = exact;
      } else {
        filtered = exact.length ? exact : candidates;
      }
    }

    if (desiredMonths) {
      const durationCandidates = filtered.filter(c => c.months != null);
      if (durationCandidates.length) {
        const byMonths = durationCandidates.filter(c => c.months === desiredMonths);
        if (byMonths.length) filtered = byMonths;
      }
    }

    const minSegments = Math.min(...filtered.map(c => c.segmentCount));
    filtered = filtered.filter(c => c.segmentCount === minSegments);

    filtered.sort((a, b) => Math.abs(b.num) - Math.abs(a.num));
    return filtered[0] || null;
  }

  function buildFactCandidate(doc, el) {
    const ctxId = el.getAttribute('contextref') || el.getAttribute('contextRef');
    if (!ctxId) return null;
    const ctxEl = doc.getElementById(ctxId);
    if (!ctxEl) return null;

    const endNode =
      ctxEl.querySelector('xbrli\\:period xbrli\\:endDate') ||
      ctxEl.querySelector('period enddate') ||
      ctxEl.querySelector('xbrli\\:instant') ||
      ctxEl.querySelector('instant');
    if (!endNode) return null;
    const endISO = (endNode.textContent || '').trim();

    const startNode =
      ctxEl.querySelector('xbrli\\:period xbrli\\:startDate') ||
      ctxEl.querySelector('period startdate');
    const startISO = startNode ? (startNode.textContent || '').trim() : null;

    const months = diffMonthsInclusive(startISO, endISO);
    const segmentCount = ctxEl.querySelectorAll('xbrli\\:entity xbrli\\:segment xbrldi\\:explicitMember').length;
    const num = parseIXNumber(el);
    return { num, ctxId, endISO, months, segmentCount };
  }

  function parseIXNumber(el) {
    const signAttr = el.getAttribute('sign');
    const scaleAttr = el.getAttribute('scale');
    const scale = Number(scaleAttr ?? '0');

    let raw = (el.textContent || '')
      .trim()
      .replace(/\u00A0/g, ' ')
      .replace(/,/g, '');

    if (!/^-?\d+(\.\d+)?$/.test(raw)) {
      const t = raw.toLowerCase().trim();
      if (t === 'no' || t === 'none' || t === 'zero' || t === 'nil' || t === '–' || t === '—' || t === '-') {
        raw = '0';
      }
    }

    let negativeByParens = false;
    if (/^\(.*\)$/.test(raw)) {
      negativeByParens = true;
      raw = raw.replace(/^\(|\)$/g, '');
    }

    let num = Number(raw);
    if (Number.isNaN(num)) return NaN;

    if (signAttr === '-') num = -Math.abs(num);
    if (negativeByParens) num = -Math.abs(num);
    if (!Number.isNaN(num) && Number.isFinite(scale) && scale) num = num * (10 ** scale);
    return num;
  }

  function formatNumber(num, label) {
    const abs = Math.abs(num);
    let formatted;
    if (abs >= 1e9) formatted = `${(abs / 1e9).toFixed(1)} billion`;
    else if (abs >= 1e6) formatted = `${(abs / 1e6).toFixed(1)} million`;
    else formatted = `${Math.round(abs).toLocaleString()}`;
    const negLabels = ['Accumulated deficit', 'Accumulated comprehensive deficit', 'Operating Loss', 'Net Loss'];
    return num < 0 && !negLabels.includes(label) ? `-$${formatted}` : `$${formatted}`;
  }

  function formatExactCurrency(num, label) {
    if (Number.isNaN(num)) return 'Not available';
    const whole = Math.round(Math.abs(num)).toLocaleString();
    const negLabels = ['Accumulated deficit', 'Accumulated comprehensive deficit', 'Operating Loss', 'Net Loss'];
    return (num < 0 && !negLabels.includes(label)) ? `-$${whole}` : `$${whole}`;
  }

  function buildFinancialTable(factsMap, tagMap) {
    const col1 = [
      'Cash and cash equivalents',
      'Cash, cash equivalents, and restricted cash',
      'Cash',
      'Cash equivalents',
      'Restricted cash',
      'Current restricted cash',
      'Investments at fair value',
      'Total assets',
      'Total current liabilities',
      'Accumulated deficit',
      'Accumulated comprehensive deficit'
    ];
    const col2 = [
      'Revenues',
      'Revenue including assessed tax',
      'Revenue excluding assessed tax',
      'Total investment income',
      'Operating Loss',
      'Net Loss'
    ];
    const col3 = [
      'Cash flows from operating activities',
      'Cash flows from investing activities',
      'Net cash flow (including exchange rate effect)',
      'Net cash flow (excluding exchange rate effect)'
    ];
    const colorLabels = new Set([
      'Accumulated deficit',
      'Accumulated comprehensive deficit',
      'Operating Loss',
      'Net Loss',
      'Cash flows from operating activities',
      'Cash flows from investing activities',
      'Net cash flow (including exchange rate effect)',
      'Net cash flow (excluding exchange rate effect)'
    ]);

    const renderList = (labels) =>
      `<div class="cell-list">${
        labels.map(lbl => {
          const f = factsMap[lbl];
          const tag = tagMap[lbl];
          const labelHtml = f
            ? `<b title="${escapeHtml(tag)}">${escapeHtml(f.displayLabel)}:</b>`
            : `<b title="${escapeHtml(tag)}">${escapeHtml(lbl)}:</b>`;
          let abbr = 'Not found', exact = 'Not found', cssClass = '';
          if (f) {
            abbr = f.formatted;
            exact = formatExactCurrency(f.num, lbl);
            if (!Number.isNaN(f.num) && colorLabels.has(lbl)) {
              cssClass = (f.num < 0) ? 'neg' : (f.num > 0 ? 'pos' : '');
            }
          } else {
            cssClass = 'not-found';
          }
          return `<div>${labelHtml} <span class="value-abbr ${cssClass}">${abbr}</span><span class="value-exact ${cssClass}">${exact}</span></div>`;
        }).join('')
      }</div>`;

    return `
<table class="financial-grid">
  <thead>
    <tr>
      <th>Balance Sheet</th>
      <th>Operations</th>
      <th>Cash Flows</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${renderList(col1)}</td>
      <td>${renderList(col2)}</td>
      <td>${renderList(col3)}</td>
    </tr>
  </tbody>
</table>
`;
  }

  function textWithoutHiddenAndIXBRL(root) {
    const IX_NS = 'http://www.xbrl.org/2013/inlineXBRL';
    const walker = root.ownerDocument.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          for (let n = node.parentNode; n && n !== root; n = n.parentNode) {
            if (n.nodeType !== 1) continue;
            if (n.namespaceURI === IX_NS) return NodeFilter.FILTER_REJECT;
            if (n.style && n.style.display === 'none') return NodeFilter.FILTER_REJECT;
            if (n.hasAttribute && n.hasAttribute('hidden')) return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    let out = '';
    for (let t = walker.nextNode(); t; t = walker.nextNode()) out += t.nodeValue;
    return out.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function isInlineHidden(el) {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      if (n.hasAttribute && n.hasAttribute('hidden')) return true;
      const style = n.getAttribute && n.getAttribute('style');
      if (style && /display\s*:\s*none/i.test(style)) return true;
    }
    return false;
  }

  function formatISODate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return iso;
    const monthMap = {
      1: 'Jan.', 2: 'Feb.', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
      7: 'July', 8: 'Aug.', 9: 'Sept.', 10: 'Oct.', 11: 'Nov.', 12: 'Dec.'
    };
    const mm = monthMap[m] || String(m);
    return `${mm} ${d}, ${y}`;
  }

  function formatDate(dateStr) {
    const [month, day, year] = String(dateStr).split(/[,\s]+/);
    const monthMap = {
      january: 'Jan.', february: 'Feb.', march: 'March', april: 'April', may: 'May',
      june: 'June', july: 'July', august: 'Aug.', september: 'Sept.', october: 'Oct.',
      november: 'Nov.', december: 'Dec.'
    };
    const formattedMonth = monthMap[month?.toLowerCase?.()] ?? capitalize(month);
    return `${formattedMonth} ${day}, ${year}`;
  }

  function capitalize(word) {
    return word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase();
  }

  function escapeHtml(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
