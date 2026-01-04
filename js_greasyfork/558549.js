// ==UserScript==
// @name         JFK Elims Hider
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  On competition pages (team list, revenge tab, etc.), hide rows for JFK family members (plus a specific extra ID). Uses the same stored Torn API key as the site and the JFK backend member list.
// @author       HuzGPT
// @match        https://www.torn.com/page.php?sid=competition*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      api.justferkillin.com
// @downloadURL https://update.greasyfork.org/scripts/558549/JFK%20Elims%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/558549/JFK%20Elims%20Hider.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const API_BASE = "https://api.justferkillin.com/api";
  const LS_KEY = "tornApiKey";
  const EXTRA_BLOCK_IDS = []; // always hide this player
  const FETCH_TTL_MS = 5 * 60 * 1000; // refresh block list every 5 min
  const DEBUG = false;

  let blockedIds = new Set(EXTRA_BLOCK_IDS);
  let lastFetchAt = 0;
  let mo = null;
  let pendingScan = null;

  const log = (...args) => DEBUG && console.log("[JFK competition filter]", ...args);

  function ensureApiKey() {
    let key = null;
    try {
      key = localStorage.getItem(LS_KEY);
    } catch (e) {
      log("localStorage unavailable", e);
    }
    if (!key) {
      key = prompt("Enter your Torn API key (same as the site uses):", "") || "";
      if (key) {
        try {
          localStorage.setItem(LS_KEY, key);
        } catch (e) {
          console.warn("[JFK competition filter] failed to save API key:", e);
        }
      }
    }
    return key;
  }

  function fetchBlockedIds() {
    const now = Date.now();
    if (now - lastFetchAt < FETCH_TTL_MS && blockedIds.size) {
      return Promise.resolve(blockedIds);
    }

    const key = ensureApiKey();
    const headers = { accept: "application/json" };
    if (key) headers.Authorization = `ApiKey ${key}`;

    // Reset to the forced-block list so stale caches don't keep old active IDs
    blockedIds = new Set(EXTRA_BLOCK_IDS);

    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `${API_BASE}/members/names?activeOnly=1`,
        headers,
        timeout: 15000,
        onload: (resp) => {
          try {
            const data = JSON.parse(resp.responseText || "{}");
            const map = data?.map || {};
            const ids = Object.keys(map)
              .map((s) => Number(s))
              .filter((n) => Number.isFinite(n));
            blockedIds = new Set([...ids, ...EXTRA_BLOCK_IDS]);
            lastFetchAt = now;
            log("Fetched blocked IDs:", blockedIds.size);
          } catch (e) {
            console.warn("[JFK competition filter] parse error", e);
          }
          resolve(blockedIds);
        },
        onerror: () => resolve(blockedIds),
        ontimeout: () => resolve(blockedIds),
      });
    });
  }

  function extractXid(root) {
    const a = root.querySelector('a[href*="XID="]');
    if (!a) return null;
    const href = a.getAttribute("href") || "";
    const m = href.match(/XID=(\d+)/i);
    return m ? Number(m[1]) : null;
  }

  function findRowForAnchor(el) {
    if (!el) return null;
    const row =
      el.closest("tr") ||
      el.closest(".teamRow___R3ZLF") ||
      el.closest("div[class*='teamRow']") ||
      el.closest("div[class*='row']") ||
      el.closest("li") ||
      el.closest("div[class*='item']");
    // Avoid touching chat UI or other overlays
    if (row && row.closest("[id*='chat'], [class*='chat']")) return null;
    return row;
  }

  function hideBlockedRows() {
    // Target any row-like element under the competition page that has a profile link.
    const anchors = document.querySelectorAll('a[href*="XID="]');
    if (!anchors.length) return;
    let hidden = 0;
    anchors.forEach((a) => {
      const row = findRowForAnchor(a);
      if (!row) return;
      const xid = extractXid(row);
      if (!xid) return;
      if (blockedIds.has(xid)) {
        row.style.display = "none";
        hidden += 1;
      }
    });
    if (hidden) log(`Hid ${hidden} blocked row(s).`);
  }

  async function scan() {
    await fetchBlockedIds();
    hideBlockedRows();
  }

  function scheduleScan() {
    if (pendingScan) cancelAnimationFrame(pendingScan);
    pendingScan = requestAnimationFrame(scan);
  }

  function startObserver() {
    if (mo) return;
    mo = new MutationObserver(scheduleScan);
    mo.observe(document.body, { childList: true, subtree: true });
  }

  function onRouteChange() {
    scheduleScan();
  }

  function boot() {
    startObserver();
    scheduleScan();
    window.addEventListener("hashchange", onRouteChange);
    window.addEventListener("popstate", onRouteChange);
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    boot();
  } else {
    window.addEventListener("DOMContentLoaded", boot);
  }
})();

