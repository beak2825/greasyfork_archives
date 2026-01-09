// ==UserScript==
// @name         Torn Travel Shop Profit
// @namespace    torn.abroad.profit
// @version      2.1.0
// @description  Shows profit (market value - abroad shop price) in travel shops on TornPDA mobile.
// @author       Grimsnecrosis
// @match        https://www.torn.com/page.php?sid=travel*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/561937/Torn%20Travel%20Shop%20Profit.user.js
// @updateURL https://update.greasyfork.org/scripts/561937/Torn%20Travel%20Shop%20Profit.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /********************
   * PDA API KEY HOOK *
   ********************/
  // TornPDA replaces this with your key and shows a key icon in the script manager.
  // If it stays as ###PDA-APIKEY###, we fall back to a one-time prompt + localStorage.
  const PDA_KEY_PLACEHOLDER = "###PDA-APIKEY###";

  function getApiKey() {
    let key = PDA_KEY_PLACEHOLDER;

    // If TornPDA injected a real key, it won't start with "#"
    if (key && key[0] !== "#") return key.trim();

    // Fallback prompt (non-PDA or if injection not set)
    const stored = localStorage.getItem("TPDA_TRAVEL_PROFIT_KEY");
    if (stored) return stored;

    const entered = prompt("Enter Torn API key (stored locally for travel profit):");
    if (!entered) return null;
    localStorage.setItem("TPDA_TRAVEL_PROFIT_KEY", entered.trim());
    return entered.trim();
  }

  /****************
   * HTTP WRAPPER *
   ****************/
  // Prefer TornPDA helpers if they exist; otherwise use fetch.
  function httpGet(url) {
    if (typeof PDA_httpGet === "function") {
      return PDA_httpGet(url).then((res) => {
        // TornPDA usually returns { responseText, status } shape to onload handlers,
        // but PDA_httpGet often returns plain text. Handle both.
        if (typeof res === "string") return res;
        if (res && typeof res.responseText === "string") return res.responseText;
        return JSON.stringify(res);
      });
    }
    return fetch(url, { credentials: "omit" }).then((r) => r.text());
  }

  async function apiGetJson(url) {
    const txt = await httpGet(url);
    try {
      return JSON.parse(txt);
    } catch {
      return null;
    }
  }

  /*********
   * CACHE *
   *********/
  const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes
  const cacheGet = (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || typeof obj.t !== "number") return null;
      if (Date.now() - obj.t > CACHE_TTL_MS) return null;
      return obj.d;
    } catch {
      return null;
    }
  };
  const cacheSet = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data }));
    } catch {}
  };

  /********************
   * PRICE UTILITIES  *
   ********************/
  const moneyToInt = (s) => parseInt(String(s).replace(/[^0-9]/g, ""), 10) || 0;
  const fmtProfit = (n) => `${n >= 0 ? "+$" : "-$"}${Math.abs(n).toLocaleString()}`;

  /***********************
   * ITEM MAP + AVG PRICE *
   ***********************/
  async function getItemNameToIdMap(apiKey) {
    const ck = "TPDA_TRAVEL_ITEMMAP_V1";
    const cached = cacheGet(ck);
    if (cached) return cached;

    // Torn API v2 items list
    const url = `https://api.torn.com/v2/torn/items?key=${encodeURIComponent(apiKey)}`;
    const data = await apiGetJson(url);

    const map = {};
    const items = data?.items || [];
    for (const it of items) {
      if (it?.name && it?.id) map[it.name] = it.id;
    }

    cacheSet(ck, map);
    return map;
  }

  async function getAveragePrice(apiKey, itemId) {
    const ck = `TPDA_TRAVEL_AVG_${itemId}`;
    const cached = cacheGet(ck);
    if (typeof cached === "number") return cached;

    const url = `https://api.torn.com/v2/market/${itemId}/itemmarket?key=${encodeURIComponent(apiKey)}`;
    const data = await apiGetJson(url);

    const avg = data?.itemmarket?.item?.average_price || 0;
    cacheSet(ck, avg);
    return avg;
  }

  /******************************
   * DOM: FIND THE TRAVEL TABLE *
   ******************************/
  // Your screenshot is a classic table. We find tables that have headers including: Name / Stock / Cost / Buy
  function findShopTables() {
    const tables = Array.from(document.querySelectorAll("table"));
    const matches = [];

    for (const t of tables) {
      const headerRow =
        t.querySelector("thead tr") ||
        t.querySelector("tr"); // fallback

      if (!headerRow) continue;

      const headers = Array.from(headerRow.querySelectorAll("th,td"))
        .map((x) => (x.textContent || "").trim().toLowerCase());

      const hasName = headers.includes("name");
      const hasStock = headers.includes("stock");
      const hasCost = headers.includes("cost");
      const hasBuy = headers.includes("buy");

      if (hasName && hasStock && hasCost && hasBuy) {
        matches.push(t);
      }
    }
    return matches;
  }

  function getHeaderIndexes(table) {
    const headerRow = table.querySelector("thead tr") || table.querySelector("tr");
    const cells = Array.from(headerRow.querySelectorAll("th,td"));
    const headers = cells.map((x) => (x.textContent || "").trim().toLowerCase());
    return {
      nameIdx: headers.indexOf("name"),
      costIdx: headers.indexOf("cost"),
    };
  }

  function ensureProfitHeader(table, costIdx) {
    const headerRow = table.querySelector("thead tr") || table.querySelector("tr");
    if (!headerRow) return;

    // If already inserted, stop
    if (headerRow.querySelector(".tpda-profit-th")) return;

    const th = document.createElement("th");
    th.className = "tpda-profit-th";
    th.textContent = "Profit";

    // Insert right after Cost column
    const cells = Array.from(headerRow.querySelectorAll("th,td"));
    const costCell = cells[costIdx];
    if (costCell && costCell.parentNode) {
      costCell.insertAdjacentElement("afterend", th);
    } else {
      headerRow.appendChild(th);
    }
  }

  function ensureProfitCell(row, costIdx) {
    // skip header rows
    const tds = Array.from(row.querySelectorAll("td"));
    if (!tds.length) return null;

    // already inserted?
    const existing = row.querySelector(".tpda-profit-td");
    if (existing) return existing;

    const td = document.createElement("td");
    td.className = "tpda-profit-td";
    td.style.fontWeight = "700";
    td.style.whiteSpace = "nowrap";

    const costCell = tds[costIdx];
    if (costCell) {
      costCell.insertAdjacentElement("afterend", td);
    } else {
      row.appendChild(td);
    }
    return td;
  }

  function getRowName(row, nameIdx) {
    const tds = Array.from(row.querySelectorAll("td"));
    const cell = tds[nameIdx];
    if (!cell) return null;

    // The “Name” cell usually includes just the item name text.
    // If it contains extra whitespace/newlines, clean it.
    const name = (cell.textContent || "").trim().split("\n")[0].trim();
    return name || null;
  }

  function getRowCost(row, costIdx) {
    const tds = Array.from(row.querySelectorAll("td"));
    const cell = tds[costIdx];
    if (!cell) return 0;
    return moneyToInt(cell.textContent);
  }

  /*********************
   * LIGHT REFRESH LOOP *
   *********************/
  let running = false;
  let lastSignature = "";

  function makeSignature(tables) {
    // A cheap way to detect changes so we don’t reprocess constantly
    let sig = "";
    for (const t of tables) {
      const rows = t.querySelectorAll("tbody tr").length || t.querySelectorAll("tr").length;
      sig += `|${rows}`;
    }
    return sig;
  }

  async function refreshOnce() {
    if (running) return;
    running = true;

    try {
      const tables = findShopTables();
      if (!tables.length) {
        running = false;
        return;
      }

      const sig = makeSignature(tables);
      if (sig === lastSignature) {
        running = false;
        return;
      }
      lastSignature = sig;

      const apiKey = getApiKey();
      if (!apiKey) {
        running = false;
        return;
      }

      const nameToId = await getItemNameToIdMap(apiKey);

      // Process each table
      for (const table of tables) {
        const { nameIdx, costIdx } = getHeaderIndexes(table);
        if (nameIdx < 0 || costIdx < 0) continue;

        ensureProfitHeader(table, costIdx);

        // Prefer tbody rows, fallback to all rows excluding header
        const bodyRows = Array.from(table.querySelectorAll("tbody tr"));
        const rows = bodyRows.length ? bodyRows : Array.from(table.querySelectorAll("tr")).slice(1);

        // VERY LOW CONCURRENCY: do them sequentially to keep PDA smooth
        for (const row of rows) {
          // Skip if row already has profit computed
          if (row.dataset.tpdaProfitDone === "1") continue;

          const name = getRowName(row, nameIdx);
          const cost = getRowCost(row, costIdx);
          if (!name) continue;

          const profitTd = ensureProfitCell(row, costIdx);
          if (!profitTd) continue;

          // mark early so we don’t loop on errors
          row.dataset.tpdaProfitDone = "1";
          profitTd.textContent = "…";

          const itemId = nameToId[name];
          if (!itemId) {
            profitTd.textContent = "N/A";
            profitTd.style.opacity = "0.7";
            continue;
          }

          try {
            const avg = await getAveragePrice(apiKey, itemId);
            const profit = avg - cost;

            profitTd.textContent = fmtProfit(profit);
            profitTd.style.color = profit >= 0 ? "#27ae60" : "#e74c3c";
            profitTd.title = `Avg: $${avg.toLocaleString()} | Cost: $${cost.toLocaleString()}`;
          } catch {
            profitTd.textContent = "ERR";
            profitTd.style.opacity = "0.7";
          }
        }
      }
    } finally {
      running = false;
    }
  }

  // Debounced polling (safe on PDA): checks for changes every 900ms
  setInterval(() => {
    refreshOnce();
  }, 900);

  // Also do a quick run on load
  refreshOnce();
})();