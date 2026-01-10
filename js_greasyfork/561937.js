// ==UserScript==
// @name         Travel Profit for TornPDA
// @namespace    torn.abroad.profit
// @version      2.6.5
// @description  Shows profit next to abroad shop prices (PDA-friendly key handling).
// @author       Grimsnecrosis
// @match        https://www.torn.com/*
// @match        https://www.torn.com/page.php?sid=travel*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/561937/Travel%20Profit%20for%20TornPDA.user.js
// @updateURL https://update.greasyfork.org/scripts/561937/Travel%20Profit%20for%20TornPDA.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /***********************
   * TornPDA Key Hook
   ***********************/
  const PDA_API_KEY = "###PDA-APIKEY###";
  const isPDA = () => !/^(###).+(###)$/.test(PDA_API_KEY);

  // If you're NOT in PDA, you can optionally store a key in localStorage under this name.
  const LS_KEY = "TPDA_TRAVEL_PROFIT_KEY";

  function getApiKey() {
    if (isPDA()) return PDA_API_KEY;
    const k = localStorage.getItem(LS_KEY);
    return (k && k.trim()) ? k.trim() : null;
  }

  /***********************
   * Styling
   ***********************/
  GM_addStyle(`
    .tpda-profit-pill {
      display: inline-flex;
      align-items: center;
      margin-left: 8px;
      padding: 1px 6px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      line-height: 1.4;
      opacity: 0.95;
      white-space: nowrap;
    }
    .tpda-profit-green { color: #0b7a2a; border: 1px solid rgba(11,122,42,0.35); }
    .tpda-profit-red   { color: #b11f1f; border: 1px solid rgba(177,31,31,0.35); }
    .tpda-profit-amber { color: #a05a00; border: 1px solid rgba(160,90,0,0.35); }
  `);

  /***********************
   * Cache + throttling
   ***********************/
  const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
  const MAX_IN_FLIGHT = 2;

  const memCache = new Map(); // itemId -> { t, avg }
  let inFlight = 0;
  const queue = [];

  function cacheGet(itemId) {
    const v = memCache.get(itemId);
    if (!v) return null;
    if (Date.now() - v.t > CACHE_TTL_MS) return null;
    return v.avg;
  }
  function cacheSet(itemId, avg) {
    memCache.set(itemId, { t: Date.now(), avg });
  }

  function moneyToInt(s) {
    return parseInt(String(s).replace(/[^0-9]/g, ""), 10) || 0;
  }
  function fmtProfit(n) {
    const sign = n >= 0 ? "+$" : "-$";
    return sign + Math.abs(n).toLocaleString();
  }

  /***********************
   * HTTP helpers (PDA or browser)
   ***********************/
  async function httpGetJson(url) {
    if (isPDA() && typeof window.PDA_httpGet === "function") {
      const res = await window.PDA_httpGet(url, {});
      if (!res || !res.responseText) throw new Error("No response from PDA_httpGet");
      return JSON.parse(res.responseText);
    }

    // Browser fallback (Tampermonkey)
    return await new Promise((resolve, reject) => {
      if (typeof GM_xmlhttpRequest !== "function") {
        reject(new Error("GM_xmlhttpRequest not available"));
        return;
      }
      GM_xmlhttpRequest({
        method: "GET",
        url,
        onload: (r) => {
          try {
            resolve(JSON.parse(r.responseText));
          } catch (e) {
            reject(e);
          }
        },
        onerror: reject,
      });
    });
  }

  async function fetchAvgPrice(apiKey, itemId) {
    const cached = cacheGet(itemId);
    if (typeof cached === "number") return cached;

    // Torn v2 itemmarket average price
    const url = `https://api.torn.com/v2/market/${encodeURIComponent(itemId)}/itemmarket?key=${encodeURIComponent(apiKey)}`;
    const data = await httpGetJson(url);
    const avg = data?.itemmarket?.item?.average_price;

    if (typeof avg !== "number") throw new Error("avg_price missing");
    cacheSet(itemId, avg);
    return avg;
  }

  function enqueue(task) {
    return new Promise((resolve, reject) => {
      queue.push({ task, resolve, reject });
      pumpQueue();
    });
  }

  async function pumpQueue() {
    if (inFlight >= MAX_IN_FLIGHT) return;
    const next = queue.shift();
    if (!next) return;

    inFlight++;
    try {
      const out = await next.task();
      next.resolve(out);
    } catch (e) {
      next.reject(e);
    } finally {
      inFlight--;
      // keep going
      setTimeout(pumpQueue, 0);
    }
  }

  /***********************
   * DOM discovery (works on PDA mobile + normal web)
   ***********************/
  function isTravelPage() {
    // Travel page is an SPA area; easiest check is URL contains sid=travel
    return /page\.php\?sid=travel/i.test(location.href);
  }

  function findRows() {
    // PDA mobile layout often uses hashed classnames like stockTableWrapper___
    const stockList = document.querySelectorAll("[class*='stockTableWrapper'] > li");
    if (stockList && stockList.length) return Array.from(stockList);

    // Fallback: older abroad shop list (.users-list > li)
    const old = document.querySelectorAll(".users-list > li");
    if (old && old.length) return Array.from(old);

    return [];
  }

  function extractItemIdFromRow(row) {
    // Look for an image and pull the first number from src/srcset
    const img = row.querySelector("img");
    const srcset = img?.getAttribute("srcset") || "";
    const src = img?.getAttribute("src") || "";

    const blob = (srcset.split(" ")[0] || src || "").trim();
    if (!blob) return null;

    // Common patterns: .../1234.png  or .../1234.webp
    const m = blob.match(/\/(\d{2,6})\.(png|jpg|jpeg|gif|webp)/i) || blob.match(/(\d{2,6})/);
    return m ? parseInt(m[1], 10) : null;
  }

  function extractCostFromRow(row) {
    // PDA/TornTools style often includes neededSpace___ for the price column
    const candidates = Array.from(row.querySelectorAll("[class*='neededSpace']"));
    for (const el of candidates) {
      const txt = el.textContent || "";
      const n = moneyToInt(txt);
      if (n > 0) return n;
    }

    // Fallback for older layout (.c-price)
    const cprice = row.querySelector(".c-price");
    if (cprice) {
      const n = moneyToInt(cprice.textContent || "");
      if (n > 0) return n;
    }

    // Last resort: find any "$" text inside row
    const anyTextEls = Array.from(row.querySelectorAll("span,div"));
    for (const el of anyTextEls) {
      const t = (el.textContent || "").trim();
      if (!t.includes("$")) continue;
      const n = moneyToInt(t);
      if (n > 0) return n;
    }

    return null;
  }

  function findNameAnchor(row) {
    // Prefer something “name-like”
    const preferred =
      row.querySelector("[class*='name']") ||
      row.querySelector(".details .name") ||
      row.querySelector(".details") ||
      row.querySelector("[class*='title']");

    if (preferred && (preferred.textContent || "").trim().length) return preferred;

    // fallback: first non-empty text element that isn't obviously numeric/currency
    const els = Array.from(row.querySelectorAll("span,div")).filter(e => {
      const t = (e.textContent || "").trim();
      if (!t) return false;
      if (t.includes("$")) return false;
      if (/^\d+$/.test(t)) return false;
      return t.length >= 3;
    });

    return els[0] || null;
  }

  function upsertProfitPill(nameEl, profit, tooltip) {
    let pill = nameEl.querySelector(":scope > .tpda-profit-pill");
    if (!pill) {
      pill = document.createElement("span");
      pill.className = "tpda-profit-pill tpda-profit-amber";
      nameEl.appendChild(pill);
    }

    pill.classList.remove("tpda-profit-green", "tpda-profit-red", "tpda-profit-amber");
    pill.classList.add(profit >= 0 ? "tpda-profit-green" : "tpda-profit-red");
    pill.textContent = fmtProfit(profit);
    pill.title = tooltip || "";
  }

  /***********************
   * Main render (debounced)
   ***********************/
  let scheduled = false;
  function scheduleRender() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
      scheduled = false;
      render().catch(() => {});
    }, 350);
  }

  async function render() {
    if (!isTravelPage()) return;

    const rows = findRows();
    if (!rows.length) return;

    const apiKey = getApiKey();
    if (!apiKey) {
      // In PDA you should ALWAYS have one; if not, do nothing (no popups)
      console.log("[Travel Profit PDA] No API key available.");
      return;
    }

    for (const row of rows) {
      // avoid rework
      if (row.dataset.tpdaProfitDone === "1") continue;

      const itemId = extractItemIdFromRow(row);
      const cost = extractCostFromRow(row);
      const nameEl = findNameAnchor(row);

      // If we can’t confidently place it, skip without marking done
      if (!nameEl || !itemId || !cost) continue;

      row.dataset.tpdaProfitDone = "1";
      upsertProfitPill(nameEl, 0, "Loading…");

      // queue API to avoid freezing
      enqueue(async () => {
        const avg = await fetchAvgPrice(apiKey, itemId);
        const profit = avg - cost;
        upsertProfitPill(nameEl, profit, `Avg: $${avg.toLocaleString()} | Cost: $${cost.toLocaleString()}`);
      }).catch((e) => {
        // show a subtle “?” instead of hard failing
        upsertProfitPill(nameEl, 0, `Error: ${String(e)}`);
        const pill = nameEl.querySelector(":scope > .tpda-profit-pill");
        if (pill) {
          pill.classList.remove("tpda-profit-green", "tpda-profit-red");
          pill.classList.add("tpda-profit-amber");
          pill.textContent = "?";
        }
      });
    }
  }

  /***********************
   * Boot
   ***********************/
  // Watch for SPA updates, but throttle heavily.
  const mo = new MutationObserver(() => scheduleRender());
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // Initial pass + one delayed pass (SPA often renders after a beat)
  scheduleRender();
  setTimeout(scheduleRender, 1200);
})();
