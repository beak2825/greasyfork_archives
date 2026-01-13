// ==UserScript==
// @name         Torn City Finder (iOS Key Prompt + Fixed Clicks & Highlighting)
// @namespace    https://torn.com/
// @version      1.6.4
// @description  iOS-safe API key prompt + optional settings button. Fixed z-index for mobile clicks and persistent highlighting.
// @match        https://www.torn.com/city.php*
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562309/Torn%20City%20Finder%20%28iOS%20Key%20Prompt%20%2B%20Fixed%20Clicks%20%20Highlighting%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562309/Torn%20City%20Finder%20%28iOS%20Key%20Prompt%20%2B%20Fixed%20Clicks%20%20Highlighting%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const API_KEY_STORAGE = "tt_shared_api_key";
  const ITEM_DATA_STORAGE = "tt_shared_item_data";
  const SYNC_TIME_STORAGE = "tt_shared_sync_time";

  const getCache = () => {
    try {
      return JSON.parse(localStorage.getItem(ITEM_DATA_STORAGE) || "{}");
    } catch {
      return {};
    }
  };

  let itemCache = getCache();

  // ---------- Key handling (this is what was missing on iPhone) ----------
  function getApiKey() {
    return (localStorage.getItem(API_KEY_STORAGE) || "").trim();
  }

  function setApiKey(key) {
    const k = (key || "").trim();
    if (!k) return false;
    localStorage.setItem(API_KEY_STORAGE, k);
    return true;
  }

  function promptForKeyIfMissing() {
    const existing = getApiKey();
    if (existing) return existing;

    // iOS userscript managers can suppress prompt() until a user gesture.
    // So we also inject a button into the page for setting the key.
    injectKeyBanner();

    // Try prompt once anyway (works on some setups)
    const entered = window.prompt("Enter your Torn API key (will be saved on this device):", "");
    if (setApiKey(entered)) return getApiKey();

    return "";
  }

  function clearApiKey() {
    localStorage.removeItem(API_KEY_STORAGE);
  }

  function injectKeyBanner() {
    if (document.getElementById("tt-api-banner")) return;

    const banner = document.createElement("div");
    banner.id = "tt-api-banner";
    banner.innerHTML = `
      <div class="tt-api-inner">
        <div class="tt-api-title">Torn City Finder</div>
        <div class="tt-api-text">API key not set. Tap to add it.</div>
        <div class="tt-api-actions">
          <button class="tt-api-btn" id="tt-set-key">Set API Key</button>
          <button class="tt-api-btn tt-api-btn-muted" id="tt-clear-key">Clear</button>
        </div>
      </div>
    `;

    // Prefer a stable top anchor
    const anchor = document.querySelector("#tab-menu") || document.querySelector(".content-wrapper") || document.body;
    anchor.parentNode.insertBefore(banner, anchor);

    document.getElementById("tt-set-key").addEventListener("click", () => {
      const entered = window.prompt("Paste your Torn API key:", getApiKey());
      if (setApiKey(entered)) {
        banner.querySelector(".tt-api-text").textContent = "API key saved. Syncing…";
        fetchItemDataV2(true);
        setTimeout(() => banner.remove(), 1200);
      } else {
        banner.querySelector(".tt-api-text").textContent = "No key saved. Please try again.";
      }
    });

    document.getElementById("tt-clear-key").addEventListener("click", () => {
      clearApiKey();
      banner.querySelector(".tt-api-text").textContent = "API key cleared.";
    });
  }

  // ---------- XHR helper (GM_xmlhttpRequest fallback) ----------
  function gmGet(url, onload, onerror) {
    if (typeof GM_xmlhttpRequest === "function") {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        onload,
        onerror: onerror || function () {},
      });
      return true;
    }
    return false;
  }

  // ---------- 1. API SYNC (00:00 UTC) ----------
  async function fetchItemDataV2(force = false) {
    const key = getApiKey();
    if (!key) {
      if (force) promptForKeyIfMissing();
      return;
    }

    const url = `https://api.torn.com/v2/torn/items?sort=ASC&key=${encodeURIComponent(key)}`;

    const ok = gmGet(
      url,
      function (response) {
        try {
          const data = JSON.parse(response.responseText);

          // If Torn returns an error (bad key), show banner again.
          if (data && data.error) {
            injectKeyBanner();
            const banner = document.getElementById("tt-api-banner");
            if (banner) banner.querySelector(".tt-api-text").textContent = `API error: ${data.error.error || "Unknown"}`;
            return;
          }

          // v2 format: data.items (array)
          if (data.items) {
            const mappedData = {};
            data.items.forEach((item) => {
              mappedData[item.id] = {
                name: item.name,
                market_price: item.value?.market_price || 0,
                type: item.type,
                effect: item.effect || "",
              };
            });

            localStorage.setItem(ITEM_DATA_STORAGE, JSON.stringify(mappedData));
            localStorage.setItem(SYNC_TIME_STORAGE, Date.now().toString());
            itemCache = mappedData;
          } else {
            // If API shape differs, don’t hard-fail; keep cache.
            log("Unexpected items payload", data);
          }
        } catch (e) {
          console.error("Sync Error", e);
        }
      },
      function (err) {
        console.error("GM request error", err);
        injectKeyBanner();
        const banner = document.getElementById("tt-api-banner");
        if (banner) banner.querySelector(".tt-api-text").textContent = "Could not reach Torn API. Check userscript permissions.";
      }
    );

    if (!ok) {
      // If GM_xmlhttpRequest isn't available, prompt user (iOS tool misconfigured)
      injectKeyBanner();
      const banner = document.getElementById("tt-api-banner");
      if (banner) banner.querySelector(".tt-api-text").textContent = "GM_xmlhttpRequest not available on this device.";
    }
  }

  function checkAutoSync() {
    const key = promptForKeyIfMissing();
    if (!key) return;

    const lastSync = parseInt(localStorage.getItem(SYNC_TIME_STORAGE) || "0", 10);
    const now = new Date();
    const lastMidnightUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

    if (lastSync < lastMidnightUTC) fetchItemDataV2(false);
  }

  // ---------- 2. UI ENGINE (Fixed Clicks) ----------
  function runCityFinder() {
    if (document.getElementById("tt-city-panel-v2")) return;

    const anchor = document.querySelector("#tab-menu") || document.querySelector(".content-wrapper");
    if (!anchor) return;

    const markers = document.querySelectorAll("#map .leaflet-marker-icon[src*='/images/items/']");
    const foundItems = [];

    markers.forEach((marker) => {
      const id = marker.src.match(/\/items\/(\d+)\//)?.[1];
      if (!id) return;

      marker.classList.add("tt-city-target");
      marker.dataset.id = id;

      // Clickability
      marker.style.zIndex = "9999";
      marker.style.pointerEvents = "auto";

      const info = itemCache[id] || { name: `Item #${id}`, market_price: 0 };
      const existing = foundItems.find((i) => i.id === id);
      if (existing) existing.count++;
      else foundItems.push({ id, count: 1, name: info.name, value: info.market_price });
    });

    const panel = document.createElement("div");
    panel.id = "tt-city-panel-v2";

    const totalVal = foundItems.reduce((acc, it) => acc + it.value * it.count, 0);
    const totalCount = foundItems.reduce((acc, it) => acc + it.count, 0);

    panel.innerHTML = `
      <div class="tt-glass-header">
        <span class="tt-title">City Items (${totalCount})</span>
        <span class="tt-sync-tag">v2 Shared API</span>
        <button class="tt-settings" type="button" title="Set API Key">⚙</button>
      </div>
      <div class="tt-glass-value">City Value: <span class="tt-price">$${totalVal.toLocaleString()}</span></div>
      <div class="tt-glass-list">
        ${
          foundItems.length > 0
            ? foundItems
                .map(
                  (it) => `
            <span class="city-link" data-id="${it.id}">
              ${it.count > 1 ? `<span class="qty">${it.count}x</span> ` : ""}${it.name}
            </span>`
                )
                .join('<span class="divider">|</span>')
            : '<div style="opacity:0.5; font-size:12px;">No items detected.</div>'
        }
      </div>
    `;

    panel.querySelector(".tt-settings").addEventListener("click", () => {
      injectKeyBanner();
      const btn = document.getElementById("tt-set-key");
      if (btn) btn.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    // MOBILE CLICK & HIGHLIGHT LOGIC
    panel.querySelectorAll(".city-link").forEach((link) => {
      const id = link.dataset.id;

      link.onclick = (e) => {
        e.preventDefault();

        document.querySelectorAll(".tt-city-target").forEach((m) => m.classList.remove("tt-active-glow"));

        const targetMarker = document.querySelector(`.tt-city-target[data-id="${id}"]`);
        if (targetMarker) {
          targetMarker.classList.add("tt-active-glow");
          targetMarker.scrollIntoView({ behavior: "smooth", block: "center" });

          targetMarker.style.outline = "4px solid #00ff00";
          setTimeout(() => {
            targetMarker.style.outline = "none";
          }, 2000);
        }
      };
    });

    anchor.parentNode.insertBefore(panel, anchor);
  }

  // ---------- 3. STYLES ----------
  const style = document.createElement("style");
  style.textContent = `
    #tt-api-banner {
      margin: 10px 0;
      padding: 12px 15px;
      border-radius: 10px;
      color: #fff;
      background: rgba(0, 0, 0, 0.55);
      border: 1px solid rgba(255, 255, 255, 0.15);
      font-family: sans-serif;
      z-index: 999999;
      position: relative;
    }
    .tt-api-inner { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
    .tt-api-title { font-weight:800; color:#00ff00; }
    .tt-api-text { opacity:0.9; font-size:12px; }
    .tt-api-actions { display:flex; gap:8px; margin-left:auto; }
    .tt-api-btn {
      background: rgba(0,255,0,0.15);
      border: 1px solid rgba(0,255,0,0.35);
      color: #00ff00;
      font-weight: 800;
      padding: 6px 10px;
      border-radius: 8px;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .tt-api-btn-muted {
      background: rgba(255,255,255,0.08);
      border-color: rgba(255,255,255,0.2);
      color: #fff;
      font-weight: 700;
    }

    #tt-city-panel-v2 {
      margin: 10px 0; padding: 12px 15px; border-radius: 10px; color: #fff;
      background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.15); font-family: sans-serif;
    }
    .tt-glass-header { display:flex; align-items:center; gap:10px; }
    .tt-title { color: #00ff00; font-weight: 800; font-size: 14px; }
    .tt-sync-tag { margin-left:auto; opacity:0.75; font-size:12px; }
    .tt-settings {
      margin-left:6px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.2);
      color: #fff;
      border-radius: 8px;
      padding: 3px 8px;
      font-weight: 800;
      cursor: pointer;
    }
    .tt-price { color: #75a832; font-weight: 800; }
    .city-link { cursor: pointer; color: #00ff00; font-weight: 700; border-bottom: 1px dashed rgba(0,255,0,0.3); }
    .divider { margin: 0 8px; opacity: 0.2; }
    .qty { opacity: 0.9; }

    /* HIGHLIGHT FIXES */
    .tt-city-target {
      filter: drop-shadow(0 0 5px #00ff00) !important;
      border: 2px solid #00ff00 !important;
      border-radius: 50% !important;
    }
    .tt-active-glow {
      filter: brightness(2.5) drop-shadow(0 0 20px #00ff00) !important;
      transform: scale(2) !important;
      z-index: 999999 !important;
    }
  `;
  document.head.appendChild(style);

  // ---------- runtime ----------
  // This ensures iPhone sees a UI even if prompt() is blocked.
  promptForKeyIfMissing();
  checkAutoSync();
  setInterval(runCityFinder, 2000);
})();
