// ==UserScript==
// @name         Torn Faction Organized Crime Metrics
// @namespace    https://torn.com/
// @version      1.0.6
// @description  Uses Torn API to list Organized Crime metrics for your faction.
// @author       Canixe [3753120]
// @match        https://www.torn.com/factions.php*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.registerMenuCommand
// @grant        GM_registerMenuCommand
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/549344/Torn%20Faction%20Organized%20Crime%20Metrics.user.js
// @updateURL https://update.greasyfork.org/scripts/549344/Torn%20Faction%20Organized%20Crime%20Metrics.meta.js
// ==/UserScript==

(() => {
  "use strict";

  ////////////////////////////////////////////////////////////////////////////
  // CONSTANTS
  ////////////////////////////////////////////////////////////////////////////
  const SECTION_ID  = "tf-oc-crime-metrics";
  const TITLE_TEXT  = "Faction OC Crime Metrics";
  const API_COMMENT = "TF-OC-Crime-Metrics";

  const REQUIRED_ACCESS = "Limited Access";

  const CRIMES_API  = "https://api.torn.com/v2/faction/crimes";
  const NEWS_API    = "https://api.torn.com/v2/faction/news";
  const ITEMS_API   = "https://api.torn.com/v2/torn/items";

  const API_PAGE_CAP = 100;
  const FIG          = "\u2007";

  const ITEM_INFO_CACHE_KEY    = `${SECTION_ID}:items_cache_v1.1`;
  const ITEM_INFO_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
  let   ITEM_INFO = null;

  const ICONS = {
    play: '<svg class="tf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 3 14 9-14 9z"/></svg>',
    stop: '<svg class="tf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  };
  const CLS = { caretFill: "grayFill___tkuer" };
  const OPEN_SVG     = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" viewBox="0 0 11 16" class="${CLS.caretFill}"><path d="M1302,21l-5,5V16Z" transform="translate(-1294 -13)"/></svg>`;
  const COLLAPSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="11" viewBox="0 0 16 11" class="${CLS.caretFill}"><path d="M1302,21l-5,5V16Z" transform="translate(29 -1294) rotate(90)"/></svg>`;

  const VALUE_MODE_KEY = `${SECTION_ID}:value_mode_v1`; // "mv" | "paid"
  const VALUE_MODES = { MV: "mv", PAID: "paid" };
  let lastRender = null; // cache last computed data so toggle can re-render without API calls

  ////////////////////////////////////////////////////////////////////////////
  // STYLES
  ////////////////////////////////////////////////////////////////////////////
  const style = `
    #${SECTION_ID}{ margin-top:14px; }
    #${SECTION_ID} #${SECTION_ID}-content{ padding:5px; background:var(--default-bg-panel-color); border-radius:0 0 6px 6px; }

    #${SECTION_ID} .pill{ display:inline-block; border:1px solid var(--default-panel-divider-outer-side-color); border-radius:999px; padding:2px 8px; font-size:11px; background:var(--default-bg-panel-active-color); }
    #${SECTION_ID} .pill a{ color:var(--default-blue-color); text-decoration:underline; }
    #${SECTION_ID} .pills-row{ display:flex; flex-wrap:wrap; gap:6px; margin-bottom:6px; align-items:center; }
    #${SECTION_ID} .pill-date input{ border:none; background:transparent; color:inherit; font:inherit; padding:0 2px; outline:none; }
    #${SECTION_ID} .pills-right{ margin-left:auto; display:flex; gap:6px; }
    #${SECTION_ID} .btn-icon{ width:28px; height:28px; padding:0; display:inline-flex; align-items:center; justify-content:center; }
    #${SECTION_ID} .btn-icon .tf-icon{ width:16px; height:16px; }
    #${SECTION_ID} .status-err{ color:#b00020; font-size:12px; margin-left:6px; display:none; }

    #${SECTION_ID} .header___f_BFs{ display:flex; align-items:center; padding:0 8px; }
    #${SECTION_ID} .icons___VmEI4{ margin-left:auto; display:flex; align-items:center; gap:6px; }
    #${SECTION_ID} .icons___VmEI4 .button___MO5cW{ background:transparent; border:0; padding:6px; line-height:0; cursor:pointer; }
    #${SECTION_ID} .icons___VmEI4 .${CLS.caretFill}{ fill:#cfd6de; }
    #${SECTION_ID} .icons___VmEI4 .button___MO5cW:hover .${CLS.caretFill}{ fill:#ffffff; }

    #${SECTION_ID} .kpis{ display:grid; gap:6px; grid-template-columns:repeat(3, minmax(0,1fr)); }
    @media (min-width:785px){ #${SECTION_ID} .kpis{ grid-template-columns:repeat(5, minmax(0,1fr)); } }
    #${SECTION_ID} .kpi{ background:var(--default-bg-panel-active-color); border:1px solid var(--default-panel-divider-outer-side-color); border-radius:6px; padding:6px 8px; min-width:0; box-sizing:border-box; }
    #${SECTION_ID} .kpi .label{ font-size:11px; opacity:.85; color:var(--default-color); }
    #${SECTION_ID} .kpi .value{ font-weight:700; font-size:14px; color:var(--default-color); }
    #${SECTION_ID} .kpi .sub{ font-size:11px; opacity:.75; color:var(--default-color); text-align:right; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

    #${SECTION_ID} .grid{ display:grid; gap:8px; grid-template-columns:1fr; }
    #${SECTION_ID} .card{ border:1px solid var(--default-panel-divider-outer-side-color); border-radius:6px; background:var(--default-bg-panel-color); padding:8px; }
    #${SECTION_ID} .card h4{ margin:0 0 6px; font-weight:700; font-size:13px; display:flex; align-items:center; justify-content:space-between; }
    #${SECTION_ID} .card--oc{ grid-column:1/-1; margin-top:8px; }
    #${SECTION_ID} table{ width:100%; border-collapse:collapse; color:var(--default-color); }
    #${SECTION_ID} .table--compact th, #${SECTION_ID} .table--compact td{ padding:6px 12px; font-size:12px; border-bottom:1px solid var(--default-panel-divider-outer-side-color); vertical-align:middle; }
    #${SECTION_ID} table thead th{ text-align:center !important; }
    #${SECTION_ID} td:first-child{ text-align:left; }
    #${SECTION_ID} .w-min{ width:1%; white-space:nowrap; text-align:right; }
    #${SECTION_ID} td.center{ text-align:center; }
    #${SECTION_ID}, #${SECTION_ID} .card, #${SECTION_ID} table td, #${SECTION_ID} table th, #${SECTION_ID} .pill, #${SECTION_ID} .items-list li{ color:var(--default-color); }

    #${SECTION_ID} .good{ color:var(--default-green-color,#66bb6a); }
    #${SECTION_ID} .bad { color:var(--default-red-color,#e57373); }
    #${SECTION_ID} .warn{ color:var(--default-yellow-color,#e0c200); }

    #${SECTION_ID} .oc-name{ white-space:nowrap; }
    #${SECTION_ID} .items-col{ white-space:normal; }
    #${SECTION_ID} .items-list{ margin:0; padding-left:18px; }
    #${SECTION_ID} .items-list li{ margin:0; padding:0; }
    #${SECTION_ID} .mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }

    #${SECTION_ID} .icons___VmEI4 button,
    #${SECTION_ID} #${SECTION_ID}-run,
    #${SECTION_ID} #${SECTION_ID}-stop{ color:var(--default-color); }
    #${SECTION_ID} .icons___VmEI4 button svg,
    #${SECTION_ID} #${SECTION_ID}-run svg,
    #${SECTION_ID} #${SECTION_ID}-stop svg{ stroke:currentColor; fill:none; }
    #${SECTION_ID} #${SECTION_ID}-run[disabled],
    #${SECTION_ID} #${SECTION_ID}-stop[disabled]{ opacity:.55; }

    @media (max-width: 785px){
      #${SECTION_ID} .col-runs, #${SECTION_ID} .col-items, #${SECTION_ID} .col-paid { display: none; }
      #${SECTION_ID} tr.main-row { cursor: pointer; }
      #${SECTION_ID} tr.main-row:hover { filter: brightness(1.05); }
      #${SECTION_ID} td.oc-name { position: relative; padding-left: 22px; }
      #${SECTION_ID} td.oc-name::before { content: "▸"; position: absolute; left: -6px; top: 50%; transform: translateY(-50%); opacity: .85; }
      #${SECTION_ID} tr.main-row[aria-expanded="true"] td.oc-name::before { content: "▾"; }
      #${SECTION_ID} .row-details { display: none; background: var(--default-bg-panel-active-color); }
      #${SECTION_ID} .row-details.open { display: table-row; }
      #${SECTION_ID} .row-details .details-wrap { padding: 8px 10px; font-size: 12px; color: var(--default-color); }
      #${SECTION_ID} .row-details ul.items-list { margin: 6px 0 0; padding-left: 18px; }
      #${SECTION_ID} .table--compact th,
      #${SECTION_ID} .table--compact td { padding: 6px 8px; }
      #${SECTION_ID} .w-min { width: auto; }
      #${SECTION_ID} .oc-name { white-space: normal; }
    }
    @media (min-width: 786px){ #${SECTION_ID} .row-details { display: none !important; } }
    #${SECTION_ID} .pill-seg { padding:0; overflow:hidden; display:inline-flex; }
    #${SECTION_ID} .pill-seg .seg-btn{
      background:transparent; border:0; padding:2px 10px; cursor:pointer;
      font-size:11px; color:inherit; opacity:.85;
    }
    #${SECTION_ID} .pill-seg .seg-btn + .seg-btn{
      border-left:1px solid var(--default-panel-divider-outer-side-color);
    }
    #${SECTION_ID} .pill-seg .seg-btn.active{
      background:var(--default-bg-panel-active-color);
      opacity:1; font-weight:700;
    }
  `;

  ////////////////////////////////////////////////////////////////////////////
  // UTILS
  ////////////////////////////////////////////////////////////////////////////
  const delay = (ms) => new Promise(r => setTimeout(r, ms));
  const escapeHtml = (s) => String(s)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  const fmtMoneySpace = (n) => String(Math.round(n||0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const pad2   = (n) => String(n).padStart(2, FIG);
  const padPct = (r) => r.toFixed(1).padStart(5, FIG) + "%";

  async function getSetting(key, def=""){
    try{
      if (typeof GM !== "undefined" && GM.getValue) return await GM.getValue(key, def);
      if (typeof GM_getValue !== "undefined"){ const v = GM_getValue(key); return v == null ? def : v; }
    }catch{}
    return def;
  }
  async function setSetting(key, val){
    try{
      if (typeof GM !== "undefined" && GM.setValue) return await GM.setValue(key, val);
      if (typeof GM_setValue !== "undefined") return GM_setValue(key, val);
    }catch{}
  }
  async function getValueMode(){
    const m = String(await getSetting(VALUE_MODE_KEY, VALUE_MODES.MV) || VALUE_MODES.MV);
    return (m === VALUE_MODES.PAID) ? VALUE_MODES.PAID : VALUE_MODES.MV;
  }
  function setError(msg){
    const s = document.getElementById(`${SECTION_ID}-status`);
    if (!s) return;
    if (msg){
      s.textContent = msg;
      s.style.display = 'inline';
    } else {
      s.textContent = '';
      s.style.display = 'none';
    }
  }

  // GM XHR → JSON with better Torn API error surfacing
  const httpGetJSON = (url) => {
    const fn = (typeof GM !== "undefined" && GM.xmlHttpRequest) ? GM.xmlHttpRequest : GM_xmlhttpRequest;
    return new Promise((resolve, reject) => {
      fn({
        method: "GET", url, headers: { Accept: "application/json" }, timeout: 30000,
        onload: (res) => {
          if (!(res.status >= 200 && res.status < 300)) return reject(new Error(`HTTP ${res.status}`));
          try{
            const data = JSON.parse(res.responseText);
            if (data && (data.error || data.code)){
              const code = Number(data.error?.code ?? data.code ?? NaN);
              const raw  = data.error?.error ?? data.error?.message ?? "API error";
              const map  = {
                1: "Missing API key",
                2: "Invalid API key",
                5: "Rate limited: retry in ~30s",
                7: "Requires Faction API Access",
                14: "Daily usage limit reached",
                16: `Insufficient access — requires ${REQUIRED_ACCESS}`,
              };
              const nice = Number.isFinite(code) ? (map[code] || raw) : raw;
              reject(new Error(`Torn API error${Number.isFinite(code)?` ${code}`:""}: ${nice}`));
            } else {
              resolve(data);
            }
          }catch{
            reject(new Error("Invalid JSON response"));
          }
        },
        onerror: () => reject(new Error("Network error")),
        ontimeout: () => reject(new Error("Request timed out")),
      });
    });
  };

  // If Torn’s app.css gradients aren’t present on this page, add a local fallback
  function applyHeaderPolyfillIfNeeded(){
    const h = document.querySelector(`#${SECTION_ID} .header___f_BFs`);
    if (!h) return;
    const bgImg = getComputedStyle(h).backgroundImage || "";
    if (bgImg && bgImg !== "none") return;

    const s = document.createElement("style");
    s.id = `${SECTION_ID}-header-polyfill`;
    s.textContent = `
      #${SECTION_ID} .header___f_BFs{
        background: linear-gradient(180deg,#555,#333) no-repeat;
        border-bottom: 2px solid transparent;
        border-radius: 5px 5px 0 0;
        display:flex; height:34px; position:relative;
      }
      #${SECTION_ID} .title___nIMRx{
        align-self:center; color:#fff; font:700 12px/14px Arial,sans-serif;
        margin-left:10px; text-shadow:0 0 2px #000; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      }
    `;
    (document.head || document.documentElement).appendChild(s);
  }

  function grossUpFromPaid(paidToMembers, payoutPct){
    const paid = Math.round(Number(paidToMembers || 0));
    const pct  = Number(payoutPct || 0);

    if (!paid || !(pct > 0)) return 0;

    // basis points avoids float drift (33.33 -> 3333, 90 -> 9000)
    const bp = Math.round(pct * 100);
    if (!(bp > 0)) return 0;

    // paid = pct% of total => total = paid * 100 / pct
    return Math.round((paid * 10000) / bp);
  }

  ////////////////////////////////////////////////////////////////////////////
  // API HELPERS
  ////////////////////////////////////////////////////////////////////////////
  const asCrimes = (p) =>
    Array.isArray(p?.crimes) ? p.crimes
      : (p?.crimes && typeof p.crimes === "object" ? Object.values(p.crimes)
      : (Array.isArray(p?.result?.crimes) ? p.result.crimes : []));

  const asNews = (p) =>
    Array.isArray(p?.news) ? p.news
      : (p?.news && typeof p.news === "object" ? Object.values(p.news)
      : (Array.isArray(p?.result?.news) ? p.result.news : []));

  // Crimes: one DESC batch filtered by executed_at [startSec..endSec]
  async function fetchCrimesBatch({ key, startSec, endSec, signal }){
    const u = new URL(CRIMES_API);
    u.searchParams.set("comment", API_COMMENT);
    u.searchParams.set("key", key.trim());
    u.searchParams.set("cat", "completed");
    u.searchParams.set("filter", "executed_at");
    u.searchParams.set("from", String(startSec));
    u.searchParams.set("to",   String(endSec));
    u.searchParams.set("sort", "DESC");

    const data   = await httpGetJSON(u.toString());
    if (signal?.aborted) throw new Error("Aborted");
    const crimes = (asCrimes(data) || []).filter(c => Number.isFinite(c?.executed_at));
    return { crimes };
  }

  // News: walk DESC over [startSec..endSec], sum "balance by $X" amounts per crimeId
  async function fetchNewsExpenses({ key, startSec, endSec, includeCrimeIds, signal }){
    const byCrime = new Map();
    const seenNewsIds = new Set();

    let cursorTo  = endSec;

    while (cursorTo >= startSec) {
      if (signal?.aborted) throw new Error("Aborted");

      const u = new URL(NEWS_API);
      u.searchParams.set("comment", API_COMMENT);
      u.searchParams.set("key", key.trim());
      u.searchParams.set("cat", "crime");
      u.searchParams.set("sort", "DESC");
      u.searchParams.set("from", String(startSec));
      u.searchParams.set("to",   String(cursorTo));

      const news = (asNews(await httpGetJSON(u.toString())) || []).filter(n => Number.isFinite(n?.timestamp));
      const count = news.length;
      if (!count) break;

      for (const n of news) {
        const nid = String(n?.id || "");
        if (nid) {
          if (seenNewsIds.has(nid)) continue;
          seenNewsIds.add(nid);
        }

        const txt = String(n?.text || "");
        const idm = txt.match(/crimeId=(\d+)/i); if (!idm) continue;
        const crimeId = Number(idm[1]);
        if (includeCrimeIds && !includeCrimeIds.has(crimeId)) continue;

        const pm = txt.match(
          /money balance payout splitting\s+(\d+(?:\.\d+)?)%\s+of\s+the\s+\$([\d, ]+)\s+between\s+(\d+)\s+participants/i
        );
        if (!pm) continue;

        const pct = parseFloat(pm[1]);                 // e.g. 100 or 33.33
        const total = parseInt(pm[2].replace(/[^\d]/g,""), 10); // e.g. 476000
        const participants = parseInt(pm[3], 10);      // e.g. 3

        const pool = Math.floor((total * pct + 1e-9) / 100);
        const each = Math.floor(pool / participants);
        const remainder = pool - each * participants;
        const paidOutTotal = each * participants; // matches sum of individual "increased ... by $X" lines

        byCrime.set(crimeId, (byCrime.get(crimeId) || 0) + paidOutTotal);
      }

      if (count < API_PAGE_CAP) break;

      // Slide window down (DESC) with a safe overlap using the 2nd smallest timestamp
      const asc = [...new Set(news.map(n => n.timestamp))].sort((a,b)=>a-b);
      const min = asc[0];
      const secondMin = asc.length >= 2 ? asc[1] : NaN;

      let nextTo = Number.isFinite(secondMin) ? secondMin : (min - 1);
      if (!(nextTo < cursorTo)) nextTo = cursorTo - 1;
      if (nextTo < startSec) break;
      cursorTo = nextTo;

      await delay(150);
    }

    return byCrime;
  }

  // Items catalog (with 24h cache): value.market_price
  async function ensureItemInfo(key){
    if (ITEM_INFO) return;

    try{
      const cached = await getSetting(ITEM_INFO_CACHE_KEY, null);
      if (cached){
        const obj = typeof cached === "string" ? JSON.parse(cached) : cached;
        if (obj?.ts && obj?.data && (Date.now() - obj.ts) < ITEM_INFO_CACHE_TTL_MS){
          ITEM_INFO = new Map(obj.data);
          return;
        }
      }
    }catch{/* ignore */}

    try{
      const u = new URL(ITEMS_API);
      u.searchParams.set("comment", API_COMMENT);
      u.searchParams.set("key", key.trim());
      const data = await httpGetJSON(u.toString());

      const arr = Array.isArray(data?.items) ? data.items
                : (Array.isArray(data?.result?.items) ? data.result.items : []);
      const map = new Map();
      for (const it of arr){
        const id = Number(it?.id);
        if (!Number.isFinite(id)) continue;
        const name = it?.name || `Item #${id}`;
        const mv   = Number(it?.value?.market_price ?? 0) || 0;
        map.set(id, { name, mv });
      }
      ITEM_INFO = map;

      try{
        await setSetting(ITEM_INFO_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: Array.from(map.entries()) }));
      }catch{/* ignore */}
    }catch(e){
      console.warn("Items catalog fetch failed:", e);
      ITEM_INFO = new Map();
    }
  }
  const itemName = (id) => ITEM_INFO?.get(id)?.name ?? `Item #${id}`;
  const itemMV   = (id) => ITEM_INFO?.get(id)?.mv   ?? 0;

  ////////////////////////////////////////////////////////////////////////////
  // AGGREGATION
  ////////////////////////////////////////////////////////////////////////////
  function aggregate(crimes){
    const totals = {
      count: 0, success: 0, fail: 0,
      money: 0, respect: 0,
      payoutToMembers: 0, payoutToFaction: 0,
      ocBreakdown: new Map(), // key: "name|diff" → bucket
    };

    for (const c of crimes){
      const success = String(c?.status||"").toLowerCase() === "successful";
      totals.count += 1;
      success ? (totals.success += 1) : (totals.fail += 1);

      const name = c?.name || "Unknown OC";
      const diff = Number.isFinite(c?.difficulty) ? c.difficulty : null;
      const key  = `${name}|${diff ?? ""}`;

      let b = totals.ocBreakdown.get(key);
      if (!b){
        b = { name, difficulty: diff, total: 0, success: 0, fail: 0, respect: 0, memMoney: 0, income: 0, itemsQty: 0, items: new Map() };
        totals.ocBreakdown.set(key, b);
      }
      b.total += 1;
      success ? (b.success += 1) : (b.fail += 1);

      const money   = Number(c?.rewards?.money   || 0);
      const respect = Number(c?.rewards?.respect || 0);
      totals.money   += money;
      totals.respect += respect;
      b.income       += money;
      b.respect      += respect;

      const itemsArr = Array.isArray(c?.rewards?.items) ? c.rewards.items : [];
      for (const it of itemsArr){
        const iid = Number(it?.id);
        const qty = Number(it?.quantity || 0);
        if (!Number.isFinite(iid) || !qty) continue;
        b.itemsQty += qty;
        b.items.set(iid, (b.items.get(iid) || 0) + qty);
      }

      // payout percentage = share to members
      const pct       = Math.max(0, Math.min(100, Number(c?.rewards?.payout?.percentage ?? 0)));
      const toMembers = Math.round((money * pct) / 100);
      const toFaction = money - toMembers;
      totals.payoutToMembers += toMembers;
      totals.payoutToFaction += toFaction;
      b.memMoney += toMembers;
    }
    return { totals };
  }

  function buildOcExpenseMap(crimes, expenseByCrime){
    const map = new Map();
    for (const c of crimes){
      const e = expenseByCrime.get(c.id) || 0;
      if (!e) continue;
      const name = c.name || "Unknown OC";
      const diff = Number.isFinite(c.difficulty) ? c.difficulty : null;
      const key  = `${name}|${diff ?? ""}`;
      map.set(key, (map.get(key) || 0) + e);
    }
    return map;
  }

  function getMaxPaidAt(crimes){
    let max = NaN;
    for (const c of crimes){
      const ts = Number(c?.rewards?.payout?.paid_at);
      if (Number.isFinite(ts) && (!Number.isFinite(max) || ts > max)) max = ts;
    }
    return max;
  }

  function buildItemEstByKey(ocMap){
    const byKey = new Map(); let total = 0;
    for (const [key, b] of ocMap){
      let est = 0;
      if (b.items?.size){
        for (const [iid, qty] of b.items) est += qty * (itemMV(iid) || 0);
      }
      est = Math.round(est);
      byKey.set(key, est);
      total += est;
    }
    return { byKey, total: Math.round(total) };
  }

  function buildOcTimeItemEstByKey(crimes, expenseByCrime){
    // returns: { byKey: Map(key -> estItemsOcTime), total }
    // estItemsOcTime = (grossed total value) - (cash income)
    const grossedByKey = new Map();
    const incomeByKey  = new Map();

    for (const c of crimes){
      const name = c.name || "Unknown OC";
      const diff = Number.isFinite(c.difficulty) ? c.difficulty : null;
      const key  = `${name}|${diff ?? ""}`;

      const income = Math.round(Number(c?.rewards?.money || 0));
      incomeByKey.set(key, (incomeByKey.get(key) || 0) + income);

      const paid = Math.round(expenseByCrime.get(c.id) || 0);
      if (!paid) continue;

      const pct = Math.max(0, Math.min(100, Number(c?.rewards?.payout?.percentage ?? 0)));
      const grossed = grossUpFromPaid(paid, pct);
      if (!grossed) continue;

      grossedByKey.set(key, (grossedByKey.get(key) || 0) + grossed);
    }

    const byKey = new Map(); let total = 0;
    for (const [key, grossed] of grossedByKey){
      const income = incomeByKey.get(key) || 0;
      const estItems = Math.max(0, Math.round(grossed - income));
      byKey.set(key, estItems);
      total += estItems;
    }

    return { byKey, total: Math.round(total) };
  }

  ////////////////////////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////////////////////////
  function injectStyle(){
    if (document.getElementById(`${SECTION_ID}-style`)) return;
    const s = document.createElement("style");
    s.id = `${SECTION_ID}-style`;
    s.textContent = style;
    document.head.appendChild(s);
  }

  function buildWidget(){
    const existing = document.getElementById(SECTION_ID);
    if (existing) return existing;

    const el = document.createElement("div");
    el.id = SECTION_ID;
    el.className = "equipped-items-wrap";
    el.innerHTML = `
      <div class="main___QuzF7">
        <header class="header___f_BFs">
          <p class="title___nIMRx" role="heading" aria-level="2">${TITLE_TEXT}</p>
          <nav class="icons___VmEI4">
            <button type="button" class="button___MO5cW iconParentButton___POutJ" id="${SECTION_ID}-toggle" aria-label="Open" aria-expanded="false">${OPEN_SVG}</button>
          </nav>
        </header>

        <div class="content___Gb8DR" id="${SECTION_ID}-content" hidden>
          <div class="pills-row">
            <span id="${SECTION_ID}-apikeybar" class="pill"></span>
            <span class="pill pill-date">From <input type="date" id="${SECTION_ID}-from"></span>
            <span class="pill pill-date">To <input type="date" id="${SECTION_ID}-to"></span>
            <span class="pill pill-seg" id="${SECTION_ID}-valuemode">
              <button type="button" data-mode="mv"  class="seg-btn">Current MV</button>
              <button type="button" data-mode="paid" class="seg-btn">OC-Time</button>
            </span>

            <span id="${SECTION_ID}-status" class="status-err"></span>
            <span class="pills-right">
              <button class="btn btn-icon" id="${SECTION_ID}-stop" title="Stop" disabled>${ICONS.stop}</button>
              <button class="btn btn-icon" id="${SECTION_ID}-run"  title="Run">${ICONS.play}</button>
            </span>
          </div>

          <div id="${SECTION_ID}-totals"></div>

          <div class="grid">
            <div class="card card--oc">
              <h4><span>OC breakdown</span></h4>
              <div id="${SECTION_ID}-ocbreak">—</div>
            </div>
          </div>
        </div>
      </div>
    `;

    el.querySelector(`#${SECTION_ID}-toggle`)?.addEventListener("click", () => togglePanel());
    return el;
  }

  function togglePanel(force){
    const content = document.getElementById(`${SECTION_ID}-content`);
    const btn = document.getElementById(`${SECTION_ID}-toggle`);
    if (!content || !btn) return;
    const isOpen = !content.hasAttribute("hidden");
    const show   = (typeof force === "boolean") ? force : !isOpen;
    content.toggleAttribute("hidden", !show);
    btn.setAttribute("aria-expanded", String(show));
    btn.setAttribute("aria-label", show ? "Collapse" : "Open");
    btn.innerHTML = show ? COLLAPSE_SVG : OPEN_SVG;
  }

  async function refreshApiUI(){
    const span = document.getElementById(`${SECTION_ID}-apikeybar`);
    if (!span) return;
    const key = (await getSetting("apiKey","")).trim();
    span.className = "pill";
    span.innerHTML = `API key: ${
    key ? `<strong>set</strong> · <a id="${SECTION_ID}-editkey">edit</a>`
      : `<strong>not set</strong> · <a id="${SECTION_ID}-editkey">set</a>`
    }`;
    document.getElementById(`${SECTION_ID}-editkey`)?.addEventListener("click", async (ev)=>{
      ev.preventDefault();
      const v = prompt("Paste your Torn API key", key) || "";
      await setSetting("apiKey", v.trim());
      refreshApiUI();
    });

    setError(key ? "" : `API key required (${REQUIRED_ACCESS}).`);
  }

  function renderFromCache(mode){
    if (!lastRender) return;

    const isPaid = (mode === VALUE_MODES.PAID);

    renderTotals({
      totals: lastRender.totals,
      countDays: lastRender.diffDays,
      paidToMembersOverride: lastRender.totalPaid,
      netOverride: isPaid ? lastRender.netTotalPaid : lastRender.netTotalMV
    });

    renderOcBreakdown(
      lastRender.totals.ocBreakdown,
      lastRender.ocExpenseMap,
      isPaid ? lastRender.itemEstByKeyPaid : lastRender.itemEstByKeyMV,
      { valueMode: mode }
    );
  }

  function renderTotals({ totals, countDays, paidToMembersOverride, netOverride }){
    const host = document.getElementById(`${SECTION_ID}-totals`);
    if (!host) return;

    const days = Math.max(1, countDays|0);
    const rate = totals.count ? (totals.success / totals.count * 100) : 0;

    const paidMembers = Number.isFinite(paidToMembersOverride) ? paidToMembersOverride : (totals.payoutToMembers || 0);
    const netFaction  = Number.isFinite(netOverride)           ? netOverride           : (totals.payoutToFaction || 0);
    const grandTotal  = paidMembers + netFaction;

    const perRespect = totals.respect / days;
    const perMem     = paidMembers   / days;
    const perNet     = netFaction    / days;
    const perGrand   = grandTotal    / days;

    host.innerHTML = `
      <div class="kpis">
        <div class="kpi">
          <div class="label">Crimes</div>
          <div class="value">${totals.count.toLocaleString()}</div>
          <div class="sub"><span class="good">${totals.success.toLocaleString()}</span> / <span class="bad">${totals.fail.toLocaleString()}</span> – ${rate.toFixed(1)}%</div>
        </div>
        <div class="kpi">
          <div class="label">Respect</div>
          <div class="value">${totals.respect.toLocaleString()}</div>
          <div class="sub">≈ ${perRespect.toFixed(1)} / day</div>
        </div>
        <div class="kpi">
          <div class="label">Money to members</div>
          <div class="value">$${paidMembers.toLocaleString()}</div>
          <div class="sub">≈ $${fmtMoneySpace(perMem)} / day</div>
        </div>
        <div class="kpi">
          <div class="label">Money to faction</div>
          <div class="value">$${netFaction.toLocaleString()}</div>
          <div class="sub">≈ $${fmtMoneySpace(perNet)} / day</div>
        </div>
        <div class="kpi">
          <div class="label">Grand total</div>
          <div class="value">$${grandTotal.toLocaleString()}</div>
          <div class="sub">≈ $${fmtMoneySpace(perGrand)} / day</div>
        </div>
      </div>
    `;
  }

  function renderOcBreakdown(ocMap, ocExpenseMap = new Map(), itemEstByKey = new Map(), opts = {}){
    const mode = opts.valueMode || VALUE_MODES.MV;
    const estHdr = (mode === VALUE_MODES.PAID) ? "Income & Items (OC-time est.)" : "Income & Items (Est. MV)";
    const estLbl = (mode === VALUE_MODES.PAID) ? "≈ $%s (OC-time)" : "≈ $%s (MV)";

    const host = document.getElementById(`${SECTION_ID}-ocbreak`);
    if (!host) return;

    const entries = Array.from(ocMap.entries()).map(([key, b]) => ({ key, ...b }));
    if (!entries.length){ host.innerHTML = `<span class="kpi sub">No crimes in range.</span>`; return; }

    // By difficulty ASC then name
    entries.sort((a,b)=> ( (a.difficulty??9999) - (b.difficulty??9999) ) || a.name.localeCompare(b.name));

    const rows = entries.map(x=>{
      const rate   = x.total ? (x.success / x.total * 100) : 0;
      const income = Math.round(x.income || 0);
      const paid   = Math.round(ocExpenseMap.get(x.key) || 0);
      const est    = Math.round(itemEstByKey.get(x.key) || 0);
      const net    = income + est - paid;
      const netCls = net >= 0 ? "good" : "bad";
      const label  = `${x.difficulty} - ${escapeHtml(x.name)}`;

      const parts = [];
      if (income > 0) parts.push(`<div class="good">$${income.toLocaleString()}</div>`);
      if (x.items?.size){
        const li = [];
        for (const [iid, qty] of x.items) li.push(`<li>${qty.toLocaleString()}× ${escapeHtml(itemName(iid))}</li>`);
        li.sort((a,b)=> a.localeCompare(b));
        parts.push(`<div class="items-col"><ul class="items-list">${li.join("")}</ul></div>`);
        if (est > 0) parts.push(`<div class="warn">${estLbl.replace("%s", est.toLocaleString())}</div>`);
      }
      const merged = parts.length ? parts.join("") : "—";

      const runsCell = `<span class="mono">${pad2(x.total)} (<span class="good">${pad2(x.success)}</span>/<span class="bad">${pad2(x.fail)}</span>) ${padPct(rate)}</span>`;

      var mainRow =
          '<tr class="main-row" aria-expanded="false">'
      +   '<td class="oc-name">' + label + '</td>'
      +   '<td class="w-min center col-runs">' + runsCell + '</td>'
      +   '<td class="w-min center col-resp">' + x.respect.toLocaleString() + '</td>'
      +   '<td class="col-items">' + merged + '</td>'
      +   '<td class="w-min bad center col-paid">$' + paid.toLocaleString() + '</td>'
      +   '<td class="w-min ' + netCls + ' center">$' + net.toLocaleString() + '</td>'
      + '</tr>';

      var itemsHTML = '';
      if (x.items && x.items.size){
        var li = [];
        x.items.forEach(function(qty, iid){
          li.push('<li>' + qty.toLocaleString() + '× ' + escapeHtml(itemName(iid)) + '</li>');
        });
        li.sort(function(a,b){ return a.localeCompare(b); });
        itemsHTML = '<ul class="items-list">' + li.join('') + '</ul>';
      }

      var detailsHtml =
          '<div class="details-wrap">'
      +   '<div><strong>Runs</strong>: ' + runsCell + '</div>'
      +   '<div><strong>Resp.</strong>: ' + x.respect.toLocaleString() + '</div>'
      +   (income ? ('<div class="good"><strong>Income</strong>: $' + income.toLocaleString() + '</div>') : '')
      +   (paid   ? ('<div class="bad"><strong>Paid to Members</strong>: $' + paid.toLocaleString() + '</div>') : '')
      +   (x.items && x.items.size
           ? ('<div><strong>Items</strong>:' + itemsHTML + '</div>'
              + (est ? '<div class="warn"><strong>Item est. (MV)</strong>: $' + est.toLocaleString()
                 + '</div>' : '')
             )
           : '')
      + '</div>';

      var detailRow =
          '<tr class="row-details"><td colspan="6">' + detailsHtml + '</td></tr>';

      return mainRow + detailRow;
    });

    host.innerHTML = ''
      + '<table class="table--compact">'
      + '  <thead>'
      + '    <tr>'
      + '      <th>OC</th>'
      + '      <th class="col-runs w-min">Runs</th>'
      + '      <th class="col-resp w-min">Resp.</th>'
      + '      <th class="col-items">Income & Items (Est. MV)</th>'
      + '      <th class="col-paid w-min">Paid to Members</th>'
      + '      <th class="w-min">Net</th>'
      + '    </tr>'
      + '  </thead>'
      + '  <tbody>' + rows.join('') + '</tbody>'
      + '</table>';
  }

  ////////////////////////////////////////////////////////////////////////////
  // CONTROLLER
  ////////////////////////////////////////////////////////////////////////////
  let abortCtrl = null;

  async function runQuery(){
    const key = (await getSetting("apiKey","")).trim();
    if (!key){ setError(`API key required (${REQUIRED_ACCESS}).`); return; }

    const fromStr = document.getElementById(`${SECTION_ID}-from`)?.value?.trim();
    const toStr   = document.getElementById(`${SECTION_ID}-to`)?.value?.trim();
    if (!fromStr || !toStr) return alert("Pick both dates.");

    const toUTC = (y,m,d,h=0,mi=0,s=0)=>Math.floor(Date.UTC(y,m-1,d,h,mi,s)/1000);
    const startSec = toUTC(+fromStr.slice(0,4), +fromStr.slice(5,7), +fromStr.slice(8,10), 0,0,0);
    const endSec   = toUTC(+toStr.slice(0,4),   +toStr.slice(5,7),   +toStr.slice(8,10),   23,59,59);
    if (endSec < startSec) return alert('"To" must be ≥ "From".');

    const btnRun  = document.getElementById(`${SECTION_ID}-run`);
    const btnStop = document.getElementById(`${SECTION_ID}-stop`);
    abortCtrl = new AbortController();
    btnRun.disabled = true; btnStop.disabled = false; setError("");

    try {
      // Page through crimes DESC with second-oldest overlap
      const seenIds = new Set(); const collected = [];
      let cursorTo = endSec;

      while (cursorTo >= startSec) {
        if (abortCtrl.signal.aborted) throw new Error("Aborted");

        const { crimes } = await fetchCrimesBatch({ key, startSec, endSec: cursorTo, signal: abortCtrl.signal });
        const count = crimes.length;
        if (!count) break;

        for (const c of crimes) {
          const id = c?.id;
          if (id != null && !seenIds.has(id)) { seenIds.add(id); collected.push(c); }
        }

        if (count < API_PAGE_CAP) break;

        const asc = [...new Set(crimes.map(c => c.executed_at))].sort((a,b)=>a-b);
        const min = asc[0], secondMin = asc.length >= 2 ? asc[1] : NaN;

        let nextTo = Number.isFinite(secondMin) ? secondMin : (min - 1);
        if (!(nextTo < cursorTo)) nextTo = cursorTo - 1;
        if (nextTo < startSec) break;
        cursorTo = nextTo;

        await delay(150);
      }

      const ranged = collected.filter(c => c.executed_at >= startSec && c.executed_at <= endSec);

      // Items MV cache + IDs set for news filter
      await ensureItemInfo(key);
      const idSet   = new Set(ranged.map(c => c.id));
      const maxPaid = getMaxPaidAt(ranged);
      const newsEnd = Number.isFinite(maxPaid) ? Math.max(endSec, maxPaid) : endSec;

      // News payouts → by OC
      let ocExpenseMap = new Map();
      let expenseByCrime = new Map();
      try{
        expenseByCrime = await fetchNewsExpenses({ key, startSec, endSec: newsEnd, includeCrimeIds: idSet, signal: abortCtrl.signal });
        ocExpenseMap = buildOcExpenseMap(ranged, expenseByCrime);
      }catch{/* ignore news errors */}

      const diffDays = Math.ceil(((endSec - startSec + 1) * 1000) / (24*3600*1000));
      const { totals } = aggregate(ranged);

      // MV today
      const { byKey: itemEstByKeyMV, total: itemEstTotalMV } =
            buildItemEstByKey(totals.ocBreakdown);

      // OC-time (from payouts, grossed to 100%)
      const { byKey: itemEstByKeyPaid, total: itemEstTotalPaid } =
            buildOcTimeItemEstByKey(ranged, expenseByCrime);

      let totalIncome = 0; for (const b of totals.ocBreakdown.values()) totalIncome += Math.round(b.income || 0);
      let totalPaid   = 0; for (const v of ocExpenseMap.values())        totalPaid  += Math.round(v || 0);

      const netTotalMV   = totalIncome + itemEstTotalMV   - totalPaid;
      const netTotalPaid = totalIncome + itemEstTotalPaid - totalPaid;

      lastRender = {
        totals, diffDays, totalPaid,
        ocExpenseMap,
        itemEstByKeyMV, netTotalMV,
        itemEstByKeyPaid, netTotalPaid,
      };

      const mode = await getValueMode();
      renderFromCache(mode);
    } catch (e){
      if (e?.message !== "Aborted") setError(e?.message || "Unexpected error.");
    } finally {
      btnRun.disabled = false; btnStop.disabled = true;
    }
  }

  function wireUp(){
    document.getElementById(`${SECTION_ID}-run`) ?.addEventListener("click", runQuery);
    document.getElementById(`${SECTION_ID}-stop`)?.addEventListener("click", () => abortCtrl?.abort());

    // Default range: last 7 days (UTC)
    const fromEl = document.getElementById(`${SECTION_ID}-from`);
    const toEl   = document.getElementById(`${SECTION_ID}-to`);
    if (fromEl && toEl){
      const now = new Date();
      const toY=now.getUTCFullYear(), toM=now.getUTCMonth()+1, toD=now.getUTCDate();
      const from = new Date(Date.UTC(toY, toM-1, toD-6));
      const iso = (d) => `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,"0")}-${String(d.getUTCDate()).padStart(2,"0")}`;
      if (!fromEl.value) fromEl.value = iso(from);
      if (!toEl.value)   toEl.value   = iso(now);
    }

    (async function initValueModeToggle(){
      const wrap = document.getElementById(`${SECTION_ID}-valuemode`);
      if (!wrap) return;

      const setActive = (mode) => {
        wrap.querySelectorAll(".seg-btn").forEach(b=>{
          b.classList.toggle("active", b.getAttribute("data-mode") === mode);
        });
      };

      const mode = await getValueMode();
      setActive(mode);

      wrap.addEventListener("click", async (ev)=>{
        const btn = ev.target?.closest?.("button[data-mode]");
        if (!btn) return;

        const next = btn.getAttribute("data-mode");
        if (next !== VALUE_MODES.MV && next !== VALUE_MODES.PAID) return;

        await setSetting(VALUE_MODE_KEY, next);
        setActive(next);

        // re-render last results instantly (no refetch)
        if (lastRender) renderFromCache(next);
      });
    })();

    (function(){
      var root = document.getElementById(SECTION_ID);
      if (!root) return;

      root.addEventListener("click", function(ev){
        var row = ev.target && ev.target.closest && ev.target.closest("tr.main-row");
        if (!row) return;

        // Don’t toggle if clicking a link inside the row
        if (ev.target.closest("a")) return;

        var details = row.nextElementSibling;
        if (!details || !details.classList || !details.classList.contains("row-details")) return;

        var open = details.classList.contains("open");
        if (open){
          details.classList.remove("open");
          row.setAttribute("aria-expanded", "false");
        } else {
          details.classList.add("open");
          row.setAttribute("aria-expanded", "true");
        }
      }, false);
    })();
  }

  ////////////////////////////////////////////////////////////////////////////
  // MOUNTING
  ////////////////////////////////////////////////////////////////////////////
  function findAnchors(){
    const btns = document.querySelector("#faction-crimes-root .buttonsContainer___aClaa");
    if (btns && btns.parentElement) return { parent: btns.parentElement, before: btns };
    const tabs = document.querySelector(".faction-tabs");
    if (tabs && tabs.parentElement)  return { parent: tabs.parentElement, before: tabs.nextSibling };
    const crimes = document.getElementById("faction-crimes") || document.getElementById("faction-crimes-root");
    if (crimes) return { parent: crimes, before: crimes.firstChild };
    return null;
  }

  function insertUI(){
    const anchors = findAnchors();
    if (!anchors) return false;
    const { parent, before } = anchors;
    const widget = buildWidget();
    if (!widget.isConnected) parent.insertBefore(widget, before || null);
    applyHeaderPolyfillIfNeeded();
    togglePanel(false);
    refreshApiUI();
    wireUp();
    return true;
  }

  function observe(){
    let booted = false;
    const tryBoot = () => { if (!booted && insertUI()) booted = true; };
    tryBoot();
    new MutationObserver(() => { if (!booted) tryBoot(); })
      .observe(document.documentElement, { childList:true, subtree:true });
  }

  function registerMenus(){
    const reg = (label, fn) => {
      if (typeof GM !== "undefined" && GM.registerMenuCommand) GM.registerMenuCommand(label, fn);
      else if (typeof GM_registerMenuCommand !== "undefined") GM_registerMenuCommand(label, fn);
    };
    reg("Set Torn API key", async () => {
      const cur = await getSetting("apiKey","");
      const v = prompt("Enter your Torn API key (requires Limited Access):", cur || "");
      if (v !== null) await setSetting("apiKey", v.trim());
      refreshApiUI();
    });
  }

  ////////////////////////////////////////////////////////////////////////////
  // BOOT
  ////////////////////////////////////////////////////////////////////////////
  (function boot(){
    injectStyle();
    registerMenus();
    observe();
  })();
})();