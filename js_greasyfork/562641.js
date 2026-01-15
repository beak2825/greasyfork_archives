// ==UserScript==
// @name         Torn Web Travel: All Countries Stock + Profit
// @namespace    grimsnecrosis.torn.web.travel.allcountries
// @version      1.0.7
// @description  WEB (Tampermonkey/Violentmonkey): Shows abroad stock across all countries (YATA export) with profit using Torn itemmarket average_price. Filter by country, sort (incl profit). Highlights top 10 rows if YATA data is stale (>5 minutes). (Updated column removed.)
// @author       Grimsnecrosis
// @match        https://www.torn.com/page.php?sid=travel*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @connect      yata.yt
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/562641/Torn%20Web%20Travel%3A%20All%20Countries%20Stock%20%2B%20Profit.user.js
// @updateURL https://update.greasyfork.org/scripts/562641/Torn%20Web%20Travel%3A%20All%20Countries%20Stock%20%2B%20Profit.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // Guard
  if (!/page\.php\?sid=travel/i.test(location.href)) return;

  const VERSION = "1.0.7";

  // WEB-specific storage namespace (do NOT share with PDA)
  const NS = "GTW_WEB_TRAVEL_ALLCOUNTRIES";
  const STATE_KEY = `${NS}_STATE`;
  const CACHE_KEY = `${NS}_CACHE`;
  const LS_API_KEY = "GTW_WEB_TORN_API_KEY";

  // Endpoints
  const YATA_EXPORT_URL = "https://yata.yt/api/v1/travel/export/";
  const ITEMMARKET_URL = (id, key) =>
    `https://api.torn.com/v2/market/${encodeURIComponent(id)}/itemmarket?key=${encodeURIComponent(key)}`;

  // Tunables
  const TTL_YATA_MS = 60 * 1000;        // 1 minute cache for YATA payload
  const TTL_AVG_MS = 30 * 60 * 1000;    // 30 minutes avg cache
  const MAX_IN_FLIGHT = 2;
  const MAX_VISIBLE_FETCH = 250;

  // Stale highlight behavior (top N rows)
  const STALE_MINUTES = 5;
  const STALE_TOP_N = 10;

  // Country map (YATA keys)
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

  // Names you provided (lowercase match)
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
   * Styles
   ***********************/
  GM_addStyle(`
    #gtw-panel {
      margin: 12px 0 14px;
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
    #gtw-panel * { color: rgba(255,255,255,0.95); }

    .gtw-head { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px; }
    .gtw-title { font-weight:900; font-size:13px; letter-spacing:0.2px; }

    .gtw-actions { display:flex; gap:8px; flex-wrap:wrap; }
    .gtw-btn{
      padding:6px 10px;
      border-radius:8px;
      border:1px solid rgba(255,255,255,0.22);
      background:rgba(255,255,255,0.10);
      cursor:pointer;
      font-size:12px;
    }
    .gtw-btn:hover{ background:rgba(255,255,255,0.14); }

    .gtw-controls{
      display:flex; flex-wrap:wrap; gap:8px 12px; align-items:center;
      margin-bottom:8px; font-size:12px;
    }
    .gtw-controls select{
      margin-left:6px; padding:4px 6px; border-radius:8px;
      border:1px solid rgba(255,255,255,0.22);
      background:rgba(0,0,0,0.45);
    }
    .gtw-controls input[type="number"]{
      width:84px; margin-left:6px; padding:4px 6px; border-radius:8px;
      border:1px solid rgba(255,255,255,0.22);
      background:rgba(0,0,0,0.45);
    }
    .gtw-meta{ margin-left:auto; opacity:0.92; font-size:11px; line-height:1.2; white-space:nowrap; }

    .gtw-tablewrap{
      overflow-x:auto;
      border:1px solid rgba(255,255,255,0.14);
      border-radius:10px;
      background:rgba(0,0,0,0.55);
    }
    .gtw-table{ width:100%; border-collapse:collapse; font-size:12px; }
    .gtw-table thead th{
      position:sticky; top:0; z-index:2;
      background:rgba(0,0,0,0.85);
      border-bottom:1px solid rgba(255,255,255,0.16);
    }
    .gtw-table th, .gtw-table td{
      padding:7px 9px;
      border-bottom:1px solid rgba(255,255,255,0.10);
      white-space:nowrap;
      vertical-align:top;
    }
    .gtw-table th{ text-align:left; opacity:0.95; font-weight:900; }
    .gtw-table td.num{ text-align:right; font-variant-numeric: tabular-nums; }
    .gtw-table tbody tr:nth-child(odd){ background:rgba(255,255,255,0.04); }
    .gtw-loading{ padding:12px 9px !important; opacity:0.92; }

    /* Profit colors */
    .gtw-profit-pos { color: #7CFF9B !important; font-weight: 900; }
    .gtw-profit-neg { color: #FF6B6B !important; font-weight: 900; }
    .gtw-profit-zero { color: rgba(255,255,255,0.85) !important; font-weight: 800; }
    .gtw-profit-unk { color: rgba(255,255,255,0.70) !important; font-weight: 700; }

    /* Name category colors */
    .gtw-name-plushie { color: #8FD1FF !important; font-weight: 900; }
    .gtw-name-flower  { color: #FFB3D9 !important; font-weight: 900; }
    .gtw-name-xanax   { color: #FFE58F !important; font-weight: 900; }

    /* Stock spacing */
    #gtw-panel .gtw-table th.gtw-col-stock,
    #gtw-panel .gtw-table td.gtw-col-stock {
      min-width: 110px !important;
      padding-left: 12px !important;
      padding-right: 12px !important;
    }

    /* Best row highlight */
    .gtw-best-row { outline: 2px solid rgba(255,255,255,0.22); background: rgba(255,255,255,0.10) !important; }

    /* Stale top-N highlight (YATA update older than 5 min) */
    .gtw-stale-top {
      background: rgba(255, 190, 70, 0.18) !important;
      outline: 1px solid rgba(255, 190, 70, 0.28);
    }

    /* Item cell */
    .gtw-itemcell{ display:flex; flex-direction:column; gap:2px; max-width:340px; }
    .gtw-itemname{ font-weight:900; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .gtw-itemid{ font-size:11px; opacity:0.80; }
  `);

  /***********************
   * Utilities
   ***********************/
  const esc = (s) => String(s)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  const fmtMoney = (n) => (typeof n === "number" && Number.isFinite(n)) ? "$" + Math.round(n).toLocaleString() : "…";
  const fmtProfit = (n) => {
    if (typeof n !== "number" || !Number.isFinite(n)) return "…";
    const sign = n >= 0 ? "+$" : "-$";
    return sign + Math.abs(Math.round(n)).toLocaleString();
  };

  const profitClass = (profit) => {
    if (typeof profit !== "number" || !Number.isFinite(profit)) return "gtw-profit-unk";
    if (profit > 0) return "gtw-profit-pos";
    if (profit < 0) return "gtw-profit-neg";
    return "gtw-profit-zero";
  };

  const nameClass = (name) => {
    const n = (name || "").trim().toLowerCase();
    if (!n) return "";
    if (n.includes("xanax")) return "gtw-name-xanax";
    if (FLOWERS.has(n) || n.includes("flower")) return "gtw-name-flower";
    if (PLUSHIES.has(n) || n.includes("plushie")) return "gtw-name-plushie";
    return "";
  };

  function loadJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
    catch { return fallback; }
  }
  function saveJSON(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }

  function getApiKey() {
    const k = localStorage.getItem(LS_API_KEY);
    return (k && k.trim()) ? k.trim() : null;
  }
  function setApiKeyInteractive() {
    const current = getApiKey() || "";
    const next = prompt("Enter your Torn API key (WEB script):", current);
    if (next === null) return;
    const t = String(next).trim();
    if (!t) return alert("No key saved.");
    localStorage.setItem(LS_API_KEY, t);
    alert("API key saved for WEB script.");
  }

  // Stale check (accept seconds or ms)
  function isStaleUpdate(tsAny) {
    const t = Number(tsAny);
    if (!Number.isFinite(t) || t <= 0) return false;
    const nowMs = Date.now();
    const tsMs = t > 1e12 ? t : (t * 1000);
    const ageMs = Math.max(0, nowMs - tsMs);
    return ageMs > (STALE_MINUTES * 60 * 1000);
  }

  function applyStaleTopHighlight(panel) {
    const rows = Array.from(panel.querySelectorAll("#gtw-tbody tr[data-item-id]"));
    rows.forEach(tr => tr.classList.remove("gtw-stale-top"));
    if (!rows.length) return;

    const firstUpdated = Number(rows[0].dataset.updated || 0);
    if (!isStaleUpdate(firstUpdated)) return;

    rows.slice(0, STALE_TOP_N).forEach(tr => tr.classList.add("gtw-stale-top"));
  }

  /***********************
   * Cache
   ***********************/
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
   * State
   ***********************/
  function defaultState() {
    return {
      version: VERSION,
      country: "ALL",
      sortBy: "profit",
      sortDir: "desc",
      hideZero: false,
      limit: 200,
      autoSortOnCountry: true
    };
  }
  function getState() { return { ...defaultState(), ...(loadJSON(STATE_KEY, null) || {}) }; }
  function setState(patch) {
    const next = { ...getState(), ...patch, version: VERSION };
    saveJSON(STATE_KEY, next);
    return next;
  }

  /***********************
   * HTTP (WEB)
   ***********************/
  function httpGetJson(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: { "Accept": "application/json" },
        onload: (r) => {
          try { resolve(JSON.parse(r.responseText)); }
          catch { reject(new Error("Non-JSON response")); }
        },
        onerror: () => reject(new Error("Network error")),
        ontimeout: () => reject(new Error("Request timeout")),
        timeout: 20000,
      });
    });
  }

  /***********************
   * Avg queue throttle
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
      finally { inFlight--; setTimeout(pump, 0); }
    })();
  }

  async function fetchAvgPrice(itemId) {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Missing API key");
    const cached = cacheGetAvg(itemId);
    if (typeof cached === "number") return cached;

    const data = await httpGetJson(ITEMMARKET_URL(itemId, apiKey));
    const avg = data?.itemmarket?.item?.average_price;
    if (typeof avg !== "number") throw new Error("average_price missing");
    cacheSetAvg(itemId, avg);
    return avg;
  }

  /***********************
   * YATA normalize
   ***********************/
  function normalizeYataExport(payload) {
    const out = [];
    const rootStocks = payload?.stocks;
    if (!rootStocks || typeof rootStocks !== "object") return out;

    for (const [countryKey, countryObj] of Object.entries(rootStocks)) {
      const country = COUNTRY_MAP[countryKey] || String(countryKey).toUpperCase();
      const updated = Number(countryObj?.update || 0);
      const items = countryObj?.stocks;
      if (!Array.isArray(items)) continue;

      for (const it of items) {
        const id = Number(it?.id);
        if (!Number.isFinite(id)) continue;
        out.push({
          country,
          id,
          name: String(it?.name || ""),
          qty: Number.isFinite(Number(it?.quantity)) ? Number(it.quantity) : 0,
          cost: Number(it?.cost) || 0,
          updated
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
   * Panel placement (WEB)
   ***********************/
  function ensurePanel() {
    let panel = document.querySelector("#gtw-panel");
    if (panel) return panel;

    panel = document.createElement("div");
    panel.id = "gtw-panel";
    panel.innerHTML = `
      <div class="gtw-head">
        <div class="gtw-title">Travel Stock + Profit (All Countries) <span style="opacity:.85">v${esc(VERSION)}</span></div>
        <div class="gtw-actions">
          <button class="gtw-btn" id="gtw-refresh">Refresh</button>
          <button class="gtw-btn" id="gtw-setkey">Set API Key</button>
        </div>
      </div>

      <div class="gtw-controls">
        <label>Country: <select id="gtw-country"></select></label>
        <label>Sort:
          <select id="gtw-sortby">
            <option value="profit">Profit (avg)</option>
            <option value="avg">Avg Price</option>
            <option value="cost">Abroad Cost</option>
            <option value="qty">Stock</option>
            <option value="country">Country</option>
            <option value="id">Item ID</option>
          </select>
        </label>
        <label>Dir:
          <select id="gtw-sortdir">
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </label>

        <label style="display:flex;gap:6px;align-items:center;">
          <input id="gtw-hidezero" type="checkbox" />
          Hide 0 stock
        </label>

        <label style="display:flex;gap:6px;align-items:center;">
          <input id="gtw-autosort" type="checkbox" />
          Auto-sort on country
        </label>

        <label>Limit: <input id="gtw-limit" type="number" min="50" max="500" step="50" /></label>
        <div class="gtw-meta" id="gtw-meta"></div>
      </div>

      <div class="gtw-tablewrap">
        <table class="gtw-table">
          <thead>
            <tr>
              <th>Country</th>
              <th>Item</th>
              <th class="num">Cost</th>
              <th class="num">Avg</th>
              <th class="num">Profit</th>
              <th class="num gtw-col-stock">Stock</th>
            </tr>
          </thead>
          <tbody id="gtw-tbody">
            <tr><td colspan="6" class="gtw-loading">Loading…</td></tr>
          </tbody>
        </table>
      </div>
    `;

    wirePanel(panel);
    return panel;
  }

  function placePanel(panel) {
    if (panel.dataset.placed === "1") return true;

    const infoAnchor =
      document.querySelector(".content-wrapper .info-msg") ||
      document.querySelector(".content-wrapper .msg") ||
      Array.from(document.querySelectorAll("div,section")).find(el =>
        (el.textContent || "").includes("Welcome to the Torn City travel agency")
      );

    if (infoAnchor && infoAnchor.parentElement) {
      infoAnchor.insertAdjacentElement("afterend", panel);
      panel.dataset.placed = "1";
      return true;
    }

    const wrappers = [
      document.querySelector(".content-wrapper"),
      document.querySelector("#mainContainer"),
      document.querySelector("#body"),
      document.querySelector("#content"),
      document.querySelector(".content"),
      document.querySelector("main"),
    ].filter(Boolean);

    for (const w of wrappers) {
      w.insertAdjacentElement("afterbegin", panel);
      panel.dataset.placed = "1";
      return true;
    }

    return false;
  }

  function setMeta(panel, msg) {
    const el = panel.querySelector("#gtw-meta");
    if (el) el.textContent = msg;
  }
  function setLoading(panel, msg) {
    const tbody = panel.querySelector("#gtw-tbody");
    tbody.innerHTML = `<tr><td colspan="6" class="gtw-loading">${esc(msg)}</td></tr>`;
  }

  function renderCountries(selectEl, rows, selected) {
    const countries = Array.from(new Set(rows.map(r => r.country).filter(Boolean))).sort((a,b)=>a.localeCompare(b));
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
    return rows.slice().sort((a,b) => {
      const ka = keyFn(a);
      const kb = keyFn(b);
      if (typeof ka === "string" || typeof kb === "string") return String(ka).localeCompare(String(kb)) * dir;
      return (Number(ka) - Number(kb)) * dir;
    });
  }

  function highlightBestProfitRow(panel) {
    panel.querySelectorAll("tr.gtw-best-row").forEach(tr => tr.classList.remove("gtw-best-row"));
    const rows = Array.from(panel.querySelectorAll("#gtw-tbody tr[data-item-id]"));
    let best = null;

    for (const tr of rows) {
      const cell = tr.querySelector("td[data-role='profit']");
      if (!cell) continue;
      const raw = Number(cell.dataset.profit);
      if (!Number.isFinite(raw)) continue;
      if (!best || raw > best.profit) best = { tr, profit: raw };
    }
    if (best) best.tr.classList.add("gtw-best-row");
  }

  /***********************
   * Main render
   ***********************/
  let lastRenderToken = 0;

  async function render(forceYata = false) {
    const st = getState();
    const token = ++lastRenderToken;

    const panel = ensurePanel();
    if (!placePanel(panel)) return;

    setLoading(panel, "Loading abroad stock…");
    setMeta(panel, "Fetching YATA export…");

    let rows;
    try {
      rows = await getYataRows(forceYata);
    } catch (e) {
      setLoading(panel, `YATA export error: ${String(e)}`);
      setMeta(panel, "YATA fetch failed");
      return;
    }

    // decorate with cached avg/profit
    const base = rows.map(r => {
      const avg = cacheGetAvg(r.id);
      const profit = (typeof avg === "number") ? (avg - r.cost) : null;
      return { ...r, avg: (typeof avg === "number") ? avg : null, profit };
    });

    const countrySel = panel.querySelector("#gtw-country");
    renderCountries(countrySel, base, st.country);

    let filtered = base;
    const country = countrySel.value;
    if (country !== "ALL") filtered = filtered.filter(x => x.country === country);
    if (st.hideZero) filtered = filtered.filter(x => (x.qty || 0) > 0);

    const limit = Math.max(50, Math.min(500, Number(st.limit) || 200));
    filtered = filtered.slice(0, limit);
    filtered = sortRows(filtered, st.sortBy, st.sortDir);

    const tbody = panel.querySelector("#gtw-tbody");
    tbody.innerHTML = "";

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="gtw-loading">No rows to show (filters may be hiding everything).</td></tr>`;
      setMeta(panel, `Rows: 0 • Avg queue: ${q.length} • In-flight: ${inFlight}`);
      return;
    }

    for (const r of filtered) {
      const itemName = (r.name && r.name.trim()) ? r.name.trim() : "Unknown item";
      const nClass = nameClass(itemName);

      // Stock integer display
      const stockText = Number.isFinite(r.qty) ? Math.trunc(r.qty).toLocaleString("en-US") : "-";

      const pClass = profitClass(r.profit);
      const profitData = (typeof r.profit === "number" && Number.isFinite(r.profit)) ? r.profit : "";

      const tr = document.createElement("tr");
      tr.dataset.itemId = String(r.id);
      tr.dataset.updated = String(r.updated || 0); // for stale highlight
      tr.innerHTML = `
        <td>${esc(r.country)}</td>
        <td>
          <div class="gtw-itemcell">
            <div class="gtw-itemname ${esc(nClass)}">${esc(itemName)}</div>
            <div class="gtw-itemid">#${esc(String(r.id))}</div>
          </div>
        </td>
        <td class="num">${fmtMoney(r.cost)}</td>
        <td class="num">${(typeof r.avg === "number") ? fmtMoney(r.avg) : "…"}</td>
        <td class="num ${pClass}" data-role="profit" data-profit="${esc(String(profitData))}">
          ${(typeof r.profit === "number") ? fmtProfit(r.profit) : "…"}
        </td>
        <td class="num gtw-col-stock">${esc(stockText)}</td>
      `;
      tbody.appendChild(tr);
    }

    setMeta(panel, `Rows: ${filtered.length.toLocaleString()} • Avg queue: ${q.length} • In-flight: ${inFlight}`);

    // Best profit highlight (single best row)
    highlightBestProfitRow(panel);

    // Stale top-10 highlight (based on YATA update age)
    applyStaleTopHighlight(panel);

    // Average fetching if sorting by avg/profit
    const needsAvg = (st.sortBy === "profit" || st.sortBy === "avg");
    if (!needsAvg) return;

    const apiKey = getApiKey();
    const toFetch = filtered
      .slice(0, MAX_VISIBLE_FETCH)
      .map(r => r.id)
      .filter(id => typeof cacheGetAvg(id) !== "number");

    if (!toFetch.length) return;

    if (!apiKey) {
      setMeta(panel, "Set your Torn API key (WEB) to load avg prices (Set API Key button).");
      return;
    }

    setMeta(panel, `Loading average prices… (${toFetch.length} needed)`);

    let completed = 0;

    for (const itemId of toFetch) {
      enqueue(async () => ({ itemId, avg: await fetchAvgPrice(itemId) }))
        .then(({ itemId, avg }) => {
          if (token !== lastRenderToken) return;
          completed++;

          const rowEl = panel.querySelector(`tr[data-item-id="${CSS.escape(String(itemId))}"]`);
          if (!rowEl) return;

          const tds = rowEl.querySelectorAll("td");
          const costText = tds[2]?.textContent || "";
          const cost = Number(costText.replace(/[^0-9]/g, "")) || 0;

          const profit = avg - cost;

          if (tds[3]) tds[3].textContent = fmtMoney(avg);
          if (tds[4]) {
            tds[4].textContent = fmtProfit(profit);
            tds[4].classList.remove("gtw-profit-pos", "gtw-profit-neg", "gtw-profit-zero", "gtw-profit-unk");
            tds[4].classList.add(profitClass(profit));
            tds[4].dataset.profit = String(profit);
          }

          // Re-apply highlights after updates
          highlightBestProfitRow(panel);
          applyStaleTopHighlight(panel);

          setMeta(panel, `Loading average prices… ${completed}/${toFetch.length} • Queue: ${q.length} • In-flight: ${inFlight}`);
        })
        .catch(() => {
          if (token !== lastRenderToken) return;
          completed++;
          setMeta(panel, `Loading average prices… ${completed}/${toFetch.length} • (some errors)`);
        });
    }
  }

  /***********************
   * Wire controls
   ***********************/
  function wirePanel(panel) {
    const st = getState();

    const countrySel = panel.querySelector("#gtw-country");
    const sortBySel = panel.querySelector("#gtw-sortby");
    const sortDirSel = panel.querySelector("#gtw-sortdir");
    const hideZero = panel.querySelector("#gtw-hidezero");
    const autoSort = panel.querySelector("#gtw-autosort");
    const limitEl = panel.querySelector("#gtw-limit");

    sortBySel.value = st.sortBy;
    sortDirSel.value = st.sortDir;
    hideZero.checked = !!st.hideZero;
    autoSort.checked = !!st.autoSortOnCountry;
    limitEl.value = String(st.limit || 200);

    panel.querySelector("#gtw-refresh").addEventListener("click", () => render(true).catch(() => {}));
    panel.querySelector("#gtw-setkey").addEventListener("click", () => setApiKeyInteractive());

    countrySel.addEventListener("change", (e) => {
      const next = setState({ country: e.target.value });
      if (next.autoSortOnCountry && e.target.value !== "ALL") {
        setState({ sortBy: "profit", sortDir: "desc" });
        sortBySel.value = "profit";
        sortDirSel.value = "desc";
      }
      render(false).catch(() => {});
    });

    sortBySel.addEventListener("change", (e) => { setState({ sortBy: e.target.value }); render(false).catch(() => {}); });
    sortDirSel.addEventListener("change", (e) => { setState({ sortDir: e.target.value }); render(false).catch(() => {}); });
    hideZero.addEventListener("change", (e) => { setState({ hideZero: e.target.checked }); render(false).catch(() => {}); });
    autoSort.addEventListener("change", (e) => { setState({ autoSortOnCountry: e.target.checked }); });
    limitEl.addEventListener("change", (e) => { setState({ limit: Number(e.target.value) || 200 }); render(false).catch(() => {}); });
  }

  /***********************
   * Boot (SPA-ish safety)
   ***********************/
  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      render(false).catch(() => {});
    }, 400);
  };

  const mo = new MutationObserver(schedule);
  mo.observe(document.documentElement, { childList: true, subtree: true });

  schedule();
  setTimeout(schedule, 1200);
})();
