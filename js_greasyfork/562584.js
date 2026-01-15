// ==UserScript==
// @name         TornPDA Travel: All Countries Stock + Profit
// @namespace    grimsnecrosis.tpda.travel.allcountries
// @version      1.0.9
// @description  TornPDA-only: Shows abroad stock across all countries (YATA export) with profit using Torn itemmarket average_price. Filter by country + sort (incl profit). Panel anchored below welcome box and above travel tabs. Item names shown + improved readability + highlights best profit row + profit color coding + category-colored names (plushies/flowers/xanax). Updated column REMOVED; if YATA data is stale (>5 min) highlights TOP 10 rows.
// @author       Grimsnecrosis
// @match        https://www.torn.com/page.php?sid=travel*
// @run-at       document-end
// @grant        GM_addStyle
// @connect      api.torn.com
// @connect      yata.yt
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/562584/TornPDA%20Travel%3A%20All%20Countries%20Stock%20%2B%20Profit.user.js
// @updateURL https://update.greasyfork.org/scripts/562584/TornPDA%20Travel%3A%20All%20Countries%20Stock%20%2B%20Profit.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /***********************
   * TornPDA key hook
   ***********************/
  const PDA_API_KEY = "###PDA-APIKEY###";
  const isPDA = () => !/^(###).+(###)$/.test(PDA_API_KEY);
  if (!isPDA()) {
    console.log("[TPDA Travel Panel] Not running (not in TornPDA).");
    return;
  }
  const apiKey = PDA_API_KEY;

  /***********************
   * Guard
   ***********************/
  const isTravelPage = () => /page\.php\?sid=travel/i.test(location.href);
  if (!isTravelPage()) return;

  /***********************
   * Constants
   ***********************/
  const VERSION = "1.0.9";
  const NS = "GRIMS_TPDA_TRAVEL_PANEL_V1";
  const STATE_KEY = `${NS}_STATE`;
  const CACHE_KEY = `${NS}_CACHE`;

  const YATA_EXPORT_URL = "https://yata.yt/api/v1/travel/export/";
  const ITEMMARKET_URL = (itemId) =>
    `https://api.torn.com/v2/market/${encodeURIComponent(itemId)}/itemmarket?key=${encodeURIComponent(apiKey)}`;

  const MAX_IN_FLIGHT = 2;
  const QUEUE_TICK_MS = 0;

  const TTL_YATA_MS = 60 * 1000;          // 1 minute
  const TTL_AVG_MS = 30 * 60 * 1000;      // 30 minutes
  const MAX_VISIBLE_FETCH = 250;

  // Stale highlight (same behavior as WEB)
  const STALE_MINUTES = 5;
  const STALE_TOP_N = 10;

  // YATA country keys → display names
  const COUNTRY_MAP = {
    mex: "MEXICO",
    cay: "CAYMAN ISLANDS",
    can: "CANADA",
    haw: "HAWAII",
    uni: "UNITED KINGDOM",
    arg: "ARGENTINA",
    swi: "SWITZERLAND",
    jap: "JAPAN",
    chi: "CHINA",
    uae: "UAE",
    sou: "SOUTH AFRICA",
  };

  /***********************
   * Exact lists (from your screenshots)
   ***********************/
  const FLOWERS = new Set([
    "bunch of carnations","daffodil","bunch of flowers","funeral wreath","dozen roses",
    "bunch of black roses","single red rose","dahlia","edelweiss","crocus","white lily",
    "banana orchid","orchid","ceibo flower","heather","cherry blossom","african violet",
    "peony","tribulus omanense",
  ]);

  const PLUSHIES = new Set([
    "teddy bear plushie","kitten plushie","sheep plushie","wolverine plushie","stingray plushie",
    "chamois plushie","jaguar plushie","nessie plushie","red fox plushie","monkey plushie",
    "lion plushie","panda plushie","camel plushie",
  ]);

  /***********************
   * Styles (readability + colors)
   ***********************/
  GM_addStyle(`
    #gtp-panel {
      margin: 10px 0 14px;
      padding: 10px;
      border: 1px solid rgba(255,255,255,0.18);
      border-radius: 10px;
      background: rgba(0,0,0,0.72);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      color: rgba(255,255,255,0.95);
      font-family: inherit;
      text-shadow: 0 1px 0 rgba(0,0,0,0.55);
    }

    #gtp-panel * { color: rgba(255,255,255,0.95); }

    .gtp-head {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap: 10px;
      margin-bottom: 8px;
    }
    .gtp-title { font-weight: 900; font-size: 13px; letter-spacing: 0.2px; }
    .gtp-actions { display:flex; gap: 8px; flex-wrap: wrap; }

    .gtp-btn{
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.22);
      background: rgba(255,255,255,0.10);
      cursor:pointer;
      font-size: 12px;
    }
    .gtp-btn:hover{ background: rgba(255,255,255,0.14); }

    .gtp-controls{
      display:flex;
      flex-wrap: wrap;
      gap: 8px 12px;
      align-items:center;
      margin-bottom: 8px;
      font-size: 12px;
    }
    .gtp-controls select{
      margin-left: 6px;
      padding: 4px 6px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.22);
      background: rgba(0,0,0,0.45);
    }
    .gtp-controls input[type="number"]{
      width: 84px;
      margin-left: 6px;
      padding: 4px 6px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.22);
      background: rgba(0,0,0,0.45);
    }
    .gtp-meta{
      margin-left: auto;
      opacity: 0.92;
      font-size: 11px;
      line-height: 1.2;
      white-space: nowrap;
    }

    .gtp-tablewrap{
      overflow-x:auto;
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 10px;
      background: rgba(0,0,0,0.55);
    }

    .gtp-table{
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    .gtp-table thead th{
      position: sticky;
      top: 0;
      z-index: 2;
      background: rgba(0,0,0,0.85);
      border-bottom: 1px solid rgba(255,255,255,0.16);
    }

    .gtp-table th, .gtp-table td{
      padding: 7px 9px;
      border-bottom: 1px solid rgba(255,255,255,0.10);
      white-space: nowrap;
      vertical-align: top;
    }
    .gtp-table th{ text-align:left; opacity: 0.95; font-weight: 900; }
    .gtp-table td.num{ text-align:right; font-variant-numeric: tabular-nums; }

    .gtp-table tbody tr:nth-child(odd){
      background: rgba(255,255,255,0.04);
    }

    /* widen Stock column a bit */
    #gtp-panel .gtp-table th.gtp-col-stock,
    #gtp-panel .gtp-table td.gtp-col-stock {
      min-width: 110px !important;
      padding-left: 12px !important;
      padding-right: 12px !important;
    }

    .gtp-loading{ padding: 12px 9px !important; opacity: 0.92; }

    .gtp-note{ margin-top: 6px; font-size: 11px; opacity: 0.85; line-height: 1.35; }

    .gtp-pill{
      display:inline-flex;
      align-items:center;
      padding: 1px 6px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 900;
      border: 1px solid rgba(255,255,255,0.18);
      background: rgba(255,255,255,0.08);
      opacity: 0.98;
    }

    .gtp-itemcell{
      display:flex;
      flex-direction:column;
      gap: 2px;
      max-width: 240px;
    }
    .gtp-itemname{
      font-weight: 900;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .gtp-itemid{
      font-size: 11px;
      opacity: 0.80;
    }

    /* Best profit row highlight */
    .gtp-best-row {
      outline: 2px solid rgba(255,255,255,0.22);
      background: rgba(255,255,255,0.10) !important;
    }

    /* Stale top-N highlight */
    .gtp-stale-top {
      background: rgba(255, 190, 70, 0.18) !important;
      outline: 1px solid rgba(255, 190, 70, 0.28);
    }

    /* Profit color coding */
    .gtp-profit-pos { color: #7CFF9B !important; font-weight: 900; }
    .gtp-profit-neg { color: #FF6B6B !important; font-weight: 900; }
    .gtp-profit-zero { color: rgba(255,255,255,0.85) !important; font-weight: 800; }
    .gtp-profit-unk { color: rgba(255,255,255,0.70) !important; font-weight: 700; }

    /* Category-colored item names */
    .gtp-name-plushie { color: #8FD1FF !important; } /* plushies */
    .gtp-name-flower  { color: #FFB3D9 !important; } /* flowers */
    .gtp-name-xanax   { color: #FFE58F !important; } /* xanax */
  `);

  /***********************
   * Utilities
   ***********************/
  const esc = (s) => String(s)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  const moneyToInt = (s) => parseInt(String(s).replace(/[^0-9]/g, ""), 10) || 0;

  const fmtMoney = (n) => (typeof n === "number" && Number.isFinite(n)) ? "$" + Math.round(n).toLocaleString() : "…";

  const fmtProfit = (n) => {
    if (typeof n !== "number" || !Number.isFinite(n)) return "…";
    const sign = n >= 0 ? "+$" : "-$";
    return sign + Math.abs(Math.round(n)).toLocaleString();
  };

  function profitClass(profit) {
    if (typeof profit !== "number" || !Number.isFinite(profit)) return "gtp-profit-unk";
    if (profit > 0) return "gtp-profit-pos";
    if (profit < 0) return "gtp-profit-neg";
    return "gtp-profit-zero";
  }

  function getNameCategoryClass(name) {
    const n = (name || "").trim().toLowerCase();
    if (!n) return "";
    if (n.includes("xanax")) return "gtp-name-xanax";
    if (FLOWERS.has(n) || n.includes("flower")) return "gtp-name-flower";
    if (PLUSHIES.has(n) || n.includes("plushie")) return "gtp-name-plushie";
    return "";
  }

  function isStaleUpdateSeconds(tsSeconds) {
    const t = Number(tsSeconds);
    if (!Number.isFinite(t) || t <= 0) return false;
    const now = Math.floor(Date.now() / 1000);
    const diff = Math.max(0, now - t);
    return diff > (STALE_MINUTES * 60);
  }

  function applyStaleTopHighlight(panel) {
    const rows = Array.from(panel.querySelectorAll("#gtp-tbody tr[data-item-id]"));
    rows.forEach(tr => tr.classList.remove("gtp-stale-top"));
    if (!rows.length) return;

    const firstUpdated = Number(rows[0].dataset.updated || 0);
    if (!isStaleUpdateSeconds(firstUpdated)) return;

    rows.slice(0, STALE_TOP_N).forEach(tr => tr.classList.add("gtp-stale-top"));
  }

  /***********************
   * Local storage
   ***********************/
  function loadJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
    catch { return fallback; }
  }
  function saveJSON(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }

  function defaultState() {
    return {
      version: VERSION,
      country: "ALL",
      sortBy: "profit",
      sortDir: "desc",
      hideZero: false,
      limit: 200,
      autoSortOnCountry: true,
    };
  }
  function getState() { return { ...defaultState(), ...(loadJSON(STATE_KEY, null) || {}) }; }
  function setState(patch) {
    const next = { ...getState(), ...patch, version: VERSION };
    saveJSON(STATE_KEY, next);
    return next;
  }

  function getCache() {
    return loadJSON(CACHE_KEY, { yata: null, yataFetchedMs: 0, avgById: {} });
  }
  function setCache(patch) {
    const next = { ...getCache(), ...patch };
    saveJSON(CACHE_KEY, next);
    return next;
  }

  function cacheGetAvg(itemId) {
    const hit = getCache().avgById?.[String(itemId)];
    if (!hit) return null;
    if ((Date.now() - hit.tMs) > TTL_AVG_MS) return null;
    return hit.avg;
  }
  function cacheSetAvg(itemId, avg) {
    const c = getCache();
    c.avgById = c.avgById || {};
    c.avgById[String(itemId)] = { avg, tMs: Date.now() };
    saveJSON(CACHE_KEY, c);
  }

  /***********************
   * PDA HTTP
   ***********************/
  async function httpGetJson(url) {
    if (typeof window.PDA_httpGet !== "function") {
      throw new Error("PDA_httpGet not available (are you in TornPDA?)");
    }
    const res = await window.PDA_httpGet(url, {});
    if (!res || !res.responseText) throw new Error("No response from PDA_httpGet");
    return JSON.parse(res.responseText);
  }

  /***********************
   * Throttled queue for avg price calls
   ***********************/
  let inFlight = 0;
  const q = [];
  function enqueue(task) {
    return new Promise((resolve, reject) => {
      q.push({ task, resolve, reject });
      pump();
    });
  }
  function pump() {
    if (inFlight >= MAX_IN_FLIGHT) return;
    const next = q.shift();
    if (!next) return;

    inFlight++;
    (async () => {
      try { next.resolve(await next.task()); }
      catch (e) { next.reject(e); }
      finally { inFlight--; setTimeout(pump, QUEUE_TICK_MS); }
    })();
  }

  async function fetchAvgPrice(itemId) {
    const cached = cacheGetAvg(itemId);
    if (typeof cached === "number") return cached;

    const data = await httpGetJson(ITEMMARKET_URL(itemId));
    const avg = data?.itemmarket?.item?.average_price;
    if (typeof avg !== "number") throw new Error("average_price missing");
    cacheSetAvg(itemId, avg);
    return avg;
  }

  /***********************
   * YATA parsing
   ***********************/
  function normalizeYataExport(payload) {
    const out = [];
    const rootStocks = payload?.stocks;
    if (!rootStocks || typeof rootStocks !== "object") return out;

    for (const [countryKey, countryObj] of Object.entries(rootStocks)) {
      const displayCountry = COUNTRY_MAP[countryKey] || String(countryKey).toUpperCase();
      const updated = Number(countryObj?.update || 0);
      const items = countryObj?.stocks;
      if (!Array.isArray(items)) continue;

      for (const it of items) {
        if (!it) continue;
        const id = Number(it.id);
        if (!Number.isFinite(id)) continue;

        out.push({
          country: displayCountry,
          id,
          name: String(it.name || ""),
          quantity: Number.isFinite(Number(it.quantity)) ? Number(it.quantity) : 0,
          cost: Number(it.cost) || 0,
          updated, // seconds
        });
      }
    }
    return out;
  }

  async function getYataRows(force = false) {
    const cache = getCache();
    const now = Date.now();

    if (!force && cache.yata && cache.yataFetchedMs && (now - cache.yataFetchedMs) < TTL_YATA_MS) {
      return normalizeYataExport(cache.yata);
    }

    const yata = await httpGetJson(YATA_EXPORT_URL);
    setCache({ yata, yataFetchedMs: now });
    return normalizeYataExport(yata);
  }

  /***********************
   * Panel + placement
   ***********************/
  function ensurePanel() {
    let panel = document.querySelector("#gtp-panel");
    if (panel) return panel;

    panel = document.createElement("div");
    panel.id = "gtp-panel";
    panel.innerHTML = `
      <div class="gtp-head">
        <div class="gtp-title">Travel Stock + Profit (All Countries) <span class="gtp-pill">v${esc(VERSION)}</span></div>
        <div class="gtp-actions">
          <button class="gtp-btn" id="gtp-refresh">Refresh</button>
        </div>
      </div>

      <div class="gtp-controls">
        <label>Country: <select id="gtp-country"></select></label>

        <label>Sort:
          <select id="gtp-sortby">
            <option value="profit">Profit (avg)</option>
            <option value="avg">Avg Price</option>
            <option value="cost">Abroad Cost</option>
            <option value="qty">Stock</option>
            <option value="country">Country</option>
            <option value="id">Item ID</option>
          </select>
        </label>

        <label>Dir:
          <select id="gtp-sortdir">
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </label>

        <label style="display:flex;gap:6px;align-items:center;">
          <input id="gtp-hidezero" type="checkbox" />
          Hide 0 stock
        </label>

        <label style="display:flex;gap:6px;align-items:center;">
          <input id="gtp-autosort" type="checkbox" />
          Auto-sort on country
        </label>

        <label>Limit:
          <input id="gtp-limit" type="number" min="50" max="500" step="50" />
        </label>

        <div class="gtp-meta" id="gtp-meta"></div>
      </div>

      <div class="gtp-tablewrap">
        <table class="gtp-table">
          <thead>
            <tr>
              <th>Country</th>
              <th>Item</th>
              <th class="num">Cost</th>
              <th class="num">Avg</th>
              <th class="num">Profit</th>
              <th class="num gtp-col-stock">Stock</th>
            </tr>
          </thead>
          <tbody id="gtp-tbody">
            <tr><td colspan="6" class="gtp-loading">Loading…</td></tr>
          </tbody>
        </table>
      </div>

      <div class="gtp-note">
        Profit colors: <span class="gtp-profit-pos">green (+)</span>, <span class="gtp-profit-neg">red (-)</span>.
        Item names: <span class="gtp-name-plushie">plushies</span> / <span class="gtp-name-flower">flowers</span> / <span class="gtp-name-xanax">xanax</span>.
        If YATA stock data is stale (&gt; ${STALE_MINUTES} min), the top ${STALE_TOP_N} rows are highlighted.
      </div>
    `;

    wirePanel(panel);
    return panel;
  }

  function placePanelBetweenWelcomeAndTabs(panel) {
    if (panel.dataset.placed === "1") return true;

    const infoBox = Array.from(document.querySelectorAll("div, section"))
      .find(el => (el.textContent || "").includes("Welcome to the Torn City travel agency"));

    if (!infoBox) return false;

    infoBox.insertAdjacentElement("afterend", panel);
    panel.dataset.placed = "1";
    return true;
  }

  function setMeta(panel, msg) {
    const el = panel.querySelector("#gtp-meta");
    if (el) el.textContent = msg;
  }

  function setLoading(panel, msg) {
    const tbody = panel.querySelector("#gtp-tbody");
    tbody.innerHTML = `<tr><td colspan="6" class="gtp-loading">${esc(msg)}</td></tr>`;
  }

  function renderCountries(selectEl, rows, selected) {
    const countries = Array.from(new Set(rows.map(r => r.country).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b));

    selectEl.innerHTML = "";
    const optAll = document.createElement("option");
    optAll.value = "ALL";
    optAll.textContent = "All Countries";
    selectEl.appendChild(optAll);

    for (const c of countries) {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      selectEl.appendChild(opt);
    }

    selectEl.value = countries.includes(selected) ? selected : "ALL";
  }

  function sortRows(rows, sortBy, sortDir) {
    const dir = sortDir === "asc" ? 1 : -1;

    const keyFn = (r) => {
      switch (sortBy) {
        case "country": return r.country;
        case "id": return r.id;
        case "cost": return r.cost;
        case "qty": return r.qty;
        case "avg": return (typeof r.avg === "number") ? r.avg : -1;
        case "profit": return (typeof r.profit === "number") ? r.profit : -1;
        default: return (typeof r.profit === "number") ? r.profit : -1;
      }
    };

    return rows.slice().sort((a, b) => {
      const ka = keyFn(a);
      const kb = keyFn(b);

      if (typeof ka === "string" || typeof kb === "string") {
        return String(ka).localeCompare(String(kb)) * dir;
      }
      return (Number(ka) - Number(kb)) * dir;
    });
  }

  function highlightBestProfitRow(panel) {
    panel.querySelectorAll("tr.gtp-best-row").forEach(tr => tr.classList.remove("gtp-best-row"));

    const rows = Array.from(panel.querySelectorAll("#gtp-tbody tr[data-item-id]"));
    let best = null;

    for (const tr of rows) {
      const profitCell = tr.querySelector("td[data-role='profit']");
      if (!profitCell) continue;

      const raw = Number(profitCell.dataset.profit);
      if (!Number.isFinite(raw)) continue;

      if (!best || raw > best.profit) best = { tr, profit: raw };
    }

    if (best) best.tr.classList.add("gtp-best-row");
  }

  /***********************
   * Main render
   ***********************/
  let lastRenderToken = 0;

  async function render(forceYata = false) {
    const st = getState();
    const token = ++lastRenderToken;

    const panel = ensurePanel();
    placePanelBetweenWelcomeAndTabs(panel);

    setLoading(panel, "Loading abroad stock…");
    setMeta(panel, "Fetching YATA export…");

    let yataRows;
    try {
      yataRows = await getYataRows(forceYata);
    } catch (e) {
      setLoading(panel, `YATA export error: ${String(e)}`);
      setMeta(panel, "YATA fetch failed");
      return;
    }

    // Build base rows (includes names)
    const base = yataRows.map(r => {
      const cost = Number(r.cost) || 0;
      const qty = Number.isFinite(Number(r.quantity)) ? Number(r.quantity) : 0;

      const avg = cacheGetAvg(r.id);
      const profit = (typeof avg === "number") ? (avg - cost) : null;

      return {
        country: r.country,
        id: r.id,
        name: r.name || "",
        cost,
        qty,
        updated: Number(r.updated) || 0, // seconds
        avg: (typeof avg === "number") ? avg : null,
        profit,
      };
    });

    const countrySel = panel.querySelector("#gtp-country");
    renderCountries(countrySel, base, st.country);

    // Filter
    let filtered = base;

    const country = countrySel.value;
    if (country !== "ALL") filtered = filtered.filter(x => x.country === country);
    if (st.hideZero) filtered = filtered.filter(x => (x.qty || 0) > 0);

    // Limit + sort
    const limit = Math.max(50, Math.min(500, Number(st.limit) || 200));
    filtered = filtered.slice(0, limit);
    filtered = sortRows(filtered, st.sortBy, st.sortDir);

    // Render table
    const tbody = panel.querySelector("#gtp-tbody");
    tbody.innerHTML = "";

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="gtp-loading">No rows to show (filters may be hiding everything).</td></tr>`;
      setMeta(panel, `Rows: 0 • Avg queue: ${q.length} • In-flight: ${inFlight}`);
      return;
    }

    for (const r of filtered) {
      const tr = document.createElement("tr");
      tr.dataset.itemId = String(r.id);
      tr.dataset.updated = String(r.updated || 0); // for stale highlight

      const itemName = r.name && r.name.trim() ? r.name.trim() : "Unknown item";
      const nameCatClass = getNameCategoryClass(itemName);

      const pClass = profitClass(r.profit);
      const profitData = (typeof r.profit === "number" && Number.isFinite(r.profit)) ? r.profit : "";

      tr.innerHTML = `
        <td>${esc(r.country)}</td>
        <td>
          <div class="gtp-itemcell">
            <div class="gtp-itemname ${esc(nameCatClass)}">${esc(itemName)}</div>
            <div class="gtp-itemid">#${esc(String(r.id))}</div>
          </div>
        </td>
        <td class="num">${fmtMoney(r.cost)}</td>
        <td class="num">${(typeof r.avg === "number") ? fmtMoney(r.avg) : "…"}</td>
        <td class="num ${pClass}" data-role="profit" data-profit="${esc(String(profitData))}">
          ${(typeof r.profit === "number") ? fmtProfit(r.profit) : "…"}
        </td>
        <td class="num gtp-col-stock">${Number.isFinite(r.qty) ? Math.trunc(r.qty).toLocaleString("en-US") : "-"}</td>
      `;
      tbody.appendChild(tr);
    }

    setMeta(panel, `Rows: ${filtered.length.toLocaleString()} • Avg queue: ${q.length} • In-flight: ${inFlight}`);

    // Highlight best row if profits exist
    highlightBestProfitRow(panel);

    // Stale top-N highlight (if YATA update older than threshold)
    applyStaleTopHighlight(panel);

    // Avg fetching if needed
    const needsAvg = (st.sortBy === "profit" || st.sortBy === "avg");
    if (!needsAvg) return;

    const toFetch = filtered
      .slice(0, MAX_VISIBLE_FETCH)
      .map(r => r.id)
      .filter(id => typeof cacheGetAvg(id) !== "number");

    if (!toFetch.length) return;

    setMeta(panel, `Loading average prices… (${toFetch.length} needed)`);
    let completed = 0;

    for (const itemId of toFetch) {
      enqueue(async () => {
        const avg = await fetchAvgPrice(itemId);
        return { itemId, avg };
      }).then(({ itemId, avg }) => {
        if (token !== lastRenderToken) return;

        completed++;

        const rowEl = panel.querySelector(`tr[data-item-id="${CSS.escape(String(itemId))}"]`);
        if (rowEl) {
          const tds = rowEl.querySelectorAll("td");
          const cost = moneyToInt(tds[2]?.textContent || "0");
          const profit = avg - cost;

          if (tds[3]) tds[3].textContent = fmtMoney(avg);
          if (tds[4]) {
            tds[4].textContent = fmtProfit(profit);
            tds[4].classList.remove("gtp-profit-pos", "gtp-profit-neg", "gtp-profit-zero", "gtp-profit-unk");
            tds[4].classList.add(profitClass(profit));
            tds[4].dataset.profit = String(profit);
          }
        }

        // Re-highlight as profits fill in
        highlightBestProfitRow(panel);
        applyStaleTopHighlight(panel);

        setMeta(panel, `Loading avg prices… ${completed}/${toFetch.length} • Queue: ${q.length} • In-flight: ${inFlight}`);
      }).catch(() => {
        if (token !== lastRenderToken) return;
        completed++;
        setMeta(panel, `Loading avg prices… ${completed}/${toFetch.length} • (some errors)`);
      });
    }
  }

  /***********************
   * Panel wiring
   ***********************/
  function wirePanel(panel) {
    const st = getState();

    const countrySel = panel.querySelector("#gtp-country");
    const sortBySel = panel.querySelector("#gtp-sortby");
    const sortDirSel = panel.querySelector("#gtp-sortdir");
    const hideZero = panel.querySelector("#gtp-hidezero");
    const autoSort = panel.querySelector("#gtp-autosort");
    const limitEl = panel.querySelector("#gtp-limit");
    const refreshBtn = panel.querySelector("#gtp-refresh");

    sortBySel.value = st.sortBy;
    sortDirSel.value = st.sortDir;
    hideZero.checked = !!st.hideZero;
    autoSort.checked = !!st.autoSortOnCountry;
    limitEl.value = String(st.limit || 200);

    countrySel.addEventListener("change", (e) => {
      const next = setState({ country: e.target.value });
      if (next.autoSortOnCountry && e.target.value !== "ALL") {
        setState({ sortBy: "profit", sortDir: "desc" });
      }
      render(false).catch(() => {});
    });

    sortBySel.addEventListener("change", (e) => { setState({ sortBy: e.target.value }); render(false).catch(() => {}); });
    sortDirSel.addEventListener("change", (e) => { setState({ sortDir: e.target.value }); render(false).catch(() => {}); });
    hideZero.addEventListener("change", (e) => { setState({ hideZero: e.target.checked }); render(false).catch(() => {}); });
    autoSort.addEventListener("change", (e) => { setState({ autoSortOnCountry: e.target.checked }); });

    limitEl.addEventListener("change", (e) => {
      setState({ limit: Number(e.target.value) || 200 });
      render(false).catch(() => {});
    });

    refreshBtn.addEventListener("click", () => { render(true).catch(() => {}); });
  }

  /***********************
   * Boot (SPA-safe)
   ***********************/
  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      if (!isTravelPage()) return;

      const panel = ensurePanel();
      placePanelBetweenWelcomeAndTabs(panel);
      render(false).catch((e) => console.log("[TPDA Travel Panel] render error", e));
    }, 350);
  }

  const mo = new MutationObserver(schedule);
  mo.observe(document.documentElement, { childList: true, subtree: true });

  schedule();
  setTimeout(schedule, 1200);
})();
