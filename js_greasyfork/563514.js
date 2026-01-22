// ==UserScript==
// @name         FMP Player Bloom/Status/Potential Cache
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.4.1.1
// @description  Cache player Bloom/Status/Potential (from most recent DEV≥threshold scout report; correct status via report age→current age); show styled columns on Team Players.
// @author       Haydar (ClubID = 5695)
// @match        https://footballmanagerproject.com/Team/Players
// @match        https://footballmanagerproject.com/Team/Player?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=footballmanagerproject.com
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563514/FMP%20Player%20BloomStatusPotential%20Cache.user.js
// @updateURL https://update.greasyfork.org/scripts/563514/FMP%20Player%20BloomStatusPotential%20Cache.meta.js
// ==/UserScript==

/* global $ */

(function () {
  "use strict";

  const MIN_DEV = 22;

  GM_addStyle(`
    /* --- Compact 2-line widget (Player page) --- */
    #fmp-cache-box.fmp-cache-box{
      margin: 6px 0 10px 0;
      padding: 6px 10px;
      border-radius: 10px;
      border: 1px solid rgba(0,0,0,.12);
      background: rgba(255,255,255,.85);
      backdrop-filter: blur(4px);
      font: 12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      color: #111;
    }
    #fmp-cache-box .line1{
      display:flex;
      align-items:center;
      gap: 10px;
      flex-wrap: wrap;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #fmp-cache-box .tag{
      font-weight:700;
      padding: 1px 8px;
      border-radius: 999px;
      border: 1px solid rgba(0,0,0,.10);
      background: rgba(0,0,0,.04);
    }
    #fmp-cache-box .ok{ color:#0a7a1f; font-weight:700; }
    #fmp-cache-box .bad{ color:#a10d0d; font-weight:700; }
    #fmp-cache-box .muted{ color:#666; font-weight:500; }
    #fmp-cache-box .sep{ color:#999; }

    #fmp-cache-box .line2{
      margin-top: 6px;
      display:flex;
      gap: 8px;
      align-items:center;
    }
    #fmp-cache-box button{
      border:0; border-radius:10px; padding:6px 10px;
      background:#2a2a2a; color:#eee; cursor:pointer;
    }
    #fmp-cache-box button:hover{ filter: brightness(1.08); }
    #fmp-cache-box button.danger{ background:#3a2222; }

    /* --- "Same style" pills used in Players list columns --- */
    .fmp-pill{
      display:inline-block;
      padding: 2px 8px;
      border-radius: 999px;
      border: 1px solid rgba(0,0,0,.12);
      background: rgba(255,255,255,.85);
      backdrop-filter: blur(4px);
      font: 12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      color:#111;
      white-space:nowrap;
    }
    .fmp-pill.muted{
      color:#777;
      background: rgba(255,255,255,.65);
      border-color: rgba(0,0,0,.10);
      font-weight:500;
    }
    .fmp-pill.good{ color:#0a7a1f; font-weight:700; }
    .fmp-pill.bad{ color:#a10d0d; font-weight:700; }
    .fmp-pill.head{
      font-weight:700;
      background: rgba(255,255,255,.92);
    }

    th.fmp-bloomcol, td.fmp-bloomcol{
      text-align:center !important;
      white-space:nowrap;
      min-width: 72px;
      padding: 6px 6px !important;
      vertical-align: middle !important;
    }
  `);

  // ---- Helpers ----
  function isPlayerPage() {
    return location.pathname.toLowerCase().includes("/team/player");
  }
  function isPlayersPage() {
    return location.pathname.toLowerCase().includes("/team/players");
  }

  function getPlayerIdFromUrl(urlStr) {
    try {
      const u = new URL(urlStr, location.origin);
      const id = u.searchParams.get("id");
      return id && /^\d+$/.test(id) ? id : null;
    } catch {
      return null;
    }
  }

  function storageKey(playerId) {
    return `fmp_player_bloom_${playerId}`;
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function safeJsonParse(s) {
    try { return JSON.parse(s); } catch { return null; }
  }

  function formatWhen(ts) {
    if (!ts) return "unknown";
    try {
      const d = new Date(ts);
      if (Number.isNaN(d.getTime())) return "unknown";
      return d.toLocaleString();
    } catch {
      return "unknown";
    }
  }

  function normalizeName(s) {
    return (s || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }

  function parseNumWithDecimal($numSpan) {
    if (!$numSpan || !$numSpan.length) return NaN;

    const intPart = $numSpan.contents().filter(function () {
      return this.nodeType === 3;
    }).text().trim();

    const decPart = $numSpan.find("span.decimal").first().text().trim();
    if (!intPart) return NaN;

    const s = (intPart + (decPart ? ("." + decPart) : "")).replace(",", ".");
    const v = parseFloat(s);
    return Number.isFinite(v) ? v : NaN;
  }

  function extractLabelValue($row, label) {
    const re = new RegExp("^\\s*" + label + "\\s*:\\s*", "i");
    const $span = $row.find("span").filter(function () {
      return re.test($(this).text().trim());
    }).first();
    if (!$span.length) return null;
    return $span.text().trim().replace(re, "").trim();
  }

  function extractISODate($row) {
    const $d = $row.find("div").filter(function () {
      return /^\s*Date:\s*\d{4}-\d{2}-\d{2}\s*$/.test($(this).text().trim());
    }).first();
    if (!$d.length) return null;
    const m = $d.text().trim().match(/Date:\s*(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : null;
  }

  function readCached(playerId) {
    const raw = GM_getValue(storageKey(playerId), "");
    if (!raw) return null;
    return safeJsonParse(raw);
  }

  function writeCached(playerId, data) {
    GM_setValue(storageKey(playerId), JSON.stringify(data));
  }

  function clearCached(playerId) {
    GM_deleteValue(storageKey(playerId));
  }

  async function waitForSelectors(selectors, timeoutMs = 20000, intervalMs = 350) {
    const start = Date.now();
    return new Promise((resolve) => {
      const t = setInterval(() => {
        const ok = selectors.every((sel) => document.querySelector(sel));
        if (ok) { clearInterval(t); resolve(true); return; }
        if (Date.now() - start > timeoutMs) { clearInterval(t); resolve(false); }
      }, intervalMs);
    });
  }


  // ---- Auto-load "All Reports" (AJAX) and run caching once ----
  const __FMP_AUTO_DONE = "__fmp_auto_done_v1411";

  function __fmpAutoDoneMap() {
    if (!window[__FMP_AUTO_DONE]) window[__FMP_AUTO_DONE] = {};
    return window[__FMP_AUTO_DONE];
  }

  function hasAutoRun(playerId) {
    const m = __fmpAutoDoneMap();
    return !!m[playerId];
  }

  function markAutoRun(playerId) {
    const m = __fmpAutoDoneMap();
    m[playerId] = true;
  }

  function findAllReportsButton() {
    const $btns = $("span.team-selector.trxbtn.type[bid='Details']");
    if (!$btns.length) return $();
    const $named = $btns.filter(function () {
      return ($(this).text() || "").trim().toLowerCase() === "all reports";
    });
    return ($named.length ? $named : $btns).first();
  }

  function reportsDetailsLoaded() {
    const $rt = $("#reportsTable");
    if (!$rt.length) return false;

    // Need the detailed report rows (with Date) for correct "most recent" logic.
    const hasDate = $rt.find("div").filter(function () {
      return /^\s*Date:\s*\d{4}-\d{2}-\d{2}\s*$/.test(($(this).text() || "").trim());
    }).length > 0;

    const hasStatus = $rt.find("span").filter(function () {
      return /^\s*Status\s*:/.test(($(this).text() || "").trim());
    }).length > 0;

    return hasDate && hasStatus;
  }

  async function waitForCondition(fn, timeoutMs = 25000, intervalMs = 350) {
    const start = Date.now();
    while (Date.now() - start <= timeoutMs) {
      try {
        if (fn()) return true;
      } catch (e) { /* ignore */ }
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    return false;
  }

  async function autoClickAllReportsAndRefresh(playerId) {
    if (!playerId) return;
    if (hasAutoRun(playerId)) return;
    markAutoRun(playerId);

    // If details are already loaded, just refresh once.
    if (reportsDetailsLoaded()) {
      $("#fmp-cache-refresh").trigger("click");
      return;
    }

    const $btn = findAllReportsButton();

    // Click only if it looks "off" (prevents toggling/closing if already active).
    if ($btn.length && $btn.hasClass("off")) {
      $btn.trigger("click");
    }

    // Wait until AJAX-loaded details appear, then run the existing refresh+save logic.
    const ok = await waitForCondition(reportsDetailsLoaded, 25000, 350);
    if (ok) $("#fmp-cache-refresh").trigger("click");
  }

  // ---- Age parsing (player page) ----
  function pad2(n) {
    const s = String(Math.max(0, n | 0));
    return s.length >= 2 ? s : ("0" + s);
  }

  function formatAgeText(year, month) {
    if (!Number.isFinite(year) || !Number.isFinite(month)) return null;
    month = Math.max(0, Math.min(11, month | 0));
    return `${year}.${pad2(month)}`;
  }

  function parseYearMonth(str) {
    const s = String(str || "").trim();
    const m = s.match(/(\d+)(?:\s*\.\s*(\d+))?/);
    if (!m) return null;
    const year = parseInt(m[1], 10);
    const month = m[2] != null ? parseInt(m[2], 10) : 0;
    if (!Number.isFinite(year) || !Number.isFinite(month)) return null;
    const mm = Math.max(0, Math.min(11, month));
    return {
      year,
      month: mm,
      totalMonths: year * 12 + mm,
      text: formatAgeText(year, mm)
    };
  }

  function readCurrentAgeFromPage() {
    const y = parseInt($("span.age_year").first().text().trim(), 10);
    const mTxt = $("span.age_month").first().text().trim(); // like ".02"
    const m = parseInt(mTxt.replace(".", "").trim(), 10);
    if (!Number.isFinite(y) || !Number.isFinite(m)) return null;

    const mm = Math.max(0, Math.min(11, m));
    return {
      year: y,
      month: mm,
      totalMonths: y * 12 + mm,
      text: formatAgeText(y, mm)
    };
  }


  function readAgeFromReportRow($row) {
    if (!$row || !$row.length) return null;

    // Typical structure: <div>Age: <span class="age_year">18</span><span class="age_month">.05</span></div>
    const y = parseInt($row.find("span.age_year").first().text().trim(), 10);
    const mTxt = $row.find("span.age_month").first().text().trim(); // like ".02"
    const m = parseInt(String(mTxt || "").replace(".", "").trim(), 10);

    if (Number.isFinite(y) && Number.isFinite(m)) {
      const mm = Math.max(0, Math.min(11, m));
      return { year: y, month: mm, totalMonths: y * 12 + mm, text: formatAgeText(y, mm) };
    }

    // Fallback: parse the div text "Age: 18.05"
    const $d = $row.find("div").filter(function () {
      return /^\s*Age\s*:/.test($(this).text().trim());
    }).first();

    if ($d.length) {
      const mt = $d.text().trim().match(/Age\s*:\s*(\d+)\s*\.\s*(\d+)/);
      if (mt) {
        const yy = parseInt(mt[1], 10);
        const mm2 = parseInt(mt[2], 10);
        if (Number.isFinite(yy) && Number.isFinite(mm2)) {
          const mm = Math.max(0, Math.min(11, mm2));
          return { year: yy, month: mm, totalMonths: yy * 12 + mm, text: formatAgeText(yy, mm) };
        }
      }
    }

    return null;
  }

  // Advance a scout-reported bloom "Status" (Y1/Y2/Y3/Bloomed) using the age delta since the report.
  // Important: we intentionally DO NOT use "Bloom: Normal (17+)" as a start age. It's vague.
  function computeRealStatusFromReport(currentAgeObj, reportAgeObj, reportedStatus) {
    const cur = currentAgeObj && Number.isFinite(currentAgeObj.totalMonths) ? currentAgeObj : null;
    const rep = reportAgeObj && Number.isFinite(reportAgeObj.totalMonths) ? reportAgeObj : null;
    const st = String(reportedStatus || "").trim();

    if (!cur || !rep || !st) return null;

    const lc = st.toLowerCase();
    if (lc === "not bloomed" || lc === "not reported") return null;
    if (lc === "bloomed") return "Bloomed";

    const order = ["1st year", "2nd year", "3rd year", "Bloomed"];
    const idx = order.findIndex((x) => x.toLowerCase() === lc);
    if (idx < 0) return null;

    const deltaMonths = Math.max(0, cur.totalMonths - rep.totalMonths);

    // "Near enough" year progression: if ~10+ months passed, we bump one year (matches real-world use better than strict floor()).
    const yearsPassed = Math.floor((deltaMonths + 6) / 12);

    const newIdx = Math.min(order.length - 1, idx + yearsPassed);
    return order[newIdx];
  }

  // Bloom lasts 36 months total: start..(start+35) inclusive
  function computeBloomStateFromCurrentAge(currentAgeObj, bloomStartStr) {
    const cur = currentAgeObj && Number.isFinite(currentAgeObj.totalMonths) ? currentAgeObj : null;
    const start = parseYearMonth(bloomStartStr);
    if (!cur || !start) return null;

    const diff = cur.totalMonths - start.totalMonths;
    const endMonths = start.totalMonths + 35;

    let state;
    if (diff < 0) state = "Not bloomed";
    else if (diff <= 11) state = "1st year";
    else if (diff <= 23) state = "2nd year";
    else if (diff <= 35) state = "3rd year";
    else state = "Bloomed";

    const endYear = Math.floor(endMonths / 12);
    const endMonth = endMonths % 12;

    return {
      state,
      startText: start.text || bloomStartStr || null,
      endText: formatAgeText(endYear, endMonth),
      diffMonths: diff
    };
  }

  function stateShort(state) {
    switch ((state || "").toLowerCase()) {
      case "not bloomed": return "NB";
      case "1st year": return "Y1";
      case "2nd year": return "Y2";
      case "3rd year": return "Y3";
      case "bloomed": return "B";
      default: return String(state || "_");
    }
  }

  function statePillClass(state) {
    const s = (state || "").toLowerCase();
    if (s === "not bloomed") return "bad";
    if (s === "bloomed") return "good";
    if (s.includes("year")) return "good";
    return "";
  }

  // ---- Extract Summary Potential ----
  function extractSummaryPotential($reportsTable) {
    const $summaryRow = $reportsTable
      .find("table.rectable tr")
      .filter(function () {
        return normalizeName($(this).children("th").first().text()) === "Summary";
      })
      .first();

    if (!$summaryRow.length) return { potential: null, potentialMax: null, potentialText: null };

    const rec = $summaryRow.find("div.rec").first().text().trim();
    const denomRaw = $summaryRow.children("td").first().find("div").eq(1).text().trim(); // "/25"
    const max = denomRaw ? parseInt(denomRaw.replace(/[^\d]/g, ""), 10) : null;

    if (!rec) return { potential: null, potentialMax: max || null, potentialText: null };

    const text = max ? `${rec}/${max}` : rec;
    return { potential: rec, potentialMax: max || null, potentialText: text };
  }

  // ---- Core extraction: used scouts -> highest DEV (>= MIN_DEV) -> most recent report -> bloom/status ----
  function computeBloomStatusPotentialByHighestDevUsedScout(root, minDev) {
    const $root = root ? $(root) : $(document);
    const $reports = $root.find("#reportsTable");
    const $scouts = $root.find("#ScoutsList");

    if (!$reports.length || !$scouts.length) {
      return { error: "Missing #reportsTable or #ScoutsList (page not ready or selectors changed)." };
    }

    const pot = extractSummaryPotential($reports);

    const $detailTable = $reports.find("table.rectable").filter(function () {
      return $(this).find("span").filter(function () {
        return /^\s*Status\s*:/.test($(this).text().trim());
      }).length > 0;
    }).first();

    if (!$detailTable.length) {
      return { error: "Per-scout report table not found (no Status: rows).", ...pot };
    }

    const usedSet = Object.create(null);
    const usedNames = [];

    $detailTable.find("tr").each(function () {
      const $tr = $(this);
      const name = normalizeName($tr.children("th").first().text());
      if (!name) return;

      const hasBloomOrStatus = $tr.find("span").filter(function () {
        const t = $(this).text().trim();
        return /^Bloom\s*:/.test(t) || /^Status\s*:/.test(t);
      }).length > 0;

      if (!hasBloomOrStatus) return;

      if (!usedSet[name]) {
        usedSet[name] = true;
        usedNames.push(name);
      }
    });

    if (!usedNames.length) {
      return { error: "No used scouts detected in report rows.", ...pot };
    }

    const devByName = Object.create(null);

    $scouts.find("tr").each(function () {
      const $tr = $(this);
      const name = normalizeName($tr.find("td.td-header").first().text());
      if (!name) return;

      const $valsRow = $tr.find("table.skilltable tr").eq(1);
      if (!$valsRow.length) return;

      const $devCell = $valsRow.find("td").eq(2);
      const dev = parseNumWithDecimal($devCell.find("span.num").first());
      if (!Number.isFinite(dev)) return;

      devByName[name] = dev;
    });

    let bestName = null;
    let bestDev = -Infinity;
    let bestRow = null;
    let bestTime = -Infinity;
    let bestDateStr = null;

    usedNames.forEach((n) => {
      const d = devByName[n];
      if (!Number.isFinite(d)) return;
      if (d < minDev) return;

      const $rows = $detailTable.find("tr").filter(function () {
        return normalizeName($(this).children("th").first().text()) === n;
      });

      $rows.each(function () {
        const $r = $(this);
        const ds = extractISODate($r);
        const t = ds ? Date.parse(ds + "T00:00:00Z") : -Infinity;

        // Primary: most recent report. Tie-break: higher DEV.
        if (t > bestTime || (t === bestTime && d > bestDev)) {
          bestTime = t;
          bestRow = $r;
          bestDateStr = ds;
          bestName = n;
          bestDev = d;
        }
      });

      // Fallback: if nothing has a date, still pick a row from any qualified scout.
      if (!bestRow && $rows.length && bestTime === -Infinity) {
        bestRow = $rows.first();
        bestName = n;
        bestDev = d;
        bestDateStr = extractISODate(bestRow) || null;
      }
    });

    if (!bestName) {
      return {
        error: `No used scout meets DEV ≥ ${minDev}.`,
        usedScouts: usedNames,
        devByName,
        ...pot
      };
    }


    return {
      topDevScout: bestName,
      topDev: bestDev,
      reportDate: bestDateStr,
      reportAge: bestRow ? readAgeFromReportRow(bestRow) : null,
      bloom: bestRow ? extractLabelValue(bestRow, "Bloom") : null,
      status: bestRow ? extractLabelValue(bestRow, "Status") : null,
      usedScouts: usedNames,
      ...pot
    };
  }

  // ---- Player page widget: FIRST element in #ScoutsBoard, 2 lines max ----
  function ensureInlineBox() {
    let $box = $("#fmp-cache-box");
    if ($box.length) return $box;

    $box = $("<div id='fmp-cache-box' class='fmp-cache-box'></div>");

    const $board = $("#ScoutsBoard").first();
    if ($board.length) $board.prepend($box);
    else $("body").prepend($box);

    return $box;
  }

  function renderInlineBox($box, playerId, cached, liveMsg) {
    const cachedOk = !!cached;

    const statusPill = cachedOk
      ? `<span class="ok">Cached</span>`
      : `<span class="bad">Not cached</span>`;

    const savedText = cachedOk
      ? `<span class="muted">Saved ${formatWhen(cached.savedAt)}</span>`
      : `<span class="muted">Press Refresh & Save</span>`;

    const quick = cachedOk
      ? `<span class="sep">|</span>
         <span class="muted">Pot:</span> <b>${cached.potentialText || cached.potential || "?"}</b>
         <span class="sep">|</span>
         <span class="muted">State:</span> <b>${cached.bloomState || cached.status || "?"}</b>`
      : `<span class="sep">|</span><span class="muted">Rule: DEV ≥ ${MIN_DEV}</span>`;

    const msg = liveMsg
      ? `<span class="sep">|</span><span class="muted">${liveMsg}</span>`
      : "";

    const tooltip = cachedOk
      ? `BloomStart=${cached.bloom || "?"} | BloomEnd=${cached.bloomEnd || "?"} | ReportAge=${cached.reportAge || "?"} | PlayerAge=${cached.playerAge || "?"} | Latest=${cached.topDevScout || "?"} (DEV ${cached.topDev ?? "?"})`
      : "";

    $box.html(`
      <div class="line1" title="${tooltip}">
        <span class="tag">Cache</span>
        ${statusPill}
        <span class="sep">|</span>
        <span class="muted">ID:</span> <b>${playerId}</b>
        <span class="sep">|</span>
        ${savedText}
        ${quick}
        ${msg}
      </div>
      <div class="line2">
        <button id="fmp-cache-refresh">Refresh & Save</button>
        <button id="fmp-cache-clear" class="danger">Clear</button>
      </div>
    `);
  }

  async function setupPlayerPage() {
    const playerId = getPlayerIdFromUrl(location.href);
    if (!playerId) return;

    await waitForSelectors(["#ScoutsBoard"], 25000, 350);

    const $box = ensureInlineBox();
    let cached = readCached(playerId);
    renderInlineBox($box, playerId, cached, "");

    $(document).off("click.fmp", "#fmp-cache-refresh");
    $(document).off("click.fmp", "#fmp-cache-clear");

    $(document).on("click.fmp", "#fmp-cache-refresh", async function () {
      cached = readCached(playerId);
      renderInlineBox($box, playerId, cached, "Scanning…");

      const ready = await waitForSelectors(["#reportsTable", "#ScoutsList"], 25000, 350);
      if (!ready) {
        renderInlineBox($box, playerId, cached, "Timeout waiting sections.");
        return;
      }

      const live = computeBloomStatusPotentialByHighestDevUsedScout(document, MIN_DEV);

      if (!live || live.error) {
        renderInlineBox($box, playerId, cached, `No save: ${live?.error || "Error"}`);
        console.warn("[FMP] Refresh failed:", live);
        return;
      }

      // Real status correction:
      // - "Bloom: Normal (17+)" is vague (could start at 17, 18, etc.)
      // - "Status: 2nd year" is concrete for *that report moment*
      // So we advance the reported Status by the age delta since the report.
      const currentAge = readCurrentAgeFromPage(); // player's current age now
      const reportAge = live.reportAge || null; // player's age at report time (from the same report row)

      // Keep bloom end as a best-effort estimate from the (vague) bloom start label, but DO NOT use it for status.
      const bloomStateInfo = computeBloomStateFromCurrentAge(currentAge, live.bloom);
      const bloomEnd = bloomStateInfo ? bloomStateInfo.endText : null;

      const correctedStatus = computeRealStatusFromReport(currentAge, reportAge, live.status);
      const effectiveState = correctedStatus || (live.status || null);

      const toStore = {
        playerId,
        bloom: live.bloom, // bloom start age (as reported)
        status: live.status, // scout-reported status (can be stale)
        bloomState: effectiveState, // REAL computed state using current age
        bloomEnd: bloomEnd, // computed end age (start + 35 months)
        playerAge: currentAge ? currentAge.text : null, // age at scan
        reportAge: reportAge ? reportAge.text : null, // age at report
        reportAgeMonths: reportAge ? reportAge.totalMonths : null,
        potential: live.potential,
        potentialMax: live.potentialMax,
        potentialText: live.potentialText,
        topDevScout: live.topDevScout,
        topDev: live.topDev,
        reportDate: live.reportDate,
        savedAt: nowISO(),
        source: `usedScouts->mostRecent(DEV≥${MIN_DEV}) + status-corrected from reportAge deltaa`
      };

      writeCached(playerId, toStore);
      cached = toStore;

      renderInlineBox($box, playerId, cached, "Saved.");
      console.log("[FMP] Saved:", toStore);
    });

    $(document).on("click.fmp", "#fmp-cache-clear", function () {
      clearCached(playerId);
      cached = null;
      renderInlineBox($box, playerId, cached, "Cleared.");
    });

    // Auto-open All Reports and run caching once on page load
    autoClickAllReportsAndRefresh(playerId);
}

  // ---- Players list: add 3 columns (Bloom, Status, Pot) per row (trow<ID>) ----
  function ensureListColumns($table) {
    const $headRow = $table.find("thead tr").first();
    if (!$headRow.length) return;

    if ($headRow.find("th[data-fmpcol='bloom']").length) return;

    const $setTh = $headRow.find('th[cid="set"]').first();

    const bloomTh = $('<th class="fmp-listcol fmp-bloomcol" data-fmpcol="bloom" title="Cached Bloom Start"><span class="fmp-pill head">Bloom</span></th>');
    const statusTh = $('<th class="fmp-listcol fmp-bloomcol" data-fmpcol="status" title="Cached Real Bloom State"><span class="fmp-pill head">Status</span></th>');
    const potTh = $('<th class="fmp-listcol fmp-bloomcol" data-fmpcol="pot" title="Cached Potential (Summary)"><span class="fmp-pill head">Pot</span></th>');

    if ($setTh.length) {
      $setTh.before(potTh).before(statusTh).before(bloomTh);
    } else {
      $headRow.append(bloomTh, statusTh, potTh);
    }
  }

  function ensureRowCells($tr) {
    if ($tr.find("td[data-fmpcell='bloom']").length) return;

    const bloomTd = $('<td class="fmp-bloomcol" data-fmpcell="bloom"><span class="fmp-pill muted">_</span></td>');
    const statusTd = $('<td class="fmp-bloomcol" data-fmpcell="status"><span class="fmp-pill muted">_</span></td>');
    const potTd = $('<td class="fmp-bloomcol" data-fmpcell="pot"><span class="fmp-pill muted">_</span></td>');

    const $tds = $tr.children("td");
    const $setTd = $tds.last();

    if ($setTd.length) {
      $setTd.before(potTd).before(statusTd).before(bloomTd);
    } else {
      $tr.append(bloomTd, statusTd, potTd);
    }
  }

  function fillRowFromCache($tr, playerId) {
    const cached = readCached(playerId);

    const $b = $tr.find("td[data-fmpcell='bloom']");
    const $s = $tr.find("td[data-fmpcell='status']");
    const $p = $tr.find("td[data-fmpcell='pot']");

    if (!cached) {
      $b.html('<span class="fmp-pill muted">_</span>');
      $s.html('<span class="fmp-pill muted">_</span>');
      $p.html('<span class="fmp-pill muted">_</span>');
      return;
    }

    const bloom = cached.bloom || "_";
    const realState = cached.bloomState || cached.status || "_";
    const potText = cached.potentialText || cached.potential || "_";

    const stateAbbr = stateShort(realState);
    const stateCls = statePillClass(realState);

    const tip = [
      `Saved ${formatWhen(cached.savedAt)}`,
      `Latest report: ${cached.topDevScout || "?"} (DEV ${cached.topDev ?? "?"})`,
      `Report ${cached.reportDate || "?"}`,
      `ReportAge ${cached.reportAge || "?"}`,
      `PlayerAge@Scan ${cached.playerAge || "?"}`,
      `BloomStart ${cached.bloom || "?"}`,
      `BloomEnd ${cached.bloomEnd || "?"}`,
      `State ${realState}`,
      `Pot ${potText}`
    ].join(" | ");

    $b.html(`<span class="fmp-pill" title="${tip}">${bloom}</span>`);
    $s.html(`<span class="fmp-pill ${stateCls}" title="${tip}">${stateAbbr}</span>`);
    $p.html(`<span class="fmp-pill" title="${tip}">${potText}</span>`);
  }

  function processPlayersTables(root) {
    const $root = root ? $(root) : $(document);

    $root.find("table.list-table.comp").each(function () {
      const $table = $(this);
      ensureListColumns($table);

      $table.find('tr[id^="trow"]').each(function () {
        const $tr = $(this);
        const m = ($tr.attr("id") || "").match(/^trow(\d+)$/);
        if (!m) return;

        const pid = m[1];
        ensureRowCells($tr);
        fillRowFromCache($tr, pid);
      });
    });
  }

  function setupPlayersPage() {
    processPlayersTables(document);

    let rafPending = false;
    const obs = new MutationObserver((mutations) => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        for (const m of mutations) {
          for (const n of m.addedNodes) {
            if (n.nodeType === 1) processPlayersTables(n);
          }
        }
      });
    });

    obs.observe(document.body, { childList: true, subtree: true });
  }

  // ---- Boot ----
  $(function () {
    if (isPlayerPage()) setupPlayerPage();
    if (isPlayersPage()) setupPlayersPage();
  });

})();
